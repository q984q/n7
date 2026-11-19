import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { SUBCATEGORIES } from "@/data/subcategories";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.url;
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1.0 },
    { path: "/catalog", priority: 0.95 },
    { path: "/pricelist", priority: 0.85 },
    { path: "/compare", priority: 0.7 },
    { path: "/contacts", priority: 0.85 },
    { path: "/map", priority: 0.6 },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r.path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: r.priority,
    })),
    ...CATEGORIES.map((c) => ({
      url: `${base}/catalog/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...SUBCATEGORIES.map((s) => ({
      url: `${base}/catalog/sub/${s.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...PRODUCTS.map((p) => ({
      url: `${base}/catalog/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
