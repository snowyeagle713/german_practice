# V1 requirements
## User objective
Begin useful German practice promptly on Windows desktop. Retain Linux-portable browser architecture and a path to iPhone/iPad later; those platform tests are not V1 release gates. Vocabulary should support everyday fluency and technical/engineering situations. Build verbs first, with content and domain boundaries that allow nouns, adjectives and grammar later.

## Required
R1. Dashboard shows block count, current session and a simple recent progress summary.
R2. Blocks have fixed, explicitly authored question-ID pools. The seed contains exactly 40 questions. Later blocks may have fewer if clearly labelled; never pad with duplicates to reach 40.
R3. Learn displays each construction, English meaning, preposition/case and everyday/technical examples.
R4. Full block asks every question exactly once in a shuffled order. A new run may produce a different order; no need to force difference each time.
R5. V1 supports typed preposition cloze, contextual case choice and meaning choice. Each has authored answers and explanation.
R6. Submit shows feedback; Next is explicit. Enter submits, then advances only on a subsequent key press. No accidental double submission or hidden answer leakage.
R7. Persist current session order, index, feedback, submitted answers and counters. Reload and resume reproduce the same state.
R8. First-attempt results determine block score. Hints/reveal are tracked separately and never credited as unaided correct.
R9. Mistakes mode uses that block's latest first-pass wrong/hinted questions. Revision improves practice history but does not overwrite the original run score.
R10. Summary distinguishes completion, correctness, assistance and practice counts. Completing a block is not language mastery.
R11. Store progress locally in IndexedDB. If storage fails, show an honest error and offer retry/export of available state; never show false saved status.
R12. Export a versioned JSON backup. Import validates fully, shows a summary, asks the app user to replace current progress, and commits atomically. Invalid imports leave current data unchanged.
R13. Built app works offline after initial successful caching. All required content, scripts, styles and icons are local/cached.
R14. Manifest supports browser installation on Windows where available. Provide Windows installation/reopen guidance and cache readiness status. Verify the documented launch behaviour with and without the local server; mobile installation guidance is later.
R15. Updates do not replace an active run's content mid-session. Preserve old session content snapshot until completion; apply new assets at a safe reload boundary.
R16. Adaptable, keyboard-accessible Windows layout at 768 px, 1280 px and 1920 px viewport widths. Visible labels, focus styles, non-colour feedback, no horizontal overflow. Avoid fixed desktop-only assumptions, but 375 px mobile polish is deferred.
R17. Validate content, test domain behaviour, build and exercise main browser flows.

## Explicitly later
Linux runtime verification, iPhone/iPad installation and touch/device testing, mobile-specific polish.
Full 200-verb curriculum, nouns/adjectives/grammar packs, sophisticated spaced repetition, free sentence grading, conjugation generation, audio, speech recognition, conversation LLM, cloud sync, accounts, hosted access controls and desktop wrappers.

## Definition of done
All required automated checks pass, built-app offline reload is observed where tools support it, run instructions are reproducible, source/data are preserved and remaining device checks are explicitly listed. Windows real-device checks are required before declaring the Windows release verified. If only another OS is available to the agent, label Windows verification pending. Linux/mobile checks are deferred rather than failed V1 gates. True private hosting is not implied by a desktop preview.

