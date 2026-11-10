import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BrowserCompilerHarness } from './helpers/browser-worker.mjs';

// These exercise the actual C++ -> WASM -> WASI path used by the static site.
test('browser compiler: C++17 STL, UTF-8 stdin/stdout and separate stderr', async () => {
  const compiler = new BrowserCompilerHarness();
  try {
    const result = await compiler.run('#include <bits/stdc++.h>\nusing namespace std; int main(){int a,b;cin>>a>>b;string word;cin>>word;vector<int>v={a,b};sort(v.begin(),v.end());auto [x,y]=pair<int,int>{v[0],v[1]};cout<<x+y<<" "<<word<<"\\n";cerr<<"aviso\\n";}', '17 25 ¡Morelos!');
    assert.equal(result.status, 'success', result.compileOutput);
    assert.equal(result.stdout, '42 ¡Morelos!\n');
    assert.equal(result.stderr, 'aviso\n');
  } finally { await compiler.close(); }
});

test('browser compiler: diagnostics and runtime exit codes are distinct', async () => {
  const compiler = new BrowserCompilerHarness();
  try {
    const invalid = await compiler.run('int main(){ unknown_name; }');
    assert.equal(invalid.status, 'compile_error');
    assert.match(invalid.compileOutput, /main.cpp:1:/);
    const exit = await compiler.run('int main(){return 7;}');
    assert.equal(exit.status, 'runtime_error');
    assert.equal(exit.exitCode, 7);
  } finally { await compiler.close(); }
});

test('browser compiler: binary output remains below the UTF-8 result budget', async () => {
  const compiler = new BrowserCompilerHarness();
  try {
    const result = await compiler.run('#include <cstdio>\nint main(){for(int i=0;i<70000;i++) putchar(255);}');
    assert.equal(result.status, 'output_limit');
    assert.ok(Buffer.byteLength(result.stdout + result.stderr) <= 65536);
    const next = await compiler.run('#include <cstdio>\nint main(){puts("recuperado");}');
    assert.equal(next.status, 'success');
    assert.equal(next.stdout, 'recuperado\n');
  } finally { await compiler.close(); }
});

test('browser compiler: filesystem and environment are fresh and private', async () => {
  const compiler = new BrowserCompilerHarness();
  try {
    const result = await compiler.run('#include <cstdio>\n#include <cstdlib>\nint main(){printf("%d %d %d\\n",fopen("/etc/passwd","r")!=nullptr,fopen("main.cpp","r")!=nullptr,getenv("USER")!=nullptr);FILE*f=fopen("private.txt","w");if(f){fputs("hola",f);fclose(f);}}');
    assert.equal(result.status, 'success', result.stderr);
    assert.equal(result.stdout, '0 0 0\n');
    const next = await compiler.run('#include <cstdio>\nint main(){printf("%d\\n",fopen("private.txt","r")!=nullptr);}');
    assert.equal(next.status, 'success');
    assert.equal(next.stdout, '0\n');
  } finally { await compiler.close(); }
});

test('browser compiler: runaway program can be terminated outside the worker', async () => {
  const compiler = new BrowserCompilerHarness();
  try {
    const result = await compiler.run('int main(){volatile int n=0;while(true){n++;}}', '', { runMs: 100 });
    assert.equal(result.status, 'timeout');
  } finally { await compiler.close(); }
});
