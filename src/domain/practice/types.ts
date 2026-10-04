import type { ContentPack } from '../content/types';

export type Response = { kind: 'text'; value: string } | { kind: 'choice'; choiceId: string };
export interface Attempt {
  attemptId: string;
  sessionId: string;
  questionId: string;
  questionRevision: number;
  entryId: string;
  submittedAt: string;
  response: Response;
  isCorrect: boolean;
  hintUsed: boolean;
  revealed: boolean;
  isUnaidedCorrect: boolean;
}
export interface Feedback {
  attemptId: string;
  correctAnswer: string;
  explanation: string;
  exampleDe: string;
  exampleEn: string;
  meaningEn: string;
}
export interface PracticeSession {
  sessionId: string;
  mode: 'full';
  blockId: string;
  packId: string;
  packVersion: number;
  startedAt: string;
  completedAt: string | null;
  status: 'answering' | 'feedback' | 'completed' | 'abandoned';
  order: string[];
  choiceOrders: Record<string, string[]>;
  currentIndex: number;
  response: Response | null;
  hintUsed: boolean;
  revealed: boolean;
  guidance: string | null;
  feedback: Feedback | null;
  contentSnapshot: ContentPack;
  attempts: Attempt[];
  submittedAttemptIds: string[];
}
export interface PracticeDependencies {
  random: () => number;
  now: () => string;
  id: () => string;
}
export type PracticeCommand =
  | { type: 'response'; questionId: string; response: Response }
  | { type: 'hint' | 'reveal'; questionId: string }
  | { type: 'submit'; questionId: string; attemptId: string; submittedAt: string }
  | { type: 'next'; questionId: string; at: string };
