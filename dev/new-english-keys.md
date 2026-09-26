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

**20 still to read on master**, of 211 untranslated keys, of 2051 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (211, 20 to read @@ NEEDS RULING)

- **`lpn_convas_cancelled`**
  > Nothing was converted. The copy is closed, and the original project is unchanged.
  _Ruled OK 2026-09-25._
- **`lpn_convas_coordsys_tip`**
  > The coordinate system the copy is converted to. When it differs from this project's, two placement steps follow. A project that already knows where it is opens both steps already answered, so you can accept them as they are or make changes.
  _Ruled OK 2026-09-25._
- **`lpn_convas_done`**
  > The converted copy is {name}. The original project is unchanged.
  _Ruled OK 2026-09-25._
- **`lpn_convas_epsg`**
  > EPSG coordinate system
  _Ruled OK 2026-09-25._
- **`lpn_convas_epsg_tip`**
  > Choose a coordinate system from the EPSG register. Latitude and longitude is WGS 84 (EPSG:4326).
  _Ruled OK 2026-09-25._
- **`lpn_convas_from`**
  > Current: {crs}
  @@ NEEDS RULING
- **`lpn_convas_label_col`**
  > Suffix
  _Ruled OK 2026-09-25._
- **`lpn_convas_label_tip`**
  > Text added after this value on the copy's map labels, such as ' mm' or ' gpm'. Pre-filled from the unit chosen above; clear it for no suffix.
  @@ NEEDS RULING
- **`lpn_convas_no_transform`**
  > This page has no transform for that coordinate system, so it cannot convert to or from it. Nothing was converted.
  @@ NEEDS RULING
- **`lpn_convas_none_tip`**
  > Local coordinates in the length unit, with no world map for now.
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
  > Local coordinates in the length unit, with the world map attached.
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
- **`lpn_crsbox_title`**
  > Coordinate system
  @@ NEEDS RULING
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
- **`lpn_ff_skipped`**
  > {n} selected elements are not junctions, so they were not tested.
  @@ NEEDS RULING
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
- **`lpn_file_convert_as`**
  > Convert as…
  _Ruled OK 2026-09-25._
- **`lpn_file_convert_as_tip`**
  > Copies this project to a new tab and converts the copy to the coordinate system and units you choose. When the coordinate system changes, a wizard guides you through zooming the map behind your network approximately, then scaling and rotating your network on the map more closely. This project is left exactly as it is. To georeference without converting anything, use Map, Custom georeference instead.
  _Ruled OK 2026-09-25._
- **`lpn_file_import_survey`**
  > Import surveyed points…
  _Ruled OK 2026-09-23._
- **`lpn_file_import_survey_tip`**
  > Read a list of surveyed points from a text file and make one junction at each point, taking the new-asset settings for everything the file does not state. No pipes are drawn, and no row is ever dropped without being named. It reads the coordinate system this project already uses, georeferenced or not.
  _Ruled OK 2026-09-23._
- **`lpn_georef_answered`**
  > This project is already georeferenced, so the network is already on the map and nothing has been moved. Check that it is in the right place, then press the Put the model here button and the Keep this placement button.
  _Ruled OK 2026-09-25._
- **`lpn_inp_export_flat_coords`**
  > An EPANET file holds one position for each node. This scenario places {n} of them somewhere else, and those are the positions in the file. Every other scenario keeps its own positions in your project file alone.
  _Ruled 2026-09-17: This is unclear. Please proofread and reword._
- **`lpn_inp_export_flat_customers`**
  > An EPANET file has no customers. The demand of the {n} customers in this project goes into the file as a demand row on the junction each one is added to, and each row is named with the customer’s tag. What the file cannot hold is the customer: where it sits, which pipe serves it, where along that pipe the service connects, and how many services one customer stands for. Your own project file keeps all of that.
  _Ruled OK 2026-09-23._
- **`lpn_inp_report_no_crs`**
  > EPANET files contain no coordinate system, so this file will not initially be georeferenced. To place it on a world map, use Map, World map… To convert its coordinates, use File, Convert as…
  _Ruled OK 2026-09-25._
- **`lpn_labels_customer_note`**
  > A customer label shows the values ticked here. It is drawn at the same text size as every other label on the map.
  _Ruled OK 2026-09-23._
- **`lpn_labels_customer_width_tip`**
  > Customer labels are drawn only while the map is this wide or narrower, measured across the window. Leave the box blank to draw them at every zoom. Type 0 to never draw a customer label, at any zoom. This has no effect if it is larger than the similar setting for all labels.
  @@ NEEDS RULING
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
- **`lpn_lock_open_cancelled`**
  > That file was not opened, and nothing here changed. Somebody else still has it open.
  _Ruled OK 2026-09-23._
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
  _Ruled OK 2026-09-23._
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
- **`lpn_node_customers`**
  > Customer demands
  _Ruled OK 2026-09-23._
- **`lpn_node_customers_sum`**
  > {total} {unit} from {n} Customers
  _Ruled OK 2026-09-23._
- **`lpn_node_customers_tip`**
  > List of customers added at this node (because this was nearest). Customer demands are in addition to other demands listed here. A customer is edited where it sits on the map or in the Customers table.
  _Ruled OK 2026-09-23._
- **`lpn_offscreen_intact`**
  > Your network is intact.
  _Ruled OK 2026-09-25._
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
  > Always show
  @@ NEEDS RULING
- **`lpn_settings_label_max_width`**
  > Show labels when zoomed to this map width or less
  _Ruled OK 2026-09-23._
- **`lpn_settings_label_max_width_tip`**
  > Labels are drawn only while the map is this wide or narrower, measured across the window. Leave the box blank to draw them at every zoom. Type 0 to never draw a label, at any zoom.
  @@ NEEDS RULING
- **`lpn_settings_label_use_view`**
  > Use current view
  _Ruled OK 2026-09-23._
- **`lpn_settings_sym_customer`**
  > Customer
  _Ruled OK 2026-09-23._
- **`lpn_settings_symbol_cap`**
  > Prevent nodes from scaling larger than
  _Ruled OK 2026-09-23._
- **`lpn_settings_symbol_cap_mid`**
  > times the length of the
  _Ruled OK 2026-09-23._
- **`lpn_settings_symbol_cap_post`**
  > percentile pipe
  _Ruled OK 2026-09-23._
- **`lpn_settings_symbol_cap_tip`**
  > A junction stops growing on the ground once its diameter would be this many times the length of the pipe at this percentile of all pipe lengths in the network. Past that point on the map, junctions, pipes and other symbols shrink on the screen as you zoom out instead of growing on the ground. Reservoirs and tanks are the exception and keep their screen size at every zoom.
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
  _Ruled OK 2026-09-23._
- **`lpn_survey_format_label`**
  > File format:
  _Ruled OK 2026-09-23._
- **`lpn_survey_note_ambiguous_elev`**
  > More than one column could be the elevation, so none of them was read.
  _Ruled OK 2026-09-23._
- **`lpn_survey_note_bad_coord`**
  > The {axis} does not read as a number.
  _Ruled OK 2026-09-23._
- **`lpn_survey_note_bad_elev`**
  > Non-numeric elevation. Imported without elevation.
  _Ruled OK 2026-09-23._
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
  _Ruled OK 2026-09-23._
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
  _Ruled OK 2026-09-25._
- **`lpn_units_mapcoords_deg`**
  > degrees
  _Ruled OK 2026-09-25._
- **`lpn_units_usft`**
  > US survey ft
  _Ruled OK 2026-09-25._

---

# Strings waiting on a branch

**15 still to read**, of 32 new keys across 8 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### feat/convert-as (`47649c32`) — adds no English strings

### feat/customer-node (`6dd9fb71`) — 2 new, 2 to read @@ NEEDS RULING

- **`lpn_field_meter_node`**
  > Connected to
  @@ NEEDS RULING
- **`lpn_field_meter_node_tip`**
  > The junction this customer is connected to. Drag the connection point onto a pipe to serve it from a station along that pipe instead.
  @@ NEEDS RULING

### feat/first-project (`8aa04872`) — adds no English strings

### feat/label-gang-search (`0346dc5d`) — 3 new, all ruled

- **`lpn_confirm_labels_restore`**
  > Set the label columns back to their original values? This resets which properties are shown, the text before and after each one, the decimals, and the drop order. Your drawing and your other settings are not changed.
  _Ruled OK 2026-09-23._
- **`lpn_labels_restore`**
  > Restore label defaults
  _Ruled OK 2026-09-23._
- **`lpn_labels_restore_tip`**
  > Sets the label columns back to their original values: which properties are shown, the text before and after each one, the decimals, and the drop order. Your drawing and your other settings are not changed.
  _Ruled OK 2026-09-23._

### feat/menu-button (`a82d32f5`) — adds no English strings

### feat/property-venue (`b8733c5d`) — 3 new, 3 to read @@ NEEDS RULING

- **`lpn_find_filter_none`**
  > No table has a property this query names.
  @@ NEEDS RULING
- **`lpn_find_filter_row`**
  > {table}: {n} of {all}
  @@ NEEDS RULING
- **`lpn_find_filter_summary`**
  > Filtered by {q}. {rows}.
  @@ NEEDS RULING

### feat/table-editing (`b7398d0b`) — 17 new, 10 to read @@ NEEDS RULING

- **`lpn_notes_6_def`**
  > <ul class="lpn-notes-keys"><li><strong>Arrow keys</strong> Move the selection.</li><li><strong>Tab, Enter</strong> Move the selection after you type.</li><li><strong>Shift+Tab, Shift+Enter</strong> Move it backward.</li><li><strong>Shift+arrow keys</strong> Extend the selection.</li><li><strong>Ctrl+C</strong> Copy the selection.</li><li><strong>Ctrl+D</strong> Fill the selection down from its top row.</li><li><strong>Ctrl+A</strong> Select the whole table.</li><li><strong>Ctrl+Space</strong> Add the current column to the selection, or remove it.</li><li><strong>Delete</strong> Clear a cell.</li><li><strong>F2</strong> Open a cell to edit it.</li><li><strong>Esc</strong> Cancel an edit.</li><li><strong>Click a column heading</strong> Sort by that column. Click again to reverse it.</li><li><strong>Ctrl+click, Shift+click a heading</strong> Add a column to the selection, or extend it.</li><li><strong>Drag a column heading</strong> Move that column, or the whole selection if it is part of one.</li><li><strong>Right-click a heading, or long-press it</strong> Hide the selected columns, or show a hidden one again.</li><li><strong>The ⋯ at the edge of a heading</strong> Open the same menu: sort, hide, show all, or manage columns.</li></ul>
  @@ NEEDS RULING
- **`lpn_notes_6_term`**
  > Table keyboard shortcuts
  _Ruled OK 2026-09-25._
- **`lpn_pane_colmenu_tip`**
  > Sort, hide, or manage columns
  @@ NEEDS RULING
- **`lpn_pane_fill_none`**
  > Nothing in this selection can be filled down.
  _Ruled OK 2026-09-25._
- **`lpn_pane_filldown`**
  > Fill down
  _Ruled OK 2026-09-25._
- **`lpn_pane_filled`**
  > Filled down {n} cells. {skipped} were not changed.
  _Ruled OK 2026-09-25._
- **`lpn_pane_hide_col`**
  > Hide this column
  _Ruled OK 2026-09-25._
- **`lpn_pane_hide_cols`**
  > Hide these columns
  _Ruled OK 2026-09-25._
- **`lpn_pane_manage_cols`**
  > Manage columns…
  @@ NEEDS RULING
- **`lpn_pane_manage_cols_down`**
  > Move down
  @@ NEEDS RULING
- **`lpn_pane_manage_cols_show`**
  > Show
  @@ NEEDS RULING
- **`lpn_pane_manage_cols_title`**
  > Manage columns
  @@ NEEDS RULING
- **`lpn_pane_manage_cols_up`**
  > Move up
  @@ NEEDS RULING
- **`lpn_pane_show_all_cols`**
  > Show all columns
  @@ NEEDS RULING
- **`lpn_pane_show_col`**
  > Show {col}
  _Ruled OK 2026-09-25._
- **`lpn_pane_sort_asc`**
  > Sort ascending
  @@ NEEDS RULING
- **`lpn_pane_sort_desc`**
  > Sort descending
  @@ NEEDS RULING

### feat/zoom-control (`3200afa9`) — 7 new, all ruled

- **`lpn_mode_zoom_window`**
  > Mode: Zoom window. Click two opposite corners of a box, or drag one, on the map to zoom in on it.
  _Ruled OK 2026-09-25._
- **`lpn_tool_zoom_window`**
  > Zoom Window
  _Ruled OK 2026-09-25._
- **`lpn_tool_zoom_window_tip`**
  > Click two opposite corners of a box, or drag one, on the map to zoom in on it. Press this button again for Zoom to fit.
  _Ruled OK 2026-09-25._
- **`lpn_zoom_in`**
  > Zoom in
  _Ruled OK 2026-09-25._
- **`lpn_zoom_in_tip`**
  > Zoom in one step. Shortcut: +
  _Ruled OK 2026-09-25._
- **`lpn_zoom_out`**
  > Zoom out
  _Ruled OK 2026-09-25._
- **`lpn_zoom_out_tip`**
  > Zoom out one step. Shortcut: -
  _Ruled 2026-09-25: His own wording, written on the list 2026-09-25 beside lpn_zoom_in_tip's._
