import { guidedSegmentTrees } from './segment-trees.ts';
import { guidedBasics } from './basics.ts';
import { guidedIntermediate } from './intermediate.ts';
import { guidedAdvanced } from './advanced.ts';

export const guidedChapters = { ...guidedBasics, ...guidedIntermediate, ...guidedAdvanced, ...guidedSegmentTrees };
