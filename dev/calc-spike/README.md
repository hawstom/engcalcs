# dev/calc-spike — behavioural tests for the non-lpn calculators

ROADMAP Task 292. Run them all with:

```sh
sh dev/scripts/run_calc_harnesses.sh      # also runs inside dev/scripts/check_all.sh
```

## What was missing, and what these do about it

`check_all.sh` used to verify that every calculator page *parsed*, *balanced its tags*, *resolved
its language keys* and *supplied its pageConfig* — and said nothing whatever about the number in
the Q cell. Meanwhile `dev/lpn-spike/` had fifteen harnesses and ~1,500 assertions, because Tom
said his manual browser passes were slow and fatiguing and the harness was built to spend machine
time instead of his. That reasoning always applied to the other nineteen calculators; it had just
never been extended to them.

Three files now do:

| File | What it covers |
|---|---|
| `calc-page.js` | The scaffolding. Renders a real page, builds a headless form from it, loads the page's own scripts, runs `EngCalcs.pageCalculator`. Not a test itself. |
| `all-calcs-smoke-harness.js` | **Every** calculator, on its factory defaults, in both unit presets: it runs, it writes no NaN/Infinity/undefined, and it opens on a passing design. |
| `mpf-harness.js`, `mtc-harness.js` | The two **core** calculators' actual math, against published anchors and hand-computed worked examples. |
| `dw-`, `hw-`, `or-`, `ws-`, `mphl-`, `mhp-`, `rc-harness.js` | Seven more calculators' math, each against the source method its own page names. Every one of them lists at the top of the file the mutations that were made to prove it bites. |

## The design decision that matters: nothing about the form is restated here

The obvious shortcut is to write the field names, the page defaults and the unit factors into the
harness. That builds a second copy of the calculator's form, and it drifts — change
`'default' => '18'` in the `.php` and the harness tests 18 forever while the page ships something
else, agreeing with itself the whole time.

So the form is **read out of the rendered page on every run**, via
`dev/scripts/dump_calc_form.php`. There is no fixture on disk and therefore none to go stale. It
also buys coverage a hand-written form could not have: that each unit select carries the right
`data-family`, that both presets resolve against the options actually offered, and that every id a
calculator writes to still exists on the page (`calc-page.js` throws by name rather than inventing
the element).

## Adding a worked example for another calculator

Cheap — usually under an hour, and the pattern is in `mpf-harness.js`:

1. `const page = loadCalculator('Your-Page.php');`
2. Set inputs in **display** units (`page.set({...})`), `page.run()`, read with `page.num(name)`
   or `page.si(name)`.
3. Anchor against something outside this repo. In rough order of strength:
   **dimensionless identities** from the method's own literature (they cannot be laundered by a
   wrong unit factor) → **proportionalities** the equation must obey (doubling S multiplies V by
   √2) → **one absolute worked example** with the arithmetic written out in the comments.
4. If the calculator iterates, also assert the converged answer satisfies its **defining
   equation** — that tests convergence, which the formulas alone cannot.
5. Prove the harness bites: break a constant in the calculator's JS on purpose and confirm the
   harness goes red. All five mutations tried when these were written were caught (wrong Manning
   exponent, perturbed geometry, wrong wetted perimeter, wrong Strickler constant, iteration cut
   to one pass).

## Known gaps, stated rather than hidden

- **Nine calculators now have a math anchor** — `mpf`, `mtc`, `dw`, `hw`, `or`, `odt`, `ws`,
  `mphl`, `mhp` — and `rc` has a partial one. What each is anchored AGAINST is stated at the top
  of its own harness; the short version is Colebrook-White for `dw`, EPANET's 4.727 equation for
  `hw`, a numerical integration of its own defining integral for `odt`, the critical-flow result
  for `ws`, the Manning equation in both its customary forms for `mphl`, and P = eta rho g Q H
  for `mhp`.
- **`rc` (Rock Chute) is the honest exception.** Its five Robinson, Rice & Kadavy (1998)
  coefficients are NOT verified — the paper is paywalled and the reachable copy is a page-image
  scan. `rc-harness.js` anchors everything around them (Manning, continuity, the geometry
  multiples, the exponents, and the join between the two published branches) and says so at the
  top. A worked example from the paper or an NRCS design aid is what would close it.
- **Still no math anchor at all:** `mi`, `wi`, `ip`, `bpn`, `cs` — the four row-table
  calculators (see below) plus Canal Seepage.
- **Row-table calculators** (Branched-Network, Irrigation-Pressure, Manning-Irregular,
  Weir-Flow-Irregular) are run, but the results that live inside their dynamic rows are not:
  building the rows needs a richer DOM than `calc-page.js` has. The smoke harness prints them as
  it goes rather than passing them silently.
  **That gap is not academic** — ROADMAP Task 233 was two user-visible defects on Manning-Irregular
  (an English page opening in metric, a ⚠ Low velocity on arrival in both presets) sitting in it
  the whole time this harness reported the page green. Where a row-table page needs a real
  assertion, the cheap route is a browser: `node dev/browser-pass/mi-defaults.js` is the worked
  example, and it is ~150 lines.
- **Nothing here is a browser.** Layout, tips, printing and the sketches are checked only to the
  extent that generating them must not throw.
