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

**9 still to read on master**, of 179 untranslated keys, of 2331 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (1 to read @@ NEEDS RULING)

**These are SHIPPED strings, already translated into 26 languages.** A wave-0
reading or a translator found each one readable two ways, and no sprint launches while one is
unanswered. You are not being asked to approve wording here; you are being asked which reading
is the one you meant. "The first one" is a complete answer.

### from sprint 1003-ds

- **`lpn_ds_found_below`**
  > ⚠ At least one junction is already below {pressure} at the demands as they are. The system keeps it up to a demand scale of {m}.
  *The finding:* Tom: 'I think I need explanation, and this need clarification.' It appears after Find when the demands as entered (a demand scale of 1) leave at least one junction below the limit; {m} is the largest scale, always under 1, at which every judged junction keeps the limit (0.62 means demands cut to 62 percent). 'it' in 'keeps it' is vague, 'demands as they are' never says scale 1, and {m} reads as headroom when it is a cut.
  1. the system can take up to {m} times today's demand (wrong)
  2. demands must be cut to {m} times what is entered for every junction to keep the pressure (right)
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED A: '⚠ At least one junction is below {pressure} at the demands as entered (a demand scale of 1). All junctions keep {pressure} only if demands are cut to a demand scale of {m} or less.' PROPOSED B: '⚠ The demands as entered (a demand scale of 1) leave at least one junction below {pressure}. The largest demand scale that keeps every junction at {pressure} or above is {m}.' B paralle...
  @@ NEEDS RULING

## Synonym entries to approve  (13, 13 to read @@ NEEDS RULING)

**These are translator notes (`$ec_lang_syn`), not visitor wording.** Each was written against an
English string that has since changed, or against a key that no longer exists. Say which: keep it
as is, change it (a proposal may follow), or remove it. **Your answer on the flag line is the
written permission** the rule requires; CC then applies it by hand and re-records it. A script
never edits a synonym.

- **`lpn_ds_head_search_selected`**
  > What demand scale can these junctions handle?
  *Why stale:* the English changed after this synonym was written
  *Written against:* What demand can the selection handle
  *Current synonym:* What demand can the junctions you choose handle
  *Proposed synonym:* What demand scale can these junctions carry?, How far can the demand at these junctions be scaled?
  *Why this proposal:* The heading is now a question about a demand scale at these junctions; both rephrasings could head the same box.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_ds_scope_tip`**
  > All junctions, or only those selected on the map. Pressures are checked at the scaled demand.
  *Why stale:* the English changed after this synonym was written
  *Written against:* Scale the demand of the selection. Pressures are checked at the scaled demand.
  *Current synonym:* Scale the demand at the junctions that you choose. Pressures are checked at the scaled demand.
  *Proposed synonym:* Every junction, or just the junctions selected on the map. Pressures are checked at the scaled demand.
  *Why this proposal:* Whole-string rephrasing of the new two-option sentence; the old text described only the selection.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_ds_search_note_selected`**
  > (this key no longer exists in lib/lang.ec.en.php)
  *Why stale:* the key no longer exists, so this entry describes nothing
  *Written against:* Finds the largest demand scale, from 0 to {max} to the nearest {step}, at which the selection keeps the given lowest pressure allowed.
  *Current synonym:* Finds the largest demand scale, from 0 to {max} to the nearest {step}, at which the junctions that you choose keep the given lowest pressure allowed.
  **What this asks for:** WRITTEN PERMISSION to remove this `$ec_lang_syn` entry.
  @@ NEEDS RULING

- **`lpn_ff_all`**
  > All junctions
  *Why stale:* the English changed after this synonym was written
  *Written against:* All
  *Current synonym:* All junctions | a pull-down option under Junctions to test; agrees with junctions, plural
  *Proposed synonym:* Every junction, All the junctions | a pull-down option under Junctions to test; agrees with junctions, plural
  *Why this proposal:* Both would fit the pull-down; the English now says junctions, plural, which the commentary already required.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_ff_selected`**
  > Selected junctions
  *Why stale:* the English changed after this synonym was written
  *Written against:* Selected
  *Current synonym:* Selected junctions | a pull-down option under Junctions to test; agrees with junctions, plural
  *Proposed synonym:* Only the selected junctions, The junctions selected on the map | a pull-down option under Junctions to test; agrees with junctions, plural
  *Why this proposal:* Each could stand in the pull-down row; the old text only repeated the English.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_help_icons`**
  > Toolbar
  *Why stale:* the English changed after this synonym was written
  *Written against:* Toolbar key
  *Current synonym:* Toolbar legend, Key to the toolbar icons, What each toolbar icon means, Toolbar help, Toolbar | avoid: a keyboard key or shortcut
  *Proposed synonym:* Toolbar legend, Toolbar icon key, Toolbar help | avoid: a keyboard key or shortcut
  *Why this proposal:* The English dropped the word key; each could stand in the menu row.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_labels_col_after`**
  > Aft.
  *Why stale:* the English changed after this synonym was written
  *Written against:* After
  *Current synonym:* After, Suffix, Trailing text, Postfix | avoid: after in the sense of later in time
  *Proposed synonym:* Aft. (After, Suffix, Trailing text) | layout: column heading; avoid: after in the sense of later in time
  *Why this proposal:* The English is now the short heading; the full words are the alternates.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_labels_col_before`**
  > Bef.
  *Why stale:* the English changed after this synonym was written
  *Written against:* Before
  *Current synonym:* Before, In front, In front of the value, Prefix, Leading text | avoid: before in the sense of earlier in time
  *Proposed synonym:* Bef. (Before, Prefix, Leading text) | layout: column heading; avoid: before in the sense of earlier in time
  *Why this proposal:* The English is now the short heading; the full words are the alternates.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_lock_break`**
  > Break lock
  *Why stale:* the English changed after this synonym was written
  *Written against:* Break their lock
  *Current synonym:* Break their lock, unlock the file, take over the file, release their hold on it, claim the file, override their claim | layout: button
  *Proposed synonym:* Break lock, Unlock the file, Take over the file, Override their claim | layout: button
  *Why this proposal:* Dropped the options that only made sense with the old English "Break their lock".
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_settings_map_display`**
  > Appearance
  *Why stale:* the English changed after this synonym was written
  *Written against:* Map appearance
  *Current synonym:* How the map looks (appearance, style, the way it is drawn) — sizes, opacity, position.
  *Proposed synonym:* Appearance, Look, Style, How the map is drawn
  *Why this proposal:* The old text was a description; each of these could be the heading.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_units_group_inputs`**
  > (this key no longer exists in lib/lang.ec.en.php)
  *Why stale:* the key no longer exists, so this entry describes nothing
  *Written against:* Input units
  *Current synonym:* Units of inputs, or Units of what you enter
  **What this asks for:** WRITTEN PERMISSION to remove this `$ec_lang_syn` entry.
  @@ NEEDS RULING

- **`lpn_units_group_results`**
  > (this key no longer exists in lib/lang.ec.en.php)
  *Why stale:* the key no longer exists, so this entry describes nothing
  *Written against:* Results units
  *Current synonym:* Units of results, or Units of the answers
  **What this asks for:** WRITTEN PERMISSION to remove this `$ec_lang_syn` entry.
  @@ NEEDS RULING

- **`mtc_note_1`**
  > <dl><dt>Automated rock size and roughness design iteration</dt><dd>Choose a roughness option (Blodgett–Bathurst recommended) and a design rock size option (Isbash recommended). Adjust depth and rock size safety factor to reach your target flow with a uniform rock size. Each time you change an input, the calculator repeats these steps: 1. Roughness is calculated from design rock size. 2. The roughness value from the method you chose is copied into the roughness input. 3. Channel flow and required rock size are calculated. 4. Design rock size is adjusted. 5. Repeat until error in the design rock size is very small.</dd><dt>Basic calculator (no iteration)</dt><dd>Enter your desired roughness value. Ignore the design rock size input area.</dd></dl>
  *Why stale:* the English changed after this synonym was written
  *Written against:* <dl><dt>Automated rock size and roughness design iteration</dt><dd>Choose a roughness option (Blodgett–Bathurst recommended) and a design rock size option (Isbash recommended). Adjust depth and rock size safety factor to reach your target flow with a uniform rock size. Each time you change an input, the calculator repeats these steps: 1. Roughness is calculated from design rock size. 2. The r...
  *Current synonym:* | avoid: compressing "Blodgett–Bathurst" to an initialism like "BB" — recurred independently across 8+ languages (it/ru/bg/es/uk/sr/hr/cs/tr/ps/my, corrected 2026-07-08) since nothing else in this string defines what the initials stand for; spell the full name out in every language, matching mtc_blodgett_v_bathurst
  *Proposed synonym:* | avoid: compressing "Blodgett–Bathurst" to an initialism like "BB" — recurred independently across 8+ languages (it/ru/bg/es/uk/sr/hr/cs/tr/ps/my, corrected 2026-07-08) since nothing else in this string defines what the initials stand for; spell the full name out in every language, matching mtc_blodgett_v_bathurst
  *Why this proposal:* No change proposed: the note is about the initialism, not the reworded step 2, and still holds.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

## lpn_  (179, 9 to read @@ NEEDS RULING)

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
  _Ruled OK 2026-10-03._
- **`lpn_analyze_menu`**
  > Analyze
  _Ruled OK 2026-10-03._
- **`lpn_analyze_menu_tip`**
  > Analyses that run the network on a copy: fire flow at each junction, the loss of each pipe, pump, and valve, and the demands scaled up or down.
  _Ruled OK 2026-10-03._
- **`lpn_calib_axis_obs`**
  > Observed: {q}
  _Ruled OK 2026-10-03._
- **`lpn_calib_axis_sim`**
  > Computed: {q}
  _Ruled OK 2026-10-03._
- **`lpn_calib_bad_lines`**
  > Lines that could not be read, skipped: {lines}
  _Ruled OK 2026-10-03._
- **`lpn_calib_col_location`**
  > Location
  _Ruled OK 2026-10-03._
- **`lpn_calib_col_mean_err`**
  > Mean error
  _Ruled OK 2026-10-03._
- **`lpn_calib_col_mean_err_tip`**
  > The mean of the absolute differences between each observed value and the computed value at the same time.
  _Ruled OK 2026-10-03._
- **`lpn_calib_col_n`**
  > Num obs
  _Ruled OK 2026-10-03._
- **`lpn_calib_col_n_tip`**
  > Number of observations: the measurements at this location that were compared.
  _Ruled OK 2026-10-03._
- **`lpn_calib_col_obs_mean`**
  > Observed mean
  _Ruled OK 2026-10-03._
- **`lpn_calib_col_rms_err`**
  > RMS error
  _Ruled OK 2026-10-03._
- **`lpn_calib_col_rms_err_tip`**
  > Root mean square error: the square root of the mean of the squared differences between observed and computed values.
  _Ruled OK 2026-10-03._
- **`lpn_calib_col_sim_mean`**
  > Computed mean
  _Ruled OK 2026-10-03._
- **`lpn_calib_computed`**
  > Computed
  _Ruled OK 2026-10-03._
- **`lpn_calib_corr_means`**
  > Correlation between means: {r}
  _Ruled OK 2026-10-03._
- **`lpn_calib_corr_none`**
  > Correlation between means: it needs at least two locations whose means differ.
  _Ruled OK 2026-10-03._
- **`lpn_calib_corr_note`**
  > Each point is one measurement. The closer the points lie to the diagonal line, the closer the computed values match the observed ones.
  _Ruled OK 2026-10-03._
- **`lpn_calib_file`**
  > {file}: {n} measurements at {m} locations.
  _Ruled OK 2026-10-03._
- **`lpn_calib_load`**
  > Load calibration file…
  _Ruled OK 2026-10-03._
- **`lpn_calib_load_tip`**
  > A text file with a location ID, a time, and a measured value on each line. The time is measured from the start of the simulation, in decimal hours or hours:minutes. A semicolon starts a comment. A line with only a time and a value belongs to the location above it.
  _Ruled OK 2026-10-03._
- **`lpn_calib_missing`**
  > Named in the file but not in this network: {ids}.
  _Ruled OK 2026-10-03._
- **`lpn_calib_missing_count`**
  > Measurements skipped because their location is not in this network: {n}.
  _Ruled OK 2026-10-03._
- **`lpn_calib_needs_run`**
  > There are no results to compare with yet. The report fills in once the network has been calculated.
  _Ruled OK 2026-10-03._
- **`lpn_calib_network`**
  > Network
  _Ruled OK 2026-10-03._
- **`lpn_calib_no_pairs`**
  > No measurement could be compared, so there is nothing to plot.
  _Ruled OK 2026-10-03._
- **`lpn_calib_no_value`**
  > Measurements with no computed value at their time, skipped: {n}.
  _Ruled OK 2026-10-03._
- **`lpn_calib_none`**
  > No calibration file is loaded for this parameter.
  _Ruled OK 2026-10-03._
- **`lpn_calib_observed`**
  > Observed
  _Ruled OK 2026-10-03._
- **`lpn_calib_outside`**
  > Measurements outside the times this run reported, skipped: {n}.
  _Ruled OK 2026-10-03._
- **`lpn_calib_param`**
  > Parameter
  _Ruled OK 2026-10-03._
- **`lpn_calib_param_tip`**
  > The quantity the calibration file measures. One file is held for each parameter.
  _Ruled OK 2026-10-03._
- **`lpn_calib_point`**
  > {id}, {time}: observed {o}, computed {s}
  _Ruled OK 2026-10-03._
- **`lpn_calib_session`**
  > A calibration file is held for this session only. It is not saved with the project or on this device.
  _Ruled OK 2026-10-03._
- **`lpn_calib_single`**
  > This is a single-period run, so every measurement is compared with its one result, whatever time the file gives.
  _Ruled OK 2026-10-03._
- **`lpn_calib_tab_corr`**
  > Correlation plot
  _Ruled OK 2026-10-03._
- **`lpn_calib_tab_means`**
  > Mean comparisons
  _Ruled OK 2026-10-03._
- **`lpn_calib_tab_stats`**
  > Statistics
  _Ruled OK 2026-10-03._
- **`lpn_calib_title`**
  > Calibration report
  _Ruled OK 2026-10-03._
- **`lpn_calib_ts_note`**
  > Rings are measured values from the calibration file.
  _Ruled OK 2026-10-03._
- **`lpn_calib_ts_point`**
  > Measured at {id}, {time}: {v}
  _Ruled OK 2026-10-03._
- **`lpn_calib_units`**
  > The file's values are read in this project's units: {unit}.
  _Ruled OK 2026-10-03._
- **`lpn_contour_buffer`**
  > Buffer
  _Ruled OK 2026-10-03._
- **`lpn_contour_buffer_tip`**
  > How far the color reaches from each pipe, as a multiple of the median pipe length. It fades out over the outer part.
  _Ruled OK 2026-10-03._
- **`lpn_contour_buffer_unit`**
  > × median pipe length
  _Ruled OK 2026-10-03._
- **`lpn_contour_consent_1`**
  > Drawing pressure over the ground sends the area your network covers, as Mapbox map tile numbers, to api.mapbox.com, to read the height of the ground there.
  _Ruled OK 2026-10-03._
- **`lpn_contour_consent_2`**
  > This is a different question from the map pictures behind your project. The pictures only say where you are looking. These tiles say where your network is. Mapbox will receive those tile numbers and your IP address. We send nothing else: no name, no pipes, no project. We keep no record of it, and nothing is stored on this device except your answer to this question.
  _Ruled OK 2026-10-03._
- **`lpn_contour_consent_3`**
  > May we send the tile numbers of your network's area to Mapbox?
  _Ruled OK 2026-10-03._
- **`lpn_contour_consent_4`**
  > If you say no, everything else on this page keeps working exactly as it does now, and the contour plot is drawn between nodes alone. We remember a yes so that we need not ask again. A no is not stored at all.
  _Ruled OK 2026-10-03._
- **`lpn_contour_dem`**
  > Ground between nodes from Mapbox DEM
  _Ruled OK 2026-10-03._
- **`lpn_contour_dem_failed`**
  > The ground could not be read from Mapbox DEM, so pressure is interpolated between nodes alone.
  _Ruled OK 2026-10-03._
- **`lpn_contour_dem_tip`**
  > Between nodes, pressure becomes the interpolated head minus the height of the ground from Mapbox DEM, so it can fall below the lowest node pressure on a hill the network has no node on. Treat the ground as a contour map, not a survey.
  _Ruled OK 2026-10-03._
- **`lpn_contour_few`**
  > Too few nodes to contour.
  _Ruled OK 2026-10-03._
- **`lpn_contour_fill`**
  > Fill
  _Ruled OK 2026-10-03._
- **`lpn_contour_fill_bands`**
  > Bands
  _Ruled OK 2026-10-03._
- **`lpn_contour_fill_smooth`**
  > Smooth
  _Ruled OK 2026-10-03._
- **`lpn_contour_fill_tip`**
  > Smooth blends the colors from one class to the next. Bands paints each class of the color key flat.
  _Ruled OK 2026-10-03._
- **`lpn_contour_interval`**
  > Interval
  _Ruled OK 2026-10-03._
- **`lpn_contour_lines`**
  > Contour lines
  _Ruled OK 2026-10-03._
- **`lpn_contour_menu`**
  > Contour
  _Ruled OK 2026-10-03._
- **`lpn_contour_opacity`**
  > Fill opacity
  _Ruled OK 2026-10-03._
- **`lpn_contour_plot`**
  > Contour plot
  _Ruled OK 2026-10-03._
- **`lpn_contour_support`**
  > Contour plot: {n} nodes, interpolated along {p} pipes and up to {k} times the median pipe length beside them. No color across pumps, valves, or closed links.
  _Ruled OK 2026-10-03._
- **`lpn_contour_support_dem`**
  > Between nodes, pressure is the interpolated head minus the ground elevation from Mapbox DEM, sampled about every {m} m.
  _Ruled OK 2026-10-03._
- **`lpn_contour_support_lines`**
  > Contour lines every {i} {u}.
  _Ruled OK 2026-10-03._
- **`lpn_contour_tip`**
  > Show a contour plot on the map: the node colors spread along and beside the pipes, with labeled contour lines. Opens a box to tune it or turn it off.
  _Ruled OK 2026-10-03._
- **`lpn_contour_too_many`**
  > Too many contour lines at this interval; widen it to draw them.
  _Ruled OK 2026-10-03._
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
  _Ruled OK 2026-10-03._
- **`lpn_copy_opened`**
  > Opened {file} as a copy, with a new lock of its own that will be saved with the next file save.
  _Ruled 2026-10-01: Wording change per this. This is good._
- **`lpn_copy_original`**
  > Original; keep same lock
  _Ruled OK 2026-10-01._
- **`lpn_copy_title`**
  > Mark file as new copy?
  _Ruled OK 2026-10-01._
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
  _Ruled OK 2026-10-03._
- **`lpn_crit_scope`**
  > Links to break
  _Ruled OK 2026-10-01._
- **`lpn_crit_scope_all`**
  > All links
  _Ruled OK 2026-10-03._
- **`lpn_crit_scope_selected`**
  > Selected links
  _Ruled OK 2026-10-03._
- **`lpn_crit_scope_tip`**
  > All pipes, pumps, and valves, or only those selected on the map. Choose the set before you run.
  _Ruled OK 2026-10-03._
- **`lpn_crit_skipdead`**
  > Skip dead ends
  _Ruled OK 2026-10-03._
- **`lpn_crit_skipdead_tip`**
  > A dead-end link is one whose removal cuts off junctions that can be reached only through it, with no reservoir or tank beyond. Its loss is everything beyond it, so it is not solved. The summary says how many were skipped.
  _Ruled OK 2026-10-03._
- **`lpn_crit_skipped`**
  > {n} selected elements are not links, so they were not broken.
  _Ruled OK 2026-10-01._
- **`lpn_crit_skipped_dead`**
  > Dead-end links skipped: {n}. Each one cuts off everything beyond it.
  _Ruled OK 2026-10-03._
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
- **`lpn_dock_autohide`**
  > Auto-hide
  @@ NEEDS RULING
- **`lpn_dock_float`**
  > Float
  @@ NEEDS RULING
- **`lpn_dock_left`**
  > Dock at the left of the map
  @@ NEEDS RULING
- **`lpn_dock_right`**
  > Dock at the right of the map
  @@ NEEDS RULING
- **`lpn_ds_at_time`**
  > Time step: {time}.
  _Ruled OK 2026-10-03._
- **`lpn_ds_bad_multiplier`**
  > Type a demand scale of zero or more, such as 1.5.
  _Ruled OK 2026-10-03._
- **`lpn_ds_below_zero`**
  > ⚠ At least one junction is below {pressure} even with the scaled demands at zero.
  _Ruled OK 2026-10-03._
- **`lpn_ds_col_link`**
  > Link
  _Ruled OK 2026-10-03._
- **`lpn_ds_col_scaled`**
  > Scaled
  _Ruled OK 2026-10-03._
- **`lpn_ds_col_scaled_tip`**
  > With the demands multiplied by the demand scale.
  _Ruled OK 2026-10-03._
- **`lpn_ds_col_unscaled`**
  > Unscaled
  _Ruled OK 2026-10-03._
- **`lpn_ds_col_unscaled_tip`**
  > With the demands as they are in the active scenario at this time step, the same value the map shows.
  _Ruled OK 2026-10-03._
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
  _Ruled 2026-10-03: I think I need explanation, and this need clarification._
- **`lpn_ds_head_lowest`**
  > Lowest pressures
  _Ruled OK 2026-10-03._
- **`lpn_ds_head_scale`**
  > Scale the demands
  _Ruled OK 2026-10-03._
- **`lpn_ds_head_search`**
  > What demand scale can the system handle?
  _Ruled OK 2026-10-03._
- **`lpn_ds_head_search_selected`**
  > What demand scale can these junctions handle?
  _Ruled OK 2026-10-03._
- **`lpn_ds_head_velocity`**
  > Highest velocities
  _Ruled OK 2026-10-03._
- **`lpn_ds_holds_max`**
  > ✓ Every junction keeps {pressure} up to a demand scale of {max}, the top of the search.
  _Ruled OK 2026-10-03._
- **`lpn_ds_intro`**
  > The demands are multiplied on a copy of the network, which is solved at the time step on screen in the active scenario. Nothing in your project is changed.
  _Ruled OK 2026-10-03._
- **`lpn_ds_lowest_at`**
  > At a demand scale of {m}, the lowest pressure is {pressure}, at junction {id}.
  _Ruled OK 2026-10-03._
- **`lpn_ds_menu`**
  > Demand scaling…
  _Ruled OK 2026-10-03._
- **`lpn_ds_menu_tip`**
  > Multiply the demands on a copy of the network and see the pressures and velocities, or find the largest demand scale the system can carry.
  _Ruled OK 2026-10-03._
- **`lpn_ds_minpressure`**
  > Lowest pressure allowed
  _Ruled OK 2026-10-03._
- **`lpn_ds_minpressure_tip`**
  > This is the same number as Lowest pressure allowed elsewhere in Fire flow analysis. Changing it here changes it there.
  _Ruled OK 2026-10-03._
- **`lpn_ds_multiplier`**
  > Demand scale
  _Ruled OK 2026-10-03._
- **`lpn_ds_multiplier_tip`**
  > The number each demand is multiplied by: 1.5 is half again as much water. It applies on top of the active scenario's own demand multiplier, which is already in the demands, and it is never saved in your project.
  _Ruled OK 2026-10-03._
- **`lpn_ds_no_junctions`**
  > This project has no junctions yet, so there are no demands to scale.
  _Ruled OK 2026-10-03._
- **`lpn_ds_no_selection`**
  > No junctions are selected. Select junctions or choose All junctions.
  _Ruled OK 2026-10-03._
- **`lpn_ds_nosolve_at`**
  > At a demand scale of {m}, the network gave no answer. {reason}
  _Ruled OK 2026-10-03._
- **`lpn_ds_outside_below`**
  > At a demand scale of {m}, junctions not selected that are below {pressure}: {n} ({ids}). They do not limit this answer.
  _Ruled OK 2026-10-03._
- **`lpn_ds_run`**
  > Run
  _Ruled OK 2026-10-03._
- **`lpn_ds_scale_below`**
  > ⚠ At a demand scale of {m}, junctions below {pressure}: {n}.
  _Ruled OK 2026-10-03._
- **`lpn_ds_scale_ok`**
  > ✓ At a demand scale of {m}, every junction keeps {pressure}.
  _Ruled OK 2026-10-03._
- **`lpn_ds_scaled_selected`**
  > Junctions scaled and checked: {n}.
  _Ruled OK 2026-10-03._
- **`lpn_ds_scope`**
  > Junctions to scale
  _Ruled OK 2026-10-03._
- **`lpn_ds_scope_all`**
  > All junctions
  _Ruled OK 2026-10-03._
- **`lpn_ds_scope_selected`**
  > Selected junctions
  _Ruled OK 2026-10-03._
- **`lpn_ds_scope_tip`**
  > All junctions, or only those selected on the map. Pressures are checked at the scaled demand.
  _Ruled OK 2026-10-03._
- **`lpn_ds_search_note`**
  > Finds the largest demand scale, from 0 to {max} to the nearest {step}, at which all these junctions maintain the lowest pressure allowed. It assumes that more demand never raises the lowest pressure.
  @@ NEEDS RULING
- **`lpn_ds_search_stopped`**
  > The search was stopped before it found an answer.
  _Ruled 2026-10-03: OK. Are we sure this isn't already provided by a different key?_
- **`lpn_ds_skipped`**
  > Selected elements that are not junctions, left as they are: {n}.
  _Ruled OK 2026-10-03._
- **`lpn_ds_stale`**
  > The drawing changed, so the demand scaling results were cleared. Run it again.
  _Ruled OK 2026-10-03._
- **`lpn_ds_time_moved`**
  > ⚠ This was computed at {time}, and the clock is now at {now}. Run it again for the time step on screen.
  _Ruled OK 2026-10-03._
- **`lpn_ds_title`**
  > Demand scaling
  _Ruled OK 2026-10-03._
- **`lpn_ff_design_all`**
  > All
  _Ruled OK 2026-10-03._
- **`lpn_ff_design_off`**
  > None
  _Ruled OK 2026-10-03._
- **`lpn_ff_design_selected`**
  > Selected
  _Ruled OK 2026-10-03._
- **`lpn_ff_rows_more_links`**
  > Links not shown: {n}.
  _Ruled OK 2026-10-03._
- **`lpn_graphs_menu`**
  > Graphs
  _Ruled OK 2026-10-03._
- **`lpn_graphs_menu_tip`**
  > Plot a profile along a path, a time series at one element, the frequency distribution of results, a contour plot on the map, or the flow balance over time.
  @@ NEEDS RULING
- **`lpn_hotkeys_menu_def`**
  > <table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+letter</td><td>Open the menu with that letter, then press a row's letter to choose it. The letters show while you use the keyboard. On a Mac, use Ctrl+Option.</td></tr><tr><td>F10</td><td>Go to the menu bar.</td></tr></tbody></table>
  _Ruled OK 2026-10-03._
- **`lpn_hotkeys_menu_heading`**
  > Menus
  _Ruled OK 2026-10-03._
- **`lpn_hotkeys_menu_term`**
  > Menu keyboard shortcuts
  _Ruled OK 2026-10-03._
- **`lpn_reports_calib`**
  > Calibration
  _Ruled OK 2026-10-03._
- **`lpn_reports_calib_tip`**
  > Compare measured field data from a calibration file with the last run: statistics, a correlation plot, and mean comparisons.
  _Ruled OK 2026-10-03._
- **`lpn_scenario_basic`**
  > Basic mode
  _Ruled OK 2026-10-01._
- **`lpn_scenario_basic_tip`**
  > Checked, a scenario is simply the values you set in it. Unchecked, this menu also offers the Alternatives preview table, which shows how those values are grouped by category and invites your feedback.
  _Ruled OK 2026-10-01._
- **`lpn_sysflow_consumed`**
  > Consumed
  _Ruled OK 2026-10-03._
- **`lpn_sysflow_consumed_tip`**
  > Total of every positive demand: water drawn from the network at junctions, and any flow into a reservoir.
  _Ruled OK 2026-10-03._
- **`lpn_sysflow_menu`**
  > Flow balance
  _Ruled OK 2026-10-03._
- **`lpn_sysflow_produced`**
  > Produced
  _Ruled OK 2026-10-03._
- **`lpn_sysflow_produced_tip`**
  > Total flow into the network from reservoirs and from negative demands.
  _Ruled OK 2026-10-03._
- **`lpn_sysflow_tip`**
  > Graph the total flow produced and the total flow consumed against time, across the extended period simulation. Tanks are in neither total, so where the two lines part, the tanks are filling or draining.
  _Ruled OK 2026-10-03._
- **`lpn_sysflow_title`**
  > Flow balance
  _Ruled OK 2026-10-03._

---

# Strings waiting on a branch

**6 still to read**, of 18 new keys across 13 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### chore/analyze-clock-spec (`329c1278`) — adds no English strings

### chore/wave0-1003b (`85644f61`) — adds no English strings

### feat/desktop (`baba0f04`) — adds no English strings

### feat/dialog-audit (`3b6989bd`) — adds no English strings

### feat/dock (`30d36ba9`) — adds no English strings

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

### feat/profile-file (`a095faf4`) — 4 new, all ruled

- **`lpn_profile_file_done`**
  > Profile read from the file: {used} of {total} nodes found in this network.
  _Ruled OK 2026-10-03._
- **`lpn_profile_file_missing`**
  > Named in the file but not in this network: {ids}.
  _Ruled OK 2026-10-03._
- **`lpn_profile_file_short`**
  > The file names fewer than two nodes in this network, so there is no profile to draw.
  _Ruled OK 2026-10-03._
- **`lpn_profile_open`**
  > Open EPANET profile file…
  _Ruled OK 2026-10-03._

### feat/property-graph (`3c987393`) — 5 new, all ruled

- **`lpn_pgraph_none`**
  > This asset has no results in the current run.
  _Ruled OK 2026-10-01._
- **`lpn_pgraph_source_share_from`**
  > Source share from {node}
  _Ruled OK 2026-10-01._
- **`lpn_report_pump_head`**
  > Pump head
  _Ruled OK 2026-10-03._
- **`lpn_result_pump_head`**
  > Head
  _Ruled OK 2026-10-03._
- **`lpn_result_pump_head_tip`**
  > The head the pump adds from suction to discharge, shown as a positive number. The solver and EPANET files carry it as a negative head loss.
  _Ruled OK 2026-10-03._

### feat/table-selection (`d2276943`) — 6 new, 6 to read @@ NEEDS RULING

- **`lpn_pane_filter_sel_and`**
  > Filtered by {q} and selection only. Showing {n} of {all}.
  @@ NEEDS RULING
- **`lpn_pane_filter_sel_none`**
  > None of the selected elements are in this table.
  @@ NEEDS RULING
- **`lpn_pane_filter_sel_note`**
  > Selection only. Showing {n} of {all}.
  @@ NEEDS RULING
- **`lpn_pane_sel_only`**
  > Selection only
  @@ NEEDS RULING
- **`lpn_pane_sel_only_none`**
  > No elements are selected. Select elements on the map, then press Selection only.
  @@ NEEDS RULING
- **`lpn_pane_sel_only_tip`**
  > Show only the elements selected on the map, in every table. Press again to update it after changing the selection, or to turn it off.
  @@ NEEDS RULING
