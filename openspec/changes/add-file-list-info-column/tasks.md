## 1. Dependencies

- [x] 1.1 Add a PDF page-count crate (e.g. `lopdf`) to `crates/dtrpg-ui/Cargo.toml`, pinned to
      its current latest stable version.
- [x] 1.2 Add the `image` crate (or confirm it's already a transitive dependency at a usable
      version) for `image::image_dimensions()`.

## 2. Metadata extraction

- [x] 2.1 Add a `FileInfo` enum/type (e.g. `FileInfo::PageCount(u32)`,
      `FileInfo::ContainedFiles(u32)`, `FileInfo::Dimensions(u32, u32)`, `FileInfo::None`) and a
      `Display`-style formatter producing the column's text (`"42 pages"`, `"12 files"`,
      `"1920x1080"`).
- [x] 2.2 Add `extract_pdf_page_count(path: &Path) -> Option<u32>`, `extract_zip_file_count(path:
      &Path) -> Option<u32>` (reusing the archive-opening approach already used by
      `hover_zip_preview`'s zip-content-preview path), and `extract_image_dimensions(path: &Path)
      -> Option<(u32, u32)>`. Each returns `None` on any I/O or parse error - no panics on
      malformed file content.
- [x] 2.3 Add a format-dispatch function `compute_file_info(path: &Path, format: &str) ->
      FileInfo` that routes by `LibraryItemFile::format` to the right extractor, returning
      `FileInfo::None` for unrecognized formats.

## 3. Caching on `LibraryController`

- [x] 3.1 Add a `file_info_cache: HashMap<(Arc<str>, usize), FileInfo>` field to
      `LibraryController`, keyed by `(entry_id, row_ix)`.
- [x] 3.2 Add `LibraryController::file_info(&mut self, entry_id: &Arc<str>, row_ix: usize) ->
      FileInfo`: returns the cached value if present; otherwise, if the file is downloaded,
      resolves its on-disk path (mirroring `on_disk_file_size`'s path resolution), calls
      `compute_file_info`, caches, and returns the result; returns `FileInfo::None` immediately
      for undownloaded files without touching the cache.
- [x] 3.3 Invalidate the cache entry for `(entry_id, row_ix)` wherever a file's `downloaded` flag
      transitions (re-download start/completion), alongside existing per-file state resets.

## 4. UI: Info column

- [x] 4.1 Add an `"info"` column to `item_list_columns()` in `detail_panel_view.rs`, positioned
      after `"status"`, using a new i18n key for its header label.
- [x] 4.2 Extend `ItemListDelegate::render_td`'s `match col_ix` with a new arm (col_ix 4) that
      calls `LibraryController::file_info` and renders the formatted string via
      `value_or_dash`-style em-dash fallback for `FileInfo::None`, matching the existing cell
      styling (font family, text color) used by the Type/Size columns.
- [x] 4.3 Update `ItemListDelegate::columns_count` to reflect the new column count. (Derived
      automatically from `self.columns.len()`, which now includes the new "info" column added in
      4.1 — no separate code change needed.)

## 5. i18n

- [x] 5.1 Add `detail.item_list_column_info` header key to `en.yaml`.
- [x] 5.2 Add matching translations to `fr.yaml` and `de.yaml`.

## 6. Verification

- [x] 6.1 Unit tests for `extract_pdf_page_count`, `extract_zip_file_count`, and
      `extract_image_dimensions` against small fixture files (valid PDF/Zip/PNG, plus a
      truncated/corrupt variant of each asserting `None`, not a panic).
- [x] 6.2 Unit test for `LibraryController::file_info` caching: verify a second call for the same
      `(entry_id, row_ix)` does not re-invoke extraction (e.g. by asserting on call count via a
      test seam, or by deleting the underlying file between calls and asserting the cached value
      still returns).
- [x] 6.3 `cargo test --workspace`, `cargo clippy --all-targets --all-features -- -D warnings`,
      `cargo +nightly fmt --all -- --check`.
- [ ] 6.4 Manual check (left to the user): open a multi-item entry with a downloaded PDF, Zip,
      and image file, verify the Info column against the scenarios in
      `specs/catalog-item-file-info-column/spec.md`.
