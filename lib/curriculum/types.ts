export interface Level {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  color: string;
  prerequisite?: string;
  guideSection?: string;
}

export interface Lesson {
  id: string;
  level: string;
  title: string;
  description: string;
  minutes: number;
  sections: { title: string; body: string; code?: string }[];
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
