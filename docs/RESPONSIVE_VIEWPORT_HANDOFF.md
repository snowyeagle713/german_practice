# Responsive viewport and dead-space pass

## Scope and assumptions
Continue `mvp/completion`; preserve all learning/domain/storage/PWA code, content,
semantic palette maps and typography. The CSS viewport, rather than physical display
resolution, determines layout. Test Linux Chromium at eight CSS sizes: 1700×950,
1700×1050, 1920×1080, 1366×768, 1024×768, 768×1024, 390×844 and 2560×1440.
The last case represents additional CSS space; it is not an actual browser-zoom test.
No Windows, iPad or phone hardware is available here.

## Root-cause investigation
Baseline is the actual starting commit `bbdf2a3`, not an older published build.
Computed styles and bounding rectangles were inspected before editing.

- **Reported desktop Practice blank band:** not reproduced in the current build.
  Card top was 194.91px at 1700×950 and 1700×1050. Practice was ordinary block flow:
  no height/min-height, expanding rows or `space-between` distribution inside it.
  The main region grows to place the footer, but does not distribute its children.
  Do not claim an exact cause for the real Windows observation without inspecting
  that device/build. Explicit block-flow workspace styling preserves this invariant.
- **Actual phone Practice displacement:** the old ≤650px sidebar used a two-column
  navigation grid with a 20px top margin plus brand/padding. It occupied ~250px
  above the workspace; the question card started at 570.56px. Tablet widths retained
  a 180–210px sidebar and a tall construction guide before the lesson. These are
  structural width/navigation costs, not a Practice height allocation.
- **Reported laptop Home overflow:** also not reproduced at baseline; both
  1700×950 and 1700×1050 had `scrollHeight == clientHeight`. The existing shell
  already uses border-box `min-height:100dvh`, a flex-column workspace, flexible
  main and an in-flow footer. No new height subtraction, overflow hiding or zoom
  workaround was introduced. Older commit `65102c9` used the independent main
  `min-height:calc(100vh - 106px)` plus footer/shell padding; the previous local
  viewport checkpoint removed that arithmetic. Publishing this history includes
  that correction, but does not prove the Windows device was running that version.
- **Measured Learn overflow:** 3px at 1700×950 came from the construction rail
  setting the grid row's intrinsic height even when the lesson was shorter.
  Desktop rail size containment now lets the lesson determine row height. The
  rail stretches alongside it, remains sticky/bounded, and scrolls independently.

## Changes
- ≤1100px: reuse the existing sidebar as compact top navigation; no duplicate
  main-navigation component tree. Shell rows are explicitly auto/content plus
  the workspace, so spare viewport height is not allocated above the lesson.
- ≤700px: four labelled navigation links in one row, ≥44px tall; decorative icons
  omitted, names/focus/links retained. Content and reports stack naturally.
- Learn retains the desktop rail; narrower screens use a labelled native select
  with every construction and the same hash routes. One lesson component tree.
  Examples remain stacked on tablets/phones. Sticky lesson footer is disabled
  on narrower/short viewports to avoid collisions.
- Practice order: heading, mode/counter/checked count, progress, autosave note,
  navigation/end-run disclosure, question card. The closed controls-to-card gap
  is 10px. Open end-run details grow in normal flow. Autosave note moved from
  the card to the requested top information group. Grading/focus/save unchanged.
- Tablet Home uses the freed width for two dashboard columns; phone single-column.
  Settings selects and summary header remain contained/wrappable.
- Wide layout keeps the existing 1720px shell, 1360px main and 1120px Practice
  limits, side-by-side examples/feedback/reports. No typography or palette edits.

## Evidence and tests
`tests/e2e/responsive-viewport.spec.ts` records all six requested viewport metrics,
horizontal/vertical overflow, card positions, and seven screenshots per viewport.
It exercises all three answer types, completes a deterministic 10-question run,
checks summary/revision, all four palettes, navigation touch-target heights and
narrow construction selection. Existing resize and foundation tests now check
rail vs selector/top navigation according to the actual responsive layout.

Artifacts outside Git: `/workspace/artifacts/responsive-viewport/` contains
before/after numeric JSON, a screenshot index and the screenshots. Before values
use a fresh production browser context at the starting commit; after values use
the final browser tests. Summary and populated revision are after-only fixtures.

Before: starting commit bbdf2a3. After: responsive pass. All dimensions are CSS pixels.

| Viewport | Home overflow before → after | Learn top before → after | Practice top before → after | Horizontal overflow after |
|---|---:|---:|---:|---|
| 1700×950 | 0 → 0 | 131.7 → 131.7 | 194.9 → 223.4 | None across seven screens |
| 1700×1050 | 0 → 0 | 131.7 → 131.7 | 194.9 → 223.4 | None across seven screens |
| 1920×1080 | 0 → 0 | 131.7 → 131.7 | 194.9 → 223.4 | None across seven screens |
| 1366×768 | 245 → 245 | 131.7 → 131.7 | 194.9 → 223.4 | None across seven screens |
| 1024×768 | 657 → 393 | 131.7 → 312.9 | 194.9 → 301.4 | None across seven screens |
| 768×1024 | 751 → 313 | 599.2 → 374.3 | 289.0 → 295.4 | None across seven screens |
| 390×844 | 1539 → 1401 | 828.8 → 445.4 | 570.6 → 447.0 | None across seven screens |
| 2560×1440 | 0 → 0 | 131.7 → 131.7 | 194.9 → 223.4 | None across seven screens |

Home overflow on smaller screens is expected from stacked visible content. Desktop Practice moves down by the autosave-note line requested above its controls; the card gap remains 10px and all three normal question types fit at laptop-sized viewports. Learn overflow at 1700×950 changes from 3px to 0px.

Full six-value measurements and per-screen scrolling assessments are in the artifact JSON. All 56 screenshots were captured; representative laptop Home/Learn/Practice/feedback/summary, tablet Home/Learn, phone Home/Practice and wide feedback were visually inspected.

## Manual checks still required
On Windows Edge with 150% OS scaling and 100% browser zoom, inspect actual
`innerWidth/innerHeight` and loaded build before comparing. If using an installed
older PWA, apply the normal safe update from Settings after completing or abandoning the active run;
do not clear site data to update. Confirm Home footer fit, first question controls,
keyboard navigation, rail/selector transitions and long feedback/reports.
On actual iPad/phone, check touch, native select, software keyboard/input focus,
rotation, dynamic browser chrome and Safari rendering. Automated CSS viewport
emulation is not device, installation or accessibility-audit verification.

## Final verification and publication
- Node 24.19.0, npm 11.9.0; Linux Chromium `/usr/bin/chromium`.
- `npm test`: 193/193 tests, eight files passed.
- `npm run build`: content validation (10 constructions, 40 questions, one block),
  strict TypeScript check and production build passed.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=1`:
  final complete run 58/58 passed in 4.0 minutes, including production offline
  reload/new-page, active-run update deferral and data retention.
- A preliminary new test raced a saved transition; fixed by awaiting the question
  counter. An initial full run passed 57/58 with a legacy test expecting a left
  sidebar at 768px; updated its responsive navigation/selector expectations.
  The final complete run passed, rather than relying only on isolated reruns.
- `git diff --check` passed. Authored seed and starter documents preserved.
- Publish only `mvp/completion` with a normal fast-forward push. History includes
  previous unpublished layout commits `00bc13b` and `bbdf2a3`, preserving remote
  checkpoint `65102c9` and all earlier milestones. `main` remains at
  `eb782ec3e2dc83469d4359716a9d4500bbf1e2c9`.
- Automated responsive acceptance passes. Exact real-Windows symptom root causes
  remain unconfirmed; hardware/browser checks above are still required.
