## 1. Shared Spec

- [x] 1.1 Add `shared-catalog-entry-detail-view` capability delta spec
- [x] 1.2 Add `shared-main-window-structure` delta clarifying popover vs. expanded-tab scope
- [x] 1.3 Confirm both Swift and Rust desktop apps are in scope for the first implementation pass

## 2. Child Implementation Planning

- [ ] 2.1 Create Swift child change in `dtrpg-app/swift` for AppKit expanded-tab detail view implementation
- [ ] 2.2 Create Rust child change in `dtrpg-app/rust` for GPUI expanded-tab detail view implementation

## 3. Rollout Coordination

- [ ] 3.1 Confirm Swift and Rust child specs both map entry tier, item tier, item list, and ephemeral selection requirements
- [ ] 3.2 Confirm both frontends verify the popover remains a lightweight summary with no item list before declaring the detail view complete
