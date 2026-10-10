import type { Example } from './types';

export type VerbFacet = 'praeteritum' | 'participle' | 'auxiliary' | 'infinitive' | 'present' | 'sequence';
export type VerbTemplate = 'past-recall' | 'participle-recall' | 'auxiliary-choice' | 'infinitive-recall' | 'present-recall' | 'sentence-completion' | 'sequence-choice';
export interface VerbForm {
  id: string;
  contentType: 'verb-forms';
  title: string;
  meaningEn: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null;
  levelNote: string;
  themeId: 'common-action' | 'movement-and-change' | 'communication' | 'professional-action';
  register: 'neutral' | 'formal' | 'conversational';
  relevance: { everyday: 'high' | 'medium'; professional: 'high' | 'medium' | 'low' };
  alphabeticalGroup: string;
  examples: Example[];
  sourceNotes: string[];
  editorialStatus: 'source-checked';
  properties: {
    infinitive: string;
    present3: string;
    stemChange: { from: string; to: string } | null;
    praeteritum: string;
    participle: string;
    auxiliary: 'haben' | 'sein';
    auxiliaryContext: string;
    auxiliaryNote: string;
    classification: 'strong' | 'weak' | 'mixed' | 'irregular';
    separability: 'none' | 'separable' | 'inseparable';
    prefix: string | null;
  };
}
interface VerbQuestionBase {
  id: string;
  revision: number;
  itemId: string;
  facetId: VerbFacet;
  templateId: VerbTemplate;
  templateVersion: 1;
  prompt: string;
  exampleId: string;
  explanation: string;
  hint: string[];
}
export type VerbQuestion = VerbQuestionBase & (
  | { type: 'verb_form_text'; acceptedAnswers: string[] }
  | { type: 'verb_form_choice'; choices: { id: string; text: string }[]; correctChoiceId: string }
);
export interface VerbBlock { id: string; title: string; description: string; itemIds: string[]; questionIds: string[] }
export interface ContentPackV2 {
  schemaVersion: 2;
  packId: string;
  packVersion: number;
  title: string;
  items: VerbForm[];
  questions: VerbQuestion[];
  blocks: VerbBlock[];
}
export const templateLabels: Record<VerbTemplate, string> = {
  'past-recall': 'Präteritum recall', 'participle-recall': 'Partizip II recall', 'auxiliary-choice': 'Auxiliary choice',
  'infinitive-recall': 'Identify infinitive', 'present-recall': 'Präsens stem / form', 'sentence-completion': 'Sentence form completion', 'sequence-choice': 'Principal-form sequence',
};
export function principalSequence(item: VerbForm): string {
  const form = item.properties;
  return `${form.infinitive} · ${form.praeteritum} · ${form.participle}`;
}
