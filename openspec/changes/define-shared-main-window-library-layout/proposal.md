## Why

The top-level `dtrpg` change now defines the main-window library layout contract for DriveThruRPG desktop apps. The app meta-repository needs a language-agnostic child proposal that maps that umbrella contract to shared frontend behavior before Swift and Rust implementations proceed independently.

## What Changes

- Define shared main-window layout expectations for desktop library browsing across Swift and Rust frontends.
- Extend the existing baseline library UI direction with disclosable search/filter controls, account menu access, list/tree and grid presentations, view summary, and sync status.
- Define shared presentation state that child apps must preserve when switching view modes, grouping, sorting, or filtering.
- Require child app proposals to map the shared behavior to AppKit and GPUI implementation details.

## Capabilities

### New Capabilities

- `shared-main-window-library-layout`: Defines language-agnostic main-window layout, library browsing state, account-menu expectations, and sync-status behavior for desktop frontends.

## Impact

- `dtrpg-app/openspec`: Adds shared main-window layout coordination.
- `dtrpg-app/swift`: Needs AppKit-specific child implementation planning.
- `dtrpg-app/rust`: Needs GPUI-specific child implementation planning.
- Depends on `dtrpg/openspec/changes/define-main-window-library-layout`.
