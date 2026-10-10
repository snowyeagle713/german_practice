import { constructionTheme } from '../domain/content/themes';
import type { RevisionItem } from '../domain/practice/revision';
export function Revision({ items, onStart }: { items: RevisionItem[]; onStart: (items: RevisionItem[]) => void }) {
  const themes = [...new Set(items.map(item => constructionTheme(item.entry.id)))];
  return <section className="empty-state" aria-label="Revision queue"><h2>Awaiting revision ({items.length})</h2><p>Wrong and assisted answers remain here until an unaided correct answer in a revision run. Your original scores remain unchanged.</p>
    {items.length ? <><button onClick={() => onStart(items)}>Start revision</button><p>Up to 20 questions per run; remaining items stay pending. Historic questions use their saved content.</p>
      {themes.map(theme => { const group = items.filter(item => constructionTheme(item.entry.id) === theme); return <section key={theme}><h3>{theme}</h3><button className="quiet-button" onClick={() => onStart(group)}>Revise {theme}</button><ul className="review-list">{[...new Set(group.map(item => item.entry.id))].map(id => { const entries = group.filter(item => item.entry.id === id); return <li className="revision-row" key={id}><span className="revision-construction" lang="de">{entries[0]!.entry.construction}</span><span className="badge revision-pending">{entries.length} pending</span><button className="quiet-button" onClick={() => onStart(entries)}>Revise construction</button></li>; })}</ul></section>; })}
    </> : <p>No items awaiting revision. Start practice to collect learning evidence.</p>}
  </section>;
}
