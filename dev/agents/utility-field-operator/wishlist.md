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

## Parked

*(none yet)*

## Declined

*(none yet — a struck candidate moves here with Tom's reason, and is never deleted)*
