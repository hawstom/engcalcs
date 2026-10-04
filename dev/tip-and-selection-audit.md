# Tips, and the word "selection": audit and recommendation

Ida (interface designer), 2026-10-03, on Tom's brief of the same date ("a studied, considered,
carefully adopted, and audited consistent strategy"). This is an audit and a recommendation. Nothing
shipped was changed. Every claim is tagged **OBSERVED** (this repository, with path:line),
**CITED** (an outside source, named), **MEASURED** (I ran a real browser) or **SPECULATION** (my
inference, not upgraded). Counts are from `lib/lang.ec.en.php` on master at `8476792b`, plus the two
unmerged branches `feat/criticality` and `feat/demand-scaling` where the brief's three tools live.

Sections 1 to 5 are the answer. Appendices A to D are the inventories behind it.

---

## 1. The short version

**On tips.** The copy is better than Tom fears and the delivery is worse than he thinks.

- Of 268 `lpn_*_tip` strings, I judge about 191 (71%) to carry a fact a reader can act on, 32 (12%)
  to restate their own label, 9 (3%) to be plain names for icon-only buttons (a legitimate tooltip),
  6 (2%) to be plain-English filler or a definition of a term the reader already owns, and 30 (11%)
  to be too long for any tip (45 words or more). One reader, one pass; treat each figure as plus or
  minus ten. 108 of the 268 are **ruled by Tom on their current words**, so an edit to them needs
  him. (Appendix B.)
- The pollution is mostly **mechanical, not editorial.** The same Bootstrap tooltip, 200 px wide
  by Bootstrap's default, shows the 92-word solver tip as a box **554 px tall in a 900 px window,
  62% of the screen height** (MEASURED, 4.1). That, not the number of tips, is what covers the
  drawing. At rest only 28 tip-bearing elements are on screen at once at 1400 px and 7 on a phone;
  the density is not the problem.
- There are **three different tip affordances on one page** and the three tools Tom named use the
  weakest one. A label with a `?` glyph (the documented rule), a bare control with a title and no
  glyph (every toolbar button), and a label with a title and **no glyph at all**: the rows of Fire
  flow, Criticality and Demand scaling. That last kind announces itself only by a changed cursor.
  (A.2.)
- The delay is **defined once**, in JavaScript, `js/Calculators.lib.js:107` (show 500 ms, hide
  100 ms), and that is correct and not the problem. It cannot live in CSS, because Bootstrap takes
  it as a script option. It can be *read from* a CSS variable; that is a tidiness move, not a fix.
  Ten other timers are hard-coded in `js/looped-network.js`, four of them as the same unnamed `300`.
  (A.4.)

**On "selection".** The collision is real but **small, local and already mostly disciplined.** Of
95 strings that use select/choose words, 87 are on the `lpn_` page. About eight in ten of the
hits (53 of 66) already use *select* for the map set and *choose* for options. The leaks are **11
strings** (7 on the select/choose axis, 4 on pointing), and the
dangerous ones are the ones where one sentence needs both meanings: *"No junctions are selected.
Select junctions or select the All option."* (Appendix C.) `feat/demand-scaling` has already fixed
that sentence the right way: *"Select junctions or choose All junctions."*

**Recommendation in one breath.** Keep **Select / Selected / the selection** for the map set, which
is what EPANET, AutoCAD and Microsoft all call it, and use **Choose / option** for everything
picked from a list. Do **not** adopt "Highlighted". Do **not** build the persistent status strip.
Keep hover-with-delay for icon-only buttons, make the `?` glyph the one door for explanations, and
put one `?` by the × of each tool box.

**If only one thing is done: a one-line CSS change**, widening the tooltip from 200 px to 22 rem.
Measured on the worst tip: 554 px tall becomes 302 px (45% shorter), at no translation cost and
no risk. (Move 1 in section 4.)

---

## 2. The vocabulary question, answered

### 2.1 What the strings actually do today

| Sense | Strings | Hits | Notes |
|---|---:|---:|---|
| Map selection set | 18 | 25 | 20 of 25 hits already use select-family words |
| Menu / option / file / list choice | 39 | 41 | 33 of 41 already use choose-family words |
| Tool or mode names ("Select", "Select mode") | 14 | 15 | Not a collision; it is the tool's name |
| Pointing at a place on the map ("Pick it up again", "Choose another node") | 7 | 8 | A third sense: a location, not a set |
| Table or spreadsheet selection (columns, cells) | 3 | 10 | A fourth sense, in the Notes tables |
| **One sentence carrying both senses** | **5** | **10** | **All in Fire flow. This is the real defect** |
| Highlight (a brief flash) | 1 | 1 | See 2.3 |
| Not on this page (consent, install, other calculators) | 8 | 9 | Out of scope |
| **Total** | **95** | **119** | |

**The straying words (7 on the select/choose axis; 4 more are pointing, C.1) are the whole list to fix:** three `ts` strings use *chosen/choose* for
the map set (`lpn_ts_add_tip`, `lpn_ts_add_none`, `lpn_ts_none`); one uses *picks*
(`lpn_notes_4_def`); and on the option side `lpn_crs_choose`, `lpn_new_coordsys_tip` and
`lpn_crs_list_tip` say *Select* for a coordinate-system option. `No curve selected`, `No pipe type
selected`, `No fittings list selected` use *selected* as the state of a list, which is ordinary and
I would leave. The five Fire flow strings are the ones that matter. In the unmerged branches the
same defect is in `lpn_crit_no_selection` in `feat/criticality` ("Choose one on the map": the wrong
verb, on the map side), but already repaired in `feat/demand-scaling` ("Select links or choose All
links"). **So the three tools are not parallel today, and the repaired form already exists.**

### 2.2 The recommendation

**One rule, two verbs, one noun.**

1. **The selection** (also *selected*, *select*) means the set of assets marked on the map, or rows
   or columns marked in a table. It is the only meaning of those words in visitor English.
2. **Choose** (also *choice*, *option*, *chosen*) means picking one entry from a list, menu or
   control. Never *select*, never *pick*.
3. **A sentence that needs both says where each happens.** *Select junctions on the map, or choose
   All junctions.* The location and the object carry the distinction in every language, which the
   verb alone cannot (2.4).
4. A scope control names the set it tests: **All junctions / Selected junctions**, parallel in all
   three tools, never a bare "Selected" (Fire flow's `lpn_ff_selected` and `lpn_ff_design_selected`
   are bare today).
5. Pointing at a place is a third thing and gets a third verb, **point to** or **click**, not
   *pick* or *choose*. This is a smaller fix and can wait.

Why this and not a new vocabulary:

- **It is the convention the readers already hold.** CITED: EPANET 2.2 user manual, Edit menu and
  Map toolbar: *Select Object, Select Vertex, Select Region, Select All*
  (epanet_userss_manual_2.2.0.pdf, via epa.gov). CITED: AutoCAD Help, SELECT command: the command
  *creates a selection set*. This project's own rule is to default to EPANET terminology
  (`CLAUDE.md`, the Vocabulary bullet) and the page's tool is already called Select
  (`lpn_tool_select`) with *Select a window / lasso / polygon* beside it.
- **Microsoft, who set the habit, agrees on the noun and half-agrees on the verb.** CITED:
  Microsoft Writing Style Guide, "select": *"Use select to refer to marking text, objects, cells,
  and other items that a customer will take action on... Describe the marked items as the
  selection or the selected text, objects, cells... Don't use highlight or pick as a synonym for
  select."* CITED, same guide, "Describing interactions with the UI": **Choose** is for *"choosing
  an option, based on the customer's preference or desired outcome."* Honest caveat: the same page
  also uses *select* for menu items and list values in click-by-click instructions, so Microsoft
  does not split the verb as cleanly as I propose. Its split is the noun (*the selection*) and the
  *Choose* row. My rule is Microsoft's two rows, made stricter on the verb because **this page has
  an object a person selects and an option a person chooses in the same dialog**, which an
  instruction manual rarely does.
- **It costs little.** About 11 strings change plus the five Fire flow strings (16 of the 87 on this
  page); the other 71 are already right.

### 2.3 The strongest rejected alternative: "Highlighted" for the set, "Chosen" for options

Tom's leading candidate. I rejected it for four reasons, in order of weight.

1. **It renames the thing his users already call by name.** The tool is Select; the EPANET button is
   Select Object. "Highlighted assets" would force the tool, the three area tools, the `{n}
   selected` readout and the shift-click hint to change with it, in 27 languages, to be
   *less* like EPANET. (OBSERVED, Appendix C: the set is named in 18 strings plus 14 tool and mode
   names.)
2. **"Highlight" is already spoken for here, and for something else.** OBSERVED
   `lib/lang.ec.en.php`, `lpn_tip_labels_draggable`: *"The label highlights briefly to alert you
   that it was moved."* OBSERVED, `dev/ROADMAP.md:1474` (Task 616) and `dev/app-chrome-postdivorce-recommendations.md:381`: the Hide-titles flash
   that MJH never saw. A highlight on this page is a transient flash. A second meaning ("the assets
   I have marked") re-creates the collision on the other side of the word.
3. **In the wider world "highlighted" is the menu item under the pointer.** CITED: Microsoft Learn,
   MFC "Status Bar Implementation": the status bar *"displays a string of help text when a menu
   item is highlighted."* A tip that says "highlighted" in a menu context now means the hover
   state. SPECULATION (not tested with readers) that this would be heard that way, but it is the
   Windows meaning of the word.
4. **It does not translate into a clean second word in the languages that matter.** Table below. In
   Russian the everyday word for highlighting a thing in a document or file list is the same
   family as *select* (SPECULATION from memory of Russian Windows, not fetched), so "highlighted"
   and "selected" collapse again.

Per-language reality, from the shipped files (OBSERVED, `lib/lang.ec.XX.php`, keys `lpn_tool_select`,
`lpn_crs_choose`, `lpn_ts_none`, `lpn_ff_no_selection`):

| Lang | Select (the set) | Choose (an option) | Distinct verbs? |
|---|---|---|---|
| es | Seleccionar | Elija / Elegir | **Yes** (seleccionar / elegir) |
| pt | Selecionar | Escolha / Escolher | **Yes** (selecionar / escolher) |
| fr | Sélectionner | Choisissez | **Yes** (sélectionner / choisir) |
| tr | Seç / seçili | Seçin | No: one root, *seç-* |
| de | Auswählen / Auswahl | Wählen Sie | No: *wählen* inside *auswählen* |
| ru | Выбрать / Выбрано | Выберите | No: one root, *выб-* |
| zh | 选择 / 选中 / 所选 | 请选择 | Partly: 选中 (selected state) is distinct from 选择 (the act) |

So a clean verb split is available to three of the four anchor languages (es, pt, fr) and
**not** to tr, de or ru. That decides the design: the English split helps where a language can use
it, and **must not be the only line of defence**. Rule 3 (say where) is what works in all seven,
because "on the map" and an object noun are unambiguous in every language. And `pt` already did
this unprompted: its `lpn_ff_no_selection` reads *"Selecione junções ou escolha a opção Todas"*,
splitting the verb the English left merged, while es, fr, tr and ru merged it.

### 2.4 Glyphs

I considered them seriously and recommend only a small, late use.

- **A glyph helps a selector, not a tip.** A tip is a `title` attribute: plain text, no markup
  (`CLAUDE.md`, language-key rule B). So a glyph cannot go inside a tip sentence, and the tips are
  where Tom met the problem.
- In a selector (the All / Selected pair) the existing area-select icon (`lib/Icons.lib.php`, the
  crosshair family) beside "Selected junctions" would tie the word to the tool that makes the set.
  Cost: small, no translation. Gain: small, because the word is already local and parallel.
- **Not the arrow.** Tom ruled on 2026-09-10 that a drawing of a cursor is a promise about the
  pointer (wishlist item 2); the Select tool's arrow must not be reused as a "selected" mark.
- Unicode stand-ins (a dotted square, a target) depend on the font and misrender in some of the
  five right-to-left languages' fallback fonts. SPECULATION: not tested here.

### 2.5 Two follow-ups that make the rule stick (not built)

- Add **selection set** and **option** to `dev/scripts/glossary.json` with the anchor-language
  words (es *selección*, pt *seleção*, fr *sélection*, tr *seçim*), so a translator is told, not
  left to guess.
- A small check could flag any one English string that holds both a *select* word and one of *option /
  menu / choose / All*. It would have caught all five Fire flow strings. This is a defect a visitor
  could hit that a person would miss, which is the bar `CLAUDE.md` sets for a new check.

---

## 3. The status strip, answered

Tom: *"The Persistent Status Bar ... appeals to me a lot, and I think I am conditioned to look at
the bottom of the screen to see help text for a pull-down menu item."* His conditioning is real,
and it was true. **It is also the one pattern Microsoft itself withdrew, and our own evidence points
the same way.**

- CITED: Microsoft Learn, "Status Bars (Design basics)", Win32 UX guide: *"Don't use the status bar
  to explain menu bar items. This help pattern isn't discoverable."* And: *"status bars are easy to
  overlook. So easy, in fact, that many users don't notice status bars at all."* And: *"Users should
  never have to know what is in the status bar."* And: *"Does the information explain how to use
  the selected control? If so, display the information next to the associated control."* And:
  *"Is the program intended primarily for novice users? Inexperienced users are generally unaware
  of status bars."* (The guide is for Windows 7 and notes it is not updated; the reasoning is the
  point, not the date.) The MFC strip Tom remembers is the pattern those lines retire.
- OBSERVED, this project: PCW and MJH never saw the menu bar, and MJH did not see a 120-second
  highlight (ROADMAP Task 616). Both are the same failure: **a mark on a strip nobody is looking at
  is the wrong instrument.** A one-line strip at the bottom is by construction a strip nobody is
  looking at. SPECULATION: I did not test a strip with a reader; the Windows guidance and Task 616
  are the evidence.
- A strip needs a hover or a focus to fill it. A phone has neither (no hover; a focused field is
  covered by the on-screen keyboard, which is where the strip would be). The phone is a constraint
  the brief sets, not an afterthought.
- This page **already has two strips**, both used for status and neither for help: the mode hint at
  the top left (`Looped-Network.php:354`, `#lpn_mode_hint`) and the footer cluster at the bottom
  left (`#lpn_map_footer`, `:687`). They are the right home for "what the next click does", which is
  what they hold now. Adding "what this field means" to the footer would make a status strip carry
  help, which is the pattern the guide says does not work.

**What I would take from Tom's instinct instead.** His real point is that the tip for a menu row
should not hover over the menu (he said so about the Water menu on 2026-09-12; the code parks the
tip while a menu is open, `js/looped-network.js:37283`). A **description line inside the open menu
popup, under the hovered row,** gives him the "look at one fixed place" behaviour with the strip's
failure removed: the eye is already on the menu. See move 6 in section 4.

---

## 4. The tip interaction model, and the ranked moves

### 4.1 What is true today (measured)

Chromium 1400 x 900 and 390 x 844 (touch, mobile), Looped Network with the first example open,
2026-10-03, `dev/browser-pass` environment (Appendix E has the script's outputs).

- **The drawing is 87% of the window** on desktop (1398 x 783 of 1400 x 900) and **86% on a phone**
  (388 x 727 of 390 x 844). Chrome is not the pollution; the tips are not either, at rest.
- **Tip-bearing elements on screen at once:** 28 on desktop (26 managed by Bootstrap, of which one
  is a `?` glyph), 7 on the phone (5 managed). Only **one `?` glyph is visible at rest**: the page
  is almost entirely tips on controls, which show no glyph. A person cannot see that a tip exists.
- **Time to a shown tooltip:** 836 ms from the pointer arriving on a toolbar button (500 ms delay,
  movement, 150 ms fade). Consistent with the code.
- **Width and height of the worst case:** the 92-word solver tip is **200 x 554 px** (62% of the
  window's height). The same tip at `--bs-tooltip-max-width: 22rem` is **352 x 302 px**.
- **A tooltip cannot be hovered and Esc does not close it:** computed `pointer-events` is `none`,
  and after pressing Escape with a tip up, **one tooltip was still shown**. WCAG 1.4.13 asks for
  *dismissible*, *hoverable*, *persistent*; the first two fail as measured (the criterion's text is
  CITED from summaries, not read at W3C). I did not test persistence.
- **A toolbar tooltip prints the name, a dash and the sentence:** "Open… — Open a project file
  saved from this page."
- **Not every tip goes through `initTips`.** 12 titled elements on screen at 1400 px in the editor
  still carry a **native** `title` and no Bootstrap: the transport's step and speed controls, and
  the whole **project tab strip** (New project, All projects, the tab name, the caret, the tab's ×).
  Those use the browser's own tooltip, with the operating system's delay and face. The close
  buttons in the page markup are the same (A.1, row 5).

### 4.2 Recommendation

**Three kinds of tip, three behaviours, and never mixed on one element.** This is the model the
code's own comment already argues for (`js/Calculators.lib.js:11-26`: one opening gesture per
element per device), applied by purpose instead of by device.

| Kind | What it is | Behaviour | Today |
|---|---|---|---|
| **Name** | The tip *is* the label of an icon-only control: toolbar, transport, ×, sort arrow | Hover or focus with delay (500 / 100 ms), long-press on touch. Short. May carry the shortcut | Same, except it prints the name twice (4.3) |
| **Explanation** | What a modelling field or a tool means: the 268 `_tip` strings | **One door: click the `?`.** Opens a popover that stays until a click elsewhere, Esc or focus-out. Wider than a tooltip. No hover trigger | Hover, with delay, in a 200 px column; tap on touch |
| **Box intro** | What a whole tool does and how its fields relate | **One `?` beside the ×** of the tool box, opening the same popover. The per-field `?`s that restate it go | Per-field only; the three tools show no glyph at all |

Why this and not the alternatives, judged on hierarchy and on a phone in tall mode:

- **Hover-only (status quo).** Fine for names. For explanations it fails on a phone (so a second
  model, tap, already exists) and it fails WCAG 1.4.13 on a pointer (4.1). It keeps three trigger
  modes alive (`hover focus`, `click`, `manual` long-press), `js/Calculators.lib.js:84-86`.
- **Persistent status strip.** Rejected in section 3.
- **Click-to-open for everything.** Wrong for names: an icon-only toolbar button must still press
  when tapped, and a click-to-open name would take the first click away from its own button. The
  code says so (`js/Calculators.lib.js:74-83`: a tap on a control must still perform the control's action).
- **One `?` per box and nothing else.** Right for tools, too coarse for the Settings and Properties
  boxes, where a field like Emitter exponent has no neighbour to share a tip with.

**The mechanism needs no new library:** Bootstrap's popover is in the vendored bundle already
(OBSERVED, `js/vendor/bootstrap.bundle.min.js`, v5.3.2). With `trigger: 'focus'` on a focusable `?`
it is exactly Tom's "Click-to-Open, Focus-Out-to-Close". SPECULATION: I did not prototype it; the
risk to check is that a popover rendered into `document.body` is swept when a box closes, the
defect `dev/lpn-spike/tip-behaviour-harness.js` already guards for tooltips.

On a phone in tall mode this is **better than today, not merely equal**: the glyph is a 1 em
target only if made one, so it must be given real padding (a tap target of about 44 px,
SPECULATION from the usual touch guidance, not measured here); the popover is a block the reader
can scroll and dismiss, instead of a tooltip that vanishes when the finger lifts.

### 4.3 Ranked moves, cheapest and most valuable first

| # | Move | Cost | Buys |
|---|---|---|---|
| **1** | **Widen the tooltip: one rule in `css/engcalcs.css`, `.tooltip { --bs-tooltip-max-width: 22rem }`** | One line. No strings. A harness for the existing tip behaviours still applies | Measured: the worst tip goes from 200 x 554 px to 352 x 302 px. Removes the worst case of "covers the drawing" at once |
| **2** | **Make the three Analyze tools parallel**: one row builder for all three (`ffRow`, `js/looped-network.js:57318`) that draws the standard `?`; the repaired scope wording from `feat/demand-scaling` applied to Fire flow and Criticality; "All X / Selected X" in all three | Small JS; about 6 strings touched, all in tools not yet released | Tom's first request, exactly. Fixes the missing glyph and the select/choose collision where he met them |
| **3** | **The cull.** Delete or fold the 32 tips that restate their label and the 2 filler ones; move the 30 of 45+ words to the Help notes or to a box `?` | Deleting a key is cheap (no retranslation). Moving text reuses translated strings. 108 tips are ruled by Tom: each such edit needs his yes, so batch them as one interview | Fewer `?`, fewer balloons, a page that reads as written by someone who trusts the reader. Honest size: about 1 tip in 8 restates, not 1 in 2 |
| **4** | **Click-to-open for explanations** (4.2), popover, one door | Medium: one function in `js/Calculators.lib.js`, a new harness, a pass over the phone. No new strings | Ends the hover-map worry for good; one model on desktop and phone; meets WCAG 1.4.13; room for longer tips |
| **5** | **One `?` by the × of each tool box** | Small once 4 exists. One new key per box only if the intro is not already there (Fire flow already has `lpn_ff_intro`) | Tom's own suggestion, and the cleanest answer to "does Demand scale really need an explanation?": the answer is the box's `?`, not a per-field balloon |
| **6** | **A description line inside an open menu**, under the hovered row | Medium: menu popup markup, a harness. About 55 rows carry tips (OBSERVED, 55 `tip: pc.` sites) | The status strip's one real virtue, with its flaw removed; ends the menu tip covering the menu |
| **7** | **One home for the delays**: `--ec-tip-show-ms` and `--ec-tip-hide-ms` in the token block, read once by `initTips`; the 500 ms long-press (`:172`) reads the same; the four literal `300`s become one named constant | Small. Tom asked for it (*"audit for delays ... in master styles, not hard-coded"*); this is the honest limit: CSS can hold the number, but only script can use it | Tidiness and one place to tune. Does not change what a visitor sees |
| 8 | Glyph in the scope selectors (2.4) | Small | Small. Do last or never |
| **X** | **Do not build the persistent status strip** | n/a | Section 3 |

**The sequence I would run:** 1 (today), then 2, then 3 as one interview, then 4 and 5 together.
6 and 7 whenever convenient. 8 only if the others leave a visible gap.

### 4.4 Two things this audit found that were not asked about

- **Name tips print the name and then the sentence.** `setIconLabel` joins them with
  `{name} — {tip}` (`js/Calculators.lib.js:798-808`, key `lpn_tip_join`). Measured: "Open… — Open a
  project file saved from this page." By the code Undo reads "Undo — Undo the last change."
  Where the sentence begins with the name, it should be dropped.
- **The `×` close buttons, and the project tab strip, carry a bare native `title=`**: 20 in the page markup (`Looped-Network.php`, each `title="...lpn_close..."`), plus the ones the script builds (`js/looped-network.js:37023`).**, so they show the browser's own tooltip
  with the operating system's delay, in the browser's own face, and are unreachable on a phone
  (OBSERVED: lines 825, 851, 964, ... 1836). A × needs no tooltip, and on the markup ones the
  accessible name is already carried by `aria-label` beside it. Dropping the `title` on them removes the only tips on the page that do not go through `initTips`.

---

## 5. Decisions for Tom

Each is phrased so it can go into an interview as written.

1. **Which word is the map set called?** (a) Keep **Select / Selected / the selection** for the map
   set and use **Choose** for options (recommended: matches EPANET, AutoCAD, Microsoft). (b) Adopt
   **Highlighted** for the set and **Chosen** for options (your leading candidate; renames the Select
   tool in 27 languages and re-uses a word the page already uses for a flash). (c) Keep today's
   mixed usage and fix only the five Fire flow strings.
2. **Do you want the choice rule enforced by a check?** (a) A small check that flags a string holding
   both a select word and an option word (recommended). (b) A glossary entry only. (c) Neither.
3. **What does a scope selector in the three tools say?** (a) **All junctions / Selected junctions**
   in every tool (recommended). (b) **All / Selected** bare, with the noun in the row label. (c)
   **All / On the map**.
4. **How should an explanation tip open?** (a) Click the `?`, closes on a click elsewhere or Esc,
   one door on desktop and phone (recommended). (b) Keep hover with delay on desktop and tap on
   phone, and only widen the balloon. (c) Hover for short tips, click for long ones.
5. **Should each tool box get one `?` by its ×, and should that replace the per-field `?`s that
   restate it?** (a) Yes, in the three Water, Analyze tools first (recommended). (b) Yes, in every box.
   (c) No: per-field only.
6. **What do we do with the tips that restate their label (about 32)?** (a) Delete them, in one
   interview batch for the ones you have ruled (recommended). (b) Keep the ruled ones, delete the
   rest. (c) Keep all and widen nothing.
7. **Do you still want help text for a menu row at a fixed place?** (a) A description line inside the
   open menu (recommended). (b) A line at the bottom of the window (against the Microsoft guideline
   and our own Task 616 evidence). (c) Neither; the hover tip stays.
8. **Where do the 30 tips of 45 words or more go?** (a) The Help notes, with a short tip left
   behind (recommended). (b) A box `?` popover. (c) Stay as tips, shortened (each shortening
   re-opens a ruling and 26 translations).

---

## Appendix A. How tips work on the Looped Network page today

### A.1 Mechanisms (what a visitor can meet)

| # | Mechanism | Trigger | Where built | Visible cue |
|---|---|---|---|---|
| 1 | **Label with `?`** (`ecTipLabel`, `ecLinkTipLabel`) | Hover (pointer) or tap (touch); label text and glyph both | `lib/Calculators.lib.php:96`, `:128`; JS twins `findHelpLabel` `js/looped-network.js:19224`, `setFieldLabel` `:50389` | The `?` (steelblue, `.ec-tip` `css/engcalcs.css:405`) |
| 2 | **Control with a title** (toolbar, transport, menu rows, pane controls) | Hover or focus with delay; **long-press** on touch | `EngCalcs.setIconLabel` `js/Calculators.lib.js:798`, the page's wrapper `js/looped-network.js:37202`, `helpTip` `:50425`, menu rows `:37377`, `:39713` | None (the control is the cue). Cursor `help` |
| 3 | **Label with a title and no glyph** (the Fire flow, Criticality and Demand scaling rows) | Hover; tap | `ffRow` `js/looped-network.js:57318` (`name.title = tip; name.className = 'ec-help'`) | **None except the cursor** (`.ec-help` `css/engcalcs.css:424`) |
| 4 | **Table header or cell with a title** | Hover; tap | `:24738`, `:43373`, `:59501` | None except cursor |
| 5 | **Bare native `title=`** (the close buttons, the settings search, **the project tab strip**, the transport's step and speed) | The browser's own: OS delay, OS styling; **no touch route** | `Looped-Network.php`, e.g. `:825`, `:851`, `:1040` | None |
| 6 | **SVG `<title>`** inside charts | The browser's own | `js/looped-network.js:28898`, `:29399` | None |
| 7 | **Status text, not tips:** mode hint, area-select bubble, one-shot map notice (8 s), status box, engine banner | Always on, or timed | `Looped-Network.php:354`, `:409`, `:413`; `STATUS_NOTICE_MS` `js/looped-network.js:55462` | Text on the map |

All of 1 to 4 go through one function: `EngCalcs.initTips`, `js/Calculators.lib.js:73`, which hands
every `.ec-help[title]` to Bootstrap's tooltip. The same function runs for every calculator in the
suite, not only this page (so a change to the model is suite-wide; see move 4).

### A.2 Triggers, as written in `initTips` (`js/Calculators.lib.js:73-180`)

- Device can hover, element is a control or a label: `'hover focus'` (`:84`).
- Device cannot hover, element is a **plain label**: `'click'`.
- Device cannot hover, element is a **control** (a button): `'manual'`, opened by a 500 ms
  press-and-hold (`:84`, `:168-172`) so a tap still presses the button.
- A control hides its tip on click (`:121-122` region, the click handler) and on `mouseleave` unless the focus is keyboard
  focus (`:132-135`).
- A tooltip **may never take a click**: `.tooltip { pointer-events: none }`, `css/engcalcs.css:434`.
  (This is also what makes it fail WCAG's "hoverable" test, 4.1.)
- A menu parks its own anchor's tip while the menu is open (`js/looped-network.js:37283`).
- Hybrid devices (touch plus mouse) report `hover: hover`, so a plain label's tip is hover-only
  there. Known and accepted, stated at `js/Calculators.lib.js:23-26`.

### A.3 Presentation

- Bootstrap 5.3.2's tooltip, unmodified except two rules: `pointer-events: none` (`css/engcalcs.css:434`)
  and `z-index: 1900` (`:1579`).
- Bootstrap's own variables apply (`css/vendor/bootstrap.min.css`, `.tooltip{...}`): `max-width:
  200px`, `font-size: 0.875rem`, `opacity: 0.9`, padding `0.25rem 0.5rem`, fade `.15s`
  (`.fade{transition:opacity .15s linear}`). **None is overridden**, and none uses an `--ec-*` token.
- Where `.tooltip-inner` and the arrow take their colours: Bootstrap's own `--bs-tooltip-bg` and
  `--bs-tooltip-color`. `chrome_colour_check.php` therefore does not see them; they bypass the
  `--ec-*` token rule by living in the vendored stylesheet. SPECULATION: no dark-theme consequence
  has been checked.

### A.4 Delays and timers: where each is defined

| Delay | Value | Where | Hard-coded? |
|---|---|---|---|
| Tooltip show | **500 ms** | `js/Calculators.lib.js:107` (`delay: { show: 500, hide: 100 }`) | Yes: a literal in script. The one number behind every tip |
| Tooltip hide | **100 ms** | same line | Yes |
| Long-press to open a control's tip | 500 ms | `js/Calculators.lib.js:172` | Yes: a second literal, same value, not tied to the first |
| Tooltip fade | 150 ms | `css/vendor/bootstrap.min.css` | In a stylesheet, but Bootstrap's, not ours |
| Menu fly-out close | 350 ms | `js/looped-network.js:37816` `SUB_CLOSE_MS` | Named constant in script |
| Link / label popup, after a click, to leave room for a double-click | 300 ms, **four times** | `js/looped-network.js:41685`, `:41695`, `:41708`, `:41718` (and `:60055`, `:60085` for solves) | Yes: the same unnamed literal repeated |
| Profile long-press | 450 ms | `:28445` `PROFILE_HOLD_MS` | Named, script |
| Column-drag hold | 450 ms | `:24138` `PANE_COL_DRAG_HOLD_MS` | Named, script |
| Double-tap window | 400 ms | `:28445` `PROFILE_DBLTAP_MS` | Named, script |
| Ghost-click shield | 350 ms | `:51488` `GHOST_CLICK_MS` | Named, script |
| One-shot map notice | 8 s | `:55462` `STATUS_NOTICE_MS` | Named, script |
| Engine note | 120 s, fade 800 ms | `:55617`; fade also `css/engcalcs.css:350` | Split: the 8 s lives in script, the 0.8 s in CSS, two places for one idea |
| Engine banner show / min-shown | 1 s / 1.5 s | `:56929-56930` | Named, script |

**Verdict on "master styles":** a tooltip's delay **cannot** live in a stylesheet, because the
library takes it as a script option; the honest "master" is one named place. Today there are two
(500 in `:107` and 500 in `:172`) for the same idea. Providing it from a `--ec-*` variable that the
script reads once (`getComputedStyle`) is possible and cheap and would put it beside the colours,
but it adds a read for no visible change. Move 7.
The delay values are sound: 500 / 100 are Windows' own defaults (CITED: Microsoft Learn, "Tooltips
and Infotips": *Initial 0.5 seconds; Reshow 0.1 seconds; Removal 5 seconds*; this suite's comment
at `js/Calculators.lib.js:94-98` already says so). The Windows guide's third number, a 5-second
removal for tooltips and none for infotips, has no counterpart here: our tooltips stay while the
pointer stays.

### A.5 What a visitor meets, by count (from the language file)

- 268 `_tip` keys and 28 `_note` keys on the `lpn_` page. Median tip: 24 words. 125 are over 25
  words; 90 over 30; 30 at 45 or more; longest 93 words.
- 21 `ecTipLabel` / `ecLinkTipLabel` calls in `Looped-Network.php`; 25 `helpTip` calls and many
  `setIconLabel` buttons in `js/looped-network.js`; about 55 menu and toolbar rows carry a `tip:`.
- 10 `*_menu_tip` strings (one per menu-bar entry).

---

## Appendix B. The tips, sorted

**Method.** One reader (me), one pass over all 268 `lpn_*_tip` values (`dev/scripts` is not involved;
the list was dumped from `lib/lang.ec.en.php`). Categories are judgements; the length figures are
counts. A machine check supports one category: 10 tips add three or fewer new content words to
their own label.

| Category | Count | Share | Test |
|---|---:|---:|---|
| Genuinely helpful | 191 | 71% | Adds a fact the label cannot (a datum, a limit, a source, a consequence) |
| Restates the label, or duplicates the mode hint | 32 | 12% | Removing it loses nothing |
| A name for an icon-only control | 9 | 3% | Legitimate: the tip *is* the label (Microsoft calls it a tooltip) |
| Plain-English filler, or defines a term the reader owns | 6 | 2% | Talks down or pads |
| Too long for a tip (45 words or more) | 30 | 11% | About 16 of 268 would run 12 lines or more in a 200 px balloon (estimate at 26 characters a line; measured case in 4.1); belongs in a manual or a box popover |
| *Of all 268: ruled by Tom on current words* | *108* | *40%* | An edit lapses the ruling |

### B.1 Representative strings and my verdict (21)

**Genuinely helpful**

1. `lpn_field_roughness_tip` (25 words): *"Hazen-Williams C. A higher number means a smoother pipe: about 150 for new plastic, 130 for new steel or iron, and 100 for old pipe."* **Helpful.** Anchors the number; uses the technical term without apology.
2. `lpn_ff_residual_tip` (21): *"The pressure the junction must still hold while delivering the fire flow. AWWA M31 and NFPA 291 use 20 psi (140 kPa)."* **Helpful.** Cites the standard. The model for a tip.
3. `lpn_scenario_preset_max_day_tip` (30): *"Demand multiplier 2.0 times average day, a placeholder value. Most systems fall between 1.2 and 3.0 (National Research Council, 2006). Set your own system's in Settings, Calculation, Hydraulics, Demand multiplier."* **Helpful.** A range, a source and a path.
4. `lpn_result_head_tip` (25): *"Energy of the water at this node, written as a height of water column. It is an absolute height, where pressure is a gauge measurement."* **Helpful.** Separates two things readers confuse.
5. `lpn_settings_specific_gravity_tip` (19): *"The weight of the fluid compared with water. It changes the pressures a gauge would read, not the flows."* **Helpful.** The second sentence is the fact.

**Restates the label, or the mode hint**

6. `lpn_tool_undo_tip` (4): *"Undo the last change."* on a button named **Undo**. With `lpn_tip_join` the tooltip reads *"Undo — Undo the last change."* **Restates, twice.**
7. `lpn_tool_settings_tip` (6): *"Open the settings for this project."* on **Settings**. **Restates.**
8. `lpn_ts_group_tip` (7): *"Whether the graph shows nodes or links."* beside a control that shows the two words. **Restates.**
9. `lpn_freq_quantity_tip` (4): *"Which value to graph."* **Restates.**
10. `lpn_tool_add_pipe_tip` (12): *"Click one node and then another to draw a pipe between them."* The mode hint prints the same sentence when the tool is chosen (`lpn_mode_add_pipe`). **Duplicated; one of the two should go.**
11. `lpn_library_curve_type_tip` (4): *"What this curve describes"* on **Curve type**. **Restates.**

**Plain English where a term is owned (talking down)**

12. `lpn_tool_add_junction_tip` (17): *"Click the map to add a junction: a point where pipes meet or where water is used."* Defines **junction** to a person using a pipe-network editor. **Talks down.**
13. `lpn_tool_add_tank_tip` (19): *"...storage whose water level rises and falls as it fills and empties."* Same fault; the tank's one real fact (it is a fixed head at its surface) is missing. **Talks down.**
14. `lpn_field_closed_tip` (30): *"Close this pipe so no water can pass through it. The pipe stays on the map and keeps all its numbers, and you can open it again at any time."* The last clause is reassurance. **Talks down.**
15. `lpn_menu_project_tip` (15): *"Everything about water network modeling is here in one place, except the animation play controls."* No fact a menu bar does not already say. **Filler** (Tom has already trimmed it once: `dev/lpn-tip-copy-review.md`).
16. In `feat/demand-scaling`, `lpn_ds_multiplier_tip`: *"...1.5 is half again as much water."* **Simple English** for a number a designer reads at a glance. Keep the example out.

**Selection collision inside a tip**

17. `lpn_ts_add_tip` (10): *"Put everything now chosen on the map onto the graph."* *Chosen* for the map set, and "put ... onto" for add. **Collision plus plain English.**

**Belongs in a manual or a box popover**

18. `lpn_settings_engine_native_tip` (92): the built-in versus the EPANET solver, a 650 KB download, and a rounding note on minor losses. **Manual.** Every sentence is true and useful; none is a tip.
19. `lpn_source_type_tip` (92): the four EPANET source types, defined. **Manual or a box popover.** (Ruled by Tom on its current words.)
20. `lpn_wrong_tip` (76): what the *Something is wrong* link does and does not send. **A privacy line, not a tip.** It is also a statement about privacy, which wants a page a person can link to.
21. `lpn_settings_symbol_cap_tip` (69): the symbol-cap percentile rule. **Manual.**

### B.2 What the sort says

- **Tom's feeling that tips overreach is correct for about one in four** (restating, filler and
  over-length together: 32 + 6 + 30 = 68 of 268, 25%, before overlaps are removed). It is not
  correct for the other three in four.
- The restating ones are concentrated in **short tips on controls whose label already says it**
  (graph controls, library curve fields, the label prefix/suffix boxes, the tool tips). They are
  a style, not a scatter.
- The Windows guide's "25 words or less" for a tip (CITED: Microsoft Learn, "Tooltips and
  Infotips", for Start menu and Control Panel infotips) puts the median here (24) right on the line
  and the upper half over it.

---

## Appendix C. Every use of select / choose / pick / highlight, in visitor English

Source: `lib/lang.ec.en.php` (master `8476792b`), regex over all keys: `select(s|ed|ing|ion|ions|or)`,
`choos(e|es|ing)|chose|chosen|choices?`, `pick(s|ed)?`, `highlight(s|ed)?`. **95 keys, 119
hits; 87 keys on the `lpn_` page.** JavaScript fallback literals are not counted (they mirror the
keys, and `js_fallback_string_check.php` holds them at zero drift).

| Class | Keys | Hits | Examples |
|---|---:|---:|---|
| Map selection set | 18 | 25 | `lpn_area_selected` *"{n} selected."*; `lpn_multi_title` *"{n} selected"*; `lpn_find_shift_hint` *"...adding if not in the selection set or removing if already in the selection set."*; `lpn_select_first` *"Nothing is selected. Click an asset on the map first, then press Delete."* |
| Menu / option / list / file choice | 39 | 41 | `lpn_crs_list_tip` *"Choose one and press Select."*; `lpn_library_import_choose` *"Choose what to copy from {file}"*; `lpn_curve_none` *"No curve selected"* |
| Tool or mode name | 14 | 15 | `lpn_tool_select`, `lpn_mode_select`, `lpn_tool_area_window` *"Select a window"* |
| Pointing at a place | 7 | 8 | `lpn_profile_choose` *"Choose a start node and an end node."*; `lpn_georef_twopt_same` *"That is the point you picked first. Pick a different one."*; `lpn_georef_detach` *"Pick it up again"* |
| Table / spreadsheet selection | 3 | 10 | `lpn_notes_6_def`, `lpn_notes_7_def`, `lpn_library_curve_values_tip` |
| **Both senses in one string** | **5** | **10** | `lpn_ff_no_selection` *"No junctions are selected. Select junctions or select the All option."*; `lpn_ff_design_no_selection`; `lpn_ff_scope_tip` *"Choose the set before you run."*; `lpn_ff_selected` *"Selected"*; `lpn_ff_design_none` *"...in the chosen set..."* |
| Highlight (a flash) | 1 | 1 | `lpn_tip_labels_draggable` |
| Not on this page | 8 | 9 | `consent_region_label`, `mpf_solver_no_solution`, `mtc_iteration_tip`, `install_*` |

### C.1 The straying strings (11), the list to edit

*Map set said with a choice word (4):* `lpn_ts_add_tip` ("chosen on the map"), `lpn_ts_add_none` ("chosen
on the map"), `lpn_ts_none` ("Choose assets on the map"), `lpn_notes_4_def` ("Find picks out every
asset").
*Option said with a select word (3):* `lpn_crs_choose` (button "Select"), `lpn_new_coordsys_tip` ("Select
the coordinate system"), `lpn_crs_list_tip` ("press Select").
*Pointing said with a choice word (4):* `lpn_profile_draw_blocked`, `lpn_profile_say_idle`,
`lpn_profile_none`, `lpn_profile_choose` ("Choose another node"). These are pointing, rule 5 in
2.2; lowest priority.

*The 5 two-sense strings are all Fire flow.* In `feat/demand-scaling`, `lpn_crit_no_selection` and
the new `lpn_ds_no_selection` ("Select junctions or choose All junctions") are already correct; in
`feat/criticality` the same key says *"Choose one on the map"*, which is the wrong side. When the
branches merge one of the two will win. They should be settled together.

### C.2 The three tools' scope strings, side by side (OBSERVED in the three trees)

| String | Fire flow (master) | Criticality (`feat/criticality`) | Demand scaling (`feat/demand-scaling`) |
|---|---|---|---|
| Scope tip | "Choose the set before you run. ..." | "Every pipe, pump, and valve, or only the ones selected on the map. Choose the set before you run." | "All junctions, or only those selected on the map. Pressures are checked at the scaled demand." |
| Option label | "Selected" | "The selected links" | "Selected junctions" |
| Empty-set error | "Select junctions or select the All option." | "Choose one on the map, or break every link." | "Select junctions or choose All junctions." |
| Skipped note | "{n} selected elements are not junctions, so they were not tested." | "...are not links, so they were not broken." | "Selected elements that are not junctions, left as they are: {n}." |

Three tools, three wordings, one concept. The Demand scaling column is the pattern.

---

## Appendix D. Sources

- CITED: Microsoft Learn, Win32 UX guide, **Status Bars (Design basics)**,
  learn.microsoft.com/windows/win32/uxguide/ctrl-status-bars (fetched 2026-10-03; the page notes it
  was written for Windows 7).
- CITED: Microsoft Learn, Win32 UX guide, **Tooltips and Infotips**,
  learn.microsoft.com/windows/win32/uxguide/ctrl-tooltips-and-infotips (fetched 2026-10-03).
- CITED: Microsoft Writing Style Guide, **select** (learn.microsoft.com/style-guide/a-z-word-list-term-collections/s/select)
  and **Describing interactions with the UI** (.../procedures-instructions/describing-interactions-with-ui),
  fetched 2026-10-03.
- CITED: Microsoft Learn, MFC **Status Bar Implementation** (the strip shows help "when a menu item
  is highlighted"), via search result, 2026-10-03.
- CITED: EPANET 2.2 User Manual (Rossman, Woo, Tryby, Shang), Edit menu and Map toolbar, *Select
  Object / Select Vertex / Select Region / Select All*, via search result 2026-10-03.
- CITED: AutoCAD Help, **SELECT (Command)**, help.autodesk.com (the command creates a *selection
  set*), via search result 2026-10-03.
- CITED: W3C WCAG 2.1 success criterion **1.4.13 Content on Hover or Focus** (dismissible,
  hoverable, persistent), via accessibility summaries found 2026-10-03; not read in the W3C text
  itself, so treat the three words as the criterion's own and the application as mine.
- SPECULATION, unverified: that "highlighted" would be heard as the hover state in a menu context;
  Russian everyday usage of the verb; the 44 px touch target; a popover's behaviour when a box closes.

---

## Appendix E. The browser pass, as printed

Script: a scratch Playwright probe over `dev/browser-pass/lib/env.js` (own PHP server on this
worktree, Chromium), run under `flock /tmp/engcalcs-browser.lock`, 2026-10-03. It is not committed;
every number it produced is in section 4.1, and these are the raw lines.

```
1400 editor  {"helpEls":157,"helpVisible":28,"glyphVisible":1,"bsManaged":113,"bsVisible":26,
              "nativeTitle":366,"nativeVisible":12}
tooltip appeared after ms 836
{"w":200,"font":"14px","txt":"Open\u2026 \u2014 Open a project file saved from this page."}
longest tip tooltip box [{"w":200,"h":554,"winH":900,"pe":"none"}]
same tip, max-width 22rem [{"w":352,"h":302}]
after Escape, tooltip still shown: 1
canvas rect {"x":1,"y":115.59,"w":1398,"h":783,"share":87}
390 editor   {"helpEls":157,"helpVisible":7,"glyphVisible":1,"bsManaged":113,"bsVisible":5,
              "nativeTitle":366,"nativeVisible":10}
phone canvas {"w":388,"h":727,"share":86}
```

`nativeTitle` counts every titled element not yet taken over by Bootstrap, including those inside
boxes that are closed and have not been built for tips yet, so 366 is not a number a visitor meets;
`nativeVisible` (12, 10) is. The longest tip was injected as a `.ec-help` label so the page's own
`initTips` and the page's own CSS applied; it is the real text of `lpn_settings_engine_native_tip`.
