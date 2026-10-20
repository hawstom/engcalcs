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
2. **Simple controls** (`[CONTROLS]`: timer, clock time, tank level, node pressure; link status and
   setting actions; `controltimestep()`). Test: Net1 and Net3 with their own controls, against
   `reference/Net3.rpt` and EPANET at every step; a control that fires inside a step.
3. **Pump speed patterns and pump status** (`demands()` applies a pump's pattern each period).
   Test: `pattern-attach.inp`, Net3 with a speed pattern added.
4. **`[RULES]`** (`ruletimestep()`, rule step). Test: the Net1 rules examples
   (`net1-rules-harness.js`), rules that fire between hydraulic steps.
5. **Tank volume curves, minimum volume, overflow** (`tankvolume()` / `tankgrade()` interpolation).
   Test: a tank on a curve against EPANET across a full and an empty event.
6. **Pump energy** (`addenergy()`): kWh, cost, peak. Test: Net3's energy report.
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

## Wording

"The built-in solver solves one instant" (CLAUDE.md, `lpn_time_no_engine`, `lpn-time.js` comments)
stays true until slice 7 ships to visitors. It becomes false for the networks a slice covers at that
moment, not when the code merges. Do not edit it earlier.
