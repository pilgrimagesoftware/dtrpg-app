## Context

This is a parent, language-agnostic behavior definition in `dtrpg-app/openspec`. It does
not touch any implementation — Rust and Swift child changes implement it separately, each
with their own concurrency primitives and HTTP client. The source document's scope spans
catalog metadata/cache, downloaded content, cover image cache, and avatar image cache, so
the shared-infrastructure capabilities (network monitor, work-queue topology, retry, and
logging) are named `resource-*` rather than `catalog-*` and apply across all four; only the
fresh-install pagination sequence is catalog-specific, since avatar/cover images are single
fetches, not paginated collections.

Two existing shared changes already own adjacent ground and are treated as fixed
dependencies rather than being redefined here:
- `catalog-remote-sync-reconciliation` owns merge-by-identity reconciliation and the
  load-trigger cooldowns (no-local-data, user-requested full reload, routine load).
- `define-app-startup-workflow` owns the startup sequence (cached load → auth restore →
  signed-in/signed-out branch) and the staleness-check pattern for catalog/avatar refresh.

This change fills the gaps: what happens before either of those has anything to reconcile
against (fresh install), how requests get made safely under bad network conditions, how
background work is queued and reported, and how a refresh gets triggered during a session
that outlives the startup sequence entirely.

## Goals / Non-Goals

**Goals:**
- Define the fresh-install sequence: totals request → paginated, real-time-rendering fetch
  → "last request time" bookkeeping.
- Define a connectivity-awareness contract (network monitor) that any process making a
  remote request can consult, with an optional push-notification path for state changes.
- Define the queue topology for background catalog/download/image-cache work, including
  which queues must be serial versus concurrent.
- Define shared logging and retry/backoff conventions, applied uniformly across catalog
  metadata/cache, downloaded content, cover image cache, and avatar image cache, so both
  frontends produce comparable, debuggable output and comparable user-facing error
  behavior.
- Define the three caveat scenarios (empty/relocated catalog; expired credentials with
  valid local catalog; long-running-session refresh timer) as testable requirements, not
  just prose notes.

**Non-Goals:**
- Reconciliation merge semantics once a baseline catalog exists (owned by
  `catalog-remote-sync-reconciliation`).
- Startup sequencing and the staleness-check trigger mechanism itself (owned by
  `define-app-startup-workflow`); this change only extends that capability's freshness
  check to also consider cache-control/query-parameter signals and to fire from a recurring
  timer in addition to startup.
- Any Rust- or Swift-specific implementation: thread pool sizing, specific executor types,
  specific HTTP client, specific logging framework, specific timer/scheduler API, specific
  push-notification mechanism (e.g. `NWPathMonitor` vs. polling). Those are child-change
  decisions.
- Download-level retry behavior already covered by `download-retry-with-backoff` in the
  Rust child repo; this change defines retry/backoff as a *general* resource-caching
  requirement that a download-specific change can specialize, not one that competes with
  it.

## Decisions

**Shared-infrastructure capabilities are named `resource-*`, not `catalog-*`, to match the
document's explicit scope.**
The source document's Scope section lists catalog metadata/cache, downloaded content, cover
image cache, and avatar image cache together. Naming the network monitor, work-queue
topology, retry, and logging capabilities `catalog-*` would misstate their reach and
invite a future rename. `resource-*` also aligns with the existing
`resource-refresh-scheduling` capability from `define-app-startup-workflow`, which already
treats catalog and avatar refresh uniformly.
Alternative considered: keep everything under `catalog-*` and note the broader scope only
in prose. Rejected because capability names are the contract other changes reference; an
inaccurate name is worse than a slightly longer one.

**Fresh-install initialization stays catalog-specific.**
Pagination, a totals-first request, and real-time incremental rendering only make sense for
a large paginated collection (the catalog). Avatar and cover-image fetches are single-item
requests governed by `resource-refresh-scheduling`'s staleness check, not by this sequence.
Folding them in would force an artificial "pagination of one" concept onto single-resource
fetches.

**Network monitor supports both pull queries and push events.**
The source document now says a process "should be able to query" the monitor before a
request (pull, mandatory) and separately notes "it may make sense" for the monitor to also
push state-change notifications (optional). The spec keeps the query contract as the
required behavior and describes push notification as an available capability, not a
requirement every implementation must satisfy — this matches the document's own hedged
phrasing ("may make sense") rather than overstating it as mandatory.

**Retry number is user-facing; retry reason is not.**
Matches the source document precisely ("It is acceptable to expose the retry number to the
user"). Reason strings often contain internal detail (status codes, endpoint paths) that
is verbose or confusing in a user-facing surface; only the internal log gets the reason.

**Work-queue topology is specified structurally (serial catalog-sync queue, separate
download queue, optional other queues) rather than left fully open-ended.**
The source document is explicit about this split ("This queue should be serial", "a
separate queue for content downloads with its own thread pool"), so the spec encodes the
topology itself as a requirement rather than only the general properties (ordered,
concurrent, non-blocking, bounded). Cover-image and avatar-image caching fall under the
"other background tasks" queue category the document allows for "if necessary," rather than
forcing them into the catalog-sync or download queues where they don't structurally belong.

**The long-running-session refresh timer extends `resource-refresh-scheduling` rather than
becoming its own capability.**
The timer's job is identical to the existing staleness check — decide whether cached data
is stale enough to refresh — it just adds a second trigger point (a recurring interval)
alongside the existing startup trigger. Modeling it as a new trigger on the existing
capability keeps one staleness definition instead of two that could drift apart. The
work-queue topology's serial catalog-sync queue is what actually executes the refresh once
the timer decides one is due, so the two capabilities compose rather than overlap.

## Risks / Trade-offs

- [Five small capabilities instead of one] → Reviewers must read across multiple spec
  files to get the full picture. Mitigated by the proposal's "What Changes" section serving
  as the single narrative entry point, and by consistent `resource-*`/`catalog-*` prefixes
  so related capabilities group together in `openspec/specs/`.
- [Network monitor spec describes push notification as optional] → Child implementations
  could diverge, with one platform offering push and the other pure polling. Acceptable
  because the source document itself only hedges ("may make sense"); the pull-query
  contract is what must match across platforms, not the push mechanism.
- [Overlap with the empty `reduce-catalog-network-traffic` Rust scaffold] → That change has
  no content yet, so there's nothing to reconcile now; flagged in the proposal's Impact
  section so whoever picks it up next checks first instead of duplicating scope.
- [Modifying `resource-refresh-scheduling`] → This is an existing capability owned by
  `define-app-startup-workflow`; changing its delta here means two changes touch the same
  capability. Mitigated by scoping the modification narrowly (add a cache-control signal
  and a recurring-timer trigger to the existing staleness check, don't alter its underlying
  structure).
- [Recurring timer firing while the app is backgrounded or the machine is asleep] → Not
  addressed by the source document. Left as an open question below rather than guessed at.

## Migration Plan

Not applicable — this is a behavior specification with no running system to migrate. Once
merged, `dtrpg-app/rust` and `dtrpg-app/swift` child changes implement it independently;
each child change's own migration plan (if any) covers its platform's rollout.

## Open Questions

- Should `resource-work-queue-topology` and `resource-network-monitor` eventually
  formalize the "other background tasks" queue category (cover/avatar caching today) into
  something more specific, once a second consumer beyond images is implemented? Not
  blocking this change.
- Should the long-running-session timer fire while the app is backgrounded, minimized, or
  the system is asleep, or only while the app is in the foreground and active? The source
  document does not say; deferred to whichever child change implements the timer first,
  with the answer fed back into this parent spec if it turns out to be a cross-platform
  concern.
