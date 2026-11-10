export type Progress = {
  name: string;
  school: string;
  goal: number;
  completedLessons: string[];
  solvedProblems: string[];
  activity: Record<string, number>;
  notes: Record<string, string>;
  lastLesson: string | null;
};

export const initialProgress: Progress = {
  name: "",
  school: "Secundaria",
  goal: 3,
  completedLessons: [],
  solvedProblems: [],
  activity: {},
  notes: {},
  lastLesson: null,
};

const storageKey = "omi-morelos-progress-v1";

function emptyProgress(): Progress {
  return {
    ...initialProgress,
    completedLessons: [],
    solvedProblems: [],
    activity: {},
    notes: {},
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function uniqueIds(value: unknown): string[] {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (id): id is string =>
              typeof id === "string" && id.trim().length > 0,
          ),
        ),
      ]
    : [];
}

/** Dates follow the learner's local timezone, including around midnight. */
export function localDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(12, 0, 0, 0);
  return localDateKey(date) === value;
}

/** Storage can be unavailable in SSR, private windows, or a full browser profile. */
export function loadProgress(): Progress {
  const fallback = emptyProgress();
  try {
    if (typeof window === "undefined") return fallback;
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return fallback;
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value)) return fallback;

    return {
      name: typeof value.name === "string" ? value.name : fallback.name,
      school:
        typeof value.school === "string" && value.school.trim()
          ? value.school
          : fallback.school,
      goal:
        typeof value.goal === "number" &&
        Number.isSafeInteger(value.goal) &&
        value.goal > 0
          ? value.goal
          : fallback.goal,
      completedLessons: uniqueIds(value.completedLessons),
      solvedProblems: uniqueIds(value.solvedProblems),
      activity: isRecord(value.activity)
        ? Object.fromEntries(
            Object.entries(value.activity).filter(
              ([day, count]) =>
                isDateKey(day) &&
                typeof count === "number" &&
                Number.isSafeInteger(count) &&
                count > 0,
            ),
          )
        : {},
      notes: isRecord(value.notes)
        ? Object.fromEntries(
            Object.entries(value.notes).filter(
              ([, note]) => typeof note === "string",
            ),
          )
        : {},
      lastLesson:
        typeof value.lastLesson === "string" && value.lastLesson.trim()
          ? value.lastLesson
          : null,
    } as Progress;
  } catch {
    return fallback;
  }
}

export function saveProgress(progress: Progress): void {
  try {
    if (typeof window !== "undefined")
      window.localStorage.setItem(storageKey, JSON.stringify(progress));
  } catch {
    // Keep the current session usable when the browser refuses persistent storage.
  }
}

function addActivity(activity: Record<string, number>): Record<string, number> {
  const today = localDateKey();
  return { ...activity, [today]: (activity[today] ?? 0) + 1 };
}

export function completeLesson(progress: Progress, id: string): Progress {
  if (!id.trim() || progress.completedLessons.includes(id)) return progress;
  return {
    ...progress,
    completedLessons: [...progress.completedLessons, id],
    lastLesson: id,
    activity: addActivity(progress.activity),
  };
}

export function solveProblem(progress: Progress, id: string): Progress {
  if (!id.trim() || progress.solvedProblems.includes(id)) return progress;
  return {
    ...progress,
    solvedProblems: [...progress.solvedProblems, id],
    activity: addActivity(progress.activity),
  };
}

function localNoon(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(12, 0, 0, 0);
  return copy;
}

/** A streak remains alive until the end of the day after the last activity. */
export function streak(
  activity: Record<string, number>,
  today = new Date(),
): number {
  const date = localNoon(today);
  if (!(activity[localDateKey(date)] > 0)) date.setDate(date.getDate() - 1);
  let count = 0;
  while (activity[localDateKey(date)] > 0) {
    count += 1;
    date.setDate(date.getDate() - 1);
  }
  return count;
}

/** Sum this week's activities from Monday through today, using local dates. */
export function weekCount(
  activity: Record<string, number>,
  today = new Date(),
): number {
  const date = localNoon(today);
  const daysSinceMonday = (date.getDay() + 6) % 7;
  let count = 0;
  for (let day = 0; day <= daysSinceMonday; day += 1) {
    const amount = activity[localDateKey(date)];
    if (Number.isFinite(amount) && amount > 0) count += amount;
    date.setDate(date.getDate() - 1);
  }
  return count;
}
