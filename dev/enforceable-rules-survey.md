# Enforceable-rules survey — which half of the prose a machine could hold

**ROADMAP Task 322, half B.** `CLAUDE.md` ends its checks section with the claim that a rule a
machine enforces is worth roughly ten a human must remember, and that **its unexecutable half is
decoration**. Nobody had ever counted which half that is. This is the count, and the ranked list of
what it would cost to move a row from one half to the other.

**Method, stated so the numbers can be argued with.** Every normative statement in `CLAUDE.md` was
read and classified, then the `dev/*.md` set was swept for rules stated as absolutes (`never`,
`always`, `must`, `forbidden`) that are not already restatements of a `CLAUDE.md` rule. A normative
statement is one that tells a future contributor to do or not do something — not a fact, not a
record, not a positioning claim. The boundary is a judgement call at the margin and another reader
would land within about ten percent of these numbers.

## The count

| Class | CLAUDE.md rules | What it means |
|---|---:|---|
| **Already enforced** by a script in `check_all.sh` | 34 | The executed half — 34 of the 40 registered checks guard a rule this file states; the other 6 guard the language itself (php/js/shell syntax, harness runners). Every one stopped being violated. |
| **Enforceable and not yet enforced** — the rows below | 27 | The decoration that could stop being decoration. **Eight landed on 2026-08-28**: rows 1-3 with the survey, then 3b (a defect its own row-1 sibling had been blind to) and rows 6-9 the same day. **Rows 4, 5 and 3d landed on 2026-08-29, and row 3c the same day — the last of the run.** Row 6 is the one worth reading: writing the check is what discovered the rule named a function that does not exist. |
| **Not mechanically checkable** | 41 | Judgement, identity, positioning, and rules about how to think. Prose is the right home. |

So the file is roughly a third enforced, a quarter reachable, and **two fifths permanently prose** —
which is a better answer than "half decoration" and a worse one than it looks, because the
unenforceable 41 include the most expensive rules in the file (what may be claimed in public, what
may be stored on a visitor's device, when to spend Tom's attention). **The prose is not decoration
where it carries the rules no check can reach; it is decoration where a check was possible and
nobody wrote it.** The 27 rows below are that second thing.

## Ranked by value / cost

Value is what a violation costs *when it ships*, weighted by whether the defect is SILENT — no
error, nothing to see on the page — because a loud defect has other finders and a silent one has
none. Cost is a working PHP check with its own error text, excluding its selftest (add ~50 lines
for one of those wherever the row is blocking).

| # | Rule | Stated in | A check would read | PHP lines | False positive possible? |
|---|---|---|---|---:|---|
| 1 | **DONE** — every literal `$ec_lang['k']` a page reads is a defined key (it renders as the empty string in all 27 languages otherwise) | CLAUDE.md § Language Keys, implied by the fallback design | `lang.ec.en.php` keys; a token scan of root `*.php` and `lib/*.php` | 60 | No — token scan, so a concatenation, a variable and a comment are all invisible to it. Shipped as `lang_key_resolve_check.php` |
| 2 | **DONE** — every unit family appears in every preset; a preset only picks a unit its family offers; every offered unit has a factor; a page's `'units' => 'x'` names a real family | CLAUDE.md § Unit Sets; `dev/unit-families.md` §presets | `$ec_unit_families`, `$ec_unit_sets`, `$ec_units`, literal `'units' =>` declarations | 70 | No. Shipped as `unit_family_check.php` |
| 3 | **DONE (advisory made actionable)** — the English-drift NOTE printed no text at all, because `check_all.sh` piped the report through `grep -q`. Nine role changes were invisible | CLAUDE.md § advisory checks | `detect_english_drift.php --check --brief` | 30 | n/a — still advisory, and must stay so |
| 3b | **DONE 2026-08-28** — `pageconfig_check.php` matched only the literal `pageConfig.<key>`, and `js/looped-network.js` reads all 838 of its strings through `var pc = EngCalcs.pageConfig`. **The biggest page in the suite was the one page the check could not see**, and it reported OK while `lpn_labels_col_drop` sat translated into 26 languages and wired into nothing | this file, row 1's sibling; found by hand while closing Task 542 | alias declarations (`= EngCalcs.pageConfig` whose next non-space character is not a dot) plus `<alias>.<lower_snake_key>` reads | 25 | No — the key SHAPE is the defence: an alias's ordinary properties (`pc.length`, `cfg.x`, any DOM property) have no underscore, and every key the 14 pages declare has one. Shipped in `pageconfig_check.php`, guarded by `pageconfig_selftest.php` (9 fixtures, both directions). Reads went 107 → 743 |
| 3c | **DONE 2026-08-29 — A DEAD READER HIDES A DEAD KEY.** `key_hygiene_check.php` reported "rendered by nothing" by counting references, so a string whose only reader was itself uncalled never appeared. Task 542 left `lpnTerrainMenuLabel()`/`lpnTerrainMenuTip()` behind and their two strings sat in 27 language files, reaching no screen, invisible to the check | CLAUDE.md § Language Keys, implied | a reachability walk from the page's own entry points, not a reference count | 230 | Yes, and it stays ADVISORY for that reason. Shipped as `key_hygiene_walk.inc.php` (finding 1b of `key_hygiene_check.php`) + `key_hygiene_selftest.php` (11 fixtures). **The keys themselves were already gone** — Tom ruled on `lpn_terrain_menu` before this was written — so the walk is verified against a RECONSTRUCTION of the pre-deletion tree, where it names both, and fixture 1 is that shape verbatim. On today's tree: 0 candidates, 13 functions reached from nothing (all declared, e.g. `toggleRightPane` held for Task 509), 212 turned away and counted in the report. Two conservatisms are load-bearing and were both measured: the dev harnesses count as ROOT text, or 18 test seams read as corpses; and a key is looked for in the COMMENT-stripped source, or `js/lpn-terrain.js`'s own comment naming the deleted key suppressed the candidate |
| 3d | **DONE 2026-08-29 — A RUNNER THAT CAN SKIP MUST SHOUT, AND ITS HEADLINE MUST BE A FRACTION OF THE ASK.** `dev/browser-pass/run.js` reported `849/864 checks passed` while twelve of thirty-eight sections had been dead for two days: a percentage of what RAN goes UP as coverage falls. The audit of every other runner found five more of the shape and two live silent skips | ROADMAP Task 322's own block; `dev/testing-notes.md` | not a check but a repair, per runner: count the ask before running, name every skip, print `ran/asked` | 60 | n/a — see the paragraph under this table for what each one was |
| 4 | **DONE 2026-08-29** — every prefix is either WIRED in `prefixToTermNames()` or DECLARED to own no glossary term. A missing one does not fail: it silently gets flow/velocity/slope, and every definition, preferred translation and `avoid` array written for that calculator reaches nobody. It happened to `lpn`/`bpn` (months) and to `menu`/`about` (Task 244), both found by a human reading the map | CLAUDE.md § How to Add a New Calculator, step 11 | `prefix_terms.inc.php` against the prefixes `lib/lang.ec.en.php` actually has | 40 | No — a prefix owning no glossary term is legitimate and 8 do (`u`, `ec`, `view`, `points`, `template`, `index`, `install`, `contact`), so they are DECLARED in the check with a reason each and a new prefix fails until somebody writes down which of the two it is. Shipped as `prefix_map_check.php` + selftest (12 fixtures). **It reads what gloss_ref_check.php cannot**: that check only sees a prefix somebody already wrote a `gloss:` pointer for, and a new calculator has none — which is exactly when step 11 gets forgotten |
| 5 | **DONE 2026-08-29, and the table was stale in EIGHT places** — `check_all.sh` and the `CLAUDE.md` check table name the same set | CLAUDE.md § Automated checks | `check_all.sh`'s `run_check` lines vs the table's rows, matched on SCRIPT FILENAME | 40 | No. Shipped as `check_table_parity_check.php` + selftest (16 fixtures), `--advisory` to demote. **It matches on filenames, not labels**, deliberately: a terminal label and a table cell are different registers, and requiring the strings to match would mean editing `CLAUDE.md` to reword a label. Missing rows found: `focus_order_check.php`, `social_card_check.php`, `vendor_integrity_check.php`, `coord_order_check.php`, `generate_features.php`, `new_english_keys.php`, `example_folder_check.php`, `mode_name_check.php`, plus the `php + js syntax` row, which has checked shell too since the shell pass was added under it |
| 6 | **DONE 2026-08-28, and the rule was WRONG.** It said *call `ecSessionStart()`* — **that function does not exist**, Task 288 removed `PHPSESSID` outright and the helper went with it, so the honest number of sessions is ZERO rather than "one, gated". Writing the check is what found it | CLAUDE.md § What may be stored (now corrected); `dev/cookie-storage-inventory.md` §phase 1, now marked superseded | a TOKEN scan of root and `lib/` for `session_start`/`session_id`/siblings | 60 | No — token scan, so the two places this repo mentions it in COMMENTS, both recording the removal, are invisible; a grep would have reported the fix as a violation of itself. Shipped as `no_session_check.php` + selftest (11 fixtures) |
| 6x | *(superseded)* Never `session_start()`; call `ecSessionStart()` — a session started before consent writes `PHPSESSID` on every page load and no banner can fix that from outside | CLAUDE.md § What may be stored | a grep of `*.php` outside `lib/config.inc.php`, comments excluded | 20 | No |
| 7 | **DONE 2026-08-28** — `$html_desc` never points at `$html_title` or a `*_main_title` key — Google discards a duplicate-of-title description and auto-generates a snippet from a page that is a form | CLAUDE.md § Meta description | each page's `$html_desc = ...` assignment | 30 | No |
| 8 | **DONE 2026-08-28** — every page sets `$html_desc` except the declared exempt list. **A page is one that calls `echoHeader()`**, which is what separates the 25 pages from the 8 endpoints beside them without a second list to maintain. The exempt list lives in the check now, and an entry naming a page that no longer exists is itself a finding | Every page sets `$html_desc` except the five named, and `$html_desc` now feeds `og:description` too, so an unset one is a share card with no subtitle | CLAUDE.md § Meta description | which pages assign it, against a declared exempt list | 35 | No — and the prose list was wrong until 2026-08-25, which is the argument for the check |
| 9 | **DONE 2026-08-28** — no hardcoded `?v=N`; cache-bust with `filemtime()` | CLAUDE.md § How to Add a New Calculator, step 9 | asset URLs in every page's source | 25 | No |
| 10 | **Tiles never enter the service worker manifest**, and no map host may appear in it — the offline promise and the no-request-until-asked promise both live here | `dev/geographic-projects.md` §tiles | what `sw.php` emits | 15 | No |
| 11 | **The suite makes exactly four third-party requests, all opt-in** — a fifth is a new paragraph in `privacy.php` and a new consent gate | CLAUDE.md § `lpn_`; `dev/cookie-storage-inventory.md` §5 | request-shaped call sites (`fetch(`, `new Image`, `src =`) in `js/*.js` against the four declared hosts | 50 | Yes, both ways — an `<a href>` and a URL in a comment are not requests (measured: 11 distinct hosts appear in `js/*.js`, and only 3 of them are requests), so the check must match the call shape and will still need an allowlist |
| 12 | **The cookie/storage inventory is complete** — every cookie and every `localStorage` key a shipped file writes appears in `dev/cookie-storage-inventory.md` | CLAUDE.md § What may be stored; the inventory's own premise | `setcookie(`, `localStorage.setItem(`, `sessionStorage`, IndexedDB names vs the inventory's table | 55 | Yes — `lpn_` builds document keys dynamically, so the check has to compare PREFIXES for that family |
| 13 | **ROADMAP blocks are 1–3 lines, hard cap ~15** | CLAUDE.md § Writing things down | `dev/ROADMAP.md` block extents | 20 | No — but **34 of 58 open blocks are over the cap today** (Task 530 is 133 lines), so it can only land as a NOTE, or as a ratchet on new blocks, and trimming is Tom's call not a script's |
| 14 | **Never rename a key by hand** — the tool also updates the drift manifest, the exempt list and the coverage declaration, and every miss fails silently | CLAUDE.md § Language Keys; `dev/language-strings.md` §renaming | `english_string_hashes.json`, `translation_exempt_keys.json` and `translation_coverage.json` for entries naming a key English no longer has | 35 | Yes — a deliberately deleted key leaves the same trace as a hand rename, and 33 such orphans exist today. Advisory, or blocking only after a prune flag exists |
| 15 | **A `layout`/`avoid`/`gloss`/`symbol`/`runtime` tag never appears LEFT of the pipe** in `$ec_lang_syn`; the left side is translatable payload only | `dev/language-strings.md` §format | `$ec_lang_syn` values, split on the first pipe | 25 | No. `layout_tag_check.php` reads the right side only, so this is the unguarded half of the same rule |
| 16 | **Anchor languages are `glossary.json`'s `meta.anchor_languages`, read from there and not restated** | CLAUDE.md § Translation Sprints | every doc and script naming an anchor set, against the JSON | 30 | Yes — prose naming the four languages for another reason reads identically |
| 17 | **Never log a language as "awaiting native review"** | CLAUDE.md § Translation Sprints | `lib/Language.Settings.php` and the `dev/*.md` set | 15 | No |
| 18 | **Every declared language has a lang file and a `QUALITY` weight, and every lang file is declared** | CLAUDE.md § Language Keys / `Language.Settings.php` | `glob(lang.ec.*.php)` vs `$all_language_settings` | 25 | No |
| 19 | **A new JS module must be added in THREE places** or the harnesses break confusingly | `dev/testing-notes.md` §refactoring | `js/*.js` vs the page's `<script>` tags, the sw manifest and the harness loader | 40 | Low — a module deliberately loaded on one page only needs an exemption |
| 20 | **`echoUnitSelect()` is never called with a raw array** — such a select carries no family and is invisible to the preset buttons | CLAUDE.md § Unit Sets; `dev/unit-families.md` §migration | call sites of `echoUnitSelect(` | 25 | No, for literal array arguments; a variable holding one is out of reach |
| 21 | **A calculator page is in `Menus.lib.php` and owns a documented prefix** | CLAUDE.md § How to Add a New Calculator, steps 2 and 7 | root pages vs the menu builder vs the prefix table | 40 | Yes — non-calculator pages (`About`, `privacy`, `terms`) need a declared exclusion list |
| 22 | **A commit subject is ≤72 characters with no body**, and carries the `Co-Authored-By` trailer | CLAUDE.md § Git Workflow | `git log` for the commit being made | 25 | No — but it belongs in a `commit-msg` hook, not in `check_all.sh`, which runs BEFORE a message exists. The measured problem is real: a body on 99 of the last 100 commits, median 297 words |
| 23 | **Never `git add -A`** — it commits a concurrent session's in-progress work | CLAUDE.md § Git Workflow | the command itself | 15 | No, but only reachable as a shell hook; nothing in-repo ever sees the command |
| 24 | **Every path `CLAUDE.md` cites exists** | implied by the whole file | backtick-quoted paths against the filesystem | 25 | No for `CLAUDE.md` (0 dead pointers today). **Yes for `dev/*.md`**: 31 dead citations, and nearly all are legitimate history in `history.md`, `roadmap-closed-ids.md` and `translation-execution-log.md`, so widening the scope makes it a judgement call |
| 25 | **Never explanatory text in a link's `title=`** — on touch, a bare `<a title>` just navigates | CLAUDE.md § Labels, Tips | rendered pages: `<a>` with a `title` and no `.ec-help` sibling | 35 | Low |
| 26 | **A verdict string leads with `✓` or `⚠` and never a translated marker word** | CLAUDE.md § Verdict convention | English verdict values in `lang.ec.en.php` | 30 | Yes — "which strings are verdicts" has to be inferred from the key name |
| 27 | **DONE 2026-08-28** — forbidden public claims in shipped strings — "your phone" (it is always "a phone"), "PC application", "the only third-party request", "no extended-period simulation yet" | CLAUDE.md § `lpn_`; `dev/positioning.md` | `$ec_lang` values, English only | 30 | No inside shipped strings; **yes** the moment the scan is widened to `dev/*.md`, where every one of those phrases appears in the rule that forbids it — so it is scoped to `lang.ec.en.php` and says so. Shipped as `public_claim_check.php` + selftest (12 fixtures). **The load-bearing fixture is the SANCTIONED sentence**, which contains "your PC" and "a phone" and is one word from two of the four denials |

## The runner audit (row 3d), and what it found

`dev/browser-pass/run.js` was repaired under Task 322 after twelve of its thirty-eight sections had
been dead for two days behind `849/864 checks passed`. **That percentage is a fraction of what RAN,
so it RISES as coverage falls** — the more that goes missing, the healthier the headline looks. The
lesson generalises to every runner in the repo, so every other one was read against two questions:
*can it silently do less than it was asked?* and *is its headline a fraction of the ask or of the
reach?*

`dev/scripts/check_all.sh` was already right: it derives its harness counts from the same globs the
runners use rather than typing them, after a label once said "(12)" while 15 scripts ran. Six others
were not, and all six are fixed:

| Runner | The shape | The repair |
|---|---|---|
| `dev/scripts/run_harnesses.sh` | `set -e` around a glob: the first failing harness ended the run and the ones after it were never mentioned. No total at all, so the only count was `check_all.sh`'s separate glob, free to drift from the runner's | Counts the ask first, runs every harness regardless, prints `N/N lpn harnesses passed` and names the failures. **An empty glob now fails** rather than reporting a clean run of nothing |
| `dev/scripts/run_calc_harnesses.sh` | The same, exactly | The same |
| `dev/lpn-spike/validate_epanet.js` | `.filter(Boolean)` over a typed list of case OBJECTS: a case renamed in `cases.js` arrived as `undefined` and was dropped in silence. The run got shorter, everything left passed, and the last line agreed | The list is NAMES; a name with no case is a FAIL, and the tally reads `11 passed, 0 failed, of 11 asked for` |
| `dev/lpn-spike/validate_inp.js` | Skips a file's numeric comparison when the import lost something — correctly — but printed only `N/N checks passed`, a fraction of what ran | Prints `compared/asked` files and shouts the skip list, with the reason per file |
| `dev/browser-pass/run.js` | Its `SPECS` list is TYPED and its spec files are a directory. A spec file not in the list never runs, and nothing said so — the same defect the runner had just been repaired for, one level up | An unlisted spec file is named and fails the run. (Zero today, and the ordered list stays: the order is the run order) |
| `dev/scripts/social_card_check.php` | **A live silent skip**: a page that produced no `<head>` was `continue`d over, and the closing line counted pages that HAVE a card with no denominator. `consent.php` — a 303 redirect endpoint — had been quietly outside the check | Unrendered pages are a finding; `consent.php` is now in the declared skip list with its reason; the line reads `25 of 25 pages asked for` |
| `dev/scripts/html_balance_check.php` | Printed its SKIP lines loudly (good) but closed on `26 page(s) checked`, with the 30 it was asked for nowhere on screen | `26 of 30 page(s) checked, 0 failing, 4 skipped: <names>` |

Two of the seven were real coverage holes rather than reporting weaknesses: `consent.php` had never
been examined by the share-card check, and any renamed case in `cases.js` would have left
`validate_epanet.js` quietly smaller. **Neither would have shown up as a failing run**, which is the
whole point of the rule.

## What must stay prose, and why it is not decoration

The 41 unenforceable rules are not a backlog. They fall into four kinds, and each kind is a reason
a check would be worse than nothing:

- **Judgement at the margin.** Is a key rendered by nothing debt, or content a page lost? Is a
  1,900-line file too long? Is a changed English string worth 26 translators? A check here is muted
  within a month, and a muted check is worse than none because its silence still reads as approval.
- **Identity and positioning.** "It is a web application, not a PC application." "A phone", never
  "your phone". These are decisions about what may be said in public, and the only mechanical
  fragment is row 27 — the literal phrases, inside shipped strings, where quoting is impossible.
- **Rules about how to think.** Split by purity. Ask what shape of input a harness's fixtures cannot
  express. Decide what the answer would change before collecting it. Nothing to read.
- **Rules whose subject is a person.** Reserve Tom's attention for naming and scope; propose before
  spawning 26 agents. The check is the conversation.

## What was deliberately left advisory in half A, and why

- **`size_budget_check.php` — entirely.** Both numbers in it are judgement calls (1,500 lines,
  80 lines) and nothing it prints is a defect; its own docblock makes the argument. A ratchet on the
  high-water mark would be mechanical, and it would fail a commit for a legitimate addition, which is
  the fastest known way to teach a team to pass `--no-verify`.
- **`key_hygiene_check.php`'s two findings.** "Rendered by nothing" is explicitly not-automatically
  debt, and two of the eight listed keys exist precisely so another check can hold every language to
  them. Suffix drift is a rename, and a rename is a decision. **Their mechanical dual is now
  blocking** as row 1: whether a key should exist is judgement; whether it does is not.
- **`detect_english_drift.php`'s CHANGED gate.** A URL fix and a rewritten sentence produce the same
  hash mismatch, and the script's own `--update=<key>` machinery exists because only a human can tell
  them apart. Worse, blocking would push the reader toward `--update`, which baselines real drift
  away — the check would destroy its own signal to stay green. It was made LOUDER instead: it used
  to print nothing at all.
- **`stale_claim_check.php`.** Citing a closed task as a record is legitimate prose; the check says so
  itself. Its demotions were already made blocking by `stale_claim_selftest.php`, which is the model
  the two new checks follow.
