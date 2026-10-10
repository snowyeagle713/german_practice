import { useEffect, useRef } from 'react';
import { isVerbForm, itemLabel, type Block, type LearningItem } from '../domain/content/types';
import { VerbFormsDetails } from './VerbFormsDetails';
import { constructionTheme, constructionThemes } from '../domain/content/themes';
import { Icon } from './Icon';

export function Learn({ block, entries, index, onStart, sessionSize }: { block: Block; entries: LearningItem[]; index: number; onStart: () => void; sessionSize: 10 | 20 }) {
  const list = useRef<HTMLElement>(null);
  useEffect(() => {
    // Scroll only the study guide, never the document or the keyboard focus.
    const container = list.current;
    if (!container) return;
    const showSelected = () => {
      const selected = container.querySelector<HTMLElement>('[aria-current="page"]');
      if (!selected) return;
      const bounds = container.getBoundingClientRect(), item = selected.getBoundingClientRect();
      if (item.top < bounds.top + 8) container.scrollTop -= bounds.top + 8 - item.top;
      else if (item.bottom > bounds.bottom - 8) container.scrollTop += item.bottom - bounds.bottom + 8;
    };
    showSelected();
    const observer = new ResizeObserver(showSelected);
    observer.observe(container);
    return () => observer.disconnect();
  }, [index]);
  const entry = entries[index];
  if (!entry) return null;
  const forms = isVerbForm(entry);
  const unit = forms ? 'Verb' : 'Construction';
  const groups = forms ? [...new Set(entries.filter(isVerbForm).map(item => item.alphabeticalGroup))].map(letter => ({ title: letter, entryIds: entries.filter(isVerbForm).filter(item => item.alphabeticalGroup === letter).map(item => item.id) })) : constructionThemes;
  const href = (item: LearningItem) => `#/learn/${encodeURIComponent(block.id)}/${encodeURIComponent(item.id)}`;
  return <>
    <div className="learn-top"><a href="#/blocks">← All blocks</a><div className="study-position"><span>{block.title} · {unit} {index + 1} of {entries.length}</span><progress value={index + 1} max={entries.length} aria-label="Position in study material" /><small>Study position · not a completion score</small></div></div>
    <p className="lead">{forms ? 'Recall the principal parts, then read the example. Alphabetical study is ungraded.' : 'Read the rule, then compare the everyday and technical examples. This is ungraded study.'}</p>
    <div className="learn-layout">
      <label className="construction-picker">{unit}<select value={entry.id} onChange={event => { window.location.hash = href(entries.find(item => item.id === event.target.value)!); }}>{entries.map((item, position) => <option key={item.id} value={item.id}>{position + 1}. {itemLabel(item)}</option>)}</select></label>
      <nav ref={list} className="construction-list" aria-label={forms ? "Verbs in this block" : "Constructions in this block"}><p className="eyebrow">Study guide</p><h2>{forms ? "Verbs A–Z" : "Constructions"}</h2>{groups.map(theme => <section key={theme.title}><h3>{theme.title}</h3><ol>{entries.filter(item => theme.entryIds.includes(item.id)).map(item => <li key={item.id}><a href={href(item)} lang="de" aria-current={item.id === entry.id ? 'page' : undefined}><span className="lesson-number" aria-hidden="true">{String(entries.indexOf(item) + 1).padStart(2, '0')}</span><span>{itemLabel(item)}</span></a></li>)}</ol></section>)}</nav>
      <article className="learn-card" aria-labelledby="construction-title">
        <div className="lesson-heading"><p className="eyebrow">{unit} {index + 1} / {entries.length}</p><span className="badge">Ungraded study</span></div>
        <h2 id="construction-title" lang="de">{itemLabel(entry)}</h2><p className="badge">{forms ? "Verb Forms · Alphabetical" : constructionTheme(entry.id)}</p><p className="meaning">{entry.meaningEn}</p>
        {isVerbForm(entry) ? <VerbFormsDetails item={entry} /> : <dl className="rule"><div><dt>Preposition</dt><dd lang="de">{entry.preposition}</dd></div><div><dt>Governed case</dt><dd>{entry.governedCase}</dd></div>{entry.reflexiveCase && <div><dt>Reflexive pronoun case</dt><dd>{entry.reflexiveCase}</dd></div>}</dl>}
        <div className="examples">{entry.examples.map(example => <section className={`example-panel ${example.domain}`} key={example.id} aria-labelledby={`example-${example.id}`}><h3 id={`example-${example.id}`}><Icon name={example.domain === 'everyday' ? 'leaf' : 'blocks'} />{example.domain === 'everyday' ? 'Everyday' : 'Technical'} example</h3><p className="sentence" lang="de">{example.de}</p><p className="translation">{example.en}</p></section>)}</div>
        <div className="learn-card-footer"><div className="learn-controls">
          {entries[index - 1] ? <a className="button secondary" href={href(entries[index - 1]!)}>← Previous</a> : <button disabled>← Previous</button>}
          <span>{index + 1} of {entries.length}</span>
          {entries[index + 1] ? <a className="button secondary" href={href(entries[index + 1]!)}>Next →</a> : <button disabled>Next →</button>}
        </div>
        <div className="practice-notice"><button onClick={onStart} aria-describedby="learn-practice-note">Start practice</button><small id="learn-practice-note">Practise a {sessionSize}-question session. Your run saves automatically on this device.</small></div></div>
      </article>
    </div>
  </>;
}
