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

- [x] A — Quick 10 / Standard 20, rotation, Previous/Skip, thematic construction grouping.
- [x] B — Versioned transactional IndexedDB, initial save and exact resume, write-failure recovery.
- [x] C — Dedicated revision runs; unaided revision success clears pending item without rewriting original score.
- [ ] D — Stored session history, real construction/theme metrics and revision counts.
- [ ] E — Persisted Lingua/Finance theme and preferred session size.
- [ ] F — Versioned portable backup, deep validation, explicit atomic replacement.
- [ ] G — Production offline precache, install manifest/icons, safe update handling.
- [ ] H — Integration/browser/offline tests, Windows instructions, final handoff.

For each milestone: implement, relevant tests, typecheck/build, fix failures, update
this file, commit, continue. No fabricated progress; no backend, accounts or LLM.
Windows Edge real-device acceptance remains manual. Linux automation does not verify Windows.

Milestone A: 119 unit tests, strict typecheck/build passed; 17 browser checks passed. Selection covers all 40 over consecutive runs; question order stays stable during Previous/Skip.

Milestone B: 122 unit tests, strict typecheck/build; 10 focused browser checks for reload, keyboard and duplicate input. Test-only fake-indexeddb 6.2.5 verified compatible with Node >=18. Transaction rollback and stale-tab guards covered.

Milestone C: 124 unit tests, typecheck/build passed; browser revision-clear and defer/revisit flows passed. Original first-pass scores remain immutable.

Next action: milestone D real progress and history.
