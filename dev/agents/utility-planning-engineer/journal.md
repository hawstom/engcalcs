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
