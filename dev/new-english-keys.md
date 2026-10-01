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

**0 still to read on master**, of 0 untranslated keys, of 2135 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

None on master. Every English key here is present in at least one other language.

---

# Strings waiting on a branch

**68 still to read**, of 71 new keys across 18 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### chore/key-merge (`b11f88a5`) — adds no English strings

### feat/bentley-interop (`22fbb9b7`) — 13 new, 13 to read @@ NEEDS RULING

- **`lpn_alt_cat_constituent`**
  > Constituent
  @@ NEEDS RULING
- **`lpn_alt_cat_demand`**
  > Demand
  @@ NEEDS RULING
- **`lpn_alt_cat_energy`**
  > Energy cost
  @@ NEEDS RULING
- **`lpn_alt_cat_fireflow`**
  > Fire flow
  @@ NEEDS RULING
- **`lpn_alt_cat_initial`**
  > Initial settings
  @@ NEEDS RULING
- **`lpn_alt_cat_physical`**
  > Physical
  @@ NEEDS RULING
- **`lpn_alt_cat_text`**
  > Text
  @@ NEEDS RULING
- **`lpn_alt_cat_topology`**
  > Active topology
  @@ NEEDS RULING
- **`lpn_alt_cat_userdata`**
  > Custom properties
  @@ NEEDS RULING
- **`lpn_alt_note`**
  > Read only. Base uses the Base alternative of every category. A scenario gets its own alternative in a category, a child of the Base one, once it holds a value of its own there. The number is how many values it holds.
  @@ NEEDS RULING
- **`lpn_alt_title`**
  > Alternatives
  @@ NEEDS RULING
- **`lpn_scenario_basic`**
  > Basic mode
  @@ NEEDS RULING
- **`lpn_scenario_basic_tip`**
  > Checked, a scenario is simply the values you set in it. Unchecked, this menu also offers the Alternatives table, which shows how those values are grouped by category.
  @@ NEEDS RULING

### feat/copy-lock (`9828fb80`) — 7 new, 7 to read @@ NEEDS RULING

- **`lpn_copy_body`**
  > This file was originally created on {date}, but this browser doesn't remember it. Is this the Original file (keep same lock) or a Copy (make new lock)?
  @@ NEEDS RULING
- **`lpn_copy_body_nodate`**
  > This browser doesn't remember this file. Is this the Original file (keep same lock) or a Copy (make new lock)?
  @@ NEEDS RULING
- **`lpn_copy_copy`**
  > A copy; make new lock
  @@ NEEDS RULING
- **`lpn_copy_kept_link`**
  > Switched to {name}. It stays connected to the file it was opened from, {file}, and Save writes there, not to the file you just chose.
  @@ NEEDS RULING
- **`lpn_copy_opened`**
  > Opened {file} as a copy, with a new lock of its own. The file itself changes only when you save.
  @@ NEEDS RULING
- **`lpn_copy_original`**
  > Original; keep same lock
  @@ NEEDS RULING
- **`lpn_copy_title`**
  > Mark file as new copy?
  @@ NEEDS RULING

### feat/criticality (`614f8d48`) — 23 new, 23 to read @@ NEEDS RULING

- **`lpn_crit_baseline_below`**
  > Junctions already below it with nothing broken: {n}. They are not counted.
  @@ NEEDS RULING
- **`lpn_crit_busy`**
  > Another analysis is running. Stop it, or wait for it to finish.
  @@ NEEDS RULING
- **`lpn_crit_col_asset`**
  > Asset
  @@ NEEDS RULING
- **`lpn_crit_col_below`**
  > Junctions below minimum
  @@ NEEDS RULING
- **`lpn_crit_col_cutoff`**
  > Junctions cut off
  @@ NEEDS RULING
- **`lpn_crit_col_unserved`**
  > Demand not served
  @@ NEEDS RULING
- **`lpn_crit_intro`**
  > Each asset is taken out of the network in turn, and the network is solved at the time step on screen in the active scenario. Nothing in your project is changed; the whole run is made on a copy.
  @@ NEEDS RULING
- **`lpn_crit_menu`**
  > Criticality analysis…
  @@ NEEDS RULING
- **`lpn_crit_menu_tip`**
  > Take each pipe, pump, and valve out of the network in turn and see what the system loses.
  @@ NEEDS RULING
- **`lpn_crit_minpressure`**
  > Lowest pressure allowed
  @@ NEEDS RULING
- **`lpn_crit_minpressure_tip`**
  > This is the same number as Lowest pressure allowed elsewhere in Fire flow analysis. Changing it here changes it there.
  @@ NEEDS RULING
- **`lpn_crit_no_links`**
  > This project has no links yet, so there is nothing to break.
  @@ NEEDS RULING
- **`lpn_crit_no_selection`**
  > No pipe, pump, or valve is selected. Choose one on the map, or break every link.
  @@ NEEDS RULING
- **`lpn_crit_scope`**
  > Links to break
  @@ NEEDS RULING
- **`lpn_crit_scope_all`**
  > Every link
  @@ NEEDS RULING
- **`lpn_crit_scope_selected`**
  > The selected links
  @@ NEEDS RULING
- **`lpn_crit_scope_tip`**
  > Every pipe, pump, and valve, or only the ones selected on the map. Choose the set before you run.
  @@ NEEDS RULING
- **`lpn_crit_skipped`**
  > {n} selected elements are not links, so they were not broken.
  @@ NEEDS RULING
- **`lpn_crit_stale`**
  > The drawing changed, so the criticality results were cleared. Run it again.
  @@ NEEDS RULING
- **`lpn_crit_stopped`**
  > Stopped after {done} of {total} assets. The results below are the ones already finished.
  @@ NEEDS RULING
- **`lpn_crit_summary`**
  > {n} of {total} assets leave demand unserved or drop a junction below {pressure}.
  @@ NEEDS RULING
- **`lpn_crit_title`**
  > Criticality analysis
  @@ NEEDS RULING
- **`lpn_crit_working`**
  > Working: {done} of {total} assets.
  @@ NEEDS RULING

### feat/find-filter (`59671f1b`) — 1 new, 1 to read @@ NEEDS RULING

- **`lpn_pane_filter_stale`**
  > Rows that no longer match: {n}.
  @@ NEEDS RULING

### feat/fireflow-scope (`34872754`) — 2 new, 2 to read @@ NEEDS RULING

- **`lpn_ff_all`**
  > All
  @@ NEEDS RULING
- **`lpn_ff_selected`**
  > Selected
  @@ NEEDS RULING

### feat/graph-tab-keys (`6e7b95fa`) — adds no English strings

### feat/help-menu (`d34b00e6`) — 6 new, 6 to read @@ NEEDS RULING

- **`lpn_file_import_menu`**
  > Import…
  @@ NEEDS RULING
- **`lpn_help_hotkeys`**
  > Tables and Hotkeys
  @@ NEEDS RULING
- **`lpn_hotkeys_map_def`**
  > <table class="lpn-notes-table"><tbody><tr><td>1 or Esc</td><td>Select.</td></tr><tr><td>2</td><td>Add a junction.</td></tr><tr><td>3</td><td>Add a reservoir.</td></tr><tr><td>4</td><td>Add a tank.</td></tr><tr><td>5</td><td>Add a pipe.</td></tr><tr><td>6</td><td>Add a pump.</td></tr><tr><td>7</td><td>Add a valve.</td></tr><tr><td>8</td><td>Add a customer.</td></tr><tr><td>9</td><td>Add text.</td></tr><tr><td>Delete</td><td>Delete the selection.</td></tr><tr><td>Ctrl+Z</td><td>Undo the last change.</td></tr><tr><td>+ or =</td><td>Zoom in.</td></tr><tr><td>-</td><td>Zoom out.</td></tr></tbody></table>
  @@ NEEDS RULING
- **`lpn_hotkeys_map_heading`**
  > Map
  @@ NEEDS RULING
- **`lpn_hotkeys_map_term`**
  > Map keyboard shortcuts
  @@ NEEDS RULING
- **`lpn_hotkeys_tables_heading`**
  > Tables
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

### feat/label-placer (`4c2d1634`) — adds no English strings

### feat/label-placer-a (`3483bfd6`) — adds no English strings

### feat/label-placer-b (`c5905432`) — adds no English strings

### feat/label-placer-c (`9a790a3e`) — adds no English strings

### feat/label-placer-d (`129b63c4`) — adds no English strings

### feat/property-graph (`f22d31af`) — 2 new, 2 to read @@ NEEDS RULING

- **`lpn_pgraph_none`**
  > This asset has no results in the current run.
  @@ NEEDS RULING
- **`lpn_pgraph_source_share_from`**
  > Source share from {node}
  @@ NEEDS RULING

### feat/scenario-preset (`633e70fb`) — 14 new, 14 to read @@ NEEDS RULING

- **`lpn_scenario_preset_average_day`**
  > 4. Average Day
  @@ NEEDS RULING
- **`lpn_scenario_preset_average_day_tip`**
  > Demand multiplier 1: every demand as entered, which is taken to be average day demand.
  @@ NEEDS RULING
- **`lpn_scenario_preset_fire_max_day`**
  > 7. Fire plus max day
  @@ NEEDS RULING
- **`lpn_scenario_preset_fire_max_day_tip`**
  > Max day demand (multiplier 2.0). Run Fire flow analysis in this scenario: it adds the fire flow at each junction on top of this demand.
  @@ NEEDS RULING
- **`lpn_scenario_preset_flow_max`**
  > 3. Flow test: Max
  @@ NEEDS RULING
- **`lpn_scenario_preset_flow_max_tip`**
  > A hydrant flow test at the highest residual reading. In this scenario, add the flow measured at the flowing hydrant to the demand of its junction, then compare the pressures with 1. Flow test: Static. Nothing flows until you do.
  @@ NEEDS RULING
- **`lpn_scenario_preset_flow_mid`**
  > 2. Flow test: Mid
  @@ NEEDS RULING
- **`lpn_scenario_preset_flow_mid_tip`**
  > A hydrant flow test at the first residual reading. In this scenario, add the flow measured at the flowing hydrant to the demand of its junction, then compare the pressures with 1. Flow test: Static. Nothing flows until you do.
  @@ NEEDS RULING
- **`lpn_scenario_preset_flow_static`**
  > 1. Flow test: Static
  @@ NEEDS RULING
- **`lpn_scenario_preset_flow_static_tip`**
  > A hydrant flow test with no hydrant flowing. Its pressures are the static readings to compare with 2. Flow test: Mid and 3. Flow test: Max.
  @@ NEEDS RULING
- **`lpn_scenario_preset_max_day`**
  > 5. Max Day
  @@ NEEDS RULING
- **`lpn_scenario_preset_max_day_tip`**
  > Demand multiplier 2.0 times average day, a starting value. Most systems fall between 1.2 and 3.0 (National Research Council, 2006). Set your own system's in Settings, Calculation, Hydraulics, Demand multiplier.
  @@ NEEDS RULING
- **`lpn_scenario_preset_peak_hour`**
  > 6. Peak hour
  @@ NEEDS RULING
- **`lpn_scenario_preset_peak_hour_tip`**
  > Demand multiplier 3.0 times average day, a starting value. Most systems fall between 3.0 and 6.0 (National Research Council, 2006). Set your own system's in Settings, Calculation, Hydraulics, Demand multiplier.
  @@ NEEDS RULING

### fix/category-desc (`f4bcaf94`) — adds no English strings

### fix/points-data-heading (`75707bd6`) — adds no English strings
