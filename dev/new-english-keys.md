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

**70 still to read on master**, of 235 untranslated keys, of 3204 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## Plain sentences to check  (0, none are stale)

Every entry in `dev/plain-sentences.md` matches the English it was written against.

## lpn_  (235, 70 to read @@ NEEDS RULING)

- **`lpn_at_time`**
  > {value} at {time}
  _Ruled OK 2026-10-20._
- **`lpn_calc_hint`**
  > When “Recalculate automatically” is on, this command is not needed.
  @@ NEEDS RULING
- **`lpn_calc_hint_mute`**
  > Don’t show this again
  @@ NEEDS RULING
- **`lpn_calib_scenario`**
  > Compared with the results of the scenario {scenario}.
  @@ NEEDS RULING
- **`lpn_crit_col_empty`**
  > Tank empties
  _Ruled OK 2026-10-20._
- **`lpn_crit_col_hours`**
  > Hours below minimum
  _Ruled OK 2026-10-20._
- **`lpn_crit_col_lowest_tip`**
  > Read only before a tank empties. After that step, junctions left without a source report meaningless pressures; the Tank empties column gives the step.
  _Ruled OK 2026-10-20._
- **`lpn_crit_col_unserved_peak`**
  > Largest demand not served
  _Ruled OK 2026-10-20._
- **`lpn_crit_empty_note`**
  > Lowest pressures are read before a tank empties. Junctions below minimum include those left without a source from that step on.
  _Ruled OK 2026-10-20._
- **`lpn_crit_run_note`**
  > Each outage was run over the whole simulation ({n} reporting steps).
  _Ruled OK 2026-10-20._
- **`lpn_crit_stopped_at`**
  > run stopped at {time}
  _Ruled OK 2026-10-20._
- **`lpn_dem_base`**
  > Elevations written here go into Base, so every scenario that has not overridden an elevation inherits them.
  @@ NEEDS RULING
- **`lpn_dem_scenario`**
  > Elevations written here are overrides in the scenario {scenario}.
  @@ NEEDS RULING
- **`lpn_diag_gpv_curve_order`**
  > The head loss curves of these general purpose valves cannot be read: each flow must be greater than the one before it, and a curve with one point needs a flow above zero:
  _Ruled OK 2026-10-20._
- **`lpn_diag_valve_conflict`**
  > These control valves are joined to each other in a way EPANET does not allow, such as two pressure reducing valves in series. Insert a short pipe between them:
  _Ruled OK 2026-10-20._
- **`lpn_ds_col_hour`**
  > Step of lowest pressure
  _Ruled OK 2026-10-20._
- **`lpn_ds_empties_at`**
  > ⚠ At a demand scale of {m}, a tank empties at {time}.
  _Ruled OK 2026-10-20._
- **`lpn_ds_limit_at`**
  > Limiting reporting step: {time}.
  _Ruled OK 2026-10-20._
- **`lpn_ds_lowest_at_time`**
  > At a demand scale of {m}, the lowest pressure is {pressure}, at junction {id}, at {time}.
  _Ruled OK 2026-10-20._
- **`lpn_ds_run_note`**
  > Judged over the whole run, at every reporting step.
  _Ruled OK 2026-10-20._
- **`lpn_dur_bad_time`**
  > The start and the duration must be whole multiples of the pattern time step, {step}, and the fire must start within the run.
  _Ruled OK 2026-10-20._
- **`lpn_dur_col_drop`**
  > Drop from start
  _Ruled OK 2026-10-20._
- **`lpn_dur_col_end`**
  > Level at end
  _Ruled OK 2026-10-20._
- **`lpn_dur_col_end_nofire`**
  > Level at end without the fire
  _Ruled OK 2026-10-20._
- **`lpn_dur_col_low`**
  > Lowest level reached
  _Ruled OK 2026-10-20._
- **`lpn_dur_col_margin`**
  > Above lowest water depth
  _Ruled OK 2026-10-20._
- **`lpn_dur_col_nofire`**
  > Pressure without the fire
  _Ruled OK 2026-10-20._
- **`lpn_dur_col_pressure`**
  > Pressure at the fire junction
  _Ruled OK 2026-10-20._
- **`lpn_dur_empties`**
  > ⚠ Tank {id} empties at {time}. Pressures from that step on are not read.
  _Ruled OK 2026-10-20._
- **`lpn_dur_fails`**
  > ⚠ Junction {id} falls to {pressure} during the fire, below the residual pressure of {residual}, at {time}.
  _Ruled OK 2026-10-20._
- **`lpn_dur_head`**
  > Fire flow of {flow} at junction {id}, from {start} to {end}.
  _Ruled OK 2026-10-20._
- **`lpn_dur_holds`**
  > ✓ Junction {id} holds at least {pressure} during the fire, above the residual pressure of {residual}, at {time}.
  _Ruled OK 2026-10-20._
- **`lpn_dur_junction`**
  > Fire junction
  _Ruled OK 2026-10-20._
- **`lpn_dur_junction_many`**
  > Several are selected. Select one junction on the map.
  _Ruled OK 2026-10-20._
- **`lpn_dur_junction_none`**
  > None selected. Select one junction on the map.
  _Ruled OK 2026-10-20._
- **`lpn_dur_length`**
  > Fire duration
  _Ruled OK 2026-10-20._
- **`lpn_dur_length_tip`**
  > Hours and minutes, such as 2:00. The fire flow is the Required fire flow, drawn at the one junction selected on the map from the start time for this long. The whole extended-period simulation is run on a copy of the network and compared with the same run without the fire. The start and the duration must be whole multiples of the pattern time step. The system counts as recovered when, at the last reporting step, no junction is more than about 0.14 psi (1 kPa) and no tank more than about 0.3 ft (0.1 m) from the run without the fire.
  _Ruled OK 2026-10-20._
- **`lpn_dur_lowest`**
  > The lowest pressure anywhere is {pressure}, at junction {id}, at {time}.
  _Ruled OK 2026-10-20._
- **`lpn_dur_no_empty`**
  > ✓ No tank empties.
  _Ruled OK 2026-10-20._
- **`lpn_dur_no_junction`**
  > Select one junction for the fire.
  _Ruled OK 2026-10-20._
- **`lpn_dur_not_back_junction`**
  > ⚠ At {time}, the last reporting step, junction {id} is not back to its pressure without the fire. The difference is {pressure}, against a tolerance of {tolerance}.
  _Ruled OK 2026-10-20._
- **`lpn_dur_not_back_tank`**
  > ⚠ At {time}, the last reporting step, tank {id} is not back to its level without the fire. The difference is {level}, against a tolerance of {tolerance}.
  _Ruled OK 2026-10-20._
- **`lpn_dur_option`**
  > A fire for a stated duration
  _Ruled OK 2026-10-20._
- **`lpn_dur_recovers`**
  > ✓ The system recovers after the fire: at {time}, the last reporting step, no junction differs from the run without the fire by more than {pressure} and no tank by more than {level}.
  _Ruled OK 2026-10-20._
- **`lpn_dur_recovery_cut`**
  > The run stopped before its end, so recovery after the fire is not assessed.
  _Ruled OK 2026-10-20._
- **`lpn_dur_recovery_to_end`**
  > The fire lasts to the end of the run, so recovery after it is not assessed.
  _Ruled OK 2026-10-20._
- **`lpn_dur_shortfall`**
  > ⚠ Only {delivered} of the {flow} fire flow is delivered at junction {id}, at {time}, so the residual pressure is not a test of that fire.
  _Ruled OK 2026-10-20._
- **`lpn_dur_start`**
  > Fire starts at
  _Ruled OK 2026-10-20._
- **`lpn_dxf_exported_geo_tail`**
  > Its coordinates are {crs}, in meters, not latitude and longitude.
  @@ NEEDS RULING
- **`lpn_dxfnet_counts`**
  > {nodes} junctions, reservoirs and tanks, {links} pipes, pumps and valves, and {customers} customers.
  @@ NEEDS RULING
- **`lpn_dxfnet_none`**
  > Nothing was imported from {file}. It has no blocks on layers beginning {prefix} that this page can read.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_alternative`**
  > These layers state an alternative other than BASE. Only the BASE alternative is read, so nothing on them was read.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_bad_id`**
  > These elements have an ID that is blank, longer than 31 characters, or contains a space, a semicolon or a quotation mark, and were not imported.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_block_no_line`**
  > These link blocks have no polyline through their middle, and were not imported.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_block_unknown`**
  > These blocks are not the block this page writes for their layer, and were not imported.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_coord_unit`**
  > The drawing states its coordinates in {coord} and its lengths in {length}. The coordinates were read as {length}.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_customer_loose`**
  > The service lines of these customers do not start on a pipe or at a node. The customers were placed with no connection.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_dup_id`**
  > These IDs are stated by more than one element of the same kind. Only the first was imported.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_end_ambiguous`**
  > These links have an end where two nodes lie on the same point, so the node cannot be told, and they were not imported.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_end_loop`**
  > These links start and end at the same node, and were not imported.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_end_no_node`**
  > These links have an end where there is no node, and were not imported.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_entity_unread`**
  > These entities are not a kind this import reads on their layer, and were not imported.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_layer_foreign`**
  > These layers do not begin with {prefix}, so nothing on them was read.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_layer_unknown`**
  > These layers begin with {prefix} but do not continue with an asset code this page writes (NODE, LINK, RESV, TANK, PUMP, VALV, CUST) and an alternative, so nothing on them was read.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_line_no_block`**
  > These service lines end where there is no customer block, and were not imported.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_link_no_block`**
  > These polylines have no block at their middle to state the link's ID and properties, and were not imported.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_no_position`**
  > These blocks have no usable position and were not imported.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_not_held`**
  > A DXF file does not hold patterns, curves, controls, rules, time settings, EPANET options, the head loss formula, the pressure and velocity units, pipe status, minor loss coefficients, or the demand categories of a junction (only their sum), so none of these was imported. Hazen-Williams was assumed, and the pressure and velocity units follow the elevation unit.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_paper_space`**
  > Entities in paper space were not read: {n}.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_pump_no_curve`**
  > A DXF file does not hold pump curves. These pumps have none, and are written to an EPANET file as pipes until each is given a curve.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_shapes`**
  > These layers hold Shapes, which this import does not read. Use Import, Shapes, DXF file for them.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_tag_unknown`**
  > These attribute tags are not ones this page writes for their block, and their values were not imported.
  @@ NEEDS RULING
- **`lpn_dxfnet_note_unit_unknown`**
  > The drawing states these units, which this page does not know. The units in use were kept for them.
  @@ NEEDS RULING
- **`lpn_dxfnet_report_lead`**
  > What was not read, and each change made during import, is listed below with the layer, block or ID concerned:
  @@ NEEDS RULING
- **`lpn_ex_net1_scn_desc`**
  > Gallons per minute, with feet and inches. EPANET's Net1 with four scenarios under Base, the average day: Max day (demand multiplier 1.5) and Peak hour (2.25), each with a main break child, and the two children share one alternative. To test fire flow, make Max day current, select junction 23, choose Water, Analyze, Fire flow analysis, and enter a Required fire flow of 1,500 gpm.
  _Ruled OK 2026-10-20._
- **`lpn_ex_net1_scn_title`**
  > EPANET Net1 with scenarios, gpm (US)
  _Ruled OK 2026-10-20._
- **`lpn_ex_valves_desc`**
  > Gallons per minute, with feet and inches. A hilltop reservoir feeds a hub through a PBV, with a PRV, PSV, FCV, TCV, and GPV branching off it, each one controlling at the solved state.
  _Ruled OK 2026-10-20._
- **`lpn_ex_valves_title`**
  > Valve types, gpm (US)
  _Ruled OK 2026-10-20._
- **`lpn_export_confirm_title`**
  > Export {format}
  @@ NEEDS RULING
- **`lpn_export_goes_base`**
  > Exporting the Base scenario.
  @@ NEEDS RULING
- **`lpn_export_goes_scenario`**
  > Exporting the scenario "{scenario}" to a unique file name.
  @@ NEEDS RULING
- **`lpn_export_holds_base`**
  > It holds the Base scenario only.
  _Ruled 2026-10-18: I approved all._
- **`lpn_export_holds_scenario`**
  > It holds the scenario {scenario} only.
  _Ruled 2026-10-18: I approved all._
- **`lpn_export_leaves_alternatives`**
  > The alternatives stored in this project are not in the file.
  _Ruled 2026-10-18: GeoJSON alternatives string is approved._
- **`lpn_export_receipt_heading`**
  > Exported {file} from {scenario} of {project}.
  @@ NEEDS RULING
- **`lpn_export_receipt_note`**
  > This is an export, not a save: this project is not connected to the file.
  @@ NEEDS RULING
- **`lpn_ff_at_all`**
  > Worst of {n} reporting steps. Each row shows the step with the lowest available flow for that junction.
  _Ruled OK 2026-10-20._
- **`lpn_ff_at_minp`**
  > Tested at {time}, the reporting step with the lowest pressure among the junctions tested.
  _Ruled OK 2026-10-20._
- **`lpn_ff_at_step`**
  > Tested at reporting step {time}.
  _Ruled OK 2026-10-20._
- **`lpn_ff_col_hour`**
  > Step of lowest flow
  _Ruled OK 2026-10-20._
- **`lpn_ff_no_steps`**
  > A tank empties at {time}, before the first reporting step could be tested, so no step was tested.
  _Ruled OK 2026-10-20._
- **`lpn_ff_tank_empties`**
  > A tank empties at {time}; steps from then on were not tested.
  _Ruled OK 2026-10-20._
- **`lpn_ff_working_steps`**
  > Working: reporting step {step} of {steps}, junction {done} of {total}.
  _Ruled OK 2026-10-20._
- **`lpn_field_cv`**
  > Check valve (CV)
  _Ruled 2026-10-22: Approved._
- **`lpn_field_cv_tip`**
  > This pipe passes water only from its start node to its end node, as a check valve does. If the flow would reverse, the pipe closes until it can flow forward again. EPANET calls this status CV.
  _Ruled 2026-10-22: Approved._
- **`lpn_file_export_item_msx`**
  > EPANET-MSX file…
  _Ruled OK 2026-10-20._
- **`lpn_file_export_msx_tip`**
  > Download the attached EPANET-MSX file exactly as it was imported.
  _Ruled OK 2026-10-20._
- **`lpn_file_import_dxfnet`**
  > DXF file…
  @@ NEEDS RULING
- **`lpn_file_import_dxfnet_tip`**
  > Open a DXF file that this page exported as a new project. The blocks and polylines on layers beginning C-WATR-MODL- are read with their attributes. Anything else in the drawing is listed and not read.
  @@ NEEDS RULING
- **`lpn_file_import_msx`**
  > EPANET-MSX file…
  _Ruled OK 2026-10-20._
- **`lpn_file_import_msx_tip`**
  > Attach an EPANET-MSX file (.msx) to this project, or show the one already attached. It is kept with the project, written back unchanged, and run by the EPANET-MSX engine in an extended period simulation.
  _Ruled OK 2026-10-20._
- **`lpn_geojson_results_other`**
  > No results are included, because the results on screen belong to the scenario {scenario}.
  _Ruled 2026-10-18: I approved all._
- **`lpn_gjup_h_notes`**
  > Reading the file
  @@ NEEDS RULING
- **`lpn_gjup_lead`**
  > Choose where to import this GeoJSON file.\n\nOn import, assets are matched by ID. Values are changed on matching assets, assets unique to the import are added, and assets unique to this project are left unaltered.
  @@ NEEDS RULING
- **`lpn_gjup_title`**
  > Update from GeoJSON file
  @@ NEEDS RULING
- **`lpn_gpv_one_point_note`**
  > ⚠ These general purpose valves have a head loss curve with only one point, so their head loss was taken as proportional to flow, through that point: {ids}
  _Ruled OK 2026-10-20._
- **`lpn_guide_cmp_byasset_def`**
  > <p>Below the table, Results by asset lists one row per asset of the type chosen in Asset type, with one column for each checked result in each scenario, for example the pressure at every junction in Base, Max day, and Peak hour. A scenario with a total run time is read at the time step on screen, or at its last time step if its run ends sooner, and each heading shows the time read. A scenario that cannot be solved keeps blank columns and a note that says why, and a scenario that did not converge is marked (not converged) in its headings. Copy puts the table on the clipboard as tab-separated text, ready to paste into a spreadsheet. Download CSV saves the same table as a file. Both carry the units in the headings and the numbers in full, without the rounding shown in the box. The sign of a flow is the solver's internal direction sign. It has no use outside the solver except to show in this table whether a flow changed direction between scenarios.</p>
  @@ NEEDS RULING
- **`lpn_guide_ff_dur_def`**
  > <p>When the project has an extended-period simulation, choose A fire for a stated duration under Reporting step tested. The Required fire flow is then drawn at the one junction selected on the map, starting at the time in Fire starts at and lasting for the Fire duration, both whole multiples of the pattern time step. The whole simulation is run on a copy of the network and compared with the same simulation without the fire. The summary states whether the junction holds the Residual pressure to hold during the fire, the lowest pressure anywhere, whether any tank empties, and whether the system recovers after the fire. One table gives the lowest level of each tank, and another gives the pressure at the fire junction at every reporting step.</p>
  _Ruled OK 2026-10-20._
- **`lpn_guide_page_desc`**
  > {name} user manual: one page for each chapter, from the map and Properties to scenarios, fire flow analysis, and criticality analysis.
  _Ruled OK 2026-10-20._
- **`lpn_guide_page_missing`**
  > There is no such chapter. The chapters are listed below.
  _Ruled OK 2026-10-20._
- **`lpn_guide_page_open`**
  > Open the application
  _Ruled OK 2026-10-20._
- **`lpn_guide_page_what`**
  > {name} is a free web application for modeling water distribution networks, an extension of EPANET.
  _Ruled OK 2026-10-20._
- **`lpn_guide_scn_move_def`**
  > <p>To move or merge elements from one scenario to another, open their Table, use the right-click context menu to Show scenarios, then set their Is active toggle and Clear override as desired in each scenario.</p>
  @@ NEEDS RULING
- **`lpn_guide_scn_move_term`**
  > Moving or merging between scenarios
  @@ NEEDS RULING
- **`lpn_inpup_ask_title`**
  > Import {file}
  _Ruled OK 2026-10-20._
- **`lpn_inpup_base_note`**
  > Choosing Base doesn't clear any scenario overrides.
  @@ NEEDS RULING
- **`lpn_inpup_blank`**
  > blank
  _Ruled OK 2026-10-20._
- **`lpn_inpup_btn_new`**
  > A new project
  _Ruled OK 2026-10-20._
- **`lpn_inpup_btn_newscn`**
  > A new scenario, child of {parent}
  @@ NEEDS RULING
- **`lpn_inpup_btn_newscn_basic`**
  > A new scenario
  @@ NEEDS RULING
- **`lpn_inpup_btn_project`**
  > This project, {project}
  _Ruled OK 2026-10-20._
- **`lpn_inpup_btn_scenario`**
  > {scenario}, open now
  _Ruled OK 2026-10-20._
- **`lpn_inpup_counts`**
  > Values changed ({n}), on assets ({m}). Assets added ({a}). Assets kept that the file does not hold ({k}).
  _Ruled OK 2026-10-20._
- **`lpn_inpup_failed`**
  > The update stopped before it finished, so nothing in {project} was changed. Import the file as a new project to open it. Reason: {reason}
  _Ruled OK 2026-10-20._
- **`lpn_inpup_h_added`**
  > Assets added
  _Ruled OK 2026-10-20._
- **`lpn_inpup_h_changed`**
  > Values changed
  _Ruled OK 2026-10-20._
- **`lpn_inpup_h_kept`**
  > Kept, not in the file
  _Ruled OK 2026-10-20._
- **`lpn_inpup_h_na`**
  > Not applied
  _Ruled OK 2026-10-20._
- **`lpn_inpup_heading`**
  > Imported {file} into {scenario} of {project}
  _Ruled OK 2026-10-20._
- **`lpn_inpup_how`**
  > In this project, assets are matched by ID. Values are changed on matching assets, assets unique to the file are added, and assets unique to this project are left unaltered.
  @@ NEEDS RULING
- **`lpn_inpup_i_connections`**
  > connections
  _Ruled OK 2026-10-20._
- **`lpn_inpup_i_controls`**
  > controls
  _Ruled OK 2026-10-20._
- **`lpn_inpup_i_curves`**
  > curves
  _Ruled OK 2026-10-20._
- **`lpn_inpup_i_descriptions`**
  > descriptions
  _Ruled OK 2026-10-20._
- **`lpn_inpup_i_options`**
  > options
  _Ruled OK 2026-10-20._
- **`lpn_inpup_i_patterns`**
  > patterns
  _Ruled OK 2026-10-20._
- **`lpn_inpup_i_positions`**
  > positions of existing assets
  _Ruled OK 2026-10-20._
- **`lpn_inpup_i_rules`**
  > rules
  _Ruled OK 2026-10-20._
- **`lpn_inpup_lead`**
  > Choose where to import this EPANET file.\n\nOn import, assets are matched by ID. Values are changed on matching assets, assets unique to the import are added, and assets unique to this project are left unaltered.
  @@ NEEDS RULING
- **`lpn_inpup_method_row`**
  > Head loss formula: the file uses {file} and this project uses {project}.
  _Ruled OK 2026-10-20._
- **`lpn_inpup_more`**
  > {n} more
  _Ruled OK 2026-10-20._
- **`lpn_inpup_na_general`**
  > The file also holds {items}. They were not applied.
  _Ruled OK 2026-10-20._
- **`lpn_inpup_na_geo`**
  > Assets only in the file ({n}) were not added, because the file and this project use different coordinate systems.
  _Ruled OK 2026-10-20._
- **`lpn_inpup_na_msx`**
  > The .msx file chosen with this file was not read. To attach it to this project, choose it alone.
  _Ruled OK 2026-10-20._
- **`lpn_inpup_na_owned`**
  > The pipe type states some values of these pipes, so those values were not changed: {ids}
  _Ruled OK 2026-10-20._
- **`lpn_inpup_na_refs`**
  > These added assets refer to a pattern or curve that this project does not have, so the reference was left out: {ids}
  _Ruled OK 2026-10-20._
- **`lpn_inpup_na_roughness`**
  > Roughness was not applied, because this project uses the Darcy-Weisbach formula and roughness is not compared in that case.
  _Ruled OK 2026-10-20._
- **`lpn_inpup_na_type`**
  > The file states a different type for these assets, so none of their values were changed: {ids}
  _Ruled OK 2026-10-20._
- **`lpn_inpup_new_none`**
  > No scenario was created.
  @@ NEEDS RULING
- **`lpn_inpup_new_scn`**
  > Created the scenario {scenario}, a child of {parent}, and opened it.
  @@ NEEDS RULING
- **`lpn_inpup_new_scn_basic`**
  > Created the scenario {scenario} and opened it.
  @@ NEEDS RULING
- **`lpn_inpup_newscn_name`**
  > Name, if you choose a new scenario
  @@ NEEDS RULING
- **`lpn_inpup_nothing`**
  > Every value in the file that matches an asset here is already the same in {scenario}.
  _Ruled OK 2026-10-20._
- **`lpn_inpup_refused_heading`**
  > Nothing was changed in {project}.
  _Ruled OK 2026-10-20._
- **`lpn_inpup_refused_lead`**
  > The units of the file differ from the units of this project, and this page does not convert numbers in a file. Import the file as a new project, or open a project that uses the same units.
  _Ruled OK 2026-10-20._
- **`lpn_inpup_refused_lead_both`**
  > The units and the head loss formula of the file differ from those of this project, and this page does not convert numbers in a file. Import the file as a new project, or open a project that uses the same units and formula.
  _Ruled OK 2026-10-20._
- **`lpn_inpup_refused_lead_formula`**
  > The head loss formula of the file differs from the formula of this project, and this page does not convert roughness values. Import the file as a new project, or open a project that uses the same formula.
  _Ruled OK 2026-10-20._
- **`lpn_inpup_row`**
  > {id}, {property}: {old} to {new}
  _Ruled OK 2026-10-20._
- **`lpn_inpup_status`**
  > Imported {file} into {scenario} of {project}. Values changed ({n}). Assets added ({a}).
  _Ruled OK 2026-10-20._
- **`lpn_inpup_title`**
  > Update from EPANET file
  _Ruled OK 2026-10-20._
- **`lpn_inpup_undo`**
  > Undo reverses all of it in one step.
  _Ruled OK 2026-10-20._
- **`lpn_inpup_unit_row`**
  > {family}: the file uses {file} and this project uses {project}.
  _Ruled OK 2026-10-20._
- **`lpn_library_import_every_scenario`**
  > Every scenario can use them.
  @@ NEEDS RULING
- **`lpn_menu_back`**
  > Back
  @@ NEEDS RULING
- **`lpn_msx_attached_heading`**
  > Attached EPANET-MSX file: {file}
  _Ruled OK 2026-10-20._
- **`lpn_msx_not_msx`**
  > {file} does not look like an EPANET-MSX file: it has no [SPECIES] section.
  _Ruled OK 2026-10-20._
- **`lpn_msx_removed`**
  > Removed {file} from this project.
  _Ruled OK 2026-10-20._
- **`lpn_msx_report_heading`**
  > Attached {file}
  _Ruled OK 2026-10-20._
- **`lpn_msx_report_kept`**
  > This EPANET-MSX file is kept with the project and written back unchanged when the EPANET-MSX file is exported. Water quality is set to Multi-species (EPANET-MSX) under Settings, Calculation, Quality, so an extended period simulation runs every species in the file.
  _Ruled OK 2026-10-20._
- **`lpn_msx_report_missing`**
  > IDs in the file that this network does not have: {ids}.
  _Ruled OK 2026-10-20._
- **`lpn_msx_report_no_species`**
  > No species are listed in the file.
  _Ruled 2026-10-18: "No species are listed in the file.": Approved._
- **`lpn_msx_report_species`**
  > Species in the file: {list}.
  _Ruled OK 2026-10-20._
- **`lpn_msx_too_big`**
  > {file} is too large to keep in browser storage, so it was not attached.
  _Ruled OK 2026-10-20._
- **`lpn_noscn_fmt_dxf`**
  > a DXF file
  @@ NEEDS RULING
- **`lpn_noscn_fmt_geojson`**
  > a GeoJSON file
  @@ NEEDS RULING
- **`lpn_noscn_fmt_inp`**
  > an EPANET file
  @@ NEEDS RULING
- **`lpn_noscn_lead`**
  > This project has {n} scenarios, but {format} has no scenarios or alternatives.
  @@ NEEDS RULING
- **`lpn_ovl_clear_same`**
  > Clear overrides equal to inherited
  @@ NEEDS RULING
- **`lpn_ovl_clear_same_ask`**
  > Clear the overrides of {name} that equal the inherited value ({n} total)? Each value stays as it is and is inherited again. Undo reverses this.
  @@ NEEDS RULING
- **`lpn_pane_pasted_overrides`**
  > New overrides ({n}).
  @@ NEEDS RULING
- **`lpn_pane_pasted_scenario`**
  > These values are overrides in the scenario {scenario}.
  _Ruled 2026-10-18: I approved all._
- **`lpn_quality_msx`**
  > Multi-species (EPANET-MSX)
  _Ruled OK 2026-10-20._
- **`lpn_quality_msx_none`**
  > No EPANET-MSX file is attached to this project. Attach one with File, Import, Network, EPANET-MSX file.
  @@ NEEDS RULING
- **`lpn_quality_msx_species`**
  > Species
  _Ruled OK 2026-10-20._
- **`lpn_quality_msx_species_tip`**
  > The EPANET-MSX species the map colors, the Tables pane and the Graph pane show. Every species in the file is computed in the same run, so changing this needs no new run. Values are in the units the EPANET-MSX file declares: mass per liter for a bulk species, mass per unit area for a wall species.
  _Ruled OK 2026-10-20._
- **`lpn_result_msx_tip`**
  > The value of this EPANET-MSX species, computed by the EPANET-MSX engine, in the units the EPANET-MSX file declares. For a link it is the average along the link.
  _Ruled OK 2026-10-20._
- **`lpn_result_status_cv`**
  > CV
  @@ NEEDS RULING
- **`lpn_roughness_method_note`**
  > ⚠ Pipes with a roughness outside the normal range for {method}: {n}. The values are unchanged and may have been entered for another friction method.
  _Ruled 2026-10-18: I agree._
- **`lpn_run_of_scenario`**
  > Results of the scenario {scenario}.
  @@ NEEDS RULING
- **`lpn_scncmp_progress`**
  > Solving scenario {done} of {total}…
  _Ruled OK 2026-10-20._
- **`lpn_scncmp_stopped`**
  > Stopped after {done} of {total} scenarios. The results below are the ones already finished.
  _Ruled OK 2026-10-20._
- **`lpn_scnres_at_time`**
  > ({time})
  _Ruled OK 2026-10-20._
- **`lpn_scnres_col`**
  > {quantity} ({unit}), {scenario}
  _Ruled OK 2026-10-20._
- **`lpn_scnres_copy_tip`**
  > Copy the table as tab-separated text, to paste into a spreadsheet. Numbers are copied in full, without rounding.
  _Ruled OK 2026-10-20._
- **`lpn_scnres_empty`**
  > This project has none of these assets.
  _Ruled OK 2026-10-20._
- **`lpn_scnres_failed`**
  > {scenario} could not be solved, so its columns are blank. {why}
  _Ruled OK 2026-10-20._
- **`lpn_scnres_flow_tip`**
  > The sign of a flow is the solver's internal direction sign. It has no use outside the solver except to show here whether a flow changed direction between scenarios.
  _Ruled OK 2026-10-20._
- **`lpn_scnres_none`**
  > Check at least one result to show.
  _Ruled OK 2026-10-20._
- **`lpn_scnres_not_converged`**
  > (not converged)
  _Ruled OK 2026-10-20._
- **`lpn_scnres_not_converged_note`**
  > A column marked {mark} shows the last results the solver reached before it stopped without converging.
  _Ruled OK 2026-10-20._
- **`lpn_scnres_stale`**
  > Recalculate is off, so the results on the map and in the Tables pane are from an earlier solve. The {scenario} columns here are solved from the current inputs and may differ from them.
  _Ruled OK 2026-10-20._
- **`lpn_scnres_steady`**
  > (steady state)
  _Ruled OK 2026-10-20._
- **`lpn_scnres_time_note`**
  > A scenario with a total run time is read at the time step on screen, {time}, or at its last time step if its run ends sooner. Each heading shows the time read.
  _Ruled OK 2026-10-20._
- **`lpn_scnres_title`**
  > Results by asset
  _Ruled OK 2026-10-20._
- **`lpn_settings_grp_angle`**
  > Angle
  _Ruled OK 2026-10-20._
- **`lpn_settings_grp_positions`**
  > Positions
  _Ruled OK 2026-10-20._
- **`lpn_settings_grp_size`**
  > Size
  _Ruled OK 2026-10-20._
- **`lpn_settings_grp_thematic`**
  > Thematic
  _Ruled OK 2026-10-20._
- **`lpn_settings_grp_zoom`**
  > Zoom
  _Ruled OK 2026-10-20._
- **`lpn_shapes_every_scenario`**
  > Shapes appear in every scenario.
  @@ NEEDS RULING
- **`lpn_shapes_this_scenario`**
  > Shapes appear in {scenario} only.
  @@ NEEDS RULING
- **`lpn_survey_added_scenario`**
  > The nodes were added to {scenario}. In Base they are inactive.
  _Ruled 2026-10-18: I approved all._
- **`lpn_survey_where_lead`**
  > Each point becomes a node. Choose where the nodes go.
  @@ NEEDS RULING
- **`lpn_survey_where_note`**
  > In a scenario, the nodes are inactive in Base and active only there. Choosing Base adds them to Base, so every scenario inherits them.
  @@ NEEDS RULING
- **`lpn_survey_where_title`**
  > Import surveyed points
  @@ NEEDS RULING
- **`lpn_theme_amber`**
  > Amber
  _Ruled OK 2026-10-17._
- **`lpn_theme_arcade`**
  > Arcade
  _Ruled OK 2026-10-20._
- **`lpn_theme_desktop`**
  > Desktop
  _Ruled OK 2026-10-20._
- **`lpn_theme_green`**
  > Green
  _Ruled OK 2026-10-17._
- **`lpn_theme_hc`**
  > High contrast
  _Ruled OK 2026-10-17._
- **`lpn_theme_newspaper`**
  > Newspaper
  _Ruled OK 2026-10-20._
- **`lpn_theme_platinum`**
  > Platinum
  _Ruled OK 2026-10-17._
- **`lpn_theme_prairie`**
  > Prairie
  _Ruled OK 2026-10-20._
- **`lpn_theme_rounded`**
  > Rounded
  _Ruled OK 2026-10-20._
- **`lpn_theme_space`**
  > Space
  _Ruled OK 2026-10-20._
- **`lpn_time_run_see_report`**
  > See the {report}.
  _Ruled 2026-10-22: Approved._
- **`lpn_time_run_unbalanced`**
  > Time steps not balanced ({n}).
  _Ruled 2026-10-22: Approved._
- **`lpn_time_run_warnings`**
  > Warnings ({n}).
  _Ruled 2026-10-22: Approved._
- **`lpn_when`**
  > Reporting step tested
  _Ruled OK 2026-10-20._
- **`lpn_when_all`**
  > Every reporting step, worst case
  _Ruled OK 2026-10-20._
- **`lpn_when_hour`**
  > A chosen reporting step
  _Ruled OK 2026-10-20._
- **`lpn_when_minp`**
  > The reporting step of lowest pressure
  _Ruled OK 2026-10-20._
- **`lpn_when_now`**
  > The reporting step on screen
  _Ruled OK 2026-10-20._
- **`lpn_when_run`**
  > The whole run
  _Ruled OK 2026-10-20._
- **`lpn_when_step`**
  > Reporting step
  _Ruled OK 2026-10-20._

---

# Strings waiting on a branch

**260 still to read**, of 303 new keys across 11 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### box-design (`7de287871`) — 60 new, 60 to read @@ NEEDS RULING

- **`lpn_col_level`**
  > Level
  @@ NEEDS RULING
- **`lpn_crit_col_stopped`**
  > Run stopped at
  @@ NEEDS RULING
- **`lpn_demand_cats`**
  > Demand categories
  @@ NEEDS RULING
- **`lpn_demand_total_tip`**
  > The total of the base demands of all demand categories at this junction. To change a category, open the Demand categories box.
  @@ NEEDS RULING
- **`lpn_edit_curves`**
  > Edit curves…
  @@ NEEDS RULING
- **`lpn_edit_fittings`**
  > Edit fittings…
  @@ NEEDS RULING
- **`lpn_edit_pipetypes`**
  > Edit types…
  @@ NEEDS RULING
- **`lpn_ff_col_more`**
  > How many others
  @@ NEEDS RULING
- **`lpn_field_active_short`**
  > Active
  @@ NEEDS RULING
- **`lpn_field_auto_length`**
  > Auto length
  @@ NEEDS RULING
- **`lpn_field_auto_length_tip`**
  > Auto length: when checked, the slope length is calculated along the drawn line, and follows the drawing when a node is moved or an end elevation changes. Clear the box to type a length of your own.
  @@ NEEDS RULING
- **`lpn_field_cv_short`**
  > Check valve
  @@ NEEDS RULING
- **`lpn_field_km_fittings_tip`**
  > Minor (local) loss coefficient, k: the sum of the coefficients of the fittings list chosen above. Choose "No fittings list chosen" to type a value.
  @@ NEEDS RULING
- **`lpn_field_km_short_tip`**
  > Minor (local) loss coefficient, k: the head lost to fittings and bends along the pipe, as a multiple of the velocity head.
  @@ NEEDS RULING
- **`lpn_field_tank_level_short`**
  > Initial depth
  @@ NEEDS RULING
- **`lpn_field_tank_level_short_tip`**
  > Initial depth: the depth of water in the tank at the start of the run, measured up from the tank bottom.
  @@ NEEDS RULING
- **`lpn_field_tank_maxlevel_short`**
  > Maximum depth
  @@ NEEDS RULING
- **`lpn_field_tank_maxlevel_short_tip`**
  > Maximum depth: the highest allowable depth of water in the tank, measured up from the tank bottom.
  @@ NEEDS RULING
- **`lpn_field_tank_minlevel_short`**
  > Minimum depth
  @@ NEEDS RULING
- **`lpn_field_tank_minlevel_short_tip`**
  > Minimum depth: the lowest allowable depth of water in the tank, measured up from the tank bottom.
  @@ NEEDS RULING
- **`lpn_field_valve_km_short_tip`**
  > Minor (local) loss coefficient, k: the loss through the valve body when the valve is fully open, as a multiple of the velocity head, in addition to any loss from the valve setting. Use 0 to ignore it.
  @@ NEEDS RULING
- **`lpn_heading_unit`**
  > {label} ({unit})
  @@ NEEDS RULING
- **`lpn_morph_vertex`**
  > Vertex
  @@ NEEDS RULING
- **`lpn_morph_vertex_base`**
  > A junction can be morphed into a vertex only in Base, because the bends of a pipe are the same in every scenario.
  @@ NEEDS RULING
- **`lpn_morph_vertex_base_ask`**
  > A junction can be morphed into a vertex only in Base, because the bends of a pipe are the same in every scenario. Switch to Base and morph?
  @@ NEEDS RULING
- **`lpn_morph_vertex_clear_also`**
  > Initial quality {quality} is cleared too.
  @@ NEEDS RULING
- **`lpn_morph_vertex_clear_both`**
  > Clear elevation {elev} and demands {demands} on {id}?
  @@ NEEDS RULING
- **`lpn_morph_vertex_clear_demand`**
  > Clear demands {demands} on {id}?
  @@ NEEDS RULING
- **`lpn_morph_vertex_clear_elev`**
  > Clear elevation {elev} on {id}?
  @@ NEEDS RULING
- **`lpn_morph_vertex_clear_quality`**
  > Clear initial quality {quality} on {id}?
  @@ NEEDS RULING
- **`lpn_morph_vertex_customers`**
  > {id} was not morphed into a vertex: Customers are connected to it, and a vertex has none.
  @@ NEEDS RULING
- **`lpn_morph_vertex_demand`**
  > {id} was not morphed into a vertex: it has demand or an emitter coefficient, and a vertex has none. Set them to 0 first.
  @@ NEEDS RULING
- **`lpn_morph_vertex_done`**
  > Morphed {n} into vertices. At each, the two pipes are now one pipe, which keeps the ID and the values of the first of them.
  @@ NEEDS RULING
- **`lpn_morph_vertex_kind`**
  > {id} was not morphed into a vertex: a pump or a valve is connected to it, and a vertex lives only on a pipe.
  @@ NEEDS RULING
- **`lpn_morph_vertex_links`**
  > {id} was not morphed into a vertex: it joins {n} pipes, and a vertex lives on exactly one pipe, so a junction must join exactly two.
  @@ NEEDS RULING
- **`lpn_morph_vertex_loop`**
  > {id} was not morphed into a vertex: its two pipes join the same other junction, and one pipe cannot start and end at the same junction.
  @@ NEEDS RULING
- **`lpn_morph_vertex_own`**
  > {id} was not morphed into a vertex: it has its own elevation, tag, description or other data, and a vertex has none. Clear it first.
  @@ NEEDS RULING
- **`lpn_morph_vertex_pipes`**
  > {id} was not morphed into a vertex: its two pipes differ in diameter or roughness, and one pipe cannot hold both.
  @@ NEEDS RULING
- **`lpn_morph_vertex_switch`**
  > Switch to Base and morph
  @@ NEEDS RULING
- **`lpn_morph_vertex_text`**
  > {id} was not morphed into a vertex: a Text is attached to it.
  @@ NEEDS RULING
- **`lpn_morph_vertex_type`**
  > {id} was not morphed into a vertex: only a junction can become one.
  @@ NEEDS RULING
- **`lpn_ovm_dot_alt`**
  > This override is stored in alternative "{alternative}".
  @@ NEEDS RULING
- **`lpn_ovm_dot_alt_shared`**
  > This override is stored in alternative "{alternative}", also used by {list}, so clear or edits change them too.
  @@ NEEDS RULING
- **`lpn_ovm_dot_clear_one`**
  > Click to clear this override.
  @@ NEEDS RULING
- **`lpn_ovm_dot_set_from`**
  > Inherited from {name}. Click to make it an override in this scenario, holding the value shown.
  @@ NEEDS RULING
- **`lpn_ovm_restores`**
  > Clear restores {value}, {source}.
  @@ NEEDS RULING
- **`lpn_prop_label_symbol`**
  > {label}, {symbol}
  @@ NEEDS RULING
- **`lpn_prop_label_symbol_unit`**
  > {label}, {symbol} ({unit})
  @@ NEEDS RULING
- **`lpn_prop_label_unit`**
  > {label} ({unit})
  @@ NEEDS RULING
- **`lpn_quality_named_concentration_short`**
  > {chemical} conc.
  @@ NEEDS RULING
- **`lpn_reaction_bulk_pipe_tip`**
  > Bulk reaction coefficient: the rate of reaction in the body of the water in this pipe (see EPANET Help). A negative number decays the chemical and a positive one increases it. Blank means to use the coefficient set for the whole network under Settings, Calculation, Quality.
  @@ NEEDS RULING
- **`lpn_reaction_tank_short_tip`**
  > Reaction coefficient: the rate of reaction in the water held in this tank, in 1/day. A negative number decays the chemical and a positive one increases it. Blank means to use the bulk reaction coefficient set for the whole network under Settings, Calculation, Quality.
  @@ NEEDS RULING
- **`lpn_reaction_wall_pipe_tip`**
  > Wall reaction coefficient: the rate of reaction at the wall of this pipe (see EPANET Help). A negative number decays the chemical. Blank means to use the coefficient set for the whole network under Settings, Calculation, Quality.
  @@ NEEDS RULING
- **`lpn_replace_selected_only`**
  > Only the selected assets
  @@ NEEDS RULING
- **`lpn_report_copy_html`**
  > Copy HTML
  @@ NEEDS RULING
- **`lpn_result_concentration_short`**
  > Conc.
  @@ NEEDS RULING
- **`lpn_settings_held_default`**
  > the default
  @@ NEEDS RULING
- **`lpn_settings_held_from`**
  > the value in {parent}
  @@ NEEDS RULING
- **`lpn_settings_held_item`**
  > {setting}: {restores}
  @@ NEEDS RULING
- **`lpn_settings_held_none`**
  > no text
  @@ NEEDS RULING

### feat/desktop (`baba0f04d`) — adds no English strings

### feat/dxf-import (`febda3449`) — adds no English strings

### feat/gis-background (`f682e400c`) — 78 new, 78 to read @@ NEEDS RULING

- **`lpn_col_level`**
  > Level
  @@ NEEDS RULING
- **`lpn_crit_col_stopped`**
  > Run stopped at
  @@ NEEDS RULING
- **`lpn_demand_cats`**
  > Demand categories
  @@ NEEDS RULING
- **`lpn_demand_total_tip`**
  > The total of the base demands of all demand categories at this junction. To change a category, open the Demand categories box.
  @@ NEEDS RULING
- **`lpn_edit_curves`**
  > Edit curves…
  @@ NEEDS RULING
- **`lpn_edit_fittings`**
  > Edit fittings…
  @@ NEEDS RULING
- **`lpn_edit_pipetypes`**
  > Edit types…
  @@ NEEDS RULING
- **`lpn_ff_col_more`**
  > How many others
  @@ NEEDS RULING
- **`lpn_field_active_short`**
  > Active
  @@ NEEDS RULING
- **`lpn_field_auto_length`**
  > Auto length
  @@ NEEDS RULING
- **`lpn_field_auto_length_tip`**
  > Auto length: when checked, the slope length is calculated along the drawn line, and follows the drawing when a node is moved or an end elevation changes. Clear the box to type a length of your own.
  @@ NEEDS RULING
- **`lpn_field_cv_short`**
  > Check valve
  @@ NEEDS RULING
- **`lpn_field_km_fittings_tip`**
  > Minor (local) loss coefficient, k: the sum of the coefficients of the fittings list chosen above. Choose "No fittings list chosen" to type a value.
  @@ NEEDS RULING
- **`lpn_field_km_short_tip`**
  > Minor (local) loss coefficient, k: the head lost to fittings and bends along the pipe, as a multiple of the velocity head.
  @@ NEEDS RULING
- **`lpn_field_tank_level_short`**
  > Initial depth
  @@ NEEDS RULING
- **`lpn_field_tank_level_short_tip`**
  > Initial depth: the depth of water in the tank at the start of the run, measured up from the tank bottom.
  @@ NEEDS RULING
- **`lpn_field_tank_maxlevel_short`**
  > Maximum depth
  @@ NEEDS RULING
- **`lpn_field_tank_maxlevel_short_tip`**
  > Maximum depth: the highest allowable depth of water in the tank, measured up from the tank bottom.
  @@ NEEDS RULING
- **`lpn_field_tank_minlevel_short`**
  > Minimum depth
  @@ NEEDS RULING
- **`lpn_field_tank_minlevel_short_tip`**
  > Minimum depth: the lowest allowable depth of water in the tank, measured up from the tank bottom.
  @@ NEEDS RULING
- **`lpn_field_valve_km_short_tip`**
  > Minor (local) loss coefficient, k: the loss through the valve body when the valve is fully open, as a multiple of the velocity head, in addition to any loss from the valve setting. Use 0 to ignore it.
  @@ NEEDS RULING
- **`lpn_gis_add`**
  > Add layer
  @@ NEEDS RULING
- **`lpn_gis_draw`**
  > Draw
  @@ NEEDS RULING
- **`lpn_gis_err_address`**
  > The server address must start with https://.
  @@ NEEDS RULING
- **`lpn_gis_err_layers`**
  > Enter at least one WMS layer name.
  @@ NEEDS RULING
- **`lpn_gis_err_mapserver`**
  > An ArcGIS address must end with /MapServer.
  @@ NEEDS RULING
- **`lpn_gis_err_template`**
  > A tile address must contain {z}, {x} and {y}.
  @@ NEEDS RULING
- **`lpn_gis_failed`**
  > {host} did not return a map image. Its layer is not drawn.
  @@ NEEDS RULING
- **`lpn_gis_kind`**
  > Kind of server
  @@ NEEDS RULING
- **`lpn_gis_kind_arcgis`**
  > ArcGIS MapServer
  @@ NEEDS RULING
- **`lpn_gis_kind_wms`**
  > WMS server
  @@ NEEDS RULING
- **`lpn_gis_kind_xyz`**
  > Tile URL ({z}/{x}/{y})
  @@ NEEDS RULING
- **`lpn_gis_note`**
  > Adding a layer sends the area on screen, and your IP address, to the server you name. Nothing is sent before you add one.
  @@ NEEDS RULING
- **`lpn_gis_opacity`**
  > Opacity (0 to 1)
  @@ NEEDS RULING
- **`lpn_gis_title`**
  > Background layers from a GIS server
  @@ NEEDS RULING
- **`lpn_gis_unlocatable`**
  > Background layers need a project that is placed on the earth.
  @@ NEEDS RULING
- **`lpn_gis_url`**
  > Server address
  @@ NEEDS RULING
- **`lpn_gis_wms_layers`**
  > WMS layer names (comma separated)
  @@ NEEDS RULING
- **`lpn_heading_unit`**
  > {label} ({unit})
  @@ NEEDS RULING
- **`lpn_morph_vertex`**
  > Vertex
  @@ NEEDS RULING
- **`lpn_morph_vertex_base`**
  > A junction can be morphed into a vertex only in Base, because the bends of a pipe are the same in every scenario.
  @@ NEEDS RULING
- **`lpn_morph_vertex_base_ask`**
  > A junction can be morphed into a vertex only in Base, because the bends of a pipe are the same in every scenario. Switch to Base and morph?
  @@ NEEDS RULING
- **`lpn_morph_vertex_clear_also`**
  > Initial quality {quality} is cleared too.
  @@ NEEDS RULING
- **`lpn_morph_vertex_clear_both`**
  > Clear elevation {elev} and demands {demands} on {id}?
  @@ NEEDS RULING
- **`lpn_morph_vertex_clear_demand`**
  > Clear demands {demands} on {id}?
  @@ NEEDS RULING
- **`lpn_morph_vertex_clear_elev`**
  > Clear elevation {elev} on {id}?
  @@ NEEDS RULING
- **`lpn_morph_vertex_clear_quality`**
  > Clear initial quality {quality} on {id}?
  @@ NEEDS RULING
- **`lpn_morph_vertex_customers`**
  > {id} was not morphed into a vertex: Customers are connected to it, and a vertex has none.
  @@ NEEDS RULING
- **`lpn_morph_vertex_demand`**
  > {id} was not morphed into a vertex: it has demand or an emitter coefficient, and a vertex has none. Set them to 0 first.
  @@ NEEDS RULING
- **`lpn_morph_vertex_done`**
  > Morphed {n} into vertices. At each, the two pipes are now one pipe, which keeps the ID and the values of the first of them.
  @@ NEEDS RULING
- **`lpn_morph_vertex_kind`**
  > {id} was not morphed into a vertex: a pump or a valve is connected to it, and a vertex lives only on a pipe.
  @@ NEEDS RULING
- **`lpn_morph_vertex_links`**
  > {id} was not morphed into a vertex: it joins {n} pipes, and a vertex lives on exactly one pipe, so a junction must join exactly two.
  @@ NEEDS RULING
- **`lpn_morph_vertex_loop`**
  > {id} was not morphed into a vertex: its two pipes join the same other junction, and one pipe cannot start and end at the same junction.
  @@ NEEDS RULING
- **`lpn_morph_vertex_own`**
  > {id} was not morphed into a vertex: it has its own elevation, tag, description or other data, and a vertex has none. Clear it first.
  @@ NEEDS RULING
- **`lpn_morph_vertex_pipes`**
  > {id} was not morphed into a vertex: its two pipes differ in diameter or roughness, and one pipe cannot hold both.
  @@ NEEDS RULING
- **`lpn_morph_vertex_switch`**
  > Switch to Base and morph
  @@ NEEDS RULING
- **`lpn_morph_vertex_text`**
  > {id} was not morphed into a vertex: a Text is attached to it.
  @@ NEEDS RULING
- **`lpn_morph_vertex_type`**
  > {id} was not morphed into a vertex: only a junction can become one.
  @@ NEEDS RULING
- **`lpn_ovm_dot_alt`**
  > This override is stored in alternative "{alternative}".
  @@ NEEDS RULING
- **`lpn_ovm_dot_alt_shared`**
  > This override is stored in alternative "{alternative}", also used by {list}, so clear or edits change them too.
  @@ NEEDS RULING
- **`lpn_ovm_dot_clear_one`**
  > Click to clear this override.
  @@ NEEDS RULING
- **`lpn_ovm_dot_set_from`**
  > Inherited from {name}. Click to make it an override in this scenario, holding the value shown.
  @@ NEEDS RULING
- **`lpn_ovm_restores`**
  > Clear restores {value}, {source}.
  @@ NEEDS RULING
- **`lpn_prop_label_symbol`**
  > {label}, {symbol}
  @@ NEEDS RULING
- **`lpn_prop_label_symbol_unit`**
  > {label}, {symbol} ({unit})
  @@ NEEDS RULING
- **`lpn_prop_label_unit`**
  > {label} ({unit})
  @@ NEEDS RULING
- **`lpn_quality_named_concentration_short`**
  > {chemical} conc.
  @@ NEEDS RULING
- **`lpn_reaction_bulk_pipe_tip`**
  > Bulk reaction coefficient: the rate of reaction in the body of the water in this pipe (see EPANET Help). A negative number decays the chemical and a positive one increases it. Blank means to use the coefficient set for the whole network under Settings, Calculation, Quality.
  @@ NEEDS RULING
- **`lpn_reaction_tank_short_tip`**
  > Reaction coefficient: the rate of reaction in the water held in this tank, in 1/day. A negative number decays the chemical and a positive one increases it. Blank means to use the bulk reaction coefficient set for the whole network under Settings, Calculation, Quality.
  @@ NEEDS RULING
- **`lpn_reaction_wall_pipe_tip`**
  > Wall reaction coefficient: the rate of reaction at the wall of this pipe (see EPANET Help). A negative number decays the chemical. Blank means to use the coefficient set for the whole network under Settings, Calculation, Quality.
  @@ NEEDS RULING
- **`lpn_replace_selected_only`**
  > Only the selected assets
  @@ NEEDS RULING
- **`lpn_report_copy_html`**
  > Copy HTML
  @@ NEEDS RULING
- **`lpn_result_concentration_short`**
  > Conc.
  @@ NEEDS RULING
- **`lpn_screenshot_no_gis`**
  > A background layer from a GIS server could not be included.
  @@ NEEDS RULING
- **`lpn_settings_held_default`**
  > the default
  @@ NEEDS RULING
- **`lpn_settings_held_from`**
  > the value in {parent}
  @@ NEEDS RULING
- **`lpn_settings_held_item`**
  > {setting}: {restores}
  @@ NEEDS RULING
- **`lpn_settings_held_none`**
  > no text
  @@ NEEDS RULING

### feat/report-widths (`78a91b264`) — 60 new, 60 to read @@ NEEDS RULING

- **`lpn_col_level`**
  > Level
  @@ NEEDS RULING
- **`lpn_crit_col_stopped`**
  > Run stopped at
  @@ NEEDS RULING
- **`lpn_demand_cats`**
  > Demand categories
  @@ NEEDS RULING
- **`lpn_demand_total_tip`**
  > The total of the base demands of all demand categories at this junction. To change a category, open the Demand categories box.
  @@ NEEDS RULING
- **`lpn_edit_curves`**
  > Edit curves…
  @@ NEEDS RULING
- **`lpn_edit_fittings`**
  > Edit fittings…
  @@ NEEDS RULING
- **`lpn_edit_pipetypes`**
  > Edit types…
  @@ NEEDS RULING
- **`lpn_ff_col_more`**
  > How many others
  @@ NEEDS RULING
- **`lpn_field_active_short`**
  > Active
  @@ NEEDS RULING
- **`lpn_field_auto_length`**
  > Auto length
  @@ NEEDS RULING
- **`lpn_field_auto_length_tip`**
  > Auto length: when checked, the slope length is calculated along the drawn line, and follows the drawing when a node is moved or an end elevation changes. Clear the box to type a length of your own.
  @@ NEEDS RULING
- **`lpn_field_cv_short`**
  > Check valve
  @@ NEEDS RULING
- **`lpn_field_km_fittings_tip`**
  > Minor (local) loss coefficient, k: the sum of the coefficients of the fittings list chosen above. Choose "No fittings list chosen" to type a value.
  @@ NEEDS RULING
- **`lpn_field_km_short_tip`**
  > Minor (local) loss coefficient, k: the head lost to fittings and bends along the pipe, as a multiple of the velocity head.
  @@ NEEDS RULING
- **`lpn_field_tank_level_short`**
  > Initial depth
  @@ NEEDS RULING
- **`lpn_field_tank_level_short_tip`**
  > Initial depth: the depth of water in the tank at the start of the run, measured up from the tank bottom.
  @@ NEEDS RULING
- **`lpn_field_tank_maxlevel_short`**
  > Maximum depth
  @@ NEEDS RULING
- **`lpn_field_tank_maxlevel_short_tip`**
  > Maximum depth: the highest allowable depth of water in the tank, measured up from the tank bottom.
  @@ NEEDS RULING
- **`lpn_field_tank_minlevel_short`**
  > Minimum depth
  @@ NEEDS RULING
- **`lpn_field_tank_minlevel_short_tip`**
  > Minimum depth: the lowest allowable depth of water in the tank, measured up from the tank bottom.
  @@ NEEDS RULING
- **`lpn_field_valve_km_short_tip`**
  > Minor (local) loss coefficient, k: the loss through the valve body when the valve is fully open, as a multiple of the velocity head, in addition to any loss from the valve setting. Use 0 to ignore it.
  @@ NEEDS RULING
- **`lpn_heading_unit`**
  > {label} ({unit})
  @@ NEEDS RULING
- **`lpn_morph_vertex`**
  > Vertex
  @@ NEEDS RULING
- **`lpn_morph_vertex_base`**
  > A junction can be morphed into a vertex only in Base, because the bends of a pipe are the same in every scenario.
  @@ NEEDS RULING
- **`lpn_morph_vertex_base_ask`**
  > A junction can be morphed into a vertex only in Base, because the bends of a pipe are the same in every scenario. Switch to Base and morph?
  @@ NEEDS RULING
- **`lpn_morph_vertex_clear_also`**
  > Initial quality {quality} is cleared too.
  @@ NEEDS RULING
- **`lpn_morph_vertex_clear_both`**
  > Clear elevation {elev} and demands {demands} on {id}?
  @@ NEEDS RULING
- **`lpn_morph_vertex_clear_demand`**
  > Clear demands {demands} on {id}?
  @@ NEEDS RULING
- **`lpn_morph_vertex_clear_elev`**
  > Clear elevation {elev} on {id}?
  @@ NEEDS RULING
- **`lpn_morph_vertex_clear_quality`**
  > Clear initial quality {quality} on {id}?
  @@ NEEDS RULING
- **`lpn_morph_vertex_customers`**
  > {id} was not morphed into a vertex: Customers are connected to it, and a vertex has none.
  @@ NEEDS RULING
- **`lpn_morph_vertex_demand`**
  > {id} was not morphed into a vertex: it has demand or an emitter coefficient, and a vertex has none. Set them to 0 first.
  @@ NEEDS RULING
- **`lpn_morph_vertex_done`**
  > Morphed {n} into vertices. At each, the two pipes are now one pipe, which keeps the ID and the values of the first of them.
  @@ NEEDS RULING
- **`lpn_morph_vertex_kind`**
  > {id} was not morphed into a vertex: a pump or a valve is connected to it, and a vertex lives only on a pipe.
  @@ NEEDS RULING
- **`lpn_morph_vertex_links`**
  > {id} was not morphed into a vertex: it joins {n} pipes, and a vertex lives on exactly one pipe, so a junction must join exactly two.
  @@ NEEDS RULING
- **`lpn_morph_vertex_loop`**
  > {id} was not morphed into a vertex: its two pipes join the same other junction, and one pipe cannot start and end at the same junction.
  @@ NEEDS RULING
- **`lpn_morph_vertex_own`**
  > {id} was not morphed into a vertex: it has its own elevation, tag, description or other data, and a vertex has none. Clear it first.
  @@ NEEDS RULING
- **`lpn_morph_vertex_pipes`**
  > {id} was not morphed into a vertex: its two pipes differ in diameter or roughness, and one pipe cannot hold both.
  @@ NEEDS RULING
- **`lpn_morph_vertex_switch`**
  > Switch to Base and morph
  @@ NEEDS RULING
- **`lpn_morph_vertex_text`**
  > {id} was not morphed into a vertex: a Text is attached to it.
  @@ NEEDS RULING
- **`lpn_morph_vertex_type`**
  > {id} was not morphed into a vertex: only a junction can become one.
  @@ NEEDS RULING
- **`lpn_ovm_dot_alt`**
  > This override is stored in alternative "{alternative}".
  @@ NEEDS RULING
- **`lpn_ovm_dot_alt_shared`**
  > This override is stored in alternative "{alternative}", also used by {list}, so clear or edits change them too.
  @@ NEEDS RULING
- **`lpn_ovm_dot_clear_one`**
  > Click to clear this override.
  @@ NEEDS RULING
- **`lpn_ovm_dot_set_from`**
  > Inherited from {name}. Click to make it an override in this scenario, holding the value shown.
  @@ NEEDS RULING
- **`lpn_ovm_restores`**
  > Clear restores {value}, {source}.
  @@ NEEDS RULING
- **`lpn_prop_label_symbol`**
  > {label}, {symbol}
  @@ NEEDS RULING
- **`lpn_prop_label_symbol_unit`**
  > {label}, {symbol} ({unit})
  @@ NEEDS RULING
- **`lpn_prop_label_unit`**
  > {label} ({unit})
  @@ NEEDS RULING
- **`lpn_quality_named_concentration_short`**
  > {chemical} conc.
  @@ NEEDS RULING
- **`lpn_reaction_bulk_pipe_tip`**
  > Bulk reaction coefficient: the rate of reaction in the body of the water in this pipe (see EPANET Help). A negative number decays the chemical and a positive one increases it. Blank means to use the coefficient set for the whole network under Settings, Calculation, Quality.
  @@ NEEDS RULING
- **`lpn_reaction_tank_short_tip`**
  > Reaction coefficient: the rate of reaction in the water held in this tank, in 1/day. A negative number decays the chemical and a positive one increases it. Blank means to use the bulk reaction coefficient set for the whole network under Settings, Calculation, Quality.
  @@ NEEDS RULING
- **`lpn_reaction_wall_pipe_tip`**
  > Wall reaction coefficient: the rate of reaction at the wall of this pipe (see EPANET Help). A negative number decays the chemical. Blank means to use the coefficient set for the whole network under Settings, Calculation, Quality.
  @@ NEEDS RULING
- **`lpn_replace_selected_only`**
  > Only the selected assets
  @@ NEEDS RULING
- **`lpn_report_copy_html`**
  > Copy HTML
  @@ NEEDS RULING
- **`lpn_result_concentration_short`**
  > Conc.
  @@ NEEDS RULING
- **`lpn_settings_held_default`**
  > the default
  @@ NEEDS RULING
- **`lpn_settings_held_from`**
  > the value in {parent}
  @@ NEEDS RULING
- **`lpn_settings_held_item`**
  > {setting}: {restores}
  @@ NEEDS RULING
- **`lpn_settings_held_none`**
  > no text
  @@ NEEDS RULING

### feat/sqlite-reader (`7e11a538a`) — 53 new, 10 to read @@ NEEDS RULING

- **`lpn_file_import_wtg`**
  > WaterCAD or WaterGEMS model…
  _Ruled OK 2026-10-20._
- **`lpn_file_import_wtg_tip`**
  > Open a WaterCAD or WaterGEMS model as a new project. Choose its .wtg.sqlite file, and also the .wtg file beside it so that its units come too. The file is read and never changed. Its scenarios come with it; each scenario's differences from Base become that scenario's overrides. Beta: tried on few models so far.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_engine`**
  > The SQLite reader could not be loaded, so {file} could not be opened. Check the connection and try again.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_need_sqlite`**
  > Choose the model's .wtg.sqlite file. The .wtg file holds only how the model is displayed; it can be chosen with it.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_not_sqlite`**
  > {file} is not a SQLite database, so it is not a WaterCAD or WaterGEMS model file. A zipped model must be unzipped first.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_not_wtg`**
  > {file} is a SQLite database, but not a WaterCAD or WaterGEMS model.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_active_scenario`**
  > The model was open on the scenario shown in parentheses. This project opens on Base.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_alternative_nameonly`**
  > These alternatives were imported by name only, so that each scenario keeps its choice of them. Their values were not imported, because this page does not read that kind of data from a WaterGEMS model.
  @@ NEEDS RULING
- **`lpn_wtg_note_alternative_unused`**
  > No scenario uses these alternatives. Each was imported as an alternative of its own, so that a scenario can use it.
  @@ NEEDS RULING
- **`lpn_wtg_note_controls_unread`**
  > Not imported: these controls, which this page does not yet read from a WaterGEMS model. Each is shown as WaterGEMS states it.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_converted`**
  > The database stores every number in US customary units (feet, cubic feet per second, psi). Each number was converted once to the project's units and rounded to the shortest decimal within 5 parts in 100 million, which gives back the number as it was entered.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_customer_demand`**
  > Not imported: the customer demands at these junctions. Their base demands were imported.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_cv_closed`**
  > These pipes have a check valve and start closed. They were imported closed.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_directed_split`**
  > WaterGEMS models each pump and valve as a node. Each was imported as a pump or valve link between two new junctions at the node's location and elevation, as in WaterGEMS's own EPANET export. The junctions take the node's WaterGEMS ID number with the suffix -A (inlet side) or -B (outlet side), listed in parentheses. The pipe WaterGEMS designates as downstream connects to the -B junction; all other pipes at the node connect to the -A junction.
  @@ NEEDS RULING
- **`lpn_wtg_note_element_unread`**
  > Not imported: these elements, of a kind this page does not model. The kind is shown in parentheses.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_emitter_unread`**
  > Not imported: the emitter coefficients of these junctions, because the unit they are stored in is not yet confirmed.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_fireflow`**
  > Not imported: the fire flow settings of the model. A needed fire flow stated at a junction was imported as that junction's Required fire flow; enter the rest in the fire flow window.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_gpv_curve`**
  > These general purpose valves have no head loss curve in the file.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_id_changed`**
  > These names are not valid EPANET IDs or repeat another name, so each was given the ID shown in parentheses.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_inactive`**
  > These elements are inactive in the model and were imported inactive.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_link_unjoined`**
  > Not imported: these pipes, pumps, or valves, whose ends are not two different imported nodes, or a pump or valve at a node with no downstream pipe or no other pipe.
  @@ NEEDS RULING
- **`lpn_wtg_note_no_geometry`**
  > These nodes have no location in the file and were placed at 0, 0.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_options`**
  > Not imported: these calculation options (demand adjustments, pressure-dependent demand, or a friction method code this page does not know). Where the model states no EPANET options, the defaults were used.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_pattern_calendar`**
  > Not imported: the day of the week and month multipliers of these patterns.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_pattern_continuous`**
  > These patterns are continuous in the model: the multiplier changes in a straight line between points. An EPANET pattern is stepwise, so each was written as WaterGEMS writes it for EPANET: the starting multiplier, then the value on that line at every pattern time step. WaterGEMS's own solver instead applies a continuous pattern as the average over each time step, so results will not match WaterGEMS hour by hour.
  @@ NEEDS RULING
- **`lpn_wtg_note_pattern_irregular`**
  > These patterns have times that are not whole multiples of the pattern time step. Each was read at that time step.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_pattern_other`**
  > These patterns differ from EPANET patterns in their start time, their last multiplier, or their name (EPANET applies a pattern named 1 to every demand with no pattern). Check them.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_pump_battery`**
  > These variable speed pump batteries were imported as one pump each at relative speed 1, as WaterGEMS writes them to an EPANET file. Their lag pumps and speed control were not imported.
  @@ NEEDS RULING
- **`lpn_wtg_note_pump_curve`**
  > These pumps have a definition this page does not read (constant power, or none), so they have no pump curve. A pump with no curve cannot run in either engine, so results shown before each has a curve are not meaningful.
  @@ NEEDS RULING
- **`lpn_wtg_note_pump_efficiency`**
  > Not imported: the efficiency of these pump definitions, which is neither a constant nor a list of points.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_pump_extended`**
  > These pump curves are extended beyond their points in WaterGEMS. Only the points were imported.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_pump_vsp`**
  > These pumps are variable-speed pumps in the model. They were imported as fixed-speed pumps.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_scenario_alternative`**
  > These alternatives were imported with their names, each in the category shown in parentheses. An alternative holds only the values in which it differs from its parent, and each scenario uses the alternatives it uses in the model. To see them, choose Water, Scenarios, clear Basic mode, then choose Scenario manager.
  @@ NEEDS RULING
- **`lpn_wtg_note_scenario_category`**
  > Not imported: the alternatives these scenarios use in categories this page has no counterpart for (for example Operational, Age, and Trace). There the scenario has the Base values.
  @@ NEEDS RULING
- **`lpn_wtg_note_scenario_root`**
  > These scenarios have no parent in the model. Here every scenario descends from Base, so each was made a child of Base.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_setting_pattern`**
  > Not imported: the setting patterns of these valves.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_srs`**
  > The model states the spatial reference shown. Its coordinates were imported as plain x and y.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_tables_unread`**
  > Not imported: the data in these tables of the database, which this page does not read (for example transient, fire flow, and energy cost data).
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_tank_demand`**
  > Not imported: the demands at these tanks. An EPANET tank has no demand.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_tank_inlet`**
  > These tanks fill through a separate inlet at the top in WaterGEMS. An EPANET tank has no such inlet, so the inlet pipe joins the tank at its base.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_tank_shape`**
  > These tanks are not circular. Each was given the diameter of a circle of the same area, or, where the shape is not known, the diameter stored with it.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_tcv_coefficient`**
  > These throttle control valves state a discharge coefficient rather than a minor loss coefficient. The minor loss coefficient stored with each was used.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_unconverted`**
  > These values are stored in a unit this page does not know and were set to 0. Check them before calculating.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_unit_assumed`**
  > The file does not state the stored unit of these fields, so the unit every example file states was assumed.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_unit_demand`**
  > The demand at these junctions comes from unit demand loads. The flow of each load was imported as a demand; the loading units and the unit load were not.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_unit_unknown`**
  > Not converted: these fields, whose stored unit (shown in parentheses) this page does not know.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_units_assumed`**
  > No .wtg file was chosen with the database, so the units the model is displayed in are not known. The project uses the units that go with the flow unit shown in parentheses. To keep the model's own units, import it again and choose both files.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_units_differ`**
  > WaterGEMS displays these quantities in other units. Here they are in the project's units.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_note_valve_status`**
  > The initial status of these valves was read from a code not yet confirmed in an example file.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_report_intro`**
  > This was a WaterCAD or WaterGEMS model. Bentley publishes no description of the file, so it is read by a layout learned from example files. It was imported as a new project, from its scenario {base} and further scenarios ({n}). Compare the results with WaterGEMS before relying on them.
  @@ NEEDS RULING
- **`lpn_wtg_report_lead`**
  > The list below shows what was changed on the way in, and what in the file was not imported:
  _Ruled OK 2026-10-20._
- **`lpn_wtg_unreadable`**
  > {file} could not be read as a SQLite database. It may be damaged.
  _Ruled OK 2026-10-20._
- **`lpn_wtg_working`**
  > Reading {file}…
  _Ruled OK 2026-10-20._

### feat/starter-example (`f771b5cad`) — 8 new, 8 to read @@ NEEDS RULING

- **`lpn_ex_extension_desc`**
  > A main extension model with test calibration scenarios. The existing system is modeled as a reservoir and a pump based on a hydrant flow test, in Johnson City, Texas. A new loop of 12 inch and 8 inch main is tied into it. A fire hydrant junction passes 1,500 gpm with 20 psi of residual pressure. Gallons per minute, with feet and inches.
  @@ NEEDS RULING
- **`lpn_ex_extension_si_desc`**
  > A main extension model with test calibration scenarios. The existing system is modeled as a reservoir and a pump based on a hydrant flow test, in Johnson City, Texas. A new loop of 300 mm and 200 mm main is tied into it. A fire hydrant junction passes 95 L/s with 14 m of residual pressure. Liters per second, with meters and millimeters.
  @@ NEEDS RULING
- **`lpn_ex_extension_si_title`**
  > Johnson City extension, L/s (SI)
  @@ NEEDS RULING
- **`lpn_ex_extension_title`**
  > Johnson City extension, gpm (US)
  @@ NEEDS RULING
- **`lpn_ex_well_desc`**
  > A well, pump, check valve, loop, and elevated tank, with a 24-hour extended period simulation and scenarios for Max day and Peak hour, in Munday, Texas. A fire hydrant junction passes 500 gpm with 20 psi of residual pressure. Gallons per minute, with feet and inches.
  @@ NEEDS RULING
- **`lpn_ex_well_si_desc`**
  > A well, pump, check valve, loop, and elevated tank, with a 24-hour extended period simulation and scenarios for Max day and Peak hour, in Munday, Texas. A fire hydrant junction passes 32 L/s with 14 m of residual pressure. Liters per second, with meters and millimeters.
  @@ NEEDS RULING
- **`lpn_ex_well_si_title`**
  > Munday well and tank, L/s (SI)
  @@ NEEDS RULING
- **`lpn_ex_well_title`**
  > Munday well and tank, gpm (US)
  @@ NEEDS RULING

### feat/wtg-export (`8edd6369b`) — already merged into feat/wtg-page-export; its strings are listed there

### feat/wtg-page-export (`ad86a1b96`) — 44 new, 44 to read @@ NEEDS RULING

- **`lpn_file_export_item_wtg`**
  > .wtg.sqlite file…
  @@ NEEDS RULING
- **`lpn_file_export_wtg_tip`**
  > Download this network as a .wtg project: a .wtg file and its .wtg.sqlite database, written into a project you saved yourself from the program that opens .wtg files.
  @@ NEEDS RULING
- **`lpn_wtg_export_choose`**
  > Choose the saved project…
  @@ NEEDS RULING
- **`lpn_wtg_export_exported`**
  > Exported {zip}, holding {wtg} and {sqlite}.
  @@ NEEDS RULING
- **`lpn_wtg_export_extract`**
  > Extract both files into one folder, then open the .wtg.
  @@ NEEDS RULING
- **`lpn_wtg_export_failed`**
  > The .wtg project was not written: {detail}
  @@ NEEDS RULING
- **`lpn_wtg_export_left_out`**
  > Left out: {items}
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_backdrop`**
  > The background picture.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_controls_pressure`**
  > Controls on a junction pressure or another condition (links {ids}). Each is written as the fixed clock times at which EPANET switched it.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_demand_model`**
  > Demand model {value} (pressure-driven analysis). It is not written, so a run uses the demands as stated.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_demand_multiplier`**
  > Demand multiplier {value}. Every demand is written at its stated value, as if the multiplier were 1.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_emitters`**
  > Emitter coefficients: {ids}.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_energy_price`**
  > Energy price, price pattern, and demand charge.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_extra_demands`**
  > Second and later demands on a junction: {ids}. Only the first demand is written.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_lead`**
  > The file cannot carry the following, so they are left out:
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_material`**
  > Pipe material and installation year. Every pipe keeps the saved project's default material.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_positions`**
  > True map positions. Assets are placed in feet at one scale, so the drawing keeps its shape but not its location.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_pump_efficiency_curve`**
  > Pump efficiency curve (pumps {ids}). A constant efficiency is written.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_pump_speed_pattern`**
  > Pump speed pattern (pumps {ids}).
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_quality`**
  > Water quality: the analysis, reactions, sources, and tank mixing.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_rules`**
  > Rule-based controls.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_tags`**
  > Tags.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_tank_minvol`**
  > Tank minimum volume (tanks {ids}).
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_tank_mixing`**
  > Tank mixing model (tanks {ids}). Tanks are written fully mixed.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_texts`**
  > Text on the map.
  @@ NEEDS RULING
- **`lpn_wtg_export_need`**
  > The database layout comes from a project you saved yourself. Save one from the program that opens .wtg files, holding at least one junction, reservoir, tank, pipe, pump, pump definition, and pattern, and one valve of each kind this network uses. Then choose its .wtg and .wtg.sqlite files together.
  @@ NEEDS RULING
- **`lpn_wtg_export_need_both`**
  > Choose the .wtg and the .wtg.sqlite file together (hold Ctrl or Shift to select both).
  @@ NEEDS RULING
- **`lpn_wtg_export_no_empty`**
  > This project has no nodes, so there is nothing to export.
  @@ NEEDS RULING
- **`lpn_wtg_export_no_headloss`**
  > This network cannot be written: only the Hazen-Williams head loss formula is written, and this project uses {method}.
  @@ NEEDS RULING
- **`lpn_wtg_export_no_pump_curve`**
  > This network cannot be written: pumps {ids} have no three-point head curve (shutoff, design, and maximum). A power pump or a multiple-point curve is not written.
  @@ NEEDS RULING
- **`lpn_wtg_export_no_units`**
  > This network cannot be written: its flow unit is {unit}, and only gpm is written.
  @@ NEEDS RULING
- **`lpn_wtg_export_refused`**
  > This project cannot be written as a .wtg project: {detail}
  @@ NEEDS RULING
- **`lpn_wtg_export_t_asset_kind`**
  > Asset {id} is of a kind this export does not write.
  @@ NEEDS RULING
- **`lpn_wtg_export_t_gpv_curve`**
  > Valve {id} has no headloss curve in this project.
  @@ NEEDS RULING
- **`lpn_wtg_export_t_head_pattern`**
  > Reservoir {id} names a head pattern that this project does not define.
  @@ NEEDS RULING
- **`lpn_wtg_export_t_integrity`**
  > The files written failed their own check, so they were not offered.
  @@ NEEDS RULING
- **`lpn_wtg_export_t_kind`**
  > The saved project has no {kind} to copy from. Add one, save the project, and choose it again.
  @@ NEEDS RULING
- **`lpn_wtg_export_t_layout`**
  > The saved project is laid out differently from the one this export was tested with.
  @@ NEEDS RULING
- **`lpn_wtg_export_t_not_project`**
  > This file is not a saved project of the kind this export needs. Choose the .wtg file and the .wtg.sqlite file of a project you saved.
  @@ NEEDS RULING
- **`lpn_wtg_export_t_offline`**
  > The export needs a connection to this site the first time, to load the database and EPANET engines. Check the connection and try again.
  @@ NEEDS RULING
- **`lpn_wtg_export_t_schema`**
  > This saved project is laid out as version {found}, and this export has been tested only with {tested}. Save the project from a program version that writes {tested}.
  @@ NEEDS RULING
- **`lpn_wtg_export_t_vol_missing`**
  > Tank {id} names a volume curve that this project does not define.
  @@ NEEDS RULING
- **`lpn_wtg_export_t_vol_range`**
  > The volume curve of tank {id} does not cover the tank's range of water depth.
  @@ NEEDS RULING
- **`lpn_wtg_export_working`**
  > Writing the .wtg project…
  @@ NEEDS RULING

### fix/manual-search-speed (`c37d5b7ae`) — adds no English strings

### fix/usage-report-wording (`425485aa4`) — adds no English strings
