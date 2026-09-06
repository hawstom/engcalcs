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

## Third invocation, 2026-09-06 — Tom asked for Task 595 directly: WHICH KEYS for the seven add-tools

Tom, relayed: *"Data entry clerk: They requested keys for adding assets. Did you lose that? I asked
for it to be added to our roadmap. And research conventions for keys to bind to the 6 assets +
text."* It was not lost — it was always in wishlist item 2, ranked THIRD by me — but it was never on
`dev/ROADMAP.md`, which is now fixed as Task 595 and not my file to have fixed. This entry is the
research Task 595 says is still open.

### The research: five tools, and the finding is mostly a negative one

**CITED** EPANET 2.2's own documentation (`4_EPANET_workspace.html`, `6_objects.html`, cited fully
in this journal's first two sessions) never states a keyboard accelerator for the toolbar's
node/link buttons. Its one keyboard door to a new object is the Data Browser's Add button — a
click, not a key — and property navigation inside the resulting dialog is Up/Down arrows and Tab,
already recorded above. Searched again this session for a toolbar accelerator table specifically
and found none in the manual, the quickstart, or two independent course mirrors of the same
material.

**CITED** epanet-js: searched their own blog (`epanetjs.com/blog/2025/08/01/introducing-epanet-js/`
and the Aug–Feb 2025–26 progress reports). The only two keyboard bindings documented anywhere are
**Y**, which toggles between the current and previous SCENARIO (not a tool), and **Shift+Enter**,
which runs a simulation. Their one asset-creation accelerator is **holding Ctrl while already
dragging a pipe**, which drops a junction at the cursor without stopping the drag — a MODIFIER held
during an in-progress pointer gesture, not a bare key that activates a tool from an idle state. No
bare-letter tool-select binding is documented anywhere in their public material.

**CITED** QGIS's digitizing toolbar: tool selection (point/line/polygon layer, add-feature button)
is a toolbar click or the "Toggle Editing" state per docs.qgis.org's editing chapter; the specific
single-key bindings I could source are **T** (toggle trace digitizing) and, inside an active sketch,
letters for constraint entry (`x` for absolute X, `d`/`a`/`r` for distance/angle/radius in some
versions) — none of them select WHICH GEOMETRY TYPE to draw. That choice is made by which vector
layer is the active layer, not by a keystroke, because QGIS's whole editing model is
one-layer-at-a-time.

**CITED** ArcGIS Pro's own "Keyboard shortcuts for editing" page
(`doc.esri.com/en/arcgis-pro/latest/help/editing/keyboard-shortcuts-for-editing.html`, redirected
from `pro.arcgis.com`): construction-tool shortcuts (`A` direction, `D` distance, `R` radius, `F6`
absolute X,Y,Z) are stated to apply **"when you create point features"** / **"when you create
polyline and polygon features"** — i.e., they operate only INSIDE an already-active sketch, refining
the geometry being drawn. Tool activation itself is `Ctrl+Shift+C` to open the Create Features pane,
then a click on a feature template. No single bare key switches which template/tool is active.

**CITED** AutoCAD's own command-alias culture (`acad.pgp`; Autodesk's own "Command Aliases" blog
post, `blogs.autodesk.com/autocad/autocad-command-aliases`) is real and IS the closest thing Tom
already has in his hands — `L` for LINE, `C` for CIRCLE, `PL` for PLINE, `E` for ERASE. But the
gating mechanism is structurally different from a webpage's `keydown` listener: the letters are
TYPED INTO THE COMMAND LINE, a dedicated always-focused text box, and only fire when terminated by
Enter. AutoCAD has no analogue of "a property field elsewhere on screen has focus and swallows the
keystroke" the way a web form does — the command line IS the one place keystrokes go by default.
Importing the alias CULTURE without the command-line GATING MECHANISM is importing half a design.

**Finding, stated plainly:** of five tools surveyed, three (EPANET, QGIS, ArcGIS Pro) document NO
bare-key tool-activation binding at all; one (epanet-js) has exactly one letter bound, and it is not
for tool selection; one (AutoCAD) has a rich single-letter culture but ships it inside a completely
different input model (a command line) that a canvas-based web page does not have. **This is
evidence that "bind a letter to each add-tool" is not an industry convention `lpn_` would be
joining — it would be inventing one**, and the AutoCAD precedent Tom is fluent in does not transfer
as cleanly as "he already knows this" suggests, because the safety net (a dedicated always-focused
command line) is the part AutoCAD actually relies on and `lpn_` does not have.

### The collision survey — what `js/looped-network.js` already binds, read this session

| Key | Where | Gated on typing? |
|---|---|---|
| `Escape`/`Esc` | `js/looped-network.js:6605` (cancelActive, capture phase), `:8241`, `:13240`, `:18616` (new-project box close) | No target check at 6605/8241/13240/18616 — Escape is treated as always-safe, which is standard (Escape rarely types a character) |
| `Delete`/`Backspace` | `js/looped-network.js:8333` deletes the current selection | **Yes** — `keyboardIsTyping()` (`:8330`) checks `INPUT`/`TEXTAREA`/`SELECT`/`contentEditable` and returns early |
| `Ctrl+Z`/`Cmd+Z` | `js/looped-network.js:29065` undo | **Yes** — `isTextEntry(e.target)` (`:8241` area, function at `:29055`-ish), same four-tag check, added specifically because it was "scary" per Tom's own quote at `:29051` |
| `Enter` | Several: find box (`:9570`), replace box (`:10281`), new-project box create (`:18852`), a Controls-library input (`:17139`) | N/A — these are `keydown` listeners on the SPECIFIC input, not global |
| `ArrowUp`/`ArrowDown`/`ArrowLeft`/`ArrowRight`/`Home`/`End` | Setbox resize (`:24254`-`24260`), curve-point-table nav (`:25943`-`25970`), listbox picker (`:11209`-`11218`) | Scoped to specific elements, not global |
| No bare letter is bound anywhere globally | grepped `e.key === '[a-zA-Z]'` across the whole file — zero hits | — |

**So the field is genuinely open** — no bare letter collides with anything `js/looped-network.js`
already does — but the ONE existing global bare-key-adjacent precedent (`Ctrl+Z`) is gated on
`isTextEntry()`/`keyboardIsTyping()`, and Tom's own words about why (*"It was scary when I entered
an unknown node"*) are exactly the single-letter problem Task 595 asks about, already answered once
in this file for a different key.

### The single-letter problem, answered concretely

A bare letter fired on a raw `keydown` with no target check would switch tools while a user is
mid-sentence in the Description field, mid-number in a diameter cell, or mid-search in the Find box
— silently, because nothing about typing a letter looks like an error to the browser. Both
`isTextEntry()` and `keyboardIsTyping()` already exist in this file, checking the identical four
tags, so the guard is a ONE-LINE reuse, not new design. The gate a new tool-select binding needs is
therefore already this file's own pattern: `if (isTextEntry(e.target)) { return; }` before treating
any bare key as a tool switch — nothing in EPANET, QGIS or ArcGIS Pro needed to answer this because
none of them binds a bare key to begin with; AutoCAD answers it structurally (the command line owns
the keystroke by default) rather than by a focus check.

### The arithmetic, against Tasks 592 and 186

I ranked this THIRD in my own wishlist before Task 595 existed, behind (1) Task 186 widened to cover
row CREATION and From/To/X/Y, and (2) the market-researcher's CSV/GPX import (now, I believe, folded
into or adjacent to Task 592 — I have not re-read 592's current wording this session and should
before citing its number again with confidence; SPECULATION that it is the same row).

**Restating the arithmetic honestly:** a keyboard tool-switch binding saves exactly one pointer click
per TOOL CHANGE, not per element. Today's flow already reuses one tool across many placements (place
→ click same spot to open+select-mode → retool only when switching element TYPE). For "400 pipes
from a marked-up plan set" — one element type, placed 400 times — the binding saves at most a
HANDFUL of tool switches for the whole session (however many times the clerk alternates junction vs
pipe vs valve), not 400 anything. Compare: Task 186 widened to allow row creation removes the
per-row popup round trip ENTIRELY for every one of the 400 rows once the topology exists; a mapped
import (592) removes the per-row round trip AND the per-node placement click, for every one of the
400. **The seven-key binding is real and I would take it, but it is arithmetically the smallest of
the three by roughly two orders of magnitude**, and Task 595 should not be read as competing with
either — it is a much cheaper, much smaller thing that happens to be easy to scope precisely because
it is small.

### Muffleable, applied here

A tool-select key nobody presses must cost nothing: no dialog, no highlight-flash, no status-bar
text-on-every-press. The existing tool buttons already show the active mode by CSS state
(`js/looped-network.js:20157`-`20163`'s toolbar array, rendered elsewhere with an active class,
SPECULATION on the exact render call not re-checked this session) — a key press need only call the
SAME `setMode('add-junction')` etc. those buttons already call, so a person who never learns the key
sees literally nothing different about the page, and a person who learns it gets the existing visual
feedback for free. No new UI surface is needed to make it discoverable beyond a tooltip addition on
the existing toolbar buttons (`title="Junction (J)"`-shaped), which costs nothing to a mouse user
and is exactly how AutoCAD's own ribbon states its aliases.

## CORRECTION, 2026-09-06 — my third invocation's headline finding was FALSE

**CITED (Tom Haws, 2026-09-06, from the running product):** epanet-js binds
`1` Select, `2` Junction, `3` Reservoir, `4` Tank, `5` Pipe, `6` Pump, `7` Valve,
`8` Customer (meter), `M` multi-select, `Ctrl+K` search.

I reported that *"none of the five tools I researched binds a bare key to tool selection"* and that
epanet-js binds one letter which is not a tool. **Both halves are wrong**, and the whole of my
seven-letter proposal rested on the first: I argued the scheme had to be invented because there was
no convention to adopt. There was one, in the single most comparable product, and it is DIGITS.

**WHAT I ACTUALLY DID WRONG, so I do not repeat it:** I researched shortcut DOCUMENTATION and
treated its silence as absence. A web application's key bindings frequently live only in the running
application — in a menu label, a tooltip, or nowhere but the keydown handler. Silence in the docs is
evidence about the docs.

**The rule I am writing for myself:** when a question is *"what does this product do"* and the
product is reachable, say explicitly whether I exercised it or only read about it, and rank a
documentation-only answer as weak. An unqualified "none of them do this" from a docs-only search is
a claim I was not entitled to make.

**What survives, and it is the part that matters:** the digit scheme dissolves my own strongest
objection. I worried at length about a bare LETTER being typed accidentally into a text field and
about mnemonic collisions — `U` for pump because `P` was taken, `X` for Text because `T` was. A
digit has no mnemonic to collide, does not run out, and numbers the tools in the toolbar's own
order. My collision survey and the `isTextEntry()` gating recommendation stand unchanged and apply
to digits exactly as they did to letters.

**My ranking is unchanged**: still third, behind Task 592 and a widened Task 186. Being wrong about
the precedent does not change the arithmetic — a tool-select key saves a click per tool SWITCH, not
per element.

