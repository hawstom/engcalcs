# Tank volumes, pump and valve settings, and emitters over a period, against EPANET's own engine (audit 2, 2026-11-18)

Follows `eps-vs-epanet-2026-11-18.md` (steady results and EPS heads, flows, status). That audit did not compare tank volume, pump speed,
valve setting or emitter flow, because the built-in frame did not carry them. It does now (`frameOf`, `js/lpn-native-run.js`:
`volumes`, `pumpSettings`, `valveSettings`, `emitterFlows`, in EPANET's own units: m3, speed, m of head / m3/s / loss coefficient, m3/s).

Script: `node dev/lpn-spike/eps-audit-vs-epanet.js [--one=<file>] [--dump=kind:id]` (kinds now include `emit`, `vol`, `set`; `EPS_AUDIT_ORIG=1` lists the
times the original file and the page's export part ways). Gate: `node dev/lpn-spike/eps-audit-fixtures-harness.js` (picked up by `run_harnesses.sh`).
Engine: the vendored OWA-EPANET 2.3.5 (`js/vendor/epanet-js.js`), driven directly on the model's own export (RAW), beside the page's bridge (BRIDGE) and
the built-in loop (NATIVE), compared at every reporting time. Also RAW on the **original** file against RAW on the page's export of it, which is what shows
what the page drops on import.

Tolerance, as in audit 1: head, level, pressure, headloss 1 mm; flow, demand, emitter flow 2e-6 m3/s or 1e-5 of the largest flow. EPANET's own convergence
tolerances are Htol 0.0005 ft (0.15 mm) and Qtol 0.0001 cfs; 1 mm is 6.6 Htol and both solvers run at Accuracy 1e-5, so a difference above it is not solver noise.
New in this audit: **tank volume** 1 mm of level times the plan area (a curve tank: its curve's mean area); **velocity** is judged as the flow it implies
(v x pipe area) against the flow tolerance (the fixed 1e-5 m/s of audit 1 flagged 40 mm pipes whose flow agreed to 1e-7 m3/s); **pump speed and valve setting**
1e-6, because they are copied from a pattern or a control and never solved, so any real difference is a logic difference.

## Networks (built here, `dev/lpn-spike/fixtures/eps-audit/`; none existed for these features)

| File | Exercises | Hours |
|---|---|---|
| `tanks.inp` | reservoir on a head pattern, four tanks: T1 volume curve; T2 minimum volume 120 m3 and can overflow; T3 cylinder; T4 minimum volume 50 m3 at level 0, overflow. Each fills, drains, reaches full and empty | 48 |
| `pumps.inp` | pump speed pattern (with a 0 multiplier), pump stated `SPEED 0`, tank-level controls and time controls, rules setting a pump's speed and status, priorities | 48 |
| `pumps2.inp` | pressure controls, clock-time controls, FILLTIME and DRAINTIME, OR, ELSE, a link-flow and a demand condition, a pump closed in `[STATUS]` and opened by a rule, report step 20 min with Report Start, rule step 10 min, start clock 1 AM | 30 |
| `valves.inp` | PRV, FCV, TCV, PSV, PBV settings and status changed by controls and rules, on a demand pattern | 48 |
| `valves2.inp` | PRV, FCV, PSV stated Closed and opened by a control or rule with a new setting, a GPV, a PBV moved by a rule, a pump closed by a tank level | 36 |
| `valves3.inp` | PRV, PSV, FCV, PBV each stated Open in `[STATUS]` | 36 |
| `emitters.inp` | emitters, exponent 0.7, reservoir head pattern, a junction whose pressure goes negative, tank | 48 |
| `emitters2.inp` | the same with Demand Multiplier 1.5 and Pattern Start 3:00 | 48 |
| `emitters-pda.inp` | the same under a pressure-driven demand model | 48 |

Not built here: the 12 shipped examples and 23 `.inp` files of audit 1 were re-run with the new columns (volume, emitter flow, pump speed, valve setting): clean
except Net2's accepted quality difference. Their tanks (Net1, Net2, Net3, Community well, Fire flow) agree on volume to 1e-3 m3.

## What was compared, and what differed

Every row is at every reporting time, NATIVE and BRIDGE against RAW. "Clean" means inside the tolerance above.

| Quantity | tanks | pumps | pumps2 | valves | valves2 | valves3 | emitters (all 3) | Before the fixes |
|---|---|---|---|---|---|---|---|---|
| Tank level, volume | clean (vol 5e-12 m3) | clean | clean | n/a | clean | clean | **differed 3.2 m, 250 m3** | emitters only |
| Junction pressure, head | clean | clean | clean | clean | clean | **differed 15 m** | **differed 19 m** | see 1, 2 |
| Pump status, speed, flow | n/a | clean | clean | n/a | clean | n/a | n/a | none |
| Valve status, setting, flow | n/a | n/a | n/a | clean | clean | **differed (valve regulated)** | n/a | see 2 |
| Emitter flow | n/a | n/a | n/a | n/a | n/a | n/a | **differed**, wrong sign | see 1 |
| Original file vs page export | 0 | 5e-13 m | **3.6e-2 m** | 0 | 0 | **15 m** | 0 | see 3, 2 |

Pump speed and valve setting differed nowhere: speed patterns, speed set by rule, a stated `SPEED 0`, a setting set by control or rule, and a setting back to a
number after a status control all matched EPANET exactly (speed 0, setting 3.6e-15). Tank volume matched everywhere the tank is a tank, including a volume curve,
a minimum volume and overflow, to 1e-11 m3.

## Findings

| # | Finding | Class | Status |
|---|---|---|---|
| 1 | Emitter below the junction's elevation: the built-in solver treated it as zero, EPANET as an inflow of the same power law | defect in ours | **fixed** |
| 2 | A valve stated `Open` in `[STATUS]` was imported as a regulating valve; EPANET fixes it open | defect in ours (import) | **fixed** for PRV, PSV, FCV, PBV |
| 3 | `[TIMES] Rule Timestep` read and dropped: rules ran on EPANET's default grid, not the file's | defect in ours (import) | **fixed** |
| 4 | A TCV's stated minor loss is not carried, so a TCV fixed open (stated Open, or by a control) loses it | known difference | open |
| 5 | A constant-power pump (`POWER`) is imported as a 0.01 m, 1000 mm pipe | known limitation, reported by name (`pump-constant-power`) | open |
| 6 | Velocity tolerance of audit 1 was stricter than its flow tolerance | audit method | fixed in the script |

### 1. Emitter backflow (fixed)

`emitters.inp`: junction J3 at elevation 45 m on a network whose head is 36 m reads -8.6 m of pressure. EPANET reports an emitter flow of -13.3 L/s (water
entering the network through the emitter: 3.0 x 8.6^0.7), the same signed law on either side of zero (EPANET 2.2 added the Emitter Backflow option and its default is
to allow it, measured here against the vendored engine; the OWA source is not vendored, so the default is cited from the 2.2 release notes and confirmed by
measurement at every one of 49 times). The built-in solver clamped the head above the elevation (`Math.max(H - z, 0)`, `js/lpn-solver.js` where the emitter enters the
equations) and again where it reported the demand, so its J3 head was 3.4 m low from the first hour and, once the clamp bit (11 h), 16 m. Both engines run the same
page model, and the emitter column of Tables, tank levels, and every flow downstream moved with it. The mass-balance code in `js/lpn-native-run.js` (`emitterOut`) was
already signed, so the report and the solve disagreed with each other as well.
Fix: one function, `EngCalcs.lpnEmitterFlow(coef, dh, exponent)` in `js/lpn-solver.js`, used by the solver's equations (with the derivative on |dh|), by its demand
report, and by `frameOf`, the demand column, the mass balance and the MSX hydraulics record of `js/lpn-native-run.js`. It also serves steady runs (the same solver).
Proof: `emitters` before: head 19 m, level 3.2 m, tank volume 250 m3, status differences 31 (a tank link opened at the wrong time); after: head 1.1e-9 m, emitter
flow 1.2e-12 m3/s, status differences 0. Also `emitters2` (multiplier, pattern start) and `emitters-pda` (PDA, deficit 2.5e-13) clean.

### 2. A valve stated Open (fixed)

`[STATUS] PRV1 Open` makes the valve fixed open in EPANET (its setting is unset, input3.c, as the built-in loop's `linkState` already says for a control): a plain minor
loss, never regulating. The page's importer set only `status: 'open'`, which means "active at its setting", so a PRV set to 40 m regulated, and the import report said
"imported without loss of data". `valves3.inp`: heads 15 m off in the original against the page's export, and the page's own two engines wrong by the same amount.
Fix: the importer records `fixedOpen` for PRV, PSV, FCV and PBV (a later Closed or a numeric setting clears it); the document keeps it as `valveOpen`;
`assembleModel` hands the model `valveFixed: 'open'` (a PBV also setting 0, as EPANET's `pbvcoeff()` treats it); both exporters write `Open` back to `[STATUS]`; the
bridge's warm-path signature includes it; the built-in loop starts such a valve OPEN with no setting (a control or rule can still give it one). The steady solver
already honoured `valveFixed`. Proof: `valves3` original-vs-export 0.0 m (was 15 m); NATIVE head 1.5e-5 m, valve-setting 1.8e-15.
Not a visitor-editable property: there is no field for it, so it travels as the file stated it. A valve stated Closed that a control opens, and every
control-driven change of status, already matched.

### 3. Rule Timestep (fixed)

`pumps2.inp` states `Rule Timestep 0:10` (EPANET's default is a tenth of the hydraulic step, 6 minutes at a 1 h step). The importer matched the key against its
table, found nothing and dropped the line without a report; the exporter and the bridge therefore wrote none, and rules ran on the 6 minute grid. Original against the
page's export: 3.6e-2 m (and 66 m on a network the rule shuts the supply of); `pumps.inp` 4.7e-4 m. Native and bridge agreed with each other (both on the default
grid), so audit 1's comparison could not see it. `dev/native-eps-plan.md` already says "the rule time step the page never states ... if the page ever lets a visitor set it, the
bridge and the loop must both read it". Fix: `RULETIMESTEP: 'ruleStep'` beside `QUALITYTIMESTEP` (`js/lpn-patterns.js`); the bridge writes it, the loop uses it
(`min(stated, hydraulic step)`, `adjustdata()`), the exporter writes it back where stated. Absent, nothing changes. There is still no visitor field for it.
Proof: `pumps2` original-vs-export 3.4e-12 m (was 3.6e-2); NATIVE and BRIDGE clean at 88 reporting times.

### 4. TCV stated minor loss (open)

`valves2.inp` as first written had `TCV1 ... TCV 8 2` and a control `LINK TCV1 OPEN IF ...`. EPANET's fixed-open TCV is its stated minor loss (Km = 2); the page stores a
TCV with k = 0 (by design: an active TCV ignores the column, `EngCalcs.lpnLinkK`), so its open TCV is 0 loss. Head 8.2e-2 m at the demand junction behind it, in
both engines, original against export. Only a TCV opened by a control, rule or `[STATUS] Open` meets it. Fixing it means carrying a TCV's k separately from its
setting; left, and the fixtures state a TCV minor loss of 0.

### 5. Constant-power pump (open, reported)

`POWER` pumps are imported as a pipe and named in the import report (`pump-constant-power`); EPANET then runs a different network. A first draft of `pumps2.inp` met it
(66 m). Not a built-in-solver difference; recorded because the original-vs-export column is where it shows.

## Test results

`node dev/lpn-spike/eps-audit-vs-epanet.js`: 44 networks (35 of audit 1 plus 9 fixtures), the only ones above tolerance are the four Net2 copies (accepted, audit 1 finding 5).
`node dev/lpn-spike/eps-audit-fixtures-harness.js`: all 9 fixtures pass (BRIDGE, NATIVE, original-vs-export, and that each still exercises its feature); against master's
code it fails `pumps2` (original-vs-export 3.6e-2 m) and `emitters` (NATIVE). `sh dev/scripts/run_harnesses.sh --node-only`: 445/445.

## Not covered

- Tank volume for a tank with no area (a reservoir to EPANET) and a volume curve whose area is zero: both engines treat it as a reservoir; not stressed.
- Pump energy with a price and an efficiency curve in a period: audit 1 and `native-eps-examples-harness.js` hold it.
- A fixed-open TCV (finding 4); valve status states finer than open/closed (a PRV's active, open, or closed-by-pressure state is EN_STATUS 1 or 0).
- The bridge frames do not carry the four new quantities, so BRIDGE is compared on heads, flows and status only; its inputs (settings, volumes) are RAW's own.
- MSX with a changing setting; leakage; GPV settings (a GPV's setting is its curve; its status and flow are compared, and match).
- Reporting times that are not multiples of the hydraulic step are covered by `pumps2` (20 min) only; a report step longer than the duration was not run.
- A scenario's override of a pump speed or tank overflow in a period: the page path is the same model; not run.
