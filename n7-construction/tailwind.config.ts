import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stadium: "#0B0F14",
        surface: "#F5F6F8",
        ink: {
          DEFAULT: "#0B0F14",
          soft: "#121821",
          card: "#171F2B",
          line: "#242F3F",
          muted: "#525B68",
        },
        canvas: {
          DEFAULT: "#F5F6F8",
          warm: "#EBEEF2",
        },
        track: {
          DEFAULT: "#D94423",
          dark: "#B93518",
          hover: "#B93518",
          light: "#FCECE8",
        },
        turf: {
          DEFAULT: "#1A7A4C",
          light: "#E7F5EE",
        },
        beam: {
          DEFAULT: "#E5A524",
          light: "#FEF6E4",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11, 15, 20, 0.04), 0 8px 24px -8px rgba(11, 15, 20, 0.07)",
        elevated:
          "0 4px 12px rgba(11, 15, 20, 0.06), 0 20px 44px -12px rgba(11, 15, 20, 0.14)",
        glow: "0 0 40px -8px rgba(217, 68, 35, 0.45)",
      },
      maxWidth: {
        site: "1360px",
      },
    },
  },
  plugins: [],
};

export default config;
