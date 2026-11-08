/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { URL, fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

// Link previews (WhatsApp, LinkedIn) don't run JS, so /tools is served a copy of the
// built page with its own title and description (see vercel.json).
const SITE = 'https://adityahamda.vercel.app/';
const toolsHtml = (): Plugin => ({
  name: 'tools-html',
  apply: 'build',
  writeBundle({ dir = 'dist' }) {
    let html = readFileSync(join(dir, 'index.html'), 'utf8');
    const swaps: [string, string][] = [
      [
        'Aditya Hamda | Frontend Engineer',
        'Free Job Search Tools | Aditya Hamda',
      ],
      [
        'Frontend engineer building web and mobile apps for government, banking, and enterprise products. React, Next.js, TypeScript.',
        'Make your resume, check it against a job post, and write the cover letter. Free, no sign-up, nothing leaves your browser.',
      ],
      [`content="${SITE}"`, `content="${SITE}tools"`],
    ];
    for (const [from, to] of swaps) {
      // fails the build when index.html changes, instead of shipping the portfolio's preview
      if (!html.includes(from))
        throw new Error(`tools.html: "${from}" not found`);
      html = html.replaceAll(from, to);
    }
    writeFileSync(join(dir, 'tools.html'), html);
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), toolsHtml()],
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
    css: true,
    server: {
      deps: {
        inline: ['three'],
      },
    },
  },
});
