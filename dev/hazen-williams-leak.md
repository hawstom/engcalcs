# The Hazen-Williams conversion leak

Diagnostic record for ROADMAP Task 144.

**READ THIS FIRST: the intervention this document proposed has SHIPPED, and the outlier it was
written about is not visible in the current measurement.** Both are established below. What is left
of the task is one reading of the rebuilt usage report, and it is not the Search Console export this
document used to call decisive.

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

**Until 2026-07-28 the page opened on `m3ps`/`m`/`mh2o` at q = 1 m³/s** — **15,850 gpm** through a
1 m (39") main, a city transmission line, when a typical arrival wants a 6" main at 400 gpm. Every
field was wrong *and* off by a factor of ~40, and the `C` default of 100 ("old pipe") compounded it
against a new-main practice of 130–140 and NFPA's 120/150. A DW visitor, being metric already,
changed numbers; an HW visitor had to change four unit dropdowns *and* four numbers before the page
said anything true.

That is the shape of the argument that produced the intervention below, and it is recorded because
it is the reasoning a future reader would otherwise re-derive — **not because the page still behaves
that way.** It does not; see "The intervention SHIPPED". The counter-evidence is also worth keeping:
`mpf_` converted at **67% with those same metric defaults**, which is strong evidence they were not
independently fatal.

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

## The intervention SHIPPED, one day after the measurement

The "cheapest candidate intervention" this document proposed — *"default `Hazen-Williams.php` to the
`in` unit set at a realistic waterline scale (6", 400 gpm, 1000 ft, C = 130)"* — went in on
**2026-07-28** as part of `9c47608f` (ROADMAP Tasks 162/164/165/166/167, "named unit families, real
defaults, upstream-first HW"), the day after the 2026-07-27 snapshot that produced the 11%. Read out
of the rendered English page today, field by field:

    q = 400 gpm    d = 6 in    l = 1000 ft    c = 130    p_up = 60 psi

That is the proposal verbatim. The SI-first defaults hypothesis is therefore **no longer a
hypothesis to test but a change already made**, and every reading below is post-intervention.

## The outlier does not reproduce

The 2026-08-21 report gives Hazen-Williams **use-of-shopping 58% (7 of 12)**. `shopping` is the same
counter the 2026-07-27 table called `human` — renamed, not redefined — so this is the same ratio that
read 11% (63 of 580). Within its own table 58% is unremarkable: MPF 78%, MTC 77%, MI 71%, DW 56%,
MPHL 25%, BPN 20%. **Hazen-Williams is no longer the outlier, and there is no 51–67% band for it to
sit outside of.**

The sample is small but not uninformative in the one direction that matters. If HW's true rate were
still 10.9%, the chance of seeing 7 or more uses in 12 shoppers is **8.6e-5**. So the 11% is
refuted even at n = 12. What n = 12 cannot do is *establish* the new rate — the Wilson 95% interval
on 7/12 is [32%, 81%], which overlaps everything in the table.

**AND THE TWO CANDIDATE CAUSES ARE PERFECTLY CONFOUNDED, so do not claim the defaults fixed it.**
Between the two snapshots the page's defaults changed *and* the report began reading the consented
bucket only (`bd4aeebc`, 2026-08-11 — the 40x scale break, explained in `dev/usage-data-log.md`).
Both predict exactly this move:

- **the defaults explanation** — visitors now arrive at a 6" main at 400 gpm and calculate;
- **the traffic-composition explanation** — restricting to visitors who answered a consent banner
  removes the JS-rendering crawlers and preview agents that inflated `human` and deflated `%used`
  simultaneously, which is what this document's second section predicted all along.

Nothing in the 2026-08-21 table separates them, and one snapshot never will.

## The decisive next step, corrected: one report run, not a query export

**The Search Console route this document used to call decisive is aimed at a few per cent of the
traffic.** In the 2026-07-27 export the whole Hazen-Williams query cluster is 305 impressions and
**16 clicks**, against **580 counted humans on the same date**; suite-wide it is 565 clicks against
4,042 humans. Even allowing for mismatched windows, Google organic cannot account for more than a
small fraction of who is on this page, so segmenting its queries cannot characterize the audience
whose behaviour the 11% describes. (Google only — Bing, direct, links and assistants are all
outside it.) The export is still worth pulling for the *discoverability* question; it is not
evidence about this one.

What settles Task 144 is **one run of the rebuilt `log/lang-log-stats.sh`**, which prints its window,
duration and fingerprint and refuses to compare across windows. Read HW's use-of-shopping and the
band pages' from the SAME run and the same bucket:

- HW inside the band, intervals overlapping MPF/MTC/MI → **there is no leak left to fix**, and the
  task closes as diagnosed rather than as built.
- HW below the band with non-overlapping intervals → the leak survived the defaults change, which
  kills the units hypothesis outright and leaves scope (Tom's network reading) and the missing
  inverse solver as the live candidates.

Wait for a denominator the report does not mark `~` (it flags any under 40 and suppresses any under
5). At HW's 08-21 volume that is a longer window, not a different query.

## Extracted

Q3, EGL-vs-HGL input, is **Task 167** — extracted 2026-07-28, because the "identical pages" filter
that dismissed it does not survive the audience correction above.
