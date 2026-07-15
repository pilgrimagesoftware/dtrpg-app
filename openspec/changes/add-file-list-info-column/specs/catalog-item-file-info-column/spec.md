## ADDED Requirements

### Requirement: Multi-item file list MUST show a per-format Info column
The multi-item detail file list MUST include an Info column, positioned after Status, showing a
per-format metadata summary: page count for PDF files, contained file count for Zip archives,
and pixel dimensions for image files. Formats without a defined Info value, and files not yet
downloaded, MUST show an em dash rather than an error or blank cell.

#### Scenario: PDF file shows page count
- **WHEN** a downloaded file's format is PDF
- **THEN** the Info column shows that PDF's page count

#### Scenario: Zip file shows contained file count
- **WHEN** a downloaded file's format is Zip
- **THEN** the Info column shows the number of files contained in the archive

#### Scenario: Image file shows pixel dimensions
- **WHEN** a downloaded file's format is an image format (e.g. JPEG, PNG)
- **THEN** the Info column shows the image's pixel dimensions as `<width>x<height>`

#### Scenario: Unsupported format shows an em dash
- **WHEN** a downloaded file's format has no defined Info extraction (e.g. an unrecognized or
  text-based format)
- **THEN** the Info column shows an em dash

#### Scenario: Undownloaded file shows an em dash
- **WHEN** a file has not yet been downloaded to disk
- **THEN** the Info column shows an em dash, regardless of format

#### Scenario: Malformed file falls back to an em dash
- **WHEN** a downloaded file's format matches a supported Info extraction but the file's content
  cannot be parsed (corrupt or truncated PDF/Zip/image)
- **THEN** the Info column shows an em dash rather than an error state

### Requirement: File Info metadata MUST be cached after first extraction
Once a file's Info value has been computed, the system MUST reuse the cached value on subsequent
renders of the same file rather than re-reading the file from disk, and MUST invalidate the cache
entry if that file is re-downloaded.

#### Scenario: Re-rendering the file list does not re-read the file
- **WHEN** a file's Info value has already been computed and the file list is scrolled or
  re-rendered without the underlying file changing
- **THEN** the cached Info value is reused without re-opening the file

#### Scenario: Re-downloading a file invalidates its cached Info value
- **WHEN** a file that already has a cached Info value is re-downloaded
- **THEN** the cached value is discarded and recomputed the next time the file list renders that
  row
