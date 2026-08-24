# Prioritization hopper — utility design and planning engineer

**What this is:** candidate features this agent turns up while reading the literature, parked
where Tom can weigh them. Tom, 2026-08-24, on the first one: *"I don't even know what this is...
There are bound to be dozens of cool features like this that I never thought of, and we need to
know what to build next."*

**This is NOT the roadmap.** `dev/ROADMAP.md` holds work that has been decided on; this holds
candidates that have not. The agent adds rows here and never edits the roadmap. Tom promotes a
row to a real task, or strikes it. A struck row stays, with the reason — so it is not re-proposed
from scratch by a later invocation that reads the same paper.

**Every row needs a citation and an honest size.** A candidate with no source is this agent
guessing, which is the one thing it must not do quietly. Say what it would take to build, and say
when you do not know.

---

## Open candidates

### Automated available-fire-flow search at a hydrant

- **What:** the answer to *how much can this hydrant deliver while a critical node holds ≥20 psi?*
  Flow and pressure trade against each other, so it is found by search: guess a hydrant demand,
  solve, check the residual, bisect. Today a user does this by hand — make a scenario, override
  the junction's demand, read the pressure, repeat.
- **CITED** AWWA M31 defines required fire flow as the rate at 20 psi residual for a stated
  duration. EPANET has **no** built-in tool for it; it is done by commercial add-ons (WaterCAD,
  H2Onet) or a free standalone bisection wrapper over an `.inp` file (Optiwater `FireFlow`).
  So this is not a gap against EPANET.
- **OBSERVED** The manual path already works and is fast — `lpn_` scenarios plus a sub-second
  solve. Task 512 records Tom doing exactly this in his own Elm Street file, two fire-flow
  junctions carried as scenario overrides.
- **Size:** unknown, believed small — a loop around the existing solve, plus a way to name the
  hydrant node and the critical node. Not designed. Re-derive before quoting this estimate.
- **Why it is not urgent:** only the search step is unautomated, and this agent explicitly
  declined to call it a glaring miss.

## Declined

*(none yet — a struck candidate moves here with Tom's reason, and is never deleted)*
