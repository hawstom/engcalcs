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

**0 still to read on master**, of 0 untranslated keys, of 2558 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
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

## Synonym entries to approve  (15, 13 to read @@ NEEDS RULING)

**These are translator notes (`$ec_lang_syn`), not visitor wording.** Each was written against an
English string that has since changed, or against a key that no longer exists. Say which: keep it
as is, change it (a proposal may follow), or remove it. **Your answer on the flag line is the
written permission** the rule requires; CC then applies it by hand and re-records it. A script
never edits a synonym.

- **`consent_body`**
  > May we save a random code in this browser so that we can count how many browsers use each part of this site? The code is made up on the spot, says nothing about you or your device, and records nothing you enter. Without it we cannot tell your second visit from somebody else's first.
  *Why stale:* the English changed after this synonym was written
  *Written against:* May we save a one-digit cookie in this browser to remember that we have already counted this page? It records nothing about you and nothing you enter. Without it we cannot tell your second visit from somebody else’s first.
  *Current synonym:* May we save (store, keep, put) a random code (a string of letters and digits chosen by chance) in this browser so that we can count (tally) how many browsers use each part of this site? The code is made up on the spot (created at that moment), says nothing about you or your device, and records nothing you enter. Without it we cannot tell your second visit from somebody else's first.
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

- **`consent_current_granted`**
  > You allowed this. This browser keeps a random code so that we can count it.
  *Why stale:* the English changed after this synonym was written
  *Written against:* You allowed this. We limit logging for this browser profile.
  *Current synonym:* You allowed this. A random browser code is tracked to minimize duplicate use counts.
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

- **`consent_region_label`**
  > Your choice about the counting code.
  *Why stale:* the English changed after this synonym was written
  *Written against:* Your choice about limiting logging.
  *Current synonym:* Your choice about the random browser code tracking.
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

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

None on master. Every English key here is present in at least one other language.

---

# Strings waiting on a branch

**142 still to read**, of 145 new keys across 17 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### chore/mary-1012 (`26adbad5`) — adds no English strings

### chore/pkill-guard (`b7b8c9fe`) — adds no English strings

### chore/sprint-1012 (`0d7b8730`) — adds no English strings

### feat/bentley-interop (`735199bd`) — 101 new, 101 to read @@ NEEDS RULING

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
- **`lpn_library_pattern_default_deleted_also`**
  > Scenarios that also used it as their default: {list}.
  @@ NEEDS RULING
- **`lpn_library_pattern_default_deleted_in`**
  > Pattern {id} was the default demand pattern in these scenarios: {list}.
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
- **`lpn_sm_base_named`**
  > The Base of a tree is not renamed.
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
- **`lpn_sm_current_already`**
  > This scenario is already the current scenario.
  @@ NEEDS RULING
- **`lpn_sm_cycle`**
  > {name} cannot be moved under one of its own children.
  @@ NEEDS RULING
- **`lpn_sm_delete`**
  > Delete the selected item. A used item is not deleted.
  @@ NEEDS RULING
- **`lpn_sm_help`**
  > How scenarios and alternatives work:\n\nAn override made in a scenario is stored in the alternative associated with the scenario. Associations of alternatives to scenarios are managed in the Scenarios table in the bottom pane. Creating a new scenario creates no alternatives; it uses its parent's alternatives until new alternatives are needed as overrides are created. When overrides are created in a scenario, they are stored in their respective alternative for the scenario; if the scenario has no such alternative, a new alternative is created using the name of the scenario. Example: You create a "Figure: Node and link IDs" scenario and edit a Text to say "Node and Link IDs." When you create the scenario, no alternatives are created. But at the moment you save the Text, a Text alternative called "Figure: Node and link IDs" is created with the override for the Text value. In Basic mode, you see this as simply an override in the scenario itself.\n\nHow to manage scenarios:\n\nChoose Scenarios or an alternatives category in the list at the top to show its tree.\n\nCreate a child of the selected item with Add child, or an item with no parent with Add base. A new item is named after its parent; type a name to rename it. Copy scenario copies the selected scenario and asks whether to copy the alternatives it uses or share them.\n\nDrag an item onto another to make it a child of that item. Drag an item between two items to reorder them.\n\nClick a selected item, or press F2, to rename it. Double-click a scenario, or press Enter, to make it current. Click the arrow beside an item, or press Left or Right, to collapse or expand it. Right-click an item for the same commands as the buttons.\n\nPress Delete, or click the minus button, to delete the selected item. An item in use is not deleted, and the message names what uses it.\n\nTo make a scenario use another alternative, choose that alternative in the scenario's row of the Scenarios table. An override made in a shared alternative changes every scenario that uses it.
  @@ NEEDS RULING
- **`lpn_sm_in_use`**
  > {name} cannot be deleted while it is used by: {list}.
  @@ NEEDS RULING
- **`lpn_sm_inherited`**
  > inherited
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
- **`lpn_sm_none_selected`**
  > Select an item in the tree first.
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

### feat/convert-search (`b71bb912`) — adds no English strings

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

### feat/match-property (`daa13a9c`) — 9 new, 9 to read @@ NEEDS RULING

- **`lpn_copy_props_done`**
  > Copied properties of {id}.
  @@ NEEDS RULING
- **`lpn_copy_props_menu`**
  > Copy properties
  @@ NEEDS RULING
- **`lpn_paste_done_many`**
  > Pasted properties of {id} to {m} assets. Values changed: {n}.
  @@ NEEDS RULING
- **`lpn_paste_done_one`**
  > Pasted properties of {id} to {to}. Values changed: {n}.
  @@ NEEDS RULING
- **`lpn_paste_props_menu`**
  > Paste properties to selection
  @@ NEEDS RULING
- **`lpn_paste_props_off_kind`**
  > No selected asset can take the copied properties.
  @@ NEEDS RULING
- **`lpn_paste_props_off_none`**
  > Nothing is copied. Right-click an asset and choose Copy properties.
  @@ NEEDS RULING
- **`lpn_paste_skip_breakdown`**
  > Not pasted: {n} (demand is a list of categories).
  @@ NEEDS RULING
- **`lpn_paste_skip_valve`**
  > Not pasted: {n} (the valve types differ).
  @@ NEEDS RULING

### feat/shape (`554c2b24`) — 27 new, 27 to read @@ NEEDS RULING

- **`lpn_file_import_shapes`**
  > Import GeoJSON shapes…
  @@ NEEDS RULING
- **`lpn_file_import_shapes_tip`**
  > Read the points, lines, and polygons of a GeoJSON file into this project as Shapes. Network assets in the file are not imported; import the network from an EPANET file. The project must be georeferenced or state a coordinate system.
  @@ NEEDS RULING
- **`lpn_geojson_import_done`**
  > {n} Shapes imported from {file}.
  @@ NEEDS RULING
- **`lpn_geojson_import_done_one`**
  > One Shape imported from {file}.
  @@ NEEDS RULING
- **`lpn_geojson_import_holes`**
  > {n} polygon holes not imported. A Shape has one boundary.
  @@ NEEDS RULING
- **`lpn_geojson_import_holes_one`**
  > One polygon hole not imported. A Shape has one boundary.
  @@ NEEDS RULING
- **`lpn_geojson_import_local`**
  > GeoJSON positions are latitude and longitude, and this project has no place on the Earth to which they can be converted. Georeference it first with Map, World map, Attach, then import again.
  @@ NEEDS RULING
- **`lpn_geojson_import_parts`**
  > {n} multipart features imported as one Shape for each part.
  @@ NEEDS RULING
- **`lpn_geojson_import_parts_one`**
  > One multipart feature imported as one Shape for each part.
  @@ NEEDS RULING
- **`lpn_geojson_import_renamed`**
  > {n} feature names cannot be Shape IDs and are kept with the Shapes: {list}.
  @@ NEEDS RULING
- **`lpn_geojson_import_renamed_one`**
  > One feature name cannot be a Shape ID and is kept with the Shape: {list}.
  @@ NEEDS RULING
- **`lpn_geojson_import_skipped`**
  > {n} features not imported: {list}.
  @@ NEEDS RULING
- **`lpn_geojson_import_skipped_one`**
  > One feature not imported: {list}.
  @@ NEEDS RULING
- **`lpn_geojson_import_unreadable`**
  > {file} is not a GeoJSON file: {detail}
  @@ NEEDS RULING
- **`lpn_geojson_import_why_geometry`**
  > not a point, line, or polygon
  @@ NEEDS RULING
- **`lpn_geojson_import_why_network`**
  > network asset
  @@ NEEDS RULING
- **`lpn_geojson_import_why_position`**
  > position not a valid latitude and longitude
  @@ NEEDS RULING
- **`lpn_mode_add_shape`**
  > Mode: Add Shape. Specify each point. Specify the last point again or press Enter to finish; specify the first point to close a polygon.
  @@ NEEDS RULING
- **`lpn_pane_paste_shape_bad_points`**
  > Row {row}: {text} is not a list of points. Write each point as {pair}, with a point (.) as the decimal mark, and separate the points with |.
  @@ NEEDS RULING
- **`lpn_pane_paste_shape_closed_few`**
  > Row {row}: a closed Shape needs at least three points.
  @@ NEEDS RULING
- **`lpn_pane_paste_shape_no_points`**
  > Row {row}: a new Shape needs its Points.
  @@ NEEDS RULING
- **`lpn_pane_shape_closed`**
  > Closed
  @@ NEEDS RULING
- **`lpn_pane_shape_points`**
  > Points
  @@ NEEDS RULING
- **`lpn_pane_tab_shapes`**
  > Shapes
  @@ NEEDS RULING
- **`lpn_snap_shape_point`**
  > {shape}, point {n}
  @@ NEEDS RULING
- **`lpn_tool_add_shape`**
  > Shape
  @@ NEEDS RULING
- **`lpn_tool_add_shape_tip`**
  > Draw a point, a polyline, or a polygon on the map. A Shape is annotation and is not part of the network. Specify each point, then specify the last point again, press Enter, or right-click to finish. Specify the first point again to close the Shape into a polygon.
  @@ NEEDS RULING

### feat/si-example (`30708037`) — 4 new, 4 to read @@ NEEDS RULING

- **`lpn_ex_net2_si_desc`**
  > Litres per second, with metres and millimetres. An EPANET example at Branford, Connecticut, converted from gallons per minute, feet and inches: 35 junctions and 1 tank, with no reservoir and no pump. Fluoride, a non-reactive substance, enters at one source.
  @@ NEEDS RULING
- **`lpn_ex_net2_si_title`**
  > EPANET Net2, L/s (SI)
  @@ NEEDS RULING
- **`lpn_ex_net3_si_desc`**
  > Litres per second, with metres and millimetres. An EPANET example at Novato, California, converted from gallons per minute, feet and inches, with the world map behind it: 92 junctions, 3 tanks and 2 reservoirs, no valves, about 8 km square. A 24-hour extended-period simulation, with a source trace from the Lake.
  @@ NEEDS RULING
- **`lpn_ex_net3_si_title`**
  > EPANET Net3, L/s (SI)
  @@ NEEDS RULING

### fix/paste-column (`a4e50f15`) — adds no English strings

### fix/specific-gravity (`1675818f`) — 1 new, 1 to read @@ NEEDS RULING

- **`lpn_settings_specific_gravity_tip`**
  > Density of the fluid relative to water. It scales pressure in every unit, because a pressure in m or ft is a column of water, and it does not change head or HGL. It changes no flow.
  @@ NEEDS RULING
