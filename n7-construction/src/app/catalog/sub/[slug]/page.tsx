import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductsBySubcategory } from "@/data/products";
import { SUBCATEGORIES, getSubcategoryBySlug } from "@/data/subcategories";
import { buildMetadata, getItemListSchema } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { LeadCaptureSection } from "@/components/LeadCaptureSection";

export function generateStaticParams() {
  return SUBCATEGORIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const {slug} = await params;
  const sub = getSubcategoryBySlug(slug);
  if (!sub) return {};
  return buildMetadata({
    title: sub.seoTitle,
    description: sub.seoDescription,
    path: `/catalog/sub/${sub.slug}`,
    image: sub.image,
  });
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const {slug} = await params;
  const sub = getSubcategoryBySlug(slug);
  if (!sub) notFound();

  const items = getProductsBySubcategory(sub.slug);

  return (
    <>
      <JsonLd data={getItemListSchema(items, sub.name)} />

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { name: "Каталог", path: "/catalog" },
              {
                name: sub.parentLabel,
                path: `/catalog/category/${sub.parentCategory}`,
              },
              { name: sub.shortName, path: `/catalog/sub/${sub.slug}` },
            ]}
          />

          <div className="mb-7 space-y-4">
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-ink">
                {sub.name}
              </h1>
              <span className="text-sm font-semibold text-ink/45 tabular-nums">
                {items.length} поз.
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap pb-0.5">
              {sub.keyMetrics.map((m) => (
                <div
                  key={m.label}
                  className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs ring-1 ring-ink/[0.08]"
                >
                  <span className="text-ink/45">{m.label}: </span>
                  <strong className="text-ink">{m.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <CatalogBrowser
            initialCategory={sub.parentCategory}
            initialSubcategory={sub.slug}
          />
        </div>
      </section>

      <LeadCaptureSection source={`Подкатегория: ${sub.name}`} />
    </>
  );
}
