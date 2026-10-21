# The SQLite reader: the foundation for Bentley `.wtg.sqlite`

ROADMAP Task 749, branch `feat/sqlite-reader`, 2026-10-17. `js/lpn-sqlite.js` reads any SQLite
database and knows nothing about Bentley; `js/lpn-wtg.js` (below) reads a WaterGEMS model out of it. The research behind it is `dev/bentley-interop.md`; the public samples and
what their schema shows are `chore/752-reshape:dev/agents/market-researcher/wtg-samples.md`.

**Checked once against real files, 2026-10-17** (a one-off script, not committed; the samples stay
out of the repo while their licence question is open): Zenodo 7162154's "withdrwal capacity curve"
model (7.1 MB) opened in 71 ms and listed 383 tables (384 less SQLite's own `sqlite_sequence`);
`HMIScenario` read as Base (58), "Scenario - 1" with parent 58, and "Scenario - 2", plus the
soft-deleted row 1; `IdahoPipe_Physical_Data` read 151 rows. TSNet's `tnet3.wtg.sqlite` listed
379. Neither file changed.

## What was vendored

- **sql.js 1.14.2** (SQLite compiled to WebAssembly), from npm, unmodified:
  `js/vendor/sql-wasm.js` 46,535 bytes (about 17 KB compressed) and `js/vendor/sql-wasm.wasm`
  658,410 bytes (about 322 KB compressed). Licence text `js/vendor/sql.js.LICENSE`. Digests in
  `dev/vendor-manifest.json`, version pinned in `package.json`.
  1.15.0 existed but was three days old; 1.14.2 had been out two months.
- **Licence:** sql.js is MIT and SQLite is public domain; both go into a GPL-3 project without
  conflict, provided the MIT notice ships with them, which it does.

## How it loads

- `js/lpn-sqlite.js` (a few KB) is on the Looped Network page. It fetches nothing until
  `EngCalcs.lpnSqliteOpen()` is called. Then it fetches the script and the wasm **from this site**,
  never a CDN, so there is no new third-party request and `privacy.php` is unchanged.
- The wasm is fetched as bytes and handed to the engine, so the host's MIME type for `.wasm` does
  not matter (the same reason epanet-js's `.mjs` was renamed).
- **Not precached.** `sql-wasm.js` is in `ecSwAssetExclusions()`; the `.wasm` is outside the
  service worker's asset globs. After first use the worker keeps a copy (the script cache-first,
  the wasm network-first), so a second open works offline. Both URLs carry `?v=1.14.2`.
- A visitor pays the ~340 KB compressed download only when a database is opened, once.

## What the module offers

`EngCalcs.lpnSqliteOpen(arrayBuffer)` resolves to:

- `tables`: `[{name, kind: 'table'|'view', columns: [{name, type, notNull, pk}], rowCount}]`,
  sorted by name, SQLite's own `sqlite_` tables left out;
- `readRows(name, {offset, limit})`: `{columns, rows}`, 1,000 rows by default;
- `select(sql, params)`: any read-only query, for exploring an unknown schema;
- `close()`.

It rejects with `.code` `not-sqlite` (header is not "SQLite format 3"), `engine` (library failed
to load) or `unreadable` (damaged). `EngCalcs.lpnSqliteIsSqlite(bytes)` tests the header alone.

**It never writes to the file.** It copies the bytes before the engine sees them and opens the copy
with `PRAGMA query_only`, so even a stray write to the copy is refused. Values come back exactly:
a REAL is the stored double, an integer past 2^53 stays a BigInt, a blob is a `Uint8Array`.

Tests: `dev/lpn-spike/sqlite-reader-harness.js` (Node, 44 checks). Python's `sqlite3` builds the
model-shaped database at test time, so writer and reader are different SQLite builds.
`dev/lpn-spike/sqlite-reader-browser-harness.js` (Chromium) holds that a page load fetches
nothing of sql.js and that opening a database fetches both files from the page's own site, once.

The way in is File > Import > **WaterCAD or WaterGEMS model…** (below). The console route still
works: read a file into an ArrayBuffer and call `EngCalcs.lpnSqliteOpen(buf)`.

## The import: `js/lpn-wtg.js` and File > Import

`EngCalcs.lpnWtgRead(db, {display, flowUnits})` takes an open database and returns **`.inp` text**
plus records, the way `js/lpn-net.js` turns a `.net` into `.inp` text: the page then lands it by the
route every EPANET file takes (`landInpText()`'s steps: units strip first, `docFromInp()`, arrival
saved, one report). What an `.inp` cannot say is returned beside it and laid onto the document by
`wtgLayOnto()` in `js/looped-network.js`: inactive elements (`_active: false`), the scenarios beyond
Base with the stored alternatives they name (`treeOf()`, below), and the alternatives no scenario uses. Every difference is a note
`{code, ids}` in the import report (`LPN_WTG_NOTE`, keys `lpn_wtg_note_*`); nothing is dropped
silently. `EngCalcs.lpnWtgDisplayUnits(xmlText)` reads the `.wtg` beside it for the display units.

**It lands as a new project, and the report says so** (Task 814: a scenario-aware import should
one day ask where it goes). The chooser takes several files: the `.wtg.sqlite`, and the `.wtg` too
if chosen, which carries only the display units.

**The numbers.** The database stores every quantity in one fixed unit per field, whatever is
displayed, and states which in its own schema (below). Each number is converted once, by the
suite's exact factor, to the project's unit, and written as the **shortest decimal within 5 parts
in 10^8**: WaterGEMS stores about 12 significant digits and its own constants differ from ours by up
to 2 parts in 10^8 (its litre is 0.035314667 ft3: 43.264 L/s is stored as 1.527853753088 ft3/s, and
our factor gives back 43.26400034). That rounding gives back what the modeller typed. Coordinates are
written to 10 significant digits instead (they are not typed). The one constant of Bentley's own we
use is its psi per metre of water, 1.42232905111207, measured (Tnet0's PRV: 100000 m in its `.inp`,
142232.90511120702 psi stored); ours differs by 4 parts in a million.

**Units of the project.** The flow unit follows the `.wtg`'s flow display unit (L/s to LPS, gpm to
GPM, m3/s to LPS with a note); every other unit is EPANET's set for that flow unit (m, mm, m of
water; or ft, in, psi). A display unit that differs (Zenodo's pressure in kPa; TSNet's lengths in ft
beside L/s) is named in the report. Without the `.wtg`, LPS, with a note.

## The schema, as the samples show it

Samples: Zenodo 7162154 (three WaterGEMS 10.1.1 models, schema 1.0.44, CC BY 4.0) and TSNet's
`Tnet0`/`tnet3` (WaterGEMS 8.11, schema 1.0.38, MIT). **None is in the repository** (Tom's open
question on whether Bentley's licence reaches a third party's published data file); the harnesses
read them from the folder `WTG_SAMPLES` names and print NOT RUN without it. Where to get them:
`dev/agents/market-researcher/wtg-samples.md`. All 384 tables exist in every file, empty or not, so
the column layout of a kind no sample uses (FCV, GPV) is visible even without rows.

- **Soft delete everywhere.** `HMIDomainElement.IsDeleted`, `HMIScenario.IsDeleted`,
  `HMIAlternative.IsDeleted`, `HMISupportElement.IsDeleted`, `HMIModelingElement.IsDeleted`. A
  fresh file carries deleted defaults (scenario 1, alternatives 2 to 19, and in the withdrawal model
  deleted alternatives 138 and 139 holding default values: 0 elevation, 0.5 ft pipes, C 130). Every
  read filters them.
- **Names.** `HMIModelingElement(ElementID, ElementType, Label, Notes)`: ElementType 1 alternative,
  2 scenario, 3 network element, 4 support (pattern, pump definition, control), 5 calculation options.
- **Classes**: one-column tables (`IdahoJunction`, `IdahoReservoir`, `IdahoTank`, `ConventionalTank`,
  `IdahoPipe` (also `AddedForINPConversion`), `StandardPump`, `BaseValve`, `PRV`, `PSV`, `TCV`...)
  list the elements of each class. **A pump or valve is a NODE** (`BaseDirectedNode`) between pipes, and
  may have any number of them; `BaseDirectedNode_HMIDataSetTopology_Data.HMITopologyDownstreamLinkID`
  names the downstream one. A variable speed pump battery (`VariableSpeedPumpBattery`) is such a node too. Anything else live (Tnet0's `DischargeToAtmosphere` "D2A-3", spot elevations...) is reported.
- **Values**: `<Class>_<Group>_Data(DomainElementID, AlternativeID, ...)`, one row per element per
  alternative; collections add `ItemID` (`IdahoDemandNode_Demand_DemandCollection`,
  `ConventionalTank_Physical_DepthRatioVolumeRatioCurve`). A column can move between versions: a
  pipe's user length is in `BaseLink_Physical_Data` in 10.1 and `IdahoPipe_Physical_Data` in 8.11, so
  the reader finds a column in whichever `_Data` table holds it.
- **Scenarios**: `HMIScenario(ScenarioID, ParentID)`; `HMIScenarioAlternative(ScenarioID,
  AlternativeTypeID, AlternativeID, IsLocal)`, 18 types (1 Geometry, 2 Topology, 3 Active Topology,
  4 Physical, 20 Demand, 21 Initial Settings, 22 Operational, 23 Age, 24 Constituent, 25 Trace, 26
  Fire Flow, 28 Energy Cost, 29 PDD, 31 Flushing, 50 Transient, 51 Failure History, 14 SCADA, 100 User
  Data). `IsLocal 0` = inherited; its AlternativeID already equals the parent's. Alternatives:
  `HMIAlternative(AlternativeID, ParentID, AlternativeTypeID)`. Active scenario:
  `HMIDomainDataSet.ActiveScenarioID`. Calculation options: `HMIScenarioCalculationOptions` to
  `EpaNetEngine`.
- **Geometry**: `HMIGeometry` is WKB (point; linestring with the end points included, interior
  points = vertices), in feet, with `IdahoDataSet.HMIDataSetGeometrySpatialReference` empty in every
  sample. Pipe length: `Physical_UserDefinedLength` when `Physical_IsUserDefinedLength`, else
  `HMIGeometryScaledLength` (P13: 951.44 ft = 290 m user length, the `.inp`'s; scaled 1160.7 ft).

### Storage units

`HMIDomainDataSetTypeSchema.SchemaInfo` is a serialized field table: per field FieldTypeID, FieldDataType,
name, category, a resource key, one more string, then **StorageUnit** (int32). The code's meaning is
not in the file; each was measured against an `.inp`:

| Code | Unit | Evidence |
|---|---|---|
| 63 | ft | elevation 42.9790026245 = 13.1 m; diameter 0.656168 = 200 mm; Tnet3 diameter 1.70833 = 20.5 in |
| 27 | ft3/s | pump design 1.527853753088 = 43.264 L/s; Tnet3 demand 0.0017012 = 0.763534 gpm |
| 33 | ft3 | tank active volume 26574.71 = 752.512 m3 |
| 231 | psi | Tnet0 PRV 142232.905 for 100000 m |
| 234 | s | pattern times 1800, 3600...; EPS duration 86400 = 24:00 |
| 236 | ft2 | tank average area (no sample with rows) |
| 252 | none | Hazen-Williams C, Manning n, minor loss coefficients |

Unknown and therefore not converted (reported if a value is present): 28 (emitter coefficient) and 98
(constant pump power). A field the blob does not name falls back to the code every sample states
(`EXPECT` in `js/lpn-wtg.js`) and the report says so.

### Codes read off the samples

- `FrictionMethod`: 0 Darcy-Weisbach (Tnet0), 1 Hazen-Williams; 2 taken as Manning (unproven).
- `PumpDefinitionType`: 1 design point (EPS), 5 multiple point (Tnet3); 0 constant power, 2 standard
  three-point, 3 standard extended, 4 custom extended by Bentley's list order (unproven).
  `PumpEfficiencyType` 0 constant (written as WaterGEMS's own export writes it: a one-point curve at
  the design flow), 2 points; others reported.
- `BaseValve_InitialSettings_Data.ValveSetting`: 0 active, 1 inactive (= EPANET Open; Tnet3's TCVs
  and Tnet0's PRV against their `.inp` `[STATUS] Open`); 2 taken as Closed, reported.
- `PressureValveSetting` 0 pressure (psi), 1 hydraulic grade (ft). `TCVCoefficientType` 1 = minor loss
  coefficient. `PipeStatus` 1 closed; `ActionPipeStatus` 1 closed (EPS's control "P1 Pipe Status =
  Closed"). `PumpStatus` 1 taken as off (unproven).
- Tank: `OperatingRangeType` 0 elevations (all samples), 1 levels (unproven); `TankSection` 0 circular,
  1 average area, 2 variable area (EPS: depth ratio x active range, volume ratio x active volume
  gives the `.inp`'s curve exactly). `Physical_HasSeparateInlet` = WaterGEMS's top inlet, which its
  own EPANET export models as a PSV and a 0.001-long pipe; here the pipe joins the tank, reported.
- Patterns: `IdahoPattern` (start multiplier, start time of day, `PatternFormat` 0 stepwise, 1 continuous) and
  `IdahoPattern_PatternCurve` (seconds from start, multiplier; the last point closes the cycle). A
  reservoir's `Physical_HglPattern` multiplies its elevation (withdrawal model: R-2 at 1 m, pattern
  from 56).
- Controls: a simple clock-time condition (`SimpleConditionType` 2, `CompareOperator` 0) on a pipe's
  status is written as an EPANET control; every other control is reported in WaterGEMS's own words.
  With no control set named (`Operational_SystemData.Operational_IdahoControlSetID` null), the EPS
  model's one control is in its `.inp`, so all controls are read; with one named, none are, reported.
- Demand adjustments: one adjustment of everything by `NormalDemandOperation` 2 is written as
  EPANET's Demand Multiplier (the EPS model's is 1); any other is reported.

## The proof

`dev/lpn-spike/wtg-import-harness.js` (Node). The EPS model against the `.inp` WaterGEMS exported
from it, read through `lpnInpParse()` both: **33 nodes and 32 links each** once WaterGEMS's own
additions are set aside (its tank-inlet construction: junctions 1 and 2, PSV 1, pipe 2; and its
renames: pipes 3 and 4 are U1-A and U1-B, junctions 4 and 3 are U1-U and U1-D). **310 attribute values
compared; three differ, each explained**: U1-B ends at the tank (the export routes it to the inlet
construction), U1-B is a check valve in the database (the export writes it Open beside a pump), and
the tank's diameter (10 ft stored, 1 ft written by the export; unused, the tank has a volume curve).
The two new junctions beside the pump are drawn at different places by the two writers. **EPANET
solves both at time zero to within 2.3e-7 m head at all 33 shared nodes and 1.3e-5 L/s flow in all 32
shared links.** The withdrawal model: Base, "Scenario - 1" (child of Base), "Scenario - 2" (no
parent, reported, made a child of Base), neither overriding anything; its unused "Alternative 1"
carries P1 at 902 m (Base 882) as a stored alternative of its own.

`dev/lpn-spike/wtg-import-browser-harness.js` (Chromium): the menu row, the chooser, the report, the
stored project and the page's own solve, on a synthetic model always (`wtg-synthetic-fixture.js`,
built by Python at test time: within 5.3e-6 m of EPANET) and on the EPS sample when present: the
page's solve of the import and its solve of the exported `.inp` agree within 4.9e-11 m at the 31
shared nodes outside the pump-to-tank path. On that path they do not, because the page passes the
pump's flow through the export's PSV into the full tank while EPANET (and this import's direct
inlet) shut it off: a question for the page's solver, not for this reader.

## What two real models taught (2026-10-19)

Two real WaterCAD models from a consulting firm, supplied by Tom (a full build-out and a phase 1 of
one project, US units, steady state, one reservoir, no pump, tank, valve or control), each with the
`.wtg`, the `.wtg.sqlite` and a spreadsheet of WaterCAD's own results for four scenarios. They are
not in the repository and nothing from them is. The first working models, as against the public
samples.

- **They opened, imported and solved at once.** Both are schema 1.0.45 (the public samples are 1.0.44 and 1.0.38). What the reader had skipped was the whole demand.
- **All their demand is a unit demand load**: a count of loading units times a unit load (area,
  dwelling units, population), each row stored with its flow in ft3/s
  (`IdahoDemandNode_Demand_UnitDemandLoadCollection`, owner row `Demand_Data` with
  `UnitDemandLoadCollectionCount`). The reader had called this "customer demand" and imported zero,
  so a solve showed no flow. Now each row's flow is a demand of its junction. The units and the unit
  load themselves are not carried; a note says so (`wtg-unit-demand`).
- **Their scenarios differ in one thing: the demand adjustment.** Average day, maximum day, peak
  hour and maximum day plus fire flow all pick the same alternatives (every `HMIScenarioAlternative`
  row points at the one demand, one Physical, one fire flow alternative); each scenario owns an
  `HMIScenarioCalculationOptions` row, whose `EpaNetEngine` row has `UnitDemandAdjustmentsCollection`
  (operation 2 = multiply, value 1.8 for maximum day, 3.0 for peak hour, no row for average day).
  Operation 2 as multiply is now proved: WaterCAD's reservoir outflow is 1.8 and 3.0 times the
  average day's. Unit demand loads and normal demands have separate adjustments; the reader makes
  the one that governs the project's Demand Multiplier and a scenario's own value the scenario's
  `demandMultiplier`. If both kinds of demand exist and the two adjustments differ, the unit loads
  are scaled and the report says so.
- **Alternatives that no scenario uses** exist here too (MDD, PHD, MDD+FF: children of the demand
  alternative, the last holding larger unit loads). They are not Physical, so they are not carried;
  the loss is the unit loads of an alternative no scenario picks.
- **A scenario that overrides Physical data is still unseen.** These scenarios have no Physical
  override at all.
- **Fire flow is per junction.** `IdahoFireFlowNode_FireFlow_Data` has a "has local constraints"
  flag, a needed flow and an upper limit per junction; `FireFlow_SystemData` has the system's
  needed flow, upper limit, residual pressure and velocity limit. A junction's own needed flow
  becomes its Required fire flow; the system numbers and every upper limit are reported with their
  values (`wtg-fireflow`), because the document has no home for them.
- **Duplicate labels**: two pipes share one label in a real model; the second takes `_2`, reported.
  Nothing else in their naming needed a change.
- **Results are not stored in the database.** Every results table (`Idaho*Results`) is empty; what
  WaterCAD computed lives only in the spreadsheet.

**The proof, aggregate only.** The reader's output was solved by EPANET at each scenario's demand
multiplier and compared with WaterCAD's spreadsheet, junction by junction and pipe by pipe, for
average day, maximum day and peak hour of both models (six comparisons, 54 junctions and 72 pipes
counting both): the largest difference in hydraulic grade is 0.005 ft, in pipe velocity 0.005 ft/s,
in pressure 0.53 psi and in flow 0.49 gpm. Those are exactly the spreadsheet's own rounding (grade to
0.01 ft, pressure and flow to a whole psi and gpm), so the match is complete to what the
spreadsheet can show. A fire flow check by bisection in EPANET against WaterCAD's available flow at
each junction (maximum day, residual 19.8 psi, system minimum 19.8 psi, 10 ft/s) agreed within 1 %
at 32 of 37 and 15 of 17 junctions; the rest are the junctions with local limits (upper limits of
2,000 and 5,000 gpm), which the document cannot hold.

`dev/lpn-spike/wtg-unit-demand-harness.js` holds the unit loads, the scenario multipliers and the
fire flow on synthetic data, and when `EC_WTG_PRIVATE_DIR` names a folder of real models it asserts
only that each opens, imports with demand, and solves with sane pressures (prints SKIPPED without it).
`wtg-import-browser-harness.js` holds that the multiplier and the required fire flow reach the stored
project.

**The spreadsheet question.** A results spreadsheet cannot fill a gap in the model: everything that
defines the network is in the database. What it adds is WaterCAD's answers (grade, pressure, flow,
velocity, and the fire flow table of available flow, limiting junction and system minimum pressure at
that flow), rounded to the report's precision. Use: a "WaterCAD says" column beside our result, and a
check that an import reproduced the model. Not built.

## A scenario that overrides Physical and Demand (2026-10-20)

`WTG-tgh-1.wtg.sqlite` (6.3 MB; kept outside the repository, in `~/tom-files/2026-10-19/` or the folder `WTG_TGH_DIR` names;
the harnesses print NOT RUN without it), its `.wtg`, and WaterGEMS's own `.inp` export of each scenario, saved by Tom
as an ordinary user of WaterGEMS: Base plus a child scenario TGH-1. Tom first saved a three-node model whose
TGH-1 changed one pipe diameter and one demand, then saved a larger one over it (below); the rows
described here held in both. Every statement below is OBSERVED in this file.

- **A child scenario's rows**: `HMIScenario` 38 has `ParentID` 1 (Base). Its `HMIScenarioAlternative`
  rows are `IsLocal 1` for the two categories it changes (Physical type 4 to alternative 37, Demand
  type 20 to alternative 36) and `IsLocal 0` (inherited) for every other category. The new
  alternatives are children of Base's (`HMIAlternative.ParentID` 6 and 7).
- **A child alternative's rows are for the changed elements only, and a row restates every column of
  its table.** Physical alternative 37 has rows for pipe 33 only (`BaseLink_Physical_Data`,
  `IdahoPipe_Physical_Data`, the latter holding the whole row with `Physical_PipeDiameter`
  0.8333 ft); pipe 35 has none and inherits Base's. Resolution through the parent, as the reader
  does it, is right.
- **A Demand override is a row of `IdahoDemandNode_Demand_Data` at the child alternative** (J-1:
  `DemandCollectionCount` 1, where Base has 0) **with its `IdahoDemandNode_Demand_DemandCollection`
  row** (`DemandCollection_BaseFlow` 2.785 ft3/s = 1250 gpm). J-2 has no row at alternative 36 and
  keeps Base's. The reader writes a junction whose demand list differs from Base's, with one row
  each side and the same pattern, as that junction's `demand`; any other difference (several rows, or
  another pattern) as the junction's whole `demands` list, the way the page holds a scenario's own demand table.
- **Results** are in the `.out`/`.rpc`/`.dwh` files beside the model, not in the sqlite.
- **Coordinates and elevations here** are in the `.wtg`'s display units (GPM, feet); the export's
  coordinates are in feet with fifteen digits, the reader's with ten.

**Proof**: `node dev/lpn-spike/wtg-tgh-harness.js`, below. Not compared: the export's `[OPTIONS]` and
`[TIMES]` text (the reader writes its own: same units, head loss and viscosity).

## Pumps and valves as nodes, a continuous pattern, and the alternatives themselves (2026-10-20)

Tom's second sample, saved over the first (`WTG-tgh-1`, same folder): a reservoir, two tanks, three pumps (one a
variable speed pump battery), one valve of each type (PRV, PSV, PBV, FCV, TCV, GPV), 33 pipes, a continuous
pattern, and a child scenario TGH-1, with WaterGEMS's own `.inp` export of Base and of TGH-1. Every statement is
OBSERVED in it. `node dev/lpn-spike/wtg-tgh-harness.js` compares the reader with both exports (1,373 values).

- **WaterGEMS's own export of a pump or valve node**: two junctions at the node's position, named after the node's
  ID number, not its label (`46-A`, `46-B` for PMP-1), the pump or valve a link between them. **The one
  downstream pipe the database names joins B; every other pipe at the node joins A**, whichever way it points
  (PMP-1 has three pipes on A and one on B). The reader did this for a node with exactly two pipes only, and
  dropped every node with more; the nine nodes of this sample and 21 pipes beside them were reported as not
  imported. It now does what the export does for any number of pipes. Names stay `<label>-U` and `<label>-D`,
  and the two junctions are still drawn apart (a quarter along the first inlet pipe and the outlet pipe) so the
  link has a length on the map.
- **A variable speed pump battery** is written by the export as one pump with `HEAD <curve> SPEED 1`; so here, from
  its own definition (`Physical_VspbDefinition`). Its lag pumps, control node and target are not read.
- **A pump definition type 2 with efficiency type 1** (motor efficiency 100): the export writes a one-point
  EFFICIENCY curve at flow 0 holding the motor efficiency; so here. Type 1 is read from this one sample.
- **A GPV's curve and a tank's volume curve** reach `[CURVES]` for any scenario that states one, exactly as the Base
  pass writes them (`gpvCurveId()`, `tankFacts()`).
- **A continuous pattern**: ten points over 24 hours, a starting multiplier of 1 and the first point 0.2, came out
  of WaterGEMS's export as **26 multipliers at the one-hour step**: the starting multiplier, then the straight
  line between points sampled at 0, 1, ... 24 hours, both ends included. The reader writes exactly that, at a
  pattern step that is the gcd of the point times and the hydraulic time step, and the report says the pattern
  was continuous. (The same pattern read as a stepwise one by the old reader came out as 24 different
  multipliers.) Whether WaterGEMS's own solver reads the line, or the export's shifted samples, is not
  known; the file is the only thing compared.
- **Alternatives, as the page stores them** (`treeOf()` in `js/lpn-wtg.js`; the tree is
  `dev/scenario-alternatives.md`, "Stages 4 and 5"). Every alternative a scenario names becomes a stored
  alternative **of the same name** in the category its type matches: Physical (4), Demand (20), Initial
  settings (21), Fire flow (26), Active topology (3) with their values read; Constituent (24), Energy cost (28)
  and User data (100) by name only; the other types (Geometry, Topology, Operational, Age, Trace, Pressure
  Dependent Demand, ...) have no counterpart and are named in the report. An alternative holds only the values in
  which it differs from its parent alternative and hangs from it; a root alternative that is not Base's is "a Base
  of its own" holding every value it has rows for. A scenario names the alternatives it uses where they differ
  from its parent scenario's (`'base'` where it goes back to Base's), so **two scenarios that share an
  alternative name one record**, and a scenario's parent is its parent scenario. Alternatives no scenario uses
  are imported too.
- **Whatever an alternative cannot say stays the scenario's own override**: the importer lays the alternatives on in
  the order the page resolves them and writes the difference from what WaterGEMS computes for the scenario. In
  TGH-1 that is the two tank depths: Physical moves the tank's base to 120 ft while the water surface stays at
  139 ft, so the depth is 19 ft; the page stores depth, WaterGEMS stores surface elevation. **A scenario that
  names an alternative can therefore also carry overrides.** An alternative picked by no scenario loses such a
  cross-category effect silently; it is rare, and the report does not name it.
- **What an alternative holds, and the report names when it cannot**: Physical: junction elevation,
  reservoir head, tank base elevation (both `elev` and `bottomElev`, as import writes them), levels, diameter and
  volume curve, pipe diameter, length, roughness and minor loss, valve diameter and minor loss, pump and GPV
  curve references, the elevation of the two junctions beside a pump or valve. Initial settings: pipe, valve
  and pump status, valve setting, pump speed, tank depth. Demand: a junction's demand, or its whole list of
  demands where there are several or the pattern differs. Fire flow: a junction's needed flow. Active topology:
  active or not. Of these only Physical and Demand have a real sample (TGH-1); the rest are built from the schema
  and held by a synthetic model (`wtg-alternatives-harness.js`, section 2), **untested on real data**.
- **Proof**: `wtg-alternatives-harness.js` imports TGH-1 into the page, opens Base and then TGH-1, and reads 211
  and 210 values through the page's own `effective()` against the two exports; its second section holds sharing,
  a grandchild alternative, a return to Base, and the categories above on a synthetic model.

## Unproven, and the sample that would prove it

- **A Demand alternative that changes a junction with several demand rows** is carried as the junction's
  whole `demands` list (synthetic model only; Tom's sample changes single demands).
  Alternatives other than Physical and Demand are built from the schema (synthetic model only); Geometry,
  Topology, Operational, Age, Trace and the other types with no counterpart are named in the report.
- **US-unit models end to end** (Tnet3 is GPM-era data shown in L/s; no sample is a US model with its
  `.inp`), FCV, PBV, GPV, constant-power and three-point pumps, emitters, customer demands,
  `OperatingRangeType` 1, continuous patterns, and a stated spatial reference: each is read by the
  column layout the empty tables show, or reported, never guessed silently.
- **Big files**: sql.js holds the whole file in memory (Bentley reports 6 GB for 7,000 pipes); a
  zipped `.wtg.sqlite` is refused as not SQLite; a WAL-mode file's `-wal` rows are not seen.
- **Writing the file back**: not started (`dev/bentley-interop.md`).
