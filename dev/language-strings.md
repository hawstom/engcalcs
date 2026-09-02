# Language strings: the full rules

Extracted from `CLAUDE.md` on 2026-08-16 so the file read every session stays short. `CLAUDE.md`
keeps the four hard rules and the routing table; everything below is the detail behind them.
Read this when you are writing or editing `$ec_lang` / `$ec_lang_syn` values.

Copyright 2009 Thomas Gail Haws. GNU GPL v3 or later.

All display strings live in `lib/lang.ec.??.php` (en + 26: am, ar, bg, bn, cs, de, es, fa, fr, he,
hi, hr, id, it, km, my, ps, pt, ro, ru, sr, sw, tr, uk, ur, zh). Keys follow `prefix_description`.

### Rules A–D — all four enforced by `lang_syntax_validate.php`

The script names the violation and the fix in its own error text. Trust it; do not add prose on top.

| Rule | What it requires |
|---|---|
| **A** | Never an HTML entity in any language string, anywhere. Use the literal UTF-8 character — `—` not `&mdash;`, `≈` not `&asymp;`, `²` not `&sup2;`, `&` not `&amp;`. Absolute, because whether an entity survives depends on the call site, which is invisible from the string. |
| **B** | Never an HTML tag in a plain-text-constrained string (`title` `placeholder` `value` `alt` `aria-label` `data-*`). A `<sub>` in a `title=` is never a subscript by any route. "Reaches plain text" is **derived from the source** by `plainTextBoundKeys()`, not from the key's name; tooltips written inside another key's `title=""` are covered too. |
| **C** | Advisory, off by default (`--rule-c`): reports where a key's name and its derivation disagree. 31 keys disagree on purpose, which is why it is not blocking. Run it after touching a call site. |
| **D** | Language strings are single-quoted: `$ec_lang['k']='value';`, apostrophes escaped `\'`. A double-quoted value **interpolates** — one Spanish key silently depended on another being assigned earlier in the same file, which the key-order normalizer would have blanked invisibly. |

Both parsers come from `dev/scripts/lang_parse.inc.php`, which reads either quoting form on purpose:
a parser that only understood the standard could not report a violation of it. `ecLangRawValues()`
(escapes intact) is for syntax rules; `ecLangValues()` (escapes resolved) is for comparison.

Not covered: hardcoded entities in `lib/HeadersFooters.lib.php` and per-page SEO meta tags, which are
not language strings.

### No house style for English source strings

**Tom, 2026-09-01: *"Anywhere you find anything addressing the need for a certain kind of English or
language, just strike it. Let's trust our synonyms, glossary, scripts, and feedback procedures."***

**What stood here and is gone.** A rule telling writers to prefer "Simple English" in explanatory
strings. It was read as a goal in itself and produced strings a hydraulic engineer does not
recognise — `Rest pressure` for static pressure, `Pulled down` for drawdown, `settle` for converge,
`Solves` for runs, and, after two rounds of written correction, `The usual value is {n}.` where the
word is **default**. Tom, on that last one: *"please quit making up things to avoid the obvious
terms."* Rewording the rule was tried, on the day, and struck too: a third qualification of a rule
that had already failed twice is not a fix.

**What replaces it: nothing, deliberately.** The mechanisms that were always the real ones carry it
instead — `$ec_lang_syn` for what a translator cannot recover from the words, `glossary.json` for a
concept that recurs, `dev/scripts/plain_english_swap_check.php` for substitutions that have actually
shipped and been struck, and Tom reading `dev/new-english-keys.md`. Each of those is evidence about
a specific string. A house style is a prediction about every future string, and this one predicted
wrong every time it was applied.

**So: write the string. Do not reach for a simpler synonym of a word that already names something.**
There is no register to hit, no word count to hit, and nothing here to cite in defence of replacing
a conventional term.

**Identity strings (menu entry + `<title>`) match the authoritative published source's own
terminology.** Robinson's paper is titled "Design of Rock Chutes", so `rc_main_menu` says "Rock
Chute Design (Robinson)". These are the calculator's *name* — what a returning user searches for and
bookmarks. Do not casually rename them. *(Kept because it is a rule about SOURCES, not about a kind
of English: it says whose words to use, not what sort of words to prefer.)*

- **Never force a language into a calque of the English wording**, in either role. An audit found 6
  of 26 languages had transliterated "riprap" and 2 had transliterated "chute" — real defects — but
  5 of those 6 already had natural, non-transliterated identity strings. Let the translator choose
  whatever real phrase native engineers use: match the *concept*, not the English words.
- **Do not rename eponyms or bibliographic citations** — Manning, Darcy-Weisbach, Robinson and actual
  paper titles stay as published in every role.

This governs new calculators from day one, not just retrofits.

### `$ec_lang_syn` — synonyms and alternate expressions

**It answers exactly one question, asked by a translator: "what other ways could this be said?" — and
it answers in words, not commentary.** It is not a place to describe a label, explain a decision, or
leave notes for a human.

**THE SUBSTITUTION TEST, the one rule that separates a synonym from a description:** every phrase must
be able to **stand in the slot**. You could put it on that button, that heading, that label, and it
would still mean the right thing. If a phrase could not go on the control, it is a description.

```php
// ✅ every item could be the label
$ec_lang_syn['lpn_new_text']='Text, Label, Temporary Text, Placeholder, Unfinished text, or Default words';
// ❌ none of this could ever be the label
$ec_lang_syn['lpn_new_text']='The word that appears inside a new text label when it is first placed.';
```

Description is the failure mode this channel drifts into every single time. Apply the test to every
phrase, including the ones inside parentheses.

**When it is needed: whenever the plain meaning is not what the English words literally say.** That
is much broader than jargon — do **not** gate it on jargon or transliteration risk. The labels that
hurt most in a recent sprint ("Zoom to fit", "Restore defaults") are all plain English.

```php
// A known idiom, but "fit" never names WHAT is fitted.
$ec_lang_syn['lpn_tool_zoom_extent']='Zoom out (or in) until the whole drawing fits in the window; show everything at once (zoom to extents, fit to window, show all). | avoid: adjusting the zoom by an amount';
// "Defaults" is standard English but its plain meaning is "the original values".
$ec_lang_syn['calc_defaults']='Restore (revert, return) to the original (initial, as-shipped, factory) values (state).';
```

**Fragment or whole string?** One test:

| What is unclear | Shape |
|---|---|
| A **word** — one term is ambiguous, jargon, or a polysemy trap | **Fragment**: a word bank of alternates for that word alone. The translator can parse the sentence; they are stuck on one slot. |
| The **structure** — the words are individually plain but relate in more than one way | **Whole string, rephrased.** Alternates for one word cannot fix a parse. |

**`$ec_lang_syn` is OFF-LIMITS to AI.** Never add, change or remove an entry without explicit written
permission in that conversation. The pattern is: AI proposes entries as a diff in the conversation;
the human approves; only then does AI write them. There are **no standing carve-outs.**

### Routing rule: English, intent, or glossary?

One question decides it: **does an English reader also stumble?**

| Test | Home | Why |
|---|---|---|
| An English reader must re-read, or can read it two ways | **Fix the English** | Defective for its own audience. One edit fixes all 27 languages. |
| English is correct and idiomatic, but a translator cannot recover the concept from the words | **`$ec_lang_syn`** | The English reader is served; the translator is not. |
| The concept recurs across labels or calculators | **`glossary.json`** | It is about consistency across call sites, not one label. |

They compose. "Map display and sizes" had two valid parses, so the English was fixed (→ "Map
appearance"); "Zoom to fit" reads fine, so the English stayed and a synonym entry carries the rest.

**Division of labor — do not duplicate a FACT across the three channels** (that is how stale values
drift), though a label may legitimately carry both a `gloss:` pointer and its own synonyms:

- **`glossary.json` — per concept.** One entry, referenced by every label that uses the term. Single
  source of truth for plain meaning, English synonyms, each language's dominant standard translation,
  `avoid` lists, and sourcing.
- **`$ec_lang_syn` — per label.** Alternate wordings of *this* label.
- **Visible `.ec-help`/`.ec-tip` tips — user-facing definition.** Translated with the label, so a
  plain-language definition here helps the user *and* anchors the concept for translators. A tip
  serves the reader; a synonym entry serves the translator. Both may exist and that is not
  duplication.

### `gloss:` pointers vs repeated synonyms

**Prefer the pointer when nothing but the concept is left** — one entry to maintain instead of the
same gloss copied into four labels, and `glossary.json` can carry an `avoid` list an inline
parenthetical cannot.

**The test, applied after trimming:** does the entry still carry a wording a translator cannot get
from the glossary? If yes, keep both — the pointer *accompanies* the synonyms. If the entry was only
`X (Y)` where Y is the concept gloss, the pointer alone is better.

**A pointer buys efficiency with a DEPENDENCY.** A glossary term reaches an agent only if the key's
prefix is wired in `prefixToTermNames()`. **`php dev/scripts/gloss_ref_check.php` must exit 0 before
any sprint** — it verifies every `gloss:` names a real term AND that the term is wired to that key's
prefix.

**Positive guidance beats negative guidance.** An `avoid` list tells a translator which ditch to
miss, not where the road is. Reach for `avoid` only for a genuine polysemy trap (financial "default",
anatomical "head"), never as a substitute for saying plainly what the label means.

### Polysemy / units-trap protocol

A **trap term** is one where the English word has a non-obvious technical meaning a translator is
liable to get wrong — a polysemy (hydraulic "head"), a units confusion ("specific gravity" is a
dimensionless *ratio*), or a transliteration lure ("chute", "riprap", "penstock"). The same mistake
recurs language after language, sprint after sprint. Give a trap term **all three**, in order:

1. **English-reform gate first — the English is not sacred.** If the wording is weak or jargonistic,
   reform the `$ec_lang` value; that fixes all 26 languages at the source. Identity strings are
   exempt. Example: "station" (a bus-stop mistranslation trap) is best fixed by allowing the plain
   alias "Distance", not by guarding the jargon.
2. **A root glossary entry with a structured `avoid` array.** Put the concept — including the *root*
   word, not only its compounds — in `glossary.json`. Keep **compounds** as the authoritative
   translatable units (a compound's idiomatic translation is not the concatenation of its atoms:
   "velocity head" → fr "hauteur de vitesse"); the root atom is an **anchor** carrying the shared
   guard, never an ingredient to compose from.
   **`avoid` may only forbid physical/structural errors and lazy transliterations — never a term
   that is a language's genuine standard.** We defer to each language's dominant term; **we are not
   the judges of terminology, the culture is.** This is why the English source keeps "Specific
   gravity" rather than "relative density". For a units trap, forbid *attaching units to the value*,
   not the *word* — a weight-flavoured term that is the local standard (tr "özgül ağırlık") is
   correct.
3. **A visible definitional tip on any input label** (specific gravity → "Density relative to
   water"), plus a **commentary-only** guard (`| avoid: anatomical "head"`) so no translatable
   payload is duplicated. This is the one sanctioned case where a plain label gets an `avoid`.

**"Head" is NOT a units trap the way specific gravity is.** The suite reads head loss in psi/kPa/bar
as well as metres and defaults to psi under the US preset (`partial_head` in `lib/Units.lib.php`).
Only *total* head — EGL/HGL — is water-column-only, because an EGL is an elevation. German
*Druckverlust*, French *perte de charge* and Urdu *دباؤ نقصان* are all correct and an `avoid` must
never forbid them. **A glossary claim about units is a claim about `Units.lib.php` — check it there
rather than reasoning from physics alone.**

The `avoid` arrays are the single source of truth for the trap-term watchlist
(`dev/scripts/list_trap_terms.php`). Never maintain a separate watchlist.

### `$ec_lang_syn` format: `<synonyms> | <commentary>`

Split on the first pipe. **Left:** the synonyms — the translatable payload, every phrase passing the
substitution test. May freely contain parentheses. **Right:** production/layout notes, not
translated; the payload generator strips it. No pipe means the whole string is synonyms.

**Never put commentary in bare parentheses on the left** — parentheses are reserved for synonyms and
are ambiguous with real content (e.g. `(as in HEC-RAS)`).

Commentary uses this tag vocabulary (`tag: value`, `; `-separated; some are bare flags).
`layout_tag_check.php` reads its vocabulary from this table, so an undefined token fails the build.

| Tag | Value | Full instruction it stands for |
|-----|-------|-------------------------------|
| `layout` | `column heading` | Renders as a header in a very narrow fixed-width results-table column; keep as short as the language allows. |
| `layout` | `unit token` | Renders inside a narrow units selector; keep the token as short as the language allows. |
| `layout` | `nav item` | Renders as a top-level item in a HORIZONTAL BAR, competing for width with every sibling; prefer the shortest synonym. **A row inside a pull-down is NOT a nav item** — a pop-up sizes to its own widest row and competes with nothing. |
| `layout` | `button` | A button label competing for width with siblings; short and imperative. |
| `avoid` | *(wrong sense)* | Must not be read or translated in the named sense. |
| `symbol` | *(flag)* | Contains a variable symbol; keep every letter and subscript exactly as in English in every language, including RTL. Subscripted names are symbols, not words. |
| `gloss` | *(term)* | Defer to that `glossary.json` term; do not restate it inline. |
| `runtime` | `units appended` | The page concatenates a unit label at render time; do not name a unit inside the text, and leave room for one. |

**A WRONG TAG IS WORSE THAN A MISSING ONE.** A tag is an instruction a translator obeys without being
able to see whether it is still true, and it describes a WIDGET — so it goes stale silently whenever
the widget changes. One stale `layout: nav item` described a `<select>` that had been replaced by a
menu button, and four translators in one sprint dutifully compressed the label, one proposing we
shorten the English so every language would inherit the cut. All four reasoned correctly from a
constraint that had been false for weeks. `layout_tag_check.php` now verifies the value is in the
vocabulary, that a `column heading` really is inside a `<th>`, that a `unit token` is named `u_*`,
and that a `nav item` is not merely a pull-down row.

### Renaming a key, and finding key debt

- **Never rename a key by hand.** `php dev/scripts/rename_lang_key.php old new --apply` does all 27
  language files, `$ec_lang_syn`, every page and JS call site, the drift manifest, the exempt list
  and the coverage declaration in one pass. Dry run by default; refuses if the new name exists, so a
  rename never quietly merges two keys. A hand rename is ~40 edits and every miss fails **silently** —
  a missed lang file leaves an orphan, a missed call site renders an empty string. That expense is
  what made leaving a bad name the rational choice. It does not rewrite `dev/english-friction/*.json`
  (a dated record) and reports those hits instead.
- **`php dev/scripts/key_hygiene_check.php`** reports keys rendered by nothing (each costs 27
  translated strings forever) and suffix names that drifted from their siblings. Advisory.
- **A key rendered by nothing is not automatically debt.** It may be parked for a returning feature,
  or it may be content a page lost. Decide per key; never bulk-delete.
- **Name new keys parallel to their siblings** — `lpn_settings_scope_project` /
  `lpn_settings_scope_calculator`, not `..._scope_note` / `..._scope_calculator`.
- **And keep the VALUES parallel in all 27 files.** Those two keys were renamed into parallel names
  while es/fr/pt/tr still carried the pre-rename value — a full sentence sitting beside a correctly
  parallel heading, in the four highest-use languages. When you edit one member of a sibling set,
  read the whole set **across every language**.
- **A key that changes ROLE is the expensive kind of drift** (a note becoming a heading). Four
  languages were translated from the note and never resynced, and the manifest was re-baselined
  anyway, erasing the evidence. `detect_english_drift.php` now flags role change — a key that gained
  or lost terminal sentence punctuation, or changed length by more than half — because a hash only
  ever says "some edit".

---
