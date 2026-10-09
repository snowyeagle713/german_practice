import { useEffect, useRef, useState } from 'react';
export function usePwa(safe: () => boolean) {
  const safeRef = useRef(safe); safeRef.current = safe;
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState(import.meta.env.PROD ? 'Preparing offline files…' : 'Offline installation requires a production build.');
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [online, setOnline] = useState(navigator.onLine);
  const [cacheVersion, setCacheVersion] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const network = () => setOnline(navigator.onLine);
    window.addEventListener('online', network); window.addEventListener('offline', network);
    return () => { window.removeEventListener('online', network); window.removeEventListener('offline', network); };
  }, []);
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (!('serviceWorker' in navigator) || !window.isSecureContext) { setMessage('Offline installation needs HTTPS or localhost and service-worker support.'); return; }
    let alive = true, hadController = Boolean(navigator.serviceWorker.controller);
    let releaseRegistration = () => {};
    const timers = new Set<ReturnType<typeof setTimeout>>();
    async function check() {
      const controller = navigator.serviceWorker.controller; if (!controller || !alive) return;
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); if (alive) setMessage('Offline cache could not be verified. Try preparing it again.'); }, 5000); timers.add(timer);
      channel.port1.onmessage = event => {
        clearTimeout(timer); channel.port1.close();
        if (alive) { setReady(event.data?.ready === true); setCacheVersion(String(event.data?.cache ?? '')); setMessage(event.data?.ready ? `Offline ready · ${event.data.count} required files cached` : 'Offline files are incomplete. Prepare them again while online.'); }
      };
      controller.postMessage({ type: 'READINESS' }, [channel.port2]);
    }
    const changed = () => {
      if (hadController && safeRef.current()) { window.location.reload(); return; }
      hadController = true; void check();
    };
    const message = (event: MessageEvent) => {
      if (event.data?.type === 'CHECK_UPDATE') event.ports[0]?.postMessage({ safe: safeRef.current() });
      if (event.data?.type === 'UPDATE_BLOCKED' && alive) setMessage('Update deferred: finish or abandon active runs and wait for saves in every app tab.');
    };
    navigator.serviceWorker.addEventListener('controllerchange', changed);
    navigator.serviceWorker.addEventListener('message', message);
    void check();
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL, updateViaCache: 'none' }).then(reg => {
      if (!alive) return;
      setRegistration(reg); setWaiting(reg.waiting);
      const updateFound = () => {
        const worker = reg.installing;
        worker?.addEventListener('statechange', () => {
          if (alive && worker.state === 'installed' && reg.waiting) setWaiting(reg.waiting);
          if (alive && worker.state === 'redundant') setMessage('Offline preparation failed. Retry while the server is available.');
        });
      };
      reg.addEventListener('updatefound', updateFound);
      releaseRegistration = () => reg.removeEventListener('updatefound', updateFound);
      void check();
    }).catch((cause: unknown) => { if (navigator.serviceWorker.controller) void check(); else if (alive) setMessage(`Offline preparation failed: ${String(cause)}`); });
    return () => { alive = false; releaseRegistration(); for (const timer of timers) clearTimeout(timer); navigator.serviceWorker.removeEventListener('controllerchange', changed); navigator.serviceWorker.removeEventListener('message', message); };
  }, [retry]);
  return { ready, message, waiting: Boolean(waiting), online, cacheVersion,
    prepare: () => {
      const controller = navigator.serviceWorker?.controller;
      if (!controller) { setRetry(value => value + 1); return; }
      const channel = new MessageChannel();
      channel.port1.onmessage = event => { channel.port1.close(); if (event.data?.ok) setRetry(value => value + 1); else setMessage('Offline preparation failed. Check for an app update while online.'); };
      controller.postMessage({ type: 'PREPARE_CACHE' }, [channel.port2]);
    },
    update: () => { if (safeRef.current()) waiting?.postMessage({ type: 'ACTIVATE_UPDATE' }); },
    checkUpdate: () => { void registration?.update().catch(() => setMessage('Could not check for updates. Try again while online.')); },
  };
}
