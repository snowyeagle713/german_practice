# German Trainer — Codex starter pack
Prepared 3 October 2026 for Yacine. Updated for Windows-first V1.

This is a build-ready specification and content starter, not an implemented application. No React app, installed dependencies or verified browser build is included yet.

## Platform scope
Windows is the required V1 platform. Keep the browser architecture and development scripts portable to Linux; Linux execution testing and iPhone/iPad installation/testing are later milestones. Do not let mobile polish delay the Windows release.

See PROJECT_MAP.md for the complete product and development map.

## Start here
1. Read START_HERE.md for responsibilities and environment setup.
2. Put this folder in the workspace/repository where Codex will implement the app.
3. Give Codex CODEX_START_PROMPT.md. AGENTS.md contains standing development rules.
4. Implement the five milestones in docs/IMPLEMENTATION_PLAN.md.
5. Use docs/ACCEPTANCE_TESTS.md to distinguish automated verification from testing on real devices.

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

## Validation available now
Run from this folder:
```sh
python3 tools/validate_content.py content/seed-pack.json
```
On Windows with Python installed, use `py` instead of `python3` if needed.
App build and browser tests become available during implementation.

