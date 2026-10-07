# User guide audit, 2026-10-07

Tom's browser pass on `feat/user-guide` asked what the Guide's chapters leave out. Find and replace
was rewritten as the exemplar (query language, worked examples measured on Net1 and Net3 by
`dev/lpn-spike/user-guide-find-harness.js`, results and Tables, Replace and Undo, points to note).
Every other chapter was audited from the source code, not from earlier docs, and is recorded here
for a later rewrite. Each section has (a) what the code does that the chapter omits, (b) statements
the code contradicts, and (c) one engineering example of why the feature matters.

Function names are in `js/looped-network.js` unless another file is named.

## The rewrite pattern (Find and replace)

What makes a chapter a step better, as applied to Find and replace:

1. **What it is for**, in engineering terms: check a model before it is solved, list problem
   locations after, and make one correction on many assets.
2. **The grammar or the rules**, short and complete, including what is not there (no NOT).
3. **Worked examples on a shipped network** with the measured answer, held by a harness so the text
   cannot drift from the code.
4. **How it connects** to the rest of the page (selection, Tables, Undo, scenarios).
5. **Points that surprise**: precision, stale results, text order, scope limits.

Questions to put to every chapter: What is it for? What does it change in the project, and what does
it only report? What is saved, and where (project, browser, nowhere)? What does a scenario do to it?
Which engine produces it, and when is it empty or stale? What does Undo do? What happens on a phone?

## Toolbar

(a) Omits:
- "Dimmed" means only that the button has no on-screen box (`guideToolbarRows()`). A button that is
  visible but disabled, such as Undo with nothing to undo, is not dimmed.
- On a phone, CSS hides every toolbar group except the run transport, so nearly every row is dimmed;
  a row then opens its menu twin (`guideShow()`). The bottom-pane toggle has no twin and does nothing.
- Calculate is hidden while Recalculate automatically is on (`lpn-time.js`), and the row dims live.
- Two-state buttons show only their current name: Zoom to fit becomes Zoom window on a second press
  (`paintZoomToolButton()`); Select area cycles through its shapes.

(b) Contradicts: none found.

(c) Example: on a large model, clear Recalculate automatically, change C-factors on a batch of mains,
then press Calculate once. The Guide shows Calculate dimmed until the setting is cleared.

## Menus

(a) Omits:
- Alt+Shift+letter reads the physical key (`LPN_MENU_CHORDS`, `e.code`), so the letters are fixed
  QWERTY positions in every language and keyboard layout.
- After F10, a menu's letter alone opens it; Esc on the bar returns focus to where it was.
- The Guide's list leaves out hidden rows, headings, and variable rows (recent files, scenario names),
  goes one fly-out deep, and omits the Language menu (`guideMenuEntries()`).
- Rows that are disabled now (Map, World map without a placement) are listed with no sign of it.

(b) Contradicts: "then press a row's letter to choose it". Pointer-only rows (Screenshot, the Insert
tools, Select a window, lasso, or polygon) have no letter and the arrow keys skip them
(`menuMnemonics()`, `menuRowsOf()`).

(c) Example: checking whether a tank drains over 24 hours: Alt+Shift+W, then the Graphs and Time
series letters, opens the tank level graph without the mouse.

## Map

(a) Omits:
- 0 is the tenth tool, Junction and pipe (`LPN_TOOL_KEYS`); the table lists 1 to 9.
- Redo is Ctrl+Y or Ctrl+Shift+Z, not listed.
- Undo keeps 20 steps in memory only, cleared on switching projects (`UNDO_LIMIT`, `clearUndo()`);
  each step also restores scenarios, the active scenario, and units.
- In a scenario other than Base, Delete makes the element inactive in that scenario instead of
  deleting it, and a node takes its pipes with it (`deleteElement()`). Customers are deleted outright.
- Backspace also deletes; neither key acts while typing in a field.
- Esc closes one thing at a time; a half-drawn pipe takes one Esc to drop the drawing and a second to
  return to Select.
- On a selected table cell, a digit overwrites the cell instead of choosing a tool.

(b) Contradicts: none found.

(c) Example: in a "Main break" scenario, select a transmission main and press Delete. It is out of
service in that scenario only, so the low pressures it causes can be compared with Base.

## Screenshot (section, and the Screenshot box)

(a) Omits:
- Magnification (1 to 4 times, default 3) is kept in this browser (`lpn_snipbox`); the rectangle or
  freehand choice lasts for the session only.
- On a phone the box never opens, so there is no S key, shape choice, or repeat.
- The picture size is capped: the scale drops below the chosen value past 16,384 px a side or 120 MP
  (`snipScaleFor()`).
- Freehand makes everything outside the outline transparent; legends are drawn only if they overlap.
- Map tiles that cannot be read back are left out, with a notice; the map credit is not painted in.
- Markup strokes are never saved; the X or a new snip discards them without a question.
- Where the clipboard is unavailable, Copy downloads `<project>-screenshot.png` instead.

(b) Contradicts: `lpn_screenshot_tip` says the picture is copied "ready to paste". The snip opens the
markup view, and nothing reaches the clipboard until Copy is pressed there (`openSnipEditor()`).

(c) Example: for a fire flow memorandum, lasso the low-pressure zone with the pressure contour shown,
circle the deficient hydrants, and paste a 3x picture into the report.

## Tables

(a) Omits:
- In a scenario other than Base, a cell edit, Ctrl+D, or a paste writes overrides in that scenario.
- Column width, order, and hidden columns are kept in this browser (`lpn_panecols`), not the file.
- Ctrl+Z is project Undo only in Ready mode; while typing it is the browser's text undo.
- Entry mode (typing over a cell) and Edit mode (F2 or double-click) differ: in Entry the arrow keys
  commit and move, in Edit they move the caret (`paneHandleKey()`).
- Ctrl+Shift+L filters by the selection; Ctrl+arrow, Ctrl+Home, and Ctrl+End are not listed.
- With a filter on, Ctrl+A and Ctrl+D act only on the rows shown; an edited row stays until the
  filter is applied again.
- Ctrl+D skips the ID column and read-only cells and reports the counts (`paneFillDown()`).

(b) Contradicts: "Delete: Clear a cell" holds for one cell only; with a range selected, Delete still
clears only the active cell (right-click, Delete clears the range), and it does nothing on checkbox or
list cells. The first Esc cancels a pending paste as new rows, not the edit.

(c) Example: in an "Aged C-factor" scenario, filter Pipes by material, select the C column, and press
Ctrl+D: every old cast-iron pipe gets C = 80 in that scenario only.

## Using the guide

(a) Omits:
- Ctrl+K (Cmd+K on a Mac) replaces the browser's Ctrl+K everywhere, including text fields; it now
  puts up to 80 characters of selected text into the search field (this branch).
- Search ignores accents and marks (`guideFold()`).
- Whether the Guide is open and whether its contents rail is collapsed are kept in this browser; on a
  phone the rail always starts closed.
- `Looped-Network.php#guide` and `#guide/<key>` open the Guide from a link.

(b) Contradicts: `?` opens at "the control under the pointer or holding focus", but only toolbar
buttons and menu rows count; elsewhere it opens at the top. F1 works only when focus is in a box;
elsewhere the browser's F1 runs. Esc closes the Guide only when focus is inside it.

(c) Example: a reviewer selects "Flow balance" in a colleague's note, presses Ctrl+K, and reaches the
Graphs row without knowing which menu holds it.

## Boxes (introduction, including Tom's auto-hide sentences)

(a) Omits:
- On a phone (640 px or narrower) there is no docking and every box fills the window; the docked
  side returns on a wider window.
- What is remembered differs by box: most keep position, size, open state, dock side, auto-hide,
  width, and tab order in this browser; Properties, Critical assets, Demand scaling, Alternatives, and
  Calibration keep their docking for this page load only (`wireBoxDocking()`).
- Dragging a docked box by its title band floats it and turns auto-hide off.
- Boxes docked on one side share one width; the map keeps at least 320 px (`LPN_DOCK_MAP_MIN`).
- A tab opens its box on hover after 150 ms with a mouse or pen; on touch it must be tapped.
- Tabs reorder by dragging or with Alt+Up and Alt+Down.

(b) Contradicts:
- "The ? in a box's title bar opens its help": the Guide box has no `?`.
- Tom's sentences (`lpn_guide_boxes_autohide`), measured against `dockTuckLater()`,
  `dockOutsidePress()`, and the Escape and focusout handlers in `registerDockBox()`: the core is
  true (with focus in the box it stays out when the pointer leaves; without focus it tucks 400 ms
  after the pointer leaves the box, its tab, and its width grip). But "an input is active" is any
  focused control in the box, including a button just pressed; an active box also tucks on Esc, or
  when focus is moved out with Tab and the pointer is elsewhere; and "close" is a tuck: the box stays
  open behind its tab.

(c) Example: dock Find on auto-hide and pin Properties at the right while working junction by
junction through a low-pressure zone; the map keeps at least 320 px.

## Properties

(a) Omits:
- In a scenario, an edit to a value the scenario can override creates an override without a
  message; values it cannot override (Elevation, a reservoir head pattern) change Base and every
  scenario. The "Override in this scenario" mark appears only outside Base, on overridable rows.
- With several assets selected: one section per type with a count, "Various" for differing values,
  untouched rows write nothing, one change is one Undo step, and a notice states how many were set.
  Results are not shown there.
- Values a pipe type defines are shown disabled; Detach is the only way to change them.
- A value takes effect when the field is committed, in the unit in its label, with no conversion.
- With Recalculate automatically cleared, the listed results are from the previous run.
- The ID is edited in the title bar; an ID with a space or quotation mark, or one in use, is refused.
- After an extended-period run, a time-series graph is added at the foot.

(b) Contradicts: "The results of the last calculation are listed below the inputs": a tank's Head is
computed from its inputs and sits among them, and the multi-selection box shows no results. The box
also opens for customers, not only "asset or text".

(c) Example: in a "Main upsizing" scenario, select the 6-in. pipes along a hydrant run with a fire
flow shortfall and set Diameter to 8 once; Base stays unchanged for comparison.

## Settings

(a) Omits:
- Demand multiplier is per scenario; inside a scenario the row reads and writes that scenario's value,
  and a blank inherits.
- Changing a unit with values present asks Non-destructive or Destructive; Destructive converts the
  numbers and can be undone (`onUnitChange()`).
- Other settings changes are not in Undo (`makeUndoSnapshot()` does not save `settings`), and
  Restore defaults cannot be undone.
- "Apply these new-asset values to every existing asset" is refused outside Base.
- The search also matches tip text, and a matching heading shows its whole section.

(b) Contradicts:
- Fixed on this branch: the old "except Show the run progress box" omitted the Page sub-heading,
  which is kept in this browser too. The chapter now says so.
- Tom's "There is no other place to find settings": a scenario's calculation options (demand
  multiplier, total run time, hydraulic time step) can also be entered in the Alternatives box, and
  Start fresh is also a menu row. Kept as Tom wrote it; his call.

(c) Example: Average day, Maximum day, and Peak hour scenarios that differ only by demand multiplier
(1.0, 1.8, 2.7): one number per scenario instead of one edit per junction.

## Library

(a) Omits:
- The Library is project-wide, not per scenario: editing a curve or pattern in a scenario changes it
  in every scenario.
- Deleting a pattern is never refused; every reference to it is cleared, in Base, in scenarios, and
  on customers. Curves, pipe types, and fittings lists in use cannot be deleted, and the warning
  names the users.
- Renaming moves every reference in every scenario; a blank or duplicate name is refused.
- Controls and rules use EPANET syntax with English keywords, numbers in project units.
- A rule or control that names a missing or inactive element is dropped from the run with a warning.

(b) Contradicts: "Controls and rules apply to the whole network": rules are applied by the EPANET
engine only, and are dropped in a scenario where an element they name is inactive (`modelRules()`).

(c) Example: LINK PUMP1 OPEN IF NODE T1 BELOW 8 and LINK PUMP1 CLOSED IF NODE T1 ABOVE 22, run over
maximum day to confirm the tank cycles and does not drain overnight.

## Fire flow

(a) Omits:
- The engine is the built-in solver unless Settings requests EPANET, the network has a PRV, PSV, or
  FCV, or demand is pressure-driven (`engineFor()`).
- The run uses tank levels and link states from the time on screen and holds every tank at a fixed
  level, so a tank never drains during the fire (`fireFlowAtFrame()`).
- Default criteria (`fireFlowDefaults()`): 1,000 gpm, 20 psi residual, design check on, 20 psi
  elsewhere, 10 ft/s; kept for the page load only, not saved.
- A junction's own Required fire flow is saved, can be a scenario override, and replaces the box value.
- Available flow is in addition to the junction's own demand; the search stops at 10,000 gpm and
  reports "more than"; values are rounded down to about 1 gpm.
- A junction already below the residual with no fire flow fails with no number; the design check
  does not judge the junction being tested.
- Closing the box stops a run; any edit clears the results.

(b) Contradicts: none found.

(c) Example: at maximum-day demand, the available flow at 20 psi residual at each hydrant junction
against its requirement (3,500 gpm for a commercial block), with the design check flagging a
high-elevation neighbor below 20 psi or a 6-in. main above 10 ft/s.

## Critical assets

(a) Omits:
- One link at a time is removed, not a segment between isolation valves; valve shutoffs are not
  modeled (`lpn-criticality.js`, `breakOne()`).
- Cut-off junctions are found by a graph walk with closed links absent; their demand at the time on
  screen is "Demand not served"; they are removed before the solve.
- Junctions below the minimum with nothing broken are left out of every row and stated once.
- The minimum pressure is fire flow's "Lowest pressure allowed elsewhere" (20 psi default); there is
  no velocity check. Tanks are held at the frame's level, so a tank supplies without a time limit.
- Rules naming a removed element are dropped; Skip dead ends leaves those links out of the table.
- Rows sort by severity, unserved demand first. Settings and box position are not saved.

(b) Contradicts: none found.

(c) Example: at peak hour, rank which single transmission main or pump outage leaves the most demand
unserved, such as the one main into a pressure zone that cuts off 400 gpm: the case for a parallel
main or an emergency interconnect. Find and replace gives the one-pipe version of the same question
(the chapter's Pipe 247 example on Net3).

## Demand scaling

(a) Omits:
- Every chosen junction's demand is scaled, negative (inflow) demands included; tanks and emitters
  are not (`lpn-demandscale.js`, `scaledModel()`).
- Run makes two solves, scaled and unscaled; the velocity list leaves out pumps.
- Find tests 1x, then 20x or 0, then bisects to 0.01, assuming pressure falls as demand rises; a
  pump or valve that changes state can give a later crossing point. A failed solve counts as a failure.
- Under Selected, only the selected junctions limit the answer; others that are low are listed.
- The minimum pressure is shared with fire flow; tanks are held at the frame's level; settings are
  kept for the page load only.
- The multiplier can be 0 here, but a scenario's demand multiplier must be greater than 0.

(b) Contradicts: none found.

(c) Example: Find on a new subdivision's junctions gives the growth factor (1.62x) at which they
still hold 40 psi: the build-out headroom before a main must be upsized.

## Scenario comparison

(a) Omits:
- It runs when the box opens, and again after every settled edit while open: one solve per scenario
  each time.
- A scenario with a total run time is run over the whole period through EPANET, with the extremes
  taken over every time step and their time shown; a steady scenario is solved at the time on screen.
- Lowest pressure leaves out tanks and reservoirs; highest velocity leaves out pumps; there is no
  pass or fail threshold.
- It also shows demand multiplier, total run time, hydraulic time step, and a block of options that
  are the same in every scenario. A failed scenario shows the reason.

(b) Contradicts: "the number of differences from Base". The column is the number of overrides
(`overrideCount()`): element overrides plus any calculation option that differs from the project
value. An override equal to Base's value is still counted.

(c) Example: Average day, Maximum day, and Peak hour side by side, showing which gives the lowest
pressure (38 psi at J-112 at 07:00) and the highest velocity: the standard master-plan checks.

## Alternatives

(a) Omits:
- Alternatives are derived from each scenario's overrides, not stored; a cell's count is the number
  of local values in that category. There are nine categories, including Fire flow and Custom
  properties.
- An option edit is saved and can be undone; it re-solves if the scenario is open.
- The demand multiplier must be greater than 0; an invalid entry is put back.
- Base's values cannot be edited here; its run time and time step open Settings.
- Basic mode is kept in this browser only; the box position is not remembered.

(b) Contradicts: none found.

(c) Example: before running, confirm that a Maximum day scenario changes only Demand, with its own
1.8 multiplier and 24-hour run time, and nothing in Physical or Asset activation.

## Pump energy

(a) Omits:
- Only the EPANET engine produces it, on an extended-period run; the built-in solver contributes
  nothing.
- Energy is summed at every hydraulic step, so short steps where a control fires count at their
  real length.
- Price can vary with time: the pump's own price or the global price times the pump's or the global
  price pattern (time-of-use tariffs).
- Average kW and efficiency are averaged over running time only; "% of run" is over the whole run; a
  pump that never ran shows a dash.
- Cost of peak demand uses the peak of the summed power of all pumps at one time.
- Money is the typed price with the currency label from Settings, no conversion.
- Session only; an edit that drops the run blanks it; no copy, download, or print.

(b) Contradicts: none found.

(c) Example: with a night rate and a demand charge on a 24-hour run, compare tank trigger levels to
see whether off-peak pumping lowers Total cost or only moves the billed peak kW.

## Contour

(a) Omits:
- The box has its own Color nodes by list and shares the color scheme; changing either recolors the
  node symbols.
- Every setting except the box position is saved with the project.
- Color stops at pumps, at valves other than TCVs, and at closed links; tanks and reservoirs supply
  values only for head and quality.
- Default interval 5 psi, 5 m, 10 ft, 50 kPa, or 0.5 bar for pressure, head, or elevation; stored per
  field and unit, so a unit change returns the default.
- For pressure on a placed project, the Mapbox DEM ground option subtracts the ground cell by cell,
  so pressures between nodes can fall outside the node range.
- It follows the result on screen, including the current time step.

(b) Contradicts: "It changes only the display, not the network" is true of the hydraulics, but the
contour settings are saved in the project file, so a colleague opening it receives them.

(c) Example: a pressure contour with the DEM ground option shows low pressure on a ridge between
nodes that node colors alone miss: where a zone boundary or booster belongs.

## Run report

(a) Omits:
- Only an extended-period run writes it (`lpn-time.js`, `startRun()`); a steady solve never does,
  whichever engine.
- It can be stale: an edit, or setting the duration to 0, leaves the previous text.
- A failed run clears it, but a run EPANET refused keeps EPANET's report, where the offending line is
  named.
- Opening it with no report gives a notice, not the box. The text is EPANET's, untranslated.
- Copy works on plain http; no download or print.

(b) Contradicts: "It is replaced each time the network is solved with the EPANET engine": only
extended-period runs replace it, and edits leave the old text.

(c) Example: after importing a utility's .inp, warnings such as negative pressures or a pump that
cannot deliver its head flag model-building errors before design decisions rely on the results.

## Status changes

(a) Omits:
- Built only from EPANET extended-period frames, at reporting steps: a pump that cycles within one
  reporting step is never listed, and each event is stamped at the reporting step.
- The initial state is not listed; no cause (which control or rule) is given.
- Full and empty are reported only for tanks with a stated maximum or minimum level.
- A valve in the active state reads as open.
- Session only; no copy, download, or print.

(b) Contradicts: none found.

(c) Example: scan a 72-hour run for a tank that empties at 06:00 every day, a sign that pumping does
not keep up with the morning peak.

## Full report

(a) Omits:
- Without an extended-period run it shows the single current solve, from either engine, updated as
  the network is edited.
- Pump head has its own column; Quality fills only after a water quality run.
- Download is a CSV named `<project>-Full report.csv`; values are rounded to 2 decimals.
- The time step choice resets on each page load.

(b) Contradicts: "It is available after Calculate": with no run it shows the live single-instant
solve without Calculate being pressed.

(c) Example: download the CSV of a 24-hour run and filter it for nodes below 40 psi at peak hour as
master-plan evidence.

## Calibration

(a) Omits:
- The file picker takes .dat, .txt, and .cal; each line is "ID time value", with ; for comments;
  spaces, tabs, or commas separate; the ID may be omitted on following lines; time is decimal hours
  or h:mm[:ss] (`lpn-calib.js`).
- Values are read in the project's current units, which the box states.
- Six parameters: demand, head, pressure, quality, flow, and velocity.
- Times between reporting steps are interpolated; measurements outside the run, unknown IDs, and
  unreadable lines are counted and listed as skipped.
- On a single-instant solve, every measurement is compared with that one result.
- Three tabs: Statistics, Correlation plot, Mean comparisons; "Mean error" is the mean absolute error;
  correlation needs two locations whose means differ.
- Loaded measurements also appear on the Tables pane's time-series chart.

(b) Contradicts: none found.

(c) Example: load hydrant-test residual pressures and their flows, adjust C-factors until the RMS
error is small and the correlation plot lies near the diagonal, then rerun fire flow on the
calibrated model.

## Notes

(a) Omits: Esc closes it only with focus inside; the list is fixed in the page (saving projects,
pump curve, color bands, Hazen-Williams constants, EPANET version); Saving projects warns that
clearing browser data deletes every project.

(b) Contradicts: none found.

(c) Example: the pump curve note says flow past the curve gives negative head, not a cutoff, which
catches a fire flow run that pushes a booster pump past runout.

## Guide (its own box entry)

(a) Omits: Ctrl+K with a selection (this branch); `/` only with focus in the Guide; `#guide` links;
selecting a row opens the real menu at that row; on a phone a toolbar row shows its menu twin;
search ignores accents.

(b) Contradicts: "Lists every toolbar button and menu row, the keyboard shortcuts, and an entry for
each box": it also has the Using the guide, Map, Screenshot, and Tables sections. "Press Ctrl+K from
anywhere": not while a dialog is open.

(c) Example: before a criticality study, Ctrl+K and "critical" finds the Critical assets entry and
where it is in the menus.
