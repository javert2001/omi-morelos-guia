import assert from "node:assert/strict";
import { test } from "node:test";
import type { Progress } from "../lib/progress";

// Use a URL so Node can run the .ts source directly without changing app tsconfig.
const {
  initialProgress,
  loadProgress,
  saveProgress,
  localDateKey,
  completeLesson,
  solveProblem,
  streak,
  weekCount,
}: typeof import("../lib/progress") = await import(
  new URL("../lib/progress.ts", import.meta.url).href
);

const key = "omi-morelos-progress-v1";

function withStorage(
  raw: string | null,
  run: (items: Map<string, string>) => void,
) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window");
  const items = new Map<string, string>();
  if (raw !== null) items.set(key, raw);
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: (name: string) => items.get(name) ?? null,
        setItem: (name: string, value: string) => items.set(name, value),
      },
    },
  });
  try {
    run(items);
  } finally {
    if (previous) Object.defineProperty(globalThis, "window", previous);
    else Reflect.deleteProperty(globalThis, "window");
  }
}

test("server rendering can read and save without window", () => {
  assert.deepEqual(loadProgress(), initialProgress);
  assert.doesNotThrow(() => saveProgress(initialProgress));
});

test("missing, malformed, null, and non-object storage each yield a fresh initial value", () => {
  for (const raw of [null, "{", "null", "[]", "false", '"old-format"']) {
    withStorage(raw, () => {
      const progress = loadProgress();
      assert.deepEqual(progress, initialProgress);
      progress.completedLessons.push("temporary");
      assert.deepEqual(loadProgress(), initialProgress);
    });
  }
});

test("partially corrupt storage preserves valid progress and filters unsafe values", () => {
  withStorage(
    JSON.stringify({
      name: "Ana",
      school: null,
      goal: -5,
      completedLessons: ["intro", "intro", 8, "", "  "],
      solvedProblems: ["suma", false, "suma"],
      activity: {
        "2026-11-09": 2,
        "2026-02-30": 3,
        "2026-11-10": "3",
        "2026-11-08": -2,
      },
      notes: { intro: "¡Ya entendí!", broken: [] },
      lastLesson: {},
    }),
    () => {
      assert.deepEqual(loadProgress(), {
        ...initialProgress,
        name: "Ana",
        completedLessons: ["intro"],
        solvedProblems: ["suma"],
        activity: { "2026-11-09": 2 },
        notes: { intro: "¡Ya entendí!" },
      });
    },
  );
});

test("progress persists and reloads through the versioned local storage key", () => {
  withStorage(null, (items) => {
    const progress: Progress = {
      ...initialProgress,
      name: "Dani",
      school: "Preparatoria",
      goal: 5,
      completedLessons: ["variables"],
      solvedProblems: ["sumar"],
      notes: { variables: "Una variable guarda un valor." },
      activity: { "2026-11-10": 2 },
      lastLesson: "variables",
    };
    saveProgress(progress);
    assert.ok(items.has(key));
    assert.deepEqual(loadProgress(), progress);
  });
});

test("denied storage access does not crash the learning session", () => {
  withStorage(null, () => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("denied");
      },
    });
    assert.deepEqual(loadProgress(), initialProgress);
    assert.doesNotThrow(() => saveProgress(initialProgress));
  });
});

test("lesson and problem completion are immutable and idempotent", () => {
  const lesson = completeLesson(initialProgress, "variables");
  assert.equal(lesson.lastLesson, "variables");
  assert.deepEqual(lesson.completedLessons, ["variables"]);
  assert.equal(lesson.activity[localDateKey()], 1);
  assert.equal(completeLesson(lesson, "variables"), lesson);

  const problem = solveProblem(lesson, "sumar");
  assert.deepEqual(problem.solvedProblems, ["sumar"]);
  assert.equal(problem.activity[localDateKey()], 2);
  assert.equal(solveProblem(problem, "sumar"), problem);
  assert.equal(solveProblem(problem, ""), problem);
  assert.equal(completeLesson(problem, "  "), problem);
  assert.deepEqual(initialProgress.completedLessons, []);
  assert.deepEqual(initialProgress.activity, {});
});

test("date keys preserve local calendar dates around midnight", () => {
  assert.equal(localDateKey(new Date(2026, 0, 2, 0, 1)), "2026-01-02");
  assert.equal(localDateKey(new Date(2026, 11, 31, 23, 59)), "2026-12-31");
});

test("streaks span a year boundary and allow an unfinished current day", () => {
  const activity = { "2025-12-30": 1, "2025-12-31": 2, "2026-01-01": 1 };
  assert.equal(streak(activity, new Date(2026, 0, 1)), 3);
  assert.equal(streak(activity, new Date(2026, 0, 2)), 3);
  assert.equal(streak(activity, new Date(2026, 0, 3)), 0);
  assert.equal(streak({ "2026-01-01": 0 }, new Date(2026, 0, 1)), 0);
});

test("weekly counts reset on Monday and cross a year boundary", () => {
  const activity = {
    "2025-12-28": 99,
    "2025-12-29": 2,
    "2025-12-30": 1,
    "2025-12-31": 3,
    "2026-01-01": 2,
    "2026-01-04": 4,
    "2026-01-05": 5,
  };
  assert.equal(weekCount(activity, new Date(2026, 0, 1)), 8);
  assert.equal(weekCount(activity, new Date(2026, 0, 4)), 12);
  assert.equal(weekCount(activity, new Date(2026, 0, 5)), 5);
});
