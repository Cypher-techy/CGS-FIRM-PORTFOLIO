import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/data.ts",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#101D26",
          900: "#183B32",
          800: "#183B32",
          700: "#285246",
          600: "#3a6253",
          500: "#4d7061",
        },
        emerald2: { DEFAULT: "#546e57", light: "#bed0b4", pale: "#dce5d7" },
        bronze: "#B18A55",
        sage: "#A5B99A",
        charcoal: "#101D26",
        ink: "rgb(var(--ink) / <alpha-value>)",
        mist: "rgb(var(--paper) / <alpha-value>)",
        fog: "rgb(var(--inset) / <alpha-value>)",
        slate2: "rgb(var(--muted) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        action: "rgb(var(--action) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,29,38,.05)",
        lift: "0 4px 16px rgba(16,29,38,.08)",
      },
      borderRadius: { xl2: "5px", xl: "5px", "2xl": "5px" },
    },
  },
  plugins: [],
};

export default config;
