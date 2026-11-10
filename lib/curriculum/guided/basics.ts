import type { GuidedChapter } from '../types.ts';
import { guidedInicio } from './basics-inicio.ts';
import { guidedGeneralFirst } from './basics-general-first.ts';
import { guidedGeneralLearning } from './basics-general-learning.ts';
import { guidedGeneralTools } from './basics-general-tools.ts';
import { guidedBronzeFirst } from './basics-bronze-first.ts';
import { guidedBronzeNext } from './basics-bronze-next.ts';

export const guidedBasics: Record<string, GuidedChapter> = {
  ...guidedInicio,
  ...guidedGeneralFirst,
  ...guidedGeneralLearning,
  ...guidedGeneralTools,
  ...guidedBronzeFirst,
  ...guidedBronzeNext,
};
