# Introduction

This is a prioritized, bulleted roadmap for the EngCalcs hydraulic calculator suite.

The format of each task is: Priority/status|Description. 0 means "Completed" and 100 means top priority. Ties (same priority for multiple tasks) are okay. Any whole number 0-100 can be used. Tasks are sorted highest priority first; move completed tasks to the ## Completed section.

# Tasks

## Mission & Love

- 0|Progressive Web App (PWA): Implemented. manifest.json, sw.js, and icons/icon.svg added. Service worker pre-caches all 16 calculator pages + all JS/CSS assets + Bootstrap CDN files on install. Strategy: cache-first for static assets, network-first (falling back to cache) for PHP pages. Language cookies work normally when online; offline serves the cached version in whatever language was current at install time. SW registration injected into echoHTMLHead() via HeadersFooters.lib.php. Theme color #1a6faf. Remaining nice-to-have: PNG icons for older Android WebView installs (currently SVG only, works on Chrome 112+/Safari 16+/Firefox).

- 55|Text-only mode: Evaluate the need and cost/benefit of a leaner text-only rendering for the global south.

## Language Expansion

- 36|Redundant phrases: We are starting to get some repeated phrases that maybe we can standardize as snippets. Maybe you can evaluate possible lengthy passages ("Measure flow", love statement, etc) to index/compress into standard snippets. I know from my experience first launching these language files long ago that this can cause more trouble than it's worth; I reworked the system that was overly "normalized". But maybe within reason?

- 0|Language button: replaced translated "Language" text with a globe emoji (🌐) — universally recognized, no translation needed, no flags (flags conflate language with country per W3C i18n). Screen-reader text "Language" retained via visually-hidden span. Dropdown items already show native language names so users can find their language once the dropdown opens.

## Calculator Improvements

- 0|Drip-Sprinkler: DU quality check renders as "Good &mdash; DU &ge; 80% ✓" — fixed. HTML entities in ds_du_* lang keys were double-encoded through htmlspecialchars() into JS. Replaced with Unicode (— ≥ <) in all 27 lang files.

- 0|Translation sprint — three pages: Drip-Sprinkler.php (ds_* keys), Irrigation.php (body prose and card descriptions), and About.php (body prose). Decision: keep all three pages; translate all 26 non-English lang files before next deployment. Drip-Sprinkler value question resolved — unit-conversion (L/hr → mm/hr) and DU quality flag are genuine value for field workers in their own language; arithmetic simplicity is not the disqualifier. About and Irrigation body content to use one block key per page per language (e.g. `about_body_html`, `irr_body_html`) so prose translates naturally rather than key-by-key.

- 40|Contextual hover tips for all calculators: Replace `<a href="javascript:alert(...)">?</a>` inline help links with `<span title="..." style="cursor:help;color:#06c;font-size:0.9em">?</span>` hover tips across all calculators, and move short notes inline (next to the relevant input/output label) rather than in the bottom notes block. Pattern established in Rock Chute (rc_qt, rc_D50, rc_apron_length, rc_sg, rc_SD, rc_Hp, rc_yn). Apply to all remaining calculators that use javascript:alert.

- 35|Standalone engcalcs: Would it be good to more completely decouple engcalcs from its containing web site? I am not sure about the standard way to accomplish this, but it seems intuitive to me that this app should not depend on its containing site in its parent folder(s).


- 0|Robinson Rock Chute: Rock-Chute.php implemented — Robinson, Rice & Kadavy (1998) D50 sizing equations, slope-based equation selection, range checks, layer/crest/apron geometry, SVG sketch, translated into all 27 languages. Reference spreadsheets retained in .claude/ for audit purposes. Google Spreadsheet superseded.

- 0|Irrigation: Canal-Seepage.php added (prefix cs_). Inflow-outflow method: Q_loss = Q_in − Q_out, conveyance efficiency Ec = Q_out/Q_in. Outputs: loss rate, loss fraction, Ec with Good/Fair/Poor rating (≥80%/60-80%/<60%), daily and annual volume lost. Unit-aware (m³/s, L/s, cfs for flow; m³/ft³/ac-ft for volume). Added card to Irrigation.php landing page and menu entry under Irrigation.

- 35|Is there a nice way to let users save a named calculation? Save/restore button? Leads to inputs for save name and a list of save names to open or delete. Leads to user registration and login for cross-device saves (I lean against this)?

## Low Priority / Nice-to-Have

- 20|Set up npm (package.json) and/or Composer for dependency management. Currently Bootstrap and other assets are manually vendored.

- 10|TypeScript migration — convert `lib/Calculators.lib.js` and per-calculator files to `.ts`. Only worthwhile if the project scope grows significantly.

- 10|Server-side calculation fallback — duplicate JS calc logic in PHP so results can be generated without JavaScript (accessibility, search indexing). High effort, low urgency.

- 10|Results sharing — generate a shareable URL or printable summary of a completed calculation.

## Completed

- 0|Drip/Sprinkler Application Rate calculator (Drip-Sprinkler.php): inputs are average and minimum emitter flow rate, emitter spacing Se, lateral spacing Sl, emitters per lateral, laterals per zone, and target application depth. Outputs are area per emitter, application (precipitation) rate PR = q/Ae, distribution uniformity DU = qmin/qavg (with color-coded quality check), flow per lateral, zone flow, and runtime for target depth. New units added: lph, gph (flow rates), mmph, inph (precipitation rate). Added to main nav under Irrigation, and added a card to Irrigation.php landing page. ds_ keys added to all 27 lang files (English translations; other languages fall back to English pending native-speaker review).

- 0|Language quality — structural fixes: he, pt, hr, sr, ro, zh all raised to 0.85–0.9. he: fixed 6 English strings in mtc_ section and mixed-language mphl_hgl_2. sr: fixed 4 Croatian-script strings in irr_/mhp_ sections. All 26 non-English lang files gained about_ keys. Native-speaker review not tracked here — handled when speakers reach out via the feedback bar.

- 0|About page (About.php): added to nav menu. Covers global humanitarian open source mission, GNU GPL v3 license, Bitbucket repository link (bitbucket.org/hawstom/engcalcs), contributing (translations, bugs, new calculators, hosting), offline ZIP download (planned/roadmap), and PWA status (planned/roadmap).

- 0|Irrigation landing page (Irrigation.php): added to menu with divider. Links to Weir Flow Simple, Weir Flow Irregular, Orifice Flow, Orifice Drain Time, and Manning channel calculators. Quick-reference section for diversion dams, headgates, pipe turnouts, and USBR Water Measurement Manual alignment. irr_ keys added to all 27 lang files.

- 0|Add km (Khmer), my (Burmese/Myanmar), ps (Pashto), fa (Farsi/Persian), uk (Ukrainian) as new languages — complete translation of all calculators. Khmer, Burmese, Ukrainian are LTR; Farsi and Pashto are RTL (added to dir="rtl" array in HeadersFooters.lib.php). All registered in Language.Settings.php (QUALITY 0.9). Now 27 languages total.

- 0|Rework message of love: added "You are not ruining everything" as the third clause in all 22 languages. Naming the shame-fear that blocks people from receiving the other two. Fits naturally in the welcome bar.

- 0|Love is spoken — corrected 8 translations: it, sr, bg, cs, bn, hi, id, ur were saying "we speak about love" or "we speak lovingly." All now say "love is our language here." Three languages (ar, pt, am) have formulations that may be correct but are ambiguous; native-speaker corrections welcome via the feedback bar if they arise.

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
