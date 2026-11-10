import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { test } from 'node:test';

async function runtimeApp() {
  const source = await readFile(new URL('../public/compiler/runtime.js', import.meta.url), 'utf8');
  const context = vm.createContext({ WebAssembly, TextEncoder, performance });
  vm.runInContext(`${source}\n globalThis.Runtime = API.Runtime;`, context);
  // (module (memory (export "memory") 1)) — enough to exercise WASI ABI accessors.
  const module = await WebAssembly.compile(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 5, 3, 1, 0, 1, 7, 10, 1, 6, 109, 101, 109, 111, 114, 121, 2, 0]));
  const app = new context.Runtime.App(module, { exports: {} }, 'main');
  await app.ready;
  return app;
}

test('browser WASI: size outputs are 32-bit and preserve adjacent memory', async () => {
  const app = await runtimeApp();
  const memory = new DataView(app.exports.memory.buffer);
  for (const call of ['args_sizes_get', 'environ_sizes_get']) {
    memory.setUint32(20, 0xdeadbeef, true);
    memory.setUint32(28, 0xfeedface, true);
    assert.equal(app[call](16, 24), 0);
    assert.equal(memory.getUint32(20, true), 0xdeadbeef);
    assert.equal(memory.getUint32(28, true), 0xfeedface);
  }
});

test('browser WASI: argument/environment pointers do not write extra terminators', async () => {
  const app = await runtimeApp();
  const memory = new DataView(app.exports.memory.buffer);
  memory.setUint32(20, 0xdeadbeef, true);
  assert.equal(app.args_get(16, 64), 0);
  assert.equal(memory.getUint32(16, true), 64);
  assert.equal(memory.getUint32(20, true), 0xdeadbeef);
  memory.setUint32(16, 0xfeedface, true);
  assert.equal(app.environ_get(16, 64), 0);
  assert.equal(memory.getUint32(16, true), 0xfeedface);
});

test('browser WASI: randomness refreshes memory after heap growth', async () => {
  const app = await runtimeApp();
  app.exports.memory.grow(1);
  assert.equal(app.random_get(65536, 16), 0);
  assert.equal(app.mem.buffer.byteLength, 131072);
});
