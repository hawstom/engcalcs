# Translation & Localization SOP

Operational playbook for the three recurring events that touch `lib/lang.ec.??.php`:
**(A) adding a new calculator**, **(B) adding a new language**, and **(C) a periodic deep
language-quality audit** of existing calculators. This doc says *when* to run which process and
in what order. The mechanics each step calls (sprint launch pattern, pre/post-sprint checklist,
intent format, model policy) are the authoritative rules already in `CLAUDE.md` — this doc doesn't
restate them, it sequences them.

This SOP is distilled from the 2026-07 item-85/item-90 project (full-suite key consolidation +
category-by-category re-translation). For the reasoning behind a rule (not just the rule), see
`dev/translation-execution-log.md` — the dated, category-by-category record — plus item 90's entry
in `dev/ROADMAP.md`'s Completed section for the key-consolidation decisions.

## What Tom said → which scenario (routing table)

Tom will name the event in plain language; pick the scenario from it. **Whatever the trigger, the
sequence is always propose (scope + agent/language counts + what it costs) → get explicit
authorization → launch.** Never auto-run a paid sprint off the trigger phrase alone.

| Tom says something like… | Scenario | Weight |
|---|---|---|
| "We've **added/changed** calculator X — propagate it to all languages using our translation SOP." | **A** (→ B, scoped to just the new/changed keys) | **Light: delta only.** Translate just the new or edited keys. **Not** a full re-translation — new keys have no legacy content to distrust (Scenario A step 6). Audit only if the change reworded *many existing* keys enough to risk drift (then it tips into C). |
| "Add **language** X." | **B** (whole suite into the new language) | Medium: one full pass of every key, wave order still applies. |
| "**Audit** category N" / "the X translations feel stale" / a native reviewer flags a systemic issue. | **C** | Heavy: for existing legacy content. See the economy note in Scenario C before assuming a full re-translation is the right size. |

So Tom's standing one-liner — *"We've added/changed X. Propagate it to all languages using our
translation SOP."* — always means **Scenario A, delta sprint**, then a proposal back to him with
counts before anything paid launches.

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
  - **Wave 3 — low-resource:** am km my ps sw. Always Sonnet, always flagged for
    native review, always run last so the glossary is as mature as possible.
- **THE SEQUENCING RULE (build-phase only — Tom, 2026-07-21):** finish **all three
  waves of a calculator category — plus that category's holistic Opus consistency pass — before
  starting the next category.** Never interleave categories. (This was violated once, 2026-07-07,
  when category 2's wave 1 ran before category 1's waves 2–3; the correction cost a re-sequencing.
  See the execution log if you want the incident.) **Scope of this rule:** it governs the *initial
  build-out* — translating a genuinely new calculator into languages for the first time, where
  cognate-clustering is a real quality lever. That build-out is now complete (all 12 calculators ×
  26 languages exist). **In maintenance** — targeted resyncs (Scenario C), term-centric sweeps
  (Scenario D), defect fixes — do **not** re-impose category sequencing; those tasks are
  cross-category or orphan-key by nature (e.g. an English-source drift spanning `ip_` + `mhp_`, or
  an `odt_` fix that fits no category). Fix the **term or the defect**, reach-weighted, across
  whatever calculators it touches.
- **REACH-WEIGHTED QA (maintenance default — Tom, 2026-07-21):** actual human reach is wildly
  uneven (en ~83%, es ~10%, then a long ≤1% tail). Two consequences: (1) **es is the standing
  spot-check target** for every maintenance change — after English, a wrong string costs most in
  Spanish; never ship a maintenance edit without eyeballing its es rendering. (2) **Zero *current*
  reach ≠ low value.** Big languages with no measured reach yet (ru, it, bn, id, ur, cs, sr) are a
  *discovery/SEO* gap, not a quality signal — es at 10% proves the door opens when identity strings
  are discoverable. Do not deprioritize their translation quality on reach grounds; that's what the
  wave-3 *low-resource* tier (am/km/my/ps/sw — small community **and** near-zero reach) is for.
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
   (mandatory, no exceptions — Haiku is fully deprecated for translation, see CLAUDE.md § "Translation
   Sprints" Model policy, 2026-07-12). Each agent gets: payload path,
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
6. **Quality tier, not a "pending native review" flag** (Tom, 2026-07-12): am, km, my, ps, sw stay
   at the honest `0.65` QUALITY tier regardless of how clean automated QA looks — real native review
   essentially never arrives for these, so don't log them as "awaiting" it as if resolution is
   scheduled. When native feedback *does* actually land (a file under `dev/`, e.g.
   `dev/Bulgarian-engineer-feedback.md` — a completed event, not a hoped-for one), apply it to the
   lang file, record the verified terms in `glossary.json` citing the feedback file, and raise that
   language's QUALITY tier to reflect it.

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

**Cost-scoping note (from the 2026-07 project — "be scientific about cost," Tom).** The QA layers
(back-translation, tag-parity, holistic pass) are *not* the lever to cut for cost — measured yield
varied wildly between categories using an identical QA process, and the difference tracked how
stale each category's legacy translations were, not the QA. The real cost driver is re-translating
already-decent content wholesale. So the targeted optimization is **up front**: gauge a category's
existing translation quality *before* committing to a full re-translation wave, and scope the wave
to what is actually stale. A complete re-translation is the safe default for legacy content of
unknown vintage; it is not automatically the cheapest path once a category has already been
audited.

**How to run an *economical* audit (cheapest first).** An audit is only open-ended if it's
unscoped. Keep it economical by fixing two dials: **scope** (one category, never "the whole suite")
and **depth** (pick from the ladder below, start low). The right default answer to "give me an
economical audit" is: **the AI reads the target category first (cheap, read-only) and proposes the
lowest rung that covers the risk**, rather than defaulting to a full re-translation.

1. **Read-only assessment** — one agent (or the orchestrator) skims one category across all 26
   languages and reports staleness/defect signals. No file writes, no paid per-language sprint.
   This is the "gauge before committing" step and is often all that's needed to decide.
2. **Holistic consistency pass** — one Opus agent reads that category's keys side-by-side across all
   26 languages, findings-only; the orchestrator applies fixes directly. Catches cross-language
   drift, baked verdict glyphs, term-splitting. One agent, not 26 — the cheapest real audit.
3. **Back-translation QA pass** — per-language meaning check (findings-only, fix directly, no
   re-sprint). More thorough than #2 on single-string mistranslations; costs one read per language.
4. **Full Scenario C re-translation** — the 3-wave complete re-translation above. The most expensive
   rung; reserve it for genuinely stale legacy content that #1 shows is beyond patching.

So the economical request is *scoped and depth-aware*: **"Audit category N — assess it read-only
first, then propose the lightest pass that covers the risk, with counts."** That routes to rung 1,
then lets the evidence pick the rest. "Audit everything thoroughly" is the anti-pattern — unscoped
and forced to the top rung.

## Scenario D — Term-centric sweep (organize around a term, not a category)

Tom's preference (2026-07-20): for a *terminology* problem — one hard/polysemous/units-trap term that
keeps getting mistranslated across many calculators — sweep the **term**, not the calculator category.
A calculator-centric audit re-derives the same term in every category it touches; a term-centric sweep
fixes every occurrence together and consistently in one pass, and is cheap to re-run.

The enabling artifact is the **trap-term watchlist**, a *derived* view of `glossary.json` — a term is
on the watchlist exactly when its entry has a non-empty `"avoid"` array (never a second hand-list).
Dump it with `php dev/scripts/list_trap_terms.php` (add `--lang=<code>` for one language's established
terms, `--json` for machine form). That output is what a high-power agent is handed.

Sequence:
1. Pick a term (or trap cluster). Run `list_trap_terms.php` to get its `avoid` senses + per-language
   established translations from the glossary.
2. Gather **every** `$ec_lang` key across **all** calculators whose value contains the term
   (`grep`), regardless of category — this is the slice to fix.
3. Fix in all 26 languages with the glossary root entry + `avoid` guard injected (the payload
   generator already emits the `DO NOT render as:` line). Sonnet per language, standard QA chain.
4. Glossary write-back is mandatory (per CLAUDE.md) — confirm/repair each language's established term.

Like the other scenarios, launching the paid multi-agent run needs explicit authorization; the
read-only watchlist dump and grep-slice are free and can be done any time.

## Standing content rules (apply in all three scenarios)

- **`$ec_lang_intent` is off-limits to AI** without explicit written permission each time — see
  `CLAUDE.md`. Format: `<intent> | <commentary>`, tag vocabulary (`layout`, `avoid`, `symbol`,
  `gloss`) defined once there. (One standing carve-out: the bounded intent-trimming of ROADMAP
  Task 132.)
- **Division of labor — concept → glossary; label metadata → intent (pointing via `gloss:`);
  user-facing definition → visible tip.** Never duplicate the same fact across two channels; a
  weight-flavored/standard term a culture actually uses is correct — `avoid` forbids only physical
  errors and lazy transliterations, never a genuine local standard. See `CLAUDE.md` § "Division of
  labor" and § "Polysemy / units-trap protocol."
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

## English-drift tripwire (staleness detection)

**The gap it closes:** the payload-delta only sees *missing* keys, so a key whose English was
**changed** after a translation was written is invisible to it — the translation is present but now
renders obsolete English. That "stale-but-present" pattern caused Task 129 and forced Tasks
129/130/131 to run off hand-built key lists. `detect_english_drift.php` turns that lucky-catch into a
standing tripwire.

- **How:** a checked-in manifest (`dev/scripts/english_string_hashes.json`) holds the sha1 of every
  `lang.ec.en.php` `$ec_lang` value *as of the last full sync*. A current-vs-manifest mismatch flags
  that key `CHANGED` = translations may be stale.
- **When to run it:** any time you edit English `$ec_lang` values (English-reform passes, label
  consolidation, wording fixes) — and as a cheap standing check before proposing any sprint. It is the
  auto-generated replacement for the hand-built resync key list.
- **Workflow:**
  1. `php dev/scripts/detect_english_drift.php` — human report of drifted keys.
  2. `php dev/scripts/detect_english_drift.php --json` — bare `CHANGED` key list → feeds a
     **Scenario D-style** resync (semantic per-language read vs current English; only drifted
     languages get rewritten, as in Task 129).
  3. After the resync brings every language into sync: `php dev/scripts/detect_english_drift.php
     --update` to re-baseline the manifest. **Only `--update` once the resync is actually done**, or
     you silently baseline away real drift.
- **`--check`** exits non-zero if any key is `CHANGED` (gate/CI use). `NEW`/`REMOVED` keys are
  informational only (NEW is already handled by the payload-delta).

## Scripts reference

- `dev/scripts/detect_english_drift.php` — English-source staleness tripwire (see section above);
  `--check` gates on any CHANGED key, `--json` emits the resync key list, `--update` re-baselines
  `english_string_hashes.json`.
- `dev/scripts/generate_translation_payloads.php` — build per-language JSON payloads;
  `--check` verifies freshness against lang files/glossary/generator (hard gate before any sprint).
- `dev/scripts/lang_syntax_validate.php --lang=<codes>` — escape-leakage / tag-imbalance /
  foreign-script validator.
- `dev/scripts/backtranslate_check.php --lang=<code> --prefix=<p>` — meaning-level spot check
  (needs `ANTHROPIC_API_KEY`).
- `dev/scripts/glossary.json` — term glossary; `prefixToTermNames()` binding lives in
  `generate_translation_payloads.php`, not in the JSON itself.
