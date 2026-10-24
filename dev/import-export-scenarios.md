# Import and export: the one standard for scenarios and alternatives

Task 814, branch `docs/import-export-scenario`, 2026-10-17. Tom's brief: *"We must get perfect clarity
about our standard handling of scen/alt in imp/exp, then we must apply it to every imp/exp command."*
His three classes: current scenario, current project, separate project. This file is the inventory
(part 1), the standard (part 2), the draft English (part 3), the defects ranked (part 4), and the
questions only Tom can answer (part 5). Built on master (Tasks 814, 819): rows 7 and 8 landing in the open project; the question before exports 21-23 and their `<project>-<scenario>` file names; reports and paste notices naming their scenario. The receipt after exports 21-23 merged 2026-10-22 (`feat/export-scenario-confirm`). Read the code before briefing a row: this inventory lagged the code once already. Code is named by function, not line. Audited against `master` at `e583a7cc6` (2026-10-23); the two branches are read from `feat/sheet-sync` and `feat/sqlite-reader`.

Terms used. **Aware** means the format can carry what the project's model carries: scenarios, the
alternatives each scenario names, inheritance, and the Presentation and Calculation categories
(`dev/scenario-alternatives.md`). **Resolved values** means what the command read through
`effective()` for the open scenario: Base's value where the scenario holds none.

## Part 1. The inventory

36 commands on `master` (6 that read or write this page's own file, 14 imports of other things,
16 exports), plus 2 on `feat/sheet-sync` and 1 planned on `feat/sqlite-reader`. There is **no file
drag-and-drop** on the page (no `drop` handler takes files); every file comes through a menu row and
a hidden `<input type=file>` (declared in `Looped-Network.php`, wired in `js/looped-network.js`).

**Class** is where the data lands (an import) or what it is read from (an export):
**S** one scenario (the open one), **P** the current project (its non-scenario data, or the whole of
it), **X** a separate project (the command makes or is a new project or file), **-** none of the
three (browser furniture or a view-only aid; no scenario question can arise).

### 1a. This page's own project file (the whole tree)

All carry the whole tree, Presentation and Calculation included. None needs a scenario question.

| # | Menu path (English) | Code | Scenario tree carried | Class |
|---|---|---|---|---|
| 1 | File > Open… (a file, or upload) | `openFromFile`, `pickUploadFile`, `importProjectFromFile` | Whole tree, read as saved | X |
| 2 | File > Open example… | `openExample` | Whole tree; opens a copy in a new tab | X |
| 3 | File > Recent files > (name) | `openRecentFile`, list in `fileMenuRows`  | Whole tree | X |
| 4 | File > Save, Save as…, Save all (download where the browser cannot connect) | `saveCurrent`, `saveAs`, `downloadProjectFile` | Whole tree, written | P (Save as to another file makes X) |
| 5 | File > Convert as… (project or `.inp` file route: `pickGeoFile`, `openAsGeoFile`) | `convertAs`, `openConvertAsBox` | Whole tree; rewrites coordinates and units on every scenario's stored numbers (`dev/scenario-alternatives.md`) | X |
| 6 | Project tab menu > Duplicate | `saveProjectAs`, menu in the project tab menu | Whole tree | X |

### 1b. Imports of other things

"Writes" says what the import does with scenarios today. Every row was read in the code, except
where marked **(not traced)**.

| # | Menu path (English) | Code | Format | Today, with scenarios | Class |
|---|---|---|---|---|---|
| 7 | File > Import > EPANET file… | `pickInpFile`, `importInpFromFile`, `landInpText`, `inpAskDestination`, `updateProjectFromInp` | `.inp`, or EPANET's `.net` | With the open project empty: a **new project**, Base only, as always. With assets in it: asks **a new project / this project (or the open scenario, or Base)**. *This project* matches assets by ID, updates differing values through `setProp()` (an override in a scenario), adds assets only in the file (inactive in Base when a scenario is the target), keeps and names assets only in the project, refuses a file whose units or head loss formula differ, is **one undo step**, and ends in a **receipt dialog** naming the scenario. Built, Task 814 | X, or S |
| 8 | File > Import > GeoJSON network… | `pickGeoJsonNetFile`, `landGeoJsonNetText`, `askImportDestination`, `updateProjectFromGeoJson`, `finishGeoJsonNet` | GeoJSON | **The same as row 7, by the same code** (`askImportDestination`, `inpPlanFromSource`, `updateProjectWithPlan`, `showInpUpdateReceipt`): a file from another source passes the mapping step first, then the same question; a file this page wrote asks only the question. The receipt adds a *Reading the file* list of the importer's own differences. The file's `scenario` property is still not read back. Built, Task 814 | X, or S |
| 9 | File > Import > Surveyed points… | `pickSurveyFile`, `landSurveyText`, `createSurveyNodes` | CSV, TXT, PNT | Into the **open project**. Each node goes through `addNode()`, which calls `bornInScenario()`: in a scenario other than Base, the node is **inactive in Base and active only there**. When the project holds more than Base the box asks where they go (the open scenario, a new child scenario, or Base) and the report names the scenario. Built | S |
| 10 | File > Import > GeoJSON shapes… | `pickGeoJsonFile`, `landGeoJsonShapes` | GeoJSON | Shapes are "in no scenario" (`js/lpn-geojson.js`). Open project, one undo step. The receipt says "Shapes appear in every scenario." when the project holds more than Base. Built, `scenario-io-names-browser-harness.js` S1 | P |
| 11 | File > Import > DXF shapes… | `pickDxfShapesFile`, `importDxfShapesFromFile` | ASCII DXF | As 10 The same receipt line as row 10. Built | P |
| 12 | File > Import > Shapefile shapes… | `pickShapefile`, `importShapefileFromFiles` | `.zip`, or `.shp` with sidecars | As 10 The same receipt line as row 10. Built | P |
| 13 | File > Import > Libraries… | `libImportPick`, `libImportText` | A project file, libraries only | Copies patterns, curves, pipe types, fittings, controls, rules into the **document**; libraries belong to no scenario, but every scenario can then refer to them | P |
| 14 | File > Import > Workspace… | `pickWorkspaceFile`, `importWorkspaceFromFile` | JSON | Browser layout and display options only; no project, no scenario | - |
| 15 | Water > Reports > Calibration > Load calibration file… | `loadCalibFile`, `landCalibText` | text `.dat`/`.txt`/`.cal` | Held for the session, compared with **the last run**, whichever scenario that was **(not traced further)**. Not stored in the project | - |
| 16 | Profile > Saved paths > Open EPANET profile file… | `pickProfileFile`, `importProfileFromFile`, `loadProfileFileText` | `.pro`/`.txt` | Adds saved paths to the project (`doc.profiles`); a path is a list of node IDs, in no scenario | P |
| 17 | Map > Background image… (Add, with its world file) | `addBackdropFromDataUrl`, `readWorldFile`; also the `.inp` report's "Attach {file}…" | PNG, JPEG, GIF, BMP + `.pgw`/`.jgw`/`.wld` | Project-level picture; not per scenario. The receipt does not yet say so | P |
| 18 | Tables pane > paste (Ctrl+V, right-click Paste, Paste as new rows at end) | `panePasteAt`, `lpn_pane_pasted_scenario`, `lpn_pane_pasted_overrides` | Clipboard text (TSV) | Each cell goes through the one write seam, so in a non-Base scenario every changed cell becomes an **override** there. The notice names the scenario, says the values are overrides and counts the new ones. Built | S |
| 19 | Right-click an asset > Paste properties to selection | `pasteProperties`; copy side `copyProperties` | In-app clipboard | Scenario-aware: in a scenario copies the overrides, and says "Created {category} alternative {name} for this scenario" when it makes one | S |
| 20 | Properties > Elevation > Use DEM; Find and replace > From Mapbox DEM (Mapbox Terrain-RGB; opt-in) | `demSample`, `demScenarioSentence`, `terrainFillElevations`, `EngCalcs.lpnTerrainPlanText`, `lpnTerrainDoneText` | A web service | Through `setProp()`: an override in the open scenario, or a change to Base itself. The question before a bulk fill and its answer afterwards, and the notice after Use DEM, say which (only when the project holds more than Base). Read DEM alone writes nothing. Built, `scenario-io-names-browser-harness.js` D1 | S |

### 1c. Exports

| # | Menu path (English) | Code | Format | What it carries of the tree today | Class |
|---|---|---|---|---|---|
| 21 | File > Export > EPANET file… | `exportInpFile`; `inpExportDocument`, `inpExportOptions` | `.inp` (+ `.zip` with picture) | **The open scenario's resolved values**, its own demand list, positions, `[TIMES]` and demand multiplier. File named `<project>-<scenario>.inp` (not for Base). Other scenarios, alternatives, Presentation: none. With more than Base, or any stored alternative, a confirmation (`confirmExportLeaves`) asks before the file is written, naming the scenario and what is left; every export then ends in a receipt dialog (`showExportReceipt`) and a status line (`exportScenarioSentence`). The flattening dialog (`showInpExportFlattening`) still appears for pipe types, fittings, customers, inactive controls and moved nodes | S |
| 22 | File > Export > GeoJSON file… | `exportGeoJsonFile`, `geoJsonExportOptions` | GeoJSON | Open scenario's resolved values; its name stored **inside** the file (`scenario` property); file named `<project>-<scenario>.geojson` outside Base; results attached only when they belong to the open scenario (`geoJsonStaleScenario`); same confirmation and receipt as row 21 | S |
| 23 | File > Export > DXF file… | `exportDxfFile`, `dxfModel` | DXF | Open scenario as the "alternative" layer name (`BASE` for Base); whole network as that scenario has it. File named `<project>-<scenario>.dxf` outside Base; same confirmation and receipt as row 21 | S |
| 24 | File > Export > ODS file… | `openExportTableBox('ods')`, `paneExportDownload` | ODS | Box asks **Tables** (Current/All) and, if the project has a scenario besides Base, **Scenarios** (Current/All). All = one sheet per scenario, side by side; no tree; results for the last-calculated scenario only (note shown). Sheet and file names carry the scenario (`paneExportDownload`). The box does not yet say that parents, alternatives and inheritance are not in the file | S, or all |
| 25 | File > Export > XLSX file… | as 24 | XLSX | as 24 | S, or all |
| 26 | File > Export > CSV file… | as 24 (a zip when more than one) | CSV | as 24 | S, or all |
| 27 | File > Export > Workspace… | `exportWorkspaceFile` | JSON | None (browser furniture) | - |
| 28 | Tables pane > right-click > Export to CSV / ODS / XLSX | `paneExportTable` | CSV, ODS, XLSX | The one table as shown; the open scenario's values. File named `<project>-<table>-<scenario>` outside Base (not when Show scenarios holds every scenario in the table). Built, harness N1 | S |
| 29 | Tables pane > Ctrl+C, right-click Copy, Copy with column headings | `paneCopyTsv` | TSV on the clipboard | As shown: the open scenario's values. No notice, deliberately (a cell-level gesture) | S |
| 30 | Tables pane > right-click > Print table | `paneBuildPrintable`, `printPaneTable` | Print | As shown; the suggested PDF name is `<project>-<table>-<scenario>` outside Base. Built, harness N2 | S |
| 31 | Water > Reports > Full > Download CSV | `downloadFullReportCsv`, `fullReportFilename` | CSV | Results of the last run; file `<project>-<scenario of the run>-Full report.csv` when the project holds more than Base. Built, `import-export-receipts-browser-harness.js` F1 | S |
| 32 | Water > Reports > Full > Print report | `printFullReport` | Print | As 31 | S |
| 33 | Run report box > Copy | `openRunReportBox` | Text on the clipboard | EPANET's report of the last run, verbatim | S |
| 34 | Map > Screenshot (and Snip, Copy) | `startScreenshot`, `openSnipBox`, `snipDownload`, `copyBlob` | PNG | The map as the open scenario draws it (Presentation of that scenario). Downloaded file named `<project>-<scenario>-screenshot.png` outside Base. Built, harness N3 | S |
| 35 | Right-click an asset > Copy properties | `copyProperties` | In-app clipboard | In a scenario, the overrides; in Base, the values. No notice, deliberately | S |
| 36 | Library > Curves > Copy points | the Curves section's copy button | Text on the clipboard | Points of a curve; curves belong to no scenario | P |

### 1d. On branches (not on `master`)

| # | Menu path | Code | Format | Tree | Class |
|---|---|---|---|---|---|
| B1 | File > Export > Scenario workbook… (`feat/sheet-sync`) | `exportScnBookFile`, `scnBookSheets()`; `dev/scenario-workbook.md` | `.xlsx` | **Whole tree except Base's own values**: scenarios, parents, the alternative each names per category, every alternative's own values, settings; hidden key row; Project sheet for identity. No Presentation views, no graphs | P |
| B2 | File > Import > Import scenario workbook… (`feat/sheet-sync`) | `pickScnBookFile`, `scnBookPlan()`, `scnBookApply()`, `showScnBookReport()` | `.xlsx` | Into the **open project**. Compares first, lists every difference, **Apply changes** or Cancel; never deletes; warns when the Project sheet's name or asset IDs differ | P |
| B3 | (planned) Import > Bentley file… (`feat/sqlite-reader`) | `js/lpn-sqlite.js`; no menu row, no resolver yet | `.wtg.sqlite` | Reader only. Task 814's questions are named as left for it. Bentley carries scenarios and alternatives but **not** Presentation, a Text's place, or a position that differs by scenario (`dev/bentley-interop.md`) | X (new project) |

### 1e. The split

| Class | Count on `master` | Which |
|---|---|---|
| S, one scenario | 18 | 9, 18, 19, 20 (imports); 21-26, 28-35 (exports) |
| P, the current project | 8 | 4, 10-13, 16, 17 (imports); 36 (export) |
| X, a separate project | 7 | 1, 2, 3, 5, 6, 7, 8 |
| none of the three | 3 | 14, 15, 27 |

Rows 9, 18, 19 and 20 write into whichever scenario is open, and each now says which; 21, 22, 23 leave the other scenarios behind, and each now asks first and says so. What still does not tell is listed in the next paragraph.

**Rows still short of the standard (2026-10-23):** 17 and 13 and 16 (no receipt line saying the data is shared by every scenario); 24-26 (the box does not say what All leaves out); 36 and 29 and 35 (silent by design). Rows 21-23 still do not offer a choice of scenario to export (the standard's optional "Scenario to export" line).

## Part 2. The standard

### 2a. Format awareness

Awareness is a property of the **format**, not of the command. Fit is the share of this project's data
a format can hold; it is stated as what is lost, never as a score.

| Level | Name | Formats | Holds | Does not hold |
|---|---|---|---|---|
| 4 | Same model | This page's project file | Whole tree, Presentation, Calculation, everything | Nothing |
| 3 | Tree, other shape | Scenario workbook (branch); Bentley `.wtg.sqlite` (planned) | Scenarios, parents, per-category alternatives, their own values | Presentation; a Text's place; Bentley also not a per-scenario position. The workbook has no Base values |
| 2 | Scenarios as flat copies | Tables workbook or zip (ODS, XLSX, CSV) with Scenarios: All | One sheet per scenario | Parents, alternatives, inheritance; results for any scenario but the last calculated |
| 1 | One state | `.inp`, GeoJSON, DXF, picture, clipboard text, print | One scenario's resolved values | Every other scenario; all alternatives; Base's values where the scenario overrides them |
| 0 | No concept | Shapes (GeoJSON, DXF, shapefile), survey points, libraries, background images, calibration files, workspace | Data that lives outside the scenario model, or a plain list of points | n/a |

### 2b. The rule, by direction and level

1. **Import from level 0 or 1** (less aware than the project) **asks where the data goes.** One
   dialog, the wizard in 2c. What it asks depends on whether the data is **scenario-dependent**
   (assets, properties, demands: class S data) or **project-level** (shapes, libraries, pictures:
   class P data).
   - Project-level data (level 0): ask nothing; **state** where it went and that every scenario sees it.
   - Scenario-dependent data: ask the three questions (project, scenario, alternative when Basic
     mode is off).
2. **Import from level 2 or 3** goes through the **compare-and-apply report** that the workbook branch
   already uses: nothing changes until the visitor clicks Apply changes; every difference is listed;
   nothing is deleted. The scenario and alternative questions are answered by the file itself, so they
   are not asked, but a **new project or this project** is.
3. **Export to level 1 or 2** (less aware than the project) **asks to confirm** when the project has
   more than Base or any alternative, because something will be left behind. It says which scenario,
   and what is left. When the project is only Base and has no alternatives, nothing is left behind and
   nothing is asked; the receipt (2d) still goes out.
4. **Export to level 3 or 4** (equally aware) **does not ask; it discloses**, in the receipt, that this
   is an export: a copy, not a save of this project, and not a sync.
5. **Every export and every import ends in a receipt** naming the scenario (or "all scenarios", or
   "no scenario") and the project. The receipt goes in the message log as well as the status line, so
   it does not disappear in four seconds.
6. **File names carry the scenario** when the file holds one scenario of several
   (`<project>-<scenario>.<ext>`), as the `.inp` export does today (Tom, 2026-10-16). Base keeps the
   project name alone.
7. **Never write to Base by default.** An import that targets a scenario targets the open one unless
   the visitor chooses otherwise; choosing Base is a labelled choice with a warning, because Base is
   what every scenario inherits.

### 2c. The one wizard (imports from level 0 and 1 with scenario-dependent data)

One dialog (`openDialog`), at most three questions, defaults chosen so Enter does the least
surprising thing. Questions 2 and 3 appear only when they apply.

1. **Where does it go?** *A new project* / *This project, {project}*. Default: a whole network
   (`.inp`, GeoJSON network, `.net`) defaults to a new project, as today; points and table pastes
   default to this project.
2. **Which scenario?** (only for *This project*, and only when the project has a scenario besides
   Base or the visitor is not in Base)
   *{open scenario}, open now* (default) / *A new scenario, child of {open scenario}* (name field) /
   *Base. Every scenario inherits Base.*
3. **Which alternative?** (only with Basic mode off, one line per category the file touches)
   *{scenario}'s own alternative* (default) / *A new alternative, child of {parent}* (name field) /
   *The Base alternative.*

**Built (`import-new-scenario-browser-harness.js`):** the new scenario is made under the one undo step, so the file is compared with what it inherits, and is taken back when there is nothing to write. With Basic mode on, every scenario is a child of Base, so the button reads "child of Base"; with it off, "child of {open scenario}". Question 3 (alternatives) is not asked.

Then one **preview line** and the buttons. Imports that can be previewed without cost (a table of
values, survey points) preview; a whole network preview is the existing import report afterwards.

### 2d. Which command gets which treatment

| Command (numbers from part 1) | Format level | Today | Treatment under the standard |
|---|---|---|---|
| 7 `.inp` import, 8 GeoJSON network | 1 | Asks where it goes when the project has assets (built); new project otherwise | Question 1 built (new project / open scenario / a new scenario, child of the open one, with a name field / Base), for both doors. Receipt is a dialog naming the scenario |
| 9 Survey points | 0 | Asks where the points go (the open scenario, a new child scenario, Base) when the project holds more than Base; Base alone asks nothing. Built | Alternative question (3) not asked |
| 10-12 Shapes, 16 profile, 17 picture | 0, project-level | Silent, correct; Shapes now say "Shapes appear in every scenario." | No question; the same receipt line for profile and picture is left |
| 13 Libraries | 0, project-level | Silent, correct | No question; receipt "shared by every scenario" |
| 14 Workspace, 15 Calibration | none | Silent | No change; calibration's header names the scenario it was compared with |
| 18 Tables paste, 19 Paste properties, 20 DEM | 0 | Each names the scenario it wrote to (built) | No new dialog (a cell-level gesture must not gain a dialog); the notice names the scenario and counts overrides |
| 1-6 Own file | 4 | Whole tree | No question; Save as and Duplicate unchanged |
| 21 `.inp`, 22 GeoJSON, 23 DXF | 1 | One scenario, partly disclosed | Export confirmation (3 in 2b) when the project has more than Base; receipt naming the scenario |
| 24-26 Tables files | 2 | Already asks Scenarios Current/All | Keep the box; add the sentence about what All does and does not keep |
| 28-35 Pane export, copy, print, full report, run report, screenshot, Copy properties | 1 | One scenario's view, silent | Receipt line names the scenario; no dialog |
| 36 Copy curve points | 0 | Silent | No change |
| B1 Scenario workbook export | 3 | n/a | Receipt: export, not a save, not a sync |
| B2 Scenario workbook import | 3 | Compare and apply | Already the model; add "new project or this project" only if it ever can land in a new one |
| B3 Bentley import | 3 | n/a | Landing is a new project (the model differs); compare-and-apply report is not possible into a new project, so the receipt lists what Bentley held that this page did not keep |

## Part 3. Draft English

Standard professional technical English. Check for a checkbox, click for a button, choose in menus,
Select on the map. No em dash. A placeholder in braces is filled by the page.

### Import wizard

- Title: `Import {format}: {file}`
- Lead (level 1 format): `{Format} holds one set of values and no scenarios. Choose where to put them.`
- Lead (survey points): `Each point becomes a node. Choose where the nodes go.`
- Q1 heading: `Put them in`
  - `A new project`
  - `This project, {project}`
- Q2 heading: `Scenario`
  - `{scenario}, open now`
  - `A new scenario, child of {scenario}` with a name field `Name of the new scenario`
  - `Base. Every scenario inherits Base, so this changes them all.`
- Q3 heading (Basic mode off): `Alternative for {category}`
  - `{scenario}'s own alternative`
  - `A new alternative, child of {parent}` with `Name of the new alternative`
  - `The Base alternative`
- Preview, values: `This will change {n} values on {m} assets in {scenario}. Nothing changes until you click Apply.`
- Preview, nodes: `This will add {n} nodes to {scenario}. In Base they will be inactive.`
- Buttons: `Apply`, `Create project`, `Cancel`
- Receipt: `Imported {file} into {scenario} of {project}: {n} values changed, {k} assets added. Undo reverses it in one step.`
- Receipt, new project: `Imported {file} as the Base scenario of the new project {project}. {Format} holds no scenarios, so there is only Base.`
- Receipt, project-level data: `Imported {n} shapes from {file}. They appear in every scenario.`
- Receipt, libraries: `Imported {n} library items from {file}. Every scenario can use them.`
- Tables paste receipt: `Pasted cells ({n}) into {scenario}. Cells not changed ({skipped}). {o} are now overrides of Base.`
  (The existing key is `lpn_pane_pasted`; this replaces its wording only when the open scenario is not Base.)

### Export confirmation (level 1 or 2 format, project has more than Base)

- Title: `Export {format}`
- Body: `{Format} holds one scenario. This project has {n} scenarios. The file will hold {scenario}: its own values, and Base's values where {scenario} has none. The other scenarios and all alternatives are not in the file.`
- Choice (only when the visitor wants another): `Scenario to export` with the project's scenarios, default the open one.
- Buttons: `Export`, `Cancel`
- Receipt: `Exported {file} from {scenario}. This is an export, not a save: this project is not connected to the file.`

### Export disclosure (level 3 or 4 format)

- Receipt: `Exported {file}: {n} scenarios and their alternatives. This is an export, not a save and not a sync. Changes made in the file come back only when you choose File, Import and review them.`

### Defect-fix sentences (do these first, part 4)

- `.inp` receipt, appended to `lpn_status_inp_exported`: `It holds the scenario {scenario} only.` (Base: `It holds the Base scenario only.` when other scenarios exist; nothing when only Base exists.)
- GeoJSON and DXF receipts: the same sentence.
- Survey points report, new first line: `The nodes were added to {scenario}. In Base they are inactive.` (nothing in Base)

## Part 4. Silent surprises, ranked

Ranked by how likely a visitor is to be wrong afterwards, and how much work is lost.

1. **Exports hand over one scenario and say nothing about the rest** (21, 22, 23). A visitor with six
   scenarios exports an `.inp` from Base and later imports it: it comes back as a new project with no
   scenarios at all, and nothing at either end said so. The only hint is the file name, and only
   outside Base. Fix: the receipt sentence above and the confirmation; small, no new storage.
2. **GeoJSON export can pair one scenario's inputs with another scenario's results** (22). Results
   come from `lastSolveResult` ("the results on screen", `geoJsonResults`); with Recalculate off
   the screen holds a stale snapshot of the scenario last calculated, while the values and the stored
   `scenario` name are the open scenario's. **Likely, not reproduced.** Fix: attach results only when
   they belong to the open scenario, or name the scenario they belong to. GeoJSON and DXF file names
   also lack the scenario that `.inp` has. **Built** (`scenario-receipt-browser-harness.js` R1, R2).
3. **Survey points imported in a scenario other than Base exist only there** (9). The nodes are
   inactive in Base; the visitor sees them, switches to Base, and they are gone. Nothing said which
   scenario received them. Fix: a first line in the report; later the wizard. **Built** (`lpn_survey_added_scenario`, R3).
4. **Tables paste into a scenario makes overrides without saying so** (18). A pasted column of 400
   diameters in Peak becomes 400 overrides; the notice counts cells but names no scenario and does
   not say they are overrides. Fix: the receipt wording above. **Built**: the notice names the scenario, says the values are overrides, and counts those added ("Overrides added (n)."); `import-export-receipts-browser-harness.js` F3.
5. **Full report, Run report and Calibration are tied to "the last run"** (31-33, 15). The file name
   and the comparison do not say which scenario that run was. Not traced to the row level. Fix: name
   the scenario in the file name and heading. **Built**: the Full report (box note, printed heading, CSV
   name), the Run report and the Calibration report name the scenario of the run (`_scn` on the last
   solve), only when the project holds more than Base; Base keeps the bare file name
   (`import-export-receipts-browser-harness.js` F1, F2, F4).
6. **A GeoJSON file this page wrote is "read as written" and its `scenario` property is ignored** (8).
   The scenario's values become Base of a new project with no mention. Folded into 7 and 8 under the
   standard (their receipt says "as the Base scenario").
7. **(Closed by Task 814: both may now land in the open project.)** The `.inp` and GeoJSON network imports could only make a new project (7, 8). Not silent, but a
   gap against Tom's brief ("current or new scenario/alternative, current or new project"). Needs a
   compare-and-apply engine (the workbook's) to land in an open project. See decision 2.

8. **The map picture, the printed table's PDF name and the table-pane export named no scenario** (34, 30, 28), and the DEM fill wrote elevations without saying where (20). **Built** (`scenario-io-names-browser-harness.js` N1-N3, D1).

None of 1 to 5 loses data; each lets a visitor believe the file or the project holds something it
does not. Fixes 1, 3 and 4 are sentences and cost no storage or consent change.

## Part 5. What the branches imply

- **`feat/sheet-sync`** is already the model for level 3 imports (compare, list, Apply, never delete,
  identity warning). It asks nothing about scenarios because the file names them. It needs only the
  export receipt (2b rule 4) and, once the wizard exists, no change.
- **`feat/sqlite-reader`** has no UI. Its import cannot land in an open project (the Bentley model
  differs in Presentation and positions), so its first landing is a new project, as in 7 and 8. The
  wizard's question 1 would offer only *A new project* there.
- **Task 752 step 3** (ODS/CSV into the current scenario) is the first user of the wizard: it is a
  level 0 import of scenario-dependent values. Build the wizard there, and apply it to 9 afterwards.

## Part 6. Decisions only Tom can make

**TOM'S CALLS, 2026-10-18:** 1. *"I approve."* (no confirmation when the project is only Base). 2. *"Yes."* An `.inp` or GeoJSON network MAY land in the open project, matching IDs and updating values, against the recommendation below. 3. *"I agree."* (the open scenario is the default). 4. *"Dialog, I say. It's a major event that deserves a major answer, I think, unless there are visible results like the opening of a new tab."* 5. *"I agree."* (no "sync" until a live link exists).

1. **Ask only when something would be lost?** The standard skips the confirmation when the project is
   only Base with no alternatives. *Recommend yes:* a visitor with one scenario has nothing to
   confirm, and a dialog on every export teaches them to click through it.
2. **May an `.inp` or GeoJSON network land in the open project?** Today they only make a new project.
   Landing in the open one means matching IDs and updating values (the workbook's engine), and a
   choice for IDs the project lacks. *Recommend not yet:* ship the wizard for survey points and table
   data first, and leave whole networks as new projects until a real user asks.
3. **When an import goes into this project, which scenario is the default?** *Recommend the open
   scenario*, never Base, with Base a labelled choice. This is what every edit already does.
4. **Is the receipt a status line or a dialog?** The standard puts it in the status line and the
   message log, and uses a dialog only for the loss confirmation. *Recommend that:* a dialog to
   dismiss after every export is the thing the 2026-09 menu complaints were about.
5. **The words "export" and "sync".** The standard says *an export, not a save and not a sync* in the
   level 3 and 4 receipt, and never uses "sync" for any command until a live link exists. *Recommend
   that:* it follows Tom's 2026-10-17 note that the workbook is a file, and Task 752's rejection of
   a live Sheets link. If he wants "Sync in" and "Sync out" as menu words later, the receipt changes
   with them.
