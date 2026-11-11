import type { Lesson } from '../types.ts';
import { startWalkthroughs } from './basics-start.ts';
import { generalWalkthroughs } from './basics-general.ts';
import { bronzeWalkthroughs } from './basics-bronze.ts';
import { basicsQuizzes } from './basics-quizzes.ts';

/** Each chapter develops a concrete task in one visible reading sequence. */
const chapters: Record<string, (lesson: Lesson) => Partial<Lesson>> = {
  ...startWalkthroughs,
  ...generalWalkthroughs,
  ...bronzeWalkthroughs,
};

export const basicsWalkthroughs: Record<string, (lesson: Lesson) => Partial<Lesson>> = Object.fromEntries(
  Object.entries(chapters).map(([id, chapter]) => [id, (lesson: Lesson) => ({
    ...chapter(lesson),
    ...(basicsQuizzes[id] ? { quiz: basicsQuizzes[id] } : {}),
  })]),
);
