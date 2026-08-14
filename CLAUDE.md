# EngCalcs — Architecture & Developer Guide

## What This Is

A PHP/JS suite of hydraulic engineering calculators. 12 calculators, 11 languages. PHP's primary role is delivering multi-linguality — language detection, switching, and injecting localized strings into the rendered HTML. All computation runs client-side in JavaScript. No database, no authentication.

**License:** GNU GPL v3 or later. Copyright 2009 Thomas Gail Haws.

## Git Workflow

**Commit and push by default, without asking, at the end of every piece of work in this repo.**
This overrides the general assistant default of only committing when explicitly asked — Tom's
standing instruction (2026-08-09) is that he *always* wants completed work committed and pushed
here, and a docs gap that left this ambiguous is itself the bug to fix, not a reason to keep asking.

- **Work directly on `master`.** No feature branches, no `git checkout -b` — see the branching
  decision below. Commit straight to `master` and push to `origin/master`.
- **Only exception: the user explicitly says to leave something uncommitted** (e.g. "don't commit
  this yet", "let me look first"). Silence is not that signal — silence means commit and push.
- **Still exercise judgment about *what* lands in the commit** — the general Git Safety Protocol
  still applies (don't commit likely-secret files, review a broad `git add`, prefer a new commit
  over amending, never force-push or skip hooks without being asked). "Commit by default" answers
  *whether* to commit; it does not waive care about *what* gets committed.
- **Report the push state unabridged at the end of the work**, unprompted: the commit SHA and
  confirmation it is on `origin/master` (`git log --oneline origin/master..master` should be
  empty). Never tell Tom to `git pull` before verifying the push actually landed.

**Why direct to `master`, no branches:** Tom, 2026-07-29 — the project is simple enough to stay on
one branch. It's live on preview and master, and per-task branches accumulated as stale refs
needing periodic manual cleanup. "We are no longer branching by habit." This is specific to
engcalcs; it is not a general "never branch" rule for other projects.

## How to Add a New Calculator

1. Copy an existing calculator file (e.g. `Manning-Pipe-Flow.php`) as your starting point.
2. Choose a short variable prefix (e.g. `hw_` for Hazen-Williams, `dw_` for Darcy-Weisbach — see convention below).
3. Define `$arrayInputs` and `$arrayResults` with your prefix, referencing `$ec_lang['prefix_key']` for labels.
4. Add your language keys to all 11 `lib/lang.ec.??.php` files.
5. Write `EngCalcs.pageCalculator = function(objForm) { ... }` in the `<script>` block at the bottom.
6. Call `echoHeader`, `echoCalculatorForm`, `echoFeedback`, then `echoFooter` — that's the full page structure.
7. Add the new calculator to the menus in `lib/Menus.lib.php`.
   Declare each field's units as a **family name** (`'units' => 'distance_small'`), never an inline
   array — see "Unit Sets" below.
8. Set `$html_desc = $ec_lang['prefix_meta_desc_plain'];` before `echoHeader()` — see "Meta description" below.
9. Include the calculator JS using `filemtime()` for automatic cache-busting — never use a hardcoded `?v=N`:
   ```php
   <script src="/engcalcs/js/my-calc.js?v=<?=filemtime(__DIR__.'/js/my-calc.js')?>"></script>
   ```
10. **Add a worked example to `dev/calc-spike/`.** The new page is picked up by
    `all-calcs-smoke-harness.js` automatically (the page list is derived), so it is already checked
    for running, for not emitting NaN, and for opening on a passing design. What that cannot check
    is whether the math is right — copy `mpf-harness.js` and anchor the new calculator against its
    source method. `dev/calc-spike/README.md` is the recipe.
11. **Add the prefix to `prefixToTermNames()` in `dev/scripts/generate_translation_payloads.php`,
    listing the `glossary.json` terms the calculator uses.** A prefix that is missing there falls
    back to three default terms (`flow`, `velocity`, `slope`), so **every glossary entry written for
    the calculator — definitions, `preferred_translation`, and the `avoid` arrays that are the whole
    point of a trap term — is silently invisible to its translation agents.** Nothing warns you:
    payloads generate, `--check` says FRESH, the sprint runs, and the guards simply were never
    delivered. Found 2026-08-08 during Task 146.06's pre-sprint checklist, where `lpn` and `bpn` had
    both been missing since they were written; the twelve network concepts seeded for `lpn_` in Task
    193 had never reached an agent. **Verify before proposing any sprint** by reading
    `glossary_terms_by_prefix.<prefix>` out of a generated payload — if it has exactly three
    entries, the map is missing.

### Meta description (ROADMAP Task 150)

Each page sets one global before `echoHeader()`; `echoHTMLHead()` escapes it into
`<meta name="Description">` for every page at once:

```php
$html_desc = $ec_lang['mpf_main_desc'];
```

- **Reuse `<prefix>_main_desc` — do not add a meta-description key.** `*_main_desc` is already
  written, already translated into all 26 languages, and already says something different from the
  title (the title is "Free Online Manning Pipe Flow Calculator"; the desc is "Manning Formula
  Uniform Pipe Flow at Given Slope and Depth"), so it fixes the duplicate-of-title defect at zero
  translation cost. **This is a decision, not an oversight** (Tom, 2026-07-28): a dedicated
  meta-description key per page reads better as a search snippet, but it costs 20 × 26 = 520 new
  strings — roughly tripling the standing translation delta — for an incremental SEO gain. A
  free fix that is 80% as good beat a paid one. Weigh any future proposal to add prose descriptions
  against that same arithmetic.
- **Never point `$html_desc` at `$html_title` or at a `*_main_title` key.** Repeating the title is
  the original Task 150 defect: Google discards a duplicate-of-title description and auto-generates
  a snippet from a page whose visible content is a form.
- **A page with no `*_main_desc` sets nothing** — no `$html_desc`, no tag emitted. `index.php`,
  `contact.php`, `Compare-Languages.php`, and `formmailsuccess.php` have none. (`index.php` is the
  one place this genuinely costs something; see ROADMAP Task 157.)
- **Whatever key you point it at is plain-text-constrained** — no tags, no entities.
  `plainTextBoundKeys()` derives it from the `$html_desc` assignment, so Rules A and B cover it
  automatically. If you ever do introduce a purpose-written key here, name it `_plain` so the name
  and the derivation agree.

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
| `bpn_` | Branched Pipe Network (distributary/tree network; parent-pointer topology, two-pass fixed-demand solve, series-by-default, Manning/HW/DW switching) |
| `lpn_` | Looped Pipe Network, Map Interface — shipped 2026-07-30, still moving. (**The "preview" label is retired**, Tom 2026-08-09 — do not reintroduce it in README, menus, or page copy.) Canvas/map-centric looped network solved by the global gradient algorithm (`js/lpn-solver.js`), with a map editor over it (`js/looped-network.js`). Sibling of `bpn_`, which is unaffected. **Translated 2026-08-08 (Task 146.06 DONE) into the Task 203 core four (es, pt, fr, tr); identity strings only in the other 22** — that is the coverage cross working as designed, not a gap. Element types are junction, reservoir, pipe, pump, text: **no tanks, no valves, no extended-period simulation** (see ROADMAP Task 243 for the WASM-EPANET route to those). **Reads EPANET `.inp` files** (`js/lpn-inp.js`, Task 196) — importing the supported subset and reporting every difference, never rejecting and never dropping in silence; it does not write one yet (Task 281). Scope: `dev/looped-network-calculator-scope.md`; ROADMAP Task 146 and its 146.nn children |

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

### Link + tip labels: call the helper, do not write the markup (2026-08-12)

**Never hand-assemble `.ec-help` / `.ec-tip` markup.** Two functions in `lib/Calculators.lib.php`
build it, and `php dev/scripts/tip_markup_check.php` (blocking, in `check_all.sh`) fails the build
if any page writes it out longhand:

```php
ecTipLabel($ec_lang['mpf_flow'], $ec_lang['mpf_flow_tip'])                  // tip, no link
ecLinkTipLabel('https://...', $ec_lang['hw_roughness'], $ec_lang['hw_tip']) // link + tip
```

They handle the `strip_tags()` + `htmlspecialchars()` a `title=""` needs, and — the part that kept
going wrong by hand — the two **opposite** nestings: with a link, `.ec-help` wraps the `?` glyph
alone (the `<a>` is already a big click target); without one, `.ec-help` wraps the label text *and*
the glyph, or the tap target is a single character and fails on touch. Getting that backwards
still renders, which is why it survived ~40 lines of prose here and had to be retrofitted by hand
on two pages in July 2026. `$text` is trusted HTML (`<strong>`, `<sub>`, symbol spans are fine);
`$tip` is plain text.

The judgement calls the helpers cannot make:

- **Exactly one `?` per label, and it is always the tip.** A link-`?` next to a tip-`?` reads as a
  doubled, unexplained glyph with no sign either one navigates.
- **A link with no tip needs no wrapper at all** — plain `<a>` is correct, and the check permits it.
  Only reach for a helper when a tip genuinely exists.
- **Never put explanatory text in a link's `title=`.** `js/Calculators.lib.js` only activates
  tap-triggered tooltips on `.ec-help[title]`, so on touch a bare `<a title="...">` just navigates
  and the text is never seen.
- **If the linked page has no translation** (e.g. `frictionslope.php` is English-only), say so in
  the tip — "Follow link for explanation (English only)" — so the click isn't a surprise.
## Language Keys

All display strings live in `lib/lang.ec.??.php` (27 files: en + 26 non-English). Keys follow the pattern `prefix_description`, e.g. `dw_friction_factor`, `mpf_flow`. Add keys to **all** language files when adding a new calculator — use English text as the fallback where translations aren't available yet.

### Write English source strings in Simple English (Task 98, 2026-07-13)

This is a multilingual project with an established English user base going back many years — for
new and edited `$ec_lang` strings, **prioritize translatability over English SEO/idiom, but only
for explanatory content — not for a calculator's identity.** Two different string roles, two
different rules:

- **Identity strings (menu entry + `<title>` tag) match the authoritative published source's own
  terminology**, when the calculator is named after one. Robinson's paper is literally titled
  "Design of Rock Chutes" — `rc_main_menu`/`rc_main_title` say "Rock Chute Design (Robinson)",
  matching it. This is a continuity/recognition call, not a translatability one: the menu entry and
  title are the calculator's *name* — what a returning English-speaking user searches for, bookmarks,
  and calls it in conversation — so don't casually rename it even if a plainer word exists.
- **Explanatory strings (on-page description, tooltips, notes, body labels) prioritize Simple
  English.** `rc_main_desc` says "Steep Channel Rock Lining Size", not "Rock Chute Riprap Sizing" —
  a word that *looks* like an opaque loanword (e.g. "riprap") invites translators, especially in
  lower-resource languages, to phonetically transliterate it rather than translate the concept,
  because there's nothing to compositionally parse. Two ordinary words a translator can actually
  translate ("rock lining") are safer than one jargon word here, even though that same jargon word
  is fine — even preferred — in the identity strings above.
- **Don't force any language into a specific calque of the English wording**, in either string role.
  An audit of the Rock Chute calculator found 6 of 26 languages (am, bn, he, hi, id, ur) had
  phonetically transliterated "riprap" as a loanword, and 2 more (hi, ur) had done the same to
  "chute" — real defects, fixed 2026-07-13. But the fix is "translate the concept naturally,"
  not "match this exact English phrase": 5 of those 6 languages already had perfectly natural,
  non-transliterated identity-string translations of "Rock Chute" *before* any of this — proving the
  transliteration risk tracks translation-pass quality, not which UI tier a string lives in, and
  that forcing a uniform calque (e.g. requiring every language's identity string to literally
  decompose into "steep" + "channel") would have overwritten good, idiomatic translations that
  didn't need touching. When fixing a transliteration defect, let the translator/agent choose
  whatever real, established phrase native engineers would use — matching the *concept*, not the
  specific English words chosen for that string's role.
- **Don't rename eponyms or bibliographic citations** — "Manning," "Darcy-Weisbach," "Robinson," and
  actual paper titles in citations stay as published in every string role; the jargon risk is
  specifically generic descriptive terms dressed up in Title Case or borrowed technical slang, not
  legitimate proper nouns.
- This principle governs new calculators from day one, not just retrofits — pick an identity name
  matching the source method (if any) and plain, composable English for explanatory content, when a
  calculator is first written, so it never needs this fix later.

**`$ec_lang_syn` supplies SYNONYMS AND ALTERNATE EXPRESSIONS, so a translator can pick their
own language's natural phrase.** It is not a place to *describe* a label, explain a decision, or
leave notes for a human. It answers exactly one question, asked by a translator: *"what other ways
could this be said?"* — and it answers in words, not commentary. Tom, 2026-08-08, restating the
original design after it had drifted: *"`_syn` is not for me or for you to describe anything. It
is for synonyms or alternate expressions."*

**THE SUBSTITUTION TEST — the one rule that separates a synonym from a description.** Every phrase
in a synonym entry must be able to **stand in the slot**: you could put it on that button, that heading,
that label, and it would still mean the right thing. If a phrase could not go on the control, it is
a description and it does not belong.

```php
// ✅ synonyms -- every item could be the label
$ec_lang_syn['lpn_new_text']='Text, Label, Temporary Text, Placeholder, Unfinished text, or Default words';
$ec_lang_syn['lpn_units_length']='Pipe lengths and map coordinates';
// ❌ description -- none of this could ever be the label
$ec_lang_syn['lpn_new_text']='The word that appears inside a new text label when it is first placed on the drawing.';
```

Both bad examples above are real: AI wrote them on 2026-08-08 and Tom rejected them on sight
(*"You are drifting again into description, which was the original sin, and is disheartening to
me."*). **Description is the failure mode this channel has drifted into every single time.** The
substitution test exists because "write synonyms, not descriptions" was said repeatedly and did not
hold; a testable rule does what an instruction could not. Apply it to every phrase, including the
ones inside parentheses.

Two shapes both pass the test and both are correct: a **word bank** (`Text, Label, Placeholder…`)
and a **substitutable phrase with alternates in parentheses** (`Throw away (discard) my changes by
reloading the saved version…`). Use whichever fits the label.

**When it is needed: whenever the plain meaning is not what the English words literally say.**
That is the whole test, and it is much broader than jargon. Worked examples, all real:

```php
// The English is a known idiom, but "fit" never names WHAT is fitted.
$ec_lang_syn['lpn_tool_zoom_extent']='Zoom out (or in) until the whole drawing fits in the window; show everything at once (zoom to extents, fit to window, show all). | avoid: adjusting the zoom by an amount';
// "Defaults" is standard English but its plain meaning is "the original values".
$ec_lang_syn['calc_defaults']='Restore (revert, return) to the original (initial, as-shipped, factory) values (state).';
```

**Do not gate intent on jargon or transliteration risk.** An earlier version of this section said
intent was "reserved for jargon/transliteration risk" and that "adding an intent string to a plain
label is itself a defect." **That was wrong and it is retired** (Tom, 2026-08-08). It inverted the
mechanism: the labels that hurt most in the 146.06 sprint — "Zoom to fit", "Map display and sizes",
"Restore defaults" — are all *plain* English, which under the old rule made them ineligible for the
one channel that would have fixed them. A plain label whose plain meaning differs from its literal
words is exactly the case intent exists for.

**Prefer fixing the English when an English reader also stumbles** (see the three-way routing rule
below) — but where the English is right for its own audience and only the translator is left
guessing, intent is the answer, not a rewrite and not an `avoid` list.

### Routing rule: English, intent, or glossary? (Tom, 2026-08-08)

One question decides it: **does an English reader also stumble?**

| Test | Home | Why |
|---|---|---|
| An English reader must re-read, or can read it two ways | **Fix the English** | Defective for its own audience. One edit fixes all 27 languages at once. |
| English is correct and idiomatic, but a translator cannot recover the concept from the words | **`$ec_lang_syn`** | The English reader is served; the translator is not. |
| The concept recurs across labels or calculators | **`glossary.json`** | It is about consistency across call sites, not about one label. |

They compose — a string may take an English fix *and* an intent. Worked: "Map display and sizes"
had two valid parses, so the English was fixed (→ "Map appearance"); "Zoom to fit" reads fine to an
English user, so the English stayed and an intent carries the synonyms.

### May a `_syn` entry be a fragment? Yes — and which shape depends on what is wrong (Tom, 2026-08-12)

Tom asked whether `_syn` entries must carry the whole string plus synonyms, or may be fragmentary
for efficiency. **Fragments are correct and already the norm** — the word-bank shape above
(`Text, Label, Temporary Text…`) is a fragment. One test decides which shape a label needs:

| What is unclear | Shape | Why |
|---|---|---|
| A **word** — one term is ambiguous, jargon, or a polysemy trap | **Fragment.** A word bank of alternates for that word alone. | The translator can already parse the sentence; they are stuck on one slot. Repeating the rest is noise they must read past. |
| The **structure** — the words are individually plain but relate to each other in more than one way | **Whole string, rephrased.** | Alternates for one word cannot fix a parse. "Map display and sizes" needed the entire phrase respelled, because nothing was wrong with any single word in it. |

So: *fragment when the trouble is a word; whole string when the trouble is the shape of the
sentence.* Both still obey the substitution test — every phrase offered must be able to stand in
the slot it replaces.

### `gloss:` pointers vs repeated synonyms (Tom, 2026-08-12)

**Prefer the pointer when nothing but the concept is left.** Tom: *"Gloss ref seems more efficient
in the long run."* It is: one entry to maintain instead of the same gloss copied into four labels,
and `glossary.json` can carry an `avoid` list that an inline parenthetical cannot.

**The test, applied after trimming:** does this entry still carry a wording a translator cannot get
from the glossary? If yes, keep both — the pointer *accompanies* the synonyms. If the entry was
only `X (Y)` where Y is the concept gloss, the pointer is strictly better and the entry becomes the
pointer alone. This is narrower than the retired Task 132 exception, which licensed trimming
"wherever it duplicated a glossary concept" and took label-specific synonyms with it.

**A pointer buys efficiency with a DEPENDENCY, so it is gated by a check.** A glossary term reaches
an agent only if the key's prefix is wired in `prefixToTermNames()` — the trap that silently blinded
`lpn` and `bpn` for months. An inline synonym always arrives; a pointer arrives only if three things
line up. **Run `php dev/scripts/gloss_ref_check.php` (exit 0 required) before any sprint.** It
verifies every `gloss:` names a real term AND that the term is wired to that key's prefix. Its first
run found three pointers that had been delivering nothing: `mi_d50in`, `mtc_sgrock`, and
`ip_notes_1_def` pointing at a `bisection` entry that did not exist.

**Positive guidance beats negative guidance.** Tom, 2026-08-08: *"we do ourselves a disservice by
relying on 'Avoid' instead of providing the correct intent."* An `avoid` list tells a translator
which ditch to miss, not where the road is; a synonym set lets them just translate. Reach for
`avoid` only for a genuine polysemy trap (financial "default", anatomical "head"), and never as a
substitute for saying plainly what the label means.

**`$ec_lang_syn` is off-limits to AI.** This array is human-authored translation guidance,
interleaved with `$ec_lang` for human review. AI must never add, change, or remove any
`$ec_lang_syn` entry without explicit written permission from the human in that conversation.
The working pattern, confirmed 2026-08-08: **AI proposes intent entries as a diff in the
conversation; the human approves; only then does AI write them.** Tom is keeping the bar in place
for now and may lift it later.
**The Task 132 standing exception is RETIRED** (Tom, 2026-08-08). It pre-authorized AI to *trim*
an intent's left-of-pipe into a `| gloss:` pointer wherever it "duplicated" a glossary concept.
That authorization was actively eroding the mechanism: the left-of-pipe **is** the payload, and
trimming it to a pointer deletes the synonyms a translator needs. There are now **no** standing
carve-outs — every intent edit needs in-conversation permission.

### Division of labor: glossary vs. intent vs. tips (2026-07-20)

Three channels carry translation guidance; keep each to its job and **do not duplicate a fact across
them** (duplication is what let stale values drift):

- **Glossary (`glossary.json`) — per *concept*.** One entry, referenced by every label/calculator that
  uses the term. The single source of truth for: the plain meaning, English synonyms, each language's
  dominant standard translation, any `avoid` list, and sourcing. Terminology *consistency* lives here.
- **`$ec_lang_syn` — per *label*, and its payload is SYNONYMS.** The left-of-pipe is a synonymic
  expansion of *this label's* meaning — alternate wordings a translator can re-compress in their own
  language. **That payload is the point of the channel, not a legacy of it.** The right-of-pipe stays
  what it was: terse production commentary (`layout`, `symbol`, `avoid`, `gloss`). A `gloss:` pointer
  *accompanies* the synonyms; it never replaces them.
- **Visible `.ec-help`/`.ec-tip` tips — user-facing definition.** Because a tip's text is translated
  with the label, it is a good home for a plain-language definition that helps the user AND anchors
  the concept for translators (e.g. "Density relative to water"). A tip serves the *reader*; an
  intent serves the *translator*. Both may exist for one label and that is not duplication.

Rule of thumb: **concept → glossary; this label's other wordings → intent; user-facing definition →
tip.** Don't copy the same *fact* between glossary and intent (that is how stale values drift) — but
a label may legitimately carry both a `gloss:` pointer and its own synonyms.

**Superseded 2026-08-08.** This section previously read "`$ec_lang_syn` — per label, metadata
only", called the left-of-pipe "largely superseded by visible tips", and directed that it "should be
trimmed toward pointers (Task 132)". All three statements are retired. They redefined a
translator-facing synonym channel as AI-facing metadata, which is why intents stopped carrying the
one thing translators actually needed. See the routing rule above.

### Polysemy / units-trap protocol (2026-07-20)

A **trap term** is one where the English word has a non-obvious technical meaning a translator is
liable to get wrong — a polysemy (hydraulic "head" vs anatomical head vs pressure), a units confusion
("specific gravity" is a dimensionless *ratio*, never a units-bearing "specific weight"), or a
transliteration lure ("chute", "riprap", "penstock"). These cost the most because the same mistake
recurs in language after language, sprint after sprint. When a term is (or turns out to be) a trap,
give it **all three** of these, in this order:

1. **English-reform gate first — the English is not sacred.** Ask whether the English wording itself
   is weak/jargonistic; if so, reform the `$ec_lang` value (that fixes all 26 languages at the source).
   Identity strings (menu/title) are exempt — they match the source method's name. Explanatory labels,
   notes, and tooltips are fair game. Example: "station" (a bus-stop mistranslation trap) is best fixed
   by allowing the plain alias "Distance", not by guarding the jargon.
2. **A root glossary entry with a structured `"avoid"` array.** Put the concept — including the *root*
   word, not only its compounds (there is a `head` entry, not just `head loss`/`velocity head`) — in
   `glossary.json` with an `"avoid": [...]` list of the wrong senses. Keep **compounds** as the
   authoritative *translatable* units (a compound's idiomatic translation is not the concatenation of
   its atoms — "velocity head" → fr "hauteur de vitesse"); the root atom is an **anchor** carrying the
   shared `avoid` guard, never an ingredient to compose from. **`avoid` may only forbid *physical/
   structural* errors and lazy transliterations — never a term that is a language's genuine standard.**
   We defer to each language's own dominant, culturally-standard term; **we are not the judges of
   terminology, the culture is** (this is why the English source keeps "Specific gravity" rather than
   "relative density"). So for a units trap, forbid *attaching units to the value*, not the *word* — a
   weight-flavored term that is the local standard (tr "özgül ağırlık") is correct; keep it, just never
   let the quantity carry units. See the "defer to cultural standard" principle.
3. **A visible definitional tip on any input label**, in the whole-label `.ec-help`/`.ec-tip` form.
   The tip both helps the user and — because its text is translated with the label — anchors the
   concept for translators (e.g. specific gravity → "Density relative to water"; head → "Energy per
   unit weight of water, read as a height of water column or as a pressure"). Note that "head" is
   **not** a units trap the way specific gravity is: the suite reads head loss in psi/kPa/bar as
   well as in metres, and defaults to psi under the US preset (`partial_head` in `lib/Units.lib.php`).
   Only *total* head — EGL/HGL — is water-column-only, because an EGL is an elevation. Tom,
   2026-08-13: *"The units can be in height or in pressure. So we should allow translators to use
   the engineers' common term if there is clearly no use of head/height and head/height loss by
   **engineers**."* So German *Druckverlust*, French *perte de charge* and Urdu *دباؤ نقصان* are all
   correct, and a glossary `avoid` must never forbid them. A glossary claim about units is a claim
   about `Units.lib.php` — check it there rather than reasoning from physics alone. Plus a
   **commentary-only** intent
   guard (`| avoid: anatomical "head"`) so no translatable payload is duplicated. (This is the one
   sanctioned case where a documented-polysemy label *does* get an intent — it is not the "plain label"
   defect above.)

The `avoid` arrays are the single source of truth for the **trap-term watchlist**
(`dev/scripts/list_trap_terms.php`) — a one-command dump handed to a high-power agent for an on-demand
sweep. Never maintain a separate watchlist; it derives from the glossary.

### `$ec_lang_syn` format: `<synonyms> | <commentary>`

An intent string has two parts separated by the first pipe (`|`):

- **Left of the pipe — the synonyms.** Alternate wordings of *this label*: a word bank, or a fuller phrasing with alternates in parentheses, that a translator can re-compress in their language. This is the translatable payload, and **every phrase in it must pass the substitution test above** — it could stand on the control as the label itself. It may freely contain parentheses.
- **Right of the pipe — commentary.** Production/layout notes and disambiguation. **Not** translated; the payload generator strips it. Keep it parsimonious by using the tag vocabulary below rather than prose.

A string with **no pipe** is entirely intent (all existing clean strings stay valid — zero migration).

**Never put commentary in bare parentheses on the intent side** — parentheses are reserved for synonyms and are ambiguous with real content (e.g. `(as in HEC-RAS)`). Commentary always goes behind the pipe.

**Commentary tag vocabulary** (`tag: value`, semicolon-separated for multiples). Tags are shorthand that resolve to the full instruction defined here, so the intent string stays terse (`... | layout: column heading`):

| Tag | Value | Full instruction it stands for |
|-----|-------|-------------------------------|
| `layout` | `column heading` | Renders as a header in a very narrow fixed-width results-table column; keep the term as short as the language allows. |
| `layout` | `unit token` | Renders inside a narrow units selector (dropdown); keep the token as short as the language allows. |
| `layout` | `nav item` | Renders as a top-level item in a HORIZONTAL BAR — the site navigation bar, or the `lpn_` menu bar — competing for width with every sibling item; keep it as short as the language allows, and prefer the shortest synonym offered rather than the most explanatory one. **A row inside a pull-down is NOT a nav item**: a pop-up menu sizes to its own widest row and competes with nothing, so tagging one tells 26 translators to compress a label that has room. `layout_tag_check.php` fails the build on that. |
| `layout` | `button` | Renders as a button label competing for width with its siblings in a row or dialog; keep it as short as the language allows and imperative in mood. |
| `avoid` | `<wrong sense>` | This label must NOT be read or translated in the named sense (e.g. `avoid: temporal "sporadic"`). |
| `symbol` | *(flag, no value)* | This label contains a variable symbol; keep every letter and subscript in it exactly as in English in every language, including RTL. Subscripted names (e.g. `q<sub>avg,field</sub>`) are symbols, not words to translate. The specific subscript is read from the label itself, so it need not be repeated in the note. |
| `gloss` | `<term>` | Defer to `glossary.json` term `<term>` for full disambiguation; do not restate it inline. |
| `runtime` | `units appended` | The page concatenates a unit label onto this string at render time; do not name a unit inside the text, and leave room for one to follow. |

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

**A WRONG TAG IS WORSE THAN A MISSING ONE, and `php dev/scripts/layout_tag_check.php` (blocking,
in `check_all.sh`) now enforces that.** A tag is an instruction a translator obeys without being
able to see whether it is still true. `lpn_backdrop_scale_entry` carried `layout: nav item`
describing a `<select>` that Task 276 had already replaced with a menu button — and in the Task 297
sprint four agents (bg, pt, uk, zh) dutifully compressed the label, one proposing we shorten the
English so every language would inherit the cut. All four reasoned correctly from a constraint that
had been false for weeks. **The tag describes a WIDGET and nothing else in the repo connects the
two**, so it goes stale silently whenever the widget changes; auditing the other 22 tags by hand
then turned up `lpn_help_walkthroughs` carrying the same wrong tag, which is the argument for the
check rather than for reading more carefully. It verifies the value is in the vocabulary, that a
`column heading` really is inside a `<th>`, that a `unit token` is named `u_*`, and that a
`nav item` is not merely a pull-down row. Free-form prose commentary is left alone — it is
human-authored and legal, just less parsimonious than a tag.

Add new `layout` tokens or tags here (defined once) rather than expanding prose in the data — the
check reads its vocabulary from this table, so an undefined token fails the build. Example:
```php
$ec_lang_syn['mi_is_bank']='Boundary (divider, edge, break, or bank as in HEC-RAS) between adjacent regions of differing flow, hydraulic radius, and composite n. | layout: column heading';
```

The 26 non-English languages: am, ar, bg, bn, cs, de, es, fa, fr, he, hi, hr, id, it, km, my, ps, pt, ro, ru, sr, sw, tr, uk, ur, zh.

### Rule A: never write an HTML entity in a language string (ROADMAP Task 140, enforced 2026-07-27)

Use the literal UTF-8 character — `—` not `&mdash;`, `×` not `&times;`, `≈` not `&asymp;`, `²` not
`&sup2;`, `ν` not `&nu;`, `&` not `&amp;`, `<`/`>` not `&lt;`/`&gt;`, `“ ”` not `&quot;`. This holds
for **every key in every one of the 27 lang files, with no exceptions** — page labels, tips, notes,
and document keys alike.

**Why absolute rather than scoped:** whether an entity survives depends on the PHP/JS call site that
consumes the string, which is invisible from the string itself. Of the suite's three attribute paths,
two escape `&` first (`htmlspecialchars(strip_tags())` in page PHP, `escapeAttr` in
`js/Calculators.lib.js`), turning `&asymp;` into a literal `&asymp;` on screen. A literal character is
correct on all three paths, so there is no case to reason about. The previous check failed *precisely
by scoping itself* to attribute-bound keys.

`php dev/scripts/lang_syntax_validate.php` enforces this (`entity-in-lang-string`) and names the
literal replacement in its error text. Trust the tool — don't add more rules on top of it.

The one thing this rule does **not** cover: hardcoded entities in `lib/HeadersFooters.lib.php` and
per-page SEO meta tags — those are not language strings.

### Rule B: never write an HTML tag in a plain-text-constrained string (Task 140, enforced 2026-07-27)

A plain-text attribute (`title` `placeholder` `value` `alt` `aria-label` `data-*`) holds text only.
`<sub>` in a `title=` is **never** a subscript by any delivery route — depending on the call site it
is either silently stripped or shown literally. Two forms, both enforced by
`php dev/scripts/lang_syntax_validate.php`:

- **`tag-in-plain-text-string`** — the whole string reaches plain text. "Reaches" is **derived from
  the app source** by `plainTextBoundKeys()`, not from the key's name: a name is a claim, the code is
  the fact. The `_tip`/`_plain` naming is enforced *too*, as a second net for a string assembled in
  PHP before it reaches an attribute — but derivation is what actually decides.
- **`tag-in-embedded-tip`** / **`entity-in-embedded-tip`** — a tooltip written *inside* another key's
  value as `title="…"`. 39 English keys (1053 strings across the 27 files) do this, and until this
  check existed **every one was invisible to the validator**: the outer key is page HTML, so Rule B
  does not apply to it, while the text inside its `title=""` is under exactly the plain-text
  constraint. This check is why lifting those 39 tooltips into their own keys was retired as
  unnecessary — see the Task 140 record in `dev/ROADMAP.md`.

**Rule C is advisory and off by default** — run `lang_syntax_validate.php --rule-c`. It reports where
the name and the derivation disagree. 31 keys disagree *on purpose* (the 18 `_main_desc` keys have
three destinations at once — `<h2>`, the menu `title=`, and since Task 150 the meta description — so
no single name fits), which is why it would otherwise be noise. Run it after touching a call site: it is what caught the deriver missing the
entire JS tip route in the first place.

**When adding a tooltip or an attribute-bound label, you need do nothing** — the deriver picks it up
automatically. That is the point: it replaces "remember not to."

### Rule D: language strings are single-quoted (ROADMAP Task 163, enforced 2026-07-28)

`$ec_lang['k']='value';` — never `"value"`. An apostrophe inside the text is escaped `\'`. Enforced
for both `$ec_lang` and `$ec_lang_syn` by `lang_syntax_validate.php`
(`double-quoted-assignment`); all 660 pre-existing double-quoted assignments were converted, so the
count is zero and any new one is a hard error.

**This is a correctness guard, not a style preference.** Two failure modes, both of which had
already happened here:

- **A double-quoted value interpolates.** `lang.ec.es.php` carried
  `$ec_lang['u_in2']="$ec_lang[u_in]^2"` — a string silently depending on another key being
  assigned *earlier in the same file*. `lang_key_order_normalizer.php` reorders these files, which
  would have blanked it with nothing visible in the diff of that line. Both Spanish cases are now
  literals.
- **Nothing could see it.** The old `extractValues()` matched single quotes only, so every
  double-quoted assignment was exempt from Rules A and B — the two rules this file calls absolute —
  *silently*. Eight real translated keys sat in that blind spot, four of them in `lang.ec.tr.php`.

Both parsers now come from `dev/scripts/lang_parse.inc.php`, which still reads either form on
purpose: a parser that only understood the standard could not report a violation of it. It exposes
two views of a value, and callers pick deliberately — `ecLangRawValues()` (escapes intact, for
syntax rules, which check the literal text an author typed) and `ecLangValues()` (escapes resolved,
for comparison, where `Haws\'a` must equal `Haws'a`).

## Translation Sprints

This section is the authoritative home for sprint **mechanics**. The *sequencing* of sprints (when to run which, in what order — the three scenarios and THE SEQUENCING RULE) lives in `dev/translation-process.md`; the dated blow-by-blow history is in `dev/translation-execution-log.md`.

When translating a new calculator's keys into all 26 non-English languages, **spawn one agent per language in parallel** — not one agent for all languages sequentially. Reasons: faster (minutes not hours), better quality (each agent starts with a fresh context focused on one language), and easier to retry a single language if quality is poor.

**REQUIRED: Get explicit user authorization before launching any sprint.** A sprint spawns up to 26 paid agents. The correct pattern is always: propose → confirm → launch. Never infer authorization from a general "proceed" or a question about paths. The user must say something equivalent to "go ahead" or "run it" in response to a specific sprint proposal.

**Pre-sprint checklist (complete before proposing to the user):**
0. **Wave 0, mechanized: run the adversarial English pass, and clear its findings.** One agent,
   English only, over the new/changed strings. It does NOT ask "is this string good?" — a fluent
   English reader answers yes to almost everything, which is why `lpn_`'s Wave 0 (Task 193, 226 keys
   reviewed, 51 rewritten) still shipped "Zoom to fit", "Map display and sizes" and "Restore
   defaults". It asks **"list every plausible reading of this string; if there is more than one,
   propose a rewrite."** Falsification, not review. Findings go to
   `dev/english-friction/<sprint>.json`; route each one with the English/intent/glossary rule above.
   **`php dev/scripts/friction_check.php --sprint=<id>` must exit 0 before the sprint launches.**
0b. **`php dev/scripts/gloss_ref_check.php` must exit 0.** Every `gloss:` pointer resolves to a
   real glossary term that is actually wired to its key's prefix. A pointer that does not resolve is
   worse than no pointer — the synonyms it replaced are gone and nothing took their place.
1. Regenerate payloads so the delta count reflects the *current* lang files: `wsl -e php /var/www/cnm/public_html/hawsedc/engcalcs/dev/scripts/generate_translation_payloads.php`. This is the orchestrating AI's job, never the user's — the user must never have to remember to call for it. **Enforcement:** the launcher MUST run `generate_translation_payloads.php --check` immediately before spawning agents; it prints `FRESH`/`STALE` and exits non-zero if any payload is older than its inputs (English source, that lang file, glossary, the exempt-key list, the coverage declaration, or the generator itself). A non-zero exit is a hard stop — regenerate, then re-check — so a sprint can never launch on a stale delta.
2. Verify `glossary.json` has `preferred_translation` populated for the calculator prefix's key terms, especially for anchor languages (es, fr, ru, ar). Check `translation_notes` for WMO-verified terms and terms with `$ec_lang_syn` framing requirements.
3. State the delta count and which calculators are affected before asking for authorization. **Delta zero now means zero** (Task 161): keys that are *correctly* byte-identical to English — symbols, eponyms, brand names, per-language cognates — are listed in `dev/scripts/translation_exempt_keys.json` and are not counted, so you no longer hand-classify a residue before proposing. They *are* still reported when missing or blank. `generate_translation_payloads.php`, `lang_parity_check.php`, `translation_completion_matrix.php` and `lang_syntax_validate.php` all read that one list via `dev/scripts/exempt_keys.inc.php`, so a disagreement between those four counts is a bug, not a nuance. **Add a key there only when identical-to-English is permanently correct** — never to quiet a number you don't want to fix.

### The coverage declaration: what we intend to translate (Tasks 203/204, adopted 2026-08-05)

The same four scripts also read `dev/scripts/translation_coverage.json` via
`dev/scripts/coverage.inc.php`. It answers a different question from the exempt list, and **the two
must never be merged**:

- **exempt** — identical to English is *permanently correct* here. The key is **finished**.
- **out of scope** — this (calculator × language) cell is one we have decided not to translate yet.
  The key is **not started**, and the cell can earn its way in at any time.

Using the exempt list for an out-of-scope body is explicitly forbidden: it would put a permanent
floor back under every outstanding-keys number, which is the exact defect Task 161 removed.

**The rule, entire:** *a cell is in scope iff the calculator is core OR the language is core.* That
OR is what makes it a **cross** — every language gets the core calculators, every calculator gets the
core languages. An AND would leave Manning-Pipe-Flow untranslated in 22 languages.

- **Core calculators: `mpf`, `mtc`. Core languages: `es`, `pt`, `fr`, `tr`.** 108 of 416 cells, 26%
  of the work, 98.2% of measured use. Move along the frontier by editing the JSON — adding a core
  *language* costs `16 − N` cells, adding a core *calculator* costs a full 26, which is why the
  frontier prefers languages.
- **Identity strings are the floor and are never out of scope** — menu entry, `<title>`,
  `*_main_desc`, in every calculator in every language. A cell outside the cross means "body in
  English, findable in the local language," which is what lets it earn its way in.
- **Scope is consulted only about a GAP** — a key missing, blank, or still equal to English. An
  already-translated key in an out-of-scope cell stays translated and stays maintained. Task 203
  **deletes nothing**; it governs new calculators, drift spend, and future audit passes.
- **A prefix not listed in `calculator_prefixes` is suite chrome and is always in scope.** An
  unclassified new prefix therefore gets translated — the safe direction.
- `--ignore-coverage` on `lang_parity_check.php` / `translation_completion_matrix.php` restores the
  raw full-parity view, which is the right way to ask "what would promoting this cell cost?"
- `php dev/scripts/coverage_selftest.php` asserts the cross, the floor, and the exempt/out-of-scope
  separation against the real declaration. Run it after editing the JSON.
4. Note any known quality risks (new terms without glossary coverage, intent-guided terms, proper nouns).
5. **Check for stale-but-present drift the payload-delta can't see:** `php dev/scripts/detect_english_drift.php`. The payload-delta only finds *missing* keys; this flags keys whose *English changed* after a translation was written (the Task-129 blind spot). `--json` emits the resync key list. After any resync completes, `--update` re-baselines the manifest. Full workflow in `dev/translation-process.md` § "English-drift tripwire".

**Standard launch pattern:**
1. Tell the user: "Starting N agents, one for each language." (always say this before launching)
2. Spawn all agents in a single message with `run_in_background: true` and `model: "sonnet"` — Sonnet is mandatory for all translation agents, no exceptions. Haiku is deprecated for translation entirely (see Model policy below).
3. Each agent receives: the payload JSON path, the target lang file path, and full instructions including glossary terms, intent notes, and all translation rules

Always announce the launch count before spawning so the user knows what is happening.

**Every agent writes in ~50-key batches, saving each batch before translating the next. This is
mandatory and it goes in the prompt.** A sprint can be killed at any moment by an account session
limit nobody can see coming. An agent that composed everything in memory loses all of it; an agent
that has been appending keeps what is on disk. Measured cost is ~5–15k tokens out of ~120k per
agent (~10%) — the translations are output once either way, so only tool-call overhead is added.

**Batching is the throttle that works; the wave split is retired** (Tom, 2026-08-13). Sprint 251
ran both at once and separated them cleanly:

- **The wave split** — 5 agents at a time, stop and wait between waves — **did not prevent a limit**
  (wave 2 hit one anyway) and cost a verify/commit/report boundary each time. It buys *probability*,
  not protection, because a wave cannot prevent a limit it was already close to when it started.
- **The batched appends bounded the damage twice.** Khmer and Burmese each had exactly 100 keys on
  disk when wave 2 died, so 200 finished keys survived an interruption that, in all three earlier
  crashes, would have thrown everything away. They resumed at 189 keys each instead of 289.

So: **launch every language at once and rely on batching**, rather than splitting into waves. If a
future sprint loses a whole language's work despite batching, that is new evidence — reopen the
question then, and change one mechanism at a time.

**Do not bundle an unauthorized mechanism into an authorized one.** Batching was added to the
sprint-251 brief in the same breath as the wave split Tom had actually approved, which confounded
the experiment — two variables changed at once, so neither could be judged until a later wave
happened to separate them. Tom's objection was correct. Propose each mechanism on its own.

**Model policy** (Haiku fully deprecated for translation, 2026-07-12 — Tom): evidence from the 2026-07 rc_/ip_ sprint (`dev/translation-audit-rc-ip-2026-07.md`) showed Haiku mistranslated polysemous words in long prose and produced script contamination, escape leakage, and truncation in low-resource languages even with full glossary + intent injection. The suite previously carved out an exception allowing Haiku for "short-labels-only" batches; that exception is **removed** — even short labels carry real mistranslation risk (a wrong word in a 3-word label is just as wrong as one in a paragraph), and a standing exception is an easy trap to fall back into by habit. **Sonnet is mandatory for every translation agent, every batch size, every language, no exceptions.** Do not propose, launch, or accept Haiku for any translation task, including future sprints reasoning "it's just a short string."

**Every translation agent gets a suggestion box, and it is part of its prompt.** Tom, 2026-08-08:
*"**Every translator** needs a suggestion box, an ombudsman, and a place to file grievances about
the working conditions. And the sprint ends with a review of all the problems that surfaced and an
attempt to resolve them or refer to the human for attention."* So every agent prompt — every wave,
every language, every batch size — must ask the agent to **file structured entries for any English
string it had to guess at**, and the orchestrator writes them into
`dev/english-friction/<sprint>.json`. Structured, not prose: today's agents *did* volunteer real
findings (the tr agent caught the glossary's upstream-scope defect) and nothing routed them, because
a paragraph at the end of a report is not a queue. **Nothing is dismissed silently** — an entry
closes as `english`, `intent`, `glossary` or `dismissed` *with a reason*, or it escalates as
`refer-to-human` and stays open until the human rules.

**Post-sprint QA (mandatory, in order):**
0. `php dev/scripts/friction_check.php --sprint=<id>` — must exit 0. This is the sprint-close half
   of the same gate the launch used: every translator complaint answered, every escalation ruled on.
   A sprint is not closed while an entry is `open` or `refer-to-human`.
1. `php dev/scripts/lang_syntax_validate.php --lang=<codes>` — must be clean of escape-leakage,
   tag-imbalance, and foreign-script findings (identical-to-english warnings are advisory).
2. Tag-parity check of the sprinted keys against English (`<sub>/<sup>/<span>` sets must match).
3. Back-translation semantic check — mandatory, no "skip if no key" exception. If
   `ANTHROPIC_API_KEY` is set, run `php dev/scripts/backtranslate_check.php --lang=<code> --prefix=<p>`.
   **If it is not set (the common case here), do NOT log the step as skipped** — the orchestrating AI
   performs the same check inline: for every sprinted key, read the target-language string,
   back-translate it to English independently, and compare against the source meaning (same rigor, no
   billing). Applies retroactively to any wave that was closed without it.
4. **Glossary write-back — mandatory, not optional, no "later" exception (Tom, 2026-07-19).** Any
   confirmed terminology decision this sprint/stage produced — a wrong-term fix, a cross-key drift
   resolved, a new concept translated for the first time — gets written into `glossary.json`
   (`translations[lang]` + a dated `translation_notes` entry) **before the sprint/stage is
   considered closed**, not queued for a future cleanup pass. This applies identically to the
   Task 109 cross-language consistency-audit stages, not just new-calculator sprints: an audit
   agent's fix is exactly the kind of confirmed, reasoned decision the glossary exists to
   memorialize. Rationale: every stage was re-deriving the same terminology judgments from scratch
   because nothing fed audit findings back into the one place future agents actually consult —
   discovered as a gap after stage 5 (106 keys × 26 languages) closed with zero write-back across 5
   stages. A populated glossary entry turns a "re-read every sibling key and infer consistency"
   task into a one-line lookup for the *next* agent, in the *next* category, in the *next* language
   pass — savings that compound with every stage that follows, so back-filling the glossary now is
   strictly more valuable than deferring it until "after this stage."

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

## The review office: what runs free, what costs, and what nobody is watching (Tom, 2026-08-12)

Tom: *"I would like to be a better leader when it comes to budgeting and staffing the code review
office."* There are three tiers and they have very different prices. Knowing which tier a risk
belongs to IS the budgeting decision.

**Tier 1 — automated, seconds, free. `sh dev/scripts/check_all.sh` before every commit.**
Fifteen checks: PHP and JS syntax, HTML balance on every page, the pageConfig PHP→JS bridge, tip
markup via the helpers, language rules A–D, gloss pointers, layout tags, the coverage declaration, payload
freshness, the lpn harnesses, the calculator harnesses (both counts derived from the glob, never
typed — the lpn one read "12" while 15 were actually running), plus three advisory ones (key
hygiene, size budget, English drift). Blocking failures exit 1. **This list used to live only in prose and in whoever remembered
it** — a check nobody runs is indistinguishable from a check that does not exist, which is the same
failure that hid six Rock Chute notes and the missing `lpn`/`bpn` glossary wiring.

**THE PRACTICE BEHIND ALL OF THIS, and the one worth applying every time (2026-08-12): when you
are about to write a new rule in this file, first ask whether it can be a check. If it can, write
the check and let this file just name it.** The evidence is entirely local. Every rule that became
a script stopped being violated — Rules A–D, `gloss_ref_check`, the coverage declaration. Every
rule that stayed prose kept being violated, sometimes for months, *by people who had read it*:
`lang_syntax_validate.php` found 660 pre-existing double-quoted assignments; the missing
`prefixToTermNames()` wiring silently blinded two calculators' whole glossary while being
documented the entire time; the `.ec-help` nesting was retrofitted by hand on two pages after ~40
lines here explained it. A rule a machine enforces is worth roughly ten a human must remember.
This file is long enough that nobody re-reads it before an edit, so its unexecutable half is
decoration — and the honest response is to keep converting prose into checks, not to add more
prose.

**Tier 2 — `/code-review`, billed, and only a human can start it.** An AI cannot launch it; do not
try. It is what reads code for design, duplication and subtle logic errors — the entire class Tier 1
cannot see. Worth spending when a change (a) alters logic a person cannot confirm by using the page,
(b) touches storage, privacy, money or legal text, or (c) is cross-cutting. Not worth it for string
edits, roadmap prose, or anything Tier 1 fully covers. **The natural moments are the expensive-to-
undo ones:** before a 26-agent translation sprint, and before anything that changes what is stored
on a visitor's device.

**Tier 3 — Tom's own attention, the scarcest, and he has said he will not read code.** Correct, and
the tooling is built on that assumption. Reserve it for decisions the tools cannot make: naming,
scope, wording, and whether an unreferenced key is debt or lost content. Every one of those calls
he made on 2026-08-12 was in this tier and none of them could have been automated.

**THE GAP, NARROWED BUT NOT CLOSED (Task 292, 2026-08-13).** It used to read: the 19 non-lpn
calculators have no behavioural test at all. `dev/calc-spike/` now runs **every** calculator on its
own factory defaults in **both** unit presets and asserts it runs, writes no NaN/Infinity/undefined,
and opens on a passing design — plus worked examples for the two core calculators, `mpf_` and
`mtc_`. What remains uncovered, and should be said plainly rather than rounded off:

- **Seventeen calculators are checked for RUNNING, not for being RIGHT.** A wrong coefficient in
  Rock Chute or Orifice Drain Time still ships silently. That is deliberate — the value is
  concentrated, and a page nobody has edited in two years is not where a regression appears — but
  it means *"the harnesses pass"* is not *"the math is right"* for anything but mpf and mtc.
  **Add a worked example for the page you are editing**; `dev/calc-spike/README.md` is the recipe
  and it is under an hour.
- **Row-table calculators** (Branched-Network, Irrigation-Pressure, Manning-Irregular,
  Weir-Flow-Irregular) run, but the results inside their dynamic rows do not: building the rows
  needs a richer DOM than `calc-page.js` has. The smoke harness names them as it goes.

**And how a calculator became testable at all, since the obstacle was never the math.** Every
`pageCalculator` is already a pure function of its form — it reads `objForm[name].value` and writes
`getElementById(name).innerHTML`, and touches nothing else about a browser. The obstacle was that
the form lives in rendered PHP. `dev/scripts/dump_calc_form.php` renders the real page and hands
the harness the form it actually shipped: field names, page defaults, unit selects with their
families and options, both presets, the pageConfig strings, the script list. **Nothing about the
form is restated in a harness** — restating it builds a second copy that drifts, testing itself
while the page ships something else. There is no fixture on disk and therefore none to go stale.

**A page must be rendered at GLOBAL scope and ONE PAGE PER PROCESS** — `dev/scripts/render_page.php`
exists to be the only place that knows it. `include`ing a page from inside a *function* runs its
top-level code in that function's scope, so `$ec_lang` and the rest of the bootstrap land as locals
while every library function looking for them as globals finds nothing. The page still renders and
still looks like a page; it is simply missing its menus and 16 of its 17 unit selects. **This had
been true of `html_balance_check.php` since the day it was written** — every "ok" it printed was
about a 22 KB stub of a 45 KB page, so the results table was never actually checked. Fixed in the
same commit. And `lib/base.inc.php` is `require_once`d, so a second page in the same process
renders as a fragment: a caller wanting several pages runs the renderer once per page.

**A page's SI defaults are reachable only through the LANGUAGE.** `EC_DEFAULT_UNIT_SET` is derived
from it (`en` → `us`, everything else → `si`), and clicking the SI button afterwards reinterprets
the typed numbers rather than converting them — so `units('si')` turns an 18 in pipe into an 18 mm
one, which is correct behaviour and useless as a defaults test. `loadCalculator(page, { lang: 'es' })`
is how the SI defaults get tested, and it is why the smoke harness renders everything twice.

**How to make an untestable file testable — the Task 293 pattern, 2026-08-13.** `looped-network.js`
was 8,700 lines with ~30 shared mutable closure variables, so nothing in it could be reached without
a browser, and the earlier harnesses coped by reading it as TEXT and brace-matching a function out
of it (`extract()` in `backdrop-scale-harness.js` and four others). That works, but it tests a
*copy* in a context the browser never has: a function lifted out of its closure sees whatever stubs
the harness defines, so a harness can pass while the real call site is broken.
- **Split by PURITY, not by subject.** `js/lpn-geom.js` and `js/lpn-collide.js` take values and
  return values — no DOM, no `doc`, no `nodeEls`, no settings, no closure variables. A module that
  still reached back into the editor's closure would be just as untestable, one file further away,
  which is why "split it into files" was explicitly not the task.
- **What is left behind is the GATHERING** — turning `doc`, the element handles and the current font
  size into plain arguments. That part still needs a browser and that is fine; it is thin enough to
  read.
- **Prove the lift is behaviour-preserving before trusting the new tests.** A fuzz comparing each new
  function against the pre-refactor body from `git show HEAD:` over a few thousand random inputs is
  minutes of work and is the only thing that distinguishes a refactor from a rewrite.
- **A new module must be added in THREE places or the harnesses break in a confusing way:** the
  `<script>` tags in `Looped-Network.php`, `dev/lpn-spike/lpn-dom-stub.js`, and any harness that
  eval's `looped-network.js` itself. Use **indirect** eval — `(0, eval)(src)` — in those harnesses;
  a direct eval hoists its own `var EngCalcs` and starts a second, empty one.

## Renaming a language key, and finding key debt (Tom, 2026-08-12)

Tom does not review code directly and has said he will not. So key debt has to be found by a tool
and paid by a command, not by anybody reading diffs.

- **Never rename a key by hand.** `php dev/scripts/rename_lang_key.php old new --apply` does all 27
  language files, `$ec_lang_syn`, every page and JS call site, the drift manifest, the exempt list
  and the coverage declaration in one pass. Dry run by default. It refuses if the new name already
  exists — a rename must never quietly merge two keys.
  **Why this matters more than it sounds:** a hand rename is ~40 edits and every miss fails
  SILENTLY — a missed lang file leaves an orphan, a missed call site renders an empty string, a
  missed manifest entry makes the drift detector report a removal and an addition for one unchanged
  string. That expense is what made leaving a bad name the rational choice, and it is why bad names
  accumulated. It does **not** rewrite `dev/english-friction/*.json`, which is a dated record of
  what was decided at the time; it reports those hits instead.
- **`php dev/scripts/key_hygiene_check.php`** reports keys rendered by nothing (each costs 27
  translated strings, forever) and suffix names that drifted from their siblings. Advisory, exits 0;
  `--strict` to fail. Run it when a calculator's strings change substantially.
- **A key rendered by nothing is not automatically debt.** It may be parked for a returning feature
  (`lpn_settings_emitter_exponent`, Task 191) or it may be content a page lost (`rc_notes_*`, Task
  290). Decide per key; never bulk-delete.
- **Name new keys parallel to their siblings.** `lpn_settings_scope_project` /
  `lpn_settings_scope_calculator`, not `..._scope_note` / `..._scope_calculator`. Non-parallel names
  cost every future reader a lookup, which is Tom's own objection and a correct one.
- **And keep the VALUES parallel, in all 27 files — that is where it actually broke.** Those two
  keys were renamed into parallel *names* while es/fr/pt/tr still carried the pre-rename *value*:
  a full sentence ("Se guarda con este proyecto.", "Enregistré avec ce projet.") sitting beside a
  correctly parallel "Configuración de la calculadora". Tom spotted it by eye on 2026-08-13 —
  *"Project and Calculator settings should be parallel always. I am not always finding this."* —
  and it was in the four highest-use languages, i.e. ~98% of measured use. When you edit one member
  of a sibling set, read the whole set **across every language**, not just in English.

**A key that changes ROLE is the expensive kind of drift, and the tripwire now says so.** That
defect began as `lpn_settings_scope_note` = *'Saved with this project.'* — a note. The English
later became *'Project settings'* — a heading. Four languages had been translated from the note and
never resynced, and the manifest was re-baselined anyway, so the evidence was erased. Three
changes, all in `detect_english_drift.php` (Tom, 2026-08-13):

- **Blanket `--update` now REFUSES while any key is still CHANGED.** It tells you to resync and use
  `--update=<key> --reason="..."` per key (which already verifies each one). Discarding signals
  wholesale requires `--force` *and* a `--reason`, which is recorded in the manifest.
- **The report flags ROLE CHANGE** — a key that gained or lost terminal sentence punctuation, or
  changed length by more than half. A hash only ever said "some edit"; role is the part that makes
  an otherwise-correct translation read wrong.
- **`--record-shapes`** back-fills the shape fingerprints without touching a single hash, recording
  them only for keys already in sync (where "current shape" genuinely *is* "last-synced shape").
  CHANGED keys are skipped and named, because their pre-drift shape is unrecoverable and guessing
  it would be worse than admitting the gap.

**`--baseline-new` closes a sprint, and a sprint is not finished until you run it.** A key added and
translated by a sprint stayed `NEW` forever, because only `--update` could baseline it and `--update`
is refused while any drift is open. That deadlock made a later English edit to such a key invisible
to **both** tools at once: the payload delta sees a translated key and reports zero, and the drift
report files it under NEW rather than CHANGED. Demonstrated 2026-08-13 — changing "EPANET engine" to
"EPANET solver" across five keys produced **a delta of zero and no CHANGED flag**, with 26 stale
translations sitting behind it. Add to the post-sprint QA list:

```
php dev/scripts/detect_english_drift.php --baseline-new            # after the sprint's keys land
php dev/scripts/detect_english_drift.php --baseline-new --except=k1,k2   # hold back any key whose
                                                                        # English you edited AFTER
```
Use `--except` for exactly that case; baselining a key you have since edited buries the staleness.

## Unit Sets

A field declares a **named unit family**, never an inline array (ROADMAP Task 162):

```php
Array('name' => 'd', 'type' => 'number', 'default' => '6', 'units' => 'distance_small', ...)
```

Families live in `lib/Units.lib.php` (`$ec_unit_families`), and the two presets — `us` and `si` —
map every family to one unit (`$ec_unit_sets`). `EC_DEFAULT_UNIT_SET` picks which preset a
first-time visitor sees, **derived from the current language**: `en` gets `us`, every other language
gets `si`. Returning visitors are unaffected — the cookie stores each select's option value.

- **Split a family when two fields want different *defaults*, not when they want different
  *options*.** `distance_small` and `distance_large` offer the identical four units and exist purely
  to carry different defaults (inches for a pipe diameter, feet for a pipe length). Merging them
  re-creates the original defect, where a 1,000 ft main rendered as 12,000 in, because one family
  can only name one default. Where two families share a list, share the PHP variable rather than
  duplicating it.
- **Which family a field names is a per-page choice**, not a global property of the field name. The
  same concept is `distance_small` on a pipe page and `distance_large` on a channel page; `flow_pipe`
  (gpm) on a waterline calculator and `flow_channel` (cfs) on a storm drain or channel one. There is
  no page-level override mechanism because the page already chooses.
- **Every family must appear in every preset.** A missing entry silently leaves that field alone,
  which is the class of bug this design removed. Adding a family means adding it to `us` and `si`.
- **A page's `default` number is in the *displayed* unit**, so a unit-bearing field declares one per
  preset: `'default' => Array('us' => '6', 'si' => '150')`. A scalar is correct only when the value
  is unit-independent (dimensionless, blank, or exactly `0`). Getting this wrong is silent — a
  scalar `6` reads as 6 in under `us` and 6 mm under `si`.
- **A page that seeds sample rows from JS must seed them per preset too**, keying off
  `EngCalcs.defaultUnitSet`. Hard-coded metric seeds read under `us` produced a 100-inch pipe.
- **Changing a unit select reinterprets the typed number, it does not convert it** (1 becomes 1 ft
  instead of 1 m). Long-standing and deliberate — reviewed and kept 2026-07-28. Do not "fix" it.
  **This is now absolute, and `lpn_` was the one place that broke it** (ROADMAP Task 263, Tom
  2026-08-10: *"a bad design decision was made without my knowledge to convert inputs when units are
  switched. Scrub and ban this."*). `lpn_` stored SI and displayed the conversion, so every unit
  switch silently rewrote the whole map. EPANET behaves the same way we do — switching GPM to LPS
  converts nothing — so there is no authority on the other side of this. **A calculator stores what
  the user typed. Conversion happens at the solver, and on results coming back from it, and nowhere
  else.** If a third conversion site seems necessary, the design is wrong.
- **`lpn_` only: there are no browser units, only PROJECT units** (Tom, 2026-08-10). A project
  records its own unit selection (`serializeProject().units`) and restores it on open, because
  declarative storage makes a bare number meaningless without them — *"imagine opening a 400
  diameter pipe into an inch browser!"* Consequences, all deliberate:
  - **No "save these units as my defaults"**, and no per-browser unit cookie for this page. Tom's
    answer to "where do my preferred settings live" is that the user **saves an empty template
    project** and opens it — which also carries ID prefixes, default inputs and map appearance, not
    just units. One mechanism instead of two.
  - Switching a unit reinterprets **that project**, and is persisted to it immediately.
  - A document written before this (`v` ≤ 2) holds SI and names no units; opening one offers a
    one-time conversion (`offerUnitRestore()`), asks before rewriting anything, and defaults to No.
  - The other 19 calculators are unaffected — they have no document, so a unit select there is
    exactly the per-page control it always was.
- **Keep one page's cross-section geometry in one family.** A pipe page reads diameter, depth, top
  width, wetted perimeter and hydraulic radius all in inches; a channel page reads them all in feet.
  Mixing them within a page (an 18 in pipe reporting `T` = 1.5 ft) is the defect to avoid.
- **Choose defaults that open on a *passing* design.** Every calculator's velocity/verdict check
  should read OK on arrival; a page that greets a first-time visitor with a warning is worse than one
  that greets them with a worked example. Verify by running the page's own `pageCalculator` against
  its rendered HTML, not by inspection.
- **`echoUnitSelect()` still accepts a raw array** for backward compatibility, but such a select gets
  no family and is therefore **invisible to the preset buttons**. Never leave a new one that way —
  this is how 32 row-table selects were nearly shipped ignoring the presets.

Unit conversion factors (`$ec_units`) are "number of that unit per SI unit" — multiply a SI value by
the factor to display it, divide to store it.

Full design record and per-field rationale: `dev/unit-families.md`.

## What may be stored on a visitor's device (ROADMAP Task 286, shipped 2026-08-12)

Full inventory and reasoning: `dev/cookie-storage-inventory.md`. The rules a change has to respect:

- **Never call `session_start()`.** Call `ecSessionStart()` (`lib/config.inc.php`), which starts one
  only for a visitor who consented, and **write the caller to work when it returns false** — that
  is the normal case, not the error case. `lib/base.inc.php` used to start a session at the top of
  every page load, which wrote `PHPSESSID` before anybody had been asked anything; a banner cannot
  fix that from the outside, which is why this rule is absolute rather than a preference.
- **The session is analytics ONLY.** It exists to de-duplicate the usage logs. Do not put a
  service-related value in it — that is what made `PHPSESSID` a mixed-purpose cookie and therefore
  unlawful under a per-purpose test. A visitor preference belongs in its own cookie that the
  visitor set deliberately (`ec_language` is the worked example).
- **New storage needs the exemption test, per purpose:** is it *strictly necessary for a service
  the visitor explicitly requested*? User-input storage (what they typed), an explicit preference,
  the consent record and the log opt-out all pass. Anything whose job is to make a **statistic**
  better fails, whatever technology it uses — `localStorage`, `sessionStorage` and IndexedDB are in
  scope exactly as cookies are. Gate a failing item on `ecAnalyticsConsented()` server-side or
  `EngCalcs.analyticsConsented()` client-side, and make withdrawal delete it.
- **A new log writer must call `ecLogBucketSuffix()`** and append it to the line. Consented rows
  are deduplicated and unmarked; everyone else's are marked `visit`, undeduplicated, and reported
  in their own section of `log/lang-log-stats.sh`. **Never sum the two buckets** — one counts
  people and the other counts page loads.
- **Never restyle one consent button to stand out.** `.ec-consent-btn` styles both answers
  identically on purpose; a coloured Accept beside a grey Reject is the dark pattern this design
  exists to avoid.
- **Cookie lifetimes are defensible out loud.** One year is the house default. The page-input
  cookie sat at 36,000 days (~98 years) until this task.

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
| `js/PipeHydraulics.lib.js` | The suite's one Hazen-Williams constant pair (EPANET's) and `hwSlope()` — load before any calculator that uses it |
| `js/lpn-geom.js` | `lpn_` map editor's pure geometry — polyline arc-length, the arrow dodge, leader attachment + hysteresis, label box/mask rects. No DOM. Harness: `dev/lpn-spike/geom-harness.js` |
| `js/lpn-collide.js` | `lpn_` label collision avoidance as pure weighted-box relaxation. No DOM. Harness: `dev/lpn-spike/collide-harness.js` |
| `dev/scripts/render_page.php` | Renders ONE page to stdout, at global scope, one page per process. The only correct way to render a page outside a web request — see the review-office section |
| `dev/scripts/dump_calc_form.php` | Renders a calculator page and dumps its form as JSON (fields, defaults, unit selects, presets, pageConfig, scripts) for the Node harnesses |
| `dev/calc-spike/calc-page.js` | Headless scaffolding for the non-lpn calculators: builds a form from the dumped page, runs the real `pageCalculator`, reads results. Harnesses: `dev/calc-spike/*-harness.js` |
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
| `dev/calc-spike/` | Headless behavioural tests for the non-lpn calculators (Task 292). See its README |
| `dev/lpn-spike/` | Headless tests for the lpn solver and map editor |
| `dev/translation_payloads/` | Per-language JSON payloads for translation sprints |
| `dev/scripts/glossary.json` | Engineering term glossary for translation prompts |

**Note for scripts:** paths to `lib/` inside `dev/scripts/*.php` use `__DIR__ . '/../../lib'` (two levels up from `dev/scripts/`).
