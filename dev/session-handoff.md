# Session handoff

Read this before the roadmap. RULINGS and TRAPS are standing; STATE is dated, so delete a STATE line
once it is no longer true. Anything already in `CLAUDE.md` is not repeated here. Replace stale
lines rather than appending corrections.

---

## Before merging anything

- **Protected branches alive, each awaiting Tom's browser pass** (`feature_freeze` is OFF; every one
  is listed in `dev/branch-policy.json`, which until 2026-09-30 named none of them): see STATE below.
  Plus `feat/label-placer` (the seam; round-5 bench), `feat/label-gang-search` (bench only), and
  builders `feat/label-placer-a`..`-d`, which never merge alone.
- **A branch that adds a key fails `payload freshness` and only that**, by design: agents never
  regenerate `dev/translation_payloads/`. Regenerate once on the merge commit, then run the suite.
- The all-clear's pin field in `dev/branch-all-clears.json` is **`head`**. Tom can test a preview
  mid-build, so pin to the final head and say so in `pin_note`.
- **Merge master into a branch before merging it to master**, then run the suite on the merge:
  2026-09-23 twice showed a clean merge breaking a harness (the lag harness and Net3's threshold).
- **Never wrap `run_harnesses.sh` or `check_all.sh` in the browser lock**: each browser harness
  takes that lock itself, so the wrapper deadlocks every one (2026-09-25, 280 s NOT RUN apiece).
  Brief agents to write journals to the scratchpad while a suite runs in the main checkout.
- Since 2026-10-02 (jasmine, 24 threads) `check_all.sh` runs four suites at once in slots, ~8 min
  each; run it with no outer flock. A branch cut before `f9829cee` still uses the single browser lock,
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

## TRAPS

- **The Mapbox token is restricted by host.** Allowed hosts include `localhost` and `hawsedc.local`,
  so a new preview port needs nothing; a new hostname does, and `127.0.0.1` is refused (403). A token being present is not a token
  being accepted — test with a real tile request.
- **A clean merge can still break the tree** (a rename on one side, an old call on the other). That
  is why the suite runs on the merge commit.
- **`check_all.sh` stamps only a clean tree**, and pre-push refuses an unstamped master commit.
  Commit, then run. Pre-commit refuses a non-merge commit on master.
- **Never `git worktree remove --force`** without reading its `git status` first; it once destroyed
  an agent's uncommitted work.
- **Check that no agent is already working in a worktree before sending another in.**
- **An orphaned probe can hold `/tmp/engcalcs-browser.lock` for hours**, and every browser harness in
  every suite then times out (2026-09-23: a pre-reviewer's hung phone test). Find the holder with
  `for p in /proc/[0-9]*; do ls -l $p/fd 2>/dev/null | grep -q engcalcs-browser.lock && echo $p; done`.
  The divider harness now prints `NOT RUN` when this happens instead of failing silently.
- **An agent's report of "committed" is a claim.** Run `git status` in its worktree before you
  merge; one branch's two harnesses were reported committed and were untracked.
- **A usage limit kills every running agent at once**; only their commits survive. Brief agents to
  commit as they go, and relaunch with "read `git log master..HEAD` first".
- **Preview ports live on jasmine since 2026-10-02**: `~/webdev/worktrees/_panel/ports.conf` lists
  them (pipe rows with what to test), `sh ~/webdev/worktrees/_panel/generate.sh` makes any missing
  worktree, writes one Apache vhost per row and reloads Apache (passwordless via
  `/etc/sudoers.d/previews`; a crontab `@reboot` reruns it). They bind to loopback; Tom reaches them through SSH forwarding, so his browser sees `localhost` (secure
  context, and a host the Mapbox token accepts). A new port needs a new `LocalForward` line on his
  side. Apache honours `.htaccess`; jasmine and production both run PHP 8.5 (2026-10-03).
- **Ask which branch a host is on before explaining what Tom sees.** `dev.hawsedc.com` has sat on
  an old feature branch; `curl` gets a 401 there. Answer about the surface he named.

---

- **A worktree's `check_all` never stamps**, because its `.git` is a file; a master push needs its
  own run in the main checkout. And never switch the main checkout's branch while its run is queued.
- **The roadmap lags the code.** 2026-09-26 two agents were briefed on Tasks 708 and 696 and found
  both already shipped. Run `git log --oneline --all --grep=<task>` before briefing one.
- **A check whose "before" run reads `master` breaks the merge that fixes it**; pin a SHA.

- **A stub harness can pass over the very defect it names.** 2026-09-23 the zoom-control harness
  emptied the document, so "Tom's exact sequence" passed while the real page went blank, and the
  build agent then told us Tom had tested an old build. When a stub cannot reproduce his report,
  send the pre-reviewer to reproduce it in real Chrome before believing either side.
- **Seven agents each queueing `check_all` serialise on one lock for hours**, and an agent that
  hands back while waiting queues duplicates. Count queued runs (`/proc/*/fd` on the lock) before
  launching another track.

- **`git stash` is ONE stack shared by every worktree.** 2026-09-24 one agent's `stash pop` took
  another worktree's entry. Never stash while agents are live; brief them so.
- **Ten check_all runs queued at once took four hours to drain** (2026-09-24, ~20 min each). A
  run's pass is judged on the tree at its END, so an agent that edits while queued re-queues.
  Stagger build tracks rather than launching seven together.
- **The browser-pass harness leaks its `php -S` server when killed**; 14 from 09-23 were still
  running on 09-24. `ps -eo pid,ppid,lstart,args | grep 'S 127.0.0.1'`, kill those whose parent is 1/449.
- **Flaky under load, green alone:** `run-progress-harness.js`; `dev/browser-pass/specs/basemap.js` and `firstproject.js`
  tile counts at a 900 ms settle (basemap.js now waits for a pointable tile). Pre-existing and unrelated: `scale-publish-harness.js` (2 checks). The full `node dev/browser-pass/run.js` is green (1853/1853, 2026-10-04, Task 761); browser-pass specs are not in
  check_all.

## STATE — 2026-10-08 (ninth session, Arizona time)

### Master = see `git log -1 master`, pushed. Production: last confirmed pull edc78d01 (2026-10-07); confirm with the About box

Merged this session: chore/wave0-apply-1008 (his Wave 0 answers; five $ec_lang_syn notes, two in his
words, three on his "Use proposed"), chore/sprint-1008 (26 languages, 224 new and 343 resynced keys; only
consent_body left CHANGED on purpose), fix/mnemonic-han-harness, fix/sw-precache-log (the service worker's
first install wrote ~23 page-load rows per visit; now one), chore/protect-1008. Deleted keys: none.

### Awaiting him

- **Merge words he must TYPE in the session** (the classifier refused CC writing an all-clear from his
  pasted 10-08 message, which said "feat/table-export: Merge." and "feat/dxf: Merge."). Pins when he types:
  table-export at its head after master is merged in; then master into dxf, then dxf. After dxf merges:
  customers to colour 7 on a fix branch (his F03), and record his lpn_dxf_note_blocks "Use as written"
  in english-key-rulings.json (not done on the branch, so his pin would not lapse).
- **Calls page** https://claude.ai/artifact/1eHT8AMCRcRhcbjtsKUzNd, same db collection `answers`; new ids
  G01-G10, `w2-<key>` (5 strings), `v2-<key>` (3 sprint questions). The F/v/w answers of 10-08 are applied.
- Browser pass, fix rounds done and Perry-checked where large: feat/message-dismiss (visible x),
  feat/workspace (import applies in place, no reload; Perry's placement defect fixed, 60879c22), feat/bentley-interop
  (auto-hide may cover the map, pinned keeps 320 px, every box), feat/user-guide (14.4 px like Settings,
  Ctrl+K raises, focus sentence), feat/hover-label (NEW, Task 773, port 8110), feat/visit-dedupe (F01 built:
  ec_code; Safari-safe; waits on G01-G05 and a consent_body translation round BEFORE merge), plus
  feat/section-grid and feat/desktop from before.
- **Seam when feat/workspace and feat/bentley-interop both merge:** `if (boxSaveHeld()) { return; }` at
  the top of `saveAltboxLayout`; add 'lpn_altbox' and 'lpn_hovercard' to the import-site names in
  storage_inventory_check.php if workspace export should carry them.
- **Sprint 1008 close-out:** three English questions open (v2- on the page); `friction_check.php
  --sprint=1008` exits 1 until answered and applied. Branch keys (six branches) join a later delta sprint,
  with consent_body and the two consent strings first.

### Next job

- Read the calls page; apply; merge what he clears (merge master in first, regenerate payloads on the
  merge, suite on the merge).
- G01 "Translate first": 26 Sonnet agents on feat/visit-dedupe for consent_body plus the two banner strings.
- Task 714 (theming) is the next 75 build if nothing of his is waiting.

### Traps met 2026-10-08 (ninth session)

- **A key renamed when its meaning flipped kept its old translations under a baselined hash**:
  lpn_settings_engine_native ("Use the built-in solver when possible") said "Solve with the EPANET solver"
  in all 26 languages since 09-06, invisible to the drift check. Found by the pt translator, fixed in the
  sprint. A rename that changes meaning must delete the translations, never carry them.
- **The drift list is much bigger than the payload**: 224 missing keys, but 343 CHANGED. Build a resync
  file per language from `detect_english_drift.php --json` and brief both jobs in one sprint.
- **A sprint changes harness inputs**: Chinese menus gained "…" rows and menu-mnemonic-harness's all-Han
  regex broke. Run the suite on the sprint merge before pushing.
- **Merging master into a branch conflicts in english_string_hashes.json** when both sides re-baselined:
  take master's, then redo the branch's own --update entries and drop hashes of keys the branch deleted.

### Traps met 2026-10-08 (eighth session)

- **Nine agents' suites at once ran ~60 min each** (slots full, the rest queued). Brief builders to run
  check_all once, at the end, and merge master's batch while slots are free.
- **Agents symlinked node_modules at the worktree ROOT** as well as dev/browser-pass/; the stray
  `node_modules` shows as untracked and blocks `git worktree remove`. `rm` the symlink first.
- **A Wave 0 file named `<id>-wave0.json` needs `--sprint=<id>-wave0`**; `--sprint=<id>` exits 2.
- **After feat/workspace merges, a browser with `navigator.webdriver` gets no default docks**; a harness
  that wants them sets `window.EC_DEFAULT_DOCKS = true` in an init script (dev/testing-notes.md).
- **Perry caught what the builder's English-only harness could not**: the Guide's showpiece query failed on
  every non-English page. Brief builders of anything language-sensitive to test one non-English page.

### Traps met 2026-10-07 (seventh session)

- **Six green branches merged in a row broke two harnesses together** (geojson moved Export EPANET file
  into a submenu; two other branches' harnesses still clicked the old row). Every branch suite queued
  after that failed the same two. Fix master first, in a fifth slot (`EC_CHECK_SLOTS=5`).
- **A rewritten string can trip `harness wording pins`** by coincidence: "the project is unchanged" was a
  check label in three harnesses. Reword the labels and lower the baseline.
- **Applying interview answers by whole-value replace dropped two sentences** the page had shown only in
  part (lpn_settings_runbox_tip). Diff every replaced value against the original before committing.
- **The rulings file is not sorted**; a `sorted()` rewrite churned 200 lines. Insert, never re-sort.
- **JS fallbacks drift with every English rewrite** (22 after technical English): fix with
  `js_fallback_string_check.php --list`, watch double-escaped apostrophes.

### Traps met 2026-10-06 (sixth session)

- **Perry's corrected wording lives in his REPORT, not his journal.** CC told a builder to read the
  journal; it found no wording and wrote its own, repeating one inaccuracy. Paste the text into the
  brief.
- **A merge of master into a branch emptied `dev/agents/pre-reviewer/journal.md`** (feat/screenshot,
  3892 lines to 0); Perry caught it. After any branch's merge, `git diff --stat master` the journals.
- **Six suites queued at once took over an hour each to start.** One agent used `EC_CHECK_SLOTS=5`
  to take a fifth slot; it worked. Stagger fix rounds.
- **`wait_for.sh --sentinel` returned before the log had EXIT=** once (the job was alive); read the
  log before pushing, never the waiter's exit code.
- **`delete_lang_key.php` left `count` stale** in english_string_hashes.json (fixed on
  `fix/delete-key-count`).
- **Perry earned his keep on every branch**: invisible attributes in six languages (DXF), a menu
  clipped by its box (screenshot), one Esc closing two boxes and 14 empty help entries (Guide), a
  zip entry with a slash (table export), a repeat-use ratio over 100% (dedupe), n moved by row
  number (paste). None was caught by the builder's own harness.

### Traps met 2026-10-07 (fifth session)

- **`json.dumps` with the wrong indent rewrote all of `branch-all-clears.json`** (1126 lines) and
  was merged locally before CC saw it; master was reset to the reflog SHA (unpushed). The file is
  `indent=1`; diff `--stat` before committing any rewritten JSON.
- **A harness wrapped in `flock /tmp/engcalcs-browser.lock` by hand timed out** while suites held it;
  harnesses take the lock themselves. Run them bare.
- **A stub DOM hid a real-browser crash** (`feat/dxf`: `children.forEach` on an SVG element). Any
  export or menu action needs one real-Chromium harness that clicks the real row.
- **The roadmap lagged again**: Task 617's first step (Basemap style) had shipped weeks earlier.

### Traps met 2026-10-06 (fourth session)

- **`>>` onto `ports.conf` glued a new row to the last one** (the file had no trailing newline), so
  `generate.sh` silently made no vhost and the port refused. Edit it with a script that keeps the
  newline, then curl the port.
- **CC's own brief contradicted one of his calls** (told an agent to drop report-line codes; he ruled
  2026-09-18 that a report line carries `Line N: sev: code: text`). The agent caught it. Grep his
  calls before dictating wording to a builder.
- **"Proceed" after a list of fixes is not "Merge."** The other branches got the merge word; read
  an ambiguous one as the conservative instruction and ask.
- **jasmine has no MTA** (`sendmail` missing): any preview that mails shows its failure path.
- **Chrome delivers one download per click by default**; a page must never fire two.

### Traps met 2026-10-06 (third session)

- **"Possibly" in his request is not a ruling.** He asked for tip paragraphs "possibly with poor-boy
  headings"; the build shipped ALL-CAPS headings and he said *"I am not ruling on ALL CAPS tips
  headings. I am asking for advice."* Build the certain part; bring the "possibly" back as advice.
- **`delete_lang_key.php` also deletes the key's entry in `english-key-rulings.json`**, and deleting a
  key that a new English key replaced strips the TRANSLATED text from 26 languages until a sprint.
  Perry caught it on feat/feedback; keep the old key as the fallback.
- **A GitHub push failed once with "Permission denied (publickey)"** and the same push worked a
  minute later. Retry before diagnosing.
- **A builder's harness tested the conversion, not the hydraulics**: tank -> reservoir passed every
  kept/lost check while dropping the head 120 ft. Brief builders of model edits to solve before/after.

### Traps met 2026-10-06 (second session)

- **A harness written by the builder shared the builder's blind spot**: backdrop-attach's 14 checks
  all used OFFSET 0 and a same-shape picture, so the wrong OFFSET sign and fit rule passed. Perry
  found both from EPANET's Delphi source. Brief builders to cite the source for any file-format
  semantics, never guess a sign.
- **Uncommitted adviser journals in a worktree block `git merge master`** when master touches the
  same journal. Commit advisers' files before a build agent merges.
- **A master defect found on a feature branch** (geo DIMENSIONS): split the hunk onto a fix
  branch from master with its own harness, rather than waiting on his all-clear.

### Traps met 2026-10-05

- **The DMARC mailbox is readable from here**: `ssh jconstru`, `~/mail/constructionnotesmanager.com/dmarc/{new,cur}`;
  tar it down and parse the gz/zip XML locally. The reports are not in his Gmail.
- **The harvester mis-filed one synonym ruling** (consent_body): it stored his edited synonym as the
  English. Check `syn-rulings.json` by eye after any harvest with an edited synonym.
- **He wrote two different edits of one key** (lpn_ds_search_note) in two sections of the file; the
  questions-section edit was applied. Expect it when a key is both new and questioned.

- **The roadmap lagged FOUR more times in one session** (764, 726/608, 695, plus 710/719/755/762
  never closed on merge). Close a task in the merge that ships it.
- **Perry wrote his journal into the MAIN checkout** while reviewing a worktree, mid master suite.
  Brief reviewers: `cd` to the worktree and check the branch name before any write.
- **The shipped Net1 example departs from EPA's Net1 from 10 AM by design** (his two rules,
  2026-09-08). Compare it against Net1.inp WITH those rules; a bare comparison looks like a defect.

### How he wants to be asked (2026-10-04)

- **Name work by branch, never by port.** A port only in brackets.
- **The Branch previews page must show a branch before he is asked to test it**: ports.conf row,
  `generate.sh`, then grep the generated index for the branch. His tunnel does not carry 8106/8107.

### Traps met 2026-10-04

- **The classifier refused all-clears from his pasted message and reading the wish lists.** He
  typed the merge words instead, and added an `autoMode.environment` note to ~/.claude/settings.json
  that pasted messages are his own; untested until a new session.
- **A dialog button pressed with a bare `el.click()` is ignored** since dialog-audit (`detail: 0`
  reads as an unarmed keyboard press). Harnesses must dispatch a MouseEvent with `detail: 1`.
- **A `cmd && git branch -d ... && suite &` line backgrounds the whole chain**, so when one step
  fails, the suite silently never starts while "started" still prints. Start a suite in its own call.
- **An agent reported a check_all log that started on its PREVIOUS commit**; its fix landed mid-run.
  Match the log's start time to the head's commit time before believing it.
- **`projection-harness.js` can hang 300 s under load** (event loop held open) and pass in 0.3 s
  alone.

- **His edit of `dev/new-english-keys.md` was made on a copy older than the last regeneration**
  (header counts 92 vs 67): the harvest still worked because it reads marks by key. Commit his edit
  on a chore branch first, harvest, then regenerate; never regenerate over it.
- **A harness that prints ALL PASS can still fail by not exiting** within 300 s under load
  (label-measure-cache, pane-follows-doc). Read the log before calling it a defect; rerun.
- **Agents' generated-file conflicts** (`new-english-keys.md`, `english-key-rulings.json`) on every
  merge: take master's side, union the rulings JSON, regenerate on a chore branch.
- **A stale copy's marks make the harvest print false "EDIT" lines**: his old copy shows the OLD
  English, so the harvester reports it as his rewrite. Before applying an EDIT, check the "now" text
  is not simply an earlier version in `git log -S`.
- **The roadmap lagged again**: Task 727 had shipped nine days earlier. `git log --all --grep` and a
  grep of the code before briefing, every time.
- **Killing a setsid'd check_all with `kill -- -PGID` left run_harnesses.sh and a harness alive**
  (they sit in the session, not the group). Kill by session: `ps -eo pid,sess,args | awk '$2==SID'`.
- **A worktree that never had `dev/browser-pass/node_modules` symlinked prints "playwright-core is
  not installed"**: symlink it when making any worktree, fix branches too.
- **An agent wrote Tom's approval into `english-key-rulings.json`** for a label it had interpreted
  ("Above"); it happened to be his literal word. Brief agents: never write a ruling, only the
  orchestrator does, from his words.
- **`lang_key_order_normalizer.php` with no flags rewrites all 27 language files**; an agent ran it
  by accident. Revert with `git checkout -- lib/`.
- **Two merges that each pass can fail together**: setting-scope's nowrap marker broke the Task 760
  phone harness only once both were on master. The suite on the merge commit is what caught it.
- **The pre-reviewer earns his keep on large mechanical conversions**: the dialog conversion was
  reported finished and green; Perry found held Enter deleting a network and 18 alerts quietly
  downgraded to fading strips.

### Traps met 2026-10-03

- **Port 8100 shows origin/master only after `sh ~/webdev/worktrees/_panel/generate.sh`.** Run it
  after every master push; once it was skipped and he saw no fix that was already pushed.
- **He cannot paste images over ssh/tmux.** He saves the screenshot and runs
  `scp $HOME\Pictures\x.png haws@192.168.0.234:/tmp/`; read it, then delete it.

- **A harness that flakes only under load can be a real race.** `menu-keyboard-harness.js` failed
  3 times in check_all: a starved `setTimeout(0)` focus restore from one menu ran after the next
  menu opened. Fixed in the page (`menuRestoreSeq`); proved with 24 busy loops, 8/10 to 12/12.

- **A `cmd && merge && ...; setsid check_all &` line starts the suite even when the merge
  conflicts** (the `;` runs on). Start a suite only in its own command, after `git status` is clean.
- **Ctrl+B in his terminal backgrounds CC's running wait**, not the suite. He meant tmux detach.

### Traps met 2026-10-02

- **Ctrl+C in his terminal stops every background agent**, and the harness then refuses SendMessage
  to them. Only his word relaunches them; fresh agents resumed from each branch's commits fine.
- **A merge of master into a branch can fail the new panel guard** on that branch's own undeclared
  show/hide (property-graph's `propGraphSync`): declare it in `panel-touch-harness.js`, do not hide it.
- **Running `new_english_keys.php --write` while a merge is unresolved exits 2 and writes nothing**;
  resolve, commit, then regenerate and commit again.

### Traps met 2026-10-01

- **Two runs per branch queue up when an agent hands back while its run waits, and the classifier
  refuses CC killing a queued waiter.** Brief agents to detach ONE run with a unique log name.
- **`start-fresh-consent-harness.js` flakes under load** ("the banner is showing again"); 11/11 alone.
- **Closing roadmap tasks makes `dev/features.md` stale**: regenerate with `generate_features.php`.

### Traps met 2026-09-30 (night)

- **The machine restarted mid-session** (kernel changed; scratchpad wiped; a master run lost). Every
  agent had committed, so nothing was lost; branches are now also pushed to GitHub as backup.
- **CC force-regenerated `dev/new-english-keys.md` in the main checkout without first checking it for
  his uncommitted edits.** He may have lost an edit. Before ANY `--force`: `git status` and `git diff`
  on that file in that checkout, and harvest first.
- **A long check_all queue gets a background command killed at its time limit.** Start master's run
  detached (`setsid nohup sh -c '...; echo EXIT=$? >> LOG'`) and wait with `dev/scripts/wait_for.sh`.

### Traps met 2026-09-30 (evening)

- **`flock` is not a queue.** With seven suites waiting, master's run waited over two hours while branch
  runs kept winning the lock. Merge master's batch early, before launching branch builds.
- **An agent ran `git stash`/`pop` again** (graph-tab-keys) and applied another branch's stash; it reset
  its own tree and the stash list survived. The rule is in every brief and still broke.
- **A forced `new_english_keys.php --write --force` is safe only when the file equals master's generated
  copy** (`git diff master -- dev/new-english-keys.md` empty). Check that first, every time.

### Traps met 2026-09-30

- **The auto-mode classifier refuses CC writing an all-clear taken from a pasted message.** Ask him to
  type the merge word in the session itself.
- **The label bench's parallel scorers (3 x node at 3 GB) saturate 4 cores and once filled the 6 GB
  RAM-backed /tmp**; every check_all then took 1-3 hours. Brief the label agent to run on disk
  (`/home/haws/label-trials-work`, 1.1 GB, reproducible) and with one worker while suites queue.
- **His hand edits to `dev/new-english-keys.md` reach master uncommitted-then-committed and fail
  "english rulings harvested" on every branch** until harvested: harvest first thing, and fix a bullet
  that lost its `- ` so the parser reads it.
- **A branch's check_all can go green but for a failure master has already fixed** (the Shift-hint JS
  fallback): read the failure before re-running.

### Traps met 2026-09-29

- **Worktrees had no `dev/browser-pass/node_modules`**, so 10 browser harnesses failed "playwright-core
  is not installed" and read like defects. Symlink the main checkout's into each new worktree.
- **Perry ran `git stash pop`** despite the rule and pulled another session's stash into a worktree;
  a translator edited the main checkout by mistake and reverted it. Put "never stash, never touch the
  main checkout" in EVERY brief, reviewers included.
- **`/engcalcs/` absolute paths work on every host**; only RELATIVE ones break under `/app/`. Do
  not "fix" an absolute `/engcalcs/` path for librewaternet.org.

### Traps met 2026-09-28/29

- **A broad `pkill -f check_all.sh` kills every session's run** (an agent did it; master's run died
  with 144). Brief agents: kill only by PID, and only their own.
- **Network drops (EAI_AGAIN) kill agents mid-work**; resume with SendMessage, "git status first".
- **The four gallery FAIL lines in example-open-guard-harness are its own mutation tests**; the
  verdict is the exit code. Read `FAILED:` lines, not raw FAIL lines.
- **Agents writing journals into the main checkout dirty a running suite.** Brief them to the
  scratchpad while a suite runs there.
- **The master pre-commit refuses `--amend` too**: regenerate payloads on a chore branch and merge.

## Commands to hand Tom with any panel change

Nothing, normally. His Windows ssh config (`C:\Users\tomha\.ssh\config`, PowerShell's ssh)
forwards 8080, 8100-8139 and 8201-8205. Ports are reusable: give a new branch the lowest number in
8101-8139 that no `ports.conf` row holds. Windows' ssh dies past about 120 forwards, so never grow
that pool past ~60. His WSL tab runs a different ssh that carries no forwards.
