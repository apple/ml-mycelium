import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.mdx'],
  preprocess: [vitePreprocess(), mdsvex({ extensions: ['.mdx'] })],
  kit: {
    paths: {
      base: '/ml-mycelium',
    },
    alias: {
      $lib: './src/lib',
    },
    adapter: adapter({
      pages: 'dist-app',
    }),
  },
};

export default config;
