# The phone interaction model on the map page

*A review, 2026-09-01, asked for by Tom: "do a final review of all the hacks that have been stacked
onto the phone UX to ensure that they make some sort of elegant sense instead of being a mess."*

**The short answer: it is not a mess.** There is one model underneath, it is consistent, and almost
every piece traces to a defect Tom reported personally. What it had instead of mess was **four
guards that a person had to remember to add to the next handler**, and those were what would rot.
The saving here is unification, not deletion — a review that came looking for things to throw away
found very little that is not load-bearing, and says so rather than inventing a cull.

**Items 1–5 of the worklist below shipped under ROADMAP Task 562**, together with the precedence
rule Tom ruled on the same day; the table of numbers and the list of departures have been rewritten
to say what the code does now rather than what it did when the review was written. Item 6 stays
deliberately undone and item 7 is still open.

---

## The model, in plain language

1. **A finger and a mouse are told apart at the moment of the press, from the press itself** — never
   from how wide the screen is. A touchscreen laptop has a finger; a phone with a stylus does not.
2. **A finger gets a more forgiving number in exactly two ways:** how far from a thing a press may
   land and still mean it, and how far a press may slide and still count as a tap rather than a drag.
3. **The first of those is ONE number, and it applies to every object and every question.** A grab,
   a tap, a snap-on-create, a Text anchor and a path handle all measure with it, whether the thing
   is a node, a label, a pipe or a route handle. It is the knob a report of *too hard to pan* or
   *too hard to drag* moves, and moving it needs no per-object judgement.
4. **A node outranks a link, because a node is hardest to aim at.** On touch, a node within reach
   wins even where the browser confidently answered with the pipe. It does not outrank another node,
   a label, or a vertex handle — each of those is either already resolved or is what the user aimed
   at.
5. **Nothing done for the finger changes anything for the mouse.** Every touch rule is reached only
   on a touch press; the desktop paths are untouched by construction. The precedence in rule 4 is
   the sharpest case: a mouse can see it is on the pipe and correct by three pixels, so it does not
   get it.
6. **Where a finger has no affordance at all, we build one.** The browser's own resize corner
   answers a mouse only, so the boxes carry a real grabber where a coarse pointer exists. That is a
   question about the device, not the window.
7. **What is hidden and what shrinks is a question about the window**, and it is asked once, at one
   width. Layout narrows; behaviour does not change with width.
8. **A box is capped to the room it actually has**, and the overflow goes inside its own scrolling
   area — never off the bottom of the screen, taking its resize grip with it.
9. **A touchscreen fires a phantom mouse click a moment after a tap.** Anything that appears under
   the finger ignores that click for what is left of the window, or it opens something nobody asked
   for. The box works that out from the press; no caller sets a flag.

Rules 1–5 are the interesting part and the code holds them well. Rules 6–9 are housekeeping.

## Where the code departs from it

- **Rule 3 is gone, and rule 2 with it.** Tom, 2026-09-01, closing the whole family: *"Match nodes
  so that we have fewer numbers... There is no reason why the number can't apply across the board to
  labels and pipes also."* There is now one finger number, `TOUCH_REACH_PX = 24`, and one pointer
  number, `POINTER_REACH_PX = 14`, and the finger's governs every object and every question a press
  can ask. The asymmetry rule 3 described — a grab gets the stingy number because only a grab has a
  rival — was true and is superseded: Tom has reported *too hard to drag* and *too hard to get
  nodes* and has never reported *too hard to pan*, so the family collapsed UP. The path handle's
  contradiction dissolved with it; it reads the same accessor everything else reads.
- **What replaced it is a PRECEDENCE, not a number.** *"Nodes need to get precedence always, because
  they are hardest to aim at."* On touch, a node within reach outranks a link, a link label and bare
  map. It does **not** outrank another node, a label of any kind (a node's own data label is drawn a
  few pixels away and is always inside the reach) or a vertex handle. That reverses the constraint
  the touch fallback shipped under — *"it can add a hit, never overrule one"* — and both call sites
  say so where the old sentence used to stand.
- **The pointer deliberately does not get that precedence**, which is the one place the two hands
  now differ in kind rather than in degree. A mouse has a visible cursor, a hover readout and
  sub-pixel aim: it can see it is on the pipe and move three pixels. Giving it the same rule would
  make every pipe within 14 px of a junction unclickable on the desktop, for a defect nobody has
  reported there.
- **Rule 3's backwards case is still there and is still fine.** With the pipe or junction tool active, a finger's
  generous radius decides whether you are *reusing* an existing junction or *creating* a new one.
  There a miss is not free — it silently gives you an existing node where you asked for a new one.
  The code argues this is safe (the alternative was the tap doing nothing at all) and that argument
  is reasonable, but it is the same rule pointed the other way and it deserves to be written beside
  the rule rather than three hundred lines away.
- **Rule 1 is stated once and answered five different ways** across the two files: the press itself,
  two different "can this thing hover" queries, one "is the window narrow" query in JavaScript, and
  three more in the stylesheet. Most of those are unavoidable — a stylesheet cannot ask what kind of
  press is happening — but nothing anywhere lists them, so there is no way to see that they agree.
- **Rule 9 used to be a flag set at one of the three doors a box can open through**, and the other
  two — the junction tool landing on an existing junction, and a tap on a node's own data label —
  set nothing. That is fixed: the map records what kind of press it was, once, and the function that
  opens the box works out how much of the window is left. A fourth door is shielded the day it is
  written.

---

## The numbers

There are three distances in play, where there were five.

| What it answers | Mouse | Finger | Where |
|---|---|---|---|
| **How near a press may land and still mean the thing** — grab, tap, snap-on-create, anchor-a-Text, path handle, every object | 14 | 24 | `POINTER_REACH_PX` / `TOUCH_REACH_PX`, read through `reachPx(e)`. **THE knob**: a report of *too hard to pan* moves the finger's down, *too hard to drag* moves it up, and there is no per-object judgement in between. |
| How far a press may travel and still be a tap | 4 | 10 | `TAP_MOVE_PX` / `TAP_MOVE_TOUCH_PX`. A travel, not a distance from a thing — deliberately not folded in. |
| The tolerance on "is the browser's own hit answer believable" | 2 | 2 | `HIT_SLOP_PX`. **Not a touch number at all**, and its declaration now says so. A guard against rounding in the drawing; a finger never sees it. |
| Where the box's corner stops being a drag handle | 18 | 28 | Two numbers in two languages, still unconnected. The one item on the original list that was not worth the churn. |

The two that went were the grab radius (folded into the one knob) and the path handle's own reading
of the finger's number (the flat contradiction, gone by construction). The timings — the long press,
the phantom-click window, the menu close delay — are unrelated to each other and to these; two of
them happen to be the same number, which means nothing.

---

## Ranked worklist

Cheapest and most valuable first. Every one of these removes something a person must remember.

| # | Do this | State |
|---|---|---|
| 1 | Give the drag-grab radius its own named accessor, and make the path handle either use it or say why not | **Done differently, and better** (Task 562). Tom deleted the family instead: one `TOUCH_REACH_PX`, one `POINTER_REACH_PX`, one `reachPx(e)`, and the path handle reads it like everything else. `dev/lpn-spike/touch-radius-harness.js` §0 reads the file back and fails on a third reach constant or on a finder handed a number of its own. |
| 2 | Decide the phantom-click shield **inside** the one function that opens the box, from the press that opened it | **Done.** The map records the press once; `ghostClickShield()` sizes the shield to what is LEFT of the window, so the synchronous node popup, the two 300 ms debounced ones and the add-junction door all get the right answer with no flag to set. |
| 3 | One "hide this box" function that hides it and dismisses its tooltips | **Done.** `hidePanel()`. Twelve closers, six of which swept and six of which did not; all twelve now go through it. `panel-touch-harness.js` §2 fails on any other `display = 'none'` that is not a declared non-panel, and §3 runs the sweep rather than grepping for it. |
| 4 | Make a box draggable and touch-draggable in the same place | **Done.** `makePanelDraggable()` adds `.lpn-dragpanel`; the stylesheet targets the class. Find and the two fire-flow boxes were draggable by mouse only, and the CSS comment named *Find* while its selector named *Library* — both fixed. **Wants one phone check** (below). |
| 5 | Add the touch resize grip from the box's class rather than at each box | Not done. Three call sites, all correct today; the cheapest remaining item. |
| 6 | Merge the map's two press listeners and two release listeners into one of each | **Deliberately not done**, and named in Task 562 so it is not re-derived. Structurally the best of the seven and about a day — not worth that much risk on the most-used code path for a platform Tom calls a novelty. |
| 7 | Write the list of "how we ask what kind of device this is" in one place | Not done. Five answers, no index. |

**Nothing on this list is a phone feature. Every one is a way of not needing to remember something**,
which is the trade Tom's own instinct points at: the phone is a novelty, so the phone code should
cost as little future attention as possible.

## What I would delete

**Almost nothing, and that is the finding.** Every touch behaviour on this page traces to a defect
Tom reported and can be named by the sentence he reported it in. The one thing I would happily lose
is the *idea* that these are eight separate hacks: items 1–5 above collapse four hand-maintained
guards into three seams, and after that there is less code than there is now.

If a cull is wanted anyway, the honest candidates are cosmetic and small — the narrowed number
columns on a touch keyboard, and the second copy of the symbology spacing rule. Both were asked for
explicitly, and neither is where the complexity actually lives. Removing them buys tidiness, not
simplicity.

## What is not established

- **Whether the phantom-click theory is right at all.** The fix is reasoned, not reproduced — no
  headless test can emit a phantom click, so what is guarded is the shield, not the defect. If the
  node editor still opens with its pattern list showing, the theory is wrong and the shield should
  come out rather than be tuned.
- **Whether the Find box and the two fire-flow boxes can now actually be dragged by a finger.** They
  were missing the stylesheet half; they have it now, through the class rather than an id list. The
  fix is reasoned and asserted in both halves, but no headless test can start a real touch drag.
- **Whether 24 px is the right single number.** It is the number that already existed for a tap, and
  collapsing UP to it is the direction Tom's reports point. What it costs is panning: a press within
  24 px of any node now grabs that node instead of starting a pan, where the cutoff used to be 14.
  Nobody has used it on a phone yet. **This is precisely the knob his ruling describes** — if a pan
  is hard to start in a dense part of a network, one line moves.
- **Whether the generous snap while drawing ever puts a junction in the wrong place.** Reasoned safe,
  never observed either way.
- **Whether the long-press-to-edit request is finished.** The record argues the want dissolves now
  that a finger can grab a node, and Tom could not reconstruct why he had asked. That is his call to
  close, not a code question.
