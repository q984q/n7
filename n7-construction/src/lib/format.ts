import { SITE_CONFIG } from "@/config/site";

export function hasPrice(amount?: number | null): boolean {
  return typeof amount === "number" && Number.isFinite(amount) && amount > 0;
}

export function formatKZTExact(amount: number): string {
  const rounded = Math.round(amount || 0);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} ${SITE_CONFIG.currencySymbol}`;
}

export function formatPrice(amount: number): string {
  if (!hasPrice(amount)) return "По запросу";
  return formatKZTExact(amount);
}

export const formatKZT = formatPrice;

export function formatNumber(amount: number): string {
  return Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
