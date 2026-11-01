# Shapes and scenarios (built, Task 831)

Tom, 2026-10-24: *"Am I hearing that shapes have no alternative or scenarios? Don't we need to
design them to use our scenario system with respect to 'Is active'?"*

## What was built (option B, with Tom's one change)

Tom, 2026-10-24: *"As for category, I agree with lumping shapes into the Presentation category"* and
*"No elements act jointly."* So a Shape's only scenario value is `active`, in the **Presentation**
category (not `text`), and each Shape switches by itself, as each Text does; nothing ties a Shape to a
Text.

- Override key `s:<id>`; `LPN_OVERRIDABLE.shape = { active }`, `LPN_ALT_CATEGORY_OF.shape`. The silent
  fallback of `ovKeyGroup()` to `node` is gone: an unknown prefix answers `unknown`, which reads as
  User data and is nobody's element.
- An inactive Shape is not drawn, so it cannot be hit, snapped to, caught by a marquee or counted in
  Zoom to extent (`buildShapeEls()`); it stays in the Shapes table, where Is active switches it. One
  Shape selected opens the multi-properties box, which carries the same row.
- Drawn, pasted or imported inside a scenario other than Base, a Shape is born by `bornInScenario()`:
  inactive in Base, active there. The import receipts say so ("Shapes appear in {scenario} only.");
  in Base they still say "Shapes appear in every scenario."
- Delete in a scenario switches a Base Shape off there; a Shape that exists only there is deleted, with
  its overrides. In Base a real delete takes every scenario's overrides, after the count question.
- GeoJSON and DXF export write the open scenario's active Shapes. The project file keeps them all.
- Points stay Base's (option C stays rejected). Harnesses: `shape-scenario-browser-harness.js`,
  `scenario-io-names-browser-harness.js` (the receipts), `scenario_seam_check.php`.
