import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CATEGORIES,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/data/products";
import { buildMetadata, getItemListSchema } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { LeadCaptureSection } from "@/components/LeadCaptureSection";
import { LightingBrief } from "@/components/LightingBrief";
import { SurfaceXRayLab } from "@/components/SurfaceXRayLab";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const {slug} = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return buildMetadata({
    title: cat.seoTitle,
    description: cat.seoDescription,
    path: `/catalog/category/${cat.slug}`,
    image: cat.image,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const {slug} = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const items = getProductsByCategory(cat.id);

  return (
    <>
      <JsonLd data={getItemListSchema(items, cat.name)} />

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { name: "Каталог", path: "/catalog" },
              { name: cat.shortName, path: `/catalog/category/${cat.slug}` },
            ]}
          />

          <header className="relative mb-7 overflow-hidden rounded-[28px] bg-white p-5 ring-1 ring-ink/[0.08] shadow-card sm:p-8">
            <div aria-hidden="true" className="absolute right-0 top-0 h-full w-1/3 bg-blueprint-light opacity-40 [mask-image:linear-gradient(to_left,black,transparent)]" />
            <div className="relative flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-3xl">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-track">Каталог N7 · направление</p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.035em] text-ink sm:text-5xl">{cat.name}</h1>
                <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-ink/55">{cat.description}</p>
              </div>
              <span className="inline-flex shrink-0 items-center rounded-full bg-canvas px-4 py-2 text-xs font-bold text-ink/65">{items.length} позиций</span>
            </div>
          </header>

          {cat.id === "lighting" && <LightingBrief />}
          <CatalogBrowser initialCategory={cat.id} />
          {cat.id === "flooring" && <SurfaceXRayLab />}
        </div>
      </section>

      <LeadCaptureSection source={`Раздел: ${cat.name}`} />
    </>
  );
}
