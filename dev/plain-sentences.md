# Plain sentences

Help for translators with one string at a time, where the English of that one string is hard to carry into another language. The English stays primary; an entry here is a second wording of the same string, so that a translator is not left with the English as the only source. A concept that recurs across many strings belongs in `dev/terms.md` instead. Tom edits this file directly; `generate_translation_payloads.php` reads it into every translator packet.

## How an entry is written

- The heading is the string's key. The English line is the English the entry was written against. When the string changes, the entry is listed for you in `dev/new-english-keys.md` under "Plain sentences to check".
- **Plain** says what the whole string means, in plain words, its tip included. Synonyms stand side by side, joined by "or", with no parentheses. A comma before "or" only in a list of three or more.
- **Layout** says where the string sits on the page: column heading, unit token, nav item, button, or sub-heading. The full instruction a translator receives for each is in the table in `dev/language-strings.md`.
- **Symbol: yes** marks a string holding a variable symbol, kept exactly as in English.
- **Runtime: units appended** marks a string the page adds a unit to.
- **Note** is anything else a translator needs about this one string.
- Suggestions only, no prohibitions.

## Entries

### menu_libre

- English: Libre Software
- Plain: Software you are free to use, study, change, and share. Free Libre Open Source Software.
- Layout: nav item

### template_welcome

- English: Drop your fears at the door; love is spoken here. You are not ruining everything. Enjoy the <a target="_blank" href="https://hawsedc.com/download.php">free libre HawsEDC AutoCAD tools</a> too.
- Plain: Leave your fears behind as you come in; love is the language spoken here. You are not ruining everything. Enjoy also the free libre HawsEDC AutoCAD tools, software you are free to use, study, change, and share.

### consent_body

- English: May we save a random code in this browser, so we don't count you again? The code is made up on the spot, says nothing about you or your device, and records nothing you enter.
- Plain: May we save, store, or keep a random code, a string of letters and digits chosen by chance, in this browser, so that we do not count you, or this browser, a second time? The code is made up on the spot, created at that moment, says nothing about you or your device, and records nothing you enter.

### consent_accept

- English: Allow this
- Plain: Allow, permit, or accept this ask, this request, or this question

### consent_accept_all

- English: Allow all
- Plain: Allow, permit, or accept this and any later ask; do not ask or question me again

### consent_decline

- English: Refuse all
- Plain: Refuse, decline, or deny this and any later ask; do not ask or question me again

### consent_current_granted

- English: You allowed this. This browser keeps a random code so that we can count it.
- Plain: You allowed this. This browser keeps or stores a random code to stop us from counting this browser again, however many times it visits.

### consent_current_denied

- English: You refused this. We store nothing to limit logging for this browser profile.
- Plain: You refused, declined, or denied this. We store, keep, or save nothing to limit logging or recording for this browser profile.

### consent_region_label

- English: Your choice about the counting code.
- Plain: Your choice about the counting code, the random code that stops us from counting this browser again.

### calc_set_units_tip

- English: Sets the unit of every field at once. Non-destructive: the numbers you entered stay exactly as they are, and each one is now read in the new unit. A 6 stays a 6, but it now means 6 inches instead of 6 millimetres.
- Plain: Changes the unit shown on every field at once, switching the whole page to that unit system. Does not change the input data.

### calc_defaults

- English: Restore defaults
- Plain: Restore, revert, or return to the original, initial, as-shipped, or factory values or state.

### ec_name_label

- English: Save this calculation:
- Plain: Save this calculation: give a name to these inputs or values, saved in the page address for a bookmark, your history, or sharing.

### dw_friction_factor_method

- English: Friction factor method
- Plain: The method used to compute the losses from friction in pipes.

### mi_q_617

- English: <span class="ec-help" title="The composite flow, Q, using a composite n for each region according to Chow 6-17, equal velocities">Q <span class="ec-tip">?</span></span>
- Plain: The total or composite flow, Q, computed with one composite n for each region by Chow equation 6-17, which assumes equal velocities.

### mi_station

- English: Sta
- Plain: Station, chainage, or distance of this point along the alignment. "Distance" is an acceptable alias where the surveying sense of "station" has no natural short word.
- Layout: column heading

### mi_elevation

- English: Elevation
- Plain: The elevation or height of this point of the cross section.
- Layout: column heading
- Symbol: yes

### mi_is_bank

- English: R<sub>h</sub>, Q region boundary (Bank)
- Plain: Boundary, divider, edge, break, or bank as in HEC-RAS, between adjacent regions of differing flow, hydraulic radius, and composite n.
- Layout: column heading

### mi_tau

- English: Bottom shear τ
- Plain: The average tangential or shear stress of the flow on the channel bottom, τ.
- Layout: column heading
- Symbol: yes

### mi_t

- English: T
- Plain: The top width of the water surface, T.
- Layout: column heading
- Symbol: yes

### mi_pw

- English: P<sub>w</sub>
- Plain: The wetted perimeter, P_w: the length of channel boundary the water touches.
- Layout: column heading
- Symbol: yes

### mi_a

- English: A
- Plain: The flow area, A: the area of the water in the cross section.
- Layout: column heading
- Symbol: yes

### mi_rh

- English: R<sub>h</sub>
- Plain: The hydraulic radius, R_h: the flow area divided by the wetted perimeter.
- Layout: column heading
- Symbol: yes

### mi_n617

- English: Comp.<br />n
- Plain: Comp. abbreviates composite: the composite n for the region, by Chow equation 6-17, which assumes equal velocities.
- Layout: column heading
- Symbol: yes

### mi_v617

- English: v
- Plain: The velocity or speed of the flow, v.
- Layout: column heading
- Symbol: yes

### mi_fr617

- English: Fr
- Plain: The Froude number, Fr.
- Layout: column heading
- Symbol: yes

### mi_hv617

- English: h<sub>v</sub>
- Plain: The velocity head, h_v.
- Layout: column heading
- Symbol: yes

### mi_q617

- English: Q
- Plain: The composite flow, Q, computed with a composite n for each region by Chow equation 6-17, which assumes equal velocities.
- Layout: column heading

### mi_notes_1_term

- English: Composite n
- Plain: Composite n: the n for each region, by Chow equation 6-17, which assumes equal velocities.

### mpf_shear_stress

- English: Average shear stress, τ
- Plain: The average tangential or shear stress of the flow on the pipe wall, τ.
- Symbol: yes

### mtc_n_strickler

- English: n from design rock size (Strickler method)
- Plain: Manning’s roughness n from the design rock size, by the Strickler method. The bare lower-case n is Manning’s roughness coefficient, a symbol.
- Symbol: yes

### mtc_blodgett_v_bathurst

- English: Blodgett vs. Bathurst
- Plain: Blodgett versus Bathurst: which of the two roughness methods, Blodgett’s or Bathurst’s, applies at this relative submergence.

### ws_main_menu

- English: Weir Flow Simple
- Plain: Calculator for the flow over a simple weir with a level, uniform, single-elevation crest.

### wi_notes_we_def

- English: q = if (length = 0) then 0 else if (slope=0) then cw*length*d<sub>0</sub><sup>1.5</sup> else cw/(2.5*slope) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) where d<sub>1</sub> and d<sub>0</sub> are always positive or zero
- Plain: The weir flow equation, written in if, then, else form. The words if, then, else, and where may be translated; the structure and the symbols stay as in English.
- Symbol: yes

### mhp_main_menu

- English: Microhydropower
- Plain: Microhydropower: electricity made by a small water turbine.

### mhp_main_title

- English: Free Online Micro-Hydro Power Calculator
- Plain: Free online calculator for microhydropower, the electricity a small water turbine makes.

### mhp_annual_kwh

- English: P as annual energy
- Plain: Energy produced in a year if the plant ran at full output every hour, all 8760 hours: an upper bound, before any capacity factor.

### mhp_vel_ok_short

- English: OK
- Plain: the velocity or speed is high, low, or acceptable

### mhp_vel_high_short

- English: High
- Plain: the velocity or speed is high

### mhp_vel_low_short

- English: Low
- Plain: the velocity or speed is low

### odt_sketch_start

- English: Start
- Plain: The water surface level when draining starts.

### odt_sketch_end

- English: End
- Plain: The water surface level when draining ends.

### ip_t_run

- English: Runtime (hours)
- Plain: Time, duration, or length of time of the run, flow, or operation required for the zone to apply the target depth.

### cs_water_value

- English: Water value
- Plain: The money value, price, or worth of water per unit volume. Any local currency works if used the same way as for the lining cost.

### cs_lining_cost

- English: Lining cost
- Plain: The cost or price of canal lining per unit area. Any local currency works if used the same way as for the water value.

### rc_yn

- English: <span class="ec-help" title="Ponding (Hp > yn) is desirable because it reduces upstream erosion. (USDA)">Normal depth in inlet channel, y<sub>n</sub> <span class="ec-tip">?</span></span>
- Plain: Enter the normal depth in the channel that delivers flow to this slide or chute. Note: Ponding (Hp > yn) reduces erosion upstream, above, or toward the source of the water from the chute inlet.

### rc_apron_length

- English: <span class="ec-help" title="Required for structural support of the rock lining. “The minimum tailwater that occurs as a result of the outlet reach and downstream channel resistance is sufficient to ensure stability of the riprap in the outlet reach.” (Robinson)">Outlet apron length (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>
- Plain: <span class="ec-help" title="Required to act as an outlet toe structural support for the rock on the slope of the chute. “The minimum tailwater that occurs as a result of the outlet reach and downstream channel resistance is sufficient to ensure stability of the riprap in the outlet reach.” (Robinson)">The length of the horizontal or flat reach of rock that is required by Robinson to be placed downstream or below the chute (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>
- Note: An apron is the flat protective pad of rock at the chute outlet, a hydraulic-structures term of the platea or radier family.

### rc_sketch_filter

- English: Filter
- Plain: the filter or bedding layer beneath the rock lining

### ip_main_menu

- English: Irrigation Pressure
- Plain: Pressure in a pressurized irrigation system, a drip or sprinkler pipe network.

### ip_main_title

- English: Free Online Irrigation Pressure & Distribution Uniformity Calculator
- Plain: Free online calculator for the pressure in a drip or sprinkler irrigation pipe network, and for distribution uniformity: how evenly the emitters deliver water.

### ip_main_desc

- English: Test Branch Pressure and Estimated Uniformity
- Plain: The pressure along the test branch, the one path from the supply to the last emitter chosen for study, and an estimate of distribution uniformity, how evenly the emitters deliver water.

### ip_elev_supply

- English: Supply elevation, z<sub>supply</sub>
- Plain: The elevation or height of the supply, z_supply.
- Symbol: yes

### ip_q_design

- English: Emitter design flow, q<sub>design</sub>
- Plain: The emitter flow at its design pressure, the flow the manufacturer rates it for, q_design.
- Symbol: yes

### ip_x

- English: <span class="ec-help" title="0.5 for standard non-compensating emitters; near 0 for pressure-compensating emitters">Emitter discharge exponent, x <span class="ec-tip">?</span></span>
- Plain: The emitter discharge exponent, x, in q = k·H^x: it says how an emitter’s flow changes with pressure. It is 0.5 for ordinary emitters that do not compensate for pressure, and near 0 for pressure-compensating emitters.

### ip_is_lateral

- English: <span class="ec-help" title="Checked: this reach is a segment of the test lateral, from which individual emitters withdraw water. Cleared: this reach is a main, only passing flow along to laterals not on the test path.">Lat. <span class="ec-tip">?</span></span>
- Plain: Lat. abbreviates lateral. Checked: this reach is part of the test lateral, the one lateral chosen for study, the presumed worst one, from which the emitters take water. Cleared: this reach is part of the main, which only passes flow along to other laterals.

### ip_elev_ds

- English: <span class="ec-help" title="Downstream-end elevation of this reach. Optional on interior rows (defaults to flat / same as the node above if left blank). Required on the last row: that value is the last emitter’s elevation, which directly sets the required supply pressure.">DS Elev. <span class="ec-tip">?</span></span>
- Plain: DS Elev. abbreviates downstream elevation: the elevation or height at the downstream end of this reach, the end away from the supply. Optional on the rows in between, where a blank means flat, the same as the row above. Required on the last row, where it is the last emitter’s elevation, which sets the supply pressure needed.

### ip_press

- English: Press.
- Plain: Press. abbreviates pressure.

### ip_hf

- English: h<sub>f</sub>
- Plain: The friction head loss, h_f.
- Symbol: yes

### ip_hm

- English: h<sub>m</sub>
- Plain: The minor or local head loss, h_m, at fittings.
- Symbol: yes

### ip_hl

- English: <span class="ec-help" title="Total reach loss, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>
- Plain: The total head loss in this reach, h_L: the friction loss plus the minor loss.
- Symbol: yes

### ip_max_head

- English: Max. allow. pipe pressure
- Plain: Max. allow. abbreviates maximum allowable: the highest pressure the pipe is rated to carry.

### ip_q_supply

- English: <span class="ec-help" title="Flow entering the modeled test path only — for the whole zone/system, see Q_zone in Application Design below.">Test path supply flow, Q<sub>supply</sub> <span class="ec-tip">?</span></span>
- Plain: The supply flow into the test path, Q_supply: the flow entering the modeled test path only. The flow for the whole zone or system is Q_zone, in Application Design below.
- Symbol: yes

### ip_q_critical

- English: Last emitter flow, q<sub>last</sub>
- Plain: The flow from the last emitter, the one farthest from the supply, q_last.
- Symbol: yes

### ip_q_avg_lateral

- English: Average emitter flow (test lateral), q<sub>avg</sub>
- Plain: The average flow of the emitters on the test lateral, q_avg.
- Symbol: yes

### ip_q_avg_field

- English: <span class="ec-help" title="q_avg_lateral re-evaluated at each lateral row’s pressure plus the entered pressure difference above — an attempt to correct for the test lateral being the presumed worst case, not a representative one. Feeds both the uniformity check and the application-design section below.">Est. field-average emitter flow, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>
- Plain: Est. abbreviates estimated: the estimated average emitter flow over the whole field, q_avg,field. It is the test-lateral average recomputed with the pressure difference entered above, to correct for the test lateral being the presumed worst one rather than a typical one. The uniformity check and the application design below both use it.
- Symbol: yes

### ip_du_estimate

- English: <span class="ec-help" title="Last emitter’s computed flow divided by the estimated field-average emitter flow — this is an approximation of the standard low-quarter Distribution Uniformity (low-group average ÷ population mean); this is from a small modeled sample and a user-estimated correction instead of a full-field statistical sample. Values at or above 1 are possible and valid: they only mean the last emitter’s pressure is at or above the estimated field average, so some other emitter is the point of lowest pressure. This could be because the last emitter is on low ground or because the Δpressure estimate is too small.">Uniformity check, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>
- Plain: The uniformity check, q_last/q_avg,field: the last emitter’s flow divided by the estimated field-average emitter flow. It approximates the standard low-quarter distribution uniformity from a small modeled sample. A value of 1 or more is valid: it means some other emitter has the lowest pressure, because the last emitter is on low ground or the pressure difference entered is too small.
- Symbol: yes

### ip_notes_1_def

- English: Guesses the pressure at the last (most remote) emitter, then steps the Energy Grade Line back toward the supply, reach by reach, adding friction and minor losses along the way. Elevation and velocity head are subtracted at each node to report the actual pressure there. The guessed far-end pressure is adjusted (bisection) until the computed required supply pressure matches the entered supply pressure — the same closed-loop problem addressed by the pipe-flow solver on the Manning Pipe Flow calculator, extended to a branching network.
- Symbol: yes

### ip_notes_2_def

- English: Each row is one reach along the single hydraulically worst path (the test path) from the supply to the last emitter. A Main reach only passes flow to laterals not on the test path, so its withdrawal is a simple multiplication (design flow × the reach’s total emitter count) — no local pressure sensitivity. The main is a shared trunk pipe, so the reach of the main line that ends at the test lateral line must include not just laterals between its own endpoints but also any laterals still further down the main beyond that point, or sharing the same junction (e.g. an opposite-side lateral) — their flow travels through that same reach before splitting off, whether or not they appear anywhere else in this table. A Lateral reach is a segment of the test lateral itself: emitter discharge is computed from the actual local pressure via q = k·H<sup>x</sup>, and friction loss is reduced by Christiansen’s F(n) factor to account for flow decreasing as each emitter in the reach withdraws water.
- Symbol: yes

### ip_notes_3_def

- English: Models one fixed supply pressure (no pump curve), one test path only (not the full field), and a 2-parameter emitter curve (set the exponent near 0 to approximate a pressure-compensating emitter). Two different uniformity ratios are reported, deliberately kept separate: q<sub>last</sub>/q<sub>avg,field</sub> is an approximation of the standard low-quarter Distribution Uniformity (low-group average ÷ population mean); but this is from a small modeled sample and a user-estimated correction instead of the standard full-field statistical sample. Also, the test lateral is deliberately the presumed worst case, so its raw, uncorrected average would understate the true field average and make uniformity look better than it is; the Δpressure input exists specifically to counter that bias. Values for uniformity at or above 1 are still possible: they only mean that the last emitter’s pressure is at or above the estimated field average, so some other emitter is the point of lowest pressure. This could be because the last emitter is on low ground or because the Δpressure estimate is too small. q<sub>last</sub>/q<sub>design</sub> is a different, non-uniformity check against the manufacturer’s rated flow — useful for detecting an over- or under-pressured system overall, but it is a separate check to read alongside the uniformity number, since the design/rated flow is independent of the system’s actual mean operating pressure.
- Symbol: yes

### bpn_elev_down

- English: DS elev.
- Plain: DS elev. abbreviates downstream elevation: the ground or invert elevation at the downstream end of this pipe.
- Layout: column heading

### bpn_p_down

- English: DS press.
- Plain: DS press. abbreviates downstream pressure: the pressure at the node at the downstream end of this pipe.
- Layout: column heading

### lpn_tool_select

- English: Select
- Plain: Select mode, in which you pick or choose things on the map to work on, instead of adding new things.

### lpn_tool_zoom_extent

- English: Zoom to fit
- Plain: Zoom in or out until the whole network fits in the window, to see everything at once.

### lpn_new_text

- English: Text
- Plain: Text, Label, Temporary Text, Placeholder, Unfinished text, or Default words

### lpn_examples_open

- English: Open
- Plain: Open this example now.
- Layout: button

### lpn_help_fix

- English: Fix something
- Plain: Fix something: tell us about a mistake so that we can correct it.

### lpn_fb_intro

- English: Canned messages (optional). Nothing is sent until you press Send.
- Plain: Ready-made messages you can pick instead of typing; using them is optional. Nothing is sent until you press Send.

### lpn_units_length

- English: Length
- Plain: The unit for lengths: pipe lengths, tank diameters, and the like.

### lpn_geomap

- English: georeferenced
- Plain: georeferenced: placed on the world map.

### lpn_xymap

- English: local
- Plain: local: drawn in its own coordinates, arbitrary or schematic, not placed on the world map.

### lpn_color_link_field

- English: Color links by
- Plain: Color the links by the value chosen next, as in Color links by Velocity.

### lpn_pane_scn_alt_tip

- English: {category} alt.: {alternative}
- Plain: alt. abbreviates alternative: the scenario alternative in this category that holds this value. Abbreviate it the way your language abbreviates that word.

### lpn_goto_on_map

- English: Go to on map
- Plain: Show this on the map: move and zoom the map to bring it into view.

### lpn_menu_help

- English: Help
- Plain: Help, guidance, or assistance.
- Layout: nav item

### lpn_help_walkthroughs

- English: Walkthroughs
- Plain: Walkthroughs: guided tours, step by step, through a task.

### lpn_profile_title

- English: Profile along a path
- Plain: A profile or cross section along a path through the network: a side view of the elevations and heads along it.

### lpn_file_revert

- English: Revert
- Plain: Throw away my changes and go back to the saved version of the file.

### lpn_tab_duplicate

- English: Duplicate
- Plain: Make a copy of this project in a new tab.

### lpn_lock_break

- English: Break lock
- Plain: Break their lock: take over the file that somebody else has open, so that you can edit it.
- Layout: button

### lpn_valve_type_tcv

- English: Throttle (TCV)
- Plain: Throttle valve, TCV: a valve partly closed to cause a set loss.

### lpn_valve_type_prv

- English: Pressure reducing (PRV)
- Plain: Pressure reducing valve, PRV: a valve that lowers the pressure downstream to a set value.

### lpn_valve_type_psv

- English: Pressure sustaining (PSV)
- Plain: Pressure sustaining valve, PSV: a valve that keeps the pressure upstream at or above a set value.

### lpn_valve_type_fcv

- English: Flow control (FCV)
- Plain: Flow control valve, FCV: a valve that limits the flow to a set value.

### lpn_field_meter_count

- English: Number of services
- Plain: The number or count of services, the meters, at this customer point.

### lpn_field_northing_abbr

- English: N
- Plain: N abbreviates Northing, the distance north on the map. Use your language’s shortest form of Northing, or the full word where it has none.

### lpn_field_easting_abbr

- English: E
- Plain: E abbreviates Easting, the distance east on the map. Use your language’s shortest form of Easting, or the full word where it has none.

### lpn_labels_col_before

- English: Bef.
- Plain: Bef. abbreviates before: text placed before the value in a label, a prefix.

### lpn_labels_col_after

- English: Aft.
- Plain: Aft. abbreviates after: text placed after the value in a label, a suffix.

### lpn_backdrop_scale_entry_prompt

- English: Enter the size of one pixel on the map, or paste the complete contents of the world file for the image
- Runtime: units appended

### lpn_settings_defaults

- English: Values
- Plain: Values: the values a new asset gets when it is created.

### lpn_cp_restrict

- English: Restrict these characters
- Plain: Forbid these characters: the characters listed here are not allowed. The other choice is Allow only these characters.

### lpn_cp_restrict_tip

- English: Restrict these characters:
- Plain: Forbid these characters: the characters listed here are not allowed. The other choice is Allow only these characters.

### lpn_scenario_base

- English: Base
- Plain: Base: the base scenario, the baseline the other scenarios start from and change.

### lpn_settings_viscosity

- English: Relative viscosity
- Plain: Relative viscosity: how thick the fluid is compared with water at 20 °C. It changes the friction factor under Darcy-Weisbach and nothing else.

### lpn_settings_legend_position

- English: Labels legend position
- Plain: Where on the map the labels legend sits: the box that explains the node and link labels.

### lpn_time_run

- English: Calculate
- Plain: Calculate: solve this network at every time step of the run.

### lpn_reaction_limiting

- English: Limiting concentration
- Plain: Limiting concentration: the concentration a growth or decay reaction approaches and does not pass.

### lpn_reaction_rough_corr

- English: Roughness correlation
- Plain: Roughness correlation: the factor that links each pipe’s wall reaction rate to its roughness.

### lpn_reports_epanet

- English: Run
- Plain: Run: the report of the simulation run.

### lpn_color_mode_pretty

- English: Pretty (rounded)
- Plain: Pretty (rounded): legend breaks at equal intervals, rounded to tidy numbers.

### lpn_library_patterns

- English: Patterns
- Plain: Patterns: time patterns, the series of multipliers that make a demand or other value change over the hours of a run.

### lpn_fitting_entrance

- English: Square entrance
- Plain: Square entrance: a pipe entrance with sharp, square edges.

### lpn_help_icons

- English: Toolbar
- Plain: Toolbar: what each toolbar icon means.

### lpn_settings_sym_all

- English: All
- Plain: All: settings for all labels.
- Layout: sub-heading

### lpn_labels_priority_node_tip

- English: The order in which values are dropped when a label does not fit. The value numbered 1 is dropped first. When only one value is left and two labels still overlap, one of them is hidden: the one with the lower demand, with pressure nearer the middle of the range, or with elevation or head more like its neighboring nodes.
- Plain: The order in which values are left out when a label does not fit. Value number 1 is left out first. When one value is left and two labels still overlap, one label is hidden: the one with the lower demand, with the pressure nearer the middle of the range, or with the elevation or head numerically closer to its neighboring nodes’ values.

### lpn_find_op_gt

- English: above
- Plain: above: greater than or more than.

### lpn_find_op_lt

- English: below
- Plain: below: less than.

### lpn_ff_all

- English: All junctions
- Plain: All junctions: every junction is tested. A choice in the Junctions to test list.

### lpn_ff_selected

- English: Selected junctions
- Plain: Selected junctions: only the junctions you selected are tested. A choice in the Junctions to test list.

### lpn_ds_head_search_selected

- English: What demand scale can these junctions handle?
- Plain: What demand scale can these junctions handle: how far can the demand at the chosen junctions be multiplied?

### lpn_ff_design_off

- English: None
- Plain: None: no design check. A choice in the Design check list.

### lpn_ff_design_all

- English: All
- Plain: All: check all other junctions and all pipes. A choice in the Design check list, so All means junctions and pipes together.

### lpn_ff_design_selected

- English: Selected
- Plain: Selected: check the selected junctions and their pipes. A choice in the Design check list.

### lpn_snip_tip_mode

- English: Snip shape
- Plain: Snip shape: the shape of the area to capture in a screenshot.

### lpn_morph_menu

- English: Morph
- Plain: Morph: change the type of an asset (a node into a junction, reservoir or tank; a link into a pipe, pump or valve) while it keeps its ID, location and connections. Another word for it is Transform.

### lpn_export_table_current

- English: Current
- Plain: Current: the table or scenario now selected, as opposed to All. It never means a flow of water or electricity.
