"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  Phone,
  Scale,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useStore } from "@/context/StoreContext";
import { CatalogDirectory } from "./CatalogDirectory";

const NAV_ITEMS = [
  { label: "Каталог", href: "/catalog" },
  { label: "Покрытия", href: "/catalog/category/flooring" },
  { label: "Падел", href: "/catalog/category/infrastructure" },
  { label: "Свет N7", href: "/catalog/category/lighting" },
  { label: "Прайс", href: "/pricelist" },
  { label: "Контакты", href: "/contacts" },
];

export function Header() {
  const pathname = usePathname();
  const {
    cartCount,
    openCart,
    compareIds,
    openLeadModal,
    liveProducts,
    liveSettings,
  } = useStore();
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  const isHome = pathname === "/";
  const hasBanner = Boolean(
    liveSettings.promoBannerActive && liveSettings.promoBannerText.trim()
  );
  const phoneHref = liveSettings.phone
    ? `tel:+${liveSettings.phone.replace(/\D/g, "")}`
    : "";

  const isCatalogSection =
    pathname === "/catalog" || pathname?.startsWith("/catalog/sub/");

  return (
    <>
      <header
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
        }}
        className="fixed inset-x-0 top-0 z-40 pointer-events-none px-3 sm:px-5 sm:pt-4"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center">
          {/* Опциональная информационная мини-капсула из /admin */}
          {hasBanner && (
            <div className="pointer-events-auto mb-2 inline-flex max-w-full items-center gap-2 rounded-full bg-ink/90 px-4 py-1 text-[11px] font-medium text-white/90 shadow-lg ring-1 ring-white/15 backdrop-blur-xl">
              <Sparkles className="h-3 w-3 shrink-0 text-track" />
              <span className="truncate">{liveSettings.promoBannerText}</span>
            </div>
          )}

          {/* Главный парящий округлый остров навигации */}
          <div
            onMouseLeave={() => setMegaOpen(false)}
            onKeyDown={e => { if (e.key === "Escape") setMegaOpen(false); }}
            onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setMegaOpen(false); }}
            className={`pointer-events-auto relative w-full transition-all duration-300 ease-out ${
              scrolled ? "max-w-[1080px]" : "max-w-[1140px]"
            }`}
          >
            <div
              className={`flex items-center justify-between gap-2 rounded-full p-1.5 pl-2 pr-2 text-white backdrop-blur-2xl transition-all duration-300 ${
                scrolled
                  ? "bg-[#0B0F14]/[0.94] ring-1 ring-white/15 shadow-[0_18px_48px_-12px_rgba(11,15,20,0.52),0_4px_14px_rgba(11,15,20,0.18)]"
                  : "bg-[#0B0F14]/[0.86] ring-1 ring-white/[0.16] shadow-[0_12px_36px_-10px_rgba(11,15,20,0.38),0_2px_10px_rgba(11,15,20,0.12)]"
              }`}
            >
              {/* Логотип с круглой эмблемой */}
              <Link
                href="/"
                aria-label="N7 CONSTRUCTION — на главную"
                className="min-w-0 rounded-full pr-1 sm:pr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-track"
              >
                <BrandLogo theme="dark" compact pill />
              </Link>

              {/* Центральная капсула навигации (Desktop >= lg; на мобильных — нижний остров) */}
              <nav
                aria-label="Основная навигация"
                className="hidden lg:flex items-center gap-0.5 rounded-full bg-white/[0.06] p-1 ring-1 ring-inset ring-white/[0.07]"
              >
                <div onMouseEnter={() => setMegaOpen(true)}>
                  <button
                    type="button" aria-expanded={megaOpen} onClick={() => setMegaOpen(true)}
                    className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-all duration-200 ${
                      isCatalogSection || megaOpen
                        ? "bg-white text-ink shadow-sm"
                        : "text-white/75 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Каталог
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        megaOpen ? "rotate-180" : "opacity-70"
                      }`}
                    />
                  </button>
                </div>

                {NAV_ITEMS.slice(1).map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onMouseEnter={() => setMegaOpen(false)}
                      className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold whitespace-nowrap transition-all duration-200 ${
                        active
                          ? "bg-white text-ink shadow-sm"
                          : "text-white/75 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Правая группа действий внутри верхнего острова */}
              <div className="flex items-center gap-1.5 shrink-0">
                {liveSettings.phone && (
                  <a
                    href={phoneHref}
                    title={liveSettings.phone}
                    aria-label={`Позвонить: ${liveSettings.phone}`}
                    className="inline-flex lg:hidden xl:inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08] text-white/85 ring-1 ring-inset ring-white/10 hover:bg-white/15 hover:text-white transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-track" />
                  </a>
                )}

                <Link
                  href="/compare"
                  title="Сравнение характеристик"
                  aria-label="Сравнение характеристик"
                  className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-inset transition-colors ${
                    pathname === "/compare"
                      ? "bg-white text-ink ring-white"
                      : "bg-white/[0.08] text-white/80 ring-white/10 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  <Scale className="h-3.5 w-3.5" />
                  {compareIds.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-track px-1 text-[9.5px] font-extrabold text-white ring-2 ring-[#0B0F14]">
                      {compareIds.length}
                    </span>
                  )}
                </Link>

                {/* Кнопка списка на десктопе (на мобильных — в нижнем доке) */}
                <button
                  type="button"
                  onClick={openCart}
                  aria-label="Открыть список запроса КП"
                  className="relative hidden lg:inline-flex h-9 items-center gap-1.5 rounded-full bg-white/[0.08] px-3 text-xs font-bold text-white ring-1 ring-inset ring-white/10 hover:bg-white/15 transition-colors"
                >
                  <ShoppingBag className="h-3.5 w-3.5 text-track" />
                  <span>Список</span>
                  {cartCount > 0 && (
                    <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-track px-1.5 text-[10px] font-extrabold text-white">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openLeadModal({
                      title: "Запросить коммерческое предложение",
                      source: "Остров навигации",
                    })
                  }
                  className="inline-flex min-h-11 lg:min-h-9 items-center rounded-full bg-track px-3.5 sm:px-4 text-xs font-extrabold text-white shadow-[0_4px_16px_rgba(217,68,35,0.42)] hover:bg-[#e54d2b] active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  <span className="sm:hidden">Запрос КП</span>
                  <span className="hidden sm:inline">Запросить КП</span>
                </button>
              </div>
            </div>

            {/* Выпадающий округлый остров подкатегорий (Desktop) */}
            {megaOpen && (
              <div className="hidden lg:block absolute left-1/2 top-full -translate-x-1/2 pt-2.5 w-[900px] max-w-[calc(100vw-2rem)]">
                <div className="max-h-[calc(100dvh-104px)] overflow-y-auto overscroll-contain dark-scrollbar rounded-[28px] bg-[#0B0F14]/95 p-5 text-white shadow-[0_28px_70px_-14px_rgba(11,15,20,0.6)] ring-1 ring-white/[0.14] backdrop-blur-2xl">
                  <div className="mb-3.5 flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
                      Каталог по разделам · {liveProducts.length} позиций
                    </span>
                    <Link
                      href="/catalog"
                      onClick={() => setMegaOpen(false)}
                      className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white hover:bg-track transition-colors"
                    >
                      Весь каталог
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <CatalogDirectory products={liveProducts} onNavigate={() => setMegaOpen(false)} />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Отступ под парящий остров на внутренних страницах */}
      {!isHome && (
        <div
          aria-hidden="true"
          className={hasBanner ? "h-24 sm:h-28" : "h-[68px] sm:h-20"}
        />
      )}
    </>
  );
}
