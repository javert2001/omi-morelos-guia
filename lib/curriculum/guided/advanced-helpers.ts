import type { GuidedChapter, LessonPicture } from '../types.ts';

export function guide(
  takeaway: string,
  steps: [string, string][],
  picture: LessonPicture,
  question: string,
  answer: string,
): GuidedChapter {
  return {
    takeaway,
    sections: steps.map(([title, body], index) => ({
      title,
      body,
      ...(index === 2 ? { picture } : {}),
      ...(index === 5 ? { check: { question, answer } } : {}),
    })),
  };
}

export function picture(caption: string, rows: [string, ...string[]][]): LessonPicture {
  return { caption, rows: rows.map(([label, ...values]) => ({ label, values })) };
}
