## MODIFIED Requirements

### Requirement: Shared main window MUST define a tabbed content area
The app meta-repository MUST define a shared tabbed content area with a non-closable catalog tab
first, a dynamic segmented tab strip with an overflow "more" menu, and closable expanded detail
tabs opened by double-clicking a catalog item. Closable detail tabs MUST expose bulk-close
actions - Close, Close Others, Close Tabs to the Right, and Close All - through both a per-tab
right-click context menu and the native Window menu, and these actions MUST always preserve the
catalog tab and never close it.

#### Scenario: Mapping tab behavior into a child frontend
- **WHEN** a child desktop app implements the main window
- **THEN** it can identify the catalog tab, tab overflow menu, expanded detail tab, and tab
  bulk-close requirements it must satisfy

#### Scenario: Right-clicking a detail tab opens a close menu
- **WHEN** a user right-clicks a closable expanded detail tab
- **THEN** a context menu appears with Close, Close Others, Close Tabs to the Right, and Close
  All items, each acting on the tab that was right-clicked (not necessarily the active tab)

#### Scenario: Close Others preserves the target tab and the catalog tab
- **WHEN** a user selects Close Others from a detail tab's context menu
- **THEN** every other closable detail tab closes, the catalog tab and the target tab remain
  open, and the active tab becomes the target tab if it was not already active

#### Scenario: Close Tabs to the Right only affects tabs after the target
- **WHEN** a user selects Close Tabs to the Right from a detail tab's context menu
- **THEN** only closable detail tabs positioned after the target tab in the tab strip close, and
  if the active tab was closed the catalog tab becomes active

#### Scenario: Close All preserves only the catalog tab
- **WHEN** a user selects Close All from any detail tab's context menu, or from the Window menu
- **THEN** every closable detail tab closes, the catalog tab remains open, and it becomes the
  active tab

#### Scenario: Window menu close actions operate on the active tab
- **WHEN** a user opens the native Window menu while a detail tab is active
- **THEN** the menu offers Close Tab (closes the active detail tab), Close Other Tabs, and Close
  All Tabs, each behaving identically to the equivalent context-menu action targeted at the
  active tab

#### Scenario: Window menu close actions are disabled when only the catalog tab is open
- **WHEN** a user opens the native Window menu while no detail tabs are open
- **THEN** Close Tab, Close Other Tabs, and Close All Tabs are disabled
