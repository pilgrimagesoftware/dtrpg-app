## Context

The multi-item detail file list is `ItemListDelegate` (`crates/dtrpg-ui/src/ui/views/detail_panel_view.rs`),
a `TableDelegate` with four fixed columns (`item_list_columns`: Name, Type, Size, Status).
`render_td` reads `LibraryItemFile` (`id`, `index`, `name`, `format`, `size_mb`, `downloaded`)
straight from the controller on every render - none of that data requires opening the file.
`LibraryController` already opens and reads zip archives on the render/hover path for the
zip-content-preview feature (`hover_zip_preview`), so there's precedent for per-file archive
reads triggered from this table, but that feature only reads on hover, not on every row's
initial render, and its state is a single `Option<ZipPreviewState>`, not a cache keyed by file.

No PDF or image-metadata crate exists in the dependency tree today. The `zip` crate is already a
dependency (`deflate` feature only).

## Goals / Non-Goals

**Goals:**
- Add an Info column showing PDF page count, Zip file count, or image pixel dimensions.
- Extract each file's metadata once and cache it, so scrolling/re-rendering the table doesn't
  re-open the file.
- Only attempt extraction for downloaded files (the file must exist on disk); undownloaded files
  and unrecognized formats show an em dash via the existing `value_or_dash` convention.
- Keep extraction off the render thread's hot path for anything non-trivial (see Decisions).

**Non-Goals:**
- JPEG "quality" percentage / compression ratio estimation. Standard image crates expose pixel
  dimensions, not the original JPEG quality setting (that's generally unrecoverable after
  encoding without a specialized quantization-table heuristic). This change surfaces dimensions
  for images; true "quality" is dropped from scope pending a concrete need.
  See Open Questions.
- Retroactively backfilling metadata for already-downloaded files beyond simple lazy computation
  on first render.
- Editing or acting on the Info column's value (it is display-only, like Type and Size).
- Zip nested-archive recursion (an Info value is that Zip's direct entry count, matching what
  zip-content-preview already shows).

## Decisions

**Metadata cache lives on `LibraryController`, keyed by `(entry_id, row_ix)`, mirroring the
existing `item_list_tables` cache convention on `TabsController`.** `ItemListDelegate` is
reconstructed per open detail tab and already reads through `self.controller`, so a delegate-local
cache would be lost across delegate rebuilds while the tab stays open; putting it on the
controller (which persists for the app session) means metadata surviving tab close/reopen, same
lifetime as the download status data it's displayed alongside.

**Extraction runs synchronously on first access, not as a background task.** PDF page count and
Zip entry count are metadata reads (a PDF page count is typically a handful of xref/trailer
lookups; a Zip file count is the archive's central directory, already read for
zip-content-preview), not full-content parses, so a synchronous read on first render is
consistent with the existing pattern (`on_disk_file_size` also does synchronous I/O per render,
uncached). If profiling after implementation shows a noticeable stutter on large PDFs, revisit
with a background task + placeholder "…" state - deferred rather than speculatively built now
(YAGNI).

**Image dimensions read via the `image` crate's `image::image_dimensions()`, which reads only
the header, not decodes the full image.** Avoids the cost of full image decode just to show a
`WxH` string.

**PDF page count via a minimal PDF crate (`lopdf` or `pdf`), not a hand-rolled parser.** PDF page
counting via xref tables has enough edge cases (compressed xref streams, linearized PDFs,
malformed trailers from third-party publishers) that a maintained crate is worth the dependency
weight over a bespoke regex/byte-scan approach that will accumulate special-casing.

**Column position: after Status, not before Type.** Info is supplementary detail, not identity
(Name) or primary classification (Type) - matches how Size/Status already read as "more detail"
progressively left to right.

**Unsupported/undownloaded files render an em dash, not a spinner or "N/A" label.** Consistent
with `value_or_dash`'s existing convention elsewhere in this file, so the file list doesn't
introduce a second "empty value" vocabulary.

## Risks / Trade-offs

- [A malformed or truncated PDF/Zip on disk could make extraction fail or panic] → All extraction
  wrapped in `Result`/`Option`-returning helpers; any error falls back to the em-dash display,
  same as unsupported formats. No `unwrap()`/`expect()` on file-derived data.
- [Synchronous first-access read could momentarily block the render thread for a very large PDF]
  → Accepted for this change per the Non-Goals/Decisions above; page-count-only reads on
  well-formed PDFs are cheap in practice (xref lookup, not page content parsing).
- [New dependencies (PDF crate, possibly `image` if not already pulled in transitively) increase
  build time and binary size] → Both are narrowly scoped, actively maintained crates; acceptable
  for the value delivered.
- [Cache never evicts per-file entries when a file is deleted/re-downloaded with different
  content] → Evict the `(entry_id, row_ix)` cache entry in the same place `item_list_tables` is
  evicted (entry close) and additionally whenever a file's `downloaded` flag flips (re-download
  invalidates any prior metadata).

## Migration Plan

Additive UI + dependency change, no persisted schema. No migration or rollback beyond a normal
revert.

## Open Questions

- Should a future iteration attempt JPEG quality estimation (e.g. via quantization-table
  heuristics), or is pixel dimension sufficient for the "quality" signal users need? Left open;
  current scope ships dimensions only.
