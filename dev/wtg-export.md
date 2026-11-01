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
**Licence rule, Tom 2026-10-20:** *"Reverse engineering is prohibited ... Let's stay right."* Nobody
decompiles or probes Bentley software; evidence is openly licensed sample files and public
documentation. The writer's template is the CC BY 4.0 sample (see "The route, and why"); Tom's project
is evidence for codes and a regression fixture, and none of it is in the repository.

**Status: tested against our own reader and EPANET, not against WaterGEMS.** Whether WaterGEMS opens
the files is the one open question that matters, and only Tom's copy can answer it.

## The route, and why

Three routes were weighed.

1. **Write the schema fresh** (`CREATE TABLE` for 406 tables and 189 indices, then the default rows).
   Rejected: the tables, their order and every default row (the 19 default alternatives, the ten
   calculation-option rows, the scenario tree, the 133 element-type counters, the schema blob that
   states each field's storage unit) would all be our reconstruction, and one wrong default is a file
   WaterGEMS refuses with no message that names it.
2. **Take an openly licensed sample as the built-in template. CHOSEN (2026-11-01).** Zenodo 7162154
   (CC BY 4.0, schema 1.0.44.0, WaterGEMS 10.1.1), emptied to one prototype of each kind by
   `dev/scripts/build_wtg_template.js` and shipped as two gzip files in `js/data/wtg-template/` (160 KB
   and 7 KB), fetched only when an export runs. Export is one click and the visitor chooses no file.
   Tom's verdict, on trying the page route: *"Why are we asking user to choose an existing file?
   That's bad UX. This seems useless."* The spike had succeeded with his own saved project as the
   template, by hand; the page then made every visitor supply one.
3. **Take a project saved by the user's own WaterGEMS as the template. REJECTED as the default, and
   dropped from the page** (its box, picker, and six language keys are gone). It gives the version
   by construction, but it asks for a file nobody has to hand, and the 1.0.44 template covers every
   kind. The writer still accepts any saved project's bytes (`o.sqlite`, `o.wtg`; schema versions
   1.0.44.0 and 1.0.54.0 are tested), and `wtg-export-harness.js` still runs against Tom's fixture when
   `WTG_TEMPLATE_DIR` names it, which is how the 1.0.54 path stays proved.

**The one open risk of route 2 is the schema's age:** the template is 1.0.44.0 (2017 layout, written by
WaterGEMS 10.1.1), and Tom's WaterGEMS 26.0.0.532 writes 1.0.54.0. An older file opened by a newer
version is an upgrade path, an extra thing that could go wrong. **Tom's test answers it:** does his
WaterGEMS open the file, does it offer to upgrade or compact, and does the run match? If it refuses,
the fallback is route 3 for the schema alone (a 1.0.54 blank from a user who has one). The 1.0.54
columns that 1.0.44 lacks are additions (22 tables, such as SCADA, transient and performance-study
tables, and about 70 columns). The one the writer would set is the "continue if unbalanced" option and
its extra iterations (`EpaNetEngine_ContinueIfUnbalanced`, `EpaNetEngine_ExtraIterations`); it has no
column in 1.0.44, so a 1.0.44 file cannot state it (the writer skips any column the template lacks and
names it in `report.skippedColumns`). The harness compares EPANET runs with
`Unbalanced Continue 10` added to the read-back network for that reason.

**What was built into the template.** From the EPS model of the sample: one junction, reservoir,
circular tank (the sample's was variable-area with an inlet pipe; made plain), pipe, standard pump and
its pump definition. A pattern from the sample's second model (same schema). **Added because the
sample lacks them: the six valve kinds and the valve headloss curve**, each as one row per table
holding the schema's own `DEFAULT` clauses (the `CREATE TABLE` statements carry them), with the key
columns, the alternative the pump's rows use for the same topic (Physical, InitialSettings,
Hammer), and the pump's node-level rows. Which tables a valve has rows in is the table list of the
valve element types, as a saved file shows it. This is the template's one invented part: the defaults
are the schema's, but no WaterGEMS wrote a valve into it, so a valve is the thing Tom's test should
look at first. Also removed: the authors' edit log (a user name and each edit), selection sets, a
graph of one tank, the project name and notes. The `.wtg` display units were set to US customary
(the sample's were SI) because the export writes US and gpm only; the unit names are the ones a saved
project spells. Attribution (CC BY 4.0) is in `js/data/wtg-template/README.md`, in
`dev/vendor-manifest.json`, and in the export's receipt (`lpn_wtg_export_credit`).

**Whether shipping a sample-derived template is acceptable to Bentley belongs in Tom's letter to
Bentley, which comes before any public release.** The CC BY 4.0 licence is the authors'; the file is
a Bentley-format database, and the question of what Bentley's terms say about a third party's
published data file was never answered (`dev/bentley-interop.md`).

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

## What this export does not write, fact-checked

**Tom, 2026-11-01:** *"On export, why do we say that the file cannot carry water quality? I can't
believe that is true."* He was right. The box said the file "cannot carry" each item, which claimed
more than we know: WaterGEMS holds nearly all of them, and the export simply does not write them yet.
**Every `lpn_wtg_export_lost_*` string now states what THIS EXPORT does not write**, under one lead,
"This export does not yet write the following:", and none says the file or the program cannot hold a
thing (the page harness checks the word). The spike's `report.notCarried` keeps its internal
wording; the page never shows it.

Each item against Bentley's public documentation (checked 2026-11-01; community-wiki pages are
version-specific):

| Item | Does WaterGEMS hold it? | Source | Table that would hold it (sample or schema) |
|---|---|---|---|
| Water quality: age, constituent, trace | Yes | https://communities.bentley.com/products/hydraulics___hydrology/w/hydraulics_and_hydrology__wiki/57532/workflow-for-age-constituent-and-trace-analyses-using-watergems-and-watercad | `Age_`, `Constituent_`, `Trace_SystemData`; nothing stored in any file seen |
| Tank mixing models (completely mixed, 2-compartment, LIFO, FIFO) | Yes | same page | `ConventionalTank_Constituent_Data.TankMixingModel`, `..._TwoCompartmentType` |
| Rule-based (logical) controls, IF/THEN/ELSE, priority | Yes | https://communities.bentley.com/products/hydraulics___hydrology/w/hydraulics_and_hydrology__wiki/24267/using-controls-conditions-actions-and-control-sets-in-watergems-and-watercad and .../8983/simple-controls-vs-logical-controls | `IdahoControl_ControlType_LogicalType` (priority, ELSE); no composite-condition sample |
| Energy price, price pattern, demand charge | Yes (four pricing types; peak demand charges; block rates in the Energy Management tool) | https://communities.bentley.com/products/hydraulics___hydrology/w/hydraulics_and_hydrology__wiki/7242.energy-cost-and-energy-management | `EnergyPricing` (a support element, with `EnergyPriceCurve`, `PeakDemandCharge`), pointed at by `BasePump_EnergyCost_Data.EnergyCost_EnergyPricingID`: the table shape is in every file; no sample states a row |
| Pump speed pattern | Yes (relative speed factor pattern; it overrides controls) | https://communities.bentley.com/products/hydraulics___hydrology/w/hydraulics_and_hydrology__wiki/23673/can-you-run-a-vsp-with-a-control-node-and-logical-controls-at-the-same-time | `StandardPump_Physical_VSPType_PatternBasedType`; the pump rows already carry an empty one |
| Emitter coefficient | Yes (k per node, exponent n in the options) | https://DOCS.BENTLEY.COM/LiveContent/web/Bentley WaterGEMS SS6-v1/en/GUID-FB7909636F314666BC10208A44ACC843.html | `IdahoFireFlowNode_Physical_Data.Physical_EmitterCoefficient`; storage unit unmeasured (Ask 2) |
| Pressure-driven demand | Yes (pressure dependent demand, modified GGA) | https://communities.bentley.com/products/hydraulics___hydrology/w/hydraulics_and_hydrology__wiki/2671/using-pressure-dependent-demands | `EpaNetEngine_UsePressureDependentDemand`, `PressureDependentDemand_SystemData`; no non-empty row seen |
| Demand multiplier | Yes (demand adjustments in the calculation options, applied before the pattern) | https://communities.bentley.com/products/hydraulics___hydrology/w/hydraulics_and_hydrology__wiki/35021/multiple-demand-adjustments | `EpaNetEngine_NormalDemandAdjustmentsCollection`: **the Zenodo EPS model holds one row (value 1.0, an order index, a scope id), so its shape is seen and a multiplier is a candidate for a later round**; the scope code for "entire network" is not yet decoded |
| Tank minimum volume | Yes (inactive volume) | the schema; not found on a public page | `ConventionalTank_Physical_Data.Physical_InactiveVolume` (a volume curve already writes it; a plain minimum volume does not) |
| Pipe material | Yes | https://DOCS.BENTLEY.COM/LiveContent/web/Bentley WaterGEMS SS6-v1/en/GUID-7E022352A26641E7860CC5BFCDBA312B.html | the pipe's material column; the template's default (ductile iron) stays |
| Installation year | Yes, as information that does not affect the calculation (same page) | same page | `Physical_InstallationYear` on nodes and pipes |
| True map positions | Yes (a spatial reference is stored per project) | the schema; not found on a public page | `IdahoDataSet.HMIDataSetGeometrySpatialReference` is blank in every file seen; drawing is written in feet at one scale. Needs a file with the field set |
| Text on the map | Yes (annotation) | https://communities.bentley.com/products/hydraulics___hydrology/w/hydraulics_and_hydrology__wiki/18067.how-do-i-annotate-model-elements | lives in the `.wtg` or a drawing layer; no sample |
| Background picture | Yes (background layers) | https://communities.bentley.com/products/hydraulics___hydrology/w/hydraulics_and_hydrology__wiki/8892/displaying-shapefile-labels-text-as-a-background | a path in the `.wtg`; the picture itself would travel as a third file |
| Tags | **Not found in Bentley's public pages**; EPANET's `[TAGS]` may have no equivalent | | none found |
| Demand category names | **Not found in Bentley's public pages**; WaterGEMS stores several demands per node (a collection) but no category name was seen | https://communities.bentley.com/products/hydraulics___hydrology/w/hydraulics_and_hydrology__wiki/51561/working-with-demands-in-watergems-and-watercad | `IdahoDemandNode_Demand_DemandCollection` has no name column |
| Non-US units | n/a | | storage units measured for US only |
| Scenarios and overrides | Yes | Tom's own file | not written (see below) |

Two rows say "not found": tags and demand category names. The strings make no claim about WaterGEMS
for them either; they say only that this export does not write them.

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
- `wtg-export-demands.inp` (the tiny network with three demands on J1, two patterns and the default, an efficiency curve on the pump, a 2 h report step) is written, read back (demands in order, efficiency curve, report step), checked table by table (three demand rows and a count of 3; `PumpEfficiencyType` 2 with three curve rows) and agrees with EPANET over 24 h to 0.0001 ft and 0.001 gpm.

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
   scenario, and "This export does not yet write the following:" with each item by asset ID. The visitor
   clicks Export (no file is chosen: the template is built in, 2026-11-01); one `.zip` of the pair
   downloads, and the receipt credits the sample. The document is read through `lpnExportInp` and `lpnInpParse` (the .inp is built in memory and
   never offered), so the open scenario's resolved values and the flattening are the .inp export's own. The schema
   version is read from the template and refused unless on `TESTED_SCHEMAS` (1.0.44.0 for the built-in
   template, 1.0.54.0 for a saved project passed in). SQLite is sql.js 1.14.2
   (MIT, 46 KB script + 658 KB wasm), fetched from this site only when the command is used. Harnesses:
   `wtg-page-export-harness.js` (page route against the spike's known-good database, table by table) and
   `wtg-page-export-browser-harness.js`. **Refused by name:** a flow unit other than gpm, a head loss formula other
   than Hazen-Williams, a pump without a three-point head curve (asks 2 and 3 stay open). The template holds a
   prototype of every element kind the writer clones.
   **Not written, and named in the box with their value:** a Demand Multiplier other than 1 and a pressure-driven demand
   model (the schema has `NormalDemandAdjustments` and `PressureDependentDemand` tables, but no sample file states a
   non-empty row, so no code is known), map Text, tags and a backdrop. Refusals are language keys
   (`lpn_wtg_export_t_*`) that name no program and no column. `wtg-page-export-harness.js` compares every table to
   `reference/wtg-net3-golden.json`, digests of this writer's output for Net3 into the built-in template (`wtg-dump.js`
   makes them; regenerate with `WTG_WRITE_GOLDEN=1`).
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
| Several demands on one junction | yes: one row per demand, in order, the default pattern made explicit on a row with none; `DemandCollectionCount` states the number | the table is a collection (`IdahoDemandNode_Demand_DemandCollection`); the parser's row 0 plus `extraDemands` feed it (`wtg-export-demands.inp`, 24 h EPANET agreement to 0.0001 ft). A demand category name is not carried and is named | done; whether WaterGEMS shows all rows is Tom's test |
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
| `[CURVES]` efficiency curve | yes: two or more points are `PumpEfficiencyType` 2 with a `..._MultipleEfficiencyPointsType` row (count) and one `IdahoPumpDefinition_DischargeEfficiencyCurve` row per point (flow gpm to ft3/s, efficiency as stated); one point is written as a constant. Pumps share a definition only when head and efficiency curves both match | `PumpEfficiencyType` 0 constant, 2 curve (reader reads 2); table layout from the template's schema, no sample states a non-empty one | done; read back by our reader (`wtg-export-demands.inp`). Efficiency never changes a hydraulic result, so the EPANET agreement is unaffected; whether WaterGEMS accepts the rows is Tom's test |
| `[ENERGY]` global efficiency | yes | constant efficiency | done |
| `[ENERGY]` price, price pattern, demand charge | no | `EnergyCost_EnergyPricingID` points at an energy-pricing support element; no sample holds one | no |
| `[CONTROLS]` AT TIME, AT CLOCKTIME | yes, as clock-time controls in the same control set | the one sample control (Zenodo) | done |
| `[CONTROLS]` IF NODE (tank) BELOW / ABOVE | yes, as tank-level controls in a control set | Tom's `wtg-control-1` (see "Tank-level controls: the codes") | done; whether WaterGEMS fires them is Tom's test |
| `[RULES]` | no | composite conditions and an ELSE action tables exist; no codes (the ELSE column and a priority column are in `IdahoControl_ControlType_LogicalType`) | needs a sample with an ELSE |
| `[QUALITY]`, `[REACTIONS]`, `[SOURCES]` | no | trace and constituent tables exist; nothing stored in any file | no |
| `[TIMES]` duration, hydraulic step, start | yes | | done |
| `[TIMES]` pattern step, report step | pattern step through each pattern's points; report step written to `EpsType_ReportingTimeStep` in seconds when it differs from the hydraulic step (otherwise the template's 0) | `EpsType_ReportingTimeStep` (the reader reads it, 0 meaning the hydraulic step) | done; `OverrideReportingTimeStep` is left 0, its meaning unseen. No effect on results |
| `[OPTIONS]` friction method | Hazen-Williams only | `FrictionMethod` | Darcy-Weisbach and Chezy-Manning: codes unseen |
| `[OPTIONS]` specific gravity, viscosity | yes | TGH-1 (0.998 changes a psi setting by 0.2 percent) | done |
| `[OPTIONS]` trials, accuracy, unbalanced | the template's defaults, which equal EPANET's | | done |
| `[COORDINATES]`, `[VERTICES]` | yes, in feet at one scale | | done |
| `[LABELS]`, `[BACKDROP]`, `[TAGS]` | no | | no equivalent worth the effort |
| Units other than US/GPM | refused | storage units measured for US only | yes in principle: SI conversions are the schema's own storage units |

**Candidates for a later round**, where the sample files already show the table that would hold the item
(fact-check table above): the demand multiplier (`EpaNetEngine_NormalDemandAdjustmentsCollection`, one row in
the Zenodo EPS model, scope code still to decode), energy pricing (`EnergyPricing` and its curves, pointed at
by the pump), pump speed pattern (`StandardPump_Physical_VSPType_PatternBasedType`), tank mixing
(`TankMixingModel`; 1 = mixed is the only value seen), emitters (the table exists; the storage unit is
Ask 2). Each needs a saved example with a non-empty row before it is written.

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
