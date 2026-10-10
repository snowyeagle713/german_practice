# Final viewport efficiency pass — 10 October 2026

Scope: `mvp/completion`, layout only. Content, typography, palettes, sidebar visual
identity, practice/grading, saved data and PWA logic are preserved. No main changes,
merge or publication is part of this pass.

## Audit and root causes

The initial rendered audit showed Home already fitting at 1920×1080. At 1600×900,
Home had 144px of document overflow. Its stacked block actions, capped welcome-copy
width and cumulative vertical gaps used space that could be reclaimed horizontally.
Practice separated its session notice, end-run disclosure and navigation into
multiple rows before the question. Report/settings cards inherited 850px maximum
widths, 30px padding and 24px top margins, producing narrow, lengthy stacks.

The shell independently sized the main region and sidebar using different `100vh`
subtractions, then added a separate footer and outer padding. This did not itself
cause Home overflow at 1920px in the measured baseline, but duplicated the viewport
budget and made footer placement depend on several unrelated constants.

## Shared geometry

The shell now has a content-growing `min-height: 100dvh`; it has no fixed height.
The workspace is a flex column with a flexible main area and an in-flow footer.
Main no longer computes an independent viewport minimum. Sidebar viewport height
uses the shared shell-spacing token and `100dvh`, retaining its existing appearance.
Desktop main/header/footer padding is tighter. Overflow is never hidden to remove
scrollbars, and no CSS zoom or typography reduction was introduced.

## Page composition

- Home uses more width for welcome copy and puts block actions beside its content
  on wide screens. Current seed content fits at both 1920×1080 and 1600×900.
- Practice keeps mode/counter/checked totals, progress and one navigation/end-run
  row above the question. The autosave notice is retained inside the card below
  the workflow. Opening End this run expands in normal flow without covering the
  question. The question card starts at about 195px on the 1920px capture.
- Learn retains its compact title/progress row, sticky selection-aware construction
  rail and wide example columns. At heights below 900px the card footer is static:
  visual QA found that its previous stickiness covered the technical example at
  1366×768. Short screens now scroll that content normally.
- Blocks gets a smaller introductory gap; block cards still flow normally as the
  pack grows. No single-block fixed-height assumption is added.
- Progress/Revision uses the shared report grid, wide theme columns, compact rows
  and history actions alongside session details. It remains a scrolling report.
- Settings puts preferences and backup alongside one another, with offline controls
  below. Import previews and additional status information can grow normally.
- Summary puts type/construction breakdowns alongside one another; score cards,
  revision details and actions remain intact. Longer summaries can scroll.

## Viewport and visual checks

| Content viewport, default 100% scale | Result |
|---|---|
| 1920×1080 | Current Home and Blocks have no document scroll; ordinary unanswered question/answer/hint/reveal/check workflow is in view; Learn starts high with wide examples. |
| 1600×900 | Current Home and Blocks have no document scroll; ordinary unanswered workflow remains in view; Learn content begins near the top. |
| 1366×768 | Content may scroll normally; controls remain reachable, horizontal overflow is absent, and Learn footer does not cover examples. |

Tests resize across 1400/1399, 1201/1200, 1101/1100, 901/900 and 768px, checking
selection visibility, keyboard/control access, horizontal geometry and that the
footer follows content. All three authored question types are exercised.

Screenshots are produced by `tests/e2e/viewport-efficiency.spec.ts` in Playwright's
ignored `test-results` directory: Home, unanswered Practice, feedback, Learn,
Progress/Revision, Settings and Summary at all three requested viewport sizes.
Home/report/settings captures are full-page images; Learn/Practice captures use
the viewport. Copies are retained as review artifacts outside the repository at
`/workspace/artifacts/viewport-efficiency/`. Screenshots were inspected and used
to correct the short-screen sticky-footer issue.

Verification commands: `npm test` and
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e` (includes
content validation, strict typecheck and production build). Results are recorded
with the completed checkpoint. These are Linux Chromium checks. Windows/Edge
acceptance at actual monitor resolutions and browser zoom remains a device check;
monitor dimensions also need to allow for browser chrome.

Test-run observation: the first parallel browser run passed 49/50 checks; the
cross-tab update test remained in its existing UPDATE_BLOCKED / "Update deferred"
state immediately after the second tab reloaded. That test passed unchanged in
isolation, including history retention and a fresh offline launch. No PWA logic
was changed. A complete single-worker run is used for the final regression result
below, reducing concurrent-browser contention around the update handshake.

Final results: 193 unit tests and all 50 browser tests pass. The complete browser
command was `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=1`.
Content validation (10 entries, 40 questions), strict typecheck and production build
pass. All 21 viewport screenshots are retained in the review-artifact directory.
