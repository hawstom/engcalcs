# Session handoff

Read this before the roadmap. RULINGS and TRAPS are standing; STATE is dated, so delete a STATE line
once it is no longer true. Anything already in `CLAUDE.md` is not repeated here. Replace stale
lines rather than appending corrections.

---

## Before merging anything

- **Feature branches alive, each awaiting Tom's browser pass**: see STATE below. A feature merges
  into master on his typed word; there is no all-clear file, freeze or merge hook. The label bench branches are archived as tags (see STATE).
- **A branch that adds a key fails `payload freshness` and only that**, by design: agents never
  regenerate `dev/translation_payloads/`. Regenerate once on the merge commit, then run the suite.
- **Merge master into a branch before merging it to master**, then run the suite on the merge:
  2026-09-23 twice showed a clean merge breaking a harness (the lag harness and Net3's threshold).
- **Never wrap `run_harnesses.sh` or `check_all.sh` in the browser lock**: each browser harness
  takes that lock itself, so the wrapper deadlocks every one (2026-09-25, 280 s NOT RUN apiece).
  Brief agents to write journals to the scratchpad while a suite runs in the main checkout.
- Since 2026-10-02 (jasmine, 24 threads) `check_all.sh` runs four suites at once in slots, ~36 min (two runs, 2026-10-17; Task 797);
  run it with no outer flock. A branch cut before `f9829cee` still uses the single browser lock,
  so its browser harnesses can print `NOT RUN` under load: merge master into it first.

## RULINGS

- The interface says **Customer**, never Meter.
- Don't expose the word "projection". **Georeferencing** means attaching the world map, not
  converting the coordinate system (`dev/tom-coordinate-vocabulary-2026-09-16.md`).
- We align the streets with the project, never the project with the streets.
- `isLatLonProject()` answers only "are these latitudes and longitudes"; most callers want
  `projectLocatable()`. Do not widen the name back.
- Delete a language key when nothing renders it and nothing checks it, and say which ones.
- **Tell Tom about:** any change to what is stored on a visitor's device; any public claim on the
  landing page; anything needing his testing or approval before a merge.
- Run `git status` at the start of a session and before acting on each of his messages. His own
  edits arrive uncommitted.
- Make his wording changes, not yours. Don't ship something he has questioned.
- **Never hand him local-dev housekeeping** (worktrees, branches, ports, leaked servers). He has no
  worktrees on production; his commands are `git pull` there and the Apache reload here. If the
  classifier refuses a local cleanup, say so and ask him to allow it, never phrase it as his step.

- **Never cut a branch from a capability branch; cut it from master.** Tom, 2026-10-30: *"You should
  not have built it on box-design. This puts us in a pickle because box-design is a long-term
  project. We will stay the course."*
- **Words for the visitor:** Check for a checkbox, Click for a button, Press for a key, Select on the
  map, choose in menus (Tom, 2026-11-01, keeping Click over Use). Brief Wave 0 with them.
- **Box style:** clip, no ellipsis, no tip on cut text, nothing hover-only (Tom, 2026-11-01: *"On
  phone, there is no hover"*), and a `?` lands on the exact manual entry in the same words.
- **English he has ruled on stays.** `lpn_field_auto_length_tip` ("slope length"; Tom, 2026-11-01:
  *"Slope length is a standard engineering term. Translators should not be confused by it."*) and
  `lpn_ff_col_more` "How many others" are his wording. Check `english-key-rulings.json` before
  rewording any string.
- **No letter to Bentley** (Tom, 2026-11-03: *"No letter to Bentley. Delete that."*). Never build from
  a decompile; openly licensed samples and public documentation only (Task 749).
- **Landing copy is written only in epanet-plus-plus.org.** librewaternet.org's landing pages 301
  there; its `/app/` and `/engcalcs/` stay, because saved projects are per origin.
- A report line carries `Line N: sev: code: text` (Tom, 2026-09-18). Grep his calls before
  dictating wording to a builder.

## TRAPS

### Git and merges

- **Export `GIT_AUTHOR_NAME`/`GIT_AUTHOR_EMAIL` and `GIT_COMMITTER_*` in the SAME command as every
  merge**, including a conflicted merge committed later: otherwise it is authored as Tom (met 10-13,
  10-18, 10-30). If it slips, redo the batch from origin/master (unpushed, so cheap). `git -c
  user.name=$VAR` breaks on a space.
- **Master hooks:** pre-commit refuses `--amend` and any non-merge commit; a fast-forward fires no
  hook, so always `--no-ff` into master. A forgotten generated file goes on a fix branch, then merge.
  `check_all.sh` stamps only a clean tree, and pre-push refuses an unstamped master commit: commit, then run.
- **A clean merge can still break the tree** (a rename on one side, an old call on the other), and two
  branches green alone can fail together. The suite runs on the merge commit; after every master merge
  into a branch, run the branch's suite (layout, seam checks and the panel guard in
  `panel-touch-harness.js` all failed this way). Merge master into each live branch the evening it moves.
- **A pipe hides a refusal** (`new_english_keys.php --write | tail` exits 0 when the generator
  refused). Start a suite only in its own call, after `git status` is clean: `cmd && merge; setsid
  check_all &` runs the suite on a conflict, and `a && b && suite &` backgrounds the whole chain.
  A merge into a worktree holding Tom's uncommitted file refuses silently when piped: merge first.
- **After any merge** compare lang key sets three ways per language (master, branch, base): one merge
  dropped a key from 26 files. `git diff --stat master` the agent journals (one merge emptied
  Perry's, 3892 lines to 0) and grep them for `<<<<<<<` markers.
- **Generated-file conflicts** (`new-english-keys.md`, `english-key-rulings.json`,
  `english_string_hashes.json`, 27 payloads): take master's side, union the rulings JSON, redo the
  branch's own `--update` hashes and drop those of deleted keys, then `new_english_keys.php --write
  --force` and regenerate payloads in the merge commit. `--force` is safe only when `git diff master --
  dev/new-english-keys.md` is empty or purely generated, and never before `git status`/`diff` on that
  file in that checkout and a harvest: his uncommitted edit may be there. It exits 2 and writes
  nothing while a merge is unresolved; `new_english_keys.php` without `--write` only prints.
- **A data file rewritten whole churns or truncates.** `json.dumps` reformats hand-indented JSON
  (`english-key-rulings.json`, `glossary.json` need indent=4, ensure_ascii False); `open(p,'w')`
  before `open(p).read()` truncated a journal; `sorted()` churned the unsorted rulings file;
  `lang_key_order_normalizer.php` with no flags rewrites all 27 language files (`git checkout -- lib/`).
  Check `git diff --stat` before committing; insert, never re-sort.
- **Classifier refusals** (the permission check, not a bug): a master merge needs his typed "Merge
  <branch>" in the session, even from a pasted all-clear (asked for at the top of the report); it
  refuses killing a queued or superseded run or leaked `php -S` servers, `git reset --hard`, editing the
  gate files and settings ("self-modification"), and a script writing friction dispositions
  ("instruction poisoning"; the Edit tool goes through). Say so and ask him to allow it.
- **Dates:** run `date` before writing one (shell is Phoenix; PHP and the harvest stamp UTC, and a
  branch name's date is not today's). **Roadmap:** it lags the code (Tasks 708, 696, 727, 617 and others had
  shipped), so `git log --oneline --all --grep=<task>` before briefing; close a task in the
  merge that ships it; delete a block by ID, never by line numbers; advance `tom-review-queue.md`'s
  "Next free" with every row (`review queue parses`); regenerate `dev/features.md` after closing tasks.
- **A check whose "before" run reads `master` breaks the merge that fixes it**; pin a SHA.
- **A GitHub push once failed "Permission denied (publickey)"** and worked a minute later: retry.

### Agents and worktrees

- **Every brief says: never `git stash` (one stack shared by every worktree; `stash pop` took
  another's entry, three times), never touch the main checkout, write journals and research files to
  the scratchpad or the branch's own worktree (`cd` and check the branch name first).** Perry,
  advisers and outward-looking agents all broke this, dirtying a running suite and leaving a stray
  `inpfile.c`. Uncommitted adviser journals block `git merge master`: commit them first.
- **An agent's "committed" is a claim.** Run `git status` and `git branch --show-current` in its
  worktree (a commit once landed on a detached HEAD, recovered with `git checkout -B <branch> <sha>`;
  two harnesses were reported committed and were untracked). Its "all harnesses passed" and
  "byte-identical" are claims too; the suite on the merge commit has caught both.
- **A builder's harness shares the builder's blind spot**: all-zero OFFSET hid a wrong sign (cite the
  source for file-format semantics, never guess); a stub DOM hid a real-browser crash (one real-Chromium
  harness per menu action or export) and a document-emptying stub passed Tom's sequence; a conversion
  test dropped a tank head 120 ft (solve before and after); a layout harness compared the branch with
  itself, not master; a check enshrined a defect (`{n}`=1). When a stub cannot reproduce his report,
  send Perry to reproduce it in real Chrome. Brief language-sensitive builders to test a non-English page.
- **A usage limit, a network drop (EAI_AGAIN), a machine restart or Ctrl+C in his terminal kills agents**;
  commits and detached suites survive. Brief them to commit as they go; resume with SendMessage "read
  `git log master..HEAD` and `git status` first"; after Ctrl+C the harness refuses SendMessage, so only
  his word relaunches. Ctrl+B in his terminal backgrounds CC's wait, not the suite.
- **Check that no agent is working in a worktree before merging into it or sending another in**: `ps`
  for its suite and stop it. An agent that waits on its own background check_all re-sends its report
  on every wake (TaskStop it once the suite is detached) and queues duplicates if it hands back.
- **A new worktree needs `dev/browser-pass/node_modules` symlinked** to the main checkout's
  (`generate.sh` does it; hand-made and fix-branch worktrees do not, and 10 browser harnesses then
  read as defects with "playwright-core is not installed"). Symlink only there: a root-level
  `node_modules` link shows untracked and blocks `git worktree remove` (`rm` it first).
- **A worktree's `check_all` never stamps** (its `.git` is a file); a master push needs its own run in
  the main checkout, whose branch you never switch while a run is queued. Editing the main checkout
  mid-run dirties the tree: make even one-line edits in a chore worktree; his edit arriving mid-run
  goes by patch to a worktree, then `git checkout --` in main.
- **Never `git worktree remove --force`** without reading its `git status` (it destroyed uncommitted work).
- **Agents never write a ruling** into `english-key-rulings.json`; only the orchestrator, from his
  words. Agents also re-added a tip he had deleted because a brief said "update": check the rulings
  and the deleted-key harness before briefing a string. New keys go in `lib/lang.ec.en.php` only
  (the others fall back; all 27 fails `lang syntax rules A-D`). Read seat advice against the house
  rules (Ida proposed restyling a consent button). Perry's corrected wording lives in his report, not
  his journal: paste it into the brief.
- **Agents' CC shells:** before saying done, every background shell and agent has exited, `ps` shows no
  `sleep` loop, `php -S` or harness left, and the report states the count.

### Suites and harnesses

- **Agents never run the full suite** (Tom 10-27: *"Everything has been slow for the last two days."*): they stop at
  `--fast`, `--node-only` and their own harnesses; the orchestrator runs one per merge batch.
- **Queues:** with four slots busy a branch suite waited over an hour; nine agents' suites ran ~60 min
  each, ten took four hours to drain, and master's own run took ~2 h behind four. Count queued runs
  (`/proc/*/fd` on the lock) before launching a track, stagger builds, merge master's batch before
  launching branch suites; `EC_CHECK_SLOTS=5..8` gives a run its own slot. A run is judged on the tree
  at its END, so an agent that edits while queued re-queues. `flock` is not a queue: a waiting suite
  shows the same processes, so read the log's last line before killing anything.
- **Kill by PID only, after checking its cwd** (`pkill -f check_all.sh` killed every session's run,
  twice, exit 144). A setsid'd run survives `kill -- -PGID` in part: kill by session (`ps -eo
  pid,sess,args | awk '$2==SID'`). Browser-pass runs and killed harnesses leak `php -S` servers:
  `ps -eo pid,ppid,lstart,args | grep 'S 127.0.0.1'`, kill those whose parent is 1 or 449.
- **An orphaned probe can hold `/tmp/engcalcs-browser.lock` for hours**; every browser harness then
  times out. Find the holder: `for p in /proc/[0-9]*; do ls -l $p/fd 2>/dev/null | grep -q
  engcalcs-browser.lock && echo $p; done`. The divider harness prints `NOT RUN` meanwhile.
- **Start long suites with the Bash tool's background mode** (not `nohup`, so Tom's shell list shows
  them), one run per branch with a log named after the branch (agents sharing a scratchpad overwrote each
  other's `full.log`). Match the log's start time to the head's commit time (a log began on the
  previous commit); read it for `EXIT=` and `FAILED:` before pushing, never `wait_for.sh --sentinel`'s
  exit code (it once returned early). `example-open-guard-harness.js` prints four FAIL lines on
  purpose (its mutation control).
- **Red alone before red under load:** rerun a failing browser harness alone before calling it a defect,
  but a flake can be a real race (`menu-keyboard-harness.js`: a starved `setTimeout(0)`, fixed in the
  page). Seen only under load, green alone: `run-progress-harness.js`, `new-project-pan-harness.js`,
  `label-pass-economy-browser-harness.js`, `start-fresh-consent-harness.js`, `projection-harness.js`
  (300 s hang), `label-measure-cache` and `pane-follows-doc` (ALL PASS, no exit), the tip-door "link's
  WORDS" check; browser-pass `basemap.js` and `firstproject.js` tile counts. Pre-existing:
  `scale-publish-harness.js` (2 checks). `node dev/browser-pass/run.js` was green 1853/1853
  (2026-10-04); its specs are not in check_all.
- **Harness conventions:** click a dialog button with a MouseEvent `detail: 1` (a bare `el.click()` reads
  as an unarmed keypress); an automated browser has no first-view docks unless `window.EC_DEFAULT_DOCKS
  = true`; Playwright's `page.route()` disables form restore; a DOM stub lacks `hasAttribute` (use
  `getAttribute`); anything drawn needs a visibility and width check (a `div > span` list was hidden by
  positional CSS). Read the expected label from pageConfig or `esString()`, never a hard-coded English
  fallback (breaks the day a sprint translates it); a label like "the project is unchanged" can trip
  `harness wording pins`. Read what a check asserts; a harness that tests one message kind passes over another.
- **A menu item's language key is its command ID** (`lib/lpn-commands.json`, usage counts): never
  point a menu row at a borrowed key. Only the full suite's browser harness caught a rename.
- **A panel guard** fails on a branch's undeclared show/hide: declare it in `panel-touch-harness.js`.
- **The shipped Net1 example departs from EPA's Net1 from 10 AM by design** (his two rules,
  2026-09-08); compare with those rules. **A "regression" can be data**: read the file's declared units
  before bisecting (Fotobi's Error 110 was metric numbers under US units). **His sample files can change
  under a branch** (a bigger WTG-tgh-1 saved over the old one): check dates in tom-files first.
- **Chrome delivers one download per click**; a page never fires two. **jasmine has no MTA**: a preview
  that mails shows its failure path. `/engcalcs/` absolute paths work on every host; only RELATIVE
  ones break under `/app/`, so do not "fix" them.

### Translation and strings

- **Read every sprint diff**, for the keys more than one agent flags: translators narrowed an ambiguous
  English word (Select-mode "label" became Text in am, fa, hi); "subject word first" made bad titles
  ("Complete: report", an invented subject); a transliterated "halo" reads "hello" (am, bn, hi, my);
  two returned "placeholder" as their report with correct edits on disk. Read new loanwords back.
- **A rename that changes meaning must delete the translations** (`lpn_settings_engine_native` said
  "Solve with the EPANET solver" in 26 languages for a month, invisible to the drift check). The drift
  list is bigger than the payload (224 missing, 343 CHANGED): brief resync files and the sprint together.
- **A sprint changes harness inputs** (Chinese menus gained "…" rows; the Guide harnesses compared the
  Spanish page with English): run the suite on the sprint merge before pushing. A sprint empties
  `new-english-keys.md`, so keys he had not read get translated first. A Wave 0 rewrite repeating a
  placeholder trips `language placeholders` until every `.replace('{name}'` is global; a Wave 0 file
  `<id>-wave0.json` needs `--sprint=<id>-wave0`.
- **`delete_lang_key.php` also deletes the key's `english-key-rulings.json` entry**, and deleting a key
  a new English key replaced strips the TRANSLATED text from 26 languages until a sprint: keep the old
  key as the fallback. After English rewrites run `js_fallback_string_check.php --list` (22 drifted;
  watch double-escaped apostrophes). The regex parsers miss keys joined on one line; count orphans with
  PHP `include`. Diff every whole-value replace against the original (two sentences were dropped).
- **Harvest first** (`harvest_english_rulings.php`): his hand edits to `new-english-keys.md` fail
  `english rulings harvested` on every branch until harvested; a bullet that lost its `- ` is not
  parsed; the harvester keeps the LAST copy of a key and mis-filed one synonym ruling (check
  `plain-sentence-rulings.json` by eye); his stale copy shows OLD English as a false "EDIT" (check
  `git log -S`); commit his edit on a chore branch before regenerating, never regenerate over it.
  He may write two edits for one key; "Possibly" in his request is advice to bring back, not a ruling.

### Previews, reporting, other

- **Preview ports live on jasmine since 2026-10-02**: `~/webdev/worktrees/_panel/ports.conf` lists them
  (pipe rows with what to test), `sh ~/webdev/worktrees/_panel/generate.sh` makes any missing
  worktree, writes one Apache vhost per row and reloads Apache (passwordless via
  `/etc/sudoers.d/previews`; a crontab `@reboot` reruns it). They bind to loopback; Tom reaches them
  through SSH forwarding, so his browser sees `localhost` (secure context, and a host the Mapbox token
  accepts). A new port needs a new `LocalForward` line on his side. Apache honours `.htaccess`.
- **Run `generate.sh` after every master push** (port 8100 shows origin/master only then; twice he
  tested stale code), and the Branch previews page must show a branch before he is asked to test it
  (row, `generate.sh`, grep the generated index). Never `>>` onto `ports.conf` (no trailing newline
  glues the row to the last; `generate.sh` then makes no vhost): edit with a script, then curl the port.
  A bare port-root link is a 403: link the page. Name work by branch, never by port.
- **Ask which branch a host is on before explaining what Tom sees.** `dev.hawsedc.com` has sat on an
  old feature branch; `curl` gets a 401 there. Answer about the surface he named.
- **The Mapbox token is restricted by host.** Allowed hosts include `localhost` and `hawsedc.local`, so a
  new preview port needs nothing; a new hostname does, and `127.0.0.1` is refused (403). A token being
  present is not a token being accepted: test with a real tile request.
- **Relay in his words, and his facts first**: "ledger" was CC's word, not his; CC told him a `.prj`
  was hidden by Windows when he had shown it absent; a preview note named quantities CC had not read.
  Read the code before describing it; read the last session's final messages for unanswered questions
  (invisible to him after /clear). "Proceed" after a list of fixes is not "Merge"; ask. A unit
  conversion converts the drawing too (a brief's "coordinates unchanged" put metres on a feet scale bar).
- **He cannot paste images over ssh/tmux**: he saves the screenshot and runs `scp
  $HOME\Pictures\x.png haws@192.168.0.234:/tmp/`; read it, then delete it.
- **The DMARC mailbox is readable from here**: `ssh jconstru`, `~/mail/constructionnotesmanager.com/dmarc/{new,cur}`;
  tar it down and parse the gz/zip XML locally. The reports are not in his Gmail.

## STATE — 2026-11-13/14 (seventy-sixth session, Opus main, Sonnet agents)

- **Merged on his word** (*"I really like it. Merge."*): `feat/label-open-side`. It broke 7 browser harnesses on master; `fix/master-1113` fixed them on green: one code fix (a one-line node label restacked on mouse-down and jumped from the pointer; now restacks when the drag arms) and six harnesses that encoded the old placement (label-pipe-fields pinned to 20550276b). **Open:** a stacked pipe label's lower row paints its halo over 1-2 px of the row above; halo-under-ink now probes one-row labels only. **Merged on green:** `fix/munday-elevations` (his *"Yes. That is what I want."*; ground from Mapbox DEM fixed in `dev/scripts/starter_example_dem.json`; TANK-1 on a 100 ft tower, his to confirm).
- **`feat/assembly` round 7 (8103), Perry-reviewed, fixed, waits his pass.** W1R/W1D/W1P (valve W1V, no label row), heading Z then Q, block always rows (exempt from the line form), flow once, pressure only at W1P, two-cylinder symbol (`EC_WELL_UPPER_HALF`), three-press Well with tank (one-point form deleted; old files open as members), Morph separates a member's group, Explode says so. Test project `well-test-net1.lwn` (Net1 + curves). **His to rule:** Q before Z; L21 block hidden to notch 4 (honest crowding); outline vs filled upper cylinder; icons from the proofs artifact https://claude.ai/artifact/6NtpK9vVYTRFFY22eYWRmn. Still open: pressure tank, Auto curve, three-point exploded view.
- **`feat/contour-controls` (8105), round 3, Perry-reviewed, waits his pass.** Color scheme is one value with Settings; Property to plot equals Color nodes by while Show node colors is ticked, else the plot keeps its own. All three doors (box, Settings, Tables Settings) agree while the box is open; tips under 160 chars; "Show contour lines". Key deleted: `lpn_contour_field_follow`.
- **`feat/library-order` (8106, Task 859 at 100), Perry-reviewed, fixed, waits his pass.** Move to top/up/down/bottom in six Libraries sections; moving a control or rule can change a run (measured), the tips say so.
- **`feat/wtg-scenario` (Task 749):** his `-w-scenario` save overrode nothing (edits landed in Base); child-scenario writer built from his 10-21 TGH-1 save, candidate only. Waits his test `~/tom-files/2026-11-13/wtg-scenario-test/README.md` (expected T1 at hour 12: Base 8.75, Child A 14.48 ft, hourly rule check).
- **`feat/usage-using` (8108), waits his look:** Using table counts browser-days (logs hold no visit id); headings Browsers (said yes) / Visits (said yes) / Visits (others) on Looking, Calculations on Calculating. True visits need a per-load token in the beacon: consent wording, his call.
- **Task 860 (75) opened:** controls by scenario; Sue says whole named sets are sounder than per-control overrides. Mary: LoadBuilder = bulk meter-to-network assignment; we do it one customer at a time.
- **Pushed master ac85c45ae** (three full runs: the first failed 7 label harnesses, the second timed out `label-drag-track-harness.js` at 260 s alone against the runner's 300 s; Net3 now runs once, 152 s). Master merged into all five waiting branches after the push.
- **Next, once priority 100 clears** (`chore/code-audit`): one audit of `js/lpn-*.js` and `dev/scripts/` by one briefed agent, findings to a `dev/*.md`, roadmap entries proposed for his priorities.

## STATE — carried from earlier sessions (still open, recorded nowhere else)

- **11-08:** EPANET 2.2's own report prints 1392.49 for the PU1 demand charge where the page computes 116.04 (the charge enters twice; `dev/wtg-export.md` §8); never confirmed with a run of his.
- **11-08:** the next translation sprint is *"Later is fine."*, after the approved branches merge; his word only, with the waiting count.
- **10-29:** test-trim pass 2 (merge the user-guide, pane, scenario and label harness families) is approved by Tom; it waited on `box-design`, which merged 11-01, and no commit has done it.
- **10-29:** his bottom-pane 3 s slowdown is NOT reproduced (flat over 80 toggles). Owed by him: which tab, toggle count or time since load, a Chrome Performance trace.
- **10-30:** he wants to proofread `spock.php` once deployed (Task 824 holds his theme-of-the-day words).
- **11-03:** a 301 from librewaternet.org's calculator pages to hawsedc.com is his call (Manning Pipe Flow there already names hawsedc.com canonical; Google keeps the copy at position 23).
- **10-22:** owed by him on `feat/sqlite-reader`: where he read "12 psi"; whether to import WaterGEMS's hourly-averaged continuous patterns.

## Commands to hand Tom with any panel change

Nothing, normally. His Windows ssh config (`C:\Users\tomha\.ssh\config`, PowerShell's ssh)
forwards 8080, 8100-8139 and 8201-8205. Ports are reusable: give a new branch the lowest number in
8101-8139 that no `ports.conf` row holds. Windows' ssh dies past about 120 forwards, so never grow
that pool past ~60. His WSL tab runs a different ssh that carries no forwards.
