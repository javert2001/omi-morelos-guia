"use client";

import { useState } from "react";
import { ArrowUpRight, BookOpen, Code2, Lightbulb, Search, X } from "lucide-react";
import { lessons, levels } from "@/lib/curriculum";

const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function PracticeCatalog() {
  const [stage, setStage] = useState("todos");
  const [query, setQuery] = useState("");
  const modules = lessons.filter((lesson) => lesson.exercises?.length);
  const totalExercises = modules.reduce((sum, lesson) => sum + lesson.exercises!.length, 0);
  const filtered = modules.filter((lesson) => (stage === "todos" || stage === lesson.level) && normalize(`${lesson.title} ${lesson.description} ${lesson.category || ""} ${lesson.source?.key || ""}`).includes(normalize(query)));
  const filteredExercises = filtered.reduce((sum, lesson) => sum + lesson.exercises!.length, 0);
  const reset = () => { setQuery(""); setStage("todos"); };

  return <div className="practice-library">
    <div className="practice-library-intro">
      <div className="practice-intro-icon"><Code2 size={25} /></div>
      <div><span className="practice-kicker">DEL «LO ENTIENDO» AL «YA PUEDO»</span><h2>Una idea. Muchas formas de practicar.</h2><p>Empieza con un ejemplo, intenta resolverlo y descubre las pistas cuando las necesites. El editor de C++ está dentro de cada lección.</p></div>
      <div className="practice-total"><strong>{totalExercises}</strong><span>{totalExercises === 1 ? "ejercicio" : "ejercicios"} con solución</span></div>
    </div>

    <div className="practice-library-toolbar">
      <div className="practice-library-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Buscar práctica por tema" placeholder="¿Qué quieres practicar hoy?" />{query && <button type="button" aria-label="Limpiar búsqueda de práctica" onClick={() => setQuery("")}><X size={15} /></button>}</div>
      <select aria-label="Etapa de práctica" value={stage} onChange={(event) => setStage(event.target.value)}><option value="todos">Todas las etapas</option>{levels.filter((level) => modules.some((lesson) => lesson.level === level.id)).map((level) => <option key={level.id} value={level.id}>{level.title}</option>)}</select>
    </div>
    <div className="practice-results"><span aria-live="polite"><strong>{filtered.length}</strong> {filtered.length === 1 ? "tema" : "temas"}<span aria-hidden="true"> · </span>{filteredExercises} {filteredExercises === 1 ? "ejercicio" : "ejercicios"}</span>{(query || stage !== "todos") && <button type="button" onClick={reset}>Limpiar filtros<X size={12} /></button>}<span className="practice-help-note"><Lightbulb size={13} />Pistas y soluciones incluidas</span></div>

    <div className="practice-stage-list">
      {levels.map((level, index) => {
        const items = filtered.filter((lesson) => lesson.level === level.id);
        if (!items.length) return null;
        return <section className="practice-stage" key={level.id} aria-labelledby={`practice-${level.id}`}>
          <header className="practice-stage-heading"><div><span>{String(index + 1).padStart(2, "0")}</span><h2 id={`practice-${level.id}`}>{level.title}</h2><small>{items.length} {items.length === 1 ? "tema" : "temas"}</small></div><a href={`#/ruta/${level.id}`}>Ver etapa<ArrowUpRight size={13} /></a></header>
          <div className="practice-topic-grid">{items.map((lesson) => {
            const coding = lesson.exercises!.filter((exercise) => exercise.code).length;
            return <article className="practice-topic-card" key={lesson.id}><a href={`#/leccion/${lesson.id}`} aria-label={`Practicar: ${lesson.title}`}>
              <span className="practice-topic-category">{lesson.category || "Lecciones esenciales"}</span><span className="practice-topic-title"><h3>{lesson.title}</h3><ArrowUpRight size={17} /></span><p>{lesson.description}</p>
              <span className="practice-topic-footer"><span><BookOpen size={13} />{lesson.exercises!.length} {lesson.exercises!.length === 1 ? "ejercicio" : "ejercicios"}</span><span className={coding ? "practice-has-code" : ""}>{coding ? <Code2 size={13} /> : <Lightbulb size={13} />}{coding ? "Editor C++" : "Razonamiento"}</span></span>
            </a></article>;
          })}</div>
        </section>;
      })}
    </div>
    {!filtered.length && <div className="practice-library-empty"><Search size={27} /><h2>No encontramos ese tema</h2><p>Prueba otra palabra o explora todas las etapas.</p><button type="button" onClick={reset}>Limpiar filtros<ArrowUpRight size={15} /></button></div>}
  </div>;
}
