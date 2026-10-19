# EPANET-MSX: disclosure audit and scope (Task 717)

Written 2026-10-17 (MST) for Tom. Nothing here changes a public string; every wording below is a
proposal for his call. Tags: **OBSERVED** (read in this tree or run here), **CITED** (fetched from
the named source today), **RECALLED** (from the MSX documentation as the author remembers it, not
re-fetched; verify before it becomes a public sentence), **SPECULATION**.

Tom, 2026-10-17: *"since it's an undisclosed EPANET parity issue."* Tom, 2026-09-26: *"This is an
extension, not base EPANET. We can provide this, but it's not a blocker for EPANET++."*

## Headline findings

1. **The vendored engine already contains MSX.** OBSERVED: `js/vendor/epanet-js.js` (epanet-js
   0.9.0) exports all 32 `MSX*` functions from its embedded WASM and wraps them as `msxOpen`,
   `msxSolveQ`, `msxGetQual` and so on. Run in Node against `Net1.inp` with a one-species chlorine
   decay `.msx` file, `msxOpen` parsed it, `msxSolveQ` ran, and `msxGetQual` returned
   concentrations (junction 11: 0.545 mg/L; tank 2: 0.00009 mg/L). Probe files:
   `/tmp/claude-1000/-home-haws-webdev-hawsedc-com-engcalcs/dd63908e-063f-45c8-b9b4-af8e811d99f7/scratchpad/msx/`.
   So Phase 2 below needs no new download and no new licence.
2. **Import cannot silently mislead about the `.inp`, but a visitor with an MSX study is not
   told about the `.msx`.** An MSX study is two files: an ordinary `.inp` and a separate `.msx`.
   The importer only ever sees the `.inp`. OBSERVED: no `msx` string anywhere in `js/lpn-*.js`,
   `Looped-Network.php` or the language files; the picker is `accept=".inp,.net,text/plain"`
   (`Looped-Network.php:224`). Nothing in the `.inp` names the `.msx`, so the report has nothing to
   say. The import report's promise, "no data in the file is discarded", stays literally true, and
   the page's promise, "it tells you every difference it found", is true of the file it was given.
   The gap is the second file. SPECULATION on the visitor: a reader who has an MSX study and
   sees a clean import with water quality "None" may believe the study came across.
   (An `.msx` chosen through "all files" would fall to `lpn_inp_bad_file`, "could not be read as
   an EPANET network file". Read from the code, not run.)
3. **The repo's own internal rule needs the same qualification:** `dev/looped-network-calculator-scope.md:91`
   says "Multi-species (EPANET-MSX) stays cut", and `CLAUDE.md` says import "never drops silently".
   Both stay accurate only while the `.msx` is understood to be a different file.

## Part 1. Disclosure audit

Every place that states or implies EPANET parity, compatibility, completeness, or that water
quality is whole. Ordered by how much a reader could be misled. "Public" means a visitor sees it.

| # | Where | Exact text | Why MSX touches it | Proposed wording |
|---|---|---|---|---|
| 1 | `lib/lang.ec.en.php:2638-2649` (`lpn_notes_2_term` "What it does not do", `lpn_notes_2_def`), public, in the page's Notes | "Surge and water hammer are not modeled: all results are for steady or slowly varying flow, ..." | This is the one list on the page where a visitor looks for omissions, and it names exactly one. The comment above it says lengthening it is Tom's call. | Append a sentence: "Multi-species water quality (EPANET-MSX) is not modeled. Water age, source trace, and one reacting chemical are." | TGH: No. This task corrects the omission.
| 2 | `lib/lang.ec.en.php:2349` `lpn_inp_report_lead`, public, top of every import report | "This page does not use every EPANET feature, but no data in the file is discarded." | True of the `.inp`. A multi-species study keeps its reactions in a second file this page is never given, so "no data in the file is discarded" can read as "nothing of my study was lost". | "This page does not use every EPANET feature, but no data in the file is discarded. A multi-species water quality model (EPANET-MSX) is stored in a separate .msx file, which this page does not read." | TGH: No. This task corrects the omission.
| 3 | `~/webdev/librewaternet.org/index.html:144`, public | "Open an EPANET `.inp` file and it tells you every difference it found rather than ignoring anything quietly." | Same as 2: the sentence is about one file. | "...every difference it found in that file rather than ignoring anything quietly. It does not read the separate .msx file of an EPANET-MSX multi-species model." | TGH: No. This task corrects the omission.
| 4 | `~/webdev/librewaternet.org/disclosures.html:59-70`, public | "Extended period simulation, water age, source trace, chemical decay, pump energy ... run through the EPANET engine ... The interchange format is EPANET's. We read and write EPANET's own `.inp` file, from [TITLE] to [END] across the sections we support" | "The interchange format is EPANET's" is complete for base EPANET; MSX is a second interchange format (`.msx`) EPANET-MSX users exchange. "chemical decay" reads as the whole of water quality. | After "chemical decay" insert "of one chemical". After the `.inp` sentence add: "We do not yet read the .msx file of the EPANET-MSX multi-species extension." | TGH: No. This task corrects the omission.
| 5 | `~/webdev/librewaternet.org/features.html:158` and `dev/features-source.md` (Task 566 row), public | "Water quality: age, share from a source, chemical decay." | Fine as a list, but a reader tallying against EPANET sees no limit. | "Water quality: age, share from a source, decay of one chemical (not multi-species EPANET-MSX)." | TGH: No. This task corrects the omission.
| 6 | `~/webdev/librewaternet.org/screenshots.html:94`, public | "(Chemical analysis is now implemented.)" | "Chemical analysis" with no qualifier. | "(Analysis of one reacting chemical is now implemented.)" | TGH: No. This task corrects the omission.
| 7 | `~/webdev/not-epanet.org/index.html:125-127` and `:119` region, public | "Everything an `.inp` can carry still round-trips through one" and "We read and write EPANET's own `.inp` file, from [TITLE] to [END] across the sections we support" | True. Same second-file gap as 4; this page's whole job is honesty, so it is the page a reader quotes. | Add to the "sections we support" sentence: "An EPANET-MSX model keeps its multi-species definitions in a separate .msx file, which we do not read." Its `CLAIMS.md` ledger gets a matching row. | TGH: No. This task corrects the omission.
| 8 | `lib/lang.ec.en.php:2371` `lpn_inp_drop_quality` and `:3891` `lpn_settings_quality_track_tip`, public | "Choose a chemical under Settings, Calculation, Quality" ; "or a chemical that reacts as it travels. Only a chemical needs coefficients." | Both say "a chemical", singular, which is accurate and is the honest hook. No change needed; if Tom wants the limit stated where the visitor chooses, extend the tip (below). | Optional, on 3891: "...or one chemical that reacts as it travels. Several interacting species need EPANET-MSX, which this page does not run." | TGH: No. This task corrects the omission.
| 9 | `lib/lang.ec.en.php:639-640` `lpn_main_title`, `lpn_main_desc`, public (page title, search snippet) | "Free Online Water Distribution Network Modeling with the EPANET Solver" ; "...Import EPANET Files" | Describes the engine and the file type; makes no completeness claim. Checked clean; MSX does not falsify it. | None. |
| 10 | `~/webdev/librewaternet.org/epanet.html:59-62` | "... the fate of a chemical or of the water's own age" | Describes EPANET itself. Clean. | None. | 
| 11 | `lib/lang.ec.en.php:2380` `lpn_inp_drop_quality_options` | "Water age, source trace, and a chemical are each computed here" | Accurate. Clean. | None. | OK.
| 12 | `dev/looped-network-calculator-scope.md:91`, `dev/agents/market-researcher/epanet-gap-audit.md:71,138` (internal) | "Multi-species (EPANET-MSX) stays cut" ; "MISSING ... genuinely absent" | Internal; correct today, to be rewritten in place when 717 builds. | Rewrite when phase 1 lands. | OK.

`dev/positioning.md` needs no change: its rule ("never write a completeness claim against EPANET")
already forbids the failure; the audit found no sentence that breaks it outright. The exposure is
omission, not assertion: rows 1 to 7 are true and silent about the one extension an expert would
look for. Row 1 is the cheapest single fix, since a visitor looking for limits looks there.
The 26 translations of rows 1, 2 and 8 would be regenerated by the orchestrator; sibling-site
edits (3 to 7) are separate commits in those repositories and are Tom's call as public claims.

## Part 2. Scope

### What EPANET-MSX is
RECALLED (EPA/600/R-07/088, "EPANET-MSX User's Manual", Shang, Uber and Rossman, 2008): an
extension to EPANET 2 that models any number of interacting chemical and biological species, in
the bulk water and on the pipe wall, with user-written reaction kinetics. EPANET's own quality
engine handles one species with first-order reaction; MSX replaces it with a general
reaction-system solver (chloramine decay and nitrification, disinfection by-products, biofilm).
It reads the hydraulics EPANET computes and solves transport and reaction on top, through the same
Lagrangian time-driven scheme as EPANET quality (SPECULATION on the last clause).

The model is a **separate `.msx` text file**, sections RECALLED:
`[TITLE]`; `[OPTIONS]` (`AREA_UNITS`, `RATE_UNITS`, `SOLVER` EUL/RK5/ROS2, `COUPLING` NONE/FULL,
`TIMESTEP`, `RTOL`, `ATOL`, `COMPILER`); `[SPECIES]` (BULK or WALL, name, mass units, tolerances);
`[COEFFICIENTS]` (`CONSTANT` and `PARAMETER`); `[TERMS]` (named sub-expressions); `[PIPES]` and
`[TANKS]` (a `RATE`, `FORMULA` or `EQUIL` expression per species); `[SOURCES]` (CONCEN, MASS,
FLOWPACED, SETPOINT, with a pattern); `[QUALITY]` (initial `GLOBAL`/`NODE`/`LINK` values);
`[PARAMETERS]` (per-pipe and per-tank overrides); `[PATTERNS]`; `[REPORT]`. It names nodes and
links by the IDs in the `.inp`, so it cannot stand alone.

### Library and licence
CITED (GitHub, fetched 2026-10-17): `github.com/OpenWaterAnalytics/epanet-msx`, "the multi-species
extension to the EPANET hydraulic analysis engine", **MIT licence**, OWA organisation. MIT is
GPL-3-compatible, the same standing as the vendored OWA-EPANET (`js/vendor/README.md`). The
fetched page gave no version number and did not mention OWA-EPANET 2.3.

### Does a JS/WASM build exist?
OBSERVED, and the answer is yes, already in this tree: epanet-js 0.9.0 gates the wrappers on
`_hasMsxSupport`, which is `this._EN._MSXclose !== undefined` (`js/vendor/epanet-js.js:3651-3657`).
It is true in the vendored build (run: `hasMsx true`, `version 20305`, 32 MSX exports). The
exported surface covers the whole life cycle: `msxOpen(file)`, `msxUseHydFile`, `msxSolveQ`,
`msxInit` / `msxStep` (stepwise), `msxGetQual`, `msxGetSpecies`, `msxGetSource`,
`msxSetSource`, `msxSaveMsxFile`, `msxReport`, `msxClose`. Whether the user-written expressions
need a compiler: the `COMPILER` option is for generating native code and cannot exist in WASM;
the probe used the default expression parser and ran, so the interpreted path works
(SPECULATION that every option behaves, until a harness proves it). Not re-verified: whether
epanet-js's MSX build was linked against a current epanet-msx (version unknown).

Run recipe that worked (Node, `Project` from the vendored module): write both files to the
engine's in-memory filesystem, `p.open(inp, rpt, out)`, `p.solveH()`, `p.saveHydFile('h.hyd')`,
`p.msxOpen('cl.msx')`, `p.msxUseHydFile('h.hyd')`, `p.msxSolveQ()`, then
`p.msxGetQual(nodeOrLinkType, index, speciesIndex)` (value at the end of the run; stepwise via
`msxInit`/`msxStep` for a time series).

### Phases
**Phase 0, wording (hours).** Tom decides rows 1 to 7. Rows 1 and 2 are two strings (26-language
payload regeneration, orchestrator only); 3 to 7 are sibling-repo edits.

**Phase 1, carry the `.msx` verbatim, say so (about 2 to 4 days).** No new solver. The
file-is-canonical rule applies: the user's `.msx` characters are theirs. Attach it to an open
project (an `.msx` has no meaning without its `.inp`): a File, Import row beside the EPANET one,
store the text on the project (`serializeProject()`, modelling data, not browser data), write it
back beside the `.inp` on export (the existing zip export already bundles a picture and a world
file), and report "kept, not run" in the import report. Because `.msx` names node IDs, report any
ID absent from the network. Cost: one picker, one project field and migration, one exporter
branch, 3 to 5 English strings, one harness (round trip byte-identical, Net1 plus a stock MSX
example). This alone retires rows 2 to 4 as a silent gap and sets up Phase 2.

**Phase 2, run it through the vendored WASM (about 2 to 3 weeks, its own branch).** The engine is
already present, so the work is ours: an MSX transport next to `lpn_toolbar_run` (hydraulics via
the existing EPANET path, then `msxUseHydFile`/`msxSolveQ`), a results model keyed
node/link x species x time, and the display of those results: colouring and the Tables pane by
species, species and time-series in Graph. Largest unknowns: unit handling (species mass units are
free text such as `MG`, `UG`; MSX takes the engine's internal flow units, so the number-fidelity
rule needs a decision before code), tank mixing models under MSX, and the validation set
(EPA's MSX examples reproduced against published output, matching EPANET quality for a
single-species decay as a cross-check, the way `native-valve-harness.js` matched valves).
MSX is EPS-like by nature, so it depends on `js/lpn-time.js`.

**Phase 3, native (Task 733's long road).** Not scoped. Writing a species reaction ODE solver
(Euler, RK5, Rosenbrock) and a general expression evaluator natively is a research task; the
built-in solver stays one instant (`CLAUDE.md`). SPECULATION: do not start until Phase 2 has users.

### Fit with Tom's UI sketch
*"Settings, Quality holds a short list of parameters with toggles plus an open-ended list of
reactive species, no scarier than Custom Properties."* Today `Settings > Calculation > Quality`
chooses None, Age, Trace or Chemical (`lpn_settings_quality_track_tip`, line 3891). Suggested
fit, SPECULATION: add a fifth choice, Multi-species, which reveals the species list; each species
is a row (name, bulk or wall, units, initial value, tolerances), like a Custom Property row. The
reaction expressions are the frightening part, so Phase 1 keeps the `.msx` as a text pane the user
pastes or imports, and a later phase turns the `[PIPES]`/`[TANKS]` expressions into a form that
a structured row can edit. A "kept, not run" state in Phase 1 maps onto the same row without a
second design. Vocabulary follows EPANET-MSX itself: species, bulk, wall, coefficient, term. Do
not invent plain-English substitutes (`CLAUDE.md`). The word "chemical" in the current UI would
need splitting from "species" ("when one name does two jobs, split it").

### Recommendation
Do Phase 0 and Phase 1 first. Phase 0 is the part Tom's own promotion asked for; Phase 1 closes
the only silent route (a second file nobody reads) for days, not weeks, and its round-trip harness
is the thing Phase 2 will need anyway. The finding that the engine is already vendored turns
Phase 2 from "find and license a WASM build" into "wire and display".
