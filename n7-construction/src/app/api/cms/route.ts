import { NextResponse } from "next/server";
import { readCms, applyProductOverrides } from "@/lib/cms";
import { PRODUCTS } from "@/data/products";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await readCms();
  const products = applyProductOverrides(
    PRODUCTS,
    db.productOverrides,
    db.customProducts,
    false
  );

  return NextResponse.json({
    settings: db.settings,
    products,
  });
}
