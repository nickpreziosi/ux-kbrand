import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";

const config: Config = {
  future: {
    // Disables hover effects on touch devices
    hoverOnlyWhenSupported: true,
  },
  darkMode: ["class"],
  safelist: [
    // Container queries (ensure generated when passed as props or in dynamic contexts)
    "@container",
    "@sm:px-6",
    "@md:px-8",
    "@lg:px-12",
    "@sm:py-12",
    "@md:py-16",
    "@lg:py-24",
    "@sm:w-fit",
    "@sm:flex-row",
    "@lg:grid-cols-2",
    "@lg:col-span-2",
    "@[280px]:grid-cols-2",
    "@[600px]:grid-cols-2",
    "@[960px]:grid-cols-4",
    "@[70rem]:grid-cols-6",
    "@md:grid-cols-2",
    "@lg:grid-cols-3",
    "@sm:block",
    "@lg:block",
    "@sm:flex",
    "@lg:flex",
    "@sm:items-center",
    "@sm:justify-end",
  ],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    // Include component library paths:
    "./node_modules/@k-lab/components/ui/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@k-lab/components/dist/**/*.{js,mjs}",
  ],
  theme: {
    extend: {
      // Container query breakpoints (match viewport sm/md/lg for consistent steps)
      containers: {
        xs: "20rem", // 320px
        sm: "40rem", // 640px
        md: "48rem", // 768px
        lg: "64rem", // 1024px
        xl: "80rem", // 1280px
        "2xl": "96rem", // 1536px
        "3xl": "112rem", // 1792px
        "4xl": "128rem", // 2048px
        "5xl": "144rem", // 2304px
        "6xl": "160rem", // 2560px
        "7xl": "176rem", // 2816px
      },
      fontFamily: {
        sans: ["var(--font-sora)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "app-radius": "var(--app-radius)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--foreground))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--muted))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--status-text))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-bg))",
          foreground: "hsl(var(--foreground))",
          primary: "hsl(var(--foreground))",
          "primary-foreground": "hsl(var(--primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--foreground))",
          border: "hsl(var(--border))",
          ring: "hsl(var(--ring))",
        },
        "call-action": "hsl(var(--call-action))",
        "accent-brand": "hsl(var(--accent-brand))",
        // Fixed backdrops for logo/asset previews - theme-independent by design.
        "brand-surface": {
          light: "hsl(var(--brand-surface-light))",
          dark: "hsl(var(--brand-surface-dark))",
        },
        "accent-pink": "hsl(var(--accent-brand))", // Legacy alias
        "amex-brand": "hsl(var(--amex-brand))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
      },
    },
  },
  // Plugins:
  // - tailwindcss-animate: For accordion/collapsible animations (required)
  // - @tailwindcss/typography: For Typography component prose styling (optional)
  // - @tailwindcss/container-queries: For Content component container queries (optional)
  plugins: [tailwindcssAnimate, typography, containerQueries],
};

export default config;
