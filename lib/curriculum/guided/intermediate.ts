import type { GuidedChapter } from '../types.ts';
import { guidedSilver } from './intermediate-silver.ts';
import { guidedMathDp } from './intermediate-dp.ts';
import { guidedGoldGraphs } from './intermediate-graphs.ts';
import { guidedGoldTools } from './intermediate-tools.ts';

/** Short first reading; the full technical chapters remain available separately. */
export const guidedIntermediate: Record<string, GuidedChapter> = {
  ...guidedSilver,
  ...guidedMathDp,
  ...guidedGoldGraphs,
  ...guidedGoldTools,
};
