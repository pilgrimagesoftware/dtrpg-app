## 1. Shared Reconciliation Spec

- [x] 1.1 Add parent OpenSpec change for shared catalog reconciliation behavior
- [x] 1.2 Add `shared-catalog-remote-sync-reconciliation` capability delta spec

## 2. Child Implementation Reconciliation

- [ ] 2.1 Reconcile the existing Rust child change
      (`dtrpg-app/rust/openspec/changes/catalog-remote-sync-reconciliation`) against this
      shared capability: confirm every shared scenario is covered by its specs, and adjust
      its proposal to reference this parent capability rather than independently defining
      the same behavior.
- [ ] 2.2 Create a Swift child change in `dtrpg-app/swift` implementing this shared
      capability using Swift-native data model, concurrency, and UI conventions.

## 3. Rollout Coordination

- [ ] 3.1 Confirm both frontends satisfy the same shared reconciliation, availability,
      item-level check, and startup fetch-strategy scenarios once their child changes are
      implemented.
