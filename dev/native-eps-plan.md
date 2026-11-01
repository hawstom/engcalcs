# Native extended-period simulation and water quality: phase plan (Task 733, phases 3 and 4)

Tom: "slow and careful". Each slice is its own branch, matched against EPANET 2.3.5 (the vendored
engine) at every reporting step on every shipped example it touches, before it merges. A gap is
reported with its numbers; the tolerance is never loosened. Tolerance: 0.8 mm of head and of tank
level, 0.002 L/s of flow or 1e-5 of the largest flow, both engines at Accuracy 1e-5.

## How the engine does it (what the native loop copies)

`js/lpn-epanet.js` drives EPANET's `runH()` / `nextH()`. Per step EPANET (hydraul.c) sets demands
from patterns (`demands()`), applies controls, solves, then `timestep()` takes the shortest of the
hydraulic step, the time to the next pattern period, the time to the next report, the time for a
tank to fill or drain (`tanktimestep()`), and the time to a control (`controltimestep()`, rules:
`ruletimestep()`); `tanklevels()` then moves each tank. Times are whole seconds.

The built-in solver (`js/lpn-solver.js`) solves one instant. A tank is already a fixed head there
and already shuts a link into a full tank or out of an empty one. What it lacked was the clock and
the tank's level as state. `js/lpn-native-run.js` is that loop and adds no hydraulics.

## Slices, in order

1. **Tanks, demand patterns, reservoir head patterns (built).** No controls, rules, speed patterns,
   volume curves, quality or energy; each is refused by name (`lpnNativeRunRefusals`), so the caller
   uses EPANET as it does today. Test: `native-eps-harness.js` (constructed networks that fill to
   and empty to a limit, report step shorter than the hydraulic step, pattern step and start, report
   start, demand categories; Net2; Net1 and Net3 with controls stripped for both engines).
2. **Simple controls (built).** `[CONTROLS]`: AT TIME, AT CLOCKTIME, tank level, junction pressure;
   OPEN/CLOSED and numeric settings on pipes, pumps (speed) and every valve; `controls()`,
   `controltimestep()`, `pswitch()`. Refused by name: a control conditioned on a reservoir, a
   junction-pressure control on a valve, a numeric setting EPANET rejects (GPV, negative).
   Tests: `native-eps-harness.js` (Net1 and Net3 with their controls; 15 constructed cases, one
   per control kind, crossings inside a step, a tie) and `native-eps-examples-harness.js` (the
   five gallery examples with controls, through the page's own `assembleModel()`).
3. **Pump speed patterns and pump status (built).** `demands()` hands a patterned pump its
   multiplier as its speed at every hydraulic step, before the controls (`setlinksetting()`); a
   stated SPEED 0 is open at speed 0; and the built-in solver now has EPANET's `pumpstatus()`
   (XHEAD, a pump that cannot lift), which it lacked even for one instant. Refused by name: a
   speed pattern on a pump without the page's unscaled curve, a pattern the model lacks, a
   negative multiplier. Tests: `native-eps-harness.js` (12 constructed cases, `pattern-attach.inp`,
   Net3 with patterns on pump 335, on pump 10, and on both with controls stripped) and
   `native-eps-examples-harness.js` (the five gallery examples with a period and a pump, a speed
   pattern added to the document).
4. **`[RULES]` (built).** `ruletimestep()` and the rule step (a tenth of the hydraulic step, whole
   seconds), `checkrules()` with `evalpremises()`, PRIORITY resolution and `takeactions()`. Premises on
   TIME, CLOCKTIME, system and node demand, node head, grade, level and pressure, a tank's FILLTIME and
   DRAINTIME, a link's flow, status and setting; THEN, ELSE and AND actions. Refused by name
   (`native-run-rules`, the rule's name): a premise on a pipe's roughness, a reservoir's level or
   pressure, a GPV's setting; a rule EPANET rejects when it reads the file (FILLTIME on a junction, an
   unreadable time, a negative or GPV setting, an action on a check valve); a hydraulic step under 10 s.
   Tests: `native-eps-harness.js` (25 constructed cases, Net1 with the gallery rules, with its
   controls stripped, and with other rules; Net3 with rules in place of its controls, and with extra
   rules beside them; 10 rule refusals) and `native-eps-examples-harness.js` (the three Net1 examples with
   their rules, through `assembleModel()`).
5. **Tank volume curves, minimum volume, overflow (built).** `tankvolume()` / `tankgrade()` /
   `interp()` on the curve, `inittanks()` (a curve sets Vmin, Vmax and V0), MinVol with no curve,
   and CanOverflow (`tankstatus()`). `tanktimestep()`, controls and rules needed no change: they read
   the volume through the two functions. Refused by name (`native-run-volume-curve`): a tank that
   names a curve with no usable rows, one row, X not increasing, or a curve that does not reach from
   MinLvl to MaxLvl (EPANET's error 225). Tests: `native-eps-harness.js` (19 constructed cases: a
   straight-sided curve equal to the cylinder, a narrow-bottom curve, an hourglass, a full and an
   empty event, MinVol with and without a curve, overflow with and without a curve, a pumped
   overflow tank, a curve tank under a rule, a FILLTIME rule, controls, and an overflow tank under a
   rule and a control; 5 curve refusals) and `native-eps-examples-harness.js` (every gallery example
   with a tank and a period, a bowl-shaped curve added to each tank through `assembleModel()`, in US
   and SI units).
6. **Pump energy (built).** `getenergy()` / `getallpumpsenergy()` / `addenergy()` / `saveenergy()`:
   per pump the usage factor, average efficiency (a global percent, or the pump's EFFIC curve at its
   flow brought to full speed, with the Sarbu and Borza speed adjustment), kWh per m3, average and peak
   kW and cost per day; the global and per-pump price, global and per-pump price pattern, the demand
   charge on the peak of the SUM, and the totals line. Returned as `result.energy` (shape below). Refused
   by name (`native-run-energy`): what EPANET refuses to read (a price pattern the model lacks, a negative
   price or demand charge, a global efficiency of 0 or less, an efficiency curve whose flows do not
   increase). Tests: `native-eps-energy-harness.js` (46 checks: the reader held to the Net3 report, 10 Net3
   cases, 20 constructed cases, 3 Net1 cases, 7 refusals) and `native-eps-examples-harness.js`
   (the five pumped gallery examples with a price, pattern, demand charge and efficiency curves added
   through `assembleModel()`, with and without a speed pattern, in US and SI units).
7. **Wiring to the page (built, on branch `feat/native-wire`; merges on Tom's word).** `lpnTimeRun()` asks
   `EngCalcs.lpnTimeNativePlan(model)` (js/lpn-time.js): the loop runs the period, quality included
   (`lpnNativeRun(model, {quality: true})`), when the open scenario's engine setting is the built-in solver and
   `lpnNativeRunRefusals(model, {quality: true})` names nothing; otherwise EPANET runs it as before and, if the
   user had chosen the built-in solver, the status bar says so (`lpn_engine_native_route`, `..._ids`). `modelNeedsEpanet()` no longer calls a period EPANET's
   when the plan says the loop runs it. Only the transport's run is wired: fire flow, criticality, demand
   scaling, the scenario comparison and the Alternatives preview still call `lpnEpanetRun`. The loop returns
   the convergence fields of the EPANET run. Test: `native-wire-harness.js` (Net1 chlorine, Net2 fluoride,
   Net3 trace and Net3 plain, through the page's run path, held to the tolerances above; a refused case).
   **Reaction rates are computed** (`reactpipes()` keeps the volume-weighted mean of |c_new - c_old| per second of
   the step, scaled to a day, and `ratecoeffs()` zeroes it at each hydraulic period, so a report time reads the
   last step of the period before it); a chemical frame carries `linkRates` for every pipe, in mass/L/day, held to
   EPANET's within 5e-7 relative over its own hydraulics and 2e-3 absolute end to end on all 24 chemical cases
   (`native-eps-quality-harness.js`) and on Net1, Net2 and Net3 (`native-wire-harness.js`). The mass balance and the
   average rates in mass per hour that EPANET's report prints are shown by no part of the page, so the built-in
   loop does not keep them. After every Calculate the status bar says which solver answered
   (`lpn_engine_native_used`; the routed-run sentences name EPANET) and the run summary says it for either solver
   (`lpn_engine_native_used`, `lpn_engine_epanet_used`). The run report is empty on a built-in run
   (`lpn_time_no_report` says why). EPANET-MSX stays on EPANET.

## What slice 1 learned (so slice 2 does not rediscover it)

- The bridge always writes an LPS file, so EPANET holds a tank in feet and cubic feet with 28.317
  L/s per cfs, which is not 1000 / 0.0283168466. The native loop carries each tank in those units;
  in plain SI the level drifts 5.6e-6 of its swing, and worse:
- Whether a tank at its maximum is "full" is a float comparison in EPANET (`head >= Hmax` on a head
  rebuilt from the volume), and it goes either way. A 12 m limit on a 10 m tank stayed open to
  inflow in EPANET; a 3 m limit shut. The loop reproduces the comparison and hands the solver a
  level just under the limit when EPANET calls the tank not full. Measured, not assumed.
- A stripped-controls Net1 or Net3 is a harder tank test than the controlled day (pumps never stop,
  tanks run to a limit), so slice 2 adds the controls back rather than replacing this test.

## What slice 2 learned

- A link a full tank shut (EPANET's TEMPCLOSED) STARTS THE NEXT SOLVE SHUT. That decides a
  junction-pressure control: a timer shutting the only other supply leaves the junction cut off at
  the first trial, its head collapses, and `pswitch()` re-opens the pipe in the same solve. EPANET's
  frames show it never shut. `lpnSolve` takes `tempClosed` for this; without it the case is metres off.
- A control compares statuses as EPANET's numbers (XHEAD and TEMPCLOSED are below CLOSED), so the
  loop keeps each link's EPANET status between steps, not only open/closed.
- Opening a pump by OPEN sets its speed to 1, not back to its stated speed (input3.c controldata()).
- The one gap measured is not a control's: EPANET's minor loss uses g rounded to 32.2 ft/s2
  (0.02517), so a large TCV coefficient moves heads by millimetres. The TCV case keeps its loss small.

## What slice 3 learned

- A pattern overrides a control every step: `demands()` runs before `controls()` at each
  hydraulic step, so a timer that shuts a patterned pump holds only until the next step, and a
  tank control holds it off only because it re-fires each step while the level is over it.
- A pump stated Closed with a pattern runs from the first step (multiplier above 0 opens it).
- The built-in solver shut a pump pushed backwards with Y = 0, which kept the trial's reverse
  flow: 0.61 m and 17.8 L/s wrong on one instant, 91 m over a day. It now evaluates the curve on
  |Q| as `pumpcoeff()` does and shuts a pump that cannot lift by `pumpstatus()`'s XHEAD test.
  An XHEAD pump starts the next step shut, as TEMPCLOSED does (`lpnSolve` `xhead`).
- Net1 with a pattern on pump 9 is 0.63 mm off at one frame (21:00) and 0.03 mm either side: the
  tank reaches its control level on that report time, and the two engines' whole-second rounding
  of the time to it falls on opposite sides. Inside the tolerance; noted so nobody chases it.
- Not this slice's: a pump curve of more than three points is interpolated by EPANET and fitted
  by the built-in solver (every engine-agnostic solve has this gap), and Elm Street Center differs
  by 1.8 mm on one instant on master too.

## What slice 4 learned

- A rule firing between hydraulic steps shortens the step, and the report only shows its result at
  the next report time. The 6-minute step that closes a pump is never a frame, so a case that asks
  "closed at hour 7" tests the rule, but "closed at hour 5" can miss it. The loop returns
  `solveTimes` (every time it solved) so a case can prove a solve fell off the hourly grid.
- `ruletimestep()` replaces the single `tanklevels()` of a step: the tanks move by each rule
  increment (the first only up to the next multiple of the rule step), so a tank-level premise sees
  the level at that moment, while every other value (junction heads, flows, statuses, demands) is
  frozen at the last solve. An action actually taken ends the step there; one that changes nothing
  (OPEN on an open link) does not.
- A rule acts at the end of its own increment, so a rule whose window closes at TIME < 6 acts at
  6:00 exactly if a different rule's change is waiting on it: the 6 h frame already shows the
  result. Counted in the right place by `checkRules(now - dt1 + 1, now)`, as `checkrules()` does.
- EPANET's `<=` and `>=` on values are lopsided: LE is false above `value - 0.001`, GE false below
  `value + 0.001` (the other four are symmetric). Time premises compare the end of the increment with
  `<`, `<=`, `>`, `>=` plainly, and `=` or `<>` ask whether the second fell inside the increment
  (wrapping past midnight). Copied as written; nothing in the harness depends on the difference.
- The action list keeps one action per link, a later rule replacing it only on a strictly higher
  PRIORITY; the list is built by pushing on the front and taken from the front, so the actions run
  in reverse order (which matters to nothing here, one action per link).
- `STATUS IS 0.7` is a setting (EPANET reads any non-keyword as a number), and a pipe given a
  number is closed at 0 and opened otherwise. `ACTIVE` as an action does nothing but still holds the
  link's place on the action list.
- A number is compared with a link's setting in EPANET's internal units (feet of head for a PRV, PSV
  or PBV, cubic feet per second for an FCV), within 0.001. An FCV setting that moves less than
  28 L/s is therefore not taken as a change. The loop converts to those units before comparing.
- Setting a valve's status by rule makes it fixed (setting unset), as `setlinkstatus()` does; the
  next numeric setting un-fixes and re-opens it (`setlinksetting()`).
- Test networks must not strand a junction. A rule that shuts the only supply while the tank drains
  produces a disconnected junction whose heads are garbage in both engines (millions of metres),
  and the harness then fails on a difference that means nothing. The cases keep their windows short
  and the tanks big enough.
- The rule time step the page never states: `Rule Timestep` is not written to the EPANET input, so
  EPANET always uses its default and so does the loop. If the page ever lets a visitor set it, the
  bridge and the loop must both read it.

## What slice 5 learned

- **The page has no minimum volume and no overflow.** `assembleModel()` carries a tank's curve
  (`volCurve` and `volCurveSI`, level in metres and volume in cubic metres, converted by
  `lpnTankVolumeAttach()` from the document's elevation unit and its cube) and nothing else; the
  bridge always wrote MinVol 0 and no Overflow column. The model now accepts `minVolume` (m3) and
  `overflow` (true) on a tank, the bridge writes them when present, and the solver does not shut a
  link into a full overflowing tank. Only a hand-built model states them. The `.inp` importer reads
  neither. Giving the visitor either is a page decision, not a solver one.
- **A stated MinVol with no curve changes nothing a visitor can see.** Vmin, V0 and Vmax all move by
  the same amount and the level is measured from Vmin, so levels, flows and timing are identical in
  both engines (tested to 1e-9 m). With a curve EPANET overwrites it. It matters only to a person
  reading the volume itself.
- **An overflowing tank at its maximum is just a fixed head that takes water.** The link stays open,
  `tanklevels()` holds V at Vmax, and the whole inflow shows as the tank's net inflow. `tanktimestep()`
  ignores a full tank with inflow (`h < Hmax` is false), so it never cuts the step.
- **A draining tank can rest a little below its minimum.** `tanklevels()` snaps to Vmin only when
  `V - q <= Vmin`, which for a draining tank (q negative) means V is already a second of flow below
  it. Both engines did it to 2e-5 m; a harness that asks "is it at the minimum" needs a tolerance, not
  equality.
- **Timing at a low flow is the one sensitivity.** The two solves differ by up to 1e-7 m3/s in a flow;
  over a day that is 0.001 m3 in a tank, which at 2 L/s is half a second of the time to a control
  level, and EPANET rounds that time to a whole second. In a narrow part of a curve a second is
  millimetres (5 mm in an hourglass neck), and it compounds through later events. Not a defect in
  either engine; the cases that cross control levels use tens of litres per second over a day. A
  slow drain into a steep curve under a tank-level control will show it again.
- A curve is read in the file's own units whatever EPANET's internal ones are (`tankvolume()` converts
  the level to the curve's unit and the volume back), so the native loop interpolates the SI rows as
  given and converts the answer.

## What slice 6 learned

- **The result's shape (what slice 7 wires, and what the page already reads).** `lpnNativeRun(...)
  .energy` is `null` when the model has no link of type pump, else the object `lpnEpanetRun(...)
  .energy` is (js/lpn-epanet.js `lpnEnergySummary`): `{pumps: [{id, onSeconds, usage, avgKw, peakKw,
  avgEfficiency, kwh, cost}], energyCost, kwh, peakKw, demandCharge, totalCost, duration}`. `usage` and
  `avgEfficiency` are fractions, never percents; `kwh` and `cost` are over the whole run;
  `peakKw` (top level) is the largest sum of kW at one step. The loop ADDS four fields the page does
  not read yet: per pump `kwhPerM3` and `costPerDay` (EPANET's "Kw-hr /m3" and "Cost /day" columns,
  the file being SI) and at the top `costPerDay` and `totalCostPerDay` (EPANET's "Total Cost" line).
  A harness case asserts every field of the page's summary is present.
- **The truth is the engine's binary output, not the page's figure.** The page's energy result
  (`lpnEnergyAccumulate` on `EN_ENERGY` samples) now counts as `addenergy()` does (Task 821, Tom
  2026-10-22 "Count as EPANET does"): a pump is on line while its efficiency reads above 0 (open, whatever
  the flow), and a single instant counts as one hour; `energy-count-harness.js` holds it. The loop and the page
  now agree on the definition. The harness reads the energy
  block of `temp.out` after `solveH()` / `saveH()` (single precision, four digits beyond the report)
  and holds that reader to the printed report to its rounding.
- **Status first, then flow.** `getenergy()` returns 0 power and 0 efficiency for a link whose status is
  at or below CLOSED (XHEAD, TEMPCLOSED included), and `addenergy()` skips a pump whose efficiency is 0.
  Power and efficiency are read from each solve BEFORE the step is chosen (`nexthyd()` calls
  `getallpumpsenergy()` first), so a rule or control acting at the end of the step changes nothing in
  that step's energy; the step's length is the one `timestep()` returned, rules and tank events included.
  The final instant adds nothing; a duration of 0 adds one hour.
- **A pump at setting 0 that is OPEN carries a flow.** `pumpcoeff()` makes it a link of conductance
  1/CBIG (1e-8), so EPANET holds (head difference in ft) / 1e8 cfs through it; the built-in solver shuts
  it and holds 0. Power is then a thousandth of a kW and the efficiency 1 percent (the clamp), and the
  kWh-per-flow column is a ratio of two tiny numbers. The loop reproduces the flow for the energy only.
- **Near-zero flow is the one column that will not agree.** A pump left open with a demand of 0 carries
  numerical noise in EPANET (about 1e-7 cfs) and exactly 0 in the built-in solver; kWh per m3 divides
  power by flow (floored at 1e-6 cfs), so the hours spent there moved that column by 3 to 12 percent
  in the case measured. Average kW, peak kW, usage, efficiency and cost agreed to 1e-7 on the same case. The harness's
  two-pump case therefore keeps a demand above 0 in the off hours.
- **The speed enters the efficiency twice.** The curve is read at q / speed (in L/s, the file's unit),
  and the answer is then pulled toward 100 by the Sarbu and Borza factor, 100 - (100 - e) x (1/speed)^0.1.
  Both are in the harness (a pattern from 0.8 to 1.2 on a curve pump).
- **Price pattern period** is `(time + pattern start) / pattern step`, taken at the START of the step and
  held for it, wrapped on the pattern's length; a pump's own pattern replaces the global one (the global
  pattern then does not multiply the pump's own price), and a pump price above 0 replaces the global price.
- **Net3, to the digit.** Usage 58.33 and 28.74 percent and average kW 62.06 and 309.38 as EPA's report
  prints; the peak of pump 335 is 310.78 here and 310.79 in the published file, for the engine and the
  loop alike (the engine build differs from the one that wrote Net3.rpt). The harness compares the loop
  with the engine, not with the file.
- **Tolerances (energy-truth module).** Usage 1e-4 of a fraction (one second is 1.2e-5 of a day) and
  1e-4 relative on everything else, with a floor of 1e-4 of the column's largest value; efficiency on a
  curve 5e-4. Measured worst across all cases: usage 1.2e-5, efficiency 1.3e-6, everything else 7e-5 (cost
  on Net3 with a price pattern, where a step cut one second apart lands in a dearer hour).
- **Not copied, by design.** A pump with no curve is a pipe to EPANET and is not listed in the loop's
  energy (the page lists it with a pipe's kW); `Global Efficiency` and prices are read as the bridge
  writes them (a value only when stated). The page cannot state a rule step, so it stays EPANET's default.

## Water quality (phase 4)

Tom, 2026-09-26: build the native solver out "to do everything that the EPANET solver does".
Built, unwired: `lpnNativeRunRefusals(model)` still refuses every quality run (`native-run-quality`);
`lpnNativeRun(model, {quality: true})` runs it, and `lpnNativeRunRefusals(model, {quality: true})`
then names only what the pass cannot copy. Slice 7 passes the option when he says so.

**How.** EPANET runs quality as a second pass over the hydraulics it saved (the bridge: `closeH()`,
then `openQ()`/`runQ()`/`nextQ()`), and so does the loop: one record per solve, as `savehyd()` writes
it (link flows and junction demands in cfs as 4-byte floats, a link at or below CLOSED with no flow),
then `qualityPass()`, transcribed function by function from quality.c, qualroute.c and qualreact.c
(OWA-EPANET 2.3.5, MIT): Lagrangian segments per link and per tank, the quality step (stated, or a
tenth of the hydraulic step), the merge tolerance `Ctol` (stated for a chemical, else 0.01 h of age,
0.01 percent, 0.01 of the chemical's unit), the topological node sort and its order from
`buildadjlists()`. Frames gain `qualities` and `linkQualities` in the bridge's units (age in seconds).
`lpnNativeQualityOver(model, recs, vEnd)` runs the pass over hydraulics handed in.

**Reached.** Q1 water age; Q2 source trace (from a reservoir, a junction, a tank); Q3 one chemical:
initial quality, sources of all four types (CONCEN at a reservoir, at a tank and at a junction drawing
a negative demand; MASS; SETPOINT; FLOWPACED; each on a pattern), bulk and wall reactions (order 1 and
the [REACTIONS] globals, per-pipe and per-tank coefficients, the roughness correlation, a limiting
potential; order 0 wall and order 2 bulk also copied and tested), mass transfer (diffusivity stated,
default, and 0), and all four tank mixing models: MIXED, 2COMP, FIFO, LIFO.

**Refused by name** (`native-run-quality`): EPANET-MSX; a trace on a node out of the run (the bridge
writes no Quality line); a tank with no area in a quality run; a source type or mixing model EPANET
does not know (error 213); a source on a pattern the model lacks (error 205); a quality step that
comes to 0 (hydraulic step under 10 s, none stated: EPANET's walk never advances).

**Not copied.** The mass balance and the average reaction rates in mass per hour (no part of the page shows
them). The per-pipe reaction rate the page's column shows IS copied (slice 7). A pump at speed 0 left OPEN, which
EPANET carries a flow of 1e-8 x its head difference through and the loop carries 0.

Test: `native-eps-quality-harness.js`, 106 checks. Every case is run three ways: EPANET; the pass over
EPANET's OWN saved hydraulics (`native-eps-quality-truth.js` reads the engine's hydraulics file); and
the loop end to end. Tolerances, at every node and link at every reporting time:

- **Over EPANET's hydraulics: 1e-8 x max(1, |value|)** on every case. Measured worst: 1.4e-9 s of age on
  Net2 (an age of 114 000 s), 5e-13 percent, 1e-14 mg/L. This is the transcription.
- **End to end, age:** 1 s on the constructed cases (2 s on a tank's own pipe, 60 s on a dead-end pipe,
  10 s with a 30-minute hydraulic step at a reversal); Net1 1 s (0.21 measured), Net2 3 s (1.6), Net3
  25 s on nodes and 100 s on links (15.8 and 65).
- **End to end, trace:** 0.01 percentage point (0.05 on the dead end); Net3 0.1 (0.070 and 0.094).
- **End to end, chemical:** 1e-4 mg/L (5e-4 on the dead end); Net1 as shipped 1e-4 (6e-6 measured);
  Net3 with chlorine at both sources 1e-3 (6e-4); Net2 as shipped 5e-3 (2.8e-3).

## What phase 4 learned

- **The transcription is exact; every end-to-end gap is hydraulic.** Over EPANET's own hydraulics the
  pass agrees to roundoff on all 49 cases, so the gaps above are the two hydraulic solutions' (flows
  1e-5 of the largest apart, small flows up to 0.5 percent) carried along a path. EPANET against
  itself at Accuracy 1e-5 and 2e-5 moves Net3's ages by 0.5 s; the loop's 15.8 s is the solver
  difference, not the quality code.
- **A control time a second apart shows in quality.** Net3's tank-1 control fires at 21:19:39 here and
  21:19:40 in EPANET (slice 5's rounding). Pipe 133 reverses at 22:00 onto water 50 000 s older, and
  one second of 100 L/s is its 65 s.
- **EPANET's numerical noise in a stagnant pipe is a flow to the quality pass.** A dead end carries
  about 3e-8 m3/s in EPANET and 0 here; `transport()` moves volume through any link with a nonzero flow
  whatever its direction flag says, so a dead-end pipe's average drifts by seconds a day.
- **Net2's fluoride is a knife edge.** Its source steps by exactly 0.01 mg/L, which is its own Tolerance,
  so `evalnodeoutflow()`'s merge test `|0.09 - 0.08| < 0.01` is decided in the last bit of a double:
  0.09000000000000001 in one run, 0.08999999999999998 in the other. One merges, pipe 1 averages
  0.0028 mg/L apart from 32:00. Any one of three hydraulic records, swapped in alone, flips it.
- **Things EPANET does that look like slips and are copied:** a check-valve pipe neither ages nor reacts
  and starts empty of segments (reactpipes(), initsegs() take PIPE only); pumps and valves hold
  segments once water passes them (evalnodeoutflow()); a FIFO or LIFO tank asks whether it is full of
  the volume the HYDRAULIC run ended at (tank->V is not moved by the separate quality pass); a tank
  starts from its node's initial quality but a pipe from its downstream node's; SGN(0) is +1.
- **Flows enter as 4-byte floats** because the hydraulics file stores them so; the pass over EPANET's
  hydraulics only agrees to roundoff because the records are read that way too.

## Wording

"The built-in solver solves one instant" was false for the networks the loop covers from the day slice 7
ships. Reworded on `feat/native-wire`: `lpn_time_no_engine`, `lpn_time_no_engine_why`,
`lpn_time_run_fell_back`, `lpn_settings_engine_native_tip`, `lpn_notes_1_def`, `lpn_time_no_report`. What stays
true: js/lpn-solver.js solves one instant, and a period no engine can run is shown as one instant.

## What still falls back to EPANET under the built-in setting (updated 2026-11-01)

Built on `feat/native-wire` after the first inventory: every run path asks one door (`EngCalcs.lpnTimeRunModel`,
the engine choice the transport uses); a control on a reservoir and a junction-pressure control on a valve; a
pump with no curve on a speed pattern (already a pipe in both engines; now held); the rules EPANET refuses,
named by `lpnDiagnose`; and pressure-driven demand, steady and period.

**A period the transport runs** (`lpnTimeNativePlan()`; the status bar names the element or setting):

| Falls back for | Where it is decided | Why it stays |
|---|---|---|
| EPANET-MSX (`model.msx`, mode `msx`) | `native-run-quality`, no ids | A separate extension: a multi-species reaction network with its own integrator and segment transport. Left on EPANET by decision. |
| A [RULES] premise on a pipe's roughness, a reservoir's level or pressure, or a GPV's setting; a hydraulic step under 10 s with any rule | `native-run-rules` | EPANET reads these; the loop does not copy them. Roughness and GPV settings are not state the loop holds. Not built. |
| A speed pattern on a pump the page did not model (no unscaled curve), or with a negative multiplier | `native-run-speed-pattern` | Not a page model. A negative multiplier makes EPANET itself return NaN (measured), so there is no answer to match. |
| A tank volume curve with no usable rows; a tank level outside its limits; a quality, energy or control input EPANET refuses (errors 207, 211, 213, 217, 225, 230) | `native-run-volume-curve`, `-tank-levels`, `-quality`, `-energy`, `-control-unsupported` | EPANET errors on each, so the answer is the same refusal in both engines. Rules got their named refusal (`lpnDiagnose` `rules-refused`); these five have not been moved to `lpnDiagnose` yet. |
| A step the built-in solver cannot solve (`lpnDiagnose`), or a loop that throws | `finish(null)` in `periodRun()` | A real failure, shown as EPANET's answer. |

**Not a run, and not changed**: the EPANET text run report (Project, EPANET run report; no report exists on a
built-in run and `lpn_time_no_report` says so) and the run's warnings in EPANET's words (`nativeWarnings()`
carries only the bridge's notes). A later slice.

## Analysis runs (this slice)

Scenario comparison, fire flow over a duration, criticality, demand scaling, the Alternatives preview and
`analysisRun` no longer call `lpnEpanetRun`. They call `EngCalcs.lpnTimeRunModel(model, opts)`, which is
`periodRun()` with the status-bar note switched off (the transport owns that slot). The setting decides, and
a model the loop refuses runs on EPANET exactly as before. Held by `native-analysis-wire-harness.js` on Net1 and
Net3: the models those analyses build (a fire demand on a pattern, a pipe closed, a demand multiplier) run both
ways and agree on the lowest pressure of every node (1 mm), the highest velocity of every link (1e-4 m/s), the
tank-empty verdict, and every number the fire-flow digest reports. Net3 with demands scaled to 1.5 (pumps past their curves, EPANET warning 4) had differed by 17 mm in a node's lowest pressure; the cause is
below (`## Flows in EPANET's cubic feet`). Every neighbouring multiplier now holds to 0.11 mm; 1.5 exactly is a knife edge held only up to its event.

## Controls on a reservoir and on a junction pressure at a valve

hydraul.c `controls()` reads every node past the junctions as a tank. A reservoir has no area, so the volume at
the control level and at the node's head are both 0 and the condition is met at every step, whatever level is
stated; the loop copies that (`rec.on = 'reservoir'`, `reset = true`). hydstatus.c `pswitch()` for a valve (PRV and
above) changes it when its setting differs from the control's, else when its status does (measured: an OPEN
control re-opens a valve stated Closed; two contradicting controls on one valve flip each trial in EPANET and
the case is not held). The solver builds its valve arrays once, so the loop judges a valve between solves
(`valveSwitch()`) and solves again from the same flows until nothing changes. Held by 11 cases in
`native-eps-harness.js` (a reservoir; PRV, FCV, TCV and PBV; setting and status changes).
Known and not part of this: an FCV at its limit in parallel with a narrow bypass differs by 0.02 L/s from EPANET
(a plain-solver gap, with or without a control).

## [RULES] EPANET refuses

`EngCalcs.lpnDiagnose` returns `rules-refused` with the rule names for a project that runs a period, whichever
engine is chosen: FILLTIME on a junction, a time EPANET cannot read, an action on a check valve, a link or node
that does not exist, a negative setting, a numeric action on a GPV, no premise or no THEN action. (A rule the
page's grammar cannot read is dropped by `assembleModel()` and said as a warning in both engines; it never
reaches either.) `native-rules-refusal-harness.js` runs each text through EPANET itself with the check off to
show EPANET refuses it, and shows a rule EPANET reads but the loop does not copy is not named.

## Pressure-driven demand (PDA)

Transcribed from OWA-EPANET 2.3.5 hydcoeffs.c (`demandcoeffs`, `demandheadloss`, `addlowerbarrier`,
`addupperbarrier`) and hydsolver.c (`newdemandflows`, `pdaconverged`, `hasconverged`). A junction of positive full
demand is an emitter-like element with head loss `dP (D/Dfull)^(1/Pexp)` and EPANET's smooth barriers at both
ends (constants 1e9 and 1e-6, in ft and cfs, converted); the delivered demand D starts at the full demand each
solve, is stepped toward the matrix head (clamped to 0.4 Dfull a trial, scaled by the damping factor), and the
solve is not converged until every D is within 0.0001 cfs of the demand function at the solved pressure. Junctions
of zero or negative demand stay fixed. `MINPDIFF` is taken as 0.1 (feet), which only matters when Required minus
Minimum pressure is under 0.1 ft; it could not be read from the source fetched and is not tested. The result carries
`demands` (delivered, emitter included, as EN_DEMAND) and `demandDeficits`; frames and the quality pass read them.
`lpnDiagnose` no longer refuses PDA under the built-in setting; `pda-pressures` still does. The page no longer
routes a PDA project to EPANET; the keys `lpn_engine_pda_route` and `lpn_diag_pda_needs_epanet` were deleted in all 27 files (nothing rendered them).
Held by `native-pda-harness.js` (23 checks): 11 constructed steady cases (exponents 0.5, 1, 1.5; a minimum
pressure; defaults; pressure under the minimum; zero and negative demand; a tank; an emitter), Net1 and Net3 with
PDA options and demands scaled until nodes starve (heads within 0.5 mm, flows within 0.02 L/s, delivered demand
within 0.0001 L/s), two 24 h periods, and water age over a starved period (nodes 0.06 s). Not held: PDA with
[RULES] that read a node's DEMAND (the rule reads the step's full demand, as for a demand-driven run).

## Flows in EPANET's cubic feet (the 17 mm gap)

EPANET divides every flow of an LPS file by 28.317 although a cubic foot is 28.3168466 L, so its hydraulics are the
physical problem with every flow (demands, emitter and curve flows, an FCV setting) 5.4e-6 smaller than exact SI. The
loop solves in those flows and reports the file's (`solveInFeet()` in js/lpn-native-run.js: inputs times
28.316846592/28.317, a pump's power-law coefficient times that to the power minus b, outputs divided back). Base Net3
went from 0.13 mm to 0.0014 mm of EPANET at every node. A closed link also carries head difference over CBIG
(hydcoeffs.c pipecoeff(), pumpcoeff()), and a tank's net inflow counts it (`opts.closedLeak`, `leakFlows`).

What is left at 1.5 is not a model error. Tank 2 reaches its minimum level at 15:07:56 within 1.5e-6 m (0.1 s of its
flow). EPANET's tank lands 6.7e-7 m above the minimum, so `tankstatus()` (strictly `head <= Hmin`) leaves its pipe
open for the next 3124 s and `tanklevels()` clamps the volume it cannot supply; the loop lands 8e-7 m below and shuts
it. Tighter EPANET convergence (FlowChange 1e-12) moves EPANET's side by 3e-7 m, not across the line. 1.5 is held to its
event (`native-analysis-wire-harness.js`), and 1.45, 1.48, 1.52, 1.55, 1.6 and 2 are held for the whole run.
