"use client";

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

type WindowWithAnalytics = Window & {
  dataLayer?: Record<string, unknown>[];
  gtag?: (command: "event", eventName: string, params?: Record<string, unknown>) => void;
  ym?: (counterId: number, action: "reachGoal", goal: string, params?: Record<string, unknown>) => void;
  __N7_METRICA_ID__?: number;
};

function cleanParams(params: AnalyticsEventParams) {
  return Object.fromEntries(
    Object.entries(params).filter((entry) => entry[1] !== undefined && entry[1] !== "")
  );
}

/** Prepare first-party analytics events without sending data anywhere by itself. */
export function trackEvent(eventName: string, params: AnalyticsEventParams = {}) {
  if (typeof window === "undefined") return;
  const clean = cleanParams(params);
  const target = window as WindowWithAnalytics;
  target.dataLayer = target.dataLayer || [];
  target.dataLayer.push({ event: eventName, ...clean });
  target.gtag?.("event", eventName, clean);
  if (target.ym && target.__N7_METRICA_ID__) {
    target.ym(target.__N7_METRICA_ID__, "reachGoal", eventName, clean);
  }
}

export function trackProductEvent(
  eventName: "view_item" | "add_to_cart" | "begin_checkout",
  product: { id: string; sku: string; category: string; seriesCode?: string; photometry?: { wattage?: number } },
  qty = 1,
  extra: AnalyticsEventParams = {}
) {
  trackEvent(eventName, {
    item_id: product.id,
    item_sku: product.sku,
    item_category: product.category,
    item_series: product.seriesCode,
    wattage: product.photometry?.wattage,
    quantity: qty,
    ...extra,
  });
}
