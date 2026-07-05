## ADDED Requirements

### Requirement: Settings MUST open in a separate non-modal window, shared across frontends
Both desktop frontends MUST present settings as a separate, independently-positioned native window rather than an in-window overlay, and the main library window MUST remain fully interactive while settings is open.

#### Scenario: Opening settings in either desktop frontend
- **WHEN** a user triggers the Settings action in the Rust or Swift desktop app
- **THEN** both frontends open settings as a separate native window, and the main library window remains visible, unobscured, and interactive behind it

#### Scenario: No focus trap or backdrop in either frontend
- **WHEN** the settings window is open in either frontend
- **THEN** the main library window does not display a backdrop, dimming overlay, or focus trap that blocks input to its own content

### Requirement: Settings window lifecycle MUST be consistent across frontends
Both desktop frontends MUST implement the same single-instance, state-preserving, non-destructive settings window lifecycle.

#### Scenario: Reopening settings while already open
- **WHEN** a user triggers the Settings action while a settings window is already open, in either frontend
- **THEN** the existing settings window is brought to front and focused, and no duplicate settings window is created

#### Scenario: Reopening settings after close
- **WHEN** a user closes the settings window and then triggers the Settings action again, in either frontend
- **THEN** the settings window reopens with the same tab, draft values, and scroll position as when it was closed

#### Scenario: Closing settings does not quit the app
- **WHEN** a user closes the settings window in either frontend
- **THEN** the application continues running and the main library window is unaffected

### Requirement: Shared settings window behavior MUST be implementation-neutral
The shared settings window presentation requirements MUST avoid prescribing language-specific framework details so each frontend can implement them using its native windowing stack.

#### Scenario: Implementing shared settings window behavior in Rust and Swift
- **WHEN** either frontend implements this baseline
- **THEN** it uses its own native window APIs (gpui `cx.open_window` for Rust, `NSWindowController` for Swift) to satisfy the shared scenarios above, without the parent spec dictating those APIs
