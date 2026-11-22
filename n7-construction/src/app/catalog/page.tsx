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
import { QuoteChecklistSection } from "@/components/BuyerBlocks";

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

          <header className="relative isolate mb-9 overflow-hidden rounded-[28px] bg-ink px-6 py-8 text-white sm:px-12 sm:py-14">
            <Image src="/images/indoor-arena.jpg" alt="" fill priority sizes="(max-width:1280px) 100vw, 1280px" className="-z-20 object-cover object-center" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/95 via-black/80 to-black/35" />
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em]"><span aria-hidden="true" className="h-0.5 w-8 bg-track" />N7 Construction · Казахстан</p>
            <h1 className="my-5 max-w-2xl text-4xl font-extrabold leading-none tracking-tight sm:text-6xl">Каталог для спортивных объектов</h1>
            <p className="max-w-md text-sm text-white/90 sm:text-base">Покрытия, освещение и падел-корты. Выберите направление или найдите модель по артикулу.</p>
            <div className="mt-6 flex flex-wrap gap-3"><a className="rounded-full bg-white px-5 py-3 text-sm font-bold text-ink" href="#models">К товарам ↓</a><Link className="rounded-full border border-white/60 px-5 py-3 text-sm font-bold" href="/contacts#project">Подобрать под объект</Link></div>
          </header>
          {!initialQuery && initialSport === 'all' && <nav aria-label="Направления каталога" className="mb-10 grid gap-4 md:grid-cols-3">
            {CATEGORIES.map((cat, i) => <section key={cat.id} className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
              <Link href={`/catalog/category/${cat.slug}`} className="group relative flex min-h-44 items-end overflow-hidden bg-ink p-5 text-white">
                <Image src={cat.image} alt="" fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <span className="relative"><span className="text-xs font-mono">0{i+1} / 03 · {PRODUCTS.filter(p => p.category === cat.id).length} поз.</span><strong className="mt-1 block text-2xl">{cat.shortName} ↗</strong></span>
              </Link>
              <ul className="divide-y divide-ink/10 px-4">{SUBCATEGORIES.filter(sub => sub.parentCategory === cat.id).map(sub => <li key={sub.slug}><Link className="flex justify-between py-2.5 text-sm font-semibold hover:text-track" href={`/catalog/sub/${sub.slug}`}>{sub.name}<span aria-hidden="true">→</span></Link></li>)}</ul>
            </section>)}
          </nav>}
          <div id="models" className="mb-5 flex scroll-mt-24 items-baseline gap-3 border-t border-ink/15 pt-6"><h2 className="text-3xl font-extrabold tracking-tight">Все товары</h2><span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">{PRODUCTS.length}</span></div>
          <CatalogBrowser
            initialQuery={initialQuery}
            initialSport={initialSport}
          />
        </div>
      </section>

      <QuoteChecklistSection />
      <LeadCaptureSection source="Страница каталога" />
    </>
  );
}
