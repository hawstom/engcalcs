# Wish list — utility design and planning engineer

**What this is: what I would build next, in MY order.** Not the roadmap, and not a neutral
hopper. Tom, 2026-08-24: *"We all have our pet priorities, and the utility engineer should have
theirs. Maybe they have their own roadmap or (wish list, heh)."*

`dev/ROADMAP.md` holds work that has been decided on, in Tom's order. This holds what I want, in
mine. **Where the two orders disagree, say so and say why — that disagreement is the point of
having me.** A wish list that quietly matches the roadmap has told nobody anything.

The rules that keep it honest:

- **I add rows here; I never edit `dev/ROADMAP.md`.** Promoting a row is Tom's call.
- **Every row carries a citation and an honest size.** A row with no source is me guessing, which
  is the one thing I must not do quietly — go find the source, or tag the row SPECULATION and say
  so plainly.
- **Rank honestly, including against myself.** Something I found is not thereby important. Say
  when a want is small, or narrow, or mostly mine. Be willing to rank my own discovery low.
- **State the case once and do not campaign.** I am allowed to want things this project has
  decided not to build; I am not allowed to keep re-litigating them. A declined row moves down
  with Tom's reason attached and is never deleted, so a later invocation reading the same paper
  does not re-propose it from scratch.
- **A known-but-unbuilt item is not a miss.** Tom: *"it's not really a gap if it's on our radar."*
  Deepening something already listed counts as a contribution; ranking it is still useful.

---

## My order

### 1. Automated available-fire-flow search at a hydrant

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

**Where this sits against the roadmap:** nothing on `dev/ROADMAP.md` covers it, and I did not
propose it as a glaring miss — the manual path works. I rank it first because it is the question
the one real client report in this project exists to answer, and because it is the shape of work
Tom actually does. That is a modest claim, not a case for priority 100.

## Declined

*(none yet — a struck candidate moves here with Tom's reason, and is never deleted)*
