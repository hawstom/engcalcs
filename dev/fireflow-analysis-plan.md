# Fire flow: what is settled, and what the whole-system analysis has to be

**This file lives on the `fire-flow` branch, which is where the fire-flow engine, the box, its 55
language keys, two harnesses and a browser spec live.** Master carries none of that — commit
`4ae6cf89` removed it — on Tom's call, 2026-08-26: *"Isn't this a much bigger task than we've
contemplated?... we need more research and planning before putting this on master."*

**This is that research and that planning.** It is recorded here rather than only in
`dev/ROADMAP.md` so that whoever resumes the branch finds it beside the code it governs. The
roadmap's Task 530 carries the same conclusions in shorter form; if the two ever disagree, the
transcript and `dev/agents/utility-planning-engineer/journal.md` are the record, not either summary.

**Nothing in `dev/fireflow-loss-table.md` needs redoing** — the AWWA C502 k values, the ISO
1,500 gpm cap and the lateral standards all stand.

---

## 1. The emitter question: settled, from the primary source

Tom doubted that an EPANET emitter can represent a hydrant at all, on the grounds that **an emitter
is pressure-driven and a fire flow demand is not.** Read directly in the EPANET 2.2 manual
(`usepa.github.io/EPANET2.2/3_network_model.html`) and the OWA toolkit reference: **he is right on
the physics.** An emitter computes `q = C·p^γ`, and its flow is *additive* to the junction's
ordinary demand — the manual's own words are that Actual Demand "includes both the normal demand...
plus flow through the emitter". It is not a fixed demand.

**But the manual documents a deliberate fire-flow trick anyway**, and it is real: set an enormous
discharge coefficient and raise the junction's elevation by the target residual head, and one solve
returns the flow that drives the node to exactly 20 psi. It is EPANET-sanctioned, and it is argued
against by credentialed practitioners who prefer modelling the assembly. So it is a genuine
contested choice, not a myth to dismiss.

### The honest menu is three, and the default is not ours

| Method | What it is | Cost |
|---|---|---|
| **Raw-node bisection** | Search the demand at the bare junction. **WaterCAD's default, so the market's.** | ~16 solves/node (ours, measured) |
| **Modelled-assembly bisection** | Same search, with our hydrant/lateral losses beyond the node. What this branch built. | ~16 solves/node |
| **Emitter trick** | One solve per node, per the manual. | 1 solve/node |

**Offer, never impose.** Tom, before any of this was researched: *"I want to be very explicit and
transparent, maybe even selectable, about how we account if at all for hydrant losses beyond the
node."* If the profession's default is raw-node, then **our** modelled assembly is the unusual
choice and has to be the one the user opts into.

---

## 2. Tom's decisions, 2026-08-26

- **Proceed with bisection.** *"(1) We can proceed with bisection."* The emitter trick stays
  recorded as an option and is **not being built**.
- **Raw nodes first.** *"(2) Should we initially do raw nodes since we will be doing something
  blanket for full-system analysis, and it's not obvious that a blanket hydrant model is better
  than raw nodes."*

**The evidence supports him, and the blanket argument is the strong one.** Both tools that could be
inspected do raw nodes: WaterCAD by default, and OptiWater's `FireFlow` steps demand at the node
itself. A blanket assembly model imposes one *guessed* hydrant on every junction in the system
uniformly — get it wrong and it is wrong everywhere at once, and it is not what a reviewer expects
to see. The modelled assembly stays available and offered.

---

## 3. The whole-system sweep

**The question, in Tom's words:** *"Which nodes in my system can provide fire flow (available vs
required) or alternatively (separate Design question and analysis) provide it without causing other
nodes to fail or links to have excessive velocity?"* — and highlight every junction as **Passing,
Failing, or causing a Design issue**. He expects *"a big analysis that could take minutes to run for
a big system."*

### Cost, measured — and it does not extrapolate

**~112 s for 225 junctions**: 16 solves per hydrant at 498 ms, from `dev/fireflow-loss-table.md`.
That lands on Tom's own "minutes for a big system".

**It must not be extrapolated.** Growth from 49 to 225 junctions was *worse than linear*, so a
1,000–2,000 node figure has to be measured before anyone quotes one.

> **THE 16 IS OURS, NOT BENTLEY'S.** WaterCAD's Fire Flow Analysis page describes the search's
> *shape* ("iteratively assign lesser demands...") and publishes **no solve count**. The 16 is this
> branch's own measured bisection cost, carried across by analogy because the algorithm shape
> matches. Do not cite it as a WaterCAD figure. It had begun circulating in this project's record as
> though it were one.

### The economics hypothesis was tested and FAILED

Tom proposed that the emitter trick is what makes the market's one-button sweeps affordable at all,
and asked for that line of thinking to be pushed. It was, and it does not hold:

- **No case of a whole-system sweep built on emitters was found, primary or secondary.**
- The one purpose-built, one-button, every-junction EPANET tool readable in full — **OptiWater's
  `FireFlow`** (Salomons, 2004, freeware; manual read directly) — steps demand up by a fixed
  user-set interval at each node until a violation or a ceiling. That is **more** solves per node
  than bisection, not fewer.
- **WNTR**'s own `fire_flow.py` example is a single fixed demand at one node under pressure-driven
  demand — not a sweep, and not an emitter.
- The one place emitters were found applied across many nodes at once (Copernicus DWES, 2019) is
  screening baseline pressure deficiency under *normal* demand — a different question — and it still
  iterates five times.

**The narrower claim survives and is worth keeping:** 1 solve per node beats ~16, and the shape is
O(N) either way. It is the leap to *"that is why sweeps are feasible at all"* that fails.

### Do NOT reach for EPANET 2.2's Pressure-Driven Analysis as a shortcut

It is real, and it is vendored in this project. But nobody in the industry uses it for this job, and
its pressure targets are set **once, globally, not per node**. (Corroborated from two independent
secondary sources; unlike the emitter section above, this was *not* read from the primary manual.
Flag that distinction if a later pass leans on PDA specifics.)

### The accuracy question is OPEN

**No published quantitative comparison of the emitter method against bisection was found.** That is
the decisive engineering question and it is unanswered. One named hazard, reasoned from the
equations rather than measured: **the emitter's discharge coefficient is a guessed, invisible
ceiling.** A bisection sweep can report "I hit my ceiling"; a naive emitter run has no equivalent
tell. A further trap worth naming: running every node's emitter *simultaneously in one solve* would
be genuinely O(1), but it answers a different physical question than testing hydrants one at a time.

---

## 4. Two analyses, or one run?

Tom separates them himself: *available vs required* is a compliance question about one node; *does
drawing it break something else* is a design question about the whole network.

**The market does both from the SAME per-node solve.** WaterCAD reports the residual at the tested
node *and* the violations it caused elsewhere, as one table and one colour map. So the second
analysis may be free once the first has run, and **the cost argument for separating them is weaker
than it looked.** Whether we still *present* them as two is Tom's call and is open.

**And the side-effect half needs neither bisection nor an emitter.** A single ordinary fixed-demand
solve per node, at the code-required flow, answers "does drawing this break something else"
directly — simpler than either alternative. Only the *available vs required* half needs a search at
all. *(This is the planning engineer's own inference, tagged SPECULATION in its journal. Re-derive it
before building on it.)*

---

## 5. The time question: Tom was right

*"for an extended (time) simulation, don't we need to let/make the user choose the peak hour or
desired time step for the analysis?"*

US practice loads fire flow onto **maximum-day demand** and evaluates it as a **single steady-state
condition**. EPS at the max-day peak hour is a named, explicitly conservative alternative that some
practitioners run. **Nobody targets "the EPS as a whole"** — so if fire flow is ever run against an
extended-period simulation, the user picks the frame. It changes the interface before it changes the
engine, exactly as he said.

---

## 6. A correction to carry forward

**The claim that the 20 psi residual rule is "partly a fat factor covering the unmodelled hydrant"
does not hold up.** It came from a Gemini answer Tom was shown. The sourced rationale for the 20 psi
floor is a **backflow / negative-pressure safety margin**. NFPA's primary text was not reached, so
this is *unsupported*, not *disproved* — but it should not be quoted as a reason again.

---

## 7. What is still not decided

- Whether the two analyses are presented as one run or two (§4).
- The accuracy gap between emitter and bisection, if the emitter is ever revived (§3).
- Sweep cost at 1,000–2,000 junctions — **must be measured, never extrapolated** (§3).
- The interface for choosing the analysis condition (§5).
- Whether a full every-junction sweep is the right product or a selected set is. Utilities were not
  observed doing one or the other decisively.
