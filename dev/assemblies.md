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

- **IDs and symbol (Tom, 2026-11-09 and the round 6 pass: "W1, W1R, W1D, and W1P"):** the well is its pump and carries its ID, W1 from a project prefix **W**
  (Settings, beside the others; the pump prefix's Apply to all leaves well pumps alone). Its members are W1R (Reservoir), W1D (Drawdown node), W1V
  (Drawdown valve) and W1P (Pump outlet). A file written before Round 7 keeps its own IDs (W1U for the drawdown node, W1D for the outlet): import and
  opening never rename. It is drawn as one symbol, the toolbar icon's own paths, on the outlet node; the other nodes and both links draw as nothing.
  A new well's static elevation is the ground less 100 ft or 30 m; where the ground waits for the DEM, the static level follows the fill, and no door
  that reads the land surface ever writes R or D.
- **Grouping:** `{ id: W, kind: 'well', nodes: [R, D, P], links: [V, W] }`; pump and valve groups keep `up` and `down`. The `.inp` comment is
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
  kind and ID (Well: Reservoir W1R, Drawdown valve W1V, Junction W1D, Pump W1, Junction W1P; Pump+ and
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

- **Well member IDs** (*"How about Reservoir R, Drawdown D, and Pump outlet P. In other words, W1, W1R, W1D, and W1P?"*): W1R reservoir, W1D the
  drawdown node (was W1U), W1V the drawdown valve, W1 the pump, W1P the pump outlet (was W1D). Files before this keep their IDs; nothing is renamed on
  import. The Explode tips are unchanged, in the words Tom approved.
- **The label block** (his example: `W1 Z = 999', Q=99 gpm` / `W1R H=899'` / `W1D H= 799'` / `W1P H=1099', P=40 psi`): the heading is the ID with Z (the
  outlet's ground elevation) and Q (the pump's flow), nothing else; W1R and W1D give H, W1P gives H and P; the drawdown valve has no row. The numbers are
  the ordinary fields', so the label settings govern which show. Order of the two heading numbers: `WELL_HEADING_FIELDS` (Z then Q, as in his example;
  he also asked *"Do we want to try to put Q first after the W1 ID?"*, so it is a one-word swap if he wants it).
- **The Properties box:** flow once, above the headings (the pump's); pressure only under the outlet. The reservoir's Pressure row is gone too.
- **The symbol** (his sketch of 2026-10-25, WELL): a ground line, a wide upper cylinder, a narrow deep cylinder with a closed bottom below it, the drawdown
  curves meeting the narrow one above its bottom; the box at the bottom (it read as a pump) is gone. The upper cylinder's width is
  `EC_WELL_UPPER_HALF` in `lib/Icons.lib.php`, one line; the map symbol's grab shape is derived from the icon's first path, so one number moves all.
  He is asking colleagues whether it should be much narrower, only a little wider than the deep one.
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
  - **The toolbar icon** for Well with tank is `ecWellTankIcon()` in `lib/Icons.lib.php`, one small function: the well at 0.62 below a ground line with a
    tank standing above the line (Tom: the earlier drawing put the tank underground; proofs are with him).
- **Morph** (*"I think we need to have on our checklist to ensure that Morph works with the + assemblies before we merge this."*): a Morph of ANY member
  (nodes and links of Pump+, Valve+, Well and a Well with tank's tee, tank and pipes) first separates the group as Explode does, inside the Morph's own
  undo step, then changes the type as for any element; the status bar says which group was separated; one Undo restores both. In a scenario the type
  is an override as always and the group is separated for every scenario (the grouping belongs to the document). Morphing an ordinary element leaves every
  group alone. Tried on every member into every other type, in Base and in a scenario (`assembly-morph-harness.js`, 287 checks).
- **Merge checklist, before this branch goes to master:** Morph works with every + form (done, above); Pump+/Valve+/Well/Well with tank open and save
  from old files (done); the pressure tank is not built (said in the public text, if any).
- **The pump's selected circle** is unchanged (Tom wondered if it is "cartoonishly large"); its radius is in the round 7 report.

### Open, from Tom's 2026-11-11 notes

- **The pressure tank** for Well with tank (Boyle's law curve; total volume, pump-on and pump-off pressure, empty pressure; see Slice 2 above). The three-point form with an open-air tank is built (Round 7).
- **Auto curve** (*"especially when there are no curves available, to offer 'Auto curve' that creates a reasonable curve given the nearby or project diameters"*), seeded from Jacob's s = BQ + CQ^2.
- **Whether the Well's controls should be overridable by scenario** (*"Probably they should be [overridable by scenario], but do we currently have a controls alternative category? And what does WTG do?"*).
