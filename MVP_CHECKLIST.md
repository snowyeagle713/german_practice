# Autonomous MVP completion checklist

Baseline: eb782ec (Stage 2), verified against live origin/main on 10 October 2026.
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

- [ ] A — Quick 10 / Standard 20, rotation, Previous/Skip, thematic construction grouping.
- [ ] B — Versioned transactional IndexedDB, initial save and exact resume, write-failure recovery.
- [ ] C — Dedicated revision runs; unaided revision success clears pending item without rewriting original score.
- [ ] D — Stored session history, real construction/theme metrics and revision counts.
- [ ] E — Persisted Lingua/Finance theme and preferred session size.
- [ ] F — Versioned portable backup, deep validation, explicit atomic replacement.
- [ ] G — Production offline precache, install manifest/icons, safe update handling.
- [ ] H — Integration/browser/offline tests, Windows instructions, final handoff.

For each milestone: implement, relevant tests, typecheck/build, fix failures, update
this file, commit, continue. No fabricated progress; no backend, accounts or LLM.
Windows Edge real-device acceptance remains manual. Linux automation does not verify Windows.

Next action: milestone A practice refinement.
