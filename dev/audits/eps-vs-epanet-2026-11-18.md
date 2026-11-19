# EPS and steady results against EPANET's own engine (audit, 2026-11-18)

Script: `node dev/lpn-spike/eps-audit-vs-epanet.js` (about 20 s; `--dump=quantity:id` prints one series; `--json=` writes the numbers).
Engine: the vendored OWA-EPANET 2.3.5 (`js/vendor/epanet-js.js`), not 2.2.
Method: each source is opened through the page (examples through `applySaved`, each `.inp` through `importInpFromFile`), then run three ways over the full duration and
compared at every reporting time: RAW (the engine driven directly on the model's own exported `.inp`, nothing of ours between it and the number), BRIDGE
(`lpnEpanetRun`) and NATIVE (`lpnNativeRun`, quality on). Accuracy 1e-5 in both.
Tolerance: head, level, pressure, headloss 1 mm; flow and demand 2e-6 m3/s or 1e-5 of the largest flow; velocity 1e-5 m/s; quality 1e-3 of its range.

## Result

35 runs: 12 shipped examples, 23 `.inp` files under `dev/` (Net1/2/3 appear several times as copies). Same reporting times everywhere. **No link status ever differed, at any time, on any network.**
Pump energy (native against the engine's own energy block) is within 1e-4 everywhere it applies. BRIDGE against RAW is clean to 1e-6 m everywhere (Net3 quality 4.6e-4 of 100, from the bridge holding full tanks).

| # | Finding | Where it shows | Class |
|---|---|---|---|
| 1 | Built-in minor loss uses g = 9.80665; EPANET uses its rounded 0.02517 constant. Minor loss 0.092 % too large | Valves (head 6.2 mm, TCV headloss 6.2 mm), Elm Street 1.7 mm, descriptions.inp 1.4 mm and 1.3e-5 m3/s | defect in ours |
| 2 | Built-in frame demand leaves out emitter flow; EPANET's demand includes it | import-cases.inp J6: 0.827 L/s of 5.87 L/s (14 %) | defect in ours |
| 3 | Built-in reports 0 pressure at a reservoir on a head pattern; EPANET reports head less base head | pattern-attach.inp, wtg-export-parts.inp: 6.096 m (20 ft) | difference, intent unknown |
| 4 | EPANET refuses the `.inp` the page exports when PDA Required minus Minimum pressure is under 0.1 in the file's pressure unit; the page says nothing | three PDA files in `dev/net-import-study/`; any US PDA file with EPANET's own 0.1 psi default | defect in ours (EPANET path) |
| 5 | Net2 quality differs 0.0028 mg/L (0.27 % of range) from 32 h | Net2 (all copies) | accepted, documented |
| 6 | Original `.inp` against our LPS export, heads: up to 0.31 mm (Net3) | every `.inp` | unknown, below tolerance |

## 1. Minor loss constant (defect in ours)

`js/lpn-solver.js:975` forms `linkM[k] = K / (2 g A^2)` with `g = EngCalcs.lpnG = 9.80665` (line 29, 778). EPANET writes minor loss as `Km = 0.02517 K / d^4` in feet and cfs
(input3.c pipedata for pipes; the same constant for a TCV setting), which is g = 32.2 ft/s2 = 9.8157 m/s2. The ratio is 1.00092, exactly what was measured
(TCV1 headloss 6.6691 against 6.6629 m at an identical flow). The comment at `js/PipeHydraulics.lib.js:80` says "EPANET's minor loss has its own rounded 0.02517 (see
lpn-solver.js)", but lpn-solver.js has no such constant. The C source is not vendored (only the wasm), so the constant is cited from EPANET 2.x and confirmed by measurement.
Confirmed as the whole cause: with line 975 temporarily replaced by the 0.02517 form, valve_example head went from 6.2e-3 to 6.3e-6 m, descriptions.inp from 1.4e-3 to
8.8e-10 m and Elm Street from 1.7e-3 to 6.4e-6 m (reverted; nothing fixed here). The reported headloss of a link is formed separately at `js/lpn-solver.js:2005`
(`m * aq * Q`), and the TCV headloss stays 6.2 mm off until that changes too. The harnesses missed it because their constructed networks carry little minor loss
(their tolerance is 0.8 mm). The error is 0.09 % of the total minor-loss head on a path.

## 2. Emitter flow missing from native demand (defect in ours)

`js/lpn-native-run.js:2592` sets a junction's frame demand to `res.demands[id]` (pressure-driven only) or the base `n.demand`. EPANET's EN_DEMAND is the demand plus
the emitter's discharge, and the same file says so at line 1909 ("a junction's NodeDemand is its demand plus what its emitter discharges") and uses it in the mass balance
(1064, 1074). The bridge reads EN_DEMAND, so the two engines disagree on any emitter junction: native 0.005047, EPANET and bridge 0.005874 m3/s, the difference
being EN_EMITTERFLOW (0.000827) to the digit. Heads and flows agree; only the demand column (Tables, any Results that sums demand) is short. No shipped example has an emitter, so
nothing exercised it.

## 3. Reservoir pressure on a head pattern (difference)

EPANET's EN_PRESSURE at a reservoir is its head less its elevation, and a reservoir's elevation is its base head, so on a head pattern it reads 3.048, -1.219 ... -6.096 m.
The bridge passes that through; the built-in loop reports 0 (`frameOf`, `js/lpn-native-run.js:2573`, takes `res.pressures`). No pressure is physically defined at a reservoir, so
this may be the better number; but the two engines differ and nothing documents the choice.

## 4. PDA pressure limits refused by EPANET (defect in ours, EPANET path)

`Required Pressure 0.1` with `Minimum Pressure 0` opens in a GPM file and fails (error 200) at 0.0999; the same physical 0.1 psi written by `lpnToInp` as 0.0703 m
(`Units LPS`) also fails, and 0.1 in the LPS file passes. EPANET's check (Required minus Minimum at least 0.1, input1.c adjustdata, error 208) is made in the file's own units, as measured
at 0.0999, 0.1 and 0.1001 in both files. The page's bridge then returns `ok=false` with no issues, `lpnDiagnose` returns `[]`, and the built-in solver runs the model. A
visitor who imports a US PDA file with EPANET's default limits and chooses the EPANET engine gets no result and no reason. Fix belongs in the exporter (write at least 0.1 apart, or
write the file in US units) or in `lpnDiagnose` (refuse by name).

## 5. Net2 quality at a merge threshold (accepted, documented)

`dev/lpn-spike/native-eps-quality-harness.js:410-417`: the source pattern steps the fluoride by exactly the 0.01 mg/L Tolerance, so whether a segment merges is decided in the last bit
of a double; flows 1e-7 apart flip it. BRIDGE against RAW is exactly 0, so the bridge is not involved.

## 6. Original file against our export (unknown, below tolerance)

RAW on the original `.inp` against RAW on `lpnToInp` of the imported model: worst head 3.1e-4 m (Net3, node 145, 16 h), 8.9e-5 (Net1), 8.6e-5 (Net2). Probably digits
lost writing LPS; not traced.

## Not covered

Pump and valve settings and tank volume are read from the engine but not compared (neither frame carries them). Bridge energy and the MSX path (`dev/lpn-spike/fixtures/msx-example`) were not
run. Rules, speed patterns, volume curves and pump energy with a price on the shipped examples stay with `native-eps-examples-harness.js`. Only shipped examples and the `.inp` files under
`dev/` were run; no network with emitters in a period, a PRV or FCV on a pattern, or leakage. Statuses are open/closed only (EN_STATUS), so a PRV's active versus open state is not compared.
