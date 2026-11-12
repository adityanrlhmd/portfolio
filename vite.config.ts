/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { URL, fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';

// Search engines and link previews (WhatsApp, LinkedIn) don't run JS, so each page in
// src/lib/seo.json gets a copy of the built index.html with its own title, description, URL
// and image (served by cleanUrls in vercel.json), and they all go in sitemap.xml. English
// only: the language toggle doesn't change the URL. Read, not imported, so the file stays
// out of tsconfig.node.json's project (importing it there breaks tsc on a clean build).
const SITE = 'https://adityahamda.vercel.app';
const SEO_PAGES: Record<
  string,
  { title: string; description: string; image?: string }
> = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('./src/lib/seo.json', import.meta.url)),
    'utf8'
  )
);
const HOME_TITLE = 'Aditya Hamda | Frontend Engineer';
const HOME_DESCRIPTION =
  'Frontend engineer building web and mobile apps for government, banking, and enterprise products. React, Next.js, TypeScript.';
const pagesHtml = (): Plugin => ({
  name: 'pages-html',
  apply: 'build',
  writeBundle({ dir = 'dist' }) {
    const home = readFileSync(join(dir, 'index.html'), 'utf8');
    for (const [path, page] of Object.entries(SEO_PAGES)) {
      let html = home;
      const swaps: [string, string][] = [
        [HOME_TITLE, page.title],
        [HOME_DESCRIPTION, page.description],
        // og:url, twitter:url and the canonical link
        [`"${SITE}/"`, `"${SITE}${path}"`],
        [`${SITE}/aditt.jpg`, `${SITE}${page.image ?? '/aditt.jpg'}`],
      ];
      for (const [from, to] of swaps) {
        // fails the build when index.html changes, instead of shipping the portfolio's preview
        if (!html.includes(from))
          throw new Error(`${path}.html: "${from}" not found`);
        html = html.split(from).join(to);
      }
      mkdirSync(dirname(join(dir, path)), { recursive: true });
      writeFileSync(join(dir, `${path}.html`), html);
    }
    const urls = ['/', ...Object.keys(SEO_PAGES)]
      .map(path => `  <url><loc>${SITE}${path}</loc></url>`)
      .join('\n');
    writeFileSync(
      join(dir, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
    );
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), pagesHtml()],
  assetsInclude: ['**/*.glb'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    dedupe: ['three'],
  },
  build: {
    // rapier inlines its wasm (~2.2MB); anything bigger than that is a regression
    chunkSizeWarningLimit: 2500,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    // installed agent skills ship their own test suites
    exclude: [...configDefaults.exclude, '.agents/**', '.claude/**'],
    css: true,
    server: {
      deps: {
        inline: ['three'],
      },
    },
  },
});
