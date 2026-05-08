## Why

The Rust desktop app needs a concrete UI foundation before product workflows can be implemented. GPUI, the Rust UI framework used by Zed, provides a native-feeling, high-performance Rust-first path that keeps the application layer aligned with the rest of the Rust implementation.

## What Changes

- Establish GPUI as the required UI framework for the Rust desktop application.
- Define the Rust app shell responsibilities, including window startup, top-level layout, command routing, and shared application state boundaries.
- Require the UI layer to isolate DriveThruRPG domain workflows from GPUI-specific rendering code.
- Require authentication and session-facing screens to remain compatible with the existing shared desktop auth UX principles.
- Remove any future expectation that the Rust app may choose another primary UI toolkit without a follow-up OpenSpec change.

## Capabilities

### New Capabilities
- `rust-app-gpui-shell`: Defines the GPUI-based Rust desktop application shell and UI-layer boundaries.

### Modified Capabilities
- None.

## Impact

- `dtrpg-app/rust`: Adds or restructures the Rust desktop app around GPUI.
- Rust dependencies: Adds GPUI and supporting application/runtime crates needed by the shell.
- Application architecture: Introduces UI/domain separation so GPUI views do not directly own API or SDK behavior.
- Desktop UX: Rust app screens must continue to satisfy shared app-level UX expectations, including auth/session flows.
