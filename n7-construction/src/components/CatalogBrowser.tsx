"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  ChevronDown,
  Search,
  X,
  Zap,
} from "lucide-react";
import {
  CATEGORIES,
  LIGHTING_SERIES,
  Product,
  ProductCategory,
  ProductSubcategory,
} from "@/data/products";
import { SUBCATEGORIES } from "@/data/subcategories";
import {
  LIGHTING_FAMILY_GUIDE,
  SPORT_FILTERS,
  matchesSportFilter,
} from "@/data/product-ui";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/MotionPrimitives";

import { ScrollRail } from "@/components/ScrollRail";

interface CatalogBrowserProps {
  initialCategory?: ProductCategory | "all";
  initialSubcategory?: ProductSubcategory | "all";
  initialQuery?: string;
  initialSport?: string;
}

const PAGE_STEP = 18;

const CYR_TO_LAT: Record<string, string> = { а:"a", б:"b", в:"v", г:"g", д:"d", е:"e", ё:"e", ж:"zh", з:"z", и:"i", й:"y", к:"k", л:"l", м:"m", н:"n", о:"o", п:"p", р:"r", с:"s", т:"t", у:"u", ф:"f", х:"kh", ц:"ts", ч:"ch", ш:"sh", щ:"shch", ы:"y", э:"e", ю:"yu", я:"ya", ь:"", ъ:"" };
const EN_TO_RU: Record<string, string> = Object.fromEntries(Object.entries({ q:"й", w:"ц", e:"у", r:"к", t:"е", y:"н", u:"г", i:"ш", o:"щ", p:"з", "[":"х", "]":"ъ", a:"ф", s:"ы", d:"в", f:"а", g:"п", h:"р", j:"о", k:"л", l:"д", ";":"ж", "'":"э", z:"я", x:"ч", c:"с", v:"м", b:"и", n:"т", m:"ь", ",":"б", ".":"ю" }));
const RU_TO_EN: Record<string, string> = Object.fromEntries(Object.entries(EN_TO_RU).map(([en, ru]) => [ru, en]));
const normalizeSearch = (value: string) => value.toLocaleLowerCase("ru").replace(/ё/g, "е").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const transliterate = (value: string) => [...value].map((c) => CYR_TO_LAT[c] ?? c).join("");
const switchKeyboard = (value: string, map: Record<string, string>) => [...value].map((c) => map[c] ?? c).join("");
function editDistanceAtMostOne(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else { i++; j++; }
  }
  if (i < a.length || j < b.length) edits++;
  return edits <= 1;
}
function matchesSearch(haystack: string, query: string) {
  const hay = normalizeSearch(haystack);
  const q = normalizeSearch(query);
  if (!q) return true;
  const hayVariants = [hay, transliterate(hay), switchKeyboard(hay, EN_TO_RU), switchKeyboard(hay, RU_TO_EN)];
  const queryVariants = [q, transliterate(q), switchKeyboard(q, EN_TO_RU), switchKeyboard(q, RU_TO_EN)];
  if (queryVariants.some((variant) => variant && hayVariants.some((candidate) => candidate.includes(variant)))) return true;
  const terms = q.split(/\s+/).filter(Boolean);
  const hayTokens = hayVariants.flatMap((variant) => variant.split(/\s+/));
  return terms.every((term) => {
    const variants = [term, transliterate(term), switchKeyboard(term, EN_TO_RU), switchKeyboard(term, RU_TO_EN)];
    return variants.some((v) => hayTokens.some((token) => token.startsWith(v) || (v.length >= 4 && token.length >= 4 && editDistanceAtMostOne(v, token))));
  });
}

export function CatalogBrowser({
  initialCategory = "all",
  initialSubcategory = "all",
  initialQuery = "",
  initialSport = "all",
}: CatalogBrowserProps) {
  const { liveProducts } = useStore();
  const topRef = useRef<HTMLDivElement>(null);

  const [category, setCategory] = useState<ProductCategory | "all">(
    initialCategory
  );
  const [subcategory, setSubcategory] = useState<ProductSubcategory | "all">(
    initialSubcategory
  );
  const [sport, setSport] = useState<string>(initialSport || "all");
  const [seriesCode, setSeriesCode] = useState<string>("all");
  const [wattage, setWattage] = useState<number | "all">("all");
  const [env, setEnv] = useState<"all" | "indoor" | "outdoor" | "universal">(
    "all"
  );
  const [query, setQuery] = useState(initialQuery);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_STEP);

  // Pages exports one catalog HTML for every query string. Read the URL after hydration.
  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_STATIC_SITE !== '1') return;
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get('q') || '');
      const id = params.get('sport');
      setSport(SPORT_FILTERS.some(item => item.id === id) ? id! : 'all');
      setVisibleCount(PAGE_STEP);
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  const isLightingScope =
    category === "lighting" ||
    (subcategory !== "all" && subcategory.startsWith("led-"));

  const visibleSubcategories = useMemo(() => {
    if (category === "all") return SUBCATEGORIES;
    return SUBCATEGORIES.filter((s) => s.parentCategory === category);
  }, [category]);

  const visibleLightingSeries = useMemo(() => {
    if (!isLightingScope) return [];
    if (subcategory !== "all" && subcategory.startsWith("led-")) {
      return LIGHTING_SERIES.filter((s) => s.subcategory === subcategory);
    }
    return LIGHTING_SERIES;
  }, [isLightingScope, subcategory]);

  const availableWattages = useMemo(() => {
    if (!isLightingScope) return [];
    const set = new Set<number>();
    for (const p of liveProducts) {
      if (p.category !== "lighting" || !p.photometry?.wattage) continue;
      if (subcategory !== "all" && p.subcategory !== subcategory) continue;
      if (seriesCode !== "all" && p.seriesCode !== seriesCode) continue;
      set.add(p.photometry.wattage);
    }
    return Array.from(set).sort((a, b) => a - b);
  }, [isLightingScope, liveProducts, subcategory, seriesCode]);

  const thicknessOf = (p: Product) => p.specs.find(s => s.label === "Толщина")?.value;
  const [thickness, setThickness] = useState("");
  const thicknesses = Array.from(new Set(liveProducts.filter(p => p.category === "flooring" && (subcategory === "all" || subcategory === p.subcategory)).map(thicknessOf).filter((v): v is string => Boolean(v)))).sort((a,b) => a.localeCompare(b, "ru", {numeric:true}));
  const filtered = useMemo(() => {
    const q = query.trim();
    return liveProducts.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (subcategory !== "all" && p.subcategory !== subcategory) return false;
      if (category === "flooring" && thickness && thicknessOf(p) !== thickness) return false;
      if (sport !== "all" && !matchesSportFilter(p, sport)) return false;
      if (
        isLightingScope &&
        seriesCode !== "all" &&
        p.seriesCode !== seriesCode
      ) {
        return false;
      }
      if (
        isLightingScope &&
        wattage !== "all" &&
        p.photometry?.wattage !== wattage
      ) {
        return false;
      }
      if (
        env !== "all" &&
        p.environment !== env &&
        p.environment !== "universal"
      ) {
        return false;
      }
      if (!q) return true;
      const hay = [
        p.name,
        p.shortName,
        p.sku,
        p.seriesName || "",
        p.summary,
        p.subcategoryLabel,
        ...(p.variants?.map((v) => v.code) || []),
        ...p.sports,
        ...p.certifications,
        ...p.specs.map((s) => s.value),
      ]
        .join(" ")
        .toLowerCase();
      return matchesSearch(hay, q);
    });
  }, [
    liveProducts,
    thickness,
    category,
    subcategory,
    sport,
    isLightingScope,
    seriesCode,
    wattage,
    env,
    query,
  ]);

  const entries = filtered;
  const shownEntries = entries.slice(0, visibleCount);
  const remaining = Math.max(0, entries.length - shownEntries.length);

  // Кнопка «Сбросить фильтры» появляется ТОЛЬКО если пользователь сам изменил фильтр
  const isDirty =
    category !== initialCategory ||
    subcategory !== initialSubcategory ||
    sport !== "all" ||
    seriesCode !== "all" ||
    wattage !== "all" ||
    env !== "all" ||
    Boolean(thickness || query.trim());

  const resetFilters = () => {
    setCategory(initialCategory);
    setThickness("");
    setSubcategory(initialSubcategory);
    setSport("all");
    setSeriesCode("all");
    setWattage("all");
    setEnv("all");
    setQuery("");
    setVisibleCount(PAGE_STEP);
  };

  return (
    <div ref={topRef} className="space-y-5 scroll-mt-24">
      {/* Наглядный гид по 4 линейкам прожекторов: «какую куда брать» */}
      {isLightingScope && initialSubcategory === "all" && (
        <ScrollRail
          fadeColor="canvas"
          showArrows={false}
          trackClassName="grid grid-flow-col auto-cols-[240px] sm:auto-cols-fr sm:grid-cols-4 gap-3 pb-1"
          ariaLabel="Гид по линейкам прожекторов N7"
        >
          {LIGHTING_FAMILY_GUIDE.map((fam) => {
            const active = subcategory === fam.subcategory;
            return (
              <button
                key={fam.subcategory}
                type="button"
                data-active={active ? "true" : undefined}
                onClick={() => {
                  setThickness("");
                  setSubcategory(active ? "all" : fam.subcategory);
                  setSeriesCode("all");
                  setWattage("all");
                  setVisibleCount(PAGE_STEP);
                }}
                className={`flex flex-col justify-between rounded-[22px] p-4 text-left transition-all ${
                  active
                    ? "bg-ink text-white shadow-md"
                    : "bg-white text-ink ring-1 ring-ink/[0.08] hover:ring-ink/25"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold">{fam.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                      active
                        ? "bg-track text-white"
                        : "bg-canvas text-ink/65"
                    }`}
                  >
                    {fam.power}
                  </span>
                </div>
                <p
                  className={`mt-2 text-xs leading-snug ${
                    active ? "text-white/80" : "text-ink/60"
                  }`}
                >
                  {fam.purpose}
                </p>
                <div
                  className={`mt-2.5 text-[10.5px] font-bold ${
                    active ? "text-track" : "text-ink/45"
                  }`}
                >
                  {fam.badge} · {fam.count} мод.
                </div>
              </button>
            );
          })}
        </ScrollRail>
      )}

      {/* Единый остров фильтров (без дублей) */}
      <div className="rounded-[28px] bg-white p-4 sm:p-5 ring-1 ring-ink/[0.08] shadow-card space-y-3.5">
        {/* Поиск + условия */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(PAGE_STEP);
              }}
              placeholder="Название, часть артикула или параметр — например, TITAN / 400 Вт"
              className="w-full rounded-full bg-canvas py-2.5 pl-10 pr-9 text-sm text-ink placeholder:text-ink/40 focus:bg-white focus:ring-2 focus:ring-track focus:outline-none transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Очистить поиск"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <select
            value={env}
            onChange={(e) => {
              setEnv(
                e.target.value as "all" | "indoor" | "outdoor" | "universal"
              );
              setVisibleCount(PAGE_STEP);
            }}
            aria-label="Условия применения"
            className="rounded-full bg-canvas px-4 py-2.5 text-xs font-bold text-ink focus:ring-2 focus:ring-track focus:outline-none"
          >
            <option value="all">Улица и зал</option>
            <option value="indoor">Для зала</option>
            <option value="outdoor">Для улицы</option>
          </select>
        </div>

        {/* Категории (показываем на общей странице каталога) */}
        {initialCategory === "all" && (
          <ScrollRail
            fadeColor="white"
            showArrows={false}
            trackClassName="flex items-center gap-1.5 py-0.5"
            ariaLabel="Разделы каталога"
          >
            <button
              type="button"
              data-active={category === "all" ? "true" : undefined}
              onClick={() => {
                setCategory("all");
                setThickness("");
                setSubcategory("all");
                setSeriesCode("all");
                setWattage("all");
                setVisibleCount(PAGE_STEP);
              }}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition-all ${
                category === "all"
                  ? "bg-ink text-white shadow-sm"
                  : "bg-canvas text-ink/70 hover:text-ink"
              }`}
            >
              Все · {liveProducts.length}
            </button>
            {CATEGORIES.map((cat) => {
              const count = liveProducts.filter(
                (p) => p.category === cat.id
              ).length;
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  data-active={active ? "true" : undefined}
                  onClick={() => {
                    setCategory(cat.id);
                    setThickness("");
                    setSubcategory("all");
                    setSeriesCode("all");
                    setWattage("all");
                    setVisibleCount(PAGE_STEP);
                  }}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition-all ${
                    active
                      ? "bg-ink text-white shadow-sm"
                      : "bg-canvas text-ink/70 hover:text-ink"
                  }`}
                >
                  {cat.shortName} · {count}
                </button>
              );
            })}
          </ScrollRail>
        )}

        {/* Подбор по задаче / виду спорта (на общей странице и в покрытиях) */}
        {!isLightingScope && category !== "infrastructure" && (
          <div className="border-t border-ink/[0.06] pt-3">
            <ScrollRail
              fadeColor="white"
              trackClassName="flex items-center gap-1.5 py-0.5"
              ariaLabel="Подбор по виду спорта и задаче"
            >
              <span className="mr-1 shrink-0 text-[11px] font-bold text-ink/40">
                Задача:
              </span>
              <button
                type="button"
                data-active={sport === "all" ? "true" : undefined}
                onClick={() => {
                  setSport("all");
                  setVisibleCount(PAGE_STEP);
                }}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${
                  sport === "all"
                    ? "bg-track text-white"
                    : "bg-canvas text-ink/70 hover:text-ink"
                }`}
              >
                Любая
              </button>
              {SPORT_FILTERS.map((sf) => {
                const active = sport === sf.id;
                return (
                  <button
                    key={sf.id}
                    type="button"
                    data-active={active ? "true" : undefined}
                    onClick={() => {
                      setSport(active ? "all" : sf.id);
                      setVisibleCount(PAGE_STEP);
                    }}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${
                      active
                        ? "bg-track text-white"
                        : "bg-canvas text-ink/70 hover:text-ink"
                    }`}
                  >
                    {sf.label}
                  </button>
                );
              })}
            </ScrollRail>
          </div>
        )}

        {/* Линейки (скрываем, если подкатегория всего одна или уже зафиксирована страницей) */}
        {initialSubcategory === "all" && visibleSubcategories.length > 1 && (
          <div className="border-t border-ink/[0.06] pt-3">
            <ScrollRail
              fadeColor="white"
              trackClassName="flex items-center gap-1.5 py-0.5"
              ariaLabel="Линейки продукции"
            >
              <span className="mr-1 shrink-0 text-[11px] font-bold text-ink/40">
                Линейка:
              </span>
              <button
                type="button"
                data-active={subcategory === "all" ? "true" : undefined}
                onClick={() => {
                  setThickness("");
                  setSubcategory("all");
                  setSeriesCode("all");
                  setWattage("all");
                  setVisibleCount(PAGE_STEP);
                }}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                  subcategory === "all"
                    ? "bg-ink/10 text-ink font-bold"
                    : "text-ink/60 hover:bg-canvas hover:text-ink"
                }`}
              >
                Все
              </button>
              {visibleSubcategories.map((sub) => {
                const active = subcategory === sub.slug;
                return (
                  <button
                    key={sub.slug}
                    type="button"
                    data-active={active ? "true" : undefined}
                    onClick={() => {
                      setThickness("");
                      setSubcategory(active ? "all" : sub.slug);
                      setSeriesCode("all");
                      setWattage("all");
                      setVisibleCount(PAGE_STEP);
                    }}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                      active
                        ? "bg-ink text-white font-bold"
                        : "text-ink/60 hover:bg-canvas hover:text-ink"
                    }`}
                  >
                    {sub.shortName}
                  </button>
                );
              })}
            </ScrollRail>
          </div>
        )}

        {category === "flooring" && thicknesses.length > 0 && (
          <label className="flex flex-wrap items-center gap-3 border-t border-ink/10 pt-3 text-sm font-semibold">Толщина покрытия
            <select value={thickness} onChange={e => { setThickness(e.target.value); setVisibleCount(PAGE_STEP); }} className="min-h-11 rounded-xl bg-canvas px-3">
              <option value="">Любая толщина</option>
              {thicknesses.map(t => <option key={t}>{t}</option>)}
            </select>
          </label>
        )}
        {/* Серия и мощность для прожекторов */}
        {isLightingScope && (
          <div className="space-y-2.5 border-t border-ink/[0.06] pt-3">
            {visibleLightingSeries.length > 1 && (
              <ScrollRail
                fadeColor="white"
                trackClassName="flex items-center gap-1.5 py-0.5"
                ariaLabel="Серии прожекторов N7"
              >
                <span className="mr-1 shrink-0 text-[11px] font-bold text-ink/40">
                  Серия:
                </span>
                <button
                  type="button"
                  data-active={seriesCode === "all" ? "true" : undefined}
                  onClick={() => {
                    setSeriesCode("all");
                    setWattage("all");
                    setVisibleCount(PAGE_STEP);
                  }}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                    seriesCode === "all"
                      ? "bg-ink text-white"
                      : "bg-canvas text-ink/70 hover:text-ink"
                  }`}
                >
                  Все
                </button>
                {visibleLightingSeries.map((s) => {
                  const active = seriesCode === s.code;
                  return (
                    <button
                      key={s.code}
                      type="button"
                      data-active={active ? "true" : undefined}
                      onClick={() => {
                        setSeriesCode(active ? "all" : s.code);
                        setWattage("all");
                        setVisibleCount(PAGE_STEP);
                      }}
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                        active
                          ? "bg-ink text-white"
                          : "bg-canvas text-ink/70 hover:text-ink"
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </ScrollRail>
            )}

            {availableWattages.length > 0 && (
              <ScrollRail
                fadeColor="white"
                trackClassName="flex items-center gap-1.5 py-0.5"
                ariaLabel="Фильтр по мощности"
              >
                <span className="mr-1 shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-ink/40">
                  <Zap className="h-3 w-3 text-track" />
                  Мощность:
                </span>
                <button
                  type="button"
                  data-active={wattage === "all" ? "true" : undefined}
                  onClick={() => {
                    setWattage("all");
                    setVisibleCount(PAGE_STEP);
                  }}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                    wattage === "all"
                      ? "bg-track text-white"
                      : "bg-canvas text-ink/70 hover:text-ink"
                  }`}
                >
                  Все
                </button>
                {availableWattages.map((w) => {
                  const active = wattage === w;
                  return (
                    <button
                      key={w}
                      type="button"
                      data-active={active ? "true" : undefined}
                      onClick={() => {
                        setWattage(active ? "all" : w);
                        setVisibleCount(PAGE_STEP);
                      }}
                      className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold transition-colors ${
                        active
                          ? "bg-track text-white"
                          : "bg-canvas text-ink/75 hover:text-ink"
                      }`}
                    >
                      {w} Вт
                    </button>
                  );
                })}
              </ScrollRail>
            )}
          </div>
        )}
      </div>

      {/* Строка состояния + тумблер «По сериям / Все мощности» для света */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink/55 px-1">
        <div className="flex items-center gap-3">
          <span>
            Показано {shownEntries.length} из {filtered.length}
          </span>
          {isDirty && (
            <button
              type="button"
              onClick={resetFilters}
              className="font-bold text-track hover:underline"
            >
              Сбросить
            </button>
          )}
        </div>

      </div>

      {/* Сетка карточек */}
      {entries.length === 0 ? (
        <div className="rounded-[26px] bg-white p-8 sm:p-12 text-center ring-1 ring-ink/[0.08] space-y-4">
          <div>
            <p className="text-sm font-extrabold text-ink">По этому запросу не нашлось точного совпадения</p>
            <p className="mt-1 text-xs text-ink/55">Попробуйте сократить запрос, ввести часть артикула или выбрать направление ниже.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/catalog/category/flooring" className="rounded-full bg-canvas px-4 py-2 text-xs font-bold text-ink hover:bg-ink/10">Покрытия</Link>
            <Link href="/catalog/category/lighting" className="rounded-full bg-canvas px-4 py-2 text-xs font-bold text-ink hover:bg-ink/10">Освещение</Link>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex rounded-full bg-ink px-5 py-2 text-xs font-bold text-white"
          >
            Сбросить фильтры и показать каталог
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shownEntries.map((product, index) => <Reveal key={product.id} delay={(index % 3) * 0.045} className="h-full"><ProductCard product={product} /></Reveal>)}
          </div>

          {(remaining > 0 || shownEntries.length > PAGE_STEP) && (
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              {remaining > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => setVisibleCount((v) => v + PAGE_STEP)}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-xs font-extrabold text-white shadow-sm hover:bg-ink/90 active:scale-[0.98] transition-all"
                  >
                    <ChevronDown className="h-4 w-4 text-track" />
                    Показать ещё {Math.min(PAGE_STEP, remaining)}
                  </button>
                  {remaining > PAGE_STEP && (
                    <button
                      type="button"
                      onClick={() => setVisibleCount(entries.length)}
                      className="inline-flex h-11 items-center rounded-full bg-white px-5 text-xs font-bold text-ink ring-1 ring-ink/15 hover:ring-ink/35 transition-all"
                    >
                      Показать все ({entries.length})
                    </button>
                  )}
                </>
              )}
              {shownEntries.length > 9 && (
                <button
                  type="button"
                  onClick={() =>
                    topRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  className="inline-flex h-11 items-center gap-1.5 rounded-full bg-white px-4 text-xs font-bold text-ink/75 ring-1 ring-ink/[0.12] hover:text-ink transition-colors"
                >
                  <ArrowUp className="h-3.5 w-3.5 text-track" />К фильтрам
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
