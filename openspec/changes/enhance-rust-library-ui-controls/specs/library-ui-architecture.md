# Library UI Controls Architecture Specification

## Document Purpose

This specification defines the architectural and behavioral contract for implementing enhanced library UI controls in the Rust desktop application. It serves as a reference for developers and designers implementing the changes defined in the parent OpenSpec change (`enhance-rust-library-ui-controls`).

## Overview

The enhanced library UI consists of five primary control groups:

1. **Group By** - A dropdown selector for controlling how library items are organized
2. **Search** - A text input field for filtering library items
3. **View As** - A selector for controlling how search results are presented
4. **Parent Matching** - An optional checkbox for tree view search behavior
5. **Sort** - A multi-section sort selector for ordering results

All controls operate on in-memory data provided by the library service layer. There is no backend integration or persistence of UI state in this phase.

## View Models and State

### LibrarySearchState

Tracks the current search filtering configuration.

```rust
pub enum SearchViewMode {
    Highlight,     // Show all items; highlight matches
    OnlyMatching,  // Show only matching items
}

pub struct LibrarySearchState {
    pub query: String,
    pub view_mode: SearchViewMode,
    pub match_parents: bool,
}

impl LibrarySearchState {
    pub fn set_query(&mut self, query: impl Into<String>);
    pub fn set_view_mode(&mut self, mode: SearchViewMode);
    pub fn toggle_match_parents(&mut self);
    pub fn clear(&mut self);
}
```

**Semantics:**
- `query`: The current search text. Compared against product names (and optionally publisher/type names depending on view mode).
- `view_mode`: Controls how search results are presented to the user.
- `match_parents`: In tree view modes, when `true`, parent items are included in search matching; when `false`, only child items are matched.

### LibrarySortState

Tracks the current sort configuration.

```rust
pub enum SortType {
    Alphabetically,
    MostRecentlyUpdated,
    DateAdded,
    DatePublished,
}

pub enum SortDirection {
    Ascending,
    Descending,
}

pub struct LibrarySortState {
    pub sort_type: SortType,
    pub direction: SortDirection,
}

impl LibrarySortState {
    pub fn set_sort_type(&mut self, sort_type: SortType);
    pub fn set_direction(&mut self, direction: SortDirection);
    pub fn toggle_direction(&mut self);
    pub fn label(&self) -> String;
}
```

**Semantics:**
- `sort_type`: The criterion by which items are sorted.
- `direction`: Whether sorting is ascending (A→Z, oldest→newest) or descending (Z→A, newest→oldest).

**Date Field Fallback Behavior:**
- `MostRecentlyUpdated`: Uses `LibraryItemView.date_modified` if present; falls back to `updated_order`.
- `DateAdded`: Uses `LibraryItemView.date_purchased` if present; falls back to `added_order`.
- `DatePublished`: Currently uses `date_purchased` as a proxy; this may change if a dedicated published date field is added to the SDK.
- `Alphabetically`: Compares product names lexicographically, case-insensitive.

### LibraryItemView

Represents a library item suitable for UI presentation, derived from SDK models.

```rust
pub struct LibraryItemView {
    pub id: u64,
    pub product_id: u64,
    pub name: String,
    pub publisher: String,
    pub product_type: String,
    pub file_count: usize,
    pub date_purchased: Option<String>,    // ISO 8601
    pub date_modified: Option<String>,     // ISO 8601
    pub added_order: u32,
    pub updated_order: u32,
}

impl LibraryItemView {
    pub fn matches_search(&self, query: &str, match_parents: bool) -> bool;
    pub fn sort_key(&self, sort_type: &SortType) -> impl Ord;
}
```

**Semantics:**
- `id`: The unique identifier for the item (from SDK `order_product_id`).
- `product_id`: The product identifier (from SDK `product_id`).
- `name`: The product name (from SDK `name`).
- `publisher`: The publisher name (from SDK `PublisherAttributes.name` or a fallback).
- `product_type`: The item type, extracted from SDK `OrderProductAttribute.option_value_name` where `option_name == "Format"` (or similar logic).
- `file_count`: The number of downloadable files (length of SDK `OrderProductAttributes.files`).
- `date_purchased`: The date the product was purchased (from SDK `date_purchased`), in ISO 8601 format.
- `date_modified`: The date the product files were last modified (from SDK `file_last_modified`), in ISO 8601 format.
- `added_order`: A relative insertion order used for sorting when `DateAdded` is selected and no `date_purchased` is available.
- `updated_order`: A relative update order used for sorting when `MostRecentlyUpdated` is selected and no `date_modified` is available.

**Search Matching (`matches_search`):**
- Compares `query` (case-insensitive) against `self.name`.
- When `match_parents` is `true`, also matches against `self.publisher` and `self.product_type`.
- Returns `true` if any matched field contains the query as a substring.

**Sort Key (`sort_key`):**
- For `Alphabetically`: Returns the product name in lowercase for case-insensitive comparison.
- For `MostRecentlyUpdated`: Returns a comparable value based on `date_modified` or `updated_order`.
- For `DateAdded`: Returns a comparable value based on `date_purchased` or `added_order`.
- For `DatePublished`: Currently same as `DateAdded` (may change with SDK updates).

## Control Specifications

### Group By Dropdown

**Purpose:** Allow users to select how library items are organized.

**Options:**
- **None**: Flat list view, all items in a single list.
- **By Publisher**: Tree view with publishers as parent items and products as children.
- **By Type**: Tree view with product types as parent items and products as children.

**Behavior:**
- Clicking the dropdown reveals all three options.
- Selecting an option updates the view mode and re-renders the library list.
- The currently selected option is visually highlighted.
- The dropdown closes after selection.

**UI Considerations:**
- Label: "Group by"
- Display current selection next to the label or on the button itself.
- Use GPUI's popup or context menu for dropdown implementation.

### Search Text Input

**Purpose:** Filter library items by entering search text.

**Behavior:**
- User can type any text into the input field.
- Filtering happens in real-time as the user types.
- Search is case-insensitive and matches substrings.
- When in tree view modes, search can optionally match parent items based on the "Parent Matching" checkbox.
- Clearing the input field shows all items again.

**Filtering Logic:**
- For each item, call `item.matches_search(query, search_state.match_parents)`.
- Collect all matching items.
- Apply the selected `view_mode` (Highlight or Only Matching).
- Apply the selected sort order.

**UI Considerations:**
- Label: "Search" (optional, can be a placeholder)
- Input can have a "Clear" button or icon for quick reset.
- Show item count (e.g., "3 of 15 items" in Only Matching mode, or just highlight count in Highlight mode).

### View As Selector

**Purpose:** Control how search results are presented when search is active.

**Options:**
- **Highlight**: Show all items; visually distinguish matching items from non-matching items.
- **Only Matching**: Hide non-matching items; show only items and groups that match the search.

**Behavior:**
- Selector only appears when search query is non-empty.
- Selecting an option updates the presentation immediately.
- In Highlight mode, matching items are visually distinct (e.g., different color, bold text, or icon).
- In Only Matching mode, non-matching items are hidden; parent groups with no matching children are also hidden.

**UI Considerations:**
- Label: "View As"
- Can be implemented as a toggle (Highlight | Only Matching) or dropdown menu.
- Ensure visual distinction is clear and accessible.

### Parent Matching Checkbox

**Purpose:** Control whether parent-level items (publishers or product types) are included in search matching.

**Behavior:**
- Only visible when in tree view modes (By Publisher or By Type).
- When checked (`true`), parent items are included in search matching.
  - Example: Searching for "Paizo" will match the "Paizo Publishing" publisher group.
- When unchecked (`false`), only child items (actual products) are matched.
  - Example: Searching for "Paizo" will match products by Paizo but not show "Paizo Publishing" as a match just because of its name.
- Checkbox state persists when switching between tree view modes (if both are available at the time).

**UI Considerations:**
- Label: "Include parent items in search" or "Match group names"
- Place near the search input or in the search control section.
- Add a tooltip explaining the behavior.
- Disable if not in tree view mode.

### Sort Selector

**Purpose:** Allow users to specify sort order and direction for library items.

**Structure:**
The sort selector is divided into two conceptual sections, each clearly separated visually or with section headers.

**Sort By Section (Sort Type):**
- Alphabetically
- Most Recently Updated
- Date Added
- Date Published

**Direction Section:**
- Ascending (↑ or "A→Z" or "Oldest→Newest")
- Descending (↓ or "Z→A" or "Newest→Oldest")

**Behavior:**
- User can select a sort type and a direction independently.
- Both selections apply simultaneously; results are sorted by the selected type in the selected direction.
- In tree view modes, items within each group are sorted by the selected type and direction; parent group order is not affected (parents remain grouped).
- Currently selected sort type and direction are visually highlighted.

**UI Considerations:**
- Implement as buttons or a dropdown menu; ensure clear visual separation between sort type and direction sections.
- Use icons or text to make sort direction intuitive (arrows, "A→Z" notation, etc.).
- Display the current sort state clearly (e.g., "Sorted by: Alphabetically, A→Z").
- Sort updates apply in real-time as users change selections.

## Data Flow

### Initialization

1. `LibraryController` is created with a `LibraryService` and initial view models.
2. `LibraryService.list_items()` is called to populate the in-memory item list.
3. Initial `LibrarySearchState` and `LibrarySortState` are set to defaults.
4. The library pane is rendered with all items unsorted (or in default order).

### Search Interaction

1. User types into the search input.
2. `LibraryController.set_search_query(text)` is called.
3. `LibraryController` calls `filtered_items()`, which:
   - Filters items by calling `item.matches_search()` on each item.
   - Applies the selected search view mode (Highlight or Only Matching).
   - Applies the current sort order.
4. The library pane re-renders with the updated filtered items.

### Sort Interaction

1. User selects a sort type or direction.
2. `LibraryController.set_sort_type(type)` or `set_sort_direction(direction)` is called.
3. `LibraryController` calls `sorted_items()` on the current filtered list, which:
   - Sorts items using `item.sort_key(sort_type)`.
   - Applies sort direction (reverse if descending).
   - In tree view modes, preserves parent grouping while sorting children.
4. The library pane re-renders with the updated sorted results.

### Grouping Interaction

1. User selects a grouping option (None, By Publisher, By Type).
2. `LibraryController.set_view_mode(mode)` is called.
3. The library pane structure changes:
   - For "None": Renders items in a flat list.
   - For "By Publisher": Renders items organized by publisher (parent items are publishers).
   - For "By Type": Renders items organized by product type (parent items are types).
4. Current search filter and sort order remain applied (to the reorganized structure).
5. Parent matching checkbox visibility may change (only visible in tree modes).

## Seeded Data Structure

The seeded data must provide realistic test coverage for all UI modes and interactions.

### Publishers (Minimum 5)

- Paizo Publishing
- Wizards of the Coast
- Green Ronin Publishing
- Modiphius Entertainment
- Free League Publishing

### Product Types (Minimum 4)

- PDF
- VTT Module
- Foundry VTT Module
- ePub

### Products (Minimum 15-20)

- Distributed across publishers and types
- Mix of recent and older products
- Realistic product names
- Date fields spanning at least 3 years
- Mix of products with and without optional fields

### Example Seeded Item

```json
{
  "id": 1,
  "product_id": 101,
  "name": "Advanced Player's Guide",
  "publisher": "Paizo Publishing",
  "product_type": "PDF",
  "file_count": 3,
  "date_purchased": "2024-03-15",
  "date_modified": "2024-03-20",
  "added_order": 1,
  "updated_order": 5
}
```

## Testing Strategy

### Unit Tests

- **View Model Tests**: Verify search matching, sort key generation, and state transitions.
- **Controller Tests**: Verify filtered/sorted list generation, search and sort logic, and edge cases.
- **Logic Tests**: Case-insensitive matching, date parsing, sort order correctness, tree view grouping.

### Integration Tests

- **UI Control Tests**: Verify dropdown opens/closes, search input updates filter, sort buttons update sort state.
- **End-to-End Tests**: Verify combined interactions (search + sort + grouping), persistence of state across interactions.

### Scenario Tests

- User searches for "module", sees matching items highlighted (Highlight mode), then switches to Only Matching mode and sees only matching items.
- User groups by publisher and searches; parent matching can be toggled on and off.
- User sorts by "Most Recently Updated" descending and verifies correct order.
- User switches grouping modes and verifies search/sort persist.

## Performance Considerations

- **Search/Sort Performance**: On in-memory data, search and sort operations should be instant even with 1000+ items.
- **Rendering Performance**: GPUI rendering should be smooth when items are added, removed, or reordered; profile and optimize if needed.
- **Memory**: Duplicate data should be minimized; consider using references or Rc/Arc if needed for large datasets.

## Future Enhancements

This specification is intentionally limited in scope to enable the first production-ready version. Future enhancements may include:

- Backend sync for search/sort state.
- Advanced search syntax (e.g., "publisher:Paizo type:PDF").
- Custom sort presets or favorites.
- Search history or recent searches.
- Product descriptions in search (requires SDK model update).
- Filtering by date range, file size, or other metadata.

## Dependency on SDK Models

This specification derives from the following Rust SDK models (version TBD):

- `OrderProductAttributes` - The primary product metadata model.
- `PublisherAttributes` - Publisher metadata.
- `OrderProductFile` - File download information.

If the SDK models change significantly, this specification may need updating. The mapping from SDK models to `LibraryItemView` should be documented and maintained in the implementation.

---

**Version**: 1.0  
**Created**: 2026-01-15  
**Last Updated**: 2026-01-15  
**Status**: Draft - Ready for Implementation
