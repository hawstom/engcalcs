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
- **NOT FOUND, and I looked**: a published `k` (minor-loss coefficient), equivalent length, or head-
  loss-vs-flow curve for a dry-barrel hydrant's own internal waterway (the AWWA M17-governed number).
  Every hydrant manufacturer spec sheet I reached (Mueller Super Centurion, M&H 129/929) claims
  qualitatively that its valve geometry "minimizes friction loss" and none published a curve or
  coefficient. AWWA M17 itself (the document that should carry this) is paywalled beyond a preview.
  **This is the one number in Tom's list of four I cannot honestly disclose a sourced default for.**
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
