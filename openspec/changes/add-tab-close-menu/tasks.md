## 1. Controller: bulk-close operations

- [ ] 1.1 Add `TabsController::close_tab(&mut self, id: &str, cx)` as a thin rename-preserving
      wrapper (or reuse) of the existing `close_detail_tab`, so all four operations share one
      name convention.
- [ ] 1.2 Add `TabsController::close_other_tabs(&mut self, keep_id: &str, cx)`: retains
      `TabTarget::Catalog` and the detail tab matching `keep_id`, closes all other detail tabs,
      evicts their `titles`/`item_list_tables` entries, activates `keep_id`'s tab, emits
      `TabsChanged` once.
- [ ] 1.3 Add `TabsController::close_tabs_right_of(&mut self, id: &str, cx)`: closes every detail
      tab whose index in `open_tabs` is greater than `id`'s index, evicts their cache entries,
      falls back to `TabTarget::Catalog` only if the active tab was among those closed, emits
      `TabsChanged` once.
- [ ] 1.4 Add `TabsController::close_all_detail_tabs(&mut self, cx)`: closes every detail tab,
      evicts all cache entries, sets active to `TabTarget::Catalog`, emits `TabsChanged` once.
- [ ] 1.5 Unit tests in `tabs.rs`'s `#[cfg(test)] mod tests`: each new method against a
      controller with 3+ open detail tabs, covering closing the active tab, closing a
      non-active tab, and the already-only-catalog-tab no-op case.

## 2. Tab strip: right-click context menu

- [ ] 2.1 In `tab_strip_view.rs`, add `.context_menu(...)` to each closable detail `Tab`,
      building a `PopupMenu` with Close / Close Others / Close Tabs to the Right / Close All
      items (`PopupMenuItem`, same pattern as `sidebar_view.rs::render_collection_row`), each
      `on_click` calling the corresponding `TabsController` method with that tab's id.
- [ ] 2.2 Disable/omit "Close Tabs to the Right" when the target tab is the last one in
      `open_tabs`, and "Close Others" when it is the only open detail tab.

## 3. Window menu: close actions

- [ ] 3.1 Add `CloseTab`, `CloseOtherTabs`, `CloseAllTabs` to the `actions!(libri, [...])` block
      in `ui/actions.rs`, alongside the existing `SelectTab*` actions.
- [ ] 3.2 In `build_menus` (`ui/app/mod.rs`), add these three items to the Window menu (new
      group, separate from the "Select Tab" submenu), each `.disabled()` when
      `tabs.open_tabs.len() <= 1` (only the catalog tab open).
- [ ] 3.3 In `root_view.rs`, wire `on_action` handlers for `CloseTab` (closes
      `tabs.snapshot().active` if it's a `TabTarget::Detail`, no-op on `Catalog`),
      `CloseOtherTabs`, and `CloseAllTabs`, following the existing `SelectTab0`..`SelectTab9`
      handler pattern.
- [ ] 3.4 Add `KeyBinding`s only if there is an established OS convention worth matching
      (e.g. none required beyond what the menu provides) - otherwise skip, per design's
      non-goals.

## 4. i18n

- [ ] 4.1 Add `tabs.close`, `tabs.close_others`, `tabs.close_tabs_right`, `tabs.close_all` keys
      (context menu labels) and `menu.window_close_tab`, `menu.window_close_other_tabs`,
      `menu.window_close_all_tabs` keys (Window menu labels) to `en.yaml`.
- [ ] 4.2 Add matching translations to `fr.yaml` and `de.yaml`.

## 5. Verification

- [ ] 5.1 `cargo test --workspace` covering the new `TabsController` unit tests.
- [ ] 5.2 `cargo clippy --all-targets --all-features -- -D warnings` and `cargo +nightly fmt --all
      -- --check`.
- [ ] 5.3 Manual check (left to the user): open several detail tabs, verify each context-menu
      item and each Window-menu item against the scenarios in
      `specs/shared-main-window-structure/spec.md`.
