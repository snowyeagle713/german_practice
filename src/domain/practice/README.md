# Practice domain
Pure typed selection, shuffle, transitions, grading, summaries and revision.
Quick selects 10 / Standard 20 using the persisted cursor over the unchanged 40 pool;
revision selects up to 20 pending questions from saved pack snapshots. Question and
choice order remain stable for a run. Previous/defer retains drafts and immutable
first attempts. No React, storage, browser clocks or networking in this layer.
See docs/MVP_COMPLETION_HANDOFF.md for scoring, persistence and verification.
