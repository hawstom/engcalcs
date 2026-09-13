# Contributing a reaction-rate getter upstream: the plan, and why it is not needed

Written 2026-09-13 for ROADMAP Task 652, answering Tom: *"Proceed to invent it, interviewing me as
necessary and including research into how we can contribute to the library. Goal is to achieve a
successful pull request."*

Copyright 2009 Thomas Gail Haws. GNU GPL v3 or later.

**NOTHING WAS CLONED, FORKED OR CHECKED OUT.** Tom blocked that pending his git-organization task
(*"This probably will require cloning another repository, which I consider to be blocked until we
resolve my Git repository organization task."*). Everything below is from the projects' published
sources and APIs, read over the web. That restriction cost nothing, because the answer turned out to
be that no contribution is required.

---

## THE HEADLINE: the pull request is not needed, and that is a better outcome than winning one

**The number was already reachable from the copy of the library we vendor.** Task 652 ships EPANET's
own per-pipe reaction rate with no arithmetic of ours and no change to anything upstream.

The premise of the task was right as far as it went: **the C toolkit's `EN_getlinkvalue` has no
reaction-rate property.** `EN_LinkProperty` in `include/epanet2_enums.h` runs `EN_DIAMETER` (0)
through `EN_LINKQUAL` (14) and on to the 2.3 additions, and a reaction rate is not among them. The
vendored wrapper's own `LinkProperty` enum mirrors that and stops in the same place. So a getter
really is missing, and a JS wrapper cannot expose what the C API does not return.

**What the premise missed is that EPANET writes the value to its BINARY OUTPUT FILE, and the wrapper
already exports a reader for that file.**

| Where | What |
|---|---|
| `src/qualreact.c`, `reactpipes()` | Fills `qual->PipeRateCoeff[k]` -- the volume-weighted mean of `fabs(c_new - c_old)` over the parcels in pipe `k`, divided by the quality step and scaled by `SECperDAY` |
| `src/qualroute.c`, `transport()` | Calls it once per water-quality time step, gated on `qual->Reactflag` |
| `src/output.c`, `linkoutput()` | `case REACTRATE:` writes that array as the **seventh of eight** per-link series in the binary `.out` file, commented *"Overall reaction rate in mass/L/day"* |
| `src/report.c`, `writelinktable()` | Prints the report's own Reaction column **from those same saved arrays** |
| `js/vendor/epanet-js.js` | Exports `readBinary(bytes)`, whose per-link results object names the eight series `flow, velocity, headloss, avgWaterQuality, status, setting, reactionRate, friction` |

So the report column and the page's number are **one value out of one array**. There is no second
implementation, ours or anyone's, and nothing to keep in step.

The whole change in this repository is: pass `EN_SAVE` to `initQ()` for a chemical run, read
`eps.out` back out of the workspace at the same moment the report is read, and call the reader the
vendored file already exports. `dev/lpn-spike/reaction-rate-harness.js` anchors it against EPANET's
own printed `.rpt`.

**This is worth stating as a general lesson rather than as an incident.** Task 638 stopped at the
getter and concluded, honestly and in writing, that shipping the rate would mean inventing
mass-transfer arithmetic. That conclusion followed from asking *"what does the API expose?"* when the
question that answers it is *"what does the engine WRITE?"* An engine that produces a report has a
report to read.

---

## The two projects that are both called epanet-js, and which is which

This is the trap in any future upstream conversation. **They are different repositories with
different licences and different maintainers.**

| | What it is | Repository | Licence |
|---|---|---|---|
| **The toolkit -- what we vendor** | npm `epanet-js`, a JS/TS wrapper over the OWA EPANET engine compiled to WASM | `github.com/epanet-js/epanet-js-toolkit` (formerly `modelcreate/epanet-js`) | **MIT**, © Luke Butler |
| **The web app** | The modelling application at epanetjs.com, Placemark-derived | `github.com/epanet-js/epanet-js` | **Mixed MIT + FSL-1.1-MIT** |
| **The C engine** | The EPANET 2.2/2.3 toolkit itself | `github.com/OpenWaterAnalytics/EPANET` | **MIT** |

`js/vendor/epanet-js.LICENSE` is the toolkit's MIT, © 2019 Luke Butler, and it is correct and
current. **Our vendored copy's licence position is unchanged and is not affected by anything below.**

---

## The licence position, stated plainly

Tom's brief flagged that `epanet-js`'s GitHub `LICENSE` now carries a mixed MIT + FSL-1.1-MIT
structure. **That is true of the WEB APP and not of the toolkit we vendor.**

- **OWA EPANET (C engine): MIT.** GPL-3 compatible. A pull request there is an ordinary MIT
  contribution and creates no friction for a GPL-v3 project.
- **epanet-js toolkit (what we vendor): MIT**, per both npm and the repository. Same answer. Our
  pure-MIT 0.9.0 is what MIT has always been, and a future version bump within this project stays
  MIT unless that repository relicenses.
- **epanet-js web app: MIT for the Placemark-era code through commit `0fa095f5`, then FSL-1.1-MIT
  (Iterating Inc., 2025) for everything after.** FSL-1.1-MIT permits internal use, non-commercial
  education and research, and professional services, but forbids **Competing Use** -- offering the
  software commercially as a substitute for it. It carries a **Grant of Future License** converting
  each release to plain MIT on the **second anniversary of that release**. During those two years it
  is **not an OSI/FSF free licence and is not GPL-3 compatible**; afterwards the affected code is
  MIT and compatible.

**What that means for us, concretely:**

1. **We vendor none of the FSL code and must never start.** The web app is a separate product. If a
   future task wants something from it, the answer is to wait out its two-year MIT conversion or to
   reimplement, never to vendor it into a GPL-v3 tree.
2. **A PR to either MIT project would have been free of licence consequence.** No CLA friction
   either -- neither requires assigning anything that would trouble a GPL project.
3. **A PR to the web app would mean signing work into FSL-1.1-MIT** and must not touch anything we
   vendor. We have no reason to make one.
4. **This is a reason to watch the toolkit rather than to worry about it.** It is MIT today and
   actively maintained; a relicence there would be the event that matters, and it would matter to a
   version bump rather than to the copy we already hold, which stays MIT for ever under the grant we
   already received. `dev/agents/market-researcher/wishlist.md` item 0 carries the watch.

---

## If the PR were still wanted: what it would be

Tom asked for a plan aimed at a successful pull request, and the finding above makes it optional
rather than necessary. Recorded so the decision is his and so nobody re-derives it.

**Target: `OpenWaterAnalytics/EPANET`, the C toolkit. Not the JS wrapper** -- the wrapper can only
surface what the C API returns, so this has to land in C first and be mirrored afterwards.

**The change is small, because the value already exists.** `qual->PipeRateCoeff` is allocated in
`quality.c`'s `openqual()`, zeroed in `ratecoeffs()`, filled in `reactpipes()` and freed in
`closequal()`. **Nothing in `src/epanet.c` reads it** -- it is internal-only today. A getter would be:

1. One new member on `EN_LinkProperty` in `include/epanet2_enums.h`, at the end of the enum so no
   existing value moves (`EN_REACTRATE`, following the engine's own `REACTRATE` spelling).
2. One `case` in `EN_getlinkvalue` in `src/epanet.c`, returning `qual->PipeRateCoeff[index]` -- with
   the same two guards the value already carries: zero for a non-`PIPE` link, and zero unless
   `Qualflag == CHEM`.
3. The legacy `epanet2.h` / `epanet2.f90` / `epanet2.bas` bindings, which the project keeps in step.
4. A test in the project's own suite, and a line in the API documentation stating the units
   (mass/L/day), that the value is a **magnitude**, and that it is the value from the last quality
   step rather than an average over the reporting period.

**Estimated size: well under a hundred lines, most of it bindings and documentation.** The physics is
not touched at all. That is the kind of PR an upstream project accepts readily, and it is worth
offering on its own merits -- a toolkit user who is not reading the binary file has no way to this
number at all.

**There is no existing issue or PR requesting it.** OWA/EPANET's tracker mentions "reaction rate"
only in `#871`, a regression report that quotes a report column. The toolkit's tracker has `#90`,
about reading `[REACTIONS]` coefficients out of an `.inp`, which is a different question.

**Two caveats a PR would have to state, because they surprise people:**

- **The reported value is a MAGNITUDE.** `reactpipes()` accumulates `fabs()`, so decay and growth
  are indistinguishable in this column. A getter that quietly returned a signed value would be a
  different quantity from the report and would be wrong.
- **It is not a time-average.** It is the value from the last quality step before the reporting
  instant, which is why a network that has not settled shows a rate that moves.

**Cost, honestly:** the code is an afternoon. The rest is the project's review cycle, a
back-and-forth on the enum value and the doc wording, and then waiting for a release and for the
wrapper to rebuild against it -- months, realistically, before it would reach anything we ship. Set
against a feature that is already shipped and anchored, **the PR buys other people something and
buys us nothing.** That is a perfectly good reason to make one; it is not a reason to hurry.

---

## Versions, as of 2026-09-13

- **OWA EPANET**: latest release v2.3.5. Actively developed on `dev`; its `EN_LinkProperty` has grown
  to 29 members against the 22 the vendored wrapper knows.
- **epanet-js toolkit**: npm latest **0.9.0** (published 2025-01-28) -- the version we vendor. The
  repository is active (pushed 2026-09-13) and supports engine builds 2.2 through 2.3.5, so the
  published package is behind the repository.
- **epanet-js web app**: active, epanetjs.com.

Sources: `raw.githubusercontent.com/OpenWaterAnalytics/EPANET/dev/src/{qualreact,qualroute,output,report}.c`,
`.../include/epanet2_enums.h`, `.../LICENSE`; `github.com/epanet-js/epanet-js-toolkit`;
`raw.githubusercontent.com/epanet-js/epanet-js/main/LICENSE`; `registry.npmjs.org/epanet-js`.
