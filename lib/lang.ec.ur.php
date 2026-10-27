<?php

// اردو — All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='کسر';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/سے';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% بلندی/فاصلہ';
$ec_lang['u_grade']='بلندی/فاصلہ';
$ec_lang['u_in2']='مربع انچ';
$ec_lang['u_inh2o']='in H2O';
$ec_lang['u_in']='انچ';
$ec_lang['u_knpcm2']='kN/cm^2';
$ec_lang['u_knpm2']='kN/m^2';
$ec_lang['u_kpa']='kPa';
$ec_lang['u_lps']='لی/سے';
$ec_lang['u_m2']='می^2';
$ec_lang['u_m3ps']='می^3/سے';
$ec_lang['u_mgd']='MGD';
$ec_lang['u_imgd']='IMGD';
$ec_lang['u_afd']='ac-ft/d';
$ec_lang['u_lpm']='L/min';
$ec_lang['u_cmh']='m^3/h';
$ec_lang['u_cmd']='m^3/d';
$ec_lang['u_mh2o']='می پانی';
$ec_lang['u_mld']='ML/دن';
$ec_lang['u_m']='می';
$ec_lang['u_mm2']='ملی^2';
$ec_lang['u_mmh2o']='ملی پانی';
$ec_lang['u_mm']='ملی';
$ec_lang['u_mps']='می/سے';
$ec_lang['u_npm2']='N/m^2';
$ec_lang['u_pa']='Pa';
$ec_lang['u_psf']='psf';
$ec_lang['u_psi']='psi';
$ec_lang['u_bar']='بار';
$ec_lang['u_kgfcm2']='kgf/cm^2';
$ec_lang['u_s']='سیکنڈ';
$ec_lang['u_hr']='گھنٹہ';
$ec_lang['u_day']='دن';
$ec_lang['u_lph']='L/hr';
$ec_lang['u_gph']='gal/hr';
$ec_lang['u_mmph']='mm/hr';
$ec_lang['u_inph']='in/hr';
$ec_lang['u_acft']='ایکڑ-ft';
$ec_lang['u_ft3']='ft^3';
$ec_lang['u_m3']='می^3';
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
$ec_lang['menu_brand']='HawsEDC حسابات';
$ec_lang['menu_main_hydraulics']='ہائیڈرولکس';
$ec_lang['menu_help']='مدد';
$ec_lang['menu_libre']='آزاد سافٹ ویئر';
$ec_lang['template_welcome']='اپنے خوف دروازے پر چھوڑ دیں؛ یہاں محبت ہماری زبان ہے۔ آپ سب کچھ برباد نہیں کر رہے۔ <a target="_blank" href="https://hawsedc.com/download.php">مفت HawsEDC AutoCAD اوزار</a> بھی آزمائیں۔';
$ec_lang['template_feedback']='کیا آپ اس صفحے کی زبان کو بہتر بنانے کا مشورہ دے سکتے ہیں، یا کچھ اور تجویز کرنا چاہیں گے؟ کیا آپ مدد کرنا چاہتے ہیں یا ایسے اوزار بنانا سیکھنا چاہتے ہیں؟ براہ کرم مجھ سے رابطہ کریں۔';
$ec_lang['template_printable_title']='طباعت کے قابل عنوان';
$ec_lang['template_printable_subtitle']='طباعت کے قابل ذیلی عنوان';
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
$ec_lang['consent_body']='کیا ہم اس براؤزر میں ایک بے ترتیب کوڈ محفوظ کر سکتے ہیں تاکہ ہم گن سکیں کہ اس سائٹ کا ہر حصہ کتنے براؤزر استعمال کرتے ہیں؟ یہ کوڈ اسی لمحے بنایا جاتا ہے، آپ یا آپ کے آلے کے بارے میں کچھ نہیں بتاتا، اور آپ کی درج کردہ کوئی چیز ریکارڈ نہیں کرتا۔ اس کے بغیر ہم آپ کے دوسرے وزٹ کو کسی اور شخص کے پہلے وزٹ سے الگ نہیں پہچان سکتے۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='اس نیٹ ورک کو ہر ہائیڈرالک وقتی مرحلے پر حل کریں۔';
$ec_lang['consent_accept']='یہ قبول کریں';
$ec_lang['consent_accept_all']='ہمیشہ قبول کریں';
$ec_lang['consent_decline']='ہمیشہ انکار کریں';
$ec_lang['consent_current_granted']='آپ نے اس کی اجازت دی۔ یہ براؤزر ایک بے ترتیب کوڈ رکھتا ہے تاکہ ہم اسے گن سکیں۔';
$ec_lang['consent_current_denied']='آپ نے اس سے انکار کیا۔ ہم اس براؤزر پروفائل کی ریکارڈنگ محدود کرنے کے لیے کچھ بھی محفوظ نہیں کرتے۔';
$ec_lang['consent_region_label']='گنتی کے کوڈ کے بارے میں آپ کا انتخاب۔';
$ec_lang['consent_settings_link']='کوکی کی ترتیبات';
$ec_lang['privacy_link']='رازداری کی پالیسی';
$ec_lang['terms_link']='استعمال کی شرائط';
$ec_lang['index_main_title']='مفت آنلائن انجینئرنگ حاسبات';
$ec_lang['index_meta_desc_plain']='پائپوں، نہروں، ویئر اور آبپاشی کے لیے مفت ہائیڈرولک انجینئرنگ حاسبات۔ یہ آپ کے براؤزر میں چلتے ہیں، آف لائن کام کرتے ہیں، اور 27 زبانوں میں دستیاب ہیں۔';
$ec_lang['calc_set_units']='اکائیاں مقرر کریں:';
$ec_lang['calc_set_units_tip']='ایک ہی وقت میں ہر خانے کی اکائی مقرر کرتا ہے۔ غیر تباہ کن: آپ نے جو اعداد ٹائپ کیے ہیں وہ بالکل ویسے ہی رہتے ہیں، اور اب ہر ایک کو نئی اکائی میں پڑھا جاتا ہے۔ 6، 6 ہی رہتا ہے، مگر اب اس کا مطلب 6 ملی میٹر کی بجائے 6 انچ ہے۔';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='پہلے سے مقررہ اقدار بحال کریں';
$ec_lang['calc_defaults_confirm']='کیا حاسبے کو اصل پہلے سے مقرر اقدار میں دوبارہ مقرر کریں؟';
$ec_lang['points_data_note']='(یا ڈیٹا علاقے سے کاپی/پیسٹ کریں)';
$ec_lang['points_data_heading']='کیلکولیٹر ڈیٹا<br />(فارمیٹ دیکھنے کے لیے کاپی استعمال کریں)';
$ec_lang['points_data_points_heading']='پوائنٹس ڈیٹا<br />(فارمیٹ دیکھنے کے لیے کاپی استعمال کریں)';
$ec_lang['points_data_copy']='کاپی';
$ec_lang['points_data_paste']='پیسٹ';
$ec_lang['points_data_msg_line']='کچھ پیسٹ نہیں کیا گیا۔ لائن {n} کو اسٹیشن اور بلندی کے طور پر نہیں پڑھا جا سکا۔';
$ec_lang['points_data_msg_none']='کچھ پیسٹ نہیں کیا گیا۔ اسٹیشن اور بلندی کا کوئی جوڑا نہیں ملا۔';
$ec_lang['calc_inputs']='ان پٹ';
$ec_lang['calc_results']='نتائج';
$ec_lang['view_hide_line']='یہ سطر چھپائیں';
$ec_lang['view_printable']='طباعت کے قابل ورژن (بحال کرنے کے لیے دوبارہ لوڈ کریں)';
$ec_lang['ec_name_label']='یہ حساب محفوظ کریں:';
$ec_lang['ec_name_placeholder']='نام';
$ec_lang['ec_name_tip']='ان درج کردہ قدریوں کو URL میں محفوظ کریں نشان زدگی، تاریخ سے بازیافت، اور شیئرنگ کے لیے';
$ec_lang['calc_copy_link']='لنک کاپی کریں';
$ec_lang['ec_related_calcs']='متعلقہ کیلکولیٹرز:';
$ec_lang['calc_copy_link_done']='کاپی ہو گیا!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='ڈارسی-وائسباخ پائپ دباؤ نقصان';
$ec_lang['dw_main_title']='مفت آنلائن ڈارسی-وائسباخ پائپ دباؤ نقصان حاسبہ';
$ec_lang['dw_main_desc']='دیے گئے قطر، کھردرا پن اور بہاؤ پر ڈارسی-وائسباخ پائپ دباؤ نقصان';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='پائپ کی دیوار کی مطلق کھردری اونچائی، e۔ عام قدریں: فولاد (نیا) 0.046 ملی میٹر، فولاد (استعمال شدہ) 0.15 ملی میٹر، HDPE 0.003 ملی میٹر، PVC/uPVC 0.0015 ملی میٹر، کنکریٹ 0.3–3 ملی میٹر۔';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="صاف پانی کے لیے 20°C پر 1×10⁻⁶ m²/s">حرکیاتی چپچپاہٹ، ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='حرکیاتی چپچپاہٹ، ν';
$ec_lang['dw_kinematic_viscosity_tip']='صاف پانی کے لیے 20°C پر 1×10⁻⁶ m²/s';
$ec_lang['dw_reynolds_number']='رینولڈز عدد، Re';
$ec_lang['dw_flow_regime']='بہاؤ کی نوع';
$ec_lang['dw_regime_laminar']='ورقی';
$ec_lang['dw_regime_transitional']='انتقالی';
$ec_lang['dw_regime_turbulent']='مضطرب';
$ec_lang['dw_friction_factor_method']='رگڑ کے عامل کا طریقہ';
$ec_lang['dw_friction_factor']='رگڑ کا عامل، f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='ہیزن-ولیمز پائپ دباؤ نقصان';
$ec_lang['hw_main_title']='مفت آنلائن ہیزن-ولیمز پائپ دباؤ نقصان حاسبہ';
$ec_lang['hw_main_desc']='دیے گئے قطر، کھردرا پن اور بہاؤ پر ہیزن-ولیمز پائپ دباؤ نقصان';
$ec_lang['hw_hgl_1']='پست آب HGL';
$ec_lang['hw_hgl_2']='بالا آب HGL';
$ec_lang['hw_elev_up']='بالائی رخ کی بلندی';
$ec_lang['hw_pressure_up']='بالائی رخ کا دباؤ';
$ec_lang['hw_elev_down']='زیریں رخ کی بلندی';
$ec_lang['hw_pressure_down']='زیریں رخ کا دباؤ';
$ec_lang['hw_pressure_check']='دباؤ کی جانچ';
$ec_lang['hw_pressure_ok_short']='مثبت دباؤ';
$ec_lang['hw_pressure_neg_short']='منفی دباؤ';
$ec_lang['hw_pressure_neg']='زیریں رخ کا دباؤ صفر سے کم ہے۔ ہائیڈرولک گریڈ لائن پائپ سے نیچے چلی جاتی ہے، اس لیے پائپ مکمل بھرا ہوا نہیں بہے گا اور یہ نتیجہ درست نہ ہو سکتا ہے۔';
$ec_lang['hw_roughness']='ہیزن-ولیمز عامل، C';
$ec_lang['hw_note_1']='<dl><dt>یہ حاسبہ دونوں سروں کے درمیان پائپ کے پروفائل کو ماڈل نہیں کرتا۔</dt><dd>یہ صرف آپ کی درج کردہ بالائی اور زیریں رخ کی بلندیاں استعمال کرتا ہے۔ اگر درمیان میں کہیں زمین کسی بھی سرے سے اونچی ہو جائے تو اس بلند مقام پر دباؤ یہاں بتائے گئے کسی بھی دباؤ سے کم ہوگا۔ اس کی جانچ کے لیے بالائی سرے سے اس بلند مقام تک کی لمبائی کے لیے حاسبہ دوبارہ چلائیں۔</dd><dd>جہاں ہائیڈرولک گریڈ لائن پائپ سے نیچے چلی جائے، وہاں پانی منفی دباؤ کے تحت ہوتا ہے۔ ہوا محلول سے خارج ہو جاتی ہے، پتلی دیوار والا پائپ دب سکتا ہے، اور جوڑوں کے ذریعے گندا زمینی پانی اندر کھنچا جا سکتا ہے۔ لائن کو ہر جگہ مثبت دباؤ کے تحت رکھیں، اور ہر بلند مقام پر ایک ہوا والو (ایئر ویلو) پر غور کریں۔</dd><dt>بالائی رخ کا دباؤ ایک باؤنڈری کنڈیشن ہے جو آپ خود فراہم کرتے ہیں۔</dt><dd>اسے گیج سے، ٹینک کی پانی کی سطح سے (پائپ کے اوپر پانی کی بلندی)، یا پمپ کریو سے حاصل کریں۔ بہاؤ بڑھنے کے ساتھ پمپ کم دباؤ فراہم کرتا ہے، اس لیے کریو پر وہ نقطہ استعمال کریں جو اوپر درج کردہ بہاؤ سے مطابقت رکھتا ہو۔</dd><dt>مقامی نقصان کے عوامل خود جمع کریں۔</dt><dd>لائن پر ہر والو، موڑ، ٹی، میٹر، اور داخلے کے لیے K اقدار جمع کریں، اور وہ مجموعہ درج کریں۔ عام اقدار کے لیے اس ان پٹ پر دیے گئے لنک کی پیروی کریں۔ لمبی ٹرانسمیشن مین پر یہ نقصانات رگڑ کے مقابلے میں چھوٹے ہوتے ہیں، لیکن مختصر اسٹیشن پائپنگ میں یہ اکثر نقصان کا بیشتر حصہ ہو سکتے ہیں۔</dd></dl>';
// Manning Irregular
$ec_lang['mi_menu']='مانینگ غیر یکساں مقطع نالہ';
$ec_lang['mi_main_title']='مفت آنلائن مانینگ غیر یکساں مقطع نالہ حاسبہ';
$ec_lang['mi_main_desc']='غیر یکساں مقطع نالہ مانینگ یکساں بہاؤ حاسبہ';
$ec_lang['mi_waterSurfaceElevation']='پانی کی سطح کی بلندی';
$ec_lang['mi_q_617']='<span class="ec-help" title="مرکب بہاؤ، Q، جو Chow 6-17 کے مطابق ہر خطے کے لیے مرکب n استعمال کرتے ہوئے حاصل کیا جاتا ہے (مساوی رفتاریں)">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='عرضی مقطع کے نقاط';
$ec_lang['mi_groupPoint']='نقطہ';
$ec_lang['mi_groupSegment']='حصہ';
$ec_lang['mi_groupRegion']='علاقہ';
$ec_lang['mi_station']='چینج';
$ec_lang['mi_elevation']='بلندی';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='R<sub>h</sub>، Q<br />علاقے کی حد<br />(کنارہ)';
$ec_lang['mi_tau']='تہ کی<br />برش τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='مرکب<br />n';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='مرکب n';
$ec_lang['mi_notes_1_def']='یہ حاسبہ خطے کے مرکب n کا حساب Chow (1959)، صفحہ 136، مساوات 6-17 (نہ کہ 6-18) کے مطابق کرتے ہوئے HEC-RAS ریفرنس مینوئل کی پیروی کرتا ہے۔';


$ec_lang['mi_notes_2_term']='پتھر کی استر';
$ec_lang['mi_notes_2_def']='پتھر کی استر ڈیزائن کرنے کے لیے مانینگ ذوزنقہ نالہ حاسبہ استعمال کریں۔ یہ حاسبہ قدرتی مقاطع کے لیے زیادہ موزوں ہے۔';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='مانینگ پائپ بہاؤ';
$ec_lang['mpf_main_title']='مفت آنلائن مانینگ پائپ بہاؤ حاسبہ';
$ec_lang['mpf_main_desc']='دیے گئے ڈھلان اور گہرائی پر مانینگ فارمولا یکساں پائپ بہاؤ';
$ec_lang['mpf_pipe_diameter']='پائپ قطر، d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='مانینگ کھردرا پن، n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">رگڑ ڈھلان، S<sub>f</sub></a><span class="ec-help" title="بعض اوقات پائپ ڈھلان کے برابر۔ وضاحت کے لیے لنک پر جائیں (صرف انگریزی میں)۔"><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='نسبی بہاؤ گہرائی، y/d<sub>0</sub>';
$ec_lang['mpf_flow']='بہاؤ، Q';
$ec_lang['mpf_flow_tip']='بہاؤ اور گہرائی ایک لامحدود لمبے پائپ کے لیے حساب کی گئی ہے۔ اس بہاؤ کو پائپ میں داخل کرنے کے لیے زیادہ سر آب گہرائی درکار ہو سکتی ہے۔ تفصیلات اور تدریسی ویڈیو کے لیے نیچے نوٹس دیکھیں۔';
$ec_lang['mpf_velocity']='رفتار، v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="حرکی توانائی بطور پانی کے کالم کی اونچائی، v²/2g">رفتار سر، h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='بہاؤ رقبہ، A';
$ec_lang['mpf_pipe_area']='پائپ رقبہ، A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='نسبی رقبہ، A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='تر محیط، P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='آبی نصف قطر، R<sub>h</sub>';
$ec_lang['mpf_top_width']='اوپری چوڑائی، T';
$ec_lang['mpf_froude_number']='فرود عدد، Fr';
$ec_lang['mpf_shear_stress']='اوسط برشی دباؤ، τ';
$ec_lang['mpf_full_flow']='مکمل بہاؤ، Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='مکمل بہاؤ سے نسبت، Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>یہ ایک <em>لامحدود لمبے</em> پائپ کے اندر بہاؤ اور گہرائی ہے۔</dt><dd>پائپ میں بہاؤ داخل کرانے کے لیے کافی زیادہ بالادست گہرائی درکار ہو سکتی ہے۔ بالادست گہرائی پانے کے لیے رفتار سر کا کم از کم 1.5 گنا جوڑیں، یا معیاری پائپنالی سر آب حساب کے لیے <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">میرا 2 منٹ کا ٹیوٹوریل</a> دیکھیں، جس میں <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> استعمال ہوتا ہے، جو یو ایس فیڈرل ہائی وے ایڈمنسٹریشن کا مفت پائپنالی پروگرام ہے۔</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>سینیٹری سیور ڈیزائن کر رہے ہیں؟</dt><dd>4 سے 96 انچ (100 سے 2400 ملی میٹر) پائپ کے لیے <a target="_blank" href="/sewslope.php">کم از کم سیور ڈھلوان جدولیں</a> دیکھیں، جو m/m، mm/m اور فیصد میں دی گئی ہیں، اور بہت کم بہاؤ کے لیے <a target="_blank" href="/peakfact.php">عروج عوامل</a> کا مطالعہ دیکھیں۔ دونوں صرف انگریزی میں حوالہ جاتی دستاویزات ہیں۔</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='براہ کرم مثبت ہدف Q درج کریں۔';
$ec_lang['mpf_solver_no_solution']='کوئی حل نہیں: y/d0 = 93.8% پر Q پائپ کی گنجائش سے تجاوز کر جاتا ہے (چنی گئی اکائیوں میں Qmax = {qmax})۔';
$ec_lang['mpf_solve_btn']='حل کریں';
$ec_lang['mpf_solve_for_flow']='بہاؤ کے لیے، Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='مانینگ پائپ دباؤ نقصان';
$ec_lang['mphl_main_title']='مفت آنلائن مانینگ پائپ دباؤ نقصان حاسبہ';
$ec_lang['mphl_main_desc']='دیے گئے مکمل بہاؤ پر مانینگ فارمولا دباؤ نقصان';
$ec_lang['mphl_pipe_length']='لمبائی، L';
$ec_lang['mphl_area']='رقبہ، A';
$ec_lang['mphl_total_junction_k']='معمولی (مقامی) نقصان عامل، k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='نقصان عامل، k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='معمولی (مقامی) نقصان عامل، km۔ یہ نقصانات پائپ کے جنکشنز، داخلی راستوں، خارجی راستوں، موڑ، اور والوز پر واقع ہوتے ہیں — اصطلاح "معمولی" روایتی ہے مگر گمراہ کن؛ ایک مختصر لائن میں یہ رگڑ کے نقصانات کے برابر یا اس سے زیادہ ہو سکتے ہیں۔ عام k قدریں: تیز کنارے والا داخلی راستہ 0.5، ہر 45° موڑ 0.2–0.3، گیٹ والو (مکمل کھلا) 0.1، بٹرفلائی والو 0.2، اخراج (ذخیرہ یا فضا میں) 1.0۔ کل km کے لیے تمام فٹنگز کو جمع کریں۔ طے شدہ قدر 2.0 ایک داخلی راستہ، ایک خارجی راستہ، اور دو 45° موڑ فرض کرتی ہے۔';
$ec_lang['mphl_friction_slope']='رگڑ ڈھلان';
$ec_lang['mphl_friction_loss']='رگڑ نقصان، h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='معمولی (مقامی) نقصان، h<sub>m</sub>';
$ec_lang['mphl_total_loss']='کل نقصان، h<sub>L</sub>';
$ec_lang['mphl_egl_1']='پست آب EGL';
$ec_lang['mphl_egl_2']='بالا آب EGL';
$ec_lang['mphl_hgl_egl_tip']='یہ نتیجہ درست نہ ہو جہاں پائپ ہائیڈرالک گریڈ لائن سے اوپر اٹھے۔';
$ec_lang['mphl_note_1']='<dl><dt>یہ حاسبہ دونوں سروں کے درمیان پائپ کے پروفائل کو ماڈل نہیں کرتا۔</dt><dd>اگر HGL کسی بھی مقام پر پائپ کی چوٹی سے نیچے چلا جائے تو یہ حساب درست نہ ہو سکتا۔</dd><dt>کھلے ان لیٹ (پائپنالی) کے معاملے میں، ان لیٹ کنٹرول کی حالتوں کی جانچ ضروری ہے۔</dt><dd>1. بالادست HGL، بالادست عام گہرائی بہاؤ بلندی سے اوپر (اور پائپ سے بھی اونچی!) ہونی چاہیے۔</dd><dd>2. پائپنالی کا سر آب بالادست HGL کے مقابلے میں بالادست EGL سے بہتر ظاہر ہوتا ہے۔</dd><dd>3. سادہ معیاری پائپنالی سر آب حساب کے لیے <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">میرا 2 منٹ کا ٹیوٹوریل</a> دیکھیں، جس میں <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> استعمال ہوتا ہے، جو یو ایس فیڈرل ہائی وے ایڈمنسٹریشن کا مفت پائپنالی پروگرام ہے۔</dd><dd>4. یہ صفحہ صرف آؤٹ لیٹ کنٹرول کی صورت حل کرتا ہے: پائپ مکمل بھرا بہہ رہا ہو، جہاں زیریں رخ کے حالات سر آب متعین کرتے ہیں۔ پائپنالی ڈیزائن کا کام یہ طے کرنا ہے کہ ان لیٹ کنٹرول حاوی ہے یا آؤٹ لیٹ کنٹرول، اس لیے جب بھی دونوں میں سے کوئی بھی ممکن ہو، HY-8 استعمال کریں۔</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='مانینگ ذوزنقہ نالہ';
$ec_lang['mtc_main_title']='مفت آنلائن مانینگ فارمولا ذوزنقہ نالہ حاسبہ';
$ec_lang['mtc_main_desc']='دیے گئے ڈھلان اور گہرائی پر مانینگ فارمولا یکساں ذوزنقہ نالہ بہاؤ';
$ec_lang['mtc_bottom_width']='تہ کی چوڑائی، b';
$ec_lang['mtc_side_slope_1']='جانبی ڈھلان 1، z<sub>1</sub> (افقی/عمودی)';
$ec_lang['mtc_side_slope_2']='جانبی ڈھلان 2، z<sub>2</sub> (افقی/عمودی)';
$ec_lang['mtc_channel_slope']='نالے کا ڈھلان، S';
$ec_lang['mtc_flow_depth']='بہاؤ کی گہرائی، y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">موڑ کا زاویہ، β</a><span class="ec-help" title="پتھر کی حفاظت کے حجم کے لیے۔ خاکہ دیکھنے کے لیے لنک پر جائیں۔"><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="پانی کے مقابلے میں کثافت۔ کچلے ہوئے پتھر کے لیے عام طور پر ≈ 2.65۔">پتھر کی مخصوص کثافت، sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='ڈیزائن پتھر کا حجم، D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='ڈیزائن پتھر کے سائز سے n (Strickler طریقہ)';
// Edited by TGH 2026-09-07
$ec_lang['mtc_n_blodgett']='ڈیزائن پتھر کے سائز سے n (Blodgett طریقہ)';
$ec_lang['mtc_n_bathurst']='ڈیزائن پتھر کے سائز سے n (Bathurst طریقہ)';
$ec_lang['mtc_n_pi']='ڈیزائن پتھر کے سائز سے n (P&I، Phillips & Ingersoll طریقہ)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett بمقابلہ Bathurst';
$ec_lang['mtc_pi_range_check']='P&I حد کی جانچ';
$ec_lang['mtc_pi_ok']='d50 P&I حد میں';
$ec_lang['mtc_pi_ok_tip']='0.28–0.36 فٹ (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_not_applicable']='قابل اطلاق نہیں';
$ec_lang['mtc_pi_out_of_range']='حد سے باہر';
$ec_lang['mtc_pi_tip']='یہ مساوات جس 0.28–0.36 فٹ ڈیٹا سیٹ کی حد سے تیار کی گئی، اس سے باہر اضافی تخمینہ ہے — اسے ڈیزائن کی بنیاد نہیں بلکہ محض ایک اندازاً جانچ سمجھیں۔';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Isbash (1936) اور Maricopa County، Arizona، US کے مطابق">تہ کے لیے مطلوبہ زاویہ دار پتھر کا حجم، D<sub>50</sub> (Isbash اور MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Isbash (1936) اور Maricopa County، Arizona، US کے مطابق">جانبی ڈھلان 1 کے لیے مطلوبہ زاویہ دار پتھر کا حجم، D<sub>50</sub> (Isbash اور MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Isbash (1936) اور Maricopa County، Arizona، US کے مطابق">جانبی ڈھلان 2 کے لیے مطلوبہ زاویہ دار پتھر کا حجم، D<sub>50</sub> (Isbash اور MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Maynord، Ruff، اور Abt (1989) کے مطابق۔ موڑ پر پتھر کا حجم اوسط کے 4/3 موڑ کی رفتار کے لیے مقرر کیا جاتا ہے، California Division of Highways (1970) کے مطابق؛ Maynord کی اپنی 1.5 قدر قدرتی نالوں پر لاگو ہوتی ہے۔">مطلوبہ زاویہ دار پتھر کا حجم، D<sub>50</sub> (Maynord، Ruff، اور Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='مطلوبہ زاویہ دار پتھر کا حجم، D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='رفتار یکساں بہاؤ کے مفروضات کے لیے مناسب ہے۔';
$ec_lang['mtc_vel_low']='رفتار کم ہے؛ تلچھٹ جمع ہونے کا خطرہ ہے۔';
$ec_lang['mtc_vel_high']='رفتار زیادہ ہے اور شاید حقیقت پسندانہ نہ ہو؛ نالی کی استر کے کٹاؤ، موڑ پر اضافی گہرائی، اور پھیلاؤ یا رکاوٹوں پر توانائی کے ضیاع کی جانچ کریں۔';
$ec_lang['mtc_iteration_tip']='کھردرے پن کا ایک آپشن (Blodgett–Bathurst کے لیے B/B تجویز کردہ ہے) اور پتھر کے سائز کا ایک آپشن (Isbash تجویز کردہ ہے) چنیں تاکہ آپ کے ہدفی بہاؤ کے لیے یکساں پتھر کے سائز کی طرف خودکار تکرار ہو۔ مکمل طریقے کے لیے نیچے نوٹس دیکھیں۔ تکرار چھوڑنے کے لیے اپنی کھردرے پن کی قدر درج کریں (رہنمائی کے لیے لنک دیکھیں) اور پتھر کے سائز کو نظرانداز کریں۔';
$ec_lang['mtc_note_1']='<dl><dt>پتھر کے سائز اور کھردرے پن کی خودکار ڈیزائن تکرار</dt><dd>کھردرے پن کا ایک آپشن (Blodgett–Bathurst کے لیے B/B تجویز کردہ ہے) اور ڈیزائن پتھر کے سائز کا ایک آپشن (Isbash تجویز کردہ ہے) چنیں۔ یکساں پتھر کے سائز کے ساتھ اپنے ہدفی بہاؤ تک پہنچنے کے لیے گہرائی اور پتھر کے سائز کا حفاظتی عامل ایڈجسٹ کریں۔ جب بھی آپ کوئی ان پٹ تبدیل کرتے ہیں، حاسبہ یہ مراحل دہراتا ہے: 1. ڈیزائن پتھر کے سائز سے کھردرا پن حساب کیا جاتا ہے۔ 2. آپ کے چنے ہوئے طریقے سے حاصل ہونے والی کھردرے پن کی قدر کھردرے پن کے ان پٹ میں نقل ہو جاتی ہے۔ 3. نالی کا بہاؤ اور درکار پتھر کا سائز حساب کیا جاتا ہے۔ 4. ڈیزائن پتھر کا سائز ایڈجسٹ کیا جاتا ہے۔ 5. یہ مراحل اس وقت تک دہرائے جاتے ہیں جب تک ڈیزائن پتھر کے سائز میں غلطی بہت کم نہ ہو جائے۔</dd><dt>بنیادی حاسبہ (بغیر تکرار)</dt><dd>اپنی مطلوبہ کھردرے پن کی قدر درج کریں۔ ڈیزائن پتھر کے سائز کے ان پٹ والے حصے کو نظرانداز کریں۔</dd></dl>';
$ec_lang['mtc_note_2_term']='رفتار کی جانچ';
$ec_lang['mtc_note_2_def']='زیادہ رفتار ظاہر کرتی ہے کہ ایک بڑی بلندی میں کمی واقع ہوئی جس نے اتنی زیادہ مخصوص توانائی پیدا کی۔ یہ توانائی پھیلاؤ، موڑ، یا رکاوٹوں پر تیزی سے ضائع ہو سکتی ہے۔ تصدیق کریں کہ یہ مقام کے لیے مناسب ہے۔';
$ec_lang['mtc_solver_no_solution']='ان نالہ ان پٹس کے ساتھ دیے گئے Q کے لیے کوئی حل نہیں ملا۔';
// Weir Flow Simple
$ec_lang['ws_main_menu']='سادہ ویر بہاؤ';
$ec_lang['ws_main_title']='مفت آنلائن سادہ چوڑی-شیخر ویر بہاؤ حاسبہ';
$ec_lang['ws_main_desc']='سادہ چوڑی-شیخر ویر بہاؤ حاسبہ';
$ec_lang['ws_weirLength']='ویر لمبائی، L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="پانی کی فی اکائی وزن توانائی — پانی کے کالم کی اونچائی، دباؤ نہیں">سر، h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='ویر عامل، C<sub>w</sub>';
$ec_lang['ws_notes_heading']='نوٹ';
$ec_lang['ws_notes_we_term']='ویر مساوات';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='غیر یکساں ویر بہاؤ';
$ec_lang['wi_main_title']='مفت آنلائن کھنڈی، متغیر گہرائی، غیر یکساں ویر بہاؤ حاسبہ';
$ec_lang['wi_main_desc']='غیر یکساں ویر بہاؤ حاسبہ';
$ec_lang['wi_weirPoints']='ویر نقاط';
$ec_lang['wi_pondingHeight']='تالاب بلندی';
$ec_lang['wi_incrementalFlow']='اضافی بہاؤ';
$ec_lang['wi_cumulativeFlow']='مجموعی بہاؤ';
$ec_lang['wi_notes_we_def']='q = اگر (لمبائی = 0) تو 0 ورنہ اگر (ڈھلان=0) تو cw*لمبائی*d<sub>0</sub><sup>1.5</sup> ورنہ cw/(2.5*ڈھلان) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) جہاں d<sub>1</sub> اور d<sub>0</sub> ہمیشہ صفر یا مثبت ہوتے ہیں';
// Orifice Flow
$ec_lang['or_main_menu']='سوراخ بہاؤ';
$ec_lang['or_main_title']='مفت آنلائن سوراخ بہاؤ حاسبہ';
$ec_lang['or_main_desc']='سوراخ بہاؤ — آزاد یا ڈوبا ہوا';
$ec_lang['or_shape_circular']='گول';
$ec_lang['or_shape_rectangular']='مستطیل';
$ec_lang['or_diameter']='<span class="ec-help" title="گول کے لیے قطر؛ مستطیل کے لیے اونچائی">قطر یا اونچائی، D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="صرف مستطیل کھلنے کے لیے">چوڑائی، W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="کھلنے کی تہہ">انورٹ بلندی <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='بالا آب بلندی';
$ec_lang['or_twe']='پست آب بلندی';
$ec_lang['or_cd']='اخراج عامل، C<sub>d</sub>';
$ec_lang['or_centroid_elev']='مرکز ثقل بلندی';
$ec_lang['or_head']='<span class="ec-help" title="پانی کی فی اکائی وزن توانائی — پانی کے کالم کی اونچائی، دباؤ نہیں">مؤثر سر، h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='کھلنے کا رقبہ، A';
$ec_lang['or_regime']='سوراخ کی حالت جانچ';
$ec_lang['or_regime_valid']='آزاد اخراج';
$ec_lang['or_regime_submerged']='ڈوبا ہوا سوراخ';
$ec_lang['or_regime_submerged_tip']='TWE مرکز ثقل سے اوپر — سوراخ کی حالت پھر بھی درست ہے';
$ec_lang['or_regime_warn']='سوراخ کی حالت سے باہر';
$ec_lang['or_regime_warn_tip']='بالا آب کھلنے کے تاج (سب سے اونچے اندرونی نقطے) سے نیچے ہے';
$ec_lang['or_regime_twe_above_hwe']='ان پٹ جانچیں';
$ec_lang['or_regime_twe_above_hwe_tip']='پست آب (TWE) بالا آب (HWE) سے اوپر';
$ec_lang['or_notes_1_term']='سوراخ مساوات';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh)۔ آزاد اخراج: h = HWE − مرکز ثقل۔ ڈوبا ہوا بہاؤ (انورٹ کے اوپر TWE): h = HWE − TWE۔';
$ec_lang['or_notes_2_term']='سوراخ کی حالت';
$ec_lang['or_notes_2_def']='سوراخ بہاؤ مساوات اس وقت لاگو ہوتی ہیں جب بالا آب سطح کھلنے کے تاج سے اوپر ہو۔ جب بالا آب تاج سے نیچے ہو، تو ویر مساوات استعمال کریں۔';
$ec_lang['or_notes_3_term']='اخراج عامل';
$ec_lang['or_notes_3_def']='تیز کنارے والے سوراخوں کے لیے C<sub>d</sub> تقریباً 0.60–0.65 تک ہوتا ہے۔ گول یا دوبارہ داخل ہونے والے ان لیٹس مختلف اقدار استعمال کرتے ہیں۔ رہنمائی کے لیے <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> یا HEC-RAS ہائیڈرولک حوالہ دستی دیکھیں۔';
$ec_lang['or_notes_4_term']='ڈوبنا';
$ec_lang['or_notes_4_def']='جب TWE کھلنے کی انورٹ کے اوپر ہو، تو یہ حاسبہ خودکار طور پر h = HWE − TWE استعمال کرتے ہوئے ڈوبا ہوا سوراخ مساوات لاگو کرتا ہے۔ جب TWE انورٹ پر یا اس سے نیچے ہو، تو آزاد اخراج فرض کیا جاتا ہے اور h = HWE − مرکز ثقل۔';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='مائیکرو-ہائیڈرو بجلی';
$ec_lang['mhp_main_title']='مفت آن لائن مائیکرو-ہائیڈرو بجلی حاسبہ';
$ec_lang['mhp_main_desc']='ندی کے بہاؤ پر مبنی مائیکرو-ہائیڈرو بجلی پیداوار حاسبہ';
$ec_lang['mhp_gross_head']='مجموعی ہیڈ، H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="دباؤ پائپ (ترسیلی پائپ) کا قطر">دباؤ پائپ قطر، D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_efficiency']='پلانٹ کارکردگی، η (0–1)';
$ec_lang['mhp_vel_check']='رفتار کی جانچ';
$ec_lang['mhp_hl_check']='دباؤ نقصان کی جانچ';
$ec_lang['mhp_hnet']='خالص ہیڈ، H<sub>net</sub>';
$ec_lang['mhp_power']='طاقت پیداوار، P';
$ec_lang['mhp_annual_kwh']='P بطور سالانہ توانائی';
$ec_lang['mhp_vel_low']='رفتار کم ہے؛ تلچھٹ اور ہوا داخل ہونے کا خطرہ۔';
$ec_lang['mhp_vel_high']='رفتار زیادہ ہے؛ منتقلی کے نقصانات، دستیاب توانائی، اور پانی کے ہتھوڑے کی جانچ کریں۔';
$ec_lang['mhp_vel_ok_short']='ٹھیک';
$ec_lang['mhp_vel_high_short']='زیادہ';
$ec_lang['mhp_vel_low_short']='کم';
$ec_lang['mhp_vel_ok_tip']='رفتار دباؤ پائپ کے ڈیزائن کے لیے موزوں (مؤثر) حد میں ہے۔';
$ec_lang['mhp_hl_ok_tip']='ہیڈ نقصان مجموعی ہیڈ کے 10% سے کم ہے۔ یہ پائپ سائز اقتصادی ہے۔';
$ec_lang['mhp_hl_warn_tip']='ہیڈ نقصان مجموعی ہیڈ کے 10% سے زیادہ ہے۔ بڑا پائپ زیر غور لائیں۔';
$ec_lang['mhp_hl_bad_tip']='ہیڈ نقصان مجموعی ہیڈ کے 20% سے زیادہ ہے۔ پائپ کا سائز تبدیل کریں۔';
$ec_lang['mhp_notes_1_term']='دباؤ نقصان';
$ec_lang['mhp_notes_1_def']='کل دباؤ پائپ (ترسیلی پائپ) نقصان h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>، جہاں h<sub>f</sub> = f(L/D)(v²/2g) ڈارسی-وائزباخ رگڑ نقصان ہے، اور h<sub>m</sub> = k<sub>m</sub>·v²/2g داخلہ، موڑ، اور والوز کا احاطہ کرتا ہے۔ خالص ہیڈ H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='رفتار';
$ec_lang['mhp_notes_2_def']='یقینی بنائیں کہ رفتار دستیاب گرنے اور پائپ کی قیمت کے لیے مناسب ہے۔ بہت کم رفتار زیادہ سائز کی نشاندہی کر سکتی ہے؛ بہت زیادہ رفتار رگڑ کے نقصانات اور پانی کے ہتھوڑے کے خطرے کو بڑھا سکتی ہے۔';
$ec_lang['mhp_notes_3_term']='دباؤ نقصان کا ہدف';
$ec_lang['mhp_notes_3_def']='پین اسٹاک (سپلائی پائپ) کا نقصان مجموعی ہیڈ کے 10% سے کم ہونا عموماً اقتصادی ہوتا ہے۔ پائپ کی قیمت اور ضائع ہونے والی طاقت کے درمیان بہترین توازن اکثر 4–6% کے قریب ہوتا ہے، جہاں بجلی کی قیمت زیادہ ہو۔';
$ec_lang['mhp_notes_6_term']='کارکردگی';
$ec_lang['mhp_notes_6_def']='مائیکرو-ہائیڈرو میں عام Pelton اور کراس-فلو ٹربائن کے لیے مخصوص پلانٹ کارکردگی η 0.70 سے 0.85 تک ہوتی ہے۔ ابتدائی قدامت پسند تخمینے کے طور پر 0.75 استعمال کریں۔';
$ec_lang['mhp_notes_7_term']='سالانہ توانائی';
$ec_lang['mhp_notes_7_def']='سالانہ توانائی مسلسل مکمل بہاؤ آپریشن (8760 گھنٹے/سال) فرض کرتی ہے۔ موسمی بہاؤ تغیر، دیکھ بھال بند وقت اور بار گتانک کی وجہ سے اصل پیداوار کم ہوگی۔';

// Orifice Drain Time
$ec_lang['odt_main_menu']='تالاب اور ٹینک نکاسی وقت';
$ec_lang['odt_main_title']='مفت آنلائن تالاب، حوض اور ٹینک نکاسی وقت حاسبہ (سوراخ)';
$ec_lang['odt_main_desc']='تالاب، حوض یا ٹینک نکاسی وقت — سوراخ آؤٹ لیٹ، مخروطی حجم طریقہ';
$ec_lang['odt_h1_elev']='ابتدائی سطح آب';
$ec_lang['odt_a1']='ابتدائی رقبہ، A<sub>1</sub>';
$ec_lang['odt_h2_elev']='آخری سطح آب';
$ec_lang['odt_a0']='سوراخ کی سطح کا رقبہ، A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="مخروطی ماڈل سے آخری بلندی پر تخمینہ کیا گیا">آخری رقبہ، A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='آخری بلندی جانچ';
$ec_lang['odt_h2_ok']='آخری بلندی سوراخ تاج سے اوپر';
$ec_lang['odt_h2_warn']='آخری بلندی سوراخ تاج پر یا اس سے نیچے';
$ec_lang['odt_h2_warn_tip']='سوراخ تاج = مرکز ثقل + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="قطر (گول) یا اونچائی (مستطیل)">سوراخ D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="صرف مستطیل کے لیے">سوراخ چوڑائی، W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='نکاسی وقت (سیکنڈ)';
$ec_lang['odt_t_min']='نکاسی وقت (منٹ)';
$ec_lang['odt_t_hr']='نکاسی وقت (گھنٹے)';
$ec_lang['odt_t_day']='نکاسی وقت (دن)';
$ec_lang['odt_notes_1_term']='فارمولا';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) سر H سے سوراخ تک نکاسی وقت دیتا ہے۔ نکاسی وقت = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>)، جہاں H<sub>1</sub> = ابتدائی بلندی − سوراخ بلندی، H<sub>2</sub> = آخری بلندی − سوراخ بلندی۔';
$ec_lang['odt_notes_2_term']='طریقہ';
$ec_lang['odt_notes_2_def']='مخروطی حجم طریقہ تالاب یا حوض کو ابتدائی آبی سطح پر A<sub>1</sub> اور سوراخ مرکز ثقل بلندی پر A<sub>0</sub> کے درمیان ایک مخروطی حصے کے طور پر ماڈل کرتا ہے۔ A<sub>2</sub>، آخری بلندی پر تالاب کا رقبہ، مخروطی حصہ ماڈل استعمال کرتے ہوئے A<sub>1</sub> اور A<sub>0</sub> سے تخمینہ کیا جاتا ہے۔ ابتدائی سے آخری بلندی تک نکاسی وقت H<sub>1</sub> سے سوراخ تک کل نکاسی وقت سے H<sub>2</sub> سے سوراخ تک باقی نکاسی وقت گھٹانے کے برابر ہے۔';
$ec_lang['odt_h1']='<span class="ec-help" title="ابتدائی سطح آب بمنہا سوراخ مرکز ثقل کی بلندی">ابتدائی سر، H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='زیادہ سے زیادہ بہاؤ، Q<sub>max</sub>';
$ec_lang['odt_vol']='نکالا گیا حجم';
$ec_lang['odt_sketch_start']='آغاز';
$ec_lang['odt_sketch_end']='اختتام';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='ایمیٹر فاصلہ، S<sub>e</sub>';
$ec_lang['ip_sl']='لیٹرل فاصلہ، S<sub>l</sub>';
$ec_lang['ip_n_e']='ایمیٹرز فی لیٹرل، n<sub>e</sub>';
$ec_lang['ip_n_l']='لیٹرلز فی زون، n<sub>l</sub>';
$ec_lang['ip_d']='ہدف اطلاق گہرائی، d';
$ec_lang['ip_a_e']='رقبہ فی ایمیٹر، A<sub>e</sub>';
$ec_lang['ip_pr']='اطلاق کی شرح، PR';
$ec_lang['ip_q_lat']='بہاؤ فی لیٹرل، Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='زون بہاؤ، Q<sub>zone</sub>';
$ec_lang['ip_t_run']='چلانے کا وقت (گھنٹے)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='نہر رساؤ';
$ec_lang['cs_main_title']='مفت آن لائن نہر رساؤ نقصان اور انتقالی کارکردگی حاسبہ';
$ec_lang['cs_main_desc']='نہر رساؤ نقصان & انتقالی کارکردگی — آمد-خروج طریقہ';
$ec_lang['cs_Q_in']='آمد، Q<sub>in</sub>';
$ec_lang['cs_Q_out']='خروج، Q<sub>out</sub>';
$ec_lang['cs_L']='حصے کی لمبائی، L';
$ec_lang['cs_Q_loss']='رساؤ نقصان کی شرح، Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='پیمائش کی جانچ';
$ec_lang['cs_pct_loss']='ضائع شدہ کسر';
$ec_lang['cs_Ec']='انتقالی کارکردگی، E<sub>c</sub>';
$ec_lang['cs_Ec_check']='کارکردگی کا درجہ';
$ec_lang['cs_Vol_day']='روزانہ ضائع ہونے والا حجم';
$ec_lang['cs_Vol_year']='سالانہ ضائع ہونے والا حجم';
$ec_lang['cs_Q_loss_per_L']='فی اکائی لمبائی نقصان، Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='پانی کی قیمت';
$ec_lang['cs_lining_cost']='استرکاری کی لاگت';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="استرکاری کے بعد انتقالی کارکردگی کا مطلوبہ ہدف؛ حصہ 0–1">استرکاری کا ہدف، E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='استرکاری کا رقبہ، L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='سالانہ ضائع شدہ قیمت';
$ec_lang['cs_annual_value_recovered']='سالانہ بحال شدہ قیمت';
$ec_lang['cs_lining_total_cost']='کل استرکاری لاگت';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Simple payback = total lining cost ÷ annual value recovered">واپسی مدت <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — رساؤ کا پتہ چلا';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — کوئی قابلِ پیمائش نقصان نہیں';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — پیمائشیں جانچیں';
$ec_lang['cs_Ec_good']='اچھا — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='مناسب — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='ناقص — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='آمد-خروج طریقہ نہر کے حصے کے سر اور دم پر بہاؤ ناپ کر رساؤ کا تخمینہ لگاتا ہے: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>۔ انتقالی کارکردگی E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>۔ سالانہ حجم مسلسل مکمل بہاؤ آپریشن فرض کرتا ہے؛ موسمی یا جزوی بہاؤ والی نہروں میں اصل نقصان کم ہوگا۔';
$ec_lang['cs_notes_2_term']='کارکردگی کے درجات';
$ec_lang['cs_notes_2_def']='عام غیر استرکاری شدہ مٹی کی نہریں: E<sub>c</sub> = 60–80%۔ اچھی طرح دیکھ بھال کی گئی مٹی کی نہریں: 75–85%۔ کنکریٹ استرکاری نہریں: 90–98%۔ آمد کے 30% سے زیادہ رساؤ نقصان اکثر استرکاری میں سرمایہ کاری کو درست ثابت کرتا ہے۔ (USBR، FAO)';
$ec_lang['cs_notes_3_term']='استرکاری کی واپسی';
$ec_lang['cs_notes_3_def']='کسی بھی مطابقت پذیر کرنسی میں پانی کی قیمت اور استرکاری کی لاگت درج کریں۔ استرکاری کا رقبہ = حصے کی لمبائی × تر محیط — ناپی گئی بہاؤ کی گہرائی پر نہر کے عرضی مقطع کا تر محیط (تہ کی چوڑائی جمع دونوں تر ڈھلانیں)۔ سالانہ بحال شدہ قیمت یہ فرض کرتی ہے کہ استرکاری شدہ نہر مسلسل مطلوبہ E<sub>c</sub> حاصل کرتی ہے۔ موسمی نہروں میں، یا اگر استرکاری مطلوبہ کارکردگی تک نہ پہنچے تو اصل واپسی مدت طویل تر ہوگی۔';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>، تیسرا ایڈیشن (2001)۔ FAO Irrigation and Drainage Paper 57 (1999)۔';
// About
$ec_lang['about_main_menu']='کے بارے میں';
$ec_lang['install_main_menu']='انسٹال کریں';
$ec_lang['install_main_title']='EngCalcs انسٹال کریں';
$ec_lang['install_main_desc']='آف لائن استعمال کے لیے اپنے آلے میں شامل کریں';
$ec_lang['install_intro']='EngCalcs ایک پروگریسو ویب ایپ (PWA) ہے۔ ایک بار انسٹال ہونے کے بعد، تمام کیلکولیٹرز مکمل طور پر آف لائن کام کرتے ہیں — انٹرنیٹ کنکشن کی ضرورت نہیں۔';
$ec_lang['install_android_heading']='اینڈرائیڈ (Chrome)';
$ec_lang['install_android_steps_html']='<li>Chrome میں کوئی بھی کیلکولیٹر صفحہ کھولیں۔</li><li>اوپر نیویگیشن بار میں <strong>⬇ انسٹال</strong> بٹن دبائیں، یا براؤزر مینو (⋮) کھول کر <strong>ہوم اسکرین پر شامل کریں</strong> منتخب کریں۔</li><li>ظاہر ہونے والے پرامپٹ میں <strong>انسٹال</strong> دبائیں۔</li><li>EngCalcs آپ کی ہوم اسکرین پر نظر آئے گا اور آف لائن کام کرے گا۔</li>';
$ec_lang['install_now_btn']='⬇ ابھی انسٹال کریں';
$ec_lang['install_prompt_unavailable']='انسٹال پرامپٹ دستیاب نہیں — براہ کرم اپنے براؤزر کا مینو استعمال کریں۔';
$ec_lang['install_ios_heading']='iOS (سفاری)';
$ec_lang['install_ios_steps_html']='<li>Safari میں کوئی بھی کیلکولیٹر صفحہ کھولیں۔</li><li><strong>شیئر</strong> بٹن دبائیں (اوپر کی طرف تیر والا خانہ)۔</li><li>نیچے اسکرول کر کے <strong>ہوم اسکرین پر شامل کریں</strong> دبائیں۔</li><li><strong>شامل کریں</strong> دبائیں۔ EngCalcs آپ کی ہوم اسکرین پر نظر آئے گا۔</li>';
$ec_lang['install_ios_note']='iOS پر، انسٹال کرنے کے لیے ہمیشہ شیئر مینو استعمال ہوتا ہے — خودکار انسٹال پرامپٹ دستیاب نہیں ہوتا۔';
$ec_lang['install_desktop_heading']='ڈیسک ٹاپ (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>کوئی بھی کیلکولیٹر صفحہ کھولیں۔</li><li>براؤزر کے ایڈریس بار میں <strong>انسٹال آئیکن</strong> (⊕ یا کمپیوٹر آئیکن) پر کلک کریں، یا براؤزر مینو کھول کر <strong>EngCalcs انسٹال کریں…</strong> منتخب کریں۔</li><li><strong>انسٹال</strong> پر کلک کریں۔ EngCalcs ایک علیحدہ ایپ ونڈو کے طور پر کھلے گا۔</li>';
$ec_lang['install_firefox_heading']='Firefox / دیگر براؤزرز';
$ec_lang['install_firefox_body']='اگر براؤزر انسٹال کا آپشن پیش نہیں کرتا تو کیلکولیٹرز کو براؤزر میں معمول کے مطابق استعمال کریں۔ پہلی وزٹ کے بعد صفحات آف لائن استعمال کے لیے خودکار طور پر کیش ہو جاتے ہیں۔ ڈیسک ٹاپ پر Firefox عام صورت ہے۔';
$ec_lang['install_cached_heading']='کیا محفوظ ہوتا ہے';
$ec_lang['install_cached_body']='EngCalcs کو پہلی بار انسٹال کرتے وقت، تمام کیلکولیٹر صفحات اور ان کی معاون فائلیں (اسکرپٹس، اسٹائلز) خودکار طور پر آپ کے آلے میں محفوظ ہو جاتی ہیں۔ اس کے بعد، ہر چیز بغیر انٹرنیٹ کنکشن کے کام کرتی ہے۔ آپ کی زبان کا انتخاب آپ کی آخری آن لائن وزٹ سے یاد رکھا جاتا ہے۔';
$ec_lang['contact_main_menu']='رابطہ';
$ec_lang['about_main_title']='HawsEDC انجینئرنگ کیلکولیٹرز کے بارے میں';
$ec_lang['about_main_desc']='مشن، آزاد سافٹ ویئر، اور تعاون';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>مشن</h3><p>HawsEDC انجینئرنگ کیلکولیٹر 2010 سے آن لائن مفت پیش کیے جا رہے ہیں۔ یہ دنیا بھر کے انجینئروں اور میدانی کارکنوں کی خدمت کے لیے ہیں، خاص طور پر ان لوگوں کے لیے جو پانی کی قلت، محدود وسائل، یا کم خدمت والے علاقوں میں کام کرتے ہیں۔ یہ اوزار ایک وسیع تر انسانی مشن کا حصہ ہیں: ہر انسان کو سب سے عملی اور مؤثر طریقے سے یہ بتانا <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">کہ وہ ہمیشہ کے لیے محبوب اور عزیز ہے، کہ اسے ڈرنے کی کوئی ضرورت نہیں، اور یہ کہ وہ سب کچھ برباد نہیں کرے گا</a>۔</p><p>کیلکولیٹر ذریعہ ہیں۔ منزل تکلیف سے پاک دنیا ہے۔</p><h3>آزاد اوپن سورس لائسنس</h3><p>تمام کوڈ <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 یا بعد کے ورژن</a> کے تحت جاری کیا گیا ہے — آزادی کے معنوں میں آزاد۔ آپ انہی شرائط کے تحت کوڈ استعمال، مطالعہ، ترمیم اور دوبارہ تقسیم کر سکتے ہیں۔</p><p>جو ویب سائٹ اسے پیش کرتی ہے وہ آج اور 2010 سے مفت پیش کی جاتی ہے؛ اگر کسی دن ایسا نہ ہو سکے تو بھی سافٹ ویئر آپ کا ہے کہ اسے خود چلائیں۔</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>سورس کوڈ</h3><p>مکمل سورس کوڈ GitHub پر عوامی طور پر دستیاب ہے:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>آپ وہاں کوڈ دیکھ سکتے ہیں، مسائل درج کر سکتے ہیں، یا ریپوزیٹری فورک کر سکتے ہیں۔</p><h3>تعاون</h3><p>ہر قسم کی مدد کا خیرمقدم ہے۔ <a href="contact.php">Tom Haws سے رابطہ کریں</a>۔</p><ul><li><strong>ترجمے:</strong> بہتر الفاظ تجویز کریں۔ کسی زبان کو بہتر بنائیں یا نئی زبان شامل کریں۔</li><li><strong>بگ رپورٹس:</strong> کسی بھی کیلکولیٹر صفحے پر فیڈ بیک فارم استعمال کریں، یا GitHub پر مسئلہ درج کریں۔</li><li><strong>نئے کیلکولیٹر:</strong> میدانی کارکنوں اور آبپاشی کے پیشہ وروں کی خدمت کرنے والے ہائیڈرولک انجینئرنگ اوزار کے خیالات خاص طور پر خوش آمدید ہیں۔</li><li><strong>ہوسٹنگ:</strong> اگر آپ محدود رابطے والے علاقے کے لیے ان کیلکولیٹروں کا آئینہ بنا سکتے ہیں تو براہ کرم مجھ سے رابطہ کریں۔</li></ul><h3>آف لائن استعمال</h3><p>جب آپ آن لائن ہوں تو کوئی بھی کیلکولیٹر ایک بار کھولیں، اور تمام کیلکولیٹر اس وقت بھی کام کرتے رہیں گے جب آپ آف لائن ہوں: آپ کا براؤزر آپ کے آگے بڑھتے ہی پورا سوٹ محفوظ کر لیتا ہے۔ اس کا طریقہ کار <strong>پروگریسو ویب ایپ (PWA)</strong> ہے۔ اس کے بعد تمام کیلکولیٹر آف لائن کام کرتے ہیں — انٹرنیٹ کی کوئی ضرورت نہیں۔</p><p>Android یا iOS پر، EngCalcs کو اپنے آلے پر ایپ کے طور پر نصب کرنے کے لیے اپنے براؤزر کا "ہوم اسکرین پر شامل کریں" اختیار استعمال کریں۔ ڈیسک ٹاپ پر، اپنے براؤزر کی ایڈریس بار میں نصب آئیکن تلاش کریں۔</p><p>آپ اپنے براؤزر کے "بطور محفوظ کریں…" مینو کا استعمال کرتے ہوئے کوئی بھی انفرادی کیلکولیٹر ایک بار کے آف لائن استعمال کے لیے بھی محفوظ کر سکتے ہیں۔</p><h3>رابطہ</h3><p>Tom Haws — ہائیڈرولک انجینئر اور ان کیلکولیٹروں کے بانی۔<br />کسی بھی کیلکولیٹر صفحے پر فیڈ بیک فارم استعمال کریں، یا <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a> پر سورس کوڈ تک رسائی حاصل کریں۔</p>';
$ec_lang['contactSendMessage']='Tom Haws کو پیغام بھیجیں';
$ec_lang['contactYourName']='آپ کا نام:';
$ec_lang['contactYourEmail']='آپ کا ای-میل پتہ:';
$ec_lang['contactSubject']='موضوع:';
$ec_lang['contact_message']='پیغام:';
$ec_lang['contactSpamPrefix']='پانچ جمع ایک برابر';
$ec_lang['contactSpamPostfix']='(براہ کرم انگریزی میں لکھیں۔ 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='پیغام بھیجیں';
$ec_lang['contact_success']='آپ کا وقت لگا کر لکھنے کے لیے شکریہ۔';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='پتھریلی گزرگاہ کا ڈیزائن (Robinson)';
$ec_lang['rc_main_title']='مفت آن لائن پتھریلی گزرگاہ ڈیزائن حاسبہ — Robinson (1998)';
$ec_lang['rc_main_desc']='کھڑی نالی پتھر کی حفاظت کا سائز — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='کھڑی نالی کے بیڈ کی ڈھلان، S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="کھڑی نالی کے ان لیٹ پر فی یونٹ چوڑائی بہاؤ۔ نچلی چوڑائی B اور کل بہاؤ Q والی نہر کے لیے q_t = Q / B استعمال کریں۔">کل اکائی بہاؤ، q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='پتھر کی حفاظت کی مسامیت، n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="پانی کے مقابلے میں کثافت۔ عام کچلا ہوا گرینائٹ یا بیسالٹ ≈ 2.65۔ Robinson کی درست حد: 2.54 سے 2.82۔">چٹان کی مخصوص کثافت، sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="درجہ بندی معیاری انحراف۔ یکساں چٹان ≈ 1.25۔ Robinson کی درست حد: 1.15 سے 1.47۔">درجہ بندی SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="پانی کا جمع ہونا (Hp > yn) مطلوب ہے کیونکہ یہ بالائی رخ کا کٹاؤ کم کرتا ہے۔ (USDA)">ان لیٹ نالی میں عام گہرائی، y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="مساوات 1 (S0 < 0.10) یا مساوات 2 (0.10-0.40)۔ درست: D50 بین 15 اور 278 ملی میٹر، S0 بین 0.02 اور 0.40۔ حد سے باہر: اضافی تخمینہ۔">مطلوب وسیط چٹان سائز، D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='لاگو مساوات';
$ec_lang['rc_sg_check']='مخصوص کثافت کی جانچ';
$ec_lang['rc_SD_check']='درجہ بندی SD کی جانچ';
$ec_lang['rc_sg_ok']   ='sg درست حد میں';
$ec_lang['rc_sg_ok_tip']='2.54–2.82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg، Robinson حد سے کم';
$ec_lang['rc_sg_high'] ='sg، Robinson حد سے زیادہ';
$ec_lang['rc_sg_high_tip']='درست حد: 2.54–2.82';
$ec_lang['rc_SD_ok']   ='SD درست حد میں';
$ec_lang['rc_SD_ok_tip']='1.15–1.47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD، Robinson حد سے کم';
$ec_lang['rc_SD_high'] ='SD، Robinson حد سے زیادہ';
$ec_lang['rc_SD_high_tip']='درست حد: 1.15–1.47';
$ec_lang['rc_layer']='چٹان کی تہہ کی موٹائی (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='اوپری کرسٹ وکر کا نصف قطر (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='اوپری کرسٹ وکر آرک کی لمبائی';
$ec_lang['rc_apron_length']='<span class="ec-help" title="کھڑی نالی کی پتھر کی حفاظت کی ساختی مدد کے لیے ضروری۔ “آؤٹ لیٹ حصہ اور نیچے کی جانب نالی کی مزاحمت کے نتیجے میں پیدا ہونے والا کم از کم ٹیل واٹر آؤٹ لیٹ حصہ میں پتھر کی حفاظت کے استحکام کو یقینی بنانے کے لیے کافی ہے۔” (Robinson)">آؤٹ لیٹ ایپرن لمبائی (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='کھڑی نالی میں Manning کی کھردرائی، n';
$ec_lang['rc_Vm']='<span class="ec-help" title="qt کا وہ حصہ جو چٹان کے سوراخوں سے گزرتا ہے۔ باقی qs سطح پر بہتا ہے۔ طے شدہ np = 0.45 زاویہ دار کٹی ہوئی چٹان کے لیے۔">چٹان مینٹل سے گزرنے کی رفتار، V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='مینٹل سے یونٹ بہاؤ، q<sub>m</sub>';
$ec_lang['rc_qs']='سطحی یونٹ بہاؤ، q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='پتھر کی حفاظت کی سطح کے اوپر بہاؤ کی گہرائی، d';
$ec_lang['rc_Hp']='<span class="ec-help" title="پانی کا جمع ہونا (Hp > yn) مطلوب ہے کیونکہ یہ بالائی رخ کا کٹاؤ کم کرتا ہے۔ (USDA)">ان لیٹ ویئر ہیڈ، H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='ان لیٹ پر پانی جمع ہونے کی جانچ';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — بالائی جانب پانی جمع';
$ec_lang['rc_pond_ok_tip']='کھڑی نالی کے ان لیٹ سے بالائی رخ پانی کا جمع ہونا مطلوب ہے؛ یہ بالائی رخ کا کٹاؤ کم کرتا ہے۔ (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — پانی جمع نہیں — ان لیٹ کٹاؤ کا امکان';
$ec_lang['rc_pond_warn_tip']='کھڑی نالی کے ان لیٹ سے بالائی جانب پانی جمع نہیں ہو رہا؛ بالائی جانب کٹاؤ ہو سکتا ہے۔ (USDA)';
$ec_lang['rc_eq1']='مساوات 1 (S<sub>0</sub> < 0.10) — ہلکی ڈھلان';
$ec_lang['rc_eq2']='مساوات 2 (0.10 ≤ S<sub>0</sub> ≤ 0.40) — تیز ڈھلان';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0.02 — Robinson توثیقی حد سے کم';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0.40 — Robinson توثیقی حد سے زیادہ';
$ec_lang['rc_notes_1_term']='چٹان کے سائز کی مساوات';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) نے کھڑی نالی کی ڈھلان اور اکائی بہاؤ کی بنیاد پر وسیط پتھر کی حفاظت کے سائز D<sub>50</sub> کے لیے دو تجرباتی مساوات بنائیں۔ مساوات 1 ہلکی ڈھلانوں کے لیے ہے (S<sub>0</sub> < 0.10)؛ مساوات 2 تیز ڈھلانوں کے لیے ہے (0.10 ≤ S<sub>0</sub> ≤ 0.40)۔ دونوں مساوات کو q<sub>t</sub> m²/s میں درکار ہے اور D<sub>50</sub> ملی میٹر میں دیتی ہیں۔ توثیق شدہ حد 0.02 ≤ S<sub>0</sub> ≤ 0.40 ہے۔';
$ec_lang['rc_notes_2_term']='اکائی بہاؤ';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> کھڑی نالی کے کرسٹ پر کل اکائی بہاؤ ہے (فی یونٹ چوڑائی کل بہاؤ)۔ نچلی چوڑائی B اور کل بہاؤ Q والی نہر کے لیے، q<sub>t</sub> ≈ Q / B تخمین لگائیں، یا کھڑی نالی کے ان لیٹ پر نازک گہرائی کی حالت سے حساب لگائیں۔';
$ec_lang['rc_notes_3_term']='چٹان مینٹل سے بہاؤ';
$ec_lang['rc_notes_3_def']='کل بہاؤ کا ایک حصہ پتھر کی حفاظت کے سوراخوں سے گزرتا ہے (مینٹل بہاؤ q<sub>m</sub>)؛ باقی چٹان کی سطح پر بہتا ہے (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>)۔ بہاؤ گہرائی d کو Manning کی مساوات کے ذریعے سطحی بہاؤ q<sub>s</sub> پر کھڑی نالی کی کھردرائی n استعمال کرتے ہوئے حساب کیا جاتا ہے۔ طے شدہ مسامیت n<sub>p</sub> = 0.45 زاویہ دار کٹی ہوئی چٹان کے لیے عام ہے۔';
$ec_lang['rc_notes_5_term']='چٹان سائز کی درست حد';
$ec_lang['rc_notes_5_def']='مساوات D<sub>50</sub> کی 15 ملی میٹر سے 278 ملی میٹر کی حد استعمال کرتے ہوئے بنائی گئی تھیں۔ اس حد سے باہر کے نتائج اضافی تخمینے ہیں اور انہیں اضافی انجینیئرنگ فیصلے کے ساتھ استعمال کرنا چاہیے۔';
$ec_lang['rc_notes_6_term']='آؤٹ لیٹ ایپرن کی بلندی';
$ec_lang['rc_notes_6_def']='آؤٹ لیٹ حصہ میں پتھر کی حفاظت کے اوپری حصے کی بلندی نیچے کی جانب نالی کے بیڈ کی بلندی کے برابر یا کم ہونی چاہیے۔ اگر زیادہ ہو تو آؤٹ لیٹ کی چٹانیں غیر مستحکم ہوں گی۔';

$ec_lang['rc_notes_7_def']='جب ان لیٹ نالی میں عام گہرائی اس ویئر ہیڈ (H<sub>p</sub>) سے کم ہو جو q<sub>t</sub> گزارنے کے لیے درکار ہے، تو کھڑی نالی کے ان لیٹ سے بالائی جانب محدود بہاؤ یا پانی جمع ہوتا ہے۔ یہ عموماً قابل قبول ہے — پانی جمع ہونے سے رفتار کم ہوتی ہے اور بالائی جانب کٹاؤ روکتا ہے۔ جانچ کے لیے: ویئر فلو حاسبہ استعمال کریں تاکہ دیے گئے q<sub>t</sub> اور کرسٹ چوڑائی کے لیے H<sub>p</sub> معلوم ہو، اور اس کا موازنہ ان لیٹ نالی کی عام گہرائی سے کریں۔ اگر H<sub>p</sub> عام گہرائی سے زیادہ ہو تو پانی جمع ہوگا۔';
$ec_lang['rc_notes_4_term']='حوالہ';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS اسی طریقہ پر مبنی ایک <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">Excel اسپریڈ شیٹ</a> بھی شائع کرتی ہے۔';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'فلٹر';
$ec_lang['rc_sketch_top_crest_curve'] = 'چوٹی کا منحنی';
$ec_lang['rc_sketch_outlet_apron']    = 'آؤٹ لیٹ ایپرن';
$ec_lang['rc_sketch_radius']          = 'نصف قطر';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='آبپاشی دباؤ';
$ec_lang['ip_main_title']='مفت آن لائن آبپاشی دباؤ & تقسیم یکسانیت حاسبہ';
$ec_lang['ip_main_desc']='ٹیسٹ برانچ دباؤ اور یکسانیت کا تخمینہ';
$ec_lang['ip_h_supply']='سپلائی دباؤ';
$ec_lang['ip_elev_supply']='سپلائی کی بلندی، z<sub>supply</sub>';
$ec_lang['ip_q_design']='ایمیٹر ڈیزائن بہاؤ، q<sub>design</sub>';
$ec_lang['ip_h_design']='ایمیٹر ڈیزائن دباؤ';
$ec_lang['ip_x']='<span class="ec-help" title="معیاری غیر معاوضی ایمیٹرز کے لیے 0.5؛ دباؤ معاوضی ایمیٹرز کے لیے تقریباً 0">ایمیٹر اخراج قوت نما، x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='ٹیسٹ پاتھ';
$ec_lang['ip_group_reach']='حصہ';
$ec_lang['ip_group_upstream']='بالائی رخ';
$ec_lang['ip_group_downstream']='زیریں رخ';
$ec_lang['ip_group_loss']='نقصان';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="نشان زد: یہ حصہ ٹیسٹ لیٹرل کا ایک سیگمنٹ ہے، جس سے انفرادی ایمیٹرز پانی نکالتے ہیں۔ غیر نشان زد: یہ حصہ مرکزی لائن ہے، جو صرف اُن لیٹرلز کو بہاؤ منتقل کرتا ہے جو ٹیسٹ پاتھ پر نہیں ہیں۔">لیٹرل <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="لیٹرل قطاریں: صرف اس حصے کے ایمیٹرز۔ مرکزی قطاریں: اس حصے سے شاخ ہونے والے دیگر لیٹرلز کے کل ایمیٹرز۔ ٹیسٹ لیٹرل لائن پر ختم ہونے والے مرکزی لائن کے حصے کے لیے، اس میں وہ تمام لیٹرلز بھی شامل ہیں جو اس مقام سے آگے مرکزی لائن پر ہیں، یا وہی جوڑ بانٹتے ہیں (مثلاً مخالف سمت کا لیٹرل) — ان کا بہاؤ بھی اسی حصے سے گزرتا ہے۔">ایمیٹرز <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="اس حصے کے زیریں سرے کی بلندی۔ اندرونی قطاروں میں اختیاری ہے (خالی چھوڑنے پر ہموار / اوپر والے نوڈ کے برابر مانی جاتی ہے)۔ آخری قطار میں لازمی ہے: یہ قدر آخری ایمیٹر کی بلندی ہے، جو براہِ راست مطلوبہ سپلائی دباؤ متعین کرتی ہے۔">زیریں بلندی <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='آخری ایمیٹر کی بلندی (آخری قطار) خالی چھوڑی گئی اور ہموار پر ڈیفالٹ ہو گئی — درست نتیجے کے لیے اسے درج کریں';
$ec_lang['ip_press']='دباؤ';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="حصے کا کل نقصان، h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='کم/منفی دباؤ — ماحول سے کم دباؤ کی حالتوں کی جانچ کریں';
$ec_lang['ip_pressure_warn_short']='کم';
$ec_lang['ip_pressure_high']='بلند دباؤ والے مقامات میں دباؤ کم کرنے کی ضرورت ہے۔';
$ec_lang['ip_pressure_high_short']='بلند';
$ec_lang['ip_max_head']='زیادہ سے زیادہ جائز پائپ دباؤ';
$ec_lang['ip_max_head_tip']='جن لائنوں کا دباؤ اس قدر سے زیادہ ہو انہیں نشان زد کیا جاتا ہے۔ زیادہ دباؤ کی جانچ چھوڑنے کے لیے خالی چھوڑیں۔';
$ec_lang['ip_h_far']='آخری ایمیٹر کا دباؤ';
$ec_lang['ip_q_supply']='<span class="ec-help" title="صرف ماڈل کیے گئے ٹیسٹ پاتھ میں داخل ہونے والا بہاؤ — پورے زون/نظام کے لیے نیچے اطلاق ڈیزائن میں Q_zone دیکھیں۔">ٹیسٹ پاتھ سپلائی بہاؤ، Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='آخری ایمیٹر کا بہاؤ، q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='اوسط ایمیٹر بہاؤ (ٹیسٹ لیٹرل)، q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="آپ کے اندازے میں ایک عام لیٹرل اس ٹیسٹ لیٹرل کے مقابلے میں کتنا زیادہ (یا کم) دباؤ پر چلتا ہے۔ ٹیسٹ لیٹرل کو جان بوجھ کر مفروضہ بدترین صورت رکھا گیا ہے، اس لیے اس کی اپنی اوسط میدانی اوسط سے کم تخمینہ ہے — اسے 0 پر چھوڑنے سے نیچے دی گئی یکسانیت کی جانچ اور اطلاق ڈیزائن کی قدریں ٹیسٹ لیٹرل کی اپنی (غالباً پُرامید) اوسط جوں کی توں استعمال کرتی ہیں۔">تخمینی Δدباؤ، اوسط بمقابلہ ٹیسٹ لیٹرل <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral کو ہر لیٹرل قطار کے دباؤ جمع اوپر درج کردہ دباؤ کے فرق پر دوبارہ جانچا گیا — اس بات کی اصلاح کی کوشش کہ ٹیسٹ لیٹرل مفروضہ بدترین صورت ہے، نمائندہ نہیں۔ یہ نیچے یکسانیت کی جانچ اور اطلاق ڈیزائن کے حصے دونوں میں استعمال ہوتا ہے۔">تخمینی میدانی اوسط ایمیٹر بہاؤ، q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="آخری ایمیٹر کے شمار شدہ بہاؤ کو تخمینی میدانی اوسط ایمیٹر بہاؤ پر تقسیم کیا گیا ہے — یہ معیاری نچلی چوتھائی تقسیم یکسانیت (نچلے گروہ کی اوسط ÷ مجموعی آبادی کی اوسط) کا تخمینہ ہے؛ لیکن یہ ایک چھوٹے ماڈل شدہ نمونے اور صارف کے تخمینی تصحیح سے حاصل ہوتا ہے، مکمل میدانی شماریاتی نمونے سے نہیں۔ 1 یا اس سے زائد قدریں ممکن اور درست ہیں: ان کا مطلب صرف یہ ہے کہ آخری ایمیٹر کا دباؤ تخمینی میدانی اوسط کے برابر یا اس سے زیادہ ہے، اس لیے کوئی دوسرا ایمیٹر سب سے کم دباؤ کا نقطہ ہے۔ یہ اس لیے ہو سکتا ہے کہ آخری ایمیٹر نشیبی زمین پر ہو یا Δدباؤ کا تخمینہ بہت چھوٹا ہو۔">یکسانیت کی جانچ، q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='ٹیسٹ ایمیٹر کا دباؤ سپلائی دباؤ ≥ ہے۔ غالباً یہ بدترین صورت والا ایمیٹر نہیں، یا پائپ چھوٹے کیے جا سکتے ہیں۔';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="یہ ہمارے معیاری یکسانیت کے پیمانے کے تخمینے سے مختلف ہے۔">آخری ایمیٹر بہاؤ ÷ ڈیزائن بہاؤ، q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='کوئی حل نہیں: مطلوبہ سپلائی دباؤ درج شدہ سپلائی دباؤ سے زیادہ ہے۔ سپلائی دباؤ بڑھائیں، مانگ کم کریں، یا بڑا پائپ استعمال کریں۔';
$ec_lang['ip_notes_1_def']='آخری (سب سے دور) ایمیٹر پر دباؤ کا اندازہ لگاتا ہے، پھر انرجی گریڈ لائن کو سپلائی کی طرف واپس، حصہ بہ حصہ، لے جاتے ہوئے راستے میں رگڑ اور مقامی نقصانات جمع کرتا ہے۔ ہر نوڈ پر بلندی اور رفتاری ہیڈ کو منہا کر کے وہاں کا حقیقی دباؤ رپورٹ کیا جاتا ہے۔ اندازہ کیا گیا دور والے سرے کا دباؤ (تنصیف کے ذریعے) اُس وقت تک درست کیا جاتا رہتا ہے جب تک شمار شدہ مطلوبہ سپلائی دباؤ درج شدہ سپلائی دباؤ کے برابر نہ ہو جائے — یہ وہی بند حلقے کا مسئلہ ہے جسے Manning پائپ بہاؤ حاسبہ کا حل کنندہ حل کرتا ہے، جسے یہاں شاخ دار جال تک وسیع کیا گیا ہے۔';
$ec_lang['ip_notes_2_term']='مرکزی بمقابلہ لیٹرل حصے';
$ec_lang['ip_notes_2_def']='ہر قطار سپلائی سے آخری ایمیٹر تک واحد ہائیڈرولک لحاظ سے بدترین راستے (ٹیسٹ پاتھ) کا ایک حصہ ہے۔ مرکزی حصہ صرف اُن لیٹرلز کو بہاؤ منتقل کرتا ہے جو ٹیسٹ پاتھ پر نہیں، اس لیے اس کا اخراج ایک سادہ ضرب ہے (ڈیزائن بہاؤ × حصے کے کل ایمیٹرز کی تعداد) — مقامی دباؤ کی کوئی حساسیت نہیں۔ مرکزی لائن ایک مشترکہ تنے کا پائپ ہے، اس لیے ٹیسٹ لیٹرل لائن پر ختم ہونے والے مرکزی لائن کے حصے میں نہ صرف اس کے اپنے سروں کے درمیان کے لیٹرلز شامل ہونے چاہئیں بلکہ وہ تمام لیٹرلز بھی جو اس مقام سے آگے مرکزی لائن پر ہیں، یا وہی جوڑ بانٹتے ہیں (مثلاً مخالف سمت کا لیٹرل) — ان کا بہاؤ الگ ہونے سے پہلے اسی حصے سے گزرتا ہے، چاہے وہ اس جدول میں کہیں اور نظر آئیں یا نہ آئیں۔ لیٹرل حصہ خود ٹیسٹ لیٹرل کا ایک سیگمنٹ ہے: ایمیٹر کا اخراج اصل مقامی دباؤ سے q = k·H<sup>x</sup> کے ذریعے شمار ہوتا ہے، اور رگڑ کا نقصان Christiansen کے F(n) عامل سے کم کیا جاتا ہے تاکہ حصے میں ہر ایمیٹر کے پانی نکالنے سے بہاؤ کے بتدریج کم ہونے کا حساب رکھا جا سکے۔';
$ec_lang['ip_notes_3_term']='حدود';
$ec_lang['ip_notes_3_def']='ایک مقررہ سپلائی دباؤ (پمپ وکر کے بغیر)، صرف ایک ٹیسٹ پاتھ (پورا میدان نہیں)، اور ایک 2-پیرامیٹر ایمیٹر وکر ماڈل کرتا ہے (دباؤ معاوضی ایمیٹر کا تخمینہ لگانے کے لیے قوت نما 0 کے قریب رکھیں)۔ دو مختلف یکسانیت نسبتیں رپورٹ کی جاتی ہیں، جو جان بوجھ کر الگ رکھی گئی ہیں: q<sub>last</sub>/q<sub>avg,field</sub> معیاری نچلی چوتھائی تقسیم یکسانیت (نچلے گروہ کی اوسط ÷ مجموعی آبادی کی اوسط) کا تخمینہ ہے؛ لیکن یہ ایک چھوٹے ماڈل شدہ نمونے اور صارف کے تخمینی تصحیح سے حاصل ہوتا ہے، معیاری مکمل میدانی شماریاتی نمونے سے نہیں۔ نیز، ٹیسٹ لیٹرل کو جان بوجھ کر مفروضہ بدترین صورت رکھا گیا ہے، اس لیے اس کی خام، غیر تصحیح شدہ اوسط حقیقی میدانی اوسط کو کم ظاہر کرے گی اور یکسانیت کو اصل سے بہتر دکھائے گی؛ Δدباؤ کا اندراج خاص طور پر اسی جھکاؤ کے تدارک کے لیے موجود ہے۔ یکسانیت کے لیے 1 یا اس سے زائد قدریں پھر بھی ممکن ہیں: ان کا مطلب صرف یہ ہے کہ آخری ایمیٹر کا دباؤ تخمینی میدانی اوسط کے برابر یا اس سے زیادہ ہے، اس لیے کوئی دوسرا ایمیٹر سب سے کم دباؤ کا نقطہ ہے۔ یہ اس لیے ہو سکتا ہے کہ آخری ایمیٹر نشیبی زمین پر ہو یا Δدباؤ کا تخمینہ بہت چھوٹا ہو۔ q<sub>last</sub>/q<sub>design</sub> ایک الگ، غیر یکسانیت جانچ ہے جو ساخت کار کے مقررہ بہاؤ کے مقابلے میں ہے — مجموعی طور پر زیادہ یا کم دباؤ والے نظام کی نشاندہی کے لیے مفید، مگر یہ یکسانیت کے عدد کے ساتھ پڑھی جانے والی ایک الگ جانچ ہے، کیونکہ ڈیزائن/مقررہ بہاؤ نظام کے حقیقی اوسط عملی دباؤ سے آزاد ہے۔';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670۔ مائیکرو آبپاشی ڈیزائن کے ASAE/ASABE معیارات وہی کثیر اخراجی رگڑ نقصان کا طریقہ استعمال کرتے ہیں۔';
$ec_lang['ip_notes_5_term']='اطلاق ڈیزائن';
$ec_lang['ip_notes_5_def']='اطلاق کی شرح اور نظام/زون کا بہاؤ تخمینی میدانی اوسط ایمیٹر بہاؤ استعمال کرتے ہیں (q<sub>avg,field</sub> — ٹیسٹ لیٹرل کی اپنی اوسط، درج کردہ Δدباؤ کے تخمینے سے تصحیح شدہ)، کوئی اندازاً شرح نہیں: PR = q<sub>avg,field</sub> / A<sub>e</sub>، جو تصحیح شدہ ماڈل قدر سے حاصل ہوتی ہے۔ فاصلہ اور پورے نظام کے لیٹرل/ایمیٹر شمار یہاں الگ اندراجات ہیں کیونکہ ٹیسٹ پاتھ صرف ایک بدترین صورت کی شاخ ماڈل کرتا ہے، میدان کا ہر لیٹرل نہیں۔';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='برانچڈ پائپ نیٹ ورک';
$ec_lang['bpn_main_title']='مفت آن لائن برانچڈ پائپ نیٹ ورک دباؤ حاسبہ (بغیر لوپ)';
$ec_lang['bpn_main_desc']='برانچڈ (شاخ دار) پائپ نیٹ ورک بہاؤ اور دباؤ';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='جامد سپلائی ہیڈ: صفر بہاؤ پر سورس ہیڈ۔ سپلائی کی بلندی سے اوپر ریزروائر یا ٹینک کی پانی کی سطح، یا پمپ کا شٹ آف ہیڈ۔ پمپ یا متغیر سپلائی وکر متعین کرنے کے لیے سپلائی پوائنٹس 2 اور 3 شامل کریں؛ ٹول ڈیزائن بہاؤ پر ہیڈ پڑھتا ہے۔';
$ec_lang['bpn_elev_source']='سپلائی کی بلندی';
$ec_lang['bpn_q_total']='کل بہاؤ';
$ec_lang['bpn_q_total_tip']='سورس سے نکلنے والا کل بہاؤ (نیٹ ورک کی تمام طلبات کا مجموعہ)۔';
$ec_lang['bpn_p_min']='کم ترین دباؤ';
$ec_lang['bpn_p_min_tip']='نیٹ ورک میں کہیں بھی زیریں رخ کا سب سے کم دباؤ؛ ترسیل کا نازک مقام۔';
$ec_lang['bpn_method']='رگڑ کا طریقہ';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='پائپ لائنیں';
$ec_lang['bpn_id_tip']='اس پائپ لائن کا نام۔ دیگر لائنیں اپ سٹریم کالم میں اس کا حوالہ دیتی ہیں۔';
$ec_lang['bpn_upstream']='بالائی رخ ID';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='اس لائن کی ID جو اس لائن کو فراہم کرتی ہے۔ اس کے عین اوپر والی لائن کی پیروی کرنے کے لیے خالی چھوڑیں (سادہ سیریز پائپ لائن)۔ کسی مختلف لائن سے شاخ نکالنے کے لیے یہاں ID درج کریں۔';
$ec_lang['bpn_roughness_tip']='منتخب کردہ رگڑ کے طریقے کے لیے پائپ کی کھردری: Manning n، Hazen-Williams C، یا Darcy-Weisbach کھردری اونچائی e (ایک لمبائی)۔ عام ہموار پلاسٹک پائپ: n تقریباً 0.009، C تقریباً 150، e تقریباً 0.0015 ملی میٹر۔';
$ec_lang['bpn_demand']='طلب';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='اس لائن کے زیریں سرے پر فراہم کردہ مقررہ بہاؤ۔';
$ec_lang['bpn_demand_mult']='طلب ضارب';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='ایک ہی وقت میں ہر لائن کی طلب کو ضرب دیتا ہے، عروجی گھنٹے یا مستقبل کی نمو کے حساب کے لیے۔ درج شدہ طلبات کے لیے 1 استعمال کریں۔';
$ec_lang['bpn_elev_down']='زیریں بلندی';
// Edited by TGH 2026-09-07
$ec_lang['bpn_q_line']='لائن بہاؤ';
$ec_lang['bpn_q_line_tip']='اس لائن سے گزرنے والا کل بہاؤ: اس کی اپنی طلب جمع ہر زیریں رخ کی طلب جسے یہ فراہم کرتی ہے۔';
$ec_lang['bpn_p_down']='زیریں دباؤ';
// Edited by TGH 2026-09-07
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='اس لائن کے زیریں رخ نوڈ پر گیج دباؤ ہیڈ۔ منفی قدر (نشان زد) کا مطلب ماحول سے کم دباؤ ہے؛ ڈیزائن کی جانچ کریں۔';
$ec_lang['bpn_sketch_heading']='نیٹ ورک خاکہ';
$ec_lang['bpn_source_label']='سورس';
$ec_lang['bpn_line_problem']='یہ لائن سورس سے منسلک نہیں ہے: یہ کسی نامعلوم بالائی رخ ID کی طرف اشارہ کرتی ہے، خود کی طرف اشارہ کرتی ہے، کسی دوسری لائن کی پہلے سے استعمال شدہ ID دہراتی ہے، یا لوپ بناتی ہے۔ غیر منسلک لائنیں غیر حل شدہ رہ جاتی ہیں۔';
$ec_lang['bpn_bad_id_short']='غلط ID';


$ec_lang['bpn_pressure_warn']='کم/منفی دباؤ؛ ماحول سے کم دباؤ کی حالتوں کی جانچ کریں';
$ec_lang['bpn_pressure_warn_short']='کم';
$ec_lang['bpn_notes_1_term']='بطور ڈیفالٹ سیریز، بصورتِ ضرورت شاخ';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='اپ سٹریم ID خالی چھوڑی جائے تو لائن اپنے اوپر والی لائن کی پیروی کرتی ہے، ایک سیریز پائپ لائن کے طور پر۔ کسی اپ سٹریم لائن سے شاخ نکالنے کے لیے اس کی ID درج کریں۔ بطور ڈیفالٹ سیریز پائپ لائن ہوتی ہے؛ شجرہ صرف وہیں بنتا ہے جہاں شاخ درج کی جائے۔';
$ec_lang['bpn_notes_2_term']='صرف برانچڈ نیٹ ورکس، بغیر لوپ';
$ec_lang['bpn_notes_2_def']='ہر لائن کی بالکل ایک اپ سٹریم لائن ہوتی ہے (ایک شجرہ)۔ یہ ٹول لوپ والے نیٹ ورکس حل نہیں کرتا، جن کے لیے تکراری طریقے (EPANET یا اسی طرح کے) درکار ہیں۔ چونکہ نیٹ ورک میں لوپس نہیں ہیں، اس لیے حل براہ راست اور درست ہے۔';
$ec_lang['bpn_notes_3_term']='کوئی فعال دباؤ کنٹرول نہیں';
$ec_lang['bpn_notes_3_def']='آپ ایک مقررہ مقامی نقصان والا والو (k-قدر) شامل کر سکتے ہیں، لیکن دباؤ کم کرنے والے یا دباؤ برقرار رکھنے والے والوز (PRV/PSV) شامل نہیں کر سکتے۔ ان کی کھلی/بند حالت بہاؤ اور دباؤ پر منحصر ہوتی ہے، جس سے تکرار لازم ہو جاتی۔';
$ec_lang['bpn_supply2_q']='سپلائی بہاؤ 2';
$ec_lang['bpn_supply2_h']='سپلائی ہیڈ 2';
$ec_lang['bpn_supply3_q']='سپلائی بہاؤ 3';
$ec_lang['bpn_supply3_h']='سپلائی ہیڈ 3';
$ec_lang['bpn_supply_pt_tip']='اختیاری سپلائی وکر پوائنٹس 2 اور 3۔ پمپ، یا ایسا کوئی سورس ماڈل کرنے کے لیے ہر ایک کے لیے بہاؤ اور ہیڈ درج کریں جس کا ہیڈ زیادہ ترسیل کے ساتھ کم ہوتا ہے؛ ٹول ڈیزائن بہاؤ پر ہیڈ پڑھتا ہے۔ اوپر پوائنٹ 1 صفر بہاؤ پر جامد ہیڈ ہے۔ مستقل ریزروائر ہیڈ کے لیے 2 اور 3 کو خالی چھوڑیں۔';
$ec_lang['bpn_h_supply']='سپلائی ہیڈ';
$ec_lang['bpn_h_supply_tip']='سپلائی وکر سے پڑھا گیا ڈیزائن بہاؤ پر سورس ہیڈ۔ جب وکر ہموار (ریزروائر) ہو تو یہ درج کردہ سورس ہیڈ کے برابر ہوتا ہے۔';
$ec_lang['bpn_supply1_h']='جامد سپلائی ہیڈ';
$ec_lang['lpn_main_menu']='آبی سپلائی نیٹ ورک';
$ec_lang['lpn_main_title']='EPANET حل کار کے ساتھ مفت آن لائن پانی کی تقسیم کے نیٹ ورک کی ماڈلنگ';
$ec_lang['lpn_main_desc']='پانی کی سپلائی نیٹ ورک کا تجزیہ: لوپ والا پائپ نیٹ ورک بنائیں یا EPANET فائلیں درآمد کریں';
$ec_lang['lpn_title_units']='{units} یونٹس';
$ec_lang['lpn_tool_select']='منتخب کریں';
$ec_lang['lpn_tool_add_junction']='جنکشن';
$ec_lang['lpn_tool_add_reservoir']='ریزروائر';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='ٹینک';
$ec_lang['lpn_tool_add_pipe']='پائپ';
$ec_lang['lpn_tool_add_pump']='پمپ';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='والو';
$ec_lang['lpn_tool_add_text']='متن';
// Junction and Pipe (Task 719): Tom's WaterCAD command, a junction, a pipe, a junction, a pipe, until Escape.
$ec_lang['lpn_tool_add_chain']='جنکشن پائپ زنجیر';
$ec_lang['lpn_tool_vertices']='موڑ نقاط';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='گاہک';
$ec_lang['lpn_tool_add_meter_tip']='گاہک کا پوائنٹ متعین کریں، پھر اس کا کنکشن: لنک یا نوڈ۔ گاہک کو دی گئی طلب اس لنک کے قریبی سرے والے نوڈ میں شامل ہو جاتی ہے۔';
$ec_lang['lpn_mode_add_meter']='گاہک: متعین کریں کہ گاہک کہاں ہے، پھر وہ پائپ یا نوڈ منتخب کریں جو اسے سروس دیتا ہے۔ یا منسوخ کرنے کے لیے Esc استعمال کریں۔';
$ec_lang['lpn_pane_tab_customers']='گاہک';
// The Shape table (Task 779). Closed is a polygon's closure, not a pipe's or valve's status, so it
// is a key of its own and not lpn_field_closed: many languages use different words for the two.
// Points is the column of the Shape's points, "Shape S1, point 2" in lpn_snap_shape_point.
$ec_lang['lpn_pane_tab_shapes']='شکلیں';
$ec_lang['lpn_pane_shape_closed']='بند';
$ec_lang['lpn_pane_shape_points']='پوائنٹس';
$ec_lang['lpn_customer_heading']='گاہک {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='فی سروس طلب';
$ec_lang['lpn_field_meter_count']='سروسز کی تعداد';
$ec_lang['lpn_field_meter_total']='کل طلب';
$ec_lang['lpn_field_meter_total_tip']='نیچے نامزد جنکشن میں شامل کردہ کل۔';
$ec_lang['lpn_field_meter_pipe']='منسلک اثاثہ';
$ec_lang['lpn_field_meter_pipe_suggest']='قریب ترین عنصر {id} ہے۔ اس گاہک کو اس سے سروس دینے کے لیے اسے یہاں درج کریں۔';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='منسلک نوڈ';
$ec_lang['lpn_field_meter_node_tip']='وہ جنکشن جس سے یہ گاہک منسلک ہے۔ اس کی بجائے پائپ کے کسی سٹیشن سے سروس دینے کے لیے رابطے کے نقطے کو کسی پائپ پر گھسیٹیں۔';
$ec_lang['lpn_meter_pipe_unknown']='اس پراجیکٹ میں کوئی چیز {id} نام کی نہیں، اس لیے گاہک وہیں رہنے دیا گیا جہاں تھا۔';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_meter_pattern_unknown']='اس پراجیکٹ میں کوئی پیٹرن {id} نام کا نہیں، اس لیے گاہک ویسے ہی رہنے دیا گیا جیسا تھا۔';
$ec_lang['lpn_meter_placed']='گاہک {id} شامل ہو گیا۔ اس کی تفصیل اور طلب گاہک جدول میں درج کریں، یا اس کا پراپرٹیز باکس کھولنے کے لیے منتخب کریں موڈ میں اسے منتخب کریں۔';
$ec_lang['lpn_field_meter_pipe_tip']='وہ عنصر جس سے یہ سروس جڑتی ہے۔ اسے بدلنے کے لیے یہاں یا گاہک جدول میں کوئی اور درج کریں، یا کنکشن پوائنٹ کو کسی مختلف عنصر پر گھسیٹیں۔';
$ec_lang['lpn_field_meter_station']='پائپ پر مقام (%)';
$ec_lang['lpn_field_meter_station_tip']='سروس کنکشن تک پائپ کے ساتھ فاصلہ، پائپ کے پہلے نوڈ سے دوسرے تک کے فیصد کے طور پر۔ 0 ایک سرے پر ہے اور 100 دوسرے پر۔ پائپ پر موجود دائرہ پوائنٹر سے یہی کام کرتا ہے۔';
$ec_lang['lpn_field_meter_offset']='پائپ سے فاصلہ';
$ec_lang['lpn_field_meter_offset_tip']='مثبت قدر پائپ کے دائیں طرف ہے، اس کے پہلے نوڈ سے دوسرے کی طرف دیکھتے ہوئے۔ یہاں قدر ٹائپ کرنے سے گاہک مین کے دوسری طرف منتقل ہو سکتا ہے، اور یہ ہمیشہ سروس لائن کو مین کے ساتھ سیدھا زاویہ بناتی ہے۔';
$ec_lang['lpn_field_meter_lumped']='نوڈ میں شامل';
$ec_lang['lpn_field_meter_lumped_tip']='قریب ترین نوڈ؛ اس گاہک کی طلبات وہیں شامل کی جاتی ہیں۔';
$ec_lang['lpn_node_customers']='گاہک طلبات';
$ec_lang['lpn_node_customers_tip']='ان گاہکوں کی فہرست جو یہاں شامل کیے گئے کیونکہ یہ ان کا قریب ترین نوڈ تھا۔ گاہکوں کی طلب یہاں درج دیگر طلب کے علاوہ ہے۔ گاہک میں ترمیم وہاں کی جاتی ہے جہاں وہ نقشے پر ہے یا گاہک جدول میں۔';
$ec_lang['lpn_node_customers_sum']='گاہکوں ({n}) سے {total} {unit}';
$ec_lang['lpn_customer_detached']='⚠ یہ گاہک کسی پائپ سے منسلک نہیں، اس لیے اس کی طلب جوابات میں شامل نہیں۔ اسے حذف کریں، یا پائپ کھینچ کر گاہک کو اس پر منتقل کریں۔';
$ec_lang['lpn_customer_fixed_head']='⚠ اس پائپ کے قریبی سرے پر ایک مقررہ پانی کی سطح ہے، اس لیے یہ طلب سمولیشن پر اثر انداز نہیں ہوتی۔';
$ec_lang['lpn_customer_node_inactive']='یہ گاہک ایک ایسے جنکشن سے منسلک ہے جو اس منظرنامے میں غیر فعال ہے، اس لیے اس کی طلب حل میں شامل نہیں ہے۔';
$ec_lang['lpn_customer_detached_count']='پائپ سے منسلک نہ ہونے والے گاہک ({n})۔ ان کی طلب شمار نہیں کی جاتی۔';
$ec_lang['lpn_meter_pick_pipe']='اب وہ پائپ یا نوڈ منتخب کریں جو اس گاہک کو سروس دیتا ہے۔ گاہک وہیں رہتا ہے جہاں آپ نے اسے رکھا۔ منسوخ کرنے کے لیے Esc دبائیں۔';
$ec_lang['lpn_inp_export_flat_customers']='EPANET فائل میں گاہک نہیں ہوتے۔ اس پراجیکٹ کے گاہکوں ({n}) کی طلب اس جنکشن پر طلب کی قطار کے طور پر لکھی جاتی ہے جس سے ہر گاہک منسوب ہے، اور اس کا نام گاہک کے ٹیگ پر رکھا جاتا ہے۔ فائل خود گاہک کو درج نہیں کرتی: اس کا مقام، اسے سروس دینے والا پائپ، اس پائپ کے ساتھ سروس کہاں جڑتی ہے، یا وہ کتنی سروسز کی نمائندگی کرتا ہے۔ یہ معلومات پراجیکٹ میں رہتی ہے؛ اسے رکھنے کے لیے پراجیکٹ فائل محفوظ کریں۔';

$ec_lang['lpn_area_hint_window_start']='ونڈو کا ایک کونا متعین کریں۔';
$ec_lang['lpn_area_hint_window_go']='مکمل کرنے کے لیے مخالف کونا متعین کریں۔';
$ec_lang['lpn_area_hint_lasso_start']='خاکہ شروع کرنے کے لیے ایک پوائنٹ متعین کریں۔';
$ec_lang['lpn_area_hint_lasso_go']='خاکہ بنانے کے لیے حرکت کریں۔ مکمل کرنے کے لیے آخری پوائنٹ متعین کریں۔';
$ec_lang['lpn_area_hint_polygon_start']='کثیر الاضلاع رقبے کا پہلا کونا متعین کریں۔ مکمل کرنے کے لیے ڈبل کلک کریں۔';
$ec_lang['lpn_area_hint_polygon_go']='ہر کونا متعین کریں۔ مکمل کرنے کے لیے آخری کونے پر ڈبل کلک کریں۔';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='منتخب کرتے وقت Shift دبائے رکھیں تاکہ موجودہ انتخاب کے ساتھ جاری رکھا جا سکے، جو آپ منتخب کریں اسے شامل یا خارج (ٹوگل) کرتے ہوئے۔';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='نقشے پر دبائیں اور جو آپ چاہتے ہیں اس کے گرد گھسیٹیں، پھر اٹھا لیں۔';
$ec_lang['lpn_area_hint_touch_go']='جو آپ چاہتے ہیں اس کے گرد گھسیٹیں، پھر مکمل کرنے کے لیے اٹھا لیں۔';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='یہ دکھائیں';
$ec_lang['lpn_multi_title']='{n} منتخب';
$ec_lang['lpn_multi_varies']='مختلف';
$ec_lang['lpn_multi_applied']='{n} پر {prop} مقرر کیا۔';
$ec_lang['lpn_multi_no_fields']='ان میں کچھ ایسا نہیں جو یہاں مل کر مقرر کیا جا سکے۔';
$ec_lang['lpn_pane_pasted']='پیسٹ کیے گئے سیل ({n})۔ تبدیل نہ کیے گئے سیل ({skipped})۔';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='پیسٹ کی گئی قطاریں ({n})۔ نیٹ ورک میں شامل کی گئی قطاریں ({created})۔';
$ec_lang['lpn_pane_pasted_rows_skipped']='پیسٹ کی گئی قطاریں ({n})۔ نیٹ ورک میں شامل کی گئی قطاریں ({created})۔ تبدیل نہ کیے گئے سیل ({skipped})۔';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='اس علاقے کو منتخب کریں اور سپریڈ شیٹ سے قطاریں پیسٹ کر کے انہیں شامل کریں۔';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='جدول کے آخر میں نئی قطاروں کے طور پر پیسٹ کریں';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='اس جدول کے نیچے کاپی کی گئی قطاریں شامل کرنے کے لیے Ctrl+V دبائیں۔ منسوخ کرنے کے لیے Esc دبائیں۔';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='اس پیسٹ میں قطاریں ({n})۔ جدول میں سمانے والی قطاریں ({fit})۔ باقی قطاریں ({extra}) نیچے نئی قطاروں کے طور پر شامل کریں؟';
$ec_lang['lpn_pane_paste_overflow_add']='قطاریں شامل کریں ({extra})';
$ec_lang['lpn_pane_paste_overflow_fit']='صرف سمانے والی قطاریں پیسٹ کریں ({fit})';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='اس پیسٹ میں قطاریں ({n})۔ جدول میں سمانے والی قطاریں ({fit})۔ باقی قطاریں ({extra}) نئی قطاروں کے طور پر شامل نہیں کی جا سکتیں: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='مماثل نہ ہونے والی IDs ({n})۔ پھر بھی پیسٹ کریں؟';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='کچھ بھی پیسٹ نہیں کیا گیا۔ {reasons}';
$ec_lang['lpn_pane_paste_more']='مسائل والی قطاریں جو یہاں نہیں دکھائی گئیں: {n}۔';
$ec_lang['lpn_pane_paste_no_id']='قطار {row}: نئی قطار کے لیے ID درکار ہے۔';
$ec_lang['lpn_pane_paste_bad_id']='قطار {row}: ID {id} میں خالی جگہ یا اقتباسی علامت ہے۔';
$ec_lang['lpn_pane_paste_id_taken']='قطار {row}: ID {id} پہلے سے استعمال میں ہے۔';
$ec_lang['lpn_pane_paste_id_twice']='قطار {row}: ID {id} اس پیسٹ میں دو بار استعمال ہوا ہے۔';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='قطار {row}: نئے نوڈ کو {first} اور {second} دونوں درکار ہیں۔';
$ec_lang['lpn_pane_paste_no_ends']='قطار {row}: نئے لنک کو سے نوڈ اور تک نوڈ درکار ہیں۔';
$ec_lang['lpn_pane_paste_no_node']='قطار {row}: نوڈ {id} ابھی موجود نہیں۔ پہلے اپنے نوڈز پیسٹ کریں، پھر اپنے لنکس۔';
$ec_lang['lpn_pane_paste_same_ends']='قطار {row}: سے اور تک ایک ہی نوڈ ہیں۔';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='قطار {row}: {text} ایک درست {col} نہیں ہے۔';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='قطار {row}: نئے متن کو {first} اور {second} دونوں درکار ہیں۔';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='قطار {row}: {id} اس نیٹ ورک میں ابھی نہ نوڈ ہے نہ پائپ۔ پہلے اسے پیسٹ کریں، پھر یہ متن۔';
$ec_lang['lpn_pane_paste_customer_no_position']='قطار {row}: نئے گاہک کو {first} اور {second} دونوں درکار ہیں۔';
$ec_lang['lpn_pane_paste_shape_no_points']='قطار {row}: نئی شکل کو اس کے پوائنٹس درکار ہیں۔';
// {pair} is the Points heading's own pair in this project's axis words: X/Y, N/E or Lat/Lon.
$ec_lang['lpn_pane_paste_shape_bad_points']='قطار {row}: {text} پوائنٹس کی فہرست نہیں ہے۔ ہر پوائنٹ کو {pair} کی صورت میں لکھیں، اعشاریہ کے لیے نقطہ (.) استعمال کریں، اور پوائنٹس کو | سے الگ کریں۔';
$ec_lang['lpn_pane_paste_shape_closed_few']='قطار {row}: بند شکل کے لیے کم از کم تین پوائنٹس درکار ہیں۔';
$ec_lang['lpn_pane_paste_no_customer_ref']='قطار {row}: نئے گاہک کو منسلک پائپ یا نوڈ درکار ہے۔';
$ec_lang['lpn_pane_paste_no_pipe']='قطار {row}: پائپ {id} ابھی موجود نہیں۔ پہلے اپنے پائپ پیسٹ کریں، پھر اپنے گاہک۔';
$ec_lang['lpn_pane_paste_no_customer_node']='قطار {row}: نوڈ {id} ابھی موجود نہیں۔ پہلے اپنے جنکشنز پیسٹ کریں، پھر اپنے گاہک۔';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='قطار {row}: نوڈ {id} کے ساتھ کوئی پائپ نہیں جس سے گاہک منسلک ہو سکے۔';
$ec_lang['lpn_pane_filled']='نیچے بھرے گئے سیل ({n})۔ تبدیل نہ کیے گئے سیل ({skipped})۔';
$ec_lang['lpn_pane_filldown']='نیچے بھریں';
$ec_lang['lpn_pane_delete_element']='عنصر حذف کریں';
$ec_lang['lpn_pane_delete_elements']='عناصر حذف کریں';
$ec_lang['lpn_pane_fill_none']='اس انتخاب میں کچھ بھی نیچے نہیں بھرا جا سکتا۔';
$ec_lang['lpn_pane_ctrlenter_filled']='بھرے گئے سیل ({n})۔ تبدیل نہ کیے گئے سیل ({skipped})۔';
$ec_lang['lpn_pane_hide_col']='یہ کالم چھپائیں';
$ec_lang['lpn_pane_hide_cols']='یہ کالمز چھپائیں';
$ec_lang['lpn_pane_show_all_cols']='تمام کالمز دکھائیں';
$ec_lang['lpn_pane_sort_asc']='صعودی ترتیب دیں';
$ec_lang['lpn_pane_sort_desc']='نزولی ترتیب دیں';
$ec_lang['lpn_pane_manage_cols']='کالمز کا انتظام کریں…';
$ec_lang['lpn_pane_manage_cols_title']='کالمز کا انتظام';
$ec_lang['lpn_pane_manage_cols_show']='دکھائیں';
$ec_lang['lpn_pane_manage_cols_up']='اوپر لے جائیں';
$ec_lang['lpn_pane_manage_cols_down']='نیچے لے جائیں';
$ec_lang['lpn_pane_manage_cols_top']='شروع میں لے جائیں';
$ec_lang['lpn_pane_manage_cols_bottom']='آخر میں لے جائیں';
$ec_lang['lpn_pane_manage_cols_width']='چوڑائی (em)';
$ec_lang['lpn_pane_width_tip']='کالمز کی چوڑائی اس براؤزر میں محفوظ ہوتی ہے، پراجیکٹ میں نہیں۔ ڈیفالٹ چوڑائی بحال کرنے کے لیے کالم کے تقسیم کار پر ڈبل کلک کریں۔';
$ec_lang['lpn_pane_colmenu_tip']='کالمز چھپائیں یا ان کا انتظام کریں';
$ec_lang['lpn_tool_area_window']='ونڈو منتخب کریں';
$ec_lang['lpn_tool_area_lasso']='لیسو منتخب کریں';
$ec_lang['lpn_tool_area_polygon']='کثیر الاضلاع منتخب کریں';
$ec_lang['lpn_tool_delete']='حذف کریں';
$ec_lang['lpn_tool_zoom_extent']='مکمل نقشہ دکھائیں';
$ec_lang['lpn_tool_zoom_selection']='انتخاب پر زوم کریں';
$ec_lang['lpn_tool_zoom_window']='زوم ونڈو';
$ec_lang['lpn_zoom_in']='زوم ان کریں';
$ec_lang['lpn_zoom_out']='زوم آؤٹ کریں';
$ec_lang['lpn_new_text']='متن';
$ec_lang['lpn_field_text_bold']='موٹا متن';
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
$ec_lang['lpn_field_text_anchor']='منسلک';
$ec_lang['lpn_field_text_align']='افقی ترتیب';
$ec_lang['lpn_field_text_align_left']='بائیں';
$ec_lang['lpn_field_text_align_center']='درمیان';
$ec_lang['lpn_field_text_align_right']='دائیں';
$ec_lang['lpn_field_text_valign']='عمودی ترتیب';
$ec_lang['lpn_field_text_valign_top']='اوپر';
$ec_lang['lpn_field_text_valign_middle']='درمیان';
$ec_lang['lpn_field_text_valign_bottom']='نیچے';
$ec_lang['lpn_field_text_rotation']='زاویہ (ڈگری)';
$ec_lang['lpn_field_text_match_pipe']='قریب ترین لنک کے زاویے کی طرف مڑیں';
$ec_lang['lpn_field_text_flip']='180° گھمائیں';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='منسلک عنصر';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='یہ متن کسی عنصر کے اتنے قریب رکھا گیا تھا کہ وہ اس کے ساتھ چلتا ہے اور اس کی رہنما لکیر ہے۔ رہنما لکیر پر موجود متن اپنی افقی اور عمودی ترتیب اس جانب سے لیتا ہے جس طرف وہ واقع ہے، اسی لیے یہ دونوں قطاریں منسلک ہونے کی حالت میں پیش نہیں کی جاتیں۔';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='خارج کنندہ گتانک';
$ec_lang['lpn_field_emitter_tip']='ایک اضافی اخراج جو دباؤ پر منحصر ہوتا ہے، سپرنکلر، کھلے آؤٹ لیٹ، یا ماڈل کی گئی رساؤ کے لیے۔ یہ جو بہاؤ خارج کرتا ہے وہ اس گتانک کو دباؤ (خارج کنندہ ایکسپوننٹ تک بڑھایا گیا) سے ضرب دے کر حاصل ہوتا ہے، جو پورے نیٹ ورک کے لیے ایک بار ترتیبات، حساب، ہائیڈرالکس کے تحت مقرر کیا جاتا ہے۔ عام جنکشن پر اسے خالی چھوڑ دیں۔';
$ec_lang['lpn_field_elev']='بلندی';
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
$ec_lang['lpn_field_head']='ہیڈ';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='ذخیرے میں پانی کی سطح کی بلندی، جسے اونچائی کے طور پر ناپا جاتا ہے، دباؤ کے طور پر نہیں۔ اسے خالی چھوڑ دیں تاکہ پانی کی سطح ذخیرے کی بلندی پر رکھی جائے۔';
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
$ec_lang['lpn_field_tank_base_elev']='فرش کی بلندی';
$ec_lang['lpn_field_tank_base_elev_tip']='ٹینک کے فرش کی بلندی، جس سے پانی کی گہرائی اور حجم ناپے جاتے ہیں۔ خالی چھوڑنے پر فرش زمینی بلندی پر ہوتا ہے۔';
$ec_lang['lpn_tank_ground_elev_tip']='ٹینک پر زمینی بلندی۔ ٹینک پر دباؤ یہیں سے ناپا جاتا ہے، جیسا کہ جنکشن پر۔';
$ec_lang['lpn_field_tank_level']='پانی کی گہرائی';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='ٹینک میں پانی کی گہرائی، جسے ٹینک کے فرش سے اوپر کی طرف ناپا جاتا ہے۔';
$ec_lang['lpn_field_tank_minlevel']='کم ترین پانی کی گہرائی';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='کم سے کم اجازت یافتہ گہرائی، ٹینک کے فرش سے اوپر کی طرف ناپی جاتی ہے۔';
$ec_lang['lpn_field_tank_maxlevel']='زیادہ ترین پانی کی گہرائی';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='زیادہ سے زیادہ اجازت یافتہ گہرائی، ٹینک کے فرش سے اوپر کی طرف ناپی جاتی ہے۔';
$ec_lang['lpn_field_tank_diameter']='ٹینک کا قطر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='عمودی سلنڈر کے لیے۔ بلندی کی اکائیوں میں، پائپ کے قطر کی اکائیوں میں نہیں۔ یہ طے کرتا ہے کہ ایک مخصوص گہرائی کتنا پانی رکھتی ہے۔';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='ٹینک میں پانی کی سطح کی بلندی: ٹینک کے فرش کی بلندی جمع پانی کی گہرائی۔';
$ec_lang['lpn_close']='بند کریں';
// The corner buttons beside every standing box's X (Task 441). Each is an icon-only button, so the
// value is its name: the hover tip and the screen reader's label at once. Auto-hide is a toggle and
// says its state through aria-pressed, so one wording serves both states (AutoCAD's own word).
$ec_lang['lpn_dock_left']='نقشے کے بائیں جانب ڈاک کریں';
$ec_lang['lpn_dock_right']='نقشے کے دائیں جانب ڈاک کریں';
$ec_lang['lpn_dock_float']='تیرتا ہوا';
$ec_lang['lpn_dock_autohide']='خودکار چھپائیں';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='خصوصیات';
// What a docked Properties box says while nothing is selected: it stays in its dock (Tom, 2026-10-07).
$ec_lang['lpn_popup_none']='کچھ منتخب نہیں ہے۔ خصوصیات دیکھنے کے لیے نقشے پر کوئی عنصر منتخب کریں۔';
$ec_lang['lpn_empty_hint']='فائل، نیا پراجیکٹ استعمال کر کے کوئی مثال کھولیں۔ یا ٹول بار سے ریزروائر، جنکشن، اور پائپ شامل کر کے شروع کریں۔';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='آپ کا نیٹ ورک برقرار ہے۔';
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
$ec_lang['lpn_examples_welcome']='EPANET حل کار کے ساتھ پانی کی سپلائی نیٹ ورک ماڈلنگ میں خوش آمدید';
$ec_lang['lpn_examples_heading']='مثال کی کاپی کھولیں';
$ec_lang['lpn_examples_sub']='ہر مثال کاپی کے طور پر کھلتی ہے۔ اسے تبدیل کر کے محفوظ کریں، یا دوبارہ شروع کرنے کے لیے نئی کاپی کھولیں۔';
$ec_lang['lpn_examples_open']='کھولیں';
$ec_lang['lpn_examples_menu']='مثال کھولیں…';
$ec_lang['lpn_examples_blank']='یا خالی نقشے سے شروع کریں';
// The SAME exit, worded for the other way in, is lpn_close (Task 699 merged its own 'Close' key
// into it). Opened from File the user already has work on screen, so "start with a blank map"
// reads as "discard it" and they do not dare press the only button that leaves (Tom, 2026-08-17:
// "I can't back out of the gallery... I am forced to open an example"). Closing never touches a
// project either way.
$ec_lang['lpn_examples_size']='نوڈز: {nodes}، لنکس: {links}';
$ec_lang['lpn_examples_failed']='مثالیں لوڈ نہیں ہو سکیں۔ ڈرائنگ شروع کرنے کے لیے فائل، نیا پراجیکٹ استعمال کریں۔';
$ec_lang['lpn_examples_loading']='مثالیں لوڈ ہو رہی ہیں…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='کچھ ٹھیک کریں';
$ec_lang['lpn_help_notes']='اس صفحے سے متعلق نوٹس';
$ec_lang['lpn_guide_about_heading']='اس کیلکولیٹر کے بارے میں';
$ec_lang['lpn_guide_group_from']='{menu} سے';
$ec_lang['lpn_guide_menu_named']='{menu} مینو';
// **THE NEW BOX, TASK 745** (Tom, 2026-09-29: reorganize Help into three groups, with a new
// "Tables and Hotkeys" box gathering all table help and all keyboard shortcuts). One key names
// both the Help row and the box's own title bar, the same pattern lpn_help_notes already carries
// for the Notes box.
$ec_lang['lpn_help_hotkeys']='جدول اور شارٹ کٹس';
// **THE USER GUIDE** (Tom, 2026-10-06: "Maybe items 2 and 3 combined into a simple User Manual or
// whatever the 2026 thing is?"; Ida's design). Names both the Help row and the box's title bar. It
// replaces lpn_help_hotkeys and the Help > Toolbar fly-out (lpn_help_icons, which still heads the
// box's Toolbar section).
$ec_lang['lpn_help_manual']='رہنما';
// The Guide's contents rail, its search, its Boxes section and the "?" in every box's title bar.
$ec_lang['lpn_guide_contents']='فہرست مضامین';
$ec_lang['lpn_guide_rail_hide']='فہرست مضامین چھپائیں';
$ec_lang['lpn_guide_rail_show']='فہرست مضامین دکھائیں';
$ec_lang['lpn_guide_search']='رہنما میں تلاش کریں';
$ec_lang['lpn_guide_boxes_heading']='باکس';
$ec_lang['lpn_guide_boxes_intro']='ہر باکس کو منتقل کیا جا سکتا ہے، اس کا سائز بدلا جا سکتا ہے، اسے نقشے کے بائیں یا دائیں ڈاک کیا جا سکتا ہے، یا بند کیا جا سکتا ہے۔ باکس کی ٹائٹل بار میں ؟ اس کی مدد کھولتا ہے۔';
// Tom's own wording, 2026-10-07 (his typo "to not" corrected). Below lpn_guide_boxes_intro.
$ec_lang['lpn_guide_boxes_autohide']='جب پوائنٹر ہٹتا ہے تو فوکس کے بغیر باکس تھوڑی دیر بعد چھپ جاتا ہے۔ فوکس والا باکس اس وقت چھپتا ہے جب آپ اس کے باہر کلک کریں، Esc دبائیں، یا پوائنٹر کسی اور جگہ ہونے پر Tab سے اس سے باہر نکلیں۔';
$ec_lang['lpn_guide_box_help']='اس باکس کی مدد';
// A Boxes entry whose box shares its name with a section of the Guide ("Screenshot"), in the Guide
// only, so its Contents list does not show one word twice. Keep {box} as it is.
$ec_lang['lpn_guide_box_named']='{box} باکس';
// Above the Toolbar rows, shown only while some are dimmed (on a phone, or Calculate while
// Recalculate automatically is on): a grey name otherwise reads as a disabled button.
$ec_lang['lpn_guide_dimmed']='مدھم نام وہ بٹن ہے جو اس وقت ٹول بار پر چھپا ہوا ہے۔';
// One entry in the Guide's Boxes section for each box, shown by the "?" in its title bar. Fire flow,
// Critical assets, and Demand scaling carry theirs in lpn_ff_intro and the keys that follow it.
$ec_lang['lpn_guide_text_popup']='منتخب اثاثے، متن یا گاہک کی، یا کئی منتخب اثاثوں کی خصوصیات دکھاتا ہے۔ باکس انتخاب کے پاس کھلتا ہے، یا وہاں جہاں اسے آخری بار منتقل کیا گیا تھا۔ ترمیم شدہ قدر نیٹ ورک کو فوراً بدل دیتی ہے، اور اثاثے کا نقشے پر لیبل اور جدولوں کا پینل اپ ڈیٹ ہو جاتے ہیں۔ حساب شدہ نتائج صرف پڑھنے والی قطاروں کے طور پر دکھائے جاتے ہیں اور ان میں ترمیم نہیں کی جا سکتی۔';
$ec_lang['lpn_guide_text_find_popup']='ایسے اثاثے تلاش کرتا ہے جو کسی شرط پر پورا اترتے ہوں، جیسے 8 in. سے چھوٹا ہر پائپ یا 40 psi سے کم دباؤ والا ہر جنکشن، اور ان سب پر ایک خاصیت ایک ہی عمل میں بدل سکتا ہے۔ اسے حل سے پہلے ماڈل کی جانچ کے لیے استعمال کریں (غائب بلندی، غلط اکائی میں درج قطر)، حل کے بعد مسئلے والے مقامات کی فہرست کے لیے (کم دباؤ، زیادہ رفتار)، اور بہت سے اثاثوں میں ایک ہی اصلاح کرنے کے لیے۔\n\nکیا تلاش کرنا ہے، خاصیت، شرط، اور قدر کی فہرستیں ایک شرط بناتی ہیں اور اسے کوئری باکس میں متن کی ایک سطر کے طور پر لکھتی ہیں۔ سطر میں براہ راست بھی ترمیم کی جا سکتی ہے، اور فہرستیں اس کی پیروی کرتی ہیں۔ جو کوئری فہرستیں ظاہر نہ کر سکیں، جیسے "یا" سے جڑی دو شرطیں، اس صورت میں فہرستیں اس کے بجائے کنٹرولز استعمال کریں بٹن دبانے تک چھپی رہتی ہیں۔ تلاش کرنے کے لیے کوئری باکس میں Enter دبائیں یا تلاش کریں بٹن دبائیں۔';
$ec_lang['lpn_guide_text_settings_box']='کھلے ہوئے پراجیکٹ اور اس براؤزر کی ترتیبات کو حصوں میں ترتیب دے کر رکھتا ہے۔ اسے کھولنے کے لیے پانی، ترتیبات چنیں۔ دو بٹن، ڈیفالٹ بحال کریں اور نئے سرے سے شروع کریں، انہیں ری سیٹ کرتے ہیں۔ باکس میں تلاش کی جا سکتی ہے: ترتیبات تلاش کریں میں ایک یا زیادہ الفاظ لکھیں تو صرف وہ ترتیبات فہرست میں آتی ہیں جن میں وہ سب الفاظ موجود ہوں۔ اس باکس کی جگہ اور سائز صرف اسی براؤزر میں محفوظ رہتے ہیں۔';
$ec_lang['lpn_guide_text_library_box']='پراجیکٹ کے پیٹرن، وکر، پائپ کی اقسام، فٹنگز کی فہرستیں، کنٹرولز اور قواعد رکھتا ہے، ہر ایک کا اپنا حصہ۔ اسے کھولنے کے لیے پانی، لائبریریاں چنیں۔ اثاثہ کسی پیٹرن، وکر، پائپ کی قسم یا فٹنگز کی فہرست کا حوالہ اس آئٹم کی ID سے دیتا ہے، اور آئٹم یہیں بنایا، ایڈٹ کیا اور حذف کیا جاتا ہے۔ یہ سب پراجیکٹ کے ساتھ محفوظ ہوتے ہیں، اور یہاں کی گئی ترمیم کو کالعدم کریں سے واپس کیا جا سکتا ہے۔ باکس کی جگہ اور سائز صرف اسی براؤزر میں محفوظ رہتے ہیں۔';
$ec_lang['lpn_guide_text_energy_box']='ہر پمپ کی آخری توسیعی مدت کے سمیولیشن میں توانائی کا استعمال، چوٹی کی طاقت اور لاگت رپورٹ کرتا ہے، ہر پمپ کی افادیت اور ترتیبات، توانائی کے تحت مقرر کردہ توانائی کی قیمت استعمال کرتے ہوئے۔ اس کے لیے ترتیبات میں کل چلنے کا وقت اور حل شدہ نیٹ ورک درکار ہے۔ یہ نیٹ ورک کو تبدیل نہیں کرتا۔';
$ec_lang['lpn_guide_text_contour_box']='نوڈز کو اس کے مطابق رنگ دیں میں چنی گئی نوڈ قدر سے نقشے پر بنائے گئے کنٹور پلاٹ کو کنٹرول کرتا ہے: رنگ اسکیم، بھراؤ اور اس کی غیر شفافیت، کنٹور لائن کا وقفہ اور لیبلز، اور رنگ ہر پائپ سے کتنی دور تک پہنچتا ہے۔ اسے بند کرنے سے پلاٹ چھپ جاتا ہے اور نوڈ کے رنگ رہ جاتے ہیں۔ یہ صرف ڈسپلے کو بدلتا ہے، نیٹ ورک کو نہیں۔';
$ec_lang['lpn_guide_text_scncmp_box']='منظرنامہ مینیجر میں نشان زد ہر منظرنامے کو، اور اگر نشان ہٹائے نہ گئے ہوں تو سب کو، ڈرائنگ کی کاپی سے حل کرتا ہے، اور ہر ایک کے لیے اپنی قدروں کی تعداد، طلب کا ضرب، کل رن کا وقت، ہائیڈرالک ٹائم اسٹیپ، سب سے کم دباؤ اور سب سے زیادہ رفتار کو جدول میں پیش کرتا ہے۔ اسے کھولنے کے لیے پانی، رپورٹس، منظرنامہ موازنہ چنیں۔ موازنہ باکس کھلنے پر شروع ہوتا ہے، اور جب تک باکس کھلا رہے ہر ترمیم کے بعد دوبارہ شروع ہوتا ہے۔\n\nیہ پراجیکٹ کو نہیں بدلتا، اور جو منظرنامہ کھلا ہے وہ جیسا تھا ویسا ہی رہتا ہے۔';
$ec_lang['lpn_guide_text_rptbox']='آخری توسیعی مدت کے سمیولیشن کے لیے EPANET انجن کی لکھی ہوئی متنی رپورٹ دکھاتا ہے، بشمول اس کی انتباہات اور نیٹ ورک کا خلاصہ۔ ہر توسیعی مدت کا سمیولیشن اسے بدل دیتا ہے؛ ایک وقتی لمحے کا حل اسے نہیں بدلتا، اور ترمیم پچھلی رپورٹ کو برقرار رکھتی ہے۔';
$ec_lang['lpn_guide_text_status_box']='آخری توسیعی مدت کے سمیولیشن کے دوران ہر تبدیلی کو وقت کی ترتیب میں درج کرتا ہے: پمپ، والو یا پائپ کا کھلنا یا بند ہونا، ٹینک کا بھرنا یا خالی ہونا شروع ہونا یا بھر جانا یا خالی ہو جانا، اور کوئی بھی وقتی مرحلہ جو مکمل طور پر ہم آہنگ نہیں ہوا۔ صرف تبدیلیاں درج ہوتی ہیں، ہر وقتی مرحلہ نہیں۔';
$ec_lang['lpn_guide_text_full_box']='ہر رپورٹنگ وقتی مرحلے پر ہر نوڈ اور ہر لنک کو، جدولوں کے پینل میں دکھائی گئی اکائیوں میں، درج کرتا ہے۔ توسیعی مدت کے سمیولیشن کے بغیر یہ ایک وقتی لمحے کا موجودہ حل دکھاتا ہے۔ ڈاؤن لوڈ یا پرنٹ میں ہر وقتی مرحلہ شامل ہوتا ہے، اور جدول ایک وقت میں ایک دکھاتا ہے۔';
$ec_lang['lpn_guide_text_calib_box']='میدانی پیمائشوں کی فائل کا انہی مقامات اور اوقات پر حساب شدہ نتائج سے موازنہ کرتا ہے، ہر پیرامیٹر کے لیے ایک فائل۔ فائل صرف موجودہ سیشن کے لیے رکھی جاتی ہے اور پراجیکٹ کے ساتھ محفوظ نہیں ہوتی۔';
$ec_lang['lpn_guide_text_hotkeys_popup']='صارف رہنما۔ اس کے حصے یہ ہیں: صارف رہنما کا استعمال، ٹول بار، مینو، نقشہ، اسکرین شاٹ، جدول، باکس، اس حاسبہ کے بارے میں، اور اس صفحے پر نوٹس۔ ٹول بار اور مینو ہر ٹول بار بٹن اور مینو قطار کو اس کے کی بورڈ شارٹ کٹ کے ساتھ درج کرتے ہیں، باکس میں ہر باکس کا ایک اندراج ہے، اور باقی حصے بتاتے ہیں کہ صفحہ کیا کرتا ہے۔ کسی قطار کو چننے سے دکھایا جاتا ہے کہ وہ کنٹرول کہاں ہے؛ یہ اسے کبھی چلاتا نہیں۔ تلاش کے لیے Ctrl+K دبائیں، یا صارف رہنما پر فوکس ہو تو / دبائیں۔ جب کوئی سوال کھلا ہو تو Ctrl+K تلاش نہیں کرتا۔';
// The Find and replace chapter beyond its opening paragraphs, in the Guide's Boxes section
// (Tom, 2026-10-07). Each _def is HTML: keep the tags. A query inside <code> runs as written in
// English on a page in any language; translate it with the words the Find box shows in your
// language, or leave it in English. Asset IDs (60, 247, 330) and the numbers are measured on Net1
// and Net3 by dev/lpn-spike/user-guide-find-harness.js: never change them in translation.
$ec_lang['lpn_guide_find_query_term']='کوئری کی زبان';
$ec_lang['lpn_guide_find_query_def']='<table class="lpn-notes-table"><tbody><tr><td><code>Scope.Property condition value</code></td><td>ایک شرط۔ کیا تلاش کرنا ہے: سب کچھ، جنکشن، ریزروائر، ٹینک، پائپ، پمپ، والو، متن، گاہک یا سورس۔ خاصیت اس کے لیے خاصیت کی فہرست کا کوئی بھی اندراج ہے۔</td></tr><tr><td>شرائط</td><td>کے برابر ہو، سے بڑا ہو، سے چھوٹا ہو، میں شامل ہو، زیادہ ترین n، کم ترین n، خالی۔ میں شامل ہو صرف متن پر لاگو ہوتا ہے۔ زیادہ ترین n اور کم ترین n میں n ایک تعداد ہے، جیسے زیادہ ترین 5۔ حرف n خود لکھنے پر، جیسے <code>Pipe.Velocity n highest</code>، یا قدر کا خانہ خالی ہونے پر، 10 عناصر درج ہوتے ہیں۔ خالی وہ عناصر تلاش کرتا ہے جن کی اس خاصیت کی کوئی قدر نہیں۔ رابطے کی چار شرطیں ہیں اور کوئی قدر نہیں لیتی۔</td></tr><tr><td>قدریں</td><td>عدد بغیر اکائی کے، اس اکائی میں درج کیا جاتا ہے جو خصوصیات میں اور جدولوں کے پینل پر دکھائی گئی ہے: 40، نہ کہ 40 psi۔ متن، بشمول ID، اکہرے یا دوہرے کوٹیشن میں لکھا جاتا ہے: <code>\'60\'</code>۔</td></tr><tr><td>"اور"، "یا" اور قوسین</td><td>"اور" کا حساب "یا" سے پہلے ہوتا ہے، اور قوسین شرائط کو گروپ کرتی ہیں۔ NOT دستیاب نہیں۔</td></tr><tr><td>ہجے</td><td>الفاظ میں بڑے اور چھوٹے حروف کا فرق نہیں ہوتا۔ انگریزی الفاظ ہر زبان میں قبول کیے جاتے ہیں، اس لیے اس رہنما سے کاپی کی گئی کوئری کسی بھی زبان کے صفحے پر چلتی ہے۔</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_examples_term']='Net3 پر مثالیں';
$ec_lang['lpn_guide_find_examples_def']='<p>انہیں دیکھنے کے لیے Net3 مثال کھولیں۔ دباؤ psi میں اور رفتار ft/s میں ہے۔</p><table class="lpn-notes-table"><tbody><tr><td><code>Everything.ID equal to \'60\'</code></td><td>جنکشن 60 اور پائپ 60۔ ایک جنکشن اور ایک پائپ کی ID ایک ہو سکتی ہے، اس لیے سب کچھ کے تحت ID کی تلاش ایک سے زیادہ عنصر واپس کر سکتی ہے۔</td></tr><tr><td><code>Junction.Pressure below 40</code></td><td>جنکشن 10، 40، 50، 20 اور 153، کم ترین دباؤ پہلے۔ جنکشن 10 پر -0.6 psi ہے، ایک منفی دباؤ جس کا جائزہ لینا ضروری ہے۔</td></tr><tr><td><code>Pipe.Velocity 5 highest</code></td><td>پائپ 60، 125، 329، 123 اور 149، بلند ترین رفتار پہلے۔ پائپ 60 میں 9.3 ft/s ہے۔</td></tr><tr><td><code>Junction.Pressure below 20 OR Pipe.Velocity above 5</code></td><td>جنکشن 10، 20، 40 اور 50، اور پائپ 60، 125 اور 329: کم دباؤ اور زیادہ رفتار ایک ہی فہرست میں۔</td></tr><tr><td><code>Junction.Pressure below 40 AND Junction.Elevation above 100</code></td><td>جنکشن 10، 20، 40 اور 50، بلند زمین پر کم دباؤ۔ دونوں شرائط میں ایک ہی قسم کا عنصر ہونا چاہیے: <code>Junction.Pressure below 40 AND Pipe.Velocity above 3</code> کسی چیز سے مطابقت نہیں رکھتا، کیونکہ کوئی عنصر بیک وقت جنکشن اور پائپ نہیں ہوتا۔</td></tr><tr><td><code>Pipe.Closed equal to \'closed\'</code></td><td>پائپ 330، وہ واحد پائپ جو Net3 فائل میں بند ہے۔</td></tr><tr><td><code>Junction.Connectivity no open path to a source</code></td><td>فائل جیسی تقسیم کی گئی ہے اس میں کچھ نہیں۔ پائپ 247 بند ہونے پر (بدلیں اور کالعدم کریں دیکھیں)، جنکشن 215، 217، 219 اور 225: وہ جنکشن جنہیں پائپ 247 پر ٹوٹ پھوٹ بغیر سپلائی چھوڑ دے گی۔ اسے ہر پائپ کے لیے دہرانا نازک پن کا تجزیہ ہے۔</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_results_term']='نتائج، انتخاب اور جدولیں';
$ec_lang['lpn_guide_find_results_def']='<p>مطابقت رکھنے والے عناصر تلاش کریں بٹن کے نیچے درج ہوتے ہیں۔ زیادہ ترین n اور سے بڑا ہو سب سے زیادہ قدر پہلے درج کرتے ہیں، سے چھوٹا ہو اور کم ترین n سب سے کم قدر پہلے، اور دوسری شرائط ملی ہوئی قدر کے مطابق، پھر ID کے مطابق۔ "اور" یا "یا" والی کوئری پہلے نوڈز، پھر لنکس درج کرتی ہے، ہر ایک ID کے مطابق۔ ایک ہی مطابقت نقشے پر فوراً دکھائی جاتی ہے۔ نقشے کو اس عنصر پر مرکوز کرنے کے لیے قطار منتخب کریں۔ اگر کچھ منتخب نہ ہو تو وہ عنصر بھی منتخب ہو جاتا ہے؛ اگر کچھ منتخب ہو تو عنصر نمایاں ہوتا ہے اور انتخاب تبدیل نہیں ہوتا۔ انتخاب میں شامل کرنے یا ہٹانے کے لیے قطار پر Shift+کلک یا Ctrl+کلک کریں۔ تلاش خود تمام مطابقتوں کو منتخب نہیں کرتی۔</p><p>موجودہ جدول میں فلٹر کریں بٹن وہی کوئری جدولوں کے پینل پر لاگو کرتا ہے۔ جس جدول پر کوئری لاگو ہوتی ہے وہ صرف مطابق قطاریں دکھاتا ہے، ان کے اوپر کوئری اور قطاروں کی تعداد کے ساتھ۔ نقشے پر تمام مطابقتوں کو منتخب کرنے کے لیے وہ قطاریں منتخب کریں اور رائٹ کلک مینو سے نقشے پر منتخب کریں چنیں۔ جدول کا فلٹر پراجیکٹ کے ساتھ محفوظ نہیں ہوتا اور صفحہ دوبارہ لوڈ ہونے پر ختم ہو جاتا ہے۔ جس قطار میں ایسی ترمیم کی جائے کہ وہ مزید مطابقت نہ رکھے، وہ جدول میں مدھم اور انتباہی نشان کے ساتھ رہتی ہے جب تک موجودہ جدول میں فلٹر کریں بٹن دوبارہ نہ دبایا جائے۔</p>';
$ec_lang['lpn_guide_find_replace_term']='بدلیں اور کالعدم کریں';
$ec_lang['lpn_guide_find_replace_def']='<p>باکس کا جو ملا اسے بدلیں حصہ کوئری کو ملنے والے ہر عنصر پر ایک خاصیت لکھتا ہے۔ بدلنے کے لیے خاصیت کی فہرست میں خاصیت چنیں، نئی قدر کے خانے میں نئی قدر دکھائی گئی اکائی میں درج کریں، اور بدلیں بٹن دبائیں۔ باکس پھر بتاتا ہے کہ کتنے عناصر بدلیں گے، ان کو شمار کیے بغیر جن کی قدر پہلے ہی نئی قدر ہے۔ تبدیلی لاگو کرنے کے لیے انہیں بدلیں بٹن دبائیں، یا منسوخ کریں۔ ایک بار کالعدم کرنے سے پوری تبدیلی واپس ہو جاتی ہے۔</p><p>Net1 پر مثال: <code>Pipe.Diameter below 10</code> پائپ 31، 122، 113 اور 121 تلاش کرتا ہے۔ قطر چنیں، 10 درج کریں، اور بدلیں دبائیں؛ باکس "4 عناصر بدلیں؟" دکھاتا ہے۔ چاروں پائپ 10 in. پر مقرر کرنے کے لیے انہیں بدلیں دبائیں۔ ایک بار کالعدم کرنے سے وہ 6 اور 8 in. پر واپس آ جاتے ہیں۔</p><p>Net3 پر مثال: <code>Pipe.ID equal to \'247\'</code> پائپ 247 تلاش کرتا ہے۔ بند چنیں، نئی قدر کی فہرست میں بھی بند چنیں، اور بدلیں، پھر انہیں بدلیں دبائیں، تاکہ اوپر کی رابطے کی مثال کے لیے پائپ بند ہو جائے۔ کالعدم کرنے سے وہ دوبارہ کھل جاتا ہے۔</p><p>بدلنے کے لیے ایک ہی قسم کا عنصر درکار ہے، اس لیے سب کچھ کے تحت پہلے کیا تلاش کرنا ہے کی فہرست میں عنصر کی قسم چنیں۔ بنیاد کے علاوہ کسی منظرنامے میں تبدیلی اسی منظرنامے میں محفوظ ہوتی ہے، جیسے خصوصیات میں وہی ترمیم ہوتی۔ جہاں Mapbox بلندیاں دستیاب ہوں، بلندی کو ٹائپ کی گئی قدر کے بجائے Mapbox DEM سے بدلا جا سکتا ہے۔</p>';
$ec_lang['lpn_guide_find_notes_def']='<ul><li>قدروں کا موازنہ پوری درستگی سے ہوتا ہے اور چار اعشاریہ تک درج کی جاتی ہیں۔ کے برابر ہو حساب شدہ نتیجے سے شاذ ہی مطابقت رکھتا ہے؛ سے بڑا ہو اور سے چھوٹا ہو استعمال کریں۔</li><li>دباؤ، ہیڈ، بہاؤ، رفتار اور دوسرے نتائج آخری حساب کے ہیں۔ خود بخود دوبارہ حل کریں ترتیب بند ہو تو وہ نیٹ ورک کو ویسا ہی بیان کرتے ہیں جیسا آخری حل کریں پر تھا۔</li><li>متن پر سے بڑا ہو اور سے چھوٹا ہو لغت کی ترتیب استعمال کرتے ہیں، اعداد عددی ترتیب میں: Net1 پر <code>Junction.ID above \'20\'</code> جنکشن 21، 22، 23، 31 اور 32 تلاش کرتا ہے۔</li><li>سب کچھ کے تحت صرف ID، تفصیل، ٹیگ اور رابطہ پیش کیے جاتے ہیں۔ پوری فہرست دیکھنے کے لیے کیا تلاش کرنا ہے کی فہرست میں عنصر کی قسم چنیں۔</li><li>متن کے آئٹم کی کوئی ID نہیں ہوتی۔ اسے اس کے الفاظ سے تلاش کریں، جیسے <code>Text.Text contains \'pump\'</code>۔</li><li>نوڈ کے لیے رابطے کی چار شرطیں یہ ہیں: نوڈ پر کوئی لنک نہیں، نوڈ پر کوئی کھلا لنک نہیں، کسی ذریعہ تک لنک کا کوئی راستہ نہیں، اور کسی ذریعہ تک کوئی کھلا راستہ نہیں۔ ذریعہ ریزروائر یا ٹینک ہے۔</li></ul>';
// The Scenarios chapter, in the entry for the Scenario manager box (Task 785). Written from the code of
// feat/bentley-interop and held by dev/lpn-spike/user-guide-scenarios-harness.js. The box's own help
// (lpn_sm_help, Tom's wording of 2026-10-16) comes first in the entry; nothing here restates or
// contradicts it. Terms follow the Find and replace chapter's pattern.
$ec_lang['lpn_guide_scn_use_term']='منظرنامہ کس کام کے لیے ہے';
$ec_lang['lpn_guide_scn_use_def']='<p>منظرنامے ایک ہی پراجیکٹ میں بہت سے ڈیزائن، منظر یا صورتیں محفوظ کرتے ہیں، جیسے اوسط دن، زیادہ سے زیادہ دن، چوٹی کا گھنٹہ، رپورٹ میں پیش کرنے کی شکل، کوئی مین بند ہونا، یا مجوزہ تبدیلی۔ نیٹ ورک ایک بار بنیاد منظرنامے میں بنایا جاتا ہے۔ ہر دوسرا منظرنامہ صرف اپنی قدریں رکھتا ہے، یعنی وہ قدریں جو اس منظرنامے سے مختلف ہیں جس سے وہ وراثت لیتا ہے، اور باقی سب کچھ اسی منظرنامے سے پڑھتا ہے۔ اس لیے بنیاد میں کی گئی ترمیم ہر اس منظرنامے تک پہنچتی ہے جس نے وہ قدر اپنی نہیں کی۔</p><p>نیا پراجیکٹ چھ تیار منظرناموں کے ساتھ شروع ہوتا ہے: 1. فلو ٹیسٹ: جامد، 2. فلو ٹیسٹ: درمیانہ، 3. فلو ٹیسٹ: زیادہ سے زیادہ، 4. اوسط دن، 5. زیادہ سے زیادہ دن، اور 6. عروجی گھنٹہ۔ یہ عام منظرنامے ہیں جن کا نام بدلا، جنہیں ایڈٹ اور حذف کیا جا سکتا ہے۔ ہر ایک ایک اپنی قدر کے ساتھ شروع ہوتا ہے، یعنی اس کا طلب کا ضرب: فلو ٹیسٹ اور اوسط دن کے لیے 1، زیادہ سے زیادہ دن کے لیے 2، اور عروجی گھنٹہ کے لیے 3۔ یہ ضرب عارضی قدریں ہیں جنہیں اس نظام کی قدروں سے بدلا جانا چاہیے جس کا ماڈل بنایا جا رہا ہے۔ فائل سے کھولا گیا پراجیکٹ، بشمول ہر مثال، یا EPANET فائل سے درآمد کیا گیا پراجیکٹ صرف بنیاد رکھتا ہے۔</p><p>فائر فلو کی جانچ فائر فلو تجزیے سے ہوتی ہے، جو ہر جنکشن کو یا منتخب جنکشنز کو آزماتا ہے۔ زیادہ سے زیادہ دن وہ منظرنامہ ہے جو عام طور پر اسے چلاتے وقت کھلا ہوتا ہے۔</p>';
$ec_lang['lpn_guide_scn_open_term']='کھلا ہوا منظرنامہ';
$ec_lang['lpn_guide_scn_open_def']='<p>نقشے کے نیچے حالت کی پٹی میں منظرنامہ بٹن کھلے ہوئے منظرنامے کا نام بتاتا ہے اور اس کی اپنی قدریں گنتا ہے، جیسے منظرنامہ: بنیاد | اپنی قدروں کی تعداد: 0۔ منظرنامے بدلنے، یا کوئی منظرنامہ شامل کرنے، کاپی کرنے، نام بدلنے یا حذف کرنے کے لیے اس پر کلک کریں، یا پانی، منظرنامے چنیں۔ فہرست میں ہر منظرنامے کے ساتھ قوسین میں اس کی اپنی قدروں کی تعداد دکھائی جاتی ہے، اور کھلے ہوئے پر ٹک کا نشان ہوتا ہے۔ منظرنامہ مینیجر کی قطار منظرناموں اور متبادلات کا درخت کھولتی ہے۔ جب بنیادی موڈ نشان زد ہو تو یہ مدھم رہتی ہے۔</p><p>ڈرائنگ، لیبلز، خصوصیات، جدول اور نتائج سب کھلے ہوئے منظرنامے کے ہیں، اور صفحہ صرف کھلے ہوئے منظرنامے کو حل کرتا ہے۔ منظرنامہ موازنہ، جو اپنے اندراج میں بیان ہے، باقی کو کاپیوں سے حل کرتا ہے۔ کھلا ہوا منظرنامہ پراجیکٹ کے ساتھ محفوظ ہوتا ہے۔</p>';
$ec_lang['lpn_guide_scn_marks_term']='اپنی قدریں کہاں دکھائی دیتی ہیں';
$ec_lang['lpn_guide_scn_marks_def']='<p>نقشے پر وہ اثاثہ جس کی کھلے ہوئے منظرنامے میں اپنی قدر ہو عنبری رنگ کے حلقے میں ہوتا ہے، اور وہ اثاثہ جو والد منظرنامے یا متبادل سے کوئی اپنی قدر وراثت میں لے، ٹوٹی ہوئی سرمئی لکیر کے حلقے میں۔ طلب، قطر، کھردرے پن، مقامی نقصان (minor loss) کے عددی سر، اور لمبائی کے لیے حلقہ صرف تب نظر آتا ہے جب ترتیبات، بصری پیشکش، نوڈ لیبلز یا لنک لیبلز نقشے پر وہ قدر دکھا رہے ہوں؛ کسی بھی دوسری خاصیت کی اپنی قدر کا حلقہ ہمیشہ ہوتا ہے۔ جدولوں میں جس خانے میں کھلے ہوئے منظرنامے کی مقرر کردہ قدر ہو وہ عنبری ہوتا ہے، اور اس کی ٹپ اس متبادل کا نام بتاتی ہے جس میں وہ ہے، جیسے Physical alt.: Larger main۔ جدول کے خانے کے مینو میں منظرنامے دکھائیں ہر اثاثے کو ہر منظرنامے کے لیے ایک بار درج کرتا ہے۔</p><p>خصوصیات کی ہر وہ قطار جسے منظرنامہ اپنی قدر سے بدل سکتا ہے، اس کے بائیں طرف ایک نشان رکھتی ہے۔ ٹھوس نقطے کا مطلب ہے کہ کھلا ہوا منظرنامہ قدر کو اپنی قدر سے بدلتا ہے؛ اپنی قدر ہٹانے کے لیے اس پر کلک کریں۔ کھوکھلے نقطے کا مطلب ہے کہ قدر وراثت میں ملی ہے؛ دکھائی گئی قدر کو اپنی قدر بنانے کے لیے اس پر کلک کریں۔ تکون کا مطلب ہے کہ اس سے نیچے کے منظرنامے قدر کو اپنی قدر سے بدلتے ہیں؛ تصدیق کے بعد ان کی اپنی قدریں ہٹانے کے لیے اس پر کلک کریں۔ بدلی ہوئی قطار کے نیچے وہ وراثتی قدر ہوتی ہے جس کی جگہ اس نے لی ہے، جیسے Base scenario: 18۔ ترتیبات کے باکس میں صرف ٹھوس نقطہ اور تکون ہوتے ہیں، کیونکہ وہاں قدر لکھنا ہی اپنی قدر بناتا ہے۔</p><p>حلقے چھپانے کے لیے ترتیبات، نقشہ اور صفحہ، صفحہ میں نقشے پر اپنی قدر کے نشانات دکھائیں سے نشان ہٹائیں، یا نقشہ، صاف نقشہ چنیں۔ دونوں اسی براؤزر میں رکھے جاتے ہیں، پراجیکٹ میں نہیں۔ جدول دونوں صورتوں میں اپنی قدروں کو نشان زد کرتا ہے۔</p>';
$ec_lang['lpn_guide_scn_make_term']='اپنی قدریں بنانا اور ہٹانا';
$ec_lang['lpn_guide_scn_make_def']='<p>جب بنیاد کے سوا کوئی منظرنامہ کھلا ہو تو ایسی قدر میں ترمیم جسے منظرنامے بدل سکتے ہیں، کھلے ہوئے منظرنامے میں اپنی قدر کے طور پر محفوظ ہوتی ہے، چاہے وہ جیسے بھی کی جائے: خصوصیات میں لکھ کر، جدول کے خانے میں ترمیم سے، تلاش اور تبدیلی میں بدلیں سے، نوڈ کو گھسیٹ کر یا اس کے نقاط درج کر کے، قسم تبدیل کریں سے (نئی قسم اپنی قدر ہوتی ہے)، یا منتخب پر خصوصیات پیسٹ کریں سے۔ ترتیبات کے باکس میں لکھی گئی ترتیب، جب منظرنامے اس ترتیب کو بدل سکتے ہوں، اپنی قدر کے طور پر محفوظ ہوتی ہے۔ بنیاد نہیں بدلتی۔ بنیاد میں یہی ترامیم خود نیٹ ورک کو بدلتی ہیں اور ہر اس منظرنامے تک پہنچتی ہیں جس نے وہ قدر اپنی نہیں کی۔</p><p>حذف کریں مختلف طرح سے کام کرتا ہے۔ کسی منظرنامے میں، حذف کریں اس اثاثے کو نہیں ہٹاتا جو بنیاد میں موجود ہے۔ یہ اثاثے کو کھلے ہوئے منظرنامے میں غیر فعال کر دیتا ہے، اور نوڈ کی صورت میں اس کے پائپوں کو بھی، اور ایک پیغام یہ بتاتا ہے۔ اثاثہ پھر بھی ڈرائنگ میں اور دوسرے منظرناموں میں رہتا ہے۔ جو اثاثہ منظرنامہ کھلا ہونے کی حالت میں بنایا جائے وہ بنیاد میں غیر فعال اور اس منظرنامے میں فعال ہوتا ہے، اور اس منظرنامے میں حذف کریں اسے ہٹا دیتا ہے۔ بنیاد میں اثاثہ حذف کرنے سے ہر منظرنامے میں اس کی اپنی قدریں بھی حذف ہو جاتی ہیں، ایک ایسے سوال کے بعد جو انہیں گنتا ہے۔ گاہک اور شکلیں کسی منظرنامے کے نہیں ہوتے اور براہ راست حذف ہوتے ہیں۔</p><p>منظرناموں کی فہرست کی اپنی قدروں کا مینیجر کی قطار کھلے ہوئے منظرنامے کی ہر اپنی قدر کی فہرست زمرے کے مطابق کھولتی ہے، ہر ایک اس وراثتی قدر کے ساتھ جس کی جگہ اس نے لی ہے۔ نقشے پر وقتی سلسلے کا گراف جسے منظرنامے نے کھولا، منتقل کیا یا بدلا، اپنی الگ قطار ہے۔ قطاروں پر نشان لگائیں اور منتخب اپنی قدریں ہٹائیں پر کلک کریں، یا ایک قطار میں اپنی قدر ہٹائیں پر کلک کریں، یا تمام اپنی قدریں ہٹائیں پر کلک کریں۔ پھر ہر قدر وراثتی قدر پر لوٹ آتی ہے، اور کالعدم کریں اسے واپس کر دیتا ہے۔ فہرست میں کوئی ID چن کر نقشے پر اس اثاثے تک جائیں۔ خصوصیات کا نقطہ اور جدولوں کے خانے کے مینو کی اپنی قدر ہٹائیں کی قطار ایک وقت میں ایک اپنی قدر ہٹاتے ہیں۔</p>';
$ec_lang['lpn_guide_scn_scope_term']='منظرنامہ کیا بدل سکتا ہے اور کیا نہیں';
$ec_lang['lpn_guide_scn_scope_def']='<table class="lpn-notes-table"><tbody><tr><td>خصوصیات</td><td>نوڈ یا لنک کی ہر خاصیت سوائے ان کے جو نیچے درج ہیں، بشمول اس کی جگہ، اس کا فعال ہونا، اور اس کی قسم (قسم تبدیل کریں)۔ متن اپنے الفاظ، جگہ، سائز، صف بندی، بولڈ، زاویہ، اور دکھایا جانا بدل سکتا ہے۔ حسب ضرورت خاصیت ہمیشہ بدلی جا سکتی ہے۔ خصوصیات ان زمروں میں رکھی گئی ہیں: طبعی، طلب، فعال ٹوپولوجی، ابتدائی ترتیبات، جزو، فائر فلو، توانائی کی لاگت، حسب ضرورت خصوصیات، متن، پیشکش، اور حساب۔</td></tr><tr><td>ترتیبات</td><td>پراجیکٹ کے ساتھ محفوظ ترتیبات، سوائے ان کے جو نیچے درج ہیں: حساب کے آپشنز (مثلاً طلب کا ضرب، کل رن کا وقت، ہائیڈرالک ٹائم اسٹیپ، اور رگڑ کا طریقہ)، ڈیفالٹ طلب پیٹرن، نئے اثاثوں کو دی جانے والی قدریں، اور پیشکش کی ترتیبات (سائز، رنگ، لیبلز، کنٹور، نقشے کا منظر، اور نقشے پر وقتی سلسلے کے گراف)۔</td></tr><tr><td>ہر منظرنامے میں ایک جیسا</td><td>اثاثے کی ID، تفصیل اور ٹیگ؛ لنک کے سرے کے نوڈ اور موڑ؛ گاہک اور شکلیں؛ اکائیاں اور نقاط کا نظام؛ اور لائبریریوں کا مواد (پیٹرن، وکر، پائپ کی اقسام، فٹنگز کی فہرستیں، کنٹرولز اور قواعد)۔ ان میں سے کسی میں ترمیم ہر منظرنامے کو بدل دیتی ہے۔ منظرنامہ کسی اثاثے کو مختلف وکر، پائپ کی قسم، فٹنگز کی فہرست یا پیٹرن کی طرف اشارہ کروا سکتا ہے، لیکن ان کے اندر کا مواد نہیں بدل سکتا۔</td></tr></tbody></table>';
$ec_lang['lpn_guide_scn_example_term']='Net1 پر مثال';
$ec_lang['lpn_guide_scn_example_def']='<p>Net1 کی مثال کھولیں۔ پانی، منظرنامے، نیا منظرنامہ… چنیں، Larger main لکھیں، اور ٹھیک ہے پر کلک کریں۔ نقشے پر پائپ 10 منتخب کریں اور خصوصیات میں قطر کے لیے 24 درج کریں؛ بنیاد میں 18 in. ہے، جو خانے کے نیچے Base scenario: 18 کے طور پر دکھایا گیا ہے۔ منظرناموں کی فہرست میں بنیاد چنیں، دوبارہ نیا منظرنامہ… چنیں، Max day لکھیں، اور ترتیبات، حساب، ہائیڈرالکس میں طلب کے ضرب کے لیے 1.8 درج کریں۔ پھر پانی، رپورٹس، منظرنامہ موازنہ چنیں۔</p><table class="lpn-notes-table"><tbody><tr><td>منظرنامہ</td><td>اپنی قدروں کی تعداد</td><td>طلب کا ضرب</td><td>سب سے کم دباؤ</td><td>سب سے زیادہ رفتار</td></tr><tr><td>بنیاد</td><td>0</td><td>1</td><td>108 psi at N32, 14:00</td><td>2.76 ft/sec at L11, 16:00</td></tr><tr><td>Larger main</td><td>1</td><td>1</td><td>109 psi at N32, 14:00</td><td>2.87 ft/sec at L11, 16:00</td></tr><tr><td>Max day</td><td>1</td><td>1.8</td><td>15.78 psi at N32, 9:00</td><td>3.49 ft/sec at L10, 9:00</td></tr></tbody></table><p>تینوں میں کل رن کا وقت 24:00 ہے، اس لیے ہر سب سے کم دباؤ اور سب سے زیادہ رفتار پورے دن کی انتہا ہے، دکھائے گئے وقت پر۔ بڑا مین سب سے کم دباؤ کو تقریباً 1 psi بڑھاتا ہے۔ 1.8 کا ضرب اسے 9:00 پر 15.78 psi تک گھٹا دیتا ہے، اور سب سے زیادہ رفتار پائپ 10 پر چلی جاتی ہے۔ ہر منظرنامہ ایک اپنی قدر رکھتا ہے، اور بنیاد اپنی قدریں برقرار رکھتی ہے۔</p>';
$ec_lang['lpn_guide_scn_notes_term']='قابل ذکر نکات';
$ec_lang['lpn_guide_scn_notes_def']='<ul><li>وراثتی قدر کے برابر اپنی قدر پھر بھی اپنی قدر ہے۔ اسے گنا جاتا ہے، اور اپنی قدروں کا مینیجر اسے (same) سے نشان زد کرتا ہے۔</li><li>بنیادی موڈ اس براؤزر کی ترتیب ہے، پراجیکٹ کی نہیں۔ ایسے پراجیکٹ کے لیے یہ غیر فعال ہوتا ہے جس کے منظرنامے اور متبادلات کو یہ دکھا نہیں سکتا۔ متبادلات اور منظرنامہ مینیجر اس اندراج کے شروع کی مدد میں بیان ہیں۔</li><li>کالعدم کریں 20 مراحل رکھتا ہے۔ ہر مرحلہ ڈرائنگ کے ساتھ منظرناموں اور کھلے ہوئے منظرنامے کو بھی بحال کرتا ہے، اس لیے منظرنامہ شامل کرنا، نام بدلنا اور حذف کرنا کالعدم ہو سکتا ہے۔</li><li>EPANET فائل برآمد کرنا صرف کھلے ہوئے منظرنامے کو لکھتا ہے، ان قدروں اور نوڈ کی جگہوں کے ساتھ جو وہ منظرنامہ پڑھتا ہے۔ منظرنامے خود صرف پراجیکٹ فائل میں درج ہوتے ہیں۔</li></ul>';
// The Scenario comparison chapter beyond its opening paragraphs (lpn_guide_text_scncmp_box), copied into
// the box's entry by renderGuideBoxes() from <template id="lpn_guide_more_lpn_scncmp_box">. Task 785.
$ec_lang['lpn_guide_cmp_cols_term']='جدول میں کیا ہے';
$ec_lang['lpn_guide_cmp_cols_def']='<table class="lpn-notes-table"><tbody><tr><td>منظرنامہ</td><td>منظرنامے کا نام۔ کھلے ہوئے منظرنامے پر (فی الحال کھلا) کا نشان ہوتا ہے۔</td></tr><tr><td>اپنی قدروں کی تعداد</td><td>خود منظرنامے کی اپنی قدریں، جیسے منظرناموں کی فہرست میں گنی جاتی ہیں۔ طلب کے ضرب جیسا حساب کا آپشن ایک گنا جاتا ہے، اور وراثتی قدر کے برابر اپنی قدر بھی گنی جاتی ہے۔</td></tr><tr><td>طلب کا ضرب، کل رن کا وقت، ہائیڈرالک ٹائم اسٹیپ</td><td>وہ قدریں جن کے تحت منظرنامہ حل ہوا، چاہے اس کی اپنی ہوں یا پراجیکٹ کی۔ مستقل حالت کا منظرنامہ ٹائم اسٹیپ کی جگہ ڈیش دکھاتا ہے۔</td></tr><tr><td>سب سے کم دباؤ</td><td>کسی جنکشن پر سب سے کم دباؤ، اس کی ID اور اس کے واقع ہونے کے وقت کے ساتھ۔ ریزروائر اور ٹینک شامل نہیں کیے جاتے کیونکہ ہر ایک کا ہیڈ مقرر ہوتا ہے۔</td></tr><tr><td>سب سے زیادہ رفتار</td><td>کسی پائپ یا والو میں سب سے زیادہ رفتار، اس کی ID اور اس کے واقع ہونے کے وقت کے ساتھ۔ پمپ شامل نہیں کیے جاتے۔</td></tr></tbody></table>';
$ec_lang['lpn_guide_cmp_run_term']='مستقل حالت اور توسیعی مدت کے منظرنامے';
$ec_lang['lpn_guide_cmp_run_def']='<p>جس منظرنامے کا کل رن کا وقت 0 سے زیادہ ہو، وہ پوری مدت کے لیے EPANET انجن کے ذریعے چلایا جاتا ہے۔ اس کا سب سے کم دباؤ اور سب سے زیادہ رفتار ہر ٹائم اسٹیپ کی انتہائیں ہیں، ہر ایک اپنے وقت کے ساتھ دکھائی جاتی ہے۔ جس منظرنامے کا کل رن کا وقت 0 ہو وہ ایک لمحے پر حل ہوتا ہے۔ کل رن کا وقت ان آپشنز میں سے ہے جنہیں منظرنامہ اپنی قدر سے بدل سکتا ہے، اس لیے ایک جدول میں دونوں قسمیں ہو سکتی ہیں۔</p>';
$ec_lang['lpn_guide_cmp_notes_def']='<ul><li>جو منظرنامہ حل نہ ہو سکے وہ اپنے دو نتائج کی جگہ وجہ دکھاتا ہے، مثلاً یہ کہ کوئی پائپ غیر فعال کرنے کے بعد کسی جنکشن کا سورس تک کوئی راستہ نہیں رہا۔ باقی منظرنامے پھر بھی حل ہوتے ہیں۔ جو منظرنامہ converge نہ ہوا ہو وہ اپنے آخری نتائج اور ایک پیغام دکھاتا ہے۔</li><li>جدول کے اوپر کا بلاک، ہر منظرنامے میں ایک جیسا، رگڑ کا طریقہ، اکائیاں، درستگی اور زیادہ سے زیادہ کوششیں بتاتا ہے۔ جو ترتیب منظرناموں میں مختلف ہو وہ بلاک سے چھوڑ دی جاتی ہے۔</li><li>پاس یا فیل کی کوئی حد نہیں ہے۔ اعداد کو اس نظام کے ڈیزائن معیار کے مقابل پڑھیں جس کا ماڈل بنایا جا رہا ہے۔</li><li>منظرنامہ مینیجر کے اندراج میں دی گئی مثال Net1 پر تین منظرناموں کا موازنہ کرتی ہے۔</li></ul>';
// The Libraries chapter, in the entry for the Libraries box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_library_box">. Written from the code and held by
// dev/lpn-spike/user-guide-library-harness.js.
$ec_lang['lpn_guide_lib_kinds_term']='ہر حصے میں کیا ہے';
$ec_lang['lpn_guide_lib_kinds_def']='<table class="lpn-notes-table"><tbody><tr><td>پیٹرن</td><td>ضرب کی ایک فہرست جو رن کے چلنے تک دہرائی جاتی ہے، ہر پیٹرن ٹائم اسٹیپ کے لیے ایک ضرب۔ نیا پیٹرن 1 کے 24 ضرب ہوتا ہے۔ اسپریڈشیٹ کا کالم پیسٹ کرنے سے ضرب کا باکس بھر جاتا ہے۔ ڈیفالٹ طلب پیٹرن پر (default) کا نشان ہوتا ہے اور اسے ترتیبات، حساب، ہائیڈرالکس میں چنا جاتا ہے۔</td></tr><tr><td>وکر</td><td>چار قسمیں، جو وکر کی قسم کے طور پر چنی جاتی ہیں: پمپ ہیڈ، پمپ کی کارکردگی، ٹینک کا حجم، اور والو کا ہیڈ نقصان۔ نقطے ایک گرڈ میں درج کیے جاتے ہیں جو اسپریڈشیٹ کا پیسٹ کیا ہوا کالم یا EPANET فائل سے نقل کی گئی سطریں قبول کرتا ہے۔ پمپ ہیڈ وکر اپنے نقطوں سے فٹ کیا جاتا ہے اور مساوات کی سطر فٹ دکھاتی ہے؛ ایک نقطے کو ڈیزائن نقطہ پڑھا جاتا ہے، جس میں بند ہونے پر ہیڈ اس کے ہیڈ کا 1.33334 گنا اور زیادہ سے زیادہ بہاؤ اس کے بہاؤ کا 2 گنا ہوتا ہے، جیسے EPANET اسے پڑھتا ہے۔ دوسری قسمیں اپنے نقطوں کو سیدھی لکیروں سے جوڑتی ہیں۔ پمپ یا والو اپنا وکر خصوصیات میں بتاتا ہے، جہاں وکر کا لنک اس حصے کو کھولتا ہے۔</td></tr><tr><td>پائپ کی اقسام</td><td>قطر، کھردرے پن اور ردعمل کے عددی سر کی تعریف جس کا حوالہ کئی پائپ دیتے ہیں۔ تعریف میں کوئی خاصیت خالی چھوڑی جا سکتی ہے اور پھر ہر پائپ کے لیے درج کی جا سکتی ہے۔ خصوصیات میں، وہ قدریں جو پائپ کی قسم بتاتی ہے غیر فعال ہوتی ہیں، اور پائپ کی قسم سے الگ کریں انہیں پائپ میں نقل کر دیتا ہے اور پائپ کو اس قسم کے استعمال سے روک دیتا ہے۔</td></tr><tr><td>فٹنگز</td><td>فٹنگز کی فہرستیں، ہر ایک کی مقدار کے ساتھ، جو پائپ یا پائپ کی قسم کے لیے ایک مقامی نقصان (minor loss) کے عددی سر، k، میں جمع کی جاتی ہیں۔ پیش کی جانے والی فٹنگز EPANET 2.2 صارف دستی کے جدول 3.3 کی تیرہ ہیں اور دیگر فٹنگ۔ ایک کو چننے سے اس کا عددی سر قطار میں نقل ہو جاتا ہے، جہاں اسے بدلا جا سکتا ہے۔</td></tr><tr><td>کنٹرولز</td><td>ہر ایک EPANET نحو میں ایک بیان، جیسے <code>LINK id OPEN IF NODE id BELOW value</code>۔ ہر ایک کے نیچے باکس بتاتا ہے کہ اسے سمجھا گیا یا نہیں۔</td></tr><tr><td>قواعد</td><td>ہر ایک کئی سطروں پر مشتمل، EPANET نحو میں: RULE، IF، AND، OR، THEN، ELSE، اور PRIORITY۔ ہر ایک کے نیچے باکس بتاتا ہے کہ اسے پڑھا گیا یا نہیں۔</td></tr></tbody></table>';
$ec_lang['lpn_guide_lib_refs_term']='نام بدلنا، حذف کرنا، اور آئٹم کا حوالہ کون دیتا ہے';
$ec_lang['lpn_guide_lib_refs_def']='<p>ID اس کے اپنے حصے میں بدلی جاتی ہے۔ خالی ID، یا ایسی ID جو اسی حصے میں پہلے سے استعمال ہو، قبول نہیں کی جاتی۔ کسی آئٹم کا نام بدلنے سے اس کے تمام حوالے منتقل ہو جاتے ہیں، بنیاد میں اور ہر منظرنامے میں۔ پیٹرن کے حوالے یہ ہیں: جنکشن کا طلب پیٹرن اور اس کے ہر طلب زمرے کا پیٹرن، گاہک کا طلب پیٹرن، ریزروائر کا ہیڈ پیٹرن، پمپ کا رفتار پیٹرن، اور ڈیفالٹ طلب پیٹرن۔</p><p>جو پیٹرن استعمال میں ہو اسے حذف کیا جا سکتا ہے، اور اس کا ہر حوالہ صاف ہو جاتا ہے۔ اگر وہ ڈیفالٹ طلب پیٹرن تھا تو ایک اطلاع بتاتی ہے کہ بغیر پیٹرن والے جنکشن اب کیا استعمال کرتے ہیں۔ جو وکر، پائپ کی قسم یا فٹنگز کی فہرست استعمال میں ہو وہ حذف نہیں ہوتی۔ پیغام ان اثاثوں کے نام بتاتا ہے جو اسے استعمال کرتے ہیں، اور پہلے ہر ایک کو دوسرا وکر دینا ہوگا، یا اسے قسم یا فہرست سے الگ کرنا ہوگا۔</p>';
$ec_lang['lpn_guide_lib_scn_term']='لائبریریاں اور منظرنامے';
$ec_lang['lpn_guide_lib_scn_def']='<p>لائبریریاں ہر منظرنامے میں ایک جیسی ہیں۔ منظرنامہ کسی اثاثے کو مختلف وکر، پائپ کی قسم، فٹنگز کی فہرست یا پیٹرن کی طرف اشارہ کروا سکتا ہے، جو اس اثاثے کی اپنی قدر ہے، لیکن آئٹم کا مواد اپنی قدر سے نہیں بدلا جاتا۔ پیٹرن، وکر، پائپ کی قسم، فٹنگز کی فہرست، کنٹرول یا قاعدے میں ترمیم اسے ہر منظرنامے کے لیے بدل دیتی ہے، چاہے کوئی بھی منظرنامہ کھلا ہو۔ ڈیفالٹ طلب پیٹرن آئٹم کے بجائے ایک ترتیب ہے، اور منظرنامہ اپنا رکھ سکتا ہے۔</p><p>جو کنٹرول یا قاعدہ ایسے اثاثے کا نام لے جو کھلے ہوئے منظرنامے میں غیر فعال ہو، اس منظرنامے کے رن میں نظرانداز کر دیا جاتا ہے، اور لائبریریوں کا باکس اسے درج کرتا ہے۔ جو ایسے اثاثے کا نام لے جو پراجیکٹ میں ہے ہی نہیں، وہ بھی انتباہ کے ساتھ نظرانداز ہوتا ہے۔</p>';
$ec_lang['lpn_guide_lib_ctl_term']='رن میں کنٹرولز اور قواعد';
$ec_lang['lpn_guide_lib_ctl_def']='<p>کنٹرول ایک بیان ہے۔ قاعدہ کئی سطروں کا ہے جو RULE سے شروع ہوتی ہیں۔ کلیدی الفاظ صفحے کی زبان جو بھی ہو انگریزی میں لکھے جاتے ہیں، اور اعداد پراجیکٹ کی اکائیوں میں ہوتے ہیں۔ کنٹرول شامل کریں نیٹ ورک سے بنے ہوئے بیان سے شروع کرتا ہے، جسے پھر مطلوبہ بیان میں ایڈٹ کیا جاتا ہے۔</p><p>کنٹرولز اور قواعد نتیجہ صرف توسیعی مدت کے سمولیشن میں بدلتے ہیں، یعنی جب کل رن کا وقت 0 سے زیادہ ہو۔ مستقل حالت کا حل ان میں سے کسی سے نہیں بدلتا۔ قواعد صرف EPANET انجن لاگو کرتا ہے۔ دونوں پراجیکٹ کے ساتھ محفوظ ہوتے ہیں اور EPANET فائل میں لکھے جاتے ہیں۔</p>';
$ec_lang['lpn_guide_lib_import_term']='دوسرے پراجیکٹ سے لائبریریاں درآمد کرنا';
$ec_lang['lpn_guide_lib_import_def']='<p>فائل، درآمد کریں…، لائبریریاں درآمد کریں… دوسری پراجیکٹ فائل کھولتا ہے اور اس سے پوری لائبریریاں اس پراجیکٹ میں نقل کرتا ہے۔ جس آئٹم کا نام یہاں پہلے سے استعمال ہو اسے چھوڑ دیا جاتا ہے اور درج کر دیا جاتا ہے، اس لیے یہاں پہلے سے موجود کچھ نہیں بدلتا۔ جب فائل اور پراجیکٹ کوئی مقدار مختلف اکائیوں میں بیان کرتے ہوں تو انتباہ دکھایا جاتا ہے، اور آئٹم جیسے لکھے ہیں ویسے درآمد ہوتے ہیں۔ جو پائپ کی اقسام ایسی فٹنگز کی فہرست کا حوالہ دیں جو اس پراجیکٹ میں نہیں، وہ درج کی جاتی ہیں؛ انہیں حل کرنے کے لیے اسی فائل سے فٹنگز کی لائبریری درآمد کریں۔</p>';
$ec_lang['lpn_guide_lib_example_def']='<p>Net1 کی مثال کھولیں اور پانی، لائبریریاں چنیں۔ پیٹرن میں پیٹرن 1، Demand Pattern، ہے، جس کے 12 ضرب 2:00 کے وقفے پر ہیں اور 24:00 کو ڈھانپتے ہیں، اور (default) کا نشان ہے۔ وکر میں وکر 1، Pump Curve for Pump 9، ہے، ایک نقطے والا پمپ ہیڈ وکر، 250 ft پر 1500 gpm۔ کنٹرولز میں دو بیان ہیں: پہلا لنک 9 کھولتا ہے جب نوڈ 2 110 سے نیچے آئے، اور دوسرا اسے بند کرتا ہے جب نوڈ 2 140 سے اوپر جائے۔ قواعد میں دو قاعدے ہیں جو گھڑی کا وقت اور ٹینک 2 کی سطح جانچتے ہیں۔</p><p>پانی، حل کریں چنیں، اور پھر پانی، رپورٹس، حالت میں تبدیلیاں۔ پمپ L9 اب 10:00 پر بند، 15:00 پر کھلا، اور 21:00 پر بند ہے، اور ٹینک N2 22:00 پر خالی ہو رہا ہے۔ کنٹرولز میں دوسرے کنٹرول میں 140 کو 135 کریں اور دوبارہ پانی، حل کریں چنیں۔ آخری بندش 20:00 پر چلی جاتی ہے، اور ٹینک N2 21:00 پر خالی ہو رہا ہے۔</p>';
$ec_lang['lpn_guide_lib_notes_def']='<ul><li>پیٹرن رن کے چلنے تک دہرایا جاتا ہے، اس لیے اسے پورے رن کو ڈھانپنے کی ضرورت نہیں۔</li><li>EPANET فائل میں پائپ کی قسم یا فٹنگز کی فہرست کی کوئی جگہ نہیں۔ فائل ہر پائپ کے پڑھے ہوئے اعداد رکھتی ہے، اور برآمد بتاتی ہے کہ کن پائپوں کو سیدھا کیا گیا۔</li><li>لائبریریوں کے باکس کی جگہ اور سائز اسی براؤزر میں رکھے جاتے ہیں۔ آئٹم پراجیکٹ کے ساتھ محفوظ ہوتے ہیں۔</li></ul>';
// The Properties chapter, in the entry for the Properties box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_popup">. Held by dev/lpn-spike/user-guide-properties-harness.js.
$ec_lang['lpn_guide_prop_open_term']='خصوصیات کھولنا';
$ec_lang['lpn_guide_prop_open_def']='<p>منتخب کریں موڈ میں، نوڈ، لنک، متن یا گاہک پر کلک کریں تاکہ خصوصیات اس کے پاس کھلیں، یا وہاں جہاں باکس آخری بار منتقل کیا گیا تھا۔ کسی دوسرے اثاثے کو انتخاب میں شامل کرنے کے لیے اس پر Shift+کلک کریں۔ ایک سے زیادہ اثاثے منتخب ہوں تو باکس وہ فہرست دکھاتا ہے جو سب پر ایک ساتھ مقرر کی جا سکتی ہے (نیچے کئی اثاثے منتخب دیکھیں)۔ شکل کا خصوصیات باکس نہیں ہوتا، کیونکہ اس کے نقطوں میں نقشے پر ترمیم ہوتی ہے۔</p><p>نوڈ یا لنک کے دائیں کلک مینو میں خصوصیات کاپی کریں، منتخب پر خصوصیات پیسٹ کریں، اور وقتی سلسلے کا گراف ہیں۔ ٹچ اسکرین پر اسی مینو کے لیے اثاثے کو دبائے رکھیں۔ وقتی سلسلے کے گراف کو توسیعی مدت کے سمولیشن کے نتائج چاہییں۔</p>';
$ec_lang['lpn_guide_prop_edit_term']='قدر میں ترمیم کرنا';
$ec_lang['lpn_guide_prop_edit_def']='<p>قدر اس وقت لاگو ہوتی ہے جب خانہ تصدیق کر دیا جائے، اسے چھوڑ کر یا Enter دبا کر۔ اسے اس اکائی میں پڑھا جاتا ہے جو اس کے لیبل میں ہے، بغیر کسی تبدیلی کے، اور نقشے کا لیبل، جدول اور نتائج اس کے مطابق ہو جاتے ہیں۔ حساب شدہ قدریں صرف پڑھنے والی قطاریں ہیں جن میں لکھنے کا خانہ نہیں۔ لنک کے لیے وہ اس کے ان پٹ کی پیروی کرتی ہیں، اور نوڈ کے لیے ان کے درمیان ہوتی ہیں۔ یہ آخری حساب کے نتائج ہیں، دکھائے گئے وقت پر، اور خود بخود دوبارہ حل کریں سے نشان ہٹا ہو تو یہ آخری حل کریں کے ہیں۔</p><p>جو پائپ پائپ کی قسم استعمال کرتا ہے وہ قسم کی بتائی ہوئی قدریں غیر فعال دکھاتا ہے۔ ان قدروں کو پائپ میں نقل کرنے اور وہیں ان میں ترمیم کرنے کے لیے پائپ کی قسم سے الگ کریں پر کلک کریں۔</p>';
$ec_lang['lpn_guide_prop_id_term']='ID';
$ec_lang['lpn_guide_prop_id_def']='<p>ID ٹائٹل بار میں ایڈٹ کی جاتی ہے۔ اس میں خالی جگہ یا اقتباس کا نشان نہیں ہو سکتا، اور نوڈ کی ID دوسرے نوڈ کی ID نہیں ہو سکتی، نہ لنک کی دوسرے لنک کی۔ نوڈ اور لنک کی ID ایک ہو سکتی ہے۔ مسترد کی گئی ID پرانی ID کو برقرار رکھتی ہے اور پیغام دکھاتی ہے۔ اثاثے کا نام بدلنے سے اس کی منظرنامے کی اپنی قدریں ساتھ جاتی ہیں۔</p>';
$ec_lang['lpn_guide_prop_scn_term']='منظرنامے میں';
$ec_lang['lpn_guide_prop_scn_def']='<p>بنیاد کے سوا کسی منظرنامے میں، ایسی قدر میں ترمیم جسے منظرنامے بدل سکتے ہیں، کھلے ہوئے منظرنامے کی اپنی قدر کے طور پر محفوظ ہوتی ہے، اور قطار کے بائیں طرف نشان لگتا ہے۔ منظرنامہ مینیجر کا اندراج نشانات بیان کرتا ہے اور درج کرتا ہے کہ ہر منظرنامے میں کیا ایک جیسا ہے: ID، تفصیل اور ٹیگ ایک جیسے ہیں۔ گاہک کی کوئی منظرنامے کی قدریں نہیں ہوتیں۔ منظرنامے بدلنے سے خصوصیات اسی اثاثے پر کھلی رہتی ہیں، اور اب کھلے ہوئے منظرنامے کی قدریں دکھاتی ہیں۔</p>';
$ec_lang['lpn_guide_prop_multi_term']='کئی اثاثے منتخب';
$ec_lang['lpn_guide_prop_multi_def']='<p>ٹائٹل مثلاً 2 selected پڑھتا ہے۔ باکس میں انتخاب کی ہر قسم کے اثاثے کا ایک حصہ ہوتا ہے، جس کے عنوان میں قسم کا نام اور اس کے اثاثوں کی تعداد ہوتی ہے، جیسے پائپس (2)، اور ہر حصہ سمیٹا جا سکتا ہے۔ حصہ وہ خصوصیات درج کرتا ہے جو جدولوں میں کالم کے طور پر ہیں اور اس حصے کے ہر اثاثے پر مقرر کی جا سکتی ہیں۔ نتائج اور وہ قدریں جو پائپ کی قسم بتاتی ہے درج نہیں ہوتیں۔ قطار وہ قدر دکھاتی ہے جو اثاثوں میں مشترک ہو، یا جہاں وہ مختلف ہوں وہاں مختلف۔</p><p>قطار میں قدر لکھنے سے وہ انتخاب میں اس قسم کے ہر اثاثے پر مقرر ہو جاتی ہے۔ جس قطار کو چھوا نہ جائے وہ کچھ نہیں لکھتی۔ ایک اطلاع تعداد بتاتی ہے، جیسے Set Diameter (in) on 2.، اور ایک بار کالعدم کریں پوری قطار کو واپس کر دیتا ہے۔ بنیاد کے سوا کسی منظرنامے میں قدریں اپنی قدروں کے طور پر محفوظ ہوتی ہیں۔</p>';
$ec_lang['lpn_guide_prop_example_def']='<p>Net1 کی مثال کھولیں اور پائپ 10 پر کلک کریں۔ خصوصیات اس کے ان پٹ تفصیل سے فعال ہے؟ تک درج کرتی ہیں، اور پھر دکھائے گئے وقت پر اس کے نتائج: بہاؤ 1866.2 gpm، رفتار 2.4 ft/sec، اور دباؤ نقصان 19.12 ft H2O۔</p><p>پائپ 113 پر کلک کریں اور پائپ 31 پر Shift+کلک کریں۔ ٹائٹل 2 selected پڑھتا ہے، ایک ہی حصہ پائپس (2) ہے، اور قطر مختلف دکھاتا ہے، کیونکہ پائپ 31 6 in. اور پائپ 113 8 in. ہے۔ قطر کے لیے 10 درج کریں۔ اطلاع Set Diameter (in) on 2. پڑھتی ہے، دونوں پائپ 10 in. ہیں، اور ایک بار کالعدم کریں انہیں 6 اور 8 in. پر لوٹا دیتا ہے۔</p>';
// The Settings chapter, in the entry for the Settings box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_settings_box">. Held by dev/lpn-spike/user-guide-settings-harness.js.
$ec_lang['lpn_guide_set_where_term']='حصے، اور ترتیبات کہاں محفوظ ہوتی ہیں';
$ec_lang['lpn_guide_set_where_def']='<p>باکس کے بائیں طرف کی فہرست کسی حصے یا ذیلی عنوان پر لے جاتی ہے۔ حصے یہ ہیں: بصری پیشکش (نوڈ لیبلز، نوڈ رنگ، لنک لیبلز، لنک رنگ، گاہک، اور سب)، نقشہ اور صفحہ (ظاہری شکل اور صفحہ)، اثاثے (ID سابقے، قدریں، اور حسب ضرورت خصوصیات)، حساب (اکائیاں، وقت، ہائیڈرالکس، توانائی، اور پانی کا معیار)، اور کریڈٹس۔ ہر ذیلی عنوان بتاتا ہے کہ اس کی ترتیبات پراجیکٹ کے ساتھ محفوظ ہیں یا اس براؤزر میں محفوظ ہیں۔ سب کچھ پراجیکٹ کے ساتھ محفوظ ہوتا ہے سوائے صفحہ کے تحت کی ترتیبات اور ہائیڈرالکس کی ایک قطار، رن کی پیش رفت کا باکس دکھائیں، کے، جو خود بتاتی ہے کہ وہ اس براؤزر میں محفوظ ہے۔</p><p>جدولوں میں ترتیبات کا ٹیب انہی ترتیبات کو قطاروں کے طور پر ان کے زمرے اور قدر کے ساتھ درج کرتا ہے، اس لیے ترتیب وہاں بھی ڈھونڈی اور جانچی جا سکتی ہے۔</p>';
$ec_lang['lpn_guide_set_search_term']='تلاش';
$ec_lang['lpn_guide_set_search_def']='<p>ترتیبات تلاش کریں میں ایک یا زیادہ الفاظ لکھیں تو صرف وہ ترتیبات فہرست میں آتی ہیں جن کے نام یا ٹپ میں وہ سب الفاظ موجود ہوں۔ جو لفظ کسی عنوان سے ملے وہ اس عنوان کے تحت ہر ترتیب دکھاتا ہے۔ مثلاً، opacity لکھنے پر علامت کی دھندلاہٹ (0 سے 1) اور پس منظر کی تصویر کی دھندلاہٹ (0 سے 1) آتی ہیں؛ opacity symbol لکھنے پر صرف پہلی؛ اور sprinklers لکھنے پر ایمیٹر کا ایکسپوننٹ آتا ہے، جس کی ٹپ میں sprinklers کا ذکر ہے اور نام میں نہیں۔ تلاش کوئی ترتیب نہیں بدلتی۔</p>';
$ec_lang['lpn_guide_set_scn_term']='منظرنامے میں ترتیبات';
$ec_lang['lpn_guide_set_scn_def']='<p>بنیاد کے سوا کسی منظرنامے میں، ایسی ترتیب کے لیے لکھی گئی قدر جسے منظرنامے بدل سکتے ہیں، اپنی قدر کے طور پر محفوظ ہوتی ہے، اور قطار پر ٹھوس نقطے کا نشان لگتا ہے۔ تکون اس ترتیب کو نشان زد کرتی ہے جسے کھلے ہوئے منظرنامے سے نیچے کے منظرنامے اپنی قدر سے بدلتے ہیں۔ منظرنامہ مینیجر کا اندراج درج کرتا ہے کہ کون سی ترتیبات بدلی جا سکتی ہیں۔ اکائیاں ہر منظرنامے میں ایک جیسی ہیں۔ ڈیفالٹ بحال کریں بنیاد کے باہر مدھم رہتا ہے، اور نئے اثاثوں کی ان قدروں کو ہر موجودہ اثاثے پر لاگو کریں وہاں مسترد ہوتا ہے، کیونکہ وہ خود ڈرائنگ کو بدلتا ہے۔</p>';
$ec_lang['lpn_guide_set_units_term']='اکائی بدلنا';
$ec_lang['lpn_guide_set_units_def']='<p>ہر مقدار کی اکائیوں میں اپنی اکائی ہے۔ جب پراجیکٹ میں قدریں اسی اکائی میں درج ہوں تو اسے بدلنے سے پہلے ایک سوال پوچھا جاتا ہے۔ غیر تباہ کن ہر عدد کو جیسا لکھا گیا ویسا رکھتا ہے اور اسے نئی اکائی میں پڑھتا ہے۔ تباہ کن اعداد کو تبدیلی کے ساتھ دوبارہ لکھتا ہے، تاکہ نیٹ ورک طبعی طور پر وہی رہے، اور اصل اعداد ضائع ہو جاتے ہیں جب تک کالعدم کریں استعمال نہ ہو؛ ایک بار کالعدم کریں اعداد اور اکائی کو بحال کر دیتا ہے۔ منسوخ کریں سب کچھ جیسا تھا ویسا چھوڑ دیتا ہے۔</p><p>Net1 پر مثال: اکائیوں میں قطر کے لیے mm چنیں۔ تباہ کن 13 قدریں دوبارہ لکھتا ہے، اور پائپ 10 457.2 mm پڑھتا ہے۔ غیر تباہ کن 13 قدروں کو چھوڑ دیتا ہے، اور پائپ 10 18 mm پڑھتا ہے۔</p>';
$ec_lang['lpn_guide_set_assets_term']='نئے اثاثے، اور موجودہ اثاثوں پر قدریں لاگو کرنا';
$ec_lang['lpn_guide_set_assets_def']='<p>ID سابقے اور قدریں اب سے بنائے جانے والے اثاثوں کے لیے ہیں۔ یہ پہلے سے بنائے گئے اثاثوں کو نہیں بدلتے۔ ID سابقے کے ساتھ سب پر لاگو کریں اس قسم کے ہر موجودہ اثاثے کو ایسی ID دیتا ہے جو سابقے سے شروع ہو؛ ہر ایک اپنا نمبر رکھتا ہے، اور جو ID نمبر پر ختم نہ ہو وہ نہیں بدلتی۔ نئے اثاثوں کی ان قدروں کو ہر موجودہ اثاثے پر لاگو کریں ایک سوال کے بعد ہر موجودہ اثاثے پر وہ خصوصیات بدل دیتا ہے، لیکن صرف ان خصوصیات کے لیے جن کے لیبل نقشے پر دکھائے جا رہے ہوں۔ کالعدم کریں اسے واپس کر دیتا ہے۔</p>';
$ec_lang['lpn_guide_set_reset_term']='ڈیفالٹ بحال کریں اور نئے سرے سے شروع کریں';
$ec_lang['lpn_guide_set_reset_def']='<p>ڈیفالٹ بحال کریں پہلے پوچھتا ہے، اور پھر کھلے ہوئے پراجیکٹ کے ID سابقے، نئے اثاثوں کی قدریں، سولور کی ترتیبات، نقشے کی ظاہری شکل، لیجنڈ کی جگہ اور نظر آنے والے لیبلز کو ان کی اصل قدروں پر لوٹا دیتا ہے۔ نیٹ ورک نہیں بدلتا، دوسرے پراجیکٹ متاثر نہیں ہوتے، اور ایک بار کالعدم کریں ترتیبات واپس لے آتا ہے۔</p><p>نئے سرے سے شروع کریں پہلے پوچھتا ہے، اور پھر اس براؤزر میں محفوظ ہر پراجیکٹ، ہر پس منظر کی تصویر، تمام ترتیبات اور اکائیوں کے انتخاب حذف کر دیتا ہے، اور صفحہ ایسے دوبارہ لوڈ کرتا ہے جیسے نیا وزیٹر اسے دیکھے۔ اسے کالعدم نہیں کیا جا سکتا۔</p>';
// The Toolbar chapter (Task 785), terms in the Toolbar section above its rows. Held by
// dev/lpn-spike/user-guide-toolbar-harness.js.
$ec_lang['lpn_guide_tb_row_term']='قطار پڑھنا';
$ec_lang['lpn_guide_tb_row_def']='<p>ہر قطار ایک ٹول بار بٹن ہے، پٹی کی ترتیب میں، گروپوں کے درمیان ایک لکیر کے ساتھ۔ قطار بٹن کا آئیکن، نام اور ٹپ دکھاتی ہے، پھر اس کی کیز۔ جہاں مینو کی قطار وہی کام کرتی ہے، قطار Also in کے الفاظ کے بعد مینو کا راستہ بھی دکھاتی ہے۔ قطار پر کلک کرنے سے ٹول بار پر بٹن کی طرف اشارہ ہوتا ہے۔ یہ بٹن کو کبھی نہیں چلاتا۔ جب بٹن اسکرین پر نہ ہو تو قطار وہ مینو قطار کھولتی ہے جو وہی کام کرتی ہے۔</p>';
$ec_lang['lpn_guide_tb_dim_term']='مدھم نام';
$ec_lang['lpn_guide_tb_dim_def']='<p>مدھم نام ایسے بٹن کا ہے جو اس وقت اسکرین پر نہیں ہے۔ جو بٹن اسکرین پر ہو وہ مدھم نہیں ہوتا، چاہے اس لمحے وہ کام کر سکے یا نہ کر سکے۔ جب خود بخود دوبارہ حل کریں نشان زد ہو تو حل کریں مدھم ہوتا ہے، کیونکہ بٹن صرف تب ظاہر ہوتا ہے جب وہ ترتیب نشان ہٹا ہوئی ہو۔</p><p>فون پر عمودی موڈ میں، ٹول بار پر صرف پانچ رن کنٹرولز رہتے ہیں۔ باقی ہر نام مدھم ہے، اور کسی پر کلک کرنے سے وہ مینو قطار کھلتی ہے جو وہی کام کرتی ہے۔ نچلے پینل کے بٹن کی کوئی مینو قطار نہیں، اس لیے اس کی قطار صرف یہ کہہ سکتی ہے کہ کنٹرول اسکرین پر نہیں ہے۔</p>';
$ec_lang['lpn_guide_tb_two_term']='کونے میں تکون والے بٹن';
$ec_lang['lpn_guide_tb_two_def']='<p>پورا دکھائیں اور ونڈو منتخب کریں کے نچلے دائیں کونے میں ایک چھوٹی تکون ہوتی ہے۔ بٹن کو دوسری بار دبانے سے، درمیان میں کچھ اور دبائے بغیر، وہ بدل جاتا ہے: پورا دکھائیں زوم ونڈو بن جاتا ہے، اور ونڈو منتخب کریں ونڈو، لیسو اور کثیر الاضلاع کی شکلوں میں باری باری بدلتا ہے۔ پورا دکھائیں کے کونے پر کلک کرنے سے منظر کو فٹ کیے بغیر فوراً زوم ونڈو شروع ہو جاتا ہے۔</p>';
// The Menus chapter (Task 785), two terms after the ruled keys table. Held by dev/lpn-spike/user-guide-menus-harness.js.
$ec_lang['lpn_guide_mn_list_term']='مینو کی فہرست پڑھنا';
$ec_lang['lpn_guide_mn_list_def']='<p>فہرست خود مینو سے بنائی جاتی ہے: فائل، ترمیم، نقشہ، پانی، اور مدد، ہر ایک اپنے عنوان کے تحت، فلائی آؤٹ کی قطاریں اسے کھولنے والی قطار کے نیچے اندر کی طرف، اور گروپوں کے درمیان ایک لکیر۔ یہ ان قطاروں کو چھوڑ دیتی ہے جو اس وقت چھپی ہوں، مینو کے اندر کے عنوانات، اور وہ قطاریں جن کا نام پراجیکٹ یا براؤزر سے آئے، جیسے منظرناموں کے نام۔ یہ ایک فلائی آؤٹ کی گہرائی تک جاتی ہے، اور زبان کے مینو کا اس میں کوئی اندراج نہیں۔ جو قطار اس وقت غیر فعال ہو وہ بھی درج ہوتی ہے، اس کے غیر فعال ہونے کا کوئی نشان نہیں ہوتا۔ قطار پر کلک کرنے سے مینو اور فلائی آؤٹ اس قطار کی طرف اشارے کے ساتھ کھلتے ہیں۔ یہ قطار کو کبھی نہیں چلاتا۔</p>';
$ec_lang['lpn_guide_mn_kbd_term']='کی بورڈ سے مینو';
$ec_lang['lpn_guide_mn_kbd_def']='<p>Alt+Shift کے بعد کے حروف مقررہ مقامات پر کیز ہیں، F فائل کے لیے، E ترمیم کے لیے، M نقشے کے لیے، W پانی کے لیے، H مدد کے لیے، اور L زبان کے لیے، ہر کی بورڈ لے آؤٹ پر اور ہر زبان میں۔ F10 کے بعد، مینو کا حرف اکیلا اسے کھولتا ہے، اور مینو بار پر Esc فوکس وہاں لوٹا دیتا ہے جہاں وہ تھا۔</p><p>جو قطاریں صرف پوائنٹر سے استعمال ہو سکتی ہیں ان کا کوئی حرف نہیں ہوتا، اور تیر کی کیز انہیں چھوڑ دیتی ہیں۔ ان میں ورٹیکس، تین علاقہ انتخاب، داخل کرنے کے ٹولز، زوم ونڈو، اور اسکرین شاٹ شامل ہیں۔</p>';
// The Map chapter (Task 785): terms after the ruled keys table. Held by dev/lpn-spike/user-guide-map-harness.js.
$ec_lang['lpn_guide_map_undo_term']='کالعدم اور دوبارہ کریں';
$ec_lang['lpn_guide_map_undo_def']='<p>Ctrl+Z آخری تبدیلی کالعدم کرتا ہے، اور Ctrl+Y یا Ctrl+Shift+Z اسے دوبارہ کرتا ہے۔ جدول کے خانے میں، جب خانہ صرف منتخب ہو تو کیز پراجیکٹ کی ہیں، اور ٹائپنگ شروع ہونے کے بعد خانے کے متن کی۔ صفحہ آخری 20 مراحل رکھتا ہے، صرف میموری میں، اور پراجیکٹ بدلنے سے وہ صاف ہو جاتے ہیں۔ ایک مرحلہ ڈرائنگ کے ساتھ منظرنامے، کھلا ہوا منظرنامہ اور اکائیاں بھی بحال کرتا ہے۔</p>';
$ec_lang['lpn_guide_map_del_def']='<p>Delete یا Backspace انتخاب کو حذف کرتا ہے، سوائے خانے میں ٹائپ کرتے وقت، جب کی خانے کی ہوتی ہے۔ کچھ منتخب نہ ہو تو Delete یہی کہتا ہے، اور Backspace کچھ نہیں کرتا۔ ایک بار کالعدم کریں کئی اثاثوں کے حذف ہونے کو واپس کر دیتا ہے۔ بنیاد کے سوا کسی منظرنامے میں، Delete اس اثاثے کو نہیں ہٹاتا جو بنیاد میں موجود ہو؛ منظرنامہ مینیجر کا اندراج بتاتا ہے کہ وہ کیا کرتا ہے۔</p>';
$ec_lang['lpn_guide_map_esc_term']='Esc';
$ec_lang['lpn_guide_map_esc_def']='<p>جو Esc مینو، پل ڈاؤن یا باکس بند کرے وہ اور کچھ نہیں کرتا۔ خصوصیات، ترتیبات اور لائبریریوں کے باکس صرف تب بند ہوتے ہیں جب فوکس باکس میں ہو اور پوائنٹر اس کے اوپر ہو۔ ان میں سے کچھ کھلا نہ ہو تو Esc فعال ٹول کو منتخب کریں پر لوٹاتا ہے، اور منتخب کریں میں انتخاب صاف کرتا ہے۔ آدھے بنے ہوئے پائپ کو ترک کرنے کے لیے ایک Esc لگتا ہے اور منتخب کریں پر لوٹنے کے لیے دوسرا۔ خانے میں، Esc خانے کا ہوتا ہے۔</p>';
$ec_lang['lpn_guide_map_letters_term']='حروف، ہندسے، اور زوم کیز';
$ec_lang['lpn_guide_map_letters_def']='<p>W زوم ونڈو شروع کرتا ہے، A علاقے کا انتخاب شروع کرتا ہے (A دوبارہ دبانے سے ونڈو، لیسو اور کثیر الاضلاع بدلتے ہیں)، اور F ایک شکل بناتا ہے۔ جمع یا برابر کی کی زوم ان کرتی ہے، اور منفی کی زوم آؤٹ کرتی ہے، ماؤس وہیل کے ایک قدم کے برابر۔ یہ کیز اور ہندسے 0 سے 9 نقشے پر کچھ نہیں کرتے جب کوئی دوسری کی انہیں شارٹ کٹ بنا دے، جیسے Ctrl+C، خانے میں ٹائپ کرتے وقت کچھ نہیں کرتے، اور کھلے ہوئے مینو کے حروف اس کی قطاروں کے لیے چھوڑ دیتے ہیں۔ منتخب جدول کے خانے پر ٹائپ کیا ہوا ہندسہ ٹول چننے کے بجائے خانے کو اوور رائٹ کرتا ہے۔</p>';
// The Tables chapter (Task 785): terms after the two ruled key tables. Held by dev/lpn-spike/user-guide-tables-harness.js.
$ec_lang['lpn_guide_tbl_tabs_term']='ٹیب';
$ec_lang['lpn_guide_tbl_tabs_def']='<p>پینل کھولنے کے لیے نچلے پینل کا بٹن دبائیں یا پانی، جدولیں چنیں۔ اس کے ٹیب، بائیں سے دائیں، یہ ہیں: جنکشنز، ریزروائرز، ٹینکس، پائپس، پمپس، والوز، متن، گاہک، شکلیں، ترتیبات، منظرنامے، وقتی سلسلہ، پروفائل، تعدد، اور بہاؤ کا توازن۔ منظرنامے کا ٹیب تب دکھایا جاتا ہے جب بنیادی موڈ سے نشان ہٹا ہو۔ کالم کی چوڑائی، ترتیب اور نظر آنا اس براؤزر میں رکھے جاتے ہیں، پراجیکٹ میں نہیں۔</p>';
$ec_lang['lpn_guide_tbl_cell_term']='خانہ منتخب کرنا، درج کرنا، اور ترمیم کرنا';
$ec_lang['lpn_guide_tbl_cell_def']='<p>خانہ تین حالتوں میں سے ایک میں ہوتا ہے۔ جب وہ صرف منتخب ہو تو تیر کی کیز ایک خانے سے دوسرے خانے پر جاتی ہیں، اور Ctrl+Z پراجیکٹ کا کالعدم ہے۔ منتخب خانے پر کوئی حرف ٹائپ کرنے سے اندراج شروع ہوتا ہے: ٹائپ کیا ہوا متن قدر کی جگہ لیتا ہے، اور تیر کی کی اسے تصدیق کر کے اگلے خانے پر جاتی ہے۔ F2 یا ڈبل کلک خانے کو ترمیم کے لیے کھولتا ہے: کرسر قدر میں ہوتا ہے، اور تیر کی کیز کرسر کو چلاتی ہیں۔ اندراج اور ترمیم میں، Ctrl+Z ٹائپنگ کو کالعدم کرتا ہے۔ Esc اندراج یا ترمیم منسوخ کرتا ہے اور خانے کو منتخب چھوڑ دیتا ہے۔</p>';
$ec_lang['lpn_guide_tbl_fill_term']='بھرنا، فلٹر، اور منظرنامے';
$ec_lang['lpn_guide_tbl_fill_def']='<p>Ctrl+D منتخب حد کو اس کی اوپر کی قطار سے نیچے کی طرف بھرتا ہے، اور Ctrl+Enter اسے فعال خانے کی قدر سے بھرتا ہے۔ دونوں ID کالم اور صرف پڑھنے والے خانوں کو چھوڑ دیتے ہیں، اور ایک اطلاع بتاتی ہے کہ کتنے خانے بھرے گئے اور کتنے نہیں بدلے۔ Ctrl+Shift+L صرف وہ اثاثے دکھاتا ہے جو نقشے پر منتخب ہوں۔ فلٹر لگا ہو تو Ctrl+A اور Ctrl+D صرف دکھائی گئی قطاروں پر عمل کرتے ہیں، اور جو قطار اس طرح ایڈٹ ہو کہ اب مطابقت نہ رکھے وہ فلٹر دوبارہ لگنے تک رہتی ہے۔</p><p>بنیاد کے سوا کسی منظرنامے میں، خانے کی ترمیم، Ctrl+D، Ctrl+Enter اور پیسٹ کھلے ہوئے منظرنامے کی اپنی قدروں کے طور پر محفوظ ہوتے ہیں۔</p>';
// The Boxes chapter (Task 785): terms after Tom's two paragraphs. Held by dev/lpn-spike/user-guide-boxes-harness.js.
$ec_lang['lpn_guide_bx_dock_term']='ڈاک کرنا اور ٹیب';
$ec_lang['lpn_guide_bx_dock_def']='<p>باکس کی ٹائٹل بار کے کونے میں نقشے کے بائیں جانب ڈاک کریں، نقشے کے دائیں جانب ڈاک کریں، اور تیرتا ہوا ہیں، اور باکس ڈاک ہونے کے بعد خودکار چھپائیں۔ ڈاک شدہ باکس نقشے کے ساتھ ایک کالم ہے۔ خودکار چھپائیں کے ساتھ، یہ نقشے کے کنارے پر پتلی پٹی پر ایک ٹیب ہے۔ ٹیب باکس کو ہوور پر کھولتا ہے، ماؤس یا قلم سے 150 ms کے بعد، یا کلک یا ٹیپ پر، اور باکس اوپر بیان کردہ طریقے سے اپنے ٹیب میں واپس چھپ جاتا ہے۔ چھپا ہوا باکس پھر بھی کھلا ہے۔ جو مینو قطار یا ٹول بار بٹن اسے کھولتا ہے وہ اسے ٹیب سے باہر لے آتا ہے۔</p><p>ڈاک شدہ باکس کو اس کی ٹائٹل بار سے گھسیٹنے سے وہ تیرتا ہوا ہو جاتا ہے اور خودکار چھپانا بند ہو جاتا ہے۔ ایک طرف ڈاک شدہ باکس ایک ہی چوڑائی بانٹتے ہیں، اور نقشہ کم از کم 320 px رکھتا ہے۔ ٹیبز کی ترتیب انہیں گھسیٹ کر، یا فوکس والے ٹیب پر Alt+اوپر یا Alt+نیچے دبا کر بدلی جاتی ہے۔</p>';
$ec_lang['lpn_guide_bx_keep_term']='باکس کیا یاد رکھتا ہے';
$ec_lang['lpn_guide_bx_keep_def']='<p>ہر باکس اس براؤزر میں یاد رکھتا ہے کہ وہ کہاں تیرتا ہے، اس کا سائز، آیا وہ کھلا ہے، اس کی ڈاک کی طرف، آیا وہ خودکار چھپتا ہے، اس کی ڈاک شدہ چوڑائی، اور اس کے ٹیب کی جگہ۔ خصوصیات، نازکی کا تجزیہ، طلب اسکیلنگ، اور کیلیبریشن صرف اپنی ڈاک کی طرف، خودکار چھپانا، ٹیب کی جگہ، اور آیا وہ کھلے ہیں یاد رکھتے ہیں؛ جہاں وہ تیرتے ہیں وہ ایک صفحہ لوڈ تک رہتا ہے۔ جس براؤزر میں کوئی محفوظ لے آؤٹ نہ ہو وہ کچھ باکس ٹیبز کے طور پر ڈاک کیے ہوئے شروع ہوتا ہے، اور کچھ محفوظ نہیں ہوتا جب تک کوئی باکس نہ بدلا جائے۔</p>';
$ec_lang['lpn_guide_bx_phone_term']='فون پر';
$ec_lang['lpn_guide_bx_phone_def']='<p>640 px یا اس سے تنگ پر، کوئی باکس ڈاک نہیں ہوتا اور ہر باکس ونڈو بھر دیتا ہے۔ ڈاک کے بٹن پیش نہیں کیے جاتے۔ ڈاک شدہ لے آؤٹ برقرار رکھا جاتا ہے اور چوڑی ونڈو پر واپس آتا ہے۔</p>';
// The Fire flow analysis chapter (Task 785), in the entry for its box. Held by dev/lpn-spike/user-guide-fireflow-harness.js.
$ec_lang['lpn_guide_ff_asks_term']='ہر جنکشن سے کیا پوچھا جاتا ہے';
$ec_lang['lpn_guide_ff_asks_def']='<p>ہر آزمائے گئے جنکشن کے دو ٹیسٹ ہوتے ہیں، نیٹ ورک کی ایک کاپی پر، اسکرین پر دکھائے گئے ٹائم اسٹیپ پر اور کھلے ہوئے منظرنامے میں۔ پہلا پوچھتا ہے کہ جنکشن بقایا دباؤ برقرار رکھتے ہوئے کتنا بہاؤ دے سکتا ہے۔ جنکشن پر ایک بہاؤ نکالا جاتا ہے، اور بار بار حل اسے تنگ کرتے ہیں، 10000 gpm کے برابر بالائی حد تک۔ جو جنکشن بالائی حد پر بھی بقایا دباؤ برقرار رکھے اسے بالائی حد سے زیادہ بہاؤ دینے والا رپورٹ کیا جاتا ہے۔ دوسرا ٹیسٹ، ڈیزائن کی جانچ، جنکشن پر درکار بہاؤ نکالتا ہے اور پوچھتا ہے کہ کیا اس کی حد میں کوئی دوسرا جنکشن دوسری جگہ اجازت شدہ کم ترین دباؤ سے نیچے آتا ہے، یا اس کی حد میں کوئی پائپ اجازت شدہ سب سے زیادہ رفتار سے اوپر چلتا ہے۔ جب اس کی حد کوئی نہیں ہو تو ڈیزائن کی جانچ نہیں کی جاتی۔</p><p>جس جنکشن کی اپنی درکار فائر فلو خاصیت ہو اسے اسی قدر کے مقابل آزمایا جاتا ہے، اور ہر دوسرے جنکشن کو باکس کی قدر کے مقابل۔</p>';
$ec_lang['lpn_guide_ff_result_term']='نتائج پڑھنا';
$ec_lang['lpn_guide_ff_result_def']='<p>خلاصہ ان جنکشنز کو گنتا ہے جو تمام جانچوں میں پاس ہوئے، جو فائر فلو میں ناکام ہوئے، اور جنہوں نے باقی نظام کو متاثر کیا۔ جدول ہر آزمائے گئے جنکشن کے لیے درج کرتا ہے: کوئی فائر فلو نکالے جانے سے پہلے جامد دباؤ، درکار بہاؤ، درکار بہاؤ پر دباؤ، دستیاب بہاؤ، برقرار رکھا گیا بقایا دباؤ، ڈیزائن کی جانچ کا بدترین اثر اور ڈیزائن کی حد، رنز کی تعداد، جو پورے نیٹ ورک کے حلوں کی تعداد ہے، اور ناکامی کی صورتیں۔ جس خانے میں عدد نہ ہو وہ ڈیش دکھاتا ہے، کبھی صفر نہیں۔ جو جنکشن حل نہ ہو سکا وہ اعداد کی جگہ اپنی وجہ دکھاتا ہے۔ جدول زیادہ سے زیادہ 200 جنکشنز چھاپتا ہے اور بتاتا ہے کہ کتنے نہیں چھاپے۔</p>';
$ec_lang['lpn_guide_ff_marks_term']='حلقے، روکیں، اور ایک وقت میں ایک تجزیہ';
$ec_lang['lpn_guide_ff_marks_def']='<p>رن کے بعد، ہر آزمائے گئے جنکشن کے دائرے کا خاکہ نقشے پر اس کے نتیجے کے مطابق بنتا ہے، اور خاکے رنگ کے ساتھ ڈیش کے نمونے میں بھی مختلف ہوتے ہیں۔ صرف نقشے پر منتخب جنکشنز کو آزمانے کے لیے منتخب جنکشنز چنیں؛ جو کچھ اور منتخب ہو اسے گنا جاتا ہے اور آزمایا نہیں جاتا۔ روکیں رن ختم کرتا ہے اور مکمل ہو چکے جنکشنز کو رکھتا ہے۔ فائر فلو، نازکی، اور طلب اسکیلنگ کے تجزیوں میں سے ایک وقت میں صرف ایک چلتا ہے۔</p>';
$ec_lang['lpn_guide_ff_example_def']='<p>Net1 کی مثال کھولیں، پانی، تجزیہ، فائر فلو تجزیہ… چنیں، اور باکس جیسے کھلا ہے ویسے ہی چلائیں پر کلک کریں۔ ٹائم اسٹیپ 0:00 ہے، اور رن پورے نیٹ ورک کو 135 بار حل کرتا ہے۔ نو میں سے آٹھ جنکشنز تمام جانچوں میں پاس ہوتے ہیں۔ جنکشن N32 فائر فلو میں ناکام ہوتا ہے: اس کا جامد دباؤ 111 psi ہے، درکار 1000 gpm پر صرف 1.19 psi باقی رہتا ہے، اور اس کا دستیاب بہاؤ 892 gpm ہے۔ جنکشن N31 1339 gpm دے سکتا ہے، اور جنکشن N12 10000 gpm سے زیادہ۔</p>';
// The Criticality analysis chapter (Task 785). Held by dev/lpn-spike/user-guide-criticality-harness.js.
$ec_lang['lpn_guide_cr_case_term']='ہر کیس کیا کرتا ہے';
$ec_lang['lpn_guide_cr_case_def']='<p>حد میں ہر لنک کے لیے، نیٹ ورک کی ایک کاپی پر وہ لنک غیر فعال کیا جاتا ہے، اور کاپی اسکرین پر دکھائے گئے ٹائم اسٹیپ پر کھلے ہوئے منظرنامے میں حل کی جاتی ہے۔ ایک رن ہر لنک کے لیے ایک حل اور ایک مزید حل ہے جس میں کچھ ٹوٹا نہیں۔ جو جنکشن ریزروائر یا ٹینک تک کھلے راستے کے بغیر رہ جائے وہ کٹ جاتا ہے: اسے حل سے پہلے ہٹا دیا جاتا ہے، اور اس کی طلب کو نہ پہنچائی گئی طلب کے طور پر گنا جاتا ہے۔ جو جنکشن ابھی جڑے ہیں ان میں سے، کم از کم سے نیچے کے جنکشن ان کی فہرست دیتے ہیں جن کا دباؤ اجازت شدہ کم ترین دباؤ سے نیچے آئے۔ جو جنکشن کچھ ٹوٹے بغیر پہلے ہی اس سے نیچے ہو اسے کسی لنک کے خلاف نہیں گنا جاتا، اور خلاصہ بتاتا ہے کہ ایسے کتنے ہیں۔ اجازت شدہ کم ترین دباؤ وہی ترتیب ہے جو فائر فلو تجزیے کے دوسری جگہ اجازت شدہ کم ترین دباؤ کے باکس کی ہے۔</p>';
$ec_lang['lpn_guide_cr_dead_term']='بند سرے، اور فہرست';
$ec_lang['lpn_guide_cr_dead_def']='<p>بند سرے کا لنک وہ ہے جس کے ہٹانے سے وہ جنکشن کٹ جاتے ہیں جن تک صرف اسی کے ذریعے پہنچا جا سکتا ہے۔ اس کے پار ہر چیز اس کا نقصان ہے، اس لیے بند سرے چھوڑیں نشان زد ہو تو لنک حل نہیں کیا جاتا، اور خلاصہ بتاتا ہے کہ کتنے چھوڑے گئے۔ فہرست ہر لنک کے لیے نہ پہنچائی گئی طلب، کٹے ہوئے جنکشنز، اور کم از کم سے نیچے کے جنکشنز دکھاتی ہے، ہر ایک تعداد اور پہلی پانچ IDs کے ساتھ، اور کسی ID پر کلک کرنے سے نقشے پر اس تک پہنچا جاتا ہے۔ جو لنک نظام کو کچھ نقصان پہنچاتے ہیں وہ پہلے درج ہوتے ہیں جب تک کالم کے عنوان پر کلک کر کے ترتیب نہ دی جائے، اور خلاصہ انہیں آزمائے گئے لنکس کی تعداد کے مقابل گنتا ہے۔ صرف نقشے پر منتخب لنکس کو توڑنے کے لیے منتخب لنکس چنیں۔</p>';
$ec_lang['lpn_guide_cr_example_def']='<p>Net1 کی مثال کھولیں، پانی، تجزیہ، نازکی کا تجزیہ… چنیں، اجازت شدہ کم ترین دباؤ کے لیے 116 درج کریں، اور چلائیں پر کلک کریں۔ ٹائم اسٹیپ 0:00 ہے، اور رن پورے نیٹ ورک کو 14 بار حل کرتا ہے۔ 13 میں سے چار لنک، جب وہ بند ہوں، کسی جنکشن کو 116 psi سے نیچے لے جاتے ہیں: L9 (N10، N11 اور N21)، L10 (N11 اور N21)، L111 (N21 اور N22)، اور L112 (N21 اور N22)۔ دو جنکشن کچھ ٹوٹے بغیر پہلے ہی 116 psi سے نیچے ہیں اور گنے نہیں جاتے۔ چونکہ Net1 لوپ والا ہے، ایک لنک کھونے سے کوئی جنکشن سپلائی کے بغیر نہیں رہتا۔</p>';
// The Demand scaling chapter (Task 785). Held by dev/lpn-spike/user-guide-demandscale-harness.js.
$ec_lang['lpn_guide_ds_run_def']='<p>چلائیں نیٹ ورک کی ایک کاپی پر، اسکرین پر دکھائے گئے ٹائم اسٹیپ پر اور کھلے ہوئے منظرنامے میں، چنے ہوئے جنکشنز کی طلب کو طلب اسکیل سے ضرب دیتا ہے۔ یہ دو حل کرتا ہے، ایک طلب جیسی ہے ویسی، اور ایک اسکیل کی ہوئی۔ نتیجہ سب سے کم دباؤ اور سب سے زیادہ رفتار درج کرتا ہے، ہر ایک میں اسکیل شدہ قدر غیر اسکیل شدہ کے ساتھ، جو وہ قدر ہے جو نقشہ دکھاتا ہے۔ ہر فہرست میں دس قطاریں ہیں، اور باکس بتاتا ہے کہ کتنے لنکس نہیں دکھاتا۔ طلب اسکیل کھلے ہوئے منظرنامے کے طلب کے ضرب کے علاوہ لاگو ہوتا ہے، اور پراجیکٹ میں کبھی محفوظ نہیں ہوتا۔</p>';
$ec_lang['lpn_guide_ds_find_def']='<p>تلاش کریں 0 سے 20 تک کے طلب اسکیل، قریب ترین 0.01 تک، میں سب سے بڑا ڈھونڈتا ہے جس پر ہر چنا ہوا جنکشن کم از کم اجازت شدہ کم ترین دباؤ برقرار رکھے۔ یہ اسکیل اور وہاں سب سے کم دباؤ رپورٹ کرتا ہے، اور اگلے قدم کے لیے بھی، جہاں دباؤ پہلی بار حد سے نیچے آتا ہے۔ اگر درج کی ہوئی طلب پہلے ہی کسی جنکشن کو حد سے نیچے چھوڑ دے تو جواب پر انتباہی نشان لگتا ہے۔ اگر ہر جنکشن 20 پر بھی حد برقرار رکھے تو جواب یہی کہتا ہے۔ روکیں تلاش کو بغیر جواب کے ختم کر دیتا ہے۔ اجازت شدہ کم ترین دباؤ وہی ترتیب ہے جو فائر فلو تجزیے کے دوسری جگہ اجازت شدہ کم ترین دباؤ کے باکس کی ہے۔</p>';
$ec_lang['lpn_guide_ds_scope_term']='جنکشنز، اور ٹائم اسٹیپ';
$ec_lang['lpn_guide_ds_scope_def']='<p>منتخب جنکشنز کے ساتھ، صرف نقشے پر منتخب جنکشنز اسکیل اور جانچے جاتے ہیں۔ دوسرے جنکشنز جیسے ہیں ویسے رہتے ہیں، اور جو حد سے نیچے آئیں وہ جواب کو محدود کیے بغیر درج ہوتے ہیں۔ صرف اسکرین پر دکھایا گیا ٹائم اسٹیپ اسکیل ہوتا ہے، اور سطحیں اور حالتیں اسی سے لی جاتی ہیں۔ چوٹی کو جانچنے کے لیے، چلانے سے پہلے گھڑی کو چوٹی کی طلب پر لے جائیں۔</p>';
$ec_lang['lpn_guide_ds_example_def']='<p>Net1 کی مثال کھولیں اور پانی، تجزیہ، طلب اسکیلنگ… چنیں۔ ٹائم اسٹیپ 0:00 پر، باکس جیسے کھلا ہے ویسے ہی تلاش کریں پر کلک کریں۔ ہر جنکشن طلب اسکیل 5.76 تک کم از کم 20 psi برقرار رکھتا ہے، جہاں سب سے کم دباؤ جنکشن N32 پر 20.11 psi ہے۔ 5.77 پر یہ 19.8 psi ہے، اور تلاش میں 13 حل لگے۔ طلب اسکیل کے لیے 3 درج کریں اور چلائیں پر کلک کریں: جنکشن N32 غیر اسکیل شدہ 111 psi سے گر کر 85.99 psi ہو جاتا ہے، اور لنک L112 0.535 ft/sec سے بڑھ کر 3.13 ft/sec ہو جاتا ہے۔</p>';
// The Pump energy chapter (Task 785). Held by dev/lpn-spike/user-guide-energy-harness.js.
$ec_lang['lpn_guide_en_read_term']='رپورٹ پڑھنا';
$ec_lang['lpn_guide_en_read_def']='<p>پانی، رپورٹس، پمپ توانائی چنیں۔ رپورٹ آخری توسیعی مدت کے سمولیشن پر ہر پمپ کی طاقت کا انٹیگرل لیتی ہے، اس لیے اسے 0 سے زیادہ کل رن کا وقت اور ایک حساب درکار ہے۔ ہر پمپ کے لیے یہ درج کرتی ہے: رن کا %، کارکردگی، اوسط kW، چوٹی kW، kWh، اور لاگت۔ اوسط kW اس وقت کی اوسط ہے جب پمپ چل رہا تھا، بیکار مدتوں پر نہیں۔ جدول کے نیچے استعمال شدہ توانائی، توانائی کی لاگت، چوٹی طاقت کا استعمال، چوٹی طلب کی لاگت، اور کل لاگت ہیں۔ جس نیٹ ورک میں پمپ نہ ہوں اس کی رپورٹ کرنے کو کچھ نہیں۔</p>';
$ec_lang['lpn_guide_en_set_term']='اعداد کیا طے کرتا ہے';
$ec_lang['lpn_guide_en_set_def']='<p>ترتیبات، توانائی میں پمپ کی کارکردگی (فیصد) ہے، جو ہر اس پمپ کے لیے استعمال ہوتی ہے جس کا کارکردگی کا وکر نہ ہو، ایک کلوواٹ گھنٹے کے لیے طاقت کی قیمت، ایک قیمت کا پیٹرن جو ہر پیٹرن اسٹیپ پر قیمت کو ضرب دیتا ہے، فی kW چوٹی طلب کا چارج، اور ایک کرنسی کا متن جو لاگتوں کے ساتھ چھپتا ہے اور لاگتوں کو تبدیل نہیں کرتا۔ پمپ خصوصیات میں اپنی قیمت، قیمت کا پیٹرن اور کارکردگی کا وکر رکھ سکتا ہے۔ قیمتیں، پیٹرن، چوٹی طلب کا چارج، پمپ کی کارکردگی (فیصد)، اور پمپ کی اپنی قدریں توانائی کی لاگت کے زمرے میں ہیں، اس لیے منظرنامہ انہیں اپنی قدر سے بدل سکتا ہے۔ جب کوئی قیمت نہ دی گئی ہو، یا قیمت صفر ہو، تو ہر لاگت صفر ہوتی ہے اور رپورٹ یہی کہتی ہے۔ ایپلیکیشن کوئی قیمت تجویز نہیں کرتی۔</p>';
$ec_lang['lpn_guide_en_example_def']='<p>Net1 کی مثال کھولیں، جس کا کل رن کا وقت 24:00 ہے، اور حل کریں۔ پانی، رپورٹس، پمپ توانائی چنیں۔ پمپ L9 رن کے 65.71% کے لیے 75% کی کارکردگی پر چلتا ہے، اور اوسطاً 96.22 kW، چوٹی پر 96.71 kW، اور 1518 kWh استعمال کرتا ہے۔ کوئی قیمت نہیں دی گئی، اس لیے لاگت 0 ہے اور رپورٹ یہی کہتی ہے۔ ترتیبات، توانائی میں طاقت کی قیمت کے لیے 0.12 درج کریں اور دوبارہ حل کریں: L9 کی لاگت 182 ہے، جو کل لاگت ہے۔</p>';
// The Contour plot chapter (Task 785). Held by dev/lpn-spike/user-guide-contour-harness.js.
$ec_lang['lpn_guide_ct_what_term']='پلاٹ کیا ہے';
$ec_lang['lpn_guide_ct_what_def']='<p>پانی، گراف، کنٹور چنیں۔ قطار کھلے ہوئے منظرنامے میں پلاٹ کو ہموار بھرائی اور لیبل والی لکیروں کے ساتھ آن کرتی ہے، دباؤ استعمال کرتے ہوئے اگر نوڈ ابھی رنگین نہ ہوں، اور باکس کھولتی ہے۔ پلاٹ نوڈ رنگوں کو پائپوں کے ساتھ اور ان کے پاس درمیانی پائپ لمبائی کے ایک مقررہ ضرب تک پھیلاتا ہے، بیرونی حصے پر مدھم ہوتے ہوئے۔ یہ پمپوں، والوز یا بند لنکس کے آر پار رنگ نہیں کرتا۔ رنگ کی کلید کے نیچے کی سطر بتاتی ہے کہ پلاٹ کتنے نوڈ اور پائپ استعمال کرتا ہے، پائپوں کے پاس پہنچ، اور لکیروں کا وقفہ۔ بہت کم نوڈ ہوں تو یہی بتاتی ہے۔</p>';
$ec_lang['lpn_guide_ct_box_term']='باکس';
$ec_lang['lpn_guide_ct_box_def']='<p>کنٹور دکھائیں، جب نشان ہٹا ہو، بھرائی اور لکیریں چھپاتا ہے اور نوڈ رنگ رکھتا ہے۔ باکس میں نوڈ کو رنگ دیں بذریعہ اور رنگ کی اسکیم بھی ہیں، جو وہی دو ترتیبات ہیں جو ترتیبات، بصری پیشکش، نوڈ رنگ میں ہیں، بھرائی (کوئی نہیں، ہموار، یا بینڈز، جو ہر کلاس کو سپاٹ رنگتا ہے)، بھرائی کی دھندلاہٹ، کنٹور لکیریں ان کے وقفے اور لیبلز کے ساتھ، اور درمیانی پائپ لمبائی کے ضرب میں بفر۔ زمین پر رکھے ہوئے پراجیکٹ میں، باکس نوڈوں کے درمیان زمین Mapbox DEM سے بھی لے سکتا ہے، اس کے بعد کہ وزیٹر نیٹ ورک کے علاقے کے ٹائل نمبر بھیجنے پر رضامند ہو۔ یہ ترتیبات پراجیکٹ کے ساتھ محفوظ ہوتی ہیں اور منظرنامہ انہیں اپنی قدر سے بدل سکتا ہے۔ پلاٹ صرف ڈسپلے بدلتا ہے، نیٹ ورک نہیں۔</p>';
$ec_lang['lpn_guide_ct_example_def']='<p>Net1 کی مثال کھولیں اور پانی، گراف، کنٹور چنیں۔ نوڈ دباؤ کے مطابق رنگین ہوتے ہیں، اور رنگ کی کلید کے نیچے کی سطر 9 نوڈ، 11 پائپ، ان کے پاس درمیانی پائپ لمبائی کے 2.5 گنا کی پہنچ، اور ہر 5 psi پر لکیریں بتاتی ہے۔ پمپ، لنک 9، ان 11 پائپوں میں سے نہیں ہے۔ جب کنٹور دکھائیں سے نشان ہٹے تو نوڈ دباؤ کے مطابق رنگین رہتے ہیں۔</p>';
// The Run report, Status changes, and Full report chapters (Task 785). Held by dev/lpn-spike/user-guide-reports-harness.js.
$ec_lang['lpn_guide_rr_what_term']='رپورٹ میں کیا ہے';
$ec_lang['lpn_guide_rr_what_def']='<p>پانی، رپورٹس، رن چنیں۔ رپورٹ وہ متن ہے جو EPANET انجن نے آخری توسیعی مدت کے سمولیشن کے لیے لکھا، صفحات میں۔ یہ بینر اور نیٹ ورک کے نام سے شروع ہوتی ہے، پھر جنکشنز، ریزروائرز، ٹینکس، پائپس، پمپس اور والوز کو گنتی ہے، پھر تجزیے کے آپشنز بتاتی ہے، اور پھر رن کی ہائیڈرالک حالت کو اس کے انتباہات کے ساتھ درج کرتی ہے۔ کاپی بٹن متن کاپی کرتا ہے۔</p>';
$ec_lang['lpn_guide_rr_example_def']='<p>Net1 کی مثال کھولیں، جو پہلے ہی حل ہو چکی ہے، اور پانی، رپورٹس، رن چنیں۔ خلاصہ 9 جنکشنز، 1 ریزروائر، 1 ٹینک، 12 پائپس، 1 پمپ، اور 0 والوز گنتا ہے۔ ہیڈ نقصان کا فارمولا Hazen-Williams ہے، ہائیڈرالک ٹائم اسٹیپ 1.00 hrs ہے، اور کل دورانیہ 24.00 hrs ہے۔</p>';
$ec_lang['lpn_guide_st_what_term']='کیا درج ہے';
$ec_lang['lpn_guide_st_what_def']='<p>پانی، رپورٹس، حالت میں تبدیلیاں چنیں۔ ہر قطار تبدیلی کا وقت اور تبدیلی بتاتی ہے: پمپ، والو یا پائپ اب کھلا یا اب بند، یا ٹینک اب بھر رہا، خالی ہو رہا، بھرا ہوا، یا خالی۔ جو ٹائم اسٹیپ پوری طرح converge نہ ہوا ہو وہ بھی درج ہوتا ہے۔ فہرست وقت کی ترتیب میں ہے اور صرف تبدیلیاں رکھتی ہے، ہر اسٹیپ نہیں۔ یہ اسی توسیعی مدت کے رن سے پڑھی جاتی ہے جس سے جدولوں کا پینل اور مکمل رپورٹ۔</p>';
$ec_lang['lpn_guide_st_example_def']='<p>Net1 کی مثال کھولیں اور پانی، رپورٹس، حالت میں تبدیلیاں چنیں۔ ٹینک N2 1:00 پر بھر رہا ہے، 11:00 پر خالی ہو رہا ہے، 16:00 پر بھر رہا ہے، اور 22:00 پر خالی ہو رہا ہے۔ پمپ L9 10:00 پر بند، 15:00 پر کھلا، اور 21:00 پر بند ہے۔</p>';
$ec_lang['lpn_guide_fr_what_def']='<p>پانی، رپورٹس، مکمل چنیں۔ جدول میں ہر رپورٹنگ ٹائم اسٹیپ پر ہر نوڈ اور لنک کی ایک قطار ہے، جدولوں کے پینل کی اکائیوں میں۔ اس کے کالم قسم، ID، طلب، ہیڈ، دباؤ، کلورین کا ارتکاز، بہاؤ، رفتار، دباؤ نقصان، پمپ ہیڈ، اور حالت ہیں، اور جہاں اثاثے میں ایسی مقدار نہ ہو وہاں خانہ خالی ہوتا ہے۔ ٹائم اسٹیپ کی فہرست دکھایا جانے والا اسٹیپ چنتی ہے، اور CSV ڈاؤن لوڈ کریں اور رپورٹ پرنٹ کریں ہر اسٹیپ لے جاتے ہیں۔ توسیعی مدت کے سمولیشن کے بغیر، جدول ایک لمحے پر موجودہ حل دکھاتا ہے۔</p>';
$ec_lang['lpn_guide_fr_example_def']='<p>Net1 کی مثال کھولیں اور پانی، رپورٹس، مکمل چنیں۔ 24 اثاثے 25 رپورٹنگ اسٹیپس پر درج ہیں، 0:00 سے 24:00، جو 600 قطاریں ہیں۔ 0:00 پر جنکشن 11 کی طلب 150 gpm، ہیڈ 985.23 ft H2O، اور دباؤ 119.26 psi ہے۔</p>';
// The Calibration chapter (Task 785). Held by dev/lpn-spike/user-guide-calibration-harness.js.
$ec_lang['lpn_guide_cal_what_term']='رپورٹ کس کا موازنہ کرتی ہے';
$ec_lang['lpn_guide_cal_what_def']='<p>پانی، رپورٹس، کیلیبریشن چنیں۔ پیرامیٹر کی فہرست چنتی ہے کہ فائل کیا ناپتی ہے: طلب، ہیڈ، دباؤ، کلورین کا ارتکاز، بہاؤ، یا رفتار۔ ہر پیرامیٹر کے لیے ایک فائل رکھی جاتی ہے، اور کیلیبریشن فائل لوڈ کریں… بٹن فائل چننے والا کھولتا ہے۔ رپورٹ کے تین صفحات ہیں۔ اعداد و شمار ہر مقام کے لیے مشاہدات کی تعداد، مشاہدہ شدہ اوسط، حساب شدہ اوسط، اوسط غلطی، اور RMS غلطی دیتے ہیں، پھر تمام مقامات کے لیے مجموعی نیٹ ورک کی قطار اور اوسطوں کے درمیان باہمی تعلق۔ باہمی تعلق کا پلاٹ ہر پیمائش کو اس کی مشاہدہ شدہ قدر کے مطابق افقی اور حساب شدہ قدر کے مطابق عمودی رکھتا ہے، ایک وتری لکیر کے ساتھ جہاں دونوں متفق ہوں۔ اوسطوں کا موازنہ ہر مقام کے لیے مشاہدہ شدہ اور حساب شدہ اوسط کو بارز کے جوڑے کے طور پر کھینچتا ہے۔</p><p>حساب شدہ قدر توسیعی مدت کے رن سے پڑھی جاتی ہے، اور دو رپورٹنگ اسٹیپس کے درمیان کی پیمائش کا موازنہ ان کے درمیان انٹرپولیٹ کی ہوئی قدر سے کیا جاتا ہے۔ جو پیمائش رن کے رپورٹ کیے ہوئے اوقات سے باہر ہو اسے چھوڑ دیا جاتا ہے اور گنا جاتا ہے۔ ایک لمحے کے حل کے ساتھ، ہر پیمائش کا موازنہ اسی ایک نتیجے سے ہوتا ہے، چاہے فائل کوئی بھی وقت دے۔ رپورٹ نیٹ ورک کے حل ہونے کے بعد بھرتی ہے۔</p>';
$ec_lang['lpn_guide_cal_file_term']='کیلیبریشن فائل';
$ec_lang['lpn_guide_cal_file_def']='<p>ایک متن کی فائل جس کی ہر سطر میں مقام کی ID، وقت، اور ناپی ہوئی قدر ہو۔ وقت سمولیشن کے آغاز سے ناپا جاتا ہے، اعشاری گھنٹوں یا گھنٹے:منٹ میں۔ سیمی کولن تبصرہ شروع کرتا ہے۔ جس سطر میں صرف وقت اور قدر ہو وہ اپنے اوپر کے مقام کی ہے۔ قدریں پراجیکٹ کی اکائیوں میں پڑھی جاتی ہیں، اور رپورٹ بتاتی ہے کہ کون سی اکائی ہے۔ جو مقام نیٹ ورک میں نہ ہو وہ درج ہوتا ہے اور اس کی پیمائشیں چھوڑی ہوئی گنی جاتی ہیں، جو سطر پڑھی نہ جا سکے وہ سطر کے نمبر سے درج ہوتی ہے، اور باقی فائل استعمال ہوتی ہے۔ فائل کھلے ہوئے پراجیکٹ اور صرف اس صفحہ لوڈ کے لیے میموری میں رکھی جاتی ہے۔ یہ پراجیکٹ کے ساتھ یا اس آلے پر محفوظ نہیں ہوتی۔ جب وقتی سلسلے کا چارٹ وہی مقدار دکھائے تو ناپی ہوئی قدریں اس پر حلقوں کے طور پر کھینچی جاتی ہیں۔</p>';
$ec_lang['lpn_guide_cal_example_def']='<p>Net1 کی مثال کھولیں، اسے حل کریں، اور پانی، رپورٹس، کیلیبریشن چنیں۔ دباؤ چنے ہوئے ہو تو ایسی فائل لوڈ کریں جو جنکشن 11 کو 0:00 پر 118.5 psi اور 12:00 پر 121.0 psi، جنکشن 31 کو 6:00 پر 110.2 psi اور 18:00 پر 108.7 psi، اور جنکشن 99 کو 0:00 پر 50 psi دے، اس کے بعد ایک ایسی سطر جو ڈیٹا نہ ہو۔ رپورٹ بتاتی ہے کہ فائل میں 3 مقامات پر 5 پیمائشیں ہیں، جنکشن 99 کو نیٹ ورک میں نہیں کے طور پر 1 چھوڑی ہوئی پیمائش کے ساتھ نام دیتی ہے، اور ناقابل مطالعہ سطر درج کرتی ہے۔ اعداد و شمار جنکشن 11 کو 2 مشاہدات، 119.75 psi کی مشاہدہ شدہ اوسط، 116.53 psi کی حساب شدہ اوسط، 3.98 کی اوسط غلطی، اور 5.12 کی RMS غلطی کے ساتھ دکھاتے ہیں۔ جنکشن 31 کے 109.45، 118.71، 9.26 اور 9.79 ہیں۔ نیٹ ورک کی قطار میں 4 مشاہدات، 6.62 کی اوسط غلطی، اور 7.81 کی RMS غلطی ہے۔</p>';
// Where the Guide lists its own keys, so that a search for one finds it.
$ec_lang['lpn_guide_using_heading']='رہنما کا استعمال';
$ec_lang['lpn_guide_keys_term']='رہنما کے کی بورڈ شارٹ کٹس';
$ec_lang['lpn_guide_keys_def']='<table class="lpn-notes-table"><tbody><tr><td>?</td><td>صارف رہنما کو اس ٹول بار بٹن یا مینو قطار پر کھولیں جو پوائنٹر کے نیچے ہو یا جس پر فوکس ہو۔ کہیں اور، اسے تلاش کے خانے کے منتخب ہونے کے ساتھ کھولیں۔ جب کسی خانے میں ٹائپ ہو رہا ہو یا کوئی سوال کھلا ہو تو یہ کی اسے نہیں کھولتی۔</td></tr><tr><td>F1</td><td>صارف رہنما کو اس باکس کے اندراج پر کھولیں جس پر فوکس ہے۔</td></tr><tr><td>Ctrl+K</td><td>صارف رہنما کو تلاش کے خانے کے منتخب ہونے اور کسی بھی منتخب متن، 80 حروف تک، کے اس میں ہونے کے ساتھ کھولیں۔ یہ براؤزر کی اپنی Ctrl+K کی جگہ لیتی ہے، سوائے جب کوئی سوال کھلا ہو، تب صارف رہنما نہیں کھلتا۔</td></tr><tr><td>/</td><td>جب صارف رہنما پر فوکس ہو تو تلاش کا خانہ منتخب کریں۔</td></tr><tr><td>Esc</td><td>جب صارف رہنما پر فوکس ہو، اسے بند کریں اور فوکس وہاں لوٹائیں جہاں تھا۔</td></tr></tbody></table>';
$ec_lang['lpn_guide_use_term']='تلاش، لنکس، اور جو یاد رکھا جاتا ہے';
$ec_lang['lpn_guide_use_def']='<p>تلاش بڑے حروف اور اعراب کو نظرانداز کرتی ہے اور ان قطاروں اور اندراجات کو درج کرتی ہے جن میں ٹائپ کیا ہوا متن ہو۔ قطار چننے سے دکھایا جاتا ہے کہ وہ کنٹرول کہاں ہے۔ یہ کنٹرول کو کبھی نہیں چلاتا۔ فون پر، جہاں ٹول بار تہہ ہوا ہے، ٹول بار کی قطار وہ مینو قطار کھولتی ہے جو وہی کام کرتی ہے۔</p><p>صفحے کا پتہ اس اندراج کی پیروی کرتا ہے جو پڑھا جا رہا ہو، جیسے <code>Looped-Network.php#guide</code>، تاکہ اسے اس اندراج کے لنک کے طور پر کاپی کیا جا سکے۔ صارف رہنما بند کرنے سے یہ صاف ہو جاتا ہے۔ صارف رہنما اس براؤزر میں یاد رکھتا ہے کہ آیا وہ کھلا تھا، اس کی جگہ اور سائز، اور آیا اس کے مندرجات کی فہرست چھپی ہے۔ فون پر مندرجات کی فہرست چھپی ہوئی شروع ہوتی ہے۔</p>';
// Under a toolbar button in the User guide, naming the menu row that does the same thing.
// {menu} becomes a path such as "Edit > Delete", drawn with chevrons; keep {menu} as it is.
$ec_lang['lpn_guide_also']='{menu} میں بھی';
$ec_lang['lpn_guide_how_popup']='کوئی اثاثہ یا متن منتخب کرنے پر خصوصیات کھل جاتی ہیں۔';
$ec_lang['lpn_guide_not_shown']='یہ کنٹرول اس وقت اسکرین پر نہیں ہے۔';
// The box's two context headings. "Tables" holds the two table-help entries that used to sit only
// in the Notes list (lpn_notes_6/7, moved rather than duplicated); "Map" is new -- the digit tool
// keys, Undo and the zoom keys had never been gathered anywhere before.
$ec_lang['lpn_hotkeys_tables_heading']='جدول';
$ec_lang['lpn_hotkeys_map_heading']='نقشہ';
$ec_lang['lpn_hotkeys_map_term']='نقشے کے کیبورڈ شارٹ کٹس';
// Same shape as lpn_notes_7_def: one table, one row per key. The ten digits are LPN_TOOL_KEYS in
// js/looped-network.js; Select also answers to Esc and Delete to the Delete key
// (LPN_TOOL_ALT_KEYS); Ctrl+Z is undo(); +/- and = are keyZoom() (ROADMAP Task 682).
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>0 یا Esc</td><td>منتخب کریں۔</td></tr><tr><td>2</td><td>جنکشن شامل کریں۔</td></tr><tr><td>3</td><td>ریزروائر شامل کریں۔</td></tr><tr><td>4</td><td>ٹینک شامل کریں۔</td></tr><tr><td>5</td><td>پائپ شامل کریں۔</td></tr><tr><td>6</td><td>پمپ شامل کریں۔</td></tr><tr><td>7</td><td>والو شامل کریں۔</td></tr><tr><td>8</td><td>گاہک شامل کریں۔</td></tr><tr><td>9</td><td>متن شامل کریں۔</td></tr><tr><td>Delete</td><td>انتخاب حذف کریں۔</td></tr><tr><td>Ctrl+Z</td><td>آخری تبدیلی کو واپس کریں۔</td></tr><tr><td>+ یا =</td><td>زوم ان کریں۔</td></tr><tr><td>-</td><td>زوم آؤٹ کریں۔</td></tr></tbody></table>';
// The W row of the Map table. Its own key, spliced into the table by Looped-Network.php, because a new row in
// lpn_hotkeys_map_def is new markup that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_zoomwin_def']='زوم ونڈو: اس علاقے پر زوم کرنے کے لیے نقشے پر مستطیل گھسیٹیں۔';
// The menu chords (Task 748): Alt+Shift+letter on Windows and Linux, Ctrl+Option on a Mac, and F10.
// Exactly two rows (Tom, 2026-10-03: "show only the Alt+Shift and the F10"); the letters themselves
// are assigned per language by menuMnemonics() and shown on the menus, never listed here.
// A separate block rather than rows in lpn_hotkeys_map_def, because a new row there is new markup
// that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_menu_heading']='مینو';
$ec_lang['lpn_hotkeys_menu_term']='مینو کے کیبورڈ شارٹ کٹس';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+حرف</td><td>اس حرف والا مینو کھولیں، پھر کسی قطار کا حرف دبا کر اسے چنیں۔ کیبورڈ استعمال کرتے وقت حروف دکھائی دیتے ہیں۔ Mac پر Ctrl+Option استعمال کریں۔</td></tr><tr><td>F10</td><td>مینو بار پر جائیں۔</td></tr></tbody></table>';
// The Screenshot keys. A separate block, for the reason given above the menu block.
$ec_lang['lpn_hotkeys_snip_heading']='اسکرین شاٹ';
$ec_lang['lpn_hotkeys_snip_term']='اسکرین شاٹ کے کیبورڈ شارٹ کٹس';
$ec_lang['lpn_hotkeys_snip_def']='<table class="lpn-notes-table"><tbody><tr><td>S</td><td>اسکرین شاٹ کھلا ہونے پر اسنِپ لیں۔</td></tr><tr><td>E</td><td>مارک اپ ویو میں ایریزر۔</td></tr><tr><td>Ctrl+Z, Ctrl+Y</td><td>مارک اپ ویو میں کالعدم اور دوبارہ کریں۔</td></tr><tr><td>Esc</td><td>اسنِپ منسوخ کریں، یا ایریزر سے نکلیں۔ مارک اپ ویو میں کچھ بنا نہ ہو تو اسے بند کریں۔</td></tr></tbody></table>';
// ---- "Something wrong here?" (ROADMAP Tasks 207 and 768) ----
// Two sites, one behaviour -- a standing cell in the map's bottom strip, and the same control inside
// the solver's diagnostic box when one is on screen. The first click opens a box; Send is the second.
// The thank-you must never imply an answer: a reply comes only to somebody who left an address.
$ec_lang['lpn_wrong_btn']='یہاں کچھ غلط ہے؟';
// The standing message's own Hide control. A hidden message leaves the map and waits as the top row of the
// message history (the down-arrow glyph), marked by lpn_msglog_hidden, with lpn_msglog_unhide to bring it back.
$ec_lang['lpn_msglog_hidden']='چھپا ہوا';
$ec_lang['lpn_msglog_unhide']='دکھائیں';
$ec_lang['lpn_status_hidden_tip']='چھپا ہوا پیغام نقشے پر دوبارہ دکھائیں۔';
// Rewritten for the two-click box (Task 768); TGH's 2026-09-07 wording described one press.
$ec_lang['lpn_wrong_tip']='اس صفحے پر خرابی کی رپورٹ کریں۔ یہ ایک باکس کھولتا ہے جس میں مسئلہ چنا جا سکتا ہے، تبصرہ شامل کیا جا سکتا ہے، اور جواب چاہیے تو ای میل پتہ درج کیا جا سکتا ہے۔ تمام فیلڈز اختیاری ہیں، اور ارسال کریں دبانے تک کچھ نہیں بھیجا جاتا۔';
$ec_lang['lpn_wrong_thanks']='شکریہ۔ آپ کی رپورٹ موصول ہو گئی۔';
// The box "Something wrong here?" opens (ROADMAP Task 768). Every field is optional; Send with
// nothing in it posts only the anonymous tally the button always posted. The four picks are canned
// phrases a visitor may toggle in any combination. lpn_fb_sends must stay true to send-feedback.php
// and to the "Messages you send us" row of privacy.php.
$ec_lang['lpn_fb_intro']='تیار شدہ پیغامات (اختیاری)۔ ارسال کریں دبانے تک کچھ نہیں بھیجا جاتا۔';
$ec_lang['lpn_fb_pick_numbers']='اعداد غلط لگتے ہیں';
$ec_lang['lpn_fb_pick_broken']='کچھ کام نہیں کیا';
$ec_lang['lpn_fb_pick_wording']='الفاظ یا ترجمہ غلط ہے';
$ec_lang['lpn_fb_pick_confusing']='یہ الجھا ہوا ہے';
$ec_lang['lpn_fb_comment']='تبصرے (اختیاری)';
$ec_lang['lpn_fb_email']='ای میل (اختیاری، صرف اگر آپ جواب چاہتے ہیں)';
$ec_lang['lpn_fb_sends']='یہ کیا بھیجتا ہے: اس صفحے کا نام، آپ کی زبان، سائٹ کا ورژن، نقشے پر موجود پیغام کا کوڈ (اگر کوئی ہو)، اور جو آپ نے چنا یا لکھا۔ آپ کی ڈرائنگ یا آپ کا نیٹ ورک کبھی نہیں۔ آپ کا ای میل پتہ صرف آپ کو جواب دینے کے لیے استعمال ہوتا ہے۔';
$ec_lang['lpn_fb_send']='ارسال کریں';
$ec_lang['lpn_fb_sending']='بھیجا جا رہا ہے…';
$ec_lang['lpn_fb_failed']='یہ ہم تک نہیں پہنچا۔ جو آپ نے لکھا وہ ابھی یہیں ہے، اس لیے دوبارہ کوشش کی جا سکتی ہے۔';
$ec_lang['lpn_fb_bad_email']='یہ ای میل پتہ درست نہیں لگتا۔ اسے درست کریں، یا خالی چھوڑ دیں۔';
$ec_lang['lpn_fb_busy']='پچھلے چند منٹوں میں بہت زیادہ پیغامات آ چکے ہیں۔ جو آپ نے لکھا وہ ابھی یہیں ہے، اس لیے بعد میں دوبارہ کوشش کی جا سکتی ہے۔';
$ec_lang['lpn_status_example_opened']='{name} کو کاپی کے طور پر کھولا گیا۔ اسے فائل، محفوظ بطور سے محفوظ کریں۔';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='یہ صفحہ ڈرائنگ ایریا کا سائز معلوم نہیں کر سکا، اس لیے نقشہ آخری وہ منظر دکھا رہا ہے جو یہ شمار کر سکا تھا۔ ونڈو کا سائز بدلنے سے یہ دوبارہ کوشش کرتا ہے۔ اگر یہ بار بار ہو رہا ہے، تو اس کی عام وجہ کوئی براؤزر ایکسٹینشن ہے جو صفحے کی پیمائشوں کو روکتا ہے۔';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='بنیادی نیٹ ورک، L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='دو ریزروائر، ایک پمپ اور ایک چھوٹا لوپ۔ لیٹر فی سیکنڈ، میٹر اور ملی میٹر کے ساتھ۔';
$ec_lang['lpn_ex_basic_us_title']='بنیادی نیٹ ورک، gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='دو ریزروائر، ایک پمپ اور ایک چھوٹا لوپ۔ گیلن فی منٹ، فٹ اور انچ کے ساتھ۔';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 اور قواعد پر مبنی کنٹرولز';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='کلورین کے ساتھ ایک فرضی EPANET مثال، 1 ریزروائر اور 1 ٹینک۔';
$ec_lang['lpn_ex_net1_si_title']='EPANET Net1 اور قواعد پر مبنی کنٹرولز، L/s (SI)';
$ec_lang['lpn_ex_net1_si_desc']='لیٹر فی سیکنڈ، میٹر اور ملی میٹر کے ساتھ۔ گیلن فی منٹ، فٹ اور انچ سے تبدیل کی گئی ایک فرضی EPANET مثال، جس میں کلورین، 1 ریزروائر، 1 ٹینک، 1 پمپ اور قواعد پر مبنی دو کنٹرولز ہیں۔';
$ec_lang['lpn_ex_net2_si_title']='EPANET Net2, L/s (SI)';
$ec_lang['lpn_ex_net2_si_desc']='لیٹر فی سیکنڈ، میٹر اور ملی میٹر کے ساتھ۔ برانفورڈ، کنیکٹی کٹ کی ایک EPANET مثال، جسے گیلن فی منٹ، فٹ اور انچ سے تبدیل کیا گیا ہے: 35 جنکشنز اور 1 ٹینک، بغیر ریزروائر، بغیر پمپ اور بغیر والوز کے، تقریباً 2 کلومیٹر ضرب 4 کلومیٹر۔ فلورائیڈ، ایک غیر تعاملی مادہ، ایک ماخذ پر داخل ہوتا ہے۔';
$ec_lang['lpn_ex_net2_title']='EPANET Net2, gpm (US)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='گیلن فی منٹ، فٹ اور انچ کے ساتھ۔ برانفورڈ، کنیکٹی کٹ کی ایک EPANET مثال: 35 جنکشنز اور 1 ٹینک، بغیر ریزروائر، بغیر پمپ اور بغیر والوز کے، تقریباً 1 میل ضرب 2 میل۔ فلورائیڈ، ایک غیر تعاملی مادہ، ایک ماخذ پر داخل ہوتا ہے۔';
$ec_lang['lpn_ex_net3_si_title']='EPANET Net3, L/s (SI)';
$ec_lang['lpn_ex_net3_si_desc']='لیٹر فی سیکنڈ، میٹر اور ملی میٹر کے ساتھ۔ نووٹو، کیلیفورنیا کی ایک EPANET مثال، جسے گیلن فی منٹ، فٹ اور انچ سے تبدیل کیا گیا ہے، جس کے پیچھے دنیا کا نقشہ ہے: 92 جنکشنز، 3 ٹینک اور 2 ریزروائرز، بغیر والوز کے، تقریباً 8 کلومیٹر مربع۔ 24 گھنٹے کا توسیعی مدتی سمولیشن، جھیل سے ایک ماخذ ٹریس کے ساتھ۔';
$ec_lang['lpn_ex_net3_title']='EPANET Net3, gpm (US)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='گیلن فی منٹ، فٹ اور انچ کے ساتھ۔ نووٹو، کیلیفورنیا کی ایک EPANET مثال، جس کے پیچھے دنیا کا نقشہ ہے: 92 جنکشنز، 3 ٹینک اور 2 ریزروائرز، بغیر والوز کے، تقریباً 5 میل مربع۔ 24 گھنٹے کا توسیعی مدتی سمولیشن، جھیل سے ایک ماخذ ٹریس کے ساتھ۔';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center, gpm (US)';
$ec_lang['lpn_ex_elm_street_desc']='گیلن فی منٹ، فٹ اور انچ کے ساتھ۔ پریسکاٹ ویلی، ایریزونا: 17 جنکشنز، 1 ریزروائر اور 1 پمپ۔ ایک تجارتی سائٹ، جسے زیادہ سے زیادہ روزانہ طلب کے اوپر آگ بجھانے کے بہاؤ کے لیے، وقت کے ایک لمحے پر حل کیا گیا، سائٹ پلان پر بنایا گیا ہے۔';
$ec_lang['lpn_tool_undo']='کالعدم کریں';
$ec_lang['lpn_confirm_example']='یہ مثال آپ کے موجودہ نیٹ ورک میں شامل کر دے گی۔ جاری رکھیں؟';
$ec_lang['lpn_field_diameter']='قطر';
$ec_lang['lpn_demand_tip']='اس نوڈ پر نیٹ ورک سے نکالا گیا بہاؤ۔ یہاں نیٹ ورک میں ڈالے گئے بہاؤ کے لیے منفی عدد لکھیں۔';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='یہ اکائی طے کرتی ہے کہ آپ کے ان پٹس کیسے پڑھے جاتے ہیں';
$ec_lang['lpn_units_warn_lead']='{unit} اس چیز کی اکائی ہے جو آپ یہاں درج کرتے ہیں:';
$ec_lang['lpn_units_options_head']='جب آپ کوئی اکائی بدلتے ہیں:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='غیر تباہ کن';
$ec_lang['lpn_units_nondestructive_desc']='غیر تباہ کن: ہر اندراج کو ویسا ہی چھوڑتا ہے اور اسے نئی اکائی میں دوبارہ سمجھتا ہے۔';
$ec_lang['lpn_units_destructive']='تباہ کن';
$ec_lang['lpn_units_destructive_desc']='تباہ کن: ہر اندراج کو ریاضیاتی تبدیلی کے ذریعے دوبارہ لکھتا ہے، تاکہ نیٹ ورک تبدیلی کی گنجائش کی حد تک طبعی طور پر تقریباً وہی رہے۔ یہ اصل اندراجات کھو دیتا ہے۔ کالعدم کرنے سے وہ واپس آ جاتے ہیں۔';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='قدریں ({n}) اب {unit} کا مطلب رکھتی ہیں۔ کچھ بھی دوبارہ نہیں لکھا گیا۔';
$ec_lang['lpn_status_converted']='قدریں ({n}) {unit} میں دوبارہ لکھی گئیں۔';
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
$ec_lang['lpn_units_length']='لمبائی';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='نقشے کے احداثیات';
$ec_lang['lpn_units_mapcoords_deg']='ڈگری';
$ec_lang['lpn_units_usft']='US سروے فٹ';
$ec_lang['lpn_units_elevhead']='بلندی اور ہیڈ';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='دباؤ نقصان کا میلان';
$ec_lang['lpn_result_gradient_tip']='دباؤ نقصان کو پائپ کی لمبائی پر تقسیم کیا گیا۔ مختلف لمبائیوں کے پائپوں کا ایک ڈیزائن حد کے مقابلے میں موازنہ کرنے کے لیے اسے استعمال کریں۔';
$ec_lang['lpn_result_water_age']='پانی کی عمر';
$ec_lang['lpn_result_water_age_tip']='اس مقام تک پہنچنے والے پانی نے نظام میں جو وقت گزارا ہے۔ جہاں بہاؤ ملتے ہیں، وہاں عدد آنے والی عمروں کا بہاؤ کے لحاظ سے وزنی اوسط ہے۔ ٹینک میں یہ رکھے گئے پانی کی اوسط عمر ہے، اس لیے آہستہ گردش کرنے والا ٹینک عموماً نیٹ ورک کا سب سے پرانا پانی رکھتا ہے۔ اس کے مقابلے کے لیے کوئی ضابطہ حد نہیں، اس لیے اسے ماڈل کیے جانے والے نظام کے حالات کے مقابل پرکھیں۔';
$ec_lang['lpn_result_source_share']='سورس شیئر';
$ec_lang['lpn_result_source_share_tip']='اس مقام تک پہنچنے والے پانی کا کتنا حصہ ٹریس نوڈ سے آیا۔ یہی سورس ٹریس تجزیہ بتاتا ہے۔';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='پانی کی اوسط عمر';
$ec_lang['lpn_result_avg_source_share']='اوسط سورس شیئر';
$ec_lang['lpn_result_avg_concentration']='اوسط ارتکاز';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='رگڑ عامل';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='تعامل کی شرح';
$ec_lang['lpn_result_status']='حالت';
$ec_lang['lpn_result_status_open']='کھلا';
$ec_lang['lpn_result_status_closed']='بند';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='اس نوڈ پر پانی کی مخفی توانائی، جسے پانی کے کالم کی بلندی کے طور پر لکھا جاتا ہے۔ یہ ایک مطلق بلندی ہے، جبکہ دباؤ ایک گیج پیمائش ہے۔';
// A tank's depth and usable volume (Task 783). Depth is head minus the tank bottom, which is our
// Elevation. Volume is zero at the Lowest water depth, so it is NOT EPANET's tank volume, which also
// counts the water below the lowest water depth (that water is in the mixing volume, it just cannot be drawn down).
$ec_lang['lpn_result_depth']='گہرائی';
$ec_lang['lpn_result_depth_tip']='دکھائے گئے وقت پر ٹینک میں پانی کی گہرائی، ٹینک کے فرش سے اوپر ناپی ہوئی: ہیڈ منفی ٹینک کی بلندی۔';
$ec_lang['lpn_result_tank_volume']='دستیاب حجم';
$ec_lang['lpn_result_tank_volume_tip']='کم ترین پانی کی گہرائی سے اوپر پانی کا حجم، اس لیے اس گہرائی پر یہ صفر ہوتا ہے۔ EPANET کے ٹینک حجم میں کم ترین پانی کی گہرائی سے نیچے کا پانی بھی شامل ہے، جو اب بھی اختلاط اور پانی کی عمر میں شمار ہوتا ہے، اس لیے ٹینک کی بلندی ٹینک کے فرش پر رہتی ہے۔';
$ec_lang['lpn_result_pressure']='دباؤ';
$ec_lang['lpn_result_flow']='بہاؤ';
$ec_lang['lpn_result_velocity']='رفتار';
$ec_lang['lpn_result_headloss']='دباؤ نقصان';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='صرف اسی پراجیکٹ کی سیٹنگز ری سیٹ کریں۔ ڈرائنگ اور دیگر پراجیکٹس تبدیل نہیں ہوتے۔ سیٹنگز کے سیٹ کو دوبارہ استعمال کرنے کے لیے ایسی پراجیکٹ فائل محفوظ کریں جس میں صرف سیٹنگز ہوں۔';
$ec_lang['lpn_reset_all_tip']='ہر پراجیکٹ، ہر پس منظر کی تصویر، ہر سیٹنگ، اور اپنی اکائیوں کے انتخاب کو حذف کریں، پھر صفحہ کو بالکل اسی طرح دوبارہ لوڈ کریں جیسے پہلی بار آنے والا وزیٹر دیکھتا ہے۔ یہ واحد ری سیٹ ہے جو سب کچھ صاف کرتا ہے۔';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='یہ کیلکولیٹر پراجیکٹ کے یونٹس اور اندراجات کو بعینہ محفوظ کرتا ہے، لیکن پہلے یہ اعداد کو محفوظ کرنے کے لیے SI میں تبدیل کرتا تھا۔ یہ پراجیکٹ اس تبدیلی سے پہلے محفوظ کیا گیا تھا، اس لیے اس کے اعداد SI میں محفوظ ہیں۔ کیا انہیں آخری بار موجودہ یونٹس میں تبدیل کیا جائے؟ فیصلہ کرنے میں مدد کے لیے، یہاں کچھ قطر دیے گئے ہیں جو تبدیل ہوں گے، پہلے اور بعد کی قدروں کے ساتھ:';
$ec_lang['lpn_v2_restore_yes']='تبدیل کریں';
$ec_lang['lpn_v2_restore_never']='نہیں۔ دوبارہ کبھی نہ پوچھیں۔';
$ec_lang['lpn_v2_restore_no']='بند کریں تاکہ میں پہلے موجودہ یونٹس چیک کر سکوں';
$ec_lang['lpn_storage_too_new']='یہ پراجیکٹ صفحے کے ایک نئے ورژن نے محفوظ کیا تھا، اس لیے اسے یہاں نہیں کھولا جا سکتا۔';
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
$ec_lang['lpn_tool_file']='فائل';
$ec_lang['lpn_menu_edit']='ترمیم';
$ec_lang['lpn_menu_insert']='داخل کریں';
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
$ec_lang['lpn_menu_map']='نقشہ';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='سڑکوں کا نقشہ دکھائیں';
$ec_lang['lpn_basemap_satellite_show']='سیٹلائٹ تصاویر دکھائیں';
$ec_lang['lpn_basemap_topo_show']='ٹاپو نقشہ دکھائیں';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='جغرافیائی حوالہ شدہ';
$ec_lang['lpn_xymap']='مقامی';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='تبدیل بطور…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='{name} کی کاپی';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:4326), not a fourth case; EPSG:3857 is a
// projected system in meters since Task 775.
$ec_lang['lpn_convas_title']='تبدیل بطور';
$ec_lang['lpn_convas_coordsys_tip']='وہ احداثی نظام جس میں کاپی تبدیل کی جاتی ہے۔ جب یہ اس پراجیکٹ کے نظام سے مختلف ہو تو جگہ کے تعین کے دو مراحل آتے ہیں۔ جو پراجیکٹ پہلے سے جغرافیائی حوالہ شدہ ہو، اس کے لیے دونوں مراحل مکمل شدہ کھلتے ہیں، قبول کرنے یا بدلنے کے لیے تیار۔';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='موجودہ: {crs}';
$ec_lang['lpn_convas_epsg']='EPSG احداثی نظام';
$ec_lang['lpn_convas_epsg_tip']='EPSG رجسٹر سے ایک احداثی نظام چنیں۔ WGS 84 (EPSG:4326)، عرض بلد اور طول بلد، تجویز کردہ انتخاب ہے۔ WGS 84 / Pseudo-Mercator (EPSG:3857)، جسے عام طور پر Web Mercator کہا جاتا ہے، x اور y میٹر میں دیتا ہے، اور خط استوا سے دور اس کے نقشے کے فاصلے زمینی فاصلوں سے زیادہ ہوتے ہیں۔ پائپ کی لمبائیاں دونوں نظاموں میں زمینی فاصلوں کے طور پر نکالی جاتی ہیں۔';
$ec_lang['lpn_convas_unnamed']='بلا نام (مقامی) جغرافیائی حوالہ';
$ec_lang['lpn_convas_unnamed_tip']='لمبائی کے یونٹ میں مقامی احداثیات، دنیا کے نقشے کے ساتھ منسلک۔';
$ec_lang['lpn_convas_none_tip']='لمبائی کے یونٹ میں مقامی احداثیات، ابھی کے لیے بغیر دنیا کے نقشے کے۔';
$ec_lang['lpn_convas_units_tip']='وہ اکائیاں جن میں کاپی تبدیل کی جاتی ہے۔';
$ec_lang['lpn_convas_round']='تبدیل شدہ قدریں گول کریں';
$ec_lang['lpn_convas_round_tip']='گول کرنے کا قدم، جو صرف ان اعداد پر لاگو ہوتا ہے جنہیں یہ تبدیلی دوبارہ لکھتی ہے۔ جن قدروں کی اکائی نہیں بدلتی وہ ویسی ہی رہتی ہیں۔';
$ec_lang['lpn_convas_round_none']='کوئی گولائی نہیں';
$ec_lang['lpn_convas_round_flow']='طلب اور بہاؤ';
$ec_lang['lpn_convas_label_col']='لاحقہ';
$ec_lang['lpn_convas_label_tip']='کاپی کے نقشہ لیبلز پر اس قدر کے بعد شامل کیا گیا متن، جیسے \' mm\' یا \' gpm\'۔ اوپر چنے گئے یونٹ سے پہلے سے بھرا گیا؛ کوئی لاحقہ نہ چاہیے تو اسے خالی کریں۔';
$ec_lang['lpn_convas_oneway']='واپس تبدیل کرنا ایک دوسری تبدیلی ہے، کالعدم نہیں۔ ایک عدد جو تبدیل اور پھر واپس تبدیل کیا جائے وہ بالکل ویسا واپس نہیں آ سکتا جیسا ٹائپ کیا گیا تھا۔';
$ec_lang['lpn_convas_ok']='تبدیل کریں';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} ان چند فہرست شدہ احداثی نظاموں میں سے ایک ہے جن کے پاس قابل استعمال پروجیکشن معلومات نہیں، اس لیے یہ اس میں یا اس سے تبدیل نہیں ہو سکتا۔ کچھ بھی تبدیل نہیں کیا گیا۔';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='تبدیل شدہ کاپی {name} ہے۔ اصل پراجیکٹ تبدیل نہیں ہوا۔';
$ec_lang['lpn_convas_cancelled']='کچھ بھی تبدیل نہیں کیا گیا۔ کاپی بند کر دی گئی ہے، اور اصل پراجیکٹ تبدیل نہیں ہوا۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='اس پراجیکٹ کو ایک نئے ٹیب میں کاپی کریں اور کاپی کو اپنے چنے گئے احداثی نظام اور اکائیوں میں تبدیل کریں۔ جب احداثی نظام بدلتا ہے تو ایک وزرڈ آپ کی رہنمائی کرتا ہے: پہلے آپ کے نیٹ ورک کے پیچھے نقشے کو تقریباً زوم کرنا، پھر نقشے پر آپ کے نیٹ ورک کو زیادہ باریکی سے اسکیل کرنا اور گھمانا۔ یہ پراجیکٹ بالکل ویسا ہی رہتا ہے جیسا ہے۔ کچھ بھی تبدیل کیے بغیر جغرافیائی حوالہ دینے کے لیے اس کی جگہ نقشہ، دنیا کا نقشہ، منسلک کریں استعمال کریں۔';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='یہ پراجیکٹ پہلے سے جغرافیائی حوالہ شدہ ہے، اس لیے نیٹ ورک پہلے سے نقشے پر ہے اور کچھ بھی منتقل نہیں کیا گیا۔ چیک کریں کہ یہ صحیح جگہ پر ہے، پھر ماڈل یہاں رکھیں بٹن اور یہ جگہ برقرار رکھیں بٹن دبائیں۔';
$ec_lang['lpn_georef_intro']='ماڈل رکھنے کے دو مرحلے ہیں۔ مرحلہ 1 تقریبی ہے: ماڈل اسکرین پر ساکت رہتا ہے جبکہ آپ اس کے پیچھے نقشے کو پین اور زوم کرتے ہیں، یہاں تک کہ مقام تقریباً درست اسکیل پر ماڈل کے نیچے آ جائے۔ اس مرحلے میں گردش نہیں ہوتی۔ مرحلہ 2 باریک ہے: خود ماڈل کو گھسیٹیں، اس کا سائز بدلیں اور گھمائیں۔ پراجیکٹ پوری دنیا کے نقشے پر شروع ہوتا ہے، اس لیے پہلے مقام تلاش کریں، پھر ماڈل یہاں رکھیں بٹن دبائیں۔';
$ec_lang['lpn_georef_adjust']='ماڈل اب نقشے سے منسلک ہے، اس لیے یہ نقشے کے ساتھ حرکت کرتا ہے۔ ماڈل کو منتقل کرنے کے لیے گھسیٹیں، سائز بدلنے کے لیے کسی کونے کو گھسیٹیں، یا گھمانے کے لیے ماڈل کے اوپر گول ہینڈل کو گھسیٹیں۔ یا نیچے زمینی فاصلہ اور گردش کا زاویہ درج کریں۔';
$ec_lang['lpn_georef_step1']='مرحلہ 1 از 2 — تیز';
$ec_lang['lpn_georef_step2']='مرحلہ 2 از 2 — باریک بین';
$ec_lang['lpn_georef_step1_hint']='پراجیکٹ اسکرین پر ساکت رہتا ہے۔ اس کے نیچے نقشے کو پین اور زوم کریں یہاں تک کہ نقشہ تقریباً درست مقام تقریباً درست اسکیل پر دکھائے، پھر ماڈل یہاں رکھیں بٹن دبائیں۔';
$ec_lang['lpn_georef_detach']='دوبارہ اٹھائیں';
$ec_lang['lpn_georef_size_prompt']='پورے پراجیکٹ میں سائٹ تقریباً کتنی چوڑی ہے؟';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name}: {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='شارٹ کٹ: {key} دبائیں۔';
$ec_lang['lpn_tool_key_hint_two']='شارٹ کٹ: {key} یا {key2} دبائیں۔';
$ec_lang['lpn_tool_add_chain_tip']='جنکشن اور پائپ کی زنجیر بنائیں: جنکشن شامل کرنے کے لیے نقشے پر ایک پوائنٹ متعین کریں، پھر ہر اگلا پوائنٹ متعین کر کے پائپ اور جنکشن شامل کریں۔ کسی موجودہ نوڈ سے آگے بڑھنے کے لیے اسے متعین کریں۔ زنجیر ختم کرنے کے لیے Esc دبائیں۔';
// The Shape tool (Task 779). The word is Tom's: "we call it a 'Shape'".
$ec_lang['lpn_tool_add_shape']='شکل';
$ec_lang['lpn_tool_add_shape_tip']='نقشے پر ایک پوائنٹ، پولی لائن یا کثیر الاضلاع بنائیں۔ شکل ایک اضافی نوٹیشن ہے اور نیٹ ورک کا حصہ نہیں ہے۔ ہر پوائنٹ متعین کریں، پھر ختم کرنے کے لیے آخری پوائنٹ دوبارہ متعین کریں، Enter دبائیں یا رائٹ کلک کریں۔ شکل کو کثیر الاضلاع کی صورت میں بند کرنے کے لیے پہلا پوائنٹ دوبارہ متعین کریں۔';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='علاقہ منتخب کریں: ونڈو، لیسو یا کثیر الاضلاع۔';
$ec_lang['lpn_area_selected']='{n} منتخب۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='اس رقبے میں کچھ نہیں ملا۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='پائپ کے موڑ نقاط شامل اور حذف کریں۔ موڑ نقطہ شامل کرنے کے لیے پائپ پر پوائنٹ متعین کریں، اسے حذف کرنے کے لیے موڑ نقطہ منتخب کریں، اور منتقل کرنے کے لیے اسے گھسیٹیں۔ موڑ نقطہ خودکار لمبائی بدلتا ہے، لیکن معمولی (مقامی) نقصانات شامل یا تبدیل نہیں کرتا۔';
$ec_lang['lpn_tool_undo_tip']='کالعدم کی تاریخ کی لمبائی = 20 اعمال';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='پورے نیٹ ورک کو نقشے کی ونڈو میں فٹ کریں۔ پہلے فٹ کیے بغیر زوم ونڈو کے لیے W دبائیں، یا مکمل نقشہ دکھائیں ٹول بار بٹن کے کونے میں چھوٹی تکون پر کلک کریں۔ نقشے کے اوپر دائیں زوم کنٹرولز بھی دیکھیں۔';
$ec_lang['lpn_tool_zoom_selection_tip']='منتخب عناصر کو نقشے کی ونڈو میں فٹ کریں۔ پہلے ایک یا زیادہ عناصر منتخب کریں۔';
$ec_lang['lpn_tool_zoom_window_tip']='کونے متعین کریں یا مستطیل گھسیٹیں۔ مکمل نقشہ دکھائیں کے لیے دوبارہ دبائیں۔';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='زوم ان کریں۔ شارٹ کٹ: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='زوم آؤٹ کریں۔ شارٹ کٹ: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='سادہ یا پیچیدہ تلاش اور تبدیلی';
// **"Toolbar"** (Tom renamed it from "Toolbar key" to "Toolbar" on 2026-09-30).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. The row earns its place.
$ec_lang['lpn_help_icons']='ٹول بار';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='نمائش';
$ec_lang['lpn_color_legend_open_tip']='رنگ بندی کی ترتیبات کھولنے اور یہ رنگ بدلنے کے لیے دبائیں۔';
$ec_lang['lpn_color_node_field']='نوڈز کو اس کے مطابق رنگ دیں';
$ec_lang['lpn_color_link_field']='پائپوں کو اس کے مطابق رنگ دیں';
$ec_lang['lpn_color_ramp_sequential']='ترتیب وار';
$ec_lang['lpn_color_ramp_diverging']='دو رخا';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='رینجز کی تعداد';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='رینج کی تقسیم';
$ec_lang['lpn_color_ranges_note']='نیچے دی گئی حدیں ایک بار مقرر ہونے کے بعد ثابت رہتی ہیں؛ وہ بدلتے نتائج کے ساتھ نہیں بدلتیں۔ اوپر رینج کی تقسیم کا طریقہ چننے سے حدیں نظام کی موجودہ حالت سے مقرر ہو جاتی ہیں۔ اگر آپ کسی قدر کو ہاتھ سے بدلیں، تو اوپر کا طریقہ دستی بن جاتا ہے۔';
$ec_lang['lpn_color_criterion_note']='یہ طریقہ اپنی حدیں ایک ڈیزائن معیار سے لیتا ہے، اس لیے جب تک یہ طریقہ چنا ہوا ہے رنگوں کی تعداد مقرر رہتی ہے۔';
$ec_lang['lpn_color_break_number']='ایک حد عدد ہونی چاہیے۔ نقشہ تبدیل نہیں ہوا۔';
$ec_lang['lpn_color_break_order']='ہر حد اپنے سے پہلی حد سے بڑی ہونی چاہیے۔ نقشہ تبدیل نہیں ہوا۔';
$ec_lang['lpn_color_break_count']='رنگوں کی تعداد سے ایک حد کم ہونی چاہیے۔ نقشہ تبدیل نہیں ہوا۔';
$ec_lang['lpn_color_ramp_qualitative']='معیاری اقسام';
$ec_lang['lpn_color_ramp_rainbow']='قوسِ قزح';
$ec_lang['lpn_color_ramp_rainbow_eg']='EPANET سے ملتا ہے';
$ec_lang['lpn_color_example_material']='مواد';
$ec_lang['lpn_color_ramp_ylgnbu']='پیلے سے نیلے تک';
$ec_lang['lpn_color_ramp_rdylbu']='سرخ سے نیلے تک، پیلے سے ہوتے ہوئے';
$ec_lang['lpn_georef_drop']='ماڈل یہاں رکھیں';
$ec_lang['lpn_georef_finish']='یہ جگہ برقرار رکھیں';
$ec_lang['lpn_georef_scale']='ڈرائنگ کی ہر اکائی کے مقابلے میں زمینی فاصلہ';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='خود بخود نکالی گئی۔ بدلنے کے لیے ترمیم کریں۔ فائل کے احداثیات کو بغیر تبدیلی کے زمینی فاصلے کے طور پر استعمال کرنے کے لیے 1 درج کریں، مثلاً ایسی فائل کے لیے جس میں احداثی نظام نہ ہو۔';
$ec_lang['lpn_georef_rotation']='گھڑی کی مخالف سمت گھمائیں (ڈگری)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='پورے ماڈل کی گھڑی کی مخالف سمت میں گردش، تاکہ اسے نئے احداثی نظام کے ساتھ ہم آہنگ کیا جا سکے۔';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='ماڈل کو یہاں مستقل طور پر رکھیں؟ بعد میں بھی عناصر کو ایک ایک کر کے گھسیٹا جا سکتا ہے، لیکن اب آگے بڑھنے سے تمام احداثیات ایک ساتھ تبدیل ہو جاتے ہیں۔ پرانے احداثیات واپس پانے کے لیے، اصل پراجیکٹ پر واپس جائیں اور اس پراجیکٹ کو بغیر محفوظ کیے بند کریں۔';
$ec_lang['lpn_georef_done']='یہ اب عرض بلد/طول بلد پراجیکٹ ہے۔ کسی بھی عنصر کو گھسیٹ کر اس کے اصل مقام کے قریب لے جائیں۔';
$ec_lang['lpn_georef_backdrop_unrotated']='پس منظر کی تصویر ماڈل کے ساتھ منتقل اور نئے سائز کی گئی، لیکن اسے گھمایا نہیں جا سکا۔ اسے سیدھا کرنے کے لیے نقشہ، Background image، Move استعمال کریں۔';
$ec_lang['lpn_georef_empty']='اس فائل میں کوئی نیٹ ورک نہیں، اس لیے رکھنے کو کچھ نہیں۔';
$ec_lang['lpn_georef_unavailable']='جگہ مقرر کرنے کا ٹول لوڈ نہیں ہوا۔ صفحہ دوبارہ لوڈ کر کے دوبارہ کوشش کریں۔';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='پراجیکٹس بدلنے سے پہلے "یہ جگہ برقرار رکھیں" بٹن سے تبدیلی مکمل کریں، یا منسوخ کریں دبائیں۔ جگہ کا تعین صرف اسی پراجیکٹ پر لاگو ہوتا ہے۔';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='محفوظ کرنے سے پہلے "یہ جگہ برقرار رکھیں" بٹن سے جگہ کا تعین مکمل کریں، یا منسوخ کریں دبائیں۔ پراجیکٹ ابھی جگہ کا تعین کیا جا رہا ہے، اس لیے اسکرین پر جو کچھ ہے وہ ابھی وہ نہیں ہے جو فائل میں لکھا جائے گا۔';
$ec_lang['lpn_goto_menu']='ایک عرض بلد اور طول بلد پر جائیں…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_prompt']='عرض بلد اور طول بلد، اسی ترتیب میں';
$ec_lang['lpn_goto_bad']='یہ ایک عرض بلد اور ایک طول بلد نہیں ہے۔ 38 -122 کوشش کریں، ان کے درمیان ایک خالی جگہ کے ساتھ۔';
$ec_lang['lpn_georef_goto']='جائیں…';
$ec_lang['lpn_georef_twopt']='دو معلوم پوائنٹ استعمال کریں';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='جب ڈرائنگ پر دو پوائنٹس کا اصل عرض بلد اور طول بلد معلوم ہو تو ماڈل کو ٹھیک ٹھیک جگہ پر رکھیں۔ ان میں سے ایک متعین کریں، اس کا عرض بلد اور طول بلد درج کریں، پھر دوسرے پوائنٹ کے لیے یہی کریں۔ پوزیشن، اسکیل اور گردش ان دو پوائنٹس سے نکالے جاتے ہیں۔ منسوخ کرنے کے لیے دوبارہ دبائیں، یا Esc دبائیں۔';
$ec_lang['lpn_georef_twopt_pick1']='ڈرائنگ پر وہ پوائنٹ متعین کریں جس کا عرض بلد اور طول بلد آپ کو معلوم ہے۔';
$ec_lang['lpn_georef_twopt_pick2']='اب دوسرا معلوم پوائنٹ متعین کریں، جو پہلے سے جتنا ممکن ہو دور ہو۔';
$ec_lang['lpn_georef_twopt_same']='یہ وہی پوائنٹ ہے جو آپ نے پہلے چنا تھا۔ کوئی مختلف پوائنٹ چنیں۔';
$ec_lang['lpn_georef_twopt_done']='ماڈل اب آپ کے دیے گئے دونوں پوائنٹس پر بیٹھ گیا ہے۔ اسے جانچیں، پھر یہ جگہ برقرار رکھیں بٹن دبائیں۔';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='نچلا پینل';
$ec_lang['lpn_pane_toggle_tip']='نقشے کے نیچے موجود پینل کو دکھائیں یا چھپائیں۔ اس میں گراف اور ہر قسم کے عنصر کا جدول ہوتا ہے۔';
$ec_lang['lpn_pane_resize']='پینل کو لمبا یا چھوٹا کرنے کے لیے گھسیٹیں';
$ec_lang['lpn_pane_tab_junctions']='جنکشنز';
$ec_lang['lpn_pane_tab_reservoirs']='ریزروائرز';
$ec_lang['lpn_pane_tab_tanks']='ٹینکس';
$ec_lang['lpn_pane_tab_pipes']='پائپس';
$ec_lang['lpn_pane_tab_pumps']='پمپس';
$ec_lang['lpn_pane_tab_valves']='والوز';
$ec_lang['lpn_pane_tab_tip']='عناصر میں سپریڈ شیٹ جیسے جدول کے طور پر ترمیم کریں۔ نتیجے کے کالمز میں ترمیم نہیں کی جا سکتی۔ کیبورڈ شارٹ کٹس کے لیے مدد، نوٹس دیکھیں۔';
$ec_lang['lpn_pane_popout']='باکس میں کھولیں';
$ec_lang['lpn_pane_none']='اس نیٹ ورک میں ابھی تک ان میں سے کوئی نہیں ہے۔';
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
$ec_lang['lpn_pane_text_attached']='منسلک';
$ec_lang['lpn_pane_not_used']='استعمال نہیں ہوا';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='{q} کے مطابق فلٹر کیا گیا۔ {all} میں سے {n} دکھائے جا رہے ہیں۔';
$ec_lang['lpn_pane_filter_clear']='سب دکھائیں';
// Added to the filtered table's line (Task 738): rows edited since Filter in table was pressed stay
// in the table even when they no longer match, dimmed and marked, until it is pressed again. {n} is
// how many. Worded as a label and a count so no plural form is needed.
$ec_lang['lpn_pane_filter_stale']='اب مطابقت نہ رکھنے والی قطاریں: {n}۔';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='اس جدول میں کچھ بھی فلٹر سے مطابقت نہیں رکھتا۔';
// Selection only (Task 757): the Tables pane filtered to what is selected on the map. Parallel to
// lpn_pane_filter_note. The line names the Find filter too when both are on.
$ec_lang['lpn_pane_filter_sel_note']='صرف انتخاب۔ {all} میں سے {n} دکھائے گئے ہیں۔';
$ec_lang['lpn_pane_filter_sel_and']='{q} سے فلٹر شدہ اور صرف انتخاب۔ {all} میں سے {n} دکھائے گئے ہیں۔';
$ec_lang['lpn_pane_filter_sel_none']='منتخب عناصر میں سے کوئی بھی اس جدول میں نہیں ہے۔';
$ec_lang['lpn_pane_sel_only']='صرف انتخاب';
$ec_lang['lpn_pane_sel_only_none']='کوئی عنصر منتخب نہیں ہے۔ پہلے نقشے پر عناصر منتخب کریں۔';
// Show scenarios (Tom, 2026-10-05): the table's cell menu switch that lists every asset once per
// scenario, with a Scenario column after ID.
$ec_lang['lpn_pane_scn_show']='منظرنامے دکھائیں';
// Two switches on the cell menu while Show scenarios is on (Tom, 2026-10-07): keep only the rows whose
// scenario holds a value of its own in this table, and keep only the open scenario's rows.
$ec_lang['lpn_pane_scn_ov_only']='صرف اپنی قدریں';
$ec_lang['lpn_pane_scn_cur_only']='صرف موجودہ منظرنامہ';
$ec_lang['lpn_pane_inactive_show']='غیر فعال ٹوپولوجی شامل کریں';
// The line above a table while either switch is on, beside the filter's own Show all. {filters} is one
// or both of the two switch names, joined by a comma; {n} the rows showing, {all} the rows without them.
$ec_lang['lpn_pane_scn_filter_note']='{filters}۔ {all} میں سے {n} دکھائے جا رہے ہیں۔';
// The cell menu's item that removes the selected cells' scenario overrides, so each reads what its
// scenario inherits (Tom, 2026-10-06). Greyed when no selected cell holds one.
$ec_lang['lpn_ovm_child_ask']='ماتحت اپنی قدریں ہٹائیں (کل {n})؟';
$ec_lang['lpn_ovm_child_tip']='ماتحت منظرنامے اس قدر کو اپنی قدر سے بدلتے ہیں (کل {n})۔ ان کی اپنی قدریں ہٹانے کے لیے کلک کریں۔';
$ec_lang['lpn_ovm_dot_clear']='اسے ہٹانے کے لیے کلک کریں۔';
$ec_lang['lpn_ovm_dot_set']='وراثت میں ملی۔ دکھائی گئی قدر کے ساتھ اسے اس منظرنامے میں اپنی قدر بنانے کے لیے کلک کریں۔';
$ec_lang['lpn_pane_clear_override']='اپنی قدر ہٹائیں';
// The tip on a table cell holding a value set in its row's scenario (Tom, 2026-10-06: "Demand alt.:
// Max day"). {category} is an lpn_alt_cat_* name; {alternative} is the alternative's name, which
// in Basic mode is its scenario's.
$ec_lang['lpn_pane_scn_alt_tip']='{category} متبادل: {alternative}';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='زوم اور منتخب کریں';
$ec_lang['lpn_goto_on_map']='نقشے پر دکھائیں';
$ec_lang['lpn_pane_select_on_map']='نقشے پر منتخب کریں';
$ec_lang['lpn_pane_unselect_on_map']='نقشے پر انتخاب ختم کریں';
$ec_lang['lpn_pane_print']='جدول پرنٹ کریں';
// Tom, 2026-10-06. Copy with headings puts the heading line, unit included, above the selected cells; plain
// Copy never does. The two Export rows download the whole table as shown.
$ec_lang['lpn_pane_copy_heads']='کالم عنوانات کے ساتھ کاپی کریں';
// Tom, 2026-10-07. File, Export to, ODS/XLSX/CSV file: a box asking which tables and which scenarios.
// {format} is ODS, XLSX or CSV, the file format's own name, never translated.
$ec_lang['lpn_export_table_title']='{format} میں برآمد کریں';
$ec_lang['lpn_export_table_current']='موجودہ';
$ec_lang['lpn_export_table_all']='سب';
$ec_lang['lpn_export_table_go']='برآمد کریں';
$ec_lang['lpn_export_table_scn_note']='نتائج صرف آخری بار حساب کیے گئے منظرنامے کے لیے برآمد ہوتے ہیں۔';

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
$ec_lang['lpn_menu_project']='پانی';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='پانی کے نیٹ ورک کی ماڈلنگ سے متعلق ہر چیز (اینیمیشن چلانے کے کنٹرولز کے علاوہ)';
$ec_lang['lpn_tables_menu']='جدولیں';
// Water > Morph (Task 781; Tom, 2026-10-14: *"I like the term 'Morph' (Transform) for this feature"*;
// first built as Change type, Tom, 2026-10-05: *"It would be nice to provide a tool under Water or Tables
// to Change node type for any asset, where if it has information that can't be ported to the new
// type, we alert and ask."*). The fly-out reuses lpn_tool_add_junction/_reservoir/_tank. The box it
// asks in lists one line per value lost: {id} is the asset's ID, {property} a field label the
// popup already uses, {value} the number or name with its unit, {scenario} a scenario's name.
// dev/asset-type.md.
$ec_lang['lpn_morph_menu']='قسم تبدیل کریں';
$ec_lang['lpn_morph_tip']='منتخب نوڈز کو جنکشن، ریزروائر یا ٹینک میں، یا منتخب لنکس کو پائپ، پمپ یا والو میں تبدیل کریں۔ ہر ایک اپنی ID، جگہ، کنکشنز اور ہر وہ قدر برقرار رکھتا ہے جو نئی قسم میں بھی موجود ہو۔ اگر کچھ ضائع ہونے والا ہو تو پہلے آپ سے پوچھا جاتا ہے۔';
$ec_lang['lpn_morph_ok']='تبدیل کریں';
// {ids} lists the selected assets of the other kind (nodes when a link type was chosen, and links
// when a node type was chosen), separated by commas.
$ec_lang['lpn_morph_other_kind']='نوڈ کو صرف دوسری قسم کے نوڈ میں اور لنک کو صرف دوسری قسم کے لنک میں تبدیل کیا جا سکتا ہے۔ تبدیل نہیں کیے گئے: {ids}';
// The Properties row shown where a scenario morphs the asset (Task 781): the type it is in this
// scenario, beside the override marker.
$ec_lang['lpn_field_type_tip']='اس منظرنامے میں اس اثاثے کی قسم، جو قسم تبدیل کریں سے مقرر ہوتی ہے۔ والد منظرنامے کی قسم استعمال کرنے کے لیے اپنی قدر ہٹائیں۔';
$ec_lang['lpn_change_type_lost']='یہ قدریں ضائع ہو جائیں گی:';
// The key to the lines under it (Tom, 2026-10-06: *"Provide a key for the loss report. 'ID: Lost entry'."*).
$ec_lang['lpn_change_type_key']='ہر سطر: ID: وہ خاصیت اور قدر جو ضائع ہو جائے گی';
$ec_lang['lpn_change_type_line']='{id}: {property} {value}';
$ec_lang['lpn_change_type_line_scenario']='{id}: {property} {value}، منظرنامہ {scenario} میں';
$ec_lang['lpn_change_type_line_alternative']='{id}: {property} {value}، متبادل {alternative} میں';
$ec_lang['lpn_change_type_more']='اور {n} مزید۔';
// Heads the lines a tank-to-reservoir or reservoir-to-tank change states rather than loses: the
// water surface is carried, so the new head or water depth is listed with its value.
$ec_lang['lpn_change_type_surface']='یہ پانی کی سطح کو وہیں رکھتے ہیں جہاں وہ تھی۔ ریزروائر کا ہیڈ ٹینک کی بلندی اور اس کی پانی کی گہرائی کا مجموعہ ہوتا ہے، اور ٹینک کی پانی کی گہرائی ریزروائر کے ہیڈ منفی اس کی بلندی ہوتی ہے:';
$ec_lang['lpn_change_type_meaning']='یہ کنٹرولز اور رولز اس نوڈ کو جانچتے ہیں جسے تبدیل کیا جا رہا ہے، اور اسے مختلف طور پر پڑھیں گے: جنکشن کو اس کے دباؤ سے جانچا جاتا ہے، اور ٹینک یا ریزروائر کو اس کی پانی کی سطح سے۔';
// The link half (Tom, 2026-10-06: "Proceed."). Each heads a list of "ID: entry" lines.
$ec_lang['lpn_change_type_born']='یہ قدریں نئی ہیں، اور اسی طرح مقرر کی گئی ہیں جیسے نئے بنائے گئے عنصر پر:';
$ec_lang['lpn_change_type_no_curve']='{id}: پمپ ہیڈ وکر نہیں ہے، اس لیے جب تک کوئی وکر چنا نہ جائے پمپ کوئی ہیڈ نہیں دیتا، اور .inp برآمد اسے پائپ کے طور پر لکھتی ہے';
$ec_lang['lpn_change_type_becomes']='{id}: {property} {value}، منظرنامہ {scenario} میں، {new} بن جاتی ہے';
$ec_lang['lpn_change_type_customers']='صرف پائپ گاہکوں کو سروس دیتا ہے، اس لیے یہ گاہک قوسین میں دکھائے گئے نوڈ سے جوڑ دیے جاتے ہیں، جہاں ان کی طلب پہلے ہی لاگو ہے۔ یہ وہیں رہتے ہیں جہاں بنائے گئے ہیں، اور ان کی طلب تبدیل نہیں ہوتی:';
$ec_lang['lpn_change_type_setting']='یہ کنٹرولز اور رولز تبدیل کیے جانے والے لنک کی سیٹنگ دیتے یا جانچتے ہیں۔ سیٹنگ پائپ، پمپ اور والو پر ایک مختلف مقدار ہوتی ہے، اس لیے یہ اسے مختلف طور پر پڑھیں گے:';
$ec_lang['lpn_change_type_rules']='یہ رول لائنیں لنک کو اس کی قسم سے نام دیتی ہیں، اور اب اس کی نئی قسم سے نام دیں گی:';
$ec_lang['lpn_tables_menu_tip']='نیچے کے پینل میں جدولوں میں عناصر دیکھیں اور ان میں ترمیم کریں۔';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='سمولیشن چلائیں۔ جب ترتیبات، حساب، ہائیڈرالکس میں خود بخود دوبارہ حل کریں آن ہو تو اس کی ضرورت نہیں۔ دوبارہ حل کرنا بند ہو تو ٹول بار میں حل کریں بٹن ظاہر ہوتا ہے۔';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='خود بخود دوبارہ حل کریں';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='اگر دوبارہ حساب بہت سست ہو تو بند کریں۔ یہ آن ہو تو حل کریں بٹن چھپا رہتا ہے۔';
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
$ec_lang['lpn_time_run_slow']='اس نیٹ ورک کو حل ہونے میں {secs} سیکنڈ لگے، اور یہ ہر تبدیلی کے بعد دوبارہ حل ہونے کے لیے مقرر ہے۔ اسے روکنے اور حل کریں کا بٹن واپس لانے کے لیے، ترتیبات میں، حساب کتاب کے تحت ہائیڈرالکس میں "خود بخود دوبارہ حل کریں" بند کریں۔';
$ec_lang['lpn_time_no_report']='ابھی کوئی رن رپورٹ نہیں ہے۔ یہ رپورٹ EPANET کی متنی رپورٹ ہے، اس لیے یہ اس نیٹ ورک کا حساب ہونے کے بعد ظاہر ہوتی ہے۔';
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='مدد';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='اسکرین شاٹ گیلری';
$ec_lang['lpn_help_walkthroughs']='مرحلہ وار رہنما';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='نیٹ ورک حذف کریں';
$ec_lang['lpn_confirm_delete_network']='اس پراجیکٹ میں موجود ہر نوڈ، پائپ، اور متن کا لیبل حذف کریں؟ پس منظر کی تصویر، پراجیکٹ کا نام، اور آپ کی ترتیبات برقرار رہیں گی۔';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='تلاش اور تبدیلی';
// Copy and Paste properties (Task 782; Tom, 2026-10-12: a clipboard, no confirmation). Identity and
// placement are never pasted.
$ec_lang['lpn_copy_props_menu']='خصوصیات کاپی کریں';
$ec_lang['lpn_copy_props_done']='{id} کی خصوصیات کاپی کی گئیں۔';
$ec_lang['lpn_copy_props_no_overrides']='کاپی کرنے کے لیے کوئی اپنی قدر نہیں۔';
$ec_lang['lpn_copy_props_done_ov']='اس منظرنامے میں {id} کی اپنی قدریں کاپی کی گئیں۔';
$ec_lang['lpn_paste_alt_created']='اس منظرنامے کے لیے {category} متبادل {name} بنایا گیا۔';
$ec_lang['lpn_paste_props_menu']='منتخب پر خصوصیات پیسٹ کریں';
$ec_lang['lpn_paste_props_off_none']='کچھ کاپی نہیں کیا گیا۔ کسی اثاثے پر دائیں کلک کریں یا دبائے رکھیں اور خصوصیات کاپی کریں چنیں۔';
$ec_lang['lpn_paste_props_off_select']='جن اثاثوں پر پیسٹ کرنا ہے انہیں منتخب کریں، پھر منتخب پر خصوصیات پیسٹ کریں چنیں۔';
$ec_lang['lpn_paste_props_off_kind']='کوئی منتخب اثاثہ کاپی کی ہوئی خصوصیات قبول نہیں کر سکتا۔';
$ec_lang['lpn_tsb_menu']='وقتی سلسلے کا گراف';
// The map's right-click (and long press) menu on a Text and on a dragged label (2026-10-14). Edit text
// opens the in-place editor; Reset position sends a dragged label or an attached Text home.
$ec_lang['lpn_ctx_edit_text']='متن ایڈٹ کریں';
$ec_lang['lpn_ctx_reset_position']='جگہ ری سیٹ کریں';
$ec_lang['lpn_ctx_reset_position_off_tip']='صرف وہ لیبل یا جڑا ہوا متن ری سیٹ کیا جا سکتا ہے جسے اس کی اپنی جگہ سے گھسیٹا گیا ہو۔';
$ec_lang['lpn_tsb_off_tip']='توسیعی مدت کے نتائج درکار ہیں۔ ترتیبات، حساب، وقت میں کل رن کا وقت مقرر کریں اور حل کریں۔';
$ec_lang['lpn_tsb_close']='گراف بند کریں';
$ec_lang['lpn_tsb_resize']='سائز بدلنے کے لیے گھسیٹیں';
$ec_lang['lpn_tsb_quantity']='گراف کی مقدار';
$ec_lang['lpn_tsb_max']='دوسرا کھولنے سے پہلے ایک گراف بند کریں۔ زیادہ سے زیادہ {n} کھلے رہتے ہیں۔';
$ec_lang['lpn_paste_done_one']='{id} کی خصوصیات {to} پر پیسٹ کی گئیں۔ بدلی گئی قدریں: {n}۔';
$ec_lang['lpn_paste_done_many']='{id} کی خصوصیات {m} اثاثوں پر پیسٹ کی گئیں۔ بدلی گئی قدریں: {n}۔';
$ec_lang['lpn_paste_skip_breakdown']='پیسٹ نہیں کیا گیا: {n} (طلب زمروں کی فہرست ہے)۔';
$ec_lang['lpn_paste_skip_valve']='پیسٹ نہیں کیا گیا: {n} (والو کی اقسام مختلف ہیں)۔';
$ec_lang['lpn_find_title']='تلاش اور تبدیلی';
$ec_lang['lpn_find_scope']='کیا تلاش کرنا ہے';
$ec_lang['lpn_find_scope_all']='سب کچھ';
$ec_lang['lpn_find_scope_source']='سورس';
$ec_lang['lpn_find_source_no_chemical']='کوئی کیمیکل ٹریک نہیں کیا جا رہا، اس لیے کسی نوڈ پر سورس نہیں ہے۔';
$ec_lang['lpn_find_property']='خاصیت';
$ec_lang['lpn_find_condition']='شرط';
$ec_lang['lpn_find_value']='قدر';
$ec_lang['lpn_find_btn']='تلاش کریں';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='موجودہ جدول میں فلٹر کریں';
$ec_lang['lpn_find_filter_tip']='جن جدولوں میں تلاش کی گئی ہے ان میں سے ہر ایک میں صرف وہی قطاریں دکھائیں جو اوپر کے "کیا تلاش کرنا ہے" سے مطابقت رکھتی ہیں۔';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {all} میں سے {n}';
$ec_lang['lpn_find_filter_summary']='{q} کے مطابق فلٹر کیا گیا۔ {rows}۔';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='یہ سوال کسی جدول پر لاگو نہیں ہوتا۔';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='میں شامل ہو';
$ec_lang['lpn_find_op_equals']='کے برابر ہو';
$ec_lang['lpn_find_op_gt']='سے بڑا ہو';
$ec_lang['lpn_find_op_lt']='سے چھوٹا ہو';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='خالی';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} ملے۔ کسی ایک تک جانے کے لیے اسے منتخب کریں۔';
$ec_lang['lpn_find_shift_hint']='ٹوگل کرنے کے لیے Shift+click کریں: اگر یہ انتخابی سیٹ میں نہیں ہے تو شامل ہو جاتا ہے، اور اگر پہلے سے انتخابی سیٹ میں ہے تو خارج ہو جاتا ہے۔';
$ec_lang['lpn_find_none']='کچھ بھی نہیں ملا۔';
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
$ec_lang['lpn_find_op_top']='زیادہ ترین {n}';
$ec_lang['lpn_find_op_bottom']='کم ترین {n}';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='جو تلاش کرنا ہے وہ درج کریں۔';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='رابطہ';
$ec_lang['lpn_find_prop_demand_desc']='اس طلب زمرے کی تفصیل';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='نوڈ پر کوئی لنک نہیں';
$ec_lang['lpn_find_op_conn_noopen']='نوڈ پر کوئی کھلا لنک نہیں';
$ec_lang['lpn_find_op_conn_nolinksource']='کسی ذریعہ تک لنک کا کوئی راستہ نہیں';
$ec_lang['lpn_find_op_conn_noopensource']='کسی ذریعہ تک کوئی کھلا راستہ نہیں';
// A result row prints the NARROWEST condition true of that node beside its id, because "no links"
// says more than "no open path to a source" and both are true of the same node. It prints the
// SAME four keys above with the first letter capitalized in code (findConnLabel()), not a second
// capitalized copy of each (Task 699, Tom 2026-09-30: "do the Find redesign").
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='ہر نوڈ منسلک ہے۔';
$ec_lang['lpn_find_conn_no_fixed']='اس نیٹ ورک میں کوئی ریزروائر یا ٹینک نہیں، اس لیے پہنچنے کے لیے کوئی ذریعہ نہیں۔ صرف نوڈ پر کوئی لنک نہیں اور نوڈ پر کوئی کھلا لنک نہیں تلاش کیے جا سکتے ہیں۔';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='دی گئی تلاش بطور متنی استفسار۔ استفسار بدلنے سے اوپر کے کنٹرولز اپ ڈیٹ ہو جاتے ہیں۔';
$ec_lang['lpn_find_query_label']='کوئری';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='شرائط کو AND، OR اور () کے ساتھ ملائیں';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='اور';
$ec_lang['lpn_find_q_or']='یا';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='کنٹرولز نیچے دی گئی کوئری کو ظاہر نہیں کر سکتے، اس لیے وہ چھپا دیے گئے ہیں۔';
$ec_lang['lpn_find_q_restore']='اس کے بجائے کنٹرولز استعمال کریں';
$ec_lang['lpn_replace_q_bad']='یہ کوئری سمجھی نہیں جا سکتی، اس لیے کچھ بھی تبدیل نہیں کیا جا سکتا۔ پہلے اسے اوپر درست کریں۔';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(حرف {n} پر)';
$ec_lang['lpn_find_q_err_empty']='کوئری خالی ہے، اس لیے کچھ بھی تلاش نہیں کیا جائے گا۔';
$ec_lang['lpn_find_q_err_scope']='{w} نام کی کوئی چیز تلاش کے لیے موجود نہیں۔ ان میں سے کوئی آزمائیں: {list}';
$ec_lang['lpn_find_q_err_dot']='جو تلاش کرنا ہے اور اس کی خصوصیت کے درمیان نقطہ لگائیں، جیسے Junction.ID';
$ec_lang['lpn_find_q_err_prop']='{scope} کی خصوصیت نہیں: {w}۔ ان میں سے کوئی آزمائیں: {list}';
$ec_lang['lpn_find_q_err_op']='{prop} کے لیے شرط نہیں: {w}۔ ان میں سے کوئی آزمائیں: {list}';
$ec_lang['lpn_find_q_err_value']='اس شرط کے بعد ایک قدر درکار ہے: {op}';
$ec_lang['lpn_find_q_err_quote']='متن کی قدر کے گرد کوٹیشن لگائیں: {w} کوئی عدد نہیں ہے۔';
$ec_lang['lpn_find_q_err_quote_end']='اس کوٹ کیے گئے متن کا اختتامی کوٹ موجود نہیں۔';
$ec_lang['lpn_find_q_err_close']='یہ قوسین ( کھولا گیا اور کبھی بند نہیں ہوا۔';
$ec_lang['lpn_find_q_err_open']='یہ قوسین ) کچھ بند نہیں کر رہا۔';
$ec_lang['lpn_find_q_err_end']='اس کے بعد کچھ متوقع نہیں تھا۔ دو تلاشوں کو {and} یا {or} سے جوڑیں۔';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='جو ملا اسے بدلیں';
$ec_lang['lpn_replace_prop']='بدلنے کے لیے خاصیت';
$ec_lang['lpn_replace_value']='نئی قدر';
$ec_lang['lpn_replace_source']='نئی قدر کا ذریعہ';
$ec_lang['lpn_replace_asked']='نوڈز ({n}) کے لیے بلندیاں مانگی گئیں۔ موصول ہونے پر نتائج ظاہر ہوں گے۔';
$ec_lang['lpn_replace_btn']='بدلیں';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='عناصر ({n}) بدلیں؟';
$ec_lang['lpn_replace_apply']='انہیں بدلیں';
$ec_lang['lpn_replace_done']='تبدیل شدہ عناصر: {n}۔ آپ اسے ایک ہی مرحلے میں کالعدم کر سکتے ہیں۔';
$ec_lang['lpn_replace_none']='کچھ نہیں بدلے گا۔';
$ec_lang['lpn_replace_no_value']='نئی قدر درج کریں۔';
$ec_lang['lpn_replace_scope']='قدریں بدلنے کے لیے اوپر ایک قسم کا عنصر چنیں۔';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='پروفائل';
$ec_lang['lpn_graphs_menu']='گراف';
// **THE SYNONYMS ARE IN dev/plain-sentences.md, THE CHANNEL MEANT FOR THEM.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission a plain sentence requires. Same text, correct channel.
$ec_lang['lpn_profile_title']='راستے کے ساتھ پروفائل';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='وہ نوڈ منتخب کریں جہاں سے راستہ شروع ہوتا ہے۔';
$ec_lang['lpn_profile_draw_more']='راستہ دیکھنے کے لیے نقشے پر کرسر پھیریں۔ کسی نوڈ کو شامل کرنے کے لیے اسے منتخب کریں۔ ختم کرنے کے لیے ڈبل کلک کریں۔ منسوخ کرنے کے لیے Esc دبائیں۔';
$ec_lang['lpn_profile_draw_blocked']='{a} سے {b} تک کوئی راستہ نہیں۔ کوئی اور نوڈ منتخب کریں۔';
$ec_lang['lpn_profile_tap_start']='وہ نوڈ منتخب کریں جہاں سے راستہ شروع ہوتا ہے۔';
$ec_lang['lpn_profile_tap_more']='راستہ دیکھنے کے لیے کوئی نوڈ منتخب کریں۔ اسے شامل کرنے کے لیے دبائے رکھیں۔ ختم کرنے کے لیے ڈبل ٹیپ کریں۔ منسوخ کرنے کے لیے دوبارہ پروفائل دبائیں۔';
$ec_lang['lpn_profile_say_idle']='نقشے پر نیا راستہ منتخب کرنے کے لیے دوبارہ پروفائل دبائیں۔';
$ec_lang['lpn_profile_none']='ابھی تک کوئی راستہ نہیں۔ نقشے پر راستہ منتخب کرنے کے لیے دوبارہ پروفائل دبائیں۔';
$ec_lang['lpn_profile_choose']='ایک ابتدائی نوڈ اور ایک آخری نوڈ منتخب کریں۔';
$ec_lang['lpn_profile_no_path']='یہ دونوں نوڈز کسی راستے سے جڑے ہوئے نہیں ہیں۔';
$ec_lang['lpn_profile_no_solve']='ابھی کوئی نتائج نہیں ہیں، اس لیے صرف زمین کی لائن دکھائی گئی ہے۔';
$ec_lang['lpn_profile_summary']='نوڈز: {n}، لمبائی: {len} {u}';
$ec_lang['lpn_profile_axis_station']='راستے کے ساتھ فاصلہ ({u})';
$ec_lang['lpn_profile_axis_elev']='بلندی اور ہیڈ ({u})';
$ec_lang['lpn_profile_ground']='زمین کی سطح';
$ec_lang['lpn_profile_hgl']='ہائیڈرالک گریڈ لائن';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='ترمیم';
$ec_lang['lpn_profile_edit_tip']='پورا راستہ دوبارہ کھینچے بغیر راستے کا ایک سرا بدلیں، یا اس سے ایک نوڈ ہٹا دیں۔';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='راستے کے کسی بھی پوائنٹ کو منتقل کرنے کے لیے گھسیٹیں۔ جو پوائنٹ آپ نے شامل کیا تھا اسے ہٹانے کے لیے منتخب کریں۔';
$ec_lang['lpn_profile_edit_tap']='راستے کے کسی بھی پوائنٹ کو منتقل کرنے کے لیے گھسیٹیں۔ جو پوائنٹ آپ نے شامل کیا تھا اسے ہٹانے کے لیے منتخب کریں۔';
$ec_lang['lpn_profile_edit_nowhere']='راستے کا کوئی پوائنٹ نوڈ ہی ہونا چاہیے۔ راستہ تبدیل نہیں ہوا۔';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='محفوظ شدہ راستے';
$ec_lang['lpn_profile_new']='نیا محفوظ راستہ…';
$ec_lang['lpn_profile_new_name']='راستہ {n}';
$ec_lang['lpn_profile_rename']='راستے کا نام بدلیں…';
$ec_lang['lpn_profile_delete']='راستہ حذف کریں';
$ec_lang['lpn_profile_open']='EPANET پروفائل فائل کھولیں…';
$ec_lang['lpn_profile_file_done']='فائل سے پروفائل پڑھی گئی: اس نیٹ ورک میں {total} میں سے {used} نوڈز ملے۔';
$ec_lang['lpn_profile_file_missing']='فائل میں مذکور مگر اس نیٹ ورک میں نہیں: {ids}۔';
$ec_lang['lpn_profile_file_short']='فائل اس نیٹ ورک کے دو سے کم نوڈز کا نام لیتی ہے، اس لیے بنانے کے لیے کوئی پروفائل نہیں۔';
$ec_lang['lpn_profile_prompt_name']='اس راستے کا نام';
$ec_lang['lpn_profile_delete_confirm']='محفوظ شدہ راستہ {name} حذف کریں؟ خود ڈرائنگ تبدیل نہیں ہوتی۔';
$ec_lang['lpn_profile_none_saved']='ابھی تک کوئی راستہ محفوظ نہیں ہے';
$ec_lang['lpn_profile_missing']='محفوظ شدہ راستہ {name} ایسے نوڈز استعمال کرتا ہے جو اس پراجیکٹ میں موجود نہیں: {ids}';
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
$ec_lang['lpn_ts_menu']='وقتی سلسلہ';
$ec_lang['lpn_ts_tip']='وقتی دورانیے کی سمولیشن کے دوران ایک یا زیادہ عناصر کو گراف کریں۔';
$ec_lang['lpn_ts_title']='قدریں بمقابلہ وقت';
$ec_lang['lpn_ts_group_nodes']='نوڈز';
$ec_lang['lpn_ts_group_links']='لنکس';
$ec_lang['lpn_pgraph_none']='اس عنصر کے موجودہ رن میں کوئی نتائج نہیں ہیں۔';
// The Properties graph's own selector entry for a source share (Tom, 2026-09-30: "In selector, use
// 'Source share from {trace node}'"). Distinct from the shared lpn_result_source_share, which still
// labels the bare quantity everywhere else -- the Tables column, Find's property list, the Labels
// popover and the colour legend -- where naming the trace node in every heading would be clutter.
$ec_lang['lpn_pgraph_source_share_from']='{node} سے سورس شیئر';
$ec_lang['lpn_result_pump_head_tip']='وہ ہیڈ جو پمپ سکشن سے ڈسچارج تک شامل کرتا ہے، مثبت عدد کے طور پر دکھایا گیا۔ حل کار اور EPANET فائلیں اسے منفی ہیڈ نقصان کے طور پر رکھتی ہیں۔';
// The Full report puts every node and link in one table, where a node's Head column already sits, so a
// pump's column there says whose head it is. Elsewhere the pump's own row or tab says so, and lpn_result_pump_head is enough.
$ec_lang['lpn_report_pump_head']='پمپ ہیڈ';
$ec_lang['lpn_ts_add']='منتخب شامل کریں';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='شامل کرنے کے لیے کچھ نہیں ملا۔';
$ec_lang['lpn_ts_clear']='سب ہٹا دیں';
$ec_lang['lpn_ts_chip_tip']='{id} کو گراف سے ہٹائیں';
$ec_lang['lpn_ts_none']='ابھی گراف کرنے کو کچھ نہیں۔ نقشے پر اثاثے چنیں اور منتخب شامل کریں دبائیں۔';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='ابھی تک کوئی توسیعی دورانیے کے نتائج نہیں۔ سمولیشن چلانے کے لیے حل کریں دبائیں۔';
$ec_lang['lpn_ts_summary']='اثاثے: {n}، رپورٹنگ اوقات: {steps}';
$ec_lang['lpn_ts_axis_time']='گزرا ہوا وقت';
// EPANET's Frequency Plot (Task 600): one value over every junction or every pipe, at the time the
// map shows, against the percent of them less than it. "Percent less than" is EPANET's own axis
// title. {n} and {total} are counts, {time} an elapsed time; all substituted, never concatenated.
// The Junctions/Pipes choice reuses lpn_pane_tab_junctions and lpn_pane_tab_pipes.
$ec_lang['lpn_freq_menu']='تعدد';
$ec_lang['lpn_freq_tip']='کسی خصوصیت کی تعدد تقسیم';
$ec_lang['lpn_freq_title']='قدروں کی تقسیم';
$ec_lang['lpn_freq_none']='ابھی اس قدر کے کوئی نتائج نہیں، اس لیے گراف کرنے کو کچھ نہیں۔';
$ec_lang['lpn_freq_summary']='پلاٹ کردہ: {total} میں سے {n}';
$ec_lang['lpn_freq_summary_time']='پلاٹ کردہ: {total} میں سے {n}، بوقت {time}';
$ec_lang['lpn_freq_axis_percent']='اس سے کم فیصد';
// EPANET's Contour Plot (Task 600), drawn as a layer under the map rather than in a window of its
// own, from the pipes outward. {n} and {p} are counts, {k} and {i} numbers, {u} a unit symbol, {m} a
// distance in metres; all substituted. lpn_contour_buffer_unit follows the Buffer number box.
// lpn_contour_consent_1..4 are the terrain question's four paragraphs, reworded for what the contour
// plot sends: tile numbers for the network's area, not each node's latitude and longitude.
$ec_lang['lpn_contour_menu']='کنٹور';
$ec_lang['lpn_contour_tip']='نقشے پر کنٹور پلاٹ دکھائیں: نوڈ کے رنگ پائپوں کے ساتھ اور ان کے اطراف میں پھیلتے ہیں، اور کنٹور لائنوں پر لیبل ہوتے ہیں۔ اسے ٹھیک کرنے یا بند کرنے کے لیے ایک باکس کھلتا ہے۔';
$ec_lang['lpn_contour_plot']='کنٹور پلاٹ';
$ec_lang['lpn_contour_show']='کنٹور دکھائیں';
$ec_lang['lpn_contour_show_tip']='بھرائی اور کنٹور لائنیں چھپانے کے لیے نشان ہٹائیں؛ انہیں پہلے جیسا واپس لانے کے لیے نشان لگائیں۔ نوڈ کے رنگ برقرار رہتے ہیں۔';
$ec_lang['lpn_contour_fill']='بھراؤ';
$ec_lang['lpn_contour_fill_tip']='ہموار ایک درجے کے رنگ کو اگلے درجے میں گھلا دیتا ہے۔ پٹیاں رنگ کی کلید کے ہر درجے کو سپاٹ رنگ دیتی ہیں۔';
$ec_lang['lpn_contour_fill_smooth']='ہموار';
$ec_lang['lpn_contour_fill_bands']='پٹیاں';
$ec_lang['lpn_contour_opacity']='بھراؤ کی غیر شفافیت';
$ec_lang['lpn_contour_lines']='کنٹور لائنیں';
$ec_lang['lpn_contour_interval']='وقفہ';
$ec_lang['lpn_contour_buffer']='بفر';
$ec_lang['lpn_contour_buffer_unit']='× پائپ کی وسطانی لمبائی';
$ec_lang['lpn_contour_buffer_tip']='رنگ ہر پائپ سے کتنی دور تک پہنچتا ہے، پائپ کی وسطانی لمبائی کے ضرب کے طور پر۔ بیرونی حصے میں یہ مدھم ہوتا جاتا ہے۔';
$ec_lang['lpn_contour_few']='کنٹور بنانے کے لیے نوڈ بہت کم ہیں۔';
$ec_lang['lpn_contour_support']='کنٹور پلاٹ: {n} نوڈ، {p} پائپوں کے ساتھ اور ان کے اطراف میں پائپ کی وسطانی لمبائی کے {k} گنا تک درمیانی قدر نکالی گئی۔ پمپوں، والوز یا بند لنکس کے پار کوئی رنگ نہیں۔';
$ec_lang['lpn_contour_support_lines']='کنٹور لائنیں ہر {i} {u} پر۔';
$ec_lang['lpn_contour_too_many']='اس وقفے پر کنٹور لائنیں بہت زیادہ ہیں؛ انہیں بنانے کے لیے وقفہ بڑھائیں۔';
$ec_lang['lpn_contour_dem']='نوڈز کے درمیان زمین Mapbox DEM سے';
$ec_lang['lpn_contour_dem_tip']='نوڈز کے درمیان دباؤ، درمیانی قدر نکالے گئے ہیڈ منفی Mapbox DEM سے زمین کی بلندی کے برابر ہو جاتا ہے، اس لیے کسی ایسی پہاڑی پر جس پر نیٹ ورک کا کوئی نوڈ نہیں، یہ سب سے کم نوڈ دباؤ سے بھی نیچے جا سکتا ہے۔ زمین کو کنٹور نقشہ سمجھیں، سروے نہیں۔';
$ec_lang['lpn_contour_support_dem']='نوڈز کے درمیان دباؤ، درمیانی قدر نکالے گئے ہیڈ منفی Mapbox DEM سے زمین کی بلندی کے برابر ہے، جو تقریباً ہر {m} m پر لی گئی۔';
$ec_lang['lpn_contour_dem_failed']='Mapbox DEM سے زمین نہیں پڑھی جا سکی، اس لیے دباؤ صرف نوڈز کے درمیان درمیانی قدر نکال کر معلوم کیا گیا ہے۔';
$ec_lang['lpn_contour_consent_1']='زمین کے اوپر دباؤ کو ترسیم کرنے پر آپ کا نیٹ ورک جس علاقے کو ڈھانپتا ہے وہ، Mapbox کے نقشے کی ٹائل نمبروں کی صورت میں، api.mapbox.com کو بھیجا جاتا ہے، تاکہ وہاں کی زمین کی بلندی پڑھی جا سکے۔';
$ec_lang['lpn_contour_consent_2']='یہ آپ کے پراجیکٹ کے پیچھے نقشے کی تصویروں سے مختلف سوال ہے۔ وہ تصویریں صرف یہ بتاتی ہیں کہ آپ کہاں دیکھ رہے ہیں۔ یہ ٹائلیں بتاتی ہیں کہ آپ کا نیٹ ورک کہاں ہے۔ Mapbox کو یہ ٹائل نمبر اور آپ کا IP پتہ ملے گا۔ ہم اس کے سوا کچھ نہیں بھیجتے: نہ کوئی نام، نہ پائپ، نہ پراجیکٹ۔ ہم اس کا کوئی ریکارڈ نہیں رکھتے، اور اس سوال کے آپ کے جواب کے سوا اس آلے پر کچھ محفوظ نہیں ہوتا۔';
$ec_lang['lpn_contour_consent_3']='کیا ہم آپ کے نیٹ ورک کے علاقے کے ٹائل نمبر Mapbox کو بھیج سکتے ہیں؟';
$ec_lang['lpn_contour_consent_4']='اگر آپ نہیں کہیں تو اس صفحے پر باقی سب کچھ بالکل ویسے ہی چلتا رہے گا جیسے اب چل رہا ہے، اور کنٹور پلاٹ صرف نوڈز کے درمیان بنے گا۔ ہم ہاں کو یاد رکھتے ہیں تاکہ دوبارہ پوچھنا نہ پڑے۔ نہیں بالکل محفوظ نہیں کیا جاتا۔';
// EPANET's System Flow plot (Task 600). "System flow" is its Graph Selection name, "System flow
// balance" its window title, "Produced" and "Consumed" its series. The definition is its own code
// (Fgraph.pas GetSysFlow): junction and reservoir demands only, split by sign; tanks in neither.
// The axis reuses lpn_result_flow and lpn_ts_axis_time.
$ec_lang['lpn_sysflow_menu']='بہاؤ کا توازن';
$ec_lang['lpn_sysflow_tip']='توسیعی دورانیے کی سمولیشن کے دوران پیدا کیے گئے کل بہاؤ اور استعمال کیے گئے کل بہاؤ کا وقت کے مقابلے میں گراف بنائیں۔ ٹینک کسی بھی کل میں شامل نہیں، اس لیے جہاں دونوں لکیریں الگ ہوں وہاں ٹینک بھر رہے ہیں یا خالی ہو رہے ہیں۔';
$ec_lang['lpn_sysflow_title']='بہاؤ کا توازن';
$ec_lang['lpn_sysflow_produced']='پیدا شدہ';
$ec_lang['lpn_sysflow_produced_tip']='ریزروائرز سے اور منفی طلبوں سے نیٹ ورک میں آنے والا کل بہاؤ۔';
$ec_lang['lpn_sysflow_consumed']='استعمال شدہ';
$ec_lang['lpn_sysflow_consumed_tip']='ہر مثبت طلب کا مجموعہ: جنکشنز پر نیٹ ورک سے نکالا گیا پانی، اور ریزروائر میں جانے والا کوئی بھی بہاؤ۔';
$ec_lang['lpn_view_units']='یونٹس';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='سب محفوظ کریں';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='پراجیکٹ{n}';
$ec_lang['lpn_project_copy_suffix']='(کاپی)';
$ec_lang['lpn_project_rename']='نام تبدیل کریں';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='نیا پراجیکٹ…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='احداثی نظام';
$ec_lang['lpn_new_coordsys_tip']='اپنے نیٹ ورک کا احداثی نظام چنیں۔ اس انتخاب کو بدلنے کا واحد طریقہ نئے پراجیکٹ میں "فائل، تبدیل بطور…" ہے، اور وہ تبدیلی تخمینی ہے۔';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='مقامی، خاکہ نما، یا حسب ضرورت';
$ec_lang['lpn_new_coordsys_local_tip']='جغرافیائی حوالہ نہیں دیا گیا۔ اپنی پس منظر کی تصویر منسلک کریں یا کوئی نہیں۔';
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
$ec_lang['lpn_crs_view']='نقشے کے منظر کے مطابق فلٹر کریں';
$ec_lang['lpn_crs_view_tip']='صرف وہ احداثی نظام پیش کریں جو اس جگہ کا احاطہ کرتے ہیں جسے نقشہ دکھا رہا ہے۔ پوری فہرست دیکھنے کے لیے اس کا نشان ہٹائیں۔';
$ec_lang['lpn_crs_place']='جگہ کے نام کی تلاش';
$ec_lang['lpn_crs_place_tip']='تلاشیں OpenStreetMap کی جگہ کے نام کی سروس کو بھیجی جاتی ہیں، اور پہلی بار اجازت مانگی جاتی ہے۔ نیا جغرافیائی پراجیکٹ بھی یہاں ملی ہوئی جگہ سے شروع ہوتا ہے۔';
$ec_lang['lpn_crs_search']='تلاش کریں';
$ec_lang['lpn_crs_name']='پروجیکشن کے نام کا فلٹر';
$ec_lang['lpn_crs_name_tip']='فہرست کو فلٹر کرنے والا متن: صرف وہ احداثی نظام دکھائے جاتے ہیں جن کے نام یا EPSG کوڈ میں یہ شامل ہو۔';
$ec_lang['lpn_crs_list_tip']='وہ احداثی نظام جو اوپر کے فلٹرز پر پورا اترتے ہیں۔ ایک چنیں، پھر ٹھیک ہے دبائیں۔';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='ابھی تک کوئی جگہ تلاش نہیں کی گئی، اس لیے پوری فہرست پیش کی جا رہی ہے۔ اسے محدود کرنے کے لیے اوپر کوئی جگہ تلاش کریں یا نقشے کو زوم کریں۔';
$ec_lang['lpn_crs_count']='{total} میں سے {n} پروجیکشنز درج ہیں۔';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{total} میں سے {n} احداثی نظام اس نیٹ ورک کا احاطہ کرتے ہیں۔';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(کوئی نقشہ نہیں)';
// Shown beside WGS 84 (EPSG:4326) in the chooser only (Task 775), never on the status strip.
$ec_lang['lpn_crs_suggested_mark']='(تجویز کردہ)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} ان چند فہرست شدہ احداثی نظاموں میں سے ایک ہے جن کے پاس قابل استعمال پروجیکشن معلومات نہیں۔ اس کا مطلب ہے کہ دنیا کا نقشہ، جگہ کے نام کی تلاش، اور DEM بلندیاں کام نہیں کرتیں۔ آپ کے احداثیات متاثر نہیں ہوتے۔';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='بلا نام';
$ec_lang['lpn_crs_none']='جغرافیائی حوالہ نہیں دیا گیا';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='اکائیاں اور دیگر سیٹنگز ہر پراجیکٹ کے ساتھ محفوظ ہوتی ہیں، اس لیے یہ انتخاب صرف اسی پراجیکٹ پر لاگو ہوتا ہے اور براؤزر کی سیٹنگ کے طور پر محفوظ نہیں ہوتا۔ ترجیحات دوبارہ استعمال کرنے کے لیے، ایک خالی پراجیکٹ کو ٹیمپلیٹ کے طور پر محفوظ کریں اور ہر نیا پراجیکٹ اسی سے شروع کریں۔';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='پیٹالوما، کیلیفورنیا';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='بنائیں';
$ec_lang['lpn_file_open']='کھولیں…';
$ec_lang['lpn_file_save']='محفوظ کریں';
$ec_lang['lpn_file_saveas']='محفوظ بطور…';
$ec_lang['lpn_file_revert']='واپس پلٹیں';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='حالیہ فائلیں';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_denied']='اس فائل کو کھولنے کی اجازت نہیں دی گئی، اس لیے یہ نہیں کھولی گئی۔';
$ec_lang['lpn_recent_gone']='{file} کو نہیں کھولا جا سکا۔ ہو سکتا ہے یہ منتقل، نام تبدیل، یا حذف کر دی گئی ہو، اس لیے اسے حالیہ فہرست سے ہٹا دیا گیا۔';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='نیا پراجیکٹ';
$ec_lang['lpn_tab_all']='تمام پراجیکٹس';
$ec_lang['lpn_tab_menu']='پراجیکٹ مینو';
$ec_lang['lpn_tab_duplicate']='نقل بنائیں';
$ec_lang['lpn_tab_move_left']='بائیں منتقل کریں';
$ec_lang['lpn_tab_move_right']='دائیں منتقل کریں';
$ec_lang['lpn_tab_unsaved']='فائل میں محفوظ نہیں';
$ec_lang['lpn_import_bad_file']='اس فائل کو اس صفحے سے محفوظ کیے گئے پراجیکٹ کے طور پر نہیں پڑھا جا سکا۔';
$ec_lang['lpn_import_no_room']='اس پراجیکٹ کو شامل کرنے کے لیے براؤزر سٹوریج میں کافی جگہ باقی نہیں۔ کوئی ایسا پراجیکٹ حذف کریں جس کی اب ضرورت نہیں اور دوبارہ کوشش کریں۔';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='ٹھیک ہے';
// **TASK 718** (Tom, 2026-09-25: *"We have three import items. It's probably time for an Import
// sub-menu."*). The three rows -- surveyed points, an EPANET file, and libraries -- now open as a
// fly-out off one row, the same submenu idiom Help > Toolbar already uses. Each row keeps its
// own existing key and tip; only this one row is new.
$ec_lang['lpn_file_import_menu']='درآمد کریں…';
$ec_lang['lpn_file_import_inp']='EPANET فائل درآمد کریں…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='کسی EPANET فائل سے نیٹ ورک پڑھیں، خواہ وہ .inp متنی فائل ہو یا EPANET کی محفوظ کردہ .net فائل، اور اسے اس براؤزر میں ایک نئے پراجیکٹ کے طور پر محفوظ کریں۔';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
// File > Export is a submenu (Tom, 2026-10-06), so its rows drop the verb the heading carries. The
// two keys above are what the rows were called before it.
$ec_lang['lpn_file_export_menu']='برآمد کریں…';
$ec_lang['lpn_file_export_item_inp']='EPANET فائل…';
$ec_lang['lpn_file_export_item_geojson']='GeoJSON فائل…';
$ec_lang['lpn_file_export_item_ods']='ODS فائل…';
$ec_lang['lpn_file_export_item_xlsx']='XLSX فائل…';
$ec_lang['lpn_file_export_item_csv']='CSV فائل…';
$ec_lang['lpn_file_export_tables_tip']='جدولیں اسی طرح ڈاؤن لوڈ کریں جیسے جدولوں کا پینل دکھاتا ہے، ایک ورک بک میں ہر جدول کے لیے (اور آپ کے چنے ہوئے ہر منظرنامے کے لیے) ایک شیٹ کے ساتھ، اور ہر اس لائبریری کے لیے ایک شیٹ جس کا ان کی IDs حوالہ دیتی ہیں: پیٹرن، وکر، پائپ کی اقسام اور فٹنگز۔ نتائج صرف آخری بار حساب کیے گئے منظرنامے کے لیے شامل ہوتے ہیں۔';
$ec_lang['lpn_file_export_csv_tip']='ایک جدول اسی طرح ڈاؤن لوڈ کریں جیسے جدولوں کا پینل دکھاتا ہے۔ ایک جدول لائبریریوں کے بغیر ایک CSV فائل کی صورت میں آتی ہے۔ کئی جدولیں یا منظرنامے CSV فائلوں کی ایک zip فائل میں آتے ہیں، ہر اس لائبریری کی ایک فائل کے ساتھ جس کا ان کی IDs حوالہ دیتی ہیں۔ نتائج صرف آخری بار حساب کیے گئے منظرنامے کے لیے شامل ہوتے ہیں۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='اس نیٹ ورک کو EPANET .inp فائل کے طور پر ڈاؤن لوڈ کریں (اگر قابل اطلاق ہو تو اس کی تصویر کے ساتھ zip فائل میں)۔ جو کچھ .inp فارمیٹ نہیں رکھ سکتا اس کی فہرست بعد میں آپ کو دکھائی جاتی ہے۔';
$ec_lang['lpn_status_inp_exported']='{file} برآمد ہوئی۔';
$ec_lang['lpn_status_inp_exported_picture']='{zip} برآمد ہوئی، جس میں EPANET فائل {file}، اس کی پس منظر کی تصویر {picture}، اور ورلڈ فائل {world} ہیں۔ تینوں کو ایک فولڈر میں نکالیں، پھر وہاں .inp کو EPANET میں کھولیں؛ تصویر اس کے ساتھ آ جاتی ہے۔';
$ec_lang['lpn_status_inp_exported_no_picture']='{file} برآمد ہوئی۔ پس منظر کی تصویر محفوظ نہیں ہو سکی، اس لیے .inp کسی کا نام نہیں لیتی؛ EPANET میں اسے View > Backdrop > Load سے شامل کریں۔';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_flat_customers_inactive']='ان میں سے {n} گاہک ایک ایسے جنکشن سے منسلک ہیں جو اس منظرنامے میں غیر فعال ہے، اس لیے ان کی طلب فائل میں نہیں ہے۔';
$ec_lang['lpn_inp_export_flat_inactive_controls']='یہ کنٹرولز اور قواعد ایک ایسے اثاثے کا حوالہ دیتے ہیں جو اس منظرنامے میں غیر فعال ہے، اس لیے یہ فائل میں نہیں ہیں: {ids}';
$ec_lang['lpn_inp_export_differences']='{n} چیزیں جو .inp فارمیٹ نہیں رکھ سکتا۔';
$ec_lang['lpn_inp_export_difference_one']='ایک چیز جو .inp فارمیٹ نہیں رکھ سکتا۔';
$ec_lang['lpn_inp_export_refused']='یہ پراجیکٹ EPANET فائل کے طور پر نہیں لکھا جا سکتا: {detail}';
// Task 772: File > Export DXF file. The model's data for AutoCAD and other CAD programs.
$ec_lang['lpn_file_export_item_dxf']='DXF فائل…';
$ec_lang['lpn_file_export_dxf_tip']='اس نیٹ ورک کو AutoCAD اور دیگر CAD پروگراموں کے لیے ڈاؤن لوڈ کریں: نوڈز علامتی بلاکس کے طور پر، پائپ، پمپ اور والوز پولی لائنز کے طور پر، اور ہر عنصر ایک بلاک کے طور پر جس کی ایٹریبیوٹس اس کی ID اور خصوصیات کی قدریں پراجیکٹ کی اکائیوں میں رکھتی ہیں۔';
$ec_lang['lpn_dxf_export_no_utm']='DXF فائل نہیں لکھی گئی: یہ نیٹ ورک ان عرض بلد سے باہر ہے جنہیں UTM احاطہ کرتا ہے (80° جنوب سے 84° شمال)، اور ڈرائنگ کو بنانے کے لیے ایک ہموار گرڈ درکار ہے۔';
$ec_lang['lpn_dxf_export_refused']='DXF فائل نہیں لکھی گئی: اس کے لیے درکار نقاط کی تبدیلی لوڈ نہیں ہوئی۔ کنکشن چیک کریں اور دوبارہ کوشش کریں۔';
$ec_lang['lpn_dxf_export_failed']='DXF فائل نہیں لکھی گئی: اس صفحے میں ایک خرابی نے اسے روک دیا ({error})۔';
// The read-me written into the file as a block of attributes, on a layer that does not plot; the
// file writes it in capital letters. Each says what
// the coordinates are and claims no coordinate system the file does not have. {unit} is a length
// unit as written in English (ft, m), not translated; {crs} is a coordinate system name with its EPSG code.
$ec_lang['lpn_dxf_note_grid']='نقاط: اس پراجیکٹ کے X اور Y، {unit} میں۔ کوئی نظام نقاط بیان نہیں کیا گیا۔';
$ec_lang['lpn_dxf_note_crs']='نقاط: {crs}، بالکل ویسے جیسے یہ پراجیکٹ انہیں بیان کرتا ہے۔';
$ec_lang['lpn_dxf_note_geo']='نقاط: {crs}، میٹروں میں، عرض بلد اور طول بلد میں نہیں۔ پراجیکٹ کے عرض بلد اور طول بلد کو اس گرڈ میں تبدیل کیا گیا۔';
$ec_lang['lpn_dxf_exported_geo']='{file} برآمد ہو گئی۔ اس کے نقاط {crs} ہیں، میٹروں میں، عرض بلد اور طول بلد میں نہیں۔';
// {prefix} is the layer-name prefix, C-WATR-MODL-; {example} is a whole layer name such as
// C-WATR-MODL-NODE-BASE.
$ec_lang['lpn_dxf_note_blocks']='لیئرز کے نام {prefix}، اثاثے کا کوڈ، ایک ہائفن، اور متبادل ہیں، جیسے {example}۔ ہر عنصر اسکیل 1 پر داخل کیا گیا ایک بلاک ہے جس کی ایٹریبیوٹس 1 اکائی اونچی ہیں؛ متن کی اونچائی مقرر کرنے کے لیے بلاکس کو اسکیل کریں۔ ہر ایٹریبیوٹ نظر آتی ہے؛ ایک عنصر کی ایٹریبیوٹس اس کی علامت کے پاس ایک کالم میں ترتیب دی جاتی ہیں۔';
// {n} is a whole number; {max} is 2049. Each shortened value ends in three periods (...).
$ec_lang['lpn_dxf_note_shortened']='DXF فائل کی اجازت سے لمبی قدریں ({max} حروف): {n}۔ ہر ایک کو مختصر کیا گیا اور وہ تین نقطوں پر ختم ہوتی ہے۔';
// {n} is a whole number; {tag} is an attribute tag in capitals, BASE_DEMAND in English.
$ec_lang['lpn_dxf_note_categories']='ایک سے زیادہ طلب زمروں والے جنکشنز: {n}۔ ان کی {tag} ایٹریبیوٹ تمام زمروں کی بنیادی طلب کا مجموعہ رکھتی ہے۔';
// GeoJSON export (Task 728). The command is worded like Export EPANET file. Positions in a GeoJSON
// file are always longitude and latitude (RFC 7946), so a project with no place on the Earth is
// refused and told how to get one, never written with an invented coordinate system.
$ec_lang['lpn_file_export_geojson_tip']='اس نیٹ ورک کو QGIS، ArcGIS Pro اور دیگر GIS پروگراموں کے لیے GeoJSON فائل کے طور پر ڈاؤن لوڈ کریں۔ جنکشنز، ٹینک اور ریزروائر پوائنٹس ہیں، اور پائپ، پمپ اور والوز وہ لائنیں ہیں جو اپنے ورٹیکسز کی پیروی کرتی ہیں۔ مقامات عرض بلد اور طول بلد میں ہیں۔ نتائج صرف تب شامل ہوتے ہیں جب نیٹ ورک حل ہو چکا ہو۔';
// Workspace export and import (Tom, 2026-10-07). {file}, {n}, {r}, {u} and {version} are filled in by the page.
$ec_lang['lpn_file_export_item_workspace']='ورک اسپیس…';
$ec_lang['lpn_file_export_workspace_tip']='ایک چھوٹی فائل ڈاؤن لوڈ کریں جس میں آپ کے باکس کہاں ہیں، ان کے سائز، کون سے کھلے یا ڈاک ہیں، اور آپ کے پین اور کالم کے سائز، نیز اس صفحے کے ڈسپلے اختیارات شامل ہیں، جیسے کون سے مدد کے بلبلے اور ہوور کارڈ دکھائے جائیں۔ آپ کے پراجیکٹس، پراجیکٹ کی ترتیبات اور کوکیز (زبان، رضامندی، اکائیاں) اس میں شامل نہیں۔ اسے کسی اور اسکرین یا براؤزر پر فائل، درآمد، ورک اسپیس سے لوڈ کریں۔';
$ec_lang['lpn_file_import_workspace']='ورک اسپیس…';
$ec_lang['lpn_file_import_workspace_tip']='فائل، برآمد، ورک اسپیس سے محفوظ کی گئی ورک اسپیس فائل لاگو کریں: باکس کی جگہیں اور سائز، ڈاکنگ، پین کے سائز اور اس صفحے کے ڈسپلے اختیارات، جیسے کون سے مدد کے بلبلے اور ہوور کارڈ دکھائے جائیں۔ آپ کے پراجیکٹس اور کوکیز کو چھوا نہیں جاتا۔';
$ec_lang['lpn_workspace_exported']='ورک اسپیس {file} میں محفوظ ہو گئی: {n} ترتیبات۔';
$ec_lang['lpn_workspace_imported']='ورک اسپیس {file} سے لاگو ہو گئی۔ لاگو کی گئی ترتیبات: {n}۔ اپنی ڈیفالٹ قدروں پر واپس آئیں: {r}۔';
$ec_lang['lpn_workspace_ignored']='جو اندراجات پہچانے نہیں گئے انہیں نظر انداز کیا گیا: {u}۔';
$ec_lang['lpn_workspace_refused_unreadable']='اس فائل کو ورک اسپیس کے طور پر پڑھا نہیں جا سکا، اس لیے کچھ تبدیل نہیں ہوا۔';
$ec_lang['lpn_workspace_refused_format']='یہ اس صفحے کی محفوظ کی ہوئی ورک اسپیس فائل نہیں ہے، اس لیے کچھ تبدیل نہیں ہوا۔';
$ec_lang['lpn_workspace_refused_newer']='یہ ورک اسپیس فائل اس صفحے کے نئے ورژن نے محفوظ کی تھی (فارمیٹ {version})، اس لیے کچھ تبدیل نہیں ہوا۔';
$ec_lang['lpn_workspace_confirm']='اس براؤزر کی ورک اسپیس ترتیب کو فائل والی ترتیب سے بدلیں؟';
$ec_lang['lpn_workspace_refused_storage']='براؤزر کا اسٹوریج بھرا ہوا یا دستیاب نہیں، اس لیے ورک اسپیس لاگو نہیں ہوئی۔';
$ec_lang['lpn_geojson_refused_local']='GeoJSON فائل میں صرف عرض بلد اور طول بلد ہوتے ہیں، اور یہ پراجیکٹ ایک مقامی گرڈ پر بنایا گیا ہے جس کی زمین پر کوئی جگہ نہیں۔ پہلے اسے نقشہ، دنیا کا نقشہ، منسلک کریں سے جغرافیائی حوالہ دیں، پھر دوبارہ برآمد کریں۔';
$ec_lang['lpn_geojson_refused_range']='یہ مقامات درست عرض بلد اور طول بلد نہیں ہیں: {detail}';
$ec_lang['lpn_geojson_refused_crs']='اس پراجیکٹ کا احداثی نظام ({detail}) اس صفحے کو معلوم نہیں، اس لیے اس کے مقامات کو عرض بلد اور طول بلد میں تبدیل نہیں کیا جا سکتا۔ پراجیکٹ کو ایسے نظام میں کاپی کرنے کے لیے جو یہ صفحہ جانتا ہے تبدیل بطور… استعمال کریں، پھر دوبارہ برآمد کریں۔';
$ec_lang['lpn_geojson_refused_empty']='ابھی برآمد کرنے کے لیے کچھ نہیں ہے۔ پہلے کوئی نیٹ ورک بنائیں یا کھولیں۔';
$ec_lang['lpn_geojson_results_in']='اسکرین پر موجود نتائج شامل ہیں۔';
$ec_lang['lpn_geojson_results_out']='کوئی نتائج شامل نہیں، کیونکہ نیٹ ورک حل نہیں ہوا۔';
$ec_lang['lpn_inp_bad_file']='اس فائل کو EPANET نیٹ ورک فائل کے طور پر نہیں پڑھا جا سکا۔';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='یہ ایک EPANET .net فائل لگتی ہے، لیکن یہ صفحہ اسے نہیں پڑھ سکا۔ اسے EPANET میں کھولیں اور وہاں فائل، ایکسپورٹ، نیٹ ورک کمانڈ استعمال کر کے اسے .inp فائل کے طور پر محفوظ کریں، پھر اسے درآمد کریں۔';
$ec_lang['lpn_inp_report_heading']='{file} درآمد ہو گئی';
$ec_lang['lpn_inp_report_counts']='{nodes} جنکشن، ریزروائر اور ٹینک، {links} پائپ، پمپ اور والو، {units} میں۔';
$ec_lang['lpn_inp_report_clean']='فائل میں موجود ہر چیز منتقل ہو گئی۔ کچھ بھی چھوڑا نہیں گیا۔';
$ec_lang['lpn_inp_report_label_anchor']='متن لیبلز اسی طرح رکھے جاتے ہیں جیسے EPANET رکھتا ہے، ان کے اوپری بائیں کونے سے۔';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='EPANET فائلوں میں کوئی احداثی نظام نہیں ہوتا، اس لیے یہ فائل ابتدائی طور پر جغرافیائی حوالہ شدہ نہیں ہوگی۔ اسے دنیا کے نقشے پر رکھنے کے لیے نقشہ، دنیا کا نقشہ… استعمال کریں۔ اس کے احداثیات تبدیل کرنے کے لیے فائل، تبدیل بطور… استعمال کریں۔';
$ec_lang['lpn_inp_backdrop_attach']='{file} منسلک کریں…';
$ec_lang['lpn_inp_backdrop_attach_tip']='ویب صفحہ تصویر کو اس کے نام سے نہیں کھول سکتا۔ اسے اپنے آلے پر منتخب کریں اور یہ وہاں رکھی جاتی ہے جہاں فائل کہتی ہے کہ اسے ہونا چاہیے۔';
$ec_lang['lpn_inp_backdrop_attached']='{file} منسلک کی گئی، وہاں رکھی گئی جہاں فائل کہتی ہے کہ اسے ہونا چاہیے۔';
$ec_lang['lpn_inp_backdrop_attached_other']='{picked} منسلک کی گئی، وہاں رکھی گئی جہاں فائل کہتی ہے کہ اسے ہونا چاہیے۔ فائل {file} کا نام لیتی ہے، جو ایک مختلف نام ہے۔';
$ec_lang['lpn_inp_report_lead']='یہ صفحہ EPANET کی ہر خصوصیت استعمال نہیں کرتا، لیکن فائل کا کوئی ڈیٹا ضائع نہیں کیا جاتا۔ نیچے کی فہرست فائل کا وہ ڈیٹا دکھاتی ہے جو رکھا گیا مگر استعمال نہیں ہوا، اور درآمد کے دوران کی گئی کوئی بھی تبدیلی:';
$ec_lang['lpn_inp_drop_headloss']='یہ فائل ہیزن-ولیمز فارمولا استعمال نہیں کرتی۔ یہ صفحہ ہیزن-ولیمز کا حساب لگاتا ہے، اس لیے پائپ کی کھردرا پن کی قدریں بالکل ویسے ہی رکھی گئیں جیسے لکھی گئی تھیں، لیکن یہاں کے جوابات EPANET کے جوابات سے میل نہیں کھائیں گے۔';
$ec_lang['lpn_inp_drop_tank_curve']='یہ ٹینک سیدھی دیواروں والے نہیں ہیں: فائل ان کی شکل حجم وکر کے طور پر دیتی ہے۔ وکر لائبریریاں خانے میں رکھا جاتا ہے، ٹینک اب بھی اس کا حوالہ دیتا ہے، اور وقتی دورانیے کی سمولیشن ٹینک کے بھرنے اور خالی ہونے پر سطح نکالنے کے لیے اسے استعمال کرتی ہے۔ ایک مدتی تجزیہ متاثر نہیں ہوتا، کیونکہ پانی کی سطح وہی ہے جو فائل میں بیان ہے۔ فائل کا قطر وکر کے ساتھ رکھا جاتا ہے اور بغیر وکر والے ٹینک کو بنانے اور حل کرنے کے لیے استعمال ہوتا ہے۔';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='یہ تھروٹل والوز تھروٹل والوز کے طور پر درآمد ہوئے، اور نقصان وہی ہے جو فائل میں بیان ہے۔';
$ec_lang['lpn_inp_drop_valve_active']='یہ والوز دباؤ یا بہاؤ کو کنٹرول کرتے ہیں، اور ان کی حالت ہائیڈرالک حالات کے ساتھ بدلتی ہے۔ یہ ڈیٹا کے نقصان کے بغیر درآمد ہوئے، اور یہ صفحہ انہیں حل کرتا ہے۔';
$ec_lang['lpn_inp_drop_valve']='ان والوز کو وکر یا مقررہ دباؤ گراوٹ سے بیان کیا گیا ہے، اور اس صفحے میں ایسا کوئی عنصر نہیں۔ یہ کھلے پائپوں کے طور پر درآمد ہوئے، اس لیے نیٹ ورک جڑا رہتا ہے، لیکن ان مقامات پر دباؤ اور بہاؤ اب کنٹرول نہیں ہوتے۔';
$ec_lang['lpn_inp_drop_cv']='EPANET میں یہ پائپ صرف ایک سمت میں بہاؤ کی اجازت دیتے ہیں (چیک والوز)۔ یہ عام پائپوں کے طور پر درآمد ہوئے، اس لیے اب بہاؤ کسی بھی سمت میں گزر سکتا ہے۔';
$ec_lang['lpn_inp_drop_demands']='ان جنکشنز کی ایک سے زیادہ طلب تھی۔ طلبات کو جمع کر کے اس صفحے کی رکھی گئی واحد طلب میں شامل کر دیا گیا۔';
$ec_lang['lpn_inp_drop_patterns']='اس صفحے نے طلب کے پیٹرن نہیں پڑھے، کیونکہ اس کا وہ حصہ جو وقتی دورانیے کی سمولیشن چلاتا ہے لوڈ نہیں ہوا۔ ہر طلب وہی عدد ہے جو فائل میں لکھا گیا ہے۔';
$ec_lang['lpn_inp_drop_demand_pattern']='ان جنکشنز کی طلب رن کے دوران بدلتی ہے۔ ان کے پیٹرن پورے درآمد ہوئے، اور دکھائی گئی طلب گھڑی کے وقت کی قدر ہے۔';
$ec_lang['lpn_inp_drop_emitters']='ان جنکشنز کا ایک سپرنکلر یا رساؤ گتانک ہے۔ اسے رکھا گیا ہے اور یہ حل کیا جا رہا ہے، لیکن ابھی اس صفحے پر اسے دیکھنے یا تبدیل کرنے کی کوئی جگہ نہیں۔';
$ec_lang['lpn_inp_drop_curve_long']='اس پمپ وکر کے تین سے زیادہ پوائنٹس تھے۔ اس کے سب سے نچلے، درمیانے اور سب سے اونچے پوائنٹس رکھے گئے، کیونکہ یہ صفحہ زیادہ سے زیادہ تین پوائنٹس پر وکر فٹ کرتا ہے۔';
$ec_lang['lpn_inp_drop_curve_missing']='یہ پمپ ایک ایسے وکر کا حوالہ دیتا ہے جو فائل میں موجود نہیں۔ پمپ بغیر کسی وکر کے شامل ہوا، اس لیے یہ کوئی ہیڈ شامل نہیں کرتا۔';
$ec_lang['lpn_inp_drop_pump_other']='اس پمپ کو منحنی خط کے بجائے اس کی کھینچی گئی طاقت سے بیان کیا گیا ہے۔ یہ بغیر کسی منحنی خط کے آیا، اس لیے یہ کوئی ہیڈ شامل نہیں کرتا۔';
$ec_lang['lpn_inp_drop_head_pattern']='ان ریزروائرز کا ہیڈ رن کے دوران بدلتا ہے۔ ان کے پیٹرن پورے درآمد ہوئے، اور دکھائی گئی پانی کی سطح گھڑی کے وقت کی قدر ہے۔';
$ec_lang['lpn_inp_drop_pump_speed']='یہ پمپ اس رفتار کے علاوہ کسی اور رفتار پر چلتے ہیں جس پر ان کا وکر ناپا گیا تھا، یا رن کے دوران رفتار بدلتے ہیں۔ رفتار اور اس کا پیٹرن پورے شامل ہوئے، اور جو ہیڈ آپ دیکھ رہے ہیں وہ اسی لمحے کا ہے جو گھڑی دکھا رہی ہے۔';
$ec_lang['lpn_inp_drop_setting']='یہ پائپ، پمپ اور والوز ایک ایسی ترتیب رکھتے ہیں جو یہ صفحہ نہیں رکھ سکتا۔ یہ کھلی حالت میں شامل ہوئے۔';
$ec_lang['lpn_inp_drop_rules']='اس فائل میں قواعد پر مبنی کنٹرولز ہیں۔ یہ صفحہ انہیں پڑھتا اور لاگو کرتا ہے۔ ماڈل چلانے پر قواعد لاگو ہوتے ہیں، اور ان میں موجود ہر سطح، دباؤ اور بہاؤ اس پراجیکٹ کی دکھائی گئی اکائیوں میں تبدیل کر دیا جاتا ہے۔ کسی قاعدے کو دیکھنے یا بدلنے کے لیے لائبریریاں کے تحت قواعد کھولیں۔ قواعد بالکل ویسے ہی رکھے جاتے ہیں جیسے فائل میں بیان ہیں اور اگر آپ EPANET فائل محفوظ کریں تو واپس لکھے جاتے ہیں۔';
$ec_lang['lpn_inp_drop_eps']='یہ فائل ایک وقتی دورانیے کی سمولیشن بیان کرتی ہے۔ اس صفحے کا وہ حصہ جو وقتی دورانیے کی سمولیشن چلاتا ہے لوڈ نہیں ہوا، اس لیے صرف ابتدائی حالات شامل ہوئے۔';
$ec_lang['lpn_inp_drop_quality']='یہ فائل پانی کے معیار کو بیان کرتی ہے: پائپوں اور ٹینکوں میں ابتدائی ارتکاز اور رد عمل کی شرحیں۔ یہ صفحہ ان قدروں کو پڑھتا اور استعمال کرتا ہے۔ ترتیبات، حساب، پانی کا معیار کے تحت ایک کیمیکل چنیں، پھر رن کے دوران پورے نیٹ ورک میں ارتکاز نکالنے کے لیے ماڈل چلائیں۔ یہ سطریں محفوظ رکھی جاتی ہیں اور اگر آپ EPANET فائل محفوظ کریں تو واپس لکھی جاتی ہیں۔';
$ec_lang['lpn_inp_drop_sources_mixing']='یہ فائل بتاتی ہے کہ نیٹ ورک میں کیمیکل کہاں داخل کیا جاتا ہے اور ہر ٹینک میں پانی کیسے ملتا ہے۔ ہر سورس اس نوڈ پر دکھایا جاتا ہے جہاں وہ لاگو ہے، اور ہر ٹینک اپنا مکسنگ ماڈل دکھاتا ہے۔ نیٹ ورک کو کل رن ٹائم پر چلانے پر دونوں استعمال ہوتے ہیں۔';
$ec_lang['lpn_inp_drop_energy']='اس EPANET فائل میں پمپنگ لاگت ماڈلنگ کا ڈیٹا شامل ہے۔ یہ صفحہ اسے پڑھتا اور استعمال کرتا ہے۔ EPANET انجن کے ساتھ ماڈل چلائیں، پھر ہر پمپ کتنی دیر چلا، اس نے کتنی طاقت کھینچی، کتنی توانائی استعمال کی اور اس کی قیمت کیا رہی، یہ دیکھنے کے لیے پانی، رپورٹس، پمپ توانائی کھولیں۔ یہ سطریں محفوظ رکھی جاتی ہیں، اور اگر آپ EPANET فائل محفوظ کریں تو واپس لکھی جاتی ہیں۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='اس فائل میں کچھ جنکشنز، پائپوں یا دیگر عناصر کو ٹیگ دیے گئے ہیں۔ ہر ٹیگ درآمد ہوا اور اپنے عنصر کی خصوصیات میں موجود ہے، جہاں اسے دیکھا یا بدلا جا سکتا ہے۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='اس فائل میں EPANET کی رپورٹ کے فارمیٹ کی ترتیبات ہیں۔ رن رپورٹ رپورٹس، رن کے تحت دستیاب ہے، لیکن یہ ان ترتیبات کے بیان کردہ فارمیٹ کے بجائے معیاری EPANET فارمیٹ استعمال کرتی ہے۔ یہ سطریں محفوظ رکھی جاتی ہیں اور اگر آپ EPANET فائل محفوظ کریں تو واپس لکھی جاتی ہیں۔';
$ec_lang['lpn_inp_drop_sections']='اس فائل میں ایک حصہ ایسا ہے جسے یہ صفحہ بالکل نہیں پڑھتا۔ یہاں اس کا کوئی استعمال نہیں۔ یہ پورا محفوظ رکھا جاتا ہے، اور اگر آپ EPANET فائل محفوظ کریں تو یہ واپس لکھا جاتا ہے۔';
$ec_lang['lpn_inp_drop_comments']='اس فائل کے پیٹرنز یا سادہ کنٹرولز میں موجود یہ تبصرے کی سطریں درآمد نہیں کی گئیں، کیونکہ اس صفحے میں انہیں رکھنے کی جگہ نہیں ہے (مثلاً ایک پیٹرن کی قطاروں کے درمیان)۔ ہر پیٹرن اور کنٹرول مکمل درآمد کیا گیا۔';
$ec_lang['lpn_inp_drop_quality_options']='اس فائل میں EPANET کے پانی کے معیار کے اختیارات درج ہیں: Quality اختیار، جو پانی کے معیار کے تجزیے کی قسم کا نام بتاتا ہے، اور کیمیکل کے ساتھ چلنے والی دو ترتیبات، Relative diffusivity اور Quality tolerance۔ تینوں محفوظ رکھی اور استعمال کی جاتی ہیں۔ پانی کی عمر، سورس ٹریس اور کیمیکل ہر ایک یہاں نکالا جاتا ہے، اور کیمیکل چلانے پر دونوں کیمیکل ترتیبات استعمال ہوتی ہیں۔ اگر آپ EPANET فائل محفوظ کریں تو یہ سب واپس لکھی جاتی ہیں۔';
$ec_lang['lpn_inp_drop_file_options']='اس فائل میں ایک ضمنی فائل کا حوالہ ہے: Map، جس میں احداثیات ہوتے ہیں، یا Hydraulics، جس میں پہلے سے نکالی گئی ہائیڈرالکس ہوتی ہے۔ یہ صفحہ ان میں سے کوئی نہیں کھول سکتا، اس لیے یہ سطریں جیسی ہیں ویسی ہی محفوظ رکھی جاتی ہیں اور اگر آپ EPANET فائل محفوظ کریں تو واپس لکھی جاتی ہیں۔';
$ec_lang['lpn_inp_drop_other_options']='اس فائل میں ایسے اختیارات درج ہیں جو یہ صفحہ نہیں پڑھتا۔ یہاں ان کا کوئی استعمال نہیں۔ وہ محفوظ رکھے جاتے ہیں اور اگر آپ EPANET فائل محفوظ کریں تو واپس لکھے جاتے ہیں۔';
$ec_lang['lpn_inp_drop_net_options']='اس EPANET .net فائل میں ایسی ترتیبات درج ہیں جن کے لیے اس صفحے پر کوئی کنٹرول نہیں، اس لیے ان کی قدریں یہاں فہرست کی گئی ہیں بجائے اس کے کہ منتقل کی جائیں۔ باقی سب کچھ منتقل ہو گیا۔ اگر آپ کو ان کی ضرورت ہو تو فائل کو EPANET میں کھولیں اور File، Export، Network استعمال کر کے اسے .inp فائل کے طور پر محفوظ کریں، پھر اسے درآمد کریں۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='یہ ایک EPANET .net فائل تھی، یعنی EPANET کا اپنا پراجیکٹ فارمیٹ۔ اس فارمیٹ کی کوئی شائع شدہ تفصیل نہیں؛ یہ صفحہ اسے مثالی فائلوں سے اخذ کردہ فارمیٹ کے ذریعے پڑھتا ہے، اس لیے اسے صرف تب استعمال کریں جب کوئی .inp فائل دستیاب نہ ہو۔ .inp فائل وہ دستاویزی فارمیٹ ہے جسے دوسرے پروگرام پڑھتے ہیں: EPANET میں فائل، برآمد، نیٹ ورک استعمال کر کے ایک لکھیں، اور جب بھی ممکن ہو اس کی جگہ وہی فائل درآمد کریں۔';
$ec_lang['lpn_inp_drop_backdrop']='یہ فائل ایک پس منظر کی تصویر کا نام دیتی ہے لیکن خود تصویر شامل نہیں کرتی۔ اسے خود فائل، پس منظر کی تصویر، تصویر شامل کریں سے شامل کریں۔';
$ec_lang['lpn_inp_drop_dangling']='یہ پائپ ایک ایسے جنکشن کا نام لیتے ہیں جو فائل میں نہیں ہے، اس لیے یہ شامل نہیں کیے گئے۔';
$ec_lang['lpn_inp_drop_units']='اس فائل میں بتایا گیا بہاؤ کا یونٹ ایسا نہیں جسے یہ صفحہ جانتا ہے، اس لیے ہر عدد کو گیلن فی منٹ کے طور پر پڑھا گیا۔ جوابات استعمال کرنے سے پہلے ہر عدد چیک کریں۔';
$ec_lang['lpn_inp_drop_anchor_missing']='یہ متن ایسے جنکشن، ریزروائر یا ٹینک سے منسلک تھا جو فائل میں موجود نہیں۔ یہ فائل میں بتائے گئے مقام پر آزاد متن کے طور پر درآمد ہوا اور کسی عنصر سے منسلک نہیں۔';
$ec_lang['lpn_import_notes_heading']='یہ پراجیکٹ ایک EPANET فائل سے پڑھا گیا۔ اس فائل کا کچھ حصہ محفوظ رکھا گیا ہے مگر اس صفحے پر استعمال نہیں ہوتا۔';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='{name} کو فائل سے کھولا گیا، اور اسے اس براؤزر میں ایک نئے پراجیکٹ کے طور پر شامل کر دیا گیا۔';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='پراجیکٹ فائل';
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
$ec_lang['lpn_file_upload_explain']='یہ براؤزر کسی فائل سے منسلک نہیں ہو سکتا، اس لیے یہاں فائل کھولنا دراصل اپ لوڈ ہے: پراجیکٹ اس براؤزر میں کاپی ہو جاتا ہے، اور اپنا کام واپس فائل میں محفوظ کرنے کا واحد طریقہ فائل، محفوظ بطور کے ذریعے فائل کو اوور رائٹ کرنا ہے۔';
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
$ec_lang['lpn_file_saveas_tip_download']='اپنے براؤزر کی ڈاؤن لوڈ سیٹنگز کے ذریعے محفوظ کریں۔ یہ براؤزر کسی فائل سے منسلک نہیں ہو سکتا، اس لیے محفوظ کریں غیر فعال ہے اور صرف محفوظ بطور دستیاب ہے۔ اگر آپ کے براؤزر کی سیٹنگ "ہر فائل کہاں محفوظ کرنی ہے پوچھیں" آن ہو تو اصل فائل چن کر اوور رائٹ کی جا سکتی ہے۔';
$ec_lang['lpn_status_uploaded']='پراجیکٹ فائل اپ لوڈ ہو گئی۔ اس سے کوئی رابطہ برقرار نہیں رکھا جا سکتا، اس لیے اس میں واپس محفوظ کرنے کا واحد طریقہ فائل، محفوظ بطور استعمال کرنا ہے۔';
$ec_lang['lpn_status_downloaded']='{file} ڈاؤن لوڈ ہو گئی۔ یہ براؤزر کسی فائل سے منسلک نہیں ہو سکتا، اس لیے یہ پراجیکٹ فائل میں محفوظ نہ ہونے کے طور پر نشان زد رہتا ہے۔';
$ec_lang['lpn_status_file_opened']='{file} کھل گئی۔';
$ec_lang['lpn_status_already_open']='وہ فائل یہاں پہلے سے {name} کے طور پر کھلی ہوئی ہے، اس لیے دوسری کاپی کھولنے کی بجائے اسی پر منتقل کر دیا گیا۔';
$ec_lang['lpn_status_already_open_dirty']='وہ فائل یہاں پہلے سے {name} کے طور پر کھلی ہوئی ہے، جس میں ایسی تبدیلیاں ہیں جو آپ نے اس میں محفوظ نہیں کیں۔ دوسری کاپی کھولنے کی بجائے اسی پر منتقل کر دیا گیا۔ اگر آپ اس کی بجائے ڈسک والا ورژن چاہتے ہیں تو فائل، واپس پلٹیں استعمال کریں۔';
$ec_lang['lpn_status_saved']='{file} محفوظ ہو گئی۔';
$ec_lang['lpn_status_reverted']='{file} ڈسک سے دوبارہ لوڈ ہو گئی۔';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='بند کرنے سے پہلے اپنی تبدیلیاں {name} میں محفوظ کریں؟';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} صرف اسی براؤزر میں رکھا گیا ہے۔ اگر آپ اسے فائل میں محفوظ کیے بغیر بند کریں تو یہ ہمیشہ کے لیے ختم ہو جائے گا۔';
$ec_lang['lpn_close_discard']='بغیر محفوظ کیے بند کریں';
$ec_lang['lpn_cancel']='منسوخ کریں';
$ec_lang['lpn_revert_confirm']='اپنی کی گئی تبدیلیاں ضائع کر کے {file} ڈسک سے دوبارہ لوڈ کریں؟';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='یہ پراجیکٹ {file} سے آیا تھا، لیکن اس فائل سے رابطہ منقطع ہو گیا ہے۔ اس سے دوبارہ منسلک ہونے کے لیے فائل دوبارہ منتخب کریں۔';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='فائل میں لکھا نہیں جا سکا۔ ہو سکتا ہے یہ منتقل یا نام تبدیل کی گئی ہو، یا اجازت واپس لے لی گئی ہو۔ آپ کا کام اب بھی اس براؤزر میں محفوظ ہے۔';
$ec_lang['lpn_file_changed_elsewhere']='آپ کے اس فائل کو کھولنے کے بعد کسی اور صارف نے اس میں محفوظ کیا ہے، اس لیے اب محفوظ کرنے سے وہ کام مٹ جائے گا۔ اپنی تبدیلیاں الگ فائل میں محفوظ کرنے کے لیے فائل، محفوظ بطور استعمال کریں، یا اپنی تبدیلیاں ضائع کر کے محفوظ شدہ ورژن لوڈ کرنے کے لیے فائل، واپس پلٹیں استعمال کریں۔';
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
$ec_lang['lpn_lock_somebody']='کوئی اور';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} نے یہ فائل کھول رکھی ہے۔';
$ec_lang['lpn_lock_open_readonly']='صرف پڑھنے کے لیے کھولیں';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='لاک توڑیں';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='یہ فائل استعمال میں دکھائی دیتی ہے۔';
$ec_lang['lpn_lock_open_care']='ڈیٹا ضائع ہونے سے بچنے کے لیے، نیچے دیے گئے اختیارات میں سے احتیاط سے انتخاب کریں۔';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='یہ {x} سے استعمال میں ہے۔';
$ec_lang['lpn_lock_age_edited']='اس میں آخری ترمیم {x} پہلے ہوئی۔';
$ec_lang['lpn_lock_age_saved']='یہ آخری بار {x} پہلے محفوظ ہوئی۔';
$ec_lang['lpn_lock_age_never_saved']='اس فائل میں ابھی تک کچھ محفوظ نہیں کیا گیا۔';
$ec_lang['lpn_lock_age_unknown']='اس بات کا کوئی ریکارڈ نہیں کہ یہ کتنی دیر سے استعمال میں ہے، یا آخری بار کب محفوظ یا ترمیم کی گئی۔';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='"پوچھیں" اس شخص کو بتاتا ہے جس نے یہ فائل کھول رکھی ہے کہ آپ اسے چاہتے ہیں، اور اس کے علاوہ کچھ نہیں بدلتا۔ "صرف پڑھنے کے لیے کھولیں" آپ کو اسے دیکھنے اور جو چاہیں بدلنے دیتا ہے، بغیر یہاں محفوظ کیے۔ "ان کا لاک توڑیں" آپ کو فائل کے اوپر محفوظ کرنے دیتا ہے؛ ان کا غیر محفوظ کام ضائع نہیں ہوتا، مگر وہ اب یہاں اسے محفوظ نہیں کر سکیں گے، اور شاید کسی کو دونوں کو ہاتھ سے ملانا پڑے۔';
$ec_lang['lpn_lock_ask']='پوچھیں';
// Asked at the one moment the name is useful. Nothing is written to this computer for it; the lock
// broker keeps it in that file's lock record for the holder to read (Tom, 2026-09-29, correcting a
// prompt that said "stored only in this browser").
$ec_lang['lpn_lock_ask_prompt']='ہم کس کا نام بتائیں کہ کون پوچھ رہا ہے؟ مثلاً اپنے ابتدائی حروف درج کریں۔ یہ ہمارے سرور پر اس فائل کے لاک کے ساتھ رکھے جاتے ہیں، جو بھی اسے کھولے اس کے لیے، اور 30 دنوں کے اندر حذف کر دیے جاتے ہیں۔';
$ec_lang['lpn_lock_ask_sent']='ہم نے اس شخص سے جس نے یہ فائل کھول رکھی ہے اسے بند کرنے کو کہہ دیا ہے۔ اگر ان کا صفحہ اب بھی کھلا ہے تو وہ اسے ایک منٹ کے اندر دیکھ لیں گے۔ اس کے علاوہ کچھ نہیں بدلا، اور فائل اس وقت تک ان کی ہی رہے گی جب تک وہ اسے بند نہیں کرتے۔';
$ec_lang['lpn_lock_ask_failed']='آپ کا پیغام پہنچایا نہیں جا سکا۔ یا تو اب کسی نے یہ فائل کھول نہیں رکھی، یا سرور تک رسائی نہیں ہو سکی۔';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='وہ فائل نہیں کھولی گئی، اور یہاں کچھ نہیں بدلا۔ کسی اور نے اب بھی اسے کھول رکھا ہے۔';
// Task 747: a file copied outside this page keeps its original's document ID, and so its lock. Asked
// whenever this browser cannot guarantee it already knows the file (Tom, 2026-09-30). {date} is when
// the ID was minted, in the visitor's own regional date-time format.
$ec_lang['lpn_copy_title']='فائل کو نئی کاپی کے طور پر نشان زد کریں؟';
$ec_lang['lpn_copy_body']='یہ فائل کہتی ہے کہ یہ {date} کو بنائی گئی تھی، اور یہ براؤزر اسے پہچانتا نہیں۔ کیا یہ اصل فائل ہے (وہی لاک رکھیں) یا کاپی (نیا لاک بنائیں)؟';
$ec_lang['lpn_copy_body_nodate']='یہ براؤزر اس فائل کو پہچانتا نہیں۔ کیا یہ اصل فائل ہے (وہی لاک رکھیں) یا کاپی (نیا لاک بنائیں)؟';
$ec_lang['lpn_copy_original']='اصل؛ وہی لاک رکھیں';
$ec_lang['lpn_copy_copy']='کاپی؛ نیا لاک بنائیں';
// What "Original" does when the file's id is already open in a tab here with a different file:
// switch to the tab, without changing the tab's file.
$ec_lang['lpn_copy_kept_link']='{name} کو اصل کے طور پر کھولا گیا، جو نئی جگہ منتقل ہو چکی ہے۔ محفوظ کریں اب اسی فائل میں لکھتا ہے۔';
// Tom, 2026-10-05: the copy is saved the moment it is chosen, so nobody has to remember to.
$ec_lang['lpn_copy_opened']='{file} کو کاپی کے طور پر کھولا اور محفوظ کیا گیا، نئے لاک کے ساتھ۔';
// Said only when that save did not happen (permission refused, file gone); the tab stays unsaved.
$ec_lang['lpn_copy_opened_unsaved']='{file} کو کاپی کے طور پر کھولا گیا، ایک نئے لاک کے ساتھ جو اگلی فائل محفوظ کرنے کے ساتھ محفوظ ہو گا۔';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} اس فائل میں ترمیم کرنا چاہتا ہے۔ جب آپ تیار ہوں، اپنا کام محفوظ کریں اور اسے حوالے کرنے کے لیے فائل، بند کریں استعمال کریں۔';
$ec_lang['lpn_ago_seconds']='{n} سیکنڈ';
$ec_lang['lpn_ago_minutes']='{n} منٹ';
$ec_lang['lpn_ago_hours']='{n} گھنٹے';
$ec_lang['lpn_ago_days']='{n} دن';
$ec_lang['lpn_ago_unknown']='ایک نامعلوم وقت';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='پیغامات';
$ec_lang['lpn_msglog_heading']='حالیہ پیغامات';
$ec_lang['lpn_msglog_empty']='ابھی تک کوئی پیغام نہیں۔';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='{x} پہلے';
$ec_lang['lpn_msglog_note']='تازہ ترین پہلے۔ یہ صفحہ کھلے رہنے کے دوران آخری {n} پیغامات رکھتا ہے، اور انہیں آپ کے کمپیوٹر پر محفوظ نہیں کرتا۔';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='صرف پڑھنے کے لیے: {name} نے یہ فائل کھول رکھی ہے۔ آپ یہاں جو چاہیں تبدیل کر سکتے ہیں، لیکن محفوظ نہیں کر سکتے۔ کسی مختلف فائل میں محفوظ کرنے کے لیے فائل، محفوظ بطور استعمال کریں۔';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='خبردار: اس پراجیکٹ پر لاک چیک کرنے یا بنانے کے لیے سرور تک رسائی نہیں ہو سکی، اس لیے کوئی اور صارف اسی وقت وہی فائل ایڈٹ کر سکتا ہے۔ لاکنگ دوبارہ شروع ہونے پر ایک پیغام ظاہر ہوگا۔';
$ec_lang['lpn_lock_storage_error']='خبردار: یہ سائٹ لاک ریکارڈز محفوظ نہیں کر سکتی، اس لیے کوئی اور صارف اسی وقت وہی فائل ایڈٹ کر سکتا ہے۔ یہ سرور کنفیگریشن کی خرابی ہے جو اس صفحے سے درست نہیں کی جا سکتی: لاک فولڈر ویب سرور کے لیے قابل تحریر نہیں ہے۔';
$ec_lang['lpn_lock_full_error']='خبردار: اس سائٹ پر لاک ریکارڈز کے لیے اسٹوریج جگہ ختم ہو گئی ہے، اس لیے کوئی اور صارف اسی وقت وہی فائل ایڈٹ کر سکتا ہے۔ یہ سرور کنفیگریشن کی خرابی ہے جو اس صفحے سے درست نہیں کی جا سکتی۔';
$ec_lang['lpn_lock_not_asked']='اس پراجیکٹ کے لیے لاکنگ فعال نہیں، اس لیے کوئی اور صارف اسی وقت وہی فائل ایڈٹ کر سکتا ہے۔ اس پراجیکٹ کی ابھی کوئی شناخت نہیں؛ اسے فائل میں محفوظ کرنے سے ایک تفویض ہو جاتی ہے۔';
$ec_lang['lpn_lock_restored']='لاکنگ بحال ہو گئی ہے، اور یہ فائل اب محفوظ کی جا سکتی ہے۔';
$ec_lang['lpn_lock_dismiss']='یہ پیغام چھپائیں';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='پراجیکٹ اس کمپیوٹر پر ایک فائل میں محفوظ ہو گا۔ یہ صرف تب محفوظ ہوتا ہے جب آپ اسے محفوظ کریں، کسی اور وقت نہیں۔';
$ec_lang['lpn_file_training_2']='تاکہ دو لوگ کبھی ایک ہی فائل میں ایک ہی وقت میں ترمیم نہ کریں، یہ سائٹ اس کا ریکارڈ رکھتی ہے کہ اسے کس نے کھول رکھا ہے۔ اگر کسی کے پاس یہ پہلے سے کھلی ہے، تو آپ پھر بھی اسے کھول کر دیکھ سکتے ہیں، یا اپنی الگ کاپی رکھ سکتے ہیں۔';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='پہلی بار محفوظ کرنے پر، براؤزر پوچھتا ہے کہ کیا یہ سائٹ فائل میں ترمیم کر سکتی ہے۔ یہ درخواست براؤزر کی طرف سے آتی ہے، اس سائٹ کی طرف سے نہیں، اور محفوظ کریں کے فائل میں لکھنے کے لیے اجازت درکار ہے۔ عام طور پر یہ فی فائل صرف ایک بار مانگی جاتی ہے۔';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='فائل دوبارہ منتخب کریں';
$ec_lang['lpn_file_reconnect']='اس فائل سے دوبارہ منسلک ہوں';
$ec_lang['lpn_file_reconnect_alert']='یہ پراجیکٹ {file} سے آیا تھا۔ اس میں لکھنے سے پہلے آپ کے براؤزر کو دوبارہ آپ کی اجازت درکار ہے۔ نیچے دوبارہ منسلک ہوں۔';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='یہ وہی فائل ہے جو کسی اور نے کھول رکھی ہے، اس لیے اسے اوور رائٹ نہیں کیا جا سکتا۔ کوئی مختلف فائل یا مختلف نام منتخب کریں۔';
$ec_lang['lpn_saveas_overwrites_project']='اس فائل میں پہلے سے ایک مختلف پراجیکٹ، {name}، موجود ہے۔ یہاں محفوظ کرنے سے یہ مکمل طور پر تبدیل ہو جائے گا۔ جاری رکھیں؟';
$ec_lang['lpn_saveas_overwrites_newer']='آپ کے آخری بار دیکھنے کے بعد اس فائل میں تبدیلی آئی ہے، اس لیے تقریباً یقینی طور پر کسی اور نے اس میں محفوظ کیا ہے۔ یہاں محفوظ کرنے سے ان کا ورژن آپ کے ورژن سے تبدیل ہو جائے گا۔ جاری رکھیں؟';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='اس پراجیکٹ کا نام';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='{closed} بند ہو گیا۔ اب {opened} دکھایا جا رہا ہے۔';
$ec_lang['lpn_status_closed_empty']='{closed} بند ہو گیا۔ ایک نیا خالی پراجیکٹ شروع کر دیا گیا۔';
$ec_lang['lpn_storage_full']='محفوظ نہیں ہوا۔ براؤزر سٹوریج بھری ہوئی ہے یا دستیاب نہیں، اس لیے یہ ٹیب بند کرنے پر آپ کی حالیہ تبدیلیاں ضائع ہو جائیں گی۔';
$ec_lang['lpn_storage_unreadable']='محفوظ نہیں ہوا۔ یہ پراجیکٹ براؤزر سٹوریج سے پڑھا نہیں جا سکا۔ اس کی محفوظ شدہ کاپی بالکل ویسی ہی چھوڑ دی گئی ہے اور اس پر دوبارہ نہیں لکھا جائے گا، اس لیے اس ٹیب پر کچھ بھی محفوظ نہیں ہو رہا۔ کام جاری رکھنے کے لیے کوئی فائل کھولیں یا نیا پراجیکٹ بنائیں۔';
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
$ec_lang['lpn_about_credits']='کریڈٹس';
$ec_lang['lpn_help_welcome']='خوش آمدید صفحہ';
$ec_lang['lpn_about_license']='GNU General Public License v3.0 یا بعد کے تحت لائسنس یافتہ۔';
$ec_lang['lpn_notes_1_term']='یہ کیسے حل ہوتا ہے';
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
$ec_lang['lpn_notes_1_def']='بطور ڈیفالٹ نیٹ ورک EPANET سولور سے حل ہوتا ہے۔ جب کل رن کا وقت مقرر ہو تو ہر رپورٹنگ ٹائم اسٹیپ ترتیب سے حساب کیا جاتا ہے: ٹینک بھرتے اور خالی ہوتے ہیں، طلب اپنے پیٹرن کی پیروی کرتی ہے، اور ٹول بار رن کو دوبارہ چلاتا ہے۔ جب جہاں ممکن ہو بلٹ اِن سولور استعمال کریں نشان زد ہو، تو ایک لمحے کا حل اس کے بجائے بلٹ اِن سولور سے حل ہو سکتا ہے، لیکن توسیعی مدت کا سمولیشن یا ایسا نیٹ ورک جس میں پریشر بریکر یا عمومی مقصد کا والو (PBV، GPV) ہو ہمیشہ EPANET سولور سے حل ہوتا ہے۔';
$ec_lang['lpn_notes_2_term']='یہ کیا نہیں کرتا';
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
$ec_lang['lpn_notes_2_def']='سرج اور واٹر ہیمر ماڈل نہیں کیے جاتے: تمام نتائج مستحکم یا آہستہ بدلتے بہاؤ کے لیے ہیں، والو کے تیزی سے بند ہونے سے پیدا ہونے والی عبوری دباؤ کی لہر کے لیے نہیں۔';
$ec_lang['lpn_notes_3_term']='پراجیکٹس محفوظ کرنا';
$ec_lang['lpn_notes_3_def']='ہر پراجیکٹ ایک ٹیب ہے، اور ہر ٹیب کام کے دوران اس براؤزر میں محفوظ ہوتا ہے۔ براؤزر کا ڈیٹا صاف کرنے سے وہ سب حذف ہو جاتے ہیں، اس لیے کام فائل میں ہونا چاہیے: فائل، اس طرح محفوظ کریں۔ ٹیب پر ستارہ کا مطلب ہے کہ اس میں ایسی تبدیلیاں ہیں جو کسی فائل میں نہیں ہیں، اور اس ٹیب کو بند کرنے سے پہلے پوچھا جاتا ہے۔ فائل میں کچھ کبھی نہیں لکھا جاتا جب تک محفوظ کریں یا اس طرح محفوظ کریں نہ چنا جائے۔ کچھ براؤزرز میں پراجیکٹ اس فائل سے جڑ جاتا ہے جس میں وہ محفوظ ہوا، اور فائل، محفوظ کریں اس کے بعد اسی فائل میں واپس لکھتا ہے؛ دوسروں میں کوئی جڑاؤ ممکن نہیں، اس لیے محفوظ کریں غیر فعال ہے اور صرف اس طرح محفوظ کریں دستیاب ہے۔ یہ سائٹ ٹریک رکھتی ہے کہ کس نے پراجیکٹ فائل کھولی ہوئی ہے، تاکہ دو لوگ ایک دوسرے کے اوپر نہ لکھیں۔ جو فائل کسی ساتھی نے پہلے سے کھولی ہو اسے کھولنے پر پوچھیں، صرف پڑھنے کے لیے کھولیں، اور لاک توڑیں پیش کیے جاتے ہیں۔ اگر سرور تک رسائی نہ ہو سکے تو ایک انتباہ بتاتا ہے کہ دوسرا صارف اسی فائل میں اسی وقت ترمیم کر سکتا ہے۔';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='پمپ وکر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='پمپ H = H₀ − aQ^b کی پیروی کرتا ہے، جہاں H وہ ہیڈ ہے جو پمپ شامل کرتا ہے اور Q اس میں سے گزرنے والا بہاؤ ہے۔ وکر کے نقطے پانی، لائبریریاں میں پمپ ہیڈ وکر کے طور پر درج کیے جاتے ہیں، اور پمپ وہ وکر خصوصیات میں بتاتا ہے۔ تین نقطے، صفر بہاؤ پر ہیڈ، عام کام کا نقطہ، اور سب سے زیادہ بہاؤ کا نقطہ، H₀، a اور b کو براہ راست فٹ کرتے ہیں، اور شائع شدہ وکر کی سب سے قریب پیروی کرتے ہیں۔ دو نقطے ایک پیرابولا (b = 2) فٹ کرتے ہیں جس کی چوٹی صفر بہاؤ پر ہوتی ہے۔ ایک نقطہ EPANET کا اصول استعمال کرتا ہے: صفر بہاؤ پر ہیڈ درج کیے گئے ہیڈ کا 1.33334 گنا ہے، اور سب سے زیادہ بہاؤ درج کیے گئے بہاؤ کا 2 گنا ہے، جو پھر b = 2 دیتا ہے۔ جس پمپ کا وکر بتایا نہ گیا ہو وہ کوئی ہیڈ شامل نہیں کرتا۔ وکر وہاں سے کاٹا نہیں جاتا جہاں ہیڈ صفر تک پہنچے، اس لیے وکر کے دے سکنے سے زیادہ بہاؤ منفی ہیڈ پیدا کرتا ہے۔ علاج بڑا پمپ یا کم طلب ہے، نہ کہ وکر کی کوئی اور فٹنگ۔ وکر تین سے زیادہ نقطے رکھ سکتا ہے۔ EPANET سولور کو وہ سب دیے جاتے ہیں اور وہ ان کے درمیان انٹرپولیٹ کرتا ہے، جبکہ مساوات کی سطر اور بلٹ اِن سولور سب سے کم، درمیانے اور سب سے زیادہ نقطے استعمال کرتے ہیں۔';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_6_term']='جدول کے کالمز کی مدد';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE -- the Hide/Show row beside it names the
// identical menu. **GESTURE FIRST, THEN ACTION, SINCE 2026-10-06** (Ida, User guide): the cells were
// swapped in all 27 files, by script and unchanged, so this table reads in the same order as the
// key-then-action tables beside it (lpn_notes_7_def, lpn_hotkeys_map_def).
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>عنوان پر کلک کریں</td><td>کالم منتخب کریں</td></tr><tr><td>کسی دوسرے عنوان پر Ctrl+کلک یا Shift+کلک کریں</td><td>کالم کا انتخاب شامل یا بڑھائیں</td></tr><tr><td>گھسیٹیں یا رائٹ کلک یا ⋮ مینو میں کالمز کا انتظام کریں… استعمال کریں</td><td>منتخب کالم(ز) منتقل کریں (ترتیب بدلیں)</td></tr><tr><td>عنوان کے اوپری کونے پر ہوور کریں، یا کسی عنوان کو منتخب کریں یا Tab سے اس میں جائیں</td><td>مینو ⋮ اور ترتیب کا تیر۔</td></tr><tr><td>عنوان پر رائٹ کلک کریں یا عنوان کے اوپری دائیں کونے میں ⋮ مینو</td><td>چھپائیں، سب دکھائیں، یا نمائش اور ترتیب کا انتظام کریں</td></tr><tr><td>عنوان کے اوپری دائیں کونے میں تیر کی علامت</td><td>کالم کے مطابق ترتیب دیں</td></tr><tr><td>رائٹ کلک، عنوان کے اوپری دائیں کونے میں ⋮ مینو، یا Ctrl+Shift+V</td><td>جدول کے آخر میں نئی قطاروں کے طور پر پیسٹ کریں</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='جدول کیبورڈ شارٹ کٹس';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Arrow keys</td><td>نیویگیٹ کریں۔</td></tr><tr><td>Tab, Enter</td><td>اندراج مکمل کریں اور ایک سیل دائیں (Tab) یا نیچے (Enter) جائیں۔</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>ایک سیل پیچھے (Shift+Tab) یا اوپر (Shift+Enter) جائیں۔</td></tr><tr><td>Shift+arrow keys</td><td>انتخاب کو بڑھائیں۔</td></tr><tr><td>Ctrl+C</td><td>انتخاب کاپی کریں۔</td></tr><tr><td>Ctrl+D</td><td>انتخاب کو اس کی سب سے اوپر والی قطار سے نیچے بھریں۔</td></tr><tr><td>Ctrl+Enter</td><td>انتخاب کو فعال سیل کی قدر سے بھریں۔</td></tr><tr><td>Ctrl+A</td><td>پورا جدول منتخب کریں۔</td></tr><tr><td>Ctrl+Shift+V</td><td>جدول کے آخر میں نئی قطاروں کے طور پر پیسٹ کریں۔</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>اگلے یا پچھلے ٹیب پر جائیں، چاہے وہ جدول ہو یا گراف۔</td></tr><tr><td>Delete</td><td>فعال سیل صاف کریں۔ منتخب دائرہ صاف کرنے کے لیے رائٹ کلک کریں اور حذف کریں چنیں۔</td></tr><tr><td>F2</td><td>ترمیم کے لیے سیل کھولیں۔</td></tr><tr><td>Esc</td><td>ترمیم منسوخ کریں۔</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='رنگ بینڈ کی حدیں ایک جیسی رہتی ہیں';
$ec_lang['lpn_notes_color_def']='رنگ کے بینڈز کی حدیں تب مقرر ہوتی ہیں جب ڈیٹا کی درجہ بندی کا طریقہ چنا جائے۔ وہ ہر ٹائم اسٹیپ پر دوبارہ مقرر نہیں ہوتیں، کیونکہ اس سے رنگوں کا مطلب ہر اسٹیپ پر نیا ہو جائے گا، جو نظام کو دیکھنے کے لیے مددگار نہیں۔ منظرنامہ بنیاد کی حدیں دکھاتا ہے۔ EPANET بھی اسی طرح کام کرتا ہے۔ نئی حدیں پانے کے لیے، طریقہ دوبارہ چنیں یا حدیں درج کریں۔';
$ec_lang['lpn_notes_engine_term']='یہ صفحہ کون سا EPANET چلاتا ہے';
$ec_lang['lpn_notes_engine_def']='اس صفحے پر EPANET حل کار OWA-EPANET 2.3.5 ہے، جو 20 فروری 2025 کو جاری ہوا۔ EPANET کو Open Water Analytics تیار کرتی ہے، ایک کمیونٹی جو امریکی Environmental Protection Agency کے ساتھ کام کرتی ہے، جس نے دسمبر 2019 میں ورژن 2.2.0 جاری کیا۔ رن رپورٹ اسے 2.3.05 کہتی ہے کیونکہ انجن آخری عدد کو دو ہندسوں میں لکھتا ہے۔ یہ Luke Butler کے epanet-js 0.9.0 کے ذریعے، MIT لائسنس کے تحت اس صفحے تک پہنچتا ہے، اور آپ کے براؤزر کے اندر ہی چلتا ہے: آپ کا نیٹ ورک حل کرنے کے لیے کہیں نہیں بھیجا جاتا۔';
// The Notes example (Task 785). Held by dev/lpn-spike/user-guide-notes-harness.js.
$ec_lang['lpn_guide_nt_example_term']='Net1 پر مثال: پمپ اپنے وکر سے آگے';
$ec_lang['lpn_guide_nt_example_def']='Net1 کی مثال کھولیں اور پانی، لائبریریاں چنیں۔ وکر 1، Pump Curve for Pump 9، کا ایک نقطہ ہے، 250 ft پر 1500 gpm۔ صفر بہاؤ پر ہیڈ 333.3 ft ہے اور سب سے زیادہ بہاؤ 3000 gpm ہے۔ 3500 gpm پر، جو وکر کے سرے سے آگے ہے، وکر −120.4 ft کا ہیڈ دیتا ہے۔ EPANET سولور وہی ہیڈ رپورٹ کرتا ہے، پمپ کے آر پار 120.4 ft کا نقصان، اور انتباہ دیتا ہے کہ پمپ کافی بہاؤ یا ہیڈ نہیں دے سکتے۔';
// The user manual's own entry (Task 785). Held by dev/lpn-spike/user-guide-own-harness.js.
$ec_lang['lpn_guide_own_example_def']='<p>Net1 کی مثال کھولیں، Ctrl+K دبائیں، اور critical لکھیں۔ مینو پانی، تجزیہ کے تحت قطار نازکی کا تجزیہ… دکھاتا ہے۔ باکس وہ اندراجات دکھاتا ہے جو اس کا ذکر کرتے ہیں، ان میں تلاش اور تبدیلی، فائر فلو تجزیہ، اور نازکی کا تجزیہ، اور یہ اندراج۔ قطار چننے سے دکھایا جاتا ہے کہ نازکی کا تجزیہ… تجزیہ مینو میں کہاں ہے، اور یہ اسے چلاتا نہیں۔</p>';
$ec_lang['lpn_id_invalid']='ایسا ID درج کریں جس میں کوئی خالی جگہ اور کوئی اقتباسی نشان نہ ہو۔';
$ec_lang['lpn_id_taken']='یہ ID پہلے سے استعمال میں ہے۔';
$ec_lang['lpn_diag_no_fixed_head']='ایک ریزروائر یا ٹینک شامل کریں۔ حل ہونے سے پہلے نیٹ ورک کو کم از کم ایک معلوم پانی کی سطح درکار ہے۔';
$ec_lang['lpn_diag_dangling_link']='ایک پائپ یا پمپ ایک ایسے نوڈ سے جڑا ہے جو اب موجود نہیں:';
$ec_lang['lpn_diag_unreachable']='ان نوڈز کا کسی ریزروائر یا ٹینک تک کوئی راستہ نہیں:';
// Tom, 2026-10-09: a node nothing connects to a source is left out of the run, not refused. The
// ids stand in the status bar until the network changes. Said in EPANET's own terms (junction,
// reservoir, tank) and never as an error, because the run happened.
$ec_lang['lpn_omitted_note']='اس رن سے خارج کیے گئے کیونکہ ان سے کسی ریزروائر یا ٹینک تک کوئی راستہ نہیں جاتا: {ids}';
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
$ec_lang['lpn_engine_fetching']='EPANET حل کار ڈاؤن لوڈ کیا جا رہا ہے۔ یہ ایک بار ڈاؤن لوڈ ہوتا ہے اور پھر اس آلے پر محفوظ رہتا ہے، اس لیے بعد میں یہ آف لائن کام کرتا ہے۔';
$ec_lang['lpn_engine_ready']='EPANET حل کار اب اس آلے پر موجود ہے، اور آف لائن کام کرتا ہے۔';
$ec_lang['lpn_engine_unavailable']='EPANET سولور ڈاؤن لوڈ نہیں ہو سکا، جو پریشر بریکر اور عمومی مقصد کے والوز (PBV، GPV) کو حل کرنے کے لیے ضروری ہے۔ انٹرنیٹ سے ایک بار جڑنے کے بعد سولور اس آلے پر محفوظ ہو جاتا ہے۔';
// The cause-specific sibling: {reason} is lpn_time_engine_fetch_failed (only a download can reach this notice).
// Offline keeps the sentence above. {wrong} in lpn_time_engine_run_failed is filled with lpn_wrong_btn.
$ec_lang['lpn_engine_unavailable_why']='EPANET سولور کے بغیر پریشر بریکر اور عمومی مقصد کے والوز (PBV، GPV) حل نہیں کیے جا سکتے۔ {reason}';
$ec_lang['lpn_engine_needed_loading']='آپ کے بناتے وقت EPANET حل کار لوڈ ہو رہا ہے۔ مکمل لوڈ ہونے پر نتائج دستیاب ہوں گے۔';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='حل کار لوڈنگ کی پیش رفت';
$ec_lang['lpn_engine_wait']='حل کار لوڈ ہو رہا ہے۔ نتائج تھوڑی دیر کے لیے موخر ہیں۔ کام جاری رکھیں۔';
$ec_lang['lpn_engine_wait_pct']='حل کار {percent}% لوڈ ہوا۔';
$ec_lang['lpn_engine_wait_bytes']='حل کار ابھی تک {kb} KB لوڈ ہوا۔ کل مقدار دستیاب نہیں، اس لیے تکمیل کا فیصد معلوم نہیں۔';
$ec_lang['lpn_engine_needed_failed']='EPANET حل کار ابھی تک لوڈ نہیں ہوا، لوڈ نہیں ہو سکتا، اور یہ نیٹ ورک صرف اسی سے حل ہو سکتا ہے۔ جب آپ انٹرنیٹ سے جڑیں گے تو یہ لوڈ ہو جائے گا۔';
$ec_lang['lpn_engine_needed_failed_why']='یہ نیٹ ورک صرف EPANET حل کار سے حل ہو سکتا ہے۔ {reason}';
$ec_lang['lpn_diag_valve_on_fixed_head']='یہ والوز براہ راست کسی ریزروائر یا ٹینک سے جڑے ہیں، جو اس نوڈ پر ہائیڈرالک گریڈ مقرر کر دیتا ہے، اس لیے والو کے کنٹرول کرنے کے لیے کچھ نہیں بچتا۔ والو اور ریزروائر یا ٹینک کے درمیان ایک چھوٹا پائپ ڈالیں:';
$ec_lang['lpn_diag_not_converged']='کوئی حل نہیں ملا۔ طبعی طور پر ناممکن قدروں کی جانچ کریں، جیسے صفر قطر۔';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='حل ہم آہنگ (converge) نہیں ہوا۔ یہ اعداد آخری کوشش کے ہیں، کوئی جواب نہیں۔ انہیں استعمال نہ کریں۔';
$ec_lang['lpn_diag_not_converged_trials']='یہ {iterations} کوششوں کے بعد رک گیا۔';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='یہ {iterations} کوششوں کے بعد {error} کی نسبتی خرابی پر رک گیا، جو {accuracy} کی درستگی کی ترتیب تک نہیں پہنچی۔';
$ec_lang['lpn_field_roughness']='کھردرا پن';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='ہیزن-ولیمز C۔ زیادہ عدد کا مطلب ہموار تر پائپ ہے: نئے پلاسٹک کے لیے تقریباً 150، نئے سٹیل یا لوہے کے لیے 130، اور پرانے پائپ کے لیے 100۔';
$ec_lang['lpn_field_length']='لمبائی';
// Task 643 (Tom, 2026-10-14): an Auto length is the slope distance. No claim about accuracy (Task 641).
$ec_lang['lpn_field_length_slope_tip']='پائپ کی لمبائی۔ جب خودکار کا نشان لگا ہو تو لمبائی ڈھلان کے ساتھ ناپی جاتی ہے: بنائی گئی لمبائی اور دونوں سرے کے نوڈز کی بلندی کے فرق کو ملا کر۔';
$ec_lang['lpn_field_from']='سے';
$ec_lang['lpn_field_to']='تک';
// Tom, 2026-10-09: From and To are editable text. Said in the box a refused ID is said in.
$ec_lang['lpn_link_end_unknown']='کسی نوڈ کی ID {id} نہیں ہے۔';
$ec_lang['lpn_link_end_same']='سے اور تک الگ نوڈ ہونے چاہئیں۔';
// Tom, 2026-10-09: "Break link for node?", adapted to name the pipe. The two answers are Yes and No
// because No is not a cancel: it places the node where it was pressed, joined to nothing.
$ec_lang['lpn_split_pipe_ask']='پائپ {id} کو اس نوڈ پر تقسیم کریں؟';
// Object snap (Task 782). The tip beside the snap glyph on a pipe vertex: "Pipe 10, vertex 2". A node
// or a pipe is named by its type word and ID alone.
$ec_lang['lpn_snap_vertex']='{link}، موڑ نقطہ {n}';
// A tank, reservoir or junction snapped onto a node of another type is placed at exactly that
// position. Two nodes at one point are legal in EPANET, and the map cannot show that they are separate.
$ec_lang['lpn_snap_node_on_node']='{new} کو {target} کے مقام پر رکھا گیا۔ دونوں نوڈز جڑے ہوئے نہیں ہیں۔';
// The same, for a node DRAGGED onto another node.
$ec_lang['lpn_snap_moved_on_node']='{moved} کو {target} کے مقام پر منتقل کیا گیا۔ دونوں نوڈز جڑے ہوئے نہیں ہیں۔';
// The Shape (Task 779): map annotation, a point, a polyline or a polygon. Tom, 2026-10-06: "Either
// way, we call it a 'Shape'". The tip beside the snap glyph on a Shape point: "Shape S1, point 2".
$ec_lang['lpn_snap_shape_point']='{shape}، پوائنٹ {n}';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='والو کی قسم';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='والو کی قسم۔ تھروٹل والو (TCV) ایک مقررہ نقصان لاگو کرتا ہے۔ PRV، PSV اور FCV دباؤ یا بہاؤ برقرار رکھتے ہیں، اور ہائیڈرالک حالات بدلنے کے ساتھ مکمل کھلتے، بند ہوتے، یا جزوی طور پر بند ہوتے ہیں۔ PBV ایک مقررہ دباؤ ہٹاتا ہے، اور GPV ہیڈ نقصان وکر کی پیروی کرتا ہے۔ یہ اقسام مختلف ہائیڈرالک خصوصیات کو کنٹرول کرتی ہیں، اس لیے قسم بدلنے پر سیٹنگز ضائع ہو سکتی ہیں۔';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='تھروٹل (TCV)';
$ec_lang['lpn_valve_type_prv']='دباؤ کم کرنے والا (PRV)';
$ec_lang['lpn_valve_type_psv']='دباؤ برقرار رکھنے والا (PSV)';
$ec_lang['lpn_valve_type_fcv']='بہاؤ کنٹرول (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='پریشر بریکر (PBV)';
$ec_lang['lpn_valve_type_gpv']='عمومی مقصد (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='دباؤ کی کمی';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='وہ دباؤ جو والو ختم کرتا ہے۔ پریشر بریکر والو ہمیشہ بالکل اتنا ہی دباؤ ختم کرتا ہے، خواہ پانی کسی بھی سمت جا رہا ہو۔ یہ والو کے آر پار ایک کمی ہے، برقرار رکھنے والا دباؤ نہیں۔';
$ec_lang['lpn_inp_drop_gpv_curve']='یہ والو ایسے ہیڈ نقصان وکر کا حوالہ دیتا ہے جو فائل میں موجود نہیں۔ والو بغیر وکر کے درآمد ہوا، اس لیے جب تک کوئی وکر چنا نہ جائے یہ مکمل کھلا رہتا ہے۔';
$ec_lang['lpn_gpv_curve_source']='والو ہیڈ لاس وکر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='لائبریریاں خانے میں موجود وکر جو ہر بہاؤ پر اس والو سے ہیڈ نقصان دیتا ہے۔ کئی والو ایک ہی وکر استعمال کر سکتے ہیں، اور وہاں اس میں ترمیم کرنے سے ان سب میں تبدیلی آتی ہے۔';
$ec_lang['lpn_field_valve_setting_pressure']='دباؤ کی ترتیب';
$ec_lang['lpn_field_valve_setting_pressure_tip']='دباؤ کم کرنے والا والو اپنے زیریں رخ کے دباؤ کو اس قدر پر یا اس سے کم رکھتا ہے۔ دباؤ برقرار رکھنے والا والو اپنے بالائی رخ کے دباؤ کو اس قدر پر یا اس سے زیادہ رکھتا ہے۔';
$ec_lang['lpn_field_valve_setting_flow']='بہاؤ کی ترتیب';
$ec_lang['lpn_field_valve_setting_flow_tip']='والو سے زیادہ سے زیادہ بہاؤ۔ جب بہاؤ اس قدر سے کم ہو تو والو مکمل کھلا رہتا ہے اور کوئی نقصان شامل نہیں کرتا۔';
$ec_lang['lpn_field_valve_setting']='ترتیب';
$ec_lang['lpn_field_valve_setting_loss']='نقصان گتانک';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='تھروٹل والو کا ہٹایا ہوا ہیڈ، رفتار ہیڈ کے ایک ضرب کے طور پر۔ مکمل کھلے والو کے لیے 0 استعمال کریں۔ یہ ایک قدر ہی تھروٹل والو کا پورا نقصان ہے۔';
$ec_lang['lpn_field_valve_diameter_tip']='والو کے راستے کے کھلاؤ کی چوڑائی۔ والو سے گزرنے والے پانی کی رفتار اسی چوڑائی سے شمار کی جاتی ہے، اور نقصان اسی رفتار سے نکلتا ہے۔';
$ec_lang['lpn_field_valve_km_tip']='والو کے مکمل کھلے ہونے پر والو کے جسم سے نقصان، والو کی سیٹنگ سے ہونے والے کسی بھی نقصان کے علاوہ۔ یہ رفتار ہیڈ کے ایک ضرب کے طور پر ظاہر کیا جاتا ہے۔ اسے نظر انداز کرنے کے لیے 0 استعمال کریں۔';
$ec_lang['lpn_field_km']='مقامی نقصان کا گتانک، k';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='مقامی نقصان، k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='پمپ ہیڈ وکر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='لائبریریاں خانے میں موجود وکر جو ہر بہاؤ پر اس پمپ کا شامل کردہ ہیڈ دیتا ہے۔ کئی پمپ ایک ہی وکر استعمال کر سکتے ہیں، اور وہاں اس میں ترمیم کرنے سے ان سب میں تبدیلی آتی ہے۔';
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
$ec_lang['lpn_field_desc']='تفصیل';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='ٹیگ';
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
$ec_lang['lpn_field_tag_tip']='ٹیگ کا کوئی بھی مطلب ہو سکتا ہے جو آپ کو درکار ہو، جیسے پریشر زون یا ورک آرڈر۔ نہ یہاں اور نہ EPANET میں کوئی حساب اسے پڑھتا ہے۔ ٹیگ ایک لفظ ہے: EPANET پہلی خالی جگہ پر پڑھنا بند کر دیتا ہے، اس لیے ٹائپ کرتے وقت خالی جگہ قبول نہیں کی جاتی۔ یہ EPANET فائل میں اور اس سے باہر منتقل ہوتا ہے۔';
$ec_lang['lpn_pump_effic_curve']='پمپ افادیت وکر';
$ec_lang['lpn_pump_effic_curve_tip']='لائبریریاں خانے میں موجود وکر جو بتاتا ہے کہ یہ پمپ ہر بہاؤ پر کتنا موثر ہے۔ کئی پمپ ایک ہی وکر استعمال کر سکتے ہیں، اور وہاں اسے بدلنا ان سب کو بدل دیتا ہے۔ یہ پمپ صرف حوالہ رکھتا ہے؛ پوائنٹس خود لائبریریاں، وکر کے تحت پڑھے اور بدلے جاتے ہیں۔';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='کوئی وکر نہیں چنا گیا';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='وکر';
$ec_lang['lpn_curve_library_link_tip']='لائبریریاں خانہ اس کے وکر سیکشن پر کھولیں، جہاں وکر شامل، بیان، ترمیم اور حذف کیا جاتا ہے۔ عنصر بتاتا ہے کہ وہ کون سا وکر استعمال کرتا ہے۔';
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
$ec_lang['lpn_curve_kind_head']='پمپ ہیڈ';
$ec_lang['lpn_curve_kind_effic']='پمپ افادیت';
$ec_lang['lpn_curve_kind_volume']='ٹینک حجم';
$ec_lang['lpn_curve_kind_headloss']='والو ہیڈ لاس';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='قسم بیان نہیں کی گئی';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='حجم';
$ec_lang['lpn_pump_effic_col']='افادیت';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='اس پمپ کے لیے کوئی افادیت وکر نہیں چنا گیا، اس لیے یہ پورے نیٹ ورک کے لیے مقرر کردہ افادیت، {percent}، پر چلتا ہے۔';
$ec_lang['lpn_pump_effic_unstated']='یہ پمپ {name} نامی ایک افادیت وکر کا حوالہ دیتا ہے، جسے اس پراجیکٹ میں کچھ بھی متعین نہیں کرتا، اس لیے یہ پورے نیٹ ورک کے لیے مقرر کردہ افادیت، {percent}، پر چلتا ہے۔';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='موڈ: منتخب کریں۔ کسی عنصر، لیبل یا متن کو دیکھنے یا بدلنے کے لیے اسے منتخب کریں۔ نوڈ، لیبل یا متن کو منتقل کرنے کے لیے گھسیٹیں۔ پائپ کے موڑ شامل یا حذف کرنے کے لیے موڑ نقاط ٹول استعمال کریں۔';
$ec_lang['lpn_mode_delete']='موڈ: حذف کریں۔ کسی عنصر کو ہٹانے کے لیے اسے منتخب کریں۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='موڈ: موڑ نقاط۔ ہر پائپ کے موڑ نقاط چھوٹے مربع ہینڈلز کے طور پر دکھائے جاتے ہیں۔ موڑ نقطہ شامل کرنے کے لیے پائپ پر پوائنٹ متعین کریں، اسے حذف کرنے کے لیے ہینڈل منتخب کریں، یا منتقل کرنے کے لیے ہینڈل کو گھسیٹیں۔ اس موڈ میں نقشے پر کچھ اور تبدیل نہیں کیا جا سکتا۔';
$ec_lang['lpn_mode_zoom_window']='موڈ: زوم ونڈو۔ نقشے پر کسی ڈبے کے دو مخالف کونے متعین کریں، یا ایک کو گھسیٹیں، تاکہ اس پر زوم ہو سکے۔';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='کچھ منتخب نہیں ہے۔ پہلے نقشے پر کوئی عنصر منتخب کریں، پھر حذف کریں دبائیں۔';
$ec_lang['lpn_mode_add_junction']='موڈ: جنکشن شامل کریں۔ جنکشن رکھنے کے لیے نقشے پر مقام متعین کریں۔ عناصر، لیبلز اور متن بدلنے یا منتقل کرنے کے لیے منتخب کریں موڈ پر جائیں۔';
$ec_lang['lpn_mode_add_reservoir']='موڈ: ریزروائر شامل کریں۔ ریزروائر رکھنے کے لیے نقشے پر مقام متعین کریں۔ عناصر، لیبلز اور متن بدلنے یا منتقل کرنے کے لیے منتخب کریں موڈ پر جائیں۔';
$ec_lang['lpn_mode_add_tank']='موڈ: ٹینک شامل کریں۔ ٹینک رکھنے کے لیے نقشے پر مقام متعین کریں۔ عناصر، لیبلز اور متن بدلنے یا منتقل کرنے کے لیے منتخب کریں موڈ پر جائیں۔';
$ec_lang['lpn_mode_add_pipe']='موڈ: پائپ شامل کریں۔ انہیں جوڑنے کے لیے ابتدائی نوڈ اور پھر آخری نوڈ منتخب کریں۔ لائن موڑنے کے لیے درمیان میں خالی جگہ پر پوائنٹس متعین کریں، یا دوبارہ شروع کرنے کے لیے Esc دبائیں۔ عناصر، لیبلز اور متن بدلنے یا منتقل کرنے کے لیے منتخب کریں موڈ پر جائیں۔';
$ec_lang['lpn_mode_add_pump']='موڈ: پمپ شامل کریں۔ انہیں جوڑنے کے لیے ابتدائی نوڈ اور پھر آخری نوڈ منتخب کریں۔ لائن موڑنے کے لیے درمیان میں خالی جگہ پر پوائنٹس متعین کریں، یا دوبارہ شروع کرنے کے لیے Esc دبائیں۔ عناصر، لیبلز اور متن بدلنے یا منتقل کرنے کے لیے منتخب کریں موڈ پر جائیں۔';
$ec_lang['lpn_mode_add_valve']='موڈ: والو شامل کریں۔ انہیں جوڑنے کے لیے ابتدائی نوڈ اور پھر آخری نوڈ منتخب کریں۔ لائن موڑنے کے لیے درمیان میں خالی جگہ پر پوائنٹس متعین کریں، یا دوبارہ شروع کرنے کے لیے Esc دبائیں۔ عناصر، لیبلز اور متن بدلنے یا منتقل کرنے کے لیے منتخب کریں موڈ پر جائیں۔';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='موڈ: متن شامل کریں۔ متن رکھنے کے لیے نقشے پر مقام متعین کریں۔ متن کو کسی نوڈ سے منسلک کرنے کے لیے اس نوڈ کے قریب مقام متعین کریں۔ عناصر، لیبلز اور متن بدلنے یا منتقل کرنے کے لیے منتخب کریں موڈ پر جائیں۔';
$ec_lang['lpn_mode_add_chain']='موڈ: جنکشن پائپ زنجیر۔ جنکشن شامل کرنے کے لیے نقشے پر ایک پوائنٹ متعین کریں، پھر ہر اگلا پوائنٹ متعین کر کے پائپ اور جنکشن شامل کریں۔ کسی موجودہ نوڈ سے آگے بڑھنے کے لیے اسے متعین کریں۔ زنجیر ختم کرنے کے لیے Esc دبائیں۔ عناصر، لیبلز اور متن بدلنے یا منتقل کرنے کے لیے منتخب کریں موڈ پر جائیں۔';
$ec_lang['lpn_mode_add_shape']='موڈ: شکل شامل کریں۔ ہر پوائنٹ متعین کریں۔ ختم کرنے کے لیے آخری پوائنٹ دوبارہ متعین کریں یا Enter دبائیں؛ کثیر الاضلاع بند کرنے کے لیے پہلا پوائنٹ متعین کریں۔';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='نقشے پر اثاثوں اور متن کو بدلنے، منتقل کرنے اور گھسیٹنے، یا نقشہ پین کرنے کے لیے یہ موڈ استعمال کریں۔ یہ نقشے کا ڈیفالٹ موڈ ہے۔ Esc دوسری بار دبانے سے انتخاب ختم ہو جاتا ہے۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='خودکار';
$ec_lang['lpn_method_switch_confirm']='رگڑ کا طریقہ بدلنے سے آپ کے پائپوں پر پہلے سے درج کھردرا پن کی قدریں تبدیل نہیں ہوتیں، اور ایک طریقے کا کھردرا پن دوسرے کے لیے بے معنی ہوتا ہے۔ اس کے بعد ہر پائپ چیک کریں۔ پھر بھی تبدیل کریں؟';
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
$ec_lang['lpn_field_closed']='بند';
$ec_lang['lpn_field_closed_tip']='اس پائپ کو بند کریں تاکہ اس سے کوئی پانی نہ گزر سکے۔ پائپ نقشے پر رہتا ہے اور اپنے تمام اعداد برقرار رکھتا ہے، اور آپ اسے کسی بھی وقت دوبارہ کھول سکتے ہیں۔';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='طول بلد';
$ec_lang['lpn_field_lat']='عرض بلد';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='نارتھنگ';
$ec_lang['lpn_field_easting']='ایسٹنگ';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='N';
$ec_lang['lpn_field_easting_abbr']='E';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='عرض';
$ec_lang['lpn_field_lon_abbr']='طول';
// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='اس نوڈ کو بالکل درست جگہ پر رکھنے کے لیے ایک احداثی مقام درج کریں۔ کسی منظرنامے میں یہ مقام صرف اسی منظرنامے میں لاگو ہوتا ہے، جیسے گھسیٹنا؛ بنیاد میں یہ نوڈ کو ہر منظرنامے میں رکھتا ہے۔';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='یہ نقشے سے باہر ہے۔ سیوڈو مرکیٹر میں عرض بلد -85.05 سے 85.05 تک اور طول بلد -180 سے 180 تک ہوتا ہے۔';
$ec_lang['lpn_field_text_size']='سائز مضاعف';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='ہر زوم سطح پر دکھائیں';
$ec_lang['lpn_field_text_all_zoom_tip']='اس متن کو ڈرائنگ پر رکھیں چاہے کتنا ہی باہر زوم کریں۔ منظر نقشہ اور صفحہ کے تحت مقرر کردہ لیبلنگ کی حد سے زیادہ چوڑا ہونے پر اس متن کو دوسرے لیبلز کے ساتھ چھپانے کے لیے اس کا نشان ہٹائیں۔';
$ec_lang['lpn_tool_labels']='لیبلز';
$ec_lang['lpn_labels_heading_node']='نوڈ لیبلز';
$ec_lang['lpn_labels_heading_link']='لنک لیبلز';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='سب پر لاگو کریں';
$ec_lang['lpn_settings_apply_to_all_tip']='اس قسم کا ہر عنصر جو پہلے سے کھینچا جا چکا ہے اسے ایسی ID ملتی ہے جو اس متن سے شروع ہو۔ ہر ایک اپنا نمبر رکھتا ہے۔ جو ID کسی عدد پر ختم نہ ہو اسے چھوڑ دیا جاتا ہے۔';
$ec_lang['lpn_confirm_apply_prefix']='عناصر ({n}) کا نام بدل کر ان کی IDs {prefix} سے شروع کر دی جائیں؟ ہر ایک اپنا نمبر رکھے گا۔';
$ec_lang['lpn_prefix_applied']='جن عناصر کا نام بدلا گیا: {n}۔ جو تبدیل نہیں ہوئے: {skipped}۔';
$ec_lang['lpn_labels_suffix_gradient_tip']='نقشے کے لیبلز پر ہیڈ لاس گریڈیئنٹ کے بعد شامل کیا گیا متن۔ یہاں فیصد کی علامت نہ لکھیں۔ جب یونٹ فیصد ہو تو یہ خود بخود شامل کر دیا جاتا ہے۔';
$ec_lang['lpn_labels_separator']='قدروں کے درمیان متن';
$ec_lang['lpn_labels_separator_tip']='لیبل پر ایک خصوصیت اور اگلی کے درمیان متن۔ پہلے سے مقررہ طور پر ایک خالی جگہ۔';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='ترجیح';
// Edited by TGH 2026-09-07
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='وہ ترتیب جس میں لیبل نہ سمانے پر قدریں چھوڑی جاتی ہیں۔ نمبر 1 والی قدر سب سے پہلے چھوڑی جاتی ہے۔ جب صرف ایک قدر باقی رہے اور دو لیبل پھر بھی اوورلیپ کریں تو ان میں سے ایک چھپا دیا جاتا ہے: وہ جس کی طلب کم ہو، جس کا دباؤ حد کے وسط کے زیادہ قریب ہو، یا جس کی بلندی یا ہیڈ اپنے پڑوسی نوڈز سے زیادہ ملتا جلتا ہو۔';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='پہلے';
$ec_lang['lpn_labels_col_after']='بعد';
$ec_lang['lpn_labels_col_decimals']='اعشاریہ';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_show_tip']='وہ ترتیب جس میں قدریں لیبل پر ظاہر ہوتی ہیں۔ نمبر 1 والی قدر پہلے آتی ہے: سٹیکڈ لیبل کے اوپر، اور ایک لائن والے لیبل کے شروع میں۔';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='یونٹس استعمال کریں';
$ec_lang['lpn_labels_use_units_tip']='بعد خانے میں اور لیبل پر اکائی دکھانے، اور اکائیاں بدلنے پر اسے اپ ڈیٹ کرنے کے لیے منتخب کریں۔ اپنا بعد متن درج کرنے کے لیے نشان ہٹائیں۔';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='ابتدائی حالت';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='نوڈ کے رنگ';
$ec_lang['lpn_settings_sym_link_colors']='پائپ کے رنگ';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='پس منظر کی تصویر…';
$ec_lang['lpn_backdrop_add']='شامل کریں';
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
$ec_lang['lpn_backdrop_scale']='چن کر پیمانہ مقرر کریں';
$ec_lang['lpn_backdrop_scale_entry']='جغرافیائی حوالہ فائل یا نقشے پر ایک پکسل کے سائز سے پیمانہ مقرر کریں';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='موجودہ سائز سے، آپ کے چنے ہوئے پوائنٹ کے گرد پیمانہ کریں';
$ec_lang['lpn_backdrop_scale_from_prompt1']='پس منظر کی تصویر پر وہ پوائنٹ متعین کریں جو اپنی جگہ پر رہنا چاہیے۔';
$ec_lang['lpn_backdrop_scale_from_prompt2']='اس کے موجودہ سائز سے پیمانہ کریں۔ 1 اسے وہی رکھتا ہے، 1.1 اسے 10% بڑا کرتا ہے، 0.9 اسے 10% چھوٹا کرتا ہے۔';
$ec_lang['lpn_backdrop_scale_entry_prompt']='نقشے پر ایک پکسل کا سائز درج کریں، یا تصویر کی جغرافیائی حوالہ فائل کا مکمل مواد پیسٹ کریں';
$ec_lang['lpn_backdrop_scale_entry_bad']='نقشے پر ایک پکسل کے سائز کے لیے ایک عدد ٹائپ کریں، یا جغرافیائی حوالہ فائل کی تمام چھ سطریں پیسٹ کریں۔';
$ec_lang['lpn_backdrop_wld_bad']='یہ جغرافیائی حوالہ فائل تصویر کو گھماتی، اُلٹاتی، یا دونوں سمتوں میں غیر مساوی طور پر کھینچتی ہے۔ نقشہ صرف تصویر کو منتقل کر سکتا ہے اور دونوں سمتوں میں یکساں مقدار سے اس کا حجم تبدیل کر سکتا ہے، اس لیے یہ فائل استعمال نہیں کی گئی۔';
$ec_lang['lpn_backdrop_unreadable']='آپ کا براؤزر یہ تصویر نہیں دکھا سکتا۔ اسے PNG یا JPEG کے طور پر محفوظ کریں اور دوبارہ شامل کریں۔';
$ec_lang['lpn_backdrop_position']='منتقل کریں';
$ec_lang['lpn_backdrop_remove']='ہٹائیں';
$ec_lang['lpn_backdrop_remove_confirm']='پس منظر کی تصویر ہٹائیں؟';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='دنیا کا نقشہ…';
$ec_lang['lpn_map_attach_tip']='اس پراجیکٹ کو کسی اور طریقے سے تبدیل کیے بغیر دنیا کا نقشہ منسلک کریں۔';
$ec_lang['lpn_map_attach_add']='منسلک کریں';
$ec_lang['lpn_map_attach_readjust']='دوبارہ ایڈجسٹ کریں';
$ec_lang['lpn_map_attach_readjust_tip']='نقشہ منسلک کرنے کے عمل کے مرحلہ 2 پر واپس جائیں۔';
$ec_lang['lpn_map_attach_scale_from']='موجودہ سائز سے پیمانہ بنائیں…';
$ec_lang['lpn_map_attach_scale_from_prompt']='نقشے کو اس کے موجودہ سائز سے، آپ کی ڈرائنگ کے درمیان کے گرد، پیمانہ بنائیں۔ 1 اسے ویسا ہی رکھتا ہے، 1.1 اسے 10% بڑا کرتا ہے، 0.9 اسے 10% چھوٹا کرتا ہے۔';
$ec_lang['lpn_map_attach_scale_from_bad']='صفر سے بڑا ایک عدد درج کریں۔';
$ec_lang['lpn_map_attach_scale_from_done']='نقشے کا سائز بدل دیا گیا ہے، اور آپ کی ڈرائنگ اور اس کے ہر احداثیے بالکل ویسے ہی ہیں جیسے تھے۔';
$ec_lang['lpn_map_attach_none']='اس پراجیکٹ سے ابھی تک کوئی دنیا کا نقشہ منسلک نہیں۔ پہلے نقشہ، دنیا کا نقشہ، منسلک کریں استعمال کریں۔';
$ec_lang['lpn_map_attach_remove']='الگ کریں';
$ec_lang['lpn_map_attach_remove_tip']='دنیا کا نقشہ الگ کریں۔ نیٹ ورک متاثر نہیں ہوتا۔';
$ec_lang['lpn_map_attach_done']='دنیا کا نقشہ اب آپ کی ڈرائنگ کے پیچھے ہے، اور آپ کا پراجیکٹ تبدیل نہیں ہوا۔ اسے دوبارہ ہٹانے کے لیے نقشہ، دنیا کا نقشہ، الگ کریں استعمال کریں۔';
// Edited by TGH 2026-10-07
$ec_lang['lpn_map_attach_removed']='دنیا کا نقشہ الگ کر دیا گیا ہے، اور نیٹ ورک متاثر نہیں ہوا۔';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='ڈرائنگ پوری دنیا کے نقشے پر ہے، سمندر میں صفر عرض بلد اور صفر طول بلد پر۔ پہلے پراجیکٹ کا مقام تلاش کریں: ڈرائنگ کے پیچھے نقشے کو پین اور زوم کریں، کسی جگہ کا نام تلاش کریں، یا عرض بلد اور طول بلد درج کریں۔ ڈرائنگ خود حرکت نہیں کرتی۔';
$ec_lang['lpn_mapgeo_step1']='مرحلہ 1 از 2: پراجیکٹ کا مقام تلاش کریں';
$ec_lang['lpn_mapgeo_step2']='مرحلہ 2 از 2: اپنی ڈرائنگ کے پیچھے نقشہ فٹ کریں';
$ec_lang['lpn_mapgeo_hint1']='اپنی ڈرائنگ کے پیچھے نقشے کو پین اور زوم کریں، یا کوئی جگہ تلاش کریں، یا عرض بلد اور طول بلد درج کریں۔ پھر تقریباً رکھیں دبائیں۔';
$ec_lang['lpn_mapgeo_readjust_intro']='آپ کی ڈرائنگ وہیں ہے جہاں آپ نے اسے آخری بار رکھا تھا۔ اسے کہیں اور منتقل کرنے کے لیے، ڈرائنگ کے پیچھے نقشے کو پین اور زوم کریں، کسی جگہ کا نام تلاش کریں، یا عرض بلد اور طول بلد درج کریں۔ ڈرائنگ خود حرکت نہیں کرتی۔';
$ec_lang['lpn_mapgeo_hint2']='اپنی ڈرائنگ کے نیچے نقشے کو سرکانے کے لیے کہیں بھی گھسیٹیں۔ آپ کی ڈرائنگ اور اس کا ہر احداثیہ بالکل وہیں رہتا ہے جہاں ہے۔ جب نقشہ ٹھیک ہو تو یہاں جغرافیائی حوالہ دیں دبائیں۔';
$ec_lang['lpn_mapgeo_gestures']='زوم آپ کی ڈرائنگ اور نقشے کو ایک ساتھ حرکت دیتا ہے، تاکہ آپ دیکھ سکیں کہ وہ کتنی اچھی طرح ملتے ہیں۔ گھسیٹنا صرف نقشے کو حرکت دیتا ہے۔';
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
$ec_lang['lpn_mapgeo_dial_turn']='نقشہ گھمائیں';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} ڈگری';
$ec_lang['lpn_mapgeo_dial_size']='نقشے کا سائز';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} گنا';
$ec_lang['lpn_mapgeo_dial_help']='نقشے کو بڑا یا چھوٹا کرنے اور گھمانے کے لیے دونوں بار سرکائیں، یا ان کے اوپر خانوں میں اعداد درج کریں۔ ہر بار کا درمیان مرحلہ 1 کی فٹنگ برقرار رکھتا ہے، اس لیے 1 کا سائز اور 0 کی گردش کا مطلب کوئی تبدیلی نہیں۔ دونوں پر تیر کی کیز کام کرتی ہیں۔';
$ec_lang['lpn_mapgeo_place']='تقریباً رکھیں';
$ec_lang['lpn_mapgeo_finish']='یہاں جغرافیائی حوالہ دیں';
$ec_lang['lpn_mapgeo_cancelled']='دنیا کا نقشہ اپنی پچھلی پوزیشن پر بحال کر دیا گیا ہے، اور ڈرائنگ کو منتقل نہیں کیا گیا۔';
$ec_lang['lpn_mapgeo_locked']='پراجیکٹس بدلنے یا محفوظ کرنے سے پہلے یہاں جغرافیائی حوالہ دیں بٹن سے مکمل کریں، یا منسوخ کریں دبائیں۔ دنیا کے نقشے کی جگہ کا تعین ابھی جاری ہے۔';
$ec_lang['lpn_backdrop_scale_prompt1']='پس منظر کی تصویر پر دو پوائنٹس متعین کریں، جیسے بار اسکیل کے دو سرے۔ پھر ان کے درمیان اصل فاصلہ درج کریں۔';
$ec_lang['lpn_backdrop_scale_prompt2']='دونوں پوائنٹس کے درمیان اصل فاصلہ';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='منتقلی کے لیے بنیادی پوائنٹ (تصویر پر) متعین کریں۔';
$ec_lang['lpn_backdrop_position_prompt2']='منزل کے پوائنٹ کا طریقہ چنیں، پھر جاری رکھیں دبائیں۔';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='پس منظر کی تصویر ایڈجسٹ کی جا رہی ہے۔';
$ec_lang['lpn_backdrop_target_label']='اس پوائنٹ کو یہاں منتقل کریں:';
$ec_lang['lpn_backdrop_target_node']='ایک نوڈ';
$ec_lang['lpn_backdrop_target_free']='نقشے پر کوئی بھی پوائنٹ';
$ec_lang['lpn_backdrop_target_coords']='آپ کے ٹائپ کردہ احداثیات';
$ec_lang['lpn_backdrop_coords_prompt']='وہ X,Y ٹائپ کریں جہاں وہ پوائنٹ منتقل ہونا چاہیے';
$ec_lang['lpn_backdrop_continue']='جاری رکھیں';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// One key for the toolbar button, the Project menu row and the Settings box's own title (Task 699).
$ec_lang['lpn_tool_settings']='ترتیبات';
$ec_lang['lpn_settings_show_titles']='صفحے کے عنوانات دکھائیں';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='یہ عنوانات چھپائیں';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='انتخاب کی مدد دکھائیں';
$ec_lang['lpn_settings_area_hint_tip']='رقبہ منتخب کرتے وقت نقشے پر وہ پرامپٹ دکھائیں جو اگلا مرحلہ بتاتا ہے۔';
$ec_lang['lpn_settings_hover_card']='ہوور پر تمام خصوصیات دکھائیں';
$ec_lang['lpn_settings_hover_card_tip']='پوائنٹر کو نوڈ، لنک یا گاہک پر رکھیں تاکہ اس کی تمام خصوصیات ترتیبات میں بتائی گئی شکل میں، کسی بھی اسکیل پر، چاہے لیبل نقشے پر سمائے یا نہ سمائے، نظر آئیں۔ یہ اس براؤزر کی ترتیب ہے، پراجیکٹ کی نہیں۔';
// Task 805 (Tom, 2026-10-15, R-396: "It would be good to be able to hide the amber override
// indicators from the map. Maybe a Map, Clean map button is a good idea after all"). The rings'
// own switch, in Settings, Map and page, Page; and the Map menu row that hides them with the
// controls over the drawing. Both are browser settings.
$ec_lang['lpn_settings_override_marks']='نقشے پر اپنی قدر کے نشانات دکھائیں';
$ec_lang['lpn_settings_override_marks_tip']='اس اثاثے پر عنبری حلقہ دکھائیں جس کی کھلے ہوئے منظرنامے میں اپنی قدر ہو، اور اس پر ٹوٹا ہوا سرمئی حلقہ جو کوئی اپنی قدر وراثت میں لے۔ جدولوں کا پینل دونوں صورتوں میں اپنی قدروں کو نشان زد کرتا ہے۔ نقشہ، صاف نقشہ نشان زد ہونے کے دوران حلقے چھپاتا ہے۔ یہ اس براؤزر کی ترتیب ہے، پراجیکٹ کی نہیں۔';
$ec_lang['lpn_clean_map']='صاف نقشہ';
$ec_lang['lpn_clean_map_tip']='نشان زد: زوم بٹن، سڑکوں کے نقشے اور سیٹلائٹ کا بٹن، پیغامات کا بٹن اور اطلاعات، انتخاب کی مدد، فیڈبیک کا بٹن، اور اپنی قدر کے حلقے چھپ جاتے ہیں۔ نشان ہٹا ہوا: وہ دکھائے جاتے ہیں۔ غلطیاں پھر بھی نقشے پر دکھائی جاتی ہیں، اور ہر اطلاع پھر بھی پیغامات میں رکھی جاتی ہے۔ یہ اس براؤزر کی ترتیب ہے، پراجیکٹ کی نہیں۔';
$ec_lang['lpn_settings_theme']='تھیم';
$ec_lang['lpn_settings_theme_tip']='صفحے کے لیے ہلکے یا گہرے رنگ چنیں۔ سسٹم آپ کے آلے کی ترتیب کی پیروی کرتا ہے۔ نقشے کی ڈرائنگ ہر تھیم میں ایک جیسی دکھائی دیتی ہے۔ یہ اس براؤزر کی ترتیب ہے، پراجیکٹ کی نہیں۔';
$ec_lang['lpn_theme_system']='سسٹم';
$ec_lang['lpn_theme_light']='ہلکا';
$ec_lang['lpn_theme_dark']='گہرا';
$ec_lang['lpn_settings_id_prefixes']='ID سابقے';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='تخلیق کی قدریں';
$ec_lang['lpn_settings_defaults_note']='اب سے بنائے گئے عناصر کے لیے استعمال ہوتا ہے۔ موجودہ عناصر تبدیل نہیں ہوتے۔';
$ec_lang['lpn_settings_push_note']='صرف وہی خصوصیات لاگو ہوتی ہیں جن کے لیبلز ابھی دکھائے جا رہے ہیں۔';
$ec_lang['lpn_settings_push_btn']='یہ نئے عنصر کی قدریں ہر موجودہ عنصر پر لاگو کریں';
$ec_lang['lpn_push_confirm']='ہر موجودہ عنصر پر یہ خصوصیات اب نئے عناصر کے لیے مقرر قدروں سے بدل دی جائیں؟ آپ کی لکھی ہوئی قدریں مٹا دی جائیں گی۔ آپ اسے واپس کر سکتے ہیں۔';
$ec_lang['lpn_push_properties']='خصوصیات:';
$ec_lang['lpn_push_assets']='نوڈز اور پائپ:';
$ec_lang['lpn_push_none_displayed']='ابھی کوئی ابتدائی قدر لیبل کے طور پر نہیں دکھائی جا رہی، اس لیے لاگو کرنے کے لیے کچھ نہیں۔ لیبلز پینل میں اپنی مطلوبہ خصوصیات کے لیبلز آن کریں، پھر دوبارہ کوشش کریں۔';
$ec_lang['lpn_push_nothing']='کسی موجودہ عنصر کے پاس لاگو کی جانے والی خصوصیات میں سے کوئی بھی نہیں۔';
$ec_lang['lpn_push_no_change']='ہر عنصر کے پاس پہلے ہی یہ قدریں ہیں، اس لیے کچھ بھی تبدیل نہیں ہوگا۔';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='حسب ضرورت خصوصیات';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='صارف کی متعین کردہ خصوصیات۔ باقی تمام خصوصیات کی طرح پراجیکٹ اور منظرناموں کے ساتھ محفوظ ہوتی ہیں۔';
$ec_lang['lpn_cp_design']='ڈیزائن';
$ec_lang['lpn_cp_design_tip']='ہر حسب ضرورت خصوصیت کی ایک قطار ہوتی ہے، اور ہر ایک کھل کر یہ دکھاتی ہے: کلید، لیبل، اطلاق برائے، توثیق بطور، اجازت دیں یا محدود کریں، اس انتخاب کے نام سے موسوم حروف کا خانہ، لمبائی کی کم از کم حد، لمبائی کی زیادہ سے زیادہ حد، کم از کم حد، زیادہ سے زیادہ حد۔';
$ec_lang['lpn_cp_add']='حسب ضرورت خصوصیت شامل کریں';
$ec_lang['lpn_cp_add_tip']='ڈیزائن ٹیبل میں ایک قطار شامل کریں اور اسے ترمیم کے لیے کھولیں۔';
$ec_lang['lpn_cp_remove_tip']='اس خصوصیت کو ڈیزائن ٹیبل سے ہٹا دیں۔ عناصر پر پہلے سے درج کی گئی قدریں فائل میں محفوظ رہتی ہیں اور اگر وہی کلید رکھنے والی خصوصیت دوبارہ متعین کی جائے تو بحال ہو جاتی ہیں۔';
$ec_lang['lpn_cp_none']='ابھی تک کوئی حسب ضرورت خصوصیت ڈیزائن نہیں کی گئی۔';
$ec_lang['lpn_cp_unnamed']='ابھی نام نہیں دیا گیا';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='کلید';
$ec_lang['lpn_cp_key_tip']='کلید: ایک خصوصیت اسی نام کے تحت محفوظ کی جاتی ہے۔ خالی جگہوں کی اجازت نہیں، اور آپ کے لیے ایک سابقہ خود بخود شامل کر دیا جاتا ہے تاکہ آپ کی کلید کسی پہلے سے موجود فیلڈ سے کبھی نہ ٹکرائے۔';
$ec_lang['lpn_cp_label']='لیبل';
$ec_lang['lpn_cp_label_tip']='لیبل: پراپرٹیز باکس میں، تلاش میں اور ٹیبل کالم کے سرے پر ظاہر ہوتا ہے۔';
$ec_lang['lpn_cp_applies']='اطلاق برائے';
$ec_lang['lpn_cp_applies_tip']='اطلاق برائے: ان عناصر کے ID سابقوں کی کوما سے الگ کی گئی فہرست جو یہ خصوصیت استعمال کرتے ہیں، جیسے J,L,R۔';
$ec_lang['lpn_cp_validate']='توثیق بطور';
$ec_lang['lpn_cp_validate_tip']='توثیق بطور: وہ فارمیٹ جو ایک درست قدر کا ہونا چاہیے۔ کیس کے قواعد صرف انگریزی حروف تہجی پر لاگو ہوتے ہیں۔ کوئی بھی قدر قبول کرنے کے لیے توثیق نہ کریں چنیں۔';
$ec_lang['lpn_cp_restrict']='ان حروف کو محدود کریں';
$ec_lang['lpn_cp_restrict_tip']='ان حروف کو محدود کریں:';
$ec_lang['lpn_cp_allow_tip']='صرف یہ حروف اجازت دیں:';
$ec_lang['lpn_cp_characters_tip']='"@" کا مطلب کوئی بھی حرف ہے؛ "#" کا مطلب کوئی بھی عددی ہندسہ ہے، اور اگر "-"، "." اور "," کی اجازت ہو تو انہیں الگ سے درج کرنا ہوگا؛ اور کوئی بھی خالی جگہ کے حروف دوسرے حروف کے درمیان ہونے چاہییں۔';
$ec_lang['lpn_cp_restrict_mode']='اجازت دیں یا محدود کریں';
$ec_lang['lpn_cp_restrict_mode_tip']='اجازت دیں یا محدود کریں: دیے گئے حروف یا تو وہی ہیں جو ایک قدر استعمال کر سکتی ہے یا وہ ہیں جو استعمال نہیں کر سکتی۔';
$ec_lang['lpn_cp_restrict_allow']='صرف یہ حروف اجازت دیں';
$ec_lang['lpn_cp_minlength']='لمبائی کی کم از کم حد';
$ec_lang['lpn_cp_minlength_tip']='لمبائی کی کم از کم حد: کوئی بھی چھوٹا اندراج نشان زد کیا جاتا ہے۔ خالی اور نامکمل اندراجات تلاش کرنے کے لیے اسے استعمال کریں۔';
$ec_lang['lpn_cp_length']='لمبائی کی زیادہ سے زیادہ حد';
$ec_lang['lpn_cp_length_tip']='لمبائی کی زیادہ سے زیادہ حد: کوئی بھی لمبی تر اندراج نشان زد کی جاتی ہے۔';
$ec_lang['lpn_cp_low']='کم از کم حد';
$ec_lang['lpn_cp_low_tip']='کم از کم حد: یہ سب سے چھوٹی قدر ہے جس کی آپ توقع رکھتے ہیں۔ اعداد کا موازنہ اعداد کے طور پر اور متن کا موازنہ لغوی ترتیب میں کیا جاتا ہے۔';
$ec_lang['lpn_cp_high']='زیادہ سے زیادہ حد';
$ec_lang['lpn_cp_high_tip']='زیادہ سے زیادہ حد: یہ سب سے بڑی قدر ہے جس کی آپ توقع رکھتے ہیں۔ اعداد کا موازنہ اعداد کے طور پر اور متن کا موازنہ لغوی ترتیب میں کیا جاتا ہے۔';
$ec_lang['lpn_cp_val_none']='توثیق نہ کریں';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='نمبر .';
$ec_lang['lpn_cp_val_number_comma']='نمبر ,';
$ec_lang['lpn_cp_val_integer']='عدد صحیح';
$ec_lang['lpn_cp_val_upper']='تمام بڑے حروف';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} یہ قدر بالکل ویسی ہی رکھی گئی ہے جیسے آپ نے ٹائپ کی تھی۔';
$ec_lang['lpn_valwarn_diameter']='پائپ یا والو کا قطر عموماً {min} اور {max} {unit} کے درمیان ہوتا ہے۔ عدد اور قطر کی اکائی چیک کریں۔';
$ec_lang['lpn_valwarn_hw']='Hazen-Williams C عموماً {min} اور {max} کے درمیان ہوتا ہے۔ اس حد سے باہر کا عدد اکثر کسی اور رگڑ کے طریقے کے لیے ہوتا ہے۔';
$ec_lang['lpn_valwarn_manning']='Manning n عموماً {min} اور {max} کے درمیان ہوتا ہے۔ اس حد سے باہر کا عدد اکثر کسی اور رگڑ کے طریقے کے لیے ہوتا ہے۔';
$ec_lang['lpn_valwarn_dw']='Darcy-Weisbach کھردرا پن عموماً 0 سے زیادہ اور زیادہ سے زیادہ {max} {unit} ہوتا ہے۔ اس سے بڑا عدد اکثر Hazen-Williams C یا Manning n ہوتا ہے۔';
$ec_lang['lpn_valwarn_positive']='EPANET یہاں صفر یا منفی عدد قبول نہیں کرتا۔';
$ec_lang['lpn_valwarn_negative']='EPANET یہاں منفی عدد قبول نہیں کرتا۔';
$ec_lang['lpn_valwarn_tank_levels']='EPANET اس ٹینک کو قبول نہیں کرتا۔ کم از کم پانی کی گہرائی پانی کی گہرائی سے زیادہ نہیں ہونی چاہیے، اور پانی کی گہرائی زیادہ سے زیادہ پانی کی گہرائی سے زیادہ نہیں ہونی چاہیے۔';
$ec_lang['lpn_cp_bad_number']='یہ قدر اس خصوصیت کے لیے مطلوبہ نمبر نہیں ہے۔';
$ec_lang['lpn_cp_bad_integer']='یہ قدر اس خصوصیت کے لیے مطلوبہ عدد صحیح نہیں ہے۔';
$ec_lang['lpn_cp_bad_case']='یہ قدر اس خصوصیت کے لیے مطلوبہ تمام بڑے حروف میں نہیں ہے۔';
$ec_lang['lpn_cp_bad_chars']='یہ قدر ایسا حرف استعمال کرتی ہے جس کی یہ خصوصیت اجازت نہیں دیتی۔';
$ec_lang['lpn_cp_bad_space']='خالی جگہ صرف دوسرے حروف کے درمیان ہی اجازت ہے۔';
$ec_lang['lpn_cp_bad_minlength']='یہ قدر اس خصوصیت کی اجازت سے مختصر ہے۔';
$ec_lang['lpn_cp_bad_length']='یہ قدر اس خصوصیت کی اجازت سے لمبی ہے۔';
$ec_lang['lpn_cp_bad_low']='یہ قدر اس خصوصیت کی کم از کم حد سے کم ہے۔';
$ec_lang['lpn_cp_bad_high']='یہ قدر اس خصوصیت کی زیادہ سے زیادہ حد سے زیادہ ہے۔';
$ec_lang['lpn_cp_key_needed']='اس حسب ضرورت خصوصیت کو بغیر خالی جگہ کے ایک کلید دیں۔';
$ec_lang['lpn_cp_key_taken']='ایک اور حسب ضرورت خصوصیت پہلے ہی وہ کلید استعمال کر رہی ہے۔';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='منظرنامہ';
$ec_lang['lpn_scenario_base']='بنیاد';
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
$ec_lang['lpn_scenario_overrides']='اپنی قدروں کی تعداد';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='کہربائی رنگ کا حلقہ ظاہر کرتا ہے کہ اس عنصر کی منظرنامہ {name} میں اپنی قدر ہے۔';
$ec_lang['lpn_scenario_mark_inh_tip']='ٹوٹا ہوا سرمئی حلقہ بتاتا ہے کہ منظرنامہ {name} اس اثاثے کی اپنی قدر اپنے والد منظرنامے یا متبادل سے وراثت میں لیتا ہے۔';
$ec_lang['lpn_scenario_overrides_tip']='ہر اپنی قدر نقشے پر کہربائی حلقے سے نشان زد ہے۔ ڈرائنگ کو ان کے بغیر دیکھنے کے لیے {base} یا کسی اور والدین منظرنامے پر جائیں۔';
$ec_lang['lpn_scenario_menu']='منظرنامے';
$ec_lang['lpn_scenario_tip']='قدروں کا وہ مجموعہ جو ڈرائنگ اس وقت دکھا رہی ہے اور صفحہ ابھی حل کر رہا ہے۔ منظرنامے بدلنے، یا کوئی نیا شامل کرنے، نام بدلنے، یا حذف کرنے کے لیے کلک کریں۔';
$ec_lang['lpn_scenario_new']='نیا منظرنامہ…';
$ec_lang['lpn_scenario_new_name']='منظرنامہ {n}';
$ec_lang['lpn_scenario_prompt_name']='اس منظرنامے کا نام';
$ec_lang['lpn_scenario_rename']='منظرنامے کا نام بدلیں…';
$ec_lang['lpn_scenario_delete']='منظرنامہ حذف کریں';
$ec_lang['lpn_scenario_delete_ask']='منظرنامہ {name} حذف کریں؟ ڈرائنگ خود نہیں بدلتی۔';
$ec_lang['lpn_scenario_delete_goes']='اس کی اپنی قدریں ({n}) اس کے ساتھ حذف ہو جاتی ہیں۔';
$ec_lang['lpn_scenario_delete_stays']='یہ متبادلات جو وہ استعمال کرتا ہے پراجیکٹ میں رہتے ہیں: {list}۔';
$ec_lang['lpn_scenario_delete_has_children']='منظرنامہ {name} حذف نہیں کیا جا سکتا کیونکہ اس کے ماتحت ہیں: {list}۔ پہلے انہیں حذف کریں، یا کسی دوسرے والد کے تحت لے جائیں۔';
// Edited by TGH 2026-09-07
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='بنیادی منظرنامہ: {value}';
$ec_lang['lpn_scenario_deactivated']='{id}، {scenario} میں نیٹ ورک سے باہر ہے۔ یہ اب بھی ڈرائنگ میں، اور آپ کے دیگر منظرناموں میں موجود ہے۔';
$ec_lang['lpn_scenario_delete_in_base']='اسے ڈرائنگ سے ہٹانے کے لیے {base} منظرنامے میں حذف کریں۔';
$ec_lang['lpn_scenario_only_deleted']='{id} حذف ہو گیا۔ یہ صرف {scenario} کا حصہ تھا۔';
$ec_lang['lpn_scenario_delete_blocked']='{id} حذف نہیں ہوا، کیونکہ لنک {link} اس پر ختم ہوتا ہے، اور وہ لنک {scenario} سے باہر بھی موجود ہے۔ دونوں کو حذف کرنے کے لیے انہیں {base} منظرنامے میں حذف کریں۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_basic']='بنیادی موڈ';
$ec_lang['lpn_scenario_basic_tip']='نشان زد: متبادلات چھپے اور خودکار ہوتے ہیں، ہر منظرنامہ اپنی قدروں کو اپنی ہی دکھاتا ہے، اور تمام نئے منظرنامے بنیاد منظرنامے کے ماتحت ہوتے ہیں؛ منظرنامہ مینیجر اور منظرناموں کا جدول نہیں دکھائے جاتے۔ نشان ہٹا ہوا: منظرنامہ مینیجر اور منظرناموں کا جدول دکھائے جاتے ہیں، اور متبادلات منظرناموں کے درمیان مشترک ہو سکتے ہیں۔ بنیادی موڈ آن ہو تو منظرنامہ مینیجر غیر فعال ہوتا ہے۔ جب پراجیکٹ میں منظرنامے اور متبادلات کے ایسے رشتے ہوں جو بنیادی موڈ دکھا نہ سکے تو بنیادی موڈ غیر فعال ہوتا ہے۔';
$ec_lang['lpn_scenario_basic_misfit']='اس پراجیکٹ میں منظرناموں اور متبادلات کے ایسے رشتے ہیں جو منظرناموں کے بنیادی موڈ سے مطابقت نہیں رکھتے، اس لیے بنیادی موڈ غیر فعال ہے۔';
$ec_lang['lpn_scenario_basic_misfit_base']='بنیاد منظرنامہ بنیاد کے سوا کوئی متبادل استعمال کرتا ہے۔';
$ec_lang['lpn_scenario_copy']='منظرنامہ کاپی کریں';
$ec_lang['lpn_scenario_copy_tip']='کھلے ہوئے منظرنامے اور اس کی اپنی قدروں کی کاپی بناتا ہے، اور کاپی کھولتا ہے۔';
$ec_lang['lpn_scenario_copy_off']='منظرنامہ کاپی کریں بنیادی موڈ میں کام کرتا ہے۔ بنیادی موڈ بند ہو تو منظرنامہ شامل کریں اور اس کے متبادلات منظرناموں کے جدول میں چنیں۔';
$ec_lang['lpn_sm_title']='منظرنامہ مینیجر';
$ec_lang['lpn_sm_menu']='منظرنامہ مینیجر…';
$ec_lang['lpn_sm_basic_on']='بنیادی موڈ آن ہو تو منظرنامہ مینیجر غیر فعال ہوتا ہے۔';
$ec_lang['lpn_pane_tab_scenarios']='منظرنامے';
$ec_lang['lpn_sm_col_parent']='والد';
$ec_lang['lpn_sm_add_child']='ماتحت شامل کریں';
$ec_lang['lpn_sm_add_base']='بنیاد شامل کریں';
$ec_lang['lpn_sm_add_base_tip']='ایک اور بنیاد منظرنامہ شامل کریں۔ یہ بنیاد کی کاپی کے طور پر شروع ہوتا ہے، اپنے متبادلات کے ساتھ، اور بنیاد میں بعد کی ترامیم اسے نہیں بدلتیں۔';
$ec_lang['lpn_sm_add_base_alt_tip']='ایک اور بنیاد متبادل شامل کریں۔ یہ اس زمرے میں بنیاد کی قدروں کی کاپی کے طور پر شروع ہوتا ہے، اور بنیاد میں بعد کی ترامیم اسے نہیں بدلتیں۔';
$ec_lang['lpn_sm_delete']='منتخب آئٹم حذف کریں۔ استعمال میں آئٹم حذف نہیں ہوتا۔';
$ec_lang['lpn_sm_base_kept']='درخت کی بنیاد حذف نہیں ہوتی۔ بنیاد شامل کریں سے شامل کی گئی دوسری بنیاد تب حذف ہوتی ہے جب اسے کوئی استعمال نہ کرے۔';
$ec_lang['lpn_sm_rename']='نام بدلیں';
$ec_lang['lpn_sm_rename_alts_ask']='ایک ہی نام والے متبادلات کا نام بھی بدلیں؟';
$ec_lang['lpn_sm_make_current']='موجودہ بنائیں';
// Tips on greyed Scenario manager commands, saying why they are greyed (Perry, 2026-10-11).
$ec_lang['lpn_sm_current_already']='یہ منظرنامہ پہلے ہی موجودہ منظرنامہ ہے۔';
$ec_lang['lpn_sm_none_selected']='پہلے درخت میں ایک آئٹم منتخب کریں۔';
$ec_lang['lpn_sm_base_named']='درخت کی بنیاد کا نام نہیں بدلا جاتا۔';
$ec_lang['lpn_sm_merge_up']='اوپر ضم کریں';
$ec_lang['lpn_sm_merge_up_tip']='منتخب متبادل کی اپنی قدریں درخت میں اس سے اوپر کے متبادل میں منتقل کریں۔ منتخب متبادل پھر وہ قدریں وراثت میں لیتا ہے۔';
$ec_lang['lpn_sm_merge_up_root']='بنیاد متبادل کے اوپر ضم کرنے کو کچھ نہیں۔';
$ec_lang['lpn_sm_merge_none']='متبادل {name} کی ضم کرنے کے لیے کوئی اپنی قدر نہیں۔';
$ec_lang['lpn_sm_merge_pick']='{name} کی اپنی قدریں کس متبادل میں ضم کریں؟ اس کا والد پہلے درج ہے۔';
$ec_lang['lpn_sm_merge_ask']='{name} کی اپنی قدریں ({n}) {target} میں اوپر منتقل کریں؟ اس کے بعد یہ انہیں اپنی قدر سے بدلنے کے بجائے وراثت میں لیتا ہے۔ آپ اسے کالعدم کر سکتے ہیں۔';
$ec_lang['lpn_sm_merge_skipped']='{between} بھی ان قدروں کو اپنی قدر سے بدلتا ہے۔ اسے چھوڑ دیا گیا ہے اور بدلا نہیں گیا، اس لیے {name} انہیں {target} سے نہیں بلکہ {between} سے پڑھے گا:';
$ec_lang['lpn_sm_merge_line']='{asset}: {property}';
$ec_lang['lpn_sm_copy_up']='اوپر کاپی کریں';
$ec_lang['lpn_sm_copy_up_tip']='منتخب متبادل کی اپنی قدریں درخت میں اس سے اوپر کے متبادل میں کاپی کریں۔ منتخب متبادل اپنی قدریں رکھتا ہے۔';
$ec_lang['lpn_sm_copy_up_root']='بنیاد متبادل کے اوپر کاپی کرنے کو کچھ نہیں۔';
$ec_lang['lpn_sm_copy_none']='متبادل {name} کی کاپی کرنے کے لیے کوئی اپنی قدر نہیں۔';
$ec_lang['lpn_sm_copy_pick']='{name} کی اپنی قدریں کس متبادل میں کاپی کریں؟ اس کا والد پہلے درج ہے۔';
$ec_lang['lpn_sm_copy_ask']='{name} کی اپنی قدریں ({n}) {target} میں اوپر کاپی کریں؟ {name} انہیں اپنی قدروں کے طور پر رکھتا ہے۔ آپ اسے کالعدم کر سکتے ہیں۔';
$ec_lang['lpn_sm_copy_skipped']='{between} بھی ان قدروں کو اپنی قدر سے بدلتا ہے۔ اسے چھوڑ دیا گیا ہے اور بدلا نہیں گیا، اس لیے یہ ان کے لیے اپنی قدریں رکھتا ہے:';
$ec_lang['lpn_sm_list_overrides']='اپنی قدروں کا مینیجر…';
$ec_lang['lpn_sm_list_overrides_tip']='منظرنامے کی اپنی قدریں زمرے کے مطابق درج کریں، ہر ایک اس وراثتی قدر کے ساتھ جسے وہ بدلتی ہے، اور ان میں سے کوئی بھی ہٹائیں۔';
$ec_lang['lpn_sm_list_overrides_none']='اس منظرنامے کی کوئی اپنی قدر نہیں۔';
$ec_lang['lpn_ovl_title']='اپنی قدروں کا مینیجر: {name}';
$ec_lang['lpn_ovl_note']='یہ وہ قدریں ہیں جو یہ منظرنامہ اپنے استعمال کردہ متبادلات میں خود مقرر کرتا ہے، ہر ایک اس قدر کے ساتھ جس کی جگہ اس نے لی ہے۔ جو قدریں یہ وراثت میں لیتا ہے وہ نہ درج ہوتی ہیں نہ گنی جاتی ہیں۔ وراثتی قدر بحال کرنے کے لیے اپنی قدر ہٹائیں؛ کالعدم کریں اسے واپس کر دیتا ہے۔ نقشے پر اثاثے تک جانے کے لیے ایک ID منتخب کریں۔';
$ec_lang['lpn_ovl_clear_selected']='منتخب اپنی قدریں ہٹائیں';
$ec_lang['lpn_ovl_clear_all']='تمام اپنی قدریں ہٹائیں';
$ec_lang['lpn_ovl_clear_all_ask']='{name} کی تمام اپنی قدریں ({n}) ہٹائیں؟ ہر قدر وراثتی قدر پر لوٹ آتی ہے۔ کالعدم کریں اسے واپس کر دیتا ہے۔';
$ec_lang['lpn_ovl_pick_tip']='اس اپنی قدر کو منتخب اپنی قدریں ہٹائیں بٹن کے لیے منتخب کریں۔';
$ec_lang['lpn_ovl_bubble_off']='نقشے پر نہیں';
$ec_lang['lpn_ovl_bubble_moved']='{quantity}، منتقل یا سائز بدلا گیا';
$ec_lang['lpn_ovl_group']='{category}: {alternative}';
$ec_lang['lpn_ovl_col_override']='اپنی قدر';
$ec_lang['lpn_ovl_col_inherited']='وراثتی قدر';
$ec_lang['lpn_ovl_col_inherited_tip']='وہ قدر جو یہ منظرنامہ اپنی قدر کے بغیر پڑھتا ہے: متبادل کے والد کی قدر، یا بنیاد کی قدر۔';
$ec_lang['lpn_ovl_same']='(یکساں)';
$ec_lang['lpn_ovl_same_tip']='وراثتی قدر کے برابر۔ یہ پھر بھی اپنی قدر ہے، اور گنی جاتی ہے۔';
$ec_lang['lpn_sm_help']='منظرنامے اور متبادلات کیسے کام کرتے ہیں:\n\nبنیادی موڈ میں متبادلات چھپے اور خودکار ہوتے ہیں، اور تمام نئے منظرنامے بنیاد منظرنامے کے ماتحت ہوتے ہیں۔\n\nبنیادی موڈ بند ہو تو ایک پیچیدہ وراثتی درخت دستیاب ہوتا ہے، اور متبادلات منظرناموں کے درمیان مشترک ہو سکتے ہیں۔ لیکن جب نئے متبادل کا تعلق درکار ہو (صارف کے فعال انتظام کی غیر موجودگی میں) تو ترامیم کا ڈیفالٹ رویہ یہ ہے کہ موجودہ منظرنامے کے نام پر ایک متبادل بنایا جائے، جو ہر منظرنامے کو متبادلات کا اپنا الگ مجموعہ دیتا ہے۔\n\nخصوصیات اور ترتیبات متبادلات کے زمروں سے تعلق رکھتی ہیں جو منظرناموں اور متبادلات کے جدول کے کالم کے طور پر اور منظرنامہ مینیجر میں انتظام کے آپشنز کے طور پر نظر آتے ہیں۔\n\nاپنی قدریں منظرناموں میں بنتی ہیں، لیکن وہ حقیقت میں منظرنامے سے وابستہ متعلقہ متبادلات کی ہوتی ہیں؛ اس لیے منظرنامہ اپنے متبادلات کی کھڑکی جیسا ہے۔ متبادلات کا منظرناموں سے تعلق منظرنامہ مینیجر کے دائیں پینل میں یا نچلے پینل کے منظرناموں کے جدول میں سنبھالا جاتا ہے۔ نیا منظرنامہ بنانے سے کوئی متبادل نہیں بنتا؛ نیا منظرنامہ اپنے والد کے متبادلات استعمال کرتا ہے جب تک ایسی اپنی قدریں نہ بنیں جنہیں نئے متبادلات کی ضرورت ہو۔ جب منظرنامے میں اپنی قدریں بنتی ہیں تو وہ منظرنامے کے متعلقہ متبادل میں محفوظ ہوتی ہیں؛ اگر منظرنامے کا ایسا متبادل نہ ہو تو منظرنامے کے نام سے نیا متبادل بنایا جاتا ہے۔\n\nمثال: آپ "Figure: Node and link IDs" منظرنامہ بناتے ہیں اور ایک متن کو "Node and Link IDs." کہنے کے لیے ایڈٹ کرتے ہیں۔ منظرنامہ بنانے پر کوئی متبادل نہیں بنتا۔ لیکن جس لمحے آپ متن محفوظ کرتے ہیں، "Figure: Node and link IDs" نام کا متن کا متبادل متن کی قدر کی اپنی قدر کے ساتھ بن جاتا ہے۔ بنیادی موڈ میں آپ اسے خود منظرنامے میں محض ایک اپنی قدر کے طور پر دیکھتے ہیں۔\n\nخصوصیات کاپی کریں صرف اپنی قدریں کاپی کرتا ہے۔ بنیاد کے سوا کسی منظرنامے میں، یہ صرف وہ اپنی قدریں کاپی کرتا ہے جو اثاثے کی اس منظرنامے میں ہوں۔\n\nمنظرنامے کیسے سنبھالیں:\n\n- اوپر کی فہرست میں منظرنامے یا متبادلات کا کوئی زمرہ چنیں تاکہ اس کا درخت دکھایا جائے۔\n\n- منتخب آئٹم کا ماتحت ماتحت شامل کریں سے بنائیں۔ بنیاد شامل کریں ایک اور بنیاد شامل کرتا ہے، جو بنیاد کی موجودہ حالت کی کاپی کے طور پر شروع ہوتی ہے؛ بنیاد میں بعد کی ترامیم اسے نہیں بدلتیں۔ نیا ماتحت اپنے والد کے نام پر ہوتا ہے؛ نام بدلنے کے لیے نام ٹائپ کریں۔ کاپی کریں منتخب متبادل کی کاپی بناتا ہے۔ اوپر ضم کریں منتخب متبادل کی اپنی قدریں اس سے اوپر کے ایک متبادل میں، جو نام سے چنا جاتا ہے، منتقل کرتا ہے، اور منتخب متبادل پھر انہیں وراثت میں لیتا ہے؛ یہ پہلے ایسی کسی قدر کا نام بتاتا ہے جسے چھوڑا جانے والا کوئی متبادل بھی اپنی قدر سے بدلتا ہے، جو بدلی نہیں جاتی۔ منظرنامہ کاپی کرنے کے لیے، بنیادی موڈ میں، منظرنامے مینو میں منظرنامہ کاپی کریں استعمال کریں؛ یہ منظرنامے کی اپنی قدریں ان متبادلات کے ساتھ کاپی کرتا ہے جو انہیں رکھتے ہیں۔ بنیاد شامل کریں اور منظرنامہ کاپی کریں ہر ایک متبادلات بناتے ہیں: بنیاد شامل کریں ہر اس زمرے میں جس میں قدریں ہوں نئی بنیاد کے لیے بنیاد متبادل بناتا ہے، اور منظرنامہ کاپی کریں ہر اس متبادل کے لیے جو منظرنامے کی اپنی قدریں رکھتا ہو، کاپی کے نام پر ایک نیا متبادل بناتا ہے۔\n\n- کسی آئٹم کو دوسرے پر گھسیٹیں تاکہ وہ اس آئٹم کا ماتحت بن جائے۔ نئے والد کے تحت منتقل کیا گیا منظرنامہ اس سے وہ سب کچھ وراثت میں لیتا ہے جسے اس نے اپنی قدر سے نہیں بدلا؛ جسے اس نے بدلا ہے وہ نہیں بدلتا۔ دو آئٹمز کے درمیان آئٹم گھسیٹیں تاکہ ان کی ترتیب بدلے۔\n\n- کسی آئٹم کو منتخب کرنے کے لیے اس پر کلک کریں۔ منتخب آئٹم کا نام بدلنے کے لیے F2 دبائیں یا نام بدلیں چنیں۔ منظرنامے کا نام بدلنے پر پوچھا جاتا ہے کہ کیا اس کا نام رکھنے والے متبادلات کا نام بھی بدلا جائے؛ بنیادی موڈ میں وہ بغیر پوچھے ساتھ بدل جاتے ہیں۔ منظرنامے کو موجودہ بنانے کے لیے اس پر ڈبل کلک کریں یا Enter دبائیں۔ آئٹم کے پاس تیر پر کلک کریں یا اسے سمیٹنے یا پھیلانے کے لیے بائیں یا دائیں دبائیں۔ بٹنوں جیسے ہی احکامات کے لیے آئٹم پر دائیں کلک کریں۔\n\n- منتخب آئٹم حذف کرنے کے لیے Delete دبائیں یا مائنس بٹن پر کلک کریں۔ استعمال میں آئٹم حذف نہیں ہوتا، اور پیغام بتاتا ہے کہ اسے کون استعمال کرتا ہے۔ بنیادی موڈ بند ہو تو منظرنامہ حذف کرنے سے اس کے استعمال کردہ متبادلات رہتے ہیں۔ بنیادی موڈ آن ہو تو منظرنامہ حذف کرنے سے اس کے وہ متبادلات بھی حذف ہوتے ہیں جنہیں کوئی دوسرا منظرنامہ استعمال نہیں کرتا۔\n\n- منظرنامے کو کوئی دوسرا متبادل، بشمول بنیاد، استعمال کروانے کے لیے، اسے منظرنامہ مینیجر کے دائیں پینل یا منظرناموں کے جدول میں منظرنامے کی قطار میں چنیں۔ مشترک متبادل میں کی گئی اپنی قدر اسے استعمال کرنے والے ہر منظرنامے کو بدل دیتی ہے۔';
$ec_lang['lpn_sm_delete_alt_ask']='متبادل {name} حذف کریں؟';
$ec_lang['lpn_sm_in_use']='{item}\nحذف نہیں کیا جا سکتا جب تک اسے یہ استعمال کر رہے ہیں\n{list}';
$ec_lang['lpn_sm_alt_delete_has_children']='متبادل {name} حذف نہیں کیا جا سکتا کیونکہ اس کے ماتحت ہیں: {list}۔ پہلے انہیں حذف کریں، یا کسی دوسرے والد کے تحت لے جائیں۔';
$ec_lang['lpn_sm_item_scenario']='منظرنامہ {name}';
$ec_lang['lpn_sm_item_alternative']='متبادل {name}';
$ec_lang['lpn_sm_name_taken']='نام {name} اس درخت میں پہلے سے استعمال ہے۔';
$ec_lang['lpn_sm_cycle']='{name} کو اس کے اپنے کسی ماتحت کے نیچے منتقل نہیں کیا جا سکتا۔';
$ec_lang['lpn_sm_used_by']='استعمال کرنے والے منظرنامے: {n}';
$ec_lang['lpn_sm_used_by_tip']='استعمال کنندگان: {list}';
$ec_lang['lpn_sm_used_by_none']='کوئی منظرنامہ استعمال نہیں کرتا';
$ec_lang['lpn_sm_tree_all']='سب';
$ec_lang['lpn_sm_tree_unused']='سب غیر استعمال شدہ';
$ec_lang['lpn_sm_unused_none']='کوئی نہیں';
$ec_lang['lpn_sm_all_row_tip']='اسے اس کے زمرے کے درخت میں کھولنے کے لیے ڈبل کلک کریں۔';
$ec_lang['lpn_sm_compare_tip']='منظرنامہ موازنہ میں شامل کریں';
$ec_lang['lpn_sm_inherited']='وراثتی';
$ec_lang['lpn_sm_shared_note']='ان کے ساتھ مشترک: {list}';
$ec_lang['lpn_scncmp_none_checked']='موازنے کے لیے کسی منظرنامے پر نشان نہیں ہے۔ منظرنامہ مینیجر میں منظرناموں پر نشان لگائیں۔';
$ec_lang['lpn_time_scn_overrides']='منظرنامے کی اپنی قدریں:';
$ec_lang['lpn_settings_table_major']='بڑا عنوان';
$ec_lang['lpn_settings_table_minor']='چھوٹا عنوان';
$ec_lang['lpn_settings_table_category']='زمرہ';
// The Settings table's third heading level, between Minor heading and Setting: the label field, coloured
// field, asset or custom property a group of settings belongs to (Tom, 2026-10-07: "We could call it
// 'Owner'.").
$ec_lang['lpn_settings_table_owner']='مالک';
$ec_lang['lpn_settings_table_setting']='ترتیب';
$ec_lang['lpn_settings_table_yes']='ہاں';
$ec_lang['lpn_settings_table_no']='نہیں';
$ec_lang['lpn_settings_row_of']='{setting}، {member}';
$ec_lang['lpn_settings_row_labels_field']='{labels}: {field}';
$ec_lang['lpn_settings_row_labels_part']='{labels}: {field}، {part}';
$ec_lang['lpn_settings_row_labels_customer']='گاہک کے لیبلز';
$ec_lang['lpn_settings_row_label_before']='پہلے کا متن';
$ec_lang['lpn_settings_row_label_after']='بعد کا متن';
// A label field's settings, named in the Setting column with the field itself in the Owner column
// (Tom, 2026-10-07: "Symbology.Node labels.ID.Is Active", "Show order", "Drop order"). Whether the
// value appears on the label at all; where it sits on the label (1 first); which value is given up
// first when labels crowd (1 first).
$ec_lang['lpn_settings_row_label_on']='فعال ہے';
$ec_lang['lpn_settings_row_label_show']='دکھانے کی ترتیب';
$ec_lang['lpn_settings_row_label_drop']='چھوڑنے کی ترتیب';
// The Setting column of an ID prefix row; the asset it applies to is in the Owner column.
$ec_lang['lpn_settings_row_id_prefix']='ID سابقہ';
$ec_lang['lpn_settings_row_symbol_cap_multiple']='سب سے بڑی علامت، عام پائپ کی لمبائی کے ضرب کے طور پر';
$ec_lang['lpn_settings_row_symbol_cap_percentile']='عام پائپ کی لمبائی، تمام پائپوں کی لمبائیوں کی پرسنٹائل کے طور پر';
$ec_lang['lpn_settings_row_contour_labels']='کنٹور لیبلز';
$ec_lang['lpn_settings_row_check_freq']='حالت کی جانچ کی تعدد';
$ec_lang['lpn_settings_row_max_check']='زیادہ سے زیادہ حالت کی جانچیں';
$ec_lang['lpn_settings_row_status_report']='حالت کی رپورٹ';
$ec_lang['lpn_settings_row_pda_src']='فائل میں بتائے گئے دباؤ پر مبنی آپشنز';
$ec_lang['lpn_settings_row_quality_option']='پانی کے معیار کا آپشن جیسا فائل بتاتی ہے';
$ec_lang['lpn_settings_row_tolerance']='درستگی (پرانے پراجیکٹ)';
$ec_lang['lpn_settings_row_emitter_exponent_old']='ایمیٹر کا ایکسپوننٹ (پرانے پراجیکٹ)';
$ec_lang['lpn_settings_row_elev_source_old']='بلندی کا ماخذ (پرانے پراجیکٹ)';
$ec_lang['lpn_settings_row_basemap']='بیس میپ';
$ec_lang['lpn_settings_row_basemap_last']='جس بیس میپ پر لوٹنا ہے';
$ec_lang['lpn_settings_row_customer_max_width']='گاہک کے لیبلز تب دکھائیں جب نقشے کی چوڑائی اتنی یا اس سے کم ہو';
$ec_lang['lpn_settings_row_quality_step']='پانی کے معیار کا ٹائم اسٹیپ';
$ec_lang['lpn_settings_row_view']='نقشے کا منظر (مرکز اور اسکیل)';
$ec_lang['lpn_settings_row_bubbles']='نقشے پر وقتی سلسلے کے گراف';
$ec_lang['lpn_settings_row_contour_fill']='کنٹور بھرائی';
$ec_lang['lpn_settings_row_contour_opacity']='کنٹور بھرائی کی دھندلاہٹ';
$ec_lang['lpn_settings_row_contour_interval']='کنٹور وقفہ';
$ec_lang['lpn_settings_row_contour_buffer']='کنٹور بفر';
$ec_lang['lpn_settings_row_contour_terrain']='Mapbox DEM سے نوڈوں کے درمیان کنٹور کی زمین';
$ec_lang['lpn_settings_row_new_asset']='نئے اثاثے: {setting}';
$ec_lang['lpn_settings_row_default']='{value} (ڈیفالٹ)';
$ec_lang['lpn_settings_row_view_value']='مرکز {x}، {y}؛ اسکیل {s}';
$ec_lang['lpn_settings_held_in']='{scenario} میں اپنی قدر۔';
$ec_lang['lpn_settings_held_base']='{base}: {value}';
$ec_lang['lpn_settings_view_center']='نقشے کا مرکز';
$ec_lang['lpn_settings_view_scale']='نقشے کا اسکیل';
$ec_lang['lpn_settings_view_scale_tip']='نقشے کے مرکز پر اسکیل، 1:N کے طور پر۔ اس اسکیل پر زوم کرنے کے لیے 1:2000 لکھیں، یا صرف 2000۔';
$ec_lang['lpn_settings_view_top_left']='اوپر بائیں کونا';
$ec_lang['lpn_settings_view_bottom_right']='نیچے دائیں کونا';
$ec_lang['lpn_settings_view_save']='اس منظر کو اس منظرنامے میں محفوظ کریں';
$ec_lang['lpn_settings_view_save_tip']='نقشے کا یہ مرکز اور اسکیل کھلے ہوئے منظرنامے میں محفوظ کرتا ہے، تاکہ اس منظرنامے کو کھولنے سے نقشہ یہاں آ جائے۔ بعد میں نقشہ حرکت دینے سے کچھ نہیں بدلتا جب تک آپ اسے دوبارہ نہ دبائیں۔ {base} کے منظر کی پیروی دوبارہ کرنے کے لیے اپنی قدر ہٹائیں۔';
$ec_lang['lpn_settings_row_basemap_osm']='سڑکوں کا نقشہ';
$ec_lang['lpn_settings_row_basemap_satellite']='سیٹلائٹ تصاویر';
$ec_lang['lpn_settings_row_basemap_topo']='ٹاپو نقشہ';
$ec_lang['lpn_settings_units_one_project']='اکائیاں ہر منظرنامے میں ایک جیسی ہیں۔';
$ec_lang['lpn_settings_restore_base_only']='ڈیفالٹ بحال کرنے کے لیے بنیاد پر جائیں۔';
$ec_lang['lpn_alt_cat_physical']='طبعی';
$ec_lang['lpn_alt_cat_demand']='طلب';
$ec_lang['lpn_alt_cat_topology']='فعال ٹوپولوجی';
$ec_lang['lpn_alt_cat_topology_tip']='اثاثے کی فعالیت';
$ec_lang['lpn_alt_cat_initial']='ابتدائی ترتیبات';
$ec_lang['lpn_alt_cat_constituent']='جزو';
$ec_lang['lpn_alt_cat_fireflow']='فائر فلو';
$ec_lang['lpn_alt_cat_energy']='توانائی کی لاگت';
$ec_lang['lpn_alt_cat_text']='متن';
$ec_lang['lpn_alt_cat_presentation']='پیشکش';
// Edited by TGH 2026-09-07
// Task 721: the scenarios every new project starts with. Keep the leading number: the list sorts
// by name, and the numbers hold Tom's order in every language.
$ec_lang['lpn_scenario_preset_flow_static']='1. فلو ٹیسٹ: جامد';
$ec_lang['lpn_scenario_preset_flow_static_tip']='ڈیزائن نیٹ ورک کے لیے صفر بہاؤ پر فلو ٹیسٹ کی کیلیبریشن۔ اس منظرنامے میں تمام جنکشنز کی طلب 0 مقرر کریں۔';
$ec_lang['lpn_scenario_preset_flow_mid']='2. فلو ٹیسٹ: درمیانہ';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='ڈیزائن نیٹ ورک کے لیے رپورٹ کیے گئے پہلے بہاؤ پر فلو ٹیسٹ کی کیلیبریشن۔ اس منظرنامے میں بہنے والے جنکشن کی طلب کو ناپے گئے پہلے بہاؤ پر، اور باقی تمام جنکشنز کی طلب کو 0 پر مقرر کریں۔';
$ec_lang['lpn_scenario_preset_flow_max']='3. فلو ٹیسٹ: زیادہ سے زیادہ';
$ec_lang['lpn_scenario_preset_flow_max_tip']='ڈیزائن نیٹ ورک کے لیے رپورٹ کیے گئے زیادہ سے زیادہ بہاؤ پر فلو ٹیسٹ کی کیلیبریشن۔ اس منظرنامے میں بہنے والے جنکشن کی طلب کو ناپے گئے زیادہ سے زیادہ بہاؤ پر، اور باقی تمام جنکشنز کی طلب کو 0 پر مقرر کریں۔';
$ec_lang['lpn_scenario_preset_average_day']='4. اوسط دن';
$ec_lang['lpn_scenario_preset_average_day_tip']='طلب ضارب 1: ہر طلب جیسی درج کی گئی ہے، جسے اوسط دن کی طلب مانا جاتا ہے۔';
$ec_lang['lpn_scenario_preset_max_day']='5. زیادہ سے زیادہ دن';
$ec_lang['lpn_scenario_preset_mult_tip']='طلب کا ضارب اوسط دن کا {mult} گنا، ایک عارضی قدر۔ زیادہ تر نظام {lo} اور {hi} کے درمیان آتے ہیں (National Research Council, 2006)۔ جس نظام کی ماڈلنگ ہو رہی ہے اس کی قدر ترتیبات، حساب، ہائیڈرالکس، طلب کا ضارب میں مقرر کریں۔';
$ec_lang['lpn_scenario_preset_peak_hour']='6. عروجی گھنٹہ';
$ec_lang['lpn_delete_drops_overrides']='اس عنصر کو حذف کرنے سے اس کی منظرنامے کی اپنی قدریں ({n}) بھی حذف ہو جائیں گی۔ جاری رکھیں؟';
$ec_lang['lpn_push_base_only']='یہ عمل خود ڈرائنگ کو تبدیل کرتا ہے، اس لیے یہ صرف {base} میں کیا جا سکتا ہے۔ {base} پر جائیں اور دوبارہ کوشش کریں۔';
$ec_lang['lpn_field_active']='فعال ہے؟';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='عنصر کو ڈرائنگ پر رکھنے مگر نیٹ ورک سے باہر رکھنے کے لیے یہ خانہ خالی کریں: یہ سرمئی رنگ میں بنتا ہے اور حل کار اسے نظر انداز کرتا ہے۔ منظرنامے میں پائپ اسی طرح آن اور آف کیا جاتا ہے۔';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='ایمیٹر اظہاریہ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='EPANET کی ایمیٹر مساوات میں سپرنکلر اور رساؤ کے لیے ایکسپونینٹ: بہاؤ = گتانک x دباؤ اس ایکسپونینٹ کی قوت پر۔ یہ نتائج کو صرف ان نوڈز پر متاثر کرتا ہے جن میں ایمیٹر گتانک ہو۔';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='DEM پڑھیں';
$ec_lang['lpn_elev_dem_sample_tip']='اس نوڈ پر DEM کی بلندی پڑھیں اور نیچے دکھائیں۔ بلندی کے خانے میں کچھ تبدیل نہیں ہوتا۔ زیادہ تر زمین پر افقی DEM ریزولیوشن تقریباً 30 میٹر ہے، اور جہاں بہتر ڈیٹا موجود ہو وہاں باریک تر ہے۔';
$ec_lang['lpn_elev_dem_use']='DEM استعمال کریں';
$ec_lang['lpn_elev_dem_use_tip']='اس نوڈ پر DEM کی بلندی کو اوپر بلندی کے خانے میں ڈالیں، جو وہاں پہلے سے ہے اسے بدلتے ہوئے۔ اگر DEM ابھی نہیں پڑھا گیا تو پہلے اسے پڑھا جاتا ہے۔ ایک بار انڈو کرنے سے یہ واپس آ جاتا ہے۔';
$ec_lang['lpn_elev_dem_none']='DEM کے پاس اس نوڈ کے لیے کوئی بلندی نہیں۔';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM کی بلندی: {v} {u}۔';
$ec_lang['lpn_settings_elev_source']='بلندی کا ذریعہ';
$ec_lang['lpn_settings_elev_source_tip']='2026 میں Mapbox DEM کی افقی اور عمودی درستگی کی حدیں: امریکہ میں 1 سے 10 میٹر اور 1 میٹر سے کم، یورپ اور جاپان میں 2 سے 10 میٹر اور 1 سے 3 میٹر، عالمی سطح پر 30 میٹر اور 10 سے 16 میٹر، اور قطبین پر 90 میٹر اور 16 میٹر سے زیادہ۔';
$ec_lang['lpn_settings_elev_source_typed']='اوپر';
$ec_lang['lpn_settings_elev_source_dem']='Mapbox کا DEM';
$ec_lang['lpn_settings_accuracy']='درستگی';
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
$ec_lang['lpn_settings_default_is']='پہلے سے مقررہ قدر {n} ہے۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='ہم آہنگی کی وہ حد جس تک حل کار کو رکنے سے پہلے پہنچنا ہے، جو ایک کوشش سے اگلی تک بہاؤ میں کل تبدیلی کو لنکس میں کل بہاؤ سے تقسیم کر کے ناپی جاتی ہے۔ چھوٹا عدد زیادہ درست ہے اور زیادہ وقت لیتا ہے۔';
$ec_lang['lpn_settings_specific_gravity']='مخصوص کثافت';
$ec_lang['lpn_settings_viscosity']='نسبتی چپکاؤ';
// **THE PASHTO COLLISION THIS ANSWERS IS REAL AND IS INSIDE PASHTO** (sprint 584-wave1). ps renders
// this key with the word غلظت, which carries BOTH viscosity/thickness AND concentration -- so it
// collided with the word the same sprint used for lpn_result_concentration, on the same screen.
// Tom approved a synonym on 2026-09-06. **HIS FIRST WORDING WAS 'Relative rate of diffusion' and it
// is NOT what shipped**: that is diffusivity, and this key is viscosity. He was given a friction
// entry that quoted a translator's mistaken description of the key without anyone checking it
// against this file -- so the note below says what the number IS and what it is NOT, because two
// separate readers have now reached for a transport coefficient on a fluid property.
$ec_lang['lpn_settings_viscosity_tip']='20 ڈگری سیلسیس پر پانی کے مقابلے میں سیال کا چپکاؤ۔ یہ صرف Darcy-Weisbach طریقے کے تحت جواب بدلتا ہے۔';
$ec_lang['lpn_settings_trials']='زیادہ سے زیادہ کوششیں';
$ec_lang['lpn_settings_trials_tip']='ایسے نیٹ ورک پر جو ہم آہنگ نہیں ہوتا، حل کار کے رکنے سے پہلے کوششوں کی زیادہ سے زیادہ تعداد۔';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='اگر یہ ہم آہنگ نہ ہو';
$ec_lang['lpn_settings_unbalanced_tip']='ایسے نیٹ ورک کے لیے عمل جس نے اپنی کوششیں ختم کر لی ہوں اور پھر بھی ہم آہنگ نہ ہوا ہو۔ اضافی کوششوں کی اجازت دینے سے اکثر ہم آہنگی حاصل ہو جاتی ہے۔ رکنا آخری کوشش کو جیسی ہے ویسی رپورٹ کرتا ہے، جو کوئی حل نہیں ہے۔';
$ec_lang['lpn_settings_unbalanced_continue']='اضافی کوششوں کی اجازت دیں';
$ec_lang['lpn_settings_unbalanced_stop']='رک کر آخری کوشش رپورٹ کریں';
$ec_lang['lpn_settings_unbalanced_trials']='رپورٹ کرنے سے پہلے اضافی کوششیں';
$ec_lang['lpn_settings_unbalanced_trials_tip']='اوپر کی زیادہ سے زیادہ حد ختم ہونے کے بعد، آخری کوشش رپورٹ ہونے سے پہلے مزید کتنی کوششوں کی اجازت ہے۔';
$ec_lang['lpn_settings_head_error']='ہیڈ خرابی کی حد';
$ec_lang['lpn_settings_head_error_tip']='حل کار کے رکنے سے پہلے اسے پاس کرنی والی ایک اضافی جانچ: کسی ایک پائپ میں باقی رہ جانے والی سب سے بڑی ہیڈ خرابی۔ صفر کا مطلب ہے یہ جانچ لاگو نہ کی جائے۔ صرف EPANET حل کار اس خانے کو پڑھتا ہے۔';
$ec_lang['lpn_settings_flow_change']='بہاؤ تبدیلی کی حد';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='حل کار کے رکنے سے پہلے اسے پاس کرنی والی ایک اضافی جانچ: کسی ایک پائپ کے بہاؤ میں ایک کوشش سے اگلی کوشش تک زیادہ سے زیادہ تبدیلی۔ صفر کا مطلب ہے یہ جانچ لاگو نہ کی جائے۔ صرف EPANET حل کار اس خانے کو پڑھتا ہے۔';
$ec_lang['lpn_settings_damp_limit']='ڈیمپنگ یہاں سے شروع ہوتی ہے';
$ec_lang['lpn_settings_damp_limit_tip']='وہ درستگی جس پر حل کار چھوٹے قدم اٹھانا شروع کرتا ہے، جو ایک لرزتے نیٹ ورک کو ہم آہنگ ہونے میں مدد دے سکتا ہے۔ صفر کا مطلب ہے حل کار کبھی ڈیمپ نہیں کرتا۔ صرف EPANET حل کار اس خانے کو پڑھتا ہے۔';
$ec_lang['lpn_settings_option_unset']='بیان نہیں کیا گیا';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='ایک ہی ضارب جو نیٹ ورک کی ہر طلب پر ایک ساتھ لاگو ہوتا ہے۔ ہر منظرنامے کی الگ قدر ہو سکتی ہے، اس لیے صرف اسی سیٹنگ کو بدل کر اوسط دن، زیادہ سے زیادہ دن یا پیک گھنٹہ بنایا جا سکتا ہے۔';
$ec_lang['lpn_settings_engine_native']='جہاں ممکن ہو بلٹ اِن حل کار استعمال کریں';
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
$ec_lang['lpn_settings_engine_native_tip']='جہاں ممکن ہو بلٹ اِن سولور استعمال کرنے کے لیے اسے فعال کریں۔ ورنہ US EPA کا EPANET سولور ہمیشہ استعمال ہوتا ہے۔ بلٹ اِن سولور توسیعی مدت کے سمولیشن یا پریشر بریکر اور عمومی مقصد کے والوز (PBV، GPV) کے لیے استعمال نہیں ہوتا۔ EPANET سولور پہلی بار استعمال ہونے پر تقریباً 650 KB ڈاؤن لوڈ ہوتا ہے اور پھر اس آلے پر رکھا جاتا ہے۔ جہاں پائپ میں مقامی نقصان (minor loss) ہو، وہاں دونوں سولور آخری ہندسوں میں مختلف ہوتے ہیں: EPANET ثقلی اسراع کی گول کی ہوئی قدر استعمال کرتا ہے، اس لیے اس کے مقامی نقصانات عین شکل سے بہت معمولی کم ہوتے ہیں۔';
$ec_lang['lpn_engine_loading']='EPANET حل کار لوڈ ہو رہا ہے…';
$ec_lang['lpn_engine_failed']='EPANET حل کار لوڈ نہیں ہو سکا۔ اس کی بجائے بلٹ ان حل کار دکھایا جا رہا ہے۔';
$ec_lang['lpn_engine_failed_why']='{reason} اس کی جگہ بلٹ اِن حل کار دکھایا جا رہا ہے۔';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_unit_unknown']='یہ ڈرائنگ ایسی اکائی بیان کرتی ہے جسے یہ صفحہ سپورٹ نہیں کرتا: {unit}۔ تمام قدریں بالکل جیسی درآمد ہوئیں ویسی ہی رکھی اور دکھائی گئی ہیں، اور کچھ تبدیل نہیں کیا گیا۔ جب تک اکائی سپورٹ نہ ہو کچھ حساب نہیں کیا جا سکتا، کیونکہ اس کا تبدیلی کا عامل معلوم نہیں۔';
$ec_lang['lpn_engine_manning_note']='نوٹ: مانیننگ کھردرا پن کے ساتھ، EPANET مانیننگ مساوات میں مستقل کو گول کرتا ہے، اس لیے دباؤ نقصان درست شکل سے تقریباً 0.6% کم آتا ہے۔';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='EPANET حل کار نے اس نیٹ ورک کو قبول نہیں کیا، اس لیے یہ نہیں چلا۔';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='EPANET حل کار نے کہا: {message}';
$ec_lang['lpn_engine_refused_fallback']='سکرین پر موجود اعداد اس کی بجائے بلٹ ان حل کار سے آئے ہیں۔';
// A run EPANET started and could not finish, for example when a tank empties and the junctions it
// fed have no other source (Error 110). {time} is the run time it stopped at, H:MM.
$ec_lang['lpn_time_run_stopped']='EPANET رن {time} پر رک گیا، اس لیے اس کے کوئی نتائج نہیں ہیں۔ اس کی رن رپورٹ وجہ بتاتی ہے۔';
$ec_lang['lpn_time_stat_stopped']='{statistic} نہیں دکھایا گیا: رن دورانیے کے اختتام سے پہلے رک گیا۔';
$ec_lang['lpn_time_stopped_no_quality']='پانی کے معیار کے کوئی نتائج نہیں نکالے گئے، کیونکہ معیار کا تجزیہ ہائیڈرالک رن ختم ہونے کے بعد شروع ہوتا ہے۔';
$ec_lang['lpn_energy_stopped']='EPANET رن دورانیے کے اختتام سے پہلے رک گیا، اس لیے پمپ توانائی کے کوئی نتائج نہیں نکالے گئے۔';
$ec_lang['lpn_time_run_stopped_kept']='EPANET رن {time} پر رک گیا۔ نتائج {solved} تک ہیں، جو اس کا آخری حل کیا گیا دورانیہ تھا، اور اس کے بعد کوئی نتیجہ نہیں دکھایا گیا۔ اس کی رن رپورٹ وجہ بتاتی ہے۔';
// Why a stopped run stopped, read from EPANET's own run report (R-402). {link} is the link EPANET
// had just closed, {tank} the tank at one end of it, {nodes} the ids of the nodes EPANET then could
// not solve for, comma-separated. Follows lpn_time_run_stopped or lpn_time_run_stopped_kept.
$ec_lang['lpn_time_run_cut_off']='EPANET نے {link} بند کر دیا تھا اور پھر {nodes} کے لیے حل نہیں کر سکا۔';
$ec_lang['lpn_time_run_cut_off_full']='ٹینک {tank} بھرا ہوا تھا، اس لیے EPANET نے {link} بند کر دیا تاکہ اس میں پانی نہ جائے، اور پھر {nodes} کے لیے حل نہیں کر سکا۔ ایسا تب ہو سکتا ہے جب بھرے ہوئے ٹینک سے پانی نہ نکل رہا ہو، جیسے جب ہر طلب صفر ہو۔ صفر سے ذرا زیادہ طلب، یا ٹینک کی سطح اس کی زیادہ سے زیادہ سے ذرا نیچے، اس سے بچاتی ہے۔';
$ec_lang['lpn_time_run_cut_off_empty']='ٹینک {tank} خالی تھا، اس لیے EPANET نے {link} بند کر دیا تاکہ وہ مزید خالی نہ ہو، اور پھر {nodes} کے لیے حل نہیں کر سکا۔';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='اسکرین پر موجود اعداد اس کی جگہ بلٹ اِن حل کار سے آئے ہیں۔ یہ ایک وقت میں ایک لمحہ حل کرتا ہے، اس لیے یہ صرف {time} پر نیٹ ورک ہے، ہر ٹینک اپنی ابتدائی سطح پر۔';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='یہ کنٹرول ایک ایسے عنصر کا نام لیتے ہیں جو اب اس پراجیکٹ میں نہیں، اس لیے انہیں چھوڑ دیا گیا: {ids}';
$ec_lang['lpn_control_unreadable_note']='یہ کنٹرول پڑھے نہیں جا سکے، اس لیے انہیں چھوڑ دیا گیا: {ids}';
$ec_lang['lpn_control_inactive_note']='یہ کنٹرولز ایک ایسے اثاثے کا حوالہ دیتے ہیں جو اس منظرنامے میں غیر فعال ہے، اس لیے اس کے رن میں نظرانداز کیے جاتے ہیں: {ids}';
$ec_lang['lpn_rule_inactive_note']='یہ قواعد ایک ایسے اثاثے کا حوالہ دیتے ہیں جو اس منظرنامے میں غیر فعال ہے، اس لیے اس کے رن میں نظرانداز کیے جاتے ہیں: {ids}';
$ec_lang['lpn_rule_dangling_note']='یہ قواعد ایک ایسے عنصر کا حوالہ دیتے ہیں جو اب اس پراجیکٹ میں موجود نہیں، اس لیے انہیں اس رن میں نظر انداز کیا گیا: {ids}';
$ec_lang['lpn_rule_unreadable_note']='یہ قواعد پڑھے نہیں جا سکے، اس لیے انہیں اس رن میں نظر انداز کیا گیا: {ids}';
$ec_lang['lpn_settings_text_size']='متن کا سائز (پکسلز)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='علامت کا سائز (پکسلز)';
$ec_lang['lpn_settings_link_width']='پائپ لائن کی موٹائی (پکسلز)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='بہاؤ کی سمت کے تیر';
$ec_lang['lpn_settings_show_arrows_tip']='ہر پائپ پر تیر بنائیں جو دکھاتا ہے کہ پانی کس طرف بہہ رہا ہے۔ تیر رن کے بعد ظاہر ہوتے ہیں، اور انہیں بند کرنے سے نتائج تبدیل نہیں ہوتے۔';
$ec_lang['lpn_settings_align_labels']='پائپ لیبلز کو پائپوں کے ساتھ سیدھا کریں';
$ec_lang['lpn_settings_readability_bias']='عمودی سے کتنے درجے بائیں طرف ہونے پر لیبل الٹا دیا جاتا ہے';
$ec_lang['lpn_settings_readability_bias_tip']='جب لیبل عمودی سے اتنے درجے زیادہ بائیں طرف جھکا ہو تو اسے سیدھا رکھنے کے لیے الٹ دیں۔';
$ec_lang['lpn_settings_mask_labels']='لیبلز کے پیچھے ٹھوس پس منظر';
$ec_lang['lpn_settings_text_halo']='متن کے ہالے کی چوڑائی (متن کے سائز کا فیصد)';
$ec_lang['lpn_settings_text_halo_tip']='نقشے کے متن کے پیچھے ٹھوس خاکے کی چوڑائی، متن کے سائز کے فیصد کے طور پر۔ تب لاگو ہوتی ہے جب لیبلز کے پیچھے ٹھوس پس منظر آن ہو۔';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='لیڈر لائنوں کو مقررہ زاویوں پر جوڑیں';
// Edited by TGH 2026-09-07
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='لیبلز دکھائیں جب نقشہ اس چوڑائی یا اس سے کم پر زوم ہو';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='لیبلز صرف تب بنائے جاتے ہیں جب نقشے کا منظر اتنا چوڑا یا اس سے تنگ ہو۔ ہر زوم پر بنانے کے لیے خانہ خالی چھوڑیں۔ کسی بھی زوم پر کبھی لیبل نہ بنانے کے لیے 0 درج کریں۔';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='ہمیشہ دکھائیں';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap_sentence']='نوڈز کو اس سے بڑا ہونے سے روکیں {n} کی لمبائی کے گنا {p} پرسنٹائل پائپ';
$ec_lang['lpn_settings_symbol_cap_tip']='جنکشن اپنا اسکرین سائز رکھنا اس وقت چھوڑ دیتے ہیں جب نقشے پر ان کا قطر نیٹ ورک میں تمام پائپ لمبائیوں کے اس پرسنٹائل پر پائپ کی لمبائی کا اتنا گنا ہو جائے۔ نقشے پر اس مقام کے بعد، باہر زوم کرنے پر جنکشن، پائپ اور دیگر علامتیں اسکرین پر سکڑ جاتی ہیں۔ ریزروائر اور ٹینک اس سے مستثنیٰ ہیں اور ہر زوم پر اپنا اسکرین سائز برقرار رکھتے ہیں۔';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='علامت کی دھندلاہٹ (0 سے 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='پس منظر کی تصویر کی دھندلاہٹ (0 سے 1)';
// Task 617: a display-time filter on the street or satellite tiles only; the drawing and the credit are untouched.
$ec_lang['lpn_settings_basemap_style']='بیس میپ کا انداز';
$ec_lang['lpn_basemap_style_normal']='عام';
$ec_lang['lpn_basemap_style_muted']='مدھم';
$ec_lang['lpn_basemap_style_faded']='ہلکا';
$ec_lang['lpn_basemap_style_grayscale']='گرے اسکیل';
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
$ec_lang['lpn_settings_legend_position']='لیبلز کی کلید کی جگہ';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='کوئی نہیں';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='بند';
$ec_lang['lpn_settings_legend_top_left']='اوپر بائیں';
$ec_lang['lpn_settings_legend_top_right']='اوپر دائیں';
$ec_lang['lpn_settings_legend_middle_left']='درمیان بائیں';
$ec_lang['lpn_settings_legend_middle_right']='درمیان دائیں';
$ec_lang['lpn_settings_legend_bottom_left']='نیچے بائیں';
$ec_lang['lpn_settings_legend_bottom_right']='نیچے دائیں';
$ec_lang['lpn_settings_color_node_field']='نوڈ کا رنگ';
$ec_lang['lpn_settings_color_link_field']='پائپ کا رنگ';
$ec_lang['lpn_settings_color_ramp']='رنگ سکیم';
$ec_lang['lpn_settings_color_credits']='کریڈٹس';
$ec_lang['lpn_color_ramp_epanet']='نیلے سے سرخ (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='جامنی سے پیلا (ایک رنگ کو دوسرے سے پہچاننا آسان)';
$ec_lang['lpn_color_ramp_gray']='ہلکے سے گہرے سرمئی';
$ec_lang['lpn_settings_color_reverse']='رنگوں کی ترتیب الٹ دیں';
$ec_lang['lpn_color_none']='کوئی رنگ نہیں';
$ec_lang['lpn_settings_color_key_position']='رنگ کی کلید کی جگہ';
$ec_lang['lpn_settings_color_breaks']='رنگ بینڈ کی حدیں';
$ec_lang['lpn_settings_color_equal_intervals']='مساوی وقفے';
$ec_lang['lpn_settings_color_equal_counts']='مساوی تعداد';
$ec_lang['lpn_settings_color_no_values']='ابھی کام کرنے کے لیے کوئی قدریں نہیں ہیں۔ پہلے نیٹ ورک حل کریں۔';
$ec_lang['lpn_confirm_restore_defaults']='تمام ترتیبات (ID سابقے، ابتدائی قدریں، حل کار کی ترتیبات، نقشے کی ظاہری شکل، کلید کی جگہ، اور نظر آنے والے لیبلز) کو اصل قدروں پر ری سیٹ کریں؟ آپ کا نیٹ ورک تبدیل نہیں ہوتا۔ ترتیبات کھلے پراجیکٹ سے تعلق رکھتی ہیں، اس لیے آپ کے دوسرے پراجیکٹس اپنی اپنی ترتیبات رکھتے ہیں۔';
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
$ec_lang['lpn_settings_wipe_btn']='اس صفحے پر سب کچھ مٹا دیں';
$ec_lang['lpn_confirm_wipe']='اس صفحے کے لیے محفوظ سب کچھ حذف کریں — ہر پراجیکٹ، ہر پس منظر کی تصویر، تمام ترتیبات، اور آپ کے یونٹ کے انتخاب — اور صفحے کو اس طرح دوبارہ لوڈ کریں جیسے ایک بالکل نیا وزیٹر دیکھے گا؟ یہ عمل واپس نہیں لیا جا سکتا۔';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='یہ لنک کاپی کریں:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='وقت';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='کل چلنے کا وقت';
$ec_lang['lpn_time_hyd_step']='ہائیڈرالک وقفہ';
$ec_lang['lpn_time_pattern_step']='پیٹرن وقفہ';
$ec_lang['lpn_time_pattern_start']='پیٹرن شروع ہونے کا وقت';
$ec_lang['lpn_time_report_step']='رپورٹ وقفہ';
$ec_lang['lpn_time_report_start']='رپورٹ شروع ہونے کا وقت';
$ec_lang['lpn_time_clock_start']='شروع میں گھڑی کا وقت';
$ec_lang['lpn_time_statistic']='شماریاتی قدر';
$ec_lang['lpn_time_stat_none']='کوئی نہیں';
$ec_lang['lpn_time_stat_averaged']='اوسط';
$ec_lang['lpn_time_stat_minimum']='کم از کم';
$ec_lang['lpn_time_stat_maximum']='زیادہ سے زیادہ';
$ec_lang['lpn_time_stat_range']='رینج';
$ec_lang['lpn_time_clock_day']='دن {day}، {clock}';
$ec_lang['lpn_time_format_tip']='وقت گھنٹے اور منٹ کی صورت میں لکھیں، جیسے 2:30۔ سادہ عدد کا مطلب گھنٹے ہیں، اس لیے 8 کا مطلب آٹھ گھنٹے ہے۔ آدھا گھنٹہ 0:30 ہے۔';
$ec_lang['lpn_time_running']='وقتی دورانیے کی سمولیشن چلائی جا رہی ہے۔';
$ec_lang['lpn_time_no_engine']='بلٹ اِن حل کار ایک وقت میں ایک لمحہ حل کرتا ہے، اس لیے یہ صرف {time} پر نیٹ ورک ہے: ہر پیٹرن اسی لمحے پر پڑھا جاتا ہے، اور ہر ٹینک بھرنے اور خالی ہونے کے بجائے اپنی ابتدائی سطح پر رہتا ہے۔ وقتی دورانیے کی سمولیشن چلانے والا EPANET حل کار ڈاؤن لوڈ کرنے کے لیے ایک بار انٹرنیٹ سے جڑیں۔';
// lpn_time_no_engine says "connect to the internet", which is true only offline. For the other causes
// of a failed extended period run the same note ends in {reason}, one of the three sentences below.
$ec_lang['lpn_time_no_engine_why']='بلٹ اِن حل کار ایک وقت میں ایک لمحے کو حل کرتا ہے، اس لیے یہ صرف {time} پر نیٹ ورک ہے: ہر پیٹرن اسی لمحے پر پڑھا جاتا ہے، اور ہر ٹینک بھرنے اور خالی ہونے کے بجائے اپنی ابتدائی سطح پر رہتا ہے۔ {reason}';
$ec_lang['lpn_time_engine_fetch_failed']='EPANET حل کار کا ڈاؤن لوڈ ناکام ہو گیا۔ دوبارہ کوشش کے لیے صفحہ ریلوڈ کریں؛ ممکن ہے فائر وال، پراکسی یا براؤزر ایکسٹینشن اسے روک رہی ہو۔';
$ec_lang['lpn_time_engine_start_failed']='براؤزر نے EPANET حل کار شروع کرنے سے انکار کر دیا۔ ممکن ہے WebAssembly کسی سکیورٹی سیٹنگ یا ایکسٹینشن سے بند ہو۔';
$ec_lang['lpn_time_engine_run_failed']='EPANET رن ناکام ہو گیا۔ یہ اس صفحے کی خرابی ہے؛ رپورٹ کرنے کے لیے {wrong} لنک استعمال کریں۔';
$ec_lang['lpn_time_slider']='سمیولیشن کا گزرا ہوا وقت';
$ec_lang['lpn_time_no_period']='اس پراجیکٹ میں کوئی وقتی دورانیے کی سمولیشن مقرر نہیں، اس لیے دکھانے کو صرف ایک لمحہ ہے۔ وقتی دورانیے کی سمولیشن چلانے کے لیے ترتیبات، حساب کتاب، وقت میں کل چلنے کا وقت مقرر کریں۔';
$ec_lang['lpn_time_first']='شروع میں جائیں';
$ec_lang['lpn_time_prev']='پیچھے جائیں';
$ec_lang['lpn_time_play']='چلائیں';
$ec_lang['lpn_time_play_tip']='اینیمیشن چلائیں';
$ec_lang['lpn_time_pause_tip']='اینیمیشن روکیں';
$ec_lang['lpn_time_pause']='روکیں';
$ec_lang['lpn_time_next']='آگے جائیں';
$ec_lang['lpn_time_last']='آخر میں جائیں';
$ec_lang['lpn_time_tank']='ٹینک';
$ec_lang['lpn_time_level']='پانی کی سطح';
$ec_lang['lpn_time_run']='حل کریں';
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
$ec_lang['lpn_time_run_done']='رن مکمل ہو گیا۔ رپورٹنگ اوقات: {frames}۔ لگا وقت: {secs} سیکنڈ۔';
$ec_lang['lpn_time_runbox_hide']='یہ باکس دوبارہ نہ دکھائیں';
$ec_lang['lpn_settings_runbox']='رن کی پیش رفت کا باکس دکھائیں';
$ec_lang['lpn_settings_runbox_tip']='ایک باکس جو بتاتا ہے کہ رن کتنی دور تک پہنچا اور اسے کیا ملا۔ اگر یہ بند ہو تو مکمل شدہ رن اسی کی بجائے کچھ سیکنڈز کے لیے سٹیٹس لائن میں وہی بات بتاتا ہے۔ یہ اس براؤزر کے لیے ایک ترتیب ہے، پراجیکٹ کے لیے نہیں۔';
$ec_lang['lpn_time_run_failed']='رن مکمل نہیں ہوا، اس لیے بعد کے اوقات کے لیے کوئی نتائج نہیں ہیں۔';
$ec_lang['lpn_time_run_report']='رن رپورٹ';
$ec_lang['lpn_time_run_report_copied']='کاپی ہو گیا';
$ec_lang['lpn_time_run_report_tip']='آخری رن کے لیے EPANET کی لکھی ہوئی رپورٹ، من و عن: آیا وہ ہم آہنگ ہوا، اور کوئی انتباہات۔ متن EPANET حل کار نے تیار کیا ہے، اس صفحے نے نہیں۔';

$ec_lang['lpn_time_speed']='رفتار';
$ec_lang['lpn_time_speed_tip']='چلانے کی رفتار';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='ترتیبات تلاش کریں';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='ایک یا زیادہ الفاظ درج کریں تاکہ وہ سیٹنگز نظر آئیں جن میں یہ سب الفاظ مذکور ہوں۔';
$ec_lang['lpn_settings_no_match']='کوئی ترتیب اس لفظ کا ذکر نہیں کرتی۔';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='ترتیبات سیکشن فہرست کی چوڑائی';
$ec_lang['lpn_rpane_empty']='ابھی یہاں کچھ نہیں لگایا گیا۔ پورے پراجیکٹ سے متعلق ہر چیز ترتیبات میں ہے۔';
$ec_lang['lpn_time_settings_open']='وقت کی ترتیبات';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='بصری پیشکش';
$ec_lang['lpn_settings_sec_assets']='عناصر';
$ec_lang['lpn_settings_sec_calculation']='حساب';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='گاہک';
$ec_lang['lpn_labels_customer_note']='گاہک لیبل یہاں چنی گئی قدریں دکھاتا ہے۔ یہ نقشے کے ہر دوسرے لیبل کے برابر متن سائز پر بنایا جاتا ہے۔';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='گاہک لیبلز صرف تب بنائے جاتے ہیں جب نقشے کا منظر اتنا چوڑا یا اس سے تنگ ہو۔ ہر زوم پر بنانے کے لیے خانہ خالی چھوڑیں۔ کسی بھی زوم پر گاہک لیبل کبھی نہ بنانے کے لیے 0 درج کریں۔ اگر یہ تمام لیبلز کی ملتی جلتی سیٹنگ سے بڑی ہو تو اس کا کوئی اثر نہیں ہوتا۔';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='موجودہ منظر استعمال کریں';
$ec_lang['lpn_settings_page']='صفحہ';
$ec_lang['lpn_saved_project']='پراجیکٹ کے ساتھ محفوظ';
$ec_lang['lpn_saved_browser']='اس براؤزر میں محفوظ';
$ec_lang['lpn_saved_session']='محفوظ نہیں';
$ec_lang['lpn_settings_hydraulics']='ہائیڈرالکس';
$ec_lang['lpn_settings_quality']='پانی کا معیار';
$ec_lang['lpn_settings_quality_track']='معیار پیرامیٹر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='چنیں کہ رن کو پائپوں میں کس چیز کا پیچھا کرنا چاہیے: پانی نظام میں کتنی دیر سے ہے، یہ کہاں سے آیا، یا ایک کیمیکل جو سفر کے دوران رد عمل ظاہر کرتا ہے۔ صرف کیمیکل کو گتانک درکار ہوتے ہیں۔';
$ec_lang['lpn_settings_quality_source']='ٹریس نوڈ';
$ec_lang['lpn_settings_quality_source_tip']='وہ نوڈ جس کے پانی کو ٹریس کیا جاتا ہے۔ ہر دوسرا نوڈ پھر یہ دکھاتا ہے کہ اس کا کتنا پانی اسی نوڈ سے آیا۔';
$ec_lang['lpn_quality_none']='کچھ نہیں';
$ec_lang['lpn_quality_trace']='سورس ٹریس';
$ec_lang['lpn_quality_chemical']='ایک کیمیکل جو رد عمل ظاہر کرتا ہے';
$ec_lang['lpn_quality_needs_run']='پانی کا معیار پانی کے سفر کے ساتھ پائپوں میں لے جایا جاتا ہے، اس لیے اسے وقتی دورانیے کی سمولیشن درکار ہے: EPANET انجن اور کل چلنے کا وقت۔ وقت کے تحت کل چلنے کا وقت مقرر کریں، پھر حل کریں بٹن دبائیں۔';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='کیمیکل اور یونٹس';
$ec_lang['lpn_quality_chemical_name_tip']='جس کیمیکل کو ٹریک کیا جا رہا ہے، مثلاً کلورین۔ EPANET کے ڈیفالٹ لیبل، Chemical، کے لیے اسے خالی چھوڑیں۔ رپورٹس میں دکھایا جاتا ہے، لیکن حساب میں استعمال نہیں ہوتا۔';
$ec_lang['lpn_quality_mass_units']='ماس یونٹس';
$ec_lang['lpn_quality_mass_units_tip']='معیار کے اندراج کا اکائی والا حصہ، EPANET کے دو انتخابات میں سے۔';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='معیار کی رواداری';
$ec_lang['lpn_quality_tolerance_tip']='ارتکاز کا وہ فرق جس سے کم ہونے پر EPANET پانی کے دو ملحقہ پارسلوں کو ایک سمجھتا ہے۔ خالی چھوڑنے پر EPANET کی ڈیفالٹ 0.01 استعمال ہوتی ہے۔';
$ec_lang['lpn_quality_diffusivity']='نسبتی پھیلاؤ پذیری';
$ec_lang['lpn_quality_diffusivity_tip']='پانی میں کیمیکل کی نفوذ پذیری، کلورین کے مقابلے میں۔ خالی چھوڑنے پر EPANET کی ڈیفالٹ 1.0 استعمال ہوتی ہے۔';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='{chemical} ارتکاز';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='اوسط {chemical} ارتکاز';
$ec_lang['lpn_quality_initial']='ابتدائی معیار';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='رن شروع ہونے پر اس نوڈ پر کیمیکل کی مقدار۔ ریزروائر پوری رن میں یہی قدر برقرار رکھتا ہے، جس طرح ٹریٹمنٹ پلانٹ سے نکلنے والا ریزیجوول عموماً بیان کیا جاتا ہے۔ خالی کا مطلب 0 ہے۔';
$ec_lang['lpn_result_concentration']='ارتکاز';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='سفر کرنے اور رد عمل ظاہر کرنے کے بعد اس مقام پر کتنا کیمیکل باقی ہے۔ یونٹس وہی ہیں جو ترتیبات، پانی کا معیار کے تحت کیمیکل کے ساتھ بتائے گئے ہیں۔';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='سورس کی قسم';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='یہ نوڈ اپنے سے گزرنے والے پانی پر کس قسم کی خوراک لاگو کرتا ہے۔ ارتکاز اس پانی کو جو یہاں نیٹ ورک میں داخل ہوتا ہے سورس معیار کی قدر پر پہنچتا ہوا سمجھتا ہے۔ ماس بوسٹر ہر منٹ کیمیکل کی ایک مقدار شامل کرتا ہے، خواہ بہاؤ کچھ بھی ہو۔ سیٹ پوائنٹ بوسٹر اس نوڈ سے نکلنے والے ارتکاز کو سورس معیار کی قدر تک اٹھاتا ہے، اس سے آگے نہیں۔ فلو-پیسڈ بوسٹر پانی میں پہلے سے موجود مقدار میں سورس معیار کی قدر شامل کرتا ہے۔';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='کچھ نہیں';
$ec_lang['lpn_source_type_concen']='ارتکاز';
$ec_lang['lpn_source_type_mass']='ماس بوسٹر';
$ec_lang['lpn_source_type_setpoint']='سیٹ پوائنٹ بوسٹر';
$ec_lang['lpn_source_type_flowpaced']='فلو-پیسڈ بوسٹر';
$ec_lang['lpn_source_quality']='سورس معیار';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='خوراک کی شدت۔ ماس بوسٹر کے سوا ہر قسم کے لیے یہ ارتکاز ہے، انہی اکائیوں میں جو ترتیبات، حساب، پانی کا معیار کے تحت کیمیکل کے ساتھ درج ہیں؛ ماس بوسٹر کے لیے یہ فی منٹ کمیت کا بہاؤ ہے۔ خالی کا مطلب ہے کوئی کیمیکل سورس نہیں، جو عملی طور پر 0 کے برابر ہے۔';
$ec_lang['lpn_source_pattern']='سورس پیٹرن';
$ec_lang['lpn_source_pattern_tip']='ایک وقتی پیٹرن جو رن کے دوران خوراک کو بڑھاتا گھٹاتا ہے، ایسی فیڈ کے لیے جو مستقل نہیں۔ کوئی پیٹرن نہ ہونے کا مطلب ہے کہ خوراک ہر مرحلے پر یکساں ہے۔';
$ec_lang['lpn_mixing_model']='مکسنگ ماڈل';
$ec_lang['lpn_mixing_model_tip']='اس ٹینک میں پہلے سے موجود پانی آنے والے پانی کے ساتھ کیسے ملتا ہے۔ مکمل مکسنگ تمام آنے والے پانی کو فوراً ٹینک کے پورے حجم کے ساتھ ملاتی ہے۔ ٹو-کمپارٹمنٹ مکسنگ پہلے ایک انلیٹ زون بھرتی ہے اور اوور فلو مرکزی زون کو بھیجتی ہے۔ FIFO پلگ فلو پانی کو اسی ترتیب میں خارج کرتا ہے جس میں وہ پہنچا۔ LIFO پلگ فلو اسے تہہ در تہہ رکھتا ہے، اس لیے آخر میں آنے والا پانی سب سے پہلے نکلتا ہے۔ یہ انتخاب پانی کی عمر اور ریزیجوول کو متاثر کرتا ہے، دباؤ یا بہاؤ کو نہیں۔';
$ec_lang['lpn_mixing_mixed']='مکمل مکسنگ';
$ec_lang['lpn_mixing_2comp']='ٹو-کمپارٹمنٹ مکسنگ';
$ec_lang['lpn_mixing_fifo']='FIFO پلگ فلو';
$ec_lang['lpn_mixing_lifo']='LIFO پلگ فلو';
$ec_lang['lpn_mixing_fraction']='مکسنگ فریکشن';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='ٹینک کے حجم کا وہ حصہ جو انلیٹ زون گھیرتا ہے، 0 اور 1 کے درمیان۔ صرف ٹو-کمپارٹمنٹ مکسنگ اسے استعمال کرتی ہے۔ اسے خالی چھوڑیں تو پورا ٹینک انلیٹ زون بن جاتا ہے، جو EPANET کا مفروضہ ہے۔';
$ec_lang['lpn_reaction_bulk']='بلک ری ایکشن گتانک';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='پانی کے مرکزی حصے میں رد عمل (EPANET ہیلپ دیکھیں)، ہر اس پائپ اور ٹینک کے لیے استعمال ہوتا ہے جس کا اپنا گتانک نہ ہو۔ منفی عدد کیمیکل کو کم کرتا ہے اور مثبت عدد بڑھاتا ہے۔ خالی کا مطلب کوئی بلک رد عمل نہیں۔';
$ec_lang['lpn_reaction_wall']='وال ری ایکشن گتانک';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='پائپ کی دیوار پر رد عمل، ہر اس پائپ کے لیے استعمال ہوتا ہے جو اپنا نہیں رکھتا۔ منفی عدد کیمیکل کو کم کرتا ہے۔ رد عمل فرسٹ آرڈر ہوتا ہے جب تک درآمد شدہ EPANET فائل کوئی اور آرڈر بیان نہ کرے، اس لیے گتانک فی دن ایک طوالت ہے، پراجیکٹ کی طوالت یونٹ میں لکھی گئی۔ خالی خانے کا مطلب کوئی وال ری ایکشن نہیں۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='یہ پائپ خود اپنے لیے۔ اسے خالی چھوڑیں تو پائپ ترتیبات، پانی کا معیار کے تحت پورے نیٹ ورک کے لیے مقرر کردہ گتانک استعمال کرتا ہے۔';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='ری ایکشن گتانک';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='اس ٹینک میں رکھے گئے پانی میں رد عمل، 1/day میں ایک شرح کے طور پر۔ منفی عدد کیمیکل کو کم کرتا ہے اور مثبت عدد اسے بڑھاتا ہے۔ پانی کسی بھی پائپ کے مقابلے میں ٹینک میں کہیں زیادہ دیر ٹھہرتا ہے، اس لیے اکثر یہیں ریزیجوول ضائع ہوتا ہے۔ اسے خالی چھوڑیں تو ٹینک ترتیبات، پانی کا معیار کے تحت پورے نیٹ ورک کے لیے مقرر کردہ بلک ری ایکشن گتانک استعمال کرتا ہے۔';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='بلک ری ایکشن';
$ec_lang['lpn_reaction_wall_short']='وال ری ایکشن';
$ec_lang['lpn_reaction_tank_short']='ری ایکشن';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/دن';
$ec_lang['lpn_reaction_day']='دن';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='بلک ری ایکشن آرڈر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='وہ اقتدار جس تک پانی کے حجم میں ردعمل کے لیے ارتکاز اٹھایا جاتا ہے۔ کوئی بھی حقیقی عدد قابل قبول ہے۔ 1 طے شدہ قدر ہے اور زیادہ تر کلورین کے زوال کے ماڈلنگ کے لیے استعمال ہوتی ہے۔ 0 شرح کو اس بات سے آزاد بنا دیتا ہے کہ وہاں کتنا کیمیکل موجود ہے۔';
$ec_lang['lpn_reaction_order_tank']='ٹینک ری ایکشن آرڈر';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='وہ اقتدار جس تک ٹینک میں رکھے پانی میں ردعمل کے لیے ارتکاز اٹھایا جاتا ہے، بلک ری ایکشن آرڈر سے الگ تاکہ ٹینک پائپوں سے مختلف آرڈر پر ردعمل ظاہر کر سکے۔ کوئی بھی حقیقی عدد قابل قبول ہے، اور 1 طے شدہ ہے۔ EPANET اسے فائل میں ORDER TANK کے طور پر بیان کرتا ہے اور اپنے انٹرفیس میں اس کے لیے کوئی خانہ نہیں دیتا۔';
$ec_lang['lpn_reaction_order_wall']='دیوار ری ایکشن آرڈر';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 کا مطلب ہے کہ دیوار کا ردعمل دیے گئے گتانک (گتانکوں) کے مطابق ہوتا ہے۔ 0 کا مطلب ہے کہ نہیں ہوتا۔ یہ ایک آن اور آف سوئچ ہے۔ طے شدہ قدر 1 ہے۔';
$ec_lang['lpn_reaction_order_zero']='0، صفر آرڈر';
$ec_lang['lpn_reaction_order_first']='1، پہلا آرڈر';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='محدود کن صلاحیت';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='ایک ارتکاز جس کی طرف کیمیکل بڑھتا ہے بجائے اس کے کہ صفر تک زوال پذیر ہو یا بلا حد بڑھتا رہے۔ جیسے جیسے پانی اس تک پہنچتا ہے ردعمل سست ہوتا جاتا ہے اور وہیں رک جاتا ہے۔ مستقل یونٹس استعمال کریں۔ خالی چھوڑنے پر کوئی حد نہیں۔';
$ec_lang['lpn_reaction_rough_corr']='کھردرا پن ارتباط';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='دیوار کے ردعمل کو ہر پائپ کے اپنے کھردرے پن سے جوڑتا ہے، تاکہ زیادہ کھردرا پائپ تیزی سے ردعمل ظاہر کرے۔ جب یہ مقرر ہو تو ہر پائپ کے لیے اس کے کھردرے پن سے ایک دیوار کا گتانک نکالا جاتا ہے، اور اوپر دیا گیا واحد دیوار گتانک مزید استعمال نہیں ہوتا۔ خالی چھوڑنے پر استعمال نہیں ہوتا۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='یہ صفحہ اپنا کوئی ری ایکشن گتانک پیش نہیں کرتا۔ اس کے لیے کوئی معیاری ٹیسٹ موجود نہیں، اور ایک ہی قسم کے پانی کے لیے شائع شدہ فیلڈ قدریں دس گنا تک مختلف ہوتی ہیں، اس لیے یہاں دیا گیا کوئی عدد ایک سفارش کے طور پر پڑھا جائے گا۔ یا تو کوئی ناپی گئی قدر درج کریں یا کوئی حوالہ دے سکنے والی قدر، یا ایسے کیمیکل کے لیے جو رد عمل ظاہر نہیں کرتا خانے خالی چھوڑ دیں۔';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='توانائی';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='رپورٹس';
// Edited by TGH 2026-09-07
// Row label only (the box title is lpn_time_run_report). Tom, 2026-10-07: no row carries '(EPANET)';
// the tips say where a report comes from. Run is EPANET's verbatim report.
$ec_lang['lpn_reports_epanet']='رن';
$ec_lang['lpn_energy_title']='پمپ توانائی رپورٹ';
$ec_lang['lpn_energy_menu']='پمپ توانائی';
$ec_lang['lpn_energy_efficiency']='پمپ افادیت (فیصد)';
$ec_lang['lpn_energy_efficiency_tip']='وائر-ٹو-واٹر افادیت جو ہر اس پمپ کے لیے استعمال ہوتی ہے جو اپنا افادیت وکر نہیں رکھتا۔ کچھ بیان نہ ہونے پر EPANET 75 فیصد استعمال کرتا ہے۔';
$ec_lang['lpn_energy_price']='بجلی کی قیمت';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='ایک کلو واٹ گھنٹے کی لاگت۔ یہ ہر اس پمپ پر لاگو ہوتی ہے جس کی اپنی قیمت نہیں۔ خالی کا مطلب 0 ہے۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='اس پمپ پر ایک کلو واٹ گھنٹے کی لاگت۔ خالی کا مطلب ہے کہ ترتیبات، توانائی کے تحت پورے نیٹ ورک کے لیے مقرر کردہ قیمت استعمال کی جائے۔';
$ec_lang['lpn_energy_price_pattern']='قیمت پیٹرن';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='ایک پیٹرن جو ہر پیٹرن مرحلے پر قیمت کو ضرب دیتا ہے، جو آف-پیک ریٹ بیان کرنے کا طریقہ ہے۔ پوری رن میں ایک ہی قیمت کے لیے اسے خالی چھوڑیں۔';
$ec_lang['lpn_energy_demand_charge']='پیک ڈیمانڈ چارج';
$ec_lang['lpn_energy_demand_charge_tip']='فی kW، پمپوں کی طلب کردہ پیک لوڈ کے لیے';
$ec_lang['lpn_energy_currency']='کرنسی';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='ہر لاگت کی قدر کے ساتھ چھپنے والا متن۔ یہ صرف ایک لیبل ہے؛ پورے حساب میں ایک ہی کرنسی استعمال کریں۔';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='یہ صفحہ اپنی کوئی قیمت پیش نہیں کرتا۔ بجلی کی قیمت یوٹیلٹی، ملک، وقت اور سال پر منحصر ہوتی ہے، اس لیے یہاں دیا گیا کوئی عدد ایک سفارش کے طور پر پڑھا جائے گا۔ اپنے ٹیرف سے قیمت درج کریں۔';
$ec_lang['lpn_energy_needs_run']='پمپ توانائی رن کے دوران طاقت کا مجموعہ ہے، اس لیے اسے وقتی دورانیے کی سمولیشن درکار ہے: EPANET انجن اور کل چلنے کا وقت۔ ترتیبات، حساب کتاب، وقت میں کل چلنے کا وقت مقرر کریں، حل کریں بٹن دبائیں، پھر پانی، رپورٹس، پمپ توانائی کھولیں۔';
$ec_lang['lpn_energy_no_pumps']='اس نیٹ ورک میں کوئی پمپ نہیں، اس لیے کچھ بھی طاقت نہیں کھینچ رہا۔';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='منظرنامہ موازنہ';
$ec_lang['lpn_scncmp_menu_tip']='منظرناموں کا جدول، اپنی قدروں کی تعداد، سب سے کم دباؤ اور سب سے زیادہ رفتار کے ساتھ';
$ec_lang['lpn_scncmp_running']='ہر منظرنامہ حل کیا جا رہا ہے…';
$ec_lang['lpn_scncmp_empty']='ابھی تک کچھ نہیں کھینچا گیا، اس لیے حل کرنے کو کچھ نہیں۔';
$ec_lang['lpn_scncmp_col_maxvelocity']='سب سے زیادہ رفتار';
$ec_lang['lpn_scncmp_at']='{id} پر {value}';
$ec_lang['lpn_scncmp_at_time']='{id} پر {value}، {time}';
$ec_lang['lpn_scncmp_same']='ہر منظرنامے میں یکساں';
$ec_lang['lpn_scncmp_period_note']='جہاں منظرنامے کا کل رن ٹائم مقرر ہو، وہاں اس کا کم سے کم دباؤ اور زیادہ سے زیادہ رفتار پورے نیٹ ورک کی انتہائی قدریں ہیں، دکھائے گئے وقت پر۔';
$ec_lang['lpn_scncmp_current']='(فی الحال کھلا ہوا)';
$ec_lang['lpn_scncmp_note']='ہر منظرنامہ ڈرائنگ کی ایک کاپی سے حل کیا جاتا ہے۔ یہاں کچھ بھی پراجیکٹ کو نہیں بدلتا، اور جس منظرنامے پر آپ کام کر رہے ہیں وہ ویسے ہی چھوڑ دیا جاتا ہے۔';
$ec_lang['lpn_energy_over']='{time} کی وقتی دورانیے کی سمولیشن کے لیے';
$ec_lang['lpn_energy_col_pump']='پمپ';
$ec_lang['lpn_energy_col_running']='% رن';
$ec_lang['lpn_energy_col_effic']='افادیت';
$ec_lang['lpn_energy_col_avg_kw']='اوسط kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='اس پمپ کے چلنے کے دوران استعمال ہونے والی اوسط طاقت۔ یہ خالی اوقات پر اوسط نہیں نکالی جاتی، اس لیے وہ پمپ جو وقتی دورانیے کی سمولیشن کے زیادہ تر حصے میں خالی رہا اب بھی وہی طاقت رپورٹ کرتا ہے جو اس نے چلتے وقت استعمال کی۔';
$ec_lang['lpn_energy_col_peak_kw']='پیک kW';
$ec_lang['lpn_energy_col_cost']='لاگت';
$ec_lang['lpn_energy_total_kwh']='استعمال شدہ توانائی';
$ec_lang['lpn_energy_total_energy_cost']='توانائی کی لاگت';
$ec_lang['lpn_energy_peak_kw']='پیک طاقت استعمال';
$ec_lang['lpn_energy_total_demand_charge']='پیک ڈیمانڈ کی لاگت';
$ec_lang['lpn_energy_total_cost']='کل لاگت';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW AND THE BOX TITLE BOTH SAY "Status changes"** (Tom, 2026-10-07), so menu and box agree.
$ec_lang['lpn_reports_status']='حالت میں تبدیلیاں';
$ec_lang['lpn_reports_status_tip']='آخری توسیعی دورانیے کی سمولیشن کے EPANET ٹائم اسٹیپس سے پڑھی گئی حالت کی تبدیلیوں کا ترتیب وار جدول: پمپوں اور والوز کا کھلنا یا بند ہونا، ٹینکوں کا بھرنا، خالی ہونا، بھر جانا یا خشک ہو جانا، اور وہ مراحل جو مکمل طور پر ہم آہنگ نہیں ہوئے۔';
$ec_lang['lpn_status_title']='حالت میں تبدیلیاں';
$ec_lang['lpn_status_needs_run']='حالت رپورٹ فہرست دیتی ہے کہ توسیعی دورانیے کی سمولیشن کے دوران کیا بدلا۔ ترتیبات، حساب، وقت میں کل رن ٹائم مقرر کریں، حل کریں دبائیں، پھر پانی، رپورٹس، حالت میں تبدیلیاں کھولیں۔';
$ec_lang['lpn_status_empty']='اس رن کے دوران کسی چیز کی حالت نہیں بدلی۔';
$ec_lang['lpn_status_col_event']='واقعہ';
$ec_lang['lpn_status_opened']='{type} {id} اب کھل گیا';
$ec_lang['lpn_status_closed']='{type} {id} اب بند ہو گیا';
$ec_lang['lpn_status_filling']='{type} {id} اب بھر رہا ہے';
$ec_lang['lpn_status_emptying']='{type} {id} اب خالی ہو رہا ہے';
$ec_lang['lpn_status_full']='{type} {id} اب بھر گیا ہے';
$ec_lang['lpn_status_dry']='{type} {id} اب خالی ہے';
$ec_lang['lpn_status_no_converge']='اس مرحلے پر ہائیڈرالک حل مکمل طور پر ہم آہنگ نہیں ہوا؛ دکھائے گئے عدد اس کی آخری کوشش کے ہیں۔';
$ec_lang['lpn_status_note']='جدولوں کے پینل اور مکمل رپورٹ جیسی ہی توسیعی دورانیے کی رن سے پڑھا جاتا ہے۔ صرف تبدیلی درج کی جاتی ہے، ہر مرحلہ نہیں۔';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='مکمل';
$ec_lang['lpn_reports_full_tip']='آخری رن کے ہر رپورٹنگ ٹائم اسٹیپ پر تمام نوڈز اور لنکس کا جدول';
$ec_lang['lpn_full_title']='مکمل رپورٹ';
$ec_lang['lpn_full_needs_run']='مکمل رپورٹ ہر رپورٹنگ وقتی مرحلے پر ہر نوڈ اور ہر لنک کی فہرست دیتی ہے۔ حل کریں دبائیں، پھر پانی، رپورٹس، مکمل رپورٹ کھولیں۔';
$ec_lang['lpn_full_note']='فی نوڈ یا لنک، فی رپورٹنگ وقتی مرحلہ ایک قطار، جدولوں کے پینل پر دکھائے گئے یونٹس میں۔ خالی سیل وہ کالم ہے جس میں وہ مقدار نہیں ہوتی۔ ڈاؤن لوڈ یا پرنٹ ہر وقتی مرحلہ لے جاتا ہے؛ نیچے دیا گیا جدول ایک وقت میں ایک دکھاتا ہے۔';
$ec_lang['lpn_full_step_label']='وقتی مرحلہ';
$ec_lang['lpn_full_download_csv']='CSV ڈاؤن لوڈ کریں';
$ec_lang['lpn_full_print']='رپورٹ پرنٹ کریں';
$ec_lang['lpn_full_col_time']='وقت';
$ec_lang['lpn_full_col_type']='قسم';
$ec_lang['lpn_heading_unit']='{label} ({unit})';
$ec_lang['lpn_result_concentration_short']='ارتکاز';
$ec_lang['lpn_quality_named_concentration_short']='{chemical} ارتکاز';
$ec_lang['lpn_full_row_count']='قطاریں ({n})۔';

// ---- The Calibration report (ROADMAP Task 601) -------------------------------------------------
// EPANET's Report > Calibration and its three tabbed pages, with EPANET's own column names (EPANET
// 2.2 manual, section 9.6). Mean error is EPANET's term for the mean ABSOLUTE difference. "Num obs"
// is EPANET's own column heading, kept short because results columns are narrow.
// lpn_calib_missing: keep in step with feat/profile-file's lpn_profile_file_missing (Task 604), the same sentence.
$ec_lang['lpn_reports_calib']='کیلیبریشن';
$ec_lang['lpn_reports_calib_tip']='کیلیبریشن فائل میں ناپے گئے میدانی ڈیٹا کا آخری رن سے موازنہ کریں: اعداد و شمار، ایک ارتباطی پلاٹ، اور اوسطوں کا موازنہ۔';
$ec_lang['lpn_calib_title']='کیلیبریشن رپورٹ';
$ec_lang['lpn_calib_param']='پیرامیٹر';
$ec_lang['lpn_calib_param_tip']='وہ مقدار جسے کیلیبریشن فائل ناپتی ہے۔ ہر پیرامیٹر کے لیے ایک فائل رکھی جاتی ہے۔';
$ec_lang['lpn_calib_load']='کیلیبریشن فائل لوڈ کریں…';
$ec_lang['lpn_calib_load_tip']='ایک متنی فائل جس کی ہر سطر میں مقام کی ID، وقت، اور ناپی گئی قدر ہو۔ وقت سمولیشن کے آغاز سے اعشاری گھنٹوں یا گھنٹے:منٹ میں ناپا جاتا ہے۔ سیمی کولن سے تبصرہ شروع ہوتا ہے۔ جس سطر میں صرف وقت اور قدر ہو وہ اوپر والے مقام سے تعلق رکھتی ہے۔';
$ec_lang['lpn_calib_none']='اس پیرامیٹر کے لیے کوئی کیلیبریشن فائل لوڈ نہیں ہے۔';
$ec_lang['lpn_calib_session']='کیلیبریشن فائل صرف اسی سیشن کے لیے رکھی جاتی ہے۔ یہ پراجیکٹ کے ساتھ یا اس آلے پر محفوظ نہیں کی جاتی۔';
$ec_lang['lpn_calib_file']='{file}: مقامات ({m}) پر پیمائشیں ({n})۔';
$ec_lang['lpn_calib_units']='فائل کی قدریں اس پراجیکٹ کے یونٹس میں پڑھی جاتی ہیں: {unit}۔';
$ec_lang['lpn_calib_missing']='فائل میں مذکور لیکن اس نیٹ ورک میں موجود نہیں: {ids}۔';
$ec_lang['lpn_calib_missing_count']='وہ پیمائشیں جو چھوڑ دی گئیں کیونکہ ان کا مقام اس نیٹ ورک میں نہیں: {n}۔';
$ec_lang['lpn_calib_bad_lines']='وہ سطریں جو پڑھی نہ جا سکیں، چھوڑ دی گئیں: {lines}';
$ec_lang['lpn_calib_outside']='وہ پیمائشیں جو اس رن کے رپورٹ کیے گئے اوقات سے باہر ہیں، چھوڑ دی گئیں: {n}۔';
$ec_lang['lpn_calib_no_value']='وہ پیمائشیں جن کے وقت پر کوئی حساب شدہ قدر نہیں، چھوڑ دی گئیں: {n}۔';
$ec_lang['lpn_calib_single']='یہ ایک دورانیے کا رن ہے، اس لیے ہر پیمائش کا موازنہ اس کے واحد نتیجے سے کیا جاتا ہے، فائل جو بھی وقت دے۔';
$ec_lang['lpn_calib_needs_run']='ابھی موازنے کے لیے کوئی نتائج نہیں۔ نیٹ ورک کا حساب ہو جانے پر رپورٹ بھر جاتی ہے۔';
$ec_lang['lpn_calib_no_pairs']='کسی پیمائش کا موازنہ نہیں ہو سکا، اس لیے پلاٹ کرنے کو کچھ نہیں۔';
$ec_lang['lpn_calib_tab_stats']='اعداد و شمار';
$ec_lang['lpn_calib_tab_corr']='ارتباطی پلاٹ';
$ec_lang['lpn_calib_tab_means']='اوسطوں کا موازنہ';
$ec_lang['lpn_calib_col_location']='مقام';
$ec_lang['lpn_calib_col_n']='مشاہدات کی تعداد';
$ec_lang['lpn_calib_col_obs_mean']='مشاہداتی اوسط';
$ec_lang['lpn_calib_col_sim_mean']='حساب شدہ اوسط';
$ec_lang['lpn_calib_col_mean_err']='اوسط غلطی';
$ec_lang['lpn_calib_col_mean_err_tip']='ہر مشاہداتی قدر اور اسی وقت کی حساب شدہ قدر کے درمیان مطلق فرق کا اوسط۔';
$ec_lang['lpn_calib_col_rms_err']='RMS غلطی';
$ec_lang['lpn_calib_col_rms_err_tip']='جذر اوسط مربع غلطی: مشاہداتی اور حساب شدہ قدروں کے فرق کے مربعوں کے اوسط کا جذر۔';
$ec_lang['lpn_calib_network']='نیٹ ورک';
$ec_lang['lpn_calib_corr_means']='اوسطوں کے درمیان ارتباط: {r}';
$ec_lang['lpn_calib_corr_none']='اوسطوں کے درمیان ارتباط: اس کے لیے کم از کم دو مقامات چاہییں جن کے اوسط مختلف ہوں۔';
$ec_lang['lpn_calib_axis_obs']='مشاہداتی: {q}';
$ec_lang['lpn_calib_axis_sim']='حساب شدہ: {q}';
$ec_lang['lpn_calib_observed']='مشاہداتی';
$ec_lang['lpn_calib_computed']='حساب شدہ';
$ec_lang['lpn_calib_point']='{id}، {time}: مشاہداتی {o}، حساب شدہ {s}';
$ec_lang['lpn_calib_corr_note']='ہر نقطہ ایک پیمائش ہے۔ نقطے جتنے قطری لکیر کے قریب ہوں گے، حساب شدہ قدریں مشاہداتی قدروں سے اتنی ہی قریب ہوں گی۔';
$ec_lang['lpn_calib_ts_point']='{id} پر ناپا گیا، {time}: {v}';
$ec_lang['lpn_calib_ts_note']='حلقے کیلیبریشن فائل کی ناپی گئی قدریں ہیں۔';
$ec_lang['lpn_energy_no_price']='بجلی کی کوئی قیمت بیان نہیں کی گئی، اس لیے یہاں ہر لاگت صفر ہے۔ ترتیبات، توانائی کے تحت ایک قیمت مقرر کریں۔';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='یہ نیٹ ورک صفر کی قیمت بیان کرتا ہے، اس لیے یہاں ہر لاگت صفر ہے۔ اسے ترتیبات، توانائی کے تحت بدلیں۔';
$ec_lang['lpn_energy_curve_note']='یہ پمپ ایک ایسے افادیت وکر کا حوالہ دیتے ہیں جس میں کوئی پوائنٹ نہیں: {ids}۔ یہ پورے نیٹ ورک کے لیے مقرر کردہ افادیت پر چلے۔';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
$ec_lang['lpn_labels_col_decimals_example']='0.000';
$ec_lang['lpn_labels_col_drop']='حذف';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='نوڈ اور لنک';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='مساوی وقفہ';
$ec_lang['lpn_color_mode_quantile']='کوانٹائل (مساوی تعداد)';
$ec_lang['lpn_color_mode_jenks']='قدرتی وقفے (Jenks)';
$ec_lang['lpn_color_mode_stddev']='معیاری انحراف';
$ec_lang['lpn_color_mode_pretty']='خوبصورت (گول اعداد)';
$ec_lang['lpn_color_mode_log']='لوگارتھمک';
$ec_lang['lpn_color_mode_manual']='دستی';

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
$ec_lang['lpn_library_menu']='لائبریریاں';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='پیٹرن';
// **THE SYNONYMS ARE TOM'S OWN, GIVEN 2026-08-24**, which is the written permission this array
// requires. "Pattern" is the discipline's standard term and stays the label; the payload exists so
// a translator who cannot recover the concept from that one word has the shape of it.
//
// "Run" was on his list and he struck it the same day, on the collision: this page's Run is the
// button that plays an extended-period simulation back, so a translator reaching for their word for
// a program run would have named the wrong thing. Tom: *"Yes. It's not the best term."*
$ec_lang['lpn_library_patterns_tip']='پیٹرن مضاعفوں کی ایک فہرست ہے جو دہراتی ہے۔ ہر ایک ایک پیٹرن وقفے پر لاگو ہوتا ہے، اس لیے ایک گھنٹے کے وقفے پر 24 اعداد ایک ایسا دن بناتے ہیں جو دہراتا رہتا ہے۔ 1.5 کے مضاعف کے ساتھ 10 کی طلب اس لمحے 15 ہو جاتی ہے۔';
$ec_lang['lpn_library_curves']='وکر';
$ec_lang['lpn_library_curves_tip']='پمپ ہیڈ یا افادیت بمقابلہ بہاؤ، والو نقصان بمقابلہ بہاؤ، یا ٹینک حجم بمقابلہ گہرائی';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='وکر پمپوں اور والوز سے منسلک ہوتے ہیں۔ پمپ ہیڈ وکر کے لیے رن دکھائے گئے پوائنٹس کے ذریعے فٹ کیا گیا وکر استعمال کرتا ہے؛ ہر دوسری قسم کے لیے یہ پوائنٹس کو دکھائی گئی سیدھی لکیروں سے جوڑتا ہے۔';
$ec_lang['lpn_library_curve_add']='ایک وکر شامل کریں';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='وکر کی قسم';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='مساوات';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='پوائنٹس کے ذریعے فٹ کیا گیا وکر، اور نیچے پلاٹ پر کھینچی گئی لکیر۔ یہ ہر بار دکھائے جانے پر پوائنٹس سے نکالا جاتا ہے اور کبھی محفوظ نہیں کیا جاتا، اور اس کے عدد اسی یونٹ میں ہیں جو اوپر دیا گیا جدول دکھاتا ہے۔ بلٹ اِن حل کار اسی مساوات پر چلتا ہے؛ EPANET انجن خود پوائنٹس پڑھتا ہے۔';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='سپریڈ شیٹ میں ایک یا دو کالم منتخب کریں، انہیں کاپی کریں، اور پہلے ہدف سیل میں پیسٹ کریں۔ ضرورت کے مطابق قطاریں شامل ہوتی ہیں۔ EPANET فائل سے سیدھی کاپی کی گئی سطریں، وکر کے نام سمیت، بھی پیسٹ کی جا سکتی ہیں۔';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_remove_point']='یہ پوائنٹ ہٹائیں';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='پوائنٹس کاپی کریں';
$ec_lang['lpn_library_curve_copy_tip']='ہر پوائنٹ کو دو کالموں کے طور پر کاپی کریں، سپریڈ شیٹ میں پیسٹ کرنے کے لیے تیار۔';
$ec_lang['lpn_library_curve_copy_manual']='یہ پوائنٹس کاپی کریں';
$ec_lang['lpn_library_curve_used_by']='اس وکر کو استعمال کرنے والے عناصر';
$ec_lang['lpn_library_curve_unused']='کچھ بھی یہ وکر استعمال نہیں کرتا۔';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='یہ وکر عناصر ({count}) استعمال کرتے ہیں: {ids}۔ پہلے ان کے لیے کوئی اور وکر مقرر کریں، پھر اسے حذف کریں۔';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='پائپ کی اقسام';
$ec_lang['lpn_library_pipetypes_tip']='پائپ کی قسم ایک تعریف ہے جس کا حوالہ کئی پائپ اپنے قطر، کھردرے پن اور ردعمل گتانکوں کے لیے دے سکتے ہیں۔ تعریف میں ترمیم کرنے سے وہ ہر پائپ ترمیم ہو جاتا ہے جو اسے استعمال کرتا ہے۔';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='ہر پراجیکٹ کی ایک الگ پائپ قسم لائبریری ہوتی ہے۔ پائپ قسم کی تعریف میں خصوصیات خالی چھوڑی جا سکتی ہیں؛ مثلاً پائپ قسم کھردرا پن بتا سکتی ہے اور قطر نہیں۔ پائپ اقسام پائپ کی خصوصیات میں پائپوں کو تفویض کی جاتی ہیں۔ یہاں تعریف میں ترمیم کرنے سے ہر وہ پائپ بدل جاتا ہے جو اس کا حوالہ دیتا ہے۔';
$ec_lang['lpn_library_pipetype_add']='پائپ کی قسم شامل کریں';
$ec_lang['lpn_library_pipetype_blank_tip']='پائپ کی قسم کی تعریف میں خالی خصوصیات ہر پائپ کے لیے الگ الگ درج کرنے کے لیے چھوڑ دی جاتی ہیں۔';
$ec_lang['lpn_library_pipetype_used_by']='اس قسم کو استعمال کرنے والے پائپ';
$ec_lang['lpn_library_pipetype_unused']='کچھ بھی یہ پائپ کی قسم استعمال نہیں کرتا۔';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='یہ پائپ کی قسم پائپوں ({count}) کے ذریعے استعمال ہو رہی ہے: {ids}۔ اسے حذف کرنے سے پہلے ان سے الگ کریں۔';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='پائپ کی قسم';
$ec_lang['lpn_field_pipetype_tip']='پراجیکٹ لائبریری میں پائپ کی قسم جو یہ پائپ استعمال کرتا ہے۔ پائپ کی قسم میں شامل خصوصیات یہاں ترمیم کے لیے غیر فعال ہیں۔ یہاں ترمیم فعال کرنے کے لیے پائپ کی قسم سے الگ کریں۔';
$ec_lang['lpn_pipetype_none']='کوئی پائپ کی قسم نہیں چنی گئی';
$ec_lang['lpn_pipetype_detach']='پائپ کی قسم سے الگ کریں';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='وہ قدریں جو یہ پائپ اپنی قسم سے پڑھتا ہے پائپ میں کاپی کریں اور قسم کا استعمال بند کریں۔ پائپ کی قدریں ابھی نہیں بدلتیں، اور اب سے یہ قدریں یہیں ایڈٹ کی جاتی ہیں۔';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='فٹنگز';
$ec_lang['lpn_library_fittings_tip']='معمولی (مقامی) نقصان گتانک والی فٹنگز، فہرستوں میں گروپ کی گئی';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='ہر پراجیکٹ کی اپنی فٹنگز لائبریری ہوتی ہے۔ فٹنگز کی فہرست میں ہر فٹنگ کی ایک مقدار ہوتی ہے، اور یہ ایک ہی معمولی (مقامی) نقصان گتانک تک جمع ہوتی ہے۔ پائپ اور پائپ کی اقسام دونوں کسی فہرست کا حوالہ دے سکتے ہیں۔';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='یہاں پیش کی گئی فٹنگز EPANET 2.2 صارف دستی کے جدول 3.3 کی تیرہ فٹنگز ہیں۔ ایک چننے سے اس کا گتانک قطار میں کاپی ہو جاتا ہے، جہاں اسے بدلا جا سکتا ہے۔ گتانک فٹنگ کے سائز اور ساخت پر منحصر ہوتا ہے، اس لیے جدول کو آغاز کا نقطہ سمجھیں، حتمی قدریں نہیں۔';
$ec_lang['lpn_library_fittings_add']='فٹنگز کی فہرست شامل کریں';
$ec_lang['lpn_library_fittings_used_by']='اس فٹنگز کی فہرست کو استعمال کرنے والے پائپ';
$ec_lang['lpn_library_fittings_unused']='کچھ بھی یہ فٹنگز کی فہرست استعمال نہیں کرتا۔';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='یہ فٹنگز کی فہرست پائپوں ({count}) کے ذریعے استعمال ہو رہی ہے: {ids}۔ اسے حذف کرنے سے پہلے ان سے الگ کریں۔';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='لائبریریاں درآمد کریں…';
$ec_lang['lpn_library_import_tip']='کوئی اور پراجیکٹ فائل منتخب کریں اور اس سے پوری لائبریریاں اس پراجیکٹ میں کاپی کریں۔ جس چیز کا نام یہاں پہلے سے لیا جا چکا ہے اسے چھوڑ دیا جاتا ہے اور فہرست کیا جاتا ہے، اس لیے آپ کے پاس پہلے سے موجود کچھ بھی تبدیل نہیں ہوتا۔';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='{file} سے کاپی کرنے کے لیے منتخب کریں';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='آپ جو بھی لائبریری چیک کریں وہ پوری کاپی ہو جاتی ہے۔ بعد میں جو نہیں چاہیے اسے اسی طرح حذف کریں جیسے کوئی اور اندراج حذف کرتے ہیں۔';
$ec_lang['lpn_library_import_go']='درآمد کریں';
$ec_lang['lpn_library_import_no_libraries']='اس پراجیکٹ فائل میں کاپی کرنے کے لیے کوئی لائبریری نہیں۔';
$ec_lang['lpn_library_import_heading']='{file} سے درآمد کیا گیا';
$ec_lang['lpn_library_import_added']='کاپی کیا گیا: {names}';
$ec_lang['lpn_library_import_conflict']='چھوڑ دیا گیا، کیونکہ اس پراجیکٹ میں پہلے سے اسی نام کا ایک موجود ہے: {names}۔ یہاں کچھ تبدیل نہیں کیا گیا۔ اگر آپ دونوں چاہتے ہیں تو کسی ایک کا نام بدل کر دوبارہ درآمد کریں۔';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='اس پراجیکٹ فائل میں ان میں سے کاپی کرنے کو کچھ نہیں۔';
$ec_lang['lpn_library_import_curve_shape']='یہ وکر بالکل ویسے ہی آئے جیسے فائل نے انہیں لکھا، اور کوئی رن اس وقت تک کسی کو استعمال نہیں کر سکتا جب تک اس کا پہلا کالم ایک نقطے سے دوسرے تک بڑھتا نہ رہے: {names}';
$ec_lang['lpn_library_import_needs_fittings']='یہ پائپ اقسام ایسی فٹنگز فہرست کا حوالہ دیتی ہیں جو اس پراجیکٹ میں نہیں ہے: {names}۔ ان حوالوں کو حل کرنے کے لیے اسی فائل سے فٹنگز لائبریری درآمد کریں۔';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='خبردار: یونٹس مماثل نہیں۔ جیسے ہیں ویسے ہی درآمد ہوں گے۔ تجویز نہیں کی جاتی۔';
$ec_lang['lpn_library_import_units_line']='{name}: یہ پراجیکٹ {mine} دکھاتا ہے، فائل {theirs} دکھاتی ہے۔';
$ec_lang['lpn_fitting_qty']='مقدار';
$ec_lang['lpn_fitting_name']='فٹنگ';
$ec_lang['lpn_fitting_k']='گتانک';
$ec_lang['lpn_fitting_add']='فٹنگ شامل کریں';
$ec_lang['lpn_fitting_remove']='ہٹائیں';
$ec_lang['lpn_fitting_total']='کل معمولی (مقامی) نقصان گتانک، k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='فٹنگز کی فہرست';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='پراجیکٹ لائبریری سے فٹنگز کی ایک فہرست۔ اس کی مقداریں اور گتانک اس پائپ کے معمولی (مقامی) نقصان گتانک میں جمع ہو جاتے ہیں، اور پھر گتانک کا خانہ صرف پڑھنے کے لیے رہ جاتا ہے۔ خود گتانک درج کرنے کے لیے کوئی فہرست نہ چنیں۔';
$ec_lang['lpn_fittings_none']='کوئی فٹنگز کی فہرست نہیں چنی گئی';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='گلوب والو، مکمل کھلا';
$ec_lang['lpn_fitting_angle']='اینگل والو، مکمل کھلا';
$ec_lang['lpn_fitting_swingcheck']='سوئنگ چیک والو، مکمل کھلا';
$ec_lang['lpn_fitting_gate']='گیٹ والو، مکمل کھلا';
$ec_lang['lpn_fitting_elbow_short']='مختصر رداس کہنی';
$ec_lang['lpn_fitting_elbow_medium']='درمیانی رداس کہنی';
$ec_lang['lpn_fitting_elbow_long']='لمبی رداس کہنی';
$ec_lang['lpn_fitting_elbow_45']='45 درجے کی کہنی';
$ec_lang['lpn_fitting_return_bend']='بند واپسی موڑ';
$ec_lang['lpn_fitting_tee_run']='معیاری ٹی، رن کے ذریعے بہاؤ';
$ec_lang['lpn_fitting_tee_branch']='معیاری ٹی، شاخ کے ذریعے بہاؤ';
$ec_lang['lpn_fitting_entrance']='مربع داخلی راستہ';
// Tom, 2026-09-30, ruling sprint 2026-09-30-golf item 1: _syn = "All junctions" / "Selected junctions".
$ec_lang['lpn_fitting_exit']='خارجی راستہ';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='دیگر فٹنگ';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_lead']='برآمد کی گئی EPANET فائل عددی طور پر اس پراجیکٹ کے مساوی ہے۔ لیکن اس میں درج ذیل چیزوں کے لیے کوئی جگہ نہیں ہے:';
$ec_lang['lpn_inp_export_flat_types']='یہاں پائپ ({n}) پائپ اقسام ({t}) کا حوالہ دیتے ہیں۔ فائل میں ان میں سے ہر پائپ اعداد کی اپنی کاپی رکھتا ہے، اس لیے جوابات وہی ہیں۔ فائل پائپ کی قسم خود نہیں رکھ سکتی، اس لیے ایک تعریف اور اسے استعمال کرنے والے ہر پائپ کے درمیان رابطہ صرف پراجیکٹ فائل میں درج ہوتا ہے۔';
$ec_lang['lpn_inp_export_flat_coords']='ایک EPANET فائل ہر نوڈ کے لیے ایک پوزیشن رکھتی ہے۔ یہ منظرنامہ ان میں سے {n} کو کہیں اور رکھتا ہے، اور یہی وہ پوزیشنیں ہیں جو فائل میں ہیں۔ ہر دوسرا منظرنامہ اپنی پوزیشنیں صرف آپ کی پراجیکٹ فائل میں رکھتا ہے۔';
$ec_lang['lpn_inp_export_flat_fittings']='EPANET فائل آپ کی پراجیکٹ فائل میں موجود کہنیوں، والوز اور ٹیز کی فہرست نہیں رکھ سکتی۔ یہاں پائپوں ({n}) کا معمولی نقصان گتانک ایک فٹنگز کی فہرست سے جمع کیا گیا ہے۔ کل عدد فائل میں بالکل ویسے ہی جاتا ہے جیسے کھڑا ہے، اس لیے جوابات کے بارے میں کچھ نہیں بدلتا۔';
$ec_lang['lpn_library_controls']='کنٹرولز';
$ec_lang['lpn_library_controls_tip']='کنٹرول ایک بیان ہے جو ٹینک کی پانی کی سطح، نوڈ کے دباؤ یا وقت کی بنیاد پر کسی لنک کو کھولتا یا بند کرتا ہے، یا اس کی سیٹنگ بدلتا ہے۔';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='ایک پیٹرن شامل کریں';
$ec_lang['lpn_library_pattern_values']='مضاعف';
$ec_lang['lpn_library_pattern_values_tip']='مضاعف، خالی جگہوں یا کوماز سے الگ کیے گئے۔ اگر آپ کے پاس سپریڈ شیٹ کا کالم ہے تو اسے پیسٹ کریں۔ یہ فہرست جتنی دیر رن جاری رہے دہراتی رہتی ہے، اس لیے اسے پورے رن کا احاطہ کرنے کی ضرورت نہیں۔';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='مضاعف ({n})، {step} کے فاصلے پر، {span} کا احاطہ کرتے ہوئے';
// Under the pattern graph, beside the clock-time row: the ordinal of each time period (1, 2, 3).
$ec_lang['lpn_library_pattern_axis_step']='اسٹیپ';
$ec_lang['lpn_library_pattern_none']='کوئی پیٹرن نہیں';
// The blank first option of a selector whose blank follows a project-wide default (a junction's or
// customer's demand pattern, a pump's price pattern and efficiency curve). Tom, 2026-10-04.
$ec_lang['lpn_choice_default']='پہلے سے مقررہ';
$ec_lang['lpn_settings_default_pattern']='پہلے سے مقررہ طلب پیٹرن';
$ec_lang['lpn_settings_default_pattern_tip']='ہر جنکشن جس کا کوئی پیٹرن نہ ہو یہی استعمال کرتا ہے۔';
$ec_lang['lpn_junction_pattern_unknown']='اس پراجیکٹ میں کسی پیٹرن کی ID {id} نہیں ہے، اس لیے جنکشن کو جیسا تھا ویسا ہی چھوڑ دیا گیا۔';
$ec_lang['lpn_settings_default_pattern_none']='کوئی نہیں (مستقل)';
$ec_lang['lpn_demand_pattern_default']='(پہلے سے مقررہ: {id})';
$ec_lang['lpn_demand_pattern_constant']='(مستقل)';
$ec_lang['lpn_library_pattern_default_mark']='(پہلے سے مقررہ)';
$ec_lang['lpn_library_pattern_default_tip']='پہلے سے مقررہ طلب پیٹرن۔ اسے ترتیبات، پہلے سے مقررہ طلب پیٹرن میں بدلیں۔';
$ec_lang['lpn_library_pattern_default_deleted_to']='پیٹرن {id} پہلے سے مقررہ طلب پیٹرن تھا۔ جن جنکشنز کا کوئی پیٹرن نہیں وہ اب پیٹرن {now} استعمال کرتے ہیں۔';
$ec_lang['lpn_library_pattern_default_deleted_none']='پیٹرن {id} پہلے سے مقررہ طلب پیٹرن تھا۔ جن جنکشنز کا کوئی پیٹرن نہیں وہ اب مستقل طلب استعمال کرتے ہیں۔';
$ec_lang['lpn_library_pattern_default_deleted_also']='وہ منظرنامے جو اسے اپنے ڈیفالٹ کے طور پر بھی استعمال کرتے تھے: {list}۔';
$ec_lang['lpn_library_pattern_default_deleted_in']='پیٹرن {id} ان منظرناموں میں ڈیفالٹ طلب پیٹرن تھا: {list}۔';
$ec_lang['lpn_library_control_add']='ایک کنٹرول شامل کریں';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='EPANET نحو استعمال کرتے ہوئے ایک سطر کا قاعدہ۔ پراجیکٹ کی مستقل اکائیاں استعمال کریں۔ کلیدی الفاظ انگریزی میں ہونے چاہئیں۔ مثالیں: LINK 12 CLOSED IF NODE 23 ABOVE 20 (لنک 12 بند ہو جائے گا جب ٹینک 23 کی سطح 20 فٹ سے تجاوز کرے)؛ LINK 12 OPEN IF NODE 130 BELOW 30 (لنک 12 کھل جائے گا اگر نوڈ 130 پر دباؤ 30 psi سے نیچے گرے)؛ LINK PUMP02 1.5 AT TIME 16 (پمپ PUMP02 کی نسبتی رفتار سمیولیشن میں 16 گھنٹے پر 1.5 پر مقرر کر دی جاتی ہے)؛ LINK 12 CLOSED AT CLOCKTIME 10 AM LINK 12 OPEN AT CLOCKTIME 8 PM (دو قواعد: لنک 12 پوری سمیولیشن کے دوران بار بار صبح 10 بجے بند اور شام 8 بجے کھولا جاتا ہے)';
$ec_lang['lpn_library_control_ok']='✓ سمجھ آ گیا';
$ec_lang['lpn_library_control_bad']='⚠ سمجھ نہیں آیا';
$ec_lang['lpn_library_control_missing']='⚠ اس نیٹ ورک میں {id} نام کی کوئی چیز نہیں';
$ec_lang['lpn_library_rules']='قواعد';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='قاعدہ کسی لنک کو کھولتا یا بند کرتا ہے، یا اس کی سیٹنگ بدلتا ہے، جب پانی کی سطح، دباؤ، بہاؤ یا وقت کسی مقررہ قدر تک پہنچے۔ قاعدہ ایک سے زیادہ شرط جانچ سکتا ہے اور شرط غلط ہونے پر کیا کرنا ہے یہ متعین کر سکتا ہے۔';
$ec_lang['lpn_library_rule_add']='ایک قاعدہ شامل کریں';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='ہر سطر میں ایک شق۔ "ALL CAPS" میں مثالوں کے ساتھ تفصیل آگے ہے۔ سطر 1: قاعدے کا نام، "RULE 1"۔ سطر 2: ایک شرط، "IF TANK 2 LEVEL BELOW 17.1"۔ سطر 3: ایک عمل، "THEN PUMP 9 STATUS IS OPEN"۔ سطر 4: ایک ترجیح، "PRIORITY 1"۔ ایک سے زیادہ شرط جانچنے کے لیے "AND" یا "OR" سطریں شامل کریں، اور شرط غلط ہونے پر عمل متعین کرنے کے لیے "ELSE" سطریں۔ شرط نوڈ پر LEVEL، HEAD، GRADE، PRESSURE یا DEMAND، لنک پر FLOW، STATUS یا SETTING، یا SYSTEM پر TIME اور CLOCKTIME پڑھ سکتی ہے۔ پراجیکٹ کی یکساں اکائیاں استعمال کریں۔ کلیدی الفاظ انگریزی میں ہونے چاہییں۔';
$ec_lang['lpn_library_rule_ok']='✓ یہ قاعدہ پڑھا گیا';
$ec_lang['lpn_library_rule_bad']='⚠ یہ قاعدہ پڑھا نہیں جا سکا';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='بنیادی طلب';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='دکھائے گئے ٹائم اسٹیپ پر یہ نوڈ جو بہاؤ کھینچتا ہے: ہر بنیادی طلب کو اس کے اپنے پیٹرن سے ضرب دے کر، سب کو جمع کیا گیا۔ یہ ایک نتیجہ ہے، ان پٹ نہیں۔';
$ec_lang['lpn_field_demand_pattern']='طلب پیٹرن';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_demand_add']='طلب کا زمرہ شامل کریں';
$ec_lang['lpn_demand_remove']='یہ طلب ہٹائیں';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='ہیڈ پیٹرن';
$ec_lang['lpn_field_head_pattern_tip']='رن کے دوران اس ریزروائر کی پانی کی سطح کا پیٹرن۔ اوپر دیے گئے ہیڈ کو پیٹرن سے ضرب دیا جاتا ہے۔';
$ec_lang['lpn_field_pump_speed']='نسبتی رفتار';
$ec_lang['lpn_field_pump_speed_tip']='اس کے شائع شدہ کارکردگی وکر بنانے میں استعمال ہونے والی گردشی رفتار کے لحاظ سے۔ رفتار پیٹرن ہو تو نظر انداز کیا جاتا ہے (اسکیل نہیں ہوتا)۔';
$ec_lang['lpn_field_speed_pattern']='رفتار پیٹرن';
$ec_lang['lpn_field_speed_pattern_tip']='پیٹرن کا ہر اندراج رن کے اس حصے کی نسبتی رفتار دیتا ہے، کسی بنیادی قدر کو اسکیل کرنے کے بجائے۔';

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
$ec_lang['lpn_search_menu']='جگہ کو نام سے تلاش کریں…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='پہلے استعمال پر اجازت مانگی جاتی ہے، کیونکہ تلاشیں OpenStreetMap کی جگہ کے نام کی سروس کو بھیجی جاتی ہیں۔';
$ec_lang['lpn_search_bar']='نام سے تلاش کریں…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='نام سے جگہ تلاش کرنا آپ کے درج کردہ الفاظ nominatim.openstreetmap.org کو بھیجتا ہے، جو OpenStreetMap Foundation کی مفت جگہ کے نام کی سروس ہے۔';
$ec_lang['lpn_search_consent_2']='یہ آپ کے پراجیکٹ کے پیچھے موجود سڑکوں کے نقشے کی تصاویر سے الگ سروس ہے۔ تصاویر صرف یہ بتاتی ہیں کہ آپ کہاں دیکھ رہے ہیں۔ تلاش یہ بتاتی ہے کہ آپ نے کیا ٹائپ کیا۔ جگہ کے نام کی سروس کو آپ کے تلاش کے الفاظ اور آپ کا IP پتہ موصول ہوں گے۔ ہم اس کے علاوہ کچھ نہیں بھیجتے، اور آپ کی تلاشوں کا کوئی ریکارڈ نہیں رکھتے۔';
$ec_lang['lpn_search_consent_3']='کیا ہم آپ کی تلاشیں جگہ کے نام کی سروس کو بھیج سکتے ہیں؟';
$ec_lang['lpn_search_consent_4']='اگر آپ انکار کرتے ہیں، تو اس صفحے کی باقی ہر چیز بالکل ویسے ہی کام کرتی رہتی ہے جیسے اب کرتی ہے، بشمول ایک عرض بلد اور طول بلد پر جائیں۔ ہم "ہاں" یاد رکھتے ہیں تاکہ دوبارہ پوچھنے کی ضرورت نہ پڑے۔ "نہیں" بالکل بھی محفوظ نہیں کی جاتی۔';
$ec_lang['lpn_search_refused']='جگہ کے نام کی تلاش بند ہے، اور کچھ نہیں بھیجا گیا۔ آپ اب بھی ایک عرض بلد اور طول بلد پر جائیں استعمال کر سکتے ہیں۔';
$ec_lang['lpn_search_prompt']='کسی جگہ کو نام سے تلاش کریں۔ کوئی شہر، سڑک، یا نشانی — مثال کے طور پر: Petaluma, California';
$ec_lang['lpn_search_empty']='تلاش کرنے کے لیے جگہ کا نام درج کریں۔';
$ec_lang['lpn_search_working']='تلاش جاری ہے…';
$ec_lang['lpn_search_busy']='ایک تلاش پہلے سے جاری ہے۔ اس کے ختم ہونے کا انتظار کریں۔';
$ec_lang['lpn_search_choose']='ایک سے زیادہ جگہیں میل کھاتی ہیں۔ کون سی؟';
$ec_lang['lpn_search_nochoice']='کچھ نہیں چنا گیا، اس لیے نقشہ منتقل نہیں ہوا۔';
$ec_lang['lpn_search_badchoice']='یہ فہرست میں موجود اعداد میں سے ایک نہیں ہے۔';
$ec_lang['lpn_search_none']='اس نام کے لیے کچھ نہیں ملا۔';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='جگہ کے نام کی سروس نے درخواستوں کی شرح محدود کر دی ہے۔ ایک منٹ انتظار کریں اور دوبارہ کوشش کریں۔';
$ec_lang['lpn_search_http']='جگہ کے نام کی سروس نے ایک خرابی کے ساتھ جواب دیا۔';
$ec_lang['lpn_search_timeout']='جگہ کے نام کی سروس نے وقت پر جواب نہیں دیا۔ اس صفحے کی باقی ہر چیز اس کے بغیر کام کرتی ہے۔';
$ec_lang['lpn_search_unreadable']='جگہ کے نام کی سروس نے ایسی چیز کے ساتھ جواب دیا جو یہ صفحہ پڑھ نہیں سکا۔';
$ec_lang['lpn_search_offline']='ہم جگہ کے نام کی سروس تک نہیں پہنچ سکے۔ ہو سکتا ہے آپ آف لائن ہوں۔ اس صفحے کی باقی ہر چیز اس کے بغیر کام کرتی ہے، بشمول ایک عرض بلد اور طول بلد پر جائیں۔';
$ec_lang['lpn_search_toofast']='جگہ کے نام کی سروس فی سیکنڈ ایک تلاش کی اجازت دیتی ہے۔ تھوڑی دیر میں دوبارہ کوشش کریں۔';
$ec_lang['lpn_search_nofetch']='یہ براؤزر جگہ کے نام کی سروس تک نہیں پہنچ سکتا۔';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox اسے بلندی کے بہت سے عوامی ڈیٹا سیٹس سے جوڑتا ہے، اس لیے اس کی درستگی مقام پر منحصر ہے۔ جہاں قومی lidar سروے موجود ہو، جیسے امریکہ کے بیشتر حصے میں USGS 3DEP اور دیگر جگہوں پر اس کے مساوی، وہاں یہ افقی طور پر 1 میٹر سے بہتر اور عمودی طور پر ایک میٹر کے چند دسویں حصے تک درست ہو سکتا ہے۔ جہاں صرف عالمی ڈیٹا موجود ہو وہاں یہ افقی طور پر تقریباً 30 میٹر اور عمودی طور پر کئی میٹر ہے۔ Mapbox یہ نہیں بتاتا کہ کون سا ماخذ لاگو ہے۔ اسے سروے نہیں بلکہ کنٹور نقشہ سمجھیں، اور جس قدر پر ڈیزائن کا انحصار ہو اسے جانچ لیں۔';
$ec_lang['lpn_terrain_consent_1']='بلندیاں بھرنے سے ہر اس نوڈ کی جگہ — اس کا عرض بلد اور طول بلد — api.mapbox.com کو بھیجی جاتی ہے جسے بلندی کی ضرورت ہے، تاکہ وہاں کی زمین کی اونچائی معلوم کی جا سکے۔';
$ec_lang['lpn_terrain_consent_2']='یہ آپ کے پراجیکٹ کے پیچھے موجود نقشے کی تصاویر سے الگ معاملہ ہے۔ تصاویر صرف یہ بتاتی ہیں کہ آپ کہاں دیکھ رہے ہیں۔ یہ جگہیں خود آپ کا نیٹ ورک ہیں۔ Mapbox کو وہ احداثیات اور آپ کا IP پتہ موصول ہوں گے۔ ہم اس کے علاوہ کچھ نہیں بھیجتے: نہ نام، نہ پائپ، نہ پراجیکٹ۔ ہم اس کا کوئی ریکارڈ نہیں رکھتے، اور اس سوال کے آپ کے جواب کے سوا اس آلے پر کچھ محفوظ نہیں کیا جاتا۔';
$ec_lang['lpn_terrain_consent_3']='کیا ہم آپ کے نوڈز کی جگہیں Mapbox کو بھیج سکتے ہیں؟';
$ec_lang['lpn_terrain_consent_4']='اگر آپ انکار کریں تو اس صفحے کی باقی ہر چیز بالکل ویسے ہی کام کرتی رہتی ہے جیسے اب کرتی ہے، اور بلندیاں پہلے کی طرح ہاتھ سے درج کی جا سکتی ہیں۔ ہم "ہاں" یاد رکھتے ہیں تاکہ دوبارہ پوچھنا نہ پڑے۔ "نہیں" بالکل محفوظ نہیں کی جاتی۔';
$ec_lang['lpn_terrain_refused']='بلندیاں نہیں بھری گئیں، اور کچھ نہیں بھیجا گیا۔ انہیں پہلے کی طرح ہاتھ سے درج کیا جا سکتا ہے۔';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='کیا {n} نوڈ(ز) کی بلندی Mapbox DEM سے بھری جائے؟';
$ec_lang['lpn_terrain_confirm_default_1']='ہر نوڈ کی پہلے سے بلندی ہے، اور ان میں سے {n} ابھی تک {v} پر ہیں، جو وہ بلندی ہے جس سے نیا نوڈ شروع ہوتا ہے، وہ نہیں جو آپ نے درج کی۔';
$ec_lang['lpn_terrain_confirm_default_2']='کیا ان نوڈز ({n}) کی بلندی کو Mapbox DEM کی قدروں سے بدل دیا جائے؟';
$ec_lang['lpn_terrain_keep']='{k} نوڈ(ز) کی پہلے سے بلندی ہے اور انہیں تبدیل نہیں کیا جائے گا۔';
$ec_lang['lpn_terrain_undo']='ایک کالعدم (Ctrl-Z) ان سب کو واپس لے آتا ہے۔';
$ec_lang['lpn_terrain_requests']='{n} api.mapbox.com کو درخواست(یں)۔';
$ec_lang['lpn_terrain_busy']='بلندیاں پہلے ہی بھری جا رہی ہیں۔ اس کے مکمل ہونے کا انتظار کریں۔';
$ec_lang['lpn_terrain_offmap']='یہ نوڈز کی جگہیں زمینی نقشے پر نہیں ہیں، اس لیے کچھ نہیں بھیجا گیا۔';
$ec_lang['lpn_terrain_too_wide']='یہ نوڈز زمین کے اتنے بڑے حصے پر پھیلے ہوئے ہیں کہ انہیں ایک ہی وقت میں پڑھا نہیں جا سکتا ({n} ٹائل درخواستیں)۔ کچھ نہیں بھیجا گیا۔';
$ec_lang['lpn_terrain_cancelled']='کچھ نہیں بدلا گیا اور کچھ نہیں بھیجا گیا۔';
$ec_lang['lpn_terrain_nofetch']='یہ براؤزر زمینی سروس تک نہیں پہنچ سکتا۔';
$ec_lang['lpn_terrain_working']='زمین کی سطح پڑھی جا رہی ہے…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='خطہ کی سروس نے درخواست مسترد کر دی ({status})، اس لیے کوئی بلندی تبدیل نہیں کی گئی۔ ہو سکتا ہے یہ سائٹ جو Mapbox ٹوکن استعمال کرتی ہے وہ اس ویب ایڈریس کی اجازت نہ دیتا ہو جس پر آپ ہیں۔';
$ec_lang['lpn_terrain_failed']='ہم زمینی سروس تک نہیں پہنچ سکے، اس لیے کوئی بلندی نہیں بدلی گئی۔ ہو سکتا ہے آپ آف لائن ہوں۔ اس صفحے کی باقی ہر چیز اس کے بغیر کام کرتی ہے۔';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='خطے کی سروس نے درخواستوں کی شرح محدود کر دی ہے (429)، اس لیے کوئی بلندی تبدیل نہیں ہوئی۔ ایک منٹ بعد دوبارہ کوشش کریں۔';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='خطہ کی سروس نے خرابی کے ساتھ جواب دیا ({status})، اس لیے کوئی بلندی تبدیل نہیں کی گئی۔ آپ کے نیٹ ورک میں کچھ غلط نہیں۔';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='ان میں سے کسی نوڈ کی زمین پر کوئی پوزیشن نہیں، اس لیے کچھ نہیں بھیجا گیا اور کوئی بلندی تبدیل نہیں کی گئی۔ زمین کی سطح پڑھنے کے لیے عرض بلد اور طول بلد میں پراجیکٹ درکار ہے، یا ایسی پروجیکشن پر جسے یہ صفحہ رکھ سکے۔';
$ec_lang['lpn_terrain_done']='{n} بلندی(اں) بھر دی گئیں۔';
$ec_lang['lpn_terrain_missed']='{m} پڑھی نہیں جا سکیں اور ابھی تک خالی ہیں۔';
$ec_lang['lpn_terrain_partial']='{f} زمینی ٹائل(ز) نے جواب نہیں دیا۔';
$ec_lang['lpn_terrain_will_ids']='ان نوڈز کو بلندی ملے گی: {ids}';
$ec_lang['lpn_terrain_keep_ids']='وہ نوڈز یہ ہیں: {ids}';
$ec_lang['lpn_terrain_filled_ids']='ان نوڈز کو بلندی مل گئی: {ids}';
$ec_lang['lpn_terrain_blank_ids']='ان نوڈز کے پاس ابھی تک کوئی بلندی نہیں: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}، اور {n} مزید';

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
$ec_lang['lpn_analyze_menu']='تجزیہ';
$ec_lang['lpn_analyze_menu_tip']='وہ تجزیے جو نیٹ ورک کو ایک نقل پر چلاتے ہیں: ہر جنکشن پر فائر فلو، ہر پائپ، پمپ اور والو کا نقصان، اور اوپر یا نیچے پیمانہ کی گئی طلبیں۔';
$ec_lang['lpn_ff_menu']='فائر فلو تجزیہ…';
$ec_lang['lpn_ff_menu_tip']='ہر منتخب جنکشن کو فائر فلو کے لیے جانچیں، اور باقی نظام پر اثر کا جائزہ لیں';
$ec_lang['lpn_ff_title']='فائر فلو تجزیہ';
$ec_lang['lpn_ff_intro']='ہر جنکشن باری باری اپنی موجودہ طلب کے اوپر فائر فلو لیتا ہے۔ رن اسکرین پر موجود وقتی مرحلے پر نیٹ ورک کی ایک کاپی استعمال کرتا ہے، اس لیے پراجیکٹ میں کچھ تبدیل نہیں ہوتا۔\n\nفائر فلو عام طور پر زیادہ سے زیادہ دن کی طلب پر جانچا جاتا ہے، اس لیے پہلے نیٹ ورک کو اسی حالت پر مقرر کریں۔\n\nہر جانچے گئے جنکشن کے لیے پورے نیٹ ورک کے تقریباً 16 حل درکار ہوتے ہیں، اس لیے بڑے نظام میں منٹ لگتے ہیں: رن کرنے سے پہلے جنکشنز چنیں، اور جزوی نتائج رکھنے کے لیے کسی بھی وقت روک دیں۔';
$ec_lang['lpn_ff_scope']='آزمانے کے لیے جنکشنز';
$ec_lang['lpn_ff_all']='تمام جنکشنز';
$ec_lang['lpn_ff_selected']='منتخب جنکشنز';
$ec_lang['lpn_ff_no_junctions']='اس پراجیکٹ میں ابھی تک کوئی جنکشن نہیں، اس لیے آزمانے کو کچھ نہیں۔';
$ec_lang['lpn_ff_no_selection']='کوئی جنکشن منتخب نہیں۔ جنکشن منتخب کریں یا تمام جنکشن چنیں۔';
$ec_lang['lpn_ff_skipped']='{n} منتخب عناصر جنکشن نہیں، اس لیے انہیں آزمایا نہیں گیا۔';
$ec_lang['lpn_ff_required']='درکار فائر فلو';
$ec_lang['lpn_ff_required_tip']='ہائیڈرینٹ پر درکار بہاؤ، قابل اطلاق فائر کوڈ یا فائر اتھارٹی کے مطابق۔ ہر جنکشن اسی قدر کے مقابل جانچا جاتا ہے جب تک اس جنکشن کے لیے درکار فائر فلو درج نہ ہو۔';
$ec_lang['lpn_ff_required_own']='جو جنکشنز اپنا درکار فائر فلو رکھتے ہیں انہیں اسی کے مقابلے میں آزمایا جاتا ہے۔ ان کی تعداد: {n}۔';
$ec_lang['lpn_ff_required_node_tip']='اس جنکشن پر درکار فائر فلو، اس زمین کے استعمال کے لیے جس کی یہ خدمت کرتا ہے، قابل اطلاق فائر کوڈ یا فائر اتھارٹی کے مطابق۔ جنکشن کو فائر فلو تجزیہ خانے کی قدر کے مقابل جانچنے کے لیے اسے خالی چھوڑیں۔';
$ec_lang['lpn_ff_residual']='برقرار رکھنے کے لیے بقایا دباؤ';
$ec_lang['lpn_ff_residual_tip']='فائر فلو دیتے ہوئے جنکشن کو جو دباؤ برقرار رکھنا چاہیے۔ AWWA M31 اور NFPA 291 میں 20 psi (140 kPa) استعمال ہوتا ہے۔';
$ec_lang['lpn_ff_design']='ڈیزائن جانچ (نظام پر اثر)';
$ec_lang['lpn_ff_design_tip']='جنکشن بہاؤ دے سکتا ہے یا نہیں، اس سے الگ ایک سوال: وہاں وہ بہاؤ کھینچنے پر کیا کوئی اور جنکشن اپنے کم از کم دباؤ سے نیچے گرتا ہے یا کوئی پائپ اپنی رفتار کی حد سے بڑھتا ہے؟ اس جانچ کے لیے کوئی اضافی حساب درکار نہیں۔';
$ec_lang['lpn_ff_design_off']='کوئی نہیں';
$ec_lang['lpn_ff_design_all']='سب';
$ec_lang['lpn_ff_design_selected']='منتخب';
$ec_lang['lpn_ff_design_no_selection']='ڈیزائن جانچ کا دائرہ منتخب پر مقرر ہے، لیکن کوئی عنصر منتخب نہیں۔ نقشے پر عناصر منتخب کریں یا سب چنیں۔';
$ec_lang['lpn_ff_minpressure']='دوسری جگہ اجازت شدہ کم ترین دباؤ';
$ec_lang['lpn_ff_minpressure_tip']='جو جنکشن اس سے نیچے گر جائے جب کوئی دوسرا اپنا فائر فلو کھینچ رہا ہو، اسے ڈیزائن مسئلے کے طور پر رپورٹ کیا جاتا ہے۔';
$ec_lang['lpn_ff_maxvelocity']='اجازت شدہ زیادہ سے زیادہ رفتار';
$ec_lang['lpn_ff_maxvelocity_tip']='جو پائپ فائر فلو کھینچے جانے کے دوران اس سے اوپر چلے، اسے ڈیزائن مسئلے کے طور پر رپورٹ کیا جاتا ہے۔';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='دباؤ خود جنکشن پر ماڈل کیا جاتا ہے، جو معمول کا طریقہ ہے۔ ہائیڈرینٹ، اس کی لیٹرل اور اس کا نوزل ماڈل نہیں کیے جاتے، اور نوزل پر دباؤ نوڈ کے دباؤ سے کم ہوتا ہے۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='بلٹ اِن حل کار استعمال کیا جاتا ہے۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='EPANET انجن استعمال کیا جاتا ہے۔';
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
$ec_lang['lpn_ff_run_title']='فائر فلو رن';
$ec_lang['lpn_ff_calculate']='چلائیں';
$ec_lang['lpn_ff_stop']='روکیں';
$ec_lang['lpn_ff_working']='کام جاری: {total} میں سے {done} جنکشن۔';
$ec_lang['lpn_ff_stopped']='{total} میں سے {done} جنکشن کے بعد روکا گیا۔ نیچے دیے نتائج وہی ہیں جو پہلے ہی مکمل ہو چکے ہیں۔';
$ec_lang['lpn_ff_cost']='اس رن نے پورا نیٹ ورک {solves} بار حل کیا۔';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='ڈرائنگ بدل گئی، اس لیے فائر فلو کے نتائج مٹا دیے گئے۔ اسے دوبارہ چلائیں۔';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='حلقے صاف کریں';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} جنکشنز تمام جانچوں میں کامیاب رہے۔ {fire} جنکشنز فائر فلو میں ناکام رہے۔ {design} جنکشنز نے باقی نظام کو متاثر کیا۔';
$ec_lang['lpn_ff_summary_error']='وہ جنکشنز جو حل نہیں ہو سکے ({n})۔';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='ہر آزمایا گیا جنکشن';
$ec_lang['lpn_ff_col_junction']='جنکشن';
$ec_lang['lpn_ff_col_static']='جامد دباؤ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='کوئی فائر فلو کھینچے جانے سے پہلے اس جنکشن پر دباؤ، جبکہ نظام کی معمول کی طلبیں اب بھی چل رہی ہیں۔ اسے ناپنے کے لیے کچھ بھی بند نہیں کیا جاتا، اس لیے یہ نظام کے لیے صفر بہاؤ کا دباؤ نہیں؛ یہ وہی دباؤ ہے جو نقشہ اس جنکشن پر دکھاتا ہے۔ AWWA M31 اور NFPA 291 دونوں اس ریڈنگ کو جامد دباؤ کہتے ہیں، اور یہیں سے فائر فلو ٹیسٹ شروع ہوتا ہے۔';
$ec_lang['lpn_ff_col_available']='دستیاب بہاؤ';
$ec_lang['lpn_ff_col_required']='درکار بہاؤ';
$ec_lang['lpn_ff_col_residual']='برقرار رکھا گیا بقایا دباؤ';
$ec_lang['lpn_ff_col_atrequired']='درکار بہاؤ پر دباؤ';
$ec_lang['lpn_ff_col_affected']='بدترین اثر';
$ec_lang['lpn_ff_col_limit']='ڈیزائن حد';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='جانچا نہیں گیا';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='جامد ناکام، اس لیے جانچا نہیں گیا';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='ناکامی کی اقسام';
$ec_lang['lpn_ff_mode_fire']='فائر';
$ec_lang['lpn_ff_mode_design']='ڈیزائن';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='کوئی نہیں';
$ec_lang['lpn_ff_col_solves']='حل';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='دباؤ اور رفتار';
$ec_lang['lpn_ff_atleast']='{flow} سے زیادہ';
$ec_lang['lpn_ff_affect_node']='{id}، {pressure} تک گر گیا';
$ec_lang['lpn_ff_affect_link']='{id}، {velocity} تک پہنچ گیا';
$ec_lang['lpn_ff_more']='اور {n} مزید متاثر';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='نہ دکھائے گئے جنکشنز: {n}۔';
$ec_lang['lpn_ff_rows_more_links']='نہ دکھائے گئے لنکس: {n}۔';
$ec_lang['lpn_ff_design_none']='ہر جانچے گئے جنکشن کا فائر فلو باری باری کھینچنے پر، ڈیزائن جانچ کے دائرے میں کوئی چیز اپنی حدوں میں ناکام نہیں ہوئی۔';
$ec_lang['lpn_ff_design_off_note']='اس رن میں باقی نظام پر اثر نہیں جانچا گیا۔';
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
$ec_lang['lpn_ff_iso']='انشورنس سروسز آفس (ISO) ایک ہائیڈرینٹ کو زیادہ سے زیادہ {flow} کا کریڈٹ دیتا ہے۔ یہ حد یہاں لاگو نہیں کی گئی، کیونکہ ایک جنکشن ایک سے زیادہ ہائیڈرینٹ کی نمائندگی کر سکتا ہے۔';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='کوئی فائر فلو کھینچے جانے سے پہلے ہی بقایا دباؤ سے نیچے';
$ec_lang['lpn_ff_err_converge']='نیٹ ورک ہم آہنگ نہیں ہوا۔';
$ec_lang['lpn_ff_err_solve']='حل کار نے خرابی رپورٹ کی اور کوئی جواب نہیں دیا۔';
$ec_lang['lpn_ff_err_not_junction']='جنکشن نہیں ہے';
$ec_lang['lpn_ff_err_unknown']='کوئی نتیجہ نہیں۔ ایرر کوڈ: {code}';

// ---- Water > Criticality analysis (Tom, 2026-09-30) -------------------------------------------
//
// Break each asset in turn, on a copy, and report what the system loses. "Criticality analysis" is
// the industry's term (WaterGEMS, InfoWater); EPANET has no such tool and no word for it. The run
// dialog, Run, Stop, the engine sentence and the cost line are fire flow's own keys.
//
// {n}, {done} and {total} are whole numbers; {pressure} is a pressure with its unit.
$ec_lang['lpn_crit_menu']='نازکی کا تجزیہ…';
$ec_lang['lpn_crit_menu_tip']='ہر پائپ، پمپ اور والو کو باری باری نیٹ ورک سے ہٹائیں اور نظام پر اثر کی رپورٹ دیں۔';
$ec_lang['lpn_crit_title']='نازکی کا تجزیہ';
$ec_lang['lpn_crit_intro']='ہر اثاثہ باری باری نیٹ ورک سے نکالا جاتا ہے، اور نیٹ ورک فعال منظرنامے میں اسکرین پر موجود وقتی مرحلے پر حل کیا جاتا ہے۔ پراجیکٹ میں کچھ تبدیل نہیں ہوتا؛ پورا رن ایک نقل پر کیا جاتا ہے۔';
$ec_lang['lpn_crit_scope']='توڑنے کے لیے لنکس';
$ec_lang['lpn_crit_scope_tip']='تمام پائپ، پمپ اور والو، یا صرف وہ جو نقشے پر منتخب ہیں۔ چلانے سے پہلے مجموعہ چنیں۔';
$ec_lang['lpn_crit_scope_all']='تمام لنکس';
$ec_lang['lpn_crit_scope_selected']='منتخب لنکس';
$ec_lang['lpn_crit_minpressure']='اجازت شدہ کم ترین دباؤ';
$ec_lang['lpn_crit_minpressure_tip']='یہ وہی عدد ہے جو فائر فلو تجزیے میں اجازت شدہ کم ترین دباؤ کے طور پر ہے۔ اسے یہاں بدلنے سے وہاں بھی بدل جاتا ہے۔';
$ec_lang['lpn_crit_col_asset']='اثاثہ';
$ec_lang['lpn_crit_col_unserved']='بلا سپلائی طلب';
$ec_lang['lpn_crit_col_cutoff']='کٹے ہوئے جنکشنز';
$ec_lang['lpn_crit_col_below']='کم ترین سے نیچے جنکشنز';
$ec_lang['lpn_crit_summary']='وہ عناصر جن کے باعث طلب بلا سپلائی رہتی ہے یا کوئی جنکشن {pressure} سے نیچے گر جاتا ہے ({total} میں سے {n})۔';
$ec_lang['lpn_crit_baseline_below']='وہ جنکشنز جو کچھ ٹوٹے بغیر پہلے ہی اس سے نیچے ہیں: {n}۔ انہیں شمار نہیں کیا جاتا۔';
$ec_lang['lpn_crit_working']='کام جاری: {total} میں سے {done} اثاثے۔';
$ec_lang['lpn_crit_stopped']='{total} میں سے {done} اثاثوں کے بعد روکا گیا۔ نیچے دیے نتائج وہی ہیں جو پہلے ہی مکمل ہو چکے ہیں۔';
$ec_lang['lpn_crit_no_selection']='کوئی لنک منتخب نہیں۔ لنکس منتخب کریں یا تمام لنکس چنیں۔';
$ec_lang['lpn_crit_no_links']='اس پراجیکٹ میں ابھی تک کوئی لنک نہیں، اس لیے توڑنے کو کچھ نہیں۔';
$ec_lang['lpn_crit_busy']='ایک اور تجزیہ چل رہا ہے۔ اسے روکیں، یا اس کے ختم ہونے کا انتظار کریں۔';
$ec_lang['lpn_crit_skipped']='{n} منتخب عناصر لنک نہیں، اس لیے انہیں توڑا نہیں گیا۔';
$ec_lang['lpn_crit_stale']='ڈرائنگ بدل گئی، اس لیے نازکی کے نتائج مٹا دیے گئے۔ اسے دوبارہ چلائیں۔';
$ec_lang['lpn_crit_skipdead']='بند سرے چھوڑیں';
$ec_lang['lpn_crit_skipdead_tip']='بند سرے کا لنک وہ ہے جس کے ہٹانے سے وہ جنکشنز کٹ جاتے ہیں جہاں صرف اسی کے ذریعے پہنچا جا سکتا ہے، اور آگے کوئی ریزروائر یا ٹینک نہیں۔ اس کا نقصان اس کے آگے کا سب کچھ ہے، اس لیے اسے حل نہیں کیا جاتا۔ خلاصہ بتاتا ہے کہ کتنے چھوڑے گئے۔';
$ec_lang['lpn_crit_skipped_dead']='چھوڑے گئے بند سرے کے لنکس: {n}۔ ہر ایک اپنے آگے کا سب کچھ کاٹ دیتا ہے۔';

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
$ec_lang['lpn_ds_menu']='طلب اسکیلنگ…';
$ec_lang['lpn_ds_menu_tip']='نیٹ ورک کی ایک کاپی پر طلب کو ضرب دیں اور دباؤ اور رفتار دیکھیں، یا وہ سب سے بڑا طلب اسکیل تلاش کریں جسے نظام سنبھال سکتا ہے۔';
$ec_lang['lpn_ds_title']='طلب اسکیلنگ';
$ec_lang['lpn_ds_intro']='چنے گئے جنکشنز کی طلب کو طلب اسکیل سے ضرب دینے اور دباؤ اور رفتار دیکھنے کے لیے رن بٹن دبائیں۔\n\nوہ سب سے بڑا طلب اسکیل، قریب ترین {step} تک، تلاش کرنے کے لیے تلاش بٹن دبائیں جس پر یہ تمام جنکشنز کم از کم اجازت یافتہ دباؤ برقرار رکھتے ہیں؛ یہ 0 سے {max} تک تلاش کرتا ہے۔\n\nدونوں نیٹ ورک کی ایک کاپی پر کام کرتے ہیں، جو فعال منظرنامے میں اسکرین پر موجود وقتی مرحلے پر حل کی جاتی ہے، اس لیے پراجیکٹ میں کچھ تبدیل نہیں ہوتا۔ صرف وہی وقتی مرحلہ اسکیل ہوتا ہے، اور سطحیں اور حالتیں اسی سے لی جاتی ہیں؛ پیک کی جانچ کے لیے رن کرنے سے پہلے گھڑی کو پیک طلب پر لے جائیں۔';
$ec_lang['lpn_ds_scope']='اسکیل کیے جانے والے جنکشنز';
$ec_lang['lpn_ds_head_scale']='طلب کو اسکیل کریں';
$ec_lang['lpn_ds_multiplier']='طلب اسکیل';
$ec_lang['lpn_ds_multiplier_tip']='وہ ضارب جس سے ہر طلب کو ضرب دیا جاتا ہے؛ 1.5 کا مطلب 50% اضافہ ہے۔ یہ فعال منظرنامے کے طلب کے ضارب کے علاوہ لاگو ہوتا ہے، جو طلب میں پہلے ہی شامل ہے، اور یہ پراجیکٹ میں کبھی محفوظ نہیں ہوتا۔';
$ec_lang['lpn_ds_head_search']='نظام کون سا طلب اسکیل سنبھال سکتا ہے؟';
$ec_lang['lpn_ds_head_search_selected']='یہ جنکشنز کون سا طلب اسکیل سنبھال سکتے ہیں؟';
$ec_lang['lpn_ds_outside_below']='{m} کے طلب اسکیل پر، {pressure} سے کم غیر منتخب جنکشنز: {n} ({ids})۔ یہ اس جواب کو محدود نہیں کرتے۔';
$ec_lang['lpn_ds_holds_max']='✓ ہر جنکشن {max} کے طلب اسکیل تک، جو تلاش کی بالائی حد ہے، {pressure} برقرار رکھتا ہے۔';
$ec_lang['lpn_ds_below_zero']='⚠ اسکیل شدہ طلب صفر ہونے پر بھی کم از کم ایک جنکشن {pressure} سے کم ہے۔';
$ec_lang['lpn_ds_found']='✓ جانچا گیا ہر جنکشن {m} کے طلب اسکیل تک کم از کم {pressure} برقرار رکھتا ہے۔';
$ec_lang['lpn_ds_found_below']='⚠ درج کی ہوئی طلب (طلب اسکیل 1) کم از کم ایک جنکشن کو {pressure} سے نیچے چھوڑتی ہے۔ سب سے بڑا طلب اسکیل جو ہر جنکشن کو {pressure} یا اس سے اوپر رکھتا ہے {m} ہے۔';
$ec_lang['lpn_ds_search_stopped']='جواب ملنے سے پہلے تلاش روک دی گئی۔';
$ec_lang['lpn_ds_lowest_at']='{m} کے طلب اسکیل پر، سب سے کم دباؤ {pressure} ہے، جنکشن {id} پر۔';
$ec_lang['lpn_ds_nosolve_at']='{m} کے طلب اسکیل پر، نیٹ ورک نے کوئی جواب نہیں دیا۔ {reason}';
$ec_lang['lpn_ds_scale_ok']='✓ {m} کے طلب اسکیل پر، ہر جنکشن {pressure} برقرار رکھتا ہے۔';
$ec_lang['lpn_ds_scale_below']='⚠ {m} کے طلب اسکیل پر، {pressure} سے کم جنکشنز: {n}۔';
$ec_lang['lpn_ds_scaled_selected']='اسکیل اور جانچے گئے جنکشنز: {n}۔';
$ec_lang['lpn_ds_head_lowest']='سب سے کم دباؤ';
$ec_lang['lpn_ds_head_velocity']='سب سے زیادہ رفتار';
$ec_lang['lpn_ds_col_link']='لنک';
$ec_lang['lpn_ds_col_scaled']='اسکیل شدہ';
$ec_lang['lpn_ds_col_scaled_tip']='طلب کو طلب اسکیل سے ضرب دینے کے ساتھ۔';
$ec_lang['lpn_ds_col_unscaled']='غیر اسکیل شدہ';
$ec_lang['lpn_ds_col_unscaled_tip']='طلب کے ساتھ جیسی وہ اس ٹائم اسٹیپ پر فعال منظرنامے میں ہے، وہی قدر جو نقشہ دکھاتا ہے۔';
$ec_lang['lpn_ds_no_junctions']='اس پراجیکٹ میں ابھی کوئی جنکشن نہیں، اس لیے اسکیل کرنے کے لیے کوئی طلب نہیں۔';
$ec_lang['lpn_ds_skipped']='منتخب عناصر جو جنکشن نہیں ہیں، جیسے تھے ویسے چھوڑ دیے گئے: {n}۔';
$ec_lang['lpn_ds_bad_multiplier']='صفر یا اس سے زیادہ کا طلب اسکیل درج کریں، جیسے 1.5۔';
$ec_lang['lpn_ds_stale']='ڈرائنگ بدل گئی، اس لیے طلب اسکیلنگ کے نتائج مٹا دیے گئے۔ اسے دوبارہ چلائیں۔';
$ec_lang['lpn_analyze_at_time']='ٹائم اسٹیپ: {time}۔';
$ec_lang['lpn_analyze_time_moved']='⚠ یہ {time} پر حساب کیا گیا تھا، اور گھڑی اب {now} پر ہے۔ اسکرین پر موجود ٹائم اسٹیپ کے لیے اسے دوبارہ چلائیں۔';

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
$ec_lang['lpn_file_import_survey']='سروے شدہ پوائنٹس درآمد کریں…';
$ec_lang['lpn_file_import_survey_tip']='ٹیکسٹ فائل سے سروے شدہ پوائنٹس کی فہرست پڑھیں اور ہر پوائنٹ پر ایک جنکشن بنائیں، ہر اس چیز کے لیے جو فائل بیان نہیں کرتی نئے عنصر کی سیٹنگز لیتے ہوئے۔ جب تک آپ تفصیل کو فیلڈ کوڈز کے طور پر پڑھیں کو منتخب نہ کریں کوئی پائپ نہیں بنایا جاتا، اور کوئی قطار نام لیے بغیر کبھی نہیں چھوڑی جاتی۔ یہ اسی احداثی نظام کو پڑھتی ہے جو یہ پراجیکٹ پہلے سے استعمال کرتا ہے، جغرافیائی حوالہ شدہ ہو یا نہ ہو۔';
// GeoJSON import of Shapes (Task 779). Only points, lines and polygons come in, as Shapes; the
// network is imported from an EPANET file. Every feature not imported is named in the report.
$ec_lang['lpn_file_import_shapes']='GeoJSON شکلیں درآمد کریں…';
$ec_lang['lpn_file_import_shapes_tip']='GeoJSON فائل کے نقطے، لکیریں اور کثیر الاضلاع اس پراجیکٹ میں شکلوں کے طور پر پڑھیں۔ فائل میں نیٹ ورک کے اثاثے درآمد نہیں ہوتے؛ نیٹ ورک EPANET فائل سے یا GeoJSON نیٹ ورک درآمد کریں سے درآمد کریں۔ پراجیکٹ زمین پر رکھا ہوا ہونا چاہیے یا نقاط کا نظام بتاتا ہو۔';
$ec_lang['lpn_file_import_gjnet']='GeoJSON نیٹ ورک درآمد کریں…';
$ec_lang['lpn_file_import_gjnet_tip']='GeoJSON فائل کو نئے پراجیکٹ کے طور پر کھولیں۔ نقطے جنکشنز، ریزروائرز یا ٹینکس کے طور پر، اور لکیریں پائپس کے طور پر درآمد ہوتی ہیں۔ اس صفحے سے برآمد کی گئی فائل جیسی لکھی ہو ویسی پڑھی جاتی ہے؛ کسی بھی دوسری فائل کے لیے، ایک مرحلہ اس کے فیلڈز کو خصوصیات اور اکائیوں سے ملاتا ہے۔';
$ec_lang['lpn_gjnet_refuse_crs']='{file} نقاط کا نظام {crs} بتاتی ہے۔ GeoJSON کے مقامات WGS 84 عرض بلد اور طول بلد ہیں (RFC 7946)، اور یہ صفحہ کسی دوسرے نظام کی GeoJSON فائل کو تبدیل نہیں کرتا۔ پرت کو GIS سے EPSG:4326 (WGS 84) میں برآمد کریں، پھر وہ فائل درآمد کریں۔';
$ec_lang['lpn_gjnet_refuse_empty']='{file} میں کوئی نقطہ یا لکیر نہیں ہے۔';
$ec_lang['lpn_gjnet_target_node_type']='نوڈ کی قسم';
$ec_lang['lpn_gjnet_target_custom']='حسب ضرورت خاصیت';
$ec_lang['lpn_gjnet_target_skip']='درآمد نہ کریں';
$ec_lang['lpn_gjnet_points_heading']='نقطوں کے فیلڈز (جنکشنز، ریزروائرز اور ٹینکس)';
$ec_lang['lpn_gjnet_lines_heading']='لکیروں کے فیلڈز (پائپس)';
$ec_lang['lpn_gjnet_no_fields']='ان فیچرز کے کوئی صفتی فیلڈز نہیں ہیں۔';
$ec_lang['lpn_gjnet_col_field']='فیلڈ';
$ec_lang['lpn_gjnet_col_example']='مثال';
$ec_lang['lpn_gjnet_col_fills']='بھرتا ہے';
$ec_lang['lpn_gjnet_col_unit']='اکائی';
$ec_lang['lpn_gjnet_beta']='بیٹا: رائے درکار ہے';
$ec_lang['lpn_gjnet_beta_tip']='اس درآمد کو GIS پروگراموں کی چند فائلوں پر آزمایا گیا ہے۔ کسی مسئلے کی اطلاع دینے یا تبدیلی تجویز کرنے کے لیے صفحے پر {button} دبائیں اور فائل کو بیان کریں۔';
$ec_lang['lpn_gjnet_intro']='{points} نقطے اور {lines} لکیریں ملیں۔ نقطے جنکشنز، ریزروائرز یا ٹینکس کے طور پر، اور لکیریں پائپس کے طور پر درآمد ہوتی ہیں۔ چنیں کہ ہر فیلڈ کون سی خاصیت بھرتا ہے اور ہر عدد کی اکائی کیا ہے۔';
$ec_lang['lpn_gjnet_other']='{n} فیچرز نہ نقطے ہیں نہ لکیریں اور درآمد نہیں ہوں گے؛ رپورٹ انہیں درج کرتی ہے۔';
$ec_lang['lpn_gjnet_tolerance']='جوڑنے کی رواداری (m)';
$ec_lang['lpn_gjnet_tolerance_tip']='نقطے سے، یا دوسری لکیر کے سرے سے، اس فاصلے کے اندر لکیر کا سرا اس سے جوڑ دیا جاتا ہے۔ جو لکیر کا سرا ہر نقطے سے اس سے زیادہ دور ہو اسے نیا جنکشن ملتا ہے۔';
$ec_lang['lpn_gjnet_working']='{file} درآمد ہو رہی ہے…';
$ec_lang['lpn_gjnet_title']='GeoJSON نیٹ ورک درآمد کریں: {file}';
$ec_lang['lpn_gjnet_report_lead']='درآمد کے دوران کی گئی ہر تبدیلی، اور ہر وہ فیچر جو درآمد نہیں ہوا، وجہ کے ساتھ نیچے درج ہے:';
$ec_lang['lpn_gjnet_and_more']='اور {n} مزید';
$ec_lang['lpn_gjnet_note_crs']='فائل نقاط کا نظام {crs} بتاتی ہے، جو WGS 84 عرض بلد اور طول بلد ہے، وہی نظام جو RFC 7946 کا تقاضا ہے۔ مقامات جیسے بتائے گئے ویسے پڑھے گئے۔';
$ec_lang['lpn_gjnet_note_crs_nad83']='فائل NAD83 (EPSG:4269) بتاتی ہے۔ اس کے مقامات WGS 84 کے طور پر پڑھے گئے، جو انہیں اس جگہ سے تقریباً 1 سے 2 m کے اندر رکھتا ہے جہاں NAD83 رکھتا ہے۔';
$ec_lang['lpn_gjnet_note_skip_geometry']='درآمد نہیں ہوا: فیچر نہ نقطہ ہے نہ لکیر۔';
$ec_lang['lpn_gjnet_note_skip_kind']='درآمد نہیں ہوا: فیچر نہ node_type بتاتا ہے نہ link_type۔';
$ec_lang['lpn_gjnet_note_skip_position']='درآمد نہیں ہوا: کوئی مقام درست عرض بلد اور طول بلد نہیں ہے۔';
$ec_lang['lpn_gjnet_note_skip_id']='درآمد نہیں ہوا: نام درست ID نہیں ہے، یا اسی قسم کے کسی دوسرے عنصر کے پاس وہی ہے۔';
$ec_lang['lpn_gjnet_note_skip_no_node']='درآمد نہیں ہوا: جس ابتدائی یا آخری نوڈ کا نام ہے وہ فائل میں نہیں ہے۔';
$ec_lang['lpn_gjnet_note_skip_loop']='درآمد نہیں ہوا: لکیر کے دونوں سرے ایک ہی نوڈ سے جڑتے ہیں۔';
$ec_lang['lpn_gjnet_note_id_new']='ان فیچرز نے کوئی درست ID نہیں بتائی اور انہیں قوسین میں دکھائی گئی ID دی گئی۔';
$ec_lang['lpn_gjnet_note_id_dup']='یہ IDs ایک ہی قسم کے ایک سے زیادہ فیچرز نے بتائی ہیں۔ ہر بعد کے فیچر کو قوسین میں دکھائی گئی ID دی گئی۔';
$ec_lang['lpn_gjnet_note_unmapped_id_point']='نقطے کی ID کے لیے کوئی فیلڈ نہیں چنا گیا، اس لیے نقطے سے درآمد ہونے والے ہر نوڈ کو ID دی گئی۔';
$ec_lang['lpn_gjnet_note_unmapped_id_line']='لکیر کی ID کے لیے کوئی فیلڈ نہیں چنا گیا، اس لیے ہر پائپ کو ID دی گئی۔';
$ec_lang['lpn_gjnet_note_skip_short']='درآمد نہیں ہوا: لکیر کو کم از کم دو مقامات چاہییں۔';
$ec_lang['lpn_gjnet_note_elev_taken']='ان نوڈز نے کوئی بلندی نہیں بتائی۔ ہر ایک کو قوسین میں دکھائے گئے نوڈ کی بلندی دی گئی: لکیر کے سرے پر شامل کیے گئے جنکشن کے لیے، اس کے پائپ کے دوسرے سرے کا نوڈ، ورنہ سب سے قریب کا نوڈ جو بلندی بتاتا ہو۔';
$ec_lang['lpn_gjnet_note_default_elev_added']='یہ جنکشن لکیر کے سروں پر شامل کیے گئے اور ان کی بلندی ڈیفالٹ، {value}، ہے، کیونکہ فائل کا کوئی نوڈ بلندی نہیں بتاتا۔';
$ec_lang['lpn_gjnet_note_demand_kept']='ریزروائر یا ٹینک کی کوئی طلب نہیں ہوتی، اس لیے ان نوڈز پر بتائی گئی طلب حسب ضرورت خاصیت {key} کے طور پر رکھی گئی۔';
$ec_lang['lpn_gjnet_note_parts']='ان کثیر حصوں والی لکیروں کے ایسے حصے ہیں جو جڑے ہوئے نہیں ہیں اور ہر حصے کے لیے ایک پائپ کے طور پر درآمد کیے گئے۔';
$ec_lang['lpn_gjnet_note_parts_points']='یہ کثیر نقطہ فیچرز ہر نقطے کے لیے ایک نوڈ کے طور پر درآمد کیے گئے۔';
$ec_lang['lpn_gjnet_note_junction_added']='یہ جنکشن وہاں شامل کیے گئے جہاں لکیر کا سرا کسی نقطے کے {tol} کے اندر نہیں ہے۔ ہر ایک کی ڈیفالٹ بنیادی طلب ہے۔';
$ec_lang['lpn_gjnet_note_end_moved']='ان پائپوں کا ایک سرا کسی نقطے یا دوسری لکیر کے سرے کے {tol} کے اندر ہے، لیکن اس پر نہیں۔ سرا اس سے جوڑ دیا گیا؛ سب سے بڑا فاصلہ {dist} ہے۔';
$ec_lang['lpn_gjnet_note_end_on_pipe']='یہ لکیروں کے سرے قوسین میں دکھائے گئے پائپ پر ہیں، لیکن اس کے سرے پر نہیں، اور اس سے جڑے ہوئے نہیں ہیں۔';
$ec_lang['lpn_gjnet_note_z']='ان نقطوں نے تیسرا نقطہ ہندسہ بتایا، جو درآمد نہیں ہوا۔';
$ec_lang['lpn_gjnet_note_default_elev']='ان نوڈز نے کوئی بلندی نہیں بتائی اور ان کی بلندی ڈیفالٹ، {value}، ہے۔';
$ec_lang['lpn_gjnet_note_unmapped_elev']='بلندی کے لیے کوئی فیلڈ نہیں چنا گیا، اس لیے ہر نوڈ کی بلندی ڈیفالٹ، {value}، ہے اور خودکار لمبائیوں میں بلندی کا کوئی فرق شامل نہیں۔';
$ec_lang['lpn_gjnet_note_default_demand']='ان جنکشنز نے کوئی بنیادی طلب نہیں بتائی اور ان کی بنیادی طلب ڈیفالٹ، {value}، ہے۔';
$ec_lang['lpn_gjnet_note_unmapped_demand']='بنیادی طلب کے لیے کوئی فیلڈ نہیں چنا گیا، اس لیے ہر جنکشن کی بنیادی طلب ڈیفالٹ، {value}، ہے۔';
$ec_lang['lpn_gjnet_note_default_diameter']='ان پائپوں نے کوئی قطر نہیں بتایا اور ان کا قطر ڈیفالٹ، {value}، ہے۔';
$ec_lang['lpn_gjnet_note_unmapped_diameter']='قطر کے لیے کوئی فیلڈ نہیں چنا گیا، اس لیے ہر پائپ کا قطر ڈیفالٹ، {value}، ہے۔';
$ec_lang['lpn_gjnet_note_default_roughness']='ان پائپوں نے کوئی کھردرا پن نہیں بتایا اور ان کا کھردرا پن ڈیفالٹ، {value}، ہے۔';
$ec_lang['lpn_gjnet_note_unmapped_roughness']='کھردرے پن کے لیے کوئی فیلڈ نہیں چنا گیا، اس لیے ہر پائپ کا کھردرا پن ڈیفالٹ، {value}، ہے۔';
$ec_lang['lpn_gjnet_note_default_k']='ان پائپوں نے مقامی نقصان (minor loss) کا کوئی عددی سر نہیں بتایا، اس لیے ہر ایک کا 0 ہے، جیسے ایسی EPANET فائل میں جو کوئی نہ بتائے۔';
$ec_lang['lpn_gjnet_note_unmapped_k']='مقامی نقصان (minor loss) کے عددی سر کے لیے کوئی فیلڈ نہیں چنا گیا، اس لیے ہر پائپ کا 0 ہے، جیسے ایسی EPANET فائل میں جو کوئی نہ بتائے۔';
$ec_lang['lpn_gjnet_note_default_tank']='ان ٹینکس کی پانی کی گہرائیاں اور ٹینک کا قطر ڈیفالٹ ہیں۔';
$ec_lang['lpn_gjnet_note_length_auto']='ان پائپوں نے کوئی لمبائی نہیں بتائی۔ ہر لمبائی لکیر سے حساب کی جاتی ہے (خودکار)۔';
$ec_lang['lpn_gjnet_note_unmapped_length']='لمبائی کے لیے کوئی فیلڈ نہیں چنا گیا، اس لیے ہر پائپ کی لمبائی لکیر سے حساب کی جاتی ہے (خودکار)۔';
$ec_lang['lpn_gjnet_note_value_unread']='یہ قدریں اعداد نہیں ہیں یا پہچانی نہیں گئیں، اور استعمال نہیں ہوئیں۔';
$ec_lang['lpn_gjnet_note_field_skipped']='یہ فیلڈز، جیسا چنا گیا، درآمد نہیں ہوئے۔';
$ec_lang['lpn_gjnet_note_field_custom']='یہ فیلڈز حسب ضرورت خصوصیات کے طور پر درآمد ہوئے۔';
$ec_lang['lpn_gjnet_note_results']='فائل کے نتائج درآمد نہیں ہوئے۔ حل کریں انہیں دوبارہ حساب کرتا ہے۔';
$ec_lang['lpn_gjnet_note_demand_rows']='ان جنکشنز کی ایک سے زیادہ طلب کی قطاریں تھیں۔ GeoJSON فائل صرف پہلی رکھتی ہے، جو درآمد ہوئی۔';
$ec_lang['lpn_gjnet_note_pipe_type']='ان پائپوں نے قوسین میں دکھائی گئی پائپ کی قسم بتائی، جس کی تعریف GeoJSON فائل نہیں رکھتی۔ پائپ کی قسم درآمد نہیں ہوئی؛ فائل میں بتایا گیا قطر اور کھردرا پن ہوئے۔';
$ec_lang['lpn_gjnet_note_pattern_conflict']='یہ پیٹرن مختلف فیچرز پر مختلف ضربوں کے ساتھ بتائے گئے ہیں۔ پہلا استعمال ہوا۔';
$ec_lang['lpn_gjnet_note_end_off_node']='ان لنکس میں سے ہر ایک کی لکیر اپنے نوڈ پر شروع یا ختم نہیں ہوتی۔ نوڈ کی جگہ استعمال ہوئی۔';
$ec_lang['lpn_gjnet_note_not_held']='GeoJSON فائل کنٹرولز، قواعد، وقت کی ترتیبات، متن کے لیبلز، EPANET آپشنز، یا پائپ کی قسم، فٹنگز اور کارکردگی کے وکر کی لائبریریاں نہیں رکھتی، اس لیے ان میں سے کچھ بھی درآمد نہیں ہوا۔';
$ec_lang['lpn_geojson_import_done']='{file} سے {n} شکلیں درآمد ہوئیں۔';
$ec_lang['lpn_geojson_import_done_one']='{file} سے ایک شکل درآمد ہوئی۔';
$ec_lang['lpn_geojson_import_renamed']='{n} فیچر نام شکل ID کے طور پر استعمال نہیں ہو سکتے۔ ہر شکل کو دوسری ID دی گئی اور اس کا فیچر نام برقرار رہا: {list}۔';
$ec_lang['lpn_geojson_import_renamed_one']='ایک فیچر نام شکل ID کے طور پر استعمال نہیں ہو سکتا۔ شکل کو دوسری ID دی گئی اور اس کا فیچر نام برقرار رہا: {list}۔';
$ec_lang['lpn_geojson_import_skipped']='{n} فیچرز درآمد نہیں ہوئے: {list}۔';
$ec_lang['lpn_geojson_import_skipped_one']='ایک فیچر درآمد نہیں ہوا: {list}۔';
$ec_lang['lpn_geojson_import_why_network']='نیٹ ورک اثاثہ';
$ec_lang['lpn_geojson_import_why_geometry']='پوائنٹ، لائن یا کثیر الاضلاع نہیں';
$ec_lang['lpn_geojson_import_why_position']='مقام درست عرض بلد اور طول بلد نہیں';
$ec_lang['lpn_geojson_import_holes']='{n} کثیر الاضلاع سوراخ درآمد نہیں ہوئے۔ ایک شکل کی صرف ایک حد ہوتی ہے۔';
$ec_lang['lpn_geojson_import_holes_one']='ایک کثیر الاضلاع سوراخ درآمد نہیں ہوا۔ ایک شکل کی صرف ایک حد ہوتی ہے۔';
$ec_lang['lpn_geojson_import_parts']='{n} کثیر حصوں والے فیچرز ہر حصے کے لیے ایک شکل کی صورت میں درآمد ہوئے۔';
$ec_lang['lpn_geojson_import_parts_one']='ایک کثیر حصوں والا فیچر ہر حصے کے لیے ایک شکل کی صورت میں درآمد ہوا۔';
$ec_lang['lpn_geojson_import_local']='GeoJSON کے مقامات عرض بلد اور طول بلد ہیں، اور اس پراجیکٹ کی زمین پر کوئی جگہ نہیں جس میں انہیں تبدیل کیا جا سکے۔ پہلے اسے نقشہ، دنیا کا نقشہ، منسلک کریں سے جغرافیائی حوالہ دیں، پھر دوبارہ درآمد کریں۔';
$ec_lang['lpn_geojson_import_unreadable']='{file} GeoJSON فائل نہیں ہے: {detail}';
$ec_lang['lpn_file_import_dxf']='DXF شکلیں درآمد کریں…';
$ec_lang['lpn_file_import_dxf_tip']='ASCII DXF فائل کے پوائنٹس، لائنیں اور پولی لائنز اس پراجیکٹ میں شکلوں کے طور پر پڑھیں، ہر لیئر کا نام ایک خصوصیت کے طور پر برقرار رکھتے ہوئے۔ دیگر اینٹیٹیز شمار اور درج کی جاتی ہیں، درآمد نہیں ہوتیں۔ نقاط کو اس پراجیکٹ کے X اور Y کے طور پر، بغیر کسی تبدیلی کے، پڑھا جاتا ہے۔';
$ec_lang['lpn_file_import_shp']='شیپ فائل شکلیں درآمد کریں…';
$ec_lang['lpn_file_import_shp_tip']='ESRI شیپ فائل کے پوائنٹس، لائنیں اور کثیر الاضلاع اس پراجیکٹ میں شکلوں کے طور پر پڑھیں، اور ایٹریبیوٹ کالمز کو خصوصیات کے طور پر برقرار رکھیں۔ یا تو .zip منتخب کریں یا .shp کو اس کی .shx، .dbf اور .prj کے ساتھ منتخب کریں (کئی منتخب کرنے کے لیے Ctrl یا Shift دبائے رکھیں)۔ پراجیکٹ سے مختلف احداثی نظام کے نقاط تبدیل کیے جاتے ہیں، اور نوٹس اس کا ذکر کرتا ہے۔';
$ec_lang['lpn_dxf_import_skipped']='{n} اینٹیٹیز درآمد نہیں ہوئیں: {list}۔';
$ec_lang['lpn_dxf_import_skipped_one']='ایک اینٹیٹی درآمد نہیں ہوئی: {list}۔';
$ec_lang['lpn_dxf_import_inblocks']='بلاک ڈیفی نیشنز میں';
$ec_lang['lpn_dxf_import_bulge']='{n} پولی لائنز میں قوسی سیگمنٹ ہیں، جو ان کے ورٹیکسز کے درمیان سیدھے سیگمنٹ کے طور پر درآمد ہوئے۔';
$ec_lang['lpn_dxf_import_bulge_one']='ایک پولی لائن میں قوسی سیگمنٹ ہیں، جو اس کے ورٹیکسز کے درمیان سیدھے سیگمنٹ کے طور پر درآمد ہوئے۔';
$ec_lang['lpn_dxf_import_units']='ڈرائنگ اپنی اکائیاں {theirs} بیان کرتی ہے اور یہ پراجیکٹ {ours} استعمال کرتا ہے۔ اعداد تبدیل نہیں کیے گئے۔';
$ec_lang['lpn_dxf_import_refuse_geo']='DXF ڈرائنگ مستوی ہوتی ہے، اور یہ پراجیکٹ عرض بلد اور طول بلد میں ہے، اس لیے {file} کے نقاط کی اس میں کوئی جگہ نہیں۔ پراجیکٹ کو کسی احداثی نظام میں کاپی کرنے کے لیے تبدیل بطور… استعمال کریں، پھر دوبارہ درآمد کریں۔';
$ec_lang['lpn_dxf_import_unreadable']='{file} ASCII DXF فائل نہیں ہے۔';
$ec_lang['lpn_dxf_import_binary']='{file} بائنری DXF ہے۔ اسے اپنے CAD پروگرام سے ASCII DXF کے طور پر محفوظ کریں، پھر دوبارہ درآمد کریں۔';
$ec_lang['lpn_shapes_import_frame']='نقاط کو {frame} کے طور پر، بغیر کسی تبدیلی کے، پڑھا گیا۔';
$ec_lang['lpn_shapes_frame_xy']='اس پراجیکٹ کے X اور Y';
$ec_lang['lpn_shapes_frame_latlon']='عرض بلد اور طول بلد';
$ec_lang['lpn_shp_import_skipped']='{n} ریکارڈ درآمد نہیں ہوئے، کیونکہ ان کی شیپ کی قسم نہیں پڑھی جاتی: {list}۔';
$ec_lang['lpn_shp_import_skipped_one']='ایک ریکارڈ درآمد نہیں ہوا، کیونکہ اس کی شیپ کی قسم نہیں پڑھی جاتی: {list}۔';
$ec_lang['lpn_shp_import_attrs']='ہر شکل کی خصوصیات کے طور پر برقرار رکھے گئے ایٹریبیوٹ کالمز: {list}۔';
$ec_lang['lpn_shp_import_noprj']='کوئی .prj فائل نہیں ہے، اس لیے نقاط کو {frame} کے طور پر، بغیر کسی تبدیلی کے، پڑھا گیا۔';
$ec_lang['lpn_shp_import_prj_same']='.prj میں {crs} بیان ہے، جو اس پراجیکٹ کا احداثی نظام ہے، اس لیے نقاط تبدیل نہیں کیے گئے۔';
$ec_lang['lpn_shp_import_converted']='نقاط عرض بلد اور طول بلد ہیں۔ انہیں اس ٹرانسفارم سے {crs} میں تبدیل کیا گیا جو نقشہ استعمال کرتا ہے۔';
$ec_lang['lpn_shp_import_prj_other']='.prj میں {theirs} بیان ہے۔ اس پراجیکٹ میں کوئی احداثی نظام بیان نہیں، اس لیے نقاط کو {frame} کے طور پر، بغیر کسی تبدیلی کے، پڑھا گیا۔';
$ec_lang['lpn_shp_import_refuse_local']='{file} عرض بلد اور طول بلد میں ہے، اور اس پراجیکٹ کی زمین پر کوئی جگہ نہیں جس میں انہیں تبدیل کیا جا سکے۔ پہلے اسے نقشہ، دنیا کا نقشہ، منسلک کریں سے جغرافیائی حوالہ دیں، پھر دوبارہ درآمد کریں۔';
$ec_lang['lpn_shp_import_refuse_crs']='{file} میں {theirs} بیان ہے، اور یہ پراجیکٹ {ours} میں ہے۔ کچھ بھی درآمد نہیں ہوا اور کچھ بھی تبدیل نہیں کیا گیا۔';
$ec_lang['lpn_shp_import_refuse_range']='{file} میں کوئی .prj فائل نہیں ہے، اور اس کے نقاط عرض بلد اور طول بلد نہیں ہیں، اس لیے انہیں اس پراجیکٹ میں نہیں رکھا جا سکتا۔';
$ec_lang['lpn_shp_import_noshp']='{file} میں کوئی .shp فائل نہیں ہے۔ یا تو شیپ فائل کی .zip منتخب کریں یا .shp کو اس کی .shx، .dbf اور .prj کے ساتھ منتخب کریں (کئی منتخب کرنے کے لیے Ctrl یا Shift دبائے رکھیں)۔';
$ec_lang['lpn_shp_import_manyshp']='{file} میں ایک سے زیادہ شیپ فائلیں ہیں۔ ایک وقت میں ایک درآمد کریں۔';
$ec_lang['lpn_shp_import_unreadable']='{file} ایسی شیپ فائل نہیں ہے جسے یہ صفحہ پڑھ سکے: {detail}';
$ec_lang['lpn_shp_import_pick_hint']='شیپ فائل کئی فائلوں پر مشتمل ہوتی ہے۔ .shp کو اس کی .shx، .dbf اور .prj کے ساتھ منتخب کریں (کئی منتخب کرنے کے لیے Ctrl یا Shift دبائے رکھیں)، یا .zip منتخب کریں۔';
$ec_lang['lpn_shp_import_webmerc_ask']='{file} میں کوئی .prj فائل نہیں ہے، اور اس کے اعداد عرض بلد اور طول بلد نہیں ہیں، لیکن وہ ویب مرکیٹر میٹروں (EPSG:3857) سے مطابقت رکھتے ہیں، جو QGIS اور ویب نقشے استعمال کرتے ہیں۔ انہیں EPSG:3857 کے طور پر درآمد کر کے اس پراجیکٹ میں تبدیل کریں؟';
$ec_lang['lpn_shp_import_webmerc_ok']='EPSG:3857 کے طور پر درآمد کریں';
$ec_lang['lpn_shp_import_webmerc_far_ask']='{file} میں {theirs} بیان ہے، اور اس نظام میں پڑھنے پر اس کے نقاط اس پراجیکٹ سے {km} کلومیٹر دور آتے ہیں۔ ویب مرکیٹر میٹروں (EPSG:3857) کے طور پر پڑھنے پر، جو QGIS اور ویب نقشے استعمال کرتے ہیں، وہ وہیں آتے ہیں جہاں یہ پراجیکٹ ہے۔ انہیں EPSG:3857 کے طور پر درآمد کر کے اس پراجیکٹ میں تبدیل کریں؟';
$ec_lang['lpn_shp_import_reprojected']='نقاط کو {theirs} سے {ours} میں تبدیل کیا گیا۔';
$ec_lang['lpn_shp_import_unplaced']='{n} ریکارڈز کے نقاط ایسے ہیں جنہیں یہ پراجیکٹ نہیں رکھ سکتا، جیسے نقشے کی حد سے باہر کا عرض بلد۔ ریکارڈ نمبر: {list}۔';
$ec_lang['lpn_shp_import_unplaced_one']='ایک ریکارڈ کے نقاط ایسے ہیں جنہیں یہ پراجیکٹ نہیں رکھ سکتا، جیسے نقشے کی حد سے باہر کا عرض بلد۔ ریکارڈ نمبر: {list}۔';
$ec_lang['lpn_shapes_import_none']='{file} سے کچھ بھی درآمد نہیں ہوا۔';
$ec_lang['lpn_shp_import_convert_hint']='پراجیکٹ کو {theirs} میں کاپی کرنے کے لیے تبدیل بطور… استعمال کریں، پھر دوبارہ درآمد کریں۔';
$ec_lang['lpn_shp_import_damaged']='{file} خراب یا ادھوری ہے، اس لیے کچھ بھی درآمد نہیں ہوا۔';
$ec_lang['lpn_shp_import_deleted']='.dbf میں حذف شدہ نشان زد {n} ریکارڈ درآمد نہیں ہوئے۔';
$ec_lang['lpn_shp_import_deleted_one']='.dbf میں حذف شدہ نشان زد ایک ریکارڈ درآمد نہیں ہوا۔';
$ec_lang['lpn_dxf_import_paperspace']='پیپر اسپیس میں';
$ec_lang['lpn_shapes_import_more']='اور {n} مزید';
$ec_lang['lpn_survey_read_error']='وہ فائل آپ کی ڈسک سے پڑھی نہیں جا سکی۔';
$ec_lang['lpn_survey_cancelled']='کچھ نہیں بنایا گیا اور کچھ نہیں بدلا گیا۔';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='اس فائل میں کچھ نہیں ہے۔';
$ec_lang['lpn_survey_err_unreadable']='وہ فائل سروے شدہ پوائنٹس کی فہرست کے طور پر نہیں پڑھی جا سکی۔';
$ec_lang['lpn_survey_err_ambiguous_coord']='اس فائل کا ایک سے زیادہ کالم {axis} ({detail}) ہو سکتا ہے، اور یہ صفحہ ان میں سے انتخاب نہیں کرتا۔ ان میں سے صرف ایک کو {axis} کا نام دیں اور دوبارہ کوشش کریں۔';
$ec_lang['lpn_survey_err_no_points']='اس فائل کی ایک بھی قطار سروے شدہ پوائنٹ کے طور پر نہیں پڑھی جا سکی۔ پڑھی گئی قطاریں: {detail}';
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
$ec_lang['lpn_survey_format_label']='فائل فارمیٹ:';
$ec_lang['lpn_survey_format_internal']='اندرونی طور پر متعین';
$ec_lang['lpn_survey_create']='نوڈز بنائیں';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='پہلی لائن چھوڑ دی گئی: یہ ایسے کسی کالم کا نام نہیں لیتی جسے یہ صفحہ جانتا ہو۔';
$ec_lang['lpn_survey_type_label']='اثاثے کی قسم:';
$ec_lang['lpn_survey_confirm_junction']='{n} جنکشن ملے۔ آگے بڑھیں؟';
$ec_lang['lpn_survey_confirm_reservoir']='{n} ریزروائر ملے۔ آگے بڑھیں؟';
$ec_lang['lpn_survey_confirm_tank']='{n} ٹینک ملے۔ آگے بڑھیں؟';
$ec_lang['lpn_survey_report_junction']='{n} جنکشن درآمد ہوئے، {m} بلندی کے ساتھ۔';
$ec_lang['lpn_survey_report_reservoir']='{n} ریزروائر درآمد ہوئے، {m} بلندی کے ساتھ۔';
$ec_lang['lpn_survey_report_tank']='{n} ٹینک درآمد ہوئے، {m} بلندی کے ساتھ۔';
$ec_lang['lpn_survey_report_clean']='فائل کا ہر پوائنٹ بغیر تبدیلی کے درآمد ہوا۔';
$ec_lang['lpn_survey_report_notes']='درآمد کی خرابیاں اور نوٹس:';
$ec_lang['lpn_survey_sev_error']='خرابی';
$ec_lang['lpn_survey_sev_warning']='انتباہ';
$ec_lang['lpn_survey_note_line']='لائن {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='اوپر دیے گئے فائل فارمیٹ کے لیے بہت کم کالم۔';
$ec_lang['lpn_survey_note_coord_missing']='{axis} سیل خالی ہے۔';
$ec_lang['lpn_survey_note_bad_coord']='{axis} عدد کے طور پر نہیں پڑھا جاتا۔';
$ec_lang['lpn_survey_note_coord_range']='{axis} اس حد سے باہر ہے جو یہ پراجیکٹ اجازت دیتا ہے۔';
$ec_lang['lpn_survey_note_bad_elev']='غیر عددی بلندی۔ بغیر بلندی کے درآمد کیا گیا۔';
$ec_lang['lpn_survey_note_ambiguous_elev']='ایک سے زیادہ کالم بلندی ہو سکتے تھے، اس لیے ان میں سے کوئی نہیں پڑھا گیا۔';
$ec_lang['lpn_survey_note_blank_rows']='خالی لائنیں چھوڑ دی گئیں: {detail}۔';
$ec_lang['lpn_survey_note_id_duplicate']='نام پہلے ہی اس فائل میں پہلے استعمال ہو چکا، نیا نام تفویض کیا گیا۔';
$ec_lang['lpn_survey_note_id_taken']='نام پہلے ہی پراجیکٹ میں موجود ہے، نیا نام تفویض کیا گیا۔';
$ec_lang['lpn_survey_note_id_invalid']='نام یہاں استعمال نہیں کیا جا سکتا، نیا نام تفویض کیا گیا۔';
// Field codes (Task 771): the Description read as Carlson-style codes. See dev/survey-codes.md.
$ec_lang['lpn_survey_codes_toggle']='تفصیل کو فیلڈ کوڈز کے طور پر پڑھیں';
$ec_lang['lpn_survey_codes_tip']='ہر تفصیل کا پہلا لفظ جدول کے کوڈ کے طور پر پڑھیں۔ ایک ہی لائن کوڈ والے پوائنٹس فائل کی ترتیب میں ایک پائپ میں جڑ جاتے ہیں، اور WL1 اور WL2 الگ لائنیں ہیں۔ +0 لائن شروع کرتا ہے، -0 ختم کرتا ہے، اور CLO بند کرتا ہے۔ JPN کے بعد پوائنٹ کا نام اس پوائنٹ سے جوڑتا ہے (Carlson)، اور Civil 3D اسے CPN لکھتا ہے۔';
$ec_lang['lpn_survey_codes_col_code']='کوڈ';
$ec_lang['lpn_survey_codes_col_type']='عنصر کی قسم';
$ec_lang['lpn_survey_codes_add']='کوڈ شامل کریں';
$ec_lang['lpn_survey_codes_remove']='کوڈ ہٹائیں';
$ec_lang['lpn_survey_confirm_coded']='{j} جنکشن، {r} ریزروائر، {t} ٹینک، اور {p} پائپ ملے۔ آگے بڑھیں؟';
$ec_lang['lpn_survey_report_coded']='{j} جنکشن، {r} ریزروائر، {t} ٹینک، اور {p} پائپ درآمد ہوئے، {m} نوڈز بلندی کے ساتھ۔';
$ec_lang['lpn_survey_note_code_unknown']='کوڈ جدول میں نہیں ہے، اوپر چنی گئی عنصر کی قسم کے طور پر درآمد ہوا۔';
$ec_lang['lpn_survey_note_code_two_nodes']='ایک سے زیادہ نوڈ کوڈ ہیں، پہلا استعمال ہوا۔';
$ec_lang['lpn_survey_note_code_unread']='ہر لفظ ایسا کوڈ نہیں جسے یہ صفحہ پڑھتا ہو، تفصیل میں برقرار رکھا گیا۔';
$ec_lang['lpn_survey_note_vertex_text']='ہر لفظ ایسا کوڈ نہیں جسے یہ صفحہ پڑھتا ہو، اور ورٹیکس کوئی تفصیل نہیں رکھتا۔';
$ec_lang['lpn_survey_note_join_missing']='JPN یا CPN ایسے پوائنٹ کا نام لیتا ہے جو اس فائل یا پراجیکٹ میں نہیں، اس کے لیے کوئی پائپ نہیں بنایا گیا۔';
$ec_lang['lpn_survey_note_join_no_line']='JPN یا CPN ایسے پوائنٹ پر جس کا لائن کوڈ نہیں، اس کے لیے کوئی پائپ نہیں بنایا گیا۔';
$ec_lang['lpn_survey_note_pipe_one_node']='یہ لائن درمیان میں کسی اور نوڈ کے بغیر اسی نوڈ پر لوٹتی ہے، اس کے لیے کوئی پائپ نہیں بنایا گیا۔';
$ec_lang['lpn_survey_note_line_one_point']='اپنی لائن پر اکیلا پوائنٹ، اس سے کوئی پائپ نہیں بنایا گیا۔';
$ec_lang['lpn_survey_note_vertices']='وہ پوائنٹس جو پائپ ورٹیکس بن گئے: {detail}۔ ورٹیکس کوئی نام، بلندی یا تفصیل نہیں رکھتا۔';
$ec_lang['lpn_survey_note_no_desc']='فیلڈ کوڈز آن ہیں، لیکن اس فائل میں تفصیل کا کالم نہیں، اس لیے کوئی کوڈ نہیں پڑھا گیا۔';
$ec_lang['lpn_survey_note_ring_junction']='یہ پوائنٹ جنکشن بن گیا تاکہ حلقہ بند ہو سکے۔';
$ec_lang['lpn_survey_note_pipe_zero_length']='یہ پوائنٹ اپنے سے پہلے والے نوڈ کی اسی جگہ پر ہے، اس لیے ان کے درمیان پائپ کی لمبائی صفر ہے۔';
$ec_lang['lpn_survey_note_node_on_pipe']='یہ پوائنٹ بالکل ایسے پائپ پر واقع ہے جس سے جڑا ہوا نہیں۔ اگر یہ جڑے ہوئے ہیں تو بتانے کے لیے JPN شامل کریں۔';
$ec_lang['lpn_settings_demand_model']='طلب کا ماڈل';
$ec_lang['lpn_settings_demand_model_tip']='چنیں کہ جنکشنز کو بہاؤ کیسے ملتا ہے۔ طلب پر مبنی (DDA) ہر طلب پوری فراہم کرتا ہے، دباؤ جو بھی ہو۔ دباؤ پر مبنی (PDA) وہاں طلب سے کم فراہم کرتا ہے جہاں دباؤ مطلوبہ دباؤ سے کم ہو، اور اسے صرف EPANET حل کار نکالتا ہے۔';
$ec_lang['lpn_settings_demand_model_dda']='طلب پر مبنی';
$ec_lang['lpn_settings_demand_model_pda']='دباؤ پر مبنی';
$ec_lang['lpn_settings_min_pressure']='کم از کم دباؤ';
$ec_lang['lpn_settings_min_pressure_tip']='وہ دباؤ درج کریں جس پر یا جس سے کم پر جنکشن کو کوئی بہاؤ نہیں ملتا۔ اس پراجیکٹ کی دباؤ کی اکائی استعمال کریں۔';
$ec_lang['lpn_settings_req_pressure']='مطلوبہ دباؤ';
$ec_lang['lpn_settings_req_pressure_tip']='وہ دباؤ درج کریں جس پر یا جس سے زیادہ پر جنکشن کو اس کی پوری طلب ملتی ہے۔ یہ کم از کم دباؤ سے زیادہ ہونا چاہیے۔ اس پراجیکٹ کی دباؤ کی اکائی استعمال کریں۔ EPANET کی ڈیفالٹ قدر استعمال کرنے کے لیے خالی چھوڑیں، جو US بہاؤ اکائیوں کے لیے psi میں اور بصورت دیگر میٹر میں ہوتی ہے۔';
$ec_lang['lpn_settings_pressure_exponent']='دباؤ کا ایکسپونینٹ';
$ec_lang['lpn_settings_pressure_exponent_tip']='اس منحنی کا ایکسپونینٹ درج کریں جو کم از کم دباؤ پر صفر بہاؤ سے مطلوبہ دباؤ پر پوری طلب تک بڑھتی ہے۔';
$ec_lang['lpn_engine_pda_route']='EPANET حل کار سے حل کیا گیا، کیونکہ طلب کا ماڈل دباؤ پر مبنی ہے۔';
$ec_lang['lpn_diag_pda_needs_epanet']='طلب کا ماڈل دباؤ پر مبنی ہے، اور اسے صرف EPANET حل کار نکال سکتا ہے۔ EPANET حل کار لوڈ نہیں ہو سکا، اس لیے یہ نتائج موجود نہیں۔';
$ec_lang['lpn_result_delivered_demand']='فراہم کردہ طلب';
$ec_lang['lpn_result_delivered_demand_tip']='وہ بہاؤ جو اس جنکشن کو دباؤ پر مبنی طلب کے ماڈل میں اصل میں ملتا ہے۔ دباؤ مطلوبہ دباؤ سے کم ہو تو یہ طلب سے کم ہوتا ہے۔';
$ec_lang['lpn_result_demand_deficit']='طلب کی کمی';
$ec_lang['lpn_result_demand_deficit_tip']='اس جنکشن کی وہ طلب جو فراہم نہیں ہوتی، کیونکہ دباؤ مطلوبہ دباؤ سے کم ہے۔';
$ec_lang['lpn_pda_deficit_note']='اپنی طلب سے کم حاصل کرنے والے جنکشنز: {n}۔';
$ec_lang['lpn_diag_pda_pressures']='مطلوبہ دباؤ کم از کم دباؤ سے زیادہ ہونا چاہیے۔ ترتیبات میں ان میں سے ایک بدلیں۔';
$ec_lang['lpn_inp_drop_pressure_unit']='یہ فائل ایسی دباؤ کی اکائی بتاتی ہے جو اس صفحے کی بہاؤ اکائی کے لیے پڑھی جانے والی اکائی سے مختلف ہے، یعنی US اکائیوں کے لیے psi اور بصورت دیگر میٹر۔ فائل کا ہر دباؤ اسی طرح پڑھا جاتا ہے، اس لیے اس میں موجود والو سیٹنگز، ایمیٹرز اور دباؤ پر مبنی حدود چیک کریں۔ لائن برقرار رکھی جاتی ہے اور واپس لکھی جاتی ہے۔';

// Map > Screenshot (Tom, 2026-10-05): a snipping tool that re-draws the dragged map area larger than its screen size (3x unless the Screenshot box says otherwise).
$ec_lang['lpn_screenshot_menu']='اسکرین شاٹ';
$ec_lang['lpn_screenshot_tip']='نقشے کے اس حصے کی، جسے آپ گھسیٹ کر منتخب کریں، اسکرین سے زیادہ ریزولوشن پر تصویر لیں۔ اس پر نشان لگائیں، پھر کاپی بٹن سے رپورٹ میں کاپی کریں۔ پورا نقشہ لینے کے لیے بغیر گھسیٹے کلک کریں۔';
$ec_lang['lpn_screenshot_hint']='نقشے پر مستطیل گھسیٹیں، یا پورے نقشے کے لیے کلک کریں۔ Esc منسوخ کرتا ہے۔';
$ec_lang['lpn_screenshot_copied']='اسکرین شاٹ کاپی ہو گیا۔';
$ec_lang['lpn_screenshot_saved']='کلپ بورڈ یہاں دستیاب نہیں، اس لیے اسکرین شاٹ PNG فائل کے طور پر ڈاؤن لوڈ ہو گیا۔';
$ec_lang['lpn_screenshot_no_basemap']='سڑکوں کا نقشہ یا سیٹلائٹ تصویر شامل نہیں کی جا سکی۔';
$ec_lang['lpn_screenshot_failed']='اسکرین شاٹ نہیں بن سکا۔';
$ec_lang['lpn_snip_hint_free']='اسنِپ کرنے کے لیے علاقے کے گرد گھسیٹیں، یا پورے نقشے کے لیے کلک کریں۔ Esc منسوخ کرتا ہے۔';
$ec_lang['lpn_snip_tip_rect']='مستطیل اسنِپ کریں (S)';
$ec_lang['lpn_snip_tip_free']='آزاد ہاتھ کی شکل اسنِپ کریں (S)';
$ec_lang['lpn_snip_tip_mode']='اسنِپ کی شکل';
$ec_lang['lpn_snip_tip_map']='پورے نقشے کا اسکرین شاٹ';
$ec_lang['lpn_snip_tip_pen']='قلم';
$ec_lang['lpn_snip_tip_eraser']='ایریزر: لکیر ہٹانے کے لیے اس پر کلک کریں (E)';
$ec_lang['lpn_snip_tip_undo']='کالعدم کریں (Ctrl+Z)';
$ec_lang['lpn_snip_tip_redo']='دوبارہ کریں (Ctrl+Y)';
$ec_lang['lpn_snip_tip_copy']='کاپی کریں (Ctrl+C)';
$ec_lang['lpn_screenshot_scale_tip']='تصویر کا سائز اسکرین پر موجود علاقے کے ضرب کے طور پر۔ بڑا ضرب زیادہ صاف تصویر دیتا ہے اور فائل بڑی بناتا ہے۔';
