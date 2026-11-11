import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, levels, problems } from '../lib/curriculum.ts';
import { lessonVisuals } from '../lib/lesson-visuals.ts';

// Check published prose, including optional chapters and solutions. Code,
// identifiers and external source titles are not editorial copy.
test('all published explanations follow the explicit wording restrictions', () => {
  const prose: [string, string][] = [];
  const add = (path: string, values: (string | undefined)[]) => {
    values.forEach((value, index) => { if (value) prose.push([`${path}/${index}`, value]); });
  };
  for (const level of levels) add(level.id, [level.title, level.eyebrow, level.description]);
  for (const lesson of lessons) {
    add(lesson.id, [lesson.title, lesson.description, lesson.takeaway, ...(lesson.objectives || [])]);
    for (const [index, section] of [...lesson.sections, ...(lesson.detailedSections || [])].entries()) {
      add(`${lesson.id}/section-${index}`, [section.title, section.body, section.afterCode, section.check?.question, section.check?.answer, section.picture?.caption]);
      section.picture?.rows.forEach(row => add(`${lesson.id}/picture`, [row.label, ...row.values]));
    }
    add(`${lesson.id}/quiz`, [lesson.quiz.question, ...lesson.quiz.options, lesson.quiz.explanation]);
    for (const exercise of lesson.exercises || []) {
      add(`${lesson.id}/${exercise.id}`, [exercise.title, exercise.prompt, ...exercise.hints, exercise.solution]);
    }
  }
  for (const problem of problems) add(problem.id, [problem.title, problem.statement, problem.input, problem.output, problem.hint, problem.explanation]);
  for (const [id, visual] of Object.entries(lessonVisuals)) {
    add(id, [visual.title]);
    for (const frame of visual.frames) add(`${id}/frame`, [frame.title, frame.explanation, frame.result]);
  }
  const forbidden = /—|\ben resumen\b|\btapiz\b|\bprofundiz\w*|\bfascinante\b|\bun viaje\b|\ben conclusión\b|\bclave fundamental\b/iu;
  const violations = prose.filter(([, text]) => forbidden.test(text));
  assert.deepEqual(violations.map(([path, text]) => `${path}: ${text.match(forbidden)?.[0]}`), []);
});
