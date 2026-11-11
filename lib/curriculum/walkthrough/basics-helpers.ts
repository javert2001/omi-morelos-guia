import type { Lesson, LessonSection } from '../types.ts';
import { basicsPrograms } from './basics-programs.ts';

export type Walkthrough = (lesson: Lesson) => Partial<Lesson>;
export const section = (title: string, body: string, extra: Partial<LessonSection> = {}): LessonSection => ({ title, body, ...extra });
export const fragment = (title: string, body: string, code: string, afterCode: string, extra: Partial<LessonSection> = {}): LessonSection => ({ title, body, code, codeKind: 'fragment', afterCode, ...extra });
export function complete(lesson: Lesson, body: string, afterCode: string): LessonSection {
  const exercise = lesson.exercises![1];
  return {
    title: 'El programa completo', body, code: basicsPrograms[lesson.id],
    codeInput: exercise.sampleInput ?? '',
    example: { input: exercise.sampleInput ?? '', output: exercise.sampleOutput ?? '' }, afterCode,
  };
}
export const walkthrough = (sections: LessonSection[]): Partial<Lesson> => ({ presentation: 'walkthrough', takeaway: undefined, detailedSections: undefined, sections });
