"use client";

import { useState } from "react";
import {
  ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, Clock3,
  Layers3, Search, X, Play, Circle, Sparkles,
} from "lucide-react";
import { levels, lessons } from "@/lib/curriculum";
import type { Progress } from "@/lib/progress";

const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function CurriculumBrowser({ selected, progress, openLesson }: {
  selected?: string;
  progress: Progress;
  openLesson: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos");
  const [showOptional, setShowOptional] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [expandMode, setExpandMode] = useState<"auto" | "open" | "closed">("auto");
  const complete = new Set(progress.completedLessons);
  const completedCount = lessons.filter((lesson) => complete.has(lesson.id)).length;
  const activeLevel = levels.find((level) => level.id === selected);
  const selectedLessons = lessons.filter((lesson) => !selected || lesson.level === selected);
  const lastLesson = selectedLessons.find((lesson) => lesson.id === progress.lastLesson && !complete.has(lesson.id));
  const nextPending = selectedLessons.find((lesson) => !complete.has(lesson.id));
  const nextLesson = lastLesson || nextPending || selectedLessons[0];
  const filtered = selectedLessons.filter((lesson) =>
    (showOptional || !lesson.optional) &&
    (status === "todos" || (status === "completadas" ? complete.has(lesson.id) : !complete.has(lesson.id))) &&
    normalize(`${lesson.title} ${lesson.description} ${lesson.category || ""} ${lesson.source?.key || ""}`).includes(normalize(query)),
  );
  const searching = Boolean(query.trim()) || status !== "todos";
  const hasFilters = Boolean(query) || status !== "todos" || !showOptional;
  const chapterIsOpen = (key: string, levelIndex: number) => expanded[key] ?? (
    expandMode === "open" || (expandMode === "auto" && (searching || Boolean(selected) || levelIndex < 2))
  );
  const visibleChapters = levels.flatMap((level, index) =>
    [...new Set(filtered.filter((lesson) => lesson.level === level.id).map((lesson) => lesson.category || "Lecciones esenciales"))]
      .map((category) => ({ key: `${level.id}/${category}`, index })),
  );
  const allExpanded = visibleChapters.length > 0 && visibleChapters.every(({ key, index }) => chapterIsOpen(key, index));
  const clearQuery = () => { setQuery(""); setExpanded({}); setExpandMode("auto"); };
  const resetFilters = () => { clearQuery(); setStatus("todos"); setShowOptional(true); };

  return (
    <div className="curriculum-studio">
      <header className="route-heading">
        <div className="route-heading-copy">
          <span className="route-kicker"><span /> CURSO DE PROGRAMACIÓN</span>
          <h1>Temario</h1>
          <p>Las lecciones están ordenadas por nivel. Cada una incluye una explicación, ejemplos y ejercicios con solución.</p>
        </div>
        <div className="route-start">
          <span className="route-start-label">{lastLesson ? "ÚLTIMA LECCIÓN" : nextPending ? "SIGUIENTE LECCIÓN" : "REPASO"}</span>
          <strong>{nextLesson?.title || "Explora la ruta"}</strong>
          <span className="route-start-description">{nextLesson ? levels.find((level) => level.id === nextLesson.level)?.title : "Elige una etapa para comenzar"}</span>
          {nextLesson && <button type="button" onClick={() => openLesson(nextLesson.id)}>
            {lastLesson ? "Continuar lección" : !nextPending ? "Repasar una lección" : completedCount ? "Abrir lección" : "Abrir lección"}<ArrowUpRight size={17} />
          </button>}
        </div>
      </header>

      <div className="route-overview" aria-label="Resumen de la ruta">
        <div><strong>{levels.length}</strong><span>niveles</span></div>
        <div><strong>{lessons.length}</strong><span>lecciones</span></div>
        <div className="route-overview-progress"><strong>{completedCount}<small> / {lessons.length}</small></strong><span>lecciones completadas</span><div className="route-progress-track" aria-hidden="true"><span style={{ width: `${completedCount / lessons.length * 100}%` }} /></div></div>
      </div>

      <div className="route-directory">
        <aside className="route-stage-rail">
          <span className="route-rail-label">NIVELES</span>
          <nav aria-label="Etapas del temario" className="route-stage-nav">
            <a href="#/ruta" className={!selected ? "is-selected" : ""} aria-current={!selected ? "page" : undefined}>
              <Layers3 size={17} /><span>Todos los niveles</span><small>{lessons.length}</small>
            </a>
            {levels.map((level, index) => {
              const items = lessons.filter((lesson) => lesson.level === level.id);
              const done = items.filter((lesson) => complete.has(lesson.id)).length;
              return <a href={`#/ruta/${level.id}`} key={level.id} className={selected === level.id ? "is-selected" : ""} aria-current={selected === level.id ? "page" : undefined}>
                <span className="route-stage-index">{String(index + 1).padStart(2, "0")}</span><span>{level.title}</span>
                {done === items.length ? <Check size={14} aria-label="Etapa completada" /> : <small>{items.length}</small>}
              </a>;
            })}
          </nav>
          <div className="route-rail-note"><Sparkles size={17} /><p>¿Es tu primera vez?<br />Empieza con <a href="#/ruta/inicio">Primeros pasos</a>. No necesitas experiencia.</p></div>
        </aside>

        <div className="route-directory-main">
          <div className="route-directory-heading">
            <div><h2>{activeLevel?.title || "Todos los temas"}</h2></div>
            <span className="route-filter-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "lección" : "lecciones"}</span>
          </div>
          {activeLevel && <p className="route-selected-description">{activeLevel.description}</p>}
          <div className="route-filter-bar">
            <div className="route-search"><Search size={17} /><input aria-label="Buscar en el temario" placeholder="Buscar por tema…" value={query} onChange={(event) => { setQuery(event.target.value); setExpandMode("auto"); setExpanded({}); }} />{query && <button type="button" aria-label="Limpiar búsqueda del temario" onClick={clearQuery}><X size={15} /></button>}</div>
            <select aria-label="Filtrar lecciones por avance" value={status} onChange={(event) => { setStatus(event.target.value); setExpandMode("auto"); setExpanded({}); }}><option value="todos">Todo el avance</option><option value="pendientes">Por aprender</option><option value="completadas">Completadas</option></select>
          </div>
          <div className="route-list-controls">
            <label><input type="checkbox" checked={showOptional} onChange={(event) => setShowOptional(event.target.checked)} />Incluir opcionales</label>
            <button type="button" disabled={!visibleChapters.length} onClick={() => { setExpandMode(allExpanded ? "closed" : "open"); setExpanded({}); }}><Layers3 size={14} />{allExpanded ? "Contraer capítulos" : "Desplegar capítulos"}</button>
          </div>
          {hasFilters && <div className="route-filter-summary"><span>Filtros aplicados</span><button type="button" onClick={resetFilters}>Limpiar filtros<X size={12} /></button></div>}

          <div className="route-level-list">
            {levels.filter((level) => (!selected || selected === level.id) && filtered.some((lesson) => lesson.level === level.id)).map((level) => {
              const index = levels.indexOf(level);
              const levelItems = lessons.filter((lesson) => lesson.level === level.id);
              const visible = filtered.filter((lesson) => lesson.level === level.id);
              const categories = [...new Set(visible.map((lesson) => lesson.category || "Lecciones esenciales"))];
              const done = levelItems.filter((lesson) => complete.has(lesson.id)).length;
              const previous = levels.find((stage) => stage.id === level.prerequisite);
              return <section className="route-level" key={level.id} aria-labelledby={`route-level-${level.id}`}>
                <header className="route-level-heading">
                  <span className="route-level-index">{String(index + 1).padStart(2, "0")}</span>
                  <div className="route-level-copy"><span>{level.eyebrow}</span><h3 id={`route-level-${level.id}`}>{level.title}</h3><p>{level.description}</p></div>
                  <div className="route-level-progress"><span><strong>{done}</strong> / {levelItems.length}</span><div className="route-progress-track" aria-hidden="true"><span style={{ width: `${done / levelItems.length * 100}%` }} /></div><small>completadas</small></div>
                </header>
                {previous && <div className="route-prerequisite"><BookOpen size={13} /><span>Conocimientos previos: <a href={`#/ruta/${previous.id}`}>{previous.title}<ArrowUpRight size={12} /></a></span>{level.id === "avanzado" && <small>Especialidades opcionales</small>}</div>}
                {categories.map((category, categoryIndex) => {
                  const key = `${level.id}/${category}`;
                  const items = visible.filter((lesson) => (lesson.category || "Lecciones esenciales") === category);
                  const isOpen = chapterIsOpen(key, index);
                  const completed = items.filter((lesson) => complete.has(lesson.id)).length;
                  const regionId = `chapter-${index}-${categoryIndex}`;
                  return <div className="route-chapter" key={key}>
                    <button type="button" className="route-chapter-toggle" aria-expanded={isOpen} aria-controls={regionId} onClick={() => setExpanded((current) => ({ ...current, [key]: !isOpen }))}>
                      <ChevronDown size={15} className={isOpen ? "is-open" : ""} /><strong>{category}</strong><span>{completed > 0 ? `${completed} / ${items.length}` : `${items.length} ${items.length === 1 ? "lección" : "lecciones"}`}</span>
                    </button>
                    <div id={regionId} hidden={!isOpen} className="route-chapter-lessons">
                      {items.map((lesson) => {
                        const completed = complete.has(lesson.id);
                        const current = !completed && progress.lastLesson === lesson.id;
                        return <button type="button" className={`route-lesson ${completed ? "is-completed" : ""} ${current ? "is-current" : ""}`} onClick={() => openLesson(lesson.id)} key={lesson.id}>
                          <span className="route-lesson-state" aria-hidden="true">{completed ? <Check size={15} /> : current ? <Play size={12} fill="currentColor" /> : <Circle size={14} />}</span>
                          <span className="route-lesson-copy"><strong>{lesson.title}</strong><span>{lesson.description}</span><span className="route-lesson-mobile-meta"><Clock3 size={11} />{lesson.minutes} min{completed ? " · Completada" : current ? " · En curso" : ""}{lesson.optional ? " · Opcional" : ""}</span></span>
                          <span className="route-lesson-meta">{completed ? <span className="route-status-done">Completada</span> : current ? <span className="route-status-current">En curso</span> : lesson.optional ? <span className="route-status-optional">Opcional</span> : null}<span className="route-lesson-time"><Clock3 size={12} />{lesson.minutes} min</span></span>
                          <ArrowUpRight size={16} className="route-lesson-arrow" />
                        </button>;
                      })}
                    </div>
                  </div>;
                })}
              </section>;
            })}
          </div>
          {!filtered.length && <div className="route-empty"><Search size={27} /><h3>No encontramos ese tema</h3><p>Prueba con otra palabra o cambia los filtros de avance.</p><button type="button" onClick={resetFilters}>Limpiar filtros<ArrowRight size={15} /></button></div>}
        </div>
      </div>

      <footer className="route-reference"><BookOpen size={16} /><p>El temario sigue la organización de <a href="https://usaco.guide/" target="_blank" rel="noopener noreferrer">USACO Guide<ArrowUpRight size={12} /></a>, con explicaciones y ejercicios en español.</p></footer>
    </div>
  );
}
