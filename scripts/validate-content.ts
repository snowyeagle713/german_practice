import { readFile } from 'node:fs/promises';
import { validateAnyContent, validateCatalog } from '../src/domain/content/catalog';
import { itemsForPack } from '../src/domain/content/types';

try {
  const paths = process.argv[2] ? [process.argv[2]] : ['seed-pack.json', 'verb-forms-pilot.json', 'verb-forms-batch-1.json'].map(file => new URL(`../content/${file}`, import.meta.url));
  const packs = validateCatalog(await Promise.all(paths.map(async path => validateAnyContent(JSON.parse(await readFile(path, 'utf8'))))));
  for (const pack of packs) console.log(`PASS: v${pack.schemaVersion} ${pack.packId}: ${itemsForPack(pack).length} items, ${pack.questions.length} questions, ${pack.blocks.length} blocks; structure and references valid.`);
} catch (error) {
  console.error(`FAIL: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
