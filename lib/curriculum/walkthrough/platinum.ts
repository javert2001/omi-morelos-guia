import type { Lesson } from '../types.ts';
import { platinumRangeWalkthroughs } from './platinum-ranges.ts';
import { platinumTreeWalkthroughs } from './platinum-trees.ts';
import { platinumGeometryWalkthroughs } from './platinum-geometry.ts';
import { platinumAlgebraWalkthroughs } from './platinum-algebra.ts';
import { platinumOptimizationWalkthroughs } from './platinum-optimization.ts';

/** The reviewed segment-tree introduction remains in segment-tree-lesson.ts. */
export const platinumWalkthroughs: Record<string, (lesson: Lesson) => Partial<Lesson>> = {
  ...platinumRangeWalkthroughs,
  ...platinumTreeWalkthroughs,
  ...platinumGeometryWalkthroughs,
  ...platinumAlgebraWalkthroughs,
  ...platinumOptimizationWalkthroughs,
};
