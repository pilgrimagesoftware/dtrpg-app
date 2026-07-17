## 1. Version manifest CI publishing

- [ ] 1.1 Add a manifest-generation step to `.github/workflows/package.yaml`'s `package` job (or a follow-on job that
      runs after the matrix) that writes `manifest.json` with `version`, `tag`, `published_at`, and an `assets` map of
      platform key to download URL, omitting any platform whose `dist/` output is missing.
- [ ] 1.2 Include `manifest.json` in the `artifacts:` input passed to the existing `ncipollo/release-action` step so
      it uploads atomically with the platform packages.
- [ ] 1.3 Verify `nightly.yaml`'s next run publishes a `manifest.json` asset at
      `https://github.com/pilgrimagesoftware/dtrpg-app/releases/download/nightly/manifest.json` and that it replaces
      the previous one on subsequent runs.
- [ ] 1.4 Verify a manual `workflow_dispatch` (or scratch tag) run of `release.yaml` publishes a `manifest.json`
      asset under the computed semver tag.

## 2. App-side manifest fetch and version comparison

- [ ] 2.1 Add the `semver` crate as a workspace dependency for tagged-release version comparison.
- [ ] 2.2 Add an `UpdateCheckController` (or equivalent) that fetches `manifest.json` via the existing `reqwest`
      client, parses it, and compares against `CARGO_PKG_VERSION` (or the nightly build's publish-date comparison
      when built as a nightly).
- [ ] 2.3 Add a compile-time nightly-build flag/feature so the running binary knows which channel's manifest to
      compare against.
- [ ] 2.4 Ensure the fetch runs off the UI thread / as a non-blocking background task and never delays shell startup
      or interaction.

## 3. Notification banner integration

- [ ] 3.1 Add `NoticeKind::UpdateAvailable` and `NoticeAction::OpenUpdateUrl(String)` to
      `crates/dtrpg-ui/src/data/notification.rs`.
- [ ] 3.2 Wire `UpdateCheckController`'s notices into the same aggregation path `root_view.rs` already uses to build
      `render_notification_banner`'s input, alongside `AuthStateController`'s notices.
- [ ] 3.3 Implement dismiss behavior for the update-available notice: hides for the remainder of the session without
      triggering a re-fetch or re-compare.
- [ ] 3.4 Implement the manual-check-only "up to date" and "error" acknowledgment UI (distinct from the persistent
      banner, since these are one-shot responses to an explicit user action).

## 4. App menu item

- [ ] 4.1 Add `MenuItem::action(t!("menu.app_check_for_updates"), CheckForUpdates)` to the app menu block in
      `build_menus` (`crates/dtrpg-ui/src/ui/app/mod.rs`), directly below the `About` item.
- [ ] 4.2 Add a `CheckForUpdates` action type and route it through the shared command model to trigger an immediate
      `UpdateCheckController` fetch (bypassing the periodic-interval gate).

## 5. Startup and periodic scheduling

- [ ] 5.1 Trigger the first automatic update check once initial session restoration completes during app startup.
- [ ] 5.2 Add a periodic recheck (default 24h interval) via a GPUI background task while the app remains running.
- [ ] 5.3 Ensure automatic (non-manual) check failures are logged only, with no user-facing error notification.

## 6. Localization

- [ ] 6.1 Add `menu.app_check_for_updates` and any update-banner/acknowledgment strings to the app's i18n translation
      files, with English as the fallback locale.

## 7. Validation

- [ ] 7.1 Unit-test `UpdateCheckController`'s version comparison logic (semver and nightly publish-date paths) against
      fixture manifests, including the "no update," "update available," and "unparseable manifest" cases.
- [ ] 7.2 Unit-test notice aggregation in `root_view.rs`'s banner input path with both auth and update notices present
      simultaneously.
- [ ] 7.3 Run `cargo fmt --check`, `cargo clippy --all-targets --all-features -- -D warnings`, and
      `cargo test --workspace` to confirm no regressions.
- [ ] 7.4 Manually verify end-to-end against a real published manifest (nightly or a scratch tag) before merging:
      menu-triggered check, startup check, and banner dismiss behavior.
