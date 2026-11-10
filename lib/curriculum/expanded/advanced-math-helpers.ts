import type { LessonExpansion, LessonExercise } from '../types.ts';
import { advancedLessons } from '../advanced.ts';
export function mathChapter(id: string, sections: [string,string][], exercises: LessonExercise[]): LessonExpansion {
  const original = advancedLessons.find(l => l.id === id);
  if (!original) throw new Error(`Unknown chapter ${id}`);
  return { sections: [...original.sections, ...sections.map(([title,body])=>({title,body}))], exercises, minutes: 75 };
}
export function reflect(id:string,title:string,prompt:string,hints:string[],solution:string):LessonExercise {
  return {id,title,prompt,hints,solution};
}
export function program(id:string,title:string,prompt:string,hints:string[],solution:string,code:string,cases:[string,string][]):LessonExercise {
  return {id,title,prompt,hints,solution,code,sampleInput:cases[0][0],sampleOutput:cases[0][1],tests:cases.map(([input,output])=>({input,output}))};
}
