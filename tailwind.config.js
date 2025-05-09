import animatePlugin from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A1122',
        foreground: '#F1F5F9',
        primary: {
          DEFAULT: '#3B82F6', // Blue-500
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#0EA5E9', // Sky-500
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#1E293B', // Slate-800
          foreground: '#E2E8F0',
        },
        card: {
          DEFAULT: '#111827', // Gray-900
          foreground: '#E2E8F0',
        },
        border: '#1E293B', // Slate-800
        input: '#1E293B', // Slate-800
        ring: '#3B82F6', // Blue-500
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animatePlugin],
};

export default config;
