import { createPrng } from "@/lib/random/prng";
import { buildAreaText } from "@/lib/generators/task9/text";
import { Difficulty, Task } from "@/lib/generators/task9/types";

type Prng = ReturnType<typeof createPrng>;

const AREA_RANGES: Record<Difficulty, { L: [number, number]; W: [number, number]; a: [number, number]; b: [number, number] }> = {
  easy: { L: [20, 60], W: [20, 60], a: [4, 15], b: [4, 15] },
  medium: { L: [40, 120], W: [40, 120], a: [6, 25], b: [6, 25] },
  hard: { L: [80, 250], W: [80, 250], a: [10, 60], b: [10, 60] },
};

export function generateAreaTask(
  prng: Prng,
  difficulty: Difficulty,
  id: string,
): Task {
  const ranges = AREA_RANGES[difficulty];
  const L = prng.int(ranges.L[0], ranges.L[1]);
  const W = prng.int(ranges.W[0], ranges.W[1]);
  const a = prng.int(ranges.a[0], ranges.a[1]);
  const b = prng.int(ranges.b[0], ranges.b[1]);
  const answer = String(L * W - a * b);
  const { statement, steps } = buildAreaText({ L, W, a, b, answer });

  return {
    id,
    number: 9,
    subtype: "area",
    difficulty,
    statement,
    answer,
    steps,
    params: { L, W, a, b },
  };
}
