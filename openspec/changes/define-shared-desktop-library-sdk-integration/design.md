## Context

Both desktop frontends will replace baseline stubs with SDK-backed communication. The app meta-repository should define shared product behavior for backend-driven loading, error handling, retry, and session-aware recovery while leaving SDK and toolkit mechanics to child repos.

## Goals / Non-Goals

**Goals:**
- Define shared backend integration behavior expected in both desktop frontends.
- Keep user-visible request and recovery behavior consistent across implementations.
- Delegate language-specific adapter and SDK usage details to child changes.

**Non-Goals:**
- Define Rust SDK adapter code details.
- Define Swift SDK adapter code details.
- Redefine SDK or API contracts in app-level specs.

## Decisions

Define shared integration behavior in a parent app-meta capability.
Rationale: both desktop apps should converge on one product-level request/recovery model.

Require separate Rust and Swift child integration changes.
Rationale: each frontend has different implementation constraints while sharing behavior requirements.

## Risks / Trade-offs

- Network and SDK behavior may differ by platform. Mitigation: keep shared scenarios outcome-oriented, not implementation-specific.
- Error mapping may drift. Mitigation: include explicit shared recovery-state scenarios.
