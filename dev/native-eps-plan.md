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
   (see Reports, Run report). EPANET-MSX stays on EPANET.

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
`lpn_time_run_fell_back`, `lpn_settings_engine_native_tip`, `lpn_notes_1_def`. What stays
true: js/lpn-solver.js solves one instant, and a period no engine can run is shown as one instant.

## What still falls back to EPANET under the built-in setting (updated 2026-11-01)

Built on `feat/native-wire` after the first inventory: every run path asks one door (`EngCalcs.lpnTimeRunModel`,
the engine choice the transport uses); a control on a reservoir and a junction-pressure control on a valve; a
pump with no curve on a speed pattern (already a pipe in both engines; now held); the rules EPANET refuses,
named by `lpnDiagnose`; and pressure-driven demand, steady and period.

**A period the transport runs** (`lpnTimeNativePlan()`; the status bar names the element or setting):

| Falls back for | Where it is decided | Why it stays |
|---|---|---|
| EPANET-MSX (`model.msx`, mode `msx`) | `native-run-quality` | Slices 1 to 5 are built (`## EPANET-MSX in the built-in solver`); the loop runs a file it can read, and leaves to EPANET: a file with a line it cannot read or an expression missing (named by line and code), a tank that is a 2-compartment or last-in-first-out tank (named by tank), a tank with no area. |
| A hydraulic step under 10 s with any rule | `native-run-rules` | EPANET's rule step is the hydraulic step over ten in whole seconds, so under 10 s it is zero and `% 0` stops the engine (measured: `lpnEpanetRun` returns not-ok with no issues). There is no answer to match. |
| A speed pattern on a pump the page did not model (no unscaled curve), or with a negative multiplier | `native-run-speed-pattern` | Not a page model. A negative multiplier makes EPANET itself return NaN (measured), so there is no answer to match. |
| A tank volume curve with no usable rows; a tank level outside its limits; a quality, energy or control input EPANET refuses (errors 207, 211, 213, 217, 225, 230) | `native-run-volume-curve`, `-tank-levels`, `-quality`, `-energy`, `-control-unsupported` | EPANET errors on each, so the answer is the same refusal in both engines. Rules got their named refusal (`lpnDiagnose` `rules-refused`); these five have not been moved to `lpnDiagnose` yet. |
| A step the built-in solver cannot solve (`lpnDiagnose`), or a loop that throws | `finish(null)` in `periodRun()` | A real failure, shown as EPANET's answer. |

**Not a run, and not changed**: the run's warnings in EPANET's words (`nativeWarnings()`
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
(hydcoeffs.c pipecoeff(), pumpcoeff()) (`opts.closedLeak`, `leakFlows`), which starts the next step but is not a tank's inflow.

Tank 2 at 1.5 reaches its minimum level at 15:07:56 to within 1.5e-6 m. `tanklevels()` snaps a draining tank to its
minimum only when `V - q <= Vmin` (a full second of flow below it), so EPANET leaves tank 2 a hair below the minimum for
hours and `tankstatus()` (`head <= Hmin`) calls it empty; its solve uses that head. The loop used to hand the solver the
limit itself (`solverLevel()`), 7.9e-6 m too high, which moved the tank's pipe flow by 2.5e-4 of itself and landed the
tank 1.8e-6 m on the wrong side of the line. The true head goes to the solver now, and the shut-tank test accepts a level
below the minimum. Neighbouring multipliers, 1.5 itself and the base run are held for the whole run to 0.004 mm
(`native-analysis-wire-harness.js`). Also copied from the source here: only a link above CLOSED adds to a tank's net
inflow (newlinkflows()). Tried and left out because nothing it touches is measurable: a pipe's friction gradient under RQtol
becoming RQtol / Hexp (pipecoeff()), RQtol 1e-7 rather than 1e-6 for pipes and pumps, and EPANET's PI (3.141592654) in the
first flows; together they push Net2's water age 3.95 s from EPANET's, past its 3 s tolerance (of 190 000 s). The pipe to Tank 2 is in that low-flow line, so its
flow is the leftover of the network around it: a one-ulp change to one pipe's roughness moves the loop's tank landing by 4e-7 m
and EPANET's by the same, which is why the landing must be decided by the head handed to the solver and not by luck.

## The rule premises that fell back (native-wire, slice 3)

Copied now, from rules.c `checkvalue()` and input1.c/input3.c: a pipe's SETTING (LinkSetting is Kc, which inithyd() fills;
rules.c converts it for PRV, PSV, PBV and FCV only, so a Darcy-Weisbach roughness is held in feet and compared with the number
as typed in millimetres); a GPV's SETTING (the index of its curve, read from the file the bridge writes, or the 0 of the
throttle a curveless GPV is written as); and a reservoir's LEVEL and PRESSURE (its head less its base head, which EPANET
keeps in the node's elevation, so 0 until a head pattern moves it). Held by 8 cases in `native-eps-harness.js` and by
`native-rules-refusal-harness.js`, which now says the loop copies them.

## Run report and warning words (native-wire, slice 4)

`EngCalcs.lpnNativeRun(...).report` is EPANET 2.3.5's text report, written as the run goes from report.c, epanet.c and
hydraul.c's own strings (text.h FMT18 to FMT69, WARN01 to WARN06): the banner, the summary of the project, "Analysis begun",
"Hydraulic Status:", then for every instant "Balanced after N trials", each tank and reservoir whose state changed
(thresholds on its net inflow of 0.001 cfs), each link whose status changed (pipes, then pumps, then valves, EPANET's
numbering), the control and rule actions in the order they act, the WARNING lines (negative pressures, a valve that cannot
deliver, a pump past its curve or unable to lift, disconnected nodes and the closed link that cuts them off, unbalanced),
the flow balance and "Analysis ended". Held to EPANET's own report line for line, the three clock stamps aside, on Net1,
Net2 and Net3 at Accuracy 1e-5 and 1e-3, on Net3 with its demands raised, and on warning cases
(`native-report-harness.js`, 22 checks), and on every constructed case of `native-eps-harness.js`.

What makes the trial count equal: the solve stops at EPANET's trial (`opts.epAcc`, hasconverged(): total flow change within
Accuracy of total flow, Accuracy clamped to 1e-5 .. 1e-1, 0.001 when none is stated), from the flows EPANET starts from
(initlinkflow(): a closed link QZERO, a pump its speed times its design flow, every other link 1 ft/s; later steps from the
last flows, a closed link's being its leak), and a pump's flow is read as it stands (no floor), as pumpcoeff() reads it.
**This changes the answer the page gives under the built-in setting:** it is now EPANET's trial's, not a tighter one, so at
the page's default Accuracy of 0.001 the heads are EPANET's, to the last digit, and equally loose.

**Valve status is carried, as EPANET carries it.** The solver started every solve with each pressure or flow valve ACTIVE and
with the valve's flow at 1 ft/s, so a step after a valve had gone open or closed took 5 trials where EPANET took 1 (a closed
valve's flow of 0 was thrown away as "no previous flow"). The loop now hands the next solve the status the last one ended in
(`valveStart`) and the flow it ended with (a closed valve's being EPANET's leak, QZERO). Constructed valve cases whose trial
counts now equal EPANET's: PRV, PSV, FCV (twice) and a GPV's setting as a premise (at the first step that
differed the loop took 5, 5, 2, 2 and 2 trials against EPANET's 1, 3, 1, 1 and 1; now equal); a PBV that EPANET balanced in 6 trials and the loop called "Unbalanced after 13" is now balanced in 8.

**Not held**, said where they are (11 constructed cases print `GAP`): a PBV stopped by a control (8 trials against 6), a
pressure control on a junction (every case: the first solve of the run takes 2 to 7 trials where EPANET takes 4 to 20), a
Darcy-Weisbach project and a pump speed pattern that discards a stated speed (one trial apart at the first step). The flow balance's numbers agree to 2e-5 of themselves.
Quality runs write the summary lines for the analysis but not EPANET's "Water Quality Mass Balance" block.

## EPANET-MSX in the built-in solver

Tom, 2026-11-01: *"I'd prefer to implement EPANET-MSX even if it causes us a delay. There is no rush on this."* and *"Trudge forward."*
`dev/msx-scope.md` Phase 3 ("do not start until Phase 2 has users") is superseded by that call.

### What MSX computes (EPANET-MSX 1.1 / 2.0, read from the source, not from memory)

The reference implementation is OpenWaterAnalytics/epanet-msx, `src/` (msxqual.c, msxchem.c, msxtank.c, rk5.c, ros2.c,
newton.c, msxutils.c, mathexpr.c, msxinp.c, msxproj.c), Copyright (C) 2007 Feng Shang, Lewis Rossman and James Uber (US EPA).
**Licence:** `doc/license.txt` in that repository is the GNU LGPL v3 (with `dev/msx-scope.md` having said MIT, which was wrong
or out of date); LGPL v3 and this project's GPL v3 combine, and every file written from it names the source and carries that
notice. The vendored epanet-js build already runs it (the page's Phase 2); that WASM engine is the test oracle here.

- **Input.** A second file, `model.msx.text`: `[OPTIONS]` (AREA_UNITS FT2 default, M2, CM2; RATE_UNITS **DAY** default, SEC, MIN, HR;
  SOLVER EUL default, RK5, ROS2; COUPLING NONE default, FULL; TIMESTEP 300 s; RTOL 0.001; ATOL 0.01; COMPILER ignored),
  `[SPECIES]` (BULK or WALL, units, optional ATOL and RTOL), `[COEFFICIENTS]` (CONSTANT, PARAMETER), `[TERMS]` (named
  expressions), `[PIPES]` and `[TANKS]` (one RATE, FORMULA or EQUIL expression per species; tanks reuse the pipe set when none is
  given), `[SOURCES]` (CONCEN, MASS, SETPOINT, FLOWPACED; species, node, strength, pattern), `[QUALITY]` (GLOBAL, NODE, LINK
  initial values), `[PARAMETERS]` (PIPE and TANK overrides), `[PATTERNS]`. Expressions are + - * / ^, unary minus, parentheses and
  the functions abs, sgn, sqrt, step, exp, log, log10, sin, cos, tan, cot, asin, acos, atan, acot, sinh, cosh, tanh, coth,
  asinh, acosh, atanh, acoth; they may use any species, term, parameter, constant, and the pipe's hydraulic variables
  D (diameter, project length unit), Q (flow), U (velocity), Re, Us (shear velocity), Ff (Darcy-Weisbach friction factor),
  Av (wall area per volume, area unit per litre) and Kc (roughness). In a tank the hydraulic variables are 0.
- **Hydraulics.** MSX reads EPANET's saved hydraulics (node demands D, heads H and link flows Q as 4-byte floats, step by step),
  so it runs after the hydraulic run and over the same records the water quality pass already keeps (`hydRecord()`).
- **Transport.** Time-driven, not event-driven: every quality step (TIMESTEP, cut to land on each hydraulic change) does, in order,
  react every segment of every pipe and tank (`MSXchem_react`), advect (wall species only: the entering segment takes the
  volume-weighted wall concentration of the segments displaced, and the rest shift), accumulate (take the flow volume from the
  leading segments of each pipe into its downstream node; a pipe whose volume is less than the flow passes the upstream node's
  concentration), update nodes (mix inflows; a tank by its mixing model MIXED, 2COMP, FIFO or LIFO; new equilibrium), add
  sources (CONCEN on external inflow, MASS, SETPOINT, FLOWPACED) and release (a new segment at the entrance of each pipe, or
  the last segment grown when its concentrations are within every species' ATOL of the new ones).
- **Chemistry in a segment.** RATE species integrate dC/dt over the step in RATE_UNITS by Euler (clipped at 0), RK5 (Cash-Karp/
  Dormand-Prince, adaptive, with its remembered step `hstep` kept on the segment, tolerances per species) or ROS2 (a two-stage
  Rosenbrock, adaptive, forward-difference Jacobian eps 1e-7). EQUIL species are the solution of a Newton system (20 iterations,
  3 significant digits, the Jacobian by central differences of eps 1e-7) after every reaction, and inside every rate
  evaluation when COUPLING is FULL. FORMULA species are evaluated last. Negative results are clipped to 0.
- **Outputs the page shows.** Per reporting time, per node and per link, one number per species in the file's order, in the
  species' units (wall species per AREA_UNITS, none at a node): a node's concentration (a tank's own) and a link's volume-weighted
  mean over its segments, as `MSXqual_getNodeQual()` and `MSXqual_getLinkQual()` give them (`frames[].msxNodes`, `.msxLinks`,
  `msxSpecies`). **The MSX text report is produced** (msxrpt.c, in the vendored engine's 2.0.0 words) by both solvers when the
  file's `[REPORT]` section flags a node or a link: after "Analysis ended", a logo, the title and one series table per flagged
  node and link (species YES/NO and precision, PAGESIZE), held to the engine line for line by `native-msx-report-harness.js`.
  The engine ignores `[TIMES] Statistic` here (it prints series for all four values), so the loop does. The engine's
  "Water Quality Mass Balance" blocks after the tables are not written by the loop.

### Test cases

EPA's arsenic oxidation and adsorption example (`dev/lpn-spike/fixtures/msx-example/`: As5Adsorb, with its published `.rpt`),
the one-species chlorine decay (`dev/lpn-spike/fixtures/chlorine-decay.msx`) on Net1, EPANET's own chemical analysis as the
cross-check of the decay (`msx-run-harness.js` already holds both against the engine), and constructed networks run through
both engines by `native-msx-harness.js`: each solver, FULL coupling, equilibrium, wall species, every source type, every tank
mixing model, a pattern, per-pipe parameters.

### Slices (each ends with its harness green and a commit)

1. **The file and the expressions.** `js/lpn-native-msx.js`: the `.msx` parser with MSX's defaults, units and errors (named, in
   the file's words), and the expression evaluator. Held by `native-msx-harness.js` against the engine's own reading of the
   same files (`msxGetCount`, `msxGetSpecies`, `msxGetConstant`, `msxGetParameter`) and by hand-computed expressions.
2. **The chemistry of one segment.** EUL, RK5, ROS2, Newton, equilibrium, formulas, coupling. Held by a reaction-only network
   (no flow, one pipe, one tank) against the engine at 1e-6 relative.
3. **Transport and nodes for bulk species**, a MIXED tank, sources and initial quality. Held on Net1 and the chlorine decay.
4. **Wall species**, the arsenic example against its published report and the engine.
5. **Tank models 2COMP, FIFO, LIFO**, per-element parameters, patterns on sources.
6. **Wiring.** The run no longer falls back to EPANET for a file the slices cover; `lpnNativeRunRefusals` names what is not covered.

### Built so far (native-wire, 2026-11-01), and what it found

`js/lpn-native-msx.js`, `native-msx-harness.js` (66 checks, about 10 s). **Done: slices 1 to 5 and the wiring of slice 6.** Not done:
2-compartment and last-in-first-out tanks under MSX (left to EPANET, by tank name), and one dead-end node on Net3 (below).

Against the vendored engine, every species at every node and link at every reporting time (13 775 values on Net3, 1 125 on
the arsenic example, 1 525 on Net1):

| Case | Worst gap |
|---|---|
| EPA's arsenic example (equilibrium, formula and wall species, term with Av), EUL, RK5, ROS2, coupling NONE and FULL | 7e-14 (EUL, RK5); **7e-7 (ROS2)** |
| Net1 with a decaying chlorine, RK5 | 3.2e-4 mg/L |
| Net1 with two bulk species and a wall species, a term, a parameter override, a pattern, two sources, each solver and coupling | 2.6e-4 |
| Net1 with SETPOINT, FLOWPACED (on a pattern), MASS and CONCEN sources; tank MIXED and FIFO | 2.6e-4 |
| Net3 (pumps closing, three tanks, two reservoirs), three species | **1.2e-3**; every value but one dead-end node is within 4e-4 |

Where the vendored engine departs from epanet-msx's main branch, found by running both (each is a comment at its line):
a pipe never holds more than its own volume (the segment released into it is capped at the link's volume); a link whose volume is
no more than the flow volume (a pump or valve always) passes all it holds and the rest of the flow volume as the upstream node's own
water, and is emptied; a reservoir's formula species are evaluated; a tank's rate species start from the SEGMENT's concentration, not
the tank's (the main branch makes every segment of a FIFO, LIFO or 2COMP tank follow one curve); LIFO removes the newest
segment by `next`, not `prev`. And one defect in this repository's bridge, corrected: `lpnToInp` did not write `[MIXING]` for an
MSX run, so every tank mixed completely in the EPANET engine whatever the page said; it does now.

The Net3 gap was how a pipe that moves several of its volumes in one quality step hands water downstream. The vendored engine
sends the water a pipe cannot hold (flow volume past link volume) from the upstream node's concentration AS THAT NODE WILL MIX IT
THIS STEP: everything the links into it bring, so they are taken first (the loop sorts the links in flow order each hydraulic
step), mixed with any external inflow as `updateNodes()` does, and the average of the segments around the node when nothing flows
in; a reservoir or tank sends the concentration it has. Found by two small chains of short pipes in `native-msx-harness.js`
(exact to 1e-15 whichever way the links are numbered), not by reading the source: epanet-msx's main branch sends the first
segment's quality for all of it and does not fit. A pump or valve holds no segment at all, so none is averaged at the node it
feeds once it stops. Net3 went from 3.0e-2 to 1.2e-3; the harness holds it at 0.0012. What is left is node 15, a dead end
whose pipe carries 1e-8 L/s of noise in both hydraulic runs (opposite signs): the same quality hour differs by 1.3 per cent
there, 1e-3 of a milligram per litre. Feeding the loop's quality pass EPANET's own flows did not move it, so it is in the
transport of a near-stopped pipe, not in the flows; not found. Narrowed 2026-11-01: the pipe's own mean quality agrees with the
engine to six digits at every hour (so the segments hold the same water), and node 15's value is the engine's alone to differ,
by the concentration of the pipe's third segment against the loop's first (0.05825 against 0.05710 mg/L at 8 h); giving the loop
EPANET's flows at every reporting time, zeroing every flow under 1e-5 cfs, and forcing the noise flows positive, each left
node 15 at 0.057105 to five digits, so the loop's value does not depend on the sign or size of the noise. What stays unknown
is the engine's segment order at its unreported hydraulic steps. The 2COMP gap (0.017, a tank's own concentration) and the LIFO
gap (0.009) are measured the same way and not claimed.
