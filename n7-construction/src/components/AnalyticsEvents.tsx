"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** Sends PII-free events to dataLayer/provider hooks when a link is clicked. */
export function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href.includes("wa.me")) return;
      trackEvent("contact_whatsapp", {
        page_path: window.location.pathname,
        cta: anchor.getAttribute("aria-label") || anchor.textContent?.trim().slice(0, 80) || "WhatsApp",
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
