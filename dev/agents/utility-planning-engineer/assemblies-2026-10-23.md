# Sue (utility planning seat): pump/valve assemblies and expert levels, 2026-10-23

I have no lived pump-station experience. Every practice claim below is CITED or marked SPECULATION.

## 1. Is two nodes plus a link "right"? Mostly yes, and the reason is stronger than convenience

- **CITED (EPANET source, OpenWaterAnalytics/EPANET `errors.dat`, `input3.c`).** EPANET refuses a valve joined directly to a tank or reservoir (error 219), refuses a valve joined directly to another valve (220), and refuses a link whose two ends are the same node (222). So a single-node assembly is impossible, and a valve beside a tank or beside another valve already forces the modeller to invent a node. Today the modeller invents it lazily; an assembly invents it on purpose. This is the best argument for Tom's idea, and it is not about elegance.
- **CITED (Bentley wiki, "system head curves in WaterGEMS").** WaterGEMS itself replaces a pump with a suction node and a discharge node to draw a system head curve. The pump station as two HGL points is how the vendor analyses it. A reviewer reads "suction HGL, discharge HGL, difference = TDH" off a pump station. Two named nodes give that for free.
- **SPECULATION.** In a utility's model of a real station, the suction side is a wet well, tank or header and the discharge side is a header, with a real elevation difference and real piping between. Two coincident nodes are the *minimum* model, correct for a design submittal and "wrong" only for a station whose internal piping matters. That is a larger-model concern, and it is the only place I would call the assembly too small.
- **Where pressure is reported.** Pressure at the discharge node is what a station is judged on, and a PRV *setting* is a pressure at the downstream node (EPANET manual, valve settings; I did not re-fetch it this pass, so treat as recalled, SPECULATION). So the downstream node's elevation changes what the setting means. See section 3.

## 2. Scale (my reason for existing)

- At 2,000 nodes, an assembly doubles the node count for every pump and valve. A system with a few hundred valves gets a few hundred extra nodes. That is fine for the solver; it is a cost for the *reader*. Required, not optional: assemblies must **collapse to one symbol on the map and one row in Tables** unless opened. Otherwise a master model becomes unreadable.
- **CITED (journal, 2026-09-25, and repo scope doc).** The suite is not a 2,000-node, 30-project CIP tool. So the scale test here is mainly import: a utility `.inp` with 400 valves arrives as bare links. **Do not auto-convert imports into assemblies.** Import is character-exact and must stay so; assembly should be something you apply to a link on purpose (see wish list: "Make assembly from link").
- **SPECULATION.** Large models handle this by convention, not by feature: node IDs like `PS1-S` / `PS1-D`, and a naming scheme the GIS shop controls. Auto-naming after the pump/valve is exactly this, and a utility will want the *pattern* to be settable (prefix/suffix).

## 3. Elevation of the two nodes

Same elevation by default is right for a design submittal. Two cautions from my seat:
- A PRV setting, a pump's suction, and a PBV/FCV are all read against the *downstream or upstream node's HGL*, so a wrong shared elevation silently changes results. Show the elevation as one value but let it be split, and flag a split on the assembly ("suction 412 ft, discharge 418 ft").
- A real pump has its own elevation (centerline) separate from the nodes. EPANET ignores it; reviewers do not. **I do not know** whether a submittal checklist asks for pump centerline elevation separately; I did not find one that does.

## 4. Questions 5 and 6: zero length, water quality, volume

- **CITED, OBSERVED in source.** In EPANET `input3.c` `pipedata`, a pipe with length <= 0, diameter <= 0 or roughness <= 0 returns error 202 ("illegal numeric value"). Pumps and valves are different: `pumpdata` sets `Len = 0` and `Diam = 0`; `valvedata` sets `Len = 0` and validates diameter > 0. In `qualroute.c`, `LINKVOL(k) = 0.785398 * Len * Diam^2`. So a pump or valve already has **zero volume** in water quality, by construction. Tom's "no unwanted volume" is already true for EPANET; the solver has no problem with zero-length *non-pipe* links.
- A zero-length **pipe** is refused by EPANET, so it must never be offered as the assembly's body. Keep the assembly's link a pump/valve. (Tom's repo facts agree.)
- **Q6, my position: do not add a length/diameter volume model to pumps.** A pump station's real volume (wet well, header) is not a pipe the size of the downstream main; giving a pump a default length equal to a diameter-sized pipe would add water-age error in precisely the place a reviewer looks (station retention). For a **valve**, EPANET already requires a diameter, so a diameter exists and zero length stays zero. If someone needs volume, they put a short real *pipe* beside the assembly, which is honest and exports as plain EPANET. Adding length to a valve link would not export (the `.inp` has no valve length), so it would break "only the user touches a file's numbers."
- **I DO NOT KNOW** whether the mainstream tools default a nonzero volume for a pump or valve in quality runs; I did not find it.

## 5. Expert levels: would they help a utility engineer?

- **SPECULATION, but strong.** A utility engineer would be hurt by an expert level that changes what the model *is*. Different representations of the assembly at different levels (Tom's 4b) is the risky one: two people open the same project, see different objects, and cannot agree on a node count. A level should change **tips and confirmations only**, never the document and never which elements are drawn. I would support Tutorial/Basic/Expert for tip delay and stopper dialogs; I would oppose any level that hides or merges model elements.
- Stopper dialogs in Tutorial mode: harmless for newcomers. For a professional they are a reason to leave; so the default must be Expert-by-choice, remembered per browser (window furniture, not project).
- **OBSERVED.** "Basic mode" already means something else (scenarios/alternatives only). The name collision alone is a defect; call the new one something that cannot be mistaken (e.g., "Guidance level").

## 6. Explode / manage as assembly

- Prefer **"Explode assembly" as a one-way command** over a "Manage as assembly" toggle. A toggle creates a state ("assembly, unmanaged, nodes coincident") every tool must handle at 2,000 nodes. Explode yields plain EPANET objects and a known state. **SPECULATION.**
- An immutable assembly is wrong: a pump station gets a second pump, or a valve needs a bypass. Explode is the escape.

## For my wish list

1. **"Make assembly from link" on an imported pump or valve (never automatic on import).** Small. SPECULATION about demand; CITED errors 219/220/222 are the real force.
2. **Assembly collapses to one symbol/one Tables row unless opened.** Required, small-medium; the scale condition for everything else here.
3. **Settable ID pattern for the two auto-named nodes** (prefix/suffix). Small. Utilities' GIS controls naming. SPECULATION.
4. **Report TDH and suction/discharge HGL on a pump assembly, and the downstream HGL against a valve setting.** Small; reader over existing results.
5. **Ranked low against myself:** expert levels as a project goal. A tip-delay setting is cheap; it would change nothing in a master plan or CIP year.

Sources: EPANET source on GitHub (src/input3.c, src/qualroute.c, src/errors.dat); Bentley wiki "Understanding System Head Curves in WaterGEMS, WaterCAD, and SewerCAD" (communities.bentley.com).
