# Dockable box widths: Tom's browser pass and the full checklist

Branch `fix/dock-widths` (Task 825). Harness: `node dev/lpn-spike/dock-width-harness.js` (27 checks).

## Tom's browser pass (open Looped-Network on a fresh browser profile at about 1600 px wide)

1. Settings tab (right edge): fly it out. It should be 540 px wide (it was 360). Open Node labels. No label is cut off; the Decimals, Show and Drop boxes are narrower than before.
2. Fly out each other tab in turn. The report-type boxes on the left (Pump energy, Scenario comparison, Run report, Status changes, Calibration, Full report) are wide, 832 px. Find and replace is narrow (352), Contour plot 384, Properties 448, Libraries 704. If any width feels wrong, say which box and a number; each is one line in the table below.
3. Float Settings, then click its dock-left button. It docks at 540. Do the same for Libraries (704) and Contour plot (384).
4. Drag a floating box to a width of your own, then dock it. It keeps your width.
5. Resize a docked box by its edge, reload. It keeps the width you set.
6. Narrow the window to about 1100 px and fly out Run report. It is capped to the room, never past the window.

## The checklist

Optimal width is what the box's own CSS gives it floating, except Settings and Properties (two overrides in `LPN_DOCK_OPTIMAL_REM` in `js/looped-network.js`; changing a number there changes the docked width, and nothing else). Widths in px at the 16 px root font, at a 1600 px window. "Docked before" is the old shared 360 px for the default docks; a box the visitor docked used its floating width. "Truncation" is whether the box's own content is drawn whole at the docked width.

| Box | Id | Optimal | Docked before | Docked now | Truncation check |
|---|---|---|---|---|---|
| Pump energy report | lpn_energy_box | 832 (52 rem) | 360 | 832 | Harness: width only. Browser pass |
| Scenario comparison | lpn_scncmp_box | 832 | 360 | 832 | Harness: width only. Browser pass |
| Run report | lpn_rptbox | 832 | 360 | 832 | Harness: width only. Browser pass |
| Status changes | lpn_status_box | 832 | 360 | 832 | Harness: width only. Browser pass |
| Calibration report | lpn_calib_box | 832 | 360 | 832 | Harness: width only. Browser pass |
| Full report | lpn_full_box | 832 | 360 | 832 | Harness: width only. Browser pass |
| Settings | lpn_settings_box | 540 (33.75 rem; floats at 462) | 360 | 540 | Harness: Node labels rows checked, nothing past the pane, no label cut. Other sections: browser pass |
| Properties | lpn_popup | 448 (28 rem; sizes to its rows when open) | 360 | 448 | Harness: width only. Browser pass |
| Find and replace | lpn_find_popup | 352 (22 rem) | 360 | 352 | Harness: width only. Browser pass |
| Libraries | lpn_library_box | 704 (44 rem) | 360 | 704 | Harness: width only. Browser pass |
| Contour plot | lpn_contour_box | 384 (24 rem) | 360 | 384 | Harness: width only. Browser pass |
| Fire flow analysis | lpn_ff_box | 832 | 360 | 832 | Harness: width only. Browser pass |
| Criticality analysis | lpn_crit_box | 832 | 360 | 832 | Harness: width only. Browser pass |
| Demand scaling | lpn_ds_box | 832 | 360 | 832 | Harness: width only. Browser pass |
| Scenario manager | lpn_sm_box | 352 (22 rem) | own rule | own rule: widens to its table (Task 746 code) | Not changed; browser pass |
| Screenshot | lpn_snip_box | 288 (18 rem) | 360 | 288 | Not in the harness. Browser pass |
| Manual (Guide) | lpn_hotkeys_popup | 992 (62 rem) | 360 | 992 | Not in the harness. Browser pass |
| A pane tab popped out as a box | lpn_pane_* | 480 (30 rem) | 480 | 480 | Unchanged; browser pass |

Also changed in this branch: the Decimals, Show and Drop columns of the label rows (`LPN_LABEL_COL_W`) from 2.6 rem to 2.34 rem (90%).

## What is not covered

The harness proves widths and the Node labels rows. It does not read every Settings section, nor the inside of the 832 px reports; those are the browser pass above. At a narrow window the docked width is capped to the room beside the map (unchanged behavior).
