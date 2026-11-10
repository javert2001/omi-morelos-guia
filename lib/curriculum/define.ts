import type { Lesson } from "./types.ts";
import { guideIndex } from "./source-index.ts";
const levelMap: Record<string, string> = {
  general: "general",
  bronze: "bronce",
  silver: "plata",
  gold: "oro",
  plat: "platino",
  adv: "avanzado",
};
const chapterMap: Record<string, string> = {
  "Getting Started": "Para comenzar",
  Contributing: "Colabora y explica",
  "General Resources": "Hábitos y recursos",
  "Language-Specific": "Herramientas de C++",
  USA: "Conoce USACO",
  "Complete Search": "Búsqueda exhaustiva",
  "Sorting & Sets": "Ordenamiento y conjuntos",
  Additional: "Estrategias fundamentales",
  Conclusion: "Cierre y práctica",
  "Prefix Sums": "Sumas de prefijos",
  "Sorting & Searching": "Ordenamiento y búsqueda",
  Graphs: "Grafos",
  "Additional Topics": "Técnicas complementarias",
  Math: "Matemáticas",
  "Dynamic Programming": "Programación dinámica",
  "Data Structures": "Estructuras de datos",
  Trees: "Árboles",
  "Range Queries": "Consultas en rangos",
  Geometry: "Geometría",
  "Misc. Topics": "Técnicas complementarias",
  Convexity: "Convexidad",
  Flows: "Flujos",
  Polynomials: "Polinomios",
  Strings: "Cadenas",
};
export type GuideContent = Omit<Lesson, "id" | "level" | "source" | "category">;
export function guideLesson(
  section: string,
  slug: string,
  content: GuideContent,
): Lesson {
  const referenceModule = guideIndex.find(
    (m) => m.key === `${section}/${slug}`,
  );
  if (!referenceModule)
    throw new Error(`Módulo desconocido: ${section}/${slug}`);
  return {
    ...content,
    id: `usaco-${section}-${slug.toLowerCase()}`,
    level: levelMap[section],
    category: chapterMap[referenceModule.chapter] || referenceModule.chapter,
    source: {
      key: referenceModule.key,
      title: "USACO Guide · " + section.toUpperCase(),
      url: referenceModule.url,
    },
    practice: content.practice,
  };
}
