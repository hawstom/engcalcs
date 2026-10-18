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

**8 still to read on master**, of 8 untranslated keys, of 3033 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
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

## lpn_  (8, 8 to read @@ NEEDS RULING)

- **`lpn_theme_amber`**
  > Amber
  @@ NEEDS RULING
- **`lpn_theme_arcade`**
  > Arcade
  @@ NEEDS RULING
- **`lpn_theme_green`**
  > Green
  @@ NEEDS RULING
- **`lpn_theme_hc`**
  > High contrast
  @@ NEEDS RULING
- **`lpn_theme_newspaper`**
  > Newspaper
  @@ NEEDS RULING
- **`lpn_theme_platinum`**
  > Platinum
  @@ NEEDS RULING
- **`lpn_theme_rounded`**
  > Rounded
  @@ NEEDS RULING
- **`lpn_theme_space`**
  > Space
  @@ NEEDS RULING

---

# Strings waiting on a branch

**98 still to read**, of 101 new keys across 21 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### chore/roadmap-1017n (`4efe1eeef`) — adds no English strings

### docs/import-export-scenario (`e19c09d2e`) — adds no English strings

### docs/label-port (`7ec7a65cf`) — already merged into feat/label-beside; its strings are listed there

### docs/msx (`6ff053272`) — adds no English strings

### feat/command-usage (`453a0ac8e`) — adds no English strings

### feat/desktop (`baba0f04d`) — adds no English strings

### feat/label-beside (`79a4a98e0`) — adds no English strings

### feat/label-gang-search (`8b31a9071`) — 3 new, all ruled

- **`lpn_confirm_labels_restore`**
  > Set the label columns back to their original values? This resets which properties are shown, the text before and after each one, the decimals, and the drop order. Your drawing and your other settings are not changed.
  _Ruled OK 2026-09-23._
- **`lpn_labels_restore`**
  > Restore label defaults
  _Ruled OK 2026-09-23._
- **`lpn_labels_restore_tip`**
  > Sets the label columns back to their original values: which properties are shown, the text before and after each one, the decimals, and the drop order. Your drawing and your other settings are not changed.
  _Ruled OK 2026-09-23._

### feat/label-placer (`eaa25d025`) — adds no English strings

### feat/label-placer-a (`2883c0334`) — adds no English strings

### feat/label-placer-b (`18cac7083`) — adds no English strings

### feat/label-placer-c (`4dc27ea10`) — adds no English strings

### feat/label-placer-d (`2e5e81c40`) — adds no English strings

### feat/msx (`c92dc9db9`) — 13 new, 13 to read @@ NEEDS RULING

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
  > This EPANET-MSX file is kept with the project and written back unchanged on export. This page does not run it.
  @@ NEEDS RULING
- **`lpn_msx_report_missing`**
  > IDs in the file that this network does not have: {ids}.
  @@ NEEDS RULING
- **`lpn_msx_report_species`**
  > Species in the file: {list}.
  @@ NEEDS RULING

### feat/native-pbv-gpv (`11212c9ed`) — adds no English strings

### feat/scenario-example (`6b852aaf7`) — 2 new, 2 to read @@ NEEDS RULING

- **`lpn_ex_net1_scn_desc`**
  > Gallons per minute, with feet and inches. EPANET's Net1 with five scenarios under Base, the average day. Peak hour is 2.25 times the Base demands and Max day is 1.5 times. Max day plus fire flow adds 1,500 gpm at junction 23. A main break closes pipe 112 in two scenarios that share one alternative.
  @@ NEEDS RULING
- **`lpn_ex_net1_scn_title`**
  > EPANET Net1 with scenarios, gpm (US)
  @@ NEEDS RULING

### feat/sheet-sync (`1c77e44cd`) — 77 new, 77 to read @@ NEEDS RULING

- **`lpn_file_export_item_scnbook`**
  > Scenario workbook…
  @@ NEEDS RULING
- **`lpn_file_export_scnbook_tip`**
  > Download the scenarios, their alternatives, and the overrides of each alternative as one .xlsx workbook, in the project units. Edit it in a spreadsheet program. Read it back with File, Import, Import scenario workbook.
  @@ NEEDS RULING
- **`lpn_file_import_scnbook`**
  > Import scenario workbook…
  @@ NEEDS RULING
- **`lpn_file_import_scnbook_tip`**
  > Read back a scenario workbook made with File, Export, Scenario workbook, after it is edited in a spreadsheet program. Every difference from this project is listed before anything is changed, with each row that cannot be used and the reason. Apply changes makes them all as one step, which Undo reverses. Nothing the workbook leaves out is deleted.
  @@ NEEDS RULING
- **`lpn_scnbook_alternative_name`**
  > Alternative name ({category})
  @@ NEEDS RULING
- **`lpn_scnbook_alternative_parent`**
  > Parent of alternative {name} ({category})
  @@ NEEDS RULING
- **`lpn_scnbook_applied`**
  > Applied {n} changes from {file}. Undo reverses them.
  @@ NEEDS RULING
- **`lpn_scnbook_apply`**
  > Apply changes
  @@ NEEDS RULING
- **`lpn_scnbook_apply_failed`**
  > Not applied: {list}.
  @@ NEEDS RULING
- **`lpn_scnbook_blank`**
  > (blank)
  @@ NEEDS RULING
- **`lpn_scnbook_col_alternative`**
  > Alternative
  @@ NEEDS RULING
- **`lpn_scnbook_col_assets`**
  > Assets
  @@ NEEDS RULING
- **`lpn_scnbook_col_change`**
  > Change
  @@ NEEDS RULING
- **`lpn_scnbook_col_demands`**
  > Demand categories
  @@ NEEDS RULING
- **`lpn_scnbook_col_fingerprint`**
  > Asset ID check
  @@ NEEDS RULING
- **`lpn_scnbook_col_path`**
  > Path
  @@ NEEDS RULING
- **`lpn_scnbook_col_project`**
  > In the project
  @@ NEEDS RULING
- **`lpn_scnbook_col_project_name`**
  > Project
  @@ NEEDS RULING
- **`lpn_scnbook_col_reason`**
  > Reason
  @@ NEEDS RULING
- **`lpn_scnbook_col_row`**
  > Row
  @@ NEEDS RULING
- **`lpn_scnbook_col_sheet`**
  > Sheet
  @@ NEEDS RULING
- **`lpn_scnbook_col_workbook`**
  > In the workbook
  @@ NEEDS RULING
- **`lpn_scnbook_head_changes`**
  > Changes ({n})
  @@ NEEDS RULING
- **`lpn_scnbook_head_kept`**
  > Kept, not in the workbook ({n})
  @@ NEEDS RULING
- **`lpn_scnbook_head_unusable`**
  > Not used ({n})
  @@ NEEDS RULING
- **`lpn_scnbook_kept_alternative`**
  > Alternative {name} ({category}) is not in the workbook, and is kept.
  @@ NEEDS RULING
- **`lpn_scnbook_kept_scenario`**
  > Scenario {name} is not in the workbook, and is kept.
  @@ NEEDS RULING
- **`lpn_scnbook_kept_settings`**
  > {category}, {alternative}: settings not in the workbook, kept ({n}): {list}
  @@ NEEDS RULING
- **`lpn_scnbook_kept_values`**
  > {category}, {alternative}: values not in the workbook, kept ({n}): {list}
  @@ NEEDS RULING
- **`lpn_scnbook_new_alternative`**
  > New alternative ({category})
  @@ NEEDS RULING
- **`lpn_scnbook_new_scenario`**
  > New scenario
  @@ NEEDS RULING
- **`lpn_scnbook_new_value`**
  > New override: {what}
  @@ NEEDS RULING
- **`lpn_scnbook_no_unit`**
  > no unit
  @@ NEEDS RULING
- **`lpn_scnbook_other_project`**
  > This workbook was made from the project {book} ({n} assets), and the open project is {project} ({m} assets). Check that the workbook belongs to this project before applying its changes.
  @@ NEEDS RULING
- **`lpn_scnbook_pick`**
  > {scenario}: {category}
  @@ NEEDS RULING
- **`lpn_scnbook_refused_not_workbook`**
  > This file is not a scenario workbook, so nothing was changed. A scenario workbook is made with File, Export, Scenario workbook.
  @@ NEEDS RULING
- **`lpn_scnbook_refused_unreadable`**
  > {file} could not be read as an .xlsx workbook, so nothing was changed.
  @@ NEEDS RULING
- **`lpn_scnbook_report_changes`**
  > Differences between {file} and this project: {n}. Nothing is changed until Apply changes is chosen; Undo reverses the whole import.
  @@ NEEDS RULING
- **`lpn_scnbook_report_none`**
  > The workbook {file} has no differences from this project.
  @@ NEEDS RULING
- **`lpn_scnbook_report_title`**
  > Import scenario workbook: {file}
  @@ NEEDS RULING
- **`lpn_scnbook_scenario_name`**
  > Scenario name
  @@ NEEDS RULING
- **`lpn_scnbook_scenario_parent`**
  > Parent of scenario {name}
  @@ NEEDS RULING
- **`lpn_scnbook_setting`**
  > {alternative}: {setting}
  @@ NEEDS RULING
- **`lpn_scnbook_sheet_alternatives`**
  > Alternatives
  @@ NEEDS RULING
- **`lpn_scnbook_sheet_project`**
  > Project
  @@ NEEDS RULING
- **`lpn_scnbook_value`**
  > {alternative}, {asset} {id}: {property}
  @@ NEEDS RULING
- **`lpn_scnbook_why_asset_twice`**
  > A second row for {asset} {id} in this alternative. Only the first was read.
  @@ NEEDS RULING
- **`lpn_scnbook_why_base_settings`**
  > The settings of Base are the project's own; change them in the Settings box. This row was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_base_values`**
  > The values of Base are the drawing itself; edit them on the map or in the Tables pane. This row was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_category`**
  > The alternative {id} is in the category {category}, so this row was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_choice`**
  > not one of the choices this property has, so it was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_column_property`**
  > The column {column} is not a property of {category}, so its values were not read.
  @@ NEEDS RULING
- **`lpn_scnbook_why_column_unit`**
  > The column {column} was not used: its unit is {unit}, and the unit of {property} in this project is {project}.
  @@ NEEDS RULING
- **`lpn_scnbook_why_gone`**
  > the drawing has no such asset, so the value was not changed.
  @@ NEEDS RULING
- **`lpn_scnbook_why_id_twice`**
  > A second row with the ID {id}. Only the first was read.
  @@ NEEDS RULING
- **`lpn_scnbook_why_json`**
  > not a list this page can read, so it was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_loop`**
  > The parent {name} would make this item its own ancestor, so the parent was not changed.
  @@ NEEDS RULING
- **`lpn_scnbook_why_name_taken`**
  > The name {name} is used by another item, so it was not given to this one.
  @@ NEEDS RULING
- **`lpn_scnbook_why_new_no_name`**
  > A new scenario or alternative needs a name, so this row was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_no_alternative`**
  > There is no single alternative named {name} in {category}, so it was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_no_asset`**
  > The project has no single asset {asset} {id}, so this row was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_no_category`**
  > A new alternative needs a category, so this row was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_no_id`**
  > This row has no asset ID, so it was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_no_name`**
  > This row has no name, so its name was not changed.
  @@ NEEDS RULING
- **`lpn_scnbook_why_no_parent`**
  > There is no single scenario or alternative named {name} to be the parent, so this row was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_not_property`**
  > this asset has no such property in this category, so the value was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_number`**
  > not a number, so it was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_on_map`**
  > this is changed on the map, not by a workbook, so it was not changed.
  @@ NEEDS RULING
- **`lpn_scnbook_why_path`**
  > This row names no setting this page knows, so it was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_root_parent`**
  > The parent of a Base is not set by a workbook, so the parent in this row was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_setting_category`**
  > this setting is not in the category {category}, so it was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_setting_twice`**
  > A second row for this setting in this alternative. Only the first was read.
  @@ NEEDS RULING
- **`lpn_scnbook_why_sheet`**
  > This sheet is not one a scenario workbook has, so it was not read.
  @@ NEEDS RULING
- **`lpn_scnbook_why_sheet_twice`**
  > A second sheet of this kind. Only the first, {sheet}, was read.
  @@ NEEDS RULING
- **`lpn_scnbook_why_time`**
  > not a time this page can read, so it was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_unknown_category`**
  > There is no category {category}, so this row was not used.
  @@ NEEDS RULING
- **`lpn_scnbook_why_yesno`**
  > not TRUE or FALSE, so it was not used.
  @@ NEEDS RULING

### feat/sqlite-reader (`16bd4ba05`) — adds no English strings

### feat/theme (`c529169f8`) — adds no English strings

### fix/friction-method-roughness (`1b69039f3`) — 1 new, 1 to read @@ NEEDS RULING

- **`lpn_roughness_method_note`**
  > ⚠ Pipes with a roughness outside the normal range for {method}: {n}. The values are unchanged and may have been entered for another friction method.
  @@ NEEDS RULING

### fix/scenario-receipt (`bed5443e0`) — 5 new, 5 to read @@ NEEDS RULING

- **`lpn_export_holds_base`**
  > It holds the Base scenario only.
  @@ NEEDS RULING
- **`lpn_export_holds_scenario`**
  > It holds the scenario {scenario} only.
  @@ NEEDS RULING
- **`lpn_geojson_results_other`**
  > No results are included, because the results on screen belong to the scenario {scenario}.
  @@ NEEDS RULING
- **`lpn_pane_pasted_scenario`**
  > These values are overrides in the scenario {scenario}.
  @@ NEEDS RULING
- **`lpn_survey_added_scenario`**
  > The nodes were added to {scenario}. In Base they are inactive.
  @@ NEEDS RULING
