# First implementation task
Implement V1 of German Trainer in this workspace using AGENTS.md and the docs in this starter pack.

Windows-first scope: deliver and document Windows desktop use (primary acceptance browser: Edge). Preserve Linux portability in code and scripts. Defer Linux runtime verification and all iPhone/iPad installation, touch and device testing. Keep adaptable layouts without spending V1 effort on mobile-specific polish. Do not add a native installer or desktop wrapper.

Start by inspecting the existing folder and available Node/npm/browser tooling. Preserve all specification and source files. Work through the five milestones in docs/IMPLEMENTATION_PLAN.md in order, using the supplied content/seed-pack.json. Build the actual application; do not stop after another plan or scaffold.

Deliver:
- TypeScript/React/Vite app with adaptable Windows desktop layouts;
- one fixed 40-question starter block, Learn, Full block, Mistakes and Summary flows;
- authored grading and complete-pool shuffling;
- transactional IndexedDB progress and exact session resume;
- export/import backups;
- production PWA caching and safe update behaviour;
- meaningful domain/storage tests and browser tests where available;
- npm scripts listed in START_HERE.md, lockfile and exact launch instructions.

Do not build future features, expand the dataset or require a remote service. Do not publish externally. Defaults in docs/DECISIONS_AND_GAPS.md are sufficient to proceed without product clarification.

Run checks and fix failures before finishing. If a capability is unavailable, complete the independent work, document the limitation and give reproducible verification steps. Include results and remaining Windows real-device checks and explicitly deferred Linux/mobile checks in IMPLEMENTATION_HANDOFF.md. Preserve progress across ordinary app/content updates.

The legacy reference is duplicate-heavy: 200 numbers are only 37 distinct headings. The seed block is the implementation dataset. Read docs/CONTENT_AUDIT.md before handling the source material.

