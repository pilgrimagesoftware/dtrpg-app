## Context

`shared-main-window-structure` already draws a line between two catalog item interactions: single-click opens a lightweight popover, and double-click opens a closable expanded detail tab that carries "a large thumbnail, item attributes, and a file list for multi-item entries." That requirement was written before the umbrella `multi-item-catalog-entry-detail` change existed, so it names the ingredients (thumbnail, attributes, file list) without specifying their layout or interaction model.

This design reconciles the two: the popover and the expanded tab remain the entry points defined by `shared-main-window-structure`, and this change defines what fills the expanded tab, per the two-tier entry/item metadata model from the umbrella spec.

## Goals / Non-Goals

**Goals:**

- Specify the entry-tier / item-tier metadata layout inside the expanded detail tab.
- Specify the persistent item list panel behavior for multi-item entries, and the inline-collapse behavior for single-item entries, as language-agnostic requirements.
- Specify the item-count badge requirement on list, tree, and grid presentations.
- State explicitly how this capability relates to the popover and expanded-tab distinction already defined by `shared-main-window-structure`, so the two specs do not compete.

**Non-Goals:**

- Redefining the popover surface. The popover stays a lightweight, non-interactive summary; it does not gain an item list or item-selection affordance in this change.
- AppKit or GPUI-specific layout, animation, or component choices — delegated to the Swift and Rust child changes.
- Defining download mechanics or per-item action affordances (tracked separately in `add-item-popover-actions` and related changes).

## Decisions

### 1. The expanded detail tab hosts the full two-tier catalog entry detail view; the popover does not

`shared-main-window-structure` already separates single-click (popover) from double-click (expanded tab). This change assigns the umbrella's full two-tier detail view — entry tier always visible, item tier collapsed inline for single-item entries or expanded to a persistent selectable list for multi-item entries — exclusively to the expanded tab. The popover continues to show a lightweight entry-level summary (title, publisher, thumbnail, purchase status) without an item list, regardless of item count.

**Rationale:** This preserves the existing popover/tab distinction rather than replacing it, and matches the existing wording in `shared-main-window-structure` ("file list for multi-item entries" already scoped to the expanded tab, not the popover). It avoids retrofitting item-selection interaction onto a surface designed to be quick and non-committal.

**Alternative considered:** Also show a condensed item list in the popover for multi-item entries. Rejected — the popover is explicitly non-tab and lightweight; adding a selectable list to it blurs the distinction `shared-main-window-structure` already draws and risks two divergent item-selection implementations.

### 2. `shared-main-window-structure`'s multi-item file list requirement is superseded in detail, not in kind

The existing requirement text ("a file list for multi-item entries") remains true at a high level. This change adds a `MODIFIED` delta on `shared-main-window-structure` that references `shared-catalog-entry-detail-view` for the detailed behavior (persistent panel, item name/type per row, selection updates item metadata in place, ephemeral selection state) rather than duplicating or contradicting it.

**Rationale:** Avoids two specs independently defining the same UI surface with potentially inconsistent details. Keeps `shared-main-window-structure` focused on window/tab structure, and `shared-catalog-entry-detail-view` focused on the content within the tab.

**Alternative considered:** Leave `shared-main-window-structure` unchanged and let `shared-catalog-entry-detail-view` stand alone. Rejected — without an explicit cross-reference, a future reader of `shared-main-window-structure` would not know the file list requirement has been elaborated elsewhere, inviting drift.

## Risks / Trade-offs

- **Risk: Swift and Rust child changes interpret "expanded tab hosts the detail view" differently** → Mitigation: both child changes reference this spec directly and must map entry tier, item tier, and item list panel requirements explicitly, mirroring the pattern used by `define-shared-main-window-library-layout`'s child changes.
- **Risk: Popover/tab boundary becomes unclear over time as more detail-view features land** → Mitigation: keep the popover's scope (lightweight, non-interactive summary) stated explicitly in this spec's requirements, not just implied by cross-reference.

## Migration Plan

1. Land this shared change in `dtrpg-app`, adding `shared-catalog-entry-detail-view` and the `shared-main-window-structure` delta.
2. Create Swift child change in `dtrpg-app/swift` for AppKit expanded-tab detail view implementation.
3. Create Rust child change in `dtrpg-app/rust` for GPUI expanded-tab detail view implementation.
4. Archive once both child changes are filed and reference this capability.

## Open Questions

- Should the popover show an item-count indicator even though it doesn't expose the item list, so users know before double-clicking that an entry has multiple items? (The umbrella spec already requires this indicator on the library browsing surface itself, so this may be redundant — leaving to child app proposals to decide if the popover needs its own restatement.)
