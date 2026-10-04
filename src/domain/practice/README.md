# Practice domain (Stage 2)

Pure TypeScript, with no React, browser, network or database imports:

- `types.ts`: JSON-serializable session, feedback, response and attempt records.
- `shuffle.ts`: Fisher–Yates using an injected random source.
- `grading.ts`: finite authored text/choice grading and answer display helpers.
- `session.ts`: validated full-block creation with cloned content, stable question/
  choice orders and immutable, question-ID-guarded transitions.
- `summary.ts`: first-pass counts, exact coverage, unaided score, question-type
  evidence and unique wrong/assisted IDs for future revision.

Clock and ID values are injected into creation or command payloads; reducer replay
does not generate new randomness or timestamps. A graded submission is unique by
session/question and attempt ID. Only feedback can advance, and old question-ID
commands cannot affect the next question. Duplicate events return the same state.

`src/ui/usePractice.ts` owns one in-memory session. Stage 3 can use these records
and pure transitions behind application operations and a transactional storage
adapter. It must save initial sessions and commit attempt/session changes before
reporting success; the current in-memory reducer is not a persistence adapter.
No IndexedDB, migrations, backups, historical aggregate or revision sessions are
implemented. Explicit replacement discards the in-memory run; nothing is saved.

Correct/wrong describe authored answer matching. Assisted overlaps either result.
Unaided correct excludes both hint and reveal. Completed accuracy divides unaided
correct by the full manifest; active answered accuracy uses submitted attempts.
Coverage and mistakes use one first attempt per question, not extra attempts.
