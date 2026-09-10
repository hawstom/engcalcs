# The three bars after the divorce — menu bar, toolbar, tab strip

Ida (interface-designer), 2026-09-10. Answers Task 625's two items Tom routed to me by name, plus
the three follow-on questions in the same brief. **DIAGNOSE AND RANK, not redesign** — nothing here
is a patch; every number is either read from the shipped tree (OBSERVED, `path:line`) or measured by
rendering it with Chromium through `dev/browser-pass/lib/env.js` (marked MEASURED, script kept at
`/tmp/.../scratchpad/measure_widths2.js`, not committed — a throwaway probe, not a new harness). No
shipped file touched.

**Baseline this builds on:** `dev/chrome-audit.md` (2026-09-10, mine) already measured the four-bar
page at four viewports and found the menu bar 32px tall, the toolbar 36px, a 4px gap between them —
merging the two rows recovers "roughly 36–40px" and was ranked #4 of 5, below the title-block fixes
that Task 625 has now acted on directly. This document narrows to the three bars that remain and
answers with real content-width numbers that audit did not yet have.

---

## A. Menus and toolbar on one row — MEASURED, and the answer is: not as a blanket merge

**The two bars are different KINDS of control, and that is the real question under the pixel one.**
A menu bar is a **command surface**: press a word, something happens once (Save, Undo, Zoom to fit).
A toolbar here is mostly a **mode selector**: press an icon, the canvas's *next click* means
something different until you press another one (Insert Junction, Select, Vertices). Merging them
into one undifferentiated row erases that distinction visually — a row of "things that fire" sitting
flush against "things that stay pressed" reads as one class of control when it is two, and the
`aria-pressed` state (`css/engcalcs.css:1223`) that shows a tool is armed has nothing analogous on
the menu side to keep them apart once they share a background band.

**The pixel case, measured, not estimated:**

| | ink width (content, not the stretched row) |
|---|---:|
| Menu bar (File/Edit/Map/Water/Help) | **401 px** |
| Toolbar, 7 groups / 22 buttons | **1,260 px** |
| **Combined, one row** | **≈1,660 px** (+ inter-row padding, unmeasured, call it 1,680–1,700) |

MEASURED at 1920×1080 (`#lpn_toolbar .lpn-toolbar-group` widths summed with their 12px gaps,
`css/engcalcs.css:1249`; menu bar's five direct children summed). The toolbar's own `contentWidth`
looked identical to its row width at every viewport in a first pass — that is `.lpn-toolbar-end`'s
`margin-left: auto` (`css/engcalcs.css:1257`) pushing the last group to the far edge, not the buttons
actually filling the row; the ink number above is the real, un-stretched total.

Set against the three widths this suite already treats as reference points (`dev/chrome-audit.md`'s
own viewport list):

| Viewport | Row width available | 1,660 px fits? |
|---|---:|---|
| 1920×1080 | 1,918 px | Yes, ~260 px to spare |
| 1440×900 | 1,438 px | **No** — 220 px short |
| 1366×768 | 1,364 px | **No** — 296 px short |

**So Tom's own qualifier was exactly right and is the whole answer: "if you are talking about a
single row on a wide screen, I agree."** A literal merge is comfortable above roughly 1,750–1,800px
and **breaks by measurement, not by guess, at both 1440 and 1366** — two viewports this project
already treats as real reference points, not edge cases. Adding the Language item (§B) costs another
~80–100px of menu-bar ink, tightening the 1920 margin further.

**Recommendation: do not build a single always-merged row.** Two better shapes, ranked:

1. **Visually unify without merging DOM: same background, zero gap, a hairline divider instead of a
   4px seam.** This buys nearly all of the "it reads as one instrument" benefit (which is what
   actually serves Tom's stated goal in §C — see below) for **0 px of width risk**, because it changes
   paint, not layout. Recovers none of the 36–40px height (chrome-audit's #4 finding stands as a
   separate, small, low-risk win: cheap, but marginal).
2. **A responsive merge gated on measured width, matching the pattern `max-width: 640px` already
   sets** — one row above a breakpoint chosen from the numbers here (something north of ~1750px,
   which is close to nobody's laptop and most people's external monitor), unmerged below it. This is
   the only way to have both: it does not fight the phone rule (`css/engcalcs.css:3155`, the 640px
   collapse untouched, both rows still exist as two DOM nodes) and it does not invert the "toolbar is
   the hog" rule your brief protects — it is the mirror of that rule at the *wide* end rather than a
   contradiction of it. Real but modest cost: a second breakpoint to test and to keep honest as
   button counts change (22 today; §B and §C both propose adding to one bar or the other).

**Do not do it as a means of driving people to the menu bar (§C's goal) at the cost of DOM identity**
— that is a separate argument from the pixel one and is made below.

---

## B. Languages on the menu bar — last position, right of Help, same widget the suite already has

**Where:** as the LAST top-level item, to the right of Help. This is not an arbitrary slot — it
matches the convention this exact page's ecosystem already set and that a reader may have seen once
already: the suite navbar puts Help "ahead of the language picker" (OBSERVED comment,
`lib/Menus.lib.php:192`, "HELP sits in the right-hand strip, ahead of the language picker (Task
298)"). Putting a language item at the trailing end of the menu bar, after Help, reuses a pattern
this project already decided rather than inventing a new order.

**What it looks like at 27 languages:** the exact same widget the navbar uses today — no new
component. OBSERVED, `lib/Menus.lib.php:242`: one row per `$GLOBALS['all_language_settings']`,
each showing that language's own name in its own script ("Deutsch", "العربية", "中文"), no grouping,
no search box, no truncation logic to design. `js/looped-network.js`'s menu system already has a
flyout submenu exactly this shape (`iconGuideRows()` at `js/looped-network.js:22069`, `reportMenuRows`
elsewhere) — a top-level `{ label: 'Language', submenu: languageRows }` costs nothing new
mechanically, just 27 rows of native-script text pulled from the same `all_language_settings` global
the navbar already reads. **27 rows in a flyout is not a design problem here**: it is a scrollable
list on a pointer-first surface, same shape as any OS "choose your keyboard language" menu, and this
page's own menu popovers already scroll when tall (OBSERVED pattern, no new CSS needed).

**Icon:** reuse the globe (`ecIcon('globe')`, `lib/Menus.lib.php:216`) so a reader who has seen the
navbar's picker once recognizes the glyph cold. At the 640px breakpoint this collapses to icon-only
exactly as every other menu-bar item already does (Task 486's mechanism, `js/looped-network.js`
comment above `buildMenuBar()`'s label-in-its-own-node trick) — no new phone work.

**Does this fix the "two of three testers never found the menu bar" finding?** Only partly, and I
want to be plain about the size of the win rather than oversell it. Moving Language onto the menu bar
does not, by itself, put anyone's eyes on the menu bar who was not already looking there — a reader
who never scans that row will not discover Language there either, which is the same failure mode PCW
and MJH already demonstrated on File/Edit/Map/Water/Help. What it DOES buy: **a wanted, high-value
destination now lives nowhere else**, so the population of people who go looking for it (arriving in
a language other than their own, or wanting to switch) are forced through the one row that most needs
traffic, rather than through the dying suite navbar's picker. It is a real but secondary win — a
side-effect of consolidation, not a discoverability fix on its own. Treat §E for the thing that
actually addresses discoverability.

---

## C. Transport on the menu bar — the premise needs correcting first, then the answer is no

**Correction of the framing, OBSERVED:** transport is not "in the bottom pane" today — it already
left there. `js/looped-network.js:23270-23336` (the `netGroup`/`runGroup` build, "the three transport
buttons and the two time selectors" mounted via `EngCalcs.lpnTimeMountToolbar(runGroup, ...)`,
`js/lpn-time.js:1445`) puts play/pause/step and the two time `<select>`s **on the toolbar**, in their
own group, right where Settings/Run/Profile/Tables already live per Tom's own 2026-08-20 ordering.
The bottom pane's role (per CLAUDE.md's `lpn_` section) is scrubbing the RESULT TABLES to match
whatever instant the transport is showing — the transport itself, the thing with buttons to press, is
toolbar furniture already. Whatever prompted "today it lives in the bottom pane" in the brief, the
code disagrees; I'm flagging the correction so the next design conversation about it starts from the
right place.

**Given that, should it move to the menu bar?** No, and for the same reason §A gives against merging
the two rows wholesale: **transport is exactly the class of control the toolbar exists for — a
persistent, stateful, mode-like instrument (is it playing, which frame, how fast) — and the menu bar
is a fire-once command surface.** Putting Play/Pause on a `<button>` inside a pull-down menu means
either (a) the menu has to stay open while transport runs, which no menu on this page does and would
be a new interaction pattern invented for one control, or (b) pressing Play closes the menu and the
control becomes unreachable exactly while it's doing the thing you pressed it to do. Both are worse
than where it is.

**Is relocating transport the way to "drive people to the menu bar"? No — say so plainly, as asked.**
Two separate reasons:

1. **It's the wrong lever for the stated goal.** Transport is *contextual* — CLAUDE.md's own language
   — meaningless without a network that has extended-period duration; most projects opened have none,
   so on many sessions this control would not even be present to catch an eye. A control that is
   sometimes absent cannot be the thing reliably pulling attention upward.
2. **The actual failure PCW and MJH demonstrated was not "the wrong control lives at the top" — it
   was "the eye stops at the toolbar row and never continues upward to the row above it."** Moving
   one already-toolbar control higher does not change where the eye lands; it just moves the same
   kind of thing to a place it fits worse (point above). The instrument that would actually change
   where attention lands is spatial: making the menu-bar row visually continuous with the row the eye
   already stops at, which is §A's unify-without-merging recommendation — same background, no seam —
   or, above the measured width threshold, the literal merge. That is the honest fix for the stated
   goal; relocating transport is not.

**If Tom still wants something recognizable and toolbar-like inviting a press near the menu row**,
the cheaper, correctly-scoped version of his instinct is not to move the transport itself but to make
the menu bar's own rightmost items (Help, Language) read visually more like the toolbar's pressable
buttons — bordered, same height, same hover treatment — rather than plain text links. That borrows
the "recognizable as pressable" quality he's really after without relocating a stateful control into
a command surface that cannot host it.

---

## D. Help menu — revamped, keeping the ruling that the label stays exactly "Help"

**Constraint that settles the top-level name:** `dev/session-handoff.md:246`, "Help wording is 'use
Help'" — visitor-facing strings that point somewhere say simply "use Help," which only works if there
is exactly one menu called that and its label never changes. So the fourth embarrassment ("Help >
About is EngCalcs' About, not the app's") is fixed by what About *points at* and by reordering rows,
never by renaming the menu.

**What it inherits from the dying navbar, and what to do with each:**

- **About** — already a row (last, OBSERVED `js/looped-network.js:22131`, "About last, where every
  other Help menu in the world puts it"). Task 625 itself says the fix is content, not chrome:
  `About.php` needs to describe the app, not the suite, once the suite chrome is gone. That's a
  writing decision for Tom, not a layout one — flagging it here only so it isn't lost between "the
  chrome is fixed" and "the content still says EngCalcs."
- **Contact** — already absorbed. `Help > Fix something` (`js/looped-network.js:22098`) already opens
  `contact.php?from=Looped-Network`; the comment there is explicit that this REPLACES a separate
  Contact row on purpose ("two links to one destination halve each other's weight rather than
  doubling the invitation"). Nothing to add — a bare "Contact" row would be the regression the
  existing comment already warns against.
- **Install** — genuinely missing today and worth adding. The app is a PWA with its own manifest
  (`web_manifest_check.php`'s whole subject); once the suite navbar's Install.php link is gone, there
  is no route left on this page to "how do I put this on my home screen" at all. One new row,
  `Help > Install app`, opening `Install.php` in a new tab exactly like About does — same pattern,
  same cost class as the rows already there (one icon, one label, one `ext()` call).

**Proposed order** (existing rows kept in Tom's own 2026-09-06 ordering, one row inserted):

```
Walkthroughs
Notes on this page
Toolbar               ▸ (fly-out, unchanged)
────────────
Fix something
────────────
Privacy notice
Terms of use
Cookie settings
────────────
Screenshot gallery
Not EPANET
Install app            ← new
────────────
About
```

Install sits with Screenshot gallery / Not EPANET rather than nearer the top: all three are "about
the software, told from outside the task at hand" rather than "help me finish what I'm doing," which
is the same grouping logic the existing separators already draw (task-help above, meta-information
below). Not first, because a first-time visitor mid-task is not thinking about installation; not
adjacent to About, because Tom's own ordering already reserves last place for About specifically
("where every other Help menu in the world puts it") and Install is not that.

**Cost:** one new menu row, one new tab-opening call reusing the existing `ext()` closure, no new
widget, no new breakpoint behavior — the fly-out mechanism and icon-only collapse already handle an
Nth row exactly as they handle the current ones.

---

## E. If only one change — the unify-without-merging paint fix (§A, option 1)

**Same background band, zero gap, a hairline divider between menu bar and toolbar — no DOM merge, no
new breakpoint, and it is a CSS change to two existing rows.**

Why this over the others, ranked against every other candidate in this document:

- It is the only item here that touches **zero** width-risk surface — MEASURED at 1,660px of ink
  against 1,364–1,918px of available row, a literal merge is provably unsafe below ~1750px and a
  responsive merge is real but non-trivial engineering (a new breakpoint to own and re-test as
  buttons are added, per §A option 2's own caveat).
- It is the direct answer to what actually produced the finding this whole brief opens with — **the
  eye stops at the toolbar row and does not continue upward** — without asking a stateful control
  (§C) to relocate somewhere it cannot function, and without betting the wide-screen-only layout
  win (§A) before 16 September.
- It composes cleanly with B and D: neither depends on it, and both get slightly cheaper to notice
  once the two rows read as one strip rather than two.
- Reversible in minutes if it looks wrong in a real pass — it is a background-color and border rule,
  not a structural change, which matters given the stated risk (a redesign distraction before the
  16 September demonstration).

**Rank order overall:** E (unify paint) → D (Help menu, cheap and self-contained) → B (Language on
menu bar, cheap, reuses existing widget) → A-2 (responsive merge, real engineering, do after the
demo) → C (rejected as framed; the paint fix in E already carries the discoverability intent legally
available to it) → A-1-as-literal-merge (rejected outright below ~1750px, which is most of this
project's own reference viewports).
