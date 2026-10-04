# Decisions and gaps
## Confirmed from discussion
- Verbs first; expand later.
- Fixed complete pools with shuffled order, like driving-licence question blocks.
- Offline core; no LLM requirement.
- Local saved progress and revision.
- Windows first. Keep Linux compatibility in the architecture; Linux runtime verification and iPhone/iPad access/testing are later. Eventual installability/hosting remains a goal.
- Modular content, with everyday and technical learning contexts.
- Avoid delaying practice while preparing a giant curriculum.

## Implementation defaults chosen for this handoff
| Decision | Default | Reason |
|---|---|---|
| Platform acceptance | Windows desktop, primary browser Edge | Focus V1 testing; Linux/mobile later |
| Application stack | TypeScript/React/Vite PWA | Browser/mobile/offline path |
| Local persistence | IndexedDB | Transactional session/history storage |
| Block size | 40 questions, 10 constructions initially | Complete usable starter |
| First exercises | Two typed clozes + case and meaning choices per entry | Recall plus contextual recognition |
| UI language | English, German exercise content | Clear initial instructions |
| Revision | Wrong/assisted subset after full run | Small useful V1; scheduler later |
| Theme | Navy header/light surface | Readability and earlier reference style |
| Progress portability | JSON backup replace | No account/server needed |
| CEFR labels | Null unless independently established | Avoid guessed certification |
| Runtime dependencies | Small, locked compatible set | Reproducible maintenance |

These are agent-chosen defaults, not claims that every detail was previously approved. None prevents implementation.

## Known gaps and ownership
- Existing local code/screenshots are not an accessible repository in this workspace. This is a fresh starter; do not overwrite a laptop project. If continuing an existing project, provide that actual repository for inspection first.
- Source reference retrieved: duplicate-heavy, not 200 distinct verbs. The initial block is sufficient; the larger curriculum needs editorial work.
- Agent can build/test in its available environment; Yacine verifies Windows installation and usability for V1. Linux and iPhone/iPad testing are deferred.
- Initial install and dependency downloads require connectivity. Core practice after successful caching does not.
- Offline storage is device/browser/origin-specific and may be cleared. Backups are required for user-controlled recovery; V1 has no automatic sync.
- A shared/unlisted URL is not private access control. Hosting and privacy are separate choices after prototype validation.
- No account credentials, API keys or paid subscription decisions are needed to prepare/build the core.
- Usage/time estimates from earlier conversation were rough planning estimates, not measured quotes. No reliable allowance consumption can be promised before implementation.

## User scope update — 3 October 2026
The Windows-first decision supersedes the earlier Windows-plus-iOS V1 testing scope. Architecture, learning logic, content, persistence and offline requirements remain. Linux portability is retained; Linux execution verification and mobile polish/testing are explicitly future work.

## Ready to start
No missing product decision blocks the first milestone. Preserve the seed pack and implement. Ask only when an actual environment restriction or existing conflicting project requires a choice.

