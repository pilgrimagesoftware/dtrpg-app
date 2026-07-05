# DriveThruRPG desktop application

Meta-repository organizing the DriveThruRPG desktop application implementations.

## Submodules

- `rust` - Rust-based desktop application (macOS, Windows, Linux; gpui UI framework)
- `swift` - Swift-based desktop application (macOS)
- `finder` - DriveThruRPG finder component

## Setup

```bash
git clone --recursive git@github.com:pilgrimagesoftware/dtrpg-app.git
# or, after a non-recursive clone
git submodule update --init --recursive
```

## Updating Submodules

```bash
git submodule update --remote --merge
```

See the top-level [dtrpg](https://github.com/pilgrimagesoftware/dtrpg) repository for
submodule workflow, branching, and commit message conventions.
