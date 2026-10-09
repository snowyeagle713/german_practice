# Windows / Microsoft Edge MVP guide

Use a checkout containing the `mvp/completion` implementation. The autonomous
completion request supersedes the historical full-40-session requirement: Standard
is 20, Quick is 10, while all 40 authored questions remain intact. Original starter
specifications are preserved; see MVP_COMPLETION_HANDOFF.md for current behaviour.

## Obtaining the review branch

This task leaves main unchanged and does not publish the development branch. If you
have the supplied `german-trainer-mvp.bundle`, copy it next to your local repository
and, while on another branch, import the review branch:

```text
git fetch ../german-trainer-mvp.bundle mvp/completion:refs/heads/mvp/completion
git switch mvp/completion
```

The bundle includes the preserved starter/Stage 1/1.5/2 history and MVP commits.
No force option or main merge is needed for local review.

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
npm run test:e2e
```

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
In Settings, wait for **Offline ready · 7 required files cached** (the count may
increase with future assets). Readiness verifies a controlling worker and the
actual cached build/content bytes. Install using Edge's address-bar app icon or
**… → Apps → Install this site as an app**, then open it from Start/taskbar.

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

## Data and backup

Data is local to this browser profile/origin. Export a JSON backup from Settings
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
- [ ] Home, grouped Learn, Blocks, practice and feedback fit 768/1280/1920 px at normal zoom.
- [ ] Native keyboard controls, focus, Enter, radio arrows, Previous and Skip work in Edge.
- [ ] Standard is 20 by default; Quick is 10; repeated runs rotate through the 40-question pool.
- [ ] Closing/reopening Edge or the installed app resumes order, drafts, hints, feedback and deferred questions exactly.
- [ ] Wrong/assisted revision clears only after unaided revision success; original scores stay unchanged.
- [ ] Finance and session-size preferences survive closing/reopening; layout remains Lingua.
- [ ] JSON export produces a file; cancel/invalid import preserves progress; replacement restores it.
- [ ] Address-bar install works; Start/taskbar launch displays the correct local icon/name.
- [ ] With production cache ready, stop the preview server, disconnect network and launch the installed app: Learn, practice, resume, revision, progress, history and themes work.
- [ ] With a rebuilt app/server available, update is deferred during an active run, then accepted when every tab is safe; saved results survive.
- [ ] Verify Edge storage permissions, available disk space, and behaviour of profile cleanup/enterprise policies on the intended machine.

Mobile installation/touch checks, native installers and other operating-system
release certification are deliberately deferred. Linux Chromium evidence verifies
portable application behaviour, not Windows integration or Edge install menus.
