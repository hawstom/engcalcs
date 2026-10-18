<?php

// All missing text declarations will fall back to English.

// Units (alphabetical order)
// Necessary for calculator units selectors
$ec_lang = [];
$ec_lang['u_depthFrac']='fraction';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/sec';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% rise/run';
$ec_lang['u_grade']='rise/run';
$ec_lang['u_in2']='sq. in.';
$ec_lang['u_inh2o']='in H2O';
$ec_lang['u_in']='in';
$ec_lang['u_knpcm2']='kN/cm^2';
$ec_lang['u_knpm2']='kN/m^2';
$ec_lang['u_kpa']='kPa';
$ec_lang['u_lps']='L/s';
$ec_lang['u_m2']='m^2';
$ec_lang['u_m3ps']='m^3/s';
$ec_lang['u_mgd']='MGD';
$ec_lang['u_imgd']='IMGD';
$ec_lang['u_afd']='ac-ft/d';
$ec_lang['u_lpm']='L/min';
$ec_lang['u_cmh']='m^3/h';
$ec_lang['u_cmd']='m^3/d';
$ec_lang['u_mh2o']='m H2O';
$ec_lang['u_mld']='ML/d';
$ec_lang['u_m']='m';
$ec_lang['u_mm2']='mm^2';
$ec_lang['u_mmh2o']='mm H2O';
$ec_lang['u_mm']='mm';
$ec_lang['u_mps']='m/s';
$ec_lang['u_npm2']='N/m^2';
$ec_lang['u_pa']='Pa';
$ec_lang['u_psf']='psf';
$ec_lang['u_psi']='psi';
$ec_lang['u_bar']='bar';
$ec_lang['u_kgfcm2']='kgf/cm^2';
$ec_lang['u_s']='sec';
$ec_lang['u_hr']='hr';
$ec_lang['u_day']='day';
$ec_lang['u_lph']='L/hr';
$ec_lang['u_gph']='gal/hr';
$ec_lang['u_mmph']='mm/hr';
$ec_lang['u_inph']='in/hr';
$ec_lang['u_acft']='ac-ft';
$ec_lang['u_ft3']='ft^3';
$ec_lang['u_m3']='m^3';
$ec_lang['u_kw']='kW';
$ec_lang['u_mw']='MW';
$ec_lang['u_kwh_yr']='kWh/yr';
$ec_lang['u_mwh_yr']='MWh/yr';
$ec_lang['u_hp']='hp';
$ec_lang['u_m2ps']='m^2/s';
$ec_lang['u_ft2ps']='cfs/ft';

// Page text
// In page order for easiest maintenance.
// Menu and General
$ec_lang['menu_brand']='HawsEDC Calculators';
$ec_lang['menu_main_hydraulics']='Hydraulics';
$ec_lang['menu_help']='Help';
$ec_lang['menu_libre']='Libre Software';
$ec_lang['template_welcome']='Drop your fears at the door; love is spoken here. You are not ruining everything. Enjoy the <a target="_blank" href="https://hawsedc.com/download.php">free libre HawsEDC AutoCAD tools</a> too.';
$ec_lang['template_feedback']='Can you suggest better wording or anything else? Do you want to help or to learn to create tools like these? Please contact me.';
$ec_lang['template_printable_title']='Printable Title';
$ec_lang['template_printable_subtitle']='Printable Subtitle';
// Consent banner and the two site documents behind it (ROADMAP Task 286). These are UI, not legal
// prose, and they are translated into all 26 languages for one reason: consent that the visitor
// cannot read is not consent. The long-form privacy notice and terms are a separate question --
// English-authoritative, and translated by a human later if at all.
// Edited by TGH 2026-09-07; the word "cookie" approved by TGH 2026-09-09.
// **REWRITTEN 2026-10-08 (Tom, call F01: "Go (random code, new consent text)")**, his draft used
// exactly. The yes now also covers a random browser code (EC_CODE_COOKIE in lib/config.inc.php), so
// "a one-digit cookie" was no longer the whole of what is asked for. The code is what the sentence
// names because it is what the yes newly buys: counting browsers, not only page loads.
//
// EC_CONSENT_VERSION WENT FROM 1 TO 2 WITH IT, because what is stored changed. Everybody who chose
// "Allow this" is asked again; "Allow all" and "Refuse all" are not. The other 26 languages keep
// their old sentence until the next translation sprint, under the same version.
$ec_lang['consent_body']='May we save a random code in this browser so that we can count how many browsers use each part of this site? The code is made up on the spot, says nothing about you or your device, and records nothing you enter. Without it we cannot tell your second visit from somebody else\'s first.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Solve this network at every hydraulic time step.';
$ec_lang['consent_accept']='Allow this';
$ec_lang['consent_accept_all']='Allow all';
$ec_lang['consent_decline']='Refuse all';
$ec_lang['consent_current_granted']='You allowed this. This browser keeps a random code so that we can count it.';
$ec_lang['consent_current_denied']='You refused this. We store nothing to limit logging for this browser profile.';
$ec_lang['consent_region_label']='Your choice about the counting code.';
$ec_lang['consent_settings_link']='Cookie settings';
$ec_lang['privacy_link']='Privacy notice';
$ec_lang['terms_link']='Terms of use';
$ec_lang['index_main_title']='Free Online Engineering Calculators';
$ec_lang['index_meta_desc_plain']='Free hydraulic engineering calculators for pipes, channels, weirs and irrigation. They run in your browser, work offline, and are available in 27 languages.';
$ec_lang['calc_set_units']='Set units:';
$ec_lang['calc_set_units_tip']='Sets the unit of every field at once. Non-destructive: the numbers you entered stay exactly as they are, and each one is now read in the new unit. A 6 stays a 6, but it now means 6 inches instead of 6 millimetres.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Restore defaults';
$ec_lang['calc_defaults_confirm']='Reset calculator to the original default values?';
$ec_lang['points_data_note']='(or copy/paste using the data area)';
$ec_lang['points_data_heading']='Calculator data<br />(use Copy to see format)';
$ec_lang['points_data_points_heading']='Points data<br />(use Copy to see format)';
$ec_lang['points_data_copy']='Copy';
$ec_lang['points_data_paste']='Paste';
$ec_lang['points_data_msg_line']='Nothing was pasted. Line {n} could not be read as a station and an elevation.';
$ec_lang['points_data_msg_none']='Nothing was pasted. No station and elevation pairs were found.';
$ec_lang['calc_inputs']='Inputs';
$ec_lang['calc_results']='Results';
$ec_lang['view_hide_line']='Hide this line';
$ec_lang['view_printable']='Printable version (reload the page to return to the normal view)';
$ec_lang['ec_name_label']='Save this calculation:';
$ec_lang['ec_name_placeholder']='Name';
$ec_lang['ec_name_tip']='Saves these inputs to the URL for bookmarking, history retrieval, and sharing';
$ec_lang['calc_copy_link']='Copy link';
$ec_lang['ec_related_calcs']='Related calculators:';
$ec_lang['calc_copy_link_done']='Copied!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Darcy-Weisbach Pipe Head Loss';
$ec_lang['dw_main_title']='Free Online Darcy-Weisbach Pipe Head Loss Calculator';
$ec_lang['dw_main_desc']='Darcy-Weisbach Pipe Head Loss at Given Diameter, Roughness, and Flow';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Absolute roughness height, e, of the pipe wall. Typical values: steel (new) 0.046 mm, steel (used) 0.15 mm, HDPE 0.003 mm, PVC/uPVC 0.0015 mm, concrete 0.3–3 mm.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s for clean water at 20°C">Kinematic viscosity, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Kinematic viscosity, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s for clean water at 20°C';
$ec_lang['dw_reynolds_number']='Reynolds number, Re';
$ec_lang['dw_flow_regime']='Flow regime';
$ec_lang['dw_regime_laminar']='laminar';
$ec_lang['dw_regime_transitional']='transitional';
$ec_lang['dw_regime_turbulent']='turbulent';
$ec_lang['dw_friction_factor_method']='Friction factor method';
$ec_lang['dw_friction_factor']='Friction factor, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Hazen-Williams Pipe Head Loss';
$ec_lang['hw_main_title']='Free Online Hazen-Williams Pipe Head Loss Calculator';
$ec_lang['hw_main_desc']='Hazen-Williams Pipe Head Loss at Given Diameter, Roughness, and Flow';
$ec_lang['hw_hgl_1']='Downstream HGL';
$ec_lang['hw_hgl_2']='Upstream HGL';
$ec_lang['hw_elev_up']='Upstream elevation';
$ec_lang['hw_pressure_up']='Upstream pressure';
$ec_lang['hw_elev_down']='Downstream elevation';
$ec_lang['hw_pressure_down']='Downstream pressure';
$ec_lang['hw_pressure_check']='Pressure check';
$ec_lang['hw_pressure_ok_short']='Positive pressure';
$ec_lang['hw_pressure_neg_short']='Negative pressure';
$ec_lang['hw_pressure_neg']='Downstream pressure is below zero. The hydraulic grade line falls below the pipe, so the pipe would not flow full and this result may not be valid.';
$ec_lang['hw_roughness']='Hazen-Williams coefficient, C';
$ec_lang['hw_note_1']='<dl><dt>This calculator does not model the pipe profile between the two ends.</dt><dd>It uses only the upstream and downstream elevations you enter. If the ground rises higher than either end somewhere in between, the pressure at that high point is lower than any pressure reported here. Run the calculator again for the length from the upstream end to the high point to check it.</dd><dd>Where the hydraulic grade line falls below the pipe, the water is under negative pressure. Air comes out of solution, a thin-walled pipe can collapse, and dirty groundwater can be drawn in through the joints. Keep the line under positive pressure everywhere, and consider an air valve at each high point.</dd><dt>The upstream pressure is a boundary condition you supply.</dt><dd>Read it from a gauge, from a tank water level (the height of water above the pipe), or from a pump curve. A pump delivers less pressure as flow rises, so use the point on the curve that matches the flow entered above.</dd><dt>Add up the minor (local) loss coefficients yourself.</dt><dd>Total the K values for every valve, bend, tee, meter, and entrance on the line, and enter that total. Follow the link on that input for typical values. On a long transmission main these losses are small next to friction, but in short station piping they can be most of the loss.</dd></dl>';
// Manning Irregular
$ec_lang['mi_menu']='Manning Irregular Channel';
$ec_lang['mi_main_title']='Free Online Manning Irregular Channel Calculator';
$ec_lang['mi_main_desc']='Irregular Channel Manning Uniform Flow Calculator';
$ec_lang['mi_waterSurfaceElevation']='Water surface elevation';
$ec_lang['mi_q_617']='<span class="ec-help" title="The composite flow, Q, using a composite n for each region according to Chow 6-17, equal velocities">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Cross section points';
$ec_lang['mi_groupPoint']='Point';
$ec_lang['mi_groupSegment']='Segment';
$ec_lang['mi_groupRegion']='Region';
$ec_lang['mi_station']='Sta';
$ec_lang['mi_elevation']='Elevation';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q region boundary (Bank)';
$ec_lang['mi_tau']='Bottom shear τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='Comp.<br />n';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='Composite n';
$ec_lang['mi_notes_1_def']='This calculator follows HEC-RAS Reference Manual in calculating region composite n using Chow 1959, page 136, equation 6-17 (not 6-18).';
$ec_lang['mi_notes_3_term']='Errata';
$ec_lang['mi_notes_3_def']='Found and fixed 23 August 2026. A segment drawn exactly vertical — two points at the same station, one above the other, which is how a rectangular channel, a box culvert or a retaining wall is drawn — added no wetted perimeter. Results from before that date are too high for any section with a vertical wall: a channel 10 wide and 5 deep was given a wetted perimeter of 10 instead of 20, and flow about 1.6 times the correct value. A sloping bank, however steep, was never affected, and neither was a wall standing above the water. If you used this page on a section with a vertical wall, please run it again.';
$ec_lang['mi_notes_2_term']='Rock lining';
$ec_lang['mi_notes_2_def']='Use the Manning Trapezoidal Channel Calculator to design rock lining. This calculator is better suited to natural sections.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Manning Pipe Flow';
$ec_lang['mpf_main_title']='Free Online Manning Pipe Flow Calculator';
$ec_lang['mpf_main_desc']='Manning Formula Uniform Pipe Flow at Given Slope and Depth';
$ec_lang['mpf_pipe_diameter']='Pipe diameter, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Manning roughness, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Friction slope, S<sub>f</sub></a><span class="ec-help" title="Sometimes equal to pipe slope. Follow link for explanation (English only)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Relative flow depth, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Flow, Q';
$ec_lang['mpf_flow_tip']='Flow and depth calculated for an infinitely long pipe. Getting this flow into the pipe may need a higher headwater depth. See Notes below for details and a tutorial video.';
$ec_lang['mpf_velocity']='Velocity, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Kinetic energy as a height of water column, v²/2g">Velocity head, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Flow area, A';
$ec_lang['mpf_pipe_area']='Pipe area, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Relative area, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Wetted perimeter, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Hydraulic radius, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Top width, T';
$ec_lang['mpf_froude_number']='Froude number, Fr';
$ec_lang['mpf_shear_stress']='Average shear stress, τ';
$ec_lang['mpf_full_flow']='Full flow, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Ratio to full flow, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>This is the flow and depth inside an <em>infinitely long</em> pipe.</dt><dd>Getting the flow into the pipe may require significantly higher headwater depth. Add at least 1.5 times the velocity head to estimate the headwater depth, or <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">see my 2-minute tutorial</a> for standard culvert headwater calculations using <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, the free culvert program from the U.S. Federal Highway Administration.</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>Designing a sanitary sewer?</dt><dd>See the <a target="_blank" href="/sewslope.php">minimum sewer slope tables</a> for 4 to 96 inch (100 to 2400 mm) pipe, given in m/m, mm/m and percent, and the <a target="_blank" href="/peakfact.php">peaking factors for very low flows</a> study. Both are reference documents in English only.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Enter a positive target Q.';
$ec_lang['mpf_solver_no_solution']='No solution: Q exceeds pipe capacity at y/d0 = 93.8% (Qmax = {qmax} in chosen units).';
$ec_lang['mpf_solve_btn']='Solve';
$ec_lang['mpf_solve_for_flow']='for Flow, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Manning Pipe Head Loss';
$ec_lang['mphl_main_title']='Free Online Manning Pipe Head Loss Calculator';
$ec_lang['mphl_main_desc']='Manning Formula Head Loss at Given Full Flow';
$ec_lang['mphl_pipe_length']='Length, L';
$ec_lang['mphl_area']='Area, A';
$ec_lang['mphl_total_junction_k']='Minor (local) loss coefficient, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Loss coeff., k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Minor (local) loss coefficient, km. These losses occur at pipe junctions, entrances, exits, bends, and valves — the term "minor" is conventional but misleading; in a short line they can equal or exceed friction losses. Typical k values: sharp intake entrance 0.5, each 45° bend 0.2–0.3, gate valve (fully open) 0.1, butterfly valve 0.2, exit (to reservoir or atmosphere) 1.0. Sum all fittings for the total km. Default 2.0 assumes one entrance, one exit, and two 45° bends.';
$ec_lang['mphl_friction_slope']='Friction slope';
$ec_lang['mphl_friction_loss']='Friction loss, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Minor (local) loss, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Total loss, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='Downstream EGL';
$ec_lang['mphl_egl_2']='Upstream EGL';
$ec_lang['mphl_hgl_egl_tip']='This result may not be valid where the pipe rises above the hydraulic grade line.';
$ec_lang['mphl_note_1']='<dl><dt>This calculator does not model the pipe profile between the two ends.</dt><dd>If the HGL goes below the top of the pipe at any point, this calculation may not be valid.</dd><dt>For an open inlet (culvert) condition, it is necessary to check for inlet control conditions.</dt><dd>1. The upstream HGL must be above the upstream normal depth flow elevation (and higher than the pipe!).</dd><dd>2. The headwater of a culvert is better represented by the upstream EGL than the upstream HGL.</dd><dd>3. See <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">my 2-minute tutorial</a> for simple standard culvert headwater calculations using <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, the free culvert program from the U.S. Federal Highway Administration.</dd><dd>4. This page solves the outlet control case only: a pipe flowing full, where the downstream conditions set the head. Culvert design is the job of deciding whether inlet control or outlet control governs, so use HY-8 whenever either one could.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Manning Trapezoidal Channel';
$ec_lang['mtc_main_title']='Free Online Manning Formula Trapezoidal Channel Calculator';
$ec_lang['mtc_main_desc']='Manning Formula Uniform Trapezoidal Channel Flow at Given Slope and Depth';
$ec_lang['mtc_bottom_width']='Bottom width, b';
$ec_lang['mtc_side_slope_1']='Side slope 1, z<sub>1</sub> (horiz./vert.)';
$ec_lang['mtc_side_slope_2']='Side slope 2, z<sub>2</sub> (horiz./vert.)';
$ec_lang['mtc_channel_slope']='Channel slope, S';
$ec_lang['mtc_flow_depth']='Flow depth, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Bend Angle, β</a><span class="ec-help" title="For riprap sizing. Follow link for diagram."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Density relative to water. Typical ≈ 2.65 for crushed rock.">Rock specific gravity, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Design rock size, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n from design rock size (Strickler method)';
// Edited by TGH 2026-09-07
$ec_lang['mtc_n_blodgett']='n from design rock size (Blodgett method)';
$ec_lang['mtc_n_bathurst']='n from design rock size (Bathurst method)';
$ec_lang['mtc_n_pi']='n from design rock size (P&I, Phillips & Ingersoll method)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett vs. Bathurst';
$ec_lang['mtc_pi_range_check']='P&I range check';
$ec_lang['mtc_pi_ok']='d50 in P&I range';
$ec_lang['mtc_pi_ok_tip']='0.28–0.36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_not_applicable']='N/A';
$ec_lang['mtc_pi_out_of_range']='Outside range';
$ec_lang['mtc_pi_tip']='Extrapolating outside the 0.28–0.36 ft dataset range this equation was developed from — treat as a rough check, not a design basis';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Per Isbash (1936) and Maricopa County, Arizona, US.">Required bottom angular rock size, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Per Isbash (1936) and Maricopa County, Arizona, US.">Required side slope 1 angular rock size, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Per Isbash (1936) and Maricopa County, Arizona, US.">Required side slope 2 angular rock size, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Per Maynord, Ruff, and Abt (1989). At a bend the rock is sized for a bend velocity of 4/3 of the average, per California Division of Highways (1970); Maynord’s own 1.5 applies to natural channels.">Required angular rock size, D<sub>50</sub> (Maynord, Ruff, and Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Required angular rock size, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Velocity is reasonable for the uniform-flow assumptions.';
$ec_lang['mtc_vel_low']='Velocity is low; sedimentation risk.';
$ec_lang['mtc_vel_high']='Velocity is high and may not be realistic; check erosion of the channel lining, added depth at bends, and energy loss at expansions or obstructions.';
$ec_lang['mtc_iteration_tip']='Choose a roughness option (B/B for Blodgett–Bathurst is recommended) and a rock size option (Isbash recommended) to auto-iterate toward a uniform rock size for your target flow. See Notes below for the full method. To skip iteration, enter your own roughness value (follow link for guidance) and ignore rock size.';
$ec_lang['mtc_note_1']='<dl><dt>Automated rock size and roughness design iteration</dt><dd>Choose a roughness option (B/B for Blodgett–Bathurst is recommended) and a design rock size option (Isbash recommended). Adjust depth and rock size safety factor to reach your target flow with a uniform rock size. Each time you change an input, the calculator repeats these steps: 1. Roughness is calculated from design rock size. 2. The roughness value from the method you chose is copied into the roughness input. 3. Channel flow and required rock size are calculated. 4. Design rock size is adjusted. 5. The steps are repeated until the error in the design rock size is very small.</dd><dt>Basic calculator (no iteration)</dt><dd>Enter your desired roughness value. Ignore the design rock size input area.</dd></dl>';
$ec_lang['mtc_note_2_term']='Velocity check';
$ec_lang['mtc_note_2_def']='High velocity implies that there was a large elevation drop that created such high specific energy. That energy can be lost quickly at expansions, bends, or obstructions. Verify that this is reasonable for the site.';
$ec_lang['mtc_solver_no_solution']='No solution found for the given Q with these channel inputs.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Weir Flow Simple';
$ec_lang['ws_main_title']='Free Online Simple Broad-crested Weir Flow Calculator';
$ec_lang['ws_main_desc']='Simple Broad-crested Weir Flow Calculator';
$ec_lang['ws_weirLength']='Weir length, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Energy per unit weight of water — a height of the water column, not a pressure">Head, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Weir coefficient, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Notes';
$ec_lang['ws_notes_we_term']='Weir Equation';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Weir Flow Irregular';
$ec_lang['wi_main_title']='Free Online Segmented, Variable Depth, Irregular Weir Flow Calculator';
$ec_lang['wi_main_desc']='Irregular Weir Flow Calculator';
$ec_lang['wi_weirPoints']='Weir points';
$ec_lang['wi_pondingHeight']='Ponding Height';
$ec_lang['wi_incrementalFlow']='Incremental Flow';
$ec_lang['wi_cumulativeFlow']='Cumulative Flow';
$ec_lang['wi_notes_we_def']='q = if (length = 0) then 0 else if (slope=0) then cw*length*d<sub>0</sub><sup>1.5</sup> else cw/(2.5*slope) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) where d<sub>1</sub> and d<sub>0</sub> are always positive or zero';
// Orifice Flow
$ec_lang['or_main_menu']='Orifice Flow';
$ec_lang['or_main_title']='Free Online Orifice Flow Calculator';
$ec_lang['or_main_desc']='Orifice Flow — Free or Submerged';
$ec_lang['or_shape_circular']='Circular';
$ec_lang['or_shape_rectangular']='Rectangular';
$ec_lang['or_diameter']='<span class="ec-help" title="Diameter for circular; height for rectangular">Diameter or height, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Rectangular openings only">Width, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Bottom of opening">Invert elevation <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Headwater elevation';
$ec_lang['or_twe']='Tailwater elevation';
$ec_lang['or_cd']='Discharge coefficient, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Centroid elevation';
$ec_lang['or_head']='<span class="ec-help" title="Energy per unit weight of water — a height of the water column, not a pressure">Effective head, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Opening area, A';
$ec_lang['or_regime']='Orifice regime check';
$ec_lang['or_regime_valid']='Free outfall';
$ec_lang['or_regime_submerged']='Submerged orifice';
$ec_lang['or_regime_submerged_tip']='TWE above centroid — orifice regime still valid';
$ec_lang['or_regime_warn']='Outside orifice regime';
$ec_lang['or_regime_warn_tip']='Headwater below crown';
$ec_lang['or_regime_twe_above_hwe']='Check inputs';
$ec_lang['or_regime_twe_above_hwe_tip']='Tailwater (TWE) above headwater (HWE)';
$ec_lang['or_notes_1_term']='Orifice Equation';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). For free outfall: h = HWE − centroid. For submerged flow (TWE above invert): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Orifice Regime';
$ec_lang['or_notes_2_def']='Orifice flow equations apply when the headwater surface is above the crown (top) of the opening. When headwater is below the crown, use a weir equation instead.';
$ec_lang['or_notes_3_term']='Discharge Coefficient';
$ec_lang['or_notes_3_def']='C<sub>d</sub> ranges from about 0.60–0.65 for sharp-edged orifices. Rounded or re-entrant inlets use different values. See the <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> or the HEC-RAS Hydraulic Reference Manual for guidance.';
$ec_lang['or_notes_4_term']='Submergence';
$ec_lang['or_notes_4_def']='When TWE is above the opening invert, this calculator automatically applies the submerged orifice equation using h = HWE − TWE. When TWE is at or below the invert, free outfall is assumed and h = HWE − centroid.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Microhydropower';
$ec_lang['mhp_main_title']='Free Online Micro-Hydro Power Calculator';
$ec_lang['mhp_main_desc']='Run-of-River Micro-Hydro Power Output Calculator';
$ec_lang['mhp_gross_head']='Gross head, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Penstock (supply pipe) diameter">Penstock diameter, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Length, L';
$ec_lang['mhp_efficiency']='Plant efficiency, η (0–1)';
$ec_lang['mhp_vel_check']='Velocity check';
$ec_lang['mhp_hl_check']='Head loss check';
$ec_lang['mhp_hnet']='Net head, H<sub>net</sub>';
$ec_lang['mhp_power']='Power output, P';
$ec_lang['mhp_annual_kwh']='P as annual energy';
$ec_lang['mhp_vel_low']='Velocity is low; sedimentation and air-entrainment risk.';
$ec_lang['mhp_vel_high']='Velocity is high and may not be realistic; check transition losses, available energy, and water hammer.';
$ec_lang['mhp_vel_ok_short']='OK';
$ec_lang['mhp_vel_high_short']='High';
$ec_lang['mhp_vel_low_short']='Low';
$ec_lang['mhp_vel_ok_tip']='Velocity is in the efficient range for penstock design.';
$ec_lang['mhp_hl_ok_tip']='Head loss is under 10% of gross head. This pipe size is economical.';
$ec_lang['mhp_hl_warn_tip']='Head loss is over 10% of gross head. Consider a larger pipe.';
$ec_lang['mhp_hl_bad_tip']='Head loss is over 20% of gross head. Resize the pipe.';
$ec_lang['mhp_notes_1_term']='Head Loss';
$ec_lang['mhp_notes_1_def']='Total penstock (supply pipe) loss h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, where h<sub>f</sub> = f(L/D)(v²/2g) is Darcy-Weisbach friction loss and h<sub>m</sub> = k<sub>m</sub>·v²/2g covers entrance, bends, and valves. Net head H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Velocity';
$ec_lang['mhp_notes_2_def']='Check that velocity is reasonable for the available drop and pipe cost. Very low velocity may indicate oversizing; very high velocity can increase friction losses and water hammer risk.';
$ec_lang['mhp_notes_3_term']='Head Loss Target';
$ec_lang['mhp_notes_3_def']='Penstock (supply pipe) losses below 10% of gross head are generally economical. The optimal trade-off between pipe cost and lost power often falls around 4–6% where the price of electricity is at the high end.';
$ec_lang['mhp_notes_6_term']='Efficiency';
$ec_lang['mhp_notes_6_def']='Typical plant efficiency η ranges from 0.70 to 0.85 for Pelton and cross-flow turbines common in micro-hydro. Use 0.75 as a conservative first estimate.';
$ec_lang['mhp_notes_7_term']='Annual Energy';
$ec_lang['mhp_notes_7_def']='Annual energy assumes continuous full-flow operation (8760 hours/year). Actual production will be lower due to seasonal flow variation, maintenance downtime, and load factor.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Pond & Tank Drain Time';
$ec_lang['odt_main_title']='Free Online Pond, Basin, and Tank Drain Time Calculator (Orifice)';
$ec_lang['odt_main_desc']='Pond, Basin, or Tank Drain Time — Orifice Outlet, Conic Volume Method';
$ec_lang['odt_h1_elev']='Starting water surface elevation';
$ec_lang['odt_a1']='Starting area, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Ending water surface elevation';
$ec_lang['odt_a0']='Orifice-level area, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Interpolated from conic model at ending elevation">Ending area, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Ending elevation check';
$ec_lang['odt_h2_ok']='Ending elevation above orifice top';
$ec_lang['odt_h2_warn']='Ending elevation at or below orifice top';
$ec_lang['odt_h2_warn_tip']='Orifice top = centroid + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Diameter (circular) or height (rectangular)">Orifice D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Rectangular only">Orifice width, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Drain time (s)';
$ec_lang['odt_t_min']='Drain time (min)';
$ec_lang['odt_t_hr']='Drain time (hr)';
$ec_lang['odt_t_day']='Drain time (days)';
$ec_lang['odt_notes_1_term']='Formula';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) gives drain time from head H to the orifice. Drain time = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), where H<sub>1</sub> = starting elevation − orifice elevation, H<sub>2</sub> = ending elevation − orifice elevation.';
$ec_lang['odt_notes_2_term']='Method';
$ec_lang['odt_notes_2_def']='The conic volume method models the pond or basin as a conic section between the starting area A<sub>1</sub> at the initial water surface and the area A<sub>0</sub> at the orifice centroid elevation. A<sub>2</sub>, the pond area at the ending elevation, is interpolated from A<sub>1</sub> and A<sub>0</sub> using the conic section model. Drain time from starting to ending elevation equals total drain time from H<sub>1</sub> to orifice minus remaining drain time from H<sub>2</sub> to orifice.';
$ec_lang['odt_h1']='<span class="ec-help" title="Starting water surface elevation minus orifice centroid elevation">Starting head, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Max flow, Q<sub>max</sub>';
$ec_lang['odt_vol']='Drained volume';
$ec_lang['odt_sketch_start']='Start';
$ec_lang['odt_sketch_end']='End';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Emitter spacing, S<sub>e</sub>';
$ec_lang['ip_sl']='Lateral spacing, S<sub>l</sub>';
$ec_lang['ip_n_e']='Emitters per lateral, n<sub>e</sub>';
$ec_lang['ip_n_l']='Laterals per zone, n<sub>l</sub>';
$ec_lang['ip_d']='Target application depth, d';
$ec_lang['ip_a_e']='Area per emitter, A<sub>e</sub>';
$ec_lang['ip_pr']='Application rate, PR';
$ec_lang['ip_q_lat']='Flow per lateral, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Zone flow, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Runtime (hours)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Canal Seepage';
$ec_lang['cs_main_title']='Free Online Canal Seepage Loss and Conveyance Efficiency Calculator';
$ec_lang['cs_main_desc']='Canal Seepage Loss & Conveyance Efficiency — Inflow-Outflow Method';
$ec_lang['cs_Q_in']='Inflow, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Outflow, Q<sub>out</sub>';
$ec_lang['cs_L']='Reach length, L';
$ec_lang['cs_Q_loss']='Seepage loss rate, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Measurement check';
$ec_lang['cs_pct_loss']='Fraction lost';
$ec_lang['cs_Ec']='Conveyance efficiency, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Efficiency rating';
$ec_lang['cs_Vol_day']='Daily volume lost';
$ec_lang['cs_Vol_year']='Annual volume lost';
$ec_lang['cs_Q_loss_per_L']='Loss per unit length, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Water value';
$ec_lang['cs_lining_cost']='Lining cost';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Conveyance efficiency goal after lining; fraction 0–1">Lining target, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Lining area, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Annual value lost';
$ec_lang['cs_annual_value_recovered']='Annual value recovered';
$ec_lang['cs_lining_total_cost']='Total lining cost';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Simple payback = total lining cost ÷ annual value recovered">Payback period <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — seepage detected';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — no measurable loss';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — check measurements';
$ec_lang['cs_Ec_good']='Good — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='Fair — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='Poor — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='The inflow-outflow method estimates seepage by measuring flow at the head and tail of a canal reach: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. Conveyance efficiency E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. Annual volume assumes continuous full-flow operation; actual loss is lower for seasonal or part-flow canals.';
$ec_lang['cs_notes_2_term']='Efficiency Ratings';
$ec_lang['cs_notes_2_def']='Typical unlined earthen canals: E<sub>c</sub> = 60–80%. Well-maintained earthen canals: 75–85%. Concrete-lined canals: 90–98%. Seepage losses above 30% of inflow often justify a lining investment. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Lining Payback';
$ec_lang['cs_notes_3_def']='Enter water value and lining cost in any consistent currency. Lining area = reach length × wetted perimeter — the wetted perimeter of the canal cross-section at the measured flow depth (bottom width plus both wetted slopes). Annual value recovered assumes the lined canal achieves the target E<sub>c</sub> continuously. Actual payback will be longer for seasonal canals or if the lining does not reach the target efficiency.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, 3rd ed. (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='About';
$ec_lang['install_main_menu']='Install';
$ec_lang['install_main_title']='Install EngCalcs';
$ec_lang['install_main_desc']='Add to Your Device for Offline Use';
$ec_lang['install_intro']='EngCalcs is a Progressive Web App (PWA). Once installed, all calculators work fully offline — no internet connection needed.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Open any calculator page in Chrome.</li><li>Tap the <strong>⬇ Install</strong> button in the top navigation bar, or tap the browser menu (⋮) and choose <strong>Add to Home screen</strong>.</li><li>Tap <strong>Install</strong> in the prompt that appears.</li><li>EngCalcs appears on your home screen and works offline.</li>';
$ec_lang['install_now_btn']='⬇ Install Now';
$ec_lang['install_prompt_unavailable']='Install prompt not available — use your browser menu instead.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Open any calculator page in Safari.</li><li>Tap the <strong>Share</strong> button (box with arrow pointing up).</li><li>Scroll down and tap <strong>Add to Home Screen</strong>.</li><li>Tap <strong>Add</strong>. EngCalcs appears on your home screen.</li>';
$ec_lang['install_ios_note']='On iOS, installing always uses the Share menu — there is no automatic install prompt.';
$ec_lang['install_desktop_heading']='Desktop (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Open any calculator page.</li><li>Click the <strong>install icon</strong> (⊕ or computer icon) in the browser’s address bar, or open the browser menu and choose <strong>Install EngCalcs…</strong></li><li>Click <strong>Install</strong>. EngCalcs opens as a standalone app window.</li>';
$ec_lang['install_firefox_heading']='Firefox / Other Browsers';
$ec_lang['install_firefox_body']='If the browser offers no install option, use the calculators in the browser as usual. After the first visit, pages are cached automatically for offline use. Firefox on the desktop is the common case.';
$ec_lang['install_cached_heading']='What Gets Cached';
$ec_lang['install_cached_body']='The first time you install EngCalcs, all calculator pages and their supporting files (scripts, styles) are saved on your device automatically. After that, everything works without an internet connection. Your language choice is remembered from your last online visit.';
$ec_lang['contact_main_menu']='Contact';
$ec_lang['about_main_title']='About HawsEDC Engineering Calculators';
$ec_lang['about_main_desc']='Mission, Libre Software, and Contributing';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Mission</h3><p>HawsEDC Engineering Calculators have been offered freely online since 2010. They exist to serve engineers and field workers around the world — especially those working in water-scarce, low-resource, or underserved regions. These tools are part of a broader humanitarian mission: to tell every human being in the most practical and effective way possible <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">that they are loved and cherished forever, that they have nothing to fear, and that they are not going to ruin everything</a>.</p><p>The calculators are the vehicle. The destination is a world free of suffering.</p><h3>Free Libre Open Source License</h3><p>All code is released under the <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 or later</a> — free as in freedom. You may use, study, modify, and redistribute the code under the same terms.</p><p>The website that serves it is offered freely today and since 2010; if one day it cannot be, the software is still yours to run.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Source Code</h3><p>The full source code is publicly available on GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>You can browse the code, file issues, or fork the repository there.</p><h3>Contributing</h3><p>All help is welcome. <a href="contact.php">Contact Tom Haws</a>.</p><ul><li><strong>Translations:</strong> Suggest better wording. Improve or add a language.</li><li><strong>Bug reports:</strong> Use the feedback form on any calculator page, or file an issue on GitHub.</li><li><strong>New calculators:</strong> Ideas for hydraulic engineering tools that serve field workers and irrigation practitioners are especially welcome.</li><li><strong>Hosting:</strong> If you can mirror these calculators for a region with limited connectivity, please contact me.</li></ul><h3>Offline Use</h3><p>Open any calculator once while you are online and all of them keep working when you are not: your browser stores the whole suite as you go. The mechanism is a <strong>Progressive Web App (PWA)</strong>. After that, all calculators work offline — no internet required.</p><p>On Android or iOS, use your browser’s "Add to Home Screen" option to install EngCalcs as an app on your device. On desktop, look for the install icon in your browser’s address bar.</p><p>You can also save any individual calculator using your browser’s "Save as…" menu for one-off offline use.</p><h3>Contact</h3><p>Tom Haws, hydraulic engineer and founder of these calculators.<br />Use the feedback form on any calculator page, or reach the source code at <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
$ec_lang['contactSendMessage']='Send Tom Haws a message';
$ec_lang['contactYourName']='Your name:';
$ec_lang['contactYourEmail']='Your e-mail address:';
$ec_lang['contactSubject']='Subject:';
$ec_lang['contact_message']='Message:';
$ec_lang['contactSpamPrefix']='Five plus one equals';
$ec_lang['contactSpamPostfix']='(Please answer with the English word. 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Submit Message';
$ec_lang['contact_success']='Thank you for taking the time to write.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Rock Chute Design (Robinson)';
$ec_lang['rc_main_title']='Free Online Rock Chute Design Calculator — Robinson (1998)';
$ec_lang['rc_main_desc']='Steep Channel Rock Lining Size — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Steep channel bed slope, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Flow per unit width at the steep channel inlet. For a channel of bottom width B with total flow Q, use q_t = Q / B.">Total unit discharge, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Rock lining porosity, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Density relative to water. Typical crushed granite or basalt ≈ 2.65. Robinson valid range: 2.54 to 2.82.">Rock specific gravity, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Gradation standard deviation. Uniform rock ≈ 1.25. Robinson valid range: 1.15 to 1.47.">Gradation SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="Ponding (Hp > yn) is desirable because it reduces upstream erosion. (USDA)">Normal depth in inlet channel, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Eq. 1 (S0 < 0.10) or Eq. 2 (0.10-0.40). Valid: D50 15-278 mm, S0 0.02-0.40. Outside range: extrapolated.">Required median rock size, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Equation applied';
$ec_lang['rc_sg_check']='Specific gravity check';
$ec_lang['rc_SD_check']='Gradation SD check';
$ec_lang['rc_sg_ok']   ='sg in valid range';
$ec_lang['rc_sg_ok_tip']='2.54–2.82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg below Robinson range';
$ec_lang['rc_sg_low_tip']='Valid range: 2.54–2.82';
$ec_lang['rc_sg_high'] ='sg above Robinson range';
$ec_lang['rc_sg_high_tip']='Valid range: 2.54–2.82';
$ec_lang['rc_SD_ok']   ='SD in valid range';
$ec_lang['rc_SD_ok_tip']='1.15–1.47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD below Robinson range';
$ec_lang['rc_SD_low_tip']='Valid range: 1.15–1.47';
$ec_lang['rc_SD_high'] ='SD above Robinson range';
$ec_lang['rc_SD_high_tip']='Valid range: 1.15–1.47';
$ec_lang['rc_layer']='Rock lining thickness (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Top crest curve radius (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Top crest curve arc length';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Required for structural support of the rock lining. “The minimum tailwater that occurs as a result of the outlet reach and downstream channel resistance is sufficient to ensure stability of the riprap in the outlet reach.” (Robinson)">Outlet apron length (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Manning roughness in steep channel, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Fraction of qt flowing through rock pores. Remainder qs flows over the surface. Default np = 0.45 for angular crushed rock.">Velocity through rock mantle, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Unit flow through mantle, q<sub>m</sub>';
$ec_lang['rc_qs']='Surface unit flow, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Flow depth above rock lining surface, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="Ponding (Hp > yn) is desirable because it reduces upstream erosion. (USDA)">Inlet weir head, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Inlet ponding check';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — ponding upstream';
$ec_lang['rc_pond_ok_tip']='Ponding upstream of the steep channel inlet is desirable; it reduces erosion upstream. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — no ponding — inlet erosion potential';
$ec_lang['rc_pond_warn_tip']='No ponding upstream of the steep channel inlet; erosion could occur upstream. (USDA)';
$ec_lang['rc_eq1']='Eq. 1 (S<sub>0</sub> < 0.10) — gentle slope';
$ec_lang['rc_eq2']='Eq. 2 (0.10 ≤ S<sub>0</sub> ≤ 0.40) — steep slope';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0.02 — below Robinson validation range';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0.40 — above Robinson validation range';
$ec_lang['rc_notes_1_term']='Rock Sizing Equations';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) developed two empirical equations for median rock lining size D<sub>50</sub> from channel slope and unit discharge. Equation 1 applies for gentle slopes (S<sub>0</sub> < 0.10); Equation 2 applies for steep slopes (0.10 ≤ S<sub>0</sub> ≤ 0.40). Both equations require q<sub>t</sub> in m²/s and return D<sub>50</sub> in mm. The validated range is 0.02 ≤ S<sub>0</sub> ≤ 0.40.';
$ec_lang['rc_notes_2_term']='Unit Discharge';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> is the total unit discharge at the steep channel crest (total flow per unit width). For a channel of bottom width B carrying total flow Q, approximate q<sub>t</sub> ≈ Q / B, or compute it from the critical-depth condition at the steep channel inlet.';
$ec_lang['rc_notes_3_term']='Flow Through the Rock Mantle';
$ec_lang['rc_notes_3_def']='A fraction of the total flow moves through the pores of the rock lining (mantle flow q<sub>m</sub>); the remainder flows over the rock surface (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). The flow depth d is computed from Manning’s equation applied to the surface flow q<sub>s</sub> using the steep channel roughness n. Default porosity n<sub>p</sub> = 0.45 is typical for angular crushed rock.';
$ec_lang['rc_notes_5_term']='Valid Rock Size Range';
$ec_lang['rc_notes_5_def']='The equations were developed using a D<sub>50</sub> range of 15 mm to 278 mm. Results outside this range are extrapolated and should be used with additional engineering judgement.';
$ec_lang['rc_notes_6_term']='Outlet Apron Elevation';
$ec_lang['rc_notes_6_def']='The elevation of the top of the rock lining in the outlet reach should be at or below the downstream channel bed elevation. If it is higher, the outlet rock will be unstable.';
$ec_lang['rc_notes_7_term']='Inlet Ponding';
$ec_lang['rc_notes_7_def']='When the normal depth in the inlet channel is less than the weir head (H<sub>p</sub>) required to pass q<sub>t</sub>, restricted flow or ponding occurs upstream of the steep channel inlet. This is generally acceptable — ponding reduces velocity and prevents erosion upstream. To check: use a weir flow calculator to find H<sub>p</sub> for the given q<sub>t</sub> and crest width, and compare it to the inlet channel normal depth. If H<sub>p</sub> exceeds normal depth, ponding will occur.';
$ec_lang['rc_notes_4_term']='Reference';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). “<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>.” <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS also publishes an <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">Excel spreadsheet</a> based on the same method.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'Filter';
$ec_lang['rc_sketch_top_crest_curve'] = 'Top Crest Curve';
$ec_lang['rc_sketch_outlet_apron']    = 'Outlet Apron';
$ec_lang['rc_sketch_radius']          = 'radius';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Irrigation Pressure';
$ec_lang['ip_main_title']='Free Online Irrigation Pressure & Distribution Uniformity Calculator';
$ec_lang['ip_main_desc']='Test Branch Pressure and Estimated Uniformity';
$ec_lang['ip_h_supply']='Supply pressure';
$ec_lang['ip_elev_supply']='Supply elevation, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Emitter design flow, q<sub>design</sub>';
$ec_lang['ip_h_design']='Emitter design pressure';
$ec_lang['ip_x']='<span class="ec-help" title="0.5 for standard non-compensating emitters; near 0 for pressure-compensating emitters">Emitter discharge exponent, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Test path';
$ec_lang['ip_group_reach']='Reach';
$ec_lang['ip_group_upstream']='Upstream';
$ec_lang['ip_group_downstream']='Downstream';
$ec_lang['ip_group_loss']='Loss';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Checked: this reach is a segment of the test lateral, from which individual emitters withdraw water. Cleared: this reach is a main, only passing flow along to laterals not on the test path.">Lat. <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Lateral rows: emitters in this reach only. Main rows: total emitters on laterals OTHER than this one that branch from this reach. For the reach of the main line that ends at the test lateral line, this also includes any laterals beyond that point along the main, or sharing the same junction (e.g. an opposite-side lateral) — their flow branches from this same reach too.">Emitters <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Downstream-end elevation of this reach. Optional on interior rows (defaults to flat / same as the node above if left blank). Required on the last row: that value is the last emitter’s elevation, which directly sets the required supply pressure.">DS Elev. <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='Last emitter elevation (last row) was left blank and defaulted to flat — enter it for an accurate result';
$ec_lang['ip_press']='Press.';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Total reach loss, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Low/negative pressure — check for subatmospheric conditions';
$ec_lang['ip_pressure_warn_short']='Low';
$ec_lang['ip_pressure_high']='High pressure locations need pressure reduction';
$ec_lang['ip_pressure_high_short']='High';
$ec_lang['ip_max_head']='Max. allow. pipe pressure';
$ec_lang['ip_max_head_tip']='Lines whose pressure exceeds this value are flagged. Leave blank to skip the high-pressure check.';
$ec_lang['ip_h_far']='Last emitter pressure';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Flow entering the modeled test path only — for the whole zone/system, see Q_zone in Application Design below.">Test path supply flow, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Last emitter flow, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Average emitter flow (test lateral), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="How much higher (or lower) you estimate a typical lateral operates compared to this test lateral. The test lateral is deliberately the presumed worst case, so its own average is an underestimate of the field average — left at 0, the uniformity check and application-design numbers below use the test lateral’s own (likely optimistic) average as-is.">Est. Δpressure, avg. vs. test lateral <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral re-evaluated at each lateral row’s pressure plus the entered pressure difference above — an attempt to correct for the test lateral being the presumed worst case, not a representative one. Feeds both the uniformity check and the application-design section below.">Est. field-average emitter flow, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Last emitter’s computed flow divided by the estimated field-average emitter flow — this is an approximation of the standard low-quarter Distribution Uniformity (low-group average ÷ population mean); this is from a small modeled sample and a user-estimated correction instead of a full-field statistical sample. Values at or above 1 are possible and valid: they only mean the last emitter’s pressure is at or above the estimated field average, so some other emitter is the point of lowest pressure. This could be because the last emitter is on low ground or because the Δpressure estimate is too small.">Uniformity check, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='Pressure at test emitter ≥ supply pressure. This is probably not the worst-case emitter, or the pipes could be made smaller.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="This is different than our approximation of the standard uniformity measure.">Last emitter flow ÷ design flow, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='No solution: required supply pressure exceeds the entered supply pressure. Increase supply pressure, reduce demand, or use a larger pipe.';
$ec_lang['ip_notes_1_def']='Guesses the pressure at the last (most remote) emitter, then steps the Energy Grade Line back toward the supply, reach by reach, adding friction and minor losses along the way. Elevation and velocity head are subtracted at each node to report the actual pressure there. The guessed far-end pressure is adjusted (bisection) until the computed required supply pressure matches the entered supply pressure — the same closed-loop problem addressed by the pipe-flow solver on the Manning Pipe Flow calculator, extended to a branching network.';
$ec_lang['ip_notes_2_term']='Main vs. Lateral Reaches';
$ec_lang['ip_notes_2_def']='Each row is one reach along the single hydraulically worst path (the test path) from the supply to the last emitter. A Main reach only passes flow to laterals not on the test path, so its withdrawal is a simple multiplication (design flow × the reach’s total emitter count) — no local pressure sensitivity. The main is a shared trunk pipe, so the reach of the main line that ends at the test lateral line must include not just laterals between its own endpoints but also any laterals still further down the main beyond that point, or sharing the same junction (e.g. an opposite-side lateral) — their flow travels through that same reach before splitting off, whether or not they appear anywhere else in this table. A Lateral reach is a segment of the test lateral itself: emitter discharge is computed from the actual local pressure via q = k·H<sup>x</sup>, and friction loss is reduced by Christiansen’s F(n) factor to account for flow decreasing as each emitter in the reach withdraws water.';
$ec_lang['ip_notes_3_term']='Limitations';
$ec_lang['ip_notes_3_def']='Models one fixed supply pressure (no pump curve), one test path only (not the full field), and a 2-parameter emitter curve (set the exponent near 0 to approximate a pressure-compensating emitter). Two different uniformity ratios are reported, deliberately kept separate: q<sub>last</sub>/q<sub>avg,field</sub> is an approximation of the standard low-quarter Distribution Uniformity (low-group average ÷ population mean); but this is from a small modeled sample and a user-estimated correction instead of the standard full-field statistical sample. Also, the test lateral is deliberately the presumed worst case, so its raw, uncorrected average would understate the true field average and make uniformity look better than it is; the Δpressure input exists specifically to counter that bias. Values for uniformity at or above 1 are still possible: they only mean that the last emitter’s pressure is at or above the estimated field average, so some other emitter is the point of lowest pressure. This could be because the last emitter is on low ground or because the Δpressure estimate is too small. q<sub>last</sub>/q<sub>design</sub> is a different, non-uniformity check against the manufacturer’s rated flow — useful for detecting an over- or under-pressured system overall, but it is a separate check to read alongside the uniformity number, since the design/rated flow is independent of the system’s actual mean operating pressure.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. ASAE/ASABE standards for microirrigation design use the same multi-outlet friction-loss approach.';
$ec_lang['ip_notes_5_term']='Application Design';
$ec_lang['ip_notes_5_def']='Application rate and system/zone flow use the estimated field-average emitter flow (q<sub>avg,field</sub> — the test lateral’s own average, corrected by the entered Δpressure estimate), not a guessed rate: PR = q<sub>avg,field</sub> / A<sub>e</sub>, fed by the corrected modeled value. Spacing and system-wide lateral/emitter counts are separate inputs here because the test path only models one worst-case branch, not every lateral in the field.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Branched Pipe Network';
$ec_lang['bpn_main_title']='Free Online Branched Pipe Network Pressure Calculator (No Loops)';
$ec_lang['bpn_main_desc']='Branched (Tree) Pipe Network Flow and Pressure';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='Static supply head: the source head at zero flow. A reservoir or tank water level above the supply elevation, or a pump’s shutoff head. Add supply points 2 and 3 to define a pump or varying-supply curve; the tool reads the head at the design flow.';
$ec_lang['bpn_elev_source']='Supply elevation';
$ec_lang['bpn_q_total']='Total flow';
$ec_lang['bpn_q_total_tip']='Total flow leaving the source (the sum of all demands in the network).';
$ec_lang['bpn_p_min']='Lowest pressure';
$ec_lang['bpn_p_min_tip']='The lowest downstream pressure anywhere in the network; the critical delivery point.';
$ec_lang['bpn_method']='Friction method';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='Pipe lines';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='Name of this pipe line. Other lines refer to it in the Upstream column.';
$ec_lang['bpn_upstream']='Upstream ID';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ID of the line that feeds this one. Leave blank to follow the line directly above it (a unbranched pipeline). Enter an ID here to branch off a different line.';
$ec_lang['bpn_roughness_tip']='Pipe roughness for the chosen friction method: Manning n, Hazen-Williams C, or Darcy-Weisbach roughness height e (a length). Typical smooth plastic pipe: n about 0.009, C about 150, e about 0.0015 mm.';
$ec_lang['bpn_demand']='Demand';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Fixed flow delivered at this line’s downstream end.';
$ec_lang['bpn_demand_mult']='Demand multiplier';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Scales every demand, for a peak-hour or future-growth run. Use 1 for the demands as entered.';
$ec_lang['bpn_elev_down']='DS elev.';
// Edited by TGH 2026-09-07
$ec_lang['bpn_q_line']='Line flow';
$ec_lang['bpn_q_line_tip']='Total flow carried by this line: its own demand plus every downstream demand it feeds.';
$ec_lang['bpn_p_down']='DS press.';
// Edited by TGH 2026-09-07
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Gauge pressure head at this line’s downstream node. A negative value (flagged) means subatmospheric pressure; check the design.';
$ec_lang['bpn_sketch_heading']='Network Diagram';
$ec_lang['bpn_source_label']='Source';
$ec_lang['bpn_line_problem']='This line is not connected to the source: it points to an unknown upstream ID, points at itself, repeats an ID another line already uses, or forms a loop. Lines that are not connected are left unsolved.';
$ec_lang['bpn_bad_id_short']='Bad ID';
$ec_lang['bpn_not_connected_short']='Not connected';
$ec_lang['bpn_dup_id_short']='Duplicate ID';
$ec_lang['bpn_pressure_warn']='Low/negative pressure; check for subatmospheric conditions';
$ec_lang['bpn_pressure_warn_short']='Low';
$ec_lang['bpn_notes_1_term']='Series by default, branch by exception';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='If Upstream ID is left blank, the line follows the line above it as a series pipeline. Enter the ID of an upstream line to branch from it. The default is a series pipeline; a tree is formed only where a branch is entered.';
$ec_lang['bpn_notes_2_term']='Branched networks only, no loops';
$ec_lang['bpn_notes_2_def']='Every line has exactly one upstream line (a tree). This tool does not solve looped networks, which require iterative methods (EPANET or similar). Because the network has no loops, the solution is direct and exact.';
$ec_lang['bpn_notes_3_term']='No active pressure controls';
$ec_lang['bpn_notes_3_def']='You can add a fixed minor-loss valve (a k-value), but not pressure-reducing or pressure-sustaining valves (PRV/PSV). Their open/closed state depends on flow and pressure, which would force iteration.';
$ec_lang['bpn_supply2_q']='Supply flow 2';
$ec_lang['bpn_supply2_h']='Supply head 2';
$ec_lang['bpn_supply3_q']='Supply flow 3';
$ec_lang['bpn_supply3_h']='Supply head 3';
$ec_lang['bpn_supply_pt_tip']='Optional supply-curve points 2 and 3. Enter a flow and head for each to model a pump, or any source whose head drops as it delivers more; the tool reads the head at the design flow. Point 1 above is the static head at zero flow. Leave 2 and 3 blank for a constant reservoir head.';
$ec_lang['bpn_h_supply']='Supply head';
$ec_lang['bpn_h_supply_tip']='Source head at the design flow, read from the supply curve. Equals the entered source head when the curve is flat (a reservoir).';
$ec_lang['bpn_supply1_h']='Static supply head';
$ec_lang['lpn_main_menu']='Water Supply Network';
$ec_lang['lpn_main_title']='Free Online Water Distribution Network Modeling with the EPANET Solver';
$ec_lang['lpn_main_desc']='Water Supply Network Analysis: Draw a Looped Pipe Network or Import EPANET Files';
$ec_lang['lpn_title_units']='{units} Units';
$ec_lang['lpn_tool_select']='Select';
$ec_lang['lpn_tool_add_junction']='Junction';
$ec_lang['lpn_tool_add_reservoir']='Reservoir';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Tank';
$ec_lang['lpn_tool_add_pipe']='Pipe';
$ec_lang['lpn_tool_add_pump']='Pump';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='Valve';
$ec_lang['lpn_tool_add_text']='Text';
// Junction and Pipe (Task 719): Tom's WaterCAD command, a junction, a pipe, a junction, a pipe, until Escape.
$ec_lang['lpn_tool_add_chain']='Junction Pipe Chain';
$ec_lang['lpn_tool_vertices']='Vertices';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='Customer';
$ec_lang['lpn_tool_add_meter_tip']='Specify the customer point, then its connection: a link or node. The demand you give the customer is added to the node at the nearest end of that link.';
$ec_lang['lpn_mode_add_meter']='Customer: specify where the customer is, then select the pipe or the node that serves it. Or use Esc to cancel.';
$ec_lang['lpn_pane_tab_customers']='Customers';
// The Shape table (Task 779). Closed is a polygon's closure, not a pipe's or valve's status, so it
// is a key of its own and not lpn_field_closed: many languages use different words for the two.
// Points is the column of the Shape's points, "Shape S1, point 2" in lpn_snap_shape_point.
$ec_lang['lpn_pane_tab_shapes']='Shapes';
$ec_lang['lpn_pane_shape_closed']='Closed';
$ec_lang['lpn_pane_shape_points']='Points';
$ec_lang['lpn_customer_heading']='Customer {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Demand per service';
$ec_lang['lpn_field_meter_count']='Number of services';
$ec_lang['lpn_field_meter_total']='Total demand';
$ec_lang['lpn_field_meter_total_tip']='Total added to the junction named below.';
$ec_lang['lpn_field_meter_pipe']='Connected asset';
$ec_lang['lpn_field_meter_pipe_suggest']='The nearest asset is {id}. Enter it here to serve this customer from it.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Connected to';
$ec_lang['lpn_field_meter_node_tip']='The junction this customer is connected to. Drag the connection point onto a pipe to serve it from a station along that pipe instead.';
$ec_lang['lpn_meter_pipe_unknown']='Nothing in this project is named {id}, so the customer was left where it was.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_meter_pattern_unknown']='No pattern in this project is named {id}, so the customer was left as it was.';
$ec_lang['lpn_meter_placed']='Customer {id} added. Enter its description and demand in the Customers table, or select it in Select mode to open its properties box.';
$ec_lang['lpn_field_meter_pipe_tip']='The asset that this service connects to. Enter another one here or in the Customers table to change it, or drag the connection point to a different asset.';
$ec_lang['lpn_field_meter_station']='Station along the pipe (%)';
$ec_lang['lpn_field_meter_station_tip']='Distance along the pipe to the service connection, as a percentage of the pipe from its first node to its second. 0 is at one end and 100 is at the other. The circle on the pipe does the same thing with the pointer.';
$ec_lang['lpn_field_meter_offset']='Offset from the pipe';
$ec_lang['lpn_field_meter_offset_tip']='Positive is to the right of the pipe looking from its first node toward its second. Entering a value here can move the customer to the other side of the main, and it always squares the service line to the main.';
$ec_lang['lpn_field_meter_lumped']='Added to node';
$ec_lang['lpn_field_meter_lumped_tip']='Nearest node; this customer\'s demands are added there.';
$ec_lang['lpn_node_customers']='Customer demands';
$ec_lang['lpn_node_customers_tip']='List of customers added here because this was their nearest node. Customer demands are in addition to other demands listed here. A customer is edited where it sits on the map or in the Customers table.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} from Customers ({n})';
$ec_lang['lpn_customer_detached']='⚠ This customer is not connected to a pipe, so its demand is not in the answers. Delete it, or draw a pipe and move the customer onto it.';
$ec_lang['lpn_customer_fixed_head']='⚠ The near end of that pipe holds a fixed water surface, so this demand does not affect the simulation.';
$ec_lang['lpn_customer_node_inactive']='This customer is assigned to a junction that is inactive in this scenario, so its demand is not part of the solve.';
$ec_lang['lpn_customer_detached_count']='Customers not connected to a pipe ({n}). Their demand is not accounted for.';
$ec_lang['lpn_meter_pick_pipe']='Now select the pipe or the node that serves this customer. The customer stays where you put it. Press Escape to cancel.';
$ec_lang['lpn_inp_export_flat_customers']='An EPANET file has no customers. The demand of the customers in this project ({n}) is written as a demand row on the junction each customer is assigned to, named with the customer\'s tag. The file does not record the customer itself: its location, the pipe that serves it, where along that pipe the service connects, or how many services it represents. That information remains in the project; save the project file to keep it.';

$ec_lang['lpn_area_hint_window_start']='Specify one corner of the window.';
$ec_lang['lpn_area_hint_window_go']='Specify the opposite corner to finish.';
$ec_lang['lpn_area_hint_lasso_start']='Specify a point to start the outline.';
$ec_lang['lpn_area_hint_lasso_go']='Move to draw the outline. Specify the last point to finish.';
$ec_lang['lpn_area_hint_polygon_start']='Specify the first corner of the polygon area. Double-click to finish.';
$ec_lang['lpn_area_hint_polygon_go']='Specify each corner. Double-click the last one to finish.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Hold Shift while selecting to continue with the existing selection, adding or removing (toggle) what you select.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Press on the map and drag around what you want, then lift.';
$ec_lang['lpn_area_hint_touch_go']='Drag around what you want, then lift to finish.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Show this';
$ec_lang['lpn_multi_title']='{n} selected';
$ec_lang['lpn_multi_varies']='Various';
$ec_lang['lpn_multi_applied']='Set {prop} on {n}.';
$ec_lang['lpn_multi_no_fields']='These have nothing that can be set together here.';
$ec_lang['lpn_pane_pasted']='Pasted cells ({n}). Cells not changed ({skipped}).';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='Pasted rows ({n}). Rows added to the network ({created}).';
$ec_lang['lpn_pane_pasted_rows_skipped']='Pasted rows ({n}). Rows added to the network ({created}). Cells not changed ({skipped}).';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Select this area and paste rows from a spreadsheet to add them.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Paste as new rows at end of table';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Press Ctrl+V to add the copied rows at the bottom of this table. Press Esc to cancel.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Rows in this paste ({n}). Rows that fit in the table ({fit}). Add the other rows ({extra}) as new rows at the bottom?';
$ec_lang['lpn_pane_paste_overflow_add']='Add rows ({extra})';
$ec_lang['lpn_pane_paste_overflow_fit']='Paste only the rows that fit ({fit})';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Rows in this paste ({n}). Rows that fit in the table ({fit}). The other rows ({extra}) cannot be added as new rows: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='IDs that do not match ({n}). Paste anyway?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='Nothing was pasted. {reasons}';
$ec_lang['lpn_pane_paste_more']='Rows with problems not shown here: {n}.';
$ec_lang['lpn_pane_paste_no_id']='Row {row}: a new row needs an ID.';
$ec_lang['lpn_pane_paste_bad_id']='Row {row}: the ID {id} has a space or a quotation mark in it.';
$ec_lang['lpn_pane_paste_id_taken']='Row {row}: the ID {id} is already in use.';
$ec_lang['lpn_pane_paste_id_twice']='Row {row}: the ID {id} is used twice in this paste.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Row {row}: a new node needs both {first} and {second}.';
$ec_lang['lpn_pane_paste_no_ends']='Row {row}: a new link needs a From node and a To node.';
$ec_lang['lpn_pane_paste_no_node']='Row {row}: node {id} does not exist yet. Paste your nodes first, then your links.';
$ec_lang['lpn_pane_paste_same_ends']='Row {row}: From and To are the same node.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Row {row}: {text} is not a valid {col}.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='Row {row}: a new Text needs both {first} and {second}.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='Row {row}: {id} is not a node or a pipe in this network yet. Paste it first, then this Text.';
$ec_lang['lpn_pane_paste_customer_no_position']='Row {row}: a new Customer needs both {first} and {second}.';
$ec_lang['lpn_pane_paste_shape_no_points']='Row {row}: a new Shape needs its Points.';
// {pair} is the Points heading's own pair in this project's axis words: X/Y, N/E or Lat/Lon.
$ec_lang['lpn_pane_paste_shape_bad_points']='Row {row}: {text} is not a list of points. Write each point as {pair}, with a point (.) as the decimal mark, and separate the points with |.';
$ec_lang['lpn_pane_paste_shape_closed_few']='Row {row}: a closed Shape needs at least three points.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Row {row}: a new Customer needs a connected pipe or node.';
$ec_lang['lpn_pane_paste_no_pipe']='Row {row}: pipe {id} does not exist yet. Paste your pipes first, then your customers.';
$ec_lang['lpn_pane_paste_no_customer_node']='Row {row}: node {id} does not exist yet. Paste your junctions first, then your customers.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Row {row}: node {id} has no pipe for a Customer to attach to.';
$ec_lang['lpn_pane_filled']='Filled down cells ({n}). Cells not changed ({skipped}).';
$ec_lang['lpn_pane_filldown']='Fill down';
$ec_lang['lpn_pane_delete_element']='Delete element';
$ec_lang['lpn_pane_delete_elements']='Delete elements';
$ec_lang['lpn_pane_fill_none']='Nothing in this selection can be filled down.';
$ec_lang['lpn_pane_ctrlenter_filled']='Filled cells ({n}). Cells not changed ({skipped}).';
$ec_lang['lpn_pane_hide_col']='Hide this column';
$ec_lang['lpn_pane_hide_cols']='Hide these columns';
$ec_lang['lpn_pane_show_all_cols']='Show all columns';
$ec_lang['lpn_pane_sort_asc']='Sort ascending';
$ec_lang['lpn_pane_sort_desc']='Sort descending';
$ec_lang['lpn_pane_manage_cols']='Manage columns…';
$ec_lang['lpn_pane_manage_cols_title']='Manage columns';
$ec_lang['lpn_pane_manage_cols_show']='Show';
$ec_lang['lpn_pane_manage_cols_up']='Move up';
$ec_lang['lpn_pane_manage_cols_down']='Move down';
$ec_lang['lpn_pane_manage_cols_top']='Move to beginning';
$ec_lang['lpn_pane_manage_cols_bottom']='Move to end';
$ec_lang['lpn_pane_manage_cols_width']='Width (em)';
$ec_lang['lpn_pane_width_tip']='Column widths are saved in this browser, not in the project. Double-click a column divider to restore the default width.';
$ec_lang['lpn_pane_colmenu_tip']='Hide or manage columns';
$ec_lang['lpn_tool_area_window']='Select a window';
$ec_lang['lpn_tool_area_lasso']='Select a lasso';
$ec_lang['lpn_tool_area_polygon']='Select a polygon';
$ec_lang['lpn_tool_delete']='Delete';
$ec_lang['lpn_tool_zoom_extent']='Zoom to fit';
$ec_lang['lpn_tool_zoom_selection']='Zoom to selection';
$ec_lang['lpn_tool_zoom_window']='Zoom Window';
$ec_lang['lpn_zoom_in']='Zoom in';
$ec_lang['lpn_zoom_out']='Zoom out';
$ec_lang['lpn_new_text']='Text';
$ec_lang['lpn_field_text_bold']='Bold text';
// Justification for a Text object (Task 342). **The standard terms, and nothing invented** (Tom,
// 2026-08-17: "standard English usage would be better... Horizontal justification and Vertical
// justification; you don't even have to mention the anchor point").
//
// **NO SYNONYM ENTRY, and the reason is a rule rather than an omission** (Tom, 2026-08-18: "no syn.
// It's a technical term. We can only give a definition, which is not our job."). A plain sentence
// (dev/plain-sentences.md, then $ec_lang_syn) holds phrases that could STAND ON THE CONTROL in place of the label; a technical term has no such
// alternatives, and what a first draft put there was a definition wearing a synonym's clothes.
// The Text table's own column naming what a Text is attached to (a node or a link ID), read-only:
// attaching and detaching are map gestures, never a typed rename.
$ec_lang['lpn_field_text_anchor']='Attached to';
$ec_lang['lpn_field_text_align']='Horizontal alignment';
$ec_lang['lpn_field_text_align_left']='Left';
$ec_lang['lpn_field_text_align_center']='Centre';
$ec_lang['lpn_field_text_align_right']='Right';
$ec_lang['lpn_field_text_valign']='Vertical alignment';
$ec_lang['lpn_field_text_valign_top']='Top';
$ec_lang['lpn_field_text_valign_middle']='Middle';
$ec_lang['lpn_field_text_valign_bottom']='Bottom';
$ec_lang['lpn_field_text_rotation']='Angle (degrees)';
$ec_lang['lpn_field_text_match_pipe']='Turn to the angle of the nearest link';
$ec_lang['lpn_field_text_flip']='Turn 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Attached asset';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='This text was placed close enough to an asset to follow it, so it moves with that asset and has a leader. A text on a leader takes its horizontal and vertical alignment from the side it sits on, which is why those two rows are not offered while it is attached.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Emitter coefficient';
$ec_lang['lpn_field_emitter_tip']='An extra outflow that depends on pressure, for a sprinkler, an open outlet, or a modeled leak. The flow it releases is this coefficient times the pressure raised to the emitter exponent, which is set once for the whole network under Settings, Calculation, Hydraulics. Leave it blank on an ordinary junction.';
$ec_lang['lpn_field_elev']='Elevation';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of a plain-sentence
// entry carrying translatable payload nobody on the page can see.
// A reservoir carries an elevation AND a head. Leaving the head blank means "the water surface is
// at the reservoir's own elevation"; the placeholder string is what shows in that empty box.
// This USED to read "so it doubles as a tank" (Tom, 2026-07-30), which was true only while there
// was no tank. Since Task 248 there is one, and the two are different assets: a reservoir's level
// never moves, a tank's does. Raising a reservoir's head is still a legitimate thing to do -- it is
// just not how you model storage any more.
$ec_lang['lpn_field_head']='Head';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Water surface level in the reservoir, measured as a height, not as a pressure. Leave it blank to put the water surface at the reservoir elevation.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
// A tank has two elevations (Tom, 2026-10-11): Elevation is the ground, the pressure datum as at a
// junction; Base elevation is the tank bottom, EPANET's [TANKS] Elevation, from which depth and
// volume are measured.
$ec_lang['lpn_field_tank_base_elev']='Base elevation';
$ec_lang['lpn_field_tank_base_elev_tip']='Elevation of the tank bottom, from which water depth and volume are measured. Left blank, the bottom is at the ground elevation.';
$ec_lang['lpn_tank_ground_elev_tip']='Ground elevation at the tank. Pressure at the tank is measured from here, as at a junction.';
$ec_lang['lpn_field_tank_level']='Water depth';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Depth of water in the tank, measured up from the tank bottom.';
$ec_lang['lpn_field_tank_minlevel']='Lowest water depth';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='Minimum allowable depth, measured up from the tank bottom.';
$ec_lang['lpn_field_tank_maxlevel']='Highest water depth';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='Maximum allowable depth, measured up from the tank bottom.';
$ec_lang['lpn_field_tank_diameter']='Tank diameter';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='For a vertical cylinder. Same units as elevation, not pipe diameter. It sets how much water a given depth holds.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Water surface elevation in the tank: the base elevation plus the water depth.';
$ec_lang['lpn_close']='Close';
// The corner buttons beside every standing box's X (Task 441). Each is an icon-only button, so the
// value is its name: the hover tip and the screen reader's label at once. Auto-hide is a toggle and
// says its state through aria-pressed, so one wording serves both states (AutoCAD's own word).
$ec_lang['lpn_dock_left']='Dock at the left of the map';
$ec_lang['lpn_dock_right']='Dock at the right of the map';
$ec_lang['lpn_dock_float']='Float';
$ec_lang['lpn_dock_autohide']='Auto-hide';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Properties';
// What a docked Properties box says while nothing is selected: it stays in its dock (Tom, 2026-10-07).
$ec_lang['lpn_popup_none']='Nothing is selected. Select an asset on the map to see its properties.';
$ec_lang['lpn_empty_hint']='Use File, New project to open an example. Or start by adding a reservoir, junction, and pipe from the toolbar.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='Your network is intact.';
// The examples gallery (ROADMAP Task 314). lpn_empty_hint above is no longer rendered by the page
// -- the empty canvas shows the gallery instead -- but the key is KEPT rather than deleted while
// the gallery is new: it is the fallback sentence if the manifest cannot be fetched, and deleting
// a key translated into 26 languages to get it back a week later is the expensive direction.
// **THE ENGINE CLAUSE IS GONE FROM THIS BANNER** (Task 605, Tom 2026-09-06: *"No more banner about
// the EPANET solver."*). It read "with the EPANET solver" and was, under Task 222, the one place
// this page said what engine it runs. EPANET is now simply what solves, so a banner announcing it
// advertises a choice the visitor is no longer being asked to make. The gallery keeps its welcome;
// lpn_main_title still names EPANET, which is where a search engine reads it, and that claim is
// true and stays.
$ec_lang['lpn_examples_welcome']='Welcome to water supply network modelling';
$ec_lang['lpn_examples_heading']='Open a copy of an example';
$ec_lang['lpn_examples_sub']='Each example opens as a copy. Edit and save it, or open a new copy to start again.';
$ec_lang['lpn_examples_open']='Open';
$ec_lang['lpn_examples_menu']='Open example…';
$ec_lang['lpn_examples_blank']='Or start here';
// The SAME exit, worded for the other way in, is lpn_close (Task 699 merged its own 'Close' key
// into it). Opened from File the user already has work on screen, so "start with a blank map"
// reads as "discard it" and they do not dare press the only button that leaves (Tom, 2026-08-17:
// "I can't back out of the gallery... I am forced to open an example"). Closing never touches a
// project either way.
$ec_lang['lpn_examples_size']='Nodes: {nodes}, links: {links}';
$ec_lang['lpn_examples_failed']='The examples could not be loaded. Use File, New project to start a drawing.';
$ec_lang['lpn_examples_loading']='Loading examples…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Fix something';
$ec_lang['lpn_help_notes']='Notes on this page';
$ec_lang['lpn_guide_about_heading']='About this calculator';
$ec_lang['lpn_guide_group_from']='From {menu}';
$ec_lang['lpn_guide_menu_named']='{menu} menu';
// **THE NEW BOX, TASK 745** (Tom, 2026-09-29: reorganize Help into three groups, with a new
// "Tables and Hotkeys" box gathering all table help and all keyboard shortcuts). One key names
// both the Help row and the box's own title bar, the same pattern lpn_help_notes already carries
// for the Notes box.
$ec_lang['lpn_help_hotkeys']='Tables and Hotkeys';
// **THE USER GUIDE** (Tom, 2026-10-06: "Maybe items 2 and 3 combined into a simple User Manual or
// whatever the 2026 thing is?"; Ida's design). Names both the Help row and the box's title bar. It
// replaces lpn_help_hotkeys and the Help > Toolbar fly-out (lpn_help_icons, which still heads the
// box's Toolbar section).
$ec_lang['lpn_help_manual']='User manual';
// The Guide's contents rail, its search, its Boxes section and the "?" in every box's title bar.
$ec_lang['lpn_guide_contents']='Contents';
$ec_lang['lpn_guide_rail_hide']='Hide contents';
$ec_lang['lpn_guide_rail_show']='Show contents';
$ec_lang['lpn_guide_search']='Search the user manual';
$ec_lang['lpn_guide_boxes_heading']='Boxes';
$ec_lang['lpn_guide_boxes_intro']='Each box can be moved, resized, docked at the left or right of the map, or closed. The ? in a box\'s title bar opens its help.';
// Tom's own wording, 2026-10-07 (his typo "to not" corrected). Below lpn_guide_boxes_intro.
$ec_lang['lpn_guide_boxes_autohide']='When the pointer leaves, a box without focus hides after a short delay. A box with focus hides when you click outside it, press Esc, or Tab out of it with the pointer elsewhere.';
$ec_lang['lpn_guide_box_help']='Help for this box';
// A Boxes entry whose box shares its name with a section of the Guide ("Screenshot"), in the Guide
// only, so its Contents list does not show one word twice. Keep {box} as it is.
$ec_lang['lpn_guide_box_named']='{box} box';
// Above the Toolbar rows, shown only while some are dimmed (on a phone, or Calculate while
// Recalculate automatically is on): a grey name otherwise reads as a disabled button.
$ec_lang['lpn_guide_dimmed']='A dimmed name is a button that is currently hidden on the toolbar.';
// One entry in the Guide's Boxes section for each box, shown by the "?" in its title bar. Fire flow,
// Critical assets, and Demand scaling carry theirs in lpn_ff_intro and the keys that follow it.
$ec_lang['lpn_guide_text_popup']='Shows the properties of the selected asset, Text, or Customer, or of several selected assets. The box opens beside the selection or where it was last moved. An edited value changes the network at once, and the asset\'s map label and the Tables pane are updated. Calculated results are shown as read-only rows and cannot be edited.';
$ec_lang['lpn_guide_text_find_popup']='Finds the assets that meet a condition, such as every pipe smaller than 8 in. or every junction below 40 psi, and can change one property on all of them in one operation. Use it to check a model before it is solved (a missing elevation, a diameter entered in the wrong unit), to list problem locations after it is solved (low pressure, high velocity), and to make one correction on many assets.\n\nThe What to search, Property, Condition, and Value lists build one condition and write it as a line of text in the Query box. The line can also be edited directly, and the lists follow it. A query that the lists cannot express, such as two conditions joined by OR, hides the lists until the Use the controls instead button is pressed. To search, press Enter in the Query box or press the Find button.';
$ec_lang['lpn_guide_text_settings_box']='Holds the settings of the open project and of this browser, arranged in sections. Choose Water, Settings to open it. Two buttons, Restore defaults and Start fresh, reset them. The box is searchable: type one or more words in Search settings to list only the settings that mention all of them. The position and size of this box are kept in this browser only.';
$ec_lang['lpn_guide_text_library_box']='Holds the project\'s patterns, curves, pipe types, fittings lists, controls, and rules, one section each. Choose Water, Libraries to open it. An asset refers to a pattern, curve, pipe type, or fittings list by the ID of that item, and the item is created, edited, and deleted here. All are saved with the project, and Undo reverses an edit made here. The position and size of the box are kept in this browser only.';
$ec_lang['lpn_guide_text_energy_box']='Reports the energy use, peak power, and cost of each pump over the last extended period simulation, using each pump\'s efficiency and the energy price set under Settings, Energy. It needs a Total run time in Settings and a solved network. It does not change the network.';
$ec_lang['lpn_guide_text_contour_box']='Controls the contour plot drawn on the map from the node value chosen in Color nodes by: the color scheme, the fill and its opacity, the contour line interval and labels, and how far the color reaches from each pipe. Turning it off hides the plot and leaves the node colors. It changes only the display, not the network.';
$ec_lang['lpn_guide_text_scncmp_box']='Solves each scenario that is checked in the Scenario manager, all of them unless checks have been cleared, from a copy of the drawing, and tabulates for each the number of overrides, the demand multiplier, the total run time, the hydraulic time step, the lowest pressure, and the highest velocity. Choose Water, Reports, Scenario comparison to open it. The comparison starts when it opens and starts again after each edit while it remains open.\n\nIt does not change the project, and the scenario that is open is left as it was.';
$ec_lang['lpn_guide_text_rptbox']='Shows the text report written by the EPANET engine for the last extended period simulation, including its warnings and the network summary. Each extended period simulation replaces it; a solve at a single instant does not, and an edit leaves the previous report in place.';
$ec_lang['lpn_guide_text_status_box']='Lists, in time order, each change during the last extended period simulation: a pump, valve, or pipe opening or closing, a tank starting to fill or empty or becoming full or empty, and any time step that did not fully converge. Only changes are listed, not every time step.';
$ec_lang['lpn_guide_text_full_box']='Lists every node and every link at every reporting time step, in the units shown on the Tables pane. Without an extended period simulation, it shows the current solution at a single instant. Download or print carries every time step, and the table shows one at a time.';
$ec_lang['lpn_guide_text_calib_box']='Compares a file of field measurements with the calculated results at the same locations and times, one file for each parameter. The file is held for the current session only and is not saved with the project.';
$ec_lang['lpn_guide_text_hotkeys_popup']='The user manual. Its sections are Using the user manual, Toolbar, Menus, Map, Screenshot, Tables, Boxes, About this calculator, and Notes on this page. Toolbar and Menus list every toolbar button and menu row with its keyboard shortcut, Boxes has an entry for each box, and the other sections state what the page does. Choosing a row shows where that control is; it never runs it. Press Ctrl+K to search, or press / while the user manual has focus. Ctrl+K does not search while a question is open.';
// The Find and replace chapter beyond its opening paragraphs, in the Guide's Boxes section
// (Tom, 2026-10-07). Each _def is HTML: keep the tags. A query inside <code> runs as written in
// English on a page in any language; translate it with the words the Find box shows in your
// language, or leave it in English. Asset IDs (60, 247, 330) and the numbers are measured on Net1
// and Net3 by dev/lpn-spike/user-guide-find-harness.js: never change them in translation.
$ec_lang['lpn_guide_find_query_term']='The query language';
$ec_lang['lpn_guide_find_query_def']='<table class="lpn-notes-table"><tbody><tr><td><code>Scope.Property condition value</code></td><td>One condition. The scope is Everything, Junction, Reservoir, Tank, Pipe, Pump, Valve, Text, Customer, or Source. The property is any entry in the Property list for that scope.</td></tr><tr><td>Conditions</td><td>equal to, above, below, contains, n highest, n lowest, and empty. Contains applies to text only. In n highest and n lowest, n is a count, as in 5 highest. If the Value box is empty or n is the letter n itself, as in <code>Pipe.Velocity n highest</code>, 10 assets are listed. Empty finds the assets that have no value for the property. Connectivity has four conditions and takes no value.</td></tr><tr><td>Values</td><td>A number is entered without its unit, in the unit shown in Properties and on the Tables pane: 40, not 40 psi. Text, including an ID, is enclosed in single or double quotes: <code>\'60\'</code>.</td></tr><tr><td>AND, OR, and parentheses</td><td>AND is evaluated before OR, and parentheses group conditions. NOT is not available.</td></tr><tr><td>Spelling</td><td>Words are not case sensitive. The English words are accepted in every language, so a query copied from this user manual runs on a page in any language.</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_examples_term']='Examples on Net3';
$ec_lang['lpn_guide_find_examples_def']='<p>Open the Net3 example to follow these. Pressure is in psi and velocity in ft/s.</p><table class="lpn-notes-table"><tbody><tr><td><code>Everything.ID equal to \'60\'</code></td><td>Junction 60 and Pipe 60. A junction and a pipe can have the same ID, so an ID search under Everything can return more than one asset.</td></tr><tr><td><code>Junction.Pressure below 40</code></td><td>Junctions 10, 40, 50, 20, and 153, lowest pressure first. Junction 10 is at -0.6 psi, a negative pressure that requires review.</td></tr><tr><td><code>Pipe.Velocity 5 highest</code></td><td>Pipes 60, 329, 125, 123, and 149, highest velocity first. Pipe 60 carries 9.3 ft/s.</td></tr><tr><td><code>Junction.Pressure below 20 OR Pipe.Velocity above 5</code></td><td>Junctions 10, 20, 40, and 50, and Pipes 60, 125, and 329: low pressures and high velocities in one list.</td></tr><tr><td><code>Junction.Pressure below 40 AND Junction.Elevation above 100</code></td><td>Junctions 10, 20, 40, and 50, the low pressures on high ground. Both conditions must name the same kind of asset: <code>Junction.Pressure below 40 AND Pipe.Velocity above 3</code> matches nothing, because no asset is both a junction and a pipe.</td></tr><tr><td><code>Pipe.Closed equal to \'closed\'</code></td><td>Pipe 330, the one pipe that is closed in the Net3 file.</td></tr><tr><td><code>Junction.Connectivity no open path to a source</code></td><td>Nothing, as the file is distributed. With Pipe 247 closed (see Replace and Undo), Junctions 215, 217, 219, and 225: the junctions that a break on Pipe 247 would leave without supply. Repeating this for each pipe is a criticality analysis.</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_results_term']='Results, the selection, and Tables';
$ec_lang['lpn_guide_find_results_def']='<p>The matching assets are listed below the Find button. Above and n highest list the highest value first, below and n lowest the lowest value first, and other conditions list by the value found, then by ID. A query with AND or OR lists nodes, then links, each by ID. A single match is shown on the map immediately. Select a row to center the map on that asset. If nothing is selected, the asset is also selected; if something is, the asset is highlighted and the selection is not changed. Shift+click or Ctrl+click a row to add it to the selection or remove it. Find does not select all matches by itself.</p><p>The Filter in table button applies the same query to the Tables pane. Each table that the query applies to shows only the matching rows, with the query and the row count above them. To select all matches on the map, select those rows and choose Select on map from the right-click menu. A table filter is not saved with the project and ends when the page is reloaded. A row edited so that it no longer matches stays in the table, dimmed and marked with a warning sign, until the Filter in table button is pressed again.</p>';
$ec_lang['lpn_guide_find_replace_term']='Replace and Undo';
$ec_lang['lpn_guide_find_replace_def']='<p>The Change what was found part of the box writes one property on every asset the query found. Choose the property in the Property to change list, enter the new value in the New value box in the displayed unit, and press the Replace button. The box then states how many assets would change, not counting those that already have the new value. Press the Change them button to apply the change, or Cancel. One Undo reverses the whole replacement.</p><p>Example on Net1: <code>Pipe.Diameter below 10</code> finds Pipes 31, 122, 113, and 121. Choose Diameter, enter 10, and press Replace; the box shows "Change 4 assets?". Press Change them to set all four pipes to 10 in. One Undo returns them to 6 and 8 in.</p><p>Example on Net3: <code>Pipe.ID equal to \'247\'</code> finds Pipe 247. Choose Closed, choose Closed again in the New value list, and press Replace, then Change them, to close the pipe for the connectivity example above. Undo opens it again.</p><p>Replace requires one kind of asset, so under Everything, first choose a kind of asset in the What to search list. In a scenario other than Base, a replacement is stored in that scenario, as the same edit in Properties would be. Where Mapbox elevations are available, Elevation can be replaced from the Mapbox DEM instead of a typed value.</p>';
$ec_lang['lpn_guide_find_notes_term']='Points to note';
$ec_lang['lpn_guide_find_notes_def']='<ul><li>Values are compared at full precision and listed to four decimal places. Equal to rarely matches a calculated result; use above and below.</li><li>Pressure, head, flow, velocity, and the other results are those of the last calculation. With the Recalculate automatically setting cleared, they describe the network as it was at the last Calculate.</li><li>Above and below on text use dictionary order, with numbers in numeric order: on Net1, <code>Junction.ID above \'20\'</code> finds Junctions 21, 22, 23, 31, and 32.</li><li>Under Everything, only ID, Description, Tag, and Connectivity are offered. Choose a kind of asset in the What to search list to see its full list of properties.</li><li>A Text item has no ID. Search it by its words, as in <code>Text.Text contains \'pump\'</code>.</li><li>The four Connectivity conditions for a node are no links at node, no open links at node, no link path to a source, and no open path to a source. A source is a reservoir or a tank.</li></ul>';
// The Scenarios chapter, in the entry for the Scenario manager box (Task 785). Written from the code of
// feat/bentley-interop and held by dev/lpn-spike/user-guide-scenarios-harness.js. The box's own help
// (lpn_sm_help, Tom's wording of 2026-10-16) comes first in the entry; nothing here restates or
// contradicts it. Terms follow the Find and replace chapter's pattern.
$ec_lang['lpn_guide_scn_use_term']='What a scenario is for';
$ec_lang['lpn_guide_scn_use_def']='<p>Scenarios save many designs, views, or situations in the same project, such as average day, maximum day, peak hour, a report presentation figure, a main out of service, or a proposed replacement. The network is drawn once, in the Base scenario. Every other scenario holds only its overrides, the values that differ from the scenario it inherits from, and reads everything else from that scenario. An edit to Base therefore reaches every scenario that has not overridden that value.</p><p>A new project starts with six ready-made scenarios: 1. Flow test: Static, 2. Flow test: Mid, 3. Flow test: Max, 4. Average Day, 5. Max Day, and 6. Peak hour. They are ordinary scenarios that can be renamed, edited, and deleted. Each starts with one override, its demand multiplier: 1 for the flow tests and Average Day, 2 for Max Day, and 3 for Peak hour. The multipliers are placeholders to be replaced with values for the system being modeled. A project opened from a file, including each example, or imported from an EPANET file has Base alone.</p><p>Fire flow is checked with the Fire flow analysis, which tests every junction or the selected junctions. Max Day is the scenario normally open when it is run.</p>';
$ec_lang['lpn_guide_scn_open_term']='The open scenario';
$ec_lang['lpn_guide_scn_open_def']='<p>The Scenario button in the status strip below the map names the open scenario and counts its overrides, as in Scenario: Base | No. of overrides: 0. Click it, or choose Water, Scenarios, to switch scenarios or to add, copy, rename, or delete one. Each scenario in the list shows its number of overrides in parentheses, and a check mark is at the open one. The Scenario manager row opens the tree of scenarios and alternatives. It is dimmed while Basic mode is checked.</p><p>The drawing, the labels, Properties, Tables, and the results all belong to the open scenario, and the page solves the open scenario only. Scenario comparison, described in its own entry, solves the others from copies. The open scenario is saved with the project.</p>';
$ec_lang['lpn_guide_scn_marks_term']='Where overrides show';
$ec_lang['lpn_guide_scn_marks_def']='<p>On the map, an asset that has an override in the open scenario is ringed in amber, and an asset that inherits an override from a parent scenario or alternative is ringed with a dashed gray line. For demand, diameter, roughness, minor (local) loss coefficient, and length, a ring appears only while Settings, Symbology, Node labels or Link labels shows that value on the map; an override of any other property always has its ring. In Tables, a cell that holds a value set by the open scenario is amber, and its tip names the alternative that holds it, as in Physical alt.: Larger main. Show scenarios, in the cell menu of a table, lists every asset once for each scenario.</p><p>Each row of Properties that a scenario can override has a mark at its left. A solid dot means the open scenario overrides the value; click it to clear the override. A hollow dot means the value is inherited; click it to make the value shown an override. A triangle means scenarios below this one override the value; click it to clear their overrides, after a confirmation. Beneath an overridden row is the inherited value it replaces, as in Base scenario: 18. The Settings box has the solid dot and the triangle only, because typing a value there is what makes an override.</p><p>To hide the rings, clear Show override markers on the map in Settings, Map and page, Page, or choose Map, Clean map. Both are kept in this browser, not in the project. Tables marks overrides either way.</p>';
$ec_lang['lpn_guide_scn_make_term']='Making and clearing overrides';
$ec_lang['lpn_guide_scn_make_def']='<p>With a scenario other than Base open, an edit to a value that scenarios can override is stored as an override in the open scenario, however it is made: typing in Properties, editing a cell in Tables, Replace in Find and replace, dragging a node or entering its coordinates, Morph (the new type is the override), or Paste properties to selection. A setting typed in the Settings box is stored as an override when scenarios can override that setting. Base is not changed. In Base, the same edits change the network itself and reach every scenario that has not overridden the value.</p><p>Delete acts differently. In a scenario, Delete does not remove an asset that exists in Base. It makes the asset inactive in the open scenario, and for a node also its pipes, and a message states this. The asset is still in the drawing and in the other scenarios. An asset drawn while a scenario is open is inactive in Base and active in that scenario, and Delete in that scenario removes it. Deleting an asset in Base also deletes its overrides in every scenario, after a question that counts them. Customers and Shapes belong to no scenario and are deleted outright.</p><p>The Override manager row of the Scenarios list opens a list of every override of the open scenario by category, each beside the inherited value it replaces. A time series graph on the map that the scenario opened, moved, or changed is a row of its own. Check rows and click Clear selected overrides, click Clear override in one row, or click Clear all overrides. Each value then returns to the inherited value, and Undo reverses it. Select an ID in the list to go to the asset on the map. The dot in Properties and the Clear override row in the cell menu of Tables clear one override at a time.</p>';
$ec_lang['lpn_guide_scn_scope_term']='What a scenario can and cannot override';
$ec_lang['lpn_guide_scn_scope_def']='<table class="lpn-notes-table"><tbody><tr><td>Properties</td><td>Every property of a node or link except those listed below, including its position, whether it is active, and its type (Morph). A Text can override its words, position, size, alignment, bold, angle, and whether it is shown. A custom property can always be overridden. The properties are held in the categories Physical, Demand, Active topology, Initial settings, Constituent, Fire flow, Energy cost, Custom properties, Text, Presentation, and Calculation.</td></tr><tr><td>Settings</td><td>The settings saved with the project, except those listed below: the calculation options (for example the demand multiplier, total run time, hydraulic time step, and friction method), the default demand pattern, the values given to new assets, and the presentation settings (sizes, colors, labels, contours, the map view, and the time series graphs on the map).</td></tr><tr><td>The same in every scenario</td><td>The ID, Description, and Tag of an asset; the end nodes and bends of a link; Customers and Shapes; the units and the coordinate system; and the contents of the Libraries (patterns, curves, pipe types, fittings lists, controls, and rules). An edit to any of these changes every scenario. A scenario can point an asset at a different curve, pipe type, fittings list, or pattern, but cannot change what is in them.</td></tr></tbody></table>';
$ec_lang['lpn_guide_scn_example_term']='Example on Net1';
$ec_lang['lpn_guide_scn_example_def']='<p>Open the Net1 example. Choose Water, Scenarios, New scenario…, type Larger main, and click OK. Select Pipe 10 on the map and enter 24 for Diameter in Properties; Base has 18 in., shown beneath the field as Base scenario: 18. Choose Base in the Scenarios list, choose New scenario… again, type Max day, and enter 1.8 for Demand multiplier in Settings, Calculation, Hydraulics. Then choose Water, Reports, Scenario comparison.</p><table class="lpn-notes-table"><tbody><tr><td>Scenario</td><td>No. of overrides</td><td>Demand multiplier</td><td>Lowest pressure</td><td>Highest velocity</td></tr><tr><td>Base</td><td>0</td><td>1</td><td>108 psi at N32, 14:00</td><td>2.76 ft/sec at L11, 16:00</td></tr><tr><td>Larger main</td><td>1</td><td>1</td><td>109 psi at N32, 14:00</td><td>2.87 ft/sec at L11, 16:00</td></tr><tr><td>Max day</td><td>1</td><td>1.8</td><td>15.77 psi at N32, 9:00</td><td>3.49 ft/sec at L10, 8:00</td></tr></tbody></table><p>The total run time is 24:00 in all three, so each lowest pressure and highest velocity is the extreme over the day, at the time shown. The larger main raises the lowest pressure by about 1 psi. A multiplier of 1.8 lowers it to 15.77 psi at 9:00, and the highest velocity moves to Pipe 10. Each scenario holds one override, and Base keeps its values.</p>';
$ec_lang['lpn_guide_scn_notes_term']='Points to note';
$ec_lang['lpn_guide_scn_notes_def']='<ul><li>An override equal to the inherited value is still an override. It is counted, and Override manager marks it (same).</li><li>Basic mode is a setting for this browser, not for the project. It is disabled for a project whose scenarios and alternatives it cannot show. Alternatives and the Scenario manager are described in the help at the top of this entry.</li><li>Undo keeps 20 steps. Each step restores the scenarios and the open scenario along with the drawing, so adding, renaming, and deleting a scenario can be undone.</li><li>Exporting an EPANET file writes the open scenario only, with the values and node positions that scenario reads. The scenarios themselves are recorded in the project file only.</li></ul>';
// The Scenario comparison chapter beyond its opening paragraphs (lpn_guide_text_scncmp_box), copied into
// the box's entry by renderGuideBoxes() from <template id="lpn_guide_more_lpn_scncmp_box">. Task 785.
$ec_lang['lpn_guide_cmp_cols_term']='What the table holds';
$ec_lang['lpn_guide_cmp_cols_def']='<table class="lpn-notes-table"><tbody><tr><td>Scenario</td><td>The name of the scenario. The open scenario is marked (currently open).</td></tr><tr><td>No. of overrides</td><td>The overrides of the scenario itself, counted as in the Scenarios list. A calculation option such as the demand multiplier counts as one, and an override equal to the inherited value counts.</td></tr><tr><td>Demand multiplier, Total run time, Hydraulic time step</td><td>The values the scenario was solved under, its own or those of the project. A steady-state scenario shows a dash for the time step.</td></tr><tr><td>Lowest pressure</td><td>The lowest pressure at a junction, with its ID and the time it occurs. Reservoirs and tanks are left out because each has a fixed head.</td></tr><tr><td>Highest velocity</td><td>The highest velocity in a pipe or valve, with its ID and the time it occurs. Pumps are left out.</td></tr></tbody></table>';
$ec_lang['lpn_guide_cmp_run_term']='Steady-state and extended-period scenarios';
$ec_lang['lpn_guide_cmp_run_def']='<p>A scenario with a Total run time greater than 0 is run over the whole period through the EPANET engine. Its lowest pressure and highest velocity are the extremes over every time step, each shown with its time. A scenario with a Total run time of 0 is solved at one instant. The total run time is one of the options a scenario can override, so one table can hold both kinds.</p>';
$ec_lang['lpn_guide_cmp_notes_term']='Points to note';
$ec_lang['lpn_guide_cmp_notes_def']='<ul><li>A scenario that cannot be solved shows the reason in place of its two results, for example that a junction has no path to a source after a pipe is made inactive. The other scenarios are still solved. A scenario that did not converge shows its last results and a message.</li><li>The block above the table, The same in every scenario, states the friction method, units, accuracy, and maximum trials. A setting that differs between scenarios is left out of the block.</li><li>There is no pass or fail threshold. Read the numbers against the design criteria of the system being modeled.</li><li>The example given in the Scenario manager entry compares three scenarios on Net1.</li></ul>';
// The Libraries chapter, in the entry for the Libraries box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_library_box">. Written from the code and held by
// dev/lpn-spike/user-guide-library-harness.js.
$ec_lang['lpn_guide_lib_kinds_term']='What each section holds';
$ec_lang['lpn_guide_lib_kinds_def']='<table class="lpn-notes-table"><tbody><tr><td>Patterns</td><td>A list of multipliers that repeats for as long as a run lasts, one multiplier for each pattern time step. A new pattern is 24 multipliers of 1. Pasting a spreadsheet column fills the Multipliers box. The default demand pattern is marked (default) and is chosen in Settings, Calculation, Hydraulics.</td></tr><tr><td>Curves</td><td>Four kinds, chosen as the Curve type: Pump head, Pump efficiency, Tank volume, and Valve head loss. The points are entered in a grid that accepts a pasted spreadsheet column or lines copied from an EPANET file. A pump head curve is fitted through its points and the Equation line shows the fit; one point is read as the design point, with a shutoff head of 1.33334 times its head and a maximum flow of 2 times its flow, as EPANET reads it. The other kinds join their points with straight lines. A pump or valve states its curve in Properties, where the Curves link opens this section.</td></tr><tr><td>Pipe types</td><td>A definition of diameter, roughness, and reaction coefficients that several pipes refer to. A property may be left blank in the definition and then entered for each pipe. In Properties, the values a pipe type states are disabled, and Detach from pipe type copies them into the pipe and stops the pipe using the type.</td></tr><tr><td>Fittings</td><td>Lists of fittings with a quantity for each, added up to one minor (local) loss coefficient, k, for a pipe or pipe type. The fittings offered are the thirteen in Table 3.3 of the EPANET 2.2 user manual and Other fitting. Choosing one copies its coefficient into the row, where it can be changed.</td></tr><tr><td>Controls</td><td>One statement each, in EPANET syntax, as in <code>LINK id OPEN IF NODE id BELOW value</code>. Under each, the box states whether it was understood.</td></tr><tr><td>Rules</td><td>Several lines each, in EPANET syntax: RULE, IF, AND, OR, THEN, ELSE, and PRIORITY. Under each, the box states whether it was read.</td></tr></tbody></table>';
$ec_lang['lpn_guide_lib_refs_term']='Renaming, deleting, and what refers to an item';
$ec_lang['lpn_guide_lib_refs_def']='<p>An ID is changed in its section. A blank ID, or an ID already used in the same section, is not accepted. Renaming an item moves every reference to it, in Base and in every scenario. For a pattern, the references are a junction\'s demand pattern and the pattern of each of its demand categories, a Customer\'s demand pattern, a reservoir\'s head pattern, a pump\'s speed pattern, and the default demand pattern.</p><p>A pattern that is in use can be deleted, and each reference to it is cleared. If it was the default demand pattern, a notice states what junctions with no pattern use now. A curve, pipe type, or fittings list that is in use is not deleted. The message names the assets that use it, and each must be given another curve, or detached from the type or list, first.</p>';
$ec_lang['lpn_guide_lib_scn_term']='Libraries and scenarios';
$ec_lang['lpn_guide_lib_scn_def']='<p>The Libraries are the same in every scenario. A scenario can point an asset at a different curve, pipe type, fittings list, or pattern, which is an override of that asset, but the contents of an item are not overridden. An edit to a pattern, curve, pipe type, fittings list, control, or rule changes it for every scenario, whichever scenario is open. The default demand pattern is a setting rather than an item, and a scenario can have its own.</p><p>A control or rule that names an asset which is inactive in the open scenario is ignored in that scenario\'s run, and the Libraries box lists it. One that names an asset the project does not have is also ignored, with a warning.</p>';
$ec_lang['lpn_guide_lib_ctl_term']='Controls and rules in a run';
$ec_lang['lpn_guide_lib_ctl_def']='<p>A control is one statement. A rule is several lines that begin with RULE. Keywords are typed in English whatever the language of the page, and numbers are in the units of the project. Add a control starts from a statement built from the network, which is then edited into the one intended.</p><p>Controls and rules change a result only in an extended-period simulation, that is, when Total run time is greater than 0. A steady-state solution is not changed by either. Rules are applied by the EPANET engine only. Both are saved with the project and written to an EPANET file.</p>';
$ec_lang['lpn_guide_lib_import_term']='Importing libraries from another project';
$ec_lang['lpn_guide_lib_import_def']='<p>File, Import…, Libraries… opens another project file and copies whole libraries from it into this project. An item whose name is already used here is skipped and listed, so nothing already here is changed. A warning is shown when the file and the project state a quantity in different units, and the items are imported as written. Pipe types that refer to a fittings list this project does not have are listed; import the fittings library from the same file to resolve them.</p>';
$ec_lang['lpn_guide_lib_example_term']='Example on Net1';
$ec_lang['lpn_guide_lib_example_def']='<p>Open the Net1 example and choose Water, Libraries. Patterns holds pattern 1, Demand Pattern, with 12 multipliers 2:00 apart, covering 24:00, marked (default). Curves holds curve 1, Pump Curve for Pump 9, a Pump head curve with one point, 1500 gpm at 250 ft. Controls holds two statements: the first opens Link 9 when Node 2 falls below 110, and the second closes it when Node 2 rises above 140. Rules holds two rules that test the clock time and the level of Tank 2.</p><p>Choose Water, Calculate, and then Water, Reports, Status changes. Pump L9 is now closed at 10:00, now open at 15:00, and now closed at 21:00, and Tank N2 is now emptying at 22:00. In Controls, change 140 to 135 in the second control and choose Water, Calculate again. The last closing moves to 20:00, and Tank N2 is now emptying at 21:00.</p>';
$ec_lang['lpn_guide_lib_notes_term']='Points to note';
$ec_lang['lpn_guide_lib_notes_def']='<ul><li>A pattern repeats for as long as a run lasts, so it need not cover the whole run.</li><li>An EPANET file has no place for a pipe type or a fittings list. The file carries the numbers each pipe reads, and the export says which pipes were flattened.</li><li>The position and size of the Libraries box are kept in this browser. The items are saved with the project.</li></ul>';
// The Properties chapter, in the entry for the Properties box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_popup">. Held by dev/lpn-spike/user-guide-properties-harness.js.
$ec_lang['lpn_guide_prop_open_term']='Opening Properties';
$ec_lang['lpn_guide_prop_open_def']='<p>In Select mode, click a node, link, Text, or Customer to open Properties beside it, or where the box was last moved. Shift-click another asset to add it to the selection. With more than one asset selected, the box lists what can be set on all of them at once (see Several assets selected, below). A Shape has no Properties box, because its points are edited on the map.</p><p>The right-click menu of a node or link has Copy properties, Paste properties to selection, and Time series graph. On a touch screen, press and hold the asset for the same menu. Time series graph needs the results of an extended-period simulation.</p>';
$ec_lang['lpn_guide_prop_edit_term']='Editing a value';
$ec_lang['lpn_guide_prop_edit_def']='<p>A value takes effect when the field is committed, by leaving it or pressing Enter. It is read in the unit named in its label, with no conversion, and the map label, Tables, and the results follow. Calculated values are read-only rows with no box to type in. For a link they follow its inputs, and for a node they sit among them. They are the results of the last calculation, at the time shown, and with Recalculate automatically cleared they are those of the last Calculate.</p><p>A pipe that uses a pipe type shows the values the type states as disabled. Click Detach from pipe type to copy those values into the pipe and edit them there.</p>';
$ec_lang['lpn_guide_prop_id_term']='The ID';
$ec_lang['lpn_guide_prop_id_def']='<p>The ID is edited in the title bar. It cannot contain a space or a quotation mark, and a node\'s ID cannot be that of another node, nor a link\'s that of another link. A node and a link can have the same ID. A refused ID leaves the old one in place and shows a message. Renaming an asset carries its scenario overrides with it.</p>';
$ec_lang['lpn_guide_prop_scn_term']='In a scenario';
$ec_lang['lpn_guide_prop_scn_def']='<p>In a scenario other than Base, an edit to a value that scenarios can override is stored as an override of the open scenario, and the row is marked at its left. The Scenario manager entry describes the marks and lists what is the same in every scenario: the ID, Description, and Tag are. A Customer has no scenario values. Switching scenarios leaves Properties open on the same asset, showing the values of the scenario that is now open.</p>';
$ec_lang['lpn_guide_prop_multi_term']='Several assets selected';
$ec_lang['lpn_guide_prop_multi_def']='<p>The title reads, for example, 2 selected. The box has one section for each type of asset in the selection, headed by the name of the type and the number of assets of it, as in Pipes (2), and each section can be collapsed. A section lists the properties that Tables has as columns and that can be set on every asset in it. Results and values that a pipe type states are not listed. A row shows the value the assets share, or Various where they differ.</p><p>Typing a value into a row sets it on every asset of that type in the selection. A row that is not touched writes nothing. A notice states the count, as in Set Diameter (in) on 2., and one Undo reverses the whole row. In a scenario other than Base the values are stored as overrides.</p>';
$ec_lang['lpn_guide_prop_example_term']='Example on Net1';
$ec_lang['lpn_guide_prop_example_def']='<p>Open the Net1 example and click Pipe 10. Properties lists its inputs, from Description to Is active?, and then its results at the time shown: Flow 1866.2 gpm, Velocity 2.4 ft/sec, and Head loss 19.12 ft H2O.</p><p>Click Pipe 113 and Shift-click Pipe 31. The title reads 2 selected, the one section is Pipes (2), and Diameter shows Various, because Pipe 31 is 6 in. and Pipe 113 is 8 in. Enter 10 for Diameter. The notice reads Set Diameter (in) on 2., both pipes are 10 in., and one Undo returns them to 6 and 8 in.</p>';
// The Settings chapter, in the entry for the Settings box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_settings_box">. Held by dev/lpn-spike/user-guide-settings-harness.js.
$ec_lang['lpn_guide_set_where_term']='Sections, and where settings are saved';
$ec_lang['lpn_guide_set_where_def']='<p>The list at the left of the box jumps to a section or a sub-heading. The sections are Symbology (Node labels, Node colors, Link labels, Link colors, Customer, and All), Map and page (Appearance and Page), Assets (ID prefixes, Values, and Custom properties), Calculation (Units, Time, Hydraulics, Energy, and Quality), and Credits. Each sub-heading states whether its settings are Saved with the project or Saved in this browser. Everything is saved with the project except the settings under Page and one row in Hydraulics, Show the run progress box, which states Saved in this browser itself.</p><p>The Settings tab in Tables lists the same settings as rows, with their Category and Value, so a setting can also be found and audited there.</p>';
$ec_lang['lpn_guide_set_search_term']='Searching';
$ec_lang['lpn_guide_set_search_def']='<p>Type one or more words in Search settings to list only the settings that mention all of them, in the name or in the tip. A word that matches a heading shows every setting under that heading. For example, opacity lists Symbol opacity (0 to 1) and Background image opacity (0 to 1); opacity symbol lists the first alone; and sprinklers lists Emitter exponent, whose tip mentions sprinklers and whose name does not. The search changes no setting.</p>';
$ec_lang['lpn_guide_set_scn_term']='Settings in a scenario';
$ec_lang['lpn_guide_set_scn_def']='<p>In a scenario other than Base, a value typed for a setting that scenarios can override is stored as an override, and the row is marked with a solid dot. A triangle marks a setting that scenarios below the open one override. The Scenario manager entry lists which settings can be overridden. Units are the same in every scenario. Restore defaults is dimmed outside Base, and Apply these new-asset values to every existing asset is refused there, because it changes the drawing itself.</p>';
$ec_lang['lpn_guide_set_units_term']='Changing a unit';
$ec_lang['lpn_guide_set_units_def']='<p>Each quantity has its own unit in Units. When values in the project are entered in that unit, changing it asks a question first. Non-destructive keeps every number as typed and reads it in the new unit. Destructive rewrites the numbers by conversion, so the network stays physically the same, and the original numbers are lost unless Undo is used; one Undo restores the numbers and the unit. Cancel leaves everything as it was.</p><p>Example on Net1: choose mm for Diameter in Units. Destructive rewrites 13 values, and Pipe 10 reads 457.2 mm. Non-destructive leaves the 13 values alone, and Pipe 10 reads 18 mm.</p>';
$ec_lang['lpn_guide_set_assets_term']='New assets, and applying values to existing ones';
$ec_lang['lpn_guide_set_assets_def']='<p>ID prefixes and Values are for assets drawn from now on. They do not change assets already drawn. Apply to all, beside an ID prefix, gives every existing asset of that kind an ID that starts with the prefix; each keeps its number, and an ID that does not end in a number is not changed. Apply these new-asset values to every existing asset replaces those properties on every existing asset, after a question, but only for the properties whose labels are showing on the map. Undo reverses it.</p>';
$ec_lang['lpn_guide_set_reset_term']='Restore defaults and Start fresh';
$ec_lang['lpn_guide_set_reset_def']='<p>Restore defaults asks first, and then returns ID prefixes, new-asset values, solver settings, map appearance, legend position, and visible labels of the open project to their original values. The network is not changed, other projects are not affected, and one Undo puts the settings back.</p><p>Start fresh asks first, and then deletes every project, every background image, all settings, and the unit choices saved in this browser, and reloads the page as a new visitor would see it. It cannot be undone.</p>';
// The Toolbar chapter (Task 785), terms in the Toolbar section above its rows. Held by
// dev/lpn-spike/user-guide-toolbar-harness.js.
$ec_lang['lpn_guide_tb_row_term']='Reading a row';
$ec_lang['lpn_guide_tb_row_def']='<p>Each row is one toolbar button, in the order of the strip, with a rule between groups. A row shows the button\'s icon, name, and tip, then its keys. Where a menu row does the same thing, the row also shows the menu path after the words Also in. Clicking a row points at the button on the toolbar. It never runs the button. When the button is not on screen, the row opens the menu row that does the same thing.</p>';
$ec_lang['lpn_guide_tb_dim_term']='Dimmed names';
$ec_lang['lpn_guide_tb_dim_def']='<p>A dimmed name belongs to a button that is not on screen now. A button that is on screen is not dimmed, whether or not it can act at that moment. Calculate is dimmed while Recalculate automatically is checked, because the button appears only when that setting is cleared.</p><p>On a phone in tall mode, only the five run controls stay on the toolbar. Every other name is dimmed, and clicking one opens the menu row that does the same thing. The Bottom panel button has no menu row, so its row can only say that the control is not on screen.</p>';
$ec_lang['lpn_guide_tb_two_term']='Buttons with a corner triangle';
$ec_lang['lpn_guide_tb_two_def']='<p>Zoom to fit and Select a window have a small triangle in the lower-right corner. Pressing the button a second time, with nothing pressed between, changes it: Zoom to fit becomes Zoom Window, and Select a window cycles through the window, lasso, and polygon shapes. Clicking the corner of Zoom to fit enters Zoom Window at once, without fitting the view.</p>';
// The Menus chapter (Task 785), two terms after the ruled keys table. Held by dev/lpn-spike/user-guide-menus-harness.js.
$ec_lang['lpn_guide_mn_list_term']='Reading the menu list';
$ec_lang['lpn_guide_mn_list_def']='<p>The list is drawn from the menus themselves: File, Edit, Map, Water, and Help, each under its own heading, with the rows of a fly-out indented under the row that opens it and a rule between groups. It leaves out rows that are hidden now, headings inside a menu, and rows named from the project or the browser, such as scenario names. It goes one fly-out deep, and it has no entry for the Language menu. A row that is disabled now is still listed, with no mark to show that it is disabled. Clicking a row opens the menu and fly-out with that row pointed at. It never runs the row.</p>';
$ec_lang['lpn_guide_mn_kbd_term']='Menus from the keyboard';
$ec_lang['lpn_guide_mn_kbd_def']='<p>The letters after Alt+Shift are keys at fixed positions, F for File, E for Edit, M for Map, W for Water, H for Help, and L for Language, on every keyboard layout and in every language. After F10, the letter of a menu alone opens it, and Esc on the menu bar returns focus to where it was.</p><p>Rows that only a pointer can use have no letter, and the arrow keys skip them. They include Vertices, the three area selections, the Insert tools, Zoom Window, and Screenshot.</p>';
// The Map chapter (Task 785): terms after the ruled keys table. Held by dev/lpn-spike/user-guide-map-harness.js.
$ec_lang['lpn_guide_map_undo_term']='Undo and Redo';
$ec_lang['lpn_guide_map_undo_def']='<p>Ctrl+Z undoes the last change, and Ctrl+Y or Ctrl+Shift+Z redoes it. In a Tables cell, the keys belong to the project while the cell is only selected, and to the text of the cell once typing has begun. The page keeps the last 20 steps, in memory only, and switching projects clears them. A step restores the scenarios, the open scenario, and the units along with the drawing.</p>';
$ec_lang['lpn_guide_map_del_term']='Delete';
$ec_lang['lpn_guide_map_del_def']='<p>Delete or Backspace deletes the selection, except while typing in a field, where the key belongs to the field. With nothing selected, Delete says so, and Backspace does nothing. One Undo reverses the deletion of several assets. In a scenario other than Base, Delete does not remove an asset that exists in Base; the Scenario manager entry describes what it does.</p>';
$ec_lang['lpn_guide_map_esc_term']='Esc';
$ec_lang['lpn_guide_map_esc_def']='<p>An Esc that closes a menu, a pull-down, or a box does nothing else. The Properties, Settings, and Libraries boxes close only when focus is in the box and the pointer is over it. With none of those open, Esc returns the active tool to Select, and in Select it clears the selection. A half-drawn pipe takes one Esc to abandon and a second to return to Select. In a field, Esc belongs to the field.</p>';
$ec_lang['lpn_guide_map_letters_term']='Letters, digits, and zoom keys';
$ec_lang['lpn_guide_map_letters_def']='<p>W starts Zoom Window, A starts selecting an area (pressing A again cycles the window, lasso, and polygon), and F draws a Shape. The plus or equals key zooms in, and the minus key zooms out, by one wheel step. These keys and the digits 0 to 9 do nothing on the map when another key makes them a shortcut, such as Ctrl+C, do nothing while typing in a field, and leave the letters of an open menu to its rows. A digit typed on a selected Tables cell overwrites the cell instead of choosing a tool.</p>';
// The Tables chapter (Task 785): terms after the two ruled key tables. Held by dev/lpn-spike/user-guide-tables-harness.js.
$ec_lang['lpn_guide_tbl_tabs_term']='The tabs';
$ec_lang['lpn_guide_tbl_tabs_def']='<p>To open the pane, click the Bottom panel button or choose Water, Tables. Its tabs, left to right, are Junctions, Reservoirs, Tanks, Pipes, Pumps, Valves, Text, Customers, Shapes, Settings, Scenarios, Time series, Profile, Frequency, and Flow balance. The Scenarios tab is shown when Basic mode is cleared. Column width, order, and visibility are kept in this browser, not in the project.</p>';
$ec_lang['lpn_guide_tbl_cell_term']='Selecting, entering, and editing a cell';
$ec_lang['lpn_guide_tbl_cell_def']='<p>A cell is in one of three states. While it is only selected, the arrow keys move from cell to cell, and Ctrl+Z is the Undo of the project. Typing a character over a selected cell starts an entry: the typed text replaces the value, and an arrow key commits it and moves to the next cell. F2 or a double-click opens the cell to edit it: the caret is in the value, and the arrow keys move the caret. In an entry and in an edit, Ctrl+Z undoes the typing. Esc cancels the entry or edit and leaves the cell selected.</p>';
$ec_lang['lpn_guide_tbl_fill_term']='Filling, filters, and scenarios';
$ec_lang['lpn_guide_tbl_fill_def']='<p>Ctrl+D fills a selected range down from its top row, and Ctrl+Enter fills it with the value of the active cell. Both leave the ID column and read-only cells alone, and a notice states how many cells were filled and how many were not changed. Ctrl+Shift+L shows only the assets selected on the map. With a filter on, Ctrl+A and Ctrl+D act on the rows shown only, and a row edited so that it no longer matches stays until the filter is applied again.</p><p>In a scenario other than Base, a cell edit, Ctrl+D, Ctrl+Enter, and a paste are stored as overrides of the open scenario.</p>';
// The Boxes chapter (Task 785): terms after Tom's two paragraphs. Held by dev/lpn-spike/user-guide-boxes-harness.js.
$ec_lang['lpn_guide_bx_dock_term']='Docking and tabs';
$ec_lang['lpn_guide_bx_dock_def']='<p>The corner of a box\'s title bar has Dock at the left of the map, Dock at the right of the map, and Float, and, once the box is docked, Auto-hide. A docked box is a column beside the map. With Auto-hide, it is a tab on a slim strip at the edge of the map. The tab opens the box on hover, after 150 ms with a mouse or pen, or on a click or tap, and the box tucks back into its tab as described above. A tucked box is still open. A menu row or toolbar button that opens it brings it out of its tab.</p><p>Dragging a docked box by its title bar floats it and turns auto-hide off. Boxes docked on one side share one width, and the map keeps at least 320 px. Tabs are reordered by dragging them or by pressing Alt+Up or Alt+Down on a focused tab.</p>';
$ec_lang['lpn_guide_bx_keep_term']='What a box remembers';
$ec_lang['lpn_guide_bx_keep_def']='<p>Each box keeps in this browser where it floats, its size, whether it is open, its dock side, whether it auto-hides, its docked width, and the place of its tab. Properties, Criticality analysis, Demand scaling, and Calibration keep only their dock side, auto-hide, tab place, and whether they are open; where they float lasts for one page load. A browser with no saved layout starts with some boxes docked as tabs, and nothing is stored until a box is changed.</p>';
$ec_lang['lpn_guide_bx_phone_term']='On a phone';
$ec_lang['lpn_guide_bx_phone_def']='<p>At 640 px or narrower, no box docks and every box fills the window. The dock buttons are not offered. A docked layout is kept and returns on a wider window.</p>';
// The Fire flow analysis chapter (Task 785), in the entry for its box. Held by dev/lpn-spike/user-guide-fireflow-harness.js.
$ec_lang['lpn_guide_ff_asks_term']='What is asked of each junction';
$ec_lang['lpn_guide_ff_asks_def']='<p>Each tested junction gets two tests, on a copy of the network at the time step on screen and in the open scenario. The first asks how much flow the junction can deliver while it holds the residual pressure. A flow is drawn at the junction, and repeated solves narrow it down, up to a ceiling equal to 10000 gpm. A junction that still holds the residual pressure at the ceiling is reported as delivering more than the ceiling. The second test, the design check, draws the required flow at the junction and asks whether any other junction in its scope falls below the Lowest pressure allowed elsewhere, or any pipe in its scope runs above the Highest velocity allowed. The design check is not made when its scope is None.</p><p>A junction with its own Required fire flow property is tested against that value, and every other junction against the value in the box.</p>';
$ec_lang['lpn_guide_ff_result_term']='Reading the results';
$ec_lang['lpn_guide_ff_result_def']='<p>The summary counts the junctions that passed all checks, the junctions that failed the fire flow, and the junctions that affected the rest of the system. The table lists, for each junction tested, the Static pressure before any fire flow is drawn, the Required flow, the Pressure at required flow, the Available flow, the Residual held, the Worst effect and Design limit of the design check, the number of Runs, which is the number of solves of the whole network, and the Failure modes. A cell with no number shows a dash, never a zero. A junction that could not be solved shows its reason in place of numbers. The table prints at most 200 junctions and states how many it did not print.</p>';
$ec_lang['lpn_guide_ff_marks_term']='Rings, Stop, and one analysis at a time';
$ec_lang['lpn_guide_ff_marks_def']='<p>After a run, the circle of each tested junction is outlined on the map according to its result, and the outlines differ in dash pattern as well as in color. Choose Selected junctions to test only the junctions selected on the map; anything else that is selected is counted and not tested. Stop ends a run and keeps the junctions already finished. Only one of the fire flow, criticality, and demand scaling analyses runs at a time.</p>';
$ec_lang['lpn_guide_ff_example_term']='Example on Net1';
$ec_lang['lpn_guide_ff_example_def']='<p>Open the Net1 example, choose Water, Analyze, Fire flow analysis…, and click Run with the box as it opens. The time step is 0:00, and the run solves the whole network 135 times. Eight of the nine junctions pass all checks. Junction N32 fails the fire flow: its static pressure is 111 psi, only 1.19 psi remains at the required 1000 gpm, and its available flow is 892 gpm. Junction N31 can deliver 1339 gpm, and Junction N12 more than 10000 gpm.</p>';
// The Criticality analysis chapter (Task 785). Held by dev/lpn-spike/user-guide-criticality-harness.js.
$ec_lang['lpn_guide_cr_case_term']='What each case does';
$ec_lang['lpn_guide_cr_case_def']='<p>For each link in the scope, the link is made inactive on a copy of the network, and the copy is solved at the time step on screen in the open scenario. A run is one solve for each link and one more with nothing broken. A junction left with no open path to a reservoir or tank is cut off: it is removed before the solve, and its demand is counted as Demand not served. Of the junctions still connected, Junctions below minimum lists those whose pressure falls below the Lowest pressure allowed. A junction that is already below it with nothing broken is not counted against any link, and the summary states how many there are. Lowest pressure allowed is the same setting as the Lowest pressure allowed elsewhere box of the Fire flow analysis.</p>';
$ec_lang['lpn_guide_cr_dead_term']='Dead ends, and the list';
$ec_lang['lpn_guide_cr_dead_def']='<p>A dead-end link is one whose removal cuts off junctions that can be reached only through it. Everything beyond it is its loss, so with Skip dead ends checked the link is not solved, and the summary states how many were skipped. The list shows, for each link, the Demand not served, the Junctions cut off, and the Junctions below minimum, each with the number and the first five IDs, and a click on an ID goes to it on the map. Links that cost the system something are listed first until a column heading is clicked to sort, and the summary counts them against the number of links tested. Choose Selected links to break only the links selected on the map.</p>';
$ec_lang['lpn_guide_cr_example_term']='Example on Net1';
$ec_lang['lpn_guide_cr_example_def']='<p>Open the Net1 example, choose Water, Analyze, Criticality analysis…, enter 116 for Lowest pressure allowed, and click Run. The time step is 0:00, and the run solves the whole network 14 times. Four of the 13 links drop a junction below 116 psi when they are out: L9 (N10, N11, and N21), L10 (N11 and N21), L111 (N21 and N22), and L112 (N21 and N22). Two junctions are already below 116 psi with nothing broken and are not counted. Because Net1 is looped, losing one link never leaves a junction without supply.</p>';
// The Demand scaling chapter (Task 785). Held by dev/lpn-spike/user-guide-demandscale-harness.js.
$ec_lang['lpn_guide_ds_run_term']='Run';
$ec_lang['lpn_guide_ds_run_def']='<p>Run multiplies the demands at the chosen junctions by the Demand scale, on a copy of the network at the time step on screen and in the open scenario. It makes two solves, one with the demands as they are and one scaled. The result lists the Lowest pressures and the Highest velocities, each with the Scaled value beside the Unscaled one, which is the value the map shows. Each list holds ten rows, and the box states how many links it does not show. The Demand scale is applied in addition to the demand multiplier of the open scenario, and it is never saved in the project.</p>';
$ec_lang['lpn_guide_ds_find_term']='Find';
$ec_lang['lpn_guide_ds_find_def']='<p>Find searches demand scales from 0 to 20, to the nearest 0.01, for the largest one at which every chosen junction keeps at least the Lowest pressure allowed. It reports the scale and the lowest pressure there, and the same for the next step up, where the pressure first falls below the limit. If the demands as entered already leave a junction below the limit, the answer is marked with a warning sign. If every junction keeps the limit at 20, the answer says so. Stop ends a search without an answer. Lowest pressure allowed is the same setting as the Lowest pressure allowed elsewhere box of the Fire flow analysis.</p>';
$ec_lang['lpn_guide_ds_scope_term']='Junctions, and the time step';
$ec_lang['lpn_guide_ds_scope_def']='<p>With Selected junctions, only the junctions selected on the map are scaled and checked. Other junctions are left as they are, and those that fall below the limit are listed without limiting the answer. Only the time step on screen is scaled, and levels and statuses are taken from it. To test the peak, move the clock to the peak demand before running.</p>';
$ec_lang['lpn_guide_ds_example_term']='Example on Net1';
$ec_lang['lpn_guide_ds_example_def']='<p>Open the Net1 example and choose Water, Analyze, Demand scaling…. At the time step 0:00, click Find with the box as it opens. Every junction keeps at least 20 psi up to a demand scale of 5.76, where the lowest pressure is 20.11 psi at junction N32. At 5.77 it is 19.8 psi, and the search took 13 solves. Enter 3 for Demand scale and click Run: Junction N32 falls from 111 psi, unscaled, to 85.99 psi, and Link L112 rises from 0.535 ft/sec to 3.13 ft/sec.</p>';
// The Pump energy chapter (Task 785). Held by dev/lpn-spike/user-guide-energy-harness.js.
$ec_lang['lpn_guide_en_read_term']='Reading the report';
$ec_lang['lpn_guide_en_read_def']='<p>Choose Water, Reports, Pump energy. The report integrates the power of each pump over the last extended period simulation, so it needs a Total run time greater than 0 and a calculation. For each pump it lists the % of run, the Effic., the Avg. kW, the Peak kW, the kWh, and the Cost. The Avg. kW is the average while the pump was running, not over idle periods. Below the table are the Energy used, the Cost of energy, the Peak power usage, the Cost of peak demand, and the Total cost. A network with no pumps has nothing to report.</p>';
$ec_lang['lpn_guide_en_set_term']='What sets the numbers';
$ec_lang['lpn_guide_en_set_def']='<p>Settings, Energy holds the Pump efficiency (percent), used for every pump that has no efficiency curve, the Price of power for one kilowatt hour, a Price pattern that multiplies the price at each pattern step, the Peak demand charge per kW, and a Currency text that is printed beside the costs and does not convert the costs. A pump can have its own price, price pattern, and efficiency curve in Properties. The prices, the pattern, the peak demand charge, the Pump efficiency (percent), and a pump\'s own values are in the Energy cost category, so a scenario can override them. When no price is stated, or the price is zero, every cost is zero and the report says so. The application suggests no price.</p>';
$ec_lang['lpn_guide_en_example_term']='Example on Net1';
$ec_lang['lpn_guide_en_example_def']='<p>Open the Net1 example, which has a total run time of 24:00, and calculate. Choose Water, Reports, Pump energy. Pump L9 runs for 65.71% of the run at an efficiency of 75%, and uses 96.22 kW on average, 96.71 kW at the peak, and 1518 kWh. No price is stated, so the cost is 0 and the report says so. Enter 0.12 for Price of power in Settings, Energy, and calculate again: the cost of L9 is 182, the Total cost.</p>';
// The Contour plot chapter (Task 785). Held by dev/lpn-spike/user-guide-contour-harness.js.
$ec_lang['lpn_guide_ct_what_term']='What the plot is';
$ec_lang['lpn_guide_ct_what_def']='<p>Choose Water, Graphs, Contour. The row turns the plot on in the open scenario, as a smooth fill with labeled lines, using the pressure if the nodes are not colored yet, and opens the box. The plot spreads the node colors along the pipes and up to a set multiple of the median pipe length beside them, fading out over the outer part. It does not color across pumps, valves, or closed links. The line under the color key states how many nodes and pipes the plot uses, the reach beside the pipes, and the interval of the lines. With too few nodes, it says so.</p>';
$ec_lang['lpn_guide_ct_box_term']='The box';
$ec_lang['lpn_guide_ct_box_def']='<p>Show contours, when cleared, hides the fill and the lines and keeps the node colors. The box also holds Color nodes by and Color scheme, which are the same two settings as in Settings, Symbology, Node colors, the Fill (None, Smooth, or Bands, which paints each class flat), the Fill opacity, the Contour lines with their Interval and Labels, and the Buffer in multiples of the median pipe length. In a project placed on the Earth, the box can also take the ground between nodes from Mapbox DEM, after the visitor agrees to send the tile numbers of the network\'s area. These settings are saved with the project and can be overridden by a scenario. The plot changes only the display, not the network.</p>';
$ec_lang['lpn_guide_ct_example_term']='Example on Net1';
$ec_lang['lpn_guide_ct_example_def']='<p>Open the Net1 example and choose Water, Graphs, Contour. The nodes are colored by pressure, and the line under the color key states 9 nodes, 11 pipes, a reach of 2.5 times the median pipe length beside them, and lines every 5 psi. The pump, Link 9, is not one of the 11 pipes. When Show contours is cleared, the nodes stay colored by pressure.</p>';
// The Run report, Status changes, and Full report chapters (Task 785). Held by dev/lpn-spike/user-guide-reports-harness.js.
$ec_lang['lpn_guide_rr_what_term']='What the report holds';
$ec_lang['lpn_guide_rr_what_def']='<p>Choose Water, Reports, Run. The report is the text that the EPANET engine wrote for the last extended period simulation, in pages. It starts with the banner and the name of the network, then counts the junctions, reservoirs, tanks, pipes, pumps, and valves, then states the analysis options, and then lists the hydraulic status of the run with its warnings. The Copy button copies the text.</p>';
$ec_lang['lpn_guide_rr_example_term']='Example on Net1';
$ec_lang['lpn_guide_rr_example_def']='<p>Open the Net1 example, which has been calculated already, and choose Water, Reports, Run. The summary counts 9 junctions, 1 reservoir, 1 tank, 12 pipes, 1 pump, and 0 valves. The headloss formula is Hazen-Williams, the hydraulic timestep is 1.00 hrs, and the total duration is 24.00 hrs.</p>';
$ec_lang['lpn_guide_st_what_term']='What is listed';
$ec_lang['lpn_guide_st_what_def']='<p>Choose Water, Reports, Status changes. Each row gives the time of a change and the change: a pump, valve, or pipe now open or now closed, or a tank now filling, emptying, full, or empty. A time step that did not fully converge is listed too. The list is in time order and holds only changes, not every step. It is read from the same extended period run as the Tables pane and the Full report.</p>';
$ec_lang['lpn_guide_st_example_term']='Example on Net1';
$ec_lang['lpn_guide_st_example_def']='<p>Open the Net1 example and choose Water, Reports, Status changes. Tank N2 is now filling at 1:00, emptying at 11:00, filling at 16:00, and emptying at 22:00. Pump L9 is now closed at 10:00, now open at 15:00, and now closed at 21:00.</p>';
$ec_lang['lpn_guide_fr_what_term']='What the table holds';
$ec_lang['lpn_guide_fr_what_def']='<p>Choose Water, Reports, Full. The table has one row for each node and link at each reporting time step, in the units of the Tables pane. Its columns are Type, ID, Demand, Head, Pressure, Chlorine concentration, Flow, Velocity, Head loss, Pump head, and Status, and a cell is blank where the asset has no such quantity. The Time step list chooses the step shown, and Download CSV and Print report carry every step. Without an extended period simulation, the table shows the current solution at one instant.</p>';
$ec_lang['lpn_guide_fr_example_term']='Example on Net1';
$ec_lang['lpn_guide_fr_example_def']='<p>Open the Net1 example and choose Water, Reports, Full. The 24 assets are listed at 25 reporting steps, 0:00 to 24:00, which is 600 rows. At 0:00, Junction 11 has a demand of 150 gpm, a head of 985.23 ft H2O, and a pressure of 119.26 psi.</p>';
// The Calibration chapter (Task 785). Held by dev/lpn-spike/user-guide-calibration-harness.js.
$ec_lang['lpn_guide_cal_what_term']='What the report compares';
$ec_lang['lpn_guide_cal_what_def']='<p>Choose Water, Reports, Calibration. The Parameter list chooses what the file measures: Demand, Head, Pressure, Chlorine concentration, Flow, or Velocity. One file is held for each parameter, and the Load calibration file… button opens a file chooser. The report has three pages. Statistics gives, for each location, the number of observations, the observed mean, the computed mean, the mean error, and the RMS error, then a Network row for all locations together and the correlation between the means. Correlation plot puts each measurement at its observed value across and its computed value up, with a diagonal line where the two agree. Mean comparisons draws the observed and computed means as a pair of bars for each location.</p><p>The computed value is read from the extended period run, and a measurement between two reporting steps is compared with the value interpolated between them. A measurement outside the times the run reported is skipped and counted. With a single instant solution, every measurement is compared with that one result, whatever time the file gives. The report fills in after the network is calculated.</p>';
$ec_lang['lpn_guide_cal_file_term']='The calibration file';
$ec_lang['lpn_guide_cal_file_def']='<p>A text file with a location ID, a time, and a measured value on each line. The time is measured from the start of the simulation, in decimal hours or hours:minutes. A semicolon starts a comment. A line with only a time and a value belongs to the location above it. The values are read in the project\'s units, and the report says which unit. A location that is not in the network is listed and its measurements are counted as skipped, a line that cannot be read is listed by line number, and the rest of the file is used. A file is held in memory for the open project and this page load only. It is not saved with the project or on this device. When the Time series chart shows the same quantity, the measured values are drawn on it as rings.</p>';
$ec_lang['lpn_guide_cal_example_term']='Example on Net1';
$ec_lang['lpn_guide_cal_example_def']='<p>Open the Net1 example, calculate it, and choose Water, Reports, Calibration. With Pressure chosen, load a file that gives Junction 11 as 118.5 psi at 0:00 and 121.0 psi at 12:00, Junction 31 as 110.2 psi at 6:00 and 108.7 psi at 18:00, and Junction 99 as 50 psi at 0:00, followed by a line that is not data. The report says the file has 5 measurements at 3 locations, names Junction 99 as not in the network with 1 measurement skipped, and lists the unreadable line. Statistics shows Junction 11 with 2 observations, an observed mean of 119.75 psi, a computed mean of 116.53 psi, a mean error of 3.98, and an RMS error of 5.12. Junction 31 has 109.45, 118.71, 9.26, and 9.79. The Network row has 4 observations, a mean error of 6.62, and an RMS error of 7.81.</p>';
// Where the Guide lists its own keys, so that a search for one finds it.
$ec_lang['lpn_guide_using_heading']='Using the user manual';
$ec_lang['lpn_guide_keys_term']='User manual keyboard shortcuts';
$ec_lang['lpn_guide_keys_def']='<table class="lpn-notes-table"><tbody><tr><td>?</td><td>Open the user manual at the toolbar button or menu row under the pointer or that has focus. Elsewhere, open it with the search field selected. The key does not open it while a field is being typed in or while a question is open.</td></tr><tr><td>F1</td><td>Open the user manual at the entry for the box that has focus.</td></tr><tr><td>Ctrl+K</td><td>Open the user manual with the search field selected and any selected text, up to 80 characters, in it. It replaces the browser\'s own Ctrl+K, except while a question is open, when the user manual is not opened.</td></tr><tr><td>/</td><td>Select the search field while the user manual has focus.</td></tr><tr><td>Esc</td><td>While the user manual has focus, close it and return focus to where it was.</td></tr></tbody></table>';
$ec_lang['lpn_guide_use_term']='Searching, links, and what is remembered';
$ec_lang['lpn_guide_use_def']='<p>Search ignores capitals and accents and lists the rows and entries that contain the text typed. Choosing a row shows where that control is. It never runs the control. On a phone, where the toolbar is folded away, a toolbar row opens the menu row that does the same thing.</p><p>The address of the page follows the entry being read, as in <code>Looped-Network.php#guide</code>, so it can be copied as a link to that entry. Closing the user manual clears it. The user manual remembers in this browser whether it was open, its position and size, and whether its contents list is hidden. On a phone the contents list starts hidden.</p>';
// Under a toolbar button in the User guide, naming the menu row that does the same thing.
// {menu} becomes a path such as "Edit > Delete", drawn with chevrons; keep {menu} as it is.
$ec_lang['lpn_guide_also']='Also in {menu}';
$ec_lang['lpn_guide_how_popup']='Properties opens when you select an asset or text.';
$ec_lang['lpn_guide_not_shown']='This control is not on screen right now.';
// The box's two context headings. "Tables" holds the two table-help entries that used to sit only
// in the Notes list (lpn_notes_6/7, moved rather than duplicated); "Map" is new -- the digit tool
// keys, Undo and the zoom keys had never been gathered anywhere before.
$ec_lang['lpn_hotkeys_tables_heading']='Tables';
$ec_lang['lpn_hotkeys_map_heading']='Map';
$ec_lang['lpn_hotkeys_map_term']='Map keyboard shortcuts';
// Same shape as lpn_notes_7_def: one table, one row per key. The ten digits are LPN_TOOL_KEYS in
// js/looped-network.js; Select also answers to Esc and Delete to the Delete key
// (LPN_TOOL_ALT_KEYS); Ctrl+Z is undo(); +/- and = are keyZoom() (ROADMAP Task 682).
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>0 or Esc</td><td>Select.</td></tr><tr><td>2</td><td>Add a junction.</td></tr><tr><td>3</td><td>Add a reservoir.</td></tr><tr><td>4</td><td>Add a tank.</td></tr><tr><td>5</td><td>Add a pipe.</td></tr><tr><td>6</td><td>Add a pump.</td></tr><tr><td>7</td><td>Add a valve.</td></tr><tr><td>8</td><td>Add a customer.</td></tr><tr><td>9</td><td>Add text.</td></tr><tr><td>Delete</td><td>Delete the selection.</td></tr><tr><td>Ctrl+Z</td><td>Undo the last change.</td></tr><tr><td>+ or =</td><td>Zoom in.</td></tr><tr><td>-</td><td>Zoom out.</td></tr></tbody></table>';
// The W row of the Map table. Its own key, spliced into the table by Looped-Network.php, because a new row in
// lpn_hotkeys_map_def is new markup that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_zoomwin_def']='Zoom Window: drag a rectangle on the map to zoom to that area.';
// The menu chords (Task 748): Alt+Shift+letter on Windows and Linux, Ctrl+Option on a Mac, and F10.
// Exactly two rows (Tom, 2026-10-03: "show only the Alt+Shift and the F10"); the letters themselves
// are assigned per language by menuMnemonics() and shown on the menus, never listed here.
// A separate block rather than rows in lpn_hotkeys_map_def, because a new row there is new markup
// that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_menu_heading']='Menus';
$ec_lang['lpn_hotkeys_menu_term']='Menu keyboard shortcuts';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+letter</td><td>Open the menu with that letter, then press a row\'s letter to choose it. The letters show while you use the keyboard. On a Mac, use Ctrl+Option.</td></tr><tr><td>F10</td><td>Go to the menu bar.</td></tr></tbody></table>';
// The Screenshot keys. A separate block, for the reason given above the menu block.
$ec_lang['lpn_hotkeys_snip_heading']='Screenshot';
$ec_lang['lpn_hotkeys_snip_term']='Screenshot keyboard shortcuts';
$ec_lang['lpn_hotkeys_snip_def']='<table class="lpn-notes-table"><tbody><tr><td>S</td><td>Snip, while Screenshot is open.</td></tr><tr><td>E</td><td>Eraser, in the markup view.</td></tr><tr><td>Ctrl+Z, Ctrl+Y</td><td>Undo and redo, in the markup view.</td></tr><tr><td>Esc</td><td>Cancel a snip, or leave the eraser. In the markup view, close it when nothing is drawn.</td></tr></tbody></table>';
// ---- "Something wrong here?" (ROADMAP Tasks 207 and 768) ----
// Two sites, one behaviour -- a standing cell in the map's bottom strip, and the same control inside
// the solver's diagnostic box when one is on screen. The first click opens a box; Send is the second.
// The thank-you must never imply an answer: a reply comes only to somebody who left an address.
$ec_lang['lpn_wrong_btn']='Something wrong here?';
// The standing message's own Hide control. A hidden message leaves the map and waits as the top row of the
// message history (the down-arrow glyph), marked by lpn_msglog_hidden, with lpn_msglog_unhide to bring it back.
$ec_lang['lpn_status_dismiss']='Hide this message';
$ec_lang['lpn_msglog_hidden']='Hidden';
$ec_lang['lpn_msglog_unhide']='Show';
$ec_lang['lpn_status_hidden_tip']='Show the hidden message on the map again.';
// Rewritten for the two-click box (Task 768); TGH's 2026-09-07 wording described one press.
$ec_lang['lpn_wrong_tip']='Report an error on this page. This opens a box to choose the problem, add a comment, and enter an email address if a reply is wanted. All fields are optional, and nothing is sent until you press Send.';
$ec_lang['lpn_wrong_thanks']='Thank you. Your report was received.';
// The box "Something wrong here?" opens (ROADMAP Task 768). Every field is optional; Send with
// nothing in it posts only the anonymous tally the button always posted. The four picks are canned
// phrases a visitor may toggle in any combination. lpn_fb_sends must stay true to send-feedback.php
// and to the "Messages you send us" row of privacy.php.
$ec_lang['lpn_fb_intro']='Canned messages (optional). Nothing is sent until you press Send.';
$ec_lang['lpn_fb_pick_numbers']='The numbers look wrong';
$ec_lang['lpn_fb_pick_broken']='Something did not work';
$ec_lang['lpn_fb_pick_wording']='The wording or translation is wrong';
$ec_lang['lpn_fb_pick_confusing']='This is confusing';
$ec_lang['lpn_fb_comment']='Comments (optional)';
$ec_lang['lpn_fb_email']='Email (optional, only if you want a reply)';
$ec_lang['lpn_fb_sends']='What this sends: the name of this page, your language, the version of the site, the code of the message on the map if there is one, and what you chose or typed. Never your drawing or your network. Your email address is used only to reply to you.';
$ec_lang['lpn_fb_send']='Send';
$ec_lang['lpn_fb_sending']='Sending…';
$ec_lang['lpn_fb_failed']='That did not reach us. What you wrote is still here, so you can try again.';
$ec_lang['lpn_fb_bad_email']='That email address does not look right. Correct it, or leave it empty.';
$ec_lang['lpn_fb_busy']='Too many messages have arrived in the last few minutes. What you wrote is still here, so you can try again later.';
$ec_lang['lpn_status_example_opened']='Opened {name} as a copy. Save it with File, Save as.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='This page could not determine the size of the drawing area, so the map shows the last view it was able to compute. Resizing the window repeats the measurement. If this persists, the usual cause is a browser extension that blocks page measurements.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Basic network, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='Two reservoirs, a pump, and a small loop. Liters per second, with meters and millimeters.';
$ec_lang['lpn_ex_basic_us_title']='Basic network, gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='Two reservoirs, a pump, and a small loop. Gallons per minute, with feet and inches.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 plus rule-based controls';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='A fictional EPANET example with chlorine, 1 reservoir and 1 tank.';
$ec_lang['lpn_ex_net1_si_title']='EPANET Net1 plus rule-based controls, L/s (SI)';
$ec_lang['lpn_ex_net1_si_desc']='Liters per second, with meters and millimeters. A fictional EPANET example converted from gallons per minute, feet, and inches, with chlorine, 1 reservoir, 1 tank, 1 pump, and two rule-based controls.';
$ec_lang['lpn_ex_net1_scn_title']='EPANET Net1 with scenarios, gpm (US)';
$ec_lang['lpn_ex_net1_scn_desc']='Gallons per minute, with feet and inches. EPANET\'s Net1 with five scenarios under Base, the average day. Peak hour sets the demand multiplier to 2.25 and Max day sets it to 1.5. The fire scenario adds 1,500 gpm at junction 23. The multiplier also scales that junction\'s own demand, so it holds 1,150 gpm, which is 1,725 gpm at 1.5. A main break closes pipe 112 in two scenarios that share one alternative.';
$ec_lang['lpn_ex_net2_si_title']='EPANET Net2, L/s (SI)';
$ec_lang['lpn_ex_net2_si_desc']='Liters per second, with meters and millimeters. An EPANET example at Branford, Connecticut, converted from gallons per minute, feet, and inches: 35 junctions and 1 tank, with no reservoir, no pump, and no valves, about 2 km by 4 km. Fluoride, a non-reactive substance, enters at one source.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2, gpm (US)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Gallons per minute, with feet and inches. An EPANET example at Branford, Connecticut: 35 junctions and 1 tank, with no reservoir, no pump, and no valves, about 1 mile by 2 miles. Fluoride, a non-reactive substance, enters at one source.';
$ec_lang['lpn_ex_net3_si_title']='EPANET Net3, L/s (SI)';
$ec_lang['lpn_ex_net3_si_desc']='Liters per second, with meters and millimeters. An EPANET example at Novato, California, converted from gallons per minute, feet, and inches, with the world map behind it: 92 junctions, 3 tanks, and 2 reservoirs, no valves, about 8 km square. A 24-hour extended-period simulation, with a source trace from the Lake.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3, gpm (US)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='Gallons per minute, with feet and inches. An EPANET example at Novato, California, with the world map behind it: 92 junctions, 3 tanks, and 2 reservoirs, no valves, about 5 miles square. A 24-hour extended-period simulation, with a source trace from the Lake.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center, gpm (US)';
$ec_lang['lpn_ex_elm_street_desc']='Gallons per minute, with feet and inches. Prescott Valley, Arizona: 17 junctions, 1 reservoir, and 1 pump. A commercial site solved for fire flow on top of maximum day demand, at one moment in time, drawn over a site plan.';
$ec_lang['lpn_tool_undo']='Undo';
$ec_lang['lpn_confirm_example']='This adds the example to the network you already have. Continue?';
$ec_lang['lpn_field_diameter']='Diameter';
$ec_lang['lpn_demand_tip']='Flows taken out of the network at this node. Enter a negative number for flow put into the network here.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='This unit defines how your inputs are read';
$ec_lang['lpn_units_warn_lead']='{unit} is the unit of what you enter for:';
$ec_lang['lpn_units_options_head']='When you change a unit:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='Non-destructive';
$ec_lang['lpn_units_nondestructive_desc']='Non-destructive: leaves every input as it is and reinterprets it in the new unit.';
$ec_lang['lpn_units_destructive']='Destructive';
$ec_lang['lpn_units_destructive_desc']='Destructive: rewrites every input with a mathematical conversion, so the network stays physically close to the same, within conversion tolerances. It loses the original inputs. Undo puts them back.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='Values ({n}) now mean {unit}. Nothing was rewritten.';
$ec_lang['lpn_status_converted']='Values ({n}) were rewritten into {unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
// **THE NATURAL ENGLISH GOES ON THE CONTROL; the ultra-simple rendering goes to the translator**
// (Tom, 2026-08-18: *"'Input units' and 'Results units'... both more natural than the ultra simple
// English you used. While I like that you are thinking simple for translators, this should go in
// _syn and the more natural in English."*). That is the routing rule stated on a real case: simple
// English is for when an English reader would stumble, and here one would not.
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='Length';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Map coordinates';
$ec_lang['lpn_units_mapcoords_deg']='degrees';
$ec_lang['lpn_units_usft']='US survey ft';
$ec_lang['lpn_units_elevhead']='Elevation and head';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Head loss gradient';
$ec_lang['lpn_result_gradient_tip']='Head loss divided by the length of the pipe. Use it to compare pipes of different lengths against one design limit.';
$ec_lang['lpn_result_water_age']='Water age';
$ec_lang['lpn_result_water_age_tip']='Time the water reaching this point has spent in the system. Where flows meet, the number is the average of the arriving ages, weighted by flow. In a tank it is the average age of the water held, so a tank that turns over slowly usually holds the oldest water in a network. There is no regulatory limit to compare it against, so evaluate it against conditions in the system being modeled.';
$ec_lang['lpn_result_source_share']='Source share';
$ec_lang['lpn_result_source_share_tip']='Share of the water reaching this point that came from the trace node. This is what the Source trace analysis reports.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Average water age';
$ec_lang['lpn_result_avg_source_share']='Average source share';
$ec_lang['lpn_result_avg_concentration']='Average concentration';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Friction factor';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Reaction rate';
$ec_lang['lpn_result_status']='Status';
$ec_lang['lpn_result_status_open']='Open';
$ec_lang['lpn_result_status_closed']='Closed';
$ec_lang['lpn_result_head']='Head';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Potential energy of the water at this node, written as a height of water column. It is an absolute height, where pressure is a gauge measurement.';
// A tank's depth and usable volume (Task 783). Depth is head minus the tank bottom, which is our
// Elevation. Volume is zero at the Lowest water depth, so it is NOT EPANET's tank volume, which also
// counts the water below the lowest water depth (that water is in the mixing volume, it just cannot be drawn down).
$ec_lang['lpn_result_depth']='Depth';
$ec_lang['lpn_result_depth_tip']='Depth of water in the tank at the time shown, measured up from the tank bottom: the head minus the tank elevation.';
$ec_lang['lpn_result_tank_volume']='Available volume';
$ec_lang['lpn_result_tank_volume_tip']='Volume of water above the lowest water depth, so it is zero at that depth. The EPANET tank volume also includes the water below the lowest water depth, which still counts toward mixing and water age, so the tank elevation stays at the tank bottom.';
$ec_lang['lpn_result_pressure']='Pressure';
$ec_lang['lpn_result_flow']='Flow';
$ec_lang['lpn_result_velocity']='Velocity';
$ec_lang['lpn_result_headloss']='Head loss';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Reset the settings of this project only. The drawing and other projects are not changed. To reuse a set of settings, save a project file that contains only settings.';
$ec_lang['lpn_reset_all_tip']='Delete every project, every background image, every setting, and your unit choices, then reload the page exactly as a first-time visitor sees it. This is the only reset that clears everything.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='This calculator stores project units and inputs as entered, but it formerly converted numbers to SI for storage. This project was saved before that change, so its numbers were stored in SI. Convert them one last time to the current units? To help you judge, here are some diameters that would be converted, with their values before and after:';
$ec_lang['lpn_v2_restore_yes']='Convert';
$ec_lang['lpn_v2_restore_never']='No. Never ask again.';
$ec_lang['lpn_v2_restore_no']='Close so that I can check the current units first';
$ec_lang['lpn_storage_too_new']='This project was saved by a newer version of the page, so it cannot be opened here.';
// ---- Projects as tabs, files as files (ROADMAP Task 211) ----
// The whole surface below follows one rule: THE ASTERISK DECIDES. A tab wearing an asterisk has
// something that is not in a file, so closing it asks first; a tab without one closes silently. A
// browser project always wears one (it is in no file at all); a file project wears one only while it
// has unsaved changes. Nothing here needs the words "browser project" or "file project" -- those are
// our words for talking about the code, and the user sees only a name, an asterisk, and a file
// extension.
// The menu bar. The MENU holds everything; the TOOLBAR is the high-use subset of it, which is the
// conventional relationship and the reason the duplication between them is correct rather than
// sloppy. Names are the ones every desktop application has used for thirty years -- this is a
// paradigm we are ADOPTING, not inventing, and the point of adopting one is that nobody has to be
// taught it (Tom, 2026-08-04).
$ec_lang['lpn_tool_file']='File';
$ec_lang['lpn_menu_edit']='Edit';
$ec_lang['lpn_menu_insert']='Insert';
// **VIEW BECAME MAP** (Tom, 2026-08-27). He had found the terrain-elevation row filed under View
// and said what it cost: *"our menu system is getting confusing and complicated with this under
// View when it really has something to do with mapping, but nothing to do with view."* The menu now
// holds the drawing's frame, the pictures behind it, where on Earth it is, and the elevations read
// off that ground -- and only the first of those is a "view". EPANET files its own Dimensions and
// Backdrop under View and nobody finds that strange, so this is a choice rather than a correction;
// Map is simply more literal, and it is the word Tom picked.
//
// The 26 translations of this key were DELETED with the rename, not carried across: every one of
// them was the word "View" in its own language, and a translated "View" under a key drawn as Map
// would be the one kind of wrong a reader cannot see. Absent is the correct untranslated state.
$ec_lang['lpn_menu_map']='Map';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='Show street map';
$ec_lang['lpn_basemap_satellite_show']='Show satellite images';
$ec_lang['lpn_basemap_topo_show']='Show topo map';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='georeferenced';
$ec_lang['lpn_xymap']='local';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Convert as…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='Copy of {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:4326), not a fourth case; EPSG:3857 is a
// projected system in meters since Task 775.
$ec_lang['lpn_convas_title']='Convert as';
$ec_lang['lpn_convas_coordsys_tip']='The coordinate system the copy is converted to. When it differs from that of this project, two placement steps follow. For a project that is already georeferenced, both steps open completed, ready to accept or change.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Current: {crs}';
$ec_lang['lpn_convas_epsg']='EPSG coordinate system';
$ec_lang['lpn_convas_epsg_tip']='Choose a coordinate system from the EPSG register. WGS 84 (EPSG:4326), latitude and longitude, is the suggested choice. WGS 84 / Pseudo-Mercator (EPSG:3857), commonly called Web Mercator, gives x and y in meters, and its map distances exceed ground distances away from the equator. Pipe lengths are computed as ground distances in either system.';
$ec_lang['lpn_convas_unnamed']='Unnamed (local) georeference';
$ec_lang['lpn_convas_unnamed_tip']='Local coordinates in the length unit, with the world map attached.';
$ec_lang['lpn_convas_none_tip']='Local coordinates in the length unit, with no world map for now.';
$ec_lang['lpn_convas_units_tip']='The units the copy is converted to.';
$ec_lang['lpn_convas_round']='Round converted values';
$ec_lang['lpn_convas_round_tip']='The step to round to, applied only to the numbers this conversion rewrites. Values whose unit does not change are left as they are.';
$ec_lang['lpn_convas_round_none']='No rounding';
$ec_lang['lpn_convas_round_flow']='Demand and flow';
$ec_lang['lpn_convas_label_col']='Suffix';
$ec_lang['lpn_convas_label_tip']='Text added after this value on the copy\'s map labels, such as \' mm\' or \' gpm\'. Pre-filled from the unit chosen above; clear it for no suffix.';
$ec_lang['lpn_convas_oneway']='Converting back is a second conversion, not an undo. A number converted and converted back may not return exactly as it was entered.';
$ec_lang['lpn_convas_ok']='Convert';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} is one of the few listed coordinate systems without usable projection information, so it cannot be converted to or from. Nothing was converted.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='The converted copy is {name}. The original project is unchanged.';
$ec_lang['lpn_convas_cancelled']='Nothing was converted. The copy is closed, and the original project is unchanged.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Copy this project to a new tab and convert the copy to the coordinate system and units you choose. When the coordinate system changes, a wizard guides you through zooming the map behind your network approximately, then scaling and rotating your network on the map more closely. This project is left exactly as it is. To georeference without converting anything, use Map, World map, Attach instead.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='This project is already georeferenced, so the network is already on the map and nothing has been moved. Check that it is in the right place, then press the Put the model here button and the Keep this placement button.';
$ec_lang['lpn_georef_intro']='Placing the model takes two steps. Step 1 is approximate: the model stays fixed on the screen while you pan and zoom the map behind it, until the site is under the model at about the right scale. This step has no rotation. Step 2 is precise: drag, resize, and rotate the model itself. The project starts on a map of the whole world, so find the location first, then press the Put the model here button.';
$ec_lang['lpn_georef_adjust']='The model is now attached to the map, so it moves with the map. Drag the model to move it, drag a corner to resize it, or drag the round handle above the model to rotate it. Or enter the ground distance and the rotation angle below.';
$ec_lang['lpn_georef_step1']='Step 1 of 2 — quick';
$ec_lang['lpn_georef_step2']='Step 2 of 2 — precise';
$ec_lang['lpn_georef_step1_hint']='The project stays fixed on the screen. Pan and zoom the map underneath it until the map shows approximately the right location at approximately the right scale, then press the Put the model here button.';
$ec_lang['lpn_georef_detach']='Pick it up again';
$ec_lang['lpn_georef_size_prompt']='About how wide is the site, across the whole project?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name} — {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Shortcut: {key}';
$ec_lang['lpn_tool_key_hint_two']='Shortcut: {key} or {key2}';
$ec_lang['lpn_tool_add_chain_tip']='Chain junctions and pipes: specify a point on the map to add a junction, then specify each next point to add a pipe and a junction. Specify an existing node to continue from it. Press Escape to end the chain.';
// The Shape tool (Task 779). The word is Tom's: "we call it a 'Shape'".
$ec_lang['lpn_tool_add_shape']='Shape';
$ec_lang['lpn_tool_add_shape_tip']='Draw a point, a polyline, or a polygon on the map. A Shape is annotation and is not part of the network. Specify each point, then specify the last point again, press Enter, or right-click to finish. Specify the first point again to close the Shape into a polygon.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Area select window/lasso/polygon.';
$ec_lang['lpn_area_selected']='{n} selected.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='Nothing found in that area.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Add and remove pipe vertices. Specify a point on a pipe to add a vertex, select a vertex to remove it, and drag a vertex to move it. A vertex changes automatic length, but doesn’t add or change minor (local) losses.';
$ec_lang['lpn_tool_undo_tip']='Undo history length = 20 actions';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Fit the whole network to the map window. To zoom to a rectangle you drag instead, press W or click the small triangle in the corner of the Zoom to fit toolbar button. See also the zoom controls at the upper right of the map.';
$ec_lang['lpn_tool_zoom_selection_tip']='Fit the selected assets to the map window. Select one or more assets first.';
$ec_lang['lpn_tool_zoom_window_tip']='Specify corners or drag a rectangle. Press again for Zoom to fit.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Zoom in. Shortcut: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Zoom out. Shortcut: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Simple or complex find and replace';
// **"Toolbar"** (Tom renamed it from "Toolbar key" to "Toolbar" on 2026-09-30).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. The row earns its place.
$ec_lang['lpn_help_icons']='Toolbar';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Visibility';
$ec_lang['lpn_color_legend_open_tip']='Press to open the coloring settings and change these colors.';
$ec_lang['lpn_color_node_field']='Color nodes by';
$ec_lang['lpn_color_link_field']='Color links by';
$ec_lang['lpn_color_ramp_sequential']='Sequential';
$ec_lang['lpn_color_ramp_diverging']='Diverging';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Number of colors';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Data classification method';
$ec_lang['lpn_color_ranges_note']='The boundaries below are fixed once set; they do not follow the results as they change. Choosing a data classification method above sets the boundaries from the current state of the system. If you change any value by hand, the method above becomes Manual.';
$ec_lang['lpn_color_criterion_note']='This method takes its boundaries from a design standard, so the number of colors is fixed while this method is chosen.';
$ec_lang['lpn_color_break_number']='A boundary must be a number. The map is unchanged.';
$ec_lang['lpn_color_break_order']='Each boundary must be larger than the one before it. The map is unchanged.';
$ec_lang['lpn_color_break_count']='There must be one boundary fewer than the number of colors. The map is unchanged.';
$ec_lang['lpn_color_ramp_qualitative']='Qualitative';
$ec_lang['lpn_color_ramp_rainbow']='Rainbow';
$ec_lang['lpn_color_ramp_rainbow_eg']='matches EPANET';
$ec_lang['lpn_color_example_material']='Material';
$ec_lang['lpn_color_ramp_ylgnbu']='Yellow to blue';
$ec_lang['lpn_color_ramp_rdylbu']='Red to blue, through yellow';
$ec_lang['lpn_georef_drop']='Put the model here';
$ec_lang['lpn_georef_finish']='Keep this placement';
$ec_lang['lpn_georef_scale']='Ground distance per drawing unit';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Calculated automatically. Edit to change. Enter 1 to use the file coordinates unchanged as ground distance, for example for a file with no coordinate system.';
$ec_lang['lpn_georef_rotation']='Counterclockwise rotation (degrees)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Counterclockwise rotation of the whole model, to align it with the new coordinate system.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Place the model here permanently? Assets can still be dragged one at a time afterwards, but proceeding now converts all the coordinates at once. To get the old coordinates back, return to the original project and close this one without saving.';
$ec_lang['lpn_georef_done']='This project is now on the new coordinate system. You may continue to drag any assets that need further adjustment.';
$ec_lang['lpn_georef_backdrop_unrotated']='The background image was moved and resized with the model, but it could not be rotated. Use Map, Background image, Move to align it.';
$ec_lang['lpn_georef_empty']='That file has no network in it, so there is nothing to place.';
$ec_lang['lpn_georef_unavailable']='The placement tool did not load. Reload the page and try again.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Finish the conversion with the "Keep this placement" button, or press Cancel, before you switch projects. The placement applies only to this project.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Finish the conversion with the "Keep this placement" button, or press Cancel, before you save. The project is still being placed, so what is on the screen is not yet what would be written to the file.';
$ec_lang['lpn_goto_menu']='Go to a latitude and longitude…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_prompt']='Latitude and longitude, in that order, separated by a comma or a space';
$ec_lang['lpn_goto_bad']='Can\'t read coordinates. Try again. Examples: 38,-122 or 38.122 or 38 -122';
$ec_lang['lpn_georef_goto']='Go to…';
$ec_lang['lpn_georef_twopt']='Use two known points';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Place the model exactly when the true latitude and longitude of two points on the drawing are known. Specify one of them, enter its latitude and longitude, then do the same for a second point. The position, scale, and rotation are computed from those two points. Press again to cancel, or press Esc.';
$ec_lang['lpn_georef_twopt_pick1']='Specify a point on your drawing whose latitude and longitude you know.';
$ec_lang['lpn_georef_twopt_pick2']='Now specify a second known point, as far from the first one as you can.';
$ec_lang['lpn_georef_twopt_same']='That is the point you picked first. Pick a different one.';
$ec_lang['lpn_georef_twopt_done']='The model is now placed on the two points entered. Check it, then press the Keep this placement button.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Bottom panel';
$ec_lang['lpn_pane_toggle_tip']='Show or hide the panel below the map. It holds graphs and a table for each kind of asset.';
$ec_lang['lpn_pane_resize']='Drag to make the panel taller or shorter';
$ec_lang['lpn_pane_tab_junctions']='Junctions';
$ec_lang['lpn_pane_tab_reservoirs']='Reservoirs';
$ec_lang['lpn_pane_tab_tanks']='Tanks';
$ec_lang['lpn_pane_tab_pipes']='Pipes';
$ec_lang['lpn_pane_tab_pumps']='Pumps';
$ec_lang['lpn_pane_tab_valves']='Valves';
$ec_lang['lpn_pane_tab_tip']='Edit assets as a spreadsheet-like table. Result columns cannot be edited. See Help, Notes for keyboard shortcuts.';
$ec_lang['lpn_pane_popout']='Open in a box';
$ec_lang['lpn_pane_none']='This network has none of these yet.';
// **A PERSISTENT NOTE, NOT A HOVER TIP** (Tom, 2026-09-08, asking for wording "to the effect that
// 'This table is intended to be ready for asset entry and creation by pasting from a spreadsheet'").
// His own sentence would be FALSE today: panePasteAt() fills rows that already exist and cannot
// create one, so the shipped sentence says what the table does. It also gets its own key rather than
// joining lpn_pane_none, which six Library sections share and which create rows by an Add button.
// **It names Help and no row under it** (Tom, 2026-09-08, ruling on the shipped wording): there
// are two Help buttons, so "Help, Fix something" reads as a path a reader cannot follow from where
// they are standing. Naming the menu alone is the part that is true from both of them.
// What the two alignment cells say for a Text that is attached to an asset. It is a STATE, not a
// value: an attached text takes its alignment from the side of the leader it sits on, so the stored
// centre/middle is not the answer and showing it read as a control that had stopped working. The
// cell carries lpn_field_text_attached_tip, which is the property popup's own sentence for the same
// rule.
$ec_lang['lpn_pane_text_attached']='Attached';
$ec_lang['lpn_pane_not_used']='Not used';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='Filtered by {q}. Showing {n} of {all}.';
$ec_lang['lpn_pane_filter_clear']='Show all';
// Added to the filtered table's line (Task 738): rows edited since Filter in table was pressed stay
// in the table even when they no longer match, dimmed and marked, until it is pressed again. {n} is
// how many. Worded as a label and a count so no plural form is needed.
$ec_lang['lpn_pane_filter_stale']='Rows that no longer match: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Nothing in this table matches the filter.';
// Selection only (Task 757): the Tables pane filtered to what is selected on the map. Parallel to
// lpn_pane_filter_note. The line names the Find filter too when both are on.
$ec_lang['lpn_pane_filter_sel_note']='Selection only. Showing {n} of {all}.';
$ec_lang['lpn_pane_filter_sel_and']='Filtered by {q} and selection only. Showing {n} of {all}.';
$ec_lang['lpn_pane_filter_sel_none']='None of the selected elements are in this table.';
$ec_lang['lpn_pane_sel_only']='Selection only';
$ec_lang['lpn_pane_sel_only_none']='No elements are selected. Select elements on the map first.';
// Show scenarios (Tom, 2026-10-05): the table's cell menu switch that lists every asset once per
// scenario, with a Scenario column after ID.
$ec_lang['lpn_pane_scn_show']='Show scenarios';
// Two switches on the cell menu while Show scenarios is on (Tom, 2026-10-07): keep only the rows whose
// scenario holds a value of its own in this table, and keep only the open scenario's rows.
$ec_lang['lpn_pane_scn_ov_only']='Overrides only';
$ec_lang['lpn_pane_scn_cur_only']='Current scenario only';
$ec_lang['lpn_pane_inactive_show']='Include inactive topology';
// The line above a table while either switch is on, beside the filter's own Show all. {filters} is one
// or both of the two switch names, joined by a comma; {n} the rows showing, {all} the rows without them.
$ec_lang['lpn_pane_scn_filter_note']='{filters}. Showing {n} of {all}.';
// The cell menu's item that removes the selected cells' scenario overrides, so each reads what its
// scenario inherits (Tom, 2026-10-06). Greyed when no selected cell holds one.
$ec_lang['lpn_ovm_child_ask']='Clear child overrides ({n} total)?';
$ec_lang['lpn_ovm_child_tip']='Child scenarios override this value ({n} total). Click to clear their overrides.';
$ec_lang['lpn_ovm_dot_clear']='Click to clear it.';
$ec_lang['lpn_ovm_dot_set']='Inherited. Click to make it an override in this scenario, holding the value shown.';
$ec_lang['lpn_pane_clear_override']='Clear override';
// The tip on a table cell holding a value set in its row's scenario (Tom, 2026-10-06: "Demand alt.:
// Max day"). {category} is an lpn_alt_cat_* name; {alternative} is the alternative's name, which
// in Basic mode is its scenario's.
$ec_lang['lpn_pane_scn_alt_tip']='{category} alt.: {alternative}';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Zoom & select';
$ec_lang['lpn_goto_on_map']='Go to on map';
$ec_lang['lpn_pane_select_on_map']='Select on map';
$ec_lang['lpn_pane_unselect_on_map']='Unselect on map';
$ec_lang['lpn_pane_print']='Print table';
// Tom, 2026-10-06. Copy with headings puts the heading line, unit included, above the selected cells; plain
// Copy never does. The two Export rows download the whole table as shown.
$ec_lang['lpn_pane_copy_heads']='Copy with column headings';
// Tom, 2026-10-07. File, Export to, ODS/XLSX/CSV file: a box asking which tables and which scenarios.
// {format} is ODS, XLSX or CSV, the file format's own name, never translated.
$ec_lang['lpn_export_table_title']='Export to {format}';
$ec_lang['lpn_export_table_current']='Current';
$ec_lang['lpn_export_table_all']='All';
$ec_lang['lpn_export_table_go']='Export';
$ec_lang['lpn_export_table_scn_note']='Results are exported only for the scenario last calculated.';

// **HIDE MAP READOUTS IS RETIRED, 2026-09-22** (Tom: "Hide map readouts was a print prep command.
// But it isn't very useful any more. Let's remove it."). lpn_clean_map, lpn_clean_map_off and
// lpn_clean_map_tip were deleted with the row; nothing else read them. lpn_clean_map and
// lpn_clean_map_tip are back since Task 805 for a DIFFERENT command (it hides controls, not readouts).
// THE PROJECT MENU (ROADMAP Task 467). Tom, 2026-08-20: "Maybe we can have a Project menu with
// Settings, Library, and Report under it?" Its rows borrow the names they already have --
// lpn_tool_settings, lpn_library_menu, lpn_time_run_report -- so a door cannot drift from the thing
// it opens. EPANET and epanet-js both say "project" for a network and its settings; "model" was the
// alternative and Tom kept Project.
// ROADMAP Task 523, Tom 2026-08-24. **The KEY is still lpn_menu_project and that is deliberate** --
// renaming it would drag the DOM id, two browser-pass specs and 27 lang files along for no
// user-visible gain, and `lpn_menu_project` is still what the menu bar's own element is called.
//
// "Water", not "Project": Project is a hair's breadth from File, and this menu is not about the
// document at all -- it is the business logic, and the business is water. It is also the one entry
// on the bar this page invents (File / Edit / Insert / View / Help are conventions that only pay
// while they are the conventions everyone knows), so it is the only one a rename costs nothing in
// familiarity. And it keeps EPANET's vocabulary off our surfaces, which is a standing rule here.
//
// NOT to be confused with `lpn_tab_menu` ('Project menu'), which really IS about the document and
// correctly keeps the word. Those two wearing one label was half the problem.
$ec_lang['lpn_menu_project']='Water';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Everything specific to water network modeling (except the animation play controls)';
$ec_lang['lpn_tables_menu']='Tables';
// Water > Morph (Task 781; Tom, 2026-10-14: *"I like the term 'Morph' (Transform) for this feature"*;
// first built as Change type, Tom, 2026-10-05: *"It would be nice to provide a tool under Water or Tables
// to Change node type for any asset, where if it has information that can't be ported to the new
// type, we alert and ask."*). The fly-out reuses lpn_tool_add_junction/_reservoir/_tank. The box it
// asks in lists one line per value lost: {id} is the asset's ID, {property} a field label the
// popup already uses, {value} the number or name with its unit, {scenario} a scenario's name.
// dev/asset-type.md.
$ec_lang['lpn_morph_menu']='Morph';
$ec_lang['lpn_morph_tip']='Change the selected nodes into junctions, reservoirs, or tanks, or the selected links into pipes, pumps, or valves. Each keeps its ID, its location, its connections, and every value the new type also has. In Base the asset itself is changed, and you are asked first if any value would be lost. In any other scenario the new type is an override in that scenario only, and the values only the new type has start from Settings > New assets.';
$ec_lang['lpn_morph_ok']='Morph';
// {ids} lists the selected assets of the other kind (nodes when a link type was chosen, and links
// when a node type was chosen), separated by commas.
$ec_lang['lpn_morph_other_kind']='A node can be morphed only into another type of node, and a link only into another type of link. Not morphed: {ids}';
// The Properties row shown where a scenario morphs the asset (Task 781): the type it is in this
// scenario, beside the override marker.
$ec_lang['lpn_field_type']='Type';
$ec_lang['lpn_field_type_tip']='The type of this asset in this scenario, set by Morph. Clear the override to use the parent scenario\'s type.';
$ec_lang['lpn_change_type_lost']='These values will be lost:';
// The key to the lines under it (Tom, 2026-10-06: *"Provide a key for the loss report. 'ID: Lost entry'."*).
$ec_lang['lpn_change_type_key']='Each line: ID: the property and value that would be lost';
$ec_lang['lpn_change_type_line']='{id}: {property} {value}';
$ec_lang['lpn_change_type_line_scenario']='{id}: {property} {value}, in scenario {scenario}';
$ec_lang['lpn_change_type_line_alternative']='{id}: {property} {value}, in alternative {alternative}';
$ec_lang['lpn_change_type_more']='And {n} more.';
// Heads the lines a tank-to-reservoir or reservoir-to-tank change states rather than loses: the
// water surface is carried, so the new head or water depth is listed with its value.
$ec_lang['lpn_change_type_surface']='These keep the water surface where it was. A reservoir\'s head is the tank\'s elevation plus its water depth, and a tank\'s water depth is the reservoir\'s head minus its elevation:';
$ec_lang['lpn_change_type_meaning']='These controls and rules test a node being changed, and will read it differently: a junction is tested by its pressure, and a tank or reservoir by its water level.';
// The link half (Tom, 2026-10-06: "Proceed."). Each heads a list of "ID: entry" lines.
$ec_lang['lpn_change_type_born']='These values are new, set as on a newly drawn asset:';
$ec_lang['lpn_change_type_no_curve']='{id}: No pump head curve, so the pump adds no head until one is chosen, and an .inp export writes it as a pipe';
$ec_lang['lpn_change_type_becomes']='{id}: {property} {value}, in scenario {scenario}, becomes {new}';
$ec_lang['lpn_change_type_customers']='Only a pipe serves customers, so these customers are connected instead to the node shown in parentheses, where their demand is already applied. They stay where they are drawn, and their demand is unchanged:';
$ec_lang['lpn_change_type_setting']='These controls and rules give or test the setting of a link being changed. A setting is a different quantity on a pipe, a pump, and a valve, so these will read it differently:';
$ec_lang['lpn_change_type_rules']='These rule lines name a link by its kind, and will name its new kind instead:';
$ec_lang['lpn_tables_menu_tip']='View and edit assets in tables in bottom panel.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Run simulation. Unnecessary when "Recalculate automatically" is on in Settings, Calculation, Hydraulics. When Recalculate is off, a toolbar Calculate button appears.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Recalculate automatically';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Turn off if recalculation is too slow. While this is on, the Calculate button is hidden.';
// **AN EDIT SAYS NOTHING AT ALL WHEN THE SWITCH IS OFF** (Tom, 2026-09-19: *"Recalc off Old
// values: Leave in place stale. Don't clear. Trust the user."*). `lpn_manual_results_cleared`
// stood here for part of one day and is DELETED, English-only, never translated: it announced a
// clearing that no longer happens. With the box unticked an edit leaves the last answers exactly
// where they are and says nothing about them, because whether they are still worth reading is
// the user's judgement and not this page's. Do not write a replacement -- a grey-out or a
// "stale" marker is the same decision in quieter clothes.
// Says what it MEASURED and where the switch is, in that order. The number first, because a person
// who has just waited a second already knows something is slow and wants it confirmed, not
// explained. {secs} is one decimal.
$ec_lang['lpn_time_run_slow']='This network took {secs} s to calculate, and it is set to recalculate after every change. To stop that and get a Calculate button back, turn off “Recalculate automatically” in Settings, under Calculation, Hydraulics.';
$ec_lang['lpn_time_no_report']='There is no run report yet. The report is the EPANET text report, so it appears after this network has been calculated.';
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Help';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Screenshot gallery';
$ec_lang['lpn_help_walkthroughs']='Walkthroughs';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Delete network';
$ec_lang['lpn_confirm_delete_network']='Delete every node, pipe, and text label in this project? The background image, the project name, and your settings are kept.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Find and replace';
// Copy and Paste properties (Task 782; Tom, 2026-10-12: a clipboard, no confirmation). Identity and
// placement are never pasted.
$ec_lang['lpn_copy_props_menu']='Copy properties';
$ec_lang['lpn_copy_props_done']='Copied properties of {id}.';
$ec_lang['lpn_copy_props_no_overrides']='No overrides to copy.';
$ec_lang['lpn_copy_props_done_ov']='Copied the overrides of {id} in this scenario.';
$ec_lang['lpn_paste_alt_created']='Created {category} alternative {name} for this scenario.';
$ec_lang['lpn_paste_props_menu']='Paste properties to selection';
$ec_lang['lpn_paste_props_off_none']='Nothing is copied. Right-click or long press an asset and choose Copy properties.';
$ec_lang['lpn_paste_props_off_select']='Select the assets to paste to, then choose Paste properties to selection.';
$ec_lang['lpn_paste_props_off_kind']='No selected asset can take the copied properties.';
$ec_lang['lpn_tsb_menu']='Time series graph';
// The map's right-click (and long press) menu on a Text and on a dragged label (2026-10-14). Edit text
// opens the in-place editor; Reset position sends a dragged label or an attached Text home.
$ec_lang['lpn_ctx_edit_text']='Edit text';
$ec_lang['lpn_ctx_reset_position']='Reset position';
$ec_lang['lpn_ctx_reset_position_off_tip']='Only a label or an attached Text that has been dragged from its own position can be reset.';
$ec_lang['lpn_tsb_off_tip']='Needs extended period results. Set a Total run time in Settings, Calculation, Time, and calculate.';
$ec_lang['lpn_tsb_close']='Close graph';
$ec_lang['lpn_tsb_resize']='Drag to resize';
$ec_lang['lpn_tsb_quantity']='Quantity to graph';
$ec_lang['lpn_tsb_max']='Close a graph before opening another. Up to {n} stay open.';
$ec_lang['lpn_paste_done_one']='Pasted properties of {id} to {to}. Values changed: {n}.';
$ec_lang['lpn_paste_done_many']='Pasted properties of {id} to {m} assets. Values changed: {n}.';
$ec_lang['lpn_paste_skip_breakdown']='Not pasted: {n} (demand is a list of categories).';
$ec_lang['lpn_paste_skip_valve']='Not pasted: {n} (the valve types differ).';
$ec_lang['lpn_find_title']='Find and replace';
$ec_lang['lpn_find_scope']='What to search';
$ec_lang['lpn_find_scope_all']='Everything';
$ec_lang['lpn_find_scope_source']='Source';
$ec_lang['lpn_find_source_no_chemical']='No chemical is being tracked, so no node has a source.';
$ec_lang['lpn_find_property']='Property';
$ec_lang['lpn_find_condition']='Condition';
$ec_lang['lpn_find_value']='Value';
$ec_lang['lpn_find_btn']='Find';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='Filter in table';
$ec_lang['lpn_find_filter_tip']='Show only the rows that match "What to search" above, in each table searched.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} of {all}';
$ec_lang['lpn_find_filter_summary']='Filtered by {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='This query doesn\'t apply to any table.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='contains';
$ec_lang['lpn_find_op_equals']='equal to';
$ec_lang['lpn_find_op_gt']='above';
$ec_lang['lpn_find_op_lt']='below';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='empty';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} found. Select one to go to it.';
$ec_lang['lpn_find_shift_hint']='Shift+click to toggle, adding if not in the selection set or removing if already in the selection set.';
$ec_lang['lpn_find_none']='Nothing matched.';
// The two extremes, as conditions on the same footing as "above" -- the Value box holds how
// many. "Top"/"Bottom" were changed to "Highest"/"Lowest" in Task 438 Wave 0, because on a MAP the
// top is an edge, and lowercased with the count moved in FRONT on 2026-08-26 -- both Tom's ("'n
// highest' and 'n lowest' will be better"). Every other operator is lowercase so the three
// pull-downs read as one sentence left to right, and "{n} highest" is the English for what the box
// holds where "highest {n}" asks the reader to work out that the number is a count and not a rank.
//
// **{n} IS A REAL PLACEHOLDER, AND THIS ONE STRING SERVES BOTH THE PULL-DOWN AND THE QUERY LINE**
// (Tom, 2026-08-27: *"What needs to match are the selector and the string, both per the lang
// file."*). The pull-down prints the letter n in the slot, because the number is not chosen yet;
// the query line above the Find button prints the count the search will actually use, so it reads
// "Pipe.Velocity 10 highest". Keep the placeholder: the query PARSER is built from this same value
// and reads a number wherever {n} stands, so a translation that dropped it would take the count
// off the line as well.
$ec_lang['lpn_find_op_top']='{n} highest';
$ec_lang['lpn_find_op_bottom']='{n} lowest';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Enter what to look for.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Connectivity';
$ec_lang['lpn_find_prop_demand_desc']='Description of this demand category';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='no links at node';
$ec_lang['lpn_find_op_conn_noopen']='no open links at node';
$ec_lang['lpn_find_op_conn_nolinksource']='no link path to a source';
$ec_lang['lpn_find_op_conn_noopensource']='no open path to a source';
// A result row prints the NARROWEST condition true of that node beside its id, because "no links"
// says more than "no open path to a source" and both are true of the same node. It prints the
// SAME four keys above with the first letter capitalized in code (findConnLabel()), not a second
// capitalized copy of each (Task 699, Tom 2026-09-30: "do the Find redesign").
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Every node is connected.';
$ec_lang['lpn_find_conn_no_fixed']='This network has no reservoir or tank, so there is no source to reach. Only no links at node and no open links at node can be searched.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='The given search as a text query. Changing the query updates the controls above.';
$ec_lang['lpn_find_query_label']='Query';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Combine conditions with AND, OR and ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='AND';
$ec_lang['lpn_find_q_or']='OR';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='The controls cannot express the query below, so they are hidden.';
$ec_lang['lpn_find_q_restore']='Use the controls instead';
$ec_lang['lpn_replace_q_bad']='This query cannot be understood, so nothing can be changed. Fix it above first.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(at character {n})';
$ec_lang['lpn_find_q_err_empty']='The query is empty, so nothing will be searched.';
$ec_lang['lpn_find_q_err_scope']='There is nothing called {w} to search. Try one of: {list}';
$ec_lang['lpn_find_q_err_dot']='Put a dot between what to search and its property, like Junction.ID';
$ec_lang['lpn_find_q_err_prop']='Not a property of {scope}: {w}. Try one of: {list}';
$ec_lang['lpn_find_q_err_op']='Not a condition for {prop}: {w}. Try one of: {list}';
$ec_lang['lpn_find_q_err_value']='This condition needs a value after it: {op}';
$ec_lang['lpn_find_q_err_quote']='Put quotes around a text value: {w} is not a number.';
$ec_lang['lpn_find_q_err_quote_end']='This quoted text has no closing quote.';
$ec_lang['lpn_find_q_err_close']='This parenthesis ( was opened and never closed.';
$ec_lang['lpn_find_q_err_open']='This parenthesis ) closes nothing.';
$ec_lang['lpn_find_q_err_end']='Nothing was expected after this. Join two searches with {and} or {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Change what was found';
$ec_lang['lpn_replace_prop']='Property to change';
$ec_lang['lpn_replace_value']='New value';
$ec_lang['lpn_replace_source']='New value source';
$ec_lang['lpn_replace_asked']='Elevations requested for nodes ({n}). Results appear when they are received.';
$ec_lang['lpn_replace_btn']='Replace';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Change assets ({n})?';
$ec_lang['lpn_replace_apply']='Change them';
$ec_lang['lpn_replace_done']='Assets changed: {n}. This can be undone in one step.';
$ec_lang['lpn_replace_none']='Nothing would change.';
$ec_lang['lpn_replace_no_value']='Enter the new value.';
$ec_lang['lpn_replace_scope']='Choose one kind of asset above to change values on.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='Profile';
$ec_lang['lpn_graphs_menu']='Graphs';
// **THE SYNONYMS ARE IN dev/plain-sentences.md, THE CHANNEL MEANT FOR THEM.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission a plain sentence requires. Same text, correct channel.
$ec_lang['lpn_profile_title']='Profile along a path';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Select the node where the path starts.';
$ec_lang['lpn_profile_draw_more']='Move over the map to see the path. Select a node to add it. Double-click to finish. Esc cancels.';
$ec_lang['lpn_profile_draw_blocked']='No route from {a} to {b}. Select a different start or end node.';
$ec_lang['lpn_profile_tap_start']='Select the node where the path starts.';
$ec_lang['lpn_profile_tap_more']='Select a node to see the path. Press and hold to add it. Double-tap to finish. Press Profile again to cancel.';
$ec_lang['lpn_profile_say_idle']='Press Profile again to select a new path on the map.';
$ec_lang['lpn_profile_none']='No path yet. Press Profile again to select one on the map.';
$ec_lang['lpn_profile_choose']='Select a start node and an end node.';
$ec_lang['lpn_profile_no_path']='These two nodes are not connected by any route.';
$ec_lang['lpn_profile_no_solve']='No results yet, so only the ground line is drawn.';
$ec_lang['lpn_profile_summary']='Nodes: {n}, length: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Distance along the route ({u})';
$ec_lang['lpn_profile_axis_elev']='Elevation and head ({u})';
$ec_lang['lpn_profile_ground']='Ground surface';
$ec_lang['lpn_profile_hgl']='Hydraulic grade line';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Edit';
$ec_lang['lpn_profile_edit_tip']='Change one end of the path, or take one node off it, without drawing the whole path again.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Drag any point on the path to move it. Select a point you added to take it off.';
$ec_lang['lpn_profile_edit_tap']='Drag any point on the path to move it. Select a point you added to take it off.';
$ec_lang['lpn_profile_edit_nowhere']='A point on the path has to be a node. The path is unchanged.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Saved paths';
$ec_lang['lpn_profile_new']='New saved path…';
$ec_lang['lpn_profile_new_name']='Path {n}';
$ec_lang['lpn_profile_rename']='Rename path…';
$ec_lang['lpn_profile_delete']='Delete path';
$ec_lang['lpn_profile_open']='Open EPANET profile file…';
$ec_lang['lpn_profile_file_done']='Profile read from the file: {used} of {total} nodes found in this network.';
$ec_lang['lpn_profile_file_missing']='Named in the file but not in this network: {ids}.';
$ec_lang['lpn_profile_file_short']='The file names fewer than two nodes in this network, so there is no profile to draw.';
$ec_lang['lpn_profile_prompt_name']='Name for this path';
$ec_lang['lpn_profile_delete_confirm']='Delete the saved path {name}? The drawing itself is not changed.';
$ec_lang['lpn_profile_none_saved']='No saved paths yet';
$ec_lang['lpn_profile_missing']='The saved path {name} uses nodes that are not in this project: {ids}';
// ---- the time-series chart (ROADMAP Task 599) -------------------------------------------------
// One or more assets' chosen value against time across an extended period simulation. {id} is an
// asset name the user gave, {n} a count and {steps} a count of reporting times; all substituted,
// never concatenated, so a language that puts them somewhere else can.
//
// **THE Y AXIS HAS NO KEY OF ITS OWN, AND THAT IS DELIBERATE.** Its title is the quantity's own
// whole label with the project's unit in parentheses, built by the same expression the map's color
// key already uses -- so the chart and the key name one quantity the same way and there is no
// second place a wording could drift. The quantity labels themselves are the Labels popover's, in
// every language it already has them in.
$ec_lang['lpn_ts_menu']='Time series';
$ec_lang['lpn_ts_tip']='Graph one or more assets across an extended period simulation.';
$ec_lang['lpn_ts_title']='Values versus time';
$ec_lang['lpn_ts_group_nodes']='Nodes';
$ec_lang['lpn_ts_group_links']='Links';
$ec_lang['lpn_pgraph_none']='This asset has no results in the current run.';
// The Properties graph's own selector entry for a source share (Tom, 2026-09-30: "In selector, use
// 'Source share from {trace node}'"). Distinct from the shared lpn_result_source_share, which still
// labels the bare quantity everywhere else -- the Tables column, Find's property list, the Labels
// popover and the colour legend -- where naming the trace node in every heading would be clutter.
$ec_lang['lpn_pgraph_source_share_from']='Source share from {node}';
$ec_lang['lpn_result_pump_head']='Head';
$ec_lang['lpn_result_pump_head_tip']='The head the pump adds from suction to discharge, shown as a positive number. The solver and EPANET files carry it as a negative head loss.';
// The Full report puts every node and link in one table, where a node's Head column already sits, so a
// pump's column there says whose head it is. Elsewhere the pump's own row or tab says so, and lpn_result_pump_head is enough.
$ec_lang['lpn_report_pump_head']='Pump head';
$ec_lang['lpn_ts_add']='Add selected';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='Nothing found to add.';
$ec_lang['lpn_ts_clear']='Remove all';
$ec_lang['lpn_ts_chip_tip']='Take {id} off the graph';
$ec_lang['lpn_ts_none']='Nothing to graph yet. Select assets on the map and press Add selected.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='No extended period results yet. Press Calculate to run the simulation.';
$ec_lang['lpn_ts_summary']='Assets: {n}, reporting times: {steps}';
$ec_lang['lpn_ts_axis_time']='Elapsed time';
// EPANET's Frequency Plot (Task 600): one value over every junction or every pipe, at the time the
// map shows, against the percent of them less than it. "Percent less than" is EPANET's own axis
// title. {n} and {total} are counts, {time} an elapsed time; all substituted, never concatenated.
// The Junctions/Pipes choice reuses lpn_pane_tab_junctions and lpn_pane_tab_pipes.
$ec_lang['lpn_freq_menu']='Frequency';
$ec_lang['lpn_freq_tip']='Frequency distribution for a property';
$ec_lang['lpn_freq_title']='Distribution of values';
$ec_lang['lpn_freq_none']='No results for this value yet, so there is nothing to graph.';
$ec_lang['lpn_freq_summary']='Plotted: {n} of {total}';
$ec_lang['lpn_freq_summary_time']='Plotted: {n} of {total}, at {time}';
$ec_lang['lpn_freq_axis_percent']='Percent less than';
// EPANET's Contour Plot (Task 600), drawn as a layer under the map rather than in a window of its
// own, from the pipes outward. {n} and {p} are counts, {k} and {i} numbers, {u} a unit symbol, {m} a
// distance in metres; all substituted. lpn_contour_buffer_unit follows the Buffer number box.
// lpn_contour_consent_1..4 are the terrain question's four paragraphs, reworded for what the contour
// plot sends: tile numbers for the network's area, not each node's latitude and longitude.
$ec_lang['lpn_contour_menu']='Contour';
$ec_lang['lpn_contour_tip']='Show a contour plot on the map: the node colors spread along and beside the pipes, with labeled contour lines. Opens a box to tune it or turn it off.';
$ec_lang['lpn_contour_plot']='Contour plot';
$ec_lang['lpn_contour_show']='Show contours';
$ec_lang['lpn_contour_show_tip']='Clear to hide the fill and the contour lines; check to bring them back as they were. Node colors stay.';
$ec_lang['lpn_contour_fill']='Fill';
$ec_lang['lpn_contour_fill_tip']='Smooth blends the colors from one class to the next. Bands paints each class of the color key flat.';
$ec_lang['lpn_contour_fill_smooth']='Smooth';
$ec_lang['lpn_contour_fill_bands']='Bands';
$ec_lang['lpn_contour_opacity']='Fill opacity';
$ec_lang['lpn_contour_lines']='Contour lines';
$ec_lang['lpn_contour_interval']='Interval';
$ec_lang['lpn_contour_buffer']='Buffer';
$ec_lang['lpn_contour_buffer_unit']='× median pipe length';
$ec_lang['lpn_contour_buffer_tip']='Reach of the color from each pipe, as a multiple of the median pipe length. It fades out over the outer part.';
$ec_lang['lpn_contour_few']='Too few nodes to contour.';
$ec_lang['lpn_contour_support']='Contour plot: {n} nodes, interpolated along {p} pipes and up to {k} times the median pipe length beside them. No color across pumps, valves, or closed links.';
$ec_lang['lpn_contour_support_lines']='Contour lines every {i} {u}.';
$ec_lang['lpn_contour_too_many']='Too many contour lines at this interval; widen it to draw them.';
$ec_lang['lpn_contour_dem']='Ground between nodes from Mapbox DEM';
$ec_lang['lpn_contour_dem_tip']='Between nodes, pressure becomes the interpolated head minus the height of the ground from Mapbox DEM, so it can fall below the lowest node pressure on a hill the network has no node on. Treat the ground as a contour map, not a survey.';
$ec_lang['lpn_contour_support_dem']='Between nodes, pressure is the interpolated head minus the ground elevation from Mapbox DEM, sampled about every {m} m.';
$ec_lang['lpn_contour_dem_failed']='The ground could not be read from Mapbox DEM, so pressure is interpolated between nodes alone.';
$ec_lang['lpn_contour_consent_1']='Drawing pressure over the ground sends the area your network covers, as Mapbox map tile numbers, to api.mapbox.com, to read the height of the ground there.';
$ec_lang['lpn_contour_consent_2']='This is a different question from the map pictures behind your project. The pictures only say where you are looking. These tiles say where your network is. Mapbox will receive those tile numbers and your IP address. We send nothing else: no name, no pipes, no project. We keep no record of it, and nothing is stored on this device except your answer to this question.';
$ec_lang['lpn_contour_consent_3']='May we send the tile numbers of your network\'s area to Mapbox?';
$ec_lang['lpn_contour_consent_4']='If you say no, everything else on this page keeps working exactly as it does now, and the contour plot is drawn between nodes alone. We remember a yes so that we need not ask again. A no is not stored at all.';
// EPANET's System Flow plot (Task 600). "System flow" is its Graph Selection name, "System flow
// balance" its window title, "Produced" and "Consumed" its series. The definition is its own code
// (Fgraph.pas GetSysFlow): junction and reservoir demands only, split by sign; tanks in neither.
// The axis reuses lpn_result_flow and lpn_ts_axis_time.
$ec_lang['lpn_sysflow_menu']='Flow balance';
$ec_lang['lpn_sysflow_tip']='Graph the total flow produced and the total flow consumed against time, across the extended period simulation. Tanks are in neither total, so where the two lines part, the tanks are filling or draining.';
$ec_lang['lpn_sysflow_title']='Flow balance';
$ec_lang['lpn_sysflow_produced']='Produced';
$ec_lang['lpn_sysflow_produced_tip']='Total flow into the network from reservoirs and from negative demands.';
$ec_lang['lpn_sysflow_consumed']='Consumed';
$ec_lang['lpn_sysflow_consumed_tip']='Total of every positive demand: water drawn from the network at junctions, and any flow into a reservoir.';
$ec_lang['lpn_view_units']='Units';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Save all';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Project{n}';
$ec_lang['lpn_project_copy_suffix']='(copy)';
$ec_lang['lpn_project_rename']='Rename';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='New project…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='New project';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='Coordinate system';
$ec_lang['lpn_new_coordsys_tip']='Choose the coordinate system of your network. The only way to change this choice is with “File, Convert as…” to a new project, and that conversion is approximate.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Local, schematic, or custom';
$ec_lang['lpn_new_coordsys_local_tip']='Not georeferenced. Use the Map, World map… or Map, Background image… menu later if you wish to add a backdrop.';
// ---- THE COORDINATE SYSTEM BOX -----------------------------------------------------------------
// Tom's summary: it "uses the map view as a UX element to filter the universe of projections to the
// ones applicable to the project (view). Lets the user filter by name and select a projection at
// any time." (His own words, kept verbatim; "projection" in visitor strings became "coordinate
// system" on 2026-09-25 -- don't expose the word "projection".) Two filters over one catalogue, and
// the catalogue itself is not keyed: a coordinate system's NAME is the EPSG register's own, exactly
// as the OpenStreetMap credit is, and a GIS reader in any language looks for those characters.
// **THE SUB-BOX'S OWN TITLE** (Tom, 2026-09-25) is lpn_new_coordsys, as are its list label and
// the New project box's chooser button (Task 699): it names the box's own subject rather than
// either caller's radio label.
// The spatial filter. A zoned system covers a strip of the Earth and nothing outside it, so a place
// answers most of the question by itself: searching a town in Arizona leaves two UTM zones standing
// out of a hundred and twenty.
$ec_lang['lpn_crs_view']='Filter by map view';
$ec_lang['lpn_crs_view_tip']='Offer only the coordinate systems that cover the place the map is looking at. Clear it to read the whole list.';
$ec_lang['lpn_crs_place']='Place name search';
$ec_lang['lpn_crs_place_tip']='Searches are sent to the OpenStreetMap place-name service, and permission is requested the first time. A new geographic project also starts at the place found here.';
$ec_lang['lpn_crs_search']='Search';
$ec_lang['lpn_crs_name']='Coordinate system name filter';
$ec_lang['lpn_crs_name_tip']='Text that filters the list: only the coordinate systems whose name or EPSG code contains it are shown.';
$ec_lang['lpn_crs_list_tip']='The coordinate systems that pass the filters above. Choose one, then press OK.';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='No place has been searched for yet, so the whole list is offered. Search for a place above or zoom the map to narrow it.';
$ec_lang['lpn_crs_count']='{n} of {total} coordinate systems listed.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} of {total} coordinate systems cover this network.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(no map)';
// Shown beside WGS 84 (EPSG:4326) in the chooser only (Task 775), never on the status strip.
$ec_lang['lpn_crs_suggested_mark']='(suggested)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} is one of the few listed coordinate systems without usable projection information. This means that world map, place name search, and DEM elevations don\'t work. Your coordinates are unaffected.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='unnamed';
$ec_lang['lpn_crs_none']='Not georeferenced';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Units and other settings are stored with each project, so this choice applies to this project only and is not saved as a browser setting. To reuse preferences, save an empty project as a template and start each new project from it.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Petaluma, California';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Create';
$ec_lang['lpn_file_open']='Open…';
$ec_lang['lpn_file_save']='Save';
$ec_lang['lpn_file_saveas']='Save as…';
$ec_lang['lpn_file_revert']='Revert';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Recent files';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_denied']='Permission to open that file was not given, so it was not opened.';
$ec_lang['lpn_recent_gone']='Could not open {file}. It may have been moved, renamed, or deleted, so it was taken off the recent list.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='New project';
$ec_lang['lpn_tab_all']='All projects';
$ec_lang['lpn_tab_menu']='Project menu';
$ec_lang['lpn_tab_duplicate']='Duplicate';
$ec_lang['lpn_tab_move_left']='Move left';
$ec_lang['lpn_tab_move_right']='Move right';
$ec_lang['lpn_tab_unsaved']='Not saved to a file';
$ec_lang['lpn_import_bad_file']='That file could not be read as a project saved from this page.';
$ec_lang['lpn_import_no_room']='There is not enough browser storage left to add this project. Delete a project you no longer need and try again.';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='OK';
// **TASK 718** (Tom, 2026-09-25: *"We have three import items. It's probably time for an Import
// sub-menu."*). The three rows -- surveyed points, an EPANET file, and libraries -- now open as a
// fly-out off one row, the same submenu idiom Help > Toolbar already uses. Each row keeps its
// own existing key and tip; only this one row is new.
$ec_lang['lpn_file_import_menu']='Import…';
$ec_lang['lpn_file_import_inp']='EPANET file…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Create a new project from an EPANET file, either the .inp export format (preferred) or the native .net format (last resort).';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
// File > Export is a submenu (Tom, 2026-10-06), so its rows drop the verb the heading carries. The
// two keys above are what the rows were called before it.
$ec_lang['lpn_file_export_menu']='Export…';
$ec_lang['lpn_file_export_item_inp']='EPANET file…';
$ec_lang['lpn_file_export_item_geojson']='GeoJSON file…';
$ec_lang['lpn_file_export_item_ods']='ODS file…';
$ec_lang['lpn_file_export_item_xlsx']='XLSX file…';
$ec_lang['lpn_file_export_item_csv']='CSV file…';
$ec_lang['lpn_file_export_tables_tip']='Download the tables as the Tables pane shows them, in one workbook with a sheet for each table (and for each scenario you choose), plus a sheet for each library their IDs refer to: patterns, curves, pipe types, and fittings. Results are included for the scenario last calculated only.';
$ec_lang['lpn_file_export_csv_tip']='Download a table as the Tables pane shows it. One table comes as a single CSV file with no libraries. Several tables or scenarios come as one zip file of CSV files, with a file for each library their IDs refer to. Results are included for the scenario last calculated only.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Download this network as an EPANET .inp file (in a zip file with its image if applicable). Anything the .inp format cannot hold is listed for you afterwards.';
$ec_lang['lpn_status_inp_exported']='Exported {file}.';
$ec_lang['lpn_status_inp_exported_picture']='Exported {zip}, holding the EPANET file {file}, its background picture {picture}, and the world file {world}. Extract all three into one folder, then open the .inp there in EPANET; the picture comes with it.';
$ec_lang['lpn_status_inp_exported_no_picture']='Exported {file}. The background picture could not be saved, so the .inp names none; in EPANET, add it with View > Backdrop > Load.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_flat_customers_inactive']='{n} of these customers are assigned to a junction that is inactive in this scenario, so their demand is not in the file.';
$ec_lang['lpn_inp_export_flat_inactive_controls']='These controls and rules refer to an asset that is inactive in this scenario, so they are not in the file: {ids}';
$ec_lang['lpn_inp_export_differences']='{n} things the .inp format cannot hold.';
$ec_lang['lpn_inp_export_difference_one']='One thing the .inp format cannot hold.';
$ec_lang['lpn_inp_export_refused']='This project cannot be written as an EPANET file: {detail}';
// Task 772: File > Export DXF file. The model's data for AutoCAD and other CAD programs.
$ec_lang['lpn_file_export_item_dxf']='DXF file…';
$ec_lang['lpn_file_export_dxf_tip']='Download this network for AutoCAD and other CAD programs: nodes as symbol blocks, pipes, pumps, and valves as polylines, and every asset as a block whose attributes carry its ID and property values in the project units.';
$ec_lang['lpn_dxf_export_no_utm']='The DXF file was not written: this network lies outside the latitudes UTM covers (80° S to 84° N), and a drawing needs a flat grid to be drawn on.';
$ec_lang['lpn_dxf_export_refused']='The DXF file was not written: the coordinate conversion it needs did not load. Check the connection and try again.';
$ec_lang['lpn_dxf_export_failed']='The DXF file was not written: an error in this page stopped it ({error}).';
// The read-me written into the file as a block of attributes, on a layer that does not plot; the
// file writes it in capital letters. Each says what
// the coordinates are and claims no coordinate system the file does not have. {unit} is a length
// unit as written in English (ft, m), not translated; {crs} is a coordinate system name with its EPSG code.
$ec_lang['lpn_dxf_note_grid']='Coordinates: the X and Y of this project, in {unit}. No coordinate system is stated.';
$ec_lang['lpn_dxf_note_crs']='Coordinates: {crs}, exactly as this project states them.';
$ec_lang['lpn_dxf_note_geo']='Coordinates: {crs}, in meters, not latitude and longitude. The latitudes and longitudes of the project were converted to that grid.';
$ec_lang['lpn_dxf_exported_geo']='Exported {file}. Its coordinates are {crs}, in meters, not latitude and longitude.';
// {prefix} is the layer-name prefix, C-WATR-MODL-; {example} is a whole layer name such as
// C-WATR-MODL-NODE-BASE.
$ec_lang['lpn_dxf_note_blocks']='Layers are named {prefix}, the asset code, a hyphen, and the alternative, as in {example}. Each element is a block inserted at scale 1 with attributes 1 unit high; scale the blocks to set the text height. Every attribute is visible; the attributes of one element are stacked in a column beside its symbol.';
// {n} is a whole number; {max} is 2049. Each shortened value ends in three periods (...).
$ec_lang['lpn_dxf_note_shortened']='Values longer than a DXF file allows ({max} characters): {n}. Each was shortened and ends in three periods.';
// {n} is a whole number; {tag} is an attribute tag in capitals, BASE_DEMAND in English.
$ec_lang['lpn_dxf_note_categories']='Junctions with more than one demand category: {n}. Their {tag} attribute holds the sum of the base demands of all categories.';
// GeoJSON export (Task 728). The command is worded like Export EPANET file. Positions in a GeoJSON
// file are always longitude and latitude (RFC 7946), so a project with no place on the Earth is
// refused and told how to get one, never written with an invented coordinate system.
$ec_lang['lpn_file_export_geojson_tip']='Download this network as a GeoJSON file for QGIS, ArcGIS Pro and other GIS programs. Junctions, tanks and reservoirs are points, and pipes, pumps and valves are lines that follow their vertices. Positions are latitude and longitude. Results are included only when the network has been solved.';
// Workspace export and import (Tom, 2026-10-07). {file}, {n}, {r}, {u} and {version} are filled in by the page.
$ec_lang['lpn_file_export_item_workspace']='Workspace…';
$ec_lang['lpn_file_export_workspace_tip']='Download a small file holding the layout of this page: where the panes, table columns and boxes sit, their sizes, and which are open, docked or hidden, plus the display options of this page, such as which help bubbles and the hover card are shown. Your projects, project settings and cookies (language, consent, units) are not in it. Load it on another screen or browser with File, Import, Workspace.';
$ec_lang['lpn_file_import_workspace']='Workspace…';
$ec_lang['lpn_file_import_workspace_tip']='Apply a workspace file saved with File, Export, Workspace: the layout of the panes, table columns and boxes, and the display options of this page, such as which help bubbles and the hover card are shown. Your projects and cookies are not touched.';
$ec_lang['lpn_workspace_exported']='Workspace saved to {file}: {n} settings.';
$ec_lang['lpn_workspace_imported']='Workspace applied from {file}. Settings applied: {n}. Returned to their defaults: {r}.';
$ec_lang['lpn_workspace_ignored']='Entries ignored because they were not recognized: {u}.';
$ec_lang['lpn_workspace_refused_unreadable']='This file could not be read as a workspace, so nothing was changed.';
$ec_lang['lpn_workspace_refused_format']='This is not a workspace file saved by this page, so nothing was changed.';
$ec_lang['lpn_workspace_refused_newer']='This workspace file was saved by a newer version of this page (format {version}), so nothing was changed.';
$ec_lang['lpn_workspace_confirm']='Replace this browser\'s workspace layout with the one in the file?';
$ec_lang['lpn_workspace_refused_storage']='Browser storage is full or unavailable, so the workspace was not applied.';
$ec_lang['lpn_geojson_refused_local']='A GeoJSON file holds latitude and longitude only, and this project is drawn on a local grid with no place on the Earth. Georeference it first with Map, World map, Attach, then export again.';
$ec_lang['lpn_geojson_refused_range']='These positions are not valid latitudes and longitudes: {detail}';
$ec_lang['lpn_geojson_refused_crs']='The coordinate system of this project ({detail}) is not known to this page, so its positions cannot be converted to latitude and longitude. Use Convert as… to copy the project into one this page knows, then export again.';
$ec_lang['lpn_geojson_refused_empty']='There is nothing to export yet. Draw or open a network first.';
$ec_lang['lpn_geojson_results_in']='The results on screen are included.';
$ec_lang['lpn_geojson_results_out']='No results are included, because the network is not solved.';
$ec_lang['lpn_inp_bad_file']='That file could not be read as an EPANET network file.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='This looks like an EPANET .net file, but this page could not read it. Open it in EPANET and use the File, Export, Network command there to save it as an .inp file, then import that.';
$ec_lang['lpn_inp_report_heading']='Imported {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} junctions, reservoirs and tanks, {links} pipes, pumps and valves, in {units}.';
$ec_lang['lpn_inp_report_clean']='All data in the file was imported. Nothing was omitted.';
$ec_lang['lpn_inp_report_label_anchor']='Text labels are placed as EPANET places them, from their top left corner.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='EPANET files contain no coordinate system, so this file will not initially be georeferenced. To place it on a world map, use Map, World map… To convert its coordinates, use File, Convert as…';
$ec_lang['lpn_inp_backdrop_attach']='Attach {file}…';
$ec_lang['lpn_inp_backdrop_attach_tip']='A web page cannot open the picture by its name. Choose it on your device and it is placed where the file says it belongs.';
$ec_lang['lpn_inp_backdrop_attached']='Attached {file}, placed where the file says it belongs.';
$ec_lang['lpn_inp_backdrop_attached_other']='Attached {picked}, placed where the file says it belongs. The file names {file}, which is a different name.';
$ec_lang['lpn_inp_report_lead']='This page does not use every EPANET feature, but no data in the file is discarded. The list below shows data in the file that is retained but not used, and any changes made during import:';
$ec_lang['lpn_inp_drop_headloss']='This file does not use the Hazen-Williams formula. This page computes Hazen-Williams, so the pipe roughness numbers were kept exactly as written, but the results here will not match the results in EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='These tanks are not straight-sided: the file gives their shape as a volume curve. The curve is kept in the Libraries box, the tank still refers to it, and an extended period simulation uses it to compute the level as the tank fills and drains. A single-period analysis is unaffected, because the water surface is at the level stated in the file. The diameter in the file is kept beside the curve and is used to draw and solve a tank with no curve.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='These throttle valves were imported as throttle valves, with the loss stated in the file.';
$ec_lang['lpn_inp_drop_valve_active']='These valves control pressure or flow, and their status changes with hydraulic conditions. They were imported without loss of data, and this page solves them.';
$ec_lang['lpn_inp_drop_valve']='These valves are described by a curve or by a fixed pressure drop, and this page has no such asset. They were imported as open pipes, so the network remains connected, but pressure and flow are no longer controlled at those locations.';
$ec_lang['lpn_inp_drop_cv']='In EPANET these pipes allow flow in one direction only (check valves). They were imported as ordinary pipes, so flow may now pass in either direction.';
$ec_lang['lpn_inp_drop_demands']='These junctions had more than one demand. The demands were added together into the single demand this page holds.';
$ec_lang['lpn_inp_drop_patterns']='This page did not read the demand patterns, because the extended period simulation module did not load. Every demand is the value stated in the file.';
$ec_lang['lpn_inp_drop_demand_pattern']='These junctions have demands that vary over the run. Their patterns were imported in full, and the demand shown is the value at the time on the clock.';
$ec_lang['lpn_inp_drop_emitters']='These junctions have a sprinkler or leak coefficient. It was kept, it is being solved, and each of them shows it in the Emitter coefficient box in its properties.';
$ec_lang['lpn_inp_drop_curve_long']='This pump curve had more than three points. Its lowest, middle and highest points were kept, because this page fits a curve to three points at most.';
$ec_lang['lpn_inp_drop_curve_missing']='This pump refers to a curve that is not in the file. The pump was imported without a curve, so it adds no head.';
$ec_lang['lpn_inp_drop_pump_other']='This pump is described by the power it draws, rather than by a curve. It was imported without a curve, so it adds no head.';
$ec_lang['lpn_inp_drop_head_pattern']='These reservoirs have a head that varies over the run. Their patterns were imported in full, and the water level shown is the value at the time on the clock.';
$ec_lang['lpn_inp_drop_pump_speed']='These pumps run at a speed other than the speed at which their curve was measured, or change speed over the run. The speed and its pattern were imported in full, and the head shown is the value at the time on the clock.';
$ec_lang['lpn_inp_drop_setting']='These pipes, pumps, and valves have a setting this page cannot hold. They were imported as open.';
$ec_lang['lpn_inp_drop_rules']='This file has rule-based controls. This page reads and applies them. When the model is run, the rules are applied, with every level, pressure, and flow in them converted to the units this project displays. Open Rules under Libraries to view or edit a rule. Rules are kept exactly as stated in the file and are written back if you save an EPANET file.';
$ec_lang['lpn_inp_drop_eps']='This file describes an extended period simulation. The extended period simulation module of this page did not load, so only the initial conditions were imported.';
$ec_lang['lpn_inp_drop_quality']='This file describes water quality: initial concentrations and reaction rates in pipes and tanks. This page reads and uses those values. Choose a chemical under Settings, Calculation, Quality, then run the model to compute concentrations throughout the network over the run. The lines are kept and are written back if you save an EPANET file.';
$ec_lang['lpn_inp_drop_sources_mixing']='This file states where a chemical is injected into the network and how water mixes in each tank. Each source is shown on the node where it is applied, and each tank shows its mixing model. Both are used when the network is run over a total run time.';
$ec_lang['lpn_inp_drop_energy']='This EPANET file includes pumping cost modelling data. This page reads it and uses it. Run the model, then open Water, Reports, Pump energy to see how long each pump ran, the power it drew, the energy it used and what that cost. The lines are kept, and they are written back if you save an EPANET file.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='This file assigns tags to some junctions, pipes, or other assets. Every tag was imported and appears in the properties of its asset, where it can be viewed or edited.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='This file contains EPANET report-format settings. The run report is available under Reports, Run, but it uses the standard EPANET format rather than the format these settings specify. The lines are kept and are written back if you save an EPANET file.';
$ec_lang['lpn_inp_drop_sections']='This file holds a section that this page does not read at all. Nothing here uses it. It is kept whole, and it is written back if you save an EPANET file.';
$ec_lang['lpn_inp_drop_comments']='These comment lines in the patterns or simple controls of this file were not imported, because this page has no place to keep them (for example, between the rows of one pattern). Every pattern and control was imported in full.';
$ec_lang['lpn_inp_drop_quality_options']='This file states EPANET water quality options: the Quality option, which names the kind of water quality analysis, and two settings that go with a chemical, Relative diffusivity and Quality tolerance. All three are kept and used. Water age, source trace, and a chemical are each computed here, and the two chemical settings are used when a chemical is run. All of them are written back if you save an EPANET file.';
$ec_lang['lpn_inp_drop_file_options']='This file refers to an auxiliary file: Map, which holds coordinates, or Hydraulics, which holds previously computed hydraulics. This page cannot open either, so the lines are kept as they are and written back if you save an EPANET file.';
$ec_lang['lpn_inp_drop_other_options']='This file states options this page does not read. Nothing here uses them. They are kept and are written back if you save an EPANET file.';
$ec_lang['lpn_inp_drop_net_options']='This EPANET .net file states settings that this page has no control for, so their values are listed here rather than carried across. Everything else came over. If you need them, open the file in EPANET and use File, Export, Network to save it as an .inp file, then import that.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='This was an EPANET .net file, the native EPANET project format. The format has no published specification; this page reads it using a format inferred from example files, so use it only when no .inp file is available. The .inp file is the documented format that other programs read: in EPANET use File, Export, Network to write one, and import that file instead whenever possible.';
$ec_lang['lpn_inp_drop_backdrop']='This file names a background picture but does not contain the picture itself. Add it yourself with File, Background image, Add image.';
$ec_lang['lpn_inp_drop_dangling']='These pipes name a junction that is not in the file, so they were left out.';
$ec_lang['lpn_inp_drop_units']='The flow unit named in this file is not one this page knows, so every number was read as gallons per minute. Check every value before using the results.';
$ec_lang['lpn_inp_drop_anchor_missing']='This text was attached to a junction, reservoir, or tank that is not in the file. It was imported as free text at the location stated in the file and is not attached to any asset.';
$ec_lang['lpn_import_notes_heading']='This project was read in from an EPANET file. Some of what that file holds is kept but is not used on this page.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='Opened {name} from a file, and added it to this browser as a new project.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='Project file';
// Where there is no File System Access API -- Firefox, Safari, or any page not served over https --
// a save cannot connect to a file, so every press really is another copy in the downloads folder.
// The label says which of the two you are getting rather than leaving the duplicate looking like a
// bug.
// **The MENU still says Save and Save as… there** (Tom, 2026-08-04: *"'Download a copy' is a mistake,
// and the menu item we want is 'Save as...'"*). A paradigm we are adopting has two names for writing
// a file, and this page already spends the word "copy" on Duplicate; a third word for a third thing
// is the invention we are trying to stop doing. The caveat lives in a tip on those rows, and in a
// notice after the act -- at the moment the question arises -- rather than in a label forever.
// `lpn_file_download_tip` was removed 2026-08-04 with the fallback Save row itself: where no
// connection is possible, Save is disabled and only Save as remains, so the caveat belongs on Save
// as (lpn_file_saveas_tip_download) and nowhere else. A tip on a disabled row would never be seen
// anyway -- a disabled button fires no mouse events.
// Opening a file where there is no File System Access API is an UPLOAD, not an open: the browser
// hands over the contents and nothing else -- no way to write back, no way to lock it, no way even
// to recognise it next time. A user who is not told will reasonably expect Save to go back where the
// file came from. Explained once per browser by lpn_file_upload_explain, then said every time by
// lpn_status_uploaded.
$ec_lang['lpn_file_upload_explain']='This browser cannot connect to a file, so opening a file here is an upload: the project is copied into this browser, and the only way to save changes back to the file is to overwrite it with File, Save as.';
// The tip on the Open button, which reached the toolbar with Task 246. It exists because that
// button is icon-only: on a menu row the word carries the whole meaning, and on the strip the tip
// is where the rest of it lives.
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
// The one thing a user can actually DO about the proliferation of files (Tom, 2026-08-04: "I hate to
// cause the proliferation of files"). We cannot make a browser ask where to put a download -- there
// is no API for it, and the download attribute cannot override the setting -- but the user can turn
// that setting on themselves, and then Save as really does let them overwrite the file they started
// from. It belongs in this tip rather than in a dialog: it answers a question asked at the moment
// the user is choosing where their work goes.
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_saveas_tip_download']='Save using your browser’s Download settings. This browser cannot connect to a file, so Save is disabled and only Save as is available. If your browser setting "Ask where to save each file" is on, the original file can be chosen and overwritten.';
$ec_lang['lpn_status_uploaded']='Project file uploaded. No connection to it can be maintained, so the only way to save back to it is by using File, Save as.';
$ec_lang['lpn_status_downloaded']='Downloaded {file}. This browser cannot connect to a file, so this project stays marked as not saved to a file.';
$ec_lang['lpn_status_file_opened']='Opened {file}.';
$ec_lang['lpn_status_already_open']='That file is already open here as {name}, so this switched to it rather than opening a second copy.';
$ec_lang['lpn_status_already_open_dirty']='That file is already open here as {name}, with changes you have not saved to it. This switched to it rather than opening a second copy. Use File, Revert if you want the version on disk instead.';
$ec_lang['lpn_status_saved']='Saved {file}.';
$ec_lang['lpn_status_reverted']='Loaded {file} again from the disk.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='Save your changes to {name} before closing it?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} is stored only in this browser. If you close it without saving it to a file, it is permanently lost.';
$ec_lang['lpn_close_discard']='Close without saving';
$ec_lang['lpn_cancel']='Cancel';
$ec_lang['lpn_revert_confirm']='Discard the changes you have made and reload {file} from the disk?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='This project came from {file}, but the connection to that file has been lost. Choose the file again to connect to it.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='Could not write to the file. It may have been moved or renamed, or permission may have been withdrawn. Your work is still saved in this browser.';
$ec_lang['lpn_file_changed_elsewhere']='Another user has saved to this file since you opened it, so saving now would overwrite that work. Use File, Save as to save your changes to a separate file, or File, Revert to discard your changes and load the saved version.';
// Project locks (Task 195 Phase 2) -- who is editing a shared project file right now. {name} is a
// person as they chose to be known ("Dave T."), never a login; word order is the translator's to
// choose. A lock never expires on its own, so none of these may suggest waiting will free it.
// Initials, and said to be public: whoever opens the same file sees this name, including outside the
// office (Tom, 2026-08-03 -- "your friendly name may need to be a cryptic name"). Asking for initials
// rather than a name makes the safe answer the obvious one.
// Corrected 2026-08-05 to match lpn_file_training_3, which Task 211 fixed and this string missed: the
// name is never written into the project file, so "anyone you send the file to" was false here too.
// The stand-in when someone locked a project before giving a name. Reads in place of {name}
// everywhere above, so it has to work mid-sentence.
$ec_lang['lpn_lock_somebody']='Somebody else';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} has this file open.';
$ec_lang['lpn_lock_open_readonly']='Open read-only';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Break lock';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='This file appears to be in use.';
$ec_lang['lpn_lock_open_care']='To avoid data loss, choose carefully from the options below.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='It has been in use for {x}.';
$ec_lang['lpn_lock_age_edited']='It was last edited {x} ago.';
$ec_lang['lpn_lock_age_saved']='It was last saved {x} ago.';
$ec_lang['lpn_lock_age_never_saved']='Nothing has been saved to this file yet.';
$ec_lang['lpn_lock_age_unknown']='There is no record of how long it has been in use, or when it was last saved or edited.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='"Ask" tells whoever has this file open that you would like it, and changes nothing else. "Open read-only" lets you look at it and change anything you like, without being able to save here. "Break lock" lets you save over the file; their unsaved work is not lost, but they will no longer be able to save it here, and somebody may have to merge the two by hand.';
$ec_lang['lpn_lock_ask']='Ask';
// Asked at the one moment the name is useful. Nothing is written to this computer for it; the lock
// broker keeps it in that file's lock record for the holder to read (Tom, 2026-09-29, correcting a
// prompt that said "stored only in this browser").
$ec_lang['lpn_lock_ask_prompt']='Who should we say is asking? Enter your initials, for example. They are kept with this file\'s lock on our server, for whoever has it open, and deleted within 30 days.';
$ec_lang['lpn_lock_ask_sent']='We have asked whoever has this file open to close it. They will see it within a minute, if their page is still open. Nothing else has changed, and the file is still theirs until they close it.';
$ec_lang['lpn_lock_ask_failed']='Your message could not be delivered. Either nobody has this file open now, or the server could not be reached.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='That file was not opened, and nothing here changed. Somebody else still has it open.';
// Task 747: a file copied outside this page keeps its original's document ID, and so its lock. Asked
// whenever this browser cannot guarantee it already knows the file (Tom, 2026-09-30). {date} is when
// the ID was minted, in the visitor's own regional date-time format.
$ec_lang['lpn_copy_title']='Mark file as new copy?';
$ec_lang['lpn_copy_body']='This file says it was created on {date}, and this browser doesn\'t recognize it. Is this the Original file (keep same lock) or a Copy (make new lock)?';
$ec_lang['lpn_copy_body_nodate']='This browser doesn\'t recognize this file. Is this the Original file (keep same lock) or a Copy (make new lock)?';
$ec_lang['lpn_copy_original']='Original; keep same lock';
$ec_lang['lpn_copy_copy']='A copy; make new lock';
// What "Original" does when the file's id is already open in a tab here with a different file:
// switch to the tab, without changing the tab's file.
$ec_lang['lpn_copy_kept_link']='Opened {name} as the original, moved to a new place. Save now writes to this file.';
// Tom, 2026-10-05: the copy is saved the moment it is chosen, so nobody has to remember to.
$ec_lang['lpn_copy_opened']='Opened {file} as a copy and saved it, with a new lock.';
// Said only when that save did not happen (permission refused, file gone); the tab stays unsaved.
$ec_lang['lpn_copy_opened_unsaved']='Opened {file} as a copy, with a new lock that will be saved with the next file save.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} would like to edit this file. When you are ready, save your work and use File, Close to hand it over.';
$ec_lang['lpn_ago_seconds']='{n} seconds';
$ec_lang['lpn_ago_minutes']='{n} minutes';
$ec_lang['lpn_ago_hours']='{n} hours';
$ec_lang['lpn_ago_days']='{n} days';
$ec_lang['lpn_ago_unknown']='an unknown time';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Messages';
$ec_lang['lpn_msglog_heading']='Recent messages';
$ec_lang['lpn_msglog_empty']='No messages yet.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='{x} ago';
$ec_lang['lpn_msglog_note']='Newest first. This page keeps the last {n} messages while it is open and does not store them on your computer.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Read-only: {name} has this file open. Anything here can be changed, but not saved. Use File, Save as to save to a different file.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Warning: the server could not be reached to check or create a lock on this project, so another user can edit the same file at the same time. A message appears if locking resumes.';
$ec_lang['lpn_lock_storage_error']='Warning: this site cannot save lock records, so another user can edit the same file at the same time. This is a server configuration fault that cannot be corrected from this page: the lock folder is not writable by the web server.';
$ec_lang['lpn_lock_full_error']='Warning: this site has no storage space left for lock records, so another user can edit the same file at the same time. This is a server configuration fault that cannot be corrected from this page.';
$ec_lang['lpn_lock_not_asked']='Locking is not active for this project, so another user can edit the same file at the same time. This project has no identifier yet; saving it to a file assigns one.';
$ec_lang['lpn_lock_restored']='Locking is restored, and this file can now be saved.';
$ec_lang['lpn_lock_dismiss']='Hide this message';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='The project will be saved in a file on this computer. It is saved only when you save it, and at no other time.';
$ec_lang['lpn_file_training_2']='So that two people never edit one file at the same time, this site keeps track of who has it open. If somebody already has it, it can still be opened to look at, or copied to keep.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='The first time you save, the browser asks whether this site may edit the file. The request comes from the browser, not from this site, and permission is required for Save to write to the file. It is usually requested only once per file.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='Continue';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Choose the file again';
$ec_lang['lpn_file_reconnect']='Reconnect to this file';
$ec_lang['lpn_file_reconnect_alert']='This project came from {file}. Your browser needs your permission again before it can write to it. Reconnect below.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='That is the same file somebody else has open, so it cannot be saved over. Choose a different file or a different name.';
$ec_lang['lpn_saveas_overwrites_project']='That file already holds a different project, {name}. Saving here replaces it completely. Continue?';
$ec_lang['lpn_saveas_overwrites_newer']='That file has changed since you last saw it, so somebody else has almost certainly saved to it. Saving here replaces their version with yours. Continue?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Name for this project';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='Closed {closed}. Now showing {opened}.';
$ec_lang['lpn_status_closed_empty']='Closed {closed}. Started a new empty project.';
$ec_lang['lpn_storage_full']='Not saved. Browser storage is full or unavailable, so your recent changes will be lost when you close this tab.';
$ec_lang['lpn_storage_unreadable']='Not saved. This project could not be read from browser storage. Its stored copy is left exactly as it is and will not be written over, so nothing on this tab is being saved. Open a file or create a new project to keep working.';
// The About box's one translatable sentence (Task 625). The LICENCE NAME itself is deliberately
// inside it in English: the FSF asks that "GNU General Public License" not be translated, and a
// translated licence name is a different licence as far as a reader checking it is concerned.
// The one-time cue that points from the toolbar up to the menu bar (Task 625). Says where the
// menus ARE rather than what they contain: a reader who has not noticed the row does not need a
// list of it, they need to look up once.
// **THE WAY HOME IS A HELP ROW NOW** (Tom, 2026-09-11). This was `lpn_menu_home_tip`, the tip on
// a product mark at the far left of the menu bar; the mark is gone and the row replaced it, on
// his instruction: *"Help menu to include Welcome Page ... as last item in top group."* The key
// was never translated, having lived for less than a day, so renaming it costs nothing.
//
// The DOMAIN is not in the label: a Help row sits among other rows that name what they do, and
// "Welcome page" is what this one does. The address belongs in the browser's status bar, where a
// link's destination is already shown.
// The About box's second link (MAH, browsing on 2026-09-11, relayed by Tom: *"I noticed that
// About often has a 'Credits' link."* He is right, and this one has somewhere real to point --
// librewaternet.org/credits.html, which is the About-EPANET page that survived not-epanet.org).
$ec_lang['lpn_about_credits']='Credits';
$ec_lang['lpn_help_welcome']='Welcome page';
$ec_lang['lpn_about_license']='Licensed under the GNU General Public License v3.0 or later.';
$ec_lang['lpn_notes_1_term']='How it is solved';
// **IT NAMED THE WRONG SOLVER** (Tom, 2026-09-10: *"Wrong facts."*). It said every moment "is
// solved with the global gradient algorithm", which describes the BUILT-IN solver -- and Task 605
// retired that one from view: EPANET is the default and the built-in one answers only when EPANET
// cannot be fetched. dev/lpn-spike/eps-net3-harness.js reproduces EPA's own published 24-hour
// Net3 report at all 25 reporting steps.
// **THE FALLBACK SENTENCE LEFT THIS NOTE 2026-09-11** (Tom: *"I am not sure that mentioning the
// EPANET solver being unavailable for download makes sense ... the case for the note is
// vanishingly small."*). His premise is not quite right -- the app IS offline-capable, so a
// returning visitor with the page cached and the engine not cached is a real state, and Task 608
// shrank it further by fetching the engine before anybody is waiting. But the conclusion holds on
// a better reason: **the reader is already told, at the moment it happens, by
// lpn_time_no_engine and lpn_engine_unavailable.** A note everybody reads should not carry a
// failure explanation that the failure itself delivers. Task 605's rule is untouched -- every
// sentence a reader meets only when something has gone wrong SURVIVES, and those two are it.
$ec_lang['lpn_notes_1_def']='By default the network is solved by the EPANET solver. When a total run time is set, each reporting time step is calculated in sequence: tanks fill and drain, demands follow their patterns, and the toolbar plays back the run. With Use the built-in solver when possible checked, a single instant solution can be solved by the built-in solver instead, but an extended period simulation or a network with a pressure breaker or general purpose valve (PBV, GPV) is always solved by the EPANET solver.';
$ec_lang['lpn_notes_2_term']='What it does not do';
// **"Water quality chemistry is not modeled" WAS FLATLY FALSE** (Tom, 2026-09-10: *"Wrong
// facts."*). A reacting chemical, bulk and wall reaction coefficients and a limiting
// concentration all ship -- see lpn_quality_chemical and the lpn_reaction_* keys below. The note
// had not been read since the water-quality work landed, and it was telling every visitor in 27
// languages that a feature they can see on the screen does not exist.
//
// **THE TERM IS NOW "What it does not do", AND WHAT GOES IN IT IS TOM'S CALL.** Naming an
// omission is a public claim about scope, and this file's history says those go wrong in the
// confident direction; the one omission stated here is the one nothing in this tree implements
// or claims to. Do not lengthen the list without him.
$ec_lang['lpn_notes_2_def']='Surge and water hammer are not modeled: all results are for steady or slowly varying flow, not for the transient pressure wave caused by rapid valve closure.';
$ec_lang['lpn_notes_3_term']='Saving projects';
$ec_lang['lpn_notes_3_def']='Every project is a tab, and every tab is saved in this browser as the work proceeds. Clearing the browser\'s data deletes them all, so the work belongs in a file: File, Save as. An asterisk on a tab means it holds changes that are not in a file, and closing that tab asks first. Nothing is ever written to a file unless Save or Save as is chosen. In some browsers a project connects to the file it is saved to, and File, Save writes back to that same file from then on; in others no connection is possible, so Save is disabled and only Save as is available. This site keeps track of who has a project file open, so that two people do not write over each other. Opening a file that a colleague already has open offers Ask, Open read-only, and Break lock. If the server cannot be reached, a warning states that another user can edit the same file at the same time.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Pump curve';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='A pump follows H = H₀ − aQ^b, where H is the head the pump adds and Q is the flow through it. The points of the curve are entered in Water, Libraries, as a Pump head curve, and the pump states that curve in Properties. Three points, the head at zero flow, the normal working point, and the point of highest flow, fit H₀, a, and b directly, and follow a published curve most closely. Two points fit a parabola (b = 2) with its peak at zero flow. One point uses EPANET’s rule: the head at zero flow is 1.33334 times the head entered, and the highest flow is 2 times the flow entered, which again gives b = 2. A pump with no curve stated adds no head. The curve is not truncated where the head reaches zero, so a flow greater than the curve can deliver produces a negative head. The remedy is a larger pump or a smaller demand, not a different curve fit. A curve can hold more than three points. The EPANET solver is given all of them and interpolates between them, while the Equation line and the built-in solver use the lowest, middle, and highest points.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_6_term']='Table columns help';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE -- the Hide/Show row beside it names the
// identical menu. **GESTURE FIRST, THEN ACTION, SINCE 2026-10-06** (Ida, User guide): the cells were
// swapped in all 27 files, by script and unchanged, so this table reads in the same order as the
// key-then-action tables beside it (lpn_notes_7_def, lpn_hotkeys_map_def).
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Click heading</td><td>Select column</td></tr><tr><td>Ctrl+click or Shift+click another heading</td><td>Add or extend column selection</td></tr><tr><td>Drag or use Manage columns… in right-click or ⋮ menu</td><td>Move (reorder) selected column(s)</td></tr><tr><td>Hover a heading\'s top corner, or select or Tab into a heading</td><td>Menu ⋮ and sort arrow.</td></tr><tr><td>Right-click heading or ⋮ menu in heading top right corner</td><td>Hide, Show all, or Manage visibility and order</td></tr><tr><td>Arrow icon in heading top right corner</td><td>Sort by column</td></tr><tr><td>Right-click, ⋮ menu in heading top right corner, or Ctrl+Shift+V</td><td>Paste as new rows at end of table</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Table keyboard shortcuts';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Arrow keys</td><td>Navigate.</td></tr><tr><td>Tab, Enter</td><td>Finish the entry and move one cell across (Tab) or down (Enter).</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Move one cell back (Shift+Tab) or up (Shift+Enter).</td></tr><tr><td>Shift+arrow keys</td><td>Extend the selection.</td></tr><tr><td>Ctrl+C</td><td>Copy the selection.</td></tr><tr><td>Ctrl+D</td><td>Fill the selection down from its top row.</td></tr><tr><td>Ctrl+Enter</td><td>Fill the selection with the active cell\'s value.</td></tr><tr><td>Ctrl+A</td><td>Select the whole table.</td></tr><tr><td>Ctrl+Shift+V</td><td>Paste as new rows at end of table.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Switch to the next or previous tab, whether a table or a graph.</td></tr><tr><td>Delete</td><td>Clear the active cell. To clear a selected range, right-click and choose Delete.</td></tr><tr><td>F2</td><td>Open a cell to edit it.</td></tr><tr><td>Esc</td><td>Cancel an edit.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Color band boundaries stay the same';
$ec_lang['lpn_notes_color_def']='Color band boundaries are set when a data classification method is chosen. They are not set again at each time step, because that would make the colors mean something new at every step, which is not helpful for visualizing a system. A scenario shows the boundaries of Base. EPANET works the same way. To get new boundaries, choose a method again or enter boundaries.';
$ec_lang['lpn_notes_engine_term']='Which EPANET this page runs';
$ec_lang['lpn_notes_engine_def']='The EPANET solver on this page is OWA-EPANET 2.3.5, released on 20 February 2025. EPANET is developed by Open Water Analytics, a community that works with the United States Environmental Protection Agency, which released version 2.2.0 in December 2019. The run report calls it 2.3.05 because the engine writes the last number in two digits. It is delivered to this page through epanet-js 0.9.0 by Luke Butler, under the MIT license, and it runs in the browser: the network is never sent to a server to be solved.';
// The Notes example (Task 785). Held by dev/lpn-spike/user-guide-notes-harness.js.
$ec_lang['lpn_guide_nt_example_term']='Example on Net1: a pump past its curve';
$ec_lang['lpn_guide_nt_example_def']='Open the Net1 example and choose Water, Libraries. Curve 1, Pump Curve for Pump 9, has one point, 1500 gpm at 250 ft. The head at zero flow is 333.3 ft and the highest flow is 3000 gpm. At 3500 gpm, which is past the end of the curve, the curve gives a head of −120.4 ft. The EPANET solver reports that same head, a loss of 120.4 ft across the pump, and warns that pumps cannot deliver enough flow or head.';
// The user manual's own entry (Task 785). Held by dev/lpn-spike/user-guide-own-harness.js.
$ec_lang['lpn_guide_own_example_term']='Example on Net1';
$ec_lang['lpn_guide_own_example_def']='<p>Open the Net1 example, press Ctrl+K, and type critical. Menus shows the row Criticality analysis… under Water, Analyze. Boxes shows the entries that mention it, among them Find and replace, Fire flow analysis, and Criticality analysis, and this entry. Choosing the row shows where Criticality analysis… is in the Analyze menu, and does not run it.</p>';
$ec_lang['lpn_id_invalid']='Enter an ID with no spaces and no quotation marks.';
$ec_lang['lpn_id_taken']='That ID is already in use.';
$ec_lang['lpn_diag_no_fixed_head']='Add a reservoir or a tank. The network needs at least one known water level before it can be solved.';
$ec_lang['lpn_diag_dangling_link']='A pipe or pump connects to a node that no longer exists:';
$ec_lang['lpn_diag_unreachable']='These nodes have no path to a reservoir or tank:';
// Tom, 2026-10-09: a node nothing connects to a source is left out of the run, not refused. The
// ids stand in the status bar until the network changes. Said in EPANET's own terms (junction,
// reservoir, tank) and never as an error, because the run happened.
$ec_lang['lpn_omitted_note']='Left out of this run because no path leads from them to a reservoir or tank: {ids}';
// BOTH OF THESE NAME THE VALVES. The page ends each one with a list of IDs, which is the reason
// this calculator writes its own messages instead of showing EPANET\'s numbered errors: a person
// looking at a drawing can act on \'V3\' and can do nothing at all with \'error 110\'.
// ---- Warming the EPANET solver (Tom, 2026-08-14) ----
// The 664 KB solver is fetched the moment a network first needs it -- when an active valve type is
// chosen, when the solver is switched on, or when a project arrives already holding one -- because
// that is the moment the user is still online. These three say what is happening in plain terms,
// and the point of all three is the SECOND half of each sentence: the fetch happens once and then
// the network works offline. A message that only said "downloading" would explain the wait without
// explaining why it is worth it.
// TWO PAIRS, because the same fetch has two reasons and one message cannot be true of both.
// Tom turned the solver ON and was told about VALVES he had not created (2026-08-14). The valve
// pair is right when a valve triggered the fetch; the plain pair is right when the user simply
// chose the solver.
$ec_lang['lpn_engine_fetching']='Downloading the EPANET solver. It is downloaded once and then stored on this device, so it works offline afterward.';
$ec_lang['lpn_engine_ready']='The EPANET solver is now stored on this device and works offline.';
$ec_lang['lpn_engine_fetching_valve']='Downloading the EPANET solver, so this valve can be solved now and offline later.';
$ec_lang['lpn_engine_ready_valve']='The EPANET solver is now stored on this device. Pressure breaker and general purpose valves (PBV, GPV) can now be solved offline.';
$ec_lang['lpn_engine_unavailable']='Could not download the EPANET solver, which is required to solve pressure breaker and general purpose valves (PBV, GPV). After one connection to the internet, the solver is stored on this device.';
// The cause-specific sibling: {reason} is lpn_time_engine_fetch_failed (only a download can reach this notice).
// Offline keeps the sentence above. {wrong} in lpn_time_engine_run_failed is filled with lpn_wrong_btn.
$ec_lang['lpn_engine_unavailable_why']='Pressure breaker and general purpose valves (PBV, GPV) cannot be solved without the EPANET solver. {reason}';
$ec_lang['lpn_engine_needed_loading']='Loading EPANET solver while you build. Results will be available when completely loaded.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Solver loading progress';
$ec_lang['lpn_engine_wait']='Loading solver. Results delayed momentarily. Continue working.';
$ec_lang['lpn_engine_wait_pct']='Solver {percent}% loaded.';
$ec_lang['lpn_engine_wait_bytes']='Solver {kb} KB loaded so far. The total is not available, so the percentage of completion is unknown.';
$ec_lang['lpn_engine_needed_failed']='The EPANET solver has not yet been loaded, cannot be loaded, and this network can only be solved by it. It will be loaded when you are connected to the internet.';
$ec_lang['lpn_engine_needed_failed_why']='This network can only be solved by the EPANET solver. {reason}';
$ec_lang['lpn_diag_valve_needs_epanet']='These are pressure breaker or general purpose valves, and only the EPANET solver can compute them. The EPANET solver could not be loaded, so these results are missing:';
$ec_lang['lpn_diag_valve_on_fixed_head']='These valves connect directly to a reservoir or tank, which fixes the hydraulic grade at that node, so the valve has nothing to control. Insert a short pipe between the valve and the reservoir or tank:';
$ec_lang['lpn_diag_not_converged']='No solution was found. Check for physically impossible values, such as a diameter of zero.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='The solve did not converge. These numbers are the last iteration, not an answer. Do not use them.';
$ec_lang['lpn_diag_not_converged_trials']='It stopped after {iterations} iterations.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='It stopped after {iterations} iterations at a relative error of {error}, which did not reach the Accuracy setting of {accuracy}.';
$ec_lang['lpn_field_roughness']='Roughness';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Hazen-Williams C. A higher number means a smoother pipe: about 150 for new plastic, 130 for new steel or iron, and 100 for old pipe.';
$ec_lang['lpn_field_length']='Length';
// Task 643 (Tom, 2026-10-14): an Auto length is the slope distance. No claim about accuracy (Task 641).
$ec_lang['lpn_field_length_slope_tip']='Pipe length. When Auto is checked, the length is measured along the slope: the drawn length combined with the difference in elevation between the two end nodes.';
$ec_lang['lpn_field_from']='From';
$ec_lang['lpn_field_to']='To';
// Tom, 2026-10-09: From and To are editable text. Said in the box a refused ID is said in.
$ec_lang['lpn_link_end_unknown']='No node has the ID {id}.';
$ec_lang['lpn_link_end_same']='From and To must be different nodes.';
// Tom, 2026-10-09: "Break link for node?", adapted to name the pipe. The two answers are Yes and No
// because No is not a cancel: it places the node where it was pressed, joined to nothing.
$ec_lang['lpn_split_pipe_ask']='Split pipe {id} at this node?';
$ec_lang['lpn_split_yes']='Yes';
$ec_lang['lpn_split_no']='No';
// Object snap (Task 782). The tip beside the snap glyph on a pipe vertex: "Pipe 10, vertex 2". A node
// or a pipe is named by its type word and ID alone.
$ec_lang['lpn_snap_vertex']='{link}, vertex {n}';
// A tank, reservoir or junction snapped onto a node of another type is placed at exactly that
// position. Two nodes at one point are legal in EPANET, and the map cannot show that they are separate.
$ec_lang['lpn_snap_node_on_node']='{new} placed at the location of {target}. The two nodes are not connected.';
// The same, for a node DRAGGED onto another node.
$ec_lang['lpn_snap_moved_on_node']='{moved} moved to the location of {target}. The two nodes are not connected.';
// The Shape (Task 779): map annotation, a point, a polyline or a polygon. Tom, 2026-10-06: "Either
// way, we call it a 'Shape'". The tip beside the snap glyph on a Shape point: "Shape S1, point 2".
$ec_lang['lpn_snap_shape_point']='{shape}, point {n}';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Valve type';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Valve type. A throttle valve (TCV) applies a fixed loss. PRV, PSV, and FCV maintain a pressure or a flow, and open fully, close, or partly close as hydraulic conditions change. A PBV removes a fixed pressure, and a GPV follows a head loss curve. The types control different hydraulic properties, so settings may be lost when the type is changed.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Throttle (TCV)';
$ec_lang['lpn_valve_type_prv']='Pressure reducing (PRV)';
$ec_lang['lpn_valve_type_psv']='Pressure sustaining (PSV)';
$ec_lang['lpn_valve_type_fcv']='Flow control (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Pressure breaker (PBV)';
$ec_lang['lpn_valve_type_gpv']='General purpose (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Pressure drop';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='The pressure lost at the valve. A pressure breaker valve always removes exactly this much pressure, whichever way the water is going. It is a drop across the valve, not a pressure to hold.';
$ec_lang['lpn_inp_drop_gpv_curve']='This valve refers to a head loss curve that is not in the file. The valve was imported without a curve, so it remains fully open until a curve is chosen.';
$ec_lang['lpn_gpv_curve_source']='Valve head loss curve';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='The curve in the Libraries box that gives the head loss through this valve at each flow. Several valves can use the same curve, and editing it there changes all of them.';
$ec_lang['lpn_field_valve_setting_pressure']='Pressure setting';
$ec_lang['lpn_field_valve_setting_pressure_tip']='A pressure reducing valve keeps the pressure on its downstream side at or below this value. A pressure sustaining valve keeps the pressure on its upstream side at or above this value.';
$ec_lang['lpn_field_valve_setting_flow']='Flow setting';
$ec_lang['lpn_field_valve_setting_flow_tip']='Maximum flow through the valve. When the flow is less than this value, the valve is fully open and adds no loss.';
$ec_lang['lpn_field_valve_setting']='Setting';
$ec_lang['lpn_field_valve_setting_loss']='Loss coefficient';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Head removed by the throttle valve, as a multiple of the velocity head. Use 0 for a fully open valve. This one value is the entire loss of a throttle valve.';
$ec_lang['lpn_field_valve_diameter_tip']='Diameter of the valve opening. The velocity through the valve is computed from this diameter, and the loss from that velocity.';
$ec_lang['lpn_field_valve_km_tip']='Loss through the valve body when the valve is fully open, in addition to any loss from the valve setting. It is expressed as a multiple of the velocity head. Use 0 to ignore it.';
$ec_lang['lpn_field_km']='Minor (local) loss coefficient, k';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Minor loss, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Pump head curve';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='The curve in the Libraries box that gives the head this pump adds at each flow. Several pumps can use the same curve, and editing it there changes all of them.';
// **"THE NOTES BELOW" DO NOT EXIST ON THIS PAGE** (Tom, 2026-09-05: *"There are no notes below.
// It's in Help, Notes on this page."*). Every other calculator in this suite is a form with its
// notes printed under it, and this sentence was written in that habit; the map page is a full-window
// drawing surface and its notes are a Help row. The sentence now names the row the way the menu
// does. Reworded in English only, so the 26 translations are stale until the next sprint resyncs
// them -- `detect_english_drift.php` is what carries that.
// **THE PUMP'S OWN EFFICIENCY, ON THE PUMP** (Tom, 2026-09-05: *"The pump has no efficiency of its
// own, and I don't see an interface for that."*). Three states and three sentences, because "this
// pump has no curve" and "this pump names a curve the file never stated" reach the same arithmetic
// by different roads and only one of them is a problem the reader can act on.
//
// {name} and {percent} are placeholders and not concatenation (Task 193): a language that puts the
// curve name first, or wraps a percentage in its own punctuation, cannot express a prefix sandwich.
// **THE ELEMENT'S DESCRIPTION** (Task 674). EPANET's own word, and EPANET's own Property Editor row:
// the terminology rule decides it, and there is no vocabulary collision here of the kind Label and
// Text have. EPANET carries it as the trailing comment on the element's own row in the file, which is
// where this page now reads and writes it; until Task 674 it was read nowhere and every imported
// description was discarded in silence.
$ec_lang['lpn_field_desc']='Description';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='Tag';
// Tom, 2026-09-06, in dev/new-english-keys.md, answering Wave 0's finding that a bare 'Tag'
// reads as markup or as a price tag in most languages: Add _syn 'Tag or user defined field
// possibly for grouping assets possibly in pressure zones'. His sentence is the commentary,
// verbatim and right of the pipe; the substitutable half is left of it, because the generator
// strips commentary by POSITION and a whole sentence on the left ships to 26 agents as a
// synonym list.
// Edited by TGH 2026-09-07
// ROADMAP Task 247. Tom's own words, given verbatim on 2026-09-19 when he shortened the label from
// "Services at this customer" to "Number of services": the short label loses the "at this customer"
// that told a translator WHOSE services are being counted, and this is where that goes back.
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='A one-word identifier with any meaning you require, such as a pressure zone or a work order.';
$ec_lang['lpn_pump_effic_curve']='Pump efficiency curve';
$ec_lang['lpn_pump_effic_curve_tip']='The curve in the Libraries box that gives the efficiency of this pump at each flow. Several pumps can use the same curve, and editing it there changes all of them. This pump holds only the reference; the points themselves are read and edited under Libraries, Curves.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='No curve chosen';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Curves';
$ec_lang['lpn_curve_library_link_tip']='Open the Libraries box on its Curves section, where a curve is added, described, edited and deleted. An asset states which curve it uses.';
// {name} and {ids} are placeholders and not concatenation (Task 193). Said only when a second
// element is really on the curve: a table on one element's popup reads as that element's own, and
// the moment it is not is exactly the moment an edit here moves somebody else's answer.
// A curve of more than three points is READ-ONLY on the popup: this table offers three rows because
// the page fits a head curve from at most three points, and shrinking a manufacturer's curve to fit
// a widget is what the curve library exists to have stopped.
// **WHAT A CURVE DESCRIBES, AND EPANET HAS EXACTLY FOUR** (Tom, 2026-09-05: *"there will be four
// kinds of curve, Pump (head), (Pump) Efficiency, (Tank) Volume, and Headloss. Right?"*). The kind
// decides the two column headings and their units. EPANET states it in a `;PUMP:`-style comment
// above the curve's own rows, which this page reads and writes back, so a curve nothing references
// still knows what it is.
$ec_lang['lpn_curve_kind_head']='Pump head';
$ec_lang['lpn_curve_kind_effic']='Pump efficiency';
$ec_lang['lpn_curve_kind_volume']='Tank volume';
$ec_lang['lpn_curve_kind_headloss']='Valve head loss';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Kind not stated';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Volume';
$ec_lang['lpn_pump_effic_col']='Efficiency';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='This pump has no efficiency curve chosen, so it runs at the efficiency set for the whole network, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='This pump refers to an efficiency curve called {name}, which nothing in this project defines, so it runs at the efficiency set for the whole network, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Mode: Select. Select an asset, a label, or a Text to see or change it. Drag to move a node, a label, or a Text. Use the Vertices tool to add or remove the bends in a pipe.';
$ec_lang['lpn_mode_delete']='Mode: Delete. Select an asset to remove it.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Mode: Vertices. The vertices of every pipe are shown as small square handles. Specify a point on a pipe to add a vertex, select a handle to remove it, or drag a handle to move it. Nothing else on the map can be changed in this mode.';
$ec_lang['lpn_mode_zoom_window']='Mode: Zoom window. Specify two opposite corners of a box, or drag one, on the map to zoom in on it.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Nothing is selected. Select an asset on the map first, then press Delete.';
$ec_lang['lpn_mode_add_junction']='Mode: Add Junction. Specify a location on the map to place a junction. Switch to Select mode to change or move assets, labels, and Text.';
$ec_lang['lpn_mode_add_reservoir']='Mode: Add Reservoir. Specify a location on the map to place a reservoir. Switch to Select mode to change or move assets, labels, and Text.';
$ec_lang['lpn_mode_add_tank']='Mode: Add Tank. Specify a location on the map to place a tank. Switch to Select mode to change or move assets, labels, and Text.';
$ec_lang['lpn_mode_add_pipe']='Mode: Add Pipe. Select a start node and then an end node to connect them. Specify points in open space in between to bend the line, or press Escape to start over. Switch to Select mode to change or move assets, labels, and Text.';
$ec_lang['lpn_mode_add_pump']='Mode: Add Pump. Select a start node and then an end node to connect them. Specify points in open space in between to bend the line, or press Escape to start over. Switch to Select mode to change or move assets, labels, and Text.';
$ec_lang['lpn_mode_add_valve']='Mode: Add Valve. Select a start node and then an end node to connect them. Specify points in open space in between to bend the line, or press Escape to start over. Switch to Select mode to change or move assets, labels, and Text.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Mode: Add Text. Specify a location on the map to place a Text. Specify a location near a node to attach the Text to that node. Switch to Select mode to change or move assets, labels, and Text.';
$ec_lang['lpn_mode_add_chain']='Mode: Junction Pipe Chain. Specify a point on the map to add a junction, then specify each next point to add a pipe and a junction. Specify an existing node to continue from it. Press Escape to end the chain. Switch to Select mode to change or move assets, labels, and Text.';
$ec_lang['lpn_mode_add_shape']='Mode: Add Shape. Specify each point. Specify the last point again or press Enter to finish; specify the first point to close a polygon.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Use this mode to change, move, and drag assets and text on the map, or to pan the map. This is the default mode for the map. Pressing Esc a second time clears the selection.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='Auto';
$ec_lang['lpn_method_switch_confirm']='Changing the friction method does not change the roughness numbers already entered on your pipes, and a roughness for one method is meaningless for another. Check every pipe after this. Change it anyway?';
// "Closed", not "Shut" (R-224, Tom, 2026-09-24: "we are using different words Shut and Closed.
// What are the translators supposed to do? EPANET says Closed. So we purge Shut."). "Shut" had been
// chosen (2026-08-14) because "closed" is a live polysemy INSIDE hydraulics -- a CLOSED CONDUIT is
// a full, pressurised pipe as opposed to an open channel, and every pipe on this page is one, so
// the wrong reading was not obviously wrong to a translator. Tom's ruling overrides that: EPANET's
// own word wins, translators already had EPANET's dictionary for it (every language here that had
// translated this key had independently landed on its own word for "closed", not "shut"), and one
// polysemy risk does not outweigh the suite running two words for one state. This is unrelated to
// Active, which is a different question -- whether the scenario contains the link at all
// (paneColClosed() in js/looped-network.js) -- and stays "Active".
$ec_lang['lpn_field_closed']='Closed';
$ec_lang['lpn_field_closed_tip']='Close this pipe so no water can pass through it. The pipe stays on the map and keeps all its numbers, and it can be opened again at any time.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Longitude';
$ec_lang['lpn_field_lat']='Latitude';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='Northing';
$ec_lang['lpn_field_easting']='Easting';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='N';
$ec_lang['lpn_field_easting_abbr']='E';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='Lat';
$ec_lang['lpn_field_lon_abbr']='Lon';
// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='Enter a coordinate location to place this node exactly. In a scenario this location applies in that scenario only, as dragging does; in Base it places the node in every scenario.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='That is off the map. Pseudo Mercator latitude ranges from -85.05 to 85.05 and longitude ranges from -180 to 180.';
$ec_lang['lpn_field_text_size']='Size multiplier';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Show at all zoom levels';
$ec_lang['lpn_field_text_all_zoom_tip']='Keep this text on the drawing however far out you zoom. Clear it to hide the text with the other labels once the view is wider than the labeling threshold set under Map and page.';
$ec_lang['lpn_tool_labels']='Labels';
$ec_lang['lpn_labels_heading_node']='Node labels';
$ec_lang['lpn_labels_heading_link']='Link labels';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Apply to all';
$ec_lang['lpn_settings_apply_to_all_tip']='Every asset of this kind that is already drawn gets an ID starting with this text. Each one keeps its number. An ID that does not end in a number is not changed.';
$ec_lang['lpn_confirm_apply_prefix']='Rename assets ({n}) so their IDs start with {prefix}? Each one keeps its number.';
$ec_lang['lpn_prefix_applied']='Assets renamed: {n}. Assets not changed: {skipped}.';
$ec_lang['lpn_labels_suffix_gradient_tip']='Text added after the head loss gradient on map labels. Do not enter a percent sign here. It is added automatically when the units are percent.';
$ec_lang['lpn_labels_separator']='Text between values';
$ec_lang['lpn_labels_separator_tip']='Text between one property and the next on a label. A space by default.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='Priority';
// Edited by TGH 2026-09-07
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='The order in which values are dropped when a label does not fit. The value numbered 1 is dropped first. When only one value is left and two labels still overlap, one of them is hidden: the one with the lower demand, with pressure nearer the middle of the range, or with elevation or head more like its neighboring nodes.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='Bef.';
$ec_lang['lpn_labels_col_after']='Aft.';
$ec_lang['lpn_labels_col_decimals']='Decimals';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='Show';
$ec_lang['lpn_labels_show_tip']='The order in which values appear on a label. The value numbered 1 comes first: at the top of a stacked label, and at the start of a label on one line.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Use units';
$ec_lang['lpn_labels_use_units_tip']='Check to show the unit in the After box and on the label, and to update it when the units change. Clear to enter custom After text.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='Initial status';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Node colors';
$ec_lang['lpn_settings_sym_link_colors']='Link colors';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Background image…';
$ec_lang['lpn_backdrop_add']='Add';
// BARE VERBS, and they are only correct because BOTH doors now print a "Background image" heading
// over them (backdropRows() in js/looped-network.js). The 2026-08-04 ruling that made these
// "Scale image"/"Position image" was right about the defect -- a bare verb orphans in the Insert
// menu, where nothing above it says what is being scaled -- and wrong about the cheapest fix: the
// object belongs in ONE heading, not repeated in five labels. Never restore a bare verb here
// without checking the heading is still rendered.
// Two ways to set the same number, so both say which one they are (Task 276). Picking is the coarse
// step -- Tom, 2026-08-10: "mouse (and hand!!!) picking is never precise" -- and the other is the
// correction. The second label NAMES the World File rather than saying "by typing", because the
// World File was "hidden and hard to discover" (Tom, 2026-08-13) and a menu is where it gets found.
// "The size of one pixel ON THE MAP", in all three, and NOT "pixel size" (Task 297 Wave 0). "Pixel
// size" reads just as easily as the image's pixel DIMENSIONS -- a property of the file -- as it does
// the distance one pixel covers, which is the only thing the code wants. Tom, 2026-08-13, chose the
// qualifier: "'map' is better than real world or real" -- the reader is looking at a map, so the
// frame they are being asked about is the one already in front of them.
// The longer label costs nothing since Task 276 made this control a menu button rather than a
// <select>, so a row label no longer sets the collapsed width.
// "world file" stays LOWERCASE. Title Case reads as a brand and invites a translator to leave it in
// English; the concept carries its own glossary.json entry instead.
//
// There are NO lpn_backdrop_wld_ask/_none/_choose keys (Tom, 2026-08-13): "We don't ask for world
// file... We ask for a paste of World File contents." The dialog that opened a second file picker is
// gone; the two doors that remain both take the CONTENTS -- the multi-select picker and the textarea
// behind lpn_backdrop_scale_entry. Do not re-add an ask.
$ec_lang['lpn_backdrop_scale']='Scale by picking';
$ec_lang['lpn_backdrop_scale_entry']='Scale by world file or by the size of one pixel on the map';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Scale from current size, around a point you pick';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Specify the point on the background image that should stay where it is.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Scale from its current size. 1 keeps it the same, 1.1 makes it 10% bigger, 0.9 makes it 10% smaller.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Enter the size of one pixel on the map, or paste the complete contents of the world file for the image';
$ec_lang['lpn_backdrop_scale_entry_bad']='Enter one number for the size of one pixel on the map, or paste all six lines of a world file.';
$ec_lang['lpn_backdrop_wld_bad']='This world file rotates, mirrors or unevenly stretches the picture. The map can only move a picture and resize it by the same amount in both directions, so the file was not used.';
$ec_lang['lpn_backdrop_unreadable']='This picture cannot be shown by your web browser. Save it as a PNG or JPEG picture and add it again.';
$ec_lang['lpn_backdrop_position']='Move';
$ec_lang['lpn_backdrop_remove']='Remove';
$ec_lang['lpn_backdrop_remove_confirm']='Remove the background image?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='World map…';
$ec_lang['lpn_map_attach_tip']='Attach the world map to this project without changing it any other way.';
$ec_lang['lpn_map_attach_add']='Attach';
$ec_lang['lpn_map_attach_readjust']='Re-adjust';
$ec_lang['lpn_map_attach_readjust_tip']='Return to Step 2 of the map attachment process.';
$ec_lang['lpn_map_attach_scale_from']='Scale from the current size…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Scale the map from its current size, about the middle of your drawing. 1 keeps it the same, 1.1 makes it 10% bigger, 0.9 makes it 10% smaller.';
$ec_lang['lpn_map_attach_scale_from_bad']='Enter a single number greater than zero.';
$ec_lang['lpn_map_attach_scale_from_done']='The map is resized, and your drawing and every coordinate in it are exactly as they were.';
$ec_lang['lpn_map_attach_none']='There is no world map attached to this project yet. Use Map, World map, Attach first.';
$ec_lang['lpn_map_attach_remove']='Detach';
$ec_lang['lpn_map_attach_remove_tip']='Detach the world map. Does not affect the network.';
$ec_lang['lpn_map_attach_done']='The world map is now displayed behind the drawing, and the project is unchanged. Use Map, World map, Detach to remove it.';
// Edited by TGH 2026-10-07
$ec_lang['lpn_map_attach_removed']='The world map is detached, and the network is unaffected.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='The drawing is on a map of the whole world, in the ocean at zero latitude and zero longitude. Find the project location first: pan and zoom the map behind the drawing, search for a place name, or enter a latitude and longitude. The drawing itself does not move.';
$ec_lang['lpn_mapgeo_step1']='Step 1 of 2: find the project location';
$ec_lang['lpn_mapgeo_step2']='Step 2 of 2: fit the map behind your drawing';
$ec_lang['lpn_mapgeo_hint1']='Pan and zoom the map behind your drawing, or search for a place, or enter a latitude and longitude. Then press Place approximately.';
$ec_lang['lpn_mapgeo_readjust_intro']='Your drawing is where you last placed it. To move it somewhere else, pan and zoom the map behind the drawing, search for a place name, or enter a latitude and longitude. The drawing itself does not move.';
$ec_lang['lpn_mapgeo_hint2']='Drag anywhere to slide the map under your drawing. Your drawing and every coordinate in it stay exactly where they are. Press Georeference here when the map is right.';
$ec_lang['lpn_mapgeo_gestures']='Zoom moves your drawing and the map together, to show how well they line up. Dragging moves the map only.';
// ---- THE SIZE AND TURN DIAL (Tom, 2026-09-18) -------------------------------------------------
//
// **A SLIDER, BECAUSE THERE IS NO DIRECT MANIPULATION HERE TO GIVE UP.** His own refutation of the
// objection: *"The map is practically infinite. There is no way to visually enlarge it or reduce
// it. The rectangle is a poor metaphor (and isn't working anyway). And the scroll wheel is
// discrete, not continuous."* A corner handle is a grip on a bounded object and the ground has no
// bounds, so the rectangle was never a picture of the thing it was resizing.
//
// **AND THE MIDDLE IS WHERE STEP 1 LEFT IT.** He asked for *"a slider for scale with 1 (from step
// 1) in the middle"*, so the readout is a factor and not a distance: it says how much bigger or
// smaller the ground is than the fit already agreed, which is the only quantity a person can judge
// by looking. The band is narrow on purpose and a wider move is the rectangle's job, or Map, World
// map, Move, which is the pick-it-up-again door.
$ec_lang['lpn_mapgeo_dial_turn']='Rotate the map';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} degrees';
$ec_lang['lpn_mapgeo_dial_size']='Map size';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} times';
$ec_lang['lpn_mapgeo_dial_help']='Slide the two bars, or enter numbers in the boxes above them, to make the map bigger or smaller and to rotate it. The middle of each bar keeps the fit from step 1, so a size of 1 and a rotation of 0 mean no change. Arrow keys work on both.';
$ec_lang['lpn_mapgeo_place']='Place approximately';
$ec_lang['lpn_mapgeo_finish']='Georeference here';
$ec_lang['lpn_mapgeo_cancelled']='The world map is restored to its previous position, and the drawing was not moved.';
$ec_lang['lpn_mapgeo_locked']='Finish with the Georeference here button, or press Cancel, before you switch projects or save. The world map is still being placed.';
$ec_lang['lpn_backdrop_scale_prompt1']='Specify two points on the background image, such as the two ends of a bar scale. Then enter the real distance between them.';
$ec_lang['lpn_backdrop_scale_prompt2']='Real distance between the two points';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Specify the base point (on the image) for the move.';
$ec_lang['lpn_backdrop_position_prompt2']='Choose the method for the destination point, then press Continue.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Adjusting the background image.';
$ec_lang['lpn_backdrop_target_label']='Move that point to:';
$ec_lang['lpn_backdrop_target_node']='A node';
$ec_lang['lpn_backdrop_target_free']='Any point on the map';
$ec_lang['lpn_backdrop_target_coords']='Coordinates you enter';
$ec_lang['lpn_backdrop_coords_prompt']='Enter the X,Y that point should move to';
$ec_lang['lpn_backdrop_continue']='Continue';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// One key for the toolbar button, the Project menu row and the Settings box's own title (Task 699).
$ec_lang['lpn_tool_settings']='Settings';
$ec_lang['lpn_settings_show_titles']='Show page titles';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Hide these titles';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Show the selection help';
$ec_lang['lpn_settings_area_hint_tip']='Show the prompt over the map that gives the next step while you are selecting an area.';
$ec_lang['lpn_settings_hover_card']='Show all properties on hover';
$ec_lang['lpn_settings_hover_card_tip']='Rest the pointer on a node, link or customer to see all of its properties formatted as specified in Settings, at any scale, whether or not the label fits on the map. This is a setting for this browser, not for the project.';
// Task 805 (Tom, 2026-10-15, R-396: "It would be good to be able to hide the amber override
// indicators from the map. Maybe a Map, Clean map button is a good idea after all"). The rings'
// own switch, in Settings, Map and page, Page; and the Map menu row that hides them with the
// controls over the drawing. Both are browser settings.
$ec_lang['lpn_settings_override_marks']='Show override markers on the map';
$ec_lang['lpn_settings_override_marks_tip']='Show the amber ring on an asset with an override in the open scenario, and the dashed gray ring on an asset that inherits one. The Tables pane marks overrides either way. Map, Clean map hides the rings while it is checked. This is a setting for this browser, not for the project.';
$ec_lang['lpn_clean_map']='Clean map';
$ec_lang['lpn_clean_map_tip']='Checked: the zoom buttons, the street map and satellite button, the Messages button and the notices, the selection help, the feedback button, and the override rings are hidden. Cleared: they are shown. Errors are still shown on the map, and every notice is still kept in Messages. This is a setting for this browser, not for the project.';
$ec_lang['lpn_settings_theme']='Theme';
$ec_lang['lpn_settings_theme_tip']='Choose light or dark colors for the page. System follows the setting of your device. The map drawing looks the same in every theme. This is a setting for this browser, not for the project.';
$ec_lang['lpn_theme_system']='System';
$ec_lang['lpn_theme_light']='Light';
$ec_lang['lpn_theme_dark']='Dark';
$ec_lang['lpn_settings_id_prefixes']='ID prefixes';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Values';
$ec_lang['lpn_settings_defaults_note']='Used for assets you create from now on. Existing assets are not changed.';
$ec_lang['lpn_settings_push_note']='Only the properties whose labels are showing right now are applied.';
$ec_lang['lpn_settings_push_btn']='Apply these new-asset values to every existing asset';
$ec_lang['lpn_push_confirm']='Replace these properties on every existing asset with the values now set for new assets? Values you have entered will be overwritten. This can be undone.';
$ec_lang['lpn_push_properties']='Properties:';
$ec_lang['lpn_push_assets']='Nodes and pipes:';
$ec_lang['lpn_push_none_displayed']='None of these values is showing as a label right now, so there is nothing to apply. Turn on the labels for the properties you want in the Labels panel, then try again.';
$ec_lang['lpn_push_nothing']='No existing asset has any of the properties being applied.';
$ec_lang['lpn_push_no_change']='Every asset already has these values, so nothing would change.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Custom properties';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='User-defined properties. Stored with the project and scenarios like all other properties.';
$ec_lang['lpn_cp_design']='Design';
$ec_lang['lpn_cp_design_tip']='One row per custom property, and each opens to show: Key, Label, Applies to, Validate as, Allow or restrict, the characters field named by that choice, Length lower limit, Length upper limit, Low limit, High limit.';
$ec_lang['lpn_cp_add']='Add custom property';
$ec_lang['lpn_cp_add_tip']='Add a row to the design table and open it for editing.';
$ec_lang['lpn_cp_remove_tip']='Remove this property from the design table. Values already entered on assets are kept in the file and are restored if a property with the same key is defined again.';
$ec_lang['lpn_cp_none']='No custom property is designed yet.';
$ec_lang['lpn_cp_unnamed']='Not named yet';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Key';
$ec_lang['lpn_cp_key_tip']='Key: A property is stored under this name. Spaces are not allowed, and a prefix is added for you so that your key can never collide with a built-in field.';
$ec_lang['lpn_cp_label']='Label';
$ec_lang['lpn_cp_label_tip']='Label: Appears in the properties box, in Find and at the head of a table column.';
$ec_lang['lpn_cp_applies']='Applies to';
$ec_lang['lpn_cp_applies_tip']='Applies to: Comma separated list of ID prefixes for assets that use this property, such as J,L,R.';
$ec_lang['lpn_cp_validate']='Validate as';
$ec_lang['lpn_cp_validate_tip']='Validate as: The format a valid value must have. The case rules apply to the English alphabet only. Choose Do not validate to accept any value.';
$ec_lang['lpn_cp_restrict']='Restrict these characters';
$ec_lang['lpn_cp_restrict_tip']='Restrict these characters:';
$ec_lang['lpn_cp_allow_tip']='Allow only these characters:';
$ec_lang['lpn_cp_characters_tip']='"@" means any letter; "#" means any numeric digit, and you must separately list "-", ".", and "," if they are allowed; and any white space characters must be between other characters.';
$ec_lang['lpn_cp_restrict_mode']='Allow or restrict';
$ec_lang['lpn_cp_restrict_mode_tip']='Allow or restrict: The given characters are either the only ones a value may use or the ones it may not use.';
$ec_lang['lpn_cp_restrict_allow']='Allow only these characters';
$ec_lang['lpn_cp_minlength']='Length lower limit';
$ec_lang['lpn_cp_minlength_tip']='Length lower limit: Any shorter entry is flagged. Use it to find empty and incomplete entries.';
$ec_lang['lpn_cp_length']='Length upper limit';
$ec_lang['lpn_cp_length_tip']='Length upper limit: Any longer entry is flagged.';
$ec_lang['lpn_cp_low']='Low limit';
$ec_lang['lpn_cp_low_tip']='Low limit: This is the smallest value you expect. Numbers are compared as numbers and text in dictionary order.';
$ec_lang['lpn_cp_high']='High limit';
$ec_lang['lpn_cp_high_tip']='High limit: This is the largest value you expect. Numbers are compared as numbers and text in dictionary order.';
$ec_lang['lpn_cp_val_none']='Do not validate';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Number .';
$ec_lang['lpn_cp_val_number_comma']='Number ,';
$ec_lang['lpn_cp_val_integer']='Integer';
$ec_lang['lpn_cp_val_upper']='ALL CAPS';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} The value is kept exactly as you entered it.';
$ec_lang['lpn_valwarn_diameter']='A pipe or valve diameter is normally between {min} and {max} {unit}. Check the number and the diameter unit.';
$ec_lang['lpn_valwarn_hw']='A Hazen-Williams C is normally between {min} and {max}. A number outside that range is often a roughness meant for another friction method.';
$ec_lang['lpn_valwarn_manning']='A Manning n is normally between {min} and {max}. A number outside that range is often a roughness meant for another friction method.';
$ec_lang['lpn_valwarn_dw']='A Darcy-Weisbach roughness is normally more than 0 and at most {max} {unit}. A larger number is often a Hazen-Williams C or a Manning n.';
$ec_lang['lpn_valwarn_positive']='EPANET does not accept zero or a negative number here.';
$ec_lang['lpn_valwarn_negative']='EPANET does not accept a negative number here.';
$ec_lang['lpn_valwarn_tank_levels']='EPANET does not accept this tank. The lowest water depth must not exceed the water depth, and the water depth must not exceed the highest water depth.';
$ec_lang['lpn_cp_bad_number']='This value is not a number as required for this property.';
$ec_lang['lpn_cp_bad_integer']='This value is not a whole number as required for this property.';
$ec_lang['lpn_cp_bad_case']='This value is not ALL CAPS as required for this property.';
$ec_lang['lpn_cp_bad_chars']='This value uses a character this property does not allow.';
$ec_lang['lpn_cp_bad_space']='White space is allowed only between other characters.';
$ec_lang['lpn_cp_bad_minlength']='This value is shorter than this property allows.';
$ec_lang['lpn_cp_bad_length']='This value is longer than this property allows.';
$ec_lang['lpn_cp_bad_low']='This value is below the low limit of this property.';
$ec_lang['lpn_cp_bad_high']='This value is above the high limit of this property.';
$ec_lang['lpn_cp_key_needed']='Give this custom property a key with no spaces.';
$ec_lang['lpn_cp_key_taken']='Another custom property already uses that key.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Scenario';
$ec_lang['lpn_scenario_base']='Base';
// "Base" is four letters carrying six English senses, standing alone as a proper name in a dropdown.
// KEPT, because Tom is right that it is solid where it sits (2026-08-14) and it is what WaterGEMS and
// InfoWater scenario managers call it -- so the fix belongs here, not in the English. Word list is
// his; "Original" was struck at his instruction.
// "Overrides" (Tom, 2026-10-04: *"I believe that the technical term may be 'Enter the scenario's
// override'"*; Mary found it is Bentley WaterGEMS's word, "Overriding Inheritance"). It replaced
// "custom values" (2026-08-14). The rejected alternative stays rejected for a TRANSLATION reason:
// "own values" calques onto the standard term for EIGENVALUES in most of Europe (es valores propios,
// de Eigenwerte, ru sobstvennye), and "changed values" is FALSE, because an override may equal
// Base's number (lpn_scenario_override_tip; dev/lpn-spike/scenario-harness.js). "Override" has no
// mathematical calque and says the scenario's value stands in for the parent's.
$ec_lang['lpn_scenario_overrides']='No. of overrides';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='The amber ring means this asset has an override in the scenario {name}.';
$ec_lang['lpn_scenario_mark_inh_tip']='The dashed gray ring means the scenario {name} inherits an override for this asset from its parent scenario or alternative.';
$ec_lang['lpn_scenario_overrides_tip']='Each override is marked on the map with an amber ring. Switch to {base} or another parent scenario to see the drawing without them.';
$ec_lang['lpn_scenario_menu']='Scenarios';
$ec_lang['lpn_scenario_tip']='The set of values the drawing is showing and the page is solving right now. Click to switch scenarios, or to add, rename, or delete one.';
$ec_lang['lpn_scenario_new']='New scenario…';
$ec_lang['lpn_scenario_new_name']='Scenario {n}';
$ec_lang['lpn_scenario_prompt_name']='Name for this scenario';
$ec_lang['lpn_scenario_rename']='Rename scenario…';
$ec_lang['lpn_scenario_delete']='Delete scenario';
$ec_lang['lpn_scenario_delete_ask']='Delete the scenario {name}? The drawing itself is not changed.';
$ec_lang['lpn_scenario_delete_goes']='Its overrides ({n}) are deleted with it.';
$ec_lang['lpn_scenario_delete_stays']='These alternatives it uses stay in the project: {list}.';
$ec_lang['lpn_scenario_delete_has_children']='The scenario {name} cannot be deleted because it has children: {list}. Delete those first, or move them to another parent.';
// Edited by TGH 2026-09-07
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Base scenario: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} is excluded from the network in {scenario}. It remains in the drawing and in the other scenarios.';
$ec_lang['lpn_scenario_delete_in_base']='To remove it from the drawing, delete it in the {base} scenario.';
$ec_lang['lpn_scenario_only_deleted']='{id} is deleted. It was part of {scenario} only.';
$ec_lang['lpn_scenario_delete_blocked']='{id} is not deleted, because link {link} ends on it, and that link also exists outside {scenario}. To delete both, delete them in the {base} scenario.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_basic']='Basic mode';
$ec_lang['lpn_scenario_basic_tip']='Checked: alternatives are hidden and automatic, each scenario shows its overrides as its own, and all new scenarios are children of the Base scenario; the Scenario manager and the Scenarios table are not shown. Cleared: the Scenario manager and the Scenarios table are shown, and alternatives can be shared among scenarios. Scenario manager is disabled when Basic mode is on. Basic mode is disabled when a project has scenario and alternative relationships that Basic mode cannot show.';
$ec_lang['lpn_scenario_basic_misfit']='This project has scenarios and alternatives relationships that are not compatible with Scenarios Basic mode, so Basic mode is disabled.';
$ec_lang['lpn_scenario_basic_misfit_base']='The Base scenario uses an alternative other than Base.';
$ec_lang['lpn_scenario_copy']='Copy scenario';
$ec_lang['lpn_scenario_copy_tip']='Copies the open scenario and its overrides, and opens the copy.';
$ec_lang['lpn_scenario_copy_off']='Copy scenario works in Basic mode. With Basic mode off, add a scenario and choose its alternatives in the Scenarios table.';
$ec_lang['lpn_sm_title']='Scenario manager';
$ec_lang['lpn_sm_menu']='Scenario manager…';
$ec_lang['lpn_sm_basic_on']='Scenario manager is disabled when Basic mode is on.';
$ec_lang['lpn_pane_tab_scenarios']='Scenarios';
$ec_lang['lpn_sm_col_parent']='Parent';
$ec_lang['lpn_sm_add_child']='Add child';
$ec_lang['lpn_sm_add_base']='Add base';
$ec_lang['lpn_sm_add_base_tip']='Add another Base scenario. It starts as a copy of Base, with its own alternatives, and later edits to Base do not change it.';
$ec_lang['lpn_sm_add_base_alt_tip']='Add another Base alternative. It starts as a copy of Base\'s values in this category, and later edits to Base do not change it.';
$ec_lang['lpn_sm_delete']='Delete the selected item. A used item is not deleted.';
$ec_lang['lpn_sm_base_kept']='The Base of a tree is not deleted. Another Base added with Add base is deleted when nothing uses it.';
$ec_lang['lpn_sm_rename']='Rename';
$ec_lang['lpn_sm_rename_alts_ask']='Rename equally named alternatives?';
$ec_lang['lpn_sm_make_current']='Make current';
// Tips on greyed Scenario manager commands, saying why they are greyed (Perry, 2026-10-11).
$ec_lang['lpn_sm_current_already']='This scenario is already the current scenario.';
$ec_lang['lpn_sm_none_selected']='Select an item in the tree first.';
$ec_lang['lpn_sm_base_named']='The Base of a tree is not renamed.';
$ec_lang['lpn_sm_copy']='Copy';
$ec_lang['lpn_sm_merge_up']='Merge upward';
$ec_lang['lpn_sm_merge_up_tip']='Move the overrides of the selected alternative into an alternative above it in the tree. The selected alternative then inherits those values.';
$ec_lang['lpn_sm_merge_up_root']='A Base alternative has nothing above it to merge into.';
$ec_lang['lpn_sm_merge_none']='The alternative {name} has no overrides to merge.';
$ec_lang['lpn_sm_merge_pick']='Merge the overrides of {name} into which alternative? Its parent is listed first.';
$ec_lang['lpn_sm_merge_ask']='Move the overrides ({n}) of {name} up into {target}? Afterward, it inherits them instead of overriding them. You can undo this.';
$ec_lang['lpn_sm_merge_skipped']='{between} also overrides these values. It is skipped and not changed, so {name} will read them from {between}, not from {target}:';
$ec_lang['lpn_sm_merge_line']='{asset}: {property}';
$ec_lang['lpn_sm_copy_up']='Copy upward';
$ec_lang['lpn_sm_copy_up_tip']='Copy the overrides of the selected alternative into an alternative above it in the tree. The selected alternative keeps its overrides.';
$ec_lang['lpn_sm_copy_up_root']='A Base alternative has nothing above it to copy into.';
$ec_lang['lpn_sm_copy_none']='The alternative {name} has no overrides to copy.';
$ec_lang['lpn_sm_copy_pick']='Copy the overrides of {name} into which alternative? Its parent is listed first.';
$ec_lang['lpn_sm_copy_ask']='Copy the overrides ({n}) of {name} up into {target}? {name} keeps them as its own overrides. You can undo this.';
$ec_lang['lpn_sm_copy_skipped']='{between} also overrides these values. It is skipped and not changed, so it keeps its own values for them:';
$ec_lang['lpn_sm_list_overrides']='Override manager…';
$ec_lang['lpn_sm_list_overrides_tip']='List the scenario\'s overrides by category, each with the inherited value it overrides, and clear any of them.';
$ec_lang['lpn_sm_list_overrides_none']='This scenario has no overrides.';
$ec_lang['lpn_ovl_title']='Override manager: {name}';
$ec_lang['lpn_ovl_note']='These are the values this scenario sets itself in the alternatives it uses, each with the value it replaces. Values it inherits are neither listed nor counted. Clear an override to restore the inherited value; Undo reverses it. Select an ID to go to the asset on the map.';
$ec_lang['lpn_ovl_clear_selected']='Clear selected overrides';
$ec_lang['lpn_ovl_clear_all']='Clear all overrides';
$ec_lang['lpn_ovl_clear_all_ask']='Clear all the overrides ({n}) of {name}? Each value returns to the inherited value. Undo reverses this.';
$ec_lang['lpn_ovl_pick_tip']='Select this override for the Clear selected overrides button.';
$ec_lang['lpn_ovl_bubble_off']='Not on the map';
$ec_lang['lpn_ovl_bubble_moved']='{quantity}, moved or resized';
$ec_lang['lpn_ovl_group']='{category}: {alternative}';
$ec_lang['lpn_ovl_col_override']='Override';
$ec_lang['lpn_ovl_col_inherited']='Inherited value';
$ec_lang['lpn_ovl_col_inherited_tip']='The value this scenario reads without the override: the value of the parent of the alternative, or the Base value.';
$ec_lang['lpn_ovl_same']='(same)';
$ec_lang['lpn_ovl_same_tip']='Equal to the inherited value. It is still an override, and it is counted.';
$ec_lang['lpn_sm_help']='How scenarios and alternatives work:\\n\\nIn Basic mode, alternatives are hidden and automatic, and all new scenarios are children of the Base scenario.\\n\\nWith Basic mode off, a complex inheritance tree is available, and alternatives can be shared among scenarios. But the default behavior of edits when a new alternative association is needed (in the absence of proactive user management) is to create an alternative named like the current scenario, which gives each scenario its unique set of alternatives.\\n\\nProperties and settings belong to alternatives categories that appear as columns of the scenarios and alternatives table and as management options in Scenario manager.\\n\\nOverrides are created in scenarios, but they really belong to the respective alternatives associated with the scenario; so a scenario is like a window to its alternatives. Associations of alternatives to scenarios are managed in the right pane of the Scenario manager or in the Scenarios table in the bottom pane. Creating a new scenario creates no alternatives; the new scenario uses its parent\'s alternatives until overrides are created that need new alternatives. When overrides are created in a scenario, they are stored in their respective alternative for the scenario; if the scenario has no such alternative, a new alternative is created using the name of the scenario.\\n\\nExample: You create a "Figure: Node and link IDs" scenario and edit a Text to say "Node and Link IDs." When you create the scenario, no alternatives are created. But at the moment you save the Text, a Text alternative called "Figure: Node and link IDs" is created with the override for the Text value. In Basic mode, you see this as simply an override in the scenario itself.\\n\\nCopy properties copies only overrides. In any scenario other than Base, it copies only the overrides the asset has in that scenario.\\n\\nHow to manage scenarios:\\n\\n- Choose Scenarios or an alternatives category in the list at the top to show its tree.\\n\\n- Create a child of the selected item with Add child. Add base adds another Base, which starts as a copy of Base as it is now; later edits to Base do not change it. A new child is named after its parent; type a name to rename it. Copy copies the selected alternative. Merge upward moves the overrides of the selected alternative into an alternative above it, chosen by name, and the selected alternative then inherits them; it first names any value an alternative it skips also overrides, which is not changed. To copy a scenario, use Copy scenario in the Scenarios menu, in Basic mode; it copies the scenario\'s overrides, with the alternatives that hold them. Add base and Copy scenario each create alternatives: Add base creates a Base alternative for the new Base in each category that holds values, and Copy scenario creates a new alternative, named like the copy, for each alternative that holds the scenario\'s overrides.\\n\\n- Drag an item onto another to make it a child of that item. A scenario moved to a new parent inherits from it everything it has not overridden; what it has overridden does not change. Drag an item between two items to reorder them.\\n\\n- Click an item to select it. Press F2 or choose Rename to rename the selected item. Renaming a scenario asks whether to rename the alternatives that carry its name; in Basic mode they are renamed with it, without asking. Double-click a scenario or press Enter to make it current. Click the arrow beside an item or press Left or Right to collapse or expand it. Right-click an item for the same commands as the buttons.\\n\\n- Press Delete or click the minus button to delete the selected item. An item in use is not deleted, and the message names what uses it. Deleting a scenario with Basic mode off keeps the alternatives it uses. Deleting a scenario with Basic mode on also deletes each of its alternatives that no other scenario uses.\\n\\n- To make a scenario use another alternative, including Base, choose it in the scenario\'s row of the right pane of the Scenario manager or the Scenarios table. An override made in a shared alternative changes every scenario that uses it.';
$ec_lang['lpn_sm_delete_alt_ask']='Delete the alternative {name}?';
$ec_lang['lpn_sm_in_use']='{item}\ncannot be deleted while it is used by\n{list}';
$ec_lang['lpn_sm_alt_delete_has_children']='The alternative {name} cannot be deleted because it has children: {list}. Delete those first, or move them to another parent.';
$ec_lang['lpn_sm_item_scenario']='Scenario {name}';
$ec_lang['lpn_sm_item_alternative']='Alternative {name}';
$ec_lang['lpn_sm_name_taken']='The name {name} is already used in this tree.';
$ec_lang['lpn_sm_cycle']='{name} cannot be moved under one of its own children.';
$ec_lang['lpn_sm_used_by']='Used by scenarios: {n}';
$ec_lang['lpn_sm_used_by_tip']='Used by: {list}';
$ec_lang['lpn_sm_used_by_none']='Not used by any scenario';
$ec_lang['lpn_sm_tree_all']='All';
$ec_lang['lpn_sm_tree_unused']='All unused';
$ec_lang['lpn_sm_unused_none']='None';
$ec_lang['lpn_sm_all_row_tip']='Double-click to open it in its category tree.';
$ec_lang['lpn_sm_compare_tip']='Include in Scenario comparison';
$ec_lang['lpn_sm_inherited']='inherited';
$ec_lang['lpn_sm_shared_note']='Shared with: {list}';
$ec_lang['lpn_scncmp_none_checked']='No scenario is checked for comparison. Check scenarios in the Scenario manager.';
$ec_lang['lpn_time_scn_overrides']='Scenario overrides:';
$ec_lang['lpn_settings_table_major']='Major heading';
$ec_lang['lpn_settings_table_minor']='Minor heading';
$ec_lang['lpn_settings_table_category']='Category';
// The Settings table's third heading level, between Minor heading and Setting: the label field, coloured
// field, asset or custom property a group of settings belongs to (Tom, 2026-10-07: "We could call it
// 'Owner'.").
$ec_lang['lpn_settings_table_owner']='Owner';
$ec_lang['lpn_settings_table_setting']='Setting';
$ec_lang['lpn_settings_table_yes']='Yes';
$ec_lang['lpn_settings_table_no']='No';
$ec_lang['lpn_settings_row_of']='{setting}, {member}';
$ec_lang['lpn_settings_row_labels_field']='{labels}: {field}';
$ec_lang['lpn_settings_row_labels_part']='{labels}: {field}, {part}';
$ec_lang['lpn_settings_row_labels_customer']='Customer labels';
$ec_lang['lpn_settings_row_label_before']='Text before';
$ec_lang['lpn_settings_row_label_after']='Text after';
// A label field's settings, named in the Setting column with the field itself in the Owner column
// (Tom, 2026-10-07: "Symbology.Node labels.ID.Is Active", "Show order", "Drop order"). Whether the
// value appears on the label at all; where it sits on the label (1 first); which value is given up
// first when labels crowd (1 first).
$ec_lang['lpn_settings_row_label_on']='Is active';
$ec_lang['lpn_settings_row_label_show']='Show order';
$ec_lang['lpn_settings_row_label_drop']='Drop order';
// The Setting column of an ID prefix row; the asset it applies to is in the Owner column.
$ec_lang['lpn_settings_row_id_prefix']='ID prefix';
$ec_lang['lpn_settings_row_symbol_cap_multiple']='Largest symbol, as a multiple of a typical pipe length';
$ec_lang['lpn_settings_row_symbol_cap_percentile']='Typical pipe length, as a percentile of all pipe lengths';
$ec_lang['lpn_settings_row_contour_labels']='Contour labels';
$ec_lang['lpn_settings_row_check_freq']='Status check frequency';
$ec_lang['lpn_settings_row_max_check']='Maximum status checks';
$ec_lang['lpn_settings_row_status_report']='Status report';
$ec_lang['lpn_settings_row_pda_src']='Pressure driven options stated in the file';
$ec_lang['lpn_settings_row_quality_option']='Quality option as the file states it';
$ec_lang['lpn_settings_row_tolerance']='Accuracy (older projects)';
$ec_lang['lpn_settings_row_emitter_exponent_old']='Emitter exponent (older projects)';
$ec_lang['lpn_settings_row_elev_source_old']='Elevation source (older projects)';
$ec_lang['lpn_settings_row_basemap']='Basemap';
$ec_lang['lpn_settings_row_basemap_last']='Basemap to return to';
$ec_lang['lpn_settings_row_customer_max_width']='Show customer labels when zoomed to this map width or less';
$ec_lang['lpn_settings_row_quality_step']='Quality time step';
$ec_lang['lpn_settings_row_view']='Map view (center and scale)';
$ec_lang['lpn_settings_row_bubbles']='Time series graphs on the map';
$ec_lang['lpn_settings_row_contour_fill']='Contour fill';
$ec_lang['lpn_settings_row_contour_opacity']='Contour fill opacity';
$ec_lang['lpn_settings_row_contour_interval']='Contour interval';
$ec_lang['lpn_settings_row_contour_buffer']='Contour buffer';
$ec_lang['lpn_settings_row_contour_terrain']='Contour ground between nodes from Mapbox DEM';
$ec_lang['lpn_settings_row_new_asset']='New assets: {setting}';
$ec_lang['lpn_settings_row_default']='{value} (default)';
$ec_lang['lpn_settings_row_view_value']='Center {x}, {y}; scale {s}';
$ec_lang['lpn_settings_held_in']='Override in {scenario}.';
$ec_lang['lpn_settings_held_base']='{base}: {value}';
$ec_lang['lpn_settings_view_center']='Map center';
$ec_lang['lpn_settings_view_scale']='Map scale';
$ec_lang['lpn_settings_view_scale_tip']='The scale at the center of the map, as 1:N. Type 1:2000, or just 2000, to zoom to that scale.';
$ec_lang['lpn_settings_view_top_left']='Top left corner';
$ec_lang['lpn_settings_view_bottom_right']='Bottom right corner';
$ec_lang['lpn_settings_view_save']='Save this view in this scenario';
$ec_lang['lpn_settings_view_save_tip']='Stores this map center and scale in the open scenario, so opening that scenario moves the map here. Moving the map afterward changes nothing until you press this again. Clear the override to follow the {base} view again.';
$ec_lang['lpn_settings_row_basemap_osm']='Street map';
$ec_lang['lpn_settings_row_basemap_satellite']='Satellite images';
$ec_lang['lpn_settings_row_basemap_topo']='Topo map';
$ec_lang['lpn_settings_units_one_project']='Units are the same in every scenario.';
$ec_lang['lpn_settings_restore_base_only']='Switch to Base to restore the defaults.';
$ec_lang['lpn_alt_cat_physical']='Physical';
$ec_lang['lpn_alt_cat_demand']='Demand';
$ec_lang['lpn_alt_cat_topology']='Active topology';
$ec_lang['lpn_alt_cat_topology_tip']='Asset activation';
$ec_lang['lpn_alt_cat_initial']='Initial settings';
$ec_lang['lpn_alt_cat_constituent']='Constituent';
$ec_lang['lpn_alt_cat_fireflow']='Fire flow';
$ec_lang['lpn_alt_cat_energy']='Energy cost';
$ec_lang['lpn_alt_cat_userdata']='Custom properties';
$ec_lang['lpn_alt_cat_text']='Text';
$ec_lang['lpn_alt_cat_presentation']='Presentation';
$ec_lang['lpn_alt_cat_calculation']='Calculation';
// Edited by TGH 2026-09-07
// Task 721: the scenarios every new project starts with. Keep the leading number: the list sorts
// by name, and the numbers hold Tom's order in every language.
$ec_lang['lpn_scenario_preset_flow_static']='1. Flow test: Static';
$ec_lang['lpn_scenario_preset_flow_static_tip']='Flow test calibration for a design network at 0 flow. In this scenario, set the demand at all junctions to 0.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. Flow test: Mid';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='Flow test calibration for a design network at the first flow reported. In this scenario, set the demand at the flowing junction to the first flow measured, and the demand at all other junctions to 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. Flow test: Max';
$ec_lang['lpn_scenario_preset_flow_max_tip']='Flow test calibration for a design network at the max flow reported. In this scenario, set the demand at the flowing junction to the max flow measured, and the demand at all other junctions to 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. Average Day';
$ec_lang['lpn_scenario_preset_average_day_tip']='Demand multiplier 1: every demand as entered, which is taken to be average day demand.';
$ec_lang['lpn_scenario_preset_max_day']='5. Max Day';
$ec_lang['lpn_scenario_preset_mult_tip']='Demand multiplier {mult} times average day, a placeholder value. Most systems fall between {lo} and {hi} (National Research Council, 2006). Set the value for the system being modeled in Settings, Calculation, Hydraulics, Demand multiplier.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. Peak hour';
$ec_lang['lpn_delete_drops_overrides']='Deleting this asset also deletes its scenario overrides ({n}). Continue?';
$ec_lang['lpn_push_base_only']='This action changes the drawing itself, so it can only be done in {base}. Switch to {base} and try again.';
$ec_lang['lpn_field_active']='Is active?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Clear this box to leave the asset on the drawing but out of the network: it is drawn grey and the solver ignores it. In a scenario this is how a pipe is switched on and off.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Emitter exponent';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='The exponent in EPANET’s emitter equation for sprinklers and leaks: flow = coefficient x pressure raised to this exponent. It affects results only at nodes with an emitter coefficient.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Read DEM';
$ec_lang['lpn_elev_dem_sample_tip']='Read the elevation of the DEM at this node and show it below. Nothing in the Elevation box is changed. The horizontal DEM resolution is about 30 m for most of the Earth, and finer where better data exists.';
$ec_lang['lpn_elev_dem_use']='Use DEM';
$ec_lang['lpn_elev_dem_use_tip']='Put the elevation of the DEM at this node into the Elevation box above, replacing what is there. The DEM is read first if it has not been read yet. One Undo puts it back.';
$ec_lang['lpn_elev_dem_none']='The DEM has no elevation for this node.';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM elevation: {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Elevation source';
$ec_lang['lpn_settings_elev_source_tip']='Mapbox DEM accuracy in 2026, horizontal then vertical: 1–10 m and under 1 m in the US, 2–10 m and 1–3 m in Europe and Japan, 30 m and 10–16 m globally, and 90 m and over 16 m at the poles.';
$ec_lang['lpn_settings_elev_source_typed']='Above';
$ec_lang['lpn_settings_elev_source_dem']='Mapbox DEM';
$ec_lang['lpn_settings_accuracy']='Accuracy';
// **APPENDED TO EVERY HYDRAULICS TIP, because the box no longer shows the default** (Tom,
// 2026-09-01: *"There's no value, and the tip states the default."*). A whole sentence with a
// number in it, joined to the tip's own sentences -- not a fragment composed into a label, which is
// the thing dev/language-strings.md forbids. It is true of every row it is appended to, which is
// the test a shared sentence has to pass.
//
// **IT SAID "The usual value is {n}." FOR ONE REVIEW AND TOM STRUCK IT:** *"'Usual' is not a
// synonym of 'default'. You are calling it default in our conversation, and yet you put 'usual'."*
// **Default IS the standard term** -- EPANET's own, every engineering interface's own -- and
// replacing it with a plain-English near-miss makes the string HARDER to translate, not easier,
// because the translator has no term to look up. See the correction added to
// dev/language-strings.md and guarded by dev/scripts/plain_english_swap_check.php.
$ec_lang['lpn_settings_default_is']='The default is {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='Convergence limit the solver must reach before it stops, measured as the total change in flow from one trial to the next, divided by the total flow in the links. A smaller number is more exact and takes longer.';
$ec_lang['lpn_settings_specific_gravity']='Specific gravity';
$ec_lang['lpn_settings_viscosity']='Relative viscosity';
// **THE PASHTO COLLISION THIS ANSWERS IS REAL AND IS INSIDE PASHTO** (sprint 584-wave1). ps renders
// this key with the word غلظت, which carries BOTH viscosity/thickness AND concentration -- so it
// collided with the word the same sprint used for lpn_result_concentration, on the same screen.
// Tom approved a synonym on 2026-09-06. **HIS FIRST WORDING WAS 'Relative rate of diffusion' and it
// is NOT what shipped**: that is diffusivity, and this key is viscosity. He was given a friction
// entry that quoted a translator's mistaken description of the key without anyone checking it
// against this file -- so the note below says what the number IS and what it is NOT, because two
// separate readers have now reached for a transport coefficient on a fluid property.
$ec_lang['lpn_settings_viscosity_tip']='The viscosity of the fluid compared with water at 20 degrees Celsius. It only changes the answer under the Darcy-Weisbach method.';
$ec_lang['lpn_settings_trials']='Maximum trials';
$ec_lang['lpn_settings_trials_tip']='Maximum number of trials before the solver stops on a network that does not converge.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='If it does not converge';
$ec_lang['lpn_settings_unbalanced_tip']='Action for a network that has used up its trials and still has not converged. Allowing extra trials often reaches convergence. Stopping reports the last trial as it stands, which is not a solution.';
$ec_lang['lpn_settings_unbalanced_continue']='Allow extra trials';
$ec_lang['lpn_settings_unbalanced_stop']='Stop and report the last trial';
$ec_lang['lpn_settings_unbalanced_trials']='Extra trials before reporting';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Number of further trials allowed after the maximum above is used up, before the last trial is reported.';
$ec_lang['lpn_settings_head_error']='Head error limit';
$ec_lang['lpn_settings_head_error_tip']='An additional test the solver must pass before it stops: the largest head error remaining in any one pipe. Zero means do not apply this test.';
$ec_lang['lpn_settings_flow_change']='Flow change limit';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='An additional test the solver must pass before it stops: the maximum change in any one pipe’s flow from one trial to the next. Zero means do not apply this test.';
$ec_lang['lpn_settings_damp_limit']='Damping starts at';
$ec_lang['lpn_settings_damp_limit_tip']='The accuracy at which the solver begins taking smaller steps, which can help an oscillating network to converge. Zero means the solver never damps.';
$ec_lang['lpn_settings_option_unset']='Not stated';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='A single factor applied to every demand in the network at once. Each scenario can have a separate value, so average day, maximum day, or peak hour can be created by changing only this setting.';
$ec_lang['lpn_settings_engine_native']='Use the built-in solver when possible';
// **THIS TIP NO LONGER ARGUES THE TWO SOLVERS AGAINST EACH OTHER** (Task 605, Tom 2026-09-06:
// *"We scrub our tips and alerts for any undue weight on the existence of two solvers."*). It
// spent three sentences on speed and on the two measured disagreements -- minor losses 0.08%
// (EPANET rounds g to 32.2 ft/s^2) and Manning 0.6% -- addressed to a reader who is no longer
// being asked to choose an engine. Both are still announced in the status line when a network
// actually holds the thing, which is where they are a fact about the number on screen rather
// than a comparison offered in advance.
//
// What the tip keeps is the two things a person ticking this box does need: which paths go to
// EPANET whatever the box says, and the one-time download, which is the cost a visitor on a slow
// connection actually pays.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_engine_native_tip']='Enable this to use the built-in solver where possible. Otherwise, the EPANET solver from the US EPA is always used. The built-in solver is not used for extended period simulations or pressure breaker and general purpose valves (PBV, GPV). The first time the EPANET solver is used, about 650 KB is downloaded and then kept on this device. Where a pipe has a minor (local) loss, the two solvers differ in the last digits: EPANET uses a rounded value of gravitational acceleration, so its minor losses are very slightly lower than the exact form.';
$ec_lang['lpn_engine_loading']='Loading the EPANET solver…';
$ec_lang['lpn_engine_failed']='The EPANET solver could not be loaded. Showing the built-in solver instead.';
$ec_lang['lpn_engine_failed_why']='{reason} Showing the built-in solver instead.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='Solved with the EPANET solver, because of these pressure breaker and general purpose valves:';
$ec_lang['lpn_unit_unknown']='This drawing states a unit this page does not support: {unit}. All values are kept and displayed exactly as imported, and nothing was changed. Nothing can be computed until the unit is supported, because its conversion factor is unknown.';
$ec_lang['lpn_engine_manning_note']='Note: with Manning roughness, EPANET rounds the constant in the Manning equation, so head loss is about 0.6% lower than the exact form.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='The EPANET solver rejected this network, so the run did not start.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='EPANET solver message: {message}';
$ec_lang['lpn_engine_refused_fallback']='The numbers on screen came from the built-in solver instead.';
// A run EPANET started and could not finish, for example when a tank empties and the junctions it
// fed have no other source (Error 110). {time} is the run time it stopped at, H:MM.
$ec_lang['lpn_time_run_stopped']='The EPANET run stopped at {time}, so it has no results. Its run report says why.';
$ec_lang['lpn_time_stat_stopped']='{statistic} not shown: the run stopped before the end of the period.';
$ec_lang['lpn_time_stopped_no_quality']='No water quality results were computed, because the quality analysis starts after the hydraulic run ends.';
$ec_lang['lpn_energy_stopped']='The EPANET run stopped before the end of the period, so no pump energy results were computed.';
$ec_lang['lpn_time_run_stopped_kept']='The EPANET run stopped at {time}. Results run to {solved}, the last period it solved, and none are shown after it. Its run report says why.';
// Why a stopped run stopped, read from EPANET's own run report (R-402). {link} is the link EPANET
// had just closed, {tank} the tank at one end of it, {nodes} the ids of the nodes EPANET then could
// not solve for, comma-separated. Follows lpn_time_run_stopped or lpn_time_run_stopped_kept.
$ec_lang['lpn_time_run_cut_off']='EPANET had closed {link} and then could not solve for {nodes}.';
$ec_lang['lpn_time_run_cut_off_full']='Tank {tank} was full, so EPANET had closed {link} to keep water out of it, and then could not solve for {nodes}. This can happen when a full tank has no water leaving it, as when every demand is zero. A demand slightly above zero, or a tank level slightly below its maximum, avoids it.';
$ec_lang['lpn_time_run_cut_off_empty']='Tank {tank} was empty, so EPANET had closed {link} to keep it from draining further, and then could not solve for {nodes}.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='The numbers on screen came from the built-in solver instead. It solves one instant at a time, so this is the network at {time} only, with every tank at its initial level.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='These controls refer to an element that is no longer in this project, so they were ignored: {ids}';
$ec_lang['lpn_control_unreadable_note']='These controls could not be read, so they were left out: {ids}';
$ec_lang['lpn_control_inactive_note']='These controls refer to an asset that is inactive in this scenario, so they are ignored in its run: {ids}';
$ec_lang['lpn_rule_inactive_note']='These rules refer to an asset that is inactive in this scenario, so they are ignored in its run: {ids}';
$ec_lang['lpn_rule_dangling_note']='These rules refer to an element that is no longer in this project, so they were ignored in this run: {ids}';
$ec_lang['lpn_rule_unreadable_note']='These rules could not be read, so they were ignored in this run: {ids}';
$ec_lang['lpn_settings_text_size']='Text size (pixels)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Symbol size (pixels)';
$ec_lang['lpn_settings_link_width']='Link line width (pixels)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Flow direction arrows';
$ec_lang['lpn_settings_show_arrows_tip']='Draw an arrow on each pipe showing which way the water is running. The arrows appear after a run, and turning them off leaves the results unchanged.';
$ec_lang['lpn_settings_align_labels']='Draw link labels along the link line';
$ec_lang['lpn_settings_readability_bias']='Label flip angle adjustment (degrees)';
$ec_lang['lpn_settings_readability_bias_tip']='Flip a label to keep it right side up when it leans more than this many degrees left of vertical.';
$ec_lang['lpn_settings_mask_labels']='Solid background behind labels';
$ec_lang['lpn_settings_text_halo']='Text halo width (percent of text size)';
$ec_lang['lpn_settings_text_halo_tip']='Width of the solid outline behind map text, as a percent of the text size. Applies when Solid background behind labels is on.';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Snap leader lines to set angles';
// Edited by TGH 2026-09-07
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Show labels when zoomed to this map width or less';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Labels are drawn only while the map view is this wide or narrower. Leave the box blank to draw them at every zoom. Enter 0 to never draw a label, at any zoom.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Always show';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap_sentence']='Prevent nodes from scaling larger than {n} times the length of the {p} percentile pipe';
$ec_lang['lpn_settings_symbol_cap_tip']='Junctions stop holding their screen size once their map diameter would be this many times the length of the pipe at this percentile of all pipe lengths in the network. Past that point on the map, junctions, pipes and other symbols shrink on the screen as you zoom out. Reservoirs and tanks are the exception and keep their screen size at every zoom.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Symbol opacity (0 to 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Background image opacity (0 to 1)';
// Task 617: a display-time filter on the street or satellite tiles only; the drawing and the credit are untouched.
$ec_lang['lpn_settings_basemap_style']='Basemap style';
$ec_lang['lpn_basemap_style_normal']='Normal';
$ec_lang['lpn_basemap_style_muted']='Muted';
$ec_lang['lpn_basemap_style_faded']='Faded';
$ec_lang['lpn_basemap_style_grayscale']='Grayscale';
$ec_lang['lpn_settings_map_display']='Appearance';
// PARKED 2026-08-14, not deleted. The "Map height" settings row was removed when the map learned
// to fill the window by itself (Tom: "So Map height is now obsolete. Right?" -- yes; see
// LPN_MAP_MIN in js/looped-network.js). Nothing renders these two keys now, so key_hygiene_check
// will list them; that is expected and they are kept on purpose, because restoring a settings row
// is cheap and recovering 27 translations is not.
//
// **IF THE ROW EVER COMES BACK, REWRITE THE TIP FIRST -- it is now FALSE in all 27 languages.** It
// promises "part of the page is always left to scroll", which is the exact behaviour the fit-the-
// window change removed. Reusing it as-is would ship a confident wrong explanation everywhere at
// once, which is worse than having no tip at all.
// The cap in applyMapHeight() makes this field look ignored on a phone (ROADMAP Task 146.08's
// own note). It is a render cap, not a stored value -- say so instead of leaving the user to guess.
$ec_lang['lpn_settings_legend_position']='Labels legend position';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='None';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Off';
$ec_lang['lpn_settings_legend_top_left']='Top left';
$ec_lang['lpn_settings_legend_top_right']='Top right';
$ec_lang['lpn_settings_legend_middle_left']='Middle left';
$ec_lang['lpn_settings_legend_middle_right']='Middle right';
$ec_lang['lpn_settings_legend_bottom_left']='Bottom left';
$ec_lang['lpn_settings_legend_bottom_right']='Bottom right';
$ec_lang['lpn_settings_color_node_field']='Node color';
$ec_lang['lpn_settings_color_link_field']='Pipe color';
$ec_lang['lpn_settings_color_ramp']='Color scheme';
$ec_lang['lpn_settings_color_credits']='Credits';
$ec_lang['lpn_color_ramp_epanet']='Blue to red (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='Purple to yellow (easier to tell one color from the next)';
$ec_lang['lpn_color_ramp_gray']='Light to dark gray';
$ec_lang['lpn_settings_color_reverse']='Reverse the color order';
$ec_lang['lpn_color_none']='No color';
$ec_lang['lpn_settings_color_key_position']='Color legend position';
$ec_lang['lpn_settings_color_breaks']='Color band boundaries';
$ec_lang['lpn_settings_color_equal_intervals']='Equal intervals';
$ec_lang['lpn_settings_color_equal_counts']='Equal counts';
$ec_lang['lpn_settings_color_no_values']='There are no values to work from yet. Solve the network first.';
$ec_lang['lpn_confirm_restore_defaults']='Reset all settings (ID prefixes, starting values, solver settings, map appearance, legend position, and visible labels) to their original values? Your network is not changed. Settings belong to the open project, so other projects are not affected.';
// **"Start fresh", the nuclear option named as one** (Tom, 2026-09-09, after weighing "Restart app",
// "Clear cache", "Clear app" and "Flush cache": *"We want something that sounds like the nuclear
// option. And we give fair warning after clicking, so a long name isn't necessary."*).
// **"Clear cache" was the tempting one and it is the one to refuse**: it is the most familiar phrase
// of the set and it is a lie here. This deletes the visitor's SAVED PROJECTS, and everybody who has
// ever cleared a browser cache has done so expecting to lose nothing. A word that reads as safe on a
// control that is not safe is how somebody's work gets destroyed. "Restart app" fails more mildly in
// the same direction: a restart is something you recover FROM, not something that takes your files.
// The name is short because lpn_confirm_wipe below does the explaining, which is also why it does
// not have to say "on this page".
$ec_lang['lpn_settings_wipe_btn']='Start fresh';
$ec_lang['lpn_confirm_wipe']='Start fresh, and delete EVERYTHING saved for this page: every project, every background image, all settings, and your unit choices? The page reloads exactly as a brand-new visitor would see it. This cannot be undone.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Copy this link:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Time';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Total run time';
$ec_lang['lpn_time_hyd_step']='Hydraulic time step';
$ec_lang['lpn_time_pattern_step']='Pattern time step';
$ec_lang['lpn_time_pattern_start']='Pattern start time';
$ec_lang['lpn_time_report_step']='Report time step';
$ec_lang['lpn_time_report_start']='Report start time';
$ec_lang['lpn_time_clock_start']='Clock time at the start';
$ec_lang['lpn_time_statistic']='Statistic';
$ec_lang['lpn_time_stat_none']='None';
$ec_lang['lpn_time_stat_averaged']='Avg';
$ec_lang['lpn_time_stat_minimum']='Min';
$ec_lang['lpn_time_stat_maximum']='Max';
$ec_lang['lpn_time_stat_range']='Range';
$ec_lang['lpn_time_clock_day']='Day {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Enter times and durations as decimal hours (17.5 or 72.5) or in hours:minutes notation (17:30 or 72:30).';
$ec_lang['lpn_time_running']='Running the extended period simulation.';
$ec_lang['lpn_time_no_engine']='The built-in solver solves one instant at a time, so this is the network at {time} only: every pattern is read at that instant, and every tank remains at its initial level instead of filling and draining. Connect to the internet once to download the EPANET solver, which runs an extended period simulation.';
// lpn_time_no_engine says "connect to the internet", which is true only offline. For the other causes
// of a failed extended period run the same note ends in {reason}, one of the three sentences below.
$ec_lang['lpn_time_no_engine_why']='The built-in solver solves one instant at a time, so this is the network at {time} only: every pattern is read at that instant, and every tank remains at its initial level instead of filling and draining. {reason}';
$ec_lang['lpn_time_engine_fetch_failed']='The download of the EPANET solver failed. Reload the page to try again; a firewall, proxy, or browser extension may be blocking it.';
$ec_lang['lpn_time_engine_start_failed']='The browser refused to start the EPANET solver. WebAssembly may be turned off by a security setting or an extension.';
$ec_lang['lpn_time_engine_run_failed']='The EPANET run failed. That is a defect in this page; use the {wrong} link to report it.';
$ec_lang['lpn_time_slider']='Elapsed simulation time';
$ec_lang['lpn_time_no_period']='This project has no extended period simulation set, so there is only one moment to show. Set a Total run time in Settings, Calculation, Time to run an extended period simulation.';
$ec_lang['lpn_time_first']='Go to the start';
$ec_lang['lpn_time_prev']='Step back';
$ec_lang['lpn_time_play']='Play';
$ec_lang['lpn_time_play_tip']='Play animation';
$ec_lang['lpn_time_pause_tip']='Pause animation';
$ec_lang['lpn_time_pause']='Pause';
$ec_lang['lpn_time_next']='Step forward';
$ec_lang['lpn_time_last']='Go to the end';
$ec_lang['lpn_time_tank']='Tank';
$ec_lang['lpn_time_level']='Water level';
$ec_lang['lpn_time_run']='Calculate';
// Edited by TGH 2026-09-07
// **THE NOTE THAT USED TO STAND HERE IS GONE, AND SO IS THE STATE IT DESCRIBED** (2026-09-19).
// `lpn_time_run_note` told the reader they were seeing the first reporting time and that only the
// LATER times were going stale. That was true while "Recalculate automatically" suppressed nothing
// but the later time steps, and Tom read it as the defect it was: *"when Recalculate is off, the
// first time step is still calculated. This is bad. Off means off."* Off now means off -- an edit
// with the box unticked solves nothing at all -- so there is no such state left to describe, and
// nothing replaced it: the last answers simply stay on screen until the reader presses Calculate.
// The measurement and the new gate: scheduleSolve() in js/looped-network.js.
// ---- The run box (ROADMAP Task 450) ----------------------------------------------------------
// Three keys, and no more: 'lpn_time_running' is already the sentence for a run in progress and
// 'lpn_close' is already the word on every other dismiss control on this page, so both are
// borrowed rather than re-keyed.
$ec_lang['lpn_time_run_done']='The run finished. Reporting time steps: {frames}. Time taken: {secs} s.';
$ec_lang['lpn_time_runbox_hide']='Do not show this box again';
$ec_lang['lpn_settings_runbox']='Show the run progress box';
$ec_lang['lpn_settings_runbox_tip']='A box that reports the progress and outcome of a run. With it turned off, a finished run says the same thing in the status line for a few seconds instead. This is a setting for this browser, not for the project.';
$ec_lang['lpn_time_run_failed']='The run did not finish, so there are no results for the later times.';
$ec_lang['lpn_time_run_report']='Run report';
$ec_lang['lpn_time_run_report_copy']='Copy';
$ec_lang['lpn_time_run_report_copied']='Copied';
$ec_lang['lpn_time_run_report_tip']='The report EPANET wrote for the last run, verbatim: whether it converged, and any warnings. The text is produced by the EPANET solver, not by this page.';

$ec_lang['lpn_time_speed']='Speed';
$ec_lang['lpn_time_speed_tip']='Playback speed';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Search settings';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Enter a word or multiple words to see settings that mention all of them.';
$ec_lang['lpn_settings_no_match']='No setting mentions that word.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Width of the Settings section list';
$ec_lang['lpn_rpane_empty']='Nothing is docked here yet. Everything that belongs to the whole project is in Settings.';
$ec_lang['lpn_time_settings_open']='Time settings';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='Symbology';
$ec_lang['lpn_settings_sec_map']='Map and page';
$ec_lang['lpn_settings_sec_assets']='Assets';
$ec_lang['lpn_settings_sec_calculation']='Calculation';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Customer';
$ec_lang['lpn_labels_customer_note']='A customer label shows the values chosen here. It is drawn at the same text size as every other label on the map.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Customer labels are drawn only while the map view is this wide or narrower. Leave the box blank to draw them at every zoom. Enter 0 to never draw a customer label, at any zoom. This has no effect if it is larger than the similar setting for all labels.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Use current view';
$ec_lang['lpn_settings_page']='Page';
$ec_lang['lpn_saved_project']='Saved with the project';
$ec_lang['lpn_saved_browser']='Saved in this browser';
$ec_lang['lpn_saved_session']='Not saved';
$ec_lang['lpn_settings_hydraulics']='Hydraulics';
$ec_lang['lpn_settings_quality']='Quality';
$ec_lang['lpn_settings_quality_track']='Quality parameter';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Choose what the run should trace through the network: how long the water has been in the system, where it came from, or a chemical that reacts as it travels. Only a chemical needs coefficients.';
$ec_lang['lpn_settings_quality_source']='Trace node';
$ec_lang['lpn_settings_quality_source_tip']='The node whose water is traced. Every other node then shows the share of its water that came from that node.';
$ec_lang['lpn_quality_none']='Nothing';
$ec_lang['lpn_quality_trace']='Source trace';
$ec_lang['lpn_quality_chemical']='A reactive chemical';
$ec_lang['lpn_quality_needs_run']='Water quality is carried along the pipes as the water travels, so it needs an extended period simulation. Set a Total run time under Time, then press the Calculate button.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Chemical';
$ec_lang['lpn_quality_chemical_name_tip']='The chemical being tracked, for example Chlorine. Leave it blank to use the EPANET default label, Chemical. Shown on reports, but not used in the calculations.';
$ec_lang['lpn_quality_mass_units']='Mass units';
$ec_lang['lpn_quality_mass_units_tip']='The units part of the quality entry, from the two EPANET choices.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Quality tolerance';
$ec_lang['lpn_quality_tolerance_tip']='Concentration difference below which EPANET treats two adjoining parcels of water as one. Blank uses the EPANET default of 0.01.';
$ec_lang['lpn_quality_diffusivity']='Relative diffusivity';
$ec_lang['lpn_quality_diffusivity_tip']='Diffusivity of the chemical in water, relative to chlorine. Blank uses the EPANET default of 1.0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='{chemical} concentration';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Average {chemical} concentration';
$ec_lang['lpn_quality_initial']='Initial quality';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Amount of the chemical at this node when the run starts. A reservoir keeps this value for the whole run, which is how the residual leaving a treatment plant is usually stated. Blank means 0.';
$ec_lang['lpn_result_concentration']='Concentration';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Amount of the chemical remaining at this point after transport and reaction. The units are those entered with the chemical name under Settings, Calculation, Quality.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Source type';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='What kind of chemical source dosing is applied here based on the Source Quality value? Concentration source uses the value as a concentration applied to the external inflow (reservoir or negative demand). Mass booster adds a fixed mass flow per minute to that entering the node from other points in the network. Setpoint booster ensures that the concentration leaving the node is no lower than the value. Flow-paced booster source adds a fixed concentration to that resulting from the mixing of all inflow to the node from other points in the network';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='None';
$ec_lang['lpn_source_type_concen']='Concentration';
$ec_lang['lpn_source_type_mass']='Mass booster';
$ec_lang['lpn_source_type_setpoint']='Setpoint booster';
$ec_lang['lpn_source_type_flowpaced']='Flow-paced booster';
$ec_lang['lpn_source_quality']='Source quality';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='Strength of the dose. For every type but the mass booster this is a concentration, in the units named beside the chemical under Settings, Calculation, Quality; for a mass booster it is a mass flow per minute. Blank means no chemical source, functionally equivalent to 0.';
$ec_lang['lpn_source_pattern']='Source pattern';
$ec_lang['lpn_source_pattern_tip']='A time pattern that scales the dose through the run, for a feed that is not constant. No pattern means that the dose is the same at every step.';
$ec_lang['lpn_mixing_model']='Mixing model';
$ec_lang['lpn_mixing_model_tip']='Model of how the water already in this tank mixes with the inflow. Complete mixing mixes all inflow instantly with the entire tank volume. Two-compartment mixing fills an inlet zone first and passes the overflow to the main zone. FIFO plug flow discharges water in the order it arrived. LIFO plug flow stacks it, so the last water in is the first water out. The choice affects water age and residual, not pressure or flow.';
$ec_lang['lpn_mixing_mixed']='Complete mixing';
$ec_lang['lpn_mixing_2comp']='Two-compartment mixing';
$ec_lang['lpn_mixing_fifo']='FIFO plug flow';
$ec_lang['lpn_mixing_lifo']='LIFO plug flow';
$ec_lang['lpn_mixing_fraction']='Mixing fraction';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='The share of the tank volume that the inlet zone takes up, between 0 and 1. Only two-compartment mixing uses it. Blank means that the whole tank is the inlet zone.';
$ec_lang['lpn_reaction_bulk']='Bulk reaction coefficient';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Reaction in the body of the water (see EPANET Help), used for every pipe and tank that has no individual coefficient. A negative number decays the chemical and a positive one increases it. Blank means no bulk reaction.';
$ec_lang['lpn_reaction_wall']='Wall reaction coefficient';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Reaction at the pipe wall (see EPANET Help) used for every pipe with no entry. A negative number decays the chemical. Blank means no wall reaction.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Reaction in the body of the water (see EPANET Help). A negative number decays the chemical and a positive one increases it. Blank means to use the coefficient set for the whole network under Settings, Calculation, Quality.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Reaction coefficient';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Reaction in the water held in this tank, as a rate in 1/day. A negative number decays the chemical and a positive one increases it. Water stands in a tank far longer than it stands in any pipe, so this is often where a residual is lost. Blank means to use the bulk reaction coefficient set for the whole network under Settings, Calculation, Quality.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Bulk reaction';
$ec_lang['lpn_reaction_wall_short']='Wall reaction';
$ec_lang['lpn_reaction_tank_short']='Reaction';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/day';
$ec_lang['lpn_reaction_day']='day';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Bulk reaction order';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='The exponent the concentration is raised to for reaction in the body of the water. Any real number is allowed. 1 is the default value and is used for most chlorine decay modelling. 0 makes the rate independent of how much chemical is there.';
$ec_lang['lpn_reaction_order_tank']='Tank reaction order';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='The exponent the concentration is raised to for reaction in the water held in a tank, separate from the bulk reaction order so a tank can react on a different order from the pipes. Any real number is allowed, and 1 is the default. EPANET states it as ORDER TANK in a file and has no input for it in the EPANET interface.';
$ec_lang['lpn_reaction_order_wall']='Wall reaction order';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 means that the wall reaction is dependent on the concentration in the bulk flow. 0 means it is not.';
$ec_lang['lpn_reaction_order_unstated']='Not stated';
$ec_lang['lpn_reaction_order_zero']='0, zero order';
$ec_lang['lpn_reaction_order_first']='1, first order';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Limiting concentration';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='A concentration the chemical moves toward instead of decaying to nothing or growing without end. The reaction slows as the water approaches it and stops there. Use consistent units. No limit if blank.';
$ec_lang['lpn_reaction_rough_corr']='Roughness correlation';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Factor that correlates the wall reaction coefficient with the roughness of each pipe, so a rougher pipe reacts faster. When it is set, a wall coefficient is computed for each pipe from its roughness, and the single wall coefficient above is not used. Not used if blank.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='This application offers no reaction coefficient suggestions. There is no standard test for one, and published field values for the same kind of water differ by a factor of ten. Enter one you have measured or one you can cite, or leave the boxes empty for a chemical that does not react.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Energy';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Reports';
// Edited by TGH 2026-09-07
// Row label only (the box title is lpn_time_run_report). Tom, 2026-10-07: no row carries '(EPANET)';
// the tips say where a report comes from. Run is EPANET's verbatim report.
$ec_lang['lpn_reports_epanet']='Run';
$ec_lang['lpn_energy_title']='Pump energy report';
$ec_lang['lpn_energy_menu']='Pump energy';
$ec_lang['lpn_energy_efficiency']='Pump efficiency (percent)';
$ec_lang['lpn_energy_efficiency_tip']='The wire-to-water efficiency used for every pump that has no efficiency curve. EPANET uses 75 percent when no value is stated.';
$ec_lang['lpn_energy_price']='Price of power';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Cost of one kilowatt hour. It applies to every pump that has no individual price. Blank means 0.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Cost of one kilowatt hour at this pump. Blank means to use the price set for the whole network under Settings, Energy.';
$ec_lang['lpn_energy_price_pattern']='Price pattern';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='A pattern that multiplies the price at each pattern step, which is how an off-peak rate is specified. Leave it empty for constant price throughout the run.';
$ec_lang['lpn_energy_demand_charge']='Peak demand charge';
$ec_lang['lpn_energy_demand_charge_tip']='Per kW, for the peak load demanded by the pumps';
$ec_lang['lpn_energy_currency']='Currency';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Text printed beside every cost value. It is a label only; use one currency throughout.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='This application offers no price suggestions. What power costs depends on the utility, the country, the hour and the year.';
$ec_lang['lpn_energy_needs_run']='Pump energy is power integrated over the run, so it needs an extended period simulation. Set a Total run time in Settings, Calculation, Time, press the Calculate button, then open Water, Reports, Pump energy.';
$ec_lang['lpn_energy_no_pumps']='This network has no pumps, so there is nothing drawing power.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Scenario comparison';
$ec_lang['lpn_scncmp_menu_tip']='Table of scenarios with count of overrides, lowest pressure, and highest velocity';
$ec_lang['lpn_scncmp_running']='Solving every scenario…';
$ec_lang['lpn_scncmp_empty']='Nothing has been drawn yet, so there is nothing to solve.';
$ec_lang['lpn_scncmp_col_maxvelocity']='Highest velocity';
$ec_lang['lpn_scncmp_at']='{value} at {id}';
$ec_lang['lpn_scncmp_at_time']='{value} at {id}, {time}';
$ec_lang['lpn_scncmp_same']='The same in every scenario';
$ec_lang['lpn_scncmp_period_note']='Where a scenario has a total run time, its lowest pressure and highest velocity are the extremes of the whole network, at the time shown.';
$ec_lang['lpn_scncmp_current']='(currently open)';
$ec_lang['lpn_scncmp_note']='Every scenario is solved from a copy of the drawing. Nothing here changes the project, and the scenario you are working in is left as it was.';
$ec_lang['lpn_energy_over']='For extended period simulation of {time}';
$ec_lang['lpn_energy_col_pump']='Pump';
$ec_lang['lpn_energy_col_running']='% of run';
$ec_lang['lpn_energy_col_effic']='Effic.';
$ec_lang['lpn_energy_col_avg_kw']='Avg. kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='The average power used when this pump was running. It is not averaged over idle periods so that a pump that was idle for much of the extended period simulation still reports the power it used while it ran.';
$ec_lang['lpn_energy_col_peak_kw']='Peak kW';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='Cost';
$ec_lang['lpn_energy_total_kwh']='Energy used';
$ec_lang['lpn_energy_total_energy_cost']='Cost of energy';
$ec_lang['lpn_energy_peak_kw']='Peak power usage';
$ec_lang['lpn_energy_total_demand_charge']='Cost of peak demand';
$ec_lang['lpn_energy_total_cost']='Total cost';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW AND THE BOX TITLE BOTH SAY "Status changes"** (Tom, 2026-10-07), so menu and box agree.
$ec_lang['lpn_reports_status']='Status changes';
$ec_lang['lpn_reports_status_tip']='Chronological table of status changes read from the EPANET time steps of the last extended period simulation: pumps and valves opening or closing, tanks filling, emptying, filling up or running dry, and steps that did not fully converge.';
$ec_lang['lpn_status_title']='Status changes';
$ec_lang['lpn_status_needs_run']='The status report lists what changed during an extended period simulation. Set a Total run time in Settings, Calculation, Time, press Calculate, then open Water, Reports, Status changes.';
$ec_lang['lpn_status_empty']='Nothing changed status during this run.';
$ec_lang['lpn_status_col_event']='Event';
$ec_lang['lpn_status_opened']='{type} {id} now open';
$ec_lang['lpn_status_closed']='{type} {id} now closed';
$ec_lang['lpn_status_filling']='{type} {id} now filling';
$ec_lang['lpn_status_emptying']='{type} {id} now emptying';
$ec_lang['lpn_status_full']='{type} {id} now full';
$ec_lang['lpn_status_dry']='{type} {id} now empty';
$ec_lang['lpn_status_no_converge']='The hydraulic solution at this step did not fully converge; the numbers shown are its last iteration.';
$ec_lang['lpn_status_note']='Read from the same extended period run as the Tables pane and the Full report. Only a change is listed, not every step.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Full';
$ec_lang['lpn_reports_full_tip']='Table of all nodes and links at every reporting time step of the last run';
$ec_lang['lpn_full_title']='Full report';
$ec_lang['lpn_full_needs_run']='The full report lists every node and every link at every reporting time step. Press Calculate, then open Water, Reports, Full.';
$ec_lang['lpn_full_note']='One row per node or link per reporting time step, in the units shown on the Tables pane. A blank cell is a column that quantity does not have. Download or print carries every time step; the table below shows one at a time.';
$ec_lang['lpn_full_step_label']='Time step';
$ec_lang['lpn_full_download_csv']='Download CSV';
$ec_lang['lpn_full_print']='Print report';
$ec_lang['lpn_full_col_time']='Time';
$ec_lang['lpn_full_col_type']='Type';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='Rows ({n}).';

// ---- The Calibration report (ROADMAP Task 601) -------------------------------------------------
// EPANET's Report > Calibration and its three tabbed pages, with EPANET's own column names (EPANET
// 2.2 manual, section 9.6). Mean error is EPANET's term for the mean ABSOLUTE difference. "Num obs"
// is EPANET's own column heading, kept short because results columns are narrow.
// lpn_calib_missing: keep in step with feat/profile-file's lpn_profile_file_missing (Task 604), the same sentence.
$ec_lang['lpn_reports_calib']='Calibration';
$ec_lang['lpn_reports_calib_tip']='Compare measured field data from a calibration file with the last run: statistics, a correlation plot, and mean comparisons.';
$ec_lang['lpn_calib_title']='Calibration report';
$ec_lang['lpn_calib_param']='Parameter';
$ec_lang['lpn_calib_param_tip']='The quantity the calibration file measures. One file is held for each parameter.';
$ec_lang['lpn_calib_load']='Load calibration file…';
$ec_lang['lpn_calib_load_tip']='A text file with a location ID, a time, and a measured value on each line. The time is measured from the start of the simulation, in decimal hours or hours:minutes. A semicolon starts a comment. A line with only a time and a value belongs to the location above it.';
$ec_lang['lpn_calib_none']='No calibration file is loaded for this parameter.';
$ec_lang['lpn_calib_session']='A calibration file is held for this session only. It is not saved with the project or on this device.';
$ec_lang['lpn_calib_file']='{file}: measurements ({n}) at locations ({m}).';
$ec_lang['lpn_calib_units']='The file\'s values are read in this project\'s units: {unit}.';
$ec_lang['lpn_calib_missing']='Named in the file but not in this network: {ids}.';
$ec_lang['lpn_calib_missing_count']='Measurements skipped because their location is not in this network: {n}.';
$ec_lang['lpn_calib_bad_lines']='Lines that could not be read, skipped: {lines}';
$ec_lang['lpn_calib_outside']='Measurements outside the times this run reported, skipped: {n}.';
$ec_lang['lpn_calib_no_value']='Measurements with no computed value at their time, skipped: {n}.';
$ec_lang['lpn_calib_single']='This is a single-period run, so every measurement is compared with its one result, whatever time the file gives.';
$ec_lang['lpn_calib_needs_run']='There are no results to compare with yet. The report fills in once the network has been calculated.';
$ec_lang['lpn_calib_no_pairs']='No measurement could be compared, so there is nothing to plot.';
$ec_lang['lpn_calib_tab_stats']='Statistics';
$ec_lang['lpn_calib_tab_corr']='Correlation plot';
$ec_lang['lpn_calib_tab_means']='Mean comparisons';
$ec_lang['lpn_calib_col_location']='Location';
$ec_lang['lpn_calib_col_n']='Num obs';
$ec_lang['lpn_calib_col_obs_mean']='Observed mean';
$ec_lang['lpn_calib_col_sim_mean']='Computed mean';
$ec_lang['lpn_calib_col_mean_err']='Mean error';
$ec_lang['lpn_calib_col_mean_err_tip']='The mean of the absolute differences between each observed value and the computed value at the same time.';
$ec_lang['lpn_calib_col_rms_err']='RMS error';
$ec_lang['lpn_calib_col_rms_err_tip']='Root mean square error: the square root of the mean of the squared differences between observed and computed values.';
$ec_lang['lpn_calib_network']='Network';
$ec_lang['lpn_calib_corr_means']='Correlation between means: {r}';
$ec_lang['lpn_calib_corr_none']='Correlation between means: it needs at least two locations whose means differ.';
$ec_lang['lpn_calib_axis_obs']='Observed: {q}';
$ec_lang['lpn_calib_axis_sim']='Computed: {q}';
$ec_lang['lpn_calib_observed']='Observed';
$ec_lang['lpn_calib_computed']='Computed';
$ec_lang['lpn_calib_point']='{id}, {time}: observed {o}, computed {s}';
$ec_lang['lpn_calib_corr_note']='Each point is one measurement. The closer the points lie to the diagonal line, the closer the computed values match the observed ones.';
$ec_lang['lpn_calib_ts_point']='Measured at {id}, {time}: {v}';
$ec_lang['lpn_calib_ts_note']='Rings are measured values from the calibration file.';
$ec_lang['lpn_energy_no_price']='No price of power is stated, so every cost here is zero. Set one under Settings, Energy.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='This network states a price of zero, so every cost here is zero. Change it under Settings, Energy.';
$ec_lang['lpn_energy_curve_note']='These pumps call an efficiency curve with no points: {ids}. They ran at the efficiency set for the whole network.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
$ec_lang['lpn_labels_col_decimals_example']='0.000';
$ec_lang['lpn_labels_col_drop']='Drop';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='All';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Equal interval';
$ec_lang['lpn_color_mode_quantile']='Quantile (equal count)';
$ec_lang['lpn_color_mode_jenks']='Natural breaks (Jenks)';
$ec_lang['lpn_color_mode_stddev']='Standard deviation';
$ec_lang['lpn_color_mode_pretty']='Pretty (rounded)';
$ec_lang['lpn_color_mode_log']='Logarithmic';
$ec_lang['lpn_color_mode_manual']='Manual';

// ---- LIBRARIES (ROADMAP Tasks 462 and 460) ---------------------------------------------------
// The document has carried patterns, curves and controls since Task 423; nothing on the page could
// see one. This is that interface. Tom, 2026-08-20: "for Water Networks, I think we also need the
// following in a group: Libraries (Patterns, Curves, Controls, Pumps, Pipes, Custom), Settings,
// Simulate, Transport, Time selectors."
//
// ONE NAME, THREE DOORS: the toolbar button, the Edit menu row and the box's own title all read
// this key, exactly as lpn_tool_settings serves the Settings box's three.
// Plural, because it is a shelf of them: a user opens Libraries to reach the patterns, not to reach
// "the library".
$ec_lang['lpn_library_menu']='Libraries';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='Patterns';
// **THE SYNONYMS ARE TOM'S OWN, GIVEN 2026-08-24**, which is the written permission this array
// requires. "Pattern" is the discipline's standard term and stays the label; the payload exists so
// a translator who cannot recover the concept from that one word has the shape of it.
//
// "Run" was on his list and he struck it the same day, on the collision: this page's Run is the
// button that plays an extended-period simulation back, so a translator reaching for their word for
// a program run would have named the wrong thing. Tom: *"Yes. It's not the best term."*
$ec_lang['lpn_library_patterns_tip']='A pattern is a list of multipliers that repeats. Each one applies for one pattern time step, so 24 numbers on a one hour step make a day that repeats. A demand of 10 with a multiplier of 1.5 is 15 at that moment.';
$ec_lang['lpn_library_curves']='Curves';
$ec_lang['lpn_library_curves_tip']='Pump head or efficiency vs flow, Valve loss vs flow, or Tank volume vs depth';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Curves are attached to pumps and valves. For a pump head curve the run uses a curve fitted through the points as shown; for every other kind it connects the points with straight lines as shown.';
$ec_lang['lpn_library_curve_add']='Add a curve';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='Curve type';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='Equation';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='The curve fitted through the given points and used for the pump model.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Select one or two columns in a spreadsheet, copy them, and paste into the first target cell. Rows are added as needed. Lines copied directly from an EPANET file, including the curve name, can also be pasted.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='Description';
$ec_lang['lpn_library_curve_remove_point']='Remove this point';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Copy points';
$ec_lang['lpn_library_curve_copy_tip']='Copy every point as two columns, ready to paste into a spreadsheet.';
$ec_lang['lpn_library_curve_copy_manual']='Copy these points';
$ec_lang['lpn_library_curve_used_by']='Elements using this curve';
$ec_lang['lpn_library_curve_unused']='Nothing uses this curve.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='This curve is used by elements ({count}): {ids}. Assign another curve to them first, then delete this one.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Pipe types';
$ec_lang['lpn_library_pipetypes_tip']='A pipe type is a definition several pipes can refer to for their diameter, roughness and reaction coefficients. Editing the definition edits every pipe that uses it.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='Each project has a separate pipe type library. Properties may be left blank in a pipe type definition; for example, a pipe type may specify a roughness and no diameter. Pipe types are assigned to pipes in the pipe properties. Editing a definition here changes every pipe that references it.';
$ec_lang['lpn_library_pipetype_add']='Add a pipe type';
$ec_lang['lpn_library_pipetype_blank_tip']='Blank properties in a pipe type definition are left to be entered individually for each pipe.';
$ec_lang['lpn_library_pipetype_used_by']='Pipes using this type';
$ec_lang['lpn_library_pipetype_unused']='Nothing uses this pipe type.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='This pipe type is used by pipes ({count}): {ids}. Detach it from them before deleting it.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Pipe type';
$ec_lang['lpn_field_pipetype_tip']='The pipe type in the project library that this pipe uses. Properties included in the pipe type are disabled for editing here. Detach the pipe type to enable editing here.';
$ec_lang['lpn_pipetype_none']='No pipe type chosen';
$ec_lang['lpn_pipetype_detach']='Detach from pipe type';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Copy the values this pipe reads from its type into the pipe itself and stop using the type. The pipe’s values don’t change now, and from now on these values are edited here.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Fittings';
$ec_lang['lpn_library_fittings_tip']='Fittings with minor loss coefficients grouped into lists';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Each project has a separate fittings library. A fittings list has fittings with a quantity for each one, and it adds up to a single minor loss coefficient. Both pipes and pipe types may refer to a list.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='The fittings offered here are the thirteen in Table 3.3 of the EPANET 2.2 user manual. Choosing one copies its coefficient into the row, where it can be changed. A coefficient depends on the size and the make of the fitting, so treat the table as a starting point, not as final values.';
$ec_lang['lpn_library_fittings_add']='Add a fittings list';
$ec_lang['lpn_library_fittings_used_by']='Pipes using this fittings list';
$ec_lang['lpn_library_fittings_unused']='Nothing uses this fittings list.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='This fittings list is used by pipes ({count}): {ids}. Detach it from them before deleting it.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Libraries…';
$ec_lang['lpn_library_import_tip']='Choose another project file and copy whole libraries from it into this project. Anything whose name is already taken here is skipped and listed, so nothing you already have is changed.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='Choose what to copy from {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='Each library you check is copied in whole. Delete what you do not want afterwards, the way you delete any other entry.';
$ec_lang['lpn_library_import_go']='Import';
$ec_lang['lpn_library_import_no_libraries']='That project file has no libraries to copy.';
$ec_lang['lpn_library_import_heading']='Imported from {file}';
$ec_lang['lpn_library_import_added']='Copied in: {names}';
$ec_lang['lpn_library_import_conflict']='Skipped, because this project already has one of the same name: {names}. Nothing here was changed. Rename either one and import again if you want both.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='That project file has none of these to copy.';
$ec_lang['lpn_library_import_curve_shape']='These curves were imported exactly as written in the file, and a run cannot use one until its first column rises from each point to the next: {names}';
$ec_lang['lpn_library_import_needs_fittings']='These pipe types refer to a fittings list this project does not have: {names}. Import the fittings library from the same file to resolve these references.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Warning: Units mismatch. Will be imported as is. Not recommended.';
$ec_lang['lpn_library_import_units_line']='{name}: this project shows {mine}, the file shows {theirs}.';
$ec_lang['lpn_fitting_qty']='Quantity';
$ec_lang['lpn_fitting_name']='Fitting';
$ec_lang['lpn_fitting_k']='Coefficient';
$ec_lang['lpn_fitting_add']='Add a fitting';
$ec_lang['lpn_fitting_remove']='Remove';
$ec_lang['lpn_fitting_total']='Total minor (local) loss coefficient, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Fittings list';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='A list of fittings from the project library. The quantities and coefficients in the list are summed into this pipe\'s minor loss coefficient, and the coefficient box is read only. To enter the coefficient directly, leave the list unchosen.';
$ec_lang['lpn_fittings_none']='No fittings list chosen';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Globe valve, fully open';
$ec_lang['lpn_fitting_angle']='Angle valve, fully open';
$ec_lang['lpn_fitting_swingcheck']='Swing check valve, fully open';
$ec_lang['lpn_fitting_gate']='Gate valve, fully open';
$ec_lang['lpn_fitting_elbow_short']='Short radius elbow';
$ec_lang['lpn_fitting_elbow_medium']='Medium radius elbow';
$ec_lang['lpn_fitting_elbow_long']='Long radius elbow';
$ec_lang['lpn_fitting_elbow_45']='45 degree elbow';
$ec_lang['lpn_fitting_return_bend']='Closed return bend';
$ec_lang['lpn_fitting_tee_run']='Standard tee, flow through run';
$ec_lang['lpn_fitting_tee_branch']='Standard tee, flow through branch';
$ec_lang['lpn_fitting_entrance']='Square entrance';
// Tom, 2026-09-30, ruling sprint 2026-09-30-golf item 1: _syn = "All junctions" / "Selected junctions".
$ec_lang['lpn_fitting_exit']='Exit';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Other fitting';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='Saved {file}';
$ec_lang['lpn_inp_export_flat_lead']='The exported EPANET file is numerically equivalent to this project. But it has no place for the following things:';
$ec_lang['lpn_inp_export_flat_types']='Pipes ({n}) here refer to pipe types ({t}). In the file each of those pipes carries its own copy of the numbers, so the answers are the same. What the file cannot hold is the pipe type itself, so the link between one definition and every pipe that uses it is recorded only in the project file.';
$ec_lang['lpn_inp_export_flat_coords']='An EPANET file holds one position for each node. This scenario places {n} of them somewhere else, and those are the positions in the file. Every other scenario keeps its positions in the project file only.';
$ec_lang['lpn_inp_export_flat_fittings']='An EPANET file cannot hold the list of elbows, valves and tees in your project file. The minor loss coefficient of pipes here ({n}) is added up from a fittings list. The total goes into the file exactly as it stands, so nothing about the answers changes.';
$ec_lang['lpn_library_controls']='Controls';
$ec_lang['lpn_library_controls_tip']='A control is one statement that opens or closes a link, or changes its setting, based on a tank water level, a node pressure, or the time.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Add a pattern';
$ec_lang['lpn_library_pattern_values']='Multipliers';
$ec_lang['lpn_library_pattern_values_tip']='The multipliers, separated by spaces or commas. Paste a column from a spreadsheet if you have one. The list repeats for as long as the run lasts, so it does not have to cover the whole run.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='Multipliers: {n}, {step} apart, covering {span}';
// Under the pattern graph, beside the clock-time row: the ordinal of each time period (1, 2, 3).
$ec_lang['lpn_library_pattern_axis_step']='Step';
$ec_lang['lpn_library_pattern_none']='No pattern';
// The blank first option of a selector whose blank follows a project-wide default (a junction's or
// customer's demand pattern, a pump's price pattern and efficiency curve). Tom, 2026-10-04.
$ec_lang['lpn_choice_default']='Default';
$ec_lang['lpn_settings_default_pattern']='Default demand pattern';
$ec_lang['lpn_settings_default_pattern_tip']='Every junction with no pattern uses this one.';
$ec_lang['lpn_junction_pattern_unknown']='No pattern in this project has the ID {id}, so the junction was left as it was.';
$ec_lang['lpn_settings_default_pattern_none']='None (constant)';
$ec_lang['lpn_demand_pattern_default']='(default: {id})';
$ec_lang['lpn_demand_pattern_constant']='(constant)';
$ec_lang['lpn_library_pattern_default_mark']='(default)';
$ec_lang['lpn_library_pattern_default_tip']='The default demand pattern. Change it in Settings, Default demand pattern.';
$ec_lang['lpn_library_pattern_default_deleted_to']='Pattern {id} was the default demand pattern. Junctions with no pattern now use pattern {now}.';
$ec_lang['lpn_library_pattern_default_deleted_none']='Pattern {id} was the default demand pattern. Junctions with no pattern now use a constant demand.';
$ec_lang['lpn_library_pattern_default_deleted_also']='Scenarios that also used it as their default: {list}.';
$ec_lang['lpn_library_pattern_default_deleted_in']='Pattern {id} was the default demand pattern in these scenarios: {list}.';
$ec_lang['lpn_library_control_add']='Add a control';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='A one-line rule using EPANET syntax. Use consistent project units. Keywords must be in English. Examples: LINK 12 CLOSED IF NODE 23 ABOVE 20 (Link 12 will be closed when the level in Tank 23 exceeds 20 ft); LINK 12 OPEN IF NODE 130 BELOW 30 (Link 12 will be opened if the pressure at Node 130 drops below 30 psi); LINK PUMP02 1.5 AT TIME 16 (The relative speed of pump PUMP02 is set to 1.5 at 16 hours into the simulation); LINK 12 CLOSED AT CLOCKTIME 10 AM LINK 12 OPEN AT CLOCKTIME 8 PM (Two rules: Link 12 is repeatedly closed at 10 am and opened at 8 pm throughout the simulation)';
$ec_lang['lpn_library_control_ok']='✓ Understood';
$ec_lang['lpn_library_control_bad']='⚠ Not understood';
$ec_lang['lpn_library_control_missing']='⚠ This network has nothing called {id}';
$ec_lang['lpn_library_rules']='Rules';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='A rule opens or closes a link, or changes its setting, when a water level, a pressure, a flow, or the time reaches a set value. A rule can test more than one condition and can specify the action to take when the condition is false.';
$ec_lang['lpn_library_rule_add']='Add a rule';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='One clause per line. Descriptions with examples in "ALL CAPS" follow. Line 1: Name of rule, "RULE 1". Line 2: A condition, "IF TANK 2 LEVEL BELOW 17.1". Line 3: An action, "THEN PUMP 9 STATUS IS OPEN". Line 4: A priority, "PRIORITY 1". Add "AND" or "OR" lines to test more than one condition, and "ELSE" lines to specify the action when the condition is false. A condition can read LEVEL, HEAD, GRADE, PRESSURE or DEMAND on a node, FLOW, STATUS or SETTING on a link, or TIME and CLOCKTIME on SYSTEM. Use consistent project units. Keywords must be in English.';
$ec_lang['lpn_library_rule_ok']='✓ This rule was read';
$ec_lang['lpn_library_rule_bad']='⚠ This rule could not be read';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='Base demand';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='The flow this node draws at the time step shown: each base demand multiplied by its own pattern, added together. It is a result, not an input.';
$ec_lang['lpn_field_demand_pattern']='Demand pattern';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Description';
$ec_lang['lpn_demand_add']='Add demand category';
$ec_lang['lpn_demand_remove']='Remove this demand';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Head pattern';
$ec_lang['lpn_field_head_pattern_tip']='Pattern of this reservoir’s water level through the run. The head above is multiplied by the pattern.';
$ec_lang['lpn_field_pump_speed']='Relative speed';
$ec_lang['lpn_field_pump_speed_tip']='Relative to the rotational speed used to generate its published performance curve. Ignored (not scaled) if there is a speed pattern.';
$ec_lang['lpn_field_speed_pattern']='Speed pattern';
$ec_lang['lpn_field_speed_pattern_tip']='Each pattern entry gives the relative speed for that part of the run rather than scaling a base value.';

// ---- place-name search and terrain elevations (Task 507) ---------------------------------------
// Both features ask an outside service for something, and each asks its own permission question
// first. The dialog is the feature, so it is translated like anything else: it shipped as English
// literals inside js/lpn-search.js and js/lpn-terrain.js, which meant a permission dialog nobody
// could read in 26 of the 27 languages. The literals stay in those files as the fallback; these
// keys are what the visitor actually sees.
//
// THE CONSENT TEXT IS ONE KEY PER PARAGRAPH, joined with a blank line in JS. A lang value is one
// line by construction here -- nothing in these files has ever held a newline -- and splitting is
// better than inventing a line-break placeholder: a translator sees four short questions instead of
// one wall, and the order of the paragraphs stays ours rather than the translation's.
$ec_lang['lpn_search_menu']='Search for a place by name…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Permission is requested at first use, because searches are sent to the OpenStreetMap place-name service.';
$ec_lang['lpn_search_bar']='Search by name…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='Search by place name sends the words you enter to nominatim.openstreetmap.org, the OpenStreetMap Foundation’s free place-name service.';
$ec_lang['lpn_search_consent_2']='This is a different service from the street map pictures behind your project. The pictures only say where you are looking. A search says what you entered. The place-name service will receive your search words and your IP address. We send nothing else, and we keep no record of your searches.';
$ec_lang['lpn_search_consent_3']='May we send your searches to the place-name service?';
$ec_lang['lpn_search_consent_4']='If you say no, everything else on this page keeps working exactly as it does now, including Go to a latitude and longitude. We remember a yes so that we need not ask again. A no is not stored at all.';
$ec_lang['lpn_search_refused']='Place-name search is off, and nothing was sent. The Go to a latitude and longitude command still works.';
$ec_lang['lpn_search_prompt']='Search for a place by name. A town, a street, a landmark — for example: Petaluma, California';
$ec_lang['lpn_search_empty']='Enter a place name to search for.';
$ec_lang['lpn_search_working']='Searching…';
$ec_lang['lpn_search_busy']='A search is already running. Wait for it to finish.';
$ec_lang['lpn_search_choose']='More than one place matches. Which one?';
$ec_lang['lpn_search_nochoice']='Nothing chosen, so the map has not moved.';
$ec_lang['lpn_search_badchoice']='That is not one of the numbers in the list.';
$ec_lang['lpn_search_none']='Nothing found for that name.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='The place-name service has limited the request rate. Wait a minute and try again.';
$ec_lang['lpn_search_http']='The place-name service returned an error.';
$ec_lang['lpn_search_timeout']='The place-name service did not respond in time. Everything else on this page works without it.';
$ec_lang['lpn_search_unreadable']='The place-name service returned a response this page could not read.';
$ec_lang['lpn_search_offline']='We could not reach the place-name service. You may be offline. Everything else on this page works without it, including Go to a latitude and longitude.';
$ec_lang['lpn_search_toofast']='The place-name service allows one search per second. Try again in a moment.';
$ec_lang['lpn_search_nofetch']='This browser cannot reach the place-name service.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox assembles this from many public elevation datasets, so its accuracy depends on location. Where a national lidar survey exists, such as USGS 3DEP in much of the United States and its equivalents elsewhere, it can be better than 1 m horizontally and a few tenths of a meter vertically. Where only global data exists, it is about 30 m horizontally and several meters vertically. Mapbox does not report which source applies. Treat it as a contour map, not a survey, and verify any value the design depends on.';
$ec_lang['lpn_terrain_consent_1']='Filling in elevations sends the position of each node that needs one — its latitude and longitude — to api.mapbox.com, to look up the height of the ground there.';
$ec_lang['lpn_terrain_consent_2']='This is a different question from the map pictures behind your project. The pictures only say where you are looking. These positions are your network itself. Mapbox will receive those coordinates and your IP address. We send nothing else: no name, no pipes, no project. We keep no record of it, and nothing is stored on this device except your answer to this question.';
$ec_lang['lpn_terrain_consent_3']='May we send your node positions to Mapbox?';
$ec_lang['lpn_terrain_consent_4']='If you say no, everything else on this page keeps working exactly as it does now, and elevations can be entered by hand as before. We remember a yes so that we need not ask again. A no is not stored at all.';
$ec_lang['lpn_terrain_refused']='Elevations were not filled in, and nothing was sent. They can be entered by hand as before.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Fill in the elevation of {n} node(s) from Mapbox DEM?';
$ec_lang['lpn_terrain_confirm_default_1']='Every node already has an elevation, and {n} of them are still at {v}, which is the elevation a new node starts with rather than one you entered.';
$ec_lang['lpn_terrain_confirm_default_2']='Replace the elevation of those nodes ({n}) with values from the Mapbox DEM?';
$ec_lang['lpn_terrain_keep']='{k} node(s) already have an elevation and will not be changed.';
$ec_lang['lpn_terrain_undo']='One Undo (Ctrl-Z) puts every one of them back.';
$ec_lang['lpn_terrain_requests']='{n} request(s) to api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='Elevations are already being filled in. Wait for that to finish.';
$ec_lang['lpn_terrain_offmap']='These node positions are not on the terrain map, so nothing was sent.';
$ec_lang['lpn_terrain_too_wide']='These nodes span too much of the Earth to read in one operation ({n} tile requests). Nothing was sent.';
$ec_lang['lpn_terrain_cancelled']='Nothing was changed and nothing was sent.';
$ec_lang['lpn_terrain_nofetch']='This browser cannot reach the terrain service.';
$ec_lang['lpn_terrain_working']='Reading the land surface…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='The terrain service refused the request ({status}), so no elevation was changed. The Mapbox token this site uses may not allow the web address you are on.';
$ec_lang['lpn_terrain_failed']='We could not reach the terrain service, so no elevation was changed. You may be offline. Everything else on this page works without it.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='The terrain service has limited the request rate (429), so no elevation was changed. Try again in a minute.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='The terrain service answered with an error ({status}), so no elevation was changed. Nothing is wrong with your network.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='None of those nodes has a position on the Earth, so nothing was sent and no elevation was changed. Reading the land surface needs a project in latitude and longitude, or one on a projection this page can place.';
$ec_lang['lpn_terrain_done']='{n} elevation(s) filled in.';
$ec_lang['lpn_terrain_missed']='{m} could not be read and are still blank.';
$ec_lang['lpn_terrain_partial']='{f} terrain tile(s) did not respond.';
$ec_lang['lpn_terrain_will_ids']='These nodes will get an elevation: {ids}';
$ec_lang['lpn_terrain_keep_ids']='Those nodes are: {ids}';
$ec_lang['lpn_terrain_filled_ids']='These nodes got an elevation: {ids}';
$ec_lang['lpn_terrain_blank_ids']='These nodes still have no elevation: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}, and {n} more';

// ---- Fire flow: the whole-system sweep (ROADMAP Task 530) ---------------------------------------
// Tom's question, 2026-08-27: which junctions can provide the fire flow their code asks for, and
// which of them break something else in the system while doing it. So there is ONE run and TWO
// reports, and every junction comes back Passing, Failing, or with a Design issue.
//
// THE DEMAND GOES ON THE JUNCTION ITSELF and no hydrant is modelled. That is what both inspectable
// tools do, and it is why lpn_ff_accounting exists: how hydrant losses are accounted for has to be
// said out loud rather than assumed by the reader.
//
// {flow} and {velocity} are quantities with their units, {pressure} a pressure with its unit,
// {id} a junction or pipe name, and {done}, {total}, {n}, {pass}, {fail}, {design} and {solves}
// are whole numbers. Every one is substituted, never concatenated.
$ec_lang['lpn_analyze_menu']='Analyze';
$ec_lang['lpn_analyze_menu_tip']='Analyses that run the network on a copy: fire flow at each junction, the loss of each pipe, pump, and valve, and the demands scaled up or down.';
$ec_lang['lpn_ff_menu']='Fire flow analysis…';
$ec_lang['lpn_ff_menu_tip']='Test each selected junction for fire flow, and check the effect on the rest of the system';
$ec_lang['lpn_ff_title']='Fire flow analysis';
$ec_lang['lpn_ff_intro']='Each junction in turn draws a fire flow on top of its existing demand. The run uses a copy of the network at the time step on screen, so nothing in the project is changed.\n\nFire flow is normally tested at maximum day demand, so set the network to that condition first.\n\nEach junction tested takes about 16 solves of the whole network, so a large system takes minutes: choose the junctions before you run, and stop at any time to keep the partial results.';
$ec_lang['lpn_ff_scope']='Junctions to test';
$ec_lang['lpn_ff_all']='All junctions';
$ec_lang['lpn_ff_selected']='Selected junctions';
$ec_lang['lpn_ff_no_junctions']='This project has no junctions yet, so there is nothing to test.';
$ec_lang['lpn_ff_no_selection']='No junctions are selected. Select junctions or choose All junctions.';
$ec_lang['lpn_ff_skipped']='{n} selected elements are not junctions, so they were not tested.';
$ec_lang['lpn_ff_required']='Required fire flow';
$ec_lang['lpn_ff_required_tip']='The flow required at a hydrant by the applicable fire code or fire authority. Each junction is tested against this value unless a required fire flow is entered for that junction.';
$ec_lang['lpn_ff_required_own']='Junctions with an individual required fire flow are tested against that value instead. Number of them: {n}.';
$ec_lang['lpn_ff_required_node_tip']='The fire flow required at this junction for the land use it serves, from the applicable fire code or fire authority. Leave it blank to test the junction against the value in the Fire flow analysis box.';
$ec_lang['lpn_ff_residual']='Residual pressure to hold';
$ec_lang['lpn_ff_residual_tip']='The pressure the junction must still hold while delivering the fire flow. AWWA M31 and NFPA 291 use 20 psi (140 kPa).';
$ec_lang['lpn_ff_design']='Design check (effect on system)';
$ec_lang['lpn_ff_design_tip']='A separate question from whether the junction can deliver the flow: with that flow drawn there, does any other junction fall below its minimum pressure or any pipe exceed its velocity limit? This check requires no additional calculation.';
$ec_lang['lpn_ff_design_off']='None';
$ec_lang['lpn_ff_design_all']='All';
$ec_lang['lpn_ff_design_selected']='Selected';
$ec_lang['lpn_ff_design_no_selection']='The design check scope is set to Selected, but no assets are selected. Select assets on the map or choose All.';
$ec_lang['lpn_ff_minpressure']='Lowest pressure allowed elsewhere';
$ec_lang['lpn_ff_minpressure_tip']='A junction that falls below this while another one is drawing its fire flow is reported as a design issue.';
$ec_lang['lpn_ff_maxvelocity']='Highest velocity allowed';
$ec_lang['lpn_ff_maxvelocity_tip']='A pipe running above this while a fire flow is drawn is reported as a design issue.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='The pressure is modeled at the junction itself, the usual method. The hydrant, its lateral, and its nozzle are not modeled, and the pressure at the nozzle is less than at the node.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Built-in solver is used.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='EPANET engine is used.';
// Edited by TGH 2026-09-07
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='Fire flow run';
$ec_lang['lpn_ff_calculate']='Run';
$ec_lang['lpn_ff_stop']='Stop';
$ec_lang['lpn_ff_working']='Working: {done} of {total} junctions.';
$ec_lang['lpn_ff_stopped']='Stopped after {done} of {total} junctions. The results below are the ones already finished.';
$ec_lang['lpn_ff_cost']='This run solved the whole network {solves} times.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='The drawing changed, so the fire flow results were cleared. Run it again.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Clear rings';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} junctions passed all checks. {fire} junctions failed the fire flow. {design} junctions affected the rest of the system.';
$ec_lang['lpn_ff_summary_error']='Junctions that could not be solved ({n}).';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Every junction tested';
$ec_lang['lpn_ff_col_junction']='Junction';
$ec_lang['lpn_ff_col_static']='Static pressure';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='The pressure at this junction before any fire flow is drawn, with the system’s ordinary demands still running. Nothing is shut off to measure it, so this is not a zero-flow pressure for the system; it is the same pressure the map shows at this junction. AWWA M31 and NFPA 291 both call this reading the static pressure, and it is where a fire flow test starts.';
$ec_lang['lpn_ff_col_available']='Available flow';
$ec_lang['lpn_ff_col_required']='Required flow';
$ec_lang['lpn_ff_col_residual']='Residual held';
$ec_lang['lpn_ff_col_atrequired']='Pressure at required flow';
$ec_lang['lpn_ff_col_affected']='Worst effect';
$ec_lang['lpn_ff_col_limit']='Design limit';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='Not checked';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Static failed, so not checked';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Failure modes';
$ec_lang['lpn_ff_mode_fire']='Fire';
$ec_lang['lpn_ff_mode_design']='Design';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='None';
$ec_lang['lpn_ff_col_solves']='Runs';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='Pressure and velocity';
$ec_lang['lpn_ff_atleast']='more than {flow}';
$ec_lang['lpn_ff_affect_node']='{id} drops to {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} reaches {velocity}';
$ec_lang['lpn_ff_more']='and {n} more affected';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='Junctions not shown: {n}.';
$ec_lang['lpn_ff_rows_more_links']='Links not shown: {n}.';
$ec_lang['lpn_ff_design_none']='With each tested junction’s fire flow drawn in turn, nothing in the design check scope failed its limits.';
$ec_lang['lpn_ff_design_off_note']='The effect on the rest of the system was not checked in this run.';
// **WHY IT IS SAID AND NEVER APPLIED, in Tom's words (2026-09-02), and the reason is the MODEL, not
// the arithmetic:** *"These models are not always fine-grained. They don't represent every pipe,
// junction, or fire hydrant. Many things may be ganged at a node including categories and fire
// hydrants. That is why we don't enforce the credit limit."* A node is not a hydrant. It may stand
// for one, or for a block of them, and nothing in the file says which -- so a per-hydrant cap
// cannot be applied to a per-node number without knowing a thing the model does not carry.
//
// **"Credit" is ISO's own word and is a RATING term, not a hydraulic one** -- what a hydrant is
// allowed to count for when a fire-suppression rating is computed, which is why it can sit beside a
// hydraulic answer without contradicting it.
//
// ISO credits a single hydrant with at most 1,500 gpm whatever the hydraulics say. Said beside the
// numbers and never applied to them: a number quietly cut down to a credit limit is a lie with a
// tidy face.
$ec_lang['lpn_ff_iso']='The Insurance Services Office (ISO) credits a single hydrant with at most {flow}. That limit is not applied here, because a junction may represent more than one hydrant.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Already below the residual before any fire flow is drawn';
$ec_lang['lpn_ff_err_converge']='The network did not converge.';
$ec_lang['lpn_ff_err_solve']='The solver reported an error and gave no answer.';
$ec_lang['lpn_ff_err_not_junction']='Not a junction';
$ec_lang['lpn_ff_err_unknown']='No result. Error code: {code}';

// ---- Water > Criticality analysis (Tom, 2026-09-30) -------------------------------------------
//
// Break each asset in turn, on a copy, and report what the system loses. "Criticality analysis" is
// the industry's term (WaterGEMS, InfoWater); EPANET has no such tool and no word for it. The run
// dialog, Run, Stop, the engine sentence and the cost line are fire flow's own keys.
//
// {n}, {done} and {total} are whole numbers; {pressure} is a pressure with its unit.
$ec_lang['lpn_crit_menu']='Criticality analysis…';
$ec_lang['lpn_crit_menu_tip']='Remove each pipe, pump, and valve from the network in turn and report the effect on the system.';
$ec_lang['lpn_crit_title']='Criticality analysis';
$ec_lang['lpn_crit_intro']='Each asset is taken out of the network in turn, and the network is solved at the time step on screen in the active scenario. Nothing in the project is changed; the whole run is made on a copy.';
$ec_lang['lpn_crit_scope']='Links to break';
$ec_lang['lpn_crit_scope_tip']='All pipes, pumps, and valves, or only those selected on the map. Choose the set before you run.';
$ec_lang['lpn_crit_scope_all']='All links';
$ec_lang['lpn_crit_scope_selected']='Selected links';
$ec_lang['lpn_crit_minpressure']='Lowest pressure allowed';
$ec_lang['lpn_crit_minpressure_tip']='This is the same number as the Lowest pressure allowed elsewhere box of the Fire flow analysis. Changing it here changes it there.';
$ec_lang['lpn_crit_col_asset']='Asset';
$ec_lang['lpn_crit_col_unserved']='Demand not served';
$ec_lang['lpn_crit_col_cutoff']='Junctions cut off';
$ec_lang['lpn_crit_col_below']='Junctions below minimum';
$ec_lang['lpn_crit_summary']='Assets that leave demand unserved or drop a junction below {pressure} ({n} of {total}).';
$ec_lang['lpn_crit_baseline_below']='Junctions already below it with nothing broken: {n}. They are not counted.';
$ec_lang['lpn_crit_working']='Working: {done} of {total} assets.';
$ec_lang['lpn_crit_stopped']='Stopped after {done} of {total} assets. The results below are the ones already finished.';
$ec_lang['lpn_crit_no_selection']='No links are selected. Select links or choose All links.';
$ec_lang['lpn_crit_no_links']='This project has no links yet, so there is nothing to break.';
$ec_lang['lpn_crit_busy']='Another analysis is running. Stop it, or wait for it to finish.';
$ec_lang['lpn_crit_skipped']='{n} selected elements are not links, so they were not broken.';
$ec_lang['lpn_crit_stale']='The drawing changed, so the criticality results were cleared. Run it again.';
$ec_lang['lpn_crit_skipdead']='Skip dead ends';
$ec_lang['lpn_crit_skipdead_tip']='A dead-end link is one whose removal cuts off junctions that can be reached only through it, with no reservoir or tank beyond. Its loss is everything beyond it, so it is not solved. The summary says how many were skipped.';
$ec_lang['lpn_crit_skipped_dead']='Dead-end links skipped: {n}. Each one cuts off everything beyond it.';

// ---- Water > Analyze > Demand scaling (ROADMAP Task 754) ----------------------------------------
//
// Tom, 2026-09-30 and 2026-10-01: the demands multiplied on a copy, like Fire flow, and "What demand
// scale can the system handle with this pressure limit?" The run dialog's Stop, the engine sentence,
// the cost line, the Junction heading and the solver's reasons are fire flow's own keys.
//
// {m} and {max} are demand scales printed as numbers (1.37); {step} is the search's tolerance
// (0.01); {n} is a whole number, always after a colon so no plural has to agree with it; {time} and
// {now} are elapsed times (6:00); {pressure} is a pressure with its unit; {id} becomes a link to the
// junction on the map; {reason} is a whole sentence saying why the solver gave no answer.
$ec_lang['lpn_ds_menu']='Demand scaling…';
$ec_lang['lpn_ds_menu_tip']='Multiply the demands on a copy of the network and see the pressures and velocities, or find the largest demand scale the system can carry.';
$ec_lang['lpn_ds_title']='Demand scaling';
$ec_lang['lpn_ds_intro']='Press the Run button to multiply the demands at the chosen junctions by the demand scale and see the pressures and velocities.\n\nPress the Find button to find the largest demand scale, to the nearest {step}, at which all these junctions keep at least the lowest pressure allowed; it searches from 0 to {max}.\n\nBoth work on a copy of the network, solved at the time step on screen in the active scenario, so nothing in your project is changed. Only that time step is scaled, and levels and statuses are taken from it; to test the peak, move the clock to the peak demand before you run.';
$ec_lang['lpn_ds_scope']='Junctions to scale';
$ec_lang['lpn_ds_scope_all']='All junctions';
$ec_lang['lpn_ds_scope_selected']='Selected junctions';
$ec_lang['lpn_ds_minpressure']='Lowest pressure allowed';
$ec_lang['lpn_ds_minpressure_tip']='This is the same number as the Lowest pressure allowed elsewhere box of the Fire flow analysis. Changing it here changes it there.';
$ec_lang['lpn_ds_head_scale']='Scale the demands';
$ec_lang['lpn_ds_multiplier']='Demand scale';
$ec_lang['lpn_ds_multiplier_tip']='The factor by which each demand is multiplied; 1.5 is a 50% increase. It applies in addition to the demand multiplier of the active scenario, which is already in the demands, and it is never saved in the project.';
$ec_lang['lpn_ds_run']='Run';
$ec_lang['lpn_ds_head_search']='What demand scale can the system handle?';
$ec_lang['lpn_ds_head_search_selected']='What demand scale can these junctions handle?';
$ec_lang['lpn_ds_outside_below']='At a demand scale of {m}, junctions not selected that are below {pressure}: {n} ({ids}). They do not limit this answer.';
$ec_lang['lpn_ds_holds_max']='✓ Every junction keeps {pressure} up to a demand scale of {max}, the top of the search.';
$ec_lang['lpn_ds_below_zero']='⚠ At least one junction is below {pressure} even with the scaled demands at zero.';
$ec_lang['lpn_ds_found']='✓ Every junction checked keeps at least {pressure} up to a demand scale of {m}.';
$ec_lang['lpn_ds_found_below']='⚠ The demands as entered (a demand scale of 1) leave at least one junction below {pressure}. The largest demand scale that keeps every junction at {pressure} or above is {m}.';
$ec_lang['lpn_ds_search_stopped']='The search was stopped before it found an answer.';
$ec_lang['lpn_ds_lowest_at']='At a demand scale of {m}, the lowest pressure is {pressure}, at junction {id}.';
$ec_lang['lpn_ds_nosolve_at']='At a demand scale of {m}, the network gave no answer. {reason}';
$ec_lang['lpn_ds_scale_ok']='✓ At a demand scale of {m}, every junction keeps {pressure}.';
$ec_lang['lpn_ds_scale_below']='⚠ At a demand scale of {m}, junctions below {pressure}: {n}.';
$ec_lang['lpn_ds_scaled_selected']='Junctions scaled and checked: {n}.';
$ec_lang['lpn_ds_head_lowest']='Lowest pressures';
$ec_lang['lpn_ds_head_velocity']='Highest velocities';
$ec_lang['lpn_ds_col_link']='Link';
$ec_lang['lpn_ds_col_scaled']='Scaled';
$ec_lang['lpn_ds_col_scaled_tip']='With the demands multiplied by the demand scale.';
$ec_lang['lpn_ds_col_unscaled']='Unscaled';
$ec_lang['lpn_ds_col_unscaled_tip']='With the demands as they are in the active scenario at this time step, the same value the map shows.';
$ec_lang['lpn_ds_no_junctions']='This project has no junctions yet, so there are no demands to scale.';
$ec_lang['lpn_ds_no_selection']='No junctions are selected. Select junctions or choose All junctions.';
$ec_lang['lpn_ds_skipped']='Selected elements that are not junctions, left as they are: {n}.';
$ec_lang['lpn_ds_bad_multiplier']='Enter a demand scale of zero or more, such as 1.5.';
$ec_lang['lpn_ds_stale']='The drawing changed, so the demand scaling results were cleared. Run it again.';
$ec_lang['lpn_analyze_at_time']='Time step: {time}.';
$ec_lang['lpn_analyze_time_moved']='⚠ This was computed at {time}, and the clock is now at {now}. Run it again for the time step on screen.';

// ---- Settings > New assets > Import surveyed points: CSV and GPX (ROADMAP Task 592) -----------
//
// A field survey produces a flat list of a name, a latitude and a longitude -- never an EPANET
// `.inp` -- and EPANET has no path for one either. js/lpn-survey.js reads the file; these are the
// sentences it and js/looped-network.js say about what came across.
//
// **EVERY ONE OF THESE EXISTS BECAUSE A ROW THAT CANNOT BE HONOURED IS REPORTED, never dropped and
// never guessed at.** That is the rule the `.inp` importer already answered this question with, and
// a note per case is what makes it true rather than claimed: the reader is told which row, what its
// own number said, and what was done instead.
//
// The two refusals that matter most are about GUESSING. A latitude outside its range is very
// probably a longitude in the wrong column, and this page says so and changes nothing, because it
// cannot tell a mistake from a place; a file of eastings and northings is refused by name, because
// a plane coordinate read as a degree is silent and puts a network in the Gulf of Guinea.
$ec_lang['lpn_file_import_survey']='Surveyed points…';
$ec_lang['lpn_file_import_survey_tip']='Read a list of surveyed points from a text file and make one junction at each point, taking the new-asset settings for everything the file does not state. No pipes are drawn unless you tick Read the description as field codes, and no row is ever dropped without being named. It reads the coordinate system this project already uses, georeferenced or not.';
// GeoJSON import of Shapes (Task 779). Only points, lines and polygons come in, as Shapes; the
// network is imported from an EPANET file. Every feature not imported is named in the report.
$ec_lang['lpn_file_import_shapes']='GeoJSON shapes…';
$ec_lang['lpn_file_import_shapes_tip']='Read the points, lines, and polygons of a GeoJSON file into this project as Shapes. Network assets in the file are not imported; import the network with File, Import, EPANET file or File, Import, GeoJSON network. The project must be georeferenced or state a coordinate system.';
$ec_lang['lpn_file_import_gjnet']='GeoJSON network…';
$ec_lang['lpn_file_import_gjnet_tip']='Open a GeoJSON file as a new project. Points are imported as junctions, reservoirs, or tanks, and lines as pipes. A file exported from this page is read as written; for any other file, one step maps its fields to properties and units.';
$ec_lang['lpn_gjnet_refuse_crs']='{file} states the coordinate system {crs}. GeoJSON positions are WGS 84 latitude and longitude (RFC 7946), and this page does not convert a GeoJSON file from another system. Export the layer from the GIS in EPSG:4326 (WGS 84), then import that file.';
$ec_lang['lpn_gjnet_refuse_empty']='{file} contains no points or lines.';
$ec_lang['lpn_gjnet_target_node_type']='Node type';
$ec_lang['lpn_gjnet_target_custom']='Custom property';
$ec_lang['lpn_gjnet_target_skip']='Do not import';
$ec_lang['lpn_gjnet_points_heading']='Point fields (junctions, reservoirs, and tanks)';
$ec_lang['lpn_gjnet_lines_heading']='Line fields (pipes)';
$ec_lang['lpn_gjnet_no_fields']='These features have no attribute fields.';
$ec_lang['lpn_gjnet_col_field']='Field';
$ec_lang['lpn_gjnet_col_example']='Example';
$ec_lang['lpn_gjnet_col_fills']='Fills';
$ec_lang['lpn_gjnet_col_unit']='Unit';
$ec_lang['lpn_gjnet_beta']='Beta: feedback requested';
$ec_lang['lpn_gjnet_beta_tip']='This import has been tried on few files from GIS programs. To report a problem or suggest a change, press {button} on the page and describe the file.';
$ec_lang['lpn_gjnet_intro']='{points} points and {lines} lines were found. Points are imported as junctions, reservoirs, or tanks, and lines as pipes. Choose the property each field fills and the unit of each number.';
$ec_lang['lpn_gjnet_other']='{n} features are neither points nor lines and will not be imported; the report lists them.';
$ec_lang['lpn_gjnet_tolerance']='Join tolerance (m)';
$ec_lang['lpn_gjnet_tolerance_tip']='A line end within this distance of a point, or of another line end, is joined to it. A line end farther than this from every point gets a new junction.';
$ec_lang['lpn_gjnet_working']='Importing {file}…';
$ec_lang['lpn_gjnet_title']='Import GeoJSON network: {file}';
$ec_lang['lpn_gjnet_report_lead']='Each change made during import, and each feature not imported, is listed below with the reason:';
$ec_lang['lpn_gjnet_and_more']='and {n} more';
$ec_lang['lpn_gjnet_note_crs']='The file states the coordinate system {crs}, which is WGS 84 latitude and longitude, the system RFC 7946 requires. Positions were read as stated.';
$ec_lang['lpn_gjnet_note_crs_nad83']='The file states NAD83 (EPSG:4269). Its positions were read as WGS 84, which places them within about 1 to 2 m of where NAD83 puts them.';
$ec_lang['lpn_gjnet_note_skip_geometry']='Not imported: the feature is not a point or a line.';
$ec_lang['lpn_gjnet_note_skip_kind']='Not imported: the feature states no node_type or link_type.';
$ec_lang['lpn_gjnet_note_skip_position']='Not imported: a position is not a valid latitude and longitude.';
$ec_lang['lpn_gjnet_note_skip_id']='Not imported: the name is not a valid ID, or another element of the same kind has it.';
$ec_lang['lpn_gjnet_note_skip_no_node']='Not imported: the start or end node named is not in the file.';
$ec_lang['lpn_gjnet_note_skip_loop']='Not imported: both ends of the line join the same node.';
$ec_lang['lpn_gjnet_note_id_new']='These features state no valid ID and were assigned the ID shown in parentheses.';
$ec_lang['lpn_gjnet_note_id_dup']='These IDs are stated by more than one feature of the same kind. Each later feature was assigned the ID shown in parentheses.';
$ec_lang['lpn_gjnet_note_unmapped_id_point']='No field was chosen for the point ID, so every node imported from a point was assigned an ID.';
$ec_lang['lpn_gjnet_note_unmapped_id_line']='No field was chosen for the line ID, so every pipe was assigned an ID.';
$ec_lang['lpn_gjnet_note_skip_short']='Not imported: a line needs at least two positions.';
$ec_lang['lpn_gjnet_note_elev_taken']='These nodes state no elevation. Each was given the elevation of the node shown in parentheses: for a junction added at a line end, the node at the other end of its pipe, otherwise the nearest node that states one.';
$ec_lang['lpn_gjnet_note_default_elev_added']='These junctions were added at line ends and have the default elevation, {value}, because no node in the file states an elevation.';
$ec_lang['lpn_gjnet_note_demand_kept']='A reservoir or tank has no demand, so the demand stated on these nodes was kept as the custom property {key}.';
$ec_lang['lpn_gjnet_note_parts']='These multipart lines have parts that are not connected and were imported as one pipe for each part.';
$ec_lang['lpn_gjnet_note_parts_points']='These multipoint features were imported as one node for each point.';
$ec_lang['lpn_gjnet_note_junction_added']='These junctions were added where a line end is not within {tol} of a point. Each has the default base demand.';
$ec_lang['lpn_gjnet_note_end_moved']='These pipes have an end within {tol} of a point or another line end, but not on it. The end was joined to it; the largest distance is {dist}.';
$ec_lang['lpn_gjnet_note_end_on_pipe']='These line ends lie on the pipe shown in parentheses, but not at its end, and are not connected to it.';
$ec_lang['lpn_gjnet_note_z']='These points state a third coordinate, which was not imported.';
$ec_lang['lpn_gjnet_note_default_elev']='These nodes state no elevation and have the default elevation, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_elev']='No field was chosen for the elevation, so every node has the default elevation, {value}, and automatic lengths include no elevation difference.';
$ec_lang['lpn_gjnet_note_default_demand']='These junctions state no base demand and have the default base demand, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_demand']='No field was chosen for the base demand, so every junction has the default base demand, {value}.';
$ec_lang['lpn_gjnet_note_default_diameter']='These pipes state no diameter and have the default diameter, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_diameter']='No field was chosen for the diameter, so every pipe has the default diameter, {value}.';
$ec_lang['lpn_gjnet_note_default_roughness']='These pipes state no roughness and have the default roughness, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_roughness']='No field was chosen for the roughness, so every pipe has the default roughness, {value}.';
$ec_lang['lpn_gjnet_note_default_k']='These pipes state no minor loss coefficient, so each has 0, as in an EPANET file that states none.';
$ec_lang['lpn_gjnet_note_unmapped_k']='No field was chosen for the minor loss coefficient, so every pipe has 0, as in an EPANET file that states none.';
$ec_lang['lpn_gjnet_note_default_tank']='These tanks have the default water depths and tank diameter.';
$ec_lang['lpn_gjnet_note_length_auto']='These pipes state no length. Each length is computed from the line (Auto).';
$ec_lang['lpn_gjnet_note_unmapped_length']='No field was chosen for the length, so every pipe length is computed from the line (Auto).';
$ec_lang['lpn_gjnet_note_value_unread']='These values are not numbers or are not recognized, and were not used.';
$ec_lang['lpn_gjnet_note_field_skipped']='These fields were not imported, as chosen.';
$ec_lang['lpn_gjnet_note_field_custom']='These fields were imported as custom properties.';
$ec_lang['lpn_gjnet_note_results']='The results in the file were not imported. Calculate computes them again.';
$ec_lang['lpn_gjnet_note_demand_rows']='These junctions had more than one demand row. A GeoJSON file holds only the first, which was imported.';
$ec_lang['lpn_gjnet_note_pipe_type']='These pipes state the pipe type shown in parentheses, whose definition a GeoJSON file does not hold. The pipe type was not imported; the diameter and roughness stated in the file were.';
$ec_lang['lpn_gjnet_note_pattern_conflict']='These patterns are stated with different multipliers on different features. The first was used.';
$ec_lang['lpn_gjnet_note_end_off_node']='The line of each of these links does not start or end at its node. The node position was used.';
$ec_lang['lpn_gjnet_note_not_held']='A GeoJSON file does not hold controls, rules, time settings, Text items, EPANET options, or the pipe type, fittings, and efficiency curve libraries, so none of these was imported.';
$ec_lang['lpn_geojson_import_done']='{n} Shapes imported from {file}.';
$ec_lang['lpn_geojson_import_done_one']='One Shape imported from {file}.';
$ec_lang['lpn_geojson_import_renamed']='{n} feature names cannot be used as Shape IDs. Each Shape was given another ID and keeps its feature name: {list}.';
$ec_lang['lpn_geojson_import_renamed_one']='One feature name cannot be used as a Shape ID. The Shape was given another ID and keeps its feature name: {list}.';
$ec_lang['lpn_geojson_import_skipped']='{n} features not imported: {list}.';
$ec_lang['lpn_geojson_import_skipped_one']='One feature not imported: {list}.';
$ec_lang['lpn_geojson_import_why_network']='network asset';
$ec_lang['lpn_geojson_import_why_geometry']='not a point, line, or polygon';
$ec_lang['lpn_geojson_import_why_position']='position not a valid latitude and longitude';
$ec_lang['lpn_geojson_import_holes']='{n} polygon holes not imported. A Shape has one boundary.';
$ec_lang['lpn_geojson_import_holes_one']='One polygon hole not imported. A Shape has one boundary.';
$ec_lang['lpn_geojson_import_parts']='{n} multipart features imported as one Shape for each part.';
$ec_lang['lpn_geojson_import_parts_one']='One multipart feature imported as one Shape for each part.';
$ec_lang['lpn_geojson_import_local']='GeoJSON positions are latitude and longitude, and this project has no place on the Earth to which they can be converted. Georeference it first with Map, World map, Attach, then import again.';
$ec_lang['lpn_geojson_import_unreadable']='{file} is not a GeoJSON file: {detail}';
$ec_lang['lpn_file_import_dxf']='DXF shapes…';
$ec_lang['lpn_file_import_dxf_tip']='Read the points, lines, and polylines of an ASCII DXF file into this project as Shapes, with each layer name kept as a property. Other entities are counted and listed, not imported. The coordinates are read as the X and Y of this project, with no conversion.';
$ec_lang['lpn_file_import_shp']='Shapefile shapes…';
$ec_lang['lpn_file_import_shp_tip']='Read the points, lines, and polygons of an ESRI shapefile into this project as Shapes, with the attribute columns kept as properties. Select either the .zip or the .shp together with its .shx, .dbf, and .prj (hold Ctrl or Shift to select several). Coordinates in a different coordinate system from the project are converted, and the notice states this.';
$ec_lang['lpn_dxf_import_skipped']='{n} entities not imported: {list}.';
$ec_lang['lpn_dxf_import_skipped_one']='One entity not imported: {list}.';
$ec_lang['lpn_dxf_import_inblocks']='in block definitions';
$ec_lang['lpn_dxf_import_bulge']='{n} polylines have arc segments, which were imported as straight segments between their vertices.';
$ec_lang['lpn_dxf_import_bulge_one']='One polyline has arc segments, which were imported as straight segments between its vertices.';
$ec_lang['lpn_dxf_import_units']='The drawing states its units as {theirs} and this project uses {ours}. The numbers were not changed.';
$ec_lang['lpn_dxf_import_refuse_geo']='A DXF drawing is planar, and this project is in latitude and longitude, so the coordinates of {file} have no place in it. Use Convert as… to copy the project into a coordinate system, then import again.';
$ec_lang['lpn_dxf_import_unreadable']='{file} is not an ASCII DXF file.';
$ec_lang['lpn_dxf_import_binary']='{file} is a binary DXF. Save it from your CAD program as an ASCII DXF, then import again.';
$ec_lang['lpn_shapes_import_frame']='The coordinates were read as {frame}, with no conversion.';
$ec_lang['lpn_shapes_frame_xy']='the X and Y of this project';
$ec_lang['lpn_shapes_frame_latlon']='latitude and longitude';
$ec_lang['lpn_shp_import_skipped']='{n} records not imported, because their geometry type is not read: {list}.';
$ec_lang['lpn_shp_import_skipped_one']='One record not imported, because its geometry type is not read: {list}.';
$ec_lang['lpn_shp_import_attrs']='Attribute columns kept as properties of each Shape: {list}.';
$ec_lang['lpn_shp_import_noprj']='There is no .prj file, so the coordinates were read as {frame}, with no conversion.';
$ec_lang['lpn_shp_import_prj_same']='The .prj states {crs}, the coordinate system of this project, so the coordinates were not changed.';
$ec_lang['lpn_shp_import_converted']='The coordinates are latitude and longitude. They were converted to {crs} by the transform the map uses.';
$ec_lang['lpn_shp_import_prj_other']='The .prj states {theirs}. This project states no coordinate system, so the coordinates were read as {frame}, with no conversion.';
$ec_lang['lpn_shp_import_refuse_local']='{file} is in latitude and longitude, and this project has no place on the Earth to which they can be converted. Georeference it first with Map, World map, Attach, then import again.';
$ec_lang['lpn_shp_import_refuse_crs']='{file} states {theirs}, and this project is in {ours}. Nothing was imported and nothing was converted.';
$ec_lang['lpn_shp_import_refuse_range']='{file} has no .prj file, and its coordinates are not latitudes and longitudes, so they cannot be placed in this project.';
$ec_lang['lpn_shp_import_noshp']='{file} contains no .shp file. Select either the .zip of a shapefile or the .shp together with its .shx, .dbf, and .prj (hold Ctrl or Shift to select several).';
$ec_lang['lpn_shp_import_manyshp']='{file} contains more than one shapefile. Import one at a time.';
$ec_lang['lpn_shp_import_unreadable']='{file} is not a shapefile this page can read: {detail}';
$ec_lang['lpn_shp_import_pick_hint']='A shapefile is several files. Select the .shp together with its .shx, .dbf, and .prj (hold Ctrl or Shift to select several), or select the .zip.';
$ec_lang['lpn_shp_import_webmerc_ask']='{file} has no .prj file, and its numbers are not latitudes and longitudes, but they fit Web Mercator metres (EPSG:3857), the system QGIS and web maps use. Import them as EPSG:3857 and convert them to this project?';
$ec_lang['lpn_shp_import_webmerc_ok']='Import as EPSG:3857';
$ec_lang['lpn_shp_import_webmerc_far_ask']='{file} states {theirs}, and read in that system its coordinates fall {km} km from this project. Read as Web Mercator metres (EPSG:3857), the system QGIS and web maps use, they fall where this project is. Import them as EPSG:3857 and convert them to this project?';
$ec_lang['lpn_shp_import_reprojected']='The coordinates were converted from {theirs} to {ours}.';
$ec_lang['lpn_shp_import_unplaced']='{n} records have coordinates this project cannot place, such as a latitude beyond the limit of the map. Record numbers: {list}.';
$ec_lang['lpn_shp_import_unplaced_one']='One record has coordinates this project cannot place, such as a latitude beyond the limit of the map. Record number: {list}.';
$ec_lang['lpn_shapes_import_none']='Nothing was imported from {file}.';
$ec_lang['lpn_shp_import_convert_hint']='Use Convert as… to copy the project into {theirs}, then import again.';
$ec_lang['lpn_shp_import_damaged']='{file} is damaged or cut short, so nothing was imported.';
$ec_lang['lpn_shp_import_deleted']='{n} records marked deleted in the .dbf were not imported.';
$ec_lang['lpn_shp_import_deleted_one']='One record marked deleted in the .dbf was not imported.';
$ec_lang['lpn_dxf_import_paperspace']='in paper space';
$ec_lang['lpn_shapes_import_more']='and {n} more';
$ec_lang['lpn_survey_read_error']='That file could not be read from your disk.';
$ec_lang['lpn_survey_cancelled']='Nothing was created and nothing was changed.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='Northing';
$ec_lang['lpn_survey_axis_east']='Easting';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='That file has nothing in it.';
$ec_lang['lpn_survey_err_unreadable']='That file could not be read as a surveyed point list.';
$ec_lang['lpn_survey_err_ambiguous_coord']='More than one column in that file could be the {axis} ({detail}), and this page does not choose between them. Leave only one of them named as the {axis} and try again.';
$ec_lang['lpn_survey_err_no_points']='Not one row of that file could be read as a surveyed point. Rows read: {detail}';
// THE FILE FORMAT CHOOSER (Tom, 2026-09-17: "We will need to include a file format chooser
// (PNEZD, PENZD, or whatever format is useful for Declan."). PNEZD and PENZD are the same five
// columns and differ only in which coordinate comes first, and the trade has at least eight named
// orderings between them. The QUESTION is asked in plain words and the trade name only identifies
// the answer, because the person holding the file knows what is in each column and may well not
// know which acronym puts the northing first.
//
// A file whose first line names its own columns is read from those names and the chooser is left
// alone. Nothing is ever worked out from the size of the numbers: that is right on the file it was
// tried against and wrong on the next one.
$ec_lang['lpn_survey_format_label']='File format:';
$ec_lang['lpn_survey_format_internal']='specified internally';
$ec_lang['lpn_survey_create']='Create nodes';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='The first line was skipped: it names no columns this page knows.';
$ec_lang['lpn_survey_type_label']='Asset type:';
$ec_lang['lpn_survey_confirm_junction']='{n} junction(s) found. Proceed?';
$ec_lang['lpn_survey_confirm_reservoir']='{n} reservoir(s) found. Proceed?';
$ec_lang['lpn_survey_confirm_tank']='{n} tank(s) found. Proceed?';
$ec_lang['lpn_survey_report_junction']='{n} junction(s) imported, {m} with elevation.';
$ec_lang['lpn_survey_report_reservoir']='{n} reservoir(s) imported, {m} with elevation.';
$ec_lang['lpn_survey_report_tank']='{n} tank(s) imported, {m} with elevation.';
$ec_lang['lpn_survey_report_clean']='Every point in the file was imported without change.';
$ec_lang['lpn_survey_report_notes']='Import errors and notes:';
$ec_lang['lpn_survey_sev_error']='error';
$ec_lang['lpn_survey_sev_warning']='warning';
$ec_lang['lpn_survey_note_line']='Line {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='Too few columns for the file format above.';
$ec_lang['lpn_survey_note_coord_missing']='The {axis} cell is empty.';
$ec_lang['lpn_survey_note_bad_coord']='The {axis} does not read as a number.';
$ec_lang['lpn_survey_note_coord_range']='The {axis} is outside the range this project allows.';
$ec_lang['lpn_survey_note_bad_elev']='Non-numeric elevation. Imported without elevation.';
$ec_lang['lpn_survey_note_ambiguous_elev']='More than one column could be the elevation, so none of them was read.';
$ec_lang['lpn_survey_note_blank_rows']='Blank lines skipped: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Name already used earlier in this file, new name assigned.';
$ec_lang['lpn_survey_note_id_taken']='Name already in project, new name assigned.';
$ec_lang['lpn_survey_note_id_invalid']='Name cannot be used here, new name assigned.';
// Field codes (Task 771): the Description read as Carlson-style codes. See dev/survey-codes.md.
$ec_lang['lpn_survey_codes_toggle']='Read the description as field codes';
$ec_lang['lpn_survey_codes_tip']='Read the first word of each description as a code from the table. Points with the same line code join into one pipe in file order, and WL1 and WL2 are separate lines. +0 starts a line, -0 ends one, and CLO closes one. JPN followed by a point name joins to that point (Carlson), and Civil 3D writes it CPN.';
$ec_lang['lpn_survey_codes_col_code']='Code';
$ec_lang['lpn_survey_codes_col_type']='Asset type';
$ec_lang['lpn_survey_codes_add']='Add code';
$ec_lang['lpn_survey_codes_remove']='Remove code';
$ec_lang['lpn_survey_confirm_coded']='{j} junction(s), {r} reservoir(s), {t} tank(s), and {p} pipe(s) found. Proceed?';
$ec_lang['lpn_survey_report_coded']='{j} junction(s), {r} reservoir(s), {t} tank(s), and {p} pipe(s) imported, {m} of the nodes with elevation.';
$ec_lang['lpn_survey_note_code_unknown']='Code not in the code table, imported as the asset type chosen above.';
$ec_lang['lpn_survey_note_code_two_nodes']='More than one node code, the first was used.';
$ec_lang['lpn_survey_note_code_unread']='Not every word is a code this page reads, kept in the description.';
$ec_lang['lpn_survey_note_vertex_text']='Not every word is a code this page reads, and a vertex keeps no description.';
$ec_lang['lpn_survey_note_join_missing']='JPN or CPN names a point not in this file or project, no pipe drawn for it.';
$ec_lang['lpn_survey_note_join_no_line']='JPN or CPN on a point with no line code, no pipe drawn for it.';
$ec_lang['lpn_survey_note_pipe_one_node']='This line returns to the same node with no other node between, no pipe drawn for it.';
$ec_lang['lpn_survey_note_line_one_point']='Only point on its line, no pipe drawn from it.';
$ec_lang['lpn_survey_note_vertices']='Points that became pipe vertices: {detail}. A vertex keeps no name, elevation, or description.';
$ec_lang['lpn_survey_note_no_desc']='Field codes are on, but this file has no description column, so no codes were read.';
$ec_lang['lpn_survey_note_ring_junction']='This point became a junction so the ring could close.';
$ec_lang['lpn_survey_note_pipe_zero_length']='This point is at the same spot as the node before it, so the pipe between them has no length.';
$ec_lang['lpn_survey_note_node_on_pipe']='This point lies exactly on a pipe it is not joined to. If they connect, add JPN to say so.';
$ec_lang['lpn_settings_demand_model']='Demand model';
$ec_lang['lpn_settings_demand_model_tip']='Choose how junctions receive flow. Demand driven (DDA) delivers every demand in full, whatever the pressure. Pressure driven (PDA) delivers less than the demand where the pressure is below the required pressure, and only the EPANET solver computes it.';
$ec_lang['lpn_settings_demand_model_dda']='Demand driven';
$ec_lang['lpn_settings_demand_model_pda']='Pressure driven';
$ec_lang['lpn_settings_min_pressure']='Minimum pressure';
$ec_lang['lpn_settings_min_pressure_tip']='Enter the pressure at or below which a junction receives no flow. Use this project\'s pressure unit.';
$ec_lang['lpn_settings_req_pressure']='Required pressure';
$ec_lang['lpn_settings_req_pressure_tip']='Enter the pressure at or above which a junction receives its full demand. It must be greater than the minimum pressure. Use this project\'s pressure unit. Leave it blank to use EPANET\'s default, which is in psi for US flow units and meters otherwise.';
$ec_lang['lpn_settings_pressure_exponent']='Pressure exponent';
$ec_lang['lpn_settings_pressure_exponent_tip']='Enter the exponent of the curve that rises from no flow at the minimum pressure to the full demand at the required pressure.';
$ec_lang['lpn_engine_pda_route']='Solved with the EPANET solver, because the demand model is pressure driven.';
$ec_lang['lpn_diag_pda_needs_epanet']='The demand model is pressure driven, and only the EPANET solver can compute it. The EPANET solver could not be loaded, so these results are missing.';
$ec_lang['lpn_result_delivered_demand']='Delivered demand';
$ec_lang['lpn_result_delivered_demand_tip']='The flow this junction actually receives under the pressure driven demand model. It is less than the demand when the pressure is below the required pressure.';
$ec_lang['lpn_result_demand_deficit']='Demand deficit';
$ec_lang['lpn_result_demand_deficit_tip']='The demand at this junction that is not delivered, because the pressure is below the required pressure.';
$ec_lang['lpn_pda_deficit_note']='Junctions receiving less than their demand: {n}.';
$ec_lang['lpn_diag_pda_pressures']='Required pressure must be greater than Minimum pressure. Change one of them in Settings.';
$ec_lang['lpn_inp_drop_pressure_unit']='This file states a pressure unit other than the one this page reads for its flow unit, which is psi for US units and meters otherwise. Every pressure in the file is read that way, so check the valve settings, emitters, and pressure driven limits it holds. The line is kept and is written back.';

// Map > Screenshot (Tom, 2026-10-05): a snipping tool that re-draws the dragged map area larger than its screen size (3x unless the Screenshot box says otherwise).
$ec_lang['lpn_screenshot_menu']='Screenshot';
$ec_lang['lpn_screenshot_tip']='Take a picture of the map area you drag, at a higher resolution than the screen. Annotate it, then copy it into a report with the Copy button. Click without dragging to take the whole map.';
$ec_lang['lpn_screenshot_hint']='Drag a rectangle over the map, or click for the whole map. Esc cancels.';
$ec_lang['lpn_screenshot_copied']='Screenshot copied.';
$ec_lang['lpn_screenshot_saved']='The clipboard is not available here, so the screenshot was downloaded as a PNG file.';
$ec_lang['lpn_screenshot_no_basemap']='The street map or satellite image could not be included.';
$ec_lang['lpn_screenshot_failed']='The screenshot could not be made.';
$ec_lang['lpn_snip_hint_free']='Drag around the area to snip, or click for the whole map. Esc cancels.';
$ec_lang['lpn_snip_tip_rect']='Snip a rectangle (S)';
$ec_lang['lpn_snip_tip_free']='Snip a freehand shape (S)';
$ec_lang['lpn_snip_tip_mode']='Snip shape';
$ec_lang['lpn_snip_tip_map']='Screenshot of the whole map';
$ec_lang['lpn_snip_tip_pen']='Pen';
$ec_lang['lpn_snip_tip_eraser']='Eraser: click a stroke to remove it (E)';
$ec_lang['lpn_snip_tip_undo']='Undo (Ctrl+Z)';
$ec_lang['lpn_snip_tip_redo']='Redo (Ctrl+Y)';
$ec_lang['lpn_snip_tip_copy']='Copy (Ctrl+C)';
$ec_lang['lpn_screenshot_scale_tip']='The picture\'s size as a multiple of the area on the screen. A larger one is sharper and makes a bigger file.';
