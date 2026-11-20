"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScrollRailProps {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
  /** Цвет боковых градиентов-подсказок */
  fadeColor?: "white" | "canvas" | "dark" | "none";
  /** Показывать округлые кнопки прокрутки влево/вправо */
  showArrows?: boolean;
  /** Всегда показывать стрелки и на мобильных (для каруселей карточек) */
  arrowsOnMobile?: boolean;
  /** Показывать полоску прогресса горизонтального скролла */
  showProgress?: boolean;
  /** Включить привязку карточек (scroll-snap) */
  snap?: boolean;
  /** Шаг прокрутки по кнопке в долях ширины контейнера */
  stepRatio?: number;
  ariaLabel?: string;
}

const FADE_LEFT: Record<Exclude<ScrollRailProps["fadeColor"], undefined | "none">, string> = {
  white: "from-white via-white/85 to-transparent",
  canvas: "from-canvas via-canvas/85 to-transparent",
  dark: "from-[#0B0F14] via-[#0B0F14]/85 to-transparent",
};

const FADE_RIGHT: Record<Exclude<ScrollRailProps["fadeColor"], undefined | "none">, string> = {
  white: "from-white via-white/85 to-transparent",
  canvas: "from-canvas via-canvas/85 to-transparent",
  dark: "from-[#0B0F14] via-[#0B0F14]/85 to-transparent",
};

/**
 * Универсальная горизонтальная лента прокрутки:
 * - плавный тач-свайп + scroll-snap для карточек;
 * - градиентные индикаторы по краям, когда есть продолжение;
 * - опциональные округлые кнопки «← / →» и индикатор прогресса;
 * - автопрокрутка к активному элементу ([data-active="true"] или [aria-current="page"]).
 */
export function ScrollRail({
  children,
  className = "",
  trackClassName = "flex items-center gap-1.5",
  fadeColor = "white",
  showArrows = true,
  arrowsOnMobile = false,
  showProgress = false,
  snap = false,
  stepRatio = 0.72,
  ariaLabel,
}: ScrollRailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(35);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const overflow = maxScroll > 4;
    setHasOverflow(overflow);
    setCanLeft(overflow && el.scrollLeft > 4);
    setCanRight(overflow && el.scrollLeft < maxScroll - 4);
    if (overflow) {
      const ratio = Math.min(1, Math.max(0, el.scrollLeft / maxScroll));
      const tw = Math.max(18, Math.min(80, (el.clientWidth / el.scrollWidth) * 100));
      setThumbWidth(tw);
      setProgress(ratio * (100 - tw));
    } else {
      setProgress(0);
      setThumbWidth(100);
    }
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, [measure, children]);

  // Мягко докручиваем активную капсулу в зону видимости
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const active = el.querySelector<HTMLElement>(
      '[data-active="true"], [aria-current="page"]'
    );
    if (!active) return;
    const elRect = el.getBoundingClientRect();
    const aRect = active.getBoundingClientRect();
    if (aRect.left < elRect.left + 12 || aRect.right > elRect.right - 12) {
      const target =
        active.offsetLeft - el.clientWidth / 2 + active.clientWidth / 2;
      el.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    }
  }, [children]);

  const scrollByStep = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    const delta = Math.max(180, Math.round(el.clientWidth * stepRatio)) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const arrowVisibility = arrowsOnMobile ? "inline-flex" : "hidden sm:inline-flex";
  const isDark = fadeColor === "dark";

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div
          ref={ref}
          aria-label={ariaLabel}
          className={`max-w-full overflow-x-auto overscroll-x-contain scroll-smooth no-scrollbar ${
            snap ? "snap-x snap-mandatory" : ""
          } ${trackClassName}`}
        >
          {children}
        </div>

        {/* Левый градиент */}
        {fadeColor !== "none" && canLeft && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r ${FADE_LEFT[fadeColor]}`}
          />
        )}

        {/* Правый градиент */}
        {fadeColor !== "none" && canRight && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l ${FADE_RIGHT[fadeColor]}`}
          />
        )}

        {/* Кнопка влево */}
        {showArrows && canLeft && (
          <button
            type="button"
            onClick={() => scrollByStep(-1)}
            aria-label="Прокрутить влево"
            className={`${arrowVisibility} absolute left-1 top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center rounded-full shadow-md ring-1 transition-all active:scale-95 ${
              isDark
                ? "bg-[#0B0F14]/95 text-white ring-white/20 hover:bg-track"
                : "bg-white/95 text-ink ring-ink/[0.12] hover:bg-ink hover:text-white"
            }`}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Кнопка вправо */}
        {showArrows && canRight && (
          <button
            type="button"
            onClick={() => scrollByStep(1)}
            aria-label="Прокрутить вправо"
            className={`${arrowVisibility} absolute right-1 top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center rounded-full shadow-md ring-1 transition-all active:scale-95 ${
              isDark
                ? "bg-[#0B0F14]/95 text-white ring-white/20 hover:bg-track"
                : "bg-white/95 text-ink ring-ink/[0.12] hover:bg-ink hover:text-white"
            }`}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Индикатор прогресса прокрутки для каруселей */}
      {showProgress && hasOverflow && (
        <div className="mt-3.5 flex items-center justify-between gap-3">
          <div
            aria-hidden="true"
            className={`relative h-1.5 flex-1 max-w-[160px] overflow-hidden rounded-full ${
              isDark ? "bg-white/15" : "bg-ink/10"
            }`}
          >
            <div
              style={{
                width: `${thumbWidth}%`,
                left: `${progress}%`,
              }}
              className="absolute inset-y-0 rounded-full bg-track transition-[left,width] duration-150"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollByStep(-1)}
              disabled={!canLeft}
              aria-label="Предыдущие карточки"
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 transition-all active:scale-95 disabled:opacity-35 ${
                isDark
                  ? "bg-white/10 text-white ring-white/15 hover:bg-white/20"
                  : "bg-white text-ink ring-ink/[0.12] hover:bg-ink hover:text-white"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByStep(1)}
              disabled={!canRight}
              aria-label="Следующие карточки"
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 transition-all active:scale-95 disabled:opacity-35 ${
                isDark
                  ? "bg-white/10 text-white ring-white/15 hover:bg-white/20"
                  : "bg-white text-ink ring-ink/[0.12] hover:bg-ink hover:text-white"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
