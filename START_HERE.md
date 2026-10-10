# Starting development and responsibilities

Implementation is complete on `mvp/completion`. This file preserves the original
preparation workflow; begin with README.md and docs/WINDOWS_MVP.md for current
run instructions, and docs/RELEASE_READINESS.md for release gates.
## Platform scope
Windows desktop is the V1 release target. Edge is the primary Windows acceptance browser. Linux remains an architecture/portability requirement; actual Linux testing is later. iPhone/iPad remains a future goal; installation, touch keyboard and mobile device testing are deferred. No native installer is required for V1.

## Can development start?
Yes. The requirements and starter content are sufficient to begin without further product decisions. Implementation defaults are recorded explicitly; they can be changed after testing.

## What the agent can do
Create the TypeScript/React application, install project dependencies where permitted, implement the practice engine and persistence, build the PWA, run automated checks and available browser tests, fix failures, and supply reproducible run instructions. It must report restrictions honestly.

## What Yacine needs to do
Preparation needs no manual coding. To use a different/local Codex environment, make this folder accessible to that environment. This chat's workspace and a folder on a Windows laptop are separate; extracting a ZIP on the laptop does not automatically connect it to a cloud agent.

Choose either:
- Continue implementation in the workspace where this starter has been prepared, if its development and preview capabilities support it.
- Extract the ZIP into a local folder, open that folder in a Codex-capable development environment, and use the supplied prompt.
- For a repository-based cloud environment, place the starter in a repository and connect/select that repository through the supported account interface. Account sign-in and repository access are user actions.

No Cursor subscription, API key, LLM service or Python runtime is required by the finished application. Python is only for the optional content tooling supplied here.

## Local development prerequisites
Node.js and npm, Git for version control, a browser and a Codex-capable environment. Select a supported Node LTS release meeting the chosen Vite version's requirements; verify actual installed versions before scaffolding. The locked project accepts Node 24 LTS or Node 22.12+ in the 22 line; Node 20 is not supported. Existing Python/PyCharm alone does not provide the JavaScript toolchain.

The agent should inspect first, not ask you to install everything pre-emptively. It must not claim to have configured your Windows laptop from this remote workspace.

After implementation the agent must provide these project scripts:
```sh
npm ci
npm run dev
npm run validate:content
npm run typecheck
npm run test
npm run build
npm run preview
npm run test:e2e
```
These scripts are now implemented. The committed package-lock.json is installed with npm ci; automated checks do not require Python. For current prerequisites and usage, follow README.md and docs/WINDOWS_MVP.md rather than the historical preparation instructions above.

## Your testing role
After the first build, spend roughly 15–30 minutes trying one block: answer correctly and incorrectly, reload mid-session, finish, revise mistakes, and export/import a backup. Judge whether feedback is clear and practice is useful.

For V1, verify Windows browser installation, keyboard/mouse use, offline launch and storage on your laptop. Automated tests run in the agent workspace do not substitute for that Windows check. Linux and iPhone/iPad testing are deliberately deferred.

## Offline and device access
The first visit/install must successfully load and cache the built application. Service workers need HTTPS or a trusted localhost development context. Opening index.html by double-clicking is not the supported run method.
For Windows V1, the app can be served locally on the same laptop; no external hosting is required. The agent must document how to start and reopen the local app, including whether its local server must be running. An installed shortcut alone is not proof of offline startup; test with the server stopped after successful caching.

Future device phase: an iPhone's localhost refers to the phone, not your laptop. A laptop's plain LAN HTTP address is not a sufficient production PWA/offline setup. Arrange an HTTPS preview/host when cross-device testing is scheduled.

Progress is local to each browser/origin/install context. No automatic device sync in V1; move backups manually. A hosted app with an unlisted link is not access-controlled. Truly private hosting is a separate deployment decision; offline copies already downloaded cannot be remotely revoked merely by protecting the host.

## References
- https://vite.dev/guide/
- https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable

