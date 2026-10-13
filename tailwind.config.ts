import type { Config } from "tailwindcss";

/**
 * As cores apontam para as variáveis CSS definidas em src/app/globals.css.
 * Os tokens continuam sendo a fonte única de verdade; este arquivo apenas
 * os expõe como classes utilitárias (ex.: `bg-lh-primary`, `text-lh-text-muted`).
 */
const token = (name: string) => `var(--lh-${name})`;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lh: {
          // Brand
          primary: token("primary"),
          "primary-hover": token("primary-hover"),
          "primary-active": token("primary-active"),
          "primary-soft": token("primary-soft"),
          "primary-border": token("primary-border"),
          "primary-text": token("primary-text"),
          // Growth
          accent: token("accent"),
          "accent-hover": token("accent-hover"),
          "accent-active": token("accent-active"),
          "accent-soft": token("accent-soft"),
          "accent-border": token("accent-border"),
          success: token("success"),
          "success-text": token("success-text"),
          "success-soft": token("success-soft"),
          // Backgrounds
          bg: token("bg"),
          "bg-subtle": token("bg-subtle"),
          surface: token("surface"),
          "surface-alt": token("surface-alt"),
          sidebar: token("sidebar"),
          "sidebar-hover": token("sidebar-hover"),
          "sidebar-active": token("sidebar-active"),
          input: token("input"),
          // Text
          text: token("text"),
          "text-secondary": token("text-secondary"),
          "text-muted": token("text-muted"),
          "text-inverse": token("text-inverse"),
          // Borders
          border: token("border"),
          "border-strong": token("border-strong"),
          // Status
          warning: token("warning"),
          "warning-soft": token("warning-soft"),
          danger: token("danger"),
          "danger-soft": token("danger-soft"),
          info: token("info"),
          "info-soft": token("info-soft"),
          overlay: token("overlay"),
        },
      },
      fontFamily: {
        sans: ["var(--lh-font-sans)"],
        mono: ["var(--lh-font-mono)"],
      },
      borderRadius: {
        "lh-sm": token("radius-sm"),
        "lh-md": token("radius-md"),
        "lh-lg": token("radius-lg"),
        "lh-xl": token("radius-xl"),
      },
      boxShadow: {
        "lh-card": token("shadow-card"),
        "lh-elevated": token("shadow-elevated"),
        "lh-focus": token("shadow-focus"),
      },
      transitionDuration: {
        "lh-fast": "140ms",
        "lh-normal": "200ms",
        "lh-slow": "280ms",
      },
      transitionTimingFunction: {
        lh: token("ease"),
      },
    },
  },
  plugins: [],
};

export default config;
