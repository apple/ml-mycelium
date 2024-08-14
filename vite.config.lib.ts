import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [dts({ insertTypesEntry: true, exclude: ['vite.config.ts', 'src/routes/*'] }), svelte()],
  build: {
    outDir: 'dist',
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: 'src/lib/index.ts',
      name: 'Mycelium',
      // the proper extensions will be added
      fileName: 'mycelium',
    },
    sourcemap: 'inline',
    minify: false,
  },
  resolve: {
    alias: {
      $lib: resolve('./src/lib'),
    },
  },
});
