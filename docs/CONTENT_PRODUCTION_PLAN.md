# Autonomous content production plan

Architecture is ready; large runtime population is not yet enabled. This task creates no new authored learning items/questions and makes no app/storage changes.

## Gate 0: capability and editorial pilot

Before bulk production, implement the minimum v2 validator/legacy adapter and the handlers needed by the next batch, following CONTENT_SCHEMA_EVOLUTION.md. Use 10–20 representative records per new type (not an arbitrary 100-item first implementation fixture) to establish natural examples, variant policies, hint behavior, source provenance and end-to-end import/practice/revision/resume/offline/backup compatibility. Keep drafts outside runtime loading until all gates pass. Existing Starter must pass unchanged.

Source references: CEFR Companion Volume descriptors for communicative objectives; reputable dictionaries such as Duden/DWDS and IDS grammis for forms, constructions and grammar; attested modern usage/corpus evidence for collocations/register. These are recommended sources, not a claim that this branch verified thousands of entries. Record actual inspected references and dates; never fabricate citations, frequency ranks or native-review status. Write original example sentences rather than copying licensed dictionary examples wholesale.

## First three production batches

| Batch | New canonical records | Focus / organization | Indicative pools |
| --- | ---: | --- | --- |
| 01 | 100 Verb Forms | B1/B2 high-use recall: common action, movement/change, communication; alphabetic 8–12-item blocks with level filtering | Roughly 400–600 reviewed questions, after form/auxiliary handlers exist |
| 02 | 100 Verb Constructions | Anticipation, memory, communication, decisions/participation, dependency/resources; coherent semantic blocks | Roughly 400–600 questions; cross-link the ten Starter records without duplicating or editing them |
| 03 | 80 Nouns + 40 Collocations + 20 Grammar Patterns = 140 | Work/projects/requirements plus everyday contexts; foundational word order/subordination/relative clauses, passive and conditional prerequisites | Roughly 560–840 questions across category-specific linked blocks, after handlers exist |

These are approximate editorial budgets, not instructions to invent weak variants. Batch 02's 100 are new records; Starter's ten are already within the 360-category target. Typical batch size thereafter is 100–150 (up to 200 only after stable audits). Technical examples begin where natural in these early batches, not as a replacement for everyday contexts. Later sequence: remaining B1/B2 forms/nouns/constructions and grammar; prefix verbs and adjective/adverb facets; B2 collocations/connectors; bridge formal patterns/idioms; C1 integrated precision, professional pathways and future exam blueprints. Grammar and connector objectives are interleaved by prerequisites, not delayed until all vocabulary is generated.

## Repeatable autonomous batch cycle

1. Select backlog objectives/IDs within the target and prerequisite plan. Establish supported templates and sources. Review existing packs and draft ledger for overlap before generation.
2. Author in approximately ten-item coherent blocks: canonical records, natural examples, explicit accepted variants, plausible distractors, retrieval hints and concise explanations. Keep IDs stable and drafts separate from released manifests.
3. Validate schemas, references, facet links, prerequisites, pool sizes (at least twenty eligible unique questions for normal practice) and handler support. Audit grammatical alternatives, technical accuracy, register and explanations.
4. Deduplicate across all published and draft batches: normalized lemma plus sense/construction; inflection-only variants; collocation aliases; repeated example/prompt/answer combinations. Flag near-duplicate meanings for editorial judgment; do not automatically merge distinct senses. Record retained/rejected cases and reasons.
5. Run meaningful template fixtures, correct/wrong/variant/assistance tests, 10/20 unique selection and rotation tests, grading/summary/revision checks, content validation, strict typecheck and build. Browser-test each new handler and representative complete sessions; regression-test Starter, resume, backup/restore and production offline/update behavior after runtime changes.
6. Publish a per-batch audit: IDs/counts by category/stage, sources actually checked, unresolved issues, duplicates, accepted variants, pool coverage, tests/commands/results, linguistic-review level and deviations from targets. AI/self-review is not independent expert/native review. High-risk rules stay draft until credible verification; no invented rules or “reviewed” status merely because JSON parses.
7. Commit each reviewed block or small coherent group, then a batch audit/checkpoint. Never one giant library-generation commit. Promote only verified compatible packs/catalog manifests; never overwrite learner databases to load content.
8. Continue to the next planned batch autonomously using these defaults. Pause for curriculum-level scope/assessment changes, incompatible migration decisions or unresolved source contradictions affecting correctness. Routine theme placement, wording and attested variants are editorial work, not repeated approval questions. Do not externally publish unless requested.

## Quality gates

Standard modern German; clear sense boundaries; truthful level evidence; useful frequency/usefulness rationale; appropriate register; natural everyday examples and technical examples only when meaningful. Form, gender, plural and government facts need reliable support. Connector ambiguity and auxiliary alternatives must be resolved explicitly. Distractors must be both plausible and unambiguously wrong in context. Hints must not contain the tested answer; Reveal is the explicit assistance route.

Do not reuse the old source's “200” headings as a unique-verb count: the existing audit found repeated entries, not 200 verified unique verbs. Never count surface inflections or duplicate phrase senses toward quotas. Catalog progress is coverage/evidence, not CEFR certification; productive writing/speaking remains separately assessed.

## Commands and current handoff

Planning check: `node --import tsx scripts/validate-curriculum-map.ts`.
Regression gates: `npm run validate:content`, `npm run typecheck`, `npm test`, `npm run build`, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=1` (Linux cloud). On Windows use installed Playwright browsers and Edge acceptance steps in WINDOWS_MVP.md; Linux automation does not certify Windows.

This architecture branch should be committed locally; no push or merge into main is authorized by this task. Readiness: begin capability/source pilots now; begin large importable content batches only after Gate 0, not merely because the planning map validates. No new CEFR labels, content answers, learner data, themes or normal session sizes have been changed.
