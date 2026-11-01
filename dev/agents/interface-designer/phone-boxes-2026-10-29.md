# Ida: box-design on a phone (390x844, touch, Chromium; Net3 tank selected)
Tags: OBSERVED = rendered/measured in worktree; SPECULATION = my inference.
Screenshots: scratchpad/ida-1-props.png (Properties), ida-2-settings.png (Settings), ida-0-map.png.

What the phone does today (OBSERVED, css/engcalcs.css:4001-4047, `@media (max-width:30rem)`):
Properties is a STACKED sheet: label above value, one cell per ~59 px (measured row tops 219, 268, 324, 384...). The
divider is `display:none` there (computed). The box is 272 px wide of 390, left edge at x=114, so it is a half-covered map.
A tank is about 20 rows -> ~1200 px of scroll for 272 px of width. So Tom's "not in two columns" is correct and it is costly.

(a) DIVIDER ON TOUCH. Tom's instinct is right; the 6 px strip is not the problem, a visible fat graphic would be (I did not
see one on the phone, since it is hidden under 30rem; the "obnoxious" one is probably Settings' `.lpn-setbox-divider`
and the pane splitter at css:5237 (8 px, position:fixed) / 5362 (6 px with -8px margins)). Spec for ONE shared divider:
- Painted line: 1 px, `--ec-border-strong` (the gridline it already is). It IS the column gridline; no handle, no grip dots.
- Hit area: 24 px wide, centred on the line (12 px each side), invisible, `touch-action:none` (already), full row height.
  Use `@media (pointer:coarse)` to widen from 6 to 24; keep 6-8 px for mouse. NOT 44: the name column is ~100 px, and
  44 would sit on top of the label's last letters and the first characters of the value. 24 plus the 6 px pad inside the
  Value cell's left padding (4-6 px) means the hit zone overlaps cell padding, not text, on a typical row.
- Never let it win over a control: z-index below inputs' focus; a tap (no movement) on the zone passes through to the cell
  (`pointerdown` captured only after 4 px of travel on touch) so taps on a value still focus it. Hit area stops 12 px short
  of any checkbox's box.
- Hover/active: hover (pointer only) line goes 2 px `--ec-accent`; during drag the same 2 px line, nothing else; on touch
  add the same 2 px accent for the duration of the press, and a ~12 x 40 px pill grip appears ONLY while pressed, centred
  vertically on the finger, and gone on release (SPECULATION: it tells a finger the line is held, without a permanent graphic).
- Double-tap/double-click on the zone restores the default width (the Tables column gesture already does, js:32807).
- Do not show the affordance at rest on touch. Discoverable by the cursor on PC; on a phone dragging is rare (see b).

(b) PROPERTIES ON A PHONE: YES, two columns, with limits. Argument: 20 stacked rows cost ~1200 px; two-column rows at the PC
28 px height cost ~560 px, so a pipe or tank fits without scrolling on an 844 px screen. The label-above-value form spends
half of its height saying nothing. Tom's assumption holds, with three corrections:
1. "No minimum input column width" is right for text, but not literally zero. Floor 5.5rem (~88 px) for the Value track, so
   a number of 7-8 characters ("2237051.109") fits; below that it ellipsizes (the sheet already does). The css has
   `min-width:6em` at 4018 and `minmax(3em,1fr)` at 3830; drop the 6em/4em phone mins, keep the 3em track floor.
2. Split. Box is 272 px (widen it to `calc(100vw - 16px)` = 374 on phone: that single change buys 100 px, which is what makes
   two columns work; the 114 px left strip of map is not useful anyway, it is half a map label). Default Label column
   = 40% (~140 px) at 374, ~108 px at 272; Value takes the rest. Label wraps at spaces, then mid-word, two lines max
   (Tom's standing call), 11-12 px text; row grows to 2 lines (~44 px) only when a label wraps. Draggable, remembered
   in `lpn_gcols` per box (not per viewport width: a phone and a PC keep separate storage keys only if localStorage differs
   by device, which it does; fine).
3. Wide inputs do NOT go two-column. Description (textarea), Tag if long, and anything with a `.lpn-gspan*` stay as today:
   a full-width row, label above, because a 100 px value box cannot show a sentence. Same for the two-line From/To node
   pair: label above, value below (a node id is short, so it may stay two-column; I would two-column it).
4. Time series drop-down (`.lpn-ts-pick`): Value column, ellipsized; the native select opens full width on a phone anyway.
   DEM buttons ("Read DEM", "Use DEM"): they are chunky 3 px-bordered buttons at the foot of the Elevation row. Keep them
   as a full-width button row BELOW the row (they are not a Label/Value pair), two buttons each 50%, min height 40 px, the
   existing 1.5px border. Do not try to put them in the Value cell.
5. Checkboxes: 20 px visible box inside a 40 px row/Value-cell tap area (the whole cell toggles).
Touch rows: 28 px is below a 44 px finger target. Make the rows `min-height: 2.5rem` (40 px) under `pointer:coarse` instead of
the desktop 1.75rem; two-column at 40 px = ~800 px for 20 rows; still better than 1200.

(c) ONE CONVENTION? One structure, two sizes. Same grid, same Label|Value cells, same hairline, same divider (line, 1 px).
Differs only by `pointer: coarse`, not by viewport width: (1) row height 28 -> 40 px; (2) divider hit area 6 -> 24 px;
(3) box width on phone fills the screen minus 8-16 px; (4) the column-heading row stays off (no header, WaterGEMS), so there
is nothing to differ. Do NOT switch to stacked below 30rem for any box: today's stack rule (4001, and the "host under
18 rem" rule at 3820) is the thing Tom noticed. Keep stacked only for a host narrower than ~16rem (a true collapse, e.g.
a 240 px dock), where a 40/60 split would leave under 90 px of value.

(d) OTHER EMBARRASSMENTS, ranked (all OBSERVED in the screenshots):
1. Properties covers 70% of the screen and leaves a 114 px strip of half-clipped map labels at the left (ida-1). Either
   fill the width (above) or dock it as a bottom sheet, but not this. The strip reads as a rendering defect.
2. Settings > Node labels is a six-column grid squeezed into 390 px: Bef./Aft./Use units/0.000/Show/Drop headings
   misaligned with inputs, input heights 28 px and inputs each only two characters wide ("Qb=" clipped to "Qb="), a ~60 px tall
   row per label; heavy 2 px borders on every field versus the new borderless cells in Properties. It is the old look; the
   uniform convention should reach here (ida-2).
3. Empty Description cell has NO visible cell at all on the phone (blank band under "Description", nothing says "type here"),
   while Tag has a heavy blue focus rectangle: in the stacked phone mode the focus is the only mark. Add the hairline cell
   or at least a 1 px underline on editable cells under pointer:coarse (the hover fill does not exist on touch).
4. The Read DEM / Use DEM buttons: heavy bevel, 3 px, black-ish border, out of style with the sheet (ida-1).
5. Settings' pane resize handle (diagonal grip, bottom-right, ida-2) is a mouse artefact on a phone box that already fills
   the width; hide the resize grip at pointer:coarse.

Wishlist hopper note (for Ida's wishlist.md): one-line: a `pointer:coarse` convention (row height, hit areas) written once in a
single token block, so no box re-decides it.
