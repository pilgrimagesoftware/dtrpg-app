## Context

Both desktop frontends (Rust/gpui, Swift) fetch the user's catalog from the DriveThruRPG
API and cache it locally. Today, once a local catalog exists, both frontends treat a
subsequent server query as authoritative and replace the local catalog wholesale with
whatever comes back. Neither frontend has a concept of "the server didn't mention this item
this time" versus "this item is gone" — a flaky response or incomplete pagination looks
identical to a genuine removal.

The Rust frontend already has a detailed implementation change
(`dtrpg-app/rust/openspec/changes/catalog-remote-sync-reconciliation`) that works out the
full mechanism — data model additions, cooldown constants, a check queue mirroring the
existing thumbnail-fetch queue, and a partial date-filtered fetch using the SDK's
`updatedDate[after]` support. That level of detail is appropriate for a child change in a
single language repository; it is not appropriate here, since Swift will use different data
structures, concurrency primitives, and UI toolkit conventions to satisfy the same behavior.

## Goals / Non-Goals

**Goals:**
- Describe reconciliation, availability flagging, load-trigger cooldowns, item-level
  checks, and the startup fetch-strategy decision purely in terms of observable behavior,
  so either frontend can implement it with native idioms.
- Give child changes in `dtrpg-app/rust` and `dtrpg-app/swift` a single shared behavior
  contract to implement against, so the two frontends don't drift.

**Non-Goals:**
- Prescribing Rust types, gpui APIs, Swift types, or SwiftUI/Combine patterns — those
  belong in each child change's own design.
- Defining exact cooldown durations, batch sizes, or field names — child changes choose
  concrete values appropriate to their platform, as long as the shared scenarios hold.
- Redefining the DriveThruRPG API contract — any API capability this relies on (e.g. an
  items-updated-since filter, a cheap item-count endpoint, a single-item detail fetch) is
  assumed already available via each platform's SDK, not introduced by this change.

## Decisions

**Reconciliation is defined as three shared load triggers, not three shared code paths.**
Each frontend already has its own load pipeline; this change only constrains the *outcome*
per trigger:
- No local catalog data: full fetch, populated incrementally as data arrives, no
  reconciliation (nothing to reconcile against).
- User-requested full reload: gated by a cooldown so repeated requests don't each hit the
  network; once past the cooldown, a full fetch is reconciled against local data.
- Routine load with local data already present: reconciled against local data, same
  reconciliation outcome as a reload that proceeds past its cooldown.

**Availability is a flag, not a deletion.** An item the server stops returning stays in the
local catalog, marked unavailable, rather than being removed. Rationale: users may still
want to open or manage previously-downloaded content for an item that briefly disappears
from the server's listing (e.g. a transient publisher-side delisting); deleting local state
on a single incomplete response is destructive and hard to undo. A flag that clears itself
automatically when the item reappears keeps this self-healing.

**Item-level checks are additive to full reconciliation, not a replacement for it.** A
single-item check (triggered by viewing an entry's details, or by a periodic background
queue) can only set availability true/false on an item that already exists locally — it
never adds or removes catalog entries. This keeps the mechanism cheap (one item, one
request) and safe to run frequently, while full reconciliation remains the only mechanism
that can discover genuinely new items.

**Both manual and automatic item-check triggers share one cooldown.** A user-initiated
"check for updates" action and any automatic/periodic background trigger both consult the
same last-triggered timestamp before enqueueing a check batch. Rationale: the concern in
both cases is the same — bounding total request volume against the API — so two independent
cooldowns could stack (an automatic tick firing moments after a manual trigger) and
undermine the protection either was meant to provide alone.

**Startup fetch strategy is a three-way decision, not a binary skip/fetch.** A cheap remote
item-count check already exists in both frontends as an optimization to skip a full fetch
when the cache matches. This change extends that into a third outcome: when the remote
count is *greater* than the local count, a partial fetch scoped to items added or changed
since the local catalog's most recent known timestamp is preferred over a full fetch, since
growth-only mismatches are the common case and a partial fetch is much cheaper. Any other
mismatch (including a remote count *less than* local — which growth-only reasoning can't
explain) falls back to a full reconciliation fetch, since only a complete listing can
correctly identify what's missing.

**A partial fetch never marks items unavailable.** Because a partial, date-filtered fetch
is never a complete listing of the server's catalog, an item's absence from it is not
evidence of anything. Only a full reconciliation fetch, or a targeted single-item check, is
trusted to flip an item to unavailable.

## Risks / Trade-offs

- **Behavioral drift between Rust and Swift child implementations** → mitigated by this
  shared spec defining outcomes as scenarios both child changes must satisfy; a
  language-neutral acceptance test (manual or scripted) comparing both frontends' behavior
  against the same server fixture is a reasonable follow-up if drift becomes a problem in
  practice.
- **Partial fetch can miss a removal that coincides with an addition** (e.g. one item
  removed, two added, net count still grows) → accepted as an approximation; the item-level
  check mechanism is the backstop that bounds how long such staleness can persist, since
  every catalog entry eventually gets checked individually.
- **API capabilities this relies on may not exist identically on both SDKs** (count
  endpoint, updated-since filter, single-item fetch) → each child change is responsible for
  confirming its SDK's support and falling back to a full fetch when a cheaper path isn't
  available, consistent with how the existing count-check optimization already degrades
  when unsupported.

## Migration Plan

No shared migration steps — each child change owns its own data/cache migration (e.g.
adding a persisted availability flag to its own on-disk cache format) and should describe
backward compatibility with its own existing cache files in its own design.

## Open Questions

None at the shared-behavior level. Platform-specific tuning (exact cooldown durations, batch
sizes) is left to each child change.
