## ADDED Requirements

### Requirement: Shared main-window layout MUST define required regions
The app meta-repository MUST define shared main-window regions for desktop library browsing, including search/filter controls, account access, library content, view summary, and sync status.

#### Scenario: Mapping the umbrella layout into app repositories
- **WHEN** a child desktop app implements the main library window
- **THEN** it can identify the shared search/filter, account, content, summary, and sync-status regions it must provide

### Requirement: Shared browsing state MUST be presentation-independent
The shared desktop library behavior MUST treat search text, filters, view mode, grouping, sorting, and summary counts as one browsing state that survives switching between list/tree and grid presentation.

#### Scenario: Switching library presentation modes
- **WHEN** the user changes between list, tree, and grid presentations
- **THEN** the app preserves the same filtered and sorted library result set and updates only presentation-specific layout

### Requirement: Shared account behavior MUST avoid passive token disclosure
The shared desktop account menu behavior MUST expose account identity, token status, token set/reset actions, and settings access without passively displaying raw access-token values.

#### Scenario: Inspecting account menu state
- **WHEN** the user opens the account menu outside an explicit token edit flow
- **THEN** the menu shows account and token status information without showing raw token values

### Requirement: Shared sync behavior MUST remain non-blocking
The shared desktop library behavior MUST require update and sync work to run without blocking main-window interaction.

#### Scenario: Sync activity occurs while browsing
- **WHEN** the library is syncing or updating in the background
- **THEN** the user can continue interacting with library browsing controls and visible content

### Requirement: Shared thumbnail behavior MUST be asynchronous
The shared desktop grid behavior MUST allow thumbnail images to load asynchronously while preserving usable title and size information.

#### Scenario: Thumbnail is missing or still loading
- **WHEN** a grid item has no thumbnail available yet
- **THEN** the grid still displays the item title and size information without blocking the rest of the library view
