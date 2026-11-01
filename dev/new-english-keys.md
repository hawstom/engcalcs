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

**0 still to read on master**, of 0 untranslated keys, of 3289 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
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

None on master. Every English key here is present in at least one other language.

---

# Strings waiting on a branch

**66 still to read**, of 109 new keys across 8 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### box-design (`867b6ace9`) — adds no English strings

### chore/sprint-1101 (`f31ed562d`) — adds no English strings

### feat/desktop (`baba0f04d`) — adds no English strings

### feat/import-alternative (`3d7cfa0f6`) — 12 new, 12 to read @@ NEEDS RULING

- **`lpn_export_table_scn_keeps`**
  > All holds one sheet for each scenario. Parent scenarios, alternatives and inheritance are not in the file.
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

### feat/report-widths (`5058a668e`) — already merged into box-design; its strings are listed there

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
