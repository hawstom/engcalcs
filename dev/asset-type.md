# Change type (Water > Change type)

Tom, 2026-10-05: *"It would be nice to provide a tool under Water or Tables to Change node type for
any asset, where if it has information that can't be ported to the new type, we alert and ask."*

Code: the `CHANGE TYPE` section of `js/looped-network.js` (`changeSelectedNodeType()` and its
helpers). Harness: `dev/lpn-spike/change-type-harness.js`, mutation-proved in process.

## What it does

Every selected node that is not already the chosen type becomes one: Junction, Reservoir or Tank.

- **Kept:** the ID, the position, the pipes on it, Description, Tag, its map Label placement, and
  every value the new type also has (elevation, initial quality, the source booster, active, and a
  custom property whose "Applies to" includes the new type).
- **Lost:** what only the old type had, in Base and in every scenario's override: a junction's
  demand (all its categories), demand pattern, emitter and required fire flow; a reservoir's head
  and head pattern; a tank's water depths, diameter, volume curve, mixing model and fraction, and
  reaction coefficient; a custom property whose design does not apply to the new type. Their file
  tokens go too.
- **The water surface is kept between a tank and a reservoir.** Tank to reservoir: the head becomes
  the tank's elevation plus its water depth. Reservoir to tank: the elevation stays and the water
  depth becomes the head minus the elevation (0 for a blank head, which follows the ground). Both
  are in the Elevation/Head unit, so nothing converts. Each scenario's own depth or head goes the
  same way. The box states the new value under its own heading rather than calling it lost. A head
  below the ground cannot be a depth, so it is listed as lost instead. A carried depth raises the
  tank's highest water depth if it has to, since EPANET refuses a tank that starts above its top.
  Net1's tank 2 to a reservoir and back leaves every junction pressure exactly where it was
  (harness section 11).
- **Stale results stay (Recalculate off).** A junction's head and pressure come from the last solve,
  while a tank's or reservoir's are derived from its inputs. So a converted node would switch roads
  with no solve between, and show an invented value. `heldTypeChange()` keeps what was on screen
  until the next Calculate, an undo, or an edit of that node's head, depth or elevation.
- **Born:** what only the new type has comes from `nodeBirthFields()`, the same New assets
  defaults `addNode()` uses, so a converted tank and a drawn tank cannot differ. A node with no
  elevation (an imported reservoir) gets one the way a drawn node does.
- **The box opens with a key line, "ID: Lost entry" (`lpn_change_type_key`), and every lost line follows it: the asset ID, a colon, the entry (a scenario override ends ", in scenario NAME").**
- **Asked first, only when something is lost or changes meaning.** One box for the whole
  selection, in the page's own `askDialog()`, Change or Cancel. The list is capped at 20 lines plus
  "And N more." Cancel writes nothing: the box is asked before any write.
- **Also listed:**
  - A customer whose demand lands on a junction that becomes a tank or reservoir. The customer
    stays; its demand stops reaching any answer, because only a junction takes one.
  - A control whose node crosses the pressure/level line (junction on one side, tank or
    reservoir on the other). The control text is unchanged but now means something else.
    `libAnnotateControl()` draws the same line.
  - A rule clause that names the node by a kind it no longer is.
- **One undo** reverses the whole change, the selection included.
- **Base-owned.** The type is not in `LPN_OVERRIDABLE`, like a valve's type, so a change made
  while a scenario is showing applies in every scenario.

## Why Water, at the foot

The fly-out is the list Water's Insert already offers (Junction, Reservoir, Tank, in Insert's
order), and Water is where those types live. Tom also suggested Tables. The Tables right-click is a
spreadsheet's four commands (Tom, 2026-09-21), and changing an asset's type is not a cell
operation.

It sits at the foot of the menu, under its own divider, rather than under Insert. Menu letters are
dealt in row order (`menuMnemonics()`). Under Insert it took C and moved Scenarios from C to E; at
the foot it takes H and no learned letter moves. `menu-mnemonic-harness.js` reads the Scenarios
letter from the row, so a row added above it later cannot break that test.

## Links: not built, and why

Pipe, Pump and Valve were weighed. They do not fit cleanly, for four reasons:

- **Customers** attach to pipes only (Task 247). A pipe turned into a pump or valve would need
  every customer on it detached or moved.
- **Controls change meaning.** A control's setting is a pump speed on a pump and a pressure, flow or
  loss coefficient on a valve. On a pipe it can only open or close.
- **Rules name links by kind** (`PUMP`, `VALVE`, `PIPE`).
- **A valve is a zero-length link** and a pump has no diameter. The length, `lenAuto` and curve
  references (a pump's head curve and a GPV's head-loss curve share `curveId` with different
  kinds) each need their own rule.

The valve subtype (TCV, PRV and so on) already changes in the valve's own Properties box. That
change re-seeds the setting and drops scenario overrides of it **without asking**. The same "alert
and ask" rule could apply there; that is a separate decision.

## Seam: feat/bentley-interop (unmerged)

That branch stores scenario **alternatives** in `doc.alternatives[].values`, keyed by `ovKey()`
(`n:<id>`), and routes every walk of an override map through `eachOverrideMap()`. Its seam check
enforces that rule. `nodeTypeChangeReport()` and `applyNodeTypeChange()` walk
`scenarios[].overrides` directly. **At that merge, both must walk through `eachOverrideMap()` and
also list and strip a lost property's values held in stored alternatives,** or a stored alternative
keeps a tank's water depth on what is now a junction. The harness's sections 4 and 9 (scenario
overrides survive) are the test to extend.

## Known gaps

- An import note on the element (for example, that a tank's volume curve was carried) is left as
  it is.
- Rule clauses are matched by the keyword before the ID, not by a full parse of the rule.
