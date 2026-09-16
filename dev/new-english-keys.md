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

**44 still to read**, of 44 untranslated keys, of 1915 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (44, 44 to read @@ NEEDS RULING)

- **`lpn_survey_btn`**
  > Import surveyed points
  @@ NEEDS RULING
- **`lpn_survey_btn_tip`**
  > Read a list of surveyed points from a CSV or GPX file and make one junction at each point, using the new-asset values above. No pipes are drawn, and no row is ever dropped without being named. The project has to be on a map of the Earth.
  @@ NEEDS RULING
- **`lpn_survey_cancelled`**
  > Nothing was created and nothing was changed.
  @@ NEEDS RULING
- **`lpn_survey_confirm`**
  > Create {n} junction(s) from this surveyed point list?
  @@ NEEDS RULING
- **`lpn_survey_confirm_pipes`**
  > No pipes are drawn. A surveyed list says where the points are, not which of them are joined.
  @@ NEEDS RULING
- **`lpn_survey_elev_assumed`**
  > The file does not say what unit its elevations are in, so they are read as {project}, which is the unit this project is showing.
  @@ NEEDS RULING
- **`lpn_survey_elev_unit`**
  > Elevations in the file are read as {file}, and this project is showing {project}.
  @@ NEEDS RULING
- **`lpn_survey_err_ambiguous_lat`**
  > More than one column in that file could be the latitude ({detail}), and this page will not choose between them. Leave one of them named as the latitude and try again.
  @@ NEEDS RULING
- **`lpn_survey_err_ambiguous_lon`**
  > More than one column in that file could be the longitude ({detail}), and this page will not choose between them. Leave one of them named as the longitude and try again.
  @@ NEEDS RULING
- **`lpn_survey_err_empty`**
  > That file has nothing in it.
  @@ NEEDS RULING
- **`lpn_survey_err_gpx_no_wpt`**
  > That GPX file holds no waypoints, so there is nothing to make junctions from.
  @@ NEEDS RULING
- **`lpn_survey_err_no_latlon`**
  > This page could not find a latitude column and a longitude column in that file. Name two of the columns latitude and longitude, in the first row of the file, and try again. The first row reads: {detail}
  @@ NEEDS RULING
- **`lpn_survey_err_no_points`**
  > Not one row of that file could be read as a surveyed point. Rows read: {detail}
  @@ NEEDS RULING
- **`lpn_survey_err_plane`**
  > That file holds plane survey coordinates ({detail}), not latitude and longitude. A northing is a distance across a flat plane, and this page cannot yet turn one into a position on the Earth, so nothing was read. Export the same points as latitude and longitude, in decimal degrees, and try again.
  @@ NEEDS RULING
- **`lpn_survey_err_unreadable`**
  > That file could not be read as a surveyed point list.
  @@ NEEDS RULING
- **`lpn_survey_map_gpx`**
  > Each waypoint becomes one junction, at its own latitude and longitude, taking the name and the elevation the file states for it. A GPX elevation is in meters by definition of the format.
  @@ NEEDS RULING
- **`lpn_survey_map_lines`**
  > Latitude comes from the column {lat}, longitude from {lon}, the name from {id}, and the elevation from {elev}.
  @@ NEEDS RULING
- **`lpn_survey_map_none`**
  > not used
  @@ NEEDS RULING
- **`lpn_survey_not_geo`**
  > A surveyed point list is latitude and longitude, and this project is not on a map of the Earth. Start a geographic project from File, New, and import the list into that one.
  @@ NEEDS RULING
- **`lpn_survey_note_ambiguous_elev`**
  > More than one column could be the elevation ({detail}), so none of them was read and every elevation follows the Elevation setting for new assets.
  @@ NEEDS RULING
- **`lpn_survey_note_bad_elev`**
  > The elevation here does not read as a number ({detail}). The junction was still made, and its elevation follows the Elevation setting for new assets.
  @@ NEEDS RULING
- **`lpn_survey_note_bad_lat`**
  > The latitude here does not read as a decimal number of degrees ({detail}), so no junction was made for this row. Degrees, minutes and seconds are not read; convert them to decimal degrees first.
  @@ NEEDS RULING
- **`lpn_survey_note_bad_lon`**
  > The longitude here does not read as a decimal number of degrees ({detail}), so no junction was made for this row. Degrees, minutes and seconds are not read; convert them to decimal degrees first.
  @@ NEEDS RULING
- **`lpn_survey_note_blank_rows`**
  > Blank lines were passed over: {detail}.
  @@ NEEDS RULING
- **`lpn_survey_note_elev_converted`**
  > The elevations in the file are in {detail}, which is not the unit this project is showing, so those numbers were converted. Every other number came across exactly as the file states it.
  @@ NEEDS RULING
- **`lpn_survey_note_gpx_rtept`**
  > The file also holds {detail} route point(s), which were not made into junctions.
  @@ NEEDS RULING
- **`lpn_survey_note_gpx_trkpt`**
  > The file also holds {detail} track point(s). Those are a record of where somebody walked rather than places they surveyed, so they were not made into junctions.
  @@ NEEDS RULING
- **`lpn_survey_note_id_duplicate`**
  > This name is used more than once in the file, so this junction was given a name of ours instead.
  @@ NEEDS RULING
- **`lpn_survey_note_id_invalid`**
  > This name cannot be used as an ID here, so this junction was given a name of ours instead.
  @@ NEEDS RULING
- **`lpn_survey_note_id_taken`**
  > This name already belongs to something in the project, so this junction was given a name of ours instead.
  @@ NEEDS RULING
- **`lpn_survey_note_lat_missing`**
  > The latitude column is empty on this row, so no junction was made for it.
  @@ NEEDS RULING
- **`lpn_survey_note_lat_range`**
  > This latitude is outside the range a latitude can have ({detail}), so no junction was made for this row. If your latitude and longitude columns are the other way round, swap them in your own file: this page will not swap them for you, because it cannot tell a mistake from a place.
  @@ NEEDS RULING
- **`lpn_survey_note_lon_missing`**
  > The longitude column is empty on this row, so no junction was made for it.
  @@ NEEDS RULING
- **`lpn_survey_note_lon_range`**
  > This longitude is outside the range a longitude can have ({detail}), so no junction was made for this row.
  @@ NEEDS RULING
- **`lpn_survey_note_row_short`**
  > This row does not have enough columns to hold a position, so no junction was made for it.
  @@ NEEDS RULING
- **`lpn_survey_read_error`**
  > That file could not be read from your disk.
  @@ NEEDS RULING
- **`lpn_survey_report_clean`**
  > Every point in the file came across, and nothing was changed on the way in.
  @@ NEEDS RULING
- **`lpn_survey_report_counts`**
  > {n} junction(s) created.
  @@ NEEDS RULING
- **`lpn_survey_report_elev`**
  > {n} of them took an elevation from the file.
  @@ NEEDS RULING
- **`lpn_survey_report_heading`**
  > Imported {file}
  @@ NEEDS RULING
- **`lpn_survey_report_lead`**
  > Nothing in your file was thrown away quietly. Below is every row that could not be taken as it stands, and everything that was changed on the way in:
  @@ NEEDS RULING
- **`lpn_survey_row`**
  > row {n}
  @@ NEEDS RULING
- **`lpn_survey_unit_ft`**
  > feet
  @@ NEEDS RULING
- **`lpn_survey_unit_m`**
  > meters
  @@ NEEDS RULING
