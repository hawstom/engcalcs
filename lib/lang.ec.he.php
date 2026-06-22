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
$ec_lang['u_acft']="ac-ft";
$ec_lang['u_ft3']="ft^3";
$ec_lang['u_m3']="m^3";
$ec_lang['u_kw']='kW';
$ec_lang['u_mw']='MW';
$ec_lang['u_hp']='hp';

// Page text
// In page order for easiest maintenance.
$ec_lang['menu_brand']='מחשבוני HawsEDC';
$ec_lang['menu_main_list']='רשימת המחשבונים';
$ec_lang['menu_main_hydraulics']='הידרוליקה';
$ec_lang['menu_main_language']='שפה';
$ec_lang['template_welcome']='&gt;&gt; השאירו את פחדיכם בדלת; כאן מדברים אהבה. נהנו גם מ<a href="https://hawsedc.com/download.php">כלי ה-AutoCAD החינמיים של HawsEDC.</a> &lt;&lt;';
$ec_lang['template_translation_help']='האם יש לך חזון נהדר למחשבון שיתווסף כאן?  האם אתה יכול לעזור לי לתרגם את המחשבון לשפה שלך או להטמיע את המחשבון באתר שלך?  ';
$ec_lang['template_feedback']='בבקשה תן לנו את חוות דעתך. האם המחשבון החינמי עלה על כל ציפיותיך?';
$ec_lang['template_printable_title']='אזור כותרת להדפסה';
$ec_lang['template_printable_subtitle']='אזור כותרת משנה להדפסה';
$ec_lang['index_title']='מחשבוני הנדסה חינמיים מקוונים';
$ec_lang['calc_set_units']='הגדרת יחידות';
$ec_lang['calc_inputs']='נתוני קלט';
$ec_lang['calc_results']='תוצאות:';
$ec_lang['view_hide_line']='[הסתר שורה זו]';
$ec_lang['view_printable']='גרסה להדפסה (טען מחדש לשחזור)';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='זרימה בצינור — Manning';
$ec_lang['mpf_main_title']='מחשבון זרימה בצינור לפי Manning — חינם מקוון';
$ec_lang['mpf_main_desc']='זרימה אחידה בצינור לפי נוסחת Manning בשיפוע ועומק נתונים';
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
$ec_lang['mpf_shear_stress']='מאמץ גזירה ממוצע (כוח גרר), tau';
$ec_lang['mpf_solve_for_dd0']='חשב y/d<sub>0</sub> עבור Q נתון';
$ec_lang['mpf_solve_desc']='תוך שימוש ב-D<sub>0</sub>, n ו-S<sub>0</sub> מטופס המחשבון, מוצא את ה-y/d<sub>0</sub> הנמוך ביותר עבור Q נתון.';
$ec_lang['mpf_solve_button']='חשב';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='אובדן גובה בצינור — Manning';
$ec_lang['mphl_main_title']='מחשבון אובדן גובה בצינור לפי Manning — חינם מקוון';
$ec_lang['mphl_main_desc']='אובדן גובה לפי נוסחת Manning בזרימה מלאה נתונה';
$ec_lang['mphl_pipe_length']='אורך הצינור,l';
$ec_lang['mphl_total_junction_k']='חישוב סך כל מקדמי ההפסדים בצומת, k';
$ec_lang['mphl_friction_loss']='הפסד חיכוך';
$ec_lang['mphl_junction_loss']='הפסד בצומת';
$ec_lang['mphl_total_loss'] = 'סהכ הפסד';
$ec_lang['mphl_egl_1']='EGL מורד';
$ec_lang['mphl_egl_2']='EGL מעלה';
$ec_lang['mphl_hgl_2']='Upstream HGL in pipe ' . $ec_lang['mpf_see_notes'];
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='תעלה טרפזואידית — Manning';
$ec_lang['mtc_main_title']='מחשבון תעלה טרפזואידית לפי נוסחת Manning — חינם מקוון';
$ec_lang['mtc_main_desc']='זרימה אחידה בתעלה טרפזואידית לפי נוסחת Manning בשיפוע ועומק נתונים';
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
$ec_lang['or_regime_twe_above_hwe']='אזהרה: מפלס מים תחתון (TWE) גבוה ממפלס מים עליון (HWE) — בדוק קלטים';
$ec_lang['or_notes_1_term']='משוואת הפתח';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> &times; A &times; &radic;(2gh). זרימה חופשית: h = HWE &minus; צנטרואיד. זרימה טבועה (TWE מעל לתחתית): h = HWE &minus; TWE.';
$ec_lang['or_notes_2_term']='משטר הפתח';
$ec_lang['or_notes_2_def']='משוואות זרימה דרך פתח חלות כאשר המפלס העליון גבוה מגג הפתח. כאשר המפלס נמוך מהגג, יש להשתמש במשוואת מפל.';
$ec_lang['or_notes_3_term']='מקדם הספיקה';
$ec_lang['or_notes_3_def']='C<sub>d</sub> נע בין 0.60 ל-0.65 לפתחים עם קצה חד. כניסות מעוגלות או שקועות מקבלות ערכים שונים. ראה <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venture-d_590.html">Engineering Toolbox</a> או מדריך הידרולוגיית HEC-RAS.';
$ec_lang['or_notes_4_term']='טביעה';
$ec_lang['or_notes_4_def']='כאשר TWE גבוה מתחתית הפתח, המחשבון מיישם אוטומטית את משוואת הפתח הטבוע עם h = HWE &minus; TWE. כאשר TWE שווה לתחתית הפתח או נמוך ממנה, מניחים זרימה חופשית ו-h = HWE &minus; צנטרואיד.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='זמן ריקון פתח';
$ec_lang['odt_main_title']='מחשבון זמן ריקון פתח — בריכה, אגן או מיכל — חינם מקוון';
$ec_lang['odt_main_desc']='זמן ריקון פתח בריכת איגום או אגן &mdash; שיטת נפח קוני';
$ec_lang['odt_h1_elev']='גובה מפלס מים התחלתי';
$ec_lang['odt_a1']='שטח בריכה או אגן התחלתי, A1';
$ec_lang['odt_h2_elev']='גובה מפלס מים סופי';
$ec_lang['odt_h_orifice']='גובה צנטרואיד הפתח';
$ec_lang['odt_a0']='שטח בריכה או אגן בגובה הפתח, A0';
$ec_lang['odt_a_ending']='שטח ריכוז סופי, A2 (אינטרפולציה)';
$ec_lang['odt_h2_check']='בדיקת גובה סופי';
$ec_lang['odt_h2_ok']='הגובה הסופי מעל לחלק העליון של הפתח ✓';
$ec_lang['odt_h2_warn']='אזהרה: הגובה הסופי שווה או נמוך מחלק עליון של הפתח (צנטרואיד + D/2)';
$ec_lang['odt_d']='קוטר הפתח (עגול) או גובה (מלבני), D';
$ec_lang['odt_w']='רוחב הפתח, W (מלבני בלבד)';
$ec_lang['odt_t_sec']='זמן ריקון (שניות)';
$ec_lang['odt_t_min']='זמן ריקון (דקות)';
$ec_lang['odt_t_hr']='זמן ריקון (שעות)';
$ec_lang['odt_t_day']='זמן ריקון (ימים)';
$ec_lang['odt_notes_1_term']='נוסחה';
$ec_lang['odt_notes_1_def']='t = &radic;H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> &radic;(2g)) &times; (2A<sub>x</sub>/5 + 8&radic;(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) נותן את זמן הריקון מגובה ראש H עד לפתח. זמן ריקון = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) &minus; t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), כאשר H<sub>1</sub> = גובה התחלתי &minus; גובה הפתח, H<sub>2</sub> = גובה סופי &minus; גובה הפתח.';
$ec_lang['odt_notes_2_term']='שיטה';
$ec_lang['odt_notes_2_def']='שיטת הנפח הקוני מדמה את הבריכה או האגן כחתך קוני בין שטח התחלתי A<sub>1</sub> במפלס המים הראשוני לבין שטח A<sub>0</sub> בגובה צנטרואיד הפתח. A<sub>2</sub>, שטח הבריכה בגובה הסופי, מחושב באינטרפולציה מ-A<sub>1</sub> ו-A<sub>0</sub> לפי מודל החתך הקוני. זמן הריקון מגובה התחלתי לסופי שווה לזמן הריקון הכולל מ-H<sub>1</sub> לפתח פחות זמן הריקון הנותר מ-H<sub>2</sub> לפתח.';
$ec_lang['odt_h1']='ראש התחלתי, H<sub>1</sub> (WSE &minus; צנטרואיד)';
$ec_lang['odt_q_max']='ספיקה מרבית (התחלתית), Q<sub>max</sub>';
$ec_lang['odt_vol']='נפח מרוקן';
$ec_lang['odt_sketch_start']='התחלה';
$ec_lang['odt_sketch_end']='סיום';
// Contact us.
$ec_lang['contact_title']='צור קשר עם HawsEDC';
$ec_lang['contactSendMessage']='שלח הודעה ל-Tom Haws';
$ec_lang['contactYourName']='שמך:';
$ec_lang['contactYourEmail']='כתובת הדוא"ל שלך:';
$ec_lang['contactSubject']='נושא:';
$ec_lang['contact_message']='הודעה:';
$ec_lang['contactSpamPrefix']='חמש ועוד אחת שווה';
$ec_lang['contactSpamPostfix']='(אנא כתוב במילים. 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='שלח הודעה';
// Darcy-Weisbach
$ec_lang['dw_main_menu']='אובדן גובה בצינור — Darcy-Weisbach';
$ec_lang['dw_main_title']='מחשבון אובדן גובה בצינור Darcy-Weisbach — חינם מקוון';
$ec_lang['dw_main_desc']='אובדן גובה בצינור Darcy-Weisbach בקוטר, גסות וספיקה נתונים';
$ec_lang['dw_roughness']='גסות מוחלטת Darcy-Weisbach, e';
$ec_lang['dw_kinematic_viscosity']='צמיגות קינמטית, v, ב-m<sup>2</sup>/sec (1E-6 למים נקיים בטמפרטורת חדר)';
$ec_lang['dw_reynolds_number']='מספר Reynolds, Re';
$ec_lang['dw_flow_regime']='משטר זרימה';
$ec_lang['dw_regime_laminar']='למינרי';
$ec_lang['dw_regime_transitional']='מעברי';
$ec_lang['dw_regime_turbulent']='טורבולנטי';
$ec_lang['dw_friction_factor_method']='שיטת מקדם החיכוך';
$ec_lang['dw_friction_factor']='מקדם חיכוך, f';
// Hazen-Williams
$ec_lang['hw_main_menu']='אובדן גובה בצינור — Hazen-Williams';
$ec_lang['hw_main_title']='מחשבון אובדן גובה בצינור Hazen-Williams — חינם מקוון';
$ec_lang['hw_main_desc']='אובדן גובה בצינור Hazen-Williams בקוטר, גסות וספיקה נתונים';
$ec_lang['hw_hgl_1']='HGL מורד';
$ec_lang['hw_hgl_2']='HGL מעלה';
$ec_lang['hw_roughness']='מקדם Hazen-Williams, C';
// Manning Irregular Channel
$ec_lang['mi_menu']='תעלה לא סדירה — Manning';
$ec_lang['mi_main_title']='מחשבון תעלה לא סדירה לפי Manning — חינם מקוון';
$ec_lang['mi_main_desc']='מחשבון זרימה אחידה בתעלה לא סדירה לפי Manning';
$ec_lang['mi_waterSurfaceElevation']='גובה מפלס המים';
$ec_lang['mi_q_617']='Q';
$ec_lang['mi_xSecPoints']='נקודות חתך רוחב';
$ec_lang['mi_groupPoint']='נקודה';
$ec_lang['mi_groupSegment']='קטע';
$ec_lang['mi_groupRegion']='אזור';
$ec_lang['mi_station']='תחנה';
$ec_lang['mi_elevation']='גובה';
$ec_lang['mi_d50in']='גודל<br />סלע<br />חיפוי<br />חציוני';
$ec_lang['mi_n']='n<br />לקטע';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />גבול<br />אזור<br />(גדה)';
$ec_lang['mi_tau']='מתח<br />גזירה<br />תחתון<br />&tau;';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='n<br />מורכב';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='H<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes']='הערות';
$ec_lang['mi_notes_1_term']='n מורכב';
$ec_lang['mi_notes_1_def']='מחשבון זה עוקב אחר המדריך ההתייחסות של HEC-RAS בחישוב n מורכב של אזור לפי Chow 1959, עמוד 136, משוואה 6-17 (לא 6-18).';
$ec_lang['mi_notes_2_term']='חיפוי סלע';
$ec_lang['mi_notes_2_def']='השתמש במחשבון תעלה טרפזואידית לפי Manning לתכנון חיפוי סלע. מחשבון זה מתאים יותר לחתכים טבעיים.';
// Manning Pipe Flow additional keys
$ec_lang['mpf_pipe_area']='שטח צינור, a0';
$ec_lang['mpf_area_ratio']='שטח יחסי, a/a0';
$ec_lang['mpf_full_flow']='זרימה מלאה, Q0';
$ec_lang['mpf_full_flow_ratio']='יחס לזרימה מלאה, Q/Q0';
$ec_lang['mpf_see_notes']='(ראה הערות)';
$ec_lang['mpf_spreadheet_notice']='עיין בגרסת הגיליון האלקטרוני של מחשבון זה';
$ec_lang['mpf_note_1']='<p>הערות:</p><dl><dt>זהו הזרימה והעומק בתוך צינור <em>ארוך אינסופית</em>.</dt><dd>כדי לקבל את הזרימה לתוך הצינור ייתכן שיידרש גובה מים עליון גבוה הרבה יותר. הוסף לפחות 1.5 פעמים ראש המהירות כדי לקבל את גובה המים העליון, או <a href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">ראה את המדריך הקצר שלי</a> לחישובי גובה מים עליון לתעלות ניקוז סטנדרטיות באמצעות HY-8.</dd>';
// Manning Pipe Head Loss additional keys
$ec_lang['mphl_area']='שטח, A';
$ec_lang['mphl_friction_slope']='שיפוע חיכוך';
$ec_lang['mphl_note_1']='<p>הערות:</p><dl><dt>עבור כניסה פתוחה (תעלת ניקוז), יש לבדוק תנאי שליטה בכניסה.</dt><dd>1. HGL המעלה אינו יכול להיות נמוך מגובה זרימה נורמלית במעלה (ולא נמוך מהצינור!).</dd><dd>2. גובה המים העליון של תעלת ניקוז מיוצג טוב יותר על ידי EGL המעלה מאשר HGL המעלה.</dd><dd>3. ראה <a href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">את המדריך הקצר שלי</a> לחישובי גובה מים עליון פשוטים לתעלות ניקוז סטנדרטיות באמצעות HY-8.</dd>';
// Manning Trapezoidal Channel additional keys
$ec_lang['mtc_bend_angle']='זווית כיפוף <a target="_blank" href="riprap-bend-angle.png" title="לחץ לתמונה">?</a> (לממדי ריפ-ראפ)';
$ec_lang['mtc_sgrock']='משקל סגולי של סלע (2.65)';
$ec_lang['mtc_d50_in']='גודל סלע עיצוב, D50';
$ec_lang['mtc_n_strickler']='n לגודל סלע עיצוב לפי Strickler';
$ec_lang['mtc_n_blodgett']='n לגודל סלע עיצוב לפי Blodgett';
$ec_lang['mtc_n_bathurst']='n לגודל סלע עיצוב לפי Bathurst';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett לעומת Bathurst';
$ec_lang['mtc_note_1']='<p>הערות:</p><dl><dt>איטרציה אוטומטית לתכנון גודל סלע וגסות</dt><dd>בחר לחצן בחירת גסות (BB מומלץ) ולחצן בחירת גודל סלע עיצוב (Isbash מומלץ). כוונן את העומק ומקדם הביטחון של גודל הסלע כדי לקבל את הזרימה הרצויה עם גודל סלע שלם. בכל שינוי ערך קלט מתרחשת מחזור איטרציה: 1. הגסות מחושבת מגודל סלע העיצוב. 2. חישוב הגסות המבוקש מועתק לגסות הקלט. 3. זרימת התעלה וגודל הסלע הנדרש מחושבים. 4. גודל סלע העיצוב מותאם. 5. חזרה עד שהשגיאה בגודל סלע העיצוב קטנה מאד.</dd><dt>מחשבון בסיסי (ללא איטרציה)</dt><dd>הכנס את ערך הגסות הרצוי. התעלם מאזור קלט גודל סלע העיצוב.</dd></dl>';
// Orifice Flow additional keys
$ec_lang['or_velocity']='מהירות בפתח, v';
// Points data
$ec_lang['points_data_copy']='העתק';
$ec_lang['points_data_paste']='הדבק';
$ec_lang['points_data_help']='(או העתק/הדבק באמצעות אזור הנתונים)';
$ec_lang['points_data_title']='נתוני נקודות<br />(מופרדות בפסיקים או טאבים)';
// Robinson Rock Chute
$ec_lang['rrc_main_menu']='מגלשת סלעים Robinson';
$ec_lang['rrc_main_desc']='גיליון עיצוב Robinson Rock Chute';
// Erosion Setback and Scour Calc.
$ec_lang['essc_btbw']='רוחב מגדה לגדה';
$ec_lang['essc_mcr']='רדיוס עיקול מינימלי';
$ec_lang['essc_q']='ספיקה, Q';
// Weir Flow Simple
$ec_lang['ws_main_menu']='זרימת מפל — פשוטה';
$ec_lang['ws_main_title']='מחשבון זרימת מפל עם כתר רחב פשוט — חינם מקוון';
$ec_lang['ws_main_desc']='מחשבון זרימת מפל עם כתר רחב פשוט';
$ec_lang['ws_weirLength']='אורך המפל, l';
$ec_lang['ws_headWaterHeight']='גובה מים עליונים, h';
$ec_lang['ws_weirCoefficient']='מקדם מפל, Cw';
$ec_lang['ws_notes_heading']='הערות';
$ec_lang['ws_notes_we_term']='משוואת המפל';
// Weir Flow Irregular
$ec_lang['wi_menu']='זרימת מפל — לא סדיר';
$ec_lang['wi_main_title']='מחשבון זרימת מפל לא סדיר עם עומק משתנה — חינם מקוון';
$ec_lang['wi_main_desc']='מחשבון זרימת מפל לא סדיר';
$ec_lang['wi_headWaterelevation']='גובה מפלס מים עליונים';
$ec_lang['wi_weirPoints']='נקודות מפל';
$ec_lang['wi_station']='תחנה<br />(מרחק)';
$ec_lang['wi_elevation']='גובה';
$ec_lang['wi_pondingHeight']='גובה הצטברות מים';
$ec_lang['wi_incrementalFlow']='ספיקה מצטברת חלקית';
$ec_lang['wi_cumulativeFlow']='ספיקה מצטברת כוללת';
$ec_lang['wi_save_and_calculate']='שמור וחשב';
$ec_lang['wi_notes_we_term']='משוואת המפל';
$ec_lang['wi_notes_we_def']='q = אם (אורך = 0) אז 0; אחרת אם (שיפוע=0) אז cw*length*d<sub>0</sub><sup>1.5</sup>; אחרת cw/(2.5*slope) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) כאשר d<sub>1</sub> ו-d<sub>0</sub> תמיד חיוביים או אפס';

// Micro-Hydro Power
$ec_lang['mhp_main_menu']='הידרו-כוח זעיר';
$ec_lang['mhp_main_title']='מחשבון הידרו-כוח זעיר חינמי מקוון';
$ec_lang['mhp_main_desc']='מחשבון הספק הידרו-כוח זעיר עם זרימה טבעית בנהר';
$ec_lang['mhp_flow']='ספיקה, Q';
$ec_lang['mhp_gross_head']='ראש ברוטו (הפרש גובה), H<sub>gross</sub>';
$ec_lang['mhp_head_loss']='אובדן ראש בצינור הלחץ, h<sub>L</sub>';
$ec_lang['mhp_efficiency']='יעילות המתקן, &eta; (0&ndash;1)';
$ec_lang['mhp_net_head']='ראש נטו, H<sub>net</sub>';
$ec_lang['mhp_power']='הספק, P';
$ec_lang['mhp_annual_kwh']='אנרגיה שנתית ב-100% קיבולת (kWh/שנה)';
$ec_lang['mhp_notes_1_term']='משוואת ההספק';
$ec_lang['mhp_notes_1_def']='P = &eta; &times; &rho; &times; g &times; Q &times; H<sub>net</sub>, כאשר &rho; = 1000 ק"ג/מ&sup3; (מים מתוקים) ו-g = 9.806 מ/ש&sup2;.';
$ec_lang['mhp_notes_2_term']='ראש נטו';
$ec_lang['mhp_notes_2_def']='ראש נטו = ראש ברוטו &minus; אובדן ראש בצינור הלחץ. אומדן ראשוני נפוץ הוא h<sub>L</sub> &asymp; 5% מ-H<sub>gross</sub>. השתמש ב<a href="Darcy-Weisbach.php">מחשבון Darcy-Weisbach</a> לאומדנים מדויקים יותר של אובדן הלחץ בצינור.';
$ec_lang['mhp_notes_3_term']='יעילות';
$ec_lang['mhp_notes_3_def']='יעילות מתקן טיפוסית &eta; נעה בין 0.70 ל-0.85 לטורבינות פלטון וזרם-צולב הנפוצות בהידרו-כוח זעיר. השתמש ב-0.75 כאומדן ראשוני שמרני.';
$ec_lang['mhp_notes_4_term']='אנרגיה שנתית';
$ec_lang['mhp_notes_4_def']='האנרגיה השנתית מניחה הפעלה רצופה בזרימה מלאה (8760 שעות/שנה). הייצור בפועל יהיה נמוך יותר בשל שינויי זרימה עונתיים, השבתות לתחזוקה ומקדם עומס.';
