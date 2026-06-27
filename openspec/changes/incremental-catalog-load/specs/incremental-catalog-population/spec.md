## ADDED Requirements

### Requirement: Catalog populates progressively from each received page
The system SHALL append items to the catalog view after each page of library data is
received from the API, without waiting for all pages to finish loading.

#### Scenario: First page renders immediately
- **WHEN** the background catalog load receives its first page of results
- **THEN** those items SHALL appear in the catalog view within one render cycle

#### Scenario: Subsequent pages append to existing items
- **WHEN** the background catalog load receives a page after the first
- **THEN** the new items SHALL be appended to the existing catalog without clearing it
- **AND** the loading indicator SHALL remain visible

#### Scenario: Final page completes the load
- **WHEN** the background catalog load receives a page with no `next` link
- **THEN** all remaining items from that page SHALL be appended to the catalog
- **AND** the loading indicator SHALL be dismissed

#### Scenario: Error during multi-page load
- **WHEN** a page request fails after at least one page has already loaded
- **THEN** the items already in the catalog SHALL remain visible
- **AND** the activity panel SHALL display the error

### Requirement: Loading indicator remains active during pagination
The system SHALL keep the catalog in a loading state while pages are still being fetched,
and SHALL transition to the loaded state only after the final page is received.

#### Scenario: Loading indicator persists across pages
- **WHEN** the first page has been received and more pages remain
- **THEN** the activity panel loading indicator SHALL still be active

#### Scenario: Loading indicator clears on completion
- **WHEN** the last page has been received and appended
- **THEN** the activity panel loading indicator SHALL be dismissed
