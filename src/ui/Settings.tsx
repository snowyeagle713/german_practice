import { useEffect, useState } from 'react';
import type { Settings as Preferences } from '../storage/types';
import { palettes } from './theme/palettes';
export function Settings({ settings, onChange }: { settings: Preferences; onChange: (settings: Preferences) => void }) {
  const [draft, setDraft] = useState(settings);
  useEffect(() => { setDraft(settings); }, [settings]);
  const change = (next: Preferences) => { setDraft(next); onChange(next); };
  return <section className="empty-state"><h2>Appearance & practice</h2><p>Preferences save on this device. Both palettes share the same learning layout.</p>
    <div className="settings-fields"><label htmlFor="theme">Palette</label><select id="theme" value={draft.theme} onChange={event => change({ ...draft, theme: event.target.value === 'finance-dashboard' ? 'finance-dashboard' : 'lingua-learning' })}>{palettes.map(palette => <option key={palette.id} value={palette.id}>{palette.label}</option>)}</select>
    <label htmlFor="session-size">Preferred session size</label><select id="session-size" value={draft.sessionSize} onChange={event => change({ ...draft, sessionSize: event.target.value === '10' ? 10 : 20 })}><option value="20">Standard Practice · 20 questions</option><option value="10">Quick Practice · 10 questions</option></select></div>
    <p>Changing session size affects new runs; an active run keeps its existing order and size.</p>
    <p>Learning data stays in this browser profile on this device. Clearing site data removes it; keep a backup.</p>
  </section>;
}
