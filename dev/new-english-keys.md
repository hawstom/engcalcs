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

**45 still to read on master**, of 54 untranslated keys, of 2498 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
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
  > ⚠ At least one junction is below {pressure} with no demand scaling. The largest demand scale that keeps every junction at {pressure} or above is {m}.
  *The finding:* Tom: 'I think I need explanation, and this need clarification.' It appears after Find when the demands as entered (a demand scale of 1) leave at least one junction below the limit; {m} is the largest scale, always under 1, at which every judged junction keeps the limit (0.62 means demands cut to 62 percent). 'it' in 'keeps it' is vague, 'demands as they are' never says scale 1, and {m} reads as headroom when it is a cut.
  1. the system can take up to {m} times today's demand (wrong)
  2. demands must be cut to {m} times what is entered for every junction to keep the pressure (right)
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED A: '⚠ At least one junction is below {pressure} at the demands as entered (a demand scale of 1). All junctions keep {pressure} only if demands are cut to a demand scale of {m} or less.' PROPOSED B: '⚠ The demands as entered (a demand scale of 1) leave at least one junction below {pressure}. The largest demand scale that keeps every junction at {pressure} or above is {m}.' B paralle...
  @@ NEEDS RULING

### from sprint 1008c-wave0

- **`lpn_export_table_current`**
  > Current
  *The finding:* 'Current' is a radio option under both Tables and Scenarios (js/looped-network.js:29716-29720). In a hydraulics tool a translator can read it as electric or water current, or as 'present time', rather than 'the one now selected'. 'All' pairs with it.
  1. the table or scenario now selected
  2. current, as flow of water or electricity
  3. up to date, not out of date
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED syn: 'Current' (this radio, under Tables and Scenarios) means the one now selected, as opposed to All; it is never a flow or electric current. Alternative English: 'Selected only' / 'All'.
  @@ NEEDS RULING
- **`lpn_file_export_workspace_tip`**
  > Download a small file holding where your boxes sit, their sizes, which are open or docked, and your pane and column sizes, plus the display options of this page, such as which help bubbles and the hover card are shown. Your projects, project settings and cookies (language, consent, units) are not in it. Load it on another screen or browser with File, Import, Workspace.
  *The finding:* 'the reading preferences of this page' is unexplained jargon: a translator cannot tell whether it means language, text size, or display toggles such as the run box, the area hint and the hover card. Same phrase in lpn_file_import_workspace_tip.
  1. language or font settings for reading text
  2. display toggles the visitor set, such as whether help bubbles and the hover card are shown
  **What this asks for:** a WORDING ruling -- is the English above right, or say what it should say.
  *The proposal:* PROPOSED English (both keys): replace 'the reading preferences of this page' with 'the display options of this page, such as which help bubbles and the hover card are shown'.
  @@ NEEDS RULING
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
  @@ NEEDS RULING

## Synonym entries to approve  (12, 10 to read @@ NEEDS RULING)

**These are translator notes (`$ec_lang_syn`), not visitor wording.** Each was written against an
English string that has since changed, or against a key that no longer exists. Say which: keep it
as is, change it (a proposal may follow), or remove it. **Your answer on the flag line is the
written permission** the rule requires; CC then applies it by hand and re-records it. A script
never edits a synonym.

- **`ip_is_lateral`**
  > <span class="ec-help" title="Selected: this reach is a segment of the test lateral, from which individual emitters withdraw water. Cleared: this reach is a main, only passing flow along to laterals not on the test path.">Lat. <span class="ec-tip">?</span></span>
  *Why stale:* the English changed after this synonym was written
  *Written against:* <span class="ec-help" title="Checked: this reach is a segment of the test lateral, from which individual emitters withdraw water. Unchecked: this reach is a main, only passing flow along to laterals not on the test path.">Lat. <span class="ec-tip">?</span></span>
  *Current synonym:* | gloss: lateral, mainline; avoid: "test" read as typical/sample
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  _Ruled 2026-10-05: What's wrong with the way it is? I am confused on this on about what's happening and why a _syn is needed._

- **`lpn_cp_restrict`**
  > Restrict these characters
  *Why stale:* no record of the English it was written against
  *Current synonym:* Forbid these characters; the opposite of Allow only these characters
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

- **`lpn_cp_restrict_tip`**
  > Restrict these characters:
  *Why stale:* no record of the English it was written against
  *Current synonym:* Forbid these characters; the opposite of Allow only these characters
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

- **`lpn_fb_intro`**
  > Canned messages (optional). Nothing is sent until you press Send.
  *Why stale:* no record of the English it was written against
  *Current synonym:* Ready-made messages; preset choices the visitor can pick instead of typing
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

- **`lpn_ff_selected`**
  > Selected junctions
  *Why stale:* the English changed after this synonym was written
  *Written against:* Selected
  *Current synonym:* Selected junctions | a pull-down option under Junctions to test; agrees with junctions, plural
  *Proposed synonym:* Only the selected junctions, The junctions selected on the map | a pull-down option under Junctions to test; agrees with junctions, plural
  *Why this proposal:* Each could stand in the pull-down row; the old text only repeated the English.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_labels_priority_node_tip`**
  > The order in which values are dropped when a label does not fit. The value numbered 1 is dropped first. When only one value is left and two labels still overlap, one of them is hidden: the one with the lower demand, with pressure nearer the middle of the range, or with elevation or head more like its neighboring nodes.
  *Why stale:* the English changed after this synonym was written
  *Written against:* The order in which values are dropped when two node labels would overlap. The value numbered 1 is dropped first. When only one value is left and the labels still overlap, one whole label is hidden: the one with the lower demand, the pressure nearer the middle of the range, or the elevation or head more like neighboring nodes.
  *Current synonym:* more like neighboring nodes = numerically closer to the neighbors' values | avoid: similar in kind
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  _Ruled 2026-10-05: Is this _syn needed?_

- **`lpn_pane_scn_alt_tip`**
  > {category} alt.: {alternative}
  *Why stale:* no record of the English it was written against
  *Current synonym:* alt. abbreviates alternative (the scenario alternative that holds this override); abbreviate it the way your language abbreviates that word
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

- **`lpn_reports_epanet`**
  > Run
  *Why stale:* no record of the English it was written against
  *Current synonym:* Run, simulation, computation, or calculation report
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

- **`lpn_scenario_push_values`**
  > Values discarded:
  *Why stale:* the English changed after this synonym was written
  *Written against:* Values thrown away:
  *Current synonym:* Values thrown away, Values discarded, Values lost, Values wiped, Values replaced, Values displaced, Values cleared, Custom values cleared | a count follows this label, not a list of values
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

- **`lpn_snip_tip_mode`**
  > Snip shape
  *Why stale:* no record of the English it was written against
  *Current synonym:* Shape to specify for screenshot
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

- **`rc_Hp`**
  > <span class="ec-help" title="Ponding (Hp > yn) is desirable because it reduces upstream erosion. (USDA)">Inlet weir head, H<sub>p</sub> <span class="ec-tip">?</span></span>
  *Why stale:* the English changed after this synonym was written
  *Written against:* <span class="ec-help" title="Ponding (Hp > yn) is good — reduces upstream erosion. (USDA)">Inlet weir head, H<sub>p</sub> <span class="ec-tip">?</span></span>
  *Current synonym:* | gloss: weir head
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

- **`rc_yn`**
  > <span class="ec-help" title="Ponding (Hp > yn) is desirable because it reduces upstream erosion. (USDA)">Normal depth in inlet channel, y<sub>n</sub> <span class="ec-tip">?</span></span>
  *Why stale:* the English changed after this synonym was written
  *Written against:* <span class="ec-help" title="Ponding (Hp > yn) is good — reduces upstream erosion. (USDA)">Normal depth in inlet channel, y<sub>n</sub> <span class="ec-tip">?</span></span>
  *Current synonym:* Enter the normal depth in the channel that delivers flow to this chute. | Upstream, not downstream: ponding reduces erosion UPSTREAM of the chute inlet (above/before it, toward the source). Do not flip the direction.
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

## lpn_  (54, 45 to read @@ NEEDS RULING)

- **`lpn_dxf_export_failed`**
  > The DXF file was not written: an error in this page stopped it ({error}).
  @@ NEEDS RULING
- **`lpn_dxf_export_no_utm`**
  > The DXF file was not written: this network lies outside the latitudes UTM covers (80° S to 84° N), and a drawing needs a flat grid to be drawn on.
  @@ NEEDS RULING
- **`lpn_dxf_export_refused`**
  > The DXF file was not written: the coordinate conversion it needs did not load. Check the connection and try again.
  @@ NEEDS RULING
- **`lpn_dxf_exported_geo`**
  > Exported {file}. Its coordinates are {crs}, in meters, not latitude and longitude.
  @@ NEEDS RULING
- **`lpn_dxf_note_blocks`**
  > Layers are named {prefix}, the asset code, a hyphen, and the alternative, as in {example}. Each element is a block inserted at scale 1 with attributes 1 unit high; scale the blocks to set the text height. Every attribute is visible; the attributes of one element are stacked in a column beside its symbol.
  _Ruled 2026-10-08: Calls page 8 October: Use as written_
- **`lpn_dxf_note_categories`**
  > {n} junctions have more than one demand category. Their {tag} attribute holds the sum of the base demands of all categories.
  @@ NEEDS RULING
- **`lpn_dxf_note_crs`**
  > Coordinates: {crs}, exactly as this project states them.
  @@ NEEDS RULING
- **`lpn_dxf_note_geo`**
  > Coordinates: {crs}, in meters, not latitude and longitude. The latitudes and longitudes of the project were converted to that grid.
  @@ NEEDS RULING
- **`lpn_dxf_note_grid`**
  > Coordinates: the X and Y of this project, in {unit}. No coordinate system is stated.
  @@ NEEDS RULING
- **`lpn_dxf_note_shortened`**
  > {n} values were longer than a DXF file allows ({max} characters), so each was shortened and ends in three periods.
  @@ NEEDS RULING
- **`lpn_export_table_all`**
  > All
  @@ NEEDS RULING
- **`lpn_export_table_current`**
  > Current
  @@ NEEDS RULING
- **`lpn_export_table_go`**
  > Export
  @@ NEEDS RULING
- **`lpn_export_table_scn_note`**
  > Results are exported only for the scenario last calculated.
  @@ NEEDS RULING
- **`lpn_export_table_title`**
  > Export to {format}
  @@ NEEDS RULING
- **`lpn_file_export_csv_tip`**
  > Download a table as the Tables pane shows it. One table comes as a single CSV file with no libraries. Several tables or scenarios come as one zip file of CSV files, with a file for each library their IDs refer to. Results are included for the scenario last calculated only.
  @@ NEEDS RULING
- **`lpn_file_export_dxf_tip`**
  > Download this network for AutoCAD and other CAD programs: nodes as symbol blocks, pipes, pumps, and valves as polylines, and every asset as a block whose attributes carry its ID and property values in the project units.
  @@ NEEDS RULING
- **`lpn_file_export_item_csv`**
  > CSV file…
  @@ NEEDS RULING
- **`lpn_file_export_item_dxf`**
  > DXF file…
  @@ NEEDS RULING
- **`lpn_file_export_item_ods`**
  > ODS file…
  @@ NEEDS RULING
- **`lpn_file_export_item_workspace`**
  > Workspace…
  @@ NEEDS RULING
- **`lpn_file_export_item_xlsx`**
  > XLSX file…
  @@ NEEDS RULING
- **`lpn_file_export_tables_tip`**
  > Download the tables as the Tables pane shows them, in one workbook with a sheet for each table (and for each scenario you choose), plus a sheet for each library their IDs refer to: patterns, curves, pipe types, and fittings. Results are included for the scenario last calculated only.
  @@ NEEDS RULING
- **`lpn_file_export_workspace_tip`**
  > Download a small file holding where your boxes sit, their sizes, which are open or docked, and your pane and column sizes, plus the display options of this page, such as which help bubbles and the hover card are shown. Your projects, project settings and cookies (language, consent, units) are not in it. Load it on another screen or browser with File, Import, Workspace.
  _Ruled 2026-10-09: Use proposed (Tom, calls page round 3)._
- **`lpn_file_import_workspace`**
  > Workspace…
  @@ NEEDS RULING
- **`lpn_file_import_workspace_tip`**
  > Apply a workspace file saved with File, Export, Workspace: box positions and sizes, docking, pane sizes and the display options of this page, such as which help bubbles and the hover card are shown. Your projects and cookies are not touched.
  _Ruled 2026-10-09: Use proposed (Tom, calls page round 3)._
- **`lpn_hotkeys_zoomwin_def`**
  > Zoom Window: drag a rectangle to zoom to.
  @@ NEEDS RULING
- **`lpn_junction_pattern_unknown`**
  > No pattern in this project is named {id}, so the junction was left as it was.
  @@ NEEDS RULING
- **`lpn_link_end_same`**
  > From and To must be different nodes.
  @@ NEEDS RULING
- **`lpn_link_end_unknown`**
  > No node has the ID {id}.
  @@ NEEDS RULING
- **`lpn_msglog_hidden`**
  > Hidden
  _Ruled 2026-10-08: Calls page 8 October: Use as written_
- **`lpn_msglog_unhide`**
  > Show
  _Ruled 2026-10-08: Calls page 8 October: Use as written_
- **`lpn_omitted_note`**
  > Left out of this run because no path leads from them to a reservoir or tank: {ids}
  @@ NEEDS RULING
- **`lpn_pane_copy_heads`**
  > Copy with column headings
  _Ruled 2026-10-09: Use proposed (Tom, calls page round 3)._
- **`lpn_result_depth`**
  > Depth
  @@ NEEDS RULING
- **`lpn_result_depth_tip`**
  > Depth of water in the tank at the time shown, measured up from the tank bottom: the head minus the tank elevation.
  @@ NEEDS RULING
- **`lpn_result_tank_volume`**
  > Usable volume
  @@ NEEDS RULING
- **`lpn_result_tank_volume_tip`**
  > Volume of water above the lowest water depth, so it is zero when the tank is at its minimum. EPANET's own tank volume also counts the water below the minimum level.
  @@ NEEDS RULING
- **`lpn_settings_default_pattern_implied`**
  > None stated (pattern {id} is used)
  @@ NEEDS RULING
- **`lpn_settings_hover_card`**
  > Show the full label on hover
  @@ NEEDS RULING
- **`lpn_settings_hover_card_tip`**
  > Rest the pointer on a node, link or customer to see its label as specified in Settings, at any scale, whether or not the label fits on the map. This is a setting for this browser, not for the project.
  _Ruled 2026-10-09: Use proposed (Tom, calls page round 3)._
- **`lpn_split_no`**
  > No
  @@ NEEDS RULING
- **`lpn_split_pipe_ask`**
  > Split pipe {id} at this node?
  _Ruled 2026-10-10: I agree with Bentley that "split" is better than "break"._
- **`lpn_split_yes`**
  > Yes
  @@ NEEDS RULING
- **`lpn_status_dismiss`**
  > Hide this message
  @@ NEEDS RULING
- **`lpn_status_hidden_tip`**
  > Show the hidden message on the map again.
  @@ NEEDS RULING
- **`lpn_workspace_confirm`**
  > Replace this browser's workspace layout with the one in the file?
  _Ruled 2026-10-08: Calls page 8 October: his own text, "Replace this browser's workspace layout with the one in the file?"_
- **`lpn_workspace_exported`**
  > Workspace saved to {file}: {n} settings.
  @@ NEEDS RULING
- **`lpn_workspace_ignored`**
  > Entries ignored because they were not recognized: {u}.
  @@ NEEDS RULING
- **`lpn_workspace_imported`**
  > Workspace applied from {file}. Settings applied: {n}. Returned to their defaults: {r}.
  @@ NEEDS RULING
- **`lpn_workspace_refused_format`**
  > This is not a workspace file saved by this page, so nothing was changed.
  @@ NEEDS RULING
- **`lpn_workspace_refused_newer`**
  > This workspace file was saved by a newer version of this page (format {version}), so nothing was changed.
  @@ NEEDS RULING
- **`lpn_workspace_refused_storage`**
  > Browser storage is full or unavailable, so the workspace was not applied.
  @@ NEEDS RULING
- **`lpn_workspace_refused_unreadable`**
  > This file could not be read as a workspace, so nothing was changed.
  @@ NEEDS RULING

---

# Strings waiting on a branch

**118 still to read**, of 121 new keys across 15 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### chore/advisers-1011 (`388dbad8`) — adds no English strings

### feat/bentley-interop (`e644f9b1`) — 99 new, 99 to read @@ NEEDS RULING

- **`lpn_alt_cat_calculation`**
  > Calculation
  @@ NEEDS RULING
- **`lpn_alt_cat_presentation`**
  > Presentation
  @@ NEEDS RULING
- **`lpn_alt_cat_topology_tip`**
  > Asset activation
  @@ NEEDS RULING
- **`lpn_change_type_base_only`**
  > Change type works in Base. A scenario can switch assets on and off in Active topology instead.
  @@ NEEDS RULING
- **`lpn_change_type_line_alternative`**
  > {id}: {property} {value}, in alternative {alternative}
  @@ NEEDS RULING
- **`lpn_control_inactive_note`**
  > These controls refer to an asset that is inactive in this scenario, so they are ignored in its run: {ids}
  @@ NEEDS RULING
- **`lpn_customer_node_inactive`**
  > This customer is assigned to a junction that is inactive in this scenario, so its demand is not part of the solve.
  @@ NEEDS RULING
- **`lpn_inp_export_flat_customers_inactive`**
  > {n} of these customers are assigned to a junction that is inactive in this scenario, so their demand is not in the file.
  @@ NEEDS RULING
- **`lpn_inp_export_flat_inactive_controls`**
  > These controls and rules refer to an asset that is inactive in this scenario, so they are not in the file: {ids}
  @@ NEEDS RULING
- **`lpn_pane_inactive_show`**
  > Include inactive topology
  @@ NEEDS RULING
- **`lpn_pane_scn_cur_only`**
  > Current scenario only
  @@ NEEDS RULING
- **`lpn_pane_scn_filter_note`**
  > {filters}. Showing {n} of {all}.
  @@ NEEDS RULING
- **`lpn_pane_scn_ov_only`**
  > Overrides only
  @@ NEEDS RULING
- **`lpn_pane_tab_scenarios`**
  > Scenarios
  @@ NEEDS RULING
- **`lpn_rule_inactive_note`**
  > These rules refer to an asset that is inactive in this scenario, so they are ignored in its run: {ids}
  @@ NEEDS RULING
- **`lpn_scenario_delete_has_children`**
  > The scenario {name} cannot be deleted while other scenarios inherit from it: {list}. Delete those first, or give them another parent.
  @@ NEEDS RULING
- **`lpn_scncmp_none_checked`**
  > No scenario is checked for comparison. Check scenarios in the Scenario manager.
  @@ NEEDS RULING
- **`lpn_settings_held_base`**
  > {base}: {value}
  @@ NEEDS RULING
- **`lpn_settings_restore_base_only`**
  > Switch to Base to restore the defaults.
  @@ NEEDS RULING
- **`lpn_settings_row_basemap`**
  > Basemap
  @@ NEEDS RULING
- **`lpn_settings_row_basemap_last`**
  > Basemap to return to
  @@ NEEDS RULING
- **`lpn_settings_row_basemap_osm`**
  > Street map
  @@ NEEDS RULING
- **`lpn_settings_row_basemap_satellite`**
  > Satellite images
  @@ NEEDS RULING
- **`lpn_settings_row_check_freq`**
  > Status check frequency
  @@ NEEDS RULING
- **`lpn_settings_row_contour_buffer`**
  > Contour buffer
  @@ NEEDS RULING
- **`lpn_settings_row_contour_fill`**
  > Contour fill
  @@ NEEDS RULING
- **`lpn_settings_row_contour_interval`**
  > Contour interval
  @@ NEEDS RULING
- **`lpn_settings_row_contour_labels`**
  > Contour labels
  @@ NEEDS RULING
- **`lpn_settings_row_contour_opacity`**
  > Contour fill opacity
  @@ NEEDS RULING
- **`lpn_settings_row_contour_terrain`**
  > Contour ground between nodes from Mapbox DEM
  @@ NEEDS RULING
- **`lpn_settings_row_customer_max_width`**
  > Show customer labels when zoomed to this map width or less
  @@ NEEDS RULING
- **`lpn_settings_row_default`**
  > {value} (default)
  @@ NEEDS RULING
- **`lpn_settings_row_elev_source_old`**
  > Elevation source (older projects)
  @@ NEEDS RULING
- **`lpn_settings_row_emitter_exponent_old`**
  > Emitter exponent (older projects)
  @@ NEEDS RULING
- **`lpn_settings_row_id_prefix`**
  > ID prefix
  @@ NEEDS RULING
- **`lpn_settings_row_label_after`**
  > Text after
  @@ NEEDS RULING
- **`lpn_settings_row_label_before`**
  > Text before
  @@ NEEDS RULING
- **`lpn_settings_row_label_drop`**
  > Drop order
  @@ NEEDS RULING
- **`lpn_settings_row_label_on`**
  > Is active
  @@ NEEDS RULING
- **`lpn_settings_row_label_show`**
  > Show order
  @@ NEEDS RULING
- **`lpn_settings_row_labels_customer`**
  > Customer labels
  @@ NEEDS RULING
- **`lpn_settings_row_labels_field`**
  > {labels}: {field}
  @@ NEEDS RULING
- **`lpn_settings_row_labels_part`**
  > {labels}: {field}, {part}
  @@ NEEDS RULING
- **`lpn_settings_row_max_check`**
  > Maximum status checks
  @@ NEEDS RULING
- **`lpn_settings_row_new_asset`**
  > New assets: {setting}
  @@ NEEDS RULING
- **`lpn_settings_row_of`**
  > {setting}, {member}
  @@ NEEDS RULING
- **`lpn_settings_row_pda_src`**
  > Pressure driven options stated in the file
  @@ NEEDS RULING
- **`lpn_settings_row_quality_option`**
  > Quality option as the file states it
  @@ NEEDS RULING
- **`lpn_settings_row_quality_step`**
  > Quality time step
  @@ NEEDS RULING
- **`lpn_settings_row_status_report`**
  > Status report
  @@ NEEDS RULING
- **`lpn_settings_row_symbol_cap_multiple`**
  > Largest symbol, as a multiple of a typical pipe length
  @@ NEEDS RULING
- **`lpn_settings_row_symbol_cap_percentile`**
  > Typical pipe length, as a percentile of all pipe lengths
  @@ NEEDS RULING
- **`lpn_settings_row_tolerance`**
  > Accuracy (older projects)
  @@ NEEDS RULING
- **`lpn_settings_row_view`**
  > Map view (center and scale)
  @@ NEEDS RULING
- **`lpn_settings_row_view_value`**
  > Center {x}, {y}; scale {s}
  @@ NEEDS RULING
- **`lpn_settings_table_category`**
  > Category
  @@ NEEDS RULING
- **`lpn_settings_table_major`**
  > Major heading
  @@ NEEDS RULING
- **`lpn_settings_table_minor`**
  > Minor heading
  @@ NEEDS RULING
- **`lpn_settings_table_no`**
  > No
  @@ NEEDS RULING
- **`lpn_settings_table_owner`**
  > Owner
  @@ NEEDS RULING
- **`lpn_settings_table_setting`**
  > Setting
  @@ NEEDS RULING
- **`lpn_settings_table_yes`**
  > Yes
  @@ NEEDS RULING
- **`lpn_settings_units_one_project`**
  > Units are the same in every scenario.
  @@ NEEDS RULING
- **`lpn_settings_view_bottom_right`**
  > Bottom right corner
  @@ NEEDS RULING
- **`lpn_settings_view_center`**
  > Map center
  @@ NEEDS RULING
- **`lpn_settings_view_save`**
  > Save this view in this scenario
  @@ NEEDS RULING
- **`lpn_settings_view_save_tip`**
  > Stores this map center and scale in the open scenario, so opening that scenario moves the map here. Moving the map afterward changes nothing until you press this again. Clear the override to follow the {base} view again.
  @@ NEEDS RULING
- **`lpn_settings_view_scale`**
  > Map scale
  @@ NEEDS RULING
- **`lpn_settings_view_scale_tip`**
  > The scale at the center of the map, as 1:N. Type 1:2000, or just 2000, to zoom to that scale.
  @@ NEEDS RULING
- **`lpn_settings_view_top_left`**
  > Top left corner
  @@ NEEDS RULING
- **`lpn_sm_add_base`**
  > Add base
  @@ NEEDS RULING
- **`lpn_sm_add_base_tip`**
  > Add another Base to this tree. A Base has no parent.
  @@ NEEDS RULING
- **`lpn_sm_add_child`**
  > Add child
  @@ NEEDS RULING
- **`lpn_sm_base_kept`**
  > The Base of a tree is not deleted. Another Base added with Add base is deleted when nothing uses it.
  @@ NEEDS RULING
- **`lpn_sm_basic_off`**
  > Basic mode is off, so the Scenario manager and the Scenarios table are shown.
  @@ NEEDS RULING
- **`lpn_sm_col_parent`**
  > Parent
  @@ NEEDS RULING
- **`lpn_sm_compare_tip`**
  > Include in Scenario comparison
  @@ NEEDS RULING
- **`lpn_sm_copy`**
  > Copy scenario…
  @@ NEEDS RULING
- **`lpn_sm_copy_alt`**
  > Copy
  @@ NEEDS RULING
- **`lpn_sm_copy_ask`**
  > Copy the scenario {name}. Make its own copies of the alternatives it uses, or share them? A shared alternative changes in every scenario that uses it.
  @@ NEEDS RULING
- **`lpn_sm_copy_own`**
  > Make copies
  @@ NEEDS RULING
- **`lpn_sm_copy_share`**
  > Share them
  @@ NEEDS RULING
- **`lpn_sm_cycle`**
  > {name} cannot be moved under one of its own children.
  @@ NEEDS RULING
- **`lpn_sm_delete`**
  > Delete the selected item. A used item is not deleted.
  @@ NEEDS RULING
- **`lpn_sm_help`**
  > Create and organize scenarios and alternatives and their inheritance here. Choose Alternatives for Scenarios in the Scenarios table.
  @@ NEEDS RULING
- **`lpn_sm_hint`**
  > Drag an item onto another to make it a child of that item. Drag between two items to reorder them. Click a selected item or press F2 to rename it, Delete to delete it, Enter to make a scenario current. Right-click for more.
  @@ NEEDS RULING
- **`lpn_sm_in_use`**
  > {name} cannot be deleted while it is used by: {list}.
  @@ NEEDS RULING
- **`lpn_sm_inherited`**
  > inherited
  @@ NEEDS RULING
- **`lpn_sm_kept`**
  > The values this scenario held in {category} were kept as the alternative {name}.
  @@ NEEDS RULING
- **`lpn_sm_make_current`**
  > Make current
  @@ NEEDS RULING
- **`lpn_sm_menu`**
  > Scenario manager…
  @@ NEEDS RULING
- **`lpn_sm_name_taken`**
  > The name {name} is already used in this tree.
  @@ NEEDS RULING
- **`lpn_sm_own_values`**
  > Own values
  @@ NEEDS RULING
- **`lpn_sm_rename`**
  > Rename
  @@ NEEDS RULING
- **`lpn_sm_shared_note`**
  > Shared with: {list}
  @@ NEEDS RULING
- **`lpn_sm_title`**
  > Scenario manager
  @@ NEEDS RULING
- **`lpn_sm_used_by`**
  > Used by scenarios: {n}
  @@ NEEDS RULING
- **`lpn_sm_used_by_none`**
  > Not used by any scenario
  @@ NEEDS RULING
- **`lpn_sm_used_by_tip`**
  > Used by: {list}
  @@ NEEDS RULING

### feat/desktop (`baba0f04`) — adds no English strings

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

### feat/label-placer (`eaa25d02`) — adds no English strings

### feat/label-placer-a (`2883c033`) — adds no English strings

### feat/label-placer-b (`18cac708`) — adds no English strings

### feat/label-placer-c (`4dc27ea1`) — adds no English strings

### feat/label-placer-d (`2e5e81c4`) — adds no English strings

### feat/match-property (`a488a397`) — 9 new, 9 to read @@ NEEDS RULING

- **`lpn_match_done_many`**
  > Matched {m} assets to {id}: {n} properties copied.
  @@ NEEDS RULING
- **`lpn_match_done_one`**
  > Matched {to} to {id}: {n} properties copied.
  @@ NEEDS RULING
- **`lpn_match_kind`**
  > Match properties applies to nodes and pipes, pumps, and valves only.
  @@ NEEDS RULING
- **`lpn_match_menu`**
  > Match properties
  @@ NEEDS RULING
- **`lpn_match_none`**
  > {to} and {id} have no properties in common to copy.
  @@ NEEDS RULING
- **`lpn_match_selected_ask`**
  > Apply the properties of {id} to the {n} other selected assets?
  @@ NEEDS RULING
- **`lpn_match_tip`**
  > Copy the properties of one asset to others. Specify the source, then each asset to change. ID, location, end nodes, description, and tag are never copied. Assets of a different type receive only the properties both types have.
  @@ NEEDS RULING
- **`lpn_mode_match`**
  > Mode: Match properties. Select the asset to copy properties from. Press Escape to cancel.
  @@ NEEDS RULING
- **`lpn_mode_match_dest`**
  > Mode: Match properties. Select each asset to receive the properties of {id}. Press Escape or right-click when finished.
  @@ NEEDS RULING

### feat/section-grid (`005d4e63`) — 1 new, 1 to read @@ NEEDS RULING

- **`points_data_points_heading`**
  > Points data<br />(use Copy to see format)
  @@ NEEDS RULING

### feat/snap (`80b257ae`) — 2 new, 2 to read @@ NEEDS RULING

- **`lpn_snap_node_on_node`**
  > {new} placed at the location of {target}. The two nodes are not connected.
  @@ NEEDS RULING
- **`lpn_snap_vertex`**
  > {link}, vertex {n}
  @@ NEEDS RULING

### feat/tank-volume (`a85e4c69`) — adds no English strings

### feat/visit-dedupe (`7b4a84bd`) — adds no English strings

### fix/default-pattern-shown (`58706793`) — 7 new, 7 to read @@ NEEDS RULING

- **`lpn_demand_pattern_constant`**
  > (constant)
  @@ NEEDS RULING
- **`lpn_demand_pattern_default`**
  > (default: {id})
  @@ NEEDS RULING
- **`lpn_library_pattern_default_deleted_none`**
  > Pattern {id} was the default demand pattern. Junctions with no pattern now use a constant demand.
  @@ NEEDS RULING
- **`lpn_library_pattern_default_deleted_to`**
  > Pattern {id} was the default demand pattern. Junctions with no pattern now use pattern {now}.
  @@ NEEDS RULING
- **`lpn_library_pattern_default_mark`**
  > (default)
  @@ NEEDS RULING
- **`lpn_library_pattern_default_tip`**
  > The default demand pattern. Change it in Settings, Default demand pattern.
  @@ NEEDS RULING
- **`lpn_settings_default_pattern_none`**
  > None (constant)
  @@ NEEDS RULING
