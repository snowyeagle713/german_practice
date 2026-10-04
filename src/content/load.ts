import { validateContent } from '../domain/content/validate';
import type { ContentPack } from '../domain/content/types';

export async function loadContent(signal?: AbortSignal): Promise<ContentPack> {
  const response = await fetch(`${import.meta.env.BASE_URL}content/seed-pack.json`, signal ? { signal } : {});
  if (!response.ok) throw new Error(`Content could not be loaded (HTTP ${response.status}).`);
  return validateContent(await response.json());
}
