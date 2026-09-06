# `dev/lpn-spike` — the looped-network test suite

**This is the `lpn_` page's whole behavioural test suite: 174 files, of which 155 are harnesses.**
Run every one of them with:

```sh
sh dev/scripts/run_harnesses.sh          # also runs inside dev/scripts/check_all.sh
```

## The name is a fossil, and that is deliberate

Tom asked on 2026-09-06 whether this directory should be deprecated or canonized *"with a proper
name, context, and framing"*. **Canonized, and the name stays**, so the answer is recorded here
rather than re-argued.

It began as a genuine spike: one file, `validate.js`, proving that a hand-written global gradient
solver could reproduce EPANET's answers before anybody committed to building a page around it. The
spike succeeded, the page was built, and every test written since landed beside it. What the word
"spike" now describes is the directory's origin, not its status. Nothing here is throwaway;
`check_all.sh` will not pass without all 155 harnesses green.

**Renaming it was weighed and declined.** `lpn-spike` appears in roughly 270 places — `CLAUDE.md`,
two dozen `dev/*.md` records, `dev/scripts/`, and the header comment of nearly every harness, which
names its own path so a failing line can be found. Rewriting all of those buys a better word and
costs the git history of 174 files, plus every quoted path in the written record. A sentence is
cheaper than a migration, so this is the sentence. `dev/calc-spike` is its sibling and carries the
same fossil for the same reason.

## What is in here

| Kind | Files | What it is |
|---|---|---|
| `*-harness.js` | 155 | The suite. One file per behaviour, named for the behaviour. Each is a standalone `node` script: no framework, no `node_modules`, no network, exit non-zero on failure. |
| `validate.js`, `validate_epanet.js`, `validate_inp.js` | 3 | The original solver spike and its two descendants. Run by the same runner, which globs `*harness*.js` **and** `validate*.js`. |
| `lpn-dom-stub.js` | 1 | The DOM the harnesses run against, and the most important file here. See the warnings below. |
| `*-bench.js` | 5 | Performance measurements. **Not run by the runner** — a bench is a number to read, not a pass or a fail, and a timing assertion on somebody else's laptop is a flake generator. Run one by hand when a claim about speed is being made. |
| shared inputs | 10 | `*-fixture.js`, `cases.js`, `net3-*.js`, `bootstrap.js`, `pane-table-css.js`, `make_reference.js`. The last is the only file in this tree that needs `npm i epanet-js`. |
| `reference/` | — | EPA's own `Net1/2/3.inp`, plus the real EPANET engine's solution for each, committed so nothing has to be installed. |

## The three things to know before writing one

1. **A STUB THAT REMOVES THE COUPLING MAKES A HARNESS PASS FOR THE WRONG REASON.** When a harness
   is green and the browser still misbehaves, suspect `lpn-dom-stub.js` before the code: ask which
   quantity the real thing varies that the stub holds constant. Fix by teaching the stub that one
   physical relationship, never by adding assertions around it.
2. **A HARNESS THAT BUILDS ITS OWN MODEL CAN BE GREEN WHILE THE FEATURE DOES NOT WORK.** Drive the
   real importer over the real files where you can. `reference/` exists so that you can.
3. **Say WHY the file exists at the top of it.** Every harness here opens with the defect it was
   written for, quoted and dated. That header is what tells the next reader whether a failing
   assertion is a regression or a rule that has since changed, and it is the reason this suite can
   still be edited a year later.

`dev/testing-notes.md` has the full set of lessons. `dev/calc-spike/README.md` is the recipe for the
other suite, the one covering the form-and-answer calculators.

## The original spike, kept because its reasoning is still load-bearing

`validate.js` proves `js/lpn-solver.js` (ROADMAP Task 146) in five sections: residuals, closed form,
EPANET, suite consistency, scale.

**Why a WASM EPANET rather than published result tables.** `epanet-js` is EPANET's own C engine
compiled to WebAssembly, so the reference is the actual program rather than numbers transcribed from
a manual: no typos, and every link and node is covered instead of the handful a printed table shows.

Two deliberate choices in `make_reference.js`:

- **EPANET's `ACCURACY` is tightened to 1e-8.** At its 1e-3 default the reference carries a residual
  of its own: a near-dead-end pipe in Net2 was reported with a flow wrong by more than the flow
  itself, which looked like a 0.404 gpm disagreement and was entirely EPANET stopping early.
  Converged, the same link agrees to 0.00000 gpm.
- **Link status at t=0 is recorded.** Status is boundary data for that instant's hydraulic problem,
  exactly like demands and tank heads. Net3 has a pump closed by `[STATUS]` and links switched by
  controls.

For the same reason the harness takes junction demands and fixed heads from the reference rather
than parsing `[PATTERNS]` and tank levels: those are inputs to the t=0 problem, and what is under
test is the hydraulics, not an `.inp` reader.

What each section proves:

1. **Residuals** — continuity and the constitutive head-loss equation, both to ~1e-15. For a network
   with at least one fixed head and monotone head-loss functions the steady-state solution is
   unique, so satisfying the equations *is* being right. This tests the solve.
2. **Closed form** — a parallel-pipe split derived by hand, an emitter solved by independent
   bisection. This tests that the equations being satisfied are the intended ones.
3. **EPANET** — topology, pumps, and scale. Reported alongside EPANET's *own* continuity residual so
   a disagreement can be attributed rather than assumed. Since Task 213 this runs on the *shipped*
   Hazen-Williams constants (they are EPANET's), so it no longer has to isolate constant choice from
   solver error.
4. **Suite consistency** — the head-loss kernel against `branched-network.js`, so `lpn_` cannot
   disagree with the calculator next to it in the menu.
5. **Scale** — 21 nodes (the design target) and 201 nodes (headroom, not a target).
