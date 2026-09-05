# Pump energy and cost in `lpn_`

What shipped, what it is anchored against, and what `[ENERGY]` still does not do. Written
2026-09-04, closing the `[ENERGY]` row of ROADMAP Task 566: *"a real deliverable for a utility, and
the one section here whose ANSWER is money."*

Copyright 2009 Thomas Gail Haws. GNU GPL v3 or later.

Built on exactly the pattern `dev/water-quality.md` records for `[REACTIONS]` and `[QUALITY]`:
**interpret beside the carried text, never over it.**

---

## What it answers

For each pump, over an extended-period run: the fraction of the time it ran, the efficiency it ran
at, the average power while running, the peak power, the energy used, and what that cost. For the
network: total energy, cost of energy, the highest power every pump drew at one moment, the demand
charge levied on that peak, and the total.

Doors: **Settings > Calculation > Energy** for the network's efficiency, price, price schedule,
demand charge and currency; the **pump popup** for a pump's own price and price schedule; and
**Project > Pump energy** for the report.

## It is EPANET-only and RUN-only

Energy is power integrated over time, so there is no such thing as a day's pumping cost at one
instant. It rides on the extended-period run (Task 248) and `js/lpn-solver.js` has nothing to do.
With the engine unreachable, or before a run, the box says so and shows no table. Same ruling as
water quality, for the same reason.

**There is no verdict and there must not be one.** No pumping cost passes or fails; what a
kilowatt-hour is worth is a local fact. The report states the numbers and stops.

## The arithmetic, and where it runs

`js/lpn-epanet.js`. At **every hydraulic step** the bridge reads `EN_ENERGY` (the pump's power in
kW) and `EN_PUMP_EFFIC` (percent) for each pump, resolves the price that applies at that moment, and
accumulates. That is EPANET's own `addenergy`, written out:

    time on line += dt      efficiency += e dt      kWh += P dt
    peak kW = max P         cost += price(t) P dt

then average power and average efficiency over the time the pump **ran**, usage factor over the
whole duration, and the demand charge on the peak of the **total** power of all pumps at once.

- **EVERY HYDRAULIC STEP, NOT EVERY REPORTED FRAME.** `nextH()` also stops when a tank fills and
  when a control fires, and those steps are shorter than the reporting step and are discarded from
  the frames. Integrating over frames weights a five-minute tank event as an hour. This is the one
  thing in that file that must not move into the `isReportTime()` branch.
- **`EngCalcs.lpnEnergyAccumulate` and `lpnEnergySummary` are pure**, so the money is testable with
  no engine in the room; resolving *which* price applies at time `t` is a question about patterns and
  stays in the bridge.
- **"On line" is decided by power > 0**, where EPANET's own rule is the pump's status. They agree
  wherever a control switches the pump (Net3's two usage factors land on EPA's own). They part on a
  pump left OPEN with nothing to deliver, which draws a whisper and reads here as running.

## Units: there is no `engineEnergy()` clone, and that is a finding

`engineHydraulics()` and `engineQuality()` exist because a head error is a head and a first-order
wall coefficient is a length per day. **Nothing in `[ENERGY]` is dimensioned.** An efficiency is a
percent; a price is a currency per kWh and a demand charge a currency per peak kW; EPANET reports kW
and kWh whatever the flow units are. The dimensioned quantity in pump energy is the **head**, and it
is SI on the model long before `docEnergy()` is reached. Asserted rather than asserted-by-absence:
the harness builds one document and checks the energy record is byte-identical under the US and the
SI preset.

**A currency is a LABEL**, like the concentration unit beside a chemical's name: carried, shown
beside every money figure, converted by nobody. There is no currency family, no factor, and nothing
for `unit_factor_check.php` to check. It travels in the project and **not** in an `.inp` export --
`[ENERGY]` has no currency field.

## No default price, and the note says why

Task 530's ask-or-disclose posture. Both money boxes open empty, `lpn_energy_price_note` says in the
box that this page offers no price of its own and why (a tariff differs by utility, country, hour and
year), and a run with no price reports a cost of exactly zero rather than a plausible invented
figure. The **efficiency** is different in kind and is quoted rather than typed: 75 percent is
EPANET's own default for a document that says nothing, so naming it in the tip reports what will
happen instead of recommending a value.

## Where each value lives

| Value | Home | Written through |
|---|---|---|
| Global efficiency, price, price pattern, demand charge | `settings.energy` | the Settings rows |
| Currency label | `settings.energy.currency` | the Settings row (ours, not EPANET's) |
| A pump's own price and price schedule | the pump, `energyPrice` / `energyPattern` | **`setProp()`**, and both are in `LPN_OVERRIDABLE.link` |
| A pump's efficiency CURVE id | `settings.energy.effic` | nothing -- carried, round-trips, honoured, no control |

A document-level option has no element to key on, which is why the globals are a setting and not an
override -- the same split the reaction globals and the scenario demand multiplier already make.

**The efficiency curve is HONOURED as of Task 582, and this paragraph used to say it was not.**
`PUMP <id> EFFIC <curve>` references a `[CURVES]` entry, and this page still keeps no general curve
library (a pump's head curve lives on the pump), so nothing EDITS such a curve. What changed is that
its points are kept, written back, and put on the engine input beside the `EFFIC` row that names
them -- renamed `EF_<pumpid>`, because the head curves there are `C_<pumpid>` and a document curve
called `C_10` would otherwise overwrite pump 10's head. The abscissa is a flow in the project's own
unit and the engine input is always LPS; that conversion is the whole risk, and it is anchored
against a hand-computed 62.5% in `dev/lpn-spike/pump-effic-curve-harness.js`.

**Writing the `EFFIC` row without its curve was a live export defect**, not merely a missing
feature: naming a curve the file does not contain is how EPANET comes to reject a network it would
otherwise solve, so every export of such a document produced a file real EPANET refused.

**One gap is left and the report still names it**: an `[ENERGY]` row naming a curve no `[CURVES]`
section defines. Such a pump runs at the network efficiency, and the report says which pumps rather
than letting their efficiency column quietly disagree with EPANET's own.

## What it is anchored against

`dev/lpn-spike/energy-anchor-harness.js`, and every assertion in it says which of three kinds it is.

1. **PUBLISHED. EPA's own `Net3.rpt` carries an Energy Usage table** -- and this is the strongest
   anchor available, a document nobody here wrote. Usage factor, average efficiency, average kW and
   peak kW, for both pumps, reproduced to **the report's own two decimals**:

   | Pump | Usage | Avg. effic. | Avg. kW | Peak kW |
   |---|---|---|---|---|
   | 10 | 58.33% | 75.00% | 62.06 | 62.76 |
   | 335 | 28.74% | 75.00% | 309.38 | 310.79 |

   Reproducing them says the power comes out of the engine right, that "average" means over the time
   the pump RAN (pump 10 averages 62.06 against a 62.76 peak at 58% usage; an average over the
   period would be near 36), and that the integration is over every hydraulic step.
2. **ANALYTIC.** A pump moving a measured flow against a measured head must draw
   `P = rho g Q H / efficiency`. Measured: **0.044%** against the engine, which is the density
   (EPANET works in 62.4 lb/ft3 = 9802 N/m3 against 9806.65) and nothing else. Run at two demands
   with the working point moving, so a frozen power cannot pass; and halving the efficiency doubles
   the power to 4 decimal places, so a page silently running everything at EPANET's default 75 would
   fail.
3. **ARITHMETIC ON GATHERED NUMBERS.** kWh, cost, a half-then-double price schedule (1.25x the flat
   day), a pump's own price overriding the network's, and the demand charge -- each hand-computed
   from a power the two anchors above already hold. Plus a two-pump case where the peaks fall in
   different hours, because the sum-of-peaks mistake is invisible on one pump.

**No published anchor for the money exists and none was faked.** Net1, Net2 and Net3 all state
`Global Price 0.0` and `Demand Charge 0.0`, so every cost in every published report is 0.00. The
power columns are anchorable and the cost column is not.

The byte-identical round trip of the section itself is asserted in the harness and by
`dev/lpn-spike/inp-export-harness.js`, which runs Net1/2/3 through `docFromInp()` and the exporter.

## Still not built, deliberately

- **An efficiency curve control**, and the general curve library it would need.
- **A Tables column and a Find-and-replace field** for the per-pump price -- the same gap the two
  per-pipe reaction coefficients still have.
- **kWh per unit volume pumped**, which EPANET's report prints as kWh/Mgal. It needs a volume unit
  this page does not have a family for, and the four columns above answer the question it is usually
  asked for.
- **A cost per day normalisation.** EPANET's report scales its cost column to 24 hours; this reports
  the cost of the run that was run, and says how many hours that was.
