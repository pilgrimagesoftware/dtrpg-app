## Why

After shared baseline UI behavior is defined and implemented in language-specific child repos, the desktop apps need a shared, language-agnostic definition of backend integration behavior.

Without a shared parent integration change, Rust and Swift apps can diverge in request lifecycle, retry, and error/recovery flow semantics.

## What Changes

- Define shared desktop expectations for backend-driven library request lifecycle behavior.
- Define shared expectations for mapping backend/session failures into app-visible recovery behavior.
- Require language-specific integration child changes in Rust and Swift app repos.
- Keep SDK implementation details in language-specific repositories.

## Capabilities

### New Capabilities
- `shared-library-backend-integration`: Defines language-agnostic backend integration behavior for desktop library workflows.

## Impact

- `dtrpg-app/openspec`: Parent integration behavior definition.
- `dtrpg-app/rust`: Child integration implementation using Rust SDK.
- `dtrpg-app/swift`: Child integration implementation using Swift SDK.
