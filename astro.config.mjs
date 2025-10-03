import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Reverted to static site generation (no SSR adapter)
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  }
});