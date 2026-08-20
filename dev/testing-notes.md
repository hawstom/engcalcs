# What actually catches defects here

Extracted from `CLAUDE.md` on 2026-08-16. Read this before writing a harness, or when a harness
passes and the browser still misbehaves.

Copyright 2009 Thomas Gail Haws. GNU GPL v3 or later.

**Minimize Tom's browser passes.** They are slow and fatiguing. Write a harness in `dev/lpn-spike/`
or `dev/calc-spike/` and reserve his time for what genuinely needs a real browser.

- **A TEST THAT CAN REPORT ON THE WRONG TREE IS WORSE THAN NO TEST**, because it is green and
  trusted. `dev/browser-pass/lib/env.js` bound a constant port and derived its docroot as `REPO/..`,
  so from a worktree it silently served *another checkout* — and the specs went stale for a whole
  task cycle with nobody able to see it. The fix that generalizes: **prove the server is yours before
  asserting anything.** A readiness probe that only checks "did the page load" proves something is
  listening, not that it is you; fetch back a random per-run sentinel instead. Ask an OS-assigned
  port, and derive the repo root from `git rev-parse --show-toplevel` — a `../` hop is wrong in a
  worktree by construction.
- **AN MTIME-KEYED FRESHNESS CHECK IS UNRELIABLE IN A WORKTREE**, and it will fail spuriously for
  every isolated agent. `git worktree add` writes every file at checkout time in arbitrary order, so
  `generate_translation_payloads.php --check` reported all 26 payloads stale over a **36 ms** spread
  with `git diff` empty. Same root cause as `filemtime` on production after a `git pull`. Diagnose it
  by diffing content before regenerating anything, and never "fix" it by regenerating in a worktree —
  that commits a no-op churn under a misleading message.
- **A STUB THAT REMOVES THE COUPLING MAKES A HARNESS PASS FOR THE WRONG REASON.**
  `dev/lpn-spike/lpn-dom-stub.js` returns a constant 10 from `getBBox()`, so a zoom-to-fit harness
  could not see that label widths shrink as you zoom — the entire physics of the bug it was written
  for — and a one-pass fit looked perfectly convergent. Same class: a harness `setZoom()` that set
  `state.s` without re-laying-out (a state no browser can be in), and one that set only the canvas
  WIDTH, leaving height undefined, which reads as zero and is smaller than every threshold, so
  nothing ever hid and every check passed. **When a harness passes and the browser still misbehaves,
  suspect the stub before the code:** ask which quantity the real thing varies that the stub holds
  constant. Fix by teaching the stub the one physical relationship under test, not by adding
  assertions.
- **IDEMPOTENCE IS THE CHEAPEST STRONG ASSERTION** for anything that sets a view or a layout. Tom's
  test for zoom-to-fit was *"open, reload, or switch and then zoom extents. Ideally nothing
  happens"* — and it found a defect that start-independence testing had missed. Applying an operation
  twice must equal applying it once, to the last bit. Needs no reference data and no hand arithmetic.
- **AN ITERATION WHOSE FIXED POINT MOVES WITH THE INITIAL GUESS IS NOT CONVERGED.** `n_strickler` was
  computed once before a loop while its three siblings were recomputed every pass, so a rock size
  converged against a frozen roughness and the answer depended on which number you typed first
  (0.542 in from 4 in, 0.298 in from 24 in, same channel). Tom: *"I assumed that people would play
  with numbers until they settle down. If you can make it better, please do."* That assumption is
  reasonable for a hand-driven tool and is exactly what a harness exists to retire — it works for the
  person who knows to do it and silently hands everyone else a defensible-looking wrong number.
  Asserting it costs nothing: run the same solve from several starting points.
- **A COUPLED ITERATION'S FAILURE MODE IS A PLAUSIBLE NUMBER.** What catches it is asking whether the
  output is consistent with the input the page is showing. Worth asking of every iterative
  calculator. Two such defects in Manning Trap Channel — velocity computed from the *previous*
  iteration's n, and a safety factor applied to a user-typed d50 — lived in one loop-exit condition,
  and **three of every four radio combinations were correct**, which is why years of hand-checking
  never caught either.
- **A HEADLESS HARNESS SEES ONE CALL; A USER SEES A SEQUENCE.** A trigger heals a stale OUTPUT; it
  cannot heal a wrong INPUT. Assertions on a single `pageCalculator` call once reported a defect the
  main form immediately healed on the next recalculation — a transient a browser passes through, not
  a state a user reads. The same defect was real and persistent in `solveForY`, which calls the
  iteration once per trial depth and gets no second pass. **When a harness finding cannot be
  reproduced by hand, the harness is on trial**, and prefer invariants that survive the difference:
  *solve for a Q and the page must then show that Q* is unambiguous in a way that *"is v consistent
  with n right now"* was not.

### How a calculator is testable at all

Every `pageCalculator` is already a pure function of its form — it reads `objForm[name].value`, writes
`getElementById(name).innerHTML`, and touches nothing else. The obstacle was that the form lives in
rendered PHP. `dev/scripts/dump_calc_form.php` renders the real page and hands the harness the form it
actually shipped. **Nothing about the form is restated in a harness** — restating it builds a second
copy that drifts and tests itself while the page ships something else. There is no fixture on disk and
therefore none to go stale.

- **A page must be rendered at GLOBAL scope, ONE PAGE PER PROCESS.** `dev/scripts/render_page.php` is
  the only place that knows this. `include`ing a page from inside a *function* runs its top-level code
  in that function's scope, so `$ec_lang` lands as a local while every library function looking for it
  as a global finds nothing. The page still renders and still looks like a page; it is simply missing
  its menus and 16 of its 17 unit selects. `html_balance_check.php` did this from the day it was
  written, so every "ok" it printed was about a 22 KB stub of a 45 KB page. And `lib/base.inc.php` is
  `require_once`d, so a second page in the same process renders as a fragment.
- **A page's SI defaults are reachable only through the LANGUAGE.** `EC_DEFAULT_UNIT_SET` derives from
  it (`en` → `us`, everything else → `si`), and clicking SI afterwards *reinterprets* the typed
  numbers rather than converting them — so `units('si')` turns an 18 in pipe into an 18 mm one, which
  is correct behaviour and useless as a defaults test. Use `loadCalculator(page, { lang: 'es' })`.

### Making an untestable file testable

`looped-network.js` was 8,700 lines with ~30 shared mutable closure variables, so nothing in it could
be reached without a browser, and harnesses coped by reading it as TEXT and brace-matching a function
out of it — which tests a *copy* in a context the browser never has.

- **Split by PURITY, not by subject.** `js/lpn-geom.js` and `js/lpn-collide.js` take values and return
  values — no DOM, no closure variables. A module that still reached back into the editor's closure
  would be just as untestable, one file further away.
- **What is left behind is the GATHERING** — turning `doc`, the element handles and the current font
  size into plain arguments. That part still needs a browser, and that is fine.
- **Prove the lift is behaviour-preserving before trusting the new tests.** Fuzz each new function
  against the pre-refactor body from `git show HEAD:` over a few thousand random inputs. That is the
  only thing distinguishing a refactor from a rewrite.
- **A new module must be added in THREE places** or the harnesses break confusingly: the `<script>`
  tags in `Looped-Network.php`, `dev/lpn-spike/lpn-dom-stub.js`, and any harness that evals
  `looped-network.js`. Use **indirect** eval — `(0, eval)(src)` — in those harnesses; a direct eval
  hoists its own `var EngCalcs` and starts a second, empty one.

---

## A TIMING assertion in a blocking harness is a flake waiting for a busy machine

Found 2026-08-20, during a night with three subagents running builds and browser passes at once.
`check_all.sh` reported **BLOCKING FAILURES: lpn harnesses**, and the single failing line was
`collide-harness.js`'s scaling check:

    FAIL  the cost per label barely grows from 220 labels to 1000 -- the pass is linear
          2.02x the per-label cost at 4.5x the size

Run alone, the same commit gives **0.60x**. Nothing was wrong with the code; the machine was
oversubscribed and the harness was measuring the load rather than the algorithm.

**Two rules follow.**

1. **MEASURE THE TWO SIDES OF A RATIO ALTERNATELY, and it is the fix that was actually applied.**
   The harness already took a minimum over five batches, which defends against a brief spike — and
   did not save it, because load that arrives between the two measurements and STAYS makes every
   batch of the second size honestly slow. Interleaving puts both sizes under the same conditions
   whatever those conditions are. Same trick `dev/browser-pass/specs/perf.js` uses, for the same
   reason. Re-measured after the change on the same loaded machine: **1.16x**, against 2.02x
   before and a 2.0 bound. Widening the bound would have hidden the next real regression; this
   does not.
2. **Before believing a perf failure, re-run the ONE harness alone.** It costs seconds and it is the
   difference between a real regression and a busy afternoon. The same applies to
   `dev/browser-pass/specs/perf.js`, whose own comments already say its numbers swing by a factor of
   two with what else is running, and which is why that spec alternates its before/after builds.

**And check for a stuck process while you are there.** The same investigation turned up a
`closed-link-harness.js` that had been spinning at 99% CPU for **fifty hours**, left behind by an
earlier session — one whole core gone, silently, making every measurement on that machine worse.
`ps -eo pid,etimes,pcpu,args --sort=-etimes | grep lpn-spike` finds one in a second.
