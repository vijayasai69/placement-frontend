import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  safelist: [
    {
      pattern: /(bg|text|border|from|to|via)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(400|500|600)/,
    }
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--bg-primary)",
        surface: {
          DEFAULT: "var(--bg-card)",
          light: "var(--bg-card)",
          border: "var(--border-subtle)",
          "border-light": "var(--border-medium)",
        },
        text: {
          primary: "var(--text-primary)",
          muted: "var(--text-muted)",
          "primary-light": "var(--text-primary)",
          "muted-light": "var(--text-muted)",
        },
        primary: {
          DEFAULT: "var(--accent-violet-bright)",
          hover: "var(--accent-violet)",
          light: "var(--accent-violet-light)",
        },
        secondary: {
          DEFAULT: "var(--bg-secondary)",
          hover: "var(--bg-card)",
          light: "var(--bg-secondary)",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error:   "#EF4444",
      },
      fontSize: {
        "10xl": ["8rem",  { lineHeight: "1" }],
        "11xl": ["10rem", { lineHeight: "1" }],
        "12xl": ["12rem", { lineHeight: "1" }],
      },
      backgroundImage: {
        "grid-dark":   "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "radial-dark": "radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)",
        "gradient-conic": "conic-gradient(from 0deg, #3b82f6, #a855f7, #06b6d4, #10b981, #3b82f6)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      boxShadow: {
        "card":       "0 1px 3px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.6)",
        "card-hover": "0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)",
        "glass":      "0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
        "glow-blue":  "0 0 30px rgba(59,130,246,0.4)",
        "glow-purple":"0 0 30px rgba(168,85,247,0.4)",
        "glow-cyan":  "0 0 30px rgba(6,182,212,0.4)",
      },
      borderRadius: {
        xl:  "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "float":          "float 8s ease-in-out infinite",
        "float-slow":     "float-y-slow 10s ease-in-out infinite",
        "fade-in":        "fadeIn 0.8s ease-out forwards",
        "slide-up":       "slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "aurora-1":       "aurora-1 12s ease-in-out infinite",
        "aurora-2":       "aurora-2 15s ease-in-out infinite",
        "aurora-3":       "aurora-3 18s ease-in-out infinite",
        "shimmer":        "shimmer 2.5s ease-in-out infinite",
        "pulse-ring":     "pulse-ring 2s ease-out infinite",
        "spin-slow":      "spin-slow 20s linear infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
        "glow-pulse":     "glow-pulse 3s ease-in-out infinite",
        "particle":       "particle-float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-20px)" },
        },
        "float-y-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%":      { transform: "translateY(-12px) rotate(-1deg)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "aurora-1": {
          "0%, 100%": { transform: "translate(0,0) scale(1)",         opacity: "0.5" },
          "33%":      { transform: "translate(60px,-40px) scale(1.15)",opacity: "0.8" },
          "66%":      { transform: "translate(-30px,50px) scale(0.9)", opacity: "0.6" },
        },
        "aurora-2": {
          "0%, 100%": { transform: "translate(0,0) scale(1)",          opacity: "0.4" },
          "25%":      { transform: "translate(-80px,30px) scale(1.2)", opacity: "0.7" },
          "75%":      { transform: "translate(40px,-60px) scale(0.85)",opacity: "0.5" },
        },
        "aurora-3": {
          "0%, 100%": { transform: "translate(0,0) scale(1)",          opacity: "0.3" },
          "50%":      { transform: "translate(50px,80px) scale(1.3)",  opacity: "0.6" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition:  "200% center" },
        },
        "pulse-ring": {
          "0%":   { transform: "scale(1)",   opacity: "0.8" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59,130,246,0.35)" },
          "50%":      { boxShadow: "0 0 40px rgba(59,130,246,0.5), 0 0 80px rgba(168,85,247,0.3)" },
        },
        "particle-float": {
          "0%":   { transform: "translateY(0) translateX(0)",   opacity: "0" },
          "10%":  { opacity: "1" },
          "90%":  { opacity: "1" },
          "100%": { transform: "translateY(-120px) translateX(20px)", opacity: "0" },
        },
      },
    },
  },
  plugins: [
    typography
  ],
};

export default config;
