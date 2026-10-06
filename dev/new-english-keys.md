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

**40 still to read on master**, of 150 untranslated keys, of 2376 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
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
  > ⚠ At least one junction is below {pressure} with no demand scaling. The largest demand scale that keeps every junction at {pressure} or above is {m}.
  *The finding:* Tom: 'I think I need explanation, and this need clarification.' It appears after Find when the demands as entered (a demand scale of 1) leave at least one junction below the limit; {m} is the largest scale, always under 1, at which every judged junction keeps the limit (0.62 means demands cut to 62 percent). 'it' in 'keeps it' is vague, 'demands as they are' never says scale 1, and {m} reads as headroom when it is a cut.
  1. the system can take up to {m} times today's demand (wrong)
  2. demands must be cut to {m} times what is entered for every junction to keep the pressure (right)
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED A: '⚠ At least one junction is below {pressure} at the demands as entered (a demand scale of 1). All junctions keep {pressure} only if demands are cut to a demand scale of {m} or less.' PROPOSED B: '⚠ The demands as entered (a demand scale of 1) leave at least one junction below {pressure}. The largest demand scale that keeps every junction at {pressure} or above is {m}.' B paralle...
  @@ NEEDS RULING

## Synonym entries to approve  (3, 1 to read @@ NEEDS RULING)

**These are translator notes (`$ec_lang_syn`), not visitor wording.** Each was written against an
English string that has since changed, or against a key that no longer exists. Say which: keep it
as is, change it (a proposal may follow), or remove it. **Your answer on the flag line is the
written permission** the rule requires; CC then applies it by hand and re-records it. A script
never edits a synonym.

- **`ip_is_lateral`**
  > <span class="ec-help" title="Selected: this reach is a segment of the test lateral, from which individual emitters withdraw water. Cleared: this reach is a main, only passing flow along to laterals not on the test path.">Lat. <span class="ec-tip">?</span></span>
  *Why stale:* the English changed after this synonym was written
  *Written against:* <span class="ec-help" title="Checked: this reach is a segment of the test lateral, from which individual emitters withdraw water. Unchecked: this reach is a main, only passing flow along to laterals not on the test path.">Lat. <span class="ec-tip">?</span></span>
  *Current synonym:* | gloss: lateral, mainline; avoid: "test" read as typical/sample
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  _Ruled 2026-10-05: What's wrong with the way it is? I am confused on this on about what's happening and why a _syn is needed._

- **`lpn_ff_selected`**
  > Selected junctions
  *Why stale:* the English changed after this synonym was written
  *Written against:* Selected
  *Current synonym:* Selected junctions | a pull-down option under Junctions to test; agrees with junctions, plural
  *Proposed synonym:* Only the selected junctions, The junctions selected on the map | a pull-down option under Junctions to test; agrees with junctions, plural
  *Why this proposal:* Each could stand in the pull-down row; the old text only repeated the English.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_labels_priority_node_tip`**
  > The order in which values are dropped when a label does not fit. The value numbered 1 is dropped first. When only one value is left and two labels still overlap, one of them is hidden: the one with the lower demand, with pressure nearer the middle of the range, or with elevation or head more like its neighboring nodes.
  *Why stale:* the English changed after this synonym was written
  *Written against:* The order in which values are dropped when two node labels would overlap. The value numbered 1 is dropped first. When only one value is left and the labels still overlap, one whole label is hidden: the one with the lower demand, the pressure nearer the middle of the range, or the elevation or head more like neighboring nodes.
  *Current synonym:* more like neighboring nodes = numerically closer to the neighbors' values | avoid: similar in kind
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  _Ruled 2026-10-05: Is this _syn needed?_

## lpn_  (150, 40 to read @@ NEEDS RULING)

- **`lpn_alt_calc_options`**
  > Calculation options
  _Ruled OK 2026-10-05._
- **`lpn_analyze_at_time`**
  > Time step: {time}.
  _Ruled OK 2026-10-03._
- **`lpn_analyze_time_moved`**
  > ⚠ This was computed at {time}, and the clock is now at {now}. Run it again for the time step on screen.
  _Ruled OK 2026-10-03._
- **`lpn_basemap_style_faded`**
  > Faded
  _Ruled OK 2026-10-05._
- **`lpn_basemap_style_grayscale`**
  > Grayscale
  _Ruled OK 2026-10-05._
- **`lpn_basemap_style_muted`**
  > Muted
  _Ruled OK 2026-10-05._
- **`lpn_basemap_style_normal`**
  > Normal
  _Ruled OK 2026-10-05._
- **`lpn_change_type_born`**
  > These are new, as on a newly drawn one:
  @@ NEEDS RULING
- **`lpn_change_type_customers`**
  > Only a pipe serves customers, so these customers are connected instead to the node shown in parentheses, where their demand already lands. They stay where they are drawn, and their demand is unchanged:
  @@ NEEDS RULING
- **`lpn_change_type_key`**
  > ID: Lost entry
  @@ NEEDS RULING
- **`lpn_change_type_line`**
  > {id}: {property} {value}
  @@ NEEDS RULING
- **`lpn_change_type_line_scenario`**
  > {id}: {property} {value}, in scenario {scenario}
  @@ NEEDS RULING
- **`lpn_change_type_lost`**
  > These values will be lost:
  @@ NEEDS RULING
- **`lpn_change_type_meaning`**
  > These controls and rules test a node being changed, and will read it differently: a junction is tested by its pressure, and a tank or reservoir by its water level.
  @@ NEEDS RULING
- **`lpn_change_type_menu`**
  > Change type
  @@ NEEDS RULING
- **`lpn_change_type_more`**
  > And {n} more.
  @@ NEEDS RULING
- **`lpn_change_type_no_curve`**
  > {id}: No pump head curve, so the pump adds no head until one is selected
  @@ NEEDS RULING
- **`lpn_change_type_ok`**
  > Change
  @@ NEEDS RULING
- **`lpn_change_type_rules`**
  > These rule lines name a link by its kind, and will name its new kind instead:
  @@ NEEDS RULING
- **`lpn_change_type_setting`**
  > These controls and rules give or test the setting of a link being changed. A setting is a different quantity on a pipe, a pump, and a valve, so these will read it differently:
  @@ NEEDS RULING
- **`lpn_change_type_surface`**
  > These keep the water surface where it was. A reservoir's head is the tank's elevation plus its water depth, and a tank's water depth is the reservoir's head minus its elevation:
  @@ NEEDS RULING
- **`lpn_change_type_tip`**
  > Change the selected nodes into junctions, reservoirs, or tanks, or the selected links into pipes, pumps, or valves. Each keeps its ID, its place, its connections, and every value the new type also has. If anything would be lost, you are asked first.
  @@ NEEDS RULING
- **`lpn_choice_default`**
  > Default
  _Ruled OK 2026-10-05._
- **`lpn_contour_show`**
  > Show contours
  _Ruled OK 2026-10-05._
- **`lpn_contour_show_tip`**
  > Clear to hide the fill and the contour lines; select to bring them back as they were. Node colors stay.
  _Ruled OK 2026-10-05._
- **`lpn_copy_opened_unsaved`**
  > Opened {file} as a copy, with a new lock of its own that will be saved with the next file save.
  @@ NEEDS RULING
- **`lpn_cp_allow_tip`**
  > Allow only these characters:
  _Ruled OK 2026-10-05._
- **`lpn_cp_characters_tip`**
  > "@" means any letter; "#" means any numeric digit, and you must separately list "-", ".", and "," if they are allowed; and any white space characters must be between other characters.
  _Ruled OK 2026-10-05._
- **`lpn_diag_pda_needs_epanet`**
  > The demand model is pressure driven, and only the EPANET solver can compute it. The EPANET solver could not be loaded, so these results are missing.
  _Ruled OK 2026-10-05._
- **`lpn_diag_pda_pressures`**
  > Required pressure must be greater than Minimum pressure. Change one of them in Settings.
  _Ruled OK 2026-10-05._
- **`lpn_dock_autohide`**
  > Auto-hide
  _Ruled OK 2026-10-05._
- **`lpn_dock_float`**
  > Float
  _Ruled OK 2026-10-05._
- **`lpn_dock_left`**
  > Dock at the left of the map
  _Ruled OK 2026-10-05._
- **`lpn_dock_right`**
  > Dock at the right of the map
  _Ruled OK 2026-10-05._
- **`lpn_ds_bad_multiplier`**
  > Enter a demand scale of zero or more, such as 1.5.
  _Ruled OK 2026-10-05._
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
  > Only the time step now on screen is scaled; levels and statuses are taken from this step. To test the peak, move the clock to the peak demand before you run.
  _Ruled OK 2026-10-05._
- **`lpn_ds_found`**
  > ✓ Every junction checked keeps at least {pressure} up to a demand scale of {m}.
  _Ruled 2026-10-05: Proposal approved._
- **`lpn_ds_found_below`**
  > ⚠ At least one junction is below {pressure} with no demand scaling. The largest demand scale that keeps every junction at {pressure} or above is {m}.
  _Ruled 2026-10-06: His own wording: "Use this."_
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
  > Finds the largest demand scale, to the nearest {step}, at which all these junctions keep at least the lowest pressure allowed. It searches from 0 to {max}.
  _Ruled 2026-10-05: Edited proposal._
- **`lpn_ds_search_stopped`**
  > The search was stopped before it found an answer.
  _Ruled 2026-10-03: OK. Are we sure this isn't already provided by a different key?_
- **`lpn_ds_skipped`**
  > Selected elements that are not junctions, left as they are: {n}.
  _Ruled OK 2026-10-03._
- **`lpn_ds_stale`**
  > The drawing changed, so the demand scaling results were cleared. Run it again.
  _Ruled OK 2026-10-03._
- **`lpn_ds_title`**
  > Demand scaling
  _Ruled OK 2026-10-03._
- **`lpn_engine_failed_why`**
  > {reason} Showing the built-in solver instead.
  @@ NEEDS RULING
- **`lpn_engine_needed_failed_why`**
  > This network can only be solved by the EPANET solver. {reason}
  @@ NEEDS RULING
- **`lpn_engine_pda_route`**
  > Solved with the EPANET solver, because the demand model is pressure driven.
  _Ruled OK 2026-10-05._
- **`lpn_engine_unavailable_why`**
  > Valves that open and close on their own cannot be solved without the EPANET solver. {reason}
  @@ NEEDS RULING
- **`lpn_find_scope_source`**
  > Source
  @@ NEEDS RULING
- **`lpn_find_source_no_chemical`**
  > No chemical is being tracked, so no node has a source.
  @@ NEEDS RULING
- **`lpn_inp_drop_pressure_unit`**
  > This file states a pressure unit other than the one this page reads for its flow unit, which is psi for US units and meters otherwise. Every pressure in the file is read that way, so check the valve settings, emitters, and pressure driven limits it holds. The line is kept and is written back.
  _Ruled OK 2026-10-05._
- **`lpn_mode_add_chain`**
  > Mode: Junction Pipe Chain. Specify a point on the map to add a junction, then specify each next point to add a pipe and a junction. Specify an existing node to continue from it. Press Escape to end the chain. Switch to Select mode to change or move assets and labels.
  _Ruled OK 2026-10-05._
- **`lpn_pane_clear_override`**
  > Clear override
  @@ NEEDS RULING
- **`lpn_pane_delete_element`**
  > Delete element
  @@ NEEDS RULING
- **`lpn_pane_delete_elements`**
  > Delete elements
  @@ NEEDS RULING
- **`lpn_pane_filter_sel_and`**
  > Filtered by {q} and selection only. Showing {n} of {all}.
  _Ruled OK 2026-10-05._
- **`lpn_pane_filter_sel_none`**
  > None of the selected elements are in this table.
  _Ruled OK 2026-10-05._
- **`lpn_pane_filter_sel_note`**
  > Selection only. Showing {n} of {all}.
  _Ruled OK 2026-10-05._
- **`lpn_pane_manage_cols_width`**
  > Width (em)
  _Ruled OK 2026-10-05._
- **`lpn_pane_scn_alt_tip`**
  > {category} alt.: {alternative}
  @@ NEEDS RULING
- **`lpn_pane_scn_show`**
  > Show scenarios
  @@ NEEDS RULING
- **`lpn_pane_sel_only`**
  > Selection only
  _Ruled OK 2026-10-05._
- **`lpn_pane_sel_only_none`**
  > No elements are selected. Select elements on the map first.
  _Ruled OK 2026-10-05._
- **`lpn_pane_sort_desc`**
  > Sort descending
  _Ruled OK 2026-09-26._
- **`lpn_pane_width_tip`**
  > Column widths are saved in this browser, not in the project. Double-click a column divider to restore the default width.
  _Ruled OK 2026-10-05._
- **`lpn_pda_deficit_note`**
  > Junctions receiving less than their demand: {n}.
  _Ruled OK 2026-10-05._
- **`lpn_pgraph_none`**
  > This asset has no results in the current run.
  _Ruled OK 2026-10-01._
- **`lpn_pgraph_source_share_from`**
  > Source share from {node}
  _Ruled OK 2026-10-01._
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
- **`lpn_report_pump_head`**
  > Pump head
  _Ruled OK 2026-10-03._
- **`lpn_result_delivered_demand`**
  > Delivered demand
  _Ruled OK 2026-10-05._
- **`lpn_result_delivered_demand_tip`**
  > The flow this junction actually receives under the pressure driven demand model. It is less than the demand when the pressure is below the required pressure.
  _Ruled OK 2026-10-05._
- **`lpn_result_demand_deficit`**
  > Demand deficit
  _Ruled OK 2026-10-05._
- **`lpn_result_demand_deficit_tip`**
  > The demand this junction asks for and does not receive, because the pressure is below the required pressure.
  _Ruled OK 2026-10-05._
- **`lpn_result_pump_head`**
  > Head
  _Ruled OK 2026-10-03._
- **`lpn_result_pump_head_tip`**
  > The head the pump adds from suction to discharge, shown as a positive number. The solver and EPANET files carry it as a negative head loss.
  _Ruled OK 2026-10-03._
- **`lpn_saved_browser`**
  > Saved in this browser
  _Ruled OK 2026-10-05._
- **`lpn_saved_project`**
  > Saved with the project
  _Ruled OK 2026-10-05._
- **`lpn_saved_session`**
  > Not saved
  _Ruled OK 2026-10-05._
- **`lpn_scenario_duration_tip`**
  > Leave blank to inherit from parent. A total run time of 0:00 is a steady-state run.
  _Ruled OK 2026-10-05._
- **`lpn_scenario_hyd_step_tip`**
  > Leave blank to inherit from parent.
  _Ruled OK 2026-10-05._
- **`lpn_scncmp_at_time`**
  > {value} at {id}, {time}
  _Ruled OK 2026-10-05._
- **`lpn_scncmp_period_note`**
  > Where a scenario has a total run time, its lowest pressure and highest velocity are the extremes of the whole network, at the time shown.
  _Ruled OK 2026-10-05._
- **`lpn_scncmp_same`**
  > The same in every scenario
  _Ruled OK 2026-10-05._
- **`lpn_settings_basemap_style`**
  > Basemap style
  _Ruled OK 2026-10-05._
- **`lpn_settings_demand_model`**
  > Demand model
  _Ruled OK 2026-10-05._
- **`lpn_settings_demand_model_dda`**
  > Demand driven
  _Ruled OK 2026-10-05._
- **`lpn_settings_demand_model_pda`**
  > Pressure driven
  _Ruled OK 2026-10-05._
- **`lpn_settings_demand_model_tip`**
  > Choose how junctions receive flow. Demand driven (DDA) delivers every demand in full, whatever the pressure. Pressure driven (PDA) delivers less than the demand where the pressure is below the required pressure, and only the EPANET solver computes it.
  _Ruled OK 2026-10-05._
- **`lpn_settings_min_pressure`**
  > Minimum pressure
  _Ruled OK 2026-10-05._
- **`lpn_settings_min_pressure_tip`**
  > Enter the pressure at or below which a junction receives no flow. Use this project's pressure unit.
  _Ruled 2026-10-05: Edited. Water would have been embarrassing. Why is your team persisting in inventing colloquialisms instead of sticking to technical terms? This app should not sound like a lay person. Sound like a civil enginer._
- **`lpn_settings_pressure_exponent`**
  > Pressure exponent
  _Ruled OK 2026-10-05._
- **`lpn_settings_pressure_exponent_tip`**
  > Enter the exponent of the curve that rises from no flow at the minimum pressure to the full demand at the required pressure.
  _Ruled OK 2026-10-05._
- **`lpn_settings_req_pressure`**
  > Required pressure
  _Ruled OK 2026-10-05._
- **`lpn_settings_req_pressure_tip`**
  > Enter the pressure at or above which a junction receives its full demand. It must be greater than the minimum pressure. Use this project's pressure unit. Leave it blank to use EPANET's default, which is in psi for US flow units and meters otherwise.
  _Ruled OK 2026-10-05._
- **`lpn_sysflow_title`**
  > Flow balance
  _Ruled OK 2026-10-03._
- **`lpn_time_engine_fetch_failed`**
  > The download of the EPANET solver failed. Reload the page to try again; a firewall, proxy, or browser extension may be blocking it.
  @@ NEEDS RULING
- **`lpn_time_engine_run_failed`**
  > The EPANET run failed. That is a defect in this page; use the {wrong} link to report it.
  @@ NEEDS RULING
- **`lpn_time_engine_start_failed`**
  > The browser refused to start the EPANET solver. WebAssembly may be turned off by a security setting or an extension.
  @@ NEEDS RULING
- **`lpn_time_no_engine_why`**
  > The built-in solver calculates one moment at a time, so this is the network at {time} only: every pattern is read at that moment, and every tank still sits at its starting level instead of filling and draining. {reason}
  @@ NEEDS RULING
- **`lpn_time_scn_overrides`**
  > Scenario overrides:
  _Ruled OK 2026-10-05._
- **`lpn_time_stat_averaged`**
  > Avg
  @@ NEEDS RULING
- **`lpn_time_stat_maximum`**
  > Max
  @@ NEEDS RULING
- **`lpn_time_stat_minimum`**
  > Min
  @@ NEEDS RULING
- **`lpn_time_stat_none`**
  > None
  _Ruled OK 2026-10-05._
- **`lpn_time_stat_range`**
  > Range
  _Ruled OK 2026-10-05._
- **`lpn_time_statistic`**
  > Statistic
  _Ruled OK 2026-10-05._
- **`lpn_tool_add_chain`**
  > Junction Pipe Chain
  _Ruled OK 2026-10-05._
- **`lpn_tool_add_chain_tip`**
  > Chain junctions and pipes: specify a point on the map to add a junction, then specify each next point to add a pipe and a junction. Specify an existing node to continue from it. Press Escape to end the chain.
  _Ruled OK 2026-10-05._
- **`lpn_valwarn_diameter`**
  > A pipe or valve diameter is normally between {min} and {max} {unit}. Check the number and the diameter unit.
  @@ NEEDS RULING
- **`lpn_valwarn_dw`**
  > A Darcy-Weisbach roughness is normally more than 0 and at most {max} {unit}. A larger number is often a Hazen-Williams C or a Manning n.
  @@ NEEDS RULING
- **`lpn_valwarn_hw`**
  > A Hazen-Williams C is normally between {min} and {max}. A number outside that range is often a roughness meant for another friction method.
  @@ NEEDS RULING
- **`lpn_valwarn_manning`**
  > A Manning n is normally between {min} and {max}. A number outside that range is often a roughness meant for another friction method.
  @@ NEEDS RULING
- **`lpn_valwarn_negative`**
  > EPANET refuses a negative number here.
  @@ NEEDS RULING
- **`lpn_valwarn_positive`**
  > EPANET refuses zero or a negative number here.
  @@ NEEDS RULING
- **`lpn_valwarn_tank_levels`**
  > EPANET refuses this tank. The lowest water depth must not exceed the water depth, and the water depth must not exceed the highest water depth.
  @@ NEEDS RULING

---

# Strings waiting on a branch

**62 still to read**, of 65 new keys across 15 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### feat/asset-type (`c49c4b74`) — adds no English strings

### feat/backdrop-attach (`55bb434f`) — 6 new, 6 to read @@ NEEDS RULING

- **`lpn_inp_backdrop_attach`**
  > Attach {file}…
  @@ NEEDS RULING
- **`lpn_inp_backdrop_attach_tip`**
  > A web page cannot open the picture by its name. Choose it on your device and it is placed where the file says it belongs.
  @@ NEEDS RULING
- **`lpn_inp_backdrop_attached`**
  > Attached {file}, placed where the file says it belongs.
  @@ NEEDS RULING
- **`lpn_inp_backdrop_attached_other`**
  > Attached {picked}, placed where the file says it belongs. The file names {file}, which is a different name.
  @@ NEEDS RULING
- **`lpn_status_inp_exported_no_picture`**
  > Exported {file}. The background picture could not be saved, so {file} names none; in EPANET, add it with View > Backdrop > Load.
  @@ NEEDS RULING
- **`lpn_status_inp_exported_picture`**
  > Exported {zip}, holding {file}, its background picture {picture}, and the world file {world}. Extract all three into one folder, then open {file} in EPANET; the picture comes with it.
  @@ NEEDS RULING

### feat/bentley-interop (`fb45a301`) — 9 new, 9 to read @@ NEEDS RULING

- **`lpn_alt_cat_calculation`**
  > Calculation
  @@ NEEDS RULING
- **`lpn_alt_cat_presentation`**
  > Presentation
  @@ NEEDS RULING
- **`lpn_scenario_delete_has_children`**
  > The scenario {name} cannot be deleted while other scenarios inherit from it: {list}. Delete those first, or give them another parent.
  @@ NEEDS RULING
- **`lpn_settings_table_category`**
  > Category
  @@ NEEDS RULING
- **`lpn_settings_table_major`**
  > Major heading
  @@ NEEDS RULING
- **`lpn_settings_table_minor`**
  > Minor heading
  @@ NEEDS RULING
- **`lpn_settings_table_no`**
  > No
  @@ NEEDS RULING
- **`lpn_settings_table_setting`**
  > Setting
  @@ NEEDS RULING
- **`lpn_settings_table_yes`**
  > Yes
  @@ NEEDS RULING

### feat/desktop (`baba0f04`) — adds no English strings

### feat/feedback (`ce8819b0`) — 13 new, 13 to read @@ NEEDS RULING

- **`lpn_fb_bad_email`**
  > That email address does not look right. Correct it, or leave it empty.
  @@ NEEDS RULING
- **`lpn_fb_busy`**
  > Too many messages have arrived in the last few minutes. What you wrote is still here, so you can try again later.
  @@ NEEDS RULING
- **`lpn_fb_comment`**
  > Comments (optional)
  @@ NEEDS RULING
- **`lpn_fb_email`**
  > Email (optional, only if you want a reply)
  @@ NEEDS RULING
- **`lpn_fb_failed`**
  > That did not reach us. What you wrote is still here, so you can try again.
  @@ NEEDS RULING
- **`lpn_fb_intro`**
  > Pick any that fit, or none, and add whatever you like. Nothing is sent until you press Send.
  @@ NEEDS RULING
- **`lpn_fb_pick_broken`**
  > Something did not work
  @@ NEEDS RULING
- **`lpn_fb_pick_confusing`**
  > This is confusing
  @@ NEEDS RULING
- **`lpn_fb_pick_numbers`**
  > The numbers look wrong
  @@ NEEDS RULING
- **`lpn_fb_pick_wording`**
  > The wording or translation is wrong
  @@ NEEDS RULING
- **`lpn_fb_send`**
  > Send
  @@ NEEDS RULING
- **`lpn_fb_sending`**
  > Sending…
  @@ NEEDS RULING
- **`lpn_fb_sends`**
  > What this sends: the name of this page, your language, the version of the site, the code of the message on the map if there is one, and what you picked or typed. Never your drawing or your network. Your email address is used only to reply to you.
  @@ NEEDS RULING

### feat/geojson (`6bd2f64a`) — 7 new, 7 to read @@ NEEDS RULING

- **`lpn_file_export_geojson`**
  > Export GeoJSON file…
  @@ NEEDS RULING
- **`lpn_file_export_geojson_tip`**
  > Download this network as a GeoJSON file for QGIS, ArcGIS Pro and other GIS programs. Junctions, tanks and reservoirs are points, and pipes, pumps and valves are lines that follow their vertices. Positions are longitude and latitude. Results are included only when the network has been solved.
  @@ NEEDS RULING
- **`lpn_geojson_refused_empty`**
  > There is nothing to export yet. Draw or open a network first.
  @@ NEEDS RULING
- **`lpn_geojson_refused_local`**
  > A GeoJSON file holds longitude and latitude only, and this project is drawn on a local grid with no place on the Earth. Georeference it first with Map, World map, Attach, then export again.
  @@ NEEDS RULING
- **`lpn_geojson_refused_range`**
  > These positions are not valid longitudes and latitudes: {detail}
  @@ NEEDS RULING
- **`lpn_geojson_results_in`**
  > The results on screen are included.
  @@ NEEDS RULING
- **`lpn_geojson_results_out`**
  > No results are included, because the network is not solved.
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

### feat/label-placer (`0885e755`) — adds no English strings

### feat/label-placer-a (`3483bfd6`) — adds no English strings

### feat/label-placer-b (`c5905432`) — adds no English strings

### feat/label-placer-c (`9a790a3e`) — adds no English strings

### feat/label-placer-d (`129b63c4`) — adds no English strings

### feat/screenshot (`8a583e22`) — 9 new, 9 to read @@ NEEDS RULING

- **`lpn_screenshot_copied`**
  > Screenshot copied.
  @@ NEEDS RULING
- **`lpn_screenshot_failed`**
  > The screenshot could not be made.
  @@ NEEDS RULING
- **`lpn_screenshot_hint`**
  > Drag a rectangle over the map, or click for the whole map. Esc cancels.
  @@ NEEDS RULING
- **`lpn_screenshot_menu`**
  > Screenshot
  @@ NEEDS RULING
- **`lpn_screenshot_no_basemap`**
  > The street map or satellite image could not be included.
  @@ NEEDS RULING
- **`lpn_screenshot_saved`**
  > The clipboard is not available here, so the screenshot was downloaded as a PNG file.
  @@ NEEDS RULING
- **`lpn_screenshot_scale`**
  > Magnification
  @@ NEEDS RULING
- **`lpn_screenshot_scale_tip`**
  > The picture's size as a multiple of the area on the screen. A larger one is sharper and makes a bigger file.
  @@ NEEDS RULING
- **`lpn_screenshot_tip`**
  > Copy a sharper-than-screen picture of the map area you drag, ready to paste into a report. Click without dragging to take the whole map.
  @@ NEEDS RULING

### feat/survey-code (`26ca3c1c`) — 18 new, 18 to read @@ NEEDS RULING

- **`lpn_survey_codes_add`**
  > Add code
  @@ NEEDS RULING
- **`lpn_survey_codes_col_code`**
  > Code
  @@ NEEDS RULING
- **`lpn_survey_codes_col_type`**
  > Asset type
  @@ NEEDS RULING
- **`lpn_survey_codes_remove`**
  > Remove code
  @@ NEEDS RULING
- **`lpn_survey_codes_tip`**
  > Read the first word of each description as a code from the table. Points with the same line code join into one pipe in file order, and WL1 and WL2 are separate lines. +0 starts a line, -0 ends one, and CLO closes one. JPN followed by a point name joins to that point (Carlson), and Civil 3D writes it CPN.
  @@ NEEDS RULING
- **`lpn_survey_codes_toggle`**
  > Read the description as field codes
  @@ NEEDS RULING
- **`lpn_survey_confirm_coded`**
  > {j} junction(s), {r} reservoir(s), {t} tank(s), and {p} pipe(s) found. Proceed?
  @@ NEEDS RULING
- **`lpn_survey_note_code_two_nodes`**
  > More than one node code, the first was used.
  @@ NEEDS RULING
- **`lpn_survey_note_code_unknown`**
  > Code not in the code table, imported as the asset type chosen above.
  @@ NEEDS RULING
- **`lpn_survey_note_code_unread`**
  > Not every word is a code this page reads, kept in the description.
  @@ NEEDS RULING
- **`lpn_survey_note_join_missing`**
  > JPN or CPN names a point not in this file or project, no pipe drawn for it.
  @@ NEEDS RULING
- **`lpn_survey_note_join_no_line`**
  > JPN or CPN on a point with no line code, no pipe drawn for it.
  @@ NEEDS RULING
- **`lpn_survey_note_line_one_point`**
  > Only point on its line, no pipe drawn from it.
  @@ NEEDS RULING
- **`lpn_survey_note_no_desc`**
  > Field codes are on, but this file has no description column, so no codes were read.
  @@ NEEDS RULING
- **`lpn_survey_note_pipe_one_node`**
  > This line returns to the same node with no other node between, no pipe drawn for it.
  @@ NEEDS RULING
- **`lpn_survey_note_vertex_text`**
  > Not every word is a code this page reads, and a vertex keeps no description.
  @@ NEEDS RULING
- **`lpn_survey_note_vertices`**
  > Points that became pipe vertices: {detail}. A vertex keeps no name, elevation, or description.
  @@ NEEDS RULING
- **`lpn_survey_report_coded`**
  > {j} junction(s), {r} reservoir(s), {t} tank(s), and {p} pipe(s) imported, {m} of the nodes with elevation.
  @@ NEEDS RULING

### feat/tip-door (`4df634f8`) — adds no English strings
