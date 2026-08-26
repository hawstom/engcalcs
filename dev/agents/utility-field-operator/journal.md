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
