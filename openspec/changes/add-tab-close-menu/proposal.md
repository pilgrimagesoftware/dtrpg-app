## Why

Closable detail tabs currently only close one at a time via each tab's close button. Users who
open several catalog items during a session (e.g. comparing publishers, browsing a series) have
no way to clear the tab strip in bulk, matching the tab-management conventions already familiar
from VSCode, Zed, and Firefox.

## What Changes

- Add a right-click context menu on closable detail tabs with: Close, Close Others, Close Tabs to
  the Right, Close All.
- Add a "Close Tab" / "Close Other Tabs" / "Close All Tabs" group to the native Window menu,
  operating on the active tab, enabled/disabled based on current tab-strip state.
- Extend `TabsController` with bulk-close operations (`close_tab`, `close_other_tabs`,
  `close_tabs_right_of`, `close_all_detail_tabs`) that always preserve the non-closable catalog
  tab and fall back to activating it if the active tab was closed.
- No changes to tab opening, activation, or the overflow "more" menu.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `shared-main-window-structure`: the tabbed content area requirement is extended to require a
  tab context menu and Window-menu close actions (Close, Close Others, Close Tabs to the Right,
  Close All), operating only on closable detail tabs and always preserving the catalog tab.

## Impact

- Affected code (Rust reference implementation): `crates/dtrpg-ui/src/controllers/tabs.rs`
  (`TabsController` bulk-close methods), `crates/dtrpg-ui/src/ui/views/tab_strip_view.rs` (context
  menu wiring), `crates/dtrpg-ui/src/ui/app/mod.rs` (`build_menus` Window menu additions), i18n
  files (`crates/dtrpg-ui/i18n/*.yaml`) for new menu labels.
- Swift reference implementation: same shared-contract requirements apply when its tab strip is
  implemented; no immediate code change since Swift tabs are not yet built.
- No API or SDK impact. No breaking changes.
