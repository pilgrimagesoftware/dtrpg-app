## Why

Desktop app startup behavior (auth restore, catalog load/refresh, avatar load/refresh, and
signed-out browsing) is currently only sketched in working notes, not specified. Without a
shared spec, each platform implementation (Rust, Swift) risks diverging on load order, refresh
cadence, and signed-out fallback behavior.

## What Changes

- Define the startup sequence: load any locally cached catalog data first, then restore auth
  from the keychain, then branch on session state.
- Define signed-in startup behavior: check the last catalog refresh timestamp and the last
  Gravatar avatar refresh timestamp against a staleness threshold, refresh whichever is stale
  or missing, and persist the check timestamp only when the check completes (not when aborted).
- Define signed-out startup behavior: show a placeholder avatar, keep the catalog and
  collections visible in read-only form, and disable drag-and-drop plus add/remove actions.
- Extend the shared auth UX principles to cover the signed-out browsing state explicitly.

## Capabilities

### New Capabilities
- `app-startup-sequencing`: The ordered startup flow — cached catalog load, keychain auth
  restore, and the signed-in/signed-out branch that follows.
- `resource-refresh-scheduling`: The shared staleness-check logic used to decide whether to
  refresh a locally cached resource (catalog, Gravatar avatar), including the rule that the
  check timestamp is only persisted on completion, not on abort.

### Modified Capabilities
- `shared-auth-ux-principles`: Add the signed-out browsing requirement — placeholder avatar,
  read-only catalog and collections, disabled drag-and-drop and add/remove actions.

## Impact

- Affected areas: app bootstrap/startup sequence, session restore (keychain-backed auth),
  catalog load/refresh trigger, Gravatar avatar load/refresh trigger, local timestamp storage.
- Depends on the existing keychain-backed credential storage described in NOTES.md (API key
  acquired via the login flow, stored with email) — that credential-storage change is tracked
  separately and is not redefined here.
- No API or SDK contract changes; this is app-level sequencing and UX behavior.
