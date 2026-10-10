/** The v2 UI must not save new snapshots while an older offline bootstrap controls it. */
export function supportsV2Runtime(message: unknown): boolean {
  return Boolean(message && typeof message === 'object' && 'runtimeVersion' in message && message.runtimeVersion === 2);
}
