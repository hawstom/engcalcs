# Dockable box widths: measurements and Tom's checklist

Task 825. Harness: `node dev/lpn-spike/dock-width-harness.js` (it prints the measurement table below each
run). Cut text: `node dev/lpn-spike/box-cut-label-probe.js` (fails today, so it is not run by `run_harnesses.sh`).

## How a width is chosen

Each docked width is **measured from the box's own content**, not taken from its floating CSS.
`dev/lpn-spike/box-natural-width.js` sets the box to every width from 240 to 1400 px in 8 px
steps, on Net3 after its run (and, for Fire flow, Criticality and Demand scaling, after the analysis
has run too). It leaves out prose paragraphs, pictures and charts, which wrap or stretch to any
width. The measured width is the narrowest at which nothing scrolls sideways, at most two short
labels wrap that would not wrap with all the room in the world, and the content is at most 2% (plus
8 px) taller than it is then. The docked width is that, rounded up to half a rem, with two limits:

- **Floor 20 rem (320 px)**, so a note under a two-column table still reads as a sentence.
- **Cap 52 rem (832 px)**, so the map keeps about half of a 1600 px window. A box measured wider
  than that docks at the cap, and its table wraps its headings.

The Manual is prose; it docks so its reading column is about 36 rem (580 px).

The numbers live in `LPN_DOCK_OPTIMAL_REM` in `js/looped-network.js`. Changing one changes that box's
docked width and nothing else; the harness then says whether the content agrees. Two boxes may share
a width only when each has its own reason (both past the cap, or two measurements that agree).

## The table (English; widths read off the page 2026-11-01, after box-design merged)

Measured by `dev/lpn-spike/box-cut-label-probe.js` on Net1 and Net3 (`EC_SHOTS=<dir>` saves a picture of
every case; the ones from 2026-11-01 are `box825-<net>-<view>-<float|dock>-<box>.png`). PC is 1366x768,
phone 390x844 touch. "Cut" means the text is clipped with no scrollbar to reveal it (the probe's
definition); the rows say which text. Net1 and Net3 agree unless a row says otherwise. Not covered:
an analysis box (Fire flow, Criticality, Demand scaling) after its own run, and a long translation.

| Box | Docked PC | Floating PC | Phone (floating) | Cut text |
|---|---|---|---|---|
| Pump energy report | 416 (26 rem) | 832 | 382 | none |
| Scenario comparison | 832, cap | 832 | 382 | none; scrolls sideways inside its table on a phone ("Lowest pressure", "Junction") |
| Run report | 544 (34 rem) | 832 | 382 | none; its text lines scroll sideways on a phone |
| Status changes | 320, floor | 832 | 382 | none |
| Calibration report | 320, floor (was 496) | 832 | 382 | none |
| Full report | 832, cap | 832 | 382 | none; scrolls sideways inside its table on a phone |
| Scenario manager | own rule | 352 on Net3, 1050 on Net1 (widens to its table) | 382 | none after wrapping (was: scenario names on a 273 px phone dock) |
| Settings | 618 (38.6 rem; was 552) | 618 | 382 floating, 273 docked | no cut label after wrapping (was 14 on PC, 60+ on a phone); the unit cells "Qb=", "Init.", "mg/L", "km=", "Cb=", "Cw=" are cut values |
| Properties | 320 (20 rem; was 416) | 413 on Net1, 402 on Net3 | 382 floating, 273 docked | none after wrapping (was: "Emitter coefficient ()", "Chlorine concentration ()" and their units on a 273 px phone dock); Net3 junction coordinates at 320 are values |
| Demand categories | 328 | 328 | 382 | none; the title is clipped plain, never "Demand catego..." |
| Find and replace | 368 (23 rem) | 352 | 382 | none |
| Libraries | 432 (27 rem) | 704 | 382 floating, 273 docked | PC docked and phone: the curve-point lists in Net3's pattern and curve rows (values, e.g. "1.34 1.94 1.46 ..."), cut in their input field |
| Contour plot | 320 (floor) | 408 | 382 | none |
| Fire flow analysis | 560 (35 rem) | 832 | 382 | none before a run |
| Criticality analysis | 528 (33 rem) | 832 | 382 | none before a run |
| Demand scaling | 328 (20.5 rem; was 384) | 832 | 382 | none before a run |
| User manual | 848 (53 rem) | 992 | 382 floating, 273 docked | none (its search-anchor headings are hidden on purpose) |
| Screenshot, a pane tab popped out | not measured | not measured | not measured | not measured |

On a phone every box takes the window's width (382) when it floats and at most 70% of it (273) when it
docks. A box the visitor docks by its button takes the width it had floating (floor 320; the map's minimum
caps it) and saves it as its docked width.

Rows that look fine, with no cut text and no sideways scroll at any width tried: Pump energy report,
Status changes, Calibration report, Find and replace, Contour plot, Fire flow, Criticality, Demand
scaling, User manual, and every report box on a PC.

Also in this branch: the Decimals, Show and Drop columns of the label rows are 2.34 rem (90% of 2.6).
A row without one of those boxes holds the column open with a spacer, and the spacer is now the same
2.34 rem; it was still 2.6 in `css/engcalcs.css`, which put every such row (ID, Description, Tag,
Initial status, Status, Water age) up to 12 px left of the others.

## Tom's browser pass (open Looped-Network on a fresh browser profile at about 1600 px wide)

1. Settings tab (right edge): fly it out. Node labels, Link labels and Customer: every column of
   boxes is straight, the rows without a Decimals box included. Choose Water age under Quality and
   look again.
2. Fly out each other tab in turn. Each box has its own width (table above). If one feels wrong, say
   which box and a number.
3. Float Settings, then click its dock-left button. It docks at 552. Do the same for Libraries (432)
   and Contour plot (336).
4. Drag a floating box to a width of your own, then dock it. It docks at that width (not under 320), and keeps it after a reload.
   Fly out any docked box by pointing at its tab, click a button inside it and move off: it stays out until you press on the map or another tab, or Escape.
5. Resize a docked box by its edge, reload. It keeps the width you set.
6. Narrow the window to about 1100 px and fly out Full report. It is capped to the room, never past
   the window.

## Result of the probe, after wrapping (branch `fix/name-wrap`, 2026-11-01)

A label or name now wraps as many lines as it needs, on one shared rule (`.lpn-gname`, the Settings row, the
Scenario manager name, the theme button name, the "Saved in this browser" badge), over the Label column's
floor. Nothing is clipped and no ellipsis is drawn anywhere in the box style; a box title too long for its
bar is clipped plain, so the bar's buttons stay where they are.
`box-label-wrap-browser-harness.js` opens Settings, Properties, Scenario manager and Demand categories in
English and Spanish, on a PC (floating and docked) and a phone (floating and docked at 273) and finds no cut
label, no ellipsis and, in Demand categories, exactly its four columns with no rule inside the last.

- **Settings, Properties, Scenario manager on a phone dock (273):** no cut label (was 60+, two, two).
- **Demand categories:** the stray vertical line was the border before the unlabeled delete column, drawn
  even when a lone row has no button; it is gone, and the delete column is narrower so Description has room.
  The title keeps its words and is clipped at the bar with no "...".
- **What is still cut, as values and not labels:** the unit cells beside a number ("Qb=", "Init.",
  "mg/L", "km=", "Cb=", "Cw=") and Libraries' curve-point lists, which are inside their own input.
- **Docked widths** (table above) are unchanged; Properties 320 and Demand categories 328 hold their text by
  wrapping now.

## What is not covered

Measured in English only; a longer translation can need more. Calibration was measured with no
calibration file loaded. Scenario comparison was measured with the Base scenario only. A box the
visitor docked on an earlier preview of this branch kept the width it docked at then; a fresh
profile shows the new widths.
