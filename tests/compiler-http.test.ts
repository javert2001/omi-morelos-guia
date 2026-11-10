import test from "node:test";
import assert from "node:assert/strict";
import { createServer, request } from "node:http";
import { createCompilerMiddleware } from "../scripts/vite/compiler-plugin.ts";
import type { CompilerResult } from "../lib/compiler-contract.ts";

test("compiler HTTP boundary accepts the local editor and rejects cross-origin or malformed runs", async () => {
  let executions = 0;
  const result: CompilerResult = {
    status: "success",
    stdout: "Hola",
    stderr: "",
    compileOutput: "",
    exitCode: 0,
    durationMs: 1,
  };
  const handler = createCompilerMiddleware({
    health: async () => ({
      available: true,
      language: "C++17",
      message: "Listo",
      limits: {
        codeBytes: 65536,
        inputBytes: 65536,
        outputBytes: 65536,
        compileMs: 15000,
        runMs: 2000,
      },
    }),
    execute: async () => {
      executions++;
      return result;
    },
  });
  const server = createServer((req, res) => {
    void handler(req, res, () => {
      res.writeHead(404);
      res.end();
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const base = `http://127.0.0.1:${address.port}`;
  const headers = {
    Origin: base,
    "Content-Type": "application/json",
    "X-OMI-Compiler": "1",
  };
  try {
    const health = await fetch(base + "/api/compiler/health");
    assert.equal(health.status, 200);
    assert.equal(health.headers.get("access-control-allow-origin"), null);
    assert.equal(((await health.json()) as {available:boolean}).available, true);
    let r = await fetch(base + "/api/compiler/run", {
      method: "POST",
      headers,
      body: JSON.stringify({ code: "int main(){}", stdin: "" }),
    });
    assert.equal(r.status, 200);
    assert.equal(((await r.json()) as CompilerResult).stdout, "Hola");
    const rejected: [Record<string, string>, string, number][] = [
      [{ ...headers, Origin: "https://other.example" }, '{"code":"x"}', 403],
      [
        { ...headers, Origin: base.replace("http:", "https:") },
        '{"code":"x"}',
        403,
      ],
      [
        {
          ...headers,
          Host: `rebinding.example:${address.port}`,
          Origin: `http://rebinding.example:${address.port}`,
        },
        '{"code":"x"}',
        403,
      ],
      [{ ...headers, "Sec-Fetch-Site": "cross-site" }, '{"code":"x"}', 403],
      [
        { Origin: base, "Content-Type": "application/json" },
        '{"code":"x"}',
        403,
      ],
      [{ ...headers, "Content-Type": "text/plain" }, '{"code":"x"}', 415],
      [headers, "not json", 400],
      [headers, '{"code":12}', 400],
      [headers, '{"code":"x","flags":["-include","/etc/passwd"]}', 400],
      [headers, JSON.stringify({ code: "x".repeat(170 * 1024) }), 413],
    ];
    for (const [requestHeaders, body, status] of rejected) {
      r = await fetch(base + "/api/compiler/run", {
        method: "POST",
        headers: requestHeaders,
        body,
      });
      assert.equal(r.status, status, JSON.stringify(requestHeaders));
      await r.arrayBuffer();
    }
    assert.equal(executions, 1);
    r = await fetch(base + "/api/compiler/run");
    assert.equal(r.status, 405);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

test("closing the editor request cancels active work without aborting a completed upload", async () => {
  let started!: () => void;
  let cancelled!: () => void;
  const startedPromise = new Promise<void>(resolve => { started=resolve; });
  const cancelledPromise = new Promise<void>(resolve => { cancelled=resolve; });
  const handler = createCompilerMiddleware({
    health: async () => ({available:true,language:"C++17",message:"Listo",limits:{codeBytes:65536,inputBytes:32768,outputBytes:65536,compileMs:15000,runMs:3000}}),
    execute: async (_data, signal) => {
      assert.equal(signal?.aborted,false);
      started();
      await new Promise<void>(resolve => signal?.addEventListener("abort",()=>{cancelled();resolve();},{once:true}));
      return {status:"cancelled",stdout:"",stderr:"",compileOutput:"",exitCode:null,durationMs:1};
    },
  });
  const server = createServer((req,res)=>{void handler(req,res,()=>{res.writeHead(404);res.end();});});
  await new Promise<void>(resolve=>server.listen(0,"127.0.0.1",resolve));
  const address=server.address();
  assert.ok(address&&typeof address==="object");
  const base=`http://127.0.0.1:${address.port}`;
  const client=request(base+"/api/compiler/run",{method:"POST",headers:{Origin:base,"Content-Type":"application/json","X-OMI-Compiler":"1"}});
  client.on("error",()=>{});
  try {
    client.end(JSON.stringify({code:"int main(){}"}));
    await startedPromise;
    client.destroy();
    await Promise.race([cancelledPromise,new Promise<never>((_,reject)=>{const t=setTimeout(()=>reject(new Error("Disconnect did not cancel execution")),1000);t.unref();})]);
    const health=await fetch(base+"/api/compiler/health");
    assert.equal(health.status,200);
  } finally {
    client.destroy();server.closeAllConnections();
    await new Promise<void>((resolve,reject)=>server.close(error=>error?reject(error):resolve()));
  }
});
