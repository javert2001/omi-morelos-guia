import { expandedLevels } from './curriculum/levels.ts';
import { legacyLessons, legacyProblems } from './curriculum/legacy.ts';
import { generalLessons } from './curriculum/general.ts';
import { bronzeLessons } from './curriculum/bronze.ts';
import { silverLessons } from './curriculum/silver.ts';
import { goldLessons } from './curriculum/gold.ts';
import { platinumLessons } from './curriculum/platinum.ts';
import { advancedLessons } from './curriculum/advanced.ts';
import type { Lesson } from './curriculum/types.ts';
export type { Level, Lesson, Problem } from './curriculum/types.ts';
export const levels = expandedLevels;
const allLessons:Lesson[]=[...legacyLessons,...generalLessons,...bronzeLessons,...silverLessons,...goldLessons,...platinumLessons,...advancedLessons];
// Preserve stable legacy IDs, and order the expanded path by stage.
export const lessons:Lesson[]=levels.flatMap(level=>allLessons.filter(lesson=>lesson.level===level.id));
export const problems=legacyProblems;
