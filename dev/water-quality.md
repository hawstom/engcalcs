# Water quality in `lpn_`

What shipped, what it is anchored against, and what the third mode would need. Written 2026-09-01,
answering Tom: *"Full EPANET interface including all of quality needs to be our priority."*

Copyright 2009 Thomas Gail Haws. GNU GPL v3 or later.

---

## The three modes, and what each one needs

EPANET offers three, and the split is the utility-planning engineer's wish-list row 4:

| Mode | User input | Built |
|---|---|---|
| **Water age** — how long the water reaching a point has been in the system | none at all | **yes** |
| **Source share** — the percent of the water at a point that came from a chosen source (EPANET's Source Trace) | one node | **yes** |
| **Chemical / reaction** — a residual that decays | bulk and wall reaction coefficients, per pipe or global, and somewhere for it to enter | **yes** |

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
- **A CHEMICAL RUNS NOW, AND IT CHANGED BOTH HALVES OF THIS PARAGRAPH** (Task 566). What used to
  stand here — nothing carries a unit into the engine, and Diffusivity and Tolerance are never sent —
  was true only while a chemical was carried text.
  - **`model.reactions` IS cloned and converted**, by `engineQuality()` beside `engineHydraulics()`,
    because a first-order **wall** coefficient is a LENGTH per day and the length is the project's
    own. Measured against the engine rather than read off a manual: `Global Wall -1` in an LPS file
    and `-3.2808` in an otherwise identical GPM file agree to 1e-6, and passing the same number
    across untouched is a 16% error in the concentration
    (`dev/lpn-spike/reaction-anchor-harness.js` §5). A **bulk** coefficient is a reciprocal time and
    crosses unchanged; so does a **zero-order** wall coefficient, which carries the concentration
    unit instead of a length.
  - **`Tolerance` and `Diffusivity` ARE sent, for a chemical only.** `Tolerance` is EPANET's
    parcel-merging tolerance and it decides how much of the concentration profile survives the
    transport: at EPANET's own default of 0.01 the single-pipe analytic case is 0.099% off the
    exact answer and does not improve as the quality step shrinks; at a tight one it lands inside
    0.001%. That is EPANET's documented behaviour, not our arithmetic, and it is why the option had
    to reach the engine before this file could be anchored at all.
  - **A CONCENTRATION IS STILL CONVERTED BY NOBODY**, EPANET included. Its unit is the free text
    beside the chemical's name (`Chlorine mg/L`), carried and displayed, never applied — CLAUDE.md's
    carry-the-label path. So there is no unit family, no factor, and nothing for a factor check to
    check.

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

## What chemical / reaction (mode c) has, and what it still does not

Built 2026-09-03 (Task 566). Against the six-item list this section used to carry:

1. **`[REACTIONS]` interpreted** — global `Order`/`Global` bulk, wall and tank, `Limiting Potential`,
   `Roughness Correlation`, and per-element `BULK`/`WALL`/`TANK` rows.
   `EngCalcs.lpnReactionsParse` / `lpnReactionsText` (`js/lpn-inp.js`) own it, on exactly the
   `[OPTIONS] Quality` terms: **the interpretation lives beside the carried text, never over it**,
   and the exporter writes the file's own characters back while the live values still parse out of
   them. Net1's `Global Bulk -.5` arrives as `-0.5` and goes back out as `-.5`.
2. **Two per-pipe properties**, `bulkCoeff` and `wallCoeff`, on the overridable whitelist, written
   through `setProp()`, edited in the pipe popup, and blank-capable — blank means "use the global",
   which is EPANET's own rule and is a different statement from `0`.
   **Still missing: a Tables column and a Find-and-replace field.**
3. **`[QUALITY]` interpreted** — per-node initial quality, as node property `initQuality`, also
   through `setProp()`. **`[SOURCES]` and `[MIXING]` are still carried and not read**, so a booster
   dose and a tank mixing model are the next real gap. A reservoir's own initial quality is held for
   the whole run by EPANET, which is why this alone is enough to state a plant residual and run.
4. **The concentration unit: carried as a label, never converted.** See the engine section above.
   The dimensioned quantity turned out to be the WALL coefficient, not the concentration.
5. **The coefficient disclosure.** Both global boxes open EMPTY, an empty box is EPANET's own zero,
   and `lpn_reaction_note` says in the box that this page offers no coefficient of its own, why
   (no standard test; published field values for the same water differ by a factor of ten), and
   what to do instead. Task 530's ask-or-disclose posture.
6. **The anchor: `dev/lpn-spike/reaction-anchor-harness.js`, and it is ANALYTIC, not an EPA report.**
   No EPA chlorine report for Net1 exists in this repository and none was obtained. A reservoir, one
   pipe, one junction: `C = C0 exp(Kb V / Q)`, which is arithmetic with no free parameter.
   **Measured: 0.0007% and 0.0004% at two flows, and the coupling asserted** — double the flow and
   `ln C` halves, to 0.01% — because a case whose answer did not depend on travel time would pass
   with the transport broken. Re-run at a 10 s quality step so the answer is the physics rather than
   one lucky discretisation.

**Still not built, deliberately:** `[SOURCES]`, `[MIXING]`, a link-level quality result, a Tables
column and a Find-and-replace field for the two coefficients, and a per-tank coefficient control
(the value is carried on `settings.reactions.tank` and round-trips, but nothing edits it).
