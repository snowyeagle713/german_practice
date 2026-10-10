import { describe, expect, it } from 'vitest';
import map from '../../content/curriculum-map.json';
import { validateCurriculumMap } from '../../scripts/validate-curriculum-map';

describe('authoring curriculum map', () => {
  it('validates targets, dependencies and existing Starter membership', () => {
    expect(() => validateCurriculumMap(map)).not.toThrow();
  });
  it('rejects runtime enablement and changes to normal session size', () => {
    const copy = structuredClone(map);
    copy.runtimeEnabled = true;
    expect(() => validateCurriculumMap(copy)).toThrow();
    copy.runtimeEnabled = false;
    copy.blockPolicy.normalSessionSizes = [10, 40];
    expect(() => validateCurriculumMap(copy)).toThrow();
  });
  it('rejects inconsistent category and stage budgets', () => {
    const copy = structuredClone(map);
    copy.categories[0]!.stageTargets.b1 += 1;
    expect(() => validateCurriculumMap(copy)).toThrow();
  });
  it('rejects unknown dependencies and prerequisite cycles', () => {
    const copy = structuredClone(map);
    copy.categories[0]!.prerequisites = ['unknown'];
    expect(() => validateCurriculumMap(copy)).toThrow(/Unknown dependency/);
    copy.categories[0]!.prerequisites = ['verb-constructions'];
    expect(() => validateCurriculumMap(copy)).toThrow(/Dependency cycle/);
  });
  it('rejects duplicate categories, altered Starter identities and oversized batches', () => {
    const duplicate = structuredClone(map);
    duplicate.categories[1]!.id = duplicate.categories[0]!.id;
    expect(() => validateCurriculumMap(duplicate)).toThrow();
    const starter = structuredClone(map);
    starter.starter.entryIds[0] = 'replacement-id';
    expect(() => validateCurriculumMap(starter)).toThrow();
    const batch = structuredClone(map);
    batch.firstBatches[0]!.newItems = 1000;
    expect(() => validateCurriculumMap(batch)).toThrow();
  });
});
