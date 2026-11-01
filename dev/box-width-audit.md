# Dockable box widths: measurements and Tom's checklist

Branch `fix/dock-widths` (Task 825). Harness: `node dev/lpn-spike/dock-width-harness.js` (73 checks;
it prints the measurement table below each run).

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

## The table (English, 16 px root font, 1600 px window)

| Box | Measured | Docked | What sets it |
|---|---|---|---|
| Pump energy report | 496 | 496 (31 rem) | The pump table's headings (% of run, Avg. kW, Peak kW) |
| Scenario comparison | 1056 | 832, cap | Its scenario table's headings; wider with more scenarios |
| Run report | 544 | 544 (34 rem) | The EPANET text report's line length |
| Status changes | 256 | 320, floor | The title bar; the table is only Time and Event |
| Calibration report | 496 | 496 (31 rem) | The Parameter row; measured with no calibration file loaded |
| Full report | 1248 | 832, cap | Eleven result columns |
| Settings | 552 | 552 (34.5 rem) | The label rows, with "Bulk reaction coefficient" on one line |
| Properties | 416 | 416 (26 rem) | A junction's demand table (a pipe needs 352) |
| Find and replace | 368 | 368 (23 rem) | Its condition rows |
| Libraries | 432 | 432 (27 rem) | Its section list ("Pipe types") and the pattern rows |
| Contour plot | 336 | 320 (floor) | Tom: narrower. Three labels wrap onto two lines; nothing scrolls |
| Fire flow analysis | 1272 after a run (456 before) | 560 (35 rem) | Tom: far too wide. Controls need 456; the ten-column results table wraps its headings and scrolls sideways inside its own container (777 px in 542) |
| Criticality analysis | 792 after a run (344 before) | 528 (33 rem) | Tom: 50% too wide. Controls need 344; the four-column table fits at 528 with its "Worst effect" cells wrapping onto more lines |
| Demand scaling | 384 after a run | 384 (24 rem) | Its setting rows and verdict |
| User manual | prose | 848 (53 rem) | Contents list plus a 36 rem reading column |
| Scenario manager | not measured | own rule | Widens to its table (Task 746 code); unchanged |
| Screenshot | not measured | 288 (its CSS) | Not in the table; docks at its floating width |
| A pane tab popped out as a box | not measured | 480 (its CSS) | Unchanged |

A box the visitor docks by its button takes the width it had floating (floor 320; the map's minimum caps it) and saves it as its docked width. Floating widths are unchanged: the report-type boxes still float at 52 rem.

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

## What is not covered

Measured in English only; a longer translation can need more. Calibration was measured with no
calibration file loaded. Scenario comparison was measured with the Base scenario only. A box the
visitor docked on an earlier preview of this branch kept the width it docked at then; a fresh
profile shows the new widths.
