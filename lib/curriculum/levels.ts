import type { Level } from "./types.ts";
export const expandedLevels: Level[] = [
  {
    id: "inicio",
    title: "Primeros pasos",
    eyebrow: "Empieza desde cero",
    description: "De las instrucciones cotidianas a tu primer programa en C++.",
    color: "#528566",
  },
  {
    id: "fundamentos",
    title: "Fundamentos",
    eyebrow: "Construye tus herramientas",
    description: "Condiciones, ciclos, arreglos, cadenas y funciones.",
    color: "#6b8eac",
    prerequisite: "inicio",
  },
  {
    id: "general",
    title: "General",
    eyebrow: "Aprende a entrenar",
    description:
      "Preparación, C++, depuración, práctica y recursos de competencia.",
    color: "#7d8a65",
    prerequisite: "fundamentos",
    guideSection: "general",
  },
  {
    id: "bronce",
    title: "Bronce",
    eyebrow: "Resuelve con estrategia",
    description:
      "Simulación, búsqueda exhaustiva, ordenamiento y algoritmos voraces.",
    color: "#ac805c",
    prerequisite: "fundamentos",
    guideSection: "bronze",
  },
  {
    id: "plata",
    title: "Plata",
    eyebrow: "Encuentra patrones",
    description: "Prefijos, dos punteros, búsqueda binaria, grafos y árboles.",
    color: "#7b91a5",
    prerequisite: "bronce",
    guideSection: "silver",
  },
  {
    id: "oro",
    title: "Oro",
    eyebrow: "Conecta las técnicas",
    description:
      "Programación dinámica, matemáticas, rutas y estructuras de datos.",
    color: "#ae9350",
    prerequisite: "plata",
    guideSection: "gold",
  },
  {
    id: "platino",
    title: "Platino",
    eyebrow: "Domina estructuras avanzadas",
    description:
      "Consultas en rangos, árboles, geometría y optimización de DP.",
    color: "#8e7aa9",
    prerequisite: "oro",
    guideSection: "plat",
  },
  {
    id: "avanzado",
    title: "Avanzado",
    eyebrow: "Explora más allá",
    description:
      "Flujos, cadenas, polinomios, convexidad y algoritmos especializados.",
    color: "#467f80",
    prerequisite: "platino",
    guideSection: "adv",
  },
];
export const legacyLevelAliases: Record<string, string> = {
  algoritmos: "bronce",
  olimpiada: "plata",
};
