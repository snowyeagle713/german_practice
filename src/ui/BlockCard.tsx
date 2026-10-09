import { entriesForBlock } from '../domain/content/selectors';
import type { Block, ContentPack } from '../domain/content/types';
import { Icon } from './Icon';

export function BlockCard({ pack, block, onStart, sessionSize }: { pack: ContentPack; block: Block; onStart: () => void; sessionSize: 10 | 20 }) {
  return <article className="block-card" aria-labelledby={`title-${block.id}`}>
    <div className="block-content"><div className="block-card-top"><span className="icon-tile"><Icon name="book" /></span><span className="badge">Ready to study</span></div>
      <p className="eyebrow">Verb constructions</p><h2 id={`title-${block.id}`}>{block.title}</h2><p className="block-description">{block.description}</p>
      <p className="block-counts"><span>{entriesForBlock(pack, block).length} constructions</span><span>{block.questionIds.length} authored questions</span></p>
      <div className="block-study-note"><span className="note-dot" aria-hidden="true" /><p className="muted">Saved practice results are not available yet.</p></div>
    </div>
    <div className="card-actions"><a className="button secondary" href={`#/learn/${encodeURIComponent(block.id)}`}>Learn</a><button onClick={onStart} aria-describedby={`practice-${block.id}`}>Start practice</button><small id={`practice-${block.id}`}>{sessionSize} questions selected from the authored pool · run kept in memory only.</small></div>
  </article>;
}
