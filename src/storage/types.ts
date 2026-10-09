import type { PracticeSession } from '../domain/practice/types';
export interface Settings { theme: 'lingua-learning' | 'finance-dashboard'; sessionSize: 10 | 20 }
export interface LocalData {
  revision: number;
  settings: Settings;
  cursors: Record<string, number>;
  currentId: string | null;
  sessions: PracticeSession[];
}
export const emptyData = (): LocalData => ({ revision: 0, settings: { theme: 'lingua-learning', sessionSize: 20 }, cursors: {}, currentId: null, sessions: [] });
export interface Repository { read(): Promise<LocalData>; save(data: LocalData, expectedRevision: number): Promise<LocalData> }
