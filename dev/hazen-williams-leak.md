# The Hazen-Williams conversion leak

Diagnostic record for ROADMAP Task 144. Nothing here has been acted on; the task is open because the
decisive step is an observation nobody has made yet.

## The measurement (2026-07-27 usage snapshot, `dev/usage-data-log.md`)

`Hazen-Williams.php` draws **580 confirmed-human views** — the suite's second-biggest genuine front
door, at **18% human-of-reach** against Darcy-Weisbach's 4%. But only **11%** of those humans ever
calculate, against a **51–67%** band on six comparable pages, and against DW's **37%** on a
structurally near-identical page. That is roughly **517 lost humans per period**, more than exist on
every page below Manning-Trap combined, which makes it the largest single UX prize in the suite.

## What `human` and `used` actually require, and why the number may not mean a leak

From `js/Calculators.lib.js`: **`human` = JS executed + session ≥ 10 s old, and nothing else.
`used` = a user-triggered recalculation ≥ 10 s after load.** So any visitor that renders JS and
dwells but never types — a JS-rendering AI or preview crawler, or **a person reading the page for
reference** — inflates `human` and deflates `%used` simultaneously.

HW is precisely the page with the anomalous numerator (18% human-of-reach against 3–5% for its
structural twins), so one traffic-composition cause explains both anomalies at once, and no UX fix
would ever move it. Related: **"Hazen-Williams" names a *formula*, not a task.** People search it to
look up the equation or a C coefficient, and the page links out to a C-value table. Those visits are
*satisfied*, not lost, and are miscounted as a leak by construction. (DW is also a formula name but
draws only 4% human-of-reach, so it is not pulling a reference crowd at scale.)

An earlier version of Task 144 asserted that "instrumentation is shared and identical across pages,
so this is real behavior, not a measurement artifact." **That is a non sequitur** — identical
instrumentation does not imply identical traffic composition. Do not rely on it.

## The audience model (Tom, 2026-07-28), which reweights everything

> `mphl_` is a storm drain and culvert calculator, `hw_` is a waterline calculator, and `dw_` is what
> engineers outside the US use.

`Hazen-Williams.php`, `Darcy-Weisbach.php` and `Manning-Pipe-Head-Loss.php` are structurally
near-identical — verified by reading all three: same inputs (`q`=1, `d`=1, `l`=1000, `km`=2.0,
`egl1`=0), same SI-first unit lists, same EGL/HGL result rows, same tips. They differ only in the
roughness input (C vs e+ν vs n) and DW's extra Reynolds/regime/f rows.

A first CC analysis used that to kill four of five candidate causes, on the grounds that anything
identical across pages cannot explain an 11% / 37% / 58% spread. **The filter survives only in its
narrow form** — any explanation must run through an *audience* difference — and CC then ranked the
audience-difference survivors as weak, when the domain model above makes them the **leading**
candidates. That ranking was wrong and is corrected here.

Two page-design explanations do stay dead: pressure-vs-head (every head field on all three already
offers psi/kPa/bar/mH2O) and "too much on the page".

## Why SI-first defaults cost the most on this page specifically

Hazen-Williams is empirical, water-only, and its user base is unusually unit-monolingual: US
municipal water distribution (AWWA) and **NFPA 13 fire-sprinkler hydraulics, which mandates
Hazen-Williams by name**, both work natively and almost exclusively in **gpm, psi, inches, feet**.

The page opens on `m3ps`/`m`/`mh2o`. Worse than the units is the **scale**: the default q = 1 m³/s is
**15,850 gpm** through a 1 m (39") main — a city transmission line — when a typical arrival wants a
6" main at 400 gpm. Every field is wrong *and* off by a factor of ~40. A DW visitor, being metric
already, changes numbers; an HW visitor must change four unit dropdowns *and* four numbers before the
page says anything true. The `C` default of 100 ("old pipe") compounds it — new-main practice is
130–140, and NFPA wants 120 (steel) or 150 (CPVC).

Note `mpf_` converts at **67% with those same metric defaults**, which is strong evidence they are
not independently fatal.

## The one structural difference from the pages that DO convert

`Manning-Pipe-Flow.php` and `Manning-Trap.php` are the **only two calculators in the suite with an
inverse solver** (`solverControlHtml`), and they are the two highest converters (67%, 61%). HW, DW,
MPHL, IP and Orifice have none. A waterline designer's actual job is *sizing* — given flow, length
and allowable loss, find the diameter — which matches the suite's own design-not-analysis principle,
and HW offers only the forward direction.

It is **not** a complete explanation: MI, MPHL, WFS and WFI convert at 51–59% with no solver. But it
is the one structural asymmetry between HW and the 67% page, and it was absent from the original
hypothesis list.

## Tom's scope hypothesis

Tom, 2026-07-27: people searching "Hazen-Williams" may simply not be satisfied by a *single-line*
calculator. They arrive with a **network** to solve and find one pipe segment; what they want is
`bpn_` or a looped-network solver, and the 89% who leave are driven to EPANET or WATERCAD. On this
reading HW is not broken — it is **not enough**.

That makes the Task 138 HW→BPN link a partial test, and cheap to observe: if BPN's human count climbs
while HW's conversion stays flat, the leak is scope, not usability.

## The decisive next step — observe, do not guess

Pull the **HW page's own Search Console query export** — the same source that produced the sewer-slope
query data in Task 151. Segment for:

- **fire protection** (`sprinkler`, `NFPA`, `fire flow`, `friction loss psi`) — a large US audience
  with rigid unit expectations
- **unit words** (`gpm`, `psi`, `inch`) — direct confirmation of the defaults hypothesis
- **sizing intent** (`pipe size for`, `water main sizing`) — direct confirmation of the solver gap
- **`c factor` / `c value`** — the reference-lookup reading, which Tom does not buy and which this
  export can settle either way
- **Spanish / Portuguese** (`pérdida de carga`, `perda de carga`) — Hazen-Williams is standard
  practice in Latin America, so a non-US metric segment may be present and would argue *against*
  flipping the defaults wholesale

If the queries are `hazen williams c values` / `formula` / `equation`, this is reference demand and
the right response is a **C-value table on the page**, not a network solver. If they are
`hazen williams calculator` / `pipe pressure loss calculator`, it is a real UX leak.

**The prioritization half of this is spent:** the looped-network calculator was built and Task 146 is
closed, so there is no longer a task to promote or hold back. What survives is the measurement
question — the 11% number alone still does not distinguish reference demand from a UX leak, and the
Search Console segmentation below is still the way to tell.

## Cheapest candidate intervention, if the export supports the units hypothesis

Default `Hazen-Williams.php` to the `in` unit set at a realistic waterline scale (6", 400 gpm,
1000 ft, C = 130). This needs **no new translation** — the unit sets already exist and defaults are
numbers — making it the cheapest testable change on the board. The `in` set already maps to
in/gpm/psi/ft²/ftps, so no unit work is needed either; only a decision about the *initial* selection,
which today is simply the first entry in each `units` array. Do not ship it before the export:
per-page default divergence is a real cost, and the Spanish/Portuguese segment could argue against it.

## Extracted

Q3, EGL-vs-HGL input, is **Task 167** — extracted 2026-07-28, because the "identical pages" filter
that dismissed it does not survive the audience correction above.
