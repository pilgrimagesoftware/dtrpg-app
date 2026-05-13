## ADDED Requirements

### Requirement: Desktop backend integration behavior MUST be shared across language frontends
The app meta-repository MUST define shared user-visible backend integration behavior for library loading, refresh, and detail retrieval across Rust and Swift desktop frontends.

#### Scenario: Refreshing library data in either desktop app
- **WHEN** a user requests a refresh in Rust or Swift frontend
- **THEN** both frontends follow the same documented request lifecycle and resulting view-state behavior

### Requirement: Backend and session failures MUST map to shared recovery behavior
Both desktop frontends MUST map backend, transport, and session-aware failures into shared recoverable application states and actions.

#### Scenario: Backend call fails during library load
- **WHEN** either frontend receives a backend or session-related failure
- **THEN** it presents the documented recovery behavior and action flow defined by shared desktop specs

### Requirement: Shared integration behavior MUST remain implementation-neutral
The shared backend integration requirements MUST describe product behavior outcomes without prescribing language-specific SDK adapter implementation details.

#### Scenario: Implementing backend adapters in Rust and Swift
- **WHEN** maintainers implement SDK-backed adapters in each frontend
- **THEN** both can satisfy the same shared integration behavior using language-native implementation techniques
