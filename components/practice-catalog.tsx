"use client";
import { useState } from "react";
import { ArrowRight, BookOpen, Code2, Search } from "lucide-react";
import { lessons, levels } from "@/lib/curriculum";
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export default function PracticeCatalog() {
  const [stage, setStage] = useState("todos");
  const [query, setQuery] = useState("");
  const modules = lessons.filter((l) => l.exercises?.length);
  const filtered = modules.filter(
    (l) =>
      (stage === "todos" || stage === l.level) &&
      normalize(`${l.title} ${l.category} ${l.source?.key}`).includes(
        normalize(query),
      ),
  );
  return (
    <>
      <div className="practice-catalog-notice">
        <BookOpen size={22} />
        <p>
          <strong>Aprende y practica sin salir de la guía.</strong>{" "}
          Cada tema incluye ejercicios en español, pistas progresivas y soluciones
          explicadas. En los ejercicios de programación puedes escribir C++ y
          comprobar los casos dentro de la misma lección.
        </p>
      </div>
      <div className="problem-toolbar">
        <div className="search-field">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar práctica por tema"
            placeholder="Buscar flujos, árboles, DP..."
          />
        </div>
        <select
          aria-label="Etapa de práctica"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          <option value="todos">Todas las etapas</option>
          {levels
            .filter((l) => modules.some((m) => m.level === l.id))
            .map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
        </select>
        <span>{filtered.length} temas</span>
      </div>
      <div className="practice-catalog-grid">
        {filtered.map((l) => (
          <article className="card practice-topic" key={l.id}>
            <div className="eyebrow">
              {levels.find((level) => level.id === l.level)?.title} ·{" "}
              {l.category}
            </div>
            <h2>{l.title}</h2>
            <p>{l.description}</p>
            <span className="practice-exercise-count"><Code2 size={14} /> {l.exercises!.length} ejercicios · pistas y soluciones</span>
            <div>
              <a href={`#/leccion/${l.id}`}>
                <BookOpen size={14} />
                Estudiar y practicar <ArrowRight size={15} />
              </a>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <Search size={32} />
          <h2>No hay temas con esos filtros</h2>
          <p>Prueba con otro término o selecciona todas las etapas.</p>
          <button
            className="button primary"
            onClick={() => {
              setQuery("");
              setStage("todos");
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </>
  );
}
