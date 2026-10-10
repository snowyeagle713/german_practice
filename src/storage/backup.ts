import { themeIds } from '../domain/palettes';
import Ajv2020 from 'ajv/dist/2020.js';
import { validateAnyContent } from '../domain/content/catalog';
import { isTextQuestion, itemsForPack, questionItemId } from '../domain/content/types';
import { correctAnswer, gradeAnswer } from '../domain/practice/grading';
import { isActive } from '../domain/practice/session';
import type { Attempt, PracticeSession, QuestionState } from '../domain/practice/types';
import type { LocalData, Settings } from './types';
export const MAX_BACKUP_BYTES = 10 * 1024 * 1024;
export interface Backup {
  schemaVersion: 1 | 2; appId: 'german-trainer'; exportedAt: string;
  contentVersions: { packId: string; packVersion: number }[];
  settings: Settings; cursors: Record<string, number>; currentId: string | null;
  sessions: PracticeSession[]; attempts: Attempt[];
}
const string = { type: 'string', maxLength: 10000 };
const id = { type: 'string', pattern: '^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,159}$' };
const bool = { type: 'boolean' };
const integer = { type: 'integer', minimum: 0, maximum: Number.MAX_SAFE_INTEGER };
const date = { type: 'string', format: 'iso-date' };
const nullable = (schema: object) => ({ anyOf: [schema, { type: 'null' }] });
const object = (properties: Record<string, object>) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const array = (items: object, uniqueItems = false) => ({ type: 'array', items, uniqueItems });
const response = { oneOf: [object({ kind: { const: 'text' }, value: string }), object({ kind: { const: 'choice' }, choiceId: id })] };
const feedback = object({ attemptId: id, correctAnswer: string, explanation: string, exampleDe: string, exampleEn: string, meaningEn: string });
const state = { response: nullable(response), hintUsed: bool, revealed: bool, guidance: nullable(string), feedback: nullable(feedback) };
const attempt = object({ attemptId: id, sessionId: id, questionId: id, questionRevision: { type: 'integer', minimum: 1 }, entryId: id, submittedAt: date, response, isCorrect: bool, hintUsed: bool, revealed: bool, isUnaidedCorrect: bool });
const session = object({ sessionId: id, mode: { enum: ['quick', 'standard', 'revision'] }, sessionSize: { type: 'integer', minimum: 1, maximum: 20 }, rotationNext: integer,
  deferredIds: array(id, true), states: { type: 'object', propertyNames: id, additionalProperties: object(state) },
  blockId: id, packId: id, packVersion: { type: 'integer', minimum: 1 }, startedAt: date, completedAt: nullable(date),
  status: { enum: ['answering', 'feedback', 'completed', 'abandoned'] }, order: { ...array(id, true), minItems: 1, maxItems: 20 },
  choiceOrders: { type: 'object', propertyNames: id, additionalProperties: array(id, true) }, currentIndex: integer, ...state,
  contentSnapshot: { type: 'object' }, attempts: array(attempt), submittedAttemptIds: array(id, true) });
// Optional only for new v2 snapshots; original v1 session objects remain byte-compatible.
Object.assign(session.properties, { snapshotVersion: { const: 2 } });
const ajv = new Ajv2020({ allErrors: true, strict: true });
ajv.addFormat('iso-date', value => { try { return new Date(value).toISOString() === value; } catch { return false; } });
const shape = ajv.compile<Backup>(object({ schemaVersion: { enum: [1, 2] }, appId: { const: 'german-trainer' }, exportedAt: date,
  contentVersions: array(object({ packId: id, packVersion: { type: 'integer', minimum: 1 } }), true),
  settings: object({ theme: { enum: [...themeIds] }, sessionSize: { enum: [10, 20] } }),
  cursors: { type: 'object', propertyNames: id, additionalProperties: integer }, currentId: nullable(id), sessions: array(session), attempts: array(attempt) }));
function requireValid(condition: boolean, message: string): asserts condition { if (!condition) throw new Error(`Backup invalid: ${message}`); }
function same(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  const aKeys = Object.keys(a), bKeys = Object.keys(b);
  return aKeys.length === bKeys.length && aKeys.every(key => Object.hasOwn(b, key) && same((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]));
}
function membership(a: string[], b: string[]) { return a.length === b.length && a.every(id => b.includes(id)); }
function validateSession(value: PracticeSession) {
  const pack = validateAnyContent(value.contentSnapshot);
  requireValid(pack.schemaVersion === 2 ? value.snapshotVersion === 2 : value.snapshotVersion === undefined, 'snapshot envelope version');
  requireValid(pack.packId === value.packId && pack.packVersion === value.packVersion, 'snapshot pack identity');
  requireValid(pack.blocks.length === 1 && pack.blocks[0]!.id === value.blockId && membership(pack.blocks[0]!.questionIds, value.order), 'snapshot block membership');
  requireValid(value.currentIndex < value.order.length && value.sessionSize === value.order.length, 'position or session size');
  requireValid(value.mode === 'revision' || value.order.length === (value.mode === 'quick' ? 10 : 20), 'mode length');
  const choiceIds = pack.questions.filter(question => !isTextQuestion(question)).map(question => question.id);
  requireValid(membership(Object.keys(value.choiceOrders), choiceIds), 'choice order keys');
  for (const question of pack.questions) if (!isTextQuestion(question)) requireValid(membership(value.choiceOrders[question.id]!, question.choices.map(choice => choice.id)), 'choice order membership');
  requireValid(new Set(value.attempts.map(item => item.questionId)).size === value.attempts.length, 'duplicate first answer');
  requireValid(same(value.submittedAttemptIds, value.attempts.map(item => item.attemptId)), 'submitted answer IDs');
  for (const item of value.attempts) {
    const question = pack.questions.find(question => question.id === item.questionId);
    requireValid(Boolean(question), 'answer question reference'); if (!question) throw new Error('Missing question');
    requireValid(item.sessionId === value.sessionId && item.entryId === questionItemId(question) && item.questionRevision === question.revision, 'answer identity');
    requireValid(gradeAnswer(question, item.response) === item.isCorrect && item.isUnaidedCorrect === (item.isCorrect && !item.hintUsed && !item.revealed), 'answer grading evidence');
    requireValid(item.submittedAt >= value.startedAt && (!value.completedAt || item.submittedAt <= value.completedAt), 'answer timestamp');
  }
  const currentId = value.order[value.currentIndex]!;
  function checkState(qid: string, state: QuestionState, current = false) {
    const question = pack.questions.find(item => item.id === qid);
    requireValid(Boolean(question), 'draft question reference'); if (!question) return;
    if (state.response) {
      if (isTextQuestion(question)) requireValid(state.response.kind === 'text', 'draft response kind');
      else {
        const choiceId = state.response.kind === 'choice' ? state.response.choiceId : null;
        requireValid(question.choices.some(choice => choice.id === choiceId), 'draft choice reference');
      }
    }
    const item = value.attempts.find(item => item.questionId === qid);
    if (state.feedback) {
      requireValid(Boolean(item) && same(item?.response, state.response) && item?.hintUsed === state.hintUsed && item?.revealed === state.revealed, 'immutable feedback response');
      const entry = itemsForPack(pack).find(entry => entry.id === questionItemId(question))!;
      const example = entry.examples.find(example => example.id === question.exampleId) ?? entry.examples[0]!;
      requireValid(same(state.feedback, { attemptId: item!.attemptId, correctAnswer: correctAnswer(question), explanation: question.explanation, exampleDe: example.de, exampleEn: example.en, meaningEn: entry.meaningEn }), 'authored feedback');
      requireValid(state.guidance === null, 'graded guidance');
    } else requireValid(!item || (!current && qid === currentId), 'graded state missing feedback');
  }
  checkState(currentId, value, true);
  for (const [qid, state] of Object.entries(value.states)) checkState(qid, state);
  for (const item of value.attempts) if (item.questionId !== currentId) requireValid(Boolean(value.states[item.questionId]?.feedback), 'visited answer state missing');
  requireValid(value.deferredIds.every(qid => value.order.includes(qid) && !value.attempts.some(item => item.questionId === qid)), 'deferred question membership');
  if (value.status === 'completed') requireValid(value.attempts.length === value.order.length && value.deferredIds.length === 0 && value.completedAt !== null && value.completedAt >= value.startedAt && Boolean(value.feedback), 'completed session coverage');
  else requireValid(value.completedAt === null, 'incomplete completion timestamp');
  if (isActive(value)) requireValid((value.status === 'feedback') === Boolean(value.feedback), 'feedback lifecycle');
}
export function validateBackup(input: unknown): Backup {
  if (!shape(input)) throw new Error(`Backup schema invalid or unsupported: ${ajv.errorsText(shape.errors)}`);
  const value = input;
  requireValid(new Set(value.sessions.map(item => item.sessionId)).size === value.sessions.length, 'duplicate session ID');
  requireValid(new Set(value.attempts.map(item => item.attemptId)).size === value.attempts.length, 'duplicate answer ID');
  requireValid(value.sessions.filter(isActive).length <= 1, 'multiple active sessions');
  requireValid(value.currentId === null || value.sessions.some(item => item.sessionId === value.currentId), 'current session reference');
  requireValid(value.schemaVersion === 2 || value.sessions.every(session => session.contentSnapshot.schemaVersion === 1), 'v2 snapshots require backup version 2');
  value.sessions.forEach(validateSession);
  const embedded = value.sessions.flatMap(session => session.attempts);
  requireValid(embedded.length === value.attempts.length && embedded.every(item => same(item, value.attempts.find(attempt => attempt.attemptId === item.attemptId))), 'answer store references');
  const versions = [...new Map(value.sessions.map(session => [`${session.packId}:${session.packVersion}`, { packId: session.packId, packVersion: session.packVersion }])).values()];
  requireValid(versions.length === value.contentVersions.length && versions.every(version => value.contentVersions.some(item => same(version, item))), 'content version list');
  return value;
}
export function parseBackup(text: string): Backup {
  if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) throw new Error('Backup exceeds the 10 MiB limit.');
  let value: unknown; try { value = JSON.parse(text); } catch { throw new Error('This file is not valid JSON.'); }
  return validateBackup(value);
}
export function makeBackup(data: LocalData, exportedAt = new Date().toISOString()): Backup {
  const contentVersions = [...new Map(data.sessions.map(session => [`${session.packId}:${session.packVersion}`, { packId: session.packId, packVersion: session.packVersion }])).values()];
  return validateBackup({ schemaVersion: data.sessions.some(session => session.contentSnapshot.schemaVersion === 2) ? 2 : 1, appId: 'german-trainer', exportedAt, contentVersions, settings: data.settings, cursors: data.cursors, currentId: data.currentId, sessions: data.sessions, attempts: data.sessions.flatMap(session => session.attempts) });
}
export function backupData(backup: Backup): LocalData {
  return { revision: 0, settings: backup.settings, cursors: backup.cursors, currentId: backup.currentId, sessions: backup.sessions };
}
