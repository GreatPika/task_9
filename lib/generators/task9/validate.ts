import { Task } from "@/lib/generators/task9/types";

export function validateTask(task: Task): void {
  if (task.number !== 9) {
    throw new Error("Task number must be 9");
  }

  if (!/^-?\d+(?:[.,]\d+)?$/.test(task.answer)) {
    throw new Error("Answer must be a numeric string");
  }

  if (task.steps.length !== 4) {
    throw new Error("Task must contain exactly 4 steps");
  }

  if (task.subtype === "area") {
    const { L, W, a, b } = task.params;
    const fits = (a < L && b < W) || (a < W && b < L);
    const freeArea = L * W - a * b;
    if (!fits) {
      throw new Error("House does not fit into lot");
    }
    if (freeArea <= 0) {
      throw new Error("Free area must be positive");
    }
    if (task.answer !== String(freeArea)) {
      throw new Error("Area answer mismatch");
    }
    return;
  }

  if (task.subtype === "spokes") {
    const { n } = task.params;
    if (n < 3) {
      throw new Error("Spokes count must be >= 3");
    }
    if (360 % n !== 0) {
      throw new Error("360 must be divisible by n");
    }
    if (task.answer !== String(360 / n)) {
      throw new Error("Spokes answer mismatch");
    }
    return;
  }

  const { L, W, g } = task.params;
  const fenceLength = 2 * (L + W) - g;
  if (!(g >= 1 && g < Math.min(L, W))) {
    throw new Error("Invalid driveway width");
  }
  if (fenceLength <= 0) {
    throw new Error("Fence length must be positive");
  }
  if (task.answer !== String(fenceLength)) {
    throw new Error("Fence answer mismatch");
  }
}
