# Task 195 test punch list — project files and locking (`lpn_`)

Written 2026-08-03 for Tom's first real-browser pass. Everything in Task 195 was verified only by
harnesses against sliced-out logic (177 checks, five harnesses); **no part of the UI has ever been
seen rendered.** This list exists because that is the whole risk.

Scope: what is **on production now** — the server-broker version. The folder/sidecar design
(Task 208) is agreed but not built, so nothing here tests it.

---

## 0. Before you start

- [ ] `git pull` on the server.
- [ ] **Use `https://hawsedc.com/engcalcs/Looped-Network.php`.** Not `http://`, not a LAN IP. The
      File System Access API requires a secure context; on a non-secure origin
      `window.showSaveFilePicker` is `undefined` and **every file feature below silently degrades to
      the download fallback**. This is what happened in the first pass.
- [ ] Visit any page once with `?ec_nolog=1` **in each browser/profile you test in**, so this pass
      does not land in the usage numbers Task 203 is being computed from.
- [ ] Use a Chromium browser (Chrome/Edge) for §1–§10. Firefox/Safari are §11.
- [ ] **For §6–§8 you need two *separate browser profiles*, not two tabs.** Two tabs share
      `localStorage`, so they share one identity token and the lock reads as "mine" in both — you
      would see no contention at all and wrongly conclude locking is broken.
- [ ] In Settings → *Saving to a file*, set the interval to **60 s** (the minimum) so autosave and
      poll-driven steps do not take minutes.

---

## 1. First run and the training panel

- [ ] In a browser that has never used this: Projects → **Save to file**.
- [ ] A **training panel** appears in the Projects popup — three short paragraphs, an *Your initials*
      box, a **Continue** button. **No file dialog yet.**
- [ ] Type initials → Continue → **now** the native save dialog opens.
      *(If the dialog does not open here, that is the user-activation problem this panel design was
      meant to avoid — report it, it is the riskiest single guess in the build.)*
- [ ] Suggested name is `Untitled-lpn-hawsedc-engcalcs.json`.
- [ ] Save it. Open the file in a text editor: readable indented JSON, and `project.docId` exists and
      starts with `d`.
- [ ] Press **Save to file** again → **no training panel**, no second file, no dialog. It just saves.

## 2. File naming

- [ ] Rename the project (Projects → Rename) → Save to file → suggested name is
      `<project-name>-lpn-hawsedc-engcalcs.json`.
- [ ] Try a name with spaces, punctuation (`Main St. / Phase 2`) and, if you can, non-Latin script →
      the filename stays recognizable and the browser accepts it.

## 3. Autosave into the file

- [ ] With a file linked, the Projects panel shows **"Saving to: `<filename>`"**.
- [ ] Draw a node. Do nothing else. Within ~60 s the file's modified time changes on disk.
- [ ] Make no change for a cycle → the file is **not** rewritten (the dirty flag is doing its job;
      check the modified time does not advance).

## 4. Close project

- [ ] Press **Close project** → you land on a **new empty project**.
- [ ] The project you closed is **still in the Projects list**, and the file is **still on disk**.
- [ ] Nothing was deleted.

## 5. Open from file

- [ ] **Open from file** → pick the file you saved → the network appears, with a notice naming it.
- [ ] It arrives as a **new entry** in the Projects list rather than overwriting the open one.
      *(Intended. Tell me if it reads as confusing in practice — it is the one place the
      "lands as a new project" rule is visible to a normal user.)*

## 6. Locking — someone else has it *(two profiles)*

- [ ] Profile **A**: open the file. Editable.
- [ ] Profile **B**: open the same file. Expect: **red banner**, editing disabled, A's initials named.
- [ ] In B, confirm you **cannot** add, delete, drag a node, undo, clear, or edit properties.
- [ ] In B, confirm you **can** still pan, zoom, and open Settings/Labels. *(Deliberate.)*
- [ ] While A is actively editing, B is offered **Save as my own copy** but **not** *Take over*.
- [ ] Leave A idle for >2 min. Within a poll cycle B's banner gains **"Take over from …"** without B
      touching anything. *(This is the gap found while writing this list — new, untested in a
      browser.)*
- [ ] In A, press **Close project**. Within a poll cycle B becomes editable on its own and says the
      project is now B's.

## 7. Takeover

- [ ] Set it up again (A holds, A idle). In B press **Take over from …** → B is editable immediately.
- [ ] In A, make an edit and wait one autosave cycle → A goes **read-only** and is told B took over,
      **and that A's work is still saved in this browser**.
- [ ] Confirm A's edits are genuinely still there in A (they are in `localStorage`, not the file).

## 8. Save as my own copy

- [ ] From B's locked-out banner press **Save as my own copy** → asks where to save → new file.
- [ ] B is editable, working in the **new** file. A is unaffected and still holds the original.
- [ ] The two files now have **different** `project.docId` values (check in an editor).

## 9. No server *(the honest-degradation case)*

- [ ] With a file linked, block the broker: DevTools → Network → Offline, or block
      `/engcalcs/lpn-lock.php`.
- [ ] Close and re-open the file → **amber banner**, beginning "Beware", and **editing still works**.
- [ ] While online-but-blocked the banner has **no Dismiss**. With the whole browser set Offline it
      **does**.
- [ ] Unblock → within a poll cycle the banner clears and you are told locking is working again.

## 10. The file goes missing

- [ ] With a file linked, rename or move the file in Explorer.
- [ ] Make an edit and wait a cycle → **amber banner** with **"Choose the file again"**.
- [ ] Press it → picker → pick a location → saving resumes, banner clears.

## 11. The fallback path — Firefox or Safari *(or any `http://` URL)*

- [ ] The button reads **"Download a copy"**, not "Save to file".
- [ ] Each press downloads another file. *(Expected here, and why the label differs.)*
- [ ] **Open from file** uses the ordinary file-chooser and still loads a project.
- [ ] Settings has **no** "Saving to a file" section.
- [ ] No lock banner ever appears.

## 12. Server side

- [ ] `https://hawsedc.com/engcalcs/lpn-locks/` → **403/denied**, not a directory listing.
- [ ] While a project is open, a `.json` record exists in `lpn-locks/` on disk.
- [ ] After **Close project**, that record's `holder` is `""`.
- [ ] Confirm `?ec_nolog=1` worked: the three files in `log/` do not grow during this pass.

## 13. Non-regression — the part most likely to bite

- [ ] A project that existed **before** this update still opens, solves, and looks right.
- [ ] Clear project, Wipe memory, Draw example, Undo, Restore defaults all still behave.
- [ ] The solver still converges and results still render.
- [ ] Printing still works.
- [ ] The other 15 calculators are untouched — spot-check Manning Pipe Flow calculates.

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
