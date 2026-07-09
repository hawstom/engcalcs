# Translation & Localization SOP

Operational playbook for the three recurring events that touch `lib/lang.ec.??.php`:
**(A) adding a new calculator**, **(B) adding a new language**, and **(C) a periodic deep
language-quality audit** of existing calculators. This doc says *when* to run which process and
in what order. The mechanics each step calls (sprint launch pattern, pre/post-sprint checklist,
intent format, model policy) are the authoritative rules already in `CLAUDE.md` — this doc doesn't
restate them, it sequences them.

This SOP is distilled from the 2026-07 item-85/item-90 project (full-suite key consolidation +
category-by-category re-translation). See `dev/ROADMAP.md` items 85 and 90 for the decision history
if you want the reasoning behind a rule, not just the rule.

## The three background structures everything else hangs on

- **Calculator categories** (grouped by domain, not by language) — used to scope any translation or
  audit pass so it stays a manageable, reviewable chunk:
  1. Open channel: `mtc_`/`mi_`
  2. Weirs & orifices: `ws_`/`wi_`/`or_`/`odt_`
  3. Pipe friction: `dw_`/`hw_`/`mpf_`/`mphl_`
  4. Irrigation & seepage: `cs_`/`irr_`/`ip_`
  5. Micro-hydro: `mhp_`/`rc_`
  6. Shared UI/units: `u_`/`calc_`/`menu_`/`points_`
- **Translation tiers/waves** (grouped by language) — run sequentially within a category, never as
  one all-language blast:
  - **Wave 1 — anchors:** es pt fr it de ro ru uk bg sr hr cs tr id. Cognate clustering (Romance,
    Slavic) lets one glossary/wording decision propagate and be checked side-by-side. This is also
    the last point at which English source wording gets reformed — see below.
  - **Wave 2 — major non-Latin:** zh ar he hi bn fa ur.
  - **Wave 3 — low-resource:** am km my ps sw. Always Sonnet (never Haiku), always flagged for
    native review, always run last so the glossary is as mature as possible.
- **Never say "families"** for calculator groupings — say "calculator categories." Reserve "family"
  for nothing; it was retired 2026-07-07 for ambiguity with language families.

## Scenario A — Adding a new calculator

1. Build the calculator per the steps in `CLAUDE.md` § "How to Add a New Calculator" — new prefix,
   `$arrayInputs`/`$arrayResults`, English keys added to all 27 lang files (English fallback for the
   26 non-English ones), JS logic, menu entry.
2. **Key hygiene before any translation work**: check the new prefix's labels against
   `dev/label-normalization-decision.md`'s ownership policy — does this calculator introduce a
   concept another calculator already owns a label for (e.g. another "minor loss" or "headwater
   elevation")? If so, borrow the existing key; don't mint a duplicate. This is a per-addition
   check, not a full-suite pass — full-suite consolidation (item 90) is Scenario C territory.
3. Add the new prefix to `prefixToTermNames()` in `dev/scripts/generate_translation_payloads.php`
   with its glossary term list, and add any missing terms to `dev/scripts/glossary.json`
   (`terms` array + `translation_notes`, citing WMO/IATE/UNTERM per the bibliography section where
   possible). A brand-new prefix with zero glossary coverage is the #1 cause of inconsistent
   terminology in a later sprint — do this before, not after, translating.
4. Add the new prefix to the "Variable Prefix Convention" table in `CLAUDE.md`.
5. Decide which **calculator category** (above) the new calculator belongs to. If it doesn't fit
   an existing one, that's a Tom decision, not an AI one — ask.
6. Run the category's translation sprint per **Scenario B** below, scoped to just the new keys (the
   rest of the category is presumably already translated) — this is the one case where a
   delta-only sprint, not a complete re-translation, is correct, since there's no legacy content to
   distrust.

## Scenario B — Launching a translation sprint (new language, or new calculator's keys)

This is the mechanical sprint-launch process. Full rules (authorization gate, pre-sprint checklist,
model policy, post-sprint QA chain) are in `CLAUDE.md` § "Translation Sprints" — follow that
section verbatim. Sequence recap:

1. **Pre-sprint checklist** (CLAUDE.md): regenerate payloads, run `--check` for `FRESH`, verify
   glossary coverage for the category's key terms across the target languages, state total-keys vs.
   missing-delta, note quality risks (new terms, intent-guided keys, proper nouns).
2. **Get explicit authorization** — state the launch count before spawning, always. Never infer
   "go ahead" from an unrelated "proceed."
3. **Launch**: one agent per language, single message, `run_in_background: true`, model `sonnet`
   (Haiku only for short-label-only batches — deprecated otherwise). Each agent gets: payload path,
   target lang file path, full instructions (glossary terms + values + notes, relevant
   `$ec_lang_intent` entries, HTML/symbol-preservation rules, any known wrong-sense traps carried
   over from prior audits of related terms in that language family).
4. **Post-sprint QA, in order:**
   - `php dev/scripts/lang_syntax_validate.php --lang=<codes>` — clean of escape-leakage,
     tag-imbalance, foreign-script findings.
   - Tag-parity check (`<sub>/<sup>/<span>` sets match English) for the sprinted keys.
   - `php dev/scripts/backtranslate_check.php --lang=<code> --prefix=<p>` — meaning-level check
     against the English source.
   - **Independent verification of "done" claims** — don't trust an agent's self-report; run the
     structural/tag-parity check yourself after edits land, per the item-85 lesson (a subagent's
     "fixed" is a claim, not a fact).
5. **On quality issues found after the fact**: fix glossary and/or lang file directly; don't re-run
   the whole sprint. **On session-limit failures**: retry only the failed language — but first
   check whether it actually failed with no output. Session-limit errors can fire *after* the
   agent's file edit already landed (it fails on the final report-back step, not the edit itself).
   Before relaunching, run `git status --short` and, for anything already modified, the same
   key-count verification the agent would have run (`missing: []` against the category's English
   key list) — a language that's already 74/75 or 75/75 needs a small targeted fix, not a full
   relaunch. Only relaunch languages with zero file changes.
6. **Native review flag**: am, km, my, ps (and any language without a strong reviewer) always get
   flagged for native-speaker review regardless of how clean the automated QA looks. When native
   feedback arrives (a file under `dev/`, e.g. `dev/Bulgarian-engineer-feedback.md`), apply it to
   the lang file **and** record the verified terms in `glossary.json` citing the feedback file — the
   next sprint must inherit it, not rediscover it.

## Scenario C — Periodic deep language audit

Run this on a calculator category when: (a) it's never had a post-Wave-0/item-90 complete
re-translation, (b) a native reviewer flags a systemic issue that might recur elsewhere (the
Bulgarian "irregular"-as-temporal-sense catch is the template case — it turned out to be a risk
across all Slavic anchor languages, not just Bulgarian), or (c) enough English-source edits have
piled up since the last audit that drift is likely.

Full end-to-end sequence per category (this is what item 85 executed for category 1 and is
executing for category 2 onward):

1. **English-reform gate first, always.** Read the category's English strings fresh; fix
   colloquialisms, stacked modifiers, compressed abbreviations, double negatives (prefer positive
   phrasing — a standing directive) *before* translating anything. Wave 1 (next step) is also
   interactive on this front: anchor-language translators/reviewers surfacing "this doesn't
   translate" is expected and should trigger small English edits, not be worked around with more
   intent notes. **English freezes after wave 1** — waves 2–3 translate against a stable source.
2. **Key consolidation check** (item-90-style): is any label in this category a duplicate of one
   owned by another category? This is inherently cross-cutting — a duplicate's two halves usually
   live in *different* categories — so judgment calls about ownership need visibility across the
   whole suite, not just the category being audited. Don't defer this into the per-category loop
   silently; if you find a cross-category duplicate, say so before merging.
3. **Wave 1** (anchor languages) — **complete re-translation of every key in the category**, not
   the missing-delta. Existing strings predate reform/consolidation passes and are not assumed
   correct even where present. State both numbers (total keys, missing-delta) when proposing the
   sprint so this scope isn't mistaken for "almost done."
4. **Waves 2–3** — complete re-translation, full QA chain, native-review flag per Scenario B.
5. Update `dev/ROADMAP.md` item 85 (or its successor tracking item) with what was done, and update
   `glossary.json` with any new/confirmed terms.

## Standing content rules (apply in all three scenarios)

- **`$ec_lang_intent` is off-limits to AI** without explicit written permission each time — see
  `CLAUDE.md`. Format: `<intent> | <commentary>`, tag vocabulary (`layout`, `avoid`, `symbol`,
  `gloss`) defined once there.
- **Concept-level label reuse**: whole labels only, never fragment composition at render time.
  Owner = incumbency (most pages using the key), menu order is only the tiebreak. See
  `CLAUDE.md` § "Concept-level label reuse."
- **Verdict/check strings**: leading `✓`/`⚠` glyph (untranslated, decorative) + short text; whole
  string is the `.ec-tip` tap target, long explanation lives in `title`.
- **Wrong-sense traps propagate across language families.** When a native reviewer rejects a word
  sense in one language, check the same concept in every cognate/family-mate language in the
  current category before calling the audit done — don't wait for a second complaint.
- **Column-heading vs. tooltip width discipline**: shared label's short form goes in the
  column-heading key, long form in the tooltip — never the reverse (width-is-king).

## Scripts reference

- `dev/scripts/generate_translation_payloads.php` — build per-language JSON payloads;
  `--check` verifies freshness against lang files/glossary/generator (hard gate before any sprint).
- `dev/scripts/lang_syntax_validate.php --lang=<codes>` — escape-leakage / tag-imbalance /
  foreign-script validator.
- `dev/scripts/backtranslate_check.php --lang=<code> --prefix=<p>` — meaning-level spot check
  (needs `ANTHROPIC_API_KEY`).
- `dev/scripts/glossary.json` — term glossary; `prefixToTermNames()` binding lives in
  `generate_translation_payloads.php`, not in the JSON itself.
