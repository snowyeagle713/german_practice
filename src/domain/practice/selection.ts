/** A stable cursor rotates the larger pool; order is shuffled separately once. */
export function selectQuestions(pool: readonly string[], size: 10 | 20, cursor: number): string[] {
  if (pool.length < size || !Number.isSafeInteger(cursor) || cursor < 0) throw new Error('Invalid pool or rotation cursor.');
  return Array.from({ length: size }, (_, offset) => pool[(cursor % pool.length + offset) % pool.length]!);
}
