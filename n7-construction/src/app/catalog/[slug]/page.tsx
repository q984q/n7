import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS, getProductBySlug } from "@/data/products";
import { readCms, applyProductOverrides } from "@/lib/cms";
import { buildMetadata, getProductSchema } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { ProductCard } from "@/components/ProductCard";
import { LeadCaptureSection } from "@/components/LeadCaptureSection";
import { ScrollRail } from "@/components/ScrollRail";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const {slug} = await params;
  const staticProd = getProductBySlug(slug);
  if (staticProd) {
    return buildMetadata({
      title: staticProd.seoTitle,
      description: staticProd.seoDescription,
      path: `/catalog/${staticProd.slug}`,
      image: staticProd.image,
    });
  }
  const db = await readCms();
  const all = applyProductOverrides(PRODUCTS, db.productOverrides, db.customProducts, false);
  const found = all.find((p) => p.slug === slug);
  if (!found) return {};
  return buildMetadata({
    title: found.seoTitle,
    description: found.seoDescription,
    path: `/catalog/${found.slug}`,
    image: found.image,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const {slug} = await params;
  const db = await readCms();
  const all = applyProductOverrides(
    PRODUCTS,
    db.productOverrides,
    db.customProducts,
    false
  );
  const product = all.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = product.relatedSlugs
    .map((sl) => all.find((p) => p.slug === sl))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3);

  return (
    <>
      <JsonLd data={getProductSchema(product)} />

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { name: "Каталог", path: "/catalog" },
              {
                name: product.categoryLabel,
                path: `/catalog/category/${product.category}`,
              },
              {
                name: product.subcategoryLabel,
                path: `/catalog/sub/${product.subcategory}`,
              },
              { name: product.shortName, path: `/catalog/${product.slug}` },
            ]}
          />

          <ProductDetailClient key={product.id} product={product} />

          {related.length > 0 && (
            <div className="mt-14 sm:mt-16 border-t border-ink/[0.08] pt-10 sm:pt-12">
              <h2 className="mb-6 text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-ink">
                Похожие модели
              </h2>

              {/* Мобильная свайп-лента смежных позиций */}
              <div className="sm:hidden">
                <ScrollRail
                  fadeColor="canvas"
                  showArrows={false}
                  showProgress
                  snap
                  stepRatio={0.86}
                  trackClassName="flex items-stretch gap-3.5 pb-1"
                  ariaLabel="Смежные позиции каталога"
                >
                  {related.map((item) => (
                    <div
                      key={item.id}
                      className="w-[82vw] max-w-[320px] shrink-0 snap-start flex"
                    >
                      <ProductCard product={item} />
                    </div>
                  ))}
                </ScrollRail>
              </div>

              <div className="hidden sm:grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <LeadCaptureSection source={`Карточка: ${product.sku}`} />
    </>
  );
}
