import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { CartDrawer } from "@/components/CartDrawer";
import { LeadModal, GlobalWidgets } from "@/components/LeadModal";
import { JsonLd } from "@/components/JsonLd";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/seo";
import { SITE_CONFIG } from "@/config/site";

const manrope = localFont({
  src: "./fonts/GeistVF.woff",
  weight: "100 900",
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  weight: "100 900",
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0B0F14",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default:
      "N7 CONSTRUCTION — Спортивные покрытия, падел-корты и светодиодное освещение",
    template: "%s",
  },
  description:
    "Каталог N7 CONSTRUCTION: рулонные ПВХ-покрытия (Y-*6170, Y14155S, A-*9180, A-*9160, A-65160, 2 мм, печать под заказ), спортивный паркет, модульные покрытия (SES Elite, E630, FLEX 16, DL, Pearl Asterisk), беговые дорожки, пиклбол, дренажный настил 3816–3819, падел-корты PD001–PD008 и 45 моделей прожекторов N7 TITAN, VEKTOR, KRON, KORT.",
  applicationName: SITE_CONFIG.name,
  category: "construction",
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ? {
    verification: {
      ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      }),
      ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION && {
        yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      }),
    },
  } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru-KZ" className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-canvas text-ink min-h-screen flex flex-col">
        <JsonLd data={[getOrganizationSchema(), getWebsiteSchema()]} />
        <StoreProvider>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
          <CartDrawer />
          <LeadModal />
          <GlobalWidgets />
        </StoreProvider>
      </body>
    </html>
  );
}
