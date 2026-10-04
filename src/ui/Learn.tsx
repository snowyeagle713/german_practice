import type { Block, Entry } from '../domain/content/types';
import { Icon } from './Icon';

export function Learn({ block, entries, index, onStart }: { block: Block; entries: Entry[]; index: number; onStart: () => void }) {
  const entry = entries[index];
  if (!entry) return null;
  const href = (item: Entry) => `#/learn/${encodeURIComponent(block.id)}/${encodeURIComponent(item.id)}`;
  return <>
    <div className="learn-top"><a href="#/blocks">← All blocks</a><div className="study-position"><span>{block.title} · Construction {index + 1} of {entries.length}</span><progress value={index + 1} max={entries.length} aria-label="Position in study material" /><small>Study position · not a completion score</small></div></div>
    <p className="lead">Read the rule, then compare the everyday and technical examples. This is ungraded study.</p>
    <div className="learn-layout">
      <nav className="construction-list" aria-label="Constructions in this block"><p className="eyebrow">Study guide</p><h2>Constructions</h2><ol>{entries.map((item, position) => <li key={item.id}><a href={href(item)} lang="de" aria-current={item.id === entry.id ? 'page' : undefined}><span className="lesson-number" aria-hidden="true">{String(position + 1).padStart(2, '0')}</span><span>{item.construction}</span></a></li>)}</ol></nav>
      <article className="learn-card" aria-labelledby="construction-title">
        <div className="lesson-heading"><p className="eyebrow">Construction {index + 1} / {entries.length}</p><span className="badge">Ungraded study</span></div>
        <h2 id="construction-title" lang="de">{entry.construction}</h2><p className="meaning">{entry.meaningEn}</p>
        <dl className="rule"><div><dt>Preposition</dt><dd lang="de">{entry.preposition}</dd></div><div><dt>Governed case</dt><dd>{entry.governedCase}</dd></div>{entry.reflexiveCase && <div><dt>Reflexive pronoun case</dt><dd>{entry.reflexiveCase}</dd></div>}</dl>
        <div className="examples">{entry.examples.map(example => <section className={`example-panel ${example.domain}`} key={example.id} aria-labelledby={`example-${example.id}`}><h3 id={`example-${example.id}`}><Icon name={example.domain === 'everyday' ? 'leaf' : 'blocks'} />{example.domain === 'everyday' ? 'Everyday' : 'Technical'} example</h3><p className="sentence" lang="de">{example.de}</p><p className="translation">{example.en}</p></section>)}</div>
        <div className="learn-controls">
          {entries[index - 1] ? <a className="button secondary" href={href(entries[index - 1]!)}>← Previous</a> : <button disabled>← Previous</button>}
          <span>{index + 1} of {entries.length}</span>
          {entries[index + 1] ? <a className="button secondary" href={href(entries[index + 1]!)}>Next →</a> : <button disabled>Next →</button>}
        </div>
        <div className="practice-notice"><button onClick={onStart} aria-describedby="learn-practice-note">Start practice</button><small id="learn-practice-note">Practise the entire {block.questionIds.length}-question block. This run will not be saved after reload.</small></div>
      </article>
    </div>
  </>;
}
