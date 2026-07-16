## ADDED Requirements

### Requirement: Errors are handled gracefully with user-facing and internal messages
The app SHALL handle errors that occur during catalog updates or cache operations (catalog
metadata/cache, downloaded content, cover image cache, avatar image cache) gracefully, with
a clear and concise error message exposed to the user, separate from a more verbose
internal-only log message.

#### Scenario: An error occurs during a catalog or cache operation
- **WHEN** an error occurs during a catalog update or cache operation
- **THEN** the app SHALL display a clear, concise, user-facing error message
- **AND** the app SHALL log a more verbose, internal-only message describing the error

### Requirement: Transient failures are retried with backoff up to a limit
The app SHALL retry a failed catalog or cache operation up to a fixed retry limit, using a
backoff strategy between attempts to avoid overwhelming the server.

#### Scenario: A transient failure is retried
- **WHEN** a catalog or cache operation fails with a transient error and the retry limit has
  not been reached
- **THEN** the app SHALL retry the operation after a backoff delay

#### Scenario: The retry limit is reached
- **WHEN** a catalog or cache operation has failed and been retried up to its retry limit
- **THEN** the app SHALL stop retrying and treat the operation as failed

### Requirement: Retry attempts are logged with number and reason
The app SHALL log the retry number and the reason for the retry with each retry attempt.

#### Scenario: A retry attempt is logged
- **WHEN** the app retries a catalog or cache operation
- **THEN** it SHALL log the retry attempt number and the reason for the retry

### Requirement: Retry number may be shown to the user; retry reason is internal-only
The app MAY expose the current retry number to the user during a retrying operation, but
SHALL NOT expose the retry reason in the user-facing message.

#### Scenario: Retry number is shown during a retrying operation
- **WHEN** the app is retrying a catalog or cache operation and displays progress to the
  user
- **THEN** it MAY include the current retry number in that display
- **AND** it SHALL NOT include the internal retry reason in that display
