## ADDED Requirements

### Requirement: Theme tab in settings panel
The settings panel SHALL include an "Appearance" tab alongside the existing Account, Storage, and File Openers tabs. Selecting the Appearance tab SHALL display the theme selection section.

#### Scenario: Appearance tab is visible
- **WHEN** the user opens the settings panel
- **THEN** an "Appearance" tab is visible in the tab strip

#### Scenario: Appearance tab activates the theme section
- **WHEN** the user clicks the "Appearance" tab
- **THEN** the settings content area shows the theme selection UI

### Requirement: Visual theme picker
The Appearance section SHALL display all four available themes (Parchment, Slate, Sage, Ink) as selectable swatches. Each swatch SHALL show the theme's surface color and name label. The currently active theme SHALL be visually distinguished from the others.

#### Scenario: All themes shown
- **WHEN** the Appearance section is rendered
- **THEN** four theme swatches are displayed: Parchment, Slate, Sage, and Ink

#### Scenario: Active theme is highlighted
- **WHEN** the Appearance section renders and the active theme is Parchment
- **THEN** the Parchment swatch has a visible selection indicator (e.g., accent-colored border or checkmark); all others do not

#### Scenario: Selecting a theme applies it immediately
- **WHEN** the user clicks a theme swatch
- **THEN** the entire app re-renders with the new theme's color tokens without requiring a restart or panel close

### Requirement: Theme persisted across restarts
The selected theme SHALL be persisted to disk when the user chooses a new theme. On next launch, the app SHALL load the persisted theme preference and apply it before the first render, so no flash of the default theme occurs.

#### Scenario: Persisted theme loaded on launch
- **WHEN** the user selects Ink, quits the app, and relaunches
- **THEN** the app opens with the Ink theme applied from the first frame

#### Scenario: Missing or corrupt preference falls back to default
- **WHEN** no theme preference is stored or the stored value is unrecognized
- **THEN** the app uses the Parchment theme (the default)

### Requirement: Live theme application
Changing the theme in the settings panel SHALL update the `LibriTheme` GPUI global immediately. All views that read `cx.global::<LibriTheme>()` SHALL reflect the new colors on the next render pass without requiring a window reload.

#### Scenario: Main window re-renders on theme change
- **WHEN** the user switches from Parchment to Slate
- **THEN** the sidebar, toolbar, catalog, and settings panel all repaint using Slate's color tokens within the same interaction frame
