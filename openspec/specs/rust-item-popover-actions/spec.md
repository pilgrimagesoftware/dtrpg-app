# rust-item-popover-actions Specification

## Purpose
TBD - created by archiving change add-item-popover-actions. Update Purpose after archive.
## Requirements
### Requirement: Download action button
The item popover SHALL render a download action button whose label and icon reflect the selected item's current `ItemStatus`, and clicking it SHALL toggle the item's download status via `LibraryController::toggle_download`.

#### Scenario: Item is in the cloud
- **WHEN** the popover is rendered for an item with `ItemStatus::Cloud`
- **THEN** the download button SHALL display a "Download" label and download icon

#### Scenario: Item is already downloaded
- **WHEN** the popover is rendered for an item with `ItemStatus::Downloaded`
- **THEN** the download button SHALL display a "Remove Download" label and a distinct icon indicating removal

#### Scenario: Clicking the download button
- **WHEN** the user clicks the download action button
- **THEN** the popover SHALL call `LibraryController::toggle_download` with the selected item's id
- **AND** the button's label and icon SHALL update to reflect the new status on the next render

### Requirement: Open in detail action button
The item popover SHALL render an "Open in Detail" action button that opens the selected item's detail tab via `TabsController::open_detail_tab`, without requiring the user to double-click the catalog entry.

#### Scenario: Clicking open in detail
- **WHEN** the user clicks the "Open in Detail" action button on the popover
- **THEN** the popover SHALL call `TabsController::open_detail_tab` with the selected item's id and title
- **AND** the corresponding detail tab SHALL become active

### Requirement: Action buttons visible regardless of item state
The item popover SHALL always render both the download and open-in-detail action buttons for any selected item, changing only the download button's label/icon based on status.

#### Scenario: Popover shown for any item
- **WHEN** the popover is rendered for any library item, regardless of its `ItemStatus`
- **THEN** both the download action button and the "Open in Detail" action button SHALL be present and enabled
