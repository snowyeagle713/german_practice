# Stage 1.5 — Lingua Learning refinement

Completed 4 October 2026. This checkpoint changes presentation only. Stage 2 has
not begun; no practice, scoring, persistence, backups or offline logic was added.

## Visual decisions and scope

The user's locked Lingua Learning direction supersedes the original UX document's
navy top-header presentation. Original starter documents remain untouched. The
earlier exploration images were not available locally, so the implementation uses
the user's description: rounded learning sidebar, soft dashboard shell, progress
cards and a friendly but restrained educational feel. Lavender/violet with mint
details is the default palette. The prepared Finance palette uses navy/blue/teal.

- Replaced header navigation with a rounded left sidebar containing the same four
  destinations, active state, local SVG icons and a quiet study reminder.
- Reworked Home into a study banner, three content/study overview cards, a stronger
  starter-block card and a progress empty state. No invented scores, streaks or
  completed-session values; the progress card explicitly says Not recorded and
  practice is not available yet. Its empty track is decorative, not a progressbar.
- Improved block hierarchy, spacing, status chips and primary/disabled actions.
- Refined Learn with numbered construction links, an explicit reading-position
  indicator, grouped grammar rules and separate everyday/technical example panels.
  The indicator measures current construction position, not completion or mastery.
- Preserved content validation, all ten constructions and examples, authored
  content, URL navigation/history/reload, disabled practice and error recovery.
- Kept the left app sidebar at 768, 1280 and 1920 px. The construction navigator
  moves above the lesson at narrower desktop widths so the reading surface remains
  usable. Basic stacking remains available at small widths; mobile polish is deferred.

## Files and theme architecture

Changes are limited to `src/main.tsx`, the three UI screen/card components,
`src/ui/styles.css`, local `src/ui/Icon.tsx`, new `src/ui/theme/` files and browser
tests. No dependencies, domain/content/storage/PWA modules, starter specifications,
content schema or source pack changed.

`src/ui/theme/tokens.css` centralizes semantic color and shadow maps. Component CSS
consumes roles, not literal palette colors. The maps cover app/shell/sidebar,
card/elevated/subtle surfaces, borders, primary/secondary/inverse and sidebar text,
primary/secondary accents, success/warning/error/info, progress, active/inactive
navigation, disabled controls, focus and shadows. Shared radius/spacing/layout
rules live in the component stylesheet.

Lingua Learning is applied at bootstrap and is the CSS fallback. The complete
`finance-dashboard` map is internal and uses the exact same components and layout.
It includes sidebar foreground tokens so a dark sidebar does not force cards to
use inverse text. No theme switcher, setting persistence or new product flow exists.

See `src/ui/theme/README.md` for token names and the internal preview instruction.
A future JetBrains Spring or other palette needs a complete scoped CSS token map
and contrast/layout checks. The future Settings control can select the document
root's `data-theme` and persist through the planned settings adapter; no domain or
screen refactoring is required to change palettes.

## Verification

| Check | Result |
|---|---|
| `npm run validate:content` | Passed: unchanged 10 entries, 40 questions, one block |
| `npm run typecheck` | Passed |
| `npm run test` | Passed: 35 unit tests |
| Production build (also run by `test:e2e`) | Passed |
| `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e` | Passed: 10 browser tests |
| Source content and starter preservation | Passed: original pack/specification files unchanged; built content bytes equal seed |
| Visual inspection | Passed: Lingua Home/Learn and 768 px Learn, plus internal Finance Home |

Browser checks retain all original Foundation coverage and additionally confirm
left sidebar composition at each required desktop width. Both palettes exercise
navigation, disabled practice, honest progress semantics and core text contrast
(brand, active/inactive navigation, card primary/secondary text and primary action
meet 4.5:1). This is targeted evidence, not a complete accessibility audit.

Automation ran in Linux Chromium 151.0.7922.173, not Windows Edge. No cloud tooling
issue blocked this pass. Windows Edge visual rendering, keyboard/mouse use and
the required desktop widths must still be checked on the laptop. Full Linux
platform verification and mobile/device testing remain deferred as specified.

## Run and next stage

Existing portable commands remain: `npm ci`, `npm run dev`, `npm run build`,
`npm run preview`, and the validation/test scripts in the Stage 1 handoff.
The running cloud development preview is on port 5174. It must remain running to
open/reload this preview. No external deployment was made.

Stage 1.5 is complete and the app is ready for Stage 2 implementation under the
prepared plan. The original domain/content and future practice/storage/PWA
boundaries are intact. Windows acceptance is pending; this is not a verified
Windows V1 release.
