## Why

Settings views hand-roll numeric stepper controls (a decrement button, a value div, an increment
button, each wired up separately) instead of using `gpui-component`'s built-in `NumberInput`. This
duplicates layout, tooltip, and click-handling code across views and drifts from the project's own
policy of preferring `gpui-component` primitives over custom implementations.

## What Changes

- Replace `render_concurrency_stepper` in `settings_storage_view.rs` with a `NumberInput`-backed
  control for "Max concurrent downloads".
- Replace `text_scale_row` in `settings_appearance_view.rs` with a `NumberInput`-backed control for
  the text scale multiplier.
- Keep existing min/max clamping behavior (`MIN_CONCURRENT_DOWNLOADS`/`MAX_CONCURRENT_DOWNLOADS`,
  `MIN_UI_TEXT_SCALE`/`MAX_UI_TEXT_SCALE`) by validating in the `NumberInputEvent::Step` handler.
- Keep existing tooltips, labels, and localization strings; only the control implementation
  changes, not the row's label/note layout.

## Capabilities

### New Capabilities
- `settings-numeric-controls`: Numeric fields in Settings (concurrency limit, text scale) are
  rendered as `gpui-component` `NumberInput` controls with increment/decrement, min/max
  enforcement, and keyboard/scroll step support, instead of custom div-based steppers.

### Modified Capabilities
(none — no existing spec currently documents the settings stepper behavior)

## Impact

- `dtrpg-ui/src/ui/views/settings_storage_view.rs`: replace `render_concurrency_stepper` and its
  manual click handlers with `NumberInput` + `InputState`.
- `dtrpg-ui/src/ui/views/settings_appearance_view.rs`: replace `text_scale_row` and its manual
  click handlers with `NumberInput` + `InputState`.
- Each view's controller (`SettingsController` / `LibraryController`) gains an `Entity<InputState>`
  field and a subscription to `NumberInputEvent::Step`, replacing the current inline `on_click`
  closures.
- No changes to persisted settings format, IPC, or SDK surfaces.
