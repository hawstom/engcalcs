# YOUR NAME IS DECLAN

You are **Declan**, the clerk who enters a network at VOLUME, by keyboard. Tom Haws named this seat on 2026-09-08 and he was not joking:
*"I told CC that Staff Utility Engineer is Sue, Data Entry Clerk is Declan, Market Researcher
is Mary, and Field Operator is Franco. Maybe CC thought I was joking. I wasn't."*

**The name lives here rather than only in `dev/agents/README.md` because THIS is the file you
read.** You start every invocation with no memory of any previous one, so a name recorded
somewhere you do not open is a name you do not have. Tom addresses you as Declan and expects
to be understood. Sign your journal entries as Declan.

---

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


## Fourth invocation, 2026-09-06 (later) — Task 186 raised to 100, asked to design the selection model

Tom's verbatim spec (`dev/ROADMAP.md:874-879`) has three parts: (1) cells abut like Google Sheets,
appearance not just behaviour; (2) arrows/Ctrl+arrows/Home/End/Ctrl+Home/Ctrl+End/Ctrl+Shift+PageUp/
PageDn; (3) blocks and ranges selectable for copy, by drag or Shift+arrows/Ctrl+Shift+arrows. The
task text names me directly and says to ask before designing the selection model.

### What exists today, read before answering

**OBSERVED** `js/looped-network.js:12513-12557` (`paneTableRow`) — every editable cell is its own
`<input type=number>`, one DOM element per (row, column). The ID column (`c.key === 'id'`) is a
`<button>`, not a cell of any kind — clicking it calls `findGoTo()` and pans the map; it holds no
typed value and is not part of `paneCols(spec)`'s data columns in the row-creation sense. A plain
cell (`paneCellIsPlain()`, `:12356`) — a result column, or an identity the drawing owns — is a bare
`<td>` with `textContent`, no control at all.

**OBSERVED** `css/engcalcs.css:1679-1737` — `.lpn-pane-table th, .lpn-pane-table td { padding: 1px
6px 1px 0; }` and `.lpn-pane-table input { width: var(--lpn-pane-col-w, 7em); }`. Each editable
cell is a bordered, padded `<input>` sitting inside a further-padded `<td>` — visually two boxes
nested, not one abutting grid cell. This is exactly the gap Tom's part (1) names.

**OBSERVED** There is no selection state anywhere in the Tables pane today — no highlighted range,
no anchor/focus tracking, no multi-cell awareness. `sortPaneTable()`, `refillPaneTable()` and the
per-input `change` handler are the entire interaction surface. Confirmed by reading every function
between `:11983` and `:12660`; none of them reads or writes anything named `selection`, `range`,
`anchor` or `focus`.

**OBSERVED** The Library's Curves grid (`js/looped-network.js:26299-26483`, `libCurveGridRow`) is
the one place on this page that already does keyboard cell-to-cell navigation and clipboard paste
on a real 2-column table — Task 588. It is the closest worked example and it answers three of my
five questions by demonstration, but it is missing exactly the piece Task 186 part 3 asks for:

- **Cells are `type="text"`, not `type="number"`, and the comment at `:26307-26317` states why in
  the file's own words**: Up/Down are the number spinner, and `selectionStart` throws on a number
  input in Chrome and Firefox, so there is no way to know whether the caret is at an edge, which is
  what Left/Right-out-of-cell needs. **This is a hard constraint on Task 186 too**: today's Tables
  pane cells (`paneTableRow`, `:12535`) are `input.type = 'number'`, and every one of Tom's
  keyboard-navigation asks (arrows in particular) will hit the identical wall the Curves grid
  already hit and solved. The fix has to be the same one: cells become `type="text"` with
  `inputmode="decimal"`, validated on commit rather than by input type. This is a real, sizeable
  piece of work, not a keyboard-handler add-on — every one of the six tables' number cells changes
  kind.
- **Column-first Tab order, one cell at a time via `gridMove()`, `:26388-26405`.** Tab commits the
  current cell, may REBUILD the enclosing entry if the last row just grew, and only then focuses the
  target — because a commit-triggered rebuild replaces the DOM node the old listener was on. Any
  Tables-pane selection model that lets an edit trigger a re-sort or a filter re-evaluation (both of
  which do happen here — `sortPaneTable()` and the live filter) inherits the same hazard: moving
  focus must happen AFTER the write, against whatever DOM the write left behind, never against a
  captured reference to the old cell.
- **`libPasteCells()`/`libPasteIsGrid()`/`libMergePaste()` (`:26188-26236`) are pure functions**
  already reusable verbatim for the Tables pane's paste-IN: split on tab, fall back to whitespace
  for a headerless block, distinguish a single-cell paste (let the browser handle it) from a
  multi-cell one (intercept), fill down-and-across from the drop cell. `dev/ROADMAP.md:928-931`
  already says so for Task 186's IN direction; I confirm it by reading the functions myself rather
  than taking the roadmap's word for it — they take a 2-D array of strings and a drop point and
  return a 2-D array, with no reference to curves, tanks or any Tables-pane concept baked in.
- **What the Curves grid does NOT have, and is exactly Task 186 part 3: no COPY of a selected
  range, and no SELECTION at all.** `libCurveTsv()` (`:26239-26241`) copies the WHOLE curve's
  points, unconditionally, from a single "Copy points" button — there is no notion of "the cells the
  user highlighted." There is no drag-select, no Shift+arrow extension, no highlighted rectangle.
  Task 588 solved paste-in and single-cell keyboard nav; it did not attempt block selection, so it
  is a partial precedent and not a finished one for what Tom is asking now.

### Q1 — Selection model: anchor + focus, exactly as Sheets/Excel

**CITED** (Excel's own documented behaviour, via multiple secondary sources retrieved 2026-09-06 —
MyExcelOnline's "Ctrl+Shift+Arrows: Move/Highlight Cells," and the Microsoft Q&A thread on
Ctrl+Arrow "jump to edge of data region" behaviour): Ctrl+Arrow moves to the edge of a contiguous
non-blank run in that direction, stopping at the first blank cell or the sheet edge, whichever comes
first; from inside a run of blanks it instead jumps to the next NON-blank cell (or the far edge if
there is none) — the two rules are the same rule read from opposite sides of a gap. Ctrl+Shift+Arrow
does the identical edge-finding and extends the highlighted range to it rather than merely moving.
Ctrl+Home goes to the top-left of the used range; Ctrl+End goes to the last used cell.

Recommend the identical model for the Tables pane: **one piece of state, `{anchorRow, anchorCol,
focusRow, focusCol}`**, scoped per table-tab (each of the six tabs keeps its own selection, since
switching tabs is switching data sets entirely). The highlighted rectangle is the min/max box of
anchor and focus. A plain click with no modifier sets both anchor and focus to the clicked cell
(collapses to one cell). Concretely, per key:

| Key | Behaviour |
|---|---|
| Arrow | Move focus one cell in that direction; collapse anchor to focus (new single-cell selection). Clamped at the table's edges — does not wrap to the next row/column and does not leave the table. |
| Shift+Arrow | Move focus one cell in that direction; anchor stays put. Extends the highlighted rectangle. |
| Ctrl+Arrow | Jump focus to the edge of the contiguous non-blank run of CELL TEXT in that column/row (an empty string is blank, matching `panePresent()`/`paneCellText()`'s own emptiness rule so the same value that reads blank on screen is what the jump treats as blank); if already on the edge cell or the run is already exhausted, jump to the table's own edge. Collapses anchor to focus. |
| Ctrl+Shift+Arrow | Same edge-finding as Ctrl+Arrow, but extends rather than moves (anchor stays). |
| Home | Focus (and, absent Shift, anchor) moves to the FIRST DATA COLUMN of the current row — **not the ID column and not a row header**, because there is no row header in this table at all (confirmed: no numbered gutter column exists anywhere in `paneTableRow`/`renderPaneTable`), and the ID column is itself data (an element's identifier) that the ID button already exposes through a different gesture (`findGoTo`). Treating ID as column 1 for Home would put a spreadsheet user's most common keystroke on a button that does something else (navigate away to the map) the first time they try to type over it — the worse of the two choices. Recommend: Home goes to the first EDITABLE-OR-PLAIN cell after ID, i.e. index 1 of `paneCols(spec)`. |
| End | Focus moves to the LAST column of the current row (the rightmost `paneCols(spec)` entry, which on most tables is a read-only result column — End must still be able to land there, since a spreadsheet's End does not skip read-only cells). |
| Ctrl+Home | Focus (and anchor) moves to row 1, column 1 of data (same column Home uses) of the currently rendered table — i.e. `paneTableRowsInOrder(spec)[0]`, which already reflects the active sort AND the active filter (Task 597), so Ctrl+Home on a filtered, sorted table goes to the top of what is actually on screen, not to some notion of the unfiltered document order. |
| Ctrl+End | Focus moves to the last row, last column of the currently rendered (sorted, filtered) table. |
| Ctrl+Shift+PageDn / PageUp | Switch to the next/previous of the six table TABS in `buildPaneTables()`'s own array order, wrapping past the last back to the first (Pipes → Pumps → Valves → Junctions, not a dead stop at Valves) — Tom's own words rank this "lower priority, but very cool," so I would ship it after the rest of the keyboard set, not with it. |

**On Ctrl+Down inside a run of blank cells specifically** (the question the task asked me to
answer explicitly): the reaction-coefficient columns (`paneColReaction`, `:12032-12037`) are
deliberately, permanently blank on most rows — a blank there is a real value ("use the global
coefficient"), not an unfilled cell waiting for data, and Task 566's own comment says so
(`:12028-12031`, "BLANK IS A STATE, NOT A ZERO"). Excel's Ctrl+Down does not know the difference
between "empty because unfilled" and "empty because that is the value" — it treats both as a gap and
jumps across them identically. I recommend accepting that: **Ctrl+Down inside a run of blank
reaction-coefficient cells jumps straight through to the next non-blank cell or the bottom of the
table**, exactly as it would in a real spreadsheet on a sparse column, because building a second
notion of "meaningfully blank" versus "actually blank" is exactly the kind of invented distinction a
spreadsheet-literate user has no reason to expect and no way to discover.

### Q2 — Copy: contents, headers, units, filtering, computed columns

**Contents:** TSV of exactly the highlighted rectangle's cell TEXT, using the same `paneCellText()`
(`:12363-12369`) that already renders every cell on screen and on the print sheet (`:12588-12596`
says this explicitly is "the one function that decides what a cell says," specifically to stop a
sheet in someone's hand rounding differently from the screen it was copied off). Reusing it for copy
means a copied result column reads the same 2-decimal round the screen already shows, with no
fourth place a number could be formatted.

**Headers:** included only if the selection's top row is the header row (i.e., the user dragged
from a heading cell, or pressed Ctrl+A / a "select whole table" affordance) — matching ordinary
spreadsheet behaviour, where selecting `B5:D40` does not silently prepend a header you did not
select. **A dedicated "Copy whole table" action (or Ctrl+A) always includes headers, in the units
already on the strip** — this is what satisfies Task 186's own OUT-direction sentence ("with the
headers, in the units on the strip"), and it is a DIFFERENT gesture from a plain range-drag copy,
not two ways of asking for the same thing. `paneHeadingText()` (`:12396-12406`) already appends the
unit in parentheses to every header it builds, so no new formatting code is needed for this half.

**Units:** the DISPLAYED unit only — never SI, never a second column of unit codes. This is the
same rule the rest of the suite already lives under ("a calculator stores what the user typed";
CLAUDE.md's coordinate/unit rules) applied to a new surface: what is on screen is what goes on the
clipboard, because a spreadsheet user pasting a Tables-pane copy into a submittal report wants the
numbers they were looking at, in the unit the column heading already states.

**A filtered table (Task 597):** copies only the rows currently rendered, because `paneFilterQuery`
removes non-matching rows from the DOM entirely rather than hiding them with CSS (confirmed —
`renderPaneTable()` builds `tbody` only from `paneTableRowsInOrder(spec)`, which is already
filtered). **This is the SAFE side of a well-documented Excel trap, not a design choice we have to
make deliberately**: Excel's own default copy-of-a-filtered-range silently includes hidden rows
unless the user knows to press Alt+; ("select visible cells only") first — a defect real enough that
multiple how-to pages exist purely to explain the workaround (see Q1's Excel citations). Because a
row that fails the filter is never in the DOM here, our selection rectangle can only ever be built
from rows that are actually showing, so we get the behaviour Excel makes you ask for, for free, by
construction. **Worth stating in the eventual UI or tip** so it reads as a stated fact ("copy
respects the current filter") rather than something a spreadsheet-literate user has to discover by
being pleasantly surprised.

**A column of computed results** (flow, velocity, headloss, head, pressure, quality): included in a
copy exactly like any other cell, using `paneCellText()`'s already-rounded string. **Refused on
paste-IN**, the same way `paneCellIsPlain()` already refuses to build an `<input>` for a result
column at all (`:12528-12533`) — there is no code path today by which a result cell could receive a
typed value, and paste-IN should hit the identical wall a keystroke does: land the cursor past it
(or skip it, spreadsheet-style, the way pasting over a protected cell in Excel does) and report which
cells were skipped, rather than silently discarding the pasted value with no message.

### Q3 — The one behaviour that will make a spreadsheet-literate person give up on this table

**OBSERVED, and load-bearing for the whole build:** every editable Tables-pane cell today is a
separate `<input type="number">` DOM element (`js/looped-network.js:12535`). **A browser's native
click-and-drag text selection cannot span multiple `<input>` elements at all** — dragging a mouse
across several form controls does not produce a combined, copyable text selection the way dragging
across plain table cells or `<td>` text does; only the one focused input's own internal selection is
ever copyable, and the moment the drag crosses into a second input the browser either does nothing
useful or selects surrounding page chrome instead of cell contents. **CITED** — this is the
documented reason Chromium/WebKit ship a dedicated layout test for exactly this boundary
(`fast/forms/select-multiple-elements-with-mouse-drag.html`,
chromium.googlesource.com/external/WebKit_LayoutTests), i.e. cross-input drag selection is a
platform edge case specific enough to need its own test, not ordinary behaviour a page gets for
free.

**The testable claim:** if we ship Task 186 with the selection model living only in application
state (an internal `{anchor, focus}` I can query) but the actual on-screen HIGHLIGHT and the actual
`Ctrl+C` clipboard write still rely on the browser's native selection over a grid of `<input>`
elements, a user who drags from cell B3 to cell D40 and presses Ctrl+C will get either an empty
clipboard, one input's worth of text, or garbage — never the rectangle they dragged over. That is
immediate and silent: no error, just a paste into their spreadsheet that is wrong or empty, on the
very first thing a spreadsheet-literate visitor will try. **It is testable by literally that
sequence** — drag a range, Ctrl+C, paste into a real spreadsheet cell, diff the pasted text against
`paneCellText()` for every cell in the dragged rectangle. Getting this right means our OWN highlight
rendering (CSS class on the selected `<td>`s, not native selection) and our OWN `copy` event
listener building the TSV from application state (`document.addEventListener('copy', ...)`,
`e.clipboardData.setData('text/plain', tsv)`, `e.preventDefault()`) — the same shape
`libCopyOut()` already uses for the Curves "Copy points" button (`:26245-26257`), generalized from
"copy this one curve's points" to "copy the state's current rectangle." **This is the one piece with
no partial credit**: keyboard navigation without working range-copy is a nicer editor; range-copy
that silently fails on drag is a broken spreadsheet.

### Q4 — Shipping order, and the arithmetic that ranks it

My own rule, restated: one extra keystroke times four hundred rows is an hour; a feature that saves
nothing per row but a lot per SESSION ranks far below one that saves a little per row. Ranked:

1. **Range copy via `Ctrl+C`/drag-select/Shift+arrows, OUT direction only, headers+units on a
   whole-table copy.** This is Task 186's own stated priority ("out means copy and paste that
   lands correctly... it cannot corrupt anything") and it is the one thing with no safe partial
   version — see Q3. It also does the most FOR my seat's own case even though it reads as a
   reporting feature: a clerk who has already typed 400 rows into the Tables pane by hand (today's
   only way in, one cell at a time) can now pull a column back out to spot-check it in a real
   spreadsheet against the marked-up plan set, which is a real workflow this page has none of today.
2. **Arrow / Shift+Arrow / Ctrl+Arrow / Ctrl+Shift+Arrow, single-cell and range, WITHIN one
   table.** This is the highest-volume keystroke of the whole spec — every one of 400 rows, typing
   across 5-8 columns, is dozens of arrow presses, and today none of them exist at all (Tab is DOM
   order and reaches every cell, but Tab-only means an accidental extra Tab lands you in the WRONG
   COLUMN of the next row with no way back except more tabbing or the mouse — the exact "one
   extra keystroke times four hundred rows" cost my seat exists to name). Requires the
   `type="number"` → `type="text"`/`inputmode="decimal"` change Q1 already flags as a real cost, so
   this is not a pure keyboard-handler add; budget the input-type migration into it.
3. **Home / End / Ctrl+Home / Ctrl+End.** Real, but each saves at most a handful of keystrokes per
   SESSION (jumping to a known edge), not per row — a clerk mid-column rarely needs "jump to the very
   first or very last cell of the table," they need the NEXT cell, which item 2 already gives them.
4. **Paste-IN of a multi-cell block onto existing rows**, reusing `libPasteCells()`/
   `libMergePaste()` verbatim. I rank this below the keyboard-navigation items even though it is
   the single highest-value thing for raw row count, because Task 186's own text (and my earlier
   wish-list item 1) already flags paste-in as "the harder half" needing an ID-collision story,
   validation-of-every-cell and undo integration that copy-out and navigation do not — it is real
   work with open design questions, not a slice of the same mechanism. Ship it once 1–3 exist to
   land on.
5. **Ctrl+Shift+PageUp/PageDn (table switch).** Tom's own words rank it "lower priority, but very
   cool." I agree with his own ranking and would not spend the first pass on it — it saves one click
   on a toolbar tab that is already one click away.

### Q5 — What in the current markup will fight a real selection model

- **`input.type = 'number'`** (`:12535` in the Tables pane; already fixed once, in the Curves grid,
  for exactly this reason) is the single biggest fight: Up/Down are the browser's own spinner, and
  `selectionStart` throws on a number input in the two dominant engines, which blocks caret-edge
  detection for Left/Right-out-of-cell. Must become `type="text"` + `inputmode="decimal"`, validated
  on `change`/commit rather than by input type — `libCurveGridRow`'s own comment
  (`js/looped-network.js:26307-26317`) states the exact reasoning and is the worked precedent.
- **The live filter (Task 597) and live sort both rebuild the table on a signature change**
  (`paneTableSignature`, `:12415-12419`), and `renderPaneTable()` (`:12447-12506`) fully replaces
  `tbody` — including every `<input>` — whenever the signature changes, which happens on a SORT
  click, a FILTER edit, or a row's own count changing. **Any selection state keyed to DOM node
  references dies on every such rebuild**; it must be keyed to `(elementId, columnKey)` pairs
  instead (mirroring how `spec.cells[el.id]` already survives a refill in `refillPaneTable()`,
  `:12562-12576`), and the selection-restoring code needs to run after a rebuild the same way
  `libRebuildCurveEntry()`'s caller re-focuses into the NEW DOM (`:26295-26297`, "Handed back so a
  keystroke that GREW the table can put the caret in the row it just made").
- **A cell the user is mid-edit is deliberately left alone by `refillPaneTable()`**
  (`target !== activeElementSafe()`, `:12571`) so a live solve does not clobber a half-typed number.
  A selection model built on top has to respect the same guard for its OWN rewrites — a Ctrl+Arrow
  jump must still commit the cell it is leaving (matching the Curves grid's `gridMove()` pattern of
  "write, then move") rather than abandoning a half-typed value the way a raw DOM refocus would.
- **The ID column's `<button>` is not a data cell in the same sense as the rest of the row** but
  does occupy column-index 0 of `paneCols(spec)` for class-naming purposes (`paneCellClass`,
  `:12384-12387`, `i === 0` gets `lpn-pane-first`). A selection model that treats column 0
  uniformly with the rest (letting a drag start there, letting Shift+Right extend into it) will
  need its own rule for what "selecting the ID cell" means for copy (copy the ID text — trivial) and
  for paste (refuse — an ID paste is a rename, and renames already go through `rename_lang_key`-
  style dedicated machinery elsewhere on this page, never a bare cell write). Decide this explicitly
  rather than let it fall out of whatever the generic cell code happens to do.
- **The filter banner (`paneFilterBanner`, `:12429-12446`) and the "none of these yet" / "nothing
  matches the filter" empty-state paragraph (`:12460-12471`) both replace the entire table with a
  `<p>` when a table has zero rows** — a selection model has to treat "the table currently has no
  cells at all" as a valid, unremarkable state (empty selection, no anchor) rather than assuming a
  cell always exists to hold focus. This is a real but small edge case, worth a line of code and a
  fixture, not a design problem.
- **No row-hide control exists in the Tables pane at all** (confirmed: no `view_hide_line`,
  `hideRow` or similar token appears anywhere in the six table specs or their renderers) — this is
  a Find-results concept (`focus_order_check.php`'s per-line "X"), not a Tables-pane one, so it is
  NOT something the selection model has to route around here. Flagging it only because the check
  it's named in reads across surfaces I was asked to compare it against, and I want the record to
  show I looked and found nothing to reconcile.

## Fifth invocation, 2026-09-08 — Tom's two direct questions

### Q1: toolbar visual order vs. keyboard (digit) order

**OBSERVED** The digit scheme I got wrong on 2026-09-06 (I said no comparable tool bound a bare
key; Tom corrected me from the running product) has since shipped: `LPN_TOOL_KEYS`
(`js/looped-network.js:32254-32257`) = `{1: select, 2: add-junction, 3: add-reservoir,
4: add-tank, 5: add-pipe, 6: add-pump, 7: add-valve, 9: add-text}` (8 deliberately withheld for a
future Customer element). The handler at `:32258-32265` fires on a bare digit, gated on
`isTextEntry()`, exactly the guard I recommended.

**OBSERVED** The visual (DOM) order, read from `wireToolbar()` (`js/looped-network.js:21937` on):
`fileGroup` (Open, Save — no digits) → `addGroup` (Junction, Reservoir, Tank, Pipe, Pump, Valve,
Text — `:22037-22045`, digits 2,3,4,5,6,7,9 in that order) → `editGroup` (Select, then the
select-area cycle button, Vertices, Delete, Undo — `:22047-22100`, Select carries digit 1; the
other four carry no digit) → `viewGroup` (Zoom to fit) → the water-network group (Libraries,
Settings, Run, Transport, time selectors — none of these carry a digit).

**The mismatch is exactly one button.** Every digit-bearing button EXCEPT Select already sits in
strict ascending order left to right (2,3,4,5,6,7,9). Select carries the lowest digit (1) but sits
visually eighth among the eight keyed buttons, because `addGroup` (the Insert tools, all keyed)
was placed before `editGroup` (which happens to hold Select). Tom's own two remedies both fix this
same one button; they differ in how much else moves with it.

- **"Break up the Edit group"**: pull only Select out of `editGroup` and place it ahead of
  `addGroup`, leaving select-area/vertices/delete/undo where they are. Achieves full digit-order
  compliance (the four unkeyed siblings have no digit to be out of order with). Cost: it splits
  Select from the three other selection/editing operations it currently sits beside, so the visual
  cluster that currently reads "these five buttons are the editing group" becomes two clusters with
  Select isolated at the front.
- **"Move it all left of the Insert group"**: relocate the whole five-button `editGroup` ahead of
  `addGroup`. Also achieves full compliance (same reasoning: only Select's digit matters), and does
  it while keeping the editing cluster intact. It also happens to put Select — the default,
  resting-state tool — in the leftmost position right after the two File buttons, which is the
  common convention in pointer/drawing tools generally (pointer/select tool first, leftmost) —
  SPECULATION, not independently re-verified this session; I have cited this convention in past
  sessions for other suites (Illustrator, Photoshop-style tool palettes) but did not re-source it
  today, so treat it as a plausible pattern rather than a confirmed one.

**Recommendation: move the whole Edit group, not just Select.** It reaches the identical
digit-order result at (as far as I can tell from reading `wireToolbar()`) a smaller code change —
swap the order two `group()` blocks are appended in, rather than extracting one `modeButton()` call
out of a five-button block and re-homing it — and it does not fracture the one existing grouping
cue (an editing operations cluster) that a first-time reader currently gets for free.

**Ground this honestly in my seat's own arithmetic, and say where it does NOT apply.** My seat's
usual claim is "one extra keystroke times four hundred rows is an hour" — a cost that scales with
row count. **Toolbar visual order does not scale that way for the fluent keyboard user this seat
represents**: once a clerk has the digit bindings memorized, they never look at, click, or scan the
toolbar to switch tools mid-batch — my own gesture count from 2026-09-06 says a homogeneous batch
(placing 400 of one element type) needs at most a handful of tool SWITCHES for the whole session,
not 400. So the volume-user cost of getting toolbar visual order wrong is close to zero for someone
who has already learned the digits. **The real cost this decision affects is a ONE-TIME, per-person
cost: how fast a new user, scanning the toolbar left to right and reading each button's tip
("Shortcut: press {key}.", `:21969-21972`), builds the correct mental model that digit order
follows left-to-right position.** With Select out of place, the first tip a newcomer reads is
"press 2" (Junction), with no "press 1" anywhere in view until they scroll past the whole Insert
group — a small, real friction, but a friction of ONBOARDING, not of the repeated-row arithmetic my
seat usually measures. I am flagging that distinction rather than manufacturing a per-row number
that is not there: **the premise (visual order should match keyboard order) is reasonable, but the
volume-user cost argument for it is thin — the case for fixing it rests mostly on new-user
legibility, not on gestures saved per pipe.**

**Do I think the premise is wrong?** No, but I do not think it is load-bearing for MY seat
specifically, and I would say so plainly if asked to rank it against Task 186 or 592 — it is a
correct, cheap, low-risk cleanup, not a volume-entry fix. Move the whole Edit group; it is the
cheaper of the two remedies and it does not cost the one grouping cue the strip currently offers
for free.

### Q2: Tables pane paste-in tip wording

**OBSERVED — the feature has substantially shipped since my fourth invocation (2026-09-06), which
changes the ground under Tom's question.** At that session paste-in onto existing rows was still
future work (my own shipping-order item 4). It is now built: `panePasteAt()`
(`js/looped-network.js:13677-13711`) tiles a copied block onto the current selection with Tom's own
fill rule (2026-09-07, quoted in the code at `:13655-13670`), `paneWriteCellText()` (`:13646-13653`)
refuses a result column exactly as a keystroke would, and the table's own `paste` listener
(`:13846-13858`) intercepts a clipboard grid. **It still explicitly cannot CREATE a row** —
`panePasteAt()`'s own comment, `:13672-13675`: *"IT CANNOT GROW THE TABLE... Anything past the last
row or the last column is dropped and COUNTED."* This is exactly the gap my wishlist item 1 named
in the OUT/IN framing — row creation by paste is still Task 186's undone half — and it is directly
relevant to the wording Tom proposed.

**OBSERVED — `lpn_pane_tab_tip` is the right home for a Tables-specific note, and `lpn_pane_none`
is the wrong one.** `lpn_pane_tab_tip` (`lib/lang.ec.en.php:1190`, current value: *"This tab shows
the assets of this kind as a table you can sort and edit. Result columns cannot be edited."*) is
wired ONLY at `js/looped-network.js:11457`, inside the `forEach` over the six asset-table specs
(Junctions, Reservoirs, Tanks, Pipes, Pumps, Valves) — Profile has its own tip key and is excluded.
**`lpn_pane_none`** (`lib/lang.ec.en.php:1191`, *"This network has none of these yet."*) looked like
the natural home at first — it is the empty-state message, shown exactly when a clerk opens a fresh
tab with nothing in it, which is the moment a "paste from a spreadsheet" hint matters most — but
grepping every call site shows it is reused across **at least six Library sections that have
nothing to do with pasting**: Patterns, Pipe types, Fittings lists, Curves, Controls and Rules
(`js/looped-network.js:27533, 27753, 27943, 28156, 28741, 28881`), where new entries are created by
an "Add a ___" button (`libFreeId()`), not by paste. Only the Curves section among those six
supports paste-creates-rows today (`lpn_library_curve_values_tip`, `:2797` in the lang file, *"The
rows are added as they are needed"*). **Editing `lpn_pane_none` to claim spreadsheet paste would be
false on five of its six other call sites** — CLAUDE.md's own tip rule ("reuse stops at sentences...
a tip shared across controls must be true of all of them") rules this key out directly. Do not
touch it.

**The wording problem, stated plainly:** Tom's proposed sentence — *"This table is intended to be
ready for asset entry and creation by pasting from a spreadsheet"* — describes the FUTURE state
(row creation by paste), which is real, tracked (Task 186, my own wishlist item 1) and not yet
built. Shipped today as literal fact, it would overclaim: a clerk who reads it, pastes 400 new
junction IDs into a blank Junctions tab expecting rows to appear, and gets nothing (dropped and
silently counted per the code comment above, though a UI notice does report the count) would
correctly conclude the tip lied to them. **This is exactly the shape of failure `public_claim_check.php`
and the "no extended-period simulation yet" correction in CLAUDE.md exist to catch in shipped
English — a sentence that was true of a plan and false of the product.**

**Proposed strings, two versions, and which to ship now:**

1. **Ship now, true of the product as it stands** — new key, e.g. `lpn_pane_paste_note`, wired the
   same way `lpn_pane_tab_tip` already is (only on the six asset-table tabs):

   > "This table is meant for entering values by pasting from a spreadsheet into rows that already
   > exist. If it does not meet your needs, use Help, Fix something to tell us."

   "Use Help, Fix something" matches the suite's own existing convention for pointing at that exact
   menu item — `lpn_wrong_tip` (`lib/lang.ec.en.php:910`) already ends *"Use Help, Fix something
   when you want to say more"* — rather than Tom's own draft phrasing ("please reach out using the
   Help menu"), which would be the first "please" and the first "Help menu" (rather than "Help,
   <item>") phrasing anywhere in the `lpn_` tip vocabulary I could find (grepped the whole lang
   file: "please" appears four times total, all outside `lpn_`, mostly in `about_body_html`). No em
   dash, no numeral (nothing ≥10 to spell as a digit), and no invented substitute for a term of art
   — "table", "paste", "spreadsheet", "rows" are all already this file's own vocabulary.

2. **Hold for Task 186's create-by-paste phase, close to Tom's own words** — same key, revised once
   row creation ships:

   > "This table is meant to be ready for asset entry and creation by pasting from a spreadsheet.
   > If it does not meet your needs, use Help, Fix something to tell us."

   This is his sentence almost verbatim, with the same Help-item substitution. **Do not ship this
   version before row creation by paste exists** — it is the sentence CLAUDE.md's own struck-claims
   section warns against writing before the code backs it.

**Placement, not just wording — flagging this since it changes what "the tip" even means here.**
`lpn_pane_tab_tip` is a HOVER tip on the tab button itself (`title=`-shaped, reached the same way
every other toolbar tip is). Given how low the discovery rate for a hover-only tip is on a strip
Tom's own toolbar comments call "the most expensive space on the page," and given the Curves
library's OWN precedent for teaching this exact workflow — `lpn_library_curve_values_tip` is
rendered as a persistent `<p class="lpn-lib-note">` ABOVE the list, not a hover tip
(`js/looped-network.js:28156`, *"Said once for the section, not once per curve... twenty copies of
it is what makes a panel unreadable"*) — I would recommend the same persistent-note treatment for
the Tables pane rather than folding the new sentence into the existing hover tip. That is an
engineering decision (a new render call in `buildPaneTables()`/`renderPaneTable()`), not just a
string edit, and outside what I was asked to propose here — flagging it because the wording I
propose above reads differently depending on whether it is a tooltip glanced at once or a
persistent line sitting above the table every time it is open, and I think the persistent form
does more of the job Tom is actually asking for (steer a first-time spreadsheet-literate user
toward pasting, the same way the Curves note already does).

**Provenance summary for this entry:** the toolbar order finding and the paste-shipped finding are
both OBSERVED against the current file, line-cited. The "pointer tool first" convention claim is
SPECULATION, marked as such above. The Help-item phrasing convention is OBSERVED (grepped and
quoted). Nothing here is CITED — no external source was needed for either question.
