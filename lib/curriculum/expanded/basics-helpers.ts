import { legacyLessons } from '../legacy.ts';
import { generalLessons } from '../general.ts';
import { bronzeLessons } from '../bronze.ts';
import type { LessonExpansion, LessonExercise } from '../types.ts';
import { basicsDepth } from './basics-depth.ts';
const originals = new Map([...legacyLessons, ...generalLessons, ...bronzeLessons].map(l => [l.id,l]));
export const cpp = (body: string, headers = 'iostream') => headers.split(' ').map(h => `#include <${h}>`).join('\n') + '\nusing namespace std;\nint main() {\n' + body + '\n}\n';
export const reasoning = (id: string, title: string, prompt: string, hints: string[], solution: string): LessonExercise => ({id,title,prompt,hints,solution});
export const coding = (id: string,title: string,prompt: string,hints: string[],solution: string,code: string,cases: [string,string][]): LessonExercise => ({id,title,prompt,hints,solution,code,starterCode:'#include <iostream>\nusing namespace std;\nint main() {\n    // Lee los datos, aplica tu idea y escribe la respuesta.\n}\n',sampleInput:cases[0][0],sampleOutput:cases[0][1],tests:cases.map(([input,output])=>({input,output}))});
export function chapter(id: string, additions: [string,string][], exercises: LessonExercise[]): LessonExpansion {
 const original = originals.get(id);
 if (!original) throw new Error(`Lección desconocida: ${id}`);
 const extraSections = [...additions, ...(basicsDepth[id] || [])].map(([title, body]) => ({ title, body }));
 // The first program's base chapter already explains these three topics.
 const repeatedFirstProgramTopics = new Set([
   'Lee la estructura de afuera hacia adentro',
   'Los caracteres también cuentan',
   'Experimenta cambiando una sola cosa',
 ]);
 const sections = [
   ...original.sections,
   ...extraSections.filter(section => id !== 'tu-primer-programa' || !repeatedFirstProgramTopics.has(section.title)),
 ];
 return {minutes:Math.max(original.minutes,35),sections,exercises};
}
