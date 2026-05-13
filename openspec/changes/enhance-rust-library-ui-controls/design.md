## Context

The Rust desktop app currently implements the GPUI shell with placeholder library controls that demonstrate navigation and state transitions but do not provide full search, sort, and filtering functionality. Users need a complete, intuitive control panel to organize their library by different hierarchies, search for specific products, and sort results by meaningful criteria.

The design must:
1. Present controls in a cohesive UI that feels native to GPUI and modern desktop applications.
2. Make search, sort, and grouping options discoverable and easy to use.
3. Ensure all filtering and sorting happens in real-time on in-memory data.
4. Base all data models on the Rust SDK's library structures to maintain consistency with the API contract.
5. Provide realistic dummy data that exercises all UI modes and search/sort scenarios.

## Goals / Non-Goals

**Goals:**
- Implement a fully functional "Group by" dropdown selector with None, By Publisher, and By Type options.
- Implement a fully functional "View As" selector with Highlight and Only Matching options for search result presentation.
- Implement a functional text search input that filters items based on selected matching scope.
- Implement an optional checkbox to include parent items in tree view matching.
- Implement a multi-section sort selector with type options (Alphabetically, Most Recently Updated, Date Added, Date Published) and direction (ascending/descending).
- Provide view models that derive from SDK models and support all specified control behaviors.
- Provide comprehensive seeded data that covers multiple publishers, product types, and date ranges.
- Ensure all controls are fully functional without backend integration.
- Make the controls layout clean, organized, and navigable via both mouse and keyboard (where applicable).

**Non-Goals:**
- Implement backend persistence for search/sort/filter state.
- Implement synchronization of UI state with a backend service.
- Add filtering options beyond search text and parent-item matching.
- Change the existing shell architecture or state management patterns.
- Implement complex animations or transitions (use GPUI's built-in styling).
- Support complex query syntax (search is simple substring matching).
- Add data export, import, or batch operations.

## Decisions

### 1. Dropdown/Popup for "Group by" and "View As"

Use GPUI's built-in popup or context-menu mechanisms to present "Group by" and "View As" as proper dropdowns rather than cycling buttons.

**Rationale:** Cycling buttons do not scale to more than 2-3 options, and dropdowns are the standard UX pattern for mode selection. This makes the options immediately visible and reduces cognitive load. Users can see all options before committing to a choice.

**Alternative considered:** Keep cycling buttons. This would be simpler to implement but limits extensibility and violates standard UI expectations.

### 2. Real-Time Search Filtering

Implement search as a text input that immediately filters and re-renders the library list as the user types.

**Rationale:** Real-time feedback is expected in modern applications and helps users quickly validate that their search term is finding the right items. Debouncing is not necessary since filtering happens on in-memory data without network latency.

**Alternative considered:** Add a "Search" button that requires explicit action. This reduces immediate feedback and makes the UI feel slower.

### 3. Search Scope: Highlight vs. Only Matching

Provide a "View As" selector with two modes:
- **Highlight:** Shows all items, but visually highlights items that match the search text.
- **Only Matching:** Hides all items that do not match the search text.

**Rationale:** Different users prefer different workflows. Some want to see context (all publishers/types) while identifying matches; others want to focus on matches only. Offering both modes accommodates different preferences.

**Alternative considered:** Only offer "Only Matching" for simplicity. This would satisfy most use cases but would not serve users who want to maintain visual context.

### 4. Parent-Item Matching Checkbox

Add an optional checkbox to control whether parent-level items (publishers or product types) are included in search matching.

**Rationale:** In tree view, users may want to search within a known publisher or product type without the parent item itself matching. For example, searching for "module" should not hide the "PDF" category just because it does not contain the word "module." The checkbox gives users control over this behavior.

**Alternative considered:** Always include parent items in matching. This could hide entire categories unexpectedly and frustrate users.

### 5. Sort with Distinct Type and Direction Sections

Structure the sort selector into two conceptual sections:
- **Sort By:** Alphabetically, Most Recently Updated, Date Added, Date Published
- **Direction:** Ascending, Descending

Use visual or layout grouping (dividers, spacing, or section headers) to make these sections clear.

**Rationale:** This structure scales well, makes the sort options self-documenting, and allows future expansion. Users immediately understand that they are choosing both what to sort by and in which direction.

**Alternative considered:** Combine options into a single flat list (e.g., "A-Z", "Z-A", "Newest Updated", etc.). This quickly becomes cluttered and does not scale well to future sort types.

### 6. View Models Derived from SDK Library Models

Create view models that wrap or derive from `OrderProductAttributes`, `PublisherAttributes`, and `OrderProductFile` to ensure consistency with the API contract.

**Rationale:** The app layer must remain faithful to the SDK contract. Deriving view models from SDK types ensures that any future SDK changes flow naturally into the UI layer. This also makes the relationship between UI state and SDK state explicit.

**Alternative considered:** Create independent view models. This decouples the UI layer but introduces the risk of divergence and requires manual synchronization logic.

### 7. Comprehensive Seeded Test Data

Provide dummy data covering:
- Multiple publishers (at least 3-5 realistic ones).
- Multiple product types (PDF, VTT Module, Foundry VTT Module, etc.).
- Mix of recent and older products.
- Variation in date fields to exercise all sort options.
- Products with and without optional fields (e.g., `fileLastModified`, `datePublished`).

**Rationale:** Realistic test data helps developers and designers validate UI behavior without hitting a live API. It also serves as documentation for what data structures look like.

**Alternative considered:** Minimal dummy data with one publisher and one type. This saves time but does not exercise the full range of UI behavior.

### 8. Real-Time Filtering on In-Memory Data

All search, sort, and filter operations happen on the in-memory data loaded by the library service layer. No backend calls occur.

**Rationale:** Simplifies the initial implementation, keeps the UI responsive, and allows development to proceed without backend integration. Backend sync can be added later as a separate change.

**Alternative considered:** Make backend calls for filtered results. This would require network infrastructure and defers more work to the backend.

## Rollout Order

1. **Phase 1: View Models and Seeded Data**
   - Create `LibrarySearchState` view model to track search query and match scope.
   - Create `LibrarySortState` view model to track sort type and direction.
   - Create `LibraryItemView` model derived from SDK `OrderProductAttributes`.
   - Create comprehensive seeded test data covering publishers, types, and dates.

2. **Phase 2: Search and Filter Logic**
   - Implement search filtering logic in the library controller.
   - Implement highlight vs. only-matching behavior.
   - Implement parent-item matching toggle.
   - Update library list rendering to reflect filtered results.

3. **Phase 3: UI Controls**
   - Implement "Group by" dropdown with None, By Publisher, By Type options.
   - Implement "View As" selector with Highlight and Only Matching options.
   - Implement parent-item matching checkbox.
   - Replace sort cycle buttons with a structured sort selector showing type and direction sections.

4. **Phase 4: Integration and Testing**
   - Ensure all controls work together without conflicts.
   - Add comprehensive tests for search, sort, and filter logic.
   - Add GPUI-level tests for control rendering and interaction.
   - Validate that seeded data exercises all UI modes.

5. **Phase 5: Polish and Documentation**
   - Ensure controls are accessible via keyboard navigation.
   - Document the control semantics for future developers.
   - Validate that the UI feels responsive and polished.

## Risks / Trade-offs

- **Complexity of search/sort logic:** Implementing proper case-insensitive search, date-based sorting, and tree view filtering adds complexity. *Mitigation:* Start with simple substring matching and alphabetical sorting; incrementally add complexity with tests for each feature.

- **GPUI dropdown/popup limitations:** GPUI may not have all the dropdown features of native platforms. *Mitigation:* Profile GPUI's popup capabilities early; if they are insufficient, implement a custom dropdown view that fits GPUI's compositional model.

- **Seeded data maintenance:** As SDK models evolve, seeded data must be kept in sync. *Mitigation:* Document the seeded data structure as a reference and make it easy to update when SDK changes occur.

- **Performance with large libraries:** Sorting and filtering large lists (1000+ items) on the main thread could block rendering. *Mitigation:* Profile performance with realistic data sizes; if needed, defer filtering to a background thread and update UI with results.

- **Parent-item matching semantics:** The behavior of parent matching in nested trees could be confusing if not explained well. *Mitigation:* Include a clear label or tooltip on the checkbox explaining the behavior.

## Open Questions

- Should search match product descriptions in addition to names? (Deferred: descriptions not currently in SDK model.)
- Should the sort selector support custom sort presets (e.g., "My Favorites")? (Out of scope for this change.)
- Should highlighting use color, icons, or both? (Defer to UI styling phase.)
- Should the parent-item matching checkbox be visible only when in tree view modes? (Recommend yes, but verify with designers.)
- What is the maximum library size we should optimize for in this phase? (Assume &lt; 10,000 items for now.)
