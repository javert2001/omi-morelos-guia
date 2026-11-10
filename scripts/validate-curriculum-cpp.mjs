import { lessons, problems } from "../lib/curriculum.ts";
import { sameOutput } from "../lib/exercise-judge.ts";
import { mkdtemp, writeFile, rm, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
const directory = await mkdtemp(join(tmpdir(), "omi-curriculum-"));
const modules = process.argv.slice(2);
let selected = lessons;
if (modules.length) {
  const imported = await Promise.all(modules.map(p=>import(pathToFileURL(resolve(p)).href)));
  const records = imported.flatMap(m=>Object.values(m).filter(v=>v && typeof v==='object').flatMap(v=>Object.entries(v)).filter(([,v])=>v?.sections && v?.exercises));
  selected = [...new Map(records.map(([id,lesson])=>[id,{id,...lesson}])).values()];
}
const snippets = selected.flatMap(l=>l.sections.flatMap((s,i)=>s.code?[{id:`${l.id}-${i}`,code:s.code}]:[]));
const solutions = [...(modules.length?[]:problems.map(p=>({id:p.id,code:p.solution,tests:p.tests}))), ...selected.flatMap(l=>(l.exercises||[]).flatMap(e=>e.code?[{id:`${l.id}/${e.id}`,code:e.code,tests:e.tests||[]}]:[]))];
// The browser supplies this portable convenience header; macOS clang does not.
await mkdir(join(directory,'bits'));
await writeFile(join(directory,'bits/stdc++.h'), ['algorithm','array','bitset','cassert','cmath','complex','cstdint','cstring','deque','functional','iomanip','iostream','limits','map','numeric','queue','random','set','stack','string','tuple','unordered_map','unordered_set','utility','vector'].map(h=>`#include <${h}>`).join('\n'));
function run(cmd,args,input="") {
  return new Promise(resolve=>{
    const p=spawn(cmd,args,{stdio:['pipe','pipe','pipe']});let out='',err='';
    p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>err+=d);
    const timeout=setTimeout(()=>p.kill('SIGKILL'),15000);
    p.on('error',e=>{clearTimeout(timeout);resolve({status:-1,out,err:String(e)});});
    p.on('close',status=>{clearTimeout(timeout);resolve({status,out,err});});
    p.stdin.on('error',()=>{});p.stdin.end(input);
  });
}
const failures=[];let cursor=0, tests=0;
const work=[...snippets.map(s=>({...s,kind:'syntax'})),...solutions.map(s=>({...s,kind:'solution'}))];
try {
  await Promise.all(Array.from({length:4},async()=>{
    while(cursor<work.length){
      const index=cursor++,item=work[index],path=join(directory,`${index}.cpp`),bin=join(directory,`${index}.out`);
      await writeFile(path,item.code);
      const args=['-std=c++17','-I',directory,...(item.kind==='syntax'?['-fsyntax-only',path]:['-O1',path,'-o',bin])];
      const result=await run('clang++',args);
      if(result.status!==0){failures.push({id:item.id,error:result.err});continue;}
      if(item.kind==='solution')for(const t of item.tests){
        const r=await run(bin,[],t.input);tests++;
        if(r.status!==0 || !sameOutput(r.out,t.output))failures.push({id:item.id,input:t.input,expected:t.output,actual:r.out,error:r.err});
      }
    }
  }));
} finally {await rm(directory,{recursive:true,force:true});}
console.log(JSON.stringify({lessons:selected.length,examples:snippets.length,solutions:solutions.length,testCases:tests,failures},null,2));
if(failures.length)process.exitCode=1;
