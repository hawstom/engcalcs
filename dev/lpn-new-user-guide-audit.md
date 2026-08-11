# Audit: the lpn app against Tom's own blog checklists (ROADMAP Task 270)

**Source of truth:** the three checklists — New Shopper, New User, New Project — in
<https://tomsthird.blogspot.com/2026/08/hawsedc-free-unlimited-online-looped.html>.
**Date audited:** 2026-08-10, against `js/looped-network.js` and `Looped-Network.php` at master.
**Deliverable:** mismatches only. Tom asked to know what he misunderstood about his own system, so
every claim below was checked against the code, not against memory or the ROADMAP.

Some fixes belong to the post, some to the app. Each finding says which, and why.

---

## A. Mismatches where the APP is wrong

### A1. "Use File, Save to create a local settings template file" — Save is DISABLED outside Chromium
*New User, step 3. This is the step the whole template paradigm rests on.*

`openFileMenu()` sets `disabled: readOnly || !api` on the Save row, where `api` is
`fileApiAvailable()` (`typeof window.showSaveFilePicker === 'function'`). Firefox and Safari have no
File System Access API, so a reader following step 3 in either browser finds a greyed-out command
and no way forward from that row. `saveCurrent()` *does* route an unsaved project to Save As, but it
is never reached — a disabled button fires no click, and it carries no tip either (the comment in
that function says so explicitly).

The disable is itself a deliberate, correct decision (Tom, 2026-08-04: "Save means write to the
connected file; with no connection there is no file"). So the honest fix is on the post's side —
**step 3 should say "File, Save as"**, which is live in every browser and is what the fallback
actually performs. Alternatively the app grows a tip on the disabled row, but a disabled row cannot
show one.

**RESOLVED 2026-08-10: Tom changed the post to "Save as".** The app is correct as it stands and
needs no change; the app-side follow-up (Task 272) was dropped rather than left open.

### A2. The tab strip's `+` button starts a project with accidental units
*Not stated in the guide — found while auditing New User step 1.*

`renderTabs()` binds `+` to `newProject()` directly. `newProject()` inherits `settings` from
whatever project was open and **never touches the units**, so the new project silently adopts
whichever unit system happened to be on the strip. That is precisely the accident Task 264 removed
from File > New project, where every row now commits to `us` or `si` before anything is drawn.

A user following New User step 1 ("set everything to your preferences") and then making their next
project with `+` gets units decided by accident, in a page where CLAUDE.md says a bare number is
meaningless without them.

**FIXED 2026-08-10** (Task 273): `+` now calls `openNewProjectMenu()`, the same chooser File > New
opens. When Task 271 turns that chooser into a units-and-method wizard, both doors inherit it.

### A3. The friction method cannot be set, so "set everything to your preferences" is not possible
*New User, step 1.*

`frictionMethod()` returns `settings.method || 'hw'` and **no control writes `settings.method`** —
the solver implements all three, the map status strip reports the choice, and nothing can change it.
A template project therefore cannot carry a Manning or Darcy-Weisbach preference, which is the one
preference most likely to differ by country.

Already known and open: **ROADMAP Task 271**. Noted here only because it is the largest hole in New
User step 1 as written, and the post promises completeness ("set *everything*").

---

## B. Mismatches where the POST is wrong

### B1. RETRACTED — the post was right and this audit was wrong
*Was: "Scale, Move, or Remove the Background image — the app says Position."*

**Tom caught this, 2026-08-10, and he is correct.** The shipped English is
`lpn_backdrop_scale`=**'Set image scale'**, `lpn_backdrop_position`=**'Move image'**,
`lpn_backdrop_remove`=**'Remove image'**. The post's "Scale, Move, or Remove" matches the app in
both verbs. There is no mismatch and nothing to change on either side.

**How the error was made, because it is a repeatable one:** I read the *fallback literals* in
`js/looped-network.js` (`pc.lpn_backdrop_position || 'Position'`) instead of the values in
`lib/lang.ec.en.php`. A fallback is what renders only when pageConfig is missing the key — it is a
guess written at the call site, not the shipped string. **Every user-facing label claim must be read
out of the lang file.** All 16 other labels asserted in this report were re-checked against
`lang.ec.en.php` after this was found; the backdrop pair were the only two where fallback and
shipped value disagree, which is exactly why nothing else caught it.

### B2. "Use File, Open to open an example project" has a better route since Task 264
*New Shopper, step 1.*

File > New project > *From examples* > **Basic network, US units (gpm)** / **SI units (l/s)** draws
an example with one click and no download. The post's download-and-open path still works (File >
Open is live in every browser, with an explanation dialog where there is no File System Access API),
so this is an omission rather than an error — but it sends a first-time shopper through a
right-click-save-download-open detour to reach something now two clicks away.

Also worth stating in the post: **the file extension is `.json`** (`fileTypes()`), and each example
commits to its own unit system rather than adapting to the reader's.

### B3. "Undo history depth is ???????????????"
*New Shopper. Tom left the number open.*

**20 steps.** `UNDO_LIMIT = 20` in `js/looped-network.js`; `saveUndoSnapshot()` shifts the oldest off
beyond that. Two further facts the post should carry, because both surprise people:

- **In memory only** — not written to localStorage. Reloading the page loses the whole stack.
- **Switching projects clears it** (`clearUndo()`), because a snapshot of one project's document
  cannot be applied to another's.

**And the third fact, which Tom asked me to reword and which is worse than the way I first put it:
moving something cannot be undone at all.** Not "a drag is not a snapshot" — *nothing* takes a
snapshot when you drag. `saveUndoSnapshot()` is called by the discrete acts (add, delete, add/remove
vertex, rename, edit a property, double-click a label home, draw the example) and by **no drag
handler**: not node drags, not vertex drags, not Text-label drags, not data-label drags. The
`dragDirty` flag near them is a render throttle, not an undo hook.

So Undo does not "step past" a drag — it steps back to the state before the last *discrete* act,
silently discarding every move made since. Drag a node, then Undo: the node stays where you dragged
it, and something else you did earlier comes back instead. That is a defect, not a documentation
gap; filed as **ROADMAP Task 277**. Until it is fixed, the post should not imply Undo covers moves.

### B4. DOWNGRADED — "Use Delete and Undo as desired" states nothing false
*New Shopper.*

**Tom's pushback is right** (2026-08-10: *"the post doesn't say it's a mode; what do you want
fixed?"*). Nothing needed fixing. The post makes no claim about how either command is invoked, so
there was no mismatch to report — this was an optional addition dressed as a finding, which is the
wrong thing to put in a mismatch report.

Kept only as a fact worth having: Delete *is* a mode (`setMode('delete')` — click the tool, then
click elements, click again or Select to leave), there is no keyboard Delete binding, and the
selection model is single-element (ROADMAP Task 266).

**Ctrl+Z was a real omission and Tom has added it to the post.**

### B5. "Use Settings to change Map appearance settings including the size of Labels"
*New Shopper.*

Correct in substance — **Map appearance** is the real section name (`lpn_settings_map_display`), and
it holds the size control. But the control is called **Text size**, not Label size, and it governs
map data labels *and* Text elements together. Worth naming exactly, since the post is a checklist
someone reads while looking at the panel.

Everything else in this bullet checks out: **ID prefixes** and **Starting values** are the exact
section names (New Project step 3), and backdrop opacity really is under Map appearance (New Project
step 2).

### B6. "Text can associate by leader with a node" — only at creation
*New Shopper.*

True, and automatic: a tap within `NODE_SNAP_PX` of a node anchors the new Text to it, and the label
then drags with the node and grows a leader. But **there is no way to anchor or unanchor an existing
Text** — `openLabelPopup()` offers Text / Size / X / Y and no anchor control. If you place it in the
wrong spot, the fix is to delete it and place it again.

**Post fix** (state that it happens on placement), or an app feature if Tom wants one.

### B7. "Prepare a project background image screenshot… Save it as a PNG file"
*New Project, step 1.*

The file input is `accept="image/*"`, so JPEG, WebP and GIF all work; the image is stored as a data
URI either way. PNG is good advice for a screenshot, but the post reads as a requirement.

---

## C. Verified as written — no action

- Move labels by dragging; **double-click sends a dragged label home**.
- **Double-click adds and removes pipe vertices**; drag moves nodes and vertices; click opens an
  element's property popup.
- Select is the default mode; every add tool **toggles back to Select** when clicked again.
- Labels is on **both** the toolbar and the View menu, and its popover carries **"Mark highest and
  lowest values"** as the post says.
- Settings holds **Map appearance** and the label/text size; **ID prefixes** and **Starting values**
  are named exactly as the post names them.
- Reservoir / Junction / Text place one per click until the mode ends; Pump / Pipe take a start node
  then an end node, with a rubber-band line between the two clicks.
- **The solve updates as you work**, and the EPANET engine toggle exists (Settings > Computation).
- Background image really is reachable from **both** its toolbar selector and the Insert menu.
- Renaming a project's tab (New User step 2) works from the current tab's ▾ menu. On a *file*
  project that row is labelled **Save as…**, because a file project's name and its file's name are
  one name — consistent, but not what "Rename this project's tab" leads a reader to expect.

## D. Adjacent facts a reader will ask about

- **Everything in the Settings panel and the Labels popover is saved with the project**, along with
  the units and the backdrop (`serializeProject()`). So New User's template flow really does carry
  the whole preference set, which is what makes steps 1–3 worth doing.
- **The map viewport is not** — zoom and pan are re-fitted on load rather than restored. Deliberate,
  and probably right, but a template cannot carry a view.
- **Closing a browser-only project deletes it** (`discardProject()` removes its localStorage key);
  the close prompt says so. A closed FILE project is still reopenable from File > Recent files,
  which `discardProject()` never touches. **Tom ruled 2026-08-10 that this is finished as it
  stands** — *"All I wanted was the ability to open a file from my PC again. So let's forget the
  whole thing and call this feature good for now."* Do not propose a recently-closed / reopen-tab
  feature; it was considered and declined.
- **Screenshots still include the mode hint and coordinate readout** (New Project step 6). ROADMAP
  Task 253 is the clean-map toggle that fixes this; it is not built.

---

## E. Audit corrections (2026-08-10, after Tom's review)

Recorded so the score of this report is honest and the method improves:

- **B1 was wrong** — I quoted JS fallback literals instead of shipped `$ec_lang` values. The post
  was correct. Retracted above, with the method fix: label claims come from the lang file.
- **B4 was not a finding** — the post stated nothing false; I reported an optional addition as a
  mismatch.
- **B3 was understated** — moving is not undoable *at all*, which is a defect (Task 277), not a
  wording nuance.
- **A1 and A2 are closed** — post edited to "Save as"; the `+` button now opens the chooser.
- **The units line Tom expected on the example projects was genuinely missing.** He was not
  misunderstanding the app; `drawExampleNetwork()` drew two title lines and no unit system. Added.

Net: of 10 findings, 1 retracted, 1 downgraded, 1 strengthened into a defect, 2 fixed, and the rest
stand.
