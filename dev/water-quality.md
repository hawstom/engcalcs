# Water quality in `lpn_`

What shipped, what it is anchored against, and what the third mode would need. Written 2026-09-01,
answering Tom: *"Full EPANET interface including all of quality needs to be our priority."*

Copyright 2009 Thomas Gail Haws. GNU GPL v3 or later.

---

## The three modes, and which two are built

EPANET offers three, and the split is the utility-planning engineer's wish-list row 4:

| Mode | User input | Built |
|---|---|---|
| **Water age** — how long the water reaching a point has been in the system | none at all | **yes** |
| **Source share** — the percent of the water at a point that came from a chosen source (EPANET's Source Trace) | one node | **yes** |
| **Chemical / reaction** — a residual that decays | bulk and wall reaction coefficients, per pipe or global | **no** |

**Our words, not EPANET's** (CLAUDE.md § `lpn_`): EPANET says *Source Trace* and reports an unlabelled
*Quality* column; we say **Water age** and **Source share**, and the heading follows the mode so a
percentage can never appear under the word "age".

## It is EPANET-only and RUN-only, and neither is a limitation to route around

Quality is transported along flows over time. A water age at one instant is not a number, it is the
answer to a question nobody asked — so it rides on the extended-period run (Task 248) and the
built-in solver has nothing to do. **`js/lpn-solver.js` has no time dimension and is not getting
one.** With the engine unreachable the page says so exactly as the run already does, and shows no
quality value at all rather than a column of zeros.

## There is no pass or fail, and one must not be invented

Unlike pressure and fire flow, water age has **no numeric standard** — no Ten States-style bright
line exists, and the published guidance is qualitative (utility-planning-engineer wish list, row 4a,
with citations). So the page reports the number and stops: no verdict glyph, no threshold, no colour
band this page chose for the reader.

## How the engine is driven

`js/lpn-epanet.js`. The hydraulics run first with `initH(EN_SAVE)`, then `closeH()`, then
`openQ()/initQ()/runQ()/nextQ()` walks the same clock a second time and fills `qualities` on the
frames the hydraulic pass already made. Both passes slice on the same budget and share one progress
bar, half each.

- **A second pass, not a second column in the first.** EPANET transports a species along flows that
  are already solved; interleaving `runH()` and `runQ()` is not something the toolkit offers.
- **`EngCalcs.lpnQualityRuns()` is the one place the line is drawn** — age always, source share only
  with a source named (EPANET rejects the file over an unresolvable trace node), chemical never.
- **EPANET reports age in HOURS; every result leaving that file is SI.** The `× 3600` is at one line.
  A source share is a percentage and crosses nothing.
- **Nothing here needs a place in `signatureOf()`.** That guards the warm Project the *steady* solve
  reuses, and quality never reaches it — `lpnEpanetRun()` opens a fresh Project every time. The
  page's own re-run trigger is `js/lpn-time.js`'s model fingerprint, which carries `model.quality`.
- **Nothing here carries a unit into the engine**, which is why `model.quality` is not cloned and
  converted the way `hydraulics` is. Diffusivity and Tolerance are not sent at all: they mean
  something only to a reacting chemical.

## `[OPTIONS] Quality` is a live input AND still round-trips

The interpretation lives **beside** the file's token, never over it: `settings.quality` carries
`{mode, traceNode, src}`, where `src` is the characters the file stated. The exporter writes `src`
verbatim while the setting still parses out of it, and composes our own line only once the user has
really chosen something else. That is CLAUDE.md's `_xsrc`/`_ysrc` rule applied to a word instead of a
number. `EngCalcs.lpnQualityParse` / `EngCalcs.lpnQualityText` (`js/lpn-inp.js`) own it.

A setting with **no `src` at all** has never met the document's token — a project saved before the
option was interpreted — and is not read as a decision, or the export would delete a line the source
stated.

## What it is anchored against

`dev/lpn-spike/quality-net3-harness.js`.

- **Source share: EPA's own published `Net3.rpt`.** Net3 IS the EPA water-quality example — its
  `[OPTIONS]` says `Quality Trace Lake` and its report carries a Quality column in percent for every
  node at all 25 reporting times. **2,425 comparisons, worst 0.105 percent, median 0.0001.** The
  worst cases sit on a mixing front, where the boundary's position is as sensitive as the flow
  carrying it.
- **Water age has no published EPA report in this repo**, so it is anchored on arithmetic instead:
  reservoir, one pipe, one junction at constant demand, where the settled age at the far end is the
  travel time (pipe volume ÷ flow) to 0.00%. Run at **two flows**, with the ratio asserted, because a
  case whose answer did not depend on travel time would pass with the hours-to-seconds scale wrong —
  the stub-removes-the-coupling failure `dev/testing-notes.md` warns about.
- The round trip is asserted in `dev/lpn-spike/inp-export-harness.js` §7, through the page's own
  `docFromInp()` and exporter.

---

## What chemical / reaction (mode c) would need next

Not started, deliberately. In rough order of size:

1. **`[REACTIONS]` read and written, and interpreted.** Global `Bulk`/`Wall`/`Tank` orders and
   coefficients, per-pipe `Bulk`/`Wall` overrides, `Limiting Potential`, `Roughness Correlation`.
   Today the whole section is carried verbatim and never interpreted; interpreting it means the
   carried text stops being the source of truth and needs the same token-beside-value treatment
   `Quality` just got.
2. **Two new per-pipe properties** — bulk and wall reaction coefficients — which is a genuinely new
   class of input on a link, with a popup row, a table column, a Find-and-replace field, an override
   through `setProp()`, and a scenario story.
3. **`[SOURCES]` and `[MIXING]`.** A chemical needs somewhere to enter (a concentration, a mass rate
   or a flow-paced source at a node, optionally on a pattern) and tanks need a mixing model. Both are
   carried and uninterpreted today.
4. **A concentration UNIT, and it is the first dimensioned quantity this feature would have.** The
   `.inp` states it as free text beside the chemical name (`Chlorine mg/L`), which is not a unit
   family — so either a new family with the two or three real options, or the honest carry-and-refuse
   path CLAUDE.md already specifies for a unit we have no factor for. The engine writer would then
   need the `engineHydraulics()` treatment: convert on a clone, never in the document.
5. **The coefficient problem, which is a DISCLOSURE task and not a reason to decline** (the
   utility-planning engineer's standing rule, from Tom, 2026-08-25: *"Lack of coefficients is not the
   same as lack of demand."*). There is no standard test for a bulk decay coefficient and published
   field values span an order of magnitude, so the shape is Task 530's ask-or-disclose: an editable
   field, no invented default presented as fact, and the page saying plainly that it offers none and
   why.
6. **An anchor.** Net1 states `Quality Chlorine mg/L` and `dev/lpn-spike/reference/Net3.rpt` is a
   trace report, so a chemical run needs either an EPA report for Net1 that this repo does not have,
   or an analytic case of the same kind the age anchor uses — a single pipe where first-order decay
   over a known travel time is arithmetic. Prefer the published report if one can be obtained.

Believed larger than water age and source share combined.
