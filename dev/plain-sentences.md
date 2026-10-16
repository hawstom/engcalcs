# Plain sentences

Help for translators with one string at a time, where the English of that one string is hard to carry into another language. A concept that recurs across many strings belongs in `dev/terms.md` instead. Tom edits this file directly; `generate_translation_payloads.php` reads it into every translator packet.

## How an entry is written

- The heading is the string's key. The English line is the string as it stands today; `php dev/scripts/plain_sentences.php --write` keeps it current, and a check fails when it is stale.
- **Plain** says what the string means, in plain words. Synonyms stand side by side, joined by "or", with no parentheses. A comma before "or" only in a list of three or more.
- **Layout** says where the string sits on the page: column heading, unit token, nav item, button, or sub-heading. The full instruction a translator receives for each is in the table in `dev/language-strings.md`.
- **Symbol: yes** marks a string holding a variable symbol, kept exactly as in English.
- **Runtime: units appended** marks a string the page adds a unit to.
- **Note** is anything else a translator needs about this one string.
- Suggestions only, no prohibitions.

## Entries

### menu_libre

- English: Libre Software
- Plain: Lock-free Software, Unlocked Software, Unchained Software, Liberated Software, Liberty Software, Freedom Software, FLOSS meaning Free Libre Open Source Software, or Software you are free to use, study, change, and share.
- Layout: nav item

### template_welcome

- English: Drop your fears at the door; love is spoken here. You are not ruining everything. Enjoy the <a target="_blank" href="https://hawsedc.com/download.php">free libre HawsEDC AutoCAD tools</a> too.
- Plain: Leave your fears behind when you enter this space; love is the language we speak here. You are not ruining everything.

### consent_body

- English: May we save a random code in this browser so that we can count how many browsers use each part of this site? The code is made up on the spot, says nothing about you or your device, and records nothing you enter. Without it we cannot tell your second visit from somebody else's first.
- Plain: May we save, store, keep, or put a random code, a string of letters and digits chosen by chance, in this browser so that we can count or tally how many browsers use each part of this site? The code is made up on the spot, created at that moment, says nothing about you or your device, and records nothing you enter. Without it we cannot tell your second visit from somebody else's first.

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
- Plain: You allowed this. A random browser code is tracked to minimize duplicate use counts.

### consent_current_denied

- English: You refused this. We store nothing to limit logging for this browser profile.
- Plain: You refused, declined, or denied this. We store, keep, or save nothing to limit logging or recording for this browser profile.

### consent_region_label

- English: Your choice about the counting code.
- Plain: Your choice about the random browser code tracking.

### calc_set_units_tip

- English: Sets the unit of every field at once. Non-destructive: the numbers you entered stay exactly as they are, and each one is now read in the new unit. A 6 stays a 6, but it now means 6 inches instead of 6 millimetres.
- Plain: Changes the unit shown on every field at once, switching the whole page to that unit system. Does not change the input data.

### calc_defaults

- English: Restore defaults
- Plain: Restore, revert, or return to the original, initial, as-shipped, or factory values or state.

### ec_name_label

- English: Save this calculation:
- Plain: Save these inputs or values

### dw_friction_factor_method

- English: Friction factor method
- Plain: Method used to compute friction factor from roughness

### mi_q_617

- English: <span class="ec-help" title="The composite flow, Q, using a composite n for each region according to Chow 6-17, equal velocities">Q <span class="ec-tip">?</span></span>
- Plain: The composite flow, Q, using a composite n for each region according to Chow 6-17, equal velocities

### mi_station

- English: Sta
- Plain: Station, chainage, or distance along the alignment of this point. "Distance" is an acceptable alias where the surveying sense of "station" has no natural short word.
- Layout: column heading

### mi_elevation

- English: Elevation
- Layout: column heading
- Symbol: yes

### mi_is_bank

- English: R<sub>h</sub>, Q region boundary (Bank)
- Plain: Boundary, divider, edge, break, or bank as in HEC-RAS, between adjacent regions of differing flow, hydraulic radius, and composite n.
- Layout: column heading

### mi_tau

- English: Bottom shear τ
- Layout: column heading
- Symbol: yes

### mi_t

- English: T
- Layout: column heading
- Symbol: yes

### mi_pw

- English: P<sub>w</sub>
- Layout: column heading
- Symbol: yes

### mi_a

- English: A
- Layout: column heading
- Symbol: yes

### mi_rh

- English: R<sub>h</sub>
- Layout: column heading
- Symbol: yes

### mi_n617

- English: Comp.<br />n
- Plain: composite n for the region, by Chow 6-17
- Layout: column heading
- Symbol: yes

### mi_v617

- English: v
- Layout: column heading
- Symbol: yes

### mi_fr617

- English: Fr
- Layout: column heading
- Symbol: yes

### mi_hv617

- English: h<sub>v</sub>
- Layout: column heading
- Symbol: yes

### mi_q617

- English: Q
- Plain: The composite flow, Q, using composite n for each region according to Chow 6-17, equal velocities
- Layout: column heading

### mi_notes_1_term

- English: Composite n
- Plain: The n for each region according to Chow 6-17, equal velocities

### mpf_shear_stress

- English: Average shear stress, τ
- Symbol: yes

### mtc_n_strickler

- English: n from design rock size (Strickler method)
- Plain: Manning’s n from the design rock size, by the Strickler method
- Symbol: yes
- Note: The bare lower-case n is Manning’s roughness coefficient, a symbol.

### mtc_blodgett_v_bathurst

- English: Blodgett vs. Bathurst
- Plain: which of the two roughness methods applies at this relative submergence

### mtc_note_1

- English: <dl><dt>Automated rock size and roughness design iteration</dt><dd>Choose a roughness option (Blodgett–Bathurst recommended) and a design rock size option (Isbash recommended). Adjust depth and rock size safety factor to reach your target flow with a uniform rock size. Each time you change an input, the calculator repeats these steps: 1. Roughness is calculated from design rock size. 2. The roughness value from the method you chose is copied into the roughness input. 3. Channel flow and required rock size are calculated. 4. Design rock size is adjusted. 5. Repeat until error in the design rock size is very small.</dd><dt>Basic calculator (no iteration)</dt><dd>Enter your desired roughness value. Ignore the design rock size input area.</dd></dl>
- Note: Spell Blodgett–Bathurst out in full, as in the Blodgett vs. Bathurst label. Nothing in this text says what initials would stand for.

### ws_main_menu

- English: Weir Flow Simple
- Plain: Simple weir flow calculator, for a weir with a level, uniform, single-elevation crest.
- Note: Simple names this simpler version of the calculator. Use your language’s natural word order.

### wi_notes_we_def

- English: q = if (length = 0) then 0 else if (slope=0) then cw*length*d<sub>0</sub><sup>1.5</sup> else cw/(2.5*slope) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) where d<sub>1</sub> and d<sub>0</sub> are always positive or zero
- Plain: Weir equation written in if/then/else pseudocode.
- Symbol: yes
- Note: The words if, then, else, and where may be translated; the structure and the symbols stay as in English.

### mhp_main_menu

- English: Microhydropower
- Plain: Microhydropower electricity generation

### mhp_main_title

- English: Free Online Micro-Hydro Power Calculator
- Plain: Microhydropower electricity generation

### mhp_annual_kwh

- English: P as annual energy
- Plain: Energy produced in a year if the plant ran at full output every hour, all 8760 hours: an upper bound, before any capacity factor.

### mhp_vel_ok_short

- English: OK
- Plain: the velocity is high, low, or acceptable

### mhp_vel_high_short

- English: High
- Plain: velocity is high

### mhp_vel_low_short

- English: Low
- Plain: velocity is low

### odt_sketch_start

- English: Start
- Plain: the starting water surface level

### odt_sketch_end

- English: End
- Plain: the ending water surface level

### ip_t_run

- English: Runtime (hours)
- Plain: Time, duration, or length of time of the run, flow, or operation required for the zone to apply the target depth.

### cs_water_value

- English: Water value
- Plain: Monetary value, price, or worth of water per unit volume.
- Note: Currency is deliberately unspecified: any local currency works if used consistently with lining cost.

### cs_lining_cost

- English: Lining cost
- Plain: Cost or price of canal lining per unit area.
- Note: Currency is deliberately unspecified: any local currency works if used consistently with water value.

### rc_yn

- English: <span class="ec-help" title="Ponding (Hp > yn) is desirable because it reduces upstream erosion. (USDA)">Normal depth in inlet channel, y<sub>n</sub> <span class="ec-tip">?</span></span>
- Plain: Enter the normal depth in the channel that delivers flow to this chute.
- Note: Ponding reduces erosion upstream of the chute inlet: above it, toward the source of the water.

### rc_apron_length

- English: <span class="ec-help" title="Required for structural support of the rock lining. “The minimum tailwater that occurs as a result of the outlet reach and downstream channel resistance is sufficient to ensure stability of the riprap in the outlet reach.” (Robinson)">Outlet apron length (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>
- Plain: This is the length of the horizontal or flat reach of rock that is required by Robinson to be placed downstream or below the chute to act as an outlet and thus to support the rock on the slope of the chute. Outlet toe support reach length.
- Note: An apron is the flat protective pad of rock at the chute outlet, a hydraulic-structures term of the platea or radier family.

### rc_sketch_filter

- English: Filter
- Plain: the filter or bedding layer beneath the rock lining

### ip_main_menu

- English: Irrigation Pressure
- Plain: Pressure in a pressurized irrigation system, a drip or sprinkler pipe network.

### ip_main_title

- English: Free Online Irrigation Pressure & Distribution Uniformity Calculator
- Plain: Pressure in a pressurized drip or sprinkler irrigation network. Uniformity means evenness of water application among emitters, an irrigation-engineering statistic.

### ip_main_desc

- English: Test Branch Pressure and Estimated Uniformity
- Plain: Pressure in a branch of study and estimate of distribution uniformity.

### ip_elev_supply

- English: Supply elevation, z<sub>supply</sub>
- Symbol: yes

### ip_q_design

- English: Emitter design flow, q<sub>design</sub>
- Plain: Design flow is the manufacturer-rated emitter flow.
- Symbol: yes

### ip_x

- English: <span class="ec-help" title="0.5 for standard non-compensating emitters; near 0 for pressure-compensating emitters">Emitter discharge exponent, x <span class="ec-tip">?</span></span>
- Plain: Discharge exponent: the exponent x in q = k*H^x describing emitter hydraulic behavior.

### ip_is_lateral

- English: <span class="ec-help" title="Checked: this reach is a segment of the test lateral, from which individual emitters withdraw water. Cleared: this reach is a main, only passing flow along to laterals not on the test path.">Lat. <span class="ec-tip">?</span></span>
- Note: The test lateral is the one lateral chosen for study, the presumed worst one.

### ip_elev_ds

- English: <span class="ec-help" title="Downstream-end elevation of this reach. Optional on interior rows (defaults to flat / same as the node above if left blank). Required on the last row: that value is the last emitter’s elevation, which directly sets the required supply pressure.">DS Elev. <span class="ec-tip">?</span></span>
- Plain: DS abbreviates downstream. Choose an abbreviation that is unambiguously downstream and cannot be confused with upstream.

### ip_press

- English: Press.
- Plain: Pressure

### ip_hf

- English: h<sub>f</sub>
- Plain: Friction head loss.
- Symbol: yes

### ip_hm

- English: h<sub>m</sub>
- Plain: Minor or local head loss.
- Symbol: yes

### ip_hl

- English: <span class="ec-help" title="Total reach loss, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>
- Plain: Total reach head loss.
- Symbol: yes

### ip_max_head

- English: Max. allow. pipe pressure
- Plain: maximum allowable pipe pressure

### ip_q_supply

- English: <span class="ec-help" title="Flow entering the modeled test path only — for the whole zone/system, see Q_zone in Application Design below.">Test path supply flow, Q<sub>supply</sub> <span class="ec-tip">?</span></span>
- Symbol: yes

### ip_q_critical

- English: Last emitter flow, q<sub>last</sub>
- Symbol: yes

### ip_q_avg_lateral

- English: Average emitter flow (test lateral), q<sub>avg</sub>
- Symbol: yes

### ip_q_avg_field

- English: <span class="ec-help" title="q_avg_lateral re-evaluated at each lateral row’s pressure plus the entered pressure difference above — an attempt to correct for the test lateral being the presumed worst case, not a representative one. Feeds both the uniformity check and the application-design section below.">Est. field-average emitter flow, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>
- Symbol: yes

### ip_du_estimate

- English: <span class="ec-help" title="Last emitter’s computed flow divided by the estimated field-average emitter flow — this is an approximation of the standard low-quarter Distribution Uniformity (low-group average ÷ population mean); this is from a small modeled sample and a user-estimated correction instead of a full-field statistical sample. Values at or above 1 are possible and valid: they only mean the last emitter’s pressure is at or above the estimated field average, so some other emitter is the point of lowest pressure. This could be because the last emitter is on low ground or because the Δpressure estimate is too small.">Uniformity check, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>
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
- Plain: Downstream or DS elevation: the ground or invert elevation at this pipe line’s downstream end
- Layout: column heading

### bpn_p_down

- English: DS press.
- Plain: Downstream or DS pressure: the gauge pressure head at this pipe line’s downstream node
- Layout: column heading

### lpn_tool_select

- English: Select
- Plain: Select mode: the mode or state in which you pick, select, choose, point at, indicate, or signal things to act on, rather than add things.

### lpn_tool_zoom_extent

- English: Zoom to fit
- Plain: Zoom out or in until the whole drawing fits in the window; show everything at once: zoom to extents, fit to window, or show all.

### lpn_new_text

- English: Text
- Plain: Text, Label, Temporary Text, Placeholder, Unfinished text, or Default words

### lpn_examples_open

- English: Open
- Plain: Open, Open this example, Load, Load this example, or Start with this one
- Layout: button
- Note: A command: open this example now.

### lpn_help_fix

- English: Fix something
- Plain: Fix something, Report a mistake, Tell us what is wrong, Send a correction, or Suggest a fix

### lpn_fb_intro

- English: Canned messages (optional). Nothing is sent until you press Send.
- Plain: Ready-made messages; preset choices the visitor can pick instead of typing

### lpn_units_length

- English: Length
- Plain: Pipe lengths, tank diameters, and the like

### lpn_geomap

- English: georeferenced
- Plain: coordinate system referenced to the world map

### lpn_xymap

- English: local
- Plain: local, arbitrary, or schematic coordinate system

### lpn_color_link_field

- English: Color links by
- Plain: Color links by, Color the links to show, Colors show these values, Link color shows, or Value that color shows
- Note: The pull-down that follows completes the phrase, as in Color links by Velocity.

### lpn_pane_scn_alt_tip

- English: {category} alt.: {alternative}
- Plain: alt. abbreviates alternative, the scenario alternative that holds this override; abbreviate it the way your language abbreviates that word

### lpn_goto_on_map

- English: Go to on map
- Plain: Bring this into view on the map, Zoom to this on the map, or Show this on the map

### lpn_menu_help

- English: Help
- Plain: Help, Guidance, Assistance, Support, or Information
- Layout: nav item

### lpn_help_walkthroughs

- English: Walkthroughs
- Plain: Walkthroughs, Guided tours, Step-by-step guides, Worked examples, or Tutorials

### lpn_profile_title

- English: Profile along a path
- Plain: Profile or cross section along a path, route, or way

### lpn_file_revert

- English: Revert
- Plain: Throw away or discard my changes by reloading the saved version: undo all changes, or go back to the saved file.

### lpn_tab_duplicate

- English: Duplicate
- Plain: Duplicate, copy, or make a copy of this.

### lpn_lock_break

- English: Break lock
- Plain: Break their lock, unlock the file, take over the file, release their hold on it, claim the file, or override their claim
- Layout: button

### lpn_valve_type_tcv

- English: Throttle (TCV)
- Plain: Throttle valve TCV, throttling valve, or fixed-loss valve

### lpn_valve_type_prv

- English: Pressure reducing (PRV)
- Plain: Pressure reducing valve PRV, or pressure-lowering valve

### lpn_valve_type_psv

- English: Pressure sustaining (PSV)
- Plain: Pressure sustaining valve PSV, pressure-supporting valve, or pressure-maintaining valve

### lpn_valve_type_fcv

- English: Flow control (FCV)
- Plain: Flow control valve FCV, flow-limiting valve, or maximum-flow valve

### lpn_field_tag

- English: Tag
- Plain: Tag, Custom property, User property, or Custom label
- Note: EPANET’s own [TAGS] value: one unspaced token of the user’s own meaning, often a pressure zone or a work order.

### lpn_field_meter_count

- English: Number of services
- Plain: Number or count of services at this customer point

### lpn_field_northing_abbr

- English: N
- Plain: Northing
- Note: An abbreviation of Northing, as short as your language has a short form for; the full word where it has none.

### lpn_field_easting_abbr

- English: E
- Plain: Easting
- Note: An abbreviation of Easting, as short as your language has a short form for; the full word where it has none.

### lpn_labels_col_before

- English: Bef.
- Plain: Before, In front, In front of the value, Prefix, or Leading text

### lpn_labels_col_after

- English: Aft.
- Plain: After, Suffix, Trailing text, or Postfix

### lpn_backdrop_scale_entry_prompt

- English: Enter the size of one pixel on the map, or paste the complete contents of the world file for the image
- Runtime: units appended

### lpn_settings_defaults

- English: Values
- Plain: Values, Values for new assets, Values given to new assets, or Values used when an asset is created

### lpn_cp_restrict

- English: Restrict these characters
- Plain: Forbid these characters; the opposite of Allow only these characters

### lpn_cp_restrict_tip

- English: Restrict these characters:
- Plain: Forbid these characters; the opposite of Allow only these characters

### lpn_scenario_base

- English: Base
- Plain: Base case, Baseline, Canonical, Source, Root, or Trunk

### lpn_scenario_push_values

- English: Values discarded:
- Plain: Values thrown away, Values discarded, Values lost, Values wiped, Values replaced, Values displaced, Values cleared, or Custom values cleared
- Note: A count follows this label, not a list of values.

### lpn_settings_viscosity

- English: Relative viscosity
- Plain: Relative thickness of the fluid, or fluid viscosity compared with water
- Note: How thick the fluid is compared with water at 20 °C. It changes the friction factor under Darcy-Weisbach and nothing else.

### lpn_settings_map_display

- English: Appearance
- Plain: How the map looks, its appearance, style, or the way it is drawn: sizes, opacity, and position.

### lpn_settings_legend_position

- English: Labels legend position
- Plain: The position on the map of the legend, key table, or map key: the box explaining the symbols for node and link labels.

### lpn_time_run

- English: Calculate
- Plain: Simulate, calculate, execute, or compute

### lpn_reaction_limiting

- English: Limiting concentration
- Plain: Concentration ceiling, Saturation concentration, or Maximum attainable concentration

### lpn_reaction_rough_corr

- English: Roughness correlation
- Plain: Wall reaction from roughness, or Roughness-linked wall reaction

### lpn_reports_epanet

- English: Run
- Plain: Run, simulation, computation, or calculation report

### lpn_color_mode_pretty

- English: Pretty (rounded)
- Plain: Equal intervals rounded for a pretty legend, or Pretty legend with rounded equal intervals

### lpn_library_patterns

- English: Patterns
- Plain: Data series, Sequence, Time series, Progression, Schedule, or Variation profile

### lpn_fitting_entrance

- English: Square entrance
- Plain: Sharp-edged entrance, Sharp-angled entrance, or Square-edged entrance

### lpn_help_icons

- English: Toolbar
- Plain: Toolbar legend, Key to the toolbar icons, What each toolbar icon means, Toolbar help, or Toolbar

### lpn_settings_sym_all

- English: All
- Plain: For all labels
- Layout: sub-heading

### lpn_scenario_push_tip

- English: Every scenario goes back to the Base value for the properties whose labels are showing right now. Values entered for them in any scenario are discarded.
- Plain: Labels here are the map labels set in Settings, Symbology, Labels.

### lpn_labels_priority_node_tip

- English: The order in which values are dropped when a label does not fit. The value numbered 1 is dropped first. When only one value is left and two labels still overlap, one of them is hidden: the one with the lower demand, with pressure nearer the middle of the range, or with elevation or head more like its neighboring nodes.
- Plain: More like neighboring nodes means numerically closer to the neighbors’ values.

### lpn_find_op_gt

- English: above
- Plain: greater than, more than, or exceeding

### lpn_find_op_lt

- English: below
- Plain: less than

### lpn_ff_all

- English: All junctions
- Plain: All junctions
- Note: A pull-down option under Junctions to test; agrees with junctions, plural.

### lpn_ff_selected

- English: Selected junctions
- Plain: Selected junctions
- Note: A pull-down option under Junctions to test; agrees with junctions, plural.

### lpn_ds_head_search_selected

- English: What demand scale can these junctions handle?
- Plain: What demand can the junctions you choose handle

### lpn_ff_design_off

- English: None
- Plain: No design check
- Note: A pull-down option under Design check, effect on system.

### lpn_ff_design_all

- English: All
- Plain: All other junctions and all pipes
- Note: A pull-down option under Design check, effect on system; agrees with pipes and junctions together, plural.

### lpn_ff_design_selected

- English: Selected
- Plain: The selected junctions and their pipes
- Note: A pull-down option under Design check, effect on system; agrees with pipes and junctions together, plural.

### lpn_snip_tip_mode

- English: Snip shape
- Plain: Shape to specify for screenshot
