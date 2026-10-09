import { useEffect, useRef, useState } from 'react';
import type { ContentPack } from '../domain/content/types';
import { createSession, isActive, transition } from '../domain/practice/session';
import type { PracticeCommand } from '../domain/practice/types';
import { IndexedDbRepository } from '../storage/indexedDb';
import { emptyData, type LocalData, type Settings } from '../storage/types';

export function useTrainer() {
  const repository = useRef(new IndexedDbRepository());
  const current = useRef(emptyData());
  const queue = useRef(Promise.resolve());
  const failed = useRef<((data: LocalData) => LocalData) | null>(null);
  const [data, setData] = useState(current.current);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { let alive = true;
    void repository.current.read().then(value => { if (alive) { current.current = value; setData(value); setReady(true); } }).catch((cause: unknown) => { if (alive) setError(String(cause)); });
    return () => { alive = false; };
  }, []);
  function operate(operation: (value: LocalData) => LocalData) {
    queue.current = queue.current.then(async () => {
      if (failed.current) return;
      setBusy(true);
      try {
        const next = operation(current.current);
        if (next !== current.current) {
          const saved = await repository.current.save(next, current.current.revision);
          current.current = saved; setData(saved);
        }
        setError(null);
      } catch (cause: unknown) { failed.current = operation; setError(cause instanceof Error ? cause.message : 'Local save failed.'); }
      finally { setBusy(false); }
    });
  }
  return {
    data, ready, error, busy,
    session: data.sessions.find(item => item.sessionId === data.currentId) ?? null,
    start: (pack: ContentPack, blockId: string, replace = false, questionIds?: string[]) => operate(value => {
      const active = value.sessions.find(isActive);
      if (active && !replace) return value;
      const session = createSession(pack, blockId, { random: Math.random, now: () => new Date().toISOString(), id: () => crypto.randomUUID() }, {
        size: value.settings.sessionSize, cursor: value.cursors[blockId] ?? 0, ...(questionIds ? { questionIds } : {}),
      });
      return { ...value, currentId: session.sessionId, cursors: questionIds ? value.cursors : { ...value.cursors, [blockId]: session.rotationNext },
        sessions: [...value.sessions.map(item => isActive(item) ? { ...item, status: 'abandoned' as const } : item), session] };
    }),
    send: (command: PracticeCommand) => operate(value => {
      const session = value.sessions.find(item => item.sessionId === value.currentId);
      if (!session) return value;
      const next = transition(session, command);
      return next === session ? value : { ...value, sessions: value.sessions.map(item => item === session ? next : item) };
    }),
    settings: (settings: Settings) => operate(value => ({ ...value, settings })),
    view: (id: string) => operate(value => ({ ...value, currentId: id })),
    replace: (replacement: LocalData) => operate(value => ({ ...replacement, revision: value.revision })),
    retry: () => {
      if (!ready) { window.location.reload(); return; }
      const operation = failed.current; failed.current = null;
      if (operation) operate(operation);
    },
  };
}
