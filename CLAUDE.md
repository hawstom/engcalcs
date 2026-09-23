# EngCalcs — Architecture & Developer Guide

**What this is:** a PHP/JS suite of hydraulic engineering calculators — 16 calculators, 27 languages. PHP
delivers multi-linguality (language detection, switching, injecting localized strings); all
computation runs client-side in JavaScript. No database, no authentication.

**License:** GNU GPL v3 or later. Copyright 2009 Thomas Gail Haws.

**How to read this file:** it states the current rules, tersely. The reasoning, quotes and
measurements behind them live in the `dev/*.md` each section points at. Where a rule is enforced by
a script, the script's own error text is the authority. **Read `dev/session-handoff.md` before the
roadmap** — its top block is the current freeze, the branches you may not merge, and any open
deploy blocker.

**Keep this file to current rules only. Never append progress notes, changelogs, dated
corrections, or the story of how a rule came about.** That belongs in the commit message, or in a
`dev/*.md` if a future reader would act differently for knowing it. When a rule changes, rewrite
it in place.

---

## Git Workflow

Full record, with Tom's words and the history of each rule: `dev/git-workflow.md`.

**Commit and push by default, without asking, at the end of every piece of work**, unless Tom says
to leave something uncommitted.

- **`master` is the production line and nobody works on it.** Every change starts on a branch,
  however small, and reaches master only by a merge somebody decided to make.
- **A release branch holds the line; a freeze does not.** `release/ewb` is cut from the SHA Tom
  deployed. A hotfix: branch off `release/ewb`, fix, `check_all`, merge, push; he pulls that; the
  same fix is merged to master separately. A clean release can always be cut from a pre-merge SHA
  and fixes cherry-picked on — never tell him otherwise.
- **Merge FROM master often. Merge a capability branch INTO master only on Tom's all-clear.**
  Green is not done. `dev/hooks/pre-merge-commit` enforces it for branches listed in
  `dev/branch-policy.json`; `dev/branch-all-clears.json` pins his words to the commit he cleared,
  so the approval lapses when the branch moves. `feature_freeze.active` refuses a protected merge
  even with an all-clear (only Tom lifts it); `freeze.active` is the separate emergency stop that
  refuses everything but a `hotfix:`. A defect or tooling track merges on green alone.
- **A branch names its capability, in the singular** (`customer`, `projection`, `graph`,
  `custom-property`). A public menu label naming a real collection may be plural.
- **Merged or killed, never left to rot.** `branch_hygiene_check.php` reports stale branches.
- **Capability branches share seams** (`graph`/`custom-property` the bottom-pane tab strip;
  `custom-property`/`customer` the Properties box and Find; `projection`/`customer` placement by
  coordinate). Name the seam in both briefs, or sequence them.
- **When Tom questions a standing rule twice, the rule is the suspect.** Re-argue it from scratch,
  out loud, and say which parts of the original reasoning do not answer what he asked.
- **Stage explicit paths. Never `git add -A`** — concurrent sessions share the working directory.
- **Tell Tom the SHA you pushed.**
- **Author every AI commit** `--author="Claude Code for Tom Haws <tom.haws@gmail.com>"`, so `git
  log` and `git blame` tell his commits from ours.
- **Commit message: a subject of ≤72 characters and no body.** A body only when a future reader
  would act differently without it, ≤40 words.

### Worktrees

- **Concurrent sessions require a worktree** — one checkout holds one branch. A worktree is
  justified by concurrency, never by caution.
- **Give concurrent agents disjoint file territory, and name shared SEAMS in both briefs** (a write
  seam, a resolver, a single source of truth) or sequence them. `scenario_seam_check.php` guards the
  `setProp()` one.
- **Subagents commit in their worktree and never push.** The orchestrator merges promptly, pushes,
  and deletes the branch.
- **Only the orchestrator regenerates `dev/translation_payloads/`, once, before the commit.** A
  subagent that adds a key says so and leaves the payloads alone; its `payload freshness` failure
  is expected.

---

## Application Bootstrap

Every page starts with `require_once('lib/base.inc.php');` — config, language, units, menus, and the
calculator form library. The global `$ec_lang[]` holds all localized strings for the current
language. `lib/config.inc.php` reads `APP_ENV`: `development` → `DEBUG_MODE=true`.

### Key files

| File | Purpose |
|------|---------|
| `lib/base.inc.php` | Master bootstrap — include this and nothing else |
| `lib/Calculators.lib.php` | `echoCalculatorForm()`, `ecTipLabel()`, `ecLinkTipLabel()` |
| `lib/Canonical.lib.php` | `ecCanonicalPaths()` — the one place a pretty URL is declared |
| `lib/Language.Settings.php` | Per-language `QUALITY` weight used in Accept-Language negotiation |
| `js/PipeHydraulics.lib.js` | The suite's one Hazen-Williams constant pair (EPANET's) and `hwSlope()` |
| `js/lpn-geom.js` | `lpn_` pure geometry. No DOM |
| `js/lpn-collide.js` | `lpn_` label collision avoidance. No DOM |
| `js/lpn-rules.js` | `lpn_` EPANET `[RULES]` grammar. No DOM |

Paths to `lib/` inside `dev/scripts/*.php` use `__DIR__ . '/../../lib'`.

### Specialist agents (`.claude/agents/`, journals in `dev/agents/`)

Six seats: `utility-planning-engineer`, `utility-field-operator`, `market-researcher`,
`data-entry-clerk`, `interface-designer` (Ida), and **`pre-reviewer`, which reviews a feature branch
before Tom is asked for a browser pass on it, and reports rather than fixes.** Small fixes and tooling
changes do not need it.
An agent must carry something this repo does not already have — external evidence or an unoccupied
vantage point. Each keeps its own ranked wish list; an agent never edits the roadmap. Roster and
provenance rules: `dev/agents/README.md`.

### Dev folder (`dev/`, blocked from web access)

| Path | Purpose |
|------|---------|
| `dev/session-handoff.md` | **Read first.** RULINGS, TRAPS and dated STATE; delete a state line once checked |
| `dev/ROADMAP.md` | OPEN tasks only. Format `Priority\|ID\|status Description` |
| `dev/roadmap-closed-ids.md` | One line per closed ID, so a cited `Task N` resolves |
| `dev/tom-review-queue.md` | Tom's browser-pass comments, quoted, until cleared |
| `dev/scripts/` | All CLI tools and checks; `glossary.json` is the engineering term glossary |
| `dev/calc-spike/`, `dev/lpn-spike/` | Headless tests. `dev/calc-spike/README.md` is the recipe for a worked example |
| `dev/translation_payloads/` | Per-language JSON payloads for translation sprints |
| `dev/language-strings.md` | Full rules for writing `$ec_lang` / `$ec_lang_syn` values |
| `dev/translation-process.md` | Sprint SOP and full mechanics |
| `dev/testing-notes.md` | What actually catches defects here |
| `dev/english-key-rulings.json` | Tom's approvals of English strings, keyed on the exact text so a ruling lapses when the wording changes. Never hand-edit `dev/new-english-keys.md` expecting it to survive |
| `dev/automated-checks.md` | What each check guards and why, in full |
| `dev/git-workflow.md`, `dev/lpn-rulings.md`, `dev/unit-rulings.md`, `dev/storage-rulings.md`, `dev/deploying.md`, `dev/conventions-record.md` | The full record behind the matching sections of this file |
| `dev/enforceable-rules-survey.md` | Which prose rules a script could hold |
| `dev/unit-families.md` | Unit-family design record |
| `dev/cookie-storage-inventory.md` | Everything stored on a visitor's device, and why |
| `dev/positioning.md` | **Authority for every public claim**, this repo's and the landing page's |
| `dev/reputation-and-practice.md` | The 2026-09-18 plan: silent outages, uptime watch, what not to do |
| `dev/cross-platform-planning.md` | Claude Code / Copilot collaboration conventions |

### Sibling sites

**Push `~/webdev/librewaternet.org` and `~/webdev/not-epanet.org` exactly as this repo is pushed**
(Tom, 2026-09-11), unless he says otherwise for a particular change. Before writing landing-page
copy, read `~/webdev/librewaternet.org/CLAUDE.md` — it does not load from a session rooted here.

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

`mi`, `mtc`, `wi` predate the `*_main_menu` convention and name their menu entry `<prefix>_menu`.
The coverage declaration also lists `irr`, which owns no keys — probably a legacy alias of `ip`.

### `lpn_` in particular

A canvas/map-centric looped network solved by the global gradient algorithm, with a map editor over
it. **A core calculator, in scope in all 26 languages. Never call it "preview".** Scope:
`dev/looped-network-calculator-scope.md`. **Every rule below is argued in full in
`dev/lpn-rulings.md`; read the matching paragraph there before changing the behaviour.**

- **Recalculate OFF means a snapshot, never hide or delete.** Stale results stay on screen until
  Calculate or a deliberate Clear; only opening a different network clears them. An edit still shows
  immediately in the Tables pane, Properties and that element's own map label
  (`refreshOneLabelInPlace()`), and never triggers a network-wide label pass.
  `dev/lpn-spike/stale-snapshot-harness.js`.
- **Vocabulary:** our **Label** is EPANET's Notation; EPANET's **Label** is our **Text**. That one
  collision is the only place we depart from EPANET — **otherwise default to EPANET terminology**
  (static pressure, drawdown, converge, runs), and never invent plain-English substitutes.
- **When one name does two jobs, split it.** Source trace (the analysis, on a Trace node) vs Source
  share (the percentage).
- **Extended-period simulation shipped, through the EPANET engine only** (`js/lpn-time.js`), with
  patterns, reservoir-head and pump-speed patterns, and `[RULES]`. The transport mounts in
  `lpn_toolbar_run`. The built-in solver solves one instant and is not getting a time dimension.
  **"No EPS yet" is false.**
- **PRV/PSV/FCV solve through EPANET only**; TCV solves in either engine. Such a network routes to
  EPANET automatically without rewriting the stored `engine` setting.
  `EngCalcs.lpnValveIsNative` draws that line. Speed is no longer a reason to prefer either engine.
- **A curve is a document object; an element holds only a reference.** `doc.curves` holds
  `{id, kind, points, src, tok}`; the Library's Curves section is the only editor. The reference is
  scenario-overridable, the points are not. The three-point fit is derived, never stored. Four
  kinds, stated in a `;PUMP:`-style comment: PUMP, EFFICIENCY, VOLUME, HEADLOSS. A reference is
  *stated*/*selected*, never "named", in visitor strings. A VOLUME curve is used only by a run.
- **A tank is a fixed head at its water surface** (`EngCalcs.lpnIsFixedHead`). Tank diameter is in
  the LENGTH unit, pipe diameter in millimetres.
- **Basemap and terrain** (`js/lpn-terrain.js`): OSM street tiles; Mapbox satellite and Terrain-RGB,
  gated on `EC_MAPBOX_TOKEN`. Never cached, never precached, attribution required, stored as
  `project.basemap`. Elevation fill has exactly two doors — `Settings > New assets > Elevation
  source` and `From Mapbox DEM` in Find and replace. **Do not add a third.**
- **Four third-party requests, all on this page, all opt-in:** OSM tiles, Mapbox satellite,
  Nominatim search (`js/lpn-search.js`, gate `ec_geosearch`), Terrain-RGB (gate `ec_terrain`).
  Never write "the only third-party request". A fifth service is a new paragraph in `privacy.php`,
  not a `consent_body` change.
- **A geographic project is drawn in Web Mercator and stored in longitude/latitude.** Never store
  the projection. Mission scope is a 300 km system span; `geodesicMeters()` is flat per leg
  (206 ppm at scope). `dev/geographic-projects.md`.
- **Reads and writes EPANET `.inp`** (`js/lpn-inp.js`). Import reports every difference, never
  rejects, never drops silently. Export is character-exact on Net1/2/3.
- **Design for a pointer; make a phone survivable.** Never call it a PC application in public — it
  is a web application. The sanctioned phone claim is the landing page's: *"it works also on a
  phone in tall mode"* — **"a phone", never "your phone"**. The toolbar never becomes a side menu.

---

## How to Add a New Calculator

Follow the `add-calculator` skill (`.claude/skills/add-calculator/SKILL.md`) — every step is required.

---

## Labels, Tips and Shared Concepts

- **Call `ecTipLabel()` / `ecLinkTipLabel()`; never hand-write `.ec-help`/`.ec-tip` markup.**
  `$text` is trusted HTML; `$tip` is plain text. Exactly one `?` per label, always the tip. A link
  with no tip needs no wrapper. Never put explanation in a link's `title=` (touch just navigates).
  If the linked page is untranslated, say "English only" in the tip.
- **Reuse whole labels across calculators, never fragments.** Incumbency decides the owning key;
  menu order breaks ties; the survivor takes the best wording. A shared label fits its narrowest
  use; reuse stops at sentences. Loss symbols: lowercase `h` for components (`h_f`, `h_m`, `h_L`,
  `k_m`), capital `H` for total heads; the term is **"Minor (local) loss"**. Record:
  `dev/label-normalization-decision.md`.
- **Verdict strings lead with `✓` or `⚠`, never a marker word**, and the whole string is the tip
  target.
- **Results columns: width is king.** Keep headings narrow; do not re-flag terse abbreviations.

---

## Language Keys

All display strings live in `lib/lang.ec.??.php` (en + 26: am, ar, bg, bn, cs, de, es, fa, fr, he,
hi, hr, id, it, km, my, ps, pt, ro, ru, sr, sw, tr, uk, ur, zh). **Read `dev/language-strings.md`
before editing any string value.** `lang_syntax_validate.php` enforces: (A) never an HTML entity;
(B) never a tag in a plain-text-bound string, including dialog text; (C) advisory name/derivation
mismatch; (D) single-quoted values only.

- **`$ec_lang_syn` is OFF-LIMITS to AI** without explicit written permission in that conversation.
  Propose a diff; Tom approves; then write. No standing carve-outs. Entries are synonyms that pass
  the substitution test.
- **Routing:** an English reader also stumbles → fix the English; English is fine but untranslatable
  → `$ec_lang_syn`; the concept recurs → `glossary.json`.
- **Never rename a key by hand** — `php dev/scripts/rename_lang_key.php old new --apply`.
- **English style:** APA 7th for mechanics (American spelling, serial comma), and no em dash in
  visitor-facing English. No other house style.
- **Keep sibling keys parallel in name and value across all 27 files.** An unrendered key is not
  automatically debt; decide per key, never bulk-delete (`key_hygiene_check.php` lists candidates).

## Translation Sprints

**Full mechanics: `dev/translation-process.md`.** Hard gates:

- **Explicit authorization before launching**, never inferred from "proceed". Announce the count
  ("Starting N agents, one for each language"); the cap is 20 concurrent, so 26 runs as 20 then 6.
- **Sonnet for every translation agent, always.** One agent per language, saving ~50-key batches as
  it goes.
- **Must exit 0 before launch:** `friction_check.php --sprint=<id>`, `gloss_ref_check.php`,
  `generate_translation_payloads.php --check`. Regenerating payloads is the AI's job.
- **Glossary write-back before the sprint closes.** `detect_english_drift.php --baseline-new`
  closes it.
- **Wave 0 never re-litigates a string Tom has ruled on** (`wave0_keyset.php` excludes them).

**Anchor languages are declared in `glossary.json`'s `meta.anchor_languages` — read that, not this
line.** They are `es, pt, fr, tr`. They replaced `es, fr, ru, ar`
because ru and ar cannot be observed; their translation quality stays fully in scope.

**The coverage declaration** (`dev/scripts/translation_coverage.json`): a cell is in scope iff the
calculator is core (`mpf`, `mtc`, `lpn`) OR the language is core (`es`, `pt`, `fr`, `tr`).
**Exempt** (identical-to-English is correct) and **out of scope** (not translated yet) are never
merged. **`QUALITY`** in `lib/Language.Settings.php` is an honest defect-risk estimate, set via
`update_quality_score.php`. **Never log a language as "awaiting native review."**

---

## Automated checks — `sh dev/scripts/check_all.sh`

`check_all.sh` runs every check, and the pre-push hook refuses to push master unless it passed on
that exact commit. Each failure explains itself; what each check guards is in
`dev/automated-checks.md`. Run it as `flock /tmp/engcalcs-checkall.lock sh dev/scripts/check_all.sh`,
at most about three at once.

**Add a check for a defect a visitor could hit that a person would miss.** Do not add checks that
police the wording or layout of documentation, or that check other checks.

Tom will not read code. Save his attention for naming, scope, wording, and whether an
unreferenced key is debt.

## Testing

Prefer a harness in `dev/lpn-spike/` or `dev/calc-spike/` to asking Tom for a browser pass.
Headless browser runs go through `flock /tmp/engcalcs-browser.lock`. Render a page outside a web
request only with `dev/scripts/render_page.php` (global scope, one page per process).

---

## Unit Sets

Full record: `dev/unit-rulings.md` and `dev/unit-families.md`.

- **A field declares a named unit family**, never an inline array. Families live in
  `lib/Units.lib.php`; presets `us` and `si` map every family to one unit, and **every family must
  appear in every preset.** Factors are "that unit per SI unit"; JS reads one only via
  `EngCalcs.unitFactor()`. A stored unit is its NAME (`ft`), never its factor.
- **First-visit preset** (`ecDefaultUnitSet()`): US only for an English page with a US region; SI
  otherwise; no header keeps US for the harnesses. **Option order is measured** — re-measure before
  re-sorting.
- **Split a family when two fields want different defaults**, not different options
  (`distance_small` vs `distance_large`). Which family a field names is a per-page choice.
- **A `default` is in the displayed unit**, so unit-bearing fields declare one per preset:
  `'default' => Array('us' => '6', 'si' => '150')`.
- **Keep a page's cross-section geometry in one family.** Choose defaults that open on a passing
  design, verified by running the page's own `pageCalculator`.
- **Changing a unit reinterprets the typed number; it never converts it.** A calculator stores what
  the user typed; conversion happens at the solver and on results, nowhere else.
- **Only the user touches a file's numbers (absolute).** Display them, solve from a copy, write back
  exactly what came in. Pass the token through when units match; keep the exact characters beside
  every parsed number; a supplied number and a computed one never share a field. Import→export is
  byte-identical for unedited values. An unrecognized unit: carry it verbatim, and if a solve needs
  it, draw the file, refuse to solve, and say which unit. The one exception is the coordinate origin
  shift (`doc.origin`), which is reversible by construction.
- **Coordinates:** system order is lon,lat (`lonLat`); public order is lat,lon (`latLon`). A bare
  `coords` is the defect. The one lon-first sentence is the one pairing them with x and y.
- **`lpn_` settings belong to the PROJECT or the BROWSER, never both.** Modelling data (units,
  friction method, defaults, prefixes, colouring, labels) rides in `serializeProject()`; window
  furniture (`lpn_pane`, `lpn_rpane`, `lpn_setbox`, `lpn_findbox`, `lpn_ffbox`, `lpn_energybox`,
  `lpn_cmpbox`, `lpn_reportbox`) is `localStorage` only. A new project gets hard-coded defaults.
  **Never a "save current settings as default" button** — a template is a file.

---

## What may be stored on a visitor's device

Full record: `dev/storage-rulings.md`; inventory: `dev/cookie-storage-inventory.md`.

- **No PHP session at all.** `no_session_check.php` blocks it. Bringing one back is a consent-version
  bump and 26 retranslations — have that conversation first.
- **Check whether something exempt already answers the question before adding storage.** The cost is
  the sentence in `consent_body` it makes false.
- **New storage passes the exemption test per purpose** (strictly necessary for a service the
  visitor requested), or is gated on `ecAnalyticsConsented()` / `EngCalcs.analyticsConsented()` and
  deleted on withdrawal. Applies to every storage technology.
- **A new log writer appends `ecLogBucketSuffix()` last. Never sum the two buckets** — one counts
  people, the other page loads.
- **Never restyle one consent button to stand out.** Cookie lifetimes default to one year.
- **Tell Tom about any change to what is stored on a visitor's device.**

---

## Deploying

Full record: `dev/deploying.md`.

- **Production is not master; it is the SHA Tom last pulled.** Never say "it is live" because you
  pushed. Tom does the pulling. The About box's build line reports what is deployed.
- **`Options -Indexes` needs `AllowOverride Options`**, or Apache 500s the whole suite. Test it first
  on any new host.
- **`../sitemap.xml` is not tracked**; adding or removing a page owes a regenerate
  (`dev/scripts/generate_sitemap.php`) and a manual upload.
- **`git pull` does not preserve mtimes**, which is why the service worker is generated per request.
- **Every host serving the suite runs the same PHP version** (currently `ea-php83`); new cPanel
  domains default to `ea-php56` and 500 on every page.
- Production SSH is blocked on port 22; origin is GitHub over `ssh.github.com:443`.

---

## Writing things down

- **A correction replaces the superseded reasoning in every doc, not just this one.** Keep the
  conclusion and the one rejected alternative that would otherwise be re-proposed.
- **Don't attribute repo prose to Tom.** Quote only the transcript or a dated first-person quote.
- **ROADMAP priority is 100 and 99 Next, 75 Soon, 50 Someday, 25 Maybe, 5 Parked, or 0 closed**
  (`roadmap_id_check.php`). Entries run 1–3 lines, hard cap ~15; past that, a `dev/*.md` and a
  pointer. Closing a task is one line in `dev/roadmap-closed-ids.md` plus deleting the block.
- **Suite-wide UX/convention issues go to `dev/ROADMAP.md`**, not inline fixes during
  single-calculator work.
