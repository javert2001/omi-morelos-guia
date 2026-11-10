import type { CompilerHealth, CompilerRequest, CompilerResult } from './compiler-contract';
import { publicAsset } from './public-asset';

const limits: CompilerHealth['limits'] = {
  codeBytes: 64 * 1024,
  inputBytes: 32 * 1024,
  outputBytes: 64 * 1024,
  compileMs: 30_000,
  runMs: 3_000,
};
const loadingMs = 120_000;
let worker: Worker | undefined;
let busy = false;

export async function getBrowserCompilerHealth(): Promise<CompilerHealth> {
  const available = typeof window !== 'undefined' && typeof Worker !== 'undefined'
    && typeof WebAssembly !== 'undefined' && typeof DecompressionStream !== 'undefined'
    && Boolean(globalThis.crypto?.subtle);
  return {
    available,
    language: 'C++17 · Clang 8 · WebAssembly',
    message: available
      ? 'Tu código se ejecuta en este navegador. La primera vez se descarga el compilador (19 MB).'
      : 'Para ejecutar código, abre esta página en una versión reciente de Chrome, Edge, Firefox o Safari.',
    limits,
  };
}

/** Compiles and runs in a worker with a private WASI filesystem; never uploads student code. */
export async function executeBrowserCpp(
  request: CompilerRequest,
  signal?: AbortSignal,
  onProgress?: (message: string) => void,
): Promise<CompilerResult> {
  const start = performance.now();
  let captured = { stdout: '', stderr: '', compileOutput: '' };
  const result = (status: CompilerResult['status'], message: string): CompilerResult => ({
    status, ...captured, exitCode: null,
    durationMs: Math.round(performance.now() - start), message,
  });
  if (signal?.aborted) return result('cancelled', 'Ejecución detenida. Puedes editar tu código y volver a intentar.');
  if (busy) return result('busy', 'Ya hay un programa ejecutándose. Espera a que termine o detenlo.');
  const health = await getBrowserCompilerHealth();
  if (!health.available) return result('unavailable', health.message);
  const encoder = new TextEncoder();
  if (!request || typeof request.code !== 'string' || !request.code.trim()
    || (request.stdin !== undefined && typeof request.stdin !== 'string')) {
    return result('invalid_request', 'Escribe un programa C++ antes de ejecutarlo.');
  }
  if (encoder.encode(request.code).byteLength > limits.codeBytes || encoder.encode(request.stdin || '').byteLength > limits.inputBytes) {
    return result('invalid_request', 'El código puede tener hasta 64 KB y la entrada hasta 32 KB.');
  }
  // Another editor can start during the asynchronous feature check above.
  if (busy) return result('busy', 'Ya hay un programa ejecutándose. Espera a que termine o detenlo.');
  if (signal?.aborted) return result('cancelled', 'Ejecución detenida.');
  busy = true;
  return new Promise(resolve => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout>;
    let currentWorker: Worker;
    let phase = 'loading';
    const finish = (value: CompilerResult, discard = false) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      if (currentWorker) {
        currentWorker.onmessage = null;
        currentWorker.onerror = null;
        currentWorker.onmessageerror = null;
      }
      if (discard) { worker?.terminate(); worker = undefined; }
      busy = false;
      resolve(value);
    };
    const abort = () => finish(result('cancelled', 'Ejecución detenida. Puedes editar tu código y volver a intentar.'), true);
    const armTimeout = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const message = phase === 'running'
          ? 'Tu programa tardó más de 3 segundos. Revisa si tienes un ciclo que no termina.'
          : phase === 'compiling'
            ? 'La compilación tardó más de 30 segundos. Prueba con un programa más pequeño.'
            : 'No se pudo descargar el compilador a tiempo. Revisa tu conexión y vuelve a intentar.';
        finish(result(phase === 'loading' ? 'unavailable' : 'timeout', message), true);
      }, phase === 'running' ? limits.runMs : phase === 'compiling' ? limits.compileMs : loadingMs);
    };
    try {
      worker ??= new Worker(publicAsset('compiler/worker.js'), { name: 'omi-cpp-laboratory' });
      currentWorker = worker;
      currentWorker.onmessage = event => {
        const message = event.data;
        if (message.type === 'output') captured = { stdout: message.stdout, stderr: message.stderr, compileOutput: message.compileOutput };
        if (message.type === 'phase') { phase = message.phase; armTimeout(); }
        if (message.type === 'phase' || message.type === 'progress') onProgress?.(message.message);
        if (message.type === 'result') finish(message.result, message.result.status === 'unavailable');
      };
      currentWorker.onerror = event => {
        event.preventDefault();
        finish(result('unavailable', 'El compilador se detuvo. Vuelve a intentar; si continúa, recarga la página.'), true);
      };
      currentWorker.onmessageerror = () => finish(result('unavailable', 'No se pudo recibir el resultado del compilador. Vuelve a intentar.'), true);
      signal?.addEventListener('abort', abort, { once: true });
      armTimeout();
      currentWorker.postMessage({ type: 'run', code: request.code, stdin: request.stdin || '' });
    } catch {
      finish(result('unavailable', 'No se pudo iniciar el compilador en este navegador.'), true);
    }
  });
}
