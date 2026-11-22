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

          <div className="mb-7 flex flex-wrap items-baseline gap-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-ink">
              {cat.name}
            </h1>
            <span className="text-sm font-semibold text-ink/45 tabular-nums">
              {items.length} поз.
            </span>
          </div>

          {cat.id === "lighting" && <LightingBrief />}
          <CatalogBrowser initialCategory={cat.id} />
        </div>
      </section>

      <LeadCaptureSection source={`Раздел: ${cat.name}`} />
    </>
  );
}
