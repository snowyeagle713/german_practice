# Implementation milestones
Do these in order. Each milestone has a reviewable output; avoid repeated whole-repository rediscovery. Small focused fixes may remain within the same task. No guaranteed token or wall-clock estimate is assumed.

| Milestone | Deliverable | Verification gate |
|---|---|---|
| 1. Foundation and content | Vite/React/TS scaffold, scripts, lockfile, content loader/validator, adaptable Windows desktop shell, block/learn screens | Content validation, strict typecheck, build; source pack preserved |
| 2. Practice engine | Pure session/grading/shuffle functions, complete 40-question flow, assistance tracking and summary | Pool coverage, authored answers, duplicate submission and score tests |
| 3. Persistence and revision | IndexedDB transactions, exact resume, mistakes mode, progress, backup preview/import/export | Reload, transaction failure, revision-score isolation and backup round-trip |
| 4. Offline and installation | Manifest/icons, production precache, Windows installation/reopen guidance, readiness/update UI | Worker activation, network-disabled reload/new launch and active-session update checks |
| 5. Release handoff | Responsive/accessibility fixes, end-to-end checks, exact run instructions and results | All available required checks; Windows device checklist; Linux/mobile marked deferred |

## Platform gates
Windows desktop is the only required V1 user acceptance platform. Preserve Linux portability throughout, but defer Linux execution testing and iPhone/iPad installation, touch and device testing. Use the agent's available OS for automated checks and report it; do not claim Windows validation from Linux automation.

## Working rules
First inspect tooling. Choose compatible package releases and record requirements. Scaffold into this existing folder safely, rather than running a tool that deletes it.
Do not let importing the rest of the reference block milestone 1. Use seed-pack.json unchanged except necessary documented editorial fixes.
After each gate, retain a concise status record of files changed, checks and remaining issues. If Git is available and repository configuration supports it, use small local commits; no push/publish implied.

## Required scripts after implementation
dev, preview, build, typecheck, test, test:e2e and validate:content. Unit tests run once in the standard test command; no watcher hanging in automation. validate:content runs with the Node toolchain.
Browser tests use the built app for offline checks. Include a deterministic test clock/random source without changing production grading behaviour.

## Future sequence
After Windows V1 is tested, Linux browser verification and then mobile/HTTPS installation can be scheduled independently of content expansion. No rewrite is planned, but compatibility is verified rather than assumed.

Learning-content sequence: review/expand unique verb constructions -> add themed blocks -> optional spaced repetition -> noun/grammar variants -> audio -> optional sync/private deployment -> optional conversation service.
Each phase has its own concrete scope; extension points do not justify implementing these now.

