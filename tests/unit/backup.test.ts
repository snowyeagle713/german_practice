import { themeIds } from '../../src/domain/palettes';
import { palettes } from '../../src/ui/theme/palettes';
import { describe, expect, it } from 'vitest';
import seed from '../../content/seed-pack.json';
import { validateContent } from '../../src/domain/content/validate';
import { createSession, currentQuestion, transition } from '../../src/domain/practice/session';
import { backupData, makeBackup, parseBackup, validateBackup, MAX_BACKUP_BYTES } from '../../src/storage/backup';
import { emptyData } from '../../src/storage/types';
const pack = validateContent(seed); const at = '2026-10-10T12:00:00.000Z';
function fixture() {
  let session = createSession(pack, pack.blocks[0]!.id, { random: () => .99, now: () => at, id: () => 'backup-session' }, { size: 10 });
  const id = currentQuestion(session).id;
  session = transition(session, { type: 'response', questionId: id, response: { kind: 'text', value: 'auf' } });
  session = transition(session, { type: 'hint', questionId: id });
  session = transition(session, { type: 'submit', questionId: id, attemptId: 'backup-answer', submittedAt: at });
  session = transition(session, { type: 'next', questionId: id, at });
  const data = { ...emptyData(), currentId: session.sessionId, sessions: [session] };
  return makeBackup(data, at);
}
describe('portable validated backup v1', () => {
  it('round-trips paused feedback/drafts, revision evidence and settings', () => {
    const value = fixture(); expect(parseBackup(JSON.stringify(value))).toEqual(value);
    expect(backupData(value).sessions).toEqual(value.sessions);
    expect(validateBackup(makeBackup(emptyData(), at)).sessions).toEqual([]);
  });
  it.each([
    ['unsupported schema', (v: ReturnType<typeof fixture>) => { v.schemaVersion = 2 as 1; }],
    ['wrong app', (v: ReturnType<typeof fixture>) => { v.appId = 'other' as 'german-trainer'; }],
    ['out-of-bounds index', (v: ReturnType<typeof fixture>) => { v.sessions[0]!.currentIndex = 10; }],
    ['40 question mode', (v: ReturnType<typeof fixture>) => { v.sessions[0]!.sessionSize = 40; }],
    ['duplicate membership', (v: ReturnType<typeof fixture>) => { v.sessions[0]!.order[1] = v.sessions[0]!.order[0]!; }],
    ['unknown membership', (v: ReturnType<typeof fixture>) => { v.sessions[0]!.order[1] = 'missing'; }],
    ['dangling current run', (v: ReturnType<typeof fixture>) => { v.currentId = 'missing'; }],
    ['unsupported theme', (v: ReturnType<typeof fixture>) => { v.settings.theme = 'unknown' as 'lingua-learning'; }],
    ['duplicate session', (v: ReturnType<typeof fixture>) => { v.sessions.push(structuredClone(v.sessions[0]!)); }],
    ['orphan answer', (v: ReturnType<typeof fixture>) => { v.attempts[0]!.sessionId = 'missing'; }],
    ['fake score', (v: ReturnType<typeof fixture>) => { v.sessions[0]!.attempts[0]!.isUnaidedCorrect = true; }],
    ['changed feedback', (v: ReturnType<typeof fixture>) => { Object.values(v.sessions[0]!.states)[0]!.feedback!.correctAnswer = 'invented'; }],
    ['graded deferred', (v: ReturnType<typeof fixture>) => { v.sessions[0]!.deferredIds = [v.sessions[0]!.attempts[0]!.questionId]; }],
    ['early completion', (v: ReturnType<typeof fixture>) => { v.sessions[0]!.status = 'completed'; v.sessions[0]!.completedAt = at; }],
    ['invalid timestamp', (v: ReturnType<typeof fixture>) => { v.exportedAt = 'yesterday'; }],
    ['invalid choice order', (v: ReturnType<typeof fixture>) => { Object.values(v.sessions[0]!.choiceOrders)[0]!.push('fake'); }],
  ])('rejects %s before replacement', (_label, change) => {
    const value = fixture(); change(value); expect(() => validateBackup(value)).toThrow();
  });
  it('accepts archived question IDs against their snapshots, independent of current content', () => {
    const value = fixture();
    const ids = new Set(value.sessions[0]!.order);
    // Rewrite stable IDs and keyed state consistently, retaining authored text.
    function rename(item: unknown): unknown {
      if (typeof item === 'string') return ids.has(item) ? `archived-${item}` : item;
      if (Array.isArray(item)) return item.map(rename);
      if (item && typeof item === 'object') return Object.fromEntries(Object.entries(item).map(([key, value]) => [ids.has(key) ? `archived-${key}` : key, rename(value)]));
      return item;
    }
    expect(() => validateBackup(rename(value))).not.toThrow();
  });
  it('rejects malformed JSON and enforces byte bound (not character count)', () => {
    expect(() => parseBackup('{')).toThrow('valid JSON');
    expect(() => parseBackup('ü'.repeat(MAX_BACKUP_BYTES / 2 + 1))).toThrow('10 MiB');
  });
});

it.each(themeIds)('round-trips the registered %s palette in portable backups', theme => {
  expect(palettes.map(item => item.id)).toContain(theme);
  const data = emptyData(); data.settings.theme = theme;
  expect(parseBackup(JSON.stringify(makeBackup(data, at))).settings.theme).toBe(theme);
});
