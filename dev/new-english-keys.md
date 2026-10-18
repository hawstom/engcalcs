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

**23 still to read on master**, of 30 untranslated keys, of 3051 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
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

## lpn_  (30, 23 to read @@ NEEDS RULING)

- **`lpn_diag_gpv_curve_order`**
  > The head loss curves of these general purpose valves cannot be read: each flow must be greater than the one before it, and a curve with one point needs a flow above zero:
  @@ NEEDS RULING
- **`lpn_diag_valve_conflict`**
  > These control valves are joined to each other in a way EPANET does not allow, such as two pressure reducing valves in series. Insert a short pipe between them:
  @@ NEEDS RULING
- **`lpn_ex_net1_scn_desc`**
  > Gallons per minute, with feet and inches. EPANET's Net1 with four scenarios under Base, the average day: Max day (demand multiplier 1.5) and Peak hour (2.25), each with a main break child, and the two children share one alternative. To test fire flow, make Max day current, select junction 23, choose Water, Analyze, Fire flow analysis, and enter a Required fire flow of 1,500 gpm.
  @@ NEEDS RULING
- **`lpn_ex_net1_scn_title`**
  > EPANET Net1 with scenarios, gpm (US)
  @@ NEEDS RULING
- **`lpn_ex_valves_desc`**
  > Gallons per minute, with feet and inches. A hilltop reservoir feeds a hub through a PBV, with a PRV, PSV, FCV, TCV, and GPV branching off it, each one controlling at the solved state.
  @@ NEEDS RULING
- **`lpn_ex_valves_title`**
  > Valve types, gpm (US)
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
- **`lpn_geojson_results_other`**
  > No results are included, because the results on screen belong to the scenario {scenario}.
  _Ruled 2026-10-18: I approved all._
- **`lpn_gpv_one_point_note`**
  > ⚠ These general purpose valves have a head loss curve with only one point, so their head loss was taken as proportional to flow, through that point: {ids}
  @@ NEEDS RULING
- **`lpn_guide_cmp_byasset_def`**
  > <p>Below the table, Results by asset lists one row per asset of the type chosen in Asset type, with one column for each checked result in each scenario, for example the pressure at every junction in Base, Max day, and Peak hour. A scenario with a total run time is read at the time step on screen, or at its last time step if its run ends sooner, and each heading shows the time read. A scenario that cannot be solved keeps blank columns and a note that says why, and a scenario that did not converge is marked (not converged) in its headings. Copy puts the table on the clipboard as tab-separated text, ready to paste into a spreadsheet. Download CSV saves the same table as a file. Both carry the units in the headings and the numbers in full, without the rounding shown in the box.</p>
  @@ NEEDS RULING
- **`lpn_guide_cmp_byasset_term`**
  > Results by asset
  @@ NEEDS RULING
- **`lpn_pane_pasted_scenario`**
  > These values are overrides in the scenario {scenario}.
  _Ruled 2026-10-18: I approved all._
- **`lpn_roughness_method_note`**
  > ⚠ Pipes with a roughness outside the normal range for {method}: {n}. The values are unchanged and may have been entered for another friction method.
  _Ruled 2026-10-18: I agree._
- **`lpn_scncmp_progress`**
  > Solving scenario {done} of {total}…
  @@ NEEDS RULING
- **`lpn_scncmp_stopped`**
  > Stopped after {done} of {total} scenarios. The results below are the ones already finished.
  @@ NEEDS RULING
- **`lpn_scnres_at_time`**
  > ({time})
  @@ NEEDS RULING
- **`lpn_scnres_col`**
  > {quantity} ({unit}), {scenario}
  @@ NEEDS RULING
- **`lpn_scnres_copy_tip`**
  > Copy the table as tab-separated text, to paste into a spreadsheet. Numbers are copied in full, without rounding.
  @@ NEEDS RULING
- **`lpn_scnres_empty`**
  > This project has none of these assets.
  @@ NEEDS RULING
- **`lpn_scnres_failed`**
  > {scenario} could not be solved, so its columns are blank. {why}
  @@ NEEDS RULING
- **`lpn_scnres_none`**
  > Check at least one result to show.
  @@ NEEDS RULING
- **`lpn_scnres_not_converged`**
  > (not converged)
  @@ NEEDS RULING
- **`lpn_scnres_not_converged_note`**
  > A column marked {mark} shows the last results the solver reached before it stopped without converging.
  @@ NEEDS RULING
- **`lpn_scnres_stale`**
  > Recalculate is off, so the results on the map and in the Tables pane are from an earlier solve. The {scenario} columns here are solved from the current inputs and may differ from them.
  @@ NEEDS RULING
- **`lpn_scnres_steady`**
  > (steady state)
  @@ NEEDS RULING
- **`lpn_scnres_time_note`**
  > A scenario with a total run time is read at the time step on screen, {time}, or at its last time step if its run ends sooner. Each heading shows the time read.
  @@ NEEDS RULING
- **`lpn_scnres_title`**
  > Results by asset
  @@ NEEDS RULING
- **`lpn_survey_added_scenario`**
  > The nodes were added to {scenario}. In Base they are inactive.
  _Ruled 2026-10-18: I approved all._

---

# Strings waiting on a branch

**80 still to read**, of 84 new keys across 8 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### feat/desktop (`baba0f04d`) — adds no English strings

### feat/label-beside (`8676cd1be`) — already merged into feat/label-form; its strings are listed there

### feat/label-form (`cbdf05df6`) — adds no English strings

### feat/msx (`8b083e9d7`) — 15 new, 15 to read @@ NEEDS RULING

- **`lpn_file_export_item_msx`**
  > EPANET-MSX file…
  @@ NEEDS RULING
- **`lpn_file_export_msx_tip`**
  > Download the attached EPANET-MSX file exactly as it was imported.
  @@ NEEDS RULING
- **`lpn_file_import_msx`**
  > EPANET-MSX file…
  @@ NEEDS RULING
- **`lpn_file_import_msx_tip`**
  > Attach an EPANET-MSX file (.msx) to this project, or show the one already attached. It is kept with the project and written back unchanged. It is not run.
  @@ NEEDS RULING
- **`lpn_msx_attached_heading`**
  > Attached EPANET-MSX file: {file}
  @@ NEEDS RULING
- **`lpn_msx_not_msx`**
  > {file} does not look like an EPANET-MSX file: it has no [SPECIES] section.
  @@ NEEDS RULING
- **`lpn_msx_remove`**
  > Remove
  @@ NEEDS RULING
- **`lpn_msx_removed`**
  > Removed {file} from this project.
  @@ NEEDS RULING
- **`lpn_msx_replace`**
  > Replace…
  @@ NEEDS RULING
- **`lpn_msx_report_heading`**
  > Attached {file}
  @@ NEEDS RULING
- **`lpn_msx_report_kept`**
  > This EPANET-MSX file is kept with the project and written back unchanged when the EPANET-MSX file is exported. This page does not run it.
  @@ NEEDS RULING
- **`lpn_msx_report_missing`**
  > IDs in the file that this network does not have: {ids}.
  @@ NEEDS RULING
- **`lpn_msx_report_no_species`**
  > No species are listed in the file.
  @@ NEEDS RULING
- **`lpn_msx_report_species`**
  > Species in the file: {list}.
  @@ NEEDS RULING
- **`lpn_msx_too_big`**
  > {file} is too large to keep in browser storage, so it was not attached.
  @@ NEEDS RULING

### feat/native-pbv-gpv (`9655a14fe`) — adds no English strings

### feat/sqlite-reader (`9470877a6`) — 49 new, 49 to read @@ NEEDS RULING

- **`lpn_file_import_wtg`**
  > WaterCAD or WaterGEMS model…
  @@ NEEDS RULING
- **`lpn_file_import_wtg_tip`**
  > Open a WaterCAD or WaterGEMS model as a new project. Choose its .wtg.sqlite file, and also the .wtg file beside it so that its units come too. The file is read and never changed. Its scenarios come with it; each scenario's differences from Base become that scenario's overrides. Beta: tried on few models so far.
  @@ NEEDS RULING
- **`lpn_wtg_engine`**
  > The SQLite reader could not be loaded, so {file} could not be opened. Check the connection and try again.
  @@ NEEDS RULING
- **`lpn_wtg_need_sqlite`**
  > Choose the model's .wtg.sqlite file. The .wtg file holds only how the model is displayed; it can be chosen with it.
  @@ NEEDS RULING
- **`lpn_wtg_not_sqlite`**
  > {file} is not a SQLite database, so it is not a WaterCAD or WaterGEMS model file. A zipped model must be unzipped first.
  @@ NEEDS RULING
- **`lpn_wtg_not_wtg`**
  > {file} is a SQLite database, but not a WaterCAD or WaterGEMS model.
  @@ NEEDS RULING
- **`lpn_wtg_note_active_scenario`**
  > The model was open on the scenario shown in parentheses. This project opens on Base.
  @@ NEEDS RULING
- **`lpn_wtg_note_alternative_unused`**
  > No scenario uses these Physical alternatives. Each was imported as an alternative of its own, holding the values it states, so that a scenario can use it.
  @@ NEEDS RULING
- **`lpn_wtg_note_controls_unread`**
  > Not imported: these controls, which this page does not yet read from a WaterGEMS model. Each is shown as WaterGEMS states it.
  @@ NEEDS RULING
- **`lpn_wtg_note_converted`**
  > The database stores every number in US customary units (feet, cubic feet per second, psi). Each number was converted once to the project's units and rounded to the shortest decimal within 5 parts in 100 million, which gives back the number as it was entered.
  @@ NEEDS RULING
- **`lpn_wtg_note_customer_demand`**
  > Not imported: the customer demands and unit demands at these junctions. Their base demands were imported.
  @@ NEEDS RULING
- **`lpn_wtg_note_cv_closed`**
  > These pipes have a check valve and start closed. They were imported closed.
  @@ NEEDS RULING
- **`lpn_wtg_note_directed_split`**
  > In WaterGEMS a pump or valve is a node between two pipes. Each of these was imported as a pump or valve link between two new junctions at its elevation, named after it with -U (upstream) and -D (downstream).
  @@ NEEDS RULING
- **`lpn_wtg_note_element_unread`**
  > Not imported: these elements, of a kind this page does not model. The kind is shown in parentheses.
  @@ NEEDS RULING
- **`lpn_wtg_note_emitter_unread`**
  > Not imported: the emitter coefficients of these junctions, because the unit they are stored in is not yet confirmed.
  @@ NEEDS RULING
- **`lpn_wtg_note_gpv_curve`**
  > These general purpose valves have no head loss curve in the file.
  @@ NEEDS RULING
- **`lpn_wtg_note_id_changed`**
  > These names are not valid EPANET IDs or repeat another name, so each was given the ID shown in parentheses.
  @@ NEEDS RULING
- **`lpn_wtg_note_inactive`**
  > These elements are inactive in the model and were imported inactive.
  @@ NEEDS RULING
- **`lpn_wtg_note_link_unjoined`**
  > Not imported: these pipes, pumps, or valves, whose ends are not two different imported nodes, or which do not sit between exactly two pipes.
  @@ NEEDS RULING
- **`lpn_wtg_note_no_geometry`**
  > These nodes have no location in the file and were placed at 0, 0.
  @@ NEEDS RULING
- **`lpn_wtg_note_options`**
  > Not imported: these calculation options (demand adjustments, pressure-dependent demand, or a friction method code this page does not know). Where the model states no EPANET options, the defaults were used.
  @@ NEEDS RULING
- **`lpn_wtg_note_pattern_calendar`**
  > Not imported: the day of the week and month multipliers of these patterns.
  @@ NEEDS RULING
- **`lpn_wtg_note_pattern_continuous`**
  > These patterns are continuous in the model. Here each multiplier holds until the next time step.
  @@ NEEDS RULING
- **`lpn_wtg_note_pattern_irregular`**
  > These patterns have times that are not whole multiples of the pattern time step. Each was read at that time step.
  @@ NEEDS RULING
- **`lpn_wtg_note_pattern_other`**
  > These patterns differ from EPANET patterns in their start time, their last multiplier, or their name (EPANET applies a pattern named 1 to every demand with no pattern). Check them.
  @@ NEEDS RULING
- **`lpn_wtg_note_pump_curve`**
  > These pumps have a definition this page does not read (constant power, or none), so they have no pump curve. Give each a curve before calculating.
  @@ NEEDS RULING
- **`lpn_wtg_note_pump_efficiency`**
  > Not imported: the efficiency of these pump definitions, which is neither a constant nor a list of points.
  @@ NEEDS RULING
- **`lpn_wtg_note_pump_extended`**
  > These pump curves are extended beyond their points in WaterGEMS. Only the points were imported.
  @@ NEEDS RULING
- **`lpn_wtg_note_pump_vsp`**
  > These pumps are variable-speed pumps in the model. They were imported as fixed-speed pumps.
  @@ NEEDS RULING
- **`lpn_wtg_note_scenario_alternative`**
  > These scenarios use a Physical alternative other than the one Base uses. The values in which it differs from Base were imported as the scenario's own overrides; the alternative itself was not imported.
  @@ NEEDS RULING
- **`lpn_wtg_note_scenario_category`**
  > Not imported: the alternatives these scenarios use in categories other than Physical. There the scenario has the Base values.
  @@ NEEDS RULING
- **`lpn_wtg_note_scenario_root`**
  > These scenarios have no parent in the model. Here every scenario descends from Base, so each was made a child of Base.
  @@ NEEDS RULING
- **`lpn_wtg_note_setting_pattern`**
  > Not imported: the setting patterns of these valves.
  @@ NEEDS RULING
- **`lpn_wtg_note_srs`**
  > The model states the spatial reference shown. Its coordinates were imported as plain x and y.
  @@ NEEDS RULING
- **`lpn_wtg_note_tables_unread`**
  > Not imported: the data in these tables of the database, which this page does not read (for example transient, fire flow, and energy cost data).
  @@ NEEDS RULING
- **`lpn_wtg_note_tank_demand`**
  > Not imported: the demands at these tanks. An EPANET tank has no demand.
  @@ NEEDS RULING
- **`lpn_wtg_note_tank_inlet`**
  > These tanks fill through a separate inlet at the top in WaterGEMS. An EPANET tank has no such inlet, so the inlet pipe joins the tank at its base.
  @@ NEEDS RULING
- **`lpn_wtg_note_tank_shape`**
  > These tanks are not circular. Each was given the diameter of a circle of the same area, or, where the shape is not known, the diameter stored with it.
  @@ NEEDS RULING
- **`lpn_wtg_note_tcv_coefficient`**
  > These throttle control valves state a discharge coefficient rather than a minor loss coefficient. The minor loss coefficient stored with each was used.
  @@ NEEDS RULING
- **`lpn_wtg_note_unconverted`**
  > These values are stored in a unit this page does not know and were set to 0. Check them before calculating.
  @@ NEEDS RULING
- **`lpn_wtg_note_unit_assumed`**
  > The file does not state the stored unit of these fields, so the unit every example file states was assumed.
  @@ NEEDS RULING
- **`lpn_wtg_note_unit_unknown`**
  > Not converted: these fields, whose stored unit (shown in parentheses) this page does not know.
  @@ NEEDS RULING
- **`lpn_wtg_note_units_assumed`**
  > No .wtg file was chosen with the database, so the units the model is displayed in are not known. The project uses the units that go with the flow unit shown in parentheses. To keep the model's own units, import it again and choose both files.
  @@ NEEDS RULING
- **`lpn_wtg_note_units_differ`**
  > WaterGEMS displays these quantities in other units. Here they are in the project's units.
  @@ NEEDS RULING
- **`lpn_wtg_note_valve_status`**
  > The initial status of these valves was read from a code not yet confirmed in an example file.
  @@ NEEDS RULING
- **`lpn_wtg_report_intro`**
  > This was a WaterCAD or WaterGEMS model. Bentley publishes no description of the file, so it is read by a layout learned from example files. It was imported as a new project, from its scenario {base} and {n} more scenarios. Compare the results with WaterGEMS before relying on them.
  @@ NEEDS RULING
- **`lpn_wtg_report_lead`**
  > The list below shows what was changed on the way in, and what in the file was not imported:
  @@ NEEDS RULING
- **`lpn_wtg_unreadable`**
  > {file} could not be read as a SQLite database. It may be damaged.
  @@ NEEDS RULING
- **`lpn_wtg_working`**
  > Reading {file}…
  @@ NEEDS RULING

### feat/theme (`876ebef92`) — 10 new, 6 to read @@ NEEDS RULING

- **`lpn_theme_amber`**
  > Amber
  _Ruled OK 2026-10-17._
- **`lpn_theme_arcade`**
  > Arcade
  @@ NEEDS RULING
- **`lpn_theme_desktop`**
  > Desktop
  @@ NEEDS RULING
- **`lpn_theme_green`**
  > Green
  _Ruled OK 2026-10-17._
- **`lpn_theme_hc`**
  > High contrast
  _Ruled OK 2026-10-17._
- **`lpn_theme_newspaper`**
  > Newspaper
  @@ NEEDS RULING
- **`lpn_theme_platinum`**
  > Platinum
  _Ruled OK 2026-10-17._
- **`lpn_theme_prairie`**
  > Prairie
  @@ NEEDS RULING
- **`lpn_theme_rounded`**
  > Rounded
  @@ NEEDS RULING
- **`lpn_theme_space`**
  > Space
  @@ NEEDS RULING

### fix/settings-map-layout (`bc00393d2`) — 10 new, 10 to read @@ NEEDS RULING

- **`lpn_settings_grp_angle`**
  > Angle
  @@ NEEDS RULING
- **`lpn_settings_grp_fade`**
  > Fade
  @@ NEEDS RULING
- **`lpn_settings_grp_positions`**
  > Positions
  @@ NEEDS RULING
- **`lpn_settings_grp_resets`**
  > Resets
  @@ NEEDS RULING
- **`lpn_settings_grp_show`**
  > Show
  @@ NEEDS RULING
- **`lpn_settings_grp_size`**
  > Size
  @@ NEEDS RULING
- **`lpn_settings_grp_thematic`**
  > Thematic
  @@ NEEDS RULING
- **`lpn_settings_grp_zoom`**
  > Zoom
  @@ NEEDS RULING
- **`lpn_settings_map_drawing`**
  > Drawing
  @@ NEEDS RULING
- **`lpn_settings_map_options`**
  > Options
  @@ NEEDS RULING
