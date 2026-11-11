"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  Check,
  Code2,
  Download,
  LoaderCircle,
  Play,
  RotateCcw,
  Square,
  Terminal,
  WifiOff,
} from "lucide-react";
import type { CompilerHealth, CompilerResult } from "@/lib/compiler-contract";
import { getBrowserCompilerHealth, executeBrowserCpp } from "@/lib/browser-compiler";
import { checkExerciseCases, type CaseResult, type ExerciseCase } from "@/lib/exercise-judge";
import "./cpp-playground.css";

export type CppPlaygroundProps = {
  initialCode?: string;
  initialInput?: string;
  storageKey?: string;
  title?: string;
  compact?: boolean;
  testCases?: ExerciseCase[];
  onTestsPassed?: () => void;
};

const starterCode = `#include <iostream>
using namespace std;

int main() {
    cout << "¡Hola, Morelos!" << '\\n';
    return 0;
}
`;

const statusLabels: Record<CompilerResult["status"], string> = {
  success: "Ejecución completada",
  compile_error: "Revisa tu código",
  runtime_error: "El programa terminó con un error",
  timeout: "Se agotó el tiempo",
  output_limit: "Demasiada salida",
  unavailable: "Compilador no disponible",
  busy: "Compilador ocupado",
  invalid_request: "No se pudo ejecutar",
  cancelled: "Ejecución cancelada",
};

const statusHelp: Record<CompilerResult["status"], string> = {
  success:
    "El programa terminó con código de salida 0. Revisa si la salida coincide con lo que esperabas.",
  compile_error:
    "C++ necesita corregir estos errores antes de ejecutar. Empieza por el primer mensaje y su número de línea.",
  runtime_error:
    "El código compiló, pero el programa terminó con un código distinto de 0 o una señal. Revisa la entrada y las operaciones que realiza.",
  timeout:
    "La compilación o ejecución excedió su límite. Comprueba si hay un ciclo que nunca termina.",
  output_limit:
    "El programa produjo más texto del permitido. Revisa si estás imprimiendo dentro de un ciclo sin fin.",
  unavailable:
    "No fue posible preparar el compilador. Comprueba tu conexión y vuelve a intentarlo.",
  busy: "Hay otra ejecución en curso. Espera un momento y vuelve a intentarlo.",
  invalid_request: "Revisa el código y la entrada antes de volver a ejecutar.",
  cancelled: "Puedes editar el código y volver a ejecutar cuando quieras.",
};

function emptyResult(
  status: CompilerResult["status"],
  message?: string,
): CompilerResult {
  return {
    status,
    stdout: "",
    stderr: "",
    compileOutput: "",
    exitCode: null,
    durationMs: 0,
    message,
  };
}

export default function CppPlayground(props: CppPlaygroundProps) {
  // A different lesson gets its own lifecycle, abort controller and saved draft.
  return <PlaygroundSession key={props.storageKey ?? "libre"} {...props} />;
}

function PlaygroundSession({
  initialCode = starterCode,
  initialInput = "",
  storageKey = "libre",
  title = "Tu espacio para programar",
  compact = false,
  testCases,
  onTestsPassed,
}: CppPlaygroundProps) {
  const id = useId();
  const draftKey = `omi-morelos-cpp-draft-v1:${storageKey}`;
  const [code, setCode] = useState(initialCode);
  const [stdin, setStdin] = useState(initialInput);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [health, setHealth] = useState<CompilerHealth | null>(null);
  const [healthError, setHealthError] = useState("");
  const [healthAttempt, setHealthAttempt] = useState(0);
  const [checking, setChecking] = useState(true);
  const [running, setRunning] = useState(false);
  const [runProgress, setRunProgress] = useState("");
  const [result, setResult] = useState<CompilerResult | null>(null);
  const [caseResults, setCaseResults] = useState<CaseResult[]>([]);
  const [testsPassed, setTestsPassed] = useState(false);
  const [notice, setNotice] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const sequenceRef = useRef(0);
  const runningRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(draftKey);
      if (stored && stored.length <= 1_000_000) {
        const draft = JSON.parse(stored);
        if (typeof draft.code === "string" && typeof draft.stdin === "string") {
          setCode(draft.code);
          setStdin(draft.stdin);
        }
      }
    } catch {
      // A blocked store or an old malformed draft must not prevent programming.
    }
    setReady(true);
    return () => {
      sequenceRef.current += 1;
      requestRef.current?.abort();
      runningRef.current = false;
    };
  }, [draftKey]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(draftKey, JSON.stringify({ code, stdin }));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [code, stdin, draftKey, ready]);

  useEffect(() => {
    const controller = new AbortController();
    setChecking(true);
    setHealthError("");
    void getBrowserCompilerHealth()
      .then((data) => {
        if (!controller.signal.aborted) setHealth(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setHealth(null);
          setHealthError("No se pudo preparar el compilador en este navegador.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setChecking(false);
      });
    return () => controller.abort();
  }, [healthAttempt]);

  function invalidate() {
    sequenceRef.current += 1;
    requestRef.current?.abort();
    requestRef.current = null;
    if (runningRef.current || result)
      setNotice(
        "Cambiaste el código o la entrada. Ejecuta de nuevo para ver el resultado actualizado.",
      );
    runningRef.current = false;
    setRunning(false);
    setResult(null);
    setCaseResults([]);
    setTestsPassed(false);
    setConfirmReset(false);
  }

  async function run(checkCases = false) {
    if (runningRef.current || !ready || !health?.available || checking) return;
    setNotice("");
    setConfirmReset(false);
    const bytes = new TextEncoder();
    if (!code.trim()) {
      setResult(
        emptyResult(
          "invalid_request",
          "Escribe un programa antes de ejecutar.",
        ),
      );
      textareaRef.current?.focus();
      return;
    }
    if (
      bytes.encode(code).length > health.limits.codeBytes ||
      (!(checkCases && testCases?.length) &&
        bytes.encode(stdin).length > health.limits.inputBytes)
    ) {
      setResult(
        emptyResult(
          "invalid_request",
          `El código admite hasta ${Math.floor(health.limits.codeBytes / 1024)} KB y la entrada hasta ${Math.floor(health.limits.inputBytes / 1024)} KB. Reduce su tamaño para continuar.`,
        ),
      );
      return;
    }
    const request = ++sequenceRef.current;
    const controller = new AbortController();
    requestRef.current = controller;
    runningRef.current = true;
    setRunning(true);
    setRunProgress("Preparando el compilador…");
    setResult(null);
    setCaseResults([]);
    setTestsPassed(false);
    try {
      if (checkCases && testCases?.length) {
        const passed = await checkExerciseCases(code, testCases, executeBrowserCpp, controller.signal,
          (item) => {
            if (request === sequenceRef.current && !controller.signal.aborted) {
              setCaseResults(previous => [...previous, item]);
              setResult(item.execution);
            }
          },
          (message) => {
            if (request === sequenceRef.current && !controller.signal.aborted) setRunProgress(message);
          });
        if (request === sequenceRef.current && !controller.signal.aborted) {
          setTestsPassed(passed);
          if (passed) onTestsPassed?.();
        }
        return;
      }
      const data = await executeBrowserCpp({ code, stdin }, controller.signal, (message) => {
        if (request === sequenceRef.current && !controller.signal.aborted)
          setRunProgress(message);
      });
      if (request === sequenceRef.current && !controller.signal.aborted)
        setResult(data);
    } catch {
      if (request === sequenceRef.current && !controller.signal.aborted) {
        setResult(
          emptyResult(
            "unavailable",
            "No se pudo cargar o ejecutar el compilador. Tu código sigue en el editor; comprueba tu conexión y vuelve a intentarlo.",
          ),
        );
      }
    } finally {
      if (request === sequenceRef.current) {
        requestRef.current = null;
        runningRef.current = false;
        setRunning(false);
      }
    }
  }

  function stop() {
    sequenceRef.current += 1;
    requestRef.current?.abort();
    requestRef.current = null;
    runningRef.current = false;
    setRunning(false);
    setTestsPassed(false);
    setResult(emptyResult("cancelled"));
    setNotice("");
  }

  function reset() {
    invalidate();
    setCode(initialCode);
    setStdin(initialInput);
    setNotice("Restauraste el código y la entrada iniciales.");
    if (textareaRef.current) textareaRef.current.scrollTop = 0;
    if (lineNumbersRef.current)
      lineNumbersRef.current.style.transform = "translateY(0)";
    textareaRef.current?.focus();
  }

  function download() {
    const url = URL.createObjectURL(
      new Blob([code], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "mi-programa.cpp";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const compilerAvailable = health?.available && !checking;
  const outputTitle = running
    ? runProgress || "Compilando y ejecutando…"
    : result
      ? statusLabels[result.status]
      : "Aquí verás el resultado";

  return (
    <section
      className={`cpp-playground${compact ? " cpp-playground--compact" : ""}`}
      aria-labelledby={`${id}-title`}
      onKeyDown={(event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
          event.preventDefault();
          void run();
        }
      }}
    >
      <div className="cpp-heading">
        <div className="cpp-heading-icon">
          <Code2 size={21} aria-hidden="true" />
        </div>
        <div>
          <h2 id={`${id}-title`}>{title}</h2>
          <p>Escribe el código y los datos de entrada. Luego pulsa Ejecutar.</p>
        </div>
        <span className="cpp-language">C++17</span>
      </div>

      <div
        className={`cpp-connection${!checking && !compilerAvailable ? " cpp-connection--offline" : ""}`}
      >
        {checking ? (
          <LoaderCircle size={14} className="cpp-spinner" aria-hidden="true" />
        ) : compilerAvailable ? (
          <span className="cpp-connected-dot" />
        ) : (
          <WifiOff size={14} aria-hidden="true" />
        )}
        <span role="status">
          {checking
            ? "Comprobando el navegador…"
            : compilerAvailable
              ? "C++ en tu navegador · sin instalaciones"
              : healthError || health?.message || "Compilador no disponible"}
        </span>
        {!checking && !compilerAvailable && (
          <button
            type="button"
            onClick={() => setHealthAttempt((attempt) => attempt + 1)}
          >
            Volver a comprobar
          </button>
        )}
        {compilerAvailable && health && (
          <span className="cpp-limits">
            Máximo {health.limits.runMs / 1000} s por ejecución
          </span>
        )}
      </div>

      <p className="cpp-download-note">
        La primera ejecución descarga el compilador (aprox. 19 MB) y puede tardar.
        Después, el navegador reutiliza los archivos guardados cuando es posible.
      </p>

      <div className="cpp-workspace">
        <div className="cpp-source-panel">
          <div className="cpp-panel-header">
            <label htmlFor={`${id}-code`}>
              <Code2 size={15} aria-hidden="true" /> mi-programa.cpp
            </label>
            <span className="cpp-draft-status">
              {ready ? (
                saved ? (
                  <>
                    <Check size={12} aria-hidden="true" /> Borrador guardado
                  </>
                ) : (
                  "Guardado local no disponible"
                )
              ) : (
                "Cargando borrador…"
              )}
            </span>
          </div>
          <div className="cpp-editor">
            <div className="cpp-gutter" aria-hidden="true">
              <div className="cpp-line-numbers" ref={lineNumbersRef}>
                {code.split("\n").map((_, index) => (
                  <span key={index}>{index + 1}</span>
                ))}
              </div>
            </div>
            <textarea
              id={`${id}-code`}
              ref={textareaRef}
              aria-label="Editor de código C++"
              aria-describedby={`${id}-editor-help`}
              className="cpp-code"
              value={code}
              disabled={!ready}
              onChange={(event) => {
                invalidate();
                setCode(event.target.value);
              }}
              onScroll={(event) => {
                if (lineNumbersRef.current)
                  lineNumbersRef.current.style.transform = `translateY(-${event.currentTarget.scrollTop}px)`;
              }}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              wrap="off"
            />
          </div>
          <div id={`${id}-editor-help`} className="cpp-editor-help">
            <span>Ctrl / ⌘ + Enter para ejecutar</span>
            <span>Tab cambia de campo</span>
          </div>
        </div>

        <div className="cpp-io-panel">
          <div className="cpp-input-panel">
            <div className="cpp-panel-header">
              <label htmlFor={`${id}-input`}>
                <Terminal size={15} aria-hidden="true" /> Entrada (stdin)
              </label>
              <span>Opcional</span>
            </div>
            <textarea
              id={`${id}-input`}
              className="cpp-input"
              value={stdin}
              onChange={(event) => {
                invalidate();
                setStdin(event.target.value);
              }}
              disabled={!ready}
              placeholder={
                "Escribe aquí los datos que leerá cin.\nPor ejemplo: 5 8"
              }
              aria-describedby={`${id}-input-help`}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
            <p id={`${id}-input-help`} className="cpp-input-help">
              Escribe toda la entrada antes de ejecutar. El programa la recibe
              de una vez.
            </p>
          </div>
          <div
            className={`cpp-result${result ? ` cpp-result--${result.status}` : ""}`}
            aria-busy={running}
          >
            <div
              className="cpp-result-heading"
              role="status"
              aria-live="polite"
            >
              <strong>
                {running && (
                  <LoaderCircle
                    size={15}
                    className="cpp-spinner"
                    aria-hidden="true"
                  />
                )}
                {outputTitle}
              </strong>
              {result && result.durationMs > 0 && (
                <span>{Math.round(result.durationMs)} ms</span>
              )}
            </div>
            {!result && (
              <p className="cpp-output-placeholder">
                {running
                  ? "Espera un momento. Puedes detener la ejecución cuando quieras."
                  : "Pulsa Ejecutar para compilar tu código y ver lo que imprime."}
              </p>
            )}
            {result && (
              <>
                <p className="cpp-result-help">
                  {result.message || statusHelp[result.status]}
                </p>
                {(result.stdout ||
                  result.status === "success" ||
                  result.status === "runtime_error") && (
                  <div className="cpp-output-block">
                    <h3>Salida (stdout)</h3>
                    {result.stdout ? (
                      <pre tabIndex={0} aria-label="Salida del programa">
                        {result.stdout}
                      </pre>
                    ) : (
                      <p className="cpp-no-output">
                        El programa no imprimió texto en la salida.
                      </p>
                    )}
                  </div>
                )}
                {result.compileOutput && (
                  <div className="cpp-output-block">
                    <h3>Mensajes del compilador</h3>
                    <pre tabIndex={0} aria-label="Mensajes del compilador">
                      {result.compileOutput}
                    </pre>
                  </div>
                )}
                {result.stderr && (
                  <div className="cpp-output-block">
                    <h3>Salida de errores (stderr)</h3>
                    <pre
                      tabIndex={0}
                      aria-label="Salida de errores del programa"
                    >
                      {result.stderr}
                    </pre>
                  </div>
                )}
                {result.exitCode !== null && (
                  <p className="cpp-exit-code">
                    Código de salida: <strong>{result.exitCode}</strong>
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="cpp-actions">
        {running ? (
          <button type="button" className="cpp-run cpp-stop" onClick={stop}>
            <Square size={14} fill="currentColor" aria-hidden="true" /> Detener
          </button>
        ) : (
          <button
            type="button"
            className="cpp-run"
            disabled={!compilerAvailable || !ready}
            onClick={() => void run()}
          >
            <Play size={15} fill="currentColor" aria-hidden="true" /> Ejecutar
            código
          </button>
        )}
        {!!testCases?.length && !running && (
          <button type="button" className="cpp-secondary" disabled={!compilerAvailable || !ready}
            onClick={() => void run(true)}>
            <Check size={16} /> Comprobar {testCases.length} casos
          </button>
        )}
        <button
          type="button"
          className="cpp-secondary"
          onClick={download}
          disabled={!ready}
        >
          <Download size={15} aria-hidden="true" /> Descargar .cpp
        </button>
        <button
          type="button"
          className="cpp-secondary cpp-reset"
          onClick={() => setConfirmReset((value) => !value)}
          disabled={!ready}
          aria-expanded={confirmReset}
        >
          <RotateCcw size={14} aria-hidden="true" /> Restaurar
        </button>
      </div>
      {caseResults.length > 0 && (
        <section className="cpp-case-results" aria-label="Resultados de los casos">
          <h3 role="status">{testsPassed ? `${testCases!.length} casos correctos` : `${caseResults.filter(item => item.status === "passed").length} de ${testCases?.length} casos superados`}</h3>
          {caseResults.map(item => (
            <details key={item.index} open={item.status !== "passed"}>
              <summary>Caso {item.index + 1} · {item.status === "passed" ? "Correcto" : item.status === "wrong_answer" ? "La salida no coincide" : statusLabels[item.execution.status]}</summary>
              <div className="cpp-case-comparison">
                <div><strong>Entrada</strong><pre>{item.input || "(sin entrada)"}</pre></div>
                <div><strong>Salida esperada</strong><pre>{item.expected || "(vacía)"}</pre></div>
                <div><strong>Tu salida</strong><pre>{item.actual || "(vacía)"}</pre></div>
              </div>
            </details>
          ))}
          <p>Se comparan las palabras y los números, ignorando espacios y saltos de línea. Estos casos ayudan a detectar errores; justifica también por qué funciona tu algoritmo.</p>
        </section>
      )}
      {confirmReset && (
        <div
          className="cpp-reset-confirm"
          role="group"
          aria-label="Confirmar restauración"
        >
          <p>
            ¿Restaurar el código y la entrada iniciales? Se reemplazará este
            borrador.
          </p>
          <div>
            <button type="button" onClick={reset}>
              Sí, restaurar
            </button>
            <button type="button" onClick={() => setConfirmReset(false)}>
              Conservar borrador
            </button>
          </div>
        </div>
      )}
      {notice && (
        <p className="cpp-notice" role="status">
          {notice}
        </p>
      )}
      <p className="cpp-footnote">
        Tu código se compila y ejecuta en este navegador, sin enviarlo a un servidor.
        El borrador se guarda en este dispositivo.{" "}
        {onTestsPassed ? "Pasar todos los casos registra el problema como resuelto." : "Comprueba también las entradas límite del enunciado."}
      </p>
    </section>
  );
}
