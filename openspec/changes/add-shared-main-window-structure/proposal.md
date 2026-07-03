## Why

The top-level `dtrpg` change `ui-revamp` redefines the main-window structure with a title bar, a
collapsible navigation sidebar, tabbed content, and a status bar, retiring the disclosable
search/filter strip and account button that `shared-main-window-library-layout` previously placed
in the content area. The app meta-repository needs an updated shared child proposal mapping that
structure to Swift and Rust before either frontend implements it independently.

## What Changes

- Define a shared title bar region containing the window title and an account button that opens a
  menu with user info, a settings action, and a sign-out action.
- Define a shared collapsible left sidebar with default navigation sections showing item counts,
  plus Collections (count, search, add, collapse) and Publishers (count, search, collapse)
  sections, carried forward from existing sidebar work.
- Define a shared tabbed content area with a non-closable catalog tab first, a dynamic segmented
  tab strip with an overflow "more" menu, and closable expanded detail tabs.
- Define shared catalog item interaction state: single-click opens a popover detail view without
  creating a tab; double-click opens a closable expanded detail tab with a large thumbnail, item
  attributes, and a file list for multi-item entries.
- Define a shared status bar with total library item count and size, an active-tab summary
  (title, item count, selection count), a theme picker, an activity indicator, and a notification
  indicator, each exposing a hover summary and a click-through detail surface.
- Retire the `shared-main-window-library-layout` requirements for the standalone search/filter
  strip, the content-area account menu, and content-area summary/sync display, replacing them with
  the tab header, title bar, and status bar defined here. List/tree/grid presentation and
  browsing-state requirements carry forward unchanged.

## Capabilities

### New Capabilities

- `shared-main-window-structure`: Defines the language-agnostic title bar, sidebar, tabbed
  content area, and status bar for desktop library browsing.

### Modified Capabilities

- `shared-main-window-library-layout`: Retires the standalone search/filter strip, content-area
  account menu, and content-area summary/sync requirements in favor of
  `shared-main-window-structure`; browsing-state and presentation requirements are unaffected.

## Impact

- `dtrpg-app/openspec`: Adds `shared-main-window-structure` and retires superseded parts of
  `shared-main-window-library-layout`.
- `dtrpg-app/swift`: Needs an AppKit/SwiftUI child change mapping this structure to macOS.
- `dtrpg-app/rust`: Needs a GPUI child change mapping this structure to gpui-components, referencing
  the gallery demo.
- Depends on `dtrpg/openspec/changes/ui-revamp`.
- Existing app-level `activity-panel-improvements`, `alert-history-view`, and
  `avatar-menu-user-info` work in `dtrpg-app/rust` already implements the activity and
  notification behavior this change's status bar and title bar reference; this change relocates
  entry points, it does not redefine their internal behavior.
