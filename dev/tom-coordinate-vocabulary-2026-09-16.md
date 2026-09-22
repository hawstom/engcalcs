# Tom's coordinate-system vocabulary and string edits — 2026-09-16

**RECOVERED 2026-09-17 FROM THE SESSION TRANSCRIPT, after he asked where it had gone:**
*"If you really did lose the content I painstakingly created and gave to you, that is very sad.
I can't find it in the folder."* It was never written to a file by the session it was given to.
This is that message, VERBATIM and entire, so it cannot be lost again. Nothing here is edited,
summarised or reordered; where it disagrees with the tree, HIS WORDING WINS and the tree is what
needs changing.

Source: `~/.claude/projects/-home-haws-webdev-hawsedc-com-engcalcs/76214861-…jsonl`, his message
of 2026-09-16T10:34:34, 17,197 characters, carrying 65 `$ec_lang` assignments.

---

# feat/label-gang-search
This is a branch that's not really easy for a user to test including the items you suggested. It's not as easy as you thought it might be. It's one where I want to see more under the hood. Can you give me a developer's view that has the spot-prime boxes? Also, can I see a report of the performance change this branch causes?

# projection branch:
## Terminology

The terms we need to use are "Georeferenced" vs. "Local or Arbitrary" and "EPSG Coordinate System" vs. "Georeferenced Local Coordinate System".

Projection or geographic projection becomes coordinate system or EPSG coordinate system or Coordinate Reference System or CRS. We no longer want to expose the word "projection".

Georeferencing is still georeferencing, but it means to attach the world map, not to convert your coordinate system.

We may offer (since we already programmed and debugged the wizard) coordinate system conversion. But that is not our recommended work flow in most situations. As always, we prefer the "preserve the inputs" path.

## Summary
I have some understanding of the future of this branch. Most of it lies in correcting or changing our vocabulary and our behavior to be more conventional. When this branch reaches the end of its life, I foresee the following features:

1. Converting coordinates is no longer the default way to georeference a local coordinate system. The default way to georeference is as easy to the user as attaching a background map. They choose the Map, Custom georeference menu, and it, after confirming that the project is not already georeferenced or that user wishes to replace the current georeferencing, prompts them through a wizard that attaches the world map (world view) and guides them through (a) zooming to their location, (b) fine zooming and rotating **the map** behind their network, and (c) "pinning" the map once they are happy with their chosen custom georeferencing. Their project does **not** become a lat/lon project. Their coordinates do **not** change, and we display their local coordinates on the map status bar. I am not sure what we do about the absurdity of zooming away from their project. But I suppose we can allow it since mercator has parallel laterals/longitudes. Maybe we could refuse to show coordinates or calculate lengths if necessary. Anyway, I am not really clear on that except that a custom coordinate system, like an EPSG coordinate system, is only reasonably correct for a limited amount of the earth.

2. Starting a new project offers you to choose an EPSG CRS or to leave the project unreferenced to possibly be georeferenced later.

3. Converting coordinates is still available through "File, Convert coordinates as" (like Save as...). It copies this project to a new tab and starts the coordinate conversion wizard that we already have. The differences I can foresee are listed below:
- The wizard now needs to begin with a selector for the conversion target CRS.
- If this project is already georeferenced, then the conversion wizard may be able to do a very precise and unattended conversion from one EPSG CRS to another. If not, the same user process is followed.
- If this project is not georeferenced, then Place name search and Goto are how we expect the user to zoom to the right place on the map. So we start them at whole-world view.

4. I want to confirm that for all these EPSG CRSes, there are convergence angles that indicate some rotation of the world map. This is something we need to be able to handle that I don't think we were handling before. Maybe it's already added with the part of this branch/project that we illegally merged half done. Anyway, it's a thing.

## Task 1 Terminology
The terms we need to use are "Georeferenced" vs. "Local or Arbitrary" and "EPSG Coordinate System" vs. "Georeferenced Local Coordinate System".

Projection or geographic projection becomes coordinate system or EPSG coordinate system

## lang.ec.en.php edits
We can discuss or plan these edits. I need your review and advice.
```
// The street map behind a geographic project (ROADMAP Task 145). Two keys rather than one, because

// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** --
$ec_lang['lpn_geomap']='georeferenced'; // [TGH: I don't know what this key is for.]
$ec_lang['lpn_xymap']='local'; // [TGH: I don't know what this key is for.]
$ec_lang_syn['lpn_geomap']='coordinate system referenced to the world map';
$ec_lang_syn['lpn_xymap']='local, arbitrary, or schematic coordinate system';
$ec_lang['lpn_file_import_geo']='Convert coordinates as…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_geo_tip']='Copies this project to a new tab and starts an approximate coordinates conversion wizard. A wizard guides you through zooming the map behind your network approximately, then scaling and rotating your network on the map more closely.';
// **THE BUTTON, NOT A GUESS** (Tom, 2026-08-21, on importing Net3 and landing in North Darfur).
// Offered in step 1 whenever every coordinate in the file would also be a valid longitude and
// latitude -- which could easily be the case for a small network -- so the sentence has to make the user the
// judge rather than announce a finding.
// **LAT/LON, NOT LON/LAT ORDER, AND THIS IS SETTLED** (Tom, 2026-08-24, after German filed it:
// *"Oops. A mistake. It should be lat/lon everywhere... history says Lat/Lon."*). x-then-y is a real
// convention and it is why this said lon/lat, but it is a convention about STORAGE, and this button
// is read by a person. The internal code keeps naming its variables {lon, lat} in x,y order; that is
// invisible and stays.
$ec_lang['lpn_transform_georefed_btn']='This project is already georeferenced.'; // [TGH: Obsolete. We are no longer converting always from xy to lat/lon]
$ec_lang['lpn_transform_georefed_tip']='Press this only if this project is already georeferenced. The map and view then stays where it is.';  // [TGH: We are no longer converting always from xy to lat/lon. We have to start every conversion at the world zoom if not georeferenced, and we let user find their place in the world using Place search and Goto. If georeferenced, we can read it, so this option is not needed.]
$ec_lang['lpn_transform_georefed']='This project is already georeferenced, so the network is already on the map and nothing has been moved. Check that it is in the right place, then press the Keep this placement button.';  // [TGH: We want to say something like this, but the key name was misleading for what we now want to do. I edited the wording and the key name.]
$ec_lang['lpn_transform_intro']='Placing the model takes two steps. Step 1 is the quick one: the model holds still and you move the map behind it, until your site is under the model at about the right size. There is no rotation yet. Step 2 is the precise one: you drag, resize and rotate the model itself. Your project is on a map of the whole world to start with, so find your location first, then press the Put the model here button.';
$ec_lang['lpn_transform_adjust']='The model is on the ground now, so it moves with the map. Drag the model to move it, drag a corner to resize it, drag the round handle above the model to rotate it. Or type the ground distance and the rotation angle below.';
$ec_lang['lpn_transform_step1']='Step 1 of 2 — quick';
$ec_lang['lpn_transform_step2']='Step 2 of 2 — precise';
$ec_lang['lpn_transform_step1_hint']='Your project stays where it is on the screen. Pan and zoom the map underneath it until the ground behind it is roughly the right place and roughly the right size, then press the Put the model here button.';
$ec_lang['lpn_transform_detach']='Pick it up again';
$ec_lang['lpn_transform_size_prompt']='About how wide is the site, across the whole project?';


$ec_lang['lpn_transform_drop']='Put the model here';
$ec_lang['lpn_transform_finish']='Keep this placement';
$ec_lang['lpn_transform_cancel']='Cancel';
$ec_lang['lpn_transform_scale']='Ground distance per drawing unit';
// Edited by TGH 2026-09-07
$ec_lang['lpn_transform_scale_tip']='Calculated automatically. Edit to change.';
$ec_lang['lpn_transform_rotation']='Turn counterclockwise (degrees)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_transform_rotation_tip']='How far to rotate the whole model counterclockwise to align with the new coordinate system.';
$ec_lang['lpn_transform_confirm']='Place the model here permanently? You can still drag assets one at a time afterwards, but proceeding now converts all the coordinates at once. To get the old coordinates back, return to the original project and close this one without saving.';
$ec_lang['lpn_transform_done']='This project is now on the new coordinate system. You may continue to drag any assets that need further adjustment.';
$ec_lang['lpn_transform_backdrop_unrotated']='The background image was moved and resized with the model, but it could not be rotated. Use Map, Background image, Move to align it.';
$ec_lang['lpn_transform_on_map']='This project is already on lat/lon.';
// The same approach for the other coordinate system that is already on the Earth (Task 641). Said
// separately because the reason is different: a lat/lon project IS the map, while a projected one
// states which plane it is on. Either way, we know where the project is without asking the user.
$ec_lang['lpn_transform_projected']='This project is already georeferenced, so it s coordinates cannot be placed on the map a second time.'; // [TGH: Obsolete. A project that is already georeferenced is easier (more precise) to convert, not harder.]
$ec_lang['lpn_transform_empty']='That file has no network in it, so there is nothing to place.';
$ec_lang['lpn_transform_unavailable']='The placement tool did not load. Reload the page and try again.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_transform_tab_locked']='Finish the conversion with the "Keep this placement" button, or press Cancel, before you switch projects. The placement belongs to this project and cannot follow you to another one.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_transform_save_locked']='Finish the conversion with the "Keep this placement" button, or press Cancel, before you save. The project is still being placed, so what is on the screen is not yet what would be written to the file.';
$ec_lang['lpn_goto_menu']='Go to a latitude and longitude…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_tip']='Pan the map to coordinates entered as lat lon or lat,lon.';
$ec_lang['lpn_goto_prompt']='Latitude and longitude, in that order, separated by a comma or a space';
$ec_lang['lpn_goto_bad']='Can\'t read coordinates. Try again. Examples: 38,-122 or 38.122 or 38 -122';
$ec_lang['lpn_transform_goto']='Go to…';
$ec_lang['lpn_transform_twopt']='Use two known points';
// Edited by TGH 2026-09-07
$ec_lang['lpn_transform_twopt_tip']='Place the model exactly, when you already know where two points on your drawing really are. Click one of them, type its latitude and longitude, then do the same for a second point. The position, the scale, and the rotation all follow from those two points. Press again to cancel, or press Esc.';
$ec_lang['lpn_transform_twopt_pick1']='Click a point on your drawing whose latitude and longitude you know.';
$ec_lang['lpn_transform_twopt_pick2']='Now click a second known point, as far from the first one as you can.';
$ec_lang['lpn_transform_twopt_same']='That is the point you picked first. Pick a different one.';
$ec_lang['lpn_transform_twopt_done']='The model now sits on the two points you gave. Check it, then press the Keep this placement button.';

// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='New project';
// The first question, and the one the whole box is arranged around.
$ec_lang['lpn_new_coords']='Coordinates'; // [TGH: I can't find this string in the UI. I think it's obsolete.]
// **THE TWO NAMES ARE `local` AND `georeferenced`**
//
$ec_lang['lpn_new_coordsys']='Coordinate system';
$ec_lang['lpn_new_coordsys_tip']='Select the coordinate system of your network. This is permanent; the only way you can convert a network to different coordinates is with “File, Convert coordinates as…”, and it is approximate.';
$ec_lang['lpn_new_coordsys_geo']='Geographic projection';
$ec_lang['lpn_new_coordsys_geo_tip']='Select a geographic projection. Use WGS 84 / Pseudo-Mercator EPSG:3857 for Lat/Lon.';
$ec_lang['lpn_new_coordsys_local']='Local, schematic, or custom';
$ec_lang['lpn_new_coordsys_local_tip']='Not georeferenced. Use the Map, Georeference… or Map, Background image… menu later if you wish to add a backdrop.';
// ---- THE COORDINATE SYSTEM SELECTION BOX -----------------------------------------------------------
// Tom's summary: it "uses the map view as a UX element to filter the universe of CRS coordinate systems to the
// ones applicable to the project (view). Lets the user filter by name and select a CRS at
// any time." Two filters over one catalogue, and the catalogue itself is not keyed: a CRS's
// NAME is the EPSG register's own, exactly as the OpenStreetMap credit is, and a GIS reader in any
// language looks for those characters.
$ec_lang['lpn_new_crs']='Coordinate Reference System';
// **WHAT IT PROMISES AND WHAT IT REFUSES.** The promise is that nothing is converted, which is this
// suite's own rule about the user's numbers. The refusal is that the choice is final, and it is
// stated here because this control is the only place it can be read before it binds.
//
// Nothing here claims anything about how accurate a length is: that claim waits on Task 643.
$ec_lang['lpn_new_crs_tip']='The coordinate reference system (CRS) your coordinates are already measured in. Coordinates are stored exactly as you type them, and nothing is converted. This selection is permanent; the only way you can convert a network to different coordinates is with “File, Convert coordinates as…”, and it is approximate. UTM is the dominant worldwide standard, a region may have customs of its own, and a Land Surveyor is the person to ask if you are not sure.';
// The spatial filter. A zoned system covers a strip of the Earth and nothing outside it, so a place
// answers most of the question by itself: searching a town in Arizona leaves two UTM zones standing
// out of a hundred and twenty.
$ec_lang['lpn_crs_view']='Filter by map view';
$ec_lang['lpn_crs_view_tip']='Offers only the coordinate reference systems (CRS) that cover the place the map is looking at. Turn it off to read the whole list.';
$ec_lang['lpn_crs_place']='Place name search';
$ec_lang['lpn_crs_place_tip']='Type a town, an address, or a landmark, and the map view moves there. The words you type go to OpenStreetMap’s place-name service, which asks your permission the first time. A new geographic project also starts at the place you find here.';
$ec_lang['lpn_crs_search']='Search';
$ec_lang['lpn_crs_name']='CRS name filter';
$ec_lang['lpn_crs_name_tip']='Shows only the coordinate reference systems (CRS) whose name or EPSG code contains what you type. Try a zone number, or UTM, or Mercator.';
$ec_lang['lpn_crs_list']='CRS';
$ec_lang['lpn_crs_list_tip']='The coordinate reference systems (CRS) left by the two filters above. Choose one and press Select.';
$ec_lang['lpn_crs_choose']='Select';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='No place has been searched for yet, so the whole list is offered. Search for a place above or zoom the map to narrow it.';
$ec_lang['lpn_crs_count']='{n} of {total} coordinate reference systems (CRS) listed.';
$ec_lang['lpn_crs_place_projected']='A georeferenced project opens on its own plane, not at the place you searched for. Putting that plane on the Earth needs a coordinate transform, which this page does not have yet.'; // [TGH: Isn't this obsolete? Isn't the purpose of this branch project to make this obsolete?]
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
$ec_lang['lpn_crs_none']='Not georeferenced';
```
