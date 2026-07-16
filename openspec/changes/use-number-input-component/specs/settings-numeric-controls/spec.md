## ADDED Requirements

### Requirement: Numeric settings use NumberInput controls
Numeric fields in the Settings views (max concurrent downloads, text scale) SHALL be rendered
using `gpui-component`'s `NumberInput` component instead of hand-rolled div-based
decrement/value/increment rows.

#### Scenario: Max concurrent downloads renders as a NumberInput
- **WHEN** the Storage settings section renders
- **THEN** the "Max concurrent downloads" control is a `NumberInput` bound to an `InputState`
  entity, not a custom three-div stepper

#### Scenario: Text scale renders as a NumberInput
- **WHEN** the Appearance settings section renders
- **THEN** the text scale control is a `NumberInput` bound to an `InputState` entity, not a custom
  three-div stepper

### Requirement: Numeric settings enforce existing min/max bounds
Incrementing or decrementing a settings `NumberInput` SHALL NOT move the value outside the
existing bounds for that field.

#### Scenario: Concurrency cannot go below the minimum
- **WHEN** the user decrements "Max concurrent downloads" while it is already at
  `MIN_CONCURRENT_DOWNLOADS`
- **THEN** the value remains at `MIN_CONCURRENT_DOWNLOADS`

#### Scenario: Concurrency cannot exceed the maximum
- **WHEN** the user increments "Max concurrent downloads" while it is already at
  `MAX_CONCURRENT_DOWNLOADS`
- **THEN** the value remains at `MAX_CONCURRENT_DOWNLOADS`

#### Scenario: Text scale stays within its configured range
- **WHEN** the user increments or decrements the text scale control
- **THEN** the resulting value is clamped between `MIN_UI_TEXT_SCALE` and `MAX_UI_TEXT_SCALE`

### Requirement: Numeric settings changes still update application state
Stepping a settings `NumberInput` SHALL apply the new value to the same controller state the
previous hand-rolled stepper updated.

#### Scenario: Concurrency step updates the download controller
- **WHEN** the user increments or decrements "Max concurrent downloads"
- **THEN** `SettingsController::set_max_concurrent_downloads` is called with the new value

#### Scenario: Text scale step updates the theme's UI text size
- **WHEN** the user increments or decrements the text scale control
- **THEN** the controller's UI text size setter is called with the new scale converted back to
  pixels
