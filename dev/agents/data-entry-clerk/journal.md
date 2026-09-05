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

## Second invocation, 2026-09-04 — Tom's question: "is there a standard?"

### The direct answer: yes, EPANET itself has a keyboard-only door, and coordinates are typed, not clicked

**CITED** EPANET 2.2 documentation, section 6.2 "Adding Objects"
(https://usepa.github.io/EPANET2.2/6_objects.html): the Data Browser's Add-button path is —
"Select the type of node (junction, reservoir, or tank) from the Object list of the Data Browser.
Click the Add button. Enter map coordinates with the Property Editor (optional)." The word
"(optional)" is load-bearing: the manual states that if coordinates are left blank at creation,
"the junction will not appear on the network map" — it still exists in the project (in the node
list, editable, includable in a solve) but is simply not drawn. A second, separate sentence in the
same chapter (its "Moving an Object" passage) makes the keyboard door explicit for coordinates
themselves: **"Alternatively, new X and Y coordinates for the object can be typed in manually in
the Property Editor."** So the full EPANET shape is: Add (no click) → type properties (no click) →
optionally type X,Y (no click) → the object is real and computable throughout, and only its
ON-MAP APPEARANCE depends on ever supplying a position. That is a materially different design from
`lpn_`'s, where `addNode()` has no caller but a canvas pointer event and there is no field anywhere
to type a coordinate into (confirmed again this session — see below).

### `lpn_`'s gap restated against the EPANET shape specifically, not just "no keyboard door"

**OBSERVED** The EPANET shape splits into two things `lpn_` conflates: (1) object EXISTENCE and
(2) object POSITION-ON-MAP, and treats them as independently satisfiable — a junction can exist
with no drawn position. `lpn_` cannot do this at all: `addNode(type, x, y)`
(`js/looped-network.js:13240`) takes x,y as required arguments and is only ever called with a live
canvas coordinate; there is no "create an unplaced junction" call shape in the file. Whether an
unplaced-node concept is even coherent for `lpn_` is a real open design question, not obviously
yes — CLAUDE.md's own `lpn_` section says a GEOGRAPHIC project stores real longitude/latitude and
derives its drawing frame from the data's own extent (`dev/geographic-projects.md` §2b), so an
unplaced node has nothing to derive a frame FROM until at least one node has a real position. An
XY-grid (non-geographic) project has no such constraint and could plausibly support "create at
(0,0), fix up later" the way EPANET does. I did not find anything in this file settling that
question and I am not the seat to settle it — flagging it for whoever scopes this next.

### Other tools, searched specifically for a non-pointer creation door — none found; import is the answer instead

**CITED** Bentley's own WaterGEMS help page titled exactly "Adding Elements to Your Model"
(https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/GUID-D7419A7469A14F598193356052E9EC8A.html)
describes exactly two methods, both drawing-pane clicks: pick a symbol from the Layout Ribbon and
click to place it, or right-click in the drawing pane and pick a type from the shortcut menu.
Neither is a keyboard door in EPANET's sense. I looked specifically for a FlexTable "insert row to
create a new element" action and did not find one described anywhere I could reach; I am not
claiming it does not exist, only that I could not source it — treat that absence as a search gap,
not a finding.

**CITED** Bentley's own WaterGEMS documentation on ModelBuilder
(https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/GUID-E7017889-7119-4A6E-98A6-CCA54E6E0607.html,
found via a Bentley community KB article of the same claim): *"ModelBuilder lets you use your
existing GIS asset to construct a new WaterGEMS CONNECT model or update an existing one, supporting
a wide variety of data formats including simple databases (such as Access and DBase), spreadsheets
(such as Excel), and GIS data (such as shape files)... you map the tables and fields contained
within your data source to element types and attributes in your WaterGEMS CONNECT model."** This
is the flagship commercial tool's actual answer to "I have hundreds of elements to enter": not a
keyboard door in the editor, a mapped bulk IMPORT from a spreadsheet or GIS layer, run once, that
creates every element with its position and attributes in one pass.

**CITED** epanet-js's own "Introducing epanet-js" post (https://epanetjs.com/blog/2025/08/01/introducing-epanet-js/):
*"You can draw your network visually, clicking to add nodes and pipes while the software handles
details like auto-junctions and automatic elevations."* No keyboard-only creation door is
mentioned. Its progress-report blog (searched, not separately fetched this session) mentions a
Ctrl-while-drawing shortcut that inserts a junction mid-pipe-draw without a separate click — a
pointer-drawing accelerator, not a keyboard door, and still requires the mouse to be drawing the
pipe. Their "Pro model builder" is named in the same materials as adding "custom attributes and
null values coming soon" alongside import capability, which reads as the same OUT/IN-table
direction as Bentley's, not as a per-element keyboard door — I could not get a page to confirm the
exact import formats this session and am not asserting them.

**CITED** QGIS's own generic path for turning a coordinate spreadsheet into map points — "Add
Delimited Text Layer" / "Add Layer > Add Delimited Text Layer", mapping named X and Y columns
(https://www.qgistutorials.com/en/docs/3/importing_spreadsheets_csv.html) — is the same shape again
one layer down the stack: a CSV of id/x/y becomes point geometry by an IMPORT dialog, never by
typing rows into a table one at a time. I did not find an InfoWater-specific bulk-CSV-to-network
path this session (the GIS Gateway page I found describes format/config, not a worked CSV-to-pipe
example); treat InfoWater as unconfirmed rather than as a negative result.

### Reading this against the market-researcher's own #1 wish-list row

**OBSERVED** `dev/agents/market-researcher/wishlist.md` #1 independently proposes CSV/GPX import of
surveyed points as junctions, cites the same shape (a flat id/lat/lon list from a field survey) and
ranks it above everything else it found. **This agrees with everything found above and I did not
expect it to; the two seats reached the same conclusion from different directions** — the
market-researcher from what field-survey populations actually produce as their raw material, me
from what the commercial incumbents actually built as the answer to volume entry. Between the two,
the industry evidence favors IMPORT as the standard door for "I have hundreds of elements," not a
keyboard-door-shaped Add button. EPANET has the Add-button shape too and it is real and it is a
smaller, genuinely simpler thing to build than an importer — but it is not what the market treats
as ITS answer to volume; it is what EPANET treats as its answer to occasional one-off objects added
without reaching for the mouse.
