import test from 'node:test';
import assert from 'node:assert/strict';
import { BrowserCompilerHarness } from './helpers/browser-worker.mjs';
import { segmentTreeLesson, segmentTreeProgram } from '../lib/curriculum/segment-tree-lesson.ts';

test('the taught segment tree program agrees with a direct scan in the browser compiler', async () => {
  const compiler = new BrowserCompilerHarness();
  const cases = [...segmentTreeLesson.exercises![0].tests!];
  let seed = 106;
  const random = (limit: number) => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed % limit;
  };
  for (const n of [1, 2, 3, 5, 7, 8, 17, 31]) {
    const initial = Array.from({ length: n }, () => random(30));
    const rooms = [...initial];
    const groups = Array.from({ length: 60 }, () => 1 + random(35));
    const answers = groups.map(group => {
      const room = rooms.findIndex(capacity => capacity >= group);
      if (room !== -1) rooms[room] -= group;
      return room + 1;
    });
    cases.push({ input: `${n} ${groups.length}\n${initial.join(' ')}\n${groups.join(' ')}\n`, output: answers.join('\n') + '\n' });
  }
  cases.push({ input: '3 4\n0 1000000000 1000000000\n1000000000 999999999 1 1\n', output: '2\n3\n3\n0\n' });
  try {
    for (const example of cases) {
      const result = await compiler.run(segmentTreeProgram, example.input);
      assert.equal(result.status, 'success', result.compileOutput || result.stderr || result.message);
      assert.equal(result.stdout.trim(), example.output.trim(), example.input);
    }
  } finally {
    await compiler.close();
  }
});
