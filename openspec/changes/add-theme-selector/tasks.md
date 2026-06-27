## 1. Theme Config Persistence

- [ ] 1.1 Add `ThemeConfig` struct (or free functions `load() -> ThemeKey` / `save(ThemeKey)`) to `dtrpg-ui/src/data/theme.rs` using the same user-defaults crate already used by `FileOpenerConfig` and `StorageConfig`
- [ ] 1.2 Implement `ThemeConfig::load()`: read the stored key string; return `ThemeKey::Parchment` if missing or unrecognized; log a `tracing::warn!` if the value is present but unrecognized
- [ ] 1.3 Implement `ThemeConfig::save(key: ThemeKey)`: write the key string to user-defaults; log a `tracing::warn!` on failure but do not propagate the error

## 2. Startup Integration

- [ ] 2.1 In `dtrpg-ui/src/util/init.rs`, replace `LibriTheme::default_theme()` with `LibriTheme::new(ThemeConfig::load(), Density::Comfortable)` so the persisted theme is applied before any window opens

## 3. SettingsController

- [ ] 3.1 Add `Appearance` variant to the `SettingsTab` enum in `dtrpg-ui/src/controllers/settings.rs`; add its `label()` → `"Appearance"`, `from_name()`, and `to_name()` arms
- [ ] 3.2 Add `set_theme(key: ThemeKey, cx: &mut Context<Self>)` method to `SettingsController`: call `ThemeConfig::save(key)`, call `cx.set_global(LibriTheme::new(key, Density::Comfortable))`, emit `SettingsChanged`
- [ ] 3.3 Expose the current theme key in `SettingsSnapshot` by adding a `selected_theme: ThemeKey` field; populate it from `cx.global::<LibriTheme>().key` in `SettingsController::snapshot()`
- [ ] 3.4 Update all `render_active_section` call sites (in `settings_view.rs`) to pass `selected_theme` through to the new Appearance section

## 4. Appearance Section View

- [ ] 4.1 Create `dtrpg-ui/src/ui/views/settings_theme_view.rs`; add `pub mod settings_theme_view;` to `dtrpg-ui/src/ui/views/mod.rs`
- [ ] 4.2 Implement `render_theme_section(selected: ThemeKey, entity: Entity<SettingsController>, colors: &ColorTokens) -> impl IntoElement`
- [ ] 4.3 Render a section label ("Theme") followed by a horizontal row of four theme swatches; each swatch is an 80×64 px rounded rectangle split top/bottom showing that theme's `surface` (top half) and `surface_alt` (bottom half) colors; the theme name is rendered below the swatch in `text_secondary`
- [ ] 4.4 Highlight the active swatch with a 2 px border in `colors.accent`; all others use `colors.border`; add a small `✓` checkmark in `colors.accent` overlaid in the top-right corner of the active swatch
- [ ] 4.5 Wire `on_click` on each swatch to call `entity.update(cx, |ctrl, cx| ctrl.set_theme(key, cx))`

## 5. Settings View Wiring

- [ ] 5.1 Add `SettingsTab::Appearance` to the `tabs` array in `render_tab_strip()` in `settings_view.rs`
- [ ] 5.2 Add a `SettingsTab::Appearance` arm to `render_active_section()` that calls `render_theme_section(selected_theme, entity, colors)`
- [ ] 5.3 Update the `render_settings_panel` signature to accept `selected_theme: ThemeKey` and thread it through to `render_active_section`
- [ ] 5.4 Update the call to `render_settings_panel` in `root_view.rs` to pass `settings_snap.selected_theme`

## 6. Verification

- [ ] 6.1 Run `cargo check -p dtrpg-ui` and confirm zero errors
- [ ] 6.2 Run `DTRPG_AUTH_STATE_OVERRIDE=authenticated cargo run`; open settings, click "Appearance"; confirm four swatches render with correct preview colors and the active theme is highlighted
- [ ] 6.3 Click the Ink swatch; confirm the entire UI re-themes immediately without closing the settings panel
- [ ] 6.4 Quit and relaunch; confirm the app opens with Ink theme applied from the first frame
- [ ] 6.5 Delete or corrupt the theme preference key; confirm the app falls back to Parchment with a `WARN` log line
