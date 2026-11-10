import { lessons, problems } from '../lib/curriculum.ts';
import { BrowserCompilerHarness } from '../tests/helpers/browser-worker.mjs';

const compiler = new BrowserCompilerHarness();
const failures = [];
let examples = 0;
let testCases = 0;
try {
  for (const lesson of lessons) {
    for (const [index, section] of lesson.sections.entries()) {
      if (!section.code) continue;
      examples++;
      if (examples % 10 === 0) console.log(`Checking example ${examples}: ${lesson.id}`);
      // Some examples expect lesson-specific input. This pass verifies compilation;
      // the problem pass below checks actual outputs for every published test case.
      const result = await compiler.run(section.code, '', { compileOnly: true, runMs: 100 });
      if (!['success', 'runtime_error', 'output_limit'].includes(result.status)) {
        failures.push({ id: `${lesson.id}-${index}`, status: result.status, error: result.compileOutput || result.message });
      }
    }
  }
  for (const problem of problems) {
    for (const test of problem.tests) {
      testCases++;
      if (testCases % 10 === 0) console.log(`Checking problem case ${testCases}: ${problem.id}`);
      const result = await compiler.run(problem.solution, test.input);
      if (result.status !== 'success' || result.stdout.trim() !== test.output.trim()) {
        failures.push({ id: problem.id, input: test.input, expected: test.output, status: result.status, actual: result.stdout, error: result.compileOutput || result.stderr });
      }
    }
  }
} finally { await compiler.close(); }
console.log(JSON.stringify({ examples, solutions: problems.length, testCases, failures }, null, 2));
if (failures.length) process.exitCode = 1;
