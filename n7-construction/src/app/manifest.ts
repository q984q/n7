import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: "N7 CONSTRUCTION",
    description: SITE_CONFIG.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#F7F7F5",
    theme_color: "#0B0F14",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
