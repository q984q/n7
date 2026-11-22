"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const OBJECTS = ["Спортивный зал", "Открытый корт", "Поле или стадион", "Другой объект"];
const NEEDS = ["Покрытие", "Освещение", "Падел-корт", "Пока не знаю"];

export function ProjectFitWizard() {
  const [object, setObject] = useState(OBJECTS[0]);
  const [need, setNeed] = useState(NEEDS[0]);
  const contactHref = useMemo(() => {
    const params = new URLSearchParams({ object, need });
    return `/contacts?${params.toString()}#project`;
  }, [object, need]);
  const categoryHref = need === "Освещение"
    ? "/catalog/category/lighting"
    : need === "Падел-корт"
      ? "/catalog/category/infrastructure"
      : "/catalog/category/flooring";

  return (
    <section className="bg-canvas py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[30px] bg-white p-5 ring-1 ring-ink/[0.08] shadow-card sm:p-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-track">Подбор по задаче</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">С чего начать подбор</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">Выберите объект и направление. Точную модель знать не обязательно: для запроса пригодятся назначение и размеры площадки; план можно приложить в форме.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5">
            <fieldset>
              <legend className="mb-2 text-xs font-bold text-ink/60">Тип объекта</legend>
              <div className="flex flex-wrap gap-2">{OBJECTS.map((item) => <button key={item} type="button" aria-pressed={object === item} onClick={() => setObject(item)} className={`rounded-full px-3 py-2 text-xs font-bold ring-1 transition ${object === item ? "bg-ink text-white ring-ink" : "bg-white text-ink/70 ring-ink/10 hover:ring-track/50"}`}>{item}</button>)}</div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-xs font-bold text-ink/60">Что подобрать</legend>
              <div className="flex flex-wrap gap-2">{NEEDS.map((item) => <button key={item} type="button" aria-pressed={need === item} onClick={() => setNeed(item)} className={`rounded-full px-3 py-2 text-xs font-bold ring-1 transition ${need === item ? "bg-ink text-white ring-ink" : "bg-white text-ink/70 ring-ink/10 hover:ring-track/50"}`}>{item}</button>)}</div>
            </fieldset>
          </div>
          <div className="flex flex-col gap-2 lg:col-span-3">
            <Link href={categoryHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-canvas px-4 text-xs font-extrabold text-ink hover:bg-ink/10"><Check className="h-4 w-4 text-track" />Посмотреть направление</Link>
            <Link href={contactHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-track px-4 text-xs font-extrabold text-white hover:bg-[#e54d2b]">Запросить подбор <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
