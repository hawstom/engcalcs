# Utility design and planning engineer — journal

Written by the `utility-planning-engineer` agent, read by its next invocation. Tom and other
agents may read it. Anyone else who writes here signs the line — see the CORRECTION tag.

**Every entry carries one provenance tag.** CITED = external source, named, quotable
later. OBSERVED = this repository, `path:line`, quotable later. SPECULATION = the
agent's own inference, to be re-derived before anyone relies on it. An untagged entry
is a defect. **CORRECTION** marks a line written by someone other than this agent, fixing a
factual error; it is never removed silently.

Newest at the top. Date every entry. Keep an entry to a few lines; if it needs more,
it is a `dev/*.md` and the entry is one line pointing at it.

---

## 2026-08-25 — Task 537: my half — how a model moves today, and who may legally hold it

Tom split Task 537 across two seats: the field operator answers whether they even want the file;
this seat answers how sharing actually works and whether "put it on the cloud" clears a utility's
own legal/organizational bar. Full findings below; the short answer is **no, and not for an
architecture reason — for a legal-exposure reason a utility's own counsel would give.**

- **CITED, how the market's own answer works, and what it actually is underneath.** Bentley's
  ProjectWise integration for WaterGEMS is check-out/check-in of a **file** (`*.wtg` +
  `*.wtg.sqlite`), one editor locked at a time, with document history
  (docs.bentley.com, "Working with ProjectWise"). Even the enterprise answer is a governed FILE, not
  a live shared database — ProjectWise is a purchased, administered add-on product, which is itself
  evidence of scale: it exists for utilities and consulting firms large enough to buy and run
  document management, not for a modest system. **I found no citation of ordinary small-utility
  practice below that tier** (a direct "engineers just email the `.inp`" source did not turn up),
  so I say plainly: the file-by-email/shared-drive practice below ProjectWise's tier is my own
  inference from the shape of the market (nothing below the enterprise product, and CAD/GIS
  deliverables at this scale are conventionally exchanged as files) — **flag as SPECULATION, not
  found directly**, though it is consistent with how this suite's own submittal deliverables move
  (a `.inp` or a saved project, attached).
- **CITED — a utility's network model is not hypothetically sensitive; multiple states have already
  legislated that it is.** A summary of state FOIA carve-outs (search synthesis of Kentucky
  §61.878, Pennsylvania's Right-to-Know Law, and a Washington statute, cross-corroborated across
  three independent search results — I could not directly fetch the primary statutory text, Kentucky's
  site returned 403 and the PDF at awwaneb.org, "State FOIA Laws: A Guide to Protecting Sensitive
  Water Security Information," is image-only and did not OCR — **flag as secondary, not read
  primary-source**) states that multiple states exempt from public disclosure "detailed drawings,
  schematics, maps, or specifications of... utility... systems" and infrastructure records that
  "expose vulnerabilities through disclosure of the location, configuration, or security of critical
  systems, including public utility critical systems," **naming water and wastewater explicitly**.
  **CITED, federal layer:** AWIA (2018) risk and resilience assessments are excluded from federal
  FOIA (epa.gov AWIA §2013 material), but **has no automatic exemption from a STATE or local FOIA**
  — so protection is real but jurisdiction-dependent, and a utility's own counsel, not a general
  federal rule, is what actually decides whether a given document may leave the premises.
- **What this means for the cloud-login proposal, stated as the utility's own reason, not an
  architect's:** a small utility's IT/legal review is not being asked "is this vendor's encryption
  good enough" — it is being asked to hand a **complete network topology of a system already
  identified by name in state law as the kind of record whose disclosure could "expose
  vulnerabilities"** to a volunteer project with no SOC 2, no incident-response contract, no data
  processing agreement, and no institutional accountability if it is breached or simply disappears.
  **That is not a close call for a risk-averse public agency, and it is the utility's reason, not
  ours: they would be creating a NEW disclosure/breach liability where none exists today**, because
  today the model lives on one employee's machine and is covered by whatever records-retention and
  device policy already governs that machine — nothing new to defend in an audit. A free, no-login,
  local-only tool is the one shape that never has to answer this question, because it never holds
  the fact pattern the exemption law is written about.
- **The honest scale caveat, so this is not overstated:** the sensitivity above scales with what the
  file actually shows. A subdivision-scale Elm Street Center model (a hydrant, three homes) is not
  the fact pattern any FOIA exemption was written for; a whole-system master-plan model with every
  valve and main is closer to it. **This project's stated mission scope (300 km span,
  `CLAUDE.md`, OBSERVED) sits on the side of the line where the concern is real for at least the
  larger end of its own declared audience**, so the caveat does not make the concern go away, it
  just says it is not uniform across every file this suite will ever hold.
- **Ranking Task 537's no-server shapes from this seat, honestly, and what I would refuse.** (1) **A
  file via the phone's own share sheet** — ranks highest: it is exactly the CAD/GIS deliverable
  pattern utilities already run today under their existing device and records policy, adds no new
  risk surface, and needs nothing built beyond what a browser's native share/save already does.
  (2) **A read-only export** — close second, and arguably the RIGHT default for this specific
  seat: "only the user touches a file's numbers" (`CLAUDE.md`, OBSERVED) already treats an imported
  file as untouchable by us, and an operator who can view but not corrupt the designer's live
  numbers is a smaller failure mode than handing over an editable project. (3) **A URL carrying a
  small model** — ranked third, with a real caveat named rather than glossed: a URL is copyable,
  gets cached in browser/SMS history, and can sync to a personal cloud account (iCloud/Google) the
  utility never vetted — fine for a subdivision-scale extract, a live version of the same exposure
  named above for a full system. (4) **A one-way "publish from the desk to a link"** — the one I
  would flag hardest, and the one to watch for scope creep: it is fine ONLY if "the link" points at
  storage the UTILITY already controls (their own intranet, their own file share); the moment
  "publish" implies a link WE host, it has quietly become the cloud-login proposal in a smaller
  costume, and Task 537's own instruction — say what happens to "nothing you draw is uploaded" as
  the first paragraph — would apply to it exactly as it would to logins. **I would refuse that
  version outright**, for the same reason as logins: it is this project, not the utility, deciding
  to hold the utility's sensitive record.

---

## 2026-08-25 — correction: coefficient availability is not a demand criterion; wish list re-ranked

**CITED — Tom, replying point-by-point to the prior wish-list pass:** *"Lack of coefficients is not
the same as lack of demand. Strip that criterion from our decision matrix."* This is a correction of
a reasoning error in my own prior work, not a stylistic note, and it is recorded here so a later
invocation does not re-import the bad criterion.

- **What I had done wrong, named plainly:** Row 3 of the 2026-08-25 research pass ranked "water age
  only" above chlorine partly BECAUSE age needs no user-supplied reaction coefficient and chlorine
  does — and the same reasoning shaped my Task 530 hydrant-`k` recommendation (favoring "model the
  barrel as a pipe" partly to avoid needing a separately-sourced coefficient). **That conflates two
  different questions: does a user want this, and is a number easy for me to source.** They are
  unrelated. A design engineer wanting chlorine residual reporting is not diminished by the fact
  that the bulk decay coefficient has no textbook default.
- **The corrected rule, going forward:** a missing or hard-to-source coefficient is a DESIGN
  problem — solve it with ask-or-disclose (a user-editable field, no invented default presented as
  fact, the interface states plainly when no default is offered and why) — not a reason to decline
  or downrank a want. This is exactly the shape Task 530 already committed to for the hydrant `k`
  before a sourced number was found, and it should have been generalized then rather than only after
  Tom pointed it out.
- **What actually changed when I re-applied this:** water quality is back in as three separable
  rows (age, source tracing, chlorine/reaction) rather than one narrow age-only row with chlorine
  declined; Task 530's own reasoning about the barrel is reworded so the pipe-segment recommendation
  stands on its hydraulic merits (an undersized waterway is a real hydraulic element) rather than on
  coefficient-avoidance as a design goal in itself.
- **What did NOT change, checked honestly rather than assumed:** re-reading every other row in the
  prior pass (scenario multiplier, comparison table, GeoJSON export, the declined system-wide
  fire-flow and land-use-GIS items, the automated-calibration decline) — none of their reasoning used
  coefficient availability as a criterion. **The stripped criterion only ever touched water quality
  and the hydrant-`k` framing; it did not move any other ranking**, and I say so rather than
  manufacturing movement elsewhere to look more responsive. Full re-ranked list: `wishlist.md`.
- **Also answered this session, recorded there rather than duplicated here:** fire-flow mapping
  reconsidered and promoted into the ranked list (Tom asked me to reconsider, not to comply — the
  case for and against is written out in `wishlist.md` Row 3); land-use-GIS demand allocation moved
  from Declined to Parked per Tom's distinction between the two; rule-based controls answered as an
  operations want, not a design-and-planning one, from evidence (EPANET's own `[RULES]` worked
  examples are pump/tank SCADA logic, not a sizing question).

---

## 2026-08-25 — Task 530 follow-up: the k I said did not exist was hiding under a different name

Tom ruled *"including some k whatsoever is non-negotiable"* and asked for the number to be
researched hard before falling back to reasonable judgment. My same-day entry below said flatly
**"NOT FOUND, and I looked"** for a published k or head-loss curve for a hydrant's internal
waterway. That was too quick — I had searched hydraulics textbooks and manufacturer marketing
copy, not **procurement specifications**, and that is where the number actually lives.

- **CITED — the number, found twice independently.** Two unrelated documents both state:
  *"Friction loss shall not exceed 3.0 psig at 1000 GPM through the hydrant 4-1/2 in. pumper
  nozzle"* — the Bryan/College Station TX joint municipal water design standard, Section 33 12 19
  Fire Hydrants (bcsunited.net, revised 3/2024, explicitly tied to "AWWA C-502 latest revision,"
  tested by an independent lab, PE-attested), and American-Darling/Waterous's own product
  specification sheet for their ALPHA-base hydrants (american-usa.com), independent of each
  other and agreeing to the tenth of a psi. This is a **maximum-allowable QA test limit under
  AWWA C502**, not a textbook K — which is exactly why hydraulics references never carry it and
  manufacturers only ever say "minimizes friction loss" in prose: the actual number lives in
  procurement boilerplate, not in a hydraulics table. **A search summary (unverified against the
  primary text — flag as secondary) said the AWWA C502 baseline itself is 5.0 psi at 1000 gpm and
  that 3.0 psi is a tightened municipal/manufacturer spec** — I could not reach the primary
  standard to confirm 5.0 psi directly; the 3.0 psi ceiling is doubly corroborated and is the
  number I use.
- **This converts to a real K, referenced to the 6 in lateral/shoe pipe** (the standard connection
  size per my prior entry): 3.0 psi = 6.93 ft of head at Q=1000 gpm. In a 6 in pipe, V=11.35 ft/s,
  V²/2g=2.00 ft, so **K ≈ 3.5** for the hydrant's own barrel + main valve + nozzle alone, as a
  worst-case-allowable (conservative-for-design) value — real hydrants that pass QA perform at or
  better than this, so using the ceiling under-states available flow rather than over-stating it,
  which is the right direction to be wrong in a fire-flow tool.
- **CITED, standard-fitting build-up for the rest of the assembly** (tee off the main, lateral
  isolation gate valve, elbow into the riser) — Crane Technical Paper 410's own method,
  K = n·f_T, corroborated independently across simupipe.com, midstreamcalculator.com and a
  general-engineering K-table search: gate valve fully open K≈0.15, flanged 90° elbow K≈0.3–0.5,
  tee flow-through-branch K≈1.0. **Build-up subtotal ≈1.5.** These are widely published,
  textbook-standard values — unlike the hydrant barrel term, this part of the list was never the
  gap.
- **Recommended total: K ≈ 5 (range 3–6), referenced to the lateral pipe's own velocity, and
  labelled honestly in two pieces** — the barrel/valve/nozzle term (~3.5, from a real AWWA C502
  QA ceiling) dominates, and the lateral-fitting build-up (~1.5, from Crane) is the smaller,
  fully-standard remainder. Never present the sum as one measured number; the provenance of each
  half is different and a user should be able to see that.
- **THE ARITHMETIC TOM ASKED FOR, done and corrected once already** (I made a 10x Hazen-Williams
  error on the first pass — a units-mismatched textbook constant I half-remembered — and caught it
  by cross-checking against the velocity form V=1.318·C·R^0.63·S^0.54 and against Darcy-Weisbach;
  all three now agree). At Q=1000 gpm through 6 in C=140 cement-lined DI pipe: **friction loss is
  64.5 ft per 1000 ft** (V=11.35 ft/s, well above any normal design velocity, which is exactly why
  it is large). Against the fixed 6.93 ft hydrant-barrel loss: at a **25 ft lateral** (Addison TX's
  standard), friction = 1.6 ft, **minor loss is 4.3× friction**; at **50 ft** (Northlake/Clyde Hill),
  friction = 3.2 ft, minor loss is **2.2× friction**; at **100 ft** (Prosper TX's outer limit),
  friction = 6.5 ft, **the two are about equal, 1.07:1**. The ratio depends almost entirely on
  lateral length and weakly on flow (∝Q^0.148/L) — checked at 500 gpm too, same conclusion within
  a few percent. **Verdict: across the whole realistic range of lateral lengths found in real
  design standards, minor loss is never smaller than friction loss and is usually 2–4× it.** That
  is a real, quantified, moderate version of Tom's worry — not the 10–40× dominance my first
  (wrong) pass would have reported, which is why the "show your work" instruction mattered here.
- **Q4 — is hose/nozzle analysis past the outlet standard practice for a distribution model?
  NO, clean no, and here is the boundary.** AWWA M31 (required fire flow) and NFPA 291 (rated
  capacity, hydrant flow testing) both define hydrant performance strictly AT THE HYDRANT OUTLET —
  a pitot reading, not a delivered stream. WaterGEMS/WaterCAD's own Hydrant element (docs.bentley.com,
  "Hydrant Attributes" and "Hydrants") stops at exactly the same boundary: it has a
  `Minor Loss Coefficient (Hydrant Lateral)` / diameter / length toggle ("Include Lateral Losses")
  and nothing past the nozzle — **no hose network, no nozzle pressure, no hand-line modeling
  anywhere in the leading commercial tool.** Fire-ground hydraulics (hose friction loss, nozzle
  reaction, pump discharge pressure) is IFSTA/NWCG pump-operator territory with its own manuals and
  its own inputs (hose lay, chosen at the fire scene, not known to the utility's model at design
  time). Carrying the analysis past the outlet would be building a second profession's tool inside
  this one; the option is closed.
- **Corroborating find, not the headline:** WaterGEMS/WaterCAD's own hydrant element ships with
  the identical three fields Tom specified — minor loss coefficient, diameter, length of the
  lateral — **and no published default for any of them**, confirmed by fetching both the WaterCAD
  and HAMMER "Hydrant Attributes" pages directly. Even the market-leading paid tool leaves this to
  the user. That is independent confirmation that "the research is thin" was the correct read of
  the field, not a failure of this agent's first search — the AWWA C502 QA-spec number is the one
  piece of ground truth that exists ANYWHERE, and it was worth the second pass to find it.
- **Library "type" fields (Q5) — minimal set recommended:** make, model, main-valve/waterway
  diameter (4½ or 5¼ in per AWWA C502 — the number that actually constrains flow, distinct from
  the 6 in shoe), outlet configuration (count and size of nozzles), and the k itself (editable,
  defaulting to the ~5 recommendation above, with its two-part source visible). **Deliberately
  left out:** installation year and NFPA 291 colour class — both are per-instance, time-varying
  FACTS ABOUT ONE INSTALLED HYDRANT (age, and a field-tested rated capacity that depends on that
  hydrant's own main pressure on the day it was tested), not properties of a reusable type; baking
  either into a saved type would go stale silently. Lateral diameter/length/roughness stay
  per-instance ad-hoc inputs exactly as Task 530 already scopes them — they are site geometry, not
  hydrant type.
- **What this project's own heads would have gotten wrong:** both Tom's ruling and my own same-day
  entry assumed the honest ending was "no defensible number exists, be reasonable, don't swallow a
  camel." The literature is better than that assumption — there IS a real, twice-corroborated,
  quantified industry number, it is just filed under AWWA C502 QA testing and municipal
  procurement boilerplate rather than under "hydraulics" or "K-factor," which is exactly the kind
  of place nobody inside a hydraulics-calculator codebase would think to search without being
  told the number might not look like a K at all.

---

## 2026-08-25 — market-research pass: wish list grown from one row to four new plus one promoted

Tom, reacting to a one-row wish list: *"I am disappointed that their wish list is not
overwhelmingly long. Increase their research budget."* This entry is the outward-research pass;
full case, citations and honest sizes are in `wishlist.md` — this is the compressed index.

- **Row 1 (ranked highest): a scenario-level demand multiplier.** **CITED** three independent
  published master plans (San Bernardino MWD Section 7, sbmwd.org; City of Squamish 2024 update,
  squamish.ca; City of Astoria, astoria.gov) all structure their hydraulic chapter around the same
  three named conditions — average day, maximum day (+fire), peak hour. **OBSERVED** the one
  bulk-write tool `lpn_` has ("Apply starting values to all elements," `js/looped-network.js:17995`)
  is Base-only and refuses inside a scenario (`:18003`) — so building "max day" over "average day"
  today means hand-editing every junction, which stops being "one line" work well before 20 nodes.
- **Row 2: a scenario comparison table (batch run).** **CITED** Bentley's own WaterGEMS docs
  advertise exactly this — "batch run… results of multiple scenarios in one single application…
  with only 2 clicks" (blog.virtuosity.com, docs.bentley.com) — read as evidence of demand, not of
  quality, per this agent's standing instruction. **OBSERVED** nothing like it exists; results are
  read one scenario at a time, and the closed Task 327 colour-by-value view is one-field-one-scenario
  by explicit design ("two quantities coloured at once is a map with two legends").
- **Row 3: water age only, a narrow crack in the blanket "water quality, in every form" cut.**
  **CITED** EPANET's age analysis "requires no user-defined reaction coefficients… built-in
  zero-order kinetics" (openepanet.org, a ResearchGate-indexed paper on EPANET water age) — unlike
  chlorine decay, it needs no coefficient a design engineer would have to invent, which is the exact
  failure mode that killed a sourced hydrant-barrel `k` in the entry below. **CITED** EPA's own TCR
  distribution white paper and a real small-system case (Eureka, MO, Bartlett & West 2018 report)
  both name oversized fire-flow-driven mains and poor tank turnover as the actual cause of water-age
  complaints — the same failure mode Task 530's lateral work reveals from the demand side. **Thin
  spot, named plainly:** no numeric water-age design standard found (Ten States Standards or
  equivalent) — the guidance is qualitative, so a page reporting age would have no stated pass/fail
  the way pressure and fire flow do.
- **Row 4 (ranked last, honestly): plain WGS84 GeoJSON export of a geographic project.** **CITED**
  real municipal as-built GIS submittal requirements exist and are specific — State Plane CRS,
  Esri geodatabase, utility asset schema (montbelvieu.net "GIS Data Requirements"; New Jersey
  American Water CAD-to-GIS standard) — and I state plainly that a raw WGS84 GeoJSON export does
  NOT satisfy that requirement; it is at best a five-second head start for a utility's own GIS
  person in QGIS, not a submittal. Small to build, small in what it actually solves.
- **Roadmap disagreement, stated once:** Task 468 ("Demand categories on a junction," priority 25
  Maybe) is framed on `dev/ROADMAP.md` purely as import fidelity ("the breakdown the importer
  already flattens"). From this seat it is worth more — several master plans apply *different*
  peaking factors by land-use category, which is exactly what demand categories would carry once a
  scenario multiplier (Row 1) exists. I would move it to at least 50 (Someday) on that second,
  independent reason.
- **Declined, with reasons recorded in `wishlist.md` so they are not re-read from scratch:**
  system-wide fire-flow mapping (needs a calibrated, detailed model at a scale this suite correctly
  declines), land-use/GIS demand allocation (real, but "Being a GIS" is already cut for reasons that
  apply word for word), full as-built GIS export meeting a real spec (same GIS-scope reason),
  automated calibration against field flow tests (folds into Task 530's mechanism, not a
  freestanding win at this scale, **SPECULATION**), chlorine/multi-species water quality (stays cut).
- **What this project's own heads would have gotten wrong:** nobody inside this repo would have
  found the master-plan literature's insistence on the avg-day/max-day/peak-hour triad (Row 1) —
  it is outward evidence about a workflow this project has never had to run, and it is the one
  finding this pass that changed my own ranking mid-research (I expected the comparison table,
  Row 2, to rank first, until three independent master plans converged on the same three scenario
  names and made the multiplier the thing without which the table has nothing to compare).

## 2026-08-25 — Task 530 research: the hydrant lateral assembly, so the wizard can ask or disclose

Tom promoted my Task 530 wish to priority 75 and ruled it must ask-or-disclose diameter, roughness,
`k` and length of a lateral+hydrant add-on, applied ad hoc before reporting fire flow. Findings,
each independently searched, no primary AWWA/NFPA text reached (M17, C502, C503 are all behind the
ANSI store paywall — previews only, same posture as `rc`'s unreachable Robinson paper).

- **CITED** Lateral diameter and length: five US municipal water-system design standards, found
  independently, agree on 6 in (150 mm) minimum lateral diameter and disagree on max length by 4x:
  Addison TX 25 ft max (addisontx.gov, water_system_requirements.pdf), Prosper TX 100 ft max
  (prospertx.gov Water-System-Design-Requirements), Northlake TX 50 ft max / 8 in required beyond 20 ft
  (town.northlake.tx.us Part-IV-Water-and-Wastewater-Lines), Clyde Hill WA 50 ft max / 8 in beyond 50 ft
  (codepublishing.com/WA/ClydeHill/13.08). **A defensible default is 6 in DI, ~25–50 ft** — the
  *diameter* is near-universal across the sample; the *length* is genuinely site-specific (distance
  from main to hydrant location) and no single number is honest as a silent default.
- **CITED** AWWA C502 dry-barrel hydrants: main-valve waterway is 4½ in or 5¼ in (ANSI/AWWA C502-18
  preview, webstore.ansi.org); **the inlet/shoe connection to the lateral is standardized at 6 in
  (150 mm)**, mechanical-joint or flanged per AWWA C111/A21.11 (directindustry.com NAFFCO C502
  listing; multiple manufacturer spec sheets, e.g. mh-valve.com Style 929). **This resolves what
  Tom meant by "a 150 mm barrel": it is the standard hydrant SHOE connection, not the internal
  waterway** — the two numbers differ (150 mm inlet vs 114–133 mm waterway) and a model that only
  represents the inlet pipe size would still overstate capacity, because the internal valve opening
  is the tighter constraint in most hydrants, and older/smaller hydrants in real systems (4 in valve,
  or pre-C502 stock) are tighter still.
- **CITED** NFPA 291 rated-capacity color code, at 20 psi residual: Class AA ≥1,500 gpm (light blue),
  Class A 1,000–1,499 (green), Class B 500–999 (orange), Class C <500 (red) — consistent across
  independent secondary sources (blog.ansi.org NFPA 291-2019 summary; loslunasnm.gov; allfirefighter.com).
  Primary NFPA 291 text not reached (NFPA free-access reading room requires login I did not attempt).
- **CITED** ISO's insurance grading practice caps the fire-flow credit from a single hydrant at
  1,500 gpm regardless of what the main could otherwise deliver, and grades multi-hydrant credit down
  by distance (1,000 gpm within 300 ft, 670 gpm 301–600 ft, 250 gpm 601–1,000 ft) — found independently
  via blog.bentley.com ("Where Did This Equation for Hydrant Flow Test Results Come From?") and an
  eng-tips.com thread quoting the same ISO rule. **This is the standard practitioners already use to
  avoid the exact failure Tom named** — not a k-value cap but a flat ceiling applied to the reported
  number, independent of what the hydraulics alone would say.
- **CITED** Pitot-gauge field flow testing (a DIFFERENT measurement from what a model reports) uses
  Q = 29.83·Cd·d²·√P with Cd = 0.90 (smooth, rounded outlet, most modern hydrants) or 0.80 (square,
  sharp outlet, common on older stock) — consistent across IFSTA/NFPA-sourced summaries
  (industrialmonitordirect.com NFPA 291 explainer; multiple hydrant-flow-calculator sites citing the
  same constant and coefficient pair). **This Cd is NOT the lateral's minor-loss `k`** — it converts a
  pitot reading at a flowing 2½ in outlet to gpm; it has no direct bearing on how our wizard should
  model the barrel, but it is worth knowing the two numbers are unrelated so nobody imports 0.9 as a
  `k` by pattern-match.
- **CITED** One anonymous forum post (eng-tips.com, via search summary, not independently verified) put
  a number on why a 6 in lateral at 1,500 gpm is a rough ceiling: velocity near 17 ft/s through a
  90° turn at the hydrant base at that flow. **I could not reach the original thread to confirm the
  arithmetic myself** (6 in pipe, 1,500 gpm ≈ 17 ft/s is dimensionally close — I did not independently
  recompute it, flag as SPECULATION-adjacent until re-derived) — but the shape of the claim matches
  every design standard above: a 6 in lateral is undersized for 1,500 gpm by any normal design
  velocity limit (5–10 ft/s is the usual range in the same design standards, e.g. Northlake's 8 in
  upsize rule exists for exactly this reason), so the wizard's own hydraulics, given a 6 in lateral,
  will already show a large loss at high flow WITHOUT a separately-sourced k for the hydrant body.
- **CITED** DI pipe Hazen-Williams C: AWWA/DIPRA cite C=140 for cement-lined new ductile iron, aging
  toward ~120 over ~20 years (uni-bell.org "Ductile Iron Pipe's Hazen-Williams Flow Coefficient
  Declines Over Time"; pe.mcwane.com DIPRA hydraulic-savings sheet). For a 20–50 ft lateral this barely
  matters in absolute head loss — C=120 vs C=140 on 50 ft of 6 in pipe at fire flow is a few hundredths
  of a foot either way — so roughness is the cheapest of the four to default.
- **SUPERSEDED 2026-08-25 by the follow-up entry at the head of this file — DO NOT ACT ON THIS
  BULLET.** The number does exist. It is a maximum-allowable friction-loss spec in AWWA C502's QA
  clause (3.0 psi at 1000 gpm through the 4½ in pumper nozzle), quoted verbatim in municipal design
  standards and in manufacturers' own spec sheets, and it works out to **K ≈ 3.5** for the barrel.
  What was wrong here was not the searching but the **filing**: it is indexed under manufacturing QA
  and procurement boilerplate, not under "hydraulics" or "K-factor". Left standing rather than
  deleted because the lesson is the search, and because a later invocation that finds only the
  correction learns nothing about where to look next time.
- ~~**NOT FOUND, and I looked**~~: a published `k` (minor-loss coefficient), equivalent length, or
  head-loss-vs-flow curve for a dry-barrel hydrant's own internal waterway (the AWWA M17 number).
  Every hydrant manufacturer spec sheet I reached (Mueller Super Centurion, M&H 129/929) claims
  qualitatively that its valve geometry "minimizes friction loss" and none published a curve or
  coefficient. AWWA M17 itself (the document that should carry this) is paywalled beyond a preview.
  ~~**This is the one number in Tom's list of four I cannot honestly disclose a sourced default
  for.**~~ — false, see the correction above.
- **SPECULATION, AND NOW PARTLY OVERTAKEN**: this proposed modelling the barrel as a pipe segment
  *instead of* carrying a k. Tom ruled that some k is non-negotiable, and a sourced k was then
  found, so the answer is BOTH — barrel and lateral as pipe, plus a k of about 5. The reasoning
  below is still the right reasoning about why an undersized waterway matters.
- **SPECULATION**, my own, re-derive before relying on it: given the missing k, the wizard is better
  served by modelling the hydrant barrel as a short pipe segment at its actual waterway diameter
  (4½ in or 5¼ in, disclosed, user-editable) in series with the lateral, rather than inventing a k
  for an unmodeled "point" hydrant — the velocity-squared loss through an undersized barrel then
  emerges from the same Hazen-Williams/Darcy-Weisbach machinery already in `js/PipeHydraulics.lib.js`
  and needs no separately-sourced coefficient at all. This also directly produces the number Tom
  wants: a report that a 150 mm-shoe hydrant with a 4½ in waterway cannot pass an enormous flow,
  because the waterway is now a real hydraulic element, not a caveat.

## 2026-08-24 — first invocation: "what glaring priority did we miss?" → nothing glaring

- **ANSWER GIVEN: nothing glaring.** Reasoning and citations below. Also named one real,
  small, honestly-scoped want (automated available-fire-flow bisection) at Maybe priority,
  explicitly flagged as NOT glaring — the manual path already works.
- **CITED** AWWA M31 defines *required fire flow* as the rate at 20 psi residual for a
  specified duration. **CITED** EPANET itself has NO automated fire-flow tool — commercial
  add-ons (WaterCAD, H2Onet) or a free standalone (Optiwater's `FireFlow`, a bisection
  wrapper around an `.inp` file) do it, confirmed across multiple openepanet.org forum
  threads and optiwater.com/fireflow.html. **So a gap here is not a gap against EPANET —
  matches `dev/positioning.md` §2's "never write a completeness claim against EPANET."**
- **OBSERVED** `lpn_`'s scenario mechanism (`js/looped-network.js`, closed Tasks 184/201)
  already lets a user override one node's demand, re-solve (sub-second per
  `dev/looped-network-calculator-scope.md`'s linear-solve table), and read pressure —
  which is the manual version of the bisection FireFlow automates. `ROADMAP Task 512`
  shows Tom doing exactly this in his own Elm Street file today ("two fire-flow
  junctions" as named scenario overrides). **This is why I did not promote it: the
  workflow exists and is fast, only the search-for-the-max-flow step is unautomated.**
- **CITED** Valve-isolation / segment-criticality analysis is a real, published utility
  technique (multiple 2023–2025 journal papers, WNTR's segment tool) but every source I
  found frames it at hundreds-to-thousands-of-pipes scale — it is a technique for finding
  the few valves that matter in a huge graph. **This suite's target scale is 10–20 nodes
  by deliberate decision** (`dev/looped-network-calculator-scope.md`), so at that size a
  criticality analysis has almost nothing to find — a human can see which valve isolates
  which pipe by looking at the map. Declining to build this is scope match, not a miss.
- **CORRECTION (orchestrator, 2026-08-24)** Task 468 is NOT closed — it is open at priority 25
  (`dev/ROADMAP.md:654`, "Demand categories on a junction"). The entry below lists it as closed and
  then as open in the same breath. The reasoning that reached "nothing glaring" does not depend on
  it, but a later invocation must not quote it as shipped.
- **OBSERVED** Checked before answering, so as not to invent a gap already closed: colour-
  by-value/thematic pressure map (Task 327, closed), demand categories (Task 468, closed),
  extended-period simulation including tank fill/drain under patterns (Task 248, closed
  except 248.03 rules), customer demand accounting (Task 247/468, open but designed) all
  already answer pieces of what a naive "system-scale gap" guess would have reached for
  (storage adequacy, multi-scenario demand, spatial pressure survey).
- **SPECULATION** If a later invocation wants a stronger candidate than fire-flow
  automation, the more interesting one is probably **storage tank adequacy under a design
  demand curve** (equalization + fire + emergency storage, Ten States Standards-style) —
  EPS + tank + pattern support all exist, so it may already be buildable as a *reporting*
  layer (read tank level range over a run, compare to a target) rather than new solver
  work. Not researched; re-derive before proposing.
- **OBSERVED** This journal's first-invocation guess (".inp interoperability and large-
  node-count behaviour is probably the strongest contribution from this seat") held up on
  a second look — nothing found this session displaced it, and the roadmap shows .inp
  import/export both already shipped and taken seriously (Task 281, 483 family).

## 2026-08-24 — seat defined

- **OBSERVED** This agent replaced a first draft aimed at a rural water system operator
  (`git log` — commit 95c52d37). That seat was invented and wrong: EngCalcs' people are
  consulting design engineers who serve utilities, not utility staff.
- **CITED** Tom Haws, 2026-08-24, defining this seat: a *"utility design and planning
  engineer (not so unlike Mary and me, but with much bigger fish to fry; Novato/Net3 (on
  the small side!) vs Elm Street Center and Dance Properties)"*. Scale is the perspective.
- **OBSERVED** Fire flow — the point of the one real client report in this project — exists
  in shipped code as a pressure threshold comment (`js/lpn-ramps.js:904`) and otherwise
  almost entirely as a scenario NAME in test fixtures. 3 hits across `lib/`, `js/`, `*.php`.
- **SPECULATION** The strongest contribution from this seat is probably about `.inp`
  interoperability and behaviour at large node counts, not about the calculators. Re-derive
  this before relying on it; it is my first-invocation guess, not a finding.
- **CITED** Tom Haws, same day, on why this seat is unverifiable from inside the project:
  *"Scale is my big and first blind spot. I only know Elm Street Center. I have never worked
  for the City of Novato. I have designed many Elm Street Center projects, but no Novatos."*
  Consequence: CITED matters more in this journal than in any other, because nobody here can
  catch a fluent invention by recognising it.

---

## 2026-08-25 — Task 465 research: reusable pipe/pump TYPES ("editing one edits 400")

Tom asked this seat to research Task 465 before it moves off Maybe. Findings below, then my
recommendation: **leave it parked.** The two mechanisms it would provide already exist here in a
form I judge safer than what the commercial precedent documents.

**1. Does a real utility's model work this way — and is it used, or does it sit idle?**
**CITED**, and the answer splits into two DIFFERENT features the task conflates:
- **"Prototype" (WaterCAD/WaterGEMS)** is a stamp-forward template only — it sets starting values
  for elements drawn AFTER the prototype is set; it is not retroactive
  (docs.bentley.com "Creating Prototypes"; corroborating YouTube "WaterCAD Hacks: Build Models
  Quickly Using Prototypes"). This is functionally what this suite already ships as "Apply
  starting values to all elements" (`js/looped-network.js:18189`, OBSERVED) — Base-only, one
  click, shows a carriers/changing count before writing.
- **"Engineering Library" (WaterGEMS)** is the retroactive one, and it is genuinely live-linked:
  "When you change the properties for an item in an engineering library, those changes affect all
  hydraulic models that use that library item" (docs.bentley.com, "Engineering Libraries", fetched
  2026-08-25). It covers **pipe MATERIAL** (roughness) and **pump curve DEFINITIONS** — not a full
  "pipe type" bundling diameter. A Bentley community thread titled "How can I global edit the pipe
  material and have the roughness update?" (communities.bentley.com/.../10853, title confirmed,
  body did not load — flag as thin/secondary) is real evidence a practitioner asked this exact
  question, which is evidence of DEMAND for the narrow material-roughness case specifically, not
  for a general type system.
- I found no documentation describing a confirmation step, a preview, or a change count before an
  Engineering Library edit propagates. That silence is not proof one doesn't exist, but it is
  notable next to what this suite already built for its own bulk write (see #3).

**2. What would a type actually carry — shared vs. per-element, checked against real material.**
- **Roughness/material: shared, but with a wrinkle the commercial docs surfaced that a naive type
  would get wrong.** C is a function of material AND AGE together — "as metal pipes corrode and
  tuberculate, the effective roughness rises and C falls... unlined cast iron can drop from about
  130 when new to 75 or lower after 40 years... for design use the lower, aged C-value" (search
  synthesis of multiple AWWA-derived roughness tables, cross-checked against
  hydraulic-calculator.com and calcengineer.com "Hazen-Williams Friction Loss: Pipe Sizing per AWWA
  M22" — CITED but secondary, no single primary AWWA table read directly). So "PVC" is not one
  roughness; "PVC installed 1995" is. A type keyed on material alone would need EITHER a type per
  installation era (defeating the "one definition, 400 pipes" pitch) or an install-year override
  living beside it anyway — which is most of the complexity of a type system with none of its
  payoff.
- **Diameter: NOT shared, confirmed by the commercial tools' own scope.** WaterGEMS' pipe material
  library documentation covers roughness coefficient and roughness height, not diameter
  (docs.bentley.com "Engineering Libraries", CITED above) — diameter is a per-link design choice
  from manufactured sizes, exactly as Tom's own framing in the roadmap entry implies.
- **Install year: per-element, confirmed by how utilities actually use it.** GIS/CIP material
  shows utilities track material and installation year as per-pipe asset attributes feeding
  risk-based replacement scoring, e.g. Boston Water and Sewer Commission's CIP, which bases
  replacement priority on GIS/hydraulic-model asset data including age and material per segment
  (bwsc.org CIP documents, CITED). This is exactly Tom's own example in the brief, now confirmed
  from outside.
- **Pump curve: the one place real, unambiguous reuse exists.** WaterGEMS lets a saved pump
  definition (a full curve, not just one property) be assigned to multiple pump elements via
  "Export to Library" (docs.bentley.com "Pump Definitions Dialog Box", CITED) — many pumps of the
  same model genuinely share one curve, with no aging wrinkle equivalent to roughness.
  **OBSERVED, and this is the strongest single finding of this pass:** this suite already has half
  of that mechanism. `js/looped-network.js:19466-19461` (`buildCurveSection`) is a Curves library
  VIEWER whose own comment says why it is read-only: *"a pump's points live on the pump
  (`curvePoints`) and `curveRef` names ANOTHER PUMP whose points it copies, so there is no shared
  definition for a library to hold... Turning this into an editor means giving the document a
  curve table first."* So `curveRef` (copy-once from another pump) already exists; a live-linked
  curve TABLE (edit the definition, every pump referencing it updates) is the one genuinely-missing
  piece, and it is a much smaller, better-precedented ask than a full pipe+pump type system.

**3. What breaks when a type changes.** This suite's own absolute rule — "only the user touches
their numbers" (`CLAUDE.md`, OBSERVED) — is in real tension with a live-linked type, because
editing a type is precisely a system rewriting many elements' stored values from one action, not
the user editing their own element. **OBSERVED**, this suite already solved the adjacent problem
correctly for its existing bulk tools, and better than what I found documented for the commercial
live-linked library: Find-and-Replace (`js/looped-network.js:7658`, "NOTHING IS WRITTEN UNTIL THE
COUNT HAS BEEN SEEN") previews an exact count of elements that would actually change before writing
anything, goes through `setProp()` so a scenario gets an override rather than a Base rewrite, and
is a single undo step. A type-library edit would need the same preview-before-write discipline,
and Task 465's own text already names the deeper cost: a third resolution layer (override →
element → type-default) under the one seam the solver, renderer, labels, popups and six pane
tables all read through (`effective()`), plus a visible detached-vs-inherited state per property —
that is real, not invented, and it is the correct reason this is `[H]`.

**4. Actual pain today, checked against Find-and-Replace rather than assumed.**
**OBSERVED**: Find-and-Replace already does "find every 6-inch pipe, make it 8" or "find every PVC
pipe, set roughness to 150" as a scoped query + preview count + one write
(`js/looped-network.js:7563-7660`). At this suite's stated target scale — **"~10-20 nodes... a
design decision, not a shortfall" with 200 as a headroom check, never a sizing target**
(`dev/looped-network-calculator-scope.md:32-36`, OBSERVED) — the commercial-tool motivating case
("editing one edits 400 pipes") cannot occur: there is no submittal or master-plan network this
suite is built to hold that has 400 pipes of one material in the first place. Find-and-Replace
already answers "I need every pipe currently at C=100 to become C=130" in one operation at this
scale; a type layer would add value only once the SAME reclassification recurs across many
projects over years, which is a maintained-utility-model use case, not a one-off design.

**5. Cost of NOT having it, and who feels it — the honest asymmetry.**
A utility maintaining one growing model for years (Boston-CIP-scale, thousands of segments,
periodic AWWA-standard updates, new construction added continuously) feels the cost of re-editing
material properties by hand repeatedly — real, and exactly the case the Bentley community thread
and the Engineering Library feature both target. **A consultant doing a one-off submittal study,
or this suite's own stated 10-20-node target user, essentially never does** — the network is drawn
once, checked once, and Find-and-Replace already covers the rare reclassification that does occur.
This is the same asymmetry `dev/looped-network-calculator-scope.md` already drew for the whole page
("EPANET owns the serious end and always will"), now confirmed specifically for this task rather
than assumed.

**Recommendation:** leave Task 465 parked at Maybe, and I would rank it LOW on my own list — real,
cited, well-precedented commercial demand, but for a scale this suite has explicitly and repeatedly
declined to be sized for, against an existing pair of tools (Settings push + Find-and-Replace) that
already cover both halves of what a type gives (stamp-forward defaults, scoped bulk rewrite) with a
write-safety discipline (preview-before-write, `setProp()` scenario overrides) I could not confirm
the commercial live-linked library even has. **The one piece I would NOT rank low is a live-linked
CURVE TABLE alone** — `curveRef` already exists as copy-once, external precedent for pump-curve
reuse is unambiguous (no aging wrinkle, no diameter conflation), and the Curves viewer's own code
comment already names exactly what is missing. That is a narrower, better-justified slice of Task
465 than the full pipe+pump type system, and I record it as a candidate SPLIT rather than a reason
to promote 465 whole.
