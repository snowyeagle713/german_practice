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
