import { expandedLevels } from './curriculum/levels.ts';
import { legacyLessons, legacyProblems } from './curriculum/legacy.ts';
import { generalLessons } from './curriculum/general.ts';
import { bronzeLessons } from './curriculum/bronze.ts';
import { silverLessons } from './curriculum/silver.ts';
import { goldLessons } from './curriculum/gold.ts';
import { platinumLessons } from './curriculum/platinum.ts';
import { advancedLessons } from './curriculum/advanced.ts';
import type { Lesson } from './curriculum/types.ts';
import { basicsExpansions } from './curriculum/expanded/basics.ts';
import { intermediateExpansions } from './curriculum/expanded/intermediate.ts';
import { advancedExpansions } from './curriculum/expanded/advanced.ts';
import { guidedChapters } from './curriculum/guided/index.ts';
import { segmentTreeLesson } from './curriculum/segment-tree-lesson.ts';
export type { Level, Lesson, Problem, LessonExercise } from './curriculum/types.ts';
export const levels = expandedLevels;
const allLessons:Lesson[]=[...legacyLessons,...generalLessons,...bronzeLessons,...silverLessons,...goldLessons,...platinumLessons,...advancedLessons];
// Preserve stable legacy IDs, and order the expanded path by stage.
const expansions = { ...basicsExpansions, ...intermediateExpansions, ...advancedExpansions };
export const lessons:Lesson[]=levels.flatMap(level=>allLessons.filter(lesson=>lesson.level===level.id)).map(lesson => {
  const full = { ...lesson, ...expansions[lesson.id] };
  if (lesson.id === 'usaco-plat-segtree-ext') return { ...full, ...segmentTreeLesson };
  const guide = guidedChapters[lesson.id];
  return guide ? { ...full, sections:guide.sections, takeaway:guide.takeaway, detailedSections:full.sections } : full;
});
export const problems=legacyProblems;
