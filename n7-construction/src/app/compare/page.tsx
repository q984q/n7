"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Plus, Trash2, X } from "lucide-react";
import { formatWarranty } from "@/data/products";
import { getProductPurpose } from "@/data/product-ui";
import { useStore } from "@/context/StoreContext";
import { formatPrice, hasPrice } from "@/lib/format";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function ComparePage() {
  const {
    compareProducts,
    toggleCompare,
    clearCompare,
    addToCart,
    isInCart,
    openCart,
  } = useStore();

  // Собираем единый список параметров для построчного сравнения «параметр к параметру»
  const allSpecLabels = useMemo(() => {
    const seen = new Set<string>();
    const order: string[] = [];
    for (const p of compareProducts) {
      for (const s of p.specs) {
        if (s.label === "Артикул") continue;
        if (!seen.has(s.label)) {
          seen.add(s.label);
          order.push(s.label);
        }
      }
    }
    return order;
  }, [compareProducts]);

  const anyHasWarranty = compareProducts.some((p) => p.warrantyYears > 0);

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Сравнение", path: "/compare" }]} />

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-ink">
              Сравнение
            </h1>
            <span className="text-sm font-semibold text-ink/45 tabular-nums">
              до 4 моделей
            </span>
          </div>
          {compareProducts.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-ink/75 ring-1 ring-ink/[0.12] hover:text-ink transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Очистить
            </button>
          )}
        </div>

        {compareProducts.length === 0 ? (
          <div className="rounded-[28px] bg-white p-14 text-center ring-1 ring-ink/[0.08] space-y-4">
            <h2 className="text-lg font-extrabold text-ink">
              Пока нечего сравнивать
            </h2>
            <p className="text-xs text-ink/55 max-w-sm mx-auto">
              Нажмите значок весов на карточках в каталоге, чтобы сопоставить
              характеристики строка за строкой.
            </p>
            <Link
              href="/catalog"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-track px-6 text-xs font-extrabold text-white"
            >
              Открыть каталог
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {compareProducts.length > 1 && (
              <div className="flex items-center justify-between text-[11px] text-ink/55 md:hidden px-1">
                <span>{compareProducts.length} позиции</span>
                <span className="font-semibold text-track">
                  Прокрутите вправо →
                </span>
              </div>
            )}

            <div className="overflow-x-auto overscroll-x-contain custom-scrollbar rounded-[26px] bg-white ring-1 ring-ink/[0.08] shadow-card">
              <table className="w-full min-w-[660px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-ink/[0.08]">
                    <th className="sticky left-0 z-10 w-36 sm:w-52 bg-canvas p-4 font-extrabold text-ink/60 shadow-[1px_0_0_rgba(11,15,20,0.07)]">
                      Параметр
                    </th>
                    {compareProducts.map((p) => {
                      const inCart = isInCart(p.id);
                      return (
                        <th
                          key={p.id}
                          className="min-w-[210px] p-4 align-top font-normal"
                        >
                          <div
                            className={`relative mb-3 aspect-[4/3] overflow-hidden rounded-2xl ${
                              p.category === "lighting"
                                ? "bg-white ring-1 ring-ink/[0.08]"
                                : "bg-canvas"
                            }`}
                          >
                            <Image
                              src={p.image}
                              alt={p.shortName}
                              fill
                              sizes="240px"
                              className={
                                p.category === "lighting"
                                  ? "object-contain p-3.5"
                                  : "object-cover"
                              }
                            />
                            <button
                              type="button"
                              onClick={() => toggleCompare(p.id)}
                              aria-label="Убрать из сравнения"
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-ink/65 shadow-sm hover:text-red-600"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <Link
                            href={`/catalog/${p.slug}`}
                            className="block text-sm font-extrabold text-ink hover:text-track"
                          >
                            {p.shortName}
                          </Link>
                          <div className="mt-0.5 font-mono text-[10.5px] text-ink/45">
                            {p.sku}
                          </div>
                          {inCart ? (
                            <button
                              type="button"
                              onClick={openCart}
                              className="mt-3 inline-flex items-center gap-1 rounded-full bg-turf px-3.5 py-1.5 text-[11px] font-bold text-white"
                            >
                              <Check className="h-3 w-3" />В списке КП
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                addToCart(p.id, p.minOrder, false, true)
                              }
                              className="mt-3 inline-flex items-center gap-1 rounded-full bg-ink px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-track transition-colors"
                            >
                              <Plus className="h-3 w-3" />В список КП
                            </button>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/[0.06]">
                  <tr>
                    <td className="sticky left-0 z-10 bg-canvas p-3.5 sm:p-4 font-bold text-ink/65 shadow-[1px_0_0_rgba(11,15,20,0.07)]">
                      Стоимость
                    </td>
                    {compareProducts.map((p) => (
                      <td
                        key={p.id}
                        className="p-3.5 sm:p-4 font-extrabold text-ink tabular-nums"
                      >
                        {hasPrice(p.price)
                          ? `${formatPrice(p.price)} / ${p.unit}`
                          : "По запросу"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky left-0 z-10 bg-canvas p-3.5 sm:p-4 font-bold text-ink/65 shadow-[1px_0_0_rgba(11,15,20,0.07)]">
                      Назначение
                    </td>
                    {compareProducts.map((p) => (
                      <td
                        key={p.id}
                        className="p-3.5 sm:p-4 font-semibold text-track"
                      >
                        {getProductPurpose(p)}
                      </td>
                    ))}
                  </tr>
                  {allSpecLabels.map((label) => (
                    <tr key={label}>
                      <td className="sticky left-0 z-10 bg-canvas p-3.5 sm:p-4 font-medium text-ink/60 shadow-[1px_0_0_rgba(11,15,20,0.07)]">
                        {label}
                      </td>
                      {compareProducts.map((p) => {
                        const found = p.specs.find((s) => s.label === label);
                        return (
                          <td
                            key={p.id}
                            className={`p-3.5 sm:p-4 ${
                              found
                                ? found.highlight
                                  ? "font-bold text-ink"
                                  : "text-ink/80"
                                : "text-ink/30"
                            }`}
                          >
                            {found ? found.value : "—"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {anyHasWarranty && (
                    <tr>
                      <td className="sticky left-0 z-10 bg-canvas p-3.5 sm:p-4 font-bold text-ink/65 shadow-[1px_0_0_rgba(11,15,20,0.07)]">
                        Гарантия
                      </td>
                      {compareProducts.map((p) => (
                        <td
                          key={p.id}
                          className="p-3.5 sm:p-4 font-bold text-ink"
                        >
                          {p.warrantyYears > 0
                            ? formatWarranty(p.warrantyYears)
                            : "По паспорту партии"}
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
