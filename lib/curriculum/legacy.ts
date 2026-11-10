import { foundationLessons, foundationProblems } from "./foundations.ts";
import type { Lesson, Problem } from "./types.ts";
const placement: Record<string, string> = {
  "pensar-en-algoritmos": "bronce",
  complejidad: "bronce",
  ordenamiento: "bronce",
  "busqueda-binaria": "plata",
  "sumas-de-prefijos": "plata",
  "busqueda-exhaustiva": "bronce",
  voraces: "bronce",
  "programacion-dinamica": "oro",
  grafos: "plata",
  "preparar-concurso": "general",
};
const before: Record<string, string[]> = {
  "que-es-programar": [],
  "tu-primer-programa": ["que-es-programar"],
  "entrada-y-salida": ["tu-primer-programa"],
  "variables-y-operaciones": ["entrada-y-salida"],
  "tu-primer-problema": ["variables-y-operaciones"],
  condicionales: ["variables-y-operaciones"],
  ciclos: ["condicionales"],
  arreglos: ["ciclos"],
  cadenas: ["arreglos"],
  funciones: ["ciclos"],
  "pensar-en-algoritmos": ["funciones"],
  complejidad: ["pensar-en-algoritmos"],
  ordenamiento: ["arreglos", "complejidad"],
  "busqueda-binaria": ["ordenamiento"],
  "sumas-de-prefijos": ["arreglos"],
  "busqueda-exhaustiva": ["funciones"],
  voraces: ["ordenamiento"],
  "programacion-dinamica": ["funciones", "complejidad"],
  grafos: ["arreglos"],
  "preparar-concurso": ["tu-primer-problema"],
};
export const legacyLessons: Lesson[] = foundationLessons.map((l) => ({
  ...l,
  level: placement[l.id] || l.level,
  prerequisites: before[l.id] || [],
  category: placement[l.id] ? "Puente al nivel" : "Lecciones esenciales",
}));
const problemPlacement: Record<string, string> = {
  algoritmos: "bronce",
  olimpiada: "plata",
};
export const legacyProblems: Problem[] = foundationProblems.map((p) => ({
  ...p,
  level: p.id === "monedas-del-recreo" ? "oro" : p.id === "minutos-por-etapa" ? "plata" : problemPlacement[p.level] || p.level,
}));
