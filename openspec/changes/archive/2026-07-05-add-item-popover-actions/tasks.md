## 1. Popover signature and wiring

- [x] 1.1 Add a `tabs: Entity<TabsController>` parameter to `render_item_popover` in `item_popover_view.rs`
- [x] 1.2 Update the sole call site in `catalog_view.rs` to pass `tabs_entity` into `render_item_popover`

## 2. Download action button

- [x] 2.1 Add a download `Button` in the popover's action row, deriving label/icon from `item.status` (`ItemStatus::Cloud` → "Download"; `ItemStatus::Downloaded` → "Remove Download")
- [x] 2.2 Wire the button's `on_click` to call `LibraryController::toggle_download` with the item's id via the existing `entity` clone
- [x] 2.3 Add i18n keys for both label states and use `t!` for the button text

## 3. Open in detail action button

- [x] 3.1 Add an "Open in Detail" `Button` in the popover's action row
- [x] 3.2 Wire the button's `on_click` to call `TabsController::open_detail_tab` with the item's id and title via the `tabs` entity
- [x] 3.3 Add an i18n key for the button text and use `t!` for the button text

## 4. Verification

- [x] 4.1 Add/update unit or component tests covering: download button label reflects `ItemStatus`, download click toggles status, open-in-detail click activates the detail tab
- [x] 4.2 Run `cargo clippy --all-targets --all-features -- -D warnings` and `cargo fmt --all -- --check`
- [x] 4.3 Run `cargo test --workspace` and confirm no regressions
