## Context

`settings_storage_view.rs` and `settings_appearance_view.rs` each build a stepper by hand: a
32px/28px div with `.on_click`, a fixed-width value div, and a mirrored increment div, all wired
to entity closures that call into `SettingsController`/`LibraryController` setters. `gpui-component`
already ships `NumberInput` (`gpui_component::input::{InputState, NumberInput, NumberInputEvent,
StepAction}`) with the same increment/decrement affordance, keyboard step support (arrow keys), and
scroll-step support, none of which the hand-rolled version has.

## Goals / Non-Goals

**Goals:**
- Replace both hand-rolled steppers with `NumberInput` while preserving current min/max clamping
  and the surrounding label/note row layout.
- Keep the change confined to the two view files plus the minimal controller state needed to own
  each `Entity<InputState>`.

**Non-Goals:**
- Not introducing a shared wrapper/helper component for "labeled numeric setting row" — only two
  call sites exist today, so a wrapper is premature abstraction.
- Not changing the persisted value types, ranges, or step sizes (`MIN`/`MAX_CONCURRENT_DOWNLOADS`,
  `MIN`/`MAX_UI_TEXT_SCALE`, `UI_TEXT_SCALE_STEP`) — those stay as-is.
- Not migrating other numeric-looking controls (e.g. font size pickers using dropdowns) — only the
  two stepper rows identified in the proposal.

## Decisions

- **Own `InputState` in the existing controller structs** rather than the view functions, since
  `InputState` is an `Entity` that must survive across renders and the controller already owns
  equivalent entities. `SettingsController` gains `max_concurrent_downloads_input:
  Entity<InputState>`; `LibraryController` (or wherever the appearance view's state lives) gains
  `text_scale_input: Entity<InputState>`.
- **Validate in the `NumberInputEvent::Step` handler**, mirroring the existing `if value >
  MIN/< MAX` guards, rather than relying solely on `InputState::pattern` regex validation — regex
  can constrain digit shape but not the numeric bounds check.
- **Use `NumberInput::small()`** to match the existing 28-32px compact row sizing rather than the
  medium default.
- **Format the text-scale value through `InputState::set_value` with the same `"{:.1}"` formatting**
  already used, so displayed precision doesn't change.

## Risks / Trade-offs

- [`NumberInput` renders as a text-editable field, not just two buttons and a static label] →
  Acceptable and arguably an improvement (direct entry becomes possible); confirm tooltips move to
  the `NumberInput`'s prefix/suffix slots or stay on a wrapping label since the increment/decrement
  buttons are now internal to the component and not directly tooltip-able the same way.
- [Losing the exact custom border/rounding styling (`rounded(px(6.0))` vs `rounded(px(8.0))` per
  view)] → `NumberInput` has its own default appearance; use `.appearance(false)` plus existing
  container styling only if visual parity is required, otherwise accept the component's default
  look as the new standard.

## Migration Plan

1. Add `NumberInput`-backed state to the controller owning each stepper.
2. Swap the render function body to build `NumberInput::new(&state).small()`.
3. Subscribe to `NumberInputEvent::Step` in place of the two `on_click` closures, keeping the same
   clamping logic.
4. Remove the now-dead manual div/tooltip/click-handler code.
5. No data migration or rollback complexity — this is a pure UI control swap with no persisted
   format change.
