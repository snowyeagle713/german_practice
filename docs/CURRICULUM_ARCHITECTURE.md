# B1 → C1 curriculum architecture

Status: planning specification, based on `v1.0.0-mvp`. No runtime, content-pack, session, backup or UI migration is performed by this change. The explicit curriculum request supersedes the software-milestone restriction on curriculum planning in AGENTS.md; it does not authorize full-library generation. The machine-readable companion is `content/curriculum-map.json`, a planning document, not an importable pack.

## Progression and inventory

CEFR describes communicative competence, not a finite official vocabulary list. Levels below are editorial scheduling estimates for a sense or task, not certificates. “B2+/C1 bridge” is a planning band, not a new CEFR enum. Reuse A1/A2 prerequisites where needed without relabeling them B1. Prioritize frequency, usefulness, productive and collocational value, then exam/professional relevance. Source-supported judgment takes priority over filling a quota.

| Area | Central target (range) | B1 | B2 | Bridge | C1 | Approx. 10-item blocks |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| A Verb Forms | 240 (220–260) | 90 | 80 | 50 | 20 | 24 |
| B Verb Constructions | 360 (320–400) | 80 | 130 | 100 | 50 | 36 |
| C Prefix / Separable Verbs | 180 (160–200) | 40 | 70 | 50 | 20 | 18 |
| D Nouns | 800 (700–900) | 200 | 300 | 200 | 100 | 80 |
| E Adjectives / Adverbs | 300 (260–340) | 70 | 110 | 80 | 40 | 30 |
| F Collocations | 400 (340–460) | 60 | 140 | 120 | 80 | 40 |
| G Grammar Patterns | 100 (80–120) | 25 | 35 | 25 | 15 | 10 |
| H Connectors / Redemittel | 160 (140–180) | 30 | 60 | 40 | 30 | 16 |
| I Idioms / Sayings | 120 (100–140) | 20 | 45 | 35 | 20 | 12 |
| Total canonical records | **2,660 (2,320–3,000)** | **615** | **970** | **700** | **375** | **266** |

Counts are learning records, not unique words: a verb form profile and one of its construction senses teach different objectives and cross-link rather than pretend to be different words. Category B includes the ten existing Starter records; they are not ten additional new records. Stage quotas do not assign CEFR to those legacy entries. Split polysemous items only when meaning, syntax or usage genuinely changes. Cross-category repetitions of the same learning objective are aliases/references, not new records.

J is a dedicated Technical / Professional view of approximately **300 curated item references**, within these budgets; specialist senses occupy their canonical category. K is approximately **120 future exam task blueprints**, not additional vocabulary. Neither is added to 2,660. No full mock exams, timed 30/40 sessions or exam readiness claims are introduced.

## Complete hierarchy and learning units

**A — Verb Forms.** One record per lemma/form profile: infinitive, useful third-person singular and Präsens stem change, Präteritum, Partizip II, auxiliary with sense/context conditions, separability, regular/strong/mixed classification. Alphabetical browsing with level filters; form learning precedes complex uses. Alphabetical blocks use natural 8–12-item ranges; split crowded letters into stable subranges, combine sparse adjacent letters, never duplicate/pad to equalize letters. Display labels may change; IDs do not encode letter boundaries. `fahren` needs context-sensitive auxiliary guidance (intransitive motion versus transitive use), not a universal “sein” rule. `bringen` is mixed. References and recognition complement prompted recall.

**B — Verb Constructions.** A construction sense is the unit, grouped by communication: interest/anticipation; thoughts/memory; reaction/communication; composition; decisions/participation; dependency/resources. Record preposition, governed case, reflexivity/reflexive case, meaning, semantic theme, level evidence and everyday/professional relevance. Examples such as warten auf, sich beziehen auf, abhängen von, verfügen über, teilnehmen an and sich entscheiden für belong by meaning, not by preposition. Other argument structures may be added through the v2 proposal; the existing v1 remains preposition-oriented.

**C — Prefix / Separable Verbs.** A sense-specific verb use teaches creation/assembly (aufbauen), execution/process (durchführen, ausführen), observation/results (feststellen), responsibility/transfer (übernehmen), adjustment/change (einstellen). Link useful prefix families and the form profile without claiming every prefix has one meaning. Separable/inseparable or stress-dependent senses require separate contextual rules, verified before authoring. Levels and professional relevance are filters, not primary groupings.

**D — Nouns.** Lexeme/sense records teach singular with article, attested plural(s), meaning, collocations, constructions, examples and relevance. Themes: everyday life; education/work; society/environment; decisions/requirements; processes/systems; measurements/results. `die Voraussetzung`, plural `die Voraussetzungen`, `Voraussetzung für + Akk.`, `eine Voraussetzung erfüllen` exemplifies linked facets. Mark no-plural/plural-only and gender variants explicitly; never invent forms to fill a template.

**E — Adjectives / Adverbs.** Description/comparison, degree/evaluation, responsibility/dependency, frequency/change, stance/certainty. Include meaning, gradation when applicable, prepositions, collocations, examples and register. abhängig von, verantwortlich für, wesentlich, erheblich, grundsätzlich, zunehmend illustrate different facets. Distinguish adjective from adverb use; non-gradable items legitimately omit comparative/superlative.

**F — Collocations.** First-class phrase/frame records: decisions/measures, requirements/quality, influence/importance, availability/options, project communication. Prioritize eine Entscheidung treffen, Maßnahmen ergreifen, in Betracht ziehen, zur Verfügung stehen, Einfluss auf etwas haben, Anforderungen erfüllen, eine Rolle spielen. Specify variable slots, case, inflection and contextual alternatives, cross-link component words. Do not count each inflected instance as a new item.

**G — Grammar Patterns.** An objective plus constrained pattern/examples is the unit. Sequence:

1. B1: main-clause word order → subordinate clauses → relative clauses; comparison; basic cause/result, concession, condition and purpose; zu-infinitives; basic passive and Konjunktiv II.
2. B2: extend relative/infinitive clauses → lassen constructions; passive variants and modal alternatives; more complex connector structures; nuanced hypotheses; introduction to reported speech/Konjunktiv I.
3. Bridge: nominalization and participial structures after clause competence; reported speech transformations; formal written structures and logical relations.
4. C1: integrated register-sensitive transformations, precise contrast/causality/concession and productive formal structures.

Objective-level prerequisites form a DAG; broad category prerequisites in the map indicate scheduling, not that every item in a category must be completed first. Vocabulary and grammar can develop concurrently. Review dependencies before each batch; do not create a circular “all grammar before all connectors” gate.

**H — Connectors / Redemittel.** Communicative function plus syntax/register: argumentation/opinion, contrast/concession, cause/consequence, condition/purpose, examples/sequencing, evaluation/register, writing and speaking. dennoch, hingegen, insofern, sofern, zumal, einerseits … andererseits, meines Erachtens, im Hinblick auf, daraus ergibt sich need clause-position/verb-order or frame information as applicable. Related forms are not interchangeable merely because translations overlap.

**I — Idiomatic Expressions / Sayings.** Summary/evaluation, certainty/doubt, acceptance/risk, discussion/time: im Großen und Ganzen, außer Frage stehen, etwas in Kauf nehmen, zur Sprache bringen, auf lange Sicht. Teach meaning in context, usage and register. Common proverbs are a small later subsection (at most about 10% of this category); obscure sayings need explicit justification.

**J — Technical / Professional layer.** Dedicated curated pathways for design/Konstruktion, manufacturing, simulation, validation, testing, projects, quality, requirements, technical documentation, systems engineering, automation, failures/causes/problems, measurements/results and meetings/communication. Reuse general items in realistic contexts; add specialist senses inside A–I when needed. Technical examples are optional where unnatural, not mandatory decorations on every noun or idiom. General language remains the foundation.

**K — Future C1 exam layer.** Provider-neutral task families: paraphrasing, formal register, argumentation, connectors, error correction, grammar transformations, vocabulary precision, reading-style lexical recognition and productive writing structures. Later provider profiles require current exam documentation and explicit scope decisions. Open writing/speaking require a rubric/human or honest self-review; recognition scores cannot certify productive competence.

## Blocks, pools and sessions

A learning block contains **8–12 records**, normally ten, organized by a coherent purpose. Its authored pool typically contains **40–80 questions** across different facets/contexts. These are editorial estimates, not forced quotas. A normal-practice block must have at least **20 supported, reviewed, unique authored questions** before publication; otherwise it stays draft/Learn-only. Never pad a pool with duplicated questions.

Quick remains **10 questions**, Standard **20**, with existing rotation and shuffle semantics. Earlier starter documents describe full 40-question software milestones; the accepted MVP and this request govern current normal sessions. The Starter pool still contains forty authored questions. Likewise, the accepted non-answer-revealing Hint behavior supersedes the original hint-rule wording in LEARNING_DESIGN.md. Items, pool membership and session question count are separate quantities. New pools should balance eligible facets; every question retains its own ID. Unknown formats are rejected at pack validation, never silently removed at session start. Optional 30/40 endurance modes remain future work. Revision targets actual wrong/assisted question evidence within compatible snapshots, not arbitrary duplicates of a learning item.

Learn exposes references, examples and linked facets with prerequisite guidance. Practice uses bounded deterministic tasks. Revision addresses missed facets while preserving original session scores. A future exam layer adds contextual integration and explicitly assessed productive tasks; no completion badge equates to B1/B2/C1 certification.

## Starter mapping and compatibility

Keep `verbs-starter`, version 1, `verbs-starter-01`, all ten entry IDs and all forty authored question IDs and grading unchanged. The seed remains a v1 pack, with null CEFR and prototype-reviewed status. Its current Learn themes map to B:

| Current theme | Existing records |
| --- | --- |
| Interest & anticipation | verb-interessieren-fuer, verb-freuen-auf, verb-warten-auf, verb-hoffen-auf |
| Thoughts & memory | verb-glauben-an, verb-erinnern-an |
| Communication & reaction | verb-antworten-auf, verb-diskutieren-ueber, verb-freuen-ueber |
| Structure & composition | verb-bestehen-aus |

Catalog references may describe prerequisite reuse; they must not relabel old snapshots, merge IDs, regrade attempts, reset rotation, erase history or replace Starter questions. See CONTENT_SCHEMA_EVOLUTION.md for the migration boundary.

## Assumptions and readiness

These are personal-learning editorial targets, adjustable after source audits and pilot learning, not a claim to cover every C1 word or exam. English glosses remain support language; German contexts are authoritative. The current UI remains accepted. Planning is ready for implementation/authoring pilots; importing a large multi-type curriculum is gated on v2 validation, supported renderers/grading, compatibility tests and linguistic review. No new runtime capability is delivered here.
