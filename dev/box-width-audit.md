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
| Scenario manager | own rule | 352 on Net3, 1050 on Net1 (widens to its table) | 382 | on a phone docked at 273: scenario names "Max day with main break", "Peak hour with main break" (Net1) |
| Settings | 618 (38.6 rem; was 552) | 618 | 382 floating, 273 docked | **PC, both:** "Average Chlorine concentration", "Show labels when zoomed to this map width", "Text halo width (percent of text size)", "Label flip angle adjustment (degrees)", "Snap leader lines to set angles", "Prevent nodes from scaling larger than", "Draw link labels along the link line", "Solid background behind labels", "Time series graphs on the map", "Background image opacity (0 to 1)", "Show override markers on the map", "Use the built-in solver when possible", "Bulk reaction coefficient (1/day)", "Wall reaction coefficient (ft/day)" (Net3 lacks the first); the Before and unit boxes hold "Qb=", "Init.", "mg/L", "km=", "Cb=", "Cw=" slightly cut. **Phone:** more than sixty labels, among them "Head loss gradient", "Elevation and head", "Map coordinates", "Data classification method", "Friction method", "Demand model", "Pump efficiency (percent)" |
| Properties | 320 (20 rem; was 416) | 413 on Net1, 402 on Net3 | 382 floating, 273 docked | PC none, except the Net3 junction's coordinates "2223768.890508" and "5968033.952953" at 320. Phone docked 273: "Emitter coefficient ()", "Chlorine concentration ()" and their unit "gpm/psi", "mg/L" |
| Demand categories | 328 | 328 | 382 | docked on PC: "Demand categories (10)" (Net1 and Net3) |
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

## What Tom should look at with his own eyes

1. **Settings** is the one box with cut labels on a PC, at its own width, docked or floating: about a dozen
   rows in the Map, Calculation and Quality sections (list in the table). They are clipped without an
   ellipsis and without a tip, as box-design chose; Task 852 decides whether that is acceptable for a name
   a visitor must read. The "Head loss gradient" label Tom found is cut on a phone only, at 273 docked
   and at 382 floating.
2. **Settings on a phone** (docked 273): more than sixty labels cut. The two-column row keeps the name column
   at a fixed share, so the name is what is lost.
3. **Properties on a phone, docked**, junction with Chlorine concentration or Emitter coefficient: the
   labels and their units are cut. **Scenario manager on a phone, docked**: scenario names.
4. **Libraries**, a curve's point list: it is cut inside its input; check whether that field scrolls or
   can be widened.
5. **Demand categories docked on a PC**: the button text "Demand categories (10)" is clipped at 328.
6. The docked widths that changed since the last audit: Pump energy 496 to 416, Calibration 496 to 320,
   Settings 552 to 618, Properties 416 to 320, Demand scaling 384 to 328. Check each feels right.
7. In the probe's run with `EC_DEFAULT_DOCKS` on, these boxes opened floating from their menu rows, not docked (Pump energy, Scenario comparison, Run
   report, Status changes, Calibration, Full report, Demand categories, Find, Contour plot, the analyses)
   so their "Docked PC" widths above are the stored ones (`LPN_DOCK_OPTIMAL_REM`), not observed. If they should
   open docked, that is a finding.

## What is not covered

Measured in English only; a longer translation can need more. Calibration was measured with no
calibration file loaded. Scenario comparison was measured with the Base scenario only. A box the
visitor docked on an earlier preview of this branch kept the width it docked at then; a fresh
profile shows the new widths.
