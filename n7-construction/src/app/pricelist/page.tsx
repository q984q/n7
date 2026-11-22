import React from "react";
import { PRODUCTS } from "@/data/products";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PricelistClient } from "@/components/PricelistClient";

export const metadata = buildMetadata({
  title: "Каталог для скачивания | N7 CONSTRUCTION",
  description:
    "Сводная таблица позиций N7 CONSTRUCTION: покрытия, падел-корты PD001–PD008 и прожекторы N7 TITAN, VEKTOR, KRON, KORT. Выгрузка CSV и запрос КП.",
  path: "/pricelist",
});

export default function PricelistPage() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Скачать каталог", path: "/pricelist" }]} />

        <div className="mb-7 flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-ink">
            Каталог для скачивания
          </h1>
          <span className="text-sm font-semibold text-ink/45 tabular-nums">
            {PRODUCTS.length} позиций · CSV
          </span>
        </div>

        <p className="mb-5 text-ink-muted">Скачайте артикулы и характеристики в CSV. Стоимость поставки рассчитывается по городу, количеству и комплектации.</p>
        <PricelistClient />
      </div>
    </section>
  );
}
