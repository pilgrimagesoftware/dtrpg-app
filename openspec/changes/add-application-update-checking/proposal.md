## Why

The app has no way for a user to learn a newer version exists. `release.yaml` and `nightly.yaml` already publish tagged and nightly GitHub Releases with platform packages, but nothing in the app or in CI exposes the latest published version in a form the app can check against, and nothing in the app checks it. Users must manually watch the GitHub Releases page.

## What Changes

- Add a "Check for Updates" menu item to the app-level menu (Rust GPUI shell), alongside the existing `About`/`Settings` items.
- Add an automatic update check that runs on app startup (and periodically while running) and surfaces a dismissible notification banner in the shell when a newer version is available.
- Add a version manifest step to the release build: `release.yaml` (tagged releases) and `nightly.yaml` publish a small JSON manifest (version, tag, per-platform asset URLs, published date) as a release asset alongside the packaged binaries, so the running app has a stable, versioned location to fetch "latest" from without depending on GitHub's release-listing API shape.
- The update check compares the running app's version (from `Cargo.toml` / build-time version) against the fetched manifest's version using semantic version comparison, ignoring the `nightly` channel unless the running build is itself a nightly build.
- Manual "Check for Updates" and the automatic background check share the same fetch/compare/notify path; manual checks additionally show a "you're up to date" or error state since the user explicitly asked.

## Capabilities

### New Capabilities
- `app-update-checking`: Menu-triggered and automatic checks against a published version manifest, with a notification banner presenting available updates and a manual "up to date"/error acknowledgment.
- `release-version-manifest`: Publishing a machine-readable version manifest as a release asset from the existing nightly and tagged release CI workflows.

### Modified Capabilities
(none — no existing `openspec/specs/` capability governs update checking or release manifest publishing)

## Impact

- Affected code: `rust/crates/dtrpg-ui/src/ui/app/mod.rs` (menu registration), a new update-check service/controller in the Rust app, a new notification banner UI component (or reuse of an existing banner/toast pattern if one exists).
- Affected CI: `.github/workflows/release.yaml`, `.github/workflows/nightly.yaml`, and/or the shared `package.yaml` reusable workflow, to generate and upload the version manifest.
- New network dependency: the running app makes an outbound HTTPS request to GitHub (releases API or a fixed manifest asset URL) to check for updates; this must be non-blocking and fail silently (log only) for the automatic path.
- Localization: new `menu.*` and notification-banner strings need entries in the app's i18n translation files.
