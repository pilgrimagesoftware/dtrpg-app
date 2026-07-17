## ADDED Requirements

### Requirement: App menu must offer a manual update check
The Rust desktop application's app-level menu SHALL include a "Check for Updates" item that triggers an immediate
fetch and comparison against the published version manifest.

#### Scenario: User selects Check for Updates
- **WHEN** the user selects "Check for Updates" from the app menu
- **THEN** the app fetches the published version manifest and compares it against the running app's version

#### Scenario: Manual check finds no update
- **WHEN** a manual update check completes and the running version is already current
- **THEN** the app presents an acknowledgment that the app is up to date

#### Scenario: Manual check fails
- **WHEN** a manual update check cannot reach or parse the version manifest
- **THEN** the app presents an error acknowledgment rather than silently doing nothing

### Requirement: App must automatically check for updates
The Rust desktop application SHALL automatically check for updates after startup completes and periodically while
the app continues running, without blocking application startup or the UI thread.

#### Scenario: Automatic check on startup
- **WHEN** the app finishes initial session restoration during startup
- **THEN** the app performs an update check in the background without delaying the shell becoming interactive

#### Scenario: Automatic periodic recheck
- **WHEN** the app has been running continuously past the periodic recheck interval since its last check
- **THEN** the app performs another background update check

#### Scenario: Automatic check fails silently
- **WHEN** a background (non-manual) update check cannot reach or parse the version manifest
- **THEN** the app logs the failure and does not present any error notification to the user

### Requirement: Update availability must surface as a dismissible notification banner
When an update check (manual or automatic) determines a newer version is available, the app SHALL present a
dismissible notification banner using the existing notification banner mechanism, offering an action to view or
obtain the update.

#### Scenario: Update is available
- **WHEN** an update check determines the manifest's version is newer than the running app's version
- **THEN** the app displays a notification banner indicating an update is available, with an action to open the
  update location

#### Scenario: User dismisses the update banner
- **WHEN** the user dismisses the update-available notification banner
- **THEN** the banner is hidden for the remainder of the current session without re-fetching or re-comparing

#### Scenario: Nightly build compares against the nightly manifest
- **WHEN** the running app is a nightly build
- **THEN** its update check compares against the nightly channel's published manifest by publish date rather than by
  semantic version
