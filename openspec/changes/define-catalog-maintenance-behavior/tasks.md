## 1. Shared Behavior Spec

- [x] 1.1 Add parent OpenSpec change for shared catalog-maintenance behavior
- [x] 1.2 Add `catalog-fresh-install-initialization` capability delta spec
- [x] 1.3 Add `resource-network-monitor` capability delta spec
- [x] 1.4 Add `resource-work-queue-topology` capability delta spec
- [x] 1.5 Add `resource-error-handling-and-retry` capability delta spec
- [x] 1.6 Add `resource-logging-conventions` capability delta spec
- [x] 1.7 Add `resource-refresh-scheduling` MODIFIED/ADDED delta (cache-control signal,
      recurring long-running-session timer trigger)

## 2. Sibling-Change Reconciliation

- [x] 2.1 Confirm `define-app-startup-workflow` archives (establishing the baseline
      `resource-refresh-scheduling` spec) before or alongside this change, since this
      change's delta modifies requirements that only exist there today; rebase the delta
      here if the baseline requirement text changes before archiving.
      Confirmed 2026-07-16: `define-app-startup-workflow` has not archived yet (0/19 tasks,
      no entry under `openspec/specs/`), but its `resource-refresh-scheduling` delta text
      still matches this change's MODIFIED requirement verbatim up to the added
      cache-control clause — no drift, no rebase needed. Re-check before archiving either
      change if that baseline text moves.
- [x] 2.2 Check the in-progress `dtrpg-app/rust` scaffold `reduce-catalog-network-traffic`
      (currently empty) against this change's scope before it gains content, so it either
      absorbs this shared capability or is closed as superseded rather than duplicating it.
      Corrected 2026-07-16: the scaffold did exist, but only as an uncommitted, untracked
      `openspec/changes/reduce-catalog-network-traffic/` directory (a bare `.openspec.yaml`,
      no proposal/tasks) in the `dtrpg-app/rust` working tree — invisible to a search of
      committed branches, PRs, or issues. Resolved by deleting the empty scaffold and
      proposing the Rust child change (task 3.1) fresh under a name matching its actual
      scope, since there was no content in the scaffold to preserve.

## 3. Child Implementation

- [ ] 3.1 Create a Rust child change in `dtrpg-app/rust` implementing
      `catalog-fresh-install-initialization`, `resource-network-monitor`,
      `resource-work-queue-topology`, `resource-error-handling-and-retry`,
      `resource-logging-conventions`, and the `resource-refresh-scheduling` extensions,
      using Rust-native concurrency primitives (threads/executors), the existing HTTP
      client, and `tracing`-based logging.
- [ ] 3.2 Create a Swift child change in `dtrpg-app/swift` implementing the same shared
      capability using Swift-native concurrency (actors/async-await), `NWPathMonitor` or
      an equivalent for the network monitor, and Swift-native logging conventions.

## 4. Rollout Coordination

- [ ] 4.1 Confirm both frontends satisfy the same fresh-install, network-monitor,
      work-queue-topology, retry/backoff, logging, refresh-scheduling, and caveat
      scenarios once their child changes are implemented.
- [ ] 4.2 Resolve the open question on recurring-timer behavior while backgrounded/asleep
      once a child change implements it, and feed the answer back into this parent spec if
      it turns out to be a cross-platform concern.
