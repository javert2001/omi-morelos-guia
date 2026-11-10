/* OMI Morelos browser C++ laboratory. See NOTICE for compiler/runtime licenses. */
importScripts('./runtime.js');

const CACHE_NAME = 'omi-cpp-648c4a8-bounded-v2';
const MAX_OUTPUT = 64 * 1024;
const encoder = new TextEncoder();
let modulesPromise;
let active = false;
let phase = 'loading';
let outputBytes = 0;
let displayBytes = 0;
let hitOutputLimit = false;
let lastOutputMessage = 0;
let stdout = '';
let stderr = '';
let compileOutput = '';
let decoders;
let started = 0;
class OutputLimit extends Error {}

const ASSETS = {"clang.gz.bin": {"bytes": 10529116, "uncompressedBytes": 31214474, "sha256": "18dc18c0f825de84c984703816980ab4060e45004792b25ced1135eb4887aade", "upstreamSha256": "2a466f0e990329d3230b869d04fc20803eae96a7feb3a3f6c93e25a77b8aed1d", "memoryLimitMiB": 256.0}, "lld.gz.bin": {"bytes": 6712813, "uncompressedBytes": 19490096, "sha256": "da4108d844656e647d7367a3c74506939a1648767ea2c2526a8ac6ffbe190657", "upstreamSha256": "36419ed202011765222098d7701218378b67f634d50f0a4625059ae2c9860f48", "memoryLimitMiB": 256.0}, "memfs.gz.bin": {"bytes": 18843, "uncompressedBytes": 345444, "sha256": "baa13f6e0b613b842a724f47a475a7aded8e630bb139d866b16b5de17ab9d701", "upstreamSha256": "2c72ee42bd9430029dda8c6bafc9f37143f6fe88d5f1ea950a70259ab748bcfe", "memoryLimitMiB": 64.0}, "sysroot.tar.gz.bin": {"bytes": 1814571, "uncompressedBytes": 9297920, "sha256": "2435a7b549af30c2be7ec249c405bc2e911ab0c6003012f0909ec3c131bff867", "upstreamSha256": "2435a7b549af30c2be7ec249c405bc2e911ab0c6003012f0909ec3c131bff867", "memoryLimitMiB": null}};
const totalDownloadBytes = Object.values(ASSETS).reduce((sum, asset) => sum + asset.bytes, 0);

function updatePhase(next, message) {
  phase = next;
  postMessage({ type: 'phase', phase, message });
}

async function loadTools() {
  let cache;
  try { cache = await caches.open(CACHE_NAME); } catch { /* Private browsing can deny persistent caching. */ }
  let downloaded = 0;
  let lastProgress = 0;
  const loaded = await Promise.all(Object.entries(ASSETS).map(async ([filename, expected]) => {
    const url = new URL(filename, self.location.href).href;
    let response = cache ? await cache.match(url).catch(() => undefined) : undefined;
    const fromCache = Boolean(response);
    if (!response) response = await fetch(url, { credentials: 'same-origin' });
    if (!response.ok) throw new Error('No se pudo descargar el compilador. Revisa tu conexión y vuelve a intentar.');
    const copy = !fromCache && cache ? response.clone() : null;
    const chunks = [];
    let length = 0;
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      length += value.byteLength;
      downloaded += value.byteLength;
      if (length > expected.bytes) throw new Error('El archivo del compilador está incompleto o dañado.');
      if (performance.now() - lastProgress > 150) {
        lastProgress = performance.now();
        postMessage({ type: 'progress', message: `Preparando compilador: ${Math.min(100, Math.round(downloaded / totalDownloadBytes * 100))} % · primera descarga de 19 MB` });
      }
    }
    if (length !== expected.bytes) throw new Error('El archivo del compilador está incompleto. Vuelve a intentar.');
    const packed = new Blob(chunks);
    const bytes = await new Response(packed.stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    if (bytes.byteLength !== expected.uncompressedBytes || hash !== expected.sha256) {
      if (cache) await cache.delete(url).catch(() => {});
      throw new Error('El archivo del compilador está dañado. Vuelve a intentar para descargarlo de nuevo.');
    }
    if (copy) await cache.put(url, copy).catch(() => {});
    return [filename, filename === 'sysroot.tar.gz.bin' ? bytes : await WebAssembly.compile(bytes)];
  }));
  return Object.fromEntries(loaded);
}

function appendText(text, fd) {
  let end = 0;
  for (const character of text) {
    const codepoint = character.codePointAt(0);
    const width = codepoint < 128 ? 1 : codepoint < 2048 ? 2 : codepoint < 65536 ? 3 : 4;
    if (displayBytes + width > MAX_OUTPUT) { hitOutputLimit = true; break; }
    displayBytes += width;
    end += character.length;
  }
  text = text.slice(0, end);
  if (phase === 'running') {
    if (fd === 2) stderr += text; else stdout += text;
  } else compileOutput += text;
  if (text && performance.now() - lastOutputMessage > 50) {
    lastOutputMessage = performance.now();
    postMessage({ type: 'output', stdout, stderr, compileOutput });
  }
}

function capture(bytes, fd) {
  const room = Math.max(0, MAX_OUTPUT - outputBytes);
  const kept = bytes.subarray(0, room);
  outputBytes += bytes.byteLength;
  const text = decoders[fd === 2 ? 2 : 1].decode(kept, { stream: true });
  appendText(text, fd);
  if (outputBytes > MAX_OUTPUT) hitOutputLimit = true;
  if (hitOutputLimit) throw new OutputLimit('Se alcanzó el límite de salida.');
}

function resetOutputDecoders() {
  decoders = { 1: new TextDecoder(), 2: new TextDecoder() };
  outputBytes = 0;
  displayBytes = 0;
  lastOutputMessage = -Infinity;
}

function flushOutputDecoders() {
  const out = decoders[1].decode();
  const err = decoders[2].decode();
  appendText(out, 1);
  appendText(err, 2);
}

async function filesystem(tools, withHeaders = false) {
  const fs = new API.Runtime.MemFS({
    compileStreaming: async () => tools['memfs.gz.bin'],
    memfsFilename: 'memfs',
    hostWrite: capture,
  });
  await fs.ready;
  if (withHeaders) {
    new API.Runtime.Tar(tools['sysroot.tar.gz.bin']).untar(fs);
    fs.addDirectory('include/bits');
    fs.addFile('include/bits/stdc++.h', encoder.encode(`#pragma once\n${[
      'algorithm', 'array', 'bitset', 'cassert', 'cctype', 'cerrno', 'cfloat', 'chrono', 'climits',
      'cmath', 'complex', 'cstdio', 'cstdlib', 'cstring', 'deque', 'exception', 'fstream',
      'functional', 'iomanip', 'ios', 'iostream', 'iterator', 'limits', 'list', 'map',
      'memory', 'numeric', 'queue', 'random', 'regex', 'set', 'sstream', 'stack',
      'stdexcept', 'string', 'tuple', 'type_traits', 'unordered_map', 'unordered_set',
      'utility', 'valarray', 'vector',
    ].map(header => `#include <${header}>`).join('\n')}\n`));
  }
  return fs;
}

async function runModule(module, fs, name, ...args) {
  const app = new API.Runtime.App(module, fs, name, ...args);
  await app.ready;
  try { app.exports._start(); return 0; }
  catch (error) {
    if (error instanceof API.Runtime.ProcExit) return error.code;
    throw error;
  }
}

function result(status, exitCode = null, message) {
  if (hitOutputLimit) { status = 'output_limit'; message = 'Se alcanzó el límite de salida de 64 KB. Revisa los ciclos que imprimen datos.'; }
  return { status, stdout, stderr, compileOutput, exitCode, durationMs: Math.round(performance.now() - started), ...(message ? { message } : {}) };
}

self.onmessage = async ({ data }) => {
  if (data.type !== 'run' || active) return;
  active = true;
  started = performance.now();
  stdout = stderr = compileOutput = '';
  hitOutputLimit = false;
  lastOutputMessage = 0;
  resetOutputDecoders();
  try {
    updatePhase('loading', 'Preparando el compilador en tu navegador…');
    if (!modulesPromise) modulesPromise = loadTools().catch(error => { modulesPromise = null; throw error; });
    const tools = await modulesPromise;
    updatePhase('compiling', 'Compilando C++17…');
    const fs = await filesystem(tools, true);
    fs.addFile('main.cpp', encoder.encode(data.code));
    const compileExit = await runModule(tools['clang.gz.bin'], fs, 'clang',
      '-cc1', '-emit-obj', '-isysroot', '/',
      '-internal-isystem', '/include/c++/v1', '-internal-isystem', '/include',
      '-internal-isystem', '/lib/clang/8.0.1/include',
      '-std=c++17', '-O0', '-Wall', '-Wextra', '-ferror-limit', '8',
      '-ftemplate-depth', '512', '-fconstexpr-steps', '1000000',
      '-fmessage-length', '0', '-o', 'main.o', '-x', 'c++', 'main.cpp');
    if (compileExit !== 0) {
      flushOutputDecoders();
      postMessage({ type: 'result', result: result('compile_error', compileExit, 'Revisa los mensajes del compilador y corrige tu código.') });
      return;
    }
    const linkExit = await runModule(tools['lld.gz.bin'], fs, 'wasm-ld',
      '--no-threads', '-z', 'stack-size=2097152', '--max-memory=134217728',
      '-Llib/wasm32-wasi', 'lib/wasm32-wasi/crt1.o', 'main.o',
      '-lc', '-lc++', '-lc++abi', 'lib/clang/8.0.1/lib/wasi/libclang_rt.builtins-wasm32.a', '-o', 'main.wasm');
    flushOutputDecoders();
    if (linkExit !== 0) {
      postMessage({ type: 'result', result: result('compile_error', linkExit, 'No se pudo crear el programa. Revisa los mensajes del compilador.') });
      return;
    }
    const module = await WebAssembly.compile(fs.getFileContents('main.wasm'));
    const programFs = await filesystem(tools);
    programFs.setStdinStr(data.stdin || '');
    resetOutputDecoders();
    updatePhase('running', 'Ejecutando tu programa…');
    const exitCode = await runModule(module, programFs, 'main');
    flushOutputDecoders();
    postMessage({ type: 'result', result: result(exitCode === 0 ? 'success' : 'runtime_error', exitCode,
      exitCode === 0 ? undefined : `Tu programa terminó con el código ${exitCode}.`) });
  } catch (error) {
    flushOutputDecoders();
    if (error instanceof OutputLimit) {
      postMessage({ type: 'result', result: result('output_limit', null, 'Tu programa produjo demasiada salida. Revisa si tienes un ciclo que imprime sin terminar.') });
    } else if (phase === 'loading') {
      postMessage({ type: 'result', result: result('unavailable', null, error.message || 'No se pudo preparar el compilador. Vuelve a intentar.') });
    } else {
      const message = phase === 'running'
        ? 'El programa se detuvo: revisa accesos fuera de un arreglo, divisiones entre cero o uso excesivo de memoria.'
        : 'No se pudo compilar este programa dentro de los límites del navegador.';
      const detail = String(error.message || error).slice(0, 1000);
      appendText(`\n${detail}\n`, 2);
      postMessage({ type: 'result', result: result(phase === 'running' ? 'runtime_error' : 'compile_error', null, message) });
    }
  } finally { active = false; }
};
