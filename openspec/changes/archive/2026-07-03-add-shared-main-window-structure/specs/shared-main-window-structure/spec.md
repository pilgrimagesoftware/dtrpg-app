## ADDED Requirements

### Requirement: Shared main window MUST define a title bar region
The app meta-repository MUST define a shared title bar region above the content area, separated
by a horizontal rule, containing the window title and an account button that opens a menu with
user info, a settings action, and a sign-out action.

#### Scenario: Mapping the title bar into a child frontend
- **WHEN** a child desktop app implements the main window
- **THEN** it can identify the title bar's separator, title, and account button/menu requirements
  it must satisfy

### Requirement: Shared main window MUST define a collapsible sidebar
The app meta-repository MUST define a shared collapsible left sidebar with default navigation
sections showing item counts, a Collections section (count, search, add, collapse), and a
Publishers section (count, search, collapse).

#### Scenario: Mapping the sidebar into a child frontend
- **WHEN** a child desktop app implements the main window
- **THEN** it can identify the sidebar's default sections, Collections section, and Publishers
  section requirements it must satisfy

### Requirement: Shared main window MUST define a tabbed content area
The app meta-repository MUST define a shared tabbed content area with a non-closable catalog tab
first, a dynamic segmented tab strip with an overflow "more" menu, and closable expanded detail
tabs opened by double-clicking a catalog item.

#### Scenario: Mapping tab behavior into a child frontend
- **WHEN** a child desktop app implements the main window
- **THEN** it can identify the catalog tab, tab overflow menu, and expanded detail tab
  requirements it must satisfy

### Requirement: Shared catalog item interaction MUST distinguish popover and tab detail
The app meta-repository MUST define single-click as opening a non-tab popover detail view and
double-click as opening a closable expanded detail tab with a large thumbnail, item attributes,
and a file list for multi-item entries.

#### Scenario: Mapping item interaction into a child frontend
- **WHEN** a child desktop app implements catalog item inspection
- **THEN** it can identify the single-click popover and double-click expanded-tab requirements it
  must satisfy

### Requirement: Shared main window MUST define a status bar
The app meta-repository MUST define a shared status bar with total library item count and size, an
active-tab summary (title, item count, selection count), a theme picker, an activity indicator,
and a notification indicator, each exposing a hover summary and a click-through detail surface.

#### Scenario: Mapping the status bar into a child frontend
- **WHEN** a child desktop app implements the main window
- **THEN** it can identify the status bar's library summary, theme picker, activity indicator, and
  notification indicator requirements it must satisfy, and reference existing activity and
  notification app-level behavior rather than redefine it
