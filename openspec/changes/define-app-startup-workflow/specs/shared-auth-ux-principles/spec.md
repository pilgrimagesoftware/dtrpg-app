## ADDED Requirements

### Requirement: Signed-out browsing must remain read-only rather than blocked
When a desktop app cannot establish a session at startup or after sign-out, it MUST keep the
catalog and collections visible and browsable rather than hiding them, while disabling actions
that mutate state.

#### Scenario: User is signed out and browsing the catalog
- **WHEN** a desktop app has no active session
- **THEN** the catalog and collections remain visible for browsing
- **AND** drag-and-drop and add/remove actions on the catalog and collections are disabled

#### Scenario: User avatar is unavailable while signed out
- **WHEN** a desktop app has no active session and therefore no avatar to display
- **THEN** it shows a placeholder avatar image instead of leaving the avatar slot blank
