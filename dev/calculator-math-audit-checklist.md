# Task 120 — Holistic Calculator Mathematical Audit: Scope & Checklist

Companion doc for `dev/ROADMAP.md` Task 120 ("Review the mathematical and checks logic of all
calculators"). Written 2026-07-16 to turn a one-line stub into an executable, staged plan — no
audit work has started yet; this is the scope only.

## Why a doc, not just a roadmap line

Same reasoning as `dev/translation-process.md` for Task 109: this is 14 calculators × several
checklist dimensions each, too much surface for one pass, and needs a repeatable per-calculator
procedure so results are comparable and nothing gets checked twice or skipped.

## What counts as a "calculator" for this audit

14 pages carry real computation (grep-verified against each `js/*.js`, 2026-07-16). `Irrigation.php`
is a landing/hub page with no `arrayInputs`/`pageCalculator` of its own — it links to `cs_`/`ip_` and
is **out of scope** (nothing to audit).

| Prefix | File | JS | Core method (verified by reading the JS, not assumed) |
|--------|------|----|---------|
| `dw_` | Darcy-Weisbach.php | darcy-weisbach.js | Swamee-Jain explicit approximation of Colebrook-White for `f`; `h_f = f·(L/D)·v²/2g` |
| `hw_` | Hazen-Williams.php | hazen-williams.js | `S_f = 7.8828/D^4.8704 · (Q/(k·C))^1.852` (SI form) |
| `mpf_` | Manning-Pipe-Flow.php | manning-pipe-flow.js | Circular partial-full Manning geometry (θ-based area/wetted perimeter) + bisection solver for y/d₀ on Q given |
| `mphl_` | Manning-Pipe-Head-Loss.php | manning-pipe-head-loss.js | Manning `S_f` solved algebraically for full pipe (no iteration) |
| `mtc_` | Manning-Trap.php | manning-trap.js | Trapezoidal channel, iterative depth solve (loop, max 100), Blodgett/Strickler `n` from D50, Froude check |
| `mi_` | Manning-Irregular.php | manning-irregular.js | Irregular (station/elevation) cross-section, composite wetted perimeter via wedge geometry, Froude check |
| `rc_` | Rock-Chute.php | rock-chute.js | Robinson rock-chute empirical regressions (D50, chute `n`, mean velocity `V_m`, rundown depth) |
| `mhp_` | Micro-Hydro-Power.php | micro-hydro-power.js | Wraps `dw_`'s Swamee-Jain friction engine; adds `P = ρgQH·η` power conversion |
| `or_` | Orifice.php | orifice.js | Orifice equation `Q = C_d·A·√(2gh)`, circular/rectangular centroid head |
| `odt_` | Orifice-Drain-Time.php | orifice-drain-time.js | Conic-volume time integral of the orifice equation between two elevations |
| `ws_` | Weir-Flow-Simple.php | weir-flow-simple.js | `Q = C_w·L·H^1.5` |
| `wi_` | Weir-Flow-Irregular.php | weir-flow-irregular.js | Per-station weir/notch integration over an irregular crest profile |
| `cs_` | Canal-Seepage.php | canal-seepage.js | Pure arithmetic (no `Math.*` calls) — inflow/outflow loss, conveyance efficiency, lining payback |
| `ip_` | Irrigation-Pressure.php | irrigation-pressure.js | Reuses the same Swamee-Jain friction engine as `dw_`/`mhp_`, reach-by-reach, bisected against known supply pressure |

## Generic per-calculator checklist (apply to every row above)

1. **Formula provenance** — re-derive or cite the core equation(s) against a named, checkable
   source (textbook, ASCE/USBR/NRCS manual, the paper the calculator is attributed to). Confirm the
   constant(s) in the code match the source's units convention (SI vs US customary) — this suite
   stores SI internally and converts at the edges, so a constant lifted from a US-customary textbook
   equation is a classic transcription trap (e.g. Hazen-Williams' `1.318` (US) vs `0.849` (SI) forms).
2. **Worked-example verification** — find or construct a reference problem with a known published
   answer, run it through the actual JS (stub `document`/DOM per `feedback_verify_calc_math_numerically`:
   write a small Node harness that `require()`s the calculator JS directly rather than eyeballing
   the formula), and confirm the numeric output matches within reasonable engineering tolerance.
   This is the step that catches sign errors, wrong exponents, and unit-factor mistakes that formula
   review alone can miss.
3. **Iteration/solver soundness** (only `mpf_`, `mtc_`, `mi_`, `ip_` — the rows with a loop/bisection
   above): verify the solver actually converges across the realistic input domain, not just typical
   textbook values — near-zero flow, near-full pipe, very flat or very steep slope. Check the
   convergence bound/iteration cap is a real derived limit (e.g. `mpf_`'s documented 93.76%-full
   Manning peak-Q bound) and not an arbitrary magic number. Confirm what happens on non-convergence
   (silent wrong answer vs. a visible failure state) — a solver that quietly returns a stale/garbage
   value on non-convergence is worse than one that visibly fails.
4. **Boundary/degenerate-input handling** — zero, negative, and pathological inputs (Q=0, D=0, S=0,
   H=0, A0=A1 in `odt_`, etc.). Confirm each division risk has a guard (several already do, e.g.
   `cs_`'s `(Q_in > 0) ? ... : 0` pattern, `odt_`'s `Math.abs(sqA1-sqA0) < 1e-12` epsilon check) —
   audit whether *every* division in the file has an equivalent guard, not just the ones already
   fixed.
5. **Check-string / verdict logic** — velocity checks, regime (Froude) checks, head-loss %
   checks, and any other pass/warn/fail verdict: verify the numeric thresholds are real published
   engineering guidance (not a placeholder), and that the comparison operators encode the intended
   direction (e.g. Froude < 1 subcritical vs. > 1 supercritical isn't inverted). This is a
   correctness check on top of the D5 presentation convention already covered by Task 105 — 105
   fixed *how* the verdict displays, this audit checks *whether the verdict is right*.
6. **Unit-conversion correctness** — for every input/output using `hasUnits=true`, confirm the
   conversion factor in `lib/Units.lib.php` is correct for that quantity and that the "per SI unit"
   storage convention (multiply to display, divide to store) is applied consistently at every call
   site in that calculator's JS.
7. **Shared-physics cross-check** — for calculators that reuse another's engine (`mhp_` and `ip_`
   both reuse `dw_`'s Swamee-Jain friction code independently rather than sharing one function —
   confirm the three copies haven't drifted apart), verify the duplicated logic is still identical
   across copies, or flag the drift as a refactor candidate (shared `js/` helper) rather than an
   audit-only finding.

## Calculator-specific risk notes (beyond the generic checklist)

- **`dw_`/`mhp_`/`ip_`** — same Swamee-Jain formula is hand-copied in three JS files
  (`darcy-weisbach.js`, `micro-hydro-power.js`, `irrigation-pressure.js`). Verify all three are
  byte-for-byte the same math before auditing them as if independent — a fix to one without the
  others is a latent 3-way inconsistency risk.
- **`hw_`** — confirm the `7.8828`/`4.8704`/`1.852` constants match the SI Hazen-Williams form
  exactly (common transcription source: mixing the US-customary `4.727` form with SI numbers).
- **`mpf_`** — the bisection solver's documented bound (0.0001–0.9376 on y/d₀, "Manning Q peaks at
  93.8% full") is a specific claim from the roadmap history (Task 13) — verify 0.9376 is actually
  the peak-Q depth ratio for a circular section under Manning's equation, not an approximation that
  was never checked.
- **`mtc_`** — Blodgett/Strickler `n` from D50 and the Isbash-style velocity check are attributed to
  named methods (per Task 105/103 history) — verify against the actual Blodgett-Bathurst/Isbash
  published relations, not just internal consistency.
- **`rc_`** — the whole calculator is empirical regression coefficients from one paper (Robinson) —
  verify every regression exponent/coefficient against the actual paper text (a transcription error
  in an empirical exponent is invisible without the source in hand).
- **`odt_`** — the conic-volume time integral is a closed-form solution to a differential equation
  (draining orifice with changing pond area); worth an independent calculus re-derivation, not just
  a plausibility read, since a subtly wrong integration constant would still look reasonable.
- **`wi_`/`mi_`** — irregular-geometry calculators integrate/sum over user-drawn stations; test with
  a hand-computable simple case (e.g. a symmetric trapezoid entered as stations) and confirm the
  general-purpose code reduces to the same answer as the closed-form trapezoidal calculators
  (`mtc_`/`ws_`) it should agree with in that special case.
- **`cs_`** — no iteration or transcendental math, lowest audit risk of the 14; mainly check the
  payback-period and Ec_gain clamping logic (`Ec_gain = (Ec_target > Ec_now) ? ... : 0`) for the
  edge case `Ec_target <= Ec_now` (already guarded) and `Infinity` payback display when recovered
  value is 0 (already guarded) — confirm the UI renders `Infinity` sensibly rather than "∞" looking
  like an error.

## Suggested staging

Stage by shared-physics cluster so cross-checks (item 7 above) happen naturally within a stage
rather than requiring a second pass later:

1. **Friction/pipe-flow cluster**: `dw_`, `hw_`, `mphl_`, `mhp_`, `ip_` (all Darcy-Weisbach/
   Hazen-Williams-family friction physics; catches the 3-way Swamee-Jain duplication in one stage).
2. **Open-channel cluster**: `mpf_`, `mtc_`, `mi_` (Manning-family, all have iteration/geometry
   complexity).
3. **Weir/orifice cluster**: `or_`, `odt_`, `ws_`, `wi_` (closed-form hydraulic-structure equations).
4. **Standalone**: `rc_` (empirical regression, needs the source paper open), `cs_` (lowest risk,
   quick pass).

## Process notes

- Each stage should produce, per calculator: a pass/fail per checklist item above, any defects found
  (with the specific input that triggers them), and a fix proposal — mirroring the format Task 105/
  101/102 used for the translation-adjacent findings, so a fix can be scoped and confirmed with Tom
  before editing (per `feedback_verify_calc_math_numerically` and the general "confirm before
  multi-file execution" standing feedback).
- No language/translation work is implied by this task — it is English-source math/logic only.
  A fix to a check-string threshold or formula would flow into the existing translation pipeline
  only if it changes visible text, same as any other bug fix.
- This is audit + fix, not a rewrite — don't refactor calculators beyond what a found defect
  requires (per the project's general no-scope-creep instruction).
