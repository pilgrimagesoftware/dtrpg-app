## ADDED Requirements

### Requirement: Release builds must publish a version manifest
The nightly and tagged release CI workflows SHALL publish a machine-readable version manifest as a release asset
alongside the packaged platform binaries, at a predictable, versioned URL.

#### Scenario: Tagged release publishes a manifest
- **WHEN** `release.yaml` publishes a tagged GitHub Release with packaged platform binaries
- **THEN** it also uploads a `manifest.json` release asset containing the release's version, tag, publish timestamp,
  and per-platform asset download URLs

#### Scenario: Nightly build publishes a manifest
- **WHEN** `nightly.yaml` publishes or updates the `nightly` pre-release with packaged platform binaries
- **THEN** it also uploads a `manifest.json` release asset reflecting the current nightly build's version, tag, and
  publish timestamp, replacing the previous nightly manifest

#### Scenario: A platform build fails
- **WHEN** one platform's package build fails or is skipped (for example the Windows leg running with
  `continue-on-error`)
- **THEN** the published manifest omits that platform's asset entry rather than failing manifest generation for the
  other platforms

### Requirement: Manifest publishing must be atomic with release publishing
The version manifest SHALL be uploaded in the same release-publishing step as the platform packages, so it cannot
become visible to clients before or after the packages it describes.

#### Scenario: Release assets and manifest appear together
- **WHEN** a GitHub Release (tagged or nightly) becomes visible with its platform package assets attached
- **THEN** the manifest asset for that same release is already present, not uploaded in a separate follow-up step
