"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { generateTask9Set } from "@/lib/generators/task9";
import { Difficulty, Task, Task9Subtype } from "@/lib/generators/task9/types";

type SubtypeFilter = "mixed" | Task9Subtype;

const subtypeLabel: Record<Task9Subtype, string> = {
  area: "Площадь",
  spokes: "Спицы",
  fence: "Забор",
};

export default function Page() {
  const [count, setCount] = useState("5");
  const [subtype, setSubtype] = useState<SubtypeFilter>("mixed");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [seed, setSeed] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const parseSeed = useCallback((): number | undefined => {
    const trimmed = seed.trim();
    if (trimmed.length === 0) {
      return undefined;
    }
    const parsed = Number(trimmed);
    if (!Number.isInteger(parsed)) {
      throw new Error("Некорректное начальное число");
    }
    return parsed;
  }, [seed]);

  const handleGenerate = useCallback(
    (closeSheetAfterSuccess: boolean) => {
      const parsedCount = Number(count);
      if (!Number.isInteger(parsedCount) || parsedCount < 1 || parsedCount > 50) {
        toast("Некорректное количество задач");
        return;
      }

      let parsedSeed: number | undefined;
      try {
        parsedSeed = parseSeed();
      } catch {
        toast("Некорректное начальное число");
        return;
      }

      try {
        const generated = generateTask9Set({
          count: parsedCount,
          subtype,
          difficulty,
          seed: parsedSeed,
        });
        setTasks(generated);
        if (closeSheetAfterSuccess) {
          setSheetOpen(false);
        }
        toast(`Сгенерировано: ${generated.length}`);
      } catch {
        toast("Не удалось сгенерировать набор. Измените настройки.");
      }
    },
    [count, difficulty, parseSeed, subtype],
  );

  const handleCopyAnswer = useCallback(async (answer: string) => {
    try {
      await navigator.clipboard.writeText(answer);
      toast("Ответ скопирован");
    } catch {
      toast("Не удалось скопировать");
    }
  }, []);

  const hasTasks = tasks.length > 0;
  const settingsFields = useMemo(
    () => (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="count">Количество задач</Label>
          <Input
            id="count"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(event) => setCount(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtype">Тип задач</Label>
          <Select value={subtype} onValueChange={(value) => setSubtype(value as SubtypeFilter)}>
            <SelectTrigger id="subtype" className="w-full">
              <SelectValue placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mixed">Смешанный</SelectItem>
              <SelectItem value="area">Площадь</SelectItem>
              <SelectItem value="spokes">Спицы</SelectItem>
              <SelectItem value="fence">Забор</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Сложность</Label>
          <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
            <SelectTrigger id="difficulty" className="w-full">
              <SelectValue placeholder="Выберите сложность" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Лёгкая</SelectItem>
              <SelectItem value="medium">Средняя</SelectItem>
              <SelectItem value="hard">Сложная</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="seed">Начальное число (seed)</Label>
          <Input
            id="seed"
            type="number"
            value={seed}
            onChange={(event) => setSeed(event.target.value)}
            placeholder="Необязательно"
          />
        </div>
      </div>
    ),
    [count, difficulty, seed, subtype],
  );

  return (
    <main className="mx-auto w-full max-w-7xl p-4 lg:p-6">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <h1 className="text-xl font-semibold">Генератор задания 9</h1>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">Настройки</Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[90vw]">
            <SheetHeader>
              <SheetTitle>Настройки</SheetTitle>
              <SheetDescription>Выберите параметры генерации задач.</SheetDescription>
            </SheetHeader>
            <div className="p-4 pt-0">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  {settingsFields}
                  <Button className="w-full" onClick={() => handleGenerate(true)}>
                    Сгенерировать
                  </Button>
                </CardContent>
              </Card>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="hidden lg:block">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {settingsFields}
              <Button className="w-full" onClick={() => handleGenerate(false)}>
                Сгенерировать
              </Button>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-4">
          {!hasTasks && (
            <Card>
              <CardContent className="pt-6 text-sm text-muted-foreground">
                Нажмите «Сгенерировать», чтобы получить задачи.
              </CardContent>
            </Card>
          )}

          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <CardTitle>{`Задание 9 — ${subtypeLabel[task.subtype]}`}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6">{task.statement}</p>

                <Accordion type="multiple">
                  <AccordionItem value="answer">
                    <AccordionTrigger>Ответ</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p className="text-sm font-medium">{task.answer}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyAnswer(task.answer)}
                        >
                          Скопировать ответ
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="solution">
                    <AccordionTrigger>Решение</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal space-y-2 pl-5 text-sm">
                        {task.steps.map((step, index) => (
                          <li key={`${task.id}-${index}`}>{step.replace(/^\d+\.\s*/, "")}</li>
                        ))}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
