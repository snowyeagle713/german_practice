# Verb Forms Population Batch 2 — content and regression audit

Branch: `content/verb-forms-batch-2`, based on the published curriculum head `222c84772c78f34b45a45b0cc3a5293fabe8067c`. Remote main was `816dabaf67d7f3bcd170220ad15201bac3b685b8`. Reviewed 10 October 2026. Publish this branch only; no merge or modification of main/curriculum.

## Scope and integration

90 new canonical profiles, nine ten-verb blocks and 630 authored questions. Preserved pilot + Batch 1 + Batch 2: **190 Verb Forms, 19 blocks, 1,330 questions**. Including the untouched Starter: 200 learning records, 20 blocks and 1,370 questions. No final population batch or other category implemented.

Separate schema-2 pack `verb-forms-batch-2`, first published packVersion 1. Stable ASCII-transliterated IDs retain German display spelling. Existing packs, IDs, versions and snapshots are untouched. Only three catalog registrations change runtime files: loader, validation default paths and Vite content assets. Existing global alphabetical ordering already supports multiple packs. No UI, theme, grading, schema, storage, backup, PWA logic or dependency changes. Authoring checkpoints group unpublished draft blocks; only the complete version 1 pack is published. No generator or Python runtime dependency ships.

## References and verification limits

Freshly inspected [reference CSV](https://raw.githubusercontent.com/viorelsfetea/german-verbs-database/master/output/verbs.csv) and its [README provenance](https://raw.githubusercontent.com/viorelsfetea/german-verbs-database/master/README.md): Wiktionary-derived third-party transcription, 8,047 rows, SHA-256 `7fbac9b469e6226614385c20fc59f15b6014dd070f04387a875e2465cb223ce3`. All 90 selected lemmas have exactly one matching row; **360 present/past/participle/auxiliary fields** match the actual downloaded CSV. The machine-readable capture is `content/source/verb-forms-batch-2-verification.json`. Direct Duden/DWDS access is blocked by the network destination policy (CONNECT 403); no bypass attempted. This is not direct dictionary or independent native-speaker certification.

The source past field is first-person singular; the authored past recall explicitly requests third-person singular, which has the same indicative form. Infinitive retrieval identifies the supplied form as first/third-person singular. Source rows verify four factual fields, not every semantic, contextual auxiliary, prefix analysis, stem cue, example or level estimate. Those are original editorial/self-reviewed decisions. Explanations and examples are newly authored, not copied source prose.

## Selection and distribution

Two A2 prerequisites (können, mögen; 2.2%), 28 B1 core (31.1%), 42 ordinary B2 (46.7%), 18 advanced productive B2+/C1-oriented (20%). Advanced contains ten B2 estimates plus eight C1 estimates. Raw supported CEFR enums: **A2 2 / B1 28 / B2 52 / C1 8**. B2+ is explanatory metadata, not a new enum. Estimates schedule acquisition and productive use; no official CEFR vocabulary or proficiency claim. Existing Learn level caption is unchanged; full editorial rationale remains in levelNote/audit.

Morphology: **54 weak, five mixed, 29 strong, two irregular**. Separation: **34 separable, 34 inseparable, 22 without a separable/prefix contract**. Last category is not a claim that every word lacks derivational morphology. 90 original general/formal examples and **77 additional professional/technical examples** (167 total) raise technical coverage over Batch 1. Professional relevance is an editorial usefulness judgement, not measured corpus frequency. Advanced profiles use formal register; other profiles retain neutral modern usage.

## Blocks

| Stable block | Range | Verbs | Questions |
| --- | --- | ---: | ---: |
| `verb-forms-batch-2-01` | ablehnen–auffallen | 10 | 70 |
| `verb-forms-batch-2-02` | aufweisen–bemerken | 10 | 70 |
| `verb-forms-batch-2-03` | berücksichtigen–brennen | 10 | 70 |
| `verb-forms-batch-2-04` | darstellen–entwerfen | 10 | 70 |
| `verb-forms-batch-2-05` | erfordern–fördern | 10 | 70 |
| `verb-forms-batch-2-06` | genehmigen–leisten | 10 | 70 |
| `verb-forms-batch-2-07` | liefern–regeln | 10 | 70 |
| `verb-forms-batch-2-08` | scheitern–vermeiden | 10 | 70 |
| `verb-forms-batch-2-09` | vermitteln–zustimmen | 10 | 70 |

## All added profiles

Present/past are singular; auxiliary applies to the stated lexical sense/context. Meanings and levels are editorial. Scope details follow the table and are captured per lemma in the verification artifact.

| Lemma / scoped meaning | Present | Past | Participle | Auxiliary | Class / separation | Level |
| --- | --- | --- | --- | --- | --- | --- |
| ablehnen — to reject (a proposal) | lehnt ab | lehnte ab | abgelehnt | haben | weak / separable | B1 |
| ableiten — to derive (a conclusion) | leitet ab | leitete ab | abgeleitet | haben | weak / separable | B2 |
| abschaffen — to abolish / discontinue | schafft ab | schaffte ab | abgeschafft | haben | weak / separable | B1 |
| abstimmen — to coordinate / agree (details) | stimmt ab | stimmte ab | abgestimmt | haben | weak / separable | B2 |
| anbringen — to attach / mount | bringt an | brachte an | angebracht | haben | mixed / separable | B1 |
| anerkennen — to recognize / acknowledge (a contribution) | erkennt an | erkannte an | anerkannt | haben | mixed / separable | B2 |
| angeben — to specify / state | gibt an | gab an | angegeben | haben | strong / separable | B1 |
| anschließen — to connect (a device) | schließt an | schloss an | angeschlossen | haben | strong / separable | B1 |
| aufbauen — to build / establish | baut auf | baute auf | aufgebaut | haben | weak / separable | B1 |
| auffallen — to stand out / be noticed | fällt auf | fiel auf | aufgefallen | sein | strong / separable | B1 |
| aufweisen — to exhibit / have (features) | weist auf | wies auf | aufgewiesen | haben | strong / separable | C1 |
| ausführen — to carry out (an instruction) | führt aus | führte aus | ausgeführt | haben | weak / separable | B2 |
| ausschließen — to rule out | schließt aus | schloss aus | ausgeschlossen | haben | strong / separable | B2 |
| auswerten — to analyze / evaluate (data) | wertet aus | wertete aus | ausgewertet | haben | weak / separable | B2 |
| beantragen — to apply for / request officially | beantragt | beantragte | beantragt | haben | weak / inseparable | B2 |
| bearbeiten — to work on / process | bearbeitet | bearbeitete | bearbeitet | haben | weak / inseparable | B2 |
| begründen — to justify / give reasons for | begründet | begründete | begründet | haben | weak / inseparable | B2 |
| behaupten — to claim / assert | behauptet | behauptete | behauptet | haben | weak / inseparable | B2 |
| belegen — to substantiate (with evidence) | belegt | belegte | belegt | haben | weak / inseparable | C1 |
| bemerken — to notice / remark | bemerkt | bemerkte | bemerkt | haben | weak / inseparable | B1 |
| berücksichtigen — to take into account | berücksichtigt | berücksichtigte | berücksichtigt | haben | weak / inseparable | B2 |
| bestehen — to pass (an examination) | besteht | bestand | bestanden | haben | strong / inseparable | B1 |
| bestimmen — to determine / establish | bestimmt | bestimmte | bestimmt | haben | weak / inseparable | B1 |
| beurteilen — to judge / assess | beurteilt | beurteilte | beurteilt | haben | weak / inseparable | B2 |
| beweisen — to prove | beweist | bewies | bewiesen | haben | strong / inseparable | B2 |
| bewerten — to evaluate / rate | bewertet | bewertete | bewertet | haben | weak / inseparable | B2 |
| bewirken — to bring about / cause | bewirkt | bewirkte | bewirkt | haben | weak / inseparable | B2 |
| beziehen — to obtain / source (goods or services) | bezieht | bezog | bezogen | haben | strong / inseparable | B2 |
| binden — to bind / tie (physically) | bindet | band | gebunden | haben | strong / none | B1 |
| brennen — to burn (intransitive) | brennt | brannte | gebrannt | haben | mixed / none | B1 |
| darstellen — to present / depict | stellt dar | stellte dar | dargestellt | haben | weak / separable | B2 |
| definieren — to define | definiert | definierte | definiert | haben | weak / none | B2 |
| dokumentieren — to document | dokumentiert | dokumentierte | dokumentiert | haben | weak / none | B2 |
| durchführen — to carry out / conduct | führt durch | führte durch | durchgeführt | haben | weak / separable | B2 |
| einführen — to introduce (a system or rule) | führt ein | führte ein | eingeführt | haben | weak / separable | B1 |
| einhalten — to comply with / keep (a commitment) | hält ein | hielt ein | eingehalten | haben | strong / separable | B1 |
| einstellen — to adjust / set (a parameter) | stellt ein | stellte ein | eingestellt | haben | weak / separable | B2 |
| entnehmen — to extract / take from | entnimmt | entnahm | entnommen | haben | strong / inseparable | B2 |
| entsprechen — to correspond to / meet (a requirement) | entspricht | entsprach | entsprochen | haben | strong / inseparable | B2 |
| entwerfen — to design / draft | entwirft | entwarf | entworfen | haben | strong / inseparable | B2 |
| erfordern — to require | erfordert | erforderte | erfordert | haben | weak / inseparable | B2 |
| erfüllen — to fulfill / meet (a condition) | erfüllt | erfüllte | erfüllt | haben | weak / inseparable | B1 |
| ergeben — to yield (a result) | ergibt | ergab | ergeben | haben | strong / inseparable | B2 |
| erläutern — to explain / elucidate | erläutert | erläuterte | erläutert | haben | weak / inseparable | B2 |
| ermitteln — to establish / determine (by investigation) | ermittelt | ermittelte | ermittelt | haben | weak / inseparable | B2 |
| ermöglichen — to enable / make possible | ermöglicht | ermöglichte | ermöglicht | haben | weak / inseparable | B2 |
| ersetzen — to replace | ersetzt | ersetzte | ersetzt | haben | weak / inseparable | B1 |
| erstellen — to create / prepare (a document) | erstellt | erstellte | erstellt | haben | weak / inseparable | B2 |
| feststellen — to ascertain / establish (a finding) | stellt fest | stellte fest | festgestellt | haben | weak / separable | B2 |
| fördern — to support / promote (development) | fördert | förderte | gefördert | haben | weak / none | B2 |
| genehmigen — to approve / authorize | genehmigt | genehmigte | genehmigt | haben | weak / none | B2 |
| gewährleisten — to ensure / guarantee (a condition) | gewährleistet | gewährleistete | gewährleistet | haben | weak / none | C1 |
| hervorheben — to emphasize / highlight | hebt hervor | hob hervor | hervorgehoben | haben | strong / separable | C1 |
| hinweisen — to point out / draw attention to | weist hin | wies hin | hingewiesen | haben | strong / separable | B2 |
| installieren — to install | installiert | installierte | installiert | haben | weak / none | B1 |
| klären — to clarify / resolve | klärt | klärte | geklärt | haben | weak / none | B1 |
| können — to be able to (standalone ability) | kann | konnte | gekonnt | haben | irregular / none | A2 |
| koordinieren — to coordinate (activities) | koordiniert | koordinierte | koordiniert | haben | weak / none | B2 |
| laden — to load (goods) | lädt | lud | geladen | haben | strong / none | B1 |
| leisten — to provide / render (a contribution) | leistet | leistete | geleistet | haben | weak / none | B2 |
| liefern — to deliver / supply | liefert | lieferte | geliefert | haben | weak / none | B1 |
| messen — to measure | misst | maß | gemessen | haben | strong / none | B1 |
| mitteilen — to communicate / inform | teilt mit | teilte mit | mitgeteilt | haben | weak / separable | B1 |
| mögen — to like (standalone lexical use) | mag | mochte | gemocht | haben | irregular / none | A2 |
| nachdenken — to reflect / think about | denkt nach | dachte nach | nachgedacht | haben | mixed / separable | B1 |
| nachkommen — to fulfill / comply with (an obligation) | kommt nach | kam nach | nachgekommen | sein | strong / separable | B2 |
| nachlassen — to decrease / subside | lässt nach | ließ nach | nachgelassen | haben | strong / separable | B2 |
| nachweisen — to demonstrate / substantiate (with evidence) | weist nach | wies nach | nachgewiesen | haben | strong / separable | C1 |
| nennen — to name / mention | nennt | nannte | genannt | haben | mixed / none | B1 |
| regeln — to regulate / arrange (a process) | regelt | regelte | geregelt | haben | weak / none | B2 |
| scheitern — to fail (an attempt or plan) | scheitert | scheiterte | gescheitert | sein | weak / none | B2 |
| simulieren — to simulate | simuliert | simulierte | simuliert | haben | weak / none | B2 |
| steuern — to control / direct | steuert | steuerte | gesteuert | haben | weak / none | B2 |
| übertragen — to transfer / transmit (information) | überträgt | übertrug | übertragen | haben | strong / inseparable | B2 |
| umsetzen — to implement / put into practice | setzt um | setzte um | umgesetzt | haben | weak / separable | B2 |
| unterscheiden — to distinguish (between alternatives) | unterscheidet | unterschied | unterschieden | haben | strong / inseparable | B2 |
| untersuchen — to investigate / examine | untersucht | untersuchte | untersucht | haben | weak / inseparable | B2 |
| validieren — to validate (against stated criteria) | validiert | validierte | validiert | haben | weak / none | C1 |
| verbinden — to connect / link | verbindet | verband | verbunden | haben | strong / inseparable | B1 |
| vermeiden — to avoid | vermeidet | vermied | vermieden | haben | strong / inseparable | B1 |
| vermitteln — to convey / teach (knowledge) | vermittelt | vermittelte | vermittelt | haben | weak / inseparable | B2 |
| veröffentlichen — to publish | veröffentlicht | veröffentlichte | veröffentlicht | haben | weak / inseparable | B2 |
| versagen — to fail (a device or function) | versagt | versagte | versagt | haben | weak / inseparable | B2 |
| verschieben — to postpone / reschedule | verschiebt | verschob | verschoben | haben | strong / inseparable | B1 |
| voraussetzen — to presuppose / require as a prerequisite | setzt voraus | setzte voraus | vorausgesetzt | haben | weak / separable | C1 |
| vorsehen — to plan for / provide for | sieht vor | sah vor | vorgesehen | haben | strong / separable | B2 |
| wahrnehmen — to perceive / notice | nimmt wahr | nahm wahr | wahrgenommen | haben | strong / separable | B2 |
| zunehmen — to increase | nimmt zu | nahm zu | zugenommen | haben | strong / separable | B2 |
| zurückführen — to attribute (a result to a cause) | führt zurück | führte zurück | zurückgeführt | haben | weak / separable | C1 |
| zustimmen — to agree / consent | stimmt zu | stimmte zu | zugestimmt | haben | weak / separable | B1 |

## Scoped decisions, variants and manual review

- abschaffen is weak abolish/discontinue, distinct from the preserved strong schaffen/create. anbringen/anerkennen are mixed compounds; anerkannt keeps the inner inseparable prefix and adds no extra ge. genehmigt/gewährleistet and -ieren participles also receive no extra ge.
- bestehen is pass an exam, not a duplicate of Starter bestehen aus. beziehen is obtain supplies, not sich beziehen auf. ergeben is yield a result with an inanimate subject, not surrender/reflexive arise. einstellen is adjust a parameter, not hire/discontinue. angeben is specify, ausführen execute, ausschließen rule out, belegen substantiate and wahrnehmen perceive. Each prompt contextualizes the authored target where needed.
- können is standalone ability with gekonnt; mögen is standalone liking with gemocht. Modal dependent-infinitive Ersatzinfinitiv is outside these scoped profiles. mochte is indicative past; möchte is not an accepted answer to that explicit past question. This is morphology practice, not a modal grammar course.
- nachkommen is fulfil an obligation with dative and sein despite no physical motion; scheitern also uses sein. nachlassen/zunehmen use haben in abstract decrease/increase; versagen uses haben for functional failure. Auxiliary hints avoid both option words and avoid simplistic motion/change rules.
- entnehmen/entsprechen retain dative complements; erfüllen is a distinct accusative pattern. übertragen is inseparable transfer; umsetzen/voraussetzen/zurückführen are separable. steuern/regeln examples do not assert technical interchangeability between control and feedback regulation. validieren explicitly refers to defined criteria and independent data, not universal proof.
- Deferred: anwenden (weak/strong alternatives), abwägen/erwägen (variant verification), vorliegen (regional auxiliary alternatives), nachfragen (no inspected reference row). No unsupported single-canonical profile is shipped merely to reach a count.

Independent linguistic review remains recommended for scope boundaries, contextual auxiliary use, translations and advanced level placement, especially standalone modals, nachkommen/scheitern/versagen, belegen/beweisen/nachweisen, regeln/steuern and abstract professional examples. No published profile is known to require a second accepted form in its stated context; this self-review is not exhaustive independent certification.

## Duplication and question review

Global checks across all 190 profiles reject duplicate canonical lemmas, IDs, normalized examples, prompts and prompt/answer pairs. Across 307 example sentences, an additional local near-context scan (lowercase German word tokens; remove articles, pronouns, auxiliary/function words; compare different items with at least one new item; Jaccard >= 0.6 and >= 3 shared content words) flagged **zero** pairs. This heuristic does not prove semantic uniqueness.

Manual near-neighbour review retains distinct lexical/morphological targets: abstimmen/koordinieren (agreement/coordination), beurteilen/bewerten/auswerten (judgement/rating/data analysis), belegen/beweisen/nachweisen (evidence/formal proof/demonstration), entwerfen/erstellen/entwickeln/aufbauen (design/create/develop/establish), entsprechen/erfüllen, ausschließen/abschließen/schließen and prefix relatives. Related contexts support transfer rather than duplicate verb records. Repeated participle answers across recall and sentence completion have distinct prompts and retrieval contexts.

Seven existing templates per item: past recall, participle recall, present recall, infinitive retrieval, context-scoped auxiliary choice, principal-parts sequence choice and contextual participle completion. All choices are explicit authored data, with plausible learner distractors. Hints are checked against exact canonical answers; auxiliary hints reveal neither haben nor sein. Each completion has one blank and reconstructs its original example. Quick stays 10, Standard 20; rotation preserves the complete 70-question pool without duplicate session IDs.

## Regression verification

All gates passed on the completed content/integration tree:

- `node --import tsx scripts/validate-curriculum-map.ts`: nine categories, two layers, 2,660 target records; Starter unchanged.
- `npm run validate:content`: all four packs pass structural, reference and content rules.
- `npm run typecheck`: strict TypeScript passes.
- `npm test -- --reporter=dot`: **1,753 tests pass across 13 files**.
- `npm run build`: production build passes; all four authored assets emitted.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=1`: **96/96 pass (7.3 minutes)**, including 13 new Batch 2 browser checks. Coverage includes all nine starts, representative advanced profiles, exact bytes, Quick/Standard completion and rotation, hint/feedback keyboard/resume, wrong/assisted revision, preserved scores, fresh-profile backup/theme restore and fresh-page offline availability for every new block. Existing tests continue covering Previous, Skip, Reveal, all four themes, v1 compatibility and safe PWA updates.
- `git diff --check`: passes.
- Independent fresh-CSV comparison: all 360 fields match; global exact duplicates absent and local near-context scan finds zero candidates.
 Browser automation uses system Chromium on Linux and a production build, including service-worker activation, network disabled and a fresh offline page. This does not certify Windows Edge installation/device behaviour.

## Remaining device review and handoff

On Windows Edge, verify installing/updating the PWA from the previous release, offline readiness for all nine new blocks, new alphabetical routes, keyboard/tab order and backup export/import filesystem dialogs. Retain existing data and verify older snapshots and themes after updating. An independent German reviewer should check the flagged sense/translation/level decisions before claiming linguistic certification. The branch is ready for curriculum review after all gates pass; no merge or final batch is performed here.
