# Code audit, 2026-11-14

Scope: `js/lpn-*.js`, `js/looped-network.js`, `dev/scripts/`. Skipped by instruction: label halo painting,
the Net1 phone legend, the service-worker icon cache. Nothing was changed; every finding below was
reproduced with a node probe unless it says "suspicion". Probes were run against master `ac85c45ae`.

## Summary

| Kind | Count |
|---|---|
| Wrong result or silent data loss, reproduced | 5 (F1 to F5) |
| Near-copies of one rule, reproduced drift | 1 (F6) |
| Risky logic no harness calls | 2 (F7, F8) |
| Dead functions verified | 20 of the 24 candidates (4 are live) |
| Script defects | 1 (F9) |
| Suspicions (no concrete failing case) | 3 (S1 to S3) |

`sh dev/scripts/check_all.sh --fast` on this branch: no failures.

A differential fuzz of the built-in solver against the vendored EPANET 2.3.5 engine found no defect in the
solver (see "Checked, no defect"). The harm is in the `.inp` reader, the writer, and one validation rule.

## Findings, most harmful first

### F1. A Darcy-Weisbach or Manning `.inp` imports as Hazen-Williams, and re-exports as Hazen-Williams
`js/looped-network.js:47651-47655` (settings are a copy of the OPEN project's; `s.method` is never set from
`parsed.headloss`, which `js/lpn-inp.js:1621` does hand over); writer `js/lpn-inp.js:3633-3702`; message
`lib/lang.ec.en.php` `lpn_inp_drop_headloss` ("This page computes Hazen-Williams").

Failing cases (probe: import through `importInpFromFile`, then `lpnExportInp`):
1. File says `Headloss D-W`, pipes `... 1000 12 0.85 0 Open`, project open is H-W. Imported method stays
   `hw`; roughness 0.85 is read as a Hazen-Williams C. Re-export writes `Headloss  H-W` and the pipe row
   `P1 R1 J1 1000 12 0.85 0 Open`. The exported file now states a different physical model than the one
   imported. The import report does say the results will not match; the export says nothing.
2. The open project is D-W (`settings.method = 'dw'`) and the user imports an ordinary H-W file (Net1 style,
   C = 100). Method stays `dw`; C = 100 is read as 100 mm of roughness. No report at all, because the file
   is H-W. The solved heads are meaningless.
3. The stated message is false since the solver gained D-W and C-M: the page does compute them.

No harness imports a D-W or C-M file through `importInpFromFile` (`grep -l "D-W" dev/lpn-spike/*.js` gives
only `inp-update-harness.js`, which tests the refusal, and `session-harness.js`, which mutates a model).

Fix: in `docFromInp()` set `s.method` from `parsed.headloss` (`hw`, `dw`, `manning`) and drop the
`headloss-formula` report for a supported formula. Defect, merges on green for the method. Which roughness
unit a D-W file's numbers are in (millifeet in a US file, millimetres in an SI one) and whether the
Roughness selector moves with it **needs Tom's decision**; the export side already carries
`roughness-method` as a stated difference.

### F2. Tank MinVol and Overflow columns are dropped silently on import
`js/lpn-inp.js:975-1013` reads columns 1 to 5, and the volume curve at `r[7]`; `r[6]` (MinVol) and `r[8]`
(Overflow) are never read and no `drop()` is raised.

Failing case: `[TANKS]  T1 20 10 2 20 30 500 * YES` imports with `dropped = []` and a tank with no
`minVolume` or `overflow`; re-export writes `T1 20 10 2 20 30 0`. In an extended-period run EPANET uses
MinVol as the floor of the empty state and Overflow YES lets a full tank spill; the built-in run
(`lpn-native-run.js` slice 5) implements both but the page can never set them, so a file that states them
runs differently here than in EPANET. Only `native-eps-harness.js` exercises them, with hand-built models.
CLAUDE.md: "Import reports every difference, never drops silently."

Fix: read both into the tank (with tokens, like `minLevel`), and write them back; at minimum raise a
difference. The reading is a defect. Whether the page shows controls for them **needs Tom's decision**.

### F3. A PBV or GPV directly on a reservoir or tank is refused, though EPANET solves it
`js/lpn-solver.js:616-628` (`valve-on-fixed-head` is raised for every valve type except TCV).

Failing case: reservoir R (head 100 m) - GPV (or PBV, setting 5 m) - J1 - pipe - J2 (20 L/s). Raw EPANET
2.3.5 (`openH/initH/runH`) solves it: J2 head 94.76217. `lpnDiagnose` refuses it in both engines. With
the check filtered out, the built-in solver gives 94.76217 as well (94.7621653 vs 94.7621677). EPANET's own
error 219 applies to PRV, PSV and FCV only (a PRV in the same position gives EPANET error 200, as expected).
The code comment records the PBV/GPV refusal as deliberate, but CLAUDE.md says input is refused only when
EPANET itself refuses it ("No network goes to EPANET because the built-in solver lacks a feature").

Fix: restrict the check to PRV/PSV/FCV. Defect by the standing rule; **confirm with Tom** since the comment
shows it was a chosen line.

### F4. `;` inside a title or a label truncates it on import, and the writer produces exactly that text; titles 2 and 3 are dropped
`js/lpn-inp.js:407-416` strips from the first `;` before `tokenize()` sees a quote; `:1587-1589` keeps
only the first `[TITLE]` row; writer `:3237-3245` and `:3661` write the text unescaped.

Failing cases:
- `[LABELS]  5 5 "Zone A; north"` imports as text `Zone A`; `dropped = []`. A Text element "Zone A; north"
  exported from this page comes back as "Zone A".
- `[TITLE]` with three lines imports as line 1 only; lines 2 and 3 vanish, no report. A project named
  `Smith; phase 2` exports `Smith; phase 2` and re-imports as `Smith`.
No harness covers a `;` in a label or title (`inp-roundtrip-net3-harness.js` and
`inp-passthrough-harness.js` use EPA's files, which have neither).

Fix: for `[LABELS]` take the quoted text before cutting at `;` (the Delphi GUI does); keep all title lines,
or report the loss. Defect.

### F5. The default fluid viscosity differs between two places in the same codebase
`js/looped-network.js:79791` builds `visc: 1.007e-6 * (hyd.viscosity || 1)` (m2/s) for both engines'
model; `js/lpn-native-run.js:1813` uses EPANET's `VISCOS = 1.1e-5` ft2/s, which is 1.0219e-6 m2/s.
The bridge `js/lpn-epanet.js:932` writes `Viscosity` only if the file stated one, so EPANET runs at 1.0219e-6
while the built-in hydraulic solver runs at 1.007e-6 (1.5 % apart; laminar friction scales directly).

Measured (single D-W pipe, native vs EPANET head loss): 2 L/s, 100 mm, e 0.05 mm, 500 m gives 0.4249 m vs
0.4258 m; 0.5 L/s, e 0.15 mm gives 0.0386 vs 0.0387. In 150 random D-W networks the heads differ by up to
0.2 m on 50 m of loss, while 250 random H-W networks agree to 0.005 m. Equalising the viscosity does not
remove the difference (see S1), so this is one cause, not the whole gap.

Fix: one constant, EPANET's, used by both. Defect (the stated aim is to mirror EPANET).

### F6. Three copies of rules that must change together
- `lpnDwFriction` (`js/lpn-solver.js:76`) and `bpnDwFriction` (`js/branched-network.js:35`): byte-identical
  bodies today; the comment says "change both together".
- valve type to setting unit (PRV/PSV/PBV pressure, FCV flow, else none): `valveSettingUnit()`
  (`js/lpn-inp.js:1284`), `libAnnotateControl()` (`js/looped-network.js:70245`), and the `lpn-time.js:318`
  reader. Consistent today; re-annotation on a type change exists (`looped-network.js:7753, 41433, 41814`),
  so no failing case.
- default viscosity: F5.
Fix: one exported function each. Defect-class tidy; low urgency.

### F7. Risky logic no harness calls
- `EngCalcs.lpnPatternValuesAt`, `lpnPatternAppend` (`lpn-patterns.js:113, 47`): no caller anywhere (dead, below).
- `docFromInp()` settings merge (`looped-network.js:47651`): no harness imports a file whose `[OPTIONS]`
  headloss differs from the open project's (F1).
- `lpn-tablefile.js` writers (zip, ODS, XLSX): searched `dev/`; two harness files name the module
  (`grep -l lpn-tablefile`). Not exercised for sheet names with 31+ characters or non-BMP glyphs. Suspicion only.

### F8. Pump dead-ended downstream of a negative-pressure node: built-in and EPANET disagree
Fuzz seed 2406056534: pump on a dead-end junction with zero demand, upstream head -3.7 m (junction 15 m
above its elevation datum, a network that is already broken). Built-in J4 = J1 head (pump treated as
shut), EPANET J4 = J1 + 20.0 m (shutoff head). With sane pressures both agree (4 demand levels probed).
Not a visitor-reachable defect on a sound network; listed so nobody rediscovers it. Needs no action.

### F9. `key_hygiene_walk.inc.php` reports live functions as unreachable
`dev/scripts/key_hygiene_walk.inc.php` (`ecJsFunctionUnits`/walk): of the 24 "reached from nothing" rows,
`wireProfileHover` is a named IIFE (`looped-network.js:27760`, runs at load) and `profileHoverSet` is called
from it; `paneQuoteCell` (`:34256`) is called from `paneCopyTsv` (`:34274`), which is live. A person acting
on 1b would delete working code. The finding-1b list is also never printed, only counted; the list below was
produced by running the walk and printing `$walk['dead']`.
Fix: print the names (file:line) and treat `(function name() {...}())` as called. Defect (tooling).

## Suspicions (no concrete failing case)

- S1. D-W native vs EPANET residual of ~0.03 % in a single pipe at Re 3e5 that matches neither viscosity;
  the friction formula is identical on paper (`lpnDwFriction` vs hydcoeffs.c). Not traced.
- S2. `lpn-native-run.js` `maxIter` default is 100 when the file has no `Trials`, EPANET's is 40
  (`lpn-solver.js:776`); only the count of trials in the report can differ. Harmless on a converging network.
- S3. `lang_parity_check.php` is not in `check_all.sh`: 64 recent `lpn_` keys are missing from all 26 other
  language files today (`lpn_wtg_export_*`, `lpn_inpalt_*`, `lpn_diag_*`...). Documented as waiting for a
  sprint; no check fails on it. If that is intended, nothing to do.

## Verified dead functions (the 24 candidates of key_hygiene finding 1b)

Method: ran the walk and printed `$walk['dead']`; for each name, `grep -rnw` over `js/ lib/ *.php dev/`
(including harnesses, PHP-rendered pages, `.sh`, `.json`) with comments read by eye.

| Function | File:line | Verdict |
|---|---|---|
| `EngCalcs.tipPlain` | Calculators.lib.js:142 | dead |
| `EngCalcs.readTableInputs` | Calculators.lib.js:1493 | dead |
| `EngCalcs.writeTableData` | Calculators.lib.js:1517 | dead |
| `scnDefaultPattern` | looped-network.js:8213 | dead (one comment mentions it) |
| `worldMapPlacementKept` | looped-network.js:22127 | dead |
| `findAstHasConnection` | looped-network.js:25492 | dead (calls only itself) |
| `wireProfileHover` | looped-network.js:27760 | LIVE: named IIFE |
| `rpaneIsOpen` | looped-network.js:28355 | dead, kept on purpose (comment at 59535; `dom_id_resolve_check.php` quotes it) |
| `openRightPane` | looped-network.js:28421 | dead from the page; `panel-touch-harness.js:430` lists it in a source-text assertion |
| `toggleRightPane` | looped-network.js:28431 | dead, kept on purpose (comment at 59536) |
| `paneCellValue` | looped-network.js:31444 | dead |
| `paneQuoteCell` | looped-network.js:34256 | LIVE: `paneCopyTsv` calls it |
| `profileHoverSet` | looped-network.js:37223 | LIVE: called by `wireProfileHover`; `profile-chooser-harness.js:105` too |
| `projectIsEmpty` | looped-network.js:43100 | dead (comment at 58163 warns against reinstating it) |
| `pickGeoFile` | looped-network.js:50175 | dead |
| `matchColName` | looped-network.js:60721 | dead |
| `cornerHelp` | looped-network.js:68400 | dead |
| `textEditorOpen` | looped-network.js:77614 | dead |
| `scenarioTimeText` | looped-network.js:79436 | dead |
| `smTip` | looped-network.js:86424 | dead |
| `sanitizeFilename` | looped-network.js:88043 | dead |
| `EC.lpnPatternAppend` | lpn-patterns.js:47 | dead |
| `EC.lpnPatternValuesAt` | lpn-patterns.js:113 | dead |
| `EC.lpnTerrainContourConsentText` | lpn-terrain.js:430 | dead |

Dead: 20 (two are deliberately parked, `rpaneIsOpen` and `toggleRightPane`; `openRightPane` is reached only
through them). Live: 3 (`wireProfileHover`, `profileHoverSet`, `paneQuoteCell`). Deleting any dead
function that holds a visitor string should be paired with a key decision (`key_hygiene_check.php`, 1b).

## Checked, no defect found

- Built-in solver vs vendored EPANET 2.3.5, random networks (4 to 8 junctions, loops, minor losses, CV and
  closed pipes, TCV/PRV/PSV/FCV/PBV/GPV, pumps, emitters, negative demands): about 750 runs. H-W: heads agree
  to 0.005 m. Every larger difference was either a network already at negative pressure with an unbalanced
  EPANET answer (EPANET's own flows fail continuity at a junction by 0.9 L/s while reporting converged), or
  F5/F8. Probe: scratch, not committed.
- `FLOW_UNITS` in `lpn-inp.js` against `$ec_units` in `lib/Units.lib.php`: all ten flow units agree to
  the last digit.
- `lpnParseTime`, `lpnPatternIndex`, calibration statistics (`lpn-calib.js`): read, match EPANET's rules.
- Node IDs are case-sensitive in both our reader and EPANET (a probe with `j2` vs `J2`).
- `dev/scripts/check_all.sh` runs every non-retired `*_check.php`; the ones not named in it are the
  documented retirements (selftests, 2026-10-29) plus `friction_check`, `backtranslate_check`,
  `lang_parity_check` (sprint tools).

## Not checked

`lpn-native-msx.js`, `lpn-wtg-export.js`, `lpn-geojson.js`, `lpn-dxf*.js`, `lpn-survey.js`, `lpn-ramps.js`,
`lpn-contour.js`, `lpn-criticality.js`, `lpn-collide.js` (labels), `lpn-geom.js`, `lpn-georef.js`; extended-period
runs against EPANET (energy, tank levels, rules; relied on `native-eps-harness.js`); everything in
`js/looped-network.js` outside `docFromInp`, the `[TANKS]`/`[VALVES]`/`[OPTIONS]` readers and the unit edge;
the `.net` reader; PHP-side checks beyond reading `check_all.sh` and a few scripts for blind globs
(none found: every shipped `*.php` and `js/*.js` sits under a scanned glob, apart from
`spreadsheet/Manning-Pipe-Flow.php`, a redirect stub).
