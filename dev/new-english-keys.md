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

**16 still to read**, of 206 untranslated keys, of 1521 English keys. A key already marked _Ruled OK_ below needs nothing from you —
the ruling lapses by itself if the wording changes.

## lpn_  (204)

- **`lpn_demand_add`**
  > Add demand category
  _Ruled OK 2026-08-29._
- **`lpn_demand_add_tip`**
  > Add another demand at this junction, with its own base demand, pattern and description. The demands add up.
  _Ruled OK 2026-08-29._
- **`lpn_demand_remove`**
  > Remove this demand
  _Ruled OK 2026-08-29._
- **`lpn_elev_dem_none`**
  > The DEM gave no height for this node.
  _Ruled OK 2026-09-01._
- **`lpn_elev_dem_said`**
  > Mapbox DEM says {v} {u}.
  _Ruled OK 2026-09-01._
- **`lpn_elev_dem_sample`**
  > Sample DEM
  _Ruled OK 2026-09-01._
- **`lpn_elev_dem_sample_tip`**
  > Reads the elevation of the DEM at this node and shows it below for review before changing the current entry. The horizontal DEM resolution is about 30 m for most of the Earth, and finer where better data exists.
  _Ruled OK 2026-09-01._
- **`lpn_elev_dem_use`**
  > Use DEM
  _Ruled OK 2026-09-01._
- **`lpn_elev_dem_use_tip`**
  > Puts the elevation of the DEM at this node into the Elevation box above, replacing what is there. It reads the DEM first if it has not been read yet. One Undo puts it back.
- **`lpn_ff_accounting`**
  > Fire flow is drawn at the junction itself. That is the method used here, and it is the usual one. The hydrant, its lateral, and its nozzle are not modelled, so a real hydrant delivers less than the flow shown here.
  _Ruled OK 2026-09-01._
- **`lpn_ff_affect_link`**
  > {id} at {velocity}
  _Ruled OK 2026-09-01._
- **`lpn_ff_affect_node`**
  > {id} down to {pressure}
  _Ruled OK 2026-09-01._
- **`lpn_ff_atleast`**
  > over {flow}
  _Ruled OK 2026-09-01._
- **`lpn_ff_calculate`**
  > Run
  _Ruled OK 2026-09-01._
- **`lpn_ff_col_affected`**
  > Drawdowns
  _Ruled OK 2026-09-01._
- **`lpn_ff_col_atrequired`**
  > Pressure at required
  _Ruled OK 2026-09-01._
- **`lpn_ff_col_available`**
  > Available flow
  _Ruled OK 2026-09-01._
- **`lpn_ff_col_junction`**
  > Junction
- **`lpn_ff_col_limit`**
  > Design limit
- **`lpn_ff_col_required`**
  > Required flow
  _Ruled OK 2026-09-01._
- **`lpn_ff_col_residual`**
  > Residual held
  _Ruled OK 2026-09-01._
- **`lpn_ff_col_result`**
  > Result
- **`lpn_ff_col_solves`**
  > Runs
- **`lpn_ff_col_static`**
  > Static pressure
- **`lpn_ff_cost`**
  > {solves} network runs.
- **`lpn_ff_design`**
  > Effect on the rest of the system
  _Ruled OK 2026-09-01._
- **`lpn_ff_design_all`**
  > Every other junction and every pipe
  _Ruled OK 2026-09-01._
- **`lpn_ff_design_nodes`**
  > Every other junction
  _Ruled OK 2026-09-01._
- **`lpn_ff_design_none`**
  > Nothing in the chosen set was drawn down by any junction tested.
  _Ruled OK 2026-09-01._
- **`lpn_ff_design_off`**
  > Do not check
  _Ruled OK 2026-09-01._
- **`lpn_ff_design_off_note`**
  > The effect on the rest of the system was not checked in this run.
  _Ruled OK 2026-09-01._
- **`lpn_ff_design_tip`**
  > A separate question from whether the junction can deliver the flow: with that flow drawn there, does anything else fall below its minimum pressure or run too fast? Choosing to check it costs no extra calculation.
  _Ruled OK 2026-09-01._
- **`lpn_ff_engine_cost`**
  > Available fire flow is a search, so the whole network is solved about sixteen times for every junction tested. A large system takes minutes. You can stop it at any time and keep what it has already worked out.
  _Ruled OK 2026-09-01._
- **`lpn_ff_engine_epanet`**
  > This is worked out with the EPANET engine.
  _Ruled OK 2026-09-01._
- **`lpn_ff_engine_native`**
  > This is worked out with the built-in solver.
  _Ruled OK 2026-09-01._
- **`lpn_ff_err_at_rest`**
  > Already below the residual with nothing drawn
  _Ruled OK 2026-09-01._
- **`lpn_ff_err_converge`**
  > The network did not converge.
  _Ruled OK 2026-09-01._
- **`lpn_ff_err_not_junction`**
  > Not a junction
  _Ruled OK 2026-09-01._
- **`lpn_ff_err_solve`**
  > The solver reported an error and gave no answer.
- **`lpn_ff_err_unknown`**
  > No answer, and the reason given is {id}
  _Ruled OK 2026-09-01._
- **`lpn_ff_intro`**
  > Each junction in turn is asked to draw a fire flow on top of the demand it already has. Nothing in your project is changed; the whole run is made on a copy.
  _Ruled OK 2026-09-01._
- **`lpn_ff_iso`**
  > ISO credits a single hydrant with at most {flow}. That credit limit has not been applied to any number here.
  _Ruled OK 2026-09-01._
- **`lpn_ff_limit_both`**
  > Pressure and velocity
  _Ruled OK 2026-09-01._
- **`lpn_ff_limit_pressure`**
  > Pressure
  _Ruled OK 2026-09-01._
- **`lpn_ff_limit_velocity`**
  > Velocity
  _Ruled OK 2026-09-01._
- **`lpn_ff_maxvelocity`**
  > Highest velocity allowed
  _Ruled OK 2026-09-01._
- **`lpn_ff_maxvelocity_tip`**
  > A pipe running above this while a fire flow is drawn is reported as a design issue.
  _Ruled OK 2026-09-01._
- **`lpn_ff_menu`**
  > Fire flow…
  _Ruled OK 2026-09-01._
- **`lpn_ff_menu_tip`**
  > Test every junction: how much can it deliver while it still holds its residual pressure, and does drawing the required flow there create unacceptable drawdown anywhere else?
  _Ruled OK 2026-09-01._
- **`lpn_ff_minpressure`**
  > Lowest pressure allowed elsewhere
  _Ruled OK 2026-09-01._
- **`lpn_ff_minpressure_tip`**
  > A junction that falls below this while another one is drawing its fire flow is reported as a design issue.
  _Ruled OK 2026-09-01._
- **`lpn_ff_more`**
  > and {n} more
  _Ruled OK 2026-09-01._
- **`lpn_ff_no_junctions`**
  > This project has no junctions yet, so there is nothing to test.
  _Ruled OK 2026-09-01._
- **`lpn_ff_no_selection`**
  > No junction is selected. Choose one on the map, or test every junction.
  _Ruled OK 2026-09-01._
- **`lpn_ff_report_all`**
  > Every junction tested
  _Ruled OK 2026-09-01._
- **`lpn_ff_required`**
  > Required fire flow
  _Ruled OK 2026-09-01._
- **`lpn_ff_required_tip`**
  > The flow required by your code or your fire authority at a hydrant. One junction at a time is tested against this same number.
  _Ruled OK 2026-09-01._
- **`lpn_ff_residual`**
  > Residual pressure to hold
  _Ruled OK 2026-09-01._
- **`lpn_ff_residual_tip`**
  > 20 psi is the AWWA M31 and NFPA 291 convention for available fire flow.
  _Ruled OK 2026-09-01._
- **`lpn_ff_run_title`**
  > Fire flow run
  _Ruled OK 2026-09-01._
- **`lpn_ff_scope`**
  > Junctions to test
  _Ruled OK 2026-09-01._
- **`lpn_ff_scope_all`**
  > Every junction
  _Ruled OK 2026-09-01._
- **`lpn_ff_scope_selected`**
  > The selected junction only
  _Ruled OK 2026-09-01._
- **`lpn_ff_scope_tip`**
  > Choose the set before you run. Testing every junction in a large system can take minutes.
  _Ruled OK 2026-09-01._
- **`lpn_ff_stale`**
  > The drawing changed, so the fire flow results were cleared. Run it again.
  _Ruled OK 2026-09-01._
- **`lpn_ff_state_design`**
  > Design issue
  _Ruled OK 2026-09-01._
- **`lpn_ff_state_error`**
  > No answer
  _Ruled OK 2026-09-01._
- **`lpn_ff_state_fail`**
  > Failing
  _Ruled OK 2026-09-01._
- **`lpn_ff_state_pass`**
  > Passing
  _Ruled OK 2026-09-01._
- **`lpn_ff_steady`**
  > Only the current time step is tested. Fire flow is normally added to maximum day demand.
  _Ruled OK 2026-09-01._
- **`lpn_ff_stop`**
  > Stop
  _Ruled OK 2026-09-01._
- **`lpn_ff_stopped`**
  > Stopped after {done} of {total} junctions. What is below is what had already been worked out.
  _Ruled OK 2026-09-01._
- **`lpn_ff_summary`**
  > {pass} passing, {fail} failing, {design} with a design issue.
  _Ruled OK 2026-09-01._
- **`lpn_ff_summary_error`**
  > {n} could not be answered.
  _Ruled OK 2026-09-01._
- **`lpn_ff_title`**
  > Fire flow
  _Ruled OK 2026-09-01._
- **`lpn_ff_working`**
  > Working: {done} of {total} junctions.
  _Ruled OK 2026-09-01._
- **`lpn_field_base_demand`**
  > Base demand
  _Ruled OK 2026-08-29._
- **`lpn_field_demand_category`**
  > Description
  _Ruled OK 2026-08-29._
- **`lpn_field_demand_category_tip`**
  > Name or description of the category.
  _Ruled OK 2026-08-29._
- **`lpn_field_text_attached`**
  > Attached to
  _Ruled OK 2026-08-29._
- **`lpn_find_conn_no_fixed`**
  > This network has no reservoir or tank, so it has no source to reach. Only "no links" and "no open links" can be searched.
  _Ruled OK 2026-08-29._
- **`lpn_find_conn_nolinksource`**
  > No link path to a source
  _Ruled OK 2026-08-29._
- **`lpn_find_conn_none`**
  > Every node is connected.
  _Ruled OK 2026-08-29._
- **`lpn_find_conn_noopen`**
  > No open links at node
  _Ruled OK 2026-08-29._
- **`lpn_find_conn_noopensource`**
  > No open path to a source
  _Ruled OK 2026-09-01._
- **`lpn_find_conn_unlinked`**
  > No links at node
  _Ruled OK 2026-08-29._
- **`lpn_find_op_conn_nolinksource`**
  > no link path to a source
  _Ruled OK 2026-09-01._
- **`lpn_find_op_conn_noopen`**
  > no open links at node
  _Ruled OK 2026-08-29._
- **`lpn_find_op_conn_noopensource`**
  > no open path to a source
  _Ruled OK 2026-09-01._
- **`lpn_find_op_conn_unlinked`**
  > no links at node
  _Ruled OK 2026-08-29._
- **`lpn_find_prop_connection`**
  > Connection
  _Ruled OK 2026-08-29._
- **`lpn_find_q_and`**
  > AND
  _Ruled OK 2026-08-29._
- **`lpn_find_q_aside`**
  > These controls cannot write the query below, so they are hidden.
  _Ruled OK 2026-09-01._
- **`lpn_find_q_err_close`**
  > This bracket ( was opened and never closed.
  _Ruled OK 2026-08-29._
- **`lpn_find_q_err_dot`**
  > Put a dot between what to search and its property, like Junction.ID
  _Ruled OK 2026-08-29._
- **`lpn_find_q_err_empty`**
  > The query is empty, so nothing will be searched.
  _Ruled OK 2026-08-29._
- **`lpn_find_q_err_end`**
  > Nothing was expected after this. Join two searches with {and} or {or}.
  _Ruled OK 2026-08-29._
- **`lpn_find_q_err_op`**
  > Not a condition for {prop}: {w}. Try one of: {list}
  _Ruled OK 2026-08-29._
- **`lpn_find_q_err_open`**
  > This bracket ) closes nothing.
  _Ruled OK 2026-08-29._
- **`lpn_find_q_err_pos`**
  > (at character {n})
  _Ruled OK 2026-08-29._
- **`lpn_find_q_err_prop`**
  > Not a property of {scope}: {w}. Try one of: {list}
  _Ruled OK 2026-08-29._
- **`lpn_find_q_err_quote`**
  > Put quotes around a text value: {w} is not a number.
  _Ruled OK 2026-08-29._
- **`lpn_find_q_err_quote_end`**
  > This quoted text has no closing quote.
  _Ruled OK 2026-08-29._
- **`lpn_find_q_err_scope`**
  > Not something to search: {w}. Try one of: {list}
  _Ruled OK 2026-08-29._
- **`lpn_find_q_err_value`**
  > This condition needs a value after it: {op}
  _Ruled OK 2026-08-29._
- **`lpn_find_q_or`**
  > OR
  _Ruled OK 2026-08-29._
- **`lpn_find_q_restore`**
  > Use the controls instead
  _Ruled OK 2026-08-29._
- **`lpn_find_query_hint`**
  > Expandable with AND, OR, and ()
  _Ruled OK 2026-08-29._
- **`lpn_find_query_label`**
  > Query
  _Ruled OK 2026-08-29._
- **`lpn_find_query_tip`**
  > The same search, written as one line. Change the controls and it rewrites itself, or type in it and the controls follow.
  _Ruled OK 2026-08-29._
- **`lpn_georef_backdrop_unrotated`**
  > The background image was moved and resized with the model, but it could not be rotated. Use Background image > Move to line it up.
  _Ruled OK 2026-08-29._
- **`lpn_georef_twopt`**
  > Use two known points
  _Ruled OK 2026-08-29._
- **`lpn_georef_twopt_done`**
  > The model now sits on the two points you gave. Check it, then press Keep this placement.
  _Ruled OK 2026-08-29._
- **`lpn_georef_twopt_pick1`**
  > Click a point on your drawing whose latitude and longitude you know.
  _Ruled OK 2026-08-29._
- **`lpn_georef_twopt_pick2`**
  > Now click a second known point, as far from the first one as you can.
  _Ruled OK 2026-08-29._
- **`lpn_georef_twopt_same`**
  > That is the point you picked first. Pick a different one.
  _Ruled OK 2026-08-29._
- **`lpn_georef_twopt_tip`**
  > Place the model exactly, when you already know where two points on your drawing really are. Click one of them, type its latitude and longitude, then do the same for a second point. The place, the size and the turn all follow from those two. Press this button again to stop picking.
  _Ruled OK 2026-08-29._
- **`lpn_inp_drop_energy`**
  > This EPANET file includes pumping cost modelling data. This page does not work out energy or cost, so nothing here uses those numbers. They are kept, and they are written back if you save an EPANET file.
  _Ruled OK 2026-09-01._
- **`lpn_inp_drop_file_options`**
  > This file names another file beside it: Map, which holds coordinates, or Hydraulics, which holds hydraulics already worked out. This page cannot open either, so the lines are kept as they are and written back if you save an EPANET file.
- **`lpn_inp_drop_quality_options`**
  > This file states EPANET water quality options: Quality, which names what to follow through the pipes, and two settings that go with a chemical, Relative diffusivity and Quality tolerance. Water age and trace are worked out here; a chemical is not, so those two settings are kept without being used. All of them are written back if you save an EPANET file.
- **`lpn_inp_drop_report`**
  > This file holds EPANET's own settings for the reports it prints. This page shows its answers in its own way, so nothing here uses them. They are kept, and they are written back if you save an EPANET file.
  _Ruled OK 2026-09-01._
- **`lpn_inp_drop_rules`**
  > This file has rule-based controls. They are not applied here, so the pipes, pumps and valves they name stay at the state written in the file. The rules themselves are kept, and they are written back if you save an EPANET file.
  _Ruled OK 2026-08-29._
- **`lpn_inp_drop_sections`**
  > This file holds a part that this page does not read at all. Nothing here uses it. It is kept whole, and it is written back if you save an EPANET file.
  _Ruled OK 2026-09-01._
- **`lpn_inp_drop_tags`**
  > This file gives tags to some of its junctions, pipes or other assets. There is nowhere on this page to see a tag or change one yet. The tags are kept, and they are written back if you save an EPANET file.
- **`lpn_menu_map`**
  > Map
  _Ruled OK 2026-08-29._
- **`lpn_new_coords`**
  > Coordinates
  _Ruled OK 2026-08-29._
- **`lpn_new_coords_geo`**
  > lat/lon
  _Ruled OK 2026-09-01._
- **`lpn_new_coords_tip`**
  > An xy project is a model on any coordinates other than lat/lon. A lat/lon project has geographic coordinates, so a street map or satellite picture can be drawn behind it and node elevations can be read from the terrain. An xy project can be converted to lat/lon with File > Import xy to lat/lon.
  _Ruled OK 2026-08-29._
- **`lpn_new_coords_xy`**
  > xy grid
  _Ruled OK 2026-08-29._
- **`lpn_new_create`**
  > Create
  _Ruled OK 2026-08-29._
- **`lpn_new_place`**
  > Start near this place
  _Ruled OK 2026-08-29._
- **`lpn_new_place_hint`**
  > Petaluma, California
  _Ruled OK 2026-08-29._
- **`lpn_new_place_tip`**
  > Optional. Type a town, a street or a landmark and the new map opens there. The words you type go to OpenStreetMap's place-name service, which asks your permission the first time. Leave it empty and the map opens on the whole world.
  _Ruled OK 2026-08-29._
- **`lpn_new_title`**
  > New project
  _Ruled OK 2026-08-29._
- **`lpn_profile_delete`**
  > Delete path
  _Ruled OK 2026-08-29._
- **`lpn_profile_delete_confirm`**
  > Delete the saved path {name}? The drawing itself is not changed.
  _Ruled OK 2026-08-29._
- **`lpn_profile_edit`**
  > Edit
  _Ruled OK 2026-08-29._
- **`lpn_profile_edit_click`**
  > Drag any point on the path to move it. Click a point you added to take it off.
  _Ruled OK 2026-08-29._
- **`lpn_profile_edit_nowhere`**
  > A point on the path has to be a node. The path is unchanged.
  _Ruled OK 2026-08-29._
- **`lpn_profile_edit_tap`**
  > Drag any point on the path to move it. Tap a point you added to take it off.
  _Ruled OK 2026-08-29._
- **`lpn_profile_edit_tip`**
  > Change one end of the path, or take one node off it, without drawing the whole path again.
  _Ruled OK 2026-08-29._
- **`lpn_profile_missing`**
  > {name} names nodes that are not in this project: {ids}
  _Ruled OK 2026-08-29._
- **`lpn_profile_new`**
  > New saved path…
  _Ruled OK 2026-08-29._
- **`lpn_profile_new_name`**
  > Path {n}
  _Ruled OK 2026-08-29._
- **`lpn_profile_none_saved`**
  > No saved paths yet
  _Ruled OK 2026-08-29._
- **`lpn_profile_prompt_name`**
  > Name for this path
  _Ruled OK 2026-08-29._
- **`lpn_profile_rename`**
  > Rename path…
  _Ruled OK 2026-08-29._
- **`lpn_profile_saved`**
  > Saved paths
  _Ruled OK 2026-08-29._
- **`lpn_quality_age`**
  > Water age
  _Ruled OK 2026-09-01._
- **`lpn_quality_chemical`**
  > A chemical this file names (kept, not worked out)
  _Ruled OK 2026-09-01._
- **`lpn_quality_needs_run`**
  > Water quality is carried along the pipes over time, so it needs the EPANET engine and a total run time. Set a Total run time under Time, then press Run.
  _Ruled OK 2026-09-01._
- **`lpn_quality_none`**
  > Nothing
  _Ruled OK 2026-09-01._
- **`lpn_quality_trace`**
  > Source trace
- **`lpn_replace_asked`**
  > Asked for {n}. The answer is on its way.
  _Ruled OK 2026-08-29._
- **`lpn_replace_q_bad`**
  > This query cannot be read, so there is nothing to change. Fix it above first.
  _Ruled OK 2026-09-01._
- **`lpn_replace_source`**
  > New value from
  _Ruled OK 2026-08-29._
- **`lpn_result_demand_tip`**
  > The flow this node draws at the time step shown: the total of base demands multiplied by their patterns. Worked out, not typed, so it changes with the clock and cannot be edited.
  _Ruled OK 2026-08-29._
- **`lpn_result_source_share`**
  > Source share
  _Ruled OK 2026-09-01._
- **`lpn_result_source_share_tip`**
  > A source trace reports this share: of the water reaching this point, how much of it came from the trace node.
- **`lpn_result_water_age`**
  > Water age
  _Ruled OK 2026-09-01._
- **`lpn_result_water_age_tip`**
  > How long the water reaching this point has been in the system. There is no standard number to compare it against, so read it as a measurement and judge it yourself.
  _Ruled OK 2026-09-01._
- **`lpn_scenario_mark_tip`**
  > Ringed: this element holds a value that belongs to the scenario {name} alone.
  _Ruled OK 2026-08-29._
- **`lpn_scenario_overrides_tip`**
  > Each of those values is marked on the map with an amber ring. Switch to Base to see the drawing without them.
  _Ruled OK 2026-08-29._
- **`lpn_settings_accuracy`**
  > Accuracy
  _Ruled OK 2026-09-01._
- **`lpn_settings_accuracy_tip`**
  > How close the solver has to get before it stops, measured as the flow still changing from one try to the next. A smaller number is more exact and takes longer. Both solvers read this one box, and each measures that change against a different total: the built-in solver against the sum of the demands, EPANET against the sum of the link flows. Left empty, this page tries far harder than EPANET does on its own.
- **`lpn_settings_damp_limit`**
  > Damping starts at
  _Ruled OK 2026-09-01._
- **`lpn_settings_damp_limit_tip`**
  > The accuracy at which the solver begins taking smaller steps, which can settle a network that is swinging back and forth. Zero, the usual value, means it never does. Only the EPANET solver reads this box.
  _Ruled OK 2026-09-01._
- **`lpn_settings_demand_multiplier`**
  > Demand multiplier
  _Ruled OK 2026-08-29._
- **`lpn_settings_demand_multiplier_tip`**
  > One scale on every demand in the network at once. Use it to ask what the system does at more or less than today's use. It does not change the numbers you typed.
  _Ruled OK 2026-08-29._
- **`lpn_settings_elev_source`**
  > Elevation from
  _Ruled OK 2026-08-29._
- **`lpn_settings_elev_source_dem`**
  > Mapbox DEM
  _Ruled OK 2026-08-29._
- **`lpn_settings_elev_source_tip`**
  > Where a new node gets its elevation. The land surface is read from Mapbox DEM, which is about 30 m across on most of the Earth and finer where better data exists.
  _Ruled OK 2026-08-29._
- **`lpn_settings_elev_source_typed`**
  > The number above
  _Ruled OK 2026-08-29._
- **`lpn_settings_emitter_exponent_tip`**
  > The power in the sprinkler and leak law, flow = coefficient x pressure to this power. It only changes the answer where a node has an emitter, which for now means a network read from an EPANET file.
  _Ruled OK 2026-08-29._
- **`lpn_settings_flow_change`**
  > Flow change limit
- **`lpn_settings_flow_change_tip`**
  > An additional test the solver must pass before it stops: the maximum change in any one pipe's flow from one try to the next. Zero, the usual value, means do not test it. Only the EPANET solver reads this box.
  _Ruled OK 2026-09-01._
- **`lpn_settings_head_error`**
  > Head error limit
  _Ruled OK 2026-09-01._
- **`lpn_settings_head_error_tip`**
  > An additional test the solver must pass before it stops: the largest head any one pipe is still out by. Zero, the usual value, means do not test it. Only the EPANET solver reads this box.
  _Ruled OK 2026-09-01._
- **`lpn_settings_leader_snap`**
  > Snap leader lines to angle
  _Ruled OK 2026-08-29._
- **`lpn_settings_leader_snap_tip`**
  > When you drag a label away from what it names, the line back to it is pulled onto the nearest round angle if you drag close to one. Keep dragging and it lets go, so any angle is still available. Off drags freely, which is what this page has always done.
  _Ruled OK 2026-08-29._
- **`lpn_settings_legend_off`**
  > Off
  _Ruled OK 2026-08-29._
- **`lpn_settings_option_unset`**
  > Not stated
  _Ruled OK 2026-09-01._
- **`lpn_settings_quality`**
  > Water quality
  _Ruled OK 2026-09-01._
- **`lpn_settings_quality_source`**
  > Trace node
- **`lpn_settings_quality_source_tip`**
  > The point whose water is followed. Every other point then shows the share of its water that came from here.
  _Ruled OK 2026-09-01._
- **`lpn_settings_quality_track`**
  > Track
  _Ruled OK 2026-09-01._
- **`lpn_settings_quality_track_tip`**
  > Choose what the run should follow through the pipes: how long the water has been in the system, or where it came from. Neither one asks you for any other number.
  _Ruled OK 2026-09-01._
- **`lpn_settings_specific_gravity`**
  > Specific gravity
  _Ruled OK 2026-08-29._
- **`lpn_settings_specific_gravity_tip`**
  > The weight of the fluid compared with water. It changes the pressures a gauge would read, not the flows.
  _Ruled OK 2026-08-29._
- **`lpn_settings_trials`**
  > Maximum trials
  _Ruled OK 2026-08-29._
- **`lpn_settings_trials_tip`**
  > How many times the solver may try before it gives up on a network that will not settle.
  _Ruled OK 2026-08-29._
- **`lpn_settings_unbalanced`**
  > If it will not settle
  _Ruled OK 2026-09-01._
- **`lpn_settings_unbalanced_continue`**
  > Keep trying
  _Ruled OK 2026-09-01._
- **`lpn_settings_unbalanced_stop`**
  > Stop there
  _Ruled OK 2026-09-01._
- **`lpn_settings_unbalanced_tip`**
  > What to do with a network that has used up its trials and still has not settled. Keeping on allows the extra trials below, which often settles it; stopping reports the last try as it stands, which is close but not solved. Only the EPANET solver reads this box. The built-in solver always stops and marks the answer as unsettled.
  _Ruled OK 2026-09-01._
- **`lpn_settings_unbalanced_trials`**
  > Extra trials first
  _Ruled OK 2026-09-01._
- **`lpn_settings_unbalanced_trials_tip`**
  > How many further trials to allow after the maximum above is used up, before the last try is reported. Only the EPANET solver reads this box.
  _Ruled OK 2026-09-01._
- **`lpn_settings_viscosity`**
  > Relative viscosity
  _Ruled OK 2026-08-29._
- **`lpn_settings_viscosity_tip`**
  > The viscosity of the fluid compared with water at 20 degrees Celsius. It only changes the answer under the Darcy-Weisbach method.
  _Ruled OK 2026-08-29._
- **`lpn_terrain_blank_ids`**
  > These nodes are still blank: {ids}
  _Ruled OK 2026-08-29._
- **`lpn_terrain_filled_ids`**
  > These nodes were filled in: {ids}
  _Ruled OK 2026-08-29._
- **`lpn_terrain_ids_more`**
  > {ids}, and {n} more
  _Ruled OK 2026-08-29._
- **`lpn_terrain_keep_ids`**
  > They are: {ids}
  _Ruled OK 2026-08-29._
- **`lpn_terrain_will_ids`**
  > These are the nodes that will be filled in: {ids}
  _Ruled OK 2026-08-29._

## u_  (2)

- **`u_day`**
  > day
  _Ruled OK 2026-09-01._
- **`u_hr`**
  > hr
  _Ruled OK 2026-09-01._
