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
- **Node IDs:** settable in the project's ID prefixes from the start; spaces refused as for the other
  prefixes; initial English prefixes **U** and **D**. Symbol: the upstream (high) side filled, the
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

In the `.inp` it is one comment line per assembly, `;ASSEMBLY: pump U1 D1 P1` (kind, upstream node,
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
  and Valve holds Valve+ the same way (`TOOL_FORMS`). Or Insert > Pump+, listed beside Pump. A press on open ground makes two coincident junctions (IDs from
  the new `U` and `D` ID prefixes, set under Settings > ID prefixes, spaces refused as for the others) and a
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

The same grouping with `kind: 'valve'` (`;ASSEMBLY: valve U1 D1 V1`), on the Valve button's second form (key 7
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

### Well, slice 1 (Sue's design, 2026-11-09; `dev/lpn-spike/well-harness.js`)

The Pump button's third form (Pump, Pump+, Well). Five ordinary elements at one point: **R** a reservoir whose head is
the groundwater's static elevation, **S** the pump's suction (a junction, no demand, same elevation), **T** an open-air
tank at the ground elevation where the system's pipes attach, **G** a GPV from R to S whose head-loss curve is the
drawdown against pumping rate (it includes the point 0, 0), **P** the pump from S to T whose curve is the head lifted
from the pumping level (the static elevation less the drawdown), not from the static elevation.

- **Grouping:** `{ id: G, kind: 'well', nodes: [R, S, T], links: [G, P] }`; pump and valve groups keep `up` and `down`. The
  `.inp` comment is `;ASSEMBLY: well R S T G P`, and the reader restores it only when all five exist (R a reservoir, S a
  junction, T a tank), else `assembly-unresolved`.
- **Shared values:** x and y reach all three nodes; the static elevation typed on R or S reaches the other of the two; T's
  elevation is the ground's alone. A pipe that ends on or starts at a well joins T. Splicing into a pipe makes T the node
  both halves attach to, with the ground interpolated along the pipe.
- **Scenarios:** the static elevation and the two curve references (G's and P's `curveId`) are overridable through
  `setProp()` as any node elevation and curve reference is. The tank's ground elevation and depths follow the ordinary
  tank rules.
- **Solvers:** `EngCalcs.lpnDiagnose` no longer refuses a GPV on a reservoir or tank (EPANET's error 219 covers PRV, PSV
  and FCV only; a PBV is still refused). Both engines solve a well; the pump's discharge head equals static elevation less
  drawdown(Q) plus pump head(Q) to better than 1e-8 m.
- **Not built:** automatic controls for the open-air tank; the pressure tank (slice 2, waiting on Tom's answers); a drawdown
  picture on the icon; the Assemblies table.
