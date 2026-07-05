## ADDED Requirements

### Requirement: App loads cached catalog data before any network call
On startup, the app SHALL check its destination folder for existing local catalog data and load
it for display before attempting to restore authentication or contact the API.

#### Scenario: Cached catalog data exists
- **WHEN** the app starts and finds existing catalog data in its destination folder
- **THEN** it loads and displays that data before restoring auth or calling the API

#### Scenario: No cached catalog data exists
- **WHEN** the app starts and finds no existing catalog data in its destination folder
- **THEN** it proceeds to restore authentication without displaying stale or placeholder catalog
  content in its place

### Requirement: App restores authentication from the keychain on startup
After loading any cached catalog data, the app SHALL attempt to read stored auth info from the
keychain and use it to authenticate with the API.

#### Scenario: Keychain contains valid auth info
- **WHEN** the app finds auth info in the keychain during startup
- **THEN** it uses that info to authenticate with the API and proceeds as signed in

#### Scenario: Keychain has no auth info
- **WHEN** the app finds no auth info in the keychain during startup
- **THEN** it redirects to the login flow instead of attempting API authentication

### Requirement: Signed-in startup checks catalog and avatar freshness
Once authenticated, the app SHALL check catalog and Gravatar avatar freshness (per the
resource-refresh-scheduling policy) before considering startup complete.

#### Scenario: Startup completes while signed in
- **WHEN** the app finishes authenticating during startup
- **THEN** it runs the catalog freshness check and the Gravatar avatar freshness check as part
  of startup, independently of each other

### Requirement: Signed-out startup shows a read-only, browsable catalog
When the app cannot authenticate at startup, it SHALL show a placeholder avatar image and keep
the catalog and collections visible in a read-only mode.

#### Scenario: Startup completes while signed out
- **WHEN** the app cannot authenticate during startup
- **THEN** it displays a placeholder avatar image, keeps the catalog and collections visible,
  and disables drag-and-drop and add/remove actions on them
