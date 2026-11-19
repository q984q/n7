import type { Metadata } from "next";
import { SITE_CONFIG } from "@/config/site";
import type { Product } from "@/data/products";

interface BuildMetaInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  image = "/images/padel-court.jpg",
  type = "website",
  noIndex = false,
}: BuildMetaInput): Metadata {
  const canonicalUrl = `${SITE_CONFIG.url}${path === "/" ? "" : path}`;
  const fullImage = image.startsWith("http") ? image : `${SITE_CONFIG.url}${image}`;

  const defaultKeywords = [
    "N7 CONSTRUCTION",
    "спортивные покрытия",
    "рулонный ПВХ",
    "спортивный паркет",
    "модульные покрытия",
    "беговые дорожки",
    "падел-корты",
    "светодиодные прожекторы",
  ];

  return {
    title,
    description,
    keywords: Array.from(new Set([...keywords, ...defaultKeywords])),
    authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.legalName,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "ru-KZ": canonicalUrl,
        ru: canonicalUrl,
        "x-default": canonicalUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImage],
    },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/icon.svg`,
    image: `${SITE_CONFIG.url}/images/padel-court.jpg`,
    description:
      "Каталог спортивных и коммерческих покрытий, падел-кортов 20×10 м (PD001–PD008) и 45 моделей модульных светодиодных прожекторов N7 TITAN, VEKTOR, KRON и KORT (100–1250 Вт).",
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    inLanguage: "ru-KZ",
    publisher: { "@id": `${SITE_CONFIG.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/catalog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function getProductSchema(product: Product) {
  const positiveTierPrices = product.tiers.map((t) => t.price).filter((v) => v > 0);
  const lowestPrice =
    positiveTierPrices.length > 0 ? Math.min(...positiveTierPrices) : product.price;
  const hasPublicPrice = product.price > 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    mpn: product.sku,
    image: [`${SITE_CONFIG.url}${product.image}`],
    description: product.seoDescription,
    category: product.subcategoryLabel,
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.name,
    },
    offers: hasPublicPrice
      ? {
          "@type": "AggregateOffer",
          url: `${SITE_CONFIG.url}/catalog/${product.slug}`,
          priceCurrency: SITE_CONFIG.currency,
          lowPrice: lowestPrice,
          highPrice: product.price,
          offerCount: product.tiers.length || 1,
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/PreOrder",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: SITE_CONFIG.name,
          },
        }
      : {
          "@type": "Offer",
          url: `${SITE_CONFIG.url}/catalog/${product.slug}`,
          priceCurrency: SITE_CONFIG.currency,
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/PreOrder",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: SITE_CONFIG.name,
          },
        },
    additionalProperty: product.specs.slice(0, 8).map((s) => ({
      "@type": "PropertyValue",
      name: s.label,
      value: s.value,
    })),
  };
}

export function getItemListSchema(products: Product[], listName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_CONFIG.url}/catalog/${p.slug}`,
      name: p.name,
    })),
  };
}
