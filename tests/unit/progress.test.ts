import { isTextQuestion } from '../../src/domain/content/types';
import { expect, it } from 'vitest';
import seed from '../../content/seed-pack.json';
import { validateContent } from '../../src/domain/content/validate';
import { createSession, currentQuestion, transition } from '../../src/domain/practice/session';
import { progressMetrics } from '../../src/domain/progress/metrics';
const pack = validateContent(seed); const at = '2026-10-10T12:00:00.000Z';
it('empty progress is zero evidence, with semantic theme groups and unchanged authored pool', () => {
 const result = progressMetrics(pack, []);
 expect(result.completed).toEqual([]); expect(result.blocks[0]).toMatchObject({ total: 40, answered: 0, unaided: 0 });
 expect(result.themes).toHaveLength(4); expect(result.constructions).toHaveLength(10);
});
it('only completed current-question practice contributes coverage; revision preserves first-pass metrics', () => {
 let session = createSession(pack, pack.blocks[0]!.id, { random: () => .99, now: () => at, id: () => 'metrics' }, { size: 10 });
 for(let i=0;i<10;i++) {
  const q = currentQuestion(session); const response = isTextQuestion(q) ? {kind:'text' as const,value:q.acceptedAnswers[0]!} : {kind:'choice' as const,choiceId:q.correctChoiceId};
  session=transition(session,{type:'response',questionId:q.id,response});
  session=transition(session,{type:'submit',questionId:q.id,attemptId:`m${i}`,submittedAt:at});
  if(i===9) expect(progressMetrics(pack,[session]).blocks[0]!.answered).toBe(0);
  session=transition(session,{type:'next',questionId:q.id,at});
 }
 expect(progressMetrics(pack,[session]).blocks[0]).toMatchObject({answered:10,unaided:10});
 expect(progressMetrics(pack,[{...session,mode:'revision'}]).blocks[0]!.answered).toBe(0);
});
