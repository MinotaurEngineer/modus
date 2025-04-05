import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: [vitePreprocess()],
  kit: {
    adapter: adapter({
      fallback: '200.html'
    }),
    paths: {
      base: '/modus'
    }
  }
};
