# Verb Forms Population Batch 1 — content and compatibility audit

Branch: `content/verb-forms-batch-1`, based on the **published** `content/curriculum-architecture` at `b7c9a9cdb40ba480dcae7e4d2118982f6ca89929`. The curriculum branch already contains the approved twenty-verb v2 pilot. Inspected remotely on 10 October 2026; main was `816dabaf67d7f3bcd170220ad15201bac3b685b8`. This task publishes only the new review branch, without merging or changing either baseline branch.

## Scope, organization and identity

Exactly **80 new canonical verb profiles**, **eight new ten-verb blocks**, **560 new questions** (seven proven templates per profile). With the untouched pilot: **100 Verb Forms, ten blocks, 700 questions**. Starter remains ten constructions / one block / forty questions. Whole runtime catalog: 110 learning records, eleven blocks, 740 authored questions. The remaining approximately 140 Verb Forms are a separately authorized future task.

New native v2 pack: `content/verb-forms-batch-1.json`, pack ID `verb-forms-batch-1`, first published packVersion **1**. Item/question/example IDs are deterministic ASCII transliterations (e.g. `forms-abschliessen`); visible German spelling retains ß/umlauts. Block IDs `verb-forms-batch-1-01` through `-08` are independent of mutable display ranges. Existing pilot blocks, packVersion, source facts, seed IDs and snapshots are unchanged. New records do not duplicate pilot lemmas. Prefix relatives are distinct lexical profiles, not renamed inflections.

The only integration edits register the authored file in the existing loader, Vite asset list and validation command, and sort the existing alphabetical links across packs. The existing per-pack sort would otherwise put all pilot verbs before new a-verbs. This is a catalog-order correction, not a runtime architecture or layout redesign. Cards retain their pack grouping so pilot IDs/positions do not change. No schema, validator, grader, session engine, IndexedDB, backup, service-worker logic, theme, CSS, dependencies or planning-map changes. No level filter or additional category handler has been added.

Authoring checkpoints commit two reviewed blocks at a time while the new pack is unregistered, followed by the integration/audit checkpoint. Those intermediate contents are unpublished drafts; the completed released version 1 pool is immutable. No application-time generator or Python dependency ships.

## References actually inspected

- [German Verbs Database README](https://raw.githubusercontent.com/viorelsfetea/german-verbs-database/master/README.md): identifies the database as conjugations extracted from Wiktionary.
- [Reference CSV](https://raw.githubusercontent.com/viorelsfetea/german-verbs-database/master/output/verbs.csv): freshly retrieved for this batch, **8,047 rows**, SHA-256 `7fbac9b469e6226614385c20fc59f15b6014dd070f04387a875e2465cb223ce3`, identical to the pilot reference.
- `content/source/verb-forms-batch-1-verification.json`: captures all eighty factual rows (third-person singular present, first-person singular Präteritum, participle and auxiliary), date, source checksum, provenance and scoped editorial decisions. An independent local comparison against the downloaded CSV found one matching row per selected lemma and agreement on all **320 factual fields**. Unit tests compare the published pack with these captured facts without a runtime network dependency.

Direct Duden and DWDS requests were denied by the environment's destination policy (CONNECT proxy 403, curl 56); no bypass attempted. This follows the pilot's accessible established-source-derived reference approach. It is a **third-party Wiktionary transcription**, not a direct inspection of live dictionary pages and not a corpus-frequency study. No copyrighted explanations/examples were copied: factual forms were transcribed; English glosses, examples, hints, explanations and editorial metadata were authored for this pack. Classifications, stem cues, contextual readings and level estimates are editorial/self-review, not separately certified by that CSV.

## Selection and level estimates

High everyday usefulness plus productive B1/B2/professional value guided selection, without invented frequency ranks. Distribution of **new** profiles: **A2 18, B1 47, B2 15** (62/80 intermediate); no forced C1 labels. Pilot estimates remain A1 15 / A2 5, giving total inventory **A1 15, A2 23, B1 47, B2 15**. Each record's `levelNote` distinguishes common prerequisite, core intermediate or intermediate extension with advanced productive value. An intermediate verb can remain useful at C1 without becoming a C1-only word. Estimates schedule study; they do not certify a CEFR vocabulary list or learner proficiency. The unchanged pilot Learn renderer uses its generic “editorial prerequisite estimate” caption for all levels; detailed rationale is retained in content/audit metadata, not a newly exposed filtering interface.

Classification: **48 strong, 29 weak, two mixed, one irregular**. Separability: **22 separable, 31 inseparable, 27 unprefixed**. All profiles are neutral modern usage. Eighty original everyday examples plus **35 additional professional/technical examples** cover requirements, reporting, validation, simulation, sensors, testing, project work and documentation where natural. Professional relevance is a broad editorial usefulness band, not a measured frequency rank.

## Blocks added

| Stable block ID | Alphabetical range | Verbs | Questions |
| --- | --- | ---: | ---: |
| `verb-forms-batch-1-01` | abfahren–ansehen | 10 | 70 |
| `verb-forms-batch-1-02` | anziehen–bedeuten | 10 | 70 |
| `verb-forms-batch-1-03` | beginnen–bitten | 10 | 70 |
| `verb-forms-batch-1-04` | empfehlen–erzählen | 10 | 70 |
| `verb-forms-batch-1-05` | fallen–lassen | 10 | 70 |
| `verb-forms-batch-1-06` | öffnen–sterben | 10 | 70 |
| `verb-forms-batch-1-07` | suchen–vergleichen | 10 | 70 |
| `verb-forms-batch-1-08` | verlieren–zuhören | 10 | 70 |

## Checked profiles

Präsens is third-person singular, Präteritum first-person singular. Auxiliary is **for the specified lexical context**, not a universal claim for every sense. Prefix notation s = separable, i = inseparable, — = unprefixed. All forms below match the accessible source row; meaning/context and level placement are editorial decisions.

| Verb | Meaning / profile | Präsens | Präteritum | Partizip II | Auxiliary | Class | Prefix | Estimate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| abfahren | to depart (vehicle) | fährt ab | fuhr ab | abgefahren | sein | strong | s: ab | A2 |
| abgeben | to hand in | gibt ab | gab ab | abgegeben | haben | strong | s: ab | B1 |
| abholen | to pick up | holt ab | holte ab | abgeholt | haben | weak | s: ab | A2 |
| abschließen | to complete / conclude | schließt ab | schloss ab | abgeschlossen | haben | strong | s: ab | B1 |
| anbieten | to offer | bietet an | bot an | angeboten | haben | strong | s: an | B1 |
| anfangen | to start | fängt an | fing an | angefangen | haben | strong | s: an | A2 |
| ankommen | to arrive | kommt an | kam an | angekommen | sein | strong | s: an | A2 |
| annehmen | to accept | nimmt an | nahm an | angenommen | haben | strong | s: an | B2 |
| anrufen | to call by phone | ruft an | rief an | angerufen | haben | strong | s: an | A2 |
| ansehen | to look at / watch | sieht an | sah an | angesehen | haben | strong | s: an | B1 |
| anziehen | to put on (clothing) | zieht an | zog an | angezogen | haben | strong | s: an | A2 |
| aufgeben | to give up | gibt auf | gab auf | aufgegeben | haben | strong | s: auf | B1 |
| aufhören | to stop (an activity) | hört auf | hörte auf | aufgehört | haben | weak | s: auf | B1 |
| aufnehmen | to record (audio) | nimmt auf | nahm auf | aufgenommen | haben | strong | s: auf | B2 |
| ausgeben | to spend (money) | gibt aus | gab aus | ausgegeben | haben | strong | s: aus | B1 |
| aussehen | to look / appear | sieht aus | sah aus | ausgesehen | haben | strong | s: aus | A2 |
| aussteigen | to get out / get off | steigt aus | stieg aus | ausgestiegen | sein | strong | s: aus | A2 |
| ausziehen | to move out (of a home) | zieht aus | zog aus | ausgezogen | sein | strong | s: aus | B1 |
| beantworten | to answer (a question) | beantwortet | beantwortete | beantwortet | haben | weak | i: be | B1 |
| bedeuten | to mean / signify | bedeutet | bedeutete | bedeutet | haben | weak | i: be | B1 |
| beginnen | to begin | beginnt | begann | begonnen | haben | strong | i: be | B1 |
| behalten | to keep / retain | behält | behielt | behalten | haben | strong | i: be | B1 |
| bekommen | to get / receive | bekommt | bekam | bekommen | haben | strong | i: be | A2 |
| benutzen | to use | benutzt | benutzte | benutzt | haben | weak | i: be | B1 |
| beobachten | to observe / watch | beobachtet | beobachtete | beobachtet | haben | weak | i: be | B2 |
| beschließen | to decide / resolve | beschließt | beschloss | beschlossen | haben | strong | i: be | B2 |
| beschreiben | to describe | beschreibt | beschrieb | beschrieben | haben | strong | i: be | B1 |
| besprechen | to discuss | bespricht | besprach | besprochen | haben | strong | i: be | B1 |
| bestellen | to order | bestellt | bestellte | bestellt | haben | weak | i: be | A2 |
| bitten | to ask / request | bittet | bat | gebeten | haben | strong | — | B1 |
| empfehlen | to recommend | empfiehlt | empfahl | empfohlen | haben | strong | i: emp | B1 |
| entscheiden | to decide (a matter) | entscheidet | entschied | entschieden | haben | strong | i: ent | B1 |
| entwickeln | to develop | entwickelt | entwickelte | entwickelt | haben | weak | i: ent | B2 |
| erkennen | to recognize | erkennt | erkannte | erkannt | haben | mixed | i: er | B2 |
| erklären | to explain | erklärt | erklärte | erklärt | haben | weak | i: er | B1 |
| erlauben | to allow | erlaubt | erlaubte | erlaubt | haben | weak | i: er | B1 |
| erreichen | to reach / achieve | erreicht | erreichte | erreicht | haben | weak | i: er | B1 |
| erscheinen | to appear / be published | erscheint | erschien | erschienen | sein | strong | i: er | B2 |
| erwarten | to expect | erwartet | erwartete | erwartet | haben | weak | i: er | B1 |
| erzählen | to tell / recount | erzählt | erzählte | erzählt | haben | weak | i: er | B1 |
| fallen | to fall | fällt | fiel | gefallen | sein | strong | — | B1 |
| fliegen | to fly (travel) | fliegt | flog | geflogen | sein | strong | — | B1 |
| folgen | to follow | folgt | folgte | gefolgt | sein | weak | — | B1 |
| führen | to lead / conduct | führt | führte | geführt | haben | weak | — | B2 |
| gefallen | to please / appeal to | gefällt | gefiel | gefallen | haben | strong | i: ge | B1 |
| gewinnen | to win / gain | gewinnt | gewann | gewonnen | haben | strong | i: ge | B1 |
| halten | to hold / keep | hält | hielt | gehalten | haben | strong | — | B1 |
| helfen | to help | hilft | half | geholfen | haben | strong | — | B1 |
| kennen | to know / be familiar with | kennt | kannte | gekannt | haben | mixed | — | A2 |
| lassen | to leave (something in a place) | lässt | ließ | gelassen | haben | strong | — | B1 |
| öffnen | to open | öffnet | öffnete | geöffnet | haben | weak | — | A2 |
| planen | to plan | plant | plante | geplant | haben | weak | — | B1 |
| prüfen | to check / examine | prüft | prüfte | geprüft | haben | weak | — | B2 |
| rechnen | to calculate | rechnet | rechnete | gerechnet | haben | weak | — | B1 |
| reisen | to travel | reist | reiste | gereist | sein | weak | — | A2 |
| rufen | to call / shout | ruft | rief | gerufen | haben | strong | — | B1 |
| schaffen | to create (not accomplish) | schafft | schuf | geschaffen | haben | strong | — | B2 |
| schlafen | to sleep | schläft | schlief | geschlafen | haben | strong | — | A2 |
| schließen | to close | schließt | schloss | geschlossen | haben | strong | — | B1 |
| sterben | to die | stirbt | starb | gestorben | sein | strong | — | B1 |
| suchen | to look for | sucht | suchte | gesucht | haben | weak | — | A2 |
| teilnehmen | to participate | nimmt teil | nahm teil | teilgenommen | haben | strong | s: teil | B1 |
| treffen | to meet / hit | trifft | traf | getroffen | haben | strong | — | B1 |
| trinken | to drink | trinkt | trank | getrunken | haben | strong | — | A2 |
| tun | to do | tut | tat | getan | haben | irregular | — | A2 |
| übernehmen | to take over / assume | übernimmt | übernahm | übernommen | haben | strong | i: über | B2 |
| überzeugen | to convince | überzeugt | überzeugte | überzeugt | haben | weak | i: über | B2 |
| unterstützen | to support | unterstützt | unterstützte | unterstützt | haben | weak | i: unter | B2 |
| verbessern | to improve | verbessert | verbesserte | verbessert | haben | weak | i: ver | B1 |
| vergleichen | to compare | vergleicht | verglich | verglichen | haben | strong | i: ver | B2 |
| verlieren | to lose | verliert | verlor | verloren | haben | strong | i: ver | B1 |
| verstehen | to understand | versteht | verstand | verstanden | haben | strong | i: ver | B1 |
| versuchen | to try / attempt | versucht | versuchte | versucht | haben | weak | i: ver | B1 |
| vorbereiten | to prepare | bereitet vor | bereitete vor | vorbereitet | haben | weak | s: vor | B1 |
| vorschlagen | to suggest / propose | schlägt vor | schlug vor | vorgeschlagen | haben | strong | s: vor | B2 |
| wachsen | to grow | wächst | wuchs | gewachsen | sein | strong | — | B1 |
| wechseln | to change / switch (transitive) | wechselt | wechselte | gewechselt | haben | weak | — | B1 |
| zeigen | to show | zeigt | zeigte | gezeigt | haben | weak | — | A2 |
| ziehen | to pull (transitive) | zieht | zog | gezogen | haben | strong | — | B1 |
| zuhören | to listen | hört zu | hörte zu | zugehört | haben | weak | s: zu | B1 |

## Variant, auxiliary and lexical decisions

- **schaffen** explicitly means **create**: schuf / geschaffen. Weak accomplish/manage uses schaffte / geschafft. Prompts disclose “create (not accomplish)” or reconstruct the authored create context; weak forms are used as distractors only under that explicit sense. No claim that they are globally invalid German.
- **wachsen** explicitly means **grow**: wuchs / gewachsen with sein. Weak waxing/coating with wax is another transitive lexical use (wachste / gewachst with haben); its forms are distractors only under the stated grow sense. The canonical grow forms match the captured reference; the excluded secondary sense is an editorial caveat for independent follow-up, not a second dictionary row verified here.
- **ausziehen** means moving out of a flat, with sein. Transitive/reflexive undressing takes haben and is outside this record. **anziehen** means putting on an item of clothing, with haben. No undressing auxiliary ambiguity is hidden in the question.
- **ziehen** is transitive pulling, with haben. Relocating to a city may take sein. **fliegen** is intransitive travel to a destination, with sein; transitive piloting with haben is not graded here. **wechseln** tests changing/replacing an object with haben, not directional movement with a different auxiliary.
- **lassen** tests standalone leaving something somewhere (ließ / gelassen). Causative/modal clauses with another infinitive and the Ersatzinfinitiv lassen are outside the template scope.
- **fallen / gefallen** share gefallen but differ in meaning, present, past and auxiliary. Lexical gefallen takes a dative experiencer and gefiel; fallen has fiel and sein in the fall context. They are retained as distinct profiles, not collapsed by participle deduplication.
- **folgen** follows a path with sein; no simplistic “every motion verb uses sein” grading rule is introduced. **erscheinen** uses sein for appearing at an appointment; publication shares principal parts. **abfahren / ankommen / aussteigen / sterben / wachsen** use their canonical sein profiles.
- **kennen / erkennen** are mixed; **tun** is grouped as irregular. **übernehmen / überzeugen / unterstützen** are inseparable in the selected senses. No stress-dependent alternate prefix use is treated as another accepted answer. Separable finite forms retain postposed particles; sentence completion tests an intact participle in a correct Perfekt clause.
- **anfangen / beginnen**, **beschließen / entscheiden**, and **schließen / abschließen** were examined as near-neighbours and retained: they teach distinct lemmas, morphology/particle placement and scoped uses. They are not counts of surface inflections. **annehmen / aufnehmen / aufgeben** retain a single canonical profile with explicit selected meanings; untested secondary meanings are noted rather than generated as extra records.
- No modal-double-infinitive templates, weak/strong senden or wenden variants, regional sitzen/stehen/liegen auxiliaries, archaic forms or unsupported reflexive profiles were added. These higher-ambiguity candidates were left for a separately sourced later batch rather than filling quota gaps.
- Modern orthography only; no SS-for-ß or unmarked umlaut transliteration. Existing NFC/space/case normalization remains unchanged. No full sentences/pronouns are accepted when a bare principal part is requested. No unverified/regional alternative is accepted and no fuzzy grading is introduced.

## Question quality and deduplication

All seven proven templates are suitable in the scoped profiles: past recall, participle recall, contextual auxiliary choice, past form → infinitive, third-person present recall, participle sentence completion and principal-part sequence choice. Each new verb has seven fixed instances / block seventy, supporting normal Quick **10** and Standard **20** without padding or omitted IDs. Technical completion uses the second authored example for thirty-five verbs; isolated participle recall and contextual completion share an answer but have distinct prompt/task contexts. No paraphrased repeats were added to inflate pools.

Auxiliary choice masks the finite auxiliary in the original example and explicitly requests its infinitive. Other ambiguity-sensitive prompts include the selected meaning. Sequence distractors target wrong stems/endings, omitted particles, extra ge- or wrong tense; legitimate other-sense schaffen forms are flagged above. First grading stays immutable, hints/reveal assisted, original scores remain unchanged by revision.

Hint tests cover **all 560** instances, including both auxiliary option strings. Infinitive hints omit the lemma/meaning that could disclose it. Other hints give meaning, classification or grammatical category, never the tested form. Reveal remains the sole explicit answer-assistance route. Sentence cloze reconstruction matches its referenced example exactly. Catalog tests check normalized lemmas, IDs, examples, prompt/answer pairs, alphabetical order, block membership and per-item/template counts across both Verb Forms packs. The runtime validator is unchanged and still rejects unsupported/corrupt data. Agreement with captured answers does not, by itself, prove linguistic correctness; source and editorial reviews are separate gates.

## Verification

Commands on Linux, Node 24.19.0/npm 11.9.0, system Chromium:

```text
node --import tsx scripts/validate-curriculum-map.ts
npm run validate:content
npm run typecheck
npm test
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=1
```

Final gates passed: planning-map validation; content validation for unchanged v1 Starter (10/40/1), preserved v2 pilot (20/140/2) and new v2 batch (80/560/8); strict TypeScript; **1,020/1,020 unit tests across twelve files**; production build; **83/83 browser tests**, one Chromium worker, **6.2 minutes**; `git diff --check`. No tests skipped or validators weakened. Built batch asset is approximately 643.61 kB / 38.32 kB gzip; CSS is byte-identical to the pilot build. Both content packs and core assets are precached; new-block offline tests use confirmed readiness, disabled networking and a fresh page.

Preliminary browser findings were resolved before the full run. The sandbox initially denied localhost listen (EPERM); the same test command ran with network permission, without changing app configuration. A duplicated completion prompt for suchen/verlieren caused the test answer lookup to select the other item: the original examples were refined into distinct natural contexts and the unit audit now rejects duplicate prompts even when accepted answers differ. The corrected Quick/revision/restore scenario passed, then the entire suite passed. Final runtime/content bytes stayed unchanged after that complete production run; only audit/source-review metadata and Git checkpoints followed.

New browser coverage checks all one hundred alphabetical links, exact emitted content bytes, all eight new Learn/Quick-or-Standard starts, hint/keyboard/feedback resume, complete Quick and Standard runs, rotation, wrong/assisted revision, original score retention, progress, saved draft/theme restore into a fresh profile, and production offline new-page launch through every new block followed by resume/completion/export. The full existing suite covers Starter, pilot, legacy/mixed backups, service-worker update compatibility, palettes and responsive layouts.

## Readiness and manual follow-up

Ready for review/merge into `content/curriculum-architecture` once all recorded gates pass. Publication is a normal push of `content/verb-forms-batch-1` only; no main merge or automatic next batch. Baseline seed/pilot schemas, content, source artifacts, architecture docs, palette tokens, PWA/storage logic and lockfile are preserved.

No unresolved source-row contradiction remains in the eighty selected profiles. **Independent German-language review remains advisable**, especially schaffen, wachsen, ausziehen, ziehen, fliegen, lassen, prefix/stem metadata, original technical sentences and level estimates. This is not claimed as independent native-speaker certification. Future broader sense/variant support must be explicitly authored/versioned; this batch does not add accepted alternatives to the runtime schema.

Linux Chromium automation does not certify Windows Edge installed-app behavior. On Windows verify existing-profile upgrade with v1/pilot history, new-block Learn/practice/resume/revision, native backup dialogs, installed-PWA offline reopen with the server stopped, safe update across tabs and 150% scaling/keyboard accessibility. Cache readiness must be confirmed after the update before relying on the newly added content offline. Actual tablet/phone touch/installation remains unverified. Content source access limits and editorial CEFR uncertainty remain visible above.
