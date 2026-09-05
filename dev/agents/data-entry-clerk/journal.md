# Journal — data-entry-clerk

Empty. The first invocation writes the first entry; every entry carries one
provenance tag (CITED / OBSERVED / SPECULATION).

## First invocation, 2026-09-04

### The one door to a new element is a pointer click, full stop

**OBSERVED** `js/looped-network.js:13240` `addNode(type, x, y)` is the only function that creates a
node, and its only two call sites in the whole file that pass live coordinates are inside the
canvas pointer handler (`js/looped-network.js:20039-20057`, the `add-junction`/`add-reservoir`/
`add-tank` branch) and the dev-only `drawTestGrid()`. There is no dialog, no "New junction" menu
action, no keyboard shortcut and no coordinate-entry box that creates a node — the map click IS the
only door. The same is true of a link: `addLink()` is only ever called from the `add-pipe`/
`add-pump`/`add-valve` branch of the same handler (`js/looped-network.js:20086-20113`), which
requires two pointer hits on existing nodes (or a snap fallback). There is no way to type "connect
J12 to J47" anywhere in the UI.

### A placed node's position is read-only forever, in every surface I found

**OBSERVED** The property popup's coordinate rows are built by `coordFields()`
(`js/looped-network.js:25041-25050`), which calls `readonlyField()` for both the XY and the lat/lon
case — there is no `<input>`, only a formatted read-only span. None of the six Tables-pane specs in
`buildPaneTables()` (`js/looped-network.js:11428-11589`) carries an X or Y column at all. So once a
node exists, the only way to move it is to drag it with a pointer. A clerk keying in a plan set's
survey coordinates (a spreadsheet of X, Y pairs) has no field anywhere to type a coordinate into,
for a new node or an existing one.

### The Tables pane's tab order is DOM order, and DOM order happens to be right

**OBSERVED** `paneTableRow()` (`js/looped-network.js:11779-11823`) builds one `<input type=number>`
per editable column and, for a plain/result column, either a `<button>` (the ID, which pans the
map — `js/looped-network.js:11784-11793`) or a bare `<td>` with `textContent` and no control at all
(`js/looped-network.js:11794-11799`). Grepping the whole file for `tabindex` (`js/looped-network.js:
10852, 10881`) turns up only a roving-tabindex on an unrelated listbox-style picker — nothing in the
popup or the Tables pane manages tab order by hand. That is a good result BY ACCIDENT rather than
by design: a non-focusable result cell is invisible to Tab, so tabbing across a Junctions row goes
Elevation → Demand → Fire flow → (next row) Elevation, which is exactly the order a clerk typing
down a printed table would want, and it costs nothing extra to reach the next row. This is the one
place on this page volume entry already works close to spreadsheet-shaped, for SCALAR properties of
elements that already exist. **Nobody designed this tab order on purpose — it is a side effect of
which cells got an `<input>` — so a future refactor that adds, say, a plain-text unit suffix inside
a cell (turning it into two DOM children) could silently break it, and nothing would notice**
(SPECULATION: no test asserts tab order on this pane; I did not find one in `dev/lpn-spike/`).

### The Tables pane cannot CREATE a row, and From/To is text, not a field

**OBSERVED** Every spec in `buildPaneTables()` renders exactly the elements already in
`doc.nodes`/`doc.links` (`paneTableElements()`, `js/looped-network.js:11596-1624`, referenced from
`renderPaneTable()`) — there is no "Add row" control anywhere I found (grepped `insert.*row`,
`add.*row`, found nothing in this file). And `paneColEnds()` (`js/looped-network.js:11349-11354`)
renders a pipe's From/To as plain text explicitly because "identity is never overridable" — there
is no path by which typing could ever set a pipe's endpoints. So even a perfect spreadsheet-paste
feature over today's table shape edits scalars on elements a pointer already created and connected;
it does not touch the two things "400 pipes from a marked-up plan set" actually needs typed:
topology and position.

### Full gesture count: one junction with two typed properties, map + popup path

**OBSERVED**, gestures traced against the code cited above:
1. Click the Insert > Water > Junction tool (`setMode('add-junction')`, `js/looped-network.js:18426`)
   — amortized over every junction placed before switching tools.
2. Click on the canvas to place it (`addNode()`, no popup opens — confirmed by reading
   `js/looped-network.js:13240-13282`, which ends at `scheduleSolve()` with no popup call).
3. Click the SAME spot again. Because the click lands on the just-placed node,
   `js/looped-network.js:20043-20051` treats it as "opened what you just placed": it switches the
   mode to `select` AND opens the popup in one click. This is a genuinely well-built fallback for
   the miss case, and it doubles as the only fast way to open a fresh node's properties.
4. Tab, type elevation, Tab, type demand (both `change`-committed, `js/looped-network.js:24967-24983`).
5. Press Escape to close the popup (bound at `js/looped-network.js:17994-17998`).
6. To place a SECOND junction, click the Junction tool again — step 3 left you in `select` mode.

Per junction: 3 pointer actions (place, reopen, retool) + roughly 5 keyboard actions (2 Tab, 2
type, 1 Escape). At 400 junctions that is **1,200 pointer actions and 400 tool re-selections that
exist only because opening a just-placed node's properties always exits Add mode** — none of it
avoidable by any keyboard path I found in this file.

### The Tables-pane path for the SAME 400 junctions, properties only

**OBSERVED**: place all 400 with the pointer first (unavoidable, see above), accepting the
placement defaults, then open the Junctions tab and click into the first row's Elevation cell once.
From there Tab carries you through Elevation → Demand → Fire flow → next row's Elevation with no
further clicks, because of the accidental-but-correct tab order described above. That is 400
pointer placements (fixed cost, a map is a map) plus ONE click and 1,200 keyboard actions for the
properties, instead of 400 popup round trips. **This is already the better path today, and it is
not signposted anywhere as the "fast way to type numbers into many elements" — a clerk who only
discovers the property popup would do 4x the pointer work for no reason.** (SPECULATION: I did not
find a walkthrough or tooltip that tells a new user to prefer the Tables pane once elements are
drawn; `dev/looped-network-calculator-scope.md` is unread by me this session — a later invocation
should check it before repeating this claim.)

### Snap-on-create can silently merge two intended nodes, at 14 screen pixels, any zoom

**OBSERVED** `POINTER_REACH_PX = 14` (`js/looped-network.js:3552`), used by `nearestNodeNearScreen()`
inside the add-junction branch (`js/looped-network.js:20040-20051`) to decide whether a click reuses
an existing node instead of creating a new one. The reuse case is not silent — it opens the existing
node's popup instead of a blank one — but that IS the only signal, and closing the popup with
Escape without reading its ID would leave a clerk one node short with no error anywhere. This is a
genuine design tension for a plan set with junctions close together (three manholes on one corner),
and CLAUDE.md's own design rules rule out a confirmation dialog as the fix. SPECULATION: I have not
measured how often 14 px actually collides at a drawing-appropriate zoom for a dense subdivision;
this needs a real screenshot or a deliberate test before it is worth building anything against.

### EPANET's own tabular/property editors, for comparison — CITED

**CITED** EPANET 2.2 documentation, "4. EPANET's Workspace"
(https://usepa.github.io/EPANET2.2/4_EPANET_workspace.html): *"You can use both the mouse and the
Up and Down arrow keys on the keyboard to move between properties"* in the Property Editor, and
*"To have EPANET accept what you have entered, press the Enter key or move to another property; to
cancel, press the Esc key."* `lpn_`'s popup has neither arrow-key field navigation nor an
Escape-to-cancel-the-field (values commit on `change`/blur already, so Escape only closes the whole
popup — a different and arguably fine design, but not the same one).

**CITED** Multiple EPANET tutorials (e.g. `rpitt.eng.ua.edu/Class/Computerapplications/Module7/
Module7.htm`, mirrored at `uomustansiriyah.edu.iq`) describe the Data Browser's "Add" button:
*"From the Data page of the Browser window, you can select items from the dropdown list box and
then click the Add button to add new objects to your project... an appropriate editor dialog form
will appear."* That is a second, keyboard-reachable door to a new junction that does not require a
map click first — EPANET has this and `lpn_` does not (confirmed above: `addNode()` has exactly one
caller shape, a canvas pointer event).
