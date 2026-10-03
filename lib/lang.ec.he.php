<?php

// All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='חלק';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/sec';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% עלייה/מרחק אופקי';
$ec_lang['u_grade']='עלייה/מרחק אופקי';
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
$ec_lang['u_bar']='בר';
$ec_lang['u_kgfcm2']='קג"כ/סמ"ר';
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
$ec_lang['menu_brand']='מחשבוני HawsEDC';
$ec_lang['menu_main_hydraulics']='הידרוליקה';
$ec_lang['menu_help']='עזרה';
$ec_lang['menu_libre']='תוכנה חופשית';
$ec_lang['template_welcome']='השאירו את פחדיכם בדלת; כאן מדברים אהבה. אתם לא הורסים הכול. נהנו גם מ<a target="_blank" href="https://hawsedc.com/download.php">כלי ה-AutoCAD החינמיים של HawsEDC.</a>';
$ec_lang['template_feedback']='האם תוכלו להציע ניסוח טוב יותר לטקסט שבעמוד הזה, או כל דבר אחר? רוצים לעזור, או ללמוד ליצור כלים כאלה? אנא צרו איתי קשר.';
$ec_lang['template_printable_title']='אזור כותרת להדפסה';
$ec_lang['template_printable_subtitle']='אזור כותרת משנה להדפסה';
// Consent banner and the two site documents behind it (ROADMAP Task 286). These are UI, not legal
// prose, and they are translated into all 26 languages for one reason: consent that the visitor
// cannot read is not consent. The long-form privacy notice and terms are a separate question --
// English-authoritative, and translated by a human later if at all.
// Edited by TGH 2026-09-07; the word "cookie" approved by TGH 2026-09-09.
// **IT SAYS "COOKIE" BECAUSE THAT IS THE WORD PEOPLE KNOW** (Tom, 2026-09-09, watching a
// first-time reader: *"We should use the word 'cookie'. 'May we save a one-digit cookie...?' That
// is the word people know."*). "One digit in this browser" was accurate and taught nobody what was
// being asked; a reader who has met a hundred cookie banners knows instantly what this one is
// about, and can then notice that this one is asking for far less than the others did.
//
// **AND IT IS STILL LITERALLY TRUE, which is the only reason the word is allowed here.** What is
// stored IS a cookie, and it holds one base-32 digit per page visited -- five bits, maximum 31.
// The arithmetic is in lib/config.inc.php beside the bits themselves. If that ever stops being one
// digit, this sentence is the thing that has to change first.
//
// NO EC_CONSENT_VERSION BUMP. Nothing about what is stored, who reads it or how long it lives has
// moved; the sentence became more accurate, not different. Bumping would re-ask every visitor who
// has already answered, for no change they could act on.
$ec_lang['consent_body']='האם נוכל לשמור עוגיית ספרה אחת בדפדפן זה כדי לזכור שכבר ספרנו עמוד זה? היא אינה רושמת דבר עליכם ולא דבר שאתם מקלידים. בלעדיה, לא נוכל להבחין בין הביקור השני שלכם לביקור הראשון של מישהו אחר.';
$ec_lang['consent_accept']='אשר בקשה זו';
$ec_lang['consent_accept_all']='אשר תמיד';
$ec_lang['consent_decline']='דחה תמיד';
$ec_lang['consent_current_granted']='אישרת זאת. אנו מגבילים את הרישום עבור פרופיל דפדפן זה.';
$ec_lang['consent_current_denied']='דחית זאת. איננו שומרים דבר כדי להגביל את הרישום עבור פרופיל דפדפן זה.';
$ec_lang['consent_region_label']='הבחירה שלכם לגבי הגבלת הרישום.';
$ec_lang['consent_settings_link']='הגדרות עוגיות';
$ec_lang['privacy_link']='הצהרת פרטיות';
$ec_lang['terms_link']='תנאי שימוש';
$ec_lang['index_main_title']='מחשבוני הנדסה חינמיים מקוונים';
$ec_lang['index_meta_desc_plain']='מחשבוני הנדסה הידראולית חינמיים לצינורות, תעלות, שפיכונים והשקיה. הם פועלים בדפדפן שלכם, עובדים גם ללא חיבור לאינטרנט, וזמינים ב-27 שפות.';
$ec_lang['calc_set_units']='הגדרת יחידות';
$ec_lang['calc_set_units_tip']='קובע את היחידה של כל השדות בבת אחת. לא הרסני: המספרים שהקלדתם נשארים בדיוק כפי שהם, וכל אחד מהם נקרא כעת ביחידה החדשה. 6 נשאר 6, אך כעת פירושו 6 אינץ׳ במקום 6 מילימטר.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='אפס לברירת מחדל';
$ec_lang['calc_defaults_confirm']='האם לאפס את המחשבון לערכי ברירת המחדל?';
$ec_lang['points_data_note']='(או העתק/הדבק באמצעות אזור הנתונים)';
$ec_lang['points_data_heading']='נתוני מחשבון<br />(השתמשו ב"העתק" כדי לראות את התבנית)';
$ec_lang['points_data_copy']='העתק';
$ec_lang['points_data_paste']='הדבק';
$ec_lang['calc_inputs']='נתוני קלט';
$ec_lang['calc_results']='תוצאות:';
$ec_lang['view_hide_line']='הסתר שורה זו';
$ec_lang['view_printable']='גרסה להדפסה (טען מחדש לשחזור)';
$ec_lang['ec_name_label']='שמור חישוב זה:';
$ec_lang['ec_name_placeholder']='שם';
$ec_lang['ec_name_tip']='שמירת הערכים האלה בכתובת עם סימניה, אחזור מהיסטוריה, ושיתוף';
$ec_lang['calc_copy_link']='העתק קישור';
$ec_lang['ec_related_calcs']='מחשבונים קשורים:';
$ec_lang['calc_copy_link_done']='הועתק!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='אובדן לחץ בצינור — Darcy-Weisbach';
$ec_lang['dw_main_title']='מחשבון אובדן לחץ בצינור Darcy-Weisbach — חינם מקוון';
$ec_lang['dw_main_desc']='אובדן לחץ בצינור Darcy-Weisbach בקוטר, גסות וספיקה נתונים';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='גובה חספוס מוחלט, e, של דופן הצינור. ערכים אופייניים: פלדה (חדשה) 0.046 מ״מ, פלדה (משומשת) 0.15 מ״מ, HDPE 0.003 מ״מ, PVC/uPVC 0.0015 מ״מ, בטון 0.3–3 מ״מ.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s למים נקיים ב-20°C">צמיגות קינמטית, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='צמיגות קינמטית, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s למים נקיים ב-20°C';
$ec_lang['dw_reynolds_number']='מספר Reynolds, Re';
$ec_lang['dw_flow_regime']='משטר זרימה';
$ec_lang['dw_regime_laminar']='למינרי';
$ec_lang['dw_regime_transitional']='מעברי';
$ec_lang['dw_regime_turbulent']='סוער';
$ec_lang['dw_friction_factor_method']='שיטת מקדם החיכוך';
$ec_lang['dw_friction_factor']='מקדם חיכוך, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='אובדן לחץ בצינור — Hazen-Williams';
$ec_lang['hw_main_title']='מחשבון אובדן לחץ בצינור Hazen-Williams — חינם מקוון';
$ec_lang['hw_main_desc']='אובדן לחץ בצינור Hazen-Williams בקוטר, גסות וספיקה נתונים';
$ec_lang['hw_hgl_1']='HGL מורד';
$ec_lang['hw_hgl_2']='HGL מעלה';
$ec_lang['hw_elev_up']='גובה מעלה';
$ec_lang['hw_pressure_up']='לחץ מעלה';
$ec_lang['hw_elev_down']='גובה מורד';
$ec_lang['hw_pressure_down']='לחץ מורד';
$ec_lang['hw_pressure_check']='בדיקת לחץ';
$ec_lang['hw_pressure_ok_short']='לחץ חיובי';
$ec_lang['hw_pressure_neg_short']='לחץ שלילי';
$ec_lang['hw_pressure_neg']='לחץ המורד נמוך מאפס. קו גובה המים (HGL) יורד מתחת לצינור, כך שהצינור לא יזרום מלא, וייתכן שתוצאה זו אינה תקפה.';
$ec_lang['hw_roughness']='מקדם Hazen-Williams, C';
$ec_lang['hw_note_1']='<dl><dt>מחשבון זה אינו מדמה את פרופיל הצינור בין שני הקצוות.</dt><dd>הוא משתמש רק בגבהים במעלה ובמורד שהזנת. אם הקרקע עולה גבוה יותר משני הקצוות באמצע המסלול, הלחץ באותה נקודה גבוהה נמוך מכל לחץ המדווח כאן. הפעל את המחשבון שוב עבור האורך מהקצה במעלה ועד לנקודה הגבוהה כדי לבדוק זאת.</dd><dd>במקום שבו קו גובה המים (HGL) יורד מתחת לצינור, המים נמצאים בלחץ שלילי. אוויר משתחרר מהתמיסה, צינור דק-דופן עלול לקרוס, ומי תהום מזוהמים עלולים להישאב פנימה דרך המפרקים. שמור על לחץ חיובי לאורך כל הקו, ושקול התקנת שסתום אוויר בכל נקודה גבוהה.</dd><dt>לחץ המעלה הוא תנאי גבול שאתה מספק.</dt><dd>קרא אותו ממד לחץ, ממפלס המים במיכל (גובה המים מעל הצינור), או מעקומת משאבה. משאבה מספקת לחץ נמוך יותר ככל שהספיקה עולה, לכן השתמש בנקודה על העקומה המתאימה לספיקה שהוזנה למעלה.</dd><dt>סכם בעצמך את מקדמי ההפסד המקומי.</dt><dd>סכם את ערכי ה-K עבור כל שסתום, עיקול, מסתעף, מד ספיקה וכניסה בקו, והזן את הסכום. עקוב אחר הקישור בשדה זה לערכים טיפוסיים. בקו הולכה ראשי וארוך הפסדים אלה קטנים לעומת החיכוך, אך בצנרת קצרה בתחנה הם עשויים להוות את רוב ההפסד.</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='תעלה בעלת חתך לא סדיר — Manning';
$ec_lang['mi_main_title']='מחשבון תעלה בעלת חתך לא סדיר לפי Manning — חינם מקוון';
$ec_lang['mi_main_desc']='זרימה אחידה בתעלה בעלת חתך לא סדיר לפי נוסחת Manning';
$ec_lang['mi_waterSurfaceElevation']='גובה מפלס המים';
$ec_lang['mi_q_617']='<span class="ec-help" title="הספיקה המורכבת, Q, המחושבת באמצעות מקדם n מורכב לכל אזור, בהתאם למשוואה 6-17 של Chow (בהנחת מהירויות שוות)">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='נקודות חתך רוחב';
$ec_lang['mi_groupPoint']='נקודה';
$ec_lang['mi_groupSegment']='קטע';
$ec_lang['mi_groupRegion']='אזור';
$ec_lang['mi_station']='פיקטה';
$ec_lang['mi_elevation']='גובה';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />גבול<br />בין אזורים<br />(גדה)';
$ec_lang['mi_tau']='מאמץ<br />גזירה<br />תחתון<br />τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='n<br />מורכב';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='n מורכב';
$ec_lang['mi_notes_1_def']='מחשבון זה פועל לפי מדריך העיון (Reference Manual) של HEC-RAS בחישוב n מורכב לכל אזור, בהתאם ל-Chow 1959, עמוד 136, משוואה 6-17 (ולא 6-18).';


$ec_lang['mi_notes_2_term']='חיפוי סלע';
$ec_lang['mi_notes_2_def']='לתכנון חיפוי סלע יש להשתמש במחשבון תעלה טרפזואידית לפי Manning. מחשבון זה (תעלה בעלת חתך לא סדיר) מתאים יותר לחתכים טבעיים.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='זרימה בצינור — Manning';
$ec_lang['mpf_main_title']='מחשבון זרימה בצינור לפי Manning — חינם מקוון';
$ec_lang['mpf_main_desc']='זרימה אחידה בצינור לפי נוסחת Manning בשיפוע ועומק נתונים';
$ec_lang['mpf_pipe_diameter']='קוטר הצינור, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='מקדם החספוס של Manning, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">שיפוע חיכוך, S<sub>f</sub></a><span class="ec-help" title="לעתים שווה לשיפוע הצינור. עקוב אחר הקישור להסבר (באנגלית בלבד)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='עומק זרימה יחסי, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='ספיקה, Q';
$ec_lang['mpf_flow_tip']='הזרימה והעומק מחושבים עבור צינור ארוך אינסופית. כדי להכניס זרימה זו בפועל לצינור, ייתכן שיידרש עומק מים גבוה יותר במעלה הזרם. ראו הערות למטה לפרטים ולסרטון הדרכה.';
$ec_lang['mpf_velocity']='מהירות, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="אנרגיה קינטית כגובה עמוד מים, v²/2g">עומד מהירות, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='שטח זרימה, A';
$ec_lang['mpf_pipe_area']='שטח הצינור, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='שטח יחסי, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='היקף רטוב, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='רדיוס הידראולי, R<sub>h</sub>';
$ec_lang['mpf_top_width']='רוחב פני הנוזל, T';
$ec_lang['mpf_froude_number']='מספר Froude, Fr';
$ec_lang['mpf_shear_stress']='מאמץ גזירה ממוצע, τ';
$ec_lang['mpf_full_flow']='זרימה מלאה, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='יחס לזרימה מלאה, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>זהו הזרימה והעומק בתוך צינור <em>ארוך אינסופית</em>.</dt><dd>כדי לקבל את הזרימה לתוך הצינור ייתכן שיידרש גובה מים עליון גבוה הרבה יותר. הוסף לפחות 1.5 פעמים עומד המהירות כדי לקבל את גובה המים העליון, או <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">ראה את המדריך הקצר שלי</a> לחישובי גובה מים עליון לתעלות ניקוז סטנדרטיות באמצעות <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, תוכנת תעלות הניקוז החינמית של מנהל הדרכים הפדרלי של ארצות הברית.</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>מתכננים ביוב סניטרי?</dt><dd>ראה את <a target="_blank" href="/sewslope.php">טבלאות השיפוע המינימלי לביוב</a> עבור צינורות בקוטר 4 עד 96 אינץ׳ (100 עד 2400 מ״מ), נתונות במ׳/מ׳, מ״מ/מ׳ ובאחוזים, ואת מחקר <a target="_blank" href="/peakfact.php">מקדמי השיא לספיקות נמוכות מאוד</a>. שני המסמכים הם מסמכי עזר באנגלית בלבד.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='הזן ערך Q יעד חיובי.';
$ec_lang['mpf_solver_no_solution']='אין פתרון: Q עולה על קיבולת הצינור ב-y/d0 = 93.8% (Qmax = {qmax} ביחידות הנבחרות).';
$ec_lang['mpf_solve_btn']='חשב';
$ec_lang['mpf_solve_for_flow']='עבור ספיקה, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='אובדן לחץ בצינור — Manning';
$ec_lang['mphl_main_title']='מחשבון אובדן לחץ בצינור לפי Manning — חינם מקוון';
$ec_lang['mphl_main_desc']='אובדן לחץ לפי נוסחת Manning בזרימה מלאה נתונה';
$ec_lang['mphl_pipe_length']='אורך, L';
$ec_lang['mphl_area']='שטח, A';
$ec_lang['mphl_total_junction_k']='מקדם הפסד מקומי, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='מקדם הפסד, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='מקדם הפסד מקומי, km. הפסדים אלו מתרחשים בצמתי צנרת, בכניסות, ביציאות, בעיקולים ובשסתומים — המונח "משני" מקובל אך עלול להטעות; בקו קצר הם יכולים להשתוות להפסדי החיכוך או לעלות עליהם. ערכי k אופייניים: כניסת יניקה חדה 0.5, כל עיקול של 45° 0.2–0.3, שסתום שער (פתוח לגמרי) 0.1, שסתום פרפר 0.2, יציאה (למאגר או לאטמוספרה) 1.0. יש לסכם את כל האביזרים לקבלת km הכולל. ברירת המחדל 2.0 מניחה כניסה אחת, יציאה אחת ושני עיקולים של 45°.';
$ec_lang['mphl_friction_slope']='שיפוע חיכוך';
$ec_lang['mphl_friction_loss']='הפסד חיכוך, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='הפסד מקומי, h<sub>m</sub>';
$ec_lang['mphl_total_loss'] = 'הפסד כולל, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='EGL מורד';
$ec_lang['mphl_egl_2']='EGL מעלה';
$ec_lang['mphl_hgl_egl_tip']='תוצאה זו עלולה שלא להיות תקפה במקום שבו הצינור עולה מעל קו גובה המים (HGL).';
$ec_lang['mphl_note_1']='<dl><dt>מחשבון זה אינו מדמה את פרופיל הצינור בין שני הקצוות.</dt><dd>אם קו גובה המים (HGL) יורד מתחת לחלק העליון של הצינור בנקודה כלשהי, ייתכן שחישוב זה אינו תקף.</dd><dt>עבור כניסה פתוחה (תעלת ניקוז), יש לבדוק תנאי שליטה בכניסה.</dt><dd>1. HGL המעלה אינו יכול להיות נמוך מגובה זרימה נורמלית במעלה (ולא נמוך מהצינור!).</dd><dd>2. גובה המים העליון של תעלת ניקוז מיוצג טוב יותר על ידי EGL המעלה מאשר HGL המעלה.</dd><dd>3. ראה <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">את המדריך הקצר שלי</a> לחישובי גובה מים עליון פשוטים לתעלות ניקוז סטנדרטיות באמצעות <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, תוכנת תעלות הניקוז החינמית של מנהל הדרכים הפדרלי של ארצות הברית.</dd><dd>4. עמוד זה פותר רק את מקרה שליטת היציאה: צינור הזורם מלא, כאשר תנאי המורד קובעים את גובה המים. תכנון תעלת ניקוז כרוך בהחלטה האם שליטת הכניסה או שליטת היציאה קובעת, ולכן יש להשתמש ב-HY-8 בכל מקרה שבו אחת מהן עשויה לחול.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='תעלה טרפזואידית — Manning';
$ec_lang['mtc_main_title']='מחשבון תעלה טרפזואידית לפי נוסחת Manning — חינם מקוון';
$ec_lang['mtc_main_desc']='זרימה אחידה בתעלה טרפזואידית לפי נוסחת Manning בשיפוע ועומק נתונים';
$ec_lang['mtc_bottom_width']='רוחב קרקעית, b';
$ec_lang['mtc_side_slope_1']='שיפוע צד 1, z<sub>1</sub> (אופקי/אנכי)';
$ec_lang['mtc_side_slope_2']= 'שיפוע צד 2, z<sub>2</sub> (אופקי/אנכי)';
$ec_lang['mtc_channel_slope']='שיפוע התעלה, S';
$ec_lang['mtc_flow_depth']='עומק הזרימה, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">זווית כיפוף, β</a><span class="ec-help" title="לממדי שכבת הסלע. עקוב אחר הקישור לתרשים."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="צפיפות יחסית למים. ערך אופייני ≈ 2.65 עבור סלע מרוסק.">משקל סגולי של הסלע, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='גודל סלע התכן, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n מגודל סלע התכן (שיטת Strickler)';
$ec_lang['mtc_n_blodgett']='n מגודל סלע התכן (שיטת Blodgett)';
$ec_lang['mtc_n_bathurst']='n מגודל סלע התכן (שיטת Bathurst)';
$ec_lang['mtc_n_pi']='n מגודל סלע התכן (שיטת Phillips & Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett לעומת Bathurst';
$ec_lang['mtc_pi_range_check']='בדיקת טווח P&I';
$ec_lang['mtc_pi_ok']='d50 בטווח P&I';
$ec_lang['mtc_pi_ok_tip']='0.28–0.36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='מחוץ לטווח';
$ec_lang['mtc_pi_tip']='אקסטרפולציה מחוץ לטווח הנתונים 0.28–0.36 ft שממנו פותחה המשוואה — יש להתייחס לכך כבדיקת עזר גסה, לא כבסיס לתכנון';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="לפי Isbash (1936) ו-Maricopa County, אריזונה, ארה״ב">גודל סלע זוויתי נדרש לקרקעית, D<sub>50</sub> (Isbash ו-MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="לפי Isbash (1936) ו-Maricopa County, אריזונה, ארה״ב">גודל סלע זוויתי נדרש לשיפוע צד 1, D<sub>50</sub> (Isbash ו-MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="לפי Isbash (1936) ו-Maricopa County, אריזונה, ארה״ב">גודל סלע זוויתי נדרש לשיפוע צד 2, D<sub>50</sub> (Isbash ו-MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="לפי Maynord, Ruff ו-Abt (1989). בעיקול, גודל הסלע נקבע למהירות עיקול של 4/3 מהממוצע, לפי California Division of Highways (1970); הערך המקורי 1.5 של Maynord חל על ערוצים טבעיים.">גודל סלע זוויתי נדרש, D<sub>50</sub> (Maynord, Ruff ו-Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='גודל סלע זוויתי נדרש, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='המהירות סבירה בהתאם להנחות הזרימה האחידה.';
$ec_lang['mtc_vel_low']='מהירות נמוכה; קיים סיכון להשקעת סחף.';
$ec_lang['mtc_vel_high']='המהירות גבוהה ועשויה שלא להיות מציאותית; בדקו סחיפה של חיפוי התעלה, עומק נוסף בעקומות ואיבוד אנרגיה במעברי הרחבה או במכשולים.';
$ec_lang['mtc_iteration_tip']='בחרו אפשרות גסות (מומלץ Blodgett–Bathurst) ואפשרות גודל סלע (מומלץ Isbash) כדי לבצע איטרציה אוטומטית לגודל סלע אחיד עבור הזרימה הרצויה. ראו הערות למטה לשיטה המלאה, או הזינו ערך גסות משלכם (עקוב אחר הקישור להנחיה) והתעלמו משדה גודל הסלע כדי לדלג על האיטרציה.';
$ec_lang['mtc_note_1']='<dl><dt>איטרציה אוטומטית לתכנון גודל סלע וגסות</dt><dd>בחר אפשרות גסות (מומלץ Blodgett–Bathurst) ואפשרות גודל סלע תכן (מומלץ Isbash). כוונן את העומק ואת מקדם הביטחון של גודל הסלע כדי להגיע לזרימה הרצויה עם גודל סלע אחיד. בכל שינוי של ערך קלט חוזר המחשבון על השלבים הבאים: 1. הגסות מחושבת מתוך גודל סלע התכן. 2. הגסות המחושבת מועתקת לשדה הגסות הנקלטת. 3. זרימת התעלה וגודל הסלע הנדרש מחושבים. 4. גודל סלע התכן מותאם בהתאם. 5. התהליך חוזר על עצמו עד שהשגיאה בגודל סלע התכן קטנה מאוד.</dd><dt>מחשבון בסיסי (ללא איטרציה)</dt><dd>הזן את ערך הגסות הרצוי. התעלם משדה קלט גודל סלע התכן.</dd></dl>';
$ec_lang['mtc_note_2_term']='בדיקת מהירות';
$ec_lang['mtc_note_2_def']='מהירות גבוהה מעידה על ירידת גובה משמעותית שיצרה אנרגיה סגולית גבוהה כל כך. אנרגיה זו עלולה להתבזבז במהירות במעברי הרחבה, בעקומות או במכשולים. יש לוודא שהדבר סביר עבור האתר.';
$ec_lang['mtc_solver_no_solution']='לא נמצא פתרון עבור ה-Q הנתון עם קלטי התעלה הללו.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='זרימת שפיכון פשוט';
$ec_lang['ws_main_title']='מחשבון זרימת שפיכון רחב-כתר פשוט — חינם מקוון';
$ec_lang['ws_main_desc']='מחשבון זרימת שפיכון רחב-כתר פשוט';
$ec_lang['ws_weirLength']='אורך השפיכון, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="אנרגיה ליחידת משקל של המים — גובה עמוד המים, ולא לחץ">עומק, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='מקדם השפיכון, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='הערות';
$ec_lang['ws_notes_we_term']='משוואת השפיכון';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='זרימת שפיכון בעל כתר לא אחיד';
$ec_lang['wi_main_title']='מחשבון זרימת שפיכון מקוטע בעל עומק משתנה וכתר לא אחיד — חינם מקוון';
$ec_lang['wi_main_desc']='מחשבון זרימת שפיכון בעל כתר לא אחיד';
$ec_lang['wi_weirPoints']='נקודות השפיכון';
$ec_lang['wi_pondingHeight']='גובה הצטברות מים';
$ec_lang['wi_incrementalFlow']='ספיקה תוספתית';
$ec_lang['wi_cumulativeFlow']='ספיקה מצטברת';
$ec_lang['wi_notes_we_def']='q = אם (אורך = 0) אז 0; אחרת אם (שיפוע=0) אז cw*length*d<sub>0</sub><sup>1.5</sup>; אחרת cw/(2.5*slope) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) כאשר d<sub>1</sub> ו-d<sub>0</sub> תמיד חיוביים או אפס';
// Orifice Flow
$ec_lang['or_main_menu']='זרימה דרך פתח';
$ec_lang['or_main_title']='מחשבון זרימה דרך פתח — חינם מקוון';
$ec_lang['or_main_desc']='זרימה דרך פתח — חופשית או טבועה';
$ec_lang['or_shape_circular']='עגול';
$ec_lang['or_shape_rectangular']='מלבני';
$ec_lang['or_diameter']='<span class="ec-help" title="קוטר לצורה עגולה; גובה לצורה מלבנית">קוטר או גובה, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="פתחים מלבניים בלבד">רוחב, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="תחתית הפתח">גובה תחתית הפתח <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='גובה מפלס מים עליון';
$ec_lang['or_twe']='גובה מפלס מים תחתון';
$ec_lang['or_cd']='מקדם הספיקה, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='גובה הצנטרואיד';
$ec_lang['or_head']='<span class="ec-help" title="אנרגיה ליחידת משקל של המים — גובה עמוד המים, ולא לחץ">עומק יעיל, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='שטח הפתח, A';
$ec_lang['or_regime']='בדיקת משטר הפתח';
$ec_lang['or_regime_valid']='זרימה חופשית';
$ec_lang['or_regime_submerged']='פתח טבוע';
$ec_lang['or_regime_submerged_tip']='TWE מעל לצנטרואיד — משטר הפתח עדיין תקף';
$ec_lang['or_regime_warn']='מחוץ למשטר הפתח';
$ec_lang['or_regime_warn_tip']='מפלס עליון מתחת לגג הפתח';
$ec_lang['or_regime_twe_above_hwe']='בדוק קלטים';
$ec_lang['or_regime_twe_above_hwe_tip']='מפלס מים תחתון (TWE) גבוה ממפלס מים עליון (HWE)';
$ec_lang['or_notes_1_term']='משוואת הפתח';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). זרימה חופשית: h = HWE − צנטרואיד. זרימה טבועה (TWE מעל לתחתית): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='משטר הפתח';
$ec_lang['or_notes_2_def']='משוואות זרימה דרך פתח חלות כאשר המפלס העליון גבוה מגג הפתח. כאשר המפלס נמוך מהגג, יש להשתמש במשוואת השפיכון.';
$ec_lang['or_notes_3_term']='מקדם הספיקה';
$ec_lang['or_notes_3_def']='C<sub>d</sub> נע בין 0.60 ל-0.65 לפתחים עם קצה חד. כניסות מעוגלות או שקועות מקבלות ערכים שונים. ראה <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> או מדריך העיון ההידראולי של HEC-RAS.';
$ec_lang['or_notes_4_term']='טביעה';
$ec_lang['or_notes_4_def']='כאשר TWE גבוה מתחתית הפתח, המחשבון מיישם אוטומטית את משוואת הפתח הטבוע עם h = HWE − TWE. כאשר TWE שווה לתחתית הפתח או נמוך ממנה, מניחים זרימה חופשית ו-h = HWE − צנטרואיד.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='הידרו-כוח זעיר';
$ec_lang['mhp_main_title']='מחשבון הידרו-כוח זעיר חינמי מקוון';
$ec_lang['mhp_main_desc']='מחשבון הספק הידרו-כוח זעיר עם זרימה טבעית בנהר';
$ec_lang['mhp_gross_head']='גובה ברוטו, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="קוטר צינור הלחץ (צינור אספקה)">קוטר צינור הלחץ, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='אורך, L';
$ec_lang['mhp_efficiency']='יעילות מתקן, η (0–1)';
$ec_lang['mhp_vel_check']='בדיקת מהירות';
$ec_lang['mhp_hl_check']='בדיקת אובדן לחץ';
$ec_lang['mhp_hnet']='גובה נטו, H<sub>net</sub>';
$ec_lang['mhp_power']='הספק יציאה, P';
$ec_lang['mhp_annual_kwh']='P כאנרגיה שנתית';
$ec_lang['mhp_vel_low']='מהירות נמוכה — סיכון של שקוע משקעים וסחיפת אוויר.';
$ec_lang['mhp_vel_high']='מהירות גבוהה — בדקו הפסדי מעברים, אנרגיה זמינה ופטיש מים.';
$ec_lang['mhp_vel_ok_short']='בסדר';
$ec_lang['mhp_vel_high_short']='גבוה';
$ec_lang['mhp_vel_low_short']='נמוך';
$ec_lang['mhp_vel_ok_tip']='המהירות בטווח היעיל לתכנון צינור הלחץ.';
$ec_lang['mhp_hl_ok_tip']='אובדן הלחץ נמוך מ-10% מהגובה הברוטו. גודל צינור זה כלכלי.';
$ec_lang['mhp_hl_warn_tip']='אובדן הלחץ עולה על 10% מהגובה הברוטו. שקלו צינור גדול יותר.';
$ec_lang['mhp_hl_bad_tip']='אובדן הלחץ עולה על 20% מהגובה הברוטו. שנו את גודל הצינור.';
$ec_lang['mhp_notes_1_term']='אובדן לחץ';
$ec_lang['mhp_notes_1_def']='סך אובדן צינור הלחץ h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, כאשר h<sub>f</sub> = f(L/D)(v²/2g) הוא אובדן חיכוך לפי דארסי-ויסבאך ו-h<sub>m</sub> = k<sub>m</sub>·v²/2g מכסה כניסה, עקומות ושסתומים. גובה נטו H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='מהירות';
$ec_lang['mhp_notes_2_def']='ודאו שהמהירות סבירה ביחס לגובה הזמין ולעלות הצינור. מהירות נמוכה מאוד עשויה להצביע על צינור גדול מדי; מהירות גבוהה מאוד עלולה להגביר אובדני חיכוך וסיכון לפגיעת פטיש מים.';
$ec_lang['mhp_notes_3_term']='יעד אובדן לחץ';
$ec_lang['mhp_notes_3_def']='אובדן בצינור האספקה (penstock) מתחת ל-10% מהגובה הברוטו הוא בדרך כלל כלכלי. האיזון האופטימלי בין עלות הצינור להספק שאבד נמצא לרוב סביב 4–6% במקומות שבהם מחיר החשמל גבוה.';
$ec_lang['mhp_notes_6_term']='יעילות';
$ec_lang['mhp_notes_6_def']='יעילות המתקן האופיינית η נעה בין 0.70 ל-0.85 לטורבינות Pelton ורוחב-זרימה הנפוצות בהידרו-כוח זעיר. השתמשו ב-0.75 כאומדן ראשוני שמרני.';
$ec_lang['mhp_notes_7_term']='אנרגיה שנתית';
$ec_lang['mhp_notes_7_def']='האנרגיה השנתית מניחה פעולה מתמשכת בזרימה מלאה (8760 שעות לשנה). התפוקה בפועל תהיה נמוכה יותר בשל שינויי זרימה עונתיים, זמן השבתה לתחזוקה ומקדם עומס.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='זמן ריקון בריכה ומיכל';
$ec_lang['odt_main_title']='מחשבון חינם מקוון לזמן ריקון בריכה, אגן ומיכל (פתח)';
$ec_lang['odt_main_desc']='זמן ריקון בריכה, אגן או מיכל — יציאה דרך פתח, שיטת נפח קוני';
$ec_lang['odt_h1_elev']='גובה מפלס המים ההתחלתי';
$ec_lang['odt_a1']='שטח התחלתי, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='גובה מפלס המים הסופי';
$ec_lang['odt_a0']='שטח בגובה הפתח, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="מחושב באינטרפולציה ממודל חתך קוני בגובה הסופי">שטח סופי, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='בדיקת גובה סופי';
$ec_lang['odt_h2_ok']='הגובה הסופי מעל לגג הפתח';
$ec_lang['odt_h2_warn']='הגובה הסופי שווה לגג הפתח או נמוך ממנו';
$ec_lang['odt_h2_warn_tip']='גג הפתח = צנטרואיד + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="קוטר (עגול) או גובה (מלבני)">קוטר פתח D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="מלבני בלבד">רוחב פתח, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='זמן ריקון (s)';
$ec_lang['odt_t_min']='זמן ריקון (min)';
$ec_lang['odt_t_hr']='זמן ריקון (hr)';
$ec_lang['odt_t_day']='זמן ריקון (days)';
$ec_lang['odt_notes_1_term']='נוסחה';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) נותן את זמן הריקון מגובה ראש H עד לפתח. זמן ריקון = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), כאשר H<sub>1</sub> = גובה התחלתי − גובה הפתח, H<sub>2</sub> = גובה סופי − גובה הפתח.';
$ec_lang['odt_notes_2_term']='שיטה';
$ec_lang['odt_notes_2_def']='שיטת הנפח הקוני מדמה את הבריכה או האגן כחתך קוני בין שטח התחלתי A<sub>1</sub> במפלס המים הראשוני לבין שטח A<sub>0</sub> בגובה צנטרואיד הפתח. A<sub>2</sub>, שטח הבריכה בגובה הסופי, מחושב באינטרפולציה מ-A<sub>1</sub> ו-A<sub>0</sub> לפי מודל החתך הקוני. זמן הריקון מגובה התחלתי לסופי שווה לזמן הריקון הכולל מ-H<sub>1</sub> לפתח פחות זמן הריקון הנותר מ-H<sub>2</sub> לפתח.';
$ec_lang['odt_h1']='<span class="ec-help" title="גובה מפלס המים ההתחלתי פחות גובה צנטרואיד הפתח">עומק התחלתי, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='זרימה מקסימלית, Q<sub>max</sub>';
$ec_lang['odt_vol']='נפח מרוקן';
$ec_lang['odt_sketch_start']='התחלה';
$ec_lang['odt_sketch_end']='סיום';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='מרווח מטפטפים, S<sub>e</sub>';
$ec_lang['ip_sl']='מרווח שלוחות, S<sub>l</sub>';
$ec_lang['ip_n_e']='מטפטפים לשלוחה, n<sub>e</sub>';
$ec_lang['ip_n_l']='שלוחות לגוש, n<sub>l</sub>';
$ec_lang['ip_d']='עומק יישום יעד, d';
$ec_lang['ip_a_e']='שטח למטפטף, A<sub>e</sub>';
$ec_lang['ip_pr']='קצב יישום, PR';
$ec_lang['ip_q_lat']='ספיקה לשלוחה, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='ספיקת גוש, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='משך הפעלה (שעות)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='חלחול תעלה';
$ec_lang['cs_main_title']='מחשבון חינמי מקוון לאובדן חלחול בתעלה וליעילות הולכה';
$ec_lang['cs_main_desc']='אובדן חלחול בתעלה & יעילות הולכה — שיטת ספיקת כניסה-יציאה';
$ec_lang['cs_Q_in']='ספיקת כניסה, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='ספיקת יציאה, Q<sub>out</sub>';
$ec_lang['cs_L']='אורך המקטע, L';
$ec_lang['cs_Q_loss']='קצב אובדן חלחול, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='בדיקת מדידה';
$ec_lang['cs_pct_loss']='שבר שאבד';
$ec_lang['cs_Ec']='יעילות הולכה, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='דירוג יעילות';
$ec_lang['cs_Vol_day']='נפח יומי שאבד';
$ec_lang['cs_Vol_year']='נפח שנתי שאבד';
$ec_lang['cs_Q_loss_per_L']='אובדן ליחידת אורך, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='ערך המים';
$ec_lang['cs_lining_cost']='עלות הריפוד';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="יעד יעילות הולכה לאחר ריפוד; שבר 0–1">יעד ריפוד, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='שטח ריפוד, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='ערך שנתי שאבד';
$ec_lang['cs_annual_value_recovered']='ערך שנתי מוחזר';
$ec_lang['cs_lining_total_cost']='סך עלות הריפוד';
$ec_lang['cs_payback_years']='<span class="ec-help" title="החזר פשוט = סך עלות הריפוד ÷ ערך שנתי מוחזר">תקופת החזר <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — זוהה חלחול';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — אין אובדן מדיד';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — בדקו את המדידות';
$ec_lang['cs_Ec_good']='טוב — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='סביר — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='גרוע — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='שיטת ספיקת הכניסה-יציאה אומדת את החלחול על ידי מדידת הספיקה בראש ובזנב של מקטע התעלה: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. יעילות ההולכה E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. הנפח השנתי מניח הפעלה רציפה בזרימה מלאה; האובדן בפועל נמוך יותר בתעלות עונתיות או בזרימה חלקית.';
$ec_lang['cs_notes_2_term']='דירוגי יעילות';
$ec_lang['cs_notes_2_def']='תעלות עפר טיפוסיות ללא ריפוד: E<sub>c</sub> = 60–80%. תעלות עפר מתוחזקות היטב: 75–85%. תעלות מרופדות בבטון: 90–98%. אובדני חלחול מעל 30% מהספיקה הנכנסת מצדיקים לרוב השקעה בריפוד. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='החזר השקעת הריפוד';
$ec_lang['cs_notes_3_def']='הזינו את ערך המים ואת עלות הריפוד בכל מטבע עקבי. שטח הריפוד = אורך המקטע × היקף רטוב — היקף הרטוב של חתך התעלה בעומק הזרימה הנמדד (רוחב התחתית בתוספת שני המדרונות הרטובים). הערך השנתי המוחזר מניח שהתעלה המרופדת משיגה את יעד E<sub>c</sub> ברציפות. ההחזר בפועל יהיה ארוך יותר בתעלות עונתיות או אם הריפוד אינו מגיע ליעד היעילות.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, מהדורה 3 (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='אודות';
$ec_lang['install_main_menu']='התקן';
$ec_lang['install_main_title']='התקן את EngCalcs';
$ec_lang['install_main_desc']='הוסף למכשיר שלך לשימוש לא מקוון';
$ec_lang['install_intro']='‏EngCalcs היא אפליקציית אינטרנט מתקדמת (PWA). לאחר ההתקנה, כל המחשבונים פועלים במלואם גם ללא חיבור לאינטרנט.';
$ec_lang['install_android_heading']='אנדרואיד (Chrome)';
$ec_lang['install_android_steps_html']='<li>פתחו כל דף מחשבון ב-Chrome.</li><li>הקישו על כפתור <strong>⬇ התקנה</strong> בסרגל הניווט העליון, או הקישו על תפריט הדפדפן (⋮) ובחרו <strong>הוספה למסך הבית</strong>.</li><li>הקישו על <strong>התקנה</strong> בהודעה שתופיע.</li><li>‏EngCalcs יופיע במסך הבית שלכם ויפעל גם ללא אינטרנט.</li>';
$ec_lang['install_now_btn']='⬇ התקן עכשיו';
$ec_lang['install_prompt_unavailable']='הודעת ההתקנה אינה זמינה — השתמשו בתפריט הדפדפן במקום.';
$ec_lang['install_ios_heading']='iOS ‏(Safari)';
$ec_lang['install_ios_steps_html']='<li>פתחו כל דף מחשבון ב-Safari.</li><li>הקישו על כפתור <strong>שיתוף</strong> (ריבוע עם חץ כלפי מעלה).</li><li>גללו למטה והקישו על <strong>הוספה למסך הבית</strong>.</li><li>הקישו על <strong>הוספה</strong>. ‏EngCalcs יופיע במסך הבית שלכם.</li>';
$ec_lang['install_ios_note']='ב-iOS ההתקנה מתבצעת תמיד דרך תפריט השיתוף — אין הודעת התקנה אוטומטית.';
$ec_lang['install_desktop_heading']='מחשב שולחני (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>פתחו כל דף מחשבון.</li><li>לחצו על <strong>סמל ההתקנה</strong> (⊕ או סמל מחשב) בשורת הכתובת של הדפדפן, או פתחו את תפריט הדפדפן ובחרו <strong>התקן את EngCalcs…</strong></li><li>לחצו על <strong>התקנה</strong>. ‏EngCalcs ייפתח כחלון אפליקציה עצמאי.</li>';
$ec_lang['install_firefox_heading']='Firefox / דפדפנים אחרים';
$ec_lang['install_firefox_body']='אם בדפדפן שלכם אין אפשרות התקנה, שום דבר לא הולך לאיבוד: השתמשו במחשבונים כרגיל בדפדפן, ולאחר הביקור הראשון הדפים נשמרים במטמון באופן אוטומטי לשימוש ללא אינטרנט. Firefox במחשב שולחני הוא המקרה הנפוץ.';
$ec_lang['install_cached_heading']='מה נשמר במטמון';
$ec_lang['install_cached_body']='בפעם הראשונה שבה אתם מתקינים את EngCalcs, כל דפי המחשבונים והקבצים התומכים בהם (סקריפטים, עיצוב) נשמרים במכשיר שלכם באופן אוטומטי. לאחר מכן, הכול פועל ללא חיבור לאינטרנט. בחירת השפה שלכם נשמרת מהביקור המקוון האחרון שלכם.';
$ec_lang['contact_main_menu']='צור קשר';
$ec_lang['about_main_title']='אודות מחשבוני ההנדסה HawsEDC';
$ec_lang['about_main_desc']='שליחות, תוכנה חופשית, ותרומה';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>שליחות</h3><p>מחשבוני ההנדסה של HawsEDC קיימים לשרת מהנדסים ועובדי שטח ברחבי העולם — ובמיוחד אלה הפועלים באזורים הסובלים מחוסר מים, מחסור במשאבים, או חסרי שירות מספק. כלים אלה הם חלק משליחות הומניטרית רחבה יותר: לומר לכל אדם בדרך המעשית והאפקטיבית ביותר <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">שהוא אהוב ויקיר לנצח, שאין לו מה לפחד, ושהוא לא ישחית הכל</a>.</p><p>המחשבונים הם הכלי. היעד הוא עולם נטול סבל.</p><h3>רישיון תוכנה חופשית וקוד פתוח</h3><p>כל הקוד מופץ תחת <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">רישיון GNU הציבורי הכללי גרסה 3.0 ומעלה</a> — חופשי כמשמעות החופש. תוכלו להשתמש, ללמוד, לשנות ולהפיץ את הקוד תחת אותם תנאים.</p><p>זוהי הזמנה, לא מחיר. אין מסלול בתשלום, אין מסלול חינמי שניתן לבטל, ואין עיכוב לפני שהקוד הופך לשלכם. הגרסה המלאה שאתם רואים היום חופשית לכולם, עכשיו ולתמיד, לשימוש ולשינוי.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>קוד מקור</h3><p>קוד המקור המלא זמין לציבור ב-GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>תוכלו לעיין בקוד, לדווח על בעיות, או לפצל את המאגר שם.</p><h3>תרומה</h3><p>כל עזרה תתקבל בברכה. <a href="contact.php">צרו קשר עם Tom Haws</a>.</p><ul><li><strong>תרגומים:</strong> הציעו ניסוח טוב יותר. שפרו או הוסיפו שפה.</li><li><strong>דיווח על באגים:</strong> השתמשו בטופס המשוב בכל עמוד מחשבון, או דווחו על בעיה ב-GitHub.</li><li><strong>מחשבונים חדשים:</strong> רעיונות לכלי הנדסה הידראולית המשרתים עובדי שטח ואנשי מקצוע בהשקיה מתקבלים בברכה מיוחדת.</li><li><strong>אירוח:</strong> אם תוכלו לשקף מחשבונים אלה לאזור בעל קישוריות מוגבלת, אנא צרו קשר.</li></ul><h3>שימוש ללא חיבור לאינטרנט</h3><p>המחשבונים האלה פועלים כ<strong>אפליקציית ווב מתקדמת (PWA)</strong>. בקרו בכל עמוד מחשבון כאשר אתם מחוברים לאינטרנט, והדפדפן שלכם יאחסן אוטומטית את כל המחשבונים. לאחר מכן כל המחשבונים יפעלו ללא אינטרנט — אין צורך בחיבור.</p><p>ב-Android או iOS, השתמשו באפשרות "הוסף למסך הבית" בדפדפן שלכם כדי להתקין את EngCalcs כאפליקציה במכשירכם. במחשב שולחני, חפשו את סמל ההתקנה בשורת הכתובת של הדפדפן.</p><p>תוכלו גם לשמור כל מחשבון בנפרד באמצעות תפריט "שמור בשם…" בדפדפן שלכם לשימוש חד-פעמי ללא חיבור לאינטרנט.</p><h3>יצירת קשר</h3><p>Tom Haws — מהנדס הידראולי ומחבר מחשבונים אלה.<br />השתמשו בטופס המשוב בכל עמוד מחשבון, או גשו לקוד המקור ב<a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
$ec_lang['contactSendMessage']='שלח הודעה ל-Tom Haws';
$ec_lang['contactYourName']='שמך:';
$ec_lang['contactYourEmail']='כתובת הדוא"ל שלך:';
$ec_lang['contactSubject']='נושא:';
$ec_lang['contact_message']='הודעה:';
$ec_lang['contactSpamPrefix']='חמש ועוד אחת שווה';
$ec_lang['contactSpamPostfix']='(אנא כתוב במילים. 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='שלח הודעה';
$ec_lang['contact_success']='תודה שלקחת את הזמן לכתוב.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='תכנון מגלשת סלעים (Robinson)';
$ec_lang['rc_main_title']='מחשבון חינמי לתכנון מגלשת סלעים — Robinson (1998)';
$ec_lang['rc_main_desc']='קביעת גודל שכבת הסלע במגלשת סלעים — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='שיפוע קרקעית המגלשה, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="זרימה ליחידת רוחב בכניסת המגלשה. לתעלה ברוחב תחתון B עם ספיקה כוללת Q, השתמשו ב-q_t = Q / B.">ספיקה יחידתית כוללת, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='נקבוביות שכבת הסלע, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="צפיפות יחסית למים. גרניט או בזלט כתוש טיפוסי ≈ 2.65. טווח תקף לפי Robinson: 2.54 עד 2.82.">משקל סגולי של הסלע, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="סטיית תקן של הדרגות. סלע אחיד ≈ 1.25. טווח תקף לפי Robinson: 1.15 עד 1.47.">סטיית הדרגות SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="הצטברות מים (Hp > yn) רצויה — מפחיתה סחיפה מעלה. (USDA)">עומק נורמלי בתעלת הכניסה, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="מש׳ 1 (S0 < 0.10) או מש׳ 2 (0.10-0.40). תקף: D50 בין 15 ל-278 מ״מ, S0 בין 0.02 ל-0.40. מחוץ לטווח: ערכים מוחצנים.">גודל סלע חציוני נדרש, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='משוואה שיושמה';
$ec_lang['rc_sg_check']='בדיקת משקל סגולי';
$ec_lang['rc_SD_check']='בדיקת סטיית דרגות SD';
$ec_lang['rc_sg_ok']   ='sg בטווח התקף';
$ec_lang['rc_sg_ok_tip']='2.54–2.82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg מתחת לטווח Robinson';
$ec_lang['rc_sg_low_tip']='טווח תקף: 2.54–2.82';
$ec_lang['rc_sg_high'] ='sg מעל לטווח Robinson';
$ec_lang['rc_sg_high_tip']='טווח תקף: 2.54–2.82';
$ec_lang['rc_SD_ok']   ='SD בטווח התקף';
$ec_lang['rc_SD_ok_tip']='1.15–1.47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD מתחת לטווח Robinson';
$ec_lang['rc_SD_low_tip']='טווח תקף: 1.15–1.47';
$ec_lang['rc_SD_high'] ='SD מעל לטווח Robinson';
$ec_lang['rc_SD_high_tip']='טווח תקף: 1.15–1.47';
$ec_lang['rc_layer']='עובי שכבת הסלע (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='רדיוס עקמת הכתר העליון (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='אורך קשת עקמת הכתר העליון';
$ec_lang['rc_apron_length']='<span class="ec-help" title="נדרש לתמיכה מבנית בשכבת הסלע במגלשה. “מפלס המים התחתון המינימלי הנוצר כתוצאה מקטע היציאה והתנגדות הערוץ שבמורד מספיק כדי להבטיח את יציבות שכבת הסלע בקטע היציאה.” (Robinson)">אורך מצוע היציאה (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='מקדם גסות Manning במגלשה, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="חלק מ-qt הזורם דרך נקבוביות הסלע. השאר qs זורם על פני השטח. ברירת מחדל np = 0.45 לסלע כתוש זוויתי.">מהירות דרך מעטפת הסלע, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='ספיקה יחידתית דרך המעטפת, q<sub>m</sub>';
$ec_lang['rc_qs']='ספיקה יחידתית עילית, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='עומק הזרימה מעל פני שכבת הסלע, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="הצטברות מים (Hp > yn) רצויה — מפחיתה סחיפה מעלה. (USDA)">גובה מים בכתר הכניסה, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='בדיקת הצטברות מים בכניסה';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — הצטברות מים במעלה הזרם';
$ec_lang['rc_pond_ok_tip']='הצטברות מים במעלה כניסת המגלשה היא דבר רצוי — היא מפחיתה סחיפה במעלה הזרם. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — אין הצטברות מים — פוטנציאל סחיפה בכניסה';
$ec_lang['rc_pond_warn_tip']='אין הצטברות מים במעלה כניסת המגלשה; עלולה להתרחש סחיפה במעלה הזרם. (USDA)';
$ec_lang['rc_eq1']='מש׳ 1 (S<sub>0</sub> < 0.10) — שיפוע מתון';
$ec_lang['rc_eq2']='מש׳ 2 (0.10 ≤ S<sub>0</sub> ≤ 0.40) — שיפוע תלול';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0.02 — מתחת לטווח האימות של Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0.40 — מעל טווח האימות של Robinson';
$ec_lang['rc_notes_1_term']='משוואות לקביעת גודל הסלע';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) פיתחו שתי משוואות אמפיריות לגודל שכבת הסלע החציוני D<sub>50</sub> על בסיס שיפוע המגלשה והספיקה היחידתית. משוואה 1 חלה לשיפועים מתונים (S<sub>0</sub> < 0.10); משוואה 2 חלה לשיפועים תלולים (0.10 ≤ S<sub>0</sub> ≤ 0.40). שתי המשוואות דורשות q<sub>t</sub> ביחידות m²/s ומחזירות D<sub>50</sub> במ״מ. הטווח המאומת הוא 0.02 ≤ S<sub>0</sub> ≤ 0.40.';
$ec_lang['rc_notes_2_term']='ספיקה יחידתית';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> היא הספיקה היחידתית הכוללת בכתר המגלשה (ספיקה כוללת ליחידת רוחב). לתעלה ברוחב תחתון B הנושאת ספיקה כוללת Q, יש לאמוד q<sub>t</sub> ≈ Q / B, או לחשב זאת מתנאי העומק הקריטי בכניסת המגלשה.';
$ec_lang['rc_notes_3_term']='זרימה דרך מעטפת הסלע';
$ec_lang['rc_notes_3_def']='חלק מהזרימה הכוללת עובר דרך נקבוביות שכבת הסלע (ספיקת מעטפת q<sub>m</sub>); השאר זורם על פני הסלע (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). עומק הזרימה d מחושב ממשוואת Manning המוחלת על ספיקת פני השטח q<sub>s</sub> תוך שימוש בגסות המגלשה n. נקבוביות ברירת מחדל n<sub>p</sub> = 0.45 אופיינית לסלע כתוש זוויתי.';
$ec_lang['rc_notes_5_term']='טווח גודל סלע תקף';
$ec_lang['rc_notes_5_def']='המשוואות פותחו בטווח D<sub>50</sub> שבין 15 מ״מ ל-278 מ״מ. תוצאות מחוץ לטווח זה הן החצנה ויש להשתמש בהן בשיקול דעת הנדסי נוסף.';
$ec_lang['rc_notes_6_term']='גובה מצוע המוצא';
$ec_lang['rc_notes_6_def']='גובה ראש שכבת הסלע במקטע המוצא צריך להיות שווה או נמוך מגובה קרקעית הערוץ המורד. אם הוא גבוה יותר, סלעי המוצא יהיו בלתי יציבים.';

$ec_lang['rc_notes_7_def']='כאשר העומק הנורמלי בתעלת הכניסה קטן מגובה המים בכתר (H<sub>p</sub>) הנדרש להעברת q<sub>t</sub>, נוצרת זרימה מוגבלת או הצטברות מים במעלה כניסת המגלשה. זה בדרך כלל מקובל — הצטברות מים מפחיתה מהירות ומונעת סחיפה במעלה הזרם. לבדיקה: השתמשו במחשבון ספיקת שפך כדי למצוא את H<sub>p</sub> עבור q<sub>t</sub> ורוחב הכתר הנתונים, והשוו לעומק הנורמלי של תעלת הכניסה. אם H<sub>p</sub> עולה על העומק הנורמלי, תהיה הצטברות מים.';
$ec_lang['rc_notes_4_term']='מקור';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS מפרסמת גם <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">גיליון Excel</a> המבוסס על אותה שיטה.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'מסנן';
$ec_lang['rc_sketch_top_crest_curve'] = 'עקומת הכתר העליון';
$ec_lang['rc_sketch_outlet_apron']    = 'מצוע יציאה';
$ec_lang['rc_sketch_radius']          = 'רדיוס';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='לחץ השקיה';
$ec_lang['ip_main_title']='מחשבון מקוון חינמי ללחץ השקיה & אחידות ההתפלגות';
$ec_lang['ip_main_desc']='לחץ ענף בדיקה ואומדן אחידות';
$ec_lang['ip_h_supply']='לחץ אספקה';
$ec_lang['ip_elev_supply']='רום אספקה, z<sub>supply</sub>';
$ec_lang['ip_q_design']='ספיקת תכנון המטפטף, q<sub>design</sub>';
$ec_lang['ip_h_design']='לחץ תכנון המטפטף';
$ec_lang['ip_x']='<span class="ec-help" title="0.5 למטפטפים רגילים ללא ויסות לחץ; קרוב ל-0 למטפטפים מווסתי לחץ">מעריך ספיקת המטפטף, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='נתיב בדיקה';
$ec_lang['ip_group_reach']='קטע';
$ec_lang['ip_group_upstream']='זרם מעלה';
$ec_lang['ip_group_downstream']='זרם מורד';
$ec_lang['ip_group_loss']='הפסד';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="מסומן: קטע זה הוא חלק משלוחת הבדיקה, שממנה מטפטפים בודדים שואבים מים. לא מסומן: קטע זה הוא קו ראשי, המעביר ספיקה בלבד לשלוחות שאינן בנתיב הבדיקה.">שלוחה <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="שורות שלוחה: המטפטפים בקטע זה בלבד. שורות קו ראשי: סך המטפטפים בשלוחות האחרות, השונות מזו, המסתעפות מקטע זה. עבור קטע קו הראשי המסתיים בשלוחת הבדיקה, נכללות גם כל השלוחות שמעבר לנקודה זו לאורך הקו הראשי, וכן שלוחות החולקות אותו צומת (למשל שלוחה מהצד הנגדי) — גם ספיקתן מסתעפת מקטע זה.">מטפטפים <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="רום קצה מורד הזרם של קטע זה. אופציונלי בשורות פנימיות (אם נשאר ריק, ברירת המחדל אופקי / זהה לצומת שמעליו). חובה בשורה האחרונה: ערך זה הוא רום המטפטף האחרון, הקובע ישירות את לחץ האספקה הנדרש.">רום מורד <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='רום המטפטף האחרון (שורה אחרונה) נשאר ריק וברירת המחדל הוגדרה כאופקי — הזינו אותו לקבלת תוצאה מדויקת';
$ec_lang['ip_press']='לחץ';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="סך הפסד הקטע, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='לחץ נמוך/שלילי — בדקו תנאים תת-אטמוספריים';
$ec_lang['ip_pressure_warn_short']='נמוך';
$ec_lang['ip_pressure_high']='במיקומים בעלי לחץ גבוה נדרשת הפחתת לחץ';
$ec_lang['ip_pressure_high_short']='גבוה';
$ec_lang['ip_max_head']='לחץ מקס׳ מותר לצינור';
$ec_lang['ip_max_head_tip']='קווים שהלחץ בהם עולה על ערך זה יסומנו. השאירו ריק כדי לדלג על בדיקת הלחץ הגבוה.';
$ec_lang['ip_h_far']='לחץ המטפטף האחרון';
$ec_lang['ip_q_supply']='<span class="ec-help" title="הספיקה הנכנסת לנתיב הבדיקה הממודל בלבד — לכל האזור/המערכת, ראו Q_zone בתכנון היישום למטה.">ספיקת אספקה של נתיב הבדיקה, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='ספיקת המטפטף האחרון, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='ספיקת מטפטף ממוצעת (שלוחת בדיקה), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="בכמה גבוה (או נמוך) אתם מעריכים ששלוחה טיפוסית פועלת בהשוואה לשלוחת בדיקה זו. שלוחת הבדיקה נבחרת בכוונה כמקרה הגרוע ביותר המשוער, כך שהממוצע שלה עצמה הוא הערכת חסר לממוצע השדה — אם נותר 0, בדיקת האחידות ומספרי תכנון היישום למטה משתמשים בממוצע של שלוחת הבדיקה עצמה (ככל הנראה אופטימי) כפי שהוא.">אומדן Δלחץ, ממוצע לעומת שלוחת הבדיקה <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral מחושב מחדש בלחץ של כל שורת שלוחה, בתוספת הפרש הלחץ שהוזן למעלה — ניסיון לתקן את העובדה ששלוחת הבדיקה היא המקרה הגרוע המשוער, לא שלוחה מייצגת. מזין הן את בדיקת האחידות והן את סעיף תכנון היישום למטה.">אומדן ספיקת מטפטף ממוצעת לשדה, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="הספיקה המחושבת של המטפטף האחרון חלקי אומדן ספיקת המטפטף הממוצעת לשדה — זהו קירוב לאחידות ההתפלגות ברבע התחתון המקובלת (ממוצע הקבוצה הנמוכה ÷ ממוצע האוכלוסייה); הקירוב מבוסס על מדגם ממודל קטן ותיקון שהמשתמש אמד, ולא על מדגם סטטיסטי של שדה מלא. ערכים של 1 ומעלה אפשריים ותקפים: פירושם רק שלחץ המטפטף האחרון נמצא בגובה או מעל אומדן ממוצע השדה, כך שמטפטף אחר הוא נקודת הלחץ הנמוכה ביותר. הדבר יכול לנבוע מכך שהמטפטף האחרון נמצא בקרקע נמוכה, או מכך שאומדן Δהלחץ קטן מדי.">בדיקת אחידות, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='הלחץ במטפטף הבדיקה ≥ לחץ האספקה. סביר שזה אינו המטפטף במקרה הגרוע ביותר, או שניתן להקטין את הצינורות.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="זהו מדד שונה מהקירוב שלנו למדד האחידות המקובל.">ספיקת המטפטף האחרון ÷ ספיקת התכנון, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='אין פתרון: לחץ האספקה הנדרש חורג מלחץ האספקה שהוזן. הגדילו את לחץ האספקה, הפחיתו את הדרישה, או השתמשו בצינור גדול יותר.';
$ec_lang['ip_notes_1_def']='מנחש את הלחץ במטפטף האחרון (המרוחק ביותר), ולאחר מכן מתקדם עם קו גובה האנרגיה בחזרה לעבר האספקה, קטע אחר קטע, תוך הוספת הפסדי חיכוך והפסדים מקומיים בדרך. הרום ועומד המהירות מנוכים בכל צומת כדי לדווח את הלחץ בפועל שם. הלחץ המנוחש בקצה הרחוק מכוונן (בשיטת החצייה) עד שלחץ האספקה הנדרש המחושב תואם את לחץ האספקה שהוזן — אותה בעיית לולאה סגורה שפותר פותר זרימת הצינורות במחשבון זרימת צינור Manning, מורחבת לרשת מסתעפת.';
$ec_lang['ip_notes_2_term']='קטעי קו ראשי לעומת שלוחה';
$ec_lang['ip_notes_2_def']='כל שורה היא קטע אחד לאורך הנתיב ההידראולי הגרוע ביותר היחיד (נתיב הבדיקה) מהאספקה עד המטפטף האחרון. קטע קו ראשי מעביר ספיקה רק לשלוחות שאינן בנתיב הבדיקה, כך שהשאיבה שלו היא הכפלה פשוטה (ספיקת תכנון × סך מספר המטפטפים בקטע) — ללא רגישות ללחץ המקומי. הקו הראשי הוא צינור גזע משותף, ולכן קטע קו הראשי המסתיים בשלוחת הבדיקה חייב לכלול לא רק שלוחות שבין נקודות הקצה שלו אלא גם כל שלוחה נוספת בהמשך הקו הראשי מעבר לנקודה זו, או החולקת את אותו צומת (למשל שלוחה בצד הנגדי) — ספיקתן עוברת דרך אותו קטע לפני שהיא מתפצלת, בין שהן מופיעות במקום אחר בטבלה זו ובין שלא. קטע שלוחה הוא מקטע של שלוחת הבדיקה עצמה: ספיקת המטפטף מחושבת מהלחץ המקומי בפועל באמצעות q = k·H<sup>x</sup>, והפסד החיכוך מוקטן במקדם F(n) של Christiansen כדי לשקף את ירידת הספיקה ככל שכל מטפטף בקטע שואב מים.';
$ec_lang['ip_notes_3_term']='מגבלות';
$ec_lang['ip_notes_3_def']='מדגמן לחץ אספקה קבוע אחד (ללא עקומת משאבה), נתיב בדיקה יחיד בלבד (לא כל השדה), ועקומת מטפטף דו-פרמטרית (קבעו את המעריך קרוב ל-0 כדי לקרב מטפטף מווסת לחץ). מדווחים שני יחסי אחידות שונים, המופרדים בכוונה: q<sub>last</sub>/q<sub>avg,field</sub> הוא קירוב לאחידות ההתפלגות ברבע התחתון המקובלת (ממוצע הקבוצה הנמוכה ÷ ממוצע האוכלוסייה); אך קירוב זה מבוסס על מדגם ממודל קטן ותיקון שהמשתמש אמד, במקום המדגם הסטטיסטי המקובל של שדה מלא. כמו כן, שלוחת הבדיקה נבחרת בכוונה כמקרה הגרוע ביותר המשוער, כך שהממוצע הגולמי הבלתי-מתוקן שלה היה ממעיט בהערכת ממוצע השדה האמיתי וגורם לאחידות להיראות טובה יותר משהיא באמת; קלט Δהלחץ קיים בדיוק כדי לנטרל הטיה זו. ערכים של 1 ומעלה עדיין אפשריים לאחידות: פירושם רק שלחץ המטפטף האחרון נמצא בגובה או מעל אומדן ממוצע השדה, כך שמטפטף אחר הוא נקודת הלחץ הנמוכה ביותר. הדבר יכול לנבוע מכך שהמטפטף האחרון נמצא בקרקע נמוכה, או מכך שאומדן Δהלחץ קטן מדי. q<sub>last</sub>/q<sub>design</sub> היא בדיקה שונה, שאינה מדד אחידות, מול הספיקה הנקובה של היצרן — שימושית לזיהוי מערכת בעלת לחץ יתר או חסר באופן כללי, אך זו בדיקה נפרדת שיש לקרוא לצד מספר האחידות, מכיוון שספיקת התכנון/הנקובה אינה תלויה בלחץ העבודה הממוצע בפועל של המערכת.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. תקני ASAE/ASABE לתכנון מיקרו-השקיה משתמשים בגישת הפסד חיכוך רב-יציאה זהה.';
$ec_lang['ip_notes_5_term']='תכנון היישום';
$ec_lang['ip_notes_5_def']='קצב היישום וספיקת המערכת/הגוש משתמשים באומדן ספיקת המטפטף הממוצעת לשדה (q<sub>avg,field</sub> — הממוצע של שלוחת הבדיקה עצמה, מתוקן באומדן ה-Δלחץ שהוזן), ולא בקצב מנוחש: PR = q<sub>avg,field</sub> / A<sub>e</sub>, הניזון מהערך הממודל המתוקן. המרווחים ומספרי השלוחות/המטפטפים ברמת המערכת הם קלטים נפרדים כאן, מכיוון שנתיב הבדיקה מדגמן רק ענף אחד של המקרה הגרוע ביותר, לא כל שלוחה בשדה.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='רשת צנרת מסועפת';
$ec_lang['bpn_main_title']='מחשבון חינמי מקוון ללחץ ברשת צנרת מסועפת (ללא לולאות)';
$ec_lang['bpn_main_desc']='ספיקה ולחץ ברשת צנרת מסועפת (עצית)';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='גובה אספקה סטטי: גובה המקור בספיקה אפס. מפלס מים במאגר או במיכל מעל רום ההספקה, או גובה הסתימה של משאבה. הוסיפו נקודות אספקה 2 ו-3 כדי להגדיר עקומת משאבה או עקומת אספקה משתנה; הכלי קורא את הגובה בספיקת התכנון.';
$ec_lang['bpn_elev_source']='רום אספקה';
$ec_lang['bpn_q_total']='ספיקה כוללת';
$ec_lang['bpn_q_total_tip']='הספיקה הכוללת היוצאת מהמקור (סכום כל הדרישות ברשת).';
$ec_lang['bpn_p_min']='הלחץ הנמוך ביותר';
$ec_lang['bpn_p_min_tip']='הלחץ הנמוך ביותר במורד הזרם בכל מקום ברשת; נקודת האספקה הקריטית.';
$ec_lang['bpn_method']='שיטת חיכוך';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='קווי צנרת';
$ec_lang['bpn_id']='מזהה';
$ec_lang['bpn_id_tip']='שם קו צנרת זה. קווים אחרים מתייחסים אליו בעמודת מזהה במעלה הזרם.';
$ec_lang['bpn_upstream']='מזהה במעלה הזרם';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='מזהה הקו המזין קו זה. השאירו ריק כדי לעקוב אחרי הקו שממש מעליו (קו טורי פשוט). הזינו כאן מזהה כדי להסתעף מקו אחר.';
$ec_lang['bpn_roughness_tip']='חספוס הצנרת עבור שיטת החיכוך שנבחרה: n של Manning, C של Hazen-Williams, או גובה חספוס e של Darcy-Weisbach (אורך). צינור פלסטיק חלק אופייני: n כ-0.009, C כ-150, e כ-0.0015 מ״מ.';
$ec_lang['bpn_demand']='דרישה';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='ספיקה קבועה המסופקת בקצה מורד הזרם של קו זה.';
$ec_lang['bpn_demand_mult']='מכפיל דרישה';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='מכפיל את דרישת כל הקווים בבת אחת, להרצת שעת שיא או צמיחה עתידית. השתמשו ב-1 עבור הדרישות כפי שהוזנו.';
$ec_lang['bpn_elev_down']='רום מורד';
$ec_lang['bpn_q_line']='ספיקת הקו';
$ec_lang['bpn_q_line_tip']='הספיקה הכוללת שקו זה נושא: הדרישה שלו עצמו בתוספת כל דרישה במורד הזרם שהוא מזין.';
$ec_lang['bpn_p_down']='לחץ מורד';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='גובה הלחץ (מד לחץ) בצומת מורד הזרם של קו זה. ערך שלילי (מסומן) פירושו לחץ תת-אטמוספרי; יש לבדוק את התכנון.';
$ec_lang['bpn_sketch_heading']='תרשים הרשת';
$ec_lang['bpn_source_label']='מקור';
$ec_lang['bpn_line_problem']='קו זה אינו מחובר למקור: הוא מצביע על מזהה במעלה הזרם שאינו ידוע, מצביע על עצמו, חוזר על מזהה שקו אחר כבר משתמש בו, או יוצר לולאה. קווים שאינם מחוברים נשארים בלתי פתורים.';
$ec_lang['bpn_bad_id_short']='מזהה שגוי';


$ec_lang['bpn_pressure_warn']='לחץ נמוך/שלילי; בדקו תנאים תת-אטמוספריים';
$ec_lang['bpn_pressure_warn_short']='נמוך';
$ec_lang['bpn_notes_1_term']='טורי כברירת מחדל, הסתעפות כחריגה';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='השאירו את מזהה במעלה הזרם ריק וקו יעקוב אחרי הקו שמעליו; קו צנרת טורי פשוט. הזינו מזהה של קו במעלה הזרם כדי להסתעף ממנו. כלומר: טורי כברירת מחדל, עץ כשצריך.';
$ec_lang['bpn_notes_2_term']='רשתות מסועפות בלבד, ללא לולאות';
$ec_lang['bpn_notes_2_def']='לכל קו יש בדיוק קו אחד במעלה הזרם (עץ). כלי זה אינו פותר רשתות עם לולאות; אלה דורשות שיטות איטרטיביות (EPANET או דומה). השמטת הלולאות היא מה ששומר על הפשטות והדיוק.';
$ec_lang['bpn_notes_3_term']='ללא בקרות לחץ פעילות';
$ec_lang['bpn_notes_3_def']='ניתן להוסיף שסתום בעל הפסד מקומי קבוע (ערך k), אך לא שסתומי הפחתת לחץ או קיום לחץ (PRV/PSV). מצב הפתיחה/סגירה שלהם תלוי בספיקה ובלחץ, מה שהיה מחייב איטרציה.';


$ec_lang['bpn_supply2_q']='ספיקת אספקה 2';
$ec_lang['bpn_supply2_h']='גובה אספקה 2';
$ec_lang['bpn_supply3_q']='ספיקת אספקה 3';
$ec_lang['bpn_supply3_h']='גובה אספקה 3';
$ec_lang['bpn_supply_pt_tip']='נקודות עקומת אספקה 2 ו-3, אופציונליות. הזינו ספיקה וגובה לכל אחת כדי לדגם משאבה, או כל מקור שהגובה שלו יורד ככל שהוא מספק יותר; הכלי קורא את הגובה בספיקת התכנון. נקודה 1 לעיל היא הגובה הסטטי בספיקה אפס. השאירו את 2 ו-3 ריקות עבור גובה מאגר קבוע.';
$ec_lang['bpn_h_supply']='גובה אספקה';
$ec_lang['bpn_h_supply_tip']='גובה המקור בספיקת התכנון, נקרא מעקומת האספקה. שווה לגובה המקור שהוזן כאשר העקומה שטוחה (מאגר).';
$ec_lang['bpn_supply1_h']='גובה אספקה סטטי';
$ec_lang['lpn_main_menu']='רשת אספקת מים';
$ec_lang['lpn_main_title']='מידול חינמי מקוון לרשת חלוקת מים עם פותר EPANET';
$ec_lang['lpn_main_desc']='ניתוח רשת אספקת מים: ציירו רשת צנרת טבעתית או ייבאו קובצי EPANET';
$ec_lang['lpn_title_units']='יחידות {units}';
$ec_lang['lpn_tool_select']='בחירה';
$ec_lang['lpn_tool_add_junction']='צומת';
$ec_lang['lpn_tool_add_reservoir']='מאגר';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='מכל';
$ec_lang['lpn_tool_add_pipe']='צינור';
$ec_lang['lpn_tool_add_pump']='משאבה';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='שסתום';
$ec_lang['lpn_tool_add_text']='טקסט';
$ec_lang['lpn_tool_vertices']='נקודות עיקול';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='לקוח';
$ec_lang['lpn_tool_add_meter_tip']='לחצו במקום שבו נמצא הלקוח, ולאחר מכן לחצו על הצינור או הצומת המספקים לו מים. הדרישה שתיתנו ללקוח מתווספת לצומת בקצה הקרוב של אותו צינור.';
$ec_lang['lpn_mode_add_meter']='לקוח: לחצו במקום שבו נמצא הלקוח, ולאחר מכן לחצו על הצינור או הצומת המספקים לו מים. או השתמשו ב-Esc כדי לבטל.';
$ec_lang['lpn_pane_tab_customers']='לקוחות';
$ec_lang['lpn_customer_heading']='לקוח {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='דרישה לכל חיבור';
$ec_lang['lpn_field_meter_demand_tip']='מה כל חיבור אצל לקוח זה דורש. חיפוש והחלפה יכולים לנצל את ההבדל בין ריק ל-0.';
$ec_lang['lpn_field_meter_count']='מספר חיבורים';
$ec_lang['lpn_field_meter_count_tip']='כמה חיבורים זהים לקוח יחיד זה מייצג, כך שארבעים ושניים חיבורי בית פרטי לאורך קו ראשי אחד יכולים להיות סמל אחד במקום אחד. הסך הכול למטה הוא הדרישה שלמעלה כפול מספר זה.';
$ec_lang['lpn_field_meter_total']='דרישה כוללת';
$ec_lang['lpn_field_meter_total_tip']='הדרישה לכל חיבור כפול מספר החיבורים. זהו המספר המתווסף לצומת בשם שלמטה.';
$ec_lang['lpn_field_meter_pipe']='נכס מחובר';
$ec_lang['lpn_field_meter_pipe_suggest']='הנכס הקרוב ביותר הוא {id}. הקלידו אותו כאן כדי לספק ממנו ללקוח זה.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='מחובר אל';
$ec_lang['lpn_field_meter_node_tip']='הצומת שאליו לקוח זה מחובר. גררו את נקודת החיבור אל צינור כדי לספק לו במקום זאת מתחנה לאורך אותו צינור.';
$ec_lang['lpn_meter_pipe_unknown']='שום דבר בפרויקט זה אינו נקרא {id}, כך שהלקוח נשאר במקומו.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_field_meter_pattern_tip']='כיצד הדרישה של לקוח זה עולה ויורדת במהלך ההרצה. היא מכפילה את הדרישה הכוללת, ולכן פועלת על כל חיבור שלקוח זה מייצג. השאירו על אין תבנית כדי לעקוב אחר תבנית דרישה ברירת מחדל של הפרויקט.';
$ec_lang['lpn_meter_pattern_unknown']='שום תבנית בפרויקט זה אינה נקראת {id}, כך שהלקוח נשאר כפי שהיה.';
$ec_lang['lpn_meter_placed']='לקוח {id} נוסף. התיאור והדרישה שלו מוקלדים בטבלת הלקוחות, או לחצו עליו בבחירה כדי לפתוח את תיבתו.';
$ec_lang['lpn_field_meter_pipe_tip']='הנכס שאליו חיבור זה מתחבר. הקלידו נכס אחר כאן או בטבלת הלקוחות כדי לשנות אותו, או גררו את נקודת החיבור אל נכס אחר.';
$ec_lang['lpn_field_meter_station']='מיקום לאורך הצינור (%)';
$ec_lang['lpn_field_meter_station_tip']='עד כמה רחוק לאורך הצינור החיבור מתחבר, באחוזים מהצינור מהצומת הראשון שלו עד השני. 0 הוא בקצה אחד ו-100 בקצה השני. העיגול על הצינור עושה את אותו הדבר עם הסמן.';
$ec_lang['lpn_field_meter_offset']='היסט מהצינור';
$ec_lang['lpn_field_meter_offset_tip']='ערך חיובי הוא מימין לצינור, כשמסתכלים מהצומת הראשון שלו לעבר השני. הקלדת ערך כאן יכולה להעביר את הלקוח לצד השני של הקו הראשי, והיא תמיד מיישרת בניצב את קו החיבור אל הקו הראשי.';
$ec_lang['lpn_field_meter_lumped']='מתווסף לצומת';
$ec_lang['lpn_field_meter_lumped_tip']='הצומת הקרוב ביותר; דרישות הלקוח מתווספות שם.';
$ec_lang['lpn_node_customers']='דרישות לקוחות';
$ec_lang['lpn_node_customers_tip']='רשימת הלקוחות שנוספו בצומת זה (משום שזה היה הקרוב ביותר). דרישות הלקוחות הן בנוסף לדרישות האחרות המפורטות כאן. לקוח נערך במקום שבו הוא יושב על המפה או בטבלת הלקוחות.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} מתוך {n} לקוחות';
$ec_lang['lpn_customer_detached']='⚠ לקוח זה אינו מחובר לצינור, כך שדרישתו אינה כלולה בתוצאות. מחקו אותו, או ציירו צינור והעבירו את הלקוח אליו.';
$ec_lang['lpn_customer_fixed_head']='⚠ הקצה הקרוב של אותו צינור מחזיק מפלס מים קבוע, כך שדרישה זו אינה משפיעה על הסימולציה.';
$ec_lang['lpn_customer_detached_count']='{n} לקוחות אינם מחוברים לצינור. דרישתם אינה נכללת בחשבון.';
$ec_lang['lpn_meter_pick_pipe']='כעת לחצו על הצינור או הצומת המספקים ללקוח זה. הלקוח נשאר במקום שבו הצבתם אותו. לחצו Escape כדי לבטל.';
$ec_lang['lpn_inp_export_flat_customers']='לקובץ EPANET אין לקוחות. הדרישה של {n} הלקוחות בפרויקט זה נכנסת לקובץ כשורת דרישה על הצומת שכל אחד מהם נוסף אליו, וכל שורה מתויגת בתגית הלקוח. מה שהקובץ אינו יכול להכיל הוא הלקוח עצמו: היכן הוא יושב, איזה צינור מספק לו, היכן לאורך אותו צינור החיבור מתחבר, וכמה חיבורים לקוח אחד מייצג. קובץ הפרויקט שלכם שומר את כל זה.';

$ec_lang['lpn_area_hint_window_start']='לחצו על פינה אחת של החלון.';
$ec_lang['lpn_area_hint_window_go']='לחצו על הפינה הנגדית כדי לסיים.';
$ec_lang['lpn_area_hint_lasso_start']='לחצו כדי להתחיל את המתאר.';
$ec_lang['lpn_area_hint_lasso_go']='הזיזו כדי לצייר את המתאר. לחצו כדי לסיים.';
$ec_lang['lpn_area_hint_polygon_start']='לחצו כדי לצייר את שטח המצולע. לחיצה כפולה כדי לסיים.';
$ec_lang['lpn_area_hint_polygon_go']='לחצו על כל פינה. לחיצה כפולה על האחרונה כדי לסיים.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='החזיקו את Shift בזמן הבחירה כדי להמשיך עם הבחירה הקיימת, ולהוסיף או להסיר (החלפה) את מה שאתם בוחרים.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='לחצו על המפה וגררו סביב מה שאתם רוצים, ואז הרימו את האצבע.';
$ec_lang['lpn_area_hint_touch_go']='גררו סביב מה שאתם רוצים, ואז הרימו את האצבע כדי לסיים.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='הצג זאת';
$ec_lang['lpn_multi_title']='{n} נבחרו';
$ec_lang['lpn_multi_varies']='משתנה';
$ec_lang['lpn_multi_applied']='הוגדר {prop} עבור {n}.';
$ec_lang['lpn_multi_no_fields']='לאלה אין דבר שניתן להגדיר יחד כאן.';
$ec_lang['lpn_pane_pasted']='הודבקו {n} תאים. {skipped} לא שונו.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='הודבקו {n} שורות ו-{created} מהן נוספו לרשת.';
$ec_lang['lpn_pane_pasted_rows_skipped']='הודבקו {n} שורות ו-{created} מהן נוספו לרשת. {skipped} תאים לא שונו.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='לחצו כאן והדביקו שורות מגיליון אלקטרוני כדי להוסיף אותן.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='הדבקה כשורות חדשות בסוף הטבלה';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='לחצו Ctrl+V כדי להוסיף את השורות שהועתקו בתחתית טבלה זו. לחצו Esc כדי לבטל.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='בהדבקה זו {n} שורות, ו-{fit} מהן מתאימות לטבלה. להוסיף את {extra} הנותרות כשורות חדשות בתחתית?';
$ec_lang['lpn_pane_paste_overflow_add']='הוספת {extra} שורות';
$ec_lang['lpn_pane_paste_overflow_fit']='הדבקת {fit} השורות המתאימות בלבד';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='בהדבקה זו {n} שורות, ו-{fit} מהן מתאימות לטבלה. את {extra} הנותרות לא ניתן להוסיף כשורות חדשות: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} מזהים אינם תואמים. להדביק בכל זאת?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='שום דבר לא הודבק. {reasons}';
$ec_lang['lpn_pane_paste_more']='שורות עם בעיות שלא מוצגות כאן: {n}.';
$ec_lang['lpn_pane_paste_no_id']='שורה {row}: שורה חדשה זקוקה למזהה.';
$ec_lang['lpn_pane_paste_bad_id']='שורה {row}: למזהה {id} יש רווח או גרש בתוכו.';
$ec_lang['lpn_pane_paste_id_taken']='שורה {row}: המזהה {id} כבר בשימוש.';
$ec_lang['lpn_pane_paste_id_twice']='שורה {row}: המזהה {id} משמש פעמיים בהדבקה זו.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='שורה {row}: צומת חדש זקוק גם ל-{first} וגם ל-{second}.';
$ec_lang['lpn_pane_paste_no_ends']='שורה {row}: קישור חדש זקוק לצומת מ- ולצומת אל.';
$ec_lang['lpn_pane_paste_no_node']='שורה {row}: הצומת {id} עדיין אינו קיים. הדביקו קודם את הצמתים שלכם, ולאחר מכן את הקישורים.';
$ec_lang['lpn_pane_paste_same_ends']='שורה {row}: מ- ואל הם אותו צומת.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='שורה {row}: {text} אינו {col} תקין.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='שורה {row}: טקסט חדש זקוק גם ל-{first} וגם ל-{second}.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='שורה {row}: {id} אינו צומת או צינור ברשת זו עדיין. הדביקו אותו קודם, ולאחר מכן את הטקסט הזה.';
$ec_lang['lpn_pane_paste_customer_no_position']='שורה {row}: לקוח חדש זקוק גם ל-{first} וגם ל-{second}.';
$ec_lang['lpn_pane_paste_no_customer_ref']='שורה {row}: לקוח חדש זקוק לצינור או צומת מחובר.';
$ec_lang['lpn_pane_paste_no_pipe']='שורה {row}: הצינור {id} עדיין אינו קיים. הדביקו קודם את הצינורות שלכם, ולאחר מכן את הלקוחות.';
$ec_lang['lpn_pane_paste_no_customer_node']='שורה {row}: הצומת {id} עדיין אינו קיים. הדביקו קודם את הצמתים שלכם, ולאחר מכן את הלקוחות.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='שורה {row}: לצומת {id} אין צינור שאליו לקוח יכול להתחבר.';


$ec_lang['lpn_pane_filled']='מולאו למטה {n} תאים. {skipped} לא שונו.';
$ec_lang['lpn_pane_filldown']='מילוי למטה';
$ec_lang['lpn_pane_fill_none']='שום דבר בבחירה זו לא ניתן למילוי למטה.';
$ec_lang['lpn_pane_ctrlenter_filled']='מולאו {n} תאים. {skipped} לא שונו.';
$ec_lang['lpn_pane_hide_col']='הסתרת עמודה זו';
$ec_lang['lpn_pane_hide_cols']='הסתרת עמודות אלה';
$ec_lang['lpn_pane_show_all_cols']='הצגת כל העמודות';
$ec_lang['lpn_pane_sort_asc']='מיון עולה';
$ec_lang['lpn_pane_manage_cols']='ניהול עמודות…';
$ec_lang['lpn_pane_manage_cols_title']='ניהול עמודות';
$ec_lang['lpn_pane_manage_cols_show']='הצגה';
$ec_lang['lpn_pane_manage_cols_up']='הזזה למעלה';
$ec_lang['lpn_pane_manage_cols_down']='הזזה למטה';
$ec_lang['lpn_pane_manage_cols_top']='הזזה להתחלה';
$ec_lang['lpn_pane_manage_cols_bottom']='הזזה לסוף';
$ec_lang['lpn_pane_colmenu_tip']='הסתרה או ניהול עמודות';
$ec_lang['lpn_pane_sortarrow_tip']='היפוך סדר המיון';
$ec_lang['lpn_tool_area_window']='בחירת חלון';
$ec_lang['lpn_tool_area_lasso']='בחירת לאסו';
$ec_lang['lpn_tool_area_polygon']='בחירת מצולע';
$ec_lang['lpn_tool_delete']='מחיקה';
$ec_lang['lpn_tool_zoom_extent']='התאמה לתצוגה';
$ec_lang['lpn_tool_zoom_window']='תקריב לחלון';
$ec_lang['lpn_zoom_in']='הגדלה';
$ec_lang['lpn_zoom_out']='הקטנה';
$ec_lang['lpn_new_text']='טקסט';
$ec_lang['lpn_field_text_bold']='טקסט מודגש';
// Justification for a Text object (Task 342). **The standard terms, and nothing invented** (Tom,
// 2026-08-17: "standard English usage would be better... Horizontal justification and Vertical
// justification; you don't even have to mention the anchor point").
//
// **NO SYNONYM ENTRY, and the reason is a rule rather than an omission** (Tom, 2026-08-18: "no syn.
// It's a technical term. We can only give a definition, which is not our job."). $ec_lang_syn holds
// phrases that could STAND ON THE CONTROL in place of the label; a technical term has no such
// alternatives, and what a first draft put there was a definition wearing a synonym's clothes.
// The Text table's own column naming what a Text is attached to (a node or a link ID), read-only:
// attaching and detaching are map gestures, never a typed rename.
$ec_lang['lpn_field_text_anchor']='מחובר אל';
$ec_lang['lpn_field_text_align']='יישור אופקי';
$ec_lang['lpn_field_text_align_left']='שמאל';
$ec_lang['lpn_field_text_align_center']='מרכז';
$ec_lang['lpn_field_text_align_right']='ימין';
$ec_lang['lpn_field_text_valign']='יישור אנכי';
$ec_lang['lpn_field_text_valign_top']='למעלה';
$ec_lang['lpn_field_text_valign_middle']='אמצע';
$ec_lang['lpn_field_text_valign_bottom']='למטה';
$ec_lang['lpn_field_text_rotation']='זווית (מעלות)';
$ec_lang['lpn_field_text_match_pipe']='פנו לזווית הקישור הקרוב ביותר';
$ec_lang['lpn_field_text_flip']='סובב 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='אלמנט מצורף';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='טקסט זה הוצב קרוב מספיק לאלמנט כדי לעקוב אחריו, ולכן הוא זז יחד עם אותו אלמנט ויש לו קו מוביל. טקסט על קו מוביל מקבל את היישור האופקי והאנכי שלו מהצד שבו הוא יושב, ולכן שתי השורות הללו אינן מוצעות כאשר הוא מצורף.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='מקדם מטפטף';
$ec_lang['lpn_field_emitter_tip']='זרימת יציאה נוספת התלויה בלחץ, עבור ממטרה, פתח פתוח, או דליפה מדומה. הספיקה המשתחררת היא מקדם זה כפול הלחץ בחזקת מעריך המטפטף, הנקבע פעם אחת עבור הרשת כולה תחת הגדרות, חישוב, הידראוליקה. השאירו זאת ריק בצומת רגיל.';
$ec_lang['lpn_field_elev']='רום';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
// entry carrying translatable payload nobody on the page can see.
$ec_lang['lpn_field_elev_tip']='רום הקרקע או הצינור בצומת זה. מדדו מכל נקודת אפס שתרצו, כל עוד כל הצמתים משתמשים באותה נקודה.';
// A reservoir carries an elevation AND a head. Leaving the head blank means "the water surface is
// at the reservoir's own elevation"; the placeholder string is what shows in that empty box.
// This USED to read "so it doubles as a tank" (Tom, 2026-07-30), which was true only while there
// was no tank. Since Task 248 there is one, and the two are different assets: a reservoir's level
// never moves, a tank's does. Raising a reservoir's head is still a legitimate thing to do -- it is
// just not how you model storage any more.
$ec_lang['lpn_field_head']='גובה';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='מפלס פני המים במאגר, נמדד כגובה, לא כלחץ. השאירו ריק כדי להציב את פני המים ברום המאגר.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='רום תחתית המכל. עומק המים במכל נמדד כלפי מעלה החל מכאן.';
$ec_lang['lpn_field_tank_level']='עומק מים';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='עומק המים העומדים במכל, נמדד כלפי מעלה החל מתחתית המכל. פני המים הם רום תחתית המכל בתוספת עומק זה.';
$ec_lang['lpn_field_tank_minlevel']='עומק מים מזערי';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='עומק המים שבו המכל נחשב ריק, נמדד כלפי מעלה החל מתחתית המכל.';
$ec_lang['lpn_field_tank_maxlevel']='עומק מים מרבי';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='עומק המים שבו המכל מלא, נמדד כלפי מעלה החל מתחתית המכל.';
$ec_lang['lpn_field_tank_diameter']='קוטר המכל';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='רוחב המכל מצד לצד. הוא ביחידות רום, לא ביחידות קוטר הצינורות. הוא קובע כמה מים עומק נתון מחזיק.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='רום פני המים במכל: רום תחתית המכל בתוספת עומק המים. זהו הערך שהפותר משתמש בו עבור המכל.';
$ec_lang['lpn_close']='סגור';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='מאפיינים';
$ec_lang['lpn_empty_hint']='השתמשו בקובץ, פרויקט חדש כדי לפתוח דוגמה. או התחילו בהוספת מאגר, צומת וצינור מסרגל הכלים.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='הרשת שלכם שלמה.';
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
$ec_lang['lpn_examples_welcome']='ברוכים הבאים למידול רשתות אספקת מים, עם פותר EPANET';
$ec_lang['lpn_examples_heading']='פתחו עותק משלכם של דוגמה';
$ec_lang['lpn_examples_sub']='כל דוגמה נפתחת כעותק משלכם. שנו אותה, שמרו אותה, או פתחו עותק חדש והתחילו מחדש.';
$ec_lang['lpn_examples_open']='פתח';
$ec_lang['lpn_examples_menu']='פתיחת דוגמה…';
$ec_lang['lpn_examples_blank']='או התחילו כאן';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='צמתים: {nodes}, קישורים: {links}';
$ec_lang['lpn_examples_failed']='לא ניתן היה לטעון את הדוגמאות. השתמשו בקובץ, פרויקט חדש כדי להתחיל שרטוט.';
$ec_lang['lpn_examples_loading']='טוען דוגמאות…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='תיקון בעיה';
$ec_lang['lpn_help_notes']='הערות על עמוד זה';
$ec_lang['lpn_help_hotkeys']='טבלאות ומקשי קיצור';
$ec_lang['lpn_hotkeys_tables_heading']='טבלאות';
$ec_lang['lpn_hotkeys_map_heading']='מפה';
$ec_lang['lpn_hotkeys_map_term']='קיצורי מקלדת למפה';
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>1 או Esc</td><td>בחירה.</td></tr><tr><td>2</td><td>הוספת צומת.</td></tr><tr><td>3</td><td>הוספת מאגר.</td></tr><tr><td>4</td><td>הוספת מכל.</td></tr><tr><td>5</td><td>הוספת צינור.</td></tr><tr><td>6</td><td>הוספת משאבה.</td></tr><tr><td>7</td><td>הוספת שסתום.</td></tr><tr><td>8</td><td>הוספת לקוח.</td></tr><tr><td>9</td><td>הוספת טקסט.</td></tr><tr><td>Delete</td><td>מחיקת הבחירה.</td></tr><tr><td>Ctrl+Z</td><td>ביטול השינוי האחרון.</td></tr><tr><td>+ או =</td><td>התקרבות.</td></tr><tr><td>-</td><td>התרחקות.</td></tr></tbody></table>';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='משהו לא בסדר כאן?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='לחיצה אחת אומרת לנו שמשהו בעמוד זה שגוי. היא שולחת את שם העמוד הזה, השפה שבה אתם קוראים אותו, וההודעה על המפה אם יש כזו. היא אינה שולחת דבר שהקלדתם, שום כתובת, ושום דבר מהשרטוט שלכם. איש אינו יכול להשיב, משום שזה אינו מספר לנו דבר על מי שאתם. השתמשו בעזרה, תקנו משהו כשתרצו לומר יותר.';
$ec_lang['lpn_wrong_thanks']='תודה. זה הגיע אלינו.';
$ec_lang['lpn_status_example_opened']='{name} נפתח. זהו עותק שלכם: שמרו אותו באמצעות קובץ, שמור בשם.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='עמוד זה לא הצליח לחשב את גודל אזור השרטוט, ולכן המפה מציגה את התצוגה האחרונה שהצליח לחשב. שינוי גודל החלון גורם לו לנסות שוב. אם זה ממשיך לקרות, הגורם הרגיל הוא תוסף דפדפן החוסם מדידות עמוד.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='רשת בסיסית, L/s (מטרי)';
$ec_lang['lpn_ex_basic_si_desc']='התחילו כאן. מאגר, משאבה וטבעת קטנה: הסידור הקטן ביותר שעדיין פועל כרשת מים. ליטרים לשנייה, עם מטרים ומילימטרים.';
$ec_lang['lpn_ex_basic_us_title']='רשת בסיסית, gpm (ארה"ב)';
$ec_lang['lpn_ex_basic_us_desc']='אותה רשת פתיחה בגלונים לדקה, עם רגל ואינץ׳.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 בתוספת בקרות מבוססות-חוקים';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='הקטנה מבין שלוש רשתות הדוגמה של EPANET עצמו: מאגר אחד, משאבה וטבעת יחידה.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='מערכת חלוקה מסועפת עם מכל, מתוך דוגמאות EPANET.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='הדוגמה הגדולה של EPANET: 92 צמתים, 3 מכלים ו-2 מאגרים, אחד מהם נהר. כדאי לפתוח כדי לראות איך נראה על המפה מודל בגודל אמיתי.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='רשת EPANET Net3 הומרה לקו רוחב/קו אורך באזור נובאטו, קליפורניה, עם מפת העולם מוצגת מאחוריה.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='אתר מסחרי שנפתר עבור ספיקת כיבוי אש בנוסף לדרישת יום השיא, ברגע זמן אחד, משורטט מעל תוכנית האתר.';
$ec_lang['lpn_tool_undo']='בטל';
$ec_lang['lpn_confirm_example']='פעולה זו מוסיפה את הדוגמה לרשת שכבר יש לכם. להמשיך?';
$ec_lang['lpn_field_diameter']='קוטר';
$ec_lang['lpn_demand_tip']='ספיקה הנלקחת מהרשת בצומת זה. הזינו מספר שלילי עבור ספיקה המוזנת לרשת כאן.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='יחידה זו קובעת מה המספרים שלכם אומרים';
$ec_lang['lpn_units_warn_lead']='{unit} היא היחידה של מה שאתם מזינים עבור:';
$ec_lang['lpn_units_options_head']='כאשר משנים יחידה:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='לא הרסני';
$ec_lang['lpn_units_nondestructive_desc']='לא הרסני: משאיר כל קלט כפי שהוא ומפרש אותו מחדש ביחידה החדשה.';
$ec_lang['lpn_units_destructive']='הרסני';
$ec_lang['lpn_units_destructive_desc']='הרסני: כותב מחדש כל קלט בהמרה מתמטית, כך שהרשת נשארת קרובה פיזית לאותה רשת, בגבולות דיוק ההמרה. הקלט המקורי אובד. ביטול (Undo) מחזיר אותו.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n} ערכים משמעותם כעת {unit}. שום דבר לא נכתב מחדש.';
$ec_lang['lpn_status_converted']='{n} ערכים נכתבו מחדש ל-{unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_color_tip']='צביעת הרשת לפי גודל אחד, כך שמפה גדולה ניתנת לקריאה במבט אחד. לחץ ומהירות הם השניים החשובים בדרך כלל.';
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='אורך';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='קואורדינטות מפה';
$ec_lang['lpn_units_mapcoords_deg']='מעלות';
$ec_lang['lpn_units_usft']='רגל-מדידה אמריקאית (US survey ft)';
$ec_lang['lpn_units_elevhead']='רום וגובה';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='שיפוע אובדן הגובה';
$ec_lang['lpn_result_gradient_tip']='אובדן הגובה מחולק באורך הצינור. השתמשו בו כדי להשוות צינורות באורכים שונים מול מגבלת תכנון אחת.';
$ec_lang['lpn_result_water_age']='גיל המים';
$ec_lang['lpn_result_water_age_tip']='כמה זמן המים המגיעים לנקודה זו נמצאים במערכת. במקום שבו זרימות נפגשות, המים המגיעים נושאים תערובת של גילים, והמספר כאן הוא הממוצע שלהם משוקלל לפי ספיקה: צומת המוזן בעיקר מקו ראשי קצר וחדש מראה גיל נמוך גם אם מבוי סתום ארוך גם הוא מזין אותו. במכל זהו גיל ממוצע של המים המוחזקים, ולכן מכל המתחלף לאט הוא בדרך כלל המים העתיקים ביותר ברשת. אין מגבלה רגולטורית שאפשר להשוות אליה, כך שיש לשפוט את המספר ביחס למערכת שלכם.';
$ec_lang['lpn_result_source_share']='חלק מקור';
$ec_lang['lpn_result_source_share_tip']='כמה מהמים המגיעים לנקודה זו הגיעו מצומת המעקב. זה מה שניתוח מעקב המקור מדווח.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='גיל מים ממוצע';
$ec_lang['lpn_result_avg_source_share']='חלק מקור ממוצע';
$ec_lang['lpn_result_avg_concentration']='ריכוז ממוצע';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='מקדם חיכוך';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='קצב תגובה';
$ec_lang['lpn_result_status']='מצב';
$ec_lang['lpn_result_status_open']='פתוח';
$ec_lang['lpn_result_status_closed']='סגור';
$ec_lang['lpn_result_head']='גובה';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='אנרגיית המים בצומת זה (העומד), רשומה כגובה טור מים. זהו גובה מוחלט, ואילו הלחץ הוא מדידת מד.';
$ec_lang['lpn_result_pressure']='לחץ';
$ec_lang['lpn_result_flow']='ספיקה';
$ec_lang['lpn_result_velocity']='מהירות';
$ec_lang['lpn_result_headloss']='אובדן גובה';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='מאפס את ההגדרות של פרויקט זה בלבד. השרטוט שלכם והפרויקטים האחרים שלכם אינם משתנים. כדי לשמור את ההגדרות המועדפות עליכם לשימוש חוזר, שמרו קובץ פרויקט שמכיל רק הגדרות.';
$ec_lang['lpn_reset_all_tip']='מוחק כל פרויקט, כל תמונת רקע, כל הגדרה, ואת בחירות היחידות שלכם, ואז טוען מחדש את העמוד בדיוק כפי שמבקר חדש רואה אותו. זהו האיפוס היחיד שמנקה הכול.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='מחשבון זה שומר יחידות פרויקט ונתוני קלט כפי שהוזנו, אך בעבר הוא המיר מספרים ליחידות SI לצורך אחסון. פרויקט זה נשמר לפני השינוי, כך שהמספרים בו נשמרו ביחידות SI. להמיר אותם פעם אחרונה ליחידות הנוכחיות? כדי שתוכלו לשפוט, הנה כמה קטרים שיומרו, עם ערכיהם לפני ואחרי:';
$ec_lang['lpn_v2_restore_yes']='המר';
$ec_lang['lpn_v2_restore_never']='לא. אל תשאל שוב.';
$ec_lang['lpn_v2_restore_no']='סגור כדי שאבדוק תחילה את היחידות הנוכחיות';
$ec_lang['lpn_storage_too_new']='פרויקט זה נשמר בגרסה חדשה יותר של העמוד, ולכן לא ניתן לפתוח אותו כאן.';
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
$ec_lang['lpn_tool_file']='קובץ';
$ec_lang['lpn_menu_edit']='עריכה';
$ec_lang['lpn_menu_insert']='הוספה';
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
$ec_lang['lpn_menu_map']='מפה';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='הצג מפת רחובות';
$ec_lang['lpn_basemap_satellite_show']='הצג תצלומי לוויין';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='בעל ייחוס גיאוגרפי';
$ec_lang['lpn_xymap']='מקומי';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='המרה בשם…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='עותק של {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='המרה בשם';
$ec_lang['lpn_convas_coordsys_tip']='מערכת הקואורדינטות שאליה העותק מומר. כאשר היא שונה מזו של פרויקט זה, שני שלבי מיקום מתבצעים בהמשך. פרויקט שכבר יודע היכן הוא נמצא פותח את שני השלבים כשהם כבר עונים, כך שתוכלו לקבל אותם כפי שהם או לבצע שינויים.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='נוכחי: {crs}';
$ec_lang['lpn_convas_epsg']='מערכת קואורדינטות EPSG';
$ec_lang['lpn_convas_epsg_tip']='בחרו מערכת קואורדינטות מרישום EPSG. קו רוחב וקו אורך הם WGS 84 (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='ייחוס גיאוגרפי מקומי ללא שם';
$ec_lang['lpn_convas_unnamed_tip']='קואורדינטות מקומיות ביחידת האורך, עם מפת העולם מחוברת.';
$ec_lang['lpn_convas_none_tip']='קואורדינטות מקומיות ביחידת האורך, ללא מפת עולם לעת עתה.';
$ec_lang['lpn_convas_units_tip']='היחידות שאליהן העותק מומר. המקור שומר על המספרים והיחידות שלו.';
$ec_lang['lpn_convas_round']='עיגול ערכים שהומרו';
$ec_lang['lpn_convas_round_tip']='מעגל רק את המספרים שהמרה זו כותבת מחדש, לצעד הקרוב ביותר שתבחרו. ערכים שהיחידה שלהם אינה משתנה נשארים כפי שהם.';
$ec_lang['lpn_convas_round_none']='ללא עיגול';
$ec_lang['lpn_convas_round_flow']='דרישה וספיקה';
$ec_lang['lpn_convas_label_col']='סיומת';
$ec_lang['lpn_convas_label_tip']='טקסט המתווסף אחרי ערך זה בתוויות המפה של העותק, כגון \' mm\' או \' gpm\'. ממולא מראש מהיחידה שנבחרה למעלה; נקו אותו כדי שלא תהיה סיומת.';
$ec_lang['lpn_convas_oneway']='המרה בחזרה היא המרה שנייה, לא ביטול. מספר שהומר והומר בחזרה עשוי שלא לחזור בדיוק כפי שהוקלד.';
$ec_lang['lpn_convas_ok']='המרה';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} היא אחת ממעט מערכות הקואורדינטות המופיעות ברשימה בלי מידע הטלה שמיש, כך שלא ניתן להמיר אליה או ממנה. שום דבר לא הומר.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='העותק שהומר הוא {name}. הפרויקט המקורי לא השתנה.';
$ec_lang['lpn_convas_cancelled']='שום דבר לא הומר. העותק נסגר, והפרויקט המקורי לא השתנה.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='מעתיק פרויקט זה ללשונית חדשה וממיר את העותק למערכת הקואורדינטות וליחידות שתבחרו. כאשר מערכת הקואורדינטות משתנה, אשף מדריך אתכם דרך הגדלה או הקטנה בקירוב של המפה שמאחורי הרשת שלכם, ולאחר מכן שינוי קנה מידה וסיבוב מדויקים יותר של הרשת על המפה. פרויקט זה נשאר בדיוק כפי שהוא. כדי לתת ייחוס גיאוגרפי בלי להמיר דבר, השתמשו במקום זאת ב-מפה, מפת העולם, צירוף.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='פרויקט זה כבר בעל ייחוס גיאוגרפי, כך שהרשת כבר נמצאת על המפה ושום דבר לא הוזז. בדקו שהיא במקום הנכון, ולאחר מכן לחצו על כפתור הנח את המודל כאן ועל כפתור שמור מיקום זה.';
$ec_lang['lpn_georef_intro']='מיקום המודל דורש שני שלבים. שלב 1 הוא המהיר: המודל נשאר במקומו ואתם מזיזים את המפה שמאחוריו, עד שהאתר שלכם נמצא מתחת למודל בערך בגודל הנכון. אין עדיין סיבוב. שלב 2 הוא המדויק: אתם גוררים, משנים גודל ומסובבים את המודל עצמו. הפרויקט שלכם נמצא בהתחלה על מפה של כל העולם, אז מצאו קודם את המיקום שלכם, ואז לחצו על כפתור הנח את המודל כאן.';
$ec_lang['lpn_georef_adjust']='המודל נמצא כעת על הקרקע, כך שהוא זז יחד עם המפה. גררו את המודל כדי להזיז אותו, גררו פינה כדי לשנות את גודלו, גררו את הידית העגולה מעל המודל כדי לסובב אותו. או הקלידו את המרחק על הקרקע ואת זווית הסיבוב למטה.';
$ec_lang['lpn_georef_step1']='שלב 1 מתוך 2 — מהיר';
$ec_lang['lpn_georef_step2']='שלב 2 מתוך 2 — מדויק';
$ec_lang['lpn_georef_step1_hint']='הפרויקט שלכם נשאר במקומו על המסך. גללו והגדילו את המפה שמתחתיו עד שהשטח שמאחוריו נמצא בערך במקום הנכון ובערך בגודל הנכון, ואז לחצו על כפתור הנח את המודל כאן.';
$ec_lang['lpn_georef_detach']='הרימו אותו שוב';
$ec_lang['lpn_georef_size_prompt']='בערך כמה רחב האתר, על פני כל הפרויקט?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name}: {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='קיצור דרך: לחצו על {key}.';
$ec_lang['lpn_tool_key_hint_two']='קיצור דרך: הקישו {key} או {key2}.';
$ec_lang['lpn_tool_add_junction_tip']='לחצו על המפה כדי להוסיף צומת: נקודה שבה צינורות נפגשים או שבה נעשה שימוש במים.';
$ec_lang['lpn_tool_add_reservoir_tip']='לחצו על המפה כדי להוסיף מאגר: מקור אינסופי בעל מפלס מים קבוע.';
$ec_lang['lpn_tool_add_tank_tip']='לחצו על המפה כדי להוסיף מכל: אחסון שמפלס המים בו עולה ויורד ככל שהוא מתמלא ומתרוקן.';
$ec_lang['lpn_tool_add_pipe_tip']='לחצו על צומת ואז על צומת נוסף כדי לצייר צינור ביניהם.';
$ec_lang['lpn_tool_add_pump_tip']='לחצו על צומת ואז על צומת נוסף כדי להציב משאבה ביניהם.';
$ec_lang['lpn_tool_add_valve_tip']='לחצו על צומת ואז על צומת נוסף כדי להציב שסתום ביניהם.';
$ec_lang['lpn_tool_add_text_tip']='לחצו על המפה כדי לכתוב הערה על השרטוט.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='לחצו על המפה כפי שמצוין כדי לבחור את כל מה שבתוך הצורה. לחצו שוב על כפתור זה כדי להחליף את הצורה בין חלון, לאסו ומצולע. החזיקו את Shift בזמן הבחירה כדי להמשיך עם הבחירה הקיימת, ולהוסיף או להסיר (החלפה) את מה שאתם בוחרים.';
$ec_lang['lpn_area_selected']='{n} נבחרו.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='לא נמצא דבר באזור זה.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='הוסיפו והסירו את נקודות העיקול המעצבות צינור על המפה. לחצו על צינור כדי להוסיף נקודת עיקול, לחצו על נקודת עיקול כדי להסיר אותה, וגררו נקודת עיקול כדי להזיז אותה. נקודת עיקול משנה רק את המסלול המצויר, לא את ההידראוליקה.';
$ec_lang['lpn_tool_delete_tip']='לחצו על כל דבר על המפה כדי להסיר אותו.';
$ec_lang['lpn_tool_undo_tip']='ביטול השינוי האחרון.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='התאמת הרשת כולה לחלון.';
$ec_lang['lpn_tool_zoom_window_tip']='לחצו על שתי פינות מנוגדות של תיבה, או גררו אחת, על המפה כדי להגדיל אליה. לחצו שוב על כפתור זה עבור התאמה לתצוגה.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='הגדלה. קיצור: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='הקטנה. קיצור: -';
$ec_lang['lpn_tool_settings_tip']='פתיחת ההגדרות של פרויקט זה.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='מצאו אלמנט לפי המזהה שלו, או מצאו כל אלמנט העונה על תנאי, ושנו את כולם בבת אחת.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='מקרא סרגל הכלים';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='נראות';
$ec_lang['lpn_pane_right_toggle_tip']='הצגה או הסתרה של הלוח מימין למפה. הוא מחזיק את בחירות התוויות והצבעים.';
$ec_lang['lpn_color_legend_open_tip']='לחצו כדי לפתוח את לוח הנראות ולשנות צבעים אלה.';
$ec_lang['lpn_color_node_field']='צביעת צמתים לפי';
$ec_lang['lpn_color_link_field']='צביעת צינורות לפי';
$ec_lang['lpn_color_ramp_sequential']='רציף';
$ec_lang['lpn_color_ramp_diverging']='מתפצל';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='מספר טווחים';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='הקצאת טווחים';
$ec_lang['lpn_color_ranges_note']='הגבולות שלמטה קבועים לאחר שנקבעו; הם אינם עוקבים אחר התוצאות כשהן משתנות. בחירת שיטת סיווג נתונים למעלה קובעת את הגבולות ממצב המערכת הנוכחי. אם תשנו ערך כלשהו ביד, השיטה למעלה תהפוך לידני.';
$ec_lang['lpn_color_criterion_note']='שיטה זו לוקחת את הגבולות שלה מתקן תכנון, כך שמספר הצבעים קבוע כל עוד שיטה זו נבחרה.';
$ec_lang['lpn_color_break_number']='גבול חייב להיות מספר. המפה לא השתנתה.';
$ec_lang['lpn_color_break_order']='כל גבול חייב להיות גדול מזה שלפניו. המפה לא השתנתה.';
$ec_lang['lpn_color_break_count']='חייב להיות גבול אחד פחות ממספר הצבעים. המפה לא השתנתה.';
$ec_lang['lpn_color_ramp_qualitative']='איכותני';
$ec_lang['lpn_color_ramp_rainbow']='קשת';
$ec_lang['lpn_color_ramp_rainbow_eg']='תואם ל-EPANET';
$ec_lang['lpn_color_example_material']='חומר';
$ec_lang['lpn_color_ramp_ylgnbu']='צהוב לכחול';
$ec_lang['lpn_color_ramp_rdylbu']='אדום לכחול, דרך צהוב';
$ec_lang['lpn_georef_drop']='הנח את המודל כאן';
$ec_lang['lpn_georef_finish']='שמור מיקום זה';
$ec_lang['lpn_georef_scale']='מרחק בשטח ליחידת שרטוט';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='כמה רחוק מגיעה יחידה אחת של השרטוט שלכם בשטח. שרטוט שנעשה על רשת פשוטה בדרך כלל אינו אומר דבר על כך, אז קבעו זאת כאן — או תנו ל-עבור אל… לשאול אתכם כמה רחב האתר ולחשב זאת.';
$ec_lang['lpn_georef_rotation']='סיבוב נגד כיוון השעון (מעלות)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='כמה לסובב את המודל כולו, נגד כיוון השעון, כך שהצפון שלו יצביע צפונה.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='להניח את המודל כאן לצמיתות? עדיין תוכלו לגרור אלמנטים בודדים אחר כך, אך השרטוט מפסיק להיות פרויקט xy. כדי להחזיר xy, סגרו פרויקט זה בלי לשמור.';
$ec_lang['lpn_georef_done']='זהו כעת פרויקט lat/lon. גררו כל אלמנט כדי להזיז אותו קרוב יותר למקום שבו הוא נמצא באמת.';
$ec_lang['lpn_georef_backdrop_unrotated']='תמונת הרקע הוזזה ושונה בגודלה יחד עם המודל, אך לא ניתן היה לסובב אותה. השתמשו ב-מפה, תמונת רקע, הזזה כדי ליישר אותה.';
$ec_lang['lpn_georef_empty']='לקובץ הזה אין רשת, כך שאין מה להניח.';
$ec_lang['lpn_georef_unavailable']='כלי המיקום לא נטען. טענו את העמוד מחדש ונסו שוב.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='סיימו את המיקום עם כפתור "שמור מיקום זה", או לחצו ביטול, לפני שתעברו לפרויקט אחר. המיקום שייך לפרויקט זה ואינו יכול ללוות אתכם לפרויקט אחר.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='סיימו את המיקום בעזרת הכפתור "שמרו מיקום זה", או לחצו על ביטול, לפני השמירה. הפרויקט עדיין נמצא בתהליך מיקום, כך שמה שמוצג על המסך אינו עדיין מה שייכתב לקובץ.';
$ec_lang['lpn_goto_menu']='עבור אל קו רוחב וקו אורך…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_tip']='הזיזו את המפה למקום שכבר יש לכם קואורדינטות עבורו. קו רוחב תחילה, ואז קו אורך, בסדר שבו מפה נותנת אותם, עם רווח ביניהם: 38 -122';
$ec_lang['lpn_goto_prompt']='קו רוחב וקו אורך, בסדר הזה';
$ec_lang['lpn_goto_bad']='זה אינו קו רוחב אחד וקו אורך אחד. נסו 38 -122, עם רווח ביניהם.';
$ec_lang['lpn_georef_goto']='עבור אל…';
$ec_lang['lpn_georef_twopt']='השתמשו בשתי נקודות ידועות';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='הציבו את המודל במדויק, כאשר אתם כבר יודעים היכן שתי נקודות בשרטוט שלכם נמצאות באמת. לחצו על אחת מהן, הקלידו את קו הרוחב וקו האורך שלה, ואז עשו את אותו הדבר עבור נקודה שנייה. המיקום, קנה המידה והסיבוב כולם נגזרים משתי הנקודות האלה. לחצו שוב על כפתור זה כדי להפסיק לבחור.';
$ec_lang['lpn_georef_twopt_pick1']='לחצו על נקודה בשרטוט שלכם שאת קו הרוחב וקו האורך שלה אתם יודעים.';
$ec_lang['lpn_georef_twopt_pick2']='עכשיו לחצו על נקודה ידועה שנייה, רחוקה ככל האפשר מהראשונה.';
$ec_lang['lpn_georef_twopt_same']='זו הנקודה שבחרתם ראשונה. בחרו נקודה אחרת.';
$ec_lang['lpn_georef_twopt_done']='המודל יושב כעת על שתי הנקודות שנתתם. בדקו אותו, ואז לחצו על כפתור שמרו את המיקום הזה.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='לוח תחתון';
$ec_lang['lpn_pane_toggle_tip']='הצגה או הסתרה של הלוח מתחת למפה. הוא מחזיק את הפרופיל וטבלה עבור כל סוג חלק.';
$ec_lang['lpn_pane_resize']='גררו כדי להפוך את הלוח לגבוה או נמוך יותר';
$ec_lang['lpn_pane_tab_junctions']='צמתים';
$ec_lang['lpn_pane_tab_reservoirs']='מאגרים';
$ec_lang['lpn_pane_tab_tanks']='מכלים';
$ec_lang['lpn_pane_tab_pipes']='צינורות';
$ec_lang['lpn_pane_tab_pumps']='משאבות';
$ec_lang['lpn_pane_tab_valves']='שסתומים';
$ec_lang['lpn_pane_tab_tip']='לשונית זו מציגה את האלמנטים מסוג זה כטבלה שניתן למיין ולערוך. לא ניתן לערוך עמודות תוצאה.';
$ec_lang['lpn_pane_none']='לרשת זו אין עדיין אף אחד מאלה.';
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
$ec_lang['lpn_pane_text_attached']='מצורף';
$ec_lang['lpn_pane_not_used']='לא בשימוש';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='מסונן לפי {q}. מוצגים {n} מתוך {all}.';
$ec_lang['lpn_pane_filter_clear']='הצג הכול';
$ec_lang['lpn_pane_filter_stale']='שורות שאינן תואמות עוד: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='שום דבר בטבלה זו אינו תואם למסנן.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='התקרבות ובחירה';
$ec_lang['lpn_goto_on_map']='הצגה במפה';
$ec_lang['lpn_pane_select_on_map']='בחירה במפה';
$ec_lang['lpn_pane_unselect_on_map']='ביטול בחירה במפה';
$ec_lang['lpn_pane_print']='הדפסת טבלה';
$ec_lang['lpn_pane_print_tip']='הדפיסו את הטבלה שאתם רואים כעת, עם שם הפרויקט, שם הטבלה, והיחידות בכותרות. השורות מודפסות בסדר שמיינתם אותן אליו.';

// **HIDE MAP READOUTS IS RETIRED, 2026-09-22** (Tom: "Hide map readouts was a print prep command.
// But it isn't very useful any more. Let's remove it."). lpn_clean_map, lpn_clean_map_off and
// lpn_clean_map_tip were deleted with the row; nothing else read them.
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
$ec_lang['lpn_menu_project']='מים';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='כל מה שקשור למידול רשת המים נמצא כאן במקום אחד, מלבד פקדי ההפעלה של ההנפשה. אין צורך לנחש איפה הדברים נמצאים.';
$ec_lang['lpn_tables_menu']='טבלאות';
$ec_lang['lpn_tables_menu_tip']='פתחו את הלוח שמתחת למפה על טבלה של החלקים ברשת זו. יש טבלה אחת לכל סוג חלק, וניתן למיין ולערוך אותה שם.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='חשבו רשת זו מחדש כעת. מחפשים את כפתור חשב? הוא מוסתר בעוד ההגדרה חשב מחדש אוטומטית מופעלת. כדי להחזיר את הכפתור, כבו את חשב מחדש אוטומטית בהגדרות, תחת חישוב, הידראוליקה.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='חשב מחדש אוטומטית';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='כאשר זה מופעל, פרויקט זה מחושב מחדש זמן קצר אחרי כל שינוי שאתם עושים, וכפתור החישוב מוסר מסרגל הכלים כי לא נשאר לו מה לעשות. כבו זאת ברשת גדולה שבה ההמתנה לחישוב מחדש אחרי כל שינוי מפריעה להקלדה, וכפתור החישוב יחזור כדי שתבחרו מתי להריץ.';
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
$ec_lang['lpn_time_run_slow']='חישוב רשת זו ארך {secs} שנ׳, והיא מוגדרת להיות מחושבת מחדש אחרי כל שינוי. כדי לעצור זאת ולקבל בחזרה כפתור חישוב, כבו את ”חשב מחדש אוטומטית” בהגדרות, תחת חישוב, הידראוליקה.';
$ec_lang['lpn_time_no_report']='עדיין אין דוח הרצה. הדוח הוא הטקסט של EPANET עצמו, כך שהוא מופיע לאחר שרשת זו חושבה בעזרת פותר EPANET.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='עזרה';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='גלריית צילומי מסך';
$ec_lang['lpn_help_walkthroughs']='מדריכים';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='מחק רשת';
$ec_lang['lpn_confirm_delete_network']='למחוק כל צומת, צינור ותווית טקסט בפרויקט זה? תמונת הרקע, שם הפרויקט וההגדרות שלכם יישמרו. לא ניתן לבטל פעולה זו.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='חיפוש והחלפה';
$ec_lang['lpn_find_title']='חיפוש והחלפה';
$ec_lang['lpn_find_scope']='מה לחפש';
$ec_lang['lpn_find_scope_all']='הכול';
$ec_lang['lpn_find_property']='מאפיין';
$ec_lang['lpn_find_condition']='תנאי';
$ec_lang['lpn_find_value']='ערך';
$ec_lang['lpn_find_btn']='חפש';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='סינון בטבלה הנוכחית';
$ec_lang['lpn_find_filter_tip']='הצג רק את החלקים התואמים לשאילתה זו באחת מהטבלאות שמתחת למפה. השרטוט אינו משתנה ושום דבר אינו נמחק.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} מתוך {all}';
$ec_lang['lpn_find_filter_summary']='סונן לפי {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='שאילתה זו אינה חלה על אף טבלה.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='מכיל';
$ec_lang['lpn_find_op_equals']='שווה ל';
$ec_lang['lpn_find_op_gt']='גדול מ';
$ec_lang['lpn_find_op_lt']='קטן מ';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='ריק';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} נמצאו. לחצו על אחד כדי לעבור אליו.';
$ec_lang['lpn_find_shift_hint']='Shift+לחיצה כדי להחליף: הוספה אם אינו בבחירה, הסרה אם כבר נמצא בבחירה.';
$ec_lang['lpn_find_none']='שום דבר לא תאם.';
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
$ec_lang['lpn_find_op_top']='{n} הגבוהים ביותר';
$ec_lang['lpn_find_op_bottom']='{n} הנמוכים ביותר';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='הקלידו מה לחפש.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='קישוריות';
$ec_lang['lpn_find_prop_demand_desc']='תיאור קטגוריית דרישה זו';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='אין קישורים בצומת';
$ec_lang['lpn_find_op_conn_noopen']='אין קישורים פתוחים בצומת';
$ec_lang['lpn_find_op_conn_nolinksource']='אין מסלול קישורים למקור';
$ec_lang['lpn_find_op_conn_noopensource']='אין מסלול פתוח למקור';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='כל צומת מחובר.';
$ec_lang['lpn_find_conn_no_fixed']='לרשת זו אין מאגר או מכל, כך שאין מקור להגיע אליו. ניתן לחפש רק אין קישורים בצומת ואין קישורים פתוחים בצומת.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='אותו חיפוש, כתוב כשורה אחת. שינוי הבקרות כותב מחדש את השורה הזו, והקלדה בשורה הזו מעדכנת את הבקרות.';
$ec_lang['lpn_find_query_label']='שאילתה';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='שלבו תנאים באמצעות וגם, או ו-()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='וגם';
$ec_lang['lpn_find_q_or']='או';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='הבקרות אינן יכולות לבטא את השאילתה שלמטה, ולכן הן מוסתרות.';
$ec_lang['lpn_find_q_restore']='השתמשו בבקרות במקום';
$ec_lang['lpn_replace_q_bad']='לא ניתן להבין שאילתה זו, ולכן שום דבר לא ישתנה. תקנו אותה למעלה תחילה.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(בתו {n})';
$ec_lang['lpn_find_q_err_empty']='השאילתה ריקה, ולכן שום דבר לא יחופש.';
$ec_lang['lpn_find_q_err_scope']='אין דבר בשם {w} לחפש בו. נסו אחד מאלה: {list}';
$ec_lang['lpn_find_q_err_dot']='שימו נקודה בין מה שמחפשים לבין המאפיין שלו, כגון Junction.ID';
$ec_lang['lpn_find_q_err_prop']='לא מאפיין של {scope}: {w}. נסו אחד מאלה: {list}';
$ec_lang['lpn_find_q_err_op']='לא תנאי עבור {prop}: {w}. נסו אחד מאלה: {list}';
$ec_lang['lpn_find_q_err_value']='תנאי זה דורש ערך אחריו: {op}';
$ec_lang['lpn_find_q_err_quote']='שימו מירכאות סביב ערך טקסט: {w} אינו מספר.';
$ec_lang['lpn_find_q_err_quote_end']='לטקסט המצוטט הזה אין מירכאות סוגרות.';
$ec_lang['lpn_find_q_err_close']='הסוגריים ( נפתחו ולא נסגרו מעולם.';
$ec_lang['lpn_find_q_err_open']='הסוגריים ) האלה לא סוגרים כלום.';
$ec_lang['lpn_find_q_err_end']='לא היה צפוי דבר אחרי זה. חברו שני חיפושים עם {and} או {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='שינוי מה שנמצא';
$ec_lang['lpn_replace_prop']='מאפיין לשינוי';
$ec_lang['lpn_replace_value']='ערך חדש';
$ec_lang['lpn_replace_source']='מקור הערך החדש';
$ec_lang['lpn_replace_asked']='התבקשו רומים עבור {n} צמתים. התוצאות בדרך.';
$ec_lang['lpn_replace_btn']='החלף';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='לשנות {n} אלמנטים?';
$ec_lang['lpn_replace_apply']='שנה אותם';
$ec_lang['lpn_replace_done']='{n} אלמנטים שונו. ניתן לבטל זאת בפעולה אחת.';
$ec_lang['lpn_replace_none']='שום דבר לא ישתנה.';
$ec_lang['lpn_replace_no_value']='הקלידו את הערך החדש.';
$ec_lang['lpn_replace_scope']='בחרו סוג אלמנט אחד למעלה כדי לשנות עליו ערכים.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='פרופיל';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_tip']='ציור פני הקרקע וקו האנרגיה ההידראולי לאורך מסלול ברשת.';
$ec_lang['lpn_profile_title']='פרופיל לאורך מסלול';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='לחצו על הצומת שבו המסלול מתחיל.';
$ec_lang['lpn_profile_draw_more']='הזיזו את העכבר על המפה כדי לראות את המסלול. לחצו על צומת כדי להוסיף אותו. לחיצה כפולה מסיימת. Esc מבטל.';
$ec_lang['lpn_profile_draw_blocked']='אין מסלול מ-{a} אל {b}. בחרו צומת אחר.';
$ec_lang['lpn_profile_tap_start']='הקישו על הצומת שבו המסלול מתחיל.';
$ec_lang['lpn_profile_tap_more']='הקישו על צומת כדי לראות את המסלול. לחצו והחזיקו כדי להוסיף אותו. הקשה כפולה מסיימת. לחצו שוב על פרופיל כדי לבטל.';
$ec_lang['lpn_profile_say_idle']='לחצו שוב על פרופיל כדי לבחור מסלול חדש על המפה.';
$ec_lang['lpn_profile_none']='אין עדיין מסלול. לחצו שוב על פרופיל כדי לבחור אחד על המפה.';
$ec_lang['lpn_profile_choose']='בחרו צומת התחלה וצומת סיום.';
$ec_lang['lpn_profile_no_path']='שני צמתים אלה אינם מחוברים על ידי אף מסלול.';
$ec_lang['lpn_profile_no_solve']='אין עדיין תוצאות, כך שרק קו הקרקע מצויר.';
$ec_lang['lpn_profile_summary']='צמתים: {n}, אורך: {len} {u}';
$ec_lang['lpn_profile_axis_station']='מרחק לאורך המסלול ({u})';
$ec_lang['lpn_profile_axis_elev']='רום וגובה ({u})';
$ec_lang['lpn_profile_ground']='פני הקרקע';
$ec_lang['lpn_profile_hgl']='קו האנרגיה ההידראולי';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='עריכה';
$ec_lang['lpn_profile_edit_tip']='שנו קצה אחד של המסלול, או הסירו ממנו צומת אחד, בלי לצייר את כל המסלול מחדש.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='גררו כל נקודה במסלול כדי להזיז אותה. לחצו על נקודה שהוספתם כדי להסיר אותה.';
$ec_lang['lpn_profile_edit_tap']='גררו כל נקודה במסלול כדי להזיז אותה. הקישו על נקודה שהוספתם כדי להסיר אותה.';
$ec_lang['lpn_profile_edit_nowhere']='נקודה במסלול חייבת להיות צומת. המסלול לא השתנה.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='מסלולים שמורים';
$ec_lang['lpn_profile_new']='מסלול שמור חדש…';
$ec_lang['lpn_profile_new_name']='מסלול {n}';
$ec_lang['lpn_profile_rename']='שינוי שם מסלול…';
$ec_lang['lpn_profile_delete']='מחיקת מסלול';
$ec_lang['lpn_profile_prompt_name']='שם למסלול זה';
$ec_lang['lpn_profile_delete_confirm']='למחוק את המסלול השמור {name}? השרטוט עצמו לא משתנה.';
$ec_lang['lpn_profile_none_saved']='אין עדיין מסלולים שמורים';
$ec_lang['lpn_profile_missing']='המסלול השמור {name} משתמש בצמתים שאינם בפרויקט זה: {ids}';
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
$ec_lang['lpn_ts_menu']='סדרת זמן';
$ec_lang['lpn_ts_tip']='מציג בגרף נכס אחד או יותר כנגד הזמן לאורך סימולציה על פני תקופת זמן.';
$ec_lang['lpn_ts_title']='ערכים כנגד הזמן';
$ec_lang['lpn_ts_group_tip']='האם הגרף מציג צמתים או קישורים.';
$ec_lang['lpn_ts_group_nodes']='צמתים';
$ec_lang['lpn_ts_group_links']='קישורים';
$ec_lang['lpn_ts_quantity_tip']='איזה ערך להציג בגרף כנגד הזמן.';
$ec_lang['lpn_ts_add']='הוספת הנבחרים';
$ec_lang['lpn_ts_add_tip']='מוסיף לגרף כל מה שנבחר כעת על המפה.';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='שום דבר מסוג זה אינו נבחר על המפה.';
$ec_lang['lpn_ts_clear']='הסרת הכול';
$ec_lang['lpn_ts_chip_tip']='הסרת {id} מהגרף';
$ec_lang['lpn_ts_none']='אין עדיין מה להציג בגרף. בחרו נכסים על המפה ולחצו על הוספת הנבחרים.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='אין עדיין תוצאות על פני תקופת זמן. לחצו על חשב כדי להריץ את הסימולציה.';
$ec_lang['lpn_ts_summary']='נכסים: {n}, זמני דיווח: {steps}';
$ec_lang['lpn_ts_axis_time']='זמן שחלף';
$ec_lang['lpn_freq_menu']='תדירות';
$ec_lang['lpn_freq_tip']='הצגה בגרף של התפלגות התדירות של תכונה אחת על פני כל הצמתים או כל הצינורות בצעד הזמן הנוכחי.';
$ec_lang['lpn_freq_title']='התפלגות ערכים';
$ec_lang['lpn_freq_group_tip']='האם הגרף מציג צמתים או צינורות.';
$ec_lang['lpn_freq_quantity_tip']='איזה ערך להציג בגרף.';
$ec_lang['lpn_freq_none']='אין עדיין תוצאות עבור ערך זה, ולכן אין מה להציג בגרף.';
$ec_lang['lpn_freq_summary']='מוצגים בגרף: {n} מתוך {total}';
$ec_lang['lpn_freq_summary_time']='מוצגים בגרף: {n} מתוך {total}, בזמן {time}';
$ec_lang['lpn_freq_axis_percent']='אחוז נמוך מ';
$ec_lang['lpn_view_units']='יחידות';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='שמור הכול';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='פרויקט{n}';
$ec_lang['lpn_project_copy_suffix']='(עותק)';
$ec_lang['lpn_project_rename']='שנה שם';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='פרויקט חדש…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='פרויקט חדש';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='מערכת קואורדינטות';
$ec_lang['lpn_new_coordsys_tip']='בחרו את מערכת הקואורדינטות של הרשת שלכם. בחירה זו קבועה; הדרך היחידה להמיר רשת לקואורדינטות אחרות היא באמצעות "קובץ, פתח לקואורדינטות חדשות", וההמרה משוערת.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='מקומית, סכמטית, או מותאמת אישית';
$ec_lang['lpn_new_coordsys_local_tip']='ללא ייחוס גיאוגרפי. צרפו תמונת רקע משלכם, או ללא תמונה כלל.';
// ---- THE COORDINATE SYSTEM BOX -----------------------------------------------------------------
// Tom's summary: it "uses the map view as a UX element to filter the universe of projections to the
// ones applicable to the project (view). Lets the user filter by name and select a projection at
// any time." (His own words, kept verbatim; "projection" in visitor strings became "coordinate
// system" on 2026-09-25 -- don't expose the word "projection".) Two filters over one catalogue, and
// the catalogue itself is not keyed: a coordinate system's NAME is the EPSG register's own, exactly
// as the OpenStreetMap credit is, and a GIS reader in any language looks for those characters.
// **THE SUB-BOX'S OWN TITLE** (Tom, 2026-09-25). Shared by the New project box and Convert as, so
// it names the box's own subject rather than either caller's radio label.
// The spatial filter. A zoned system covers a strip of the Earth and nothing outside it, so a place
// answers most of the question by itself: searching a town in Arizona leaves two UTM zones standing
// out of a hundred and twenty.
$ec_lang['lpn_crs_view']='סינון לפי תצוגת המפה';
$ec_lang['lpn_crs_view_tip']='מציע רק את ההטלות המכסות את המקום שאליו המפה מסתכלת. כבו זאת כדי לקרוא את הרשימה המלאה.';
$ec_lang['lpn_crs_place']='חיפוש שם מקום';
$ec_lang['lpn_crs_place_tip']='הקלידו עיר, כתובת, או ציון דרך, ותצוגת המפה תעבור לשם. המילים שאתם מקלידים נשלחות לשירות שמות המקומות של OpenStreetMap, המבקש את הסכמתכם בפעם הראשונה. פרויקט גאוגרפי חדש גם מתחיל במקום שתמצאו כאן.';
$ec_lang['lpn_crs_search']='חיפוש';
$ec_lang['lpn_crs_name']='סינון לפי שם הטלה';
$ec_lang['lpn_crs_name_tip']='מציג רק את ההטלות ששמן או קוד ה-EPSG שלהן מכיל את מה שהקלדתם. נסו מספר אזור, או UTM, או Mercator.';
$ec_lang['lpn_crs_list_tip']='ההטלות שנותרו לאחר שני הסינונים שלמעלה. בחרו אחת ולחצו על בחר.';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='עדיין לא חיפשתם מקום, ולכן מוצעת הרשימה המלאה. חפשו מקום למעלה או הגדילו את המפה כדי לצמצם אותה.';
$ec_lang['lpn_crs_count']='{n} מתוך {total} הטלות ברשימה.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} מתוך {total} מערכות קואורדינטות מכסות רשת זו.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(ללא מפה)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} היא אחת ממעט מערכות הקואורדינטות המופיעות ברשימה בלי מידע הטלה שמיש. משמעות הדבר היא שמפת העולם, חיפוש מקום לפי שם, ורומי Mapbox DEM אינם פועלים. הקואורדינטות שלכם אינן מושפעות.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='ללא שם';
$ec_lang['lpn_crs_none']='ללא ייחוס גיאוגרפי';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='פרויקט שומר את היחידות שלו, כך שבחירה זו שייכת לפרויקט הזה בלבד ושום דבר כאן אינו נשמר כהגדרת דפדפן. כדי להתחיל פרויקטים חדשים בדרך מסוימת, שמרו פרויקט ריק כתבנית שלכם והכינו עותק ממנה בכל פעם.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='תל אביב, ישראל';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='יצירה';
$ec_lang['lpn_file_open']='פתח…';
$ec_lang['lpn_file_save']='שמור';
$ec_lang['lpn_file_saveas']='שמור בשם…';
$ec_lang['lpn_file_revert']='שחזר';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='קבצים אחרונים';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_tip']='פתחו את {file} שוב מבלי לחפש אותו במחשב שלכם.';
$ec_lang['lpn_recent_denied']='ההרשאה לפתוח קובץ זה לא ניתנה, ולכן הוא לא נפתח.';
$ec_lang['lpn_recent_gone']='לא ניתן לפתוח את {file}. ייתכן שהוא הועבר, שונה שמו, או נמחק, ולכן הוא הוסר מרשימת הקבצים האחרונים.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='פרויקט חדש';
$ec_lang['lpn_tab_all']='כל הפרויקטים';
$ec_lang['lpn_tab_menu']='תפריט הפרויקט';
$ec_lang['lpn_tab_duplicate']='שכפל';
$ec_lang['lpn_tab_move_left']='הזז שמאלה';
$ec_lang['lpn_tab_move_right']='הזז ימינה';
$ec_lang['lpn_tab_unsaved']='לא נשמר לקובץ';
$ec_lang['lpn_import_bad_file']='לא ניתן לקרוא קובץ זה כפרויקט שנשמר מעמוד זה.';
$ec_lang['lpn_import_no_room']='אין מספיק מקום באחסון הדפדפן להוספת פרויקט זה. מחקו פרויקט שאינכם זקוקים לו יותר ונסו שוב.';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='אישור';
$ec_lang['lpn_file_import_menu']='ייבוא…';
$ec_lang['lpn_file_import_inp']='ייבוא קובץ EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='קוראים רשת מתוך קובץ EPANET, בין אם קובץ הטקסט ‎.inp ובין אם קובץ ה-‎.net ש-EPANET שומר, ושומרים אותה בדפדפן זה כפרויקט חדש.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='ייצוא קובץ EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='כתיבת רשת זו כקובץ EPANET‏ ‎.inp והורדתו. מספרים שהקלדתם נכתבים בדיוק כפי שהקלדתם אותם. כל מה שתבנית ה-‎.inp אינה יכולה להחזיק מפורט עבורכם לאחר מכן.';
$ec_lang['lpn_status_inp_exported']='יוצא {file}.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} דברים שתבנית ה-‎.inp אינה יכולה להחזיק.';
$ec_lang['lpn_inp_export_refused']='לא ניתן לכתוב פרויקט זה כקובץ EPANET: {detail}';
$ec_lang['lpn_inp_bad_file']='לא ניתן לקרוא קובץ זה כקובץ רשת EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='זהו כנראה קובץ EPANET‏ ‎.net, אך עמוד זה לא הצליח לקרוא אותו. פתחו אותו ב-EPANET והשתמשו שם בפקודה קובץ, ייצוא, רשת כדי לשמור אותו כקובץ ‎.inp, ואז ייבאו אותו.';
$ec_lang['lpn_inp_report_heading']='יובא {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} צמתים, מאגרים ומכלים, {links} צינורות, משאבות ושסתומים, ב-{units}.';
$ec_lang['lpn_inp_report_clean']='הכול בקובץ עבר בהצלחה. שום דבר לא הושמט.';
$ec_lang['lpn_inp_report_label_anchor']='תוויות טקסט ממוקמות כפי ש-EPANET ממקם אותן, מהפינה השמאלית העליונה שלהן.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='קובצי EPANET אינם מכילים מערכת קואורדינטות, כך שקובץ זה לא יהיה בעל ייחוס גיאוגרפי בתחילה. כדי למקם אותו על מפת העולם, השתמשו ב-מפה, מפת העולם… כדי להמיר את הקואורדינטות שלו, השתמשו ב-קובץ, המרה בשם…';
$ec_lang['lpn_inp_report_lead']='עמוד זה אינו משתמש בכל מה ש-EPANET משתמש בו, אך שום דבר בקובץ שלכם אינו נזרק. למטה מפורט מה שהקובץ שלכם מחזיק ועמוד זה שומר בלי להשתמש בו, ומה השתנה כאשר הקובץ נקרא:';
$ec_lang['lpn_inp_drop_headloss']='קובץ זה אינו משתמש בנוסחת Hazen-Williams. עמוד זה מחשב לפי Hazen-Williams, כך שמספרי החספוס של הצינורות נשמרו בדיוק כפי שנכתבו, אך התוצאות כאן לא יתאימו לתוצאות ב-EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='מכלים אלה אינם ישרי-דופן: הקובץ נותן את צורתם כעקומה. העקומה נשמרת בתיבת הספריות, המכל עדיין מפנה אליה, וסימולציה על פני תקופת זמן ממלאת ומרוקנת את המכל לפי הלוח שהעקומה נותנת. רגע בודד זהה בשתי הדרכים, משום שפני המים הם המפלס שהקובץ קובע. הקוטר הכתוב בקובץ נשמר לצד העקומה, וזה מה שמכל ללא עקומה מצויר ונפתר לפיו.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='שסתומי חנק אלה נכנסו כשסתומי חנק, הנושאים את אותו אובדן שהקובץ נותן להם. כל אחד משני הפותרים יכול לחשב אותם.';
$ec_lang['lpn_inp_drop_valve_active']='שסתומים אלה שולטים בלחץ או בספיקה, והם נפתחים ונסגרים מעצמם ככל שהמים משתנים. שום דבר בהם לא אבד בדרך, ועמוד זה פותר אותם באמצעות פותר EPANET, ומפעיל אותו מעצמו עבור רשת זו.';
$ec_lang['lpn_inp_drop_valve']='שסתומים אלה מתוארים על ידי עקומה או על ידי ירידת לחץ קבועה, ולעמוד זה אין אלמנט כזה. הם נכנסו כצינורות פתוחים, כך שהרשת עדיין מחוברת, אך שום דבר אינו שומר שם עוד על הלחץ או הספיקה.';
$ec_lang['lpn_inp_drop_cv']='ב-EPANET צינורות אלה מאפשרים מעבר מים בכיוון אחד בלבד. הם נכנסו כצינורות רגילים, כך שהמים עשויים כעת לזרום בכל כיוון דרכם.';
$ec_lang['lpn_inp_drop_demands']='לצמתים אלה היו מספר דרישות. הדרישות חוברו יחד לדרישה היחידה שעמוד זה מחזיק.';
$ec_lang['lpn_inp_drop_patterns']='עמוד זה לא קרא את תבניות הדרישה, משום שהחלק בו המריץ סימולציה על פני תקופת זמן לא נטען. כל דרישה היא המספר הכתוב בקובץ.';
$ec_lang['lpn_inp_drop_demand_pattern']='צמתים אלה משנים את דרישתם במהלך ההרצה. התבניות שלהם נכנסו בשלמותן, והדרישה המוצגת היא זו של הרגע שהשעון מראה.';
$ec_lang['lpn_inp_drop_emitters']='לצמתים אלה יש מקדם ממטיר או דליפה. הוא נשמר והוא נפתר, אך אין עדיין מקום בעמוד זה לראות אותו או לשנות אותו.';
$ec_lang['lpn_inp_drop_curve_long']='לעקומת משאבה זו היו יותר משלוש נקודות. נקודותיה הנמוכה, האמצעית והגבוהה נשמרו, משום שעמוד זה מתאים עקומה לכל היותר שלוש נקודות.';
$ec_lang['lpn_inp_drop_curve_missing']='משאבה זו מפנה לעקומה שאינה בקובץ. המשאבה נכנסה ללא עקומה, ולכן אינה מוסיפה גובה.';
$ec_lang['lpn_inp_drop_pump_other']='משאבה זו מתוארת לפי ההספק שהיא שואבת, ולא לפי עקומה. היא נכנסה ללא עקומה, ולכן אינה מוסיפה עומד.';
$ec_lang['lpn_inp_drop_head_pattern']='מאגרים אלה עולים ויורדים במהלך ההרצה. התבניות שלהם נכנסו בשלמותן, ומפלס המים המוצג הוא זה של הרגע שהשעון מראה.';
$ec_lang['lpn_inp_drop_pump_speed']='משאבות אלה פועלות במהירות שונה מזו שבה נמדדה עקומתן, או משנות מהירות במהלך ההרצה. המהירות ותבניתה נכנסו בשלמותן, והגובה המוצג הוא זה של הרגע שהשעון מראה.';
$ec_lang['lpn_inp_drop_setting']='צינורות, משאבות ושסתומים אלה נושאים הגדרה שעמוד זה אינו יכול להחזיק. הם נכנסו במצב פתוח.';
$ec_lang['lpn_inp_drop_rules']='לקובץ זה יש בקרות מבוססות-כללים. עמוד זה קורא אותן ומשתמש בהן. הריצו את המודל עם מנוע EPANET והכללים מיושמים, כאשר כל מפלס, לחץ וספיקה בהם מומרים ליחידות שהפרויקט הזה מציג. פתחו כללים תחת ספריות כדי לקרוא כלל או לשנות אותו. הם נשמרים בדיוק כפי שהקובץ קובע אותם, והם נכתבים בחזרה אם תשמרו קובץ EPANET.';
$ec_lang['lpn_inp_drop_eps']='קובץ זה מתאר סימולציה על פני תקופת זמן. החלק בעמוד זה המריץ סימולציה על פני תקופת זמן לא נטען, כך שרק תנאי ההתחלה נכנסו.';
$ec_lang['lpn_inp_drop_quality']='קובץ זה מתאר כיצד איכות המים משתנה תוך כדי מעבר: מה נמצא במים מלכתחילה, ובאיזו מהירות אותו חומר מגיב בצינורות ובמכלים. עמוד זה קורא מספרים אלה ומשתמש בהם. בחרו חומר כימי תחת הגדרות, חישוב, איכות מים, הריצו את המודל עם מנוע EPANET, והריכוז מחושב לאורך הרשת ככל שההרצה מתקדמת. השורות נשמרות, והן נכתבות בחזרה אם תשמרו קובץ EPANET.';
$ec_lang['lpn_inp_drop_sources_mixing']='קובץ זה מציין היכן חומר כימי מוזרק לרשת, וכיצד המים במכל מתערבבים. מנה מופיעה בצומת שאליו היא נוספת, ומכל מציין באיזה מודל ערבוב הוא פועל. הן המנה והן מודל הערבוב מחושבים על ידי מנוע EPANET בלבד.';
$ec_lang['lpn_inp_drop_energy']='קובץ EPANET זה כולל נתוני מידול עלות שאיבה. עמוד זה קורא אותם ומשתמש בהם. הריצו את המודל עם מנוע EPANET, ולאחר מכן פתחו מים, דוחות, אנרגיית משאבות כדי לראות כמה זמן כל משאבה פעלה, איזה הספק היא שאבה, כמה אנרגיה היא צרכה ומה זה עלה. השורות נשמרות, והן נכתבות בחזרה אם תשמרו קובץ EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='קובץ זה נותן תגיות לחלק מהצמתים, הצינורות או האלמנטים האחרים שלו. כל תגית נכנסה בשלמותה, וכל אחת נמצאת במאפייני הנכס שלה, שם ניתן לקרוא אותה או לשנות אותה.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='קובץ זה מחזיק את הגדרות EPANET עצמן לגבי אופן עיצוב הדוח שהוא מדפיס. תוכלו לקרוא את דוח המנוע כאן, תחת דוחות, הרצת EPANET, אך הוא יוצא בתבנית הסטנדרטית של המנוע ולא בזו שהגדרות אלה מבקשות. השורות נשמרות, והן נכתבות בחזרה אם תשמרו קובץ EPANET.';
$ec_lang['lpn_inp_drop_sections']='קובץ זה מחזיק סעיף שעמוד זה אינו קורא כלל. שום דבר כאן אינו משתמש בו. הוא נשמר במלואו, והוא נכתב בחזרה אם תשמרו קובץ EPANET.';
$ec_lang['lpn_inp_drop_quality_options']='קובץ זה קובע אפשרויות איכות מים של EPANET: האפשרות Quality, המציינת את סוג ניתוח איכות המים, ושתי הגדרות הקשורות לחומר כימי, Relative diffusivity ו-Quality tolerance. שלושתן נשמרות ושלושתן נמצאות בשימוש. גיל המים, מעקב מקור וחומר כימי מחושבים כאן, ושתי הגדרות החומר הכימי נמסרות למנוע EPANET כשמריצים חומר כימי. כולן נכתבות בחזרה אם תשמרו קובץ EPANET.';
$ec_lang['lpn_inp_drop_file_options']='קובץ זה מפנה לקובץ עזר: Map, המחזיק קואורדינטות, או Hydraulics, המחזיק תוצאות הידראוליקה שכבר חושבו. עמוד זה אינו יכול לפתוח אף אחד מהם, כך שהשורות נשמרות כפי שהן ונכתבות בחזרה אם תשמרו קובץ EPANET.';
$ec_lang['lpn_inp_drop_demand_model']='קובץ זה מבקש ניתוח מונע-לחץ (PDA), שבו צומת מקבל פחות מדרישתו כאשר הלחץ שם נמוך. עמוד זה פותר לפי דרישה קבועה, כך שכל צומת כאן מקבל את הדרישה שהקובץ קובע, לא משנה איזה לחץ מתקבל. השורה נשמרת ונכתבת בחזרה אם תשמרו קובץ EPANET.';
$ec_lang['lpn_inp_drop_other_options']='קובץ זה קובע אפשרויות שעמוד זה אינו קורא. שום דבר כאן אינו משתמש בהן. הן נשמרות והן נכתבות בחזרה אם תשמרו קובץ EPANET.';
$ec_lang['lpn_inp_drop_net_options']='קובץ .net זה של EPANET קובע הגדרות שלעמוד זה אין בקרה עליהן, כך שערכיהן מפורטים כאן במקום לעבור הלאה. כל השאר עבר. אם אתם זקוקים להן, פתחו את הקובץ ב-EPANET והשתמשו בקובץ, ייצוא, רשת כדי לשמור אותו כקובץ ‎.inp, ואז ייבאו אותו.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='זה היה קובץ .net של EPANET. זהו קובץ הפרויקט של EPANET עצמו, אין לו תיאור מפורסם, ועמוד זה קורא אותו על ידי ניחוש התבנית מקבצי דוגמה, כך שהשתמשו בו רק כשאין לכם דבר אחר, לא כדרך אמינה. קובץ .inp הוא התבנית המתועדת שכל תוכנה אחרת קוראת: ב-EPANET השתמשו בקובץ, ייצוא, רשת כדי לכתוב אחד, וייבאו אותו במקום זאת בכל פעם שתוכלו.';
$ec_lang['lpn_inp_drop_backdrop']='קובץ זה קורא בשם תמונת רקע אך אינו מכיל את התמונה עצמה. הוסיפו אותה בעצמכם עם קובץ, תמונת רקע, הוסף תמונה.';
$ec_lang['lpn_inp_drop_dangling']='צינורות אלה קוראים בשם צומת שאינו בקובץ, ולכן הם הושמטו.';
$ec_lang['lpn_inp_drop_units']='יחידת הספיקה הנקובה בקובץ זה אינה מוכרת לעמוד זה, ולכן כל מספר נקרא כגלונים לדקה. בדקו כל מספר לפני שתשתמשו בתשובות.';
$ec_lang['lpn_inp_drop_anchor_missing']='טקסט זה היה מצורף לצומת, מאגר או מכל שאינם בקובץ. הוא נכנס כטקסט חופשי במקום שהקובץ שם אותו, ואינו עוקב אחר דבר עתה.';
$ec_lang['lpn_import_notes_heading']='פרויקט זה נקרא מקובץ EPANET. חלק ממה שהקובץ הזה מחזיק נשמר אך אינו בשימוש בעמוד זה.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='נפתח {name} מקובץ, ונוסף לדפדפן זה כפרויקט חדש.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='קובץ פרויקט';
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
$ec_lang['lpn_file_upload_explain']='דפדפן זה אינו יכול להתחבר לקובץ, ולכן פתיחת קובץ כאן היא למעשה העלאה: הפרויקט מועתק לדפדפן זה, והדרך היחידה לשמור את עבודתכם בחזרה לקובץ היא לדרוס את הקובץ באמצעות קובץ, שמור בשם.';
// The tip on the Open button, which reached the toolbar with Task 246. It exists because that
// button is icon-only: on a menu row the word carries the whole meaning, and on the strip the tip
// is where the rest of it lives.
$ec_lang['lpn_file_open_tip']='פתחו קובץ פרויקט שנשמר מעמוד זה.';
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
$ec_lang['lpn_file_save_tip']='שומר לקובץ המחובר.';
$ec_lang['lpn_file_saveas_tip']='בחרו קובץ לשמירה. פרויקט זה יתחבר לאותו קובץ, ושמור יכתוב אליו מכאן ואילך.';
// The one thing a user can actually DO about the proliferation of files (Tom, 2026-08-04: "I hate to
// cause the proliferation of files"). We cannot make a browser ask where to put a download -- there
// is no API for it, and the download attribute cannot override the setting -- but the user can turn
// that setting on themselves, and then Save as really does let them overwrite the file they started
// from. It belongs in this tip rather than in a dialog: it answers a question asked at the moment
// the user is choosing where their work goes.
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_saveas_tip_download']='שומר באמצעות הגדרות ההורדה של הדפדפן שלכם. דפדפן זה אינו יכול להתחבר לקובץ, ולכן שמור מושבת וזמין רק שמור בשם. אם תפעילו את הגדרת הדפדפן "שאל היכן לשמור כל קובץ", תוכלו לבחור את הקובץ המקורי ולדרוס אותו.';
$ec_lang['lpn_status_uploaded']='קובץ הפרויקט הועלה. לא ניתן לשמור חיבור אליו, ולכן הדרך היחידה לשמור בחזרה אליו היא באמצעות קובץ, שמור בשם.';
$ec_lang['lpn_status_downloaded']='{file} הורד. דפדפן זה אינו יכול להתחבר לקובץ, ולכן פרויקט זה נשאר מסומן כלא נשמר לקובץ.';
$ec_lang['lpn_status_file_opened']='{file} נפתח.';
$ec_lang['lpn_status_already_open']='קובץ זה כבר פתוח כאן בתור {name}, ולכן זה עבר אליו במקום לפתוח עותק שני.';
$ec_lang['lpn_status_already_open_dirty']='קובץ זה כבר פתוח כאן בתור {name}, עם שינויים שלא שמרתם בו. זה עבר אליו במקום לפתוח עותק שני. השתמשו בקובץ, שחזר אם אתם רוצים את הגרסה שבדיסק במקום זאת.';
$ec_lang['lpn_status_saved']='{file} נשמר.';
$ec_lang['lpn_status_reverted']='{file} נטען שוב מהדיסק.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='לשמור את השינויים שלכם ל-{name} לפני סגירתו?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} נשמר רק בדפדפן זה. אם תסגרו אותו בלי לשמור אותו לקובץ, הוא ילך לאיבוד לצמיתות.';
$ec_lang['lpn_close_discard']='סגור בלי לשמור';
$ec_lang['lpn_cancel']='בטל';
$ec_lang['lpn_revert_confirm']='להשליך את השינויים שעשיתם ולטעון את {file} שוב מהדיסק?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='פרויקט זה הגיע מ-{file}, אך החיבור לקובץ זה אבד. בחרו את הקובץ שוב כדי להתחבר אליו.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='לא ניתן לכתוב לקובץ. ייתכן שהוא הועבר או שונה שמו, או שההרשאה בוטלה. עבודתכם עדיין שמורה בדפדפן זה.';
$ec_lang['lpn_file_changed_elsewhere']='מישהו אחר שמר לקובץ זה מאז שפתחתם אותו, כך ששמירה כעת תדרוס את עבודתו. השתמשו בקובץ, שמור בשם כדי לשמור את השינויים שלכם בקובץ משלכם, או בקובץ, שחזר כדי להשליך את שלכם ולטעון את שלו.';
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
$ec_lang['lpn_lock_somebody']='מישהו אחר';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} פתח קובץ זה.';
$ec_lang['lpn_lock_open_readonly']='פתח לקריאה בלבד';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='שבור נעילה';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='נראה שקובץ זה נמצא בשימוש.';
$ec_lang['lpn_lock_open_care']='כדי למנוע אובדן נתונים, בחרו בזהירות מבין האפשרויות שלמטה.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='הוא נמצא בשימוש כבר {x}.';
$ec_lang['lpn_lock_age_edited']='הוא נערך לאחרונה לפני {x}.';
$ec_lang['lpn_lock_age_saved']='הוא נשמר לאחרונה לפני {x}.';
$ec_lang['lpn_lock_age_never_saved']='שום דבר עדיין לא נשמר לקובץ זה.';
$ec_lang['lpn_lock_age_unknown']='אין רישום לכמה זמן הוא בשימוש, או מתי הוא נשמר או נערך לאחרונה.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='"בקש" אומר למי שפתח קובץ זה שהייתם רוצים אותו, ואינו משנה דבר נוסף. "פתח לקריאה בלבד" מאפשר לכם להסתכל בו ולשנות בו כל מה שתרצו, בלי יכולת לשמור כאן. "שבור את הנעילה שלו" מאפשר לכם לשמור מעל הקובץ; העבודה שלהם שלא נשמרה אינה אובדת, אך הם כבר לא יוכלו לשמור אותה כאן, וייתכן שמישהו יצטרך למזג בין השתיים ביד.';
$ec_lang['lpn_lock_ask']='בקש';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='את מי לומר שמבקש? ראשי התיבות שלכם אידיאליים. הם נשמרים יחד עם הנעילה של קובץ זה בשרת שלנו, עבור מי שפתח אותו, ונמחקים תוך 30 יום.';
$ec_lang['lpn_lock_ask_sent']='ביקשנו ממי שפתח קובץ זה לסגור אותו. הם יראו זאת תוך דקה, אם הדף שלהם עדיין פתוח. שום דבר אחר לא השתנה, והקובץ עדיין שלהם עד שיסגרו אותו.';
$ec_lang['lpn_lock_ask_failed']='לא ניתן היה למסור את ההודעה שלכם. או ששום אחד אינו פותח כעת קובץ זה, או שלא ניתן היה להגיע לשרת.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='קובץ זה לא נפתח, ושום דבר כאן לא השתנה. מישהו אחר עדיין פותח אותו.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} מעוניין לערוך קובץ זה. כשתהיו מוכנים, שמרו את עבודתכם והשתמשו ב-קובץ, סגור פרויקט כדי למסור אותו.';
$ec_lang['lpn_ago_seconds']='{n} שניות';
$ec_lang['lpn_ago_minutes']='{n} דקות';
$ec_lang['lpn_ago_hours']='{n} שעות';
$ec_lang['lpn_ago_days']='{n} ימים';
$ec_lang['lpn_ago_unknown']='זמן לא ידוע';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='הודעות';
$ec_lang['lpn_msglog_heading']='הודעות אחרונות';
$ec_lang['lpn_msglog_empty']='אין עדיין הודעות.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='לפני {x}';
$ec_lang['lpn_msglog_note']='החדש ביותר ראשון. עמוד זה שומר את {n} ההודעות האחרונות כל עוד הוא פתוח, ושום דבר אינו נשמר במחשב שלכם.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='קריאה בלבד: {name} פתח קובץ זה. תוכלו לשנות כאן כל מה שתרצו, אך לא תוכלו לשמור. השתמשו בקובץ, שמור בשם כדי לשמור לקובץ אחר.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='שימו לב: לא ניתן היה להגיע לשרת כדי לבדוק או ליצור נעילה על פרויקט זה, כך ששום דבר אינו מונע מעמית לערוך את אותו קובץ באותו זמן. תקבלו הודעה אם הנעילה תתחיל לפעול שוב.';
$ec_lang['lpn_lock_storage_error']='שימו לב: אתר זה אינו יכול לשמור רשומות נעילה, כך ששום דבר אינו מונע מעמית לערוך את אותו קובץ באותו זמן. זהו כשל בהגדרות השרת, לא משהו שתוכלו לתקן כאן — תיקיית הנעילה אינה ניתנת לכתיבה על ידי שרת האינטרנט.';
$ec_lang['lpn_lock_full_error']='שימו לב: לאתר זה נגמר המקום לתעד מי פתח איזה פרויקט, כך ששום דבר אינו מונע מעמית לערוך את אותו קובץ באותו זמן. זהו כשל בהגדרות השרת, לא משהו שתוכלו לתקן כאן.';
$ec_lang['lpn_lock_not_asked']='הנעילה אינה פועלת עבור פרויקט זה, כך ששום דבר אינו מונע מעמית לערוך את אותו קובץ באותו זמן. לפרויקט זה אין עדיין מזהה, ושמירתו לקובץ מקנה לו אחד.';
$ec_lang['lpn_lock_restored']='הנעילה חזרה לפעול, וקובץ זה כעת שלכם לשמירה אליו.';
$ec_lang['lpn_lock_dismiss']='הסתר הודעה זו';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='הפרויקט שלכם יישמר בקובץ במחשב זה. הוא נשמר כשאתם מבקשים, ובשום זמן אחר, כך ששום דבר לא נכתב לקובץ זה מאחורי גבכם.';
$ec_lang['lpn_file_training_2']='כדי ששני אנשים לא יערכו קובץ אחד באותו זמן, אתר זה עוקב אחרי מי פתח אותו. אם מישהו כבר פתח אותו, תוכלו עדיין לפתוח ולהסתכל, או לשמור עותק משלכם.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='בפעם הראשונה שתשמרו, הדפדפן שלכם ישאל אם אתר זה רשאי לערוך את הקובץ. שאלה זו מגיעה מהדפדפן, לא מאיתנו, ולומר כן הוא מה שמאפשר לשמור לכתוב את עבודתכם בחזרה. היא נשאלת בדרך כלל רק פעם אחת לכל קובץ.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='המשך';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='בחר את הקובץ שוב';
$ec_lang['lpn_file_reconnect']='התחבר מחדש לקובץ זה';
$ec_lang['lpn_file_reconnect_alert']='פרויקט זה הגיע מ-{file}. הדפדפן שלכם זקוק להרשאתכם שוב לפני שיוכל לכתוב אליו. התחברו מחדש למטה.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='זהו אותו קובץ שמישהו אחר פתח, ולכן לא ניתן לשמור מעליו. בחרו קובץ אחר או שם אחר.';
$ec_lang['lpn_saveas_overwrites_project']='קובץ זה כבר מכיל פרויקט אחר, {name}. שמירה כאן תחליף אותו לחלוטין. להמשיך?';
$ec_lang['lpn_saveas_overwrites_newer']='קובץ זה השתנה מאז שראיתם אותו לאחרונה, כך שכמעט בוודאות מישהו אחר שמר אליו. שמירה כאן תחליף את גרסתו בשלכם. להמשיך?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='שם לפרויקט זה';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='{closed} נסגר. כעת מוצג {opened}.';
$ec_lang['lpn_status_closed_empty']='{closed} נסגר. הותחל פרויקט ריק חדש.';
$ec_lang['lpn_storage_full']='לא נשמר. אחסון הדפדפן מלא או לא זמין, כך שהשינויים האחרונים שלכם יאבדו כשתסגרו כרטיסייה זו.';
$ec_lang['lpn_storage_unreadable']='לא נשמר. לא ניתן היה לקרוא פרויקט זה מאחסון הדפדפן. העותק השמור שלו נשאר בדיוק כפי שהוא ולא יידרס, כך שכלום בכרטיסייה זו אינו נשמר. פתחו קובץ או צרו פרויקט חדש כדי להמשיך לעבוד.';
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
$ec_lang['lpn_about_credits']='קרדיטים';
$ec_lang['lpn_help_welcome']='עמוד ברוכים הבאים';
$ec_lang['lpn_about_license']='מופץ תחת רישיון GNU הציבורי הכללי גרסה 3.0 ומעלה.';
$ec_lang['lpn_notes_1_term']='כיצד זה נפתר';
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
$ec_lang['lpn_notes_1_def']='פותר EPANET פותר רשת זו. הגדירו משך ריצה כולל, וכל צעד דיווח מחושב בתורו: מכלים מתמלאים ומתרוקנים, דרישות עוקבות אחר התבניות שלהן, וסרגל הכלים מנגן את ההרצה בחזרה.';
$ec_lang['lpn_notes_2_term']='מה אינו נעשה';
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
$ec_lang['lpn_notes_2_def']='איכות המים מדוגמת: גיל המים, מעקב מקור, וחומר כימי המגיב בדפנות הצינור ובגוף המים. גל לחץ והלם מים אינם מדוגמים: כל תוצאה כאן היא עבור מים הזורמים כבר בזרימה יציבה, לא עבור גל הלחץ הנוצר כשסתום נסגר בחבטה.';
$ec_lang['lpn_notes_3_term']='שמירת פרויקטים';
$ec_lang['lpn_notes_3_def']='כל פרויקט הוא כרטיסייה, וכל כרטיסייה נשמרת בדפדפן זה תוך כדי עבודה. ניקוי נתוני הדפדפן שלכם מוחק את כולם, לכן שמרו את עבודתכם בקובץ: קובץ, שמור בשם. כוכבית על כרטיסייה משמעה שהיא מכילה שינויים שאינם בקובץ. שום דבר לעולם לא נכתב לקובץ אלא אם ביקשתם זאת. בדפדפנים מסוימים פרויקט מתחבר לקובץ שאליו שמרתם אותו, וקובץ, שמור כותב בחזרה לאותו קובץ מכאן ואילך; באחרים אין אפשרות חיבור, כך ששמור מושבת וזמין רק שמור בשם. כאשר קובץ פרויקט נשמר בכונן משותף, עמוד זה מודיע לכם אם עמית כבר פתח אותו, כדי ששני אנשים לא יכתבו זה מעל זה.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='עקומת משאבה';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='משאבה עוקבת אחר H = H₀ − aQ^b, כאשר H הוא הגובה שהמשאבה מוסיפה ו-Q הוא הספיקה דרכה. הזינו נקודה אחת, שתיים, או שלוש מעקומת היצרן. שלוש נקודות — הגובה בספיקה אפס, נקודת העבודה הרגילה, ונקודת הספיקה הגבוהה ביותר — קובעות ישירות את H₀‏, a ו-b, ועוקבות בצורה הקרובה ביותר אחר עקומה מפורסמת. שתי נקודות מתאימות פרבולה (b = 2) עם שיאה בספיקה אפס. נקודה אחת משתמשת בכלל נפוץ: הגובה בספיקה אפס הוא 1.33 × הגובה שהזנתם, והספיקה הגבוהה ביותר היא 2 × הספיקה שהזנתם, מה שנותן שוב b = 2. משאבה שלא הוזנו לה נקודות אינה מוסיפה גובה כלל. העקומה אינה נחתכת במקום שבו הגובה מגיע לאפס, כך שבקשה ממשאבה יותר ספיקה משהעקומה שלה יכולה לספק נותנת גובה שלילי. הפתרון הוא משאבה גדולה יותר או דרישה קטנה יותר, לא התאמת עקומה שונה. עקומה יכולה להכיל יותר משלוש נקודות, וכל נקודה שהזנתם נקראת.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='גם בעמוד זה';
$ec_lang['lpn_notes_4_def']='פרויקט יכול לשבת על קרקע אמיתית עם מפת רחובות מאחוריו. ניתן לקרוא ולכתוב קובצי EPANET‏ ‎.inp. הלוח התחתון מצייר פרופיל לאורך מסלול ומפרט את הצמתים. ניתן לצבוע אלמנטים לפי תוצאותיהם, וחיפוש בוחר כל אלמנט העונה על תנאי שתגדירו.';
$ec_lang['lpn_notes_6_term']='עזרה בעמודות הטבלה';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>בחירת עמודה</td><td>לחיצה על הכותרת</td></tr><tr><td>הוספה או הרחבה של בחירת העמודות</td><td>Ctrl+לחיצה או Shift+לחיצה על כותרת אחרת</td></tr><tr><td>הזזה (שינוי סדר) של העמודות הנבחרות</td><td>גררו או השתמשו בניהול עמודות… בתפריט לחיצה ימנית או ⋮</td></tr><tr><td>תפריט ⋮ וחץ המיון.</td><td>רחפו מעל הפינה העליונה של כותרת, או בחרו או עברו בטאב אל כותרת</td></tr><tr><td>הסתרה, הצגת הכול, או ניהול הנראות והסדר</td><td>לחיצה ימנית על הכותרת או תפריט ⋮ בפינה הימנית העליונה של הכותרת</td></tr><tr><td>מיון לפי עמודה</td><td>סמל חץ בפינה הימנית העליונה של הכותרת</td></tr><tr><td>הדבקה כשורות חדשות בסוף הטבלה</td><td>לחיצה ימנית, תפריט ⋮ בפינה הימנית העליונה של הכותרת, או Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='קיצורי מקלדת לטבלה';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>מקשי חצים</td><td>ניווט.</td></tr><tr><td>Tab,‏ Enter</td><td>סיום הזנה וניווט תא אחד הצידה / למטה.</td></tr><tr><td>Shift+Tab,‏ Shift+Enter</td><td>ניווט אחורה.</td></tr><tr><td>Shift+מקשי חצים</td><td>הרחבת הבחירה.</td></tr><tr><td>Ctrl+C</td><td>העתקת הבחירה.</td></tr><tr><td>Ctrl+D</td><td>מילוי הבחירה למטה משורתה העליונה.</td></tr><tr><td>Ctrl+Enter</td><td>מילוי הבחירה בערך התא הפעיל.</td></tr><tr><td>Ctrl+A</td><td>בחירת הטבלה כולה.</td></tr><tr><td>Ctrl+Shift+V</td><td>הדבקה כשורות חדשות בסוף הטבלה.</td></tr><tr><td>Ctrl+Shift+PageDown,‏ Ctrl+Shift+PageUp</td><td>מעבר ללשונית הבאה או הקודמת, בין אם טבלה ובין אם גרף.</td></tr><tr><td>Delete</td><td>ניקוי תא.</td></tr><tr><td>F2</td><td>פתיחת תא לעריכה.</td></tr><tr><td>Esc</td><td>ביטול עריכה.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='גבולות רצועות הצבע נשארים זהים';
$ec_lang['lpn_notes_color_def']='גבולות רצועות הצבע נקבעים כאשר בוחרים שיטת מיון נתונים. הם אינם נקבעים מחדש בכל צעד זמן, כי זה היה גורם לצבעים לתאר משהו חדש בכל צעד, וזה לא עוזר להמחיש את המערכת שלכם. EPANET פועל באותה צורה. כדי לקבל גבולות חדשים, בחרו שיטה מחדש או הקלידו את הגבולות שלכם.';
$ec_lang['lpn_notes_epanet_term']='קבועי Hazen-Williams תואמים ל-EPANET';
$ec_lang['lpn_notes_epanet_def']='באוגוסט 2026 המקדם והמעריך של Hazen-Williams שונו כדי להתאים ל-EPANET. תוצאות אובדן הגובה שונות מגרסאות קודמות של עמוד זה בעד 0.1 אחוז, פחות בהרבה מאי-הוודאות בערך C עצמו.';
$ec_lang['lpn_notes_engine_term']='איזה EPANET עמוד זה מריץ';
$ec_lang['lpn_notes_engine_def']='פותר ה-EPANET בעמוד זה הוא OWA-EPANET 2.3.5, שיצא ב-20 בפברואר 2025. EPANET מפותח על ידי Open Water Analytics, קהילה הפועלת יחד עם סוכנות ההגנה על הסביבה של ארצות הברית, שהוציאה את גרסה 2.2.0 בדצמבר 2019. דוח ההרצה קורא לו 2.3.05 כי המנוע כותב את הספרה האחרונה בשתי ספרות. הוא מגיע לעמוד זה דרך epanet-js 0.9.0 מאת Luke Butler, תחת רישיון MIT, והוא רץ בתוך הדפדפן שלכם: הרשת שלכם אינה נשלחת לשום מקום כדי להיפתר.';
$ec_lang['lpn_id_invalid']='הזינו מזהה ללא רווחים וללא מרכאות.';
$ec_lang['lpn_id_taken']='מזהה זה כבר בשימוש.';
$ec_lang['lpn_diag_no_fixed_head']='הוסיפו מאגר או מכל. הרשת זקוקה לפחות למפלס מים ידוע אחד לפני שניתן לפתור אותה.';
$ec_lang['lpn_diag_dangling_link']='צינור או משאבה מתחברים לצומת שכבר אינו קיים:';
$ec_lang['lpn_diag_unreachable']='לצמתים אלה אין נתיב למאגר:';
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
$ec_lang['lpn_engine_fetching']='מוריד את פותר EPANET. הוא מורד פעם אחת ונשמר במכשיר זה, כך שהוא יעבוד לא מקוון לאחר מכן.';
$ec_lang['lpn_engine_ready']='פותר EPANET נמצא כעת במכשיר זה, ופועל לא מקוון.';
$ec_lang['lpn_engine_fetching_valve']='מוריד את פותר EPANET, כדי שניתן יהיה לפתור שסתום זה כעת וגם לא מקוון בהמשך.';
$ec_lang['lpn_engine_ready_valve']='פותר EPANET נמצא כעת במכשיר זה. שסתומים הנפתחים ונסגרים מעצמם יעבדו גם לא מקוון.';
$ec_lang['lpn_engine_unavailable']='לא ניתן היה להוריד את פותר EPANET, שהוא זה שפותר שסתומים הנפתחים ונסגרים מעצמם. התחברו לאינטרנט פעם אחת, והוא יישמר במכשיר זה מאותו רגע ואילך.';
$ec_lang['lpn_engine_needed_loading']='טעינת פותר EPANET מתבצעת בזמן שאתם בונים. התוצאות יהיו זמינות לאחר הטעינה המלאה.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='התקדמות טעינת הפותר';
$ec_lang['lpn_engine_wait']='טוען פותר. התוצאות מתעכבות לרגע. המשיכו לעבוד.';
$ec_lang['lpn_engine_wait_pct']='הפותר נטען ב-{percent}%.';
$ec_lang['lpn_engine_wait_bytes']='הפותר נטען עד כה ב-{kb} KB. הסך הכולל אינו זמין, כך שאחוז ההשלמה אינו ידוע.';
$ec_lang['lpn_engine_needed_failed']='פותר EPANET עדיין לא נטען, אינו יכול להיטען, ורשת זו ניתנת לפתרון רק על ידו. הוא ייטען כאשר תהיו מחוברים לאינטרנט.';
$ec_lang['lpn_diag_valve_needs_epanet']='שסתומים אלה נפתחים ונסגרים מעצמם, ורק פותר EPANET יכול לחשב אותם. לא ניתן היה לטעון את פותר EPANET, כך שתוצאות אלה חסרות:';
$ec_lang['lpn_diag_valve_on_fixed_head']='שסתומים אלה מחוברים ישירות למאגר או למכל, שכבר קובע את מפלס המים שם, כך שלא נותר לשסתום מה לשלוט בו. הוסיפו צינור קצר בין השסתום למאגר או למכל:';
$ec_lang['lpn_diag_not_converged']='לא נמצא פתרון. בדקו ערכים בלתי אפשריים במציאות, כגון קוטר אפס.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='הפתרון לא התכנס. המספרים האלה הם האיטרציה האחרונה, לא תשובה. אין להשתמש בהם.';
$ec_lang['lpn_diag_not_converged_trials']='הוא נעצר לאחר {iterations} איטרציות.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='הוא נעצר לאחר {iterations} איטרציות בשגיאה יחסית של {error}, שלא הגיעה להגדרת הדיוק של {accuracy}.';
$ec_lang['lpn_field_roughness']='חספוס';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='מקדם Hazen-Williams C. מספר גבוה יותר משמעו צינור חלק יותר: כ-150 עבור פלסטיק חדש, 130 עבור פלדה או ברזל חדשים, ו-100 עבור צינור ישן.';
$ec_lang['lpn_field_length']='אורך';
$ec_lang['lpn_field_from']='מ-';
$ec_lang['lpn_field_to']='אל';
$ec_lang['lpn_field_length_tip']='אורך הצינור. כאשר אוטומטי מופעל, האורך נמדד ממה שציירתם. כבו את אוטומטי כדי להקליד אורך השונה מהשרטוט.';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='סוג שסתום';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='מה שהשסתום עושה. שסתום חנק שומר על אובדן קבוע. שלושת האחרים שומרים על לחץ או ספיקה, ונפתחים לגמרי, נסגרים, או נסגרים חלקית ככל שהמים משתנים. שינוי הסוג מציב מספר התחלה חדש בהגדרה שלמטה, משום שלחץ אינו ספיקה ואף אחד מהם אינו מקדם אובדן.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='שסתום חנק (TCV)';
$ec_lang['lpn_valve_type_prv']='שסתום מפחית לחץ (PRV)';
$ec_lang['lpn_valve_type_psv']='שסתום שימור לחץ (PSV)';
$ec_lang['lpn_valve_type_fcv']='שסתום בקרת ספיקה (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='שובר לחץ (PBV)';
$ec_lang['lpn_valve_type_gpv']='כללי (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='ירידת לחץ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='הלחץ שהשסתום מסיר. שסתום שובר לחץ תמיד מסיר בדיוק כמות לחץ זו, בכל כיוון שהמים זורמים. זוהי ירידה על פני השסתום, לא לחץ שיש לשמור עליו.';
$ec_lang['lpn_inp_drop_gpv_curve']='שסתום זה מפנה לעקומת אובדן גובה שאינה בקובץ. השסתום נכנס ללא עקומה, ולכן הוא נשאר פתוח לגמרי עד שתתנו לו אחת.';
$ec_lang['lpn_gpv_curve_source']='עקומת אובדן גובה שסתום';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='העקומה בתיבת הספריות המציינת כמה גובה שסתום זה מאבד בכל ספיקה. כמה שסתומים יכולים להשתמש באותה עקומה, ועריכתה שם משנה את כולם. שסתום זה מחזיק רק את ההפניה; הנקודות עצמן נקראות ונערכות תחת ספריות, עקומות.';
$ec_lang['lpn_field_valve_setting_pressure']='הגדרת לחץ';
$ec_lang['lpn_field_valve_setting_pressure_tip']='הלחץ שהשסתום שומר עליו. שסתום מפחית לחץ שומר על הלחץ בצד הזרימה שלאחריו ברמה זו או מתחתיה. שסתום שימור לחץ שומר על הלחץ בצד הזרימה שלפניו ברמה זו או מעליה.';
$ec_lang['lpn_field_valve_setting_flow']='הגדרת ספיקה';
$ec_lang['lpn_field_valve_setting_flow_tip']='כמות המים המרבית שהשסתום מאפשר לעבור. כאשר פחות מים מזה רוצים לעבור, השסתום עומד פתוח לגמרי ואינו מוסיף אובדן.';
$ec_lang['lpn_field_valve_setting']='הגדרה';
$ec_lang['lpn_field_valve_setting_loss']='מקדם אובדן';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='כמה גובה שסתום החנק מסיר, נמדד ככפולה של גובה המהירות. השתמשו ב-0 עבור שסתום העומד פתוח לגמרי. מספר יחיד זה הוא כל אובדן שסתום החנק.';
$ec_lang['lpn_field_valve_diameter_tip']='רוחב הפתח דרך השסתום. מהירות המים דרך השסתום מחושבת מרוחב זה, והאובדן נגזר ממהירות זו.';
$ec_lang['lpn_field_valve_km_tip']='אובדן מגוף השסתום בעודו עומד פתוח לגמרי, בנוסף לכל מה שהגדרת השסתום מסירה. הוא נמדד ככפולה של גובה המהירות. השתמשו ב-0 כדי להתעלם ממנו.';
$ec_lang['lpn_field_km']='מקדם אובדן מקומי, k';
$ec_lang['lpn_field_km_tip']='אובדן מהעיקולים, השסתומים והאביזרים בצינור זה, נספר כמכפלה של גובה המהירות. השתמשו ב-0 עבור צינור ישר פשוט.';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='אובדן מקומי, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='עקומת גובה משאבה';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='העקומה בתיבת הספריות המציינת כמה גובה משאבה זו מוסיפה בכל ספיקה. כמה משאבות יכולות להשתמש באותה עקומה, ועריכתה שם משנה את כולן. משאבה זו מחזיקה רק את ההפניה; הנקודות עצמן נקראות ונערכות תחת ספריות, עקומות.';
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
$ec_lang['lpn_field_desc']='תיאור';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
$ec_lang['lpn_field_desc_tip']='לשימושכם האישי, כגון פינת רחוב או ממה עשוי הצינור. הוא עובר פנימה והחוצה מקובץ EPANET, שם הוא יושב בסוף השורה של החלק עצמו. שום חישוב אינו קורא אותו. מעבר שורה הופך לרווח, כי לקובץ אין לאן לשים אותו.';
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='תגית';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='לתגית יכולה להיות כל משמעות שתרצו, כגון אזור לחץ או הזמנת עבודה. שום חישוב כאן או ב-EPANET אינו קורא אותה. תגית היא מילה אחת: EPANET מפסיק לקרוא ברווח הראשון, כך שרווח נדחה בעת ההקלדה. היא נכנסת ויוצאת עם קובץ ה-EPANET.';
$ec_lang['lpn_pump_effic_curve']='עקומת יעילות משאבה';
$ec_lang['lpn_pump_effic_curve_tip']='העקומה בתיבת הספריות המציינת מה היעילות של משאבה זו בכל ספיקה. כמה משאבות יכולות להשתמש באותה עקומה, ועריכתה שם משנה את כולן. משאבה זו מחזיקה רק את ההפניה; הנקודות עצמן נקראות ונערכות תחת ספריות, עקומות.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='לא נבחרה עקומה';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='עקומות';
$ec_lang['lpn_curve_library_link_tip']='פותח את תיבת הספריות בקטע העקומות שלה, שבו עקומה נוספת, מתוארת, נערכת ונמחקת. נכס מציין באיזו עקומה הוא משתמש.';
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
$ec_lang['lpn_curve_kind_head']='גובה משאבה';
$ec_lang['lpn_curve_kind_effic']='יעילות משאבה';
$ec_lang['lpn_curve_kind_volume']='נפח מכל';
$ec_lang['lpn_curve_kind_headloss']='אובדן גובה שסתום';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='הסוג אינו מצוין';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='נפח';
$ec_lang['lpn_pump_effic_col']='יעילות';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='למשאבה זו אין עקומת יעילות נבחרת, ולכן היא פועלת ביעילות שנקבעה לכל הרשת, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='משאבה זו מפנה לעקומת יעילות בשם {name}, שדבר בפרויקט זה אינו מגדיר, ולכן היא פועלת ביעילות שנקבעה לכל הרשת, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='מצב: בחירה. לחצו על אלמנט או תווית כדי לראות או לשנות אותם. גררו כדי להזיז צומת, נקודת עיקול, או תווית. השתמשו בכלי נקודות עיקול כדי להוסיף או להסיר את העיקולים בצינור.';
$ec_lang['lpn_mode_delete']='מצב: מחיקה. לחצו על אלמנט כדי להסיר אותו.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='מצב: נקודות עיקול. נקודות העיקול של כל צינור מוצגות כידיות ריבועיות קטנות. לחצו על צינור כדי להוסיף נקודת עיקול, לחצו על ידית כדי להסיר אותה, או גררו ידית כדי להזיז אותה. שום דבר אחר במפה אינו משתנה במצב זה.';
$ec_lang['lpn_mode_zoom_window']='מצב: תקריב לחלון. לחצו על שתי פינות מנוגדות של תיבה, או גררו אחת, על המפה כדי להגדיל אליה.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='שום דבר אינו נבחר. לחצו על אלמנט במפה תחילה, ואז הקישו Delete.';
$ec_lang['lpn_mode_add_junction']='מצב: הוספת צומת. לחצו על המפה כדי להציב צומת. עברו למצב בחירה כדי לשנות או להזיז אלמנטים ותוויות.';
$ec_lang['lpn_mode_add_reservoir']='מצב: הוספת מאגר. לחצו על המפה כדי להציב מאגר. עברו למצב בחירה כדי לשנות או להזיז אלמנטים ותוויות.';
$ec_lang['lpn_mode_add_tank']='מצב: הוספת מכל. לחצו על המפה כדי להציב מכל. עברו למצב בחירה כדי לשנות או להזיז אלמנטים ותוויות.';
$ec_lang['lpn_mode_add_pipe']='מצב: הוספת צינור. לחצו על צומת, ואז על צומת נוסף, כדי לחבר ביניהם. עברו למצב בחירה כדי לשנות או להזיז אלמנטים ותוויות.';
$ec_lang['lpn_mode_add_pump']='מצב: הוספת משאבה. לחצו על צומת, ואז על צומת נוסף, כדי לחבר ביניהם. עברו למצב בחירה כדי לשנות או להזיז אלמנטים ותוויות.';
$ec_lang['lpn_mode_add_valve']='מצב: הוספת שסתום. לחצו על צומת, ואז על צומת נוסף, כדי לחבר ביניהם. עברו למצב בחירה כדי לשנות או להזיז אלמנטים ותוויות.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='מצב: הוספת טקסט. לחצו על המפה כדי להציב תווית טקסט. לחצו ליד צומת כדי לצרף את הטקסט לאותו צומת. עברו למצב בחירה כדי לשנות או להזיז אלמנטים ותוויות.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='השתמשו במצב זה כדי לשנות, להזיז ולגרור דברים על המפה. זהו המצב שאליו העמוד חוזר כברירת מחדל: הוא חוזר לכאן בעצמו לאחר פעולות מסוימות, כגון פתיחת פרויקט, ו-[Esc] מחזיר אתכם לכאן מכל מצב אחר.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tip_labels_draggable']='ניתן לגרור תווית כדי להזיז אותה. לחיצה כפולה על תווית מחזירה אותה למיקומה האוטומטי.';
$ec_lang['lpn_field_auto']='אוטומטי';
$ec_lang['lpn_method_switch_confirm']='שינוי שיטת החיכוך אינו משנה את מספרי החספוס הכתובים כבר על הצינורות שלכם, וחספוס עבור שיטה אחת חסר משמעות עבור שיטה אחרת. בדקו כל צינור אחרי כן. לשנות בכל זאת?';
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
$ec_lang['lpn_field_closed']='סגור';
$ec_lang['lpn_field_closed_tip']='סגרו צינור זה כך שמים לא יוכלו לעבור בו. הצינור נשאר על המפה ושומר על כל מספריו, ותוכלו לפתוח אותו שוב בכל עת.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='קו אורך';
$ec_lang['lpn_field_lat']='קו רוחב';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='צפונה';
$ec_lang['lpn_field_easting']='מזרחה';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='צ';
$ec_lang['lpn_field_easting_abbr']='מ';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='רוחב';
$ec_lang['lpn_field_lon_abbr']='אורך';
// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='הקלידו מיקום קואורדינטות כדי למקם צומת זה במדויק. בתרחיש, מיקום זה חל באותו תרחיש בלבד, בדיוק כמו גרירתו; בבסיס הוא ממקם את הצומת בכל מקום.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='זה מחוץ למפה. קו הרוחב ב-Pseudo Mercator נע בין -85.05 לבין 85.05, וקו האורך נע בין -180 לבין 180.';
$ec_lang['lpn_field_text_size']='מכפיל גודל';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='הצגה בכל רמות התקריב';
$ec_lang['lpn_field_text_all_zoom_tip']='שומר על טקסט זה בשרטוט לא משנה כמה תתרחקו. בטלו את הסימון והטקסט יוסתר יחד עם התוויות האחרות ברגע שהתצוגה רחבה יותר מסף התיוג שנקבע תחת מפה ועמוד.';
$ec_lang['lpn_tool_labels']='תוויות';
$ec_lang['lpn_labels_heading_node']='תוויות צמתים';
$ec_lang['lpn_labels_heading_link']='תוויות קישורים';
$ec_lang['lpn_labels_decimals_tip']='מספר הספרות אחרי הנקודה העשרונית המוצגות בתווית זו';
$ec_lang['lpn_labels_mark_extrema']='סמן את הערכים הגבוהים והנמוכים ביותר';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='מצייר קו מעל הערך הגבוה ביותר של כל מאפיין מתויג על המפה (קו עליון), וקו מתחת לערך הנמוך ביותר של אותו מאפיין (קו תחתון), כך שתוכלו לזהות את הגבוה והנמוך ביותר בלי לקרוא את המספרים.';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='החל על הכל';
$ec_lang['lpn_settings_apply_to_all_tip']='כל אלמנט מסוג זה שכבר משורטט מקבל מזהה המתחיל בטקסט זה. כל אחד שומר על מספרו. מזהה שאינו מסתיים במספר נשאר ללא שינוי.';
$ec_lang['lpn_confirm_apply_prefix']='לשנות שם ל-{n} אלמנטים כך שהמזהים שלהם יתחילו ב-{prefix}? כל אחד שומר על מספרו.';
$ec_lang['lpn_prefix_applied']='שם שונה ל-{n} אלמנטים. {skipped} אחרים נשארו ללא שינוי.';
$ec_lang['lpn_labels_prefix_tip']='טקסט המתווסף לפני מאפיין זה בתוויות המפה';
$ec_lang['lpn_labels_suffix_tip']='טקסט המתווסף אחרי מאפיין זה בתוויות המפה';
$ec_lang['lpn_labels_suffix_gradient_tip']='טקסט המוצג אחרי שיפוע אובדן הלחץ על המפה. אל תקלידו כאן סימן אחוז. הוא נוסף עבורכם כאשר היחידות הן אחוזים.';
$ec_lang['lpn_labels_separator']='טקסט בין ערכים';
$ec_lang['lpn_labels_separator_tip']='טקסט בין מאפיין אחד למשנהו בתווית. רווח כברירת מחדל.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='עדיפות';
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_link_tip']='הסדר שבו ערכים מוסרים כאשר תווית אינה נכנסת. 1 נשאר הכי הרבה זמן.';
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='הסדר שבו מוותרים על ערכים כאשר שתי תוויות צמתים חופפות. הערך שמספרו 1 מוותרים עליו ראשון. כאשר נותר ערך אחד בלבד והתוויות עדיין חופפות, תווית שלמה מוסתרת: זו שבה הדרישה נמוכה יותר, הלחץ קרוב יותר לאמצע הטווח, או הרום או העומד קרובים יותר מספרית לאלה של הצמתים השכנים.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='קידומת';
$ec_lang['lpn_labels_col_after']='סיומת';
$ec_lang['lpn_labels_col_decimals']='ספרות עשרוניות';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='הצגה';
$ec_lang['lpn_labels_show_tip']='הסדר שבו ערכים מופיעים בתווית. הערך שמספרו 1 מופיע ראשון: בראש תווית מוערמת, ובתחילת תווית בשורה אחת.';
$ec_lang['lpn_labels_priority_customer_tip']='הסדר שבו ערכים מוסרים מתווית לקוח. הערך שמספרו 1 מוסר ראשון.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='שימוש ביחידות';
$ec_lang['lpn_labels_use_units_tip']='סמנו כדי להציג את היחידה בתיבת אחרי ובתווית, ולשמור אותה מעודכנת כשהיחידות משתנות. בטלו את הסימון כדי להקליד טקסט אחרי משלכם.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='מצב התחלתי';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='צבעי צמתים';
$ec_lang['lpn_settings_sym_link_colors']='צבעי קישורים';
$ec_lang['lpn_field_id']='מזהה';
$ec_lang['lpn_backdrop_menu']='תמונת רקע…';
$ec_lang['lpn_backdrop_add']='הוסף';
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
$ec_lang['lpn_backdrop_scale']='קבע קנה מידה בבחירה';
$ec_lang['lpn_backdrop_scale_entry']='קנה מידה לפי קובץ וורלד או גודל פיקסל אחד במפה';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='שינוי קנה מידה מהגודל הנוכחי, סביב נקודה שתבחרו';
$ec_lang['lpn_backdrop_scale_from_prompt1']='לחצו על הנקודה בתמונת הרקע שצריכה להישאר במקומה.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='שנו קנה מידה מהגודל הנוכחי. 1 משאיר אותו כפי שהוא, 1.1 מגדיל אותו ב-10%, 0.9 מקטין אותו ב-10%.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='הזינו את גודל הפיקסל האחד במפה, או הדביקו את כל תוכן קובץ הוורלד של התמונה';
$ec_lang['lpn_backdrop_scale_entry_bad']='הקלידו מספר אחד עבור גודל פיקסל אחד במפה, או הדביקו את שש השורות של קובץ הוורלד.';
$ec_lang['lpn_backdrop_wld_bad']='קובץ הוורלד הזה מסובב, משקף או מותח את התמונה בצורה לא אחידה. המפה יכולה רק להזיז תמונה ולשנות את גודלה באותה מידה בשני הכיוונים, ולכן הקובץ לא נעשה בו שימוש.';
$ec_lang['lpn_backdrop_unreadable']='הדפדפן שלך אינו יכול להציג את התמונה הזאת. שמרו אותה כקובץ PNG או JPEG והוסיפו אותה שוב.';
$ec_lang['lpn_backdrop_position']='הזז';
$ec_lang['lpn_backdrop_remove']='הסר';
$ec_lang['lpn_backdrop_remove_confirm']='להסיר את תמונת הרקע?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='מפת העולם…';
$ec_lang['lpn_map_attach_tip']='מצרף את מפת העולם לפרויקט זה בלי לשנות אותו בשום דרך אחרת.';
$ec_lang['lpn_map_attach_add']='צירוף';
$ec_lang['lpn_map_attach_readjust']='כיוון מחדש';
$ec_lang['lpn_map_attach_readjust_tip']='חזרה לשלב 2 של תהליך צירוף המפה.';
$ec_lang['lpn_map_attach_scale_from']='שינוי קנה מידה מהגודל הנוכחי…';
$ec_lang['lpn_map_attach_scale_from_prompt']='שנו את קנה המידה של המפה מגודלה הנוכחי, סביב מרכז השרטוט שלכם. 1 משאיר אותו כפי שהוא, 1.1 מגדיל אותו ב-10%, 0.9 מקטין אותו ב-10%.';
$ec_lang['lpn_map_attach_scale_from_bad']='הקלידו מספר יחיד גדול מאפס.';
$ec_lang['lpn_map_attach_scale_from_done']='גודל המפה שונה, והשרטוט שלכם וכל קואורדינטה בו נשארים בדיוק כפי שהיו.';
$ec_lang['lpn_map_attach_none']='אין עדיין מפת עולם מצורפת לפרויקט זה. השתמשו קודם ב-מפה, מפת העולם, צירוף.';
$ec_lang['lpn_map_attach_remove']='ניתוק';
$ec_lang['lpn_map_attach_remove_tip']='מסיר את מפת העולם. השרטוט והקואורדינטות שלו אינם נפגעים בכל מקרה.';
$ec_lang['lpn_map_attach_done']='מפת העולם נמצאת כעת מאחורי השרטוט שלכם, והפרויקט שלכם לא השתנה. השתמשו ב-מפה, מפת העולם, ניתוק כדי להסיר אותה שוב.';
$ec_lang['lpn_map_attach_removed']='מפת העולם נעלמה, והשרטוט נשאר בדיוק כפי שהיה.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='השרטוט שלכם נמצא על מפה של כל העולם, באוקיינוס בקו רוחב אפס וקו אורך אפס. מצאו קודם את המקום שלכם: גררו והתקרבו או התרחקו במפה שמאחורי השרטוט, חפשו לפי שם מקום, או הקלידו קו רוחב וקו אורך. השרטוט עצמו אינו זז.';
$ec_lang['lpn_mapgeo_step1']='שלב 1 מתוך 2: מצאו את המקום שלכם בעולם';
$ec_lang['lpn_mapgeo_step2']='שלב 2 מתוך 2: התאימו את המפה שמאחורי השרטוט שלכם';
$ec_lang['lpn_mapgeo_hint1']='גררו והתקרבו או התרחקו במפה שמאחורי השרטוט שלכם, או חפשו מקום, או הקלידו קו רוחב וקו אורך. ואז לחצו על מיקום משוער.';
$ec_lang['lpn_mapgeo_readjust_intro']='השרטוט שלכם נמצא במקום שבו מיקמתם אותו לאחרונה. כדי להזיז אותו למקום אחר, גררו והתקרבו או התרחקו במפה שמאחורי השרטוט, חפשו לפי שם מקום, או הקלידו קו רוחב וקו אורך. השרטוט עצמו אינו זז.';
$ec_lang['lpn_mapgeo_hint2']='גררו בכל מקום כדי להחליק את המפה מתחת לשרטוט שלכם. השרטוט שלכם וכל קואורדינטה בו נשארים בדיוק במקומם. לחצו על תנו ייחוס גיאוגרפי כאן כשהמפה נכונה.';
$ec_lang['lpn_mapgeo_gestures']='תקריב מזיז את השרטוט שלכם ואת המפה יחד, כך שתוכלו לראות כמה טוב הם מתיישרים. גרירה מזיזה רק את המפה.';
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
$ec_lang['lpn_mapgeo_dial_turn']='סיבוב המפה';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} מעלות';
$ec_lang['lpn_mapgeo_dial_size']='גודל המפה';
$ec_lang['lpn_mapgeo_dial_size_read']='פי {f}';
$ec_lang['lpn_mapgeo_dial_help']='גררו את שני הסרגלים, או הקלידו בתיבות שמעליהם, כדי להגדיל או להקטין את המפה ולסובב אותה. אמצע כל סרגל הוא המצב שבו שלב 1 השאיר אותו, כך ש-1 ו-0 פירושם להשאיר כפי שהוא. מקשי החצים פועלים על שניהם.';
$ec_lang['lpn_mapgeo_place']='מיקום משוער';
$ec_lang['lpn_mapgeo_finish']='תנו ייחוס גיאוגרפי כאן';
$ec_lang['lpn_mapgeo_cancelled']='מפת העולם חזרה למקומה, והשרטוט שלכם מעולם לא זז.';
$ec_lang['lpn_mapgeo_locked']='סיימו באמצעות כפתור תנו ייחוס גיאוגרפי כאן, או לחצו על ביטול, לפני שתעברו לפרויקט אחר או תשמרו. מפת העולם עדיין בתהליך מיקום.';
$ec_lang['lpn_backdrop_scale_prompt1']='לחצו על שתי נקודות בתמונת הרקע, כגון שני קצוות של קנה מידה גרפי. אז הקלידו את המרחק האמיתי ביניהן.';
$ec_lang['lpn_backdrop_scale_prompt2']='מרחק אמיתי בין שתי הנקודות';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='לחצו על נקודת הבסיס (בתמונה) עבור ההזזה.';
$ec_lang['lpn_backdrop_position_prompt2']='בחרו את השיטה עבור נקודת היעד, ואז לחצו על המשך.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='מתאים את תמונת הרקע.';
$ec_lang['lpn_backdrop_target_label']='הזז נקודה זו אל:';
$ec_lang['lpn_backdrop_target_node']='צומת';
$ec_lang['lpn_backdrop_target_free']='כל נקודה על המפה';
$ec_lang['lpn_backdrop_target_coords']='קואורדינטות שתקלידו';
$ec_lang['lpn_backdrop_coords_prompt']='הקלידו את ה-X,Y שאליהם הנקודה צריכה לעבור';
$ec_lang['lpn_backdrop_continue']='המשך';
$ec_lang['lpn_tool_settings']='הגדרות';
$ec_lang['lpn_settings_show_titles']='הצג כותרות עמוד';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_show_titles_tip']='מסתיר את כותרת העמוד ואת שורת הברוכים הבאים מעל השרטוט, כך שלמפה יש יותר מקום לעבודה. ההדפסה תמיד מציגה רק מפה נקייה.';
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='הסתר כותרות אלה';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='הצג את עזרת הבחירה';
$ec_lang['lpn_settings_area_hint_tip']='מציג את הבועה מעל המפה המסבירה מה תעשה הלחיצה הבאה שלכם בזמן שאתם בוחרים אזור.';
$ec_lang['lpn_settings_id_prefixes']='קידומות מזהה';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='ערכי יצירה';
$ec_lang['lpn_settings_defaults_note']='משמש עבור אלמנטים שתיצרו מכאן ואילך. אלמנטים קיימים אינם משתנים.';
$ec_lang['lpn_settings_push_note']='רק המאפיינים שהתוויות שלהם מוצגות כרגע מוחלים.';
$ec_lang['lpn_settings_push_btn']='החלת ערכי האלמנטים החדשים האלה על כל אלמנט קיים';
$ec_lang['lpn_push_confirm']='להחליף מאפיינים אלה בכל אלמנט קיים בערכי ההתחלה הנוכחיים? ערכים שהקלדתם יידרסו. ניתן לבטל פעולה זו.';
$ec_lang['lpn_push_properties']='מאפיינים:';
$ec_lang['lpn_push_assets']='צמתים וצינורות:';
$ec_lang['lpn_push_none_displayed']='שום ערך התחלה אינו מוצג כתווית כרגע, ולכן אין מה להחיל. הפעילו את התוויות עבור המאפיינים הרצויים לכם בלוח התוויות, ואז נסו שוב.';
$ec_lang['lpn_push_nothing']='לשום אלמנט קיים אין אף אחד מהמאפיינים המוחלים.';
$ec_lang['lpn_push_no_change']='לכל אלמנט כבר יש ערכים אלה, ולכן שום דבר לא ישתנה.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='מאפיינים מותאמים אישית';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='מאפיינים שאתם מגדירים בעצמכם למטרותיכם. הם נשמרים עם הפרויקט והתרחישים בדיוק כמו כל שאר המאפיינים.';
$ec_lang['lpn_cp_design']='הגדרה';
$ec_lang['lpn_cp_design_tip']='שורה אחת לכל מאפיין מותאם אישית, וכל שורה נפתחת כדי להציג: מפתח, תווית, חל על, אמת כ־, אפשר או הגבל, שדה התווים הנקרא לפי בחירה זו, גבול תחתון לאורך, גבול עליון לאורך, גבול תחתון, גבול עליון.';
$ec_lang['lpn_cp_add']='הוסף מאפיין מותאם אישית';
$ec_lang['lpn_cp_add_tip']='מוסיף שורה לטבלת ההגדרה ופותח אותה לעריכה.';
$ec_lang['lpn_cp_remove_tip']='מסיר מאפיין זה מטבלת ההגדרה. ערכים שכבר הוקלדו על האלמנטים שלכם נשמרים בקובץ וחוזרים אם תגדירו שוב את אותו מפתח.';
$ec_lang['lpn_cp_none']='עדיין לא הוגדר אף מאפיין מותאם אישית.';
$ec_lang['lpn_cp_unnamed']='עדיין ללא שם';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='מפתח';
$ec_lang['lpn_cp_key_tip']='מפתח: המאפיין נשמר תחת שם זה. רווחים אינם מותרים, ותחילית מתווספת עבורכם כדי שהמפתח שלכם לעולם לא יתנגש עם שדה מובנה.';
$ec_lang['lpn_cp_label']='תווית';
$ec_lang['lpn_cp_label_tip']='תווית: הקורא רואה זאת בתיבת המאפיינים, בחיפוש, ובראש עמודת טבלה.';
$ec_lang['lpn_cp_applies']='חל על';
$ec_lang['lpn_cp_applies_tip']='חל על: רשימה מופרדת בפסיקים של תחיליות מזהה עבור אלמנטים המשתמשים במאפיין זה, כגון J,L,R.';
$ec_lang['lpn_cp_validate']='אמת כ־';
$ec_lang['lpn_cp_validate_tip']='אמת כ־: זה קובע כיצד נראה ערך תקין. כללי רישיות קוראים רק את האלף-בית האנגלי, וזוהי מגבלה מוצהרת. בחרו אל תאמת כדי לקבל כל דבר.';
$ec_lang['lpn_cp_restrict']='הגבל תווים אלה';
$ec_lang['lpn_cp_restrict_tip']='הגבל תווים אלה: ערך רשאי להשתמש רק בתווים הרשומים כאן, או באף אחד מהם, כאשר "@" משמעו כל אות; "#" משמעו כל ספרה מספרית, ועליכם לרשום בנפרד את "-", "." ו-"," אם הם מותרים; וכל תווי רווח לבן חייבים להיות בין תווים אחרים.';
$ec_lang['lpn_cp_restrict_mode']='אפשר או הגבל';
$ec_lang['lpn_cp_restrict_mode_tip']='אפשר או הגבל: התווים הנתונים הם או היחידים שערך רשאי להשתמש בהם, או אלה שאינו רשאי להשתמש בהם.';
$ec_lang['lpn_cp_restrict_allow']='אפשר רק תווים אלה';
$ec_lang['lpn_cp_minlength']='גבול תחתון לאורך';
$ec_lang['lpn_cp_minlength_tip']='גבול תחתון לאורך: כל ערך קצר יותר מסומן, וכך מוצאים ערכים ריקים וערכים שהוקלדו רק בחלקם.';
$ec_lang['lpn_cp_length']='גבול עליון לאורך';
$ec_lang['lpn_cp_length_tip']='גבול עליון לאורך: כל ערך ארוך יותר מסומן.';
$ec_lang['lpn_cp_low']='גבול תחתון';
$ec_lang['lpn_cp_low_tip']='גבול תחתון: זהו הערך הקטן ביותר שאתם מצפים לו. מספרים מושווים כמספרים, וטקסט לפי סדר מילוני.';
$ec_lang['lpn_cp_high']='גבול עליון';
$ec_lang['lpn_cp_high_tip']='גבול עליון: זהו הערך הגדול ביותר שאתם מצפים לו. מספרים מושווים כמספרים, וטקסט לפי סדר מילוני.';
$ec_lang['lpn_cp_val_none']='אל תאמת';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='מספר .';
$ec_lang['lpn_cp_val_number_comma']='מספר ,';
$ec_lang['lpn_cp_val_integer']='מספר שלם';
$ec_lang['lpn_cp_val_upper']='אותיות גדולות';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} הערך נשמר בדיוק כפי שהקלדתם אותו.';
$ec_lang['lpn_cp_bad_number']='ערך זה אינו מספר כנדרש עבור מאפיין זה.';
$ec_lang['lpn_cp_bad_integer']='ערך זה אינו מספר שלם כנדרש עבור מאפיין זה.';
$ec_lang['lpn_cp_bad_case']='ערך זה אינו באותיות גדולות כנדרש עבור מאפיין זה.';
$ec_lang['lpn_cp_bad_chars']='ערך זה משתמש בתו שמאפיין זה אינו מתיר.';
$ec_lang['lpn_cp_bad_space']='רווח לבן מותר רק בין תווים אחרים.';
$ec_lang['lpn_cp_bad_minlength']='ערך זה קצר יותר ממה שמאפיין זה מתיר.';
$ec_lang['lpn_cp_bad_length']='ערך זה ארוך יותר ממה שמאפיין זה מתיר.';
$ec_lang['lpn_cp_bad_low']='ערך זה נמוך מהגבול התחתון של מאפיין זה.';
$ec_lang['lpn_cp_bad_high']='ערך זה גבוה מהגבול העליון של מאפיין זה.';
$ec_lang['lpn_cp_key_needed']='תנו למאפיין המותאם אישית הזה מפתח ללא רווחים.';
$ec_lang['lpn_cp_key_taken']='מאפיין מותאם אישית אחר כבר משתמש במפתח זה.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='תרחיש';
$ec_lang['lpn_scenario_base']='בסיס';
// "Custom", not "Own" (Tom, 2026-08-14: *"I love 'custom'. 'Changed' is a little dangerous."*),
// and the reason is a TRANSLATION reason rather than an English one -- which is why it is worth
// a comment. "Own values" calques directly onto the standard term for EIGENVALUES in most of
// Europe: es valores propios, pt valores proprios, de Eigenwerte, cs vlastni hodnota, hr vlastita
// vrijednost, bg/ru/sr sobstveni. Ten languages in sprint 316 had to detect and route around that
// independently, and three of them, forced off the calque, landed on "CHANGED values" -- which is
// FALSE here, because a scenario's custom value may be identical to Base's (see
// lpn_scenario_override_tip, and the assertion in dev/lpn-spike/scenario-harness.js).
// "Custom" has no calque path into mathematics in any of them, so the trap does not exist to be
// routed around, and it says ownership without implying difference. Seven languages had already
// chosen exactly this family unprompted (fr personnalisees, it personalizzati, es exclusivos,
// pt individuais, ar mukhassasa, fa ekhtesasi, ro specifice).
$ec_lang['lpn_scenario_overrides']='מס׳ ערכים מותאמים אישית';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='הטבעת הכתומה פירושה שאלמנט זה מחזיק ערך השייך לתרחיש {name} בלבד.';
$ec_lang['lpn_scenario_overrides_tip']='כל אחד מהערכים האלה מסומן על המפה בטבעת כתומה. עברו אל {base} כדי לראות את השרטוט בלעדיהם.';
$ec_lang['lpn_scenario_menu']='תרחישים';
$ec_lang['lpn_scenario_tip']='קבוצת הערכים שהשרטוט מציג והעמוד פותר כרגע. לחצו כדי לעבור בין תרחישים, או כדי להוסיף, לשנות שם, או למחוק אחד.';
$ec_lang['lpn_scenario_new']='תרחיש חדש…';
$ec_lang['lpn_scenario_new_name']='תרחיש {n}';
$ec_lang['lpn_scenario_prompt_name']='שם עבור תרחיש זה';
$ec_lang['lpn_scenario_rename']='שינוי שם תרחיש…';
$ec_lang['lpn_scenario_delete']='מחיקת תרחיש';
$ec_lang['lpn_scenario_delete_confirm']='למחוק את התרחיש {name}, ואת {n} הערכים ששייכים לו בלבד? השרטוט עצמו אינו משתנה.';
$ec_lang['lpn_scenario_override']='רק בתרחיש זה';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='מסומן פירושו שערך זה שייך לתרחיש זה בלבד, גם כאשר הוא אותו מספר כמו הבסיס. נקו את התיבה כדי להשתמש שוב בערך הבסיס.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='תרחיש בסיס: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} אינו חלק מהרשת ב-{scenario}. הוא עדיין בשרטוט, ובתרחישים האחרים שלכם.';
$ec_lang['lpn_scenario_push_btn']='החלת ערכי הבסיס על כל התרחישים';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='כל תרחיש חוזר לערך הבסיס עבור התכונות שתוויותיהן מוצגות כרגע. ערכים ששייכים לתרחישים אלה בלבד נמחקים.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='להחיל על כל תרחיש את ערכי הבסיס עבור תכונות אלה? ערכים ששייכים לתרחישים אלה בלבד נמחקים. ניתן לבטל פעולה זו.';
$ec_lang['lpn_scenario_push_scenarios']='תרחישים מושפעים:';
$ec_lang['lpn_scenario_push_values']='ערכים שיימחקו:';
$ec_lang['lpn_scenario_push_none']='לאף תרחיש אין ערך משלו עבור אחת מהתכונות האלה, כך שכלום לא ישתנה. שום דבר אינו נמחק.';
$ec_lang['lpn_scenario_preset_flow_static']='1. מבחן ספיקה: סטטי';
$ec_lang['lpn_scenario_preset_flow_static_tip']='כיול מבחן ספיקה לרשת תכן בספיקה אפס. בתרחיש זה הגדירו את הדרישה בכל הצמתים ל-0.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. מבחן ספיקה: בינוני';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='כיול מבחן ספיקה לרשת תכן בספיקה הראשונה שדווחה. בתרחיש זה הגדירו את הדרישה בצומת הזורם לספיקה הראשונה שנמדדה, ואת הדרישה בכל שאר הצמתים ל-0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. מבחן ספיקה: מרבי';
$ec_lang['lpn_scenario_preset_flow_max_tip']='כיול מבחן ספיקה לרשת תכן בספיקה המרבית שדווחה. בתרחיש זה הגדירו את הדרישה בצומת הזורם לספיקה המרבית שנמדדה, ואת הדרישה בכל שאר הצמתים ל-0.';
$ec_lang['lpn_scenario_preset_average_day']='4. יום ממוצע';
$ec_lang['lpn_scenario_preset_average_day_tip']='מכפיל דרישה 1: כל דרישה כפי שהוזנה, הנחשבת לדרישת יום ממוצע.';
$ec_lang['lpn_scenario_preset_max_day']='5. יום מרבי';
$ec_lang['lpn_scenario_preset_max_day_tip']='מכפיל דרישה 2.0 כפול יום ממוצע, ערך מציין מקום. רוב המערכות נמצאות בין 1.2 ל-3.0 (National Research Council, 2006). קבעו את הערך של המערכת שלכם בהגדרות, חישוב, הידראוליקה, מכפיל דרישה.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. שעת שיא';
$ec_lang['lpn_scenario_preset_peak_hour_tip']='מכפיל דרישה 3.0 כפול יום ממוצע, ערך מציין מקום. רוב המערכות נמצאות בין 3.0 ל-6.0 (National Research Council, 2006). קבעו את הערך של המערכת שלכם בהגדרות, חישוב, הידראוליקה, מכפיל דרישה.';
$ec_lang['lpn_scenario_preset_fire_max_day']='7. כיבוי אש בתוספת יום מרבי';
$ec_lang['lpn_scenario_preset_fire_max_day_tip']='דרישת יום מרבי (מכפיל 2.0). הריצו בתרחיש זה ניתוח ספיקת כיבוי אש: הוא מוסיף את ספיקת כיבוי האש בכל צומת על גבי דרישה זו.';
$ec_lang['lpn_delete_drops_overrides']='מחיקת אלמנט זה מוחקת גם {n} ערכים שהתרחישים שלכם מחזיקים עבורו. להמשיך?';
$ec_lang['lpn_push_base_only']='פעולה זו משנה את השרטוט עצמו, כך שניתן לבצע אותה רק ב-{base}. עברו ל-{base} ונסו שוב.';
$ec_lang['lpn_field_active']='חלק מהרשת';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='נקו תיבה זו כדי להשאיר את האלמנט על השרטוט אך מחוץ לרשת: הוא מצויר באפור והפותר מתעלם ממנו. בתרחיש, כך צינור מוצע מופעל וכבוי.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='מעריך ממטיר';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='המעריך במשוואת המטפטף של EPANET עבור ממטירים ודליפות: ספיקה = מקדם × לחץ בחזקת מעריך זה. הוא משנה את התשובה רק כאשר לצומת יש מטפטף, שכרגע פירושו רשת שנקראה מקובץ EPANET.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='קריאת DEM';
$ec_lang['lpn_elev_dem_sample_tip']='קורא את הרום של ה-DEM בצומת זה ומציג אותו למטה. שום דבר בתיבת הרום אינו משתנה. הרזולוציה האופקית של ה-DEM היא כ-30 מ׳ ברוב כדור הארץ, ומדויקת יותר במקומות שיש בהם נתונים טובים יותר.';
$ec_lang['lpn_elev_dem_use']='שימוש ב-DEM';
$ec_lang['lpn_elev_dem_use_tip']='מכניס את הרום של ה-DEM בצומת זה לתיבת הרום שלמעלה, במקום מה שכתוב בה. הוא קורא את ה-DEM תחילה אם עוד לא נקרא. ביטול פעולה אחד מחזיר אותו למקומו.';
$ec_lang['lpn_elev_dem_none']='ל-DEM אין רום עבור צומת זה.';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM אומר {v} {u}.';
$ec_lang['lpn_settings_elev_source']='מקור הרום';
$ec_lang['lpn_settings_elev_source_tip']='מהיכן צומת חדש מקבל את הרום שלו. פני הקרקע נקראים מ-Mapbox DEM, שרזולוציה שלו כ-30 מ׳ ברוב כדור הארץ, ומדויקת יותר במקומות שיש בהם נתונים טובים יותר.';
$ec_lang['lpn_settings_elev_source_typed']='הרום שהוקלד למעלה';
$ec_lang['lpn_settings_elev_source_dem']='DEM של Mapbox';
$ec_lang['lpn_settings_accuracy']='דיוק';
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
$ec_lang['lpn_settings_default_is']='ברירת המחדל היא {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='עד כמה קרוב הפותר חייב להגיע לפני שהוא עוצר, נמדד לפי הכמות שבה הספיקות עדיין משתנות מאיטרציה אחת לבאה אחריה. מספר קטן יותר מדויק יותר ולוקח יותר זמן. שני הפותרים קוראים את אותה תיבה, וכל אחד מודד את השינוי הזה כנגד סכום שונה: הפותר המובנה כנגד סכום הדרישות, EPANET כנגד סכום ספיקות הקישורים. אם נשאר ריק, עמוד זה משתמש בדיוק מחמיר יותר מברירת המחדל של EPANET עצמו.';
$ec_lang['lpn_settings_specific_gravity']='צפיפות סגולית';
$ec_lang['lpn_settings_specific_gravity_tip']='משקל הנוזל בהשוואה למים. הוא משנה את הלחצים שמד יקרא, לא את הספיקות.';
$ec_lang['lpn_settings_viscosity']='צמיגות יחסית';
$ec_lang['lpn_settings_viscosity_tip']='הצמיגות של הנוזל בהשוואה למים ב-20 מעלות צלזיוס. היא משנה את התשובה רק תחת שיטת Darcy-Weisbach.';
$ec_lang['lpn_settings_trials']='מספר איטרציות מרבי';
$ec_lang['lpn_settings_trials_tip']='כמה איטרציות מותרות לפני שהפותר מוותר על רשת שלא מתכנסת.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='אם אינו מתכנס';
$ec_lang['lpn_settings_unbalanced_tip']='מה לעשות עם רשת שמיצתה את האיטרציות שלה ועדיין לא התכנסה. מתן איטרציות נוספות מגיע לעיתים קרובות להתכנסות. עצירה מדווחת על האיטרציה האחרונה כפי שהיא, שאינה פתרון. רק פותר EPANET קורא תיבה זו. הפותר המובנה תמיד נעצר ומסמן את התשובה כלא-מתכנסת.';
$ec_lang['lpn_settings_unbalanced_continue']='אפשרו איטרציות נוספות';
$ec_lang['lpn_settings_unbalanced_stop']='עצרו ודווחו על האיטרציה האחרונה';
$ec_lang['lpn_settings_unbalanced_trials']='איטרציות נוספות לפני דיווח';
$ec_lang['lpn_settings_unbalanced_trials_tip']='כמה איטרציות נוספות לאפשר לאחר שהמקסימום שלמעלה מוצה, לפני שהאיטרציה האחרונה מדווחת. רק פותר EPANET קורא תיבה זו.';
$ec_lang['lpn_settings_head_error']='מגבלת שגיאת עומד';
$ec_lang['lpn_settings_head_error_tip']='בדיקה נוספת שהפותר חייב לעבור לפני שהוא עוצר: שגיאת העומד הגדולה ביותר שנותרה בכל צינור בודד. אפס פירושו לא להחיל בדיקה זו. רק פותר EPANET קורא תיבה זו.';
$ec_lang['lpn_settings_flow_change']='מגבלת שינוי ספיקה';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='בדיקה נוספת שהפותר חייב לעבור לפני שהוא עוצר: השינוי המרבי בספיקה של כל צינור בודד מאיטרציה אחת לבאה אחריה. אפס פירושו לא להחיל בדיקה זו. רק פותר EPANET קורא תיבה זו.';
$ec_lang['lpn_settings_damp_limit']='ריסון מתחיל ב';
$ec_lang['lpn_settings_damp_limit_tip']='הדיוק שבו הפותר מתחיל לנקוט צעדים קטנים יותר, מה שיכול לעזור לרשת מתנדנדת להתכנס. אפס פירושו שהפותר לעולם אינו מרסן. רק פותר EPANET קורא תיבה זו.';
$ec_lang['lpn_settings_option_unset']='לא נקבע';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='מקדם יחיד המוחל בבת אחת על כל דרישה ברשת. השתמשו בו כדי לשאול מה המערכת עושה בשימוש גבוה או נמוך יותר מהיום. הוא אינו משנה את המספרים שהקלדתם. לתרחיש יכול להיות מכפיל משלו, כך שיום ממוצע, יום מרבי ושעת שיא הם כל אחד מספר אחד; השאירו אותו ריק בתרחיש כדי להשתמש במכפיל של הפרויקט.';
$ec_lang['lpn_settings_engine_native']='פתור עם פותר EPANET';
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
$ec_lang['lpn_settings_engine_native_tip']='הפעילו כדי להשתמש בפותר המובנה במידת האפשר. אחרת, נעשה תמיד שימוש בפותר EPANET של ה-US EPA. הפותר המובנה אינו משמש להרצות תקופתיות מורחבות או לרשת הכוללת PRV,‏ PSV או FCV פעילים. בפעם הראשונה שבה נעשה שימוש בפותר EPANET, כ-650 KB מורדים ואז נשמרים במכשיר זה. כאשר צינור נושא אובדן לחץ מקומי (קטן), שני הפותרים חלוקים בספרות האחרונות: EPANET מעגל את הערך שהוא משתמש בו עבור כובד המשיכה, כך שהאובדנים המקומיים שלו יוצאים נמוכים במעט מהצורה המדויקת.';
$ec_lang['lpn_engine_loading']='טוען את פותר EPANET…';
$ec_lang['lpn_engine_failed']='לא ניתן היה לטעון את פותר EPANET. מציג את הפותר המובנה במקום.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='נפתר באמצעות פותר EPANET, משום ששסתומים אלה נפתחים ונסגרים מעצמם:';
$ec_lang['lpn_unit_unknown']='שרטוט זה קובע יחידה שעמוד זה אינו מציע: {unit}. הכול נשמר ומוצג בדיוק כפי שהגיע, ושום דבר לא שונה. לא ניתן לתת תשובות עד שעמוד זה יכיר את היחידה הזו, משום שאין דרך לדעת מה גודלה.';
$ec_lang['lpn_engine_manning_note']='הערה: עם חספוס Manning,‏ EPANET מעגל את הקבוע במשוואת Manning, כך שאובדן הלחץ יוצא נמוך בכ-0.6% מהצורה המדויקת.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='פותר ה-EPANET לא קיבל רשת זו, ולכן היא לא רצה.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='פותר ה-EPANET אמר: {message}';
$ec_lang['lpn_engine_refused_fallback']='המספרים על המסך הגיעו מהפותר המובנה במקום זאת.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='המספרים על המסך הגיעו מהפותר המובנה במקום זאת. הוא מחשב רגע אחד בכל פעם, כך שזוהי הרשת ב-{time} בלבד, כאשר כל מכל עדיין נמצא במפלס ההתחלה שלו.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='בקרות אלה קוראות בשם אלמנט שאינו עוד בפרויקט זה, ולכן הן הושמטו: {ids}';
$ec_lang['lpn_control_unreadable_note']='בקרות אלה לא היה ניתן לקרוא, ולכן הן הושמטו: {ids}';
$ec_lang['lpn_rule_dangling_note']='כללים אלה מפנים לאלמנט שאינו עוד בפרויקט זה, ולכן הם הוזנחו בהרצה זו: {ids}';
$ec_lang['lpn_rule_unreadable_note']='לא ניתן היה לקרוא כללים אלה, ולכן הם הוזנחו בהרצה זו: {ids}';
$ec_lang['lpn_settings_text_size']='גודל טקסט (פיקסלים)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='גודל סמל (פיקסלים)';
$ec_lang['lpn_settings_link_width']='רוחב קו הצינור (פיקסלים)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='חצי כיוון זרימה';
$ec_lang['lpn_settings_show_arrows_tip']='ציירו חץ על כל צינור המראה לאיזה כיוון המים זורמים. החצים מופיעים לאחר הרצה, וכיבוים משאיר את התוצאות ללא שינוי. הגדרה זו נשמרת עם הפרויקט.';
$ec_lang['lpn_settings_align_labels']='יישר תוויות צינורות עם הצינורות';
$ec_lang['lpn_settings_readability_bias']='מעלות משמאל לאנך לפני שתווית מתהפכת';
$ec_lang['lpn_settings_readability_bias_tip']='הפוך תווית כדי לשמור עליה זקופה כאשר היא נוטה יותר ממספר המעלות הזה משמאל לאנך.';
$ec_lang['lpn_settings_mask_labels']='רקע אטום מאחורי תוויות';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='הצמדת קווי מוביל לזוויות קבועות';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_leader_snap_tip']='כאשר גוררים תווית הרחק ממה שהיא מציינת, הקו חזרה אליה נמשך אל הזווית הקרובה ביותר מבין הזוויות הקבועות אם גוררים קרוב אליה. המשיכו לגרור וההצמדה משתחררת, כך שכל זווית עדיין זמינה. כיבוי גורר בחופשיות, מה שעמוד זה עשה תמיד.';
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='הצגת תוויות כשהתקריב מגיע לרוחב מפה זה או פחות';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='התוויות מצוירות רק כאשר תצוגת המפה ברוחב זה או צר יותר. השאירו את התיבה ריקה כדי לצייר אותן בכל תקריב. הקלידו 0 כדי לעולם לא לצייר תווית, בכל תקריב.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='הצג תמיד';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap']='מניעת גדילת צמתים לגודל גדול מ-';
$ec_lang['lpn_settings_symbol_cap_mid']=' פעמים מהאורך באחוזון ה-';
$ec_lang['lpn_settings_symbol_cap_post']='של הצינורות';
$ec_lang['lpn_settings_symbol_cap_tip']='צומת מפסיק לגדול על הקרקע ברגע שקוטרו היה מגיע למספר הפעמים הזה של אורך הצינור באחוזון זה מתוך כל אורכי הצינורות ברשת. מעבר לנקודה זו על המפה, צמתים, צינורות וסמלים אחרים מתכווצים על המסך ככל שאתם מתרחקים, במקום לגדול על הקרקע. מאגרים ומכלים הם היוצא מן הכלל ושומרים על גודלם במסך בכל תקריב.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='אטימות סמל (0 עד 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='אטימות תמונת רקע (0 עד 1)';
$ec_lang['lpn_settings_map_display']='מראה';
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
$ec_lang['lpn_settings_legend_position']='מיקום מקרא התוויות';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='ללא';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='כבוי';
$ec_lang['lpn_settings_legend_top_left']='למעלה משמאל';
$ec_lang['lpn_settings_legend_top_right']='למעלה מימין';
$ec_lang['lpn_settings_legend_middle_left']='באמצע משמאל';
$ec_lang['lpn_settings_legend_middle_right']='באמצע מימין';
$ec_lang['lpn_settings_legend_bottom_left']='למטה משמאל';
$ec_lang['lpn_settings_legend_bottom_right']='למטה מימין';
$ec_lang['lpn_settings_color_node_field']='צבע צומת';
$ec_lang['lpn_settings_color_link_field']='צבע צינור';
$ec_lang['lpn_settings_color_ramp']='ערכת צבעים';
$ec_lang['lpn_settings_color_credits']='קרדיטים';
$ec_lang['lpn_color_ramp_epanet']='כחול לאדום (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='סגול לצהוב (קל יותר להבחין בין צבע לצבע)';
$ec_lang['lpn_color_ramp_gray']='אפור בהיר לכהה';
$ec_lang['lpn_settings_color_reverse']='הפוך את סדר הצבעים';
$ec_lang['lpn_color_none']='ללא צבע';
$ec_lang['lpn_settings_color_key_position']='מיקום מקרא הצבעים';
$ec_lang['lpn_settings_color_breaks']='גבולות רצועות הצבע';
$ec_lang['lpn_settings_color_equal_intervals']='מרווחים שווים';
$ec_lang['lpn_settings_color_equal_counts']='כמויות שוות';
$ec_lang['lpn_settings_color_no_values']='אין עדיין ערכים לעבוד מהם. פתרו את הרשת תחילה.';
$ec_lang['lpn_confirm_restore_defaults']='לאפס את כל ההגדרות (קידומות מזהה, ערכי התחלה, הגדרות פותר, מראה המפה, מיקום המקרא, ותוויות גלויות) לערכיהן המקוריים? הרשת שלכם אינה משתנה. ההגדרות שייכות לפרויקט הפתוח, כך שהפרויקטים האחרים שלכם שומרים על שלהם.';
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
$ec_lang['lpn_settings_wipe_btn']='התחילו מחדש';
$ec_lang['lpn_confirm_wipe']='להתחיל מחדש, ולמחוק הכול ששמור עבור עמוד זה: כל פרויקט, כל תמונת רקע, כל ההגדרות, ובחירות היחידות שלכם? העמוד ייטען מחדש בדיוק כפי שמבקר חדש לגמרי היה רואה אותו. לא ניתן לבטל פעולה זו.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='העתיקו קישור זה:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='זמן';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='משך ריצה כולל';
$ec_lang['lpn_time_hyd_step']='צעד זמן הידראולי';
$ec_lang['lpn_time_pattern_step']='צעד זמן תבנית';
$ec_lang['lpn_time_pattern_start']='זמן התחלת תבנית';
$ec_lang['lpn_time_report_step']='צעד זמן דיווח';
$ec_lang['lpn_time_report_start']='זמן התחלת דיווח';
$ec_lang['lpn_time_clock_start']='שעון בהתחלה';
$ec_lang['lpn_time_clock_day']='יום {day},‏ {clock}';
$ec_lang['lpn_time_format_tip']='כתבו זמן כשעות ודקות, כמו 2:30. מספר פשוט פירושו שעות, כך ש-8 הוא שמונה שעות. חצי שעה הוא 0:30.';
$ec_lang['lpn_time_running']='מחשב את הסימולציה על פני תקופת הזמן עם פותר EPANET.';
$ec_lang['lpn_time_no_engine']='הפותר המובנה מחשב רגע אחד בכל פעם, כך שזוהי הרשת ב-{time} בלבד: כל תבנית נקראת באותו רגע, וכל מכל עדיין נמצא במפלס ההתחלה שלו במקום להתמלא ולהתרוקן. התחברו לאינטרנט פעם אחת כדי להביא את פותר EPANET, המריץ סימולציה על פני תקופת זמן.';
$ec_lang['lpn_time_slider']='זמן סימולציה שחלף';
$ec_lang['lpn_time_no_period']='לפרויקט זה אין סימולציה על פני תקופת זמן מוגדרת, כך שיש רגע אחד בלבד להצגה. הגדירו זמן ריצה כולל בהגדרות, חישוב, זמן כדי להריץ סימולציה על פני תקופת זמן.';
$ec_lang['lpn_time_first']='עבור להתחלה';
$ec_lang['lpn_time_prev']='צעד אחורה';
$ec_lang['lpn_time_play']='הפעל';
$ec_lang['lpn_time_play_tip']='הפעל אנימציה';
$ec_lang['lpn_time_pause_tip']='השהה אנימציה';
$ec_lang['lpn_time_pause']='השהה';
$ec_lang['lpn_time_next']='צעד קדימה';
$ec_lang['lpn_time_last']='עבור לסוף';
$ec_lang['lpn_time_tank']='מכל';
$ec_lang['lpn_time_level']='מפלס מים';
$ec_lang['lpn_time_run']='חשב';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='פתרו רשת זו בכל צעד זמן הידראולי.';
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
$ec_lang['lpn_time_run_done']='ההרצה הסתיימה. זמני דיווח: {frames}. זמן שחלף: {secs} שנ׳.';
$ec_lang['lpn_time_runbox_hide']='אל תציג תיבה זו שוב';
$ec_lang['lpn_settings_runbox']='הצג את תיבת התקדמות ההרצה';
$ec_lang['lpn_settings_runbox_tip']='תיבה המדווחת עד כמה התקדמה הרצה ומה מצאה. כשהיא כבויה, הרצה שהסתיימה אומרת את אותו הדבר בשורת המצב למשך מספר שניות במקום זאת. זוהי הגדרה עבור דפדפן זה, לא עבור הפרויקט.';
$ec_lang['lpn_time_run_failed']='ההרצה לא הסתיימה, ולכן אין תוצאות לזמנים המאוחרים יותר.';
$ec_lang['lpn_time_run_report']='דוח הרצת EPANET';
$ec_lang['lpn_time_run_report_copy']='העתק';
$ec_lang['lpn_time_run_report_copied']='הועתק';
$ec_lang['lpn_time_run_report_tip']='מה שפותר ה-EPANET עצמו הדפיס על ההרצה האחרונה: האם היא התכנסה, וכל דבר שעליו הוא הזהיר. זהו הטקסט של הפותר עצמו, לא שלנו.';

$ec_lang['lpn_time_speed']='מהירות';
$ec_lang['lpn_time_speed_tip']='מהירות ניגון';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='חיפוש הגדרות';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='הקלידו מילה אחת או כמה מילים כדי לראות הגדרות המזכירות את כולן.';
$ec_lang['lpn_settings_no_match']='אין הגדרה המזכירה מילה זו.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='רוחב רשימת קטע ההגדרות';
$ec_lang['lpn_rpane_empty']='שום דבר אינו מעוגן כאן עדיין. כל מה ששייך לפרויקט כולו נמצא בהגדרות.';
$ec_lang['lpn_time_settings_open']='הגדרות זמן';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='הדמיה';
$ec_lang['lpn_settings_sec_map']='מפה ועמוד';
$ec_lang['lpn_settings_sec_assets']='אלמנטים';
$ec_lang['lpn_settings_sec_calculation']='חישוב';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='לקוח';
$ec_lang['lpn_labels_customer_note']='תווית לקוח מציגה את הערכים המסומנים כאן. היא מצוירת באותו גודל טקסט כמו כל תווית אחרת על המפה.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='תוויות לקוחות מצוירות רק כאשר תצוגת המפה ברוחב זה או צר יותר. השאירו את התיבה ריקה כדי לצייר אותן בכל תקריב. הקלידו 0 כדי לעולם לא לצייר תווית לקוח, בכל תקריב. אין לכך השפעה אם הערך גדול מההגדרה הדומה עבור כל התוויות.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='שימוש בתצוגה הנוכחית';
$ec_lang['lpn_settings_page']='עמוד';
$ec_lang['lpn_settings_page_note']='נשמר במחשבון זה, לא בפרויקט.';
$ec_lang['lpn_settings_hydraulics']='הידראוליקה';
$ec_lang['lpn_settings_quality']='איכות מים';
$ec_lang['lpn_settings_quality_track']='פרמטר איכות';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='בחרו מה ההרצה צריכה לעקוב אחריו דרך הצינורות: כמה זמן המים נמצאים במערכת, מהיכן הם הגיעו, או חומר כימי המגיב תוך כדי מעבר. רק החומר הכימי זקוק למקדמים.';
$ec_lang['lpn_settings_quality_source']='צומת מעקב';
$ec_lang['lpn_settings_quality_source_tip']='הצומת שהמים שלו מוקבים. כל צומת אחר מציג לאחר מכן את חלק המים שלו שהגיע מאותו צומת.';
$ec_lang['lpn_quality_none']='ללא';
$ec_lang['lpn_quality_trace']='מעקב מקור';
$ec_lang['lpn_quality_chemical']='חומר כימי שמגיב';
$ec_lang['lpn_quality_needs_run']='איכות המים נישאת לאורך הצינורות תוך כדי מעבר המים, ולכן היא דורשת סימולציה על פני תקופת זמן: מנוע EPANET וזמן ריצה כולל. הגדירו זמן ריצה כולל תחת זמן, ולאחר מכן לחצו על כפתור חשב.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='חומר כימי ויחידות';
$ec_lang['lpn_quality_chemical_name_tip']='החומר הכימי שאתה עוקב אחריו, לדוגמה כלור. השאירו ריק כדי להשתמש בתווית ברירת המחדל של EPANET עצמו, Chemical. מוצג בדוחות שלכם, אך אינו משמש בחישובים.';
$ec_lang['lpn_quality_mass_units']='יחידות מסה';
$ec_lang['lpn_quality_mass_units_tip']='מחצית היחידות של רשומת האיכות, שתי הבחירות של EPANET עצמו.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='סבילות איכות';
$ec_lang['lpn_quality_tolerance_tip']='כמה יכולות שתי חבילות מים סמוכות להיבדל בריכוז לפני ש-EPANET מתייחס אליהן כאל אחת. ריק משתמש בברירת המחדל של EPANET עצמו, 0.01.';
$ec_lang['lpn_quality_diffusivity']='דיפוזיביות יחסית';
$ec_lang['lpn_quality_diffusivity_tip']='באיזו קלות החומר הכימי מתפשט במים, יחסית לכלור. ריק משתמש בברירת המחדל של EPANET עצמו, 1.0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='ריכוז {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='ריכוז {chemical} ממוצע';
$ec_lang['lpn_quality_initial']='איכות התחלתית';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='כמה מהחומר הכימי צומת זה מחזיק כשההרצה מתחילה. מאגר מחזיק את ערכו שלו לכל אורך ההרצה, וכך בדרך כלל נקבע השארית היוצאת ממתקן טיהור. השאירו ריק והצומת מתחיל ללא חומר כימי כלל.';
$ec_lang['lpn_result_concentration']='ריכוז';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='כמה מהחומר הכימי נותר בנקודה זו לאחר שנסע והגיב. היחידות הן אלה הרשומות לצד החומר הכימי תחת הגדרות, איכות מים.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='סוג מקור';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='איזה סוג מנה צומת זה מחיל על המים העוברים בו. ריכוז מתייחס למים הנכנסים לרשת כאן כמגיעים בערך איכות המקור. מנת מסה מוסיפה מסת חומר כימי בכל דקה, לא משנה מה הספיקה. מנת נקודת יעד מרימה את הריכוז היוצא מצומת זה לערך איכות המקור ולא מעבר לכך. מנת מפצה-ספיקה מוסיפה את ערך איכות המקור לכל מה שכבר נמצא במים.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='ללא';
$ec_lang['lpn_source_type_concen']='ריכוז';
$ec_lang['lpn_source_type_mass']='מנת מסה';
$ec_lang['lpn_source_type_setpoint']='מנת נקודת יעד';
$ec_lang['lpn_source_type_flowpaced']='מנת מפצה-ספיקה';
$ec_lang['lpn_source_quality']='איכות המקור';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='כמה חזקה המנה. עבור כל סוג פרט למנת המסה זהו ריכוז, ביחידות הרשומות לצד החומר הכימי תחת הגדרות, איכות מים; עבור מנת מסה זוהי מסת חומר כימי לדקה. השאירו ריק ושום דבר אינו נוסף כאן, וזה אינו כמו אפס: אפס הוא מנה הפועלת ואינה מוסיפה דבר.';
$ec_lang['lpn_source_pattern']='תבנית מקור';
$ec_lang['lpn_source_pattern_tip']='תבנית זמן המכפילה את המנה במהלך ההרצה, עבור מנה שאינה קבועה. ללא תבנית המנה זהה בכל צעד.';
$ec_lang['lpn_mixing_model']='מודל ערבוב';
$ec_lang['lpn_mixing_model_tip']='כיצד המים שכבר במכל זה מתערבבים עם המים הנכנסים. ערבוב מלא מערבל את כל המכל בבת אחת. ערבוב דו-תאי ממלא אזור כניסה תחילה ומעביר את השאר הלאה. FIFO plug flow מעביר את המים בסדר שבו הגיעו. LIFO plug flow ערום אותם, כך שהמים האחרונים שנכנסו הם המים הראשונים שיוצאים. הבחירה משנה את גיל המים ואת השארית, ואינה משנה שום לחץ או ספיקה.';
$ec_lang['lpn_mixing_mixed']='ערבוב מלא';
$ec_lang['lpn_mixing_2comp']='ערבוב דו-תאי';
$ec_lang['lpn_mixing_fifo']='זרימת פקק FIFO';
$ec_lang['lpn_mixing_lifo']='זרימת פקק LIFO';
$ec_lang['lpn_mixing_fraction']='שבר ערבוב';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='החלק מנפח המכל שאזור הכניסה תופס, בין 0 ל-1. רק ערבוב דו-תאי משתמש בו. השאירו ריק וכל המכל הוא אזור הכניסה, וזו ההנחה של EPANET.';
$ec_lang['lpn_reaction_bulk']='מקדם תגובת גוף';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='תגובה בגוף המים, המשמשת לכל צינור שאינו נושא מקדם משלו. מספר שלילי מפרק את החומר הכימי ומספר חיובי מגביר אותו. התגובה מסדר ראשון אלא אם קובץ EPANET שיובא קובע סדר אחר, כך שהמקדם הוא קצב ביחידות 1/יום. תיבה ריקה פירושה ללא תגובת גוף.';
$ec_lang['lpn_reaction_wall']='מקדם תגובת דופן';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='תגובה בדופן הצינור, המשמשת לכל צינור שאינו נושא מקדם משלו. מספר שלילי מפרק את החומר הכימי. התגובה מסדר ראשון אלא אם קובץ EPANET שיובא קובע סדר אחר, כך שהמקדם הוא אורך ליום, כתוב ביחידת האורך של הפרויקט. תיבה ריקה פירושה ללא תגובת דופן.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='צינור זה בפני עצמו. השאירו ריק והצינור משתמש במקדם שנקבע לכל הרשת תחת הגדרות, איכות מים.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='מקדם תגובה';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='תגובה במים המוחזקים במכל זה, כקצב ביחידות 1/יום. מספר שלילי מפרק את החומר הכימי ומספר חיובי מגדיל אותו. מים שוהים במכל זמן ארוך בהרבה מכפי ששוהים בכל צינור, כך שכאן לרוב מאבדים שארית. השאירו ריק והמכל משתמש במקדם תגובת הגוף שנקבע לכל הרשת תחת הגדרות, איכות מים.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='תגובת גוף';
$ec_lang['lpn_reaction_wall_short']='תגובת דופן';
$ec_lang['lpn_reaction_tank_short']='תגובה';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/יום';
$ec_lang['lpn_reaction_day']='יום';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='סדר תגובה בגוף המים';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='מעריך החזקה שאליו מועלה הריכוז עבור תגובה בגוף המים. כל מספר ממשי מותר. 1 הוא ערך ברירת המחדל, ומשמש ברוב מודלים לדעיכת כלור. 0 הופך את הקצב לבלתי תלוי בכמות הכימיקל הקיימת.';
$ec_lang['lpn_reaction_order_tank']='סדר תגובה במכל';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='מעריך החזקה שאליו מועלה הריכוז עבור תגובה במים המוחזקים במכל, בנפרד מסדר התגובה בגוף המים, כך שמכל יכול להגיב בסדר שונה מהצינורות. כל מספר ממשי מותר, ו-1 הוא ברירת המחדל. EPANET מציין זאת כ-ORDER TANK בקובץ, ואינו מציע לכך תיבה בממשק שלו.';
$ec_lang['lpn_reaction_order_wall']='סדר תגובת הדופן';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 פירושו שתגובת הדופן מתרחשת בהתאם למקדם(ים) שניתנו. 0 פירושו שהיא אינה מתרחשת. זהו מתג הפעלה וכיבוי. ערך ברירת המחדל הוא 1.';
$ec_lang['lpn_reaction_order_unstated']='לא צוין';
$ec_lang['lpn_reaction_order_zero']='0, סדר אפס';
$ec_lang['lpn_reaction_order_first']='1, סדר ראשון';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='פוטנציאל מגביל';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='ריכוז שהכימיקל נע לעברו במקום להתפורר לאפס או לגדול ללא סוף. התגובה מאטה ככל שהמים מתקרבים אליו, ונעצרת שם. השתמשו ביחידות עקביות. ללא הגבלה אם ריק.';
$ec_lang['lpn_reaction_rough_corr']='מתאם לחספוס';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='מתאם את תגובת הדופן לחספוס של כל צינור, כך שצינור מחוספס יותר מגיב מהר יותר. כאשר הוא מוגדר, מקדם דופן מחושב עבור כל צינור מתוך החספוס שלו, והמקדם היחיד שלמעלה אינו נמצא עוד בשימוש. אינו בשימוש אם ריק.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='עמוד זה אינו מציע מקדם תגובה משלו. אין בדיקה תקנית לכך, וערכי שדה מפורסמים עבור אותו סוג מים שונים פי עשרה, כך שמספר שיסופק כאן ייקרא כהמלצה. הזינו מספר שמדדתם או מספר שתוכלו לצטט, או השאירו את התיבות ריקות עבור חומר כימי שאינו מגיב.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='אנרגיה';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='דוחות';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_menu_tip']='התשובות המוגמרות שעמוד זה מפיק לאחר שרשת חושבה: מה עלו המשאבות, כיצד התרחישים משתווים, ומה פותר ה-EPANET עצמו הדפיס.';
$ec_lang['lpn_reports_epanet']='הרצת EPANET';
$ec_lang['lpn_energy_title']='דוח אנרגיית משאבות';
$ec_lang['lpn_energy_menu']='אנרגיית משאבות';
$ec_lang['lpn_energy_menu_tip']='איזה חלק מההרצה כל משאבה הייתה פועלת, איזה הספק היא שאבה, ומה זה עלה במהלך סימולציית תקופת הזמן האחרונה.';
$ec_lang['lpn_energy_efficiency']='יעילות משאבה (אחוזים)';
$ec_lang['lpn_energy_efficiency_tip']='היעילות מחוט-למים המשמשת לכל משאבה שאינה נושאת עקומת יעילות משלה. EPANET משתמש ב-75 אחוז כשלא נקבע דבר.';
$ec_lang['lpn_energy_price']='מחיר החשמל';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='כמה עולה קילוואט-שעה אחד. הוא חל על כל משאבה שאינה נושאת מחיר משלה. השאירו ריק וכל עלות בדוח היא אפס.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='כמה עולה קילוואט-שעה אחד במשאבה זו. השאירו ריק והמשאבה משתמשת במחיר שנקבע לכל הרשת תחת הגדרות, אנרגיה.';
$ec_lang['lpn_energy_price_pattern']='תבנית מחיר';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='תבנית המכפילה את המחיר בכל צעד תבנית, וכך נקבע תעריף מחוץ לשעות שיא. השאירו ריק למחיר אחיד לכל אורך ההרצה.';
$ec_lang['lpn_energy_demand_charge']='היטל שיא ביקוש';
$ec_lang['lpn_energy_demand_charge_tip']='מה שהתאגיד גובה עבור כל קילוואט של עומס השיא שהמשאבות דרשו במערכת.';
$ec_lang['lpn_energy_currency']='מטבע';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='כל מה שתכתבו כאן מודפס לצד כל מספר כספי. זו תווית. מחירים ועלויות אינם מומרים לעולם, כך שכתבו את המחירים במטבע שכתבתם כאן.';
$ec_lang['lpn_energy_kwh']='קוט״ש';
$ec_lang['lpn_energy_kw']='קוט״ט';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='עמוד זה אינו מציע מחיר משלו. מחיר החשמל תלוי בתאגיד, במדינה, בשעה ובשנה, כך שמספר שיסופק כאן ייקרא כהמלצה. הזינו את המחיר מהתעריף שלכם.';
$ec_lang['lpn_energy_needs_run']='אנרגיית משאבות היא הספק משוקלל לאורך ההרצה, ולכן היא דורשת סימולציה על פני תקופת זמן: מנוע EPANET וזמן ריצה כולל. הגדירו זמן ריצה כולל בהגדרות, חישוב, זמן, לחצו על כפתור חשב, ואז פתחו מים, דוחות, אנרגיית משאבות.';
$ec_lang['lpn_energy_no_pumps']='לרשת זו אין משאבות, כך שאין הספק הנשאב.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='השוואת תרחישים';
$ec_lang['lpn_scncmp_menu_tip']='פתרו כל תרחיש בפרויקט זה וקראו אותם זה לצד זה: הלחץ הנמוך ביותר והמהירות הגבוהה ביותר בכל אחד.';
$ec_lang['lpn_scncmp_running']='פותר כל תרחיש…';
$ec_lang['lpn_scncmp_empty']='עוד לא צויר דבר, כך שאין מה לפתור.';
$ec_lang['lpn_scncmp_col_maxvelocity']='מהירות מרבית';
$ec_lang['lpn_scncmp_at']='{value} ב-{id}';
$ec_lang['lpn_scncmp_current']='(פתוח כעת)';
$ec_lang['lpn_scncmp_note']='כל תרחיש נפתר מעותק של השרטוט. שום דבר כאן אינו משנה את הפרויקט, והתרחיש שאתם עובדים בו נשאר כפי שהיה.';
$ec_lang['lpn_energy_over']='לסימולציה על פני תקופת זמן של {time}';
$ec_lang['lpn_energy_col_pump']='משאבה';
$ec_lang['lpn_energy_col_running']='% מההרצה';
$ec_lang['lpn_energy_col_effic']='יעילות';
$ec_lang['lpn_energy_col_avg_kw']='קוט״ט ממ׳';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='ההספק הממוצע שנעשה בו שימוש כשמשאבה זו פעלה. הוא אינו ממוצע על פני תקופות חוסר פעילות, כך שמשאבה שהייתה כבויה לרוב סימולציית תקופת הזמן עדיין מדווחת על ההספק שהשתמשה בו בזמן שפעלה.';
$ec_lang['lpn_energy_col_peak_kw']='קוט״ט שיא';
$ec_lang['lpn_energy_col_kwh']='קוט״ש';
$ec_lang['lpn_energy_col_cost']='עלות';
$ec_lang['lpn_energy_total_kwh']='אנרגיה שנוצלה';
$ec_lang['lpn_energy_total_energy_cost']='עלות האנרגיה';
$ec_lang['lpn_energy_peak_kw']='שימוש בהספק שיא';
$ec_lang['lpn_energy_total_demand_charge']='עלות שיא הביקוש';
$ec_lang['lpn_energy_total_cost']='עלות כוללת';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='מצב';
$ec_lang['lpn_reports_status_tip']='מה השתנה במהלך סימולציית פני תקופת הזמן האחרונה, לפי סדר הזמן: משאבות ושסתומים נפתחים או נסגרים, מכלים מתמלאים, מתרוקנים, מתמלאים עד הסוף או מתייבשים, וצעדים שלא התכנסו במלואם.';
$ec_lang['lpn_status_title']='דוח מצב';
$ec_lang['lpn_status_needs_run']='דוח המצב מפרט מה השתנה במהלך סימולציה על פני תקופת זמן. קבעו משך ריצה כולל תחת הגדרות, חישוב, זמן, לחצו על חשב, ולאחר מכן פתחו את מים, דוחות, דוח מצב.';
$ec_lang['lpn_status_empty']='שום דבר לא שינה מצב במהלך הרצה זו.';
$ec_lang['lpn_status_col_event']='אירוע';
$ec_lang['lpn_status_opened']='{type} {id} נפתח';
$ec_lang['lpn_status_closed']='{type} {id} נסגר';
$ec_lang['lpn_status_filling']='{type} {id} מתמלא';
$ec_lang['lpn_status_emptying']='{type} {id} מתרוקן';
$ec_lang['lpn_status_full']='{type} {id} מלא';
$ec_lang['lpn_status_dry']='{type} {id} ריק';
$ec_lang['lpn_status_no_converge']='הפתרון ההידראולי בצעד זה לא התכנס במלואו; המספרים המוצגים הם האיטרציה האחרונה שלו.';
$ec_lang['lpn_status_note']='נקרא מאותה הרצת פני תקופת זמן כמו לוח הטבלאות והדוח המלא. רק שינוי מופיע ברשימה, לא כל צעד.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='מלא';
$ec_lang['lpn_reports_full_tip']='כל צומת וכל קישור בכל צעד זמן דיווח של ההרצה האחרונה, כטבלה אחת שניתן להוריד או להדפיס.';
$ec_lang['lpn_full_title']='דוח מלא';
$ec_lang['lpn_full_needs_run']='הדוח המלא מפרט כל צומת וכל קישור בכל צעד זמן דיווח. לחצו על חשב, ולאחר מכן פתחו את מים, דוחות, דוח מלא.';
$ec_lang['lpn_full_note']='שורה אחת לכל צומת או קישור בכל צעד זמן דיווח, ביחידות המוצגות בלוח הטבלאות. תא ריק הוא עמודה שלגודל זה אין. הורדה או הדפסה כוללת כל צעד זמן; הטבלה שלמטה מציגה אחד בכל פעם.';
$ec_lang['lpn_full_step_label']='צעד זמן';
$ec_lang['lpn_full_download_csv']='הורדת CSV';
$ec_lang['lpn_full_print']='הדפסת דוח';
$ec_lang['lpn_full_col_time']='זמן';
$ec_lang['lpn_full_col_type']='סוג';
$ec_lang['lpn_full_col_id']='מזהה';
$ec_lang['lpn_full_row_count']='{n} שורות.';
$ec_lang['lpn_energy_no_price']='לא צוין מחיר חשמל, כך שכל עלות כאן היא אפס. קבעו אחד תחת הגדרות, אנרגיה.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='רשת זו קובעת מחיר של אפס, כך שכל עלות כאן היא אפס. שנו אותו תחת הגדרות, אנרגיה.';
$ec_lang['lpn_energy_curve_note']='משאבות אלה מפנות לעקומת יעילות ללא נקודות: {ids}. הן פעלו ביעילות שנקבעה לכל הרשת.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0.000';
$ec_lang['lpn_labels_col_rank']='דירוג';
$ec_lang['lpn_labels_col_drop']='נשירה';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='צומת וקישור';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='מרווחים שווים';
$ec_lang['lpn_color_mode_quantile']='כמותונים (כמות שווה)';
$ec_lang['lpn_color_mode_jenks']='חלוקות טבעיות (Jenks)';
$ec_lang['lpn_color_mode_stddev']='סטיית תקן';
$ec_lang['lpn_color_mode_pretty']='מעוגל (Pretty)';
$ec_lang['lpn_color_mode_log']='לוגריתמי';
$ec_lang['lpn_color_mode_manual']='ידני';

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
$ec_lang['lpn_library_menu']='ספריות';
$ec_lang['lpn_library_menu_tip']='נהלו את תבניות הדרישה, עקומות המשאבה וכללי הבקרה של פרויקט זה.';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='תבניות';
$ec_lang['lpn_library_patterns_tip']='תבנית היא רשימת מכפילים החוזרת על עצמה. כל אחד חל על צעד זמן אחד של התבנית, כך ש-24 מספרים בצעד של שעה אחת יוצרים יום שחוזר על עצמו. דרישה של 10 עם מכפיל של 1.5 היא 15 באותו רגע.';
$ec_lang['lpn_library_curves']='עקומות';
$ec_lang['lpn_library_curves_tip']='עקומה היא רשימת נקודות המתארת כיצד משהו מתפקד: כמה גובה משאבה מוסיפה בכל ספיקה, מה היעילות שלה באותה ספיקה, או כמה גובה שסתום מאבד בכל ספיקה.';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='עקומות מצורפות למשאבות ולשסתומים. עבור עקומת עומד של משאבה ההרצה משתמשת בעקומה המותאמת דרך הנקודות כפי שמוצג; עבור כל סוג אחר היא מחברת את הנקודות בקווים ישרים כפי שמוצג.';
$ec_lang['lpn_library_curve_add']='הוסיפו עקומה';
$ec_lang['lpn_library_curve_type_tip']='מה עקומה זו מתארת';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='סוג עקומה';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='משוואה';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='העקומה המותאמת דרך הנקודות, והקו המצויר בגרף שלמטה. היא מחושבת מהנקודות בכל פעם שהיא מוצגת ואינה נשמרת לעולם, ומספריה הם ביחידות שהטבלה שלמעלה מציגה. הפותר המובנה פועל לפי משוואה זו; מנוע EPANET קורא את הנקודות עצמן.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='בחרו עמודה אחת או שתיים בגיליון אלקטרוני, העתיקו אותן, והדביקו בתא הראשון שבו תרצו שיונחו. השורות מתווספות לפי הצורך. תוכלו גם להדביק שורות שהועתקו ישירות מקובץ EPANET, כולל שם העקומה.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='תיאור';
$ec_lang['lpn_library_curve_note_tip']='מה עקומה זו, במילים שלכם. היא נכתבת מעל העקומה בקובץ EPANET ונקראת חזרה משם.';
$ec_lang['lpn_library_curve_remove_point']='הסירו נקודה זו';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='העתיקו נקודות';
$ec_lang['lpn_library_curve_copy_tip']='מעתיק כל נקודה כשתי עמודות, מוכן להדבקה בגיליון אלקטרוני.';
$ec_lang['lpn_library_curve_copy_manual']='העתיקו נקודות אלה';
$ec_lang['lpn_library_curve_used_by']='אלמנטים המשתמשים בעקומה זו';
$ec_lang['lpn_library_curve_unused']='שום דבר אינו משתמש בעקומה זו.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='עקומה זו נמצאת בשימוש {count} אלמנטים: {ids}. הפנו אותם לעקומה אחרת קודם, ואז מחקו את זו.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='סוגי צינורות';
$ec_lang['lpn_library_pipetypes_tip']='סוג צינור הוא הגדרה שכמה צינורות יכולים להפנות אליה עבור הקוטר, החספוס ומקדמי התגובה שלהם. עריכת ההגדרה עורכת כל צינור המשתמש בה.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='לכל פרויקט יש ספריית סוגי צינורות משלו. ניתן להשאיר מאפיינים ריקים בהגדרת סוג צינור. לדוגמה, סוג צינור שמציין חספוס וללא קוטר הוא תקין. אתם מצרפים סוגי צינורות לצינורות בעורך המאפיינים שלהם. עריכת הגדרה כאן משנה כל צינור המפנה אליה.';
$ec_lang['lpn_library_pipetype_add']='הוספת סוג צינור';
$ec_lang['lpn_library_pipetype_blank_tip']='מאפיינים ריקים בהגדרת סוג צינור נותרים להזנה בנפרד עבור כל צינור.';
$ec_lang['lpn_library_pipetype_used_by']='צינורות המשתמשים בסוג זה';
$ec_lang['lpn_library_pipetype_unused']='שום דבר אינו משתמש בסוג צינור זה.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='סוג צינור זה נמצא בשימוש {count} צינורות: {ids}. נתקו אותו מהם לפני מחיקתו.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='סוג צינור';
$ec_lang['lpn_field_pipetype_tip']='סוג הצינור בספריית הפרויקט שצינור זה משתמש בו. מאפיינים הכלולים בסוג הצינור מושבתים לעריכה כאן. נתקו את סוג הצינור כדי לאפשר עריכה כאן.';
$ec_lang['lpn_pipetype_none']='לא נבחר סוג צינור';
$ec_lang['lpn_pipetype_detach']='ניתוק מסוג הצינור';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='מעתיק את הערכים שצינור זה קורא מהסוג שלו לתוך הצינור עצמו, ומפסיק להשתמש בסוג. ערכי הצינור אינם משתנים כעת, ומעתה תוכלו לערוך את הערכים הללו כאן.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='אביזרים';
$ec_lang['lpn_library_fittings_tip']='רשימת אביזרים היא קבוצה של אביזרים והכמויות שלהם שכמה צינורות יכולים להפנות אליה. היא מסתכמת במקדם הפסד מקומי אחד.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='לכל פרויקט יש ספריית אביזרים משלו. רשימת אביזרים מכילה אביזרים עם כמות לכל אחד, והיא מסתכמת במקדם הפסד מקומי יחיד. גם צינורות וגם סוגי צינורות יכולים להפנות לרשימה.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='האביזרים המוצעים כאן הם שלושה עשר האביזרים מטבלה 3.3 במדריך למשתמש של EPANET 2.2. בחירה באחד מהם מעתיקה את המקדם שלו לשורה, שם ניתן לשנות אותו. מקדם תלוי בגודל וביצרן של האביזר, כך שיש להתייחס לטבלה כאל נקודת התחלה ולא כאל תשובה סופית.';
$ec_lang['lpn_library_fittings_add']='הוספת רשימת אביזרים';
$ec_lang['lpn_library_fittings_used_by']='צינורות המשתמשים ברשימת אביזרים זו';
$ec_lang['lpn_library_fittings_unused']='שום דבר אינו משתמש ברשימת אביזרים זו.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='רשימת אביזרים זו נמצאת בשימוש {count} צינורות: {ids}. נתקו אותה מהם לפני מחיקתה.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='ייבוא ספריות…';
$ec_lang['lpn_library_import_tip']='בחרו קובץ פרויקט אחר והעתיקו ממנו ספריות שלמות לפרויקט זה. כל דבר ששמו כבר תפוס כאן מדולג ומופיע ברשימה, כך ששום דבר שכבר יש לכם לא משתנה.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='בחרו מה להעתיק מ-{file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='כל ספרייה שתסמנו מועתקת בשלמותה. מחקו לאחר מכן את מה שאינכם רוצים, באותה דרך שבה אתם מוחקים כל רשומה אחרת.';
$ec_lang['lpn_library_import_go']='ייבוא';
$ec_lang['lpn_library_import_no_libraries']='לקובץ הפרויקט הזה אין ספריות להעתקה.';
$ec_lang['lpn_library_import_heading']='יובא מ-{file}';
$ec_lang['lpn_library_import_added']='הועתקו: {names}';
$ec_lang['lpn_library_import_conflict']='דולג, משום שלפרויקט זה כבר יש אחד באותו שם: {names}. שום דבר כאן לא השתנה. שנו שם לאחד מהם וייבאו שוב אם אתם רוצים את שניהם.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='לקובץ הפרויקט הזה אין אף אחד מאלה להעתקה.';
$ec_lang['lpn_library_import_curve_shape']='עקומות אלה הועברו בדיוק כפי שהקובץ כתב אותן, והרצה לא יכולה להשתמש באחת מהן עד שהעמודה הראשונה שלה עולה מכל נקודה לנקודה הבאה: {names}';
$ec_lang['lpn_library_import_needs_fittings']='סוגי צינורות אלה מפנים לרשימת אביזרים שאין לפרויקט זה: {names}. ייבאו את ספריית האביזרים מאותו קובץ והם ימצאו אותה.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='אזהרה: אי-התאמת יחידות. יובא כפי שהוא. לא מומלץ.';
$ec_lang['lpn_library_import_units_line']='{name}: פרויקט זה מציג {mine}, הקובץ מציג {theirs}.';
$ec_lang['lpn_fitting_qty']='כמות';
$ec_lang['lpn_fitting_name']='אביזר';
$ec_lang['lpn_fitting_k']='מקדם';
$ec_lang['lpn_fitting_add']='הוספת אביזר';
$ec_lang['lpn_fitting_remove']='הסרה';
$ec_lang['lpn_fitting_total']='מקדם הפסד מקומי כולל, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='רשימת אביזרים';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='רשימת אביזרים מספריית הפרויקט. הכמויות והמקדמים שלה מסתכמים למקדם ההפסד המקומי של צינור זה, ותיבת המקדם הופכת אז לקריאה בלבד. השאירו זאת לא נבחר כדי להקליד את המקדם בעצמכם.';
$ec_lang['lpn_fittings_none']='לא נבחרה רשימת אביזרים';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='שסתום גלוב, פתוח לגמרי';
$ec_lang['lpn_fitting_angle']='שסתום זווית, פתוח לגמרי';
$ec_lang['lpn_fitting_swingcheck']='שסתום אל-חוזר מטוטלת, פתוח לגמרי';
$ec_lang['lpn_fitting_gate']='שסתום שער, פתוח לגמרי';
$ec_lang['lpn_fitting_elbow_short']='עיקול בעל רדיוס קצר';
$ec_lang['lpn_fitting_elbow_medium']='עיקול בעל רדיוס בינוני';
$ec_lang['lpn_fitting_elbow_long']='עיקול בעל רדיוס ארוך';
$ec_lang['lpn_fitting_elbow_45']='עיקול בזווית 45 מעלות';
$ec_lang['lpn_fitting_return_bend']='עיקול חזרה סגור';
$ec_lang['lpn_fitting_tee_run']='מצמד T סטנדרטי, זרימה דרך הקו הראשי';
$ec_lang['lpn_fitting_tee_branch']='מצמד T סטנדרטי, זרימה דרך הענף';
$ec_lang['lpn_fitting_entrance']='כניסה מרובעת';
$ec_lang['lpn_fitting_exit']='יציאה';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='אביזר אחר';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='נשמר {file}';
$ec_lang['lpn_inp_export_flat_lead']='קובץ EPANET שיוצא הוא שווה-ערך מספרית לפרויקט זה. אך אין בו מקום לדברים הבאים:';
$ec_lang['lpn_inp_export_flat_types']='{n} צינורות כאן מפנים אל {t} סוגי צינורות. בקובץ, כל אחד מהצינורות הללו נושא עותק משלו של המספרים, כך שהתוצאות זהות. מה שהקובץ אינו יכול להכיל הוא סוג הצינור עצמו, כך שעריכת הגדרה אחת וגרימה לכל הצינורות לעקוב אחריה היא דבר שרק קובץ הפרויקט שלכם רושם.';
$ec_lang['lpn_inp_export_flat_coords']='לקובץ EPANET יש מיקום אחד לכל צומת. תרחיש זה ממקם {n} מהם במקום אחר, ואלה הם המיקומים בקובץ. כל תרחיש אחר שומר את המיקומים שלו רק בקובץ הפרויקט שלכם.';
$ec_lang['lpn_inp_export_flat_fittings']='קובץ EPANET אינו יכול להכיל את רשימת העיקולים, השסתומים ומצמדי ה-T שבקובץ הפרויקט שלכם. מקדם ההפסד המקומי של {n} צינורות כאן מסוכם מתוך רשימת אביזרים. הסכום נכנס לקובץ בדיוק כפי שהוא, כך שדבר אינו משתנה בתוצאות.';
$ec_lang['lpn_library_controls']='בקרות';
$ec_lang['lpn_library_controls_tip']='בקרה היא משפט אחד הפותח או סוגר קישור, או נותן לו הגדרה, כאשר מפלס מים, לחץ או זמן קובעים זאת.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='הוספת תבנית';
$ec_lang['lpn_library_pattern_values']='מכפילים';
$ec_lang['lpn_library_pattern_values_tip']='המכפילים, מופרדים ברווחים או בפסיקים. הדביקו עמודה מגיליון אלקטרוני אם יש לכם אחד. הרשימה חוזרת על עצמה לאורך כל משך ההרצה, כך שאינה חייבת לכסות את ההרצה כולה.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} מכפילים, במרווח {step}, מכסים {span}';
$ec_lang['lpn_library_pattern_none']='אין תבנית';
$ec_lang['lpn_settings_default_pattern']='תבנית דרישה ברירת מחדל';
$ec_lang['lpn_settings_default_pattern_tip']='כל צומת ללא תבנית משתמש בזו.';
$ec_lang['lpn_library_control_add']='הוספת בקרה';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='חוק בן שורה אחת בתחביר EPANET. השתמשו ביחידות הפרויקט באופן עקבי. מילות המפתח חייבות להיות באנגלית. דוגמאות: LINK 12 CLOSED IF NODE 23 ABOVE 20 (הקו 12 ייסגר כאשר המפלס במכל 23 יעלה על 20 רגל); LINK 12 OPEN IF NODE 130 BELOW 30 (הקו 12 ייפתח אם הלחץ בצומת 130 יירד מתחת ל-30 psi); LINK PUMP02 1.5 AT TIME 16 (מהירותה היחסית של המשאבה PUMP02 נקבעת ל-1.5 בשעה 16 מתחילת הריצה); LINK 12 CLOSED AT CLOCKTIME 10 AM LINK 12 OPEN AT CLOCKTIME 8 PM (שני חוקים: הקו 12 נסגר שוב ושוב בשעה 10 בבוקר ונפתח בשעה 8 בערב לאורך כל הריצה)';
$ec_lang['lpn_library_control_ok']='✓ מובן';
$ec_lang['lpn_library_control_bad']='⚠ לא מובן';
$ec_lang['lpn_library_control_missing']='⚠ ברשת זו אין דבר בשם {id}';
$ec_lang['lpn_library_rules']='כללים';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='כלל הוא פסקה קצרה הפותחת או סוגרת קישור, או נותנת לו הגדרה, כאשר מפלס מים, לחץ, ספיקה או זמן מגיעים לערך שקבעתם. כללים יכולים לבדוק יותר מדבר אחד בבת אחת, והם יכולים לומר מה לעשות כשהבדיקה נכשלת.';
$ec_lang['lpn_library_rule_add']='הוסיפו כלל';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='כלל אחד, במילים שבהן EPANET משתמש, סעיף אחד בכל שורה. שורה ראשונה נותנת לו שם: RULE 1. אחר כך תנאי: IF TANK 2 LEVEL BELOW 17.1. אחר כך מה לעשות בנידון: THEN PUMP 9 STATUS IS OPEN. שורה אחרונה יכולה לדרג אותו: PRIORITY 1. הוסיפו שורות AND או OR כדי לבדוק יותר מדבר אחד, ושורות ELSE כדי לומר מה לעשות כשהבדיקה נכשלת. תנאי יכול לקרוא LEVEL, HEAD, GRADE, PRESSURE או DEMAND בצומת, FLOW, STATUS או SETTING בקישור, או TIME ו-CLOCKTIME ב-SYSTEM. כתבו את המספרים ביחידות שהפרויקט הזה מציג; הם מומרים עבורכם. השאירו את מילות המפתח באנגלית; אלה מה שהעמוד ו-EPANET קוראים.';
$ec_lang['lpn_library_rule_ok']='✓ כלל זה נקרא';
$ec_lang['lpn_library_rule_bad']='⚠ לא ניתן היה לקרוא כלל זה';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='דרישת בסיס';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='הספיקה שצומת זה שואב בצעד הזמן המוצג: כל דרישת בסיס מוכפלת בתבנית שלה, מחוברות יחד. היא מחושבת, לא מוקלדת, כך שהיא משתנה עם השעון ולא ניתן לערוך אותה.';
$ec_lang['lpn_field_demand_pattern']='תבנית דרישה';
$ec_lang['lpn_field_demand_pattern_tip']='כיצד הדרישה של צומת זה עולה ויורדת במהלך ההרצה. השאירו על אין תבנית והצומת יעקוב אחר תבנית דרישה ברירת מחדל של הפרויקט במקום.';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='תיאור';
$ec_lang['lpn_field_demand_category_tip']='שם או תיאור של קטגוריית דרישה זו.';
$ec_lang['lpn_demand_add']='הוספת קטגוריית דרישה';
$ec_lang['lpn_demand_add_tip']='הוסיפו קטגוריית דרישה נוספת בצומת זה, עם דרישת בסיס, תבנית ותיאור משלה. הקטגוריות מצטרפות זו לזו.';
$ec_lang['lpn_demand_remove']='הסרת דרישה זו';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='תבנית גובה';
$ec_lang['lpn_field_head_pattern_tip']='כיצד מפלס המים של מאגר זה עולה ויורד במהלך ההרצה. הגובה שלמעלה מוכפל בתבנית.';
$ec_lang['lpn_field_pump_speed']='מהירות יחסית';
$ec_lang['lpn_field_pump_speed_tip']='1 הוא כאשר משאבה זו סובבת במהירות שבה נמדדה עקומתה. 0.9 היא אותה משאבה סובבת לאט יותר, מה שמוריד את הגובה שהיא מוסיפה ואת הספיקה שהיא מעבירה. תבנית מהירות תופסת את מקום המספר הזה בזמן שההרצה מתנהלת.';
$ec_lang['lpn_field_speed_pattern']='תבנית מהירות';
$ec_lang['lpn_field_speed_pattern_tip']='כיצד מהירות משאבה זו עולה ויורדת במהלך ההרצה. כל מכפיל הוא המהירות היחסית לאותו חלק של ההרצה, והוא מחליף את הגדרת המהירות במקום להכפיל אותה, כך שמכפיל של 0 עוצר את המשאבה.';

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
$ec_lang['lpn_search_menu']='חיפוש מקום לפי שם…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='מצאו עיר, כתובת או ציון דרך לפי שם, והזיזו את המפה אליו. השימוש הראשון מבקש את רשותכם, כי המילים שאתם מקלידים נשלחות לשירות שמות המקומות של OpenStreetMap.';
$ec_lang['lpn_search_bar']='חיפוש לפי שם…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='חיפוש לפי שם מקום שולח את המילים שהקלדתם אל nominatim.openstreetmap.org, שירות שמות המקומות החינמי של קרן OpenStreetMap.';
$ec_lang['lpn_search_consent_2']='זהו שירות שונה מתצלומי מפת הרחובות שברקע הפרויקט שלכם. התצלומים אומרים רק היכן אתם מסתכלים. חיפוש אומר מה הקלדתם. שירות שמות המקומות יקבל את מילות החיפוש שלכם ואת כתובת ה-IP שלכם. איננו שולחים דבר נוסף, ואיננו שומרים שום רישום של החיפושים שלכם.';
$ec_lang['lpn_search_consent_3']='האם נוכל לשלוח את החיפושים שלכם לשירות שמות המקומות?';
$ec_lang['lpn_search_consent_4']='אם תגידו לא, כל השאר בעמוד זה ימשיך לפעול בדיוק כפי שהוא פועל כעת, כולל עבור אל קו רוחב וקו אורך. אנו זוכרים תשובת כן כדי שלא נצטרך לשאול שוב. תשובת לא אינה נשמרת כלל.';
$ec_lang['lpn_search_refused']='חיפוש שמות מקומות כבוי, ושום דבר לא נשלח. עדיין ניתן להשתמש בעבור אל קו רוחב וקו אורך.';
$ec_lang['lpn_search_prompt']='חיפוש מקום לפי שם. עיר, רחוב, ציון דרך — לדוגמה: Petaluma, California';
$ec_lang['lpn_search_empty']='הקלידו שם מקום לחיפוש.';
$ec_lang['lpn_search_working']='מחפש…';
$ec_lang['lpn_search_busy']='חיפוש כבר פועל. המתינו לתשובתו.';
$ec_lang['lpn_search_choose']='יותר ממקום אחד תואם. איזה מהם?';
$ec_lang['lpn_search_nochoice']='שום דבר לא נבחר, כך שהמפה לא זזה.';
$ec_lang['lpn_search_badchoice']='זה אינו אחד המספרים ברשימה.';
$ec_lang['lpn_search_none']='לא נמצא דבר עבור שם זה.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='שירות שמות המקומות מבקש מאיתנו להאט. המתינו דקה ונסו שוב.';
$ec_lang['lpn_search_http']='שירות שמות המקומות השיב בשגיאה.';
$ec_lang['lpn_search_timeout']='שירות שמות המקומות לא השיב בזמן. כל השאר בעמוד זה פועל בלעדיו.';
$ec_lang['lpn_search_unreadable']='שירות שמות המקומות השיב במשהו שעמוד זה לא הצליח לקרוא.';
$ec_lang['lpn_search_offline']='לא הצלחנו להגיע לשירות שמות המקומות. ייתכן שאתם לא מחוברים לאינטרנט. כל השאר בעמוד זה פועל בלעדיו, כולל עבור אל קו רוחב וקו אורך.';
$ec_lang['lpn_search_toofast']='חיפוש אחד בשנייה — זה מה ששירות שמות המקומות מאפשר. נסו שוב בעוד רגע.';
$ec_lang['lpn_search_nofetch']='דפדפן זה אינו יכול להגיע לשירות שמות המקומות.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox מרכיב זאת ממספר רב של מאגרי נתוני רום ציבוריים, כך שאיכות הנתונים תלויה לגמרי במיקום שלכם. במקום שקיים בו סקר לידאר לאומי, כגון USGS 3DEP ברוב ארצות הברית והמקבילות לו במקומות אחרים, הדיוק יכול להיות טוב יותר ממטר אחד אופקית וכמה עשיריות המטר אנכית. במקום שקיימים בו רק נתונים גלובליים, הדיוק הוא כ-30 מ׳ אופקית וכמה מטרים אנכית. Mapbox אינו אומר לנו איזה מהם קיבלתם. התייחסו אליו כמפת קווי גובה, לא כמדידה: בדקו כל דבר שאתם נסמכים עליו.';
$ec_lang['lpn_terrain_consent_1']='מילוי רומים שולח את מיקום כל צומת שזקוק לרום — קו הרוחב וקו האורך שלו — אל api.mapbox.com, כדי לבדוק שם את גובה הקרקע.';
$ec_lang['lpn_terrain_consent_2']='זו שאלה שונה מתצלומי המפה שברקע הפרויקט שלכם. התצלומים אומרים רק היכן אתם מסתכלים. המיקומים האלה הם הרשת שלכם עצמה. Mapbox יקבל את הקואורדינטות האלה ואת כתובת ה-IP שלכם. איננו שולחים דבר נוסף: לא שם, לא צינורות, לא פרויקט. איננו שומרים שום רישום של כך, ושום דבר אינו נשמר במכשיר זה מלבד תשובתכם לשאלה זו.';
$ec_lang['lpn_terrain_consent_3']='האם נוכל לשלוח את מיקומי הצמתים שלכם ל-Mapbox?';
$ec_lang['lpn_terrain_consent_4']='אם תגידו לא, כל השאר בעמוד זה ימשיך לפעול בדיוק כפי שהוא פועל כעת, ותוכלו להקליד רומים בעצמכם כמו קודם. אנו זוכרים תשובת כן כדי שלא נצטרך לשאול שוב. תשובת לא אינה נשמרת כלל.';
$ec_lang['lpn_terrain_refused']='הרומים לא מולאו, ושום דבר לא נשלח. תוכלו להקליד אותם כמו קודם.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='למלא את הרום של {n} צמתים מ-Mapbox DEM?';
$ec_lang['lpn_terrain_confirm_default_1']='לכל צומת כבר יש רום, ו-{n} מהם עדיין ב-{v}, שהוא הרום שצומת חדש מתחיל בו במקום כזה שהקלדתם.';
$ec_lang['lpn_terrain_confirm_default_2']='להחליף את הרום של אותם {n} צמתים בערכים מ-Mapbox DEM?';
$ec_lang['lpn_terrain_keep']='ל-{k} צמתים כבר יש רום ולא ייגעו בהם.';
$ec_lang['lpn_terrain_undo']='ביטול אחד (Ctrl-Z) מחזיר את כולם בחזרה.';
$ec_lang['lpn_terrain_requests']='{n} בקשה/ות אל api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='רומים כבר בתהליך מילוי. המתינו להם.';
$ec_lang['lpn_terrain_offmap']='מיקומי צמתים אלה אינם על מפת התוואי, כך ששום דבר לא נשלח.';
$ec_lang['lpn_terrain_too_wide']='צמתים אלה פזורים על שטח גדול מדי של כדור הארץ לקריאה בבת אחת ({n} בקשות אריחים). שום דבר לא נשלח.';
$ec_lang['lpn_terrain_cancelled']='שום דבר לא השתנה ושום דבר לא נשלח.';
$ec_lang['lpn_terrain_nofetch']='דפדפן זה אינו יכול להגיע אל שירות התוואי.';
$ec_lang['lpn_terrain_working']='קורא את פני הקרקע…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='שירות פני השטח דחה את הבקשה ({status}), ולכן שום רום לא שונה. ייתכן שאסימון Mapbox שבו אתר זה משתמש אינו מאפשר את כתובת האינטרנט שבה אתם נמצאים.';
$ec_lang['lpn_terrain_failed']='לא הצלחנו להגיע לשירות התוואי, כך ששום רום לא השתנה. ייתכן שאתם לא מחוברים לאינטרנט. כל השאר בעמוד זה פועל בלעדיו.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='שירות התוואי מבקש מאיתנו להאט (429), כך ששום רום לא שונה. נסו שוב בעוד דקה.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='שירות התוואי השיב בשגיאה ({status}), כך ששום רום לא שונה. שום דבר אינו פגום ברשת שלכם.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='לאף אחד מהצמתים האלה אין מיקום על כדור הארץ, כך ששום דבר לא נשלח ושום רום לא שונה. קריאת פני הקרקע דורשת פרויקט בקו רוחב וקו אורך, או כזה בהטלה שעמוד זה יכול למקם.';
$ec_lang['lpn_terrain_done']='{n} רומים מולאו.';
$ec_lang['lpn_terrain_missed']='{m} לא היה ניתן לקרוא, והם עדיין ריקים.';
$ec_lang['lpn_terrain_partial']='{f} אריחי תוואי לא השיבו.';
$ec_lang['lpn_terrain_will_ids']='הצמתים האלה יקבלו רום: {ids}';
$ec_lang['lpn_terrain_keep_ids']='אותם צמתים הם: {ids}';
$ec_lang['lpn_terrain_filled_ids']='הצמתים האלה קיבלו רום: {ids}';
$ec_lang['lpn_terrain_blank_ids']='לצמתים האלה עדיין אין רום: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}, ועוד {n}';

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
$ec_lang['lpn_ff_menu']='ניתוח ספיקת כיבוי אש…';
$ec_lang['lpn_ff_menu_tip']='בדקו צמתים אחד בכל פעם: כמה כל אחד יכול לספק בעוד הוא מחזיק בלחץ השארי שקבעתם, והאם שאיבת הספיקה הנדרשת שם דוחפת משהו אחר מחוץ למגבלות?';
$ec_lang['lpn_ff_title']='ניתוח ספיקת כיבוי אש';
$ec_lang['lpn_ff_intro']='מכל צומת בתורו מתבקש לשאוב ספיקת כיבוי אש בנוסף לדרישה שכבר יש לו. שום דבר בפרויקט שלכם אינו משתנה; כל ההרצה נעשית על עותק.';
$ec_lang['lpn_ff_scope']='צמתים לבדיקה';
$ec_lang['lpn_ff_scope_tip']='בחרו את הקבוצה לפני ההרצה. בדיקת כל צומת במערכת גדולה יכולה לקחת דקות.';
$ec_lang['lpn_ff_all']='כולם';
$ec_lang['lpn_ff_selected']='הנבחרים';
$ec_lang['lpn_ff_no_junctions']='לפרויקט זה אין עדיין צמתים, כך שאין מה לבדוק.';
$ec_lang['lpn_ff_no_selection']='אין צמתים נבחרים. בחרו צמתים או בחרו באפשרות כולם.';
$ec_lang['lpn_ff_skipped']='{n} האלמנטים הנבחרים אינם צמתים, כך שהם לא נבדקו.';
$ec_lang['lpn_ff_required']='ספיקת כיבוי אש נדרשת';
$ec_lang['lpn_ff_required_tip']='הספיקה שתקן הכיבוי או רשות הכיבוי שלכם דורשים בברז שריפה. כל צומת נבדק כנגד מספר זה, אלא אם יש לו ספיקת כיבוי אש נדרשת משלו.';
$ec_lang['lpn_ff_required_own']='צמתים המחזיקים ספיקת כיבוי אש נדרשת משלהם נבדקים כנגד זו במקום. מספרם: {n}.';
$ec_lang['lpn_ff_required_node_tip']='ספיקת כיבוי האש הנדרשת בצומת מסוים זה עבור השימוש בקרקע שהוא משרת, מתקן הכיבוי או מרשות הכיבוי שלכם. השאירו ריק והצומת ייבדק כנגד המספר בתיבת ניתוח ספיקת כיבוי אש.';
$ec_lang['lpn_ff_residual']='לחץ שארי לשמירה';
$ec_lang['lpn_ff_residual_tip']='הלחץ שהצומת חייב עדיין להחזיק בעוד הוא מספק את ספיקת כיבוי האש. AWWA M31 ו-NFPA 291 משתמשים ב-20 psi (140 kPa).';
$ec_lang['lpn_ff_design']='בדיקת תכן (השפעה על המערכת)';
$ec_lang['lpn_ff_design_tip']='שאלה נפרדת מהאם הצומת יכול לספק את הספיקה: עם ספיקה זו נשאבת שם, האם משהו אחר יורד מתחת ללחץ המזערי שלו או חורג ממגבלת המהירות שלו? בחירה לבדוק זאת אינה עולה חישוב נוסף.';
$ec_lang['lpn_ff_design_no_selection']='בדיקת התכן מוגדרת לנבחרים, אך לא נבחרו אלמנטים. בחרו אלמנטים או בחרו באפשרות כולם.';
$ec_lang['lpn_ff_minpressure']='הלחץ הנמוך ביותר המותר במקום אחר';
$ec_lang['lpn_ff_minpressure_tip']='צומת שיורד מתחת לזה בעוד צומת אחר שואב את ספיקת כיבוי האש שלו מדווח כבעיית תכן.';
$ec_lang['lpn_ff_maxvelocity']='המהירות הגבוהה ביותר המותרת';
$ec_lang['lpn_ff_maxvelocity_tip']='צינור הפועל מעל זה בעוד ספיקת כיבוי אש נשאבת מדווח כבעיית תכן.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='ספיקת כיבוי האש נשאבת בצומת עצמו. זו השיטה המשמשת כאן, וזו הנפוצה. ברז השריפה, צינור ההסתעפות שלו והזרבובית שלו אינם ממודלים, כך שברז שריפה אמיתי מספק פחות מהספיקה המוצגת כאן.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='נעשה שימוש בפותר המובנה.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='נעשה שימוש במנוע EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='ספיקת כיבוי אש זמינה היא חיפוש, כך שכל הרשת נפתרת כשש עשרה פעמים עבור כל צומת נבדק. מערכת גדולה לוקחת דקות. ניתן לעצור אותה בכל עת ולשמור את מה שכבר בוצע.';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='רק צעד הזמן המוצג כרגע נבדק. ספיקת כיבוי אש נבדקת בדרך כלל בנוסף לדרישת יום מרבי, כך שקבעו את הרשת למצב זה לפני ההרצה.';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='הרצת ספיקת כיבוי אש';
$ec_lang['lpn_ff_calculate']='הרצה';
$ec_lang['lpn_ff_stop']='עצירה';
$ec_lang['lpn_ff_working']='עובד: {done} מתוך {total} צמתים.';
$ec_lang['lpn_ff_stopped']='נעצר לאחר {done} מתוך {total} צמתים. התוצאות למטה הן אלה שכבר הסתיימו.';
$ec_lang['lpn_ff_cost']='הרצה זו פתרה את כל הרשת {solves} פעמים.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='השרטוט השתנה, כך שתוצאות ספיקת כיבוי האש נמחקו. הריצו שוב.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='ניקוי טבעות';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} צמתים לא היה בהם דבר שגוי. {fire} צמתים נכשלו בספיקת כיבוי האש. {design} צמתים השפיעו על שאר המערכת.';
$ec_lang['lpn_ff_summary_error']='לא ניתן היה לענות עבור {n} צמתים.';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='כל צומת נבדק';
$ec_lang['lpn_ff_col_junction']='צומת';
$ec_lang['lpn_ff_col_static']='לחץ סטטי';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='הלחץ בצומת זה לפני שנשאבה ספיקת כיבוי אש כלשהי, כשדרישות המערכת הרגילות עדיין פועלות. שום דבר אינו נסגר כדי למדוד אותו, כך שזה אינו לחץ בספיקת אפס עבור המערכת; זה אותו לחץ שהמפה מציגה בצומת זה. גם AWWA M31 וגם NFPA 291 קוראים לקריאה זו הלחץ הסטטי, וזו נקודת ההתחלה של בדיקת ספיקת כיבוי אש.';
$ec_lang['lpn_ff_col_available']='ספיקה זמינה';
$ec_lang['lpn_ff_col_required']='ספיקה נדרשת';
$ec_lang['lpn_ff_col_residual']='שארי מוחזק';
$ec_lang['lpn_ff_col_atrequired']='לחץ בספיקה הנדרשת';
$ec_lang['lpn_ff_col_affected']='ההשפעה הגרועה ביותר';
$ec_lang['lpn_ff_col_limit']='מגבלת תכן';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='לא נבדק';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='לחץ סטטי נכשל, ולכן לא נבדק';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='אופני כשל';
$ec_lang['lpn_ff_mode_fire']='אש';
$ec_lang['lpn_ff_mode_design']='תכן';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='ללא';
$ec_lang['lpn_ff_col_solves']='הרצות';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='לחץ ומהירות';
$ec_lang['lpn_ff_atleast']='יותר מ-{flow}';
$ec_lang['lpn_ff_affect_node']='{id} יורד ל-{pressure}';
$ec_lang['lpn_ff_affect_link']='{id} מגיע ל-{velocity}';
$ec_lang['lpn_ff_more']='ועוד {n} מושפעים';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='עוד {n} צמתים אינם מוצגים.';
$ec_lang['lpn_ff_design_none']='שום דבר בקבוצה הנבחרת לא חרג מהמגבלות שלו בעוד צומת כלשהו שאב את ספיקת כיבוי האש שלו.';
$ec_lang['lpn_ff_design_off_note']='ההשפעה על שאר המערכת לא נבדקה בהרצה זו.';
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
$ec_lang['lpn_ff_iso']='ה-Insurance Services Office (ISO) מזכה ברז שריפה בודד לכל היותר ב-{flow}. מגבלת זיכוי זו לא הוחלה כאן משום שאיננו יודעים כמה ברזי שריפה צומת עשוי לייצג.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='כבר מתחת ללחץ השארי לפני שנשאבה ספיקת כיבוי אש כלשהי';
$ec_lang['lpn_ff_err_converge']='הרשת לא התכנסה.';
$ec_lang['lpn_ff_err_solve']='הפותר דיווח על שגיאה ולא נתן תשובה.';
$ec_lang['lpn_ff_err_not_junction']='לא צומת';
$ec_lang['lpn_ff_err_unknown']='אין תשובה. הקוד שדווח היה {code}.';

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
$ec_lang['lpn_file_import_survey']='ייבוא נקודות סקר…';
$ec_lang['lpn_file_import_survey_tip']='קורא רשימת נקודות סקר מקובץ טקסט ויוצר צומת אחד בכל נקודה, תוך שימוש בהגדרות ברירת המחדל לאלמנטים חדשים עבור כל מה שהקובץ אינו קובע. אין צינורות מצוירים, ואף שורה לעולם אינה מושמטת בלי שתיקרא בשמה. הוא קורא את מערכת הקואורדינטות שהפרויקט הזה כבר משתמש בה, בין אם יש לה ייחוס גיאוגרפי ובין אם לא.';
$ec_lang['lpn_survey_read_error']='לא ניתן היה לקרוא קובץ זה מהדיסק שלכם.';
$ec_lang['lpn_survey_cancelled']='שום דבר לא נוצר ושום דבר לא השתנה.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='צפונה';
$ec_lang['lpn_survey_axis_east']='מזרחה';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='קובץ זה ריק.';
$ec_lang['lpn_survey_err_unreadable']='לא ניתן היה לקרוא קובץ זה כרשימת נקודות סקר.';
$ec_lang['lpn_survey_err_ambiguous_coord']='יותר מעמודה אחת בקובץ זה יכולה להיות ה-{axis} ({detail}), ועמוד זה לא יבחר ביניהן. השאירו רק אחת מהן בשם {axis} ונסו שוב.';
$ec_lang['lpn_survey_err_no_points']='אף שורה בקובץ זה לא ניתנה לקריאה כנקודת סקר. שורות שנקראו: {detail}';
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
$ec_lang['lpn_survey_format_label']='פורמט הקובץ:';
$ec_lang['lpn_survey_format_internal']='מוגדר פנימית';
$ec_lang['lpn_survey_create']='יצירת צמתים';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='השורה הראשונה דולגה: היא אינה נותנת שם לאף עמודה שעמוד זה מכיר.';
$ec_lang['lpn_survey_type_label']='סוג הנכס:';
$ec_lang['lpn_survey_confirm_junction']='נמצאו {n} צמתים. להמשיך?';
$ec_lang['lpn_survey_confirm_reservoir']='נמצאו {n} מאגרים. להמשיך?';
$ec_lang['lpn_survey_confirm_tank']='נמצאו {n} מכלים. להמשיך?';
$ec_lang['lpn_survey_report_junction']='יובאו {n} צמתים, {m} מהם עם רום.';
$ec_lang['lpn_survey_report_reservoir']='יובאו {n} מאגרים, {m} מהם עם רום.';
$ec_lang['lpn_survey_report_tank']='יובאו {n} מכלים, {m} מהם עם רום.';
$ec_lang['lpn_survey_report_clean']='כל נקודה בקובץ עברה, ושום דבר לא שונה בדרך.';
$ec_lang['lpn_survey_report_notes']='שגיאות והערות ייבוא:';
$ec_lang['lpn_survey_sev_error']='שגיאה';
$ec_lang['lpn_survey_sev_warning']='אזהרה';
$ec_lang['lpn_survey_note_line']='שורה {line}:‏ {sev}:‏ {code}:‏ {text}';
$ec_lang['lpn_survey_note_row_short']='יש פחות מדי עמודות עבור פורמט הקובץ שלמעלה.';
$ec_lang['lpn_survey_note_coord_missing']='התא של {axis} ריק.';
$ec_lang['lpn_survey_note_bad_coord']='ה-{axis} אינו נקרא כמספר.';
$ec_lang['lpn_survey_note_coord_range']='ה-{axis} מחוץ לטווח שפרויקט זה מאפשר.';
$ec_lang['lpn_survey_note_bad_elev']='רום לא מספרי. יובא בלי רום.';
$ec_lang['lpn_survey_note_ambiguous_elev']='יותר מעמודה אחת יכלה להיות הרום, כך שאף אחת מהן לא נקראה.';
$ec_lang['lpn_survey_note_blank_rows']='שורות ריקות דולגו: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='השם כבר בשימוש קודם בקובץ זה, הוקצה שם חדש.';
$ec_lang['lpn_survey_note_id_taken']='השם כבר קיים בפרויקט, הוקצה שם חדש.';
$ec_lang['lpn_survey_note_id_invalid']='לא ניתן להשתמש בשם זה כאן, הוקצה שם חדש.';
