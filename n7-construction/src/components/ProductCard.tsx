"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Plus, Scale } from "lucide-react";
import { Product } from "@/data/products";
import {
  getProductCardChips,
  getProductPurpose,
  getProductSwatches,
} from "@/data/product-ui";
import { useStore } from "@/context/StoreContext";
import { formatPrice, hasPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, isInCart, openCart, compareIds, toggleCompare } = useStore();
  const inCompare = compareIds.includes(product.id);
  const inCart = isInCart(product.id);
  const priced = hasPrice(product.price);
  const isLighting = product.category === "lighting";

  const purpose = getProductPurpose(product);
  const chips = getProductCardChips(product);
  const primarySwatches = getProductSwatches(product).find(
    (g) => g.id !== "cct" && g.id !== "frame"
  );

  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink/[0.08] shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:ring-ink/20 hover:shadow-elevated">
      {/* Изображение */}
      <div
        className={`relative aspect-[4/3] overflow-hidden ${
          isLighting ? "bg-white border-b border-ink/[0.05]" : "bg-canvas"
        }`}
      >
        <Link href={`/catalog/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
            className={
              isLighting
                ? "object-contain p-6 transition-transform duration-500 group-hover:scale-[1.05]"
                : "object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            }
          />
        </Link>

        <span className="pointer-events-none absolute left-3.5 top-3.5 rounded-md border-l-2 border-track bg-ink/90 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-md">
          {product.sku}
        </span>

        <button
          type="button"
          onClick={() => toggleCompare(product.id)}
          aria-label={inCompare ? "Убрать из сравнения" : "Добавить к сравнению"}
          title={inCompare ? "В сравнении" : "Сравнить"}
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

        {/* Мини-палитра цветов / пород прямо на карточке */}
        {primarySwatches && primarySwatches.items.length > 1 && (
          <div
            title={primarySwatches.title}
            className="pointer-events-none absolute bottom-3 left-3.5 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 ring-1 ring-ink/10 backdrop-blur-md"
          >
            {primarySwatches.items.slice(0, 5).map((sw) => (
              <span
                key={sw.label}
                style={{ backgroundColor: sw.hex }}
                className="h-2.5 w-2.5 rounded-full ring-1 ring-black/15"
              />
            ))}
            {primarySwatches.items.length > 5 && (
              <span className="pl-0.5 text-[9.5px] font-bold text-ink/65">
                +{primarySwatches.items.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Содержание */}
      <div className="flex flex-1 flex-col p-5">
        {/* Понятное назначение для клиента */}
        <div className="text-xs font-semibold text-track-dark border-l-2 border-track pl-2 truncate">
          {purpose}
        </div>

        <Link
          href={`/catalog/${product.slug}`}
          className="mt-2 text-lg sm:text-xl font-extrabold leading-snug tracking-[-0.01em] text-ink group-hover:text-track transition-colors line-clamp-2"
        >
          {product.shortName}
        </Link>

        {/* Аккуратные короткие чипы без обрезки на полуслове */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-canvas px-2.5 py-1 text-[11px] font-semibold text-ink/75 whitespace-nowrap"
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5 flex items-center justify-between gap-2">
          <div className="text-sm font-extrabold text-ink tabular-nums">
            {priced ? (
              <>
                {formatPrice(product.price)}{" "}
                <span className="text-xs font-medium text-ink/45">
                  / {product.unit}
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
                  addToCart(product.id, product.minOrder, false, false)
                }
                title="Добавить в список запроса КП"
                className="inline-flex h-9 items-center gap-1 rounded-full bg-ink px-3.5 text-xs font-bold text-white hover:bg-track active:scale-95 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />В КП
              </button>
            )}
            <Link
              href={`/catalog/${product.slug}`}
              aria-label={`Открыть: ${product.shortName}`}
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
