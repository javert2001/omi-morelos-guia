import type { CompilerResult } from "./compiler-contract.ts";

export type ExerciseCase = { input: string; output: string };
export type CaseResult = {
  index: number;
  status: "passed" | "wrong_answer" | CompilerResult["status"];
  expected: string;
  actual: string;
  input: string;
  execution: CompilerResult;
};

/** Compare tokens, tolerating only whitespace differences, never missing output. */
export function sameOutput(actual: string, expected: string): boolean {
  const tokens = (text: string) => text.trim().split(/\s+/).filter(Boolean);
  const a = tokens(actual), b = tokens(expected);
  return a.length === b.length && a.every((token, i) => token === b[i]);
}

export async function checkExerciseCases(
  code: string,
  cases: ExerciseCase[],
  execute: (input: { code: string; stdin: string }, signal: AbortSignal, onProgress?: (message: string) => void) => Promise<CompilerResult>,
  signal: AbortSignal,
  onCase: (result: CaseResult) => void,
  onProgress?: (message: string) => void,
): Promise<boolean> {
  if (!cases.length || signal.aborted) return false;
  for (const [index, test] of cases.entries()) {
    if (signal.aborted) return false;
    const execution = await execute({ code, stdin: test.input }, signal, message => onProgress?.(`Caso ${index + 1}/${cases.length} · ${message}`));
    if (signal.aborted) return false;
    const status = execution.status === "success"
      ? sameOutput(execution.stdout, test.output) ? "passed" : "wrong_answer"
      : execution.status;
    onCase({ index, status, expected: test.output, actual: execution.stdout, input: test.input, execution });
    if (status !== "passed") return false;
  }
  return !signal.aborted;
}
