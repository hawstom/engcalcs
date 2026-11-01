# Settings on a phone, the Labels grid, the override margin, spreadsheet cells (Ida, 2026-10-27)

Branch `box-design`, preview http://localhost:8103/engcalcs/Looped-Network.php, Chromium headless at 1400x900 and
390x844 (touch). Every number below was measured on that preview today unless tagged otherwise. Tags: CITED
(external, named), OBSERVED (this repository, path:line, or a probe of it), SPECULATION (mine).

## The five answers

1. **Phone Settings (Q3a): replace the side index with a "jump bar" at the top, not a hamburger.** A full-width
   button under the search box that always names where you are ("Node labels  v") and opens the same index as a
   list over the content. Content pane goes from 293 px to 364 px (+71 px, +24%). Zero new words.
2. **Rotate the Labels headings (Q3b): no, on neither.** Measured: rotation could save at most 28 px of the 245 px
   control group, and it costs 35 px of height on a PC. The phone's crushed headings are caused by the 71 px the
   index takes, and the jump bar removes them.
3. **Show and Drop (Q3c): yes, too wide, but less than it looks.** The box is 37.4 px; two digits need 28 px. The
   floor is the heading, not the box: "Show" is 34 px. Set the three narrow columns to 2.2rem (35.2 px). The 9 px of
   slack inside each box is only recoverable by rotating, which we decline.
4. **Override margin (Q4): the gutter is two cells and one is nearly always empty.** Today 30.4 px plus a 3 px
   line. Make it one cell, 1.1em (17.6 px), widening to two only when a row on the box needs both marks. Saves
   12.8 px on every row of Settings and of Properties.
5. **Spreadsheet cells (828 a, b):** the input IS the cell: no border, no margin, fills the Value track, same
   padding and focus mark as a Tables cell. A toggle stays a checkbox in the cell, one click on the box toggles it,
   Space toggles it from the keyboard. No Yes/No word, so no new translations.

And the glyph question: **the `?` glyph, on exactly the rows whose label is shortened or lossy, with the existing name
tip as its content. Not a glyph on every row, and never a bare hover tip on a label.** Reason below.

---

## Q3a. Phone Settings: what other apps do, and the call

**What the box does today (OBSERVED, probe at 390x844, Project1):** box x=4, width 382. Index pane 61 px wide,
content pane 293 px (index + 10 px gap = 71 px, 19% of the box). The Labels group's headings crush: "Use units"
renders 4 lines at 22 px wide ("Us / e / unit / s") and the heading row is 81.6 px tall; "Show" renders "Sho / w".
Index names wrap mid-word ("Symbo / logy", "Cust / omer"). The pane arrangement is `.lpn-setbox-panes`
`display:flex` (css/engcalcs.css:5186); the phone index width is `html:has(#lpn_canvas) .lpn-setbox-index
{flex-basis:3.8rem}` (css/engcalcs.css:6743, inside `@media (max-width: 640px)` opening at :6629).

**Comparable apps (what they do at a narrow width):**
- Android's list-detail layout shows ONE pane at a time in a small window; selecting an item makes the detail take
  the whole space and Back returns to the list. CITED: developer.android.com/develop/ui/compose/layouts/adaptive/list-detail
  ("In small windows, only one pane is visible at a time"; "the detail pane ... takes over the whole space").
- GitHub's Primer page layout has a narrow-viewport variant that either stacks the pane above the content or hides
  the pane. CITED: github.com/primer/css pull 1737 (stackRegions / pane hidden on narrow viewports); I could not
  fetch the final React API, so the prop name is not asserted.
- Chromium's own settings page hides its navigation sidebar at a small width (one user report). CITED weakly: Brave
  community report, community.brave.app "Settings sidebar does not show at default minimized window". Treat as a
  single report.
- Apple says a sidebar needs a lot of room and "a more compact control such as a tab bar may provide a better
  navigation experience". CITED: developer.apple.com/design/human-interface-guidelines/sidebars (via search summary;
  the page body did not fetch).
- Doc sites commonly put a collapsed "on this page" outline at the top of a narrow page (GitLab handbook issue
  7920, Django docs issue 494, Wikipedia-style collapsible headings in python-docs-theme issue 245). CITED:
  those three issue threads. I could not confirm Microsoft Learn or Docusaurus behaviour by fetch; not asserted.

**The evidence against a bare hamburger.** NN/g's hidden-navigation study (179-180 participants, December 2015):
hidden navigation was used 27% of the time on desktop against 48% visible and 50% "combo", on mobile 57% hidden
against 86% combo; tasks 39% slower on desktop and 15% slower on mobile. Their recommendation for mobile with many
links: hide some, show some ("combo"). CITED: nngroup.com/articles/hamburger-menus/ (fetched). This repository has
the same lesson on its own screen: two people did not see the menu bar (Task 616). So the answer is not an icon
that hides the list; it is a visible bar that SAYS where you are and opens the list.

**Why not Android-style drill-down (list page, then detail page).** SPECULATION: Settings here is one long scroll
with a search box and 20 targets; the reader's job is "go to Hydraulics, change one number, come back". A drill-down
adds a page level and a Back for every jump, and it breaks scroll-to-heading and the search's jump behaviour. Keep
one document, change only how its index is reached.

**Recommendation: the jump bar (combo navigation).**
- A button, full width of the box body, 44 px tall (the touch target), directly under the search field. Its text is
  the heading the reader is at now (the sub-heading when there is one, else the section), with a chevron drawn in
  CSS (a rotated border, so no font, no translation). It names the place, so it is not a mystery icon.
- Tap: the existing index list opens over the content, one level indented as today, `max-height: min(60%, 22rem)`,
  scrolling inside itself. Choose a row: it scrolls the content exactly as the index does today, the list closes, the
  bar's text updates. Tap the bar again, tap outside, or Escape closes it (Escape must close the list BEFORE it
  closes the box: see `ESCAPE_SCOPED_BOXES`, js/looped-network.js:52185 and `escapeOwnsBox`, :52296).
- The side index and the divider are `display:none` at <= 640 px. On a PC nothing changes.
- Words: none new. The bar shows the headings the index already shows (`setboxHeadingText()`, :64724).
- This also fixes the headings: with 364 px instead of 293 the Labels group (245 px) fits on one line with its
  headings at their own widths. Same applies to every other row in the box.
- Libraries shares `.lpn-setbox-panes` and its own phone index (css:6536, :6743). Out of scope here; if it is
  wanted, it is the same CSS scoped one id wider.

**Build spec (Sonnet agent).**

*Files and owners today.*
- Markup: Looped-Network.php:1092-1094 (`#lpn_setbox_panes`, `#lpn_setbox_index`), :1095 the divider.
- Index build: `buildSettingsIndex()` js/looped-network.js:64744; current mark `setSetboxCurrent()` :64784; jump
  `scrollSetboxTo()` :64003; opening, with the initial jump, `openSettingsBox()` :65068 (the current mark is set at
  :65119).
- There is NO scroll-spy today: `aria-current` changes only when a row is clicked, so on a phone the bar would go
  stale after a hand scroll. The spec adds one.
- CSS: `.lpn-setbox-panes` :5186, `.lpn-setbox-index` :5205, `.lpn-setbox-link*` :5285-5293, the divider :5244,
  phone block :6629 onward (index width :6743).

*Add.*
1. Looped-Network.php: before `#lpn_setbox_index`, inside `#lpn_setbox_panes`:
   `<button type="button" id="lpn_setbox_jump" class="lpn-setbox-jump" aria-expanded="false" aria-controls="lpn_setbox_index"><span class="lpn-setbox-jump-text"></span><span class="lpn-setbox-jump-chev" aria-hidden="true"></span></button>`
   No `title` (a name tip would double what the bar already says).
2. CSS, default (all widths): `.lpn-setbox-jump { display:none; }`.
3. CSS inside the existing `@media (max-width: 640px)` block, scoped `#lpn_settings_box`:
   - `.lpn-setbox-panes { flex-direction: column; gap: 0; position: relative; }`
   - `.lpn-setbox-jump { display:flex; align-items:center; justify-content:space-between; width:100%; min-height:2.75rem; padding: 0 .75rem; border:1px solid var(--ec-border-strong); background: var(--ec-chrome-bg); font: inherit; font-weight:600; text-align:start; }`
   - `.lpn-setbox-jump-chev { width:.5rem; height:.5rem; border-inline-end:2px solid currentColor; border-block-end:2px solid currentColor; transform: rotate(45deg); }` and `[aria-expanded="true"] .lpn-setbox-jump-chev { transform: rotate(-135deg); }`
   - `.lpn-setbox-index { display:none; position:absolute; inset-inline:0; top:2.75rem; z-index:3; max-height:min(60%,22rem); flex:none; background: var(--ec-box-bg); border:1px solid var(--ec-border-strong); box-shadow: var(--ec-box-shadow); padding:4px; }`
   - `.lpn-setbox-panes.lpn-jump-open .lpn-setbox-index { display:block; }`
   - `.lpn-setbox-index .lpn-setbox-link { min-height:2.75rem; }` (this overrides the 3.8rem basis, and the mid-word wraps are gone because the row is full width).
   - `.lpn-setbox-divider { display:none; }`; `.lpn-setbox-content { flex:1 1 auto; }`. Use `--ec-*` tokens only
     (chrome_colour_check refuses literals).
4. JS: in `buildSettingsIndex()` wire `#lpn_setbox_jump` click: toggle `lpn-jump-open` on `#lpn_setbox_panes` and
   `aria-expanded`. In each index link's click handler (already :64757) remove `lpn-jump-open`. A `pointerdown`
   listener on `document` that closes it when the target is outside `#lpn_setbox_index` and the bar. Escape: if
   open, close it and `stopPropagation` before the box-close path.
5. JS: `setSetboxCurrent(btn)` also writes `btn.textContent` into `.lpn-setbox-jump-text`. Add a scroll-spy:
   a rAF-throttled `scroll` listener on `#lpn_setbox_content` that picks the last `.lpn-set-head` / non-silent
   `.lpn-set-sub` whose `getBoundingClientRect().top <= content.top + sticky head height + 4` and calls
   `setSetboxCurrent()` for its index button. Run it once at the end of `openSettingsBox()` so the bar is never
   empty. It is harmless on a PC (it will highlight the index there too, which is an improvement, not a rule
   change; say so to Tom).
6. Text-direction: the chevron uses logical properties; the list is `inset-inline:0`. No new string, so the five
   RTL languages need no retranslation. Render once in ar to be sure the bar's text and chevron sit on the correct sides.

*Verify (Playwright, scratch script, not a shipped harness).*
- 390x844 touch, Project1, open Settings: `#lpn_setbox_content` width >= 360 and `scrollWidth <= clientWidth`;
  `#lpn_setbox_index` not visible; bar visible, height 44-48 px, text equals the first section heading.
- Tap the bar: index visible, overlapping the content, height <= 60% of the box; tap "Link labels": the content
  scrolled so that sub-heading is at the top within a sticky head height, the list is closed, the bar says
  "Link labels"; scroll the content by hand to "Credits": the bar says "Credits".
- Labels sub-heading on a phone: "Use units" heading <= 2 lines, no mid-word break, group on one line (width <= 245 px + indent).
- 1400x900: bar not displayed; index 116 px wide as before.
- Existing checks that measure this: `dev/lpn-spike/small-screen-harness.js` (the index/gap arithmetic named in the CSS
  comment at :5222), `dev/browser-pass/specs/labelcols.js` and `visibility.js`. They assert the old two-pane phone
  arithmetic; update them to the new one.

---

## Q3b. Rotate the Labels headings 90 degrees? No.

**The measurements (OBSERVED, probe, 13.6 px heading font):** the six columns are 35.2 / 35.2 / 29.6 / 37.4 / 37.4 /
37.4 px (css:5972-5984; Bef., Aft., Use units, 0.000, Show, Drop). A two-digit order box needs 28 px (padding 1x2,
border 2x2, 20 px of content; "100" would need 27 px of content, but the max is 99). Heading widths: "Show" 34,
"0.000" 34, "Drop" 29.5, "Bef." 24, "Aft." 20, "units" 29. So **the heading, not the input, sets the column**, by about
6 px. Rotating the three numeric headings would let the three columns go from 37.4 to 28 px: 3 x 9.4 = 28 px, 11% of
the 245 px control group, in English. In Spanish, German or French the headings are 46-49 px, but they already wrap
within the 37 px column, so rotation does not change those.

**What it costs.** The heading row goes from 20 px to about 35-55 px tall on a PC (the rotated length of "Show" /
"Use units"), per Labels list, three lists. In longer languages the vertical text length grows with the translation
(Ordre d'abandon, Mostrar, Anzeigen), and nobody has found it reads faster.

**What the field says.** Rotated headers are the vendor-documented answer when the header, not the data, sets the
column width on large numerical grids (DHTMLX pivot sample; Infragistics WinForms "rotating column headers"). CITED:
dhtmlx.com/docs/products/samples/pivot, infragistics.co.kr/help/winforms/win-rotating-column-headers. The cautions are
the font rendering differently (Telerik feedback 1375544) and the direction: bottom-to-top, bottom-aligned
(cppreference talk page, a convention note, not a standard). CITED. I found NO controlled study comparing rotated and
horizontal header reading; SPECULATION that it is slower. It is a density tool for hundreds of columns, and this
grid has six.

**On the phone it is already solved elsewhere:** the crush ("Us / e / unit / s", an 81.6 px heading row) is the
293 px pane forcing the group to shrink; 364 px (Q3a) gives every heading room. Rotation would be treating a
symptom.

**If Tom overrules this:** rotate only the 0.000 / Show / Drop heading cells (css:5976-5984 selectors, children 4 to
6 of `.lpn-set-colhead .lpn-lblgroup`, built in `columnHeadings()` js/looped-network.js:60984):
`writing-mode: vertical-rl; transform: rotate(180deg); white-space: nowrap; width: 1.75rem; min-height: 3.5rem;
text-align: start;` and column and input width `1.75rem` (28 px). In RTL languages keep the same rotation (bottom to
top); check ar and he by eye. This is the spec I am NOT recommending.

## Q3c. Show and Drop input width

**Today (OBSERVED):** the `input.lpn-digit` boxes are 37.4375 px (2.34rem, `!important`, css:5976-5984), `padding 1px 2px`,
`border 2px inset`, `type=number` with the browser's spinner, `max=99`. Content actually shown: 1 to 2 digits (values in
Net1: 1..40). A two-digit value needs 20 px of content = 28 px box.
**Target:** 35.2 px (2.2rem, the Bef./Aft. width) for the 0.000, Show and Drop columns, i.e. the heading's width plus
1 px. Saves 2.2 px x 3 = 6.6 px per row. Honest: that is all the heading allows. To make the input itself 28 px
without rotating, the heading has to leave the column, and we decline that (Q3b).
*Do also:* give `input.lpn-digit` in the Labels grid `appearance: textfield` so the hover spinner (about 15 px) does
not cover the digits in a 35 px box; arrow keys still step. `.lpn-digit` is the class on `labelCheckbox()`'s boxes
(js/looped-network.js:60629); the same class is on the size/symbol/line-width/halo inputs (:63098-63180), so scope
the change: `#lpn_labels_node_fields input.lpn-digit, #lpn_labels_link_fields input.lpn-digit,
#lpn_labels_customer_fields input.lpn-digit { appearance: textfield; }`.
Edit in css/engcalcs.css:5976-5984: change `2.34rem` to `2.2rem` in the one rule that lists children 4, 5, 6; keep the
`min-width: 15.3rem` list floor (:6006) in step: 14.05rem becomes 13.85rem.
*Verify:* Labels group width = 35.2x5 + 29.6 + 4x5 gaps = 225.6 px (was 245 px, -7.9%); headings "Show" and "0.000" do
not break mid-word in English at 1400 and 390.

## Q4. The override margin in Settings

**Measured (OBSERVED, Net1 with scenarios, scenario Max day, 1400x900):** the gutter is `padding-inline-start: 1.9em`
= 30.4 px on every `.lpn-set-row` and `[data-lpn-setting]` (css/engcalcs.css:2411), with the held marker `box-shadow:
inset 3px 0 0 var(--ec-held)` (the orange line, `.lpn-set-held`, probe-read as `rgb(232,163,61) 3px inset`). The marker
`.lpn-ovm` is 30.4 x 20.8 px made of TWO cells of 0.95em (15.2 px, css:2416): cell 1 the dot (0.5em = 8 px, centred),
cell 2 the down-triangle, which is `lpn-ovm-none` (blank) unless a child scenario holds the same value (JS
`setboxMarks()`, js/looped-network.js:64490-64515; the empty cell is appended at :64500 and :64516). So from the
orange line's left edge (x 866.2) to the dot's right edge (877.8) is 11.6 px; from there to the checkbox (897) is
**19.2 px of nothing**. Tom is right: after the dot there is more air than line plus dot.
The same pair of numbers is on the Properties box (`--lpn-g-gutw: 1.9em`, css:3860-3861, :3891) and the Properties/
Contour gutters use `.lpn-ovm-gut`/`.lpn-ovm-gut1`; the Base-scenario case there already uses one cell (.95em).
Setting the Settings box to one cell in Base too is part of this.

**Comparable apps.** I looked for a precedent for a two-cell change gutter and found one of my own: a gutter of
changed-line marks is one narrow column in diff views (VS Code's change bar is 3 px wide beside a 14 px line-number
column). SPECULATION from memory, not fetched; I am not putting a name behind a measurement. The principle is the
design's own: the gutter should cost what its widest common occupant costs.

**Recommendation.** One cell, 1.1em, which holds the dot, or the triangle if there is no dot, or both stacked into
two cells ONLY on a box where some row needs both:
- CSS css:2411: `padding-inline-start: 1.1em`. css:2413 (the column heading) `calc(1.1em / .85)`.
- css:2416: `.lpn-ovm-cell { width: .95em; }` unchanged. With 1.1em the dot sits 3.6 px from the orange line and 6 px
  from the control.
- JS `markHeldSetboxRows()` js/looped-network.js:64473: after the loop, if any `.lpn-ovm` in the box has both a
  `.lpn-ovm-dot` and a `.lpn-ovm-tri`, add class `lpn-ovm-gut2` to the box; else remove it. CSS: `#lpn_settings_box.lpn-ovm-gut2 .lpn-set-row, #lpn_settings_box.lpn-ovm-gut2 [data-lpn-setting] { padding-inline-start: 2.05em; }` and the heading likewise. A row carrying both marks then puts the dot in cell 1 and the triangle in cell 2; a row with one mark keeps it in cell 1 (the `lpn-ovm-none` filler cell is no longer drawn: delete :64500 and :64516, which add it (and :71236 for the Properties box)).
- Why box-level and not per row: a per-row gutter would stagger every control's x, which is the Task 435 defect.
- Properties box: the same change to css:3860 and css:3891 (`--lpn-g-gutw`: 1.1em; 2.05em when both). One rule, one place.
- Words and colours: none.
**Saves:** 30.4 - 17.6 = 12.8 px (42%) on every row of Settings, on a phone as well. The orange line (3 px) is unchanged;
the dot keeps its 8 px.
**Verify:** in Max day on Net1 with scenarios: `.lpn-set-row.lpn-set-held` `paddingInlineStart` = 17.6 px; dot right
edge to control left <= 7 px; `.lpn-ovm` width 15.2 px; a row where a child scenario overrides too gets 2.05em across ALL rows
of the box (the controls all stay on one x). Dot still clickable (it is `role="button"`; hit area stays 15.2 x 20.8, which
is below 44 px: on `pointer: coarse` give the cell `min-height: 2.75rem` via the row's own height, not a wider gutter).

---

## 828 pending (a). The input is the cell

**Today (OBSERVED, Properties on junction N12, 1400x900):** the Value cell contains an input 131 px (numbers) or
265 px (text) wide, `margin: 2px 6px` (css:3918), `border: 2px inset`, a 30 px box in a 34 px row, numbers
right-aligned (`.lpn-gw-num`, css:3842), computed values (Demand 150.00, Head, Pressure) are plain left-aligned text.
So an editable 50 sits right-aligned in a bordered box and a computed 150.00 sits left on white: two looks for one
column. The Tables pane is the model Tom means: `td { padding: 0 }`, the input `border:0; background:transparent;
padding:1px 4px; margin:0; border-radius:0` (css:4235-4237, rows 24 px), current cell marked by
`outline: var(--ec-focus-w) solid var(--ec-accent); outline-offset:-2px` on the cell (css:4260-4262), no focus ring on
the input (`td input:focus {outline:0}` :4263), which is the Google Sheets/Excel idiom.

**Comparable.** Google Sheets and Excel: the cell is the control; a rectangle marks the current cell; typing replaces,
F2/Enter edits. CITED loosely: Microsoft Excel checkbox support page (below); Tom's own 2026-09-06 ruling in
css:4199 (*"cells abut each other like Google Sheets, in appearance and not only in behaviour"*). AG Grid's default is
display-then-double-click-to-edit (docs, provided-cell-editors-checkbox). CITED. We do NOT want that: the Properties
box has always edited in place and Tom says "identical".

**Recommendation and spec** (Properties, spreadsheet look only, i.e. `@media (min-width: 30.01rem)` block css:3903-3925;
the phone stack (<= 30rem) keeps its above/below layout and may keep a normal border, a different job):
1. Value cell controls fill the cell: `.lpn-propbox .lpn-gprops .lpn-grow > .lpn-gval:is(input,select,textarea) {
   width: 100%; max-width: none; margin: 0; border: 0; border-radius: 0; background: transparent;
   padding: 4px 6px; box-sizing: border-box; align-self: stretch; }`. This REPLACES css:3918-3919 (`margin: 2px 6px`;
   `width: calc(100% - 12px)`). `padding: 4px 6px` equals the Label cell's (css:3917), so editable and read-only
   values share one x and one baseline.
2. Alignment: `text-align: start` for every Value-cell control, numbers included (remove the right-align from
   `.lpn-gw-num` inside `.lpn-propbox`). A vertical list of mixed values reads against its left edge; this is also
   what the read-only values already do. Number boxes lose their `--d` width and take the track (the Value track is
   already sized by `gcolApply()`, js/looped-network.js:25127, and the user's divider).
3. Row height: remove the 34 px; `min-height: 1.75rem` (28 px) on `.lpn-grow`; the 4 px padding gives 13.6 px text plus 8 = about 28.
4. Current cell: `.lpn-propbox .lpn-gprops .lpn-grow > .lpn-gval:focus { outline: var(--ec-focus-w) solid var(--ec-accent); outline-offset: -2px; }`. (Not `:focus-within`
   on the row: here each cell has one control, so `:focus` on the control, drawn inside the cell, is the same picture with none of the invalidation cost.)
5. Select: `appearance: auto` stays (the chevron is the signal), border and background as 1.
6. Textarea (Description): same, `resize: vertical`.
7. Disabled/greyed: keep today's `:disabled` colour; do not add a read-only tint (see below).
8. Read-only computed values: unchanged text in the same padding. Optional, my call is NO: a faint tint on computed
   cells. Tables does not tint them either, and Tom said identical.
9. The row rule (the 1 px `border-strong` lines, css:3913) stays: it is what makes the grid read as cells.

**Verify:** on junction N12 the Elevation value input's `getBoundingClientRect()` equals its cell's content box
(width = Value track, height = row), border 0, computed `margin` 0; focus draws the 2 px inset accent outline on the cell; text in an editable cell and in
a read-only cell starts at the same x (+-1 px); no horizontal scroll; the 828 harness/dev specs for Properties
(`dev/browser-pass/specs/`, whichever one measures the box) re-baselined. Compare with a screenshot of the Tables cell for the same
property.

## 828 pending (b). Toggles in a cell

**2026 conventions (what I could fetch):**
- Excel (Microsoft 365): a checkbox is a control in the cell; "click on the check box", or select it and press
  Spacebar; its value is TRUE or FALSE. CITED: support.microsoft.com/en-us/office/using-checkboxes-in-excel-da85546d-c110-49b8-b633-9cebadcaf8d4 (fetched; the page lists only Excel for Microsoft 365 and Microsoft 365 for Mac).
- Google Sheets: a checkbox in a cell; Spacebar toggles the selected one; arrow keys move; dragging across several selects, it does not tick them. CITED weakly: thebricks.com guide, via search summary, not the Google help page.
- Airtable: hover the cell and click the checkbox. CITED: support.airtable.com/docs/checkbox-field (search summary).
- Notion databases: click the cell or arrow to it, press Space to toggle. CITED weakly (a glossary page, not Notion's help).
- AG Grid: a checkbox cell renderer shows the value; the editor appears only when editing starts (double click). CITED: ag-grid.com provided-cell-editors-checkbox. Single-click toggle is not confirmed there.
- Switch versus checkbox: a switch applies at once and suits one independent option; checkboxes suit several options in a list or a table. CITED: PatternFly switch and checkbox design guidelines (patternfly.org/2022.05/components/switch/design-guidelines), and older Material selection-controls docs. I could not fetch Material 3's own page.
- Bentley WaterGEMS: Tom reports it converted booleans to Yes/No selectors. NOT verified by me; I have no fetched source. A selector is two clicks and a list where a checkbox is one click.

**The convention is: a checkbox IN the cell, one click on the box toggles it, Space toggles from the keyboard, the current-cell rectangle says
where you are. No switch (this is a grid, and a switch is for a lone setting), no Yes/No selector (slower, and
two more words in 27 languages).** The Tables pane already does exactly this (the Is active column in my screenshot).

**Recommendation and spec** (Properties):
- A boolean Value cell holds one checkbox at the start of the cell (not centred: the column is a left-aligned list), 1.125rem (18 px)
  box, `margin: 0`, cell padding as in (a). Where the row is a `<label>` the existing behaviour (clicking the name toggles it) stays;
  that is a bonus, not a rule, and the row's own `for` target is the box.
- Keyboard: the box, as a control, already takes Space. Tab and Arrow Up/Down move to the neighbouring cell's control (this is what
  the Tables grid does; if the Properties grid has no arrow navigation yet, that is a separate roadmap card, not part of this).
- Touch: on `@media (pointer: coarse)` the hit area is the whole cell (make the checkbox's `::after` or its wrapping label stretch to the cell with
  `position: absolute; inset: 0`), because 18 px is under the 44 px target. On a pointer the box only.
- The `Is active?` double question mark (label study) is a separate fix.
- Words: none. Accessible name stays the row's label.
**Verify:** Click the box: toggles once, one undo step; click empty cell space on a PC: does not toggle (selection only, as Excel); Space on the focused
box toggles; at `pointer: coarse` emulation (`hasTouch`), tap anywhere in the cell toggles; Properties row height unchanged (28 px).

---

## The `?` glyph versus the hover name tip, in a dense Properties grid

**Current state (OBSERVED):** a Properties name cell is `findHelpLabel(text, tip, true)` (js/looped-network.js:25073), a
`.lpn-gname.ec-help` that wraps BOTH the label text and a trailing `.ec-tip` `?` glyph, so the whole label is the tap
target (css:3833-3837). CLAUDE.md: exactly one `?` per label, always the tip; one style of tip, armed by `wireTipDelegation()`
(js/Calculators.lib.js:499) from `title`.

**The call.** Keep the `?` glyph, on the row whenever its label is shortened or lossy, and give it the full phrase and the one-sentence explanation as
its tip. Do not add a tip to a row whose label is already the whole truth ("Elevation"), and never leave a bare hover title on a label cell.
- NN/g: tooltips "are not normally available on touchscreens", "hard to discover because they often lack visual cues";
  the touch-friendly kind is the popup tip opened by a `?` or `i`; "apply them consistently; if only some elements need
  explanation, use popup tips for those instead". CITED: nngroup.com/articles/tooltip-guidelines/ (fetched).
  The `?` is the visual cue; the hover is the pointer's shortcut to the same text; the whole label is the target, so the
  glyph's 12 px is no hazard.
- Cost: the glyph is about 0.85em plus a 0.25em gap, 14 px, flowing after the label's last word (css:3835-3837), so it adds
  to the name column only on a row that already wraps. A glyph on all 70 rows would spend the name column on punctuation and dilute the signal: a `?` that means
  "this label is shortened" is information, on every row it is wallpaper.
- Tom's condition ("tips, possibly `?` glyphs, for every short label that expands on things like 'Wall reaction'"): add a
  check that every Properties row whose label comes from a `lpn_*_short` key (or the ten renames in label-study-2026-10-26.md) carries a tip,
  `ecTipLabel` rules apply. That is a check for a defect a visitor could hit that a person would miss.
  Words in 27 languages: tips are new strings only where one does not exist; the labels' own tips mostly do.

---

## What I did not or could not establish
- NOT FETCHED: Material 3 switch/checkbox/tooltip pages (bodies empty), Apple HIG sidebars body, Microsoft Learn and Docusaurus mobile TOC,
  Google Sheets help for checkbox cells, Airtable and Notion first-party grid behaviour, WaterGEMS FlexTable boolean editing.
- SPECULATION: a drill-down would hurt here; diff-gutter precedent; rotated headers read slower; the scroll-spy highlighting on PC being welcome.
- Screenshots are in the session scratchpad, not committed.
