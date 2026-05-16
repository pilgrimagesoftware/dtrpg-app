## Context

The top-level `dtrpg` repository owns the cross-repository main-window layout contract. The `dtrpg-app` meta-repository owns shared desktop frontend behavior and delegates toolkit-specific implementation to the Swift and Rust child repositories.

Existing app-level OpenSpec changes already define baseline library layout and SDK integration. This change builds on that work by defining the complete main-window browsing surface: search/filter controls, account menu, list/tree and grid content presentations, summary counts, and background sync status.

## Goals / Non-Goals

**Goals:**

- Map the top-level main-window layout contract into shared desktop app behavior.
- Keep shared requirements implementation-neutral so Swift/AppKit and Rust/GPUI can satisfy them differently.
- Define the shared state concepts needed by library browsing controls and summary output.
- Require child repositories to implement account and sync affordances without exposing raw access-token values in passive UI.

**Non-Goals:**

- Define AppKit view classes or GPUI components.
- Add new API, SDK, or persistence contracts.
- Implement platform-specific UI code in the app meta-repository.

## Decisions

Use a new shared capability for main-window layout rather than modifying baseline library layout.
Rationale: the baseline capability describes initial shell and state behavior, while this change adds richer browsing, account, and sync requirements.

Treat Swift and Rust as in scope for the first implementation pass.
Rationale: both frontends already have baseline library work in this repository family, and the top-level layout contract is explicitly cross-frontend.

Require one shared library browsing state model conceptually, even if each frontend stores it differently.
Rationale: view switching must preserve the same filtered and sorted result set across list/tree and grid presentations.

## Risks / Trade-offs

- Shared requirements may still be implemented with different visual density. Mitigation: child specs must verify the same required regions, summaries, and non-blocking sync behavior.
- Existing Rust control work may overlap this change. Mitigation: treat the Rust proposal as an implementation mapping that can reuse existing search/sort/grouping work.
- Swift implementation may lag Rust. Mitigation: keep shared requirements explicit and track child task completion separately.
