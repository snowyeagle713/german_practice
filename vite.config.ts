import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// One authoring source: expose it in development and emit the same bytes in builds.
const contentPath = new URL('./content/seed-pack.json', import.meta.url);
export default defineConfig({
  plugins: [react(), {
    name: 'authored-content-asset',
    configureServer(server) {
      server.middlewares.use('/content/seed-pack.json', (_request, response) => {
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.end(readFileSync(contentPath));
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'content/seed-pack.json', source: readFileSync(contentPath) });
    },
  }],
  test: { include: ['tests/unit/**/*.test.ts'], environment: 'node' },
});
