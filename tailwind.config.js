import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'oklch(98% 0.006 260)',
        surface: 'oklch(99% 0.004 260)',
        'surface-alt': 'oklch(96% 0.006 260)',
        ink: 'oklch(18% 0.015 260)',
        'ink-soft': 'oklch(40% 0.02 260)',
        'ink-softer': 'oklch(50% 0.015 260)',
        border: 'oklch(91% 0.01 260)',
        'border-soft': 'oklch(85% 0.01 260)',
        pill: 'oklch(94% 0.01 260)',
        accent: '#5B8CFF',
        'accent-deep': 'oklch(55% 0.18 260)',
        live: '#22C55E',
        game: 'oklch(50% 0.15 40)',
      },
      fontFamily: {
        sans: ['Manrope', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
