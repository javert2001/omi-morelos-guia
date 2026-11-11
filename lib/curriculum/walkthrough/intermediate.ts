import { silverWalkthroughs } from './intermediate-silver.ts';
import { silverMoreWalkthroughs } from './intermediate-silver-more.ts';
import { dpWalkthroughs } from './intermediate-dp.ts';
import { graphWalkthroughs } from './intermediate-graphs.ts';
import { containerWalkthroughs } from './intermediate-containers.ts';
import { pointRangeWalkthrough } from './intermediate-ranges.ts';
import { treeWalkthroughs } from './intermediate-trees.ts';
import { methodWalkthroughs } from './intermediate-methods.ts';
import type { Walkthrough } from './intermediate-helpers.ts';

export const intermediateWalkthroughs: Record<string, Walkthrough> = {
  ...silverWalkthroughs,
  ...silverMoreWalkthroughs,
  ...dpWalkthroughs,
  ...graphWalkthroughs,
  ...containerWalkthroughs,
  'usaco-gold-purs': pointRangeWalkthrough,
  ...treeWalkthroughs,
  ...methodWalkthroughs,
};
