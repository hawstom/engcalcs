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
// Orifice Flow
$ec_lang['or_main_menu']='זרימה דרך פתח';
$ec_lang['or_main_title']='מחשבון זרימה דרך פתח - חינם';
$ec_lang['or_main_desc']='זרימה דרך פתח — חופשית או טבועה';
$ec_lang['or_shape']='צורת הפתח';
$ec_lang['or_shape_circular']='עגול';
$ec_lang['or_shape_rectangular']='מלבני';
$ec_lang['or_diameter']='קוטר (עגול) או גובה (מלבני), D';
$ec_lang['or_width']='רוחב, W (מלבני בלבד)';
$ec_lang['or_invert']='גובה תחתית הפתח';
$ec_lang['or_hwe']='גובה מפלס מים עליון';
$ec_lang['or_twe']='גובה מפלס מים תחתון';
$ec_lang['or_cd']='מקדם הספיקה, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='גובה הצנטרואיד';
$ec_lang['or_head']='עומק יעיל, h';
$ec_lang['or_area']='שטח הפתח, A';
$ec_lang['or_flow']='ספיקה, Q';
$ec_lang['or_regime']='בדיקת משטר הזרימה';
$ec_lang['or_regime_valid']='זרימה חופשית — משטר פתח תקין ✓';
$ec_lang['or_regime_submerged']='פתח טבוע (TWE מעל לתחתית) — תקין ✓';
$ec_lang['or_regime_warn']='אזהרה: מפלס עליון מתחת לגג הפתח — לא משטר פתח';
$ec_lang['or_regime_twe_above_hwe']='Warning: tailwater (TWE) above headwater (HWE) — check inputs';
$ec_lang['or_notes_1_term']='משוואת הפתח';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> &times; A &times; &radic;(2gh). זרימה חופשית: h = HWE &minus; צנטרואיד. זרימה טבועה (TWE מעל לתחתית): h = HWE &minus; TWE.';
$ec_lang['or_notes_2_term']='משטר הפתח';
$ec_lang['or_notes_2_def']='משוואות זרימה דרך פתח חלות כאשר המפלס העליון גבוה מגג הפתח. כאשר המפלס נמוך מהגג, יש להשתמש במשוואת מפל.';
$ec_lang['or_notes_3_term']='מקדם הספיקה';
$ec_lang['or_notes_3_def']='C<sub>d</sub> נע בין 0.60 ל-0.65 לפתחים עם קצה חד. כניסות מעוגלות או שקועות מקבלות ערכים שונים. ראה <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venture-d_590.html">Engineering Toolbox</a> או מדריך הידרולוגיית HEC-RAS.';
$ec_lang['or_notes_4_term']='טביעה';
$ec_lang['or_notes_4_def']='כאשר TWE גבוה מתחתית הפתח, המחשבון מיישם אוטומטית את משוואת הפתח הטבוע עם h = HWE &minus; TWE. כאשר TWE שווה לתחתית הפתח או נמוך ממנה, מניחים זרימה חופשית ו-h = HWE &minus; צנטרואיד.';

// Orifice Drain Time
$ec_lang['odt_main_menu']="Orifice Drain Time";
$ec_lang['odt_main_title']="Free Online Orifice Drain Time Calculator";
$ec_lang['odt_main_desc']="Pond Orifice Drain Time &mdash; Conic Volume Method";
$ec_lang['odt_h1_elev']="Starting water surface elevation";
$ec_lang['odt_a1']="Full pond area, A1";
$ec_lang['odt_h2_elev']="Ending water surface elevation";
$ec_lang['odt_h_orifice']='Orifice centroid elevation';
$ec_lang['odt_a0']='Pond area at orifice elevation, A0';
$ec_lang['odt_a_ending']='Ending pond area, A2 (interpolated)';
$ec_lang['odt_d']="Orifice diameter (circular) or height (rectangular), D";
$ec_lang['odt_w']="Orifice width, W (rectangular only)";
$ec_lang['odt_t_sec']="Drain time (seconds)";
$ec_lang['odt_t_min']="Drain time (minutes)";
$ec_lang['odt_t_hr']="Drain time (hours)";
$ec_lang['odt_t_day']="Drain time (days)";
$ec_lang['odt_notes_1_term']="Formula";
$ec_lang['odt_notes_1_def']='t = &radic;H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> &radic;(2g)) &times; (2A<sub>x</sub>/5 + 8&radic;(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) gives drain time from head H to the orifice. Drain time = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) &minus; t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), where H<sub>1</sub> = starting elevation &minus; orifice elevation, H<sub>2</sub> = ending elevation &minus; orifice elevation.';
$ec_lang['odt_notes_2_term']="Method";
$ec_lang['odt_notes_2_def']='The conic volume method models the pond as a conic section between the starting area A<sub>1</sub> at the initial water surface and the area A<sub>0</sub> at the orifice centroid elevation. A<sub>2</sub>, the pond area at the ending elevation, is interpolated from A<sub>1</sub> and A<sub>0</sub> using the conic section model. Drain time from starting to ending elevation equals total drain time from H<sub>1</sub> to orifice minus remaining drain time from H<sub>2</sub> to orifice.';
