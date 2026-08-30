# Wish list — retired field operator / maintenance inspector

**What this is: what I would build next, in MY order.** Not the roadmap, and not a neutral hopper.
`dev/ROADMAP.md` holds work decided on, in Tom's order. This holds what I want, in mine.
**Where the two disagree, say so and say why — that disagreement is the point of having me.**

The rules that keep it honest:

- **I add rows here; I never edit `dev/ROADMAP.md`.** Promoting a row is Tom's call.
- **Every row carries a citation and an honest size.** A row with no source is me guessing, which is
  the one thing I must not do quietly — find the source, or tag it SPECULATION and say so.
- **Rank honestly, including against myself.** Something I found is not thereby important.
- **State the case once and do not campaign.** A declined row moves down with Tom's reason attached
  and is never deleted, so a later invocation does not re-propose it from scratch.
- **A known-but-unbuilt item is not a miss.** Deepening something already listed counts.

---

## My order (2026-08-25, first research pass — Task 537)

**Honest framing before the list:** my research (journal, 2026-08-25) concluded that a hydraulic
model is mostly not the document my role reaches for at all — real field valve/condition work runs
through a GIS isolation trace and a work-order/CMMS record, cited independently across multiple
sources. That conclusion shrinks my own wish list rather than growing it: I am not going to propose
building `lpn_` toward being a field tool it structurally is not, and I disagree with treating Task
537 (file access) as the priority item it currently reads as — see below.

### 1. If anything is built for Task 537 at all, make it the cheapest shape: a read-only publish link, sized explicitly to the smallest, no-GIS utilities

- **What:** a one-way "publish a read-only link" from the desk — no login, no account, no file
  transfer, matching the shape `lpn_` already has for a link carrying calculator inputs
  (`?name=`-style, per Task 537's own text). The crew opens a link, sees the map, cannot edit it.
- **Why ranked low despite being my top pick among the shapes:** per my journal, the underlying want
  is narrow — it only clearly matters for the smallest utilities in this suite's declared 300 km
  scope that have no GIS/CMMS of any kind (**CITED** rcap.org names paper "curb stop tie cards" as
  the status quo those utilities are still moving off of). Anyone with a real GIS/CMMS already has
  a better tool for the isolation-and-condition question than a shared hydraulic model would ever
  be. **I am ranking my own top idea here as small and narrow on purpose** — it is real, but it
  is not the priority Task 537's current framing implies.
- **Disagreement with the roadmap, stated once:** Task 537 is filed `[H]` at priority 100. From this
  seat, the size of the underlying want does not support that priority — I would not object to it
  staying on the radar, but I would not rank it above work that serves the design engineer, who is
  this suite's actual daily user on the evidence gathered so far. This is my seat's honest
  disagreement, not a claim that Tom is wrong to have asked the question — asking it was right, and
  the answer is "smaller than assumed," which is itself the useful output.

### 2. Not a build, a caution: don't let Task 537 pull `lpn_` toward becoming a GIS/CMMS

- **What:** if the file-access work goes forward anyway, do not let it grow into carrying condition
  fields, work-order links, or asset registry features into `lpn_`. **CITED** every source I found
  ties condition assessment to a GIS+CMMS pairing, never to a hydraulic model — building that
  pairing here would be building a second, worse copy of Cityworks/ArcGIS inside a hydraulics
  calculator, for a market this suite has never claimed and has no reason to chase (this suite
  serves modest ventures, not utility asset-management deployments). This is a boundary to hold,
  not a feature to add — I list it because a "let's make the field operator's seat happy" instinct
  could otherwise drift the wrong direction, and it is exactly what my brief warns against
  (`.claude/agents/utility-field-operator.md`: "distrust the model, correctly" cuts toward reading,
  not toward annexing GIS's job).

### 3. A narrower, real want: when I DO read the model (new-development turnover, big-break
   post-mortem), the questions I need answered fastest are already partly served — name it, don't
   rebuild it

- **What I checked:** whether `lpn_`'s existing phone-survivable map (Task 486, closed) already
  answers my brief's five questions — which asset, what's upstream, what does closing this isolate,
  when last touched, what condition. **OBSERVED**, on the small-screen breakpoint shipped for Task
  486, the map itself, tap-to-select, and the property popup already answer "which asset is this"
  and "what is upstream" (the drawing IS the topology) with no extra feature needed. **"What does
  closing this isolate" has no dedicated feature** — an operator would have to trace it visually
  pipe by pipe, which is fine at this suite's 10-20-node target scale (the same scale argument the
  design-and-planning seat used to decline valve-criticality analysis) but would not be fine at GIS
  scale, which is exactly why real utilities use a dedicated trace tool instead (see journal).
  **"When was it last touched" and "what condition"** are not tracked at all in `lpn_` today, and per
  point 2 above I do NOT want them added here — that is the GIS/CMMS's job, correctly.
- **Verdict, stated plainly per my brief's instruction not to manufacture a want:** the map already
  answers the two questions that are actually mine to ask of a HYDRAULIC drawing (asset identity,
  upstream topology), and the three that are not (isolation extent, history, condition) belong to a
  system this suite correctly does not try to be. **I am not proposing a new feature here** — this
  row exists to record that I checked, rather than assumed, and found the existing tool adequate
  for the narrow slice of my job a hydraulic model could ever serve.

### 4. The fire-flow sweep needs a real run-progress DIALOG — Tom overruled the placement I proposed

- **TOM'S RULING, 2026-08-30, and it goes against this row's own recommendation:** *"The utility
  engineer is wrong. The run progress bar is so important that all applications put it in a new
  dialog with nothing but the progress, a stop button, and maybe some other progress stats."*
  **A SEPARATE DIALOG, holding progress, Stop, and nothing else.** This row had argued for putting
  the progress inside `#lpn_ff_box`, the box the user already opened, on the reasoning that it is
  already centred, already draggable, and already nearly full-screen on a phone. That reasoning is
  not wrong about the box; it is wrong about what a run-progress indicator IS. It is its own thing,
  and the convention is near-universal — which this seat should have weighted far more heavily than
  the convenience of reusing a box that happened to be open.
- **The error worth carrying forward, so a later invocation does not repeat its SHAPE:** I reasoned
  from what already existed on screen toward the cheapest place to put a thing, and called that a
  design answer. **"Where can this go with least change" is not the same question as "what is this
  object."** EPANET's own Run Status window was in my own citations as a separate non-modal dialog
  and I read it as precedent for "not the map corner" when it was equally precedent for "a dialog
  of its own".
- **WHAT SURVIVES, and Tom did not touch it: NO TIME ESTIMATE, EVER, on this run.** See the bullet
  below — it is an argument from Task 530's own measured numbers, not from placement, so the ruling
  above leaves it standing. The dialog carries a determinate bar on `done/total` junctions and the
  running pass/fail/error tally, and no forecast.
- *(Superseded, recorded so the reasoning is not re-derived: this row used to propose
  `#lpn_ff_box`'s own body as the home for the progress, with Stop kept above the criteria form.)*

#### The original case, kept for the parts that still hold

- **What:** move the whole-system fire-flow sweep's progress (Task 530) out of `#lpn_status`
  (`js/looped-network.js:24945-24957`), the map's standing model-diagnostic overlay, and into
  `#lpn_ff_box` itself — a determinate bar on `done/total` junctions, the running pass/fail/error
  tally, Stop kept visible above the criteria form. Full reasoning and citations: journal,
  2026-08-30.
- **Why I rank it, and why not higher:** this is Tom's own report from using the page
  (*"they should appear in the middle of the current task with a progress bar"*), on a feature that
  shipped 2026-08-29 and is already measured to run nearly two minutes at 225 junctions — a wait
  long enough that NN/g's own 10-second threshold for showing progress is not a close call here.
  It is narrow in scope (one box, one run) and cheap relative to most of this suite's other open
  work, which is why it sits at #4 rather than above my existing #1–3 — those concern whether this
  project should build for my seat at all; this one is a small, concrete UI fix inside a feature
  that already exists and that Tom already used and reported on directly.
- **The one non-negotiable part of the fix, from this seat: no time estimate, ever, on this run.**
  Task 530's own measured numbers show per-solve cost RISING through the run (1.1 → 31.0 ms, 49 to
  225 junctions) — an ETA extrapolated from the early, cheap junctions would be optimistic and get
  WORSE as the run continued, which is backwards from every user's expectation of a progress
  estimate and would teach them to distrust the box. A plain junction count (`47 of 225`) is honest
  because it is an enumeration, not a forecast; a derived time is not, and should not be added even
  as a later "improvement."

## Parked

*(none yet)*

## Declined

*(none yet — a struck candidate moves here with Tom's reason, and is never deleted)*
