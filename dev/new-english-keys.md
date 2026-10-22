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

**26 still to read on master**, of 191 untranslated keys, of 3205 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
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

## lpn_  (191, 26 to read @@ NEEDS RULING)

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
- **`lpn_export_confirm_lead`**
  > The {format} holds one scenario, and this project has {n}.
  @@ NEEDS RULING
- **`lpn_export_confirm_title`**
  > Export {format}
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
  > Choose where to import this file. Note that GeoJSON files don't include scenarios.\n\nOn import, assets are matched by ID. Values are changed on matching assets, assets unique to the import are added, and assets unique to this project are left unaltered.
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
  > Choose where to import this file. Note that EPANET files don't include scenarios.\n\nOn import, assets are matched by ID. Values are changed on matching assets, assets unique to the import are added, and assets unique to this project are left unaltered.
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
- **`lpn_ovl_clear_same`**
  > Clear overrides equal to inherited
  @@ NEEDS RULING
- **`lpn_ovl_clear_same_ask`**
  > Clear the overrides of {name} that equal the inherited value ({n} total)? Each value stays as it is and is inherited again. Undo reverses this.
  @@ NEEDS RULING
- **`lpn_ovm_dot_alt`**
  > This override is stored in alternative "{alternative}".
  @@ NEEDS RULING
- **`lpn_ovm_dot_alt_shared`**
  > This override is stored in alternative "{alternative}", also used by {list}, so clear or edits change them too.
  @@ NEEDS RULING
- **`lpn_ovm_dot_clear_to`**
  > Click to clear override and restore {value}, the value in {parent}.
  @@ NEEDS RULING
- **`lpn_ovm_dot_set_from`**
  > Inherited from {name}. Click to make it an override in this scenario, holding the value shown.
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
- **`lpn_survey_added_scenario`**
  > The nodes were added to {scenario}. In Base they are inactive.
  _Ruled 2026-10-18: I approved all._
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

**10 still to read**, of 53 new keys across 6 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### feat/desktop (`baba0f04d`) — adds no English strings

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

### feat/value-source (`472c82137`) — adds no English strings

### feat/wtg-export (`18cd7a6d4`) — adds no English strings

### fix/bottom-pane-lag (`3bb531211`) — adds no English strings

### fix/energy-count (`ee6c2981e`) — adds no English strings
