# Proposal

## Why

Users have no in-app way to report a bug or request a feature; they have to find the right GitHub repository and file an issue manually, with no app version, build, or platform context attached. Pilgrimage Software's other two desktop products (Knot and Fernrohr) both already solve this with a Help-menu item and a small dialog that composes a GitHub issue. dtrpg-app should define the same shared, language-agnostic baseline so the Rust (and eventually Swift) frontend behaves consistently with the rest of the product family.

## What Changes

- Define a shared "Report a Feature/Bug" menu item, available from the app's Help menu and from the title bar account dropdown, that opens a report dialog.
- Define the shared dialog contents: a Bug/Feature Request kind selector, a required subject field, a required description field, and read-only diagnostic context (app version, build identifier, platform) appended automatically.
- Define the shared submission behavior: compose a pre-filled "new issue" URL for the project's GitHub repository (subject, description, kind label, and diagnostics in the body) and open it in the user's default browser. No credentials, tokens, or background API/CLI calls are required.
- Require a child implementation change in `dtrpg-app/rust` (gpui) to realize this baseline using the existing `gpui_component::dialog` + `window.open_dialog` pattern and the existing app menu / title-bar account menu wiring.
- Out of scope: Knot's richer `gh`-CLI direct-filing path and shared `knot-forge`-style crate. Neither sibling app shares that code today, and the browser-handoff approach (as used by Fernrohr) is sufficient for parity without adding a new local dependency on the `gh` CLI or an API token.

## Capabilities

### New Capabilities
- `shared-report-feature-bug`: Defines language-agnostic desktop behavior for reporting a bug or feature request — Help-menu and account-menu entry points, dialog fields (kind, subject, description, diagnostics), and browser-handoff submission to a pre-filled GitHub issue URL.

## Impact

- `dtrpg-app/openspec`: Parent language-agnostic behavior definition (this change).
- `dtrpg-app/rust`: Child implementation change — new menu item in `crates/dtrpg-ui/src/ui/app/mod.rs` (app menu) and `crates/dtrpg-ui/src/ui/views/title_bar_view.rs` (account dropdown), new dialog view following `manage_collections_dialog.rs`'s `gpui_component::dialog` pattern, and a URL-composition helper using `cx.open_url()`.
- `dtrpg-app/swift`: Not implemented by this change; tracked as future parity work once the Swift frontend needs it.
