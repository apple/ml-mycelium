import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, configDefaults } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    target: 'esnext',
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: [...configDefaults.exclude, 'tests/ui/*'],
  },
  resolve: {
    alias: {
      $lib: resolve('./src/lib'),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  server: {
    fs: {
      allow: ['package.json'],
    },
  },
});
