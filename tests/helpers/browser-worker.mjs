import { Worker } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';

// Runs the exact browser worker and real vendored WASM modules. Only fetch and messaging
// are adapted to Node so CI tests do not require a browser or network downloads.
const bootstrap = `
const { parentPort, workerData } = require('node:worker_threads');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
global.self = global;
self.location = { href: 'https://omi.test/compiler/worker.js' };
global.importScripts = name => vm.runInThisContext(fs.readFileSync(path.join(workerData, name), 'utf8'));
global.postMessage = message => parentPort.postMessage(message);
global.fetch = async url => new Response(fs.readFileSync(path.join(workerData, new URL(url).pathname.split('/').pop())));
vm.runInThisContext(fs.readFileSync(path.join(workerData, 'worker.js'), 'utf8'));
parentPort.on('message', data => self.onmessage({ data }));
`;

export class BrowserCompilerHarness {
  constructor() {
    this.startWorker();
  }
  startWorker() {
    this.terminated = false;
    this.worker = new Worker(bootstrap, {
      eval: true,
      workerData: fileURLToPath(new URL('../../public/compiler/', import.meta.url)),
    });
  }
  /** @returns {Promise<any>} */
  async run(code, stdin = '', { runMs = 3000, compileOnly = false } = {}) {
    if (this.terminated) this.startWorker();
    return new Promise((resolve, reject) => {
      let phase = 'loading';
      let captured = { stdout: '', stderr: '', compileOutput: '' };
      let timer;
      const done = value => {
        clearTimeout(timer);
        this.worker.off('message', onMessage);
        this.worker.off('error', onError);
        resolve(value);
      };
      const arm = ms => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.worker.terminate();
          this.terminated = true;
          done({ status: compileOnly && phase === 'running' ? 'success' : 'timeout', ...captured, exitCode: null });
        }, ms);
      };
      const onError = error => {
        clearTimeout(timer);
        this.worker.off('message', onMessage);
        reject(error);
      };
      const onMessage = message => {
        if (message.type === 'phase') {
          phase = message.phase;
          arm(phase === 'loading' ? 120000 : phase === 'compiling' ? 30000 : runMs);
        }
        if (message.type === 'output') captured = message;
        if (message.type === 'result') done(message.result);
      };
      this.worker.on('message', onMessage);
      this.worker.once('error', onError);
      arm(120000);
      this.worker.postMessage({ type: 'run', code, stdin });
    });
  }
  async close() { await this.worker.terminate(); }
}
