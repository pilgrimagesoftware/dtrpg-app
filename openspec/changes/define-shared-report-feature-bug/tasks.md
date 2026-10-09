# Tasks

## 1. Shared Report Spec

- [x] 1.1 Add parent OpenSpec change for shared report-a-feature/bug behavior
- [x] 1.2 Add `shared-report-feature-bug` capability delta spec

## 2. Child Implementation Planning

- [x] 2.1 Create Rust child change in `dtrpg-app/rust` for the gpui menu items, dialog, and browser-handoff submission, and verify its tasks.md references this parent change — done via `openspec/changes/shared-report-feature-bug` in `dtrpg-app/rust`, merged in pilgrimagesoftware/dtrpg-app.rs#243
- [ ] 2.2 File a future-work note (or child change placeholder) in `dtrpg-app/swift` tracking Swift parity, without blocking this baseline on it

## 3. Rollout Coordination

- [x] 3.1 Confirm the Rust frontend implements both entry points (Help menu, account dropdown), the kind/subject/description/diagnostics dialog, and the validated browser-handoff submission before declaring this baseline complete — confirmed: `ReportFeatureBug` action wired in both entry points, dialog with kind/subject/description/diagnostics, URL-encoded browser handoff, 398 tests passing (pilgrimagesoftware/dtrpg-app.rs#243, merged 2026-10-04)
