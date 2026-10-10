# Curriculum architecture handoff

Branch: `content/curriculum-architecture`, created from `v1.0.0-mvp` (`816dabaf67d7f3bcd170220ad15201bac3b685b8`). Remote main was inspected read-only and resolves to that same MVP commit. The local origin/main tracking ref is older (`eb782ec`); it is not the current remote main. No main change, push, runtime implementation or content expansion is part of this task.

Deliverables:
- CURRICULUM_ARCHITECTURE.md: A–K hierarchy, progression, 2,660 central learning-record budget, block/pool/session distinction and legacy mapping.
- QUESTION_TEMPLATE_SYSTEM.md: per-category recipes, delivery/assessment contracts, hints and future handler gates.
- CONTENT_SCHEMA_EVOLUTION.md: actual v1 audit and proposed v2/backup/storage compatibility sequence.
- CONTENT_PRODUCTION_PLAN.md: source/quality gates, autonomous bounded batches and first three batches (100 forms; 100 constructions; 80 nouns + 40 collocations + 20 grammar patterns).
- `content/curriculum-map.json`: planning-only organization, stage budgets, dependencies, cross-cutting layers and Starter references.
- `scripts/validate-curriculum-map.ts` and unit tests: budget consistency, dependency cycle/reference rejection, session policy, category identity and legacy membership checks. This authoring validator is not a runtime v2 pack validator.

Assumptions: CEFR is editorial placement, not an official finite word list; canonical records are not unique word counts; Technical and Exam layers reuse canonical records; bridge is not a new CEFR value; current themes/UI/10–20 session semantics remain accepted. Existing null CEFR labels are not reclassified.

Verification environment: Linux, Node 24.19.0, npm 11.9.0, system Chromium, one Playwright worker. Planning check passed; content validation passed (10 entries, 40 questions, one block); strict typecheck passed; 198 unit tests passed; production build passed. All 59 production browser tests passed (one worker, 3.5 minutes), including offline/resume/revision, portable restore, keyboard, theme and responsive-layout regressions. Planning-map unit tests cover five rejection/validity scenarios. `git diff --cached --check` passed.

Preservation: no diff from the MVP tag in `src/`, `public/`, seed pack, v1 content schema, package manifests or existing starter documentation. No learner database migration is run. New planning JSON is not loaded, emitted or precached by the app. Windows Edge/installed-PWA acceptance remains a real-device gate for future runtime changes; Linux browser automation is not Windows verification.

Readiness: architecture and source/authoring pilot planning complete. Large importable curriculum production remains gated on v2 type/answer handlers, backwards-compatible validation/serialization, pilot linguistic review and regression tests. No large library or new productive-assessment engine has been generated.
