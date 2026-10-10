# V2 runtime pilot handoff

Branch: `content/v2-runtime-pilot`, based on published `content/curriculum-architecture` (`0891e3150a0271bc786d117026abbbe58c537a9d`). Scope ends at twenty verbs; no further category/population work or main merge is authorized.

## Delivered architecture

- Separate closed `content/content-v2.schema.json` and strict discriminated v2 types. Only `verb-forms` is supported; unsupported future categories/templates fail validation.
- Native v2 `items` and block `itemIds` coexist with raw v1 `entries`. `validateAnyContent` dispatches structural versions without rewriting the v1 schema/data. Small shared lookup/label/snapshot helpers replace UI/storage assumptions about constructions; canonical records, authored questions, pure grading/state, IndexedDB and React remain separate.
- Fixed local catalog: unchanged seed plus `verb-forms-pilot.json`; validated globally unique identities. Vite serves/emits both original files and PWA precaches both along with built chunks. No runtime LLM, generator, network dictionary or new dependency.
- A worker runtime-version handshake prevents starting/importing v2 progress under an older controlling offline bootstrap. Existing Starter runs can finish, then the safe update can be applied in Settings. This avoids an old cached UI reopening new snapshots it cannot interpret.
- Blocks adds a section selector and alphabetical links. Home retains the accepted structure and Starter entry point, with truthful all-category inventory counts. Learn uses the existing rail/picker/navigation and a responsive principal-part grid. Practice keeps text/radio controls, feedback, Previous/Skip, explicit Next, hint/reveal and efficient workspace layout. All four palettes remain unchanged.
- Seven versioned templates over bounded text and fixed choices; the shared practice/domain grader keeps existing Unicode/spacing/case semantics without fuzzy grading or diacritic substitution. Canonical answer, context reconstruction, pool membership, references and hint leakage are checked before loading. Classifications include explicit irregular profiles alongside strong/weak/mixed.
- Progress combines current packs and identifies archived history by pack/question revision. Summary distinguishes verb facets; revision shows missed form/template labels and original scores remain immutable. Quick 10 / Standard 20 rotation uses authored unique pools, with v2 cursor keys including pack/version/block and existing v1 cursor keys untouched. No 30/40 mode.

## Pilot content

Twenty verbs: arbeiten, aufstehen, bleiben, bringen, denken, essen, fahren, finden, geben, gehen; haben, kommen, laufen, lesen, nehmen, schreiben, sehen, sprechen, werden, wissen.

Two alphabetically ordered ten-verb blocks, **70 questions each / 140 total**. Alphabetical browsing crosses block boundaries through explicit links. Common-prerequisite A1/A2 level estimates are disclosed; they are not assigned to old Starter content. The source audit is VERB_FORMS_PILOT_AUDIT.md; captured factual comparisons are `content/source/verb-forms-verification.json`.

## Data compatibility

IndexedDB remains database/store version **1**, with no destructive or structural migration. Existing transactions and optimistic revision guards are retained. v1 sessions remain raw and lack a new envelope field; v2 sessions carry `snapshotVersion: 2` plus their native schema-2 snapshot. Historic attempt `entryId` is retained as the stable learning-item reference to avoid gratuitously changing the transactional attempt shape; v2 questions use `itemId` and retain template/facet metadata in their immutable snapshot.

Backups read **1 and 2** with full validation before preview/replacement. Exports containing only v1 sessions remain schema 1; any v2 session produces schema 2, including mixed v1/v2 history. Newer schemas, missing/mismatched snapshot envelopes, corrupt references, forged grading/feedback and schema-1 files containing v2 snapshots fail closed. Older MVP versions reject a v2 backup rather than partially import it. Keep an original v1 backup if returning to the old release. Do not downgrade the same origin/profile with v2 records present: an older MVP cannot interpret those records. Retain a v2 export, then restore a v1-only backup explicitly through the new app or use a separate profile for the older release. Existing saved data is never auto-regraded, remapped or erased by loading the new content.

`tests/fixtures/mvp-v1-backup.json` was generated using the original `v1.0.0-mvp` source in an isolated temporary checkout: paused Starter, assisted feedback, typed draft, cursor and Finance preference. Compatibility tests import/resume it and preserve its original snapshot/evidence while adding v2 sessions.

## Verification and remaining gates

Commands:

```text
node --import tsx scripts/validate-curriculum-map.ts
npm run validate:content
npm run typecheck
npm test
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=1
```

Linux environment: Node 24.19.0/npm 11.9.0, system Chromium. Final checks passed: planning-map validation; v1 content (10 constructions / 40 questions / one block) and v2 content (20 verbs / 140 questions / two blocks) validation; strict TypeScript; **368/368 unit tests** across eleven files; production build; **71/71 production browser tests**, one worker, 4.4 minutes; `git diff --check`. Normal-flow error probes observed no page/console errors. The upgrade test also proves that an older worker contract blocks v2 writes/imports until a safe update while preserving Starter evidence. Browser tests cover catalog/alphabetical Learn, all seven templates, hints/reveal, immutable feedback/drafts, 10/20 variation, revision/original summaries, real v1 import, v2 fresh-profile restore, production offline fresh-page launch and desktop/laptop/tablet/phone widths. No Linux result is a Windows-device certification.

Windows branch setup from an existing clean checkout: `git fetch origin`, `git switch content/v2-runtime-pilot`, `npm ci`, `npm run build`, then `npm run preview -- --port 4173 --strictPort`. Use the existing origin/profile to verify compatibility; confirm offline readiness and apply a waiting update after finishing active runs.

Windows Edge manual follow-up: installed app launch/icon, reopen offline with server stopped, native export/import dialogs, old browser-profile upgrade retaining v1 history/settings, v2 exact resume, 150% display scaling, keyboard/zoom, safe update across tabs and local profile/disk restrictions. Actual phone/tablet touch/software keyboard/installation is also unverified; CSS viewport smoke tests cover their sizes.

Readiness after all gates pass: the **Verb Forms** v2 pipeline is available for separately authorized reviewed batches. This does not enable noun/collocation/grammar handlers, unrestricted sentence grading or all 2,660 records. Source-review limits remain explicit. Stop after this pilot, commit and push normally; do not merge main.

## Review evidence and preliminary findings

Screenshots are committed under `docs/screenshots/v2-pilot/`: blocks, Learn, Practice, feedback, summary, Progress and phone Learn. The screenshot gallery records viewport sizes and capture commands. Production `seed-pack.json` remains byte-for-byte unchanged; v1 schema, starter specs, curriculum map, palette maps, IndexedDB implementation and dependency lockfile have no diff from the approved baseline.

Preliminary checks caught and resolved an error-message prefix regression in v2 validation. New unit fixtures were corrected to respect the existing ß/SS policy and existing repository metadata; no grading/storage policy was altered. An early targeted browser run saw a failed initial worker preparation; it passed in the isolated check and both subsequent complete offline runs. Offline claims still require confirmed readiness; the existing preparation/retry UI is retained. The legacy-worker test uses a real local HTTP origin because browser worker-script requests bypass page-route interception; it models the original READINESS contract, not a claim of actual Windows-installed upgrade testing.

Publication is limited to a normal push of this review branch. Main remains unchanged. The final commit hash is available via `git log -1` and the branch remote, avoiding a self-referential commit hash in this file.

Screenshot capture was normalized to scroll position zero after visual inspection found full-page sticky/fixed-element capture artifacts. Application assets stayed identical to the complete-suite build; the final **12/12 pilot browser tests** passed again with the corrected capture helper, along with content validation/typecheck/build.
