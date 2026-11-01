# Convert as and the coordinate-system chooser: movable, resizable boxes (round 11b)

Tom, 2026-10-31: Convert as "is not draggable or resizeable, and I see no good reason why not";
"the second divider is not draggable". Of the chooser: "the last 'row' doesn't have a draggable
divider", and it too is "not draggable or resizeable".

## How boxes move and size today

- **One drag seam, `makePanelDraggable(box, onMove)`.** A press on the box's own padding (the
  40 px title band, which is `pointer-events: none`) drags it; `dragBounds()` lets it hang off an
  edge. It registers the box in the z-order (`lpnPanels`, band 1200-1799, raise on press and on
  open), adds `.lpn-dragpanel` (`touch-action: none`, so a finger drags it), the narrow-box stack
  observer, and a touch resize grip when the box's CSS says `resize: both`.
- **Size is `resize: both` + `overflow: hidden`**, the body a flex child that scrolls
  (`.lpn-findbox`, `.lpn-propbox`, `.lpn-setbox`). The grip is the touch half.
- **On a phone every standing box opens through `placePanelForScreen()`, which fills the window**
  (Tom, 2026-09-01) and remembers nothing measured there. `panel-fill-harness.js` counts every
  draggable panel against that seam or a declared exemption.
- **Memory:** the standing boxes (Settings, Find, Libraries, reports, Fire flow ...) keep corner and
  size in their own `localStorage` key. The Properties box, an answer to a click, keeps its dragged
  corner and size **in memory for the page only** (`popupUserPos`, `popupUserSize`). Not every box
  remembers: New project, the area hint and the wizard bars do not store anything.

## How the two boxes are built today

Neither uses `openDialog()` (`#lpn_dialog`, the page's one modal question box, with a backdrop).
Both are static panels in Looped-Network.php, shown by their own openers (`openConvertAsBox`,
`openCrsBox`), centred, capped to the viewport, raised by `raisePanel()`, and **already not modal**:
the map and the tabs behind stay live (Convert as already re-asks if the tab changed under it).
They were simply never passed through `makePanelDraggable()` and carry no `resize`.

## The plan: the existing machinery, nothing new

1. **Not modal**, as now. `openDialog()` is untouched, so no prose dialog or confirmation changes.
2. **One helper, `wireFloatBox(box)`**, called once from each box's wiring: `makePanelDraggable`,
   the touch grip, a page-session memory, and double-click on the title band to put it back.
   CSS gives both boxes the Find box's shell: `display: flex; flex-direction: column; resize: both;
   overflow: hidden`, the body `flex: 1 1 auto; min-height: 0`, Convert as's OK/Cancel footer a
   fixed flex item (so it is always in view without the old footer arithmetic). The 40 rem cap
   moves from the inline style into CSS; once open, the box's width is fixed at what it opened
   at so a drag of its corner can make it wider than 40 rem.
3. **Placement goes through `placePanelForScreen()`**: on a PC, centred under the chrome (or where
   it was last left this session); **on a phone it fills the window**, like every standing box,
   and can still be dragged by its title and sized by the grip.
4. **Remembered: corner and size, for the life of the page only, on a PC only** (the Properties
   box's rule). **No new `localStorage` key**: not every box stores one, these are question boxes
   opened now and then, and Tom must be told of any new storage.
5. **Stacking, Esc and focus.** The chooser opened from Convert as (or New project) is raised above
   it by the existing z-order; a press on either brings that one forward. Esc in the chooser
   closes only the chooser (it stops there), and the focus goes back to the button that opened it
   (Convert as's `...`); a second Esc then closes Convert as. Both boxes are also kept wholly on
   screen when the window changes size (`keepFloatsOnScreen`).
6. **Dividers.** The three Label dividers in Convert as already drag. "The second divider" is the
   line between Round to and Suffix in each rounding row; it becomes a draggable divider of its
   own (the sheet's `.lpn-gsplit` look, pointer and keyboard, double-click resets), moving only that
   line; its place rides in the existing `lpn_gcols` record (window furniture, no new key). The
   chooser's Name row is a one-row run, and the sheet draws a divider only on runs of two or more
   (`gridHeadersSync`). A host marked `lpn-gsplit-all` now gets one on a one-row run too; both
   boxes are marked. `gridFitNow`'s API and the `lpn-sheet` CSS are unchanged.

## Other dialogs this affects

None of `openDialog()`'s callers. `gridHeadersSync()` changes only for a host carrying the new
class, so no other box's dividers change. New project (another agent's territory this round) is
not made movable here; it would be the same three lines through `wireFloatBox()`.
