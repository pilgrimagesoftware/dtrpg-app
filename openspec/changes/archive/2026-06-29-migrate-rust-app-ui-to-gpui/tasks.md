## 1. Rust App Package Setup

- [x] 1.1 Confirm `dtrpg-app/rust` is on the correct implementation branch and ready for app code changes
- [x] 1.2 Create or update the Rust package structure for a desktop executable
- [x] 1.3 Add GPUI and required runtime dependencies using the selected dependency source
- [x] 1.4 Add basic build, run, and test commands to the Rust app documentation

## 2. GPUI Application Shell

- [x] 2.1 Implement GPUI application bootstrap and main window creation
- [x] 2.2 Implement a top-level shell view that hosts application content
- [x] 2.3 Define shell-owned navigation, session presentation, loading, and error state
- [x] 2.4 Add placeholder signed-out, restoring-session, signed-in home, and recovery/error views

## 3. State and Command Boundaries

- [x] 3.1 Define app-level command types for quit, refresh, sign in, sign out, navigation, and retry/recovery
- [x] 3.2 Route GPUI menu, shortcut, toolbar, and view actions through the shared command model
- [x] 3.3 Define domain service traits or adapters consumed by the shell without exposing SDK calls directly to views
- [x] 3.4 Add mock or no-op service implementations for shell validation without live DriveThruRPG credentials

## 4. Shared UX Compatibility

- [x] 4.1 Map Rust shell session states to the shared desktop authentication UX principles
- [x] 4.2 Verify sign-out clears signed-in navigation state before presenting signed-out content
- [x] 4.3 Verify expired-session handling presents a recovery path through shell-level state

## 5. Validation

- [x] 5.1 Add tests for shell state transitions and command routing without launching GPUI windows
- [x] 5.2 Add a compile or smoke validation command for the GPUI executable
- [x] 5.3 Run the Rust app validation commands and record any platform-specific requirements
- [x] 5.4 Update the parent `dtrpg-app` submodule reference only after the Rust app implementation is validated
