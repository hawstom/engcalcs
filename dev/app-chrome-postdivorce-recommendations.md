# The three bars after the divorce — menu bar, toolbar, tab strip

Ida (interface-designer), 2026-09-10. Answers Task 625's two items Tom routed to me by name, plus
the three follow-on questions in the same brief. **DIAGNOSE AND RANK, not redesign** — nothing here
is a patch; every number is either read from the shipped tree (OBSERVED, `path:line`) or measured by
rendering it with Chromium through `dev/browser-pass/lib/env.js` (marked MEASURED, script kept at
`/tmp/.../scratchpad/measure_widths2.js`, not committed — a throwaway probe, not a new harness). No
shipped file touched.

**CORRECTED 2026-09-10, after Tom's ruling — see §F at the foot of this file before reading §A/§E
below as current.** He agreed with B, C, D and the fifth item on discoverability wording, but
challenged the "unify paint" recommendation: *"Do you mean just pushing them closer together?
There is no line. They already look like a set."* He was right, and the CSS proves it — the
paint is already unified (`css/engcalcs.css:1337-1338` vs `:1218-1225`, one shared hover treatment
by explicit design comment) — so §A/§E's diagnosis was answering a problem that does not exist.
§F re-diagnoses and replaces §E as "the one thing first." §A/§E are kept below, struck through in
substance rather than deleted, per this project's own correction convention.

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

## E. SUPERSEDED BY §F — kept for the record, not current advice

The "unify paint, add a hairline" recommendation below was wrong on the facts: the CSS already
unifies the two rows' paint and, by explicit design comment, deliberately withholds the raised/
bordered look specifically so the menu bar would NOT read as competing chrome. Adding a hairline
would have introduced the one visual seam the current design goes out of its way to avoid. See §F
for the re-diagnosis and the current "if only one" answer.

## E (original text, superseded) — the unify-without-merging paint fix (§A, option 1)

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

---

## F. Re-diagnosis, 2026-09-10, after Tom's ruling — what actually starves the menu bar

### A. Was my #1 in substance "delete the 4px margin"?

**No — smaller than that, and I was wrong to rank it first for a different reason: there was
nothing to build.** MEASURED/OBSERVED, `css/engcalcs.css:1336-1338` vs `:1218-1225`:

```
#lpn_menubar { display: flex; gap: 2px; margin-bottom: 4px; }
.lpn-menubar-item { background: none; border: 1px solid transparent; ...; }
.lpn-menubar-item:hover { background: #def; border-color: #9bd; }

#lpn_toolbar { ...; border-bottom: 1px solid #d6d6d6; padding-bottom: 4px; margin-bottom: 4px; }
#lpn_toolbar button:not(.lpn-transport-btn) { background: none; border: 1px solid transparent; ... }
#lpn_toolbar button:not(.lpn-transport-btn):hover { background: #def; border-color: #9bd; }
```

Identical hover colors, identical at-rest invisibility (no border, no background on either row),
and the comment directly above the menu-bar rule states the intent in words: *"Flat text buttons,
because a menu bar that looks like a row of push-buttons reads as a second toolbar"*
(`css/engcalcs.css:1260`). The ONLY rule that creates any visual break at all is the toolbar's own
`border-bottom`, which sits BELOW the toolbar — dividing it from the tab strip, not from the menu
bar above it. Between the two bars Tom asked about there is 4px of margin and nothing else. **My
#1 was not "delete a margin," it was "notice that the thing I was recommending is already true."**
There is no substance left to rank — not a small change, a non-change. Retracted, not merely
re-ranked.

### B. Would a hairline divider have cut against my own stated goal?

**Yes, directly, and I should have caught this from the CSS comment alone before proposing it.**
`css/engcalcs.css:1260`'s own words — a menu bar with borders "reads as a second toolbar" — is
exactly the outcome a hairline would produce: two visually distinct instruments where the
project's own design intent is one. A hairline does not buy anything the current no-line grouping
doesn't already have; it actively manufactures the "two rows" read Tom says he does not see and
does not want. There is no narrower case for it worth keeping — withdrawn outright, not
downgraded.

### C. The real question: if the paint is already unified, what IS pulling every eye to the toolbar?

Re-diagnosed from measured numbers rather than from the two candidates in the coordinator's
message, one of which turns out not to hold up:

**Ruled out: "menu items are invisible at rest" (`background:none; border:transparent` until
hover).** OBSERVED above — this is true of BOTH rows, in the same values, by the same design
decision. It cannot be what makes the menu bar specifically lose the contest, because the toolbar
buttons share the identical at-rest non-affordance and still win.

**Ruled out, mostly: "the menu bar is text-only."** OBSERVED, `js/looped-network.js:22440`
(`setLabel(b, m.icon, '')`) — every top-level menu item already carries an icon at desktop widths,
not just text; `.lpn-menubar-word` only disappears below the 640px breakpoint
(`css/engcalcs.css:3205`). The menu bar is icon+word, not word-only, today.

**What actually holds up, MEASURED:**

1. **Icon size.** Menu-bar icons are `.ec-icon` at its base `1.05em` (`css/engcalcs.css:249`).
   Toolbar icons are explicitly upsized to `1.35em` (`css/engcalcs.css:1225`,
   `#lpn_toolbar button .ec-icon`) — 29% larger per glyph.
2. **Icon count and density.** 5 menu-bar items (each one icon) against 22 toolbar buttons (each
   one icon) — MEASURED, same render pass as §A. Over four times the number of discrete glyphs in
   the second row.
3. **Ink width, already measured in §A.** 401px of menu-bar content against 1,260px of toolbar
   content — roughly **3.1x** the horizontal mass, on a row directly beneath it, at the same
   left edge.
4. **The toolbar drops its words entirely, by ruling, at every width — not just under 640px.**
   OBSERVED, `css/engcalcs.css:1206-1213`'s own comment quoting Tom, 2026-08-20: *"toolbars have
   icons, not buttons... no 'button' paradigm"* — the toolbar is icon-only ALWAYS, which is also
   why its icons could be grown to 1.35em with no competing word to make room for. The menu bar
   keeps its word at every width except the phone breakpoint. So the two rows are not just
   different in size and count — they are two different, well-established GENRES of chrome:
   a dense grid of uniform glyph-only buttons is the visual grammar of an application's tool
   palette (Word's ribbon, Photoshop's tool well, AutoCAD's toolbars — CITED as the familiar
   comparison class, not sourced to one manufacturer); a row of small icon-plus-word items is the
   visual grammar of a website's navigation list or a breadcrumb — which is the SAME grammar the
   dying suite navbar used directly above it, and precisely matches MAH's own misreading, that the
   menu bar "belonged to the site rather than the application." **That is the strongest single
   piece of evidence for this diagnosis: a real reader's own words already named the genre
   confusion.**

**So the re-diagnosis: the cause is not a paint disjunction between the two rows (there isn't
one) — it is a visual-salience and genre imbalance WITHIN an already-unified strip.** Four
independent multipliers (smaller icons, 4x fewer of them, 3.1x less ink, and a genre — labeled
nav-style items — that this project's own comment history associates with a website rather than
an application) all point the same direction, and none of them is fixed by touching the seam
between the rows, because there is no seam.

### Revised recommendation — what would actually move the needle, ranked

Real design work, not a redraw — offered as diagnosis-and-direction per the brief, not as a spec:

1. **Grow the menu-bar icons to match the toolbar's 1.35em.** Cheapest of the four levers — one
   size number, no new strings, no layout risk (icons are already there, just smaller). Alone,
   this does not fix the 4x count / 3.1x ink gap, so treat it as a floor, not the fix.
2. **The count and ink gap (4x / 3.1x) cannot be closed by matching sizes — the toolbar's
   advantage is structural (22 real tools vs. 5 real menu categories), and manufacturing fake
   icons to pad the menu bar's width would be decoration, not information.** This is the reason I
   am not proposing a design that tries to make the two rows visually EQUAL in weight. A menu bar
   naming five categories is correctly smaller than a toolbar naming twenty-two tools; parity is
   not the right target.
3. **Given that parity is not achievable or desirable, the lever that is left is genre, not
   size: make the menu bar read as "part of the application's tool surface" rather than
   "a navigation list," independent of how much ink it occupies.** This is the one worth Tom's
   attention before 16 September, and it is a smaller ask than either the literal merge or a
   hairline: the menu bar's icons are already the same icon family, same stroke weight, same
   `currentColor` treatment as the toolbar's — the genre cue that is missing is that the toolbar
   is ALWAYS icon-only (no word ever competes with the glyph for attention) while the menu bar is
   never icon-only above 640px. A menu bar is conventionally words in nearly every desktop
   application (File, Edit, View) specifically because "File" has no reliable universal icon —
   so I am not recommending dropping the words. What I AM flagging: this is a genuine, judgement-
   level tension between two real conventions (menu bars are words; this page's toolbar is icons)
   and worth one direct question to Tom rather than a unilateral pick — it is exactly the kind of
   call his brief reserves for him, not for a paint tweak I can make alone.
4. **The instrument most likely to work without touching any of the above: meet the eye where it
   already lands, instead of trying to outcompete it.** The Hide-titles highlight failed twice
   because it marked a row nobody was looking at (`dev/ROADMAP.md` Task 616's own record — 4s,
   then 120s, MJH still missed it). The toolbar is where the eye demonstrably already goes first.
   A first-visit cue that begins AT the toolbar — the row people actually look at — and visually
   points or connects upward to the menu bar (rather than trying to make the menu bar itself
   brighter) works with the measured behavior instead of against it. This is the one candidate on
   this list that does not ask the menu bar to win an attention contest it structurally cannot
   win by 4x fewer, 3.1x narrower, smaller icons.

**Revised "if only one change": item 4 — a one-time cue anchored at the toolbar (where attention
already lands) that points to the menu bar, rather than any change to the menu bar's own paint or
size.** It is the only item in this re-diagnosis that does not require picking a side in the
words-vs-icons genre tension (item 3), does not ask for a size/count parity that would be
decorative rather than informative (item 2), and directly answers the mechanism the evidence
actually shows — MJH and PCW's eyes go to the toolbar and stop; meet them there. Cost: a small,
first-visit-only UI addition (not a redesign of standing chrome), reusing the "notice" mechanism
this page already has rather than inventing a new one, and explicitly informed by the ONE
documented failure of a similar idea (highlighting a row nobody was looking at) so as not to
repeat it. Still advice, not a build — the exact shape (an arrow, a pulsing edge, a one-line
banner anchored at the toolbar's top edge) is a follow-up question worth Tom's five minutes before
anyone writes CSS for it.
