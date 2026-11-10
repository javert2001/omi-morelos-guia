import type { LessonExpansion } from '../types.ts';
import { coreExpansions } from './basics-core.ts';
import { generalExpansions } from './basics-general.ts';
import { toolsExpansions } from './basics-tools.ts';
import { bronzeExpansions } from './basics-bronze.ts';
export const basicsExpansions: Record<string, LessonExpansion> = {
    ...coreExpansions,
    ...generalExpansions,
    ...toolsExpansions,
    ...bronzeExpansions,
};
