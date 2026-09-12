import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "var(--paper)",
          deep: "var(--paper-deep)",
        },
        card: "var(--card)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--border)",
        "line-soft": "var(--border-soft)",
        terracotta: {
          DEFAULT: "var(--terracotta)",
          deep: "var(--terracotta-deep)",
        },
        teal: {
          DEFAULT: "var(--teal)",
          deep: "var(--teal-deep)",
        },
        slateink: "var(--slate-deep)",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "Times New Roman", "serif"],
        sans: ["Figtree", "Segoe UI", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "22px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(60, 47, 28, 0.06)",
        md: "0 10px 26px -14px rgba(74, 54, 28, 0.45)",
        lg: "0 22px 48px -22px rgba(74, 54, 28, 0.55)",
      },
      maxWidth: {
        container: "980px",
      },
    },
  },
  plugins: [],
} satisfies Config;
