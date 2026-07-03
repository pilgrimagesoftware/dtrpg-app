## 1. Extend LibraryService trait

- [x] 1.1 Add `list_items_paged(&self, on_page: &mut dyn FnMut(Vec<LibraryItem>)) -> Result<(), LibraryServiceError>` to `LibraryService` in `dtrpg-ui/src/services/mod.rs`
- [x] 1.2 Provide a default implementation that calls `self.list_items()` and invokes `on_page` once with the result

## 2. Override in RustSdkLibraryService

- [x] 2.1 Override `list_items_paged` in `RustSdkLibraryService` (in `dtrpg-core/src/services/sdk.rs`)
- [x] 2.2 Move the pagination loop (currently in `list_items`) into `list_items_paged`, calling `on_page` after mapping each page's items
- [x] 2.3 Accumulate publisher lookup across all pages so items on later pages resolve publisher names correctly
- [x] 2.4 Keep `list_items` working as-is (call `list_items_paged` internally, or keep the loop duplicated — whichever is cleaner)

## 3. Add per-page append to LibraryController

- [x] 3.1 Add `append_catalog_page(items: Vec<LibraryItem>, cx: &mut Context<Self>)` to `LibraryController` in `dtrpg-ui/src/controllers/library.rs`
- [x] 3.2 In `append_catalog_page`: extend `self.catalog`, recompute `section_counts` and `publishers`, emit `LibraryChanged`

## 4. Replace background task with channel-based incremental loading

- [x] 4.1 In `LibraryController::new`, replace the single-shot `background_executor().spawn` pattern with a `std::sync::mpsc::channel`
- [x] 4.2 Spawn the service call on the background executor with `list_items_paged`, sending each page through the channel's sender
- [x] 4.3 In the async GPUI task, receive pages from the channel and call `append_catalog_page` for each one
- [x] 4.4 After the channel closes, handle the terminal result (completion or error) by updating the activity indicator

## 5. Verify correctness

- [x] 5.1 Run `cargo test --all-features --workspace` and confirm all existing tests pass
- [x] 5.2 Confirm the `TwoPageGateway` test in `sdk.rs` still passes (or adapt it to the new signature)
- [x] 5.3 Manually run the app and confirm the catalog populates with items before the load completes
