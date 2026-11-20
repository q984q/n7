"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { FAQ_ITEMS, WORK_STEPS } from "@/data/product-ui";

export function HowWeWorkSection() {
  return (
    <section className="py-16 sm:py-24 bg-canvas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.025em] text-ink">
            Как мы работаем
          </h2>
          <span className="text-xs font-semibold text-ink/50">
            Поставки во все регионы Казахстана · монтаж по запросу
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WORK_STEPS.map((step) => (
            <div
              key={step.num}
              className="flex flex-col justify-between rounded-[26px] bg-white p-6 ring-1 ring-ink/[0.07] shadow-card"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-track/10 font-mono text-xs font-extrabold text-track">
                {step.num}
              </span>
              <div className="mt-5">
                <h3 className="text-base font-extrabold tracking-[-0.01em] text-ink">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/60">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ white = true }: { white?: boolean }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className={`py-16 sm:py-20 ${white ? "bg-white" : "bg-canvas"}`}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl sm:text-4xl font-extrabold tracking-[-0.025em] text-ink">
          Частые вопросы
        </h2>

        <div className="space-y-2.5">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.q}
                className={`rounded-[22px] ring-1 ring-ink/[0.07] transition-colors ${
                  white ? "bg-canvas" : "bg-white"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-bold text-ink">{item.q}</span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                      isOpen
                        ? "rotate-45 bg-ink text-white"
                        : "bg-white text-ink/60 ring-1 ring-ink/10"
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm leading-relaxed text-ink/65">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
