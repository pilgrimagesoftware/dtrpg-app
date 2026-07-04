## ADDED Requirements

### Requirement: Expanded detail tab MUST present entry-tier metadata

The expanded detail tab defined by `shared-main-window-structure` MUST present catalog-entry-level metadata (title, publisher, description or summary, purchase or ownership status, cover art) in a primary content area, distinct from any per-item metadata.

#### Scenario: Opening an expanded detail tab

- **WHEN** the user double-clicks a catalog entry
- **THEN** the expanded detail tab shows the entry's title, publisher, description, and purchase status in the primary content area

### Requirement: Expanded detail tab MUST distinguish single-item from multi-item entries

The expanded detail tab MUST detect the item count for the selected catalog entry and adjust its item-tier presentation accordingly: single-item entries collapse item metadata into the entry tier without requiring item selection, and multi-item entries present a persistent selectable item list.

#### Scenario: Opening a single-item entry's expanded tab

- **WHEN** the user double-clicks a catalog entry that contains exactly one item
- **THEN** the expanded detail tab shows the item's metadata inline within the entry tier without an item list

#### Scenario: Opening a multi-item entry's expanded tab

- **WHEN** the user double-clicks a catalog entry that contains more than one item
- **THEN** the expanded detail tab shows a persistent item list alongside the entry-tier metadata, with no item pre-selected

### Requirement: Expanded detail tab MUST present a persistent item list for multi-item entries

For multi-item entries, the expanded detail tab MUST display a persistent item list panel that remains visible while an item is inspected. Each row MUST show at minimum the item name and item type.

#### Scenario: Viewing the item list

- **WHEN** the expanded detail tab for a multi-item entry is open
- **THEN** a persistent item list is visible showing every item in the entry, each identified by name and type

#### Scenario: Scrolling a long item list

- **WHEN** the entry contains more items than fit in the visible item list area
- **THEN** the item list is scrollable and all items remain reachable

### Requirement: Expanded detail tab MUST update item metadata in place on selection

Selecting an item from the item list MUST update a dedicated item metadata area within the expanded detail tab without closing or reopening the tab. Item metadata MUST include at minimum item name, item type, file format, file size, and download or availability state.

#### Scenario: Selecting an item

- **WHEN** the user selects an item from the item list
- **THEN** the item metadata area updates to show that item's name, type, format, file size, and download state

#### Scenario: Switching selected items

- **WHEN** the user selects a different item while one is already selected
- **THEN** the item metadata area updates in place without navigating away from the expanded detail tab

#### Scenario: No item selected yet

- **WHEN** the expanded detail tab for a multi-item entry is first shown
- **THEN** the item metadata area shows a prompt or placeholder indicating that an item should be selected

### Requirement: Expanded detail tab item selection state SHALL be ephemeral

The selected item within an expanded detail tab SHALL NOT be persisted across app sessions or across closing and reopening the tab for the same entry.

#### Scenario: Reopening a previously viewed multi-item entry's tab

- **WHEN** the user closes and reopens the expanded detail tab for a multi-item entry
- **THEN** no item is pre-selected and the item metadata area shows its default prompt state

### Requirement: Popover detail view SHALL remain a lightweight entry-level summary

The single-click popover detail view defined by `shared-main-window-structure` SHALL NOT implement an item list or item-selection affordance, regardless of item count. It SHALL show only entry-level summary information.

#### Scenario: Single-clicking a multi-item entry

- **WHEN** the user single-clicks a catalog entry that contains more than one item
- **THEN** the popover shows entry-level summary information only, without an item list or item-selection control

### Requirement: Library browsing surface MUST indicate multi-item catalog entries

The desktop application main window library browsing surface MUST display a visible indicator on catalog entries that contain more than one item, in list, tree, and grid presentations.

#### Scenario: Multi-item entry in list or tree view

- **WHEN** a catalog entry in list or tree view contains more than one item
- **THEN** the row displays a visible indicator distinguishing it from single-item entries

#### Scenario: Multi-item entry in grid view

- **WHEN** a catalog entry in grid view contains more than one item
- **THEN** the grid tile displays a visible indicator overlaid on or adjacent to the cover thumbnail

#### Scenario: Single-item entry

- **WHEN** a catalog entry contains exactly one item
- **THEN** no multi-item indicator is shown for that entry
