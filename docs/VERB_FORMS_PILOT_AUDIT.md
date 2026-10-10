# Verb Forms pilot: linguistic and source audit

Checked 10 October 2026. Scope: twenty common lexical verb profiles, two ten-item blocks, seven distinct question templates per verb (140 authored instances). This is a small capability pilot, not the remaining curriculum. Review status means source-checked facts plus editorial/self-review, not independent teacher/native-speaker certification.

## References actually inspected

- [German Verbs Database README](https://github.com/viorelsfetea/german-verbs-database): identifies its conjugation table as extracted from Wiktionary.
- [Conjugation CSV](https://raw.githubusercontent.com/viorelsfetea/german-verbs-database/master/output/verbs.csv): retrieved through permitted network access; 8,047 rows. Source SHA-256: `7fbac9b469e6226614385c20fc59f15b6014dd070f04387a875e2465cb223ce3`.
- `content/source/verb-forms-verification.json` records the twenty factual rows used for independent fixture comparisons. The full third-party CSV is not shipped, nor is its explanatory prose copied. This is a third-party Wiktionary transcription, not a direct inspection of live Wiktionary pages.

Direct requests to Duden, DWDS and Verbformen were denied by the cloud's enforced destination policy (HTTP proxy 403); no bypass was attempted. They are recommended secondary checks for a later independent editorial pass, not claimed sources read here. The transcript includes the actual access failures. Conjugation facts were cross-checked against the accessible reference table; classification, contexts, examples and caveats were editorially reviewed. Source accuracy is not guaranteed merely by a JSON validator.

## Checked facts

Präteritum below is the first-person singular; Präsens is third-person singular. Forms omit pronouns; separable profiles show both verb and particle.

| Infinitive | Präsens | Präteritum | Partizip II | Auxiliary in pilot context | Profile |
| --- | --- | --- | --- | --- | --- |
| arbeiten | arbeitet | arbeitete | gearbeitet | haben | weak |
| aufstehen | steht auf | stand auf | aufgestanden | sein | strong, separable auf- |
| bleiben | bleibt | blieb | geblieben | sein | strong |
| bringen | bringt | brachte | gebracht | haben | mixed |
| denken | denkt | dachte | gedacht | haben | mixed |
| essen | isst | aß | gegessen | haben | strong, e → i |
| fahren | fährt | fuhr | gefahren | sein | strong, a → ä |
| finden | findet | fand | gefunden | haben | strong |
| geben | gibt | gab | gegeben | haben | strong, e → i |
| gehen | geht | ging | gegangen | sein | strong |
| haben | hat | hatte | gehabt | haben | irregular |
| kommen | kommt | kam | gekommen | sein | strong |
| laufen | läuft | lief | gelaufen | sein | strong, au → äu |
| lesen | liest | las | gelesen | haben | strong, e → ie |
| nehmen | nimmt | nahm | genommen | haben | strong, e → i with consonant change |
| schreiben | schreibt | schrieb | geschrieben | haben | strong |
| sehen | sieht | sah | gesehen | haben | strong, e → ie |
| sprechen | spricht | sprach | gesprochen | haben | strong, e → i |
| werden | wird | wurde | geworden | sein | strong with irregular present, e → i |
| wissen | weiß | wusste | gewusst | haben | preterite-present, grouped as mixed |

`arbeiten` and `aufstehen` replace two suggested candidates to exercise weak forms and separability. `laufen` is retained instead of `sein`: the chosen reference table lacks a sein row, so this pilot does not pretend to have verified that candidate from it. All twenty selected verbs have matching reference rows. No uncertain candidate was filled from an invented conjugation rule.

## Context, variants and usage decisions

- `fahren`: authored context is travel by train to Berlin, with sein. Transitive driving can use haben; no global one-auxiliary claim. `laufen` is movement through a park; region/context-dependent other uses are outside this profile. `gehen`, `kommen`, `aufstehen`, `bleiben` use standard lexical sein in their stated contexts.
- `werden`: lexical “become,” e.g. becoming an engineer, takes geworden. The passive auxiliary's worden is a different use and is not accepted for this lexical question.
- `bringen` tests bringen, not mitbringen. Its example is “Er hat das Buch gebracht.” Particle placement in aufstehen is shown as “steht auf” / “stand auf”; sentence completion tests aufgestanden in a correct Perfekt clause rather than placing a split finite form in one misleading blank.
- `wissen`: preterite-present morphology is noted rather than presented as a generic e → i strong verb. Its i → ei cue summarizes the present vowel change, not every spelling/consonant change. `nehmen` likewise includes consonant change; the card's vowel cue is not a complete conjugation generator.
- No regional or obsolete spelling variants are authored as correct alternatives. Standard `wusste` and `aß` retain modern orthography. Normalization trims/collapses whitespace, uses Unicode NFC and ignores case; umlauts and ß remain significant. An uppercase ẞ normalizes correctly; SS is not silently substituted for ß. Full sentences/pronouns are not accepted when the prompt asks for a bare principal part.
- Examples are original, neutral modern German. Five additional professional examples use design work, failure causes, requirements, test reports and project results where natural. Technical examples are not forced on every verb.
- A1/A2 labels are explicitly editorial prerequisite estimates inside a B1→C1 learning path, not claims of an official CEFR word list. Original Starter CEFR remains null. All pilot profiles are neutral register and common everyday vocabulary; professional relevance is a broad usefulness estimate, not a corpus-derived rank.

## Question review

Each verb has past recall, participle recall, contextual auxiliary choice, past-form → infinitive recall, third-person present recall, contextual participle completion and principal-form sequence recognition. The first two blocks contain 70 questions each. Shared answers in isolated recall versus contextual completion teach different facets; no identical prompt/answer pairs or duplicate IDs were added.

Auxiliary prompts omit the finite auxiliary and specify the actual context; choices are haben/sein. Sequence distractors are deliberate learner errors in one principal part, not alternative accepted profiles. Completion reconstructs a canonical authored example exactly. All answers are checked against their referenced canonical facet. Hints omit the requested form/option; auxiliary hints describe event reasoning rather than stating a German auxiliary. Reveal remains explicit assistance.

## Editorial limits

The fetched dataset is an established-source-derived reference, not an independent expert review. Automatic checks establish structural consistency and agreement with the captured source facts; they cannot prove every sentence's pedagogical quality or every CEFR estimate. Future batches must repeat source/ambiguity/deduplication review rather than treating this twenty-verb pilot as a conjugation generator. Independent German-language review is useful before scaling, particularly for conditional auxiliary profiles and nuanced variants.
