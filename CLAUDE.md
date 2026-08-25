# EngCalcs — Architecture & Developer Guide

**What this is:** a PHP/JS suite of hydraulic engineering calculators — 16 calculators, 27 languages. PHP
delivers multi-linguality (language detection, switching, injecting localized strings); all
computation runs client-side in JavaScript. No database, no authentication.

**License:** GNU GPL v3 or later. Copyright 2009 Thomas Gail Haws.

**How to read this file:** it states the current rules, not how they were arrived at. Where a rule is
enforced by a script, the script's own error text is the authority — this file only names it. Run
`sh dev/scripts/check_all.sh` before every commit; it runs everything listed under "Automated
checks" below.

---

## Git Workflow

**Commit and push by default, without asking, at the end of every piece of work.** This overrides the
general assistant default. The only exception is Tom explicitly saying to leave something
uncommitted; silence means commit and push.

- **Work directly on `master`.** No feature branches — the project is small enough for one branch,
  and per-task branches accumulated as stale refs.
- **Stage explicit paths. Never `git add -A`** — Tom runs concurrent sessions in the same working
  directory, and a broad add commits their in-progress work under your message.
- **Report the push state unabridged and unprompted:** the commit SHA, and that
  `git log --oneline origin/master..master` is empty. Never tell Tom to `git pull` before verifying
  the push landed.

### Commit messages: subject only by default (Tom, 2026-08-16)

**Write a subject line of ≤72 characters and NO body.** Add a body only when a future reader would
genuinely act differently without it; when one is warranted, ≤40 words.

Measured in this repo: Tom's own oldest 300 commits had no body 68% of the time and a median of 84
total words. The AI era wrote a body on 99 of the last 100 commits at a median of 297 words. Normal
human OSS practice is a 50–72 char subject with no body about half the time. The bloat is entirely
in bodies, and it is expensive because it makes `git log` unreadable.

The reasoning, the rejected alternatives and the quotes belong in the code comment or the roadmap
block, where people actually look for them. End with:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

### The one exception to no-branches: parallel subagents get worktrees

- **A worktree is justified by CONCURRENCY, never by caution.** One agent working alone works on
  `master`.
- **The orchestrator merges promptly and deletes the branch** as each track lands. A worktree branch
  outliving its agent is the stale-ref problem by another door.
- **Give concurrent agents disjoint file territory, and say so in the brief.** Two tracks that both
  need `js/looped-network.js` are sequential work in a parallel costume.
- **Disjoint files are not enough — tracks also share SEAMS.** Two tracks with perfectly disjoint
  files once produced five user-reachable defects because both wrote element properties and only one
  knew about `setProp()`, the single write seam. **When two tracks share a CONCEPT — a write seam, a
  resolver, a single source of truth — either sequence them, or name that seam in BOTH briefs and
  require each to say how it goes through it.** `dev/scripts/scenario_seam_check.php` guards that
  particular one.
- **Subagents commit inside their worktree and never push.** Pushing is the orchestrator's, after
  the merge and after `check_all.sh` passes on the merged tree.

---

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
| `js/looped-network.js` | `lpn_` map editor |
| `css/engcalcs.css` | App-wide styles |

### Specialist agents (`.claude/agents/`, journals in `dev/agents/`)

Persistent agents with a library, a journal and a research programme. First hire 2026-08-24:
`utility-planning-engineer` — the design-and-planning engineer inside a water utility, the one seat
nobody here has worked (Tom: *"Scale is my big and first blind spot... I have designed many Elm
Street Center projects, but no Novatos."*). **An agent must carry something this repo does not
already have** — external evidence, or a vantage point nobody occupies; an agent briefed from our
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
| `dev/cross-platform-planning.md` | Claude Code / Copilot collaboration conventions |
| `dev/unit-families.md` | Unit-family design record and per-field rationale |
| `dev/cookie-storage-inventory.md` | Everything stored on a visitor's device, and why |
| `dev/scenario-seam-repair.md` | The `setProp()` write-seam incident and its guard |
| `dev/positioning.md` | How `lpn_` is positioned against epanet-js; LibreEPANET.org. **Authority for every public claim, this repo's and the landing page's alike** |
| `dev/librewaternet-landing.md` | The landing page left this repo 2026-08-24; where it went and what stayed |

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

### `lpn_` in particular

A canvas/map-centric looped network solved by the global gradient algorithm (`js/lpn-solver.js`) with
a map editor over it (`js/looped-network.js`). **A core calculator, in scope in all 26 languages.**
Never call it "preview". Scope: `dev/looped-network-calculator-scope.md`; ROADMAP Task 146 and its
`146.nn` children.

- **Element types:** junction, reservoir, tank, pipe, pump, valve, text. **Our vocabulary is NOT
  EPANET's and stays that way** (Tom, 2026-08-21, ROADMAP Task 482): what we call a **Label**
  EPANET calls Notation/Annotation, and what EPANET calls a **Label** is our **Text** object.
  There is no industry standard to defer to, so write new strings in OUR vocabulary — every one
  written in EPANET's adds to a rename we have already declined.
- **EXTENDED-PERIOD SIMULATION SHIPPED 2026-08-18, THROUGH THE EPANET ENGINE ONLY** (`js/lpn-time.js`).
  Tanks fill and drain, demands follow patterns, the bottom pane scrubs the frames; checked against
  all 25 steps of EPA's own `Net3.rpt` to 0.005 ft over 2,425 head comparisons
  (`dev/lpn-spike/eps-net3-harness.js`). **The built-in solver has no time dimension and is not
  getting one** — with EPANET unreachable the page solves one instant and says so. What is left of
  Task 248 is rule-based `[RULES]` (248.03) alone: patterns on a reservoir head and on a pump speed
  shipped 2026-08-24 (248.02). **EPANET's pump speed pattern REPLACES the SPEED setting rather than
  scaling it** — measured against the engine, and the exporter writes SPEED or PATTERN, never both.
  **"No extended-period simulation yet" is FALSE.** It stood in this file and on the LibreWaterNet
  landing draft until 2026-08-21, three days after the run shipped, and Tom caught it, not a check.
  Do not restore it.
- **Valves are the one place the two engines deliberately differ.** A throttle valve (TCV) is a minor
  loss on a zero-length link and solves in either engine. PRV/PSV/FCV switch their own state inside
  the iteration and solve through **EPANET only** — measured ~9x faster than our own solver, so a
  second implementation was not written. A network holding one is routed to EPANET automatically and
  the status bar says so, **without rewriting the user's stored `engine` setting** (the setting is a
  preference; the routing is a fact about this network). The native solver refuses such a network by
  name if the engine is unreachable. `EngCalcs.lpnValveIsNative` is the one place that line is drawn;
  `EngCalcs.lpnLinkK` is the one place a TCV's loss is read from its SETTING rather than its `k`.
- **A tank is a fixed head at its water surface** — what EPANET itself solves at t=0.
  `EngCalcs.lpnIsFixedHead` is the one place that equivalence is declared. A tank diameter is in the
  LENGTH unit while a pipe diameter is in millimetres; only `dev/lpn-spike/tank-harness.js` asserts
  that, because no solve ever reads it.
- **A geographic project draws raster tiles behind it, and can read ELEVATIONS from the same
  account** (Task 497, `js/lpn-terrain.js`) — OpenStreetMap for the street map, Mapbox for satellite
  and for Terrain-RGB (all gated on `EC_MAPBOX_TOKEN`; absent means neither option exists). The
  tiles are never cached by us, never in the service worker's manifest, attribution required on the
  map and one credit set per source. It is `project.basemap`, never `backdrop.href`, and an `.inp`
  exporter must skip it. The elevation fill is a View-menu row that TYPES numbers into the document,
  so it never overwrites an elevation without naming the number it would replace, it is one undo
  snapshot, and it states its ~30 m accuracy in the interface, not in a comment.
- **THE SUITE MAKES FOUR THIRD-PARTY REQUESTS, ALL ON THIS PAGE, ALL OPT-IN:** OSM tiles, Mapbox
  satellite tiles, Nominatim place-name search (`js/lpn-search.js`), and Mapbox Terrain-RGB elevation
  lookup (`js/lpn-terrain.js`, Task 497). **The last two are the sensitive ones and each has its own
  consent gate** — `ec_geosearch` and `ec_terrain`, separate from the analytics one and from each
  other, because a tile says where you are LOOKING, a search says what you TYPED, and a node
  coordinate says where your NETWORK IS. Do not write "the only third-party request" anywhere; it has
  been false since the geocoder shipped. **Adding one does NOT touch `consent_body`** — that banner
  asks about one analytics digit and says nothing about third-party requests; each feature asks its
  own question, so a fifth service is a new paragraph in `privacy.php`, not a version bump.
  A geographic project is **drawn in Web Mercator and stored in longitude and latitude** —
  `outwardY()`/`inwardY()` is the whole boundary, x needs nothing because Mercator x IS longitude, and
  a tile box is square because the drawing frame is the tiles' own. **Storing the projection is
  forbidden:** `mercLat(mercY(lat))` differs in the last bits for 69.8% of latitudes, so it would
  rewrite every latitude on every open-and-save.
  `dev/geographic-projects.md`.
- **Reads AND WRITES EPANET `.inp` files** (`js/lpn-inp.js` — one file, so one opinion about the
  format). Import takes the supported subset and reports every difference, never rejecting and never
  dropping silently; export shipped 2026-08-18 and returns 1,280 numeric tokens across Net1/2/3
  character-for-character. Five round trips are genuinely impossible and are REPORTED rather than
  faked (see the closed Task 281 entry for the list). **"Does not write one yet" is FALSE.**
- **Design this page for a pointer; then make a phone survivable.** It is a full-window drawing
  surface with a menu bar, toolbar, tab strip and property popup, so the desktop layout is the
  authoritative one and no design argument starts from a phone. Say "pointer slop" when you mean
  hand-and-mouse tolerance; a 44px touch target is not an argument here.
  **BUT NEVER CALL IT A PC APPLICATION IN PUBLIC — Tom, 2026-08-24: *"It is not a PC application; it
  is a web application."*** That is a ruling about IDENTITY, and it does not touch the design rule
  above: pointer-first is still how it is built, and "it runs everywhere a browser runs" is still
  what it is. The two are only in tension if you let a design priority leak into a positioning
  claim, which is exactly what happened — the sentence *"And it is a PC application, the way EPANET
  is"* stood on the LibreWaterNet draft and he struck it. Do not restore it, and do not reach for
  epanet-js's harder version of the same stance either. Tom ruled it **not usable on a
  phone** on 2026-08-22; the four small-screen items he named — hide page titles, collapse the
  navbar, keep only the transport controls, drop menu text to icons — shipped the same day at one
  `max-width: 640px` breakpoint (closed Task 486, guarded by `dev/lpn-spike/small-screen-harness.js`),
  and on 2026-08-23 he passed it: *"For today's standards, we are gold."* On 2026-08-24, after using
  it: *"phone usability is super solid now. I am a bit surprised."* **The sanctioned public claim is
  his own, and it is the LANDING PAGE'S current sentence, not a paraphrase:** *"And although you of
  course prefer working on your PC, it works also on a phone in tall mode."* The indefinite article is load-bearing
  and he chose it deliberately (*"to be scrupulously honest"*) — **"a phone" is a claim about the
  software; "your phone" is a promise about a device we have never seen.** Never write the second.
  **"In tall mode" joined it 2026-08-24 and is a narrowing of the same kind** — Tom uses the phone
  upright and says that is best, so the claim names the orientation actually observed. It is also
  what closed Task 442: the toolbar does NOT become a side menu, on any screen.
  (Superseded, recorded so it is not reinstated by habit: "Try it. We did.") The other calculators
  are a form and an answer and are fine as they are.

---

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
    terms, so every glossary entry written for the calculator — definitions, `preferred_translation`,
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
- A page with no `*_main_desc` sets nothing (`index.php`, `contact.php`, `Compare-Languages.php`,
  `formmailsuccess.php`).
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
**Full rules — Simple English, the synonym channel, the polysemy protocol, the tag vocabulary — are
in `dev/language-strings.md`. Read it before editing any string value.** The non-negotiable parts:

| Rule | What it requires | Enforced by |
|---|---|---|
| **A** | Never an HTML entity in any language string, anywhere — use the literal UTF-8 character (`—` not `&mdash;`). Absolute, because whether an entity survives depends on the call site, which is invisible from the string. | `lang_syntax_validate.php` |
| **B** | Never an HTML tag in a plain-text-constrained string (`title` `placeholder` `alt` `aria-label` `data-*`). "Reaches plain text" is derived from the source by `plainTextBoundKeys()`, not from the key's name. | `lang_syntax_validate.php` |
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
- **`detect_english_drift.php --baseline-new` closes the sprint.** Without it a sprint's new keys stay
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

## Automated checks — `sh dev/scripts/check_all.sh`

Seconds, free, and the first thing to reach for. Blocking failures exit 1. Each script explains its
own failure; this table is an index, not a duplicate of that text.

| Check | Guards |
|---|---|
| php + js syntax | Every `.php`, every `js/*.js` and `js/vendor/*.js` (the vendored EPANET engine ships to visitors and was once unchecked) |
| `html_balance_check.php` | Every page produces well-formed HTML |
| `pageconfig_check.php` | The PHP→JS pageConfig bridge; an unsupplied key shows the visitor "undefined" |
| `tip_markup_check.php` | `.ec-help`/`.ec-tip` built by the helpers, not by hand |
| `browser_lang_tag_check.php` | A stray tab in visitor text cannot forge a log row |
| `sw_manifest_check.php` | The service worker precaches the URLs pages actually request (`?v=<filemtime>`). 22 of 25 entries were once unreachable and the offline promise was simply false |
| `standalone_assets_check.php` | The suite ships its own assets — a parent-site CSS dependency broke a standalone deploy |
| `canonical_origin_check.php` | `CANONICAL_ORIGIN` is a host→origin WHITELIST, never derived from `HTTP_HOST`. Multi-domain serving needs the lookup; a derivation lets a spoofed Host point canonical URLs off-site, and the first symptom would be a search engine indexing somebody else's domain for us |
| `scenario_seam_check.php` | Overridable properties go through `setProp()`, never a direct write that edits BASE from inside a scenario |
| `unit_factor_check.php` | Every `$ec_units` factor re-derived from the exact definitions (`ft = 0.3048 m`, `gal = 3.785411784 L`, `lbf = 4.4482216152605 N`), **and factors for one quantity agreeing with each other** — the suite once shipped four different feet, and `ft3`/`ft3ps` were the same conversion 47 ppm apart. Reads `EngCalcs.G` out of the source rather than retyping it. **Also that a unit's identity is its NAME** — no `data-unit`, no `objForm['xu'].value`, no `<option>` valued with a factor (Task 390) |
| `lang_syntax_validate.php` | Rules A–D |
| `lang_tag_parity_check.php --strict` | Markup matches English |
| `gloss_ref_check.php` | Every `gloss:` resolves and is wired to its prefix |
| `layout_tag_check.php` | A layout tag matches the widget it claims to describe |
| `coverage_selftest.php` | The coverage cross, the identity floor, exempt/out-of-scope separation |
| `generate_translation_payloads.php --check` | Payload freshness |
| `generate_examples.php --check` | The served `examples/` matches its source |
| `roadmap_id_check.php` | ID uniqueness across ROADMAP + closed ledger; priority 0 means closed and nothing else |
| `run_harnesses.sh` | The lpn solver and editor harnesses (count derived from the glob, never typed) |
| `run_calc_harnesses.sh` | Every calculator's own `pageCalculator` against its own rendered HTML |
| `stale_claim_check.php` | *Advisory.* A `Task N` cited in `CLAUDE.md` or a `dev/*.md` whose task is CLOSED, ranked by whether a negation sits beside it — the shape of the three false "not built yet" claims that shipped in one day. A worklist, never a verdict |
| *advisory:* `key_hygiene_check.php`, `size_budget_check.php`, `detect_english_drift.php` | Judgement calls that must not block a commit |

**When you are about to write a new rule in this file, first ask whether it can be a check.** Every
rule here that became a script stopped being violated. Every rule that stayed prose kept being
violated, sometimes for months, by people who had read it: `lang_syntax_validate.php` found 660
pre-existing double-quoted assignments; the missing `prefixToTermNames()` wiring silently blinded two
calculators' whole glossary while being documented the entire time. **A rule a machine enforces is
worth roughly ten a human must remember**, and this file's unexecutable half is decoration.

### The two tiers above the free one

- **`/code-review` — billed, and only a human can start it.** An AI cannot launch it; do not try. It
  reads code for design, duplication and subtle logic errors, the entire class the free tier cannot
  see. Worth spending when a change alters logic a person cannot confirm by using the page, touches
  storage/privacy/money/legal text, or is cross-cutting. The natural moments are the
  expensive-to-undo ones: before a 26-agent sprint, and before anything that changes what is stored
  on a visitor's device.
- **Tom's own attention — the scarcest, and he has said he will not read code.** Reserve it for
  naming, scope, wording, and whether an unreferenced key is debt or lost content.

### What the free tier does NOT cover

- **Every calculator now has a worked-example test of its math except `rc`**, which is partial (its
  Robinson coefficients are unverified — the paper is paywalled and the free copy is a page scan).
  The five that had none — `mi`, `wi`, `ip`, `bpn`, `cs` — were anchored 2026-08-21 and **two of them
  were wrong**: Canal Seepage's currency inputs converted backwards (Task 473) and Manning Irregular's
  region Froude number mixed a region area with a segment top width (Task 474). Both are fixed, and
  each is now asserted by its own harness. Add a worked example for any new page;
  it is under an hour, and `dev/calc-spike/README.md` is the recipe.
- **Row-table calculators** (Branched-Network, Irrigation-Pressure, Manning-Irregular,
  Weir-Flow-Irregular) now build their rows in their OWN per-page harness — `calc-page.js` grew
  `initRows()`/`addRow()`/`cell()` and the pages' own initializers do the building. The SMOKE harness
  still does not, and names them as it goes. `Manning-Irregular.php` is the exception even per-page:
  its initializer seeds through the cookie, so its shipped defaults are covered only by
  `dev/browser-pass/mi-defaults.js`.

---

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

## Unit Sets

A field declares a **named unit family**, never an inline array:

```php
Array('name' => 'd', 'type' => 'number', 'default' => '6', 'units' => 'distance_small', ...)
```

Families live in `lib/Units.lib.php` (`$ec_unit_families`); the two presets, `us` and `si`, map every
family to one unit (`$ec_unit_sets`). `EC_DEFAULT_UNIT_SET` picks what a first-time visitor sees,
derived from the language. Returning visitors are unaffected — the cookie stores each select's option
value, which **is the unit's NAME** (`ft`), never its factor. Conversion factors (`$ec_units`) are
"number of that unit per SI unit": multiply to display, divide to store, and JS reaches one only
through `EngCalcs.unitFactor()`, a lookup on that name. Full rationale: `dev/unit-families.md`.

- **Split a family when two fields want different *defaults*, not different *options*.**
  `distance_small` and `distance_large` offer the identical four units and exist purely to carry
  different defaults (inches for a pipe diameter, feet for a pipe length). Merging them re-creates the
  original defect, where a 1,000 ft main rendered as 12,000 in. Where two families share a list, share
  the PHP variable rather than duplicating it.
- **Which family a field names is a per-page choice**, not a global property of the field name — the
  same concept is `distance_small` on a pipe page and `distance_large` on a channel page. There is no
  page-level override mechanism because the page already chooses.
- **Every family must appear in every preset.** A missing entry silently leaves that field alone.
- **A page's `default` number is in the *displayed* unit**, so a unit-bearing field declares one per
  preset: `'default' => Array('us' => '6', 'si' => '150')`. A scalar is correct only when the value is
  unit-independent. Getting this wrong is silent — a scalar `6` reads as 6 in under `us` and 6 mm
  under `si`. A page seeding sample rows from JS must seed per preset too, keying off
  `EngCalcs.defaultUnitSet`.
- **Keep one page's cross-section geometry in one family.** A pipe page reads diameter, depth, top
  width, wetted perimeter and hydraulic radius all in inches. Mixing them (an 18 in pipe reporting
  `T` = 1.5 ft) is the defect to avoid.
- **Choose defaults that open on a *passing* design.** A page that greets a first-time visitor with a
  warning is worse than one that greets them with a worked example. Verify by running the page's own
  `pageCalculator` against its rendered HTML, not by inspection.
- **`echoUnitSelect()` still accepts a raw array** for backward compatibility, but such a select gets
  no family and is therefore **invisible to the preset buttons**. Never leave a new one that way — 32
  row-table selects were nearly shipped ignoring the presets.

### ONLY THE USER TOUCHES A FILE'S NUMBERS (Tom, 2026-08-16 — absolute)

**A number that came from a file is the user's. We display it, we solve from a COPY, and we write
back exactly what came in.** We never rewrite it, and never round it, in the document.

This is the same rule as "a calculator stores what the user typed", extended to imported files —
and the `.inp` importer was precisely the third conversion site that rule warns about. It stored
every value as `toDisplay(<SI>, <unit>)` after `js/lpn-inp.js` had already normalised to SI, so a
US file made a round trip through two factors that are not exact inverses: **710 ft was stored as
709.9913664 and 150 gpm as 149.98747841154.**

- **Better constants do NOT fix this and it is a mistake to try.** Exact factors still fail in
  doubles — `150 * 0.3048 * (1/0.3048) === 149.99999999999997`, and 26% of a 20,000-value sample
  failed to round-trip bit-identically. **Pass-through is the only fix:** when the display unit
  already equals the unit the file states, the file's own number goes straight through untouched.
- **A unit is a LABEL and a MAGNITUDE, and they have different requirements.** The label is a
  string — always storable and displayable verbatim. The magnitude is a factor, and only a *solve*
  needs it. So an unrecognized unit has three outcomes, and the third is the one to get right:
  recognized → display and solve; unrecognized but never computed with → carry it verbatim, no
  problem; **unrecognized and needed for a solve → open the file, draw it faithfully, refuse to
  solve, and say exactly which unit and why.** Never reject the file, never guess. "We don't
  recognize this unit" is a different message from "we cannot give you answers"; say both.
- **The one legitimate exception is the coordinate origin shift**, and it shows the shape a real
  exception must have: `doc.origin` makes coordinates local so float32 rasterising cannot lose a
  pipe at x ≈ 579,350; the absolute position is unchanged by construction, the origin is stored in
  the file, and `dev/lpn-spike/local-origin-harness.js` counts the call sites. Reversible, stored,
  and guarded — anything claiming to be an exception must be all three.
- **Converting to SOLVE is not an exception**, because it does not touch the document.
- **THE INPUT FILE IS CANONICAL, so nothing of ours can validate it.** Our conversion factors cannot
  check a user's numbers — the only correct property is that they come back out unchanged. Phrasing
  like "verify the examples still hold against the corrected factors" has the relationship backwards
  and is the misunderstanding to watch for.
- **Preserve the TOKEN, not the value.** `parseFloat()` at the point of reading a file throws away
  the text, and no downstream code can reconstruct it: `710.0` can only ever come back as `710`,
  and `1.50` as `1.5`. Keep the exact characters beside the parsed number at the one place text
  becomes number, and store the token.
- **The rule that makes this structural rather than a discipline: a number the user supplied and a
  number we computed are different kinds of thing, and must never occupy the same field.** Once
  they are separate there is no code path that writes to the user's field, so nobody has to
  remember anything. Full design: ROADMAP Task 390 and `dev/unit-paradigm-migration.md`, which maps what of
  the old SI-always paradigm is still un-purged.
- **This is testable and must be tested: import then export is BYTE-IDENTICAL for every value the
  user did not edit.** Not "within tolerance" — identical. That is also the acceptance criterion for
  Task 281 (`.inp` export) — met, and guarded by `dev/lpn-spike/inp-export-harness.js`.

### Coordinate order: system is x,y = lon,lat; PUBLIC is lat,lon

Tom, 2026-08-24, having found a button saying `lon/lat` and a status bar leading with Longitude:
*"It should be lat/lon everywhere... history says Lat/Lon."* **The order follows whoever is
reading.**

- **System order — lon, lat.** x is longitude, y is latitude. Arithmetic, GeoJSON, every projection
  formula. Everything computed, stored, projected or exported. Name such a pair `lonLat` /
  `{lon, lat}`.
- **Public order — lat, lon.** Every place a person reads a pair or types one: the status readout,
  the property popup, the Go-to prompt, prose that names the two. Name such a pair `latLon`.
- **A bare `coords` or `point` is the defect** — it commits to neither, so the next reader guesses.
- **The one longitude-first sentence is the one that PAIRS them with x and y** ("the x and y in this
  file really are a longitude and a latitude"): there the order IS the claim, and reversing it makes
  the sentence false. Three shipped strings do this and are correct.

`coord_order_check.php` enforces both halves and knows the exception; it is blocking, and it catches
the two defects that produced the rule.

### Changing a unit reinterprets the typed number; it does not convert it

1 becomes 1 ft instead of 1 m. Long-standing, deliberate, reviewed and kept. Do not "fix" it.
**This is absolute**, and `lpn_` was the one place that broke it — it stored SI and displayed the
conversion, so every unit switch silently rewrote the whole map. Tom: *"a bad design decision was
made without my knowledge to convert inputs when units are switched. Scrub and ban this."* EPANET
behaves the same way we do, so there is no authority on the other side.

**A calculator stores what the user typed. Conversion happens at the solver, and on results coming
back from it, and nowhere else.** If a third conversion site seems necessary, the design is wrong.

### `lpn_` only: there are no browser units, only PROJECT units

A project records its own unit selection (`serializeProject().units`) and restores it on open,
because declarative storage makes a bare number meaningless without them. So there is **no "save
these units as my defaults"** and no per-browser unit cookie for this page — a user who wants
preferred settings saves an empty template project and opens it, which also carries ID prefixes,
default inputs and map appearance. One mechanism instead of two. Detail and the legacy-document
conversion path: `dev/looped-network-calculator-scope.md`.

---

## What may be stored on a visitor's device

Full inventory: `dev/cookie-storage-inventory.md`.

- **Never call `session_start()`.** Call `ecSessionStart()` (`lib/config.inc.php`), which starts one
  only for a visitor who consented, and **write the caller to work when it returns false** — that is
  the normal case, not the error case. A session started at the top of every page load writes
  `PHPSESSID` before anybody has been asked anything, and a banner cannot fix that from outside.
- **The session is analytics ONLY** — it exists to de-duplicate usage logs. Do not put a
  service-related value in it; that is what makes a mixed-purpose cookie unlawful under a per-purpose
  test. A visitor preference belongs in its own deliberately-set cookie (`ec_language` is the worked
  example).
- **Before adding storage, check whether something EXEMPT already answers the question.** A
  repeat-use signal wanted a visited-page list in `localStorage`; the page's own input cookie already
  says the same thing, better ("they calculated here", not "they glanced at it"), and is exempt
  because it holds what the visitor typed. **The cost of new storage is never the bytes — it is the
  sentence in `consent_body` it makes false**, and therefore a banner rewrite, 26 retranslations and
  an `EC_CONSENT_VERSION` bump that re-asks everybody. An analytics READ of exempt storage still needs
  consent, so gate the log row; you just need not ask for anything new.
- **New storage needs the exemption test, per purpose:** is it *strictly necessary for a service the
  visitor explicitly requested*? User-input storage, an explicit preference, the consent record and
  the log opt-out all pass. Anything whose job is to make a **statistic** better fails, whatever the
  technology — `localStorage`, `sessionStorage` and IndexedDB are in scope exactly as cookies are.
  Gate a failing item on `ecAnalyticsConsented()` / `EngCalcs.analyticsConsented()`, and make
  withdrawal delete it.
- **A new log writer must call `ecLogBucketSuffix()`** and append it to the line. Consented rows are
  deduplicated and unmarked; everyone else's are marked `visit` and undeduplicated. **Never sum the
  two buckets** — one counts people, the other counts page loads.
- **Never restyle one consent button to stand out.** `.ec-consent-btn` styles both answers identically
  on purpose; a coloured Accept beside a grey Reject is the dark pattern this design avoids.
- **Cookie lifetimes are defensible out loud.** One year is the house default.

---

## Deploying: three facts that are in no file you will be editing

- **`Options -Indexes` in `.htaccess` needs `AllowOverride Options`, and where that grant is missing
  Apache returns 500 FOR EVERY REQUEST under `/engcalcs/`** — it does not ignore the line. Confirmed
  granted on the current host. **If the site moves, test that line first and drop it if the new host
  500s.** This single directive can take the whole suite down on a host change, and it fails closed
  with no partial symptom.
- **`../sitemap.xml` is regenerated by `dev/scripts/generate_sitemap.php` but is NOT tracked by git.**
  Deployment is `git pull`, so a regenerated sitemap does not travel with the commit — it must be
  re-uploaded to the site root, or deleted URLs stay advertised to search engines. Any task that adds
  or removes a page owes that upload.
- **`git pull` does not preserve mtimes**, so every file's `filemtime` on production is its checkout
  time. That is why the service worker is generated at request time rather than built — a baked file
  cannot know the mtimes the pages will actually request.

Production SSH is blocked on port 22; origin is GitHub, pulled over `ssh.github.com:443`.

---

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
