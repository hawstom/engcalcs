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

**80 of 1407 English keys**, as of the last generation.

## lpn_  (80)

- **`lpn_demand_add`**
  > Add demand category
- **`lpn_demand_add_tip`**
  > Add another demand at this junction, with its own base demand, pattern and category. The demands add up.
- **`lpn_demand_remove`**
  > Remove this demand
- **`lpn_field_base_demand`**
  > Base demand
- **`lpn_field_demand_category`**
  > Category
- **`lpn_field_demand_category_tip`**
  > Name or description of the user or users using this pattern.
- **`lpn_field_text_attached`**
  > Attached to
- **`lpn_find_conn_no_fixed`**
  > This network has no reservoir or tank, so it has no source to reach. Only "no links" and "no open links" can be answered.
- **`lpn_find_conn_nolinksource`**
  > No link path to a source
- **`lpn_find_conn_none`**
  > Every node is connected.
- **`lpn_find_conn_noopen`**
  > No open links
- **`lpn_find_conn_noopensource`**
  > No open path to a source
- **`lpn_find_conn_unlinked`**
  > No links
- **`lpn_find_op_conn_nolinksource`**
  > no link path to a source
- **`lpn_find_op_conn_noopen`**
  > no open links
- **`lpn_find_op_conn_noopensource`**
  > no open path to a source
- **`lpn_find_op_conn_unlinked`**
  > no links
- **`lpn_find_prop_connection`**
  > Connection
- **`lpn_find_q_and`**
  > AND
- **`lpn_find_q_aside`**
  > These controls cannot write the query below, so they are set aside rather than saying something untrue.
- **`lpn_find_q_err_close`**
  > This bracket ( was opened and never closed.
- **`lpn_find_q_err_dot`**
  > Put a dot between what to search and its property, like Junction.ID
- **`lpn_find_q_err_empty`**
  > The query is empty, so nothing will be searched.
- **`lpn_find_q_err_end`**
  > Nothing was expected after this. Join two searches with {and} or {or}.
- **`lpn_find_q_err_op`**
  > Not a condition for {prop}: {w}. Try one of: {list}
- **`lpn_find_q_err_open`**
  > This bracket ) closes nothing.
- **`lpn_find_q_err_pos`**
  > (at character {n})
- **`lpn_find_q_err_prop`**
  > Not a property of {scope}: {w}. Try one of: {list}
- **`lpn_find_q_err_quote`**
  > Put quotes around a text value: {w} is not a number.
- **`lpn_find_q_err_quote_end`**
  > This quoted text has no closing quote.
- **`lpn_find_q_err_scope`**
  > Not something to search: {w}. Try one of: {list}
- **`lpn_find_q_err_value`**
  > This condition needs a value after it: {op}
- **`lpn_find_q_or`**
  > OR
- **`lpn_find_q_restore`**
  > Use the controls instead
- **`lpn_find_query_hint`**
  > Expandable with AND, OR, and ()
- **`lpn_find_query_label`**
  > Query
- **`lpn_find_query_tip`**
  > The same search, written as one line. Change the controls and it rewrites itself, or type in it and the controls follow.
- **`lpn_georef_backdrop_unrotated`**
  > The background image was moved and resized with the model, but it could not be rotated. Use Background image > Move to line it up.
- **`lpn_georef_twopt`**
  > Use two known points
- **`lpn_georef_twopt_done`**
  > The model now sits on the two points you gave. Check it, then press Keep this placement.
- **`lpn_georef_twopt_pick1`**
  > Click a point on your drawing whose latitude and longitude you know.
- **`lpn_georef_twopt_pick2`**
  > Now click a second known point, as far from the first one as you can.
- **`lpn_georef_twopt_same`**
  > That is the point you picked first. Pick a different one.
- **`lpn_georef_twopt_tip`**
  > Place the model exactly, when you already know where two points on your drawing really are. Click one of them, type its latitude and longitude, then do the same for a second point. The place, the size and the turn all follow from those two. Press this button again to stop picking.
- **`lpn_menu_map`**
  > Map
- **`lpn_new_coords`**
  > Coordinates
- **`lpn_new_coords_geo`**
  > lat/lon, on the Earth
- **`lpn_new_coords_tip`**
  > An xy project is a drawing on a grid, with no place on the Earth. A lat/lon project sits on real ground, so a street map or satellite picture can be drawn behind it and node elevations can be read from the terrain. An xy project can be put on the ground later with File > Import xy to lat/lon.
- **`lpn_new_coords_xy`**
  > xy grid
- **`lpn_new_create`**
  > Create
- **`lpn_new_place`**
  > Start near this place
- **`lpn_new_place_hint`**
  > Petaluma, California
- **`lpn_new_place_tip`**
  > Optional. Type a town, a street or a landmark and the new map opens there. The words you type go to OpenStreetMap's place-name service, which asks your permission the first time. Leave it empty and the map opens on the whole world.
- **`lpn_new_title`**
  > New project
- **`lpn_profile_delete`**
  > Delete path
- **`lpn_profile_delete_confirm`**
  > Delete the saved path {name}? The drawing itself is not changed.
- **`lpn_profile_edit`**
  > Edit
- **`lpn_profile_edit_click`**
  > Drag any point on the path to move it. Click a point you added to take it off.
- **`lpn_profile_edit_nowhere`**
  > A point on the path has to be a node. The path is unchanged.
- **`lpn_profile_edit_tap`**
  > Drag any point on the path to move it. Tap a point you added to take it off.
- **`lpn_profile_edit_tip`**
  > Change one end of the path, or take one node off it, without drawing the whole path again.
- **`lpn_profile_missing`**
  > {name} names nodes that are not in this project: {ids}
- **`lpn_profile_new`**
  > New saved path…
- **`lpn_profile_new_name`**
  > Path {n}
- **`lpn_profile_none_saved`**
  > No saved paths yet
- **`lpn_profile_prompt_name`**
  > Name for this path
- **`lpn_profile_rename`**
  > Rename path…
- **`lpn_profile_saved`**
  > Saved paths
- **`lpn_replace_q_aside`**
  > Replace cannot use a query joined with AND, OR or brackets. Use the controls to choose one set of elements.
- **`lpn_result_demand_tip`**
  > The flow this node draws at the moment shown: the total of base demands multiplied by their patterns. Worked out, not typed, so it changes with the clock and cannot be edited.
- **`lpn_scenario_mark_tip`**
  > Ringed: this element holds a value that belongs to the scenario {name} alone.
- **`lpn_scenario_overrides_tip`**
  > Each of those values is marked on the map with an amber ring. Switch to Base to see the drawing without them.
- **`lpn_settings_leader_snap`**
  > Snap leader lines to angle
- **`lpn_settings_leader_snap_tip`**
  > When you drag a label away from what it names, the line back to it is pulled onto the nearest round angle if you drag close to one. Keep dragging and it lets go, so any angle is still available. Off drags freely, which is what this page has always done.
- **`lpn_settings_legend_off`**
  > Off
- **`lpn_terrain_blank_ids`**
  > These nodes are still blank: {ids}
- **`lpn_terrain_filled_ids`**
  > These nodes were filled in: {ids}
- **`lpn_terrain_ids_more`**
  > {ids}, and {n} more
- **`lpn_terrain_keep_ids`**
  > They are: {ids}
- **`lpn_terrain_will_ids`**
  > These are the nodes that will be filled in: {ids}
