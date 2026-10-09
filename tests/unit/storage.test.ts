import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import seed from '../../content/seed-pack.json';
import { validateContent } from '../../src/domain/content/validate';
import { createSession, currentQuestion, transition } from '../../src/domain/practice/session';
import { IndexedDbRepository } from '../../src/storage/indexedDb';
import { emptyData } from '../../src/storage/types';

const pack = validateContent(seed);
const at = '2026-10-10T12:00:00.000Z';
describe('version 1 transactional local repository', () => {
  it('saves exact drafts, order, assistance, feedback and completed evidence across connections', async () => {
    const repo = new IndexedDbRepository();
    const initial = await repo.read();
    let session = createSession(pack, pack.blocks[0]!.id, { random: () => .99, id: () => 'storage-session', now: () => at }, { size: 10 });
    const id = currentQuestion(session).id;
    session = transition(session, { type: 'response', questionId: id, response: { kind: 'text', value: 'auf' } });
    session = transition(session, { type: 'hint', questionId: id });
    let saved = await repo.save({ ...emptyData(), currentId: session.sessionId, sessions: [session] }, initial.revision);
    expect((await new IndexedDbRepository().read()).sessions[0]).toEqual(session);
    session = transition(session, { type: 'submit', questionId: id, attemptId: 'storage-attempt', submittedAt: at });
    saved = await repo.save({ ...saved, sessions: [session] }, saved.revision);
    expect((await repo.read()).sessions[0]).toEqual(session);
    expect(saved.sessions[0]!.attempts).toHaveLength(1);
  });
  it('rejects a stale tab without losing committed progress', async () => {
    const repo = new IndexedDbRepository(); const before = await repo.read();
    await repo.save({ ...before, settings: { theme: 'finance-dashboard', sessionSize: 10 } }, before.revision);
    await expect(repo.save({ ...before, settings: { theme: 'lingua-learning', sessionSize: 20 } }, before.revision)).rejects.toThrow('Another tab');
    expect((await repo.read()).settings.theme).toBe('finance-dashboard');
  });
  it('rolls back all stores if the unique first-answer constraint fails', async () => {
    const repo = new IndexedDbRepository(); const before = await repo.read();
    const session = before.sessions[0]!; const attempt = session.attempts[0]!;
    const bad = { ...before, sessions: [{ ...session, attempts: [...session.attempts, { ...attempt, attemptId: 'duplicate-qid' }] }] };
    await expect(repo.save(bad, before.revision)).rejects.toThrow();
    expect(await repo.read()).toEqual(before);
  });
});
