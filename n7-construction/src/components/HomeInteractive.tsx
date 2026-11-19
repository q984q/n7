"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LIGHTING_SERIES, Product, ProductCategory } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";
import { LightingSeriesCard } from "@/components/LightingSeriesCard";
import { ScrollRail } from "@/components/ScrollRail";

export function HomeCatalogShowcase() {
  const { liveProducts } = useStore();
  const [tab, setTab] = useState<"featured" | ProductCategory>("featured");

  const counts = useMemo(
    () => ({
      flooring: liveProducts.filter((p) => p.category === "flooring").length,
      infrastructure: liveProducts.filter((p) => p.category === "infrastructure")
        .length,
      lighting: liveProducts.filter((p) => p.category === "lighting").length,
    }),
    [liveProducts]
  );

  const tabs: { id: "featured" | ProductCategory; label: string }[] = [
    { id: "featured", label: "Популярное" },
    { id: "flooring", label: `Покрытия · ${counts.flooring}` },
    { id: "infrastructure", label: `Падел · ${counts.infrastructure}` },
    { id: "lighting", label: `Свет N7 · 9 серий` },
  ];

  const lightingGroups = useMemo<Product[][]>(() => {
    if (tab !== "lighting") return [];
    return LIGHTING_SERIES.map((s) =>
      liveProducts.filter((p) => p.seriesCode === s.code)
    ).filter((g) => g.length > 0);
  }, [liveProducts, tab]);

  const items = useMemo(() => {
    if (tab === "lighting") return [];
    if (tab === "featured") {
      return liveProducts.filter((p) => p.featured).slice(0, 6);
    }
    return liveProducts.filter((p) => p.category === tab).slice(0, 6);
  }, [liveProducts, tab]);

  return (
    <section className="py-16 sm:py-24 bg-canvas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.025em] text-ink">
            Каталог
          </h2>

          <ScrollRail
            fadeColor="canvas"
            showArrows={false}
            trackClassName="flex items-center gap-1.5 py-0.5"
            ariaLabel="Разделы витрины"
          >
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  data-active={active ? "true" : undefined}
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    active
                      ? "bg-ink text-white shadow-sm"
                      : "bg-white text-ink/65 ring-1 ring-ink/[0.08] hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </ScrollRail>
        </div>

        {/* Мобильная свайп-карусель */}
        <div className="sm:hidden" key={tab}>
          <ScrollRail
            fadeColor="canvas"
            showArrows={false}
            showProgress
            snap
            stepRatio={0.86}
            trackClassName="flex items-stretch gap-3.5 pb-1"
            ariaLabel="Карточки позиций каталога"
          >
            {tab === "lighting"
              ? lightingGroups.map((models) => (
                  <div
                    key={models[0].seriesCode}
                    className="w-[82vw] max-w-[320px] shrink-0 snap-start flex"
                  >
                    <LightingSeriesCard models={models} />
                  </div>
                ))
              : items.map((product) => (
                  <div
                    key={product.id}
                    className="w-[82vw] max-w-[320px] shrink-0 snap-start flex"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
          </ScrollRail>
        </div>

        {/* Сетка на планшетах и десктопе */}
        <div className="hidden sm:grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tab === "lighting"
            ? lightingGroups.map((models) => (
                <LightingSeriesCard
                  key={models[0].seriesCode}
                  models={models}
                />
              ))
            : items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={tab === "featured" ? "/catalog" : `/catalog/category/${tab}`}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-xs font-extrabold text-ink ring-1 ring-ink/[0.12] shadow-sm hover:ring-ink/30 transition-all"
          >
            {tab === "lighting"
              ? `Все ${counts.lighting} моделей света N7`
              : `Открыть весь каталог (${liveProducts.length})`}
            <ArrowRight className="h-4 w-4 text-track" />
          </Link>
        </div>
      </div>
    </section>
  );
}
