<?php

// All missing text declarations will fall back to English.

// Units (alphabetical order)
// Necessary for calculator units selectors
$ec_lang['u_depthFrac']="fraction";
$ec_lang['u_depthPercent']="%";
$ec_lang['u_ft2']="ft^2";
$ec_lang['u_ft3ps']="cfs";
$ec_lang['u_ft']="ft";
$ec_lang['u_fth2o']="ft H2O";
$ec_lang['u_ftps']="ft/sec";
$ec_lang['u_gpm']="gpm";
$ec_lang['u_gradePercent']='% rise/run';
$ec_lang['u_grade']="rise/run";
$ec_lang['u_in2']="sq. in.";
$ec_lang['u_inh2o']="in H2O";
$ec_lang['u_in']="in";
$ec_lang['u_knpcm2']="kN/cm^2";
$ec_lang['u_knpm2']="kN/m^2";
$ec_lang['u_kpa']="kPa";
$ec_lang['u_lps']="l/s";
$ec_lang['u_m2']="m^2";
$ec_lang['u_m3ps']="m^3/s";
$ec_lang['u_mgd']="MGD";
$ec_lang['u_mh2o']="m H2O";
$ec_lang['u_mld']="Ml/d";
$ec_lang['u_m']="m";
$ec_lang['u_mm2']="mm^2";
$ec_lang['u_mmh2o']="mm H2O";
$ec_lang['u_mm']="mm";
$ec_lang['u_mps']="m/s";
$ec_lang['u_npm2']="N/m^2";
$ec_lang['u_pa']="Pa";
$ec_lang['u_psf']="psf";
$ec_lang['u_psi']="psi";
$ec_lang['u_s']="sec";

// Page text
// In page order for easiest maintenance.
// Menu and General
$ec_lang['menu_brand']='HawsEDC Calculators';
$ec_lang['menu_main_list']='List of Calculators';
$ec_lang['menu_main_hydraulics']='Hydraulics';
$ec_lang['menu_main_language']='Language';
$ec_lang['template_welcome']='&gt;&gt; Drop your fears at the door; love is spoken here. &lt;&lt;';
$ec_lang['template_translation_help']='Can you help me improve translations, program, or host these calculators?  ';
$ec_lang['template_feedback']='Please give us your valued words of suggestion or praise.  Did this free calculator exceed your expectations in every way?';
$ec_lang['template_printable_title']='Printable Title';
$ec_lang['template_printable_subtitle']='Printable Subtitle';
$ec_lang['index_title']='Free Online Engineering Calculators';
$ec_lang['calc_set_units']='Set units:';
$ec_lang['calc_inputs']='Inputs';
$ec_lang['calc_results']='Results';
$ec_lang['view_hide_line']='[Hide this line]';
$ec_lang['view_printable']='Printable version (reload/refresh to restore)';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Darcy-Weisbach Pipe Head Loss';
$ec_lang['dw_main_title']='Free Online Darcy-Weisbach Pipe Head Loss Calculator';
$ec_lang['dw_main_desc']='Darcy-Weisbach Pipe Head Loss at Given Diameter, Roughness, and Flow';
$ec_lang['dw_roughness']='Darcy-Weisbach absolute roughness, e';
$ec_lang['dw_kinematic_viscosity']='Kinematic viscosity, v, in m<sup>2</sup>/sec (1E-6 for clean water at room temperature)';
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
$ec_lang['hw_roughness']='Hazen-Williams coefficient, C';
// Manning Irregular
$ec_lang['mi_menu']='Manning Irregular Channel';
$ec_lang['mi_main_title']='Free Online Manning Irregular Channel Calculator';
$ec_lang['mi_main_desc']='Irregular Channel Manning Uniform Flow Calculator';
$ec_lang['mi_waterSurfaceElevation']='Water surface elevation';
$ec_lang['mi_q_sum']='Q by sum of segments';
$ec_lang['mi_q_617']='Q by sum of regions with composite n per Chow 6-17 equal velocities';
$ec_lang['mi_q_618']='Q by sum of regions with composite n per Chow 6-18 equilibrium of forces';
$ec_lang['mi_xSecPoints']='Cross section points';
$ec_lang['mi_station']='Sta';
$ec_lang['mi_elevation']='Elev';
$ec_lang['mi_q']='Q';
$ec_lang['mi_d50in']='Lining<br />median<br />rock<br />size';
$ec_lang['mi_n']='n<br />for seg-<br />ment';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />region<br />boundary<br />(Bank)';
$ec_lang['mi_v']='v';
$ec_lang['mi_t']='T';
$ec_lang['mi_f']='f';
$ec_lang['mi_n_strickler']='n per<br />Strickler';
$ec_lang['mi_n_blodgett']='n per<br />Blodgett';
$ec_lang['mi_n_bathurst']='n per<br />Bathurst';
$ec_lang['mi_blodgett_v_bathurst']='Blodgett<br />vs.<br />Bathurst';
$ec_lang['mi_d50_strickler']='Strickler<br />Implied<br />D<sub>50</sub>';
$ec_lang['mi_d50_mc']='MC<br />Requ\'d.<br />D<sub>50</sub>';
$ec_lang['mi_d50_mra']='MRA<br />Requ\'d.<br />D<sub>50</sub>';
$ec_lang['mi_d50_searcy']='Searcy<br />Requ\'d.<br />D<sub>50</sub>';
$ec_lang['mi_hv']='H<sub>v</sub>';
$ec_lang['mi_tau']='Shear<br />&tau;';
$ec_lang['mi_a']='A';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_notes']='Notes';
$ec_lang['mi_notes_1_term']='Q Methods';
$ec_lang['mi_notes_1_def']='Q by sum of conveyances underestimates the frictional contribution from steep segments. Q by composite n overestimates the effect of wide shallow (overbank) friction on flow in deeper areas (main channel).';
$ec_lang['mi_notes_2_term']='D50 Values';
$ec_lang['mi_notes_2_def']='The Strickler D<sub>50</sub> is the size (for a straight and clean channel) implied by the roughness entered. The other D<sub>50</sub> results are required to resist erosion per 1) Maricopa County and Robinson Rock Chutes, 2) Maynord, Ruff, and Abt (1989), and 3) Searcy (1967)';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Manning Pipe Flow';
$ec_lang['mpf_main_title']='Free Online Manning Pipe Flow Calculator';
$ec_lang['mpf_main_desc']='Manning Formula Uniform Pipe Flow at Given Slope and Depth';
$ec_lang['mpf_spreadheet_notice']='Check out our spreadsheet version of this calculator';
$ec_lang['mpf_spreadheet_link_download']='Download Spreadsheet';
$ec_lang['mpf_spreadheet_link_Google']='Open Google Sheets version';
$ec_lang['mpf_spreadheet_view_all']='View All Spreadsheets';
$ec_lang['mpf_pipe_diameter']='Pipe diameter, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Manning roughness, n';
$ec_lang['mpf_friction_slope']='Pressure slope (possibly <a target="_blank" href="../pressureslope.php">?</a> equal to pipe slope), S<sub>0</sub>';
$ec_lang['mpf_depth_ratio']='Percent of (or ratio to) full depth (100% or 1 if flowing full)';
$ec_lang['mpf_see_notes']='(See notes)';
$ec_lang['mpf_flow']='Flow, Q ' . $ec_lang['mpf_see_notes'];
$ec_lang['mpf_velocity']='Velocity, v';
$ec_lang['mpf_velocity_head']='Velocity head, h<sub>v</sub>';
$ec_lang['mpf_flow_area']='Flow area';
$ec_lang['mpf_wetted_perimeter']='Wetted perimeter';
$ec_lang['mpf_hydraulic_radius']='Hydraulic radius';
$ec_lang['mpf_top_width']='Top width, T';
$ec_lang['mpf_froude_number']='Froude number, F';
$ec_lang['mpf_shear_stress']='Shear stress (tractive force), tau';
$ec_lang['mpf_note_1']='<p>Notes:</p><dl><dt>This is the flow and depth <em>inside</em> the pipe.</dt><dd>Getting the flow into the pipe may require significantly higher headwater depth. Add at least 1.5 times the velocity head to get the headwater depth or <a href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">see my 2-minute tutorial</a> for standard culvert headwater calculations using HY-8.</dd>';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Manning Pipe Head Loss';
$ec_lang['mphl_main_title']='Free Online Manning Pipe Head Loss Calculator';
$ec_lang['mphl_main_desc']='Manning Formula Head Loss at Given Full Flow';
$ec_lang['mphl_pipe_length']='Pipe length, L';
$ec_lang['mphl_pipe_length']='Pipe length, L';
$ec_lang['mphl_area']='Area, A';
$ec_lang['mphl_total_junction_k']='Total combined junction loss coefficient, k';
$ec_lang['mphl_friction_slope']='Friction slope';
$ec_lang['mphl_friction_loss']='Friction loss, H<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Junction loss, H<sub>m</sub>';
$ec_lang['mphl_total_loss']='Total loss, H<sub>l</sub>';
$ec_lang['mphl_hgl_1']='Downstream HGL';
$ec_lang['mphl_hgl_2']='Upstream HGL ' . $ec_lang['mpf_see_notes'];
$ec_lang['mphl_egl_2']='Upstream EGL ' . $ec_lang['mpf_see_notes'];
$ec_lang['mphl_note_1']='<p>Notes:</p><dl><dt>It is necessary to check for inlet control conditions.</dt><dd>1. The upstream HGL cannot be lower than the upstream normal depth flow elevation (or lower than the pipe!).</dd><dd>2. The headwater of a culvert is better represented by the upstream EGL than the upstream HGL.</dd><dd>3. See <a href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">my 2-minute tutorial</a> for simple standard culvert headwater calculations using HY-8.</dd>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Manning Trapezoidal Channel';
$ec_lang['mtc_main_title']='Free Online Manning Formula Trapezoidal Channel Calculator';
$ec_lang['mtc_main_desc']='Manning Formula Uniform Trapezoidal Channel Flow at Given Slope and Depth';
$ec_lang['mtc_bottom_width']='Bottom width';
$ec_lang['mtc_side_slope_1']='Side slope 1 (horiz./vert.)';
$ec_lang['mtc_side_slope_2']='Side slope 2 (horiz./vert.)';
$ec_lang['mtc_channel_slope']='Channel slope';
$ec_lang['mtc_flow_depth']='Flow depth';
$ec_lang['mtc_bend_angle']='Bend Angle<a target="_blank" href="/riprap-bend-angle.png" title="Click for image">?</a> (for riprap sizing)';
$ec_lang['mtc_sgrock']='Stone specific gravity (2.65)';
$ec_lang['mtc_d50in']='Lining median rock size';
$ec_lang['mtc_n_strickler']='n per Strickler';
$ec_lang['mtc_n_blodgett']='n per Blodgett';
$ec_lang['mtc_n_bathurst']='n per Bathurst';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett vs. Bathurst';
$ec_lang['mtc_d50_bottom']='Required bottom angular riprap size, D50, Maricopa County <a href="javascript:alert(\'For S0 < 2% per Isbash (1936) and Maricopa County, Arizona, US. For S >= 2% per Robinson Rock Chute \')">?</a>';
$ec_lang['mtc_d50_z1']='Required side slope 1 angular riprap size, D50, Maricopa County <a href="javascript:alert(\'For S0 < 2% per Isbash (1936) and Maricopa County, Arizona, US. For S >= 2% per Robinson Rock Chute \')">?</a>';
$ec_lang['mtc_d50_z2']='Required side slope 2 angular riprap size, D50, Maricopa County <a href="javascript:alert(\'For S0 < 2% per Isbash (1936) and Maricopa County, Arizona, US. For S >= 2% per Robinson Rock Chute \')">?</a>';
$ec_lang['mtc_d50_mra']='Required angular riprap size, D50, per Maynord, Ruff, and Abt (1989)';
$ec_lang['mtc_d50_searcy']='Required angular riprap size, D50, per Searcy (1967)';
// Robinson Rock Chute
$ec_lang['rrc_main_menu']='Robinson Rock Chute';
$ec_lang['rrc_main_desc']='Robinson Rock Chute Design Spreadsheet';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Weir Flow Simple';
$ec_lang['ws_main_title']='Free  Online Simple Broad-crested Weir Flow Calculator';
$ec_lang['ws_main_desc']='Simple Broad-crested Weir Flow Calculator';
$ec_lang['ws_weirLength']='Weir length, l';
$ec_lang['ws_headWaterHeight']='Headwater height, h';
$ec_lang['ws_weirCoefficient']='Weir coefficient, Cw';
$ec_lang['ws_notes_heading']='Notes';
$ec_lang['ws_notes_we_term']='Weir Equation';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Weir Flow Irregular';
$ec_lang['wi_main_title']='Free Online Segmented, Variable Depth, Irregular Weir Flow Calculator';
$ec_lang['wi_main_desc']='Irregular Weir Flow Calculator';
$ec_lang['wi_headWaterelevation']='Headwater elevation';
$ec_lang['wi_weirPoints']='Weir points';
$ec_lang['wi_station']='Station (distance)';
$ec_lang['wi_elevation']='Elevation';
$ec_lang['wi_pondingHeight']='Ponding Height';
$ec_lang['wi_incrementalFlow']='Incremental Flow';
$ec_lang['wi_cumulativeFlow']='Cumulative Flow';
$ec_lang['wi_save_and_calculate']='Save and Calculate';
$ec_lang['wi_notes_we_term']='Weir Equation';
$ec_lang['wi_notes_we_def']='q = if (length = 0) then 0 else if (slope=0) then cw*length*d0<sup>1.5</sup> else cw/(2.5*slope) * (d0<sup>2.5</sup> - d1<sup>2.5</sup>) where d1 and d0 are always positive or zero';
// Erosion Setback and Scour Calc.
$ec_lang['essc_btbw']='Bank to bank width';
$ec_lang['essc_mcr']='Minimum curve radius';
$ec_lang['essc_q']='Flow, Q';
$ec_lang['plamen_test']='What does this button do';
// Contact us.
$ec_lang['contact_title']='HawsEDC Contact';
$ec_lang['contactSendMessage']='Send Tom Haws a message';
$ec_lang['contactYourName']='Your name:';
$ec_lang['contactYourEmail']='Your e-mail address:';
$ec_lang['contactSubject']='Subject:';
$ec_lang['contact_message']='Message:';
$ec_lang['contactSpamPrefix']='Five plus one equals';
$ec_lang['contactSpamPostfix']='(Please spell it out. 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Submit Message';