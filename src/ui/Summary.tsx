import { isVerbForm, itemsForPack } from '../domain/content/types';
import { revisionLabel } from '../domain/content/catalog';
import { correctAnswer, responseText } from '../domain/practice/grading';
import { summarize } from '../domain/practice/summary';
import type { PracticeSession } from '../domain/practice/types';

export function Summary({ session, onRepeat, canRepeat }: { session: PracticeSession; onRepeat: () => void; canRepeat: boolean }) {
  const result = summarize(session);
  return <section className="session-summary report-grid" aria-label="Session summary">
    <div className="welcome-panel"><div><p className="eyebrow">Session complete</p><h2>{result.answered} of {result.total} questions answered</h2><p className="lead">Every selected question was answered once. This score describes this run, not language mastery or exam readiness.</p></div><div className="summary-score"><strong>{Math.round((result.accuracy ?? 0) * 100)}%</strong><span>Unaided correct</span></div></div>
    <div className="overview summary-counts"><div className="stat-card"><div><strong>{result.correct}</strong><span>Total correct answers</span></div></div><div className="stat-card"><div><strong>{result.wrong}</strong><span>Total wrong answers</span></div></div><div className="stat-card"><div><strong>{result.assisted}</strong><span>Assisted answers</span></div></div></div>
    <p className="lead">First-pass score: {result.unaidedCorrect} unaided correct / {result.total}. Assisted answers may be correct or wrong and are excluded from this score.</p>
    <section className="empty-state"><h2>By question type</h2><ul className="type-breakdown">{result.byType.map(item => <li key={item.type}><span>{item.label}</span><strong>{item.unaidedCorrect} / {item.total} unaided correct</strong></li>)}</ul></section>
    <section className="empty-state"><h2>{session.contentSnapshot.schemaVersion === 2 ? 'By verb' : 'By construction'}</h2><ul className="type-breakdown">{result.byConstruction.map(item => <li key={item.entryId}><span lang="de">{item.construction}</span><strong>{item.unaidedCorrect} / {item.answered} unaided correct</strong></li>)}</ul></section>
    <section className="empty-state summary-revision"><h2>Questions to revisit ({result.mistakes.length})</h2><p>Wrong and assisted questions from this run. Open Progress to revise pending questions from your saved runs.</p>
      {result.mistakes.length === 0 ? <p>All questions were answered correctly without assistance. You can still repeat practice.</p> : <ul className="review-list">{session.attempts.filter(attempt => !attempt.isUnaidedCorrect).map(attempt => {
        const question = session.contentSnapshot.questions.find(item => item.id === attempt.questionId)!;
        const entry = itemsForPack(session.contentSnapshot).find(item => item.id === attempt.entryId)!;
        return <li key={attempt.attemptId}><details><summary><span lang="de">{isVerbForm(entry) ? revisionLabel(entry, question) : entry.construction}</span><span>{attempt.hintUsed || attempt.revealed ? 'Assisted' : 'Wrong'}{attempt.hintUsed || attempt.revealed ? ` · ${attempt.isCorrect ? 'correct answer' : 'wrong answer'}` : ''}</span></summary><p>{question.prompt}</p><p>Your answer: {responseText(question, attempt.response)}</p><p>Correct answer: {correctAnswer(question)}</p><p>{question.explanation}</p></details></li>;
      })}</ul>}
    </section>
    <p className="session-notice">This summary is saved on this device. Future revision never changes this original score.</p>
    {!canRepeat && <p>This block is archived. Its saved summary and pending revision remain available; new practice uses current blocks.</p>}
    <div className="summary-actions"><button onClick={onRepeat} disabled={!canRepeat}>Repeat practice</button><a className="button secondary" href="#/progress">Revision & progress</a><a className="button secondary" href="#/blocks">Back to blocks</a></div>
  </section>;
}
