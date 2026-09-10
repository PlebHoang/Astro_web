// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/telescope-cluster': '/telescope-lab'
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        // ponytail: ignore build artifacts, dev lock/logs, and tests to stop HMR multi-tab reload storms
        ignored: ['**/dist/**', '**/.astro/**', '**/test.mjs', '**/reference/**']
      }
    }
  }
});