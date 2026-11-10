export type CompilerRequest = { code: string; stdin?: string };

export type CompilerResult = {
  status:
    | "success"
    | "compile_error"
    | "runtime_error"
    | "timeout"
    | "output_limit"
    | "unavailable"
    | "busy"
    | "invalid_request"
    | "cancelled";
  stdout: string;
  stderr: string;
  compileOutput: string;
  exitCode: number | null;
  durationMs: number;
  message?: string;
};

export type CompilerHealth = {
  available: boolean;
  language: string;
  message: string;
  limits: {
    codeBytes: number;
    inputBytes: number;
    outputBytes: number;
    compileMs: number;
    runMs: number;
  };
};
