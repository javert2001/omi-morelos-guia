"use client";
import { useEffect, useId, useState } from "react";
import { Check, Code2, Lightbulb, NotebookPen } from "lucide-react";
import type { LessonExercise } from "@/lib/curriculum/types";
import CppPlayground from "./cpp-playground";

const blankProgram = `#include <iostream>
using namespace std;

int main() {
    // Lee la entrada, resuelve el problema e imprime la respuesta.
    return 0;
}
`;

function Paragraphs({ text }: { text: string }) {
  return <>{text.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}</>;
}

function Exercise({ exercise, lessonId, index }: { exercise: LessonExercise; lessonId: string; index: number }) {
  const id = useId();
  const storageKey = `omi-morelos-exercise-v1:${lessonId}:${exercise.id}`;
  const [answer, setAnswer] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hints, setHints] = useState(0);
  const [editor, setEditor] = useState(false);
  const [solutionEditor, setSolutionEditor] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw && raw.length < 100_000) {
        const value = JSON.parse(raw);
        if (typeof value.answer === "string") setAnswer(value.answer);
        if (typeof value.reviewed === "boolean") setReviewed(value.reviewed);
      }
    } catch { /* An unavailable store never prevents studying. */ }
    setReady(true);
  }, [storageKey]);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ answer, reviewed }));
      setSaved(true);
    } catch { setSaved(false); }
  }, [answer, reviewed, ready, storageKey]);

  return <article className="study-exercise" aria-labelledby={`${id}-title`}>
    <div className="exercise-heading">
      <span className="exercise-number">{String(index + 1).padStart(2, "0")}</span>
      <div><span className="eyebrow">{exercise.code ? "PROGRAMA Y COMPRUEBA" : "RAZONA Y EXPLICA"}</span><h3 id={`${id}-title`}>{exercise.title}</h3></div>
      {reviewed && <span className="exercise-reviewed"><Check size={14} /> Revisado</span>}
    </div>
    <div className="exercise-prompt"><Paragraphs text={exercise.prompt} /></div>
    {(exercise.sampleInput !== undefined || exercise.sampleOutput !== undefined) && <div className="exercise-sample">
      <div><strong>Entrada de ejemplo</strong><pre>{exercise.sampleInput || "(sin entrada)"}</pre></div>
      <div><strong>Salida esperada</strong><pre>{exercise.sampleOutput || "(vacía)"}</pre></div>
    </div>}
    <label className="exercise-answer-label" htmlFor={`${id}-answer`}><NotebookPen size={16} /> Tu razonamiento</label>
    <textarea id={`${id}-answer`} rows={3} value={answer} disabled={!ready} maxLength={20000}
      placeholder="Escribe qué harías y por qué. Un ejemplo pequeño es un buen comienzo."
      onChange={e => { setAnswer(e.target.value); setReviewed(false); }} />
    <span className="exercise-save-status">{ready ? saved ? "Respuesta guardada en este navegador" : "Guardado local no disponible" : "Cargando respuesta…"}</span>
    <div className="exercise-actions">
      {hints < exercise.hints.length && <button className="button subtle" onClick={() => setHints(n => n + 1)}><Lightbulb size={16} /> {hints ? "Otra pista" : "Necesito una pista"}</button>}
      {exercise.code && <button className="button primary" aria-expanded={editor} onClick={() => setEditor(value => !value)}><Code2 size={16} /> {editor ? "Cerrar editor" : "Resolver en C++"}</button>}
    </div>
    {exercise.hints.slice(0, hints).map((hint, i) => <div className="exercise-hint" key={i}><strong>Pista {i + 1}</strong><Paragraphs text={hint} /></div>)}
    {editor && <CppPlayground initialCode={exercise.starterCode || blankProgram} initialInput={exercise.sampleInput || ""}
      storageKey={`exercise:${lessonId}:${exercise.id}`} title={`Resuelve: ${exercise.title}`} testCases={exercise.tests} compact />}
    <details className="exercise-solution">
      <summary>Ver solución explicada</summary>
      <div className="exercise-solution-body">
        <Paragraphs text={exercise.solution} />
        {exercise.code && <>
          <pre className="exercise-solution-code" tabIndex={0} aria-label={`Código de la solución: ${exercise.title}`}><code>{exercise.code}</code></pre>
          <button className="button subtle" aria-expanded={solutionEditor} onClick={() => setSolutionEditor(value => !value)}><Code2 size={16} /> {solutionEditor ? "Cerrar ejemplo" : "Experimentar con la solución"}</button>
          {solutionEditor && <CppPlayground initialCode={exercise.code} initialInput={exercise.sampleInput || ""} storageKey={`solution:${lessonId}:${exercise.id}`} title="Explora la solución" testCases={exercise.tests} compact />}
        </>}
        <label className="exercise-review"><input type="checkbox" checked={reviewed} onChange={e => setReviewed(e.target.checked)} /> Comparé mi razonamiento con la solución y puedo explicar la idea.</label>
      </div>
    </details>
  </article>;
}

export default function LessonExercises({ lessonId, exercises }: { lessonId: string; exercises: LessonExercise[] }) {
  return <section className="lesson-exercises" id="practica-local" aria-labelledby="practice-title">
    <div className="eyebrow"><Code2 size={16} /> APRENDE HACIENDO</div>
    <h2 id="practice-title">Tu turno, aquí mismo.</h2>
    <p className="exercise-intro">Inténtalo antes de abrir la solución. Si te atoras, pide una pista, trabaja un ejemplo pequeño y vuelve a probar.</p>
    {exercises.map((exercise, index) => <Exercise key={`${lessonId}:${exercise.id}`} lessonId={lessonId} exercise={exercise} index={index} />)}
  </section>;
}
