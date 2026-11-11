// node --experimental-strip-types scripts/format-lesson-cpp.mjs /path/to/clang-format
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { lessonDrafts } from '../lib/curriculum.ts';
import { cppKey } from '../lib/curriculum/code-format.ts';

const executable = process.argv[2] || 'clang-format';
const style = '{BasedOnStyle: LLVM, IndentWidth: 4, ColumnLimit: 88, SortIncludes: Never, BreakStringLiterals: false, ReflowComments: Never, AllowShortFunctionsOnASingleLine: None, AllowShortIfStatementsOnASingleLine: Never, AllowShortLoopsOnASingleLine: false}';
// Lex literals and comments separately so spaces inside them remain significant.
const tokens = code => code.match(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/[^\n]*|\/\*[\s\S]*?\*\/|[A-Za-z_][A-Za-z_0-9]*|[0-9]+(?:\.[0-9]+)?|>>=|<<=|->\*|::|<<|>>|<=|>=|==|!=|&&|\|\||\+\+|--|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|->|[^\s]/g) || [];
const input = new Map();
for (const lesson of lessonDrafts) {
  if (lesson.id === 'usaco-plat-segtree-ext') continue;
  for (const section of lesson.sections) {
    if (section.code && (!section.codeLanguage || section.codeLanguage === 'cpp')) {
      const key = cppKey(section.code);
      if (input.has(key) && input.get(key) !== section.code) throw new Error(`Code hash collision: ${key}`);
      input.set(key, section.code);
    }
  }
  for (const exercise of lesson.exercises || []) for (const code of [exercise.code, exercise.starterCode]) {
    if (!code) continue;
    const key = cppKey(code);
    if (input.has(key) && input.get(key) !== code) throw new Error(`Code hash collision: ${key}`);
    input.set(key, code);
  }
}
const output = {};
for (const [key, code] of input) {
  const result = spawnSync(executable, [`--style=${style}`, '--assume-filename=example.cpp'], { input: code, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || 'clang-format failed');
  const formatted = result.stdout.trimEnd();
  if (JSON.stringify(tokens(formatted)) !== JSON.stringify(tokens(code))) throw new Error(`Formatting changed C++ tokens: ${key}`);
  if (formatted !== code) output[key] = formatted;
}
writeFileSync(new URL('../lib/curriculum/readable-cpp.ts', import.meta.url), '// Generated with scripts/format-lesson-cpp.mjs; changes whitespace only.\nexport const readableCpp: Record<string, string> = ' + JSON.stringify(output, null, 2) + ';\n');
console.log(`Formatted ${Object.keys(output).length} of ${input.size} distinct C++ programs and fragments; all tokens preserved.`);
