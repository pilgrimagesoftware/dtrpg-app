## Why

The desktop applications need a shared, language-agnostic baseline for library UI layout and flow so Rust and Swift implementations present the same product behavior even when technical stacks differ.

Without a shared parent change, each app can drift in navigation, state presentation, and interaction patterns.

## What Changes

- Define shared desktop library UI layout and flow expectations for baseline implementation.
- Define shared state expectations (loading, loaded, empty, recoverable error) independent of language/toolkit.
- Require child implementation changes in `dtrpg-app/rust` and `dtrpg-app/swift` for platform/language specifics.
- Keep backend communication out of this baseline phase (stub-compatible behavior).

## Capabilities

### New Capabilities
- `shared-library-ui-layout`: Defines language-agnostic desktop library layout, navigation, and baseline state behavior.

## Impact

- `dtrpg-app/openspec`: Parent language-agnostic behavior definition.
- `dtrpg-app/rust`: Child baseline implementation change.
- `dtrpg-app/swift`: Child baseline implementation change.
