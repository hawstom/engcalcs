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

## Sixth invocation, 2026-09-09 — Task 610: the pipe-vertex cell format, on Tom's direct request

Tom read my wishlist, said *"I am sympathetic"* to widening Task 186/610 for row creation, and set
three conditions, one of which names this seat by name: *"pipe vertices need a stated cell format,
which the `data-entry-clerk` must specify... before anything is built."* Full spec, with every
citation, is in `dev/agents/data-entry-clerk/task-610-vertex-cell-spec.md` — this entry is the
short version and the one finding worth flagging on its own.

**OBSERVED, and the reason I did not ship the WKT-shaped format I started from:**
`js/looped-network.js:29060-29071`, `libPasteCells()` — the function the journal already expected
paste-IN to reuse — falls back to `t.split(/[\s,;]+/)` on any pasted LINE with no tab character in
it. A clerk who copies ONLY the vertices column from their own spreadsheet (an ordinary thing to
do) produces exactly that: no tabs, one column. A WKT-shaped cell (comma between points, space
within a point) would be shredded by the very parser meant to read it. I picked a single `/`
separator, flat list, pairs read positionally — outside `[\s,;]+`, outside the sign character `-`
that a negative longitude collides with, and cheaper to type than the nested form besides. Full
reasoning, including why I still cite WKT for its punctuation shape while overriding its axis
order with CLAUDE.md's own lat/lon-is-public rule, is in the spec file.

**One thing I flagged that was not asked for but bears on it directly:** a pasted geographic
vertex needs the same `_xsrc`/`_ysrc` source-token marking `js/lpn-inp.js:1163-1174` already gives
a `.inp`-imported one, for the same reason CLAUDE.md's own "ONLY THE USER TOUCHES A FILE'S
NUMBERS" section states — a paste is the user's number exactly as much as a file's is, and
`mercY`/`mercLat` is a real nonlinear projection, not a rounding nicety, so an unmarked pasted
vertex will drift on the next open-and-resave the same way an unmarked `.inp` vertex used to.

**On Tom's own two other conditions:** I endorse the Junction-table coordinate columns without
reservation — it is the oldest gap this seat found, first invocation, 2026-09-04, and the vertex
format has nothing to attach to without it. I endorse the paste-refusal condition too, but
recommend the refusal fire on a validate-the-WHOLE-block pass BEFORE any row is written, all rows
committing together or none — never a partial commit that stops mid-paste, because a half-created
network with dangling pipe references costs a clerk far more to untangle than a full re-paste
after fixing a spreadsheet. Reasoning, including why this differs from today's scalar-paste
refusal (which is fine leaving a refused cell inert), is in the spec file's §2.2.

**On Ctrl+Shift+PageUp/PageDn:** worth it, ranked where I already had it (behind range-copy,
arrow-nav, paste-onto-existing-rows, Home/End — fourth invocation). One addition: it must restore
each tab's own last selection state rather than resetting to cell A1, since the per-tab selection
state the range-copy work already needs (fourth invocation) makes that free once it exists.

— Declan

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

## Seventh invocation, 2026-09-11 — Tom asked for me by name on projected coordinate systems

Full answer: `dev/coordinate-entry-clerk-review.md`. Short version, against
`dev/map-projection-decision.md` and `dev/map-coordinate-mathematics.md` §6.

**OBSERVED**, re-confirmed from my own first invocation: there is still no typed-coordinate entry
path anywhere in `js/looped-network.js` today — `addNode(type, x, y)` still has only a canvas
pointer caller, and the popup's coordinate fields are still read-only spans. A projected-CRS entry
mode would be an enhancement to a feature that does not exist yet.

**CITED**: State Plane has 124 zones today and SPCS2022 raises that to 953
(https://gisgeography.com/state-plane-coordinate-system-spcs/,
https://www.coordinately.org/learn/nsrs-modernization); NATRF2022 is in public beta now and shifts
NAD83(2011) by 3.5-4 ft in Texas alone (same coordinately.org source, and
https://beta.ngs.noaa.gov/NATRF2022/). A wrong-zone pick is almost always silent — adjacent zones
are deliberately similar in magnitude on purpose, which is the property that makes State Plane
convenient and a wrong pick undetectable by inspection.

**My recommendation, stated plainly**: proj4js, not hand-rolled UTM. UTM-alone cannot extend to
State Plane's different projection families (Lambert Conformal Conic in some states, Transverse
Mercator in others) without a rewrite of the whole approach; proj4js already is the extensible
library, EPSG-keyed, at the cost of a real runtime dependency the mathematics report already
flagged honestly. Building UTM first does not save the larger design cost, it spends it twice —
which is, I believe, exactly the trap Tom's own words describe.

**My own ranking, stated once more and unchanged in shape from every previous ranking in this
file**: no urgency, agreeing with Tom's own framing, and I would put Task 610/186's still-open half
(typed X/Y, row creation via paste) and the market-researcher's CSV/GPX import ahead of this for
volume entry specifically — same order-of-magnitude argument I have made before (a CRS picker saves
at most a per-session unit-conversion step; row creation removes a per-element round trip, 400
times). Fine as a development branch, per Tom's own framing of the ask; not a near-term build for my
seat's own case.

— Declan

## Eighth invocation, 2026-09-15 — Tom asked me by name, alongside Sue and Mary: Task 674 column/row placement (X1) and the EPANET Description/Tag-before-Elevation order (X2)

### What 674 actually built, read on branch `674-coordinate-entry`, not assumed from the prompt

**OBSERVED** (`js/looped-network.js` on `674-coordinate-entry`, not yet merged) — the two surfaces do
NOT currently sit in the same place, and the brief's framing ("currently placed at the END of both")
undersells the table's real position. `buildPaneTables()`'s Junctions/Reservoirs/Tanks specs read
`paneColId(), paneColActive(), paneColElev(), paneColCoord(1), paneColCoord(2), ...` — coordinates sit
in slots 4-5, **immediately after Elevation, ahead of every other typed field** (Demand, Fire flow,
Level, etc.), not at the end. Only the **popup** (`nodeCoordFields(fields, n)`, called from the node
branch of the property-popup builder) is genuinely last — after Tag, custom properties, Active and the
push-here button, just before the import-notes field. I read this directly rather than trusting the
brief's summary; it changes the table math below.

### The table's actual DOM tab order, read cell by cell, not assumed

**OBSERVED** `paneTableRow()` (`js/looped-network.js` on the branch): the ID cell is a real `<button>`
with no `tabIndex` override, so it IS in the browser's default tab order — the older journal claim
("Elevation → Demand → Fire flow → (next row) Elevation" with nothing else in between) predates
today's code and is not currently accurate; both ID and the Active checkbox are real tab stops. A
"plain" cell (a result column, or an identity/computed-total cell) is explicitly given `tabIndex = -1`
so Tab skips it while End/Ctrl+End can still land on it (`:16495-16498`, commented for exactly that
reason). **Coordinate cells are real `<input>` elements with no such exclusion** — they are typeable,
by design, and therefore ARE stopped at by Tab regardless of where they sit in the row.

### The arithmetic Tom's question actually turns on: MIDDLE placement forces a cost that TRAILING placement lets a clerk opt out of

**OBSERVED, derived from the two facts above.** The clerk who never types a coordinate — the ordinary
case today, since `addNode()` still has only a pointer caller (first invocation) — has a real, wanted
tab sequence per junction row: Elevation → Demand → Fire flow → (skip plain results) → Initial
quality. As built, X and Y sit BETWEEN Elevation and Demand, so every one of those 400 rows forces two
unwanted stops (a real `<input>`, not a skippable plain cell) in the MIDDLE of a run the clerk actually
wants — 800 extra Tab presses across 400 junctions, and worse than a wasted keystroke: landing focus in
a live coordinate box mid-sequence is a place a stray keystroke actually moves the node.

**If the same two columns sat at the END of the row instead** (after every other typed and result
column), the identical clerk's wanted sequence — Elevation → Demand → Fire flow → Quality — is now
CONTIGUOUS and uninterrupted, and reaching the next row does not require finishing the row: a
spreadsheet-literate clerk who is done with a row simply clicks the next row's Elevation cell rather
than tabbing through trailing columns they don't want, the way nobody tabs past column Z to reach row
2 of a real spreadsheet. **A trailing unwanted column costs nothing because it can be skipped by
stopping; a middle unwanted column costs something on every row because it cannot be skipped without
leaving the keyboard.** This is the concrete reason the CURRENT build (coordinates right after
Elevation) is arithmetically the worst of the three shapes discussed — worse than either of Tom's
own two named options — for the clerk who is not touching position.

### The other side, cited rather than assumed: PNEZD is a real, decades-old survey convention, and it does not agree with what's built either

**CITED** — PNEZD ("Point, Northing, Easting, Z/elevation, Description") is Autodesk Civil 3D's and
the surveying trade's standard flat-file point format: "PNEZD represents the order of the data columns
in the text file: Point number, Northing, Easting, Z coordinate (elevation), and Description"
(Cadline Community, "Civil 3D Survey - What is a PENZD point file",
https://www.cadlinecommunity.co.uk/hc/en-us/articles/201758902-Civil-3D-Survey-What-is-a-PENZD-point-file;
corroborated by Eyasco's own "Survey (PNEZD) File Format" page,
https://www.eyascopublic.com/mehelp/survey__pnezd__file_format.htm). **This is the exact shape "a
surveyed junction has a northing to two decimals" (Task 674's own text) produces as raw material** —
a clerk transcribing a survey deliverable reads point, then northing, then easting, then elevation, in
that order. Note it puts coordinates BEFORE elevation, same as EPANET's GUI and Tom's option 1 — but
the table as built puts Elevation BEFORE coordinates, matching neither EPANET's editor nor PNEZD.

### Q1 — my answer, and why table and popup should NOT be forced to agree

**Split the decision, because the two surfaces cost differently for my seat's metric.** In the
**table**, the loss from a middling position is measured above at 800 keystrokes for 400 junctions and
is avoidable by choosing an END; in the **popup**, no comparable cost exists — a popup opened once per
element does not have a continuous same-column-many-rows keyboard run to interrupt, and the whole
premise of Tom's own "order of fundamentalism" argument (ID, X, Y is how EPANET orders things, and
matches PNEZD) is much better suited to a form filled top-to-bottom once per object than to a
spreadsheet-shaped table where MOST rows, MOST of the time, never touch two of the columns.

**For the table specifically: put coordinates LAST among the typed columns** (after every editable
field, ahead of nothing but the read-only result columns, which are already tabIndex=-1 and therefore
free regardless of where they sit) — not "at the end" vaguely, but specifically after Fire flow/Level/
Demand and before Head/Pressure/Quality results. This is the one placement that lets the majority
clerk (positions already set by the only door that creates a node — a pointer click) tab straight down
the fields they actually type with zero interruption, while a clerk who DOES want to paste or type
surveyed coordinates in bulk can still reach the columns directly by clicking into them — paste-onto-
existing-rows (`panePasteAt()`, already shipped) does not care about column position at all, since the
clerk clicks the drop cell first regardless of where it sits.

**For the popup: I have no objection to option 1**, and it is where the PNEZD/EPANET "order of
fundamentalism" argument actually fits — a form read top-to-bottom once per node, not a table typed
down many times. If it must be one decision rather than two, I would rather pay the popup's smaller,
one-time-per-element onboarding cost than the table's row-multiplied one — but I would rather Tom keep
them separate, on the record that this is exactly the kind of case my seat exists to flag: a decision
that reads as one question is actually two, with different right answers, because the two surfaces are
used at different volumes.

### Q2 — EPANET's Description/Tag-before-Elevation: my seat's read

**Not defensible as a model to imitate, and there is real evidence it is a GUI-only artifact rather
than a considered ordering.** CITED: the EPANET `.inp` text format's own `[JUNCTIONS]` section is
ID, Elevation, Demand, Pattern — Description and Tag are not columns of that section at all (Description
travels as a trailing `;`-comment; Tag lives in a wholly separate `[TAGS]` section) — confirmed against
the EPANET 2.2 User Manual's own file-format appendix
(https://19january2021snapshot.epa.gov/sites/static/files/2020-05/documents/epanet_userss_manual_2.2.0.pdf).
So the ENGINE's own canonical record of a junction puts Elevation second, right after ID, with no
Description or Tag anywhere near it — it is only the desktop GUI's property-EDITOR dialog that
interleaves two rarely-touched free-text fields ahead of the one hydraulic number nearly every junction
states. That the file format and the editor disagree is evidence the editor's order was not derived
from the file's own logical structure; SPECULATION beyond that (I cannot cite EPANET's dialog-layout
history or say it was accidental rather than deliberate — I found no source for GUI design intent,
only the disagreement itself).

**From my seat specifically:** yes, it is actively bad if copied literally, and it is bad for exactly
the reason my seat exists to name. Description and Tag are optional, free-text, and — per my own
gesture counts across every invocation of this journal — among the fields a volume clerk touches
least (nothing I have measured this session or any prior one shows a clerk typing a Tag for 400
junctions; ID, Elevation, Demand, Fire flow and now position are the ones that recur). Any popup or
table order that makes a clerk pass over two fields they are not filling in before reaching the one
they fill in on nearly every row pays a small tax on every element, for no offsetting benefit —
unlike position, which at least has the PNEZD citation behind an early placement, Description/Tag
have no comparable case for sitting ahead of Elevation. **Do not adopt this specific piece of EPANET's
order.** Elevation belongs early (right after ID, ahead of anything optional or rarely filled),
whether or not coordinates also go there.

— Declan

## Ninth invocation, 2026-09-15 (same day, later) — Tom's collapsing-groups brainstorm

Asked by name again on the question that follows the slot decision I lost (eighth invocation): does
collapsible grouping in the property popup help or hurt at volume, and does it pay back the 800
keystrokes I measured against the TABLE's coordinate slots.

### The load-bearing find: the page already ruled on default-collapsed once, twice, and both times said no

**OBSERVED** `js/looped-network.js:4632`, on the old Settings-box accordion: *"the Settings box does
not collapse anything (Tom: 'No need ever to collapse')"* — and the fuller quote at `:28739`, Tom,
2026-08-18: *"No need ever to collapse; just scroll/jump to your section."* The accordion was
removed and replaced by a two-pane box whose left pane is the navigation, specifically because
collapse-by-default was the wrong answer for exactly this shape of problem (many named sections, one
box).

**OBSERVED** Two places on this page already use the `<details>`/`<summary>` disclosure element —
the exact HTML idiom Tom's brainstorm would need — and both default it **open**, on record, for a
reason that is my seat's reason too even though neither comment was written by me:

- `customPropBox()`, `js/looped-network.js:29034-29037`: *"`<details>` rather than a button and a
  hidden div: it is the WAI-ARIA disclosure pattern for free, it is the idiom `multiSection()`
  already uses on this page, and **every row inside it is built eagerly, so a collapsed property is
  still searchable... and still reachable by Find**."* And on adding a new one, `:29214`: *"OPEN,
  because a collapsed blank line says nothing at all about what the user has just been given."*
- `multiSection()`, `js/looped-network.js:36246-36248`, on a mixed-element-type popup: *"**OPEN, ALL
  OF THEM.** Tom's own words are that a mixed selection shows both and NEITHER IS HIDDEN, so
  collapsing is something the reader does, never the default."*

**This settles Q4 for me, from evidence the page already carries rather than from my own
inference.** "Muffleable" here has an existing, working referent: `<details>` open by default, DOM
content built eagerly so nothing is functionally hidden (searchable, reachable, present for a
screen reader), and the reader — never the page — decides to collapse it. That is muffling exactly
as my seat's own definition wants it: the capability to shrink a group is there for whoever wants
it, and costs the volume clerk who never touches it literally nothing, because open is the state
they never had to ask for.

### Q1 — arithmetic: collapsed-by-default would cost roughly what the table's coordinate slots cost; open-by-default costs nothing

A group collapsed by default that a clerk needs open costs one click to expand, **per element, per
session, unless the open/closed state is remembered** — that is the entire question, and it collapses
(no pun intended) to the same shape as my eighth-invocation table finding: a middle interruption
that cannot be skipped, multiplied by 400. If a clerk routinely fills Dimensions and Flow and
pressure but never Quality, and all three ship collapsed by default with no memory, that is up to
two unwanted expand-clicks **per element, every single time the popup opens** — worse than the table
case, because a click costs more attention than a Tab press and there is no way to skip it the way a
trailing table column can be skipped by not tabbing that far (the popup is one small box; the field
you want may sit below the collapsed one). At 400 elements that is a very real 400-800 extra clicks,
arithmetically closer to my table finding than a fresh problem.

**Open by default removes the cost entirely for the volume clerk and adds nothing measurable**: a
`<summary>` heading with a `▸`/rotated-caret visual is one more line of scannable text, not a
gesture. The only volume-relevant question left is whether GROUPING BOUNDARIES THEMSELVES slow Tab
— they do not, if `<details open>` renders its body inline in normal flow (which is the element's
own default rendering; `multiSection()` and `customPropBox()` both already rely on this), because
Tab still walks the DOM in order and a `<summary>` is itself one extra, harmless stop (arguably a
small win — it reads as a landmark the way a spreadsheet's frozen header row does, not a delay).

**Verdict on Q1: helps, if and only if it ships open by default and stays that way unless the reader
acts** — which is not a new position for this page to take, it is the position it already took twice.

### Q2 — does it pay back the table's 800 keystrokes? No. Different surface, different mechanism.

**OBSERVED** Grouping and `<details>` are constructs inside the property **popup**'s field-building
code (`customPropBox`, `multiSection`, and by extension whatever renders Tom's five named groups).
The Tables pane's six specs (`buildPaneTables()`) are flat column arrays with no heading hierarchy
and no disclosure element anywhere in `paneTableRow()`/`renderPaneTable()` — grouping a popup's
vertical field list into named `<details>` sections has no code path that touches a table's column
order at all. **The two features do not share a write seam or a render seam; they are unrelated
mechanisms on separate surfaces**, confirmed by reading rather than assumed from the brief.

Tom accepted the 800-keystroke cost specifically "until columns become customizable" — that is a
statement about **column order/visibility in a table**, and the thing that pays it back is
column reordering or a trailing default placement (my own item 7, already filed and partly built on
`674-coordinate-entry`), not anything a popup's field grouping can reach. **If this brainstorm is
read as "the answer to the table debt," that is the wrong remedy for the right complaint** — worth
saying plainly because Tom's own framing ties the two together in one sentence in the brief
("Tom accepted that cost until columns become customizable. Is collapsible grouping the thing that
pays it back") and my answer is no, name the different mechanism.

### Q3 — popup and tables stay separate designs; grouping implies nothing about the table

Consistent with my eighth-invocation disagreement (recorded in the wishlist): the table is typed
down many times per session and pays a cost a form filled out once per element does not. A grouped
**popup** heading is a vertical-flow convenience for a single object's form. **There is no version of
"grouped columns" for the table that is not strictly worse for a volume clerk than today's flat row**
— a spreadsheet-literate clerk tabbing across a row wants every editable cell reachable in one
uninterrupted run (my own repeated finding), and a column-group boundary that could be
collapsed would either (a) do nothing if always open, in which case it is decoration with no
volume cost either way, or (b) hide columns the clerk needs to type into, which is strictly worse
than today, never better. **My recommendation: do not extend this brainstorm to the table at all**,
not even as a "grouped header row" — there is no version of it that helps volume entry, and version
(b) actively regresses it.

### Q4 — see the load-bearing find above. Collapsible, open-by-default, reader-controlled, satisfies "muffleable."

Restated once: not removable (the field is still there, still in the DOM, still reachable by Find,
per the page's own existing comment about exactly this), not a per-user DEFAULT the suite chooses
for anyone, but a control the reader can act on that costs nothing to the reader who never acts on
it. That is the definition, and this page already has two working instances of it to copy rather
than invent.

### Q5 — state persistence: browser furniture, keyed on the group's name, never inside `serializeProject()`

**OBSERVED** the existing furniture-key convention: `LPN_PANE_KEY = 'lpn_pane'`
(`js/looped-network.js:14213`), `LPN_RPANE_KEY` (`:14577`), `LPN_SETBOX_KEY` (`:30020`),
`LPN_FINDBOX_KEY` (`:14008`), `LPN_FFBOX_KEY` (`:39519`), `LPN_ENERGYBOX_KEY` (`:39965`),
`LPN_CMPBOX_KEY` (`:39927`), `LPN_RPTBOX_KEY` (`:40055`) — one `localStorage` key per remembered
window-furniture fact, guarded by `lpn_furniture_check.php` because CLAUDE.md's own rule is that a
setting belongs to the PROJECT or the BROWSER and never both, and a collapse state is screen-shaped
furniture in exactly the sense that a pane width is: whether Quality is worth seeing every time is a
fact about the CLERK'S OWN habitual workflow on THEIR OWN SCREEN, not a fact about the network, and a
colleague opening the same file must not inherit somebody else's collapsed Quality group any more
than they should inherit a 32-inch pane width.

**My recommendation, concretely:** one `localStorage` key (e.g. `lpn_popgroups`) holding an object
keyed on the GROUP NAME (`'ID'`, `'Dimensions'`, `'Flow and pressure'`, `'Quality'`, `'Custom'`) to a
boolean, shared across every element type that offers that group name, remembered across elements
AND across sessions (a clerk who collapses Quality once should never have to do it again, in this
project or the next one they open) — the `<details>` `toggle` event already fires when the reader
acts, so writing to storage is a one-line hook onto an event this element gives for free. **It must
NOT be per-element** (would defeat the whole saving — see Q1 arithmetic) **and must NOT be
per-project** (would violate the furniture rule the same way a stored unit-set almost did — CLAUDE.md
is explicit that this is the one page with no per-browser unit cookie for exactly the reason a
setting must not silently follow the wrong thing). Default state on first visit: open, per the
precedent above.

### Where I expect disagreement

**Sue** owns whether "Flow and pressure" mixing typed Demand/Roughness/K with solved Head/Pressure is
a defect — I flagged it only because a collapsed RESULT group (if this page ever did ship
collapsed-by-default) would hide a post-solve answer, which is exactly her transposed-X/Y argument
in a different shape; with open-by-default that concern mostly dissolves, but the INPUT/RESULT mixing
itself is hers to rule on, not mine. **Ida** owns the visual-hierarchy question the brainstorm is
really asking (does five named groups read better than one flat list) — my seat has nothing to say
about whether grouping helps a reader SCAN, only about what it costs a typist who is not scanning,
and those can point different directions on the SAME feature. I would not be surprised if Ida
recommends grouping for legibility while I recommend it stay open-by-default for volume — both can be
true at once and are not actually in tension, which is worth saying since the brief poses the
question as if one seat must win.

— Declan

## Tenth invocation, 2026-09-16 — Tom's final grouping brief: re-cost with Enter-down, design column hide/reorder

Tom read my eighth/ninth-invocation numbers and asked one question that dissolves most of them:
*"What if tab moves downward, not rightward?"* He is right to ask it as a question rather than an
objection to my count, because the count was never wrong about what it measured — it was wrong about
which WORKFLOW it assumed. This entry corrects that.

### First, verify the premise myself rather than take the brief's word for it

**OBSERVED** `js/looped-network.js:16668-16670`, `paneHandleKey()`: `Enter` maps to
`at = { r: r + (ext ? -1 : 1), c: c }` — same column, next row (Shift+Enter goes back up). The
comment beside it: *"Enter commits and drops a row; Shift+Enter goes back up. The spreadsheet's own
ending, and the reason a column of forty numbers can be typed without touching the mouse."* This is
real and already shipped, not a proposal — confirmed by reading the function myself, not by trusting
the brief's paraphrase of it.

### Re-costing the two workflows honestly

**COLUMN-major (fill one property for every row, e.g. 400 elevations off a survey printout):**
click the first Elevation cell, type, Enter, type, Enter... The clerk never leaves the Elevation
column. **Slot order is now completely irrelevant to this workflow — the 800-keystroke number I
derived at the eighth invocation does not apply to it at all**, because that number counted Tab
presses crossing a middle column, and this workflow uses no Tab and crosses nothing. This is the
workflow the page's own UX already pushes a clerk toward without saying so: nodes are placed by
pointer first (first invocation — `addNode()` has only a canvas-click caller), so properties are
filled in as a SECOND pass over already-existing rows, which is naturally "one property, all rows,"
not "all properties, one row." I did not previously credit that this second-pass structure is
column-shaped by default; it is.

**ROW-major (walk one element's full line — the PNEZD shape, one line of a marked-up plan set typed
left to right before moving to the next point):** here slot order still matters, because this
workflow genuinely uses Tab across a row, and Tab still walks DOM/array order — a coordinate cell
sitting mid-row (as the current `674-coordinate-entry` branch has it, right after Elevation) still
costs two unwanted stops per row for a clerk who is not touching position, exactly as I measured at
the eighth invocation. **Enter-down does not help this workflow; it is orthogonal to it.**

**The honest retraction:** my item 7 (move X/Y to the trailing end of the typed columns) was solving
the row-major case only, and I did not previously separate the two cases — I wrote the 800-keystroke
number as if it applied to "the table," when it only ever applied to one of two real workflows the
table supports. Column-major pays nothing regardless of where coordinates sit. Row-major pays a real,
smaller-than-I-first-scoped cost, and only for a clerk who both (a) fills several properties per
element in one pass and (b) does not use whatever column-hiding exists. **Once hide/reorder ships
(below), item 7's specific fix — reorder to the end — becomes the WEAKER of two available remedies**:
a row-major clerk who never touches coordinates can just hide the two columns, which removes them
from the Tab path entirely rather than merely moving them to a position that is cheap to skip. I
would still take a sane default order (coordinates late, not mid-row) as the out-of-the-box state,
since a first-time clerk has not yet found the hide control — but I am no longer arguing item 7 is
load-bearing on its own. **The retracted number is honest: "nearly nothing," not "nearly nothing
except when it still is a lot," because the case where it is still a lot is now avoidable by the
clerk's own hand, not a fixed cost of the page.**

### Column hide and reorder — the design Tom has agreed to in principle

**Where the control lives:** one small button per table (not on the main toolbar — "the most
expensive space on the page" per this file's own earlier reading of Tom's toolbar comments), sitting
beside each table's existing sort/filter row. Opens a short popover: one row per column, a checkbox
(visible/hidden) and up/down reorder (arrows or drag — arrows are cheaper to build and are keyboard-
operable, which matters for this seat specifically; a drag-only reorder control would be the one
piece of this whole feature a keyboard-first clerk could not use). **Also give the fast, spreadsheet-
native shortcut**: right-click (or long-press) a column header for a one-item "Hide this column"
menu entry, mirroring the gesture Sheets/Excel users already have and costing nothing to build beyond
what the popover's own hide toggle already does — the header context menu and the popover checkbox
write the same state.

**One column is not hideable: ID.** It is the row's own identity, the only door `findGoTo()` gives a
click-to-pan action through, and hiding it would strand a row with no way to identify which element
it is. Every other column — Active included — is fair game.

**Scope: per table, not global.** The six tables have different column sets and different clerk
habits per asset type (a clerk might always hide Tag on Pipes and never touch it on Junctions where a
survey deliverable states one) — a single global hidden-set forces one clerk's Pipe preference onto
their Junction table for no reason. State keyed on the table id.

**State: browser furniture, one constant, one write site** — the pattern `lpn_furniture_check.php`
already expects (`LPN_PANE_KEY`, `LPN_SETBOX_KEY`, etc., each one `localStorage.setItem` outside
`serializeProject()`). Propose `LPN_PANECOLS_KEY = 'lpn_panecols'` holding one object keyed on table
id: `{ junctions: { order: [...col keys...], hidden: [...col keys...] }, pipes: {...}, ... }`. This
must be OUTSIDE `serializeProject()`, checked by the same script that already caught `lpn_libbox` and
`lpn_show_titles` being written but undeclared — a colleague opening the same file on their own
screen must not inherit somebody else's hidden Diameter column any more than a 32-inch pane width.

**What happens on paste with hidden columns — the question only this seat asks, answered: SKIP, and
it is nearly free to build because the mechanism already exists.** `panePasteAt()` already tiles a
pasted block positionally into `cols = paneCols(spec)` and already drops-and-counts anything past
`cols.length` (`js/looped-network.js:16565-16568`, "IT CANNOT GROW THE TABLE... dropped and
COUNTED"). If a hidden column is simply removed from the array `paneCols(spec)` returns for every
interactive purpose — tabbing, arrow-jump, Home/End, AND paste — then a clerk who pastes a 6-column
spreadsheet block starting at a visible cell fills only the VISIBLE columns from that point forward,
and the rest silently falls into the same "dropped and COUNTED" bucket that already exists for
running off the table's right edge. **No new code path — the paste mechanism already treats
"nothing more to write to" as a normal, reported outcome; hiding a column just makes that boundary
arrive sooner.** This mirrors the codebase's own existing choice for filtered rows exactly
(`paneTableRowsInOrder(spec)` already excludes filtered-out rows from the DOM entirely, which is why
copy of a filtered table is already "the SAFE side of a well-documented Excel trap," per my own
fourth-invocation Q2) — hidden columns should be absent from the array, not merely CSS-hidden, so the
same safety falls out by construction rather than needing a second rule.

I considered REFUSE (block the whole paste until the clerk unhides) and reject it: it punishes the
exact clerk the feature exists to help, forcing them to temporarily undo the customization to use it.
I considered "paste into the hidden column anyway" (Excel's own actual behaviour for hidden columns,
which is a documented user trap, unlike its safer behaviour for filtered rows) and reject it for the
same reason CLAUDE.md's filtered-row precedent already rejects the Excel-default on rows: our table
can make hidden mean ABSENT rather than merely invisible, and absent is the position that cannot
silently write into a column that isn't there. **SKIP, not REFUSE, not Excel's own trap.**

### Popup grouping, Q3 and Q4 answered directly

**A five-group popup, nothing collapsed, is better than today's flat 16-20 rows — but only if the
group heading is NOT a `<summary>`.** I flagged in my ninth invocation that `<details>` open by
default "costs nothing," and that was true for CLICK cost but I had not yet checked TAB cost.
**OBSERVED, checked now:** a `<summary>` element is natively focusable — it is the browser's own
toggle control — so an open `<details>` still inserts a real Tab stop at every group boundary, even
though nothing about it is collapsed. A clerk tabbing from Elevation (Dry) to Demand (Water) on a
junction crosses exactly one such boundary per element; at 400 junctions that is 400 extra Tab
presses landing on a heading with nothing to type into — the identical shape as my coordinate-slot
finding, smaller in size (one stop, not two) but the same mechanism, and I did not name it until
asked directly. **With nothing collapsible by default, there is no reason to pay for the toggle
control's own Tab stop.** Two ways to avoid it, in order of preference: (1) plain, non-interactive
headings (a styled `<div>`/`<h4>`, no `<details>`) if no reader-controlled collapse is wanted at all;
(2) if `<details>` is kept for some future collapse affordance, give its `<summary>` `tabindex="-1"`
— the exact idiom this file already uses for plain/result table cells (`:16495-16498`) to keep a
control reachable by click and by End/Ctrl+End-style jumps while removing it from the ordinary Tab
path. **Plain headings are strictly better for my seat if disclosure is never going to be used; a
tabindex-suppressed `<summary>` is the fallback if Tom wants the toggle kept for later.**

**Q4, the three-row rule breaking on Results-and-quick-graph (2 rows, reservoir and tank): I do not
care, and I am saying so plainly rather than manufacturing an objection.** A two-row group costs my
seat nothing extra either way, given the tabindex fix above — a heading with no Tab stop costs the
same whether it sits over two rows or twelve. The three-row minimum is a visual-economy rule (Ida's
territory, not mine); I have no gesture-cost stake in it and would not spend Tom's attention asking
him to reconsider it for my sake.

— Declan

## Eleventh invocation, 2026-09-17 — three questions: customer entry order, per-entry library import, and a survey file format chooser

Tom asked me by name on the first question; the other two were routed to me. Read
`dev/customer-demands.md` in full and re-read `js/looped-network.js` on both `master` and the
`feat/customer-demands` worktree (`/home/haws/webdev/worktrees/feat-customer-demands/engcalcs`,
read-only) before answering. Dates below are all today's check.

### Q1 — "location, link, location, link, location, link"

**OBSERVED**, `feat/customer-demands` worktree, `js/looped-network.js:16062-16066` (checked
2026-09-17): the Customer table's `link` and `atNode` columns already exist as columns with a `get`
and no `set` — they are DERIVED and read-only in the table today, matching the design doc's model
(`dev/customer-demands.md` §2: store `link` + `t`, derive the node). So the question is not whether
a customer table has a location column and a link column — it already does — the question is
whether a BULK IMPORT surface (a pasted or typed block creating many customer rows at once, which is
Task 610's still-open row-creation gap applied to a fourth element kind) should present them as
alternating pairs.

**I have no strong disagreement, with one condition that decides whether this is good or bad, and
Tom's own phrase is ambiguous about which one he means.**

- **If it means one ROW per customer with two CELLS — a location cell, then a link cell, then the
  next row's location cell, then its link cell — that is just an ordinary two-column table, and it
  is fine.** It is also the CHEAPER of the two shapes to type: `js/looped-network.js:17008` (master,
  checked 2026-09-17) confirms Enter still moves straight down a column (`r+1, c`, unchanged since my
  tenth-invocation finding), so a clerk can type every location down column 1, Enter-Enter-Enter, then
  every link down column 2 — column-major, the shape my tenth-invocation correction already
  established costs nothing extra for slot position. Two typed columns, however many rows, is not a
  new rhythm — it is what every table on this page already is.
- **If it means a single FLAT LIST where consecutive ROWS alternate meaning — row 1 is a location,
  row 2 is that customer's link, row 3 is the next location, row 4 its link — that is a different and
  worse thing.** It halves the visible row count against the true customer count (400 customers read
  as 800 "rows"), breaks the one-cell-one-field convention every other table and the paste mechanism
  (`panePasteAt()`) already assumes, and defeats Enter-down-column entirely, because column-major
  typing requires every cell in a column to mean the same thing — alternating meaning by row parity
  is a row-major-only shape, and it is the row-major shape my tenth-invocation retraction already
  found to be the more expensive one where it is avoidable.
- **A file already existing in a flattened, alternating shape is not a reason the TYPING SURFACE has
  to match it.** This is exactly the "a number that came from a file is the user's; we display and
  solve from a copy" principle CLAUDE.md already states for numeric values, read across to STRUCTURE:
  an importer is free to read whatever shape the source file is actually in and lay it into two real
  columns on screen; the parser's job is to absorb that shape once, not to make a clerk re-encounter
  it 400 times. I would ask which of the two Tom means before building, and recommend the two-column
  row shape if there is any doubt — it is strictly better for typing and is what the rest of this
  page already does everywhere else.

**Is LINK something a person should type at all, or is nearest-pipe a safe guess?** My answer: type
or match it, never silently substitute a guess, and here is the concrete reason rather than an
appeal to caution in general. `dev/customer-demands.md` §2 already computes the nearest node from
"nearest POINT ON THE POLYLINE, arc length to each end" — that is nearest-pipe geometry, and it is
exactly the kind of thing that goes wrong in the case that matters most for a plan-set clerk: two
parallel mains a few feet apart (common on a distribution loop, or an old main paralleled by a
replacement), or a service crossing near an intersection of three or four pipes. A purely geometric
nearest-pipe answer picks confidently and wrong in exactly those cases, and the error is silent —
the meter still draws, the table still fills, the demand still solves, and it is attached to the
wrong main. This is the same shape of danger CLAUDE.md already names for elevation-fill ("never
overwrite a value the user has without their having asked for exactly that") and for units ("never
guess a unit needed for a solve") — a value that changes the ANSWER must never be quietly
substituted. **So: LINK is the one field in a customer bulk-import row that must never be guessed.**
A plan set already states which main serves which service (that is exactly the information a
nearest-pipe geometric guess cannot recover reliably at an intersection), so asking for it is asking
for information the clerk already has in hand, not busywork. I would still compute and SHOW the
geometric nearest-pipe as a suggestion next to an empty or ambiguous cell, the way the elevation-fill
feature states its own accuracy in the interface rather than the comments — visible, never silently
accepted.

**What would the file actually look like, honestly:** I would expect a real plan-set transcription to
be closer to `account, x, y, link, demand` as five real columns — one row per customer, in the shape
every other table on this page already uses — rather than a flattened alternating sequence. If the
underlying file Tom has in mind is genuinely pair-flattened (which is a shape I have seen in some
legacy fixed-format exports, though I did not go looking for one specifically for this session — see
"where I did not look" below), the importer reading it is a one-time parsing decision and the on-
screen columns should still be two real columns, per the file-numbers-are-the-user's-but-display-is-
ours principle above.

### Q2 — per-entry checkboxes for a library import: per-library is enough; 200 checkboxes is the wrong instrument

**SPECULATION**, reasoned from the same arithmetic as everything else in this seat, since I have not
read the importing branch's own code this session (did not go looking for it; the branch name was
not given to me). Someone importing a colleague's pipe-type table wants ALL of it or NEARLY all of
it, in the overwhelmingly common case — the reason to import a library at all is "I don't want to
retype these," and a library somebody maintained is a library somebody uses most of. A 200-row
checkbox list defaults every box to a state (checked or unchecked) and either way it is wrong for
most importers: default-checked costs one click per row you DON'T want (rare, so cheap in total but
still a hunt-and-uncheck task across 200 rows to find the few); default-unchecked costs one click per
row you DO want (the common case, so it is 195 clicks to get what "import the library" already meant
for free). **Per-library selection, plus ordinary post-hoc pruning through the existing Tables pane
selection-and-delete mechanism** (the same one Task 610/paste already gives every other element kind)
is cheaper in the common case and no worse in the rare one: import everything, then multi-select and
delete the handful you did not want, which is a task this page's own table selection already does
well (drag/Shift-click a range, Delete). I would not build a 200-checkbox picker at all. If Tom wants
a half-measure, a text filter box ABOVE a checkbox list (type "PVC" to narrow 200 rows to 12, then
check/uncheck those) is worth it only if the library is large enough that scrolling to find items is
itself the cost — and even then, import-then-prune is probably still cheaper, because it reuses a
mechanism that already exists rather than asking for a new one.

### Q3 — a file-format chooser for surveyed points: yes, and it is the SAFE answer, not merely a convenient one

**CITED**: PNEZD = Point, Northing, Easting, Elevation(Z), Description; PENZD swaps the two
coordinate fields to Point, Easting, Northing, Elevation, Description — both real, named,
documented Civil 3D / survey conventions (Cadline Community, "Civil 3D Survey - What is a PENZD
point file," https://www.cadlinecommunity.co.uk/hc/en-us/articles/201758902-Civil-3D-Survey-What-is-a-PENZD-point-file;
Autodesk Community forum thread confirming both are shipped and the difference is real enough to
confuse Civil 3D's own users, "C3D 2013: Creating a Surface-Using PNEZD, not PENZD. Why?",
https://forums.autodesk.com/t5/civil-3d-forum/c3d-2013-creating-a-surface-using-pnezd-not-penzd-why/td-p/4480667).
**CITED**, wider list checked today: CivilGEO's own supported-formats documentation
(https://knowledge.civilgeo.com/supported-external-data-formats/) names at minimum ENZ, ENZD, NEZ,
NEZD, PENZ, PENZD, PNEZ, PNEZD and plain XYZ as distinct, named orderings it accepts — i.e., the
axis that varies is not just "where does Description go," it is (a) whether a point ID/name column
exists at all, (b) whether a description trails, and (c) **which of Easting/Northing comes first**,
independently of the other two.

**The one that actually bites is (c), and it is silent.** An ID or a missing description is
obviously wrong the moment you look at the imported points — a point named "" or "12.4" reads as
broken immediately. A NORTHING/EASTING swap does not: both are ordinary-looking numbers in a
plausible range for the region, the imported points still draw, they still look like a network, and
on a roughly square or oblong site the swap can put the whole survey in a position that looks
locally sane and is not where the plan set says it is — this is the exact same class of danger
CLAUDE.md's own coordinate-order rule already names for lon/lat vs. lat/lon ("system order is
lon,lat; public order is lat,lon... a bare `coords` or `point` is the defect"). This suite has
already had to write a rule for exactly this shape of ambiguity once; a survey import is the same
shape again, from a different door.

**So yes — a chooser is the right instrument, and I would not try to auto-detect the order from the
data.** A magnitude-based heuristic (e.g., "whichever column has the larger typical value is probably
Easting, because UTM eastings run bigger than northings in some zones") is exactly the kind of clever
guess that works on the examples you tried it on and fails silently on the plan set you didn't. Given
the honest choice between building a chooser and guessing, guessing is the one that can quietly put
a distribution system in the wrong place. Minimum viable chooser, in my own ranked order of value:
(1) which convention — N-before-E or E-before-N — is the one field that must be explicit, asked in
plain language ("first coordinate column is: Northing / Easting") rather than by acronym, since
PNEZD/PENZD is jargon my seat can use in this journal but a form label should not assume the clerk
already knows which is which; (2) whether an ID/point-number column and a description column are
present, which is lower-stakes (wrong guess there is visible immediately, per above) but still worth
one radio button each rather than a full acronym picker; (3) **read the header row when one exists**
— most data-collector CSV exports do carry a header naming its own columns (`Northing`, `Easting` or
`N`, `E`), and a header that states its own order should be trusted over any chooser default, the
same as this suite already reads a `.inp` file's own units rather than assuming. Fall back to the
chooser only when there is no header to read, and never let a present header be silently overridden
by a stale chooser default from click 1 of a multi-file import session.

**Where I did not look this session:** I did not read the actual library-import branch's code (Q2)
or the CSV-import branch's code (Q3) — both questions were answered from the design record and from
external citation, not from the branches' own current state, because neither branch path was given
to me and I was asked to answer in advance of the build. A future invocation reviewing the built
code should re-verify against what actually shipped before repeating these as findings rather than
recommendations.

— Declan

## Twelfth invocation, 2026-09-19 — re-verifying and completing the Task 610 vertex-cell spec

Tom's orchestrator relayed that Task 610 is blocked "on it and nothing else," as if the spec did
not exist. **OBSERVED**: it does — `dev/agents/data-entry-clerk/task-610-vertex-cell-spec.md` was
delivered in full on 2026-09-09 (wishlist item 1's update of that date), with the format
(single-`/`-separated flat list, lat/lon or x/y per project kind, whole-cell refuse-or-commit,
empty means no bends), the round-trip mechanism (`mergeTok()`), and my read on Tom's other two
conditions. Rather than re-derive it from nothing, I re-verified it against the current tree and
added what it was missing against this invocation's more specific brief — an explicit sourced
ranking of five named candidates (in-cell list / WKT / WKB-hex / separate vertex table / no paste
at all), which the 2026-09-09 version argued for its own pick without naming or sourcing the
others as alternatives.

**What changed on re-verification, and why it matters:**

- **Section 2.1's claim ("Junction table still has no X/Y/lat/lon columns") is now FALSE and I
  corrected it in place rather than leaving it to mislead a future reader.** **OBSERVED**
  `js/looped-network.js:17097`, `paneColCoord(slot)` — this shipped under Task 674 (closed),
  independently of Task 610, and my own wishlist items 7 and 9 already tracked its build and
  placement without me connecting it back to this spec until now. Condition 2.1 of Tom's three is
  done; I marked it done in the spec file rather than trusting my own six-day-old claim.
- **Line numbers throughout §1–3 have drifted** (the file grew substantially between 2026-09-09
  and now) but every function named — `libPasteCells()`, `panePasteAt()`, `paneWriteCellText()`,
  `paneParseCellText()`, `mergeTok()` — still exists with the same signature and behaviour. I
  re-grepped each one rather than trusting the old citations; the design in §1 is unaffected.
- **New §4, added this session**, ranks the five candidates the orchestrator named explicitly:
  1. in-cell delimited list (unchanged recommendation); 2. a separate vertex table keyed on pipe
  ID — **CITED, this is literally EPANET's own `[VERTICES]` section shape**, already implemented
  in `js/lpn-inp.js:1263` (import) and `:3209` (export) — real, and the right shape for a FILE,
  wrong for a per-pipe PASTE cell (would need a seventh tab and a repeated ID per bend); 3. WKT —
  rejected, with a new piece of evidence found this session: **CITED**, QGIS's own attribute table
  cannot set geometry from a typed/pasted WKT string without a third-party plugin
  (plugins.qgis.org, "Plain Geometry Editor," "Geom From Attribute"), which is corroborating
  evidence that WKT-in-a-cell is not an established spreadsheet-paste convention anywhere, not
  only a bad fit for this page's own parser; 4. WKB/hex — rejected outright, no source treats it
  as a human entry format; 5. leave vertices out of paste entirely — named honestly as the safe,
  smaller first slice (every straight pipe already works under §1's empty-cell rule with no
  vertex column at all), not a recommendation to stop there.
- **The four "row 300" questions the orchestrator asked me to answer explicitly are now all
  answered with citations in §4**: malformed pair (refuse whole cell, unchanged), blank (no
  vertices, unchanged), the Excel character ceiling (**CITED**, Microsoft's own "Excel
  specifications and limits" page: 32,767-character storage limit, 1,024 displayed in-cell — at
  this format's ~9–12 chars/coordinate that is roughly 40–50 vertices before the CELL DISPLAY
  truncates visually, no data loss, no pipe plausibly needs that many bends), coordinate units/CS
  (table's displayed unit and the project's own coordinate order, re-affirmed against
  `paneColCoord()`'s now-shipped per-project labeling), and the round-trip rule (`mergeTok()`,
  confirmed still present and unchanged, still unapplied because there is no vertex column yet to
  apply it to).

**What I did NOT do:** I did not build anything, and I did not change my own recommendation — the
research this session strengthened the case for the in-cell list (the separate-table alternative
turned out to already exist as EPANET's own format, which made it worth taking seriously rather
than dismissing by assumption, and it still lost on paste ergonomics once actually compared) rather
than changing it.

— Declan
