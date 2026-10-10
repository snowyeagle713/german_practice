import { entriesForBlock } from '../domain/content/selectors';
import type { Block, AnyContentPack } from '../domain/content/types';
import { Icon } from './Icon';

export function BlockCard({ pack, block, onStart, sessionSize, progress }: { pack: AnyContentPack; block: Block; onStart: () => void; sessionSize: 10 | 20; progress: { answered: number; total: number; unaided: number; pending: number } }) {
  return <article className="block-card" aria-labelledby={`title-${block.id}`}>
    <div className="block-content"><div className="block-card-top"><span className="icon-tile"><Icon name="book" /></span><span className="badge">Ready to study</span></div>
      <p className="eyebrow">{pack.schemaVersion === 2 ? 'Verb Forms' : 'Verb constructions'}</p><h2 id={`title-${block.id}`}>{block.title}</h2><p className="block-description">{block.description}</p>
      <p className="block-counts"><span>{entriesForBlock(pack, block).length} {pack.schemaVersion === 2 ? 'verbs' : 'constructions'}</span><span>{block.questionIds.length} authored questions</span></p>
      <div className="block-study-note"><span className="note-dot" aria-hidden="true" /><p className="muted">{progress.answered} / {progress.total} questions covered · {progress.unaided} unaided correct · {progress.pending} pending revision</p></div>
    </div>
    <div className="card-actions"><a className="button secondary" href={`#/learn/${encodeURIComponent(block.id)}`}>Learn</a><button onClick={onStart} aria-describedby={`practice-${block.id}`}>Start practice</button><small id={`practice-${block.id}`}>{sessionSize} questions selected from the authored pool · saved automatically on this device.</small></div>
  </article>;
}
