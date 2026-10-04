import { useEffect, useRef } from 'react';
import { correctAnswer } from '../domain/practice/grading';
import { currentQuestion } from '../domain/practice/session';
import type { PracticeCommand, PracticeSession } from '../domain/practice/types';

export function Practice({ session, send }: { session: PracticeSession; send: (command: PracticeCommand) => void }) {
  const question = currentQuestion(session);
  const entry = session.contentSnapshot.entries.find(item => item.id === question.entryId)!;
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
  return <section className="practice-layout" aria-label="Full-block practice">
    <div className="practice-toolbar"><span className="badge">Full block</span><strong>Question {session.currentIndex + 1} of {session.order.length}</strong><span>{session.attempts.length} answers checked</span></div>
    <progress value={session.attempts.length} max={session.order.length} aria-label="Questions answered" />
    <p className="session-notice">This run is kept in memory only. Reloading or closing the page discards it. You can navigate within this app and return to this run.</p>
    <article className="practice-card">
      <p className="eyebrow">{question.type === 'preposition_cloze' ? 'Type the missing preposition' : question.type === 'case_choice' ? 'Choose the governed case' : 'Choose the meaning'}</p>
      <h2 id="question-prompt" ref={questionHeading} tabIndex={-1}>{question.prompt}</h2>
      <form onKeyDown={event => { if (event.key === 'Enter' && event.repeat) event.preventDefault(); }} onSubmit={event => {
        event.preventDefault();
        if (graded) { next(); return; }
        send({ type: 'submit', questionId: question.id, attemptId: crypto.randomUUID(), submittedAt: new Date().toISOString() });
      }}>
        {question.type === 'preposition_cloze' ? <div className="answer-field"><label htmlFor="preposition-answer">Your preposition</label>
          <input id="preposition-answer" ref={input} type="text" lang="de" autoComplete="off" autoCapitalize="none" spellCheck={false} readOnly={graded}
            value={session.response?.kind === 'text' ? session.response.value : ''} aria-describedby={session.guidance ? 'answer-guidance' : undefined}
            onChange={event => send({ type: 'response', questionId: question.id, response: { kind: 'text', value: event.target.value } })} />
        </div> : <fieldset className="answer-choices" disabled={graded}><legend>Your answer</legend>
          {session.choiceOrders[question.id]!.map(id => {
            const choice = question.choices.find(item => item.id === id)!;
            return <label className="answer-choice" key={id}><input type="radio" name="answer" value={id}
              checked={session.response?.kind === 'choice' && session.response.choiceId === id}
              onChange={() => send({ type: 'response', questionId: question.id, response: { kind: 'choice', choiceId: id } })} /><span>{choice.text}</span></label>;
          })}
        </fieldset>}
        {session.guidance && <p id="answer-guidance" role="alert" className="answer-guidance">{session.guidance}</p>}
        {!graded && <>
          <div className="assistance-actions"><button type="button" className="quiet-button" onClick={() => sendForQuestion('hint')} disabled={session.hintUsed}>Hint</button><button type="button" className="quiet-button" onClick={() => sendForQuestion('reveal')} disabled={session.revealed}>Reveal answer</button><small>Hint or reveal excludes this answer from the unaided score.</small></div>
          {session.hintUsed && <div className="assistance-note" role="status"><strong>Hint used</strong><p lang="de">{entry.construction} + {entry.governedCase}{entry.reflexiveCase ? ` · reflexive pronoun: ${entry.reflexiveCase}` : ''}</p><p>{entry.meaningEn}</p></div>}
          {session.revealed && <div className="assistance-note" role="status"><strong>Answer revealed</strong><p>{correctAnswer(question)}</p><small>Enter or select your answer, then check it. It will count as assisted.</small></div>}
          <div className="submit-area"><button type="submit">Check answer</button><small>Press Enter to check; press it again after feedback to continue.</small></div>
        </>}
        {graded && feedback && attempt && <>
          <section className={`answer-feedback ${attempt.hintUsed || attempt.revealed ? 'assisted' : attempt.isCorrect ? 'correct' : 'wrong'}`} aria-labelledby="feedback-title">
            <h3 id="feedback-title" role="status">{status}</h3>
            <p><strong>Correct answer:</strong> {feedback.correctAnswer}</p><p>{feedback.explanation}</p>
            <p lang="de" className="sentence">{feedback.exampleDe}</p><p className="translation">{feedback.exampleEn}</p><p className="translation">Construction meaning: {feedback.meaningEn}</p>
            {attempt.hintUsed || attempt.revealed ? <p className="assistance-label">{attempt.hintUsed ? 'Hint used. ' : ''}{attempt.revealed ? 'Answer revealed. ' : ''}Excluded from unaided correct.</p> : null}
          </section>
          <div className="next-area"><button ref={nextButton} type="button" onClick={event => { if (event.detail <= 1) next(); }}>{session.currentIndex === session.order.length - 1 ? 'View summary' : 'Next question'}</button></div>
        </>}
      </form>
    </article>
  </section>;
}
