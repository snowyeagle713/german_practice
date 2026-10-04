import { useEffect, useRef, useState } from 'react';
import { loadContent } from '../content/load';
import { entriesForBlock } from '../domain/content/selectors';
import type { ContentPack } from '../domain/content/types';
import { BlockCard } from './BlockCard';
import { Learn } from './Learn';
import { Icon } from './Icon';

type LoadState = { status: 'loading' } | { status: 'ready'; pack: ContentPack } | { status: 'error'; message: string };

function readRoute(): string[] {
  try { return window.location.hash.replace(/^#\/?/u, '').split('/').filter(Boolean).map(decodeURIComponent); }
  catch { return ['not-found']; }
}

export function App() {
  const [route, setRoute] = useState(readRoute);
  const [content, setContent] = useState<LoadState>({ status: 'loading' });
  const [retry, setRetry] = useState(0);
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
    heading.current?.focus();
    document.title = `${heading.current?.textContent ?? 'German Trainer'} · German Trainer`;
  }, [routeKey, content.status]);

  const page = route[0] ?? 'home';
  const titles: Record<string, string> = { home: 'A little German, every day.', blocks: 'Your blocks', learn: 'Learn', progress: 'Progress', settings: 'Settings' };
  const title = titles[page] ?? 'Page not found';
  const navPage = page === 'learn' ? 'blocks' : page;

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
        {pack.blocks.map(block => <BlockCard key={block.id} pack={pack} block={block} />)}
        <a className="text-link" href="#/blocks">Browse blocks →</a>
      </section>
      <section className="progress-card" aria-labelledby="session-title"><div className="section-heading"><span className="icon-tile mint"><Icon name="progress" /></span><span className="badge neutral">Not available yet</span></div>
        <p className="eyebrow">Your progress</p><h2 id="session-title">A place for your progress</h2>
        <div className="progress-empty" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /></div>
        <p>Practice sessions and saved results are not available yet. You can study every construction in Learn.</p>
        <div className="progress-summary"><span>Practice results</span><strong>Not recorded</strong></div>
        <p className="muted">Learning here is ungraded. Take your time with the examples.</p>
      </section></div>
    </>;
    if (page === 'blocks' && route.length === 1) return <>
      <p className="lead">Study each construction with its rule, meaning, and two real-world examples.</p>
      {pack.blocks.map(block => <BlockCard key={block.id} pack={pack} block={block} />)}
    </>;
    if (page === 'learn' && route.length <= 3) {
      const block = pack.blocks.find(item => item.id === route[1]);
      if (block) {
        const entries = entriesForBlock(pack, block);
        const index = route[2] ? entries.findIndex(entry => entry.id === route[2]) : 0;
        if (index >= 0) return <Learn block={block} entries={entries} index={index} />;
      }
      return <div className="empty-state"><h2>Study page not found</h2><p>This block or construction is not in the current content pack.</p><a href="#/blocks">Return to blocks</a></div>;
    }
    if (page === 'progress' && route.length === 1) return <div className="empty-state"><h2>No practice history yet</h2><p>Practice and saved progress are not available yet. Learn is ungraded and does not create scores or completion records.</p><a href="#/blocks">Explore the starter block</a></div>;
    if (page === 'settings' && route.length === 1) return <div className="empty-state"><h2>Study preview</h2><p>You can browse blocks and study constructions. Backup, installation, and offline features are not available yet.</p><p>Keep the local server running to open or reload the app.</p><a href="#/blocks">Browse blocks</a></div>;
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
      <h1 ref={heading} tabIndex={-1}>{title}</h1></div><span className="badge"><span className="status-dot" aria-hidden="true" />Study preview</span></div>
      {content.status === 'loading' && <p role="status">Loading your study material…</p>}
      {content.status === 'error' && <section className="error-state" role="alert"><h2>Study material could not be opened</h2><p>The content must load and pass validation before you can study. Check that the app server is running; if validation fails, restore a valid content pack.</p><details><summary>Error details</summary><p>{content.message}</p></details><button onClick={() => setRetry(value => value + 1)}>Try again</button></section>}
      {content.status === 'ready' && screen(content.pack)}
    </main>
    <footer>German Trainer · Learn is ungraded.</footer></div></div>
  </>;
}
