import {coreDepth} from './basics-depth-core.ts';
import {toolsDepth} from './basics-depth-tools.ts';
import {bronzeDepth} from './basics-depth-bronze.ts';
export const basicsDepth: Record<string,[string,string][]>={...coreDepth,...toolsDepth,...bronzeDepth};
