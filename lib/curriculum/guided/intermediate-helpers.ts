import type { GuidedChapter, LessonSection, LessonPicture } from '../types.ts';

export const step = (title: string, body: string, extra: Omit<LessonSection, 'title' | 'body'> = {}): LessonSection => ({ title, body, ...extra });
export const picture = (caption: string, rows: LessonPicture['rows']): LessonPicture => ({ caption, rows });
export const chapter = (takeaway: string, sections: LessonSection[]): GuidedChapter => ({ takeaway, sections });
