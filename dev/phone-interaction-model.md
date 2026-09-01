# The phone interaction model on the map page

*A review, 2026-09-01, asked for by Tom: "do a final review of all the hacks that have been stacked
onto the phone UX to ensure that they make some sort of elegant sense instead of being a mess."*

**The short answer: it is not a mess.** There is one model underneath, it is consistent, and almost
every piece traces to a defect Tom reported personally. What it has instead of mess is **four guards
that a person has to remember to add to the next handler**, and those are what will rot. The saving
here is unification, not deletion — a review that came looking for things to throw away found very
little that is not load-bearing, and says so rather than inventing a cull.

---

## The model, in plain language

1. **A finger and a mouse are told apart at the moment of the press, from the press itself** — never
   from how wide the screen is. A touchscreen laptop has a finger; a phone with a stylus does not.
2. **A finger gets a more forgiving number in exactly two ways:** how far from a thing a press may
   land and still mean it, and how far a press may slide and still count as a tap rather than a drag.
3. **It gets that forgiveness only where a miss is free.** Tapping empty map does nothing, so a
   generous tap costs nothing. *Pressing* empty map pans the drawing, so a generous grab costs
   panning — and there the finger gets the mouse's stingy number. This is the one asymmetry in the
   whole design and it is the right one.
4. **Nothing done for the finger changes anything for the mouse.** Every touch rule is reached only
   on a touch press; the desktop paths are untouched by construction.
5. **Where a finger has no affordance at all, we build one.** The browser's own resize corner
   answers a mouse only, so the boxes carry a real grabber where a coarse pointer exists. That is a
   question about the device, not the window.
6. **What is hidden and what shrinks is a question about the window**, and it is asked once, at one
   width. Layout narrows; behaviour does not change with width.
7. **A box is capped to the room it actually has**, and the overflow goes inside its own scrolling
   area — never off the bottom of the screen, taking its resize grip with it.
8. **A touchscreen fires a phantom mouse click a moment after a tap.** Anything that appears under
   the finger must ignore that click briefly, or it opens something nobody asked for.

Rules 1–4 are the interesting part and the code holds them well. Rules 5–8 are housekeeping.

## Where the code departs from it

- **Rule 3 has exactly one violator, and nobody has named it.** In path-edit mode a press grabs a
  route handle at the *finger's* generous radius, not the mouse's stingy one — the same press,
  against the same rival (a pan), decided the opposite way from a node grab. Either it should match
  the node rule, or the handle is a deliberate exception and should say why. Currently it is silent,
  which means the next reader will copy whichever one they happen to open first.
- **Rule 3 also runs backwards while drawing.** With the pipe or junction tool active, a finger's
  generous radius decides whether you are *reusing* an existing junction or *creating* a new one.
  There a miss is not free — it silently gives you an existing node where you asked for a new one.
  The code argues this is safe (the alternative was the tap doing nothing at all) and that argument
  is reasonable, but it is the same rule pointed the other way and it deserves to be written beside
  the rule rather than three hundred lines away.
- **Rule 1 is stated once and answered five different ways** across the two files: the press itself,
  two different "can this thing hover" queries, one "is the window narrow" query in JavaScript, and
  three more in the stylesheet. Most of those are unavoidable — a stylesheet cannot ask what kind of
  press is happening — but nothing anywhere lists them, so there is no way to see that they agree.
- **Rule 8's flag is set at one of the three places a box can open under a finger.** A tap that
  lands on a junction sets it. A tap with the junction tool that lands on an existing junction opens
  the same box the same way and does not. That is not a judgement call that was made; it is a line
  somebody had to remember, at a second door written months earlier.

---

## The numbers

There are five distances in play. They are **not** five versions of one number:

| What it answers | Mouse | Finger | Verdict |
|---|---|---|---|
| How near a tap may be and still mean the thing | 14 | 24 | Both stay. Different hands. |
| How near a *press* may be to grab and drag | 14 | 14 | Same value today, different question. **Keep it named separately** — it is a feel that will be re-tuned, and folding it in would delete the argument with it. |
| How far a press may travel and still be a tap | 4 | 10 | Both stay. A travel, not a distance. |
| The tolerance on "is the browser's own hit answer believable" | 2 | 2 | **Not a touch number at all** and should stop being listed as one. It is a guard against rounding in the drawing, and a finger never sees it. |
| Where the box's corner stops being a drag handle | 18 | 28 | Two numbers, in two languages, with nothing connecting them. Harmless, but the pair is the sort that drifts. |

So: **nothing here is deletable as a duplicate.** The grab radius is the only candidate and its own
argument for existing is sound. The timings (the long press, the phantom-click window, the menu
close delay) are unrelated to each other and to these; two of them happen to be the same number,
which means nothing.

---

## Ranked worklist

Cheapest and most valuable first. Every one of these removes something a person must remember.

| # | Do this | Why it earns its place | Cost |
|---|---|---|---|
| 1 | Give the drag-grab radius its own named accessor, the way the tap radius has one, and make the path handle either use it or say why not | Turns the one unnamed contradiction into a visible choice; the next handler written cannot pick the wrong one by accident | An hour; one behaviour question for Tom to rule on |
| 2 | Decide the phantom-click shield **inside** the one function that opens the box, from the press that opened it | Closes the second door nobody remembered, and there can never be a third | An hour; no behaviour change on the path that already works |
| 3 | One "hide this box" function that hides it, dismisses its tooltips and drops its shield | The tooltip cleanup is currently hand-added to six closers and absent from six others; a tooltip stranded over the map with nothing to dismiss it was Tom's own report | Half a day; touches many closers, each trivially |
| 4 | Make a box draggable and touch-draggable in the same place | Three boxes are made draggable by script but only three (a different three) are told in the stylesheet to let a finger drag them. The stylesheet's own comment names a box that is not in its own list | An hour, plus one phone check |
| 5 | Add the touch resize grip from the box's class rather than at each box | Third box added remembered; a fourth would not | An hour |
| 6 | Merge the map's two press listeners and two release listeners into one of each | They already share a flag across the gap, and the last defect Tom reported was the two halves of one press disagreeing about what a press is. This is the structural version of that fix | A day, and the riskiest item here — it is the most-used code path on the page |
| 7 | Write the list of "how we ask what kind of device this is" in one place | Five answers, no index | An hour |

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
- **Whether the Find box and the fire-flow box can actually be dragged by a finger.** They are made
  draggable by script and are missing the stylesheet half that lets a finger start a drag. That may
  or may not matter in a real browser; it was not tested.
- **Whether the generous snap while drawing ever puts a junction in the wrong place.** Reasoned safe,
  never observed either way.
- **Whether the long-press-to-edit request is finished.** The record argues the want dissolves now
  that a finger can grab a node, and Tom could not reconstruct why he had asked. That is his call to
  close, not a code question.
