## Context

Startup behavior today is described only in working notes (NOTES.md), not in a spec. The app
needs to load a locally cached catalog, restore a keychain-backed session, and then decide
whether to refresh the catalog and the user's Gravatar avatar — all without blocking the UI on
network calls, and without corrupting refresh timestamps when a refresh is interrupted.

## Goals / Non-Goals

**Goals:**
- Specify the order of operations at startup: cached data first, then auth restore, then
  signed-in/signed-out branching.
- Specify one staleness-check rule that both the catalog refresh and the Gravatar avatar refresh
  follow, so the two resources don't need separate refresh policies.
- Specify signed-out browsing behavior so the catalog remains usable (read-only) without a
  session.

**Non-Goals:**
- Redefining how credentials are acquired or stored (tracked separately per NOTES.md's
  "Update login" item).
- Specifying the staleness threshold value itself (e.g., 24h) — that is a configuration detail,
  not a behavioral contract, and can vary per resource.
- Specifying Gravatar's HTTP API details — only the local cache/refresh-check behavior around it.

## Decisions

- **Cached-first startup**: The app renders whatever local catalog data exists before making any
  network call. This keeps the UI responsive and avoids a blank window while auth restores.
  Alternative considered: block on auth restore first — rejected because it delays first paint
  for no benefit when cached data is already on disk.

- **One shared staleness-check policy for catalog and avatar**: Both resources follow the same
  rule — read last-check timestamp, compare against a threshold, refresh if stale or absent,
  and write the new timestamp only on completion. Alternative considered: separate bespoke logic
  per resource — rejected as duplicated logic with no behavioral difference between the two.

- **Timestamp written on completion, not on abort**: If a refresh is cancelled or fails before
  completing, the last-check timestamp is left unchanged, so the next startup retries rather
  than treating a failed check as satisfied. Alternative considered: write timestamp at
  check-start — rejected because a crash or network drop would then silently skip retries.

- **Signed-out state disables mutation, not viewing**: Catalog and collections stay visible for
  browsing; only drag-and-drop and add/remove actions are disabled. Alternative considered:
  hide the catalog entirely when signed out — rejected because it removes value from a user who
  is mid-session-expiry or hasn't finished sign-in yet.

## Risks / Trade-offs

- [Risk] Treating catalog and avatar refresh identically could mask a case where one resource
  legitimately needs a different threshold or trigger later. → Mitigation: the shared policy
  takes the threshold as a parameter per resource, so thresholds can diverge without duplicating
  the check/write logic.
- [Risk] Rendering cached data before auth restores could momentarily show stale
  collection/permission state if the cached session differs from the restored one. → Mitigation:
  the signed-in/signed-out branch re-evaluates and reconciles state once auth restore completes;
  cached data is a first paint, not a final render.

## Open Questions

- None outstanding for this change; the staleness threshold values are implementation
  configuration, not part of this design.
