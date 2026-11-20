"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Download,
  Plus,
  Printer,
  Search,
} from "lucide-react";
import {
  CATEGORIES,
  LIGHTING_SERIES,
  ProductCategory,
  formatWarranty,
} from "@/data/products";
import { getProductCardChips, getProductPurpose } from "@/data/product-ui";
import { useStore } from "@/context/StoreContext";
import { formatPrice, hasPrice } from "@/lib/format";
import { ScrollRail } from "@/components/ScrollRail";

const MOBILE_STEP = 20;

export function PricelistClient() {
  const { liveProducts, addToCart, isInCart, openCart, openLeadModal } =
    useStore();
  const topRef = useRef<HTMLDivElement>(null);
  const [cat, setCat] = useState<ProductCategory | "all">("all");
  const [seriesCode, setSeriesCode] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [mobileLimit, setMobileLimit] = useState(MOBILE_STEP);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return liveProducts.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (cat === "lighting" && seriesCode !== "all" && p.seriesCode !== seriesCode) {
        return false;
      }
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.seriesName || "").toLowerCase().includes(q) ||
        p.subcategoryLabel.toLowerCase().includes(q)
      );
    });
  }, [liveProducts, cat, seriesCode, query]);

  const mobileRows = rows.slice(0, mobileLimit);
  const mobileRemaining = Math.max(0, rows.length - mobileRows.length);

  const exportCsv = () => {
    const header = [
      "Артикул",
      "Раздел / Серия",
      "Наименование",
      "Ключевые параметры",
      "Ед. изм.",
      "Гарантия",
      "Стоимость",
    ];
    const lines = rows.map((p) => {
      const picked =
        p.category === "lighting" ? p.specs.slice(2, 5) : p.specs.slice(0, 2);
      const keySpec = picked.map((s) => `${s.label}: ${s.value}`).join("; ");
      const priceStr = hasPrice(p.price) ? formatPrice(p.price) : "По запросу";
      return [
        p.sku,
        p.seriesName || p.subcategoryLabel,
        p.name,
        keySpec,
        p.unit,
        formatWarranty(p.warrantyYears),
        priceStr,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(";");
    });
    const csv = "\uFEFF" + [header.join(";"), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "n7-construction-specification.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div ref={topRef} className="space-y-6 scroll-mt-24">
      <div className="rounded-3xl border border-ink/10 bg-white p-4 space-y-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <ScrollRail
            fadeColor="white"
            showArrows={false}
            trackClassName="flex items-center gap-1.5 py-0.5"
            ariaLabel="Разделы спецификации"
          >
            <button
              type="button"
              data-active={cat === "all" ? "true" : undefined}
              onClick={() => {
                setCat("all");
                setSeriesCode("all");
                setMobileLimit(MOBILE_STEP);
              }}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition-colors ${
                cat === "all"
                  ? "bg-ink text-white"
                  : "bg-canvas text-ink/70 hover:text-ink"
              }`}
            >
              Все ({liveProducts.length})
            </button>
            {CATEGORIES.map((c) => {
              const cnt = liveProducts.filter((p) => p.category === c.id).length;
              const active = cat === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  data-active={active ? "true" : undefined}
                  onClick={() => {
                    setCat(c.id);
                    setSeriesCode("all");
                    setMobileLimit(MOBILE_STEP);
                  }}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition-colors ${
                    active
                      ? "bg-ink text-white"
                      : "bg-canvas text-ink/70 hover:text-ink"
                  }`}
                >
                  {c.shortName} ({cnt})
                </button>
              );
            })}
          </ScrollRail>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setMobileLimit(MOBILE_STEP);
                }}
                placeholder="Артикул (N7-LVK-0360) или название..."
                className="w-full sm:w-60 rounded-full border border-ink/15 py-2 pl-8 pr-3.5 text-xs focus:border-track focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-2 text-xs font-bold text-ink hover:bg-canvas"
            >
              <Download className="h-3.5 w-3.5 text-track" />
              CSV ({rows.length})
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-2 text-xs font-bold text-ink hover:bg-canvas"
            >
              <Printer className="h-3.5 w-3.5 text-track" />
              Печать
            </button>
          </div>
        </div>

        {cat === "lighting" && (
          <div className="border-t border-ink/[0.08] pt-3">
            <ScrollRail
              fadeColor="white"
              trackClassName="flex items-center gap-1.5 py-0.5"
              ariaLabel="Фирменные серии прожекторов N7"
            >
              <span className="mr-1 shrink-0 text-[11px] font-bold text-ink/45">
                Серия N7:
              </span>
              <button
                type="button"
                data-active={seriesCode === "all" ? "true" : undefined}
                onClick={() => {
                  setSeriesCode("all");
                  setMobileLimit(MOBILE_STEP);
                }}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                  seriesCode === "all"
                    ? "bg-track text-white"
                    : "bg-canvas text-ink/70 hover:text-ink"
                }`}
              >
                Все 9 серий (45)
              </button>
              {LIGHTING_SERIES.map((s) => {
                const active = seriesCode === s.code;
                return (
                  <button
                    key={s.code}
                    type="button"
                    data-active={active ? "true" : undefined}
                    onClick={() => {
                      setSeriesCode(s.code);
                      setMobileLimit(MOBILE_STEP);
                    }}
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                      active
                        ? "bg-track text-white"
                        : "bg-canvas text-ink/70 hover:text-ink"
                    }`}
                  >
                    {s.name}{" "}
                    <span className="font-mono text-[10px] opacity-70">
                      ({s.wattages.length})
                    </span>
                  </button>
                );
              })}
            </ScrollRail>
          </div>
        )}
      </div>

      {/* Мобильный список карточек спецификации с догрузкой */}
      <div className="space-y-3 md:hidden">
        <div className="text-xs text-ink/55">
          Показано <strong className="text-ink tabular-nums">{mobileRows.length}</strong>{" "}
          из <strong className="text-ink tabular-nums">{rows.length}</strong> позиций
        </div>
        <div className="grid grid-cols-1 gap-3">
          {mobileRows.map((p) => {
            const chips = getProductCardChips(p);
            const inCart = isInCart(p.id);
            return (
              <div
                key={p.id}
                className="rounded-2xl bg-white p-4 ring-1 ring-ink/[0.08] space-y-2"
              >
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="rounded-full bg-canvas px-2.5 py-0.5 font-mono font-extrabold text-ink">
                    {p.sku}
                  </span>
                  <span className="text-track font-semibold truncate">
                    {getProductPurpose(p)}
                  </span>
                </div>
                <Link
                  href={`/catalog/${p.slug}`}
                  className="block text-sm font-extrabold leading-snug text-ink hover:text-track"
                >
                  {p.shortName}
                </Link>
                <div className="flex flex-wrap gap-1.5">
                  {chips.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-canvas px-2.5 py-0.5 text-[11px] font-semibold text-ink/70"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-ink/[0.06] pt-2.5">
                  <div className="text-xs font-extrabold text-ink tabular-nums">
                    {hasPrice(p.price)
                      ? `${formatPrice(p.price)} / ${p.unit}`
                      : "По запросу"}
                  </div>
                  {inCart ? (
                    <button
                      type="button"
                      onClick={openCart}
                      className="inline-flex h-9 items-center gap-1 rounded-full bg-turf px-3.5 text-xs font-bold text-white"
                    >
                      <Check className="h-3.5 w-3.5" />В списке
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addToCart(p.id, p.minOrder, false, false)}
                      className="inline-flex h-9 items-center gap-1 rounded-full bg-ink px-3.5 text-xs font-bold text-white active:scale-95 transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" />В КП
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {(mobileRemaining > 0 || mobileRows.length > MOBILE_STEP) && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {mobileRemaining > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setMobileLimit((v) => v + MOBILE_STEP)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-5 text-xs font-extrabold text-white"
                >
                  <ChevronDown className="h-3.5 w-3.5 text-track" />
                  Ещё {Math.min(MOBILE_STEP, mobileRemaining)} (из {mobileRemaining})
                </button>
                {mobileRemaining > MOBILE_STEP && (
                  <button
                    type="button"
                    onClick={() => setMobileLimit(rows.length)}
                    className="inline-flex h-10 items-center rounded-full border border-ink/15 bg-white px-4 text-xs font-bold text-ink"
                  >
                    Все ({rows.length})
                  </button>
                )}
              </>
            )}
            {mobileRows.length > 10 && (
              <button
                type="button"
                onClick={() =>
                  topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="inline-flex h-10 items-center gap-1 rounded-full border border-ink/[0.12] bg-white px-3.5 text-xs font-bold text-ink/75"
              >
                <ArrowUp className="h-3.5 w-3.5 text-track" />
                К фильтрам
              </button>
            )}
          </div>
        )}
      </div>

      {/* Десктопная таблица спецификации с ограниченной высотой, закреплённой шапкой и колонкой артикула */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
        <div className="max-h-[72vh] overflow-auto overscroll-contain custom-scrollbar print:max-h-none print:overflow-visible">
          <table className="w-full min-w-[780px] text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 border-b border-ink/10 bg-canvas text-[11px] font-extrabold uppercase tracking-wider text-ink/60 shadow-[0_1px_0_rgba(11,15,20,0.08)]">
              <tr>
                <th className="sticky left-0 z-20 bg-canvas px-4 py-3.5">Артикул</th>
                <th className="px-4 py-3.5">Наименование и серия</th>
                <th className="px-4 py-3.5">Параметры по спецификации</th>
                <th className="px-4 py-3.5">Гарантия</th>
                <th className="px-4 py-3.5">Ед.</th>
                <th className="px-4 py-3.5">Стоимость</th>
                <th className="px-4 py-3.5 text-right">Запрос</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/[0.08]">
              {rows.map((p) => {
                const chips = getProductCardChips(p);
                const inCart = isInCart(p.id);
                return (
                  <tr key={p.id} className="group hover:bg-canvas/50 transition-colors">
                    <td className="sticky left-0 z-[5] bg-white group-hover:bg-canvas/50 px-4 py-3.5 font-mono font-bold text-ink whitespace-nowrap transition-colors">
                      {p.sku}
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/catalog/${p.slug}`}
                        className="font-bold text-ink hover:text-track"
                      >
                        {p.shortName}
                      </Link>
                      <div className="text-[11px] text-ink/50">
                        {getProductPurpose(p)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-ink/75 max-w-xs">
                      {chips.join(" · ")}
                    </td>
                    <td className="px-4 py-3.5 text-ink/70 whitespace-nowrap">
                      {p.warrantyYears > 0 ? formatWarranty(p.warrantyYears) : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-ink/70 whitespace-nowrap">
                      {p.unit}
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-ink whitespace-nowrap tabular-nums">
                      {hasPrice(p.price) ? formatPrice(p.price) : "По запросу"}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {inCart ? (
                        <button
                          type="button"
                          onClick={openCart}
                          className="inline-flex items-center gap-1 rounded-full bg-turf px-3 py-1.5 text-[11px] font-bold text-white"
                        >
                          <Check className="h-3 w-3" />В списке
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(p.id, p.minOrder, false, false)}
                          className="inline-flex items-center gap-1 rounded-full bg-canvas px-3 py-1.5 text-[11px] font-bold text-ink hover:bg-track hover:text-white transition-colors"
                        >
                          <Plus className="h-3 w-3" />В КП
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-ink/[0.06] bg-canvas/40 px-4 py-2 text-[11px] text-ink/50 print:hidden">
          <span className="tabular-nums">{rows.length} позиций</span>
        </div>
      </div>

      <div className="rounded-[28px] bg-ink p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-[-0.015em]">
            Нужен расчёт по списку?
          </h2>
          <p className="mt-1 text-xs text-white/60">
            Оставьте контакт — подготовим коммерческое предложение.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            openLeadModal({
              title: "Расчёт по прайсу",
              source: "Страница прайса",
            })
          }
          className="shrink-0 rounded-full bg-track px-6 py-3 text-xs font-extrabold text-white hover:bg-[#e54d2b] transition-colors"
        >
          Запросить КП
        </button>
      </div>
    </div>
  );
}
