## Why

The catalog currently shows nothing until every page of library data has been fetched from the API, which can take many seconds for large libraries. Users see a blank or spinner state the entire time when they could be browsing their first page of results immediately.

## What Changes

- The library loading loop emits each page of results to the UI as it arrives instead of collecting all pages and emitting once.
- The catalog view accepts incremental appends to its item list and re-renders after each page.
- The loading indicator remains visible while pages are still being fetched, and clears when the last page arrives.

## Capabilities

### New Capabilities

- `incremental-catalog-population`: The catalog view populates progressively as each SDK page is received, without waiting for all pages to complete.

### Modified Capabilities

## Impact

- `dtrpg-ui`: `LibraryController` (or equivalent loading coordinator) — change from collect-then-emit to emit-per-page.
- `dtrpg-ui`: `CatalogView` / `LibraryView` — must accept and render partial item lists, appending on each update.
- `dtrpg-core`: `RustSdkLibraryService` / `HttpSdkLibraryGateway` — the `list_items` method currently returns all items at once; needs to support streaming or callback-per-page delivery.
- No changes to the SDK HTTP client or API contract.
