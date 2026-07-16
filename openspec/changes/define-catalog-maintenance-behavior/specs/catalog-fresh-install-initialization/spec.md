## ADDED Requirements

### Requirement: Fresh install is detected before any catalog initialization begins
The app SHALL treat catalog initialization as a fresh install whenever no local catalog
metadata, downloaded items, or cached content (e.g. cover images) exists, regardless of
whether valid credentials are present.

#### Scenario: No local catalog data present
- **WHEN** the app starts and finds no local catalog metadata, downloaded items, or cached
  content
- **THEN** it treats the session as a fresh install and does not attempt to render a
  catalog until credentials are acquired

### Requirement: Fresh-install initialization does not begin without valid credentials
The app SHALL wait for valid remote-API credentials before making any fresh-install
initialization request.

#### Scenario: Credentials not yet acquired
- **WHEN** a fresh install is detected and no valid credentials are available
- **THEN** the app does not make any remote-API request for catalog initialization

#### Scenario: Credentials become available
- **WHEN** valid credentials are acquired during a fresh-install session
- **THEN** the app proceeds with catalog initialization

### Requirement: Initialization begins with a totals request
The app SHALL make an initial remote-API request to retrieve the user's catalog totals
(total item count and total size) before requesting any item data.

#### Scenario: Totals request precedes item data requests
- **WHEN** fresh-install initialization begins
- **THEN** the app requests catalog totals from the remote API before requesting any page
  of item data

#### Scenario: Totals are used to report progress
- **WHEN** the totals request completes
- **THEN** the app uses the returned total item count and size to communicate initialization
  progress to the user

### Requirement: Item data is fetched in paginated requests
The app SHALL paginate remote-API requests for catalog item data during fresh-install
initialization rather than requesting all item data in a single request.

#### Scenario: Large catalog is fetched across multiple pages
- **WHEN** the user's catalog contains more items than fit in a single page
- **THEN** the app issues multiple paginated requests to retrieve all item data

### Requirement: Catalog view updates in real time as pages arrive
The app SHALL update the local catalog and the catalog view as each page of item data is
received, without waiting for all pages to complete.

#### Scenario: First page renders before later pages arrive
- **WHEN** the first page of item data is received during fresh-install initialization
- **THEN** the app updates the local catalog and catalog view with that page's items before
  the next page is requested or received

### Requirement: Last request time is tracked during fresh-install initialization
The app SHALL record a "last request time" for catalog initialization requests, to be used
to avoid redundant requests and to prevent repeated requests for the same data over short
periods of time.

#### Scenario: Last request time is recorded after a fresh-install request
- **WHEN** the app makes a catalog initialization request to the remote API
- **THEN** it records the current time as the "last request time" for catalog requests
