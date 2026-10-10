import { expect, it } from 'vitest';
import { supportsV2Runtime } from '../../src/pwa/compatibility';

it('never treats an older worker cache as a v2-compatible offline bootstrap', () => {
  for (const value of [null, {}, { ready: true }, { runtimeVersion: 1, ready: true }, { runtimeVersion: 3 }]) expect(supportsV2Runtime(value)).toBe(false);
  expect(supportsV2Runtime({ runtimeVersion: 2, ready: true })).toBe(true);
  expect(supportsV2Runtime({ runtimeVersion: 2, ready: false })).toBe(true);
});
