# Task 195/220 test punch list — project files and locking (`lpn_`)

> **§0–§8 REWRITTEN 2026-08-05 against the post-211 UI** (projects as tabs, an ordinary File menu,
> **no autosave**, opt-in read-only, no Delete, **no AUTOMATIC take-over** — see the correction
> below).
>
> **CORRECTION, 2026-08-09 (Tom).** "No Take over" is written all through this file and it is now
> misleading. What Task 211 withdrew was the **automatic** promotion: a poll that could silently
> turn B's read-only tab into an editable one after A went idle. That is gone and stays gone —
> nothing promotes a tab by itself, ever. But **B can take over, deliberately**, via *Break their
> lock*, and doing so does leave A unable to save. Tom, 2026-08-09: *"Because of the advancements
> we have made in file management, I am now softened on my position about 'Take over'. We literally
> do now allow B to take over, leaving A unable to save. But we are managing it well."* Read every
> "no Take over" below as **"no automatic take-over"**; the explicit, user-initiated one is a
> feature, is announced, and is guarded by the three-choice dialog. The previous versions of these
> sections described controls that no longer exist; Tom's annotations on them are the record of
> *why* Task 211 happened and are preserved verbatim in the appendix at the bottom.
>
> **§8 REWRITTEN AGAIN 2026-08-05** once Task 212 landed: a reload no longer disconnects, so the
> section that told you to expect a disconnection banner was testing the wrong behaviour.
>
> **§9–§13 are unchanged** and were already right.
>
> Three defects from the 2026-08-04 pass were fixed on production ahead of the rebuild (commit
> `6274a69`): the `docId` was minted after the first file write instead of before — which is also
> why the old §6 saw no lock contention at all — Clear/Wipe did not forget the initials, and Take
> over wrote a stale copy over a colleague's newer file and **has been withdrawn entirely**.

Everything in Task 195 was verified only by harnesses against sliced-out logic; **no part of the UI
has ever been seen rendered.** This list exists because that is the whole risk.

> **AUTOMATED 2026-08-06 — run `node dev/browser-pass/run.js` BEFORE reading any further.**
> 138 checks over two real browser profiles against the real lock broker, in about a minute.
> It covers most of §2–§8 and §12 mechanically. **What is left for a human is short and is listed in
> `dev/browser-pass/README.md`**: §1's native picker handshake, a permission that is genuinely
> `prompt`/`denied`, §10 (a real folder, not OPFS), §11 Firefox/Safari, and anything visual. Boxes
> below that the runner now owns are marked **[auto]** — do not spend a pass on them.
>
> **What is left for you is §H immediately below, written as steps.** Nothing else in this file is
> asked of you until §H is done and the runner is green.

**Tom's time is the scarce thing here, not CC's** (2026-08-05: *"The full passes are slow and
fatiguing, and I ask you not to ask them of me any more than necessary"*). So the rule for adding to
this list: **if a harness can answer it, a harness must**, and only what genuinely needs a rendered
page — or two browser profiles — is allowed to appear below. Task 212's decision table went to
`dev/lpn-spike/handle-restore-harness.js` (55 checks, mutation-tested) instead of becoming six more
boxes here. When a check here fails, ask whether the retest belongs in a harness before writing it
back into this file.

Scope: what is **on production now** — the server-broker version.

---

## H. THE HUMAN LIST — the whole of what needs Tom

Everything else in §2–§8 and §12 is `node dev/browser-pass/run.js`, run before you are asked to look
at anything. **This section is the entire ask.**

**CLOSED 2026-08-06. Every box in this file is now `[x]` or `[auto]`**, and the only empty ones left
are in the Appendix, which is history and is never to be worked. H1–H7 all passed; H4 took four
rounds and found four separate defects, the last of which — `getFile()` answering for a file that is
not there — would never have been found any other way.

**If this list is ever re-run, run `node dev/browser-pass/run.js` first and only work what it cannot
answer.** The sections above say which those are.

Setup: Chrome, a normal profile, `https://hawsedc.com/engcalcs/Looped-Network.php`, and visit once
with `?ec_nolog=1` first. A real folder you can see in Explorer — Documents is fine.

**H1. The native file dialog opens at all** *(§1 — the riskiest single guess in the build; nothing
automated can test it)*
- [x] In a Chrome profile that has never used this: **File → Save** → the training panel appears.
- [x] Read it slowly — take twenty seconds or so, deliberately — then type initials and press
      **Continue**. **Does the operating system's Save dialog open?**
      *(If it does not, that is Chrome's transient user activation expiring while you read, which is
      the exact failure the panel design exists to avoid. Say so and it gets rebuilt.)*
- [x] Save it to a real folder. Open the file in Notepad: readable, indented, and it contains
      `"docId": "d…"`.

**H2. Reload really is silent** *(§8 — the runner only proves the always-granted case)*
- [x] With that file open, press **F5**. **Expect nothing at all**: no banner, no dialog, no click.
- [x] Draw something, **File → Save**. It writes the same file — no picker, no `(copy)` in any name.
- [x] Close the whole browser, reopen it, go back to the page. Same again: nothing, or *at most* one
      **Reconnect to this file** button. Anything that tells you to Save as or find the file again is
      a FAIL.

**H3. A connection that really is lost** *(§5/§8 — cannot be produced without Chrome's own settings)*
- [x] Chrome → ⋮ → **Settings → Privacy and security → Site settings → hawsedc.com → File editing →
      Block** (Chrome offers Block, not Remove). Reload the page.
      [TGH: Can't really remove. Can only "Block".]
      [CC 2026-08-06: My recipe was wrong — Chrome's File editing row offers **Block**, not Remove.
      Block is the better test anyway: it is `denied`, the branch that drops the handle for good.]
- [x] The banner should say the connection to *that file* was **lost** and offer **Choose the file
      again** — OR, as Tom saw with Block, the browser's own request to reconnect, which is the same
      pass. *(The old wording — "a browser does not stay connected to a file after the page is
      reloaded" — is now itself a FAIL.)*
      [TGH: Since it was blocked, not removed, it merely asks for permission to reconnect. I'm not sure what you are looking for, but to my naive eyes, everything looks good.]
      [CC 2026-08-06: **That IS the pass**, and it is worth naming what you saw: the browser asking
      for permission to reconnect is Task 212 working — the handle survived, only the grant went. The
      FAIL I was watching for is the old sentence telling you to Save as or go and find the file
      again, which is the state where the handle itself was lost. You did not get it. H3 is green.]
- [x] **[auto]** Press it, pick the same file → connected, banner gone, Save works. *(Runner §10:
      the banner's picker relinks and the save lands.)*
- [x] **[auto]** Instead of that button, try **File → Open…** on the same file → it reconnects **that
      tab** and does **not** add a second one. *(Runner §1&5.)*

**H4. A file that goes missing** *(§10 — the sandbox recreates deleted files, a real folder does not)*
- [x] With a file connected, **rename or move it in Explorer**.
- [x] **PASSES — Tom, 2026-08-06: "It worked right this time."** Draw something, **File → Save** →
      expect an amber banner and **Choose the file again**, and the asterisk to STAY LIT.
      *(Tom 2026-08-05: "No. There's an asterisk, but no complaints. Saving is silent and recreates
      the original name." Tom 2026-08-06: "It neither complains nor creates a new file. It silently
      fails to save." Both are the same root cause and it is fixed — but only a real folder can
      prove it, which is why this box is yours.)*
      [TGH: The situation seems to be worse now. It neither complains nor creates a new file. It silently fails to save.]
      [CC 2026-08-06: **The most valuable line in this pass, and fixed.** Everything up to and
      including `writable.close()` can resolve without a byte reaching the disk you are looking at —
      a moved file, a withdrawn permission, a sync client holding the path — so the page believed it
      had saved. **A write is not a save until you can read it back**: the file is now re-read after
      every write and its size compared with what was written, and a mismatch raises the amber banner
      with "Choose the file again". Reproduced and guarded in the browser pass by handing the page a
      handle whose writes are discarded (§10, four checks, mutation-confirmed) — the only way to make
      OPFS fail the way a real folder does. **Please retest H4 once you have pulled.**]
      [TGH: It saves silently.]
      [CC 2026-08-06 (2): **You found a better bug than either of us thought was there, and my last
      fix could not have caught it.** Moving a file does not make the write FAIL —
      `createWritable()` on a handle whose file has been moved **recreates it at the old path**. So
      the bytes land, the read-back matches, every check passes, and the report of success is
      literally true: something was saved. It is just not the file you moved. You end up editing a
      file you did not choose while the copy you moved goes stale.
      The only thing that knows better is the BASELINE: we have read that file before, so if it
      cannot be read now, it is **gone** — not "unanswerable". That case now refuses the write and
      raises the amber banner, and it is checked before anything is written, so nothing is recreated
      behind you.
      This also retires my "OPFS is not like a real folder" excuse: OPFS does exactly what Chrome
      does here, so the runner now TESTS this box instead of skipping it (§10, five checks,
      mutation-confirmed). **One more retest, and I think this one is real: after pulling, expect the
      amber banner, the asterisk still lit, and NO new file at the old name.**]
     [TGH: It saves silently to a new file.]
      [CC 2026-08-06 (3): **Guard tightened, and then I need one fact from you rather than a fourth
      guess.** The rule is now flat: **Save must never CREATE a file.** You chose that file in a
      picker once; if it cannot be read when you press Save, it is not there, and writing anyway
      invents a file in a folder you moved it out of. Creating files is Save AS's job, and Save as
      asks. (It no longer depends on having a baseline stamp — a missing baseline is a reason to be
      more careful, not less, and tying the guard to one left exactly the hole this symptom kept
      coming back through.)

      **But that only helps if `getFile()` actually fails on your machine, and your last result says
      it may not.** Two questions, and the second is one line:

      1. After the move, does a file reappear at the **old** name/location, or does the file at the
         **new** location get updated? (i.e. is Chrome following your file, or recreating it?)
      2. In DevTools → Console on that page, paste:
         `JSON.parse(localStorage.lpn_index).projects.map(p=>[p.name,p.fileName,p.fileStamp])`
         and send the output. If `fileStamp` is missing for that project, the fault is upstream of
         everything above and I have been fixing the wrong end.

      I would rather ask than ship a fourth speculative fix at you.]
      [TGH: 1. A file reappears at the old name. 2. fileStamp is present: '1786169566337:442531'.
      I pulled. Still a silent save. I always delete the file before testing.]
      [CC 2026-08-06 (4): **Answered, and it was my assumption that was wrong, not your procedure.**
      `getFile()` SUCCEEDING IS NOT PROOF THE FILE IS THERE. It hands back a File object built from
      what the browser already knows — name, size, lastModified — and on Windows it will do that for
      a path with nothing at it any more. The error only surfaces when something actually **reads the
      bytes**, and nothing in the guard was doing that: every check I have added over four rounds was
      asking the browser's memory rather than the disk. That is why the stamp was fine, why the
      metadata comparison saw no change, and why the write went ahead.
      It now reads one byte off a slice — a real disk touch, free next to the several hundred KB a
      save writes — and refuses if that fails. The browser pass tests it with a handle that behaves
      exactly like yours: real, current metadata, reads that throw (§10, three checks,
      mutation-confirmed — trusting `getFile()` alone turns them red).
      Four rounds on one box, and every round found something real. Thank you for the patience.]
      [TGH: It worked right this time.]

**H5. The words, which only a person can judge**
- [x] Have a colleague — or a second Chrome profile — hold the file, then open it. The first line of
      the dialog should now carry **a number**: "…the last edit was 20 minutes ago, 5 minutes after
      the last save", or "…and their work is saved to the file", or "…their browser last checked in
      3 minutes ago". Is it the sentence you would want to read before deciding whether to interrupt
      somebody?
- [x] The read-only banner should now **name them**, not say "Somebody else".
- [x] Known and not yet fixed: it says **"1 minutes ago"**. Confirm you are happy leaving that until
      the `lpn_` translation sprint (three singular forms now become 78 then).

**H6. The visual ones — nothing automated can see these**
- [x] Banner colours and wrapping: amber for a warning you can work through, red for read-only. Do
      the buttons inside them wrap sanely on a narrow window?
- [x] Open enough projects to overflow the tab strip. A horizontal scrollbar is expected; the
      **vertical one on the right is finding 14** — still there?
      [TGH: The vertical one was there all along, and I just didn't notice it. Always there. Not the end of the world.]
      [CC 2026-08-06: Then it is not finding 14 and never was — struck from the findings list rather
      than left there implying somebody owes you a fix.]
- [x] **Save all** with two edited file projects: it flickers through each tab as it saves. Live with
      it, or shall it become its own task?
      [TGH: I understand. Some sort of an explanation might be nice. But I don't know where or how unless we had a snoozable tip system.]
      [CC 2026-08-06: Agreed, and that is exactly Task 209 — this is now logged there as its second
      concrete instance, so the tip system arrives with something to say rather than as scaffolding
      looking for a use.]

**H7. Firefox or Safari** *(§11 — five minutes, and it is the whole story for those browsers)*
- [x] In Firefox: **File → Save** is disabled, **Save as…** is enabled, and its tip explains that
      this browser cannot connect to a file.
- [x] Save as → you get a download. Press it again → another download. Expected.
- [x] **Known defect 13:** after Save as the unsaved asterisk **persists**. Still true?
      [TGH: Still true.]
      [CC 2026-08-06: **Fixed.** In a browser that cannot connect to a file, the downloaded copy IS
      the saved state, so the download now records a baseline and the star goes out until the next
      change. It stays FAINT rather than turning bold, because the other fact it carries is still
      true: the page cannot write back to what it handed you. Covered by the runner's new §11 spec,
      which reproduces those browsers by removing `showSaveFilePicker` — the same one property the
      page tests.]
- [x] No lock banner ever appears.

---

## 0. Before you start

- [x] `git pull` on the server.
- [x] **THE LOCK BROKER MUST BE ABLE TO WRITE.** Everything in §6, §7 and §12 is meaningless if it
      cannot, and it fails almost silently: `check` on a project with no record short-circuits before
      touching disk and answers *"nobody has this file"*, so a colleague opens it with **no dialog at
      all**, and only the follow-up `acquire` complains. That is exactly what happened on 2026-08-05
      — `lpn-locks/` was `755 haws:haws` while Apache runs as `www-data`.

      ```
      ls -ld lpn-locks                    # must be writable by the web server user
      sudo chgrp www-data lpn-locks && sudo chmod 2775 lpn-locks
      ```

      Confirm before going on: open a project, Save it, and check that a `.json` record appears in
      `lpn-locks/`. If the page shows the amber *"cannot save lock records"* banner, this is why.
- [x] **Use `https://hawsedc.com/engcalcs/Looped-Network.php`.** Not a plain `http://` LAN IP. The
      File System Access API needs a secure context; without it `window.showSaveFilePicker` is
      `undefined` and **every file feature below silently degrades to the download fallback**. That
      is §11's subject, not this one. (`http://localhost` *is* a secure context and works.)
- [x] Visit any page once with `?ec_nolog=1` **in each browser/profile you test in**, so this pass
      does not land in the usage numbers.
- [x] Chromium (Chrome/Edge) for §1–§10.
- [x] **For §6–§7 you need two separate browser *profiles*, not two tabs.** Two tabs share
      `localStorage` and therefore one identity token, so the lock reads as "mine" in both and you
      would see no contention at all.
- [x] *(The old step setting a 60 s autosave interval is gone — 211 removed autosave. Tom's question
      on it — "why must we have limits at all?" — is moot for the file, and now applies only to the
      lock poll interval, if at all.)*

---

## 1. First run and the training panel

The panel is what makes the native file dialog open from a real user gesture. It is the riskiest
single guess in the build.

- [x] In a browser profile that has never used this: **File → Save** on a new project.
- [x] A **training panel** appears first — four short paragraphs, an *Your initials* box, a
      **Continue** button. **No file dialog yet.**
- [x] The four paragraphs say, in order: saved only when you ask; the site tracks who has a file
      open; *your browser* will ask permission on first save; give initials colleagues will know.
- [x] Initials → **Continue** → **now** the native save dialog opens.
      *(If it does not open here, that is the user-activation failure this design exists to avoid.)*
- [x] Suggested name is `Untitled-lpn-hawsedc-engcalcs.json`.
- [x] Save. In a text editor: readable indented JSON, and `project.docId` exists **on the very first
      save** and starts with `d`. *(This was the 2026-08-04 defect — verify it is gone.)*
- [x] **File → Save** again → no training panel, no dialog, no second file. It just writes.
- [x] Clear/Wipe the calculator → your initials are **forgotten** and the panel returns next time.
      *(Also a 2026-08-04 defect.)*

---

## 2. Tabs — projects as documents

- [x] A tab strip is visible above the map, one tab per project, current tab distinguished.
- [x] A project never saved to a file is marked **"Not saved to a file"**.
- [x] **New project** adds a tab and switches to it. The previous project stays open in its tab.
- [x] The tab's own menu offers **Duplicate** and rename. **There is no Delete.**
- [x] **Duplicate** produces an independent project — edit the copy, the original is untouched.
- [x] The duplicate gets a **new `docId`** (save both and compare in an editor). A copy must not
      inherit the original's lock identity.
- [x] **All projects** lists every open project and switches to the one you pick.
- [x] Enough tabs to overflow horizontally → they stay reachable (the list view), nothing is stranded.
      [TGH: A scroll bar appears at the bottom. Strangely, one also appears at the right side for no apparent reason.]

---

## 3. The File menu, and the absence of autosave

- [x] **[auto]** **RETEST — fixed 2026-08-05, and the runner now checks every row and its greying.** Menu reads: **New, Open…, Save, Save as…, Save all, Revert,
      Close** — *every row present every time*. **Save all** is greyed out below two file projects
      with unsaved changes, in the way Save and Revert already grey out.
      [TGH: Save all is not present]
      [CC 2026-08-05: It was there and hidden below that threshold, which is how a command that
      exists became one nobody can find. It greys out now instead, like its siblings.]
- [x] With a file connected, draw a node and **wait two minutes touching nothing**. The file's
      modified time on disk **does not change**. Nothing is written behind your back.
- [x] **Save** → the file's modified time advances now, and the status line names the file.
- [x] **Save as…** → choose a new name. The project now follows the *new* file; Save writes there.
- [x] The original file still holds the pre-Save-as contents.
- [x] **Revert** → confirmation naming the file → the on-disk version reloads and your unsaved edits
      are gone.
- [x] **Save all** with two file-connected projects open and both edited → the row is now enabled,
      and both files advance. With only one edited, the row is greyed. *(Tom, 2026-08-06: "It
      works.")*
      [TGH: It works, but having it switch to each tab as it saves it is unsightly.]
      [CC 2026-08-06: Agreed it is ugly, and NOT fixed — deliberately. Save all switches tabs because
      the write path writes *the open project*, and every warning it can raise (read-only, the file
      changed underneath, the file is gone) is a banner about *the tab you are looking at*. Making it
      silent means teaching the write path to report about a project you cannot see, on the one
      function in this file that can destroy a colleague's work. Not worth it for a flicker on a
      command that needs two edited file projects to be reachable at all. Say the word if you want it
      anyway and it becomes its own task.]
- [x] Hover **Save** and **Save as…** → tips distinguish "saves to the connected file" from
      "choose a file to save to".

---

## 4. Close

- [x] Close a project that **is** connected to a file, with unsaved edits → prompt offers to save
      first, and **Close without saving** is an explicit choice.
- [x] Close a project that is **browser-only**, with any content → the prompt says plainly it is
      kept only in this browser and **is gone for good**. This wording is the safety net; check it
      actually appears.
      [TGH: Yes. But this message also appears when I didn't change the new project (no content).]
- [x] After closing with other projects open → status says what closed and what is now showing.
      [TGH: Yes, but (1) the message was immediately overwritten by "nodes have no path to a reservoir". Maybe status messages should stack. (2) The one now showing is the last one created as it shouldn't instead of the next one rightward in the tab bar as it should.]
- [x] After closing the **last** project → status says it started a new empty project, and it did.
- [x] Closing a file-connected project **does not delete the file**.
- [x] Close → then **File → Open** the same file → the work is all there.

---

## 5. Open from file

- [x] **File → Open…** → pick a saved file → the network appears and the status line names it.
- [x] It arrives as a **new tab**, not over the top of the current project.
- [x] Its tab is **not** marked "Not saved to a file".
- [x] **[auto]** **FIXED 2026-08-05, verified by the runner.** Open the *same* file twice in one browser → **no second tab**.
      It switches to the tab that already has it and says so. If that tab has unsaved changes, the
      message says so too and points at Revert.
      [TGH: It does open two live tabs both claiming the same file.]
      [CC 2026-08-05: Two tabs over one file is a merge conflict with yourself. Identity is the
      `docId` inside the file, so a copy saved under a new name still opens as its own tab.]
- [x] **[auto]** **The same route is now how you reconnect.** Take a project whose banner says the connection
      was lost, and **File → Open…** its file → it reconnects *that* tab rather than adding one.
      [TGH: I am not sure under what condition a connection would be lost. How can I test this?]
      [CC 2026-08-06: Fair — since Task 212 it is genuinely hard to reach, which is the point. To
      force it: **Chrome → ⋮ → Settings → Privacy and security → Site settings → hawsedc.com → File
      editing → Remove**, then reload the page. That throws the grant away rather than making it
      dormant, so `queryPermission()` answers `denied` and the tab comes back with the banner. The
      other routes are a private window (no IndexedDB to keep the handle in) and moving the file
      (§10). A project opened before 2026-08-05 also has no stored handle, but you have none of those
      left.]

---

## 6. Locking — somebody else has it *(two profiles)*

- [x] Profile **A**: open the file. Editable, no banner.
- [x] **RETEST — the lock now survives looking away.** In A, open the file, then switch tabs,
      minimise, and reload the page. **A still holds it** every time, and B still gets the dialog.
      *(The release on `visibilitychange → hidden` is gone; that event fires on an ordinary tab
      switch, which is what made the lock evaporate.)*
      [TGH: (1) I get "This project came from Maricopa-Flex-lpn-hawsedc-engcalcs.json, but a browser does not stay connected to a file after the page is reloaded. Use File, Save as, or open the file again, to connect to it. Choose the file again Dismiss". (2) Save acts like Save as. (3) Reloading the page is what causes this. Can our connection either survive that or be re-established from our storage and our server lock?]
      [CC 2026-08-05: **This check was wrong and has been split in two below.** It bundled the LOCK
      (server-side, keyed on a docId that lives in localStorage) with the FILE CONNECTION (a browser
      handle that genuinely cannot survive a page load yet). Worse, it asserted "A still holds it"
      after a reload when the code did the opposite: `beforeunload` released every lock and nothing
      took them back on the way in. Answering (3): the LOCK can be re-established from storage and
      now is; the CONNECTION needs Task 212 (handles persisted in IndexedDB, re-permissioned with one
      click), which also removes (2), Save behaving like Save as.]

- [x] **RETEST (a) — looking away.** In A, open the file, switch to another tab, minimise, come back.
      **A still holds the lock** and B still gets the dialog. No reload in this one.
- [x] **RETEST (b) — reload.** In A, reload the page. **A still holds the lock** — B opening the file
      still gets the dialog naming A. *(New: locks are re-acquired on boot from the docId in
      localStorage. Nothing did this before, so a reload silently un-held every file.)*
- [x] **(b) continued — the connection should now come back too (Task 212, built 2026-08-05).**
      After the reload, one of two things, and both are a pass:
      **either** the file is simply connected again with no banner at all (your browser kept the
      permission), **or** the banner says *"Your browser needs your permission again"* and offers
      **Reconnect to this file** — one click, no file picker, no hunting for the file.
      The old *"use File, Save as, or open the file again"* wording is a FAIL: it means the handle
      was not persisted.
- [x] After reconnecting, **Save** writes to the original file — not a copy, and no `(copy)` in any
      suggested name.
- [x] **RETEST (c) — somebody took it while you were reloading.** Have B open and hold the file, then
      reload A. A must come back **read-only, naming B** — not silently editable, and not silently
      holding a lock it no longer has.
- [x] **The freshness check — this is now the actual guarantee.** Have B take the file (by whatever
      route) and save a change to it. Then in A press **Save** → **disabled**, with a banner saying
      somebody else saved to this file and pointing at Save as / Revert. A's work is untouched.
      [CC 2026-08-06: (1) YES, and it is in — see the new box below. (2) answered there too.]
      [TGH: (1) Do we want to add "AAA has this file open. They last edited X ago, Y after their last save"? (2) Revert is not an option. It says "Read-only: TGH has this file open. You can change anything you like here, but you cannot save. Use File, Save as to save to a different file.Save as…". I think it may be good as is.]
- [x] **[auto]** **NEW 2026-08-06 — the lock dialog now carries numbers** (Tom: *"Are we going to add some
      numbers to this message?"*). Open a file B is holding and read the first line. It should say
      one of four things, never the bare *"TGH has this file open."*:
      - B edited and has **unsaved** work → *"…the last edit was X ago, Y after the last save."*
      - B edited and **saved** it → *"…the last edit was X ago, and their work is saved to the file."*
      - B edited, never saved this session → *"…and none of it has been saved to this file yet."*
      - B has only **opened** it → *"…but has not edited it. Their browser last checked in X ago."*
      *(The numbers were always reported and stored; only the richest sentence was ever used, and it
      needed both an edit and a save in B's current session — so the ordinary "opened it and went to
      lunch" case fell through to the bare one. Wording checked by harness §12, including that the
      broker's seconds are not read as milliseconds.)*
- [x] **[auto]** **REWRITTEN 2026-08-05 — both states are now checked by the runner, including the Revert button.**
      - **Read-only** (B holds the *lock*): the banner names B and offers **Save as** only. There is
        nothing to revert *to* — the file has not moved — so no Revert is offered and that is right.
        *(Tom: "I think it may be good as is.")*
      - **Changed underneath** (B *saved* to the file): the banner says somebody saved to this file
        and names **both** exits, because both are real — **Save as** keeps your work in a file of
        your own, **Revert** throws yours away and loads theirs. Check **File → Revert** is enabled
        here, and that using it clears the banner.
      [TGH: No revert offered, only Save as.]
      [CC 2026-08-06: You were right and the box was wrong about where to look. Revert was in the
      File **menu**, never in either **banner** — and the banner is where somebody in this state is
      actually looking. Both banners now carry it, whenever there is something to revert FROM
      (unsaved changes) and something to revert TO (a live connection): read-only gets
      **Save as… + Revert**, changed-underneath gets **Save as… + Revert + Dismiss**. Revert writes
      nothing, so it is safe even in read-only.]
- [x] From that state, **Save as…** to a new name → succeeds, banner clears, A keeps their work.
- [x] **[auto]** The same refusal happens **with the lock broker blocked** (see §9). The freshness check must
      not depend on the server at all.
      [TGH: You are being lazy. You should not ask me to test things that are obviously not there. "Beware: could not reach the server to check or create a lock on this project, so nothing is stopping a colleague from editing the same file at the same time. You will be told if locking starts working again."]
      [CC 2026-08-05: Fair, and the banner you kept seeing was itself the bug. A server that ANSWERS
      "I cannot write the lock directory" was being flattened into the same silence as a dead network,
      so the page could only ever say "could not reach the server". The 4xx/5xx body is now read and a
      setup fault says so in its own words.]
      [TGH: Still doesn't work with broker blocked. Save is apparently allowed as normal.]
      [CC 2026-08-05: Found, and it was not the broker at all — **the freshness stamp died on every
      reload.** It lived only in memory, and Task 212 then re-read the file on the way back in, so a
      reload ADOPTED whatever B had written since as A's own baseline and there was nothing left to
      object to. The stamp is now stored in the project index beside the file name, and boot keeps
      the old one rather than taking a new one. Harness: `dev/lpn-spike/handle-restore-harness.js`
      §9. **When you retest, reload A between B's save and A's Save — that is the case that broke.**]
      [TGH: Still doesn't work with broker blocked. Save is apparently allowed as normal.]
      [CC 2026-08-06: **Second root cause, and this one is the answer to "allowed as normal".** The
      freshness check lived only in `writeOpenProjectToFile()` — the *Save* path. But **read-only
      routes Save straight to Save as**, and so does a tab with no live handle, and Save as had an
      explicit exemption: any file carrying our own `docId` was treated as ours to overwrite, without
      even asking the broker. That is true of the file we last wrote and false of the file a
      colleague has written since. Save as now runs the same stamp comparison (needs no server) and
      asks before replacing a file that has moved on — and it now asks the broker about our own
      docId too, so a file somebody has TAKEN is refused rather than overwritten. Harness §11.
      **Retest both ways: press Save, and press Save as… and pick the same file.**]
- [x] **[auto]** **RETEST — a broken server and an absent one now read differently.** *(Runner §9
      drives all three: unreachable, `error:storage` — "setup fault on the server … not writable by
      the web server" — and `error:full`. It fulfils the broker's reply rather than chmod'ing a
      directory, because what was wrong was the page's reading of the answer, not the answer.)*
- [x] Ordinary case, unbroken: open, edit, Save, edit, Save again → **never** refused. A false
      positive here would be worse than the bug it prevents.
- [x] **[auto]** Profile **B**: open the same file. Expect a dialog headed **"<A's initials> has this file
      open."** offering exactly two choices: **Open read-only** and **Create a copy**.
      **There must be no AUTOMATIC take-over** (see the 2026-08-09 correction at the top): nothing
      may promote B's tab on its own. B taking the file deliberately, via *Break their lock*, is a
      supported action and is offered as the third choice.
      [TGH: Yes, most of the time. But more than once I have experienced a silent same open in another browser. I am not sure what are the conditions. Testing this, I find that when it happens, closing and reopening in B just repeats the mistake. Next I checked that A is indeed connected. Then I closed A and reopened it. That ends the manifestation.]
- [x] ~~**Create a copy** → asks where to save → …~~ **STALE — that button no longer exists.** The
      open-time dialog now offers Cancel / Open read-only / Break their lock, and *open read-only then
      Save as* IS making a copy. Tom's "uses same name. Oops." was the last word on the old one.
      [TGH: No. Just creates a copy in browser. No save. And uses same name. Oops.]
- [x] In A, **File → Close**, then in B open the file again → B gets it cleanly, no dialog.
- [x] **[auto]** **RETEST — fixed 2026-08-05, this is the dangerous one.** While A holds a file,
      from *any* project in B try **Save as…** and pick A's file → refused, naming the collision;
      renaming the file changes nothing, because identity is the `docId` inside it.
      *(Runner §6-saveas and the harness's inspectSaveTarget table, both broker-up and broker-down.)*
      [TGH: No complaint, no refusal. All I get is this: "Beware: could not reach the server to check or create a lock on this project, so nothing is stopping a colleague from editing the same file at the same time. You will be told if locking starts working again."]
      [CC 2026-08-05: Two causes, and the second is the real lesson. (1) The broker could not write
      (see §0), so it could never answer "somebody has this". (2) **The guard asked ONLY the broker**,
      so with the broker down it answered "no collision" to everything and reproduced the very bug it
      was written to fix. Now split in two: a hard refusal when the broker says somebody holds it,
      and — needing nothing but the file itself — a confirm naming the project about to be destroyed.]
- [x] **[auto]** **RETEST — the broker-free half.** Save as… onto a file holding a *different*
      project → a confirm naming that project; Cancel leaves both files untouched. *(Runner §6-saveas.)*
- [x] **[auto]** **RETEST — the same with the broker deliberately broken.** The confirm still
      appears. *(Runner §6-saveas runs every one of these twice, once with the broker unreachable —
      a guard against destroying somebody's work that needs a server is not a guard.)*
- [x] **[auto]** Save as… onto a brand-new file, and onto a non-project file → **still allowed**,
      no question asked. *(Runner §6-saveas. The guard must never become "Save as sometimes does
      nothing".)*
      [TGH: I did not test due to previous.]
- [x] With the broker blocked (see §9), Save as… still works. A lock outage must not disable saving.

---

## 7. Read-only is opt-in, and it means read-only

This is the paradigm Tom asked for: you may do anything you like, you just cannot save *here*.

- [x] In B choose **Open read-only** → a banner names A and says you can change anything but cannot
      save.
- [x] **[auto]** **RETEST — fixed 2026-08-05.** In B: add nodes, drag, delete, undo, edit properties, change
      settings → **all allowed**. Every tool in the toolbar is reachable.
- [x] **[auto]** In B: **Save is disabled** in the File menu and does nothing if reached any other way. It must
      **not** turn itself into Save as. *(Tom, 2026-08-05: "Save is disabled as it should be.")*
- [x] **[auto]** In B: edits made in read-only **survive switching to another tab and back**, the
      tab is still read-only afterwards, and Save is still disabled. *(Runner §6&7.)*
- [x] **Save as…** to a different name → succeeds, B is now a normal editable project on its own
      file, banner gone, and the new file has a **different `docId`**.
- [x] ~~Leave A idle for >2 min…~~ **NO LONGER TESTABLE, BY DESIGN.** The AUTOMATIC take-over was
      withdrawn and the promotion poll was deleted in Task 211 — there is no code path that can
      promote a tab on its own, so there is nothing to wait two minutes for. (Deliberate take-over
      via *Break their lock* is unaffected and is tested in §6&7.) What replaced it is asserted instead: nothing
      promotes a read-only tab, ever (runner §6&7).
      [TGH: What seems to happen is that B is allowed to open the project until A closes it and opens again.]
- [x] ~~In A, close the project. B **still** does not silently become editable.~~ Same answer as
      above: read-only is a property of B's tab, and only B can change it. A's closing frees the
      LOCK, which is what lets B's *next* open be clean — that transition is covered by the runner.
      [TGH: Can't test because lines 145 and 156 are inconsistent.]
- [x] *(REMOVED 2026-08-05 — this check contradicted the one above it and was CC's error carried
      over from the pre-211 list. Read-only allows every edit; it only refuses to Save. There is no
      "inert tools" behaviour to test.)*

---

## 8. Reload — the connection should come back *(REWRITTEN 2026-08-05, Task 212 landed)*

> This section used to be titled "Reload disconnects from the file" and told you to expect a banner
> saying so. That is no longer the design: a reload should cost you **nothing**. Everything below is
> reset — the old boxes were passes and fails against the opposite behaviour.

- [x] With a file-connected project, **reload the page**. The project is still there.
- [x] **[auto]** **The reload is silent.** No banner, no dialog, no click: the file is simply still connected.
      *(The browser's grant goes dormant rather than away, and the first click or keypress anywhere
      on the page revives it without showing anything.)*
- [x] **[auto]** **Save** immediately after a reload writes to **the original file** — not a copy, and no
      `(copy)` in any suggested name.
      [TGH (against the old behaviour): It acts as those it's saving a copy... And its suggested file
      name is ...(copy)... .]
- [x] Where the browser really has forgotten the grant, the banner says the connection to that file
      was **lost** and offers **Choose the file again** → picker → reconnected, banner clears.
      *(Tom did this by hand as §H3, 2026-08-06, via Chrome's Block. Pass.)*
      *(The old wording, "a browser does not stay connected to a file after the page is reloaded", is
      now itself a FAIL: it is no longer true.)*
- [x] **[auto]** **File → Open…** on that same file also reconnects the tab, and does **not** add a second one.
- [x] The lock survives the reload rather than being left held by a session that no longer exists
      (§6 (b) covers this properly).
      [TGH: (1) Is there a way on reload to alert that connectable file projects have been
      disconnected and can be connected again using Save to the same file? (2) Is there a way to put
      up the "Leave site?" message when there is a connected file?]
      [CC: (1) is answered by the banner above, and by the reload no longer disconnecting in the
      first place. (2) is a real ask and is carried in the findings list, not here.]

## 9. No server *(the honest-degradation case)*

- [x] With a file linked, block the broker: DevTools → Network → Offline, or block
      `/engcalcs/lpn-lock.php`.
- [x] Close and re-open the file → **amber banner**, beginning "Beware", and **editing still works**.
- [x] **[auto]** While online-but-blocked the banner has **no Dismiss**. With the whole browser set
      Offline it **does**. *(Runner §9.)* *(Recipe, since the old instruction was not actionable: DevTools → Network → right-click
      any request → **Block request URL**, on a `lpn-lock.php` request. Leave "Offline" unchecked.)*
- [x] Unblock → within a poll cycle the banner clears and you are told locking is working again.

## 10. The file goes missing

- [x] With a file linked, rename or move the file in Explorer.
- [x] **[auto]** Make an edit and **File → Save** → **amber banner** with **"Choose the file again"**,
      and NO file recreated at the old name. *(Runner §10 — it turned out OPFS behaves exactly like a
      real folder here, so this is no longer a human-only check. §H4 confirms it on real disk.)* (No waiting: nothing is
      written on a timer any more, so it happens when you press Save.)
      [TGH: No. There's an asterisk, but no complaints. Saving is silent and recreates the original name.]
- [x] **[auto]** Press it → picker → pick a location → saving resumes, banner clears, asterisk goes
      out. *(Runner §10.)*

## 11. The fallback path — Firefox or Safari *(or any `http://` URL)*

- [x] **[auto]** File → **Save** is disabled and **Save as…** is enabled. *(Runner §11 removes
      `showSaveFilePicker`, which is the one property the page tests, so it takes exactly this
      branch. The TIP's wording is still worth a human glance in a real Firefox.)* *(CC's "Download a copy" wording was stale — corrected.)*
- [x] Each press downloads another file. *(Expected here, and why the label differs.)*
      [TGH: After Save as, there are no unsaved changes. Asterisk should disappear until there are changes.]
- [x] **Open from file** uses the ordinary file-chooser and still loads a project.
- [x] *(REMOVED — there is no "Saving to a file" settings section anywhere any more. Stale check.)*
- [x] No lock banner ever appears.

## 12. Server side

- [x] `https://hawsedc.com/engcalcs/lpn-locks/` → **403/denied**, not a directory listing.
- [x] While a project is open, a `.json` record exists in `lpn-locks/` on disk.
- [x] After **Close project**, that record's `holder` is `""`.
- [x] Confirm `?ec_nolog=1` worked: the three files in `log/` do not grow during this pass.

## 13. Non-regression — the part most likely to bite

- [x] A project that existed **before** this update still opens, solves, and looks right.
- [x] Clear project, Wipe memory, Draw example, Undo, Restore defaults all still behave.
      [TGH: You are being lazy. Some of this stuff no longer exists or is renamed. Maybe on Restore settings tip, we can say something like "To save your favorite settings, save a project file with nothing but settings."
- [x] The solver still converges and results still render.
- [x] Printing still works.
      [TGH: I guess. I am not sure what we expect from printing. It's not pretty, and I have never printed one of these calculators. We all use screenshot.]
- [x] The other 15 calculators are untouched — spot-check Manning Pipe Flow calculates.

---

## Known-shaky, in rough order of how likely I think a defect is

1. **The training panel → file picker handoff** (§1). Chrome's transient user activation is the
   reason this is a panel and not a `confirm()`; if it still fails, the whole first-run flow fails.
2. **Read-only enforcement** (§6). Four separate seams (toolbar `data-edits`, the pointer handler,
   `setMode`, `openPopupAt`). A miss shows up as one control that still works.
3. **The new read-only poll** (§6, last two boxes). Written today, never run in a browser.
4. **Banner rendering** — colors, wrapping, and the buttons inside it have never been seen.
5. **`beforeunload` release** — best-effort by nature; if a stale lock survives a tab close,
   that is this, and the answer is Take over.


---

## Findings — 2026-08-05 browser pass (Tom)

Triaged by what a user loses. Roadmap Task 223 points here.

**P0 — destroys someone else's work**
1. **§6 Save as… overwrote a file another profile had open.** Root cause found: the guard at
   `js/looped-network.js` ran only when *your own* tab was read-only, and compared against your own
   previous handle rather than the file just chosen in the picker. Names were never the issue —
   identity is the `docId` inside the target file. **Fixed 2026-08-05** with
   `fileIsHeldBySomeoneElse(handle)`, which reads the file about to be clobbered and asks the broker
   about *its* docId. Fails open (unreadable / not ours / no broker) so an outage cannot disable
   Save as. **Untested in a browser — see the three retest boxes in §6.**

**P1 — locking is not yet trustworthy**
2. **§6 Intermittent silent open with no lock dialog.** Reopening B repeats it; closing and
   reopening **A** ends it — so the suspicion is A's lock record, not B's check: either never
   acquired, or swept by the TTL while A still had it open. Look at `lpn_sweep()` and at when
   `acquire` is actually called.
3. **§7 Read-only implements the OLD paradigm.** Editing is blocked and Save is disabled. Agreed
   design (Tom, 2026-08-04, reconfirmed 08-05) is the opposite: edit anything freely, Save refuses
   and routes to Save as. Code and decision disagree; the decision wins.
4. **§7 A going idle / closing appears to change B's access** — could not be tested past finding 3.

**P2 — the file connection lies about itself**
5. **§8 No "disconnected by reload" message anywhere.** `lpn_file_needs_reopen` exists and is never
   shown. Save then behaves as a copy, suggesting `…(copy)…`, with nothing explaining why.
   **FIXED 2026-08-05, then made moot** — the banner was repainted on the boot path, and then Task
   212 removed the disconnection itself. Its wording no longer claims a browser cannot stay
   connected, because it can.
   - **A second defect fell out of it, and it was the worse one:** the freshness stamp lived only in
     memory, so a reload dropped it and re-read the file as its own new baseline — which is why §6's
     broker-blocked refusal never fired. A reloaded A would have written straight over B's saved
     work. The stamp is now stored in the index and survives the page.
6. **§5 The same file opens twice as two live tabs**, both claiming it. Confirmed.
   **FIXED 2026-08-05** — opening a file this browser already has open switches to that tab and
   adopts the fresh handle, which doubles as a second way to reconnect a tab that lost its file.
7. **§10 A moved or renamed file is not noticed.** No banner, no *Choose the file again*; Save is
   silent and recreates the original name. **FIXED 2026-08-06 after four rounds and four distinct
   causes** — see finding 23. Confirmed by Tom on real disk: *"It worked right this time."*

15. §3 **Save all switches tabs as it goes**, which is unsightly. **Deliberately not fixed** — see
    the box in §3: the write path writes the open project and every warning it raises is a banner
    about the tab in front of you.
16. §6 **The lock dialog said only "X has this file open."** in the ordinary case. **FIXED
    2026-08-06** — four sentences now, chosen by what the holder has actually done.
17. §6 **Save as had no freshness check at all**, and read-only routes Save into it. **FIXED
    2026-08-06.** This, not the broker, is why the broker-blocked refusal never fired.

**P3 — smaller, all confirmed**
8. §3 **Save all is missing from the File menu** (the string exists and is passed to the page).
   **FIXED 2026-08-05** — it was hidden below two dirty file projects; it greys out now instead.
9. §4 Closing activates the **last-created** project rather than the next tab rightward. **FIXED
   2026-08-09** — `discardProject()` now lands on the tab that slides into the closed one's spot.
10. §4 Status messages overwrite each other — "nodes have no path to a reservoir" ate the close
    message. They should queue or stack. **FIXED 2026-08-09** — a diagnostic now only temporarily
    outranks a notice; the notice resurfaces once the diagnostic clears, instead of being discarded.
11. §4 The "gone for good" prompt fires for an **empty, untouched** new project. **FIXED
    2026-08-09** — an untouched browser-only project (no nodes/links/labels) now closes silently.
12. §6 **Create a copy** keeps the **same name** as the original, so two tabs read alike. *(That it
    does not open a file picker is deliberate — one decision per dialog, and the asterisk says it is
    not saved yet. The name collision is the real defect.)*
13. §11 In the fallback path the unsaved asterisk **persists after Save as**. Confirmed still true
    in Tom's §H pass. **FIXED 2026-08-06** — a download now records a baseline, so the faint star
    goes out until the next change.
14. ~~§2 A stray vertical scrollbar appears on tab overflow.~~ **NOT A DEFECT** (Tom, 2026-08-06:
    *"was there all along, and I just didn't notice it"*). Struck rather than left open.

18. §6 The lock dialog says **"1 minutes ago"**. `agoText()` has no singular form. **Not actually a
    live defect** — checked 2026-08-09: the minutes/hours/days buckets are only reached once the
    smaller unit's bucket has been exhausted (e.g. minutes only after `secs >= 120`), so `n` is
    already at least 2 in every bucket by construction. No code change made.
19. §0 **`Accept-Language: *` 500'd every page in the suite** on PHP 8 (`'' * '0.85'` is a fatal
    TypeError, where PHP 5 gave 0). **FIXED 2026-08-06.** Not an `lpn_` defect at all — found because
    the browser pass's HTTP client sends exactly that header by default, and a browser almost never
    does.
20. §2 **Arriving and reloading before touching anything emptied the tab strip.** `adoptOrphans()`
    drops an index entry whose document is missing, and a brand-new project has no document until its
    first edit — so `openId` went on pointing at a project that had been dropped, `init()` read that
    as "something is already open", and registered nothing. **FIXED 2026-08-06.**
21. §8 **Dismiss the "somebody saved to this file" banner and the next Save refused in silence.**
    Dismiss cleared the banner, not the flag, and the flag suppressed the re-raise. A Save that does
    nothing without saying why is the same defect as one that overwrites without asking, from the
    other side. **FIXED 2026-08-06.**
22. §7 **The read-only banner was anonymous** — "Somebody else has this file open" — even though the
    dialog you had just answered named them. The name is the difference between a wall and a person
    you can walk over and talk to. **FIXED 2026-08-06.**

23. §10 **A moved file was reported as saved**, and it took two fixes because it was two bugs.
    **(a)** Tom, *"It neither complains nor creates a new file. It silently fails to save."* —
    everything through `writable.close()` can resolve without a byte landing, so the file is now read
    back after every write and its size compared with what was written. **(b)** Tom's retest, *"It
    saves silently."* — because moving a file does not make the write fail at all:
    `createWritable()` **recreates the file at the old path**, so the write genuinely succeeds and
    the user is left editing a file they did not choose. Caught now by the BASELINE: we have read
    that file before, so if it cannot be read now it is gone, and that case refuses rather than
    failing open. **(c)** Still silent, file deleted before every attempt: the rule was narrowed to
    the flat one — **Save must never CREATE a file** — with no dependence on a baseline. **(d)** Still
    silent: **`getFile()` succeeding is not proof the file is there.** It answers from metadata the
    browser already holds, so every guard built on it was asking the browser's memory rather than the
    disk. It now reads a byte. **All FIXED 2026-08-06, confirmed by Tom on real disk. The worst class
    of bug this feature can have: the page believed it had saved — four times, for four different
    reasons.**
24. §3 Save all's flicker wants an explanation rather than a rewrite (Tom: *"Some sort of an
    explanation might be nice. But I don't know where or how unless we had a snoozable tip system."*)
    — carried to Task 209 as its second concrete instance.

**Not defects, carried elsewhere**
- §13 Tom: *"You are being lazy. Some of this stuff no longer exists or is renamed."* Correct — CC
  left §13 unrewritten while rewriting §0–§8. It needs the same treatment against current control
  names before the next pass. **Still open — split out as ROADMAP Task 225.13** (2026-08-09): it is
  a browser-verified rewrite, not something fixable by reading code alone.
- §13 Printing: nobody prints these; everyone screenshots. That is Task 175, not a defect here.
- Tom's suggestion for the Restore-settings tip: *"To save your favorite settings, save a project
  file with nothing but settings."* **DONE 2026-08-09** — `lpn_settings_restore_tip` now ends with
  *"To save your favorite settings for reuse, save a project file with nothing but settings in
  it."* (English + es/fr/pt/tr).
- Two feature asks from §8: warn on reload that file projects were disconnected and can be
  reconnected via Save as; and a `beforeunload` "Leave site?" when a connected file has unsaved
  work. **The `beforeunload` guard was already shipped** (`js/looped-network.js`, wired in `init()`)
  — confirmed 2026-08-09, no change needed. The reload-disconnect warning is still open.
- §12 server side passed cleanly, all four checks.


---

## Appendix — annotations from the 2026-08-04 pass (the record of why Task 211 happened)

**The checkboxes below are HISTORY, not a to-do list** — every control they name has been renamed or
removed, and nothing in this appendix is ever to be worked. It is kept as an argument, not a task.

These are Tom's notes against the *old* §1–§8. The controls they describe are gone. They are kept
because they are the argument that produced the tab-and-File-menu paradigm, and because several are
still unresolved design questions (the file-name indicator, the asterisk convention, scenarios as a
second tab row).

## 0. Before you start

- [x] `git pull` on the server.
- [x] **Use `https://hawsedc.com/engcalcs/Looped-Network.php`.** Not `http://`, not a LAN IP. The
      File System Access API requires a secure context; on a non-secure origin
      `window.showSaveFilePicker` is `undefined` and **every file feature below silently degrades to
      the download fallback**. This is what happened in the first pass.
- [x] Visit any page once with `?ec_nolog=1` **in each browser/profile you test in**, so this pass
      does not land in the usage numbers.
- [x] Use a Chromium browser (Chrome/Edge) for §1–§10. Firefox/Safari are §11.
- [x] **For §6–§8 you need two *separate browser profiles*, not two tabs.** Two tabs share
      `localStorage`, so they share one identity token and the lock reads as "mine" in both — you
      would see no contention at all and wrongly conclude locking is broken.
- [ ] In Settings → *Saving to a file*, set the interval to **60 s** (the minimum) so autosave and
      poll-driven steps do not take minutes.
      [TGH: Is there a good reason why this can't be 10 seconds or 1000 seconds? I would think that if a user sees performance degradation they would increase it. I'm asking why we must have limits at all.]

---

#### (old) 1. First run and the training panel

- [ ] In a browser that has never used this: Projects → **Save to file**.
      [TGH: 
      1. The heading "Saved Projects" is strange, like for a list of projects. How about "Saving to a file" or "Saving to your computer" or "Working from a file on your computer" or "Working with local files" (very generic and understandable)?
      2. Use "This project will be saved as a file on this computer. As you keep working, your edits will be saved automatically to that file." (But see thoughts below about our "backup issue".) Is there something untranslatable about "Autosave" or "Save automatically"? I see that under Settings the word "automatically" is also missing.
      3. Is the phrase "Anyone you send the file to can see it" needed now since the initials are only in the sidecar, not the project file?
      4. Chooser 1: There is no indicator that I am choosing a folder. I assume I am choosing a file. Name choice looks good. I don't see a sidecar lock file.
      5. On Select, a message appears in this area: "Saving to: Untitled-lpn-hawsedc-engcalcs.json" That is initially unsettling as in "How long does saving take?!?!?" The better message would be "Saved as: " in spite of the possible intent that "Autosaving is now active." But autosaving may not be the right paradigm. See my thoughts about our backup issue. And maybe no message is needed, 
      6. All applications show the name of the currently open file at the top just like the browser shows URL and tab title. We need to show the name of the active project at our upper area. An asterisk in front of the file traditionally means that there are changes pending saving. Maybe the file name can be above the calculator. 
      7. Our file and project paradigm needs revamping. Without going into details yet, let's brainstorm our paradigm and terminology. Here's a proposal:
      - Project in browser is like a document tab (Like a spreadsheet tab or an AutoCAD drawing layout tab, but displayed at the top since these are not scenarios, but projects. Maybe scenarios can be shown as tabs along the bottom.). They are conceptualized as open in semi-persistent memory (the browser), but not saved (to a file). Visual cues of the tab paradigm indicate which project is current displayed. An asterisk is a common part of the paradigm that denotes that the project has not been saved to disk; I don't know if this can work for us unless it works only in conjunction with a "file" indicator; but since I can't think of a good "file" indicator, maybe we use asterisks on all browser-only projects. Maybe there are "tabs" across the top of the calculator, maybe appearing to be "above" and "transcending" the calculator and map area. Maybe there is also a button at the left edge of the tabs shows a descending (scrollable?) list of all tabs in case they don't fit well horizontally. So the tabs have both horizontal and vertical list views. The tab list has Xes to close tabs, and it has "Discard changes" protection. It has a "+" tab to create a new project.
      - Since projects can have names and persist without "Saving", they are like spreadsheet tabs or AutoCAD drawing tabs. We can rename them and delete them (with protection) without a menu. Maybe there is a little arrow icon on their tab by their name where we can do appropriate actions from the Google Sheets tab menu like Delete (with confirmation), Rename, Duplicate, and maybe arrange/move visually
      - Saving to Disk is under the File menu and it promotes a Tab to a File. Maybe there is an indicator for tabs that are files, though I can't think of a conventional one; maybe a color or a strength of the name font. Once a Tab becomes a File, it can never be demoted; it can only be Duplicated (like any other Tab), Closed and Opened (from disk). The File menu has a New (like creating a new Tab and then Saving it), Open, Save, SaveAs, and Close.
      - We have a backup issue. Autosave should not modify the main save file. We must either (a) Not save until asked or confirmed on close, (b) create a backup sibling file on open for blooper recovery. User must have the ability to Close without saving any changes from this session. That is the standard paradigm.
      ]
- [x] A **training panel** appears in the Projects popup — three short paragraphs, an *Your initials*
      box, a **Continue** button. **No file dialog yet.**
- [x] Type initials → Continue → **now** the native save dialog opens.
      *(If the dialog does not open here, that is the user-activation problem this panel design was
      meant to avoid — report it, it is the riskiest single guess in the build.)*
      [TGH: Little bug: When I use "Clear Calculator", it doesn't forget my initials or prompt me like a new user.]
- [x] Suggested name is `Untitled-lpn-hawsedc-engcalcs.json`.
- [x] Save it. Open the file in a text editor: readable indented JSON, and `project.docId` exists and
      starts with `d`.
      [TGH: Not on first save with an Untitled project. But on second save it adds the docId. Amply repeated.]
- [x] Press **Save to file** again → **no training panel**, no second file, no dialog. It just saves.
      [TGH: Mixed results. On my first attempt, it gave another dialog. But that was the only time. I tried it without problem in another profile. Mark okay, I guess.]
     

#### (old) 2. File naming

- [x] Rename the project (Projects → Rename) → Save to file → suggested name is
      `<project-name>-lpn-hawsedc-engcalcs.json`.
      [TGH: No. It silently saves to original file name. I must Rename before first save.]
- [ ] **RETEST — this check used to hide a defect.** Name a project `Main St. / Phase 2`, Save it.
      The *filename* is sanitised (`Main-St.-Phase-2-...`) — expected, a filesystem cannot hold `/`.
      But the **project name on the tab is still `Main St. / Phase 2`**. Saving must not rename you.
- [ ] Non-Latin script (`Проект1`) survives both the filename and the tab name.
- [ ] **Save as…** and *type a different name* in the picker → the project **does** take that name.
      That is the one case where Save as legitimately renames.

#### (old) 3. Autosave into the file

- [x] With a file linked, the Projects panel shows **"Saving to: `<filename>`"**.
      [TGH: Yes. Bad. See above. Not a good status.
- [x] Draw a node. Do nothing else. Within ~60 s the file's modified time changes on disk.
- [x] Make no change for a cycle → the file is **not** rewritten (the dirty flag is doing its job;
      check the modified time does not advance).
      [TGH: There is no modified time inside the file. On disk the file timestamp does not advance.]

#### (old) 4. Close project

- [x] Press **Close project** → you land on a **new empty project**.
      [TGH: Yes. This is generally right. But see my paradigm thoughts.]
- [x] The project you closed is **still in the Projects list**, and the file is **still on disk**.
      [TGH: No. I think something is wrong here. I have 4 projects named "Untitled" in the Projects list. Does not appear in projects list when opened from file. Does not appear in projects. We shouldn't worry about this for now, because I think this paradigm is poor (it will take too much explanation and still be confusing), and I apologize for that. In the Tabs paradigm, you never "close" a tab. You can Delete a tab. And maybe we say that if you Close a file it deletes your Tab for that file; so Close would only be possible for a File Tab, and after Closing, the project would not be available in the browser. Once a project is promoted from a pure Tab to a File Tab, it can no longer exist as a pure Tab. Right?
- [x] Nothing was deleted.
      [TGH: Let's rethink the paradigm.]

#### (old) 5. Open from file

- [x] **Open from file** → pick the file you saved → the network appears, with a notice naming it.
- [x] It arrives as a **new entry** in the Projects list rather than overwriting the open one.
      *(Intended. Tell me if it reads as confusing in practice — it is the one place the
      "lands as a new project" rule is visible to a normal user.)*
      [TGH: This is paradigmatically sound, I think. The UI will change, but Open means Add a tab for this project and make it current.]

#### (old) 6. Locking — someone else has it *(two profiles)*

- [x] Profile **A**: open the file. Editable.
- [x] Profile **B**: open the same file. Expect: **red banner**, editing disabled, A's initials named.
      [TGH: 
      - I didn't get any warnings. Both profiles have the same file open. Then as they started to Autosave over each other , messages ensued, and it was confusing.
      - Paradigm shift: In AutoCAD, if you try to open a locked file, you have to give express permission to open the file read-only. And I think this is an important UX step.
      ]
- [-] In B, confirm you **cannot** add, delete, drag a node, undo, clear, or edit properties.
      [TGH: I no longer agree with this paradigm. I think that if you open a project read-only, you should be able to do with it anything you want, but you can't save it to file. In other words, all your changes must either be discarded (close tab) or SaveAs. Of course the Tabs paradigm would also let you Duplicate the tab/project.
- [-] In B, confirm you **can** still pan, zoom, and open Settings/Labels. *(Deliberate.)*
- [-] While A is actively editing, B is offered **Save as my own copy** but **not** *Take over*.
- [-] Leave A idle for >2 min. Within a poll cycle B's banner gains **"Take over from …"** without B
      touching anything. *(This is the gap found while writing this list — new, untested in a
      browser.)*
      [TGH: I think that this should not happen if B agrees to open read-only. Read only is read only.]
- [-] In A, press **Close project**. Within a poll cycle B becomes editable on its own and says the
      project is now B's.
      [TGH: I think that this should not happen if B agrees to open read-only. Read only is read only.]

[TGH: I apologize for this disruption, but I think we need to revisit the project and file paradigm before I continue to test because things (the UX) are too confusing. Let's try to find a more intuitive paradigm that is not our own new invention.]
#### (old) 7. Takeover

- [ ] Set it up again (A holds, A idle). In B press **Take over from …** → B is editable immediately.
- [ ] In A, make an edit and wait one autosave cycle → A goes **read-only** and is told B took over,
      **and that A's work is still saved in this browser**.
- [ ] Confirm A's edits are genuinely still there in A (they are in `localStorage`, not the file).

#### (old) 8. Save as my own copy

- [ ] From B's locked-out banner press **Save as my own copy** → asks where to save → new file.
- [ ] B is editable, working in the **new** file. A is unaffected and still holds the original.
- [ ] The two files now have **different** `project.docId` values (check in an editor).

