## Why

The item popover currently shows only a title, publisher, and a few attributes with a close button. Users have no way to act on the selected item from the popover itself — they must close it, then hunt for a download toggle or double-click the catalog entry to open the detail tab. Adding direct action buttons removes that indirection.

## What Changes

- Add a "Download" action button to the item popover that toggles the item's download status (mirrors the existing `LibraryController::toggle_download` behavior), with its label/icon reflecting the current `ItemStatus` (Download vs. Remove Download).
- Add an "Open in Detail" action button to the item popover that opens the item's detail tab via `TabsController::open_detail_tab`, giving the popover the same tab-opening behavior currently only reachable by double-clicking a catalog entry.
- Thread the `TabsController` entity into `render_item_popover` so it can dispatch the open-detail action; the popover's caller in `catalog_view.rs` already holds this entity.
- Keep both actions visible for every popover regardless of item status; only the download button's label/icon changes with state.

## Capabilities

### New Capabilities
- `rust-item-popover-actions`: Action buttons in the item popover (download toggle, open detail tab) with state-reflecting labels and click-to-dispatch behavior against `LibraryController` and `TabsController`.

### Modified Capabilities
(none — no existing spec currently governs the item popover's contents)

## Impact

- `dtrpg-app/rust`: Modifies `crates/dtrpg-ui/src/ui/views/item_popover_view.rs` (adds action buttons, new `tabs` parameter) and `crates/dtrpg-ui/src/ui/views/catalog_view.rs` (passes `tabs_entity` through to `render_item_popover`).
- `dtrpg-sdk`: No changes; reuses existing `LibraryController::toggle_download` and `TabsController::open_detail_tab`.
- UI/UX: Users can download/remove-download and open the full detail tab directly from the popover without closing it first.
- Dependencies: None beyond existing `gpui-component` `Button` usage already present in the popover.
