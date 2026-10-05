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
$ec_lang['consent_body']='کیا ہم اس بات کو یاد رکھنے کے لیے کہ ہم پہلے ہی اس صفحے کو شمار کر چکے ہیں، اس براؤزر میں ایک ہندسے کی کوکی محفوظ کر سکتے ہیں؟ یہ آپ کے بارے میں کچھ بھی اور آپ کے ٹائپ کردہ کچھ بھی ریکارڈ نہیں کرتی۔ اس کے بغیر ہم آپ کے دوسرے وزٹ کو کسی اور شخص کے پہلے وزٹ سے الگ نہیں پہچان سکتے۔';
$ec_lang['consent_accept']='یہ قبول کریں';
$ec_lang['consent_accept_all']='ہمیشہ قبول کریں';
$ec_lang['consent_decline']='ہمیشہ انکار کریں';
$ec_lang['consent_current_granted']='آپ نے اس کی اجازت دی۔ ہم اس براؤزر پروفائل کے لیے ریکارڈنگ محدود رکھتے ہیں۔';
$ec_lang['consent_current_denied']='آپ نے اس سے انکار کیا۔ ہم اس براؤزر پروفائل کی ریکارڈنگ محدود کرنے کے لیے کچھ بھی محفوظ نہیں کرتے۔';
$ec_lang['consent_region_label']='ریکارڈنگ محدود کرنے کے بارے میں آپ کا انتخاب۔';
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
$ec_lang['points_data_copy']='کاپی';
$ec_lang['points_data_paste']='پیسٹ';
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
$ec_lang['mpf_solver_no_solution']='کوئی حل نہیں: y/d0 = 93.8% پر Q پائپ کی گنجائش سے تجاوز کر جاتا ہے (منتخب اکائیوں میں Qmax = {qmax})۔';
$ec_lang['mpf_solve_btn']='حل کریں';
$ec_lang['mpf_solve_for_flow']='بہاؤ کے لیے، Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='مانینگ پائپ دباؤ نقصان';
$ec_lang['mphl_main_title']='مفت آنلائن مانینگ پائپ دباؤ نقصان حاسبہ';
$ec_lang['mphl_main_desc']='دیے گئے مکمل بہاؤ پر مانینگ فارمولا دباؤ نقصان';
$ec_lang['mphl_pipe_length']='پائپ لمبائی، L';
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
$ec_lang['mtc_n_blodgett']='ڈیزائن پتھر کے سائز سے n (Blodgett طریقہ)';
$ec_lang['mtc_n_bathurst']='ڈیزائن پتھر کے سائز سے n (Bathurst طریقہ)';
$ec_lang['mtc_n_pi']='ڈیزائن پتھر کے سائز سے n (Phillips & Ingersoll طریقہ)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett بمقابلہ Bathurst';
$ec_lang['mtc_pi_range_check']='P&I حد کی جانچ';
$ec_lang['mtc_pi_ok']='d50 P&I حد میں';
$ec_lang['mtc_pi_ok_tip']='0.28–0.36 فٹ (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='حد سے باہر';
$ec_lang['mtc_pi_tip']='یہ مساوات جس 0.28–0.36 فٹ ڈیٹا سیٹ کی حد سے تیار کی گئی، اس سے باہر اضافی تخمینہ ہے — اسے ڈیزائن کی بنیاد نہیں بلکہ محض ایک اندازاً جانچ سمجھیں۔';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Isbash (1936) اور Maricopa County، Arizona، US کے مطابق">تہ کے لیے مطلوبہ زاویہ دار پتھر کا حجم، D<sub>50</sub> (Isbash اور MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Isbash (1936) اور Maricopa County، Arizona، US کے مطابق">جانبی ڈھلان 1 کے لیے مطلوبہ زاویہ دار پتھر کا حجم، D<sub>50</sub> (Isbash اور MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Isbash (1936) اور Maricopa County، Arizona، US کے مطابق">جانبی ڈھلان 2 کے لیے مطلوبہ زاویہ دار پتھر کا حجم، D<sub>50</sub> (Isbash اور MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='اس نیٹ ورک کو ہر ہائیڈرالک وقتی مرحلے پر حل کریں۔';
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Maynord، Ruff، اور Abt (1989) کے مطابق۔ موڑ پر پتھر کا حجم اوسط کے 4/3 موڑ کی رفتار کے لیے مقرر کیا جاتا ہے، California Division of Highways (1970) کے مطابق؛ Maynord کی اپنی 1.5 قدر قدرتی نالوں پر لاگو ہوتی ہے۔">مطلوبہ زاویہ دار پتھر کا حجم، D<sub>50</sub> (Maynord، Ruff، اور Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='مطلوبہ زاویہ دار پتھر کا حجم، D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='رفتار یکساں بہاؤ کے مفروضات کے لیے مناسب ہے۔';
$ec_lang['mtc_vel_low']='رفتار کم ہے؛ تلچھٹ جمع ہونے کا خطرہ ہے۔';
$ec_lang['mtc_vel_high']='رفتار زیادہ ہے اور شاید حقیقت پسندانہ نہ ہو؛ نالی کی استر کے کٹاؤ، موڑ پر اضافی گہرائی، اور پھیلاؤ یا رکاوٹوں پر توانائی کے ضیاع کی جانچ کریں۔';
$ec_lang['mtc_iteration_tip']='ایک کھردرے پن کا آپشن (Blodgett–Bathurst تجویز کردہ) اور ایک پتھر کے حجم کا آپشن (Isbash تجویز کردہ) منتخب کریں تاکہ آپ کے مطلوبہ بہاؤ کے لیے یکساں پتھر حجم کی طرف خودکار تکرار ہو۔ مکمل طریقہ کار کے لیے نیچے نوٹس دیکھیں، یا تکرار چھوڑنے کے لیے اپنی کھردرے پن کی قدر (رہنمائی کے لیے لنک دیکھیں) درج کریں اور پتھر حجم کو نظرانداز کریں۔';
$ec_lang['mtc_note_1']='<dl><dt>خودکار پتھر کے حجم اور کھردرے پن کی ڈیزائن تکرار</dt><dd>ایک کھردرے پن کا آپشن (Blodgett–Bathurst تجویز کردہ) اور ایک ڈیزائن پتھر حجم کا آپشن (Isbash تجویز کردہ) منتخب کریں۔ یکساں پتھر حجم کے ساتھ اپنے مطلوبہ بہاؤ تک پہنچنے کے لیے گہرائی اور پتھر حجم کے حفاظتی عامل کو ایڈجسٹ کریں۔ جب بھی آپ کوئی ان پٹ تبدیل کرتے ہیں، حاسبہ یہ مراحل دہراتا ہے: 1. ڈیزائن پتھر کے حجم سے کھردرا پن حساب کیا جاتا ہے۔ 2. درخواست کردہ کھردرے پن کا حساب ان پٹ کھردرے پن میں کاپی کیا جاتا ہے۔ 3. نالے کا بہاؤ اور مطلوبہ پتھر حجم حساب کیا جاتا ہے۔ 4. ڈیزائن پتھر کا حجم ایڈجسٹ کیا جاتا ہے۔ 5. جب تک ڈیزائن پتھر حجم میں خرابی بہت کم نہ ہو جائے، دہراتے رہیں۔</dd><dt>بنیادی حاسبہ (بغیر تکرار کے)</dt><dd>اپنی مطلوبہ کھردرے پن کی قدر درج کریں۔ ڈیزائن پتھر حجم کے ان پٹ حصے کو نظرانداز کریں۔</dd></dl>';
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
$ec_lang['mhp_length']='لمبائی، L';
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
$ec_lang['install_firefox_body']='اگر آپ کا براؤزر انسٹال کا آپشن پیش نہیں کرتا، تو کچھ ضائع نہیں ہوتا: کیلکولیٹرز کو براؤزر میں معمول کے مطابق استعمال کریں، اور آپ کی پہلی وزٹ کے بعد صفحات خودکار طور پر آف لائن استعمال کے لیے کیش ہو جاتے ہیں۔ ڈیسک ٹاپ پر Firefox عام صورت ہے۔';
$ec_lang['install_cached_heading']='کیا محفوظ ہوتا ہے';
$ec_lang['install_cached_body']='EngCalcs کو پہلی بار انسٹال کرتے وقت، تمام کیلکولیٹر صفحات اور ان کی معاون فائلیں (اسکرپٹس، اسٹائلز) خودکار طور پر آپ کے آلے میں محفوظ ہو جاتی ہیں۔ اس کے بعد، ہر چیز بغیر انٹرنیٹ کنکشن کے کام کرتی ہے۔ آپ کی زبان کا انتخاب آپ کی آخری آن لائن وزٹ سے یاد رکھا جاتا ہے۔';
$ec_lang['contact_main_menu']='رابطہ';
$ec_lang['about_main_title']='HawsEDC انجینئرنگ کیلکولیٹرز کے بارے میں';
$ec_lang['about_main_desc']='مشن، آزاد سافٹ ویئر، اور تعاون';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>مشن</h3><p>HawsEDC انجینئرنگ کیلکولیٹر دنیا بھر کے انجینئروں اور میدانی کارکنوں کی خدمت کے لیے موجود ہیں — خاص طور پر ان لوگوں کے لیے جو پانی کی قلت، محدود وسائل، یا کم خدمت والے علاقوں میں کام کرتے ہیں۔ یہ اوزار ایک وسیع تر انسانی مشن کا حصہ ہیں: ہر انسان کو سب سے عملی اور مؤثر طریقے سے یہ بتانا <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">کہ وہ ہمیشہ کے لیے محبوب اور عزیز ہے، کہ اسے ڈرنے کی کوئی ضرورت نہیں، اور یہ کہ وہ سب کچھ برباد نہیں کرے گا</a>۔</p><p>کیلکولیٹر ذریعہ ہیں۔ منزل تکلیف سے پاک دنیا ہے۔</p><h3>آزاد اوپن سورس لائسنس</h3><p>تمام کوڈ <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 یا بعد کے ورژن</a> کے تحت جاری کیا گیا ہے — آزادی کے معنوں میں آزاد۔ آپ انہی شرائط کے تحت کوڈ استعمال، مطالعہ، ترمیم اور دوبارہ تقسیم کر سکتے ہیں۔</p><p>جو ویب سائٹ اسے پیش کرتی ہے وہ آج اور 2010 سے مفت پیش کی جاتی ہے؛ اگر کسی دن ایسا نہ ہو سکے تو بھی سافٹ ویئر آپ کا ہے کہ اسے خود چلائیں۔</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>سورس کوڈ</h3><p>مکمل سورس کوڈ GitHub پر عوامی طور پر دستیاب ہے:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>آپ وہاں کوڈ دیکھ سکتے ہیں، مسائل درج کر سکتے ہیں، یا ریپوزیٹری فورک کر سکتے ہیں۔</p><h3>تعاون</h3><p>ہر قسم کی مدد کا خیرمقدم ہے۔ <a href="contact.php">Tom Haws سے رابطہ کریں</a>۔</p><ul><li><strong>ترجمے:</strong> بہتر الفاظ تجویز کریں۔ کسی زبان کو بہتر بنائیں یا نئی زبان شامل کریں۔</li><li><strong>بگ رپورٹس:</strong> کسی بھی کیلکولیٹر صفحے پر فیڈ بیک فارم استعمال کریں، یا GitHub پر مسئلہ درج کریں۔</li><li><strong>نئے کیلکولیٹر:</strong> میدانی کارکنوں اور آبپاشی کے پیشہ وروں کی خدمت کرنے والے ہائیڈرولک انجینئرنگ اوزار کے خیالات خاص طور پر خوش آمدید ہیں۔</li><li><strong>ہوسٹنگ:</strong> اگر آپ محدود رابطے والے علاقے کے لیے ان کیلکولیٹروں کا آئینہ بنا سکتے ہیں تو براہ کرم مجھ سے رابطہ کریں۔</li></ul><h3>آف لائن استعمال</h3><p>جب آپ آن لائن ہوں تو کوئی بھی کیلکولیٹر ایک بار کھولیں، اور تمام کیلکولیٹر اس وقت بھی کام کرتے رہیں گے جب آپ آف لائن ہوں: آپ کا براؤزر آپ کے آگے بڑھتے ہی پورا سوٹ محفوظ کر لیتا ہے۔ اگر آپ اس کے بارے میں پڑھنا چاہیں تو یہ طریقہ <strong>پروگریسو ویب ایپ (PWA)</strong> ہے۔ اس کے بعد تمام کیلکولیٹر آف لائن کام کرتے ہیں — انٹرنیٹ کی کوئی ضرورت نہیں۔</p><p>Android یا iOS پر، EngCalcs کو اپنے آلے پر ایپ کے طور پر نصب کرنے کے لیے اپنے براؤزر کا "ہوم اسکرین پر شامل کریں" اختیار استعمال کریں۔ ڈیسک ٹاپ پر، اپنے براؤزر کی ایڈریس بار میں نصب آئیکن تلاش کریں۔</p><p>آپ اپنے براؤزر کے "بطور محفوظ کریں…" مینو کا استعمال کرتے ہوئے کوئی بھی انفرادی کیلکولیٹر ایک بار کے آف لائن استعمال کے لیے بھی محفوظ کر سکتے ہیں۔</p><h3>رابطہ</h3><p>Tom Haws — ہائیڈرولک انجینئر اور ان کیلکولیٹروں کے بانی۔<br />کسی بھی کیلکولیٹر صفحے پر فیڈ بیک فارم استعمال کریں، یا <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a> پر سورس کوڈ تک رسائی حاصل کریں۔</p>';
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
$ec_lang['rc_yn']='<span class="ec-help" title="پانی جمع ہونا (Hp > yn) اچھا ہے — اوپری جانب کٹاؤ کم کرتا ہے۔ (USDA)">ان لیٹ نالی میں عام گہرائی، y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="مساوات 1 (S0 < 0.10) یا مساوات 2 (0.10-0.40)۔ درست: D50 بین 15 اور 278 ملی میٹر، S0 بین 0.02 اور 0.40۔ حد سے باہر: اضافی تخمینہ۔">مطلوب وسیط چٹان سائز، D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='لاگو مساوات';
$ec_lang['rc_sg_check']='مخصوص کثافت کی جانچ';
$ec_lang['rc_SD_check']='درجہ بندی SD کی جانچ';
$ec_lang['rc_sg_ok']   ='sg درست حد میں';
$ec_lang['rc_sg_ok_tip']='2.54–2.82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg، Robinson حد سے کم';
$ec_lang['rc_sg_low_tip']='درست حد: 2.54–2.82';
$ec_lang['rc_sg_high'] ='sg، Robinson حد سے زیادہ';
$ec_lang['rc_sg_high_tip']='درست حد: 2.54–2.82';
$ec_lang['rc_SD_ok']   ='SD درست حد میں';
$ec_lang['rc_SD_ok_tip']='1.15–1.47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD، Robinson حد سے کم';
$ec_lang['rc_SD_low_tip']='درست حد: 1.15–1.47';
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
$ec_lang['rc_Hp']='<span class="ec-help" title="پانی جمع ہونا (Hp > yn) اچھا ہے — اوپری جانب کٹاؤ کم کرتا ہے۔ (USDA)">ان لیٹ ویئر ہیڈ، H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='ان لیٹ پر پانی جمع ہونے کی جانچ';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — بالائی جانب پانی جمع';
$ec_lang['rc_pond_ok_tip']='کھڑی نالی کے ان لیٹ سے بالائی جانب پانی کا جمع ہونا اچھا ہے؛ یہ بالائی جانب کٹاؤ کم کرتا ہے۔ (USDA)';
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
$ec_lang['bpn_id']='ID';
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
$ec_lang['bpn_q_line']='لائن بہاؤ';
$ec_lang['bpn_q_line_tip']='اس لائن سے گزرنے والا کل بہاؤ: اس کی اپنی طلب جمع ہر زیریں رخ کی طلب جسے یہ فراہم کرتی ہے۔';
$ec_lang['bpn_p_down']='زیریں دباؤ';
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
$ec_lang['bpn_notes_1_def']='اپ سٹریم ID خالی چھوڑیں اور لائن اپنے اوپر والی لائن کی پیروی کرتی ہے؛ ایک سادہ سیریز پائپ لائن۔ کسی اپ سٹریم لائن کی ID درج کریں تاکہ اس سے شاخ نکل سکے۔ یعنی: بطور ڈیفالٹ سیریز، ضرورت پڑنے پر شاخ دار۔';
$ec_lang['bpn_notes_2_term']='صرف برانچڈ نیٹ ورکس، بغیر لوپ';
$ec_lang['bpn_notes_2_def']='ہر لائن کی بالکل ایک اپ سٹریم لائن ہوتی ہے (ایک شجرہ)۔ یہ ٹول لوپ والے نیٹ ورکس حل نہیں کرتا؛ ان کے لیے تکراری طریقے (EPANET یا اسی طرح کے) درکار ہیں۔ لوپس کو خارج رکھنا ہی اسے سادہ اور درست رکھتا ہے۔';
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
$ec_lang['lpn_tool_add_meter_tip']='جہاں گاہک ہے وہاں کلک کریں، پھر اس پائپ یا نوڈ پر کلک کریں جو اسے سروس دیتا ہے۔ گاہک کو دی گئی طلب اس پائپ کے قریبی سرے والے جنکشن میں شامل ہو جاتی ہے۔';
$ec_lang['lpn_mode_add_meter']='گاہک: جہاں گاہک ہے وہاں کلک کریں، پھر اس پائپ یا نوڈ پر کلک کریں جو اسے سروس دیتا ہے۔ یا منسوخ کرنے کے لیے Esc استعمال کریں۔';
$ec_lang['lpn_pane_tab_customers']='گاہک';
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
$ec_lang['lpn_field_meter_total_tip']='فی سروس طلب کو سروسز کی تعداد سے ضرب دیا گیا۔ یہ وہی عدد ہے جو نیچے نامزد جنکشن میں شامل کیا جاتا ہے۔';
$ec_lang['lpn_field_meter_pipe']='منسلک اثاثہ';
$ec_lang['lpn_field_meter_pipe_suggest']='قریب ترین اثاثہ {id} ہے۔ اس گاہک کو اس سے سروس دینے کے لیے یہاں ٹائپ کریں۔';
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
$ec_lang['lpn_meter_placed']='گاہک {id} شامل ہو گیا۔ اس کی تفصیل اور طلب گاہک جدول میں ٹائپ کی جاتی ہے، یا اس کا خانہ کھولنے کے لیے منتخب کریں میں اسے دبائیں۔';
$ec_lang['lpn_field_meter_pipe_tip']='وہ اثاثہ جس سے یہ سروس منسلک ہے۔ اسے بدلنے کے لیے یہاں یا گاہک جدول میں کوئی اور ٹائپ کریں، یا رابطے کے نقطے کو کسی مختلف اثاثے پر گھسیٹیں۔';
$ec_lang['lpn_field_meter_station']='پائپ پر مقام (%)';
$ec_lang['lpn_field_meter_station_tip']='سروس پائپ کے ساتھ کتنی دور جڑتی ہے، پائپ کے پہلے نوڈ سے دوسرے تک فیصد کے طور پر۔ 0 ایک سرے پر ہے اور 100 دوسرے پر۔ پائپ پر موجود دائرہ پوائنٹر سے یہی کام کرتا ہے۔';
$ec_lang['lpn_field_meter_offset']='پائپ سے فاصلہ';
$ec_lang['lpn_field_meter_offset_tip']='مثبت قدر پائپ کے دائیں طرف ہے، اس کے پہلے نوڈ سے دوسرے کی طرف دیکھتے ہوئے۔ یہاں قدر ٹائپ کرنے سے گاہک مین کے دوسری طرف منتقل ہو سکتا ہے، اور یہ ہمیشہ سروس لائن کو مین کے ساتھ سیدھا زاویہ بناتی ہے۔';
$ec_lang['lpn_field_meter_lumped']='نوڈ میں شامل';
$ec_lang['lpn_field_meter_lumped_tip']='قریب ترین نوڈ؛ اس گاہک کی طلبات وہیں شامل کی جاتی ہیں۔';
$ec_lang['lpn_node_customers']='گاہک طلبات';
$ec_lang['lpn_node_customers_tip']='اس نوڈ پر شامل گاہکوں کی فہرست (کیونکہ یہ قریب ترین تھا)۔ گاہک کی طلبات یہاں درج دیگر طلبات کے علاوہ ہیں۔ گاہک میں ترمیم نقشے پر اس کی جگہ یا گاہک جدول میں کی جاتی ہے۔';
$ec_lang['lpn_node_customers_sum']='{n} گاہکوں سے {total} {unit}';
$ec_lang['lpn_customer_detached']='⚠ یہ گاہک کسی پائپ سے منسلک نہیں، اس لیے اس کی طلب جوابات میں شامل نہیں۔ اسے حذف کریں، یا پائپ کھینچ کر گاہک کو اس پر منتقل کریں۔';
$ec_lang['lpn_customer_fixed_head']='⚠ اس پائپ کے قریبی سرے پر ایک مقررہ پانی کی سطح ہے، اس لیے یہ طلب سمولیشن پر اثر انداز نہیں ہوتی۔';
$ec_lang['lpn_customer_detached_count']='{n} گاہک کسی پائپ سے منسلک نہیں۔ ان کی طلب شمار نہیں کی جاتی۔';
$ec_lang['lpn_meter_pick_pipe']='اب اس پائپ یا نوڈ پر کلک کریں جو اس گاہک کو سروس دیتا ہے۔ گاہک وہیں رہے گا جہاں آپ نے اسے رکھا۔ منسوخ کرنے کے لیے Escape دبائیں۔';
$ec_lang['lpn_inp_export_flat_customers']='ایک EPANET فائل میں کوئی گاہک نہیں ہوتا۔ اس پراجیکٹ میں {n} گاہکوں کی طلب فائل میں اس جنکشن پر طلب کی قطار کے طور پر جاتی ہے جس میں ہر ایک شامل ہے، اور ہر قطار کو گاہک کے ٹیگ سے نام دیا جاتا ہے۔ فائل جو نہیں رکھ سکتی وہ گاہک خود ہے: وہ کہاں بیٹھا ہے، کون سا پائپ اسے سروس دیتا ہے، اس پائپ کے ساتھ کہاں سروس جڑتی ہے، اور ایک گاہک کتنی سروسز کی نمائندگی کرتا ہے۔ آپ کی اپنی پراجیکٹ فائل یہ سب رکھتی ہے۔';

$ec_lang['lpn_area_hint_window_start']='ونڈو کا ایک کونا کلک کریں۔';
$ec_lang['lpn_area_hint_window_go']='مکمل کرنے کے لیے مخالف کونا کلک کریں۔';
$ec_lang['lpn_area_hint_lasso_start']='خاکہ شروع کرنے کے لیے کلک کریں۔';
$ec_lang['lpn_area_hint_lasso_go']='خاکہ کھینچنے کے لیے حرکت کریں۔ مکمل کرنے کے لیے کلک کریں۔';
$ec_lang['lpn_area_hint_polygon_start']='کثیر الاضلاع رقبہ کھینچنے کے لیے کلک کریں۔ مکمل کرنے کے لیے ڈبل کلک کریں۔';
$ec_lang['lpn_area_hint_polygon_go']='ہر کونا کلک کریں۔ مکمل کرنے کے لیے آخری کونے پر ڈبل کلک کریں۔';
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
$ec_lang['lpn_pane_pasted']='{n} سیل پیسٹ کیے گئے۔ {skipped} تبدیل نہیں کیے گئے۔';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='{n} قطاریں پیسٹ کی گئیں اور ان میں سے {created} نیٹ ورک میں شامل کی گئیں۔';
$ec_lang['lpn_pane_pasted_rows_skipped']='{n} قطاریں پیسٹ کی گئیں اور ان میں سے {created} نیٹ ورک میں شامل کی گئیں۔ {skipped} سیل تبدیل نہیں کیے گئے۔';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='یہاں کلک کریں اور سپریڈ شیٹ سے قطاریں پیسٹ کر کے انہیں شامل کریں۔';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='جدول کے آخر میں نئی قطاروں کے طور پر پیسٹ کریں';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='اس جدول کے نیچے کاپی کی گئی قطاریں شامل کرنے کے لیے Ctrl+V دبائیں۔ منسوخ کرنے کے لیے Esc دبائیں۔';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='اس پیسٹ میں {n} قطاریں ہیں، اور ان میں سے {fit} جدول میں سما جاتی ہیں۔ باقی {extra} کو نیچے نئی قطاروں کے طور پر شامل کریں؟';
$ec_lang['lpn_pane_paste_overflow_add']='{extra} قطاریں شامل کریں';
$ec_lang['lpn_pane_paste_overflow_fit']='صرف وہ {fit} پیسٹ کریں جو سما جاتی ہیں';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='اس پیسٹ میں {n} قطاریں ہیں، اور ان میں سے {fit} جدول میں سما جاتی ہیں۔ باقی {extra} کو نئی قطاروں کے طور پر شامل نہیں کیا جا سکتا: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} IDs مماثل نہیں۔ پھر بھی پیسٹ کریں؟';
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
$ec_lang['lpn_pane_paste_no_customer_ref']='قطار {row}: نئے گاہک کو منسلک پائپ یا نوڈ درکار ہے۔';
$ec_lang['lpn_pane_paste_no_pipe']='قطار {row}: پائپ {id} ابھی موجود نہیں۔ پہلے اپنے پائپ پیسٹ کریں، پھر اپنے گاہک۔';
$ec_lang['lpn_pane_paste_no_customer_node']='قطار {row}: نوڈ {id} ابھی موجود نہیں۔ پہلے اپنے جنکشنز پیسٹ کریں، پھر اپنے گاہک۔';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='قطار {row}: نوڈ {id} کے ساتھ کوئی پائپ نہیں جس سے گاہک منسلک ہو سکے۔';
$ec_lang['lpn_pane_filled']='{n} سیل نیچے بھرے گئے۔ {skipped} تبدیل نہیں کیے گئے۔';
$ec_lang['lpn_pane_filldown']='نیچے بھریں';
$ec_lang['lpn_pane_fill_none']='اس انتخاب میں کچھ بھی نیچے نہیں بھرا جا سکتا۔';
$ec_lang['lpn_pane_ctrlenter_filled']='{n} سیل بھرے گئے۔ {skipped} تبدیل نہیں کیے گئے۔';
$ec_lang['lpn_pane_hide_col']='یہ کالم چھپائیں';
$ec_lang['lpn_pane_hide_cols']='یہ کالمز چھپائیں';
$ec_lang['lpn_pane_show_all_cols']='تمام کالمز دکھائیں';
$ec_lang['lpn_pane_sort_asc']='صعودی ترتیب دیں';
$ec_lang['lpn_pane_manage_cols']='کالمز کا انتظام کریں…';
$ec_lang['lpn_pane_manage_cols_title']='کالمز کا انتظام';
$ec_lang['lpn_pane_manage_cols_show']='دکھائیں';
$ec_lang['lpn_pane_manage_cols_up']='اوپر لے جائیں';
$ec_lang['lpn_pane_manage_cols_down']='نیچے لے جائیں';
$ec_lang['lpn_pane_manage_cols_top']='شروع میں لے جائیں';
$ec_lang['lpn_pane_manage_cols_bottom']='آخر میں لے جائیں';
$ec_lang['lpn_pane_colmenu_tip']='کالمز چھپائیں یا ان کا انتظام کریں';
$ec_lang['lpn_tool_area_window']='ونڈو منتخب کریں';
$ec_lang['lpn_tool_area_lasso']='لیسو منتخب کریں';
$ec_lang['lpn_tool_area_polygon']='کثیر الاضلاع منتخب کریں';
$ec_lang['lpn_tool_delete']='حذف کریں';
$ec_lang['lpn_tool_zoom_extent']='مکمل نقشہ دکھائیں';
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
// It's a technical term. We can only give a definition, which is not our job."). $ec_lang_syn holds
// phrases that could STAND ON THE CONTROL in place of the label; a technical term has no such
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
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
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
$ec_lang['lpn_tank_elev_tip']='ٹینک کے فرش کی بلندی۔ ٹینک میں پانی کی گہرائیاں یہاں سے اوپر کی طرف ناپی جاتی ہیں۔';
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
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='خصوصیات';
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
$ec_lang['lpn_examples_heading']='مثال کھولیں';
$ec_lang['lpn_examples_sub']='ہر مثال آپ کی اپنی کاپی کے طور پر کھلتی ہے۔ اسے تبدیل کریں، محفوظ کریں، یا نئی کاپی کھول کر دوبارہ شروع کریں۔';
$ec_lang['lpn_examples_open']='کھولیں';
$ec_lang['lpn_examples_menu']='مثال کھولیں…';
$ec_lang['lpn_examples_blank']='یا خالی نقشے سے شروع کریں';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='نوڈز: {nodes}، لنکس: {links}';
$ec_lang['lpn_examples_failed']='مثالیں لوڈ نہیں ہو سکیں۔ ڈرائنگ شروع کرنے کے لیے فائل، نیا پراجیکٹ استعمال کریں۔';
$ec_lang['lpn_examples_loading']='مثالیں لوڈ ہو رہی ہیں…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='کچھ ٹھیک کریں';
$ec_lang['lpn_help_notes']='اس صفحے سے متعلق نوٹس';
$ec_lang['lpn_help_hotkeys']='جدول اور شارٹ کٹس';
$ec_lang['lpn_hotkeys_tables_heading']='جدول';
$ec_lang['lpn_hotkeys_map_heading']='نقشہ';
$ec_lang['lpn_hotkeys_map_term']='نقشے کے کیبورڈ شارٹ کٹس';
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>1 یا Esc</td><td>منتخب کریں۔</td></tr><tr><td>2</td><td>جنکشن شامل کریں۔</td></tr><tr><td>3</td><td>ریزروائر شامل کریں۔</td></tr><tr><td>4</td><td>ٹینک شامل کریں۔</td></tr><tr><td>5</td><td>پائپ شامل کریں۔</td></tr><tr><td>6</td><td>پمپ شامل کریں۔</td></tr><tr><td>7</td><td>والو شامل کریں۔</td></tr><tr><td>8</td><td>گاہک شامل کریں۔</td></tr><tr><td>9</td><td>متن شامل کریں۔</td></tr><tr><td>Delete</td><td>انتخاب حذف کریں۔</td></tr><tr><td>Ctrl+Z</td><td>آخری تبدیلی کو واپس کریں۔</td></tr><tr><td>+ یا =</td><td>زوم ان کریں۔</td></tr><tr><td>-</td><td>زوم آؤٹ کریں۔</td></tr></tbody></table>';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='یہاں کچھ غلط ہے؟';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='ایک دبانے سے ہمیں بتایا جاتا ہے کہ اس صفحے پر کچھ غلط ہے۔ یہ اس صفحے کا نام، وہ زبان جس میں آپ اسے پڑھ رہے ہیں، اور نقشے پر موجود پیغام، اگر کوئی ہو، بھیجتا ہے۔ یہ آپ کا لکھا ہوا کچھ نہیں بھیجتا، نہ کوئی پتہ، اور نہ آپ کی ڈرائنگ سے کچھ بھی۔ کوئی جواب نہیں لکھ سکتا، کیونکہ اس سے ہمیں آپ کے بارے میں کچھ معلوم نہیں ہوتا۔ مزید کچھ کہنے کے لیے مدد، کچھ ٹھیک کریں استعمال کریں۔';
$ec_lang['lpn_wrong_thanks']='شکریہ۔ یہ ہم تک پہنچ گیا۔';
$ec_lang['lpn_status_example_opened']='{name} کھل گیا۔ یہ آپ کی کاپی ہے: اسے فائل، محفوظ کریں بطور سے محفوظ کریں۔';
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
$ec_lang['lpn_ex_basic_si_desc']='یہاں سے شروع کریں۔ ایک ریزروائر، ایک پمپ اور ایک چھوٹا لوپ: سب سے چھوٹا انتظام جو پھر بھی پانی کے نیٹ ورک کے طور پر کام کرتا ہے۔ لیٹر فی سیکنڈ، میٹر اور ملی میٹر کے ساتھ۔';
$ec_lang['lpn_ex_basic_us_title']='بنیادی نیٹ ورک، gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='وہی ابتدائی نیٹ ورک گیلن فی منٹ میں، فٹ اور انچ کے ساتھ۔';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='EPANET کے اپنے تین نمونہ نیٹ ورکس میں سب سے چھوٹا: ایک ریزروائر، ایک پمپ اور ایک لوپ۔';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='EPANET کے نمونوں میں سے ایک، ٹینک والا برانچڈ تقسیمی نظام۔';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='EPANET کا بڑا نمونہ: 92 جنکشن، 3 ٹینک اور 2 ریزروائر، جن میں سے ایک دریا ہے۔ حقیقی سائز کا ماڈل نقشے پر کیسا نظر آتا ہے یہ دیکھنے کے لیے کھولنے کے قابل۔';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3، عرض بلد/طول بلد';
$ec_lang['lpn_ex_net3_world_desc']='EPANET Net3 جیسا ہی نیٹ ورک، دنیا پر کسی من مانی جگہ رکھا گیا: اس کے احداثیات عرض بلد اور طول بلد ہیں، اور اس کے پیچھے سڑکوں کا نقشہ کھینچا گیا ہے۔';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='ایک تجارتی سائٹ، جسے زیادہ سے زیادہ روزانہ طلب کے ساتھ آگ بجھانے کے بہاؤ کے لیے، ایک لمحے کے وقت پر حل کیا گیا، سائٹ پلان پر بنایا گیا ہے۔';
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
$ec_lang['lpn_units_warn_title']='یہ یونٹ طے کرتا ہے کہ آپ کے اعداد کا مطلب کیا ہے';
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
$ec_lang['lpn_status_reinterpreted']='{n} قدروں کا اب مطلب {unit} ہے۔ کچھ بھی دوبارہ نہیں لکھا گیا۔';
$ec_lang['lpn_status_converted']='{n} قدریں {unit} میں دوبارہ لکھی گئیں۔';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
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
$ec_lang['lpn_result_water_age_tip']='اس مقام تک پہنچنے والا پانی نظام میں کتنی دیر سے موجود ہے۔ جہاں بہاؤ ملتے ہیں، وہاں پہنچنے والا پانی مختلف عمروں کا مرکب لاتا ہے، اور یہاں دیا گیا عدد بہاؤ کے لحاظ سے ان کا وزنی اوسط ہے: ایک جنکشن جسے زیادہ تر ایک مختصر نئی مین سے پانی ملتا ہے کم عمر دکھاتا ہے، چاہے ایک لمبی ڈیڈ اینڈ بھی اسے پانی دے رہی ہو۔ ٹینک میں یہ رکھے گئے پانی کی اوسط عمر ہے، اور یہی وجہ ہے کہ آہستہ گردش کرنے والا ٹینک عموماً نیٹ ورک کا سب سے پرانا پانی رکھتا ہے۔ اس کے مقابلے کے لیے کوئی ضابطہ حد مقرر نہیں، اس لیے یہ عدد اپنے نظام کے تناظر میں پرکھیں۔';
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
$ec_lang['lpn_result_head']='ہیڈ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='اس نوڈ پر پانی کی توانائی، جسے پانی کے کالم کی بلندی کے طور پر لکھا جاتا ہے۔ یہ ایک مطلق بلندی ہے، جبکہ دباؤ ایک گیج پیمائش ہے۔';
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
$ec_lang['lpn_settings_restore_tip']='صرف اسی پراجیکٹ کی ترتیبات ری سیٹ کرتا ہے۔ آپ کی ڈرائنگ اور آپ کے دیگر پراجیکٹس تبدیل نہیں ہوتے۔ اپنی پسندیدہ ترتیبات کو دوبارہ استعمال کے لیے محفوظ کرنے کے لیے، ایک ایسی پراجیکٹ فائل محفوظ کریں جس میں صرف ترتیبات ہوں۔';
$ec_lang['lpn_reset_all_tip']='ہر پراجیکٹ، ہر پس منظر کی تصویر، ہر ترتیب، اور آپ کے یونٹ کے انتخاب کو حذف کر کے صفحہ کو بالکل اسی طرح دوبارہ لوڈ کرتا ہے جیسے ایک نیا وزیٹر دیکھتا ہے۔ یہ واحد ری سیٹ ہے جو سب کچھ صاف کرتا ہے۔';
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
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='تبدیل بطور';
$ec_lang['lpn_convas_coordsys_tip']='وہ احداثی نظام جس میں کاپی تبدیل کی جاتی ہے۔ جب یہ اس پراجیکٹ کے نظام سے مختلف ہو تو جگہ کے تعین کے دو مراحل آتے ہیں۔ جو پراجیکٹ پہلے سے جانتا ہو کہ وہ کہاں ہے وہ دونوں مراحل پہلے سے جواب شدہ کھولتا ہے، اس لیے آپ انہیں ویسے ہی قبول کر سکتے ہیں یا تبدیلیاں کر سکتے ہیں۔';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='موجودہ: {crs}';
$ec_lang['lpn_convas_epsg']='EPSG احداثی نظام';
$ec_lang['lpn_convas_epsg_tip']='EPSG رجسٹر سے ایک احداثی نظام منتخب کریں۔ عرض بلد اور طول بلد WGS 84 (EPSG:4326) ہے۔';
$ec_lang['lpn_convas_unnamed']='بلا نام (مقامی) جغرافیائی حوالہ';
$ec_lang['lpn_convas_unnamed_tip']='لمبائی کے یونٹ میں مقامی احداثیات، دنیا کے نقشے کے ساتھ منسلک۔';
$ec_lang['lpn_convas_none_tip']='لمبائی کے یونٹ میں مقامی احداثیات، ابھی کے لیے بغیر دنیا کے نقشے کے۔';
$ec_lang['lpn_convas_units_tip']='وہ یونٹس جن میں کاپی تبدیل کی جاتی ہے۔ اصل اپنے عدد اور یونٹس برقرار رکھتی ہے۔';
$ec_lang['lpn_convas_round']='تبدیل شدہ قدریں گول کریں';
$ec_lang['lpn_convas_round_tip']='صرف وہ عدد گول کرتا ہے جنہیں یہ تبدیلی دوبارہ لکھتی ہے، آپ کے چنے گئے قریب ترین قدم تک۔ جن قدروں کا یونٹ نہیں بدلتا وہ ویسے ہی رہتی ہیں۔';
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
$ec_lang['lpn_file_convert_as_tip']='اس پراجیکٹ کو ایک نئے ٹیب میں کاپی کرتا ہے اور کاپی کو آپ کے چنے گئے احداثی نظام اور یونٹس میں تبدیل کرتا ہے۔ جب احداثی نظام بدلتا ہے تو ایک وزرڈ آپ کو پہلے تقریباً آپ کے نیٹ ورک کے پیچھے نقشے کو زوم کرنے، پھر نقشے پر آپ کے نیٹ ورک کو زیادہ باریکی سے پیمانہ اور گھمانے میں رہنمائی کرتا ہے۔ یہ پراجیکٹ بالکل ویسا ہی رہتا ہے جیسا ہے۔ کچھ بھی تبدیل کیے بغیر جغرافیائی حوالہ دینے کے لیے اس کی بجائے نقشہ، دنیا کا نقشہ، منسلک کریں استعمال کریں۔';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='یہ پراجیکٹ پہلے سے جغرافیائی حوالہ شدہ ہے، اس لیے نیٹ ورک پہلے سے نقشے پر ہے اور کچھ بھی منتقل نہیں کیا گیا۔ چیک کریں کہ یہ صحیح جگہ پر ہے، پھر ماڈل یہاں رکھیں بٹن اور یہ جگہ برقرار رکھیں بٹن دبائیں۔';
$ec_lang['lpn_georef_intro']='ماڈل رکھنے کے دو مرحلے ہیں۔ مرحلہ 1 تیز ہے: ماڈل ساکت رہتا ہے اور آپ اس کے پیچھے نقشہ حرکت دیتے ہیں، جب تک آپ کا مقام تقریباً درست سائز پر ماڈل کے نیچے نہ آ جائے۔ ابھی تک کوئی گردش نہیں ہوتی۔ مرحلہ 2 باریک بین ہے: آپ خود ماڈل کو گھسیٹتے، اس کا سائز بدلتے اور گھماتے ہیں۔ آپ کا پراجیکٹ شروع میں پوری دنیا کے نقشے پر ہوتا ہے، اس لیے پہلے اپنا مقام تلاش کریں، پھر ماڈل یہاں رکھیں بٹن دبائیں۔';
$ec_lang['lpn_georef_adjust']='ماڈل اب زمین پر ہے، اس لیے یہ نقشے کے ساتھ حرکت کرتا ہے۔ اسے منتقل کرنے کے لیے ماڈل کو گھسیٹیں، اس کا سائز بدلنے کے لیے کسی کونے کو گھسیٹیں، اسے گھمانے کے لیے ماڈل کے اوپر گول ہینڈل کو گھسیٹیں۔ یا نیچے زمینی فاصلہ اور گردش کا زاویہ لکھیں۔';
$ec_lang['lpn_georef_step1']='مرحلہ 1 از 2 — تیز';
$ec_lang['lpn_georef_step2']='مرحلہ 2 از 2 — باریک بین';
$ec_lang['lpn_georef_step1_hint']='آپ کا پراجیکٹ سکرین پر جہاں ہے وہیں رہتا ہے۔ اس کے نیچے نقشے کو pan اور zoom کریں جب تک اس کے پیچھے کی زمین تقریباً درست جگہ اور تقریباً درست سائز پر نہ آ جائے، پھر ماڈل یہاں رکھیں بٹن دبائیں۔';
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
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='ہدایت کے مطابق نقشے پر کلک کریں تاکہ شکل کے اندر موجود ہر چیز منتخب ہو جائے۔ شکل کو ونڈو، لیسو اور کثیر الاضلاع کے درمیان بدلنے کے لیے یہ بٹن دوبارہ دبائیں۔ منتخب کرتے وقت Shift دبائے رکھیں تاکہ موجودہ انتخاب کے ساتھ جاری رکھا جا سکے، جو آپ منتخب کریں اسے شامل یا خارج (ٹوگل) کرتے ہوئے۔';
$ec_lang['lpn_area_selected']='{n} منتخب۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='اس رقبے میں کچھ نہیں ملا۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='نقشے پر پائپ کی شکل بنانے والے موڑ نقاط شامل یا حذف کریں۔ پائپ پر کلک کر کے موڑ نقطہ شامل کریں، کسی موڑ نقطے پر کلک کر کے اسے حذف کریں، اور کسی موڑ نقطے کو گھسیٹ کر منتقل کریں۔ موڑ نقطہ صرف پائپ کا کھینچا ہوا راستہ بدلتا ہے، ہائیڈرالکس نہیں۔';
$ec_lang['lpn_tool_undo_tip']='آخری تبدیلی کالعدم کریں۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='پورا نیٹ ورک ونڈو میں فٹ کریں۔';
$ec_lang['lpn_tool_zoom_window_tip']='اس پر زوم کرنے کے لیے نقشے پر ڈبے کے دو مخالف کونے کلک کریں، یا ایک کو گھسیٹیں۔ مکمل نقشہ دکھائیں کے لیے یہ بٹن دوبارہ دبائیں۔';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='زوم ان کریں۔ شارٹ کٹ: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='زوم آؤٹ کریں۔ شارٹ کٹ: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='کسی عنصر کو اس کی ID سے تلاش کریں، یا کسی شرط پر پورا اترنے والے ہر عنصر کو تلاش کریں، اور انہیں ایک ساتھ بدل دیں۔';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='ٹول بار';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='نمائش';
$ec_lang['lpn_color_legend_open_tip']='یہ رنگ تبدیل کرنے کے لیے نمائش پینل کھولنے کے لیے کلک کریں۔';
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
$ec_lang['lpn_color_criterion_note']='یہ طریقہ اپنی حدیں ایک ڈیزائن معیار سے لیتا ہے، اس لیے جب تک یہ طریقہ منتخب رہے رنگوں کی تعداد مقرر رہتی ہے۔';
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
$ec_lang['lpn_georef_scale_tip']='آپ کی ڈرائنگ کی ایک اکائی زمین پر کتنی دور تک پہنچتی ہے۔ سادہ گرڈ پر بنائی گئی ڈرائنگ عام طور پر اس بارے میں کچھ نہیں بتاتی، اس لیے اسے یہاں مقرر کریں — یا جائیں… کو سائٹ کی چوڑائی پوچھنے اور خود حساب لگانے دیں۔';
$ec_lang['lpn_georef_rotation']='گھڑی کی مخالف سمت گھمائیں (ڈگری)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='پورے ماڈل کو گھڑی کی مخالف سمت کتنا گھمانا ہے، تاکہ اس کی شمالی سمت اصل شمال کی طرف ہو۔';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='ماڈل کو یہاں مستقل طور پر رکھیں؟ آپ بعد میں بھی عناصر کو ایک ایک کر کے گھسیٹ سکتے ہیں، لیکن ڈرائنگ xy پراجیکٹ نہیں رہے گی۔ xy واپس پانے کے لیے، اس پراجیکٹ کو بغیر محفوظ کیے بند کریں۔';
$ec_lang['lpn_georef_done']='یہ اب عرض بلد/طول بلد پراجیکٹ ہے۔ کسی بھی عنصر کو گھسیٹ کر اس کے اصل مقام کے قریب لے جائیں۔';
$ec_lang['lpn_georef_backdrop_unrotated']='پس منظر کی تصویر ماڈل کے ساتھ منتقل اور نئے سائز کی گئی، لیکن اسے گھمایا نہیں جا سکا۔ اسے سیدھا کرنے کے لیے نقشہ، Background image، Move استعمال کریں۔';
$ec_lang['lpn_georef_empty']='اس فائل میں کوئی نیٹ ورک نہیں، اس لیے رکھنے کو کچھ نہیں۔';
$ec_lang['lpn_georef_unavailable']='جگہ مقرر کرنے کا ٹول لوڈ نہیں ہوا۔ صفحہ دوبارہ لوڈ کر کے دوبارہ کوشش کریں۔';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='پراجیکٹس بدلنے سے پہلے "یہ جگہ رکھیں" بٹن سے جگہ کا تعین مکمل کریں، یا منسوخ کریں دبائیں۔ یہ جگہ کا تعین اسی پراجیکٹ سے تعلق رکھتا ہے اور کسی دوسرے پراجیکٹ میں آپ کے ساتھ نہیں جا سکتا۔';
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
$ec_lang['lpn_georef_twopt_tip']='جب آپ کو اپنی ڈرائنگ پر دو پوائنٹس کا اصل مقام پہلے سے معلوم ہو تو ماڈل کو ٹھیک ٹھیک جگہ پر رکھیں۔ ان میں سے ایک پر کلک کریں، اس کا عرض بلد اور طول بلد لکھیں، پھر دوسرے پوائنٹ کے لیے یہی کریں۔ پوزیشن، پیمانہ اور گردش سب انہی دو پوائنٹس سے طے ہو جاتے ہیں۔ چننا روکنے کے لیے یہ بٹن دوبارہ دبائیں۔';
$ec_lang['lpn_georef_twopt_pick1']='ڈرائنگ پر وہ پوائنٹ کلک کریں جس کا عرض بلد اور طول بلد آپ کو معلوم ہے۔';
$ec_lang['lpn_georef_twopt_pick2']='اب دوسرا معلوم پوائنٹ کلک کریں، جو پہلے سے جتنا ممکن ہو دور ہو۔';
$ec_lang['lpn_georef_twopt_same']='یہ وہی پوائنٹ ہے جو آپ نے پہلے چنا تھا۔ کوئی مختلف پوائنٹ چنیں۔';
$ec_lang['lpn_georef_twopt_done']='ماڈل اب آپ کے دیے گئے دونوں پوائنٹس پر بیٹھ گیا ہے۔ اسے جانچیں، پھر یہ جگہ برقرار رکھیں بٹن دبائیں۔';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='نچلا پینل';
$ec_lang['lpn_pane_toggle_tip']='نقشے کے نیچے موجود پینل کو دکھائیں یا چھپائیں۔ اس میں پروفائل اور ہر قسم کے حصے کا جدول ہوتا ہے۔';
$ec_lang['lpn_pane_resize']='پینل کو لمبا یا چھوٹا کرنے کے لیے گھسیٹیں';
$ec_lang['lpn_pane_tab_junctions']='جنکشنز';
$ec_lang['lpn_pane_tab_reservoirs']='ریزروائرز';
$ec_lang['lpn_pane_tab_tanks']='ٹینکس';
$ec_lang['lpn_pane_tab_pipes']='پائپس';
$ec_lang['lpn_pane_tab_pumps']='پمپس';
$ec_lang['lpn_pane_tab_valves']='والوز';
$ec_lang['lpn_pane_tab_tip']='یہ ٹیب اس قسم کے عناصر کو ایک جدول کے طور پر دکھاتا ہے جسے آپ ترتیب دے سکتے اور ترمیم کر سکتے ہیں۔ نتیجے کے کالمز میں ترمیم نہیں کی جا سکتی۔';
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
$ec_lang['lpn_pane_filter_stale']='اب مطابقت نہ رکھنے والی قطاریں: {n}۔';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='اس جدول میں کچھ بھی فلٹر سے مطابقت نہیں رکھتا۔';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='زوم اور منتخب کریں';
$ec_lang['lpn_goto_on_map']='نقشے پر دکھائیں';
$ec_lang['lpn_pane_select_on_map']='نقشے پر منتخب کریں';
$ec_lang['lpn_pane_unselect_on_map']='نقشے پر انتخاب ختم کریں';
$ec_lang['lpn_pane_print']='جدول پرنٹ کریں';

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
$ec_lang['lpn_menu_project']='پانی';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='پانی کے نیٹ ورک کی ماڈلنگ سے متعلق ہر چیز یہاں ایک جگہ موجود ہے، سوائے اینیمیشن چلانے کے کنٹرولز کے۔ کسی چیز کی جگہ کا اندازہ لگانے کی ضرورت نہیں۔';
$ec_lang['lpn_tables_menu']='جدولیں';
$ec_lang['lpn_tables_menu_tip']='نقشے کے نیچے موجود پینل کو اس نیٹ ورک کے پرزوں کے جدول پر کھولیں۔ ہر قسم کے پرزے کا اپنا ایک جدول ہے، جسے آپ وہیں ترتیب دے سکتے اور ترمیم کر سکتے ہیں۔';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='یہ نیٹ ورک ابھی دوبارہ حل کریں۔ حل کریں بٹن ڈھونڈ رہے ہیں؟ یہ اس وقت چھپا ہوا ہے جب خود بخود دوبارہ حل کریں کی ترتیب آن ہو۔ بٹن واپس لانے کے لیے، ترتیبات، حساب، ہائیڈرالکس میں خود بخود دوبارہ حل کریں بند کریں۔';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='خود بخود دوبارہ حل کریں';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='جب یہ آن ہو، تو یہ پراجیکٹ آپ کی ہر تبدیلی کے تھوڑی دیر بعد خود بخود دوبارہ حل ہوتا ہے، اور حل کریں کا بٹن ٹول بار سے ہٹا دیا جاتا ہے کیونکہ اس کے کرنے کو کچھ باقی نہیں رہتا۔ ایک بڑے نیٹ ورک پر اسے بند کریں، جہاں ہر تبدیلی کے دوبارہ حل ہونے کا انتظار ٹائپ کرنے میں رکاوٹ بنتا ہے، اور حل کریں کا بٹن واپس آ جاتا ہے تاکہ آپ خود چنیں کہ کب چلانا ہے۔';
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
$ec_lang['lpn_time_no_report']='ابھی تک کوئی رن رپورٹ نہیں ہے۔ یہ رپورٹ خود EPANET کی تحریر ہے، اس لیے یہ اسی وقت ظاہر ہوتی ہے جب یہ نیٹ ورک EPANET حل کار سے حل کیا جا چکا ہو۔';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
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
$ec_lang['lpn_find_title']='تلاش اور تبدیلی';
$ec_lang['lpn_find_scope']='کیا تلاش کرنا ہے';
$ec_lang['lpn_find_scope_all']='سب کچھ';
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
$ec_lang['lpn_find_filter_tip']='نقشے کے نیچے موجود جدولوں میں سے کسی ایک میں صرف وہی حصے دکھائیں جو اس استفسار سے مطابقت رکھتے ہیں۔ ڈرائنگ تبدیل نہیں ہوتی اور کچھ حذف نہیں ہوتا۔';
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
$ec_lang['lpn_find_count']='{n} ملے۔ کسی پر جانے کے لیے اس پر کلک کریں۔';
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
$ec_lang['lpn_find_no_value']='تلاش کرنے کے لیے کچھ ٹائپ کریں۔';
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
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='ہر نوڈ منسلک ہے۔';
$ec_lang['lpn_find_conn_no_fixed']='اس نیٹ ورک میں کوئی ریزروائر یا ٹینک نہیں، اس لیے پہنچنے کے لیے کوئی ذریعہ نہیں۔ صرف نوڈ پر کوئی لنک نہیں اور نوڈ پر کوئی کھلا لنک نہیں تلاش کیے جا سکتے ہیں۔';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='وہی تلاش، ایک سطر میں لکھی ہوئی۔ کنٹرولز بدلنے سے یہ سطر دوبارہ لکھی جاتی ہے، اور اس سطر میں لکھنے سے کنٹرولز اپ ڈیٹ ہو جاتے ہیں۔';
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
$ec_lang['lpn_replace_asked']='{n} نوڈز کے لیے بلندیاں مانگی گئیں۔ نتائج آ رہے ہیں۔';
$ec_lang['lpn_replace_btn']='بدلیں';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='{n} عناصر بدلیں؟';
$ec_lang['lpn_replace_apply']='انہیں بدلیں';
$ec_lang['lpn_replace_done']='{n} عناصر بدل دیے گئے۔ آپ اسے ایک ہی مرحلے میں کالعدم کر سکتے ہیں۔';
$ec_lang['lpn_replace_none']='کچھ نہیں بدلے گا۔';
$ec_lang['lpn_replace_no_value']='نئی قدر ٹائپ کریں۔';
$ec_lang['lpn_replace_scope']='قدریں بدلنے کے لیے اوپر ایک قسم کا عنصر چنیں۔';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='پروفائل';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_title']='راستے کے ساتھ پروفائل';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='اس نوڈ پر کلک کریں جہاں سے راستہ شروع ہوتا ہے۔';
$ec_lang['lpn_profile_draw_more']='راستہ دیکھنے کے لیے نقشے پر کرسر پھیریں۔ کسی نوڈ کو شامل کرنے کے لیے اس پر کلک کریں۔ ختم کرنے کے لیے ڈبل کلک کریں۔ منسوخ کرنے کے لیے Esc دبائیں۔';
$ec_lang['lpn_profile_draw_blocked']='{a} سے {b} تک کوئی راستہ نہیں۔ کوئی اور نوڈ چنیں۔';
$ec_lang['lpn_profile_tap_start']='اس نوڈ پر تھپتھپائیں جہاں سے راستہ شروع ہوتا ہے۔';
$ec_lang['lpn_profile_tap_more']='راستہ دیکھنے کے لیے کسی نوڈ پر تھپتھپائیں۔ اسے شامل کرنے کے لیے دبائے رکھیں۔ ختم کرنے کے لیے ڈبل ٹیپ کریں۔ منسوخ کرنے کے لیے دوبارہ پروفائل دبائیں۔';
$ec_lang['lpn_profile_say_idle']='نقشے پر نیا راستہ چننے کے لیے دوبارہ پروفائل دبائیں۔';
$ec_lang['lpn_profile_none']='ابھی تک کوئی راستہ نہیں۔ نقشے پر ایک چننے کے لیے دوبارہ پروفائل دبائیں۔';
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
$ec_lang['lpn_profile_edit_click']='راستے کے کسی بھی پوائنٹ کو گھسیٹ کر منتقل کریں۔ جو پوائنٹ آپ نے شامل کیا تھا اسے ہٹانے کے لیے اس پر کلک کریں۔';
$ec_lang['lpn_profile_edit_tap']='راستے کے کسی بھی پوائنٹ کو گھسیٹ کر منتقل کریں۔ جو پوائنٹ آپ نے شامل کیا تھا اسے ہٹانے کے لیے اسے تھپتھپائیں۔';
$ec_lang['lpn_profile_edit_nowhere']='راستے کا کوئی پوائنٹ نوڈ ہی ہونا چاہیے۔ راستہ تبدیل نہیں ہوا۔';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='محفوظ شدہ راستے';
$ec_lang['lpn_profile_new']='نیا محفوظ راستہ…';
$ec_lang['lpn_profile_new_name']='راستہ {n}';
$ec_lang['lpn_profile_rename']='راستے کا نام بدلیں…';
$ec_lang['lpn_profile_delete']='راستہ حذف کریں';
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
$ec_lang['lpn_ts_tip']='ایک وقتی دورانیے کی سمولیشن کے دوران ایک یا زیادہ اثاثوں کو وقت کے مقابلے میں گراف کریں۔';
$ec_lang['lpn_ts_title']='قدریں بمقابلہ وقت';
$ec_lang['lpn_ts_group_nodes']='نوڈز';
$ec_lang['lpn_ts_group_links']='لنکس';
$ec_lang['lpn_ts_add']='منتخب شامل کریں';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='نقشے پر اس قسم کی کوئی چیز منتخب نہیں۔';
$ec_lang['lpn_ts_clear']='سب ہٹا دیں';
$ec_lang['lpn_ts_chip_tip']='{id} کو گراف سے ہٹائیں';
$ec_lang['lpn_ts_none']='ابھی گراف کرنے کو کچھ نہیں۔ نقشے پر اثاثے چنیں اور منتخب شامل کریں دبائیں۔';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='ابھی تک کوئی توسیعی دورانیے کے نتائج نہیں۔ سمولیشن چلانے کے لیے حل کریں دبائیں۔';
$ec_lang['lpn_ts_summary']='اثاثے: {n}، رپورٹنگ اوقات: {steps}';
$ec_lang['lpn_ts_axis_time']='گزرا ہوا وقت';
$ec_lang['lpn_freq_menu']='تعدد';
$ec_lang['lpn_freq_tip']='موجودہ ٹائم اسٹیپ پر تمام جنکشنز یا تمام پائپس میں کسی ایک خاصیت کی تعدد تقسیم گراف کریں۔';
$ec_lang['lpn_freq_title']='قدروں کی تقسیم';
$ec_lang['lpn_freq_none']='ابھی اس قدر کے کوئی نتائج نہیں، اس لیے گراف کرنے کو کچھ نہیں۔';
$ec_lang['lpn_freq_summary']='پلاٹ کردہ: {total} میں سے {n}';
$ec_lang['lpn_freq_summary_time']='پلاٹ کردہ: {total} میں سے {n}، بوقت {time}';
$ec_lang['lpn_freq_axis_percent']='اس سے کم فیصد';
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
$ec_lang['lpn_new_title']='نیا پراجیکٹ';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='احداثی نظام';
$ec_lang['lpn_new_coordsys_tip']='اپنے نیٹ ورک کا احداثی نظام منتخب کریں۔ یہ مستقل ہے؛ نیٹ ورک کو مختلف احداثیات میں تبدیل کرنے کا واحد طریقہ "فائل، نقشے پر xy فائل کھولیں…" ہے، اور یہ تخمینی ہے۔';
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
// **THE SUB-BOX'S OWN TITLE** (Tom, 2026-09-25). Shared by the New project box and Convert as, so
// it names the box's own subject rather than either caller's radio label.
// The spatial filter. A zoned system covers a strip of the Earth and nothing outside it, so a place
// answers most of the question by itself: searching a town in Arizona leaves two UTM zones standing
// out of a hundred and twenty.
$ec_lang['lpn_crs_view']='نقشے کے منظر کے مطابق فلٹر کریں';
$ec_lang['lpn_crs_view_tip']='صرف وہ پروجیکشنز پیش کرتا ہے جو اس جگہ کا احاطہ کرتے ہیں جسے نقشہ فی الحال دکھا رہا ہے۔ پوری فہرست دیکھنے کے لیے اسے بند کر دیں۔';
$ec_lang['lpn_crs_place']='جگہ کے نام کی تلاش';
$ec_lang['lpn_crs_place_tip']='کوئی شہر، پتہ، یا نشان لکھیں، اور نقشے کا منظر وہاں چلا جائے گا۔ آپ کے لکھے گئے الفاظ OpenStreetMap کی جگہ کے نام کی سروس کو بھیجے جاتے ہیں، جو پہلی بار آپ کی اجازت مانگتی ہے۔ نیا جغرافیائی پراجیکٹ بھی اسی جگہ سے شروع ہوتا ہے جو آپ یہاں تلاش کریں۔';
$ec_lang['lpn_crs_search']='تلاش کریں';
$ec_lang['lpn_crs_name']='پروجیکشن کے نام کا فلٹر';
$ec_lang['lpn_crs_name_tip']='صرف وہ پروجیکشنز دکھاتا ہے جن کے نام یا EPSG کوڈ میں وہ شامل ہو جو آپ ٹائپ کریں۔ کوئی زون نمبر، یا UTM، یا Mercator آزمائیں۔';
$ec_lang['lpn_crs_list_tip']='اوپر کے دونوں فلٹرز کے بعد باقی رہ جانے والی پروجیکشنز۔ ایک منتخب کریں اور منتخب کریں دبائیں۔';
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
$ec_lang['lpn_new_units_tip']='ایک پراجیکٹ اپنی یونٹس خود رکھتا ہے، اس لیے یہ انتخاب صرف اسی پراجیکٹ کا ہے اور یہاں کچھ بھی براؤزر کی ترتیب کے طور پر محفوظ نہیں ہوتا۔ نئے پراجیکٹس کو کسی خاص انداز میں شروع کرنے کے لیے، ایک خالی پراجیکٹ کو اپنے ٹیمپلیٹ کے طور پر محفوظ کریں اور ہر بار اس کی ایک کاپی بنائیں۔';
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
$ec_lang['lpn_file_import_menu']='درآمد کریں…';
$ec_lang['lpn_file_import_inp']='EPANET فائل درآمد کریں…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='کسی EPANET فائل سے نیٹ ورک پڑھیں، خواہ وہ .inp متنی فائل ہو یا EPANET کی محفوظ کردہ .net فائل، اور اسے اس براؤزر میں ایک نئے پراجیکٹ کے طور پر محفوظ کریں۔';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='EPANET فائل برآمد کریں…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='اس نیٹ ورک کو EPANET .inp فائل کے طور پر لکھیں اور ڈاؤن لوڈ کریں۔ آپ نے جو اعداد ٹائپ کیے وہ بالکل اسی طرح لکھے جاتے ہیں جیسے آپ نے انہیں ٹائپ کیا تھا۔ جو کچھ .inp فارمیٹ نہیں رکھ سکتا وہ بعد میں آپ کے لیے فہرست میں دکھایا جاتا ہے۔';
$ec_lang['lpn_status_inp_exported']='{file} برآمد ہوئی۔';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} چیزیں جو .inp فارمیٹ نہیں رکھ سکتا۔';
$ec_lang['lpn_inp_export_refused']='یہ پراجیکٹ EPANET فائل کے طور پر نہیں لکھا جا سکتا: {detail}';
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
$ec_lang['lpn_inp_report_lead']='یہ صفحہ EPANET کی ہر چیز استعمال نہیں کرتا، مگر آپ کی فائل میں کچھ بھی ضائع نہیں کیا جاتا۔ نیچے وہ ہے جو آپ کی فائل رکھتی ہے اور یہ صفحہ استعمال کیے بغیر محفوظ رکھتا ہے، اور جو فائل پڑھے جانے پر بدلا گیا:';
$ec_lang['lpn_inp_drop_headloss']='یہ فائل ہیزن-ولیمز فارمولا استعمال نہیں کرتی۔ یہ صفحہ ہیزن-ولیمز کا حساب لگاتا ہے، اس لیے پائپ کی کھردرا پن کی قدریں بالکل ویسے ہی رکھی گئیں جیسے لکھی گئی تھیں، لیکن یہاں کے جوابات EPANET کے جوابات سے میل نہیں کھائیں گے۔';
$ec_lang['lpn_inp_drop_tank_curve']='یہ ٹینک سیدھی دیواروں والے نہیں ہیں: فائل ان کی شکل ایک وکر کے طور پر دیتی ہے۔ وکر لائبریریاں خانے میں محفوظ رکھا جاتا ہے، ٹینک اب بھی اس کا حوالہ دیتا ہے، اور وقتی دورانیے کی سمولیشن ٹینک کو اسی وکر کے مطابق بھرتی اور خالی کرتی ہے۔ ایک اکیلا لمحہ دونوں صورتوں میں ایک جیسا ہے، کیونکہ پانی کی سطح وہی ہے جو فائل مقرر کرتی ہے۔ فائل میں لکھا قطر وکر کے ساتھ محفوظ رکھا جاتا ہے اور یہی وہ قطر ہے جس کے ساتھ بغیر وکر والا ٹینک کھینچا اور حل کیا جاتا ہے۔';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='یہ تھروٹل والوز تھروٹل والوز کے طور پر شامل ہوئے، وہی نقصان برقرار رکھتے ہوئے جو فائل انہیں دیتی ہے۔ دونوں میں سے کوئی بھی حل کار انہیں حل کر سکتا ہے۔';
$ec_lang['lpn_inp_drop_valve_active']='یہ والوز دباؤ یا بہاؤ کو کنٹرول کرتے ہیں، اور پانی کی تبدیلی کے ساتھ خود بخود کھلتے اور بند ہوتے ہیں۔ ان کے بارے میں راستے میں کچھ بھی ضائع نہیں ہوا، اور یہ صفحہ انہیں EPANET حل کار سے حل کرتا ہے، اس نیٹ ورک کے لیے وہ حل کار خود بخود چالو کرتے ہوئے۔';
$ec_lang['lpn_inp_drop_valve']='ان والوز کو منحنی خط یا ایک مقررہ دباؤ گراوٹ سے بیان کیا گیا ہے، اور اس صفحے پر ایسا کوئی عنصر نہیں۔ یہ کھلے پائپوں کے طور پر آئے، اس لیے نیٹ ورک اب بھی جڑا ہوا ہے، مگر وہاں اب دباؤ یا بہاؤ کو کوئی کنٹرول نہیں کرتا۔';
$ec_lang['lpn_inp_drop_cv']='EPANET میں یہ پائپ صرف ایک سمت میں پانی گزرنے دیتے ہیں۔ یہ عام پائپوں کے طور پر شامل ہوئے، اس لیے اب ان میں سے پانی کسی بھی سمت بہہ سکتا ہے۔';
$ec_lang['lpn_inp_drop_demands']='ان جنکشنز کی ایک سے زیادہ طلب تھی۔ طلبات کو جمع کر کے اس صفحے کی رکھی گئی واحد طلب میں شامل کر دیا گیا۔';
$ec_lang['lpn_inp_drop_patterns']='اس صفحے نے طلب کے پیٹرن نہیں پڑھے، کیونکہ اس کا وہ حصہ جو وقتی دورانیے کی سمولیشن چلاتا ہے لوڈ نہیں ہوا۔ ہر طلب وہی عدد ہے جو فائل میں لکھا گیا ہے۔';
$ec_lang['lpn_inp_drop_demand_pattern']='یہ جنکشنز رن کے دوران اپنی طلب تبدیل کرتے ہیں۔ ان کے پیٹرن پورے شامل ہوئے، اور جو طلب آپ دیکھ رہے ہیں وہ اسی لمحے کی ہے جو گھڑی دکھا رہی ہے۔';
$ec_lang['lpn_inp_drop_emitters']='ان جنکشنز کا ایک سپرنکلر یا رساؤ گتانک ہے۔ اسے رکھا گیا ہے اور یہ حل کیا جا رہا ہے، لیکن ابھی اس صفحے پر اسے دیکھنے یا تبدیل کرنے کی کوئی جگہ نہیں۔';
$ec_lang['lpn_inp_drop_curve_long']='اس پمپ وکر کے تین سے زیادہ پوائنٹس تھے۔ اس کے سب سے نچلے، درمیانے اور سب سے اونچے پوائنٹس رکھے گئے، کیونکہ یہ صفحہ زیادہ سے زیادہ تین پوائنٹس پر وکر فٹ کرتا ہے۔';
$ec_lang['lpn_inp_drop_curve_missing']='یہ پمپ ایک ایسے وکر کا حوالہ دیتا ہے جو فائل میں موجود نہیں۔ پمپ بغیر کسی وکر کے شامل ہوا، اس لیے یہ کوئی ہیڈ شامل نہیں کرتا۔';
$ec_lang['lpn_inp_drop_pump_other']='اس پمپ کو منحنی خط کے بجائے اس کی کھینچی گئی طاقت سے بیان کیا گیا ہے۔ یہ بغیر کسی منحنی خط کے آیا، اس لیے یہ کوئی ہیڈ شامل نہیں کرتا۔';
$ec_lang['lpn_inp_drop_head_pattern']='یہ ریزروائرز رن کے دوران بلند اور پست ہوتے ہیں۔ ان کے پیٹرن پورے شامل ہوئے، اور جو پانی کی سطح آپ دیکھ رہے ہیں وہ اسی لمحے کی ہے جو گھڑی دکھا رہی ہے۔';
$ec_lang['lpn_inp_drop_pump_speed']='یہ پمپ اس رفتار کے علاوہ کسی اور رفتار پر چلتے ہیں جس پر ان کا وکر ناپا گیا تھا، یا رن کے دوران رفتار بدلتے ہیں۔ رفتار اور اس کا پیٹرن پورے شامل ہوئے، اور جو ہیڈ آپ دیکھ رہے ہیں وہ اسی لمحے کا ہے جو گھڑی دکھا رہی ہے۔';
$ec_lang['lpn_inp_drop_setting']='یہ پائپ، پمپ اور والوز ایک ایسی ترتیب رکھتے ہیں جو یہ صفحہ نہیں رکھ سکتا۔ یہ کھلی حالت میں شامل ہوئے۔';
$ec_lang['lpn_inp_drop_rules']='اس فائل میں قاعدہ پر مبنی کنٹرولز ہیں۔ یہ صفحہ انہیں پڑھتا اور استعمال کرتا ہے۔ EPANET انجن کے ساتھ ماڈل چلائیں تو قواعد لاگو ہو جاتے ہیں، اور ان میں موجود ہر سطح، دباؤ اور بہاؤ اس یونٹ میں بدل دیا جاتا ہے جو یہ پراجیکٹ دکھا رہا ہے۔ کسی قاعدے کو پڑھنے یا بدلنے کے لیے لائبریریاں کے تحت قواعد کھولیں۔ یہ بالکل ویسے ہی محفوظ رکھے جاتے ہیں جیسے فائل بیان کرتی ہے، اور اگر آپ EPANET فائل محفوظ کریں تو واپس لکھے جاتے ہیں۔';
$ec_lang['lpn_inp_drop_eps']='یہ فائل ایک وقتی دورانیے کی سمولیشن بیان کرتی ہے۔ اس صفحے کا وہ حصہ جو وقتی دورانیے کی سمولیشن چلاتا ہے لوڈ نہیں ہوا، اس لیے صرف ابتدائی حالات شامل ہوئے۔';
$ec_lang['lpn_inp_drop_quality']='یہ فائل بیان کرتی ہے کہ پانی کا معیار سفر کے دوران کیسے بدلتا ہے: پانی میں شروع میں کیا موجود ہے، اور یہ مادہ پائپوں اور ٹینکوں میں کتنی تیزی سے رد عمل ظاہر کرتا ہے۔ یہ صفحہ یہ اعداد پڑھتا اور استعمال کرتا ہے۔ ترتیبات، حساب کتاب، پانی کا معیار کے تحت ایک کیمیکل چنیں، پھر EPANET انجن کے ساتھ ماڈل چلائیں، اور ارتکاز رن کے دوران پورے نیٹ ورک میں نکالا جاتا ہے۔ یہ سطریں محفوظ رکھی جاتی ہیں، اور اگر آپ EPANET فائل محفوظ کریں تو واپس لکھی جاتی ہیں۔';
$ec_lang['lpn_inp_drop_sources_mixing']='یہ فائل بتاتی ہے کہ کیمیکل نیٹ ورک میں کہاں شامل کیا جاتا ہے، اور ٹینک میں پانی کیسے ملتا ہے۔ خوراک اسی نوڈ پر ظاہر ہوتی ہے جہاں یہ شامل کی گئی ہے، اور ٹینک بتاتا ہے کہ وہ کون سا مکسنگ ماڈل پیروی کرتا ہے۔ خوراک اور مکسنگ ماڈل دونوں صرف EPANET انجن کے ذریعے حساب کیے جاتے ہیں۔';
$ec_lang['lpn_inp_drop_energy']='اس EPANET فائل میں پمپنگ لاگت ماڈلنگ کا ڈیٹا شامل ہے۔ یہ صفحہ اسے پڑھتا اور استعمال کرتا ہے۔ EPANET انجن کے ساتھ ماڈل چلائیں، پھر ہر پمپ کتنی دیر چلا، اس نے کتنی طاقت کھینچی، کتنی توانائی استعمال کی اور اس کی قیمت کیا رہی، یہ دیکھنے کے لیے پانی، رپورٹس، پمپ توانائی کھولیں۔ یہ سطریں محفوظ رکھی جاتی ہیں، اور اگر آپ EPANET فائل محفوظ کریں تو واپس لکھی جاتی ہیں۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='اس فائل میں کچھ جنکشنز، پائپوں یا دیگر اثاثوں کو ٹیگ دیے گئے ہیں۔ ہر ٹیگ پورا شامل ہوا، اور ہر ایک اپنے اثاثے کی خصوصیات میں موجود ہے، جہاں آپ اسے پڑھ یا بدل سکتے ہیں۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='اس فائل میں EPANET کی اپنی ترتیبات موجود ہیں کہ وہ اپنی چھاپی گئی رپورٹ کو کس انداز میں مرتب کرتا ہے۔ آپ انجن کی رپورٹ یہاں، رپورٹس، EPANET رن کے تحت پڑھ سکتے ہیں، مگر یہ انجن کے معیاری انداز میں آتی ہے، ان ترتیبات کے مطابق نہیں۔ یہ سطریں محفوظ رکھی جاتی ہیں، اور اگر آپ EPANET فائل محفوظ کریں تو واپس لکھی جاتی ہیں۔';
$ec_lang['lpn_inp_drop_sections']='اس فائل میں ایک حصہ ایسا ہے جسے یہ صفحہ بالکل نہیں پڑھتا۔ یہاں اس کا کوئی استعمال نہیں۔ یہ پورا محفوظ رکھا جاتا ہے، اور اگر آپ EPANET فائل محفوظ کریں تو یہ واپس لکھا جاتا ہے۔';
$ec_lang['lpn_inp_drop_quality_options']='اس فائل میں EPANET کے پانی کے معیار کے اختیارات درج ہیں: Quality اختیار، جو پانی کے معیار کے تجزیے کی قسم بتاتا ہے، اور دو ترتیبات جو کسی کیمیکل کے ساتھ چلتی ہیں، Relative diffusivity اور Quality tolerance۔ تینوں محفوظ رکھی اور استعمال کی جاتی ہیں۔ پانی کی عمر، سورس ٹریس اور ایک کیمیکل ہر ایک یہاں نکالے جاتے ہیں، اور جب آپ کیمیکل چلاتے ہیں تو دونوں کیمیکل ترتیبات EPANET انجن کے حوالے کر دی جاتی ہیں۔ اگر آپ EPANET فائل محفوظ کریں تو یہ سب واپس لکھی جاتی ہیں۔';
$ec_lang['lpn_inp_drop_file_options']='اس فائل میں ایک ضمنی فائل کا حوالہ ہے: Map، جس میں احداثیات ہوتے ہیں، یا Hydraulics، جس میں پہلے سے نکالی گئی ہائیڈرالکس ہوتی ہے۔ یہ صفحہ ان میں سے کوئی نہیں کھول سکتا، اس لیے یہ سطریں جیسی ہیں ویسی ہی محفوظ رکھی جاتی ہیں اور اگر آپ EPANET فائل محفوظ کریں تو واپس لکھی جاتی ہیں۔';
$ec_lang['lpn_inp_drop_other_options']='اس فائل میں ایسے اختیارات درج ہیں جو یہ صفحہ نہیں پڑھتا۔ یہاں ان کا کوئی استعمال نہیں۔ وہ محفوظ رکھے جاتے ہیں اور اگر آپ EPANET فائل محفوظ کریں تو واپس لکھے جاتے ہیں۔';
$ec_lang['lpn_inp_drop_net_options']='اس EPANET .net فائل میں ایسی ترتیبات درج ہیں جن کے لیے اس صفحے پر کوئی کنٹرول نہیں، اس لیے ان کی قدریں یہاں فہرست کی گئی ہیں بجائے اس کے کہ منتقل کی جائیں۔ باقی سب کچھ منتقل ہو گیا۔ اگر آپ کو ان کی ضرورت ہو تو فائل کو EPANET میں کھولیں اور File، Export، Network استعمال کر کے اسے .inp فائل کے طور پر محفوظ کریں، پھر اسے درآمد کریں۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='یہ ایک EPANET .net فائل تھی۔ یہ خود EPANET کی اپنی پراجیکٹ فائل ہے، اس کی کوئی شائع شدہ تفصیل موجود نہیں، اور یہ صفحہ اسے مثالی فائلوں سے انداز اخذ کر کے پڑھتا ہے، اس لیے اسے صرف اس وقت استعمال کریں جب آپ کے پاس کچھ اور نہ ہو، ایک قابل بھروسہ راستے کے طور پر نہیں۔ .inp فائل وہ دستاویزی شکل ہے جسے ہر دوسرا پروگرام پڑھتا ہے: EPANET میں File، Export، Network استعمال کر کے ایک بنائیں، اور جب بھی ممکن ہو اسے درآمد کریں۔';
$ec_lang['lpn_inp_drop_backdrop']='یہ فائل ایک پس منظر کی تصویر کا نام دیتی ہے لیکن خود تصویر شامل نہیں کرتی۔ اسے خود فائل، پس منظر کی تصویر، تصویر شامل کریں سے شامل کریں۔';
$ec_lang['lpn_inp_drop_dangling']='یہ پائپ ایک ایسے جنکشن کا نام لیتے ہیں جو فائل میں نہیں ہے، اس لیے یہ شامل نہیں کیے گئے۔';
$ec_lang['lpn_inp_drop_units']='اس فائل میں بتایا گیا بہاؤ کا یونٹ ایسا نہیں جسے یہ صفحہ جانتا ہے، اس لیے ہر عدد کو گیلن فی منٹ کے طور پر پڑھا گیا۔ جوابات استعمال کرنے سے پہلے ہر عدد چیک کریں۔';
$ec_lang['lpn_inp_drop_anchor_missing']='یہ متن ایک ایسے جنکشن، ریزروائر، یا ٹینک سے منسلک تھا جو فائل میں موجود نہیں۔ یہ اسی جگہ آزاد متن کے طور پر شامل ہوا جہاں فائل نے اسے رکھا تھا، اور اب یہ کسی کے پیچھے نہیں چلتا۔';
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
$ec_lang['lpn_file_saveas_tip_download']='آپ کے براؤزر کی ڈاؤن لوڈ ترتیبات کا استعمال کرتے ہوئے محفوظ کرتا ہے۔ یہ براؤزر کسی فائل سے منسلک نہیں ہو سکتا، اس لیے محفوظ کریں غیر فعال ہے اور صرف محفوظ بطور دستیاب ہے۔ اگر آپ اپنے براؤزر کی ترتیب "ہر فائل کہاں محفوظ کرنی ہے پوچھیں" آن کریں، تو آپ اصل فائل منتخب کر کے اسے اوور رائٹ کر سکتے ہیں۔';
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
$ec_lang['lpn_file_changed_elsewhere']='آپ کے اسے کھولنے کے بعد کسی اور نے اس فائل میں محفوظ کیا ہے، اس لیے اب محفوظ کرنے سے ان کا کام مٹ جائے گا۔ اپنی تبدیلیاں اپنی الگ فائل میں رکھنے کے لیے فائل، محفوظ بطور استعمال کریں، یا اپنی تبدیلیاں ضائع کر کے ان کی لوڈ کرنے کے لیے فائل، واپس پلٹیں استعمال کریں۔';
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
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='ہم کسے پوچھنے والا کہیں؟ آپ کے ابتدائی حروف بہترین ہیں۔ یہ ہمارے سرور پر اس فائل کے لاک کے ساتھ محفوظ رکھے جاتے ہیں، جو بھی اسے کھولے اس کے لیے، اور 30 دنوں کے اندر حذف کر دیے جاتے ہیں۔';
$ec_lang['lpn_lock_ask_sent']='ہم نے اس شخص سے جس نے یہ فائل کھول رکھی ہے اسے بند کرنے کو کہہ دیا ہے۔ اگر ان کا صفحہ اب بھی کھلا ہے تو وہ اسے ایک منٹ کے اندر دیکھ لیں گے۔ اس کے علاوہ کچھ نہیں بدلا، اور فائل اس وقت تک ان کی ہی رہے گی جب تک وہ اسے بند نہیں کرتے۔';
$ec_lang['lpn_lock_ask_failed']='آپ کا پیغام پہنچایا نہیں جا سکا۔ یا تو اب کسی نے یہ فائل کھول نہیں رکھی، یا سرور تک رسائی نہیں ہو سکی۔';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='وہ فائل نہیں کھولی گئی، اور یہاں کچھ نہیں بدلا۔ کسی اور نے اب بھی اسے کھول رکھا ہے۔';
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
$ec_lang['lpn_msglog_note']='تازہ ترین پہلے۔ یہ صفحہ کھلے رہنے کے دوران آخری {n} پیغامات رکھتا ہے، اور آپ کے کمپیوٹر پر کچھ محفوظ نہیں کیا جاتا۔';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='صرف پڑھنے کے لیے: {name} نے یہ فائل کھول رکھی ہے۔ آپ یہاں جو چاہیں تبدیل کر سکتے ہیں، لیکن محفوظ نہیں کر سکتے۔ کسی مختلف فائل میں محفوظ کرنے کے لیے فائل، محفوظ بطور استعمال کریں۔';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='خبردار: اس پراجیکٹ پر لاک چیک یا بنانے کے لیے سرور تک رسائی نہیں ہو سکی، اس لیے کوئی چیز کسی ساتھی کارکن کو اسی وقت اسی فائل میں ترمیم کرنے سے نہیں روک رہی۔ اگر لاکنگ دوبارہ کام کرنا شروع کرے تو آپ کو بتا دیا جائے گا۔';
$ec_lang['lpn_lock_storage_error']='خبردار: یہ سائٹ لاک ریکارڈ محفوظ نہیں کر سکتی، اس لیے کوئی چیز کسی ساتھی کارکن کو اسی وقت اسی فائل میں ترمیم کرنے سے نہیں روک رہی۔ یہ سرور پر ایک سیٹ اپ کی خرابی ہے، ایسی چیز نہیں جسے آپ یہاں ٹھیک کر سکیں — لاک فولڈر ویب سرور کے لیے قابل تحریر نہیں ہے۔';
$ec_lang['lpn_lock_full_error']='خبردار: اس سائٹ کے پاس یہ ریکارڈ کرنے کی جگہ ختم ہو گئی ہے کہ کس نے کون سا پراجیکٹ کھول رکھا ہے، اس لیے کوئی چیز کسی ساتھی کارکن کو اسی وقت اسی فائل میں ترمیم کرنے سے نہیں روک رہی۔ یہ سرور پر ایک سیٹ اپ کی خرابی ہے، ایسی چیز نہیں جسے آپ یہاں ٹھیک کر سکیں۔';
$ec_lang['lpn_lock_not_asked']='اس پراجیکٹ کے لیے لاکنگ نہیں چل رہی، اس لیے کوئی چیز کسی ساتھی کارکن کو اسی وقت اسی فائل میں ترمیم کرنے سے نہیں روک رہی۔ اس پراجیکٹ کا ابھی تک کوئی شناخت کنندہ نہیں ہے، اور اسے فائل میں محفوظ کرنے سے اسے ایک مل جاتا ہے۔';
$ec_lang['lpn_lock_restored']='لاکنگ دوبارہ کام کر رہی ہے، اور یہ فائل اب آپ کے محفوظ کرنے کے لیے ہے۔';
$ec_lang['lpn_lock_dismiss']='یہ پیغام چھپائیں';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='آپ کا پراجیکٹ اس کمپیوٹر پر ایک فائل میں محفوظ ہو گا۔ یہ صرف اسی وقت محفوظ ہوتا ہے جب آپ کہیں، اور کسی اور وقت نہیں، اس لیے آپ کی مرضی کے بغیر اس فائل میں کچھ نہیں لکھا جاتا۔';
$ec_lang['lpn_file_training_2']='تاکہ دو لوگ کبھی ایک ہی فائل میں ایک ہی وقت میں ترمیم نہ کریں، یہ سائٹ اس کا ریکارڈ رکھتی ہے کہ اسے کس نے کھول رکھا ہے۔ اگر کسی کے پاس یہ پہلے سے کھلی ہے، تو آپ پھر بھی اسے کھول کر دیکھ سکتے ہیں، یا اپنی الگ کاپی رکھ سکتے ہیں۔';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='پہلی بار محفوظ کرنے پر، آپ کا براؤزر پوچھے گا کہ کیا یہ سائٹ فائل میں ترمیم کر سکتی ہے۔ یہ سوال براؤزر کی طرف سے آتا ہے، ہماری طرف سے نہیں، اور ہاں کہنا ہی وہ چیز ہے جو محفوظ کریں کو آپ کا کام واپس لکھنے دیتی ہے۔ عام طور پر یہ فی فائل صرف ایک بار پوچھا جاتا ہے۔';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='جاری رکھیں';
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
$ec_lang['lpn_notes_1_def']='EPANET حل کار اس نیٹ ورک کو حل کرتا ہے۔ کل چلنے کا وقت مقرر کریں اور ہر رپورٹنگ مرحلہ باری باری نکالا جاتا ہے: ٹینک بھرتے اور خالی ہوتے ہیں، طلبات اپنے پیٹرنز کی پیروی کرتی ہیں، اور ٹول بار رن کو واپس چلاتا ہے۔';
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
$ec_lang['lpn_notes_2_def']='پانی کے معیار کی ماڈلنگ کی جاتی ہے: پانی کی عمر، سورس ٹریس، اور ایک کیمیکل جو پائپ کی دیواروں اور پانی کے اندر تعامل کرتا ہے۔ سرج اور واٹر ہیمر ماڈل نہیں کیے جاتے: یہاں ہر جواب پہلے سے مستحکم بہاؤ کے لیے ہے، نہ کہ والو کے اچانک بند ہونے پر پیدا ہونے والی دباؤ کی لہر کے لیے۔';
$ec_lang['lpn_notes_3_term']='پراجیکٹس محفوظ کرنا';
$ec_lang['lpn_notes_3_def']='ہر پراجیکٹ ایک ٹیب ہے، اور ہر ٹیب کام کے دوران اسی براؤزر میں محفوظ ہوتا ہے۔ آپ کا براؤزر ڈیٹا صاف کرنے سے یہ سب حذف ہو جاتے ہیں، اس لیے اپنا کام فائل میں رکھیں: فائل، محفوظ بطور۔ ٹیب پر ستارہ ظاہر کرتا ہے کہ اس میں ایسی تبدیلیاں ہیں جو کسی فائل میں نہیں۔ آپ کے کہے بغیر کبھی کسی فائل میں کچھ نہیں لکھا جاتا۔ کچھ براؤزرز میں پراجیکٹ اسی فائل سے منسلک ہو جاتا ہے جس میں آپ اسے محفوظ کرتے ہیں، اور اس کے بعد فائل، محفوظ کریں اسی فائل میں واپس لکھتا ہے؛ دوسروں میں کوئی رابطہ ممکن نہیں، اس لیے محفوظ کریں غیر فعال ہے اور صرف محفوظ بطور دستیاب ہے۔ جب پراجیکٹ فائل کسی مشترکہ ڈرائیو پر رکھی جاتی ہے، تو یہ صفحہ آپ کو بتاتا ہے اگر کسی ساتھی کارکن نے اسے پہلے سے کھول رکھا ہے، تاکہ دو لوگ ایک دوسرے پر نہ لکھیں۔';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='پمپ وکر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='ایک پمپ H = H₀ − aQ^b کی پیروی کرتا ہے، جہاں H وہ ہیڈ ہے جو پمپ شامل کرتا ہے اور Q اس سے گزرنے والا بہاؤ ہے۔ مینوفیکچرر کے وکر سے ایک، دو، یا تین پوائنٹس درج کریں۔ تین پوائنٹس — صفر بہاؤ پر ہیڈ، عام کام کرنے کا پوائنٹ، اور سب سے زیادہ بہاؤ کا پوائنٹ — براہ راست H₀، a اور b فٹ کرتے ہیں، اور شائع شدہ وکر کی سب سے قریب پیروی کرتے ہیں۔ دو پوائنٹس ایک پیرابولا (b = 2) فٹ کرتے ہیں جس کی چوٹی صفر بہاؤ پر ہوتی ہے۔ ایک پوائنٹ ایک عام قاعدہ استعمال کرتا ہے: صفر بہاؤ پر ہیڈ آپ کے درج کردہ ہیڈ کا 1.33 × ہے، اور سب سے زیادہ بہاؤ آپ کے درج کردہ بہاؤ کا 2 × ہے، جو دوبارہ b = 2 دیتا ہے۔ کوئی پوائنٹ درج نہ کیا گیا پمپ بالکل کوئی ہیڈ شامل نہیں کرتا۔ وکر اس جگہ نہیں کاٹا جاتا جہاں ہیڈ صفر تک پہنچے، اس لیے پمپ سے اس کے وکر کی فراہم کردہ صلاحیت سے زیادہ بہاؤ مانگنا منفی ہیڈ دیتا ہے۔ حل ایک بڑا پمپ یا چھوٹی طلب ہے، مختلف وکر فٹ نہیں۔ ایک وکر تین سے زیادہ پوائنٹس رکھ سکتا ہے، اور آپ کے دیے گئے ہر پوائنٹ کو پڑھا جاتا ہے۔';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='اس صفحے پر یہ بھی';
$ec_lang['lpn_notes_4_def']='کوئی پراجیکٹ اصل زمین پر، اس کے پیچھے سڑکوں کے نقشے کے ساتھ، رکھا جا سکتا ہے۔ EPANET .inp فائلیں پڑھی اور لکھی جا سکتی ہیں۔ نیچے کا پینل کسی راستے کے ساتھ پروفائل کھینچتا ہے اور جنکشنز کی فہرست دیتا ہے۔ عناصر کو ان کے نتائج کے مطابق رنگ دیا جا سکتا ہے، اور تلاش ہر اس عنصر کو چن لیتی ہے جو آپ کی مقرر کردہ شرط پر پورا اترتا ہو۔';
$ec_lang['lpn_notes_6_term']='جدول کے کالمز کی مدد';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>کالم منتخب کریں</td><td>عنوان پر کلک کریں</td></tr><tr><td>کالم کا انتخاب شامل یا بڑھائیں</td><td>کسی دوسرے عنوان پر Ctrl+کلک یا Shift+کلک کریں</td></tr><tr><td>منتخب کالم(ز) منتقل کریں (ترتیب بدلیں)</td><td>گھسیٹیں یا رائٹ کلک یا ⋮ مینو میں کالمز کا انتظام کریں… استعمال کریں</td></tr><tr><td>مینو ⋮ اور ترتیب کا تیر۔</td><td>عنوان کے اوپری کونے پر ہوور کریں، یا کسی عنوان کو منتخب کریں یا Tab سے اس میں جائیں</td></tr><tr><td>چھپائیں، سب دکھائیں، یا نمائش اور ترتیب کا انتظام کریں</td><td>عنوان پر رائٹ کلک کریں یا عنوان کے اوپری دائیں کونے میں ⋮ مینو</td></tr><tr><td>کالم کے مطابق ترتیب دیں</td><td>عنوان کے اوپری دائیں کونے میں تیر کی علامت</td></tr><tr><td>جدول کے آخر میں نئی قطاروں کے طور پر پیسٹ کریں</td><td>رائٹ کلک، عنوان کے اوپری دائیں کونے میں ⋮ مینو، یا Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='جدول کیبورڈ شارٹ کٹس';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Arrow keys</td><td>نیویگیٹ کریں۔</td></tr><tr><td>Tab, Enter</td><td>اندراج مکمل کریں اور ایک سیل آر پار / نیچے جائیں۔</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>پیچھے کی طرف نیویگیٹ کریں۔</td></tr><tr><td>Shift+arrow keys</td><td>انتخاب کو بڑھائیں۔</td></tr><tr><td>Ctrl+C</td><td>انتخاب کاپی کریں۔</td></tr><tr><td>Ctrl+D</td><td>انتخاب کو اس کی سب سے اوپر والی قطار سے نیچے بھریں۔</td></tr><tr><td>Ctrl+Enter</td><td>انتخاب کو فعال سیل کی قدر سے بھریں۔</td></tr><tr><td>Ctrl+A</td><td>پورا جدول منتخب کریں۔</td></tr><tr><td>Ctrl+Shift+V</td><td>جدول کے آخر میں نئی قطاروں کے طور پر پیسٹ کریں۔</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>اگلے یا پچھلے ٹیب پر جائیں، چاہے وہ جدول ہو یا گراف۔</td></tr><tr><td>Delete</td><td>ایک سیل صاف کریں۔</td></tr><tr><td>F2</td><td>ترمیم کے لیے سیل کھولیں۔</td></tr><tr><td>Esc</td><td>ترمیم منسوخ کریں۔</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='رنگ بینڈ کی حدیں ایک جیسی رہتی ہیں';
$ec_lang['lpn_notes_color_def']='رنگ بینڈ کی حدیں تب مقرر ہوتی ہیں جب آپ رینج کی تقسیم کا طریقہ چنتے ہیں۔ یہ ہر وقتی مرحلے پر دوبارہ مقرر نہیں ہوتیں، کیونکہ ایسا کرنے سے رنگ ہر مرحلے پر کچھ نیا مطلب رکھنے لگیں گے، اور یہ آپ کے نظام کو دیکھنے کے لیے مددگار نہیں۔ EPANET بھی اسی طرح کام کرتا ہے۔ نئی حدیں پانے کے لیے، طریقہ دوبارہ چنیں یا اپنی حدیں خود لکھیں۔';
$ec_lang['lpn_notes_epanet_term']='ہیزن-ولیمز مستقلات EPANET سے مطابقت رکھتے ہیں';
$ec_lang['lpn_notes_epanet_def']='اگست 2026 میں ہیزن-ولیمز گتانک اور اظہاریہ کو EPANET سے مطابقت رکھنے کے لیے تبدیل کیا گیا۔ دباؤ نقصان کے نتائج اس صفحے کے سابقہ ورژنوں سے 0.1 فیصد تک مختلف ہیں، جو خود C قدر کی غیر یقینی صورتحال سے کہیں کم ہے۔';
$ec_lang['lpn_notes_engine_term']='یہ صفحہ کون سا EPANET چلاتا ہے';
$ec_lang['lpn_notes_engine_def']='اس صفحے پر EPANET حل کار OWA-EPANET 2.3.5 ہے، جو 20 فروری 2025 کو جاری ہوا۔ EPANET کو Open Water Analytics تیار کرتی ہے، ایک کمیونٹی جو امریکی Environmental Protection Agency کے ساتھ کام کرتی ہے، جس نے دسمبر 2019 میں ورژن 2.2.0 جاری کیا۔ رن رپورٹ اسے 2.3.05 کہتی ہے کیونکہ انجن آخری عدد کو دو ہندسوں میں لکھتا ہے۔ یہ Luke Butler کے epanet-js 0.9.0 کے ذریعے، MIT لائسنس کے تحت اس صفحے تک پہنچتا ہے، اور آپ کے براؤزر کے اندر ہی چلتا ہے: آپ کا نیٹ ورک حل کرنے کے لیے کہیں نہیں بھیجا جاتا۔';
$ec_lang['lpn_id_invalid']='ایسا ID درج کریں جس میں کوئی خالی جگہ اور کوئی اقتباسی نشان نہ ہو۔';
$ec_lang['lpn_id_taken']='یہ ID پہلے سے استعمال میں ہے۔';
$ec_lang['lpn_diag_no_fixed_head']='ایک ریزروائر یا ٹینک شامل کریں۔ حل ہونے سے پہلے نیٹ ورک کو کم از کم ایک معلوم پانی کی سطح درکار ہے۔';
$ec_lang['lpn_diag_dangling_link']='ایک پائپ یا پمپ ایک ایسے نوڈ سے جڑا ہے جو اب موجود نہیں:';
$ec_lang['lpn_diag_unreachable']='ان نوڈز کا کسی ریزروائر تک کوئی راستہ نہیں:';
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
$ec_lang['lpn_engine_fetching']='EPANET حل کار حاصل کیا جا رہا ہے۔ یہ ایک بار ڈاؤن لوڈ ہوتا ہے اور پھر اس آلے پر محفوظ رہتا ہے، اس لیے بعد میں یہ آف لائن کام کرتا ہے۔';
$ec_lang['lpn_engine_ready']='EPANET حل کار اب اس آلے پر موجود ہے، اور آف لائن کام کرتا ہے۔';
$ec_lang['lpn_engine_fetching_valve']='EPANET حل کار حاصل کیا جا رہا ہے، تاکہ یہ والو ابھی اور بعد میں آف لائن حل کیا جا سکے۔';
$ec_lang['lpn_engine_ready_valve']='EPANET حل کار اب اس آلے پر موجود ہے۔ وہ والوز جو خود بخود کھلتے اور بند ہوتے ہیں آف لائن کام کریں گے۔';
$ec_lang['lpn_engine_unavailable']='EPANET حل کار حاصل نہیں ہو سکا، جو خود بخود کھلنے اور بند ہونے والے والوز کو حل کرتا ہے۔ ایک بار انٹرنیٹ سے جڑیں اور یہ اس کے بعد اس آلے پر محفوظ رہتا ہے۔';
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
$ec_lang['lpn_diag_valve_needs_epanet']='یہ والوز خود بخود کھلتے اور بند ہوتے ہیں، اور صرف EPANET حل کار ہی انہیں شمار کر سکتا ہے۔ EPANET حل کار لوڈ نہیں ہو سکا، اس لیے یہ نتائج غائب ہیں:';
$ec_lang['lpn_diag_valve_on_fixed_head']='یہ والوز براہ راست کسی ریزروائر یا ٹینک سے جڑے ہیں، جو وہاں پانی کی سطح پہلے ہی مقرر کرتا ہے، اس لیے والو کے کنٹرول کرنے کے لیے کچھ باقی نہیں بچتا۔ والو اور ریزروائر یا ٹینک کے درمیان ایک مختصر پائپ رکھیں:';
$ec_lang['lpn_diag_not_converged']='کوئی حل نہیں ملا۔ ایسی قدروں کی جانچ کریں جو حقیقی زندگی میں ناممکن ہیں، جیسے صفر قطر۔';
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
$ec_lang['lpn_field_from']='سے';
$ec_lang['lpn_field_to']='تک';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='والو کی قسم';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='والو کیا کرتا ہے۔ تھروٹل والو ایک مقررہ نقصان برقرار رکھتا ہے۔ باقی تین دباؤ یا بہاؤ برقرار رکھتے ہیں، اور پانی بدلنے کے ساتھ مکمل کھلتے، بند ہوتے، یا جزوی طور پر بند ہوتے ہیں۔ یہ اقسام مختلف ہائیڈرالک خصوصیات کو کنٹرول کرتی ہیں، اس لیے قسم بدلنے پر ترتیبات ضائع ہو سکتی ہیں۔';
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
$ec_lang['lpn_inp_drop_gpv_curve']='یہ والو ایک ایسے ہیڈ لاس وکر کا حوالہ دیتا ہے جو فائل میں موجود نہیں۔ والو بغیر کسی وکر کے شامل ہوا، اس لیے جب تک آپ اسے وکر نہیں دیتے یہ مکمل کھلا رہتا ہے۔';
$ec_lang['lpn_gpv_curve_source']='والو ہیڈ لاس وکر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='لائبریریاں خانے میں موجود وکر جو بتاتا ہے کہ یہ والو ہر بہاؤ پر کتنا ہیڈ ضائع کرتا ہے۔ کئی والو ایک ہی وکر استعمال کر سکتے ہیں، اور وہاں اسے بدلنا ان سب کو بدل دیتا ہے۔ یہ والو صرف حوالہ رکھتا ہے؛ پوائنٹس خود لائبریریاں، وکر کے تحت پڑھے اور بدلے جاتے ہیں۔';
$ec_lang['lpn_field_valve_setting_pressure']='دباؤ کی ترتیب';
$ec_lang['lpn_field_valve_setting_pressure_tip']='وہ دباؤ جو والو برقرار رکھتا ہے۔ دباؤ کم کرنے والا والو اپنے زیریں رخ کے دباؤ کو اس قدر پر یا اس سے کم رکھتا ہے۔ دباؤ برقرار رکھنے والا والو اپنے بالائی رخ کے دباؤ کو اس قدر پر یا اس سے زیادہ رکھتا ہے۔';
$ec_lang['lpn_field_valve_setting_flow']='بہاؤ کی ترتیب';
$ec_lang['lpn_field_valve_setting_flow_tip']='زیادہ سے زیادہ پانی جو والو گزرنے دیتا ہے۔ جب اس سے کم پانی گزرنا چاہے تو والو مکمل کھلا رہتا ہے اور کوئی نقصان شامل نہیں کرتا۔';
$ec_lang['lpn_field_valve_setting']='ترتیب';
$ec_lang['lpn_field_valve_setting_loss']='نقصان گتانک';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='تھروٹل والو کتنا ہیڈ ختم کرتا ہے، جسے رفتار ہیڈ کے ایک مضاعف کے طور پر شمار کیا جاتا ہے۔ مکمل کھلے والو کے لیے 0 استعمال کریں۔ یہ ایک عدد ہی تھروٹل والو کا مکمل نقصان ہے۔';
$ec_lang['lpn_field_valve_diameter_tip']='والو کے راستے کے کھلاؤ کی چوڑائی۔ والو سے گزرنے والے پانی کی رفتار اسی چوڑائی سے شمار کی جاتی ہے، اور نقصان اسی رفتار سے نکلتا ہے۔';
$ec_lang['lpn_field_valve_km_tip']='والو کے مکمل کھلے رہنے کے دوران والو کے جسم سے ہونے والا نقصان، اس کے علاوہ جو کچھ والو کی ترتیب ختم کرتی ہے۔ یہ رفتار ہیڈ کے ایک مضاعف کے طور پر شمار کیا جاتا ہے۔ اسے نظر انداز کرنے کے لیے 0 استعمال کریں۔';
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
$ec_lang['lpn_pump_curve_source_tip']='لائبریریاں خانے میں موجود وکر جو بتاتا ہے کہ یہ پمپ ہر بہاؤ پر کتنا ہیڈ شامل کرتا ہے۔ کئی پمپ ایک ہی وکر استعمال کر سکتے ہیں، اور وہاں اسے بدلنا ان سب کو بدل دیتا ہے۔ یہ پمپ صرف حوالہ رکھتا ہے؛ پوائنٹس خود لائبریریاں، وکر کے تحت پڑھے اور بدلے جاتے ہیں۔';
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
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='ٹیگ کا کوئی بھی مطلب ہو سکتا ہے جو آپ کو درکار ہو، جیسے پریشر زون یا ورک آرڈر۔ نہ یہاں اور نہ EPANET میں کوئی حساب اسے پڑھتا ہے۔ ٹیگ ایک لفظ ہے: EPANET پہلی خالی جگہ پر پڑھنا بند کر دیتا ہے، اس لیے ٹائپ کرتے وقت خالی جگہ قبول نہیں کی جاتی۔ یہ EPANET فائل میں اور اس سے باہر منتقل ہوتا ہے۔';
$ec_lang['lpn_pump_effic_curve']='پمپ افادیت وکر';
$ec_lang['lpn_pump_effic_curve_tip']='لائبریریاں خانے میں موجود وکر جو بتاتا ہے کہ یہ پمپ ہر بہاؤ پر کتنا موثر ہے۔ کئی پمپ ایک ہی وکر استعمال کر سکتے ہیں، اور وہاں اسے بدلنا ان سب کو بدل دیتا ہے۔ یہ پمپ صرف حوالہ رکھتا ہے؛ پوائنٹس خود لائبریریاں، وکر کے تحت پڑھے اور بدلے جاتے ہیں۔';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='کوئی وکر منتخب نہیں';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='وکر';
$ec_lang['lpn_curve_library_link_tip']='لائبریریاں خانے کو اس کے وکر سیکشن پر کھولتا ہے، جہاں وکر شامل، بیان، ترمیم اور حذف کیا جاتا ہے۔ ایک اثاثہ بتاتا ہے کہ وہ کون سا وکر استعمال کرتا ہے۔';
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
$ec_lang['lpn_pump_effic_global']='اس پمپ کا کوئی افادیت وکر منتخب نہیں، اس لیے یہ پورے نیٹ ورک کے لیے مقرر کردہ افادیت، {percent}، پر چلتا ہے۔';
$ec_lang['lpn_pump_effic_unstated']='یہ پمپ {name} نامی ایک افادیت وکر کا حوالہ دیتا ہے، جسے اس پراجیکٹ میں کچھ بھی متعین نہیں کرتا، اس لیے یہ پورے نیٹ ورک کے لیے مقرر کردہ افادیت، {percent}، پر چلتا ہے۔';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='موڈ: منتخب کریں۔ کسی عنصر یا لیبل کو دیکھنے یا بدلنے کے لیے اس پر کلک کریں۔ نوڈ یا لیبل کو منتقل کرنے کے لیے گھسیٹیں۔ پائپ کے موڑ شامل یا حذف کرنے کے لیے موڑ نقاط ٹول استعمال کریں۔';
$ec_lang['lpn_mode_delete']='موڈ: حذف کریں۔ کسی عنصر کو ہٹانے کے لیے اس پر کلک کریں۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='موڈ: موڑ نقاط۔ ہر پائپ کے موڑ نقاط چھوٹے مربع ہینڈلز کے طور پر دکھائے جاتے ہیں۔ پائپ پر کلک کر کے موڑ نقطہ شامل کریں، ہینڈل پر کلک کر کے اسے حذف کریں، یا ہینڈل کو گھسیٹ کر منتقل کریں۔ اس موڈ میں نقشے پر کچھ اور تبدیل نہیں ہوتا۔';
$ec_lang['lpn_mode_zoom_window']='موڈ: زوم ونڈو۔ اس پر زوم کرنے کے لیے نقشے پر ڈبے کے دو مخالف کونے کلک کریں، یا ایک کو گھسیٹیں۔';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='کچھ منتخب نہیں ہے۔ پہلے نقشے پر کسی عنصر پر کلک کریں، پھر حذف کریں دبائیں۔';
$ec_lang['lpn_mode_add_junction']='موڈ: جنکشن شامل کریں۔ جنکشن رکھنے کے لیے نقشے پر کلک کریں۔ عناصر اور لیبلز بدلنے یا منتقل کرنے کے لیے منتخب کریں موڈ پر جائیں۔';
$ec_lang['lpn_mode_add_reservoir']='موڈ: ریزروائر شامل کریں۔ ریزروائر رکھنے کے لیے نقشے پر کلک کریں۔ عناصر اور لیبلز بدلنے یا منتقل کرنے کے لیے منتخب کریں موڈ پر جائیں۔';
$ec_lang['lpn_mode_add_tank']='موڈ: ٹینک شامل کریں۔ ٹینک رکھنے کے لیے نقشے پر کلک کریں۔ عناصر اور لیبلز بدلنے یا منتقل کرنے کے لیے منتخب کریں موڈ پر جائیں۔';
$ec_lang['lpn_mode_add_pipe']='موڈ: پائپ شامل کریں۔ ایک نوڈ پر، پھر دوسرے نوڈ پر کلک کر کے انہیں جوڑیں۔ درمیان میں خالی جگہ پر کلک کر کے لائن موڑیں، یا دوبارہ شروع کرنے کے لیے Escape دبائیں۔ عناصر اور لیبلز بدلنے یا منتقل کرنے کے لیے منتخب کریں موڈ پر جائیں۔';
$ec_lang['lpn_mode_add_pump']='موڈ: پمپ شامل کریں۔ ایک نوڈ پر، پھر دوسرے نوڈ پر کلک کر کے انہیں جوڑیں۔ درمیان میں خالی جگہ پر کلک کر کے لائن موڑیں، یا دوبارہ شروع کرنے کے لیے Escape دبائیں۔ عناصر اور لیبلز بدلنے یا منتقل کرنے کے لیے منتخب کریں موڈ پر جائیں۔';
$ec_lang['lpn_mode_add_valve']='موڈ: والو شامل کریں۔ ایک نوڈ پر، پھر دوسرے نوڈ پر کلک کر کے انہیں جوڑیں۔ درمیان میں خالی جگہ پر کلک کر کے لائن موڑیں، یا دوبارہ شروع کرنے کے لیے Escape دبائیں۔ عناصر اور لیبلز بدلنے یا منتقل کرنے کے لیے منتخب کریں موڈ پر جائیں۔';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='موڈ: متن شامل کریں۔ متن رکھنے کے لیے نقشے پر کلک کریں۔ کسی نوڈ کے قریب کلک کر کے متن کو اس نوڈ سے منسلک کریں۔ عناصر اور لیبلز بدلنے یا منتقل کرنے کے لیے منتخب کریں موڈ پر جائیں۔';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='نقشے پر چیزیں بدلنے، منتقل کرنے اور گھسیٹنے کے لیے یہ موڈ استعمال کریں۔ یہ وہ موڈ ہے جس پر صفحہ خودبخود واپس آتا ہے: کچھ کارروائیوں کے بعد، جیسے پراجیکٹ کھولنا، یہ خود ہی یہاں واپس آ جاتا ہے۔ Esc کو دوبارہ دبانے سے جو کچھ بھی منتخب ہے وہ غیر منتخب ہو جاتا ہے۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='خودکار';
$ec_lang['lpn_method_switch_confirm']='طریقہ کار بدلنے سے آپ کے پائپوں پر پہلے سے ٹائپ کی گئی کھردرا پن کی قدریں تبدیل نہیں ہوتیں، اور ایک طریقے کی کھردرا پن دوسرے کے لیے بے معنی ہوتی ہے۔ اس کے بعد ہر پائپ کی جانچ کریں۔ پھر بھی تبدیل کریں؟';
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
$ec_lang['lpn_field_coord_tip']='اس نوڈ کو بالکل درست جگہ پر رکھنے کے لیے ایک احداثی مقام ٹائپ کریں۔ کسی منظرنامے میں یہ مقام صرف اسی منظرنامے میں لاگو ہوتا ہے، بالکل جیسے اسے گھسیٹنا کرتا ہے؛ بنیاد میں یہ نوڈ کو ہر جگہ رکھتا ہے۔';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='یہ نقشے سے باہر ہے۔ سیوڈو مرکیٹر میں عرض بلد -85.05 سے 85.05 تک اور طول بلد -180 سے 180 تک ہوتا ہے۔';
$ec_lang['lpn_field_text_size']='سائز مضاعف';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='ہر زوم سطح پر دکھائیں';
$ec_lang['lpn_field_text_all_zoom_tip']='اس متن کو ڈرائنگ پر رکھیں چاہے آپ کتنا ہی باہر زوم کریں۔ اس کا نشان ہٹا دیں اور یہ متن دوسرے لیبلز کے ساتھ چھپ جائے گا جب منظر نقشہ اور صفحہ کے تحت مقرر کردہ لیبلنگ حد سے زیادہ چوڑا ہو۔';
$ec_lang['lpn_tool_labels']='لیبلز';
$ec_lang['lpn_labels_heading_node']='نوڈ لیبلز';
$ec_lang['lpn_labels_heading_link']='لنک لیبلز';
$ec_lang['lpn_labels_mark_extrema']='سب سے زیادہ اور سب سے کم قدریں نشان زد کریں';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='نقشے پر ہر لیبل والی خصوصیت کی سب سے زیادہ قدر کے اوپر ایک لکیر (اوورلائن)، اور سب سے کم قدر کے نیچے ایک لکیر (انڈرلائن) کھینچتا ہے۔';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='سب پر لاگو کریں';
$ec_lang['lpn_settings_apply_to_all_tip']='اس قسم کا ہر عنصر جو پہلے سے کھینچا جا چکا ہے اسے ایسی ID ملتی ہے جو اس متن سے شروع ہو۔ ہر ایک اپنا نمبر رکھتا ہے۔ جو ID کسی عدد پر ختم نہ ہو اسے چھوڑ دیا جاتا ہے۔';
$ec_lang['lpn_confirm_apply_prefix']='{n} عناصر کا نام بدل کر ان کی IDs {prefix} سے شروع کر دی جائیں؟ ہر ایک اپنا نمبر رکھے گا۔';
$ec_lang['lpn_prefix_applied']='{n} عناصر کا نام بدلا گیا۔ {skipped} دیگر کو چھوڑ دیا گیا۔';
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
$ec_lang['lpn_labels_priority_node_tip']='وہ ترتیب جس میں خصوصیات چھوڑی جاتی ہیں جب دو نوڈ لیبل اوورلیپ کریں۔ نمبر 1 والی خصوصیت دونوں لیبلز پر سب سے پہلے چھوڑی جاتی ہے۔ جب صرف ایک خصوصیت باقی رہے اور دونوں پھر بھی اوورلیپ کریں، تو پورا لیبل چھپا دیا جاتا ہے: جس لیبل کی باقی قدر دکھانے کے قابل سب سے کم ہو، یعنی سب سے کم طلب، حد کے وسط کے قریب ترین دباؤ، یا پڑوسی نوڈز کے قریب ترین بلندی یا ہیڈ۔';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='پہلے';
$ec_lang['lpn_labels_col_after']='بعد';
$ec_lang['lpn_labels_col_decimals']='اعشاریہ';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='دکھائیں';
$ec_lang['lpn_labels_show_tip']='وہ ترتیب جس میں قدریں لیبل پر ظاہر ہوتی ہیں۔ نمبر 1 والی قدر پہلے آتی ہے: سٹیکڈ لیبل کے اوپر، اور ایک لائن والے لیبل کے شروع میں۔';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='یونٹس استعمال کریں';
$ec_lang['lpn_labels_use_units_tip']='بعد خانے میں اور لیبل پر یونٹ دکھانے کے لیے، اور یونٹس بدلنے پر اسے ہم قدم رکھنے کے لیے نشان لگائیں۔ اپنا بعد متن خود ٹائپ کرنے کے لیے نشان ہٹا دیں۔';
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
$ec_lang['lpn_backdrop_scale_from_prompt1']='پس منظر کی تصویر پر وہ پوائنٹ کلک کریں جو اپنی جگہ پر رہنا چاہیے۔';
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
$ec_lang['lpn_map_attach_scale_from_bad']='صفر سے بڑا ایک واحد عدد ٹائپ کریں۔';
$ec_lang['lpn_map_attach_scale_from_done']='نقشے کا سائز بدل دیا گیا ہے، اور آپ کی ڈرائنگ اور اس کے ہر احداثیے بالکل ویسے ہی ہیں جیسے تھے۔';
$ec_lang['lpn_map_attach_none']='اس پراجیکٹ سے ابھی تک کوئی دنیا کا نقشہ منسلک نہیں۔ پہلے نقشہ، دنیا کا نقشہ، منسلک کریں استعمال کریں۔';
$ec_lang['lpn_map_attach_remove']='الگ کریں';
$ec_lang['lpn_map_attach_remove_tip']='دنیا کا نقشہ ہٹا دیں۔ ڈرائنگ اور اس کے احداثیات دونوں صورتوں میں چھیڑے نہیں جاتے۔';
$ec_lang['lpn_map_attach_done']='دنیا کا نقشہ اب آپ کی ڈرائنگ کے پیچھے ہے، اور آپ کا پراجیکٹ تبدیل نہیں ہوا۔ اسے دوبارہ ہٹانے کے لیے نقشہ، دنیا کا نقشہ، الگ کریں استعمال کریں۔';
$ec_lang['lpn_map_attach_removed']='دنیا کا نقشہ ختم ہو گیا ہے، اور ڈرائنگ بالکل ویسی ہی ہے جیسی تھی۔';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='آپ کی ڈرائنگ پوری دنیا کے نقشے پر ہے، سمندر میں صفر عرض بلد اور صفر طول بلد پر۔ پہلے اپنی جگہ تلاش کریں: ڈرائنگ کے پیچھے نقشے کو pan اور zoom کریں، کسی جگہ کا نام تلاش کریں، یا عرض بلد اور طول بلد ٹائپ کریں۔ ڈرائنگ خود حرکت نہیں کرتی۔';
$ec_lang['lpn_mapgeo_step1']='مرحلہ 1 از 2: دنیا میں اپنی جگہ تلاش کریں';
$ec_lang['lpn_mapgeo_step2']='مرحلہ 2 از 2: اپنی ڈرائنگ کے پیچھے نقشہ فٹ کریں';
$ec_lang['lpn_mapgeo_hint1']='اپنی ڈرائنگ کے پیچھے نقشے کو pan اور zoom کریں، یا کوئی جگہ تلاش کریں، یا عرض بلد اور طول بلد ٹائپ کریں۔ پھر تقریباً رکھیں دبائیں۔';
$ec_lang['lpn_mapgeo_readjust_intro']='آپ کی ڈرائنگ وہیں ہے جہاں آپ نے اسے آخری بار رکھا تھا۔ اسے کہیں اور منتقل کرنے کے لیے، ڈرائنگ کے پیچھے نقشے کو pan اور zoom کریں، کسی جگہ کا نام تلاش کریں، یا عرض بلد اور طول بلد ٹائپ کریں۔ ڈرائنگ خود حرکت نہیں کرتی۔';
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
$ec_lang['lpn_mapgeo_dial_help']='نقشے کو بڑا یا چھوٹا کرنے اور اسے گھمانے کے لیے دونوں بار سرکائیں، یا ان کے اوپر خانوں میں ٹائپ کریں۔ ہر بار کا درمیان وہ فٹ مرحلہ ہے جو 1 پر چھوڑا گیا، اس لیے 1 اور 0 کا مطلب ہے اسے ویسے ہی رہنے دیں۔ دونوں پر تیر کی کنجیاں کام کرتی ہیں۔';
$ec_lang['lpn_mapgeo_place']='تقریباً رکھیں';
$ec_lang['lpn_mapgeo_finish']='یہاں جغرافیائی حوالہ دیں';
$ec_lang['lpn_mapgeo_cancelled']='دنیا کا نقشہ وہیں واپس آ گیا ہے جہاں تھا، اور آپ کی ڈرائنگ کبھی حرکت نہیں کی۔';
$ec_lang['lpn_mapgeo_locked']='پراجیکٹس بدلنے یا محفوظ کرنے سے پہلے یہاں جغرافیائی حوالہ دیں بٹن سے مکمل کریں، یا منسوخ کریں دبائیں۔ دنیا کے نقشے کی جگہ کا تعین ابھی جاری ہے۔';
$ec_lang['lpn_backdrop_scale_prompt1']='پس منظر کی تصویر پر دو پوائنٹس پر کلک کریں، جیسے بار سکیل کے دو سرے۔ پھر ان کے درمیان اصل فاصلہ ٹائپ کریں۔';
$ec_lang['lpn_backdrop_scale_prompt2']='دونوں پوائنٹس کے درمیان اصل فاصلہ';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='منتقلی کے لیے بنیادی پوائنٹ (تصویر پر) پر کلک کریں۔';
$ec_lang['lpn_backdrop_position_prompt2']='منزل کے پوائنٹ کا طریقہ منتخب کریں، پھر جاری رکھیں پر کلک کریں۔';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='پس منظر کی تصویر ایڈجسٹ کی جا رہی ہے۔';
$ec_lang['lpn_backdrop_target_label']='اس پوائنٹ کو یہاں منتقل کریں:';
$ec_lang['lpn_backdrop_target_node']='ایک نوڈ';
$ec_lang['lpn_backdrop_target_free']='نقشے پر کوئی بھی پوائنٹ';
$ec_lang['lpn_backdrop_target_coords']='آپ کے ٹائپ کردہ احداثیات';
$ec_lang['lpn_backdrop_coords_prompt']='وہ X,Y ٹائپ کریں جہاں وہ پوائنٹ منتقل ہونا چاہیے';
$ec_lang['lpn_backdrop_continue']='جاری رکھیں';
$ec_lang['lpn_tool_settings']='ترتیبات';
$ec_lang['lpn_settings_show_titles']='صفحے کے عنوانات دکھائیں';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='یہ عنوانات چھپائیں';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='انتخاب کی مدد دکھائیں';
$ec_lang['lpn_settings_area_hint_tip']='نقشے پر ایک بلبلہ دکھاتا ہے جو بتاتا ہے کہ رقبہ منتخب کرتے وقت آپ کا اگلا کلک کیا کرے گا۔';
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
$ec_lang['lpn_settings_custom_props_note']='وہ خصوصیات جو آپ خود اپنے مقاصد کے لیے متعین کرتے ہیں۔ یہ باقی تمام خصوصیات کی طرح پراجیکٹ اور منظرناموں کے ساتھ محفوظ کی جاتی ہیں۔';
$ec_lang['lpn_cp_design']='ڈیزائن';
$ec_lang['lpn_cp_design_tip']='ہر حسب ضرورت خصوصیت کی ایک قطار ہوتی ہے، اور ہر ایک کھل کر یہ دکھاتی ہے: کلید، لیبل، اطلاق برائے، توثیق بطور، اجازت دیں یا محدود کریں، اس انتخاب کے نام سے موسوم حروف کا خانہ، لمبائی کی کم از کم حد، لمبائی کی زیادہ سے زیادہ حد، کم از کم حد، زیادہ سے زیادہ حد۔';
$ec_lang['lpn_cp_add']='حسب ضرورت خصوصیت شامل کریں';
$ec_lang['lpn_cp_add_tip']='ڈیزائن ٹیبل میں ایک قطار شامل کرتا ہے اور اسے ترمیم کے لیے کھولتا ہے۔';
$ec_lang['lpn_cp_remove_tip']='اس خصوصیت کو ڈیزائن ٹیبل سے ہٹا دیتا ہے۔ آپ کے عناصر پر پہلے سے ٹائپ کی گئی قدریں فائل میں محفوظ رہتی ہیں اور اگر آپ دوبارہ وہی کلید ڈیزائن کریں تو واپس آ جاتی ہیں۔';
$ec_lang['lpn_cp_none']='ابھی تک کوئی حسب ضرورت خصوصیت ڈیزائن نہیں کی گئی۔';
$ec_lang['lpn_cp_unnamed']='ابھی نام نہیں دیا گیا';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='کلید';
$ec_lang['lpn_cp_key_tip']='کلید: ایک خصوصیت اسی نام کے تحت محفوظ کی جاتی ہے۔ خالی جگہوں کی اجازت نہیں، اور آپ کے لیے ایک سابقہ خود بخود شامل کر دیا جاتا ہے تاکہ آپ کی کلید کسی پہلے سے موجود فیلڈ سے کبھی نہ ٹکرائے۔';
$ec_lang['lpn_cp_label']='لیبل';
$ec_lang['lpn_cp_label_tip']='لیبل: قاری اسے پراپرٹیز باکس پر، تلاش میں، اور ٹیبل کالم کے سرے پر دیکھتا ہے۔';
$ec_lang['lpn_cp_applies']='اطلاق برائے';
$ec_lang['lpn_cp_applies_tip']='اطلاق برائے: ان عناصر کے ID سابقوں کی کوما سے الگ کی گئی فہرست جو یہ خصوصیت استعمال کرتے ہیں، جیسے J,L,R۔';
$ec_lang['lpn_cp_validate']='توثیق بطور';
$ec_lang['lpn_cp_validate_tip']='توثیق بطور: یہ بتاتا ہے کہ ایک درست قدر کیسی نظر آتی ہے۔ کیس کے قواعد صرف انگریزی حروف تہجی پڑھتے ہیں، جو ایک بیان کردہ حد ہے۔ کچھ بھی قبول کرنے کے لیے توثیق نہ کریں منتخب کریں۔';
$ec_lang['lpn_cp_restrict']='ان حروف کو محدود کریں';
$ec_lang['lpn_cp_restrict_tip']='ان حروف کو محدود کریں: ایک قدر صرف یہاں درج حروف استعمال کر سکتی ہے، یا ان میں سے کوئی بھی نہیں، جہاں "@" کا مطلب کوئی بھی حرف ہے؛ "#" کا مطلب کوئی بھی عددی ہندسہ ہے، اور اگر "-"، "."، اور "," کی اجازت ہو تو انہیں الگ سے درج کرنا ضروری ہے؛ اور کوئی بھی خالی جگہ کا حرف دوسرے حروف کے درمیان ہی ہونا چاہیے۔';
$ec_lang['lpn_cp_restrict_mode']='اجازت دیں یا محدود کریں';
$ec_lang['lpn_cp_restrict_mode_tip']='اجازت دیں یا محدود کریں: دیے گئے حروف یا تو وہی ہیں جو ایک قدر استعمال کر سکتی ہے یا وہ ہیں جو استعمال نہیں کر سکتی۔';
$ec_lang['lpn_cp_restrict_allow']='صرف یہ حروف اجازت دیں';
$ec_lang['lpn_cp_minlength']='لمبائی کی کم از کم حد';
$ec_lang['lpn_cp_minlength_tip']='لمبائی کی کم از کم حد: کوئی بھی مختصر تر اندراج نشان زد کیا جاتا ہے، اسی طرح آپ خالی اور آدھی ٹائپ کی گئی اندراجات تلاش کرتے ہیں۔';
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
$ec_lang['lpn_scenario_overrides']='اپنی قدروں کی تعداد';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='کہربائی رنگ کا حلقہ ظاہر کرتا ہے کہ یہ عنصر ایسی قدر رکھتا ہے جو صرف منظرنامہ {name} سے تعلق رکھتی ہے۔';
$ec_lang['lpn_scenario_overrides_tip']='ان میں سے ہر قدر نقشے پر کہربائی رنگ کے حلقے سے نشان زد ہے۔ انہیں بغیر دیکھنے کے لیے {base} پر جائیں۔';
$ec_lang['lpn_scenario_menu']='منظرنامے';
$ec_lang['lpn_scenario_tip']='قدروں کا وہ مجموعہ جو ڈرائنگ اس وقت دکھا رہی ہے اور صفحہ ابھی حل کر رہا ہے۔ منظرنامے بدلنے، یا کوئی نیا شامل کرنے، نام بدلنے، یا حذف کرنے کے لیے کلک کریں۔';
$ec_lang['lpn_scenario_new']='نیا منظرنامہ…';
$ec_lang['lpn_scenario_new_name']='منظرنامہ {n}';
$ec_lang['lpn_scenario_prompt_name']='اس منظرنامے کا نام';
$ec_lang['lpn_scenario_rename']='منظرنامے کا نام بدلیں…';
$ec_lang['lpn_scenario_delete']='منظرنامہ حذف کریں';
$ec_lang['lpn_scenario_delete_confirm']='منظرنامہ {name} حذف کریں، اور وہ {n} قدریں جو صرف اسی سے تعلق رکھتی ہیں؟ ڈرائنگ خود تبدیل نہیں ہوتی۔';
$ec_lang['lpn_scenario_override']='صرف اسی منظرنامے میں';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='نشان لگا ہونے کا مطلب ہے کہ اس منظرنامے میں اس قدر کے لیے اندراج موجود ہے، چاہے یہ بنیاد جیسی ہی قدر ہو۔ دوبارہ بنیاد کی قدر استعمال کرنے کے لیے نشان ہٹا دیں۔';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='بنیادی منظرنامہ: {value}';
$ec_lang['lpn_scenario_deactivated']='{id}، {scenario} میں نیٹ ورک سے باہر ہے۔ یہ اب بھی ڈرائنگ میں، اور آپ کے دیگر منظرناموں میں موجود ہے۔';
$ec_lang['lpn_scenario_push_btn']='بنیاد کی قدریں تمام منظرناموں پر لاگو کریں';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='ہر منظرنامہ ان خصوصیات کے لیے بنیاد کی قدر پر واپس چلا جاتا ہے جن کے لیبل ابھی دکھائے جا رہے ہیں۔ کسی بھی منظرنامے میں ان کے لیے درج کردہ قدریں ضائع کر دی جاتی ہیں۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='ہر منظرنامے کو ان خصوصیات کے لیے بنیاد کی قدریں استعمال کرنے دیں؟ کسی بھی منظرنامے میں ان کے لیے درج کردہ قدریں ضائع کر دی جاتی ہیں۔ آپ اسے واپس کر سکتے ہیں۔';
$ec_lang['lpn_scenario_push_scenarios']='متاثرہ منظرنامے:';
$ec_lang['lpn_scenario_push_values']='ضائع کی گئی قدریں:';
$ec_lang['lpn_scenario_push_none']='ان میں سے کسی خصوصیت کی کسی منظرنامے کے پاس اپنی قدر نہیں ہے، اس لیے کچھ بھی تبدیل نہیں ہوگا۔ کچھ بھی ضائع نہیں کیا جائے گا۔';
$ec_lang['lpn_scenario_preset_flow_static']='1. فلو ٹیسٹ: جامد';
$ec_lang['lpn_scenario_preset_flow_static_tip']='ڈیزائن نیٹ ورک کے لیے صفر بہاؤ پر فلو ٹیسٹ کی کیلیبریشن۔ اس منظرنامے میں تمام جنکشنز کی طلب 0 مقرر کریں۔';
$ec_lang['lpn_scenario_preset_flow_mid']='2. فلو ٹیسٹ: درمیانہ';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='ڈیزائن نیٹ ورک کے لیے رپورٹ کیے گئے پہلے بہاؤ پر فلو ٹیسٹ کی کیلیبریشن۔ اس منظرنامے میں بہنے والے جنکشن کی طلب کو ناپے گئے پہلے بہاؤ پر، اور باقی تمام جنکشنز کی طلب کو 0 پر مقرر کریں۔';
$ec_lang['lpn_scenario_preset_flow_max']='3. فلو ٹیسٹ: زیادہ سے زیادہ';
$ec_lang['lpn_scenario_preset_flow_max_tip']='ڈیزائن نیٹ ورک کے لیے رپورٹ کیے گئے زیادہ سے زیادہ بہاؤ پر فلو ٹیسٹ کی کیلیبریشن۔ اس منظرنامے میں بہنے والے جنکشن کی طلب کو ناپے گئے زیادہ سے زیادہ بہاؤ پر، اور باقی تمام جنکشنز کی طلب کو 0 پر مقرر کریں۔';
$ec_lang['lpn_scenario_preset_average_day']='4. اوسط دن';
$ec_lang['lpn_scenario_preset_average_day_tip']='طلب ضارب 1: ہر طلب جیسی درج کی گئی ہے، جسے اوسط دن کی طلب مانا جاتا ہے۔';
$ec_lang['lpn_scenario_preset_max_day']='5. زیادہ سے زیادہ دن';
$ec_lang['lpn_scenario_preset_max_day_tip']='طلب ضارب اوسط دن کا 2.0 گنا، ایک عارضی قدر۔ زیادہ تر نظام 1.2 اور 3.0 کے درمیان آتے ہیں (National Research Council, 2006)۔ اپنے نظام کی قدر ترتیبات، حساب، ہائیڈرالکس، طلب ضارب میں مقرر کریں۔';
$ec_lang['lpn_scenario_preset_peak_hour']='6. عروجی گھنٹہ';
$ec_lang['lpn_scenario_preset_peak_hour_tip']='طلب ضارب اوسط دن کا 3.0 گنا، ایک عارضی قدر۔ زیادہ تر نظام 3.0 اور 6.0 کے درمیان آتے ہیں (National Research Council, 2006)۔ اپنے نظام کی قدر ترتیبات، حساب، ہائیڈرالکس، طلب ضارب میں مقرر کریں۔';
$ec_lang['lpn_scenario_preset_fire_max_day']='7. فائر اور زیادہ سے زیادہ دن';
$ec_lang['lpn_scenario_preset_fire_max_day_tip']='زیادہ سے زیادہ دن کی طلب (ضارب 2.0)۔ اس منظرنامے میں فائر فلو تجزیہ چلائیں: یہ اس طلب کے اوپر ہر جنکشن پر فائر فلو شامل کرتا ہے۔';
$ec_lang['lpn_delete_drops_overrides']='اس عنصر کو حذف کرنے سے وہ {n} قدریں بھی ضائع ہو جائیں گی جو آپ کے منظرنامے اس کے لیے رکھتے ہیں۔ جاری رکھیں؟';
$ec_lang['lpn_push_base_only']='یہ عمل خود ڈرائنگ کو تبدیل کرتا ہے، اس لیے یہ صرف {base} میں کیا جا سکتا ہے۔ {base} پر جائیں اور دوبارہ کوشش کریں۔';
$ec_lang['lpn_field_active']='نیٹ ورک کا حصہ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='اس عنصر کو ڈرائنگ پر رکھنے مگر نیٹ ورک سے باہر رکھنے کے لیے یہ خانہ خالی کریں: یہ سرمئی رنگ میں دکھایا جاتا ہے اور حل کار اسے نظر انداز کرتا ہے۔ کسی منظرنامے میں یوں ہی ایک پائپ کو آن اور آف کیا جاتا ہے۔';
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
$ec_lang['lpn_settings_emitter_exponent_tip']='EPANET کے ایمیٹر مساوات میں سپرنکلر اور رساؤ کے لیے اکسپوننٹ: بہاؤ = گتانک x دباؤ اس اکسپوننٹ کی قوت پر۔ یہ جواب صرف وہاں بدلتا ہے جہاں کسی نوڈ میں ایمیٹر ہو، جو فی الحال صرف EPANET فائل سے پڑھے گئے نیٹ ورک میں ممکن ہے۔';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='DEM پڑھیں';
$ec_lang['lpn_elev_dem_sample_tip']='اس نوڈ پر DEM کی بلندی پڑھتا ہے اور نیچے دکھاتا ہے۔ بلندی کے خانے میں کچھ تبدیل نہیں ہوتا۔ زیادہ تر زمین پر افقی DEM ریزولیوشن تقریباً 30 میٹر ہے، اور جہاں بہتر ڈیٹا موجود ہو وہاں باریک تر ہے۔';
$ec_lang['lpn_elev_dem_use']='DEM استعمال کریں';
$ec_lang['lpn_elev_dem_use_tip']='اس نوڈ پر DEM کی بلندی کو اوپر بلندی کے خانے میں ڈالتا ہے، جو وہاں پہلے سے موجود ہے اس کی جگہ لیتے ہوئے۔ اگر DEM ابھی تک نہیں پڑھا گیا تو یہ پہلے اسے پڑھتا ہے۔ ایک انڈو اسے واپس کر دیتا ہے۔';
$ec_lang['lpn_elev_dem_none']='DEM کے پاس اس نوڈ کے لیے کوئی بلندی نہیں۔';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM کہتا ہے {v} {u}۔';
$ec_lang['lpn_settings_elev_source']='بلندی کا ذریعہ';
$ec_lang['lpn_settings_elev_source_tip']='نیا نوڈ اپنی بلندی کہاں سے لیتا ہے۔ زمین کی سطح Mapbox DEM سے پڑھی جاتی ہے، جو زیادہ تر زمین پر تقریباً 30 میٹر چوڑا ہے اور جہاں بہتر ڈیٹا موجود ہو وہاں باریک تر ہے۔';
$ec_lang['lpn_settings_elev_source_typed']='اوپر لکھی گئی بلندی';
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
$ec_lang['lpn_settings_accuracy_tip']='حل کار کو رکنے سے پہلے کتنا قریب پہنچنا ہے، اس مقدار سے ناپا جاتا ہے جس سے بہاؤ ایک کوشش سے اگلی کوشش تک اب بھی بدل رہا ہو۔ چھوٹا عدد زیادہ درست ہے اور زیادہ وقت لیتا ہے۔ دونوں حل کار اسی ایک خانے کو پڑھتے ہیں، اور ہر ایک اس تبدیلی کو ایک مختلف مجموعے کے مقابلے میں ناپتا ہے: بلٹ اِن حل کار طلبات کے مجموعے کے مقابلے میں، EPANET لنک بہاؤ کے مجموعے کے مقابلے میں۔ خالی چھوڑنے پر یہ صفحہ EPANET کی اپنی پہلے سے مقررہ درستگی سے زیادہ سخت درستگی استعمال کرتا ہے۔';
$ec_lang['lpn_settings_specific_gravity']='مخصوص کثافت';
$ec_lang['lpn_settings_viscosity']='نسبتی چپکاؤ';
$ec_lang['lpn_settings_viscosity_tip']='20 ڈگری سیلسیس پر پانی کے مقابلے میں سیال کا چپکاؤ۔ یہ صرف Darcy-Weisbach طریقے کے تحت جواب بدلتا ہے۔';
$ec_lang['lpn_settings_trials']='زیادہ سے زیادہ کوششیں';
$ec_lang['lpn_settings_trials_tip']='ایسے نیٹ ورک پر جو ہم آہنگ (converge) نہیں ہوتا، حل کار کے ہار ماننے سے پہلے کتنی کوششوں کی اجازت ہے۔';
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
$ec_lang['lpn_settings_unbalanced_tip']='ایسے نیٹ ورک کے ساتھ کیا کیا جائے جس نے اپنی کوششیں ختم کر لی ہوں اور پھر بھی ہم آہنگ نہ ہوا ہو۔ اضافی کوششوں کی اجازت دینا اکثر ہم آہنگی تک پہنچا دیتا ہے۔ رکنا آخری کوشش کو جیسی ہے ویسی رپورٹ کرتا ہے، جو کوئی حل نہیں ہے۔ صرف EPANET حل کار اس خانے کو پڑھتا ہے۔ بلٹ اِن حل کار ہمیشہ رک جاتا ہے اور جواب کو ہم آہنگ نہ ہونے کے طور پر نشان زد کرتا ہے۔';
$ec_lang['lpn_settings_unbalanced_continue']='اضافی کوششوں کی اجازت دیں';
$ec_lang['lpn_settings_unbalanced_stop']='رک کر آخری کوشش رپورٹ کریں';
$ec_lang['lpn_settings_unbalanced_trials']='رپورٹ کرنے سے پہلے اضافی کوششیں';
$ec_lang['lpn_settings_unbalanced_trials_tip']='اوپر دی گئی زیادہ سے زیادہ حد ختم ہونے کے بعد، آخری کوشش رپورٹ کرنے سے پہلے مزید کتنی کوششوں کی اجازت دی جائے۔ صرف EPANET حل کار اس خانے کو پڑھتا ہے۔';
$ec_lang['lpn_settings_head_error']='ہیڈ خرابی کی حد';
$ec_lang['lpn_settings_head_error_tip']='حل کار کے رکنے سے پہلے اسے پاس کرنی والی ایک اضافی جانچ: کسی ایک پائپ میں باقی رہ جانے والی سب سے بڑی ہیڈ خرابی۔ صفر کا مطلب ہے یہ جانچ لاگو نہ کی جائے۔ صرف EPANET حل کار اس خانے کو پڑھتا ہے۔';
$ec_lang['lpn_settings_flow_change']='بہاؤ تبدیلی کی حد';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='حل کار کے رکنے سے پہلے اسے پاس کرنی والی ایک اضافی جانچ: کسی ایک پائپ کے بہاؤ میں ایک کوشش سے اگلی کوشش تک زیادہ سے زیادہ تبدیلی۔ صفر کا مطلب ہے یہ جانچ لاگو نہ کی جائے۔ صرف EPANET حل کار اس خانے کو پڑھتا ہے۔';
$ec_lang['lpn_settings_damp_limit']='ڈیمپنگ یہاں سے شروع ہوتی ہے';
$ec_lang['lpn_settings_damp_limit_tip']='وہ درستگی جس پر حل کار چھوٹے قدم اٹھانا شروع کرتا ہے، جو ایک لرزتے نیٹ ورک کو ہم آہنگ ہونے میں مدد دے سکتا ہے۔ صفر کا مطلب ہے حل کار کبھی ڈیمپ نہیں کرتا۔ صرف EPANET حل کار اس خانے کو پڑھتا ہے۔';
$ec_lang['lpn_settings_option_unset']='بیان نہیں کیا گیا';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='ایک ہی عدد جو نیٹ ورک کی ہر طلب پر ایک ساتھ لاگو ہوتا ہے۔ اسے یہ پوچھنے کے لیے استعمال کریں کہ نظام آج کے استعمال سے کم یا زیادہ پر کیا کرتا ہے۔ یہ آپ کے لکھے ہوئے اعداد کو نہیں بدلتا۔ ایک منظرنامہ اپنا الگ عدد رکھ سکتا ہے، تاکہ اوسط دن، زیادہ سے زیادہ دن اور عروج گھنٹہ ہر ایک صرف ایک عدد ہو؛ پراجیکٹ کا عدد استعمال کرنے کے لیے منظرنامے میں اسے خالی چھوڑ دیں۔';
$ec_lang['lpn_settings_engine_native']='EPANET حل کار سے حل کریں';
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
$ec_lang['lpn_settings_engine_native_tip']='اس خانے کو نشان زد کریں تاکہ جہاں ممکن ہو بلٹ اِن حل کار استعمال ہو۔ ورنہ، US EPA کا EPANET حل کار ہمیشہ استعمال ہوتا ہے۔ بلٹ اِن حل کار توسیعی مدت کے سمیولیشن یا فعال PRV، PSV، یا FCV کے لیے استعمال نہیں ہوتا۔ EPANET حل کار پہلی بار استعمال ہونے پر تقریباً 650 KB ڈاؤن لوڈ ہوتا ہے اور پھر اس آلے پر محفوظ رہتا ہے۔ جہاں کسی پائپ میں معمولی (مقامی) نقصان ہو، دونوں حل کار آخری ہندسوں میں مختلف نتیجہ دیتے ہیں: EPANET کشش ثقل کے لیے جو قدر استعمال کرتا ہے اسے گول کرتا ہے، اس لیے اس کے معمولی نقصانات درست شکل سے بہت معمولی حد تک کم آتے ہیں۔';
$ec_lang['lpn_engine_loading']='EPANET حل کار لوڈ ہو رہا ہے…';
$ec_lang['lpn_engine_failed']='EPANET حل کار لوڈ نہیں ہو سکا۔ اس کی بجائے بلٹ ان حل کار دکھایا جا رہا ہے۔';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='EPANET حل کار سے حل کیا گیا، کیونکہ یہ والوز خود بخود کھلتے اور بند ہوتے ہیں:';
$ec_lang['lpn_unit_unknown']='یہ ڈرائنگ ایک ایسے یونٹ کا ذکر کرتی ہے جو یہ صفحہ فراہم نہیں کرتا: {unit}۔ ہر چیز بالکل اسی طرح رکھی اور دکھائی گئی ہے جیسے وہ آئی تھی، اور کچھ بھی تبدیل نہیں کیا گیا۔ جب تک یہ صفحہ اس یونٹ کو نہیں جانتا کوئی جواب نہیں دیا جا سکتا، کیونکہ یہ بتانے کا کوئی طریقہ نہیں کہ یہ کتنا بڑا ہے۔';
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
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='سکرین پر موجود اعداد اس کی بجائے بلٹ ان حل کار سے آئے ہیں۔ یہ ایک وقت میں ایک ہی لمحہ حل کرتا ہے، اس لیے یہ صرف {time} پر نیٹ ورک ہے، جس میں ہر ٹینک ابھی تک اپنی ابتدائی سطح پر ہے۔';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='یہ کنٹرول ایک ایسے عنصر کا نام لیتے ہیں جو اب اس پراجیکٹ میں نہیں، اس لیے انہیں چھوڑ دیا گیا: {ids}';
$ec_lang['lpn_control_unreadable_note']='یہ کنٹرول پڑھے نہیں جا سکے، اس لیے انہیں چھوڑ دیا گیا: {ids}';
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
$ec_lang['lpn_settings_show_arrows_tip']='ہر پائپ پر تیر کھینچتا ہے جو دکھاتا ہے کہ پانی کس طرف بہہ رہا ہے۔ تیر حل کے بعد ظاہر ہوتے ہیں، اور انہیں بند کرنے سے نتائج تبدیل نہیں ہوتے۔ یہ ترتیب پراجیکٹ کے ساتھ محفوظ ہوتی ہے۔';
$ec_lang['lpn_settings_align_labels']='پائپ لیبلز کو پائپوں کے ساتھ سیدھا کریں';
$ec_lang['lpn_settings_readability_bias']='عمودی سے کتنے درجے بائیں طرف ہونے پر لیبل الٹا دیا جاتا ہے';
$ec_lang['lpn_settings_readability_bias_tip']='جب لیبل عمودی سے اتنے درجے زیادہ بائیں طرف جھکا ہو تو اسے سیدھا رکھنے کے لیے الٹ دیں۔';
$ec_lang['lpn_settings_mask_labels']='لیبلز کے پیچھے ٹھوس پس منظر';
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
$ec_lang['lpn_settings_label_max_width_tip']='لیبلز صرف اس وقت کھینچے جاتے ہیں جب نقشے کا منظر اتنا چوڑا یا اس سے تنگ ہو۔ ہر زوم پر انہیں کھینچنے کے لیے خانہ خالی چھوڑیں۔ کسی بھی زوم پر کبھی لیبل نہ کھینچنے کے لیے 0 ٹائپ کریں۔';
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
$ec_lang['lpn_settings_symbol_cap_tip']='ایک جنکشن زمین پر بڑھنا اس وقت روک دیتا ہے جب اس کا قطر نیٹ ورک میں تمام پائپ کی لمبائیوں کے اس پرسنٹائل پر پائپ کی لمبائی کے اتنے گنا ہو جائے۔ نقشے پر اس نقطے کے بعد، جنکشن، پائپ اور دیگر علامتیں زمین پر بڑھنے کی بجائے آپ کے باہر زوم کرنے پر سکرین پر سکڑ جاتی ہیں۔ ریزروائرز اور ٹینک اس سے مستثنیٰ ہیں اور ہر زوم پر اپنا سکرین سائز برقرار رکھتے ہیں۔';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='علامت کی دھندلاہٹ (0 سے 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='پس منظر کی تصویر کی دھندلاہٹ (0 سے 1)';
$ec_lang['lpn_settings_map_display']='ظاہری شکل';
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
$ec_lang['lpn_time_clock_day']='دن {day}، {clock}';
$ec_lang['lpn_time_format_tip']='وقت گھنٹے اور منٹ کی صورت میں لکھیں، جیسے 2:30۔ سادہ عدد کا مطلب گھنٹے ہیں، اس لیے 8 کا مطلب آٹھ گھنٹے ہے۔ آدھا گھنٹہ 0:30 ہے۔';
$ec_lang['lpn_time_running']='EPANET حل کار کے ساتھ وقتی دورانیے کی سمولیشن نکالی جا رہی ہے۔';
$ec_lang['lpn_time_no_engine']='بلٹ اِن حل کار ایک وقت میں ایک لمحہ نکالتا ہے، اس لیے یہ صرف {time} پر نیٹ ورک ہے: ہر پیٹرن اسی لمحے پر پڑھا جاتا ہے، اور ہر ٹینک بھرنے اور خالی ہونے کے بجائے اب بھی اپنی ابتدائی سطح پر بیٹھا ہے۔ EPANET حل کار حاصل کرنے کے لیے ایک بار انٹرنیٹ سے جڑیں، جو وقتی دورانیے کی سمولیشن چلاتا ہے۔';
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
$ec_lang['lpn_time_run_report']='EPANET رن رپورٹ';
$ec_lang['lpn_time_run_report_copy']='کاپی کریں';
$ec_lang['lpn_time_run_report_copied']='کاپی ہو گیا';
$ec_lang['lpn_time_run_report_tip']='EPANET حل کار نے آخری رن کے بارے میں خود کیا چھاپا: آیا یہ ہم آہنگ ہوا، اور اس نے کس بارے میں خبردار کیا۔ یہ حل کار کا اپنا متن ہے، ہمارا نہیں۔';

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
$ec_lang['lpn_settings_search_tip']='ایک یا زیادہ الفاظ ٹائپ کریں تاکہ وہ ترتیبات نظر آئیں جن میں یہ سب الفاظ ہوں۔';
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
$ec_lang['lpn_settings_sec_map']='نقشہ اور صفحہ';
$ec_lang['lpn_settings_sec_assets']='عناصر';
$ec_lang['lpn_settings_sec_calculation']='حساب';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='گاہک';
$ec_lang['lpn_labels_customer_note']='گاہک لیبل یہاں نشان زد کردہ قدریں دکھاتا ہے۔ یہ نقشے پر ہر دوسرے لیبل جتنے ہی متن سائز پر کھینچا جاتا ہے۔';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='گاہک لیبلز صرف اس وقت کھینچے جاتے ہیں جب نقشے کا منظر اتنا چوڑا یا اس سے تنگ ہو۔ ہر زوم پر انہیں کھینچنے کے لیے خانہ خالی چھوڑیں۔ کسی بھی زوم پر کبھی گاہک لیبل نہ کھینچنے کے لیے 0 ٹائپ کریں۔ اگر یہ تمام لیبلز کے لیے ملتی جلتی ترتیب سے بڑا ہو تو اس کا کوئی اثر نہیں ہوتا۔';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='موجودہ منظر استعمال کریں';
$ec_lang['lpn_settings_page']='صفحہ';
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
$ec_lang['lpn_quality_chemical_name_tip']='وہ کیمیکل جسے آپ ٹریک کر رہے ہیں، مثال کے طور پر کلورین۔ EPANET کے اپنے ڈیفالٹ لیبل، Chemical، کے لیے اسے خالی چھوڑ دیں۔ یہ آپ کی رپورٹس میں ظاہر ہوتا ہے، لیکن حسابات میں استعمال نہیں ہوتا۔';
$ec_lang['lpn_quality_mass_units']='ماس یونٹس';
$ec_lang['lpn_quality_mass_units_tip']='معیار اندراج کا یونٹس والا حصہ، EPANET کے اپنے دو انتخاب۔';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='معیار کی رواداری';
$ec_lang['lpn_quality_tolerance_tip']='پانی کے دو ملحقہ پارسل ارتکاز میں کتنا مختلف ہو سکتے ہیں اس سے پہلے کہ EPANET انہیں ایک سمجھے۔ خالی چھوڑنے پر EPANET کی اپنی پہلے سے مقررہ 0.01 استعمال ہوتی ہے۔';
$ec_lang['lpn_quality_diffusivity']='نسبتی پھیلاؤ پذیری';
$ec_lang['lpn_quality_diffusivity_tip']='کیمیکل پانی میں کتنی آسانی سے پھیلتا ہے، کلورین کے مقابلے میں۔ خالی چھوڑنے پر EPANET کی اپنی پہلے سے مقررہ 1.0 استعمال ہوتی ہے۔';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='{chemical} ارتکاز';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='اوسط {chemical} ارتکاز';
$ec_lang['lpn_quality_initial']='ابتدائی معیار';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='یہ نوڈ رن شروع ہونے پر کتنا کیمیکل رکھتا ہے۔ ایک ریزروائر پوری رن کے لیے اپنی ہی قدر برقرار رکھتا ہے، جو عموماً ٹریٹمنٹ پلانٹ سے نکلنے والے ریزیجوول کو بیان کرنے کا انداز ہے۔ اسے خالی چھوڑیں تو نوڈ بغیر کسی کیمیکل کے شروع ہوتا ہے۔';
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
$ec_lang['lpn_source_quality_tip']='خوراک کتنی مضبوط ہے۔ ماس بوسٹر کے سوا ہر قسم کے لیے یہ ایک ارتکاز ہے، انہی یونٹس میں جو ترتیبات، پانی کا معیار کے تحت کیمیکل کے ساتھ بتائے گئے ہیں؛ ماس بوسٹر کے لیے یہ فی منٹ کیمیکل کی مقدار ہے۔ اسے خالی چھوڑیں تو یہاں کچھ شامل نہیں ہوتا، جو صفر جیسا نہیں: صفر ایک ایسی فیڈ ہے جو چل رہی ہے اور کچھ شامل نہیں کر رہی۔';
$ec_lang['lpn_source_pattern']='سورس پیٹرن';
$ec_lang['lpn_source_pattern_tip']='ایک وقتی پیٹرن جو رن کے دوران خوراک کو بڑھاتا گھٹاتا ہے، ایسی فیڈ کے لیے جو مستقل نہیں۔ کوئی پیٹرن نہ ہونے کا مطلب ہے کہ خوراک ہر مرحلے پر یکساں ہے۔';
$ec_lang['lpn_mixing_model']='مکسنگ ماڈل';
$ec_lang['lpn_mixing_model_tip']='اس ٹینک میں پہلے سے موجود پانی آنے والے پانی سے کیسے ملتا ہے۔ مکمل مکسنگ پورے ٹینک کو ایک ساتھ ہلاتی ہے۔ ٹو-کمپارٹمنٹ مکسنگ پہلے ایک انلیٹ زون بھرتی ہے اور باقی آگے بھیجتی ہے۔ FIFO پلگ فلو پانی کو اسی ترتیب میں آگے لے جاتا ہے جس میں وہ پہنچا۔ LIFO پلگ فلو اسے تہہ کرتا ہے، اس لیے آخر میں آنے والا پانی سب سے پہلے نکلتا ہے۔ یہ انتخاب پانی کی عمر اور ریزیجوول کو بدلتا ہے، اور یہ کوئی دباؤ یا بہاؤ نہیں بدلتا۔';
$ec_lang['lpn_mixing_mixed']='مکمل مکسنگ';
$ec_lang['lpn_mixing_2comp']='ٹو-کمپارٹمنٹ مکسنگ';
$ec_lang['lpn_mixing_fifo']='FIFO پلگ فلو';
$ec_lang['lpn_mixing_lifo']='LIFO پلگ فلو';
$ec_lang['lpn_mixing_fraction']='مکسنگ فریکشن';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='ٹینک کے حجم کا وہ حصہ جو انلیٹ زون گھیرتا ہے، 0 اور 1 کے درمیان۔ صرف ٹو-کمپارٹمنٹ مکسنگ اسے استعمال کرتی ہے۔ اسے خالی چھوڑیں تو پورا ٹینک انلیٹ زون بن جاتا ہے، جو EPANET کا مفروضہ ہے۔';
$ec_lang['lpn_reaction_bulk']='بلک ری ایکشن گتانک';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='پانی کے اندر رد عمل، ہر اس پائپ کے لیے استعمال ہوتا ہے جو اپنا نہیں رکھتا۔ منفی عدد کیمیکل کو کم کرتا ہے اور مثبت عدد اسے بڑھاتا ہے۔ رد عمل فرسٹ آرڈر ہوتا ہے جب تک درآمد شدہ EPANET فائل کوئی اور آرڈر بیان نہ کرے، اس لیے گتانک 1/day میں ایک شرح ہے۔ خالی خانے کا مطلب کوئی بلک ری ایکشن نہیں۔';
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
$ec_lang['lpn_reaction_order_unstated']='بیان نہیں کیا گیا';
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
$ec_lang['lpn_reports_epanet']='EPANET رن';
$ec_lang['lpn_energy_title']='پمپ توانائی رپورٹ';
$ec_lang['lpn_energy_menu']='پمپ توانائی';
$ec_lang['lpn_energy_efficiency']='پمپ افادیت (فیصد)';
$ec_lang['lpn_energy_efficiency_tip']='وائر-ٹو-واٹر افادیت جو ہر اس پمپ کے لیے استعمال ہوتی ہے جو اپنا افادیت وکر نہیں رکھتا۔ کچھ بیان نہ ہونے پر EPANET 75 فیصد استعمال کرتا ہے۔';
$ec_lang['lpn_energy_price']='بجلی کی قیمت';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='ایک کلو واٹ گھنٹے کی قیمت کیا ہے۔ یہ ہر اس پمپ پر لاگو ہوتی ہے جو اپنی قیمت نہیں رکھتا۔ اسے خالی چھوڑیں تو رپورٹ میں ہر لاگت صفر ہوتی ہے۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='اس پمپ پر ایک کلو واٹ گھنٹے کی قیمت کیا ہے۔ اسے خالی چھوڑیں تو پمپ ترتیبات، توانائی کے تحت پورے نیٹ ورک کے لیے مقرر کردہ قیمت ادا کرتا ہے۔';
$ec_lang['lpn_energy_price_pattern']='قیمت پیٹرن';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='ایک پیٹرن جو ہر پیٹرن مرحلے پر قیمت کو ضرب دیتا ہے، جو آف-پیک ریٹ بیان کرنے کا طریقہ ہے۔ پوری رن میں ایک ہی قیمت کے لیے اسے خالی چھوڑیں۔';
$ec_lang['lpn_energy_demand_charge']='پیک ڈیمانڈ چارج';
$ec_lang['lpn_energy_demand_charge_tip']='نظام میں پمپوں کی طلب کردہ پیک لوڈ کے لیے یوٹیلٹی فی kW کتنا چارج کرتی ہے۔';
$ec_lang['lpn_energy_currency']='کرنسی';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='آپ یہاں جو کچھ لکھیں وہ ہر رقم کے عدد کے ساتھ چھاپا جاتا ہے۔ یہ ایک لیبل ہے۔ قیمتیں اور لاگتیں کبھی تبدیل نہیں کی جاتیں، اس لیے قیمتیں اسی کرنسی میں لکھیں جو آپ نے یہاں لکھی ہے۔';
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
$ec_lang['lpn_scncmp_menu_tip']='اس پراجیکٹ کے ہر منظرنامے کو حل کریں اور انہیں ساتھ ساتھ پڑھیں: ہر ایک میں سب سے کم دباؤ اور سب سے زیادہ رفتار۔';
$ec_lang['lpn_scncmp_running']='ہر منظرنامہ حل کیا جا رہا ہے…';
$ec_lang['lpn_scncmp_empty']='ابھی تک کچھ نہیں کھینچا گیا، اس لیے حل کرنے کو کچھ نہیں۔';
$ec_lang['lpn_scncmp_col_maxvelocity']='سب سے زیادہ رفتار';
$ec_lang['lpn_scncmp_at']='{id} پر {value}';
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
$ec_lang['lpn_energy_col_kwh']='kWh';
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
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='حالت';
$ec_lang['lpn_reports_status_tip']='آخری توسیعی دورانیے کی سمولیشن کے دوران وقت کی ترتیب میں کیا بدلا: پمپ اور والوز کا کھلنا یا بند ہونا، ٹینکوں کا بھرنا، خالی ہونا، بھر جانا یا خشک ہو جانا، اور وہ مراحل جو مکمل طور پر ہم آہنگ نہیں ہوئے۔';
$ec_lang['lpn_status_title']='حالت رپورٹ';
$ec_lang['lpn_status_needs_run']='حالت رپورٹ اس بات کی فہرست دیتی ہے کہ توسیعی دورانیے کی سمولیشن کے دوران کیا بدلا۔ ترتیبات، حساب، وقت میں کل چلنے کا وقت مقرر کریں، حل کریں دبائیں، پھر پانی، رپورٹس، حالت رپورٹ کھولیں۔';
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
$ec_lang['lpn_reports_full_tip']='آخری رن کے ہر رپورٹنگ وقتی مرحلے پر ہر نوڈ اور ہر لنک، ایک جدول کے طور پر جسے آپ ڈاؤن لوڈ یا پرنٹ کر سکتے ہیں۔';
$ec_lang['lpn_full_title']='مکمل رپورٹ';
$ec_lang['lpn_full_needs_run']='مکمل رپورٹ ہر رپورٹنگ وقتی مرحلے پر ہر نوڈ اور ہر لنک کی فہرست دیتی ہے۔ حل کریں دبائیں، پھر پانی، رپورٹس، مکمل رپورٹ کھولیں۔';
$ec_lang['lpn_full_note']='فی نوڈ یا لنک، فی رپورٹنگ وقتی مرحلہ ایک قطار، جدولوں کے پینل پر دکھائے گئے یونٹس میں۔ خالی سیل وہ کالم ہے جس میں وہ مقدار نہیں ہوتی۔ ڈاؤن لوڈ یا پرنٹ ہر وقتی مرحلہ لے جاتا ہے؛ نیچے دیا گیا جدول ایک وقت میں ایک دکھاتا ہے۔';
$ec_lang['lpn_full_step_label']='وقتی مرحلہ';
$ec_lang['lpn_full_download_csv']='CSV ڈاؤن لوڈ کریں';
$ec_lang['lpn_full_print']='رپورٹ پرنٹ کریں';
$ec_lang['lpn_full_col_time']='وقت';
$ec_lang['lpn_full_col_type']='قسم';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} قطاریں۔';
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
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0.000';
$ec_lang['lpn_labels_col_rank']='درجہ';
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
$ec_lang['lpn_library_patterns_tip']='پیٹرن مضاعفوں کی ایک فہرست ہے جو دہراتی ہے۔ ہر ایک ایک پیٹرن وقفے پر لاگو ہوتا ہے، اس لیے ایک گھنٹے کے وقفے پر 24 اعداد ایک ایسا دن بناتے ہیں جو دہراتا رہتا ہے۔ 1.5 کے مضاعف کے ساتھ 10 کی طلب اس لمحے 15 ہو جاتی ہے۔';
$ec_lang['lpn_library_curves']='وکر';
$ec_lang['lpn_library_curves_tip']='وکر پوائنٹس کی ایک فہرست ہے جو بتاتی ہے کہ کوئی چیز کیسے کارکردگی دکھاتی ہے: ایک پمپ ہر بہاؤ پر کتنا ہیڈ شامل کرتا ہے، اس بہاؤ پر یہ کتنا موثر ہے، یا ایک والو ہر بہاؤ پر کتنا ہیڈ ضائع کرتا ہے۔';
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
$ec_lang['lpn_library_curve_values_tip']='سپریڈ شیٹ میں ایک یا دو کالم منتخب کریں، انہیں کاپی کریں، اور اس پہلے سیل میں پیسٹ کریں جہاں آپ انہیں لانا چاہتے ہیں۔ ضرورت کے مطابق قطاریں شامل ہو جاتی ہیں۔ آپ EPANET فائل سے سیدھی کاپی کی گئی سطریں بھی پیسٹ کر سکتے ہیں، وکر کا نام سمیت۔';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='تفصیل';
$ec_lang['lpn_library_curve_remove_point']='یہ پوائنٹ ہٹائیں';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='پوائنٹس کاپی کریں';
$ec_lang['lpn_library_curve_copy_tip']='ہر پوائنٹ کو دو کالموں کے طور پر کاپی کرتا ہے، سپریڈ شیٹ میں پیسٹ کرنے کے لیے تیار۔';
$ec_lang['lpn_library_curve_copy_manual']='یہ پوائنٹس کاپی کریں';
$ec_lang['lpn_library_curve_used_by']='اس وکر کو استعمال کرنے والے عناصر';
$ec_lang['lpn_library_curve_unused']='کچھ بھی یہ وکر استعمال نہیں کرتا۔';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='یہ وکر {count} عناصر استعمال کر رہے ہیں: {ids}۔ پہلے انہیں کسی اور وکر کی طرف موڑیں، پھر اسے حذف کریں۔';
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
$ec_lang['lpn_library_pipetypes_note']='ہر پراجیکٹ کی اپنی پائپ کی قسم کی لائبریری ہوتی ہے۔ آپ پائپ کی قسم کی تعریف میں خصوصیات خالی چھوڑ سکتے ہیں۔ مثال کے طور پر، ایک پائپ کی قسم جو کھردرا پن بیان کرے اور قطر نہ بیان کرے، ٹھیک ہے۔ آپ پائپوں کو ان کے خصوصیات ایڈیٹر میں پائپ کی اقسام سے جوڑتے ہیں۔ یہاں تعریف میں ترمیم کرنے سے ہر وہ پائپ بدل جاتا ہے جو اس کا حوالہ دیتا ہے۔';
$ec_lang['lpn_library_pipetype_add']='پائپ کی قسم شامل کریں';
$ec_lang['lpn_library_pipetype_blank_tip']='پائپ کی قسم کی تعریف میں خالی خصوصیات ہر پائپ کے لیے الگ الگ درج کرنے کے لیے چھوڑ دی جاتی ہیں۔';
$ec_lang['lpn_library_pipetype_used_by']='اس قسم کو استعمال کرنے والے پائپ';
$ec_lang['lpn_library_pipetype_unused']='کچھ بھی یہ پائپ کی قسم استعمال نہیں کرتا۔';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='یہ پائپ کی قسم {count} پائپوں کے ذریعے استعمال ہو رہی ہے: {ids}۔ اسے حذف کرنے سے پہلے ان سے الگ کریں۔';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='پائپ کی قسم';
$ec_lang['lpn_field_pipetype_tip']='پراجیکٹ لائبریری میں پائپ کی قسم جو یہ پائپ استعمال کرتا ہے۔ پائپ کی قسم میں شامل خصوصیات یہاں ترمیم کے لیے غیر فعال ہیں۔ یہاں ترمیم فعال کرنے کے لیے پائپ کی قسم سے الگ کریں۔';
$ec_lang['lpn_pipetype_none']='کوئی پائپ کی قسم منتخب نہیں';
$ec_lang['lpn_pipetype_detach']='پائپ کی قسم سے الگ کریں';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='وہ قدریں جو یہ پائپ اپنی قسم سے پڑھتا ہے پائپ میں ہی کاپی کر دیتا ہے اور قسم کا استعمال روک دیتا ہے۔ پائپ کی قدریں ابھی تبدیل نہیں ہوتیں، اور اب سے آپ یہ قدریں یہاں ترمیم کر سکتے ہیں۔';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='فٹنگز';
$ec_lang['lpn_library_fittings_tip']='فٹنگز کی فہرست فٹنگز اور ان کی مقدار کا ایک مجموعہ ہے جس کا حوالہ کئی پائپ دے سکتے ہیں۔ یہ ایک معمولی (مقامی) نقصان گتانک تک جمع ہوتی ہے۔';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='ہر پراجیکٹ کی اپنی فٹنگز لائبریری ہوتی ہے۔ فٹنگز کی فہرست میں ہر فٹنگ کی ایک مقدار ہوتی ہے، اور یہ ایک ہی معمولی (مقامی) نقصان گتانک تک جمع ہوتی ہے۔ پائپ اور پائپ کی اقسام دونوں کسی فہرست کا حوالہ دے سکتے ہیں۔';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='یہاں پیش کی گئی فٹنگز EPANET 2.2 صارف دستی کے جدول 3.3 کی وہ تیرہ ہیں۔ ایک منتخب کرنے سے اس کا گتانک قطار میں کاپی ہو جاتا ہے، جہاں آپ اسے بدل سکتے ہیں۔ گتانک فٹنگ کے سائز اور بناوٹ پر منحصر ہوتا ہے، اس لیے جدول کو جواب کے بجائے آغاز کا نقطہ سمجھیں۔';
$ec_lang['lpn_library_fittings_add']='فٹنگز کی فہرست شامل کریں';
$ec_lang['lpn_library_fittings_used_by']='اس فٹنگز کی فہرست کو استعمال کرنے والے پائپ';
$ec_lang['lpn_library_fittings_unused']='کچھ بھی یہ فٹنگز کی فہرست استعمال نہیں کرتا۔';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='یہ فٹنگز کی فہرست {count} پائپوں کے ذریعے استعمال ہو رہی ہے: {ids}۔ اسے حذف کرنے سے پہلے ان سے الگ کریں۔';
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
$ec_lang['lpn_library_import_needs_fittings']='یہ پائپ کی اقسام ایک ایسی فٹنگز کی فہرست کا حوالہ دیتی ہیں جو اس پراجیکٹ کے پاس نہیں: {names}۔ اسی فائل سے فٹنگز لائبریری درآمد کریں اور انہیں وہ مل جائے گی۔';
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
$ec_lang['lpn_field_fittings_tip']='پراجیکٹ لائبریری سے فٹنگز کی ایک فہرست۔ اس کی مقداریں اور گتانک اس پائپ کے معمولی (مقامی) نقصان گتانک میں جمع ہو جاتے ہیں، اور پھر گتانک کا خانہ صرف پڑھنے کے لیے رہ جاتا ہے۔ خود گتانک ٹائپ کرنے کے لیے اسے غیر منتخب چھوڑ دیں۔';
$ec_lang['lpn_fittings_none']='کوئی فٹنگز کی فہرست منتخب نہیں';
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
$ec_lang['lpn_inp_export_flat_heading']='{file} محفوظ ہو گیا';
$ec_lang['lpn_inp_export_flat_lead']='برآمد کی گئی EPANET فائل عددی طور پر اس پراجیکٹ کے مساوی ہے۔ لیکن اس میں درج ذیل چیزوں کے لیے کوئی جگہ نہیں ہے:';
$ec_lang['lpn_inp_export_flat_types']='یہاں {n} پائپ {t} پائپ کی اقسام کا حوالہ دیتے ہیں۔ فائل میں ان میں سے ہر پائپ اعداد کی اپنی کاپی رکھتا ہے، اس لیے جوابات وہی رہتے ہیں۔ فائل جو نہیں رکھ سکتی وہ پائپ کی قسم خود ہے، اس لیے ایک تعریف میں ترمیم کرنا اور ہر پائپ کا اسے فالو کرنا صرف آپ کی اپنی پراجیکٹ فائل ہی ریکارڈ کرتی ہے۔';
$ec_lang['lpn_inp_export_flat_coords']='ایک EPANET فائل ہر نوڈ کے لیے ایک پوزیشن رکھتی ہے۔ یہ منظرنامہ ان میں سے {n} کو کہیں اور رکھتا ہے، اور یہی وہ پوزیشنیں ہیں جو فائل میں ہیں۔ ہر دوسرا منظرنامہ اپنی پوزیشنیں صرف آپ کی پراجیکٹ فائل میں رکھتا ہے۔';
$ec_lang['lpn_inp_export_flat_fittings']='EPANET فائل آپ کی پراجیکٹ فائل میں موجود کہنیوں، والوز اور ٹیز کی فہرست نہیں رکھ سکتی۔ یہاں {n} پائپوں کا معمولی نقصان گتانک ایک فٹنگز کی فہرست سے جمع کیا گیا ہے۔ کل عدد فائل میں بالکل ویسے ہی جاتا ہے جیسے کھڑا ہے، اس لیے جوابات کے بارے میں کچھ نہیں بدلتا۔';
$ec_lang['lpn_library_controls']='کنٹرولز';
$ec_lang['lpn_library_controls_tip']='کنٹرول ایک جملہ ہے جو کسی لنک کو کھولتا یا بند کرتا ہے، یا اسے کوئی ترتیب دیتا ہے، جب پانی کی سطح، دباؤ، یا وقت ایسا کہے۔';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='ایک پیٹرن شامل کریں';
$ec_lang['lpn_library_pattern_values']='مضاعف';
$ec_lang['lpn_library_pattern_values_tip']='مضاعف، خالی جگہوں یا کوماز سے الگ کیے گئے۔ اگر آپ کے پاس سپریڈ شیٹ کا کالم ہے تو اسے پیسٹ کریں۔ یہ فہرست جتنی دیر رن جاری رہے دہراتی رہتی ہے، اس لیے اسے پورے رن کا احاطہ کرنے کی ضرورت نہیں۔';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} مضاعف، {step} کے فاصلے پر، {span} کا احاطہ کرتے ہوئے';
$ec_lang['lpn_library_pattern_none']='کوئی پیٹرن نہیں';
$ec_lang['lpn_settings_default_pattern']='پہلے سے مقررہ طلب پیٹرن';
$ec_lang['lpn_settings_default_pattern_tip']='ہر جنکشن جس کا کوئی پیٹرن نہ ہو یہی استعمال کرتا ہے۔';
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
$ec_lang['lpn_library_rules_tip']='قاعدہ ایک مختصر پیراگراف ہے جو کسی لنک کو کھولتا یا بند کرتا ہے، یا اسے کوئی ترتیب دیتا ہے، جب پانی کی سطح، دباؤ، بہاؤ یا وقت آپ کی مقرر کردہ قدر تک پہنچے۔ قواعد ایک ساتھ ایک سے زیادہ چیزیں جانچ سکتے ہیں، اور یہ بتا سکتے ہیں کہ جانچ ناکام ہونے پر کیا کرنا ہے۔';
$ec_lang['lpn_library_rule_add']='ایک قاعدہ شامل کریں';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='ایک قاعدہ، بالکل انہی الفاظ میں جو EPANET استعمال کرتا ہے، فی سطر ایک شق۔ پہلی سطر اسے نام دیتی ہے: RULE 1۔ پھر ایک شرط: IF TANK 2 LEVEL BELOW 17.1۔ پھر اس کے بارے میں کیا کرنا ہے: THEN PUMP 9 STATUS IS OPEN۔ آخری سطر اسے درجہ دے سکتی ہے: PRIORITY 1۔ ایک سے زیادہ چیزیں جانچنے کے لیے AND یا OR سطریں شامل کریں، اور جانچ ناکام ہونے پر کیا کرنا ہے بتانے کے لیے ELSE سطریں۔ ایک شرط نوڈ پر LEVEL، HEAD، GRADE، PRESSURE یا DEMAND، لنک پر FLOW، STATUS یا SETTING، یا SYSTEM پر TIME اور CLOCKTIME پڑھ سکتی ہے۔ عدد اسی یونٹ میں لکھیں جو یہ پراجیکٹ دکھا رہا ہے؛ وہ آپ کے لیے تبدیل کر دیے جاتے ہیں۔ کلیدی الفاظ انگریزی میں ہی رہنے دیں؛ یہی وہ ہیں جو صفحہ اور EPANET پڑھتے ہیں۔';
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
$ec_lang['lpn_result_demand_tip']='دکھائے گئے وقتی مرحلے پر یہ نوڈ جو بہاؤ کھینچتا ہے: ہر بنیادی طلب کو اس کے اپنے پیٹرن سے ضرب دے کر، سب کو جمع کر کے۔ یہ حساب سے نکالا جاتا ہے، لکھا نہیں جاتا، اس لیے یہ گھڑی کے ساتھ بدلتا ہے اور اسے ترمیم نہیں کیا جا سکتا۔';
$ec_lang['lpn_field_demand_pattern']='طلب پیٹرن';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='تفصیل';
$ec_lang['lpn_demand_add']='طلب کا زمرہ شامل کریں';
$ec_lang['lpn_demand_remove']='یہ طلب ہٹائیں';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='ہیڈ پیٹرن';
$ec_lang['lpn_field_head_pattern_tip']='رن کے دوران اس ریزروائر کی پانی کی سطح کیسے بلند اور پست ہوتی ہے۔ اوپر دیا گیا ہیڈ پیٹرن سے ضرب دیا جاتا ہے۔';
$ec_lang['lpn_field_pump_speed']='نسبتی رفتار';
$ec_lang['lpn_field_pump_speed_tip']='1 کا مطلب ہے کہ یہ پمپ اسی رفتار پر چل رہا ہے جس پر اس کا وکر ناپا گیا تھا۔ 0.9 کا مطلب ہے کہ وہی پمپ آہستہ چل رہا ہے، جس سے اس کا شامل کردہ ہیڈ اور گزرنے والا بہاؤ کم ہو جاتا ہے۔ رن جاری رہنے کے دوران ایک رفتار پیٹرن اس عدد کی جگہ لے لیتا ہے۔';
$ec_lang['lpn_field_speed_pattern']='رفتار پیٹرن';
$ec_lang['lpn_field_speed_pattern_tip']='رن کے دوران اس پمپ کی رفتار کیسے بلند اور پست ہوتی ہے۔ ہر مضاعف رن کے اس حصے کے لیے نسبتی رفتار ہے، اور یہ رفتار کی ترتیب کو بڑھانے کے بجائے اس کی جگہ لے لیتا ہے، اس لیے 0 کا مضاعف پمپ کو روک دیتا ہے۔';

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
$ec_lang['lpn_search_tip']='کسی شہر، پتے، یا نشانی کو نام سے ڈھونڈیں اور نقشے کو وہاں لے جائیں۔ پہلے استعمال پر آپ سے اجازت مانگی جاتی ہے، کیونکہ آپ جو الفاظ ٹائپ کرتے ہیں وہ OpenStreetMap کی جگہ کے نام کی سروس کو جاتے ہیں۔';
$ec_lang['lpn_search_bar']='نام سے تلاش کریں…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='نام سے جگہ تلاش کرنا آپ کے ٹائپ کیے گئے الفاظ nominatim.openstreetmap.org کو بھیجتا ہے، جو OpenStreetMap Foundation کی مفت جگہ کے نام کی سروس ہے۔';
$ec_lang['lpn_search_consent_2']='یہ آپ کے پراجیکٹ کے پیچھے موجود سڑکوں کے نقشے کی تصاویر سے الگ سروس ہے۔ تصاویر صرف یہ بتاتی ہیں کہ آپ کہاں دیکھ رہے ہیں۔ تلاش یہ بتاتی ہے کہ آپ نے کیا ٹائپ کیا۔ جگہ کے نام کی سروس کو آپ کے تلاش کے الفاظ اور آپ کا IP پتہ موصول ہوں گے۔ ہم اس کے علاوہ کچھ نہیں بھیجتے، اور آپ کی تلاشوں کا کوئی ریکارڈ نہیں رکھتے۔';
$ec_lang['lpn_search_consent_3']='کیا ہم آپ کی تلاشیں جگہ کے نام کی سروس کو بھیج سکتے ہیں؟';
$ec_lang['lpn_search_consent_4']='اگر آپ انکار کرتے ہیں، تو اس صفحے کی باقی ہر چیز بالکل ویسے ہی کام کرتی رہتی ہے جیسے اب کرتی ہے، بشمول ایک عرض بلد اور طول بلد پر جائیں۔ ہم "ہاں" یاد رکھتے ہیں تاکہ دوبارہ پوچھنے کی ضرورت نہ پڑے۔ "نہیں" بالکل بھی محفوظ نہیں کی جاتی۔';
$ec_lang['lpn_search_refused']='جگہ کے نام کی تلاش بند ہے، اور کچھ نہیں بھیجا گیا۔ آپ اب بھی ایک عرض بلد اور طول بلد پر جائیں استعمال کر سکتے ہیں۔';
$ec_lang['lpn_search_prompt']='کسی جگہ کو نام سے تلاش کریں۔ کوئی شہر، سڑک، یا نشانی — مثال کے طور پر: Petaluma, California';
$ec_lang['lpn_search_empty']='تلاش کرنے کے لیے جگہ کا نام ٹائپ کریں۔';
$ec_lang['lpn_search_working']='تلاش جاری ہے…';
$ec_lang['lpn_search_busy']='ایک تلاش پہلے سے جاری ہے۔ اس کے جواب کا انتظار کریں۔';
$ec_lang['lpn_search_choose']='ایک سے زیادہ جگہیں میل کھاتی ہیں۔ کون سی؟';
$ec_lang['lpn_search_nochoice']='کچھ نہیں چنا گیا، اس لیے نقشہ منتقل نہیں ہوا۔';
$ec_lang['lpn_search_badchoice']='یہ فہرست میں موجود اعداد میں سے ایک نہیں ہے۔';
$ec_lang['lpn_search_none']='اس نام کے لیے کچھ نہیں ملا۔';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='جگہ کے نام کی سروس ہمیں سست ہونے کو کہہ رہی ہے۔ ایک منٹ انتظار کریں اور دوبارہ کوشش کریں۔';
$ec_lang['lpn_search_http']='جگہ کے نام کی سروس نے ایک خرابی کے ساتھ جواب دیا۔';
$ec_lang['lpn_search_timeout']='جگہ کے نام کی سروس نے وقت پر جواب نہیں دیا۔ اس صفحے کی باقی ہر چیز اس کے بغیر کام کرتی ہے۔';
$ec_lang['lpn_search_unreadable']='جگہ کے نام کی سروس نے ایسی چیز کے ساتھ جواب دیا جو یہ صفحہ پڑھ نہیں سکا۔';
$ec_lang['lpn_search_offline']='ہم جگہ کے نام کی سروس تک نہیں پہنچ سکے۔ ہو سکتا ہے آپ آف لائن ہوں۔ اس صفحے کی باقی ہر چیز اس کے بغیر کام کرتی ہے، بشمول ایک عرض بلد اور طول بلد پر جائیں۔';
$ec_lang['lpn_search_toofast']='ایک سیکنڈ میں ایک تلاش — جگہ کے نام کی سروس اسی کی اجازت دیتی ہے۔ تھوڑی دیر میں دوبارہ کوشش کریں۔';
$ec_lang['lpn_search_nofetch']='یہ براؤزر جگہ کے نام کی سروس تک نہیں پہنچ سکتا۔';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox اسے بہت سے عوامی بلندی کے ڈیٹا سیٹس سے جوڑتا ہے، اس لیے یہ کتنا اچھا ہے یہ مکمل طور پر اس بات پر منحصر ہے کہ آپ کہاں ہیں۔ جہاں کوئی قومی lidar سروے موجود ہو، جیسے زیادہ تر امریکہ میں USGS 3DEP اور دیگر جگہوں پر اس کے مساوی، وہاں یہ افقی طور پر ایک میٹر سے بہتر اور عمودی طور پر چند دسویں میٹر تک درست ہو سکتا ہے۔ جہاں صرف عالمی ڈیٹا موجود ہو وہاں یہ افقی طور پر تقریباً 30 میٹر اور عمودی طور پر کئی میٹر ہے۔ Mapbox ہمیں نہیں بتاتا کہ آپ کو کون سا ملا۔ اسے سروے نہیں بلکہ کنٹور نقشہ سمجھیں: جس چیز پر آپ انحصار کریں اسے جانچ لیں۔';
$ec_lang['lpn_terrain_consent_1']='بلندیاں بھرنے سے ہر اس نوڈ کی جگہ — اس کا عرض بلد اور طول بلد — api.mapbox.com کو بھیجی جاتی ہے جسے بلندی کی ضرورت ہے، تاکہ وہاں کی زمین کی اونچائی معلوم کی جا سکے۔';
$ec_lang['lpn_terrain_consent_2']='یہ آپ کے پراجیکٹ کے پیچھے موجود نقشے کی تصاویر سے الگ معاملہ ہے۔ تصاویر صرف یہ بتاتی ہیں کہ آپ کہاں دیکھ رہے ہیں۔ یہ جگہیں خود آپ کا نیٹ ورک ہیں۔ Mapbox کو وہ احداثیات اور آپ کا IP پتہ موصول ہوں گے۔ ہم اس کے علاوہ کچھ نہیں بھیجتے: نہ نام، نہ پائپ، نہ پراجیکٹ۔ ہم اس کا کوئی ریکارڈ نہیں رکھتے، اور اس سوال کے آپ کے جواب کے سوا اس آلے پر کچھ محفوظ نہیں کیا جاتا۔';
$ec_lang['lpn_terrain_consent_3']='کیا ہم آپ کے نوڈز کی جگہیں Mapbox کو بھیج سکتے ہیں؟';
$ec_lang['lpn_terrain_consent_4']='اگر آپ انکار کرتے ہیں، تو اس صفحے کی باقی ہر چیز بالکل ویسے ہی کام کرتی رہتی ہے جیسے اب کرتی ہے، اور آپ پہلے کی طرح بلندیاں خود ٹائپ کر سکتے ہیں۔ ہم "ہاں" یاد رکھتے ہیں تاکہ دوبارہ پوچھنے کی ضرورت نہ پڑے۔ "نہیں" بالکل بھی محفوظ نہیں کی جاتی۔';
$ec_lang['lpn_terrain_refused']='بلندیاں نہیں بھری گئیں، اور کچھ نہیں بھیجا گیا۔ آپ انہیں پہلے کی طرح ٹائپ کر سکتے ہیں۔';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='کیا {n} نوڈ(ز) کی بلندی Mapbox DEM سے بھری جائے؟';
$ec_lang['lpn_terrain_confirm_default_1']='ہر نوڈ کی پہلے سے بلندی ہے، اور ان میں سے {n} ابھی تک {v} پر ہیں، جو وہ بلندی ہے جس سے ایک نیا نوڈ شروع ہوتا ہے، نہ کہ وہ جو آپ نے ٹائپ کی ہو۔';
$ec_lang['lpn_terrain_confirm_default_2']='کیا ان {n} نوڈز کی بلندی کو Mapbox DEM کی قدروں سے بدل دیا جائے؟';
$ec_lang['lpn_terrain_keep']='{k} نوڈ(ز) کی پہلے سے بلندی ہے اور انہیں چھیڑا نہیں جائے گا۔';
$ec_lang['lpn_terrain_undo']='ایک کالعدم (Ctrl-Z) ان سب کو واپس لے آتا ہے۔';
$ec_lang['lpn_terrain_requests']='{n} api.mapbox.com کو درخواست(یں)۔';
$ec_lang['lpn_terrain_busy']='بلندیاں پہلے سے بھری جا رہی ہیں۔ ان کا انتظار کریں۔';
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
$ec_lang['lpn_terrain_rate_limited']='خطہ کی سروس ہم سے سست ہونے کو کہہ رہی ہے (429)، اس لیے کوئی بلندی تبدیل نہیں کی گئی۔ ایک منٹ میں دوبارہ کوشش کریں۔';
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
$ec_lang['lpn_ff_menu']='فائر فلو تجزیہ…';
$ec_lang['lpn_ff_menu_tip']='جنکشنز کو ایک ایک کر کے آزمائیں: آپ کے مقرر کردہ بقایا دباؤ کو برقرار رکھتے ہوئے ہر ایک کتنا پانی دے سکتا ہے، اور کیا وہاں درکار بہاؤ کھینچنے سے کچھ اور حد سے باہر چلا جاتا ہے؟';
$ec_lang['lpn_ff_title']='فائر فلو تجزیہ';
$ec_lang['lpn_ff_intro']='ہر جنکشن کو باری باری اپنی موجودہ طلب پر فائر فلو کھینچنے کو کہا جاتا ہے۔ آپ کے پراجیکٹ میں کچھ تبدیل نہیں ہوتا؛ پورا رن ایک نقل پر کیا جاتا ہے۔';
$ec_lang['lpn_ff_scope']='آزمانے کے لیے جنکشنز';
$ec_lang['lpn_ff_all']='سب';
$ec_lang['lpn_ff_selected']='منتخب';
$ec_lang['lpn_ff_no_junctions']='اس پراجیکٹ میں ابھی تک کوئی جنکشن نہیں، اس لیے آزمانے کو کچھ نہیں۔';
$ec_lang['lpn_ff_no_selection']='کوئی جنکشن منتخب نہیں۔ جنکشن منتخب کریں یا تمام جنکشن چنیں۔';
$ec_lang['lpn_ff_skipped']='{n} منتخب عناصر جنکشن نہیں، اس لیے انہیں آزمایا نہیں گیا۔';
$ec_lang['lpn_ff_required']='درکار فائر فلو';
$ec_lang['lpn_ff_required_tip']='وہ بہاؤ جو آپ کا فائر کوڈ یا فائر اتھارٹی ہائیڈرینٹ پر مانگتی ہے۔ ہر جنکشن اسی عدد کے مقابلے میں آزمایا جاتا ہے جب تک کہ اس کے پاس اپنا درکار فائر فلو نہ ہو۔';
$ec_lang['lpn_ff_required_node_tip']='اس مخصوص جنکشن پر، جس زمین کے استعمال کی یہ خدمت کرتا ہے، آپ کے فائر کوڈ یا فائر اتھارٹی کے مطابق درکار فائر فلو۔ اسے خالی چھوڑیں تو جنکشن کو فائر فلو تجزیہ خانے میں دیے گئے عدد کے مقابلے میں آزمایا جائے گا۔';
$ec_lang['lpn_ff_residual']='برقرار رکھنے کے لیے بقایا دباؤ';
$ec_lang['lpn_ff_residual_tip']='فائر فلو دیتے ہوئے جنکشن کو جو دباؤ برقرار رکھنا چاہیے۔ AWWA M31 اور NFPA 291 میں 20 psi (140 kPa) استعمال ہوتا ہے۔';
$ec_lang['lpn_ff_design']='ڈیزائن جانچ (نظام پر اثر)';
$ec_lang['lpn_ff_design_tip']='یہ ایک الگ سوال ہے کہ آیا جنکشن یہ بہاؤ دے سکتا ہے: کیا وہاں یہ بہاؤ کھینچنے پر کچھ اور اپنی کم از کم دباؤ سے نیچے گر جاتا ہے یا اپنی رفتار کی حد سے تجاوز کرتا ہے؟ اسے جانچنے کا انتخاب کوئی اضافی حساب نہیں مانگتا۔';
$ec_lang['lpn_ff_design_no_selection']='ڈیزائن جانچ منتخب پر مقرر ہے، اور کوئی عنصر منتخب نہیں۔ عناصر منتخب کریں یا «سب» کا اختیار چنیں۔';
$ec_lang['lpn_ff_minpressure']='دوسری جگہ اجازت شدہ کم ترین دباؤ';
$ec_lang['lpn_ff_minpressure_tip']='جو جنکشن اس سے نیچے گر جائے جب کوئی دوسرا اپنا فائر فلو کھینچ رہا ہو، اسے ڈیزائن مسئلے کے طور پر رپورٹ کیا جاتا ہے۔';
$ec_lang['lpn_ff_maxvelocity']='اجازت شدہ زیادہ سے زیادہ رفتار';
$ec_lang['lpn_ff_maxvelocity_tip']='جو پائپ فائر فلو کھینچے جانے کے دوران اس سے اوپر چلے، اسے ڈیزائن مسئلے کے طور پر رپورٹ کیا جاتا ہے۔';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='فائر فلو خود جنکشن پر کھینچا جاتا ہے۔ یہاں یہی طریقہ استعمال ہوتا ہے، اور یہی معمول کا طریقہ ہے۔ ہائیڈرینٹ، اس کی لیٹرل پائپ اور اس کا نوزل ماڈل نہیں کیے جاتے، اس لیے حقیقی ہائیڈرینٹ یہاں دکھائے گئے بہاؤ سے کم دیتا ہے۔';
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
$ec_lang['lpn_ff_summary']='{clean} جنکشنز میں کچھ غلط نہیں تھا۔ {fire} جنکشنز فائر فلو میں ناکام رہے۔ {design} جنکشنز نے باقی نظام کو متاثر کیا۔';
$ec_lang['lpn_ff_summary_error']='{n} جنکشنز کا جواب نہیں دیا جا سکا۔';
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
$ec_lang['lpn_ff_design_none']='چنے گئے مجموعے میں کچھ بھی اپنی حد سے باہر نہیں گیا جب کہ کوئی جنکشن اپنا فائر فلو کھینچ رہا تھا۔';
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
$ec_lang['lpn_ff_iso']='انشورنس سروسز آفس (ISO) ایک ہائیڈرینٹ کو زیادہ سے زیادہ {flow} کا کریڈٹ دیتا ہے۔ یہ کریڈٹ حد یہاں لاگو نہیں کی گئی کیونکہ ہمیں معلوم نہیں کہ ایک نوڈ کتنے ہائیڈرینٹس کی نمائندگی کر سکتا ہے۔';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='کوئی فائر فلو کھینچے جانے سے پہلے ہی بقایا دباؤ سے نیچے';
$ec_lang['lpn_ff_err_converge']='نیٹ ورک ہم آہنگ نہیں ہوا۔';
$ec_lang['lpn_ff_err_solve']='حل کار نے خرابی رپورٹ کی اور کوئی جواب نہیں دیا۔';
$ec_lang['lpn_ff_err_not_junction']='جنکشن نہیں ہے';
$ec_lang['lpn_ff_err_unknown']='کوئی جواب نہیں۔ رپورٹ کیا گیا کوڈ {code} تھا۔';

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
$ec_lang['lpn_file_import_survey_tip']='ایک ٹیکسٹ فائل سے سروے شدہ پوائنٹس کی فہرست پڑھیں اور ہر پوائنٹ پر ایک جنکشن بنائیں، ہر اس چیز کے لیے نئے اثاثے کی ترتیبات لیتے ہوئے جو فائل بیان نہیں کرتی۔ کوئی پائپ نہیں کھینچا جاتا، اور کوئی قطار کبھی نام دیے بغیر نہیں چھوڑی جاتی۔ یہ اسی احداثی نظام کو پڑھتی ہے جو یہ پراجیکٹ پہلے سے استعمال کرتا ہے، چاہے جغرافیائی حوالہ شدہ ہو یا نہ ہو۔';
$ec_lang['lpn_survey_read_error']='وہ فائل آپ کی ڈسک سے پڑھی نہیں جا سکی۔';
$ec_lang['lpn_survey_cancelled']='کچھ نہیں بنایا گیا اور کچھ نہیں بدلا گیا۔';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='نارتھنگ';
$ec_lang['lpn_survey_axis_east']='ایسٹنگ';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='اس فائل میں کچھ نہیں ہے۔';
$ec_lang['lpn_survey_err_unreadable']='وہ فائل سروے شدہ پوائنٹس کی فہرست کے طور پر نہیں پڑھی جا سکی۔';
$ec_lang['lpn_survey_err_ambiguous_coord']='اس فائل کے ایک سے زیادہ کالم {axis} ({detail}) ہو سکتے ہیں، اور یہ صفحہ ان کے درمیان انتخاب نہیں کرے گا۔ ان میں سے ایک کو {axis} کے نام سے چھوڑیں اور دوبارہ کوشش کریں۔';
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
$ec_lang['lpn_survey_report_clean']='فائل کا ہر پوائنٹ آ گیا، اور راستے میں کچھ تبدیل نہیں کیا گیا۔';
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
$ec_lang['lpn_hotkeys_menu_heading']='مینو';
$ec_lang['lpn_hotkeys_menu_term']='مینو کے کیبورڈ شارٹ کٹس';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+حرف</td><td>اس حرف والا مینو کھولیں، پھر کسی قطار کا حرف دبا کر اسے چنیں۔ کیبورڈ استعمال کرتے وقت حروف دکھائی دیتے ہیں۔ Mac پر Ctrl+Option استعمال کریں۔</td></tr><tr><td>F10</td><td>مینو بار پر جائیں۔</td></tr></tbody></table>';
$ec_lang['lpn_graphs_menu']='گراف';
$ec_lang['lpn_contour_menu']='کنٹور';
$ec_lang['lpn_contour_tip']='نقشے پر کنٹور پلاٹ دکھائیں: نوڈ کے رنگ پائپوں کے ساتھ اور ان کے اطراف میں پھیلتے ہیں، اور کنٹور لائنوں پر لیبل ہوتے ہیں۔ اسے ٹھیک کرنے یا بند کرنے کے لیے ایک باکس کھلتا ہے۔';
$ec_lang['lpn_contour_plot']='کنٹور پلاٹ';
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
$ec_lang['lpn_sysflow_menu']='بہاؤ کا توازن';
$ec_lang['lpn_sysflow_tip']='توسیعی دورانیے کی سمولیشن کے دوران پیدا کیے گئے کل بہاؤ اور استعمال کیے گئے کل بہاؤ کا وقت کے مقابلے میں گراف بنائیں۔ ٹینک کسی بھی کل میں شامل نہیں، اس لیے جہاں دونوں لکیریں الگ ہوں وہاں ٹینک بھر رہے ہیں یا خالی ہو رہے ہیں۔';
$ec_lang['lpn_sysflow_produced']='پیدا شدہ';
$ec_lang['lpn_sysflow_produced_tip']='ریزروائرز سے اور منفی طلبوں سے نیٹ ورک میں آنے والا کل بہاؤ۔';
$ec_lang['lpn_sysflow_consumed']='استعمال شدہ';
$ec_lang['lpn_sysflow_consumed_tip']='ہر مثبت طلب کا مجموعہ: جنکشنز پر نیٹ ورک سے نکالا گیا پانی، اور ریزروائر میں جانے والا کوئی بھی بہاؤ۔';
$ec_lang['lpn_copy_title']='فائل کو نئی کاپی کے طور پر نشان زد کریں؟';
$ec_lang['lpn_copy_body']='یہ فائل کہتی ہے کہ یہ {date} کو بنائی گئی تھی، اور یہ براؤزر اسے پہچانتا نہیں۔ کیا یہ اصل فائل ہے (وہی لاک رکھیں) یا کاپی (نیا لاک بنائیں)؟';
$ec_lang['lpn_copy_body_nodate']='یہ براؤزر اس فائل کو پہچانتا نہیں۔ کیا یہ اصل فائل ہے (وہی لاک رکھیں) یا کاپی (نیا لاک بنائیں)؟';
$ec_lang['lpn_copy_original']='اصل؛ وہی لاک رکھیں';
$ec_lang['lpn_copy_copy']='کاپی؛ نیا لاک بنائیں';
$ec_lang['lpn_copy_kept_link']='{name} کو اصل کے طور پر کھولا گیا، جو نئی جگہ منتقل ہو چکی ہے۔ محفوظ کریں اب اسی فائل میں لکھتا ہے۔';
$ec_lang['lpn_copy_opened']='{file} کو کاپی کے طور پر کھولا گیا، اس کے اپنے نئے لاک کے ساتھ جو اگلی بار فائل محفوظ کرنے پر محفوظ ہو گا۔';
$ec_lang['lpn_scenario_basic']='بنیادی موڈ';
$ec_lang['lpn_scenario_basic_tip']='نشان لگا ہو تو منظرنامہ محض وہ قدریں ہے جو آپ نے اس میں مقرر کیں۔ نشان نہ ہو تو یہ مینو متبادلات کا پیش منظر جدول بھی پیش کرتا ہے، جو دکھاتا ہے کہ وہ قدریں زمرے کے لحاظ سے کیسے گروپ ہیں، اور آپ کی رائے کی دعوت دیتا ہے۔';
$ec_lang['lpn_alt_title']='متبادلات کا پیش منظر';
$ec_lang['lpn_alt_note']='صرف پڑھنے کے لیے۔ بنیاد ہر زمرے کا بنیادی متبادل استعمال کرتی ہے۔ ہر منظرنامے کو ہر اس زمرے کا اپنا متبادل ملتا ہے جو تبدیل ہوا ہو، جو بنیادی متبادل کی ذیلی شاخ ہے۔ عدد بتاتا ہے کہ اس میں کتنی تبدیل شدہ قدریں ہیں۔';
$ec_lang['lpn_alt_cat_physical']='طبعی';
$ec_lang['lpn_alt_cat_demand']='طلب';
$ec_lang['lpn_alt_cat_topology']='اثاثوں کی فعالیت';
$ec_lang['lpn_alt_cat_initial']='ابتدائی ترتیبات';
$ec_lang['lpn_alt_cat_constituent']='جزو';
$ec_lang['lpn_alt_cat_fireflow']='فائر فلو';
$ec_lang['lpn_alt_cat_energy']='توانائی کی لاگت';
$ec_lang['lpn_alt_cat_userdata']='حسب ضرورت خصوصیات';
$ec_lang['lpn_alt_cat_text']='متن';
$ec_lang['lpn_reports_calib']='کیلیبریشن';
$ec_lang['lpn_reports_calib_tip']='کیلیبریشن فائل میں ناپے گئے میدانی ڈیٹا کا آخری رن سے موازنہ کریں: اعداد و شمار، ایک ارتباطی پلاٹ، اور اوسطوں کا موازنہ۔';
$ec_lang['lpn_calib_title']='کیلیبریشن رپورٹ';
$ec_lang['lpn_calib_param']='پیرامیٹر';
$ec_lang['lpn_calib_param_tip']='وہ مقدار جسے کیلیبریشن فائل ناپتی ہے۔ ہر پیرامیٹر کے لیے ایک فائل رکھی جاتی ہے۔';
$ec_lang['lpn_calib_load']='کیلیبریشن فائل لوڈ کریں…';
$ec_lang['lpn_calib_load_tip']='ایک متنی فائل جس کی ہر سطر میں مقام کی ID، وقت، اور ناپی گئی قدر ہو۔ وقت سمولیشن کے آغاز سے اعشاری گھنٹوں یا گھنٹے:منٹ میں ناپا جاتا ہے۔ سیمی کولن سے تبصرہ شروع ہوتا ہے۔ جس سطر میں صرف وقت اور قدر ہو وہ اوپر والے مقام سے تعلق رکھتی ہے۔';
$ec_lang['lpn_calib_none']='اس پیرامیٹر کے لیے کوئی کیلیبریشن فائل لوڈ نہیں ہے۔';
$ec_lang['lpn_calib_session']='کیلیبریشن فائل صرف اسی سیشن کے لیے رکھی جاتی ہے۔ یہ پراجیکٹ کے ساتھ یا اس آلے پر محفوظ نہیں کی جاتی۔';
$ec_lang['lpn_calib_file']='{file}: {m} مقامات پر {n} پیمائشیں۔';
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
$ec_lang['lpn_analyze_menu']='تجزیہ';
$ec_lang['lpn_analyze_menu_tip']='وہ تجزیے جو نیٹ ورک کو ایک نقل پر چلاتے ہیں: ہر جنکشن پر فائر فلو، ہر پائپ، پمپ اور والو کا نقصان، اور اوپر یا نیچے پیمانہ کی گئی طلبیں۔';
$ec_lang['lpn_ff_design_off']='کوئی نہیں';
$ec_lang['lpn_ff_design_all']='سب';
$ec_lang['lpn_ff_design_selected']='منتخب';
$ec_lang['lpn_ff_rows_more_links']='نہ دکھائے گئے لنکس: {n}۔';
$ec_lang['lpn_crit_menu']='نازکی کا تجزیہ…';
$ec_lang['lpn_crit_menu_tip']='ہر پائپ، پمپ اور والو کو باری باری نیٹ ورک سے نکالیں اور دیکھیں کہ نظام کیا کھوتا ہے۔';
$ec_lang['lpn_crit_title']='نازکی کا تجزیہ';
$ec_lang['lpn_crit_intro']='ہر اثاثہ باری باری نیٹ ورک سے نکالا جاتا ہے، اور نیٹ ورک فعال منظرنامے میں اسکرین پر موجود وقتی مرحلے پر حل کیا جاتا ہے۔ آپ کے پراجیکٹ میں کچھ تبدیل نہیں ہوتا؛ پورا رن ایک نقل پر کیا جاتا ہے۔';
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
$ec_lang['lpn_crit_summary']='{total} میں سے {n} اثاثوں کے باعث طلب بلا سپلائی رہتی ہے یا کوئی جنکشن {pressure} سے نیچے گر جاتا ہے۔';
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
