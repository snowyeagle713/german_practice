# German Trainer — MVP

A local-first German construction trainer built with React, strict TypeScript and
Vite. The MVP is implemented on `mvp/completion`; Windows Edge installed-app
acceptance remains a manual release gate. No backend, account or API key required.

## Run on Windows

Install Git, Node.js 24 LTS with npm, and current Edge or Chrome. In PowerShell or
Command Prompt:

```text
git clone --branch mvp/completion https://github.com/snowyeagle713/german_practice.git
cd german_practice
npm ci
npm run dev
```

Open the local URL printed by Vite. Do not double-click `index.html`.
For production/offline testing:

```text
npm run build
npm run preview -- --port 4173 --strictPort
```

Open http://127.0.0.1:4173. Keep the same origin/port/profile on later visits.
Development and production use different origins and separate local progress.
See [Windows setup, updates, data and PWA guide](docs/WINDOWS_MVP.md).

## What is included

- Learn: 10 constructions with everyday and technical examples.
- Quick Practice: 10 questions; Standard Practice: 20. Unique authored questions
  rotate through the preserved 40-question pool across repeated new runs.
- Deterministic grading, retrieval hints, explicit Reveal Answer, exact saved
  resume, Previous/Skip, wrong/assisted revision and original-score history.
- Four palettes: Lingua Learning (default), Finance Dashboard, JetBrains Spring,
  and Proton-inspired. They share the accepted learning layout.
- IndexedDB stores progress locally in this browser profile/origin. Export JSON
  backups from Settings. Import validates and previews before **Replace progress**;
  it restores preferences, sessions and revision evidence. It does not merge.
- Built PWA: first visit with the server available, confirm offline readiness in
  Settings (use **Prepare offline files** if needed), then install through Edge or
  Chrome. Cached core flows can reopen offline; installed-device behavior still
  needs manual Windows verification. Clearing site data removes local progress.

## Verification and release status

```text
npm run validate:content
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e -- --workers=1
```

The browser suite serves the built app on port 4173; stop any preview there first.
Use a single worker for the documented stable release run. Earlier two-worker
execution exposed timing sensitivity in the cross-tab PWA update test; see the
[release readiness checklist](docs/RELEASE_READINESS.md) for exact evidence and
manual device gates. No external hosting or installed-device certification is
implied by automated Chromium tests.

The starter specifications below remain available as historical implementation
briefs. Current accepted behavior is documented above and in the Windows guide;
the original mandatory full-40-session milestone is superseded by Quick/Standard.

## Included
- AGENTS.md: permanent implementation rules.
- docs/V1_REQUIREMENTS.md: scope and measurable behaviour.
- docs/ARCHITECTURE.md: modules and extension boundaries.
- docs/LEARNING_DESIGN.md: fixed pools, grading and revision rules.
- docs/DATA_SCHEMA.md and content/content.schema.json: versioned content contract.
- docs/UX_SPEC.md: screens and responsive interaction.
- docs/IMPLEMENTATION_PLAN.md: five development milestones.
- docs/ACCEPTANCE_TESTS.md: automated and device checks.
- docs/DECISIONS_AND_GAPS.md: confirmed needs, chosen defaults and limitations.
- content/seed-pack.json: 10 verb constructions, 40 authored questions, one complete block.
- content/source/: preserved earlier reference, 37 extracted candidate groups, duplication audit.
- tools/validate_content.py: executable, dependency-free starter content validation.
- CODEX_START_PROMPT.md: implementation handoff.

## Content finding
The retrieved earlier reference has 200 numbered entries but only 37 distinct exact headings, with 163 repeated numbered entries. This is not a verified 200-verb curriculum. See docs/CONTENT_AUDIT.md. Distinct headings can still combine multiple meanings, constructions or prepositions.

The prototype uses a curated starter subset. Larger content expansion is independent of building V1. CEFR assignments remain unset rather than guessed.


## V2 Verb Forms pilot

The `content/v2-runtime-pilot` branch extends the MVP with a separate validated
20-verb pack. In **Blocks**, choose **Verb Forms** for two alphabetical ten-verb
blocks (70 authored questions each); **Verb Constructions** retains the Starter
Block. Quick stays 10 and Standard stays 20. Learn shows principal parts,
context-sensitive auxiliaries and source-checked examples.

Existing v1 sessions/backups remain supported. Exports containing v2 sessions use
backup schema 2, which the older MVP cannot import; v1-only exports stay schema 1.
No database-store upgrade or learner-data reset is required. See
[V2 runtime handoff](docs/V2_RUNTIME_PILOT.md) and
[pilot source audit](docs/VERB_FORMS_PILOT_AUDIT.md) for scope and verification.

## Verb Forms Population Batch 1

The `content/verb-forms-batch-1` review branch adds 80 source-checked profiles in
eight alphabetical ten-verb blocks: **100 Verb Forms / ten blocks / 700 authored
questions** including the preserved pilot. Quick remains 10 and Standard 20.
The existing alphabetical index spans both packs; Starter, palettes, saved
snapshots, backup formats and offline workflow remain supported.

See [batch source, content and regression audit](docs/VERB_FORMS_BATCH_1_AUDIT.md)
for all added verbs, scoped auxiliary/variant decisions, editorial level estimates
and remaining independent linguistic/Windows device review. To use this branch:
`git fetch origin`, `git switch content/verb-forms-batch-1`, `npm ci`, then the
normal build/preview commands above. Confirm updated offline readiness before
relying on new blocks without the server.

## Verb Forms Population Batch 2

The `content/verb-forms-batch-2` review branch adds 90 profiles, nine ten-verb
blocks and 630 questions: **190 Verb Forms / 19 blocks / 1,330 questions** with
the preserved pilot and Batch 1. Quick remains 10 and Standard 20. The existing
index, themes, backups, saved snapshots and offline workflow remain in place.
See [Batch 2 source/content/regression audit](docs/VERB_FORMS_BATCH_2_AUDIT.md)
for the full inventory, advanced productive selection, scoped senses, verification
limits and remaining Windows/independent linguistic review. Confirm updated
offline readiness before using new blocks without the server.

## Verb Forms v1 final curated core

The `content/verb-forms-final` review branch completes the planned population at
**240 Verb Forms / 24 blocks / 1,680 authored questions**. Fifty additional
profiles cover remaining strong morphology, formal interpretation/refutation and
project/technical actions. Quick remains 10 and Standard 20; existing snapshots,
backups, themes and offline flows remain supported.

See the [final batch audit](docs/VERB_FORMS_FINAL_BATCH_AUDIT.md) and
[whole-category audit and consolidated review list](docs/VERB_FORMS_V1_FINAL_AUDIT.md).
This is a curated core, not all German verbs or a complete modal grammar course.
Independent linguistic review and Windows installed-app checks remain documented
follow-ups. Confirm updated offline readiness before relying on the new blocks.
