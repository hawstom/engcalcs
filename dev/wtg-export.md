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
| Reservoir (2: River, Lake) | `IdahoReservoir` (56) | Head to `Physical_NodeElevation` (WaterGEMS's reservoir elevation is its grade). |
| Tank (3) | `ConventionalTank` (52), circular, operating range by elevation | Base elevation = Net3 elevation; minimum / maximum / initial elevation = elevation + level; diameter ft; area from the diameter. |
| Pipe (117) | `IdahoPipe` (69) | Ends in `BaseLink_HMIDataSetTopology_Data`; length as a *user-defined* length (flag 1, so the stated length is used, not the drawn one); diameter in to ft; Hazen-Williams C; minor loss K in both minor-loss fields; status Open/Closed to `PipeStatus` 0/1; a check valve to `Physical_HasCheckValve`. |
| Pump (2) | **A pump node** `StandardPump` (68) **between two pipes** | See below. |
| Pump curve (2, three points) | `IdahoPumpDefinition` (support type 51), type 2 "standard three point" | Point 0 is the shutoff head; point 1 the design flow and head; point 2 the maximum operating flow and head. Constant pump efficiency from `[ENERGY]` (75), motor efficiency 100. |
| Patterns (5) | `IdahoPattern` (support type 50), stepwise | Starting multiplier = first value; point k states the value from k hours on; the last point closes the cycle with the first value again (the convention found by matching TSNet's `tnet3` pattern against its `.inp`). |
| Controls (6) | `IdahoControl` / `IdahoControlCondition` / `IdahoControlAction` (support types 54 / 56 / 55) | See "Controls". |
| `[TIMES]` | `EpaNetEngine_TimeAnalysisType_EpsType`: duration 86400 s, hydraulic step 3600 s | Start 00:00. The template already read EPS 24 h / 1 h; the writer states it. |
| `[OPTIONS]` | `EpaNetEngine`: Hazen-Williams (`FrictionMethod` 1), specific gravity 1.0, kinematic viscosity 1.1e-5 ft2/s (EPANET's relative viscosity 1.0), extra iterations 10 | Trials 40, accuracy 0.001, check frequency 2, check cut-off 10, damping limit 0, emitter exponent 0.5 were already the template's defaults, equal to Net3's. |
| `[COORDINATES]` | `HMIGeometry`, a WKB point in feet | EPANET map units have no unit. One scale for the whole map, 750 ft per unit, is the median of (stated pipe length / drawn distance). Lengths do not depend on it. |
| Labels | `HMIModelingElement.Label` = the EPANET ID; `SmartLabel` = the label with each run of digits padded to seven | The ID column (a number, 31 upward) is separate from the label, as in WaterGEMS. |

**A pump is a node.** EPANET's link `10` (Lake to node 10) becomes a pump node labelled `10` plus two pipes,
`10-A` (Lake to the pump node) and `10-B` (pump node to node 10). They are 1 ft long and 99 in across, as the
Zenodo EPS model's pump pipes are (WaterGEMS's own `.inp` import made them 1 ft and 8.25 ft), so they add no
head loss worth the name (the harness holds EPANET to 0.014 ft over 24 h across the whole network, including
this). The pump node sits at the midpoint of the two end nodes and takes the suction node's elevation. The
pump's on/off state is carried by the status of `10-A`.

**Controls.** A control is three support elements, a condition, an action and a control joining them. The
only condition and action codes seen in any file we may use are: a clock-time condition
(`SimpleConditionType` 2, `CompareOperator` 0, the time stored as seconds since 1970 with the time of day in
it) and a pipe-status action (`PipeAttribute` 0, `ActionPipeStatus` 1 closed; 0 for open is by symmetry with
`PipeStatus`, unproven). Net3's pump 10 controls are clock-driven ("OPEN AT TIME 1", "CLOSED AT TIME 15") and
map directly. Its four tank-level controls ("Link 335 OPEN IF Node 1 BELOW 17.1") need a tank-level
condition whose codes appear in no file we have. **They are carried as clock-time controls at the seconds
at which EPANET actually switched them** (4:13:33 and 21:19:39), taken from a reference run, on the
upstream pipe of the pump (`335-A`) and on bypass pipe 330. That reproduces EPANET's 24 hours to 0.014 ft,
but it is a frozen schedule, not the control: it would not respond to a changed demand. It is the one
place the export is not faithful, and the report must say so by name. A pump status or speed action is also
unseen (`PumpStatus` 1 is "taken as off" in the reader, unproven), so a pump is stopped by closing its
pipe, which is hydraulically the same.

## What cannot be carried, and how a product would say so

A product reports each of these by element ID in an export report ("nothing dropped silently", the rule the
import already keeps). In the spike they are in `report.notCarried`.

| Not carried | Why | Net3 |
|---|---|---|
| Tank-level (and any non-clock) controls, as controls | condition codes unseen | 4 of 6, carried as a frozen schedule |
| `[RULES]` | logical-control codes unseen | none in Net3 |
| Water quality: trace, age, reactions, mixing, sources | not written, not studied | Net3 traces Lake |
| Energy price and price pattern | not written | price 0 |
| Pipe material, install year | no EPANET field | every pipe keeps the template's default material (Ductile Iron) |
| Emitter coefficient | storage unit not measured | none in Net3 |
| Tank volume curve, minimum volume, mixing model | codes written but untested | none in Net3 |
| Reservoir head pattern, pump speed pattern | tables exist, unproven | none in Net3 |
| Valves of any kind | prototypes exist in the template (PRV 64, PSV 65, PBV 66, FCV 60, TCV 61, GPV 62) but not written | none in Net3 |
| Pumps other than three-point (power, multiple point, custom) | tables exist | none in Net3 |
| Non-US units | storage units measured for US only | |
| Scenarios and their overrides | not written (see below) | Net3 has none |
| Geographic coordinates | the spatial reference is blank in every file seen | Net3 has map units only |

## What the tests show

`node dev/lpn-spike/wtg-export-harness.js` (needs Tom's fixture and the reader from `feat/sqlite-reader`;
prints NOT RUN without them):

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
10. Codes still needed: tank-level condition, pump status and speed actions, valve kinds, the child
    scenario (below). Tom saving one control of each kind by hand, and a model with one child scenario,
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

1. Tom's test of the three files, and the Save As diff. Fix whatever it shows. (Days, if it opens; if it
   does not, the error text decides whether the route survives.)
2. Move the writer into a DOM-free `js/` module that reads the page's document, not an `.inp` (units
   from the document, SI and US, every storage unit code in the schema blob checked rather than assumed), and
   put a File > Export entry behind it that takes the user's blank project as the template, reads
   `HMICoreSchemaVersion`, and refuses a version not on a tested list. The sql.js engine is already vendored on
   `feat/sqlite-reader`.
3. Samples for each unseen code, saved by Tom once: tank-level, time-from-start and pressure conditions; pump
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
