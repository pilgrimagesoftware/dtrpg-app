## 1. Shared Layout Spec

- [x] 1.1 Add parent OpenSpec change for shared main-window library layout behavior
- [x] 1.2 Add `shared-main-window-library-layout` capability delta spec
- [x] 1.3 Confirm both Swift and Rust desktop apps are in scope for the first implementation pass

## 2. Child Implementation Planning

- [x] 2.1 Create Swift child change in `dtrpg-app/swift` for AppKit implementation details
- [x] 2.2 Create Rust child change in `dtrpg-app/rust` for GPUI implementation details

## 3. Rollout Coordination

- [ ] 3.1 Confirm Swift and Rust child specs both map all shared required regions
- [ ] 3.2 Confirm both frontends verify non-blocking sync and passive token-hiding behavior before declaring layout complete
