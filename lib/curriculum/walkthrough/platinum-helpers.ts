import type { Lesson, LessonSection } from '../types.ts';

export type PlatinumWalkthrough = (lesson: Lesson) => Partial<Lesson>;

/** Keep the executable program identical to its checked exercise solution. */
export function program(lesson: Lesson) {
  const exercise = lesson.exercises?.find((item) => item.code);
  if (!exercise?.code || exercise.sampleInput === undefined || exercise.sampleOutput === undefined) {
    throw new Error(`Falta programa comprobable en ${lesson.id}`);
  }
  return exercise;
}

/** Excerpts come from that same program; prose around each one is written per lesson. */
export function excerpt(lesson: Lesson, start: string, end?: string): string {
  const source = program(lesson).code!;
  const begin = source.indexOf(start);
  const finish = end ? source.indexOf(end, begin + start.length) : source.length;
  if (begin < 0 || finish < begin) throw new Error(`Fragmento ausente en ${lesson.id}: ${start}`);
  return source.slice(begin, finish).trim();
}

export function complete(lesson: Lesson, body: string, afterCode: string): LessonSection {
  const exercise = program(lesson);
  return {
    title: 'El programa completo', body, code: exercise.code,
    codeInput: exercise.sampleInput,
    example: { input: exercise.sampleInput!, output: exercise.sampleOutput! }, afterCode,
  };
}

export function walkthrough(sections: LessonSection[]): Partial<Lesson> {
  return { sections, detailedSections: undefined, takeaway: undefined, presentation: 'walkthrough' };
}
