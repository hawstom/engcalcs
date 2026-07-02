# Introduction

This is a prioritized, bulleted roadmap for the EngCalcs hydraulic calculator suite.

The format of each task is: Priority/status|Description. 0 means "Completed" and 100 means top priority. Ties (same priority for multiple tasks) are okay. Any whole number 0-100 can be used. Tasks are sorted highest priority first; move completed tasks to the ## Completed section.

Actor tags show who currently holds the task: `[CC]` = Claude Code, `[CP]` = Copilot, `[H]` = Human decision needed, `[CC→CP]` / `[CP→CC]` = split task (first actor works, then updates tag to the next plain tag when handing off). Untagged = actor-agnostic. See `cross-platform-planning.md` §2.2.2 for the full tag lifecycle.

# Tasks

## Calculator Improvements
- 50|On Drip-Sprinkler.php, realistically, how would a person know the Minimum emitter rate? Is this a design calculator? Wouldn't they have to model the losses in the entire system or measure an existing system? I'm just checking that we are offering something useful here.

## Translation Standardization (Glossary Project)

- 0|Expand and tighten glossary.json: Filled in all 5 empty languages (am, bn, km, my, ps) for all 27 terms using 5 parallel agents. Reviewed 6 nuanced terms across 21 existing languages. Corrections applied: fr conveyance efficiency → rendement de transport d'eau; cs/sr penstock → tlakovod/напорни цевовод; ar/uk emitter → قطارة/крапельниця; uk conveyance efficiency → added 'води'. Version bumped to 1.1.

- 85|Audit existing translations for glossary compliance: After glossary is finalized, check whether key high-drift terms (flow, head loss, weir, conveyance efficiency) in the 26 non-English lang files match the glossary preferred translations. Re-translate non-compliant strings in a targeted sprint. [CC]

## Translation improvements

- 36|Remove $ec_lang['ec_name_invalid'] from all languages.

- 30|Remove orphaned rrc_ keys from all 26 non-English lang files: `rrc_main_desc` and `rrc_main_menu` appear in every non-English file but not in English — legacy of an earlier `rrc_` prefix before Rock Chute settled on `rc_`. Two-line removal per file × 26 files.

## AI Efficiency Scripting (Overhead)

These tasks reduce the AI token cost of routine maintenance by replacing repeated AI judgment with deterministic scripts. Copilot owns execution (all tagged `[CP]`); Claude Code specs any script whose output feeds back into translation quality work.

- 35|Lang-file key-order normalizer: Script that rewrites each `lib/lang.ec.??.php` so its key order matches the English source exactly. Currently, keys accumulated in insertion order over many sprints, making `git diff` noisy and making it easy for parity-checker output to be hard to read. One-time run + hook to enforce order on future edits. [CP]

- 30|Deployment workflow script: Shell script wrapping the full release sequence — php syntax check on changed files, git add/commit prompt, push via `altssh.bitbucket.org:443`. Removes the per-session SSH configuration overhead that currently requires either a manual reminder or asking an AI to recall the altssh workaround. [CP]

- 24|Quality-score updater: Script that accepts a lang code and a new QUALITY score and updates the `QUALITY` constant in the matching `lang.ec.??.php` file. Trivial change, but currently requires opening the file manually or asking an AI — a one-liner script removes that friction entirely. [CP]

## Low Priority / Nice-to-Have

- 20|Set up npm (package.json) and/or Composer for dependency management. Currently Bootstrap and other assets are manually vendored. [CP]

- 10|TypeScript migration — convert `lib/Calculators.lib.js` and per-calculator files to `.ts`. Only worthwhile if the project scope grows significantly. [H]

- 10|Server-side calculation fallback — duplicate JS calc logic in PHP so results can be generated without JavaScript (accessibility, search indexing). High effort, low urgency. [H]

- 10|Results sharing — dedicated "Copy link" button or print summary. Largely addressed by the URL-based label feature; a polished UI affordance is the remaining gap. [CP]

## Completed

- 0|Translation sprint — velocity-check short labels + orifice centroid reword: Launched 26 parallel haiku agents (one per language) to translate the 6 new short velocity-check keys (`mtc_vel_ok_short`/`high_short`/`low_short`, `mhp_vel_ok_short`/`high_short`/`low_short`) and reword `or_regime_submerged` from "invert" to "centroid" in all 26 non-English `lib/lang.ec.??.php` files, each referencing that file's existing `or_centroid_elev` translation for term consistency. Also picked up a few pre-existing untranslated keys (`mtc_blodgett_v_bathurst`, `or_shape_circular`/`rectangular`) surfaced in the same payload. Result: `lang_parity_check.php` shows 0 missing keys project-wide; `lang_syntax_validate.php` clean across all 27 files.

- 0|CSS standardization for validity/status checks: Added named classes to `engcalcs.css` (`.ec-status-ok/-info/-warn/-bad/-neutral`, `.ec-tip` for hover-help cursor) using the more accessible hex colors (`#267326`, `#c60`, `#c00`) that Rock Chute already used, instead of the plain CSS color keywords (`green`, `darkorange`, `red`) used ad hoc elsewhere. Replaced all `el.style.color = '...'` assignments with `el.classList.add(...)` across `js/orifice.js`, `js/rock-chute.js`, `js/drip-sprinkler.js`, `js/orifice-drain-time.js`, `js/micro-hydro-power.js`, `js/canal-seepage.js`, and the new `EngCalcs.writeVelocityCheck()` helper. Also fixed `engcalcs.css` being served with a hardcoded `?v=2` instead of `filemtime()` cache-busting (matches the existing per-project convention for JS includes) — now `?v=<?=filemtime(...)?>` in `lib/HeadersFooters.lib.php`. SVG-sketch geometry/line-thickness standardization is a larger follow-up not attempted here.

- 0|Velocity-check short labels use "High ⚠" / "Low ⚠" (icon carries the warning), not "High !" / "Low !" — dropped the exclamation mark per user feedback to avoid "hype" wording; the ⚠ hover-tip icon already communicates the warning.

- 0|Manning Pipe Head Loss HGL₂ NaN fix: `js/manning-pipe-head-loss.js` had `hgl2 = hgl2 - hv` (self-reference before assignment, always NaN). Fixed to `hgl2 = egl2 - hv`, matching Hazen-Williams and Darcy-Weisbach. Also added the missing `hgl1 = egl1 - hv` result (present in the other two calculators but absent here), reusing the shared `hw_hgl_1` label.

- 0|Orifice submergence criterion fixed to use centroid, not invert: `js/orifice.js` `submerged` flag compared TWE to `zinv` (pipe invert), which flagged submergence too early — before the downstream water surface had actually risen past the orifice center, understating the free-discharge head. Changed to compare TWE against `centroid`. Updated English `or_regime_submerged` message from "TWE above invert" to "TWE above centroid" to match; the 26 non-English translations of that string still need re-wording (tracked in active roadmap item).

- 0|Velocity check messages shortened to OK/High !/Low !: Added `EngCalcs.writeVelocityCheck()` shared helper in `js/Calculators.lib.js` — renders a short status plus a hover-tip warning icon (⚠, `title` attribute) carrying the full explanation, replacing long inline sentences in Manning Trapezoid, Manning Irregular, and Micro-Hydro Power velocity-check cells. Added 6 new short-form lang keys (`mtc_vel_ok_short`/`high_short`/`low_short`, `mhp_vel_ok_short`/`high_short`/`low_short`) to English; non-English translation still needed (tracked in active roadmap item).

- 0|Wire glossary into CLAUDE.md agent translation sprint: Translation Sprints section updated with pre-sprint step to verify glossary.json preferred-translation coverage for the calculator prefix's key terms, and launch instructions specifying that each agent receives embedded glossary terms, intent notes, and all translation rules. Glossary at v1.2 covers all 26 non-English languages across all calculator prefixes.

- 0|ec_lang_intent workflow audit and Spanish Robinson fix: Spanish Robinson translations verified correct — `bajante de rocado` / `escollera` / `pendiente pronunciada` properly convey the steep-channel context (not generic "canal"). Parallel-agent sprint workflow (one agent per language) established as the standard approach. Glossary injection + intent guard provide the quality layer for future sprints.

- 0|Audit remaining English strings in other languages: Parity checker run across all 26 non-English lang files confirms 0 missing keys in every language. English-equal strings (~23–55 per language) are overwhelmingly unit symbols (u_ft, u_m, u_kw, etc.) and technical abbreviations that correctly remain as international English. No untranslated calculator content found. Discovered two orphaned rrc_ keys present in all 26 non-English files — see active cleanup task.

- 0|HTML-entity audit script + bulk fix: `dev/scripts/html_entity_audit.php` scans all lang files for HTML entities (`&mdash;`, `&ge;`, `&amp;`, `&nu;`, etc.) that double-encode through `htmlspecialchars()` into JS `pageConfig`. Supports `--lang`, `--prefix`, `--fix` (replace in-place), and `--strict` (exit 1 for CI). On first run with `--fix`, replaced 2201 entity occurrences across all 26 non-English lang files with plain Unicode characters. English file was already clean; all non-English files now match that standard. Run without `--fix` to audit future regressions.

- 0|Hard-coded velocity units in Micro-Hydro messages/footnote: Updated velocity check output to unitless wording ("Velocity very low", "Velocity very high", "Velocity reasonable") and replaced the velocity note text with unitless guidance tied to available drop, losses, and water-hammer risk.

- 0|Propagate corrected `rc_notes_4_def` link to all translations: Replaced the old DOI URL with `https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf` in all 27 `lib/lang.ec.??.php` files.

- 0|Add velocity checks to Manning trapezoid and irregular calculators: Added `v_check` result to both calculators with warning messaging when velocity is high, and added the requested design note about high specific energy and potential expansion/obstruction losses.

- 0|ec_lang_intent guard: `$ec_lang_intent` is now explicitly off-limits to AI in both `CLAUDE.md` and `.github/copilot-instructions.md`. Both files state that AI must not add, change, or remove any `$ec_lang_intent` value without explicit written permission from the human in that conversation.

- 0|Math/logic review of all 14 calculators: Full review completed; findings written to `dev/ai-report.md`. One confirmed bug (Manning Pipe Head Loss HGL₂ always NaN — `hgl2` referenced before assignment), one medium logic concern (Orifice submergence criterion overestimates flow when TWE between invert and centroid), one design risk (Weir Flow Simple missing unit guidance for Cw), one cosmetic misspelling (Hagen-"Pouseuille" in DW). All core hydraulic formulas in the other 12 calculators verified correct.

- 0|"More" dropdown: About link moved under a "More ▾" dropdown (`menu_more` key, translated into all 27 languages). Follows web convention (Twitter, LinkedIn); "Help → About" is desktop-app convention. Dropdown uses `dropdown-menu-end` so it aligns to the right edge on small screens. Ready for Install/Subscribe/Contact items as those pages are built.

- 0|Encoding — kinematic viscosity tooltip raw codes: `&sup6;` is not a valid HTML5 named entity; it displayed literally in Bootstrap tooltips across all 27 lang files. Fixed `dw_kinematic_viscosity` and `ps_nu` title attributes to use UTF-8 characters (×, ⁻, ⁶, ², °) instead of HTML entities. Also corrected Ukrainian file which had `&#8308;` (superscript 4) instead of ⁶ and ². Prevention: use literal UTF-8 chars in all lang `title` attributes; the planned HTML-entity audit script (priority 25) will catch any recurrence.

- 0|Standalone engcalcs: Decoupled engcalcs from hawsedc.com via optional parent hooks. `hawsedc/engcalcs-parent-hooks.php` defines `engcalcsParentCSS()` and `engcalcsParentMenu()`; `engcalcs/lib/base.inc.php` loads this file if present; `HeadersFooters.lib.php` calls hooks conditionally. `hawsedc/index.php` now uses new standalone `hawsedc/hawsedc.lib.php` — no engcalcs bootstrap required. Fixed info-disclosure bug (BASE_DIRECTORY was echoed into public HTML).

- 0|New-calculator scaffold script: Added `scripts/new_calculator_scaffold.php`. Given `--prefix` and `--keys`, it appends missing stub entries across all 27 `lib/lang.ec.??.php` files and creates a calculator skeleton page + JS file using repo conventions (`echoHeader`/`echoCalculatorForm`/`echoFeedback`/`echoFooter`, JS include with `filemtime()`).

- 0|Translation completion matrix: Added `scripts/translation_completion_matrix.php` to report untranslated-key counts with languages as rows and key prefixes as columns. Supports `--lang`, `--prefix`, and `--format=table|csv` for sprint prioritization.

- 0|Zero-API translation runner (default): Added `scripts/translate_zero_api.php` to orchestrate default non-API translation workflow with deterministic phases (`scan` and `validate`) using payload generation, parity checks, syntax validation, and completion matrix reporting. `scripts/translate.php` remains optional paid path and now labels itself as non-default.

- 0|Engineering glossary integration: `scripts/glossary.json` is now wired into both `scripts/generate_translation_payloads.php` (prefix-scoped glossary context and preferred-term payload fields) and API prompt construction in `scripts/translate_prompt.php` (preferred term map, translation notes, and neighboring translated key context injection).

- 0|Translation payload generator (per-lang JSON): `scripts/generate_translation_payloads.php` now reads English plus each target lang file, emits only missing/untranslated keys, and includes neighboring translated context per key for register consistency (`key_context`). Supports `--prefix` and `--lang` filters and keeps backward compatibility with existing payload consumers via `keys` aliasing `keys_to_translate`.

- 0|Lang-key parity checker: Implemented `scripts/lang_parity_check.php`. Compares each `lib/lang.ec.??.php` against `lib/lang.ec.en.php`, reports missing keys, extra keys, and keys still equal to English. Supports `--lang`, `--prefix`, and `--strict` for sprint briefs and completion checks.

- 0|Lang-file syntax validator: Implemented `scripts/lang_syntax_validate.php`. Runs `php -l` per lang file and reports file:line findings for syntax errors, premature `?>`/out-of-scope declarations, and duplicate keys. Supports `--lang` scoping for surgical checks.

- 0|Save/share named calculations: URL-based Option B implemented. "Label:" field (50 chars, letters/digits/spaces/–_.) in h1 flex row on all calculator pages. On every calculation, history.replaceState encodes all form inputs + label as GET params. Loading a labelled URL pre-fills the form and restores the label. &lt;title&gt; reflects label. Client-side validation: hint text turns red on invalid chars, strips on blur. Label field suppressed on non-calculator pages. ec_name_* keys added to all 27 lang files.

- 0|Canal seepage expansion: Canal-Seepage.php expanded with lining payback outputs (annual value lost/recovered, total lining cost, simple payback period). Blank defaults for optional payback inputs. Separator "/" rendered between input element and unit selector via new 'separator' key in echoCalculatorForm. "per" replaced with "/" in all 27 lang files for "Value of water (currency / unit volume)" and "Lining cost (currency / unit area)".

- 0|Progressive Web App (PWA): Implemented. manifest.json, sw.js, and icons/icon.svg added. Service worker pre-caches all 16 calculator pages + all JS/CSS assets + Bootstrap CDN files on install. Strategy: cache-first for static assets, network-first (falling back to cache) for PHP pages. Language cookies work normally when online; offline serves the cached version in whatever language was current at install time. SW registration injected into echoHTMLHead() via HeadersFooters.lib.php. Theme color #1a6faf.

- 0|Text-only mode: Evaluated and closed. The PWA pre-caches all assets on install, making text-only redundant for returning visitors — the primary global south use case. A parallel rendering path would add significant maintenance burden for a narrow first-load benefit.

- 0|Redundant phrases: Evaluated and closed. The only truly identical long passage across all 27 lang files is the USBR/FAO citation in cs_notes_4_def — a proper-noun citation that doesn't translate. Adding a PHP shared-constant system for one string costs more than it saves.

- 0|Language button: replaced translated "Language" text with a globe emoji (🌐) — universally recognized, no translation needed, no flags (flags conflate language with country per W3C i18n). Screen-reader text "Language" retained via visually-hidden span.

- 0|Drip-Sprinkler: DU quality check renders as "Good &mdash; DU &ge; 80% ✓" — fixed. HTML entities in ds_du_* lang keys were double-encoded through htmlspecialchars() into JS. Replaced with Unicode (— ≥ <) in all 27 lang files.

- 0|Translation sprint — three pages: Drip-Sprinkler.php (ds_* keys), Irrigation.php (body prose and card descriptions), and About.php (body prose). Decision: keep all three pages; translate all 26 non-English lang files before next deployment.

- 0|Contextual hover tips: all javascript:alert help links replaced with span hover tooltips across all 27 language files. The only occurrences were the 3 mtc_d50_* Manning Trap Channel riprap sizing labels — all now use the Rock Chute pattern (cursor:help, steelblue ?, title attribute).

- 0|Robinson Rock Chute: Rock-Chute.php implemented — Robinson, Rice & Kadavy (1998) D50 sizing equations, slope-based equation selection, range checks, layer/crest/apron geometry, SVG sketch, translated into all 27 languages.

- 0|Irrigation: Canal-Seepage.php added (prefix cs_). Inflow-outflow method: Q_loss = Q_in − Q_out, conveyance efficiency Ec = Q_out/Q_in. Outputs: loss rate, loss fraction, Ec with Good/Fair/Poor rating (≥80%/60-80%/<60%), daily and annual volume lost. Unit-aware (m³/s, L/s, cfs for flow; m³/ft³/ac-ft for volume). Added card to Irrigation.php landing page and menu entry under Irrigation.

- 0|Drip/Sprinkler Application Rate calculator (Drip-Sprinkler.php): inputs are average and minimum emitter flow rate, emitter spacing Se, lateral spacing Sl, emitters per lateral, laterals per zone, and target application depth. Outputs are area per emitter, application (precipitation) rate PR = q/Ae, distribution uniformity DU = qmin/qavg (with color-coded quality check), flow per lateral, zone flow, and runtime for target depth. New units added: lph, gph (flow rates), mmph, inph (precipitation rate). ds_ keys added to all 27 lang files.

- 0|Language quality — structural fixes: he, pt, hr, sr, ro, zh all raised to 0.85–0.9. he: fixed 6 English strings in mtc_ section and mixed-language mphl_hgl_2. sr: fixed 4 Croatian-script strings in irr_/mhp_ sections. All 26 non-English lang files gained about_ keys.

- 0|About page (About.php): added to nav menu. Covers global humanitarian open source mission, GNU GPL v3 license, Bitbucket repository link (bitbucket.org/hawstom/engcalcs), contributing (translations, bugs, new calculators, hosting), offline ZIP download (planned/roadmap), and PWA status.

- 0|Irrigation landing page (Irrigation.php): added to menu with divider. Links to Weir Flow Simple, Weir Flow Irregular, Orifice Flow, Orifice Drain Time, and Manning channel calculators. Quick-reference section for diversion dams, headgates, pipe turnouts, and USBR Water Measurement Manual alignment. irr_ keys added to all 27 lang files.

- 0|Add km (Khmer), my (Burmese/Myanmar), ps (Pashto), fa (Farsi/Persian), uk (Ukrainian) as new languages — complete translation of all calculators. Khmer, Burmese, Ukrainian are LTR; Farsi and Pashto are RTL. Now 27 languages total.

- 0|Rework message of love: added "You are not ruining everything" as the third clause in all 22 languages. Naming the shame-fear that blocks people from receiving the other two.

- 0|Love is spoken — corrected 8 translations: it, sr, bg, cs, bn, hi, id, ur were saying "we speak about love" or "we speak lovingly." All now say "love is our language here."

- 0|Language menu order: Corrected Language.Settings.php order to alphabetical by English name (EU/UN convention). Arabic, Bengali, Bulgarian were out of order.

- 0|Language system audit: Fixed all lang file issues. Removed ~30 orphaned legacy keys. Added missing or_velocity to ro and sr. Fixed es.php forward-reference bug. Fixed tr.php premature ?> close tag that dropped 55 mhp_/ps_ keys outside PHP scope; fixed 3 unescaped apostrophes in Turkish Penstock strings. Fixed bg/he mphl_hgl_2 forward reference.

- 0|Chinese language code: Renamed internal code cn→zh (ISO 639-1 standard). Added normalizeLang() to Language.lib.php to silently correct legacy ?lang=cn GET params and ec_language=cn cookies to zh.

- 0|Micro-Hydro Power calculator: Retitled from Penstock-Design.php to Micro-Hydro-Power.php and migrated fully to mhp_ language keys (old ps_ keys renamed, duplicate old mhp_ block removed). Calculator wraps Darcy-Weisbach friction factor logic with gross head, plant efficiency, and power output. Inputs: Q, H_gross, D, L, roughness e, minor loss km, kinematic viscosity, η. Results: velocity + color-coded velocity check, f, h_f, h_m, h_L, color-coded head loss % check, H_net, power (kW/MW/hp), annual kWh/yr. Dynamic SVG bar sketch.

- 0|Add Amharic, Urdu, Swahili, Hindi, Arabic translations — complete translation of all calculators in each language. All registered in Language.Settings.php (QUALITY 0.9). Urdu/Arabic are RTL.

- 0|Language-demand logging: logLanguageSelection() added to Language.lib.php; called when a valid ?lang=XX GET parameter is used. Log path: /var/www/cnm/logs/engcalcs-lang.log. Format: tab-separated UTC-timestamp, lang-code, page-basename.

- 0|Solver (y/d₀ given Q) for Manning Pipe Flow: bisection solver added to js/manning-pipe-flow.js. Bisects y/d₀ on [0.0001, 0.9376] (Manning Q peaks at 93.8% full for circular pipes), sets the y/d₀ input and reruns the calculator.

- 0|Orifice Drain Time calculator: Orifice-Drain-Time.php with conic volume method. Inputs: starting/ending/orifice elevations, starting-pond area A1, orifice-level area A0, orifice shape/size, Cd. Outputs: interpolated ending area A2, drain time. Equation derivation reference page (MathML) at Orifice-Drain-Time-Ref.php. SVG sketch. Polished: H1, Qmax, Drained Volume outputs added; h2 ≥ D/2 validation.

- 0|SVG sketches: Added to Orifice Drain Time (WSE, wall, H₁, D annotations), Weir-Irregular (crest profile as gray filled polygon with HWE line). Manning.lib.js extracted for shared sketch reuse.

- 0|Bootstrap 5.3.2 migration and jQuery removal. All pages converted to Bootstrap 5 utility classes; $() calls eliminated. (commit 92f38da)

- 0|Extracted per-calculator JavaScript into separate files under js/calculators/. (commit 76d6255)

- 0|Added CLAUDE.md architecture and developer guide. Added php -l pre-commit hook. Priority 1 security fixes: XSS output escaping, language parameter validation, cookie Secure/HttpOnly flags, ENV-based DEBUG_MODE, removed test/debug files.

- 0|Translations (multi-lingual): Evaluated cost/value of having a languages system in the post-2025 (AI) age. Decision: keep the system — engineering terminology mistranslates poorly in browser auto-translation. Improved fr (complete rewrite), bg (dw/hw/mi/wi sections added), tr (dw/hw/mi added).

- 0|Orifice calculator phase 1: Orifice.php created with circular/rectangular shape selector, unit-aware inputs (D, W, invert elevation, HWE, Cd), results (centroid, h, area, Q, v, regime check), SVG profile sketch, and notes.

- 0|Touch tooltips: Bootstrap Tooltip initialized on all `[title][style*="cursor:help"]` spans via DOMContentLoaded in Calculators.lib.js (`trigger: 'hover focus click'`). Tappable on mobile. `?` span added after Save label in navbar for the `ec_name_hint` text.

- 0|PWA on mobile: PNG icons (192×192, 512×512) generated and added to manifest.json. Apple meta tags (`apple-mobile-web-app-capable`, `apple-touch-icon`, etc.) added to `<head>` via HeadersFooters.lib.php. SW cache bumped to v2. iOS requires manual "Add to Home Screen" from Safari share menu — `beforeinstallprompt` does not fire on iOS by design.

- 0|Layout overflow: Wrapped `<table class="bare">` in `<div style="overflow-x:auto">` in `echoCalculatorForm()`. On narrow screens the table scrolls horizontally within the page rather than overflowing past the edge.

- 0|PWA evangelism: "⬇ Install" button added to navbar (before Save field), hidden by default. Shown only when `beforeinstallprompt` fires (Android Chrome); hidden again on `appinstalled`. `EngCalcs.installPWA()` triggers the native install prompt. iOS users see no button (iOS does not fire `beforeinstallprompt`).

- 0|Roadmap reorganized: grouped by theme, priorities differentiated so ties are intentional, descriptions tightened. Completed items moved to ## Completed section per instructions.
