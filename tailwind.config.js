const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "selector", // or 'media' for system preference
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@rnr/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        primaryHover: "var(--color-primary-hover)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",
        surfaceBase: "var(--color-surface-base)",
        surfaceElevated: "var(--color-surface-elevated)",
        surfaceOverlay: "var(--color-surface-overlay)",
        borderDefault: "var(--color-border-default)",
        borderSubtle: "var(--color-border-subtle)",
        textPrimary: "var(--color-text-primary)",
        textSecondary: "var(--color-text-secondary)",
        textTertiary: "var(--color-text-tertiary)",
        textInverse: "var(--color-text-inverse)",
        focusRing: "var(--color-focus-ring)",
        linkDefault: "var(--color-link-default)",
      },
      fontFamily: {
        poppins: ["Poppins", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
