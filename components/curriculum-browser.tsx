"use client";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Compass,
  Layers3,
  Lightbulb,
  Search,
  Sprout,
  Code2,
  Medal,
  Network,
  Trophy,
  Binary,
} from "lucide-react";
import { levels, lessons, type Lesson } from "@/lib/curriculum";
import { guideIndex, guideCheckedAt } from "@/lib/curriculum/source-index";
import type { Progress } from "@/lib/progress";
const icons = [Sprout, Code2, Compass, Medal, Network, Trophy, Layers3, Binary];
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export default function CurriculumBrowser({
  selected,
  progress,
  openLesson,
}: {
  selected?: string;
  progress: Progress;
  openLesson: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos");
  const [showOptional, setShowOptional] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [expandMode, setExpandMode] = useState<"auto" | "open" | "closed">(
    "auto",
  );
  const sourceCount = new Set(
    lessons.flatMap((l) => (l.source ? [l.source.key] : [])),
  ).size;
  const filtered = lessons.filter(
    (l) =>
      (!selected || l.level === selected) &&
      (showOptional || !l.optional) &&
      (status === "todos" ||
        (status === "completadas"
          ? progress.completedLessons.includes(l.id)
          : !progress.completedLessons.includes(l.id))) &&
      normalize(
        `${l.title} ${l.description} ${l.category || ""} ${l.source?.key || ""}`,
      ).includes(normalize(query)),
  );
  const searching = Boolean(query) || status !== "todos";
  function toggle(key: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">CADA NUEVA IDEA ABRE UN CAMINO</div>
          <h1>De cero. Hasta donde quieras.</h1>
          <p>
            Un temario en español que te acompaña desde tu primer programa hasta
            los algoritmos avanzados.
          </p>
        </div>
      </div>
      <div className="curriculum-summary">
        <div>
          <strong>{levels.length}</strong>
          <span>etapas de aprendizaje</span>
        </div>
        <div>
          <strong>{lessons.length}</strong>
          <span>lecciones con preguntas</span>
        </div>
        <div>
          <strong>
            {sourceCount}
            <small> / {guideIndex.length}</small>
          </strong>
          <span>módulos de referencia cubiertos</span>
        </div>
        <a
          href="https://usaco.guide/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Basado en el temario de
          <br />
          <b>USACO Guide</b>
          <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="route-notice">
        <Lightbulb size={21} />
        <p>
          <strong>No necesitas saber programar para empezar.</strong> Comienza
          con Primeros pasos y Fundamentos. Después avanza por Bronce, Plata,
          Oro y Platino. General te acompaña durante todo el camino; Avanzado
          reúne especialidades para explorar con calma.
        </p>
      </div>
      <nav
        className="filter-tabs curriculum-tabs"
        aria-label="Etapas del temario"
      >
        <a className={!selected ? "selected" : ""} href="#/ruta">
          Toda la ruta
        </a>
        {levels.map((level, i) => (
          <a
            className={selected === level.id ? "selected" : ""}
            href={`#/ruta/${level.id}`}
            key={level.id}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {level.title}
          </a>
        ))}
      </nav>
      <div className="curriculum-toolbar">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Buscar en el temario"
            placeholder="Busca un tema: grafos, flujos, geometría..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              aria-label="Limpiar búsqueda del temario"
              onClick={() => setQuery("")}
            >
              ×
            </button>
          )}
        </div>
        <select
          aria-label="Filtrar lecciones por avance"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="todos">Todo el avance</option>
          <option value="pendientes">Por aprender</option>
          <option value="completadas">Completadas</option>
        </select>
        <label className="optional-filter">
          <input
            type="checkbox"
            checked={showOptional}
            onChange={(e) => setShowOptional(e.target.checked)}
          />
          Incluir opcionales
        </label>
      </div>
      <div className="curriculum-controls">
        <span>
          {filtered.length}{" "}
          {filtered.length === 1
            ? "lección disponible"
            : "lecciones disponibles"}
        </span>
        <button
          onClick={() => {
            setExpandMode(expandMode === "open" ? "closed" : "open");
            setExpanded(new Set());
          }}
        >
          <Layers3 size={14} />
          {expandMode === "open" ? "Contraer capítulos" : "Desplegar capítulos"}
        </button>
      </div>
      <div className="curriculum">
        {levels
          .filter(
            (level) =>
              (!selected || selected === level.id) &&
              filtered.some((l) => l.level === level.id),
          )
          .map((level) => {
            const i = levels.indexOf(level),
              Icon = icons[i % icons.length];
            const levelItems = lessons.filter((l) => l.level === level.id);
            const visible = filtered.filter((l) => l.level === level.id);
            const categories = [
              ...new Set(
                visible.map((l) => l.category || "Lecciones esenciales"),
              ),
            ];
            const previous = levels.find((l) => l.id === level.prerequisite);
            return (
              <section
                className="card curriculum-level expanded-curriculum"
                key={level.id}
              >
                <div className="curriculum-title">
                  <span className={`level-icon color-${i % 8}`}>
                    <Icon size={24} />
                  </span>
                  <div>
                    <span className="eyebrow">
                      ETAPA {String(i + 1).padStart(2, "0")} · {level.eyebrow}
                    </span>
                    <h2>{level.title}</h2>
                    <p>{level.description}</p>
                  </div>
                  <span className="level-total">
                    {
                      levelItems.filter((l) =>
                        progress.completedLessons.includes(l.id),
                      ).length
                    }{" "}
                    / {levelItems.length}
                  </span>
                </div>
                {previous && (
                  <div className="level-prerequisite">
                    <Layers3 size={13} />
                    Base recomendada:{" "}
                    <a href={`#/ruta/${previous.id}`}>
                      {previous.title}
                      <ArrowRight size={12} />
                    </a>
                    {level.id === "avanzado" && (
                      <span>Especialidades opcionales</span>
                    )}
                  </div>
                )}
                {categories.map((category, categoryIndex) => {
                  const key = `${level.id}/${category}`;
                  const items = visible.filter(
                    (l) => (l.category || "Lecciones esenciales") === category,
                  );
                  const defaultOpen =
                    expandMode === "open" ||
                    (expandMode === "auto" && (Boolean(selected) || i < 2));
                  const isOpen =
                    searching ||
                    (expanded.has(key) ? !defaultOpen : defaultOpen);
                  const completed = items.filter((l) =>
                    progress.completedLessons.includes(l.id),
                  ).length;
                  return (
                    <div className="curriculum-chapter" key={key}>
                      <button
                        className="chapter-toggle"
                        aria-expanded={isOpen}
                        aria-controls={`chapter-${i}-${categoryIndex}`}
                        onClick={() => toggle(key)}
                      >
                        <span className="chapter-index">
                          {String(categoryIndex + 1).padStart(2, "0")}
                        </span>
                        <strong>{category}</strong>
                        <span>
                          {completed}/{items.length}
                        </span>
                        <ChevronDown
                          size={17}
                          className={isOpen ? "rotated" : ""}
                        />
                      </button>
                      {isOpen && (
                        <div id={`chapter-${i}-${categoryIndex}`}>
                          {items.map((lesson: Lesson) => (
                            <button
                              className="lesson-row"
                              onClick={() => openLesson(lesson.id)}
                              key={lesson.id}
                            >
                              <span
                                className={`lesson-number ${progress.completedLessons.includes(lesson.id) ? "done" : ""}`}
                              >
                                {progress.completedLessons.includes(
                                  lesson.id,
                                ) ? (
                                  <Check size={16} />
                                ) : (
                                  <BookOpen size={14} />
                                )}
                              </span>
                              <span>
                                <strong>
                                  {lesson.title}
                                  {lesson.optional && (
                                    <em className="optional-chip">Opcional</em>
                                  )}
                                </strong>
                                <small>{lesson.description}</small>
                              </span>
                              <span className="lesson-time">
                                <Clock3 size={14} />
                                {lesson.minutes} min
                              </span>
                              <ChevronRight size={17} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            );
          })}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <Search size={35} />
          <h2>No encontramos lecciones con esos filtros</h2>
          <p>Prueba con otro tema o cambia el estado de avance.</p>
          <button
            className="button primary"
            onClick={() => {
              setQuery("");
              setStatus("todos");
              setShowOptional(true);
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
      <div className="curriculum-reference">
        <BookOpen size={17} />
        <p>
          Cobertura cotejada con los {guideIndex.length} módulos del índice
          público de USACO Guide el{" "}
          {new Date(guideCheckedAt + "T12:00:00").toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          . Cada tema tiene explicaciones, ejemplos y ejercicios locales
          en español. La referencia se conserva como lectura opcional.{" "}
          <a
            href="https://github.com/cpinitiative/usaco-guide/blob/master/content/ordering.ts"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver índice de referencia <ArrowUpRight size={12} />
          </a>
        </p>
      </div>
    </>
  );
}
