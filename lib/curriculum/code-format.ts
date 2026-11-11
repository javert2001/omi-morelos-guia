import type { Lesson, LessonSection } from './types.ts';
import { readableCpp } from './readable-cpp.ts';

// Include the length as well as the hash. The generator checks for collisions.
export function cppKey(code: string): string {
  let hash = 2166136261;
  for (const char of code) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  return `${code.length}-${hash.toString(16)}`;
}

export function readableCode(code: string): string {
  return readableCpp[cppKey(code)] ?? code;
}

export function formatLessonCode(lesson: Lesson): Lesson {
  // The approved sample is already formatted and remains the reference chapter.
  if (lesson.id === 'usaco-plat-segtree-ext') return lesson;
  const formatSection = (section: LessonSection): LessonSection =>
    section.code && (!section.codeLanguage || section.codeLanguage === 'cpp')
      ? { ...section, code: readableCode(section.code) } : section;
  return {
    ...lesson,
    sections: lesson.sections.map(formatSection),
    exercises: lesson.exercises?.map(exercise => ({
      ...exercise,
      ...(exercise.code ? { code: readableCode(exercise.code) } : {}),
      ...(exercise.starterCode ? { starterCode: readableCode(exercise.starterCode) } : {}),
    })),
  };
}
