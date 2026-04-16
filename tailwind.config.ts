import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        foreground: "var(--text)",
        muted: "var(--text-muted)",
        inverse: "var(--text-inverse)",
        border: {
          DEFAULT: "var(--border)",
          hover: "var(--border-hover)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          glow: "var(--primary-glow)",
        },
        sidebar: {
          bg: "var(--sidebar-bg)",
          hover: "var(--sidebar-hover)",
          border: "var(--sidebar-border)",
        }
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
      }
    },
  },
  plugins: [],
} satisfies Config;

