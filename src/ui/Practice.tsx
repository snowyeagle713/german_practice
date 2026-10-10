import { useEffect, useRef, useState } from 'react';
import { questionHint } from '../domain/practice/hints';
import { correctAnswer } from '../domain/practice/grading';
import { currentQuestion } from '../domain/practice/session';
import type { PracticeCommand, PracticeSession } from '../domain/practice/types';

export function Practice({ session, send, onAbandon, blocked }: { session: PracticeSession; send: (command: PracticeCommand) => void; onAbandon: () => void; blocked: boolean }) {
  const question = currentQuestion(session);
  const entry = session.contentSnapshot.entries.find(item => item.id === question.entryId)!;
  const [draft, setDraft] = useState(session.response);
  useEffect(() => { setDraft(session.response); }, [question.id, session.feedback?.attemptId]);
  const feedback = session.feedback;
  const attempt = session.attempts.find(item => item.questionId === question.id);
  const input = useRef<HTMLInputElement>(null);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const graded = session.status === 'feedback';
  useEffect(() => {
    if (graded) nextButton.current?.focus();
    else if (input.current) input.current.focus();
    else questionHeading.current?.focus();
  }, [question.id, graded]);
  const sendForQuestion = (type: 'hint' | 'reveal') => send({ type, questionId: question.id });
  const next = () => send({ type: 'next', questionId: question.id, at: new Date().toISOString() });
  const status = attempt?.hintUsed || attempt?.revealed ? `Assisted · ${attempt.isCorrect ? 'correct answer' : 'wrong answer'}` : attempt?.isCorrect ? 'Correct' : 'Wrong';
  return <section className="practice-layout" aria-label="Practice session">
    <div className="practice-toolbar"><span className="badge">{session.mode === 'quick' ? 'Quick Practice' : session.mode === 'revision' ? 'Revision' : 'Standard Practice'}</span><strong>Question {session.currentIndex + 1} of {session.order.length}</strong><span>{session.attempts.length} answers checked</span></div>
    <progress value={session.attempts.length} max={session.order.length} aria-label="Questions answered" />
    <div className="practice-controls">
    <div className="summary-actions practice-navigation"><button className="quiet-button" disabled={blocked || session.currentIndex === 0} onClick={() => send({ type: 'previous', questionId: question.id, at: new Date().toISOString() })}>Previous question</button>{!graded && <button className="quiet-button" disabled={blocked} onClick={() => send({ type: 'skip', questionId: question.id, at: new Date().toISOString() })}>Skip for now</button>}<span>{session.deferredIds.length} deferred questions</span></div>
    <details className="session-end"><summary>End this run</summary><p>Abandon this unfinished run? Saved answers remain in history and revision, but this run will have no final score.</p><button className="quiet-button" disabled={blocked} onClick={onAbandon}>Abandon run</button></details>
    </div>
    <article className="practice-card">
      <p className="eyebrow">{question.type === 'preposition_cloze' ? 'Type the missing preposition' : question.type === 'case_choice' ? 'Choose the governed case' : 'Choose the meaning'}</p>
      <h2 id="question-prompt" ref={questionHeading} tabIndex={-1}>{question.prompt}</h2>
      <form className={graded ? 'practice-form graded' : 'practice-form'} onKeyDown={event => { if (event.key === 'Enter' && event.repeat) event.preventDefault(); }} onSubmit={event => {
        event.preventDefault();
        if (graded) { next(); return; }
        send({ type: 'submit', questionId: question.id, attemptId: crypto.randomUUID(), submittedAt: new Date().toISOString() });
      }}>
        {question.type === 'preposition_cloze' ? <div className="answer-field"><label htmlFor="preposition-answer">Your preposition</label>
          <input id="preposition-answer" ref={input} type="text" maxLength={10000} lang="de" autoComplete="off" autoCapitalize="none" spellCheck={false} readOnly={graded || blocked}
            value={draft?.kind === 'text' ? draft.value : ''} aria-describedby={session.guidance ? 'answer-guidance' : undefined}
            onChange={event => { const response = { kind: 'text' as const, value: event.target.value }; setDraft(response); send({ type: 'response', questionId: question.id, response }); }} />
        </div> : <fieldset className="answer-choices" disabled={graded || blocked}><legend>Your answer</legend>
          {session.choiceOrders[question.id]!.map(id => {
            const choice = question.choices.find(item => item.id === id)!;
            return <label className="answer-choice" key={id}><input type="radio" name="answer" value={id}
              checked={draft?.kind === 'choice' && draft.choiceId === id}
              onChange={() => { const response = { kind: 'choice' as const, choiceId: id }; setDraft(response); send({ type: 'response', questionId: question.id, response }); }} /><span>{choice.text}</span></label>;
          })}
        </fieldset>}
        {session.guidance && <p id="answer-guidance" role="alert" className="answer-guidance">{session.guidance}</p>}
        {!graded && <>
          <div className="assistance-actions"><button type="button" className="quiet-button" onClick={() => sendForQuestion('hint')} disabled={blocked || session.hintUsed}>Hint</button><button type="button" className="quiet-button" onClick={() => sendForQuestion('reveal')} disabled={blocked || session.revealed}>Reveal answer</button><small>Hint or reveal excludes this answer from the unaided score.</small></div>
          {session.hintUsed && <div className="assistance-note" role="status"><strong>Hint used</strong>{questionHint(question, entry).map(line => <p key={line}>{line}</p>)}</div>}
          {session.revealed && <div className="assistance-note" role="status"><strong>Answer revealed</strong><p>{correctAnswer(question)}</p><small>Enter or select your answer, then check it. It will count as assisted.</small></div>}
          <div className="submit-area"><button type="submit" disabled={blocked}>Check answer</button><small>Press Enter to check; press it again after feedback to continue.</small></div>
        </>}
        {graded && feedback && attempt && <div className="practice-result">
          <section className={`answer-feedback ${attempt.hintUsed || attempt.revealed ? 'assisted' : attempt.isCorrect ? 'correct' : 'wrong'}`} aria-labelledby="feedback-title">
            <h3 id="feedback-title" role="status">{status}</h3>
            <p><strong>Correct answer:</strong> {feedback.correctAnswer}</p><p>{feedback.explanation}</p>
            <p lang="de" className="sentence">{feedback.exampleDe}</p><p className="translation">{feedback.exampleEn}</p><p className="translation">Construction meaning: {feedback.meaningEn}</p>
            {attempt.hintUsed || attempt.revealed ? <p className="assistance-label">{attempt.hintUsed ? 'Hint used. ' : ''}{attempt.revealed ? 'Answer revealed. ' : ''}Excluded from unaided correct.</p> : null}
          </section>
          <div className="next-area"><button ref={nextButton} type="button" disabled={blocked} onClick={event => { if (event.detail <= 1) next(); }}>{session.attempts.length === session.order.length && session.currentIndex === session.order.length - 1 ? 'View summary' : 'Next question'}</button></div>
        </div>}
      </form>
      <p className="session-notice">Your run saves automatically on this device. Reload to resume the same question, answer and feedback.</p>
    </article>
  </section>;
}
