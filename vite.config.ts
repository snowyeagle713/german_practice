import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { pwaPlugin } from './scripts/pwa-plugin.ts';

// One authoring source: expose it in development and emit the same bytes in builds.
const contentFiles = ['seed-pack.json', 'verb-forms-pilot.json', 'verb-forms-batch-1.json', 'verb-forms-batch-2.json', 'verb-forms-final.json'];
export default defineConfig({
  plugins: [react(), {
    name: 'authored-content-asset',
    configureServer(server) {
      for (const file of contentFiles) server.middlewares.use(`/content/${file}`, (_request, response) => {
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.end(readFileSync(new URL(`./content/${file}`, import.meta.url)));
      });
    },
    generateBundle() {
      for (const file of contentFiles) this.emitFile({ type: 'asset', fileName: `content/${file}`, source: readFileSync(new URL(`./content/${file}`, import.meta.url)) });
    },
  }, pwaPlugin()],
  test: { include: ['tests/unit/**/*.test.ts'], environment: 'node' },
});
