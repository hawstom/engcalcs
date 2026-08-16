# The unit paradigm migration — what is deprecated, what replaced it, what is left

Copyright 2009 Thomas Gail Haws. GNU GPL v3 or later.

Tom, 2026-08-16, after three separate defects turned out to be the same thing:

> *"Our paradigm was originally different. And it was not cleanly converted. You are fighting
> against a deprecated but not purged paradigm where everything was stored in browser and file as SI
> always, and only displayed for the user in other units. I don't think I authorized that. But it
> was done."*

That is the correct diagnosis, and it is why each fix kept revealing another. This document is the
map. **ROADMAP Task 390 is the work; this is the reasoning behind it.**

## The two paradigms

| | Deprecated (SI-always) | Current |
|---|---|---|
| What a unit **is** | a NUMBER — its conversion factor | a NAME, with the factor a lookup from it |
| What is stored | SI, always | what the user gave, in the unit they gave it |
| When we convert | on the way in and on the way out | **only at the solver handoff**, and on results coming back |
| A file's numbers | ours to normalise | **the user's. Canonical. Never rewritten** |

The current paradigm is stated as an invariant in `CLAUDE.md` ("ONLY THE USER TOUCHES A FILE'S
NUMBERS") and, for unit switching, was ordered by Tom in Task 263: *"a bad design decision was made
without my knowledge to convert inputs when units are switched. Scrub and ban this."*

## Why the old paradigm cannot be repaired, only replaced

It fails for a reason no amount of care fixes: **a double round trip is not lossless.** Even with
exact factors, `150 * 0.3048 * (1/0.3048)` is `149.99999999999997`, and **36.7% of a random 20,000
sample (7337) fails to return bit-identical**. That is *worse* than the 26% measured before the
factors were corrected on 2026-08-16 — precision of the constant is not the variable that matters.

And even where the value survives, the **representation** does not. Across EPA's own Net1/Net2/Net3
reference networks, **243 of 2,608 numeric tokens (9.3%)** have text that a `parseFloat` round trip
alters: `220.0` → `220`, `20.00` → `20`, `4530.` → `4530`. `parseFloat("710.0")` can only ever come
back as `710`.

## Migration state, measured 2026-08-16

**Done:**
- **The `lpn_` document** (Task 263). `serializeProject()` stores `doc.nodes/links/labels` in the
  user's own units plus a `units:` block naming them. A pre-v3 file that holds SI gets a one-time
  offered conversion that asks first and defaults to No.
- **`.inp` import value fidelity.** `js/lpn-inp.js` returns every number in the file's own unit and
  exports `parsed.scale`; `docFromInp()` stores them straight. Proven by
  `dev/lpn-spike/inp-passthrough-harness.js` — 410 of 1908 checks failed before the fix, all 1908
  pass after.
- **The conversion factors themselves.** Exact, internally coherent, guarded by
  `dev/scripts/unit_factor_check.php`. This was necessary but is not what fixes the paradigm.
- **A unit's IDENTITY is its NAME (step 1), and the cookie follows (step 2).** `echoUnitSelect()`
  emits `<option value="ft">`; the factor is a lookup through `EngCalcs.unitFactors`, which
  `echoHTMLHead()` emits straight out of `lib/Units.lib.php` — one table, shared by PHP and JS,
  never a second set of constants in a `.js` file. `data-unit` is gone, being the same string as
  the value. The cookie and a shared URL now store `ft`.
  - A cookie or link written before this holds the factor, so `EngCalcs.applySelectValue()` matches
    an old number back to its unit within 1e-3 relative — wide enough to catch the pre-2026-08-16
    feet (`3.2808`) that the re-derivation had already orphaned. It converts nothing; it reads a
    number the visitor never typed and returns a NAME.
  - **Guarded by `unit_factor_check.php` §5**, which fails the build on `data-unit`, on
    `dataset.unit`, on `objForm['xu'].value`, and on an `<option>` whose value is a `$ec_units`
    lookup. The prose rule was already written and was violated in 22 places anyway.

**Not done, in dependency order. Each item is blocked by the one above it:**

3. **The TOKEN is still discarded at `js/lpn-inp.js:89` (`parseFloat(tok)`).** Value fidelity is
   solved; representation is not. Keep the exact characters beside the parsed number at the one
   place text becomes number, and store the token.
4. **An unrecognized unit has nowhere to live.** Step 1 unblocked this but did not do it: a name
   can now be carried verbatim, and only the SOLVE need be refused — but nothing yet carries one.
   `EngCalcs.unitFactor()` answers 1 for a name it has no factor for, which is right for a page
   rendering and wrong for a page solving, so the refusal is the work left.
   - The five EPANET flow keywords with no selector (IMGD, AFD, LPM, CMH, CMD) are the concrete
     case. `.inp` `UNITS` is a **closed enumeration of ten**, so adding them completes a finite list
     rather than working around it — but adding them *without* (4) would be papering over, which is
     the objection Tom raised and it is correct.
5. **Derived values are persisted beside user values.** A pump's `l.h0/a/b` are an SI curve fit
   stored in the document next to the `curvePoints` the user typed, which is why
   `refreshPumpCurvesForUnits()` must re-run the fit whenever a unit changes. A repair mechanism for
   a value that should never have been stored. Derive at solve time.

## The rule that makes it structural

> **A number the user supplied and a number we computed are different kinds of thing, and must
> never occupy the same field.**

Once they are separate there is no code path that writes to the user's field, so "preserve verbatim"
stops being a discipline anyone has to remember. `elev` currently holds both; `curvePoints` and
`h0/a/b` are the same confusion one level up.

## Acceptance

**Import then export is BYTE-IDENTICAL for every value the user did not edit.** Not "within
tolerance" — identical. This is also Task 281's (`.inp` export) criterion, and it is the single
assertion that proves the migration finished.
