## Why

`docs/CATALOG.md` describes how the app should build, refresh, and recover its local
catalog, but several parts of that behavior have no shared spec: how the app measures and
reports progress on a brand-new catalog, how it decides a remote query is worth making at
all, how it tells the user something went wrong, how it reacts to being offline, and how
background work stays ordered and queued without blocking the UI. The document's scope
spans catalog metadata/cache, downloaded content, cover image cache, and avatar image
cache — so this isn't purely a catalog concern, it's the app's general resource-caching
behavior. Existing changes cover adjacent ground — `catalog-remote-sync-reconciliation`
defines merge-by-identity and cooldown-gated reconciliation, `define-app-startup-workflow`
defines the startup sequence and a staleness-check for triggering refresh,
`incremental-catalog-population` defines progressive page rendering — but none of them
define the fresh-install initialization sequence, connectivity awareness, retry/backoff and
logging conventions, or the shared work-queue topology. Both frontends need the same
answers here so a user sees consistent behavior regardless of which app they run.

## What Changes

- Define the fresh-install initialization sequence: an initial remote request for catalog
  totals (item count, size) before any item data is fetched, used to report progress;
  paginated item fetches that update the local catalog and view in real time as each page
  arrives; and a "last request time" record that gates redundant requests.
- Define subsequent-startup behavior: always load local catalog and cache content before
  any network request; skip a new remote request when "last request time" indicates it is
  too soon, using cached data instead; surface catalog/cache age in the settings view.
- Define catalog update behavior: use cache-control headers or query parameters to detect
  server-side changes before re-fetching or re-downloading cached content.
- Define shared logging conventions covering catalog metadata/cache, downloaded content,
  cover image cache, and avatar image cache: log level guidance (routine activity,
  warnings, errors), and a split between concise user-facing messages and more verbose
  internal-only messages.
- Define shared error handling and retry behavior for the same resource scope: bounded
  retries with backoff, the retry number and reason logged per attempt, and the retry
  number (not the reason) suitable for surfacing to the user.
- Define a lightweight network monitor capability, shared across the same resource scope:
  distinguishes general network unavailability from a specific endpoint being unreachable;
  processes needing a specific endpoint query it before requesting; processes needing
  general connectivity query it and continue or stop accordingly; the monitor may also push
  network-state-change events to interested processes in addition to answering queries.
- Define the shared background work-queue topology: a serial queue for catalog updates and
  remote synchronization (to keep updates ordered and consistent), a separate queue with
  its own thread pool for content downloads, and additional queues for other background
  tasks (e.g. cover/avatar image caching) as needed — all backed by threads/executors, none
  blocking the UI, and each bounded so remote endpoints are not overloaded.
- Define three caveat scenarios as explicit requirements: an empty or relocated local
  catalog with valid credentials re-runs fresh-install initialization; inaccessible or
  expired credentials with a valid local catalog keep the app on cached data and show a
  non-intrusive re-authentication banner rather than blocking the user; and a long-running
  session keeps a "time to refresh" timer that checks the cooldown independent of any
  startup event and triggers a catalog update once it elapses.
- Require language-specific child changes in the Rust and Swift app repos to implement this
  shared behavior using each platform's own concurrency primitives, HTTP client, and
  logging/UI conventions.

## Capabilities

### New Capabilities

- `catalog-fresh-install-initialization`: the ordered, progressive fresh-install sequence —
  totals request, paginated fetch with real-time view updates, and "last request time"
  tracking. Catalog-specific: avatar and cover-image caching are not paginated fetches.
- `resource-network-monitor`: the lightweight connectivity monitor distinguishing general
  network state from specific-endpoint reachability, the query contract processes use
  before making requests, and optional push notification of network-state changes. Shared
  across catalog metadata/cache, downloaded content, cover image cache, and avatar image
  cache.
- `resource-work-queue-topology`: the shared background queue topology — a serial
  catalog-sync queue, a separate bounded-concurrency download queue, and optional
  additional queues for other cached resources (cover/avatar images), all non-blocking to
  the UI.
- `resource-error-handling-and-retry`: bounded retry-with-backoff behavior for catalog and
  cache operations across the full resource scope, including what is logged internally
  versus shown to the user.
- `resource-logging-conventions`: log level and verbosity conventions for activity across
  the full resource scope, split between user-facing and internal messages.

### Modified Capabilities

- `resource-refresh-scheduling` (from `define-app-startup-workflow`): extend the staleness
  check to cover cache-control/query-parameter-based update detection, not just a fixed
  staleness threshold; and extend the check's trigger points to include a recurring
  long-running-session timer, not just startup.

## Impact

- `dtrpg-app/openspec`: parent language-agnostic behavior definition (this change).
- `dtrpg-app/rust`: child implementation change needed; overlaps with the in-progress
  `reduce-catalog-network-traffic` scaffold (currently empty) and should absorb or
  supersede it rather than duplicate it.
- `dtrpg-app/swift`: child implementation change needed; not yet created.
- Builds on `catalog-remote-sync-reconciliation` (reconciliation/cooldown semantics) and
  `define-app-startup-workflow` (startup sequencing, staleness-check pattern) rather than
  redefining them.
