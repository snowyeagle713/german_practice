# Acceptance and verification
## Automated domain/content checks
1. Seed pack: 10 entries, 40 unique questions, one 40-question pool; all entry/example/choice references resolve.
2. Reject duplicate IDs, invalid case/type values, missing answers, ambiguous duplicate choice texts and broken references.
3. With seeded randomness, full-run order is a permutation of every manifest ID. No omissions/duplicates for multiple seeds; do not assert that every shuffle differs.
4. Typed whitespace/case normalization accepts authored equivalents; near-misses and empty answers do not receive credit.
5. Choices grade by ID after shuffling.
6. Hint/reveal never earn unaided credit.
7. Duplicate submit, reload after feedback and repeated Next do not create extra graded attempts.
8. Completing all 40 questions yields exact coverage and denominator; revision leaves the full-run score unchanged.
9. Mistakes includes wrong/assisted IDs from the latest full run; correct-only run has no mistakes.
10. Content versions preserve old session snapshots and archived history.

## Persistence/backup checks
11. Reload after question 7 restores order, index, choices and feedback exactly.
12. Simulated failed write rolls back attempt/session update; UI cannot report Saved.
13. Export/import round-trip preserves settings, attempts, active session and snapshot.
14. Malformed/newer-schema/oversize/internally inconsistent imports and cancellation leave existing data unchanged.
15. Replacement is atomic; importing a historical removed question retains it as archived.
16. Reset/abandon, if offered, requires an explicit app user action; ordinary update never resets progress.

## Browser checks
17. Learn -> full block -> submit -> feedback -> next -> summary -> mistakes works.
18. Enter key does not submit and advance from one key event; input labels and focus work.
19. At 768, 1280 and 1920 px viewport widths, no overflow; prompt/input/feedback remain reachable with keyboard/mouse.
20. Against production build, wait for controlling worker and completed cache. Disable network, reload and open a new page in that browser profile; all practice assets/content work and answers persist.
21. Test update availability while a run is active: do not change its questions or reload it. Finish/pause safely, apply update and verify progress survives.
22. Check unsupported service worker/storage states are explained rather than falsely marked ready.

## Windows V1 real-device checklist (cannot be substituted with automation on another OS)
- Windows Edge: run/install, close/reopen, resume and offline launch after initial caching.
- Stop the local server and disconnect the network; try the documented installed-app launch. Record whether it succeeds. If the supported launch requires the server, state that limitation explicitly and do not claim server-independent offline startup.
- Backup export/save/import using the Windows file picker.
- Confirm whether browser tab and installed app share state in the tested environment; do not assume.
- Repeat after an update and verify score/history survive.
- Judge question clarity, pace and everyday/technical balance; record corrections.

## Deferred platform verification (not V1 gates)
- Linux: install dependencies and build using the documented portable scripts; verify browser practice, persistence, backup and offline launch.
- iPhone/iPad: HTTPS delivery, Safari/Home Screen installation, 375 px layout, touch keyboard, resume, file picker and airplane-mode launch.
- Cross-device progress transfer: verify backup portability; automatic sync remains a future feature.

## Results standard
Record each gate as Passed, Failed or Not run with a reason. Preparation validates content and file contracts only. No app/offline/device verification is claimed until actual implementation. Report the OS/browser used for automation. A Windows-ready build awaiting laptop testing is not a Windows-verified release.

