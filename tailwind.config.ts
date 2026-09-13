import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#090a0c",
          subtle: "#111317",
        },
        surface: {
          DEFAULT: "#14161d",
          raised: "#1a1d26",
          border: "#262933",
        },
        foreground: {
          DEFAULT: "#ffffff",
          muted: "#8a91a0",
          dim: "#525866",
        },
        // STRICT SINGLE ACCENT: Archival Amber
        accent: {
          DEFAULT: "#e5a93c",
          hover: "#d4962b",
          subtle: "rgba(229, 169, 60, 0.12)",
        },
      },
      fontFamily: {
        display: ["Syne", "system-ui", "sans-serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
