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

### D1 — Ownership: borrow-from-owner, menu order breaks ties
No neutral/shared prefix (`c_`/`calc_`) is introduced — the overhead of a new prefix is not worth
it. A shared concept lives under **one owning calculator's key**; every other page borrows it.
When a concept is shared and there is no established precedent for who owns it, the **owner is the
calculator that appears earliest in the main menu** (`lib/Menus.lib.php`). Menu order as of this
decision:

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

### D6 — Sequencing ~~merge per calculator-family~~ → REVERSED 2026-07-07: one full-suite pass
> **⚠ D6 as originally written was WRONG and is reversed. Superseded text kept struck-through for the record.**
>
> ~~Merges are not a single suite-wide pass. Each family's exact-duplicate + cluster merges are
> executed immediately before that family's Wave 0 / wave-1 sprint under item 85…~~

**Reversal (Tom + Opus, 2026-07-07).** Key consolidation is **inherently cross-cutting** — a
duplicate label's two halves live in *different* calculator families, so no per-calculator-family
view can make the merge/ownership call (proved same day: open-channel's merge candidates were
shared with weirs, irrigation, and micro-hydro). Chunking consolidation per calculator-family
therefore cannot work, and interleaving it with item 85's per-family translation loop is what
poisoned item 85. **Corrected sequencing:**

> **Item 90 = ONE English-only pass over ALL calculators** (Opus), applying D1–D5 across the whole
> suite. It is a prerequisite English-reform step, **decoupled from item 85**. Then Wave 0
> colloquialism cleanup (Fable) → **freeze English** → item 85 complete re-translation → §10.5
> source-hash last.

The `writeVelocityCheck` mechanism change (D5) is part of this full-suite pass (it touches the
verdict-string block wherever it appears), not tied to any one calculator family.

Terminology note: **"calculator families"** (the 6 calc groupings) vs **"translation tiers/waves"**
(language groupings) — never bare "families".

## Execution backlog (item 90, full-suite — one pass over all calculators)

Ordered by value ÷ risk (survey §6). Each is a whole-label merge — never fragment composition
(the one fragment idea, EGL/HGL from `ip_group_*`, is explicitly rejected; keep those as whole
strings).

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
