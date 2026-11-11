import type { Lesson, LessonSection } from '../types.ts';

export type AdvancedStep = {
  source: number;
  title?: string;
  lines?: [number, number];
  code?: string;
  explain?: string;
  body?: string;
};
export type AdvancedPlan = {
  exercise: string;
  problem: string;
  trace: string;
  attempt: [string, string];
  steps: AdvancedStep[];
  program: string;
  check: [string, string];
  extensions?: number[];
};

/** Assemble individually edited chapters around an existing, tested program. */
export function advancedWalkthrough(lesson: Lesson, plan: AdvancedPlan): Partial<Lesson> {
  const exercise = lesson.exercises!.find(e => e.id === plan.exercise)!;
  if (!exercise?.code) throw new Error(`Missing worked program: ${lesson.id}/${plan.exercise}`);
  const technical = lesson.detailedSections!;
  const sourceLines = exercise.code.split('\n');
  const steps: LessonSection[] = plan.steps.map(step => {
    const original = technical[step.source];
    if (!original) throw new Error(`Missing explanation: ${lesson.id}/${step.source}`);
    return {
      title: step.title || original.title,
      body: step.body || original.body,
      ...(step.lines ? {
        code: sourceLines.slice(step.lines[0] - 1, step.lines[1]).join('\n'),
        codeKind: 'fragment' as const,
      } : {}),
      ...(step.code ? { code: step.code, codeKind: 'fragment' as const } : {}),
      ...(step.explain ? { afterCode: step.explain } : {}),
    };
  });
  steps[steps.length - 1].check = { question: plan.check[0], answer: plan.check[1] };
  return {
    presentation: 'walkthrough',
    takeaway: undefined,
    detailedSections: undefined,
    sections: [
      {
        title: exercise.title,
        body: plan.problem,
        example: { input: exercise.sampleInput || '', output: exercise.sampleOutput || '' },
        afterCode: plan.trace,
      },
      { title: plan.attempt[0], body: plan.attempt[1] },
      ...steps,
      {
        title: 'El programa completo',
        body: exercise.prompt + '\n\n' + plan.program,
        code: exercise.code,
        codeInput: exercise.sampleInput || '',
      },
      ...(plan.extensions || []).map(index => ({ title: technical[index].title, body: technical[index].body })),
    ],
  };
}
