# Introduction

This is a prioritized, bulleted roadmap for the EngCalcs hydraulic calculator suite.

The format of each task is: Priority/status|Description. 0 means "Completed" and 100 means top priority. Ties (same priority for multiple tasks) are okay. Any whole number 0-100 can be used. Tasks are sorted highest priority first; completed tasks are at the bottom.

# Tasks

## Mission & Love

- 50|Love is spoken — native speaker review: Three languages use formulations that may be correct but are ambiguous and worth a native-speaker check: ar ("هنا نتحدث بالمحبة" — "بـ" is the language-speaking preposition, so may be correct), pt ("O amor é falado aqui" — grammatically odd passive), am ("ፍቅር እዚህ ይነገራል" — "told/spoken here" — probably fine). Eight languages corrected: it, sr, bg, cs, bn, hi, id, ur all now say "love is our language here" rather than "we speak about/with love."

- 85|About page: Add a menu link to a page covering: global humanitarian open source mission, offline/zip download options, PWA status, Bitbucket repository, and pull requests.

- 70|Zip download: Plan the best architecture for per-language or multi-language zip downloads. Consider whether a single-HTML multi-lingual download is feasible and what menu/routing changes it would require. Optimize for the global south (file size, offline usability).

- 60|Progressive Web App (PWA): Plan a PWA or companion phone app for engineers and field workers in low-connectivity regions.

- 55|Text-only mode: Evaluate the need and cost/benefit of a leaner text-only rendering for the global south.

## Language Expansion

- 82|Improve remaining language quality: he, pt, hr, sr, ro, zh — partial or sparse coverage; native-speaker review recommended.

## Calculator Improvements

- 88|Irrigation: Existing weir and orifice calculators already serve irrigation flow measurement — add an explicit note or landing page connecting them to irrigation use cases (farmers and irrigation districts use these constantly).

- 80|Irrigation: Explore drip/sprinkler design calculator — emitter flow, lateral spacing, precipitation rate, system uniformity coefficient. High value for smallholder agriculture in water-scarce regions.

- 75|Robinson Rock Chute: Evaluate adding this calculator (currently a Google Spreadsheet). Should we retire the spreadsheet or refer to other available calculators? Does the reference white paper justify the complexity?

- 65|Irrigation: Explore canal seepage/loss estimation — helps irrigation districts quantify conveyance efficiency and prioritize lining investments.

## Low Priority / Nice-to-Have

- 20|Set up npm (package.json) and/or Composer for dependency management. Currently Bootstrap and other assets are manually vendored.

- 10|TypeScript migration — convert `lib/Calculators.lib.js` and per-calculator files to `.ts`. Only worthwhile if the project scope grows significantly.

- 10|Server-side calculation fallback — duplicate JS calc logic in PHP so results can be generated without JavaScript (accessibility, search indexing). High effort, low urgency.

- 10|Results sharing — generate a shareable URL or printable summary of a completed calculation.

## Completed

- 0|Add km (Khmer), my (Burmese/Myanmar), ps (Pashto), fa (Farsi/Persian), uk (Ukrainian) as new languages — complete translation of all calculators. Khmer, Burmese, Ukrainian are LTR; Farsi and Pashto are RTL (added to dir="rtl" array in HeadersFooters.lib.php). All registered in Language.Settings.php (QUALITY 0.9). Now 27 languages total.

- 0|Rework message of love: added "You are not ruining everything" as the third clause in all 22 languages. Naming the shame-fear that blocks people from receiving the other two. Fits naturally in the welcome bar.

- 0|Love is spoken — corrected 8 translations: it, sr, bg, cs, bn, hi, id, ur were saying "we speak about love" or "we speak lovingly." All now say "love is our language here." Three languages (ar, pt, am) flagged for native-speaker review; see roadmap.

- 0|Roadmap reorganized: grouped by theme (Mission & Love, Language Expansion, Calculator Improvements, Offline & Accessibility, Low Priority), priorities differentiated so ties are intentional, descriptions tightened.

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
