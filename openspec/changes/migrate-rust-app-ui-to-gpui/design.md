## Context

The Rust app submodule exists as the target for a Rust desktop application, but it does not yet expose a complete application shell. The app meta-repository already owns shared desktop UX principles, so the GPUI migration should define Rust-specific UI infrastructure without redefining cross-platform product behavior.

GPUI becomes the Rust app's primary UI framework. The design must account for GPUI's application/window lifecycle, state-driven view rendering, command handling, async work, and dependency boundaries with the DriveThruRPG SDK/API layers.

## Goals / Non-Goals

**Goals:**
- Establish a GPUI-based Rust application shell that can start, open a main window, and host product workflows.
- Keep GPUI rendering code separate from DriveThruRPG domain state, SDK calls, and persistence concerns.
- Define where app commands, session state, navigation state, and async task coordination live.
- Preserve compatibility with shared desktop auth UX principles as authentication screens are added.
- Make future UI work additive by giving views a stable shell, state, and command architecture.

**Non-Goals:**
- Implement full marketplace browsing, library management, downloads, or account workflows.
- Define new DriveThruRPG API contract behavior.
- Define SDK behavior beyond the interfaces the app consumes.
- Require the Swift desktop app to adopt GPUI or mirror Rust implementation details.

## Decisions

Use GPUI as the Rust app's only primary UI toolkit.
Rationale: this keeps rendering, window lifecycle, and input handling in one framework and avoids building an abstraction over multiple desktop toolkits before the app has product workflows. Alternative considered: keep the toolkit undecided until more screens exist. That would make early app shell work disposable and delay architectural decisions that every screen depends on.

Create a thin GPUI shell around domain-owned application state.
Rationale: GPUI views should render state and emit commands, while domain services handle API/SDK operations, auth/session transitions, and persistence. Alternative considered: let GPUI view models call SDK APIs directly. That is faster initially but couples product behavior to the rendering framework and makes future testing harder.

Introduce explicit application command routing.
Rationale: menu items, keyboard shortcuts, toolbar actions, and view-local controls need a consistent path into domain actions. Commands should translate UI intent into domain requests without embedding SDK details in view code. Alternative considered: local callbacks per view. That works for isolated screens but becomes inconsistent once navigation, auth, and long-running tasks interact.

Model navigation and session state as shell-level concerns.
Rationale: the main window must be able to switch between signed-out, restoring-session, signed-in, and recovery states without each feature screen re-implementing those transitions. Alternative considered: each workflow owns its own auth checks. That risks divergent behavior and conflicts with shared desktop auth UX principles.

Keep GPUI dependency setup local to `dtrpg-app/rust`.
Rationale: the app meta-repository should describe the capability, but dependency changes belong in the Rust app implementation repository. Parent repository changes should only advance submodule pointers after the Rust app change is implemented and validated.

## Risks / Trade-offs

- GPUI API maturity or distribution changes -> Mitigation: isolate direct GPUI usage behind the app shell and avoid leaking GPUI types into domain services.
- Early shell abstractions may be too broad -> Mitigation: implement only the shell, command, navigation, and state boundaries needed by the first screens.
- Async SDK work may block or complicate rendering -> Mitigation: route long-running operations through task services that publish state changes back to the UI layer.
- Cross-app UX drift with the Swift app -> Mitigation: keep shared UX requirements in the app meta-repository and validate Rust auth/session screens against them.

## Migration Plan

1. Create the Rust app package structure needed for a GPUI desktop executable.
2. Add GPUI and runtime dependencies in `dtrpg-app/rust`.
3. Implement the application bootstrap, main window, top-level shell view, and app state container.
4. Add command routing for app-level actions such as quit, refresh, sign in, sign out, and navigation.
5. Add placeholder signed-out, loading/restoring, signed-in home, and error/recovery views that exercise state transitions.
6. Wire domain service traits or adapters without requiring live DriveThruRPG API calls for shell validation.
7. Add build and smoke-test coverage that verifies the GPUI executable compiles and the shell can initialize.

Rollback is handled by reverting the Rust app implementation change before advancing the parent `dtrpg-app` submodule reference. Once GPUI-backed screens ship, moving away from GPUI requires a new OpenSpec change because this proposal makes GPUI the Rust app's primary UI framework.

## Open Questions

- Should GPUI be consumed from a crates.io release, a Git dependency, or a workspace-pinned fork when implementation starts?
- Which Rust SDK package should the app consume first once shell-level service adapters are ready?
- Which operating systems are required for the initial Rust GPUI app validation beyond macOS developer builds?
