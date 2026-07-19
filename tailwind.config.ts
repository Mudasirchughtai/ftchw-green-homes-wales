import type { Config } from "tailwindcss";

// Design direction (CLAUDE.md -> DESIGN DIRECTION): deep Welsh green, warm
// off-white, white cards, slate/charcoal text, muted gold accent.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF5F0",
          100: "#D6E7DC",
          200: "#AECFB8",
          300: "#82B394",
          400: "#57946F",
          500: "#3A7856",
          600: "#2A5F43",
          700: "#204A35",
          800: "#163726",
          900: "#0F2A1C",
        },
        cream: {
          DEFAULT: "#FAF7F0",
          100: "#FFFFFF",
          200: "#F5F1E8",
        },
        gold: {
          50: "#FBF6EC",
          100: "#F3E4C2",
          200: "#E9CE93",
          300: "#DCB667",
          400: "#CBA047",
          500: "#B3873A",
          600: "#8F6C2E",
        },
        ink: {
          DEFAULT: "#232B27",
          light: "#4B564F",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(15, 42, 28, 0.08)",
        "card-lg": "0 8px 30px rgba(15, 42, 28, 0.12)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
