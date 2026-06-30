## ADDED Requirements

### Requirement: Rust app UI layer must use GPUI
The Rust desktop application MUST use GPUI as its primary UI framework for application startup, window management, view rendering, input handling, and app-level command dispatch.

#### Scenario: Starting the Rust desktop app
- **WHEN** the Rust desktop executable starts
- **THEN** it initializes a GPUI application and opens the main application window through GPUI

#### Scenario: Adding new Rust app screens
- **WHEN** a new user-facing screen is added to the Rust desktop application
- **THEN** the screen is implemented as part of the GPUI view hierarchy

### Requirement: Rust app shell must own top-level UI state
The Rust desktop application MUST define a shell-level state model that owns top-level navigation, session presentation state, loading/error state, and command routing.

#### Scenario: Restoring a saved session
- **WHEN** the application is checking for an existing user session during startup
- **THEN** the GPUI shell presents a restoring or loading state before showing signed-in or signed-out content

#### Scenario: Routing an app command
- **WHEN** a menu item, shortcut, toolbar action, or view control triggers an app-level action
- **THEN** the GPUI shell routes that command through the shared command model rather than handling it as ad hoc view-local behavior

### Requirement: GPUI views must remain separate from domain services
The Rust desktop application MUST keep GPUI view code separate from DriveThruRPG API, SDK, persistence, and business workflow logic.

#### Scenario: A view needs DriveThruRPG data
- **WHEN** a GPUI view needs data from the DriveThruRPG API or SDK
- **THEN** it requests that work through an application state, command, or service boundary instead of directly owning API calls

#### Scenario: Testing domain behavior
- **WHEN** domain behavior is tested without launching the desktop UI
- **THEN** the behavior can be exercised without constructing GPUI views or windows

### Requirement: Rust app auth UI must follow shared desktop UX principles
The Rust GPUI shell MUST preserve the app meta-repository's shared desktop authentication UX principles for sign-in, session state, and recovery flows.

#### Scenario: Session expires while the app is open
- **WHEN** the Rust app detects that a user session has expired
- **THEN** the GPUI shell presents a recovery path consistent with the shared desktop authentication UX principles

#### Scenario: User signs out
- **WHEN** the user signs out from the Rust app
- **THEN** the GPUI shell clears signed-in navigation state and presents signed-out content consistently with shared desktop authentication UX principles

### Requirement: Rust app shell must be build-verifiable
The Rust desktop application MUST include validation that the GPUI shell compiles and can initialize its app-level state without requiring live DriveThruRPG credentials.

#### Scenario: Running implementation validation
- **WHEN** the Rust app validation command runs in development or CI
- **THEN** it verifies the GPUI shell and app-level state setup without making live DriveThruRPG API calls
