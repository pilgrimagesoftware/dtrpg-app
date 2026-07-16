## MODIFIED Requirements

### Requirement: Existing last-check timestamp is compared against a staleness threshold
For a resource with a recorded last-check timestamp, the app SHALL compare that timestamp
against the resource's staleness threshold and refresh only when the threshold has elapsed,
or when a cache-control header or query-parameter check indicates the remote data is newer
than the cached data, whichever the resource's refresh policy supports.

#### Scenario: Last check is within the staleness threshold
- **WHEN** the app finds a last-check timestamp for a resource that is within that resource's
  staleness threshold
- **AND** no cache-control or query-parameter check indicates newer remote data
- **THEN** it does not refresh that resource during this check

#### Scenario: Last check is outside the staleness threshold
- **WHEN** the app finds a last-check timestamp for a resource that is outside that resource's
  staleness threshold
- **THEN** it initiates a refresh of that resource

#### Scenario: Cache-control or query-parameter check indicates newer remote data
- **WHEN** the app checks a resource's cache-control headers or update query parameters and
  they indicate the remote data is newer than the cached data
- **THEN** it initiates a refresh of that resource, even if the staleness threshold has not
  yet elapsed

## ADDED Requirements

### Requirement: A recurring timer triggers staleness checks during a long-running session
The app SHALL maintain a recurring timer, independent of the startup sequence, that checks
whether it is "time to refresh" a resource governed by this policy and triggers a refresh
if the resource's staleness threshold has elapsed.

#### Scenario: Long-running session reaches the staleness threshold
- **WHEN** the app has been running long enough that a resource's staleness threshold has
  elapsed since its last check, without the app having been restarted
- **THEN** the recurring timer triggers a refresh of that resource

#### Scenario: Long-running session has not yet reached the staleness threshold
- **WHEN** the recurring timer fires but a resource's staleness threshold has not yet
  elapsed since its last check
- **THEN** the app does not refresh that resource
