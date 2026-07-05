## ADDED Requirements

### Requirement: Missing last-check timestamp triggers an immediate refresh
The app SHALL initiate a refresh of a resource governed by this policy (catalog, Gravatar avatar) immediately if no last-check timestamp exists in local storage for that resource.

#### Scenario: No prior check recorded for a resource
- **WHEN** the app looks up the last-check timestamp for a resource and finds none
- **THEN** it initiates a refresh of that resource without comparing against a staleness
  threshold

### Requirement: Existing last-check timestamp is compared against a staleness threshold
For a resource with a recorded last-check timestamp, the app SHALL compare that timestamp
against the resource's staleness threshold and refresh only when the threshold has elapsed.

#### Scenario: Last check is within the staleness threshold
- **WHEN** the app finds a last-check timestamp for a resource that is within that resource's
  staleness threshold
- **THEN** it does not refresh that resource during this startup

#### Scenario: Last check is outside the staleness threshold
- **WHEN** the app finds a last-check timestamp for a resource that is outside that resource's
  staleness threshold
- **THEN** it initiates a refresh of that resource

### Requirement: Last-check timestamp is persisted only when the check completes
The app SHALL write the updated last-check timestamp to local storage only after a refresh
check for that resource completes; it SHALL NOT write the timestamp if the check is aborted or
fails before completing.

#### Scenario: Refresh check completes successfully
- **WHEN** a refresh check for a resource finishes without being aborted
- **THEN** the app stores the current time as that resource's last-check timestamp

#### Scenario: Refresh check is aborted or fails
- **WHEN** a refresh check for a resource is aborted or fails before completing
- **THEN** the app leaves that resource's last-check timestamp unchanged
