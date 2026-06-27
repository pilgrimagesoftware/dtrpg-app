## Why

The app ships four themes (Parchment, Slate, Sage, Ink) but users have no way to choose among them — the theme is hardcoded at build time. Exposing a theme selector in the Settings view lets users personalize the appearance without requiring a rebuild.

## What Changes

- Add a Theme section to the Settings view with a visual picker showing all four available themes.
- Persist the selected theme to disk so it survives app restarts.
- Apply the selected theme at launch and immediately on change during a session.

## Capabilities

### New Capabilities

- `theme-selection`: User-facing control to pick a named theme; persists the selection and applies it live.

### Modified Capabilities

*(none — no existing spec-level behavior changes)*

## Impact

- `dtrpg-ui/src/data/theme.rs`: theme enum, load-from-storage helper.
- `dtrpg-ui/src/controllers/settings.rs`: add `selected_theme` field to settings state; load/save on change.
- `dtrpg-ui/src/ui/views/settings_view.rs` and a new `settings_theme_view.rs`: render the Theme section.
- App-level wiring in `main.rs` or equivalent startup path to read saved theme and install it as a gpui global before the first render.
- No API or SDK changes.
