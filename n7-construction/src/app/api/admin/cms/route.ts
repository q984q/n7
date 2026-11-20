import { NextResponse } from "next/server";
import {
  isAdminAuthenticated,
  readCms,
  writeCms,
  applyProductOverrides,
  hashPassword,
} from "@/lib/cms";
import {
  PRODUCTS,
  CATEGORIES,
  Product,
  ProductCategory,
  ProductSubcategory,
} from "@/data/products";
import { SUBCATEGORIES } from "@/data/subcategories";

export const dynamic = "force-dynamic";

function slugifyRu(str: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "j", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "shch",
    ы: "y", э: "e", ю: "yu", я: "ya",
  };
  return str
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = await readCms();
  const products = applyProductOverrides(
    PRODUCTS,
    db.productOverrides,
    db.customProducts,
    true
  );

  const hiddenIds = Object.entries(db.productOverrides)
    .filter(([, v]) => v.hidden)
    .map(([k]) => k);

  const staticPages = 7; // /, /catalog, /pricelist, /compare, /cart, /contacts, /map
  const visibleProducts = products.length - hiddenIds.length;

  const seoSummary = {
    staticPages,
    categories: CATEGORIES.length,
    subcategories: SUBCATEGORIES.length,
    products: visibleProducts,
    totalIndexable:
      staticPages + CATEGORIES.length + SUBCATEGORIES.length + visibleProducts,
  };

  return NextResponse.json({
    ok: true,
    adminLogin: db.adminLogin,
    settings: db.settings,
    products,
    hiddenIds,
    customProductIds: db.customProducts.map((p) => p.id),
    seoSummary,
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const action = String(body.action || "");
  const db = await readCms();

  if (action === "update_product") {
    const id = String(body.id || "");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const customIdx = db.customProducts.findIndex((p) => p.id === id);
    if (customIdx >= 0) {
      const cp = db.customProducts[customIdx];
      const rawPrice =
        body.price !== undefined ? Math.max(0, Number(body.price) || 0) : cp.price;
      db.customProducts[customIdx] = {
        ...cp,
        name: body.name ?? cp.name,
        price: rawPrice,
        installPrice:
          body.installPrice !== undefined
            ? Math.max(0, Number(body.installPrice) || 0)
            : cp.installPrice,
        inStock: typeof body.inStock === "boolean" ? body.inStock : cp.inStock,
        stockNote: body.stockNote ?? cp.stockNote,
        badge: body.badge !== undefined ? body.badge : cp.badge,
        featured: typeof body.featured === "boolean" ? body.featured : cp.featured,
        tiers: [
          {
            minQty: cp.minOrder,
            label: "Базовый объём",
            price: rawPrice,
            discount: rawPrice > 0 ? "Базовая цена" : "По запросу",
          },
          {
            minQty: cp.minOrder * 5,
            label: "Средний объём",
            price: rawPrice > 0 ? Math.round(rawPrice * 0.95) : 0,
            discount: rawPrice > 0 ? "-5%" : "По запросу",
          },
          {
            minQty: cp.minOrder * 12,
            label: "Объектный объём",
            price: rawPrice > 0 ? Math.round(rawPrice * 0.9) : 0,
            discount: rawPrice > 0 ? "-10%" : "По запросу",
          },
        ],
      };
    }

    db.productOverrides[id] = {
      ...(db.productOverrides[id] || {}),
      ...(body.name !== undefined ? { name: String(body.name) } : {}),
      ...(body.price !== undefined ? { price: Math.max(0, Number(body.price) || 0) } : {}),
      ...(body.installPrice !== undefined
        ? { installPrice: Math.max(0, Number(body.installPrice) || 0) }
        : {}),
      ...(typeof body.inStock === "boolean" ? { inStock: body.inStock } : {}),
      ...(body.stockNote !== undefined ? { stockNote: String(body.stockNote) } : {}),
      ...(body.badge !== undefined ? { badge: String(body.badge) } : {}),
      ...(typeof body.featured === "boolean" ? { featured: body.featured } : {}),
      ...(typeof body.hidden === "boolean" ? { hidden: body.hidden } : {}),
    };
    await writeCms(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "create_product") {
    const name = String(body.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Укажите наименование позиции" }, { status: 400 });
    }
    const price = Math.max(0, Number(body.price) || 0);
    const installPrice = Math.max(0, Number(body.installPrice) || 0);
    const category = (body.category as ProductCategory) || "flooring";
    const unit = category === "flooring" ? "м²" : category === "lighting" ? "шт" : "компл";
    const id = `p-custom-${Date.now()}`;
    const sku = String(body.sku || `N7-${Math.floor(100 + Math.random() * 900)}`).trim();
    const slug = `${slugifyRu(name || sku)}-${Math.floor(10 + Math.random() * 89)}`;

    const subMap: Record<
      ProductCategory,
      { sub: ProductSubcategory; lbl: string; img: string; catLbl: string }
    > = {
      flooring: {
        sub: "pvc",
        lbl: "Рулонные ПВХ-покрытия",
        img: "/images/pvc-hall.jpg",
        catLbl: "Спортивные покрытия",
      },
      lighting: {
        sub: "led-titan",
        lbl: "Прожекторы N7 TITAN",
        img: "/images/products/led-titan-dmx-front.jpg",
        catLbl: "Светодиодное освещение",
      },
      infrastructure: {
        sub: "padel",
        lbl: "Падел-корты 20 × 10 м",
        img: "/images/padel-court.jpg",
        catLbl: "Падел-корты",
      },
    };
    const meta = subMap[category] || subMap.flooring;
    const warrantyYears = Math.max(0, Number(body.warrantyYears) || 0);

    const newProd: Product = {
      id,
      sku,
      slug,
      name,
      shortName: name.slice(0, 32),
      category,
      categoryLabel: meta.catLbl,
      subcategory: meta.sub,
      subcategoryLabel: meta.lbl,
      unit,
      minOrder: category === "flooring" ? 50 : 1,
      stepQty: category === "flooring" ? 10 : 1,
      price,
      installPrice,
      tiers: [
        {
          minQty: category === "flooring" ? 50 : 1,
          label: "Базовый объём",
          price,
          discount: price > 0 ? "Базовая цена" : "По запросу",
        },
        {
          minQty: category === "flooring" ? 300 : 8,
          label: "Средний объём",
          price: price > 0 ? Math.round(price * 0.95) : 0,
          discount: price > 0 ? "-5%" : "По запросу",
        },
        {
          minQty: category === "flooring" ? 800 : 24,
          label: "Объектный объём",
          price: price > 0 ? Math.round(price * 0.9) : 0,
          discount: price > 0 ? "-10%" : "По запросу",
        },
      ],
      inStock: true,
      stockNote: String(body.stockNote || "Поставка по спецификации"),
      warrantyYears,
      environment: "universal",
      environmentLabel: "По спецификации",
      sports: [meta.catLbl],
      certifications: [],
      badge: body.badge ? String(body.badge) : undefined,
      featured: Boolean(body.featured),
      image: String(body.image || meta.img),
      gallery: [String(body.image || meta.img)],
      summary: String(body.summary || `${name} (${sku}) — позиция каталога N7 CONSTRUCTION.`),
      description: String(
        body.summary || `${name} (${sku}) — поставка и расчёт стоимости по запросу.`
      ),
      advantages: ["Расчёт комплектации и стоимости по запросу"],
      specs: [
        { label: "Код модели", value: sku, highlight: true },
        { label: "Единица измерения", value: unit },
        ...(warrantyYears > 0
          ? [{ label: "Гарантия", value: `${warrantyYears} лет`, highlight: true }]
          : []),
      ],
      relatedSlugs: [
        "sportivnyj-pvh-y6170-7mm",
        "n7-titan-dmx-1000w",
        "panoramnyj-padel-kort-pd001-pd005",
      ],
      seoTitle: `${name} | N7 CONSTRUCTION`,
      seoDescription: `${name} (${sku}) в каталоге N7 CONSTRUCTION. Стоимость по запросу.`,
    };

    db.customProducts.unshift(newProd);
    await writeCms(db);
    return NextResponse.json({ ok: true, product: newProd });
  }

  if (action === "delete_custom_product") {
    const id = String(body.id || "");
    db.customProducts = db.customProducts.filter((p) => p.id !== id);
    delete db.productOverrides[id];
    await writeCms(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "reset_product") {
    const id = String(body.id || "");
    delete db.productOverrides[id];
    await writeCms(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "save_settings") {
    db.settings = {
      ...db.settings,
      ...(body.settings || {}),
    };
    if (body.newPassword && String(body.newPassword).trim().length >= 6) {
      db.adminPassHash = hashPassword(String(body.newPassword).trim());
    }
    if (body.newLogin && String(body.newLogin).trim().length >= 3) {
      db.adminLogin = String(body.newLogin).trim();
    }
    await writeCms(db);
    return NextResponse.json({ ok: true, settings: db.settings });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
