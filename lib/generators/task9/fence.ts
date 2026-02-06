import { createPrng } from "@/lib/random/prng";
import { buildFenceText } from "@/lib/generators/task9/text";
import { Difficulty, Task } from "@/lib/generators/task9/types";

type Prng = ReturnType<typeof createPrng>;

const FENCE_RANGES: Record<Difficulty, { L: [number, number]; W: [number, number]; g: [number, number] }> = {
  easy: { L: [20, 80], W: [20, 80], g: [2, 6] },
  medium: { L: [50, 200], W: [50, 200], g: [2, 10] },
  hard: { L: [100, 500], W: [100, 500], g: [3, 20] },
};

export function generateFenceTask(
  prng: Prng,
  difficulty: Difficulty,
  id: string,
): Task {
  const ranges = FENCE_RANGES[difficulty];
  const L = prng.int(ranges.L[0], ranges.L[1]);
  const W = prng.int(ranges.W[0], ranges.W[1]);
  const g = prng.int(ranges.g[0], ranges.g[1]);
  const answer = String(2 * (L + W) - g);
  const { statement, steps } = buildFenceText({ L, W, g, answer });

  return {
    id,
    number: 9,
    subtype: "fence",
    difficulty,
    statement,
    answer,
    steps,
    params: { L, W, g },
  };
}
