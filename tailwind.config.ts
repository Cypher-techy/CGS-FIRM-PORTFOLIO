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
          950: "#041F18",
          900: "#052E22",
          800: "#0A3B2E",
          700: "#0E4D3B",
          600: "#12604A",
          500: "#177A5C",
        },
        emerald2: { DEFAULT: "#10B981", light: "#34D399", pale: "#A7F3D0" },
        charcoal: "#0B100E",
        ink: "#101613",
        mist: "#F4F6F3",
        fog: "#E9EDE9",
        slate2: "#5B6B64",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(4,31,24,.06), 0 8px 24px rgba(4,31,24,.08)",
        lift: "0 12px 40px rgba(4,31,24,.16)",
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};

export default config;
