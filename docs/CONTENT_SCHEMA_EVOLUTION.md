# Content schema evolution and migration proposal

Status: design only. Do not widen `content/content.schema.json` in place. `seed-pack.json`, runtime types/validators, IndexedDB, backups and session formats are unchanged.

## Audit of the actual MVP

The v1 content pack has `schemaVersion: 1`, packId/packVersion/title, entries, questions and blocks. Its closed schema rejects additional properties. Entry kind is only `verb`; required preposition, governedCase and reflexiveCase make it a verb-construction model rather than a general lexicon. It already provides stable id, lemma/construction, English meaning, nullable CEFR, tags, everyday/technical examples and editorial status. Three closed question variants support preposition answers, case choice and meaning choice. Block membership is only questionIds; Learn derives entries from these questions. Validation enforces references, cloze reconstruction, case correctness and both example domains.

Consequences: noun gender/plurals, form tables, connector syntax and grammar objectives cannot safely be added as ad-hoc tags. A Learn-only item cannot be represented by existing blocks without a question. Theme metadata is currently supplemented by domain code. New formats are not obtained by renaming old types.

Practice supports rotating Quick 10 / Standard 20 and question-based revision, not arbitrary new sizes/types. Storage and backup schema 1 embed validated v1 snapshots and closed session/settings enums. Multi-pack catalogs and v2 answers need explicit validators and serialization before use; changing content alone would break import/resume assumptions.

## Minimum v2 authoring shape

Use a separate discriminated `ContentPackV2` validator. Keep pack identity, version, title and arrays; replace `entries` with typed `items`, and give blocks explicit `itemIds` plus `questionIds`. Proposed common fields:

| Field | Purpose |
| --- | --- |
| id, contentType, title, meaningEn | Stable sense/objective identity; one of A–I types |
| level | CEFR value or null; optional rationale/source and confidence; bridge is catalog placement, not a CEFR value |
| themeId, subthemeId (optional) | Catalog grouping with validated references; placement can change without ID changes |
| register | Neutral, conversational, formal, academic or technical; allow evidence-based multiple labels |
| priority | Frequency band, usefulness band and short rationale; unknown is valid, invented numeric corpus ranks are not |
| relevance | Everyday and technical/professional bands, with optional domain tags |
| examples | Stable id, German, optional gloss, domain/register; technical example optional when natural |
| sourceNotes, editorialStatus | Attested references, checked-at date only after inspection, rule notes and honest review status |
| relatedItemIds, prerequisiteIds (optional) | Cross-links and objective dependencies; validate references and acyclicity |
| properties | Small type-specific object, not an open catch-all bag |

Type-specific properties: form profiles (forms/classification/conditional auxiliaries/separability); construction senses (argument slots/preposition/case/reflexivity); prefix uses (sense/separability/prefix links); nouns (article/gender/singular/plural variants and no-plural status); adjectives/adverbs (part of speech, applicable gradation/government); collocations (phrase/slots/constraints); grammar (objective/pattern/constraints); connectors (function/clause syntax/register); idioms (meaning/usage restrictions). Store shared collocations as references instead of duplicated full items. Keep optional metadata lean; do not introduce a general plugin or linguistic ontology framework.

Questions add stable `itemId`, `facetId`, `templateId`/version and discriminated answer contract from QUESTION_TEMPLATE_SYSTEM.md, with fixed context, explanation and hint. Exact naming is an implementation proposal; publish a closed schema and test fixtures before producing importable v2 data. Metadata never substitutes for authored answers. A separate curriculum catalog owns ordering, category themes and curated J/K views; it is not a new runtime dependency until implemented.

## Compatibility sequence

1. Freeze the v1 release fixtures and backups. Test that all ten Starter IDs, forty questions, null CEFR values, grading, themes, rotation, revision and old export/import still work.
2. Introduce explicit v1/v2 validation dispatch. A read-only catalog adapter can reference old entries as construction items while retaining original IDs and raw snapshots. Do not add fields to v1 files or auto-reclassify them.
3. Implement one v2 type/answer contract at a time with small authored pilot fixtures, new Learn renderer and practice-domain grading. Publish only supported reviewed pools. Legacy validation remains independently callable.
4. Version snapshot/backup envelopes before storing v2 sessions. Add explicit migration/validation tests for old backups, new backups, malformed and future versions. A schema 1 importer rejects v2 cleanly; it never partially replaces data. Preview and explicit replacement remain required.
5. IndexedDB version changes only when store/index structure needs them. A v2 snapshot format alone does not justify deleting/recreating stores. Migrate transactionally, preserve IDs/attempts/settings and provide failure recovery. Test old database upgrade, active-session resume, offline launch and cross-tab update conflicts.
6. Catalog/version-aware selection keys eventually include packId, blockId, packVersion and eligible-pool manifest version. Changed pools start a new rotation for new runs, preserving old cursors/snapshots. No retroactive regrading or question-ID reassignment.
7. Add multi-pack navigation/loading behind the existing UI structure after validation; cached manifests and assets must work offline. Existing sessions use their embedded versions even if a newer pack is available. Initially keep a session within one pack/version; mixed-pack exams require a later composite snapshot design.

Identity rules: IDs never encode CEFR, alphabetic position or mutable theme. Semantic answer changes bump question revision and packVersion; incompatible structural change bumps schemaVersion. Pack version, backup version, database version and planning `mapVersion` are independent. Removal leaves historical snapshots readable. Reviewed replacements do not silently merge wrong-answer evidence across distinct senses.

## This branch's machine-readable boundary

`content/curriculum-map.json` has `documentType: curriculum-plan`, `mapVersion: 1`, `runtimeEnabled: false`. It contains targets, organization and references, not authored vocabulary or questions. It is not passed to the v1 content validator, emitted as a runtime pack or added to PWA caching. `scripts/validate-curriculum-map.ts` checks its planning contract, sums, dependencies and live Starter references. Future v2 runtime JSON Schema and migrations are deliberately not claimed as implemented.
