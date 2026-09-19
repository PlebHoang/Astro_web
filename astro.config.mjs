// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://PlebHoang.github.io',
  base: process.env.ASTRO_BASE || (process.env.GITHUB_ACTIONS ? '/Astro_web' : '/'),
  redirects: {
    '/telescope-cluster': '/telescope-lab'
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
      watch: {
        // ponytail: ignore build artifacts, dev lock/logs, and tests to stop HMR multi-tab reload storms
        ignored: ['**/dist/**', '**/.astro/**', '**/test.mjs', '**/reference/**']
      }
    }
  }
});