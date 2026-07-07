# Concept-Level Label Normalization — Architecture Decision

**Roadmap item 90 (Opus/Tom half).** Decided 2026-07-07 by Tom + Opus, on the input of the
Fable survey (`dev/label-normalization-survey.md`). This file is the durable decision record;
the survey is the evidence, this is the ruling. Execution is **one full-suite English-only pass**
(item 90, Opus), decoupled from item 85's translation work — see D6 (reversed 2026-07-07).

## Context

The suite's original design economized language variables at the **word** level (compose a label
from fragments at render time). That failed in gendered / word-order / RTL languages because
composition needs agreement the fragments don't carry. The reuse *mechanism* already exists and is
safe when what is reused is a **whole label** (noun phrase), never a fragment: pages already borrow
other calculators' keys directly (e.g. `Darcy-Weisbach.php` uses `mpf_flow`, `mphl_pipe_length`).
So this was never a mechanism question — it is an **ownership + wording policy** question. These
are the rulings.

## Decisions

### D1 — Ownership: incumbency wins; menu order only disambiguates
No neutral/shared prefix (`c_`/`calc_`) is introduced — the overhead of a new prefix is not worth
it. A shared concept lives under **one owning calculator's key**; every other page borrows it.
**Incumbency decides the owner** (Tom, 2026-07-07): when one key is the clear incumbent — the
survivor already used by materially more pages — it wins, even against menu order. Example:
`ws_notes_heading` ("Notes", used by 10 pages) beats `mi_notes` (2 pages) despite `mi_` being
earlier in the menu. **Menu order is only the tiebreaker where there is no clear incumbent** (roughly
equal usage). Menu order as of this decision:

`mpf_ → mphl_ → hw_ → dw_ → mtc_ → mi_ → rc_ → mhp_ → or_ → odt_ → ws_ → wi_ → cs_ → ip_`

### D2 — Wording: menu order picks the key, merit picks the value
Menu order decides **which key survives**. It does **not** dictate the surviving key's English
*value* — that takes the best wording found anywhere in the cluster. Example: for the head-loss
triad `mphl_` owns by menu order *and* already has the cleaner wording ("Friction loss" over mhp's
"Friction head loss"), so no tension; for "Flow" `mpf_` owns and its "Flow, Q" is already the
majority wording, so mhp's "Flow rate, Q" simply loses. Ownership is mechanical; wording is on
merit.

### D3 — Terminology: "Minor (local) loss" is canonical
The head-loss local-loss term is **"Minor (local) loss"** suite-wide. This merges the former
`mphl_` "junction loss" and the `mhp_`/`ip_` "minor loss" wordings. `mphl_total_junction_k` is
renamed to match the minor-loss-coefficient sense. The parenthetical "(local)" is load-bearing: it
blocks the "smaller loss" mistranslation that plain "minor" invites. Recorded in `glossary.json`
(v1.4) on both the `minor loss` and `junction loss` entries ("minor ⇄ local").

### D4 — Loss-component symbols are lowercase
Loss components use lowercase `h`: **`h_f` (friction), `h_m` (minor/local), `h_L` (total)**, with
minor-loss coefficient **`k_m`**. Capital `H` is reserved for total/gross/net heads
(`H_gross`, `H_net`, etc.). This aligns `mphl_`/`ip_` (currently capital) to `mhp_`'s existing
lowercase notes formulas. Recorded in `glossary.json` v1.4 symbol fields.

### D5 — Verdict/check strings: leading glyph + whole-string tooltip
One suite-wide convention for all check/verdict outputs (velocity, regime, loss-sign, head-loss %,
etc.):
- **Leading verdict glyph**, then short text: `✓` for pass, `⚠` for caution. The glyph is a
  *decorative verdict mark* — it is Unicode (`U+2713`/`U+26A0`), international, RTL-safe, and
  carries **no translation payload**, so no translated marker word ("Warning:"/"OK:") is ever
  added.
- The **entire verdict string is the `ec-tip` hover/tap target**, with the full explanation in its
  `title`. This replaces the current pattern in `EngCalcs.writeVelocityCheck()`
  (`js/Calculators.lib.js`) where only the tiny `⚠` glyph is the tooltip trigger — a poor touch
  target. Short visible text + long text in tooltip keeps the width-is-king rule
  (`feedback_results_table_column_width`).
- This makes future calculators' checks a drop-in and lets the duplicated `mtc_`/`mhp_`
  velocity-check block (7 keys) and the four ad-hoc verdict styles collapse to one.

### D8 — Reference-linked labels: symbol link + separate reusable tip (Tom, 2026-07-07)
Some input labels carry an **external reference link** applied in the PHP page (not the lang string)
— it wraps the label in `<a href="…">` (e.g. EPA roughness tables on Darcy-Weisbach/Micro-Hydro `e`;
engineeringtoolbox on Manning `n`, Hazen-Williams `c`). For these, a help tip must **not** nest
inside the anchor (a tap on the `?` would navigate away). Pattern — **two separate affordances:**

- **Linked label** = the bare **symbol only** (e.g. `e`), default HTML anchor styling (blue,
  underlined), **no `?`**. Because it is a bare symbol it becomes a **universal key** (identical in
  all 27 languages, no translation).
- **A separate `?` help tip**, in its **own lang key**, placed **outside** the `</a>`, carrying the
  `ec-tip` tooltip (e.g. title "Darcy-Weisbach roughness"). The `?` disambiguates the bare symbol.
- **The tip key is reusable** across every calculator sharing the concept (one roughness tip for
  dw/mhp/ip; one Manning-`n` tip for mpf/mphl/mtc). Net: verbose per-calculator labels collapse to
  **one symbol key + one shared tip key** — a large key saving.

PHP shape: `<a href="…ref…">{symbol_key}</a> {tip_key}`. This supersedes the earlier "link OR tip,
never both" idea — we keep both, as two distinct elements.

### D6 — Sequencing ~~merge per calculator-family~~ → REVERSED 2026-07-07: one full-suite pass
> **⚠ D6 as originally written was WRONG and is reversed. Superseded text kept struck-through for the record.**
>
> ~~Merges are not a single suite-wide pass. Each family's exact-duplicate + cluster merges are
> executed immediately before that family's Wave 0 / wave-1 sprint under item 85…~~

**Reversal (Tom + Opus, 2026-07-07).** Key consolidation is **inherently cross-cutting** — a
duplicate label's two halves live in *different* calculator categories, so no per-calculator-category
view can make the merge/ownership call (proved same day: open-channel's merge candidates were
shared with weirs, irrigation, and micro-hydro). Chunking consolidation per calculator category
therefore cannot work, and interleaving it with item 85's per-category translation loop is what
poisoned item 85. **Corrected sequencing:**

> **Item 90 = ONE English-only pass over ALL calculators** (Opus), applying D1–D5 across the whole
> suite. It is a prerequisite English-reform step, **decoupled from item 85**. Then Wave 0
> colloquialism cleanup (Fable) → **translation tier/wave 1 (anchors), which is INTERACTIVE** —
> translating into cognate languages is how we still detect garbage in the English, so tier-1 work
> may trigger further English edits (Tom, 2026-07-07) → **English then freezes for tiers/waves 2+**
> → complete re-translation of waves 2–3 → §10.5 source-hash last.

**Freeze is not absolute** (Tom's correction, 2026-07-07): English is frozen only for translation
tiers/waves **2 and later**. **Tier/wave 1 stays interactive** — it is the truest detector of
un-translatable/garbage English, so English keeps changing *through* wave 1 and only freezes after.

The `writeVelocityCheck` mechanism change (D5) is part of this full-suite pass (it touches the
verdict-string block wherever it appears), not tied to any one calculator category.

Terminology note: **"calculator categories"** (the 6 calc groupings) vs **"translation tiers/waves"**
(language groupings) — never bare "families".

### D7 — Merge execution method (per exact-duplicate / cluster group)

A full-suite safety scan (2026-07-07) showed the "exact English duplicate" groups are **not
mechanical**: only 3 of 17 groups have non-English translations that match across all languages —
the other 14 have **divergent** translations (same English, drifted over time). Method:

1. **Owner** = incumbent (D1), else menu order (D1 tiebreak).
2. **Pick the surviving key; delete the redundant one(s); repoint every PHP/JS reference** to the
   survivor.
3. **Extra-meaning check (the `mi_q_617` lesson):** if a redundant key's divergence reflects
   *meaning not present in the survivor's English* (e.g. es/pt's composite-`n` sentence), **capture
   it in the English source first** (tip/intent), then merge.
4. **Divergent translations: capture, don't discard** (Tom, 2026-07-07 — "capture/append/
   concatenate when in doubt, and note for future review"). When a redundant key's translations
   diverge from the survivor's, **record them** (per language) under the survivor in a divergence
   review log (e.g. `dev/merge-divergence-review.md`) so a future translator can choose the best
   wording — do **not** silently drop them. Rationale: some divergences are garbage and some are
   the better rendering; the complete re-translation pass (and tier-1's interactive English
   feedback) will reconcile them, but only if the prior art is preserved for review.
5. **`mtc_note_2_term` stays separate** (Tom, 2026-07-07): although its English "Velocity check"
   matches the `mtc_vel_check` verdict label, it is a notes-glossary *term*, a different concept —
   do not merge it into the verdict group.

## Execution backlog (item 90, full-suite — one pass over all calculators)

**Completion scope (Tom, 2026-07-07): item 90 covers the ENTIRE survey, not just this shortlist.**
The row-by-row checklist and the 5 open wording decisions live in
**`dev/label-normalization-tracker.md`** — that is the completion gate. The 8 items below are the
survey §6 value÷risk shortlist; the tracker is the exhaustive list.

Each is a whole-label merge — never fragment composition (the one fragment idea, EGL/HGL from
`ip_group_*`, is explicitly rejected; keep those as whole strings). Apply D7 to every group.

1. **Exact duplicates** (survey §2) — ~18 keys, no wording decision. Apply D1/D2 to pick the
   surviving key.
2. **Head-loss triad + coefficient** (§3.1) — apply D3 (term) + D4 (symbols). Owner `mphl_`.
3. **Velocity-check block + verdict convention** (§2, §5) — apply D5; 7-key `mtc_`/`mhp_` merge.
4. **mhp wording drift** (§3.5) — "Flow rate"→"Flow", "Flow velocity"→"Velocity" (owner `mpf_`).
5. **Elevation set** (§3.2) — one shared bare key ("Elevation", owner `mi_`, short form is the
   home) + a closed set of shared qualified keys (Headwater/Tailwater/Invert/Centroid/Water-surface
   elevation). NOT bare-only: Orifice Flow needs 4 distinct elevations on one page.
6. **Length** (§3.3) — drop the qualifier on `mphl_pipe_length` and `mhp_length` only. **Keep**
   "Reach length" (`cs_L` — the inflow-outflow station distance, not canal length) and
   "Weir length" (`ws_weirLength` — term of art). Fix `l`→`L` on weir length.
7. **Friction-slope naming + S₀ convention** (§3.4) — "friction slope" canonical over mpf's
   "pressure slope"; keep S₀ = bed slope, S_f = friction slope (mpf currently inverts this).
8. **Typography ride-alongs** (§4) — batch into each family's approved Wave 0 English edits: symbol
   case drift, `Cw`→`C_w`, `D50`→`D₅₀`, Froude `F`→`Fr`, and converting the inline
   `style="cursor:help;…"` tooltip spans (mtc_, rc_) to `class="ec-tip"`.

## Guardrails carried from the survey

- Merging whole labels at concept level is safe across all 26 languages. The original design's
  failure mode was **composition** (adjective+noun agreement, word order, RTL) — none of the
  backlog composes fragments at render time except the rejected EGL/HGL idea.
- A shared label translated once must fit its **narrowest** use: column-heading uses need the short
  form to be the shared key's home, long forms as tooltips — never the reverse.
- `$ec_lang_intent` is off-limits: any intent add/change during execution needs explicit human
  authorization in that conversation (CLAUDE.md).
