# A fixed-open TCV, scenario overrides, pump energy with prices, and MSX over changing settings, against EPANET's own engine (audit 3, 2026-11-20)

Follows `eps-settings-tanks-vs-epanet-2026-11-18.md` (audit 2). Same method: the vendored OWA-EPANET 2.3.5 (`js/vendor/epanet-js.js`) driven directly (RAW), beside the
page's EPANET bridge (BRIDGE) and the built-in loop (NATIVE), at every reporting time, same tolerances. Script: `node dev/lpn-spike/eps-audit-vs-epanet.js [--one=<file>]
[--scenario=<json>] [--msx=<file>]`. Gate: `node dev/lpn-spike/eps-audit-fixtures-harness.js` (now 11 fixture runs, 2 scenario runs, 5 MSX runs; picked up by `run_harnesses.sh`).
EPANET source: 2.2 C source (`hydcoeffs.c`, `hydraul.c`, `output.c`, `report.c`), and EPANET-MSX `msxqual.c`.

## What was covered

| Item | Network | What was compared |
|---|---|---|
| 1. A TCV fixed open | `valves2.inp`, `valves3.inp` (TCV minor loss 2: opened by a control and a rule; stated Open in `[STATUS]`) | the original file against the page's export, then both engines against the export |
| 2. Scenario override of pump speed | `pumps.inp` + `pumps.speed.scn.json` (PU1 1.0 to 1.15 with a speed pattern, PU2 unstated to 0.8) | both engines, in the scenario, against EPANET on the ORIGINAL file with the two numbers written in by hand |
| 2. Scenario override of tank Can overflow | `tanks.inp` + `tanks.overflow.scn.json` (T2 and T4 YES to NO, T1 unstated to YES) | the same |
| 3. Pump energy with prices | `energy.inp` (global price and price pattern, per-pump price, per-pump price pattern and efficiency curve, demand charge, a pump stopped by a control and a time control); also `pumps`, `pumps2`, `valves*` | per pump usage, efficiency, kWh per m3, average and peak kW, cost per day, demand charge, total, against the engine's energy block of the ORIGINAL file, for the built-in summary and the bridge's |
| 4. MSX with settings changing | `changing.msx` (two bulk species: decay and a MASS source at the reservoir; one wall species) over `pumps`, `pumps2`, `valves`, `valves2`, `tanks` | every species at every node and link at every reporting time, the engine's own MSX (bridge) against the built-in loop |

## What agreed (with numbers)

- **Scenario overrides, both engines.** Pump speed: BRIDGE and NATIVE heads 2.0e-12 m and 5.5e-13 m, flows 1e-7 m3/s, status differences 0, pump speed 0 difference, over 49 times; the override moves the
  network by 16 m of head, so the agreement is not two unchanged runs. The page's export of the scenario against the hand-edited file: 5.0e-13 m. Tank overflow: levels 1e-13 m, tank volume 1.2e-11 m3,
  status differences 0; the override moves heads/volume by 1.8 m. A speed pattern with a stated speed overridden (PU1) matched EPANET, so the pattern value replaces the speed, as the page has it.
- **Pump energy with prices, both engines, against the ORIGINAL file** (`energy.inp`, 48 h): built-in summary per pump columns within 4e-8 relative, cost per day 1.9e-8, demand charge and total per day inside
  tolerance; bridge pump cost 3.9e-8 and demand charge 4.6e-8 relative. Per day costs: PU1 141.15, PU2 6.04, PU3 64.59, demand charge 1140.54 (peak of the summed power times 12 per kW). The same agreement holds
  on `pumps2`, `valves2`, `valves3`, `pumps` (except PU3, below). Price patterns, per-pump price, per-pump pattern, per-pump efficiency curve and the global efficiency all pass. The original file and the page's
  export of it run alike (1.2e-11 m): nothing in `[ENERGY]` is dropped.
- **The demand charge: 116.04 is right, 1392.49 is EPANET's report printing it twice** (settled from source, see finding 3).
- **Everything of audit 2 still agrees** (all nine fixtures clean after the fixes below).

## Findings

| # | Finding | Class | Status |
|---|---|---|---|
| 1 | A TCV's stated minor loss was lost when a control, rule or `[STATUS] Open` fixed it open (8.2e-2 m in `valves2`, 1.6e-1 m in `valves3`, both engines) | defect in ours | **fixed** |
| 2 | Scenario overrides of pump speed and tank overflow | audit | no defect; fixtures added |
| 3 | EPANET 2.2's printed demand charge is the charge per kW applied twice | defect in EPANET's report, not ours | recorded and pinned |
| 4 | A pump stated `SPEED 0`: Open to EPANET (counted as online), Closed to the page | known difference | open |
| 5 | A TCV's stated minor loss could be edited nowhere on the page (no box for a TCV) | limitation | **fixed**: Properties and the Valves table show the existing Minor loss row and column for a TCV; Change type carries it |
| 8 | The warm EPANET path rewrote every valve's setting, so a fixed-open valve of any type (PRV, PSV, FCV, TCV) started regulating again (valves3 steady solve: 1.1e+1 m off the built-in solver) | defect in ours | **fixed** (`pushValues()` skips the setting for `valveFixed: 'open'`); `eps-audit-warm-harness.js` |
| 6 | MSX over changing settings: the two engines part ways, up to 5.8e-2 mg/L on a 1.0 to 1.2 mg/L species | difference, cause not found | open |
| 7 | MSX CONCEN source at a reservoir: the engine adds none, the built-in loop adds it | difference | open |

### 1. A fixed-open TCV (fixed)

Source: `hydcoeffs.c` `tcvcoeff()` replaces `link->Km` by `0.02517 * setting / d^4` only `if (hyd->LinkSetting[k] != MISSING)`; with the setting MISSING it uses `Km` as read, and `input3.c`
`valvedata()` reads the `[VALVES]` minor-loss column into `Km` for a TCV like any valve. `hydraul.c` `setlinkstatus()` sets the setting to MISSING for any valve type above PUMP except GPV whenever a control or rule sets
the status OPEN or CLOSED, and `[STATUS] Open` does the same at input. So the page's earlier claim (and audit 2's) that EPANET "ignores the minor-loss column for a TCV" was only true while the TCV regulates;
a fixed-open TCV's whole loss is that column.
Fix, one rule in the shared code: the importer keeps the TCV's stated column in `k` (it stored 0) and treats `[STATUS] Open` on a TCV as it does on a PRV, PSV, FCV and PBV (`valveOpen`, then `valveFixed: 'open'`);
`EngCalcs.lpnLinkK` (`js/lpn-solver.js`) returns the stated `k` for a TCV with `valveFixed: 'open'` and the setting otherwise; the built-in loop starts a stated-Open TCV with no setting and applies
`valveFixed: 'open'` to one a control or rule has opened (`js/lpn-native-run.js`, where it had set the setting to 0); both exporters write the TCV's `k` into `[VALVES]` and `Open` into `[STATUS]`
(`js/lpn-inp.js`, `js/lpn-epanet.js`; the bridge's warm path writes `l.k` too). Export of a TCV with `k` 0 is unchanged, so Net1, Net2 and Net3 (no TCV) are character-exact as before.
Proof: `valves2` original-vs-export 8.2e-2 m to 0.0; `valves3` 1.6e-1 to 0.0; NATIVE and BRIDGE clean. Harness against the earlier code: `valves2` and `valves3` fail on original-vs-export (8.2e-2, 1.6e-1 m), `valves3` also on the
built-in energy (the fixed-open TCV changes the pump's duty).

### 2. Scenario overrides (no defect)

The page path (createScenario, `setProp` of `speed` and `overflow`, `assembleModel`) feeds both engines the scenario's value. The reference is the ORIGINAL file with the same change typed in by hand,
never our export of the scenario, so a defect in the export or in the override cannot hide. Both fixtures also prove the override matters (`scenarioMoved` 16 m and 1.8 m). One setup note: the reference states PU3
(stated `SPEED 0`) Closed, which is how the page exports it (finding 4); without that line the two disagree on that pump alone.

### 3. The demand charge (EPANET's report double counts)

`output.c` `saveenergy()` ends with `hyd->Emax = hyd->Emax * hyd->Dcost;` and writes that to the binary file, so the binary demand charge is peak kW x charge (1140.54 here = 95.05 kW x 12). `report.c` `writeenergy()` then
prints `hyd->Emax * hyd->Dcost` and adds the same to the total, with `Emax` already multiplied: the report shows charge-squared. Measured in the vendored engine: the printed demand charge is 13686.52 (= 1140.54 x 12) and the total
13898.31; the handoff's PU1 case (peak 9.67 kW, charge 12) prints 9.67 x 144 = 1392.49, while 9.67 x 12 = 116.04, the page's figure, and the binary block's. The page and the built-in loop compute the binary figure.
Not a defect of ours; the fixtures harness pins the engine's printed figure as twelve times its binary one so the day the engine is fixed, this record is revisited. WaterGEMS's 3.87 (116.04 over a 30-day billing period) agrees with the single count.

### 4. A pump stated SPEED 0 (open, known)

EPANET leaves a pump stated `SPEED 0` Open at speed 0: no flow, but its time on line, average kW and kWh per m3 are counted over the whole time it stands open (`pumps.inp` PU3: usage 83.3 percent against the page's 20.8,
average kW 7.60 against 30.4; energy and cost agree, since power is zero while it stands). The page closes it, as `assembleModel` does for a stated speed of 0 (the page offers no speed 0), so status shows Closed, headloss 0 where
EPANET reports 84 m, and the usage factor differs. Cost, total energy and flows agree. The scenario fixture and the energy rows of `pumps` carry this by name.

### 5. A TCV's stated minor loss (fixed)

The popup and the Valves table now draw the existing Minor loss row and column for a TCV, with the existing label and tip, and Change type carries `k` across like any valve.

### 6. MSX with settings that change (open, difference found, cause not found)

`changing.msx` on the five fixtures. Clean: `valves` (all valve types moved by controls and rules, 1.5e-5), `tanks` (4.5e-5). Differing: `pumps` 8.1e-3 (a MASS-source species, front arrival after a pump
stops, 50 percent of a small value, J1 at 5 h), `pumps2` 7.2e-4, `valves2` 5.8e-2 (link PBV1 at 30 h; CL2 on a 1.2 range). The first difference in `valves2` is at 1 h on the link PBV1 only: the engine reports the quality of one end node
(F, 1.1076) where the built-in loop reports the mean of its two end nodes (1.1452), as `msxqual.c` `MSXqual_getLinkQual()` does for a link holding no volume; the nodes themselves agree at 1 h. The vendored engine does not follow that main-branch source on a
no-flow valve link. Node values then part ways by 1 to 2 percent from 5 h on, after valves open. Hydraulic record times were checked identical on `pumps`, so the cause is in the species transport, not the hydraulics. Not diagnosed further; recorded as a ceiling in the
harness (`MSX_CEILING`), so a change that makes it worse fails. Net3's 3e-4 tolerance in `native-msx-harness.js` (documented there as held) is probably the same effect on a larger network.
Ambiguity: which of the two is "right" depends on which MSX release the vendored engine is; the page's EPANET path shows the engine's numbers, the built-in path shows msxqual.c's.

### 7. A CONCEN source at a reservoir (open)

`MSX [SOURCES] CONC R1 TR 1.0`: `msxqual.c` `addSource()` adds mass when `MSX.D[n] < 0` (a reservoir supplying the network); the built-in loop does, and species TR reaches 1.0 downstream. The vendored engine adds nothing (TR 0 everywhere).
MASS, SETPOINT and FLOWPACED at a reservoir agree exactly (0.0004313099 against 0.0004313099; 3.0 against 2.9999999999999996). Net1 reproduces it (`CONC 9 TOT 3`). Left; the fixture uses MASS. Not covered by a harness line.

## Test results

- `node dev/lpn-spike/eps-audit-fixtures-harness.js`: all pass (BRIDGE, NATIVE, export-vs-original, still-exercising, energy per fixture, two scenario runs, five MSX ceilings). Against the code before the fix it fails `valves2` and `valves3`.
- Script runs on `pumps.inp`, `valves2.inp` etc. with `--msx` and `--scenario` print the numbers above.
- `sh dev/scripts/run_harnesses.sh --node-only` and `sh dev/scripts/check_all.sh --fast`: `run_harnesses.sh --node-only` 445 of 445 pass; `check_all.sh --fast` all blocking checks pass (2026-11-20).

## Not yet audited

- A TCV whose `k` is non-zero and also regulated by a setting at a different time in a scenario (override of a TCV's setting or status in a scenario); a scenario override of `k` for a TCV (no door).
- Scenario overrides of anything else over a run (valve setting, tank diameter or initial level, pattern assignment): only pump speed and tank overflow here.
- A price pattern whose period is not the hydraulic step, and a run longer than the price pattern's length repeated (EPANET cycles; `energy.inp` repeats its 24-period pattern twice in 48 h and agrees).
- Energy at a Pattern Start or Report Start that is not zero.
- MSX: finding 6's cause, MSX with a tank mixing model other than MIXED over changing flows, MSX with quality step changing, the 2COMP/FIFO/LIFO tanks under a valve changing flow.
- The bridge frames still do not carry tank volume, pump speed or valve setting.
