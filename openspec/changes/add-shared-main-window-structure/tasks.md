## 1. Shared Structure Spec

- [x] 1.1 Add parent OpenSpec change for shared main-window title bar, sidebar, tabs, and status
      bar behavior
- [x] 1.2 Add `shared-main-window-structure` capability delta spec
- [x] 1.3 Confirm both Swift and Rust desktop apps are in scope for this implementation pass

## 2. Child Implementation Planning

- [ ] 2.1 Create Swift child change in `dtrpg-app/swift` for AppKit/SwiftUI implementation details
- [ ] 2.2 Create Rust child change in `dtrpg-app/rust` for GPUI implementation details, referencing
      the gpui-components gallery demo

## 3. Rollout Coordination

- [ ] 3.1 Confirm Swift and Rust child specs both map all shared required regions (title bar,
      sidebar, tabs, status bar)
- [ ] 3.2 Confirm both frontends verify the catalog tab stays non-closable and reachable regardless
      of open detail tab count
- [ ] 3.3 Confirm both frontends reference existing activity, notification, and account work
      instead of redefining it
