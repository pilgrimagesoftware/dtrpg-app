## Phase 1: View Models and Seeded Data

### 1.1 Create LibrarySearchState View Model

- [ ] 1.1.1 Define `LibrarySearchState` struct tracking:
  - `query: String` - the current search text
  - `view_mode: SearchViewMode` - Highlight or Only Matching
  - `match_parents: bool` - whether to include parent items in matching
- [ ] 1.1.2 Implement `SearchViewMode` enum with variants: `Highlight`, `OnlyMatching`
- [ ] 1.1.3 Implement methods on `LibrarySearchState`:
  - `set_query(query: impl Into<String>)` - update search text
  - `set_view_mode(mode: SearchViewMode)` - change Highlight/Only Matching
  - `toggle_match_parents()` - toggle parent matching
  - `clear()` - reset to default (empty query, Highlight mode)
- [ ] 1.1.4 Add documentation explaining the semantics of each field

### 1.2 Create LibrarySortState View Model

- [ ] 1.2.1 Define `SortType` enum with variants:
  - `Alphabetically`
  - `MostRecentlyUpdated`
  - `DateAdded`
  - `DatePublished`
- [ ] 1.2.2 Define `SortDirection` enum with variants:
  - `Ascending`
  - `Descending`
- [ ] 1.2.3 Define `LibrarySortState` struct tracking:
  - `sort_type: SortType`
  - `direction: SortDirection`
- [ ] 1.2.4 Implement methods on `LibrarySortState`:
  - `set_sort_type(sort_type: SortType)` - change the sort criterion
  - `set_direction(direction: SortDirection)` - change ascending/descending
  - `toggle_direction()` - flip between ascending and descending
  - `label()` -> String - return human-readable label (e.g., "A→Z", "Newest Updated")
- [ ] 1.2.5 Add documentation explaining date field fallback behavior

### 1.3 Create LibraryItemView Model Derived from SDK

- [ ] 1.3.1 Define `LibraryItemView` struct containing:
  - `id: u64` - unique identifier (from SDK `order_product_id`)
  - `product_id: u64` - (from SDK `product_id`)
  - `name: String` - product name (from SDK `name`)
  - `publisher: String` - publisher name (from SDK `PublisherAttributes` or fallback)
  - `product_type: String` - item type like PDF, VTT Module (from SDK `OrderProductAttribute` or `attributes`)
  - `file_count: usize` - number of files (from SDK `files` length)
  - `date_purchased: Option<String>` - (from SDK `date_purchased`)
  - `date_modified: Option<String>` - (from SDK `file_last_modified`)
  - `added_order: u32` - relative insertion order for "most recently added" fallback
  - `updated_order: u32` - relative update order for "most recently updated" fallback
- [ ] 1.3.2 Implement conversion/creation from SDK `OrderProductAttributes`
- [ ] 1.3.3 Add method `matches_search(query: &str, match_parents: bool) -> bool` for case-insensitive matching
- [ ] 1.3.4 Add method `sort_key(sort_type: &SortType) -> impl Ord` for use in sorting

### 1.4 Create Comprehensive Seeded Test Data

- [ ] 1.4.1 Create a `seed_data.rs` module in `src/services/` that generates seeded library items
- [ ] 1.4.2 Define seeded publishers (at least 5):
  - "Paizo Publishing" (Pathfinder-like products)
  - "Wizards of the Coast" (D&D-like products)
  - "Green Ronin Publishing"
  - "Modiphius Entertainment"
  - "Free League Publishing"
- [ ] 1.4.3 Define seeded product types (at least 4):
  - "PDF"
  - "VTT Module"
  - "Foundry VTT Module"
  - "ePub"
- [ ] 1.4.4 Create seeded products (at least 15-20) with:
  - Mix of dates spanning past 3 years
  - Variation in product types
  - Distribution across publishers
  - Realistic product names (e.g., "Advanced Player's Guide", "Lost Mines Module")
  - Products with and without optional fields (dates, file counts)
- [ ] 1.4.5 Implement `create_seeded_library_items() -> Vec<LibraryItemView>` function
- [ ] 1.4.6 Document the seeded data structure as a reference for future updates
- [ ] 1.4.7 Add unit tests that verify:
  - Seeded data is non-empty
  - All items have valid publisher and type values
  - Date fields are valid ISO 8601 strings (if present)
  - All items are searchable by at least name

### 1.5 Update Existing Services to Use New Models

- [ ] 1.5.1 Update `LibraryService` trait to return `LibraryItemView` instead of `LibraryItem`
- [ ] 1.5.2 Update `StubLibraryService` to use seeded data from `seed_data.rs`
- [ ] 1.5.3 Ensure backward compatibility or update all consuming code (controller, views)

## Phase 2: Search and Filter Logic

### 2.1 Implement Search Filtering in Library Controller

- [ ] 2.1.1 Add `search_state: LibrarySearchState` field to `LibraryController`
- [ ] 2.1.2 Implement `set_search_query(query: impl Into<String>)` method that:
  - Updates search state
  - Triggers re-filtering of items
  - Updates rendered list
- [ ] 2.1.3 Implement `set_search_view_mode(mode: SearchViewMode)` method
- [ ] 2.1.4 Implement `toggle_match_parents()` method
- [ ] 2.1.5 Implement `filtered_items() -> Vec<&LibraryItemView>` that:
  - Applies search filter based on query and match scope
  - Returns items based on selected search view mode (Highlight or Only Matching)
  - Preserves original grouping (flat or tree structure)

### 2.2 Implement Highlight vs. Only Matching Behavior

- [ ] 2.2.1 For Highlight mode:
  - Return all items from `filtered_items()`
  - Add a `is_highlighted(item: &LibraryItemView) -> bool` method to indicate matching items
- [ ] 2.2.2 For Only Matching mode:
  - Filter `filtered_items()` to return only matching items
  - Update parent-level items visibility: hide publishers/types that have no matching children
- [ ] 2.2.3 Add unit tests for both modes with sample queries and data

### 2.3 Implement Parent-Item Matching

- [ ] 2.3.1 When `match_parents` is true:
  - In tree view modes, check if parent item (publisher or type) matches search query
  - Include parent item even if no children match
- [ ] 2.3.2 When `match_parents` is false:
  - Only check child items (actual products) against search query
  - Hide parent items that have no matching children
- [ ] 2.3.3 Add comprehensive tests for tree view filtering with and without parent matching

### 2.4 Implement Sorting in Library Controller

- [ ] 2.4.1 Add `sort_state: LibrarySortState` field to `LibraryController`
- [ ] 2.4.2 Implement `set_sort_type(sort_type: SortType)` method
- [ ] 2.4.3 Implement `set_sort_direction(direction: SortDirection)` method
- [ ] 2.4.4 Implement `sorted_items(items: &[LibraryItemView]) -> Vec<LibraryItemView>` that:
  - Applies sort based on sort type and direction
  - Handles missing date fields with fallback to added_order/updated_order
  - For tree view modes, sorts within each group but preserves group structure
- [ ] 2.4.5 Add detailed tests for each sort type:
  - Alphabetical ascending and descending
  - Most Recently Updated (using date_modified or updated_order)
  - Date Added (using date_purchased or added_order)
  - Date Published (if applicable from API, else fallback)

### 2.5 Integrate Search and Sort

- [ ] 2.5.1 Modify `LibraryController` to apply both search and sort:
  - First filter items based on search query and view mode
  - Then sort the filtered results
- [ ] 2.5.2 Ensure sort order is preserved when search query changes
- [ ] 2.5.3 Ensure highlighting updates correctly when sort order changes
- [ ] 2.5.4 Add integration tests that verify search + sort combinations

## Phase 3: UI Controls

### 3.1 Implement "Group by" Dropdown

- [ ] 3.1.1 Create a new view function `render_group_by_dropdown()` that:
  - Displays "Group by" label
  - Shows current selection (None, By Publisher, By Type)
  - Opens a popup/dropdown with options when clicked
- [ ] 3.1.2 Implement dropdown option selection:
  - "None" -> Flat list view
  - "By Publisher" -> Tree view grouped by publisher
  - "By Type" -> Tree view grouped by product type
- [ ] 3.1.3 Use GPUI's popup primitives or implement a custom dropdown if needed
- [ ] 3.1.4 Ensure dropdown closes after selection
- [ ] 3.1.5 Add accessibility labels for screen readers

### 3.2 Implement "View As" Selector

- [ ] 3.2.1 Create a new view function `render_view_as_selector()` that:
  - Displays "View As" label
  - Shows options: "Highlight", "Only Matching"
  - Allows selection of search result presentation mode
- [ ] 3.2.2 Implement toggle or dropdown for the two modes
- [ ] 3.2.3 Update list rendering in real-time when mode changes
- [ ] 3.2.4 Ensure the selector is only visible when search query is non-empty

### 3.3 Implement Parent-Item Matching Checkbox

- [ ] 3.3.1 Create a new view function `render_parent_matching_checkbox()` that:
  - Displays checkbox with label "Include parent items in search"
  - Toggles `search_state.match_parents`
  - Updates filtered list in real-time
- [ ] 3.3.2 Ensure checkbox is only visible in tree view modes (By Publisher or By Type)
- [ ] 3.3.3 Add a tooltip or help text explaining the behavior
- [ ] 3.3.4 Maintain checkbox state when switching between tree view modes

### 3.4 Implement Multi-Section Sort Selector

- [ ] 3.4.1 Replace existing sort cycle buttons with a structured sort selector
- [ ] 3.4.2 Create `render_sort_selector()` that displays two sections:
  - **Sort By Section:**
    - "Alphabetically" button/option
    - "Most Recently Updated" button/option
    - "Date Added" button/option
    - "Date Published" button/option
  - **Direction Section:**
    - "Ascending" button/option
    - "Descending" button/option
- [ ] 3.4.3 Highlight the currently selected sort type and direction
- [ ] 3.4.4 Use visual grouping (spacing, dividers, or section headers) to separate the two sections
- [ ] 3.4.5 Implement click handlers to update `sort_state`
- [ ] 3.4.6 Ensure sort selector updates dynamically when selections change

### 3.5 Update Library List Rendering

- [ ] 3.5.1 Modify `render_library_pane_view()` to apply search highlighting:
  - In Highlight mode, apply visual highlight (color, font weight, or icon) to matching items
  - In Only Matching mode, exclude non-matching items from render
- [ ] 3.5.2 Ensure tree view parent items collapse/expand based on child visibility
- [ ] 3.5.3 Update item count display to reflect filtered results
- [ ] 3.5.4 Ensure rendering is efficient with large seeded datasets (50+ items)

### 3.6 Integrate Controls into Controls Row

- [ ] 3.6.1 Update `render_controls_row()` to include:
  - "Group by" dropdown
  - Search text input
  - "View As" selector
  - Parent-item matching checkbox (conditional on tree view)
  - Sort selector with type and direction sections
- [ ] 3.6.2 Organize controls into logical sections (grouping, search, sorting)
- [ ] 3.6.3 Ensure layout is responsive and does not overflow on smaller screens
- [ ] 3.6.4 Use consistent spacing and styling across all controls

## Phase 4: Integration and Testing

### 4.1 Unit Tests for View Models

- [ ] 4.1.1 Test `LibrarySearchState` methods: set_query, set_view_mode, toggle_match_parents, clear
- [ ] 4.1.2 Test `LibrarySortState` methods: set_sort_type, set_direction, toggle_direction, label
- [ ] 4.1.3 Test `LibraryItemView.matches_search()` with various queries and match scopes
- [ ] 4.1.4 Test `LibraryItemView.sort_key()` for each sort type

### 4.2 Unit Tests for Controller Logic

- [ ] 4.2.1 Test search filtering: query application, case insensitivity, partial matching
- [ ] 4.2.2 Test Highlight vs. Only Matching modes
- [ ] 4.2.3 Test parent-item matching in tree views
- [ ] 4.2.4 Test sorting: each sort type, ascending/descending, date field fallbacks
- [ ] 4.2.5 Test combined search + sort scenarios
- [ ] 4.2.6 Test edge cases: empty query, empty results, single item, all items

### 4.3 GPUI-Level Integration Tests

- [ ] 4.3.1 Test that dropdown opens/closes correctly
- [ ] 4.3.2 Test that search input updates query in real-time
- [ ] 4.3.3 Test that "View As" mode changes affect list rendering
- [ ] 4.3.4 Test that parent-item checkbox is visible only in tree views
- [ ] 4.3.5 Test that sort selector updates sort order
- [ ] 4.3.6 Test interaction between all controls (e.g., search + sort + grouping)

### 4.4 Comprehensive Scenario Tests

- [ ] 4.4.1 User searches for "module" in Highlight mode, sees all publishers with matching items highlighted
- [ ] 4.4.2 User switches to Only Matching mode, sees only matching items with other types hidden
- [ ] 4.4.3 User groups by publisher and searches; can toggle parent matching to show all publishers or only those with matches
- [ ] 4.4.4 User sorts by "Most Recently Updated" descending and verifies order
- [ ] 4.4.5 User switches grouping modes and verifies search/sort persist

### 4.5 Validation with Seeded Data

- [ ] 4.5.1 Run app with seeded data and verify:
  - All dropdowns open and display options correctly
  - Search finds products by name across all publishers and types
  - Highlight mode shows all items with matches visually distinct
  - Only Matching mode hides non-matching items
  - Parent-item checkbox affects tree view grouping
  - Sorting by each type produces correct order
  - Sort direction toggle reverses order

### 4.6 Documentation and Comments

- [ ] 4.6.1 Add doc comments to all public methods and types
- [ ] 4.6.2 Document the search and sort algorithms clearly
- [ ] 4.6.3 Document seeded data structure and how to extend it
- [ ] 4.6.4 Add examples in doc comments showing common use cases

## Phase 5: Polish and Documentation

### 5.1 Keyboard Navigation

- [ ] 5.1.1 Ensure dropdown can be opened/closed with keyboard (e.g., Enter, Space, Escape)
- [ ] 5.1.2 Allow Tab navigation between search input, checkboxes, and sort buttons
- [ ] 5.1.3 Support arrow keys to navigate dropdown options
- [ ] 5.1.4 Test keyboard navigation on macOS and other platforms

### 5.2 Accessibility

- [ ] 5.2.1 Add ARIA labels or accessibility descriptions to dropdowns
- [ ] 5.2.2 Ensure checkboxes have associated labels
- [ ] 5.2.3 Ensure buttons have descriptive text or tooltips
- [ ] 5.2.4 Test with accessibility tools (screen reader, contrast checking)

### 5.3 Visual Polish

- [ ] 5.3.1 Ensure consistent spacing and alignment across control row
- [ ] 5.3.2 Use clear visual hierarchy (labels, active states, hover states)
- [ ] 5.3.3 Ensure highlighted items in Highlight mode are visually distinct (color, weight, or icon)
- [ ] 5.3.4 Test appearance on different window sizes and themes

### 5.4 Performance Validation

- [ ] 5.4.1 Profile search/sort performance with 100+ items
- [ ] 5.4.2 Profile search/sort performance with 1000+ items (if applicable)
- [ ] 5.4.3 Verify rendering is smooth when switching modes or sorting large lists
- [ ] 5.4.4 Identify and address any rendering bottlenecks

### 5.5 Documentation for Developers

- [ ] 5.5.1 Create a `LIBRARY_UI.md` document explaining:
  - Control semantics and user workflows
  - How to extend sort types or search behavior
  - How to update seeded data
  - Performance considerations
- [ ] 5.5.2 Add inline code comments for complex logic
- [ ] 5.5.3 Document any GPUI-specific patterns or limitations encountered
- [ ] 5.5.4 Include screenshots or UI snapshots for reference

### 5.6 Final Validation and Review

- [ ] 5.6.1 Complete smoke test: app launches, all controls render, basic interactions work
- [ ] 5.6.2 Verify all controls align with design decisions from design.md
- [ ] 5.6.3 Review code for consistency with existing codebase style
- [ ] 5.6.4 Verify that seeded data is used in all stub/test scenarios
- [ ] 5.6.5 Ensure parent `dtrpg-app` submodule reference is updated only after validation passes

## Success Criteria

- [ ] All five control types (Group by, Search input, View As, Parent matching, Sort selector) are fully functional
- [ ] Search updates list in real-time as user types
- [ ] Sorting applies correctly across all sort types and directions
- [ ] Tree view grouping (by Publisher and by Type) works correctly with search/sort
- [ ] Parent-item matching toggle works as designed in tree views
- [ ] Seeded data covers at least 15-20 products across 5 publishers and 4 product types
- [ ] All unit and integration tests pass
- [ ] Keyboard navigation is fully supported
- [ ] UI is responsive and renders smoothly with 1000+ items
- [ ] Documentation is clear and complete for future developers
