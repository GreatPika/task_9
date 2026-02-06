import { generateAreaTask } from "@/lib/generators/task9/area";
import { generateFenceTask } from "@/lib/generators/task9/fence";
import { generateSpokesTask } from "@/lib/generators/task9/spokes";
import { Difficulty, GenerateOptions, Task, Task9Subtype } from "@/lib/generators/task9/types";
import { validateTask } from "@/lib/generators/task9/validate";
import { createPrng } from "@/lib/random/prng";

const MAX_ATTEMPTS = 50;
const SUBTYPES: Task9Subtype[] = ["area", "spokes", "fence"];

function normalizeCount(count: number): number {
  if (!Number.isFinite(count)) {
    return 1;
  }
  return Math.min(50, Math.max(1, Math.trunc(count)));
}

function normalizeSeed(seed?: number): number | undefined {
  if (seed === undefined || seed === null) {
    return undefined;
  }
  if (!Number.isFinite(seed)) {
    return undefined;
  }
  return Math.trunc(seed);
}

function normalizeDifficulty(difficulty: Difficulty): Difficulty {
  if (difficulty === "easy" || difficulty === "medium" || difficulty === "hard") {
    return difficulty;
  }
  return "easy";
}

function createTaskId(seed: number | undefined, index: number, subtype: Task9Subtype): string {
  if (seed !== undefined) {
    return `task9-${seed}-${index}-${subtype}`;
  }
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `task9-${Date.now()}-${index}-${subtype}`;
}

function generateTaskBySubtype(
  subtype: Task9Subtype,
  difficulty: Difficulty,
  id: string,
  prng: ReturnType<typeof createPrng>,
): Task {
  if (subtype === "area") {
    return generateAreaTask(prng, difficulty, id);
  }
  if (subtype === "spokes") {
    return generateSpokesTask(prng, difficulty, id);
  }
  return generateFenceTask(prng, difficulty, id);
}

export function generateTask9Set(options: GenerateOptions): Task[] {
  const count = normalizeCount(options.count);
  const normalizedSeed = normalizeSeed(options.seed);
  const seedBase = normalizedSeed ?? Date.now();
  const prng = createPrng(seedBase);
  const difficulty = normalizeDifficulty(options.difficulty);
  const selectedSubtype = options.subtype;
  const tasks: Task[] = [];
  let lastStatement = "";

  for (let index = 0; index < count; index += 1) {
    let generated: Task | null = null;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const subtype =
        selectedSubtype === "mixed" ? prng.pick(SUBTYPES) : selectedSubtype;
      const id = createTaskId(normalizedSeed, index, subtype);
      const candidate = generateTaskBySubtype(subtype, difficulty, id, prng);

      if (candidate.statement === lastStatement) {
        continue;
      }

      validateTask(candidate);
      generated = candidate;
      break;
    }

    if (!generated) {
      throw new Error("Failed to generate valid task");
    }

    tasks.push(generated);
    lastStatement = generated.statement;
  }

  return tasks;
}
