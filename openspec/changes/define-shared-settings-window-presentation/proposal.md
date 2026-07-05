## Why

Both desktop frontends currently present settings as an in-window overlay stacked on top of the main library content, blocking interaction with the catalog until closed. This is a product-level presentation decision, not a toolkit limitation, so it belongs in a shared, language-agnostic baseline rather than being defined independently (and potentially inconsistently) in each frontend.

## What Changes

- Define shared, language-agnostic behavior: settings open in a separate, non-modal window rather than an in-window overlay.
- Define shared lifecycle expectations: a single settings window per app (repeat invocation brings it to front rather than opening a duplicate), state preserved across close/reopen within a session, and closing settings never quits the app.
- Require child implementation changes in `dtrpg-app/rust` (gpui) and `dtrpg-app/swift` (AppKit) for platform-specific window mechanics.
- Keep the contents of settings (account, storage, file openers, advanced tabs) and how they're persisted out of scope — this baseline only concerns window presentation, not panel content.

## Capabilities

### New Capabilities
- `shared-settings-window-presentation`: Defines language-agnostic desktop settings window behavior — separate non-modal window, single-instance reuse, state persistence across close/reopen, no-quit-on-close — independent of language/toolkit.

## Impact

- `dtrpg-app/openspec`: Parent language-agnostic behavior definition.
- `dtrpg-app/rust`: Child implementation change for gpui-specific window mechanics.
- `dtrpg-app/swift`: Child implementation change for AppKit-specific window mechanics.
