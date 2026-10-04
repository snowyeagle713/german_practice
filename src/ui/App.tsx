import { useEffect, useRef, useState } from 'react';
import { loadContent } from '../content/load';
import { entriesForBlock } from '../domain/content/selectors';
import type { ContentPack } from '../domain/content/types';
import { BlockCard } from './BlockCard';
import { Learn } from './Learn';

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
      <p className="lead">Build familiarity with German verb constructions, from everyday conversations to technical work.</p>
      <section className="overview" aria-label="Study overview">
        <div><strong>{pack.blocks.length}</strong><span>Available block</span></div>
        <div><strong>{pack.entries.length}</strong><span>Verb constructions</span></div>
        <div><strong>Ungraded</strong><span>Study at your own pace</span></div>
      </section>
      <section aria-labelledby="start-title"><h2 id="start-title">Start with the essentials</h2>
        {pack.blocks.map(block => <BlockCard key={block.id} pack={pack} block={block} />)}
        <a className="text-link" href="#/blocks">Browse blocks →</a>
      </section>
      <section className="empty-state" aria-labelledby="session-title"><h2 id="session-title">Practice &amp; recent progress</h2>
        <p>Practice sessions and saved results are not available yet. You can study every construction in Learn.</p>
      </section>
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
    <header className="site-header"><div className="header-inner">
      <a className="brand" href="#/"><span className="brand-mark" aria-hidden="true">GT</span><span>German Trainer<small>Fluency + Technical</small></span></a>
      <nav aria-label="Main navigation">{(['home', 'blocks', 'progress', 'settings'] as const).map(item =>
        <a key={item} href={item === 'home' ? '#/' : `#/${item}`} aria-current={navPage === item ? 'page' : undefined}>{item.charAt(0).toUpperCase() + item.slice(1)}</a>
      )}</nav>
    </div></header>
    <main id="main-content" tabIndex={-1} className="main-content">
      <p className="eyebrow">Fluency + Technical</p>
      <h1 ref={heading} tabIndex={-1}>{title}</h1>
      {content.status === 'loading' && <p role="status">Loading your study material…</p>}
      {content.status === 'error' && <section className="error-state" role="alert"><h2>Study material could not be opened</h2><p>The content must load and pass validation before you can study. Check that the app server is running; if validation fails, restore a valid content pack.</p><details><summary>Error details</summary><p>{content.message}</p></details><button onClick={() => setRetry(value => value + 1)}>Try again</button></section>}
      {content.status === 'ready' && screen(content.pack)}
    </main>
    <footer>German Trainer · Learn is ungraded.</footer>
  </>;
}
