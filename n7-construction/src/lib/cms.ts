import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";
import { Product } from "@/data/products";
import { SITE_CONFIG } from "@/config/site";

export const ADMIN_COOKIE = "n7_admin_session";

const DATA_DIR = path.join(process.cwd(), "data");
const CMS_FILE = path.join(DATA_DIR, "cms.json");


export interface ProductOverride {
  name?: string;
  price?: number;
  installPrice?: number;
  inStock?: boolean;
  stockNote?: string;
  badge?: string;
  featured?: boolean;
  hidden?: boolean;
}

export interface CmsSettings {
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  workingHours: string;
  bin: string;
  iik: string;
  bank: string;
  promoBannerActive: boolean;
  promoBannerText: string;
}

export interface CmsDatabase {
  adminLogin: string;
  adminPassHash: string;
  sessionSecret: string;
  settings: CmsSettings;
  productOverrides: Record<string, ProductOverride>;
  customProducts: Product[];
}

export type LeadStatus = "new" | "in_progress" | "kp_sent" | "won" | "archived";

export interface LeadAttachment {
  fileName: string;
  storedName: string;
  size: number;
  mimeType: string;
}

export interface LeadRecord {
  ticketId: string;
  status: LeadStatus;
  managerNote: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  bin: string;
  city: string;
  type: string;
  source: string;
  message: string;
  contextSummary: string;
  attachment?: LeadAttachment;
  items: {
    sku: string;
    name: string;
    qty: number;
    unit: string;
    unitPrice: number;
    optionsNote?: string;
    includeInstall?: boolean;
  }[];
  totalKzt: number;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hex] = stored.split(':');
  if (!salt || !hex || hex.length !== 128) return false;
  const expected = Buffer.from(hex, 'hex');
  const actual = crypto.scryptSync(password, salt, 64);
  return expected.length === actual.length && crypto.timingSafeEqual(actual, expected);
}
const bootstrapHash = process.env.N7_ADMIN_PASSWORD && process.env.N7_SESSION_SECRET ? (() => {
  const salt = crypto.createHash('sha256').update(process.env.N7_SESSION_SECRET!).digest('hex');
  return `${salt}:${crypto.scryptSync(process.env.N7_ADMIN_PASSWORD!, salt, 64).toString('hex')}`;
})() : '';
function signature(db: CmsDatabase, expires: string) {
  return crypto.createHmac('sha256', db.sessionSecret).update(JSON.stringify([db.adminLogin, db.adminPassHash, expires])).digest('hex');
}
export function createSessionToken(db: CmsDatabase) {
  const expires = String(Date.now() + 7 * 86400000);
  return `${expires}.${signature(db, expires)}`;
}

function getDefaultCms(): CmsDatabase {
  return {
    adminLogin: "admin",
    adminPassHash: bootstrapHash,
    sessionSecret: process.env.N7_SESSION_SECRET || "",
    settings: {
      phone: SITE_CONFIG.phone,
      whatsappNumber: SITE_CONFIG.whatsappNumber,
      email: SITE_CONFIG.email,
      address: SITE_CONFIG.address,
      workingHours: SITE_CONFIG.workingHours,
      bin: SITE_CONFIG.bin,
      iik: SITE_CONFIG.iik,
      bank: SITE_CONFIG.bank,
      promoBannerActive: false,
      promoBannerText: "",
    },
    productOverrides: {},
    customProducts: [],
  };
}

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readCms(): Promise<CmsDatabase> {
  const defaults = getDefaultCms();
  try {
    await ensureDir();
    const raw = await fs.readFile(CMS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<CmsDatabase>;
    return {
      adminLogin: parsed.adminLogin || defaults.adminLogin,
      adminPassHash: parsed.adminPassHash || defaults.adminPassHash,
      sessionSecret: defaults.sessionSecret,
      settings: { ...defaults.settings, ...(parsed.settings || {}) },
      productOverrides: parsed.productOverrides || {},
      customProducts: Array.isArray(parsed.customProducts) ? parsed.customProducts : [],
    };
  } catch {
    return defaults;
  }
}

export async function writeCms(db: CmsDatabase): Promise<void> {
  await ensureDir();
  await fs.writeFile(CMS_FILE, JSON.stringify({ ...db, sessionSecret: undefined }, null, 2), "utf-8");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const store = await cookies();
    const token = store.get(ADMIN_COOKIE)?.value;
    if (!token || !token.includes(".")) return false;
    const db = await readCms();
    if (db.sessionSecret.length < 32) return false;
    const [expires, mac] = token.split('.');
    if (!/^\d+$/.test(expires) || Number(expires) <= Date.now() || !/^[a-f0-9]{64}$/.test(mac || '')) return false;
    return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(signature(db, expires)));
  } catch {
    return false;
  }
}

export function applyProductOverrides(
  baseProducts: Product[],
  overrides: Record<string, ProductOverride>,
  customProducts: Product[] = [],
  includeHidden = false
): Product[] {
  const combined = [...customProducts, ...baseProducts];
  const result: Product[] = [];

  for (const prod of combined) {
    const ov = overrides[prod.id];
    if (!includeHidden && ov?.hidden) continue;

    if (!ov) {
      result.push(prod);
      continue;
    }

    const price = typeof ov.price === "number" && ov.price >= 0 ? ov.price : prod.price;
    const installPrice =
      typeof ov.installPrice === "number" && ov.installPrice >= 0
        ? ov.installPrice
        : prod.installPrice;

    const tiers = prod.tiers.map((t, idx) => {
      if (price <= 0) {
        return { ...t, price: 0, discount: "По запросу" };
      }
      if (idx === 0) {
        return { ...t, price, discount: "Базовая цена" };
      }
      if (idx === 1) {
        return { ...t, price: Math.round(price * 0.95), discount: "-5%" };
      }
      return { ...t, price: Math.round(price * 0.9), discount: "-10%" };
    });

    result.push({
      ...prod,
      name: ov.name?.trim() ? ov.name.trim() : prod.name,
      price,
      installPrice,
      tiers,
      inStock: typeof ov.inStock === "boolean" ? ov.inStock : prod.inStock,
      stockNote: ov.stockNote !== undefined ? ov.stockNote : prod.stockNote,
      badge: ov.badge !== undefined ? ov.badge || undefined : prod.badge,
      featured: typeof ov.featured === "boolean" ? ov.featured : prod.featured,
    });
  }

  return result;
}

