/** Buffers only drafts. Commit/grade/navigation operations keep their ordered queue. */
export class DraftBuffer<T> {
  private value: T | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  constructor(private readonly save: (value: T) => void, private readonly delay = 300) {}
  get pending() { return this.value !== null; }
  schedule(value: T) {
    this.value = value;
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), this.delay);
  }
  flush() {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
    const value = this.value; this.value = null;
    if (value !== null) this.save(value);
  }
}
