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

**0 still to read**, of 85 untranslated keys, of 1770 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (85, all ruled)

- **`lpn_area_hint_lasso_go`**
  > Move to draw the outline. Click to finish.
  _Ruled 2026-09-09: Edited to match polygon._
- **`lpn_area_hint_lasso_start`**
  > Click to start the outline.
  _Ruled OK 2026-09-09._
- **`lpn_area_hint_polygon_go`**
  > Click each corner. Double-click the last one to finish.
  _Ruled OK 2026-09-09._
- **`lpn_area_hint_polygon_start`**
  > Click to draw the polygon area. Double-click to finish.
  _Ruled OK 2026-09-09._
- **`lpn_area_hint_shift`**
  > Hold Shift while selecting to continue with the existing selection, adding or removing (toggle) what you select.
  _Ruled 2026-09-09: I edited this._
- **`lpn_area_hint_show`**
  > Show this
  _Ruled OK 2026-09-09._
- **`lpn_area_hint_touch_go`**
  > Drag around what you want, then lift to finish.
  _Ruled OK 2026-09-09._
- **`lpn_area_hint_touch_start`**
  > Press on the map and drag around what you want, then lift.
  _Ruled OK 2026-09-09._
- **`lpn_area_hint_window_go`**
  > Click the opposite corner to finish.
  _Ruled OK 2026-09-09._
- **`lpn_area_hint_window_start`**
  > Click one corner of the window.
  _Ruled OK 2026-09-09._
- **`lpn_area_none`**
  > Nothing found in that area.
  _Ruled OK 2026-09-09._
- **`lpn_area_selected`**
  > {n} selected.
  _Ruled OK 2026-09-09._
- **`lpn_engine_needed_failed`**
  > The EPANET solver has not yet been loaded, cannot be loaded, and this network can only be solved by it. It will be loaded when you are connected to the internet.
  _Ruled 2026-09-07: There is that "and" construction again that is not best for an engineering software. I edited it._
- **`lpn_engine_needed_loading`**
  > Loading EPANET solver while you build. Results will be available when completely loaded.
  _Ruled 2026-09-06: Tom's own sentence, written by him in the instruction that commissioned the feature: "we show a banner 'Loading EPANET solver while you build. Results will be available when completely loaded.' while it fetches". Recorded because the words are his, not because anybody approved ours._
- **`lpn_field_fittings`**
  > Fittings list
  _Ruled OK 2026-09-09._
- **`lpn_field_fittings_tip`**
  > A list of fittings from the project library. Its quantities and coefficients are added up into this pipe’s minor loss coefficient, and the coefficient box is then read only. Leave this unselected to type the coefficient yourself.
  _Ruled OK 2026-09-09._
- **`lpn_field_pipetype`**
  > Pipe type
  _Ruled OK 2026-09-07._
- **`lpn_field_pipetype_tip`**
  > The pipe type in the project library that this pipe uses. Properties included in the pipe type are disabled for editing here. Detach the pipe type to enable editing here.
  _Ruled OK 2026-09-07._
- **`lpn_find_filter_btn`**
  > Filter in current table
  _Ruled OK 2026-09-07._
- **`lpn_find_filter_table`**
  > Table to filter
  _Ruled OK 2026-09-07._
- **`lpn_find_filter_tip`**
  > Show only the parts that match this query in one of the tables below the map. The drawing is not changed and nothing is deleted.
  _Ruled OK 2026-09-07._
- **`lpn_fitting_add`**
  > Add a fitting
  _Ruled OK 2026-09-09._
- **`lpn_fitting_angle`**
  > Angle valve, fully open
  _Ruled OK 2026-09-09._
- **`lpn_fitting_elbow_45`**
  > 45 degree elbow
  _Ruled OK 2026-09-09._
- **`lpn_fitting_elbow_long`**
  > Long radius elbow
  _Ruled OK 2026-09-09._
- **`lpn_fitting_elbow_medium`**
  > Medium radius elbow
  _Ruled OK 2026-09-09._
- **`lpn_fitting_elbow_short`**
  > Short radius elbow
  _Ruled OK 2026-09-09._
- **`lpn_fitting_entrance`**
  > Square entrance
  _Ruled OK 2026-09-09._
- **`lpn_fitting_exit`**
  > Exit
  _Ruled OK 2026-09-09._
- **`lpn_fitting_gate`**
  > Gate valve, fully open
  _Ruled OK 2026-09-09._
- **`lpn_fitting_globe`**
  > Globe valve, fully open
  _Ruled OK 2026-09-09._
- **`lpn_fitting_k`**
  > Coefficient
  _Ruled OK 2026-09-09._
- **`lpn_fitting_name`**
  > Fitting
  _Ruled OK 2026-09-09._
- **`lpn_fitting_other`**
  > Other fitting
  _Ruled OK 2026-09-09._
- **`lpn_fitting_qty`**
  > Quantity
  _Ruled OK 2026-09-09._
- **`lpn_fitting_remove`**
  > Remove
  _Ruled OK 2026-09-09._
- **`lpn_fitting_return_bend`**
  > Closed return bend
  _Ruled OK 2026-09-09._
- **`lpn_fitting_swingcheck`**
  > Swing check valve, fully open
  _Ruled OK 2026-09-09._
- **`lpn_fitting_tee_branch`**
  > Standard tee, flow through branch
  _Ruled OK 2026-09-09._
- **`lpn_fitting_tee_run`**
  > Standard tee, flow through run
  _Ruled OK 2026-09-09._
- **`lpn_fitting_total`**
  > Total minor (local) loss coefficient, k
  _Ruled OK 2026-09-09._
- **`lpn_fittings_none`**
  > No fittings list selected
  _Ruled OK 2026-09-09._
- **`lpn_georef_tab_locked`**
  > Finish the placement with the "Keep this placement" button, or press Cancel, before you switch projects. The placement belongs to this project and cannot follow you to another one.
  _Ruled OK 2026-09-09._
- **`lpn_help_not_epanet`**
  > Not EPANET
  _Ruled OK 2026-09-07._
- **`lpn_help_screenshots`**
  > Screenshot gallery
  _Ruled OK 2026-09-07._
- **`lpn_hide_titles`**
  > Hide these titles
  _Ruled OK 2026-09-09._
- **`lpn_inp_export_flat_fittings`**
  > An EPANET file cannot hold the list of elbows, valves and tees in your project file. The minor loss coefficient of {n} pipes here is added up from a fittings list. The total goes into the file exactly as it stands, so nothing about the answers changes.
  _Ruled OK 2026-09-09._
- **`lpn_inp_export_flat_heading`**
  > Saved {file}
  _Ruled OK 2026-09-09._
- **`lpn_inp_export_flat_lead`**
  > The exported EPANET file is numerically equivalent to this project. But it has no place for the following things:
  _Ruled OK 2026-09-09._
- **`lpn_inp_export_flat_types`**
  > {n} pipes here refer to {t} pipe types. In the file each of those pipes carries its own copy of the numbers, so the answers are the same. What the file cannot hold is the pipe type itself, so editing one definition and having every pipe follow is something only your own project file records.
  _Ruled OK 2026-09-09._
- **`lpn_library_fittings`**
  > Fittings
  _Ruled OK 2026-09-09._
- **`lpn_library_fittings_add`**
  > Add a fittings list
  _Ruled OK 2026-09-09._
- **`lpn_library_fittings_in_use`**
  > This fittings list is used by {count} pipes: {ids}. Detach it from them before deleting it.
  _Ruled OK 2026-09-09._
- **`lpn_library_fittings_note`**
  > Each project has its own fittings library. A fittings list has fittings with a quantity for each one, and it adds up to a single minor loss coefficient. Both pipes and pipe types may refer to a list.
  _Ruled OK 2026-09-09._
- **`lpn_library_fittings_source`**
  > The fittings offered here are the thirteen in Table 3.3 of the EPANET 2.2 user manual. Choosing one copies its coefficient into the row, where you can change it. A coefficient depends on the size and the make of the fitting, so treat the table as a starting point rather than as an answer.
  _Ruled OK 2026-09-09._
- **`lpn_library_fittings_tip`**
  > A fittings list is a set of fittings and their quantities that several pipes can refer to. It adds up to one minor loss coefficient.
  _Ruled OK 2026-09-09._
- **`lpn_library_fittings_unused`**
  > Nothing uses this fittings list.
  _Ruled OK 2026-09-09._
- **`lpn_library_fittings_used_by`**
  > Pipes using this fittings list
  _Ruled OK 2026-09-09._
- **`lpn_library_pipetype_add`**
  > Add a pipe type
  _Ruled OK 2026-09-07._
- **`lpn_library_pipetype_blank_tip`**
  > Blank properties in a pipe type definition are left to be entered individually for each pipe.
  _Ruled OK 2026-09-07._
- **`lpn_library_pipetype_in_use`**
  > This pipe type is used by {count} pipes: {ids}. Detach it from them before deleting it.
  _Ruled OK 2026-09-07._
- **`lpn_library_pipetype_unused`**
  > Nothing uses this pipe type.
  _Ruled OK 2026-09-07._
- **`lpn_library_pipetype_used_by`**
  > Pipes using this type
  _Ruled OK 2026-09-07._
- **`lpn_library_pipetypes`**
  > Pipe types
  _Ruled OK 2026-09-07._
- **`lpn_library_pipetypes_note`**
  > Each project has its own pipe type library. You may leave properties blank in a pipe type definition. For example, a pipe type that specifies a roughness and no diameter is okay. You attach pipe types to pipes in their properties editor. Editing a definition here changes every pipe that references it.
  _Ruled 2026-09-07: Please note the drastically different style here than what you have been using._
- **`lpn_library_pipetypes_tip`**
  > A pipe type is a definition several pipes can refer to for their diameter, roughness and reaction coefficients. Editing the definition edits every pipe that uses it.
  _Ruled OK 2026-09-07._
- **`lpn_multi_applied`**
  > Set {prop} on {n}.
  _Ruled OK 2026-09-09._
- **`lpn_multi_no_fields`**
  > These have nothing that can be set together here.
  _Ruled OK 2026-09-09._
- **`lpn_multi_title`**
  > {n} selected
  _Ruled OK 2026-09-09._
- **`lpn_multi_varies`**
  > Various
  _Ruled OK 2026-09-09._
- **`lpn_pane_filter_clear`**
  > Show all
  _Ruled OK 2026-09-07._
- **`lpn_pane_filter_none`**
  > Nothing in this table matches the filter.
  _Ruled OK 2026-09-07._
- **`lpn_pane_filter_note`**
  > Filtered by {q}. Showing {n} of {all}.
  _Ruled OK 2026-09-07._
- **`lpn_pane_paste_note`**
  > This table is meant for entering values by pasting from a spreadsheet into rows that already exist. If it does not meet your needs, use Help, Fix something to tell us.
  _Ruled OK 2026-09-09._
- **`lpn_pane_pasted`**
  > Pasted {n} cells. {skipped} were not changed.
  _Ruled OK 2026-09-09._
- **`lpn_pipetype_detach`**
  > Detach from pipe type
  _Ruled OK 2026-09-07._
- **`lpn_pipetype_detach_tip`**
  > Copies the values this pipe reads from its type into the pipe itself and stops using the type. The pipe’s values don’t change now, and from now on you can edit these values here.
  _Ruled OK 2026-09-09._
- **`lpn_pipetype_none`**
  > No pipe type selected
  _Ruled OK 2026-09-07._
- **`lpn_settings_area_hint`**
  > Show the selection help
  _Ruled OK 2026-09-09._
- **`lpn_settings_area_hint_tip`**
  > Shows the bubble over the map that says what your next click will do while you are selecting an area.
  _Ruled OK 2026-09-09._
- **`lpn_tool_area_lasso`**
  > Select a lasso
  _Ruled OK 2026-09-09._
- **`lpn_tool_area_polygon`**
  > Select a polygon
  _Ruled OK 2026-09-09._
- **`lpn_tool_area_tip`**
  > Click on the map as instructed to select everything inside the shape. Press this button again to change the shape between a window, a lasso and a polygon. Hold Shift while selecting to continue with the existing selection, adding or removing (toggle) what you select.
  _Ruled OK 2026-09-09._
- **`lpn_tool_area_window`**
  > Select a window
  _Ruled OK 2026-09-09._
- **`lpn_tool_key_hint`**
  > Shortcut: press {key}.
  _Ruled OK 2026-09-07._
