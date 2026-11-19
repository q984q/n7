import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/data/products";
import { SUBCATEGORIES } from "@/data/subcategories";
import React from "react";
import { PRODUCTS } from "@/data/products";
import { buildMetadata, getItemListSchema } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { LeadCaptureSection } from "@/components/LeadCaptureSection";

export const metadata = buildMetadata({
  title:
    "Каталог спортивных покрытий, падел-кортов и LED-прожекторов | N7 CONSTRUCTION",
  description:
    "Каталог N7 CONSTRUCTION: рулонный ПВХ, спортивный паркет, модульные покрытия, беговые дорожки, падел-корты PD001–PD008 и 45 моделей прожекторов N7 TITAN, VEKTOR, KRON и KORT с доставкой по Казахстану.",
  path: "/catalog",
});

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; sport?: string }>;
}) {
  const filters = await searchParams;
  const initialQuery = typeof filters?.q === "string" ? filters.q : "";
  const initialSport =
    typeof filters?.sport === "string" ? filters.sport : "all";

  return (
    <>
      <JsonLd data={getItemListSchema(PRODUCTS, "Каталог N7 CONSTRUCTION")} />

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ name: "Каталог", path: "/catalog" }]} />

          <div className="mb-7 flex flex-wrap items-baseline gap-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-ink">
              Каталог
            </h1>
            <span className="text-sm font-semibold text-ink/45 tabular-nums">
              {PRODUCTS.length} позиций
            </span>
          </div>

          {!initialQuery && initialSport === 'all' && <nav aria-label="Направления каталога" className="mb-10 grid gap-4 md:grid-cols-3">
            {CATEGORIES.map((cat, i) => <section key={cat.id} className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
              <Link href={`/catalog/category/${cat.slug}`} className="group relative flex min-h-36 items-end overflow-hidden bg-ink p-5 text-white">
                <Image src={cat.image} alt="" fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <span className="relative"><span className="text-xs font-mono">РАЗДЕЛ 0{i+1}</span><strong className="mt-1 block text-2xl">{cat.shortName} ↗</strong></span>
              </Link>
              <ul className="divide-y divide-ink/10 px-4">{SUBCATEGORIES.filter(sub => sub.parentCategory === cat.id).map(sub => <li key={sub.slug}><Link className="flex justify-between py-2.5 text-sm font-semibold hover:text-track" href={`/catalog/sub/${sub.slug}`}>{sub.name}<span aria-hidden="true">→</span></Link></li>)}</ul>
            </section>)}
          </nav>}
          <h2 className="mb-4 text-2xl font-bold">Подбор товаров</h2>
          <CatalogBrowser
            initialQuery={initialQuery}
            initialSport={initialSport}
          />
        </div>
      </section>

      <LeadCaptureSection source="Страница каталога" />
    </>
  );
}
