## Context

`render_item_popover` (`item_popover_view.rs`) currently takes a `LibraryItem`, anchor position, the `LibraryController` entity, and color tokens, and renders a title/publisher header plus a `DescriptionList` of attributes and a close button. Its only caller, `catalog_view.rs`, already holds an `Entity<TabsController>` (`tabs_entity`) alongside the `LibraryController` entity when rendering the popover, so no new state needs to be threaded through the view tree — only an additional parameter on the existing function.

`toggle_download` and `open_detail_tab` already exist and are exercised elsewhere (download toggle via a catalog control, detail tab via double-click), so this change wires existing behavior into a new UI surface rather than introducing new domain logic.

## Goals / Non-Goals

**Goals:**
- Add download and open-in-detail buttons to the item popover, reusing existing controller methods.
- Keep `item_popover_view.rs` a pure render function — no new state ownership.

**Non-Goals:**
- No new download states, progress indicators, or async download flow — the button toggles the same in-memory `ItemStatus` that the existing catalog control already toggles.
- No change to `TabsController` or `LibraryController` APIs.
- No change to how the popover is opened/closed or positioned.

## Decisions

- **Thread `tabs: Entity<TabsController>` into `render_item_popover`** rather than reaching for global/singleton access, consistent with the existing pattern of passing `entity: Entity<LibraryController>` into the same function. Alternative considered: emit a custom event from the popover and let `catalog_view.rs` handle it — rejected as unnecessary indirection when the caller already owns both entities and other buttons in the codebase call controller methods directly from `on_click`.
- **Reuse `Button` from `gpui-component`** (already used for the close button) for both new actions, keeping compact/ghost styling consistent with the popover's existing close button.
- **Download button label/icon is derived from `item.status` at render time** rather than tracked as separate popover state, since `LibraryItem` is passed in fresh on each render and `ItemStatus` is the single source of truth.

## Risks / Trade-offs

- [Widening the popover's action row could push it past `ITEM_POPOVER_WIDTH` on narrow content] → Use compact/ghost button variants and place both actions in a single row with existing gap spacing; width is unaffected since `ITEM_POPOVER_WIDTH` is fixed and buttons wrap within it.
- [Signature change to `render_item_popover` breaks other callers] → Confirmed via reference search that `catalog_view.rs` is the only caller; update it in the same change.
