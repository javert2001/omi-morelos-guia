import { spawn } from "node:child_process";
import { constants, rmSync } from "node:fs";
import { access, mkdir, mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { CompilerHealth, CompilerRequest, CompilerResult } from "../compiler-contract.ts";

const LIMITS = Object.freeze({
  codeBytes: 64 * 1024,
  inputBytes: 32 * 1024,
  outputBytes: 64 * 1024,
  compileMs: 15_000,
  runMs: 3_000,
});
const SANDBOX = "/usr/bin/sandbox-exec";
const TOOLCHAIN = "/Library/Developer/CommandLineTools";
const CLANG = `${TOOLCHAIN}/usr/bin/clang++`;
const SDK = `${TOOLCHAIN}/SDKs/MacOSX.sdk`;
const LANGUAGE = "C++17 · Apple Clang";
const EXPLANATION = "Compilador local aislado: sin red, sin acceso a tus archivos y sin subprocesos al ejecutar. Tiempo de ejecución: 3 s; salida: 64 KiB. La RAM no tiene un límite estricto.";
let active = false;
let initialization: Promise<Runtime> | undefined;

type Runtime = { launcher: string; directory: string; compiler: string; linker: string; sdk: string };
type ProcessResult = {
  stdout: string;
  stderr: string;
  code: number | null;
  signal: NodeJS.Signals | null;
  stopped?: "timeout" | "output_limit" | "cancelled";
  error?: Error;
};

// This trusted launcher is built independently of submitted code. Hard resource
// limits survive exec; a program cannot raise them again. Darwin's RSS/DATA
// limits are not a reliable total-memory boundary, so we do not advertise one.
const LAUNCHER = `#include <sys/resource.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
static void limit(int resource, rlim_t value) {
  struct rlimit r = { value, value };
  if (setrlimit(resource, &r) != 0) { perror("No se pudo aplicar un límite"); exit(125); }
}
int main(int argc, char **argv) {
  if (argc < 2) return 125;
  int compile = strcmp(argv[1], "compile") == 0;
  limit(RLIMIT_CORE, 0);
  limit(RLIMIT_CPU, compile ? 12 : 2);
  limit(RLIMIT_FSIZE, compile ? 16777216 : 1048576);
  limit(RLIMIT_NOFILE, compile ? 128 : 32);
  limit(RLIMIT_STACK, 8388608);
  if (argc == 2 && strcmp(argv[1], "probe") == 0) return 0;
  if (argc < 3) return 125;
  execv(argv[2], argv + 2);
  perror("No se pudo iniciar el proceso");
  return 125;
}
`;

// Portable subset of the GNU convenience header; GNU-specific extensions (for
// example __gnu_pbds) are deliberately not claimed to be supported by libc++.
const BITS = `#pragma once
#include <algorithm>
#include <array>
#include <bitset>
#include <cassert>
#include <cctype>
#include <cerrno>
#include <cfloat>
#include <chrono>
#include <climits>
#include <cmath>
#include <complex>
#include <cstddef>
#include <cstdint>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <deque>
#include <exception>
#include <fstream>
#include <functional>
#include <iomanip>
#include <ios>
#include <iostream>
#include <iterator>
#include <limits>
#include <list>
#include <map>
#include <memory>
#include <numeric>
#include <optional>
#include <queue>
#include <random>
#include <regex>
#include <set>
#include <sstream>
#include <stack>
#include <stdexcept>
#include <string>
#include <tuple>
#include <type_traits>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <variant>
#include <vector>
`;

function quote(value: string) {
  return `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

function profile(runtime: Runtime, directory: string, executable: string, compile: boolean) {
  const readable = ["/System/Library", "/usr/lib"];
  if (compile) readable.push(TOOLCHAIN, directory);
  const executablePaths = compile
    ? [runtime.launcher, CLANG, runtime.compiler, runtime.linker]
    : [runtime.launcher, executable];
  return `(version 1)
(deny default)
(import "dyld-support.sb")
(allow sysctl-read)
(allow file-read-metadata (literal "/") (literal "/private") (literal "/private/tmp") (literal "/Library") (literal "/Library/Developer") (literal "/usr") (literal "/dev"))
(allow file-read* ${readable.map(path => `(subpath ${quote(path)})`).join(" ")})
(allow file-read* (literal ${quote(runtime.launcher)}) (literal ${quote(executable)}))
(allow file-read* ${compile ? "file-write* " : ""}(subpath ${quote(compile ? directory : join(directory, "work"))}))
(deny file-write-flags)
(allow file-read* file-write-data (literal "/dev/null"))
(allow file-read-data (literal "/dev/urandom") (literal "/dev/random"))
(allow process-exec ${executablePaths.map(path => `(literal ${quote(path)})`).join(" ")})
${compile ? "(allow process-fork)" : ""}
`;
}

function boundedText(buffers: Buffer[], limit: number): string {
  // Invalid UTF-8 bytes expand to replacement characters. Cap the serialized
  // text as well as the original byte stream, without splitting a code point.
  const encoded = Buffer.from(Buffer.concat(buffers).toString("utf8"), "utf8");
  if (encoded.length <= limit) return encoded.toString("utf8");
  const decoder = new TextDecoder("utf-8", { fatal: true });
  for (let end = Math.min(limit, encoded.length); end >= Math.max(0, limit - 3); end -= 1) {
    try { return decoder.decode(encoded.subarray(0, end)); } catch { /* Complete the last code point. */ }
  }
  return "";
}

function processRun(command: string, args: string[], options: {
  cwd: string;
  timeout: number;
  input?: string;
  signal?: AbortSignal;
  outputLimit?: number;
}): Promise<ProcessResult> {
  return new Promise(resolve => {
    if (options.signal?.aborted) {
      resolve({ stdout: "", stderr: "", code: null, signal: null, stopped: "cancelled" });
      return;
    }
    let stopped: ProcessResult["stopped"];
    let spawnError: Error | undefined;
    let bytes = 0;
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    const child = spawn(command, args, {
      cwd: options.cwd,
      detached: true,
      shell: false,
      stdio: ["pipe", "pipe", "pipe"],
      env: { PATH: "/usr/bin:/bin", HOME: options.cwd, TMPDIR: options.cwd, LANG: "en_US.UTF-8", LC_ALL: "C", NODE_ENV: "production" },
    });
    const stop = (reason: NonNullable<ProcessResult["stopped"]>) => {
      if (stopped) return;
      stopped = reason;
      if (child.pid) {
        try { process.kill(-child.pid, "SIGKILL"); } catch { /* The group may already have exited. */ }
      }
    };
    const onAbort = () => stop("cancelled");
    options.signal?.addEventListener("abort", onAbort, { once: true });
    if (options.signal?.aborted) onAbort();
    const timer = setTimeout(() => stop("timeout"), options.timeout);
    const take = (target: Buffer[], data: Buffer) => {
      const remaining = (options.outputLimit ?? LIMITS.outputBytes) - bytes;
      if (remaining > 0) target.push(data.subarray(0, remaining));
      bytes += data.length;
      if (bytes > (options.outputLimit ?? LIMITS.outputBytes)) stop("output_limit");
    };
    child.stdout.on("data", (data: Buffer) => take(stdout, data));
    child.stderr.on("data", (data: Buffer) => take(stderr, data));
    // EPIPE is normal when a submission exits before consuming all of stdin.
    child.stdin.on("error", () => {});
    child.on("error", (error: Error) => { spawnError = error; });
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      options.signal?.removeEventListener("abort", onAbort);
      const maximum = options.outputLimit ?? LIMITS.outputBytes;
      const out = boundedText(stdout, maximum);
      const err = boundedText(stderr, maximum - Buffer.byteLength(out, "utf8"));
      const serializedBytes = Buffer.byteLength(Buffer.concat(stdout).toString("utf8"), "utf8") + Buffer.byteLength(Buffer.concat(stderr).toString("utf8"), "utf8");
      if (!stopped && serializedBytes > maximum) stopped = "output_limit";
      resolve({ stdout: out, stderr: err, code, signal, stopped, error: spawnError });
    });
    child.stdin.end(options.input ?? "");
  });
}

async function prepare(): Promise<Runtime> {
  if (process.platform !== "darwin") throw new Error("Esta instalación necesita macOS, Apple Clang y sandbox-exec para ejecutar C++ de forma aislada.");
  await Promise.all([access(SANDBOX, constants.X_OK), access(CLANG, constants.X_OK), access(SDK, constants.R_OK)]);
  const directory = await realpath(await mkdtemp(join(tmpdir(), "omi-compiler-runtime-")));
  try {
    const launcherSource = join(directory, "limits.c");
    const launcher = join(directory, "limits");
    await writeFile(launcherSource, LAUNCHER, { mode: 0o600 });
    const built = await processRun(CLANG, ["-x", "c", "-std=c11", "-isysroot", SDK, launcherSource, "-o", launcher], { cwd: directory, timeout: LIMITS.compileMs });
    if (built.code !== 0 || built.stopped || built.error) throw new Error("No se pudo preparar el aislamiento del compilador.");
    const runtime = { launcher, directory, compiler: await realpath(CLANG), linker: await realpath(`${TOOLCHAIN}/usr/bin/ld`), sdk: await realpath(SDK) };
    const work = join(directory, "work");
    await mkdir(work);
    // A runtime check also detects OS versions that disable sandbox-exec.
    const checked = await processRun(SANDBOX, ["-p", profile(runtime, directory, launcher, false), launcher, "probe"], { cwd: work, timeout: 2_000 });
    if (checked.code !== 0 || checked.stopped || checked.error) throw new Error("El aislamiento de macOS no está disponible. La ejecución permanece desactivada.");
    process.once("exit", () => { try { rmSync(directory, { recursive: true, force: true }); } catch { /* Process shutdown must finish. */ } });
    return runtime;
  } catch (error) {
    await rm(directory, { recursive: true, force: true });
    throw error;
  }
}

function runtime() {
  // Cache failure too: never switch to an unsandboxed path after a failure.
  initialization ??= prepare();
  return initialization;
}

export async function getCompilerStatus(): Promise<CompilerHealth> {
  try {
    await runtime();
    return { available: true, language: LANGUAGE, message: EXPLANATION, limits: { ...LIMITS } };
  } catch (error) {
    return { available: false, language: LANGUAGE, message: error instanceof Error ? error.message : "Compilador local no disponible.", limits: { ...LIMITS } };
  }
}

export async function executeCpp(request: CompilerRequest, signal?: AbortSignal): Promise<CompilerResult> {
  const started = performance.now();
  const result = (status: CompilerResult["status"], message?: string, extra: Partial<CompilerResult> = {}): CompilerResult => ({
    status, stdout: "", stderr: "", compileOutput: "", exitCode: null, durationMs: Math.round(performance.now() - started), ...(message ? { message } : {}), ...extra,
  });
  if (!request || typeof request.code !== "string" || !request.code.trim() || (request.stdin !== undefined && typeof request.stdin !== "string")) return result("invalid_request", "Escribe un programa C++ y una entrada de texto válida.");
  if (Buffer.byteLength(request.code, "utf8") > LIMITS.codeBytes || Buffer.byteLength(request.stdin ?? "", "utf8") > LIMITS.inputBytes) return result("invalid_request", "El código admite hasta 64 KiB y la entrada hasta 32 KiB.");
  if (signal?.aborted) return result("cancelled", "Ejecución cancelada.");
  if (active) return result("busy", "Ya hay un programa en ejecución. Inténtalo de nuevo cuando termine.");
  active = true;
  let directory: string | undefined;
  try {
    const environment = await runtime();
    if (signal?.aborted) return result("cancelled", "Ejecución cancelada.");
    directory = await realpath(await mkdtemp(join(tmpdir(), "omi-cpp-")));
    await Promise.all([mkdir(join(directory, "work")), mkdir(join(directory, "include", "bits"), { recursive: true })]);
    const source = join(directory, "main.cpp");
    const executable = join(directory, "program");
    await Promise.all([writeFile(source, request.code, { mode: 0o600 }), writeFile(join(directory, "include", "bits", "stdc++.h"), BITS, { mode: 0o600 })]);
    const compile = await processRun(SANDBOX, ["-p", profile(environment, directory, executable, true), environment.launcher, "compile", CLANG, "-std=c++17", "-O0", "-Wall", "-Wextra", "-ferror-limit=8", "-ftemplate-depth=512", "-fconstexpr-steps=1000000", "-isysroot", environment.sdk, "-I", join(directory, "include"), source, "-o", executable], { cwd: directory, timeout: LIMITS.compileMs, signal });
    const sanitize = (value: string) => value.replaceAll(directory!, "/programa").replaceAll(environment.directory, "/compilador");
    const compileOutput = sanitize(compile.stdout + compile.stderr);
    if (compile.stopped) return result(compile.stopped, compile.stopped === "timeout" ? "La compilación superó 15 segundos." : compile.stopped === "output_limit" ? "Los mensajes de compilación superaron 64 KiB." : "Ejecución cancelada.", { compileOutput });
    if (compile.error) return result("unavailable", "No se pudo iniciar el compilador aislado.");
    if (compile.code !== 0) return result("compile_error", "Revisa los mensajes del compilador.", { compileOutput, exitCode: compile.code });
    const run = await processRun(SANDBOX, ["-p", profile(environment, directory, executable, false), environment.launcher, "run", executable], { cwd: join(directory, "work"), timeout: LIMITS.runMs, input: request.stdin, signal });
    const extra = { compileOutput, stdout: sanitize(run.stdout), stderr: sanitize(run.stderr), exitCode: run.code };
    if (run.stopped) return result(run.stopped, run.stopped === "timeout" ? "El programa superó 3 segundos." : run.stopped === "output_limit" ? "La salida del programa superó 64 KiB." : "Ejecución cancelada.", extra);
    if (run.error) return result("unavailable", "No se pudo iniciar el programa aislado.", extra);
    if (run.signal === "SIGKILL" || run.signal === "SIGXCPU") return result("timeout", "El programa alcanzó el límite de CPU (2 segundos).", extra);
    if (run.code !== 0) return result("runtime_error", run.signal ? `El programa se detuvo por ${run.signal}.` : "El programa terminó con un código distinto de cero.", extra);
    return result("success", undefined, extra);
  } catch (error) {
    return result("unavailable", error instanceof Error ? error.message : "Compilador local no disponible.");
  } finally {
    try {
      if (directory) await rm(directory, { recursive: true, force: true });
    } catch {
      console.warn("No se pudo limpiar un directorio temporal del compilador.");
    } finally {
      active = false;
    }
  }
}
