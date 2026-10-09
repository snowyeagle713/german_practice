import { useEffect, useRef, useState } from 'react';
import { loadContent } from '../content/load';
import { entriesForBlock } from '../domain/content/selectors';
import type { ContentPack } from '../domain/content/types';
import { BlockCard } from './BlockCard';
import { Learn } from './Learn';
import { Icon } from './Icon';
import { isActive } from '../domain/practice/session';
import { summarize } from '../domain/practice/summary';
import { useTrainer } from '../application/useTrainer';
import { Practice } from './Practice';
import { Summary } from './Summary';

type LoadState = { status: 'loading' } | { status: 'ready'; pack: ContentPack } | { status: 'error'; message: string };

function readRoute(): string[] {
  try { return window.location.hash.replace(/^#\/?/u, '').split('/').filter(Boolean).map(decodeURIComponent); }
  catch { return ['not-found']; }
}

export function App() {
  const [route, setRoute] = useState(readRoute);
  const [content, setContent] = useState<LoadState>({ status: 'loading' });
  const [retry, setRetry] = useState(0);
  const trainer = useTrainer();
  const { session } = trainer;
  const practiceSize = trainer.data.settings.sessionSize;
  const setPracticeSize = (sessionSize: 10 | 20) => trainer.settings({ ...trainer.data.settings, sessionSize });
  const [pendingBlock, setPendingBlock] = useState<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const routeKey = route.join('/');
  useEffect(() => {
    const update = () => setRoute(readRoute());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setContent({ status: 'loading' });
    void loadContent(controller.signal).then(pack => {
      if (!controller.signal.aborted) setContent({ status: 'ready', pack });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setContent({ status: 'error', message: error instanceof Error ? error.message : 'Unknown content error.' });
    });
    return () => controller.abort();
  }, [retry]);
  useEffect(() => {
    if (route[0] !== 'practice' || !isActive(session)) heading.current?.focus();
    document.title = `${heading.current?.textContent ?? 'German Trainer'} · German Trainer`;
  }, [routeKey, content.status, session?.status === 'completed']);

  const page = route[0] ?? 'home';
  const titles: Record<string, string> = { home: 'A little German, every day.', blocks: 'Your blocks', learn: 'Learn', practice: session?.status === 'completed' ? 'Session summary' : 'Practice', progress: 'Progress', settings: 'Settings' };
  const title = titles[page] ?? 'Page not found';
  const navPage = page === 'learn' || page === 'practice' ? 'blocks' : page;
  const runResult = session ? summarize(session) : null;

  function start(pack: ContentPack, blockId: string, replace = false) {
    if (isActive(session) && !replace) {
      setPendingBlock(blockId);
    } else {
      trainer.start(pack, blockId, replace);
      setPendingBlock(null);
    }
    window.location.hash = '/practice';
  }

  const sizeSelector = <fieldset className="session-options"><legend>Practice session</legend><label><input type="radio" name="practice-size" checked={practiceSize === 20} onChange={() => setPracticeSize(20)} /> Standard Practice · 20 questions</label><label><input type="radio" name="practice-size" checked={practiceSize === 10} onChange={() => setPracticeSize(10)} /> Quick Practice · 10 questions</label></fieldset>;
  function screen(pack: ContentPack) {
    if (page === 'home' && route.length <= 1) return <>
      <section className="welcome-panel" aria-label="Your learning space">
        <div><p className="eyebrow">Make room for learning</p><p className="welcome-title">Small steps. Useful German.</p>
        <p className="lead">Build familiarity with German verb constructions, from everyday conversations to technical work.</p></div>
        <div className="welcome-emblem" aria-hidden="true"><Icon name="book" /><span>Everyday<br />+ Technical</span></div>
      </section>
      <section className="overview" aria-label="Study overview">
        <div className="stat-card"><span className="icon-tile"><Icon name="blocks" /></span><div><strong>{pack.blocks.length}</strong><span>Available block</span></div></div>
        <div className="stat-card"><span className="icon-tile mint"><Icon name="book" /></span><div><strong>{pack.entries.length}</strong><span>Verb constructions</span></div></div>
        <div className="stat-card"><span className="icon-tile blue"><Icon name="leaf" /></span><div><strong>Ungraded</strong><span>Study at your own pace</span></div></div>
      </section>
      <div className="dashboard-grid"><section aria-labelledby="start-title"><div className="section-heading"><div><p className="eyebrow">Your learning path</p><h2 id="start-title">Start with the essentials</h2></div></div>
        {sizeSelector}{pack.blocks.map(block => <BlockCard key={block.id} pack={pack} block={block} sessionSize={practiceSize} onStart={() => start(pack, block.id)} />)}
        <a className="text-link" href="#/blocks">Browse blocks →</a>
      </section>
      <section className="progress-card" aria-labelledby="session-title"><div className="section-heading"><span className="icon-tile mint"><Icon name="progress" /></span><span className="badge neutral">Not saved</span></div>
        <p className="eyebrow">Your progress</p><h2 id="session-title">A place for your progress</h2>
        <div className="progress-empty" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /></div>
        <p>{session ? `${session.attempts.length} of ${session.order.length} answers checked in this page visit.` : 'Start a full block when you are ready. Learn remains ungraded.'}</p>
        <div className="progress-summary"><span>Practice results</span><strong>{runResult && session?.status === 'completed' ? `${runResult.unaidedCorrect} / ${runResult.total} unaided correct` : isActive(session) ? 'Run in progress' : 'Not recorded'}</strong></div>
        {session && <a className="button" href="#/practice">{isActive(session) ? 'Return to current run' : 'View session summary'}</a>}
        <p className="muted">Runs and results are kept in memory only until reload. Saved history is not available yet.</p>
      </section></div>
    </>;
    if (page === 'blocks' && route.length === 1) return <>
      <p className="lead">Study each construction with its rule, meaning, and two real-world examples.</p>
      {sizeSelector}{pack.blocks.map(block => <BlockCard key={block.id} pack={pack} block={block} sessionSize={practiceSize} onStart={() => start(pack, block.id)} />)}
    </>;
    if (page === 'learn' && route.length <= 3) {
      const block = pack.blocks.find(item => item.id === route[1]);
      if (block) {
        const entries = entriesForBlock(pack, block);
        const index = route[2] ? entries.findIndex(entry => entry.id === route[2]) : 0;
        if (index >= 0) return <Learn block={block} entries={entries} index={index} sessionSize={practiceSize} onStart={() => start(pack, block.id)} />;
      }
      return <div className="empty-state"><h2>Study page not found</h2><p>This block or construction is not in the current content pack.</p><a href="#/blocks">Return to blocks</a></div>;
    }
    if (page === 'practice' && route.length === 1) {
      if (pendingBlock && isActive(session)) return <section className="empty-state" aria-label="Existing active run"><h2>A run is already in progress</h2><p>Your current answers will remain until you explicitly abandon this run. Your run is saved locally and can be resumed after reload.</p><div className="summary-actions"><button onClick={() => setPendingBlock(null)}>Resume current run</button><button className="quiet-button" onClick={() => start(pack, pendingBlock, true)}>Abandon and start new run</button></div></section>;
      if (session?.status === 'completed') return <Summary session={session} onRepeat={() => start(pack, session.blockId)} />;
      if (isActive(session)) return <Practice session={session} send={trainer.send} />;
      return <section className="empty-state"><h2>No active practice session</h2><p>Start Quick or Standard Practice. Your run saves automatically on this device.</p><a href="#/blocks">Browse blocks</a></section>;
    }
    if (page === 'progress' && route.length === 1) return <div className="empty-state"><h2>No saved practice history yet</h2><p>Saved history is not available yet. Your current run and summary are kept in memory only until reload.</p>{session && <a href="#/practice">Return to current run or summary</a>}<a href="#/blocks">Explore the starter block</a></div>;
    if (page === 'settings' && route.length === 1) return <div className="empty-state"><h2>Practice preview</h2><p>You can study constructions and practise a full block. Backup, saved history, installation, and offline features are not available yet.</p><p>Keep the local server running to open or reload the app. Reload discards your current run.</p><a href="#/blocks">Browse blocks</a></div>;
    return <div className="empty-state"><p>This page could not be found.</p><a href="#/">Return home</a></div>;
  }

  return <>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to content</a>
    <div className="app-shell"><aside className="learning-sidebar" aria-label="Learning sidebar">
      <a className="brand" href="#/"><span className="brand-mark" aria-hidden="true"><Icon name="book" /></span><span>German Trainer<small>Fluency + Technical</small></span></a>
      <p className="sidebar-label">Your workspace</p>
      <nav aria-label="Main navigation">{(['home', 'blocks', 'progress', 'settings'] as const).map(item =>
        <a key={item} href={item === 'home' ? '#/' : `#/${item}`} aria-current={navPage === item ? 'page' : undefined}><Icon name={item} /><span>{item.charAt(0).toUpperCase() + item.slice(1)}</span></a>
      )}</nav>
      <div className="sidebar-note"><Icon name="leaf" /><p>A little, often.</p><small>Explore a construction.<br />Connect it to everyday life.</small></div>
      <div className="sidebar-foot"><span className="language-mark" lang="de">DE</span><span>German learning<small>Personal study space</small></span></div>
    </aside>
    <div className="workspace"><main id="main-content" tabIndex={-1} className="main-content">
      <div className="page-header"><div><p className="eyebrow">Your German learning space</p>
      <h1 ref={heading} tabIndex={-1}>{title}</h1></div><span className="badge"><span className="status-dot" aria-hidden="true" />Saved on this device</span></div>
      {content.status === 'loading' && <p role="status">Loading your study material…</p>}
      {content.status === 'error' && <section className="error-state" role="alert"><h2>Study material could not be opened</h2><p>The content must load and pass validation before you can study. Check that the app server is running; if validation fails, restore a valid content pack.</p><details><summary>Error details</summary><p>{content.message}</p></details><button onClick={() => setRetry(value => value + 1)}>Try again</button></section>}
      {trainer.error && <section role="alert" className="error-state"><h2>Local progress could not be saved</h2><p>{trainer.error}</p><p>Advancement is blocked until saving succeeds. Keep this page open to retry the failed action.</p><button onClick={trainer.retry}>Retry local save</button><button className="quiet-button" onClick={() => window.location.reload()}>Reload saved progress</button></section>}
      {!trainer.ready && <p role="status">Opening local progress…</p>}
      {trainer.busy && <p role="status">Saving locally…</p>}
      {content.status === 'ready' && trainer.ready && screen(content.pack)}
    </main>
    <footer>German Trainer · Learn is ungraded.</footer></div></div>
  </>;
}
