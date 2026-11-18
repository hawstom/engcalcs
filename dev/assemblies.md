# Assemblies (pump and valve "Plus" elements)

Task 822. Still being negotiated with Tom; nothing is built. His answers to the 2026-10-23 interview
("Pump and Valve Assemblies", https://claude.ai/artifact/9fmKVp5sBuRjwuQvnn72R8, collection `answers`)
are quoted below from his free text. The seats' answers: `dev/agents/*/assemblies-2026-10-23.md`.

## His brainstorm, 2026-10-23

*"What if the toolbar and the menu has a big + button (toolbar) or the word Plus (menu) where the
current Chain junction and pipe command is, and it brings up a submenu of assemblies, all of which are
managed as a group and can be exploded."* Candidates he listed: Pump (two nodes and a link); Valve (two
nodes and a link); System (a reservoir and a pump); Virtual pipe (zero velocity, losses, time and
volume); Well (a reservoir, pump, etc.); Well and pressure tank (residential).

## What he answered

- **Storage:** a grouping over three plain objects, kept in the project file and in a comment line in
  the `.inp`. He asked us to confirm that a valve at a tank needs tank, link, node, valve link.
- **What it is, his draft public sentence:** *"An assembly is a combination of assets that appears for
  visual and management convenience as a single named point on the map with a combined properties box.
  In the tables and the solver model it is two coincident nodes with one or more links between them.
  Some properties of the two nodes are shared; when you change either one, the other one also changes
  to match."* More than one pump in an assembly is allowed if advisable.
- **Selecting:** one click selects the assembly; a combined Properties list (pump properties, node
  properties combined) with an **Explode** button. Coincident plain elements in general: a box asking
  which one (AutoCAD's Ctrl selection cycling noted, not wanted first).
- **No drill-down.** Explode only.
- **The word:** he would like to avoid "assembly" in the interface if there is no good reason for it:
  "Explode", not "Explode assembly".
- **Toolbar:** Declan's cycle, assembly first, remembered by the browser; the + marks the assembly
  form (pump plus, valve plus); a second press in a row cycles.
- **Placing:** a pump on open ground has no pipes and points rightward; several may be placed, like
  junctions. The first two pipes connected set the direction, toward the first pipe if it's drawn starting at and going away from the pump, else stay rightward until able to point toward the second pipe; Properties
  has a **Downstream pipe** chooser among its connected pipes. Clicking a pipe splices one in, but is
  probably not the usual way. One click either way.
- **Node IDs:** systematic, from the device's own ID (Tom, 2026-11-09: "Shouldn't V1 have V1D and V1U?"): a Pump+ pump
  P1 has nodes P1U and P1D, a Valve+ valve V1 has V1U and V1D, from the project's existing pump and valve prefixes; there is no
  prefix of their own. A derived ID that is taken passes the whole number over, so the group never mixes two numbers. A rename
  of one member renames no other; Explode and import never rename. Symbol: the upstream (high) side filled, the
  downstream (low) side hollow.
- **Elevation:** ground elevation, equal for both nodes by definition: equal x, y and z. Properties
  shows upstream and downstream pressure and HGL.
- **Detection:** open questions of his: is an assembly denoted by names or by coincidence of x, y, z?
  An exploded one marked on the link (`as_assembly`: no, on, off?). Commands: Explode assemblies,
  Restore assemblies, Convert pumps and valves to assemblies. The last needs a **virtual pipe** (zero
  volume, time, velocity and loss) and a question: virtual pipes for identical results, or pipes from
  current defaults for a changed model.
- **Tables:** existing tables unchanged (they list the coincident nodes); a separate simple
  Assemblies table with the two nodes' properties and whether there are pump or valve links. No
  collapsing. *"Let's keep negotiating."*
- **Volume:** no volume model; zero length stays; a short real pipe when volume matters. *"The real
  issue is how to handle the existing virtual pipes in the event we provide a 'Convert to assembly'
  command."*

## Expert levels, same interview

- *"Day 1 must be pure joy and fun. And I don't see that you all are appreciating that."*
- Basic mode is phase 1 of an inviting basic experience for the average user; *"We want the WaterCAD,
  EPANET, and epanetjs user, and we get them because everything is easier to do and to understand."*
- Open to coach marks; asked for a mockup.
- One drawing for everyone; levels change only what the page volunteers. *"I just don't want to
  overwhelm a new shopper."*

## Insert menu and well assemblies, Tom's notes 2026-10-25

- *Map, Insert, Basic:* Junction, Reservoir, Tank, Pipe, Pump, Valve.
- *Map, Insert, ++:* Junction-Pipe chain, Well [reservoir, pump, tank], System curve [reservoir at
  ground, pump], Virtual pipe [zero volume, length, velocity], Pump+ [2 x nodes, pump(s)], Valve+
  [2 x nodes, valve(s)]. Icon and symbol sketches: `~/tom-files/sketches/insert-plus-icon-and-symbol-ideas-2026-10-25.png`.
- *Well assembly properties:* groundwater static elevation, GPV drawdown curve, pump curve.
  - *For pressure tank:* total tank volume, pump-on pressure, pump-off pressure, and empty pressure
    (default = pump-on minus 2 psi). *"We build a pressure tank curve using Boyle's Ideal Gas Law.
    Maybe we add Pressure Tank in our Libraries, shown only if somebody adds one."*
  - *For open-air tank:* the normal tank parameters.
- *Well icon* (Tom, 2026-10-26): *"I wonder if it would be nice to depict drawdown on a well icon."* Sketch as above.

## Tom's calls, 2026-11-06, and what is built

- **Detection (a later slice).** Assemblies will be guessed from coincidence plus a naming pattern plus a
  topological pattern, and only when the map is not heavily coincident (at least half the nodes
  non-coincident). The page alerts that apparent assemblies were found and asks permission to convert.
  **Convert pumps and valves to assemblies** (later) uses virtual pipes so no result moves, and alerts that
  the model could be made physically representative. Detection must produce the same stored grouping
  described below, so it needs no storage of its own.
- **First slice:** the virtual pipe, then Pump+. Valve+, Well and System follow.

### The grouping (one design for every assembly kind)

`doc.assemblies` is a list of `{ id, kind, up, down, links }` and nothing else is an assembly. `id` is the
first link's id, `kind` is `pump` (later `valve`), `up` and `down` are the two coincident junctions, `links`
are the pump links between them. The nodes and links are ordinary entries in `doc.nodes` and `doc.links`:
every table, the solvers and the `.inp` see what they always saw. A grouping is written to the project file
only when there is one, and `applySaved()` keeps one only if every element it names exists. Deleting or
renaming a member keeps the list true (delete dissolves the group, rename follows it). Undo carries it,
because it is part of `doc`.

In the `.inp` it is one comment line per assembly, `;ASSEMBLY: pump P1U P1D P1` (kind, upstream node,
downstream node, links), written after the last section and before `[END]`. EPANET and every other reader
skip it; our reader restores the group only when every element is in the file, and reports it (`assembly-
unresolved`) when not. A file with no assembly gets no line, so Net1, Net2 and Net3 stay character-exact.
A pump with no curve exports as a pipe (the existing `pump-no-curve-as-pipe` difference), so the group names a
link that reads back as a pipe; the group still restores.

### The virtual pipe

- **Stored** as `virtual: true` on an ordinary pipe (`type: 'pipe'`). It is a pipe in every table, in Find and
  in the drawing, where it is dotted (Tom's sketch of 2026-10-25). Its stored diameter, roughness, minor loss and
  length are ignored, so a pipe that is made virtual and then ordinary again comes back as it was. Base's
  own, like a pipe's type: the box is greyed out inside a scenario.
- **Built-in solver:** the model handed to it (`assembleModel`) carries `length: 0`, `k: 0`, `virtual: true`.
  A pipe of length 0 already has resistance 0 (`lpnResistance`), so no solver change was needed beyond
  reporting velocity 0 and head loss 0.
- **EPANET:** refuses a pipe of length 0 (error 211), so the model's pipe goes out as the stand-in a curveless
  pump already uses: 0.01 m as wide as the project's largest ordinary pipe (1000 mm when there is none) at C 150 (0.0000015 for Darcy-Weisbach, 0.008 for Manning). Its head loss
  is about 1e-7 m at 100 L/s. Velocity and head loss are reported as 0 from the engine too. Not reported as a
  difference: it is exactly what was asked for.
- **`.inp` export** writes the same stand-in row (0.01, then the widest ordinary pipe's diameter in its own characters (40 in or 1000 mm if none), then C 150 and so on) and one
  `;VIRTUAL: id id ...` line next to the assembly lines. Import reads the line and marks those pipes virtual;
  the row's numbers are taken as written, so a second export is byte-identical. Plain EPANET sees a short, wide
  pipe: the loss is negligible but the 0.01 m of volume is not exactly zero, and says so here.
- **Measured** (`dev/lpn-spike/virtual-pipe-harness.js`, a four-pipe loop, 15 L/s through the virtual pipe):
  inserting one moves no head by more than 2e-7 m in the built-in solver and 4.5e-7 m in EPANET, and no flow by
  more than 2e-8 m3/s; the two engines agree on the virtual network to 1e-5 m.
- **Not done:** water quality travel time through a virtual pipe in an EPANET run is the stand-in's 0.01 m, not
  exactly 0; the built-in extended-period loop treats it as length 0.

### Pump+ (built)

- **Place:** the Pump toolbar button's second form (Tom, 2026-11-06: "Put Valve+ on Valve, Pump+ and Well on Pump,
  Virtual Pipe on Pipe"; there is no Plus button). Pressing Pump, or key 6, while a form of it is the tool moves to
  the next form; the button shows the armed form and a corner triangle, as Select area does. Pipe holds Virtual pipe
  and Valve holds Valve+ the same way (`TOOL_FORMS`). Or Insert > Pump+, listed beside Pump. A press on open ground makes two coincident junctions (IDs P1U and P1D, from the pump prefix and the number it mints) and a
  pump from the upstream to the downstream node; a press on a pipe in Base splices it in (pipe, pump, pipe).
  The tool stays armed, like every inserter. The pump has no curve until one is chosen, so it adds no head.
- **Look:** a plus across the pump symbol's outlet barrel, cut out of the solid body in paper colour (an ink plus
  vanished on it). The upstream/downstream discs are gone (Tom: misleading, too much room); the two coincident
  nodes already draw a junction-sized hollow dot at the pump's centre, which is the "two nodes at a point" mark he
  asked for. Its direction is the existing zero-length rule: toward the first pipe on the downstream node, else
  away from the one on the upstream node, else rightward.
- **One click selects the group** (both nodes and the pump), by any member. The Properties box is the pump's
  (curve, speed, efficiency, Closed, Active), one Elevation, the flow and head, upstream and downstream head and
  pressure, and **Explode**. An elevation, x or y set on either node (Properties, Tables, the override tick) is
  written to both by `setProp()`. Rename and delete keep the grouping true.
### Valve+ (built)

The same grouping with `kind: 'valve'` (`;ASSEMBLY: valve V1U V1D V1`), on the Valve button's second form (key 7
again). Same placement, splice, select-all, one Elevation, Explode, drag and delete. The Properties box is the
valve's own (type, setting, diameter, loss) with the upstream and downstream pressure rows. The plus stands at the
upper right of the bowtie, over the corner as in Tom's sketch, in ink with a paper keyline where it crosses the solid.
`.inp` import reads the `;ASSEMBLY:` line after the valves are in, so a Valve+ restores.

- **Not done in this slice:** Well, System; the Assemblies table; the Downstream pipe chooser; detection and
  Convert; coincident nodes moved by a drag of one node alone (a click selects all three, so a drag moves all).

### Round 4 (Tom, 2026-11-09)

- **Leaders:** an assembly's node label has a leader under the same rule as every label (it stands far enough from its
  node to need one). Nothing suppresses it any more.
- **The pump's or valve's own label** (it was hidden for want of a length to stand along) is not drawn along a pipe: it takes
  the one quarter of the symbol the node labels leave, the downstream half on the side of the pipe the upstream label is on,
  placed once like a hand-placed label (`assemblyLinkLabelBase()`).
- **Which node a pipe joins:** a pipe, pump, valve, virtual pipe or chain leg that ENDS on a Pump+ or Valve+ joins its upstream
  node; one that STARTS on it joins its downstream node; a chain or pipe that carries on after reaching one goes on from the
  downstream node; a pipe from a device to itself is nothing. Before this the press took whichever of the two coincident
  nodes the browser's hit test returned (in practice the later one, the downstream node) whether it was a start or an end.
  A pipe's end moved afterwards is changed only by typing a node ID in From or To (Tables, Properties); there is no
  dragging of a pipe end, so nothing is guessed there.
- **Velocity:** a virtual pipe, and any pipe of length 0, reports velocity 0 in the built-in solver; EPANET is handed the
  stand-in for a virtual pipe and reports 0 for it. A pipe of length 0 IS a virtual pipe (derived, not stored: the flag or length 0), in both engines and on export;
  Properties shows "Virtual pipe (length = 0)" when the box is not ticked. Stand-in width: the largest diameter among the
  ordinary pipes of the network being run (the scenario's own).

### Well, slice 1 (Sue's design, 2026-11-09; `dev/lpn-spike/well-harness.js`), as it stands after Round 7

The Pump button's third form (Pump, Pump+, Well, Well with tank). Five ordinary elements at one point: **R** a reservoir whose head is the
groundwater's static elevation, **D** the drawdown node (the pump's upstream junction, no demand, same elevation as R), **V** a GPV from R to D whose
head-loss curve is the drawdown against pumping rate (it includes the point 0, 0), **W** the pump from D to **P** its outlet, the junction the system's
pipes attach to and the one that carries the ground elevation and the drawing. The pump's curve is the head lifted from the pumping level (the static
elevation less the drawdown), not from the static elevation.

- **IDs and symbol (Tom, 2026-11-14, replacing the Round 7 list):** the well's ID is W1, from a project prefix **W** (Settings, beside the others), and it
  is also the ID of the node at the outlet. Its members are W1R (aquifer Reservoir), W1DV (virtual valve for well drawdown, the GPV), W1D (the node that
  shows drawdown), W1P (the physical pump) and W1 (the outlet node). A file written before Round 8 keeps its own IDs (pump W1, outlet W1P, valve W1V); a
  file before Round 7 its W1U and W1D: import and opening never rename. It is drawn as one symbol, the toolbar icon's own paths, on the outlet node; the other nodes and both links draw as nothing.
  A new well's static elevation is the ground less 100 ft or 30 m; where the ground waits for the DEM, the static level follows the fill, and no door
  that reads the land surface ever writes R or D.
- **Grouping:** `{ id: W, kind: 'well', nodes: [R, D, P], links: [V, W] }` (`id` is P's, the outlet node's, in a Well made since Round 8, and the pump's in
  an older one); pump and valve groups keep `up` and `down`. The `.inp` comment is
  `;ASSEMBLY: well R D P V W`, restored only when all five exist (R a reservoir, D and P junctions), else `assembly-unresolved`.
- **Shared values:** x and y reach every node; the static water level elevation typed on R or D reaches the other of the two; the ground elevation typed
  on P reaches nothing else. A pipe that ends on or starts at a well joins P. Splicing into a pipe makes P the node both halves attach to, with the
  ground interpolated along the pipe.
- **Scenarios:** the static elevation and the two curve references (V's and W's `curveId`) are overridable through `setProp()`.
- **Solvers:** `EngCalcs.lpnDiagnose` does not refuse a GPV on a reservoir (EPANET's error 219 covers PRV, PSV and FCV only; a PBV is still refused).
  Both engines solve a well; the pump's discharge head equals static elevation less drawdown(Q) plus pump head(Q) to better than 1e-8 m.
- **Not built:** the pressure tank (Boyle's law; the open-air tank is Round 7's Well with tank), the Assemblies table.

### The Well's tee (Mary, 2026-11-09; `dev/lpn-spike/well-tee-harness.js`)

EPANET's `tankstatus()` (hydstatus.c) shuts the one link whose flow would fill a full tank, so pump -> tank -> system pipes silences the pump at full
level and the tank alone feeds the system (Tom: "Do we need a tee and an off-line tank"). The tank therefore hangs on a branch off a tee and never
stands between the pump and the system. In Round 7 the tee and the tank are ordinary elements at points the user gives (Well with tank, below); the
property holds: measured in both engines on a 10 L/s demand with the tank full, pump 0.0100000316 m3/s, branch 0; with the tank half full the branch
takes 0.037 m3/s and the pump 0.047 (the engines agree to 5e-6).

### Sub-element sections and the graph (Tom, 2026-11-09; `assembly-sections-harness.js`, `assembly-sections-browser-harness.js`)

- **The box:** the assembly's own entry area first (ID, Description, Tag, Elevation, Static water level elevation, the two curves, the
  pump's or valve's own inputs, Closed, Active, Explode), then one heading per sub-element from upstream to downstream, titled with its
  kind and ID (Well: Reservoir W1R, Drawdown valve W1DV, Junction W1D, Pump W1P, Junction W1; Pump+ and
  Valve+: Junction, Pump or Valve, Junction). Under each, the rows that element owns, from the ordinary box's own row functions
  (`junctionResultFields`, `linkResultFields`, `tankResultFields`, `reservoirResultFields`, `tankDepthFields`): its solved head,
  pressure, flow, velocity, head loss and status; the Tank's Base elevation, depths and diameter. Not collapsible: every edit rebuilds the box.
- **The graph asks "Graph which sub-asset?"** A chooser above the Properties graph lists the members in the same order, opens on the
  device (pump, valve) and is remembered for the session; the chart is the ordinary element's (`pgAssemblySubject()`). The map's right-click
  menu shows one Time series graph row per member in place of its single row, and each opens an ordinary bubble. Chosen over a graph in each section
  because it reuses the one chart host and the one subject finder, and a bubble already takes any node or link.

### Perry's round 6 findings, fixed (`assembly-perry-v7-browser-harness.js`)

- A refusal (`lpnDiagnose`, e.g. a Well with no curves) keeps the last results on screen; the banner says why there is no new answer. Every refusal did the opposite before; it is now one rule. An unknown unit still clears them.
- The Well's static water level follows its ground, keeping its depth, until the user types a static value; `staticTyped` on the grouping records that in the project, and an imported well's is typed.
- A Pump+, Valve+ or Well link label is an obstacle to the aligned pipe labels. A Valve+ on a vertical pipe keeps each node label wholly on its own half. A Well's virtual pipe label takes a quarter the pump's label and leader do not cross.

### The Well's pump controls (Tom, 2026-11-09; `dev/lpn-spike/well-controls-harness.js`, `well-controls-browser-harness.js`)

*"It would be a great convenience to the user if we devised a way to write controls based on the input we request in assembly properties."*

- **Inputs:** "Pump on below" and "Pump off above", tank depths in the Elevation/Head unit as the tank's own depths are, blank meaning no
  automatic control. In the entry area of the Well's box, directly under the two curves, not under the Tank heading: they are what the
  user decides about the pump, and the entry area is where the Well's own design inputs sit; the sections below are the sub-elements' readouts.
- **What is written:** two ordinary simple controls, `LINK pump OPEN IF NODE tank BELOW on` and `LINK pump CLOSED IF NODE tank ABOVE off`,
  into `doc.controls`, each tagged `asm` with the Well's id. Both engines run them in an extended-period run like any control. Either level
  alone writes just its own control. The levels live on the grouping (`pumpOn`, `pumpOff`) and ride in the project.
- **In the Controls editor** they appear as the sentence, read-only, with "Written by well W1. Change it in the Properties box of the well."
  Read-only because the Well rewrites them on every edit of its inputs; an editable copy would be overwritten, and one fact gets one door.
- **Explode** removes the tag and leaves two plain controls the user owns. Deleting any member of the Well does the same.
- **.inp:** the controls are ordinary [CONTROLS] lines. The `;ASSEMBLY:` comment gains `ON=3 OFF=6`. On reading, the Well owns a control only
  while the file still holds exactly the sentence it would write for that pump and tank at that level; a hand-edited or missing one leaves
  that level unset and the control ordinary, so such a file always opens. Net1/2/3 and any project without a Well are unchanged.
- **Validation (`EngCalcs.lpnDiagnose`, code `well-levels`, both engines):** on below off, and each between the tank's minimum and maximum
  depth, else refused by name ("These wells need a pump-on level below the pump-off level...").
- **Scenarios:** not overridable. A control is document data in every scenario (the Library is a view of the document), and the Well's
  levels are the controls' numbers. The tank's depth limits the levels are checked against are the scenario's own.
- **Measured:** on 3 m / off 6 m over 24 h on a 6 m tank, the built-in loop and EPANET switch the pump at the same 21 times; pump flow agrees to
  2e-6 m3/s each step and tank level to 2 mm (the tank integrates the flow difference over a cycle).

### Open, from Tom's round 4 notes (2026-11-09)

- **An exploded view of a selected assembly**, its members fanned out along its downstream pipe as Google Earth fans coincident marks (*"I'm not sure whether this assemblies experiment will work. But let's keep experimenting."*).
- **Detection of an exploded assembly** exists only as the `;ASSEMBLY:` comment on import; he asked whether a menu command ("Detect exploded complex assets") belongs. His 11-06 calls on detection stand.
- **The umbrella word.** He finds "assembly" eyes-glazed and offers "complex asset", noting a pump or valve is not physically complex. Mary (journal 2026-11-09): "assembly" is Esri Utility Network vocabulary for a point feature containing others, pump assemblies its own example; "complex asset" is not an industry term she found. Visitor strings name the specific thing (Well, Pump+); the umbrella word appears only where one is needed.
- **The drawdown curve is points joined by straight lines.** Field practice is a curve (Jacob s = BQ + CQ², Rorabaugh s = BQ + CQⁿ); Mary recommends seeding the starter curve from s = BQ + CQ² and, later, a B/C/n entry that writes the points.
- **Slice 2, the pressure tank** (his answers to Sue): level shown as pressure head, Patm fixed 14.7 psi shown and editable, pump controls written automatically, static level and curves by scenario "OK for now"; reasonable initial values and an example that uses assemblies well (Task 823).

### Round 6 (Tom, 2026-11-11; `well-simple-harness.js`, `well-round6-browser-harness.js`)

- **Two Well forms on the Pump button** (Pump, Pump+, Well, Well with tank). **Well** is the simple one (Slice 1 above gives its members and IDs after
  Round 7). **Well with tank** was a one-point form here; Round 7 replaced it.
- **The box:** the top holds every input; each member's heading holds results only and always shows its rows, blank before a run.
- **One label block per assembly**, on its output node, placed by the ordinary node pass (the assembly's own placer is retired). Headed by the assembly
  ID with the device's values; one row per other member that has values, led by that member's ID; rows shed first-to-last, the heading last. The
  popup opens beside it, not on it. Round 7 states a Well's block exactly (below).
- **Symbol:** symmetrical, ground line past the pit, no valve symbol; Round 7 redrew it from Tom's sketch.
- **Controls editor** redraws when the Well writes or releases a control while it is open.

### Round 7 (Tom, round 6 pass, from his round 6 browser pass; `well-simple-harness.js`, `well-label-rows-harness.js`, `well-tank-three-point-harness.js`, `assembly-morph-harness.js`)

- **Well member IDs** (*"How about Reservoir R, Drawdown D, and Pump outlet P. In other words, W1, W1R, W1D, and W1P?"*): replaced by Round 8's list. The
  Explode tips are unchanged, in the words Tom approved.
- **The label block** (his example `W1 Z = 999', Q=99 gpm` / `W1R H=899'` / `W1D H= 799'` / `W1P H=1099', P=40 psi`, replaced by Round 8's three rows): the numbers
  are the ordinary fields', so the label settings govern which show. Order of the heading numbers: `WELL_HEADING_FIELDS` (Z then Q then P; he also asked
  *"Do we want to try to put Q first after the W1 ID?"*, so it is a swap if he wants it).
- **The Properties box:** flow once, above the headings (the pump's); pressure only under the outlet. The reservoir's Pressure row is gone too.
- **The symbol** (his sketch of 2026-10-25, WELL; round 10 is A4 of the 2026-11-14 proofs, his pick, after he refused round 9's dark water body): a ground line,
  a short narrow upper cylinder over a long narrow casing with a closed bottom (upper half-width to casing half-width 1.6 to 1, as in the proof), the drawdown
  curves falling from the ground line to meet the casing walls at the water level, and a full-weight horizontal water-level line inside the casing (a hairline
  vanished at 17 px; a line running beyond the casing read as a flange). On the map the curves and the level line carry `ec-water` and take a lighter tint of the
  symbol's ink, as the proof draws them blue. The box at the bottom (it read as a pump) is gone. The numbers are `EC_WELL_UPPER_HALF`, `EC_WELL_DEEP_HALF`, `EC_WELL_STEP`,
  and `EC_WELL_LEVEL` in `lib/Icons.lib.php`; the map symbol's grab shape and the label-leader avoidance box are derived from the icon's
  paths, so one number moves all. `well-symbol-browser-harness.js` rasterizes both icons at 17, 21 and 24 px and requires the level line to show.
- **Well with tank is three points** (*"Physically and geographically, a well is a location/point with a reservoir, drawdown, and pump. Cramming a tank into
  that point makes no sense"*): the Pump button cycles Pump, Pump+, Well, Well with tank. Three presses, each prompted in the status bar: the well
  (placed as a Well is, spliced into a pipe or on open ground), the tee, the tank. The tee may be the well's own point (the pipe joining them is then a
  virtual pipe), an existing junction, a point on a pipe (which splits it) or open ground; the tank an existing tank or open ground; a press on the wrong
  kind of node is refused in the status bar and asked again. Result: an ordinary Well, an ordinary junction, an ordinary tank and two ordinary pipes with
  lengths from the drawing (Auto), the whole act one Undo step. Escape or another tool stops it, leaving what is placed.
  - **Grouping:** the Well's grouping gains `tee`, `tank` and `branch` [the two pipes]. They are ordinary elements at their own points: not coincident
    members (clicking the tank selects the tank, a drag of the well moves the well), but the group knows them, so deleting or morphing any of them ends
    the group, a rename follows, and `.inp` and the project file carry them. This is what keeps the pump's controls in one place: the Well's box asks Pump on
    below / Pump off above once; the tank's own depths are on the tank's own box.
  - **`.inp`:** `;ASSEMBLY: well R D P V W ON=3 OFF=6 TEE=x TANK=y PIPES=a,b`.
  - **Old files:** a one-point Well with a tank (`well R U T D V P B`, or the earlier `well R S T V P`) opens as its elements, all kept, with its controls as
    ordinary controls; the status bar (project file) or the import report (`.inp`, code `assembly-well-tank`) says so. The one-point form's code is gone.
  - **Still open:** the pressure tank (Boyle's law; Tom's 2026-10-25 notes: total volume, pump-on and pump-off pressure, empty pressure). Only the
    open-air tank is built.
  - **The toolbar icon** for Well with tank is `ecWellTankIcon()` in `lib/Icons.lib.php` (B7 of the proofs, Tom's pick): the Well's own drawing at 0.55 under a ground
    line, a riser that turns into the run (no stub, no cap: Tom, 2026-11-16, "it's non-physical and not helpful"), and the run to a wide, flat, rounded tank (2 to 1) standing on the ground line. The run is lowered to within a
    stroke of the ground line, so it enters just above the tank's floor, because a ground tank's outlet is at its floor or a few inches above it (Tom, round 8; state rules
    WV 64-77-9 and WI NR 811.64 per the market researcher). A tank raised to the run, and one on legs, were drawn and read worse at 17 px.
- **Morph** (*"I think we need to have on our checklist to ensure that Morph works with the + assemblies before we merge this."*): a Morph of ANY member
  (nodes and links of Pump+, Valve+, Well and a Well with tank's tee, tank and pipes) first separates the group as Explode does, inside the Morph's own
  undo step, then changes the type as for any element; the status bar says which group was separated; one Undo restores both. In a scenario the type
  is an override as always and the group is separated for every scenario (the grouping belongs to the document). Morphing an ordinary element leaves every
  group alone. Tried on every member into every other type, in Base and in a scenario (`assembly-morph-harness.js`, 287 checks).
- **Perry's round 7 fixes** (`well-panel-steps-browser-harness.js`, which walks the preview panel's steps as written): the block is never folded into one line
  (`tryInlineNodeLabels()` skips assembly blocks; their rows shed instead); the Well's grab shape is the topmost in the layer, so a tee on the well's own
  point never takes a press on the symbol; Explode redraws the labels at once and the status bar says what it did, for every kind (`lpn_assembly_exploded`).
  A Well spliced into a crowded pipe (Net1's L21) has its whole block hidden at fit and for the first zoom notches: honest crowding, not rank. The block
  is dropped by first-fit because it refuses every side where a pipe runs under it (the rule that stops its rows lying across a pipe); raising its
  drop rank changed nothing. The test project the panel names is `dev/lpn-spike/well-test-net1.lwn` (Net1 with the curves Drawdown and WellPump, Head ticked).
- **Merge checklist, before this branch goes to master:** Morph works with every + form (done, above); Pump+/Valve+/Well/Well with tank open and save
  from old files (done); the pressure tank is not built (said in the public text, if any).
- **The pump's selected circle** is unchanged (Tom wondered if it is "cartoonishly large"); its radius is in the round 7 report.

### Round 8 (Tom, 2026-11-14, from his round 7 pass; `assembly-ids-harness.js`, `well-label-rows-harness.js`, `well-tee-harness.js`)

- **THE RULE, NO EXCEPTIONS: every member element of every assembly form (Pump+, Valve+, Well, Well with tank) is listed in the group's Properties under its own ID** (Tom, 2026-11-14: *"I like that we are transparent in that we list every model element in Properties. Let's ensure that we make that a rule with no exceptions."*); `assembly-ids-harness.js` builds each form and asserts it, so a new member owes a section in `renderWellFields()`/`renderAssemblyFields()`.
- **IDs (Tom's list):** W1 the Well; W1R aquifer reservoir (node); W1DV virtual valve for well drawdown (link); W1D node that shows drawdown; W1P physical pump
  (link); W1 the node at the outlet. The group's ID is its bearer's: the outlet node's for a Well made since this round, the pump's for an older one, the
  device's for a Pump+ or Valve+. **The bearer is stored** (`idBy: 'node'` on a new Well's grouping; absent means the device link, which is how every older
  file reads), never inferred from the texts. The ID follows a rename of its bearer only. The group is not in the node or the link namespace, so a group and
  a node may be one text; **group IDs are unique across every group** (`assemblyIdClash()`): a rename of a bearer onto another group's ID is refused in the
  ID-taken words (`validateNewId()`), the prefix batch skips such a rename, the mint passes the whole number over, and a file that names two groups one ID
  (`EngCalcs.lpnGroupIdFix()`, shared by the `.inp` reader and the project file) keeps the first, lets a later Well fall back to its pump's ID, and does not
  group the rest (`assembly-id-clash` in the import report, a status-bar sentence for a project file). `;ASSEMBLY:` carries `ID=W1` for a bearer that is the
  outlet node (a line without it reads as the pump's). The Well prefix's Apply to all renames bearers; no other prefix's batch takes a Well's member.
  `renameInAssemblies()` rewrites only the kind that was renamed, since a node and a link may share a text. The member-to-group map (`assemblyIndex()`)
  serves every lookup and is rebuilt when the list changes or a member is renamed.
- **The label block:** `W1 Z=, Q=, P=` (Z ground elevation, Q the pump's flow, P the pressure at the outlet node W1), then `W1R H=`, then `W1D H=`; the outlet has
  no row of its own and the drawdown valve none. Always rows.
- **Why the block showed two rows where it should have four (`well-block-rows-browser-harness.js`):** not a setting and not a row that was never built. A node
  whose label finds no side (Net1's N23, at the window's edge) makes `shedNodeLabelsForCrowding()` enlist every label that overlaps any of its 28 candidate
  sides and take that label's lowest-ranked value, once a rung, for two rungs; a Well's block was among them and lost its member rows in a view with room
  all round it. A Well's block is now shed for its own sake only (`blocksOnly()`; a Pump+ or Valve+ block still sheds as a blocker). What remains is honest crowding: in Net1's densest pipes (11, 21, 112)
  no clear side exists for a block 190 px wide until the view is about twice the fit, and the block is then not drawn at all.
- **The opening view showed two lines, the third only after a wheel notch (Perry; `well-block-rows-browser-harness.js`):** a second cause, in the obstacle list. A
  Well stands on three coincident nodes and two links, four drawn as nothing, yet each registered a symbol box in `staticObstacles()` on the very ground its block's
  sides are tried on, and the Well's own symbol (3 units across at that scale) reached 0.3 into the nearest side; at some scales no side was clear for three
  rows and the shed took the rows, until a notch changed the margins. A Well's hidden members (reservoir, drawdown node, pump and valve symbol) are no longer
  obstacles, and the Well's own symbol is not an obstacle to its own label. A Well of a file whose labels do not tick Head shows its heading alone, rightly: the
  member rows are Head.
- **The "box" in the hole was the pump's and the drawdown valve's own symbols** (`well-symbol-browser-harness.js`): choosing a curve rebuilds those links, and a link built after `buildDom()` drew its solid symbol over the Well's (only `syncAssemblyGlyphs()` hid them, once, at the build); `buildLinkEls()` now hides a well link's symbol where it makes it.
- **Symbol:** the water-level line across the narrow hole at the drawdown, `lib/Icons.lib.php`. The upper hole's tint is the reservoir's and the tank's: one
  class (`lpn-node-symbol-backdrop`, 18 % of the symbol's ink over paper).
- **Well with tank elevations:** a tee and a tank the Well's own placing made follow the Well's elevation until the user types one of their own into either
  (`teeFollow`, `tankFollow` on the grouping, true only while following). An existing junction or tank pressed as the tee or tank, a tee on a pipe, a file from
  before this round and an `.inp` import never follow. **Under the DEM elevation source a tee or tank on open ground takes its own ground and does not
  follow** (follow is for a value carried from the Well or typed, never one the DEM reads); the value written otherwise is the Well's Base elevation, the one a
  node is born with in Base. **The DEM fill never moves or ends a follower**, and each node takes its own reading, so one batch gives one answer in any order.
  **Following is per scenario:** typing on the tee or tank in Base ends it in Base and so everywhere; typing in a scenario ends it for that scenario only
  (`followOff`: scenario id to `{tee, tank}`), the typing there being an override. A follower is written through `setProp()`, so in a scenario it is an override
  too, and clearing the Well's override there clears the followers' (`wellTankFollowClear()`). A blank typed on the Well is not followed.
- **A tank far below the tee (Tom: 700 ft lower gives unreasonable flow and velocity "even after the tank is at max level"):** EPANET 2.2 `tankstatus()`
  (src/hydstatus.c) closes (TEMPCLOSED) any link whose flow would enter a tank whose head is at or above its maximum, however far below the tee it stands; both
  engines do the same and agree with EPANET to 1e-6 m3/s. Below the maximum the pipe carries the head difference's flow: 213 m through the default 4-inch
  (100 mm) branch pipe is 6.5 m/s. A steady-state run holds the tank at its Initial depth and never fills it.

### Open, from Tom's 2026-11-11 notes

- **The pressure tank** for Well with tank (Boyle's law curve; total volume, pump-on and pump-off pressure, empty pressure; see Slice 2 above). The three-point form with an open-air tank is built (Round 7).
- **Auto curve** (*"especially when there are no curves available, to offer 'Auto curve' that creates a reasonable curve given the nearby or project diameters"*), seeded from Jacob's s = BQ + CQ^2.
- **Whether the Well's controls should be overridable by scenario** (*"Probably they should be [overridable by scenario], but do we currently have a controls alternative category? And what does WTG do?"*).

### Round 11: Well with pressure tank (Tom, 2026-11-16; `well-tank-three-point-harness.js` section 9, `well-controls-harness.js`)

- **Third form of the Pump button**, beside Well and Well with tank (Tom: "It's a lot. But let's go with a third additional form."). Same wizard, same group;
  `pt` on the group is `{ vol, pre, on, off, curve }` as typed. `syncPressureTank()` is the one writer of everything derived from it.
- **The model:** the tank is a fixed head at its gas pressure, so its level IS the gauge pressure head. It stands on the ground (follows the Well), minimum level 0,
  maximum level the pump-off head, a VOLUME curve from Boyle's law (water held at gauge head h is V (1 - P0/P), absolute pressures, atmosphere 14.7 psi used only for
  that), zero up to the precharge, and the pump controls are ordinary `BELOW`/`ABOVE` tank-level controls in pressure head. Pump on and off are typed in the Pressure
  unit, shown again as head; empty pressure (gauge) blank follows pump on less 2 psi; volume is in the Length unit cubed. A new tank is the 20-gallon class (2.7 ft^3,
  0.08 m^3), 40 and 60 psi. A pressure tank is made new (an existing tank is refused: the group rewrites its limits and curve).
- **Check:** 44 gal, 38 psig, 40/60 gives 11.35 gal drawdown by the formula; Amtrol-based sheets for the WX-250 print 11.8, 12.9 and 13.0 (they disagree with each other), so
  the harness holds the formula to within 4% of 11.8 and does not claim a table match. 32 gal gives 8.25 gal.
- **The curve is the group's:** read-only in the Libraries box (`curveWriterAsm()`), restored from `PT=vol,pre,on,off,curve` on the `;ASSEMBLY:` line, a plain curve
  after Explode. The tank's own box shows its owned properties read-only with "Written by well {id}" (Round 12 lists them), and `setProp()` refuses them (so Tables and Find and replace too). Scenarios: like the open-air form, the group writes Base and the document (controls and the curve are document data); an owned property is not overridable; the Well's ground elevation override still reaches the tank. The volume is typed in the Elevation/Head unit cubed, the family a VOLUME curve is read in.
- **`.inp` grouping comments (round 11 review):** matched exactly and case-sensitively (`;VIRTUAL: ` and `;ASSEMBLY: `), so a user's `;Virtual: ...` stays a comment. A group is restored only when every named element is the right kind (a curveless pump reads back as a pipe and still counts), else it is reported (`assembly-kind`); a malformed line is reported (`assembly-malformed`). A virtual pipe's export keeps the stand-in row, and its typed length, diameter, roughness and minor loss ride on the `;VIRTUAL:` line as `id=length|diameter|roughness|minor` (several lines, each under 255 characters), so a round trip restores them. No call of Tom's on virtual-pipe export was found; this keeps the stand-in he was shown and loses nothing.

### Round 12: a member whose inputs the group owns is locked (Tom, round 11 pass: "the tank properties can be edited"; `well-tank-three-point-harness.js`, `well-pressure-tank-lock-browser-harness.js`)

- **The rule:** one fact gets one door, the Well's Properties box. `PT_OWNED` lists what a pressure tank takes from its Well: initial, minimum and maximum depth, volume
  curve, tank diameter, minimum volume and can overflow. `ownerOfProp(el, prop)` is the one question every door asks. The tank's Properties shows those rows read-only
  (ID, results and the other rows stay), then one sentence: "Written by well W1. Change it in the Properties box of the well." (`lpn_library_control_owned`, the Controls
  editor's sentence). Tables draws those six cells as plain text (`plainFor`; no tip on a cell, so the sentence is in the Properties box). `setProp()` refuses them with the sentence, so a scenario
  cannot override them and Find and replace, the Settings push and paste cannot write them; Find and replace offers the property, leaves the tank out, and says the sentence
  instead of "Nothing would change." Explode removes the lock (no group, no owner).
- **Not locked, the tank's own:** Elevation, Base elevation, position, Description, Tag, reaction, mixing, initial quality. The open-air Well with tank's tank, the tee and the two
  branch pipes keep every input: Round 7 puts their values in their own boxes, and the Well's box asks only the pump's two levels.
- **No Select-the-well button:** no such door exists yet (the Controls editor's sentence is text).
- **Well symbol sketches (Tom, 2026-11-17):** circle with a vertical arrow (Well), joined to a rectangle (with tank) or a capsule (with pressure tank); a diagonal arrow
  variant reads as the male sign. Proofs only: `_panel/www/img/pump-plus/r12-well-symbol-proofs.png`. The branch's symbols are unchanged until he decides.
