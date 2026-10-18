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
Base with their overrides, and the alternatives no scenario uses. Every difference is a note
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
  list the elements of each class. **A pump or valve is a NODE** (`BaseDirectedNode`) between two
  pipes; `BaseDirectedNode_HMIDataSetTopology_Data.HMITopologyDownstreamLinkID` names the downstream
  one. Anything else live (Tnet0's `DischargeToAtmosphere` "D2A-3", spot elevations...) is reported.
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
- Patterns: `IdahoPattern` (start multiplier, start time of day, `PatternFormat` 0 stepwise) and
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

## Unproven, and the sample that would prove it

- **A scenario that overrides something.** No public file has one. The reader resolves a scenario
  through its alternatives and their parents (the patent's reading: a child alternative's rows hold
  its own values, the rest inherit) and writes every Physical value that differs from Base as that
  scenario's override; the synthetic fixture holds that path, not a real file. Needed: a small model
  saved by WaterGEMS with Base plus a child that changes one pipe diameter and one demand, with an
  `.inp` exported for each scenario. Also unread so far: alternatives other than Physical for a
  scenario (named in the report), and the alternative names and sharing (overrides only).
- **Whether a child alternative's row restates every column or only the changed ones** (the same
  sample answers it).
- **US-unit models end to end** (Tnet3 is GPM-era data shown in L/s; no sample is a US model with its
  `.inp`), FCV, PBV, GPV, constant-power and three-point pumps, emitters, customer and unit demands,
  `OperatingRangeType` 1, continuous patterns, and a stated spatial reference: each is read by the
  column layout the empty tables show, or reported, never guessed silently.
- **Big files**: sql.js holds the whole file in memory (Bentley reports 6 GB for 7,000 pipes); a
  zipped `.wtg.sqlite` is refused as not SQLite; a WAL-mode file's `-wal` rows are not seen.
- **Writing the file back**: not started (`dev/bentley-interop.md`).
