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
   through `setProp()`, and blank-capable -- blank means "use the global", which is EPANET's own
   rule and is a different statement from `0`. **On all three screens since 2026-09-04**: the pipe
   popup, a Pipes column, and both halves of Find and replace (`findPropDefs()` offers them
   explicitly the way a required fire flow is offered, because `linkFieldDefs()` is the LABELS
   panel's list and nothing prints a coefficient beside a pipe; `pushSpecList()` carries the write,
   so `replaceWrite()` takes its `prop` branch and goes through `setProp()`).
   A **TANK** carries its own the same way (`tankCoeff`), in the tank popup and the Tanks table.
3. **`[QUALITY]` interpreted** — per-node initial quality, as node property `initQuality`, also
   through `setProp()`. A reservoir's own initial quality is held for the whole run by EPANET, which
   is why this alone is enough to state a plant residual and run.
3b. **`[SOURCES]` AND `[MIXING]` INTERPRETED TOO (Task 579, 2026-09-05).** A booster dose is three
   node properties on the overridable whitelist — `sourceType`, `sourceQuality`, `sourcePattern`,
   EPANET's own four types — written through `setProp()` because a dose is an operating question.
   A tank's `mixingModel` and `mixingFraction` are NOT overridable: a mixing model describes how the
   tank is plumbed, and it sits with the elevation, levels and diameter, all Base-owned. Both
   sections are read BESIDE their carried text (never over it) by `readSourceMixingSections()`,
   called from the two doors `readQualitySections()` is; both reach the engine through
   `assembleModel()`, which is the leg Task 582 shipped without for a session.
   `dev/lpn-spike/source-mixing-harness.js` runs the engine with the booster and without it.
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

**And the link half shipped after it:** an average quality, a friction factor and a status under
Task 638, and the REACTION RATE under Task 652 -- see the two sections at the end of this file.

---

## The tank coefficient moved off the setting and onto the tank (2026-09-04)

It was read from `[REACTIONS] TANK <id> <coeff>`, kept on `settings.reactions.tank`, written back
out, and **no screen in the application could show it or change it**. Water stands in a tank far
longer than it stands in any main, so it is the coefficient most likely to decide what the residual
is, and it was the one nobody could touch.

- **It is a node property now**, `tankCoeff`, on `LPN_OVERRIDABLE.node`, with a row in the tank
  popup and a column in the Tanks table. Both go through `setProp()`, so a scenario's coefficient
  cannot edit Base -- which is the whole reason it is a property rather than a second settings map.
- **THE VALUE HAS ONE HOME, and moving it is the point.** `readQualitySections()` lands the file's
  map on the tanks and leaves `settings.reactions.tank` empty; `adoptTankCoeffs()` does the same for
  a project saved while it lived on the setting, and empties the map there too. Copied instead of
  moved, the first edit would produce two numbers and no reader could say which one the engine gets.
- `docReactions()` and `liveReactions()` (`js/lpn-inp.js`) gather it off the tanks through
  `effective()`, so the round trip and the engine both see the scenario's own value.

## A source share now states its unit, and that took a second slot (2026-09-04)

`qualityUnitId()` answers `''` for a source share, honestly: a percentage has no unit family, no
factor and nothing to convert. But `''` reaches a heading as **no unit at all**, which is what a
dimensionless number like a minor-loss k says -- and a percentage is not that. A bare 43 under the
word "Source share" is a fraction to one reader and a percent to the next.

**Unitless and dimensionless are different states, so the unit SLOT takes an id and a second slot
takes TEXT.** `qualityUnitText()` is the one place all three modes are answered -- the time unit for
an age, `%` for a share, and the document's own characters for a concentration -- and the property
popup's result row, the Tables heading (`c.unitText`) and the colour legend
(`colorFieldUnitText()`) all read it. The `%` needs no language key, on the legend's own rule for
`<`, `≥` and the en dash: the same mark in all 27 languages, placed by the bidi algorithm for an
RTL reader. The gradient's `gradientSuffix()` was already living on this split; this generalises it
rather than inventing it.

## The reaction rate: EPANET'S OWN NUMBER, off its binary output file (Task 652, 2026-09-13)

EPANET reports five link columns and this page shipped four of them under Task 638. The fifth was
left out, correctly at the time and for a reason worth keeping: **the toolkit's `LinkProperty` enum
stops at `LinkQual`, so there is no getter**, and where a friction factor is the definition of head
loss rearranged, a reaction rate is a MODEL -- a bulk term, a wall term, and a mass-transfer
coefficient off a Sherwood correlation. Writing our own would have been inventing arithmetic nothing
checks, which is the one thing this repository will not do with a number.

**The door that was missed is the BINARY OUTPUT FILE.** EPANET fills `qual->PipeRateCoeff[k]` in
`reactpipes()` (`src/qualreact.c`) and writes it as the seventh of eight per-link series in
`linkoutput()` (`src/output.c`, `case REACTRATE`) -- the very array its own `.rpt` link table prints
from. The vendored `epanet-js` 0.9.0 already exports `readBinary()` and names that series
`reactionRate`. **So no arithmetic of ours is on the path, and no upstream contribution was needed**
-- `dev/reaction-rate-upstream.md` records what a pull request would have been, and why it is moot.

- **The cost is one file, and it is asked for only when it can be answered.** `initQ(EN_SAVE)` is
  what writes `eps.out` at all, and `PipeRateCoeff` stays at zero unless `Qualflag == CHEM` -- so an
  age run and a source trace would pay for the whole file and get a column of zeros. Chemical only.
  **Measured on Net3 over 24 hours at a 5 minute reporting step** (289 periods, 119 links): a
  1.56 MB output file, 11 ms to read it back and **234 ms in `readBinary()`**, which materialises
  all eight series for every link and all four for every node. It scales with links times periods,
  so a utility-scale network at a fine reporting step would pay seconds of it on the main thread
  after the progress bar has already finished. **That is this approach's known weakness**, written
  down rather than left to be rediscovered. The cheap fix if it bites is to read the seventh series
  out of the file rather than every series; the expensive one is a worker. Neither was done on
  speculation, and using the library's own reader is what keeps the file format somebody else's
  opinion rather than a second one of ours.
- **It is a MAGNITUDE, in the stated concentration per DAY.** `reactpipes()` accumulates
  `fabs(c_new - c_old)`, so a residual decaying at 2.5 and one growing at 2.5 report the same
  number, and `SECperDAY` fixes the time basis whatever the flow units are. Both are EPANET's own
  decisions and neither is ours to change. **That gives this page a THIRD quality unit** beside the
  age's time and the source share's bare `%`: `reactionRateUnitText()` is the document's own
  concentration label plus the `elapsed_time` family's already-translated `day`, so no new unit key
  was written and no factor exists to get wrong.
- **Pipes only, and the gate is EPANET'S TYPE rather than our document's word.** `reactpipes()` is
  written `if (Link[k].Type != PIPE) continue;`, so a pump, a valve and even a CVPipe get a run of
  zeros. Left UNDEFINED here rather than carried as 0: EPANET did not compute a rate for those, and
  a 0 reads as one that it did. **The two really can disagree** -- a pump with no curve is written by
  our own exporter as a short fat PIPE, which EPANET then reacts, correctly; reading the type out of
  the binary file is what makes the engine's answer the one that stands.
- **Anchored three ways** (`dev/lpn-spike/reaction-rate-harness.js`):
  1. **Against EPANET's own printed `.rpt`**, every pipe at every reporting period, by handing the
     page's own exported `.inp` to a separate Workspace with nothing added but a `[REPORT]` section.
     **26 comparisons, worst 0.0035** against the report's own two-decimal precision of 0.005 -- the
     bound is the report's and not one anybody chose.
  2. **Against the published model, recomputed in the harness from the manual** -- first-order bulk
     plus a wall term limited by mass transfer, with the Sherwood correlation and the Schmidt
     number. **Worst 0.0043%.** Leg 1 alone would pass if our reader and EPANET's writer agreed
     about a number that meant something else entirely; this says the quantity is the one the water
     quality chapter defines. That arithmetic lives in the harness and is never shipped.
     *(It is available only because a first-order rate is LINEAR in concentration, so the mean of
     the rate is the rate at the mean and the engine's own average quality is enough to check it.
     It would not hold at second order or under a limiting potential.)*
  3. **Against frame alignment**, with a run still changing at every step and a non-zero report
     start -- the one arrangement in which EPANET's period index and this page's frame list could
     drift apart. Both legs above pass with every rate hung on the wrong frame, because a settled
     run reports the same number for ever.

  Mutation-tested: a 0.1% scaling, a dropped type gate and a one-period shift each turn the file red.
- **On screen it is a symbology and label field only**, like the other three: `COLOR_LINK_FIELDS`,
  `COLOR_FIELD_ORDER` and `linkFieldDefs()`. There is no link result popup to hang a tip on, so the
  two facts a reader needs -- that it is a magnitude, and that its basis is per day -- are carried by
  the unit mark and by this file. **Where the magnitude disclosure belongs is the open question**,
  and it is Tom's.

## Link quality: DECLINED, with the reasons (2026-09-04) -- SUPERSEDED by Task 638

EPANET reports a quality for a LINK as well as for a node, and the bridge captures nodes only. It
stays that way, and this is the record so it is not re-proposed as an oversight:

- **The dimension would be half-symmetric, which reads worse than an absent one.** A pipe's number
  is an average over the parcels in it; a PUMP and a VALVE are zero-length links that hold no water,
  so their average is a fiction. Every screen that carries a link result -- the Pipes, Pumps and
  Valves tables, the map labels, the colour ramp, the popup -- would then have a column that is real
  in one table and meaningless in two.
- **The question is asked at nodes.** "How old is the water at this hydrant", "how much of this
  service comes from the lake", "what residual reaches the end of the system" are all node
  questions, and EPA's own `Net3.rpt` reports quality per node for that reason.
- **There is no anchor for the pipe average.** The two published references in this repository
  (`Net3.rpt` and the analytic single-pipe case) both answer at a node, so a link column would be
  the one water-quality number in the page checked against nothing.
- **It is cheap to add later and expensive to withdraw.** Nothing about the design forecloses it:
  the engine call is `getLinkValue(..., EN_LINKQUAL)` beside the node loop that already exists.
- **What it would take to change this ruling:** a user asking for an average age in a main, and an
  answer for what a pump and a valve show. Not before.
