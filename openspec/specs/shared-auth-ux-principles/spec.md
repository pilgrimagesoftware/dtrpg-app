## Purpose
Define the shared authentication user experience principles for desktop applications so platform-specific implementations can diverge technically while still presenting consistent session behavior.

## Requirements

### Requirement: Desktop application authentication UX must follow shared principles
The application meta-repository MUST define the common user experience principles that desktop app implementations follow around sign-in, session state, and recovery.

#### Scenario: Designing an authentication flow in a desktop app
- **WHEN** an application implementation introduces or changes authentication UI behavior
- **THEN** that behavior can be evaluated against the shared authentication UX principles

### Requirement: Shared auth UX principles must remain implementation-neutral
The shared authentication UX principles MUST describe desired user-facing behavior without forcing one platform implementation strategy.

#### Scenario: Comparing Swift and Rust desktop implementations
- **WHEN** two desktop app implementations use different platform-specific UI techniques
- **THEN** both can still satisfy the same shared authentication UX expectations
