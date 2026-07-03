## Context

Currently `LibraryService::list_items()` collects all pages from the API before returning
a single `Vec<LibraryItem>`. `LibraryController` spawns this call on the background executor
and only calls `apply_load_result` — and therefore only emits `LibraryChanged` — once, after
the final page arrives.

For a library of several hundred items (10+ pages at 100 items/page), this means the user
sees nothing in the catalog for several seconds.

## Goals / Non-Goals

**Goals:**
- Emit `LibraryChanged` after each API page so the catalog populates progressively.
- Keep `LibraryService` as the service boundary; `LibraryController` must not call the SDK directly.
- No breaking change to the existing `list_items()` method (stubs and tests remain unmodified).

**Non-Goals:**
- Changing the SDK's `LibraryClient` or HTTP layer.
- Streaming at the HTTP level (chunked transfer).
- Reordering items mid-load or handling deduplication across pages.

## Decisions

### Decision: Extend `LibraryService` with a paged callback method

Add a new method to the `LibraryService` trait:

```rust
fn list_items_paged(
    &self,
    on_page: &mut dyn FnMut(Vec<LibraryItem>),
) -> Result<(), LibraryServiceError>;
```

Provide a blanket default implementation that calls the existing `list_items()` once and
invokes the callback with the full result, so stubs and test implementations inherit it
without any change.

`RustSdkLibraryService` overrides this method to loop through pages and call `on_page` after
each page is mapped, while accumulating publisher lookup data across pages.

**Why callback over iterator:** A `-> impl Iterator` return would require `Self: 'static` or
lifetime bounds that conflict with the trait object pattern (`Box<dyn LibraryService>`). A
`&mut dyn FnMut` avoids those constraints and integrates naturally with the channel approach below.

**Why not change `list_items`:** Preserves the existing tests and stubs without modification.
Adding a method with a default is backwards-compatible.

### Decision: Channel-based producer/consumer between background thread and async task

`LibraryController::new` currently runs the service call in
`background_executor().spawn(async move { service_arc.list_items() })` and awaits the result.

Replace this with a `std::sync::mpsc::channel` that bridges the blocking background thread to
the GPUI async context:

```
background thread (blocking):
    service.list_items_paged(|page_items| { tx.send(page_items).ok(); })

async task (GPUI spawn):
    while let Ok(page_items) = rx.recv_async() {  // or wrapped in spawn_blocking
        this.update(async_cx, |ctrl, cx| ctrl.append_catalog_page(page_items, cx)).ok();
    }
    // after channel closes, handle final result / error
```

The channel is `std::sync::mpsc` (bounded or unbounded) since the producer runs on a blocking
thread and the consumer is an async GPUI task.

**Why not `tokio::sync::mpsc`:** The producer runs in `background_executor().spawn(async move
{})` which is not a tokio context; `std::sync::mpsc::Sender::send` is the safe choice.

### Decision: Add `append_catalog_page` to `LibraryController`

A new method on `LibraryController` receives a batch of items, appends them to `self.catalog`,
recomputes `section_counts` and `publishers`, and emits `LibraryChanged`. This is the per-page
analogue of the existing `apply_load_result`.

## Risks / Trade-offs

- **Sidebar counts flicker during load**: `section_counts` and the publisher list are recomputed
  after each page, so numbers visible in the sidebar increase as data arrives. This is acceptable
  and expected behaviour; the alternative (hiding counts until full load) is worse UX.
  → Mitigation: none needed; live counts are the desired outcome.

- **Publisher name resolution across pages**: Each page may include an `included` block with
  publisher data. The mapping from publisher id to name must be accumulated across pages so that
  items on later pages resolve correctly.
  → Mitigation: `RustSdkLibraryService::list_items_paged` maintains a running publisher lookup
  and re-maps items from each page using the union of all publishers seen so far.

- **`section_counts` / `publishers` recomputed from full catalog each page**: Rebuilding from
  scratch each page is O(n) where n grows with each page. For typical library sizes (< 5,000
  items) this is negligible.
  → Mitigation: none needed at current scale.

## Migration Plan

1. Add `list_items_paged` with default impl to `LibraryService` trait.
2. Override in `RustSdkLibraryService` (move the pagination loop there).
3. Add `append_catalog_page` to `LibraryController`.
4. Replace the background task in `LibraryController::new` with the channel-based pattern.
5. Run all existing tests — they use `list_items()` / `FakeSdkGateway` and are unaffected.

## Open Questions

- Should `list_items_paged` propagate a partial-success result if some pages succeed and then
  one fails? Current design: return `Err` after the channel closes, which means items already
  appended remain visible. Verify this is acceptable behaviour before implementing.
