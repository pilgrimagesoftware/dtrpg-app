## ADDED Requirements

### Requirement: Background activity uses work queues
The app SHALL perform all background catalog, download, and cache activity through work
queues rather than unmanaged ad hoc background execution, so that tasks execute in order,
execute concurrently where appropriate, the UI remains responsive, and remote resources are
not overloaded by too many concurrent requests.

#### Scenario: Background task is queued rather than run directly
- **WHEN** the app needs to perform catalog synchronization, a content download, or a cache
  update in the background
- **THEN** it submits that task to the appropriate work queue rather than executing it
  directly on the calling thread

### Requirement: Background work runs on threads and executors, not the UI thread
The app SHALL use threads and executors to perform background tasks concurrently, and SHALL
NOT block the UI thread while background work is in progress.

#### Scenario: Background task executes while the UI remains responsive
- **WHEN** a background task is running
- **THEN** the UI SHALL remain responsive to user interaction

### Requirement: Catalog updates and synchronization use a serial queue
The app SHALL use a serial queue for catalog updates and synchronization with the remote
API, so that catalog updates are applied consistently and in the correct order.

#### Scenario: Two catalog sync tasks are queued in sequence
- **WHEN** two catalog update or synchronization tasks are submitted
- **THEN** the second task SHALL NOT begin execution until the first has completed

### Requirement: Content downloads use a separate queue with independent concurrency
The app SHALL use a separate queue for content downloads, with its own thread pool and
concurrency settings independent of the catalog synchronization queue.

#### Scenario: A content download does not block catalog synchronization
- **WHEN** a content download is in progress
- **THEN** a catalog update or synchronization task SHALL still be able to execute
  concurrently on the catalog synchronization queue

#### Scenario: Multiple downloads run concurrently within download-queue limits
- **WHEN** multiple content downloads are queued
- **THEN** the download queue SHALL execute them according to its own configured
  concurrency settings, independent of the catalog synchronization queue's settings

### Requirement: Other background tasks use additional queues as needed
The app SHALL use additional work queues, separate from the catalog synchronization and
download queues, for other background tasks such as cover image or avatar image caching,
when those tasks warrant independent ordering or concurrency control.

#### Scenario: Cover or avatar image caching runs independently of catalog sync and downloads
- **WHEN** a cover image or avatar image cache task is queued
- **THEN** it SHALL execute on a queue distinct from the catalog synchronization queue and
  the download queue
