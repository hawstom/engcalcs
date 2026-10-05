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

**63 still to read on master**, of 116 untranslated keys, of 2344 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (10 to read @@ NEEDS RULING)

**These are SHIPPED strings, already translated into 26 languages.** A wave-0
reading or a translator found each one readable two ways, and no sprint launches while one is
unanswered. You are not being asked to approve wording here; you are being asked which reading
is the one you meant. "The first one" is a complete answer.

### from sprint 1003-ds

- **`lpn_ds_found_below`**
  > ⚠ At least one junction is already below {pressure} at the demands as they are. The system keeps it up to a demand scale of {m}.
  *The finding:* Tom: 'I think I need explanation, and this need clarification.' It appears after Find when the demands as entered (a demand scale of 1) leave at least one junction below the limit; {m} is the largest scale, always under 1, at which every judged junction keeps the limit (0.62 means demands cut to 62 percent). 'it' in 'keeps it' is vague, 'demands as they are' never says scale 1, and {m} reads as headroom when it is a cut.
  1. the system can take up to {m} times today's demand (wrong)
  2. demands must be cut to {m} times what is entered for every junction to keep the pressure (right)
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED A: '⚠ At least one junction is below {pressure} at the demands as entered (a demand scale of 1). All junctions keep {pressure} only if demands are cut to a demand scale of {m} or less.' PROPOSED B: '⚠ The demands as entered (a demand scale of 1) leave at least one junction below {pressure}. The largest demand scale that keeps every junction at {pressure} or above is {m}.' B paralle...
  @@ NEEDS RULING

### from sprint 1003b-wave0

- **`lpn_crs_list_tip`**
  > The coordinate systems left by the two filters above. Choose one, then press OK.
  *The finding:* 'The two filters above' is not countable on the page (Looped-Network.php:1738-1750 shows a map-view checkbox, a place search, and a name filter)
  1. map-view checkbox and name filter
  2. place search and name filter
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED: 'The coordinate systems that pass the map view filter and the name filter above. Choose one, then press OK.'
  @@ NEEDS RULING
- **`lpn_ds_eps_note`**
  > Only the time step now on screen is scaled, with its tank levels and link statuses. To test the peak, move the clock to the peak demand before you run.
  *The finding:* 'Only the time step now on screen is scaled, with its tank levels and link statuses' reads as if the levels and statuses are scaled too; 'run' can mean the Run button or the EPANET simulation
  1. the time step's demands, tank levels and link statuses are all scaled
  2. only the demands are scaled; levels and statuses are taken from that step
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED: 'The demands of the time step now on screen are scaled, and the network is solved with that step’s tank levels and link statuses. To test the peak, move the clock to the peak demand before you run.'
  @@ NEEDS RULING
- **`lpn_ds_find`**
  > Find
  *The finding:* A bare 'Find' collides with the Find feature that selects assets by condition (lpn_notes_4_def), and a translator cannot tell which; Run sits beside it with the same bare style
  1. find assets matching a condition
  2. find the largest demand scale (the button at js/looped-network.js:59552)
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED: 'Find largest scale'
  @@ NEEDS RULING
- **`lpn_ds_found`**
  > ✓ Every junction keeps {pressure} up to a demand scale of {m}.
  *The finding:* 'Every junction' is false under the Selected scope, where only the chosen junctions are checked; 'keeps {pressure}' is elliptical for 'at least'
  1. the whole system holds the pressure
  2. only the checked junctions hold at least the pressure
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED: '✓ Every junction checked keeps at least {pressure} up to a demand scale of {m}.'
  @@ NEEDS RULING
- **`lpn_ds_search_note`**
  > Finds the largest demand scale, from 0 to {max} to the nearest {step}, at which all these junctions maintain the lowest pressure allowed. It assumes that more demand never raises the lowest pressure.
  *The finding:* 'from 0 to {max} to the nearest {step}' stacks two 'to's; 'maintain the lowest pressure allowed' reads as maintaining a pressure setpoint rather than staying at or above it
  1. search from 0 up to the maximum, rounding to the step
  2. search from 0 to the maximum, and keep the pressure at exactly the minimum
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED: 'Finds the largest demand scale at which all these junctions keep at least the lowest pressure allowed. It searches from 0 to {max}, to the nearest {step}, and assumes that more demand never raises the lowest pressure.'
  @@ NEEDS RULING
- **`lpn_ff_design_none`**
  > Nothing in the scope you chose went outside its limits while any junction drew its fire flow.
  *The finding:* Two scopes exist on this page (Junctions to test, and the Design check All/Selected), and 'the scope you chose' does not say which; 'any junction drew' can read as 'whenever one did' or 'if some junction did'
  1. no limit was exceeded during any tested junction's fire flow, within the design check scope
  2. no limit was exceeded in the junctions-to-test scope
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED: 'With each tested junction’s fire flow drawn in turn, nothing in the design check scope went outside its limits.'
  @@ NEEDS RULING
- **`lpn_new_coordsys_tip`**
  > Choose the coordinate system of your network. This is permanent; the only way to convert a network to different coordinates is with “File, Convert as…”, and it is approximate.
  *The finding:* 'This is permanent' is contradicted by 'the only way ... convert', and 'it is approximate' has no clear referent (the choice, the conversion, or the network)
  1. the choice cannot change, except by a conversion that is approximate
  2. the network can be converted by one route only, and the network's coordinates are approximate
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED: 'Choose the coordinate system of your network. The choice is permanent, except that “File, Convert as…” can convert the network to other coordinates, and that conversion is approximate.'
  @@ NEEDS RULING
- **`lpn_notes_4_def`**
  > A project can sit on real ground with a street map behind it. EPANET .inp files can be read in and written out. The bottom panel draws a profile along a route and lists the junctions. Assets can be colored by their results, and Find selects every asset that matches a condition you set.
  *The finding:* 'lists the junctions' says neither where nor what; 'route' where the Graphs tip says 'path'; 'sit on real ground' is idiom; the bottom panel is called a pane elsewhere (Looped-Network.php:1855 renders it as one About-box paragraph)
  1. the bottom panel lists every junction with its results
  2. the bottom panel lists only the junctions along the profile route
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED: 'A project can be placed on real ground with a street map behind it. EPANET .inp files can be read and written. The bottom pane plots a profile along a path and tabulates the junctions. Assets can be colored by their results, and Find selects every asset that matches a condition you set.'
  @@ NEEDS RULING
- **`lpn_ts_add_none`**
  > Nothing of that kind is selected on the map.
  *The finding:* 'Nothing of that kind' has no antecedent in the note, and the note also appears when the selected assets are already on the graph (added === 0), where 'not selected' is false
  1. no asset of the shown group (Nodes or Links) is selected
  2. the selected assets are already on the graph, so none was added
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED: 'No new assets of this group are selected on the map.'
  @@ NEEDS RULING

## Synonym entries to approve  (19, 19 to read @@ NEEDS RULING)

**These are translator notes (`$ec_lang_syn`), not visitor wording.** Each was written against an
English string that has since changed, or against a key that no longer exists. Say which: keep it
as is, change it (a proposal may follow), or remove it. **Your answer on the flag line is the
written permission** the rule requires; CC then applies it by hand and re-records it. A script
never edits a synonym.

- **`calc_set_units_tip`**
  > Sets the unit of every field at once. Non-destructive: the numbers you entered stay exactly as they are, and each one is now read in the new unit. A 6 stays a 6, but it now means 6 inches instead of 6 millimetres.
  *Why stale:* the English changed after this synonym was written
  *Written against:* Sets the unit of every field at once. Non-destructive: the numbers you typed stay exactly as they are, and each one is now read in the new unit. A 6 stays a 6, but it now means 6 inches instead of 6 millimetres.
  *Current synonym:* Changes the unit shown on every field at once (switches the whole page to that unit system). Does not change the input data.
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

- **`consent_body`**
  > May we save a one-digit cookie in this browser to remember that we have already counted this page? It records nothing about you and nothing you enter. Without it we cannot tell your second visit from somebody else’s first.
  *Why stale:* the English changed after this synonym was written
  *Written against:* May we save a one-digit cookie in this browser to remember that we have already counted this page? It records nothing about you and nothing you type. Without it we cannot tell your second visit from somebody else’s first.
  *Current synonym:* May we save (store, keep, put) a one-digit cookie (a tiny stored marker) in this browser to remember that we have already counted this page? It records nothing about you and nothing you type. Without it we cannot tell your second visit from somebody else’s first.
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

- **`ip_is_lateral`**
  > <span class="ec-help" title="Selected: this reach is a segment of the test lateral, from which individual emitters withdraw water. Cleared: this reach is a main, only passing flow along to laterals not on the test path.">Lat. <span class="ec-tip">?</span></span>
  *Why stale:* the English changed after this synonym was written
  *Written against:* <span class="ec-help" title="Checked: this reach is a segment of the test lateral, from which individual emitters withdraw water. Unchecked: this reach is a main, only passing flow along to laterals not on the test path.">Lat. <span class="ec-tip">?</span></span>
  *Current synonym:* | gloss: lateral, mainline; avoid: "test" read as typical/sample
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

- **`lpn_backdrop_scale_entry_bad`**
  > Enter one number for the size of one pixel on the map, or paste all six lines of a world file.
  *Why stale:* the English changed after this synonym was written
  *Written against:* Type one number for the size of one pixel on the map, or paste all six lines of a world file.
  *Current synonym:* World (Map Coordinates or Georeference) File for the image | gloss: world file
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

- **`lpn_ds_head_search_selected`**
  > What demand scale can these junctions handle?
  *Why stale:* the English changed after this synonym was written
  *Written against:* What demand can the selection handle
  *Current synonym:* What demand can the junctions you choose handle
  *Proposed synonym:* What demand scale can these junctions carry?, How far can the demand at these junctions be scaled?
  *Why this proposal:* The heading is now a question about a demand scale at these junctions; both rephrasings could head the same box.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_ds_scope_tip`**
  > All junctions, or only those selected on the map. Pressures are checked at the scaled demand.
  *Why stale:* the English changed after this synonym was written
  *Written against:* Scale the demand of the selection. Pressures are checked at the scaled demand.
  *Current synonym:* Scale the demand at the junctions that you choose. Pressures are checked at the scaled demand.
  *Proposed synonym:* Every junction, or just the junctions selected on the map. Pressures are checked at the scaled demand.
  *Why this proposal:* Whole-string rephrasing of the new two-option sentence; the old text described only the selection.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_ds_search_note_selected`**
  > (this key no longer exists in lib/lang.ec.en.php)
  *Why stale:* the key no longer exists, so this entry describes nothing
  *Written against:* Finds the largest demand scale, from 0 to {max} to the nearest {step}, at which the selection keeps the given lowest pressure allowed.
  *Current synonym:* Finds the largest demand scale, from 0 to {max} to the nearest {step}, at which the junctions that you choose keep the given lowest pressure allowed.
  **What this asks for:** WRITTEN PERMISSION to remove this `$ec_lang_syn` entry.
  @@ NEEDS RULING

- **`lpn_ff_all`**
  > All junctions
  *Why stale:* the English changed after this synonym was written
  *Written against:* All
  *Current synonym:* All junctions | a pull-down option under Junctions to test; agrees with junctions, plural
  *Proposed synonym:* Every junction, All the junctions | a pull-down option under Junctions to test; agrees with junctions, plural
  *Why this proposal:* Both would fit the pull-down; the English now says junctions, plural, which the commentary already required.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
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

- **`lpn_help_icons`**
  > Toolbar
  *Why stale:* the English changed after this synonym was written
  *Written against:* Toolbar key
  *Current synonym:* Toolbar legend, Key to the toolbar icons, What each toolbar icon means, Toolbar help, Toolbar | avoid: a keyboard key or shortcut
  *Proposed synonym:* Toolbar legend, Toolbar icon key, Toolbar help | avoid: a keyboard key or shortcut
  *Why this proposal:* The English dropped the word key; each could stand in the menu row.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_labels_col_after`**
  > Aft.
  *Why stale:* the English changed after this synonym was written
  *Written against:* After
  *Current synonym:* After, Suffix, Trailing text, Postfix | avoid: after in the sense of later in time
  *Proposed synonym:* Aft. (After, Suffix, Trailing text) | layout: column heading; avoid: after in the sense of later in time
  *Why this proposal:* The English is now the short heading; the full words are the alternates.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_labels_col_before`**
  > Bef.
  *Why stale:* the English changed after this synonym was written
  *Written against:* Before
  *Current synonym:* Before, In front, In front of the value, Prefix, Leading text | avoid: before in the sense of earlier in time
  *Proposed synonym:* Bef. (Before, Prefix, Leading text) | layout: column heading; avoid: before in the sense of earlier in time
  *Why this proposal:* The English is now the short heading; the full words are the alternates.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_labels_priority_node_tip`**
  > The order in which values are dropped when a label does not fit. The value numbered 1 is dropped first. When only one value is left and two labels still overlap, one of them is hidden: the one with the lower demand, with pressure nearer the middle of the range, or with elevation or head more like its neighboring nodes.
  *Why stale:* the English changed after this synonym was written
  *Written against:* The order in which values are dropped when two node labels would overlap. The value numbered 1 is dropped first. When only one value is left and the labels still overlap, one whole label is hidden: the one with the lower demand, the pressure nearer the middle of the range, or the elevation or head more like neighboring nodes.
  *Current synonym:* more like neighboring nodes = numerically closer to the neighbors' values | avoid: similar in kind
  **What this asks for:** WRITTEN PERMISSION to keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing).
  @@ NEEDS RULING

- **`lpn_lock_break`**
  > Break lock
  *Why stale:* the English changed after this synonym was written
  *Written against:* Break their lock
  *Current synonym:* Break their lock, unlock the file, take over the file, release their hold on it, claim the file, override their claim | layout: button
  *Proposed synonym:* Break lock, Unlock the file, Take over the file, Override their claim | layout: button
  *Why this proposal:* Dropped the options that only made sense with the old English "Break their lock".
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_profile_tip`**
  > (this key no longer exists in lib/lang.ec.en.php)
  *Why stale:* the key no longer exists, so this entry describes nothing
  *Written against:* Draw the ground and the hydraulic grade line along a path through the network.
  *Current synonym:* Draw the ground or grade and the hydraulic grade line along a path, route, or way through the network.
  **What this asks for:** WRITTEN PERMISSION to remove this `$ec_lang_syn` entry.
  @@ NEEDS RULING

- **`lpn_settings_map_display`**
  > Appearance
  *Why stale:* the English changed after this synonym was written
  *Written against:* Map appearance
  *Current synonym:* How the map looks (appearance, style, the way it is drawn) — sizes, opacity, position.
  *Proposed synonym:* Appearance, Look, Style, How the map is drawn
  *Why this proposal:* The old text was a description; each of these could be the heading.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

- **`lpn_units_group_inputs`**
  > (this key no longer exists in lib/lang.ec.en.php)
  *Why stale:* the key no longer exists, so this entry describes nothing
  *Written against:* Input units
  *Current synonym:* Units of inputs, or Units of what you enter
  **What this asks for:** WRITTEN PERMISSION to remove this `$ec_lang_syn` entry.
  @@ NEEDS RULING

- **`lpn_units_group_results`**
  > (this key no longer exists in lib/lang.ec.en.php)
  *Why stale:* the key no longer exists, so this entry describes nothing
  *Written against:* Results units
  *Current synonym:* Units of results, or Units of the answers
  **What this asks for:** WRITTEN PERMISSION to remove this `$ec_lang_syn` entry.
  @@ NEEDS RULING

- **`mtc_note_1`**
  > <dl><dt>Automated rock size and roughness design iteration</dt><dd>Choose a roughness option (Blodgett–Bathurst recommended) and a design rock size option (Isbash recommended). Adjust depth and rock size safety factor to reach your target flow with a uniform rock size. Each time you change an input, the calculator repeats these steps: 1. Roughness is calculated from design rock size. 2. The roughness value from the method you chose is copied into the roughness input. 3. Channel flow and required rock size are calculated. 4. Design rock size is adjusted. 5. Repeat until error in the design rock size is very small.</dd><dt>Basic calculator (no iteration)</dt><dd>Enter your desired roughness value. Ignore the design rock size input area.</dd></dl>
  *Why stale:* the English changed after this synonym was written
  *Written against:* <dl><dt>Automated rock size and roughness design iteration</dt><dd>Choose a roughness option (Blodgett–Bathurst recommended) and a design rock size option (Isbash recommended). Adjust depth and rock size safety factor to reach your target flow with a uniform rock size. Each time you change an input, the calculator repeats these steps: 1. Roughness is calculated from design rock size. 2. The r...
  *Current synonym:* | avoid: compressing "Blodgett–Bathurst" to an initialism like "BB" — recurred independently across 8+ languages (it/ru/bg/es/uk/sr/hr/cs/tr/ps/my, corrected 2026-07-08) since nothing else in this string defines what the initials stand for; spell the full name out in every language, matching mtc_blodgett_v_bathurst
  *Proposed synonym:* | avoid: compressing "Blodgett–Bathurst" to an initialism like "BB" — recurred independently across 8+ languages (it/ru/bg/es/uk/sr/hr/cs/tr/ps/my, corrected 2026-07-08) since nothing else in this string defines what the initials stand for; spell the full name out in every language, matching mtc_blodgett_v_bathurst
  *Why this proposal:* No change proposed: the note is about the initialism, not the reworded step 2, and still holds.
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
  @@ NEEDS RULING

## lpn_  (116, 63 to read @@ NEEDS RULING)

- **`lpn_alt_calc_options`**
  > Calculation options
  @@ NEEDS RULING
- **`lpn_analyze_at_time`**
  > Time step: {time}.
  _Ruled OK 2026-10-03._
- **`lpn_analyze_time_moved`**
  > ⚠ This was computed at {time}, and the clock is now at {now}. Run it again for the time step on screen.
  _Ruled OK 2026-10-03._
- **`lpn_basemap_style_faded`**
  > Faded
  @@ NEEDS RULING
- **`lpn_basemap_style_grayscale`**
  > Grayscale
  @@ NEEDS RULING
- **`lpn_basemap_style_muted`**
  > Muted
  @@ NEEDS RULING
- **`lpn_basemap_style_normal`**
  > Normal
  @@ NEEDS RULING
- **`lpn_choice_default`**
  > Default
  @@ NEEDS RULING
- **`lpn_contour_show`**
  > Show contours
  @@ NEEDS RULING
- **`lpn_contour_show_tip`**
  > Clear to hide the fill and the contour lines; select to bring them back as they were. Node colors stay.
  @@ NEEDS RULING
- **`lpn_cp_allow_tip`**
  > Allow only these characters:
  @@ NEEDS RULING
- **`lpn_cp_characters_tip`**
  > "@" means any letter; "#" means any numeric digit, and you must separately list "-", ".", and "," if they are allowed; and any white space characters must be between other characters.
  @@ NEEDS RULING
- **`lpn_diag_pda_needs_epanet`**
  > The demand model is pressure driven, and only the EPANET solver can compute it. The EPANET solver could not be loaded, so these results are missing.
  @@ NEEDS RULING
- **`lpn_diag_pda_pressures`**
  > Required pressure must be greater than Minimum pressure. Change one of them in Settings.
  @@ NEEDS RULING
- **`lpn_dock_autohide`**
  > Auto-hide
  @@ NEEDS RULING
- **`lpn_dock_float`**
  > Float
  @@ NEEDS RULING
- **`lpn_dock_left`**
  > Dock at the left of the map
  @@ NEEDS RULING
- **`lpn_dock_right`**
  > Dock at the right of the map
  @@ NEEDS RULING
- **`lpn_ds_bad_multiplier`**
  > Enter a demand scale of zero or more, such as 1.5.
  @@ NEEDS RULING
- **`lpn_ds_below_zero`**
  > ⚠ At least one junction is below {pressure} even with the scaled demands at zero.
  _Ruled OK 2026-10-03._
- **`lpn_ds_col_link`**
  > Link
  _Ruled OK 2026-10-03._
- **`lpn_ds_col_scaled`**
  > Scaled
  _Ruled OK 2026-10-03._
- **`lpn_ds_col_scaled_tip`**
  > With the demands multiplied by the demand scale.
  _Ruled OK 2026-10-03._
- **`lpn_ds_col_unscaled`**
  > Unscaled
  _Ruled OK 2026-10-03._
- **`lpn_ds_col_unscaled_tip`**
  > With the demands as they are in the active scenario at this time step, the same value the map shows.
  _Ruled OK 2026-10-03._
- **`lpn_ds_eps_note`**
  > Only the time step now on screen is scaled, with its tank levels and link statuses. To test the peak, move the clock to the peak demand before you run.
  _Ruled OK 2026-10-04._
- **`lpn_ds_find`**
  > Find
  _Ruled OK 2026-10-04._
- **`lpn_ds_found`**
  > ✓ Every junction keeps {pressure} up to a demand scale of {m}.
  _Ruled OK 2026-10-04._
- **`lpn_ds_found_below`**
  > ⚠ At least one junction is already below {pressure} at the demands as they are. The system keeps it up to a demand scale of {m}.
  _Ruled 2026-10-03: I think I need explanation, and this need clarification._
- **`lpn_ds_head_lowest`**
  > Lowest pressures
  _Ruled OK 2026-10-03._
- **`lpn_ds_head_scale`**
  > Scale the demands
  _Ruled OK 2026-10-03._
- **`lpn_ds_head_search`**
  > What demand scale can the system handle?
  _Ruled OK 2026-10-03._
- **`lpn_ds_head_search_selected`**
  > What demand scale can these junctions handle?
  _Ruled OK 2026-10-03._
- **`lpn_ds_head_velocity`**
  > Highest velocities
  _Ruled OK 2026-10-03._
- **`lpn_ds_holds_max`**
  > ✓ Every junction keeps {pressure} up to a demand scale of {max}, the top of the search.
  _Ruled OK 2026-10-03._
- **`lpn_ds_intro`**
  > The demands are multiplied on a copy of the network, which is solved at the time step on screen in the active scenario. Nothing in your project is changed.
  _Ruled OK 2026-10-03._
- **`lpn_ds_lowest_at`**
  > At a demand scale of {m}, the lowest pressure is {pressure}, at junction {id}.
  _Ruled OK 2026-10-03._
- **`lpn_ds_menu`**
  > Demand scaling…
  _Ruled OK 2026-10-03._
- **`lpn_ds_menu_tip`**
  > Multiply the demands on a copy of the network and see the pressures and velocities, or find the largest demand scale the system can carry.
  _Ruled OK 2026-10-03._
- **`lpn_ds_minpressure`**
  > Lowest pressure allowed
  _Ruled OK 2026-10-03._
- **`lpn_ds_minpressure_tip`**
  > This is the same number as Lowest pressure allowed elsewhere in Fire flow analysis. Changing it here changes it there.
  _Ruled OK 2026-10-03._
- **`lpn_ds_multiplier`**
  > Demand scale
  _Ruled OK 2026-10-03._
- **`lpn_ds_multiplier_tip`**
  > The number each demand is multiplied by: 1.5 is half again as much water. It applies on top of the active scenario's own demand multiplier, which is already in the demands, and it is never saved in your project.
  _Ruled OK 2026-10-03._
- **`lpn_ds_no_junctions`**
  > This project has no junctions yet, so there are no demands to scale.
  _Ruled OK 2026-10-03._
- **`lpn_ds_no_selection`**
  > No junctions are selected. Select junctions or choose All junctions.
  _Ruled OK 2026-10-03._
- **`lpn_ds_nosolve_at`**
  > At a demand scale of {m}, the network gave no answer. {reason}
  _Ruled OK 2026-10-03._
- **`lpn_ds_outside_below`**
  > At a demand scale of {m}, junctions not selected that are below {pressure}: {n} ({ids}). They do not limit this answer.
  _Ruled OK 2026-10-03._
- **`lpn_ds_run`**
  > Run
  _Ruled OK 2026-10-03._
- **`lpn_ds_scale_below`**
  > ⚠ At a demand scale of {m}, junctions below {pressure}: {n}.
  _Ruled OK 2026-10-03._
- **`lpn_ds_scale_ok`**
  > ✓ At a demand scale of {m}, every junction keeps {pressure}.
  _Ruled OK 2026-10-03._
- **`lpn_ds_scaled_selected`**
  > Junctions scaled and checked: {n}.
  _Ruled OK 2026-10-03._
- **`lpn_ds_scope`**
  > Junctions to scale
  _Ruled OK 2026-10-03._
- **`lpn_ds_scope_all`**
  > All junctions
  _Ruled OK 2026-10-03._
- **`lpn_ds_scope_selected`**
  > Selected junctions
  _Ruled OK 2026-10-03._
- **`lpn_ds_scope_tip`**
  > All junctions, or only those selected on the map. Pressures are checked at the scaled demand.
  _Ruled OK 2026-10-03._
- **`lpn_ds_search_note`**
  > Finds the largest demand scale, from 0 to {max} to the nearest {step}, at which all these junctions maintain the lowest pressure allowed. It assumes that more demand never raises the lowest pressure.
  @@ NEEDS RULING
- **`lpn_ds_search_stopped`**
  > The search was stopped before it found an answer.
  _Ruled 2026-10-03: OK. Are we sure this isn't already provided by a different key?_
- **`lpn_ds_skipped`**
  > Selected elements that are not junctions, left as they are: {n}.
  _Ruled OK 2026-10-03._
- **`lpn_ds_stale`**
  > The drawing changed, so the demand scaling results were cleared. Run it again.
  _Ruled OK 2026-10-03._
- **`lpn_ds_title`**
  > Demand scaling
  _Ruled OK 2026-10-03._
- **`lpn_engine_failed_why`**
  > {reason} Showing the built-in solver instead.
  @@ NEEDS RULING
- **`lpn_engine_needed_failed_why`**
  > This network can only be solved by the EPANET solver. {reason}
  @@ NEEDS RULING
- **`lpn_engine_pda_route`**
  > Solved with the EPANET solver, because the demand model is pressure driven.
  @@ NEEDS RULING
- **`lpn_engine_unavailable_why`**
  > Valves that open and close on their own cannot be solved without the EPANET solver. {reason}
  @@ NEEDS RULING
- **`lpn_inp_drop_pressure_unit`**
  > This file states a pressure unit other than the one this page reads for its flow unit, which is psi for US units and meters otherwise. Every pressure in the file is read that way, so check the valve settings, emitters, and pressure driven limits it holds. The line is kept and is written back.
  @@ NEEDS RULING
- **`lpn_mode_add_chain`**
  > Mode: Junction Pipe Chain. Specify a point on the map to add a junction, then specify each next point to add a pipe and a junction. Specify an existing node to continue from it. Press Escape to end the chain. Switch to Select mode to change or move assets and labels.
  @@ NEEDS RULING
- **`lpn_pane_filter_sel_and`**
  > Filtered by {q} and selection only. Showing {n} of {all}.
  @@ NEEDS RULING
- **`lpn_pane_filter_sel_none`**
  > None of the selected elements are in this table.
  @@ NEEDS RULING
- **`lpn_pane_filter_sel_note`**
  > Selection only. Showing {n} of {all}.
  @@ NEEDS RULING
- **`lpn_pane_manage_cols_width`**
  > Width (em)
  @@ NEEDS RULING
- **`lpn_pane_sel_only`**
  > Selection only
  @@ NEEDS RULING
- **`lpn_pane_sel_only_none`**
  > No elements are selected. Select elements on the map first.
  @@ NEEDS RULING
- **`lpn_pane_sort_desc`**
  > Sort descending
  _Ruled OK 2026-09-26._
- **`lpn_pane_width_tip`**
  > Column widths are saved in this browser, not in the project. Double-click a column divider to restore the default width.
  @@ NEEDS RULING
- **`lpn_pda_deficit_note`**
  > Junctions receiving less than their demand: {n}.
  @@ NEEDS RULING
- **`lpn_pgraph_none`**
  > This asset has no results in the current run.
  _Ruled OK 2026-10-01._
- **`lpn_pgraph_source_share_from`**
  > Source share from {node}
  _Ruled OK 2026-10-01._
- **`lpn_profile_file_done`**
  > Profile read from the file: {used} of {total} nodes found in this network.
  _Ruled OK 2026-10-03._
- **`lpn_profile_file_missing`**
  > Named in the file but not in this network: {ids}.
  _Ruled OK 2026-10-03._
- **`lpn_profile_file_short`**
  > The file names fewer than two nodes in this network, so there is no profile to draw.
  _Ruled OK 2026-10-03._
- **`lpn_profile_open`**
  > Open EPANET profile file…
  _Ruled OK 2026-10-03._
- **`lpn_report_pump_head`**
  > Pump head
  _Ruled OK 2026-10-03._
- **`lpn_result_delivered_demand`**
  > Delivered demand
  @@ NEEDS RULING
- **`lpn_result_delivered_demand_tip`**
  > The flow this junction actually receives under the pressure driven demand model. It is less than the demand when the pressure is below the required pressure.
  @@ NEEDS RULING
- **`lpn_result_demand_deficit`**
  > Demand deficit
  @@ NEEDS RULING
- **`lpn_result_demand_deficit_tip`**
  > The demand this junction asks for and does not receive, because the pressure is below the required pressure.
  @@ NEEDS RULING
- **`lpn_result_pump_head`**
  > Head
  _Ruled OK 2026-10-03._
- **`lpn_result_pump_head_tip`**
  > The head the pump adds from suction to discharge, shown as a positive number. The solver and EPANET files carry it as a negative head loss.
  _Ruled OK 2026-10-03._
- **`lpn_saved_browser`**
  > Saved in this browser
  @@ NEEDS RULING
- **`lpn_saved_project`**
  > Saved with the project
  @@ NEEDS RULING
- **`lpn_saved_session`**
  > Not saved
  @@ NEEDS RULING
- **`lpn_scenario_duration_tip`**
  > Overrides the total run time in this scenario. Leave it blank to use its parent's. A total run time of 0:00 is a steady-state run.
  @@ NEEDS RULING
- **`lpn_scenario_hyd_step_tip`**
  > Overrides the hydraulic time step in this scenario. Leave it blank to use its parent's.
  @@ NEEDS RULING
- **`lpn_scncmp_at_time`**
  > {value} at {id}, {time}
  @@ NEEDS RULING
- **`lpn_scncmp_period_note`**
  > Where a scenario has a total run time, its lowest pressure and highest velocity are the extremes of the whole run, at the time shown.
  @@ NEEDS RULING
- **`lpn_scncmp_same`**
  > The same in every scenario
  @@ NEEDS RULING
- **`lpn_settings_basemap_style`**
  > Basemap style
  @@ NEEDS RULING
- **`lpn_settings_basemap_style_tip`**
  > Tones down the street or satellite tiles so the network stands out. It changes only how the tiles look on your screen, not the drawing, labels or credit.
  @@ NEEDS RULING
- **`lpn_settings_demand_model`**
  > Demand model
  @@ NEEDS RULING
- **`lpn_settings_demand_model_dda`**
  > Demand driven
  @@ NEEDS RULING
- **`lpn_settings_demand_model_pda`**
  > Pressure driven
  @@ NEEDS RULING
- **`lpn_settings_demand_model_tip`**
  > Choose how junctions receive water. Demand driven (DDA) delivers every demand in full, whatever the pressure. Pressure driven (PDA) delivers less than the demand where the pressure is below the required pressure, and only the EPANET solver computes it.
  @@ NEEDS RULING
- **`lpn_settings_min_pressure`**
  > Minimum pressure
  @@ NEEDS RULING
- **`lpn_settings_min_pressure_tip`**
  > Enter the pressure at or below which a junction receives no water. Use this project's pressure unit.
  @@ NEEDS RULING
- **`lpn_settings_pressure_exponent`**
  > Pressure exponent
  @@ NEEDS RULING
- **`lpn_settings_pressure_exponent_tip`**
  > Enter the exponent of the curve that rises from no water at the minimum pressure to the full demand at the required pressure.
  @@ NEEDS RULING
- **`lpn_settings_req_pressure`**
  > Required pressure
  @@ NEEDS RULING
- **`lpn_settings_req_pressure_tip`**
  > Enter the pressure at or above which a junction receives its full demand. It must be greater than the minimum pressure. Use this project's pressure unit. Leave it blank to use EPANET's default, which is in psi for US flow units and meters otherwise.
  @@ NEEDS RULING
- **`lpn_sysflow_title`**
  > Flow balance
  _Ruled OK 2026-10-03._
- **`lpn_time_engine_fetch_failed`**
  > The download of the EPANET solver failed. Reload the page to try again; a firewall, proxy, or browser extension may be blocking it.
  @@ NEEDS RULING
- **`lpn_time_engine_run_failed`**
  > The EPANET run failed. That is a defect in this page; use the {wrong} link to report it.
  @@ NEEDS RULING
- **`lpn_time_engine_start_failed`**
  > The browser refused to start the EPANET solver. WebAssembly may be turned off by a security setting or an extension.
  @@ NEEDS RULING
- **`lpn_time_no_engine_why`**
  > The built-in solver calculates one moment at a time, so this is the network at {time} only: every pattern is read at that moment, and every tank still sits at its starting level instead of filling and draining. {reason}
  @@ NEEDS RULING
- **`lpn_time_scn_overrides`**
  > Scenario overrides:
  @@ NEEDS RULING
- **`lpn_tool_add_chain`**
  > Junction Pipe Chain
  @@ NEEDS RULING
- **`lpn_tool_add_chain_tip`**
  > Chain junctions and pipes: specify a point on the map to add a junction, then specify each next point to add a pipe and a junction. Specify an existing node to continue from it. Press Escape to end the chain.
  @@ NEEDS RULING

---

# Strings waiting on a branch

**14 still to read**, of 17 new keys across 12 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### chore/journals-1005 (`6cbb6e53`) — 3 new, 3 to read @@ NEEDS RULING

- **`lpn_copy_opened_unsaved`**
  > Opened {file} as a copy, with a new lock of its own that will be saved with the next file save.
  @@ NEEDS RULING
- **`lpn_pane_delete_element`**
  > Delete element
  @@ NEEDS RULING
- **`lpn_pane_delete_elements`**
  > Delete elements
  @@ NEEDS RULING

### feat/desktop (`baba0f04`) — adds no English strings

### feat/engine-prefetch (`3194c30d`) — adds no English strings

### feat/find-source (`e999a378`) — 2 new, 2 to read @@ NEEDS RULING

- **`lpn_find_scope_source`**
  > Source
  @@ NEEDS RULING
- **`lpn_find_source_no_chemical`**
  > No chemical is being tracked, so no node has a source.
  @@ NEEDS RULING

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

### feat/label-placer-a (`3483bfd6`) — adds no English strings

### feat/label-placer-b (`c5905432`) — adds no English strings

### feat/label-placer-c (`9a790a3e`) — adds no English strings

### feat/label-placer-d (`129b63c4`) — adds no English strings

### feat/times-statistic (`70959325`) — 6 new, 6 to read @@ NEEDS RULING

- **`lpn_time_stat_averaged`**
  > Avg
  @@ NEEDS RULING
- **`lpn_time_stat_maximum`**
  > Max
  @@ NEEDS RULING
- **`lpn_time_stat_minimum`**
  > Min
  @@ NEEDS RULING
- **`lpn_time_stat_none`**
  > None
  @@ NEEDS RULING
- **`lpn_time_stat_range`**
  > Range
  @@ NEEDS RULING
- **`lpn_time_statistic`**
  > Statistic
  @@ NEEDS RULING

### feat/transport-ends (`ea86235f`) — 3 new, 3 to read @@ NEEDS RULING

- **`lpn_copy_opened_unsaved`**
  > Opened {file} as a copy, with a new lock of its own that will be saved with the next file save.
  @@ NEEDS RULING
- **`lpn_pane_delete_element`**
  > Delete element
  @@ NEEDS RULING
- **`lpn_pane_delete_elements`**
  > Delete elements
  @@ NEEDS RULING

### fix/engine-failed (`1cce4b51`) — adds no English strings
