## MODIFIED Requirements

### Requirement: Shared catalog item interaction MUST distinguish popover and tab detail

The app meta-repository MUST define single-click as opening a non-tab popover detail view and
double-click as opening a closable expanded detail tab with a large thumbnail, item attributes,
and a file list for multi-item entries. The popover MUST remain a lightweight, entry-level summary
regardless of item count. The expanded detail tab's item attributes and multi-item file list are
specified in full by the `shared-catalog-entry-detail-view` capability: an always-visible entry
tier, item metadata collapsed inline for single-item entries, and a persistent selectable item
list for multi-item entries.

#### Scenario: Mapping item interaction into a child frontend

- **WHEN** a child desktop app implements catalog item inspection
- **THEN** it can identify the single-click popover and double-click expanded-tab requirements it
  must satisfy, and reference `shared-catalog-entry-detail-view` for the expanded tab's entry-tier,
  item-tier, and item list behavior rather than redefine it

#### Scenario: Multi-item entry via popover

- **WHEN** a child desktop app implements the single-click popover for a catalog entry with more
  than one item
- **THEN** the popover shows entry-level summary information only, without an item list
