## Why

The multi-item entry's file list (Name/Type/Size/Status) tells users what a file is and how big
it is, but not what's inside it. A user picking between two PDFs, deciding whether a Zip is worth
downloading, or checking whether a scanned image is print quality has to open the file to find
out. A per-format "Info" summary answers that at a glance.

## What Changes

- Add an "Info" column to the detail tab's multi-item file list, after Size, moving Status to the
  last column.
- For PDF files: show page count.
- For Zip archives: show the number of contained files (reusing the same archive-reading path as
  the existing zip-content-preview hover).
- For image files (JPEG/PNG/etc.): show pixel dimensions (e.g. `1920x1080`).
- For any other format, or for a file not yet downloaded (metadata requires reading file bytes
  that only exist on disk once downloaded): show an em dash, consistent with `value_or_dash`'s
  existing convention.
- Metadata is extracted once per file and cached, not recomputed on every render.

## Capabilities

### New Capabilities

- `catalog-item-file-info-column`: per-format file metadata (PDF page count, Zip file count,
  image dimensions) surfaced as an Info column in the multi-item detail file list.

### Modified Capabilities

(none)

## Impact

- Affected code (Rust reference implementation): `crates/dtrpg-ui/src/ui/views/detail_panel_view.rs`
  (`item_list_columns`, `ItemListDelegate::render_td`), `crates/dtrpg-ui/src/controllers/library.rs`
  (new metadata cache alongside the existing zip-preview archive-reading logic), i18n files
  (`crates/dtrpg-ui/i18n/*.yaml`) for the new column header.
- New dependency: a PDF page-count crate (no PDF parser currently in the dependency tree; `zip`
  is already present for zip-content-preview; image dimension reading can use the `image` crate
  if not already a dependency, or a lightweight header-only dimension reader).
- Swift reference implementation: not affected (its detail tab / file list does not exist yet).
- No API or SDK impact. No breaking changes.
