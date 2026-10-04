# Stage 1 — Foundation handoff

Implemented 4 October 2026. Stage 1 only; this is a study preview, not the completed V1.

## Delivered

- Strict TypeScript, React and Vite scaffold with plain CSS, English UI, German content,
  system fonts, navy header, reading surface, visible focus and portable npm scripts.
- Home, Blocks and ungraded Learn. All ten constructions are available in authored
  order, with English meanings, preposition/governed case, reflexive case where
  applicable, and everyday/technical examples with translations.
- Previous/Next and direct construction navigation, browser Back/Forward, deep links,
  and restoration of the selected Learn page from its URL after reload. This is URL
  navigation, not saved session/progress functionality.
- Block counts derive from manifest membership. No synthetic scores or completion
  records. Practice controls are disabled; Progress and Settings explain availability.
- Runtime structural validation with the supplied JSON Schema (Ajv 2020), plus the
  reference/integrity checks of the supplied Python validator. Invalid or unavailable
  content blocks study and shows details/retry; content is rendered as React text.
- One authoring source: Vite serves `content/seed-pack.json` in development and emits
  its exact bytes to `dist/content/seed-pack.json` during build. The browser loader
  validates fetched JSON before giving it to UI. No legacy source content is loaded.
- Vitest content/lookup tests and Playwright built-app Foundation tests.

The original starter files, specifications, seed, schema and Python tool are unchanged.
`README.md` remains the original preparation record; this file describes the new app.

## Structure and assumptions

`src/domain/content/` contains pure types, validation and selectors. `src/content/`
contains browser asset loading. `src/ui/` contains the shell, BlockCard, Learn and CSS.
`scripts/validate-content.ts` reuses the runtime validator with Node.
`tests/unit/` and `tests/e2e/` keep domain and browser checks separate.

Boundary README files reserve `src/domain/practice/`, `src/domain/progress/`,
`src/storage/` and `src/pwa/` for the specified later stages. No session engine,
grading, shuffle, IndexedDB, backup, service worker, manifest, offline or update logic
is implemented. These stay in the prepared architecture; no new scope was introduced.

Stage 1 assumes study is ungraded and all constructions are immediately available.
Null CEFR values remain unset. Fixed 40-question content is validated, not practised.
Hash URLs give browser navigation without a routing dependency or server rewrite
requirement. No state framework, UI suite, native wrapper or external runtime service.

## Runtime and launch

Use Node **24 LTS** (tested: 24.19.0) and npm 10 or newer (tested: 11.9.0).
The supported engine range is Node 22.12+ in the 22 line, 24.x, or 26+; Node 20 is
excluded because the selected Vitest release requires newer Node. Package engines
and peers were queried before installation. Exact direct versions are in package.json;
package-lock.json pins the dependency tree. Selected releases: React 19.3.0,
Vite 8.3.2/plugin-react 6.1.1, TypeScript 7.0.2, Vitest 5.0.3, Ajv 8.20.0,
Playwright 1.63.0 and tsx 4.23.15. Python is not required for app commands.

From the project folder on Windows or a compatible environment:

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite in Edge (normally http://127.0.0.1:5173).
For the built version:

```sh
npm run build
npm run preview
```

Open the printed preview URL (normally http://127.0.0.1:4173).
Stop either server with Ctrl+C. Keep it running when opening/reloading this Stage 1
app. Double-clicking index.html is unsupported. No install/offline capability is
claimed, and nothing was deployed or published.

## Reproduce checks

```sh
npm run validate:content
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

`test` runs once, not in watch mode. `build` also validates content and typechecks.
`test:e2e` builds before starting a strict-port production preview, and shuts that
preview down after tests. Port 4173 must be free. The standard browser is Playwright
Chromium; Windows Edge acceptance remains a separate real-device check.

The cloud already provides Chromium. Its browser check command was:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

This environment variable is optional and is not embedded in npm scripts. With a
Playwright-managed browser installed, the normal `npm run test:e2e` needs no override.

## Results

| Check | Result | Evidence |
|---|---|---|
| Lockfile clean install (`npm ci`) | Passed | 57 packages installed using the cached lockfile dependencies |
| Node content validation | Passed | 10 entries, 40 questions, one block; structure and references valid |
| Original Python validator cross-check | Passed | Same counts and valid structure/references; optional cross-check only |
| Strict TypeScript typecheck | Passed | Includes app, tooling and tests, with unchecked index access enabled |
| Vitest | Passed | 35 tests: seed contract, selectors and rejection of invalid schemas, duplicate IDs, references, answers, choices, clozes and incomplete coverage |
| Production build | Passed | Local JS/CSS plus exact authored content asset emitted |
| Playwright Foundation suite | Passed | 8 tests on Linux Chromium 151.0.7922.173, against production output |
| Development server smoke and visual check | Passed | Source content bytes, Home/Learn navigation, no browser page errors; Learn screenshot inspected at 1280 px |
| Starter-file preservation | Passed | No diff against origin/main for original tracked starter files |
| Windows Edge real-device verification | Not run | Linux cloud has no Windows/Edge device |
| Practice, storage, offline and release checks | Not run | Stages 2–5 intentionally outside this task |
| Full Linux platform and mobile verification | Not run | Deferred by the Windows-first specifications |

Browser checks cover all ten Learn cards and both example domains, block counts,
disabled practice, Back/Forward and URL reload, keyboard navigation, 768/1280/1920 px
overflow checks, unavailable/invalid content with retry, unknown links, safe text
rendering, and byte-for-byte build content preservation.

Cloud restrictions initially blocked registry networking, a CLI IPC socket and a
dependency binary check. Scoped cloud tool permission allowed registry/dependency
installation and local browser/server checks. Content validation uses `node --import
tsx` to avoid the CLI IPC requirement. These issues were resolved; no outstanding
Stage 1 setup blocker remains. Windows prerequisites are not configured remotely.

## Windows follow-up and acceptance

On the Windows laptop, verify Node/npm installation and `npm ci`, build, launch/reopen
in Edge, keyboard/mouse navigation, readable German characters and focus, and all
three required viewport widths. Review clarity of the construction rules, translations
and everyday/technical examples. The source is prototype-reviewed, not an independent
language-teacher review. Saving, file pickers, install/offline and update checks belong
to later stages and must be verified when those features exist.

**Stage 1 acceptance criteria are satisfied:** scaffold, scripts/lockfile, validated
content loader, adaptable desktop shell, Blocks and Learn, strict typecheck, production
build, and preserved source pack. This result is not a Windows-verified V1 release.
Stage 2 may begin as a separate task using the existing implementation plan.

# Stage 2 — Practice handoff

Completed 4 October 2026. Stage 1.5 Lingua UI is retained; Stage 2 adds in-memory
full-block practice and summaries. Stages 3–5 have not begun. Earlier sections above
are historical Stage 1 results; this section describes the current checkpoint.

## Delivered and files

- New `src/domain/practice/types.ts`, `shuffle.ts`, `grading.ts`, `session.ts` and
  `summary.ts`: serializable contracts, Fisher–Yates, authored grading, immutable
  lifecycle and first-pass summaries. Updated the practice boundary README.
- New `src/ui/usePractice.ts`, `Practice.tsx` and `Summary.tsx`; updated App, BlockCard
  and Learn entry points. Extended the accepted stylesheet using existing semantic
  tokens; the default and internal Finance maps are unchanged. Updated theme README
  wording to describe enabled practice entry points.
- Added domain practice tests and browser practice tests. Existing Foundation/theme
  assertions now expect enabled practice entry points; their other checks remain.
- Updated this implementation handoff. Original starter files and all content/specs
  remain unchanged. No dependency, schema, storage or PWA changes.

## Session architecture and grading

One in-memory session is owned above page navigation. Creation validates content,
clones only the selected block's questions and referenced entries, injects random/
clock/ID sources, and retains a full question permutation plus per-question choice
orders. The real seed always produces exactly 40 unique authored questions.
Commands carry question IDs. The pure reducer guards lifecycle and ID before acting:
answering -> feedback -> answering (Next) -> completed after the final feedback.
Empty input cannot submit; unanswered questions cannot advance. Duplicate submit and
stale/repeated Next cannot create extra attempts or affect the next question.

The seed contains 20 `preposition_cloze`, 10 `case_choice` and 10 `meaning_choice`
questions. Text uses Unicode NFC, trim, collapsed whitespace and lowercase, then
matches the finite authored accepted-answer list. Diacritics/ß are preserved; there
is no fuzzy or free-sentence grading. Choices are compared by stable ID, independent
of display order. Raw learner responses remain visible and are cloned into attempts.

Hint reveals construction/case and meaning; Reveal displays the authored answer.
Both are explicitly marked as assistance. The learner still submits a nonempty text
or chosen answer. Correct/wrong report authored matching; assisted may overlap either.
Unaided correct requires a correct answer without hint or reveal. Revealed answers
never earn unaided credit, even when the solution is subsequently entered correctly.

Feedback keeps the prompt and response, labels correctness/assistance in text,
provides the accepted answer, authored explanation, full example, translation and
construction meaning. For case questions with null exampleId, feedback uses the
entry's first authored example as context. No extra answer/rule is displayed before
submission unless Hint or Reveal is explicitly requested.

Keyboard: Enter checks an answer; a subsequent Enter advances from focused Next.
Held/repeated Enter is ignored. Native radio inputs support Tab, Space and arrow
selection. Next is separate from the answering action and ignores second clicks in
a double-click sequence. Focus moves to feedback's Next action, then the next input
or question heading. All primary actions have visible focus and text status.

## Summary and Stage 3 boundary

Summary reports total correct/wrong, assisted, unaided score over the full pool,
exact coverage and evidence per question type. The wrong/assisted list includes
question IDs, prompt, response, accepted answer and explanation. It is reviewable
information, not a revision session. Repeat starts a fresh shuffled full pool.
Correct/wrong counts sum to 40; assisted is an overlapping label, not a third bucket.
Scores describe first-pass evidence and do not claim mastery or exam readiness.

Sessions include IDs, pack/version, timestamps, order/choiceOrders, current index,
draft and assistance flags, feedback, content snapshot, attempts and submitted IDs.
Attempts include session/question/revision/entry IDs, timestamp, response, correct,
hint/reveal and unaided flags. Summary includes exact counts, type evidence and
unique wrong/assisted IDs. All are JSON-serializable; they can be used by Stage 3
application operations with a transactional storage adapter. No adapter or database
was created. Stage 3 must save an initial session before displaying it and persist
attempt/session changes atomically before claiming a successful save.

Navigating within the app retains the current run/feedback. Starting while active
requires Resume or an explicit Abandon and start action. Replacement discards the
old in-memory run. Reload/closing the page discards everything; the UI states this
and does not claim Saved. Home shows only the current page visit's run/result;
Progress explains that saved history is unavailable. No history, durable resume,
revision sessions, backups, export/import, PWA or offline work is implemented.

## Results and run commands

| Check | Result |
|---|---|
| `npm run validate:content` | Passed: 10 entries, 40 questions, one block |
| `npm run typecheck` | Passed: strict application, domain and test checks |
| `npm run test` | Passed: 117 tests across content and practice suites |
| `npm run build` | Passed: validation + typecheck + production Vite output |
| `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e` | Passed: 17 built-app browser tests |
| Starter/content/theme preservation | Passed: no changes against Stage 1.5 baseline |
| Visual inspection | Passed: Practice prompt/answer and Wrong-feedback views |
| Windows/Edge real-device checks | Not run: Linux cloud only |
| Stage 3 saving/revision and Stage 4 offline checks | Not run: outside this task |

Unit checks cover 30 random seeds with exact full-pool membership, known different
shuffle sources, stable choice IDs, source/snapshot isolation, normalization and
near-misses, grading every authored question correctly/incorrectly, missing input,
assistance, first/intermediate/final lifecycle, stale/duplicate events, immutable
feedback responses, 0%/100% and mixed summaries, overlap, timestamps and serialization.

Browser checks complete all 40 real questions once (not a reduced pool) and verify
mixed expected totals: 30 correct, 10 wrong, 20 assisted, 10 unaided correct/40 = 25%.
They also test repeat, empty submissions, held Enter, native radio keys, double-clicks,
active-run replacement/resume within the page visit, reset after reload, all three
viewport widths, and existing Learn, invalid-content, safe-text and palette behavior.
Automation ran in Linux Chromium 151.0.7922.173. No unresolved cloud tooling blocker.

Use the existing commands with Node 24 LTS and npm 10+:

```sh
npm ci
npm run dev
npm run validate:content
npm run typecheck
npm run test
npm run build
npm run preview
npx playwright install chromium
npm run test:e2e
```

The cloud uses the supplied Chromium override above; ordinary Playwright-managed
browser runs need no override. Existing development preview is on port 5174. Local
server must remain running; there is no offline claim. Nothing was deployed or pushed
as part of Stage 2. The completed checkpoint is committed locally on `work`.

## Windows follow-up and acceptance

On Windows Edge, verify full-block start from Blocks/Learn, all three answer formats,
Tab/Space/radio arrows/Enter, held Enter and mouse double-clicks, visible focus and
feedback with the original answer, Hint/Reveal labels, the last question -> summary
transition, repeat, explicit active-run replacement, and readability/no horizontal
scroll at 768/1280/1920 px. Check that the in-memory limitation is clear. Reload is
expected to discard the run in Stage 2; durable recovery is a Stage 3 check. Review
question clarity and the useful balance of everyday and technical examples.

**Stage 2 acceptance criteria are satisfied for the authorized in-memory scope.**
The app is ready for Stage 3 as a separate task. Windows device verification remains
pending; full Linux platform and mobile verification remain deferred as specified.
