import { validateAnyContent, validateCatalog } from '../domain/content/catalog';
import { validateContent } from '../domain/content/validate';
import type { ContentPack } from '../domain/content/types';

export async function loadContent(signal?: AbortSignal): Promise<ContentPack> {
  const response = await fetch(`${import.meta.env.BASE_URL}content/seed-pack.json`, signal ? { signal } : {});
  if (!response.ok) throw new Error(`Content could not be loaded (HTTP ${response.status}).`);
  return validateContent(await response.json());
}

/** Local, fixed catalog: no runtime-generated curriculum or remote dependency. */
export async function loadCatalog(signal?: AbortSignal): Promise<import('../domain/content/types').AnyContentPack[]> {
  const packs = await Promise.all(['seed-pack.json', 'verb-forms-pilot.json'].map(async file => {
    const response = await fetch(`${import.meta.env.BASE_URL}content/${file}`, signal ? { signal } : {});
    if (!response.ok) throw new Error(`Content could not be loaded (${file}, HTTP ${response.status}).`);
    return validateAnyContent(await response.json());
  }));
  return validateCatalog(packs);
}
