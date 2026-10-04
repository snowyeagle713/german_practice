import type { Block, Entry } from '../domain/content/types';

export function Learn({ block, entries, index }: { block: Block; entries: Entry[]; index: number }) {
  const entry = entries[index];
  if (!entry) return null;
  const href = (item: Entry) => `#/learn/${encodeURIComponent(block.id)}/${encodeURIComponent(item.id)}`;
  return <>
    <div className="learn-top"><a href="#/blocks">← All blocks</a><span>{block.title} · Construction {index + 1} of {entries.length}</span></div>
    <p className="lead">Read the rule, then compare the everyday and technical examples. This is ungraded study.</p>
    <div className="learn-layout">
      <nav className="construction-list" aria-label="Constructions in this block"><h2>Constructions</h2><ol>{entries.map(item => <li key={item.id}><a href={href(item)} lang="de" aria-current={item.id === entry.id ? 'page' : undefined}>{item.construction}</a></li>)}</ol></nav>
      <article className="learn-card" aria-labelledby="construction-title">
        <p className="eyebrow">Construction {index + 1} / {entries.length}</p>
        <h2 id="construction-title" lang="de">{entry.construction}</h2><p className="meaning">{entry.meaningEn}</p>
        <dl className="rule"><div><dt>Preposition</dt><dd lang="de">{entry.preposition}</dd></div><div><dt>Governed case</dt><dd>{entry.governedCase}</dd></div>{entry.reflexiveCase && <div><dt>Reflexive pronoun case</dt><dd>{entry.reflexiveCase}</dd></div>}</dl>
        <div className="examples">{entry.examples.map(example => <section key={example.id} aria-labelledby={`example-${example.id}`}><h3 id={`example-${example.id}`}>{example.domain === 'everyday' ? 'Everyday' : 'Technical'} example</h3><p className="sentence" lang="de">{example.de}</p><p className="translation">{example.en}</p></section>)}</div>
        <div className="learn-controls">
          {entries[index - 1] ? <a className="button secondary" href={href(entries[index - 1]!)}>← Previous</a> : <button disabled>← Previous</button>}
          <span>{index + 1} of {entries.length}</span>
          {entries[index + 1] ? <a className="button secondary" href={href(entries[index + 1]!)}>Next →</a> : <button disabled>Next →</button>}
        </div>
        <div className="practice-notice"><button disabled aria-describedby="learn-practice-note">Start practice</button><small id="learn-practice-note">Practice is not available yet. Study any construction in any order.</small></div>
      </article>
    </div>
  </>;
}
