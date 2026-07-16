## 1. Storage settings: concurrency stepper

- [ ] 1.1 Add `max_concurrent_downloads_input: Entity<InputState>` to `SettingsController`,
      initialized with the current `max_concurrent_downloads` value and a digits-only pattern.
- [ ] 1.2 Subscribe to `NumberInputEvent::Step` for that entity; on `Increment`/`Decrement`, clamp
      against `MIN_CONCURRENT_DOWNLOADS`/`MAX_CONCURRENT_DOWNLOADS` and call
      `set_max_concurrent_downloads`, mirroring current guard logic.
- [ ] 1.3 Replace `render_concurrency_stepper`'s body with `NumberInput::new(&input).small()`,
      keeping the existing label/note row wrapper.
- [ ] 1.4 Remove the now-unused manual div/tooltip/on_click code for the concurrency stepper.

## 2. Appearance settings: text scale control

- [ ] 2.1 Add a `text_scale_input: Entity<InputState>` to the appearance view's owning controller,
      initialized from the current `scale` value formatted as `"{:.1}"`.
- [ ] 2.2 Subscribe to `NumberInputEvent::Step` for that entity; on `Increment`/`Decrement`, apply
      `UI_TEXT_SCALE_STEP`, clamp between `MIN_UI_TEXT_SCALE`/`MAX_UI_TEXT_SCALE`, and call
      `set_ui_text_size` with the scaled pixel value, mirroring current guard logic.
- [ ] 2.3 Replace `text_scale_row`'s body with `NumberInput::new(&input).small()`, keeping the
      existing label row wrapper.
- [ ] 2.4 Remove the now-unused manual div/tooltip/on_click code for the text scale row.

## 3. Verification

- [ ] 3.1 Run `cargo clippy --all-targets --all-features -- -D warnings` and `cargo fmt --all --
      --check` for the affected crate.
- [ ] 3.2 Manually verify (or ask the user to verify) both controls in the running app: value
      display, increment/decrement buttons, min/max clamping, and that existing tooltips/labels
      still read correctly.
- [ ] 3.3 Confirm no other hand-rolled stepper/number controls remain via
      `grep -rn "stepper" rust/crates/dtrpg-ui/src` beyond the two addressed here.
