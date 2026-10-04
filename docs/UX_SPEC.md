# Screen and interaction specification
## Default presentation
Working name: German Trainer. Subtitle: Fluency + Technical.
English UI instructions with German exercise content. Dark navy header, light reading surface, restrained blue accent; echo the reference style without copying its dense PDF layout.
Use system fonts, large readable text, 44 px minimum touch control target, labelled controls and visible focus. Correct/incorrect feedback uses text plus colour. Never require hover.
Windows V1 uses a compact header with Home, Blocks, Progress and Settings. Let controls wrap or stack at narrower desktop widths. Mobile-specific bottom navigation is a later option.

## Screens
| Screen | Main information | Primary actions |
|---|---|---|
| Dashboard | Resume card, available starter block, recent completed-run summary | Resume, Browse blocks |
| Blocks | Title, construction count, question count, latest first-pass result | Learn, Start full block |
| Learn | Construction/rule, meaning, everyday and technical examples | Previous, Next, Start practice |
| Practice | Mode, question number, prompt, input/choices, optional Hint/Reveal | Submit, then Next |
| Feedback | Answer, full sentence, explanation, assistance label | Next |
| Summary | Coverage, unaided correct, assisted/wrong, full-run accuracy | Revise mistakes, Repeat block |
| Progress | Completed runs and latest per-block result, revision counts | Open block |
| Settings | Backup export/import, installation guidance, offline/update state | Export, Preview import |

## Edge states
- Existing active run: Resume or explicitly Abandon and start; no silent overwrite.
- Empty mistakes: All questions were answered unaided correctly; repeat full block remains possible.
- Storage error: retain available in-memory response, explain save failure and retry. Do not advance as if saved.
- Invalid content: show actionable error; no partial malformed question session.
- Invalid/unsupported backup: explain why and leave current progress untouched.
- Offline ready versus caching incomplete: display honest state; first-load failure cannot be represented as ready.
- New version: update prompt only at safe boundary.
- Archived history: label content no longer in this pack.
- Windows keyboard and mouse: input, Submit and feedback remain reachable at the required viewport widths. Mobile keyboard behaviour is deferred.

## Acceptance expectations
No horizontal scroll at 768, 1280 or 1920 px. Keep adaptable layout foundations; 375 px touch-device polish is deferred. Keyboard completes every main action. No answer visible before submit/reveal. Reload after feedback returns to feedback without regrading. Resume recovers order and selected choice IDs.

