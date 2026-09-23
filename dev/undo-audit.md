# Undo audit -- the looped-network map page

Written 2026-09-22/23, after Tom reported: *"When I change Base demand, Ctrl+Z or the Undo button
don't put it back to what it was. I guess we need to do a deep audit of Undo to ensure that
everything is undoable."*

**How this was tested.** Every row below marked "measured" was driven through the actual page code
(`js/looped-network.js`) in a headless test -- the real functions, the real DOM elements the popup
and the Tables pane build, the real `undo()` -- not read and reasoned about. Rows marked "read"
were checked by reading the source closely (in most cases finding the exact matching call, or the
exact matching gap, that the measured rows also show) but were not separately driven end to end;
they are ranked lower in confidence for that reason. Nothing in this file is a guess.

## What was actually wrong with Base demand

**The short version: editing Base demand never told the undo system that anything had happened.**
Every OTHER kind of edit on this page -- ticking a checkbox, choosing a pump curve, editing a
custom property, deleting a demand row -- takes a snapshot of the document right before it makes
its change, so Undo has something to go back to. Typing a new number into Base demand (or
Elevation, or a tank's water depth, or a pipe's diameter, or roughness, or the minor-loss
coefficient, or a dozen other ordinary number and text boxes in the Properties popup) skipped that
step entirely. The new number went straight into the document and the old one was gone -- not
"gone until you undo it," just gone, the same as if undo did not exist for that field.

**The button and the keyboard shortcut are not two different bugs.** Ctrl+Z and the Undo toolbar
button call the exact same function. Whichever one Tom pressed, it found nothing on the undo stack
to restore (or, if some earlier action happened to be sitting there, it would have undone THAT
action instead and left the Base demand edit standing) -- which matches exactly what he saw: the
number just stayed at what he had typed.

**This was measured, not inferred from reading.** A test was built that opens a junction's
Properties box the way the real page does, types a new Base demand into the real input, fires the
real browser `change` event the box listens for, and then calls the real `undo()`. Before the fix,
the document, the Tables pane and the reopened Properties box all still showed the edited number
after Undo. After the fix, all three show the original number again.

## What was fixed

The missing step was added in the eight places that build an ordinary number, text, dropdown, or
pattern field for the Properties popup, plus the Tables pane's own single-cell edit, which had the
identical gap. Fixing the shared building blocks fixes every field built from them at once --
Base demand, Elevation, a tank's water depth/min/max level/diameter, a reservoir's head, a pipe or
valve's diameter/roughness/minor-loss coefficient, the two reaction coefficients, a customer's
demand-pattern choice on a junction's demand row, a valve's type, and more -- without having to
find and fix each field one at a time.

A test (`dev/lpn-spike/undo-property-edit-harness.js`) now checks three representative cases end to
end: Base demand (Tom's own case), Elevation (the most widely shared field type), and a single cell
typed directly into the Tables pane. For each one it edits the value, confirms Undo takes it back
to the original in the document, in the Tables pane, and in a freshly reopened Properties box, and
confirms the map's own drawing is rebuilt without the edited value baked into it anywhere. The test
was checked against the bug it fixes by temporarily removing each of the three repairs one at a
time and confirming the test catches every one of them (it does).

## Findings, worst first

| # | Where | What happens today | Undoable? | Screen follows the undo? | Confidence |
|---|---|---|---|---|---|
| 1 | **Properties box: Base demand, Elevation, tank levels, reservoir head, pipe/valve diameter, roughness, minor-loss k, reaction coefficients, demand pattern, valve type, and every other plain number/text/dropdown field in the popup** | Before this fix: typed straight into the document with no undo record at all. | **No, before the fix. Fixed now.** | Fixed now -- measured. | **Measured** |
| 2 | **Tables pane: typing directly into a cell and pressing Tab/Enter** | Before this fix: written straight into the document, same gap as #1. (Pasting a block of cells was ALREADY undoable -- only the single typed cell was not.) | **No, before the fix. Fixed now.** | Fixed now -- measured. | **Measured** |
| 3 | **Settings panel: new-asset starting values (default Base demand, default diameter, default roughness, etc.) and the six ID-prefix boxes** | Typed value is saved to the project file immediately. No undo snapshot is taken anywhere in this panel. | **No.** | N/A -- nothing to restore. | Read (the missing call is as plain here as it was in #1 and #2, but this was not driven end to end) |
| 4 | **Settings panel: the map-coloring section (which property colors the map, its scale, its ramp)** | Same shape as #3 -- saved immediately, no snapshot. | **No.** | N/A | Read, not driven |
| 5 | **Pressing Undo while the Properties box is open** | `undo()` always closes the Properties box, on every kind of undo, not only the ones (like undoing a deleted element) where the box's subject may no longer exist. | Undo itself works correctly underneath (see #1) | The box disappears rather than snapping back open on the restored value. Reopening it shows the correct value. | Read (this is a deliberate, commented design choice already in the code, not a new defect -- flagged because it may still surprise someone expecting the box to "come back" the way the map label does) |

## What was checked and found to already work correctly (measured or closely read, not fixed because nothing was wrong)

- **Drawing a new element and deleting one** -- both take their own snapshot before the change,
  confirmed by reading every add/delete code path; this is also the best-covered area in the
  existing test suite.
- **Moving a node, a label, a vertex (bend in a pipe), or a customer meter by dragging it** -- one
  shared mechanism (`snapshotDragOnce()`) takes exactly one snapshot at the start of a drag,
  wherever the drag ends, for every one of these five drag kinds.
- **Find and replace's bulk write** -- takes one snapshot for the whole batch, so undoing a
  37-pipe replace is one press of Undo, not 37.
- **Checkbox and dropdown fields that already had their own explicit undo call** -- the pipe/valve
  "Shut" checkbox, the pump/valve curve chooser, a custom property's own text box, and the
  per-property "only in this scenario" override tick. These were already correct before this
  audit and were the model the fix in #1 and #2 was brought up to match.
- **Removing one row of a junction's demand breakdown** (the "x" button) -- already correct.
- **Customer (meter) editing** -- demand, demand pattern, and number-of-services fields in the
  customer's own Properties box already took their own snapshot; dragging the meter or its
  connection point is covered by the same drag mechanism as ordinary nodes.
- **Scenario actions** -- creating, renaming, deleting a scenario, and pushing Base values out to
  every scenario, all already take their own snapshot before acting.
- **Library: editing a curve's data points** -- already correct; a curve is shared, so this is
  written to the one document all scenarios read, exactly as it should be.
- **Attaching, detaching, or finishing the "place this project on the world map" wizard** --
  correct by a deliberate design: the wizard takes ONE snapshot of the drawing before anything
  moves, so a single Undo can put the whole placement back exactly as it was before the wizard
  started; detaching the map afterward is treated as a permanent declaration (like a unit choice)
  rather than an undo step, which is stated in the code's own reasoning and was not second-guessed
  here.
- **Filling elevations from the terrain (DEM)** -- already correct: one snapshot for the whole
  batch of nodes filled, taken at the moment the numbers actually arrive.

## What this audit did not reach

Given the size of the page, the following were not driven end to end and are not represented above
with full confidence; they are exactly the kind of area a future pass -- or Tom's own testing --
should look at next if any of them turn out to matter in practice:

- The Library box's other buttons (adding, renaming or deleting a whole curve, as opposed to
  editing its points, which was checked).
- The re-adjust step of the "attach to the world map" wizard specifically (as opposed to the
  wizard's overall Finish, which was checked).
- The remaining Settings panel sections beyond starting values, ID prefixes, and coloring (there
  are several more, all built the same way, and all sharing the same likely gap as #3 and #4).

## What was not fixed, and why

Per the brief for this work, only Tom's own reported defect (#1) and the one other defect sharing
its exact cause and its exact fix (#2, the Tables pane) were repaired. Findings #3 and #4 (the
Settings panel) are a real gap of the same shape, but they live in different code, are lower-
traffic (typed rarely, not per-edit), and deciding whether Settings changes should be one-key
undoable at all is a product judgment call belonging to Tom, not something to fix silently inside a
defect-track branch. Finding #5 is not a bug so much as a design choice already made and explained
in the code; it is flagged rather than changed.
