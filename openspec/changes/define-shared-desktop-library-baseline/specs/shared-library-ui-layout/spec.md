## ADDED Requirements

### Requirement: Desktop library baseline layout MUST be shared across language frontends
The app meta-repository MUST define a shared desktop library layout and interaction model that both Rust and Swift frontends implement.

#### Scenario: Opening the library screen in either desktop frontend
- **WHEN** a user opens the library view in the Rust or Swift desktop app
- **THEN** both frontends present the same documented top-level layout regions and baseline interactions

### Requirement: Baseline library states MUST be consistent across frontends
Both desktop frontends MUST implement the same baseline library states for loading, loaded, empty, and recoverable error behavior.

#### Scenario: Library data is loading in both apps
- **WHEN** either frontend begins loading library data in baseline mode
- **THEN** it presents the shared loading behavior defined by the meta-repository

### Requirement: Shared baseline behavior MUST be implementation-neutral
The shared layout and state requirements MUST avoid prescribing language-specific framework details so each frontend can implement them using its native stack.

#### Scenario: Implementing the shared layout in Rust and Swift
- **WHEN** frontend maintainers implement the shared desktop library behavior
- **THEN** they can satisfy the same UX requirements with different language/toolkit-specific implementations
