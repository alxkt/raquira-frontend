import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// SSR temporarily enabled for dynamic random gallery; remove adapter & prerender flag to revert to full SSG.
export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  vite: {
    plugins: [tailwindcss()]
  }
});