import test from "node:test";
import assert from "node:assert/strict";
import { lessons, levels, problems } from "../lib/curriculum.ts";
import { guideIndex } from "../lib/curriculum/source-index.ts";
const ids = new Set(lessons.map((l) => l.id));
const expected = [
  "que-es-programar",
  "tu-primer-programa",
  "entrada-y-salida",
  "variables-y-operaciones",
  "tu-primer-problema",
  "condicionales",
  "ciclos",
  "arreglos",
  "cadenas",
  "funciones",
  "pensar-en-algoritmos",
  "complejidad",
  "ordenamiento",
  "busqueda-binaria",
  "sumas-de-prefijos",
  "busqueda-exhaustiva",
  "voraces",
  "programacion-dinamica",
  "grafos",
  "preparar-concurso",
];
test("all 149 source modules are covered exactly once", () => {
  assert.equal(guideIndex.length, 149);
  const covered = lessons.flatMap((l) => (l.source ? [l.source.key] : []));
  assert.equal(covered.length, 149);
  assert.equal(new Set(covered).size, 149);
  assert.deepEqual([...covered].sort(), guideIndex.map((m) => m.key).sort());
  const sourceCounts = Object.fromEntries(
    ["general", "bronze", "silver", "gold", "plat", "adv"].map((s) => [
      s,
      covered.filter((k) => k.startsWith(s + "/")).length,
    ]),
  );
  assert.deepEqual(sourceCounts, {
    general: 29,
    bronze: 13,
    silver: 14,
    gold: 29,
    plat: 23,
    adv: 41,
  });
});
test("previous lessons and problems keep stable identifiers", () => {
  for (const id of expected) assert.ok(ids.has(id), id);
  assert.equal(lessons.length, 169);
  assert.equal(ids.size, lessons.length);
  assert.equal(problems.length, 10);
  const problemIds = new Set(problems.map((p) => p.id));
  assert.equal(problemIds.size, 10);
  assert.deepEqual([...problemIds].sort(), [
    "hola-morelos", "mochilas-del-equipo", "equipos-completos", "pase-al-taller", "dias-de-practica", "temperaturas-de-morelos", "tiempos-del-equipo", "minutos-por-etapa", "monedas-del-recreo", "rutas-del-campus"
  ].sort());
});
test("all eight stages have coherent lesson and problem references", () => {
  assert.deepEqual(
    levels.map((l) => l.id),
    [
      "inicio",
      "fundamentos",
      "general",
      "bronce",
      "plata",
      "oro",
      "platino",
      "avanzado",
    ],
  );
  const levelIds = new Set(levels.map((l) => l.id));
  for (const l of lessons) {
    assert.ok(levelIds.has(l.level), l.id);
    if (l.problemId)
      assert.ok(
        problems.some((p) => p.id === l.problemId),
        l.id,
      );
  }
  for (const p of problems) assert.ok(levelIds.has(p.level), p.id);
  for (const l of levels) {
    assert.ok(
      lessons.some((x) => x.level === l.id),
      l.id,
    );
    if (l.prerequisite) assert.ok(levelIds.has(l.prerequisite), l.id);
  }
});
test("each module has original instructional text, objectives and a valid quiz", () => {
  for (const l of lessons) {
    assert.ok(l.title.trim() && l.description.trim(), l.id);
    assert.ok(l.minutes > 0 && l.minutes <= 180, l.id);
    assert.ok(l.quiz.options.length >= 3, l.id);
    assert.equal(new Set(l.quiz.options).size, l.quiz.options.length, l.id);
    assert.ok(
      Number.isInteger(l.quiz.answer) &&
        l.quiz.answer >= 0 &&
        l.quiz.answer < l.quiz.options.length,
      l.id,
    );
    assert.ok(l.quiz.explanation.length >= 25, l.id);
    if (l.source) {
      assert.ok(l.sections.length >= 4, `${l.id}: sections`);
      assert.ok((l.objectives?.length || 0) >= 2, `${l.id}: objectives`);
      const words = l.sections
        .map((s) => s.body)
        .join(" ")
        .split(/\s+/)
        .filter(Boolean).length;
      assert.ok(words >= 180, `${l.id}: only ${words} words`);
      assert.ok(
        l.sections.every((s) => s.title.trim() && s.body.trim()),
        l.id,
      );
      assert.ok(
        !l.sections.some((s) =>
          /pr[oó]ximamente|contenido pendiente|TODO:|lorem ipsum/i.test(s.body),
        ),
        l.id,
      );
    }
  }
});
test("source links and practice links are valid and matched to the reference", () => {
  for (const l of lessons) {
    if (l.source) {
      const m = guideIndex.find((m) => m.key === l.source!.key);
      assert.equal(l.source.url, m?.url, l.id);
    }
    for (const p of l.practice || []) {
      assert.equal(new URL(p.url).protocol, "https:", l.id);
      assert.ok(p.title.trim(), l.id);
    }
  }
});
test("every lesson supports Spanish self-study with local worked exercises", () => {
  for (const lesson of lessons) {
    assert.ok(lesson.sections.length >= 6, `${lesson.id}: developed chapter`);
    assert.ok((lesson.exercises?.length || 0) >= 2, `${lesson.id}: local practice`);
    const exerciseIds = new Set<string>();
    for (const exercise of lesson.exercises || []) {
      assert.ok(/^[a-z0-9-]+$/.test(exercise.id), `${lesson.id}/${exercise.id}`);
      assert.ok(!exerciseIds.has(exercise.id), `${lesson.id}: duplicate exercise ID`);
      exerciseIds.add(exercise.id);
      assert.ok(exercise.prompt.length >= 60 && exercise.solution.length >= 100, `${lesson.id}/${exercise.id}: explained task`);
      assert.ok(exercise.hints.length >= 1 && exercise.hints.every(h=>h.trim()), `${lesson.id}/${exercise.id}: hints`);
      if (exercise.code) {
        assert.match(exercise.code, /\bmain\s*\(/, `${lesson.id}/${exercise.id}: runnable program`);
        assert.ok((exercise.tests?.length || 0) >= 3, `${lesson.id}/${exercise.id}: test cases`);
        assert.ok(exercise.tests!.some(t => t.input === exercise.sampleInput && t.output === exercise.sampleOutput), `${lesson.id}/${exercise.id}: sample is verified`);
      }
    }
  }
});
test("prerequisites resolve and form a directed acyclic graph", () => {
  for (const l of lessons)
    for (const id of l.prerequisites || []) {
      assert.ok(ids.has(id), `${l.id} -> missing ${id}`);
      assert.notEqual(id, l.id);
    }
  const visiting = new Set<string>(),
    done = new Set<string>();
  function visit(id: string) {
    assert.ok(!visiting.has(id), `Cycle at ${id}`);
    if (done.has(id)) return;
    visiting.add(id);
    for (const next of lessons.find((l) => l.id === id)?.prerequisites || [])
      visit(next);
    visiting.delete(id);
    done.add(id);
  }
  lessons.forEach((l) => visit(l.id));
});
test("code examples are complete C++ programs and each advanced lesson is marked optional", () => {
  for (const l of lessons) {
    for (const s of l.sections)
      if (s.code) assert.match(s.code, /\bmain\s*\(/, `${l.id}: ${s.title}`);
    if (l.level === "avanzado") assert.equal(l.optional, true, l.id);
  }
});
