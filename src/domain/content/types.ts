export type GovernedCase = 'accusative' | 'dative' | 'genitive';
export interface Example {
  id: string;
  domain: 'everyday' | 'technical';
  de: string;
  en: string;
}
export interface Entry {
  id: string;
  kind: 'verb';
  lemma: string;
  construction: string;
  meaningEn: string;
  preposition: string;
  governedCase: GovernedCase;
  reflexiveCase: 'accusative' | 'dative' | null;
  cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null;
  tags: string[];
  examples: Example[];
  editorialStatus: 'prototype-reviewed' | 'reviewed';
}
interface QuestionBase {
  id: string;
  revision: number;
  entryId: string;
  prompt: string;
  exampleId: string | null;
  explanation: string;
}
export type Question = QuestionBase & (
  | { type: 'preposition_cloze'; acceptedAnswers: string[] }
  | { type: 'case_choice' | 'meaning_choice'; choices: { id: string; text: string }[]; correctChoiceId: string }
);
export interface Block {
  id: string;
  title: string;
  description: string;
  questionIds: string[];
}
export interface ContentPack {
  schemaVersion: 1;
  packId: string;
  packVersion: number;
  title: string;
  entries: Entry[];
  questions: Question[];
  blocks: Block[];
}
