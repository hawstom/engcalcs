# Native extended-period simulation: phase plan (Task 733, phase 3)

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
   increase). Tests: `native-eps-energy-harness.js` (the Net3 report, 13 priced and unpriced Net3 and
   constructed cases, Net1 with controls and rules, 7 refusals) and `native-eps-examples-harness.js`
   (the five pumped gallery examples with a price, pattern, demand charge and efficiency curves added
   through `assembleModel()`, with and without a speed pattern, in US and SI units).
7. **Wiring to the page**, last, and only on Tom's word: `lpnTimeRun` uses the native loop when the
   engine setting is built-in and nothing is refused; the transport, frames and Run box are
   unchanged because the frames have the shape `lpnEpanetRun` resolves to. Water quality and
   EPANET-MSX are not planned for the built-in solver; they stay on EPANET.

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
- **The truth is the engine's binary output, not the page's figure.** The page's own energy result
  (`lpnEnergyAccumulate` on `EN_ENERGY` samples) is NOT addenergy(): it calls a pump "on line" when its
  power is above 0, where EPANET does when its efficiency reads above 0 (open, whatever the flow), and
  it reads nothing for a single instant (the step is 0), where EPANET adds one hour. The loop copies
  EPANET, so on a pump left open with no flow the two engines' energy results will differ by that
  definition, not by arithmetic. Slice 7 should pick one on purpose. The harness reads the energy
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
  power by flow (floored at 1e-6 cfs), so the hours spent there differ by up to 10 percent of that
  column. Average kW, peak kW, usage, efficiency and cost agreed to 1e-7 on the same case. The harness's
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

## Wording

"The built-in solver solves one instant" (CLAUDE.md, `lpn_time_no_engine`, `lpn-time.js` comments)
stays true until slice 7 ships to visitors. It becomes false for the networks a slice covers at that
moment, not when the code merges. Do not edit it earlier.
