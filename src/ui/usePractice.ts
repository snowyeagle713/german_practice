import { useReducer } from 'react';
import { isActive, transition } from '../domain/practice/session';
import type { PracticeCommand, PracticeSession } from '../domain/practice/types';

type Action = { type: 'start'; session: PracticeSession } | { type: 'replace'; session: PracticeSession } | { type: 'command'; command: PracticeCommand };
function reducer(current: PracticeSession | null, action: Action): PracticeSession | null {
  if (action.type === 'start') return isActive(current) ? current : action.session;
  // This action is dispatched only after the app user chooses Abandon and start.
  if (action.type === 'replace') return action.session;
  return current ? transition(current, action.command) : current;
}
export function usePractice() {
  return useReducer(reducer, null);
}
