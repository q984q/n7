"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calculator,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Maximize2,
  Minus,
  Plus,
  Scale,
  ShoppingBag,
  X,
  Zap,
} from "lucide-react";
import {
  LIGHTING_SERIES,
  Product,
  formatWarranty,
  getTierPrice,
  orderQuantity,
} from "@/data/products";
import {
  AREA_PRESETS,
  getProductHeroMetrics,
  getProductPurpose,
  getProductSwatches,
} from "@/data/product-ui";
import { useStore } from "@/context/StoreContext";
import { formatPrice, hasPrice } from "@/lib/format";
import { ScrollRail } from "@/components/ScrollRail";
import { BrandLogo } from "./BrandLogo";
import { LightingSeriesComparison } from "./LightingSeriesComparison";

export function ProductDetailClient({
  product: initialProduct,
}: {
  product: Product;
}) {
  const {
    liveProducts,
    addToCart,
    isInCart,
    compareIds,
    toggleCompare,
    openLeadModal,
  } = useStore();

  const product =
    liveProducts.find((p) => p.id === initialProduct.id) || initialProduct;
  const isLighting = product.category === "lighting";
  const isAreaProduct = product.unit === "м²";

  const gallery =
    product.gallery.length > 0 ? product.gallery : [product.image];
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const activeImg = gallery[activeImgIdx] || product.image;
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.code || ""
  );
  const swatchGroups = useMemo(() => getProductSwatches(product), [product]);
  const [selectedSwatches, setSelectedSwatches] = useState<
    Record<string, string>
  >(() => {
    const init: Record<string, string> = {};
    for (const g of getProductSwatches(product)) {
      if (g.items[0]) init[g.id] = g.items[0].label;
    }
    return init;
  });
  const [selectedBeam, setSelectedBeam] = useState<string>(
    product.photometry?.beamAngles?.[0] || ""
  );

  const [inputQty, setQty] = useState<number | string>(product.minOrder);
  const qty = orderQuantity(product, Number(inputQty));
  const [calcOpen, setCalcOpen] = useState(false);
  const [hallLen, setHallLen] = useState("24");
  const [hallWid, setHallWid] = useState("12");
  const [addReserve, setAddReserve] = useState(true);

  const [detailTab, setDetailTab] = useState<"specs" | "advantages" | "about">(
    "specs"
  );

  // Закрытие лайтбокса по Esc и блокировка скролла
  useEffect(() => {
    if (!lightboxOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight" && gallery.length > 1) {
        setActiveImgIdx((i) => (i + 1) % gallery.length);
      }
      if (e.key === "ArrowLeft" && gallery.length > 1) {
        setActiveImgIdx((i) => (i - 1 + gallery.length) % gallery.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen, gallery.length]);

  // Мощности текущей серии прожекторов
  const seriesSiblings = useMemo(() => {
    if (!product.seriesCode) return [];
    return liveProducts
      .filter((p) => p.seriesCode === product.seriesCode)
      .sort((a, b) => (a.photometry?.wattage || 0) - (b.photometry?.wattage || 0));
  }, [liveProducts, product.seriesCode]);

  // Родственные серии той же линейки
  const familySeriesLinks = useMemo(() => {
    if (!product.seriesCode) return [];
    const curW = product.photometry?.wattage || 0;
    return LIGHTING_SERIES.filter(
      (s) => s.subcategory === product.subcategory && s.code !== product.seriesCode
    ).map((s) => {
      const targetW = s.wattages.includes(curW)
        ? curW
        : [...s.wattages].sort((a, b) => Math.abs(a - curW) - Math.abs(b - curW))[0];
      return {
        code: s.code,
        name: s.name,
        wattage: targetW,
        slug: `${s.slugPrefix}-${targetW}w`,
      };
    });
  }, [product.seriesCode, product.subcategory, product.photometry?.wattage]);

  const quickMetrics = useMemo(() => getProductHeroMetrics(product), [product]);
  const purpose = useMemo(() => getProductPurpose(product), [product]);
  const activeVariantObj = product.variants?.find(
    (v) => v.code === selectedVariant
  );

  // Расчёт площади зала
  const calculatedArea = useMemo(() => {
    const l = parseFloat(hallLen.replace(",", "."));
    const w = parseFloat(hallWid.replace(",", "."));
    if (!Number.isFinite(l) || !Number.isFinite(w) || l <= 0 || w <= 0) return 0;
    const raw = l * w;
    return Math.ceil(addReserve ? raw * 1.05 : raw);
  }, [hallLen, hallWid, addReserve]);

  // Единая строка выбранных опций (сохраняется и в «Список КП», и в заявку!)
  const optionsNote = useMemo(() => {
    const parts: string[] = [];
    if (
      selectedVariant &&
      product.variants &&
      product.variants.length > 1
    ) {
      parts.push(selectedVariant);
    }
    for (const g of swatchGroups) {
      const chosen = selectedSwatches[g.id];
      if (chosen) {
        const shortLabel =
          g.id === "turf"
            ? `Газон: ${chosen}`
            : g.id === "frame"
            ? `Каркас: ${chosen}`
            : g.id === "cct"
            ? `CCT: ${chosen}`
            : g.id === "wood"
            ? `Порода: ${chosen}`
            : g.id === "housing"
            ? `Корпус: ${chosen}`
            : `Цвет: ${chosen}`;
        parts.push(shortLabel);
      }
    }
    if (isLighting && selectedBeam) {
      parts.push(`Оптика: ${selectedBeam}`);
    }
    return parts.join(" · ");
  }, [
    selectedVariant,
    product.variants,
    swatchGroups,
    selectedSwatches,
    isLighting,
    selectedBeam,
  ]);

  const inCompare = compareIds.includes(product.id);
  const alreadyInCart = isInCart(product.id);
  const tier = getTierPrice(product, qty);
  const priced = hasPrice(product.price);

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="border-t-2 border-ink pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs font-semibold uppercase tracking-wider">
          <span className="border-l-4 border-track pl-3 text-track-dark">N7 Construction / {product.subcategoryLabel}</span>
          <span className="text-ink-muted">Арт. {product.sku}</span>
        </div>
        <h1 className="mt-5 max-w-5xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{product.shortName}</h1>
        <p className="mt-2 text-ink-muted">{purpose}</p>
      </header>
      <button type="button" onClick={()=>window.print()} className="no-print inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold ring-1 ring-ink/10"><FileText className="h-4 w-4" />Печать / PDF характеристик</button>
      <button type="button" className="no-print min-h-11 px-4 text-sm font-bold underline" onClick={()=>openLeadModal({title:"Документы и фото модели",source:`Карточка ${product.sku}`,contextSummary:`${product.shortName} · ${product.sku}. Прошу предоставить паспорт производителя и фото реального образца до заказа.`})}>Запросить паспорт и фото образца</button>
      <article className="n7-print-sheet hidden">
        <BrandLogo theme="light"/><p>Техническое приложение к запросу КП</p><h1>{product.name}</h1><p>Арт. {product.sku} · {product.subcategoryLabel}</p>
        <p>{product.summary}</p><dl>{product.specs.map((s,i)=><div key={i}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>
        <p>Минимальный заказ: {product.minOrder} {product.unit}. Шаг заказа: {product.stepQty} {product.unit}.</p>
        <small>Справочный лист каталога. Не заменяет паспорт производителя или коммерческое предложение.</small>
      </article>
      {/* Верхний экран: галерея с зумом + интерактивный выбор */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Галерея */}
        <div className="min-w-0 lg:col-span-7 space-y-3">
          <div
            onClick={() => setLightboxOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setLightboxOpen(true);
            }}
            aria-label="Увеличить изображение"
            className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-[28px] bg-white ring-1 ring-ink/[0.08] shadow-card"
          >
            <Image
              src={activeImg}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={
                isLighting
                  ? "object-contain p-7 sm:p-10 transition-transform duration-500 group-hover:scale-[1.03]"
                  : "object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              }
            />
            {activeImg.endsWith('-studio.jpg') && <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink">Визуализация модели</span>}
            <span className="absolute right-4 bottom-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink/70 ring-1 ring-ink/10 backdrop-blur-md group-hover:bg-ink group-hover:text-white transition-colors">
              <Maximize2 className="h-4 w-4" />
            </span>
          </div>

          {gallery.length > 1 && (
            <ScrollRail
              fadeColor="canvas"
              trackClassName="flex items-center gap-2.5 pb-1"
              ariaLabel="Фотографии позиции"
            >
              {gallery.map((img, i) => {
                const active = activeImgIdx === i;
                return (
                  <button
                    key={img}
                    type="button"
                    data-active={active ? "true" : undefined}
                    onClick={() => setActiveImgIdx(i)}
                    className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white transition-all ${
                      active
                        ? "border-track shadow-sm"
                        : "border-transparent ring-1 ring-ink/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={product.shortName}
                      fill
                      sizes="80px"
                      className={
                        isLighting ? "object-contain p-1.5" : "object-cover"
                      }
                    />
                  </button>
                );
              })}
            </ScrollRail>
          )}
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-ink-line">
            {quickMetrics.map((metric) => (
              <div key={metric.label} className="flex min-w-0 flex-col bg-ink-soft p-3 sm:p-5">
                <dt className="text-xs text-white/75">{metric.label}</dt>
                <dd className="mt-2 text-sm font-bold leading-tight text-white sm:text-lg">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Правая колонка */}
        <div className="min-w-0 lg:col-span-5 space-y-4">
          <div className="flex items-center gap-3 border-b border-ink/15 pb-3">
            <span className="h-2 w-2 bg-track" aria-hidden="true" />
            <h2 className="text-xl font-bold tracking-tight">Конфигурация и заказ</h2>
          </div>

          <Link href="/contacts#project" className="block rounded-xl bg-white p-4 font-bold text-ink ring-1 ring-ink/10">Не знаю модель — подобрать по объекту →</Link>
          {/* Переключатель мощностей серии (для прожекторов N7) */}
          {seriesSiblings.length > 1 && (
            <div className="rounded-[24px] bg-white p-4 ring-1 ring-ink/[0.07] space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/60">
                  <Zap className="h-3.5 w-3.5 text-track" />
                  Мощность
                </span>
                <span className="text-[11px] font-semibold text-ink/40">
                  {product.seriesName}
                </span>
              </div>
              <ScrollRail
                fadeColor="white"
                trackClassName="flex items-stretch gap-2 py-0.5"
                ariaLabel={`Выбор мощности ${product.seriesName}`}
              >
                {seriesSiblings.map((sib) => {
                  const isCurrent = sib.id === product.id;
                  const w = sib.photometry?.wattage;
                  return (
                    <Link
                      key={sib.id}
                      href={`/catalog/${sib.slug}`}
                      aria-current={isCurrent ? "page" : undefined}
                      className={`flex min-w-[82px] shrink-0 flex-col items-center justify-center rounded-2xl px-3 py-2 text-center transition-all ${
                        isCurrent
                          ? "bg-track text-white shadow-sm"
                          : "bg-canvas text-ink hover:bg-ink/10"
                      }`}
                    >
                      <span className="text-xs font-extrabold whitespace-nowrap">
                        {w} Вт
                      </span>
                      <span
                        className={`mt-0.5 font-mono text-[9.5px] whitespace-nowrap ${
                          isCurrent ? "text-white/80" : "text-ink/45"
                        }`}
                      >
                        {sib.sku}
                      </span>
                    </Link>
                  );
                })}
              </ScrollRail>

              <LightingSeriesComparison product={product} siblings={seriesSiblings} />

              {familySeriesLinks.length > 0 && (
                <div className="border-t border-ink/[0.06] pt-2.5">
                  <ScrollRail
                    fadeColor="white"
                    showArrows={false}
                    trackClassName="flex items-center gap-1.5 text-[11px]"
                    ariaLabel="Другие исполнения линейки"
                  >
                    {familySeriesLinks.map((fs) => (
                      <Link
                        key={fs.code}
                        href={`/catalog/${fs.slug}`}
                        className="shrink-0 rounded-full bg-canvas px-3 py-1 font-bold text-ink/70 hover:bg-ink hover:text-white transition-colors"
                      >
                        {fs.name} · {fs.wattage} Вт
                      </Link>
                    ))}
                  </ScrollRail>
                </div>
              )}
            </div>
          )}

          {/* Выбор исполнения / драйвера */}
          {product.variants && product.variants.length > 1 && (
            <div className="rounded-[24px] bg-white p-4 ring-1 ring-ink/[0.07] space-y-2.5">
              <div className="text-xs font-bold text-ink/60">
                {isLighting ? "Комплектация драйвера" : "Исполнение"}
              </div>
              <ScrollRail
                fadeColor="white"
                trackClassName="flex items-center gap-2 py-0.5"
                ariaLabel="Выбор исполнения"
              >
                {product.variants.map((v) => {
                  const active = selectedVariant === v.code;
                  return (
                    <button
                      key={v.code}
                      type="button"
                      data-active={active ? "true" : undefined}
                      onClick={() => setSelectedVariant(v.code)}
                      className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition-all ${
                        active
                          ? "bg-ink text-white shadow-sm"
                          : "bg-canvas text-ink/75 hover:text-ink"
                      }`}
                    >
                      {v.code}
                    </button>
                  );
                })}
              </ScrollRail>
              {activeVariantObj && (
                <div className="text-xs text-ink/60 px-0.5">
                  <strong className="text-ink">{activeVariantObj.spec}</strong>
                  {activeVariantObj.detail ? ` · ${activeVariantObj.detail}` : ""}
                </div>
              )}
            </div>
          )}

          {/* Наглядные свотчи цветов / пород дерева / газона / RAL / CCT + углы оптики */}
          {(swatchGroups.length > 0 ||
            (isLighting &&
              product.photometry &&
              product.photometry.beamAngles.length > 0)) && (
            <div className="rounded-[24px] bg-white p-4 ring-1 ring-ink/[0.07] space-y-3.5">
              {swatchGroups.map((group) => {
                const current = selectedSwatches[group.id];
                return (
                  <div key={group.id} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-ink/60">{group.title}</span>
                      <span className="font-bold text-ink">{current}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {group.items.map((sw) => {
                        const active = current === sw.label;
                        return (
                          <button
                            key={sw.label}
                            type="button"
                            onClick={() =>
                              setSelectedSwatches((prev) => ({
                                ...prev,
                                [group.id]: sw.label,
                              }))
                            }
                            title={sw.label}
                            className={`inline-flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1 text-[11px] font-semibold transition-all ${
                              active
                                ? "bg-ink text-white shadow-sm"
                                : "bg-canvas text-ink/75 hover:text-ink"
                            }`}
                          >
                            <span
                              style={{ backgroundColor: sw.hex }}
                              className="h-4 w-4 shrink-0 rounded-full ring-1 ring-black/15"
                            />
                            <span>{sw.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {isLighting &&
                product.photometry &&
                product.photometry.beamAngles.length > 0 && (
                  <div
                    className={`space-y-2 ${
                      swatchGroups.length > 0
                        ? "border-t border-ink/[0.06] pt-3"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-ink/60">
                        Угол оптики (линза)
                      </span>
                      <span className="font-mono font-bold text-ink">
                        {selectedBeam}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {product.photometry.beamAngles.map((ang) => {
                        const active = selectedBeam === ang;
                        return (
                          <button
                            key={ang}
                            type="button"
                            onClick={() => setSelectedBeam(ang)}
                            className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold transition-all ${
                              active
                                ? "bg-ink text-white shadow-sm"
                                : "bg-canvas text-ink/75 hover:text-ink"
                            }`}
                          >
                            {ang}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Остров цены, калькулятора площади и кнопок КП */}
          <div className="rounded-[26px] bg-white p-5 ring-1 ring-ink/[0.08] shadow-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink tabular-nums">
                  {priced ? (
                    <>
                      {formatPrice(tier.unitPrice)}{" "}
                      <span className="text-sm font-medium text-ink/45">
                        / {product.unit}
                      </span>
                    </>
                  ) : (
                    "По запросу"
                  )}
                </div>
                {priced && qty > 1 && (
                  <div className="mt-0.5 text-xs text-ink/55 tabular-nums">
                    За {qty} {product.unit}:{" "}
                    <strong className="text-ink">{formatPrice(tier.total)}</strong>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isAreaProduct && (
                  <button
                    type="button"
                    aria-label="Калькулятор площади"
                    aria-expanded={calcOpen}
                    onClick={() => setCalcOpen((v) => !v)}
                    className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition-colors ${
                      calcOpen
                        ? "bg-ink text-white"
                        : "bg-canvas text-ink/75 hover:text-ink"
                    }`}
                  >
                    <Calculator className="h-3.5 w-3.5 text-track" />
                    <span className="hidden sm:inline">По размерам</span>
                  </button>
                )}

                <div className="inline-flex items-center rounded-full bg-canvas p-1 ring-1 ring-ink/[0.08]">
                  <button
                    type="button"
                    onClick={() =>
                      setQty(orderQuantity(product, qty - product.stepQty))
                    }
                    aria-label="Уменьшить"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink/70 hover:bg-white hover:text-ink transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="number"
                    min={product.minOrder} step={product.stepQty}
                    aria-label={`Количество (${product.unit})`}
                    value={inputQty} onBlur={() => setQty(qty)}
                    onChange={e => setQty(e.target.value)}
                    className="w-16 bg-transparent text-center text-xs font-extrabold text-ink focus:outline-none tabular-nums"
                  />
                  <span className="pr-1.5 text-[11px] font-medium text-ink/45">
                    {product.unit}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(qty + product.stepQty)}
                    aria-label="Увеличить"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink/70 hover:bg-white hover:text-ink transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-ink-muted">Минимальный заказ: {product.minOrder} {product.unit} · Шаг: {product.stepQty} {product.unit}</p>
            {/* Быстрый калькулятор площади зала (м²) */}
            {isAreaProduct && calcOpen && (
              <div className="rounded-2xl bg-canvas p-3.5 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {AREA_PRESETS.map((pr) => (
                    <button
                      key={pr.label}
                      type="button"
                      onClick={() => {
                        setHallLen(String(pr.l));
                        setHallWid(String(pr.w));
                      }}
                      className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/75 ring-1 ring-ink/[0.08] hover:text-track"
                    >
                      {pr.label} м
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <label className="block">
                    <span className="text-[10.5px] font-semibold text-ink/50">
                      Длина, м
                    </span>
                    <input
                      type="number"
                      min={1}
                      step="0.5"
                      value={hallLen}
                      onChange={(e) => setHallLen(e.target.value)}
                      className="mt-1 h-10 w-full rounded-xl bg-white px-3 text-xs font-extrabold text-ink ring-1 ring-ink/10 focus:ring-2 focus:ring-track focus:outline-none tabular-nums"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10.5px] font-semibold text-ink/50">
                      Ширина, м
                    </span>
                    <input
                      type="number"
                      min={1}
                      step="0.5"
                      value={hallWid}
                      onChange={(e) => setHallWid(e.target.value)}
                      className="mt-1 h-10 w-full rounded-xl bg-white px-3 text-xs font-extrabold text-ink ring-1 ring-ink/10 focus:ring-2 focus:ring-track focus:outline-none tabular-nums"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-ink/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addReserve}
                      onChange={(e) => setAddReserve(e.target.checked)}
                      className="h-4 w-4 rounded accent-track"
                    />
                    <span>+5% запас на подрезку</span>
                  </label>

                  {calculatedArea > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setQty(orderQuantity(product, calculatedArea));
                        setCalcOpen(false);
                      }}
                      className="rounded-full bg-ink px-4 py-1.5 text-xs font-extrabold text-white hover:bg-track transition-colors tabular-nums"
                    >
                      Подставить {orderQuantity(product, calculatedArea)} м²
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Кнопки действий (сохраняют все выбранные параметры!) */}
            <div className="grid gap-2.5 sm:grid-cols-[1fr_1fr_auto]">
              <button
                type="button"
                onClick={() =>
                  addToCart(product.id, qty, false, true, optionsNote)
                }
                className="inline-flex min-h-12 py-2 items-center justify-center gap-2 rounded-full bg-track px-5 text-xs font-extrabold text-white hover:bg-[#e54d2b] active:scale-[0.99] transition-all"
              >
                <ShoppingBag className="h-4 w-4" />
                {alreadyInCart ? "Добавить ещё в КП" : "В список КП"}
              </button>
              <button
                type="button"
                onClick={() =>
                  openLeadModal({
                    title: product.shortName,
                    source: `Карточка ${product.sku}`,
                    contextSummary: [
                      `${product.shortName} (${product.sku})`,
                      optionsNote,
                      `Объём: ${qty} ${product.unit}`,
                    ]
                      .filter(Boolean)
                      .join(" · "),
                  })
                }
                className="inline-flex min-h-12 py-2 items-center justify-center gap-2 rounded-full bg-ink px-5 text-xs font-extrabold text-white hover:bg-ink/90 active:scale-[0.99] transition-all"
              >
                <FileText className="h-4 w-4" />
                Запросить расчёт
              </button>
              <button
                type="button"
                onClick={() => toggleCompare(product.id)}
                title={inCompare ? "Убрать из сравнения" : "Сравнить"}
                aria-label={inCompare ? "Убрать из сравнения" : "Сравнить"}
                className={`inline-flex h-12 sm:w-12 items-center justify-center gap-1.5 rounded-full transition-colors ${
                  inCompare
                    ? "bg-track/10 text-track ring-1 ring-track/30"
                    : "bg-canvas text-ink/70 hover:text-ink"
                }`}
              >
                {inCompare ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Scale className="h-4 w-4" />
                )}
                <span className="sm:hidden text-xs font-bold">
                  {inCompare ? "В сравнении" : "Сравнить"}
                </span>
              </button>
            </div>

            {/* Короткая доверительная строка условий */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/[0.06] pt-3 text-[11px] text-ink/50">
              <span>Поставка по всему Казахстану</span>
              <span>
                {product.category === "flooring"
                  ? "Образцы и монтаж — по запросу"
                  : "Договор · монтаж по запросу"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Вкладки детальных данных */}
      <div className="space-y-4">
        <ScrollRail
          fadeColor="canvas"
          showArrows={false}
          trackClassName="inline-flex items-center gap-1.5 rounded-full bg-white p-1.5 ring-1 ring-ink/[0.08]"
          ariaLabel="Разделы описания модели"
        >
          {(
            [
              { id: "specs", label: "Характеристики" },
              { id: "advantages", label: "Особенности" },
              { id: "about", label: "О модели" },
            ] as const
          ).map((t) => {
            const active = detailTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                data-active={active ? "true" : undefined}
                onClick={() => setDetailTab(t.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  active
                    ? "bg-ink text-white shadow-sm"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </ScrollRail>

        {detailTab === "specs" && (
          <div className="rounded-[28px] bg-white p-5 sm:p-8 ring-1 ring-ink/[0.08]">
            <dl className="grid gap-x-10 sm:grid-cols-2 divide-y sm:divide-y-0 divide-ink/[0.06]">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-baseline justify-between gap-4 py-3 sm:border-b sm:border-ink/[0.06]"
                >
                  <dt className="text-xs text-ink/50">{spec.label}</dt>
                  <dd
                    className={`text-xs text-right ${
                      spec.highlight
                        ? "font-extrabold text-ink"
                        : "font-semibold text-ink/85"
                    }`}
                  >
                    {spec.value}
                  </dd>
                </div>
              ))}
              {product.warrantyYears > 0 && (
                <div className="flex items-baseline justify-between gap-4 py-3 sm:border-b sm:border-ink/[0.06]">
                  <dt className="text-xs text-ink/50">Гарантия</dt>
                  <dd className="text-xs text-right font-extrabold text-ink">
                    {formatWarranty(product.warrantyYears)}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {detailTab === "advantages" && (
          <div className="rounded-[28px] bg-white p-5 sm:p-8 ring-1 ring-ink/[0.08]">
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.advantages.map((adv) => (
                <li
                  key={adv}
                  className="flex items-start gap-2.5 rounded-2xl bg-canvas p-4 text-xs sm:text-sm font-medium text-ink/80"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-track" />
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {detailTab === "about" && (
          <div className="rounded-[28px] bg-white p-5 sm:p-8 ring-1 ring-ink/[0.08] space-y-3 max-w-3xl">
            <h2 className="text-base sm:text-lg font-extrabold text-ink">
              {product.name}
            </h2>
            <p className="text-sm leading-relaxed text-ink/70">
              {product.description}
            </p>
          </div>
        )}
      </div>

      {/* Полноэкранный лайтбокс (увеличение фото) */}
      {lightboxOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F14]/90 p-4 backdrop-blur-xl"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Закрыть просмотр"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveImgIdx(
                    (i) => (i - 1 + gallery.length) % gallery.length
                  )
                }
                aria-label="Предыдущее фото"
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveImgIdx((i) => (i + 1) % gallery.length)
                }
                aria-label="Следующее фото"
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div
            className={`relative h-[76dvh] w-full max-w-4xl overflow-hidden rounded-[28px] ${
              isLighting ? "bg-white" : "bg-ink"
            }`}
          >
            <Image
              src={activeImg}
              alt={product.name}
              fill
              sizes="95vw"
              className="object-contain p-4 sm:p-8"
            />
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur-md">
            {product.shortName}
            {gallery.length > 1
              ? ` · ${activeImgIdx + 1} / ${gallery.length}`
              : ""}
          </div>
        </div>
      )}
    </div>
  );
}
