import { useEffect, useRef, useState } from 'react';
import type { ContentPack } from '../domain/content/types';
import { createSession, isActive, transition } from '../domain/practice/session';
import type { PracticeCommand } from '../domain/practice/types';
import { IndexedDbRepository } from '../storage/indexedDb';
import { emptyData, type LocalData, type Settings } from '../storage/types';

export function useTrainer() {
  const repository = useRef(new IndexedDbRepository());
  const current = useRef(emptyData());
  const loaded = useRef(false);
  const pending = useRef(0);
  const queue = useRef(Promise.resolve());
  const failedDraft = useRef(false);
  const failed = useRef<((data: LocalData) => LocalData) | null>(null);
  const [data, setData] = useState(current.current);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { let alive = true;
    void repository.current.read().then(value => { if (alive) { current.current = value; loaded.current = true; setData(value); setReady(true); } }).catch((cause: unknown) => { if (alive) setError(String(cause)); });
    return () => { alive = false; };
  }, []);
  function operate(operation: (value: LocalData) => LocalData, draft = false) {
    pending.current++;
    queue.current = queue.current.then(async () => {
      if (failed.current) { if (draft && failedDraft.current) failed.current = operation; pending.current--; return; }
      setBusy(true);
      try {
        const next = operation(current.current);
        if (next !== current.current) {
          const saved = await repository.current.save(next, current.current.revision);
          current.current = saved; setData(saved);
        }
        setError(null);
      } catch (cause: unknown) { failed.current = operation; failedDraft.current = draft; setError(cause instanceof Error ? cause.message : 'Local save failed.'); }
      finally { pending.current--; setBusy(false); }
    });
  }
  return {
    data, ready, error, busy,
    canUpdate: () => loaded.current && pending.current === 0 && !failed.current && !current.current.sessions.some(isActive),
    session: data.sessions.find(item => item.sessionId === data.currentId) ?? null,
    start: (pack: ContentPack, blockId: string, replace = false, questionIds?: string[]) => operate(value => {
      const active = value.sessions.find(isActive);
      if (active && !replace) return value;
      const session = createSession(pack, blockId, { random: Math.random, now: () => new Date().toISOString(), id: () => crypto.randomUUID() }, {
        size: value.settings.sessionSize, cursor: Object.hasOwn(value.cursors, blockId) ? value.cursors[blockId]! : 0, ...(questionIds ? { questionIds } : {}),
      });
      return { ...value, currentId: session.sessionId, cursors: questionIds ? value.cursors : { ...value.cursors, [blockId]: session.rotationNext },
        sessions: [...value.sessions.map(item => isActive(item) ? { ...item, status: 'abandoned' as const } : item), session] };
    }),
    send: (command: PracticeCommand) => operate(value => {
      const session = value.sessions.find(item => item.sessionId === value.currentId);
      if (!session) return value;
      const next = transition(session, command);
      return next === session ? value : { ...value, sessions: value.sessions.map(item => item === session ? next : item) };
    }, command.type === 'response'),
    abandon: () => operate(value => ({ ...value, currentId: null, sessions: value.sessions.map(item => item.sessionId === value.currentId && isActive(item) ? { ...item, status: 'abandoned' as const } : item) })),
    settings: (settings: Settings) => operate(value => ({ ...value, settings })),
    view: (id: string) => operate(value => ({ ...value, currentId: id })),
    replace: (replacement: LocalData) => operate(value => ({ ...replacement, revision: value.revision })),
    retry: () => {
      if (!ready) { window.location.reload(); return; }
      const operation = failed.current; const draft = failedDraft.current; failed.current = null;
      if (operation) operate(operation, draft);
    },
  };
}
