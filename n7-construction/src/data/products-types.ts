export type ProductCategory = "flooring" | "lighting" | "infrastructure";

export type ProductSubcategory =
  | "pvc"
  | "parquet"
  | "modular"
  | "track"
  | "pickleball"
  | "wet"
  | "led-titan"
  | "led-vektor"
  | "led-kron"
  | "led-kort"
  | "padel";

export interface PriceTier {
  minQty: number;
  label: string;
  price: number; // 0 = По запросу (можно задать цену в ₸ в /admin)
  discount: string;
}

export interface ProductSpec {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface ProductVariant {
  code: string;
  spec: string;
  detail: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  shortName: string;
  seriesCode?: string;
  seriesName?: string;
  category: ProductCategory;
  categoryLabel: string;
  subcategory: ProductSubcategory;
  subcategoryLabel: string;
  unit: "м²" | "шт" | "компл";
  minOrder: number;
  stepQty: number;
  price: number;
  installPrice: number;
  tiers: PriceTier[];
  variants?: ProductVariant[];
  inStock: boolean;
  stockNote: string;
  warrantyYears: number; // 0 = в исходном каталоге не указана (уточняется для поставки)
  environment: "outdoor" | "indoor" | "universal";
  environmentLabel: string;
  sports: string[];
  certifications: string[];
  badge?: string;
  featured?: boolean;
  image: string;
  gallery: string[];
  summary: string;
  description: string;
  advantages: string[];
  specs: ProductSpec[];
  photometry?: {
    wattage: number;
    lumens: number;
    fluxRange?: string;
    efficacy: string;
    ledChip?: string;
    voltage?: string;
    dimming?: string;
    cct: string;
    ip: string;
    ik: string;
    driver: string;
    beamAngles: string[];
  };
  relatedSlugs: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface CategoryInfo {
  id: ProductCategory;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
  seoTitle: string;
  seoDescription: string;
  highlights: string[];
}
