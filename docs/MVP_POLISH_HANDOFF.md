# MVP polish / acceptance fixes — 10 October 2026

Scope: existing `mvp/completion` MVP only. No main merge, curriculum changes,
new storage schema/version, dark mode, or application architecture redesign.

## Practice stability

Each response previously triggered an IndexedDB write and mounted/unmounted a
"Saving locally…" paragraph above the practice screen. That changed the card's
vertical position on every write. The application now reserves a permanent,
non-live save-status slot in the header, preserving card position and focus.

Practice keeps its immediate local input draft. The application-layer DraftBuffer
coalesces text changes after 300 ms of inactivity; choice responses save immediately.
Pending text flushes before grading, assistance, skip/previous/next, application
operations and route changes. Writes retain the existing ordered transaction queue,
question/session guards, conflict handling and retry behavior. Background/pagehide/
beforeunload events also request a flush. Browser termination cannot guarantee an
asynchronous IndexedDB commit: closing immediately inside the debounce window
remains best effort, while committed drafts resume exactly. No server or additional
storage mechanism was added.

## Desktop density

At widths above 900px, tighter shell/header/card spacing, compact welcome/stats,
selector spacing and aligned progress cards bring primary Home information and
study actions into a 1920×960 content viewport (allowing browser chrome on a
1920×1080 display). Text sizes and readable action/control targets remain intact;
content remains fluid and can scroll. No CSS zoom or forced fixed-height screen.

## Four palettes

Settings persists Lingua Learning (unchanged default), Finance Dashboard,
JetBrains Spring and Proton-inspired. All share one component/layout tree and
semantic CSS tokens. Spring uses a near-black sidebar, bright green accent and
separate dark-green accent text; Proton uses a soft violet canvas and white cards.
`src/domain/palettes.ts` supplies IDs to both preference types and backup validation;
`src/ui/theme/palettes.ts` supplies labels and `tokens.css` supplies role values.
Existing backups remain compatible. There is no dark-mode implementation.

## Verification

Commands: `npm test` and
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`.
The latter includes content validation, strict TypeScript checking and production
build. Added tests cover draft coalescing/explicit flush, pending-text submission,
exact reload/resume, navigation flush, immediate choice saving, slow-write position/
focus stability, Home viewport fit, palette backup round-trips and all four palette
layout/contrast/preferences. Existing production/offline and MVP flows are retained.

Results: 153 unit tests and 41 browser tests pass; content validation (10 entries,
40 authored questions), strict typechecking and production build pass.
Linux Chromium automation
is not Windows/Edge device acceptance. On Windows/Edge, verify continuous typing
and radio choices without jumping, immediate submit/skip/return/reload, saved
answers after reopening, Home at 100% zoom on a 1920×1080 display, all four palettes,
keyboard focus and the existing installed/offline workflow. Abrupt-close behavior
should be assessed with the asynchronous-save limitation above in mind.

## Final targeted acceptance pass

Hints now depend on the question type: preposition cloze shows construction meaning
and governed case without the construction/preposition; case choice shows meaning
and a reminder to retrieve the construction's fixed case without naming it; meaning
choice shows governed case and a context-reading cue without the English answer.
Reveal Answer remains explicit, and hint/reveal assistance tracking, scoring and all
authored questions/answers are unchanged. Pure hint generation lives in the practice
domain. All 40 seed questions have tests for non-answer hints.

Revision construction rows now wrap using flex with explicit gaps, a separate pending
badge and a separate action. Browser checks cover 768, 1280 and 1920px spacing and
starting construction revision, plus hint/reveal/assisted grading for all question types.
Windows/Edge visual acceptance remains a local-device check.

Final pass verification: 193 unit tests and 43 browser tests pass; content validation,
strict typecheck and production build pass. Existing offline/PWA, persistence,
practice, autosave stability, desktop density and all four palette tests pass.

## Learn / Practice workspace density

Only Learn and Practice composition and spacing changed. Their repeated header
kicker is omitted; typography sizes, theme tokens and the surrounding shell,
Home, Progress, Settings and sidebar remain unchanged.

On desktop, Learn's title/status and back-link/study progress share a top row.
The study guide stays on the left with a sticky, independently scrollable list;
selection and resize reveal the active construction within that list without
changing document scroll or focus. Examples sit side by side on wide screens.
Previous/Next and the practice action occupy a compact sticky card footer.
On narrower screens the guide and card stack, with a bounded scrollable guide.

Practice uses a compact session-information/control area, less vertical padding,
and a wider question card. Wide-screen graded answers and feedback sit beside
one another; narrower screens keep the linear answer/feedback flow. Existing
submission, assistance, grading, focus and persistence behavior are unchanged.
There is no fixed-height page or CSS zoom, and long content can still scroll.

Added browser checks cover desktop card position, visible navigation, selected
construction visibility, wide feedback placement, preserved text sizes and keyboard
advancement. Production screenshots were inspected at 1920×960. Windows/Edge
visual verification at normal zoom remains a device check.

Workspace-pass verification: 193 unit tests and all 46 browser tests pass. Content
validation, strict typecheck and production build pass. Committed on
`mvp/completion`; no publication or main modification performed for this pass.
