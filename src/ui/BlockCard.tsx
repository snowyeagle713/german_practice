import { entriesForBlock } from '../domain/content/selectors';
import type { Block, ContentPack } from '../domain/content/types';

export function BlockCard({ pack, block }: { pack: ContentPack; block: Block }) {
  return <article className="block-card" aria-labelledby={`title-${block.id}`}>
    <div><p className="eyebrow">Verb constructions</p><h2 id={`title-${block.id}`}>{block.title}</h2><p>{block.description}</p>
      <p className="block-counts"><span>{entriesForBlock(pack, block).length} constructions</span><span>{block.questionIds.length} authored questions</span></p>
      <p className="muted">No practice result yet.</p>
    </div>
    <div className="card-actions"><a className="button" href={`#/learn/${encodeURIComponent(block.id)}`}>Learn</a><button disabled aria-describedby={`practice-${block.id}`}>Start full block</button><small id={`practice-${block.id}`}>Practice is not available yet.</small></div>
  </article>;
}
