"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Compass,
  FileSpreadsheet,
  FileText,
  Home,
  LayoutGrid,
  Map,
  Phone,
  Scale,
  Send,
  ShoppingBag,
  X,
} from "lucide-react";
import { CATEGORIES } from "@/data/products";
import { CatalogDirectory } from "./CatalogDirectory";
import { useStore } from "@/context/StoreContext";

export function MobileBottomNav() {
  const pathname = usePathname();
  const {
    cartCount,
    isCartOpen,
    openCart,
    compareIds,
    liveProducts,
    liveSettings,
    openLeadModal,
  } = useStore();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Закрываем меню разделов при переходе на новую страницу
  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  // Закрытие по Escape и блокировка прокрутки фона при открытом листе разделов
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of CATEGORIES) {
      map[c.id] = liveProducts.filter((p) => p.category === c.id).length;
    }
    return map;
  }, [liveProducts]);

  // В /admin рендерится свой нижний остров управления
  if (pathname?.startsWith("/admin") || isCartOpen) return null;

  const isHome = pathname === "/";
  const isCatalog =
    pathname === "/catalog" || Boolean(pathname?.startsWith("/catalog/"));
  const isCart = pathname === "/cart";
  const isContacts = pathname === "/contacts";
  const isSecondaryRoute =
    pathname === "/pricelist" || pathname === "/compare" || pathname === "/map";

  const phoneHref = liveSettings.phone
    ? `tel:+${liveSettings.phone.replace(/\D/g, "")}`
    : "";

  return (
    <>
      {/* Затемнение и всплывающий округлый остров «Разделы» над нижним доком */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden no-print"
          role="dialog"
          aria-modal="true"
          aria-label="Навигация по разделам сайта"
        >
          <button
            type="button"
            aria-label="Закрыть меню разделов"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 h-full w-full bg-ink/55 backdrop-blur-[3px]"
          />

          <div
            style={{
              bottom: "calc(env(safe-area-inset-bottom, 0px) + 78px)",
            }}
            className="fixed inset-x-3 mx-auto max-w-md max-h-[calc(100dvh-108px)] overflow-y-auto overscroll-contain dark-scrollbar rounded-[28px] bg-[#0B0F14]/95 p-4 pt-3 text-white shadow-[0_28px_70px_-12px_rgba(11,15,20,0.75)] ring-1 ring-white/[0.16] backdrop-blur-2xl space-y-4"
          >
            {/* Индикатор прокручиваемого листа */}
            <div aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-white/20" />

            {/* Шапка листа */}
            <div className="flex items-center justify-between px-1">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-track">
                  Навигация N7
                </div>
                <div className="text-sm font-extrabold text-white">
                  Куда перейти ({liveProducts.length} позиций)
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Закрыть"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-inset ring-white/15 hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 3 главных направления каталога */}
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const href = `/catalog/category/${cat.slug}`;
                const active = pathname === href;
                return (
                  <Link
                    key={cat.id}
                    href={href}
                    onClick={() => setSheetOpen(false)}
                    className={`flex flex-col justify-between rounded-2xl p-3 ring-1 ring-inset transition-all active:scale-[0.98] ${
                      active
                        ? "bg-white text-ink ring-white shadow-sm"
                        : "bg-white/[0.06] text-white ring-white/10 hover:bg-white/[0.12]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`font-mono text-[10px] font-extrabold ${
                          active ? "text-track" : "text-white/50"
                        }`}
                      >
                        {categoryCounts[cat.id] ?? 0}
                      </span>
                      <ArrowUpRight
                        className={`h-3.5 w-3.5 ${
                          active ? "text-track" : "text-white/35"
                        }`}
                      />
                    </div>
                    <span className="mt-2 text-[11.5px] font-extrabold leading-tight">
                      {cat.shortName}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Все 11 товарных групп (подкатегории) */}
            <div className="border-t border-white/10 pt-3.5">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                  Каталог по разделам
                </span>
                <Link
                  href="/catalog"
                  onClick={() => setSheetOpen(false)}
                  className="text-[11px] font-bold text-track"
                >
                  Весь каталог →
                </Link>
              </div>
              <CatalogDirectory products={liveProducts} onNavigate={() => setSheetOpen(false)} />
            </div>

            {/* Страницы и инструменты сайта */}
            <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-3.5">
              <Link
                href="/pricelist"
                onClick={() => setSheetOpen(false)}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-xs font-bold transition-colors ${
                  pathname === "/pricelist"
                    ? "bg-white text-ink"
                    : "bg-white/[0.07] text-white/90 hover:bg-white/15"
                }`}
              >
                <FileSpreadsheet className="h-3.5 w-3.5 shrink-0 text-track" />
                <span className="truncate">Скачать каталог</span>
              </Link>

              <Link
                href="/compare"
                onClick={() => setSheetOpen(false)}
                className={`inline-flex items-center justify-between gap-1.5 rounded-full px-3.5 py-2.5 text-xs font-bold transition-colors ${
                  pathname === "/compare"
                    ? "bg-white text-ink"
                    : "bg-white/[0.07] text-white/90 hover:bg-white/15"
                }`}
              >
                <span className="inline-flex items-center gap-2 truncate">
                  <Scale className="h-3.5 w-3.5 shrink-0 text-track" />
                  <span className="truncate">Сравнение</span>
                </span>
                {compareIds.length > 0 && (
                  <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-track px-1 text-[10px] font-extrabold text-white">
                    {compareIds.length}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                onClick={() => setSheetOpen(false)}
                className={`inline-flex items-center justify-between gap-1.5 rounded-full px-3.5 py-2.5 text-xs font-bold transition-colors ${
                  pathname === "/cart"
                    ? "bg-white text-ink"
                    : "bg-white/[0.07] text-white/90 hover:bg-white/15"
                }`}
              >
                <span className="inline-flex items-center gap-2 truncate">
                  <ShoppingBag className="h-3.5 w-3.5 shrink-0 text-track" />
                  <span className="truncate">Список КП</span>
                </span>
                {cartCount > 0 && (
                  <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-track px-1 text-[10px] font-extrabold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href="/map"
                onClick={() => setSheetOpen(false)}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-xs font-bold transition-colors ${
                  pathname === "/map"
                    ? "bg-white text-ink"
                    : "bg-white/[0.07] text-white/90 hover:bg-white/15"
                }`}
              >
                <Map className="h-3.5 w-3.5 shrink-0 text-track" />
                <span className="truncate">Карта сайта</span>
              </Link>
            </div>

            {/* Быстрое действие: звонок (если указан в /admin) + запрос КП */}
            <div className="flex gap-2 border-t border-white/10 pt-3.5">
              {liveSettings.phone && (
                <a
                  href={phoneHref}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-white/10 px-4 text-xs font-bold text-white ring-1 ring-inset ring-white/15"
                >
                  <Phone className="h-3.5 w-3.5 text-track" />
                  <span>Звонок</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  setSheetOpen(false);
                  openLeadModal({
                    title: "Запросить коммерческое предложение",
                    source: "Нижняя мобильная навигация",
                  });
                }}
                className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-track px-4 text-xs font-extrabold text-white shadow-[0_6px_20px_rgba(217,68,35,0.45)] active:scale-[0.98] transition-all"
              >
                <Send className="h-3.5 w-3.5" />
                Быстрый запрос КП
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Нижний парящий округлый остров навигации (Mobile & Tablet < lg) */}
      <nav
        data-mobile-dock="true"
        aria-label="Нижняя мобильная навигация"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
        }}
        className="fixed inset-x-0 bottom-0 z-40 lg:hidden pointer-events-none px-3 pt-2 no-print"
      >
        <div className="pointer-events-auto mx-auto grid max-w-md grid-cols-5 items-center gap-1 rounded-full bg-[#0B0F14]/[0.94] p-1.5 text-white shadow-[0_18px_48px_-10px_rgba(11,15,20,0.65),0_4px_16px_rgba(11,15,20,0.25)] ring-1 ring-white/[0.16] backdrop-blur-2xl">
          {/* 1. Главная */}
          <Link
            href="/"
            aria-current={isHome && !sheetOpen ? "page" : undefined}
            className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-full px-1 py-1.5 transition-all active:scale-95 ${
              isHome && !sheetOpen
                ? "bg-white text-ink shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Home className="h-[18px] w-[18px]" strokeWidth={2.2} />
            <span className="text-[10px] font-bold leading-none tracking-tight">
              Главная
            </span>
          </Link>

          {/* 2. Каталог */}
          <Link
            href="/catalog"
            aria-current={isCatalog && !sheetOpen ? "page" : undefined}
            className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-full px-1 py-1.5 transition-all active:scale-95 ${
              isCatalog && !sheetOpen
                ? "bg-white text-ink shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            <LayoutGrid className="h-[18px] w-[18px]" strokeWidth={2.2} />
            <span className="text-[10px] font-bold leading-none tracking-tight">
              Каталог
            </span>
          </Link>

          {/* 3. Разделы (открывает всплывающий остров всех категорий и страниц) */}
          <button
            type="button"
            onClick={() => setSheetOpen((v) => !v)}
            aria-expanded={sheetOpen}
            aria-label="Открыть все разделы сайта"
            className={`relative flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-full px-1 py-1.5 transition-all active:scale-95 ${
              sheetOpen
                ? "bg-track text-white shadow-[0_4px_14px_rgba(217,68,35,0.45)]"
                : isSecondaryRoute
                ? "bg-white text-ink shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            {sheetOpen ? (
              <X className="h-[18px] w-[18px]" strokeWidth={2.3} />
            ) : (
              <Compass className="h-[18px] w-[18px]" strokeWidth={2.2} />
            )}
            <span className="text-[10px] font-bold leading-none tracking-tight">
              Разделы
            </span>
            {!sheetOpen && compareIds.length > 0 && (
              <span className="absolute right-2 top-1 h-2 w-2 rounded-full bg-track ring-2 ring-[#0B0F14]" />
            )}
          </button>

          {/* 4. Список КП */}
          <button
            type="button"
            onClick={() => {
              setSheetOpen(false);
              openCart();
            }}
            aria-label="Открыть список запроса КП"
            className={`relative flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-full px-1 py-1.5 transition-all active:scale-95 ${
              isCart && !sheetOpen
                ? "bg-white text-ink shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            <div className="relative">
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={2.2} />
              {cartCount > 0 && (
                <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-track px-1 text-[9px] font-extrabold text-white ring-2 ring-[#0B0F14]">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold leading-none tracking-tight">
              Список
            </span>
          </button>

          {/* 5. Заявка КП (страница /contacts) */}
          <Link
            href="/contacts"
            aria-current={isContacts && !sheetOpen ? "page" : undefined}
            className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-full px-1 py-1.5 transition-all active:scale-95 ${
              isContacts && !sheetOpen
                ? "bg-white text-ink shadow-sm"
                : "bg-track/[0.18] text-white hover:bg-track/30"
            }`}
          >
            <FileText
              className={`h-[18px] w-[18px] ${
                isContacts && !sheetOpen ? "text-track" : "text-track"
              }`}
              strokeWidth={2.2}
            />
            <span className="text-[10px] font-extrabold leading-none tracking-tight">
              Заявка
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
