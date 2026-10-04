export function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) throw new Error('Random source must return a value in [0, 1).');
    const j = Math.floor(value * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}
