import { numberExpansions } from './advanced-number.ts';
import { numberMoreExpansions } from './advanced-number-more.ts';
import { combinatorialExpansions } from './advanced-combinatorial.ts';
import { methodExpansions } from './advanced-methods.ts';
export const advancedMathExpansions = { ...numberExpansions, ...numberMoreExpansions, ...combinatorialExpansions, ...methodExpansions };
