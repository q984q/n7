"use client";
import { OfflineQuote } from "@/components/OfflineQuote";

import React, { useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Paperclip, X } from "lucide-react";

interface LeadCaptureSectionProps {
  title?: string;
  subtitle?: string;
  source?: string;
}

export function LeadCaptureSection({
  title = "Рассчитаем под ваш объект",
  subtitle = "Укажите размеры, выберите направление или прикрепите готовый план / ТЗ — подготовим КП с доставкой по Казахстану.",
  source = "Форма на странице",
}: LeadCaptureSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [direction, setDirection] = useState("Спортивные покрытия");
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
      const form = new FormData();
      form.append("name", name);
      form.append("phone", phone);
      form.append("city", city || "Казахстан");
      form.append("type", direction);
      form.append("message", message);
      form.append("source", source);
      if (file) form.append("file", file);

      const res = await fetch("/api/lead", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Укажите имя и телефон");
      } else {
        setTicketId(data.ticketId);
        setName("");
        setPhone("");
        setCity("");
        setMessage("");
        setFile(null);
      }
    } catch {
      setError("Ошибка отправки. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="project" className="scroll-mt-24 py-12 sm:py-20 bg-canvas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] bg-ink p-6 sm:p-10 lg:p-12 text-white shadow-elevated">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/85">
                <span className="h-1.5 w-1.5 rounded-full bg-track" />
                Расчёт КП · Казахстан
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold leading-[1.1] tracking-[-0.025em]">
                {title}
              </h2>
              <p className="text-sm leading-relaxed text-white/65 max-w-md">
                {process.env.NEXT_PUBLIC_STATIC_SITE === "1" ? "Соберите параметры объекта и сохраните текст для запроса цены, доставки и монтажа." : subtitle}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  "Договор и счёт",
                  "Образцы по запросу",
                  "Монтаж по запросу",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/[0.07] px-3 py-1 text-[11px] font-semibold text-white/75 ring-1 ring-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-[26px] bg-white p-5 sm:p-7 text-ink">
                {ticketId ? (
                  <div className="py-8 text-center space-y-3">
                    <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                    <h3 className="text-lg font-extrabold text-ink">
                      Заявка {ticketId} принята
                    </h3>
                    <p className="text-xs text-ink/55">
                      Свяжемся с вами для уточнения деталей и расчёта КП.
                    </p>
                    <button
                      type="button"
                      onClick={() => setTicketId("")}
                      className="inline-flex rounded-full bg-canvas px-5 py-2 text-xs font-bold text-ink hover:bg-ink/10 transition-colors"
                    >
                      Новый запрос
                    </button>
                  </div>
                ) : (
                  process.env.NEXT_PUBLIC_STATIC_SITE === "1" ? <OfflineQuote /> : (<form onSubmit={handleSubmit} className="space-y-3">
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
                      <select
                        aria-label="Что нужно"
                        value={direction}
                        onChange={(e) => setDirection(e.target.value)}
                        className="h-12 w-full rounded-2xl bg-canvas px-4 text-sm font-semibold text-ink focus:bg-white focus:ring-2 focus:ring-track focus:outline-none transition-all"
                      >
                        <option value="Спортивные покрытия">
                          Спортивные покрытия
                        </option>
                        <option value="Образцы покрытий">
                          Запросить образцы покрытий
                        </option>
                        <option value="Падел-корты PD001–PD008">
                          Падел-корты 20 × 10 м
                        </option>
                        <option value="LED-прожекторы N7">
                          LED-прожекторы N7 (100–1250 Вт)
                        </option>
                        <option value="Комплексная поставка">
                          Комплексная поставка (+ монтаж)
                        </option>
                      </select>

                      <input
                        type="text"
                        aria-label="Город поставки"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Город доставки (РК)"
                        className="h-12 w-full rounded-2xl bg-canvas px-4 text-sm font-medium text-ink placeholder:text-ink/45 focus:bg-white focus:ring-2 focus:ring-track focus:outline-none transition-all"
                      />
                    </div>

                    <textarea
                      rows={2}
                      aria-label="Комментарий"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Размеры зала, модель, цвет или нужный монтаж"
                      className="w-full rounded-2xl bg-canvas px-4 py-3 text-sm font-medium text-ink placeholder:text-ink/45 focus:bg-white focus:ring-2 focus:ring-track focus:outline-none transition-all resize-none"
                    />

                    {/* Прикрепление плана / сметы / ТЗ */}
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
                          Прикрепить план, смету или ТЗ (до 8 МБ)
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
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-track text-xs font-extrabold uppercase tracking-wider text-white hover:bg-[#e54d2b] active:scale-[0.99] transition-all disabled:opacity-60"
                    >
                      {submitting ? "Отправка..." : "Получить расчёт"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
