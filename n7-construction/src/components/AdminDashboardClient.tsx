"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Inbox,
  Lock,
  LogOut,
  Package,
  Paperclip,
  Plus,
  RotateCcw,
  Save,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { LIGHTING_SERIES, Product, ProductCategory } from "@/data/products";
import { CmsSettings, LeadRecord, LeadStatus } from "@/lib/cms";
import { BrandLogo } from "@/components/BrandLogo";
import { ScrollRail } from "@/components/ScrollRail";
import { formatPrice, hasPrice } from "@/lib/format";

const STATUS_LABELS: Record<LeadStatus, { label: string; badge: string }> = {
  new: { label: "Новая", badge: "bg-track/[0.12] text-track" },
  in_progress: { label: "В работе", badge: "bg-amber-100 text-amber-800" },
  kp_sent: { label: "КП отправлено", badge: "bg-sky-100 text-sky-800" },
  won: { label: "Согласовано", badge: "bg-emerald-100 text-emerald-800" },
  archived: { label: "Архив", badge: "bg-ink/10 text-ink/60" },
};

export function AdminDashboardClient({ initialAuth = false }: { initialAuth?: boolean }) {
  const [authed, setAuthed] = useState(initialAuth);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<"products" | "leads" | "settings">("products");
  const [notice, setNotice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [catFilter, setCatFilter] = useState<"all" | ProductCategory>("all");
  const [seriesFilter, setSeriesFilter] = useState<string>("all");
  const [mobileLimit, setMobileLimit] = useState<number>(20);
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackTop((window.scrollY || 0) > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [customIds, setCustomIds] = useState<string[]>([]);
  const [seoSummary, setSeoSummary] = useState<{ totalIndexable: number } | null>(null);
  const [settings, setSettings] = useState<CmsSettings>({
    phone: "",
    whatsappNumber: "",
    email: "",
    address: "",
    workingHours: "",
    bin: "",
    iik: "",
    bank: "",
    promoBannerActive: false,
    promoBannerText: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [badgeDrafts, setBadgeDrafts] = useState<Record<string, string>>({});

  // Форма добавления позиции
  const [newName, setNewName] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newCategory, setNewCategory] = useState<ProductCategory>("flooring");
  const [newPrice, setNewPrice] = useState("0");

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3200);
  };

  const loadAll = useCallback(async () => {
    const [cmsRes, leadsRes] = await Promise.all([
      fetch("/api/admin/cms", { cache: "no-store" }),
      fetch("/api/admin/leads", { cache: "no-store" }),
    ]);
    if (cmsRes.status === 401) {
      setAuthed(false);
      return;
    }
    if (cmsRes.ok) {
      const c = await cmsRes.json();
      setProducts(c.products || []);
      setHiddenIds(c.hiddenIds || []);
      setCustomIds(c.customProductIds || []);
      if (c.settings) setSettings(c.settings);
      if (c.seoSummary) setSeoSummary(c.seoSummary);
      const pd: Record<string, string> = {};
      const bd: Record<string, string> = {};
      for (const p of c.products || []) {
        pd[p.id] = String(p.price || 0);
        bd[p.id] = p.badge || "";
      }
      setPriceDrafts(pd);
      setBadgeDrafts(bd);
    }
    if (leadsRes.ok) {
      const l = await leadsRes.json();
      setLeads(l.leads || []);
    }
  }, []);

  useEffect(() => {
    if (authed) {
      loadAll();
    } else {
      fetch("/api/admin/auth", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (d.authenticated) setAuthed(true);
        })
        .catch(() => {});
    }
  }, [authed, loadAll]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      if (catFilter !== "all" && p.category !== catFilter) return false;
      if (
        catFilter === "lighting" &&
        seriesFilter !== "all" &&
        p.seriesCode !== seriesFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        p.sku.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.seriesName || "").toLowerCase().includes(q) ||
        p.subcategoryLabel.toLowerCase().includes(q)
      );
    });
  }, [products, catFilter, seriesFilter, searchQuery]);

  const pricedCount = useMemo(
    () => products.filter((p) => hasPrice(p.price)).length,
    [products]
  );
  const newLeadsCount = useMemo(
    () => leads.filter((l) => l.status === "new").length,
    [leads]
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setAuthError(data.error || "Ошибка входа");
      return;
    }
    setAuthed(true);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthed(false);
  };

  const saveProduct = async (p: Product, extra?: Record<string, unknown>) => {
    const price = Math.max(0, Number(priceDrafts[p.id]) || 0);
    const badge = badgeDrafts[p.id] ?? (p.badge || "");
    const res = await fetch("/api/admin/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_product",
        id: p.id,
        price,
        badge,
        ...extra,
      }),
    });
    if (res.ok) {
      flash(
        price > 0
          ? `Сохранено: ${p.sku} — ${formatPrice(price)} / ${p.unit}`
          : `Сохранено: ${p.sku} — По запросу`
      );
      loadAll();
    }
  };

  const resetProduct = async (id: string) => {
    await fetch("/api/admin/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset_product", id }),
    });
    flash("Возвращены значения по умолчанию (По запросу)");
    loadAll();
  };

  const deleteCustom = async (id: string) => {
    await fetch("/api/admin/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_custom_product", id }),
    });
    flash("Позиция удалена");
    loadAll();
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const res = await fetch("/api/admin/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_product",
        name: newName,
        sku: newSku,
        category: newCategory,
        price: Math.max(0, Number(newPrice) || 0),
      }),
    });
    if (res.ok) {
      setNewName("");
      setNewSku("");
      setNewPrice("0");
      flash("Новая позиция добавлена в каталог");
      loadAll();
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save_settings",
        settings,
        newPassword: newPassword.trim() || undefined,
      }),
    });
    if (res.ok) {
      setNewPassword("");
      flash("Настройки и контакты сохранены");
      loadAll();
    }
  };

  const updateLeadStatus = async (ticketId: string, status: LeadStatus) => {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId, status }),
    });
    loadAll();
  };

  const removeLead = async (ticketId: string) => {
    await fetch(`/api/admin/leads?ticketId=${encodeURIComponent(ticketId)}`, {
      method: "DELETE",
    });
    loadAll();
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-ink bg-blueprint-dark flex flex-col items-center justify-center p-4">
        {/* Верхняя мини-капсула возврата */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/[0.07] p-1.5 pr-4 text-white ring-1 ring-white/[0.14] backdrop-blur-xl">
          <Link
            href="/"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.12] text-white hover:bg-track transition-colors"
            aria-label="На витрину"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
          <span className="text-xs font-semibold text-white/80">
            Панель управления N7
          </span>
        </div>

        <div className="w-full max-w-md rounded-[32px] bg-white p-7 sm:p-8 shadow-[0_28px_80px_-16px_rgba(0,0,0,0.65)] ring-1 ring-white/15 space-y-6">
          <div className="flex items-center justify-between">
            <BrandLogo compact pill />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1 text-[11px] font-bold text-ink/65">
              <Lock className="h-3 w-3 text-track" /> CMS • CRM
            </span>
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-ink">
              Вход в панель управления
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-ink/60">
              Управление ценами в тенге (₸), позициями каталога, входящими
              заявками КП и контактами сайта.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-ink/75 mb-1.5 pl-1">
                Логин
              </label>
              <input
                type="text"
                required
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="admin"
                className="w-full rounded-full border border-ink/15 bg-canvas/50 px-4 py-2.5 text-sm focus:border-track focus:bg-white focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink/75 mb-1.5 pl-1">
                Пароль
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-full border border-ink/15 bg-canvas/50 px-4 py-2.5 text-sm focus:border-track focus:bg-white focus:outline-none transition-colors"
              />
            </div>
            {authError && (
              <div className="rounded-2xl bg-red-50 px-4 py-2.5 text-xs font-medium text-red-700">
                {authError}
              </div>
            )}
            <button
              type="submit"
              className="h-11 w-full rounded-full bg-track text-xs font-extrabold text-white shadow-[0_6px_20px_rgba(217,68,35,0.35)] hover:bg-[#e54d2b] transition-all"
            >
              Войти в панель
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas bg-blueprint-light pb-28 md:pb-20">
      {/* Парящий округлый остров управления (Dynamic Island) */}
      <header className="sticky top-0 z-40 pointer-events-none px-3 sm:px-5 pt-3 sm:pt-4">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2">
          <div className="pointer-events-auto flex w-full items-center justify-between gap-2 rounded-full bg-[#0B0F14]/[0.92] p-1.5 pl-2 pr-2 text-white shadow-[0_18px_48px_-12px_rgba(11,15,20,0.48),0_4px_14px_rgba(11,15,20,0.16)] ring-1 ring-white/15 backdrop-blur-2xl">
            {/* Левая часть острова: логотип + статус */}
            <div className="flex items-center gap-2 shrink-0 pr-1">
              <BrandLogo theme="dark" compact pill />
              <span className="hidden xl:inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white/75">
                Admin
              </span>
            </div>

            {/* Центральный округлый переключатель разделов (Desktop / Tablet) */}
            <nav
              aria-label="Разделы панели управления"
              className="hidden md:flex items-center gap-1 rounded-full bg-white/[0.07] p-1 ring-1 ring-inset ring-white/[0.08]"
            >
              <button
                type="button"
                onClick={() => setTab("products")}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                  tab === "products"
                    ? "bg-white text-ink shadow-sm"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                }`}
              >
                <Package className="h-3.5 w-3.5" />
                <span>Каталог · ₸</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-extrabold tabular-nums ${
                    tab === "products"
                      ? "bg-ink/10 text-ink"
                      : "bg-white/10 text-white/75"
                  }`}
                >
                  {products.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTab("leads")}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                  tab === "leads"
                    ? "bg-white text-ink shadow-sm"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                }`}
              >
                <Inbox className="h-3.5 w-3.5" />
                <span>Заявки КП</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-extrabold tabular-nums ${
                    newLeadsCount > 0
                      ? "bg-track text-white"
                      : tab === "leads"
                      ? "bg-ink/10 text-ink"
                      : "bg-white/10 text-white/75"
                  }`}
                >
                  {leads.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTab("settings")}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                  tab === "settings"
                    ? "bg-white text-ink shadow-sm"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                }`}
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Контакты и баннер</span>
              </button>
            </nav>

            {/* Правая часть острова: витрина + выход */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href="/"
                className="inline-flex h-9 items-center gap-1 rounded-full bg-white/[0.09] px-3.5 text-xs font-bold text-white ring-1 ring-inset ring-white/[0.12] hover:bg-white/[0.16] transition-colors"
              >
                <span className="hidden sm:inline">Витрина</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-track" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                title="Выйти из панели"
                aria-label="Выйти из панели"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.09] text-white/80 ring-1 ring-inset ring-white/[0.12] hover:bg-red-500/25 hover:text-red-200 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Всплывающее уведомление-остров (над нижним доком на мобильных) */}
      {notice && (
        <div className="fixed bottom-24 md:bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-[calc(100vw-1.5rem)] max-w-md flex justify-center">
          <div className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full bg-[#0B0F14]/95 px-5 py-2.5 text-xs font-bold text-white shadow-[0_18px_44px_-8px_rgba(11,15,20,0.55)] ring-1 ring-emerald-400/35 backdrop-blur-2xl">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{notice}</span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8 space-y-6">
        {/* Компактная сводка из 4 округлых карточек-островов */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-3xl bg-white/95 p-4 sm:p-5 ring-1 ring-ink/[0.08] shadow-sm">
            <div className="text-[11px] font-semibold text-ink/50">
              Позиций в каталоге
            </div>
            <div className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
              {products.length - hiddenIds.length}
              <span className="ml-1.5 text-xs font-semibold text-ink/40">
                / {products.length}
              </span>
            </div>
          </div>
          <div className="rounded-3xl bg-white/95 p-4 sm:p-5 ring-1 ring-ink/[0.08] shadow-sm">
            <div className="text-[11px] font-semibold text-ink/50">
              Режим цен на витрине
            </div>
            <div className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
              {pricedCount > 0 ? (
                <>
                  {pricedCount}{" "}
                  <span className="text-xs font-semibold text-emerald-600">
                    с ценой в ₸
                  </span>
                </>
              ) : (
                <span className="text-lg">По запросу</span>
              )}
            </div>
          </div>
          <div className="rounded-3xl bg-white/95 p-4 sm:p-5 ring-1 ring-ink/[0.08] shadow-sm">
            <div className="text-[11px] font-semibold text-ink/50">
              Входящие заявки КП
            </div>
            <div className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
              {leads.length}
              {newLeadsCount > 0 && (
                <span className="ml-2 rounded-full bg-track/10 px-2 py-0.5 text-[11px] font-bold text-track">
                  +{newLeadsCount} новых
                </span>
              )}
            </div>
          </div>
          <div className="rounded-3xl bg-white/95 p-4 sm:p-5 ring-1 ring-ink/[0.08] shadow-sm">
            <div className="text-[11px] font-semibold text-ink/50">
              Страниц в поиске
            </div>
            <div className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
              {seoSummary ? seoSummary.totalIndexable : "—"}
            </div>
          </div>
        </div>

        {/* КАТАЛОГ И ЦЕНЫ В ТЕНГЕ */}
        {tab === "products" && (
          <div className="space-y-5">
            {/* Остров добавления позиции и фильтрации */}
            <div className="rounded-[28px] bg-white p-5 sm:p-6 ring-1 ring-ink/[0.08] shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <p className="text-xs text-ink/65">
                  <strong className="text-ink">Цены в тенге (₸):</strong> значение{" "}
                  <code className="rounded-full bg-canvas px-2 py-0.5 font-mono text-ink">
                    0
                  </code>{" "}
                  показывается как <strong>«По запросу»</strong>; число больше 0
                  сразу выводит цену в ₸.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1 rounded-full bg-canvas p-1">
                    {(
                      [
                        { id: "all", label: "Все" },
                        { id: "flooring", label: "Покрытия" },
                        { id: "infrastructure", label: "Падел" },
                        { id: "lighting", label: "Свет" },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setCatFilter(f.id);
                          setSeriesFilter("all");
                          setMobileLimit(20);
                        }}
                        className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                          catFilter === f.id
                            ? "bg-ink text-white shadow-sm"
                            : "text-ink/65 hover:text-ink"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Артикул или название..."
                      className="rounded-full border border-ink/[0.12] bg-canvas/50 py-1.5 pl-9 pr-8 text-xs focus:border-track focus:bg-white focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        aria-label="Сбросить поиск"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {catFilter === "lighting" && (
                <div className="border-t border-ink/[0.07] pt-3">
                  <ScrollRail
                    fadeColor="white"
                    trackClassName="flex items-center gap-1.5 py-0.5"
                    ariaLabel="Фильтр по сериям света N7"
                  >
                    <span className="mr-1 shrink-0 text-[11px] font-bold text-ink/45">
                      Серия света:
                    </span>
                    <button
                      type="button"
                      data-active={seriesFilter === "all" ? "true" : undefined}
                      onClick={() => {
                        setSeriesFilter("all");
                        setMobileLimit(20);
                      }}
                      className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                        seriesFilter === "all"
                          ? "bg-track text-white shadow-sm"
                          : "bg-canvas text-ink/70 hover:text-ink"
                      }`}
                    >
                      Все (45)
                    </button>
                    {LIGHTING_SERIES.map((s) => {
                      const active = seriesFilter === s.code;
                      return (
                        <button
                          key={s.code}
                          type="button"
                          data-active={active ? "true" : undefined}
                          onClick={() => {
                            setSeriesFilter(s.code);
                            setMobileLimit(20);
                          }}
                          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                            active
                              ? "bg-track text-white shadow-sm"
                              : "bg-canvas text-ink/70 hover:text-ink"
                          }`}
                        >
                          {s.name}{" "}
                          <span className="font-mono text-[10px] opacity-70">
                            {s.skuPrefix}
                          </span>
                        </button>
                      );
                    })}
                  </ScrollRail>
                </div>
              )}

              <form
                onSubmit={createProduct}
                className="grid gap-2.5 sm:grid-cols-12 border-t border-ink/[0.07] pt-4"
              >
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Новая позиция (наименование)"
                  className="sm:col-span-5 rounded-full border border-ink/15 bg-canvas/40 px-4 py-2 text-xs focus:border-track focus:bg-white focus:outline-none"
                />
                <input
                  type="text"
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value)}
                  placeholder="Код модели"
                  className="sm:col-span-2 rounded-full border border-ink/15 bg-canvas/40 px-4 py-2 text-xs font-mono focus:border-track focus:bg-white focus:outline-none"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                  className="sm:col-span-2 rounded-full border border-ink/15 bg-white px-3.5 py-2 text-xs font-semibold focus:border-track focus:outline-none"
                >
                  <option value="flooring">Покрытия</option>
                  <option value="infrastructure">Падел-корты</option>
                  <option value="lighting">Освещение</option>
                </select>
                <input
                  type="number"
                  min={0}
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Цена ₸ (0 = КП)"
                  className="sm:col-span-2 rounded-full border border-ink/15 bg-canvas/40 px-4 py-2 text-xs font-mono focus:border-track focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="sm:col-span-1 inline-flex items-center justify-center gap-1 rounded-full bg-track px-3 py-2 text-xs font-extrabold text-white hover:bg-[#e54d2b] transition-colors"
                  title="Добавить позицию"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sm:hidden">Добавить</span>
                </button>
              </form>
            </div>

            {/* Мобильные карточки позиций с плавной догрузкой */}
            <div className="space-y-3 md:hidden">
              <div className="text-xs text-ink/55 px-1">
                Показано{" "}
                <strong className="text-ink tabular-nums">
                  {Math.min(mobileLimit, filteredProducts.length)}
                </strong>{" "}
                из{" "}
                <strong className="text-ink tabular-nums">
                  {filteredProducts.length}
                </strong>{" "}
                позиций
              </div>
              <div className="grid gap-3">
              {filteredProducts.slice(0, mobileLimit).map((p) => {
                const isHidden = hiddenIds.includes(p.id);
                const isCustom = customIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className={`rounded-3xl bg-white p-4 ring-1 ring-ink/[0.08] shadow-sm space-y-3 ${
                      isHidden ? "opacity-65" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full bg-canvas px-2.5 py-0.5 font-mono text-[11px] font-extrabold text-ink">
                        {p.sku}
                      </span>
                      <button
                        type="button"
                        onClick={() => saveProduct(p, { hidden: !isHidden })}
                        className="inline-flex items-center gap-1 rounded-full border border-ink/15 px-2.5 py-1 text-[11px] font-semibold"
                      >
                        {isHidden ? (
                          <>
                            <EyeOff className="h-3 w-3 text-ink/50" /> Скрыт
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 text-emerald-600" /> Виден
                          </>
                        )}
                      </button>
                    </div>

                    <div>
                      <div className="text-xs font-extrabold leading-snug text-ink">
                        {p.name}
                      </div>
                      <div className="mt-0.5 text-[11px] text-ink/50">
                        {p.seriesName || p.subcategoryLabel} • ед.: {p.unit} • сейчас:{" "}
                        <strong className="text-ink/80">
                          {hasPrice(p.price) ? formatPrice(p.price) : "По запросу"}
                        </strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-ink/45 mb-1 pl-1">
                          Цена, ₸ (0 = КП)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={priceDrafts[p.id] ?? "0"}
                          onChange={(e) =>
                            setPriceDrafts((d) => ({
                              ...d,
                              [p.id]: e.target.value,
                            }))
                          }
                          className="w-full rounded-full border border-ink/15 bg-canvas/40 px-3.5 py-2 font-mono text-xs font-bold tabular-nums focus:border-track focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-ink/45 mb-1 pl-1">
                          Метка
                        </label>
                        <input
                          type="text"
                          value={badgeDrafts[p.id] ?? ""}
                          onChange={(e) =>
                            setBadgeDrafts((d) => ({
                              ...d,
                              [p.id]: e.target.value,
                            }))
                          }
                          className="w-full rounded-full border border-ink/15 bg-canvas/40 px-3.5 py-2 text-xs focus:border-track focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => saveProduct(p)}
                        className="flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-ink px-4 text-xs font-bold text-white active:bg-track transition-colors"
                      >
                        <Save className="h-3.5 w-3.5" />
                        Сохранить
                      </button>
                      {isCustom ? (
                        <button
                          type="button"
                          onClick={() => deleteCustom(p.id)}
                          aria-label="Удалить"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => resetProduct(p.id)}
                          aria-label="Сбросить к исходным"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink/60"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              </div>

              {filteredProducts.length > mobileLimit && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setMobileLimit((v) => v + 20)}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-5 text-xs font-extrabold text-white shadow-sm"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-track" />
                    Показать ещё {Math.min(20, filteredProducts.length - mobileLimit)}
                  </button>
                  {filteredProducts.length - mobileLimit > 20 && (
                    <button
                      type="button"
                      onClick={() => setMobileLimit(filteredProducts.length)}
                      className="inline-flex h-10 items-center rounded-full border border-ink/15 bg-white px-4 text-xs font-bold text-ink"
                    >
                      Все ({filteredProducts.length})
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Таблица позиций в округлом острове с внутренним скроллом и закреплённой шапкой (Desktop >= md) */}
            <div className="hidden md:block overflow-hidden rounded-[28px] bg-white ring-1 ring-ink/[0.08] shadow-sm">
              <div className="max-h-[70vh] overflow-auto overscroll-contain custom-scrollbar">
                <table className="w-full min-w-[820px] text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-10 border-b border-ink/10 bg-canvas text-[11px] font-extrabold uppercase tracking-wider text-ink/55 shadow-[0_1px_0_rgba(11,15,20,0.08)]">
                    <tr>
                      <th className="sticky left-0 z-20 bg-canvas px-5 py-3.5">Код</th>
                      <th className="px-4 py-3.5">Позиция</th>
                      <th className="px-4 py-3.5">Цена, ₸ (0 = КП)</th>
                      <th className="px-4 py-3.5">Метка</th>
                      <th className="px-4 py-3.5">Видимость</th>
                      <th className="px-5 py-3.5 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/[0.07]">
                    {filteredProducts.map((p) => {
                      const isHidden = hiddenIds.includes(p.id);
                      const isCustom = customIds.includes(p.id);
                      return (
                        <tr
                          key={p.id}
                          className={`group transition-colors hover:bg-canvas/50 ${
                            isHidden ? "bg-canvas/70 opacity-60" : ""
                          }`}
                        >
                          <td className="sticky left-0 z-[5] bg-white group-hover:bg-canvas/50 px-5 py-3.5 font-mono font-bold text-ink whitespace-nowrap transition-colors">
                            {p.sku}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-ink line-clamp-1">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-ink/50">
                              {p.subcategoryLabel} • ед.: {p.unit} • сейчас:{" "}
                              <strong className="text-ink/80">
                                {hasPrice(p.price) ? formatPrice(p.price) : "По запросу"}
                              </strong>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <input
                              type="number"
                              min={0}
                              value={priceDrafts[p.id] ?? "0"}
                              onChange={(e) =>
                                setPriceDrafts((d) => ({
                                  ...d,
                                  [p.id]: e.target.value,
                                }))
                              }
                              className="w-32 rounded-full border border-ink/15 bg-canvas/40 px-3.5 py-1.5 font-mono text-xs font-bold tabular-nums focus:border-track focus:bg-white focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-3.5">
                            <input
                              type="text"
                              value={badgeDrafts[p.id] ?? ""}
                              onChange={(e) =>
                                setBadgeDrafts((d) => ({
                                  ...d,
                                  [p.id]: e.target.value,
                                }))
                              }
                              className="w-44 rounded-full border border-ink/15 bg-canvas/40 px-3.5 py-1.5 text-xs focus:border-track focus:bg-white focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-3.5">
                            <button
                              type="button"
                              onClick={() => saveProduct(p, { hidden: !isHidden })}
                              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1 text-[11px] font-semibold hover:bg-canvas transition-colors"
                            >
                              {isHidden ? (
                                <>
                                  <EyeOff className="h-3 w-3 text-ink/50" /> Скрыт
                                </>
                              ) : (
                                <>
                                  <Eye className="h-3 w-3 text-emerald-600" /> Виден
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-1.5">
                            <button
                              type="button"
                              onClick={() => saveProduct(p)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-track transition-colors"
                            >
                              <Save className="h-3 w-3" />
                              Сохранить
                            </button>
                            {isCustom ? (
                              <button
                                type="button"
                                onClick={() => deleteCustom(p.id)}
                                title="Удалить"
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50 align-middle"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => resetProduct(p.id)}
                                title="Сбросить к исходным"
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-ink/15 text-ink/60 hover:text-ink hover:bg-canvas align-middle"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ВХОДЯЩИЕ ЗАЯВКИ КП */}
        {tab === "leads" && (
          <div
            className={`space-y-3.5 ${
              leads.length > 4
                ? "md:max-h-[74vh] md:overflow-y-auto md:overscroll-contain custom-scrollbar md:pr-1.5"
                : ""
            }`}
          >
            {leads.length === 0 ? (
              <div className="rounded-[28px] bg-white p-14 text-center ring-1 ring-ink/[0.08] shadow-sm">
                <p className="text-sm font-extrabold text-ink">
                  Входящих заявок пока нет
                </p>
                <p className="mt-1.5 text-xs text-ink/55">
                  Все запросы КП с сайта и из списка позиций автоматически
                  появятся здесь.
                </p>
              </div>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.ticketId}
                  className="rounded-[28px] bg-white p-5 sm:p-6 ring-1 ring-ink/[0.08] shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-canvas px-3 py-1 font-mono text-xs font-extrabold text-ink">
                        {lead.ticketId}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                          STATUS_LABELS[lead.status]?.badge || "bg-canvas text-ink"
                        }`}
                      >
                        {STATUS_LABELS[lead.status]?.label || lead.status}
                      </span>
                      <span className="text-[11px] text-ink/50">
                        {new Date(lead.createdAt).toLocaleString("ru-RU")} •{" "}
                        {lead.source}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateLeadStatus(
                            lead.ticketId,
                            e.target.value as LeadStatus
                          )
                        }
                        className="rounded-full border border-ink/15 bg-canvas/60 px-3.5 py-1.5 text-xs font-semibold focus:border-track focus:outline-none"
                      >
                        {Object.entries(STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeLead(lead.ticketId)}
                        aria-label="Удалить заявку"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-ink/80">
                    <strong>{lead.name}</strong> • {lead.phone}
                    {lead.city ? ` • ${lead.city}` : ""}
                    {lead.email ? ` • ${lead.email}` : ""}
                    {lead.company ? ` • ${lead.company}` : ""}
                  </div>

                  {lead.contextSummary && (
                    <div className="rounded-2xl bg-canvas p-3.5 text-xs text-ink/75">
                      {lead.contextSummary}
                    </div>
                  )}

                  {lead.message && (
                    <p className="text-xs text-ink/70">{lead.message}</p>
                  )}

                  {lead.attachment && (
                    <div>
                      <a
                        href={`/api/admin/leads/file?name=${encodeURIComponent(
                          lead.attachment.storedName
                        )}`}
                        className="inline-flex items-center gap-2 rounded-full bg-track/10 px-3.5 py-1.5 text-xs font-bold text-track hover:bg-track hover:text-white transition-colors"
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        <span>{lead.attachment.fileName}</span>
                        <span className="opacity-70">
                          ({Math.max(1, Math.round(lead.attachment.size / 1024))} КБ)
                        </span>
                      </a>
                    </div>
                  )}

                  {lead.items && lead.items.length > 0 && (
                    <ul className="space-y-1.5 border-t border-ink/[0.08] pt-2.5 text-xs text-ink/75">
                      {lead.items.map((it, idx) => (
                        <li key={idx}>
                          • <span className="font-mono font-bold">{it.sku}</span>{" "}
                          — {it.name}
                          {it.optionsNote ? (
                            <span className="text-ink/60">
                              {" "}
                              [{it.optionsNote}]
                            </span>
                          ) : null}
                          :{" "}
                          <strong>
                            {it.qty} {it.unit}
                          </strong>{" "}
                          (
                          {hasPrice(it.unitPrice)
                            ? formatPrice(it.unitPrice)
                            : "По запросу"}
                          )
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* НАСТРОЙКИ, КОНТАКТЫ И БАННЕР */}
        {tab === "settings" && (
          <form
            onSubmit={saveSettings}
            className="mx-auto max-w-3xl rounded-[28px] bg-white p-6 sm:p-8 ring-1 ring-ink/[0.08] shadow-sm space-y-6"
          >
            <div>
              <h2 className="text-base font-extrabold text-ink">
                Контактные данные и реквизиты
              </h2>
              <p className="mt-1 text-xs text-ink/55">
                По умолчанию поля пустые — на сайте отображаются только те
                контакты и реквизиты, которые вы заполните здесь.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-ink/75 mb-1.5 pl-1">
                  Телефон
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                  placeholder="Не указан"
                  className="w-full rounded-full border border-ink/15 bg-canvas/40 px-4 py-2.5 text-sm focus:border-track focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/75 mb-1.5 pl-1">
                  Номер WhatsApp (цифры, с 7...)
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsappNumber: e.target.value })
                  }
                  placeholder="Не указан"
                  className="w-full rounded-full border border-ink/15 bg-canvas/40 px-4 py-2.5 text-sm font-mono focus:border-track focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/75 mb-1.5 pl-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  placeholder="Не указан"
                  className="w-full rounded-full border border-ink/15 bg-canvas/40 px-4 py-2.5 text-sm focus:border-track focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/75 mb-1.5 pl-1">
                  График работы
                </label>
                <input
                  type="text"
                  value={settings.workingHours}
                  onChange={(e) =>
                    setSettings({ ...settings, workingHours: e.target.value })
                  }
                  placeholder="Не указан"
                  className="w-full rounded-full border border-ink/15 bg-canvas/40 px-4 py-2.5 text-sm focus:border-track focus:bg-white focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ink/75 mb-1.5 pl-1">
                  Адрес
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                  placeholder="Не указан"
                  className="w-full rounded-full border border-ink/15 bg-canvas/40 px-4 py-2.5 text-sm focus:border-track focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/75 mb-1.5 pl-1">
                  БИН
                </label>
                <input
                  type="text"
                  value={settings.bin}
                  onChange={(e) =>
                    setSettings({ ...settings, bin: e.target.value })
                  }
                  placeholder="Не указан"
                  className="w-full rounded-full border border-ink/15 bg-canvas/40 px-4 py-2.5 text-sm font-mono focus:border-track focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/75 mb-1.5 pl-1">
                  ИИК / Банк
                </label>
                <input
                  type="text"
                  value={settings.iik}
                  onChange={(e) =>
                    setSettings({ ...settings, iik: e.target.value })
                  }
                  placeholder="Не указан"
                  className="w-full rounded-full border border-ink/15 bg-canvas/40 px-4 py-2.5 text-sm font-mono focus:border-track focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-ink/10 pt-5 space-y-3">
              <label className="inline-flex items-center gap-2.5 text-xs font-bold text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.promoBannerActive}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      promoBannerActive: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded accent-[#D94423]"
                />
                Показывать информационную мини-капсулу над островом шапки
              </label>
              <input
                type="text"
                value={settings.promoBannerText}
                onChange={(e) =>
                  setSettings({ ...settings, promoBannerText: e.target.value })
                }
                placeholder="Текст мини-капсулы"
                className="w-full rounded-full border border-ink/15 bg-canvas/40 px-4 py-2.5 text-sm focus:border-track focus:bg-white focus:outline-none"
              />
            </div>

            <div className="border-t border-ink/10 pt-5">
              <label className="block text-xs font-semibold text-ink/75 mb-1.5 pl-1">
                Сменить пароль администратора (минимум 6 символов)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Оставьте пустым, чтобы не менять"
                className="w-full max-w-sm rounded-full border border-ink/15 bg-canvas/40 px-4 py-2.5 text-sm focus:border-track focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-track px-6 text-xs font-extrabold text-white shadow-[0_6px_20px_rgba(217,68,35,0.32)] hover:bg-[#e54d2b] transition-all"
            >
              <Save className="h-4 w-4" />
              Сохранить настройки
            </button>
          </form>
        )}
      </div>

      {/* Нижний парящий округлый остров навигации для мобильной версии /admin */}
      {/* Парящая округлая кнопка «Наверх» */}
      {showBackTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Прокрутить наверх"
          title="Наверх"
          className="fixed bottom-24 right-3.5 md:bottom-5 md:right-5 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[#0B0F14]/90 text-white shadow-[0_12px_30px_-6px_rgba(11,15,20,0.5)] ring-1 ring-white/[0.18] backdrop-blur-xl transition-all hover:bg-track active:scale-95"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}

      {/* Мобильный нижний округлый остров навигации панели (<= md) */}
      <nav
        aria-label="Мобильная навигация панели управления"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
        }}
        className="fixed inset-x-0 bottom-0 z-40 md:hidden pointer-events-none px-3 pt-2 no-print"
      >
        <div className="pointer-events-auto mx-auto grid max-w-md grid-cols-4 items-center gap-1 rounded-full bg-[#0B0F14]/[0.94] p-1.5 text-white shadow-[0_18px_48px_-10px_rgba(11,15,20,0.65),0_4px_16px_rgba(11,15,20,0.25)] ring-1 ring-white/[0.16] backdrop-blur-2xl">
          <button
            type="button"
            onClick={() => setTab("products")}
            className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-full px-1 py-1.5 transition-all active:scale-95 ${
              tab === "products"
                ? "bg-white text-ink shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Package className="h-[18px] w-[18px]" strokeWidth={2.2} />
            <span className="text-[10px] font-bold leading-none tabular-nums">
              Каталог ({products.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab("leads")}
            className={`relative flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-full px-1 py-1.5 transition-all active:scale-95 ${
              tab === "leads"
                ? "bg-white text-ink shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            <div className="relative">
              <Inbox className="h-[18px] w-[18px]" strokeWidth={2.2} />
              {newLeadsCount > 0 && (
                <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-track px-1 text-[9px] font-extrabold text-white ring-2 ring-[#0B0F14]">
                  {newLeadsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold leading-none tabular-nums">
              Заявки ({leads.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab("settings")}
            className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-full px-1 py-1.5 transition-all active:scale-95 ${
              tab === "settings"
                ? "bg-white text-ink shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Settings className="h-[18px] w-[18px]" strokeWidth={2.2} />
            <span className="text-[10px] font-bold leading-none">
              Контакты
            </span>
          </button>

          <Link
            href="/"
            className="flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-full bg-white/[0.07] px-1 py-1.5 text-white/85 hover:text-white transition-all active:scale-95"
          >
            <ArrowUpRight className="h-[18px] w-[18px] text-track" strokeWidth={2.3} />
            <span className="text-[10px] font-bold leading-none">
              Витрина
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
