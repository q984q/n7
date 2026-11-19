import React from "react";

interface BrandLogoProps {
  theme?: "dark" | "light";
  compact?: boolean;
  pill?: boolean;
}

export function BrandLogo({
  theme = "light",
  compact = false,
  pill = false,
}: BrandLogoProps) {
  const isDark = theme === "dark";
  return (
    <span className="inline-flex items-center gap-2.5 select-none group">
      <span
        className={`relative flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.04] ${
          pill ? "h-9 w-9 rounded-full" : "h-10 w-10 rounded-xl"
        } ${
          isDark
            ? "bg-white/[0.12] ring-1 ring-white/20"
            : "bg-ink ring-1 ring-ink/10"
        }`}
      >
        <svg
          viewBox="0 0 44 44"
          className={pill ? "h-5 w-5" : "h-7 w-7"}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 33V11H11.4L20.1 25.1V11H25V33H19.7L10.9 18.8V33H6Z"
            fill="#FFFFFF"
          />
          <path
            d="M27.5 11H38.8L31.7 33H26.3L32.8 15.4H27.5V11Z"
            fill="#D94423"
          />
          <rect
            x="6"
            y="36"
            width="32"
            height="2.2"
            rx="1.1"
            fill="#D94423"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`${
            pill ? "text-[13.5px]" : "text-[15px]"
          } font-extrabold tracking-[0.06em] whitespace-nowrap ${
            isDark ? "text-white" : "text-ink"
          }`}
        >
          N7 <span className="text-track">CONSTRUCTION</span>
        </span>
        {!compact && (
          <span
            className={`mt-1 text-[10px] font-medium uppercase tracking-[0.14em] ${
              isDark ? "text-white/55" : "text-ink/55"
            }`}
          >
            Покрытия • Падел • Свет
          </span>
        )}
      </span>
    </span>
  );
}
