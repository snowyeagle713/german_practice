# Production offline boundary
The build emits `sw.js` with a deterministic cache version, exact asset list and
SHA-256 digests for HTML, JS, CSS, authored content, manifest and local PNG icons.
Install/repair verifies every response before caching; readiness checks stored bytes
and a controlling worker, not merely navigator.onLine. No worker is used in Vite dev.
Navigation tries the network then falls back to cached HTML; versioned app/content
assets come from the verified cache. IndexedDB is independent of asset caches.
A waiting update never calls skipWaiting automatically. Every open app tab must
answer that no run/save/error is active before explicit activation. Silent or stale
tabs defer activation. Safe controller changes reload; only old asset caches are
removed. Closed runs resume from their content snapshots after an update.
Use a stable HTTPS or localhost origin and browser profile. The app cannot launch
offline until a successful online production visit and confirmed readiness.
Production Playwright flows cover network-disabled new pages, exact resume,
Learn/revision/history/theme, missing-cache recovery and multi-tab update deferral.
