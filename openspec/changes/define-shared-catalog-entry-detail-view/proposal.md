## Why

The top-level `dtrpg` change `multi-item-catalog-entry-detail` defines an umbrella contract for a catalog entry detail view that distinguishes single-item and multi-item entries. `dtrpg-app`'s existing `shared-main-window-structure` capability already establishes that double-clicking a catalog item opens a closable expanded detail tab containing "a large thumbnail, item attributes, and a file list for multi-item entries" — but it does not specify the layout, metadata tiers, or item-selection behavior inside that tab. This change fills that gap and reconciles the two.

## What Changes

- Define `shared-catalog-entry-detail-view`: the language-agnostic layout and behavior for the content hosted inside the expanded detail tab established by `shared-main-window-structure`, covering the entry-tier/item-tier metadata split, the persistent item list panel for multi-item entries, and inline collapse for single-item entries.
- Clarify (via a `shared-main-window-structure` delta) that the expanded detail tab's "item attributes" and "file list for multi-item entries" are specified by `shared-catalog-entry-detail-view`, and that the single-click popover remains a lightweight summary that does not implement the item list or item-selection affordance.
- Define the item-count badge requirement for list, tree, and grid presentations, carried over from the umbrella spec.
- Require Swift and Rust child app proposals to map this shared behavior to AppKit and GPUI implementation details.

## Capabilities

### New Capabilities

- `shared-catalog-entry-detail-view`: Defines the two-tier metadata layout, persistent item list panel, item-selection behavior, and item-count badge requirement for desktop frontends, scoped to the expanded detail tab.

### Modified Capabilities

- `shared-main-window-structure`: Clarifies that the expanded detail tab's item attributes and multi-item file list are specified by `shared-catalog-entry-detail-view`, and that the single-click popover is a distinct, lighter-weight summary surface.

## Impact

- `dtrpg-app/openspec`: Adds shared catalog entry detail view coordination and a delta on `shared-main-window-structure`.
- `dtrpg-app/swift`: Needs AppKit-specific child implementation planning.
- `dtrpg-app/rust`: Needs GPUI-specific child implementation planning.
- Depends on `dtrpg/openspec/changes/multi-item-catalog-entry-detail`.
