## Context

`shared-main-window-library-layout` defined the current shared baseline: a disclosable
search/filter strip, a content-area account menu, list/tree/grid content, and non-blocking sync
status. The top-level `ui-revamp` change replaces the search/filter strip and account menu with a
title bar, replaces ad hoc collection/publisher navigation with a persistent sidebar, adds tabbed
browsing, and consolidates counts, sync activity, notifications, and theme selection into a status
bar. This change maps that structure into shared, implementation-neutral requirements for the
Swift and Rust frontends.

## Goals / Non-Goals

**Goals:**

- Map the top-level title bar, sidebar, tabs, and status bar contract into shared app behavior.
- Keep requirements implementation-neutral so AppKit/SwiftUI and GPUI can satisfy them differently.
- Identify which parts of `shared-main-window-library-layout` are retired versus carried forward.
- Reference existing app-level activity, notification, and account work instead of redefining it.

**Non-Goals:**

- Define AppKit view classes, SwiftUI views, or GPUI components.
- Add new API, SDK, or persistence contracts.
- Define the notification panel's or activity panel's internal content.

## Decisions

Keep `shared-main-window-library-layout` and add a new `shared-main-window-structure` capability
rather than folding everything into one capability.
Rationale: browsing-state and presentation requirements (list/tree/grid, filtered/sorted result
set) are unaffected and stay in the existing capability; only the container regions change.

Reference existing activity/notification/account app-level work rather than re-specifying it.
Rationale: `activity-panel-improvements`, `alert-history-view`, and `avatar-menu-user-info` already
define this behavior in `dtrpg-app/rust`; duplicating it here risks drift.

## Risks / Trade-offs

- **Risk: Rust and Swift implementations diverge on tab overflow behavior** -> Mitigation: both
  child specs must define an overflow "more" menu as a hard requirement, not an option.
- **Risk: Existing sidebar and activity-panel work in `dtrpg-app/rust` gets duplicated** ->
  Mitigation: child proposals reference and extend `sidebar-section-counts`,
  `activity-panel-improvements`, and related in-progress work instead of restating it.

## Migration Plan

1. Land this shared change to retire the superseded parts of `shared-main-window-library-layout`.
2. Add or update `dtrpg-app/rust` and `dtrpg-app/swift` child changes mapping the structure to
   GPUI and AppKit/SwiftUI respectively.
3. Implement behind existing sidebar, activity panel, and notification banner behavior in each
   frontend, extending rather than replacing it.
