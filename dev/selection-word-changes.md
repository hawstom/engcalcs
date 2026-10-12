# Selection word: English changes (Task 759)

Tom, 2026-10-11: *"759 map selection is "Select/Selected/Selection" with "Highlight" approved for
specific uses such as "the selected objects are highlighted". And menu and dialog options
choices/choose/chosen (never "selected")."*

English only (`lib/lang.ec.en.php` and the matching JS fallbacks). The 26 translated files carry the
change in a later sprint. No key was renamed, added or deleted.

## Changed

| Key | Sense | Old | New |
|---|---|---|---|
| `mpf_solver_no_solution` | unit pull-down | in selected units | in chosen units |
| `bpn_roughness_tip` | friction method pull-down | for the selected friction method | for the chosen friction method |
| `lpn_guide_text_hotkeys_popup` | row in a dialog list | Selecting a row shows where that control is | Choosing a row shows where that control is |
| `lpn_guide_find_results_def` | visual marking of a found item | the asset is marked and the selection is not changed | the asset is highlighted and the selection is not changed |
| `lpn_wrong_tip` | dialog option | a box to select the problem | a box to choose the problem |
| `lpn_fb_sends` | dialog option | what you picked or typed | what you chose or typed |
| `lpn_color_criterion_note` | method pull-down | while this method is selected | while this method is chosen |
| `lpn_change_type_no_curve` | curve pull-down | until one is selected | until one is chosen |
| `lpn_inp_drop_gpv_curve` | curve pull-down | until a curve is selected | until a curve is chosen |
| `lpn_curve_none` | pull-down empty entry | No curve selected | No curve chosen |
| `lpn_pipetype_none` | pull-down empty entry | No pipe type selected | No pipe type chosen |
| `lpn_fittings_none` | pull-down empty entry | No fittings list selected | No fittings list chosen |
| `lpn_pump_effic_global` | curve pull-down | has no efficiency curve selected | has no efficiency curve chosen |
| `lpn_field_fittings_tip` | pull-down | Leave this unselected to enter the coefficient yourself. | Leave no list chosen to enter the coefficient yourself. |
| `lpn_labels_customer_note` | checkbox set in Settings | the values selected here | the values chosen here |
| `lpn_file_saveas_tip_download` | browser file dialog | the original file can be picked and overwritten | the original file can be chosen and overwritten |
| `lpn_profile_choose` | node on the map | Choose a start node and an end node. | Select a start node and an end node. |
| `lpn_profile_draw_blocked` | node on the map | Choose another node. | Select another node. |
| `lpn_profile_say_idle` | path on the map | to choose a new path on the map | to select a new path on the map |
| `lpn_profile_none` | path on the map | to choose one on the map | to select one on the map |
| `lpn_ds_intro` | a button | Select the Run button / Select the Find button | Press the Run button / Press the Find button |
| `lpn_backdrop_position_prompt2` | a button | then select Continue | then press Continue |
| `lpn_color_legend_open_tip` | clicking the legend | Select to open the coloring settings | Press to open the coloring settings |

The last three are neither the map selection nor a menu choice: they press a control. "Press" is the
page's existing verb for a button ("press Delete", "Press Profile again"), so *select* is kept for
the map set alone.

`selection_word_check.php` now also refuses *selected* as the state of a list ("No curve selected"),
and its two profile baseline entries are gone because those strings now comply.

## Left alone, and why

- **Single checkboxes (settled 2026-10-12: Tom said yes to "Checked")**, now "Checked: ... Cleared: ..." or "Check to ...; clear to ...":
  `ip_is_lateral`, `lpn_contour_show_tip`, `lpn_labels_use_units_tip`, `lpn_scenario_override_tip`,
  `lpn_scenario_basic_tip`. A lone checkbox is ticked, not chosen from a set; "Chosen: this reach
  is ..." reads badly. The natural replacement is *Checked / Check*, a word outside the call. For Tom.
- **Table selection** (rows, columns and cells in the Tables pane or a spreadsheet):
  `lpn_notes_6_def`, `lpn_notes_7_def`, `lpn_pane_paste_here`, `lpn_pane_fill_none`,
  `lpn_library_curve_values_tip`, `lpn_find_count` ("Select one to go to it"), and the row sentences
  in `lpn_guide_find_results_def`. Rows picked in a table are the selection, which the earlier
  interview already put on the select side.
- **Pointing at a point, not an asset**: `lpn_georef_detach` ("Pick it up again"),
  `lpn_georef_twopt_same` ("the point you picked first"), `lpn_backdrop_scale` ("Scale by picking"),
  `lpn_backdrop_scale_from` ("a point you pick"). A location, not the selection set; the page's verb
  for a location is *specify*. Lowest priority in Ida's audit.
- **`lpn_guide_keys_def`** "Open the guide with the current selection in the search field": the
  text selected on the page, which is a selection; left as is.
- **`lpn_ds_intro`** "the chosen junctions": the scope radio (All or Selected) decides the set, so
  *chosen* is right.
- **`lpn_ds_outside_below`** "junctions not selected": the map set.
