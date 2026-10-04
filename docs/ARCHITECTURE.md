# Architecture
## Chosen stack
TypeScript strict + React + Vite, static built PWA, IndexedDB. This choice follows the cross-device/offline goal; modularity comes from boundaries, not the language alone. Use plain CSS and React state. Use Vitest for pure logic; Playwright for available browser flows. Dependency versions are selected and locked during implementation.

## Platform boundaries
Windows is the current acceptance target; keep the same browser application portable to Linux and later mobile. Avoid Windows-only paths, shell syntax in npm scripts, registry access, OS-specific storage and required native modules. Use browser file selection for backups. Do not create separate platform implementations or desktop wrappers. Current viewport gates are 768, 1280 and 1920 px; mobile-specific layout and installation work is deferred.

## Target modules
| Folder | Responsibility |
|---|---|
| src/domain/content | Types, runtime validation and lookup; no UI/database |
| src/domain/practice | Session state machine, Fisher–Yates shuffle, grading, revision selection |
| src/domain/progress | Attempt records and derived statistics |
| src/storage | IndexedDB implementation, schema migration, backup validation/import/export |
| src/ui | Dashboard, blocks, learn, practice, summary and settings |
| src/pwa | Manifest/cache/update integration and readiness state |
| content | Authored versioned packs and schema |
| tools | Optional Python content validation/conversion |
| tests | Domain, persistence and browser acceptance tests |

## Dependency boundaries
UI calls application operations; operations use pure domain functions and a storage interface. The storage implementation depends on browser APIs. Pure domain modules do not import React, IndexedDB, window or networking.
Content is immutable for a particular packVersion. Copy seed-pack.json into built assets with a deterministic build step; do not duplicate its authoring source.

## State and storage
Database name german-trainer, schema version 1.
- sessions: sessionId key; immutable content snapshot, question order, mode, status, current index, feedback and answer IDs.
- attempts: attemptId key, unique sessionId+questionId first submission, result/assistance/time; retain revision attempts in their separate revision session.
- settings: key/value settings.
- metadata: database/backup/content version information.

One transaction saves an answer, updated session and relevant metadata. Advance/reload derives from persisted state; do not mutate UI optimistically as though saved if a write fails. Save the initial session before showing the first question. Transactions finish before showing a successful import or save.

Session lifecycle: created -> answering -> feedback -> answering (next question) -> completed. Pause is an active session retained for resume. Abandon explicitly ends that session without claiming completion. Only one active session for V1.
A run snapshots the referenced entry/question content, so content changes cannot make an old question unanswerable. Existing progress remains keyed to stable IDs. Removed IDs stay in history, excluded from current-pack aggregate counts and labelled archived.

## Future expansion
Add new content kinds and supported question variants through typed discriminated unions and explicit validators. Noun data need article/plural fields, not verb fields copied under another label. Add optional services outside the domain core only when needed. No empty LLM, sync or account integrations in V1.

## Backups and migrations
Backup schemaVersion is separate from IndexedDB version and packVersion. Reject unsupported newer backup schemas with a clear message. Use additive, tested migrations before releasing a new database version. Export settings, sessions (including snapshots) and attempts; import replaces progress only after validation and user confirmation. Unrecognized historic IDs are retained as archived, never silently remapped to an unrelated question.

## PWA
Precache built assets and current content. Use manifest icons produced locally; no remote asset dependency. Cache readiness requires a controlling worker and the required precache completion, not navigator.onLine alone.
Defer update activation/reload during active sessions. When safe, show Update available and allow reload. Keep progress in IndexedDB; do not wipe it when clearing old asset caches. Test after installation/worker activation against production output, not the dev server.

