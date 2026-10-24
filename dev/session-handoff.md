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

## STATE — 2026-10-24 (thirty-eighth session)

- **Merged 2026-10-23 on his word, pushed e583a7cc6:** `feat/import-new-scenario` (Task 814) and `feat/theme-whimsy` (Task 811, now closed). `fix/settings-spinners` merged on green with this handoff (no spinner arrows anywhere; a wheel over a focused number box scrolls instead of stepping; the cause was that a spinner step fires `input` but the Settings boxes apply on `change`).
- **His interview answers are in `dev/assemblies.md`** (Task 822, still negotiating; his questions are answered in messenger.md). Expert levels: *"Day 1 must be pure joy and fun"*; he wants a coach-marks mockup. WaterGEMS menu name: "Export > .wtg.sqlite file…". **Nag him to write to Bentley** before any public release of the export (his ask).
- **Waiting on his browser pass:** `feat/value-source` (8105, ffa674794: same-name alternative now silent; Settings item reads "Show: clear restores No, the value in Base."; green but payload freshness); `feat/scenario-io` (8101, f9413e8fb, Task 814: scenario in Tables-export, print and screenshot names, DEM and shapes notices say where they write; Perry passed; four questions for him in messenger.md).
- **`feat/wtg-page-export`** (no port yet): File > Export > .wtg.sqlite file from the page, built on `feat/wtg-export`; never merges before his word and his letter to Bentley. Its suite was unfinished at /clear: read `git log` in its worktree and the log `feat-wtg-page-export-full*.log` in this session's scratch.
- Task 812 Step 2 (`fix/label-last-pad`) measured and rejected; what is left is design work, not a port.
- Tasks 733 slice 7, 737 sprint, 681 wait on his word.
- **Trap met:** a harness DOM stub lacks `hasAttribute`; page code using it threw in 150 harnesses. Use `getAttribute`.
- **Trap met:** a Settings list built as `div > span` was hidden by the box's positional CSS; a harness for anything drawn checks visibility and width.
- **Trap met:** a usage limit kills every agent; detached suites and commits survive. Resume with SendMessage, not a new agent.
- SCRATCH for this session: /tmp/claude-1000/-home-haws-webdev-hawsedc-com-engcalcs/1a7bdf36-0009-45e7-8601-e5252dbb9d6a/scratchpad

## STATE — 2026-10-22 evening (thirty-sixth session, Arizona time)

- Production is what he last pulled; epanet-plus-plus.org/app was at c375f221 on 2026-10-21. **Canonical landing page is epanet-plus-plus.org.** Merged 2026-10-22 on his word: theme-default, native-eps-6 (4, 5, 6), export-scenario-confirm, clear-same-overrides (pushed 1c75721e0); then fix/energy-count (Task 821, his call "Count as EPANET does").
- **Report to Tom in `~/tom-files/messenger.md`**, overwritten each time; one line per paragraph, no hard wraps (Tom, 2026-10-21). He empties it between sessions. The 2026-10-22 report there holds his open questions: read it before reporting.
- Still owed: consent_body's 26 translations; the untranslated keys. Sprint only on his word.
- His "Ask your AI agent" idea (Task 818): on hold. Tom, 2026-10-22: *"It may be premature to do much about this, but maybe Mary can guide us. I need to focus on wtg export."* Mary's answer so far: `dev/agents/market-researcher/ai-agent-interface.md`.
- WaterGEMS export (`feat/wtg-export`, his focus): his 10-22 test of the first files: tiny, Net3 at hour zero and full Net3 all open and give the same results, no messages; only the symbols came in very tiny. Fixed (symbol and text size from the map extent); valves, volume curves, pump speed and head patterns added. New files `~/tom-files/2026-10-22/wtg-export-2/` (readme inside). Three one-thing asks of him (tank-level control, emitter, five-point pump curve), click steps in `git show feat/wtg-export:dev/wtg-export.md`; the control one also settles whether our clock controls fire.
- Load flakes seen 2026-10-22 in master's suite: `new-project-pan-harness.js` (passed alone twice), `label-form-n600-browser-harness` (an agent's run).

### Branches waiting on him (ports in ~/webdev/worktrees/_panel/ports.conf)

- `feat/wtg-export` (no port; a spike, dev scripts only): see above.
- `feat/sqlite-reader` (8104, Task 749): he doubts import is feasible (10-22); kept as what we learned. Owed by him from before: where he read "12 psi"; whether to import WaterGEMS's hourly-averaged continuous patterns.
- `feat/desktop`, `fix/bottom-pane-lag`: untouched.

### Traps met 2026-10-21 (thirty-third session)

- **Agents sharing one scratchpad overwrote each other's `full.log`.** Brief each agent to name its
  logs after its branch.
- **Tom's sample files can change under a branch**: he saved a bigger WTG-tgh-1 over the old one, and
  the branch's harness failed on a fixture nobody had touched in git. Check file dates in tom-files first.
- **`new_english_keys.php --write` refuses after a conflicted merge** even when the file equals
  master's; check `git diff master -- dev/new-english-keys.md` is empty before `--force`.

### Traps met 2026-10-20 (thirty-first session)

- **A merge into a worktree with Tom's uncommitted file in it refuses silently** when piped to
  `tail`. Merge first, copy his edited file in after.
- **An outward-looking agent wrote its journal in the main checkout** while nothing was running;
  brief every agent to write journals to the scratchpad, always.
- **A menu item's language key is its command ID** (`lib/lpn-commands.json`, usage counts). Reusing
  another key for a menu row renamed the command; `lpn_file_export_item_msx` was restored for that.
  Never point a menu row at a borrowed key. Only the full suite's browser harness caught it.
- **`git -c user.name=$VAR` with spaces in the variable breaks**; set `GIT_AUTHOR_NAME` /
  `GIT_COMMITTER_NAME` in the environment instead.

### Traps met 2026-10-20 (thirtieth session)

- **The review queue declares its next free R-number.** Adding R-418..420 without advancing it failed
  `review queue parses` and a full run was wasted. Advance the "Next free" line with every new row.
- **`git merge --ff-only` of a chore branch put a plain commit on master** (hooks never fire on a
  fast-forward). Always `--no-ff` into master.
- **A new worktree has no `dev/browser-pass/node_modules`**: every browser harness then fails with
  "Cannot find module playwright-core". Symlink it to the main checkout's when making a worktree.
- **Four branch suites at once plus a Perry browser run** failed contour, label-drag-track,
  setting-scope and settings-select-lag; all passed alone.

### Traps met 2026-10-20 (twenty-ninth session)

- **Editing the main checkout while its suite runs** dirties the tree and the run cannot stamp. Make
  even one-line roadmap edits in a chore worktree.
- **A subagent's harness compared the branch with its own layout, not master**, so it passed while
  Net3 labels lost fields. Perry caught it in Chromium; label harnesses now compare with master.
- **Deleting a roadmap block by line count removed a neighbour heading** (roadmap 146.09). Delete a
  block by its ID, never by line numbers read before an earlier edit.

### Traps met 2026-10-19 evening (twenty-eighth session)

- **A Python one-liner truncated Sue's journal**: `open(p,'w').write(x+open(p).read())` opens for
  writing (truncating) before the read. Caught by the diff stat (3,016 deletions), restored. Read first.
- **A subagent that waits on its own background check_all re-sends its report on every wake.** Stop it
  with TaskStop once its suite is detached (setsid) and watch the log yourself.
- **An agent's "byte-identical before and after" was wrong**: help-menu, tool-keys and all-calcs-smoke
  caught the in-app Guide refactor. Run the suite before believing a refactor claim.
- **new-project-pan-harness.js failed once under load**, passed alone.

### Traps met 2026-10-19 (twenty-seventh session)

- **`example-open-guard-harness.js` prints four FAIL lines on purpose** (its mutation control) and passes.
  Grep for `FAILED:`, not `FAIL`, in a harness log.
- **`label-pass-economy-browser-harness.js` and `settings-select-lag-harness.js` fail under load only**
  (a label hit box differing at the 8th decimal; lag timing). Both passed alone.

### Traps met 2026-10-18 (twenty-sixth session)

- **My briefs told agents to add new keys to all 27 files**; the rule is English only (the others fall
  back). It failed `lang syntax rules A-D` (identical-to-english). Brief: new keys in lib/lang.ec.en.php only.
- **A merge run without GIT_AUTHOR_NAME took Tom as author.** Export the author env in the SAME command as
  every merge; redo the batch from origin/master if it slips (unpushed, so cheap).
- **His edit of new-english-keys.md arrived mid-suite in the main checkout**: moved by patch to a chore
  worktree, then `git checkout --` in main before the suite ended, so the stamp still landed.
- **Ida proposed restyling one consent button to stand out**; CLAUDE.md forbids it. Read seat advice against
  the house rules before forwarding it.
- **scenario-settings-routing-harness failed in five branch suites**: stray page debounces between cases
  (fixed in the harness, fix/routing-harness-flake). Other multi-case harnesses may share the exposure.
- **The previous session's open questions were invisible to him after /clear.** Read the last session's
  final messages for unanswered questions before reporting.

### Traps met 2026-10-17 (twenty-fifth session)

- **The classifier refused the sprint's master merge** though his message authorized the sprint. Ask
  for "Merge chore/sprint-1017" typed, at the top of the report.
- **A script writing friction dispositions was refused as "instruction poisoning"**; the same edits by
  the Edit tool went through. Write dispositions with Edit.
- **Translators told "subject word first" made bad titles**: "Complete: report" for Full report (ar,
  fa, km), an invented subject ("Network: full report", pt, fr, it), and my changed placeholder colons
  to dodge the identical check. Read every box-title change in the sprint diff.
- **A Wave 0 rewrite that repeats a placeholder** ({name} twice) trips `language placeholders` until
  every `.replace('{name}'` is global.
- **The Guide harnesses compared the Spanish page with the English** and broke when the sprint
  translated it. They now use `esString()` from `user-guide-chapter-lib.js`.
- **The regex parsers miss keys joined onto one physical line**; QA found five dead ones in 26 files.
  PHP `include` sees them: count orphans with it, not with `^`-anchored greps.

### Traps met 2026-10-16 (twenty-fourth session)

- **The harvester keeps the LAST copy of a key**, so a key listed under several branches lost his marks
  (174 of them) to an unmarked duplicate. Fixed at the source: a branch already merged into another
  listed branch is named in one line. If a key ever appears twice again, harvest from a copy with the
  duplicate sections stripped.
- **"Regression" reports can be data.** Fotobi's Error 110 was metric numbers under declared US units;
  bisecting found no code change. Read the file's declared units before bisecting.
- **Harvest stamps UTC dates** (2026-10-17 at 19:45 MST). sed the day back before committing.
- **Two harnesses fail only under load** (setting-scope "stored as both", table-divider-align): both
  were harness timing, fixed 10-16. Run a red browser harness alone before calling it a defect.
- **A bare preview link to a port's root is a 403**: link the page, or point him at the Branch
  previews page row.

### Traps met 2026-10-16 (twenty-third session)

- **Two small branches green alone broke three harnesses together** (description-lines + retire-mark-extrema:
  halo-under-ink pinned the extrema code, Tab order, setting-scope inventory). The suite on the merge caught it.
- **His uncommitted edit arrived mid-suite** in the main checkout, and another session merged into master
  in the same checkout during a run. Commit his edits in a worktree copy; tell peer sessions before a run.
- **A sub-branch builder's "fails on base too" is worth collecting**: three of them independently found
  bentley-interop's own head red, which nobody had run since 9b9f74f3.
- **The classifier refused killing leaked `php -S` servers** (parent 1, days old). Ask him to allow it.

### Traps met 2026-10-15 (twenty-first session)

- **"Ledger" was CC's word; he did not know it.** Relay in his words.
- **He retired the all-clear file, both freezes, the deploy-blocker list and the pre-merge hook**
  (10-15/16): they duplicated the classifier and choked merges. Do not rebuild them.

- **A pipe hides a refusal.** `new_english_keys.php --write | tail` exits 0 when the generator REFUSED,
  and the next `git add` committed a conflicted file. Never pipe a guard into tail inside an && chain.
- **json.dumps on a hand-indented JSON reformats all of it.** Check `git diff --stat` before committing;
  english-key-rulings.json and glossary.json round-trip only with indent=4, ensure_ascii False.
- **The sprint brief's grep loop was mis-escaped** (`\$` in double quotes); agents fell back to python.
- **A transliterated "halo" reads "hello"** in am, bn, hi, my. Read new loanwords back.
- **The tip-door harness's "link's WORDS" check failed once under load** and passed 75/75 twice alone.
- **CC dated the whole day 2026-10-16 from the session's date and PHP's UTC clock**; Arizona was still the
  15th. Run `date` before writing any date; PHP scripts stamp UTC (english_string_hashes "updated").
- **The classifier refuses CC editing the gate files and settings** ("self-modification"), even on his
  typed word; it allowed committing his own edit of them under his name but not merging that to master.

### Traps met 2026-10-15 (twentieth session)

- **CC dated a whole batch 2026-10-15** (roadmap, glossary, handoff) from the date in a branch name. Use
  `date` in Arizona; the shell is on Phoenix time.
- **A plural mechanism was built before he could say no**: he prefers "overrides (1)". Then the rewording
  agent changed 23 strings he had approved; check `english-key-rulings.json` before rewording English.
- **A translator narrows an ambiguous English word** (am, fa, hi turned the Select-mode "label" into Text).
  Read each sprint diff for the keys more than one agent flags.

### Traps met 2026-10-14 (eighteenth session)

- **CC killed master's RUNNING suite thinking it was queued.** `flock` is not a queue: a waiting suite
  shows the same processes. Read the log's last line before killing anything.
- **Slot starvation**: with all four slots busy, a branch suite waited over an hour. EC_CHECK_SLOTS=6..8
  gives a run its own slot; leaked `php -S` servers from a killed run must be killed by PID.
- **A stray EPANET source file (inpfile.c) appeared in the main checkout** from an agent's research.
  Brief research agents to use the scratchpad.

### Traps met 2026-10-14 (seventeenth session)

- **Wave 0 undid his word calls** (Check for a checkbox, click for a button; Task 759). Brief Wave 0 with them.
- **A pre-reviewer wrote its journal into the main checkout** while master's suite ran there. Tell Perry
  which worktree to write in.
- **The classifier refused killing a superseded suite run.** Let it finish; do not edit its tree meanwhile.
- **A master merge broke a branch harness through layout**: three new pane tabs wrapped the tab strip, which
  exposed a missing refresh on workspace import. Run the branch suite after every master merge into it.

### Traps met 2026-10-13 (sixteenth session)

- **A merge commit run in a worktree took Tom as author.** Use GIT_AUTHOR_NAME/EMAIL or amend before push.
- **A harness enshrined a defect** ("Its 1 overrides" checked as `{n}`=1). Read what a check asserts.
- **A preview note CC wrote named quantities CC had not read.** Read the code before describing it.
- **CC told him a .prj was hidden by Windows.** He had shown it was absent; take his facts first.

### Traps met 2026-10-12 (fourteenth session)

- **The classifier refused the master merge of three green branches**, with no pasted approval involved.
  Merging to master needs his typed word every session; ask at the top of the report.
- **CC's own brief was wrong** (SI twins: "coordinates unchanged"): the scale bar read metres on a feet
  drawing. A unit conversion converts the drawing too.
- **Two translators returned "placeholder" as their report** with correct edits on disk. Read the diff.
- **One agent's `pkill -f check_all.sh` killed every suite on the machine** (master twice, five agents). The
  wait-loop guard now refuses a pkill/killall by a shared name; kill by PID after checking its cwd.
- **A background Bash job of CC's died when a plugin was installed mid-run.** Start long suites with
  `setsid nohup sh -c '... ; echo exit=$? >> log'` and wait with wait_for.sh --sentinel.
- **Harnesses that hard-code an English fallback break the day the sprint translates the key** (three did).
  Read the expected label from pageConfig or the language file.
- **A sprint empties new-english-keys.md**: keys Tom had not read were translated before he read them.
- **An agent re-added a tip Tom had deleted** because CC's brief asked to "update" it. Check
  english-key-rulings and the deleted-key harness before briefing a string.

### Traps met 2026-10-11 (thirteenth session)

- **The classifier refused an all-clear from his PASTED message again**, though his global CLAUDE.md says
  pasted is his. He typed "Merge feat/user-guide" and it went through. Ask for the typed word at once.
- **Two branches green alone broke one harness together** (user-guide's Find word list vs tank-volume's new
  Find fields). The suite on the merge commit caught it; fix on a fix branch, merge, rerun.
- **An agent's background check_all outlived its report**; CC's merge into that worktree then ran under
  it. Before merging into an agent's worktree, `ps` for its suite and stop it.
- **A merge left orphaned conflict markers in an agent journal** (`<<<<<<< HEAD` / `>>>>>>> theirs`
  with no separator). grep journals for markers after any merge.
- **Slots congest**: with four branch suites queued, master's run took ~2 h. Merge master's batches before
  launching branch suites.

### Traps met 2026-10-10 (twelfth session)

- **A feature merged to master can break a branch's seam check**: split pipe walked `sc.overrides`, fine on
  master, a defect on bentley-interop where values also live in alternatives. Run the branch suite after
  every master merge into it.
- **A harness that tests one message kind passes over another**: hide-on-reload passed for diagnostics while
  Tom hid a run message. Ask which message, or test every kind.

### Traps met 2026-10-09 (eleventh session)

- **Merging two branches that each regenerated payloads conflicts in all 27 payloads and new-english-keys.md**:
  take either side, then `new_english_keys.php --write --force` (both sides were generated, so --force loses
  nothing) and regenerate payloads, all in the merge commit.

### Traps met 2026-10-08 (tenth session)

- **A builder reported "all lpn harnesses passed" and six failed on master** after its merge (the N/L
  example prefixes; harnesses expected bare IDs). Run the suite on the merge commit before pushing, always.
- **`git commit --amend` on a merge commit is refused on master** (pre-commit sees a non-merge commit).
  Put a forgotten generated file on a fix branch and merge it.
- **`new_english_keys.php` without `--write` only prints**; check_all then fails "new english keys listed".

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
  English. Check `plain-sentence-rulings.json` by eye after any harvest with an edited plain sentence.
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
