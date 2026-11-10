import type { Lesson, LessonExpansion, LessonExercise } from '../types.ts';

type Test = { input: string; output: string };
export function expand(
  lesson: Lesson,
  sections: { title: string; body: string; code?: string }[],
  reasoning: { title: string; prompt: string; hints: string[]; solution: string },
  coding: { title: string; prompt: string; hints: string[]; solution: string; tests: Test[]; code?: string },
): LessonExpansion {
  const code = coding.code ?? lesson.sections.find(section => section.code)?.code;
  if (!code) throw new Error(`Falta solución ejecutable para ${lesson.id}`);
  const exercise: LessonExercise = {
    id: 'programa', title: coding.title, prompt: coding.prompt,
    hints: coding.hints, solution: coding.solution, code,
    starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    // Lee los datos y desarrolla tu solución aquí.\n    return 0;\n}\n',
    sampleInput: coding.tests[0].input, sampleOutput: coding.tests[0].output,
    tests: coding.tests,
  };
  return {
    sections: [...lesson.sections, ...sections],
    exercises: [{ id: 'razona', ...reasoning }, exercise],
    minutes: Math.max(60, lesson.minutes + 35),
    objectives: [...(lesson.objectives ?? []), 'Justificar la solución y comprobarla con casos propios'],
  };
}
