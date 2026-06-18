# Introduction

This is a prioritized, bulleted roadmap for the EngCalcs hydraulic calculator suite.

The format of each task is: Priority/status|Description. 0 means "Completed" and 100 means top priority. Ties (same priority for multiple tasks) are okay. Any whole number 0-100 can be used. Tasks are sorted highest priority first; completed tasks are at the bottom.

# Tasks

- 40|Translations (multi-lingual): Improve remaining languages (he, pt, hr, sr, ro, cn) — partial or sparse coverage; native-speaker review recommended.

- 95|Translations (multi-lingual): Implement custom language-demand logging. Awstats was evaluated but only reports browser Accept-Language preference, not which language the user actually requested or used. Need server-side logging of explicit language selections and/or the `lang` URL/cookie parameter to get actionable data on real language demand.

- 20|Set up npm (package.json) and/or Composer for dependency management. Deferred from dev-infra work; currently Bootstrap and other assets are manually vendored.

- 10|TypeScript migration — convert `lib/Calculators.lib.js` and per-calculator files to `.ts`. Only worthwhile if the project scope grows significantly.

- 10|Server-side calculation fallback — duplicate JS calc logic in PHP so results can be generated without JavaScript (accessibility, search indexing). High effort, low urgency.

- 10|Results sharing — generate a shareable URL or printable summary of a completed calculation. Nice-to-have feature.

## Completed

- 0|Solver (y/d₀ given Q) for Manning Pipe Flow: Evaluated `origin/Solver` branch. Findings: no conflict-marker files in master; `origin/Solver` is 18+ master commits behind and its general-purpose solver JS was incomplete (missing return value, iteration guard commented out). Decision: do not merge; implement the useful specific case directly in master. Implementation: added `EngCalcs.solveForDd0()` bisection solver to `js/manning-pipe-flow.js` and solver UI to `Manning-Pipe-Flow.php`. Solver reads d₀, n, S₀ from the main form, accepts a target Q with unit selector, bisects y/d₀ on [0.0001, 0.9376] (Manning Q peaks at 93.8% full for circular pipes), then sets the y/d₀ input and reruns the calculator. The `origin/Solver` remote branch can be deleted — it is obsolete.

- 0|Orifice Drain Time polish: Added Starting Head H1 (WSE − centroid), Max (Starting) flow Qmax, and Drained Volume outputs. New m3/ft3/ac-ft volume unit set added to Units.lib.php and all 11 lang files.

- 0|Added SVG sketch to Orifice Drain Time calculator: shows WSE line, wall with opening, H₁ dimension annotation (WSE to centroid), and D dimension annotation at the orifice.

- 0|Added SVG sketch to Weir-Irregular calculator: shows weir crest profile as a gray filled polygon with HWE line above it.

- 0|Moved `EngCalcs.Sketch` from `js/calculators/manning-irregular.js` into `lib/Manning.lib.js` so it can be reused by the irregular weir calculator without duplication.

- 0|Bootstrap 5.3.2 migration and jQuery removal. All pages converted to Bootstrap 5 utility classes; `$()` calls eliminated. (commit 92f38da)

- 0|Extracted per-calculator JavaScript into separate files under `js/calculators/`. Reduces inline script bloat in PHP files. (commit 76d6255)

- 0|Added CLAUDE.md architecture and developer guide. Documents bootstrap flow, prefix convention, unit sets, key files, and roadmap. (commit 61cf0dc)

- 0|Added php -l pre-commit hook to catch PHP syntax errors before commit. (commit 61cf0dc)

- 0|Priority 1 security fixes: XSS output escaping, language parameter validation, cookie Secure/HttpOnly flags, ENV-based DEBUG_MODE, removed test/debug files. (commit 5e807c6)

- 0|Translations (multi-lingual): Evaluated the cost/value of having a languages system in the post-2025 (AI) age. Decision: keep the system — engineering terminology mistranslates poorly in browser auto-translation; marginal maintenance cost is low since the PHP system is already built.

- 0|Translations (multi-lingual): Improved fr (complete rewrite — all calculators now covered), bg (dw/hw/mi/wi sections added), tr (dw/hw/mi added, mixed EN/TR strings fixed). Quality scores updated in Language.Settings.php.

- 0|Orifice calculator phase 1: Orifice.php created with circular/rectangular shape selector, unit-aware inputs (D, W, invert elevation, HWE, Cd), results (centroid, h, area, Q, v, regime check), SVG profile sketch, and notes. js/orifice.js implements Q = Cd × A × √(2gh). Phase 1 assumes unsubmerged free outfall only.

- 0|Orifice Drain Time calculator: Orifice-Drain-Time.php added with conic volume method. Correct formula derived and verified: t(h,Ax,A0) = √h/(Cd·Aor·√(2g))·(2Ax/5 + 8√(Ax·A0)/15 + 16·A0/15); drain time = t(h1,A1,A0) − t(h2,A2,A0) where A2 is interpolated from the conic model. Inputs: starting/ending/orifice elevations, starting-pond area A1, orifice-level area A0, orifice shape/size, Cd. Outputs: interpolated ending area A2, drain time in s/min/hr/day. Equation derivation reference page (MathML) added at Orifice-Drain-Time-Ref.php. All 11 lang files updated.

- 0|Orifice Drain Time polish: renamed "Full pond area A1" → "Starting pond area A1" in all 11 lang files; added ending-elevation-above-orifice-top validation (h2 ≥ D/2) with a color-coded check result field; fixed C_n → C_d in Ref.php Assumptions; changed variable notation H/dH → h/dh throughout Ref.php and all lang notes; added Eq. 12a (fractional-exponent form of integrand) and Eq. 12b (antiderivative with evaluation limits) between Eq. 12 and Eq. 13.
