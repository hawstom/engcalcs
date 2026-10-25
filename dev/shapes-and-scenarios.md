# Shapes and scenarios (design note, not built)

Tom, 2026-10-24: *"Am I hearing that shapes have no alternative or scenarios? Don't we need to
design them to use our scenario system with respect to 'Is active'?"*

## Current behaviour

- A Shape is `{ id, pts, closed }` (plus `desc`, `props`) in `doc.shapes`. It is annotation, not
  hydraulics: nothing that solves reads it. The code comment on `docShapesRead()` and
  `dev/shapes.md` both say "a Shape is in no scenario".
- It is drawn once, in every scenario. Imports say so ("Shapes appear in every scenario.").
- Shapes have no row in the override map: keys are `n:` (node), `l:` (link), `t:` (Text),
  built by `ovKeyFor()`. `elGroup()` already tells a Shape from the rest, but only the Tables
  pane asks it. `LPN_OVERRIDABLE` has no `shape` entry, so `setOverride()` refuses a Shape.
- So yes: today a Shape can neither be switched off in a scenario nor exist in only one.

## The precedent: Text

A Text (label group) is the same kind of thing, map annotation with no hydraulics, and it DOES
use Is active per scenario. `LPN_OVERRIDABLE.label` has `active`; `bornInScenario()` creates an
element inactive in Base and overridden active in the scenario that drew it; deleting a
scenario-only element really deletes it; `isActive()` greys or hides it; the Properties box shows
the Is active row. The category is `text` (`LPN_ALT_CATEGORY_OF.label`).

## Can Shapes honour Is active cheaply?

Yes, moderately cheap, because the machinery is generic and Text already walked the path. It is
not free. The pieces:

1. A `shape` entry in `LPN_OVERRIDABLE` (`active` only) and `LPN_ALT_CATEGORY_OF` (a category;
   see option B), plus a new key prefix `s:` in `ovKeyFor()` and `ovKeyGroup()`. The
   `scenario_seam_check.php` exemption is by function name, so it should hold.
2. `buildShapeEls()` and hit-testing (`shapeHitNear`, snap magnets, Zoom to extent) skip a Shape
   that is not active in the open scenario, or draw it ghosted as Text does.
3. Draw and import call `bornInScenario()` so a Shape drawn or imported inside Scenario 2 exists
   only there. Delete uses the same "really deleted if only here" rule.
4. A Properties box for a Shape with the Is active row, and an Is active column in the Shapes
   table (the table is currently "no scenario view").
5. Everything that walks override keys must learn `s:`: Convert as (shapes already move), scenario
   copy/merge/delete, the scenario workbook, the tree view, and `.inp`/GeoJSON/DXF export (the
   open scenario's active Shapes only). `ovKeyGroup()` defaults an unknown key to `node`, which
   would misfile a Shape override silently; that default must change first.
6. Harnesses: scenario-seam, stale-snapshot, and one new browser harness for draw-in-scenario.

Only `active` is wanted; position per scenario for Shapes is not (a Shape's points are the
user's survey numbers, see Option C).

## Options

- **A. Leave as is.** Shapes are a base map layer, the same in every scenario. Zero work. Fails
  the case Tom named: a proposed-alignment polyline that belongs to one alternative.
- **B. Is active only, in the Text category (recommended).** Steps 1-6 above. Shapes join the
  existing `text` alternative category, so no new category in the tree. One Shape set, one id
  space; a scenario switches Shapes on or off exactly like Text.
- **B2. Is active only, in a new "Shapes" category.** Same work plus a new category in every
  scenario-tree surface and an alternative picker. Cleaner naming, more UI. Choose only if Tom
  wants Shapes switched independently of Text labels.
- **C. Full per-scenario Shapes (position too).** Rejected: moving a vertex per scenario breaks
  "only the user touches a file's numbers" and doubles the import/export surface.

## Recommendation

Option B. It reuses the Text precedent, fits Tom's "use our scenario system" instinct, and keeps
the id space single. Build it after `feat/scenario-io` merges, because step 5 touches the same
override-key seam and the import/export receipts ("They appear in every scenario") change
wording once Shapes honour scenarios. Until then, the receipt line stays true.
