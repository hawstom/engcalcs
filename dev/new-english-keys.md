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

**17 still to read on master**, of 261 untranslated keys, of 2879 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (5 to read @@ NEEDS RULING)

**These are SHIPPED strings, already translated into 26 languages.** A wave-0
reading or a translator found each one readable two ways, and no sprint launches while one is
unanswered. You are not being asked to approve wording here; you are being asked which reading
is the one you meant. "The first one" is a complete answer.

### from sprint 1003-ds

- **`lpn_ds_found_below`**
  > ⚠ The demands as entered (a demand scale of 1) leave at least one junction below {pressure}. The largest demand scale that keeps every junction at {pressure} or above is {m}.
  *The finding:* Tom: 'I think I need explanation, and this need clarification.' It appears after Find when the demands as entered (a demand scale of 1) leave at least one junction below the limit; {m} is the largest scale, always under 1, at which every judged junction keeps the limit (0.62 means demands cut to 62 percent). 'it' in 'keeps it' is vague, 'demands as they are' never says scale 1, and {m} reads as headroom when it is a cut.
  1. the system can take up to {m} times today's demand (wrong)
  2. demands must be cut to {m} times what is entered for every junction to keep the pressure (right)
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED A: '⚠ At least one junction is below {pressure} at the demands as entered (a demand scale of 1). All junctions keep {pressure} only if demands are cut to a demand scale of {m} or less.' PROPOSED B: '⚠ The demands as entered (a demand scale of 1) leave at least one junction below {pressure}. The largest demand scale that keeps every junction at {pressure} or above is {m}.' B paralle...
  _Ruled 2026-10-16: B_

### from sprint 1008c-wave0

- **`lpn_export_table_current`**
  > Current
  *The finding:* 'Current' is a radio option under both Tables and Scenarios (js/looped-network.js:29716-29720). In a hydraulics tool a translator can read it as electric or water current, or as 'present time', rather than 'the one now selected'. 'All' pairs with it.
  1. the table or scenario now selected
  2. current, as flow of water or electricity
  3. up to date, not out of date
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED syn: 'Current' (this radio, under Tables and Scenarios) means the one now selected, as opposed to All; it is never a flow or electric current. Alternative English: 'Selected only' / 'All'.
  _Ruled 2026-10-16: syn is deprecated, so I am confused._
- **`lpn_file_export_workspace_tip`**
  > Download a small file holding where your boxes sit, their sizes, which are open or docked, and your pane and column sizes, plus the display options of this page, such as which help bubbles and the hover card are shown. Your projects, project settings and cookies (language, consent, units) are not in it. Load it on another screen or browser with File, Import, Workspace.
  *The finding:* 'the reading preferences of this page' is unexplained jargon: a translator cannot tell whether it means language, text size, or display toggles such as the run box, the area hint and the hover card. Same phrase in lpn_file_import_workspace_tip.
  1. language or font settings for reading text
  2. display toggles the visitor set, such as whether help bubbles and the hover card are shown
  **What this asks for:** a WORDING ruling -- is the English above right, or say what it should say.
  *The proposal:* PROPOSED English (both keys): replace 'the reading preferences of this page' with 'the display options of this page, such as which help bubbles and the hover card are shown'.
  _Ruled 2026-10-16: OK._
- **`lpn_pane_copy_heads`**
  > Copy with column headings
  *The finding:* 'headings' does not say which: the column headings the table shows, or row and column headings. Right-click menu item in a Tables pane (js/looped-network.js:28892); paneCopyTsv adds one row, the column headings with unit.
  1. copy the selected cells with their column headings as a first row
  2. copy the selected cells with both row and column headings
  **What this asks for:** a WORDING ruling -- is the English above right, or say what it should say.
  *The proposal:* PROPOSED English: 'Copy with column headings'
  @@ NEEDS RULING
- **`lpn_settings_hover_card_tip`**
  > Rest the pointer on a node, link or customer to see its label as specified in Settings, at any scale, whether or not the label fits on the map. This is a setting for this browser, not for the project.
  *The finding:* 'at any scale, fit or not' leaves 'fit' with no subject: fit what? The setting makes the hover card show the label even when the on-map label was dropped for lack of room (js/looped-network.js:51225). 'fit' also collides with 'zoom to fit'.
  1. whether or not the label fits on the map at the current zoom
  2. whether or not the map is zoomed to fit the network
  **What this asks for:** a WORDING ruling -- is the English above right, or say what it should say.
  *The proposal:* PROPOSED English: 'Rest the pointer on a node, link or customer to see its label as specified in Settings, at any scale, whether or not the label fits on the map. This is a setting for this browser, not for the project.'
  _Ruled 2026-10-16: I've had second thoughts about this feature. I would, after all, like to have it say and act like this: 'Rest the pointer on a node, link or customer to see all of its properties formatted as specified in Settings, at any scale, whether or not the label fits on the map. This is a setting for this browser, not for the project.'_

## Plain sentences to check  (0, none are stale)

Every entry in `dev/plain-sentences.md` matches the English it was written against.

## lpn_  (261, 17 to read @@ NEEDS RULING)

- **`lpn_alt_cat_calculation`**
  > Calculation
  _Ruled OK 2026-10-16._
- **`lpn_alt_cat_presentation`**
  > Presentation
  _Ruled OK 2026-10-16._
- **`lpn_alt_cat_topology_tip`**
  > Asset activation
  _Ruled OK 2026-10-16._
- **`lpn_basemap_topo_show`**
  > Show topo map
  _Ruled OK 2026-10-16._
- **`lpn_change_type_line_alternative`**
  > {id}: {property} {value}, in alternative {alternative}
  _Ruled OK 2026-10-16._
- **`lpn_clean_map`**
  > Clean map
  _Ruled 2026-10-15: Approved._
- **`lpn_clean_map_tip`**
  > Checked: the zoom buttons, the street map and satellite button, the Messages button and the notices, the selection help, the feedback button, and the override rings are hidden. Cleared: they are shown. Errors are still shown on the map, and every notice is still kept in Messages. This is a setting for this browser, not for the project.
  _Ruled 2026-10-16: Asked whether to lowercase "The" after "Checked:" like the other tips: "Yes. Make your proposed correction. Thank you for checking."_
- **`lpn_control_inactive_note`**
  > These controls refer to an asset that is inactive in this scenario, so they are ignored in its run: {ids}
  _Ruled OK 2026-10-16._
- **`lpn_copy_props_done`**
  > Copied properties of {id}.
  _Ruled OK 2026-10-16._
- **`lpn_copy_props_done_ov`**
  > Copied the overrides of {id} in this scenario.
  _Ruled OK 2026-10-16._
- **`lpn_copy_props_menu`**
  > Copy properties
  _Ruled OK 2026-10-16._
- **`lpn_copy_props_no_overrides`**
  > No overrides to copy.
  _Ruled 2026-10-13: Approved as written._
- **`lpn_ctx_edit_text`**
  > Edit text
  _Ruled OK 2026-10-16._
- **`lpn_ctx_reset_position`**
  > Reset position
  _Ruled OK 2026-10-16._
- **`lpn_ctx_reset_position_off_tip`**
  > Only a label or an attached Text that has been dragged from its own position can be reset.
  _Ruled OK 2026-10-16._
- **`lpn_customer_node_inactive`**
  > This customer is assigned to a junction that is inactive in this scenario, so its demand is not part of the solve.
  _Ruled OK 2026-10-16._
- **`lpn_field_type`**
  > Type
  _Ruled OK 2026-10-16._
- **`lpn_field_type_tip`**
  > The type of this asset in this scenario, set by Morph. Clear the override to use the parent scenario's type.
  _Ruled OK 2026-10-16._
- **`lpn_file_import_gjnet`**
  > Import GeoJSON network…
  _Ruled OK 2026-10-16._
- **`lpn_file_import_gjnet_tip`**
  > Open a GeoJSON file as a new project. Points are imported as junctions, reservoirs, or tanks, and lines as pipes. A file exported from this page is read as written; for any other file, one step maps its fields to properties and units.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_and_more`**
  > and {n} more
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_beta`**
  > Beta: feedback requested
  @@ NEEDS RULING
- **`lpn_gjnet_beta_tip`**
  > This import has been tried on few files from GIS programs. To report a problem or suggest a change, press {button} on the page and describe the file.
  @@ NEEDS RULING
- **`lpn_gjnet_col_example`**
  > Example
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_col_field`**
  > Field
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_col_fills`**
  > Fills
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_col_unit`**
  > Unit
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_intro`**
  > {points} points and {lines} lines were found. Points are imported as junctions, reservoirs, or tanks, and lines as pipes. Choose the property each field fills and the unit of each number.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_lines_heading`**
  > Line fields (pipes)
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_no_fields`**
  > These features have no attribute fields.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_crs`**
  > The file states the coordinate system {crs}, which is WGS 84 latitude and longitude, the system RFC 7946 requires. Positions were read as stated.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_crs_nad83`**
  > The file states NAD83 (EPSG:4269). Its positions were read as WGS 84, which places them within about 1 to 2 m of where NAD83 puts them.
  @@ NEEDS RULING
- **`lpn_gjnet_note_default_demand`**
  > These junctions state no base demand and have the default base demand, {value}.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_default_diameter`**
  > These pipes state no diameter and have the default diameter, {value}.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_default_elev`**
  > These nodes state no elevation and have the default elevation, {value}.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_default_elev_added`**
  > These junctions were added at line ends and have the default elevation, {value}, because no node in the file states an elevation.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_default_k`**
  > These pipes state no minor loss coefficient, so each has 0, as in an EPANET file that states none.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_default_roughness`**
  > These pipes state no roughness and have the default roughness, {value}.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_default_tank`**
  > These tanks have the default water depths and tank diameter.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_demand_kept`**
  > A reservoir or tank has no demand, so the demand stated on these nodes was kept as the custom property {key}.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_demand_rows`**
  > These junctions had more than one demand row. A GeoJSON file holds only the first, which was imported.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_elev_taken`**
  > These nodes state no elevation. Each was given the elevation of the node shown in parentheses: for a junction added at a line end, the node at the other end of its pipe, otherwise the nearest node that states one.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_end_moved`**
  > These pipes have an end within {tol} of a point or another line end, but not on it. The end was joined to it; the largest distance is {dist}.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_end_off_node`**
  > The line of each of these links does not start or end at its node. The node position was used.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_end_on_pipe`**
  > These line ends lie on the pipe shown in parentheses, but not at its end, and are not connected to it.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_field_custom`**
  > These fields were imported as custom properties.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_field_skipped`**
  > These fields were not imported, as chosen.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_id_dup`**
  > These IDs are stated by more than one feature of the same kind. Each later feature was assigned the ID shown in parentheses.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_id_new`**
  > These features state no valid ID and were assigned the ID shown in parentheses.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_junction_added`**
  > These junctions were added where a line end is not within {tol} of a point. Each has the default base demand.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_length_auto`**
  > These pipes state no length. Each length is computed from the line (Auto).
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_not_held`**
  > A GeoJSON file does not hold controls, rules, time settings, text labels, EPANET options, or the pipe type, fittings, and efficiency curve libraries, so none of these was imported.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_parts`**
  > These multipart lines have parts that are not connected and were imported as one pipe for each part.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_parts_points`**
  > These multipoint features were imported as one node for each point.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_pattern_conflict`**
  > These patterns are stated with different multipliers on different features. The first was used.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_pipe_type`**
  > These pipes state the pipe type shown in parentheses, whose definition a GeoJSON file does not hold. The pipe type was not imported; the diameter and roughness stated in the file were.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_results`**
  > The results in the file were not imported. Calculate computes them again.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_skip_geometry`**
  > Not imported: the feature is not a point or a line.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_skip_id`**
  > Not imported: the name is not a valid ID, or another element of the same kind has it.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_skip_kind`**
  > Not imported: the feature states no node_type or link_type.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_skip_loop`**
  > Not imported: both ends of the line join the same node.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_skip_no_node`**
  > Not imported: the start or end node named is not in the file.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_skip_position`**
  > Not imported: a position is not a valid latitude and longitude.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_skip_short`**
  > Not imported: a line needs at least two positions.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_unmapped_demand`**
  > No field was chosen for the base demand, so every junction has the default base demand, {value}.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_unmapped_diameter`**
  > No field was chosen for the diameter, so every pipe has the default diameter, {value}.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_unmapped_elev`**
  > No field was chosen for the elevation, so every node has the default elevation, {value}, and automatic lengths include no elevation difference.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_unmapped_id_line`**
  > No field was chosen for the line ID, so every pipe was assigned an ID.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_unmapped_id_point`**
  > No field was chosen for the point ID, so every node imported from a point was assigned an ID.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_unmapped_k`**
  > No field was chosen for the minor loss coefficient, so every pipe has 0, as in an EPANET file that states none.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_unmapped_length`**
  > No field was chosen for the length, so every pipe length is computed from the line (Auto).
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_unmapped_roughness`**
  > No field was chosen for the roughness, so every pipe has the default roughness, {value}.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_value_unread`**
  > These values are not numbers or are not recognized, and were not used.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_note_z`**
  > These points state a third coordinate, which was not imported.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_other`**
  > {n} features are neither points nor lines and will not be imported; the report lists them.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_points_heading`**
  > Point fields (junctions, reservoirs, and tanks)
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_refuse_crs`**
  > {file} states the coordinate system {crs}. GeoJSON positions are WGS 84 latitude and longitude (RFC 7946), and this page does not convert a GeoJSON file from another system. Export the layer from the GIS in EPSG:4326 (WGS 84), then import that file.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_refuse_empty`**
  > {file} contains no points or lines.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_report_lead`**
  > Each change made during import, and each feature not imported, is listed below with the reason:
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_target_custom`**
  > Custom property
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_target_node_type`**
  > Node type
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_target_skip`**
  > Do not import
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_title`**
  > Import GeoJSON network: {file}
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_tolerance`**
  > Join tolerance (m)
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_tolerance_tip`**
  > A line end within this distance of a point, or of another line end, is joined to it. A line end farther than this from every point gets a new junction.
  _Ruled OK 2026-10-16._
- **`lpn_gjnet_working`**
  > Importing {file}…
  _Ruled OK 2026-10-16._
- **`lpn_inp_export_flat_customers_inactive`**
  > {n} of these customers are assigned to a junction that is inactive in this scenario, so their demand is not in the file.
  _Ruled OK 2026-10-16._
- **`lpn_inp_export_flat_inactive_controls`**
  > These controls and rules refer to an asset that is inactive in this scenario, so they are not in the file: {ids}
  _Ruled OK 2026-10-16._
- **`lpn_library_pattern_axis_step`**
  > Step
  _Ruled OK 2026-10-16._
- **`lpn_library_pattern_default_deleted_also`**
  > Scenarios that also used it as their default: {list}.
  _Ruled OK 2026-10-16._
- **`lpn_library_pattern_default_deleted_in`**
  > Pattern {id} was the default demand pattern in these scenarios: {list}.
  _Ruled OK 2026-10-16._
- **`lpn_morph_other_kind`**
  > A node can be morphed only into another type of node, and a link only into another type of link. Not morphed: {ids}
  _Ruled OK 2026-10-16._
- **`lpn_ovl_bubble_moved`**
  > {quantity}, moved or resized
  _Ruled OK 2026-10-16._
- **`lpn_ovl_bubble_off`**
  > Not on the map
  _Ruled OK 2026-10-16._
- **`lpn_ovl_clear_all`**
  > Clear all overrides
  _Ruled OK 2026-10-16._
- **`lpn_ovl_clear_all_ask`**
  > Clear all the overrides ({n}) of {name}? Each value returns to the inherited value. Undo reverses this.
  _Ruled OK 2026-10-16._
- **`lpn_ovl_clear_selected`**
  > Clear selected overrides
  _Ruled OK 2026-10-16._
- **`lpn_ovl_col_inherited`**
  > Inherited value
  _Ruled OK 2026-10-16._
- **`lpn_ovl_col_inherited_tip`**
  > The value this scenario reads without the override: the value of the parent of the alternative, or the Base value.
  _Ruled OK 2026-10-16._
- **`lpn_ovl_col_override`**
  > Override
  _Ruled OK 2026-10-16._
- **`lpn_ovl_group`**
  > {category}: {alternative}
  _Ruled OK 2026-10-16._
- **`lpn_ovl_note`**
  > These are the values this scenario sets itself in the alternatives it uses, each with the value it replaces. Values it inherits are neither listed nor counted. Clear an override to restore the inherited value; Undo reverses it. Select an ID to go to the asset on the map.
  _Ruled OK 2026-10-16._
- **`lpn_ovl_pick_tip`**
  > Select this override for the Clear selected overrides button.
  _Ruled OK 2026-10-16._
- **`lpn_ovl_same`**
  > (same)
  _Ruled OK 2026-10-16._
- **`lpn_ovl_same_tip`**
  > Equal to the inherited value. It is still an override, and it is counted.
  _Ruled OK 2026-10-16._
- **`lpn_ovl_title`**
  > Override manager: {name}
  @@ NEEDS RULING
- **`lpn_ovm_child_ask`**
  > Clear child overrides ({n} total)?
  _Ruled OK 2026-10-16._
- **`lpn_ovm_child_tip`**
  > Child scenarios override this value ({n} total). Click to clear their overrides.
  _Ruled 2026-10-13: Approved as written._
- **`lpn_ovm_dot_clear`**
  > Click to clear it.
  _Ruled 2026-10-13: Approved as written._
- **`lpn_ovm_dot_set`**
  > Inherited. Click to make it an override in this scenario, holding the value shown.
  _Ruled 2026-10-13: Approved as written._
- **`lpn_pane_inactive_show`**
  > Include inactive topology
  _Ruled OK 2026-10-16._
- **`lpn_pane_scn_cur_only`**
  > Current scenario only
  _Ruled OK 2026-10-16._
- **`lpn_pane_scn_filter_note`**
  > {filters}. Showing {n} of {all}.
  _Ruled OK 2026-10-16._
- **`lpn_pane_scn_ov_only`**
  > Overrides only
  _Ruled OK 2026-10-16._
- **`lpn_pane_tab_scenarios`**
  > Scenarios
  _Ruled OK 2026-10-16._
- **`lpn_paste_alt_created`**
  > Created {category} alternative {name} for this scenario.
  _Ruled OK 2026-10-16._
- **`lpn_paste_done_many`**
  > Pasted properties of {id} to {m} assets. Values changed: {n}.
  _Ruled OK 2026-10-16._
- **`lpn_paste_done_one`**
  > Pasted properties of {id} to {to}. Values changed: {n}.
  _Ruled OK 2026-10-16._
- **`lpn_paste_props_menu`**
  > Paste properties to selection
  _Ruled OK 2026-10-16._
- **`lpn_paste_props_off_kind`**
  > No selected asset can take the copied properties.
  _Ruled OK 2026-10-16._
- **`lpn_paste_props_off_none`**
  > Nothing is copied. Right-click or long press an asset and choose Copy properties.
  _Ruled OK 2026-10-16._
- **`lpn_paste_props_off_select`**
  > Select the assets to paste to, then choose Paste properties to selection.
  _Ruled OK 2026-10-16._
- **`lpn_paste_skip_breakdown`**
  > Not pasted: {n} (demand is a list of categories).
  _Ruled OK 2026-10-16._
- **`lpn_paste_skip_valve`**
  > Not pasted: {n} (the valve types differ).
  _Ruled OK 2026-10-16._
- **`lpn_rule_inactive_note`**
  > These rules refer to an asset that is inactive in this scenario, so they are ignored in its run: {ids}
  _Ruled OK 2026-10-16._
- **`lpn_scenario_basic_misfit`**
  > This project has scenarios and alternatives relationships that are not compatible with Scenarios Basic mode, so Basic mode is disabled.
  _Ruled OK 2026-10-13._
- **`lpn_scenario_basic_misfit_base`**
  > The Base scenario uses an alternative other than Base.
  _Ruled OK 2026-10-16._
- **`lpn_scenario_copy`**
  > Copy scenario
  _Ruled OK 2026-10-13._
- **`lpn_scenario_copy_off`**
  > Copy scenario works in Basic mode. With Basic mode off, add a scenario and choose its alternatives in the Scenarios table.
  _Ruled OK 2026-10-13._
- **`lpn_scenario_copy_tip`**
  > Copies the open scenario and its overrides, and opens the copy.
  _Ruled OK 2026-10-13._
- **`lpn_scenario_delete_ask`**
  > Delete the scenario {name}? The drawing itself is not changed.
  _Ruled OK 2026-10-16._
- **`lpn_scenario_delete_goes`**
  > Its overrides ({n}) are deleted with it.
  _Ruled OK 2026-10-16._
- **`lpn_scenario_delete_has_children`**
  > The scenario {name} cannot be deleted because it has children: {list}. Delete those first, or move them to another parent.
  _Ruled 2026-10-17: His call: "I would rather say 'has children' if that is precise." (it is)_
- **`lpn_scenario_delete_stays`**
  > These alternatives it uses stay in the project: {list}.
  _Ruled 2026-10-13: Approved as written._
- **`lpn_scenario_mark_inh_tip`**
  > The dashed gray ring means the scenario {name} inherits an override for this asset from its parent scenario or alternative.
  _Ruled OK 2026-10-16._
- **`lpn_scncmp_none_checked`**
  > No scenario is checked for comparison. Check scenarios in the Scenario manager.
  _Ruled OK 2026-10-16._
- **`lpn_settings_held_base`**
  > {base}: {value}
  _Ruled OK 2026-10-16._
- **`lpn_settings_held_in`**
  > Override in {scenario}.
  _Ruled OK 2026-10-16._
- **`lpn_settings_override_marks`**
  > Show override markers on the map
  _Ruled 2026-10-15: Approved._
- **`lpn_settings_override_marks_tip`**
  > Show the amber ring on an asset with an override in the open scenario, and the dashed gray ring on an asset that inherits one. The Tables pane marks overrides either way. Map, Clean map hides the rings while it is checked. This is a setting for this browser, not for the project.
  _Ruled 2026-10-16: I approve all three._
- **`lpn_settings_restore_base_only`**
  > Switch to Base to restore the defaults.
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_basemap`**
  > Basemap
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_basemap_last`**
  > Basemap to return to
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_basemap_osm`**
  > Street map
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_basemap_satellite`**
  > Satellite images
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_basemap_topo`**
  > Topo map
  @@ NEEDS RULING
- **`lpn_settings_row_bubbles`**
  > Time series graphs on the map
  _Ruled 2026-10-15: Approved._
- **`lpn_settings_row_check_freq`**
  > Status check frequency
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_contour_buffer`**
  > Contour buffer
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_contour_fill`**
  > Contour fill
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_contour_interval`**
  > Contour interval
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_contour_labels`**
  > Contour labels
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_contour_opacity`**
  > Contour fill opacity
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_contour_terrain`**
  > Contour ground between nodes from Mapbox DEM
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_customer_max_width`**
  > Show customer labels when zoomed to this map width or less
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_default`**
  > {value} (default)
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_elev_source_old`**
  > Elevation source (older projects)
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_emitter_exponent_old`**
  > Emitter exponent (older projects)
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_id_prefix`**
  > ID prefix
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_label_after`**
  > Text after
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_label_before`**
  > Text before
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_label_drop`**
  > Drop order
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_label_on`**
  > Is active
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_label_show`**
  > Show order
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_labels_customer`**
  > Customer labels
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_labels_field`**
  > {labels}: {field}
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_labels_part`**
  > {labels}: {field}, {part}
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_max_check`**
  > Maximum status checks
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_new_asset`**
  > New assets: {setting}
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_of`**
  > {setting}, {member}
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_pda_src`**
  > Pressure driven options stated in the file
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_quality_option`**
  > Quality option as the file states it
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_quality_step`**
  > Quality time step
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_status_report`**
  > Status report
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_symbol_cap_multiple`**
  > Largest symbol, as a multiple of a typical pipe length
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_symbol_cap_percentile`**
  > Typical pipe length, as a percentile of all pipe lengths
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_tolerance`**
  > Accuracy (older projects)
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_view`**
  > Map view (center and scale)
  _Ruled OK 2026-10-16._
- **`lpn_settings_row_view_value`**
  > Center {x}, {y}; scale {s}
  _Ruled OK 2026-10-16._
- **`lpn_settings_table_category`**
  > Category
  _Ruled OK 2026-10-16._
- **`lpn_settings_table_major`**
  > Major heading
  _Ruled OK 2026-10-16._
- **`lpn_settings_table_minor`**
  > Minor heading
  _Ruled OK 2026-10-16._
- **`lpn_settings_table_no`**
  > No
  _Ruled OK 2026-10-16._
- **`lpn_settings_table_owner`**
  > Owner
  _Ruled OK 2026-10-16._
- **`lpn_settings_table_setting`**
  > Setting
  _Ruled OK 2026-10-16._
- **`lpn_settings_table_yes`**
  > Yes
  _Ruled OK 2026-10-16._
- **`lpn_settings_theme`**
  > Theme
  @@ NEEDS RULING
- **`lpn_settings_theme_tip`**
  > Choose light or dark colors for the page. System follows the setting of your device. The map drawing looks the same in every theme. This is a setting for this browser, not for the project.
  @@ NEEDS RULING
- **`lpn_settings_units_one_project`**
  > Units are the same in every scenario.
  _Ruled OK 2026-10-16._
- **`lpn_settings_view_bottom_right`**
  > Bottom right corner
  _Ruled OK 2026-10-16._
- **`lpn_settings_view_center`**
  > Map center
  _Ruled OK 2026-10-16._
- **`lpn_settings_view_save`**
  > Save this view in this scenario
  _Ruled OK 2026-10-16._
- **`lpn_settings_view_save_tip`**
  > Stores this map center and scale in the open scenario, so opening that scenario moves the map here. Moving the map afterward changes nothing until you press this again. Clear the override to follow the {base} view again.
  _Ruled OK 2026-10-16._
- **`lpn_settings_view_scale`**
  > Map scale
  _Ruled OK 2026-10-16._
- **`lpn_settings_view_scale_tip`**
  > The scale at the center of the map, as 1:N. Type 1:2000, or just 2000, to zoom to that scale.
  _Ruled OK 2026-10-16._
- **`lpn_settings_view_top_left`**
  > Top left corner
  _Ruled OK 2026-10-16._
- **`lpn_sm_add_base`**
  > Add base
  _Ruled OK 2026-10-16._
- **`lpn_sm_add_base_alt_tip`**
  > Add another Base alternative. It starts as a copy of Base's values in this category, and later edits to Base do not change it.
  _Ruled OK 2026-10-16._
- **`lpn_sm_add_base_tip`**
  > Add another Base scenario. It starts as a copy of Base, with its own alternatives, and later edits to Base do not change it.
  _Ruled OK 2026-10-16._
- **`lpn_sm_add_child`**
  > Add child
  _Ruled OK 2026-10-16._
- **`lpn_sm_all_row_tip`**
  > Double-click to open it in its category tree.
  _Ruled 2026-10-16: I approve all three._
- **`lpn_sm_alt_delete_has_children`**
  > The alternative {name} cannot be deleted because it has children: {list}. Delete those first, or move them to another parent.
  _Ruled 2026-10-17: His call: "I would rather say 'has children' if that is precise." (it is)_
- **`lpn_sm_base_kept`**
  > The Base of a tree is not deleted. Another Base added with Add base is deleted when nothing uses it.
  _Ruled OK 2026-10-16._
- **`lpn_sm_base_named`**
  > The Base of a tree is not renamed.
  _Ruled OK 2026-10-16._
- **`lpn_sm_basic_on`**
  > Scenario manager is disabled when Basic mode is on.
  _Ruled OK 2026-10-16._
- **`lpn_sm_col_parent`**
  > Parent
  _Ruled OK 2026-10-16._
- **`lpn_sm_compare_tip`**
  > Include in Scenario comparison
  _Ruled OK 2026-10-16._
- **`lpn_sm_copy`**
  > Copy
  _Ruled OK 2026-10-16._
- **`lpn_sm_copy_ask`**
  > Copy the overrides ({n}) of {name} up into {target}? It keeps them as its own overrides. You can undo this.
  @@ NEEDS RULING
- **`lpn_sm_copy_none`**
  > The alternative {name} has no overrides to copy.
  @@ NEEDS RULING
- **`lpn_sm_copy_pick`**
  > Copy the overrides of {name} into which alternative? Its parent is listed first.
  @@ NEEDS RULING
- **`lpn_sm_copy_skipped`**
  > {between} also overrides these values. It is skipped and not changed, so it keeps its own values for them:
  @@ NEEDS RULING
- **`lpn_sm_copy_up`**
  > Copy upward
  @@ NEEDS RULING
- **`lpn_sm_copy_up_root`**
  > A Base alternative has nothing above it to copy into.
  @@ NEEDS RULING
- **`lpn_sm_copy_up_tip`**
  > Copy the overrides of the selected alternative into an alternative above it in the tree. The selected alternative keeps its overrides.
  @@ NEEDS RULING
- **`lpn_sm_current_already`**
  > This scenario is already the current scenario.
  _Ruled OK 2026-10-16._
- **`lpn_sm_cycle`**
  > {name} cannot be moved under one of its own children.
  _Ruled OK 2026-10-16._
- **`lpn_sm_delete`**
  > Delete the selected item. A used item is not deleted.
  _Ruled OK 2026-10-16._
- **`lpn_sm_delete_alt_ask`**
  > Delete the alternative {name}?
  _Ruled OK 2026-10-16._
- **`lpn_sm_help`**
  > How scenarios and alternatives work:\n\nIn Basic mode, alternatives are hidden and automatic, and all new scenarios are children of the Base scenario.\n\nWith Basic mode off, a complex inheritance tree is available, and alternatives can be shared among scenarios. But the default behavior of edits when a new alternative association is needed (in the absence of proactive user management) is to create an alternative named like the current scenario, which gives each scenario its unique set of alternatives.\n\nProperties and settings belong to alternatives categories that appear as columns of the scenarios and alternatives table and as management options in Scenario manager.\n\nOverrides are created in scenarios, but they really belong to the respective alternatives associated with the scenario; so a scenario is like a window to its alternatives. Associations of alternatives to scenarios are managed in the right pane of the Scenario manager or in the Scenarios table in the bottom pane. Creating a new scenario creates no alternatives; the new scenario uses its parent's alternatives until overrides are created that need new alternatives. When overrides are created in a scenario, they are stored in their respective alternative for the scenario; if the scenario has no such alternative, a new alternative is created using the name of the scenario.\n\nExample: You create a "Figure: Node and link IDs" scenario and edit a Text to say "Node and Link IDs." When you create the scenario, no alternatives are created. But at the moment you save the Text, a Text alternative called "Figure: Node and link IDs" is created with the override for the Text value. In Basic mode, you see this as simply an override in the scenario itself.\n\nCopy properties copies only overrides. In any scenario other than Base, it copies only the overrides the asset has in that scenario.\n\nHow to manage scenarios:\n\n- Choose Scenarios or an alternatives category in the list at the top to show its tree.\n\n- Create a child of the selected item with Add child. Add base adds another Base, which starts as a copy of Base as it is now; later edits to Base do not change it. A new child is named after its parent; type a name to rename it. Copy copies the selected alternative. Merge upward moves the overrides of the selected alternative into an alternative above it, chosen by name, and the selected alternative then inherits them; it first names any value an alternative it skips also overrides, which is not changed. To copy a scenario, use Copy scenario in the Scenarios menu, in Basic mode; it copies the scenario's overrides, with the alternatives that hold them. Add base and Copy scenario each create alternatives: Add base creates a Base alternative for the new Base in each category that holds values, and Copy scenario creates a new alternative, named like the copy, for each alternative that holds the scenario's overrides.\n\n- Drag an item onto another to make it a child of that item. A scenario moved to a new parent inherits from it everything it has not overridden; what it has overridden does not change. Drag an item between two items to reorder them.\n\n- Click an item to select it. Press F2 or choose Rename to rename the selected item. Renaming a scenario asks whether to rename the alternatives that carry its name; in Basic mode they are renamed with it, without asking. Double-click a scenario or press Enter to make it current. Click the arrow beside an item or press Left or Right to collapse or expand it. Right-click an item for the same commands as the buttons.\n\n- Press Delete or click the minus button to delete the selected item. An item in use is not deleted, and the message names what uses it. Deleting a scenario with Basic mode off keeps the alternatives it uses. Deleting a scenario with Basic mode on also deletes each of its alternatives that no other scenario uses.\n\n- To make a scenario use another alternative, including Base, choose it in the scenario's row of the right pane of the Scenario manager or the Scenarios table. An override made in a shared alternative changes every scenario that uses it.
  _Ruled 2026-10-16: His own edit of 2026-10-16._
- **`lpn_sm_in_use`**
  > {item}\ncannot be deleted while it is used by\n{list}
  _Ruled OK 2026-10-16._
- **`lpn_sm_inherited`**
  > inherited
  _Ruled OK 2026-10-16._
- **`lpn_sm_item_alternative`**
  > Alternative {name}
  _Ruled OK 2026-10-16._
- **`lpn_sm_item_scenario`**
  > Scenario {name}
  _Ruled OK 2026-10-16._
- **`lpn_sm_list_overrides`**
  > Override manager…
  _Ruled 2026-10-17: Asked "Scenario manager…" / "Override manager…": "Yes. Proceed."_
- **`lpn_sm_list_overrides_none`**
  > This scenario has no overrides.
  _Ruled 2026-10-15: Revised. But should be obvious when count = 0._
- **`lpn_sm_list_overrides_tip`**
  > List the scenario's overrides by category, each with the inherited value it overrides, and clear any of them.
  _Ruled OK 2026-10-16._
- **`lpn_sm_make_current`**
  > Make current
  _Ruled OK 2026-10-16._
- **`lpn_sm_menu`**
  > Scenario manager…
  _Ruled OK 2026-10-16._
- **`lpn_sm_merge_ask`**
  > Move the overrides ({n}) of {name} up into {target}? Afterward, it inherits them instead of overriding them. You can undo this.
  _Ruled OK 2026-10-16._
- **`lpn_sm_merge_line`**
  > {asset}: {property}
  _Ruled OK 2026-10-16._
- **`lpn_sm_merge_none`**
  > The alternative {name} has no overrides to merge.
  _Ruled OK 2026-10-16._
- **`lpn_sm_merge_pick`**
  > Merge the overrides of {name} into which alternative? Its parent is listed first.
  _Ruled OK 2026-10-16._
- **`lpn_sm_merge_skipped`**
  > {between} also overrides these values. It is skipped and not changed, so {name} will read them from {between}, not from {target}:
  _Ruled OK 2026-10-16._
- **`lpn_sm_merge_up`**
  > Merge upward
  _Ruled OK 2026-10-16._
- **`lpn_sm_merge_up_root`**
  > A Base alternative has nothing above it to merge into.
  _Ruled OK 2026-10-16._
- **`lpn_sm_merge_up_tip`**
  > Move the overrides of the selected alternative into an alternative above it in the tree. The selected alternative then inherits those values.
  _Ruled OK 2026-10-16._
- **`lpn_sm_name_taken`**
  > The name {name} is already used in this tree.
  _Ruled OK 2026-10-16._
- **`lpn_sm_none_selected`**
  > Select an item in the tree first.
  _Ruled OK 2026-10-16._
- **`lpn_sm_rename`**
  > Rename
  _Ruled OK 2026-10-16._
- **`lpn_sm_rename_alts_ask`**
  > Rename equally named alternatives?
  _Ruled OK 2026-10-13._
- **`lpn_sm_shared_note`**
  > Shared with: {list}
  _Ruled OK 2026-10-16._
- **`lpn_sm_title`**
  > Scenario manager
  _Ruled OK 2026-10-16._
- **`lpn_sm_tree_all`**
  > All
  _Ruled 2026-10-15: Approved._
- **`lpn_sm_tree_unused`**
  > All unused
  _Ruled 2026-10-15: Approved._
- **`lpn_sm_unused_none`**
  > None
  _Ruled 2026-10-16: I approve all three._
- **`lpn_sm_used_by`**
  > Used by scenarios: {n}
  _Ruled OK 2026-10-16._
- **`lpn_sm_used_by_none`**
  > Not used by any scenario
  _Ruled OK 2026-10-16._
- **`lpn_sm_used_by_tip`**
  > Used by: {list}
  _Ruled OK 2026-10-16._
- **`lpn_theme_dark`**
  > Dark
  @@ NEEDS RULING
- **`lpn_theme_light`**
  > Light
  @@ NEEDS RULING
- **`lpn_theme_system`**
  > System
  @@ NEEDS RULING
- **`lpn_time_run_cut_off`**
  > EPANET had closed {link} and then could not solve for {nodes}.
  _Ruled 2026-10-15: R-402 status messages: Approved._
- **`lpn_time_run_cut_off_empty`**
  > Tank {tank} was empty, so EPANET had closed {link} to keep it from draining further, and then could not solve for {nodes}.
  _Ruled 2026-10-15: R-402 status messages: Approved._
- **`lpn_time_run_cut_off_full`**
  > Tank {tank} was full, so EPANET had closed {link} to keep water out of it, and then could not solve for {nodes}. This can happen when a full tank has no water leaving it, as when every demand is zero. A demand slightly above zero, or a tank level slightly below its maximum, avoids it.
  _Ruled 2026-10-15: R-402 status messages: Approved._
- **`lpn_tsb_close`**
  > Close graph
  _Ruled OK 2026-10-16._
- **`lpn_tsb_max`**
  > Close a graph before opening another. Up to {n} stay open.
  _Ruled OK 2026-10-16._
- **`lpn_tsb_menu`**
  > Time series graph
  _Ruled OK 2026-10-16._
- **`lpn_tsb_off_tip`**
  > Needs extended period results. Set a Total run time in Settings, Calculation, Time, and calculate.
  _Ruled OK 2026-10-16._
- **`lpn_tsb_quantity`**
  > Quantity to graph
  _Ruled OK 2026-10-16._
- **`lpn_tsb_resize`**
  > Drag to resize
  _Ruled OK 2026-10-16._

---

# Strings waiting on a branch

**143 still to read**, of 146 new keys across 11 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### feat/desktop (`baba0f04d`) — adds no English strings

### feat/guide-scenarios (`c60410088`) — 142 new, 142 to read @@ NEEDS RULING

- **`lpn_guide_bx_dock_def`**
  > <p>The corner of a box's title bar has Dock at the left of the map, Dock at the right of the map, and Float, and, once the box is docked, Auto-hide. A docked box is a column beside the map. With Auto-hide, it is a tab on a slim strip at the edge of the map. The tab opens the box on hover, after 150 ms with a mouse or pen, or on a click or tap, and the box tucks back into its tab as described above. A tucked box is still open. A menu row or toolbar button that opens it brings it out of its tab.</p><p>Dragging a docked box by its title band floats it and turns auto-hide off. Boxes docked on one side share one width, and the map keeps at least 320 px. Tabs are reordered by dragging them or by pressing Alt+Up or Alt+Down on a focused tab.</p>
  @@ NEEDS RULING
- **`lpn_guide_bx_dock_term`**
  > Docking and tabs
  @@ NEEDS RULING
- **`lpn_guide_bx_keep_def`**
  > <p>Each box keeps in this browser where it floats, its size, whether it is open, its dock side, whether it auto-hides, its docked width, and the place of its tab. Properties, Critical assets, Demand scaling, and Calibration keep only their dock side, auto-hide, tab place, and whether they are open; where they float lasts for one page load. A browser with no saved layout starts with some boxes docked as tabs, and nothing is stored until a box is changed.</p>
  @@ NEEDS RULING
- **`lpn_guide_bx_keep_term`**
  > What a box remembers
  @@ NEEDS RULING
- **`lpn_guide_bx_phone_def`**
  > <p>At 640 px or narrower, no box docks and every box fills the window. The dock buttons are not offered. A docked layout is kept and returns on a wider window.</p>
  @@ NEEDS RULING
- **`lpn_guide_bx_phone_term`**
  > On a phone
  @@ NEEDS RULING
- **`lpn_guide_cal_example_def`**
  > <p>Open the Net1 example, calculate it, and choose Water, Reports, Calibration. With Pressure chosen, load a file that gives Junction 11 as 118.5 psi at 0:00 and 121.0 psi at 12:00, Junction 31 as 110.2 psi at 6:00 and 108.7 psi at 18:00, and Junction 99 as 50 psi at 0:00, followed by a line that is not data. The report says the file has 5 measurements at 3 locations, names Junction 99 as not in the network with 1 measurement skipped, and lists the unreadable line. Statistics shows Junction 11 with 2 observations, an observed mean of 119.75 psi, a computed mean of 116.53 psi, a mean error of 3.98, and an RMS error of 5.12. Junction 31 has 109.45, 118.71, 9.26, and 9.79. The Network row has 4 observations, a mean error of 6.62, and an RMS error of 7.81.</p>
  @@ NEEDS RULING
- **`lpn_guide_cal_example_term`**
  > Example on Net1
  @@ NEEDS RULING
- **`lpn_guide_cal_file_def`**
  > <p>A text file with a location ID, a time, and a measured value on each line. The time is measured from the start of the simulation, in decimal hours or hours:minutes. A semicolon starts a comment. A line with only a time and a value belongs to the location above it. The values are read in the project's units, and the report says which unit. A location that is not in the network is listed and its measurements are counted as skipped, a line that cannot be read is listed by line number, and the rest of the file is used. A file is held in memory for the open project and this page load only. It is not saved with the project or on this device. When the Time series chart shows the same quantity, the measured values are drawn on it as rings.</p>
  @@ NEEDS RULING
- **`lpn_guide_cal_file_term`**
  > The calibration file
  @@ NEEDS RULING
- **`lpn_guide_cal_what_def`**
  > <p>Choose Water, Reports, Calibration. The Parameter list chooses what the file measures: Demand, Head, Pressure, Chlorine concentration, Flow, or Velocity. One file is held for each parameter, and the Load calibration file… button opens a file chooser. The report has three pages. Statistics gives, for each location, the number of observations, the observed mean, the computed mean, the mean error, and the RMS error, then a Network row for all locations together and the correlation between the means. Correlation plot puts each measurement at its observed value across and its computed value up, with a diagonal line where the two agree. Mean comparisons draws the observed and computed means as a pair of bars for each location.</p><p>The computed value is read from the extended period run, and a measurement between two reporting steps is compared with the value interpolated between them. A measurement outside the times the run reported is skipped and counted. With a single instant solution, every measurement is compared with that one result, whatever time the file gives. The report fills in after the network is calculated.</p>
  @@ NEEDS RULING
- **`lpn_guide_cal_what_term`**
  > What the report compares
  @@ NEEDS RULING
- **`lpn_guide_cmp_cols_def`**
  > <table class="lpn-notes-table"><tbody><tr><td>Scenario</td><td>The name of the scenario. The open scenario is marked (currently open).</td></tr><tr><td>No. of overrides</td><td>The overrides of the scenario itself, counted as in the Scenarios list. A calculation option such as the demand multiplier counts as one, and an override equal to the inherited value counts.</td></tr><tr><td>Demand multiplier, Total run time, Hydraulic time step</td><td>The values the scenario was solved under, its own or those of the project. A steady-state scenario shows a dash for the time step.</td></tr><tr><td>Lowest pressure</td><td>The lowest pressure at a junction, with its ID and the time it occurs. Reservoirs and tanks are left out because each has a fixed head.</td></tr><tr><td>Highest velocity</td><td>The highest velocity in a pipe or valve, with its ID and the time it occurs. Pumps are left out.</td></tr></tbody></table>
  @@ NEEDS RULING
- **`lpn_guide_cmp_cols_term`**
  > What the table holds
  @@ NEEDS RULING
- **`lpn_guide_cmp_notes_def`**
  > <ul><li>A scenario that cannot be solved shows the reason in place of its two results, for example that a junction has no path to a source after a pipe is made inactive. The other scenarios are still solved. A scenario that did not converge shows its last results and a message.</li><li>The block above the table, The same in every scenario, states the friction method, units, accuracy, and maximum trials. A setting that differs between scenarios is left out of the block.</li><li>There is no pass or fail threshold. Read the numbers against the design criteria of the system being modeled.</li><li>The example given in the Scenario manager entry compares three scenarios on Net1.</li></ul>
  @@ NEEDS RULING
- **`lpn_guide_cmp_notes_term`**
  > Points to note
  @@ NEEDS RULING
- **`lpn_guide_cmp_run_def`**
  > <p>A scenario with a Total run time greater than 0 is run over the whole period through the EPANET engine. Its lowest pressure and highest velocity are the extremes over every time step, each shown with its time. A scenario with a Total run time of 0 is solved at one instant. The total run time is one of the options a scenario can override, so one table can hold both kinds.</p>
  @@ NEEDS RULING
- **`lpn_guide_cmp_run_term`**
  > Steady-state and extended-period scenarios
  @@ NEEDS RULING
- **`lpn_guide_cr_case_def`**
  > <p>For each link in the scope, the link is made inactive on a copy of the network, and the copy is solved at the time step on screen in the open scenario. A run is one solve for each link and one more with nothing broken. A junction left with no open path to a reservoir or tank is cut off: it is removed before the solve, and its demand is counted as Demand not served. Of the junctions still connected, Junctions below minimum lists those whose pressure falls below the Lowest pressure allowed. A junction that is already below it with nothing broken is not counted against any link, and the summary states how many there are. Lowest pressure allowed is the same setting as Lowest pressure allowed elsewhere in the Fire flow analysis.</p>
  @@ NEEDS RULING
- **`lpn_guide_cr_case_term`**
  > What each case does
  @@ NEEDS RULING
- **`lpn_guide_cr_dead_def`**
  > <p>A dead-end link is one whose removal cuts off junctions that can be reached only through it. Everything beyond it is its loss, so with Skip dead ends checked the link is not solved, and the summary states how many were skipped. The list shows, for each link, the Demand not served, the Junctions cut off, and the Junctions below minimum, each with the number and the first five IDs, and a click on an ID goes to it on the map. Links that cost the system something are listed first until a column heading is clicked to sort, and the summary counts them against the number of links tested. Choose Selected links to break only the links selected on the map.</p>
  @@ NEEDS RULING
- **`lpn_guide_cr_dead_term`**
  > Dead ends, and the list
  @@ NEEDS RULING
- **`lpn_guide_cr_example_def`**
  > <p>Open the Net1 example, choose Water, Analyze, Criticality analysis…, enter 116 for Lowest pressure allowed, and click Run. The time step is 0:00, and the run solves the whole network 14 times. Four of the 13 links drop a junction below 116 psi when they are out: L9 (N10, N11, and N21), L10 (N11 and N21), L111 (N21 and N22), and L112 (N21 and N22). Two junctions are already below 116 psi with nothing broken and are not counted. Because Net1 is looped, losing one link never leaves a junction without supply.</p>
  @@ NEEDS RULING
- **`lpn_guide_cr_example_term`**
  > Example on Net1
  @@ NEEDS RULING
- **`lpn_guide_ct_box_def`**
  > <p>Show contours, when cleared, hides the fill and the lines and keeps the node colors. The box also holds Color nodes by and Color scheme, which are the same two settings as in Settings, Symbology, Node colors, the Fill (None, Smooth, or Bands, which paints each class flat), the Fill opacity, the Contour lines with their Interval and Labels, and the Buffer in multiples of the median pipe length. In a project placed on the Earth, the box can also take the ground between nodes from Mapbox DEM, after the visitor agrees to send the tile numbers of the network's area. These settings are saved with the project and can be overridden by a scenario. The plot changes only the display, not the network.</p>
  @@ NEEDS RULING
- **`lpn_guide_ct_box_term`**
  > The box
  @@ NEEDS RULING
- **`lpn_guide_ct_example_def`**
  > <p>Open the Net1 example and choose Water, Graphs, Contour. The nodes are colored by pressure, and the line under the color key states 9 nodes, 11 pipes, a reach of 2.5 times the median pipe length beside them, and lines every 5 psi. The pump, Link 9, is not one of the 11 pipes. Clear Show contours, and the nodes stay colored by pressure.</p>
  @@ NEEDS RULING
- **`lpn_guide_ct_example_term`**
  > Example on Net1
  @@ NEEDS RULING
- **`lpn_guide_ct_what_def`**
  > <p>Choose Water, Graphs, Contour. The row turns the plot on in the open scenario, as a smooth fill with labeled lines, using the pressure if the nodes are not colored yet, and opens the box. The plot spreads the node colors along the pipes and up to a set multiple of the median pipe length beside them, fading out over the outer part. It does not color across pumps, valves, or closed links. The line under the color key states how many nodes and pipes the plot uses, the reach beside the pipes, and the interval of the lines. With too few nodes, it says so.</p>
  @@ NEEDS RULING
- **`lpn_guide_ct_what_term`**
  > What the plot is
  @@ NEEDS RULING
- **`lpn_guide_ds_example_def`**
  > <p>Open the Net1 example and choose Water, Analyze, Demand scaling…. At the time step 0:00, click Find with the box as it opens. Every junction keeps at least 20 psi up to a demand scale of 5.76, where the lowest pressure is 20.11 psi at junction N32. At 5.77 it is 19.8 psi, and the search took 13 solves. Enter 3 for Demand scale and click Run: Junction N32 falls from 111 psi, unscaled, to 85.99 psi, and Link L112 rises from 0.535 ft/sec to 3.13 ft/sec.</p>
  @@ NEEDS RULING
- **`lpn_guide_ds_example_term`**
  > Example on Net1
  @@ NEEDS RULING
- **`lpn_guide_ds_find_def`**
  > <p>Find searches demand scales from 0 to 20, to the nearest 0.01, for the largest one at which every chosen junction keeps at least the Lowest pressure allowed. It reports the scale and the lowest pressure there, and the same for the next step up, where the pressure first falls below the limit. If the demands as entered already leave a junction below the limit, the answer is marked with a warning sign. If every junction keeps the limit at 20, the answer says so. Stop ends a search without an answer. Lowest pressure allowed is the same setting as Lowest pressure allowed elsewhere in the Fire flow analysis.</p>
  @@ NEEDS RULING
- **`lpn_guide_ds_find_term`**
  > Find
  @@ NEEDS RULING
- **`lpn_guide_ds_run_def`**
  > <p>Run multiplies the demands at the chosen junctions by the Demand scale, on a copy of the network at the time step on screen and in the open scenario. It makes two solves, one with the demands as they are and one scaled. The result lists the Lowest pressures and the Highest velocities, each with the Scaled value beside the Unscaled one, which is the value the map shows. Each list holds ten rows, and the box states how many links it does not show. The Demand scale is applied in addition to the demand multiplier of the open scenario, and it is never saved in the project.</p>
  @@ NEEDS RULING
- **`lpn_guide_ds_run_term`**
  > Run
  @@ NEEDS RULING
- **`lpn_guide_ds_scope_def`**
  > <p>With Selected junctions, only the junctions selected on the map are scaled and checked. Other junctions are left as they are, and those that fall below the limit are listed without limiting the answer. Only the time step on screen is scaled, and levels and statuses are taken from it. To test the peak, move the clock to the peak demand before running.</p>
  @@ NEEDS RULING
- **`lpn_guide_ds_scope_term`**
  > Junctions, and the time step
  @@ NEEDS RULING
- **`lpn_guide_en_example_def`**
  > <p>Open the Net1 example, which has a total run time of 24:00, and calculate. Choose Water, Reports, Pump energy. Pump L9 runs for 65.71% of the run at an efficiency of 75%, and uses 96.22 kW on average, 96.71 kW at the peak, and 1518 kWh. No price is stated, so the cost is 0 and the report says so. Enter 0.12 for Price of power in Settings, Energy, and calculate again: the cost of L9 is 182, the Total cost.</p>
  @@ NEEDS RULING
- **`lpn_guide_en_example_term`**
  > Example on Net1
  @@ NEEDS RULING
- **`lpn_guide_en_read_def`**
  > <p>Choose Water, Reports, Pump energy. The report integrates the power of each pump over the last extended period simulation, so it needs a Total run time greater than 0 and a calculation. For each pump it lists the % of run, the Effic., the Avg. kW, the Peak kW, the kWh, and the Cost. The Avg. kW is the average while the pump was running, not over idle periods. Below the table are the Energy used, the Cost of energy, the Peak power usage, the Cost of peak demand, and the Total cost. A network with no pumps has nothing to report.</p>
  @@ NEEDS RULING
- **`lpn_guide_en_read_term`**
  > Reading the report
  @@ NEEDS RULING
- **`lpn_guide_en_set_def`**
  > <p>Settings, Energy holds the Pump efficiency (percent), used for every pump that has no efficiency curve, the Price of power for one kilowatt hour, a Price pattern that multiplies the price at each pattern step, the Peak demand charge per kW, and a Currency text that is printed beside the costs and is only a label. A pump can have its own price, price pattern, and efficiency curve in Properties. The prices, the pattern, the peak demand charge, the Pump efficiency (percent), and a pump's own values are in the Energy cost category, so a scenario can override them. When no price is stated, or the price is zero, every cost is zero and the report says so. The application suggests no price.</p>
  @@ NEEDS RULING
- **`lpn_guide_en_set_term`**
  > What sets the numbers
  @@ NEEDS RULING
- **`lpn_guide_ff_asks_def`**
  > <p>Each tested junction gets two tests, on a copy of the network at the time step on screen and in the open scenario. The first asks how much flow the junction can deliver while it holds the residual pressure. A flow is drawn at the junction, and repeated solves narrow it down, up to a ceiling equal to 10000 gpm. A junction that still holds the residual pressure at the ceiling is reported as delivering more than the ceiling. The second test, the design check, draws the required flow at the junction and asks whether any other junction in its scope falls below the Lowest pressure allowed elsewhere, or any pipe in its scope runs above the Highest velocity allowed. The design check is not made when its scope is None.</p><p>A junction with its own Required fire flow property is tested against that value, and every other junction against the value in the box.</p>
  @@ NEEDS RULING
- **`lpn_guide_ff_asks_term`**
  > What is asked of each junction
  @@ NEEDS RULING
- **`lpn_guide_ff_example_def`**
  > <p>Open the Net1 example, choose Water, Analyze, Fire flow analysis…, and click Run with the box as it opens. The time step is 0:00, and the run solves the whole network 135 times. Eight of the nine junctions pass all checks. Junction N32 fails the fire flow: its static pressure is 111 psi, only 1.19 psi remains at the required 1000 gpm, and its available flow is 892 gpm. Junction N31 can deliver 1339 gpm, and Junction N12 more than 10000 gpm.</p>
  @@ NEEDS RULING
- **`lpn_guide_ff_example_term`**
  > Example on Net1
  @@ NEEDS RULING
- **`lpn_guide_ff_marks_def`**
  > <p>After a run, the circle of each tested junction is outlined on the map according to its result, and the outlines differ in dash pattern as well as in color. Choose Selected junctions to test only the junctions selected on the map; anything else that is selected is counted and not tested. Stop ends a run and keeps the junctions already finished. Only one of the fire flow, criticality, and demand scaling analyses runs at a time.</p>
  @@ NEEDS RULING
- **`lpn_guide_ff_marks_term`**
  > Rings, Stop, and one analysis at a time
  @@ NEEDS RULING
- **`lpn_guide_ff_result_def`**
  > <p>The summary counts the junctions that passed all checks, the junctions that failed the fire flow, and the junctions that affected the rest of the system. The table lists, for each junction tested, the Static pressure before any fire flow is drawn, the Required flow, the Pressure at required flow, the Available flow, the Residual held, the Worst effect and Design limit of the design check, the number of Runs, which is the number of solves of the whole network, and the Failure modes. A cell with no number shows a dash, never a zero. A junction that could not be solved shows its reason in place of numbers. The table prints at most 200 junctions and states how many it did not print.</p>
  @@ NEEDS RULING
- **`lpn_guide_ff_result_term`**
  > Reading the results
  @@ NEEDS RULING
- **`lpn_guide_fr_example_def`**
  > <p>Open the Net1 example and choose Water, Reports, Full. The 24 assets are listed at 25 reporting steps, 0:00 to 24:00, which is 600 rows. At 0:00, Junction 11 has a demand of 150 gpm, a head of 985.23 ft H2O, and a pressure of 119.26 psi.</p>
  @@ NEEDS RULING
- **`lpn_guide_fr_example_term`**
  > Example on Net1
  @@ NEEDS RULING
- **`lpn_guide_fr_what_def`**
  > <p>Choose Water, Reports, Full. The table has one row for each node and link at each reporting time step, in the units of the Tables pane. Its columns are Type, ID, Demand, Head, Pressure, Chlorine concentration, Flow, Velocity, Head loss, Pump head, and Status, and a cell is blank where the asset has no such quantity. The Time step list chooses the step shown, and Download CSV and Print report carry every step. Without an extended period simulation, the table shows the current solution at one instant.</p>
  @@ NEEDS RULING
- **`lpn_guide_fr_what_term`**
  > What the table holds
  @@ NEEDS RULING
- **`lpn_guide_lib_ctl_def`**
  > <p>A control is one statement. A rule is several lines that begin with RULE. Keywords are typed in English whatever the language of the page, and numbers are in the units of the project. Add a control starts from a statement built from the network, which is then edited into the one intended.</p><p>Controls and rules change a result only in an extended-period simulation, that is, when Total run time is greater than 0. A steady-state solution is not changed by either. Rules are applied by the EPANET engine only. Both are saved with the project and written to an EPANET file.</p>
  @@ NEEDS RULING
- **`lpn_guide_lib_ctl_term`**
  > Controls and rules in a run
  @@ NEEDS RULING
- **`lpn_guide_lib_example_def`**
  > <p>Open the Net1 example and choose Water, Libraries. Patterns holds pattern 1, Demand Pattern, with 12 multipliers 2:00 apart, covering 24:00, marked (default). Curves holds curve 1, Pump Curve for Pump 9, a Pump head curve with one point, 1500 gpm at 250 ft. Controls holds two statements: the first opens Link 9 when Node 2 falls below 110, and the second closes it when Node 2 rises above 140. Rules holds two rules that test the clock time and the level of Tank 2.</p><p>Choose Water, Calculate, and then Water, Reports, Status changes. Pump L9 is now closed at 10:00, now open at 15:00, and now closed at 21:00, and Tank N2 is now emptying at 22:00. In Controls, change 140 to 135 in the second control and choose Water, Calculate again. The last closing moves to 20:00, and Tank N2 is now emptying at 21:00.</p>
  @@ NEEDS RULING
- **`lpn_guide_lib_example_term`**
  > Example on Net1
  @@ NEEDS RULING
- **`lpn_guide_lib_import_def`**
  > <p>File, Import…, Import libraries… opens another project file and copies whole libraries from it into this project. An item whose name is already used here is skipped and listed, so nothing already here is changed. A warning is shown when the file and the project state a quantity in different units, and the items are imported as written. Pipe types that refer to a fittings list this project does not have are listed; import the fittings library from the same file to resolve them.</p>
  @@ NEEDS RULING
- **`lpn_guide_lib_import_term`**
  > Importing libraries from another project
  @@ NEEDS RULING
- **`lpn_guide_lib_kinds_def`**
  > <table class="lpn-notes-table"><tbody><tr><td>Patterns</td><td>A list of multipliers that repeats for as long as a run lasts, one multiplier for each pattern time step. A new pattern is 24 multipliers of 1. Pasting a spreadsheet column fills the Multipliers box. The default demand pattern is marked (default) and is chosen in Settings, Calculation, Hydraulics.</td></tr><tr><td>Curves</td><td>Four kinds, chosen as the Curve type: Pump head, Pump efficiency, Tank volume, and Valve head loss. The points are entered in a grid that accepts a pasted spreadsheet column or lines copied from an EPANET file. A pump head curve is fitted through its points and the Equation line shows the fit; one point is read as the design point, with a shutoff head of 1.33334 times its head and a maximum flow of 2 times its flow, as EPANET reads it. The other kinds join their points with straight lines. A pump or valve states its curve in Properties, where the Curves link opens this section.</td></tr><tr><td>Pipe types</td><td>A definition of diameter, roughness, and reaction coefficients that several pipes refer to. A property may be left blank in the definition and then entered for each pipe. In Properties, the values a pipe type states are disabled, and Detach from pipe type copies them into the pipe and stops the pipe using the type.</td></tr><tr><td>Fittings</td><td>Lists of fittings with a quantity for each, added up to one minor (local) loss coefficient, k, for a pipe or pipe type. The fittings offered are the thirteen in Table 3.3 of the EPANET 2.2 user manual and Other fitting. Choosing one copies its coefficient into the row, where it can be changed.</td></tr><tr><td>Controls</td><td>One statement each, in EPANET syntax, as in <code>LINK id OPEN IF NODE id BELOW value</code>. Under each, the box states whether it was understood.</td></tr><tr><td>Rules</td><td>Several lines each, in EPANET syntax: RULE, IF, AND, OR, THEN, ELSE, and PRIORITY. Under each, the box states whether it was read.</td></tr></tbody></table>
  @@ NEEDS RULING
- **`lpn_guide_lib_kinds_term`**
  > What each section holds
  @@ NEEDS RULING
- **`lpn_guide_lib_notes_def`**
  > <ul><li>A pattern repeats for as long as a run lasts, so it need not cover the whole run.</li><li>An EPANET file has no place for a pipe type or a fittings list. The file carries the numbers each pipe reads, and the export says which pipes were flattened.</li><li>The position and size of the Libraries box are kept in this browser. The items are saved with the project.</li></ul>
  @@ NEEDS RULING
- **`lpn_guide_lib_notes_term`**
  > Points to note
  @@ NEEDS RULING
- **`lpn_guide_lib_refs_def`**
  > <p>An ID is changed in its section. A blank ID, or an ID already used in the same section, is not accepted. Renaming an item moves every reference to it, in Base and in every scenario. For a pattern, the references are a junction's demand pattern and the pattern of each of its demand categories, a Customer's demand pattern, a reservoir's head pattern, a pump's speed pattern, and the default demand pattern.</p><p>A pattern that is in use can be deleted, and each reference to it is cleared. If it was the default demand pattern, a notice states what junctions with no pattern use now. A curve, pipe type, or fittings list that is in use is not deleted. The message names the assets that use it, and each must be given another curve, or detached from the type or list, first.</p>
  @@ NEEDS RULING
- **`lpn_guide_lib_refs_term`**
  > Renaming, deleting, and what refers to an item
  @@ NEEDS RULING
- **`lpn_guide_lib_scn_def`**
  > <p>The Libraries are the same in every scenario. A scenario can point an asset at a different curve, pipe type, fittings list, or pattern, which is an override of that asset, but the contents of an item are not overridden. An edit to a pattern, curve, pipe type, fittings list, control, or rule changes it for every scenario, whichever scenario is open. The default demand pattern is a setting rather than an item, and a scenario can have its own.</p><p>A control or rule that names an asset which is inactive in the open scenario is ignored in that scenario's run, and the Libraries box lists it. One that names an asset the project does not have is also ignored, with a warning.</p>
  @@ NEEDS RULING
- **`lpn_guide_lib_scn_term`**
  > Libraries and scenarios
  @@ NEEDS RULING
- **`lpn_guide_map_del_def`**
  > <p>Delete or Backspace deletes the selection, except while typing in a field, where the key belongs to the field. With nothing selected, Delete says so, and Backspace does nothing. One Undo reverses the deletion of several assets. In a scenario other than Base, Delete does not remove an asset that exists in Base; the Scenario manager entry describes what it does.</p>
  @@ NEEDS RULING
- **`lpn_guide_map_del_term`**
  > Delete
  @@ NEEDS RULING
- **`lpn_guide_map_esc_def`**
  > <p>An Esc that closes a menu, a pull-down, or a box does nothing else. The Properties, Settings, and Libraries boxes close only when focus is in the box and the pointer is over it. With none of those open, Esc returns the active tool to Select, and in Select it clears the selection. A half-drawn pipe takes one Esc to abandon and a second to return to Select. In a field, Esc belongs to the field.</p>
  @@ NEEDS RULING
- **`lpn_guide_map_esc_term`**
  > Esc
  @@ NEEDS RULING
- **`lpn_guide_map_letters_def`**
  > <p>W starts Zoom Window, A starts selecting an area (pressing A again cycles the window, lasso, and polygon), and F draws a Shape. The plus or equals key zooms in, and the minus key zooms out, by one wheel step. These keys and the digits 0 to 9 are not taken with Ctrl, Alt, or Cmd, are not taken while typing in a field, and leave the letters of an open menu to its rows. A digit typed on a selected Tables cell overwrites the cell instead of choosing a tool.</p>
  @@ NEEDS RULING
- **`lpn_guide_map_letters_term`**
  > Letters, digits, and zoom keys
  @@ NEEDS RULING
- **`lpn_guide_map_undo_def`**
  > <p>Ctrl+Z undoes the last change, and Ctrl+Y or Ctrl+Shift+Z redoes it. In a Tables cell, the keys belong to the project while the cell is only selected, and to the text of the cell once typing has begun. The page keeps the last 20 steps, in memory only, and switching projects clears them. A step restores the scenarios, the open scenario, and the units along with the drawing.</p>
  @@ NEEDS RULING
- **`lpn_guide_map_undo_term`**
  > Undo and Redo
  @@ NEEDS RULING
- **`lpn_guide_mn_kbd_def`**
  > <p>The letters after Alt+Shift are keys at fixed positions, F for File, E for Edit, M for Map, W for Water, H for Help, and L for Language, on every keyboard layout and in every language. After F10, the letter of a menu alone opens it, and Esc on the menu bar returns focus to where it was.</p><p>Rows that only a pointer can use have no letter, and the arrow keys skip them. They include Vertices, the three area selections, the Insert tools, Zoom Window, and Screenshot.</p>
  @@ NEEDS RULING
- **`lpn_guide_mn_kbd_term`**
  > Menus from the keyboard
  @@ NEEDS RULING
- **`lpn_guide_mn_list_def`**
  > <p>The list is drawn from the menus themselves: File, Edit, Map, Water, and Help, each under its own heading, with the rows of a fly-out indented under the row that opens it and a rule between groups. It leaves out rows that are hidden now, headings inside a menu, and rows named from the project or the browser, such as scenario names. It goes one fly-out deep, and it has no entry for the Language menu. A row that is disabled now is still listed, with no sign of it. Clicking a row opens the menu and fly-out with that row pointed at. It never runs the row.</p>
  @@ NEEDS RULING
- **`lpn_guide_mn_list_term`**
  > Reading the menu list
  @@ NEEDS RULING
- **`lpn_guide_prop_edit_def`**
  > <p>A value takes effect when the field is committed, by leaving it or pressing Enter. It is read in the unit named in its label, with no conversion, and the map label, Tables, and the results follow. Calculated values are read-only rows with no box to type in. For a link they follow its inputs, and for a node they sit among them. They are the results of the last calculation, at the time shown, and with Recalculate automatically cleared they are those of the last Calculate.</p><p>A pipe that uses a pipe type shows the values the type states as disabled. Click Detach from pipe type to copy those values into the pipe and edit them there.</p>
  @@ NEEDS RULING
- **`lpn_guide_prop_edit_term`**
  > Editing a value
  @@ NEEDS RULING
- **`lpn_guide_prop_example_def`**
  > <p>Open the Net1 example and click Pipe 10. Properties lists its inputs, from Description to Is active?, and then its results at the time shown: Flow 1866.2 gpm, Velocity 2.4 ft/sec, and Head loss 19.12 ft H2O.</p><p>Click Pipe 113 and Shift-click Pipe 31. The title reads 2 selected, the one section is Pipes (2), and Diameter shows Various, because Pipe 31 is 6 in. and Pipe 113 is 8 in. Enter 10 for Diameter. The notice reads Set Diameter (in) on 2., both pipes are 10 in., and one Undo returns them to 6 and 8 in.</p>
  @@ NEEDS RULING
- **`lpn_guide_prop_example_term`**
  > Example on Net1
  @@ NEEDS RULING
- **`lpn_guide_prop_id_def`**
  > <p>The ID is edited in the title bar. It cannot contain a space or a quotation mark, and a node's ID cannot be that of another node, nor a link's that of another link. A node and a link can have the same ID. A refused ID leaves the old one in place and shows a message. Renaming an asset carries its scenario overrides with it.</p>
  @@ NEEDS RULING
- **`lpn_guide_prop_id_term`**
  > The ID
  @@ NEEDS RULING
- **`lpn_guide_prop_multi_def`**
  > <p>The title reads, for example, 2 selected. The box has one section for each type of asset in the selection, headed by the name of the type and the number of assets of it, as in Pipes (2), and each section can be collapsed. A section lists the properties that Tables has as columns and that can be set on every asset in it. Results and values that a pipe type states are not listed. A row shows the value the assets share, or Various where they differ.</p><p>Typing a value into a row sets it on every asset of that type in the selection. A row that is not touched writes nothing. A notice states the count, as in Set Diameter (in) on 2., and one Undo reverses the whole row. In a scenario other than Base the values are stored as overrides.</p>
  @@ NEEDS RULING
- **`lpn_guide_prop_multi_term`**
  > Several assets selected
  @@ NEEDS RULING
- **`lpn_guide_prop_open_def`**
  > <p>In Select mode, click a node, link, Text, or Customer to open Properties beside it, or where the box was last moved. Shift-click another asset to add it to the selection. With more than one asset selected, the box lists what can be set on all of them at once (see Several assets selected, below). A Shape has no Properties box, because its points are edited on the map.</p><p>The right-click menu of a node or link has Copy properties, Paste properties to selection, and Time series graph. On a touch screen, press and hold the asset for the same menu. Time series graph needs the results of an extended-period simulation.</p>
  @@ NEEDS RULING
- **`lpn_guide_prop_open_term`**
  > Opening Properties
  @@ NEEDS RULING
- **`lpn_guide_prop_scn_def`**
  > <p>In a scenario other than Base, an edit to a value that scenarios can override is stored as an override of the open scenario, and the row is marked at its left. The Scenario manager entry describes the marks and lists what is the same in every scenario: the ID, Description, and Tag are. A Customer has no scenario values. Switching scenarios leaves Properties open on the same asset, showing the values of the scenario that is now open.</p>
  @@ NEEDS RULING
- **`lpn_guide_prop_scn_term`**
  > In a scenario
  @@ NEEDS RULING
- **`lpn_guide_rr_example_def`**
  > <p>Open the Net1 example, which has been calculated already, and choose Water, Reports, Run. The summary counts 9 junctions, 1 reservoir, 1 tank, 12 pipes, 1 pump, and 0 valves. The headloss formula is Hazen-Williams, the hydraulic timestep is 1.00 hrs, and the total duration is 24.00 hrs.</p>
  @@ NEEDS RULING
- **`lpn_guide_rr_example_term`**
  > Example on Net1
  @@ NEEDS RULING
- **`lpn_guide_rr_what_def`**
  > <p>Choose Water, Reports, Run. The report is the text that the EPANET engine wrote for the last extended period simulation, in pages. It starts with the banner and the name of the network, then counts the junctions, reservoirs, tanks, pipes, pumps, and valves, then states the analysis options, and then lists the hydraulic status of the run with its warnings. The Copy button copies the text.</p>
  @@ NEEDS RULING
- **`lpn_guide_rr_what_term`**
  > What the report holds
  @@ NEEDS RULING
- **`lpn_guide_scn_example_def`**
  > <p>Open the Net1 example. Choose Water, Scenarios, New scenario…, type Larger main, and click OK. Select Pipe 10 on the map and enter 24 for Diameter in Properties; Base has 18 in., shown beneath the field as Base scenario: 18. Choose Base in the Scenarios list, choose New scenario… again, type Max day, and enter 1.8 for Demand multiplier in Settings, Calculation, Hydraulics. Then choose Water, Reports, Scenario comparison.</p><table class="lpn-notes-table"><tbody><tr><td>Scenario</td><td>No. of overrides</td><td>Demand multiplier</td><td>Lowest pressure</td><td>Highest velocity</td></tr><tr><td>Base</td><td>0</td><td>1</td><td>108 psi at N32, 14:00</td><td>2.76 ft/sec at L11, 16:00</td></tr><tr><td>Larger main</td><td>1</td><td>1</td><td>109 psi at N32, 14:00</td><td>2.87 ft/sec at L11, 16:00</td></tr><tr><td>Max day</td><td>1</td><td>1.8</td><td>15.77 psi at N32, 9:00</td><td>3.49 ft/sec at L10, 8:00</td></tr></tbody></table><p>The total run time is 24:00 in all three, so each lowest pressure and highest velocity is the extreme over the day, at the time shown. The larger main raises the lowest pressure by about 1 psi. A multiplier of 1.8 lowers it to 15.77 psi at 9:00, and the highest velocity moves to Pipe 10. Each scenario holds one override, and Base keeps its values.</p>
  @@ NEEDS RULING
- **`lpn_guide_scn_example_term`**
  > Example on Net1
  @@ NEEDS RULING
- **`lpn_guide_scn_make_def`**
  > <p>With a scenario other than Base open, an edit to a value that scenarios can override is stored as an override in the open scenario, by whichever door it is made: typing in Properties, editing a cell in Tables, Replace in Find and replace, dragging a node or entering its coordinates, Morph (the new type is the override), or Paste properties to selection. A setting typed in the Settings box is stored as an override when scenarios can override that setting. Base is not changed. In Base, the same edits change the network itself and reach every scenario that has not overridden the value.</p><p>Delete acts differently. In a scenario, Delete does not remove an asset that exists in Base. It makes the asset inactive in the open scenario, and with it the pipes of a node, and says so. The asset is still in the drawing and in the other scenarios. An asset drawn while a scenario is open is inactive in Base and active in that scenario, and Delete in that scenario removes it. Deleting an asset in Base also deletes its overrides in every scenario, after a question that counts them. Customers and Shapes belong to no scenario and are deleted outright.</p><p>The Override manager row of the Scenarios list opens a list of every override of the open scenario by category, each beside the inherited value it replaces. A time series graph on the map that the scenario opened, moved, or changed is a row of its own. Check rows and click Clear selected overrides, click Clear override in one row, or click Clear all overrides. Each value then returns to the inherited value, and Undo reverses it. Select an ID in the list to go to the asset on the map. The dot in Properties and the Clear override row in the cell menu of Tables clear one override at a time.</p>
  @@ NEEDS RULING
- **`lpn_guide_scn_make_term`**
  > Making and clearing overrides
  @@ NEEDS RULING
- **`lpn_guide_scn_marks_def`**
  > <p>On the map, an asset that has an override in the open scenario is ringed in amber, and an asset that inherits an override from a parent scenario or alternative is ringed with a dashed gray line. For demand, diameter, roughness, minor (local) loss coefficient, and length, a ring appears only while Settings, Symbology, Node labels or Link labels shows that value on the map; an override of any other property always has its ring. In Tables, a cell that holds a value set by the open scenario is amber, and its tip names the alternative that holds it, as in Physical alt.: Larger main. Show scenarios, in the cell menu of a table, lists every asset once for each scenario.</p><p>Each row of Properties that a scenario can override has a mark at its left. A solid dot means the open scenario overrides the value; click it to clear the override. A hollow dot means the value is inherited; click it to make the value shown an override. A triangle means scenarios below this one override the value; click it to clear their overrides, after a confirmation. Beneath an overridden row is the inherited value it replaces, as in Base scenario: 18. The Settings box has the solid dot and the triangle only, because typing a value there is what makes an override.</p><p>To hide the rings, clear Show override markers on the map in Settings, Map and page, Page, or choose Map, Clean map. Both are kept in this browser, not in the project. Tables marks overrides either way.</p>
  @@ NEEDS RULING
- **`lpn_guide_scn_marks_term`**
  > Where overrides show
  @@ NEEDS RULING
- **`lpn_guide_scn_notes_def`**
  > <ul><li>An override equal to the inherited value is still an override. It is counted, and Override manager marks it (same).</li><li>Basic mode is a setting for this browser, not for the project. It is disabled for a project whose scenarios and alternatives it cannot show. Alternatives and the Scenario manager are described in the help at the top of this entry.</li><li>Undo keeps 20 steps. Each step restores the scenarios and the open scenario along with the drawing, so adding, renaming, and deleting a scenario can be undone.</li><li>Exporting an EPANET file writes the open scenario only, with the values and node positions that scenario reads. The scenarios themselves are recorded in the project file only.</li></ul>
  @@ NEEDS RULING
- **`lpn_guide_scn_notes_term`**
  > Points to note
  @@ NEEDS RULING
- **`lpn_guide_scn_open_def`**
  > <p>The Scenario button in the status strip below the map names the open scenario and counts its overrides, as in Scenario: Base | No. of overrides: 0. Click it, or choose Water, Scenarios, to switch scenarios or to add, copy, rename, or delete one. Each scenario in the list shows its number of overrides in parentheses, and a check mark is at the open one. The Scenario manager row opens the tree of scenarios and alternatives. It is dimmed while Basic mode is checked.</p><p>The drawing, the labels, Properties, Tables, and the results all belong to the open scenario, and the page solves the open scenario only. Scenario comparison, described in its own entry, solves the others from copies. The open scenario is saved with the project.</p>
  @@ NEEDS RULING
- **`lpn_guide_scn_open_term`**
  > The open scenario
  @@ NEEDS RULING
- **`lpn_guide_scn_scope_def`**
  > <table class="lpn-notes-table"><tbody><tr><td>Properties</td><td>Every property of a node or link except those listed below, including its position, whether it is active, and its type (Morph). A Text can override its words, position, size, alignment, bold, angle, and whether it is shown. A custom property can always be overridden. The properties are held in the categories Physical, Demand, Active topology, Initial settings, Constituent, Fire flow, Energy cost, Custom properties, Text, Presentation, and Calculation.</td></tr><tr><td>Settings</td><td>The settings saved with the project, except those listed below: the calculation options (for example the demand multiplier, total run time, hydraulic time step, and friction method), the default demand pattern, the values given to new assets, and the presentation settings (sizes, colors, labels, contours, the map view, and the time series graphs on the map).</td></tr><tr><td>The same in every scenario</td><td>The ID, Description, and Tag of an asset; the end nodes and bends of a link; Customers and Shapes; the units and the coordinate system; and the contents of the Libraries (patterns, curves, pipe types, fittings lists, controls, and rules). An edit to any of these changes every scenario. A scenario can point an asset at a different curve, pipe type, fittings list, or pattern, but cannot change what is in them.</td></tr></tbody></table>
  @@ NEEDS RULING
- **`lpn_guide_scn_scope_term`**
  > What a scenario can and cannot override
  @@ NEEDS RULING
- **`lpn_guide_scn_use_def`**
  > <p>Scenarios save many designs, views, or situations in the same project, such as average day, maximum day, peak hour, a report presentation figure, a main out of service, or a proposed replacement. The network is drawn once, in the Base scenario. Every other scenario holds only its overrides, the values that differ from the scenario it inherits from, and reads everything else from that scenario. An edit to Base therefore reaches every scenario that has not overridden that value.</p><p>A new project starts with six ready-made scenarios: 1. Flow test: Static, 2. Flow test: Mid, 3. Flow test: Max, 4. Average Day, 5. Max Day, and 6. Peak hour. They are ordinary scenarios that can be renamed, edited, and deleted. Each starts with one override, its demand multiplier: 1 for the flow tests and Average Day, 2 for Max Day, and 3 for Peak hour. The multipliers are placeholders to be replaced with values for the system being modeled. A project opened from a file, including each example, or imported from an EPANET file has Base alone.</p><p>Fire flow is checked with the Fire flow analysis, which tests every junction or the selected junctions. Max Day is the scenario normally open when it is run.</p>
  @@ NEEDS RULING
- **`lpn_guide_scn_use_term`**
  > What a scenario is for
  @@ NEEDS RULING
- **`lpn_guide_set_assets_def`**
  > <p>ID prefixes and Values are for assets drawn from now on. They do not change assets already drawn. Apply to all, beside an ID prefix, gives every existing asset of that kind an ID that starts with the prefix; each keeps its number, and an ID that does not end in a number is not changed. Apply these new-asset values to every existing asset replaces those properties on every existing asset, after a question, but only for the properties whose labels are showing on the map. Undo reverses it.</p>
  @@ NEEDS RULING
- **`lpn_guide_set_assets_term`**
  > New assets, and applying values to existing ones
  @@ NEEDS RULING
- **`lpn_guide_set_reset_def`**
  > <p>Restore defaults asks first, and then returns ID prefixes, new-asset values, solver settings, map appearance, legend position, and visible labels of the open project to their original values. The network is not changed, other projects are not affected, and one Undo puts the settings back.</p><p>Start fresh asks first, and then deletes every project, every background image, all settings, and the unit choices saved in this browser, and reloads the page as a new visitor would see it. It cannot be undone.</p>
  @@ NEEDS RULING
- **`lpn_guide_set_reset_term`**
  > Restore defaults and Start fresh
  @@ NEEDS RULING
- **`lpn_guide_set_scn_def`**
  > <p>In a scenario other than Base, a value typed for a setting that scenarios can override is stored as an override, and the row is marked with a solid dot. A triangle marks a setting that scenarios below the open one override. The Scenario manager entry lists which settings can be overridden. Units are the same in every scenario. Restore defaults is dimmed outside Base, and Apply these new-asset values to every existing asset is refused there, because it changes the drawing itself.</p>
  @@ NEEDS RULING
- **`lpn_guide_set_scn_term`**
  > Settings in a scenario
  @@ NEEDS RULING
- **`lpn_guide_set_search_def`**
  > <p>Type one or more words in Search settings to list only the settings that mention all of them, in the name or in the tip. A word that matches a heading shows every setting under that heading. For example, opacity lists Symbol opacity (0 to 1) and Background image opacity (0 to 1); opacity symbol lists the first alone; and sprinklers lists Emitter exponent, whose tip mentions sprinklers and whose name does not. The search changes no setting.</p>
  @@ NEEDS RULING
- **`lpn_guide_set_search_term`**
  > Searching
  @@ NEEDS RULING
- **`lpn_guide_set_units_def`**
  > <p>Each quantity has its own unit in Units. When values in the project are entered in that unit, changing it asks a question first. Non-destructive keeps every number as typed and reads it in the new unit. Destructive rewrites the numbers by conversion, so the network stays physically the same, and the original numbers are lost unless Undo is used; one Undo restores the numbers and the unit. Cancel leaves everything as it was.</p><p>Example on Net1: choose mm for Diameter in Units. Destructive rewrites 13 values, and Pipe 10 reads 457.2 mm. Non-destructive leaves the 13 values alone, and Pipe 10 reads 18 mm.</p>
  @@ NEEDS RULING
- **`lpn_guide_set_units_term`**
  > Changing a unit
  @@ NEEDS RULING
- **`lpn_guide_set_where_def`**
  > <p>The list at the left of the box jumps to a section or a sub-heading. The sections are Symbology (Node labels, Node colors, Link labels, Link colors, Customer, and All), Map and page (Appearance and Page), Assets (ID prefixes, Values, and Custom properties), Calculation (Units, Time, Hydraulics, Energy, and Quality), and Credits. Each sub-heading states whether its settings are Saved with the project or Saved in this browser. Everything is saved with the project except the settings under Page and one row in Hydraulics, Show the run progress box, which states Saved in this browser itself.</p><p>The Settings tab in Tables lists the same settings as rows, with their Category and Value, so a setting can also be found and audited there.</p>
  @@ NEEDS RULING
- **`lpn_guide_set_where_term`**
  > Sections, and where settings are saved
  @@ NEEDS RULING
- **`lpn_guide_st_example_def`**
  > <p>Open the Net1 example and choose Water, Reports, Status changes. Tank N2 is now filling at 1:00, emptying at 11:00, filling at 16:00, and emptying at 22:00. Pump L9 is now closed at 10:00, now open at 15:00, and now closed at 21:00.</p>
  @@ NEEDS RULING
- **`lpn_guide_st_example_term`**
  > Example on Net1
  @@ NEEDS RULING
- **`lpn_guide_st_what_def`**
  > <p>Choose Water, Reports, Status changes. Each row gives the time of a change and the change: a pump, valve, or pipe now open or now closed, or a tank now filling, emptying, full, or empty. A time step that did not fully converge is listed too. The list is in time order and holds only changes, not every step. It is read from the same extended period run as the Tables pane and the Full report.</p>
  @@ NEEDS RULING
- **`lpn_guide_st_what_term`**
  > What is listed
  @@ NEEDS RULING
- **`lpn_guide_tb_dim_def`**
  > <p>A dimmed name belongs to a button that is not on screen now. A button that is on screen is not dimmed, whether or not it can act at that moment. Calculate is dimmed while Recalculate automatically is checked, because the button appears only when that setting is cleared.</p><p>On a phone in tall mode, only the five run controls stay on the toolbar. Every other name is dimmed, and clicking one opens the menu row that does the same thing. The Bottom panel button has no menu row, so its row can only say that the control is not on screen.</p>
  @@ NEEDS RULING
- **`lpn_guide_tb_dim_term`**
  > Dimmed names
  @@ NEEDS RULING
- **`lpn_guide_tb_row_def`**
  > <p>Each row is one toolbar button, in the order of the strip, with a rule between groups. A row shows the button's icon, name, and tip, then its keys, and, where a menu row does the same thing, Also in followed by the menu path. Clicking a row points at the button on the toolbar. It never runs the button. When the button is not on screen, the row opens the menu row that does the same thing.</p>
  @@ NEEDS RULING
- **`lpn_guide_tb_row_term`**
  > Reading a row
  @@ NEEDS RULING
- **`lpn_guide_tb_two_def`**
  > <p>Zoom to fit and Select a window have a small triangle in the lower-right corner. Pressing the button a second time, with nothing pressed between, changes it: Zoom to fit becomes Zoom Window, and Select a window cycles through the window, lasso, and polygon shapes. Clicking the corner of Zoom to fit enters Zoom Window at once, without fitting the view.</p>
  @@ NEEDS RULING
- **`lpn_guide_tb_two_term`**
  > Buttons with a corner triangle
  @@ NEEDS RULING
- **`lpn_guide_tbl_cell_def`**
  > <p>A cell is in one of three states. While it is only selected, the arrow keys move from cell to cell, and Ctrl+Z is the Undo of the project. Typing a character over a selected cell starts an entry: the typed text replaces the value, and an arrow key commits it and moves to the next cell. F2 or a double-click opens the cell to edit it: the caret is in the value, and the arrow keys move the caret. In an entry and in an edit, Ctrl+Z undoes the typing. Esc cancels the entry or edit and leaves the cell selected.</p>
  @@ NEEDS RULING
- **`lpn_guide_tbl_cell_term`**
  > Selecting, entering, and editing a cell
  @@ NEEDS RULING
- **`lpn_guide_tbl_fill_def`**
  > <p>Ctrl+D fills a selected range down from its top row, and Ctrl+Enter fills it with the value of the active cell. Both leave the ID column and read-only cells alone, and a notice states how many cells were filled and how many were not changed. Ctrl+Shift+L shows only the assets selected on the map. With a filter on, Ctrl+A and Ctrl+D act on the rows shown only, and a row edited so that it no longer matches stays until the filter is applied again.</p><p>In a scenario other than Base, a cell edit, Ctrl+D, Ctrl+Enter, and a paste are stored as overrides of the open scenario.</p>
  @@ NEEDS RULING
- **`lpn_guide_tbl_fill_term`**
  > Filling, filters, and scenarios
  @@ NEEDS RULING
- **`lpn_guide_tbl_tabs_def`**
  > <p>Choose Water, Tables, or click Bottom panel, to open the pane. Its tabs, left to right, are Junctions, Reservoirs, Tanks, Pipes, Pumps, Valves, Text, Customers, Shapes, Settings, Scenarios, Time series, Profile, Frequency, and Flow balance. The Scenarios tab is shown when Basic mode is cleared. Column width, order, and visibility are kept in this browser, not in the project.</p>
  @@ NEEDS RULING
- **`lpn_guide_tbl_tabs_term`**
  > The tabs
  @@ NEEDS RULING
- **`lpn_guide_use_def`**
  > <p>Search ignores capitals and accents and lists the rows and entries that contain the text typed. Choosing a row shows where that control is. It never runs the control. On a phone, where the toolbar is folded away, a toolbar row opens the menu row that does the same thing.</p><p>The address of the page follows the entry being read, as in <code>Looped-Network.php#guide</code>, so it can be copied as a link to that entry. Closing the user manual clears it. The user manual remembers in this browser whether it was open, its position and size, and whether its contents list is hidden. On a phone the contents list starts hidden.</p>
  @@ NEEDS RULING
- **`lpn_guide_use_term`**
  > Searching, links, and what is remembered
  @@ NEEDS RULING

### feat/hover-props (`9672e7859`) — adds no English strings

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

### feat/native-valves (`c3d69dba6`) — adds no English strings

### option/pane-boxes (`2ac75bbbe`) — 1 new, 1 to read @@ NEEDS RULING

- **`lpn_pane_popout`**
  > Open in a box
  @@ NEEDS RULING
