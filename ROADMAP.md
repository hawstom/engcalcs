# Introduction

This is a prioritized, bulleted roadmap for the EngCalcs hydraulic calculator suite.

The format of each task is: Priority/status|Description. 0 means "Completed" and 100 means top priority. Ties (same priority for multiple tasks) are okay. Any whole number 0-100 can be used. Tasks are sorted highest priority first; completed tasks are at the bottom.

# Tasks
- 100|Help me reorganize this file @ROADMAP.md and set good priorities.

- 90|About and Offline page: Add a link in the menu to a place where we can give more information about our global humanitarian open source mission "I want to use my AI subscription to tell all my sisters and brothers that they are loved and cherished forever.", zip downloads (possibly a single rendered html zip download if that's feasible; see separate issue), PWA, the bitbucket repository, pull requests

- 89|Zip download: Plan the best way to provide each language or possibly all languages in a zip download(s). What architecture changes would be needed if we were interested to make a single html multi-lingual download? I assume that the menus would need some sort of a "Zip mode" where the calculator menu would also reference current language and the language menu would reference also current calculator. And would that use Angular or something to make it lighter in terms of files and bytes? What is best for the global south?

- 90|Add km as a new language

- 90|Add my as a new language

- 90|Add ps as a new language

- 90|Add fa as a new language

- 90|Add uk as a new language

- 90|Evaluate the need cost/benefit of a leaner "text-only" mode for the global south.

- 91|Robinson Rock Chute: 1. Can/should we add this calculator that is currently a Google Spreadsheet? Should we retire the spreadsheet? Should we refer to other available calculators for this method? Why are they more complicated? Does the reference white paper justify complication?

- 90|Love is spoken: I need to clarify for all translations that "Love is spoken here" does not mean "We speak about love here." This means "Love is the language we speak here." Please ensure that this correct implication or express meaning is present in all translations. For example, in Spanish we would say "Se habla el amor aqui", not "Se habla del amor agui." My presenting doubt is about the Italian, though I am not proficient in Italian.

- 93|Irrigation: Existing weir and orifice calculators already serve irrigation flow measurement — consider adding an explicit note or landing page connecting them to irrigation use cases (farmers and irrigation districts use these constantly).

- 91|Irrigation: Explore drip/sprinkler design calculator — emitter flow, lateral spacing, precipitation rate, system uniformity coefficient. High value for smallholder agriculture in water-scarce regions.

- 85|Irrigation: Explore canal seepage/loss estimation — helps irrigation districts quantify conveyance efficiency and prioritize lining investments.

- 90|Plan a Progressive Web App (PWA) or companion phone app, as the most usable and useful case may be. Priority use case: engineers and field workers in low-connectivity regions (same audience as the Global South language expansion).

- 90|Rework message of love: the current single "Love" reference is a start. Consider adding the third clause explicitly — "You are not going to ruin everything" — which names the shame-fear that blocks people from receiving the other two. Any addition should feel like part of the tool, not an interruption of it.

- 40|Translations (multi-lingual): Improve remaining languages (he, pt, hr, sr, ro, cn) — partial or sparse coverage; native-speaker review recommended.

- 20|Set up npm (package.json) and/or Composer for dependency management. Deferred from dev-infra work; currently Bootstrap and other assets are manually vendored.

- 10|TypeScript migration — convert `lib/Calculators.lib.js` and per-calculator files to `.ts`. Only worthwhile if the project scope grows significantly.

- 10|Server-side calculation fallback — duplicate JS calc logic in PHP so results can be generated without JavaScript (accessibility, search indexing). High effort, low urgency.

- 10|Results sharing — generate a shareable URL or printable summary of a completed calculation. Nice-to-have feature.

## Completed

- 0|Language menu order: Corrected Language.Settings.php order to alphabetical by English name (EU/UN convention). Arabic, Bengali, Bulgarian were out of order (was bg, ar, bn → now ar, bn, bg).

- 0|Language system audit: Fixed all lang file issues. Removed ~30 orphaned legacy keys from es, pt, bg, fr, he, tr (mtc_d50_strickler, old mi_d50_* and mi_q/v/f/hv keys, mpf_spreadheet_link_*, mphl_elevation/pressure_head_1/2). Added missing or_velocity to ro and sr. Fixed es.php forward-reference bug (u_grade and u_in used before defined). Fixed tr.php premature ?> close tag that dropped 55 mhp_/ps_ keys outside PHP scope; fixed 3 unescaped apostrophes in Turkish Penstock strings. Fixed bg/he mphl_hgl_2 forward reference to mpf_see_notes. All 23 language files now have zero missing or extra keys, zero warnings.

- 0|Chinese language code: Renamed internal code cn→zh (ISO 639-1 standard). Renamed lang.ec.cn.php → lang.ec.zh.php. Removed BROWSER_TAG hack from Language.Settings.php. Added normalizeLang() to Language.lib.php to silently correct legacy ?lang=cn GET params and ec_language=cn cookies to zh, so returning visitors with old bookmarks/cookies transparently receive Chinese and all logging records zh.

- 0|Penstock Design calculator: Penstock-Design.php wraps Darcy-Weisbach friction factor logic with gross head, plant efficiency, and power output. Inputs: Q, H_gross, D, L, roughness e, minor loss km, kinematic viscosity, η. Results: velocity + color-coded velocity check (1–3 m/s target), f, h_f, h_m, h_L, color-coded head loss % check (10%/20% thresholds), H_net, power (kW/MW/hp), annual kWh/yr. Dynamic SVG bar sketch shows H_net vs h_L proportions. ps_ keys added to all 22 lang files.

- 0|Micro-Hydro Power calculator: Micro-Hydro-Power.php added with run-of-river power formula P = η·ρ·g·Q·H_net. Inputs: Q, gross head, penstock losses, plant efficiency. Outputs: net head, power (kW/MW/hp), annual energy at 100% capacity (kWh/yr). kW/MW/hp units added to Units.lib.php; mhp_ keys added to all 22 lang files. SVG sketch of headpond–penstock–powerhouse system. Notes link to Darcy-Weisbach calculator for penstock loss sizing.

- 0|Add Amharic (አማርኛ) translation — complete translation of all calculators. Registered in Language.Settings.php (QUALITY 0.9). LTR; no RTL change needed.

- 0|Add Urdu (اردو) translation — complete translation of all calculators. Registered in Language.Settings.php (QUALITY 0.9). RTL; added 'ur' to dir="rtl" array in HeadersFooters.lib.php alongside 'ar' and 'he'.

- 0|Add Swahili (Kiswahili) translation — complete translation of all calculators. Registered in Language.Settings.php (QUALITY 0.9). LTR; no RTL change needed.

- 0|Add Hindi (हिन्दी) translation — complete translation of all 12 calculators. Registered in Language.Settings.php (QUALITY 0.9). LTR; no RTL change needed. (commit 05ec23a)

- 0|Ensure that Arabic delivery is complete. Added lib/lang.ec.ar.php (full translation of all 12 calculators), registered in Language.Settings.php (QUALITY 0.9), and fixed RTL rendering in HeadersFooters.lib.php to include 'ar' alongside 'he'. (commit 6ab09d5)

- 0|Translations (multi-lingual): Language-demand logging implemented. `logLanguageSelection()` added to `lib/Language.lib.php`; called in `chooseLanguage()` whenever a valid `?lang=XX` GET parameter is used (explicit user selection only — browser auto-detection is not logged, as Awstats already covers that). Log path defined in `lib/config.inc.php` as `LANG_LOG` → `/var/www/cnm/logs/engcalcs-lang.log` (outside `public_html`, not HTTP-accessible). Log format: tab-separated `UTC-timestamp\tlang-code\tpage-basename`. Directory created with mode 0750; PHP `@file_put_contents` with `LOCK_EX` so logging failures are silent and never break page delivery.

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
