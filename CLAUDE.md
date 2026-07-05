# EngCalcs — Architecture & Developer Guide

## What This Is

A PHP/JS suite of hydraulic engineering calculators. 12 calculators, 11 languages. PHP's primary role is delivering multi-linguality — language detection, switching, and injecting localized strings into the rendered HTML. All computation runs client-side in JavaScript. No database, no authentication.

**License:** GNU GPL v3 or later. Copyright 2009 Thomas Gail Haws.

## How to Add a New Calculator

1. Copy an existing calculator file (e.g. `Manning-Pipe-Flow.php`) as your starting point.
2. Choose a short variable prefix (e.g. `hw_` for Hazen-Williams, `dw_` for Darcy-Weisbach — see convention below).
3. Define `$arrayInputs` and `$arrayResults` with your prefix, referencing `$ec_lang['prefix_key']` for labels.
4. Add your language keys to all 11 `lib/lang.ec.??.php` files.
5. Write `EngCalcs.pageCalculator = function(objForm) { ... }` in the `<script>` block at the bottom.
6. Call `echoHeader`, `echoCalculatorForm`, `echoFeedback`, then `echoFooter` — that's the full page structure.
7. Add the new calculator to the menus in `lib/Menus.lib.php`.
8. Include the calculator JS using `filemtime()` for automatic cache-busting — never use a hardcoded `?v=N`:
   ```php
   <script src="/engcalcs/js/my-calc.js?v=<?=filemtime(__DIR__.'/js/my-calc.js')?>"></script>
   ```

## Application Bootstrap

Every page starts with:
```php
require_once('lib/base.inc.php');
```
`base.inc.php` loads config, language, units, menus, and the calculator form library. The global `$ec_lang[]` array holds all localized strings for the current language.

## Variable Prefix Convention

Each calculator owns a short prefix for its language keys and JS variables:

| Prefix | Calculator |
|--------|-----------|
| `dw_`  | Darcy-Weisbach |
| `hw_`  | Hazen-Williams |
| `mpf_` | Manning Pipe Flow |
| `mphl_`| Manning Pipe Head Loss |
| `mtc_` | Manning Trap Channel |
| `wfs_` | Weir Flow Simple |
| `wfi_` | Weir Flow Irregular |
| `or_`  | Orifice Flow |
| `odt_` | Orifice Drain Time |
| `ds_`  | Drip/Sprinkler Application Rate |
| `cs_`  | Canal Seepage & Conveyance Efficiency |
| `ip_`  | Irrigation Pressure (main/lateral branch pressure profile & DU estimate) |

New calculators must define a new unique prefix and document it here.

## Language Keys

All display strings live in `lib/lang.ec.??.php` (27 files: en + 26 non-English). Keys follow the pattern `prefix_description`, e.g. `dw_friction_factor`, `mpf_flow`. Add keys to **all** language files when adding a new calculator — use English text as the fallback where translations aren't available yet.

**`$ec_lang_intent` is off-limits to AI.** This array provides human-authored translation guidance that is interleaved with `$ec_lang` for human review. AI must never add, change, or remove any `$ec_lang_intent` entry without explicit written permission from the human in that conversation.

The 26 non-English languages: am, ar, bg, bn, cs, de, es, fa, fr, he, hi, hr, id, it, km, my, ps, pt, ro, ru, sr, sw, tr, uk, ur, zh.

## Translation Sprints

When translating a new calculator's keys into all 26 non-English languages, **spawn one agent per language in parallel** — not one agent for all languages sequentially. Reasons: faster (minutes not hours), better quality (each agent starts with a fresh context focused on one language), and easier to retry a single language if quality is poor.

**REQUIRED: Get explicit user authorization before launching any sprint.** A sprint spawns up to 26 paid agents. The correct pattern is always: propose → confirm → launch. Never infer authorization from a general "proceed" or a question about paths. The user must say something equivalent to "go ahead" or "run it" in response to a specific sprint proposal.

**Pre-sprint checklist (complete before proposing to the user):**
1. Regenerate payloads so the delta count reflects the *current* lang files: `wsl -e php /var/www/cnm/public_html/hawsedc/engcalcs/dev/scripts/generate_translation_payloads.php`
2. Verify `glossary.json` has `preferred_translation` populated for the calculator prefix's key terms, especially for anchor languages (es, fr, ru, ar). Check `translation_notes` for WMO-verified terms and terms with `$ec_lang_intent` framing requirements.
3. State the delta count and which calculators are affected before asking for authorization.
4. Note any known quality risks (new terms without glossary coverage, intent-guided terms, proper nouns).

**Standard launch pattern:**
1. Tell the user: "Starting N agents, one for each language." (always say this before launching)
2. Spawn all agents in a single message with `run_in_background: true` and `model: "haiku"` — Haiku is the required model for bulk translation agents; glossary and intent injection provide the judgment layer
3. Each agent receives: the payload JSON path, the target lang file path, and full instructions including glossary terms, intent notes, and all translation rules

Always announce the launch count before spawning so the user knows what is happening.

**On retries:** If an agent hits a session limit, retry only that language. If quality issues are found after a sprint (wrong term, missing intent framing), fix the glossary and/or lang file directly — do not re-run the full sprint.

## Unit Sets

Four unit sets let users switch all units at once (`lib/Units.lib.php`):

| Set  | Primary length | Typical use |
|------|---------------|-------------|
| `m`  | meters        | SI metric |
| `mm` | millimeters   | SI metric (small pipes) |
| `ft` | feet          | US customary |
| `in` | inches        | US customary (small pipes) |

Unit conversion factors are stored as "number of that unit per SI unit" — multiply a SI value by the factor to display it, divide to store it.

## Environment / Config

`lib/config.inc.php` reads `APP_ENV` from the environment:
- `APP_ENV=development` → `DEBUG_MODE=true` (shows HTML validator links)
- Anything else → `DEBUG_MODE=false`

Set `APP_ENV=development` in your web server config or a `.env` file for local dev.

## Key Files

| File | Purpose |
|------|---------|
| `lib/base.inc.php` | Master bootstrap — include this and nothing else |
| `lib/config.inc.php` | Global config, DEBUG_MODE |
| `lib/Calculators.lib.php` | `echoCalculatorForm()` and related helpers |
| `js/Calculators.lib.js` | Client-side calculation engine, unit conversion, form wiring |
| `js/Manning.lib.js` | Shared JS for Manning/irregular geometry and sketch rendering |
| `lib/Menus.lib.php` | `echoMainMenu()`, `echoHeader()`, `echoFooter()` |
| `lib/Units.lib.php` | Unit sets and conversion factors |
| `lib/Language.lib.php` | Language detection and switching |
| `lib/lang.ec.??.php` | Localized string arrays (11 languages) |
| `js/Cookies.lib.js` | Cookie persistence for user unit/language prefs |
| `css/engcalcs.css` | App-wide styles |

## Dev Folder

Non-web files live in `dev/` (blocked from web access via `dev/.htaccess`):

| Path | Purpose |
|------|---------|
| `dev/ROADMAP.md` | Prioritized improvement roadmap |
| `dev/cross-platform-planning.md` | CC/CP collaboration conventions |
| `dev/scripts/` | CLI tools: parity checker, scaffold, translation driver, etc. |
| `dev/translation_payloads/` | Per-language JSON payloads for translation sprints |
| `dev/scripts/glossary.json` | Engineering term glossary for translation prompts |

**Note for scripts:** paths to `lib/` inside `dev/scripts/*.php` use `__DIR__ . '/../../lib'` (two levels up from `dev/scripts/`).
