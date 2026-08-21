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
| `bpn-`, `ip-`, `wi-`, `mi-`, `cs-harness.js` | The five that had no math anchor at all, four of them row-table pages. Same rule: source method at the top of the file, mutations listed underneath. |

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

## Row tables

`calc-page.js` builds the dynamic rows now. It does not build them itself -- it calls the page's
own `pageCalculatorInitialize()` / `pageAddCalcRow()`, so the sample rows a first-time visitor
gets are what a harness sees:

```js
const page = loadCalculator('Branched-Network.php');
page.initRows();                                  // the page's own default rows
while (page.rowCount() > 2) { page.removeRow(); }  // or addRow() for more
page.setRow(1, { bpn_l: 500, bpn_diameter: 3 });   // by cell NAME, in display units
page.rowNum('hl', 1);                              // a row result, in display units
```

Two things about that are worth knowing before writing one:

- **A generated cell's identity is its `name`, never an id.** `addCalcRow()` gives every cell it
  builds a name and no id, and the calculators reach them through `document.getElementsByName()`.
  `cell(name, row)` and `setRow(row, {...})` address them the same way.
- **`Manning-Irregular.php` is the exception and cannot use `initRows()`.** Its initializer seeds
  its sample section *through the cookie* -- it writes a cookie string and reads it back with
  `cookieToForm()`, which walks a real `<form>` element in document order, and this scaffolding's
  form is a bag of named controls rather than a document. `mi-harness.js` calls `addRow()` and
  enters its own section instead; what that skips (are the shipped defaults right?) is covered by
  `node dev/browser-pass/mi-defaults.js`.

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

- **Every calculator now has a math anchor** except `rc`, which has a partial one (below). What
  each is anchored AGAINST is stated at the top of its own harness; the short version is
  Colebrook-White for `dw`, EPANET's 4.727 equation for `hw` and `bpn`, a numerical integration of
  its own defining integral for `odt` and for `wi`, the critical-flow result for `ws`, the Manning
  equation in both its customary forms for `mphl`, Horton-Einstein composite roughness for `mi`,
  Christiansen's published F(n) table for `ip`, and P = eta rho g Q H for `mhp`.
- **`rc` (Rock Chute) is the honest exception.** Its five Robinson, Rice & Kadavy (1998)
  coefficients are NOT verified — the paper is paywalled and the reachable copy is a page-image
  scan. `rc-harness.js` anchors everything around them (Manning, continuity, the geometry
  multiples, the exponents, and the join between the two published branches) and says so at the
  top. A worked example from the paper or an NRCS design aid is what would close it.
- **Two defects the new harnesses found are recorded but NOT asserted**, because pinning a wrong
  value as expected makes it permanent and asserting the right one leaves a red build. Both are
  written out with their numbers at the top of their harness, and both print a `--` line when it
  runs:
  - `mi` — the region Froude number `fr617` mixes a region area with the LAST SEGMENT's top width,
    so it is low by sqrt(T_region / T_last) on any region of more than one segment. A one-segment
    region is right.
  - `cs` — the two currency inputs are prices PER unit volume and PER unit area, so they convert by
    the reciprocal of their unit's factor; the page divides by the factor instead, making the money
    figures wrong by the factor squared (1,247x for $/ft3, 116x for $/ft2) under any non-SI preset.
- **The smoke harness still does not build rows.** It runs each row-table page on its bare form and
  prints a `--` line saying so; the per-page harnesses are what build the rows. `all-calcs-smoke-`
  `harness.js` is about every page running at all, and it is worth keeping cheap.
  **That gap is not academic** — ROADMAP Task 233 was two user-visible defects on Manning-Irregular
  (an English page opening in metric, a ⚠ Low velocity on arrival in both presets) sitting in it
  the whole time this harness reported the page green. For the shipped DEFAULTS of a row-table page,
  the browser route is still the one: `node dev/browser-pass/mi-defaults.js`, about 150 lines.
- **Nothing here is a browser.** Layout, tips, printing and the sketches are checked only to the
  extent that generating them must not throw.
