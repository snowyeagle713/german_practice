# Autonomous MVP completion handoff

Historical checkpoint record (`ac2329c`). Later polish/publication and current
verification results are in RELEASE_READINESS.md and WINDOWS_MVP.md; the original
test counts and publication statement below describe this checkpoint only.

Development branch: `mvp/completion`, based on `eb782ec` (Stage 2). Main and existing
Stage 1/1.5/2 history are preserved. No deployment, merge, force-push or publication
was performed. The new autonomous MVP request explicitly supersedes the historical
40-question/forward-only model; starter docs/content/schema/tools remain intact.

## Behaviour and architecture

- React/strict TypeScript/Vite and the Lingua sidebar/dashboard structure remain.
- Authored pool: 10 constructions / 40 questions, byte-for-byte unchanged. Quick 10,
  Standard 20 default, unique selection then Fisher–Yates shuffle. A saved per-block
  cursor rotates through the complete pool over repeated sessions. No 40-run mode.
- Four communicative themes group Learn, revision and progress. Preposition, case,
  examples and authored metadata remain available; no inferred CEFR classifications.
- Pure practice transitions retain stable order, drafts, assistance, graded feedback
  and deferred questions. Previous revisits immutable first answers; unanswered
  Skip returns before completion. One question and one primary check/next action.
- Authored preposition cloze, case choice and meaning choice are supported. Text
  normalization is NFC, trim, whitespace collapse and lowercase; ß/diacritics are
  preserved. No fuzzy/LLM grading. Hint/reveal excludes an answer from unaided credit.
- Correct/wrong/assisted counts and unaided percentage are derived from immutable
  evidence. Assisted may overlap correct or wrong; counts are not summed as a score.
- `src/application/useTrainer.ts` serializes domain operations behind `Repository`.
  Answer fields respond immediately; grades/navigation/success publish after commit.
  Failed transactions block advancement and retain a retryable action. Stale tabs
  must reload instead of overwriting the winning revision.
- `src/domain/practice/revision.ts` derives pending revision from persisted attempts.
  Wrong/assisted attempts add an item; only unaided correct revision removes it.
  Original runs/scores never change. Saved historic snapshots support archived review.
  Revision batches are 1–20 from one pack/version/block; remaining items stay pending.
- `src/domain/progress/metrics.ts` derives real history and current-content coverage.
  Completed first-pass runs contribute latest question evidence; revision scores are
  separate. Coverage and unaided performance are not advertised as mastery.
- Lingua/Finance use one component tree and semantic CSS tokens. Settings persists
  palette and preferred new-run length. Additional palettes need a full token map,
  registry/validated preference enum update, and contrast checks, not a redesign.
- `scripts/pwa-plugin.ts` emits deterministic worker/cache metadata. Seven required
  files (HTML/JS/CSS/seed/manifest/icons) are SHA-256 checked before precaching and
  when verifying readiness. No worker in dev. Navigation falls back to cached HTML.
  Explicit updates require safe votes from every open tab, retain IndexedDB and
  remove only old app asset caches. First online production visit is required.

## Persistence / backup contract

Database `german-trainer`, IndexedDB schema 1:

| Store | Contents |
|---|---|
| sessions | sessionId key; selected snapshot, mode/size, order/choice order, current drafts/feedback, deferred IDs, states, status/timestamps and embedded first attempts |
| attempts | attemptId key; unique sessionId + questionId index; immutable grading/assistance/revision evidence |
| settings | preferences: theme and new-run sessionSize |
| metadata | schemaVersion, optimistic revision counter, currentId and rotation cursors |

Every save/replacement is one transaction over all stores; initial sessions commit
before question 1 appears. The V1 adapter rewrites the small local aggregate for
simple atomicity. It is suitable for this seed MVP; incremental writes can be added
behind the interface if long history performance requires them. Scores, revision
and progress are recomputed from persisted evidence, avoiding conflicting counters.
No unimplemented migration is claimed; future schema versions require tested upgrade
paths. Cache updates have no database migration/delete code.

Backup v1: appId, schemaVersion, exportedAt, contentVersions, preferences, cursors,
currentId, sessions/snapshots and attempts. AJV shape checks plus semantic invariants
validate sizes/enums/uniqueness/relationships/order/state/grading/feedback/timestamps.
Historic IDs are validated against their own snapshots, not today's content. Limit:
10 MiB UTF-8. Preview/cancel and explicit replacement only; no merge. Atomic rollback
keeps the prior data when saving/restoring fails. Nothing is evaluated or rendered
as HTML from content/backups.

## Verification

Final result: 146 unit tests / 6 files and all 32 production browser checks passed.
Content validation, strict typecheck, production build and git diff --check passed.
All 19 protected starter/spec/content/tools files are unchanged.
See MVP_CHECKLIST.md for milestone commits and acceptance evidence. Final commands:

```text
npm run validate:content
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Linux used Node 24.19.0/npm 11.9.0 and system Chromium through Playwright. Unit tests
cover membership/rotation, immutable transitions, grading/assistance, deferred
completion, revision, metrics, backup invariants and IndexedDB rollback/conflicts.
Production browser checks cover navigation/keyboard/desktop sizes/contrast, full
20/10 runs, rotation through all 40 across reloads, exact resume, write retry, stale
tabs, revision/history/theme, backup cancellation/rejection/replacement, cache
readiness/repair and offline new launches. The update test uses a controlled local
origin, defers during active/stale tabs, activates safely, preserves original scores,
stops that origin and launches a new page with network disabled.

Windows Edge device checks remain manual: install menu, Start/taskbar launch,
close/reopen of the installed app, device keyboard/display/profile/storage policies.
Instructions and the unchecked release checklist are in WINDOWS_MVP.md. No claim
of Windows or mobile device verification is made from Linux browser automation.

## Deliberate limits / deferred improvements

No backend/accounts/sync/cloud runtime, native app/installer, mobile-specific polish,
LLM/fuzzy grader, generated content, SRS scheduling, adaptive selection, nouns,
grammar blocks, audio or conversation. No JetBrains/Proton/dark palette yet.
Local browser storage can be cleared/evicted by the browser; export backups. Settings
cannot merge backups. History shows the latest 20 runs; backups retain all history.
An unresponsive/stale open tab defers updates until it reloads or closes. Built app
hosting expects a stable root origin; no external deployment was requested.
