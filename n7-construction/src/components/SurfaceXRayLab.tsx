"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";

interface LayerItem {
  name: string;
  spec: string;
  color: string;
}

interface SystemCrossSection {
  id: string;
  tab: string;
  slug: string;
  metrics: { label: string; value: string }[];
  layers: LayerItem[];
}

// Строго слои и цифры из брошюр по покрытиям и паркету
const SYSTEMS: SystemCrossSection[] = [
  {
    id: "portable-parquet",
    tab: "Модульный паркет",
    slug: "sborno-razbornyj-sportivnyj-parket",
    metrics: [
      { label: "Секция", value: "1800×917 мм" },
      { label: "Высота", value: "82 мм" },
      { label: "Отскок", value: "≥ 90%" },
    ],
    layers: [
      { name: "Массив клёна", spec: "22 мм", color: "#D9A066" },
      { name: "Фанера", spec: "12 мм", color: "#B87E45" },
      { name: "Лаги LVL", spec: "30 × 50 мм", color: "#8C5A2B" },
      { name: "Амортизаторы", spec: "18 мм", color: "#2D343E" },
    ],
  },
  {
    id: "fixed-parquet",
    tab: "Стационарный паркет",
    slug: "stacionarnyj-sportivnyj-parket",
    metrics: [
      { label: "Амортизация", value: "≥ 53%" },
      { label: "Отскок", value: "≥ 90%" },
      { label: "Эмиссия", value: "Класс E1" },
    ],
    layers: [
      { name: "Спортивный лак", spec: "Мат / глянец", color: "#E9C48C" },
      { name: "Массив древесины", spec: "6 пород", color: "#CE9356" },
      { name: "Влагозащита", spec: "Барьер", color: "#64748B" },
      { name: "Фанера", spec: "0° / 45°", color: "#9C6B3B" },
      { name: "Система лаг", spec: "5 схем", color: "#6F4722" },
      { name: "Эластичные опоры", spec: "Демпфер", color: "#1F2937" },
    ],
  },
  {
    id: "custom-pvc",
    tab: "ПВХ с рисунком",
    slug: "pvh-s-individualnym-risunkom",
    metrics: [
      { label: "Толщина", value: "2–8 мм" },
      { label: "Ширина", value: "1,5 / 1,8 м" },
      { label: "Длина", value: "10 / 15 м" },
    ],
    layers: [
      { name: "Защитный слой ПВХ", spec: "Финиш", color: "#38BDF8" },
      { name: "Декор и разметка", spec: "Принт", color: "#D94423" },
      { name: "Армирование", spec: "Стабильность", color: "#475569" },
      { name: "Вспененный ПВХ", spec: "Упругость", color: "#334155" },
      { name: "Нижняя подложка", spec: "Сцепление", color: "#1E293B" },
    ],
  },
  {
    id: "semi-track",
    tab: "Покрытие для бега",
    slug: "sbornaya-begovaya-dorozhka-13mm",
    metrics: [
      { label: "Толщина", value: "9 или 13 мм" },
      { label: "Рулон", value: "1,22×15–20 м" },
      { label: "Основание", value: "Бетон / асфальт" },
    ],
    layers: [
      { name: "Рельеф и разметка", spec: "Сцепление", color: "#D94423" },
      { name: "Рабочий слой PU", spec: "Износостойкий", color: "#B53519" },
      { name: "Ячеистый эластомер", spec: "Амортизация", color: "#374151" },
      { name: "Клей и праймер", spec: "Фиксация", color: "#1F2937" },
    ],
  },
];

export function SurfaceXRayLab() {
  const [activeId, setActiveId] = useState(SYSTEMS[0].id);
  const { liveProducts } = useStore();
  const systems = SYSTEMS.flatMap(system => {
    const product = liveProducts.find(p => p.slug === system.slug);
    return product ? [{ ...system, product }] : [];
  });
  const current = systems.find(s => s.id === activeId) || systems[0];
  if (!current) return null;

  return (
    <section id="sports-flooring" className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.025em] text-ink">
            Как устроены спортивные покрытия
          </h2>

          <div role="group" aria-label="Выберите покрытие" className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {systems.map((sys) => {
              const active = sys.id === current.id;
              return (
                <button
                  key={sys.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveId(sys.id)}
                  className={`min-h-11 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    active
                      ? "bg-ink text-white shadow-sm"
                      : "bg-canvas text-ink/65 hover:text-ink"
                  }`}
                >
                  {sys.tab}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-center rounded-[30px] bg-canvas p-5 sm:p-8 ring-1 ring-ink/[0.06]">
          <div className="relative min-h-52 overflow-hidden rounded-2xl bg-ink lg:col-span-12">
            <Image src={current.product.image} alt="" fill sizes="(max-width: 1280px) 100vw, 1200px" className="object-cover" />
            <div className="relative flex min-h-52 flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 sm:p-7 text-white">
              <p className="text-xs font-semibold">{current.product.subcategoryLabel} · {current.product.sku}</p>
              <h3 className="mt-1 text-2xl font-extrabold sm:text-3xl">{current.product.shortName}</h3>
            </div>
          </div>
          {/* Визуальный пирог слоёв */}
          <div className="lg:col-span-7 space-y-2">
            <h4 className="pb-1 text-sm font-bold">Слои сверху вниз</h4>
            {current.layers.map((layer, idx) => (
              <div
                key={layer.name}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-ink/[0.06]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="h-6 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span className="font-mono text-[11px] font-bold text-ink/35">
                    0{idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-ink">
                    {layer.name}
                  </span>
                </div>
                <span className="shrink-0 rounded-full bg-canvas px-3 py-1 font-mono text-[11px] font-bold text-ink/75">
                  {layer.spec}
                </span>
              </div>
            ))}
          </div>

          {/* 3 крупные метрики + переход */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5 lg:pl-3">
            <h4 className="text-sm font-bold">Характеристики покрытия</h4>

            <div className="grid grid-cols-3 gap-2.5">
              {current.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl bg-white p-3.5 ring-1 ring-ink/[0.06]"
                >
                  <div className="text-sm sm:text-base font-extrabold text-ink leading-tight">
                    {m.value}
                  </div>
                  <div className="mt-1 text-[11px] text-ink/50">{m.label}</div>
                </div>
              ))}
            </div>

            <div>
              <Link
                href={`/catalog/${current.slug}`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-xs font-extrabold text-white hover:bg-track transition-colors"
              >
                Открыть карточку покрытия
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
