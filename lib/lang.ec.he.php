<?php

// All missing text declarations will fall back to English.

// Units (alphabetical order)
// Necessary for calculator units selectors
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
$ec_lang['u_in']='inches';
$ec_lang['u_knpcm2']='kN/cm^2';
$ec_lang['u_knpm2']='kN/m^2';
$ec_lang['u_kpa']='kPa';
$ec_lang['u_lps']='l/s';
$ec_lang['u_m2']='m^2';
$ec_lang['u_m3ps']='m^3/s';
$ec_lang['u_mgd']='MGD';
$ec_lang['u_mh2o']='m H2O';
$ec_lang['u_mld']='Ml/d';
$ec_lang['u_m']='m';
$ec_lang['u_mm2']='mm^2';
$ec_lang['u_mmh2o']='mm H2O';
$ec_lang['u_mm']='mm';
$ec_lang['u_mps']='m/s';
$ec_lang['u_npm2']='N/m^2';
$ec_lang['u_pa']='Pa';
$ec_lang['u_psf']='psf';
$ec_lang['u_psi']='psi';
$ec_lang['u_s']='sec';

// Page text
// In page order for easiest maintenance.
$ec_lang['menu_brand']='HawsEDC Calculators';
$ec_lang['menu_main_list']='List of Calculators';
$ec_lang['menu_main_hydraulics']='Hydraulics';
$ec_lang['menu_main_language']='Language';
$ec_lang['template_welcome']='&gt;&gt; Drop your fears at the door; love is spoken here. Enjoy the <a href="https://hawsedc.com/download.php">free libre HawsEDC AutoCAD tools</a> too. &lt;&lt;';
$ec_lang['template_translation_help']='האם אתה יכול לעזור לי לתרגם את המחשבון לשפה שלך או להטמיע את המחשבון באתר שלך?  ';
$ec_lang['template_feedback']='בבקשה תן לנו את חוות דעתך. האם המחשבון החינמי עלה על כל ציפיותיך?';
$ec_lang['template_printable_title']='אזור כותרת להדפסה';
$ec_lang['template_printable_subtitle']='אזור כותרת משנה להדפסה';
$ec_lang['index_title']='Free Online Engineering Calculators';
$ec_lang['calc_set_units']='הגדרת יחידות';
$ec_lang['calc_inputs']='Inputs';
$ec_lang['calc_results']='תוצאות:';
$ec_lang['view_hide_line']='[Hide this line]';
$ec_lang['view_printable']='Printable version (reload/refresh to restore)';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Manning Pipe Flow';
$ec_lang['mpf_main_title']='Free Online Manning Pipe Flow Calculator';
$ec_lang['mpf_main_desc']='Manning Formula Uniform Pipe Flow at Given Slope and Depth';
$ec_lang['mpf_pipe_diameter']='קוטר הצינור';
$ec_lang['mpf_manningRoughness']='מקדם מאנינג';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../pressureslope.php">שיפוע התעלה (יתכן כי שווה לשיפוע הצינור)</a>';
$ec_lang['mpf_depth_ratio']='אחוז של (או היחס) עומק מלא (100% או 1 אם זרימה מלאה)';
$ec_lang['mpf_flow']='ספיקה';
$ec_lang['mpf_velocity']='מהירות';
$ec_lang['mpf_velocity_head']='עומד הידראולי';
$ec_lang['mpf_flow_area']='חתך הזרימה';
$ec_lang['mpf_wetted_perimeter']='ההיקף הרטוב';
$ec_lang['mpf_hydraulic_radius']='רדיוס הידראולי';
$ec_lang['mpf_top_width']='רוחב פני הנוזל';
$ec_lang['mpf_froude_number']='מספר פראוד';
$ec_lang['mpf_shear_stress']='Average shear stress (tractive force), tau';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Manning Pipe Head Loss';
$ec_lang['mphl_main_title']='Free Online Manning Pipe Head Loss Calculator';
$ec_lang['mphl_main_desc']='Manning Formula Head Loss at Given Full Flow';
$ec_lang['mphl_pipe_length']='אורך הצינור,l';
$ec_lang['mphl_total_junction_k']='חישוב סך כל מקדמי ההפסדים בצומת, k';
$ec_lang['mphl_friction_loss']='הפסד חיכוך';
$ec_lang['mphl_junction_loss']='הפסד בצומת';
$ec_lang['mphl_total_loss'] = 'סהכ הפסד';
$ec_lang['mphl_egl_1']='Downstream EGL';
$ec_lang['mphl_egl_2']='Upstream EGL';
$ec_lang['mphl_hgl_2']='Upstream HGL in pipe ' . $ec_lang['mpf_see_notes'];
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Manning Trapezoidal Channel';
$ec_lang['mtc_main_title']='Free Online Manning Formula Trapezoidal Channel Calculator';
$ec_lang['mtc_main_desc']='Manning Formula Uniform Trapezoidal Channel Flow at Given Slope and Depth';
$ec_lang['mtc_bottom_width']='Bottom width';
$ec_lang['mtc_side_slope_1']='צד השיפוע 1 (אופקי\אנכי)';
$ec_lang['mtc_side_slope_2']= 'צד השיפוע 2 (אופקי\אנכי)';
$ec_lang['mtc_channel_slope']='שיפוע התעלה';
$ec_lang['mtc_flow_depth']='עומק הספיקה';
$ec_lang['mtc_d50_bottom']='<span title="per Isbash (1936), Robinson, and Maricopa County, Arizona, US">Required bottom angular riprap size, D50, Maricopa County</span>';
$ec_lang['mtc_d50_mra']='Required angular riprap size, D50, per Maynord, Ruff, and Abt (1989)';
$ec_lang['mtc_d50_searcy']='Required angular riprap size, D50, per Searcy (1967)';
$ec_lang['mtc_d50_strickler']='<span title="per Strickler (Adjust n so this equals your design lining size)">Implied riprap size based on n</span>';
$ec_lang['mtc_d50_z1']='<span title="per Isbash (1936), Robinson, and Maricopa County, Arizona, US">Required side slope 1 angular riprap size, D50, Maricopa County</span>';
$ec_lang['mtc_d50_z2']='<span title="per Isbash (1936), Robinson, and Maricopa County, Arizona, US">Required side slope 2 angular riprap size, D50, Maricopa County</span>';