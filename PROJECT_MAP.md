# German Trainer — project map
Windows-first development scope, updated 3 October 2026.

## Purpose and current position
Build a practical German-learning app for Yacine, starting with verb constructions, everyday fluency and technical examples. Preparation is complete; application implementation has not begun.

The current pack is the development brief: standing rules, architecture, content contracts, a validated starter dataset, milestones and acceptance criteria. It is not an executable app yet.

## Platform map
| Platform | What we do now | What waits |
|---|---|---|
| Windows desktop | Build and verify browser practice, keyboard/mouse UI, installation, saving, backups and offline behaviour | Native installer/desktop wrapper, if ever needed |
| Linux | Keep source, browser APIs, paths and development scripts portable | Build/runtime/browser verification on Linux |
| iPhone/iPad | Preserve flexible layout and browser architecture | Mobile polish, touch keyboard, HTTPS delivery, installation and device testing |

The same browser application is intended to serve all three. That intention is not a claim that the unbuilt app is already tested on them.

## Product map
| Part | Windows V1 | Later expansion |
|---|---|---|
| Content | 10 verb constructions; one fixed 40-question block | More reviewed verbs, themed blocks, nouns, adjectives, grammar and scenarios |
| Learning | Ungraded reference cards, everyday and technical examples | Broader curriculum and richer guidance |
| Practice | Typed preposition clozes, case choice and meaning choice; whole-pool shuffle | Conjugation, richer recall and sentence exercises |
| Feedback | Authored answers/explanations; hints and reveal tracked | More detailed diagnostics |
| Progress | Exact resume, first-pass scores, completion and attempt history | Trends and scheduled spaced repetition |
| Revision | Latest wrong/assisted question subset; repeat whole block anytime | Adaptive review scheduler |
| Storage | Local IndexedDB; validated JSON backup export/import | Optional cross-device sync |
| Delivery | Built PWA and documented Windows launch/install/offline behaviour | Linux/mobile verification and optional private hosting |
| Optional services | No remote service required | Audio, speech and optional LLM conversation |

## How the application fits together
| Layer | Responsibility | Why it is separate |
|---|---|---|
| Content packs | Authored entries, examples, questions and block manifests | Add/correct vocabulary without rewriting practice code |
| Practice engine | Session order, grading, assistance and revision selection | Test learning behaviour independently of screens |
| Progress/storage | Save/resume, history and backups | Preserve user data while UI/content evolve |
| Interface | Dashboard, blocks, Learn, Practice, Summary, Progress and Settings | Improve usability without changing scores |
| Offline delivery | Cache application/content; handle install and updates | Practice without a runtime internet dependency after caching |

TypeScript + React + Vite build the app. IndexedDB saves progress. Python is an optional content tool, not required by the finished application. V1 has no backend or mandatory LLM.

## User experience
Open the dashboard and choose the starter block. Study the constructions in Learn, then start a full run. The run asks all 40 authored questions once in a saved shuffled order. Submit an answer, read feedback and continue. At the end, review the first-pass summary, practise mistakes or repeat the whole block.

Closing/reloading should resume the same run. A revision session adds practice history without rewriting the original score. Export a backup to retain a portable copy of progress.

## Five development stages
| Stage | Codex builds | Evidence before moving on |
|---|---|---|
| 1. Foundation | Project/tooling, content validation, desktop shell, block list and Learn | Valid data, strict typecheck, successful build |
| 2. Practice | Session engine, all 40 questions, grading, assistance, feedback and summary | Complete pool coverage; correct/idempotent scoring |
| 3. Saving and revision | Local transactions, exact resume, mistakes, progress and backups | Reload recovery, rollback handling and backup round-trip |
| 4. Offline and installation | Manifest/icons, production caching, readiness/update UI and Windows launch guidance | Built-app offline checks; installation/reopen behaviour recorded |
| 5. Verification and handoff | Desktop/accessibility fixes, end-to-end checks and run instructions | Available checks pass; Windows laptop checks completed or clearly pending |

These are delivery stages, not separate requests that must each wait for approval. Codex should implement them sequentially under the supplied prompt. Network/tooling restrictions can affect what it can verify; it must state those restrictions honestly.

## Who does what
| Codex | Yacine |
|---|---|
| Inspect the available workspace/toolchain | Make the folder available in the chosen development environment |
| Write the application and install permitted dependencies | Complete any required account/repository access steps |
| Run automated checks, fix errors and document results | Test the first build on the Windows laptop |
| Supply launch, install, backup and offline instructions | Judge learning usefulness, clarity and pace |
| Implement fixes from concrete feedback | Report issues and any content corrections |

No manual line-by-line coding is expected. Automation on Linux or another OS does not substitute for real Windows checks. Linux and mobile device checks are deliberately later work.

## Content track, separate from software development
The earlier reference has 200 numbered entries but only 37 distinct exact headings. The pack preserves the source and duplication audit. Do not treat those repetitions as a 200-verb curriculum.

Use the clean 10-construction seed while building. Later: deduplicate the remaining source, split meanings/prepositions, review examples and answers, assign stable IDs, form themed blocks and validate them. Vocabulary preparation should not block software stages 1–5.

## Deferred roadmap
After Windows V1 works, prioritise from actual use:
1. Correct/polish the prototype and expand reviewed verb blocks.
2. Verify Linux using the same codebase and portable scripts.
3. Add scheduled review and additional content types when useful.
4. Enable and verify iPhone/iPad delivery, installation and offline use.
5. Consider audio, private hosting and sync separately.
6. Add optional LLM conversation only if wanted; core practice remains independent.

This order is adjustable. Linux verification and content expansion can be scheduled independently; mobile and remote services must not delay the initial Windows release.

## Starting implementation
Extract the updated ZIP and open GermanTrainer-Starter in the intended Codex workspace. Read START_HERE.md, then give Codex CODEX_START_PROMPT.md. AGENTS.md provides persistent rules. No further product choice blocks stage 1.

No app has been built or device-tested in this preparation step. The next task is implementation, not another specification round.
