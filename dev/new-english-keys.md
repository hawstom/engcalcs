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

**5 still to read**, of 104 untranslated keys, of 1867 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (104, 5 to read @@ NEEDS RULING)

- **`lpn_about_credits`**
  > Credits
  _Ruled OK 2026-09-14._
- **`lpn_about_license`**
  > Licensed under the GNU General Public License v3.0 or later.
  _Ruled OK 2026-09-14._
- **`lpn_cp_add`**
  > Add custom property
  _Ruled OK 2026-09-14._
- **`lpn_cp_add_tip`**
  > Adds a row to the design table and opens it for editing.
  _Ruled OK 2026-09-14._
- **`lpn_cp_applies`**
  > Applies to
  _Ruled OK 2026-09-14._
- **`lpn_cp_applies_tip`**
  > Applies to: Comma separated list of ID prefixes for assets that use this property, such as J,L,R.
  _Ruled OK 2026-09-14._
- **`lpn_cp_bad_case`**
  > This value is not ALL CAPS as required for this property.
  _Ruled OK 2026-09-14._
- **`lpn_cp_bad_chars`**
  > This value uses a character this property does not allow.
  _Ruled OK 2026-09-14._
- **`lpn_cp_bad_high`**
  > This value is above the high limit of this property.
  _Ruled OK 2026-09-14._
- **`lpn_cp_bad_integer`**
  > This value is not a whole number as required for this property.
  _Ruled OK 2026-09-14._
- **`lpn_cp_bad_length`**
  > This value is longer than this property allows.
  _Ruled OK 2026-09-14._
- **`lpn_cp_bad_low`**
  > This value is below the low limit of this property.
  _Ruled OK 2026-09-14._
- **`lpn_cp_bad_minlength`**
  > This value is shorter than this property allows.
  _Ruled OK 2026-09-14._
- **`lpn_cp_bad_number`**
  > This value is not a number as required for this property.
  _Ruled OK 2026-09-14._
- **`lpn_cp_bad_space`**
  > White space is allowed only between other characters.
  _Ruled OK 2026-09-14._
- **`lpn_cp_design`**
  > Design
  _Ruled OK 2026-09-14._
- **`lpn_cp_design_tip`**
  > One row per custom property, and each opens to show: Key, Label, Applies to, Validate as, Allow or refuse, Restrict characters, Fewest characters, Most characters, Low limit, High limit.
  @@ NEEDS RULING
- **`lpn_cp_flag`**
  > {label}: {reason} The value is kept exactly as you typed it.
  _Ruled OK 2026-09-14._
- **`lpn_cp_high`**
  > High limit
  _Ruled OK 2026-09-14._
- **`lpn_cp_high_tip`**
  > High limit: This is the largest value you expect. Numbers are compared as numbers and text in dictionary order.
  _Ruled OK 2026-09-14._
- **`lpn_cp_key`**
  > Key
  _Ruled OK 2026-09-14._
- **`lpn_cp_key_needed`**
  > Give this custom property a key with no spaces.
  _Ruled OK 2026-09-14._
- **`lpn_cp_key_taken`**
  > Another custom property already uses that key.
  _Ruled OK 2026-09-14._
- **`lpn_cp_key_tip`**
  > Key: A property is stored under this name. Spaces are not allowed, and a prefix is added for you so that your key can never collide with a built-in field.
  _Ruled OK 2026-09-14._
- **`lpn_cp_label`**
  > Label
  _Ruled OK 2026-09-14._
- **`lpn_cp_label_tip`**
  > Label: A reader sees this on the properties box, in Find and at the head of a table column.
  _Ruled OK 2026-09-14._
- **`lpn_cp_length`**
  > Length upper limit
  _Ruled OK 2026-09-14._
- **`lpn_cp_length_tip`**
  > Length upper limit: Any longer entry is flagged.
  _Ruled OK 2026-09-14._
- **`lpn_cp_low`**
  > Low limit
  _Ruled OK 2026-09-14._
- **`lpn_cp_low_tip`**
  > Low limit: This is the smallest value you expect. Numbers are compared as numbers and text in dictionary order.
  _Ruled OK 2026-09-14._
- **`lpn_cp_minlength`**
  > Length lower limit
  _Ruled OK 2026-09-14._
- **`lpn_cp_minlength_tip`**
  > Length lower limit: Any shorter entry is flagged, which is how you find the empty and the half-typed entries.
  @@ NEEDS RULING
- **`lpn_cp_none`**
  > No custom property is designed yet.
  _Ruled OK 2026-09-14._
- **`lpn_cp_remove`**
  > Remove
  _Ruled OK 2026-09-14._
- **`lpn_cp_remove_tip`**
  > Removes this property from the design table. Values already typed on your assets are kept in the file and come back if you design the same key again.
  _Ruled OK 2026-09-14._
- **`lpn_cp_restrict`**
  > Restrict these characters
  _Ruled OK 2026-09-14._
- **`lpn_cp_restrict_allow`**
  > Allow only these characters
  _Ruled OK 2026-09-14._
- **`lpn_cp_restrict_deny`**
  > Restrict these characters
  _Ruled OK 2026-09-14._
- **`lpn_cp_restrict_mode`**
  > Allow or restrict
  _Ruled OK 2026-09-14._
- **`lpn_cp_restrict_mode_tip`**
  > Allow or restrict: The given characters are either the only ones a value may use or the ones it may not use.
  _Ruled OK 2026-09-14._
- **`lpn_cp_restrict_tip`**
  > Restrict these characters: A value may use only the characters listed here, or none of them, where "@" means any letter; "#" means any numeric digit, and you must separately list "-", ".", and "," if they are allowed; and any white space characters must be between other characters.
  @@ NEEDS RULING
- **`lpn_cp_unnamed`**
  > Not named yet
  @@ NEEDS RULING
- **`lpn_cp_val_camel`**
  > camelCase
  _Ruled OK 2026-09-14._
- **`lpn_cp_val_hyphen`**
  > hyphen-case
  _Ruled OK 2026-09-14._
- **`lpn_cp_val_integer`**
  > Integer
  _Ruled OK 2026-09-14._
- **`lpn_cp_val_none`**
  > Do not validate
  _Ruled OK 2026-09-14._
- **`lpn_cp_val_number`**
  > Number .
  _Ruled OK 2026-09-14._
- **`lpn_cp_val_number_comma`**
  > Number ,
  _Ruled OK 2026-09-14._
- **`lpn_cp_val_pascal`**
  > PascalCase
  _Ruled OK 2026-09-14._
- **`lpn_cp_val_snake`**
  > snake_case
  _Ruled OK 2026-09-14._
- **`lpn_cp_val_upper`**
  > ALL CAPS
  _Ruled OK 2026-09-14._
- **`lpn_cp_validate`**
  > Validate as
  _Ruled OK 2026-09-14._
- **`lpn_cp_validate_tip`**
  > Validate as: This says what a good value looks like. The case rules read the English alphabet only, which is a stated limit. Choose Do not validate to accept anything.
  _Ruled OK 2026-09-14._
- **`lpn_crs_choose`**
  > Select
  _Ruled OK 2026-09-14._
- **`lpn_crs_count`**
  > {n} of {total} projections listed.
  _Ruled OK 2026-09-14._
- **`lpn_crs_list`**
  > Projection
  _Ruled OK 2026-09-14._
- **`lpn_crs_list_tip`**
  > The projections left by the two filters above. Choose one and press Select.
  _Ruled OK 2026-09-14._
- **`lpn_crs_name`**
  > Projection name filter
  _Ruled OK 2026-09-14._
- **`lpn_crs_name_tip`**
  > Shows only the projections whose name or EPSG code contains what you type. Try a zone number, or UTM, or Mercator.
  _Ruled OK 2026-09-14._
- **`lpn_crs_none`**
  > Not georeferenced
  _Ruled OK 2026-09-14._
- **`lpn_crs_noview`**
  > No place has been searched for yet, so the whole list is offered. Search for a place above or zoom the map to narrow it.
  _Ruled 2026-09-14: Edited, and confirm that this describes the specified and targeted behavior, that the visible map area is used to filter the list._
- **`lpn_crs_place`**
  > Place name search
  _Ruled 2026-09-14: OK. And this seems like a duplicate string maybe._
- **`lpn_crs_place_projected`**
  > A projected project opens on its own plane, not at the place you searched for. Putting that plane on the Earth needs a coordinate transform, which this page does not have yet.
  @@ NEEDS RULING
- **`lpn_crs_place_tip`**
  > Type a town, an address, or a landmark, and the map view moves there. The words you type go to OpenStreetMap’s place-name service, which asks your permission the first time. A new geographic project also starts at the place you find here.
  _Ruled 2026-09-14: OK. And this seems like a duplicate string maybe._
- **`lpn_crs_search`**
  > Search
  _Ruled OK 2026-09-14._
- **`lpn_crs_view`**
  > Filter by map view
  _Ruled OK 2026-09-14._
- **`lpn_crs_view_tip`**
  > Offers only the projections that cover the place the map is looking at. Turn it off to read the whole list.
  _Ruled OK 2026-09-14._
- **`lpn_field_easting`**
  > Easting
  _Ruled OK 2026-09-14._
- **`lpn_field_emitter`**
  > Emitter coefficient
  _Ruled OK 2026-09-09._
- **`lpn_field_emitter_tip`**
  > An extra outflow that depends on pressure, for a sprinkler, an open outlet, or a modeled leak. The flow it releases is this coefficient times the pressure raised to the emitter exponent, which is set once for the whole network under Settings, Calculation, Hydraulics. Leave it blank on an ordinary junction.
  _Ruled OK 2026-09-09._
- **`lpn_field_northing`**
  > Northing
  _Ruled OK 2026-09-14._
- **`lpn_field_text_attached_tip`**
  > This text was placed close enough to an asset to follow it, so it moves with that asset and has a leader. A text on a leader takes its horizontal and vertical alignment from the side it sits on, which is why those two rows are not offered while it is attached.
  _Ruled OK 2026-09-09._
- **`lpn_georef_projected`**
  > This project already states a map projection, so its coordinates cannot be placed on the map a second time.
  _Ruled OK 2026-09-14._
- **`lpn_georef_save_locked`**
  > Finish the placement with the "Keep this placement" button, or press Cancel, before you save. The project is still being placed, so what is on the screen is not yet what would be written to the file.
  _Ruled OK 2026-09-09._
- **`lpn_help_welcome`**
  > Welcome page
  _Ruled OK 2026-09-14._
- **`lpn_map_unmeasurable`**
  > This page could not work out the size of the drawing area, so the map is showing the last view it was able to compute. Resizing the window makes it try again. If it keeps happening, a browser extension that blocks page measurements is the usual cause.
  _Ruled OK 2026-09-10._
- **`lpn_menu_cue`**
  > Start with the menus above. Use the toolbar for quick access.
  _Ruled OK 2026-09-14._
- **`lpn_new_coordsys`**
  > Coordinate system
  _Ruled OK 2026-09-14._
- **`lpn_new_coordsys_geo`**
  > Geographic projection
  _Ruled OK 2026-09-14._
- **`lpn_new_coordsys_geo_tip`**
  > Select a geographic projection. Use WGS 84 / Pseudo-Mercator EPSG:3857 for Lat/Lon.
  _Ruled OK 2026-09-14._
- **`lpn_new_coordsys_local`**
  > Local, schematic, custom, or georeference later
  _Ruled OK 2026-09-14._
- **`lpn_new_coordsys_local_tip`**
  > Choose this to attach your own background image or the world map or adjust the attachment at any time from the Map menu.
  _Ruled OK 2026-09-14._
- **`lpn_new_coordsys_tip`**
  > Select the coordinate system of your network. This is permanent; the only way you can convert a network to different coordinates is with “File, Open to new coordinates”, and it is approximate.
  _Ruled OK 2026-09-14._
- **`lpn_new_crs`**
  > Map projection
  _Ruled OK 2026-09-14._
- **`lpn_new_crs_tip`**
  > The projection your coordinates are already measured in. Coordinates are stored exactly as you type them, and nothing is converted. This selection is permanent; the only way you can convert a network to different coordinates is with “File, Open to new coordinates”, and it is approximate. UTM is the dominant worldwide standard, a region may have customs of its own, and a Land Surveyor is the person to ask if you are not sure.
  _Ruled OK 2026-09-14._
- **`lpn_pane_text_attached`**
  > Attached
  _Ruled OK 2026-09-09._
- **`lpn_popup_boxtitle`**
  > Properties
  _Ruled OK 2026-09-09._
- **`lpn_result_avg_concentration`**
  > Average concentration
  _Ruled OK 2026-09-14._
- **`lpn_result_avg_source_share`**
  > Average source share
  _Ruled OK 2026-09-14._
- **`lpn_result_avg_water_age`**
  > Average water age
  _Ruled OK 2026-09-14._
- **`lpn_result_friction_factor`**
  > Friction factor
  _Ruled OK 2026-09-14._
- **`lpn_result_reaction_rate`**
  > Reaction rate
  _Ruled OK 2026-09-14._
- **`lpn_result_status`**
  > Status
  _Ruled OK 2026-09-14._
- **`lpn_result_status_closed`**
  > Closed
  _Ruled OK 2026-09-14._
- **`lpn_result_status_open`**
  > Open
  _Ruled OK 2026-09-14._
- **`lpn_settings_custom_props`**
  > Custom properties
  _Ruled OK 2026-09-14._
- **`lpn_settings_custom_props_note`**
  > Properties you define yourself for your own purposes. They are stored with the project and scenarios like all other properties.
  _Ruled OK 2026-09-14._
- **`lpn_settings_runbox`**
  > Show the run progress box
  _Ruled OK 2026-09-14._
- **`lpn_settings_runbox_tip`**
  > A box that reports how far a run has got and what it found. With it turned off, a finished run says the same thing in the status line for a few seconds instead. This is a setting for this browser, not for the project.
  _Ruled OK 2026-09-14._
- **`lpn_storage_unreadable`**
  > Not saved. This project could not be read from browser storage. Its stored copy is left exactly as it is and will not be written over, so nothing on this tab is being saved. Open a file or create a new project to keep working.
  _Ruled OK 2026-09-14._
- **`lpn_time_pause_tip`**
  > Pause animation
  _Ruled OK 2026-09-14._
- **`lpn_time_play_tip`**
  > Play animation
  _Ruled OK 2026-09-14._
- **`lpn_time_runbox_hide`**
  > Do not show this box again
  _Ruled OK 2026-09-14._
- **`lpn_tool_key_hint_two`**
  > Shortcut: press {key} or {key2}.
  _Ruled OK 2026-09-14._
