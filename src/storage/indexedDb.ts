import { emptyData, type LocalData, type Repository } from './types';
const stores = ['sessions', 'attempts', 'settings', 'metadata'];
export class IndexedDbRepository implements Repository {
  private connection: Promise<IDBDatabase> | null = null;
  private open(): Promise<IDBDatabase> {
    return this.connection ??= new Promise((resolve, reject) => {
      const request = indexedDB.open('german-trainer', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore('sessions', { keyPath: 'sessionId' });
        const attempts = db.createObjectStore('attempts', { keyPath: 'attemptId' });
        attempts.createIndex('sessionQuestion', ['sessionId', 'questionId'], { unique: true });
        db.createObjectStore('settings'); db.createObjectStore('metadata');
      };
      request.onerror = () => { this.connection = null; reject(request.error ?? new Error('Local storage unavailable.')); };
      request.onblocked = () => { this.connection = null; reject(new Error('Close other German Trainer tabs to open local storage.')); };
      request.onsuccess = () => {
        request.result.onversionchange = () => { request.result.close(); this.connection = null; };
        resolve(request.result);
      };
    });
  }
  async read(): Promise<LocalData> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(stores, 'readonly');
      const sessions = tx.objectStore('sessions').getAll();
      const settings = tx.objectStore('settings').get('preferences');
      const metadata = tx.objectStore('metadata').get('state');
      tx.oncomplete = () => resolve({ ...emptyData(), ...metadata.result, settings: settings.result ?? emptyData().settings, sessions: sessions.result });
      tx.onabort = () => reject(tx.error ?? new Error('Could not read saved progress.'));
    });
  }
  async save(data: LocalData, expectedRevision: number): Promise<LocalData> {
    const db = await this.open();
    const next = { ...data, revision: expectedRevision + 1 };
    return new Promise((resolve, reject) => {
      const tx = db.transaction(stores, 'readwrite');
      let failure: Error | null = null;
      const revision = tx.objectStore('metadata').get('state');
      revision.onsuccess = () => {
        if ((revision.result?.revision ?? 0) !== expectedRevision) {
          failure = new Error('Another tab changed progress. Reload this tab before continuing.'); tx.abort(); return;
        }
        for (const name of stores) tx.objectStore(name).clear();
        for (const session of next.sessions) {
          tx.objectStore('sessions').put(session);
          for (const attempt of session.attempts) tx.objectStore('attempts').put(attempt);
        }
        tx.objectStore('settings').put(next.settings, 'preferences');
        tx.objectStore('metadata').put({ revision: next.revision, cursors: next.cursors, currentId: next.currentId, schemaVersion: 1 }, 'state');
      };
      tx.oncomplete = () => resolve(next);
      tx.onabort = () => reject(failure ?? tx.error ?? new Error('Progress could not be saved. Check available disk space and retry.'));
    });
  }
}
