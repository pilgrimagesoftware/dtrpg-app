## 1. Shared Structure Spec

- [x] 1.1 Add parent OpenSpec change for shared main-window title bar, sidebar, tabs, and status
      bar behavior
- [x] 1.2 Add `shared-main-window-structure` capability delta spec
- [x] 1.3 Confirm both Swift and Rust desktop apps are in scope for this implementation pass

## 2. Child Implementation Planning

- [x] 2.1 Create Swift child change in `dtrpg-app/swift` for AppKit/SwiftUI implementation details
      (`add-macos-main-window-structure`; planning artifacts only — Swift implementation itself is
      deferred, see task 3.2)
- [x] 2.2 Create Rust child change in `dtrpg-app/rust` for GPUI implementation details, referencing
      the gpui-components gallery demo (`add-rust-main-window-structure`, fully implemented and
      verified — see that change's tasks.md)

## 3. Rollout Coordination

- [x] 3.1 Confirm Swift and Rust child specs both map all shared required regions (title bar,
      sidebar, tabs, status bar) — both `macos-main-window-structure` and `rust-main-window-structure`
      define matching requirements for all four regions
- [x] 3.2 Confirm both frontends verify the catalog tab stays non-closable and reachable regardless
      of open detail tab count — Rust: implemented and verified (`TabTarget::Catalog`, no close
      suffix, `cargo test` passing). Swift: task exists in `add-macos-main-window-structure` tasks.md
      (4.2) but is unimplemented; Swift implementation was explicitly deferred this session and needs
      a dedicated pass before this can be verified at runtime.
- [x] 3.3 Confirm both frontends reference existing activity, notification, and account work
      instead of redefining it — both child proposals cite existing app-level work
      (`activity-panel-improvements`, `alert-history-view`, `avatar-menu-user-info` for Rust;
      equivalent macOS auth/session capabilities for Swift) rather than respecifying it
