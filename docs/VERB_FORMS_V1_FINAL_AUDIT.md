# Verb Forms v1 — final curated inventory audit

Reviewed 11 October 2026. The `content/verb-forms-final` review branch completes the **planned curated-core population**, based on published curriculum head `003cb1e8a07c0225e9cf380dcad023db640bfe5d`. It does not claim all German verbs, every sense, all six modal paradigms in context or B1/B2/C1 proficiency. No further automatic quota expansion is planned. Later additions must address a real learning need or verified gap.

## Inventory and organization

**240 canonical lexical profiles / 24 ten-verb blocks / 1,680 authored questions**. Pack contributions: pilot 20/2/140, Batch 1 80/8/560, Batch 2 90/9/630, final 50/5/350. All packs retain stable IDs and version 1. The separate Starter remains ten constructions / one block / forty questions: full runtime catalog 250 records / 25 blocks / 1,720 questions. Forms versus construction records teach different objectives.

German-locale alphabetical navigation spans all 240 profiles; pack manifests retain their published order and block IDs. Sparse letters need not have their own blocks, and no missing-letter filler is added. No level-filter feature is newly implemented; current metadata is available for future approved features.

## Whole-category distributions

**CEFR acquisition estimates**: A1 15, A2 26, B1 87, B2 96, C1 16.

**Morphology**: irregular 5, mixed 10, strong 118, weak 107.

**Separation contract**: inseparable 83, none 92, separable 65.

**Scoped auxiliary**: haben 212, sein 28.

**Everyday relevance**: high 143, medium 97.

**Professional relevance**: high 178, low 28, medium 34.

**Register**: formal 30, neutral 210.

**Alphabetical group**: A 38, B 37, D 6, E 30, F 11, G 9, H 7, I 2, K 5, L 7, M 4, N 6, O 1, P 2, R 6, S 19, T 5, U 4, V 21, W 8, Z 8, Ö 1, Ü 3.

There are 240 original general/formal examples plus **160 technical/professional examples** (400 total). Technical relevance is modeled through optional examples and usefulness metadata, not a separate extra inventory. Levels/register/relevance are editorial estimates, not a finite official CEFR vocabulary list or measured frequency rankings. The pilot's fifteen A1 items remain prerequisites; none were relabeled to appear advanced. Advanced productive bands in later packs may legitimately retain B2 acquisition estimates.

## Source and review contract

All four source captures agree with their pack's four factual form/auxiliary fields; a fresh final-batch CSV comparison agrees on **960 fields / 240 rows**. Source: the accessible German Verbs Database Wiktionary-derived transcription, 8,047 rows and checksum `7fbac9b469e6226614385c20fc59f15b6014dd070f04387a875e2465cb223ce3`. See individual audits for retrieval dates and limitations. Direct DWDS/Duden access was blocked; no independent teacher/native review is claimed. Agreement with a transcription and automatic validation does not prove every sense, example, classification or level estimate.

Machine-readable consolidated ledger: **`content/source/verb-forms-v1-review.json`**, exactly one entry per published profile, stable item/pack IDs, focused flags and routine review obligations. Every editorial level/relevance estimate and every original example/gloss remains eligible for independent review. Focused flags below identify greater uncertainty without claiming a known error; no prior published record is silently changed.

## Consolidated focused review list

**auxiliary-sense**: `fahren`, `laufen`, `ziehen`, `folgen`, `erscheinen`, `ausziehen`, `nachkommen`, `nachlassen`, `scheitern`, `versagen`, `zunehmen`, `abbrechen`, `dringen`, `entfallen`, `gelingen`, `hervorgehen`, `sinken`, `steigen`, `stoßen`, `fliehen`. Confirm auxiliary in the stated sense/context; do not generalize motion or change into a universal rule.

**polysemy-scope**: `annehmen`, `aufnehmen`, `anziehen`, `aufgeben`, `schaffen`, `bestehen`, `beziehen`, `einstellen`, `ergeben`, `angeben`, `ausführen`, `ausschließen`, `belegen`, `bewirken`, `wahrnehmen`, `laden`, `fördern`, `vermitteln`, `versagen`, `übertragen`, `umsetzen`, `vorsehen`, `zurückführen`, `wachsen`, `gefallen`, `fallen`, `betreiben`, `befassen`, `genießen`, `greifen`, `leiden`, `riechen`, `schätzen`, `schlagen`, `streiten`, `treiben`, `veranlassen`, `verfügen`, `verweisen`, `ergreifen`, `bewahren`. Confirm scoped lexical meaning/complements and excluded readings; shared principal parts do not mean interchangeable constructions.

**variant-boundary**: `schaffen`, `wachsen`. Confirm strong/weak sense boundaries and that the authored prompt disambiguates the selected profile.

**prefix-stress**: `übernehmen`, `übertragen`, `überzeugen`, `unterstützen`, `unterscheiden`, `untersuchen`, `umsetzen`, `anerkennen`, `genehmigen`, `gewährleisten`, `rechtfertigen`, `widerlegen`, `widersprechen`, `hervorgehen`, `veranlassen`. Confirm selected prefix/compound morphology and finite/participle pattern; this flag is not a claim that every lemma has a second stress-dependent profile.

**modal-special-paradigm**: `haben`, `werden`, `wissen`, `lassen`, `können`, `mögen`, `wollen`. Confirm lexical versus auxiliary/modal treatment; dependent-infinitive/Ersatzinfinitiv and passive worden are not normal participle questions here.

**precision-technical**: `belegen`, `beweisen`, `nachweisen`, `validieren`, `bestimmen`, `ermitteln`, `feststellen`, `beurteilen`, `bewerten`, `auswerten`, `regeln`, `steuern`, `simulieren`, `optimieren`, `interpretieren`, `widerlegen`, `rechtfertigen`, `beeinflussen`, `veranlassen`, `widersprechen`. Review evidential strength, technical meaning and translations; an example must not imply universal proof, interchangeable control concepts or proficiency certification.

**Formal register / advanced placement**: `ableiten`, `anerkennen`, `aufweisen`, `belegen`, `berücksichtigen`, `bewirken`, `entnehmen`, `entsprechen`, `erfordern`, `ergeben`, `erläutern`, `gewährleisten`, `hervorheben`, `nachweisen`, `übertragen`, `validieren`, `voraussetzen`, `zurückführen`, `beeinflussen`, `befassen`, `einschätzen`, `erörtern`, `hervorgehen`, `interpretieren`, `rechtfertigen`, `veranlassen`, `verfügen`, `verweisen`, `widerlegen`, `widersprechen`. Review acquisition level separately from advanced productive value; neither is an official assignment.

**Native-level example review**: prioritize the 160 technical examples, evidential distinctions belegen/beweisen/nachweisen/widerlegen, validation/interpretation criteria and regeln/steuern terminology. Review all 400 original sentences/glosses over time. This is not a claim that those examples are incorrect; they have editorial/self-review only. Complete per-record membership and routine/focused status are below and in the machine ledger.

## Known deferrals and deliberate coverage limits

- **sein**: Important lexical/copular irregular prerequisite missing from inspected source; dedicated sourcing required.
- **dürfen**: Modal dependent-infinitive grammar; standalone profile not forced into neutral completion templates.
- **müssen**: Modal/Ersatzinfinitiv and elliptical standalone gemusst need independent template review.
- **sollen**: Neutral standalone gesollt examples not established; modal/reporting grammar deferred.
- **senden**: Weak/strong alternatives require a supported variant contract and sourcing.
- **wenden**: Weak/strong alternatives require independent context/variant verification.
- **anwenden**: Weak/strong alternatives remain deferred from Batch 2.
- **abwägen**: Present/past variant contract remains deferred.
- **erwägen**: Present/past variant contract remains deferred.
- **stehen**: Regional haben/sein variants need explicit supported context policy.
- **sitzen**: Regional haben/sein variants need explicit supported context policy.
- **liegen**: Regional haben/sein variants need explicit supported context policy.
- **vorliegen**: Regional auxiliary alternatives remain deferred.
- **aufrechterhalten**: Finite-form alternatives/source scope need independent confirmation.
- **mahlen**: Useful mixed-type weak-past/strong-participle pattern needs dedicated classification review.
- **ausgleichen**: No inspected source row.
- **zurücknehmen**: No inspected source row.
- **verdeutlichen**: No inspected source row.
- **zugrundelegen**: Source/spelling verification pending.
- **nachfragen**: No inspected source row; retained from Batch 2 deferral.
- **leihen**: Useful strong verb; lower priority in this curated closure, not a statement of low frequency.
- **stehlen**: Useful strong verb; lower priority than productive gaps, not an exhaustive list.

These deferrals do not block closure of a curated core; they prohibit an exhaustive or complete-modal-grammar claim. Common mixed profiles already include bringen, denken, wissen, kennen, erkennen, anbringen, anerkennen, brennen, nachdenken and nennen. No extra mixed variant was forced into the last pack. Auxiliary conditions and sense boundaries are scoped per record; strong/weak variants are not accepted by unverified guessing. Full paradigm inflection, modal double-infinitives, passive worden, unrestricted sentence grading, productive writing/speaking, regional variants and exam readiness are outside this category's current assessment.

## Validation, compatibility and completion

Global checks cover normalized lemma/ID/question/example uniqueness, disjoint exact block membership, canonical answers, seven supported templates, malformed text, hints, source captures, alphabetical order and complete 70-question pool rotation. Each pack is immutable version 1 at publication. Existing v1/v2 snapshots, IDs, original grades, history, revision evidence, backups, themes and offline/update workflow remain supported. No database upgrade or data reset is required.

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

The planned Verb Forms v1 population is complete at 240 curated profiles after all gates pass, with explicit sourcing/review limits. The branch is ready to merge into `content/curriculum-architecture`; this task does not perform a merge. Actual Windows Edge installed-PWA/update/offline and native file dialogs require local verification. Final category closure is not independent linguistic or Windows-device certification. No other category is implemented.

## Complete inventory and review membership

“Focused” means at least one topic flag above; “routine” still requires editorial-level and original-example review. Refer to each pack's Learn notes/source audit for the exact selected sense.

| Lemma | Stable item ID | Pack | Level | Review priority |
| --- | --- | --- | --- | --- |
| abbrechen | `forms-abbrechen` | verb-forms-final | B2 | focused |
| abfahren | `forms-abfahren` | verb-forms-batch-1 | A2 | routine |
| abgeben | `forms-abgeben` | verb-forms-batch-1 | B1 | routine |
| abholen | `forms-abholen` | verb-forms-batch-1 | A2 | routine |
| ablehnen | `forms-ablehnen` | verb-forms-batch-2 | B1 | routine |
| ableiten | `forms-ableiten` | verb-forms-batch-2 | B2 | focused |
| absagen | `forms-absagen` | verb-forms-final | B1 | routine |
| abschaffen | `forms-abschaffen` | verb-forms-batch-2 | B1 | routine |
| abschließen | `forms-abschliessen` | verb-forms-batch-1 | B1 | routine |
| abstimmen | `forms-abstimmen` | verb-forms-batch-2 | B2 | routine |
| anbieten | `forms-anbieten` | verb-forms-batch-1 | B1 | routine |
| anbringen | `forms-anbringen` | verb-forms-batch-2 | B1 | routine |
| anerkennen | `forms-anerkennen` | verb-forms-batch-2 | B2 | focused |
| anfangen | `forms-anfangen` | verb-forms-batch-1 | A2 | routine |
| angeben | `forms-angeben` | verb-forms-batch-2 | B1 | focused |
| ankommen | `forms-ankommen` | verb-forms-batch-1 | A2 | routine |
| annehmen | `forms-annehmen` | verb-forms-batch-1 | B2 | focused |
| anpassen | `forms-anpassen` | verb-forms-final | B2 | routine |
| anrufen | `forms-anrufen` | verb-forms-batch-1 | A2 | routine |
| anschließen | `forms-anschliessen` | verb-forms-batch-2 | B1 | routine |
| ansehen | `forms-ansehen` | verb-forms-batch-1 | B1 | routine |
| anziehen | `forms-anziehen` | verb-forms-batch-1 | A2 | focused |
| arbeiten | `forms-arbeiten` | verb-forms-pilot | A1 | routine |
| aufbauen | `forms-aufbauen` | verb-forms-batch-2 | B1 | routine |
| auffallen | `forms-auffallen` | verb-forms-batch-2 | B1 | routine |
| aufgeben | `forms-aufgeben` | verb-forms-batch-1 | B1 | focused |
| aufhören | `forms-aufhoeren` | verb-forms-batch-1 | B1 | routine |
| aufnehmen | `forms-aufnehmen` | verb-forms-batch-1 | B2 | focused |
| aufstehen | `forms-aufstehen` | verb-forms-pilot | A2 | routine |
| aufweisen | `forms-aufweisen` | verb-forms-batch-2 | C1 | focused |
| ausführen | `forms-ausfuehren` | verb-forms-batch-2 | B2 | focused |
| ausgeben | `forms-ausgeben` | verb-forms-batch-1 | B1 | routine |
| auslösen | `forms-ausloesen` | verb-forms-final | B2 | routine |
| ausschließen | `forms-ausschliessen` | verb-forms-batch-2 | B2 | focused |
| aussehen | `forms-aussehen` | verb-forms-batch-1 | A2 | routine |
| aussteigen | `forms-aussteigen` | verb-forms-batch-1 | A2 | routine |
| auswerten | `forms-auswerten` | verb-forms-batch-2 | B2 | focused |
| ausziehen | `forms-ausziehen` | verb-forms-batch-1 | B1 | focused |
| beantragen | `forms-beantragen` | verb-forms-batch-2 | B2 | routine |
| beantworten | `forms-beantworten` | verb-forms-batch-1 | B1 | routine |
| bearbeiten | `forms-bearbeiten` | verb-forms-batch-2 | B2 | routine |
| bedeuten | `forms-bedeuten` | verb-forms-batch-1 | B1 | routine |
| beeinflussen | `forms-beeinflussen` | verb-forms-final | B2 | focused |
| befassen | `forms-befassen` | verb-forms-final | C1 | focused |
| beginnen | `forms-beginnen` | verb-forms-batch-1 | B1 | routine |
| begrenzen | `forms-begrenzen` | verb-forms-final | B2 | routine |
| begründen | `forms-begruenden` | verb-forms-batch-2 | B2 | routine |
| behalten | `forms-behalten` | verb-forms-batch-1 | B1 | routine |
| behaupten | `forms-behaupten` | verb-forms-batch-2 | B2 | routine |
| beheben | `forms-beheben` | verb-forms-final | B2 | routine |
| bekommen | `forms-bekommen` | verb-forms-batch-1 | A2 | routine |
| belegen | `forms-belegen` | verb-forms-batch-2 | C1 | focused |
| bemerken | `forms-bemerken` | verb-forms-batch-2 | B1 | routine |
| benutzen | `forms-benutzen` | verb-forms-batch-1 | B1 | routine |
| beobachten | `forms-beobachten` | verb-forms-batch-1 | B2 | routine |
| berücksichtigen | `forms-beruecksichtigen` | verb-forms-batch-2 | B2 | focused |
| beschließen | `forms-beschliessen` | verb-forms-batch-1 | B2 | routine |
| beschreiben | `forms-beschreiben` | verb-forms-batch-1 | B1 | routine |
| besprechen | `forms-besprechen` | verb-forms-batch-1 | B1 | routine |
| bestätigen | `forms-bestaetigen` | verb-forms-final | B1 | routine |
| bestehen | `forms-bestehen` | verb-forms-batch-2 | B1 | focused |
| bestellen | `forms-bestellen` | verb-forms-batch-1 | A2 | routine |
| bestimmen | `forms-bestimmen` | verb-forms-batch-2 | B1 | focused |
| betreiben | `forms-betreiben` | verb-forms-final | B2 | focused |
| beurteilen | `forms-beurteilen` | verb-forms-batch-2 | B2 | focused |
| bewahren | `forms-bewahren` | verb-forms-final | B2 | focused |
| beweisen | `forms-beweisen` | verb-forms-batch-2 | B2 | focused |
| bewerten | `forms-bewerten` | verb-forms-batch-2 | B2 | focused |
| bewirken | `forms-bewirken` | verb-forms-batch-2 | B2 | focused |
| beziehen | `forms-beziehen` | verb-forms-batch-2 | B2 | focused |
| binden | `forms-binden` | verb-forms-batch-2 | B1 | routine |
| bitten | `forms-bitten` | verb-forms-batch-1 | B1 | routine |
| bleiben | `forms-bleiben` | verb-forms-pilot | A2 | routine |
| brennen | `forms-brennen` | verb-forms-batch-2 | B1 | routine |
| bringen | `forms-bringen` | verb-forms-pilot | A1 | routine |
| darstellen | `forms-darstellen` | verb-forms-batch-2 | B2 | routine |
| definieren | `forms-definieren` | verb-forms-batch-2 | B2 | routine |
| denken | `forms-denken` | verb-forms-pilot | A2 | routine |
| dokumentieren | `forms-dokumentieren` | verb-forms-batch-2 | B2 | routine |
| dringen | `forms-dringen` | verb-forms-final | B2 | focused |
| durchführen | `forms-durchfuehren` | verb-forms-batch-2 | B2 | routine |
| einführen | `forms-einfuehren` | verb-forms-batch-2 | B1 | routine |
| einhalten | `forms-einhalten` | verb-forms-batch-2 | B1 | routine |
| einschätzen | `forms-einschaetzen` | verb-forms-final | B2 | focused |
| einstellen | `forms-einstellen` | verb-forms-batch-2 | B2 | focused |
| empfehlen | `forms-empfehlen` | verb-forms-batch-1 | B1 | routine |
| entfallen | `forms-entfallen` | verb-forms-final | B2 | focused |
| entnehmen | `forms-entnehmen` | verb-forms-batch-2 | B2 | focused |
| entscheiden | `forms-entscheiden` | verb-forms-batch-1 | B1 | routine |
| entsprechen | `forms-entsprechen` | verb-forms-batch-2 | B2 | focused |
| entwerfen | `forms-entwerfen` | verb-forms-batch-2 | B2 | routine |
| entwickeln | `forms-entwickeln` | verb-forms-batch-1 | B2 | routine |
| erfordern | `forms-erfordern` | verb-forms-batch-2 | B2 | focused |
| erfüllen | `forms-erfuellen` | verb-forms-batch-2 | B1 | routine |
| ergeben | `forms-ergeben` | verb-forms-batch-2 | B2 | focused |
| ergreifen | `forms-ergreifen` | verb-forms-final | B2 | focused |
| erkennen | `forms-erkennen` | verb-forms-batch-1 | B2 | routine |
| erklären | `forms-erklaeren` | verb-forms-batch-1 | B1 | routine |
| erlauben | `forms-erlauben` | verb-forms-batch-1 | B1 | routine |
| erläutern | `forms-erlaeutern` | verb-forms-batch-2 | B2 | focused |
| ermitteln | `forms-ermitteln` | verb-forms-batch-2 | B2 | focused |
| ermöglichen | `forms-ermoeglichen` | verb-forms-batch-2 | B2 | routine |
| erörtern | `forms-eroertern` | verb-forms-final | C1 | focused |
| erreichen | `forms-erreichen` | verb-forms-batch-1 | B1 | routine |
| erscheinen | `forms-erscheinen` | verb-forms-batch-1 | B2 | focused |
| ersetzen | `forms-ersetzen` | verb-forms-batch-2 | B1 | routine |
| erstellen | `forms-erstellen` | verb-forms-batch-2 | B2 | routine |
| erwarten | `forms-erwarten` | verb-forms-batch-1 | B1 | routine |
| erweitern | `forms-erweitern` | verb-forms-final | B2 | routine |
| erzählen | `forms-erzaehlen` | verb-forms-batch-1 | B1 | routine |
| essen | `forms-essen` | verb-forms-pilot | A1 | routine |
| fahren | `forms-fahren` | verb-forms-pilot | A1 | focused |
| fallen | `forms-fallen` | verb-forms-batch-1 | B1 | focused |
| fertigen | `forms-fertigen` | verb-forms-final | B2 | routine |
| festlegen | `forms-festlegen` | verb-forms-final | B2 | routine |
| feststellen | `forms-feststellen` | verb-forms-batch-2 | B2 | focused |
| finden | `forms-finden` | verb-forms-pilot | A2 | routine |
| fliegen | `forms-fliegen` | verb-forms-batch-1 | B1 | routine |
| fliehen | `forms-fliehen` | verb-forms-final | B1 | focused |
| folgen | `forms-folgen` | verb-forms-batch-1 | B1 | focused |
| fördern | `forms-foerdern` | verb-forms-batch-2 | B2 | focused |
| führen | `forms-fuehren` | verb-forms-batch-1 | B2 | routine |
| geben | `forms-geben` | verb-forms-pilot | A1 | routine |
| gefallen | `forms-gefallen` | verb-forms-batch-1 | B1 | focused |
| gehen | `forms-gehen` | verb-forms-pilot | A1 | routine |
| gelingen | `forms-gelingen` | verb-forms-final | B2 | focused |
| genehmigen | `forms-genehmigen` | verb-forms-batch-2 | B2 | focused |
| genießen | `forms-geniessen` | verb-forms-final | B1 | focused |
| gewährleisten | `forms-gewaehrleisten` | verb-forms-batch-2 | C1 | focused |
| gewinnen | `forms-gewinnen` | verb-forms-batch-1 | B1 | routine |
| greifen | `forms-greifen` | verb-forms-final | B1 | focused |
| haben | `forms-haben` | verb-forms-pilot | A1 | focused |
| halten | `forms-halten` | verb-forms-batch-1 | B1 | routine |
| heben | `forms-heben` | verb-forms-final | B1 | routine |
| helfen | `forms-helfen` | verb-forms-batch-1 | B1 | routine |
| hervorgehen | `forms-hervorgehen` | verb-forms-final | C1 | focused |
| hervorheben | `forms-hervorheben` | verb-forms-batch-2 | C1 | focused |
| hinweisen | `forms-hinweisen` | verb-forms-batch-2 | B2 | routine |
| installieren | `forms-installieren` | verb-forms-batch-2 | B1 | routine |
| interpretieren | `forms-interpretieren` | verb-forms-final | B2 | focused |
| kennen | `forms-kennen` | verb-forms-batch-1 | A2 | routine |
| klären | `forms-klaeren` | verb-forms-batch-2 | B1 | routine |
| kommen | `forms-kommen` | verb-forms-pilot | A1 | routine |
| können | `forms-koennen` | verb-forms-batch-2 | A2 | focused |
| koordinieren | `forms-koordinieren` | verb-forms-batch-2 | B2 | routine |
| laden | `forms-laden` | verb-forms-batch-2 | B1 | focused |
| lassen | `forms-lassen` | verb-forms-batch-1 | B1 | focused |
| laufen | `forms-laufen` | verb-forms-pilot | A1 | focused |
| leiden | `forms-leiden` | verb-forms-final | B1 | focused |
| leisten | `forms-leisten` | verb-forms-batch-2 | B2 | routine |
| lesen | `forms-lesen` | verb-forms-pilot | A1 | routine |
| liefern | `forms-liefern` | verb-forms-batch-2 | B1 | routine |
| messen | `forms-messen` | verb-forms-batch-2 | B1 | routine |
| mitteilen | `forms-mitteilen` | verb-forms-batch-2 | B1 | routine |
| mögen | `forms-moegen` | verb-forms-batch-2 | A2 | focused |
| montieren | `forms-montieren` | verb-forms-final | B2 | routine |
| nachdenken | `forms-nachdenken` | verb-forms-batch-2 | B1 | routine |
| nachkommen | `forms-nachkommen` | verb-forms-batch-2 | B2 | focused |
| nachlassen | `forms-nachlassen` | verb-forms-batch-2 | B2 | focused |
| nachweisen | `forms-nachweisen` | verb-forms-batch-2 | C1 | focused |
| nehmen | `forms-nehmen` | verb-forms-pilot | A1 | routine |
| nennen | `forms-nennen` | verb-forms-batch-2 | B1 | routine |
| öffnen | `forms-oeffnen` | verb-forms-batch-1 | A2 | routine |
| optimieren | `forms-optimieren` | verb-forms-final | B2 | focused |
| planen | `forms-planen` | verb-forms-batch-1 | B1 | routine |
| prüfen | `forms-pruefen` | verb-forms-batch-1 | B2 | routine |
| rechnen | `forms-rechnen` | verb-forms-batch-1 | B1 | routine |
| rechtfertigen | `forms-rechtfertigen` | verb-forms-final | C1 | focused |
| regeln | `forms-regeln` | verb-forms-batch-2 | B2 | focused |
| reisen | `forms-reisen` | verb-forms-batch-1 | A2 | routine |
| riechen | `forms-riechen` | verb-forms-final | B2 | focused |
| rufen | `forms-rufen` | verb-forms-batch-1 | B1 | routine |
| schaffen | `forms-schaffen` | verb-forms-batch-1 | B2 | focused |
| schätzen | `forms-schaetzen` | verb-forms-final | B2 | focused |
| scheitern | `forms-scheitern` | verb-forms-batch-2 | B2 | focused |
| schlafen | `forms-schlafen` | verb-forms-batch-1 | A2 | routine |
| schlagen | `forms-schlagen` | verb-forms-final | B2 | focused |
| schließen | `forms-schliessen` | verb-forms-batch-1 | B1 | routine |
| schneiden | `forms-schneiden` | verb-forms-final | B1 | routine |
| schreiben | `forms-schreiben` | verb-forms-pilot | A1 | routine |
| schweigen | `forms-schweigen` | verb-forms-final | B2 | routine |
| sehen | `forms-sehen` | verb-forms-pilot | A1 | routine |
| simulieren | `forms-simulieren` | verb-forms-batch-2 | B2 | focused |
| sinken | `forms-sinken` | verb-forms-final | B1 | focused |
| sprechen | `forms-sprechen` | verb-forms-pilot | A1 | routine |
| steigen | `forms-steigen` | verb-forms-final | B1 | focused |
| sterben | `forms-sterben` | verb-forms-batch-1 | B1 | routine |
| steuern | `forms-steuern` | verb-forms-batch-2 | B2 | focused |
| stoßen | `forms-stossen` | verb-forms-final | B2 | focused |
| streiten | `forms-streiten` | verb-forms-final | B1 | focused |
| suchen | `forms-suchen` | verb-forms-batch-1 | A2 | routine |
| teilnehmen | `forms-teilnehmen` | verb-forms-batch-1 | B1 | routine |
| treffen | `forms-treffen` | verb-forms-batch-1 | B1 | routine |
| treiben | `forms-treiben` | verb-forms-final | B2 | focused |
| trinken | `forms-trinken` | verb-forms-batch-1 | A2 | routine |
| tun | `forms-tun` | verb-forms-batch-1 | A2 | routine |
| übernehmen | `forms-uebernehmen` | verb-forms-batch-1 | B2 | focused |
| übertragen | `forms-uebertragen` | verb-forms-batch-2 | B2 | focused |
| überzeugen | `forms-ueberzeugen` | verb-forms-batch-1 | B2 | focused |
| umsetzen | `forms-umsetzen` | verb-forms-batch-2 | B2 | focused |
| unterscheiden | `forms-unterscheiden` | verb-forms-batch-2 | B2 | focused |
| unterstützen | `forms-unterstuetzen` | verb-forms-batch-1 | B2 | focused |
| untersuchen | `forms-untersuchen` | verb-forms-batch-2 | B2 | focused |
| validieren | `forms-validieren` | verb-forms-batch-2 | C1 | focused |
| veranlassen | `forms-veranlassen` | verb-forms-final | C1 | focused |
| verbessern | `forms-verbessern` | verb-forms-batch-1 | B1 | routine |
| verbinden | `forms-verbinden` | verb-forms-batch-2 | B1 | routine |
| verfügen | `forms-verfuegen` | verb-forms-final | C1 | focused |
| vergleichen | `forms-vergleichen` | verb-forms-batch-1 | B2 | routine |
| verlieren | `forms-verlieren` | verb-forms-batch-1 | B1 | routine |
| vermeiden | `forms-vermeiden` | verb-forms-batch-2 | B1 | routine |
| vermitteln | `forms-vermitteln` | verb-forms-batch-2 | B2 | focused |
| veröffentlichen | `forms-veroeffentlichen` | verb-forms-batch-2 | B2 | routine |
| verringern | `forms-verringern` | verb-forms-final | B2 | routine |
| versagen | `forms-versagen` | verb-forms-batch-2 | B2 | focused |
| verschieben | `forms-verschieben` | verb-forms-batch-2 | B1 | routine |
| verstehen | `forms-verstehen` | verb-forms-batch-1 | B1 | routine |
| versuchen | `forms-versuchen` | verb-forms-batch-1 | B1 | routine |
| verweisen | `forms-verweisen` | verb-forms-final | B2 | focused |
| verzeihen | `forms-verzeihen` | verb-forms-final | B1 | routine |
| voraussetzen | `forms-voraussetzen` | verb-forms-batch-2 | C1 | focused |
| vorbereiten | `forms-vorbereiten` | verb-forms-batch-1 | B1 | routine |
| vorschlagen | `forms-vorschlagen` | verb-forms-batch-1 | B2 | routine |
| vorsehen | `forms-vorsehen` | verb-forms-batch-2 | B2 | focused |
| wachsen | `forms-wachsen` | verb-forms-batch-1 | B1 | focused |
| wahrnehmen | `forms-wahrnehmen` | verb-forms-batch-2 | B2 | focused |
| wechseln | `forms-wechseln` | verb-forms-batch-1 | B1 | routine |
| werden | `forms-werden` | verb-forms-pilot | A1 | focused |
| widerlegen | `forms-widerlegen` | verb-forms-final | C1 | focused |
| widersprechen | `forms-widersprechen` | verb-forms-final | C1 | focused |
| wissen | `forms-wissen` | verb-forms-pilot | A2 | focused |
| wollen | `forms-wollen` | verb-forms-final | A2 | focused |
| zeigen | `forms-zeigen` | verb-forms-batch-1 | A2 | routine |
| ziehen | `forms-ziehen` | verb-forms-batch-1 | B1 | focused |
| zuhören | `forms-zuhoeren` | verb-forms-batch-1 | B1 | routine |
| zunehmen | `forms-zunehmen` | verb-forms-batch-2 | B2 | focused |
| zurückführen | `forms-zurueckfuehren` | verb-forms-batch-2 | C1 | focused |
| zusammenfassen | `forms-zusammenfassen` | verb-forms-final | B2 | routine |
| zustimmen | `forms-zustimmen` | verb-forms-batch-2 | B1 | routine |
| zwingen | `forms-zwingen` | verb-forms-final | B2 | routine |
