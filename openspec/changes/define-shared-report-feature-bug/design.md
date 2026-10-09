# Design

## Context

See proposal.md - Why. Knot (`App/crates/knot/src/bug_report/`) and Fernrohr (`App/app/src/ui/report_issue.rs`) both already ship this feature independently, with no shared crate between them. Knot's version shells out to the local `gh` CLI via its own `knot-forge` crate, falling back to a browser URL when `gh` is unavailable or unauthenticated. Fernrohr's version only ever opens a pre-filled GitHub "new issue" URL via `cx.open_url()` — no CLI dependency, no token, no async submission state.

In dtrpg-app/rust, `gpui_component::dialog` + `WindowExt::open_dialog` is already the established modal pattern (used by `manage_collections_dialog.rs`). The app menu (`crates/dtrpg-ui/src/ui/app/mod.rs`) and the title bar account dropdown (`crates/dtrpg-ui/src/ui/views/title_bar_view.rs`) are both established places to register new actions/menu items. `reqwest` and `sentry` are already workspace dependencies but are not needed here; no `octocrab` or other GitHub API client is present.

## Goals / Non-Goals

**Goals:**
- Match Fernrohr's simpler, dependency-free submission mechanism (browser handoff to a pre-filled GitHub issue URL) rather than Knot's `gh`-CLI/`knot-forge` approach.
- Reuse existing dtrpg-app UI primitives (`gpui_component::dialog`, existing menu/action wiring) rather than introducing new modal or menu infrastructure.
- Keep the shared spec (`shared-report-feature-bug`) language-agnostic so a future Swift implementation can follow the same contract without depending on this change's Rust code.

**Non-Goals:**
- No local `gh` CLI shell-out, no new shared cross-repo crate equivalent to `knot-forge`.
- No background network submission, no stored GitHub token or authenticated API call.
- No Swift implementation in this change.

## Decisions

- **Submission mechanism: browser-URL handoff (Fernrohr pattern), not `gh` CLI (Knot pattern).** Rationale: avoids a new runtime dependency on the `gh` binary being installed and authenticated on the user's machine, avoids maintaining a `ForgeRunner`-style abstraction and its `--label bug|enhancement` mapping, and keeps submission synchronous (no `Phase::Submitting`/failure state machine needed). Alternative considered: port Knot's `knot-forge` crate as a new shared dependency — rejected because neither sibling app treats it as a shared package today (Fernrohr's own code comments explicitly decline to depend on it), so adopting it here would mean maintaining a three-way integration contract with no existing precedent.
- **Entry points: Help menu + account dropdown, matching Knot; Fernrohr only wires the Help menu.** Rationale: the proposal and existing dtrpg-app title bar account menu (Settings, Sign out) already group app-lifecycle-adjacent actions there, so adding Report alongside them is consistent with dtrpg-app's existing structure, not just sibling-app parity.
- **Kind selector (Bug/Feature Request) included, matching Knot; Fernrohr has none.** Rationale: cheap to add, and the proposal title names both report types explicitly. Implemented as a two-option radio-style control in the dialog, with the selection mapped to a label prefix (e.g. `[Bug]`/`[Feature Request]`) in the composed issue title rather than a GitHub label (since there is no authenticated API call to apply a label with).
- **No log attachment support (Knot has this; Fernrohr does not).** Rationale: log attachment requires either an authenticated upload path or inlining log content into the URL-encoded issue body, which risks exceeding URL length limits and leaking local file paths; out of scope for this baseline.
- **Diagnostics source: `env!("CARGO_PKG_VERSION")` plus a platform string, not a dedicated build-info file.** Rationale: no existing build-info/git-sha mechanism was found in dtrpg-app/rust; introducing one is unnecessary scope for this change. If build-identifier granularity beyond semver version is later needed, that is a separate concern for app packaging, not this feature.

## Risks / Trade-offs

- [Composed issue body exceeds practical URL length for very long descriptions] → Dialog's description field has no hard length limit in the spec; mitigate in implementation with a soft character counter/warning rather than a hard cap, consistent with Fernrohr's approach of trusting the user.
- [No kind → GitHub label mapping without an authenticated API call means triage still requires a human to apply the right label] → Accepted trade-off; matches Fernrohr's existing production behavior and is a one-time manual step in the GitHub web UI the maintainer already does today.
- [GitHub repository URL is hardcoded per-app] → Each app's implementation must point at `dtrpg-app`'s own repository; this is a one-line constant, not a config surface, consistent with how Fernrohr hardcodes its own repo.

## Migration Plan

Net-new feature; no existing behavior changes and no data migration. Ships as a normal feature addition in `dtrpg-app/rust`; rollback is a straightforward revert of the menu/dialog addition.
