import { lessons, problems } from '../lib/curriculum.ts';
import { BrowserCompilerHarness } from '../tests/helpers/browser-worker.mjs';
import { sameOutput } from '../lib/exercise-judge.ts';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const hash = value => createHash('sha256').update(value).digest('hex');
const runtime = hash(await readFile(new URL('../public/compiler/worker.js',import.meta.url),'utf8') + await readFile(new URL('../public/compiler/runtime.js',import.meta.url),'utf8') + await readFile(new URL('../public/compiler/manifest.json',import.meta.url),'utf8'));
const cachePath=join(tmpdir(),'omi-guide-browser-verified-v2.json');
let cache={};try{cache=JSON.parse(await readFile(cachePath,'utf8'));}catch{}
const compiler = new BrowserCompilerHarness();
const failures=[];let examples=0,testCases=0,cached=0,executed=0;
const solutions=[...problems.map(p=>({id:p.id,code:p.solution,tests:p.tests})),...lessons.flatMap(l=>(l.exercises||[]).flatMap(e=>e.code?[{id:`${l.id}/${e.id}`,code:e.code,tests:e.tests||[]}]:[]))];
try{
  for(const lesson of lessons)for(const [index,section] of lesson.sections.entries()){
    if(!section.code)continue;examples++;
    const key=hash(JSON.stringify([runtime,'compile',section.code]));
    if(cache[key]){cached++;continue;}
    const result=await compiler.run(section.code,'',{compileOnly:true,runMs:100});executed++;
    if(!['success','runtime_error','output_limit'].includes(result.status))failures.push({id:`${lesson.id}-${index}`,status:result.status,error:result.compileOutput||result.message});
    else cache[key]=true;
    if(executed%20===0)console.log(`Verified ${executed} executions; chapter ${lesson.id}`);
  }
  for(const solution of solutions)for(const test of solution.tests){
    testCases++;
    const key=hash(JSON.stringify([runtime,'case',solution.code,test.input,test.output]));
    if(cache[key]){cached++;continue;}
    const result=await compiler.run(solution.code,test.input);executed++;
    if(result.status!=='success'||!sameOutput(result.stdout,test.output))failures.push({id:solution.id,input:test.input,expected:test.output,status:result.status,actual:result.stdout,error:result.compileOutput||result.stderr});
    else cache[key]=true;
    if(executed%20===0){console.log(`Verified ${executed} executions; exercise ${solution.id}`);await writeFile(cachePath,JSON.stringify(cache));}
  }
}finally{await compiler.close();await writeFile(cachePath,JSON.stringify(cache));}
console.log(JSON.stringify({examples,solutions:solutions.length,testCases,executed,cached,failures},null,2));
if(failures.length)process.exitCode=1;
