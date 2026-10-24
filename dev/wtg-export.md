# Exporting a network to a WaterGEMS project: the spike

Branch `feat/wtg-export`, 2026-10-22. Question (Tom): can we write EPANET's Net3 as a WaterGEMS/WaterCAD
project, `.wtg` plus `.wtg.sqlite`, that WaterGEMS opens and runs? This is a feasibility spike: no menu
row, no language key, no page change. Code: `dev/lpn-spike/wtg-export.js` (writer and command line),
`dev/lpn-spike/wtg-export-harness.js` (the test), `dev/lpn-spike/wtg-sqljs.js` (finds sql.js and the
reader), `dev/lpn-spike/reference/wtg-export-tiny.inp` (the smallest test network). Background and the
reader: `dev/sqlite-reader.md` and `dev/bentley-interop.md` on `feat/sqlite-reader`.

**Licence line, kept.** Built only from files an ordinary user or the public holds: Tom's own saved
project `~/webdev/fixtures/wtg-tgh-1/` (WaterGEMS 26.0.0.532, schema 1.0.54.0), the CC BY 4.0 Zenodo
7162154 files, TSNet's MIT samples, and what they show. No Bentley software or DLL was looked inside.
The only thing the writer takes from Bentley's side is a project the user saved with their own copy.

**Status: tested against our own reader and EPANET, not against WaterGEMS.** Whether WaterGEMS opens
the files is the one open question that matters, and only Tom's copy can answer it.

## The route, and why

Three routes were weighed.

1. **Write the schema fresh** (`CREATE TABLE` for 406 tables and 189 indices, then the default rows).
   Rejected: the tables, their order and every default row (the 19 default alternatives, the ten
   calculation-option rows, the scenario tree, the 133 element-type counters, the schema blob that
   states each field's storage unit) would all be our reconstruction, and one wrong default is a file
   WaterGEMS refuses with no message that names it. It would also mean shipping a copy of Bentley's
   schema in our source.
2. **Take an openly licensed sample as the template** (Zenodo 7162154, schema 1.0.44, WaterGEMS 10.1.1;
   or TSNet's, 1.0.38). Rejected as the primary route: both are years older than Tom's WaterGEMS
   (26.0.0.532 writes 1.0.54), and an old schema opened by a new version is an upgrade path, an extra
   thing that could go wrong. They are the evidence for codes, not the template.
3. **Take a project saved by the user's own WaterGEMS as the template, empty its elements, write ours.**
   **Chosen.** The schema, every default row and the version stamp are exactly what that WaterGEMS
   writes, so the file is the right version by construction. The writer clones: the template holds one
   live element of every kind, and the writer copies that element's rows (every table that keys on
   `DomainElementID` or `SupportElementID`, in the Base alternatives only) under a new ID and overwrites
   the fields the EPANET network states, by column name. A column the writer does not know keeps what
   WaterGEMS wrote itself. A template with no prototype of a kind it needs is refused by name.

**For a real product the template must come from the user**, not from us: the export dialog would ask
for a blank project the user saved from their own WaterGEMS ("New project, Save, drop the `.wtg.sqlite`
here"), read its schema version, and refuse a version not on a tested list. That keeps Bentley's schema
and defaults out of our source and out of our repository, and it keeps the file in step with the user's
version. The spike's template is Tom's fixture; nothing of it is in the repository.

**What the `.wtg` holds, and whether WaterGEMS needs it.** The `.sqlite` holds the model: elements,
values, scenarios, alternatives, calculation options, patterns, controls. The `.wtg` is an XML
*presentation* file (`StorageFile`, namespace `http://www.haestad.com`): display units
(`NumericFormatter ... DisplayUnit="flow:gpm"`), element label counters (`ElementLabelGenerator`),
symbology and colour coding, the drawing scale, tree expansion state, the compute status of each
scenario, the open views (`ViewIndex ... ScenarioId`), a projection string. It holds no element. Whether
WaterGEMS refuses a `.sqlite` without it is unknown; File > Open takes the `.wtg`, so we ship both. The
writer takes the template's `.wtg` and changes only: the project identity (new GUID), the removed child
scenario's references (its compute-status row, animation-setting row, three tree-expansion nodes and the
eight view rows pointing at it, now pointing at the Base scenario), and every compute status to 0. A
product could write a minimal `.wtg` from a short XML template of our own; what a minimal one may omit
is another question for Tom's test.

## What was written, and how

Net3 is US customary, GPM, Hazen-Williams, 24 h extended period at a 1 h step. The spike writes that case only
(the storage units were measured for it) and refuses anything else with a message.

| Net3 (EPANET) | WaterGEMS | Conversion and notes |
|---|---|---|
| Title | `HMIDomainDataSet.Notes`; Name = the file name | |
| Junction (92) | `IdahoJunction` (element type 55) | Elevation ft to `Physical_NodeElevation`. Base demand gpm to ft3/s (x 0.00222800929672, measured from Tom's file) as a row of `IdahoDemandNode_Demand_DemandCollection`, with the pattern's element ID. A junction on the default pattern gets it named explicitly. |
| Reservoir (2: River, Lake) | `IdahoReservoir` (56) | Head to `Physical_NodeElevation` (WaterGEMS's reservoir elevation is its grade). A head pattern is the `Physical_HglPattern` reference (unverified in WaterGEMS: that it multiplies the head the way EPANET's does). |
| Tank (3) | `ConventionalTank` (52), circular, operating range by elevation | Base elevation = Net3 elevation; minimum / maximum / initial elevation = elevation + level; diameter ft; area from the diameter. A **volume curve** makes it a variable-area tank (`TankSection` 2): depth ratio = (depth - minimum level) / (maximum - minimum), volume ratio = (volume - volume at minimum) / active volume, inactive volume = volume at the minimum level (Tom's TGH-1 scenario against its `.inp`). |
| Pipe (117) | `IdahoPipe` (69) | Ends in `BaseLink_HMIDataSetTopology_Data`; length as a *user-defined* length (flag 1, so the stated length is used, not the drawn one); diameter in to ft; Hazen-Williams C; minor loss K in both minor-loss fields; status Open/Closed to `PipeStatus` 0/1; a check valve to `Physical_HasCheckValve`. |
| Valve (PRV, PSV, PBV, FCV, TCV, GPV) | **A valve node** (types 64, 65, 66, 60, 61, 62) **between two pipes** `<id>-A`, `<id>-B`, as a pump is | Diameter in to ft; pressure settings psi (as the `.inp` states them, with the HGL beside them); FCV gpm to ft3/s; TCV loss coefficient; GPV a headloss curve (support type 63; flow to ft3/s, head ft). The node's elevation is the downstream node's, because an EPANET pressure valve states its setting there. A closed valve closes its upstream pipe. All measured against Tom's saved TGH-1 and its `.inp` export. |
| Pump (2) | **A pump node** `StandardPump` (68) **between two pipes** | See below. |
| Pump curve (2, three points) | `IdahoPumpDefinition` (support type 51), type 2 "standard three point" | Point 0 is the shutoff head; point 1 the design flow and head; point 2 the maximum operating flow and head. Constant pump efficiency from `[ENERGY]` (75), motor efficiency 100. |
| Patterns (5) | `IdahoPattern` (support type 50), stepwise | Starting multiplier = first value; point k states the value from k hours on; the last point closes the cycle with the first value again (the convention found by matching TSNet's `tnet3` pattern against its `.inp`). |
| Controls (6) | `IdahoControl` / `IdahoControlCondition` / `IdahoControlAction` (support types 54 / 56 / 55) | See "Controls". |
| `[TIMES]` | `EpaNetEngine_TimeAnalysisType_EpsType`: duration 86400 s, hydraulic step 3600 s | Start 00:00. The template already read EPS 24 h / 1 h; the writer states it. |
| `[OPTIONS]` | `EpaNetEngine`: Hazen-Williams (`FrictionMethod` 1), specific gravity and relative viscosity as the file states them (Net3: 1.0 and 1.0; kinematic viscosity is the relative value x 1.1e-5 ft2/s), extra iterations 10 | Trials 40, accuracy 0.001, check frequency 2, check cut-off 10, damping limit 0, emitter exponent 0.5 were already the template's defaults, equal to Net3's. |
| `[COORDINATES]` | `HMIGeometry`, a WKB point in feet | EPANET map units have no unit. One scale for the whole map, 750 ft per unit, is the median of (stated pipe length / drawn distance). Lengths do not depend on it. |
| Labels | `HMIModelingElement.Label` = the EPANET ID; `SmartLabel` = the label with each run of digits padded to seven | The ID column (a number, 31 upward) is separate from the label, as in WaterGEMS. |

**A pump is a node.** EPANET's link `10` (Lake to node 10) becomes a pump node labelled `10` plus two pipes,
`10-A` (Lake to the pump node) and `10-B` (pump node to node 10). They are 1 ft long and 99 in across, as the
Zenodo EPS model's pump pipes are (WaterGEMS's own `.inp` import made them 1 ft and 8.25 ft), so they add no
head loss worth the name (the harness holds EPANET to 0.014 ft over 24 h across the whole network, including
this). The pump node sits at the midpoint of the two end nodes and takes the suction node's elevation. The
pump's on/off state is carried by the status of `10-A`.

**Controls.** A control is three support elements, a condition, an action and a control joining them, and the
controls live in a **control set** that the operational alternative names. Net3's pump 10 controls are
clock-driven ("OPEN AT TIME 1", "CLOSED AT TIME 15") and are written as clock-time conditions
(`SimpleConditionType` 2, `CompareOperator` 0, the time stored as seconds since 1970 with the time of day in it).
Net3's four tank-level controls ("Link 335 OPEN IF Node 1 BELOW 17.1") are written as real tank-level
controls, in the codes below, which Tom's own saved `wtg-control-1` taught us. The pump is stopped by
closing its upstream pipe `335-A`, which is hydraulically the same as a pump status action (those codes are
still unseen). A junction-pressure condition has no sample; its link would keep the frozen clock schedule
(`opts.frozenLevelControls` forces that for every level control; Net3 has no pressure condition).

### Tank-level controls: the codes (from Tom's `wtg-control-1`, 2026-10-23)

Tom followed Ask 1 in WaterGEMS 26.0.0.532 and saved. Diffing his file against the tiny file he started from
shows every table WaterGEMS touched. A table-by-table record:

| What | Where | Code |
|---|---|---|
| Support element types | `HMISupportElement.SupportElementTypeID` | 54 control, 55 action, 56 condition, **59 logical control set** (type counts in `HMIElementTypeCount`) |
| Condition | `IdahoControlCondition` | `ConditionType` 0 (simple); `DefineDescription` 1 with a template `name {"%e" %a %o %v %u}` and the expanded text `name {"T1" Level < 5.00 ft}` |
| Operator | `..._ConditionType_SimpleConditionType` | `SimpleConditionType` 0 (an element attribute), `CompareOperator` **3 is less than, 1 is greater than** (other operators unseen) |
| What it tests | `..._SimpleConditionType_ElementType` | `ElementType_Element` the tank's ElementID; `ElementType_TankLevel` the value (5.0 for "5.00 ft", stored in feet); `ControlConditionElementType` **52 (a tank)**; the other value columns 0 |
| Attribute | `..._ControlConditionElementType_ControlConditionTankType` | `TankAttribute` **3 is Level** (a new condition starts at `ControlConditionElementType` 50, `NodeAttribute` 1); every other attribute table gets a row at 0, the node, hydropneumatic and surge tank ones at 1 |
| Action | `IdahoControlAction` | `ControlActionType` 0 (simple), same description template style; `..._SimpleActionType`: `SimpleActionType_Element` the pipe's ElementID, `ElementType` 69 (pipe) |
| Action attribute | `..._ControlActionPipeType`, `..._ActionPipeStatusType` | `PipeAttribute` 0 is Status; `ActionPipeStatus` **0 is Open, 1 is Closed** (Open confirmed; it was symmetry before). The pump, TCV, GPV, FCV and PRV action tables each get a default row |
| Control | `IdahoControl` | `ControlType` 0, `IdahoControl_ControlCondition`, `IdahoControl_ControlAction`; description `IF <condition text> THEN <action text>`; `IdahoControl_ControlType_LogicalType` one row (no priority, no ELSE, `ElseAction` NULL) |
| Control set | `IdahoLogicalControlSet` (`LogicalControlCollectionCount`) and `IdahoLogicalControlSet_LogicalControlCollection` (one row per control) | support element type 59, label `Logical Control Set - 1` |
| **Assigned to an alternative** | `Operational_SystemData.Operational_IdahoControlSetID` | the set's SupportElementID. **Tom's file left it NULL**, because he did not choose it in the operational alternative. That is what "not assigned" means: the set and its controls exist in the file, and no alternative uses them. |

Also in his file: the `.wtg` grew a `ControlSetTableEditorModel` table-width block (presentation only), and the
UI left soft-deleted scratch support elements (a condition and two actions it creates empty before filling
them). Neither matters to the writer.

The writer therefore emits all controls (clock and level) as members of one control set and writes that set's
ID into `Operational_SystemData` for the Base operational alternative. **Unproven**: that WaterGEMS then
applies them (the one reading of "assigned" that Tom's file supports; the column is the only place a set is
named), and that a tank's `Level` is the depth above its base elevation, as EPANET's is (the control text says
"Level"; WaterGEMS also has a hydraulic grade attribute, `ElementType_HydraulicGrade`, so Level is probably
not the grade). The reader on `feat/sqlite-reader` reads a project whose alternative names a control set as
"controls unread" (its own note), so the harness reads the control tables itself.

The older clock controls kept `ControlType` 1, which they were first written with; Tom's logical control has
`ControlType` 0, which is the schema default. If a clock control fails to fire while a level control does,
try 0.

## What cannot be carried, and how a product would say so

A product reports each of these by element ID in an export report ("nothing dropped silently", the rule the
import already keeps). In the spike they are in `report.notCarried`.

| Not carried | Why | Net3 |
|---|---|---|
| Rule-based and pressure-condition controls | condition codes unseen (tank level is now known) | none in Net3 |
| `[RULES]` | logical-control codes unseen | none in Net3 |
| Water quality: trace, age, reactions, mixing, sources | not written, not studied | Net3 traces Lake |
| Energy price and price pattern | not written | price 0 |
| Pipe material, install year | no EPANET field | every pipe keeps the template's default material (Ductile Iron) |
| Emitter coefficient | storage unit not measured | none in Net3 |
| Tank minimum volume (a volume curve is carried), mixing model | the minimum-volume column is not kept by our `.inp` reader; mixing codes unseen | none in Net3 |
| Pump speed pattern, constant-power and multiple-point pumps | tables exist, no sample states them | none in Net3 |
| Pumps other than three-point (power, multiple point, custom) | tables exist | none in Net3 |
| Non-US units | storage units measured for US only | |
| Scenarios and their overrides | not written (see below) | Net3 has none |
| Geographic coordinates | the spatial reference is blank in every file seen | Net3 has map units only |

## What the tests show

`node dev/lpn-spike/wtg-export-harness.js` (needs Tom's fixture and the reader from `feat/sqlite-reader`;
prints NOT RUN without them):

- `wtg-export-parts.inp` (every valve kind, a pump at speed 0.9, a head-pattern reservoir, a volume-curve tank), and
  Tom's own TGH-1 `.inp` export, are written, read back (settings, GPV curve, volume curve, speed, pattern) and run
  in EPANET at accuracy 0.00001: 0.0004 ft and 0.002 gpm for the first; 0.0007 ft and 0.009 gpm for the second
  except hour 1, where EPANET settles the two networks into different valid pressure-valve states (5.4 ft).
- Net3 written: 92 junctions, 2 reservoirs, 3 tanks, 117 pipes, 2 pumps (each with 2 added pipes),
  5 patterns, 2 pump definitions, 6 controls. 220 live elements, none soft-deleted, 406 tables as in the
  template.
- `integrity_check` ok and no foreign-key violations, by sql.js and by Python's `sqlite3` (a different
  SQLite). Every column's stored type (integer, real, text, blob, null) is a type the template stores for
  that column (593 columns compared, the one exception being the project notes, text where the template had none).
- The reader reads every element back: all 97 nodes and 117 pipes by attribute, both pump curves, the five
  patterns, the pump-node construction, the six controls, EPS times.
- EPANET 2.3.5 solves Net3 and the read-back network over 24 hours: heads at 97 nodes agree to 1.7e-5 ft at hour
  0 and to 0.0135 ft at worst over the day; flows to 1.6 gpm at worst. The difference is the reader's: its
  `.inp` writes a clock-time control to the minute, so a pump switches up to 59 s early; the database holds the
  seconds exactly (checked). Every tank moves 6 to 9 ft over the day in both runs, so the agreement is not two
  flat lines.
- The tiny network (reservoir, pump, junction on a pattern, tank) agrees to 7e-5 ft and 8e-4 gpm.

What this does **not** show: that WaterGEMS opens the files. The reader and the writer were written from the
same samples, so agreement shows they are consistent with each other and with the samples, not that either is right.

## Open questions only Tom's WaterGEMS test can answer

`~/tom-files/2026-10-22/wtg-export/readme.md` is the script for it. In order of how much each would change
the plan:

1. Does it open at all (the tiny file, then Net3 without controls, then with)? The message, if not.
2. Does it offer to upgrade, recover or compact?
3. Does a `.sqlite` need its `.wtg`, and what may a minimal `.wtg` leave out?
4. Do pump nodes built this way compute (one pipe each side, 1 ft, 99 in)?
5. Does the "standard three point" pump definition keep our three points, or does WaterGEMS recompute the
   shutoff and maximum point from the design point (its default ratios are 1.25 and 2 x 0.5)? Net3's pumps
   do not follow those ratios.
6. Do clock-time controls on a pipe fire, and is `ActionPipeStatus` 0 really Open?
7. Does it compute and match EPANET (heads to a hundredth of a foot; pressures to 0.1 percent, since psi per
   foot differs between the two programs)?
8. Is a duplicate label across kinds (junction `10` and pump `10`) accepted? The Zenodo and consulting-firm
   files already showed duplicate labels within one kind.
9. Does the saved file WaterGEMS writes on File > Save As differ from ours in any table? That diff is the
   cheapest complete audit available.
10. Codes still needed: pump status and speed actions, a pressure condition and a time-from-start condition, an ELSE action, the child
    scenario (below). (The tank-level condition was learned from Tom's `wtg-control-1`.) Tom saving one control of each kind by hand, and a model with one child scenario,
    closes all of them.

## Feasibility verdict

**Technically feasible, unproven on the one test that counts.** A project saved by the user's own WaterGEMS can
be emptied and refilled with a whole network (a hundred nodes, a hundred links, pumps, tanks, patterns, an
extended period) so that it is a sound SQLite file, reads back through our own reader, and solves in EPANET
to a hundredth of a foot, without our looking inside any Bentley software. Everything that makes it hard is
inside WaterGEMS: whether it accepts what we wrote, and codes (tank-level controls, valves, pump kinds,
scenario overrides) that only a saved example can teach, one example per code, so the work is bounded and
mostly data entry rather than discovery.

**What a real product would take**, in steps:

1. Tom's test of the files, and the Save As diff. Fix whatever it shows. (Days, if it opens; if it
   does not, the error text decides whether the route survives.)
2. **Built on `feat/wtg-page-export` (2026-10-23, not merged until Tom says).** The writer is `js/lpn-wtg-export.js`
   (DOM-free; `dev/lpn-spike/wtg-export.js` is now only the command line). File > Export > Network >
   `.wtg.sqlite file…` (key `lpn_file_export_item_wtg`; no program named, Tom's call) asks a box BEFORE writing: the
   scenario, the instruction to choose a project the visitor saved, and what the files cannot carry by asset ID.
   The visitor then chooses the saved project's `.wtg` and `.wtg.sqlite` together; one `.zip` of the pair
   downloads. The document is read through `lpnExportInp` and `lpnInpParse` (the .inp is built in memory and
   never offered), so the open scenario's resolved values and the flattening are the .inp export's own. The schema
   version is read from the user's file and refused unless on `TESTED_SCHEMAS` (1.0.54.0). SQLite is sql.js 1.14.2
   (MIT, 46 KB script + 658 KB wasm), fetched from this site only when the command is used. Harnesses:
   `wtg-page-export-harness.js` (page route against the spike's known-good database, table by table) and
   `wtg-page-export-browser-harness.js`. **Refused by name:** a flow unit other than gpm, a head loss formula other
   than Hazen-Williams, a pump without a three-point head curve (asks 2 and 3 stay open). **The saved project must
   already hold one of every element kind the network uses** (the writer clones prototypes), so a brand-new empty
   project does not work; the box says so, and a missing kind is refused by name.
   **Left out and named in the box with their value:** a Demand Multiplier other than 1 and a pressure-driven demand
   model (the schema has `NormalDemandAdjustments` and `PressureDependentDemand` tables, but no sample file states a
   non-empty row, so no code is known), map Text, tags and a backdrop. Refusals of the saved project are language
   keys (`lpn_wtg_export_t_*`) that name no program and no column. `wtg-page-export-harness.js` compares every table to
   `reference/wtg-net3-golden.json`, digests of the spike writer's output at 8edd6369b (`wtg-dump.js` makes them).
3. Samples for each unseen code, saved by Tom once: time-from-start and pressure conditions; pump
   status, speed and target-head actions; each valve kind with a setting; a pump with a multipoint curve and one
   with constant power; a tank with a volume curve; a reservoir with a head pattern. The template already holds
   a live prototype of every element kind, so the element side is mostly written.
4. Scenarios. Tom's own file shows how WaterGEMS stores a child scenario: a scenario row with a parent, an
   alternative row with a parent of its own, and a *complete copy* of every element's rows under the child
   alternative (pipe `P-1` has one row for the Base Physical alternative and another, with a different diameter, for
   the child's). So exporting our scenario tree means cloning rows per alternative, which the writer's
   clone step already does for Base. Unseen: how WaterGEMS stores which values the child overrides, if it tracks that at all.
5. The export report (every item in "What cannot be carried", by element ID) and a harness per
   element kind, run against the reader.
6. Coordinates: choose and write the spatial reference so a geographic project lands on the right place in
   WaterGEMS. We have proj4; the template's `.wtg` carries a projection string in
   `ViewerEnterProjectionPreview`.
7. Keep it alive: WaterGEMS moved the core schema from 1.0.38 (2015) to 1.0.54 (2026). Each release can add a
   table or change a default, so the tested-version list needs a harness run against a saved blank of each
   release, which only a user with that release can supply.

## What does a `.wtg` export give a user beyond WaterGEMS's own EPANET `.inp` import?

**For a plain network, nothing, and the `.inp` route is better.** WaterGEMS imports an EPANET `.inp` with
Bentley's own code, which knows every code we do not (tank-level controls, rules, every valve and pump
kind, quality) and keeps working across releases. The Zenodo EPS model is such an import: it kept the
labels, the pump curve, a clock control and the tank, and added a pump node with `-A` / `-B` pipes the same way
we do. We cannot beat that on fidelity, and the `.inp` is the file EPANET++ already writes.

**What the export could give is what an `.inp` cannot hold:**

- **Scenarios.** An `.inp` is one scenario; Tom's `WTG-export-tgh-1-Base.inp` and `-TGH-1.inp` are two files for
  one project. A `.wtg` can carry the whole scenario tree with the child's overrides, so a design done in
  EPANET++'s scenarios arrives in WaterGEMS as scenarios, which is where a WaterGEMS user wants it.
- **Data EPANET has no field for:** customers and unit demand loads, fire-flow requirements, zones, notes,
  install years, material.
- **IDs and labels separate**, and real coordinates with a spatial reference, where an `.inp` carries a name and
  a drawing position.
- **One step**, with no import wizard that asks the user for units and settings.

Against that: it breaks when WaterGEMS changes its schema, each unseen code is a feature that must be learned
from a sample, and a failure to open gives the user nothing, where the `.inp` always opens. **A sound plan is
to keep the `.inp` as the baseline and treat the `.wtg` export as the carrier for scenarios and the extra
data**, built only if Tom's test shows WaterGEMS accepts what we write. If the test fails at the first file,
the answer to "are we aiming to interoperate through `.inp` files" is yes, by default.

## The drawing size ("the elements come in very tiny")

**Cause.** WaterGEMS draws a symbol 4 ft across and text 4 ft high (public Bentley documentation: the default
symbol height is 4.0 ft in real-world units and the default annotation is 0.1 in at the plot scale), times two
numbers in the `.wtg`'s `DrawingOptions`: `SymbolSizeMultiplier` and `TextHeightMultiplier`. The template
carried 1 and 1, which is right for Tom's TGH-1, a model 410 ft across. Net3 as we draw it is 27,645 ft across,
so a 4 ft symbol is 1/7,000 of the map. The openly licensed samples show the remedy people use: Zenodo 7162154
(4,600 ft) carries 10 and 10, TSNet's `tnet3` (26,000 ft) carries 20 and 20, and a consulting firm's model
(13,000 ft) carries scale 6000 with multipliers 1. The scaled-drawing flag, `Scale` 480 and `ScaleSI` 500 are the same in
every file and were not the cause.

**Fix.** `patchWtgXml` sets both multipliers to extent / 500 ft (at least 1), which keeps the template's
symbol-to-map proportion: Net3 gets 55, the tiny network 8. The harness checks it. Unverified: that the
symbols then look right in WaterGEMS (Tom's eye on `wtg-export-2/1-net3`).

## Inventory: EPANET against what the writer exports

"Writes" means written and read back by our reader, and (where it affects hydraulics) agreed with EPANET over 24 h
by the harness. "Evidence" is what shows how WaterGEMS stores it.

| EPANET item | Writes today | Evidence for how WaterGEMS stores it | Can we write it without a new file from Tom |
|---|---|---|---|
| `[JUNCTIONS]`, demand, pattern | yes | Tom's fixture, Zenodo, TSNet | done |
| Several demands on one junction | no (first only) | the table is a collection (`IdahoDemandNode_Demand_DemandCollection`), one row per demand | yes, same table, more rows; not done because the parser keeps one |
| `[EMITTERS]` | no | column `Physical_EmitterCoefficient` exists (all zero in every file); no `.inp` pairs a nonzero value with its stored number, so the storage unit is unknown | **no: ask 2** |
| `[RESERVOIRS]` head, pattern | head yes; pattern yes | column `Physical_HglPattern` (reader reads it); no sample states a nonzero one | written; semantics unproven in WaterGEMS |
| `[TANKS]` cylindrical | yes | all samples | done |
| `[TANKS]` volume curve | yes | Tom's TGH-1 child scenario against `WTG-export-tgh-1-TGH-1.inp` | done |
| `[TANKS]` minimum volume, mixing | no | mixing is a coded integer (`TankMixingModel`, 1 = mixed, no other value seen) | mixed only; others need a sample |
| `[PIPES]` open, closed, check valve | yes | Tom's fixture, Zenodo | done |
| `[PUMPS]` three-point HEAD curve | yes | Tom's fixture, Zenodo | done |
| `[PUMPS]` SPEED | yes | `InitialSettings_RelativeSpeedFactor` | done |
| `[PUMPS]` multiple-point curve | no | type 5 is read by the reader; no sample with the rows in our hands | **no: ask 3** |
| `[PUMPS]` POWER, speed PATTERN | no | table `ConstantPowerType_PumpPower` exists, zero in every file | no |
| `[VALVES]` PRV PSV PBV FCV TCV GPV | yes | Tom's TGH-1 and its `.inp` | done |
| `[STATUS]` closed pipe, pump, valve | yes (through the upstream pipe) | `PipeStatus` | done |
| `[PATTERNS]` | yes | Zenodo, TSNet | done |
| `[CURVES]` pump, headloss, volume | yes | as above | done |
| `[CURVES]` efficiency curve | constant only | `PumpEfficiencyType` 0 constant, 2 curve (reader reads 2) | a curve: not yet written; no new file needed, but nothing in Net3 uses it |
| `[ENERGY]` global efficiency | yes | constant efficiency | done |
| `[ENERGY]` price, price pattern, demand charge | no | `EnergyCost_EnergyPricingID` points at an energy-pricing support element; no sample holds one | no |
| `[CONTROLS]` AT TIME, AT CLOCKTIME | yes, as clock-time controls in the same control set | the one sample control (Zenodo) | done |
| `[CONTROLS]` IF NODE (tank) BELOW / ABOVE | yes, as tank-level controls in a control set | Tom's `wtg-control-1` (see "Tank-level controls: the codes") | done; whether WaterGEMS fires them is Tom's test |
| `[RULES]` | no | composite conditions and an ELSE action tables exist; no codes (the ELSE column and a priority column are in `IdahoControl_ControlType_LogicalType`) | needs a sample with an ELSE |
| `[QUALITY]`, `[REACTIONS]`, `[SOURCES]` | no | trace and constituent tables exist; nothing stored in any file | no |
| `[TIMES]` duration, hydraulic step, start | yes | | done |
| `[TIMES]` pattern step, report step | pattern step through each pattern's points; report step not written | `EpsType_ReportingTimeStep` | yes, not done: no effect on results |
| `[OPTIONS]` friction method | Hazen-Williams only | `FrictionMethod` | Darcy-Weisbach and Chezy-Manning: codes unseen |
| `[OPTIONS]` specific gravity, viscosity | yes | TGH-1 (0.998 changes a psi setting by 0.2 percent) | done |
| `[OPTIONS]` trials, accuracy, unbalanced | the template's defaults, which equal EPANET's | | done |
| `[COORDINATES]`, `[VERTICES]` | yes, in feet at one scale | | done |
| `[LABELS]`, `[BACKDROP]`, `[TAGS]` | no | | no equivalent worth the effort |
| Units other than US/GPM | refused | storage units measured for US only | yes in principle: SI conversions are the schema's own storage units |

**Control sets.** Resolved in form by Tom's `wtg-control-1`: controls belong to a control set, and the set is
assigned to an alternative in `Operational_SystemData`. The writer now does both (see "Tank-level controls: the
codes"). Round two's clock controls were written without a set; Tom saw pump 10 behave (see his 2026-10-23 words),
which leaves open whether WaterGEMS applies controls that no set names. Round three assigns the set, so either
way it fires if assignment is the rule.

## The smallest asks of Tom

Two remain (Ask 1, the tank-level control, was done by Tom on 2026-10-23 and is closed), one thing per file, each starting from the tiny project (`wtg-export/1-tiny/Tiny.wtg`, which Tom has
already opened) so that nothing has to be drawn. Where a menu name below is a guess it says so; Tom reports
what he sees instead.

**Ask 2: an emitter (closes emitters, and the storage unit).**
1. Open `Tiny.wtg`. File > Save As: `wtg-emitter-1`.
2. Double-click junction `J1`. Find the Emitter Coefficient field (probably under Physical). Type 5. Note the unit it shows.
3. File > Save. Then export to EPANET the way you did for `WTG-export-tgh-1-Base.inp`, as `wtg-emitter-1.inp`.
4. Send the `.wtg`, `.wtg.sqlite` and `.inp`.

**Ask 3: a five-point pump curve (closes multiple-point pumps).**
1. Open `Tiny.wtg`. File > Save As: `wtg-pump-curve-1`.
2. Open the pump definition `Pump Curve 1` (Components > Pump Definitions). Change its type to "Multiple Point" (or "Multi-point curve").
3. Enter five points, flow gpm and head ft: 0 150; 150 140; 300 120; 450 95; 600 60.
4. File > Save. Export to EPANET as `wtg-pump-curve-1.inp`.
5. Send the `.wtg`, `.wtg.sqlite` and `.inp`.

## Reproduce

```
node dev/lpn-spike/wtg-export-harness.js
node dev/lpn-spike/wtg-export.js --template ~/webdev/fixtures/wtg-tgh-1/WTG-tgh-1.wtg.sqlite \
     --wtg ~/webdev/fixtures/wtg-tgh-1/WTG-tgh-1.wtg --out <dir>
```

The second writes `1-tiny`, `2-net3-hour-zero` and `3-net3` under `<dir>`, each with its `.wtg`,
`.wtg.sqlite` and EPANET's results as CSV. Until `feat/sqlite-reader` merges, `wtg-sqljs.js` takes sql.js and
the reader out of that branch with `git show` into a cache folder in the system temp directory; the branch is
never edited.
