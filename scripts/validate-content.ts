import { readFile } from 'node:fs/promises';
import { validateContent } from '../src/domain/content/validate';

try {
  const path = process.argv[2] ?? new URL('../content/seed-pack.json', import.meta.url);
  const pack = validateContent(JSON.parse(await readFile(path, 'utf8')));
  console.log(`PASS: ${pack.entries.length} entries, ${pack.questions.length} questions, ${pack.blocks.length} blocks; structure and references valid.`);
} catch (error) {
  console.error(`FAIL: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
