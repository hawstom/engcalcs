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

**66 still to read on master**, of 75 untranslated keys, of 3353 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## Plain sentences to check  (2, 2 to read @@ NEEDS RULING)

**These are your translator notes in `dev/plain-sentences.md`, not visitor wording.** Each was written
against English that has since changed, or against a key that no longer exists. Say which: keep it
as is, change it (give the new text), or remove it. CC applies your answer to the file.

- **`lpn_reports_epanet`**
  > Solver (run)
  *Why stale:* the English changed after this entry was written
  *Written against:* Run
  *Current plain sentence:* Run: the report of the simulation run.
  @@ NEEDS RULING

- **`lpn_settings_viscosity`**
  > Viscosity
  *Why stale:* the English changed after this entry was written
  *Written against:* Relative viscosity
  *Current plain sentence:* Relative viscosity: how thick the fluid is compared with water at 20 °C. It changes the friction factor under Darcy-Weisbach and nothing else.
  @@ NEEDS RULING

## lpn_  (74, 65 to read @@ NEEDS RULING)

- **`lpn_diag_builtin_error`**
  > An error occurred in the built-in solver: {message}
  @@ NEEDS RULING
- **`lpn_diag_builtin_stopped`**
  > The built-in solver stopped, so the run has no results. To run this network with the EPANET solver, change the setting under Calculation, Solver in Settings.
  @@ NEEDS RULING
- **`lpn_diag_builtin_stopped_at`**
  > The built-in solver stopped at {time}, so the run has no results. To run this network with the EPANET solver, change the setting under Calculation, Solver in Settings.
  _Ruled OK 2026-11-03._
- **`lpn_diag_control_refused`**
  > EPANET does not accept the controls on these links, because a control cannot act on a check valve, a numeric setting cannot control a general purpose valve, and the setting of a pipe or pump cannot be negative. Correct or delete the controls on:
  _Ruled OK 2026-11-03._
- **`lpn_diag_energy_refused`**
  > EPANET does not accept this energy input: a negative price or demand charge, an efficiency of 0 or less, a price pattern that does not exist, or an efficiency curve whose flows do not increase. Correct these:
  _Ruled OK 2026-11-03._
- **`lpn_diag_quality_refused`**
  > EPANET does not accept this water quality input: a source type, source pattern or mixing model that does not exist, a quality time step of 0 seconds (a hydraulic time step under 10 seconds with no quality time step stated), or an EPANET-MSX file that cannot be read. Correct these:
  _Ruled OK 2026-11-03._
- **`lpn_diag_rule_step_refused`**
  > Rules need a hydraulic time step of at least 10 seconds. EPANET evaluates rules at one tenth of the hydraulic time step, in whole seconds, and a result of 0 cannot run. Increase the hydraulic time step or delete the rules.
  _Ruled OK 2026-11-03._
- **`lpn_diag_rules_refused`**
  > EPANET does not accept these rules, because a clause is not valid for the element it names or states a value that cannot be read. Correct or delete them:
  @@ NEEDS RULING
- **`lpn_diag_speed_pattern_refused`**
  > These pumps use a speed pattern that does not exist or that holds a negative value. A speed pattern must exist and hold values of 0 or more:
  _Ruled OK 2026-11-03._
- **`lpn_diag_tank_curve_refused`**
  > The volume curves of these tanks cannot be used. A curve needs at least two points, each level greater than the one before it, and a range that reaches from the minimum level to the maximum level of the tank:
  _Ruled OK 2026-11-03._
- **`lpn_diag_tank_levels_refused`**
  > The initial level of these tanks is not between the minimum level and the maximum level:
  _Ruled OK 2026-11-03._
- **`lpn_engine_epanet_used`**
  > Solved with the EPANET solver.
  @@ NEEDS RULING
- **`lpn_engine_native_used`**
  > Solved with the built-in solver.
  @@ NEEDS RULING
- **`lpn_export_table_scn_keeps`**
  > All holds one sheet for each scenario. Parent scenarios, alternatives and inheritance are not in the file.
  @@ NEEDS RULING
- **`lpn_field_tank_minvol`**
  > Minimum volume
  @@ NEEDS RULING
- **`lpn_field_tank_minvol_tip`**
  > The volume of water in the tank at its minimum depth, in the length unit cubed, for a tank with a sloped or curved bottom; 0 uses the tank diameter, and a volume curve overrides it.
  @@ NEEDS RULING
- **`lpn_field_tank_overflow`**
  > Can overflow
  @@ NEEDS RULING
- **`lpn_field_tank_overflow_tip`**
  > Yes lets a full tank spill what it cannot hold, so the pipe into it stays open; No closes the pipe into a full tank. Only an extended period simulation uses it.
  @@ NEEDS RULING
- **`lpn_file_export_item_wtg`**
  > .wtg file…
  @@ NEEDS RULING
- **`lpn_file_export_wtg_tip`**
  > Download this network as a .wtg project: a .wtg file and its .wtg.sqlite database, together in one .zip.
  @@ NEEDS RULING
- **`lpn_inp_drop_quality_options`**
  > This file states EPANET water quality options: the Quality option, which names the kind of water quality analysis, and two settings that go with a chemical, Diffusivity and Quality tolerance. All three are kept and used. Water age, source trace, and a chemical are each computed here, and the two chemical settings are used when a chemical is run. All of them are written back if you save an EPANET file.
  @@ NEEDS RULING
- **`lpn_inp_export_flat_label_semicolon`**
  > Texts ({n}) here contain a semicolon, and EPANET cuts a Text at its first semicolon. Each is written whole in the file, and EPANET will read only the part before the semicolon.
  @@ NEEDS RULING
- **`lpn_inpalt_base`**
  > The Base alternative
  @@ NEEDS RULING
- **`lpn_inpalt_base_note`**
  > Every scenario inherits the Base alternative, so choosing it changes them all.
  @@ NEEDS RULING
- **`lpn_inpalt_cancelled`**
  > Nothing was changed.
  @@ NEEDS RULING
- **`lpn_inpalt_heading`**
  > Alternative for {category}
  @@ NEEDS RULING
- **`lpn_inpalt_lead`**
  > This file changes values in the categories below. Choose the alternative that receives the values of each.
  @@ NEEDS RULING
- **`lpn_inpalt_more`**
  > and others ({n})
  @@ NEEDS RULING
- **`lpn_inpalt_name`**
  > Name of the new alternative
  @@ NEEDS RULING
- **`lpn_inpalt_new`**
  > A new alternative, child of {parent}
  @@ NEEDS RULING
- **`lpn_inpalt_own`**
  > {scenario}'s own alternative
  @@ NEEDS RULING
- **`lpn_inpalt_receipt`**
  > Alternatives that received the values: {list}
  @@ NEEDS RULING
- **`lpn_inpalt_shared`**
  > {alternative}, also used by {scenarios}
  @@ NEEDS RULING
- **`lpn_ovm_push_ask`**
  > Push override upward to {target}?
  @@ NEEDS RULING
- **`lpn_ovm_push_ask_cur`**
  > Push override upward? Current value in {target}: {old}.
  @@ NEEDS RULING
- **`lpn_ovm_push_others`**
  >  Scenarios that inherit it change ({n} total).
  @@ NEEDS RULING
- **`lpn_ovm_push_tip`**
  > Push override upward
  @@ NEEDS RULING
- **`lpn_popup_boxtitle_of`**
  > Properties: {asset}
  @@ NEEDS RULING
- **`lpn_quality_diffusivity`**
  > Diffusivity
  @@ NEEDS RULING
- **`lpn_quality_diffusivity_tip`**
  > EPANET reads a value above 0.0001 as a ratio to the diffusivity of chlorine in water, and a value of 0.0001 or less as the diffusivity itself, in ft²/s for US flow units and m²/s for SI flow units. Blank uses the EPANET default of 1.0.
  @@ NEEDS RULING
- **`lpn_settings_solver`**
  > Solver
  @@ NEEDS RULING
- **`lpn_settings_viscosity`**
  > Viscosity
  @@ NEEDS RULING
- **`lpn_settings_viscosity_tip`**
  > EPANET reads a value above 0.001 as a ratio to the viscosity of water at 20 degrees Celsius, and a value of 0.001 or less as the kinematic viscosity itself, in ft²/s for US flow units and m²/s for SI flow units. It only changes the answer under the Darcy-Weisbach method.
  @@ NEEDS RULING
- **`lpn_time_epanet_fallback`**
  > The EPANET solver could not be loaded, so the built-in solver ran this network.
  _Ruled OK 2026-11-03._
- **`lpn_time_epanet_fallback_why`**
  > The built-in solver ran this network, because the EPANET solver could not be used. {reason}
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
  > Not written: {items}
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
  > Demand multiplier {value}, as a setting. Every demand is written already multiplied by it.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_energy_price`**
  > An energy price pattern that the project does not define.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_lead`**
  > This export does not yet write the following:
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_positions`**
  > True map positions. Assets are placed in feet at one scale, so the drawing keeps its shape but not its location.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_quality`**
  > Water quality: the analysis, reactions, sources, and tank mixing.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_rules`**
  > Rule-based controls that are not written (rules {ids}).
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_tank_mixing`**
  > Tank mixing model (tanks {ids}). Tanks are written fully mixed.
  @@ NEEDS RULING
- **`lpn_wtg_export_lost_texts`**
  > Text on the map.
  @@ NEEDS RULING
- **`lpn_wtg_export_no_empty`**
  > This project has no nodes, so there is nothing to export.
  @@ NEEDS RULING
- **`lpn_wtg_export_no_headloss`**
  > This network cannot be written: only the Hazen-Williams head loss formula is written, and this project uses {method}.
  @@ NEEDS RULING
- **`lpn_wtg_export_no_pump_curve`**
  > This network cannot be written: pumps {ids} have no three-point or one-point head curve. A power pump or another multiple-point curve is not written.
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
- **`lpn_wtg_export_t_layout`**
  > The export template does not match the layout this export writes.
  @@ NEEDS RULING
- **`lpn_wtg_export_t_offline`**
  > The export needs a connection to this site the first time, to load its template and the database and EPANET engines. Check the connection and try again.
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

## u_  (1, 1 to read @@ NEEDS RULING)

- **`u_millifeet`**
  > millifeet
  @@ NEEDS RULING

---

# Strings waiting on a branch

**72 still to read**, of 72 new keys across 7 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### feat/assembly (`342c3a0fc`) — 51 new, 51 to read @@ NEEDS RULING

- **`lpn_assembly_down_head`**
  > Downstream head
  @@ NEEDS RULING
- **`lpn_assembly_explode`**
  > Explode
  @@ NEEDS RULING
- **`lpn_assembly_explode_tip`**
  > Separate this into its two nodes and its pump, which stay in the network as ordinary elements.
  @@ NEEDS RULING
- **`lpn_assembly_explode_valve_tip`**
  > Separate this into its two nodes and its valve, which stay in the network as ordinary elements.
  @@ NEEDS RULING
- **`lpn_assembly_explode_well_tip`**
  > Separate this into its reservoir, drawdown valve, valve/pump node, pump, and discharge node, which stay in the network as ordinary elements.
  @@ NEEDS RULING
- **`lpn_assembly_explode_welltank_tip`**
  > Separate this into its reservoir, drawdown valve, valve/pump node, pump, tee/connect node, virtual pipe, and tank, which stay in the network as ordinary elements.
  @@ NEEDS RULING
- **`lpn_assembly_exploded`**
  > Separated {id} into ordinary elements. Undo restores it.
  @@ NEEDS RULING
- **`lpn_assembly_up_head`**
  > Upstream head
  @@ NEEDS RULING
- **`lpn_diag_well_levels`**
  > These wells need a pump-on level below the pump-off level, both between the minimum and maximum depth of the tank. Correct them in the Properties box of each well:
  @@ NEEDS RULING
- **`lpn_diag_well_no_curve`**
  > These wells need a drawdown curve and a pump head curve. Choose both in the Properties box of each well:
  @@ NEEDS RULING
- **`lpn_field_virtual_length0`**
  > Virtual pipe (length = 0)
  @@ NEEDS RULING
- **`lpn_field_virtual_tip`**
  > A virtual pipe joins two nodes with no length, volume, travel time, velocity or head loss. Both solvers treat it as a direct connection, and the diameter, roughness, minor loss and length below are not used. Cleared, it is an ordinary pipe again.
  @@ NEEDS RULING
- **`lpn_field_well_pump_off`**
  > Pump off above
  @@ NEEDS RULING
- **`lpn_field_well_pump_off_tip`**
  > Tank depth above which the pump stops. It must be greater than the pump on level, and both must lie between the minimum and maximum depth of the tank.
  @@ NEEDS RULING
- **`lpn_field_well_pump_on`**
  > Pump on below
  @@ NEEDS RULING
- **`lpn_field_well_pump_on_tip`**
  > Tank depth below which the pump starts. Leave both blank for no automatic control. The well writes this and the pump off level as two controls on the pump, shown in the Libraries box under Controls.
  @@ NEEDS RULING
- **`lpn_field_well_static`**
  > Static water level elevation
  @@ NEEDS RULING
- **`lpn_field_well_static_tip`**
  > Elevation of the static water level, the groundwater surface with the pump off. The groundwater reservoir and the pump node stand at this elevation.
  @@ NEEDS RULING
- **`lpn_guide_prop_virtual_def`**
  > <p>A virtual pipe joins two nodes with no length, volume, velocity or head loss. A pipe is virtual when the Virtual pipe box is ticked or when its Length is 0, and Properties then shows Virtual pipe (length = 0). The built-in solver treats it as a direct connection and reports its velocity as 0. EPANET refuses a pipe of length 0, so EPANET and an exported .inp file are given a stand-in 0.01 m long, as wide as the largest ordinary pipe in the project (1000 mm when there is none), with a ;VIRTUAL: note that reopens it as a virtual pipe here. Plain EPANET reads the stand-in as a short, wide pipe.</p>
  @@ NEEDS RULING
- **`lpn_guide_prop_virtual_term`**
  > Virtual pipes and length 0
  @@ NEEDS RULING
- **`lpn_inp_drop_assembly`**
  > The file groups these pumps with nodes it does not contain, so the group was not restored. The nodes and pumps that are there came in as plain elements.
  @@ NEEDS RULING
- **`lpn_inp_drop_assembly_id`**
  > These groups share an ID with another group, so they were not restored. Their nodes and links came in as plain elements.
  @@ NEEDS RULING
- **`lpn_inp_drop_well_tank`**
  > These are one-point wells with a tank, a form this page no longer draws. Their reservoir, drawdown valve, pump, tee, virtual pipe, and tank are kept as ordinary elements, and their pump controls as ordinary controls.
  @@ NEEDS RULING
- **`lpn_library_control_owned`**
  > Written by well {id}. Change it in the Properties box of the well.
  @@ NEEDS RULING
- **`lpn_mode_add_pumpplus`**
  > Mode: Add Pump+. Specify a point on the map to add a pump with its upstream and downstream nodes, or specify a pipe to split it and put the pump in it. Press Escape or switch to Select mode to stop.
  @@ NEEDS RULING
- **`lpn_mode_add_valveplus`**
  > Mode: Add Valve+. Specify a point on the map to add a valve with its upstream and downstream nodes, or specify a pipe to split it and put the valve in it. Press Escape or switch to Select mode to stop.
  @@ NEEDS RULING
- **`lpn_mode_add_virtual`**
  > Mode: Add Virtual Pipe. Select a start node and then an end node to connect them with a pipe that has no length, volume, velocity or head loss. Specify points in open space in between to bend the line, or press Escape to start over. Switch to Select mode to change or move assets, labels, and Text.
  @@ NEEDS RULING
- **`lpn_mode_add_well`**
  > Mode: Add Well. Specify a point on the map to add a well with its groundwater reservoir, drawdown valve, pump node, pump, and discharge node, or specify a pipe to split it and put the well in it. Press Escape or switch to Select mode to stop.
  @@ NEEDS RULING
- **`lpn_mode_add_welltank`**
  > Mode: Add Well with tank. Specify a point on the map for the well, or specify a pipe to split it and put the well in it. Then specify the tee and the tank. Press Escape or switch to Select mode to stop.
  @@ NEEDS RULING
- **`lpn_morph_exploded`**
  > Morph separated {ids} into ordinary elements, as Explode does. Undo restores it.
  @@ NEEDS RULING
- **`lpn_pgraph_which`**
  > Graph which sub-asset?
  @@ NEEDS RULING
- **`lpn_tool_add_pumpplus`**
  > Pump+
  @@ NEEDS RULING
- **`lpn_tool_add_pumpplus_tip`**
  > Add a pump, its upstream node, and its downstream node at one point. Specify a point on the map, or specify a pipe to split it and put the pump in it.
  @@ NEEDS RULING
- **`lpn_tool_add_valveplus`**
  > Valve+
  @@ NEEDS RULING
- **`lpn_tool_add_valveplus_tip`**
  > Add a valve, its upstream node, and its downstream node at one point. Specify a point on the map, or specify a pipe to split it and put the valve in it.
  @@ NEEDS RULING
- **`lpn_tool_add_virtual`**
  > Virtual pipe
  @@ NEEDS RULING
- **`lpn_tool_add_virtual_tip`**
  > Connect two nodes with a virtual pipe, which has no length, volume, velocity or head loss. Select a start node and then an end node.
  @@ NEEDS RULING
- **`lpn_tool_add_well`**
  > Well
  @@ NEEDS RULING
- **`lpn_tool_add_well_tip`**
  > Add a well: its groundwater reservoir, drawdown valve, pump node, pump, and discharge node at one point. Specify a point on the map, or specify a pipe to split it and put the well in it. A Well's Description and Tag are those of its discharge node, the junction that shares the Well's ID.
  @@ NEEDS RULING
- **`lpn_tool_add_welltank`**
  > Well with tank
  @@ NEEDS RULING
- **`lpn_tool_add_welltank_tip`**
  > Add a well with a tank: a well, a tee, and a tank, each at a point you specify, joined by pipes. The well's pump can be controlled by the tank level. Specify the well first, on the map or on a pipe to split it, then the tee, then the tank. A Well's Description and Tag are those of its discharge node, the junction that shares the Well's ID.
  @@ NEEDS RULING
- **`lpn_tool_plus_next`**
  > Press it again for the next one: {next}.
  @@ NEEDS RULING
- **`lpn_well_drawdown_curve`**
  > Drawdown curve
  @@ NEEDS RULING
- **`lpn_well_drawdown_curve_tip`**
  > The curve in the Libraries box that gives the drawdown below the static water level elevation at each pumping rate. It is a head loss curve and includes the point 0, 0.
  @@ NEEDS RULING
- **`lpn_well_drawdown_valve`**
  > Drawdown valve
  @@ NEEDS RULING
- **`lpn_well_identity_tip`**
  > A Well's Description and Tag are those of its discharge node, the junction that shares the Well's ID.
  @@ NEEDS RULING
- **`lpn_well_pump_curve_tip`**
  > The curve in the Libraries box that gives the head the pump adds at each flow, lifted from the pumping level (the static water level elevation less the drawdown). Several pumps can use the same curve, and editing it there changes all of them.
  @@ NEEDS RULING
- **`lpn_welltank_tank_prompt`**
  > Now specify the tank: a tank or a point on the map. Press Escape to stop with the well and its tee.
  @@ NEEDS RULING
- **`lpn_welltank_tank_refused`**
  > The tank must be a tank that is not part of another assembly. Specify the tank again.
  @@ NEEDS RULING
- **`lpn_welltank_tee_prompt`**
  > Now specify the tee: a junction, a point on a pipe, or the well's own point. Press Escape to stop with the well alone.
  @@ NEEDS RULING
- **`lpn_welltank_tee_refused`**
  > The tee must be a junction that is not part of another assembly. Specify the tee again.
  @@ NEEDS RULING

### feat/contour-controls (`d67b75482`) — 3 new, 3 to read @@ NEEDS RULING

- **`lpn_contour_none_note`**
  > Nothing to plot: choose a property under Color nodes by in Settings, Symbology, Node colors.
  @@ NEEDS RULING
- **`lpn_settings_color_node_field_tip`**
  > Colors the nodes by this property. The contour plot follows it.
  @@ NEEDS RULING
- **`lpn_settings_color_ramp_node_tip`**
  > Colors the nodes, the contour plot and its key.
  @@ NEEDS RULING

### feat/library-order (`d90c3ffde`) — 13 new, 13 to read @@ NEEDS RULING

- **`lpn_guide_lib_order_none`**
  > The order of patterns, curves, pipe types, and fittings lists never changes a run.
  @@ NEEDS RULING
- **`lpn_inp_drop_dup_curve`**
  > These curve IDs are defined in more than one place in this file. EPANET adds the later points after the first, so each is one curve, and this page reads it the same way. Each entry gives the lines where its points start.
  @@ NEEDS RULING
- **`lpn_inp_drop_dup_pattern`**
  > These pattern IDs are defined in more than one place in this file. EPANET adds the later multipliers after the first, so each is one pattern, and this page reads it the same way. Each entry gives the lines where its multipliers start.
  @@ NEEDS RULING
- **`lpn_inp_dup_and`**
  >  and 
  @@ NEEDS RULING
- **`lpn_inp_dup_curve_entry`**
  > Curve {id} (lines {lines})
  @@ NEEDS RULING
- **`lpn_inp_dup_pattern_entry`**
  > Pattern {id} (lines {lines})
  @@ NEEDS RULING
- **`lpn_library_move_bottom`**
  > Move to bottom
  @@ NEEDS RULING
- **`lpn_library_move_group`**
  > Move the selected item
  @@ NEEDS RULING
- **`lpn_library_move_tip`**
  > Moves the selected item. Click an item to select it. The order is saved with the project.
  @@ NEEDS RULING
- **`lpn_library_move_tip_controls`**
  > When two controls change the same link at the same time, the control lower in the list takes effect.
  @@ NEEDS RULING
- **`lpn_library_move_tip_none`**
  > The order does not change a run.
  @@ NEEDS RULING
- **`lpn_library_move_tip_rules`**
  > When two rules call for conflicting actions on the same link, the rule with the higher PRIORITY takes effect, and at equal priority the rule higher in the list takes effect.
  @@ NEEDS RULING
- **`lpn_library_move_top`**
  > Move to top
  @@ NEEDS RULING

### feat/pick-chooser (`8c2130c6d`) — 1 new, 1 to read @@ NEEDS RULING

- **`lpn_pick_chooser_label`**
  > Select one of the elements here
  @@ NEEDS RULING

### feat/transport-slim (`2f7678858`) — 1 new, 1 to read @@ NEEDS RULING

- **`lpn_time_more`**
  > More time controls
  @@ NEEDS RULING

### feat/velocity-warning (`2ad68c694`) — 3 new, 3 to read @@ NEEDS RULING

- **`lpn_velocity_warn`**
  > ⚠ Pipe {id} velocity is {velocity} at {time}.
  @@ NEEDS RULING
- **`lpn_velocity_warn_more`**
  > ⚠ And more pipes ({n}) above {limit}.
  @@ NEEDS RULING
- **`lpn_velocity_warn_steady`**
  > ⚠ Pipe {id} velocity is {velocity}.
  @@ NEEDS RULING

### fix/diffusivity (`5d0b057c4`) — adds no English strings
