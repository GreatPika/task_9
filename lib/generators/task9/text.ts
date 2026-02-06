type AreaParams = {
  L: number;
  W: number;
  a: number;
  b: number;
  answer: string;
};

type SpokesParams = {
  n: number;
  answer: string;
};

type FenceParams = {
  L: number;
  W: number;
  g: number;
  answer: string;
};

export function formatNumberRu(value: number | string): string {
  // Future-proofing: if fractional answers appear, use comma as decimal separator.
  return String(value).replace(".", ",");
}

export function buildAreaText({ L, W, a, b, answer }: AreaParams): {
  statement: string;
  steps: string[];
} {
  const lotArea = L * W;
  const houseArea = a * b;

  return {
    statement: `Дачный участок имеет форму прямоугольника, стороны которого равны ${L} м и ${W} м. Дом, расположенный на участке, на плане также имеет форму прямоугольника, стороны которого равны ${a} м и ${b} м. Найдите площадь оставшейся части участка, не занятой домом. Ответ дайте в квадратных метрах.`,
    steps: [
      `1. Площадь участка: Sуч = ${L} · ${W} = ${lotArea}.`,
      `2. Площадь дома: Sдом = ${a} · ${b} = ${houseArea}.`,
      `3. Свободная площадь: S = Sуч − Sдом = ${lotArea} − ${houseArea} = ${answer}.`,
      `4. Ответ: ${answer}.`,
    ],
  };
}

export function buildSpokesText({ n, answer }: SpokesParams): {
  statement: string;
  steps: string[];
} {
  return {
    statement: `Колесо имеет ${n} спиц. Углы между любыми двумя соседними спицами равны. Найдите величину угла (в градусах), который образуют две соседние спицы.`,
    steps: [
      "1. Полный угол вокруг центра равен 360°.",
      `2. Этот угол поделен на ${n} равных частей.`,
      `3. Угол между соседними спицами: 360 : ${n} = ${answer}.`,
      `4. Ответ: ${answer}.`,
    ],
  };
}

export function buildFenceText({ L, W, g, answer }: FenceParams): {
  statement: string;
  steps: string[];
} {
  const perimeterHalf = L + W;
  const perimeter = 2 * perimeterHalf;
  return {
    statement: `Участок земли имеет прямоугольную форму. Стороны прямоугольника равны ${L} м и ${W} м. Найдите длину забора (в метрах), которым нужно огородить участок, предусмотрев проезд шириной ${g} м.`,
    steps: [
      `1. Периметр участка: P = 2 · (${L} + ${W}) = 2 · ${perimeterHalf} = ${perimeter}.`,
      `2. Проезд шириной ${g} м — это разрыв в заборе длиной ${g}.`,
      `3. Длина забора: P − ${g} = ${perimeter} − ${g} = ${answer}.`,
      `4. Ответ: ${answer}.`,
    ],
  };
}
