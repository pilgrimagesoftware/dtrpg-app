## Context

Rust and Swift desktop frontends should implement the same library experience at the product level. The app meta-repo is the correct place to define shared layout and interaction behavior without prescribing language-specific framework details.

## Goals / Non-Goals

**Goals:**
- Define common desktop library shell/layout behavior for both frontends.
- Define shared view-state expectations for baseline (stub-compatible) behavior.
- Delegate language/toolkit specifics to child implementation changes.

**Non-Goals:**
- Define Rust GPUI implementation details.
- Define Swift AppKit implementation details.
- Define backend SDK communication behavior.

## Decisions

Create a language-agnostic parent capability in `dtrpg-app`.
Rationale: one shared product behavior spec should govern both frontends.

Require child changes per language frontend.
Rationale: implementation details differ and should be owned by each submodule.

## Risks / Trade-offs

- Shared requirements might be interpreted differently. Mitigation: keep states and scenarios concrete and testable.
- Child repos may still diverge visually. Mitigation: include explicit shared layout and state scenarios in the parent spec.
