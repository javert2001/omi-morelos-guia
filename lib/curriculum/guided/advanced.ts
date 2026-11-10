import type { GuidedChapter } from '../types.ts';
import { guidedPlatinum } from './advanced-platinum.ts';
import { guidedAdvancedStructures } from './advanced-structures.ts';
import { guidedAdvancedGraphs } from './advanced-graphs.ts';
import { guidedAdvancedFlows } from './advanced-flows.ts';
import { guidedAdvancedStrings } from './advanced-strings.ts';
import { guidedAdvancedMath } from './advanced-math.ts';

export const guidedAdvanced: Record<string, GuidedChapter> = {
  ...guidedPlatinum,
  ...guidedAdvancedStructures,
  ...guidedAdvancedGraphs,
  ...guidedAdvancedFlows,
  ...guidedAdvancedStrings,
  ...guidedAdvancedMath,
};
