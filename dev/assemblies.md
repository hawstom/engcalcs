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
- **Placing:** a pump on open ground has no pipes and points right; several may be placed, like
  junctions. The first pipe connected sets direction (pipe's start point away from it); Properties
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
