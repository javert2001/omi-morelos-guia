import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createServer } from "node:net";
import test from "node:test";
import { executeCpp, getCompilerStatus } from "../lib/server/compiler.ts";

const health = await getCompilerStatus();
const supported = { skip: health.available ? false : health.message };

test("compiler health describes exact limits without claiming a RAM boundary", () => {
  assert.equal(health.language, "C++17 · Apple Clang");
  assert.equal(health.limits.runMs, 3000);
  assert.equal(health.limits.compileMs, 15000);
  assert.equal(health.limits.outputBytes, 65536);
  if (health.available) assert.match(health.message, /RAM no tiene un límite estricto/);
});

test("C++17 stdin, stdout and the portable bits header work", supported, async () => {
  const result = await executeCpp({ code: `#include <bits/stdc++.h>
int main(){std::vector<int> a(3);for(auto& n:a)std::cin>>n;std::sort(a.begin(),a.end());for(int n:a)std::cout<<n<<" ";}`, stdin: "8 2 5\n" });
  assert.equal(result.status, "success", JSON.stringify(result));
  assert.equal(result.stdout, "2 5 8 ");
  assert.equal(result.exitCode, 0);
});

test("invalid source/input are rejected before execution", async () => {
  assert.equal((await executeCpp({ code: " " })).status, "invalid_request");
  assert.equal((await executeCpp({ code: "x".repeat(65537) })).status, "invalid_request");
  assert.equal((await executeCpp({ code: "int main(){}", stdin: "x".repeat(32769) })).status, "invalid_request");
});

test("compiler diagnostics and nonzero exit codes are distinct", supported, async () => {
  const compile = await executeCpp({ code: "int main(){ missing_symbol; }" });
  assert.equal(compile.status, "compile_error");
  assert.match(compile.compileOutput, /missing_symbol/);
  assert.match(compile.compileOutput, /\/programa\/main.cpp/);
  const runtime = await executeCpp({ code: "int main(){return 7;}" });
  assert.equal(runtime.status, "runtime_error");
  assert.equal(runtime.exitCode, 7);
});

test("absolute include and runtime access cannot expose or overwrite a project canary", supported, async () => {
  const directory = await mkdtemp(join(process.cwd(), ".omi-compiler-canary-"));
  const canary = join(directory, "private.txt");
  const secret = "OMI_CANARY_MUST_STAY_PRIVATE";
  await writeFile(canary, secret);
  try {
    const compile = await executeCpp({ code: `#include ${JSON.stringify(canary)}\nint main(){}` });
    assert.equal(compile.status, "compile_error");
    assert.ok(!compile.compileOutput.includes(secret));
    const runtime = await executeCpp({ code: `#include <cstdio>
int main(){
  FILE* read = fopen(${JSON.stringify(canary)}, "r");
  FILE* write = fopen(${JSON.stringify(canary)}, "w");
  FILE* local = fopen("unexpected-file.txt", "w");
  printf("%d %d %d", read == nullptr, write == nullptr, local == nullptr);
}` });
    assert.equal(runtime.status, "success", JSON.stringify(runtime));
    assert.equal(runtime.stdout, "1 1 1");
    assert.equal(await readFile(canary, "utf8"), secret);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("runtime denies fork, exec and inherited environment secrets", supported, async () => {
  const previous = process.env.OMI_TEST_DUMMY_SECRET;
  process.env.OMI_TEST_DUMMY_SECRET = "non-sensitive-test-value";
  try {
    const result = await executeCpp({ code: `#include <unistd.h>
#include <cstdio>
#include <cstdlib>
int main(){
  pid_t child = fork();
  if(child == 0) _exit(8);
  int executed = execl("/bin/echo", "echo", "ESCAPED", (char*)nullptr);
  printf("%d %d %d", child == -1, executed == -1, getenv("OMI_TEST_DUMMY_SECRET") == nullptr);
}` });
    assert.equal(result.status, "success", JSON.stringify(result));
    assert.equal(result.stdout, "1 1 1");
  } finally {
    if (previous === undefined) delete process.env.OMI_TEST_DUMMY_SECRET;
    else process.env.OMI_TEST_DUMMY_SECRET = previous;
  }
});

test("runtime cannot connect even to a disposable loopback listener", supported, async () => {
  let connections = 0;
  const server = createServer(socket => { connections += 1; socket.end(); });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  try {
    const result = await executeCpp({ code: `#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <cstdio>
int main(){int fd=socket(AF_INET, SOCK_STREAM, 0); sockaddr_in a{};a.sin_family=AF_INET;a.sin_port=htons(${address.port});inet_pton(AF_INET,"127.0.0.1",&a.sin_addr);int rc=fd<0?-1:connect(fd,(sockaddr*)&a,sizeof(a));printf("%d", rc==-1);if(fd>=0)close(fd);}` });
    assert.equal(result.status, "success", JSON.stringify(result));
    assert.equal(result.stdout, "1");
    assert.equal(connections, 0);
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});

test("unbounded output is stopped and retained output remains capped", supported, async () => {
  const result = await executeCpp({ code: '#include <cstdio>\nint main(){while(true)puts("123456789012345678901234567890");}' });
  assert.equal(result.status, "output_limit", JSON.stringify(result));
  assert.ok(Buffer.byteLength(result.stdout + result.stderr, "utf8") <= health.limits.outputBytes);
});

test("invalid UTF-8 cannot inflate serialized output beyond the byte cap", supported, async () => {
  const result = await executeCpp({ code: '#include <cstdio>\nint main(){for(int i=0;i<40000;i++)putchar(255);}' });
  assert.equal(result.status, "output_limit", JSON.stringify(result));
  assert.ok(Buffer.byteLength(result.stdout + result.stderr, "utf8") <= health.limits.outputBytes);
});

test("infinite execution stops at a CPU or wall time limit", supported, async () => {
  const result = await executeCpp({ code: "int main(){volatile unsigned long n=0;while(true)++n;}" });
  assert.equal(result.status, "timeout", JSON.stringify(result));
  assert.ok(result.durationMs < health.limits.compileMs + health.limits.runMs + 2000);
});

test("cancellation kills work and busy requests do not queue", supported, async () => {
  const controller = new AbortController();
  const pending = executeCpp({ code: "int main(){volatile unsigned long n=0;while(true)++n;}" }, controller.signal);
  const busy = await executeCpp({ code: "int main(){}" });
  assert.equal(busy.status, "busy");
  const timer = setTimeout(() => controller.abort(), 600);
  try {
    assert.equal((await pending).status, "cancelled");
  } finally {
    clearTimeout(timer);
  }
  assert.equal((await executeCpp({ code: "int main(){}" })).status, "success");
});
