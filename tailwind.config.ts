import type { Config } from "tailwindcss";

// Design tokens for "PDF Tools":
// Background: near-white paper tone (#FAFAF9) — evokes a clean document/desk, not a generic SaaS gradient.
// Ink: deep slate-navy (#12213A) for headings — trust and precision, distinct from generic "AI purple".
// Accent: a restrained document-red (#C4432C) used ONLY for the active/primary action (upload, convert),
//         echoing a stamped wax-seal / red pen mark on paper — the one "signature" color.
// Success: forest green (#1B6B4C) for completed/download states.
// Line: soft paper-grain gray (#E7E3DC) for borders instead of pure gray, to keep the warm-paper feel.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF9",
        ink: "#12213A",
        "ink-soft": "#3F4A5E",
        accent: "#C4432C",
        "accent-soft": "#F3DAD3",
        success: "#1B6B4C",
        line: "#E7E3DC",
        card: "#FFFFFF",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,33,58,0.04), 0 8px 24px -12px rgba(18,33,58,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
