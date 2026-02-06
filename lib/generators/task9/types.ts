export type Task9Subtype = "area" | "spokes" | "fence";
export type Difficulty = "easy" | "medium" | "hard";

export type Task = {
  id: string;
  number: 9;
  subtype: Task9Subtype;
  difficulty: Difficulty;
  statement: string;
  answer: string;
  steps: string[];
  params: Record<string, number>;
};

export type GenerateOptions = {
  count: number;
  subtype: "mixed" | Task9Subtype;
  difficulty: Difficulty;
  seed?: number;
};
