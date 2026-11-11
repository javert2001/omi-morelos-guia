export interface Level {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  color: string;
  prerequisite?: string;
  guideSection?: string;
}

export type LessonPicture = {
  caption: string;
  rows: { label: string; values: string[]; highlight?: number[] }[];
};

export type LessonSection = {
  title: string;
  body: string;
  code?: string;
  /** A function or excerpt, explained in place rather than run on its own. */
  codeKind?: "fragment";
  codeLanguage?: "cpp" | "text" | "bash" | "markdown";
  codeInput?: string;
  afterCode?: string;
  example?: { input: string; output: string };
  diagram?: "segment-max";
  picture?: LessonPicture;
  check?: { question: string; answer: string };
  visual?: string;
};

export interface GuidedChapter {
  sections: LessonSection[];
  takeaway: string;
}

export interface Lesson {
  id: string;
  level: string;
  title: string;
  description: string;
  minutes: number;
  sections: LessonSection[];
  detailedSections?: LessonSection[];
  takeaway?: string;
  presentation?: "walkthrough";
  quiz: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
  problemId?: string;
  category?: string;
  objectives?: string[];
  prerequisites?: string[];
  optional?: boolean;
  source?: { key: string; title: string; url: string };
  practice?: { title: string; url: string }[];
  exercises?: LessonExercise[];
}

export interface LessonExercise {
  id: string;
  title: string;
  prompt: string;
  hints: string[];
  solution: string;
  /** Complete, runnable C++17 solution; omitted for reasoning exercises. */
  code?: string;
  starterCode?: string;
  sampleInput?: string;
  sampleOutput?: string;
  tests?: { input: string; output: string }[];
}

/** Spanish self-study chapters preserve the original route's stable IDs. */
export interface LessonExpansion {
  sections: Lesson["sections"];
  exercises: LessonExercise[];
  minutes?: number;
  objectives?: string[];
}

export interface Problem {
  id: string;
  title: string;
  level: string;
  difficulty: "Inicial" | "Fácil" | "Intermedio" | "Avanzado";
  topic: string;
  statement: string;
  input: string;
  output: string;
  sampleInput: string;
  sampleOutput: string;
  hint: string;
  explanation: string;
  tests: { input: string; output: string }[];
  starter: string;
  solution: string;
}
