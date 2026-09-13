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

**98 still to read**, of 105 untranslated keys, of 1873 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (105, 98 to read @@ NEEDS RULING)

- **`lpn_about_credits`**
  > Credits
  @@ NEEDS RULING
- **`lpn_about_license`**
  > Licensed under the GNU General Public License v3.0 or later.
  @@ NEEDS RULING
- **`lpn_cp_add`**
  > Add custom property
  @@ NEEDS RULING
- **`lpn_cp_add_tip`**
  > Adds one more row to the design table and opens it for editing. Give it a key and a label, then choose the asset kinds that carry it.
  @@ NEEDS RULING
- **`lpn_cp_applies`**
  > Applies to
  @@ NEEDS RULING
- **`lpn_cp_applies_tip`**
  > Applies to: These asset kinds carry the property, written as the ID prefix letters, such as J,L,R. Leave it empty and nothing carries it.
  @@ NEEDS RULING
- **`lpn_cp_bad_case`**
  > This value does not match the capitalization this property is designed for.
  @@ NEEDS RULING
- **`lpn_cp_bad_chars`**
  > This value uses a character this property does not allow.
  @@ NEEDS RULING
- **`lpn_cp_bad_datetime`**
  > This value does not look like a date or a time.
  @@ NEEDS RULING
- **`lpn_cp_bad_high`**
  > This value is above the high limit of this property.
  @@ NEEDS RULING
- **`lpn_cp_bad_integer`**
  > This property is designed to hold a whole number.
  @@ NEEDS RULING
- **`lpn_cp_bad_length`**
  > This value is longer than this property allows.
  @@ NEEDS RULING
- **`lpn_cp_bad_low`**
  > This value is below the low limit of this property.
  @@ NEEDS RULING
- **`lpn_cp_bad_minlength`**
  > This value is shorter than this property allows.
  @@ NEEDS RULING
- **`lpn_cp_bad_number`**
  > This property is designed to hold a number.
  @@ NEEDS RULING
- **`lpn_cp_bad_space`**
  > White space is allowed only between other characters.
  @@ NEEDS RULING
- **`lpn_cp_design`**
  > Design
  @@ NEEDS RULING
- **`lpn_cp_design_tip`**
  > One row per custom property, reading across: Key, Label, Applies to, Validate as, Allow or refuse, Restrict characters, Fewest characters, Most characters, Low limit, High limit.
  @@ NEEDS RULING
- **`lpn_cp_edit_tip`**
  > Opens the design of this custom property, where every part of it is shown at full length.
  @@ NEEDS RULING
- **`lpn_cp_edit_title`**
  > Custom property design
  @@ NEEDS RULING
- **`lpn_cp_flag`**
  > {label}: {reason} The value is kept exactly as you typed it.
  @@ NEEDS RULING
- **`lpn_cp_high`**
  > High limit
  @@ NEEDS RULING
- **`lpn_cp_high_tip`**
  > High limit: This is the largest value you expect. Numbers are compared as numbers and text in dictionary order. Leave it empty for no limit.
  @@ NEEDS RULING
- **`lpn_cp_key`**
  > Key
  @@ NEEDS RULING
- **`lpn_cp_key_needed`**
  > Give this custom property a key with no spaces.
  @@ NEEDS RULING
- **`lpn_cp_key_taken`**
  > Another custom property already uses that key.
  @@ NEEDS RULING
- **`lpn_cp_key_tip`**
  > Key: A property is stored under this name. It takes no spaces, and a prefix is added for you so that your key can never collide with a built-in field.
  @@ NEEDS RULING
- **`lpn_cp_label`**
  > Label
  @@ NEEDS RULING
- **`lpn_cp_label_tip`**
  > Label: A reader sees this on the properties box, in Find and at the head of a table column.
  @@ NEEDS RULING
- **`lpn_cp_length`**
  > Most characters
  @@ NEEDS RULING
- **`lpn_cp_length_tip`**
  > Most characters: A longer value is flagged. Leave it empty for no limit.
  @@ NEEDS RULING
- **`lpn_cp_low`**
  > Low limit
  @@ NEEDS RULING
- **`lpn_cp_low_tip`**
  > Low limit: This is the smallest value you expect. Numbers are compared as numbers and text in dictionary order. Leave it empty for no limit.
  @@ NEEDS RULING
- **`lpn_cp_minlength`**
  > Fewest characters
  @@ NEEDS RULING
- **`lpn_cp_minlength_tip`**
  > Fewest characters: A shorter value is flagged, which is how you find the empty and the half-typed entries. Leave it empty for no limit.
  @@ NEEDS RULING
- **`lpn_cp_none`**
  > No custom property is designed yet.
  @@ NEEDS RULING
- **`lpn_cp_remove`**
  > Remove
  @@ NEEDS RULING
- **`lpn_cp_remove_tip`**
  > Removes this property from the design table. Values already typed on your assets are kept in the file and come back if you design the same key again.
  @@ NEEDS RULING
- **`lpn_cp_restrict`**
  > Restrict characters
  @@ NEEDS RULING
- **`lpn_cp_restrict_allow`**
  > Allow only these
  @@ NEEDS RULING
- **`lpn_cp_restrict_deny`**
  > Refuse these
  @@ NEEDS RULING
- **`lpn_cp_restrict_mode`**
  > Allow or refuse
  @@ NEEDS RULING
- **`lpn_cp_restrict_mode_tip`**
  > Allow or refuse: The characters beside this are either the only ones a value may use or the ones it may not use.
  @@ NEEDS RULING
- **`lpn_cp_restrict_tip`**
  > Restrict characters: A value may use only the characters listed here, or none of them, where "@" means any letter; "#" means any number, and you must separately list "-", ".", and "," if they are allowed; and any white space characters must be between other characters.
  @@ NEEDS RULING
- **`lpn_cp_val_camel`**
  > camelCase
  @@ NEEDS RULING
- **`lpn_cp_val_datetime`**
  > Date and time
  @@ NEEDS RULING
- **`lpn_cp_val_hyphen`**
  > hyphen-case
  @@ NEEDS RULING
- **`lpn_cp_val_integer`**
  > Integer
  @@ NEEDS RULING
- **`lpn_cp_val_none`**
  > Do not validate
  @@ NEEDS RULING
- **`lpn_cp_val_number`**
  > Number .
  @@ NEEDS RULING
- **`lpn_cp_val_number_comma`**
  > Number ,
  @@ NEEDS RULING
- **`lpn_cp_val_pascal`**
  > PascalCase
  @@ NEEDS RULING
- **`lpn_cp_val_snake`**
  > snake_case
  @@ NEEDS RULING
- **`lpn_cp_val_upper`**
  > ALL CAPS
  @@ NEEDS RULING
- **`lpn_cp_validate`**
  > Validate as
  @@ NEEDS RULING
- **`lpn_cp_validate_tip`**
  > Validate as: This says what a good value looks like. The case rules read the English alphabet only, which is a stated limit. Choose Do not validate to accept anything.
  @@ NEEDS RULING
- **`lpn_crs_choose`**
  > Select
  @@ NEEDS RULING
- **`lpn_crs_count`**
  > {n} of {total} projections listed.
  @@ NEEDS RULING
- **`lpn_crs_list`**
  > Projection
  @@ NEEDS RULING
- **`lpn_crs_list_tip`**
  > The projections left by the two filters above. Choose one and press Select.
  @@ NEEDS RULING
- **`lpn_crs_name`**
  > Projection name filter
  @@ NEEDS RULING
- **`lpn_crs_name_tip`**
  > Shows only the projections whose name or EPSG code contains what you type. Try a zone number, or UTM, or Mercator.
  @@ NEEDS RULING
- **`lpn_crs_none`**
  > Not georeferenced
  @@ NEEDS RULING
- **`lpn_crs_noview`**
  > No place has been searched for yet, so the whole list is offered. Search for a place above to narrow it.
  @@ NEEDS RULING
- **`lpn_crs_place`**
  > Place name search
  @@ NEEDS RULING
- **`lpn_crs_place_tip`**
  > Type a town, an address, or a landmark, and the map view moves there. The words you type go to OpenStreetMap’s place-name service, which asks your permission the first time. A new geographic project also starts at the place you find here.
  @@ NEEDS RULING
- **`lpn_crs_search`**
  > Search
  @@ NEEDS RULING
- **`lpn_crs_view`**
  > Filter by map view
  @@ NEEDS RULING
- **`lpn_crs_view_tip`**
  > Offers only the projections that cover the place the map is looking at. Turn it off to read the whole list.
  @@ NEEDS RULING
- **`lpn_field_easting`**
  > Easting
  @@ NEEDS RULING
- **`lpn_field_emitter`**
  > Emitter coefficient
  _Ruled OK 2026-09-09._
- **`lpn_field_emitter_tip`**
  > An extra outflow that depends on pressure, for a sprinkler, an open outlet, or a modeled leak. The flow it releases is this coefficient times the pressure raised to the emitter exponent, which is set once for the whole network under Settings, Calculation, Hydraulics. Leave it blank on an ordinary junction.
  _Ruled OK 2026-09-09._
- **`lpn_field_northing`**
  > Northing
  @@ NEEDS RULING
- **`lpn_field_text_attached_tip`**
  > This text was placed close enough to an asset to follow it, so it moves with that asset and has a leader. A text on a leader takes its horizontal and vertical alignment from the side it sits on, which is why those two rows are not offered while it is attached.
  _Ruled OK 2026-09-09._
- **`lpn_georef_projected`**
  > This project already states a map projection, so its coordinates cannot be placed on the map a second time.
  @@ NEEDS RULING
- **`lpn_georef_save_locked`**
  > Finish the placement with the "Keep this placement" button, or press Cancel, before you save. The project is still being placed, so what is on the screen is not yet what would be written to the file.
  _Ruled OK 2026-09-09._
- **`lpn_help_welcome`**
  > Welcome page
  @@ NEEDS RULING
- **`lpn_map_unmeasurable`**
  > This page could not work out the size of the drawing area, so the map is showing the last view it was able to compute. Resizing the window makes it try again. If it keeps happening, a browser extension that blocks page measurements is the usual cause.
  _Ruled OK 2026-09-10._
- **`lpn_menu_cue`**
  > Start with the menus above. Use the toolbar for quick access.
  @@ NEEDS RULING
- **`lpn_new_coordsys`**
  > Coordinate system
  @@ NEEDS RULING
- **`lpn_new_coordsys_geo`**
  > Geographic projection
  @@ NEEDS RULING
- **`lpn_new_coordsys_geo_tip`**
  > Select a geographic projection. Use WGS 84 / Pseudo-Mercator EPSG:3857 for Lat/Lon.
  @@ NEEDS RULING
- **`lpn_new_coordsys_local`**
  > Local, schematic, custom, or georeference later
  @@ NEEDS RULING
- **`lpn_new_coordsys_local_tip`**
  > Choose this to attach your own background image or the world map or adjust the attachment at any time from the Map menu.
  @@ NEEDS RULING
- **`lpn_new_coordsys_tip`**
  > Select the coordinate system of your network. This is permanent; the only way you can convert a network to different coordinates is with “File, Open to new coordinates”, and it is approximate.
  @@ NEEDS RULING
- **`lpn_new_crs`**
  > Map projection
  @@ NEEDS RULING
- **`lpn_new_crs_tip`**
  > The projection your coordinates are already measured in. Eastings and northings are stored exactly as you type them, and nothing is converted. A project cannot change its projection afterward, so to work in a different one, start a new project. UTM is the dominant worldwide standard, a region may have customs of its own, and a Land Surveyor is the person to ask if you are not sure.
  @@ NEEDS RULING
- **`lpn_pane_text_attached`**
  > Attached
  _Ruled OK 2026-09-09._
- **`lpn_popup_boxtitle`**
  > Properties
  _Ruled OK 2026-09-09._
- **`lpn_result_avg_concentration`**
  > Average concentration
  @@ NEEDS RULING
- **`lpn_result_avg_source_share`**
  > Average source share
  @@ NEEDS RULING
- **`lpn_result_avg_water_age`**
  > Average water age
  @@ NEEDS RULING
- **`lpn_result_friction_factor`**
  > Friction factor
  @@ NEEDS RULING
- **`lpn_result_status`**
  > Status
  @@ NEEDS RULING
- **`lpn_result_status_closed`**
  > Closed
  @@ NEEDS RULING
- **`lpn_result_status_open`**
  > Open
  @@ NEEDS RULING
- **`lpn_settings_custom_props`**
  > Custom properties
  @@ NEEDS RULING
- **`lpn_settings_custom_props_note`**
  > Properties you define yourself for your own purposes. They are stored with the project and scenarios like all other properties.
  @@ NEEDS RULING
- **`lpn_settings_runbox`**
  > Show the run progress box
  @@ NEEDS RULING
- **`lpn_settings_runbox_tip`**
  > A box that reports how far a run has got and what it found. With it turned off, a finished run says the same thing in the status line for a few seconds instead. This is a setting for this browser, not for the project.
  @@ NEEDS RULING
- **`lpn_storage_unreadable`**
  > Not saved. This project could not be read from browser storage. Its stored copy is left exactly as it is and will not be written over, so nothing on this tab is being saved. Open a file or create a new project to keep working.
  @@ NEEDS RULING
- **`lpn_time_pause_tip`**
  > Pause animation
  @@ NEEDS RULING
- **`lpn_time_play_tip`**
  > Play animation
  @@ NEEDS RULING
- **`lpn_time_runbox_hide`**
  > Do not show this box again
  @@ NEEDS RULING
- **`lpn_tool_key_hint_two`**
  > Shortcut: press {key} or {key2}.
  @@ NEEDS RULING
