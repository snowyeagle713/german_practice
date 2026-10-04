# Development rules
## Goal
Deliver a small, usable German verb practice application for Yacine, with complete fixed question blocks, offline operation and local progress. Read README.md, docs/V1_REQUIREMENTS.md, docs/ARCHITECTURE.md, docs/DATA_SCHEMA.md and docs/IMPLEMENTATION_PLAN.md before editing.

## Platform scope
Windows desktop is the required V1 release target; use Edge as the primary user acceptance browser. Keep browser APIs, file handling and npm scripts portable to Linux. Linux runtime testing and iPhone/iPad installation, touch interaction and device testing are deferred. Maintain flexible layouts, but no mobile-specific polish or device-test requirement may block Windows V1. Browser automation on another operating system is useful but must not be reported as Windows device verification. No native installer or desktop wrapper in V1.

## Scope and decisions
Use TypeScript (strict), React, Vite, semantic HTML and ordinary CSS. Use IndexedDB behind a storage adapter. Use a web app manifest and service worker for a built PWA. Use a small maintained PWA integration if appropriate. Verify compatible releases when installing, pin via package-lock.json, and record runtime requirements.
No backend, login, cloud database, required LLM, paid service, remote fonts or runtime analytics in V1.
Avoid state-management frameworks, UI component suites, Electron, monorepos and speculative plugin frameworks.
Python is optional content tooling, never an app runtime dependency.
Treat recorded defaults as decisions, not reasons to stop for clarification.

## Implementation
Keep content outside source code. Separate pure domain/session/grading code, storage and UI. Do not parse LaTeX at runtime. Do not treat the source reference as 200 unique verbs.
Build with the supplied 40-question seed block first. Do not expand the curriculum or invent CEFR classifications during the software milestones.
Keep stable IDs and content versions. Shuffle whole fixed pools; never replace full-block coverage with random sampling.
Persist sessions and answers transactionally. Never count a double-click, reload or retry as a second graded submission.
Validate incoming JSON and references at runtime. Render imported text as text; never evaluate it or inject HTML.
Keep data on device. Export/import backups with validation and an explicit user replacement action. Updates must not silently delete progress.
Follow docs/LEARNING_DESIGN.md for scoring; do not advertise exam readiness or mastery based on recognition questions.

## Verification and reporting
Implement required npm scripts; run content validation, type checking, meaningful unit tests, build and available end-to-end tests.
Offline claims require a production build, service-worker activation, network disabled and a reload/new launch; dev-server success is insufficient.
If checks cannot run, report exactly what blocked them and which device checks remain.
Do not claim this preparation pack is a working app.
Work autonomously through the milestones, keeping unrelated files intact. Do not publish/deploy externally unless separately requested. A local preview is permitted.
Do not use sub-agents unless the user explicitly requests parallel agents.
Record assumptions, final behaviour, run commands, test results and limitations in a concise implementation handoff.

