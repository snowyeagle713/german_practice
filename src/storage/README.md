# Local persistence
`IndexedDbRepository` implements `Repository`, version 1 of `german-trainer`.
Sessions, immutable first attempts, preferences and metadata are committed in one
transaction. The unique session/question index prevents duplicate grading. Revision
checks reject stale tabs; reload loads the winner rather than overwriting it.
The application queues operations and publishes saved transitions only after commit.
On write failure the failed operation remains retryable and advancement is blocked.
Snapshots permit exact resume without the current authoring pack.
`fake-indexeddb` is a pinned test-only dependency (6.2.5; Node >=18).
