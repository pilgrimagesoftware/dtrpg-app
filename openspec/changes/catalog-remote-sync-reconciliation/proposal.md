## Why

Desktop frontends that already hold a local catalog currently treat every subsequent server
query as a full replace: whatever the server returns becomes the new local catalog,
unconditionally. If the API is flaky, paginates incompletely, or a title is briefly
delisted, the local catalog silently loses items the user still owns. This is a
product-level behavior gap, not a Rust- or Swift-specific one — both desktop frontends need
the same reconciliation semantics so a user sees consistent behavior regardless of which
app they run.

## What Changes

- Define a shared, language-neutral reconciliation model: once a local catalog baseline
  exists, a server query merges into it by item identity rather than replacing it — new
  items are added, items the server no longer returns are flagged unavailable rather than
  deleted, and previously-flagged items that reappear are un-flagged.
- Define three shared catalog-load triggers and the reconciliation behavior each uses: no
  local data (incremental populate, no reconciliation needed), a user-requested full reload
  (cooldown-gated to prevent server flooding, then reconciled), and a routine load with
  local data already present (reconciled).
- Define shared item-level reconciliation: viewing a single catalog entry's details checks
  that item against the server if it hasn't been checked recently, with a visible
  in-progress indicator; a background process can also periodically re-check items in
  smaller batches, triggered manually or automatically, both gated by shared cooldowns so
  neither path can flood the server.
- Define a shared startup optimization: a cheap remote count check decides whether to skip
  a fetch entirely (cache already matches), perform a partial fetch of only new/changed
  items, or fall back to a full reconciliation fetch when the count mismatch can't be
  explained by pure growth.
- Require language-specific child changes in the Rust and Swift app repos to implement this
  shared behavior using each platform's own data model, concurrency primitives, and UI
  toolkit.

## Capabilities

### New Capabilities

- `shared-catalog-remote-sync-reconciliation`: language-neutral definition of catalog
  reconciliation behavior — full-catalog merge-by-identity, availability flagging,
  load-trigger cooldowns, item-level check-on-view and periodic-queue behavior, and the
  startup partial-vs-full fetch decision.

## Impact

- `dtrpg-app/openspec`: parent reconciliation behavior definition (this change).
- `dtrpg-app/rust`: child implementation change — a Rust-specific reconciliation change
  already exists there (`catalog-remote-sync-reconciliation`) and should be reconciled
  against this shared capability rather than independently redefining it.
- `dtrpg-app/swift`: child implementation change needed to bring the Swift frontend to the
  same behavior; not yet created.
