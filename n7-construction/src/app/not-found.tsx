import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-xl px-4 text-center space-y-5">
        <div className="font-mono text-5xl font-extrabold text-track">404</div>
        <h1 className="text-2xl font-extrabold text-ink">Страница не найдена</h1>
        <p className="text-sm text-ink/60">
          Запрошенный раздел отсутствует. Перейдите в каталог продукции N7
          CONSTRUCTION или на главную страницу.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/catalog"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-track px-5 text-xs font-bold text-white"
          >
            Открыть каталог
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-xl border border-ink/15 bg-white px-5 text-xs font-bold text-ink"
          >
            На главную
          </Link>
        </div>
      </div>
    </section>
  );
}
