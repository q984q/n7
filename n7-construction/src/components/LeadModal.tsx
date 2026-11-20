"use client";
import { OfflineQuote } from "@/components/OfflineQuote";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowUp,
  CheckCircle2,
  MessageCircle,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { getWhatsAppUrl } from "@/config/site";

export function LeadModal() {
  const { leadModal, closeLeadModal, liveSettings } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ticketId, setTicketId] = useState("");

  useEffect(() => {
    if (!leadModal.open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setError("");
        setTicketId("");
        closeLeadModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [leadModal.open, closeLeadModal]);

  if (!leadModal.open) return null;

  const handleClose = () => {
    setError("");
    setTicketId("");
    setFile(null);
    closeLeadModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("phone", phone);
      form.append("city", city || "Казахстан");
      form.append("email", email);
      form.append("message", message);
      form.append("type", "Запрос КП");
      form.append("source", leadModal.source || "Модальное окно");
      form.append("contextSummary", leadModal.contextSummary || "");
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
        setName("");
        setPhone("");
        setCity("");
        setEmail("");
        setMessage("");
        setFile(null);
      }
    } catch {
      setError("Не удалось отправить запрос. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  };

  const waUrl = getWhatsAppUrl(
    liveSettings.whatsappNumber,
    leadModal.contextSummary
      ? `Здравствуйте, N7 CONSTRUCTION! Запрос КП: ${leadModal.contextSummary}`
      : undefined
  );

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-3 sm:p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={leadModal.title || "Запрос КП"}
    >
      <div className="relative w-full max-w-lg rounded-[32px] bg-white p-6 sm:p-7 shadow-2xl ring-1 ring-ink/10 max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain custom-scrollbar">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Закрыть окно"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink/60 hover:text-ink transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {ticketId ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-ink">
              Заявка {ticketId} принята
            </h3>
            <p className="text-xs text-ink/55">
              Свяжемся с вами для уточнения деталей и расчёта КП.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-7 text-xs font-bold text-white"
            >
              Готово
            </button>
          </div>
        ) : (
          <>
            <div className="pr-8">
              <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-track">
                Запрос КП · Казахстан
              </span>
              <h3 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-[-0.02em] text-ink">
                {leadModal.title || "Получить расчёт"}
              </h3>
            </div>

            {leadModal.contextSummary && (
              <div className="mt-3.5 rounded-2xl bg-canvas px-4 py-2.5 text-xs font-semibold text-ink/80 leading-snug">
                {leadModal.contextSummary}
              </div>
            )}

            {process.env.NEXT_PUBLIC_STATIC_SITE === "1" ? <OfflineQuote context={leadModal.contextSummary || leadModal.title} /> : (<form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  aria-label="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Имя *"
                  className="h-12 w-full rounded-2xl bg-canvas px-4 text-sm font-medium text-ink placeholder:text-ink/45 focus:bg-white focus:ring-2 focus:ring-track focus:outline-none transition-all"
                />
                <input
                  type="tel"
                  required
                  aria-label="Телефон или WhatsApp"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Телефон / WhatsApp *"
                  className="h-12 w-full rounded-2xl bg-canvas px-4 text-sm font-medium text-ink placeholder:text-ink/45 focus:bg-white focus:ring-2 focus:ring-track focus:outline-none transition-all"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  aria-label="Город доставки"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Город доставки (РК)"
                  className="h-11 w-full rounded-2xl bg-canvas px-4 text-xs font-medium text-ink placeholder:text-ink/45 focus:bg-white focus:ring-2 focus:ring-track focus:outline-none transition-all"
                />
                <input
                  type="email"
                  aria-label="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail (необязательно)"
                  className="h-11 w-full rounded-2xl bg-canvas px-4 text-xs font-medium text-ink placeholder:text-ink/45 focus:bg-white focus:ring-2 focus:ring-track focus:outline-none transition-all"
                />
              </div>

              <textarea
                rows={2}
                aria-label="Комментарий"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Площадь, количество, образцы или монтаж"
                className="w-full rounded-2xl bg-canvas px-4 py-3 text-xs font-medium text-ink placeholder:text-ink/45 focus:bg-white focus:ring-2 focus:ring-track focus:outline-none transition-all resize-none"
              />

              {/* Прикрепление плана / ТЗ / сметы */}
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
                    Прикрепить план / смету / ТЗ
                  </button>
                )}
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="sm:flex-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-track px-5 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-[#e54d2b] disabled:opacity-60 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? "Отправка..." : "Получить расчёт"}
                </button>
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50 px-5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                )}
              </div>
            </form>)}
          </>
        )}
      </div>
    </div>
  );
}

export function GlobalWidgets() {
  const pathname = usePathname();
  const { toasts, liveSettings } = useStore();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        docHeight > 120 ? Math.min(1, Math.max(0, y / docHeight)) : 0
      );
      setShowBackTop(y > 420);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  const waUrl = getWhatsAppUrl(liveSettings.whatsappNumber);

  return (
    <>
      {scrollProgress > 0.02 && (
        <div
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-50 h-[2.5px] pointer-events-none bg-transparent print:hidden"
        >
          <div
            className="h-full bg-track shadow-[0_0_8px_rgba(217,68,35,0.55)] transition-[width] duration-75"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
      )}

      {toasts.length > 0 && (
        <div className="fixed bottom-24 lg:bottom-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-[calc(100vw-1.5rem)] max-w-md pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="pointer-events-auto inline-flex items-center justify-between gap-3 rounded-full bg-[#0B0F14]/95 pl-4 pr-2.5 py-2 text-xs font-medium text-white shadow-[0_16px_40px_-8px_rgba(11,15,20,0.55)] ring-1 ring-white/15 backdrop-blur-2xl"
            >
              <span className="truncate">{t.message}</span>
              {t.actionLabel && t.onAction && (
                <button
                  type="button"
                  onClick={t.onAction}
                  className="shrink-0 rounded-full bg-track px-3 py-1 text-[11px] font-extrabold text-white hover:bg-[#e54d2b] transition-colors"
                >
                  {t.actionLabel}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showBackTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Прокрутить наверх"
          title="Наверх"
          className={`fixed right-3.5 lg:right-5 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[#0B0F14]/90 text-white shadow-[0_12px_30px_-6px_rgba(11,15,20,0.5)] ring-1 ring-white/[0.18] backdrop-blur-xl transition-all hover:bg-track active:scale-95 print:hidden ${
            waUrl ? "bottom-[154px] lg:bottom-20" : "bottom-24 lg:bottom-5"
          }`}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}

      {waUrl && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в WhatsApp"
          className="fixed bottom-24 right-3.5 lg:bottom-5 lg:right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-700 transition-colors print:hidden"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
      )}
    </>
  );
}
