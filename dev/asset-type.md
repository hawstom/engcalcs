# Change type (Water > Change type)

Tom, 2026-10-05: *"It would be nice to provide a tool under Water or Tables to Change node type for
any asset, where if it has information that can't be ported to the new type, we alert and ask."*

Code: the `CHANGE TYPE` section of `js/looped-network.js` (`changeSelectedType()` and its
helpers). Harness: `dev/lpn-spike/change-type-harness.js`, mutation-proved in process.

## What it does (nodes)

Every selected node that is not already the chosen type becomes one: Junction, Reservoir or Tank.
Links follow under "Links" below.

- **Kept:** the ID, the position, the links on it, Description, Tag, its map Label placement, and
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

## Links: Pipe, Pump, Valve

Tom, 2026-10-06, after testing the node version: *"Proceed."* Same rule, same box, same one undo,
same Cancel. Code: `typeOwnedLinkSpecs()`, `linkTypeChangeReport()`, `applyLinkTypeChange()`;
`changeSelectedType()` serves both halves. The fly-out lists the link types under a divider below
the node types, in Insert's order.

- **Kept:** the ID, the ends, the bends, Description, Tag, label placement, status, active, and
  what both types have (a pipe's and a valve's diameter; a non-TCV valve's minor loss).
- **Lost, Base and every scenario's override:** a pipe's library pipe type, roughness, length (and
  Auto), fittings list, minor loss, reaction coefficients; a pump's head curve, efficiency curve,
  speed, speed pattern, price of power and price pattern; a valve's type, setting and a GPV's
  head-loss curve; a custom property whose "Applies to" excludes the new type. A pump has no
  diameter. A TCV reads no minor loss (EPANET ignores it), so a pipe's k is listed as lost.
- **Born, from the New assets settings as `addLink()` draws one, and listed under its own heading:**
  a valve is a **TCV** with setting 2, zero length, Auto off. TCV because it is the one valve type
  both engines solve, so a change never moves the page onto EPANET. A pipe takes its drawn length
  with Auto on. A pump names **no curve**, and the box says so: it then adds no head, in both
  engines (`pumpFit()`), and the export writes it as the usual smooth stand-in pipe. That is the
  page's existing curveless-pump behaviour, not a new failure.
- **A library pipe's diameter** is the type's; changing it to a valve writes Base's inherited
  diameter onto the valve.
- **Customers** connect to pipes only. On a pipe that becomes a pump or valve, each is connected to
  the end node its demand already lands on (`EngCalcs.lpnCustomerNode()`), drawn where it was:
  the same state a pipe deletion leaves at a node end. No answer changes. Listed with that node.
- **Rules:** EPANET reads PIPE, PUMP, VALVE and LINK alike as "the link with this ID" and never
  checks the word (rules.c `newpremise()`, `newaction()`), so a rule parses either way. The kind
  word before the ID is rewritten to the new kind, case kept, nothing else on the line touched;
  each rewritten line is listed.
- **Settings change meaning:** a pump's setting is its speed, a valve's its pressure, flow or loss
  coefficient, and EPANET reads any number on a pipe as open or closed (input3.c `controldata()`).
  Every control and rule line that gives or tests the link's SETTING is listed.
- **Controls are re-read** after any change, node or link (`libAnnotateControl()`), so the stored
  setting unit or pressure/level reading follows the new type.

The valve subtype (TCV, PRV and so on) still changes in the valve's own Properties box, re-seeding
the setting and dropping scenario overrides of it **without asking**. Whether the same rule applies
there is a separate decision.

## Seam: feat/bentley-interop (unmerged)

That branch stores scenario **alternatives** in `doc.alternatives[].values`, keyed by `ovKey()`
(`n:<id>`, `l:<id>`), and routes every walk of an override map through `eachOverrideMap()`. Its
seam check enforces that rule. `nodeTypeChangeReport()`, `applyNodeTypeChange()`,
`linkTypeChangeReport()` and `applyLinkTypeChange()` walk `scenarios[].overrides` directly. **At
that merge, all four must walk through `eachOverrideMap()` and also list and strip a lost
property's values held in stored alternatives,** or an alternative keeps a tank's water depth on a
junction or a pipe's roughness on a valve. Harness sections 4, 9 and 12 are the tests to extend.

## Known gaps

- An import note on the element (for example, that a tank's volume curve was carried) is left as
  it is.
- Rule clauses are matched by the keyword before the ID, not by a full parse of the rule.
- A link's import note is left as it is, like a node's.
