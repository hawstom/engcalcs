# Task 195 test punch list — project files and locking (`lpn_`)

> **§1–§8 ARE SUPERSEDED (2026-08-04).** Tom's pass through them is what produced the paradigm
> rebuild in ROADMAP Task 211 — projects as tabs, an ordinary File menu, no autosave to the file,
> opt-in read-only, and no Delete. Those eight sections describe controls that no longer exist and
> must be rewritten against the new UI before the next browser pass; his annotations are left in
> place because they are the record of *why* the rebuild happened.
>
> **§9–§13 survive as written** (no server, missing file, the Firefox/Safari fallback, server side,
> non-regression) and are still the right tests.
>
> Three defects from that pass were fixed on production ahead of the rebuild (commit `6274a69`):
> the `docId` was minted after the first file write instead of before — which is also why §6 saw no
> lock contention at all — Clear/Wipe did not forget the initials, and Take over wrote a stale copy
> over a colleague's newer file and has been withdrawn.

Written 2026-08-03 for Tom's first real-browser pass. Everything in Task 195 was verified only by
harnesses against sliced-out logic (177 checks, five harnesses); **no part of the UI has ever been
seen rendered.** This list exists because that is the whole risk.

Scope: what is **on production now** — the server-broker version. The folder/sidecar design
(Task 208) is agreed but not built, so nothing here tests it.

---

## 0. Before you start

- [x] `git pull` on the server.
- [x] **Use `https://hawsedc.com/engcalcs/Looped-Network.php`.** Not `http://`, not a LAN IP. The
      File System Access API requires a secure context; on a non-secure origin
      `window.showSaveFilePicker` is `undefined` and **every file feature below silently degrades to
      the download fallback**. This is what happened in the first pass.
- [x] Visit any page once with `?ec_nolog=1` **in each browser/profile you test in**, so this pass
      does not land in the usage numbers Task 203 is being computed from.
- [x] Use a Chromium browser (Chrome/Edge) for §1–§10. Firefox/Safari are §11.
- [x] **For §6–§8 you need two *separate browser profiles*, not two tabs.** Two tabs share
      `localStorage`, so they share one identity token and the lock reads as "mine" in both — you
      would see no contention at all and wrongly conclude locking is broken.
- [ ] In Settings → *Saving to a file*, set the interval to **60 s** (the minimum) so autosave and
      poll-driven steps do not take minutes.
      [TGH: Is there a good reason why this can't be 10 seconds or 1000 seconds? I would think that if a user sees performance degradation they would increase it. I'm asking why we must have limits at all.]

---

## 1. First run and the training panel

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
     

## 2. File naming

- [x] Rename the project (Projects → Rename) → Save to file → suggested name is
      `<project-name>-lpn-hawsedc-engcalcs.json`.
      [TGH: No. It silently saves to original file name. I must Rename before first save.]
- [x] Try a name with spaces, punctuation (`Main St. / Phase 2`) and, if you can, non-Latin script →
      the filename stays recognizable and the browser accepts it.

## 3. Autosave into the file

- [x] With a file linked, the Projects panel shows **"Saving to: `<filename>`"**.
      [TGH: Yes. Bad. See above. Not a good status.
- [x] Draw a node. Do nothing else. Within ~60 s the file's modified time changes on disk.
- [x] Make no change for a cycle → the file is **not** rewritten (the dirty flag is doing its job;
      check the modified time does not advance).
      [TGH: There is no modified time inside the file. On disk the file timestamp does not advance.]

## 4. Close project

- [x] Press **Close project** → you land on a **new empty project**.
      [TGH: Yes. This is generally right. But see my paradigm thoughts.]
- [x] The project you closed is **still in the Projects list**, and the file is **still on disk**.
      [TGH: No. I think something is wrong here. I have 4 projects named "Untitled" in the Projects list. Does not appear in projects list when opened from file. Does not appear in projects. We shouldn't worry about this for now, because I think this paradigm is poor (it will take too much explanation and still be confusing), and I apologize for that. In the Tabs paradigm, you never "close" a tab. You can Delete a tab. And maybe we say that if you Close a file it deletes your Tab for that file; so Close would only be possible for a File Tab, and after Closing, the project would not be available in the browser. Once a project is promoted from a pure Tab to a File Tab, it can no longer exist as a pure Tab. Right?
- [x] Nothing was deleted.
      [TGH: Let's rethink the paradigm.]

## 5. Open from file

- [x] **Open from file** → pick the file you saved → the network appears, with a notice naming it.
- [x] It arrives as a **new entry** in the Projects list rather than overwriting the open one.
      *(Intended. Tell me if it reads as confusing in practice — it is the one place the
      "lands as a new project" rule is visible to a normal user.)*
      [TGH: This is paradigmatically sound, I think. The UI will change, but Open means Add a tab for this project and make it current.]

## 6. Locking — someone else has it *(two profiles)*

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
