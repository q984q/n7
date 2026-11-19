"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Paperclip,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatPrice, hasPrice } from "@/lib/format";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function CartPage() {
  const { cart, grandTotal, updateQty, removeFromCart, clearCart } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [needInstall, setNeedInstall] = useState(false);
  const [needSamples, setNeedSamples] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const items = cart.map((c) => ({
        sku: c.product.sku,
        name: c.product.shortName,
        qty: c.qty,
        unit: c.product.unit,
        unitPrice: c.unitPrice,
        ...(c.optionsNote ? { optionsNote: c.optionsNote } : {}),
      }));

      const extras = [
        needInstall ? "Нужен расчёт монтажа / шеф-монтажа" : "",
        needSamples ? "Нужны образцы покрытий" : "",
      ]
        .filter(Boolean)
        .join(" · ");

      const form = new FormData();
      form.append("name", name);
      form.append("phone", phone);
      form.append("city", city || "Казахстан");
      form.append("email", email);
      form.append("message", [extras, message].filter(Boolean).join(". "));
      form.append("type", "Спецификация из каталога");
      form.append("source", "Список КП (/cart)");
      form.append("items", JSON.stringify(items));
      form.append("totalKzt", String(grandTotal));
      if (file) form.append("file", file);

      const res = await fetch("/api/lead", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Проверьте имя и телефон");
      } else {
        setTicketId(data.ticketId);
        setFile(null);
        clearCart();
      }
    } catch {
      setError("Ошибка отправки. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Список КП", path: "/cart" }]} />

        <h1 className="mb-8 text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-ink">
          Список для КП
        </h1>

        {ticketId ? (
          <div className="rounded-[28px] bg-white p-12 text-center ring-1 ring-ink/[0.08] shadow-card space-y-4 max-w-xl mx-auto">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
            <h2 className="text-xl font-extrabold text-ink">
              Заявка {ticketId} принята
            </h2>
            <p className="text-sm text-ink/60">
              Подготовим коммерческое предложение по выбранному списку и свяжемся
              с вами.
            </p>
            <Link
              href="/catalog"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-xs font-bold text-white"
            >
              В каталог
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : cart.length === 0 ? (
          <div className="rounded-[28px] bg-white p-14 text-center ring-1 ring-ink/[0.08] space-y-4">
            <h2 className="text-lg font-extrabold text-ink">Список пуст</h2>
            <p className="text-xs text-ink/55 max-w-sm mx-auto">
              Добавьте покрытия, падел-корты или прожекторы N7 из каталога,
              чтобы получить единый расчёт КП.
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
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            <div
              className={`lg:col-span-7 space-y-3 ${
                cart.length > 5
                  ? "lg:max-h-[72vh] lg:overflow-y-auto lg:overscroll-contain custom-scrollbar lg:pr-1.5"
                  : ""
              }`}
            >
              {cart.map((item) => (
                <div
                  key={item.lineKey}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-[24px] bg-white p-4 ring-1 ring-ink/[0.08]"
                >
                  <div
                    className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl ${
                      item.product.category === "lighting"
                        ? "bg-white ring-1 ring-ink/[0.08]"
                        : "bg-canvas"
                    }`}
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.shortName}
                      fill
                      sizes="96px"
                      className={
                        item.product.category === "lighting"
                          ? "object-contain p-2"
                          : "object-cover"
                      }
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[11px] text-ink/45">
                      {item.product.sku}
                    </div>
                    <Link
                      href={`/catalog/${item.product.slug}`}
                      className="text-sm font-extrabold text-ink hover:text-track"
                    >
                      {item.product.shortName}
                    </Link>
                    {item.optionsNote && (
                      <div className="mt-1 inline-flex flex-wrap rounded-xl bg-canvas px-2.5 py-1 text-[11px] font-semibold text-ink/75">
                        {item.optionsNote}
                      </div>
                    )}
                    <div className="mt-1 text-xs font-bold text-ink/70 tabular-nums">
                      {hasPrice(item.lineTotal)
                        ? formatPrice(item.lineTotal)
                        : "По запросу"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="inline-flex items-center rounded-full bg-canvas p-0.5 ring-1 ring-ink/10">
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(
                            item.lineKey,
                            Math.max(1, item.qty - item.product.stepQty)
                          )
                        }
                        aria-label="Уменьшить"
                        className="px-2.5 py-1.5 text-ink/70 hover:text-ink"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-2 text-xs font-extrabold text-ink tabular-nums">
                        {item.qty} {item.product.unit}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(item.lineKey, item.qty + item.product.stepQty)
                        }
                        aria-label="Увеличить"
                        className="px-2.5 py-1.5 text-ink/70 hover:text-ink"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.lineKey)}
                      aria-label="Удалить"
                      className="text-ink/40 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="lg:col-span-5 lg:sticky lg:top-24 rounded-[28px] bg-white p-6 ring-1 ring-ink/[0.08] shadow-card space-y-3.5"
            >
              <div className="flex items-center justify-between border-b border-ink/[0.08] pb-3.5">
                <span className="text-xs font-bold text-ink/55">
                  Итого ({cart.length} поз.):
                </span>
                <span className="text-lg font-extrabold text-ink tabular-nums">
                  {hasPrice(grandTotal) ? formatPrice(grandTotal) : "По запросу"}
                </span>
              </div>

              <input
                type="text"
                required
                aria-label="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя *"
                className="h-12 w-full rounded-2xl bg-canvas px-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-track focus:outline-none"
              />
              <input
                type="tel"
                required
                aria-label="Телефон или WhatsApp"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Телефон / WhatsApp *"
                className="h-12 w-full rounded-2xl bg-canvas px-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-track focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  type="text"
                  aria-label="Город доставки"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Город (РК)"
                  className="h-11 w-full rounded-2xl bg-canvas px-3.5 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-track focus:outline-none"
                />
                <input
                  type="email"
                  aria-label="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail для КП"
                  className="h-11 w-full rounded-2xl bg-canvas px-3.5 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-track focus:outline-none"
                />
              </div>

              {/* Понятные B2B-опции в один клик */}
              <div className="flex flex-wrap gap-2 pt-0.5">
                <label className="inline-flex items-center gap-2 rounded-full bg-canvas px-3 py-1.5 text-xs font-semibold text-ink/75 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needInstall}
                    onChange={(e) => setNeedInstall(e.target.checked)}
                    className="h-3.5 w-3.5 accent-track"
                  />
                  Монтаж по запросу
                </label>
                <label className="inline-flex items-center gap-2 rounded-full bg-canvas px-3 py-1.5 text-xs font-semibold text-ink/75 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needSamples}
                    onChange={(e) => setNeedSamples(e.target.checked)}
                    className="h-3.5 w-3.5 accent-track"
                  />
                  Нужны образцы
                </label>
              </div>

              <textarea
                rows={2}
                aria-label="Комментарий"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Реквизиты, сроки или комментарий"
                className="w-full rounded-2xl bg-canvas px-4 py-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-track focus:outline-none resize-none"
              />

              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.xls,.xlsx,.csv,.doc,.docx,.dwg,.dxf,.txt,.zip"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                {file ? (
                  <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-canvas px-3.5 py-2 text-xs font-semibold text-ink">
                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-track" />
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      aria-label="Удалить файл"
                      className="text-ink/45 hover:text-red-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3.5 py-2 text-xs font-semibold text-ink/70 hover:text-ink transition-colors"
                  >
                    <Paperclip className="h-3.5 w-3.5 text-track" />
                    Прикрепить план / ТЗ / реквизиты
                  </button>
                )}
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-3.5 py-2 text-xs font-medium text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-track text-xs font-extrabold uppercase tracking-wider text-white hover:bg-[#e54d2b] disabled:opacity-60 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                {submitting ? "Отправка..." : "Отправить запрос КП"}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
