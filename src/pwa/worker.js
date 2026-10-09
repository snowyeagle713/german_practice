/* Replaced deterministically by the build plugin. No database deletion/migration here. */
const CACHE = __CACHE_NAME__;
const ASSETS = __ASSET_LIST__.map(path => new URL(path, self.registration.scope).href);
const DIGESTS = Object.fromEntries(Object.entries(__HASH_MAP__).map(([path, hash]) => [new URL(path, self.registration.scope).href, hash]));
async function valid(response, url) {
  if (!response?.ok) return false;
  const digest = await crypto.subtle.digest('SHA-256', await response.clone().arrayBuffer());
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('') === DIGESTS[url];
}
async function prepare() {
  const responses = await Promise.all(ASSETS.map(async url => {
    const response = await fetch(url, { cache: 'no-store' });
    if (!await valid(response, url)) throw new Error('Required offline asset is missing or belongs to a different build.');
    return response;
  }));
  const cache = await caches.open(CACHE);
  await Promise.all(ASSETS.map((url, index) => cache.put(url, responses[index])));
}
self.addEventListener('install', event => { event.waitUntil(prepare()); });
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) if (name.startsWith('german-trainer-assets-') && name !== CACHE) await caches.delete(name);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => {
      const fallback = await (await caches.open(CACHE)).match(new URL('index.html', self.registration.scope).href);
      return fallback ?? Response.error();
    }));
  } else {
    const url = new URL(request.url); url.search = ''; url.hash = '';
    if (ASSETS.includes(url.href)) event.respondWith(caches.open(CACHE).then(async cache => await cache.match(url.href) ?? fetch(request)));
  }
});
self.addEventListener('message', event => {
  if (event.data?.type === 'READINESS') event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const ready = (await Promise.all(ASSETS.map(asset => cache.match(asset).then(response => valid(response, asset))))).every(Boolean);
    event.ports[0]?.postMessage({ ready, cache: CACHE, count: ASSETS.length });
  })());
  if (event.data?.type === 'PREPARE_CACHE') event.waitUntil(prepare().then(() => event.ports[0]?.postMessage({ ok: true })).catch(() => event.ports[0]?.postMessage({ ok: false })));
  if (event.data?.type === 'ACTIVATE_UPDATE') event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const votes = await Promise.all(clients.map(client => new Promise(resolve => {
      const channel = new MessageChannel();
      const timeout = setTimeout(() => { channel.port1.close(); resolve(false); }, 3000);
      channel.port1.onmessage = answer => { clearTimeout(timeout); channel.port1.close(); resolve(answer.data?.safe === true); };
      client.postMessage({ type: 'CHECK_UPDATE' }, [channel.port2]);
    })));
    if (votes.length && votes.every(Boolean)) await self.skipWaiting();
    else event.source?.postMessage({ type: 'UPDATE_BLOCKED' });
  })());
});
