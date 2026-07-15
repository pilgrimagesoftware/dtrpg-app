## Context

The Rust reference implementation (`crates/dtrpg-ui`) already has a working tab strip:
`TabsController` (`src/controllers/tabs.rs`) owns `open_tabs: Vec<TabTarget>` and `active:
TabTarget`, with `TabTarget::Catalog` always at index 0 and never closable. `close_detail_tab`
closes a single tab by id and falls back to `TabTarget::Catalog` if the closed tab was active.
`render_tab_strip` (`src/ui/views/tab_strip_view.rs`) renders each tab via `gpui-component`'s
`Tab`/`TabBar`, with a per-tab close `Button` in the suffix slot for detail tabs. The native
Window menu is rebuilt on every tab-state change by `build_menus` (`src/ui/app/mod.rs`), which
already has ten `cmd-<n>` tab-selection actions wired the same way this change's actions need to
be wired (GPUI `actions!` + `MenuItem::action`).

Elsewhere in the codebase, right-click context menus already exist on catalog rows and sidebar
collection rows via `gpui-component`'s `.context_menu(|menu, _, _| menu.item(PopupMenuItem::new
(...).on_click(...)))` builder (see `sidebar_view.rs::render_collection_row`), so this change
reuses that pattern rather than introducing a new one.

## Goals / Non-Goals

**Goals:**
- Bulk-close operations (`close_tab`, `close_other_tabs`, `close_tabs_right_of`,
  `close_all_detail_tabs`) on `TabsController`, each preserving the catalog tab.
- A right-click context menu on detail tabs exposing Close / Close Others / Close Tabs to the
  Right / Close All, targeting the right-clicked tab.
- Window menu items Close Tab / Close Other Tabs / Close All Tabs, targeting the active tab,
  disabled when no detail tabs are open.
- i18n entries for every new label in `en.yaml`, `fr.yaml`, `de.yaml`.

**Non-Goals:**
- Tab reordering, pinning, or drag-to-reorder.
- Changing the catalog tab's non-closable status.
- Swift implementation (no Swift tab strip exists yet; the spec delta applies to both, code
  changes are Rust-only for now).
- Keyboard shortcuts for the new actions beyond what the Window menu natively provides.

## Decisions

**Bulk-close methods live on `TabsController`, not the view layer.** Mirrors the existing
`close_detail_tab` placement: state mutation and the "always preserve Catalog" invariant belong
in the controller, so the view only wires clicks to method calls. Considered doing the filtering
in `tab_strip_view.rs` directly - rejected because the same close-all/close-others logic must
also be reachable from the Window menu (`build_menus` has no access to right-click target, but
does have `TabsSnapshot`), so the logic needs one shared home the controller can expose to both
call sites.

**"Close Tabs to the Right" is positional, based on `open_tabs` order.** `open_tabs` is already
the tab-strip's rendering order (catalog first, detail tabs in open/activation order), so "right
of" is simply "index greater than the target's index in `open_tabs`". No separate ordering model
needed.

**Context menu targets the right-clicked tab; Window menu targets the active tab.** This matches
VSCode/Zed/Firefox: right-click always acts relative to the tab under the cursor, while a global
menu (no per-item context) has no choice but to act on the active tab. `close_other_tabs` and
`close_tabs_right_of` therefore take an explicit target id parameter rather than always reading
`self.active`.

**Reuse `gpui-component`'s `.context_menu()` / `PopupMenuItem` builder on the `Tab` element.**
Same primitive already used for catalog rows and sidebar rows - no new dependency, consistent
look and feel (`Tab` renders as a `div`-backed element supporting `.context_menu`, confirmed via
existing `Tab::new()` usage in `tab_strip_view.rs`).

**Window menu items are new top-level entries under the existing "Select Tab" submenu's parent,
not folded into it.** The `cmd-<n>` submenu is a *selection* list; close actions are a distinct
mutation concern. Keeping them as separate `MenuItem::action` entries (with `.disabled()` when
no detail tabs are open) avoids overloading the numbered submenu with mixed semantics.

## Risks / Trade-offs

- [Window menu closes the *active* tab, but a user might expect "Close Tab" to mean "the last
  tab I right-clicked"] → Matches standard OS menu bar semantics (no notion of a hovered item
  outside a context menu); acceptable, same pattern as browsers/editors.
- [`item_list_tables` cache in `TabsController` must be evicted for every tab a bulk-close
  touches, not just a single id like today] → `close_other_tabs` / `close_tabs_right_of` /
  `close_all_detail_tabs` all route through the same per-id eviction `close_detail_tab` already
  performs, applied per closed tab, so no new eviction path is needed.
- [`TabsChanged` firing once per bulk-close call rather than once per closed tab] → Intentional:
  a single event per bulk operation avoids redundant `build_menus` / tab-strip re-renders.

## Migration Plan

Additive UI change with no persisted state or schema impact. No migration or rollback beyond a
normal revert; existing `close_detail_tab` behavior is unchanged.

## Open Questions

None.
