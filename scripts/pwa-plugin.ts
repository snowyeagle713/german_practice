import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import type { Plugin } from 'vite';
export function pwaPlugin(): Plugin {
  return {
    name: 'german-trainer-offline', enforce: 'post', apply: 'build',
    generateBundle(_options, bundle) {
      const publicFiles = ['manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];
      const files = [...Object.keys(bundle), ...publicFiles].sort();
      const hash = createHash('sha256');
      const digests: Record<string, string> = {};
      for (const file of files) {
        hash.update(file);
        const output = bundle[file];
        const source = output ? output.type === 'chunk' ? output.code : output.source : readFileSync(new URL(`../public/${file}`, import.meta.url));
        hash.update(source); digests[file] = createHash('sha256').update(source).digest('hex');
      }
      const template = readFileSync(new URL('../src/pwa/worker.js', import.meta.url), 'utf8');
      hash.update(template);
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: template.replace('__CACHE_NAME__', JSON.stringify(`german-trainer-assets-${hash.digest('hex').slice(0, 16)}`)).replace('__ASSET_LIST__', JSON.stringify(files)).replace('__HASH_MAP__', JSON.stringify(digests)) });
    },
  };
}
