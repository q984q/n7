"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Plus, Scale } from "lucide-react";
import { Product } from "@/data/products";
import { getProductPurpose, LIGHTING_SERIES_BADGE } from "@/data/product-ui";
import { useStore } from "@/context/StoreContext";
import { formatPrice, hasPrice } from "@/lib/format";

/**
 * Компактная карточка серии прожекторов N7 с мгновенным выбором мощности (Вт):
 * избавляет каталог от стены из 45 похожих карточек, сохраняя отдельный артикул,
 * страницу и индивидуальную цену в ₸ для каждой мощности.
 */
export function LightingSeriesCard({ models }: { models: Product[] }) {
  const { addToCart, isInCart, openCart, compareIds, toggleCompare } = useStore();
  const sorted = [...models].sort(
    (a, b) => (a.photometry?.wattage || 0) - (b.photometry?.wattage || 0)
  );
  const defaultIdx = Math.min(sorted.length - 1, Math.floor(sorted.length / 2));
  const [idx, setIdx] = useState(defaultIdx);

  const active = sorted[idx] || sorted[0];
  if (!active) return null;

  const inCompare = compareIds.includes(active.id);
  const inCart = isInCart(active.id);
  const priced = hasPrice(active.price);
  const purpose = getProductPurpose(active);
  const diffBadge =
    (active.seriesCode && LIGHTING_SERIES_BADGE[active.seriesCode]) ||
    active.photometry?.efficacy ||
    "";

  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-[26px] bg-white ring-1 ring-ink/[0.08] shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:ring-ink/20 hover:shadow-elevated">
      {/* Фото выбранной мощности */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white border-b border-ink/[0.05]">
        <Link href={`/catalog/${active.slug}`} className="relative block h-full w-full">
          <Image
            src={active.image}
            alt={active.name}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.05]"
          />
        </Link>

        <span className="pointer-events-none absolute left-3.5 top-3.5 rounded-full bg-ink/80 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-md">
          {active.sku}
        </span>

        <button
          type="button"
          onClick={() => toggleCompare(active.id)}
          aria-label={inCompare ? "Убрать из сравнения" : "Добавить к сравнению"}
          title={inCompare ? "В сравнении" : "Сравнить эту мощность"}
          className={`absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all ${
            inCompare
              ? "bg-track text-white shadow-sm"
              : "bg-white/90 text-ink/65 ring-1 ring-ink/10 hover:bg-white hover:text-ink"
          }`}
        >
          {inCompare ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Scale className="h-3.5 w-3.5" />
          )}
        </button>

        {diffBadge && (
          <span className="pointer-events-none absolute bottom-3 left-3.5 rounded-full bg-canvas/95 px-2.5 py-1 text-[10.5px] font-semibold text-ink/75 ring-1 ring-ink/[0.07]">
            {diffBadge}
          </span>
        )}
      </div>

      {/* Тело карточки */}
      <div className="flex flex-1 flex-col p-5">
        <div className="text-[11.5px] font-semibold text-track truncate">
          {purpose}
        </div>

        <Link
          href={`/catalog/${active.slug}`}
          className="mt-1 text-[15px] sm:text-base font-extrabold leading-snug tracking-[-0.01em] text-ink group-hover:text-track transition-colors"
        >
          {active.seriesName || active.shortName}{" "}
          <span className="text-ink/50 font-bold">
            · {active.photometry?.wattage} Вт
          </span>
        </Link>

        {/* Выбор мощности прямо на карточке */}
        <div className="mt-3 flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {sorted.map((m, mIdx) => {
            const w = m.photometry?.wattage;
            const selected = mIdx === idx;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setIdx(mIdx)}
                className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold transition-all ${
                  selected
                    ? "bg-ink text-white shadow-sm"
                    : "bg-canvas text-ink/70 hover:bg-ink/10 hover:text-ink"
                }`}
              >
                {w} Вт
              </button>
            );
          })}
        </div>

        {active.photometry && (
          <div className="mt-2 text-[11px] text-ink/50 tabular-nums">
            {active.photometry.fluxRange} · {active.photometry.driver} · {active.warrantyYears ? `${active.warrantyYears} лет` : "Гарантия по запросу"}
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <div className="text-sm font-extrabold text-ink tabular-nums">
            {priced ? (
              <>
                {formatPrice(active.price)}{" "}
                <span className="text-xs font-medium text-ink/45">
                  / {active.unit}
                </span>
              </>
            ) : (
              <span className="text-ink/80">По запросу</span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {inCart ? (
              <button
                type="button"
                onClick={openCart}
                title="Открыть список КП"
                className="inline-flex h-9 items-center gap-1 rounded-full bg-turf px-3.5 text-xs font-bold text-white hover:bg-turf/90 active:scale-95 transition-all"
              >
                <Check className="h-3.5 w-3.5" />В списке
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  addToCart(active.id, active.minOrder, false, false)
                }
                title={`Добавить ${active.sku} в список КП`}
                className="inline-flex h-9 items-center gap-1 rounded-full bg-ink px-3.5 text-xs font-bold text-white hover:bg-track active:scale-95 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />В КП
              </button>
            )}
            <Link
              href={`/catalog/${active.slug}`}
              aria-label={`Открыть: ${active.shortName}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink/70 hover:bg-ink/10 hover:text-ink transition-colors"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
