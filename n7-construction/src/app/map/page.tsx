import React from "react";
import Link from "next/link";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { SUBCATEGORIES } from "@/data/subcategories";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "Карта сайта | N7 CONSTRUCTION",
  description:
    "Полная структура сайта N7 CONSTRUCTION: разделы, 11 товарных групп и все модели покрытий, падел-кортов и светодиодных прожекторов N7.",
  path: "/map",
});

export default function HtmlSitemapPage() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <Breadcrumbs items={[{ name: "Карта сайта", path: "/map" }]} />

        <div>
          <h1 className="text-3xl font-extrabold text-ink">Карта сайта</h1>
          <p className="mt-2 text-sm text-ink/60">
            Все разделы каталога и карточки продукции N7 CONSTRUCTION.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-ink/10 bg-white p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-track mb-3">
              Основные страницы
            </h2>
            <ul className="space-y-2 text-xs font-semibold text-ink/80">
              <li><Link href="/" className="hover:text-track">Главная</Link></li>
              <li><Link href="/catalog" className="hover:text-track">Каталог продукции</Link></li>
              <li><Link href="/pricelist" className="hover:text-track">Сводная спецификация</Link></li>
              <li><Link href="/compare" className="hover:text-track">Сравнение моделей</Link></li>
              <li><Link href="/cart" className="hover:text-track">Список позиций для КП</Link></li>
              <li><Link href="/contacts" className="hover:text-track">Запрос коммерческого предложения</Link></li>
              <li><Link href="/privacy" className="hover:text-track">Конфиденциальность и данные</Link></li>
            </ul>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-track mb-3">
              Категории ({CATEGORIES.length})
            </h2>
            <ul className="space-y-2 text-xs font-semibold text-ink/80">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/catalog/category/${c.slug}`} className="hover:text-track">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-track mb-3">
              Подкатегории ({SUBCATEGORIES.length})
            </h2>
            <ul className="space-y-2 text-xs font-semibold text-ink/80">
              {SUBCATEGORIES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/catalog/sub/${s.slug}`} className="hover:text-track">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-track mb-4">
            Карточки серий ({PRODUCTS.length})
          </h2>
          <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            {PRODUCTS.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/catalog/${p.slug}`}
                  className="text-ink/80 hover:text-track font-medium"
                >
                  <span className="font-mono font-bold text-ink">{p.sku}</span> —{" "}
                  {p.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
