import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0a0908",
          900: "#121110",
          800: "#1b1917",
          700: "#252220",
          600: "#332f2b",
        },
        warmwhite: {
          DEFAULT: "#f3ece1",
          dim: "#c9beac",
        },
        burgundy: {
          950: "#2a0a10",
          900: "#3d0f18",
          800: "#5c1522",
          700: "#7a1c2c",
          600: "#96233a",
          500: "#b32a45",
        },
        gold: {
          900: "#5c4a1f",
          800: "#7d642a",
          700: "#a3843a",
          600: "#c6a04e",
          500: "#e0bd6f",
          400: "#edd18f",
        },
        status: {
          available: "#5c8a6b",
          occupied: "#b3423b",
          reserved: "#d1a53d",
          closed: "#5a5551",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(224, 189, 111, 0.15)",
        card: "0 10px 30px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(ellipse at top, rgba(224,189,111,0.08), transparent 60%)",
      },
      animation: {
        pulseSlow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
