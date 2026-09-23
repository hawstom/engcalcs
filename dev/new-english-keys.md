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

**30 still to read on master**, of 194 untranslated keys, of 2044 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (194, 30 to read @@ NEEDS RULING)

- **`lpn_convas_cancelled`**
  > Nothing was converted. The copy is closed, and the original project is unchanged.
  @@ NEEDS RULING
- **`lpn_convas_coordsys_tip`**
  > The coordinate system the copy is converted to. When it differs from this project's, two placement steps follow. A project that already knows where it is opens both steps already answered, so you can accept them as they are or make changes.
  @@ NEEDS RULING
- **`lpn_convas_done`**
  > The converted copy is {name}. The original project is unchanged.
  @@ NEEDS RULING
- **`lpn_convas_epsg`**
  > EPSG coordinate system
  @@ NEEDS RULING
- **`lpn_convas_epsg_tip`**
  > Choose a coordinate system from the EPSG register. Latitude and longitude is WGS 84 / Pseudo-Mercator (EPSG:3857).
  @@ NEEDS RULING
- **`lpn_convas_from`**
  > This project: {crs}
  @@ NEEDS RULING
- **`lpn_convas_no_transform`**
  > This page has no transform for that coordinate system, so it cannot convert to or from it. Nothing was converted.
  @@ NEEDS RULING
- **`lpn_convas_none_tip`**
  > Local coordinates in the length unit, with no world map.
  @@ NEEDS RULING
- **`lpn_convas_ok`**
  > Convert
  @@ NEEDS RULING
- **`lpn_convas_oneway`**
  > Converting back is a second conversion, not an undo. A number converted and converted back may not return exactly as it was typed.
  @@ NEEDS RULING
- **`lpn_convas_round`**
  > Round converted values
  @@ NEEDS RULING
- **`lpn_convas_round_flow`**
  > Demand and flow
  @@ NEEDS RULING
- **`lpn_convas_round_none`**
  > No rounding
  @@ NEEDS RULING
- **`lpn_convas_round_tip`**
  > Rounds only the numbers this conversion rewrites, to the nearest step you choose. Values whose unit does not change are left as they are.
  @@ NEEDS RULING
- **`lpn_convas_title`**
  > Convert as
  @@ NEEDS RULING
- **`lpn_convas_units_tip`**
  > The units the copy is converted to. Every number these units decide is rewritten once, into the copy. The original keeps its own numbers and units.
  @@ NEEDS RULING
- **`lpn_convas_unnamed`**
  > Unnamed (local) georeference
  @@ NEEDS RULING
- **`lpn_convas_unnamed_tip`**
  > Local coordinates in the length unit, with the world map attached at the place the project is.
  @@ NEEDS RULING
- **`lpn_coord_off_world`**
  > That is off the map. Pseudo Mercator latitude ranges from -85.05 to 85.05 and longitude ranges from -180 to 180.
  _Ruled OK 2026-09-17._
- **`lpn_copy_of`**
  > Copy of {name}
  _Ruled OK 2026-09-23._
- **`lpn_crs_unnamed`**
  > unnamed
  _Ruled OK 2026-09-23._
- **`lpn_crs_unplaceable`**
  > This page has no transform for that coordinate system, so a project on it opens on its own plane: no map behind the drawing, no arrival at the place you searched for, and no elevations from the land surface. Your coordinates are unaffected. Another coordinate system covering the same area will have all three.
  @@ NEEDS RULING
- **`lpn_crs_unplaceable_mark`**
  > (no map)
  _Ruled 2026-09-23: Please explain to me what this is in response to. What's the case for this label?_
- **`lpn_customer_detached`**
  > ⚠ This customer is not connected to a pipe, so its demand is not in the answers. Delete it, or draw a pipe and move the customer onto it.
  _Ruled OK 2026-09-23._
- **`lpn_customer_detached_count`**
  > {n} customers are not connected to a pipe. Their demand is not accounted for.
  _Ruled OK 2026-09-23._
- **`lpn_customer_fixed_head`**
  > ⚠ The near end of that pipe holds a fixed water surface, so this demand does not affect the simulation.
  _Ruled OK 2026-09-23._
- **`lpn_customer_heading`**
  > Customer {id}
  _Ruled OK 2026-09-17._
- **`lpn_engine_bar_label`**
  > Solver loading progress
  _Ruled OK 2026-09-23._
- **`lpn_engine_wait`**
  > Loading solver. Results delayed momentarily. Continue working.
  _Ruled OK 2026-09-23._
- **`lpn_engine_wait_bytes`**
  > Solver {kb} KB loaded so far. The total is not available, so the percentage of completion is unknown.
  _Ruled OK 2026-09-23._
- **`lpn_engine_wait_pct`**
  > Solver {percent}% loaded.
  _Ruled OK 2026-09-23._
- **`lpn_ff_clear`**
  > Clear rings
  _Ruled OK 2026-09-23._
- **`lpn_field_coord_tip`**
  > Type a coordinate location to place this node exactly. In a scenario this location applies in that scenario alone, just as dragging it does; in Base it places the node everywhere.
  _Ruled OK 2026-09-17._
- **`lpn_field_desc`**
  > Description
  _Ruled OK 2026-09-17._
- **`lpn_field_desc_tip`**
  > For your own use, such as a street corner or what a pipe is made of. It is carried into and out of the EPANET file, where it sits at the end of the part's own row. No calculation reads it. A line break becomes a space, because the file has nowhere to put one.
  _Ruled OK 2026-09-17._
- **`lpn_field_meter_count`**
  > Number of services
  _Ruled OK 2026-09-23._
- **`lpn_field_meter_count_tip`**
  > How many identical services this one customer stands for, so that forty-two single-family connections along one main can be one symbol in one place. The total below is the demand above times this count.
  _Ruled OK 2026-09-23._
- **`lpn_field_meter_demand`**
  > Demand per service
  _Ruled OK 2026-09-17._
- **`lpn_field_meter_demand_tip`**
  > What each service at this customer requires. Find and replace can leverage the distinction between blank and 0.
  _Ruled 2026-09-23: Edited. You make the pedantic point in multiple locations that blank is not the same as zero, but this is not a helpful thing to say; it's a truth without information. Instead, say what blank would be used for. I am making an attempt, but I want you to edit my wording if I misunderstood. Please make this a general point learned once we achieve mutual understanding about this._
- **`lpn_field_meter_lumped`**
  > Added to node
  _Ruled OK 2026-09-17._
- **`lpn_field_meter_lumped_tip`**
  > Nearest node; this customer's demands are added there.
  _Ruled OK 2026-09-23._
- **`lpn_field_meter_offset`**
  > Offset from the pipe
  _Ruled OK 2026-09-23._
- **`lpn_field_meter_offset_tip`**
  > Positive is to the right of the pipe looking from its first node toward its second. Typing a value here can move the customer to the other side of the main, and it always squares the service line to the main.
  _Ruled OK 2026-09-23._
- **`lpn_field_meter_pattern_tip`**
  > How this customer’s demand rises and falls through the run. It multiplies the total demand, so it acts on every service this customer stands for. Leave it at No pattern to follow the project’s Default demand pattern.
  _Ruled 2026-09-23: Edited. Note that I removed your habitual "and it" construction where you mean "If this, then that."_
- **`lpn_field_meter_pipe`**
  > Connected asset
  _Ruled 2026-09-17: Edited. We want to allow connecting directly to a node._
- **`lpn_field_meter_pipe_suggest`**
  > The nearest asset is {id}. Type it here to serve this customer from it.
  _Ruled OK 2026-09-23._
- **`lpn_field_meter_pipe_tip`**
  > The asset that this service connects to. Type another one here or in the Customers table to change it, or drag the connection point to a different asset.
  _Ruled 2026-09-23: This is stale. Connection point can no longer be dragged. Edited. Check._
- **`lpn_field_meter_station`**
  > Station along the pipe (%)
  _Ruled 2026-09-17: OK. We need to rule on whether we allow non-perpendicular connections._
- **`lpn_field_meter_station_tip`**
  > How far along the pipe the service connects, as a percentage of the pipe from its first node to its second. 0 is at one end and 100 is at the other. The circle on the pipe does the same thing with the pointer.
  _Ruled 2026-09-17: We need to rule on whether we allow non-perpendicular connections._
- **`lpn_field_meter_total`**
  > Total demand
  _Ruled OK 2026-09-17._
- **`lpn_field_meter_total_tip`**
  > The demand per service times the number of services. This is the number added to the junction named below.
  _Ruled OK 2026-09-17._
- **`lpn_field_text_all_zoom`**
  > Show at all zoom levels
  _Ruled 2026-09-23: Default needs to be off. I see that you turned it on by default, and that already has caused me grief. Only a few texts would be privileged to have this on. Otherwise ok._
- **`lpn_field_text_all_zoom_tip`**
  > Keep this text on the drawing however far out you zoom. Untick it and the text hides with the other labels once the view is wider than the labeling threshold set under Map and page.
  _Ruled 2026-09-23: Default needs to be off. I see that you turned it on by default, and that already has caused me grief. Only a few texts would be privileged to have this on. Otherwise ok._
- **`lpn_file_import_survey`**
  > Import surveyed points…
  _Ruled OK 2026-09-23._
- **`lpn_file_import_survey_tip`**
  > Read a list of surveyed points from a text file and make one junction at each point, taking the new-asset settings for everything the file does not state. No pipes are drawn, and no row is ever dropped without being named. It reads the coordinate system this project already uses, georeferenced or not.
  _Ruled OK 2026-09-23._
- **`lpn_georef_answered`**
  > This project is already georeferenced, so the network is already on the map and nothing has been moved. Check that it is in the right place, then press the Put the model here button and the Keep this placement button.
  @@ NEEDS RULING
- **`lpn_inp_export_flat_coords`**
  > An EPANET file holds one position for each node. This scenario places {n} of them somewhere else, and those are the positions in the file. Every other scenario keeps its own positions in your project file alone.
  _Ruled 2026-09-17: This is unclear. Please proofread and reword._
- **`lpn_inp_export_flat_customers`**
  > An EPANET file has no customers. The demand of the {n} customers in this project goes into the file as a demand row on the junction each one is added to, and each row is named with the customer’s tag. What the file cannot hold is the customer: where it sits, which pipe serves it, where along that pipe the service connects, and how many services one customer stands for. Your own project file keeps all of that.
  _Ruled OK 2026-09-23._
- **`lpn_labels_customer_note`**
  > A customer label shows the values ticked here. It is drawn at the same text size as every other label on the map.
  _Ruled OK 2026-09-23._
- **`lpn_labels_customer_width`**
  > Widest view that attempts to display customer labels
  _Ruled OK 2026-09-23._
- **`lpn_labels_customer_width_tip`**
  > How wide the drawing on screen may be before customer labels stop being drawn, measured across the window. Zoom out past this and no customer label is placed. Type 0 to leave customers unlabelled.
  _Ruled OK 2026-09-23._
- **`lpn_library_import`**
  > Import libraries…
  _Ruled OK 2026-09-23._
- **`lpn_library_import_added`**
  > Copied in: {names}
  _Ruled OK 2026-09-17._
- **`lpn_library_import_choose`**
  > Choose what to copy from {file}
  _Ruled OK 2026-09-23._
- **`lpn_library_import_conflict`**
  > Skipped, because this project already has one of the same name: {names}. Nothing here was changed. Rename either one and import again if you want both.
  _Ruled OK 2026-09-17._
- **`lpn_library_import_count`**
  > {name} ({count})
  _Ruled OK 2026-09-23._
- **`lpn_library_import_curve_shape`**
  > These curves came across exactly as the file wrote them, and a run cannot use one until its first column rises from each point to the next: {names}
  _Ruled 2026-09-17: Can you clarify "first column rises from each point to the next"?_
- **`lpn_library_import_go`**
  > Import
  _Ruled OK 2026-09-23._
- **`lpn_library_import_heading`**
  > Imported from {file}
  _Ruled OK 2026-09-17._
- **`lpn_library_import_needs_fittings`**
  > These pipe types refer to a fittings list this project does not have: {names}. Import the fittings library from the same file and they will find it.
  _Ruled OK 2026-09-17._
- **`lpn_library_import_no_libraries`**
  > That project file has no libraries to copy.
  _Ruled OK 2026-09-23._
- **`lpn_library_import_none`**
  > That project file has none of these to copy.
  _Ruled OK 2026-09-17._
- **`lpn_library_import_note`**
  > Each library you check is copied in whole. Delete what you do not want afterwards, the way you delete any other entry.
  _Ruled OK 2026-09-23._
- **`lpn_library_import_tip`**
  > Choose another project file and copy whole libraries from it into this project. Anything whose name is already taken here is skipped and listed, so nothing you already have is changed.
  _Ruled OK 2026-09-23._
- **`lpn_library_import_units`**
  > Warning: Units mismatch. Will be imported as is. Not recommended.
  _Ruled OK 2026-09-23._
- **`lpn_library_import_units_line`**
  > {name}: this project shows {mine}, the file shows {theirs}.
  _Ruled OK 2026-09-23._
- **`lpn_lock_age_edited`**
  > It was last edited {x} ago.
  _Ruled OK 2026-09-17._
- **`lpn_lock_age_inuse`**
  > It has been in use for {x}.
  _Ruled OK 2026-09-17._
- **`lpn_lock_age_never_saved`**
  > Nothing has been saved to this file yet.
  _Ruled OK 2026-09-17._
- **`lpn_lock_age_saved`**
  > It was last saved {x} ago.
  _Ruled OK 2026-09-17._
- **`lpn_lock_age_unknown`**
  > There is no record of how long it has been in use, or when it was last saved or edited.
  _Ruled OK 2026-09-17._
- **`lpn_lock_ask`**
  > Ask
  _Ruled OK 2026-09-17._
- **`lpn_lock_ask_failed`**
  > Your message could not be delivered. Either nobody has this file open now, or the server could not be reached.
  _Ruled OK 2026-09-17._
- **`lpn_lock_ask_prompt`**
  > Who should we say is asking? Your initials are ideal. They are sent to whoever has the file open, and are stored only in this browser.
  _Ruled 2026-09-17: Edited. Please review._
- **`lpn_lock_ask_sent`**
  > We have asked whoever has this file open to close it. They will see it within a minute, if their page is still open. Nothing else has changed, and the file is still theirs until they close it.
  _Ruled OK 2026-09-17._
- **`lpn_lock_open_care`**
  > To avoid data loss, choose carefully from the options below.
  _Ruled OK 2026-09-17._
- **`lpn_lock_open_choices_ask`**
  > "Ask" tells whoever has this file open that you would like it, and changes nothing else. "Open read-only" lets you look at it and change anything you like, without being able to save here. "Break lock" lets you save over the file; their unsaved work is not lost, but they will no longer be able to save it here, and somebody may have to merge the two by hand.
  _Ruled OK 2026-09-23._
- **`lpn_lock_open_inuse`**
  > This file appears to be in use.
  _Ruled OK 2026-09-17._
- **`lpn_lock_requested`**
  > {name} would like to edit this file. When you are ready, save your work and use File, Close project to hand it over.
  _Ruled OK 2026-09-17._
- **`lpn_map_attach_add`**
  > Attach
  _Ruled OK 2026-09-23._
- **`lpn_map_attach_done`**
  > The world map is behind your drawing now, and your project is unchanged. Use Map, World map, Detach to take it away again.
  _Ruled OK 2026-09-23._
- **`lpn_map_attach_menu`**
  > World map…
  _Ruled OK 2026-09-23._
- **`lpn_map_attach_none`**
  > There is no world map attached to this project yet. Use Map, World map, Attach first.
  _Ruled OK 2026-09-23._
- **`lpn_map_attach_readjust`**
  > Re-adjust
  _Ruled OK 2026-09-23._
- **`lpn_map_attach_readjust_tip`**
  > Return to Step 2 of the map attachment process.
  _Ruled OK 2026-09-23._
- **`lpn_map_attach_remove`**
  > Detach
  _Ruled OK 2026-09-23._
- **`lpn_map_attach_remove_tip`**
  > Take the world map away. The drawing and its coordinates are untouched either way.
  _Ruled OK 2026-09-17._
- **`lpn_map_attach_removed`**
  > The world map is gone, and the drawing is exactly as it was.
  _Ruled OK 2026-09-17._
- **`lpn_map_attach_scale_from`**
  > Scale from the current size…
  _Ruled OK 2026-09-23._
- **`lpn_map_attach_scale_from_bad`**
  > Type a single number greater than zero.
  _Ruled OK 2026-09-23._
- **`lpn_map_attach_scale_from_done`**
  > The map is resized, and your drawing and every coordinate in it are exactly as they were.
  _Ruled OK 2026-09-23._
- **`lpn_map_attach_scale_from_prompt`**
  > Scale the map from its current size, about the middle of your drawing. 1 keeps it the same, 1.1 makes it 10% bigger, 0.9 makes it 10% smaller.
  _Ruled OK 2026-09-23._
- **`lpn_map_attach_tip`**
  > Attach the world map to this project without changing it any other way.
  _Ruled OK 2026-09-17._
- **`lpn_mapgeo_cancelled`**
  > The world map is back where it was, and your drawing never moved.
  _Ruled OK 2026-09-23._
- **`lpn_mapgeo_dial_help`**
  > Slide the two bars, or type in the boxes above them, to make the map bigger or smaller and to rotate it. The middle of each bar is the fit step 1 left, so 1 and 0 mean leave it alone. Arrow keys work on both.
  _Ruled OK 2026-09-23._
- **`lpn_mapgeo_dial_size`**
  > Map size
  _Ruled OK 2026-09-23._
- **`lpn_mapgeo_dial_size_read`**
  > {f} times
  _Ruled OK 2026-09-23._
- **`lpn_mapgeo_dial_turn`**
  > Rotate the map
  _Ruled OK 2026-09-23._
- **`lpn_mapgeo_dial_turn_read`**
  > {d} degrees
  _Ruled OK 2026-09-23._
- **`lpn_mapgeo_finish`**
  > Georeference here
  _Ruled OK 2026-09-23._
- **`lpn_mapgeo_gestures`**
  > Zoom moves your drawing and the map together, so you can see how well they line up. Dragging moves the map only.
  _Ruled OK 2026-09-23._
- **`lpn_mapgeo_hint1`**
  > Pan and zoom the map behind your drawing, or search for a place, or type a latitude and longitude. Then press Place approximately.
  _Ruled OK 2026-09-23._
- **`lpn_mapgeo_hint2`**
  > Drag anywhere to slide the map under your drawing. Your drawing and every coordinate in it stay exactly where they are. Press Georeference here when the map is right.
  _Ruled OK 2026-09-23._
- **`lpn_mapgeo_intro`**
  > Your drawing is on a map of the whole world, in the ocean at zero latitude and zero longitude. Find your own place first: pan and zoom the map behind the drawing, search for a place name, or type a latitude and longitude. The drawing itself does not move.
  _Ruled OK 2026-09-23._
- **`lpn_mapgeo_locked`**
  > Finish with the Georeference here button, or press Cancel, before you switch projects or save. The world map is still being placed.
  _Ruled OK 2026-09-23._
- **`lpn_mapgeo_place`**
  > Place approximately
  _Ruled OK 2026-09-23._
- **`lpn_mapgeo_readjust_intro`**
  > Your drawing is where you last placed it. To move it somewhere else, pan and zoom the map behind the drawing, search for a place name, or type a latitude and longitude. The drawing itself does not move.
  @@ NEEDS RULING
- **`lpn_mapgeo_step1`**
  > Step 1 of 2: find your place in the world
  _Ruled OK 2026-09-23._
- **`lpn_mapgeo_step2`**
  > Step 2 of 2: fit the map behind your drawing
  _Ruled OK 2026-09-23._
- **`lpn_meter_pattern_unknown`**
  > No pattern in this project is named {id}, so the customer was left as it was.
  _Ruled OK 2026-09-23._
- **`lpn_meter_pick_pipe`**
  > Now click the pipe or the node that serves this customer. The customer stays where you put it. Press Escape to cancel.
  _Ruled OK 2026-09-23._
- **`lpn_meter_pipe_unknown`**
  > Nothing in this project is named {id}, so the customer was left where it was.
  _Ruled OK 2026-09-23._
- **`lpn_meter_placed`**
  > Customer {id} added. Its description and demand are typed in the Customers table, or press it in Select to open its box.
  _Ruled OK 2026-09-23._
- **`lpn_mode_add_meter`**
  > Customer: click where the customer is, then click the pipe or the node that serves it. Or use Esc to cancel.
  _Ruled OK 2026-09-23._
- **`lpn_node_customers`**
  > Customer demands
  _Ruled OK 2026-09-23._
- **`lpn_node_customers_sum`**
  > {total} {unit} from {n} Customers
  _Ruled OK 2026-09-23._
- **`lpn_node_customers_tip`**
  > List of customers added at this node (because this was nearest). Customer demands are in addition to other demands listed here. A customer is edited where it sits on the map or in the Customers table.
  _Ruled OK 2026-09-23._
- **`lpn_pane_goto_tip`**
  > Zoom & select
  _Ruled OK 2026-09-23._
- **`lpn_pane_not_used`**
  > Not used
  _Ruled OK 2026-09-23._
- **`lpn_pane_tab_customers`**
  > Customers
  _Ruled OK 2026-09-17._
- **`lpn_settings_label_always`**
  > Always show labels
  _Ruled OK 2026-09-23._
- **`lpn_settings_label_max_width`**
  > Show labels when zoomed to this map width or less
  _Ruled OK 2026-09-23._
- **`lpn_settings_label_max_width_tip`**
  > Labels are drawn only while the map is this wide or narrower. Leave the box blank to draw them at every zoom. Symbols stop growing at this same width, so when the map is wider they keep their size on the ground and get smaller on the screen. With the box blank, symbols stop growing where a junction would be as wide as the 10th-percentile pipe length. Reservoirs and tanks keep their screen size at every zoom.
  _Ruled 2026-09-23: Should we offer the same hint here as for customer labels (0 to hide always) and remove the Thematic map toggle? Otherwise okay._
- **`lpn_settings_label_use_view`**
  > Use current view
  _Ruled OK 2026-09-23._
- **`lpn_settings_sym_customer`**
  > Customer
  _Ruled OK 2026-09-23._
- **`lpn_survey_axis_east`**
  > Easting
  _Ruled OK 2026-09-23._
- **`lpn_survey_axis_north`**
  > Northing
  _Ruled OK 2026-09-23._
- **`lpn_survey_cancelled`**
  > Nothing was created and nothing was changed.
  _Ruled OK 2026-09-17._
- **`lpn_survey_confirm_junction`**
  > {n} junction(s) found. Proceed?
  _Ruled OK 2026-09-23._
- **`lpn_survey_confirm_reservoir`**
  > {n} reservoir(s) found. Proceed?
  _Ruled OK 2026-09-23._
- **`lpn_survey_confirm_tank`**
  > {n} tank(s) found. Proceed?
  _Ruled OK 2026-09-23._
- **`lpn_survey_create`**
  > Create nodes
  _Ruled OK 2026-09-23._
- **`lpn_survey_err_ambiguous_coord`**
  > More than one column in that file could be the {axis} ({detail}), and this page will not choose between them. Leave one of them named as the {axis} and try again.
  _Ruled OK 2026-09-23._
- **`lpn_survey_err_empty`**
  > That file has nothing in it.
  _Ruled OK 2026-09-17._
- **`lpn_survey_err_no_points`**
  > Not one row of that file could be read as a surveyed point. Rows read: {detail}
  _Ruled OK 2026-09-17._
- **`lpn_survey_err_unreadable`**
  > That file could not be read as a surveyed point list.
  _Ruled OK 2026-09-17._
- **`lpn_survey_format_internal`**
  > specified internally
  @@ NEEDS RULING
- **`lpn_survey_format_label`**
  > File format:
  @@ NEEDS RULING
- **`lpn_survey_note_ambiguous_elev`**
  > More than one column could be the elevation, so none of them was read.
  @@ NEEDS RULING
- **`lpn_survey_note_bad_coord`**
  > The {axis} does not read as a number.
  @@ NEEDS RULING
- **`lpn_survey_note_bad_elev`**
  > Non-numeric elevation. Imported without elevation.
  @@ NEEDS RULING
- **`lpn_survey_note_blank_rows`**
  > Blank lines skipped: {detail}.
  _Ruled OK 2026-09-23._
- **`lpn_survey_note_coord_missing`**
  > The {axis} cell is empty.
  _Ruled OK 2026-09-23._
- **`lpn_survey_note_coord_range`**
  > The {axis} is outside the range this project allows.
  _Ruled OK 2026-09-23._
- **`lpn_survey_note_header_unread`**
  > The first line was skipped: it names no columns this page knows.
  _Ruled OK 2026-09-23._
- **`lpn_survey_note_id_duplicate`**
  > Name already used earlier in this file, new name assigned.
  _Ruled OK 2026-09-23._
- **`lpn_survey_note_id_invalid`**
  > Name cannot be used here, new name assigned.
  _Ruled OK 2026-09-23._
- **`lpn_survey_note_id_taken`**
  > Name already in project, new name assigned.
  _Ruled OK 2026-09-23._
- **`lpn_survey_note_line`**
  > Line {line}: {sev}: {code}: {text}
  _Ruled OK 2026-09-23._
- **`lpn_survey_note_row_short`**
  > Too few columns for the file format above.
  _Ruled OK 2026-09-23._
- **`lpn_survey_read_error`**
  > That file could not be read from your disk.
  _Ruled OK 2026-09-17._
- **`lpn_survey_report_clean`**
  > Every point in the file came across, and nothing was changed on the way in.
  _Ruled OK 2026-09-17._
- **`lpn_survey_report_junction`**
  > {n} junction(s) imported, {m} with elevation.
  _Ruled OK 2026-09-23._
- **`lpn_survey_report_notes`**
  > Import errors and notes:
  _Ruled OK 2026-09-23._
- **`lpn_survey_report_reservoir`**
  > {n} reservoir(s) imported, {m} with elevation.
  _Ruled OK 2026-09-23._
- **`lpn_survey_report_tank`**
  > {n} tank(s) imported, {m} with elevation.
  _Ruled OK 2026-09-23._
- **`lpn_survey_sev_error`**
  > error
  _Ruled OK 2026-09-23._
- **`lpn_survey_sev_warning`**
  > warning
  _Ruled OK 2026-09-23._
- **`lpn_survey_type_label`**
  > Asset type:
  _Ruled OK 2026-09-23._
- **`lpn_terrain_http`**
  > The terrain service answered with an error ({status}), so no elevation was changed. Nothing is wrong with your network.
  _Ruled OK 2026-09-23._
- **`lpn_terrain_no_place`**
  > None of those nodes has a position on the Earth, so nothing was sent and no elevation was changed. Reading the land surface needs a project in latitude and longitude, or one on a projection this page can place.
  _Ruled OK 2026-09-23._
- **`lpn_terrain_rate_limited`**
  > The terrain service is asking us to slow down (429), so no elevation was changed. Try again in a minute.
  _Ruled OK 2026-09-23._
- **`lpn_time_clock_day`**
  > Day {day}, {clock}
  @@ NEEDS RULING
- **`lpn_tool_add_meter`**
  > Customer
  _Ruled OK 2026-09-23._
- **`lpn_tool_add_meter_tip`**
  > Click where the customer is, then click the pipe or the node that serves it. The demand you give the customer is added to the junction at the near end of that pipe.
  _Ruled OK 2026-09-23._
- **`lpn_ts_add`**
  > Add selected
  _Ruled OK 2026-09-17._
- **`lpn_ts_add_none`**
  > Nothing of that kind is chosen on the map.
  _Ruled OK 2026-09-17._
- **`lpn_ts_add_tip`**
  > Put everything now chosen on the map onto the graph.
  _Ruled OK 2026-09-17._
- **`lpn_ts_axis_time`**
  > Elapsed time
  _Ruled OK 2026-09-17._
- **`lpn_ts_chip_tip`**
  > Take {id} off the graph
  _Ruled OK 2026-09-17._
- **`lpn_ts_clear`**
  > Remove all
  _Ruled OK 2026-09-17._
- **`lpn_ts_group_links`**
  > Links
  _Ruled OK 2026-09-17._
- **`lpn_ts_group_nodes`**
  > Nodes
  _Ruled OK 2026-09-17._
- **`lpn_ts_group_tip`**
  > Whether the graph shows nodes or links.
  _Ruled OK 2026-09-17._
- **`lpn_ts_menu`**
  > Time series
  _Ruled OK 2026-09-17._
- **`lpn_ts_no_frames`**
  > No extended period results yet. Press Calculate to run the simulation.
  _Ruled OK 2026-09-17._
- **`lpn_ts_none`**
  > Nothing to graph yet. Choose assets on the map and press Add selected.
  _Ruled OK 2026-09-17._
- **`lpn_ts_quantity_tip`**
  > Which value to graph against time.
  _Ruled OK 2026-09-17._
- **`lpn_ts_summary`**
  > Assets: {n}, reporting times: {steps}
  _Ruled OK 2026-09-17._
- **`lpn_ts_tip`**
  > Graph one or more assets against time across an extended period simulation.
  _Ruled OK 2026-09-17._
- **`lpn_ts_title`**
  > Values versus time
  _Ruled OK 2026-09-17._
- **`lpn_units_mapcoords`**
  > Map coordinates
  @@ NEEDS RULING
- **`lpn_units_mapcoords_deg`**
  > degrees
  @@ NEEDS RULING
- **`lpn_units_usft`**
  > US survey ft
  @@ NEEDS RULING

---

# Strings waiting on a branch

**35 still to read**, of 64 new keys across 5 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### feat/convert-as (`9889cfcc`) — adds no English strings

### feat/label-gang-search (`0346dc5d`) — 41 new, 18 to read @@ NEEDS RULING

- **`lpn_basemap_hide`**
  > Hide street map
  @@ NEEDS RULING
- **`lpn_basemap_satellite_hide`**
  > Hide satellite images
  @@ NEEDS RULING
- **`lpn_basemap_satellite_tip`**
  > Photographs of the earth from Mapbox, fetched over the internet as you pan and zoom. Useful for seeing where a pipe really runs. Your network is drawn whether the images are showing or not.
  @@ NEEDS RULING
- **`lpn_basemap_tip`**
  > Street map images from OpenStreetMap, fetched over the internet as you pan and zoom. Your network is drawn whether the street map is showing or not.
  @@ NEEDS RULING
- **`lpn_clean_map`**
  > Hide map readouts
  @@ NEEDS RULING
- **`lpn_clean_map_off`**
  > Show map readouts
  @@ NEEDS RULING
- **`lpn_clean_map_tip`**
  > Take the status strip and the coordinate readout off the map, so a screenshot shows only the drawing. Your drawing is not touched, and this choice is not stored; reloading the page brings the readouts back.
  @@ NEEDS RULING
- **`lpn_confirm_labels_restore`**
  > Set the label columns back to their original values? This resets which properties are shown, the text before and after each one, the decimals, and the drop order. Your drawing and your other settings are not changed.
  _Ruled OK 2026-09-23._
- **`lpn_file_import_geo`**
  > Convert coordinates as…
  @@ NEEDS RULING
- **`lpn_file_import_geo_tip`**
  > Copies this project to a new tab and starts an approximate coordinates conversion wizard. A wizard guides you through zooming the map behind your network approximately, then scaling and rotating your network on the map more closely. This project is left exactly as it is. To georeference without converting anything, use Map, Custom georeference instead.
  @@ NEEDS RULING
- **`lpn_labels_restore`**
  > Restore label defaults
  _Ruled OK 2026-09-23._
- **`lpn_labels_restore_tip`**
  > Sets the label columns back to their original values: which properties are shown, the text before and after each one, the decimals, and the drop order. Your drawing and your other settings are not changed.
  _Ruled OK 2026-09-23._
- **`lpn_mapgeo_replace`**
  > This project already has the world map attached. Replace that georeferencing?
  _Ruled OK 2026-09-23._
- **`lpn_pane_paste_note`**
  > This table is meant for entering values by pasting from a spreadsheet into rows that already exist. If it does not meet your needs, use Help to tell us.
  @@ NEEDS RULING
- **`lpn_survey_column_n`**
  > column {n}
  _Ruled OK 2026-09-23._
- **`lpn_survey_confirm_pipes`**
  > No pipes are drawn. A surveyed list says where the points are, not which of them are joined.
  _Ruled OK 2026-09-17._
- **`lpn_survey_err_ambiguous_lon`**
  > More than one column in that file could be the longitude ({detail}), and this page will not choose between them. Leave one of them named as the longitude and try again.
  _Ruled 2026-09-17: Needs discussion and design concept planning._
- **`lpn_survey_err_gpx_no_wpt`**
  > That GPX file holds no waypoints, so there is nothing to make junctions from.
  _Ruled OK 2026-09-17._
- **`lpn_survey_err_no_coords`**
  > This page could not find two coordinate columns in that file. Name two of the columns in the first row of the file, and try again. The first row reads: {detail}
  @@ NEEDS RULING
- **`lpn_survey_err_plane`**
  > That file holds plane survey coordinates ({detail}), not latitude and longitude. A northing is a distance across a flat plane, and this page cannot yet turn one into a position on the Earth, so nothing was read. Export the same points as latitude and longitude, in decimal degrees, and try again.
  _Ruled 2026-09-17: Needs discussion and design concept planning._
- **`lpn_survey_fmt_enz`**
  > Easting, northing, elevation (ENZ, also written XYZ)
  _Ruled OK 2026-09-23._
- **`lpn_survey_fmt_enzd`**
  > Easting, northing, elevation, description (ENZD)
  _Ruled OK 2026-09-23._
- **`lpn_survey_fmt_nez`**
  > Northing, easting, elevation (NEZ)
  @@ NEEDS RULING
- **`lpn_survey_fmt_nezd`**
  > Northing, easting, elevation, description (NEZD)
  @@ NEEDS RULING
- **`lpn_survey_fmt_penz`**
  > Point name, easting, northing, elevation (PENZ)
  @@ NEEDS RULING
- **`lpn_survey_fmt_penzd`**
  > Point name, easting, northing, elevation, description (PENZD)
  @@ NEEDS RULING
- **`lpn_survey_fmt_pnez`**
  > Point name, northing, easting, elevation (PNEZ)
  @@ NEEDS RULING
- **`lpn_survey_fmt_pnezd`**
  > Point name, northing, easting, elevation, description (PNEZD)
  @@ NEEDS RULING
- **`lpn_survey_from_header`**
  > The first line of your file names its own columns, so those names were used and the column order below was not needed.
  @@ NEEDS RULING
- **`lpn_survey_map_gpx`**
  > Each waypoint becomes one junction, at its own latitude and longitude, taking the name and the elevation the file states for it. A GPX elevation is in meters by definition of the format.
  _Ruled OK 2026-09-17._
- **`lpn_survey_map_none`**
  > not used
  _Ruled OK 2026-09-17._
- **`lpn_survey_not_geo`**
  > A surveyed point list is latitude and longitude, and this project is not on a map of the Earth. Start a geographic project from File, New, and import the list into that one.
  _Ruled 2026-09-17: Needs discussion and design concept planning._
- **`lpn_survey_note_bad_lon`**
  > The longitude here does not read as a decimal number of degrees ({detail}), so no junction was made for this row. Degrees, minutes and seconds are not read; convert them to decimal degrees first.
  _Ruled 2026-09-17: Needs discussion and design concept planning._
- **`lpn_survey_note_elev_converted`**
  > The elevation column in your file is named for {detail}, which is not the unit this project is showing, so those numbers were converted. Every other number came across exactly as the file states it.
  _Ruled OK 2026-09-23._
- **`lpn_survey_note_gpx_rtept`**
  > The file also holds {detail} route point(s), which were not made into junctions.
  _Ruled OK 2026-09-17._
- **`lpn_survey_note_gpx_trkpt`**
  > The file also holds {detail} track point(s). Those are a record of where somebody walked rather than places they surveyed, so they were not made into junctions.
  _Ruled OK 2026-09-17._
- **`lpn_survey_note_lon_missing`**
  > The longitude column is empty on this row, so no junction was made for it.
  _Ruled 2026-09-17: Needs discussion and design concept planning._
- **`lpn_survey_note_lon_range`**
  > This longitude is outside the range a longitude can have ({detail}), so no junction was made for this row.
  _Ruled OK 2026-09-17._
- **`lpn_survey_row`**
  > row {n}
  _Ruled OK 2026-09-17._
- **`lpn_survey_unit_ft`**
  > feet
  _Ruled OK 2026-09-17._
- **`lpn_survey_unit_m`**
  > meters
  _Ruled OK 2026-09-17._

### feat/notice-log (`80bc539e`) — 8 new, 2 to read @@ NEEDS RULING

- **`lpn_file_import_geo`**
  > Convert coordinates as…
  @@ NEEDS RULING
- **`lpn_file_import_geo_tip`**
  > Copies this project to a new tab and starts an approximate coordinates conversion wizard. A wizard guides you through zooming the map behind your network approximately, then scaling and rotating your network on the map more closely. This project is left exactly as it is. To georeference without converting anything, use Map, Custom georeference instead.
  @@ NEEDS RULING
- **`lpn_lock_open_cancelled`**
  > That file was not opened, and nothing here changed. Somebody else still has it open.
  _Ruled OK 2026-09-23._
- **`lpn_msglog_ago`**
  > {x} ago
  _Ruled OK 2026-09-23._
- **`lpn_msglog_empty`**
  > No messages yet.
  _Ruled OK 2026-09-23._
- **`lpn_msglog_heading`**
  > Recent messages
  _Ruled OK 2026-09-23._
- **`lpn_msglog_name`**
  > Messages
  _Ruled OK 2026-09-23._
- **`lpn_msglog_note`**
  > Newest first. This page keeps the last {n} messages while it is open, and nothing is stored on your computer.
  _Ruled OK 2026-09-23._

### feat/zoom-control (`bcaa8319`) — 9 new, 9 to read @@ NEEDS RULING

- **`lpn_file_import_geo`**
  > Convert coordinates as…
  @@ NEEDS RULING
- **`lpn_file_import_geo_tip`**
  > Copies this project to a new tab and starts an approximate coordinates conversion wizard. A wizard guides you through zooming the map behind your network approximately, then scaling and rotating your network on the map more closely. This project is left exactly as it is. To georeference without converting anything, use Map, Custom georeference instead.
  @@ NEEDS RULING
- **`lpn_mode_zoom_window`**
  > Mode: Zoom window. Drag a box on the map to zoom in on it.
  @@ NEEDS RULING
- **`lpn_tool_zoom_window`**
  > Zoom Window
  @@ NEEDS RULING
- **`lpn_tool_zoom_window_tip`**
  > Drag a box on the map to zoom in on it. Press this button again for Zoom to fit.
  @@ NEEDS RULING
- **`lpn_zoom_in`**
  > Zoom in
  @@ NEEDS RULING
- **`lpn_zoom_in_tip`**
  > Zoom in one step, about the middle of the map. Or press the + key.
  @@ NEEDS RULING
- **`lpn_zoom_out`**
  > Zoom out
  @@ NEEDS RULING
- **`lpn_zoom_out_tip`**
  > Zoom out one step, about the middle of the map. Or press the - key.
  @@ NEEDS RULING

### feat/zoom-scale-rules (`53ae1a15`) — 6 new, 6 to read @@ NEEDS RULING

- **`lpn_file_import_geo`**
  > Convert coordinates as…
  @@ NEEDS RULING
- **`lpn_file_import_geo_tip`**
  > Copies this project to a new tab and starts an approximate coordinates conversion wizard. A wizard guides you through zooming the map behind your network approximately, then scaling and rotating your network on the map more closely. This project is left exactly as it is. To georeference without converting anything, use Map, Custom georeference instead.
  @@ NEEDS RULING
- **`lpn_settings_symbol_cap`**
  > Prevent nodes from scaling larger than
  @@ NEEDS RULING
- **`lpn_settings_symbol_cap_mid`**
  > times the length of the
  @@ NEEDS RULING
- **`lpn_settings_symbol_cap_post`**
  > percentile pipe
  @@ NEEDS RULING
- **`lpn_settings_symbol_cap_tip`**
  > A junction stops growing on the ground once its diameter would be this many times the length of the pipe at this percentile of all pipe lengths in the network. Past that point on the map, junctions, pipes and other symbols shrink on the screen as you zoom out instead of growing on the ground. Reservoirs and tanks are the exception and keep their screen size at every zoom.
  @@ NEEDS RULING
