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

**16 still to read on master**, of 65 untranslated keys, of 2344 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (11 to read @@ NEEDS RULING)

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
  > Choose the coordinate system of your network. This is permanent; the only way you can convert a network to different coordinates is with “File, Convert as…”, and it is approximate.
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
- **`lpn_ts_add_tip`**
  > Put everything now selected on the map onto the graph.
  *The finding:* Says 'everything now selected', but tsAddSelection() (js/looped-network.js:29915) adds only selected assets of the current group (Nodes or Links); 'now' also reads as 'at this moment' vs 'newly'
  1. every selected asset of any kind goes onto the graph
  2. only the selected assets of the group shown (Nodes or Links) go onto the graph
  **What this asks for:** which of the readings above you meant.
  *The proposal:* PROPOSED: 'Put the selected nodes or links (whichever group is shown) on the map onto the graph.'
  @@ NEEDS RULING

## Synonym entries to approve  (13, 13 to read @@ NEEDS RULING)

**These are translator notes (`$ec_lang_syn`), not visitor wording.** Each was written against an
English string that has since changed, or against a key that no longer exists. Say which: keep it
as is, change it (a proposal may follow), or remove it. **Your answer on the flag line is the
written permission** the rule requires; CC then applies it by hand and re-records it. A script
never edits a synonym.

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

- **`lpn_lock_break`**
  > Break lock
  *Why stale:* the English changed after this synonym was written
  *Written against:* Break their lock
  *Current synonym:* Break their lock, unlock the file, take over the file, release their hold on it, claim the file, override their claim | layout: button
  *Proposed synonym:* Break lock, Unlock the file, Take over the file, Override their claim | layout: button
  *Why this proposal:* Dropped the options that only made sense with the old English "Break their lock".
  **What this asks for:** WRITTEN PERMISSION to replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is).
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

## lpn_  (65, 16 to read @@ NEEDS RULING)

- **`lpn_analyze_at_time`**
  > Time step: {time}.
  _Ruled OK 2026-10-03._
- **`lpn_analyze_time_moved`**
  > ⚠ This was computed at {time}, and the clock is now at {now}. Run it again for the time step on screen.
  _Ruled OK 2026-10-03._
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
  > Type a demand scale of zero or more, such as 1.5.
  _Ruled OK 2026-10-03._
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
- **`lpn_graphs_menu_tip`**
  > Plot a profile along a path, a time series at one element, the frequency distribution of results, a contour plot on the map, or the flow balance over time.
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
- **`lpn_pane_width_tip`**
  > Column widths are saved in this browser, not in the project. Double-click a column divider to restore the default width.
  @@ NEEDS RULING
- **`lpn_pgraph_none`**
  > This asset has no results in the current run.
  _Ruled OK 2026-10-01._
- **`lpn_pgraph_source_share_from`**
  > Source share from {node}
  _Ruled OK 2026-10-01._
- **`lpn_report_pump_head`**
  > Pump head
  _Ruled OK 2026-10-03._
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
- **`lpn_sysflow_title`**
  > Flow balance
  _Ruled OK 2026-10-03._

---

# Strings waiting on a branch

**12 still to read**, of 19 new keys across 11 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### feat/basemap-style (`dc220cf3`) — 6 new, 6 to read @@ NEEDS RULING

- **`lpn_basemap_filter_faded`**
  > Faded
  @@ NEEDS RULING
- **`lpn_basemap_filter_grayscale`**
  > Grayscale
  @@ NEEDS RULING
- **`lpn_basemap_filter_muted`**
  > Muted
  @@ NEEDS RULING
- **`lpn_basemap_filter_normal`**
  > Normal
  @@ NEEDS RULING
- **`lpn_settings_basemap_filter`**
  > Basemap filter
  @@ NEEDS RULING
- **`lpn_settings_basemap_filter_tip`**
  > Tones down the street or satellite tiles so the network stands out. It changes only how the tiles look on your screen; the drawing, labels and credit are not filtered.
  @@ NEEDS RULING

### feat/desktop (`baba0f04`) — adds no English strings

### feat/dialog-audit (`4a665186`) — adds no English strings

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

### feat/profile-file (`a095faf4`) — 4 new, all ruled

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

### feat/scenario-option (`40d49c55`) — 6 new, 6 to read @@ NEEDS RULING

- **`lpn_scenario_duration_tip`**
  > Overrides the project's total run time in this scenario. Leave it blank to use the project's, set in Settings, Calculation, Time. A total run time of 0:00 is a steady-state run.
  @@ NEEDS RULING
- **`lpn_scenario_hyd_step_tip`**
  > Overrides the project's hydraulic time step in this scenario. Leave it blank to use the project's, set in Settings, Calculation, Time.
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
- **`lpn_time_scn_overrides`**
  > Scenario overrides:
  @@ NEEDS RULING

### fix/tip-width (`5aa1cd2d`) — adds no English strings
