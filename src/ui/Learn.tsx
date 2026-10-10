import { useEffect, useRef } from 'react';
import type { Block, Entry } from '../domain/content/types';
import { constructionTheme, constructionThemes } from '../domain/content/themes';
import { Icon } from './Icon';

export function Learn({ block, entries, index, onStart, sessionSize }: { block: Block; entries: Entry[]; index: number; onStart: () => void; sessionSize: 10 | 20 }) {
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
  const href = (item: Entry) => `#/learn/${encodeURIComponent(block.id)}/${encodeURIComponent(item.id)}`;
  return <>
    <div className="learn-top"><a href="#/blocks">← All blocks</a><div className="study-position"><span>{block.title} · Construction {index + 1} of {entries.length}</span><progress value={index + 1} max={entries.length} aria-label="Position in study material" /><small>Study position · not a completion score</small></div></div>
    <p className="lead">Read the rule, then compare the everyday and technical examples. This is ungraded study.</p>
    <div className="learn-layout">
      <nav ref={list} className="construction-list" aria-label="Constructions in this block"><p className="eyebrow">Study guide</p><h2>Constructions</h2>{constructionThemes.map(theme => <section key={theme.title}><h3>{theme.title}</h3><ol>{entries.filter(item => theme.entryIds.includes(item.id)).map(item => <li key={item.id}><a href={href(item)} lang="de" aria-current={item.id === entry.id ? 'page' : undefined}><span className="lesson-number" aria-hidden="true">{String(entries.indexOf(item) + 1).padStart(2, '0')}</span><span>{item.construction}</span></a></li>)}</ol></section>)}</nav>
      <article className="learn-card" aria-labelledby="construction-title">
        <div className="lesson-heading"><p className="eyebrow">Construction {index + 1} / {entries.length}</p><span className="badge">Ungraded study</span></div>
        <h2 id="construction-title" lang="de">{entry.construction}</h2><p className="badge">{constructionTheme(entry.id)}</p><p className="meaning">{entry.meaningEn}</p>
        <dl className="rule"><div><dt>Preposition</dt><dd lang="de">{entry.preposition}</dd></div><div><dt>Governed case</dt><dd>{entry.governedCase}</dd></div>{entry.reflexiveCase && <div><dt>Reflexive pronoun case</dt><dd>{entry.reflexiveCase}</dd></div>}</dl>
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
