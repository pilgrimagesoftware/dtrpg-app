## ADDED Requirements

### Requirement: A local catalog SHALL be reconciled against a full server response by item identity, not replaced

A desktop frontend SHALL merge a complete server response (all pages of a full fetch) into
an already-existing local catalog by item identity, rather than replacing the local catalog
wholesale. Items present in the response but not locally SHALL be added. Items present in
both SHALL have their fields refreshed from the response. Items present locally but absent
from the response SHALL remain in the local catalog, marked unavailable, rather than being
deleted.

#### Scenario: Server response includes an item not previously known locally
- **WHEN** a full server response includes an item with no local counterpart
- **THEN** that item is added to the local catalog, marked available

#### Scenario: Server response omits a previously-known local item
- **WHEN** a full server response does not include an item that exists locally
- **THEN** that item remains in the local catalog, marked unavailable, and is not deleted

#### Scenario: A previously-unavailable item reappears in a server response
- **WHEN** a full server response includes an item that was previously marked unavailable
  locally
- **THEN** that item's fields are refreshed and it is marked available again

### Requirement: A catalog with no local data SHALL populate incrementally without reconciliation

A desktop frontend SHALL populate the catalog incrementally as server data arrives, without
waiting for the entire fetch to complete, and SHALL NOT perform reconciliation, whenever it
has no local catalog data (first run, or after an explicit reset) — there is no local
baseline to reconcile against.

#### Scenario: First page of results appears before the fetch completes
- **WHEN** a catalog fetch starts with no local data and the first page of results arrives
- **THEN** those items are visible to the user immediately, without waiting for the fetch to
  finish

### Requirement: A user-requested full reload SHALL be gated by a cooldown

A desktop frontend SHALL suppress a user-requested full catalog reload, performing no
network request and leaving the catalog unchanged, when the last successful catalog load
completed more recently than a fixed cooldown period. Once that cooldown has elapsed, a
user-requested reload SHALL perform a full fetch and reconcile it against the local catalog.

#### Scenario: Reload requested within the cooldown is suppressed
- **WHEN** the user requests a full reload and the last successful catalog load completed
  less than the cooldown period ago
- **THEN** no network request is made and the catalog is unchanged

#### Scenario: Reload requested after the cooldown proceeds
- **WHEN** the user requests a full reload and the last successful catalog load completed at
  or before the cooldown period ago
- **THEN** a full fetch runs and its result is reconciled against the local catalog

### Requirement: Viewing a catalog entry's details SHALL trigger an individual server check when not recently checked

A desktop frontend SHALL check a single catalog item against the server when the user views
that item's details, unless that item was checked within a fixed per-item cooldown. The
check SHALL NOT block the details view from displaying already-known data, and the entry
SHALL show a visible in-progress indicator for the duration of the check.

#### Scenario: Viewing an item not recently checked triggers a check
- **WHEN** the user views the details of a catalog item last checked longer ago than the
  per-item cooldown, or never checked
- **THEN** an individual server check for that item starts, and the entry shows an
  in-progress indicator until the check completes

#### Scenario: A single-item check only affects availability
- **WHEN** an individual server check for a catalog item completes
- **THEN** only that item's availability flag and fields may change; no items are added to
  or removed from the catalog as a result

### Requirement: Periodic item-level checks SHALL run as a background queue, triggerable manually or automatically, gated by a shared cooldown

A desktop frontend SHALL support enqueueing a batch of individual item checks for items
overdue for a check, triggered either by explicit user request or by an automatic periodic
process. Both trigger paths SHALL be gated by the same cooldown, so a batch already enqueued
recently — by either trigger — SHALL suppress a new batch from either trigger until the
cooldown elapses. Queued checks SHALL be processed with a visible indicator in the catalog
view for whichever item is currently being checked.

#### Scenario: Manual check-batch request enqueues overdue items
- **WHEN** the user manually requests a check batch and no batch was enqueued within the
  cooldown period
- **THEN** items overdue for an individual check are enqueued for background checking

#### Scenario: Automatic trigger is suppressed by a recent manual batch
- **WHEN** an automatic periodic trigger fires and a manual check batch was enqueued within
  the cooldown period
- **THEN** the automatic trigger enqueues nothing

### Requirement: Startup SHALL choose between skipping, a partial fetch, or a full fetch based on a remote count comparison

At startup or routine load, a desktop frontend SHALL compare a cheap remote item count
against the local catalog's item count before deciding how to fetch. When the counts match
and the local cache is not stale, the frontend SHALL skip the fetch. When the remote count
is greater than the local count, the frontend SHALL prefer a partial fetch scoped to items
added or changed since the local catalog's most recent known update, merged additively
without marking any item unavailable. Any other mismatch SHALL result in a full
reconciliation fetch.

#### Scenario: Matching count skips the fetch
- **WHEN** the remote item count matches the local catalog's item count and the local cache
  is not stale
- **THEN** no fetch is performed and the local catalog is used as-is

#### Scenario: Remote count greater than local count prefers a partial fetch
- **WHEN** the remote item count is greater than the local catalog's item count
- **THEN** a partial fetch scoped to items added or changed since the local catalog's most
  recent known update is preferred, and its results are merged additively without marking
  any local item unavailable

#### Scenario: Remote count less than local count requires a full fetch
- **WHEN** the remote item count is less than the local catalog's item count
- **THEN** a full reconciliation fetch runs, since a partial fetch cannot identify which
  items are no longer available
