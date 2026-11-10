import type { LessonExpansion } from '../types.ts';
import { advancedRangeExpansions } from './advanced-range.ts';
import { advancedOfflineExpansions } from './advanced-offline.ts';
import { advancedTreeExpansions } from './advanced-trees.ts';
import { advancedTreeDivisionExpansions } from './advanced-tree-divisions.ts';
import { advancedGeometryExpansions } from './advanced-geometry.ts';
import { advancedMathExpansions } from './advanced-math.ts';
import { advancedOptimizationExpansions } from './advanced-optimization.ts';
import { advancedPlatAlgebraExpansions } from './advanced-plat-algebra.ts';
import { advancedStringsExpansions } from './advanced-strings.ts';
import { advancedStructuresOneExpansions } from './advanced-structures-one.ts';
import { advancedStructuresTwoExpansions } from './advanced-structures-two.ts';
import { advancedDynamicForestExpansions } from './advanced-dynamic-forest.ts';
import { advancedFlowsExpansions } from './advanced-flows.ts';
import { advancedGraphExpansions } from './advanced-graphs.ts';
import { advancedConvexityExpansions } from './advanced-convexity.ts';

export const advancedExpansions: Record<string, LessonExpansion> = {
  ...advancedRangeExpansions,
  ...advancedOfflineExpansions,
  ...advancedTreeExpansions,
  ...advancedTreeDivisionExpansions,
  ...advancedGeometryExpansions,
  ...advancedMathExpansions,
  ...advancedOptimizationExpansions,
  ...advancedPlatAlgebraExpansions,
  ...advancedStringsExpansions,
  ...advancedStructuresOneExpansions,
  ...advancedStructuresTwoExpansions,
  ...advancedDynamicForestExpansions,
  ...advancedFlowsExpansions,
  ...advancedGraphExpansions,
  ...advancedConvexityExpansions,
};
