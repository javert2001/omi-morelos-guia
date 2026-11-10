import type { GuidedChapter, LessonSection } from '../types.ts';

type Step = [title: string, body: string, extra?: Omit<LessonSection, 'title' | 'body'>];

export function guided(takeaway: string, steps: Step[]): GuidedChapter {
  return { takeaway, sections: steps.map(([title, body, extra]) => ({ title, body, ...extra })) };
}
