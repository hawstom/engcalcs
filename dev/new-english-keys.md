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

**0 still to read on master**, of 5 untranslated keys, of 1876 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (5, all ruled)

- **`lpn_coord_off_world`**
  > That is off the map. Pseudo Mercator latitude ranges from -85.05 to 85.05 and longitude ranges from -180 to 180.
  _Ruled OK 2026-09-17._
- **`lpn_field_coord_tip`**
  > Type a coordinate location to place this node exactly. In a scenario this location applies in that scenario alone, just as dragging it does; in Base it places the node everywhere.
  _Ruled OK 2026-09-17._
- **`lpn_field_desc`**
  > Description
  _Ruled OK 2026-09-17._
- **`lpn_field_desc_tip`**
  > For your own use, such as a street corner or what a pipe is made of. It is carried into and out of the EPANET file, where it sits at the end of the part's own row. No calculation reads it. A line break becomes a space, because the file has nowhere to put one.
  _Ruled OK 2026-09-17._
- **`lpn_inp_export_flat_coords`**
  > An EPANET file holds one position for each node. This scenario places {n} of them somewhere else, and those are the positions in the file. Every other scenario keeps its own positions in your project file alone.
  _Ruled 2026-09-17: This is unclear. Please proofread and reword._

---

# Strings waiting on a branch

**5 still to read**, of 120 new keys across 10 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### feat/customer-demands (`bd17fa89`) — 24 new, all ruled

- **`lpn_customer_detached`**
  > ⚠ This meter is not connected to a pipe, so its demand is not in the answers. Delete it, or draw a pipe and move the meter onto it.
  _Ruled OK 2026-09-17._
- **`lpn_customer_detached_count`**
  > {n} meters are no longer connected to a pipe. Their demand is not in the answers.
  _Ruled OK 2026-09-17._
- **`lpn_customer_fixed_head`**
  > ⚠ The near end of that pipe holds a fixed water surface, so this demand changes nothing in the answers.
  _Ruled 2026-09-17: Can you clarify the case? Like a reservoir?_
- **`lpn_customer_heading`**
  > Customer {id}
  _Ruled OK 2026-09-17._
- **`lpn_field_account`**
  > Account number
  _Ruled OK 2026-09-17._
- **`lpn_field_account_tip`**
  > Whatever your own records call this service. It is a name on a demand and nothing here looks anything up by it, so it can be an account number, a street address, or a note to yourself. It stays in your project file.
  _Ruled OK 2026-09-17._
- **`lpn_field_meter_count`**
  > Services at this meter
  _Ruled OK 2026-09-17._
- **`lpn_field_meter_count_tip`**
  > How many identical services this one meter stands for, so that forty-two single-family connections along one main can be one symbol in one place. The total below is the demand above times this count.
  _Ruled OK 2026-09-17._
- **`lpn_field_meter_demand`**
  > Demand per service
  _Ruled OK 2026-09-17._
- **`lpn_field_meter_demand_tip`**
  > What one service at this meter draws. With the count below at 1, this is the whole of it. An empty box is a meter you have not given a demand to yet, which is not the same as a meter that draws nothing.
  _Ruled OK 2026-09-17._
- **`lpn_field_meter_lumped`**
  > Added to node
  _Ruled OK 2026-09-17._
- **`lpn_field_meter_lumped_tip`**
  > The node that this meter's demands are added to through, on top of whatever the junction states itself. It's the node closest to this connection.
  _Ruled 2026-09-17: Edited. This is strictly for accounting, not necessarily physical._
- **`lpn_field_meter_pipe`**
  > Connected asset
  _Ruled 2026-09-17: Edited. We want to allow connecting directly to a node._
- **`lpn_field_meter_pipe_tip`**
  > The asset that this service connects to. Drag the service line onto another asset to change it, and drag the circle on the pipe to move where along it the service connects.
  _Ruled 2026-09-17: We need to rule on whether we allow non-perpendicular connections._
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
- **`lpn_inp_export_flat_customers`**
  > An EPANET file has no customers. The demand of the {n} meters in this project goes into the file as a demand row on the junction each one is added to, and each row is named with its account number. What the file cannot hold is the meter: where it sits, which pipe serves it, where along that pipe the service connects, and how many services one meter stands for. Your own project file keeps all of that.
  _Ruled OK 2026-09-17._
- **`lpn_meter_pick_pipe`**
  > Now click the pipe that serves this meter. Press Escape to cancel.
  _Ruled OK 2026-09-17._
- **`lpn_mode_add_meter`**
  > Meter: click the pipe that serves this customer, or click open ground and then click its pipe. Escape leaves the tool.
  _Ruled 2026-09-17: I like the "Click pipe" method of adding a customer. But it has some problems. (1) the offset would need to be in settings and (2) it will never be clear to the user which side is left (negative) and which is right (positive) unless there are arrows. Obviously side is not arbitrary or unimportant. Possibilities: (1) toolbar/menu button could include two modes, left and right, and they are relative to the direction of the flow arrow or low to high node number, and users have to learn by trial and error if they want to use this method, and offset is in Settings, Values._
- **`lpn_pane_tab_customers`**
  > Customers
  _Ruled OK 2026-09-17._
- **`lpn_tool_add_meter`**
  > Meter
  _Ruled OK 2026-09-17._
- **`lpn_tool_add_meter_tip`**
  > Click the pipe that serves a customer to put a meter on it, or click open ground and then click the pipe. The demand you give the meter is added to the junction at the near end of that pipe.
  _Ruled 2026-09-17: See comment for lpn_mode_add_meter_

### feat/label-gang-search (`2a31d4f1`) — adds no English strings

### feat/library-import (`c7b63ddd`) — 9 new, all ruled

- **`lpn_library_import`**
  > Import from a project file
  _Ruled OK 2026-09-17._
- **`lpn_library_import_added`**
  > Copied in: {names}
  _Ruled OK 2026-09-17._
- **`lpn_library_import_conflict`**
  > Skipped, because this project already has one of the same name: {names}. Nothing here was changed. Rename either one and import again if you want both.
  _Ruled OK 2026-09-17._
- **`lpn_library_import_curve_shape`**
  > These curves came across exactly as the file wrote them, and a run cannot use one until its first column rises from each point to the next: {names}
  _Ruled 2026-09-17: Can you clarify "first column rises from each point to the next"?_
- **`lpn_library_import_heading`**
  > Imported from {file}
  _Ruled OK 2026-09-17._
- **`lpn_library_import_needs_fittings`**
  > These pipe types refer to a fittings list this project does not have: {names}. Import the fittings library from the same file and they will find it.
  _Ruled OK 2026-09-17._
- **`lpn_library_import_none`**
  > That project file has none of these to copy.
  _Ruled OK 2026-09-17._
- **`lpn_library_import_tip`**
  > Choose another project file and copy what its library holds into this project. Anything whose name is already taken here is skipped and listed, so nothing you already have is changed.
  _Ruled OK 2026-09-17._
- **`lpn_library_import_units`**
  > The file you chose does not show its numbers in the same units as this project. Every number came across exactly as the file wrote it, so each one now means the unit this project is showing. Check them.
  _Ruled 2026-09-17: This is one situation where we may need to offer conversion._

### feat/lock-initials-later (`1e2c3377`) — 13 new, all ruled

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
  > "Ask" tells whoever has this file open that you would like it, and changes nothing else. "Break lock" lets you save over the file; their unsaved work is not lost, but they will no longer be able to save it here, and somebody may have to merge the two by hand. "Open read-only" lets you look at it and change anything you like, without being able to save here.
  _Ruled OK 2026-09-17._
- **`lpn_lock_open_inuse`**
  > This file appears to be in use.
  _Ruled OK 2026-09-17._
- **`lpn_lock_requested`**
  > {name} would like to edit this file. When you are ready, save your work and use File, Close project to hand it over.
  _Ruled OK 2026-09-17._

### feat/survey-import (`460e4821`) — 44 new, all ruled

- **`lpn_survey_btn`**
  > Import surveyed points
  _Ruled OK 2026-09-17._
- **`lpn_survey_btn_tip`**
  > Read a list of surveyed points from a CSV or GPX file and make one junction at each point, using the new-asset values above. No pipes are drawn, and no row is ever dropped without being named. The project has to be on a map of the Earth.
  _Ruled 2026-09-17: I disagree with "has to be". See my prompt comments._
- **`lpn_survey_cancelled`**
  > Nothing was created and nothing was changed.
  _Ruled OK 2026-09-17._
- **`lpn_survey_confirm`**
  > Create {n} junction(s) from this surveyed point list?
  _Ruled OK 2026-09-17._
- **`lpn_survey_confirm_pipes`**
  > No pipes are drawn. A surveyed list says where the points are, not which of them are joined.
  _Ruled OK 2026-09-17._
- **`lpn_survey_elev_assumed`**
  > The file does not say what unit its elevations are in, so they are read as {project}, which is the unit this project is showing.
  _Ruled OK 2026-09-17._
- **`lpn_survey_elev_unit`**
  > Elevations in the file are read as {file}, and this project is showing {project}.
  _Ruled 2026-09-17: Under what condition would we know the units of the file?_
- **`lpn_survey_err_ambiguous_lat`**
  > More than one column in that file could be the latitude ({detail}), and this page will not choose between them. Leave one of them named as the latitude and try again.
  _Ruled 2026-09-17: Needs discussion and design concept planning._
- **`lpn_survey_err_ambiguous_lon`**
  > More than one column in that file could be the longitude ({detail}), and this page will not choose between them. Leave one of them named as the longitude and try again.
  _Ruled 2026-09-17: Needs discussion and design concept planning._
- **`lpn_survey_err_empty`**
  > That file has nothing in it.
  _Ruled OK 2026-09-17._
- **`lpn_survey_err_gpx_no_wpt`**
  > That GPX file holds no waypoints, so there is nothing to make junctions from.
  _Ruled OK 2026-09-17._
- **`lpn_survey_err_no_latlon`**
  > This page could not find a latitude column and a longitude column in that file. Name two of the columns latitude and longitude, in the first row of the file, and try again. The first row reads: {detail}
  _Ruled 2026-09-17: Needs discussion and design concept planning._
- **`lpn_survey_err_no_points`**
  > Not one row of that file could be read as a surveyed point. Rows read: {detail}
  _Ruled OK 2026-09-17._
- **`lpn_survey_err_plane`**
  > That file holds plane survey coordinates ({detail}), not latitude and longitude. A northing is a distance across a flat plane, and this page cannot yet turn one into a position on the Earth, so nothing was read. Export the same points as latitude and longitude, in decimal degrees, and try again.
  _Ruled 2026-09-17: Needs discussion and design concept planning._
- **`lpn_survey_err_unreadable`**
  > That file could not be read as a surveyed point list.
  _Ruled OK 2026-09-17._
- **`lpn_survey_map_gpx`**
  > Each waypoint becomes one junction, at its own latitude and longitude, taking the name and the elevation the file states for it. A GPX elevation is in meters by definition of the format.
  _Ruled OK 2026-09-17._
- **`lpn_survey_map_lines`**
  > Latitude comes from the column {lat}, longitude from {lon}, the name from {id}, and the elevation from {elev}.
  _Ruled OK 2026-09-17._
- **`lpn_survey_map_none`**
  > not used
  _Ruled OK 2026-09-17._
- **`lpn_survey_not_geo`**
  > A surveyed point list is latitude and longitude, and this project is not on a map of the Earth. Start a geographic project from File, New, and import the list into that one.
  _Ruled 2026-09-17: Needs discussion and design concept planning._
- **`lpn_survey_note_ambiguous_elev`**
  > More than one column could be the elevation ({detail}), so none of them was read and every elevation follows the Elevation setting for new assets.
  _Ruled OK 2026-09-17._
- **`lpn_survey_note_bad_elev`**
  > The elevation here does not read as a number ({detail}). The junction was still made, and its elevation follows the Elevation setting for new assets.
  _Ruled OK 2026-09-17._
- **`lpn_survey_note_bad_lat`**
  > The latitude here does not read as a decimal number of degrees ({detail}), so no junction was made for this row. Degrees, minutes and seconds are not read; convert them to decimal degrees first.
  _Ruled 2026-09-17: Needs discussion and design concept planning._
- **`lpn_survey_note_bad_lon`**
  > The longitude here does not read as a decimal number of degrees ({detail}), so no junction was made for this row. Degrees, minutes and seconds are not read; convert them to decimal degrees first.
  _Ruled 2026-09-17: Needs discussion and design concept planning._
- **`lpn_survey_note_blank_rows`**
  > Blank lines were passed over: {detail}.
  _Ruled OK 2026-09-17._
- **`lpn_survey_note_elev_converted`**
  > The elevations in the file are in {detail}, which is not the unit this project is showing, so those numbers were converted. Every other number came across exactly as the file states it.
  _Ruled 2026-09-17: How do we know?_
- **`lpn_survey_note_gpx_rtept`**
  > The file also holds {detail} route point(s), which were not made into junctions.
  _Ruled OK 2026-09-17._
- **`lpn_survey_note_gpx_trkpt`**
  > The file also holds {detail} track point(s). Those are a record of where somebody walked rather than places they surveyed, so they were not made into junctions.
  _Ruled OK 2026-09-17._
- **`lpn_survey_note_id_duplicate`**
  > This name is used more than once in the file, so this junction was given a name of ours instead.
  _Ruled OK 2026-09-17._
- **`lpn_survey_note_id_invalid`**
  > This name cannot be used as an ID here, so this junction was given a name of ours instead.
  _Ruled OK 2026-09-17._
- **`lpn_survey_note_id_taken`**
  > This name already belongs to something in the project, so this junction was given a name of ours instead.
  _Ruled OK 2026-09-17._
- **`lpn_survey_note_lat_missing`**
  > The latitude column is empty on this row, so no junction was made for it.
  _Ruled 2026-09-17: Needs discussion and design concept planning._
- **`lpn_survey_note_lat_range`**
  > This latitude is outside the range a latitude can have ({detail}), so no junction was made for this row. If your latitude and longitude columns are the other way round, swap them in your own file: this page will not swap them for you, because it cannot tell a mistake from a place.
  _Ruled OK 2026-09-17._
- **`lpn_survey_note_lon_missing`**
  > The longitude column is empty on this row, so no junction was made for it.
  _Ruled 2026-09-17: Needs discussion and design concept planning._
- **`lpn_survey_note_lon_range`**
  > This longitude is outside the range a longitude can have ({detail}), so no junction was made for this row.
  _Ruled OK 2026-09-17._
- **`lpn_survey_note_row_short`**
  > This row does not have enough columns to hold a position, so no junction was made for it.
  _Ruled OK 2026-09-17._
- **`lpn_survey_read_error`**
  > That file could not be read from your disk.
  _Ruled OK 2026-09-17._
- **`lpn_survey_report_clean`**
  > Every point in the file came across, and nothing was changed on the way in.
  _Ruled OK 2026-09-17._
- **`lpn_survey_report_counts`**
  > {n} junction(s) created.
  _Ruled OK 2026-09-17._
- **`lpn_survey_report_elev`**
  > {n} of them took an elevation from the file.
  _Ruled OK 2026-09-17._
- **`lpn_survey_report_heading`**
  > Imported {file}
  _Ruled OK 2026-09-17._
- **`lpn_survey_report_lead`**
  > Nothing in your file was thrown away quietly. Below is every row that could not be taken as it stands, and everything that was changed on the way in:
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

### feat/time-series-graph (`079cbf80`) — 16 new, all ruled

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

### feat/xy-world-map (`3866b64f`) — 9 new, all ruled

- **`lpn_map_attach_done`**
  > The world map is behind your drawing now, and your project is unchanged. Use Map, Background map (georeference), Remove to take it away again.
  _Ruled OK 2026-09-17._
- **`lpn_map_attach_menu`**
  > Background map (georeference)…
  _Ruled OK 2026-09-17._
- **`lpn_map_attach_place`**
  > Attach the world map…
  _Ruled OK 2026-09-17._
- **`lpn_map_attach_remove`**
  > Remove
  _Ruled OK 2026-09-17._
- **`lpn_map_attach_remove_tip`**
  > Take the world map away. The drawing and its coordinates are untouched either way.
  _Ruled OK 2026-09-17._
- **`lpn_map_attach_removed`**
  > The world map is gone, and the drawing is exactly as it was.
  _Ruled OK 2026-09-17._
- **`lpn_map_attach_tip`**
  > Attach the world map to this project without changing it any other way.
  _Ruled OK 2026-09-17._
- **`lpn_map_attach_turn`**
  > Map rotation in degrees, counterclockwise, where 0 puts north toward the top of the map
  _Ruled 2026-09-17: Edited. Changed meaning. Please review carefully._
- **`lpn_map_attach_where`**
  > Latitude and longitude of the middle of your drawing, in that order, separated by a comma or a space
  _Ruled OK 2026-09-17._

### fix/meeting-failures (`bac01d59`) — 5 new, 5 to read @@ NEEDS RULING

- **`lpn_crs_unplaceable`**
  > This page has no transform for that projection, so a project on it opens on its own plane: no map behind the drawing, no arrival at the place you searched for, and no elevations from the land surface. Your coordinates are unaffected. Another projection covering the same area will have all three.
  @@ NEEDS RULING
- **`lpn_crs_unplaceable_mark`**
  > (no map)
  @@ NEEDS RULING
- **`lpn_terrain_http`**
  > The terrain service answered with an error ({status}), so no elevation was changed. Nothing is wrong with your network.
  @@ NEEDS RULING
- **`lpn_terrain_no_place`**
  > None of those nodes has a position on the Earth, so nothing was sent and no elevation was changed. Reading the land surface needs a project in latitude and longitude, or one on a projection this page can place.
  @@ NEEDS RULING
- **`lpn_terrain_rate_limited`**
  > The terrain service is asking us to slow down (429), so no elevation was changed. Try again in a minute.
  @@ NEEDS RULING

### projection (`2a7e6dad`) — adds no English strings

### tables-interface (`e34970bc`) — adds no English strings
