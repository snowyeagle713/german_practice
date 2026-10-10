# Windows / Microsoft Edge MVP guide

Use a checkout containing the `mvp/completion` implementation. The autonomous
completion request supersedes the historical full-40-session requirement: Standard
is 20, Quick is 10, while all 40 authored questions remain intact. Original starter
specifications are preserved; see README.md and RELEASE_READINESS.md for current behavior.

## Obtaining and updating the review branch

The review branch is published on GitHub. Clone it without modifying main:

```text
git clone --branch mvp/completion https://github.com/snowyeagle713/german_practice.git
cd german_practice
```

For an existing checkout, first preserve any local edits, then:

```text
git fetch origin
git switch mvp/completion
git pull --ff-only origin mvp/completion
npm ci
```

Keep using this branch until the final merge is separately approved. No force
option, bundle, history rewrite or main merge is needed for review.

## Prerequisites and development

Windows 10/11, current Microsoft Edge, Git, and Node.js 24 LTS with npm 10 or newer.
The locked Vite toolchain also accepts Node 22.12+ in the 22 line. Node 20 is not a
supported project runtime. Node 24.19.0 / npm 11.9.0 were used in Linux verification.
No Python, native wrapper, backend, account, API key or runtime cloud service is needed.

From the repository directory in PowerShell or Command Prompt:

```text
npm ci
npm run dev -- --port 5173 --strictPort
```

Open http://127.0.0.1:5173 in Edge. Keep the terminal running during development.
Development does not install a service worker and cannot establish offline readiness.
Do not open index.html as a file. Local learning data is specific to the browser
profile and origin; dev port 5173 and production port 4173 have separate storage.

## Checks and production build

```text
npm run validate:content
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e -- --workers=1
```

Single-worker execution is the verified release command. Earlier two-worker runs
showed cross-tab update timing sensitivity; the default configuration still uses
two workers. See RELEASE_READINESS.md for results and manual gates.

The browser suite starts its own production preview on port 4173. Stop an existing
preview on that port before running it. npm scripts and tests are portable. To use
an already installed Chromium in Linux, the verification environment sets
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium; that override is not needed
with Playwright's downloaded browser on Windows. Automated Chromium tests do not
replace Edge device acceptance below.

## Run and install the built app

```text
npm run build
npm run preview -- --port 4173 --strictPort
```

Open http://127.0.0.1:4173 in Edge. Use the same address (do not switch between
localhost and 127.0.0.1), port and browser profile on later visits.
In Settings, use **Prepare offline files** if readiness is incomplete, then wait for **Offline ready · 7 required files cached** (the count may
increase with future assets). Readiness verifies a controlling worker and the
actual cached build/content bytes. Install using Edge's address-bar app icon or
**… → Apps → Install this site as an app**, then open it from Start/taskbar. Chrome offers an install icon or its install-app
menu when installation is supported. Actual installed-window behavior is a manual
device check, not verified by the production browser automation.

After readiness, Learn/practice/resume/revision/history/settings/backups work
without the local server or internet. An initial online/server-available visit is
required. Keep the server available to receive a newly built version. The local
preview is suitable for acceptance, not an external hosting deployment. An eventual
host must serve dist at a stable HTTPS origin, including sw.js with correct MIME
and without stale HTTP caching; build paths currently target the origin root.

A waiting update is applied only after an explicit Settings action. Finish or
explicitly abandon active runs, wait for saves, and reload stale tabs first. Every
open app tab must agree it is safe. Updates replace asset caches, never IndexedDB.
Do not clear site data as an update procedure.

## Practice and themes

Standard Practice selects 20 unique questions; Quick Practice selects 10. New runs
rotate through the unchanged 40-question pool, then shuffle the selection. The
selection/order of an active run stays fixed. Typed preposition, case choice and
meaning choice use authored deterministic answers. Hint/reveal excludes unaided
credit. Previous retains graded answers; Skip defers unanswered questions until
later in the same run. Wrong/assisted questions remain pending revision until an
unaided correct revision attempt; revision never replaces the original run score.

Settings provides Lingua Learning (default), Finance Dashboard, JetBrains Spring
and Proton-inspired. All palettes share one responsive layout. Palette and new-run
size persist locally, and are included in backups.

## Data and backup

Data is in IndexedDB database `german-trainer`, local to this browser profile/origin.
There is no cloud sync. Clearing browser/site data deletes these records and offline
asset caches; browser cleanup policies can also remove them. Export a JSON backup from Settings
before changing computers/origins/profiles, clearing browsing data or uninstalling.
Keep the downloaded file privately; it contains your answers and history.
Import accepts schema v1 files up to 10 MiB, validates snapshots and scoring, shows
a preview and requires **Replace progress**. Cancel and invalid files leave data
unchanged. Replacement includes preferences and any active saved run; no merge.
Opening two tabs is supported for viewing, but a stale tab cannot overwrite saves:
reload it after the conflict notice. Storage failure blocks advancement; keep the
page open and use **Retry local save** after resolving space/storage restrictions.
The most recently committed state is recoverable on reload.

## Manual Windows / Edge acceptance (not performed in Linux)

- [ ] npm ci and all checks succeed with the documented Node/npm runtime.
- [ ] At Windows 150% scaling and 100% browser zoom, record actual CSS viewport size; verify Home footer fit and Practice controls without artificial gaps.
- [ ] Navigation/Learn/Practice/Settings/reports remain usable without horizontal overflow; natural scrolling is expected for long content.
- [ ] Native keyboard controls, focus, Enter, radio arrows, Previous and Skip work in Edge.
- [ ] Standard is 20 by default; Quick is 10; repeated runs rotate through the 40-question pool.
- [ ] Closing/reopening Edge or the installed app resumes order, drafts, hints, feedback and deferred questions exactly.
- [ ] Wrong/assisted revision clears only after unaided revision success; original scores stay unchanged.
- [ ] All four palette and session-size preferences survive closing/reopening; layout remains Lingua.
- [ ] JSON export produces a file; cancel/invalid import preserves progress; replacement restores it.
- [ ] Address-bar install works; Start/taskbar launch displays the correct local icon/name.
- [ ] With production cache ready, stop the preview server, disconnect network and launch the installed app: Learn, practice, resume, revision, progress, history and themes work.
- [ ] With a rebuilt app/server available, update is deferred during an active run, then accepted when every tab is safe; saved results survive.
- [ ] Verify Edge storage permissions, available disk space, and behaviour of profile cleanup/enterprise policies on the intended machine.

Mobile installation/touch checks, native installers and other operating-system
release certification are deliberately deferred. Linux Chromium evidence verifies
portable application behaviour, not Windows integration or Edge install menus.
