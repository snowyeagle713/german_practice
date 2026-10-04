# Learning and question behaviour
## Fixed blocks
Default target: 40 authored questions, not necessarily 40 verbs. The initial block has 10 constructions × 4 questions: everyday preposition cloze, technical preposition cloze, case choice and meaning choice.
A construction/meaning is its own entry. sich freuen auf and sich freuen über remain separate; the same lemma is not necessarily a duplicate.
Each complete run covers its manifest exactly once. Shuffle order with Fisher–Yates and a test-injectable random source; do not sort using a random comparator. Choice order can shuffle once and must be saved for resume.

## Study and feedback
Learn mode is ungraded. All constructions are available before practice.
Question stem must supply enough semantic context for one intended answer. Put grammar clues only where they are inherent to the sentence; do not display the answer/rule beside an active cloze.
Feedback shows the accepted answer, full example sentence, English meaning and a brief explanation. Hint may reveal the construction rule; Reveal gives the solution. Both mark assistance.

## Grading
Typed preposition: Unicode NFC, trim, collapse internal whitespace and lowercase. Compare to a finite authored acceptedAnswers list. Do not globally remove diacritics or replace ß: correctness policy must remain explicit. No fuzzy matches or general free-sentence grading.
Choice: compare stable choice ID, not visible position or translated text.
An empty typed submission does nothing and displays guidance.
Each first question submission is recorded once; duplicate events are idempotent. A revealed question counts as assisted and unaided incorrect, even if the user later enters the solution.
First-pass unaided correct means correct AND no hint/reveal. Block accuracy = unaided correct / pool size when complete; while active show answered accuracy separately with its denominator. Coverage = distinct submitted question IDs / pool size.
Incorrect and assisted questions enter the session's mistakes set.
Extra attempts live in separate revision sessions. They never retroactively alter the full run score.

## Revision
Mistakes uses the latest completed full run for that block, or submitted questions in the current run if explicitly chosen. Default UI launches it after completion. Its fixed subset is shuffled once. If none exist, show a clear empty state.
No scheduled spaced repetition in V1. Keep attempt timestamps so a later scheduler can be introduced. Repeating full blocks remains available regardless of accuracy; no mandatory progression lock.
An overall history view may show latest full-block accuracy, completed runs and revision attempts. Avoid a single mastery percentage; recognition and typed recall are different evidence.

## Editorial rules
Authored accepted answers, alternative interpretations and explanations must be checked when content expands. Do not create automatic distractors or exercise templates from arbitrary LaTeX.
Use everyday and technical examples, with grammar at a practical B1–B2 starting level and room to expand towards C1. These are learning goals, not certified CEFR labels.

