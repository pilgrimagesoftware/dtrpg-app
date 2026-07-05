## Context

Rust and Swift desktop frontends should present settings identically at the product level even though their window mechanics differ (gpui `cx.open_window` vs. AppKit `NSWindow`). The app meta-repo is the correct place to define that shared presentation behavior without prescribing either toolkit's implementation.

## Goals / Non-Goals

**Goals:**
- Define shared settings window presentation behavior: separate non-modal window, single-instance reuse, state persistence across close/reopen, no-quit-on-close.
- Delegate language/toolkit specifics (how a window is opened, tracked, and closed) to child implementation changes.

**Non-Goals:**
- Define Rust gpui implementation details (window handle tracking, controller entity sharing).
- Define Swift AppKit implementation details (NSWindowController lifecycle, window delegate methods).
- Define what settings contains or how its data is persisted — this is presentation-only.

## Decisions

Create a language-agnostic parent capability in `dtrpg-app`, mirroring the `shared-library-ui-layout` precedent.
Rationale: window presentation is a product decision, not a toolkit constraint, so one shared spec should govern both frontends and prevent them from drifting into different presentation models (e.g. one frontend keeping an overlay while the other uses a window).

Require child changes per language frontend rather than describing window mechanics here.
Rationale: gpui and AppKit have fundamentally different window APIs; implementation details belong with the submodule that owns that stack.

## Risks / Trade-offs

- [Risk] Shared requirements are interpreted differently in each toolkit (e.g. what "brings to front" means). → Mitigation: keep scenarios concrete and testable (single window, no duplicates, main window stays interactive) so each child change can verify against the same acceptance criteria.
- [Risk] One frontend implements this baseline before the other, leaving inconsistent behavior temporarily. → Mitigation: acceptable transitional state; each child change stands on its own and is tracked independently in tasks.md.
