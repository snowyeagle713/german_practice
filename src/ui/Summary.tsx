import { correctAnswer, responseText } from '../domain/practice/grading';
import { summarize } from '../domain/practice/summary';
import type { PracticeSession } from '../domain/practice/types';

export function Summary({ session, onRepeat }: { session: PracticeSession; onRepeat: () => void }) {
  const result = summarize(session);
  return <section aria-label="Session summary">
    <div className="welcome-panel"><div><p className="eyebrow">Full block complete</p><h2>{result.answered} of {result.total} questions answered</h2><p className="lead">Every authored question was covered once. This score describes this run, not language mastery or exam readiness.</p></div><div className="summary-score"><strong>{Math.round((result.accuracy ?? 0) * 100)}%</strong><span>Unaided correct</span></div></div>
    <div className="overview summary-counts"><div className="stat-card"><div><strong>{result.correct}</strong><span>Total correct answers</span></div></div><div className="stat-card"><div><strong>{result.wrong}</strong><span>Total wrong answers</span></div></div><div className="stat-card"><div><strong>{result.assisted}</strong><span>Assisted answers</span></div></div></div>
    <p className="lead">First-pass score: {result.unaidedCorrect} unaided correct / {result.total}. Assisted answers may be correct or wrong and are excluded from this score.</p>
    <section className="empty-state"><h2>By question type</h2><ul className="type-breakdown">{result.byType.map(item => <li key={item.type}><span>{item.type === 'preposition_cloze' ? 'Typed prepositions' : item.type === 'case_choice' ? 'Case choice' : 'Meaning choice'}</span><strong>{item.unaidedCorrect} / {item.total} unaided correct</strong></li>)}</ul></section>
    <section className="empty-state"><h2>Questions to revisit ({result.mistakes.length})</h2><p>Wrong and assisted questions from this run. Revision sessions and saved history are not available yet.</p>
      {result.mistakes.length === 0 ? <p>All questions were answered correctly without assistance. You can still repeat the full block.</p> : <ul className="review-list">{session.attempts.filter(attempt => !attempt.isUnaidedCorrect).map(attempt => {
        const question = session.contentSnapshot.questions.find(item => item.id === attempt.questionId)!;
        const entry = session.contentSnapshot.entries.find(item => item.id === attempt.entryId)!;
        return <li key={attempt.attemptId}><details><summary><span lang="de">{entry.construction}</span><span>{attempt.hintUsed || attempt.revealed ? 'Assisted' : 'Wrong'}{attempt.hintUsed || attempt.revealed ? ` · ${attempt.isCorrect ? 'correct answer' : 'wrong answer'}` : ''}</span></summary><p>{question.prompt}</p><p>Your answer: {responseText(question, attempt.response)}</p><p>Correct answer: {correctAnswer(question)}</p><p>{question.explanation}</p></details></li>;
      })}</ul>}
    </section>
    <p className="session-notice">This summary is not saved. Reloading, closing this page, or starting another run discards it.</p>
    <div className="summary-actions"><button onClick={onRepeat}>Repeat full block</button><a className="button secondary" href="#/blocks">Back to blocks</a></div>
  </section>;
}
