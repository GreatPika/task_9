import { createPrng } from "@/lib/random/prng";
import { buildSpokesText } from "@/lib/generators/task9/text";
import { Difficulty, Task } from "@/lib/generators/task9/types";

type Prng = ReturnType<typeof createPrng>;

const SPOKES_BY_DIFFICULTY: Record<Difficulty, number[]> = {
  easy: [6, 8, 9, 10, 12, 15, 18, 20, 24],
  medium: [6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60],
  hard: [6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180],
};

export function generateSpokesTask(
  prng: Prng,
  difficulty: Difficulty,
  id: string,
): Task {
  const n = prng.pick(SPOKES_BY_DIFFICULTY[difficulty]);
  const answer = String(360 / n);
  const { statement, steps } = buildSpokesText({ n, answer });

  return {
    id,
    number: 9,
    subtype: "spokes",
    statement,
    answer,
    steps,
    params: { n },
  };
}
