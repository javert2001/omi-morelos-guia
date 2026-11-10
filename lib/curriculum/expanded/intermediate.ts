import type { LessonExpansion } from '../types.ts';
import { silverExpansions } from './intermediate-silver.ts';
import { goldExpansions } from './intermediate-gold.ts';
import { intermediateBridgeExpansions } from './intermediate-bridges.ts';

export const intermediateExpansions: Record<string, LessonExpansion> = {
  ...silverExpansions,
  ...goldExpansions,
  ...intermediateBridgeExpansions,
};
