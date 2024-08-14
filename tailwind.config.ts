import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{html,js,svelte,ts,md}'],
  plugins: [typography],
  theme: {
    container: {
      center: true,
    },
    fontFamily: {
      // Extend fonts included by Subtract into Tailwind utils
      sans: ['SF Pro Text', ...defaultTheme.fontFamily.sans],
      display: ['SF Pro Display', ...defaultTheme.fontFamily.sans],
      mono: ['SF Pro Mono', ...defaultTheme.fontFamily.sans],
    },
  },
} satisfies Config;
