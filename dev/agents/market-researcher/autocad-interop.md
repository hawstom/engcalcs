# AutoCAD interchange: what others have done before we invent anything

2026-10-05, Mary (market-researcher), answering Tom's question 1. Every line carries CITED, OBSERVED or SPECULATION. Public sources only; I installed and ran none of these tools. "Search summary" means I saw it only in a search result digest and a later reader must open the page before quoting.

## 1. What exists in this repo today

- **OBSERVED.** No DXF reader or writer anywhere in `js/` or `lib/` (grep for "dxf" finds only two dev harness files that mention it in passing: `dev/lpn-spike/setbox-initial-width-probe.js`, `dev/browser-pass/specs/pan.js`). The only CAD-adjacent input is the surveyed point list, `js/lpn-survey.js` (Task 592), which makes junctions only and no pipes.
- **OBSERVED.** `.inp` import and export exist and are character-exact on Net1/2/3 (CLAUDE.md, `js/lpn-inp.js`; `[VERTICES]` is read at `js/lpn-inp.js:1293` and written at `:3322`). So pipe bends already survive a round trip through EPANET's own format. That is the property a CAD exchange needs and several incumbents lack (see 2.3).

## 2. What others do

### 2.1 Bentley WaterCAD/WaterGEMS: three separate mechanisms

1. **Runs inside AutoCAD.** CITED, docs.bentley.com "AutoCAD Integration with WaterGEMS" (GUID-56290ADE...): "You can then run WaterGEMS CONNECT in the AutoCAD environment"; installed after AutoCAD it integrates automatically, installed before it needs a manual "Integrate" step. Same product also runs under MicroStation, ArcGIS, or stand-alone (Bentley data sheet, search summary). The model is held in a server-side native database, not in the DWG.
2. **Drawing Synchronization keeps the DWG honest.** CITED, docs.bentley.com "Drawing Synchronization" (GUID-DA9A9348...): topology is compared with the model database and the program "will force the drawing to be consistent with the native database by restoring or removing any missing or excess drawing custom entities"; then location, labels and flow directions are compared. Its stated purpose is to prevent corruption from editing the model stand-alone. Reading: the database is master, the drawing is a view. That is the opposite of a two-master sync.
3. **ModelBuilder: build a model from a DXF or GIS source.** CITED, docs.bentley.com "Specifying Network Connectivity in ModelBuilder" (GUID-A603FA94...): connectivity is explicit (pipe Start/Stop node fields) or implicit (spatial). Implicit uses a **Tolerance**, and "Create nodes if none found" makes a node at any pipe end with no node in tolerance. Bentley's own guidance: tolerance big enough to snap drawing imperfections, not so big that pipes join the wrong nodes. CITED (search summary of the same family): the CAD file must be saved as `.dxf`, cleaned of unneeded layers first, and layers are mapped to pipe diameter/material through user-data extensions. So Bentley, who owns the AutoCAD plug-in, still tells users to go through DXF.
4. **DXF export.** CITED, docs.bentley.com "Exporting a DXF File" (GUID-E05C64F3...): layer settings in tabs for Link, Node and Polygon layers, each with a prefix and suffix; a pipe-size significant-digits field splits the pipe layer by diameter. The page does not say which entities or attributes are written (I could not find it).
5. **Sync In / Sync Out exist, keyed on a stored id.** CITED, docs.bentley.com "GIS-IDs" (GUID-18AEF6FB...): every element has an editable GIS-IDs property "used for maintaining associations between records in your source file and elements in your model", supports one-to-many and many-to-one, and ModelBuilder has "advanced logic for keeping your model and GIS source file synchronized". CITED (search summary of the ModelBuilder help): **Sync In** can be limited to a selection set; on **Sync Out** every element in the target that also exists in the model is refreshed. This is the only documented real two-way sync I found, and it is GIS (shapefile/geodatabase) not DWG.

### 2.2 Autodesk: weak, and shrinking

- CITED (search summary, Autodesk Community idea "Export Pressure Network to EPANET module", forums.autodesk.com/.../idi-p/7968418; page returned 403 to me): Civil 3D pressure networks have no direct export to a hydraulic model; the idea is a standing request. The same search shows third-party bridges instead, Urbano Hydra and GISWATER over QGIS, taking shapefiles from Civil 3D.
- CITED (search summary): Civil 3D can export gravity pipe networks to Storm and Sanitary Analysis by LandXML, shapefile, or Hydraflow. Autodesk Community and ImagineIT posts say SSA is a "legacy extension" with no 2025 release expected (not formally retired).
- CITED (autodesk.com InfoWater Pro overview): InfoWater Pro runs on ArcGIS Pro, not inside AutoCAD. Autodesk bought Innovyze for about $1 billion (PR Newswire, ENR, 2021).
- **So:** Autodesk, the owner of AutoCAD, offers no in-AutoCAD water-distribution solver and no pressure-network export. The gap Tom would fill is real. SPECULATION: LandXML pressure-network import is the one Autodesk-native door worth a later look; I did not read the LandXML schema.

### 2.3 DXF-to-EPANET converters (the closest precedent to what Tom asks)

- CITED, Wikipedia "EPANET" and openepanet.org Topic 21733: **DXF2EPA** (released 2001-05-04, then withdrawn by the developer on the same date after EPA management objected to its scope): "All lines and polylines in selected layers of the DXF file will be converted into EPANET pipes and junctions". No tolerance or layer detail on the page.
- CITED (search summary of Scribd copies of the manual; ITA, Universidad Politecnica de Valencia): **EpaCAD** reads DXF (R12 onward), the user selects pipe layers, chooses whether a polyline is one pipe or one pipe per segment, sets a connection tolerance for nodes, previews, then saves an `.inp`. Windows only, 5.26 MB. This is the clearest published design: layers pick the pipes, tolerance makes the nodes, a preview before commit. I did not run it.
- CITED, openepanet.org / EPANET manual (search summary): EPANET 2's own File > Export > Map writes the current view as DXF, junctions as open circles, filled circles or filled squares. No attributes, no ids a reader could key on (SPECULATION from the description; not tested).
- CITED, water-simulation.com "EPANet Plus: improved map export to DXF" (2011): third parties found the stock DXF export worth improving.
- NOT FOUND: any maintained, open-source DXF-to-EPANET converter. EpaCAD is free but closed and Windows-only.

### 2.4 The format itself

- CITED, Autodesk DXF Reference "About Extended Data (DXF)" (help.autodesk.com/cloudhelp/2023/ENU/AutoCAD-DXF/files/GUID-A2A628B0-3699-4740-A215-C560E7242F63.htm, and the 2011 reference): **XDATA** is group codes 1000-1071 after an entity; each application block starts with 1001 and a registered application name of at most 31 bytes; a 1000 string is at most 255 bytes; order matters and codes repeat. A third party's XDATA survives in AutoCAD only if the application name is registered in the APPID table, which a DXF writer must add.
- CITED (search summary, pages not individually read): AutoCAD Map 3D **Object Data** is a separate table-based attribute mechanism, exported to SDF/shapefile with MAPEXPORT; AutoCAD's own Civil 3D parcels need SDF to keep attributes (c3dkb.dot.wi.gov; NRCS Iowa "CAD-GIS Data Exchange C3D"). Tom's own 2018 blog post (tomsthird.blogspot.com/2018/08/how-to-export-shapefile-from-autocad-or.html) says to ignore the data tab for the basic method, i.e. even the author's own recipe leaves attributes out. Object Data is not carried by plain DXF in a way a non-Autodesk reader can rely on (SPECULATION; not tested).
- **SPECULATION.** XDATA is the right carrier for our id and property values because it is in the open DXF spec, a plain-ASCII DXF writer can emit it, and AutoLISP/.NET (Tom's own tools) read it with one function (`entget` with an application name). Block ATTRIBs are the better carrier for anything a person should see and edit in AutoCAD itself.

### 2.5 Reading and writing in a browser

All CITED from npm registry JSON fetched 2026-10-05 and each package's README (search summary):

| Library | Does | Licence | Last publish |
|---|---|---|---|
| `dxf-parser` | reads DXF into a JS object | MIT | 1.1.2, June 2022 |
| `dxf` (npm) | reads DXF | MIT | 5.3.1 |
| `dxf-writer` | writes DXF: line, polyline, polyline 3D, point, text, circle... | MIT | 1.18.4, about 2022 |
| `@tarikjabiri/dxf` | writes DXF in TypeScript | MIT | 2.9.0 |
| `@mlightcad/libredwg-web` | **reads DWG and DXF** in a browser via WebAssembly, no server | **GPL-3.0** (it wraps GNU LibreDWG) | 0.7.14, current |

- CITED, GNU LibreDWG manual 0.13.4 (17 March 2026) and Wikipedia "LibreDWG": GPLv3+, reads DWG; writes only r2000 and older by default, later versions "an ongoing effort". CITED, librearts.org: the GPLv3 move stopped LibreCAD and FreeCAD from using it. We are GPL v3 or later (CLAUDE.md), so we are one of the few projects that can legally ship it.
- CITED (search summary, opendesign.com pricing and Vendr): the Open Design Alliance Drawings inWEB SDK is real DWG-in-the-browser, but the ODA tiers that allow Web/SaaS use are the Sustaining tier at about $7,500 in the first year and $4,500 after (Commercial tier, $3,000, excludes web/SaaS). That conflicts with a free GPL suite. Re-verify at opendesign.com/pricing before quoting.
- SPECULATION: a DXF writer is a day of work; we need none of these libraries to write ASCII DXF, and may not want a dependency to read it either (the entity subset we care about is small: LINE, LWPOLYLINE, POLYLINE, POINT, CIRCLE, INSERT, TEXT/MTEXT). **Do not send a drawing to Autodesk Platform Services to convert DWG**: it is an upload, which contradicts the no-upload claim in `dev/positioning.md`'s premises.

## 3. The minimum useful path

SPECULATION throughout this section (my design inference from the sources above); Mary should re-derive before Tom relies on it.

1. **DXF export, ASCII, no library.** Layer per asset type (the WaterGEMS pattern; prefix/suffix optional), optionally pipes split by diameter. Pipes as LWPOLYLINE with their bends (we hold vertices), nodes as POINT plus a text label (or a block). Each entity carries our **element id in XDATA** under one registered app name (say `LIBREWATER`, within the 31-byte rule) with id and kind and, optionally, the property values. Use the project's own coordinates; a geographic project exports Mercator or lon/lat as Tom chooses (see `dev/geographic-projects.md`).
2. **DXF import, by layers the user selects**, following EpaCAD and ModelBuilder: lines and polylines become pipes, with a tolerance that snaps ends to existing nodes or makes a node there; POINT/CIRCLE/INSERT on a chosen layer become junctions; a preview and a report of every difference before commit (our own rule from `js/lpn-inp.js`: report, never drop, never guess). Keep the tolerance an explicit number the user sees, in drawing units.
3. **A pipe that taps another pipe mid-run** is the one case a drawing hides: nothing in the polyline says there is a tee. ModelBuilder and EpaCAD solve it by tolerance on ends only. We should report "pipe end within tolerance of the middle of another pipe" and offer to split, never do it silently. (This is the same problem Tom raised in question 2.)
4. **DWG: ask for a DXF.** Bentley's own documentation tells users to save a DXF; DXF is the open format; LibreDWG-web is the escape hatch if users reject that, and it is GPL-compatible. Defer.

## 4. What a real sync needs

- **A durable key on both sides.** Bentley's is GIS-IDs, an editable string property per element; ours is the EPANET id plus the XDATA copy. An id typed by a user in AutoCAD will be renamed, copied and duplicated; handle numbers (DXF group 5) are assigned by the CAD program and change when a DXF is regenerated, so a handle is not a safe key across exports (SPECULATION; DXF reference says handles are unique per drawing, not stable across tools).
- **A master.** Bentley's Drawing Synchronization makes the model database master and repairs the drawing. If both sides can be edited, a conflict policy is needed. SPECULATION: for a browser tool the honest rule is that import never deletes: elements in the project that are missing in the file are reported, elements in the file with no id are reported as new, and everything matched by id is updated with its changes listed first. This is the existing `.inp` rule applied to a new source.
- **Sync Out needs a place to write.** Bentley's Sync Out refreshes a live target. A browser cannot see an open AutoCAD session, so "sync out" is "export again, then the user applies the file", and "sync in" is "import with ids". A true live link needs software running inside AutoCAD (AutoLISP, ObjectARX or .NET, Autodesk's published APIs), a separate deliverable that Tom is unusually well placed to write. SPECULATION: do not build it before the file round trip has users.
- **Units and coordinates.** The `.inp` rule that only the user touches a file's numbers holds: carry tokens verbatim, change nothing silently, refuse to solve on an unrecognised unit.

## 5. Gaps I could not close

- Did not read Bentley's DXF export page for entity and attribute detail (it says nothing); did not read a Bentley KB on DXF import limits (ServiceNow portal, not fetchable). Did not test any converter. Did not read the LandXML pressure-network schema. Did not find usage numbers for any converter, so I cannot say how many people are asking. Evidence of demand is the Civil 3D idea and the existence of EpaCAD and DXF2EPA only.

## Proposed journal entry (for the other Mary or Tom to paste; I did not edit journal.md)

2026-10-05 -- Mary: AutoCAD interchange. Report in dev/agents/market-researcher/autocad-interop.md.
- CITED. Bentley: runs inside AutoCAD (docs.bentley.com GUID-56290ADE...), Drawing Synchronization makes the model database master (GUID-DA9A9348...), ModelBuilder connects pipe ends to nodes by Tolerance with Create-nodes-if-none-found (GUID-A603FA94...), Sync In / Sync Out keyed on GIS-IDs (GUID-18AEF6FB...), DXF export layers per link/node/polygon type with prefix/suffix (GUID-E05C64F3...).
- CITED. EpaCAD (UPV): DXF to .inp, layer selection, connection tolerance, preview (search summary of Scribd manuals). DXF2EPA 2001 withdrawn. Autodesk has no pressure-network export (Autodesk Community idea 7968418, 403 to fetch); SSA is legacy.
- CITED. DXF XDATA: app name 31 bytes, 1000 string 255 bytes (Autodesk DXF Reference). @mlightcad/libredwg-web is GPL-3.0 and reads DWG in a browser; ODA web needs the ~$7,500 tier (search summary).
- SPECULATION. Minimum path: ASCII DXF export with layer per type and id in XDATA; DXF import with tolerance and preview; sync as id-keyed round trip that never deletes.
- NOT FOUND. Any maintained open-source DXF-to-EPANET tool; usage numbers for any.

## Proposed wish-list rows

1. **Before designing AutoCAD interchange, ask Tom which direction he needs first** (drawing into model, or model out to drawing). The evidence supports export first: cheap, no dependency, and no incumbent offers a clean one. Cost to answer: one conversation.
2. **Get one real Bentley DXF export and one EpaCAD run** (a half-day, needs a user who has them) to see which entities and attributes they write. Without it, "match WaterGEMS layers" is a guess.
