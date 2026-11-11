import type { Lesson } from '../types.ts';
import { basicsWalkthroughs } from './basics.ts';
import { intermediateWalkthroughs } from './intermediate.ts';
import { platinumWalkthroughs } from './platinum.ts';
import { advancedWalkthroughs } from './advanced.ts';

export const walkthroughChapters: Record<string, (lesson: Lesson) => Partial<Lesson>> = {
  ...basicsWalkthroughs,
  ...intermediateWalkthroughs,
  ...platinumWalkthroughs,
  ...advancedWalkthroughs,
};
