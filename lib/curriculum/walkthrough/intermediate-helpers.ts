import type { Lesson, LessonSection } from '../types.ts';
import { intermediatePrograms } from './intermediate-programs.ts';

export type Walkthrough = (lesson: Lesson) => Partial<Lesson>;

/** These helpers only assemble explicitly authored sections; no prose is generated. */
export const page = (sections: LessonSection[]): Partial<Lesson> => ({
  presentation: 'walkthrough', detailedSections: undefined, sections,
});
export const text = (title: string, body: string): LessonSection => ({ title, body });
export const snippet = (title: string, body: string, code: string, afterCode: string): LessonSection => ({ title, body, code, codeKind: 'fragment', afterCode });
export function exercise(lesson: Lesson) {
  const found = lesson.exercises?.find(item => item.code);
  if (!found?.code || found.sampleInput === undefined || found.sampleOutput === undefined) throw new Error(`Missing runnable example: ${lesson.id}`);
  return found;
}
export function problem(lesson: Lesson, explanation: string): LessonSection {
  const e = exercise(lesson);
  return { title: 'El problema que vamos a resolver', body: `${e.prompt}\n\n${explanation}`, example: { input: e.sampleInput!, output: e.sampleOutput! } };
}
export function program(lesson: Lesson, explanation: string, afterCode: string): LessonSection {
  const e = exercise(lesson);
  return { title: 'El programa completo', body: explanation, code: intermediatePrograms[lesson.id] ?? e.code, codeInput: e.sampleInput, example: { input: e.sampleInput!, output: e.sampleOutput! }, afterCode };
}
export function detail(lesson: Lesson, index: number): LessonSection {
  const section = lesson.detailedSections?.[index];
  if (!section) throw new Error(`Missing reviewed section ${index}: ${lesson.id}`);
  if (section.code) throw new Error(`Full programs must be introduced explicitly: ${lesson.id}, ${index}`);
  return { ...section };
}
