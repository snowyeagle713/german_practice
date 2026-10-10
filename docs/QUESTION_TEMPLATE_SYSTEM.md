# Question template system (proposal)

No new runtime question types are implemented here. Existing v1 `preposition_cloze`, `case_choice`, `meaning_choice` remain the only supported types. A template is an authoring recipe; a question is a fixed reviewed instance with an ID, revision, target facet, prompt/context, answer contract, explanation and source-linked item. Do not generate answers/distractors at runtime.

## Delivery and grading contracts

| Proposed contract | Response and grading | Publication condition |
| --- | --- | --- |
| Choice | Stable option IDs; exact correct ID; one unambiguous best answer | Existing choice handlers only cover the two named v1 types; generic choice needs a v2 handler |
| Bounded text | Explicit accepted strings and field normalization | Exact authored variants, not fuzzy/LLM grading |
| Multi-field forms | Typed named fields; each has an answer contract | All fields graded; disclose partial facet results, define whole-question score before release |
| Token ordering | Authored token IDs and finite accepted orderings | Support duplicate words through token IDs; multiple grammatical orders need accepted alternatives or better context |
| Constrained transformation / correction | Finite accepted whole strings or explicitly editable spans | Preserve untouched context; enumerate valid alternatives; avoid unrestricted “rewrite naturally” prompts |
| Open paraphrase / writing / speaking | Rubric, model example and self/human review | Later only; never automatically count as deterministic correct |

Trim outside whitespace and normalize Unicode consistently. Case folding is field-specific: do not erase German noun capitalization when it is being tested. Preserve umlauts and ß; transliteration and punctuation alternatives must be explicit. A spelling policy cannot silently change legacy grading. Multi-field partial credit is a proposal requiring scoring/version decisions, not a reinterpretation of existing correct/wrong/assisted.

## Category recipes and mode mapping

L = Learn reference/example demonstration; P = future normal deterministic practice; R = revision of the same missed facet; E = future contextual exam task. All P/R proposals require a matching runtime handler and reviewed pool first.

| Category | Templates and target facets | Modes |
| --- | --- | --- |
| A Forms | Infinitive → Präteritum / Partizip II (bounded text); contextual haben/sein choice; identify infinitive; third-person Präsens stem recall; constrained tense transformation | L/P/R; contextual transformations E |
| B Constructions | Missing preposition, governed case, meaning (existing types); constrained completion; recognize construction for a stated meaning | L/P/R; integrated register-sensitive completion E |
| C Prefix verbs | Separable/inseparable choice in a specific sense; particle position ordering; Partizip II recall; contextual meaning/prefix relation; bounded sentence transformation | L/P/R; transformation E |
| D Nouns | Article; singular → attested plural; meaning; natural collocation choice; missing noun with explicit sense; governed preposition; bounded contextual completion | L/P/R; lexical precision/completion E |
| E Adjectives/adverbs | Meaning; applicable comparative/superlative; preposition; collocation; degree/register selection; constrained adjective/adverb completion | L/P/R; register/precision E |
| F Collocations | Natural combination choice; missing component; correction of one specified wrong component; closed paraphrase choice or tightly constrained rewrite | L/P/R; open paraphrase E with rubric, not automatic correctness |
| G Grammar | Pattern choice; finite clause transformation; token ordering; designated-span error correction; missing structural element | L/P/R; integrated transformations E; open production later rubric |
| H Connectors/Redemittel | Choose communicative function; context-disambiguated connector cloze; register selection; bounded frame/sentence completion | L/P/R; argumentation/writing structures E |
| I Idioms | Contextual meaning/function; missing component; select appropriate idiom/register; literal-versus-idiomatic interpretation | L/P/R; contextual recognition E; no obscure proverb recall quota |
| J Professional layer | Reuse category contracts with authentic engineering/project contexts, units and terminology verified | L/P/R; formal documentation tasks E later |
| K Exam layer | Precision/reading recognition; register choice; finite correction/transformation; structured argumentation/paraphrase/writing | E later; reuse P/R contracts when bounded; open response self/human review |

### Authoring constraints

- Prompts specify the target facet, sense and sufficient context. Auxiliary choice must distinguish valid haben/sein contexts. Connector slots often allow several natural answers: accept each intended variant or rewrite the context; do not declare a valid alternative wrong.
- For noun plural/article tasks, either disambiguate sense and region or publish attested alternatives. Do not ask for nonexistent plurals or gradation.
- Grammar transformations constrain tense, voice, agent preservation and register as necessary. Word ordering must not reject another natural order merely to enforce the model answer.
- Distractors are plausible errors of the same relevant class, but demonstrably wrong in this exact context. No grammar rule invented to justify an answer. Avoid obvious length/format clues and overlapping correct options.
- A hint supports retrieval through meaning, case, syntax or a conceptual cue without supplying the missing preposition, requested form, correct option text or answer span. For article/case choice, hints cannot simply state the requested gender/case. Context guidance is useful only when it does not reduce to the answer itself. Reveal Answer remains explicit and assisted; bounded tasks retain learner input after submission.
- Each question includes a concise rule/context explanation and authored correct answer. First grading is immutable; assistance remains separate from unaided correct/wrong. Existing double-submit protection and accessible keyboard interaction are requirements for new renderers.

## Pool and revision contract

A publishable normal pool has at least twenty supported unique authored IDs; ten-item blocks usually author four to eight complementary questions per item. Templates are not a requirement to manufacture identical variants for every item. Track item/facet coverage separately from question accuracy. Rotation selects 10/20 and shuffle changes order; question manifests are versioned so later edits do not reinterpret cursor positions or old attempts.

Session snapshots must expose itemId, facetId, question ID/revision, pack/version, template/answer-contract version, learner response, assistance and grading result. Existing v1 snapshots stay untouched. Revision carries original missed-attempt references; clearing a pending failure does not modify its historical score. Cross-template “equivalent mastery” is not inferred from one right multiple-choice answer. Open-response tasks remain outside normal deterministic pools until an honest assessment model is agreed.

## Template release gate

For each handler: correct/wrong/accepted-variant tests; Unicode and capitalization policy; ambiguous prompt/distractor review; hint/reveal distinction; immutable submission; feedback retention; 10/20 pool membership and progress; summary and missed-facet revision; serialization, resume, backup and offline round trip; keyboard and screen-reader labels. Unsupported types fail closed at import, before a session is started.
