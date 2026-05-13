## Why

The Rust desktop application library view requires fully functional UI controls to enable users to effectively browse, search, organize, and sort their product library. The current GPUI baseline has placeholder controls that cycle through modes without real search filtering, proper dropdown presentation, or complete sort options. This change defines the architecture and behavior required to make the library view a complete, production-ready feature for managing a product collection.

## What Changes

- Restructure the library view controls to use proper dropdown/popup selectors for "Group by" and "View As" modes instead of cycling buttons.
- Implement functional text search that filters library items in real-time and updates the displayed list according to the selected "View As" behavior.
- Add a functional checkbox to toggle whether parent-level items in tree view modes are matched against search text.
- Restructure the sort selector to present sort type options (Alphabetically, Most Recently Updated, Date Added, Date Published) and direction (ascending/descending) in distinct, organized sections.
- Ensure all view models derive from SDK library models (`OrderProductAttributes`, `PublisherAttributes`) to maintain consistency with the backend API contract.
- Provide comprehensive dummy/seeded data that matches the structure and semantics of real SDK models for development and testing.
- Require all UI controls to be fully functional as specified, with no deferred behavior.

## Capabilities

### New Capabilities
- `rust-library-ui-search`: Functional text search input that filters library items and updates visibility according to match scope settings.
- `rust-library-ui-grouping`: Production-ready "Group by" dropdown with None, By Publisher, and By Type options that organize library items into appropriate hierarchies.
- `rust-library-ui-view-scope`: "View As" selector with Highlight and Only Matching options that control how search results are presented to the user.
- `rust-library-ui-parent-matching`: Optional checkbox to include parent-level items in tree view modes when matching against search text.
- `rust-library-ui-sorting`: Multi-level sort selector with distinct sections for sort type and direction, supporting four sort types and ascending/descending options.
- `rust-library-ui-sdk-models`: View models and dummy data derived from Rust SDK library models to ensure consistency and enable realistic testing.

### Modified Capabilities
- `rust-app-gpui-shell`: Library view controls are enhanced as an additive implementation, preserving the existing shell architecture.

## Impact

- `dtrpg-app/rust`: Restructures library view controls, adds new view models for search/sort state, and provides realistic test data derived from SDK models.
- `dtrpg-sdk/rust`: No changes; app consumes existing library models (`OrderProductAttributes`, `PublisherAttributes`, `OrderProductFile`).
- UI/UX: Users can now effectively organize, search, and sort their library with native dropdown controls and real-time search feedback.
- Dependencies: No new dependencies beyond what the `migrate-rust-app-ui-to-gpui` change already established.

## Constraints and Assumptions

- This change does not implement data persistence or backend integration for search/sort state; those are deferred to a separate sync-state change.
- The "View As" behavior applies only to flat-list and tree-view modes; sorting and search work consistently across all modes.
- Search matching is case-insensitive and matches product names, publisher names (when "Group by" is "By Publisher"), and product types (when "Group by" is "By Type").
- Sort options for date-based fields (Most Recently Updated, Date Added, Date Published) use the SDK-provided date fields (`fileLastModified`, `datePurchased`, etc.) or fallback to `added_order` and `updated_order` if dates are not available.
- The checkbox to match parent items in tree view modes only affects filtering behavior; it does not change how items are grouped or organized.
- All UI controls are fully functional without backend calls; search and sort operate on in-memory library data loaded by the existing service layer.
