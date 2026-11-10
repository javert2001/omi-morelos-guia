import type { LessonExpansion, LessonExercise } from '../types.ts';
import { platinumLessons } from '../platinum.ts';
import { advancedLessons } from '../advanced.ts';

export const section = (title: string, body: string, code?: string) => ({ title, body, ...(code ? { code } : {}) });
export const reasoning = (id: string, title: string, prompt: string, hints: string[], solution: string): LessonExercise => ({ id, title, prompt, hints, solution });
export function program(id: string, title: string, prompt: string, hints: string[], solution: string, code: string, tests: { input: string; output: string }[]): LessonExercise {
  return { id, title, prompt, hints, solution, code, sampleInput: tests[0].input, sampleOutput: tests[0].output, tests };
}
export const chapter = (minutes: number, sections: LessonExpansion['sections'], exercises: LessonExercise[]): LessonExpansion => ({ minutes, sections, exercises });

const originalChapters = new Map([...platinumLessons, ...advancedLessons].map(lesson => [lesson.id, lesson]));
/** Keep the existing worked introduction, then complete its mechanics and proof. */
export function extend(id: string, minutes: number, sections: LessonExpansion['sections'], exercises: LessonExercise[]): LessonExpansion {
  const original = originalChapters.get(id);
  if (!original) throw new Error(`Unknown advanced chapter: ${id}`);
  return chapter(minutes, [...original.sections.slice(0, -1), ...sections, original.sections[original.sections.length - 1]], exercises);
}
