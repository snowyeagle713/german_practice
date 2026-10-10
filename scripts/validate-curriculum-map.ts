import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import map from '../content/curriculum-map.json';
import seed from '../content/seed-pack.json';

type CurriculumMap = typeof map;
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
const unique = (values: string[]) => new Set(values).size === values.length;

// Authoring-only checks: this module is not imported by the app or PWA build.
export function validateCurriculumMap(candidate: CurriculumMap): void {
  assert.equal(candidate.documentType, 'curriculum-plan');
  assert.equal(candidate.mapVersion, 1);
  assert.equal(candidate.runtimeEnabled, false);
  assert.equal(candidate.baseRelease, 'v1.0.0-mvp');
  assert.deepEqual(candidate.blockPolicy.normalSessionSizes, [10, 20]);
  assert.deepEqual(candidate.blockPolicy.itemRange, [8, 12]);
  assert.equal(candidate.blockPolicy.preferredItems, 10);
  assert.equal(candidate.blockPolicy.minimumEligibleQuestionPool, 20);
  assert.equal(candidate.blockPolicy.enduranceImplemented, false);
  assert.equal(candidate.categories.length, 9);
  assert.equal(candidate.layers.length, 2);
  assert.deepEqual(candidate.stages.map(stage => stage.id), ['b1', 'b2', 'bridge', 'c1']);
  const ids = candidate.categories.map(category => category.id);
  assert(unique([...ids, ...candidate.layers.map(layer => layer.id)]), 'Duplicate category/layer IDs');
  assert.deepEqual([...candidate.categories, ...candidate.layers].map(section => section.section), 'ABCDEFGHIJK'.split(''));
  const byId = new Map(candidate.categories.map(category => [category.id, category]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  function visit(id: string): void {
    assert(!visiting.has(id), `Dependency cycle at ${id}`);
    if (visited.has(id)) return;
    const category = byId.get(id);
    assert(category, `Unknown dependency ${id}`);
    visiting.add(id);
    category.prerequisites.forEach(visit);
    visiting.delete(id);
    visited.add(id);
  }
  ids.forEach(visit);
  for (const category of candidate.categories) {
    assert(Number.isInteger(category.target) && category.target > 0);
    assert.equal(category.targetRange.length, 2);
    assert(category.targetRange[0]! <= category.target && category.target <= category.targetRange[1]!);
    assert(Object.values(category.stageTargets).every(count => Number.isInteger(count) && count >= 0));
    assert.equal(sum(Object.values(category.stageTargets)), category.target);
    assert.equal(category.nominalBlocks * 10, category.target);
    assert(category.themes.length > 0 && unique(category.themes));
    assert(category.cefrRange.every(level => ['B1', 'B2', 'C1'].includes(level)));
  }
  assert.equal(sum(candidate.categories.map(category => category.target)), candidate.inventory.target);
  for (const index of [0, 1]) {
    assert.equal(sum(candidate.categories.map(category => category.targetRange[index]!)), candidate.inventory.targetRange[index]);
  }
  for (const stage of ['b1', 'b2', 'bridge', 'c1'] as const) {
    assert.equal(sum(candidate.categories.map(category => category.stageTargets[stage])), candidate.inventory.stageTargets[stage]);
  }
  for (const layer of candidate.layers) {
    assert.equal(layer.addsToInventory, false);
    assert(layer.target > 0 && unique(layer.themes));
    layer.prerequisites.forEach(id => assert(byId.has(id), `Unknown layer dependency ${id}`));
  }
  assert.equal(candidate.starter.packId, seed.packId);
  assert.equal(candidate.starter.packVersion, seed.packVersion);
  assert.equal(candidate.starter.blockId, seed.blocks[0]!.id);
  assert.equal(candidate.starter.categoryId, 'verb-constructions');
  assert.equal(candidate.starter.cefrRetained, null);
  assert.deepEqual(candidate.starter.entryIds, seed.entries.map(entry => entry.id));
  assert(seed.entries.every(entry => entry.cefr === null));
  assert.equal(candidate.starter.questionCount, seed.questions.length);
  assert.equal(candidate.starter.questionCount, 40);
  assert.equal(seed.blocks[0]!.questionIds.length, 40);
  assert(unique(seed.blocks[0]!.questionIds));
  assert.deepEqual(new Set(seed.blocks[0]!.questionIds), new Set(seed.questions.map(question => question.id)));
  assert(unique(candidate.firstBatches.map(batch => batch.id)));
  for (const batch of candidate.firstBatches) {
    const counts = Object.entries(batch.counts).filter((entry): entry is [string, number] => entry[1] !== undefined);
    assert.equal(sum(counts.map(([, count]) => count)), batch.newItems);
    assert(batch.newItems >= 100 && batch.newItems <= 200);
    for (const [id, count] of counts) {
      assert(byId.has(id), `Unknown batch category ${id}`);
      assert(Number.isInteger(count) && count > 0 && count <= byId.get(id)!.target);
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const candidate = JSON.parse(readFileSync(new URL('../content/curriculum-map.json', import.meta.url), 'utf8')) as CurriculumMap;
  validateCurriculumMap(candidate);
  console.log('Curriculum plan valid: nine categories, two layers, 2,660 target records; Starter unchanged.');
}
