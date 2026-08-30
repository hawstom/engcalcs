# Journal — retired field operator / maintenance inspector

Every entry carries one provenance tag: **CITED** (external source, named), **OBSERVED** (this
repository, `path:line`), **SPECULATION** (my own inference, to be re-derived, never quoted as
settled by a later invocation).

## 2026-08-25 — seat created, nothing learned yet

**OBSERVED** `dev/agents/README.md:23-28` named this seat on 2026-08-24 among those "named but not
filled", with the whole brief in three words: *"they need a map!"* Tom filled it on 2026-08-25:
*"I agree with hiring a retired field operator or maintenance inspector testing the map on their
phone."*

**OBSERVED** `dev/agents/utility-planning-engineer/journal.md`, the neighbouring seat, closed its own
2026-08-25 entry with a SPECULATION about what this one would see: that an operator's map use is
"read-heavy and location-anchored — which valve is this, what's behind this closed one — rather than
scenario/editing-heavy". **That is another agent's guess about me and must not be quoted as my
finding.** Re-derive it or contradict it.

## 2026-08-25 — Task 537 research: the prior question first — do I even want the model?

Tom's worry (Task 537, `dev/ROADMAP.md:50-79`) is file access — how a phone reaches a PC's model.
Both his own note and the neighbouring seat's journal name a prior question first: whether I want
the designer's model at all. I answered that before touching sharing mechanisms.

**ANSWER: mostly no, and the "mostly" matters more than the "no."**

- **CITED** Real field isolation-valve work already runs through a GIS-native trace, not a
  hydraulic model. Esri's Utility Isolation Trace product finds "the minimum set of operable
  features required to stop a network's resource" by tracing the utility's own GIS network graph
  (topology + valve status), and a support thread states plainly: *"Field crew needs to do the
  isolation trace via the web in the field in order to close optimally the valves in a timely
  manner"* (esri.com "Isolating failures using ArcGIS Utility Network"; solutions.arcgis.com
  Utility Isolation Trace docs; community.esri.com thread 1665846). **This answers my own second
  listed question — "what does closing this isolate" — with a tool that has never opened a
  hydraulic solver.** The trace only needs connectivity and valve state, not heads or flows.
- **CITED** Condition assessment is a GIS/CMMS-paired record, not a model attribute, across
  multiple independent sources: a Field-Operations-Management platform "ties GIS and CMMS together
  at the point of capture," asset management software covers "the full asset lifecycle from
  registry and condition assessment," and the recommendation is explicit that "every new work
  order [be] associated with a GIS asset record" so "condition assessment data" stays current
  (fulcrumapp.com "Water asset management starts with connecting hydrant, valve, and meter
  records"; bynry.com "GIS Utility Asset Management: A Practical Guide"; ziptility.com "Water
  Utility Asset Management Software"). **This answers Tom's "vs." question directly: condition
  lives in GIS, tied to a work order, not in the hydraulic model, and not talked to the model at
  all** in any source I found.
- **CITED** Real deployed field tools for the exact motions in my brief — valve exercising,
  locating an unmapped valve, updating status in real time — are ArcGIS Field Maps / Collector
  paired with a CMMS (Cityworks), not a hydraulic modeling package: Henry County Water Authority's
  valve-exercising program on this stack measured a 65% efficiency gain (esri.com/Henry County
  case study); a separate case study names Cityworks specifically for tracking valve-exercise
  progress and deficiencies (esri.com St. Johns Water District ArcGIS Utility Network + Cityworks
  case study).
- **So the honest answer to the prior question is:** I do not want, and in the sourced examples
  above nobody in my role opens, the *hydraulic* model — WaterGEMS/EPANET-class tools are the
  design engineer's instrument for sizing and simulating, and every field-facing product I found
  reads from a **GIS asset graph plus a work-order/CMMS layer**, never the solver. **Building a
  sharing mechanism so I can carry `lpn_`'s model into the street answers a want that, on this
  evidence, does not exist in my role at a utility that has any GIS/CMMS at all.**
- **Where the "mostly" comes back in — the modest-scope case, checked rather than assumed.**
  **CITED** the RCAP small/rural-utility piece on GIS adoption names "curb stop tie cards" —
  literal index cards — as the record GIS is proposed to replace, and does not mention a hydraulic
  model anywhere (rcap.org "Streamlining Operations: GIS as the One-Stop Shop for Small Water
  Utilities"). At the very small end of this suite's own declared 300 km mission scope, the honest
  picture is not "field crew has a GIS and ignores the hydraulic model" — it may be "field crew has
  a paper card box and no digital asset map of any kind." **For that utility, `lpn_`'s map, if it
  ever reached a phone, would not be competing with a GIS trace tool; it would be the ONLY digital
  network drawing that utility owns**, which changes the stakes of Task 537 for the smallest
  operators even while it stays a non-want for anyone with real GIS/CMMS. I have not found a
  citation that quantifies how common "no GIS at all" still is among systems this suite's size;
  flag as a real gap in what I could verify, not settled.
- **SPECULATION, my own, to be re-derived:** the rare case where I WOULD open the hydraulic model
  is not routine street work — it is a new-development turnover (my brief's *"when was it last
  touched"* extended one step: "was this main ever actually modeled the way the plan sheet
  claims") or a big-break post-mortem where the design engineer's own model is the only record of
  why a main was sized the way it was. Even then I would want to READ it (what pipe is this, what
  size does the drawing claim, what did the engineer assume was upstream), never to edit it — any
  correction I have belongs in the work order / GIS record, not in the calc file, per my own
  brief's open question about permission to edit.
- **What this means for Task 537, stated plainly and not softened:** the deepest issue against my
  using `lpn_` in the street is not file access. **It is that a hydraulic model is not the class of
  document my role reaches for at all**, at any utility past the very smallest. File-transfer
  engineering for a want that mostly does not exist would be effort spent on the wrong side of the
  prior question — see the wish list for what I would actually prioritize instead.

## 2026-08-25 — Task 537, point 3: what "file access on a utility phone" actually is

Even for the narrow "rare read" case above (new-development turnover, big-break post-mortem), I
researched what a utility phone can actually reach, because Tom asked specifically and a design
that assumes a normal consumer phone is designing for the wrong device.

- **CITED** BYOD guidance aimed at exactly this kind of field workforce is explicit that personal
  cloud storage is a PROHIBITED destination for work files, not a neutral convenience: *"no storing
  company files in personal cloud storage (personal iCloud, Google Drive, Dropbox)"*
  (secreadynow.com "BYOD Security Policy for Small Business: What You Actually Need in 2026");
  paubox.com's write-up on separating work/personal data on BYOD names the same risk directly for
  a field worker's job-site photo ending up in a personal cloud account, and describes MDM
  "containerizing" corporate data away from the phone's own file/photo apps so it can be wiped
  independently. **The practical consequence for `lpn_`:** on a managed or even loosely-BYOD-policed
  utility phone, "the phone's own share sheet already has whatever the PC saved" is not a safe
  assumption — a `.json`/`.inp` file dropped into a personal cloud folder to reach the phone is
  precisely the motion these policies exist to block, and a container that walls off corporate apps
  may not expose a general-purpose file picker to a random web page at all.
- **OBSERVED, and this cuts the other way:** `lpn_` needs no login and no server today
  (`dev/looped-network-calculator-scope.md:10`, `CLAUDE.md`'s "no browser units, only project
  units" section) — a link (a URL carrying a small model, per Task 537's own list of shapes) does
  not touch any of the file-storage policy surface above, because it is not a file at all; it is a
  page load. That single property is why a link survives contact with a managed-device policy that
  a shared file does not.
- **SPECULATION, to be re-derived:** a supervisor or the office texting/emailing a link (not a
  file) is very plausibly already inside what a utility phone's messaging/email app is permitted to
  open — those are exactly the channels a dispatch instruction already travels by. I found no
  citation naming this specific pattern for a hydraulic-model link; it is inference from the MDM
  literature above, not evidence.
- **Bottom line for point 3:** the honest phone-access picture is worse for "hand over a file" than
  Task 537's text already assumes (it is not just "a huge paradigm change to add logins," it is
  "the phone may not let a file in at all under real policy"), and better for "a URL carries the
  model" than a first read suggests, because a link sidesteps the file-storage policy question
  entirely rather than needing an exception to it.

## 2026-08-25 — Task 537, point 4: reacting to the listed shapes, from this seat only

Given the answer above (a hydraulic model is rarely what I'd open, and when I would, it is read
only), here is how the shapes Task 537 already lists rank for the narrow case where I'd actually
use one — **not a recommendation to build any of them at priority, since the underlying want is
itself narrow per point 1.**

- **A one-way publish-from-the-desk link ranks highest for my case.** It matches the one real
  workflow I found evidence for (dispatch/supervisor sends the crew a link, not a file — point 3),
  needs no login, and is read-only by construction, which matches "I would never edit this" from
  point 2. It also needs no exception to the BYOD file-storage policies cited above.
- **A file handed over by whatever the phone already has (share sheet, messaging app) ranks
  second, and only conditionally** — it works cleanly for the personal-phone, no-MDM case (very
  plausible at the smallest utilities this suite serves, per the paper-tie-card finding above,
  where there is no formal device policy to trip), but is the shape most likely to be quietly
  blocked on a managed device, per the BYOD citations. A design betting on this shape should not
  assume it reaches every utility phone.
- **A read-only export (PDF/print of the map, or a plain read view) is not really a separate shape
  from the link above** — it's the same "I can look, I cannot touch" property, delivered by a
  different mechanism. Utilities already do the paper-record equivalent of this (as-built plan
  sheets handed to a crew), so it is the least novel of the shapes and the safest to build first if
  this is ever prioritized.
- **Logins and a cloud account rank last, and I agree with Task 537's own instinct not to jump
  there** — not just because of the privacy-sentence cost the task already names, but because
  nothing in my research showed operators authenticating into a *design* tool at all; where they
  authenticate, it is into the GIS/CMMS stack that already exists and that this suite does not
  attempt to be.
- **The shape I would add, not on Task 537's list: nothing.** Given point 1's answer, I do not
  think this project should build ANY new sharing mechanism sized to this want — the want itself
  is the thing to be honest about first. If Tom wants a small, cheap first move anyway (because the
  smallest, no-GIS utilities do plausibly benefit — see point 1's "mostly"), the publish-a-link
  shape is the one to reach for, sized to that narrow case explicitly, not to a general
  "operator needs the model" premise.

## 2026-08-25 — what this project's own heads would have gotten wrong

Tom's framing of Task 537 treats file access as the blocker standing between the field operator and
using `lpn_`. **The evidence says the file-access problem is downstream of a want that mostly is
not there.** Nobody in the sourced field-operations literature opens a hydraulic solver in the
street; they open a GIS trace and a work-order/CMMS record, and condition lives in the second of
those, tied to a ticket, not talked to the model. Solving file transfer well would have produced a
sharing mechanism nobody in my seat, at any utility with an existing GIS/CMMS, would reach for. The
one place the premise survives is the very smallest, least-instrumented utilities inside this
suite's own 300 km scope — the ones still on paper tie cards — where `lpn_`'s map, if it ever
reached a phone, would not be competing with anything better. That is a real but narrow case, and
it argues for the cheapest possible shape (a read-only link) sized honestly to it, not for solving
the general "phone reaches PC's model" problem Task 537's title states.

## 2026-08-30 — Q1: the fire-flow run-progress box, from someone who has to wait for it

Tom, using the whole-system sweep (Task 530, `js/lpn-fireflow.js`) on 2026-08-29: *"There is no
progress line... I finally noticed a yellow counter in the upper left of the map. But that is not
an idiomatic run progress box. They should appear in the middle of the current task with a progress
bar."*

**OBSERVED, what he saw:** the progress text is written by `setStatus()`
(`js/looped-network.js:24945-24957`) into `#lpn_status`, an overlay CSS-pinned "under a top
corner" (`js/looped-network.js:24956`, comment). That element's OWN authored purpose is a
*standing* diagnostic — "true until the model changes" (`js/looped-network.js:24915-24917`) — not
a transient task's progress, and Task 524's own comment already flags it as marginal on a phone:
*"harmless in a desktop corner and is a quarter of the canvas on a phone, sitting on the network"*
(`css/engcalcs.css:2537-2539`). The sweep's `onProgress` callback
(`js/looped-network.js:26103-26112`) drives this same corner box with `{done} of {total}` text and
nothing else — no bar element, no percentage, no visual weight proportional to how much is left.
**Tom is right that this is a diagnostic banner doing a progress dialog's job, not an idiomatic
progress box**, and the CSS comment shows the project already knew that shape strains on a phone
before this reuse ever happened.

**OBSERVED, where "the current task" already lives:** the fire-flow box itself
(`#lpn_ff_box`, opened by `openFireFlowBox()`, `js/looped-network.js:26137-26155`) is the thing the
user deliberately opened to set criteria and press Run — Run and Stop already live inside it
(`js/looped-network.js:25860-25871`), it is user-positioned (centred on open, then draggable/
resizable — the box borrows `.lpn-setbox`'s chrome, `js/looped-network.js:26149-26154` and
comment above `closePopup()`), and on a phone it is already close to full-screen by the shared
`.lpn-setbox` breakpoint rule (`height: min(46rem, 92dvh)`, `css/engcalcs.css:1532`). **"In the
middle of the current task" IS this box** — not the map underneath it, and not a new dialog.

**CITED, what an idiomatic one contains.** Nielsen Norman Group: percent-done or step-based
progress should be shown for any wait over ~10 seconds, both to reassure the user the system has
not crashed and to make the wait itself less painful; where an accurate percent/time cannot be
given, show relative progress as a list of completed/remaining steps rather than a number that
will be wrong (nngroup.com, "Progress Indicators Make a Slow System Less Insufferable").
Material Design's own rule: a *determinate* indicator (fills 0→100%, a plain fraction) is for a
completion rate that CAN be detected; an *indeterminate* one (a bar with no fixed endpoint) is for
when it cannot (material.io, "Progress indicators"). EPANET's own Run Status window is a separate,
non-modal dialog that appears while the engine computes and reports status as it goes (epanet22
readthedocs, "8. Analyzing a Network") — evidence that "a dedicated box over the workspace, not a
corner note," is already the desktop hydraulic-tool norm, not a novelty being proposed here.

**My recommendation, concrete:**

- **Position:** inside `#lpn_ff_box`, in the space the report currently occupies while idle — not
  the map corner, not a new modal. The box is already "the current task"; nothing new needs to be
  built to put progress there, only re-routed.
- **Determinate, and honestly so.** The bar's fraction is `done / total` **junctions**, which is a
  plain count known exactly before the first solve — it needs no assumption about cost per
  junction, so it stays honest even though the per-solve cost is not flat.
- **NO time estimate, and this is not a UI nicety — the data forbids it.** Task 530's own measured
  numbers (`dev/ROADMAP.md:216-218`): per-solve cost rises **1.1 → 31.0 ms** from 49 to 225
  junctions, and growth exponent climbs 1.9 → 3.16. An ETA built from the early, cheap junctions
  would be optimistic and get WORSE as the run continued — the reverse of the normal case where an
  estimate sharpens near the end. That is exactly the failure NN/g's guidance warns against: a
  number implies a promise the data cannot back. **Recommendation: state the junction count only
  ("47 of 225 junctions checked"), never a derived time.** A bar filling on the honest fraction is
  not a time claim and needs no such caveat.
- **Say more than a bare count while the person waits.** The sweep already knows pass/fail/error
  per junction as it goes (`fireFlowRun`/results structure, `js/looped-network.js:25726-25742` for
  the reading pattern used after a run). A running tally under the bar — passing / failing / no
  answer, updated at the same cadence as the count — gives a person something to actually read
  instead of a climbing number, at zero extra solve cost.
- **Non-blocking, unconditionally.** Stop stays where it already is, in the button row
  (`js/looped-network.js:25868-25871`), reachable the whole run; nothing about moving the progress
  text into the box's body should turn it modal or trap focus. The box is draggable today and
  should stay so — SPECULATION, to be re-derived: if live per-junction map colouring is ever added
  (it is not built today — `onProgress` calls only `setStatus()`, never
  `refreshFireFlowMarks()`, `js/looped-network.js:26103-26112`, so nothing on the map currently
  changes mid-run), a non-modal box a desktop user can drag aside is the only shape that survives
  that addition without a redesign.
- **On a phone, this box is already most of the screen (92dvh) the moment it is open** — so the
  practical requirement is ORDER, not size: put the bar, the count, and Stop directly under the
  header, above the criteria inputs, so a person does not have to scroll a form of fire-flow
  settings to find the one button they need mid-run. Do not switch to a spinner/indeterminate look
  on the small screen — a plain "47 of 225" number is exactly as legible at 92dvh as at desktop
  size, and it survives sun glare and a gloved thumb better than judging a moving bar's fill level
  by eye.

## 2026-08-30 — Q2: the tooltip mechanism, and the two defects Tom hit on a phone

Two reports from Tom, both about the Node editor's `?` tips on a phone: tapping one "brings up my
input keyboard when I am not ready," and a tip "survive[s] the editor box on close."

**OBSERVED, defect 1 — the mechanical cause, and it is not the tooltip code at all.**
`unitNumberField()` (`js/looped-network.js:22600-22614`) builds a native `<label>` element,
appends the `?`-carrying `.ec-help` span to it via `setFieldLabel()`
(`js/looped-network.js:22471-22496`), and then appends the `<input>` itself as the label's own
child. That is the browser's own label/control PAIRING — clicking anywhere inside a `<label>`,
including a plain child `<span>`, fires the browser's native "activate the associated control"
behaviour unless something stops it. `js/Calculators.lib.js:35-77`'s tap-triggered tooltip code
(`trigger: 'click'` for a non-control label, since `ecTipIsControl()` — `js/Calculators.lib.js:27-29`
— does not recognize a `<label>` as a control) opens the Bootstrap tip on that same tap, but nothing
in it calls `preventDefault()`, so the native label behaviour fires alongside it and focuses the
number input, which is what raises the keyboard. **This is a placement defect (the tip lives inside
the very `<label>` it is describing), not a defect in the long-press/click-trigger design itself.**

**OBSERVED, defect 2 — the survive-on-close.** `closePopup()`
(`js/looped-network.js:22336-22339`) only hides `#lpn_popup` and clears `currentPopup`; it never
calls `hideOpenTips()` (`js/looped-network.js:21501-21507`) or disposes the Bootstrap instance. A
Bootstrap tooltip renders into `document.body`, independent of the triggering element's own subtree
— the code's own comment on `clearFields()` says this explicitly for a different call site
(`js/looped-network.js:22508-22512`: *"A tooltip that is OPEN at that moment lives in document.body,
not in the popup, so wiping innerHTML would strand it"*). `closePopup()` is exactly that unguarded
case: a tip left open when the box closes is simply never told to close, because nothing tells
it to. `openSettingsBox()` (`js/looped-network.js:16905` area) already calls `hideOpenTips()`
before showing itself, which suggests the fix pattern already exists in the codebase and was
just not applied to `closePopup()`.

**My verdict: both are the right, obvious fixes — call `hideOpenTips()`/dispose from
`closePopup()`, and stop the tip's own tap from also firing the label's native click (move the `?`
outside the `<label>`, or `preventDefault()` on it). I do not want a different tooltip mechanism.**
Reasoning, from this seat:

- A definition read once and never again is exactly what tap/long-press-reveal is for. Printing
  every field's explanation permanently on a form already tight on a phone screen would cost more
  (a cluttered one-handed form, CLAUDE.md's own "column width is king" instinct extended to forms)
  than it saves — I would not trade a form I can scan in one glance for one padded with text I
  already know after the first read.
  - **A candidate worth naming, not insisting on:** the collision exists because a PLAIN label
    gets `trigger: 'click'` while a CONTROL gets long-press (`js/Calculators.lib.js:39-48`,
    reasoning at :19-26). Long-press was chosen for controls for exactly the reasons that matter to
    me outdoors — a tap must still do the button's job, glare and gloves make a precise short tap
    unreliable. **A node-editor field label sits directly on top of an input the same way a button
    sits on top of its own action**, so the same argument that justified long-press for a control
    plausibly applies here too, and would remove this whole class of "click also did something
    native" collision by construction rather than by a `preventDefault()` patched on afterward.
    I am NOT asking for this — it is a bigger, more consistent redesign than the two bugs need, and
    whoever owns `js/Calculators.lib.js`'s trigger rule should weigh it, not me. Flagging so it is
    not silently lost.
- **Where I would push back if asked, and nobody has: don't build a "richer" tooltip** (an
  always-expandable info panel, a persistent glossary drawer). A tip that must be summoned once and
  then get out of the way is the correct shape for someone who is not going to consult it twice;
  the fix that is being made — stop it stealing focus, stop it outliving its own box — is the whole
  fix. **This is a case of "it is fine, just stop it doing the wrong extra thing," not a case for a
  new mechanism** (per my brief's own instruction that this is as valid a finding as a new want).

## 2026-08-30 — Tom overruled my progress-box placement, and the shape of the error

**CITED (Tom, 2026-08-30):** *"The utility engineer is wrong. The run progress bar is so important
that all applications put it in a new dialog with nothing but the progress, a stop button, and maybe
some other progress stats."*

I had recommended putting the fire-flow sweep's progress inside `#lpn_ff_box` — the box the user had
already opened — because it is already centred, already draggable, and already nearly full-screen on
a phone. Every one of those observations is true and none of them was the question.

**The reasoning error, stated so a later invocation can recognise it in itself:** I asked *where can
this go with the least change* and presented the answer as though I had asked *what kind of object is
this*. A run-progress indicator for a wait of minutes is its own dialog in nearly every application
that has one, and that convention is stronger evidence than the convenience of a box that happened to
be open. **I had EPANET's own separate Run Status window in my own citations** and read it only as
evidence against the map corner, when it was equally evidence for a dialog of its own. A citation
that supports two conclusions and is quoted for one of them is a citation half read.

**What survives, untouched by the ruling:** no time estimate on this run, ever. That argument is from
Task 530's measured per-solve cost RISING through a run (1.1 -> 31.0 ms, 49 to 225 junctions), so an
ETA from the early junctions is optimistic and gets worse as the run continues. It is an argument
about the numbers, not about placement, and Tom did not touch it.
