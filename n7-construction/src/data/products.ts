import { expandFlooring } from "./flooring-models";
export type {
  ProductCategory,
  ProductSubcategory,
  PriceTier,
  ProductSpec,
  ProductVariant,
  Product,
  CategoryInfo,
} from "./products-types";

import { CategoryInfo, Product, ProductCategory, ProductSubcategory } from "./products-types";
import { PVC_PARQUET_PRODUCTS } from "./products-pvc-parquet";
import { MODULAR_SPECIAL_PRODUCTS } from "./products-modular-special";
import { LIGHTING_PADEL_PRODUCTS } from "./products-lighting-padel";
export { LIGHTING_SERIES } from "./products-lighting";
export type { LightingSeriesMeta } from "./products-lighting";

/**
 * Примечание из презентаций N7 CONSTRUCTION:
 * допуски международных федераций относятся к конкретной модели покрытия и подтверждаются на выбранную поставку;
 * если срок гарантии не указан в исходном листе спецификации, он согласуется при заказе.
 */
export const CATALOG_COMPLIANCE_NOTE =
  "Упомянутые в карточках допуски международных спортивных федераций (FIBA, FIBA 3×3, FIVB, IHF, ITTF, ITF, IAAF / World Athletics) относятся к соответствующей модели покрытия в каталоге и при необходимости подтверждаются документами на выбранную партию. Для позиций, где срок гарантии не прописан в листе спецификации, условия гарантии уточняются при оформлении заказа.";

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "flooring",
    slug: "flooring",
    name: "Спортивные и коммерческие покрытия",
    shortName: "Покрытия",
    description:
      "Рулонные спортивные и коммерческие ПВХ-покрытия (2–8 мм, включая печать под заказ), стационарный и сборно-разборный спортивный паркет, модульные плитки для улицы и зала, дренажный настил 3816–3819, сборные и полусборные беговые дорожки, а также покрытия для пиклбола.",
    image: "/images/indoor-arena.jpg",
    seoTitle: "Спортивные покрытия: ПВХ, паркет, модульная плитка, беговые дорожки | N7 CONSTRUCTION",
    seoDescription:
      "Каталог спортивных покрытий N7 CONSTRUCTION: рулонный ПВХ Y-*6170, Y14155S, A-*9180, A-*9160, A-65160, спортивный паркет, модули SES Elite, E630, FLEX 16, DL, Pearl Asterisk, беговые дорожки и пиклбол.",
    highlights: [
      "Рулонный ПВХ 2–8 мм и индивидуальная печать",
      "Стационарный (6 пород) и сборно-разборный паркет",
      "Модульные покрытия и дренажный настил 3816–3819",
      "Беговые дорожки 9–15 мм и корты для пиклбола",
    ],
  },
  {
    id: "lighting",
    slug: "lighting",
    name: "Светодиодное освещение",
    shortName: "Освещение",
    description:
      "45 моделей модульных светодиодных прожекторов мощностью от 100 до 1250 Вт в четырёх фирменных линейках: N7 TITAN (E, S, DMX — 250–1250 Вт, 160–165 лм/Вт), N7 VEKTOR (120–600 Вт, IP67, IK09), N7 KRON (150–600 Вт, 3030 SMD, IP67, IK10) и N7 KORT (100–600 Вт, 5050 SMD, IP66, IK10). Гарантия — 5 лет.",
    image: "/images/products/led-titan-dmx-front.jpg",
    seoTitle: "Светодиодные прожекторы N7 TITAN, VEKTOR, KRON, KORT (100–1250 Вт) | N7 CONSTRUCTION",
    seoDescription:
      "45 моделей модульных прожекторов N7 CONSTRUCTION по мощности от 100 до 1250 Вт (артикулы N7-LTE, N7-LTS, N7-LTD, N7-LVK, N7-LVS, N7-LKR, N7-LKS, N7-LCT, N7-LCS): до 165 лм/Вт, драйверы Inventronics и Sosen, гарантия 5 лет.",
    highlights: [
      "N7 TITAN E / S / DMX (N7-LTE, LTS, LTD): 250–1250 Вт, 160–165 лм/Вт, DALI / DMX",
      "N7 VEKTOR / VEKTOR S (N7-LVK, LVS): 120–600 Вт, IP67, IK09",
      "N7 KRON / KRON S (N7-LKR, LKS): 150–600 Вт, 3030 SMD, IP67, IK10",
      "N7 KORT / KORT S (N7-LCT, LCS): 100–600 Вт, 5050 SMD, IP66, IK10",
    ],
  },
  {
    id: "infrastructure",
    slug: "infrastructure",
    name: "Падел-корты 20 × 10 м",
    shortName: "Падел-корты",
    description:
      "Комплектные падел-корты 20 × 10 м в четырёх исполнениях: панорамные PD001–PD004, суперпанорамный PD005, со встроенным навесом PD006 и классические PD007–PD008. Закалённое стекло 12 мм, сварная сетка 50×50 мм, газон 200 м² (12 мм) и LED-освещение.",
    image: "/images/padel-court.jpg",
    seoTitle: "Падел-корты 20×10 м PD001–PD008: панорамные, с навесом, классические | N7 CONSTRUCTION",
    seoDescription:
      "Падел-корты N7 CONSTRUCTION серий PD001–PD008 размером 20×10 м: 18 панелей стекла 12 мм, сварная сетка Ø4 мм (50×50 мм), искусственный газон 200 м² (12 мм), окраска по RAL и LED-освещение.",
    highlights: [
      "PD001–PD004: панорамная серия 20 × 10 м",
      "PD005: суперпанорамное исполнение",
      "PD006: встроенный навес от солнца и дождя",
      "PD007–PD008: классический каркас с доп. стойками",
    ],
  },
];

// Studio illustrations are linked by exact SKU, never inherited by sibling models.
const studio: Record<string,string> = {
  'Y-6170': '/images/products/y6170-studio.jpg',
  'A-65160': '/images/products/a65160-studio.jpg',
  E630: '/images/products/e630-studio.jpg',
};
function catalogPresentation(p: Product): Product {
  const image = studio[p.sku];
  const title = p.category !== 'flooring' ? p.shortName : p.shortName
    .replace(/^Модуль /, 'Спортивная плитка ')
    .replace(/^ПВХ A-65160 Клён/, 'Спортивное ПВХ-покрытие A-65160 «Клён»')
    .replace(/^Спортивный ПВХ Y-\*6170/, 'Спортивное ПВХ-покрытие Y-6170')
    .replace(/^Паркет · /, 'Спортивный паркет · ');
  return { ...p, shortName: title, ...(title !== p.shortName ? {seoTitle:`${title} | N7 Construction`} : {}),
    ...(image ? { image, gallery:[...new Set([image,p.image,...p.gallery])] } : {}) };
}
export const PRODUCTS: Product[] = [
  ...PVC_PARQUET_PRODUCTS.flatMap(expandFlooring),
  ...MODULAR_SPECIAL_PRODUCTS.flatMap(expandFlooring),
  ...LIGHTING_PADEL_PRODUCTS,
].map(catalogPresentation);

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductsBySubcategory(sub: ProductSubcategory): Product[] {
  return PRODUCTS.filter((p) => p.subcategory === sub);
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getTierPrice(product: Product, qty: number): PriceTierResult {
  if (!product.price || product.price <= 0) {
    return {
      unitPrice: 0,
      discount: "По запросу",
      tierLabel: product.tiers[0]?.label || "По запросу",
      total: 0,
      onRequest: true,
    };
  }
  const sorted = [...product.tiers]
    .filter((t) => t.price > 0)
    .sort((a, b) => b.minQty - a.minQty);
  const matched = sorted.find((t) => qty >= t.minQty);
  const unitPrice = matched ? matched.price : product.price;
  return {
    unitPrice,
    discount: matched?.discount || "Базовая",
    tierLabel: matched?.label || "Базовая цена",
    total: unitPrice * qty,
    onRequest: false,
  };
}

export interface PriceTierResult {
  unitPrice: number;
  discount: string;
  tierLabel: string;
  total: number;
  onRequest: boolean;
}

export function formatKzt(amount: number): string {
  if (!amount || amount <= 0) return "По запросу";
  return `${Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₸`;
}

export function formatWarranty(years: number): string {
  if (!years || years <= 0) return "Уточняется при заказе";
  const mod10 = years % 10;
  const mod100 = years % 100;
  if (mod10 === 1 && mod100 !== 11) return `${years} год`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${years} года`;
  return `${years} лет`;
}

export function orderQuantity(product: Pick<Product, 'minOrder' | 'stepQty'>, value: number) {
  const min = Math.max(1, product.minOrder), step = Math.max(1, product.stepQty);
  return min + Math.ceil(Math.max(0, (Number.isFinite(value) ? value : min) - min) / step) * step;
}
