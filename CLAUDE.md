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
| `cs_`  | Canal Seepage & Conveyance Efficiency |
| `ip_`  | Irrigation Pressure (main/lateral branch pressure profile, DU estimate & application design) |

New calculators must define a new unique prefix and document it here.

### Concept-level label reuse (item-90 decision, 2026-07-07)

When two calculators need the same concept, **reuse one whole label** rather than re-keying it —
but only reuse **whole labels** (complete noun phrases), never compose a label from fragments at
render time (fragment composition is what broke the original word-level design in gendered /
word-order / RTL languages). Policy:

- **Owner:** the shared concept lives under **one owning calculator's key**; every other page
  borrows it. No neutral prefix. **Incumbency decides the owner** — the key already used by
  materially more pages wins (e.g. `ws_notes_heading`, 10 pages, over `mi_notes`, 2). **Menu order**
  (`lib/Menus.lib.php`) is only the tiebreak when there's no clear incumbent.
- **Wording:** menu order picks *which key survives*; the surviving key's English *value* takes the
  best wording found across the cluster (not automatically the owner's current wording).
- **Loss symbols:** lowercase `h` for loss components (`h_f`, `h_m`, `h_L`; coefficient `k_m`);
  capital `H` reserved for total/gross/net heads. The local-loss term is **"Minor (local) loss"**
  suite-wide (the "(local)" blocks the "smaller loss" mistranslation).
- A shared label translated once must fit its **narrowest** use: column-heading uses put the short
  form in the shared key, long forms in tooltips — never the reverse.

Consolidation is **one full-suite English-only pass** over all calculators (never chunked per
calculator category — a duplicate's two halves live in different categories). Full decision record
and execution backlog: `dev/label-normalization-decision.md`.

### Verdict / check-string convention (item-90 decision, 2026-07-07)

All check/verdict outputs (velocity, regime, loss-sign, head-loss %, …) use one form:

- **Leading verdict glyph, then short text:** `✓` for pass, `⚠` for caution. The glyph is a
  decorative mark — it is international Unicode and RTL-safe, so **never** add a translated marker
  word ("Warning:"/"OK:").
- **The entire verdict string is the `ec-tip` hover/tap target**, with the full explanation in its
  `title` (not just the glyph — a one-character tap target is bad on touch). Short visible text,
  long text in the tooltip (width-is-king).

## Language Keys

All display strings live in `lib/lang.ec.??.php` (27 files: en + 26 non-English). Keys follow the pattern `prefix_description`, e.g. `dw_friction_factor`, `mpf_flow`. Add keys to **all** language files when adding a new calculator — use English text as the fallback where translations aren't available yet.

**`$ec_lang_intent` is off-limits to AI.** This array provides human-authored translation guidance that is interleaved with `$ec_lang` for human review. AI must never add, change, or remove any `$ec_lang_intent` entry without explicit written permission from the human in that conversation.

### `$ec_lang_intent` format: `<intent> | <commentary>`

An intent string has two parts separated by the first pipe (`|`):

- **Left of the pipe — the intent.** A synonymic expansion of *this label's* meaning: a fuller paraphrase, with alternate words in parentheses, that a translator can re-compress in their language. This is the translatable payload. It may freely contain parentheses.
- **Right of the pipe — commentary.** Production/layout notes and disambiguation. **Not** translated; the payload generator strips it. Keep it parsimonious by using the tag vocabulary below rather than prose.

A string with **no pipe** is entirely intent (all existing clean strings stay valid — zero migration).

**Never put commentary in bare parentheses on the intent side** — parentheses are reserved for synonyms and are ambiguous with real content (e.g. `(as in HEC-RAS)`). Commentary always goes behind the pipe.

**Commentary tag vocabulary** (`tag: value`, semicolon-separated for multiples). Tags are shorthand that resolve to the full instruction defined here, so the intent string stays terse (`... | layout: column heading`):

| Tag | Value | Full instruction it stands for |
|-----|-------|-------------------------------|
| `layout` | `column heading` | Renders as a header in a very narrow fixed-width results-table column; keep the term as short as the language allows. |
| `layout` | `unit token` | Renders inside a narrow units selector (dropdown); keep the token as short as the language allows. |
| `avoid` | `<wrong sense>` | This label must NOT be read or translated in the named sense (e.g. `avoid: temporal "sporadic"`). |
| `symbol` | *(flag, no value)* | This label contains a variable symbol; keep every letter and subscript in it exactly as in English in every language, including RTL. Subscripted names (e.g. `q<sub>avg,field</sub>`) are symbols, not words to translate. The specific subscript is read from the label itself, so it need not be repeated in the note. |
| `gloss` | `<term>` | Defer to `glossary.json` term `<term>` for full disambiguation; do not restate it inline. |

Tags may be **flags** (no `:value`, e.g. `symbol`) or `tag: value`. Combine multiple with `; ` (e.g. `symbol; avoid: anatomical "head"`).

**English column-heading abbreviations are not a translation obstacle — verified, not assumed
(2026-07-07).** Before Category 2's wave-1 sprint, `mi_station`="Sta" and `mi_n617`="Comp.<br
/>n" were flagged as English-reform candidates (compressed, hard to translate). Checked against
actual wave-1 output across all 14 anchor languages (Romance, Germanic, Slavic, Turkic): every
language produced its own natural short form with no leftover English and no translator complaint
(`Est.`/`Sta.`/`Prog.`/`Пикет`/`Ст.`/`İst.` for Station; `n compuesto`/`Composto`/`Zus.-ges.
n`/`Составной n`/`Композ. n` for Composite n). Don't re-flag a `layout: column heading` abbreviation
as an English-reform grievance on the strength of it merely looking terse — check whether wave-1
translators actually struggled with it first.

Add new `layout` tokens or tags here (defined once) rather than expanding prose in the data. Example:
```php
$ec_lang_intent['mi_is_bank']='Boundary (divider, edge, break, or bank as in HEC-RAS) between adjacent regions of differing flow, hydraulic radius, and composite n. | layout: column heading';
```

The 26 non-English languages: am, ar, bg, bn, cs, de, es, fa, fr, he, hi, hr, id, it, km, my, ps, pt, ro, ru, sr, sw, tr, uk, ur, zh.

## Translation Sprints

This section is the authoritative home for sprint **mechanics**. The *sequencing* of sprints (when to run which, in what order — the three scenarios and THE SEQUENCING RULE) lives in `dev/translation-process.md`; the dated blow-by-blow history is in `dev/translation-execution-log.md`.

When translating a new calculator's keys into all 26 non-English languages, **spawn one agent per language in parallel** — not one agent for all languages sequentially. Reasons: faster (minutes not hours), better quality (each agent starts with a fresh context focused on one language), and easier to retry a single language if quality is poor.

**REQUIRED: Get explicit user authorization before launching any sprint.** A sprint spawns up to 26 paid agents. The correct pattern is always: propose → confirm → launch. Never infer authorization from a general "proceed" or a question about paths. The user must say something equivalent to "go ahead" or "run it" in response to a specific sprint proposal.

**Pre-sprint checklist (complete before proposing to the user):**
1. Regenerate payloads so the delta count reflects the *current* lang files: `wsl -e php /var/www/cnm/public_html/hawsedc/engcalcs/dev/scripts/generate_translation_payloads.php`. This is the orchestrating AI's job, never the user's — the user must never have to remember to call for it. **Enforcement:** the launcher MUST run `generate_translation_payloads.php --check` immediately before spawning agents; it prints `FRESH`/`STALE` and exits non-zero if any payload is older than its inputs (English source, that lang file, glossary, or the generator itself). A non-zero exit is a hard stop — regenerate, then re-check — so a sprint can never launch on a stale delta.
2. Verify `glossary.json` has `preferred_translation` populated for the calculator prefix's key terms, especially for anchor languages (es, fr, ru, ar). Check `translation_notes` for WMO-verified terms and terms with `$ec_lang_intent` framing requirements.
3. State the delta count and which calculators are affected before asking for authorization.
4. Note any known quality risks (new terms without glossary coverage, intent-guided terms, proper nouns).

**Standard launch pattern:**
1. Tell the user: "Starting N agents, one for each language." (always say this before launching)
2. Spawn all agents in a single message with `run_in_background: true` and `model: "sonnet"` — Sonnet is the default model for translation agents. Haiku is permitted ONLY for batches consisting solely of short labels (≤ ~8 words, no tooltips, no `*_notes_*_def` keys); it is deprecated for everything else.
3. Each agent receives: the payload JSON path, the target lang file path, and full instructions including glossary terms, intent notes, and all translation rules

Always announce the launch count before spawning so the user knows what is happening.

**Model policy** (why Sonnet is the default — evidence: the 2026-07 rc_/ip_ sprint, `dev/translation-audit-rc-ip-2026-07.md`): Haiku mistranslated polysemous words in long prose and produced script contamination, escape leakage, and truncation in low-resource languages even with full glossary + intent injection. So: long strings (`title="..."`, `*_notes_*_def`) → **Sonnet** (1–2 per request) or inline by the orchestrator; low-resource langs (am/km/my/ps) → Sonnet for everything, held at the honest `0.65` QUALITY tier; short-labels-only batches → Haiku acceptable.

**Post-sprint QA (mandatory, in order):**
1. `php dev/scripts/lang_syntax_validate.php --lang=<codes>` — must be clean of escape-leakage,
   tag-imbalance, and foreign-script findings (identical-to-english warnings are advisory).
2. Tag-parity check of the sprinted keys against English (`<sub>/<sup>/<span>` sets must match).
3. Back-translation semantic check — mandatory, no "skip if no key" exception. If
   `ANTHROPIC_API_KEY` is set, run `php dev/scripts/backtranslate_check.php --lang=<code> --prefix=<p>`.
   **If it is not set (the common case here), do NOT log the step as skipped** — the orchestrating AI
   performs the same check inline: for every sprinted key, read the target-language string,
   back-translate it to English independently, and compare against the source meaning (same rigor, no
   billing). Applies retroactively to any wave that was closed without it.

**On retries:** If an agent hits a session limit, retry only that language. If quality issues are found after a sprint (wrong term, missing intent framing), fix the glossary and/or lang file directly — do not re-run the full sprint.

**Native review is real only when feedback actually lands, never as a pending to-do (Tom,
2026-07-12).** "Flagged for native review" describes a state where no native speaker will ever
realistically see the flag or act on it — treating it as an open action item is a pipe dream, not
QA. The honest move is the reverse: don't log languages as "awaiting native review" as if resolution
is coming; instead make the `QUALITY` score in `lib/Language.Settings.php` carry our own best,
current estimate of defect risk for that language, right now, based on what our own passes (agent
self-check, structural QA, holistic Opus pass) actually found or suspect. Native feedback is only
ever real when a file like `dev/Bulgarian-engineer-feedback.md` actually exists — that's a completed
event, not a promise. If a holistic-pass agent surfaces a language-specific concern it can't verify
itself (e.g. a single-example term with no cognate cohort to check against), record the concern in
the execution log so it's visible, but don't invent a "flagged, pending" limbo state or imply future
resolution that isn't scheduled.

**A quality flag with no visible consequence is not honest QA (Tom, 2026-07-08).** The signal
must show up in `lib/Language.Settings.php`'s per-language `QUALITY` value (this app's own weight in
browser Accept-Language negotiation — see the comment at the top of that file), not just live as a
note in `dev/ROADMAP.md`. Tiers, calibrated 2026-07-08 against category 1's audit depth (the deepest
evidence available at any given time — re-calibrate as later categories get equally deep audits):
- `1.0` — English (source).
- `0.95` — a language with an actual **verified native-speaker review on file** (e.g. bg via
  `dev/Bulgarian-engineer-feedback.md`). Do not award this tier on the strength of automated QA alone.
- `0.85` — AI-translated, independently back-translation-checked, and cross-language-consistency-
  checked (the wave-1/wave-2 tier treatment) — real QA, but never confirmed by a native human.
- `0.65` — the low-resource wave-3 tier (am/km/my/ps/sw and any language added to it) — gets *less*
  independent verification than wave-1/2 by design (translating agent's own self-check only, no
  second-agent QA pass) and is where native review is most needed and least available. Do not park
  this tier at parity with reviewed/audited languages just because `lang_syntax_validate.php` is
  clean — syntax cleanliness is not meaning-level confidence.
Update via `php dev/scripts/update_quality_score.php <lang> <quality>`, never by hand-editing the
file. When a language's tier changes (new native review lands, a category-level audit completes),
update the score in the same session as the finding, not as a deferred follow-up.

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
