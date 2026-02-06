type Prng = {
  nextFloat: () => number;
  int: (min: number, max: number) => number;
  pick: <T>(arr: readonly T[]) => T;
};

const UINT32_MAX = 0x100000000;

export function createPrng(seed: number): Prng {
  let state = seed >>> 0;

  const nextFloat = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / UINT32_MAX;
  };

  const int = (min: number, max: number): number => {
    if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
      throw new Error("Invalid int range");
    }
    return Math.floor(nextFloat() * (max - min + 1)) + min;
  };

  const pick = <T>(arr: readonly T[]): T => {
    if (arr.length === 0) {
      throw new Error("Cannot pick from empty array");
    }
    return arr[int(0, arr.length - 1)];
  };

  return { nextFloat, int, pick };
}
