# Data contracts
## Content pack
content/content.schema.json is the structural JSON Schema (2020-12). content/seed-pack.json is the executable example. The Python validator also checks uniqueness and foreign-key relations. The app must implement equivalent runtime validation; TypeScript annotations alone do not validate JSON.

Top-level:
- schemaVersion: integer 1, structural format.
- packId: stable lowercase ASCII ID.
- packVersion: positive integer, immutable release version.
- title: display text.
- entries: construction/meaning records.
- questions: authored questions.
- blocks: explicit ordered membership manifests.

Entry: id, kind=verb, lemma, construction, meaningEn, preposition, governedCase (accusative/dative/genitive), reflexiveCase (null/accusative/dative), cefr (null or A1–C2), tags, examples (id, domain everyday/technical, de, en), editorialStatus.
Direct-object, multi-preposition and complex reflexive source entries require a future supported entry variant or deliberate modelling; do not force them into a misleading preposition-only seed contract.

Question: id, revision (positive integer), entryId, type (preposition_cloze/case_choice/meaning_choice), prompt, exampleId (null permitted), explanation. Typed questions have acceptedAnswers and no choices/correctChoiceId. Choice questions have choices [{id,text}] and correctChoiceId and no acceptedAnswers. Choices and answers are authored, not generated at runtime.
Each block: id, title, description, questionIds (nonempty, no duplicates). Count is derived from this list, never trusted from a separate number.
Entry/question/block IDs remain stable across nonsemantic edits. Change question revision on meaning/answer edits; semantic identity changes warrant a new ID. Attempts store revision and snapshots.

## Session record
sessionId, mode (full/mistakes), blockId, packId, packVersion, startedAt ISO timestamp, completedAt or null, status, order[], choiceOrders by question ID, currentIndex, feedback or null, contentSnapshot, submitted attempt IDs. Snapshot only referenced content.
Inject clock/ID generation into tests; do not derive identity from array indices or sentence text.

## Attempt record
attemptId, sessionId, questionId, questionRevision, entryId, submittedAt ISO, response (text or choice ID), isCorrect, hintUsed, revealed, isUnaidedCorrect. Enforce uniqueness of sessionId+questionId on graded first submission. Store persisted state changes atomically.

## Backup
schemaVersion=1, appId=german-trainer, exportedAt ISO, contentVersions, settings, sessions, attempts.
Validate shape, enum values, uniqueness, counters/order bounds, attempt references and session snapshot references before opening the replacement transaction. Apply a documented import size bound (default 10 MiB) and reject oversize input gracefully.
Do not require every historic question ID to exist in today's content pack; validate it against its session snapshot and display archived history. Import has preview, explicit Replace progress action and cancel. No merge in V1.

