## Context

The app has four named themes (`ThemeKey`: Parchment, Slate, Sage, Ink) defined in `dtrpg-ui/src/data/theme.rs`. The active theme is stored as a GPUI app-level global (`LibriTheme`) and installed at startup via `init_globals()` in `dtrpg-ui/src/util/init.rs` with `cx.set_global(LibriTheme::default_theme())`. Views read the theme each render via `cx.global::<LibriTheme>()`.

Settings persistence follows an existing pattern: `FileOpenerConfig` and `StorageConfig` each serialize to/from platform user-defaults via a `load()` / `save()` pair. Theme preference should follow the same pattern.

The settings panel currently has three tabs: Account, Storage, File Openers. The tab enum is `SettingsTab` in `dtrpg-ui/src/controllers/settings.rs`. Tab content is dispatched in `render_active_section()` in `settings_view.rs`.

## Goals / Non-Goals

**Goals:**

- Add an "Appearance" tab to the settings panel with a visual theme picker.
- Apply the selected theme live (update the GPUI global, notify all subscribers).
- Persist the selection to disk and load it on startup so there is no flash of the default theme.

**Non-Goals:**

- Density (`Comfortable` / `Compact`) selector — out of scope for this change.
- Custom or user-defined color themes — only the four built-in `ThemeKey` variants.
- Per-window themes — one theme for the whole app.

## Decisions

### Theme persistence: `ThemeConfig` user-defaults struct

Follow the existing `StorageConfig` / `FileOpenerConfig` pattern. Add a `ThemeConfig` struct in `dtrpg-ui/src/data/theme_config.rs` (or extend `theme.rs`) with a `load() -> ThemeKey` and `save(ThemeKey)` pair backed by platform user-defaults (the same `defaults` crate already used for settings persistence).

**Alternative considered**: store in a JSON sidecar file alongside `FileOpenerConfig`. Rejected because user-defaults is already wired for settings persistence and is the lighter-weight choice for a single scalar preference.

### Live theme switching: update the GPUI global

When the user selects a theme, call `cx.set_global(LibriTheme::new(key, density))` from inside the `SettingsController`. GPUI propagates global changes to all open windows on the next render cycle, so no manual subscriber wiring is needed — views already read the global each frame.

`SettingsController` will gain a `set_theme(key: ThemeKey, cx)` method that:
1. Saves the preference via `ThemeConfig::save(key)`.
2. Calls `cx.set_global(LibriTheme::new(key, current_density))` to replace the global.
3. Emits `SettingsChanged` so subscribers re-render.

**Alternative considered**: add `selected_theme` to `SettingsSnapshot` and do the `set_global` in `LibraryRootView`. Rejected because it leaks theme-persistence responsibility into the view layer.

### Startup load: replace `init_globals` call

In `init_globals()`, replace `LibriTheme::default_theme()` with `LibriTheme::new(ThemeConfig::load(), Density::Comfortable)` so the correct theme is installed before any window opens.

### Theme tab in settings: new `SettingsTab::Appearance` variant

Add `Appearance` to the `SettingsTab` enum and a new `settings_theme_view.rs` file for the section content. The picker renders four swatches in a horizontal row; each swatch shows a preview of the theme's `surface` / `surface_alt` colors and the theme name below. The active theme swatch gets an accent-colored border and a checkmark overlay.

### Swatch preview: two-tone color block

Each swatch is a small fixed-size rounded rectangle (e.g., 80×60 px) split diagonally or top/bottom to show `surface` (main background) and `surface_alt` (sidebar background). Name label sits below. This gives enough visual signal to distinguish themes without needing a full screenshot.

## Risks / Trade-offs

- **GPUI global replacement triggers full re-render**: `cx.set_global` causes every view that reads `cx.global::<LibriTheme>()` to recompute. For the catalog with many items this could produce a frame hitch. Mitigation: accepted — this is a deliberate, infrequent user action and the cost is one extra frame.
- **`ThemeConfig` persistence failure is silent**: If the user-defaults write fails (permissions, disk full) the app continues with the in-session selection but reverts on next launch. Mitigation: log a `tracing::warn!` and continue rather than surfacing an error to the user.
- **Density is not persisted**: `LibriTheme::new(key, Density::Comfortable)` is hardcoded. If density is ever made user-configurable this will need revisiting.

## Open Questions

*(none)*
