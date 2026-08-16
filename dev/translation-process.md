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
  - **THE WAVE LISTS ARE NOT A PRIORITY ORDER, and in maintenance the COVERAGE CROSS supersedes
    them (2026-08-05).** They are the *cognate-clustering recipe* for a genuinely new batch of
    languages, and that build-out is complete. Read as priority they are now stale: wave 1 would
    sequence ru, uk, bg, sr, hr, cs and id — all at 0–1 confirmed humans — ahead of zh (12) and
    he (10), which sit in wave 2. The operative priority set is the Task 203 cross's core languages
    **es, pt, fr, tr**, which are exactly the measured top four in order. Do not renumber the waves
    to "fix" this; the lists still say something true about how to cluster a batch.
  - **The GLOSSARY ANCHORS are a different list, and they are now `es`, `pt`, `fr`, `tr`**
    (2026-08-16, ROADMAP Task 214, declared in `glossary.json` `meta.anchor_languages`). They were
    es, fr, ru, ar; `ru` had one measured human and `ar` had zero, and an anchor is the language
    other renderings get *checked against*, so two of the four could not be observed at all. This
    is only about reference points — ru and ar translation quality stays fully in scope, since for
    languages that size zero reach is a discovery gap, not low value. Do not confuse this list
    with the "Wave 1 — anchors" cognate cluster above; that one is a retired build-out device.
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
- **THE COVERAGE MATRIX (adopted 2026-08-05; ROADMAP Tasks 203/204)** — the declaration of *which
  cells we intend to translate at all*, in `dev/scripts/translation_coverage.json`, read by all four
  counting scripts via `dev/scripts/coverage.inc.php`.
  - **The rule:** a (calculator × language) cell is in scope **iff the calculator is core OR the
    language is core**. Core calculators `mpf`, `mtc`; core languages `es`, `pt`, `fr`, `tr`.
  - **The OR is the whole point.** Every language gets the core calculators; every calculator gets
    the core languages. It is a **cross**, not an intersection.
  - **Identity strings — menu entry, `<title>`, `*_main_desc` — are never out of scope**, in any
    calculator, in any language. That is what keeps an out-of-scope cell discoverable in its own
    language, and it is how a cell earns its way in. It is also the mechanism behind the standing
    "zero reach ≠ low value" rule above: the door has to be visible before anyone can walk through it.
  - **It deletes nothing.** Every cell except `lpn_` was already translated when this was adopted,
    and stays translated and maintained. Scope is consulted only about a **gap**. The matrix governs
    new calculators, drift spend, and future audit passes — never removal of work already paid for.
  - **It is not the exempt list and must never be merged with it.** *exempt* = identical to English
    is permanently correct (the key is finished); *out of scope* = not translated yet, by decision
    (the key is not started). Merging them restores the permanent floor Task 161 removed.
  - **Live consequence:** `lpn_`'s sprint (ROADMAP Task 146.06) is `lpn_` × es, pt, fr, tr — 205
    keys × 4 languages — plus its 3 identity strings in the other 22. Not a 26-agent sprint.
  - `php dev/scripts/coverage_selftest.php` asserts all of the above against the real declaration.

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
   `$ec_lang_syn` entries, HTML/symbol-preservation rules, any known wrong-sense traps carried
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
across all Slavic wave-1 languages, not just Bulgarian), or (c) enough English-source edits have
piled up since the last audit that drift is likely.

Full end-to-end sequence per category (this is what item 85 executed for category 1 and is
executing for category 2 onward):

1. **English-reform gate first, always.** Read the category's English strings fresh; fix
   colloquialisms, stacked modifiers, compressed abbreviations, double negatives (prefer positive
   phrasing — a standing directive) *before* translating anything. Wave 1 (next step) is also
   interactive on this front: wave-1 translators/reviewers surfacing "this doesn't
   translate" is expected and should trigger small English edits, not be worked around with more
   intent notes. **English freezes after wave 1** — waves 2–3 translate against a stable source.
2. **Key consolidation check** (item-90-style): is any label in this category a duplicate of one
   owned by another category? This is inherently cross-cutting — a duplicate's two halves usually
   live in *different* categories — so judgment calls about ownership need visibility across the
   whole suite, not just the category being audited. Don't defer this into the per-category loop
   silently; if you find a cross-category duplicate, say so before merging.
3. **Wave 1** (the wave-1 cognate cluster) — **complete re-translation of every key in the category**, not
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

- **`$ec_lang_syn` is off-limits to AI** without explicit written permission each time — see
  `CLAUDE.md`. Format: `<intent> | <commentary>`, tag vocabulary (`layout`, `avoid`, `symbol`,
  `gloss`) defined once there. **No standing carve-outs** — Task 132's intent-trimming
  pre-authorization was retired 2026-08-08. Working pattern: AI proposes a diff, human approves,
  then AI writes.
- **Intent's payload is SYNONYMS, and it applies to plain labels too.** The left-of-pipe is
  alternate wordings a translator can re-compress in their own language. Two former rules are
  retired (2026-08-08): "intent is reserved for jargon/transliteration risk", and "adding an intent
  to a plain label is itself a defect". They made every *plain* label ineligible for the one channel
  that would have helped — and the `lpn_` sprint's three worst labels ("Zoom to fit", "Map display
  and sizes", "Restore defaults") were all plain English.
- **Routing — does an English reader also stumble?** Yes → fix the English (one edit, all 27
  languages). No, but a translator can't recover the concept from the words → `$ec_lang_syn`
  synonyms. Recurs across labels/calculators → `glossary.json`. Never duplicate the same fact across
  two channels; a weight-flavored/standard term a culture actually uses is correct — `avoid` forbids
  only physical errors and lazy transliterations, never a genuine local standard, and **`avoid` is
  never a substitute for saying plainly what the label means**. See `CLAUDE.md` § "Routing rule".
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

## The suggestion box — paste this into EVERY translation agent prompt

Every translator, every wave, every language, every batch size. Not optional, not Wave-1-only.
Tom, 2026-08-08: *"**Every translator** needs a suggestion box, an ombudsman, and a place to file
grievances about the working conditions."* Copy the block below verbatim into the agent prompt:

```
## Suggestion box — file a grievance about the English

If any English string made you guess, file it. You are the only person who will ever
notice, and a string that made you guess will make the next 25 translators guess too.

File an entry when: the English has more than one plausible reading; a verb or adjective
has no stated object; a word's intended sense is not its most common sense; a term maps
onto a dangerous second sense in your language; a claim in the text looks false or stale;
or the tooling handed you a preferred_translation that is wrong for the context.

Report them in your final message as a JSON array, separate from your prose:

FRICTION: [
  {"key": "<lang key>", "complaint": "<what made you guess, in one sentence>",
   "readings": ["<reading you chose>", "<reading you rejected>"]}
]

An empty array is a fine and useful answer. Do NOT invent entries -- a false one costs a
human's attention. But do not stay quiet to be agreeable either: this channel exists
because real complaints were previously buried in prose and never acted on.
```

The orchestrator collects these into `dev/english-friction/<sprint>.json`, routes each with the
English/intent/glossary rule, and `php dev/scripts/friction_check.php --sprint=<id>` must exit 0
before the sprint closes. **Nothing is dismissed silently** — an entry closes with a written reason
or escalates as `refer-to-human` and stays open. See `dev/english-friction/README.md`.

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
  `--check` verifies freshness against lang files/glossary/exempt list/coverage declaration/generator
  (hard gate before any sprint).
- `dev/scripts/translation_coverage.json` + `coverage.inc.php` — the (calculator × language) coverage
  declaration (see above). `coverage_selftest.php` asserts the cross, the identity floor, and the
  exempt/out-of-scope separation; run it after editing the JSON.
- `dev/scripts/lang_parity_check.php` and `translation_completion_matrix.php` — both take
  `--ignore-coverage` for the raw full-parity view, which is how to cost promoting a cell to core.
- `dev/scripts/lang_syntax_validate.php --lang=<codes>` — escape-leakage / tag-imbalance /
  foreign-script validator.
- `dev/scripts/backtranslate_check.php --lang=<code> --prefix=<p>` — meaning-level spot check
  (needs `ANTHROPIC_API_KEY`).
- `dev/scripts/glossary.json` — term glossary; `prefixToTermNames()` binding lives in
  `generate_translation_payloads.php`, not in the JSON itself.


---

# Sprint mechanics (moved from CLAUDE.md, 2026-08-16)

`CLAUDE.md` keeps only the hard gates: authorization, Sonnet-only, announce the count,
and the three scripts that must exit 0. The full procedure is here.

Sprint **mechanics** live here. Sprint **sequencing** is in `dev/translation-process.md`; dated
history is in `dev/translation-execution-log.md`.

**Spawn one agent per language in parallel**, not one agent for all languages sequentially. Faster,
better quality (fresh context per language), and a single language can be retried.

**REQUIRED: explicit user authorization before launching any sprint.** A sprint spawns up to 26 paid
agents. Always propose → confirm → launch. Never infer authorization from a general "proceed" or a
question about paths.

### Pre-sprint checklist (complete before proposing)

0. **Wave 0, mechanized: the adversarial English pass.** One agent, English only, over the new and
   changed strings. It does **not** ask "is this string good?" — a fluent English reader answers yes
   to almost everything, which is why one Wave 0 that reviewed 226 keys and rewrote 51 still shipped
   "Zoom to fit" and "Restore defaults". It asks **"list every plausible reading of this string; if
   there is more than one, propose a rewrite."** Falsification, not review. Findings go to
   `dev/english-friction/<sprint>.json` and route through the English/synonym/glossary rule above.
   **`php dev/scripts/friction_check.php --sprint=<id>` must exit 0.**
1. **`php dev/scripts/gloss_ref_check.php` must exit 0.**
2. **Regenerate payloads** so the delta reflects current lang files:
   `php dev/scripts/generate_translation_payloads.php`. **This is the orchestrating AI's job, never
   the user's.** The launcher must then run `--check` immediately before spawning; it prints
   `FRESH`/`STALE` and exits non-zero if any payload is older than its inputs. **A non-zero exit is a
   hard stop.**
3. **Verify `glossary.json` has `preferred_translation` populated** for the prefix's key terms,
   especially for the anchor languages.
4. **State the delta count and which calculators are affected** before asking for authorization.
   **Delta zero means zero:** keys correctly byte-identical to English (symbols, eponyms, brand names,
   cognates) live in `dev/scripts/translation_exempt_keys.json` and are not counted, though they are
   still reported when missing or blank. Four scripts read that one list via `exempt_keys.inc.php`,
   so a disagreement between their counts is a bug. **Add a key there only when identical-to-English
   is permanently correct** — never to quiet a number you don't want to fix.
5. **Note known quality risks** (new terms without glossary coverage, proper nouns).
6. **Check for stale-but-present drift the delta cannot see:**
   `php dev/scripts/detect_english_drift.php`. The delta finds only *missing* keys; this flags keys
   whose *English changed* after a translation was written. `--json` emits the resync list.

**Anchor languages are declared in `glossary.json`'s `meta.anchor_languages` — read that, not this
line.** They are `es, pt, fr, tr`: the Task 203 core languages and the measured top four by confirmed
human reach (es 186, pt 30, fr 23, tr 17). They replaced `es, fr, ru, ar` because an anchor is a
reference point other renderings get checked against, and `ru` (1 measured human) and `ar` (0) cannot
be observed. **This is about reference points only** — ru and ar translation quality stays fully in
scope, and the standing "zero reach ≠ low value" rule holds; for a large language, zero reach is a
discovery/SEO gap. Note `glossary.json`'s anchor list is distinct from the "Wave 1 — anchors" cognate
cluster in `dev/translation-process.md`.

### The coverage declaration: what we intend to translate

`dev/scripts/translation_coverage.json`, read by four scripts via `coverage.inc.php`. It answers a
different question from the exempt list, and **the two must never be merged**:

- **exempt** — identical to English is *permanently correct*. The key is **finished**.
- **out of scope** — a (calculator × language) cell we have decided not to translate yet. The key is
  **not started**, and the cell can earn its way in at any time.

Using the exempt list for an out-of-scope body is forbidden: it would put a permanent floor back
under every outstanding-keys number.

**The rule, entire: a cell is in scope iff the calculator is core OR the language is core.** That OR
makes it a **cross** — every language gets the core calculators, every calculator gets the core
languages. An AND would leave Manning Pipe Flow untranslated in 22 languages.

- **Core calculators: `mpf`, `mtc`, `lpn`. Core languages: `es`, `pt`, `fr`, `tr`.** Roughly a
  quarter of the cells and 98.2% of measured use. Adding a core *language* costs `16 − N` cells;
  adding a core *calculator* costs a full 26 — which is why the frontier prefers languages.
- **Identity strings are the floor and are never out of scope** — menu entry, `<title>`,
  `*_main_desc`, every calculator, every language. A cell outside the cross means "body in English,
  findable in the local language," which is what lets it earn its way in.
- **Scope is consulted only about a GAP.** An already-translated key in an out-of-scope cell stays
  translated and stays maintained. Nothing is ever deleted for being out of scope.
- **A prefix not listed in `calculator_prefixes` is suite chrome and is always in scope**, so an
  unclassified new prefix gets translated — the safe direction.
- `--ignore-coverage` restores the raw full-parity view, which is how to ask "what would promoting
  this cell cost?"
- `php dev/scripts/coverage_selftest.php` asserts the cross, the floor, and the separation.

### Launch

1. **Announce the count before spawning**: "Starting N agents, one for each language."
2. Spawn all agents in a single message with `run_in_background: true` and `model: "sonnet"`.
3. Each agent receives: the payload JSON path, the target lang file path, and full instructions
   including glossary terms, synonym notes, and all translation rules.

**Model policy: Sonnet is mandatory for every translation agent, every batch size, every language, no
exceptions. Haiku is fully deprecated for translation.** Evidence
(`dev/translation-audit-rc-ip-2026-07.md`): Haiku mistranslated polysemous words in long prose and
produced script contamination, escape leakage and truncation in low-resource languages even with full
glossary and synonym injection. The former "short labels only" carve-out is **removed** — a wrong
word in a 3-word label is just as wrong, and a standing exception is an easy trap to fall back into.

**Every agent writes in ~50-key batches, saving each batch before translating the next. Mandatory,
and it goes in the prompt.** A sprint can be killed at any moment by an account session limit nobody
can see coming. An agent that composed everything in memory loses all of it; one that has been
appending keeps what is on disk. Cost is ~10% of an agent's tokens, all tool-call overhead.

**Batching is the throttle that works; the wave split is retired.** Splitting into waves of 5 did not
prevent a limit (a later wave hit one anyway) and cost a verify/commit/report boundary each time — it
buys probability, not protection. Batched appends bounded the damage instead: two languages each had
100 keys safely on disk when a wave died. **Launch every language at once and rely on batching.** If
a future sprint loses a whole language's work despite batching, that is new evidence — reopen the
question then, and change one mechanism at a time.

**HARD CONCURRENCY CAP: the harness allows 20 concurrent subagents** unless
`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` is raised; the 21st call fails with "Concurrent subagent limit
reached." A 26-language sprint therefore launches 20 immediately and queues 6, which the orchestrator
starts as slots free. **This is a platform queue, not the retired wave split** — nobody waits for a
boundary. **Say so in the proposal**: "26 agents, 20 at once and 6 as slots free."

**Do not bundle an unauthorized mechanism into an authorized one.** Two mechanisms introduced in one
sprint confound the experiment and neither can be judged. Propose each on its own.

**Every translation agent gets a suggestion box, and it is part of its prompt.** Every agent must be
asked to **file structured entries for any English string it had to guess at**; the orchestrator
writes them into `dev/english-friction/<sprint>.json`. Structured, not prose — agents do volunteer
real findings, and a paragraph at the end of a report is not a queue. **Nothing is dismissed
silently:** an entry closes as `english`, `intent`, `glossary` or `dismissed` *with a reason*, or it
escalates as `refer-to-human` and stays open until the human rules.

### Post-sprint QA (mandatory, in order)

0. **`php dev/scripts/friction_check.php --sprint=<id>` must exit 0** — every translator complaint
   answered, every escalation ruled on. A sprint is not closed while an entry is `open` or
   `refer-to-human`.
1. **`php dev/scripts/lang_syntax_validate.php --lang=<codes>`** — clean of escape leakage, tag
   imbalance and foreign-script findings.
2. **Tag-parity check** of the sprinted keys against English (`<sub>/<sup>/<span>` sets must match).
3. **Back-translation semantic check — mandatory, no "skip if no key" exception.** With
   `ANTHROPIC_API_KEY`, run `backtranslate_check.php`. Without it (the common case), the
   orchestrating AI performs the same check inline, at the same rigor.

   **AND COMPARE THE LANGUAGES WITH EACH OTHER, not only each against the English.** This is the step
   that reads the English. Cluster the renderings of one key by MEANING. If they agree, the English
   licensed one reading. **If they SPLIT, the English licensed two, and the split is the finding** —
   no single translation looks wrong on its own, and the English reads perfectly to an English
   reader, which is exactly why nothing else catches it.

   *Worked example:* "Own values" — the count of properties a scenario holds of its own — came back
   as *its own* (13 languages), *custom/specific/exclusive* (7), and **CHANGED** (cs, hr, bg). The
   first two are the same concept; the third is false, because a scenario's own value may be
   identical to Base's. All three outliers had been forced off the literal calque by an unrelated
   collision (in most European languages "own values" *is* the term for eigenvalues). **Being forced
   off a calque forces a translator to choose a READING, so divergence in those forced choices
   measures how many readings the source has.** A language that can calque never has to decide and
   tells you nothing — so the languages that had to work hardest are the most informative, and a
   term-centric sweep should read them first.
4. **Glossary write-back — mandatory, not optional, no "later" exception.** Any confirmed terminology
   decision this sprint produced — a wrong-term fix, a cross-key drift resolved, a new concept
   translated for the first time — gets written into `glossary.json` (`translations[lang]` plus a
   dated `translation_notes` entry) **before the sprint is considered closed.** This applies
   identically to consistency-audit stages. Five audit stages once closed with zero write-back, so
   every stage re-derived the same terminology judgments from scratch. A populated entry turns a
   "re-read every sibling key and infer consistency" task into a one-line lookup for the next agent,
   in the next category, in the next language pass.
5. **`php dev/scripts/detect_english_drift.php --baseline-new`** — a sprint is not finished until you
   run it. A key added and translated by a sprint stays `NEW` forever otherwise, because only
   `--update` could baseline it and `--update` is refused while any drift is open. That deadlock made
   a later English edit to such a key invisible to **both** tools at once: the payload delta sees a
   translated key and reports zero, and the drift report files it under NEW rather than CHANGED. A
   demonstrated case produced a delta of zero and no CHANGED flag with 26 stale translations behind
   it. Use `--except=k1,k2` to hold back any key whose English you edited *after* the sprint;
   baselining one you have since edited buries the staleness.

**On retries:** if an agent hits a session limit, retry only that language — but **check
`git status` first**, since a session-limit error can fire after the edit already landed. If quality
issues are found later, fix the glossary and/or lang file directly; do not re-run the full sprint.

### Quality scores are honest estimates, not aspirations

`QUALITY` in `lib/Language.Settings.php` is this app's own weight in browser Accept-Language
negotiation, and it must carry our best current estimate of defect risk. Update via
`php dev/scripts/update_quality_score.php <lang> <quality>`, never by hand, in the same session as
the finding.

| Score | Tier |
|---|---|
| `1.0` | English (source) |
| `0.95` | A **verified native-speaker review on file** (e.g. `dev/Bulgarian-engineer-feedback.md`). Never awarded on automated QA alone. |
| `0.85` | AI-translated, independently back-translation-checked and cross-language-consistency-checked. Real QA, never confirmed by a native human. |
| `0.65` | The low-resource tier (am/km/my/ps/sw). Gets *less* independent verification by design — the translating agent's own self-check only. Syntax cleanliness is not meaning-level confidence. |

**Never log a language as "awaiting native review" as if resolution is coming.** No native speaker
will realistically see such a flag. Native feedback is real only when a feedback file actually exists
— that is a completed event, not a promise. If a holistic pass surfaces a concern it cannot verify,
record it in the execution log; do not invent a "flagged, pending" limbo state.

**In the 0.65 languages, engineering happens in English and the local tongue is a field register.**
Aim for descriptive rendering, not standard-matching.

---
