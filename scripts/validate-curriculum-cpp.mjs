import { lessons, problems } from "../lib/curriculum.ts";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
const directory = await mkdtemp(join(tmpdir(), "omi-curriculum-"));
const snippets = lessons.flatMap((l) =>
  l.sections.flatMap((s, i) =>
    s.code ? [{ id: `${l.id}-${i}`, code: s.code }] : [],
  ),
);
function run(cmd, args, input = "") {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] });
    let out = "",
      err = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    const timeout = setTimeout(() => p.kill("SIGKILL"), 15000);
    p.on("error", (e) => {
      clearTimeout(timeout);
      resolve({ status: -1, out, err: String(e) });
    });
    p.on("close", (status) => {
      clearTimeout(timeout);
      resolve({ status, out, err });
    });
    p.stdin.on("error", () => {});
    p.stdin.end(input);
  });
}
const failures = [];
let cursor = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (cursor < snippets.length) {
      const i = cursor++,
        s = snippets[i];
      const path = join(directory, `${i}.cpp`);
      await writeFile(path, s.code);
      const result = await run("clang++", [
        "-std=c++17",
        "-fsyntax-only",
        path,
      ]);
      if (result.status !== 0) failures.push({ id: s.id, error: result.err });
    }
  }),
);
let tests = 0;
for (const [i, p] of problems.entries()) {
  const path = join(directory, `problem-${i}.cpp`),
    bin = join(directory, `problem-${i}`);
  await writeFile(path, p.solution);
  const result = await run("clang++", ["-std=c++17", "-O1", path, "-o", bin]);
  if (result.status !== 0) {
    failures.push({ id: p.id, error: result.err });
    continue;
  }
  for (const t of p.tests) {
    const r = await run(bin, [], t.input);
    tests++;
    if (r.status !== 0 || r.out.trim() !== t.output.trim())
      failures.push({
        id: p.id,
        input: t.input,
        expected: t.output,
        actual: r.out,
        error: r.err,
      });
  }
}
await rm(directory, { recursive: true, force: true });
console.log(
  JSON.stringify(
    {
      examples: snippets.length,
      solutions: problems.length,
      testCases: tests,
      failures,
    },
    null,
    2,
  ),
);
if (failures.length) process.exitCode = 1;
