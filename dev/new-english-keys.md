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

**45 still to read on master**, of 63 untranslated keys, of 2216 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (63, 45 to read @@ NEEDS RULING)

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
  @@ NEEDS RULING
- **`lpn_calib_axis_obs`**
  > Observed: {q}
  @@ NEEDS RULING
- **`lpn_calib_axis_sim`**
  > Computed: {q}
  @@ NEEDS RULING
- **`lpn_calib_bad_lines`**
  > Lines that could not be read, skipped: {lines}
  @@ NEEDS RULING
- **`lpn_calib_col_location`**
  > Location
  @@ NEEDS RULING
- **`lpn_calib_col_mean_err`**
  > Mean error
  @@ NEEDS RULING
- **`lpn_calib_col_mean_err_tip`**
  > The mean of the absolute differences between each observed value and the computed value at the same time.
  @@ NEEDS RULING
- **`lpn_calib_col_n`**
  > Num obs
  @@ NEEDS RULING
- **`lpn_calib_col_n_tip`**
  > Number of observations: the measurements at this location that were compared.
  @@ NEEDS RULING
- **`lpn_calib_col_obs_mean`**
  > Observed mean
  @@ NEEDS RULING
- **`lpn_calib_col_rms_err`**
  > RMS error
  @@ NEEDS RULING
- **`lpn_calib_col_rms_err_tip`**
  > Root mean square error: the square root of the mean of the squared differences between observed and computed values.
  @@ NEEDS RULING
- **`lpn_calib_col_sim_mean`**
  > Computed mean
  @@ NEEDS RULING
- **`lpn_calib_computed`**
  > Computed
  @@ NEEDS RULING
- **`lpn_calib_corr_means`**
  > Correlation between means: {r}
  @@ NEEDS RULING
- **`lpn_calib_corr_none`**
  > Correlation between means: it needs at least two locations whose means differ.
  @@ NEEDS RULING
- **`lpn_calib_corr_note`**
  > Each point is one measurement. The closer the points lie to the diagonal line, the closer the computed values match the observed ones.
  @@ NEEDS RULING
- **`lpn_calib_file`**
  > {file}: {n} measurements at {m} locations.
  @@ NEEDS RULING
- **`lpn_calib_load`**
  > Load calibration file…
  @@ NEEDS RULING
- **`lpn_calib_load_tip`**
  > A text file with a location ID, a time, and a measured value on each line. The time is measured from the start of the simulation, in decimal hours or hours:minutes. A semicolon starts a comment. A line with only a time and a value belongs to the location above it.
  @@ NEEDS RULING
- **`lpn_calib_missing`**
  > Named in the file but not in this network: {ids}.
  @@ NEEDS RULING
- **`lpn_calib_missing_count`**
  > Measurements skipped because their location is not in this network: {n}.
  @@ NEEDS RULING
- **`lpn_calib_needs_run`**
  > There are no results to compare with yet. The report fills in once the network has been calculated.
  @@ NEEDS RULING
- **`lpn_calib_network`**
  > Network
  @@ NEEDS RULING
- **`lpn_calib_no_pairs`**
  > No measurement could be compared, so there is nothing to plot.
  @@ NEEDS RULING
- **`lpn_calib_no_value`**
  > Measurements with no computed value at their time, skipped: {n}.
  @@ NEEDS RULING
- **`lpn_calib_none`**
  > No calibration file is loaded for this parameter.
  @@ NEEDS RULING
- **`lpn_calib_observed`**
  > Observed
  @@ NEEDS RULING
- **`lpn_calib_outside`**
  > Measurements outside the times this run reported, skipped: {n}.
  @@ NEEDS RULING
- **`lpn_calib_param`**
  > Parameter
  @@ NEEDS RULING
- **`lpn_calib_param_tip`**
  > The quantity the calibration file measures. One file is held for each parameter.
  @@ NEEDS RULING
- **`lpn_calib_point`**
  > {id}, {time}: observed {o}, computed {s}
  @@ NEEDS RULING
- **`lpn_calib_session`**
  > A calibration file is held for this session only. It is not saved with the project or on this device.
  @@ NEEDS RULING
- **`lpn_calib_tab_corr`**
  > Correlation plot
  @@ NEEDS RULING
- **`lpn_calib_tab_means`**
  > Mean comparisons
  @@ NEEDS RULING
- **`lpn_calib_tab_stats`**
  > Statistics
  @@ NEEDS RULING
- **`lpn_calib_title`**
  > Calibration report
  @@ NEEDS RULING
- **`lpn_calib_ts_note`**
  > Rings are measured values from the calibration file.
  @@ NEEDS RULING
- **`lpn_calib_ts_point`**
  > Measured at {id}, {time}: {v}
  @@ NEEDS RULING
- **`lpn_calib_units`**
  > The file's values are read in this project's units: {unit}.
  @@ NEEDS RULING
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
  @@ NEEDS RULING
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
  @@ NEEDS RULING
- **`lpn_graphs_menu_tip`**
  > Graphs: Profile, Time Series, and Frequency distribution
  @@ NEEDS RULING
- **`lpn_reports_calib`**
  > Calibration
  @@ NEEDS RULING
- **`lpn_reports_calib_tip`**
  > Compare measured field data from a calibration file with the last run: statistics, a correlation plot, and mean comparisons.
  @@ NEEDS RULING
- **`lpn_scenario_basic`**
  > Basic mode
  _Ruled OK 2026-10-01._
- **`lpn_scenario_basic_tip`**
  > Checked, a scenario is simply the values you set in it. Unchecked, this menu also offers the Alternatives preview table, which shows how those values are grouped by category and invites your feedback.
  _Ruled OK 2026-10-01._

---

# Strings waiting on a branch

**93 still to read**, of 144 new keys across 15 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### feat/calibration (`b50ae755`) — adds no English strings

### feat/contour (`eff6df3a`) — 14 new, 14 to read @@ NEEDS RULING

- **`lpn_contour_consent_1`**
  > Drawing pressure over the ground sends the area your network covers, as Mapbox map tile numbers, to api.mapbox.com, to read the height of the ground there.
  @@ NEEDS RULING
- **`lpn_contour_consent_4`**
  > If you say no, everything else on this page keeps working exactly as it does now, and the contour plot is drawn between nodes alone. We remember a yes so that we need not ask again. A no is not stored at all.
  @@ NEEDS RULING
- **`lpn_contour_dem`**
  > Ground between nodes from Mapbox DEM
  @@ NEEDS RULING
- **`lpn_contour_dem_failed`**
  > The ground could not be read from Mapbox DEM, so pressure is interpolated between nodes alone.
  @@ NEEDS RULING
- **`lpn_contour_dem_tip`**
  > Between nodes, pressure becomes the interpolated head minus the height of the ground from Mapbox DEM, so it can fall below the lowest node pressure on a hill the network has no node on. Treat the ground as a contour map, not a survey.
  @@ NEEDS RULING
- **`lpn_contour_few`**
  > Too few nodes to contour.
  @@ NEEDS RULING
- **`lpn_contour_filled`**
  > Filled contours
  @@ NEEDS RULING
- **`lpn_contour_lines`**
  > Line contours
  @@ NEEDS RULING
- **`lpn_contour_menu`**
  > Contour
  @@ NEEDS RULING
- **`lpn_contour_plot`**
  > Contour plot
  @@ NEEDS RULING
- **`lpn_contour_plot_tip`**
  > Colors the map between nodes by the field the nodes are colored by, interpolated linearly between neighboring nodes. No color is drawn across pumps, valves, or closed links, or across wide gaps between nodes.
  @@ NEEDS RULING
- **`lpn_contour_support`**
  > Contour plot: linear between {n} nodes. No color across pumps, valves, or closed links, or across gaps wider than {k} times the median pipe length.
  @@ NEEDS RULING
- **`lpn_contour_support_dem`**
  > Between nodes, pressure is the interpolated head minus the ground elevation from Mapbox DEM, sampled about every {m} m.
  @@ NEEDS RULING
- **`lpn_contour_tip`**
  > Show a contour plot on the map: the colors of the nodes, spread over the area between them. Its style is in Settings, where you can also turn it off.
  @@ NEEDS RULING

### feat/criticality (`84ea5311`) — 31 new, 8 to read @@ NEEDS RULING

- **`lpn_analyze_menu`**
  > Analyze
  @@ NEEDS RULING
- **`lpn_analyze_menu_tip`**
  > Analyses that run the network many times over on a copy: fire flow at each junction, and the loss of each pipe, pump, and valve.
  @@ NEEDS RULING
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
  @@ NEEDS RULING
- **`lpn_crit_skipdead_tip`**
  > A dead-end link is one whose removal cuts off junctions that can be reached only through it, with no reservoir or tank beyond. Its loss is everything beyond it, so it is not solved. The summary says how many were skipped.
  @@ NEEDS RULING
- **`lpn_crit_skipped`**
  > {n} selected elements are not links, so they were not broken.
  _Ruled OK 2026-10-01._
- **`lpn_crit_skipped_dead`**
  > Dead-end links skipped: {n}. Each one cuts off everything beyond it.
  @@ NEEDS RULING
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
  @@ NEEDS RULING
- **`lpn_ff_design_off`**
  > None
  @@ NEEDS RULING
- **`lpn_ff_design_selected`**
  > Selected
  @@ NEEDS RULING

### feat/demand-scaling (`97943972`) — 77 new, 54 to read @@ NEEDS RULING

- **`lpn_analyze_menu`**
  > Analyze
  @@ NEEDS RULING
- **`lpn_analyze_menu_tip`**
  > Analyses that run the network on a copy: fire flow at each junction, the loss of each pipe, pump, and valve, and the demands scaled up or down.
  @@ NEEDS RULING
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
  @@ NEEDS RULING
- **`lpn_crit_skipdead_tip`**
  > A dead-end link is one whose removal cuts off junctions that can be reached only through it, with no reservoir or tank beyond. Its loss is everything beyond it, so it is not solved. The summary says how many were skipped.
  @@ NEEDS RULING
- **`lpn_crit_skipped`**
  > {n} selected elements are not links, so they were not broken.
  _Ruled OK 2026-10-01._
- **`lpn_crit_skipped_dead`**
  > Dead-end links skipped: {n}. Each one cuts off everything beyond it.
  @@ NEEDS RULING
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
  @@ NEEDS RULING
- **`lpn_ds_bad_multiplier`**
  > Type a demand scale of zero or more, such as 1.5.
  @@ NEEDS RULING
- **`lpn_ds_below_zero`**
  > ⚠ At least one junction is below {pressure} even with the scaled demands at zero.
  @@ NEEDS RULING
- **`lpn_ds_col_link`**
  > Link
  @@ NEEDS RULING
- **`lpn_ds_col_scaled`**
  > Scaled
  @@ NEEDS RULING
- **`lpn_ds_col_scaled_tip`**
  > With the demands multiplied by the demand scale.
  @@ NEEDS RULING
- **`lpn_ds_col_unscaled`**
  > Unscaled
  @@ NEEDS RULING
- **`lpn_ds_col_unscaled_tip`**
  > With the demands as they are in the active scenario at this time step, the same value the map shows.
  @@ NEEDS RULING
- **`lpn_ds_eps_note`**
  > Only the time step now on screen is scaled, with its tank levels and link statuses. To test the peak, move the clock to the peak demand before you run.
  @@ NEEDS RULING
- **`lpn_ds_find`**
  > Find
  @@ NEEDS RULING
- **`lpn_ds_found`**
  > ✓ Every junction keeps {pressure} up to a demand scale of {m}.
  @@ NEEDS RULING
- **`lpn_ds_found_below`**
  > ⚠ At least one junction is already below {pressure} at the demands as they are. The system keeps it up to a demand scale of {m}.
  @@ NEEDS RULING
- **`lpn_ds_head_lowest`**
  > Lowest pressures
  @@ NEEDS RULING
- **`lpn_ds_head_scale`**
  > Scale the demands
  @@ NEEDS RULING
- **`lpn_ds_head_search`**
  > What demand scale can the system handle?
  @@ NEEDS RULING
- **`lpn_ds_head_search_selected`**
  > What demand can the selection handle
  @@ NEEDS RULING
- **`lpn_ds_head_velocity`**
  > Highest velocities
  @@ NEEDS RULING
- **`lpn_ds_holds_max`**
  > ✓ Every junction keeps {pressure} up to a demand scale of {max}, the top of the search.
  @@ NEEDS RULING
- **`lpn_ds_intro`**
  > The demands are multiplied on a copy of the network, which is solved at the time step on screen in the active scenario. Nothing in your project is changed.
  @@ NEEDS RULING
- **`lpn_ds_lowest_at`**
  > At a demand scale of {m}, the lowest pressure is {pressure}, at junction {id}.
  @@ NEEDS RULING
- **`lpn_ds_menu`**
  > Demand scaling…
  @@ NEEDS RULING
- **`lpn_ds_menu_tip`**
  > Multiply the demands on a copy of the network and see the pressures and velocities, or find the largest demand scale the system can carry.
  @@ NEEDS RULING
- **`lpn_ds_minpressure`**
  > Lowest pressure allowed
  @@ NEEDS RULING
- **`lpn_ds_minpressure_tip`**
  > This is the same number as Lowest pressure allowed elsewhere in Fire flow analysis. Changing it here changes it there.
  @@ NEEDS RULING
- **`lpn_ds_multiplier`**
  > Demand scale
  @@ NEEDS RULING
- **`lpn_ds_multiplier_tip`**
  > The number each demand is multiplied by: 1.5 is half again as much water. It applies on top of the active scenario's own demand multiplier, which is already in the demands, and it is never saved in your project.
  @@ NEEDS RULING
- **`lpn_ds_no_junctions`**
  > This project has no junctions yet, so there are no demands to scale.
  @@ NEEDS RULING
- **`lpn_ds_no_selection`**
  > No junctions are selected. Select junctions, or scale all of them.
  @@ NEEDS RULING
- **`lpn_ds_nosolve_at`**
  > At a demand scale of {m}, the network gave no answer. {reason}
  @@ NEEDS RULING
- **`lpn_ds_outside_below`**
  > At a demand scale of {m}, junctions not selected that are below {pressure}: {n} ({ids}). They do not limit this answer.
  @@ NEEDS RULING
- **`lpn_ds_run`**
  > Run
  @@ NEEDS RULING
- **`lpn_ds_scale_below`**
  > ⚠ At a demand scale of {m}, junctions below {pressure}: {n}.
  @@ NEEDS RULING
- **`lpn_ds_scale_ok`**
  > ✓ At a demand scale of {m}, every junction keeps {pressure}.
  @@ NEEDS RULING
- **`lpn_ds_scaled_selected`**
  > Junctions scaled and checked: {n}.
  @@ NEEDS RULING
- **`lpn_ds_scope`**
  > Demands to scale
  @@ NEEDS RULING
- **`lpn_ds_scope_all`**
  > All junctions
  @@ NEEDS RULING
- **`lpn_ds_scope_selected`**
  > Selected junctions
  @@ NEEDS RULING
- **`lpn_ds_scope_tip`**
  > Scale the demand of the selection. Pressures are checked at the scaled demand.
  @@ NEEDS RULING
- **`lpn_ds_search_note`**
  > Finds the largest demand scale, from 0 to {max} to the nearest {step}, at which every junction keeps the lowest pressure allowed. It assumes that more demand never raises the lowest pressure.
  @@ NEEDS RULING
- **`lpn_ds_search_note_selected`**
  > Finds the largest demand scale, from 0 to {max} to the nearest {step}, at which the selection keeps the given lowest pressure allowed.
  @@ NEEDS RULING
- **`lpn_ds_search_stopped`**
  > The search was stopped before it found an answer.
  @@ NEEDS RULING
- **`lpn_ds_skipped`**
  > Selected elements that are not junctions, left as they are: {n}.
  @@ NEEDS RULING
- **`lpn_ds_stale`**
  > The drawing changed, so the demand scaling results were cleared. Run it again.
  @@ NEEDS RULING
- **`lpn_ds_time_moved`**
  > ⚠ This was computed at {time}, and the clock is now at {now}. Run it again for the time step on screen.
  @@ NEEDS RULING
- **`lpn_ds_title`**
  > Demand scaling
  @@ NEEDS RULING
- **`lpn_ff_design_all`**
  > All
  @@ NEEDS RULING
- **`lpn_ff_design_off`**
  > None
  @@ NEEDS RULING
- **`lpn_ff_design_selected`**
  > Selected
  @@ NEEDS RULING
- **`lpn_ff_rows_more_links`**
  > Links not shown: {n}.
  @@ NEEDS RULING

### feat/desktop (`baba0f04`) — adds no English strings

### feat/flow-balance (`b7b530c6`) — 7 new, 7 to read @@ NEEDS RULING

- **`lpn_sysflow_consumed`**
  > Consumed
  @@ NEEDS RULING
- **`lpn_sysflow_consumed_tip`**
  > Total of every positive demand: water drawn from the network at junctions, and any flow into a reservoir.
  @@ NEEDS RULING
- **`lpn_sysflow_menu`**
  > System flow
  @@ NEEDS RULING
- **`lpn_sysflow_produced`**
  > Produced
  @@ NEEDS RULING
- **`lpn_sysflow_produced_tip`**
  > Total flow into the network from reservoirs and from negative demands.
  @@ NEEDS RULING
- **`lpn_sysflow_tip`**
  > Graph the total flow produced and the total flow consumed against time, across the extended period simulation. Tanks are in neither total, so where the two lines part, the tanks are filling or draining.
  @@ NEEDS RULING
- **`lpn_sysflow_title`**
  > System flow balance
  @@ NEEDS RULING

### feat/keyboard-menu (`f783fe5f`) — 3 new, 3 to read @@ NEEDS RULING

- **`lpn_hotkeys_menu_def`**
  > <table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+letter</td><td>Open the menu with that letter, then press a row's letter to choose it. The letters show while you use the keyboard. On a Mac, use Ctrl+Option.</td></tr><tr><td>F10</td><td>Go to the menu bar.</td></tr></tbody></table>
  @@ NEEDS RULING
- **`lpn_hotkeys_menu_heading`**
  > Menus
  @@ NEEDS RULING
- **`lpn_hotkeys_menu_term`**
  > Menu keyboard shortcuts
  @@ NEEDS RULING

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
  @@ NEEDS RULING
- **`lpn_profile_file_missing`**
  > Named in the file but not in this network: {ids}.
  @@ NEEDS RULING
- **`lpn_profile_file_short`**
  > The file names fewer than two nodes in this network, so there is no profile to draw.
  @@ NEEDS RULING
- **`lpn_profile_open`**
  > Open EPANET profile file…
  @@ NEEDS RULING

### feat/property-graph (`7686ca67`) — 5 new, 3 to read @@ NEEDS RULING

- **`lpn_pgraph_none`**
  > This asset has no results in the current run.
  _Ruled OK 2026-10-01._
- **`lpn_pgraph_source_share_from`**
  > Source share from {node}
  _Ruled OK 2026-10-01._
- **`lpn_report_pump_head`**
  > Pump head
  @@ NEEDS RULING
- **`lpn_result_pump_head`**
  > Head
  @@ NEEDS RULING
- **`lpn_result_pump_head_tip`**
  > The head the pump adds from suction to discharge, shown as a positive number. The solver and EPANET files carry it as a negative head loss.
  @@ NEEDS RULING

### fix/label-eviction (`840cb7cc`) — adds no English strings
