# Conventions — full record

Moved verbatim out of `CLAUDE.md` on 2026-09-23 when that file was compacted: bootstrap, agents,
prefixes, adding a calculator, labels, language keys, translation sprints, testing and writing
things down. CLAUDE.md keeps the short rule; this keeps the reasoning.

## Application Bootstrap

Every page starts with `require_once('lib/base.inc.php');` — config, language, units, menus, and the
calculator form library. The global `$ec_lang[]` holds all localized strings for the current
language.

`lib/config.inc.php` reads `APP_ENV`: `development` → `DEBUG_MODE=true` (shows HTML validator links);
anything else → false.

### Key files

| File | Purpose |
|------|---------|
| `lib/base.inc.php` | Master bootstrap — include this and nothing else |
| `lib/Calculators.lib.php` | `echoCalculatorForm()`, `ecTipLabel()`, `ecLinkTipLabel()` |
| `lib/Menus.lib.php` | `echoMainMenu()`, `echoHeader()`, `echoFooter()` |
| `lib/Units.lib.php` | Unit families, presets, conversion factors |
| `lib/Canonical.lib.php` | `ecCanonicalPaths()` — which URL a page nominates, the one place a pretty URL is declared |
| `lib/Language.lib.php` | Language detection and switching |
| `lib/Language.Settings.php` | Per-language `QUALITY` weight used in Accept-Language negotiation |
| `lib/lang.ec.??.php` | Localized string arrays (27 files) |
| `js/Calculators.lib.js` | Client-side calculation engine, unit conversion, form wiring |
| `js/Manning.lib.js` | Shared Manning/irregular geometry and sketch rendering |
| `js/PipeHydraulics.lib.js` | The suite's one Hazen-Williams constant pair (EPANET's) and `hwSlope()` |
| `js/lpn-geom.js` | `lpn_` pure geometry — arc-length, arrow dodge, leader attachment, label rects. No DOM |
| `js/lpn-collide.js` | `lpn_` label collision avoidance as pure weighted-box relaxation. No DOM |
| `js/lpn-solver.js` | Looped-network global gradient algorithm |
| `js/lpn-epanet.js` | Bridge to the vendored EPANET engine |
| `js/lpn-inp.js` | EPANET `.inp` import |
| `js/lpn-rules.js` | `lpn_` EPANET `[RULES]` grammar: parse a rule, know each clause's quantity kind, convert. No DOM |
| `js/looped-network.js` | `lpn_` map editor |
| `css/engcalcs.css` | App-wide styles |

### Specialist agents (`.claude/agents/`, journals in `dev/agents/`)

Persistent agents with a library, a journal and a research programme. **Six seats are filled:**
`utility-planning-engineer` (2026-08-24, the design-and-planning engineer inside a water utility --
Tom: *"Scale is my big and first blind spot... I have designed many Elm Street Center projects, but
no Novatos."*), `utility-field-operator` (2026-08-25, the map read on a phone in the street),
`market-researcher` and `data-entry-clerk` (both 2026-09-04 -- the world outside this repository,
and entry at volume by keyboard), `interface-designer` (2026-09-09, Ida -- visual hierarchy and the
frame around the content), and **`pre-reviewer` (2026-09-19, on Tom's own ask: *"I just want
independent review, not self-review, of all work before I see it"*). It runs on every branch after
the build agent reports and BEFORE Tom is told the branch is ready, and it REPORTS rather than
fixes** -- a reviewer who repairs the work becomes its author and stops being independent. The two
failures it was made from are in its journal, both from the day it was hired, and both the same
shape: an agent verifying that it had done what it set out to do rather than that the result was
what was asked for. **An agent must carry something this repo does not
already have** -- external evidence, or a vantage point nobody occupies; an agent briefed from our
own prose is an echo chamber in a second voice. Roster, the provenance rules, and the seats named
but not filled: `dev/agents/README.md`. **Each agent keeps its own ranked wish list** — its
priorities, in its order, expected to disagree with `dev/ROADMAP.md` and to say why. An agent
never edits the roadmap; promoting a row is Tom's call.

### Dev folder (`dev/`, blocked from web access)

| Path | Purpose |
|------|---------|
| `dev/ROADMAP.md` | OPEN tasks only. Format `Priority\|ID\|status Description` |
| `dev/roadmap-closed-ids.md` | One line per closed ID, so a cited `Task N` resolves. An index, not a record — the text is in git |
| `dev/scripts/` | All CLI tools and checks |
| `dev/scripts/glossary.json` | Engineering term glossary for translation prompts |
| `dev/calc-spike/` | Headless behavioural tests for the non-lpn calculators. `calc-page.js` is the scaffolding; `README.md` is the recipe for a new worked example |
| `dev/lpn-spike/` | Headless tests for the lpn solver and map editor |
| `dev/translation_payloads/` | Per-language JSON payloads for translation sprints |
| `dev/language-strings.md` | Full rules for writing `$ec_lang` / `$ec_lang_syn` values |
| `dev/translation-process.md` | Sprint SOP and full mechanics |
| `dev/testing-notes.md` | What actually catches defects here |
| `dev/english-key-rulings.json` | Tom's approvals of English strings, keyed on the EXACT text ruled on, so a ruling lapses by itself when the wording changes. `new_english_keys.php` prints them back and leads with the count still to read. **Never hand-edit `dev/new-english-keys.md` expecting it to survive** — `--write` refuses over a hand-edited file, which is the guard that exists because his first pass was lost |
| `dev/enforceable-rules-survey.md` | Which of this file's rules a script COULD hold, ranked, with the count: 75 enforced, 4 left that no blocking check can hold, 41 permanently prose (Task 322) |
| `dev/session-handoff.md` | **READ THIS FIRST, BEFORE THE ROADMAP.** What a cold session needs from the last one, sorted into RULINGS (permanent), TRAPS (permanent, measured here) and STATE (dated, perishable). **Its top block is the current FREEZE, the capability branches you may not merge, and any open deploy blocker** -- on 2026-09-14 it gained a STOP header, because a session that skipped this file merged six capability branches onto master against Tom's own plan recorded inside it. **Delete a state line once you have checked it** |
| `dev/cross-platform-planning.md` | Claude Code / Copilot collaboration conventions |
| `dev/unit-families.md` | Unit-family design record and per-field rationale |
| `dev/cookie-storage-inventory.md` | Everything stored on a visitor's device, and why |
| `dev/scenario-seam-repair.md` | The `setProp()` write-seam incident and its guard |
| `dev/positioning.md` | How `lpn_` is positioned against epanet-js; LibreEPANET.org. **Authority for every public claim, this repo's and the landing page's alike** |
| `dev/librewaternet-landing.md` | The landing page left this repo 2026-08-24; where it went and what stayed |
| `dev/reputation-and-practice.md` | **The plan from 18 Sep 2026** (Task 676). Why the reputation damage came from four SILENT outages and not from the merge; what already guards a merge; the uptime watch, the derived weekly report and the mail path that must be proven first; what is portable to Tom's other Claude Code projects and what would be cargo cult; and a list of what NOT to do, because the pull after an incident is toward ceremony |

### PUSH THE SIBLING SITES TOO, ALWAYS (Tom, 2026-09-11)

**`git push` is part of finishing work in `~/webdev/librewaternet.org` and `~/webdev/not-epanet.org`
exactly as it is here**, and no longer waits for Tom. His words: *"push lwn and make a note that I
expect you always to push lwn and the other sibling site."* This SUPERSEDES the standing "both site
repositories are committed and NOT pushed, deliberately -- a push publishes" that
`dev/session-handoff.md` records from 2026-09-06; he has changed his mind, and the reason it was
ever true (copy that had to be read before it went public) is served by his reading the commit, not
by the work sitting on a shelf. The only exception is his saying so for a particular change.

### The sibling repository: `~/webdev/librewaternet.org`

The Claude Code project stays rooted HERE and drives both. **The catch is that the other
repository's own `CLAUDE.md` does not load from a session rooted here** — so before writing or
editing one word of landing-page copy, read `~/webdev/librewaternet.org/CLAUDE.md`. It carries the
claim rules that have already had to be corrected on that draft twice (no completeness claim against
EPANET; "a phone", never "your phone"). `dev/positioning.md` remains the authority; that file points
back at it rather than restating it, so there is one record and not two.

Paths to `lib/` inside `dev/scripts/*.php` use `__DIR__ . '/../../lib'`.

---

## Variable Prefix Convention

Each calculator owns a short prefix for its language keys and JS variables. New calculators define a
new unique prefix and document it here.

| Prefix | Calculator |
|--------|-----------|
| `dw_`  | Darcy-Weisbach |
| `hw_`  | Hazen-Williams |
| `mpf_` | Manning Pipe Flow |
| `mphl_`| Manning Pipe Head Loss |
| `mtc_` | Manning Trap Channel |
| `mi_`  | Manning Irregular |
| `ws_`  | Weir Flow Simple (broad-crested) |
| `wi_`  | Weir Flow Irregular |
| `or_`  | Orifice Flow |
| `odt_` | Orifice Drain Time |
| `rc_`  | Rock Chute Design (Robinson) |
| `cs_`  | Canal Seepage & Conveyance Efficiency |
| `ip_`  | Irrigation Pressure |
| `mhp_` | Microhydropower |
| `bpn_` | Branched Pipe Network — parent-pointer topology, two-pass fixed-demand solve |
| `lpn_` | Looped Pipe Network, map interface — see below |

Three prefixes predate the `*_main_menu` convention and name their menu entry `<prefix>_menu`
instead: `mi`, `mtc`, `wi`. The coverage declaration lists them by exact key for that reason, and
also still lists `irr`, which owns no keys at all — probably a legacy alias of `ip`.

## How to Add a New Calculator

1. Copy an existing calculator (e.g. `Manning-Pipe-Flow.php`).
2. Choose a short prefix and add it to the table above.
3. Define `$arrayInputs` and `$arrayResults` referencing `$ec_lang['prefix_key']`.
   Declare each field's units as a **family name** (`'units' => 'distance_small'`), never an inline
   array.
4. **Add your language keys to `lib/lang.ec.en.php` ONLY.** `lib/base.inc.php` requires
   `lang.ec.en.php` and *then* the visitor's language, so an absent key already falls back to
   English — an ABSENT key is the correct untranslated state. A key present-and-byte-identical in a
   non-English file is a different thing: `lang_syntax_validate.php` flags it `identical-to-english`
   and **that finding blocks the build** (its own docblock still says "warning-grade"; the docblock
   is stale). Then regenerate the payloads so a future sprint picks the keys up.
5. Write `EngCalcs.pageCalculator = function(objForm) { ... }` in the page's `<script>` block.
6. Call `echoHeader`, `echoCalculatorForm`, `echoFeedback`, `echoFooter`.
7. Add it to `lib/Menus.lib.php`.
8. Set `$html_desc = $ec_lang['<prefix>_main_desc'];` before `echoHeader()` — see below.
9. Include the calculator JS with `filemtime()` cache-busting, never a hardcoded `?v=N`:
   `<script src="/engcalcs/js/my-calc.js?v=<?=filemtime(__DIR__.'/js/my-calc.js')?>"></script>`
10. **Add a worked example to `dev/calc-spike/`.** The smoke harness picks the page up automatically
    (the list is derived), so it is already checked for running, for not emitting NaN, and for
    opening on a passing design. What that cannot check is whether the math is right — copy
    `mpf-harness.js` and anchor against the source method. Recipe: `dev/calc-spike/README.md`.
11. **Add the prefix to `prefixToTermNames()` in `dev/scripts/generate_translation_payloads.php`,**
    listing the `glossary.json` terms it uses. A missing prefix silently falls back to three default
    terms, so every glossary entry written for the calculator — definitions, `translations`,
    and the `avoid` arrays that are the whole point of a trap term — becomes invisible to its
    translation agents. Nothing warns you: payloads generate, `--check` says FRESH, the sprint runs,
    and the guards were never delivered. **Verify by reading `glossary_terms_by_prefix.<prefix>` out
    of a generated payload — exactly three entries means the map is missing.**

### Meta description

`echoHTMLHead()` escapes one global into `<meta name="Description">`:
`$html_desc = $ec_lang['mpf_main_desc'];`

- **Reuse `<prefix>_main_desc`; do not add a meta-description key.** It is already written and
  already translated into 27 languages, and already differs from the title. A dedicated key per page
  would read better as a search snippet but costs 20 × 26 = 520 new strings for an incremental SEO
  gain — a free fix that is 80% as good beat a paid one. Weigh any future proposal against that.
- **Never point `$html_desc` at `$html_title` or a `*_main_title` key.** Google discards a
  duplicate-of-title description and auto-generates a snippet from a page whose content is a form.
- A page with no `*_main_desc` sets nothing — **`contact.php`, `Compare-Languages.php`,
  `formmailsuccess.php`, `privacy.php`, `terms.php`.** *(Corrected 2026-08-25: `index.php` has
  its own description and no longer belongs on this list; `privacy.php` and `terms.php` were
  missing from it. Found while wiring the share cards, which read the same global.)*
- **`$html_desc` now feeds `og:description` as well as `<meta name="Description">`** (Task 534),
  so a page that sets nothing emits no `og:description` either — a card with a title and a
  picture and no subtitle, which is a normal card. Never a placeholder: "undefined" on a share
  card is a defect that only strangers see.
- Whatever key you point at becomes plain-text-constrained automatically —
  `plainTextBoundKeys()` derives it from the assignment.

---

## Labels, Tips and Shared Concepts

### Call the helper; do not write the markup

```php
ecTipLabel($ec_lang['mpf_flow'], $ec_lang['mpf_flow_tip'])                  // tip, no link
ecLinkTipLabel('https://...', $ec_lang['hw_roughness'], $ec_lang['hw_tip']) // link + tip
```

`tip_markup_check.php` fails the build on hand-assembled `.ec-help`/`.ec-tip`. The helpers handle the
`strip_tags()` + `htmlspecialchars()` a `title=""` needs, and the two **opposite** nestings: with a
link, `.ec-help` wraps the `?` glyph alone (the `<a>` is already a big target); without one,
`.ec-help` wraps the label text *and* the glyph, or the tap target is one character. `$text` is
trusted HTML; `$tip` is plain text.

The judgement calls the helpers cannot make:

- **Exactly one `?` per label, and it is always the tip.**
- **A link with no tip needs no wrapper** — plain `<a>` is correct.
- **Never put explanatory text in a link's `title=`.** `js/Calculators.lib.js` only activates
  tap-triggered tooltips on `.ec-help[title]`, so on touch a bare `<a title="...">` just navigates.
- **If the linked page has no translation**, say so in the tip ("English only").

### Concept-level label reuse

When two calculators need the same concept, **reuse one whole label** rather than re-keying it — but
only **whole labels** (complete noun phrases). Never compose a label from fragments at render time;
fragment composition is what broke the original word-level design in gendered / word-order / RTL
languages.

- **Owner:** the shared concept lives under one owning calculator's key; others borrow it. No neutral
  prefix. **Incumbency decides** — the key already used by materially more pages wins. Menu order is
  only the tiebreak.
- **Wording:** menu order picks which key survives; the surviving key's English *value* takes the
  best wording found across the cluster.
- **Loss symbols:** lowercase `h` for loss components (`h_f`, `h_m`, `h_L`; coefficient `k_m`);
  capital `H` for total/gross/net heads. The local-loss term is **"Minor (local) loss"** suite-wide —
  the "(local)" blocks the "smaller loss" mistranslation.
- A shared label must fit its **narrowest** use: put the short form in the shared key and long forms
  in tooltips, never the reverse.
- **Reuse stops at sentences.** A tip shared across controls must be true of all of them.

Consolidation is one full-suite English-only pass, never chunked per calculator category — a
duplicate's two halves live in different categories. Record: `dev/label-normalization-decision.md`.

### Verdict / check-string convention

- **Leading verdict glyph, then short text:** `✓` pass, `⚠` caution. The glyph is decorative,
  international and RTL-safe — never add a translated marker word ("Warning:"/"OK:").
- **The entire verdict string is the `ec-tip` target**, with the full explanation in its `title` — not
  just the glyph, which is a one-character tap target.

### Results table column width

Column width is king. Keep headings narrow; mid-word wrap is acceptable. Do not widen a column to
expand an abbreviation. English column-heading abbreviations are **not** a translation obstacle —
verified against wave-1 output in 14 languages, every one produced its own natural short form. Do not
re-flag a `layout: column heading` abbreviation merely for looking terse.

---

## Language Keys

All display strings live in `lib/lang.ec.??.php` (en + 26: am, ar, bg, bn, cs, de, es, fa, fr, he,
hi, hr, id, it, km, my, ps, pt, ro, ru, sr, sw, tr, uk, ur, zh). Keys follow `prefix_description`.
**Full rules — universal/conventional/translatable wording, the synonym channel, the polysemy
protocol, the tag vocabulary — are
in `dev/language-strings.md`. Read it before editing any string value.** The non-negotiable parts:

| Rule | What it requires | Enforced by |
|---|---|---|
| **A** | Never an HTML entity in any language string, anywhere — use the literal UTF-8 character (`—` not `&mdash;`). Absolute, because whether an entity survives depends on the call site, which is invisible from the string. | `lang_syntax_validate.php` |
| **B** | Never an HTML tag in a plain-text-constrained string (`title` `placeholder` `alt` `aria-label` `data-*`, and a string handed to `alert()` / `confirm()` / `prompt()` — a browser dialog renders its argument as text, so a tag does not degrade there, it SHOWS). "Reaches plain text" is derived from the source by `plainTextBoundKeys()`, not from the key's name — 999 dialog values were bound by nothing until 2026-09-06 because that deriver did not model the sink. | `lang_syntax_validate.php` |
| **C** | Advisory (`--rule-c`): where a key's name and its derivation disagree. 31 disagree on purpose. | `lang_syntax_validate.php` |
| **D** | Single-quoted: `$ec_lang['k']='value';`. A double-quoted value **interpolates**, and one such key silently depended on another being assigned earlier in the same file. | `lang_syntax_validate.php` |

The script names the violation and the fix in its own error text. Trust it; do not add prose on top.

**`$ec_lang_syn` is OFF-LIMITS to AI.** Never add, change or remove an entry without explicit written
permission in that conversation. AI proposes a diff; the human approves; only then does AI write.
There are **no standing carve-outs.** Its payload is SYNONYMS, not descriptions, and every phrase
must pass the **substitution test**: it could stand on the control as the label itself.

**Routing — one question decides where a fix goes: does an English reader also stumble?**

| Test | Home |
|---|---|
| An English reader must re-read, or can read it two ways | **Fix the English** — one edit fixes all 27 languages |
| English is correct and idiomatic, but a translator cannot recover the concept from the words | **`$ec_lang_syn`** |
| The concept recurs across labels or calculators | **`glossary.json`** |

**Never rename a key by hand** — `php dev/scripts/rename_lang_key.php old new --apply` does all 27
lang files, `$ec_lang_syn`, every call site, the drift manifest, the exempt list and the coverage
declaration in one pass. A hand rename is ~40 edits and every miss fails **silently**.
`key_hygiene_check.php` reports keys rendered by nothing and names that drifted from their siblings;
It also reports keys whose only reader is itself unreachable — a reference from an uncalled function
is still a reference, which is why a reference count alone could not see the two terrain strings
Task 542 stranded. That walk is advisory and lists CANDIDATES: reachability through a dynamic
dispatch is undecidable, so it is deliberately conservative and prints what it turned away.
**Since 2026-09-17 it also NAMES what only a harness reaches (finding 1c), which the walk itself
can never list** -- a harness ROOTS a function, correctly, because a test seam is not a corpse, so
`EC.lpnTerrainFill()` sat rooted by `terrain-harness.js` alone from the day Task 542 deleted its
menu row, and two of its strings went on being translated into 27 languages for a state no visitor
could reach. Tom found it by reading: *"When could that possibly display?"* A worklist and not a
verdict -- 23 rows today and most of them are genuine seams; the question it puts to a person is
whether the function SAYS anything a visitor could see.
a key rendered by nothing is not automatically debt, so decide per key and never bulk-delete.
**Keep sibling keys parallel in NAME and in VALUE across all 27 files.**

## Translation Sprints

**Full mechanics are in `dev/translation-process.md`** — pre-sprint checklist, the coverage cross,
batching, post-sprint QA, quality tiers. Read it before proposing a sprint. The hard gates:

- **REQUIRED: explicit user authorization before launching.** A sprint spawns up to 26 paid agents.
  Always propose → confirm → launch. Never infer authorization from a general "proceed".
- **Announce the count before spawning:** "Starting N agents, one for each language." Note the
  platform cap — **20 concurrent subagents**, so 26 languages means 20 at once and 6 as slots free.
  Say it that way in the proposal.
- **Sonnet is mandatory for every translation agent, every batch size, every language, no
  exceptions.** Haiku is fully deprecated for translation.
- **One agent per language, in parallel**, each writing in ~50-key batches and saving each batch
  before translating the next. A session limit can kill a sprint at any moment; an agent that
  composed in memory loses everything, one that has been appending keeps what is on disk.
- **Three scripts must exit 0 before launch**, and a non-zero exit is a hard stop:
  `friction_check.php --sprint=<id>`, `gloss_ref_check.php`, and
  `generate_translation_payloads.php --check`. Regenerating payloads is the orchestrating AI's job,
  never the user's.
- **Glossary write-back is mandatory before a sprint is closed**, not queued for later.
- **Wave 0 does not re-litigate a string Tom has ruled on.** `wave0_keyset.php` excludes every key
whose EXACT current English carries a ruling in `dev/english-key-rulings.json` — 146 of them on the
day it landed. Tom, 2026-09-06, on a key he had personally reworded two days earlier and which the
pass then filed HIGH: *"We resolved this yesterday. Please note this so that it doesn't arise again.
You are wrong."* A wave-0 agent reads cold by design, and that blindness is what makes the pass
work, so the memory has to live in the keyset. It lapses by itself: reword the string and nobody has
approved the new words, so it comes back.

**`detect_english_drift.php --baseline-new` closes the sprint.** Without it a sprint's new keys stay
  `NEW` forever and a later English edit becomes invisible to *both* tools at once.

**Anchor languages are declared in `glossary.json`'s `meta.anchor_languages` — read that, not this
line.** They are `es, pt, fr, tr`: the core languages and the measured top four by confirmed human
reach. They replaced `es, fr, ru, ar` because an anchor is a reference point other renderings get
checked against, and `ru` (1 measured human) and `ar` (0) cannot be observed. **This is about
reference points only** — ru and ar translation quality stays fully in scope, and "zero reach ≠ low
value" holds.

**The coverage declaration** (`dev/scripts/translation_coverage.json`) says what we intend to
translate, and must never be merged with the exempt-key list: **exempt** means identical-to-English is
permanently correct (the key is finished); **out of scope** means a cell we have not translated yet
(the key is not started, and can earn its way in). **A cell is in scope iff the calculator is core OR
the language is core** — core calculators `mpf`, `mtc`, `lpn`; core languages `es`, `pt`, `fr`, `tr`.
That OR makes it a cross; an AND would leave Manning Pipe Flow untranslated in 22 languages. Identity
strings are the floor and are never out of scope.

**`QUALITY` in `lib/Language.Settings.php`** must carry an honest current estimate of defect risk —
`1.0` English, `0.95` a verified native review **on file**, `0.85` AI-translated plus independent
back-translation and cross-language checks, `0.65` the low-resource tier (am/km/my/ps/sw), which gets
less verification by design. Update via `update_quality_score.php`, never by hand. **Never log a
language as "awaiting native review"** — no native speaker will realistically see such a flag.

## Testing

**Minimize Tom's browser passes** — they are slow and fatiguing. Write a harness in `dev/lpn-spike/`
or `dev/calc-spike/` and reserve his time for what genuinely needs a real browser.
**`dev/testing-notes.md` has the full set of lessons.** The two worth knowing before you start:

- **A STUB THAT REMOVES THE COUPLING MAKES A HARNESS PASS FOR THE WRONG REASON.** When a harness
  passes and the browser still misbehaves, suspect the stub before the code: ask which quantity the
  real thing varies that the stub holds constant. Fix by teaching the stub that one physical
  relationship, not by adding assertions.
- **A page must be rendered at GLOBAL scope, ONE PAGE PER PROCESS.** `dev/scripts/render_page.php` is
  the only correct way to render a page outside a web request; `include`ing one from inside a
  *function* silently produces a page missing its menus and most of its unit selects.

## Writing things down

- **A correction SUBSTITUTES the superseded reasoning; it never appends to it.** Keep the conclusion
  and the one rejected alternative that would otherwise be re-proposed, and delete the narrative of
  how the team got there. Git carries that. Appending is what turned this file, the roadmap and
  `js/looped-network.js` (47% comment lines) into transcripts of revision rather than statements of
  current state.
- **Compact by load frequency, not by file size.** This file is read every session and is the
  expensive one. A `dev/*.md` nobody opens is cheap however long it is.
- **WRITE ORDER, NOT ELAPSED TIME — you do not have a clock.** The environment supplies a DATE and
  nothing finer, and a session can cover in twenty minutes what reads like a week. "An hour later",
  "it stood for months", "it shipped OFF for one day" are inferences from message position, not
  measurements, and a later reader acts on them — "it stood for months" and "it stood for one review"
  justify very different caution. Say *before it shipped*, *between two rounds of review*, *the same
  day*, or say nothing.
- **Don't attribute repo prose to Tom.** `CLAUDE.md`, code comments and `dev/*.md` are AI-written.
  Quote only the transcript or a dated first-person quote.
- **ROADMAP priority is one of five numbers: 100 Next, 75 Soon, 50 Someday, 25 Maybe, 5 Parked —
  plus 0 for closed.** (A temporary 95 tier parked work past EWB for one day and was retired on
  2026-09-12: branch work needs no parking, because a task ships when its branch merges.) Never a number between them, and
  never a new tier. `roadmap_id_check.php` blocks on one.
- **ROADMAP length discipline: the default is 1–3 lines, hard cap ~15.** The one test for adding a
  line: *would a competent person, reading the short version, DO SOMETHING DIFFERENT if this line
  were there?* Expansion is earned only by (a) a decision with a real rejected alternative, (b) a
  measured number, (c) a non-obvious constraint or blocker, (d) a correction of something recorded
  wrong. Past the cap, the content is a `dev/*.md` and the task is one line pointing at it.
- **Closing a task means a one-line entry in `dev/roadmap-closed-ids.md` and deleting the block.** The
  ledger is an index so a cited `Task N` still resolves; the text stays in git. Extract any unbuilt
  phase to its own task first — closed blocks are never re-scanned.
- **Suite-wide UX/convention issues go to `dev/ROADMAP.md`, not inline fixes** during
  single-calculator work.
