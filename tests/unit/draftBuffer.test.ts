import { afterEach, expect, it, vi } from 'vitest';
import { DraftBuffer } from '../../src/application/draftBuffer';
afterEach(() => vi.useRealTimers());
it('coalesces typing into one save of the latest text after the quiet interval', () => {
  vi.useFakeTimers(); const save = vi.fn(); const buffer = new DraftBuffer(save);
  buffer.schedule('a'); vi.advanceTimersByTime(200); buffer.schedule('au');
  vi.advanceTimersByTime(200); buffer.schedule('auf');
  expect(save).not.toHaveBeenCalled(); expect(buffer.pending).toBe(true);
  vi.advanceTimersByTime(299); expect(save).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1); expect(save.mock.calls).toEqual([['auf']]); expect(buffer.pending).toBe(false);
});
it('flushes before a following operation and never repeats a flushed save', () => {
  vi.useFakeTimers(); const events: string[] = [];
  const buffer = new DraftBuffer<string>(text => events.push(`draft:${text}`));
  buffer.schedule('wrong'); buffer.schedule('auf'); buffer.flush(); events.push('submit');
  buffer.flush(); vi.runAllTimers(); expect(events).toEqual(['draft:auf', 'submit']);
});
it('keeps independently buffered questions separate after a navigation flush', () => {
  vi.useFakeTimers(); const save = vi.fn(); const buffer = new DraftBuffer(save);
  buffer.schedule({ questionId: 'one', text: 'auf' }); buffer.flush();
  buffer.schedule({ questionId: 'two', text: 'für' }); vi.runAllTimers();
  expect(save.mock.calls).toEqual([[{ questionId: 'one', text: 'auf' }], [{ questionId: 'two', text: 'für' }]]);
});
