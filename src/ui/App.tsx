import { useEffect, useRef, useState } from 'react';
import { loadContent } from '../content/load';
import { entriesForBlock } from '../domain/content/selectors';
import type { ContentPack } from '../domain/content/types';
import { BlockCard } from './BlockCard';
import { Learn } from './Learn';
import { Icon } from './Icon';
import { isActive } from '../domain/practice/session';
import { useTrainer } from '../application/useTrainer';
import { Practice } from './Practice';
import { Summary } from './Summary';
import { Settings } from './Settings';
import { Backup } from './Backup';
import { usePwa } from '../pwa/usePwa';
import { Progress } from './Progress';
import { progressMetrics } from '../domain/progress/metrics';
import { revisionPlan, type RevisionItem } from '../domain/practice/revision';

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
  const updateSafe = trainer.canUpdate();
  const pwa = usePwa(trainer.canUpdate);
  useEffect(() => { if (trainer.ready) document.documentElement.dataset.theme = trainer.data.settings.theme; }, [trainer.ready, trainer.data.settings.theme]);
  const [practiceSize, showPracticeSize] = useState<10 | 20>(20);
  useEffect(() => { showPracticeSize(trainer.data.settings.sessionSize); }, [trainer.data.settings.sessionSize]);
  const setPracticeSize = (sessionSize: 10 | 20) => { showPracticeSize(sessionSize); trainer.settings({ ...trainer.data.settings, sessionSize }); };
  const [pendingRevision, setPendingRevision] = useState<RevisionItem[] | null>(null);
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


  function start(pack: ContentPack, blockId: string, replace = false) {
    setPendingRevision(null);
    if (trainer.data.sessions.some(isActive) && !replace) {
      setPendingBlock(blockId);
    } else {
      trainer.start(pack, blockId, replace);
      setPendingBlock(null);
    }
    window.location.hash = '/practice';
  }

  function startRevision(items: RevisionItem[], replace = false) {
    const plan = revisionPlan(items); if (!plan) return;
    if (trainer.data.sessions.some(isActive) && !replace) {
      setPendingRevision(items); setPendingBlock(plan.blockId);
    } else {
      trainer.start(plan.pack, plan.blockId, replace, plan.questionIds);
      setPendingRevision(null); setPendingBlock(null);
    }
    window.location.hash = '/practice';
  }

  const sizeSelector = <fieldset className="session-options"><legend>Practice session</legend><label><input type="radio" name="practice-size" checked={practiceSize === 20} onChange={() => setPracticeSize(20)} /> Standard Practice · 20 questions</label><label><input type="radio" name="practice-size" checked={practiceSize === 10} onChange={() => setPracticeSize(10)} /> Quick Practice · 10 questions</label></fieldset>;
  function screen(pack: ContentPack) {
    const metrics = progressMetrics(pack, trainer.data.sessions);
    const active = trainer.data.sessions.find(isActive);
    const view = (id: string) => { trainer.view(id); window.location.hash = '/practice'; };
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
        {sizeSelector}{pack.blocks.map(block => <BlockCard key={block.id} pack={pack} block={block} sessionSize={practiceSize} progress={metrics.blocks.find(item => item.blockId === block.id)!} onStart={() => start(pack, block.id)} />)}
        <a className="text-link" href="#/blocks">Browse blocks →</a>
      </section>
      <section className="progress-card" aria-labelledby="session-title"><div className="section-heading"><span className="icon-tile mint"><Icon name="progress" /></span><span className="badge neutral">On this device</span></div>
        <p className="eyebrow">Your progress</p><h2 id="session-title">Your learning record</h2>
        <div className="progress-summary"><span>Completed sessions</span><strong>{metrics.completed.length}</strong></div>
        <div className="progress-summary"><span>Awaiting revision</span><strong>{metrics.pending.length}</strong></div>
        <p>{metrics.completed.length ? 'Your saved runs and original scores are available in Progress.' : 'No completed sessions yet. Learn remains ungraded.'}</p>
        {active && <button onClick={() => view(active.sessionId)}>Return to current run</button>}
        <a className="button secondary" href="#/progress">View progress & history</a>
        <p className="muted">Progress stays on this device. Export a backup before clearing browser data.</p>
      </section></div>
    </>;
    if (page === 'blocks' && route.length === 1) return <>
      <p className="lead">Study each construction with its rule, meaning, and two real-world examples.</p>
      {sizeSelector}{pack.blocks.map(block => <BlockCard key={block.id} pack={pack} block={block} sessionSize={practiceSize} progress={metrics.blocks.find(item => item.blockId === block.id)!} onStart={() => start(pack, block.id)} />)}
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
      if (pendingBlock && trainer.data.sessions.some(isActive)) return <section className="empty-state" aria-label="Existing active run"><h2>A run is already in progress</h2><p>Your current answers will remain until you explicitly abandon this run. Your run is saved locally and can be resumed after reload.</p><div className="summary-actions"><button onClick={() => { const active = trainer.data.sessions.find(isActive); if (active) trainer.view(active.sessionId); setPendingBlock(null); setPendingRevision(null); }}>Resume current run</button><button className="quiet-button" onClick={() => pendingRevision ? startRevision(pendingRevision, true) : start(pack, pendingBlock, true)}>Abandon and start new run</button></div></section>;
      if (session?.status === 'completed') return <Summary session={session} canRepeat={pack.blocks.some(block => block.id === session.blockId)} onRepeat={() => start(pack, session.blockId)} />;
      if (isActive(session)) return <Practice session={session} blocked={Boolean(trainer.error)} send={trainer.send} onAbandon={() => { trainer.abandon(); window.location.hash = '/progress'; }} />;
      return <section className="empty-state"><h2>No active practice session</h2><p>Start Quick or Standard Practice. Your run saves automatically on this device.</p><a href="#/blocks">Browse blocks</a></section>;
    }
    if (page === 'progress' && route.length === 1) return <Progress pack={pack} sessions={trainer.data.sessions} onView={view} onRevision={items => startRevision(items)} />;
    if (page === 'settings' && route.length === 1) return <div className="settings-workspace"><Settings settings={trainer.data.settings} onChange={trainer.settings} /><Backup data={trainer.data} onReplace={trainer.replace} busy={trainer.busy} failed={Boolean(trainer.error)} /><section className="empty-state offline-settings"><h2>Offline & installation</h2><p role="status">{pwa.message}</p><p>After offline readiness is confirmed, install this app using Microsoft Edge’s address-bar app icon or Apps menu. Keep the same origin and browser profile.</p><button className="quiet-button" onClick={pwa.prepare}>Prepare offline files</button><button className="quiet-button" onClick={pwa.checkUpdate}>Check for app update</button>{pwa.waiting && <><p>Update available. Active runs defer installation in every open tab.</p><button onClick={pwa.update} disabled={!updateSafe}>Apply update & reload</button></>}<small>{pwa.cacheVersion}</small></section></div>;
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
    <div className="workspace"><main id="main-content" tabIndex={-1} className={`main-content page-${page}`}>
      <div className="page-header"><div><p className="eyebrow">Your German learning space</p>
      <h1 ref={heading} tabIndex={-1}>{title}</h1></div><div className="page-status"><span className="badge"><span className="status-dot" aria-hidden="true" />{!pwa.online ? pwa.ready ? 'Offline · ready' : 'Offline · cache not verified' : pwa.ready ? 'Offline ready' : 'Saved on this device'}</span><span className="save-state" aria-live="off" data-state={trainer.error ? 'error' : trainer.busy ? 'saving' : 'idle'}>{trainer.error ? 'Save needs attention' : trainer.busy ? 'Saving locally…' : 'Automatic local saving'}</span></div></div>
      {content.status === 'loading' && <p role="status">Loading your study material…</p>}
      {content.status === 'error' && <section className="error-state" role="alert"><h2>Study material could not be opened</h2><p>The content must load and pass validation before you can study. Check that the app server is running; if validation fails, restore a valid content pack.</p><details><summary>Error details</summary><p>{content.message}</p></details><button onClick={() => setRetry(value => value + 1)}>Try again</button></section>}
      {trainer.error && <section role="alert" className="error-state"><h2>Local progress could not be saved</h2><p>{trainer.error}</p><p>Advancement is blocked until saving succeeds. Keep this page open to retry the failed action.</p><button onClick={trainer.retry}>Retry local save</button><button className="quiet-button" onClick={() => window.location.reload()}>Reload saved progress</button></section>}
      {!trainer.ready && <p role="status">Opening local progress…</p>}
      {content.status === 'ready' && trainer.ready && screen(content.pack)}
    </main>
    <footer>German Trainer · Learn is ungraded.</footer></div></div>
  </>;
}
