import test from "node:test";
import assert from "node:assert/strict";
import { sameOutput, checkExerciseCases, type CaseResult } from "../lib/exercise-judge.ts";
import type { CompilerResult } from "../lib/compiler-contract.ts";
const ok = (stdout: string): CompilerResult => ({ status: "success", stdout, stderr: "", compileOutput: "", exitCode: 0, durationMs: 1 });
test("judge ignores whitespace but preserves tokens, signs, order and extra output", () => {
  assert.ok(sameOutput("  1\n2 \r\n", "1 2"));
  for (const output of ["", "12", "2 1", "1 2 3", "1 -2", "1 2.0"])
    assert.equal(sameOutput(output, "1 2"), false, output);
});
test("judge runs all cases, reports actual output, and stops on first mismatch", async () => {
  const results: CaseResult[] = [];
  const passed = await checkExerciseCases("code", [{input:"one", output:"1"}, {input:"two",output:"2"}, {input:"three",output:"3"}], async ({stdin}) => ok(stdin === "one" ? "1\n" : "wrong"), new AbortController().signal, r => results.push(r));
  assert.equal(passed, false);
  assert.deepEqual(results.map(r=>r.status), ["passed", "wrong_answer"]);
  assert.equal(results[1].input, "two");
  assert.equal(results[1].actual, "wrong");
});
test("compile errors, cancellation, and empty suites cannot count as passing", async () => {
  const cases = [{input:"",output:"1"}];
  const controller = new AbortController();
  const results: CaseResult[] = [];
  assert.equal(await checkExerciseCases("x", cases, async () => ({...ok("1"), status:"compile_error"}), controller.signal, r=>results.push(r)), false);
  assert.equal(results[0].status, "compile_error");
  assert.equal(await checkExerciseCases("x", cases, async () => {controller.abort(); return ok("1");}, controller.signal, ()=>assert.fail("aborted output must be ignored")), false);
  assert.equal(await checkExerciseCases("x", [], async () => ok(""), new AbortController().signal, ()=>{}), false);
});
test("successful cases pass only after every execution completes", async () => {
  const results: CaseResult[] = [];
  assert.equal(await checkExerciseCases("x", [{input:"1",output:"1"},{input:"2",output:"2"}], async ({stdin})=>ok(stdin), new AbortController().signal, r=>results.push(r)), true);
  assert.equal(results.length, 2);
});
