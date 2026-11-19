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

**0 still to read on master**, of 0 untranslated keys, of 3382 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
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

None on master. Every English key here is present in at least one other language.

---

# Strings waiting on a branch

**77 still to read**, of 77 new keys across 6 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### feat/assembly (`abff65d80`) — 67 new, 67 to read @@ NEEDS RULING

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
- **`lpn_field_well_pt_empty`**
  > Empty pressure
  @@ NEEDS RULING
- **`lpn_field_well_pt_empty_tip`**
  > Gauge pressure of the air charge when the tank holds no water, the precharge. Leave blank for 2 psi below the pump on pressure.
  @@ NEEDS RULING
- **`lpn_field_well_pt_head_tip`**
  > The pump on or pump off pressure as a head of water. It is the tank's level, which the pump controls compare.
  @@ NEEDS RULING
- **`lpn_field_well_pt_off_head`**
  > Pump off pressure head
  @@ NEEDS RULING
- **`lpn_field_well_pt_off_tip`**
  > Gauge pressure above which the pump stops. It must be greater than the pump on pressure.
  @@ NEEDS RULING
- **`lpn_field_well_pt_on_head`**
  > Pump on pressure head
  @@ NEEDS RULING
- **`lpn_field_well_pt_on_tip`**
  > Gauge pressure below which the pump starts. The well writes it as a pressure head, the tank's level, in a pump control shown in the Libraries box under Controls.
  @@ NEEDS RULING
- **`lpn_field_well_pt_volume`**
  > Total tank volume
  @@ NEEDS RULING
- **`lpn_field_well_pt_volume_tip`**
  > Total volume of the tank, water and air together. A new tank is 2.7 cubic feet (20 gallons) or 0.08 cubic meters (80 liters), a common single-home size. The well writes the tank's volume curve from this volume, the pressures, and Boyle's law, with atmospheric pressure taken as 14.7 psi.
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
- **`lpn_inp_drop_assembly_kind`**
  > These groups name an element that is not the kind the group needs, such as a pump that is not a pump or a tank that is not a tank, so they were not restored. Their nodes and links are kept as plain elements.
  @@ NEEDS RULING
- **`lpn_inp_drop_assembly_malformed`**
  > These ;ASSEMBLY lines are not in a form this page writes, so no group was restored from them.
  @@ NEEDS RULING
- **`lpn_inp_drop_well_tank`**
  > These are one-point wells with a tank, a form this page no longer draws. Their reservoir, drawdown valve, pump, tee, virtual pipe, and tank are kept as ordinary elements, and their pump controls as ordinary controls.
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
- **`lpn_mode_add_welltankp`**
  > Mode: Add Well with pressure tank. Specify a point on the map for the well, or specify a pipe to split it and put the well in it. Then specify the tee and the tank. Press Escape or switch to Select mode to stop.
  @@ NEEDS RULING
- **`lpn_morph_exploded`**
  > Morph separated {ids} into ordinary elements, as Explode does. Undo restores it.
  @@ NEEDS RULING
- **`lpn_pgraph_which`**
  > Graph which sub-asset?
  @@ NEEDS RULING
- **`lpn_tank_associated`**
  > Associated with Well {id}. Change volume and control properties there.
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
- **`lpn_tool_add_welltankp`**
  > Well with pressure tank
  @@ NEEDS RULING
- **`lpn_tool_add_welltankp_tip`**
  > Add a well with a pressure tank: a well, a tee, and a bladder tank, each at a point you specify, joined by pipes. The tank stands on the ground at the well's elevation. Give the pump on and pump off pressures, the empty pressure and the tank volume. The well writes the tank's volume curve from Boyle's law, and the pump controls from the pressures.
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
- **`lpn_welltankp_tank_prompt`**
  > Now specify the pressure tank: a point on the map. Press Escape to stop with the well and its tee.
  @@ NEEDS RULING
- **`lpn_welltankp_tank_refused`**
  > A pressure tank is made new. Specify a point on the map, not an existing tank.
  @@ NEEDS RULING

### feat/graph-scrub (`e95a5991d`) — adds no English strings

### feat/library-order (`48e6950e1`) — adds no English strings

### feat/pick-chooser (`50e757d1d`) — 1 new, 1 to read @@ NEEDS RULING

- **`lpn_pick_chooser_label`**
  > Select one of the elements here
  @@ NEEDS RULING

### feat/transport-slim (`c5b33e463`) — 1 new, 1 to read @@ NEEDS RULING

- **`lpn_time_more`**
  > More time controls
  @@ NEEDS RULING

### feat/volume-unit (`38027cbba`) — 8 new, 8 to read @@ NEEDS RULING

- **`lpn_field_tank_initvol`**
  > Initial volume
  @@ NEEDS RULING
- **`lpn_units_convert_note`**
  > Convert rewrites each number in the new unit, rounded to the decimals given. Keep leaves each number as typed and reads it in the new unit. Undo puts back a conversion.
  @@ NEEDS RULING
- **`lpn_units_convert_q`**
  > Convert inputs from {old} to {new}?
  @@ NEEDS RULING
- **`lpn_units_keep`**
  > Keep
  @@ NEEDS RULING
- **`u_gal`**
  > gal
  @@ NEEDS RULING
- **`u_l`**
  > L
  @@ NEEDS RULING
- **`u_megaliter`**
  > ML
  @@ NEEDS RULING
- **`u_mgal`**
  > MG
  @@ NEEDS RULING
