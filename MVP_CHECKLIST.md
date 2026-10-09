# Autonomous MVP completion checklist

Baseline: eb782ec (Stage 2), verified against live origin/main on 9 October 2026 UTC.
Development branch: mvp/completion. Do not merge or force-push main.

## Initial audit

| Area | State | Evidence |
|---|---|---|
| Learn, authored content, runtime validation | Complete | 10 constructions / 40 questions, preserved seed |
| Lingua shell and semantic palettes | Complete | Default Lingua; internal Finance token map |
| Grading, assistance, immutable first submissions | Complete | Pure practice engine; baseline tests pass |
| Session navigation/summary | Partial | Forward-only 40-question run; in-memory summary |
| Revision | Partial | Candidate IDs only, no revision runs |
| Storage/resume/history | Missing | storage boundary README only |
| Progress and theme Settings | Missing | placeholders / no persisted switcher |
| Backup and PWA | Missing | no backup validation or service worker |
| New practice model | Requires correction | Original brief requires full 40 pool; new request explicitly supersedes with rotating 10/20 sessions |

Baseline checks: 117 unit tests, strict typecheck and production build passed.
Original starter docs are retained as historical requirements. This user's explicit
MVP request supersedes full-40 runs and forward-only navigation. Content meaning,
first-attempt scoring, offline/local privacy, architecture and visual identity remain.

## Milestones (dependency order)

- [x] A — Quick 10 / Standard 20, rotation, Previous/Skip, thematic construction grouping.
- [x] B — Versioned transactional IndexedDB, initial save and exact resume, write-failure recovery.
- [x] C — Dedicated revision runs; unaided revision success clears pending item without rewriting original score.
- [x] D — Stored session history, real construction/theme metrics and revision counts.
- [x] E — Persisted Lingua/Finance theme and preferred session size.
- [x] F — Versioned portable backup, deep validation, explicit atomic replacement.
- [x] G — Production offline precache, install manifest/icons, safe update handling.
- [x] H — Integration/browser/offline tests, Windows instructions, final handoff.

For each milestone: implement, relevant tests, typecheck/build, fix failures, update
this file, commit, continue. No fabricated progress; no backend, accounts or LLM.
Windows Edge real-device acceptance remains manual. Linux automation does not verify Windows.

Milestone A: 119 unit tests, strict typecheck/build passed; 17 browser checks passed. Selection covers all 40 over consecutive runs; question order stays stable during Previous/Skip.

Milestone B: 122 unit tests, strict typecheck/build; 10 focused browser checks for reload, keyboard and duplicate input. Test-only fake-indexeddb 6.2.5 verified compatible with Node >=18. Transaction rollback and stale-tab guards covered.

Milestone C: 124 unit tests, typecheck/build passed; browser revision-clear and defer/revisit flows passed. Original first-pass scores remain immutable.

Milestone D: 126 unit tests, strict typecheck/build; stored history/reload and both palette/contrast browser checks passed. Metrics use current question revisions and completed first-pass sessions, not mastery claims.

Milestone E: 126 unit tests and typecheck/build passed; saved Finance/Quick preferences, unchanged active run and both contrast/layout browser checks passed.

Milestone F: 145 unit tests, strict typecheck/build; browser export/preview/cancel/invalid rejection/atomic restore passed. Schema v1 validates content snapshots, immutable grading, states, references, timestamps and 10 MiB UTF-8 limit. Archived IDs are retained.

Milestone G: 145 unit tests and typecheck/build; three production browser checks passed: network-disabled new launch/resume/Learn/revision/history/theme, cache repair, safe multi-tab update with history preservation. A controlled origin was stopped before a fresh offline page launch. Manifest and local PNG icons are precached and SHA-256 verified.

Milestone H / final verification (9 October 2026 UTC):
- 146 unit tests across 6 files passed.
- 32 production Playwright browser checks passed in Linux Chromium.
- Content validation (10 entries / 40 questions), strict typecheck and build passed.
- Draft/graded save failures, retry, rapid typing and stale native browser tabs covered.
- Explicit abandonment preserves evidence without awarding a final score.
- git diff --check passed; 19 protected starter/spec/content/tools files unchanged.
- Windows setup, build, install and unchecked device acceptance documented in docs/WINDOWS_MVP.md.

## Current MVP acceptance

| Required area | Result |
|---|---|
| Learn and semantic construction groups | Implemented, browser verified |
| Quick 10 / Standard 20, rotating unchanged 40 pool | Implemented, unit/browser verified across reloads |
| Previous / Skip / return / immutable feedback / summary | Implemented, unit/browser verified |
| Transactional local persistence / exact resume | Implemented, rollback/conflict/retry verified |
| Dedicated wrong/assisted revision and retained original scores | Implemented, unit/browser verified |
| Real progress / history / construction/theme/block evidence | Implemented, unit/browser verified |
| Persisted Lingua default / Finance alternate / preferred size | Implemented, reload/layout/contrast verified |
| Portable validated backup and explicit atomic replacement | Implemented, invalid/cancel/restore verified |
| Production offline core / verified precache / safe PWA updates | Implemented, fresh network-disabled launch and stopped-origin checks passed |
| Windows setup/run/install guide | Complete; actual Edge device acceptance pending |

## Milestone commits

| Checkpoint | Commit |
|---|---|
| Audit / checklist | 8745579 |
| A — Practice refinement | a73502a |
| B — Persistence | 0295d53 |
| C — Revision | b31085c |
| D — Progress/history | 9dbb831 |
| E — Themes | fa2bce7 |
| F — Backup | 3a55a5b |
| G — Offline/PWA | c003e01 |
| H — Final verification and Windows handoff | Final branch HEAD; see git log -1 |

Implementation milestones complete. No main merge, force-push or external publication.
A portable git bundle is supplied for local review/Windows checkout.
Next action: manual Windows/Edge acceptance in docs/WINDOWS_MVP.md; then review the development branch before any separately authorized publication/merge.
