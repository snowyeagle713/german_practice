# Source content audit
Source: earlier German - Lng/Pasted markdown.md, retrieved 3 October 2026. The complete 3,443-line text is retained in content/source/verbs-reference.md.

## Mechanical findings
- 200 numbered headings.
- 37 distinct exact heading strings after removing numbering.
- 163 numbered entries repeat an existing heading.
- All 37 headings repeat; the largest group appears six times.

This method does not count distinct lemmas, verify grammar/translation, or detect semantically equivalent headings. Some headings combine meanings or prepositions, so they require splitting before app import.

content/source/audit.json records all source-number groups.
content/source/candidates.json retains the first LaTeX box for each heading and all corresponding source numbers. These are draft candidates, not runtime content.

## Consequence
Do not label this as 200 unique verbs or make five 40-entry blocks from repeated boxes. That would inflate curriculum size and create repeated questions disguised as new content.

## Starter content
content/seed-pack.json contains 10 preposition constructions selected from this reference, with shortened/adapted examples and explicitly authored questions. Ten constructions × four questions gives a genuine fixed 40-question block.
Editorial status is prototype-reviewed: prepared and checked during this handoff, not independently reviewed by a German-language teacher. CEFR remains null.
The rest of the source remains separate; direct-object and combined-preposition constructions need deliberate schemas and question writing.

## Later content process
Deduplicate -> split construction/meaning variants -> check examples/meaning/cases -> author prompts/accepted alternatives -> assign stable IDs -> place themed blocks -> validate -> pilot with Yacine.
Do not use automatic numbering as identity. Do not treat mere schema validity as linguistic accuracy.

