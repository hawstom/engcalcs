# English strings nobody has ruled on yet

**Generated — never hand-edited.** `php dev/scripts/new_english_keys.php --write`.
`check_all.sh` fails if this file has drifted from `lib/lang.ec.en.php`.

These are the keys that are in `lib/lang.ec.en.php` and in NONE of the other 26 language
files — which is, by construction, every string that has been written and not yet ruled on or
translated. **An absent key is the correct untranslated state**, so this is a worklist and never
a fault.

What to do with it: read the English, and say where it is wrong. A ruling is a sentence in
conversation, not an edit — the wording is Tom's and the editing is AI's. Once the wording is
settled these go into the next translation sprint as a batch.

**49 still to read on master**, of 67 untranslated keys, of 2220 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (67, 49 to read @@ NEEDS RULING)

- **`lpn_alt_cat_constituent`**
  > Constituent
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_demand`**
  > Demand
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_energy`**
  > Energy cost
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_fireflow`**
  > Fire flow
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_initial`**
  > Initial settings
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_physical`**
  > Physical
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_text`**
  > Text
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_topology`**
  > Asset activation
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_userdata`**
  > Custom properties
  _Ruled OK 2026-10-01._
- **`lpn_alt_note`**
  > Read only. Base uses the Base alternative of every category. Each scenario gets its own alternative for any category that is changed, a child of the Base one. The number is how many changed values it has.
  _Ruled OK 2026-10-01._
- **`lpn_alt_title`**
  > Alternatives preview
  OK.
- **`lpn_calib_axis_obs`**
  > Observed: {q}
  OK.
- **`lpn_calib_axis_sim`**
  > Computed: {q}
  OK.
- **`lpn_calib_bad_lines`**
  > Lines that could not be read, skipped: {lines}
  OK.
- **`lpn_calib_col_location`**
  > Location
  OK.
- **`lpn_calib_col_mean_err`**
  > Mean error
  OK.
- **`lpn_calib_col_mean_err_tip`**
  > The mean of the absolute differences between each observed value and the computed value at the same time.
  OK.
- **`lpn_calib_col_n`**
  > Num obs
  OK.
- **`lpn_calib_col_n_tip`**
  > Number of observations: the measurements at this location that were compared.
  OK.
- **`lpn_calib_col_obs_mean`**
  > Observed mean
  OK.
- **`lpn_calib_col_rms_err`**
  > RMS error
  OK.
- **`lpn_calib_col_rms_err_tip`**
  > Root mean square error: the square root of the mean of the squared differences between observed and computed values.
  OK.
- **`lpn_calib_col_sim_mean`**
  > Computed mean
  OK.
- **`lpn_calib_computed`**
  > Computed
  OK.
- **`lpn_calib_corr_means`**
  > Correlation between means: {r}
  OK.
- **`lpn_calib_corr_none`**
  > Correlation between means: it needs at least two locations whose means differ.
  OK.
- **`lpn_calib_corr_note`**
  > Each point is one measurement. The closer the points lie to the diagonal line, the closer the computed values match the observed ones.
  OK.
- **`lpn_calib_file`**
  > {file}: {n} measurements at {m} locations.
  OK.
- **`lpn_calib_load`**
  > Load calibration file…
  OK.
- **`lpn_calib_load_tip`**
  > A text file with a location ID, a time, and a measured value on each line. The time is measured from the start of the simulation, in decimal hours or hours:minutes. A semicolon starts a comment. A line with only a time and a value belongs to the location above it.
  OK.
- **`lpn_calib_missing`**
  > Named in the file but not in this network: {ids}.
  OK.
- **`lpn_calib_missing_count`**
  > Measurements skipped because their location is not in this network: {n}.
  OK.
- **`lpn_calib_needs_run`**
  > There are no results to compare with yet. The report fills in once the network has been calculated.
  OK.
- **`lpn_calib_network`**
  > Network
  OK.
- **`lpn_calib_no_pairs`**
  > No measurement could be compared, so there is nothing to plot.
  OK.
- **`lpn_calib_no_value`**
  > Measurements with no computed value at their time, skipped: {n}.
  OK.
- **`lpn_calib_none`**
  > No calibration file is loaded for this parameter.
  OK.
- **`lpn_calib_observed`**
  > Observed
  OK.
- **`lpn_calib_outside`**
  > Measurements outside the times this run reported, skipped: {n}.
  OK.
- **`lpn_calib_param`**
  > Parameter
  OK.
- **`lpn_calib_param_tip`**
  > The quantity the calibration file measures. One file is held for each parameter.
  OK.
- **`lpn_calib_point`**
  > {id}, {time}: observed {o}, computed {s}
  OK.
- **`lpn_calib_session`**
  > A calibration file is held for this session only. It is not saved with the project or on this device.
  OK.
- **`lpn_calib_single`**
  > This is a single-period run, so every measurement is compared with its one result, whatever time the file gives.
  OK.
- **`lpn_calib_tab_corr`**
  > Correlation plot
  OK.
- **`lpn_calib_tab_means`**
  > Mean comparisons
  OK.
- **`lpn_calib_tab_stats`**
  > Statistics
  OK.
- **`lpn_calib_title`**
  > Calibration report
  OK.
- **`lpn_calib_ts_note`**
  > Rings are measured values from the calibration file.
  OK.
- **`lpn_calib_ts_point`**
  > Measured at {id}, {time}: {v}
  OK.
- **`lpn_calib_units`**
  > The file's values are read in this project's units: {unit}.
  OK.
- **`lpn_copy_body`**
  > This file says it was created on {date}, and this browser doesn't recognize it. Is this the Original file (keep same lock) or a Copy (make new lock)?
  _Ruled OK 2026-10-01._
- **`lpn_copy_body_nodate`**
  > This browser doesn't recognize this file. Is this the Original file (keep same lock) or a Copy (make new lock)?
  _Ruled OK 2026-10-01._
- **`lpn_copy_copy`**
  > A copy; make new lock
  _Ruled OK 2026-10-01._
- **`lpn_copy_kept_link`**
  > Opened {name} as the original, moved to a new place. Save now writes to this file.
  OK.
- **`lpn_copy_opened`**
  > Opened {file} as a copy, with a new lock of its own that will be saved with the next file save.
  _Ruled 2026-10-01: Wording change per this. This is good._
- **`lpn_copy_original`**
  > Original; keep same lock
  _Ruled OK 2026-10-01._
- **`lpn_copy_title`**
  > Mark file as new copy?
  _Ruled OK 2026-10-01._
- **`lpn_graphs_menu`**
  > Graphs
  OK.
- **`lpn_graphs_menu_tip`**
  > Graphs: Profile, Time Series, and Frequency distribution
  OK.
- **`lpn_hotkeys_menu_def`**
  > <table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+letter</td><td>Open the menu with that letter, then press a row's letter to choose it. The letters show while you use the keyboard. On a Mac, use Ctrl+Option.</td></tr><tr><td>F10</td><td>Go to the menu bar.</td></tr></tbody></table>
  OK.
- **`lpn_hotkeys_menu_heading`**
  > Menus
  OK.
- **`lpn_hotkeys_menu_term`**
  > Menu keyboard shortcuts
  OK.
- **`lpn_reports_calib`**
  > Calibration
  OK.
- **`lpn_reports_calib_tip`**
  > Compare measured field data from a calibration file with the last run: statistics, a correlation plot, and mean comparisons.
  OK.
- **`lpn_scenario_basic`**
  > Basic mode
  _Ruled OK 2026-10-01._
- **`lpn_scenario_basic_tip`**
  > Checked, a scenario is simply the values you set in it. Unchecked, this menu also offers the Alternatives preview table, which shows how those values are grouped by category and invites your feedback.
  _Ruled OK 2026-10-01._

---

# Strings waiting on a branch

**105 still to read**, of 152 new keys across 13 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### chore/selection-word (`16dce45b`) — adds no English strings

### feat/contour (`1871dcb7`) — 25 new, 25 to read @@ NEEDS RULING

- **`lpn_contour_buffer`**
  > Buffer
  OK.
- **`lpn_contour_buffer_tip`**
  > How far the color reaches from each pipe, as a multiple of the median pipe length. It fades out over the outer part.
  OK.
- **`lpn_contour_buffer_unit`**
  > × median pipe length
  OK.
- **`lpn_contour_consent_1`**
  > Drawing pressure over the ground sends the area your network covers, as Mapbox map tile numbers, to api.mapbox.com, to read the height of the ground there.
  OK.
- **`lpn_contour_consent_2`**
  > This is a different question from the map pictures behind your project. The pictures only say where you are looking. These tiles say where your network is. Mapbox will receive those tile numbers and your IP address. We send nothing else: no name, no pipes, no project. We keep no record of it, and nothing is stored on this device except your answer to this question.
  OK.
- **`lpn_contour_consent_3`**
  > May we send the tile numbers of your network's area to Mapbox?
  OK.
- **`lpn_contour_consent_4`**
  > If you say no, everything else on this page keeps working exactly as it does now, and the contour plot is drawn between nodes alone. We remember a yes so that we need not ask again. A no is not stored at all.
  OK.
- **`lpn_contour_dem`**
  > Ground between nodes from Mapbox DEM
  OK.
- **`lpn_contour_dem_failed`**
  > The ground could not be read from Mapbox DEM, so pressure is interpolated between nodes alone.
  OK.
- **`lpn_contour_dem_tip`**
  > Between nodes, pressure becomes the interpolated head minus the height of the ground from Mapbox DEM, so it can fall below the lowest node pressure on a hill the network has no node on. Treat the ground as a contour map, not a survey.
  OK.
- **`lpn_contour_few`**
  > Too few nodes to contour.
  OK.
- **`lpn_contour_fill`**
  > Fill
  OK.
- **`lpn_contour_fill_bands`**
  > Bands
  OK.
- **`lpn_contour_fill_smooth`**
  > Smooth
  OK.
- **`lpn_contour_fill_tip`**
  > Smooth blends the colors from one class to the next. Bands paints each class of the color key flat.
  OK.
- **`lpn_contour_interval`**
  > Interval
  OK.
- **`lpn_contour_lines`**
  > Contour lines
  OK.
- **`lpn_contour_menu`**
  > Contour
  OK.
- **`lpn_contour_opacity`**
  > Fill opacity
  OK.
- **`lpn_contour_plot`**
  > Contour plot
  OK.
- **`lpn_contour_support`**
  > Contour plot: {n} nodes, interpolated along {p} pipes and up to {k} times the median pipe length beside them. No color across pumps, valves, or closed links.
  OK.
- **`lpn_contour_support_dem`**
  > Between nodes, pressure is the interpolated head minus the ground elevation from Mapbox DEM, sampled about every {m} m.
  OK.
- **`lpn_contour_support_lines`**
  > Contour lines every {i} {u}.
  OK.
- **`lpn_contour_tip`**
  > Show a contour plot on the map: the node colors spread along and beside the pipes, with labeled contour lines. Opens a box to tune it or turn it off.
  OK.
- **`lpn_contour_too_many`**
  > Too many contour lines at this interval; widen it to draw them.
  OK.

### feat/criticality (`84ea5311`) — 31 new, 8 to read @@ NEEDS RULING

- **`lpn_analyze_menu`**
  > Analyze
  OK.
- **`lpn_analyze_menu_tip`**
  > Analyses that run the network many times over on a copy: fire flow at each junction, and the loss of each pipe, pump, and valve.
  OK.
- **`lpn_crit_baseline_below`**
  > Junctions already below it with nothing broken: {n}. They are not counted.
  _Ruled OK 2026-10-01._
- **`lpn_crit_busy`**
  > Another analysis is running. Stop it, or wait for it to finish.
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_asset`**
  > Asset
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_below`**
  > Junctions below minimum
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_cutoff`**
  > Junctions cut off
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_unserved`**
  > Demand not served
  _Ruled OK 2026-10-01._
- **`lpn_crit_intro`**
  > Each asset is taken out of the network in turn, and the network is solved at the time step on screen in the active scenario. Nothing in your project is changed; the whole run is made on a copy.
  _Ruled OK 2026-10-01._
- **`lpn_crit_menu`**
  > Criticality analysis…
  _Ruled OK 2026-10-01._
- **`lpn_crit_menu_tip`**
  > Take each pipe, pump, and valve out of the network in turn and see what the system loses.
  _Ruled OK 2026-10-01._
- **`lpn_crit_minpressure`**
  > Lowest pressure allowed
  _Ruled OK 2026-10-01._
- **`lpn_crit_minpressure_tip`**
  > This is the same number as Lowest pressure allowed elsewhere in Fire flow analysis. Changing it here changes it there.
  _Ruled OK 2026-10-01._
- **`lpn_crit_no_links`**
  > This project has no links yet, so there is nothing to break.
  _Ruled OK 2026-10-01._
- **`lpn_crit_no_selection`**
  > No pipe, pump, or valve is selected. Choose one on the map, or break every link.
  _Ruled OK 2026-10-01._
- **`lpn_crit_scope`**
  > Links to break
  _Ruled OK 2026-10-01._
- **`lpn_crit_scope_all`**
  > Every link
  _Ruled OK 2026-10-01._
- **`lpn_crit_scope_selected`**
  > The selected links
  _Ruled OK 2026-10-01._
- **`lpn_crit_scope_tip`**
  > Every pipe, pump, and valve, or only the ones selected on the map. Choose the set before you run.
  _Ruled OK 2026-10-01._
- **`lpn_crit_skipdead`**
  > Skip dead ends
  OK.
- **`lpn_crit_skipdead_tip`**
  > A dead-end link is one whose removal cuts off junctions that can be reached only through it, with no reservoir or tank beyond. Its loss is everything beyond it, so it is not solved. The summary says how many were skipped.
  OK.
- **`lpn_crit_skipped`**
  > {n} selected elements are not links, so they were not broken.
  _Ruled OK 2026-10-01._
- **`lpn_crit_skipped_dead`**
  > Dead-end links skipped: {n}. Each one cuts off everything beyond it.
  OK.
- **`lpn_crit_stale`**
  > The drawing changed, so the criticality results were cleared. Run it again.
  _Ruled OK 2026-10-01._
- **`lpn_crit_stopped`**
  > Stopped after {done} of {total} assets. The results below are the ones already finished.
  _Ruled OK 2026-10-01._
- **`lpn_crit_summary`**
  > {n} of {total} assets leave demand unserved or drop a junction below {pressure}.
  _Ruled OK 2026-10-01._
- **`lpn_crit_title`**
  > Criticality analysis
  _Ruled OK 2026-10-01._
- **`lpn_crit_working`**
  > Working: {done} of {total} assets.
  _Ruled OK 2026-10-01._
- **`lpn_ff_design_all`**
  > All
  OK.
- **`lpn_ff_design_off`**
  > None
  OK.
- **`lpn_ff_design_selected`**
  > Selected
  OK.

### feat/demand-scaling (`54179352`) — 77 new, 58 to read @@ NEEDS RULING

- **`lpn_analyze_menu`**
  > Analyze
  OK.
- **`lpn_analyze_menu_tip`**
  > Analyses that run the network on a copy: fire flow at each junction, the loss of each pipe, pump, and valve, and the demands scaled up or down.
  OK.
- **`lpn_crit_baseline_below`**
  > Junctions already below it with nothing broken: {n}. They are not counted.
  _Ruled OK 2026-10-01._
- **`lpn_crit_busy`**
  > Another analysis is running. Stop it, or wait for it to finish.
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_asset`**
  > Asset
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_below`**
  > Junctions below minimum
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_cutoff`**
  > Junctions cut off
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_unserved`**
  > Demand not served
  _Ruled OK 2026-10-01._
- **`lpn_crit_intro`**
  > Each asset is taken out of the network in turn, and the network is solved at the time step on screen in the active scenario. Nothing in your project is changed; the whole run is made on a copy.
  _Ruled OK 2026-10-01._
- **`lpn_crit_menu`**
  > Criticality analysis…
  _Ruled OK 2026-10-01._
- **`lpn_crit_menu_tip`**
  > Take each pipe, pump, and valve out of the network in turn and see what the system loses.
  _Ruled OK 2026-10-01._
- **`lpn_crit_minpressure`**
  > Lowest pressure allowed
  _Ruled OK 2026-10-01._
- **`lpn_crit_minpressure_tip`**
  > This is the same number as Lowest pressure allowed elsewhere in Fire flow analysis. Changing it here changes it there.
  _Ruled OK 2026-10-01._
- **`lpn_crit_no_links`**
  > This project has no links yet, so there is nothing to break.
  _Ruled OK 2026-10-01._
- **`lpn_crit_no_selection`**
  > No links are selected. Select links or choose All links.
  OK.
- **`lpn_crit_scope`**
  > Links to break
  _Ruled OK 2026-10-01._
- **`lpn_crit_scope_all`**
  > All links
  OK.
- **`lpn_crit_scope_selected`**
  > Selected links
  OK.
- **`lpn_crit_scope_tip`**
  > All pipes, pumps, and valves, or only those selected on the map. Choose the set before you run.
  OK.
- **`lpn_crit_skipdead`**
  > Skip dead ends
  OK.
- **`lpn_crit_skipdead_tip`**
  > A dead-end link is one whose removal cuts off junctions that can be reached only through it, with no reservoir or tank beyond. Its loss is everything beyond it, so it is not solved. The summary says how many were skipped.
  OK.
- **`lpn_crit_skipped`**
  > {n} selected elements are not links, so they were not broken.
  _Ruled OK 2026-10-01._
- **`lpn_crit_skipped_dead`**
  > Dead-end links skipped: {n}. Each one cuts off everything beyond it.
  OK.
- **`lpn_crit_stale`**
  > The drawing changed, so the criticality results were cleared. Run it again.
  _Ruled OK 2026-10-01._
- **`lpn_crit_stopped`**
  > Stopped after {done} of {total} assets. The results below are the ones already finished.
  _Ruled OK 2026-10-01._
- **`lpn_crit_summary`**
  > {n} of {total} assets leave demand unserved or drop a junction below {pressure}.
  _Ruled OK 2026-10-01._
- **`lpn_crit_title`**
  > Criticality analysis
  _Ruled OK 2026-10-01._
- **`lpn_crit_working`**
  > Working: {done} of {total} assets.
  _Ruled OK 2026-10-01._
- **`lpn_ds_at_time`**
  > Time step: {time}.
  OK.
- **`lpn_ds_bad_multiplier`**
  > Type a demand scale of zero or more, such as 1.5.
  OK.
- **`lpn_ds_below_zero`**
  > ⚠ At least one junction is below {pressure} even with the scaled demands at zero.
  OK.
- **`lpn_ds_col_link`**
  > Link
  OK.
- **`lpn_ds_col_scaled`**
  > Scaled
  OK.
- **`lpn_ds_col_scaled_tip`**
  > With the demands multiplied by the demand scale.
  OK.
- **`lpn_ds_col_unscaled`**
  > Unscaled
  OK.
- **`lpn_ds_col_unscaled_tip`**
  > With the demands as they are in the active scenario at this time step, the same value the map shows.
  OK.
- **`lpn_ds_eps_note`**
  > Only the time step now on screen is scaled, with its tank levels and link statuses. To test the peak, move the clock to the peak demand before you run.
  OK.
- **`lpn_ds_find`**
  > Find
  OK.
- **`lpn_ds_found`**
  > ✓ Every junction keeps {pressure} up to a demand scale of {m}.
  OK.
- **`lpn_ds_found_below`**
  > ⚠ At least one junction is already below {pressure} at the demands as they are. The system keeps it up to a demand scale of {m}.
  I think I need explanation, and this need clarification.
- **`lpn_ds_head_lowest`**
  > Lowest pressures
  OK.
- **`lpn_ds_head_scale`**
  > Scale the demands
  OK.
- **`lpn_ds_head_search`**
  > What demand scale can the system handle?
  OK.
- **`lpn_ds_head_search_selected`**
  > What demand scale can these junctions handle?
  OK.
- **`lpn_ds_head_velocity`**
  > Highest velocities
  OK.
- **`lpn_ds_holds_max`**
  > ✓ Every junction keeps {pressure} up to a demand scale of {max}, the top of the search.
  OK.
- **`lpn_ds_intro`**
  > The demands are multiplied on a copy of the network, which is solved at the time step on screen in the active scenario. Nothing in your project is changed.
  OK.
- **`lpn_ds_lowest_at`**
  > At a demand scale of {m}, the lowest pressure is {pressure}, at junction {id}.
  OK.
- **`lpn_ds_menu`**
  > Demand scaling…
  OK.
- **`lpn_ds_menu_tip`**
  > Multiply the demands on a copy of the network and see the pressures and velocities, or find the largest demand scale the system can carry.
  OK.
- **`lpn_ds_minpressure`**
  > Lowest pressure allowed
  OK.
- **`lpn_ds_minpressure_tip`**
  > This is the same number as Lowest pressure allowed elsewhere in Fire flow analysis. Changing it here changes it there.
  OK.
- **`lpn_ds_multiplier`**
  > Demand scale
  OK.
- **`lpn_ds_multiplier_tip`**
  > The number each demand is multiplied by: 1.5 is half again as much water. It applies on top of the active scenario's own demand multiplier, which is already in the demands, and it is never saved in your project.
  OK.
- **`lpn_ds_no_junctions`**
  > This project has no junctions yet, so there are no demands to scale.
  OK.
- **`lpn_ds_no_selection`**
  > No junctions are selected. Select junctions or choose All junctions.
  OK.
- **`lpn_ds_nosolve_at`**
  > At a demand scale of {m}, the network gave no answer. {reason}
  OK.
- **`lpn_ds_outside_below`**
  > At a demand scale of {m}, junctions not selected that are below {pressure}: {n} ({ids}). They do not limit this answer.
  OK.
- **`lpn_ds_run`**
  > Run
  OK.
- **`lpn_ds_scale_below`**
  > ⚠ At a demand scale of {m}, junctions below {pressure}: {n}.
  OK.
- **`lpn_ds_scale_ok`**
  > ✓ At a demand scale of {m}, every junction keeps {pressure}.
  OK.
- **`lpn_ds_scaled_selected`**
  > Junctions scaled and checked: {n}.
  OK.
- **`lpn_ds_scope`**
  > Junctions to scale
  OK.
- **`lpn_ds_scope_all`**
  > All junctions
  OK.
- **`lpn_ds_scope_selected`**
  > Selected junctions
  OK.
- **`lpn_ds_scope_tip`**
  > All junctions, or only those selected on the map. Pressures are checked at the scaled demand.
  OK.
- **`lpn_ds_search_note`**
  > Finds the largest demand scale, from 0 to {max} to the nearest {step}, at which all junctions maintain the lowest pressure allowed. It assumes that more demand never raises the lowest pressure.
  OK.
- **`lpn_ds_search_note_selected`**
  > Finds the largest demand scale, from 0 to {max} to the nearest {step}, at which all these junctions maintain the lowest pressure allowed.
  There is no need for this key. "These" applies to all and to selected.
- **`lpn_ds_search_stopped`**
  > The search was stopped before it found an answer.
  OK. Are we sure this isn't already provided by a different key?
- **`lpn_ds_skipped`**
  > Selected elements that are not junctions, left as they are: {n}.
  OK.
- **`lpn_ds_stale`**
  > The drawing changed, so the demand scaling results were cleared. Run it again.
  OK.
- **`lpn_ds_time_moved`**
  > ⚠ This was computed at {time}, and the clock is now at {now}. Run it again for the time step on screen.
  OK.
- **`lpn_ds_title`**
  > Demand scaling
  OK.
- **`lpn_ff_design_all`**
  > All
  OK.
- **`lpn_ff_design_off`**
  > None
  OK.
- **`lpn_ff_design_selected`**
  > Selected
  OK.
- **`lpn_ff_rows_more_links`**
  > Links not shown: {n}.
  OK.

### feat/desktop (`baba0f04`) — adds no English strings

### feat/flow-balance (`c31826a4`) — 7 new, 7 to read @@ NEEDS RULING

- **`lpn_sysflow_consumed`**
  > Consumed
  OK.
- **`lpn_sysflow_consumed_tip`**
  > Total of every positive demand: water drawn from the network at junctions, and any flow into a reservoir.
  OK.
- **`lpn_sysflow_menu`**
  > Flow balance
  OK.
- **`lpn_sysflow_produced`**
  > Produced
  OK.
- **`lpn_sysflow_produced_tip`**
  > Total flow into the network from reservoirs and from negative demands.
  OK.
- **`lpn_sysflow_tip`**
  > Graph the total flow produced and the total flow consumed against time, across the extended period simulation. Tanks are in neither total, so where the two lines part, the tanks are filling or draining.
  OK.
- **`lpn_sysflow_title`**
  > Flow balance
  OK.

### feat/label-gang-search (`8b31a907`) — 3 new, all ruled

- **`lpn_confirm_labels_restore`**
  > Set the label columns back to their original values? This resets which properties are shown, the text before and after each one, the decimals, and the drop order. Your drawing and your other settings are not changed.
  _Ruled OK 2026-09-23._
- **`lpn_labels_restore`**
  > Restore label defaults
  _Ruled OK 2026-09-23._
- **`lpn_labels_restore_tip`**
  > Sets the label columns back to their original values: which properties are shown, the text before and after each one, the decimals, and the drop order. Your drawing and your other settings are not changed.
  _Ruled OK 2026-09-23._

### feat/label-placer-a (`3483bfd6`) — adds no English strings

### feat/label-placer-b (`c5905432`) — adds no English strings

### feat/label-placer-c (`9a790a3e`) — adds no English strings

### feat/label-placer-d (`129b63c4`) — adds no English strings

### feat/profile-file (`a095faf4`) — 4 new, 4 to read @@ NEEDS RULING

- **`lpn_profile_file_done`**
  > Profile read from the file: {used} of {total} nodes found in this network.
  OK.
- **`lpn_profile_file_missing`**
  > Named in the file but not in this network: {ids}.
  OK.
- **`lpn_profile_file_short`**
  > The file names fewer than two nodes in this network, so there is no profile to draw.
  OK.
- **`lpn_profile_open`**
  > Open EPANET profile file…
  OK.

### feat/property-graph (`3c987393`) — 5 new, 3 to read @@ NEEDS RULING

- **`lpn_pgraph_none`**
  > This asset has no results in the current run.
  _Ruled OK 2026-10-01._
- **`lpn_pgraph_source_share_from`**
  > Source share from {node}
  _Ruled OK 2026-10-01._
- **`lpn_report_pump_head`**
  > Pump head
  OK.
- **`lpn_result_pump_head`**
  > Head
  OK.
- **`lpn_result_pump_head_tip`**
  > The head the pump adds from suction to discharge, shown as a positive number. The solver and EPANET files carry it as a negative head loss.
  OK.
