import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      colors: {
        // ─────────────────────────────────────────────
        // PRIMARY BLUE PALETTE
        // Mapped to Tailwind color scale (50, 100, 200, ..., 900)
        // ─────────────────────────────────────────────
        blue: {
          50: 'var(--color-blue-0)',
          100: 'var(--color-blue-1)',
          200: 'var(--color-blue-2)',
          300: 'var(--color-blue-3)',
          400: 'var(--color-blue-4)',
          500: 'var(--color-blue-5)', // PRIMARY
          600: 'var(--color-blue-6)',
          700: 'var(--color-blue-7)',
          800: 'var(--color-blue-8)',
          900: 'var(--color-blue-9)',
        },

        // ─────────────────────────────────────────────
        // NEUTRAL/GRAY PALETTE
        // Cool gray with blue tint, replacing default grays
        // ─────────────────────────────────────────────
        gray: {
          50: 'var(--color-neutral-0)',
          100: 'var(--color-neutral-1)',
          200: 'var(--color-neutral-2)',
          300: 'var(--color-neutral-3)',
          400: 'var(--color-neutral-4)',
          500: 'var(--color-neutral-5)',
          600: 'var(--color-neutral-6)',
          700: 'var(--color-neutral-7)',
          800: 'var(--color-neutral-8)',
          900: 'var(--color-neutral-9)',
        },

        // ─────────────────────────────────────────────
        // SEMANTIC COLORS
        // ─────────────────────────────────────────────
        success: {
          light: 'var(--color-success-light)',
          DEFAULT: 'var(--color-success)',
          dark: 'var(--color-success-dark)',
        },

        warning: {
          light: 'var(--color-warning-light)',
          DEFAULT: 'var(--color-warning)',
          dark: 'var(--color-warning-dark)',
        },

        danger: {
          light: 'var(--color-danger-light)',
          DEFAULT: 'var(--color-danger)',
          dark: 'var(--color-danger-dark)',
        },

        info: {
          light: 'var(--color-info-light)',
          DEFAULT: 'var(--color-info)',
          dark: 'var(--color-info-dark)',
        },

        // ─────────────────────────────────────────────
        // BRAND ALIASES
        // Shortcuts for brand colors
        // ─────────────────────────────────────────────
        'brand-soft': 'var(--color-brand-soft)',
        brand: 'var(--color-brand)',
        'brand-strong': 'var(--color-brand-strong)',
      },

      boxShadow: {
        // ─────────────────────────────────────────────
        // CUSTOM SHADOW SYSTEM
        // ─────────────────────────────────────────────
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        brand: 'var(--shadow-brand)',
        focus: 'var(--shadow-focus)',
        success: 'var(--shadow-success)',
        warning: 'var(--shadow-warning)',
        danger: 'var(--shadow-danger)',
      },

      fontFamily: {
        // ─────────────────────────────────────────────
        // TYPOGRAPHY
        // ─────────────────────────────────────────────
        sans: ['var(--font-sans)'],
        body: ['var(--font-body)'],
      },
    },
  },
  plugins: [require('flowbite/plugin')],
} satisfies Config;
