# Verb Forms Final Population Batch — source and regression audit

Reviewed 11 October 2026. Branch `content/verb-forms-final`, based on the **published** curriculum head `003cb1e8a07c0225e9cf380dcad023db640bfe5d`. Main was `816dabaf67d7f3bcd170220ad15201bac3b685b8`; neither baseline branch is merged or modified.

## Gap audit and selection

The fixed 190-profile inventory already covers ten mixed profiles after this batch (bringen/denken/wissen/kennen/erkennen and their selected compounds), common core motion verbs, formal evidence verbs and many project actions. Genuine remaining gaps included high-use strong paradigms (heben, greifen, leiden, schneiden, schweigen, sinken/steigen, stoßen, streiten), cancellation/adaptation and operational work, interpretation/refutation and synthesis. The final batch adds those gaps rather than repeating existing lemmas or making specialist synonym lists. Existing vergleichen, empfehlen, entscheiden, abgeben and aufnehmen were excluded as duplicates; related prefix profiles remain distinct lexical targets.

**50 new canonical verbs / five ten-verb blocks / 350 questions**. Final category: **240 verbs / 24 blocks / 1,680 questions**. Starter stays ten constructions / forty questions; complete runtime catalog 250 records / 25 blocks / 1,720 questions. New pack `verb-forms-final`, schema 2, first published packVersion 1; deterministic stable ASCII IDs retain German display spelling. Earlier packs/IDs/ordering/versions are unchanged.

Selection bands: one A2 prerequisite (2%), 12 B1 core (24%), 25 ordinary B2 (50%), 12 advanced productive (24%). Advanced comprises four B2 estimates and eight C1 estimates; raw enum counts **A2 1 / B1 12 / B2 29 / C1 8**. B2+ remains metadata, not a new enum. Editorial estimates are scheduling/usefulness judgements, not official vocabulary or learner proficiency assignments.

Morphology: **26 strong / 23 weak / one irregular / no new mixed**. Existing mixed coverage is retained; ambiguous senden/wenden/anwenden alternatives and mahlen are not inserted just to change a distribution. Separation: **eight separable / 18 inseparable / 24 without a prefix contract**. Fifty general/formal examples plus 43 additional technical/professional examples support useful German while leaving morphology as the tested skill. No rare/archaic/regional filler.

## Source strategy actually used

Freshly downloaded [reference CSV](https://raw.githubusercontent.com/viorelsfetea/german-verbs-database/master/output/verbs.csv) and [README](https://raw.githubusercontent.com/viorelsfetea/german-verbs-database/master/README.md) on 11 October 2026: established third-party Wiktionary transcription, 8,047 rows, SHA-256 `7fbac9b469e6226614385c20fc59f15b6014dd070f04387a875e2465cb223ce3`. Each selected lemma has one matching row; **200 new factual fields** match actual downloaded present3 / singular past / participle / auxiliary fields. Machine-readable capture: `content/source/verb-forms-final-verification.json`. All 960 fields for the complete 240-profile inventory were also compared against that freshly retrieved table.

Direct DWDS access was denied by the enforced destination policy (CONNECT 403, curl 56); prior Duden/Verbformen limitations remain. No proxy bypass or claim of live authoritative dictionary inspection. The source past field is first-person singular; third-person singular indicative recall uses the same form. Source facts do not independently prove sense, contextual auxiliary application, prefix classification, stem cues, CEFR/register/relevance or example naturalness. Those are original editorial/self-reviewed judgements, not independent native certification. Original glosses, hints/explanations and examples are authored, not copied licensed source prose.

## Blocks and all profiles

| Stable block | Alphabetical range | Verbs | Questions |
| --- | --- | ---: | ---: |
| `verb-forms-final-01` | abbrechen–betreiben | 10 | 70 |
| `verb-forms-final-02` | bewahren–fliehen | 10 | 70 |
| `verb-forms-final-03` | gelingen–rechtfertigen | 10 | 70 |
| `verb-forms-final-04` | riechen–treiben | 10 | 70 |
| `verb-forms-final-05` | veranlassen–zwingen | 10 | 70 |

| Lemma / selected sense | Present | Past | Participle | Auxiliary | Class / separation | Level |
| --- | --- | --- | --- | --- | --- | --- |
| abbrechen — to discontinue (an activity) | bricht ab | brach ab | abgebrochen | haben | strong / separable | B2 |
| absagen — to cancel (an event) | sagt ab | sagte ab | abgesagt | haben | weak / separable | B1 |
| anpassen — to adapt / adjust (to a requirement) | passt an | passte an | angepasst | haben | weak / separable | B2 |
| auslösen — to trigger (a reaction) | löst aus | löste aus | ausgelöst | haben | weak / separable | B2 |
| beeinflussen — to influence (an outcome) | beeinflusst | beeinflusste | beeinflusst | haben | weak / inseparable | B2 |
| befassen — to address / deal with (sich befassen mit) | befasst | befasste | befasst | haben | weak / inseparable | C1 |
| begrenzen — to limit (an amount or scope) | begrenzt | begrenzte | begrenzt | haben | weak / inseparable | B2 |
| beheben — to remedy (a defect or problem) | behebt | behob | behoben | haben | strong / inseparable | B2 |
| bestätigen — to confirm (information) | bestätigt | bestätigte | bestätigt | haben | weak / inseparable | B1 |
| betreiben — to operate (a facility or system) | betreibt | betrieb | betrieben | haben | strong / inseparable | B2 |
| bewahren — to preserve / retain (something valued) | bewahrt | bewahrte | bewahrt | haben | weak / inseparable | B2 |
| dringen — to penetrate / enter (through an opening) | dringt | drang | gedrungen | sein | strong / none | B2 |
| einschätzen — to assess / estimate (a situation) | schätzt ein | schätzte ein | eingeschätzt | haben | weak / separable | B2 |
| entfallen — to be omitted / no longer take place | entfällt | entfiel | entfallen | sein | strong / inseparable | B2 |
| ergreifen — to take (a measure or opportunity) | ergreift | ergriff | ergriffen | haben | strong / inseparable | B2 |
| erörtern — to discuss / examine (an issue in depth) | erörtert | erörterte | erörtert | haben | weak / inseparable | C1 |
| erweitern — to expand / extend (a scope) | erweitert | erweiterte | erweitert | haben | weak / inseparable | B2 |
| fertigen — to manufacture / make (an object) | fertigt | fertigte | gefertigt | haben | weak / none | B2 |
| festlegen — to specify / set (binding details) | legt fest | legte fest | festgelegt | haben | weak / separable | B2 |
| fliehen — to flee (from danger) | flieht | floh | geflohen | sein | strong / none | B1 |
| gelingen — to succeed (an attempt) | gelingt | gelang | gelungen | sein | strong / none | B2 |
| genießen — to enjoy (an experience) | genießt | genoss | genossen | haben | strong / none | B1 |
| greifen — to grasp / reach (for an object) | greift | griff | gegriffen | haben | strong / none | B1 |
| heben — to lift (a physical object) | hebt | hob | gehoben | haben | strong / none | B1 |
| hervorgehen — to emerge / become evident (from evidence) | geht hervor | ging hervor | hervorgegangen | sein | strong / separable | C1 |
| interpretieren — to interpret (information) | interpretiert | interpretierte | interpretiert | haben | weak / none | B2 |
| leiden — to suffer (from a condition) | leidet | litt | gelitten | haben | strong / none | B1 |
| montieren — to assemble / install (a component) | montiert | montierte | montiert | haben | weak / none | B2 |
| optimieren — to optimize (a process) | optimiert | optimierte | optimiert | haben | weak / none | B2 |
| rechtfertigen — to justify (an action) | rechtfertigt | rechtfertigte | gerechtfertigt | haben | weak / none | C1 |
| riechen — to smell / perceive (an odour) | riecht | roch | gerochen | haben | strong / none | B2 |
| schätzen — to estimate (a quantity) | schätzt | schätzte | geschätzt | haben | weak / none | B2 |
| schlagen — to strike (a physical object) | schlägt | schlug | geschlagen | haben | strong / none | B2 |
| schneiden — to cut (a material) | schneidet | schnitt | geschnitten | haben | strong / none | B1 |
| schweigen — to remain silent (in a discussion) | schweigt | schwieg | geschwiegen | haben | strong / none | B2 |
| sinken — to decrease / fall (a level) | sinkt | sank | gesunken | sein | strong / none | B1 |
| steigen — to increase / rise (a level) | steigt | stieg | gestiegen | sein | strong / none | B1 |
| stoßen — to push / move (an object with force) | stößt | stieß | gestoßen | haben | strong / none | B2 |
| streiten — to argue / dispute (with someone) | streitet | stritt | gestritten | haben | strong / none | B1 |
| treiben — to drive / propel (mechanically) | treibt | trieb | getrieben | haben | strong / none | B2 |
| veranlassen — to cause / arrange for (an action) | veranlasst | veranlasste | veranlasst | haben | weak / inseparable | C1 |
| verfügen — to have at one's disposal (verfügen über) | verfügt | verfügte | verfügt | haben | weak / inseparable | C1 |
| verringern — to reduce (an amount) | verringert | verringerte | verringert | haben | weak / inseparable | B2 |
| verweisen — to refer / direct (to a source) | verweist | verwies | verwiesen | haben | strong / inseparable | B2 |
| verzeihen — to forgive (a mistake) | verzeiht | verzieh | verziehen | haben | strong / inseparable | B1 |
| widerlegen — to refute (a claim) | widerlegt | widerlegte | widerlegt | haben | weak / inseparable | C1 |
| widersprechen — to contradict / disagree with (a statement) | widerspricht | widersprach | widersprochen | haben | strong / inseparable | C1 |
| wollen — to want (a thing; standalone lexical use) | will | wollte | gewollt | haben | irregular / none | A2 |
| zusammenfassen — to summarize (information) | fasst zusammen | fasste zusammen | zusammengefasst | haben | weak / separable | B2 |
| zwingen — to force / compel (an action) | zwingt | zwang | gezwungen | haben | strong / none | B2 |

## Modal audit, ambiguity and exclusions

Existing können/mögen cover standalone ability/liking; lassen covers standalone leaving. New wollen has an explicit noun object (eine eindeutige Antwort), so gewollt is natural and no dependent infinitive/Ersatzinfinitiv is tested. dürfen/müssen/sollen are acknowledged important gaps, deferred for separately sourced modal grammar/principal-form treatment. Unnatural gesollt or colloquial elliptical gemusst completions are not forced into seven templates. Verb Forms v1 is a curated core, not a complete modal grammar or complete German paradigm inventory. Missing sein requires another source; no fabricated row added.

All seven existing templates are suitable for the fifty **selected** profiles. No new template/handler or grammar architecture added. Bare third-person/principal forms omit reflexive sich for befassen while contexts consistently use sich befassen mit; this is an explicitly stated morphology convention, not permission to omit reflexivity in a sentence. Auxiliary prompts mask a singular finite hat/ist in a complete scoped sentence. Sequence choices are authored wrong stems, wrong tense, omitted particles or extra ge-; alternatives from other valid senses are not quietly treated as same-context answers.

- abbrechen is transitive discontinue (haben), excluding intransitive break/collapse auxiliary readings.
- stoßen is transitive push (haben); intransitive motion/encounter profiles are excluded. dringen is literal liquid entry (sein), not figurative insist on a demand.
- entfallen is cease to apply; gelingen has the attempt as subject and a possible dative experiencer; hervorgehen is become evident from evidence. All use sein without claiming a physical-motion rule. sinken/steigen also use sein, distinct from prior haben profiles zunehmen/nachlassen.
- veranlassen is **weak** veranlasste/veranlasst, not the strong lassen pattern. rechtfertigen is weak with gerechtfertigt and no modeled separable particle. widerlegen/widersprechen are inseparable wider-, distinct from a generic separable wieder- rule.
- verfügen is verfügen über + accusative (have at disposal), verweisen is auf + accusative (refer), widersprechen takes dative. schätzen is estimate, riechen perceive an odour, treiben propel mechanically, ergreifen take measures/opportunity. Untested secondary senses are not extra inventory.

Final-batch deferrals and rationale are captured in the source artifact; the consolidated final-category deferrals include older auxiliary, strong/weak, spelling and source gaps. No published correction was required or made. Independent review is recommended for the scoped cases above, wollen/modal ellipsis conventions, technical translations/evidence distinctions and level/register estimates; see the consolidated review ledger.

## Deduplication and question quality

Global exact checks across all four packs find no duplicate canonical lemmas, IDs, examples, prompts or prompt/answer pairs. All 24 blocks have disjoint complete item/question membership. German-locale global navigation is tested without reordering earlier manifests. Seven complementary templates yield 70 unique fixed questions per block; 10/20 sessions rotate through the complete pool. No artificial alternate phrasings inflate counts.

Near-context scan across 400 example sentences, comparing distinct items with at least one final-batch item: lowercase German word tokens, remove common function words, flag Jaccard >= 0.6 with >= 3 shared content words: **zero candidate pairs**. This is a heuristic, not proof of semantic uniqueness. Manual neighbours retained for genuinely different targets: bestimmen/ermitteln/feststellen/festlegen (determine/investigate/ascertain/specify), beweisen/belegen/nachweisen/widerlegen (proof/support/demonstration/refutation), durchführen/betreiben (conduct/operate), entwickeln/erweitern/anpassen/optimieren (develop/extend/adapt/optimize), heben/hervorheben/beheben (lift/emphasize/remedy), fallen/entfallen and lassen/veranlassen. A prefix relative is not an inflection-only duplicate.

Hints omit canonical targets, including both auxiliary choices; infinitive retrieval hints do not include the lemma/gloss. All completions reconstruct their original example and all answers match their canonical facet. Stem-change cues remain limited reference hints, not a conjugation generator. Technical content does not imply recognition scores certify engineering expertise or German proficiency.

## Integration and checks

Only three necessary content registrations: existing catalog loader, validation paths and Vite authored asset list. The existing PWA pipeline precaches the emitted asset automatically. No schema, grader, practice mode, persistence, backup, service-worker logic, theme, layout, dependencies or planning-map changes. Existing browser catalog-count assertions expand to 24 and still verify all prior links/flows; no validators/tests skipped or weakened.

Passed on the complete final tree (Linux, Node 24.19.0/npm 11.9.0, system Chromium):

- `node --import tsx scripts/validate-curriculum-map.ts`: nine categories/two layers/2,660 planning targets; Starter unchanged.
- `npm run validate:content`: all five runtime packs pass.
- `npm run typecheck`: strict TypeScript passes.
- `npm test -- --reporter=dot`: **2,165/2,165 across 14 files** (10.26 seconds). Includes all 350 new answer/hint fixtures, 50 source checks, five pool/rotation checks, global 960 captured fields/disjoint membership, full review-ledger membership and near-context/malformed text checks.
- `npm run build`: production passes; five original authored assets emitted. Final pack approximately 455.28 kB / 31.71 kB gzip. CSS asset identity remains unchanged.
- Targeted final browser checks: **10/10** pass (1.1 minutes).
- Complete `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=1`: **106/106 pass (10.2 minutes)**. Covers Starter, pilot, both earlier batches, final batch, global links, Learn, 10/20 completion/rotation, Previous/Skip, Hint/Reveal, grading/feedback/revision, progress/history/exact resume, fresh-profile restore, all four themes and production fresh-page offline/update flows. No tests skipped.
- `git diff --check`: passes. All earlier packs, schemas, domain/storage/UI/PWA logic, lockfile and starter documentation have no diff from baseline.
- Fresh source comparison: **960 matching factual fields**, including 200 new fields, against one source row per lemma. Exact duplicates and near-context candidates absent.

Authoring checkpoints contain small groups of unpublished draft blocks while the new file is unregistered, followed by full catalog/test/audit integration. The published version 1 pack is the complete immutable pool. Build and source bytes remain identical after checkpoint restoration. Linux automated offline results do not certify Windows installed-device behaviour.

## Handoff

Ready for curriculum merge review after all gates pass; no merge performed. Installed Windows Edge update/reopen with server stopped, backup dialogs, display scaling and real browser-profile upgrade remain device checks. Linux production Chromium offline automation does not certify those Windows behaviours. Independent linguistic review is a transparent follow-up, not falsely claimed complete. Stop after this final batch; new category work and later gap-driven additions require separate authorization.
