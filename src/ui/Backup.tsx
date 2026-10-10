import { useState } from 'react';
import { backupData, makeBackup, MAX_BACKUP_BYTES, parseBackup, type Backup as BackupFile } from '../storage/backup';
import type { LocalData } from '../storage/types';
export function Backup({ data, onReplace, busy, failed, v2Ready }: { data: LocalData; onReplace: (data: LocalData) => void; busy: boolean; failed: boolean; v2Ready: boolean }) {
  const [preview, setPreview] = useState<BackupFile | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [importRevision, setImportRevision] = useState<number | null>(null);
  function exportFile() {
    try {
      const text = JSON.stringify(makeBackup(data), null, 2);
      if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) throw new Error('Backup exceeds 10 MiB. Export is unavailable for this data size.');
      const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = `german-trainer-${new Date().toISOString().slice(0, 10)}.json`; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); setMessage('Backup download requested. Keep the file somewhere safe.');
    } catch (cause: unknown) { setMessage(cause instanceof Error ? cause.message : 'Backup could not be exported.'); }
  }
  return <section className="empty-state" aria-label="Backup and restore"><h2>Backup & restore</h2><p>Includes saved sessions, answers, revision evidence, theme and session preferences. Import replaces all progress on this device; there is no merge.</p>
    <button onClick={exportFile} disabled={busy}>Export backup</button>
    <div className="settings-fields"><label htmlFor="backup-file">Choose backup to import (JSON, up to 10 MiB)</label><input id="backup-file" type="file" accept="application/json,.json" disabled={busy || failed} onChange={event => {
      const file = event.target.files?.[0]; event.target.value = ''; setPreview(null); setImportRevision(null); setMessage(null);
      if (!file) return;
      if (file.size > MAX_BACKUP_BYTES) { setMessage('Backup exceeds the 10 MiB limit.'); return; }
      void file.text().then(text => {
        const parsed = parseBackup(text);
        if (!v2Ready && parsed.sessions.some(session => session.contentSnapshot.schemaVersion === 2)) throw new Error('Apply the available app update before importing v2 progress. Existing data is unchanged.');
        setPreview(parsed);
      }).catch((cause: unknown) => setMessage(cause instanceof Error ? cause.message : 'Import failed.'));
    }} /></div>
    {preview && <section className="import-preview" aria-label="Import preview"><h3>Review replacement</h3><p>{preview.sessions.length} saved sessions · {preview.attempts.length} answers · exported {new Date(preview.exportedAt).toLocaleString()}</p><p>Palette: {preview.settings.theme} · New session size: {preview.settings.sessionSize}</p><p>Your existing progress, including any active run, will be replaced.</p><div className="summary-actions"><button disabled={busy || failed} onClick={() => { setImportRevision(data.revision); onReplace(backupData(preview)); setPreview(null); }}>Replace progress</button><button className="quiet-button" onClick={() => { setPreview(null); setMessage('Import cancelled. Existing progress is unchanged.'); }}>Cancel import</button></div></section>}
    {message && <p role="status">{message}</p>}
    {importRevision !== null && data.revision > importRevision && !failed && !busy && <p role="status">Backup restored successfully. Preferences and saved progress are now available.</p>}
  </section>;
}
