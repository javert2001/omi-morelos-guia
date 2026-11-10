import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { executeCpp, getCompilerStatus } from "../../lib/server/compiler.ts";
import type {
  CompilerRequest,
  CompilerResult,
  CompilerHealth,
} from "../../lib/compiler-contract.ts";

type Service = {
  execute: (
    request: CompilerRequest,
    signal?: AbortSignal,
  ) => Promise<CompilerResult>;
  health: () => Promise<CompilerHealth>;
};
const MAX_BODY_BYTES = 160 * 1024;
const LOCAL_ADDRESSES = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

function send(res: ServerResponse, status: number, value: unknown) {
  if (res.destroyed || res.writableEnded) return;
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(value));
}

function failure(
  message: string,
  status: CompilerResult["status"] = "invalid_request",
): CompilerResult {
  return {
    status,
    message,
    stdout: "",
    stderr: "",
    compileOutput: "",
    exitCode: null,
    durationMs: 0,
  };
}

function localRequest(req: IncomingMessage): boolean {
  if (!LOCAL_ADDRESSES.has(req.socket.remoteAddress || "")) return false;
  const host = req.headers.host;
  if (!host || !/^[a-zA-Z0-9.:[\]-]+$/.test(host)) return false;
  try {
    const destination = new URL(`http://${host}`);
    if (!LOCAL_HOSTS.has(destination.hostname)) return false;
    const origin = req.headers.origin;
    if (origin) {
      const source = new URL(origin);
      if (source.origin !== origin || source.origin !== destination.origin)
        return false;
    }
    const fetchSite = req.headers["sec-fetch-site"];
    return !fetchSite || fetchSite === "same-origin" || fetchSite === "none";
  } catch {
    return false;
  }
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let bytes = 0;
    const finish = (error?: Error) => {
      clearTimeout(timer);
      req.off("data", data);
      req.off("end", end);
      req.off("error", fail);
      req.off("aborted", aborted);
      if (error) {
        req.resume();
        reject(error);
      } else resolve(Buffer.concat(chunks).toString("utf8"));
    };
    const data = (chunk: Buffer) => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES)
        finish(new Error("El envío supera el límite de tamaño."));
      else chunks.push(chunk);
    };
    const end = () => finish();
    const fail = () => finish(new Error("No se pudo recibir el programa."));
    const aborted = () => finish(new Error("El envío se canceló."));
    const timer = setTimeout(
      () => finish(new Error("El envío tardó demasiado. Inténtalo de nuevo.")),
      5_000,
    );
    req.on("data", data);
    req.once("end", end);
    req.once("error", fail);
    req.once("aborted", aborted);
  });
}

export function createCompilerMiddleware(
  service: Service = { execute: executeCpp, health: getCompilerStatus },
) {
  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void,
  ) => {
    const path = (req.url || "").split("?")[0];
    if (!path.startsWith("/api/compiler/") && path !== "/api/compiler") {
      next();
      return;
    }
    if (!localRequest(req)) {
      send(
        res,
        403,
        failure(
          "El compilador solo acepta solicitudes desde esta aplicación local.",
        ),
      );
      return;
    }
    if (path === "/api/compiler/health" && req.method === "GET") {
      try {
        send(res, 200, await service.health());
      } catch {
        send(
          res,
          503,
          failure("El compilador local no está disponible.", "unavailable"),
        );
      }
      return;
    }
    if (path !== "/api/compiler/run") {
      send(res, 404, failure("Ruta del compilador no encontrada."));
      return;
    }
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      send(res, 405, failure("Usa el botón Ejecutar de la guía."));
      return;
    }
    if (!req.headers.origin || req.headers["x-omi-compiler"] !== "1") {
      send(res, 403, failure("La solicitud debe venir del editor de la guía."));
      return;
    }
    if (
      !/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(
        req.headers["content-type"] || "",
      )
    ) {
      send(res, 415, failure("El programa debe enviarse como JSON."));
      return;
    }
    if (Number(req.headers["content-length"] || 0) > MAX_BODY_BYTES) {
      send(res, 413, failure("El envío supera el límite de tamaño."));
      return;
    }
    const controller = new AbortController();
    const abort = () => controller.abort();
    const closed = () => {
      if (!res.writableEnded) abort();
    };
    req.once("aborted", abort);
    res.once("close", closed);
    try {
      const value: unknown = JSON.parse(await readBody(req));
      if (!value || typeof value !== "object" || Array.isArray(value))
        throw new Error("Envía un programa válido.");
      const data = value as Record<string, unknown>;
      if (
        typeof data.code !== "string" ||
        (data.stdin !== undefined && typeof data.stdin !== "string") ||
        Object.keys(data).some((key) => key !== "code" && key !== "stdin")
      )
        throw new Error("El código y la entrada deben ser texto.");
      const result = await service.execute(
        { code: data.code, stdin: data.stdin as string | undefined },
        controller.signal,
      );
      const status =
        result.status === "busy"
          ? 429
          : result.status === "unavailable"
            ? 503
            : result.status === "invalid_request"
              ? 400
              : 200;
      send(res, status, result);
    } catch (error) {
      send(
        res,
        400,
        failure(
          error instanceof SyntaxError
            ? "El envío no contiene JSON válido."
            : error instanceof Error &&
                /^(El envío|No se pudo recibir|Envía un programa|El código)/.test(
                  error.message,
                )
              ? error.message
              : "No se pudo ejecutar el programa. Inténtalo de nuevo.",
        ),
      );
    } finally {
      req.off("aborted", abort);
      res.off("close", closed);
    }
  };
}

export function localCppCompiler(): Plugin {
  return {
    name: "omi-local-cpp-compiler",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(createCompilerMiddleware());
    },
  };
}
