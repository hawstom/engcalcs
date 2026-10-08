<?php

// All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='کسر';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/sec';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% میل';
$ec_lang['u_grade']='میل';
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
$ec_lang['menu_brand']='HawsEDC محاسبې';
$ec_lang['menu_main_hydraulics']='هایدرولیک';
$ec_lang['menu_help']='مرسته';
$ec_lang['menu_libre']='آزاد سافټویر';
$ec_lang['template_welcome']='خپل ویرونه دروازې ته پرېږده؛ دلته مینه زموږ ژبه ده. ته هر څه خرابوي نه یې. د <a target="_blank" href="https://hawsedc.com/download.php">وړیا HawsEDC AutoCAD وسیلو</a> خوند هم واخله.';
$ec_lang['template_feedback']='ایا تاسو کولی شئ د دې پاڼې د عبارتونو ښه کولو یا نورو شیانو لپاره وړاندیز راکړئ؟ ایا غواړئ مرسته وکړئ، یا داسې وسایل جوړول زده کړئ؟ مهرباني وکړئ ما سره اړیکه ونیسئ.';
$ec_lang['template_printable_title']='د چاپ سرلیک';
$ec_lang['template_printable_subtitle']='د چاپ فرعي سرلیک';
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
$ec_lang['consent_body']='ایا موږ کولی شو په دې براوزر کې د یو-رقمي کوکي وساتو ترڅو مو په یاد وي چې دا پاڼه مو دمخه شمېرلې ده؟ دا هیڅ شی ستاسو په اړه او هیڅ هغه شی چې تاسو یې لیکئ نه ثبتوي. پرته له دې موږ نشو کولی ستاسو دویمه کتنه د بل چا لومړۍ کتنې نه توپیر کړو.';
$ec_lang['consent_accept']='دا ومنئ';
$ec_lang['consent_accept_all']='تل يې ومنئ';
$ec_lang['consent_decline']='تل يې رد کړئ';
$ec_lang['consent_current_granted']='تاسو دا اجازه ورکړې ده. موږ د دې براوزر پروفایل لپاره ثبت محدودوو.';
$ec_lang['consent_current_denied']='تاسو دا رد کړې ده. موږ د ثبت محدودولو لپاره هیڅ نه ساتو.';
$ec_lang['consent_region_label']='ستاسو د ثبت محدودولو په اړه انتخاب.';
$ec_lang['consent_settings_link']='د کوکي تنظیمات';
$ec_lang['privacy_link']='د محرمیت خبرتیا';
$ec_lang['terms_link']='د کارونې شرایط';
$ec_lang['index_main_title']='وړیا آنلاین انجینري محاسبې';
$ec_lang['index_meta_desc_plain']='وړیا هایدرولیکي انجینري محاسبې د پایپونو، کانالونو، ویئرونو او آبیارۍ لپاره. دا ستاسو په براوزر کې چلیږي، پرته له انټرنېټ هم کار کوي، او په ۲۷ ژبو کې شتون لري.';
$ec_lang['calc_set_units']='واحدونه تنظیم کړئ:';
$ec_lang['calc_set_units_tip']='د هر ډګر (فیلډ) واحد یوځل ټاکي. غیر ورانوونکی: هغه شمېرې چې تاسو لیکلي وې په خپل حال پاتې کیږي، خو هره یوه یې اوس په نوي واحد کې لوستل کیږي. یو 6 لا هم 6 پاتې کیږي، خو اوس یې معنی 6 انچه ده، نه 6 ملي متره.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='ډيفالټ ارزښتونه بيرته راولئ';
$ec_lang['calc_defaults_confirm']='ایا محاسبه اصلي (لومړنیو) ډيفالټ ارزښتونو ته بیرته تنظیم شي؟';
$ec_lang['points_data_note']='(یا د معلوماتو ساحې له لارې کاپي/پیسټ وکړئ)';
$ec_lang['points_data_heading']='د محاسبې معلومات<br />(د بڼې لیدو لپاره کاپي وکاروئ)';
$ec_lang['points_data_copy']='کاپي';
$ec_lang['points_data_paste']='پیسټ';
$ec_lang['calc_inputs']='ننوتنې';
$ec_lang['calc_results']='پایلې';
$ec_lang['view_hide_line']='دا کرښه پټه کړئ';
$ec_lang['view_printable']='د چاپ وړ نسخه (د بیا ترلاسه کولو لپاره بیا پورته کړئ)';
$ec_lang['ec_name_label']='دا محاسبه خوندي کړئ:';
$ec_lang['ec_name_placeholder']='نوم';
$ec_lang['ec_name_tip']='دا ننوتنې URL ته خوندي کوي د نشان کتاب، تاریخ بیر کیدو، او شریکولو لپاره';
$ec_lang['calc_copy_link']='لینک کاپي کړئ';
$ec_lang['ec_related_calcs']='اړوند محاسبې:';
$ec_lang['calc_copy_link_done']='کاپي شو!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Darcy-Weisbach د پایپ سر ضیاع';
$ec_lang['dw_main_title']='وړیا آنلاین Darcy-Weisbach د پایپ سر ضیاع محاسبه';
$ec_lang['dw_main_desc']='Darcy-Weisbach د پایپ سر ضیاع د ورکړل شوي قطر، خشونت، او بهاو سره';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='د پایپ دیوال مطلق خشونت لوړوالی، e. عادي ارزښتونه: فولاد (نوی) 0.046 mm، فولاد (کارول شوی) 0.15 mm، HDPE 0.003 mm، PVC/uPVC 0.0015 mm، کانکریټ 0.3–3 mm.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="د پاکو اوبو لپاره 1×10⁻⁶ m²/s په 20°C کې">د حرکتي ویسکوزیته، ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='د حرکتي ویسکوزیته، ν';
$ec_lang['dw_kinematic_viscosity_tip']='د پاکو اوبو لپاره 1×10⁻⁶ m²/s په 20°C کې';
$ec_lang['dw_reynolds_number']='د Reynolds عدد، Re';
$ec_lang['dw_flow_regime']='د بهاو رژیم';
$ec_lang['dw_regime_laminar']='لامینار';
$ec_lang['dw_regime_transitional']='انتقالي';
$ec_lang['dw_regime_turbulent']='توربولنت';
$ec_lang['dw_friction_factor_method']='د اصطکاک فاکتور میتود';
$ec_lang['dw_friction_factor']='د اصطکاک فاکتور، f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Hazen-Williams د پایپ سر ضیاع';
$ec_lang['hw_main_title']='وړیا آنلاین Hazen-Williams د پایپ سر ضیاع محاسبه';
$ec_lang['hw_main_desc']='Hazen-Williams د پایپ سر ضیاع د ورکړل شوي قطر، خشونت، او بهاو سره';
$ec_lang['hw_hgl_1']='ښکته HGL';
$ec_lang['hw_hgl_2']='پورته HGL';
$ec_lang['hw_elev_up']='پورتنی لوړوالی';
$ec_lang['hw_pressure_up']='پورتنی فشار';
$ec_lang['hw_elev_down']='ښکتنی لوړوالی';
$ec_lang['hw_pressure_down']='ښکتنی فشار';
$ec_lang['hw_pressure_check']='د فشار کتنه';
$ec_lang['hw_pressure_ok_short']='مثبت فشار';
$ec_lang['hw_pressure_neg_short']='منفي فشار';
$ec_lang['hw_pressure_neg']='ښکتنی فشار له صفر څخه ښکته دی. د HGL کرښه د پایپ نه ښکته راځي، نو پایپ به په بشپړ ډول ډک نه بهیږي، او دا پایله ممکن سمه نه وي.';
$ec_lang['hw_roughness']='Hazen-Williams ضریب، C';
$ec_lang['hw_note_1']='<dl><dt>دا محاسبه د دواړو څنډو ترمنځ د پایپ پروفایل نه ماډل کوي.</dt><dd>دا یوازې هغه پورتنی او ښکتنی لوړوالی کاروي چې تاسو یې لیکئ. که ځمکه د دواړو څنډو ترمنځ په کوم ځای کې د هرې څنډې نه لوړه شي، په هغه لوړ ټکي کې فشار له هر دلته راپور شوي فشار نه ټیټ دی. دا کتلو لپاره، محاسبه د پورتني سر نه تر لوړ ټکي پورې اوږدوالي لپاره بیا پرمخ بوځئ.</dd><dd>چېرې چې د HGL کرښه د پایپ نه ښکته راځي، اوبه د منفي فشار لاندې دي. هوا له محلول نه وځي، نری‌دیواله پایپ کولی شي ړنګ شي، او ککړ تحت‌الارضي اوبه کولی شي د پیوستون ځایونو له لارې دننه راکاږل شي. کرښه هر ځای کې د مثبت فشار لاندې وساتئ، او په هر لوړ ټکي کې د هوا سوپاپ ته پام وکړئ.</dd><dt>پورتنی فشار هغه د پولې شرط دی چې تاسو یې ورکوئ.</dt><dd>دا له ګیج نه، د ټانکي د اوبو کچې نه (د پایپ نه پورته د اوبو لوړوالی)، یا د پمپ منحني نه ولولئ. پمپ لکه څنګه چې بهاو زیاتیږي کم فشار ورکوي، نو هغه ټکی وکاروئ چې د پورته لیکل شوي بهاو سره سمون خوري.</dd><dt>ځایي (سیمه‌ییز) ضیاع ضریبونه پخپله جمع کړئ.</dt><dd>د کرښې د هر سوپاپ، ګونۍ، ټي، متر، او ننوتنځای لپاره د K ارزښتونه ټول کړئ، او هغه ټول ولیکئ. د معمولو ارزښتونو لپاره په دې ننوت کې لینک تعقیب کړئ. په اوږده لېږد اصلي کرښه کې دا ضیاعات د اصطکاک په پرتله کوچني دي، خو په لنډه د سټیشن پایپ کارۍ کې دا کولی شي د ډیرې ضیاع برخه وي.</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='Manning د غیریکسانې مقطع چینل';
$ec_lang['mi_main_title']='وړیا آنلاین Manning د غیریکسانې مقطع چینل محاسبه';
$ec_lang['mi_main_desc']='د غیریکسانې مقطع چینل Manning یکسان بهاو محاسبه';
$ec_lang['mi_waterSurfaceElevation']='د اوبو سطحې لوړوالی';
$ec_lang['mi_q_617']='<span class="ec-help" title="مرکب بهاو، Q، چې د Chow 6-17 له مخې د هرې سیمې لپاره د مرکب n او مساوي سرعتونو په کارولو سره ټاکل کیږي">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='د مقطع نقطې';
$ec_lang['mi_groupPoint']='نقطه';
$ec_lang['mi_groupSegment']='برخه';
$ec_lang['mi_groupRegion']='سیمه';
$ec_lang['mi_station']='واټن';
$ec_lang['mi_elevation']='لوړوالی';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />د سیمې<br />حد<br />(غاړه)';
$ec_lang['mi_tau']='لاندینۍ<br />برش<br />τ';
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
$ec_lang['mi_notes_1_def']='دا محاسبه د HEC-RAS د حوالې لارښود پیروي کوي چې د Chow 1959، مخ 136، معادله 6-17 (نه 6-18) کارولو سره د سیمې مرکب n حساب کوي.';


$ec_lang['mi_notes_2_term']='د کاڼو پوښ';
$ec_lang['mi_notes_2_def']='د کاڼو پوښ ډیزاین کولو لپاره د Manning ذوزنقه چینل محاسبه وکاروئ. دا محاسبه د طبیعي مقطعونو لپاره ډیره مناسبه ده.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Manning د پایپ بهاو';
$ec_lang['mpf_main_title']='وړیا آنلاین Manning د پایپ بهاو محاسبه';
$ec_lang['mpf_main_desc']='د Manning فارمول یکسان د پایپ بهاو د ورکړل شوي میل او ژوروالي سره';
$ec_lang['mpf_pipe_diameter']='د پایپ قطر، d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='د Manning خشونت، n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">د اصطکاک میل، S<sub>f</sub></a><span class="ec-help" title="کله ناکله د پایپ میل سره مساوي. د توضیح لپاره لینک تعقیب کړئ (یوازې په انګلیسي)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='د بهاو نسبي ژوروالی، y/d<sub>0</sub>';
$ec_lang['mpf_flow']='بهاو، Q';
$ec_lang['mpf_flow_tip']='بهاو او ژوروالی د بې پایه اوږد پایپ لپاره محاسبه شوي دي. دا بهاو پایپ ته د ننوتلو لپاره ممکن د پورتنیو اوبو ډیر ژوروالی ته اړتیا وي. د تفصیلاتو او زده‌کړیز ویډیو لپاره لاندې یادښتونه وګورئ.';
$ec_lang['mpf_velocity']='سرعت، v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="حرکي انرژي د اوبو د ستن په بڼه، v²/2g">د سرعت سر، h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='د بهاو مساحت، A';
$ec_lang['mpf_pipe_area']='د پایپ مساحت، A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='نسبي مساحت، A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='د لندوالي محیط، P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='هایدرولیکي شعاع، R<sub>h</sub>';
$ec_lang['mpf_top_width']='پورتني پلنوالی، T';
$ec_lang['mpf_froude_number']='د Froude عدد، Fr';
$ec_lang['mpf_shear_stress']='منځنی برشي فشار، τ';
$ec_lang['mpf_full_flow']='بشپړ بهاو، Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='د بشپړ بهاو نسبت، Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>دا د یوه <em>بې نهایته اوږد</em> پایپ دننه بهاو او ژوروالی دی.</dt><dd>د پایپ ته د بهاو داخلولو لپاره ممکن د پورتنیو اوبو د پام وړ لوړ ژوروالي ته اړتیا وي. د پورتنیو اوبو ژوروالي اټکل کولو لپاره لږ تر لږه ۱.۵ ځله د سرعت سر ورزیات کړئ، یا د معیاري کلورټ د پورتنیو اوبو محاسبو لپاره <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">زما دوه دقیقو ټیوټوریل وګورئ</a>، چې <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> کاروي، د متحده ایالاتو د فدرالي لارو ادارې وړیا کلورټ پروګرام.</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>د فاضلو اوبو د ناله ډیزاین کوئ؟</dt><dd>د ۴ څخه تر ۹۶ انچ (۱۰۰ څخه تر ۲۴۰۰ mm) پایپ لپاره <a target="_blank" href="/sewslope.php">د ناله د لږترلږه میلان جدولونه</a> وګورئ، چې په m/m، mm/m او سلنه کې ورکړل شوي، او <a target="_blank" href="/peakfact.php">د ډېر ټیټ بهاونو لپاره د لوړوالي فکتورونو</a> مطالعه وګورئ. دواړه مرجع اسناد یوازې په انګلیسي ژبه کې دي.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='یو مثبت موخه‌یز Q ولیکئ.';
$ec_lang['mpf_solver_no_solution']='حل نشته: Q په y/d0 = 93.8% کې د پایپ له ظرفیت څخه زیات دی (Qmax = {qmax} په ټاکل شویو واحدونو کې).';
$ec_lang['mpf_solve_btn']='حل کړئ';
$ec_lang['mpf_solve_for_flow']='د بهاو لپاره، Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Manning د پایپ سر ضیاع';
$ec_lang['mphl_main_title']='وړیا آنلاین Manning د پایپ سر ضیاع محاسبه';
$ec_lang['mphl_main_desc']='د Manning فارمول سر ضیاع د ورکړل شوي بشپړ بهاو سره';
$ec_lang['mphl_pipe_length']='د پایپ اوږدوالی، L';
$ec_lang['mphl_area']='مساحت، A';
$ec_lang['mphl_total_junction_k']='د ځایی ضیاع ضریب، k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='د ضیاع ضریب، k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='ځایی (سیمه‌ییز) ضیاع ضریب، km. دا ضیاع د پایپونو د پیوستون ځایونو، ننوتنځایونو، وتنځایونو، ګونیو (خمونو) او سوپاپونو کې رامنځته کیږي — اصطلاح "ثانوي" دودیز دی خو ګمراه‌کوونکی دی؛ په لنډه کرښه کې دا ضیاع کولی شي د اصطکاک له ضیاع سره برابره شي یا حتی ترې هم زیاته شي. معمولي k ارزښتونه: تېز ننوتنځای 0.5، هره 45° ګونۍ 0.2–0.3، دروازه‌یی سوپاپ (بشپړ خلاص) 0.1، پروانه‌یی سوپاپ 0.2، وتنځای (ذخیره ته یا فضا ته) 1.0. د ټول km لپاره ټول اتصالات سره جمع کړئ. تلواله ارزښت 2.0 یو ننوتنځای، یو وتنځای، او دوه 45° ګونۍ فرض کوي.';
$ec_lang['mphl_friction_slope']='د اصطکاک میل';
$ec_lang['mphl_friction_loss']='د اصطکاک ضیاع، h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='ځایی ضیاع، h<sub>m</sub>';
$ec_lang['mphl_total_loss']='ټول ضیاع، h<sub>L</sub>';
$ec_lang['mphl_egl_1']='ښکته EGL';
$ec_lang['mphl_egl_2']='پورته EGL';
$ec_lang['mphl_hgl_egl_tip']='دا پایله ممکن سمه نه وي چېرته چې پایپ د هایدرولیکي کچې کرښې نه پورته ورخیژي.';
$ec_lang['mphl_note_1']='<dl><dt>دا محاسبه د دواړو څنډو ترمنځ د پایپ پروفایل نه ماډل کوي.</dt><dd>که HGL په هر ځای کې د پایپ له سر څخه ښکته شي، دا محاسبه ممکن سمه نه وي.</dd><dt>د خلاص دننه ننوت (کلورټ) د حالت لپاره، د ننوت کنترول حالتونو چک کول اړین دي.</dt><dd>۱. پورتني HGL د پورتني نورمال ژوروالي د بهاو لوړوالي (یا د پایپ لاندې) کمیدلی نشي.</dd><dd>۲. د کلورټ پورتنۍ اوبه د پورتني EGL له خوا د پورتني HGL پر ځای ښه استازولی کیږي.</dd><dd>۳. د ساده معیاري کلورټ د پورتنیو اوبو محاسبو لپاره <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">زما دوه دقیقو ټیوټوریل وګورئ</a>، چې <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a> کاروي، د متحده ایالاتو د فدرالي لارو ادارې وړیا کلورټ پروګرام.</dd><dd>۴. دا پاڼه یوازې د وتلو کنترول حالت حل کوي: یو پایپ چې په بشپړ ډول ډک بهیږي، چېرې چې ښکته اړخ شرایط سر ټاکي. د کلورټ ډیزاین کار دا دی چې پرېکړه وکړي چې ننوت کنترول یا وتلو کنترول کوم یو حاکم دی، نو کله چې دواړه امکان ولري HY-8 وکاروئ.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Manning ذوزنقه چینل';
$ec_lang['mtc_main_title']='وړیا آنلاین Manning فارمول ذوزنقه چینل محاسبه';
$ec_lang['mtc_main_desc']='Manning فارمول یکسان ذوزنقه چینل بهاو د ورکړل شوي میل او ژوروالي سره';
$ec_lang['mtc_bottom_width']='لاندیني پلنوالی، b';
$ec_lang['mtc_side_slope_1']='د اړخ میل ۱، z<sub>1</sub> (افقي/عمودي)';
$ec_lang['mtc_side_slope_2']='د اړخ میل ۲، z<sub>2</sub> (افقي/عمودي)';
$ec_lang['mtc_channel_slope']='د چینل میل، S';
$ec_lang['mtc_flow_depth']='د بهاو ژوروالی، y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">د ګوډ زاویه، β</a><span class="ec-help" title="د ریپراپ اندازه کولو لپاره. د نقشې لپاره لینک تعقیب کړئ."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="د اوبو په پرتله کثافت. د ماتو شویو کاڼو لپاره معمولا ≈ 2.65">د کاڼو ځانګړی ثقل، sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='د ډیزاین کاڼو اندازه، D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='د Strickler له مخې د ډیزاین کاڼو اندازې لپاره n';
$ec_lang['mtc_n_blodgett']='د Blodgett له مخې د ډیزاین کاڼو اندازې لپاره n';
$ec_lang['mtc_n_bathurst']='د Bathurst له مخې د ډیزاین کاڼو اندازې لپاره n';
$ec_lang['mtc_n_pi']='د Phillips & Ingersoll له مخې د ډیزاین کاڼو اندازې لپاره n';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett مقابل Bathurst';
$ec_lang['mtc_pi_range_check']='د P&I ساحې کتنه';
$ec_lang['mtc_pi_ok']='d50 د P&I په ساحه کې دی';
$ec_lang['mtc_pi_ok_tip']='0.28–0.36 فوټ (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='له ساحې بهر';
$ec_lang['mtc_pi_tip']='د 0.28–0.36 فوټ د معلوماتو ساحې څخه بهر اټکل کول چې دا معادله ترې اخیستل شوې ده — دا یوازې د یوې لنډې کتنې په توګه وګڼئ، نه د ډیزاین بنسټ په توګه';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="د Isbash (1936) او Maricopa County, Arizona, US له مخې.">اړین لاندیني زاویه لرونکي کاڼو اندازه، D<sub>50</sub> (Isbash او MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="د Isbash (1936) او Maricopa County, Arizona, US له مخې.">اړین د اړخ میل ۱ زاویه لرونکي کاڼو اندازه، D<sub>50</sub> (Isbash او MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="د Isbash (1936) او Maricopa County, Arizona, US له مخې.">اړین د اړخ میل ۲ زاویه لرونکي کاڼو اندازه، D<sub>50</sub> (Isbash او MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='دا شبکه پر هر هایدرولیکي وخت پړاو حل کړئ.';
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="د Maynord, Ruff, and Abt (1989) له مخې. په یوه ګونج کې کاڼی د اوسط 4/3 د ګونج سرعت لپاره اندازه کیږي، د California Division of Highways (1970) له مخې؛ د Maynord خپل 1.5 په طبیعي چینلونو پورې اړه لري.">اړین زاویه لرونکي کاڼو اندازه، D<sub>50</sub> (Maynord, Ruff, and Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='اړین زاویه لرونکي کاڼو اندازه، D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='سرعت د یکسان بهاو فرضیو لپاره معقول دی.';
$ec_lang['mtc_vel_low']='سرعت ټیټ دی — د رسوب خطر.';
$ec_lang['mtc_vel_high']='سرعت لوړ دی او ممکن واقعي نه وي؛ د کانال د پوښ فرسایش، په ګوډونو کې اضافي ژوروالی، او په پراختیاوو یا خنډونو کې د انرژۍ ضیاع وګورئ.';
$ec_lang['mtc_iteration_tip']='یو د خشونت اختیار (Blodgett–Bathurst وړاندیز کیږي) او د کاڼو اندازې اختیار (Isbash وړاندیز کیږي) غوره کړئ ترڅو ستاسو د غوښتل شوي بهاو لپاره مساوي کاڼو اندازې ته اتوماتیک تکرار وشي. د بشپړ میتود لپاره لاندې یادښتونه وګورئ، یا خپل خشونت ارزښت (د لارښود لپاره لینک وګورئ) داخل کړئ او د کاڼو اندازې ساحه له پامه غورځوئ ترڅو تکرار پرېږدئ.';
$ec_lang['mtc_note_1']='<dl><dt>د کاڼو اندازه او خشونت ډیزاین اتوماتیک تکرار</dt><dd>یو د خشونت اختیار (Blodgett–Bathurst وړاندیز کیږي) او د ډیزاین کاڼو اندازې اختیار (Isbash وړاندیز کیږي) غوره کړئ. ژوروالی او د کاڼو اندازې امنیتي فاکتور سم کړئ ترڅو خپل غوښتل شوي بهاو د مساوي کاڼو اندازې سره ترلاسه کړئ. هر ځل چې تاسو کوم داخلي ارزښت بدل کړئ، محاسبه کوونکی لاندې ګامونه تکراروي: ۱. خشونت د ډیزاین کاڼو اندازې له مخې محاسبه کیږي. ۲. د ټاکلې طریقې نه خشونت ارزښت داخلي خشونت ته کاپي کیږي. ۳. د چینل بهاو او اړین کاڼو اندازه محاسبه کیږي. ۴. د ډیزاین کاڼو اندازه تنظیمیږي. ۵. تکرار کیږي تر هغه چې د ډیزاین کاڼو اندازې کې تیروتنه ډیره کوچنۍ شي.</dd><dt>اساسي محاسبه کوونکی (بدون تکرار)</dt><dd>خپل غوښتل شوي خشونت ارزښت داخل کړئ. د ډیزاین کاڼو اندازې داخلي ساحه له پامه غورځوئ.</dd></dl>';
$ec_lang['mtc_note_2_term']='د سرعت کتنه';
$ec_lang['mtc_note_2_def']='لوړ سرعت په دې دلالت کوي چې یو لوی د لوړوالي کموالی شتون درلود چې دومره لوړ ځانګړی انرژي یې رامنځته کړه. هغه انرژي کولی شي د پراختیاوو، ګوډونو، یا خنډونو کې ژر له لاسه ورکړل شي. تصدیق وکړئ چې دا د سایټ لپاره معقول دی.';
$ec_lang['mtc_solver_no_solution']='د دې چینل داخلاتو سره، د ورکړل شوي Q لپاره هیڅ حل و نه موندل شو.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='ساده ویر بهاو';
$ec_lang['ws_main_title']='وړیا آنلاین ساده پراخ تاج لرونکي ویر بهاو محاسبه';
$ec_lang['ws_main_desc']='ساده پراخ تاج لرونکي ویر بهاو محاسبه';
$ec_lang['ws_weirLength']='د ویر اوږدوالی، L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="د اوبو د واحد وزن لپاره انرژي — د اوبو د ستن یو لوړوالی دی، نه فشار">سر، h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='د ویر ضریب، C<sub>w</sub>';
$ec_lang['ws_notes_heading']='یادداشتونه';
$ec_lang['ws_notes_we_term']='د ویر معادله';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='غیریکسانه ویر بهاو';
$ec_lang['wi_main_title']='وړیا آنلاین برخوي، متغیر ژوروالي، غیریکسانه ویر بهاو محاسبه';
$ec_lang['wi_main_desc']='غیریکسانه ویر بهاو محاسبه';
$ec_lang['wi_weirPoints']='د ویر نقطې';
$ec_lang['wi_pondingHeight']='د ډنډ لوړوالی';
$ec_lang['wi_incrementalFlow']='برخوي بهاو';
$ec_lang['wi_cumulativeFlow']='ټولیز بهاو';
$ec_lang['wi_notes_we_def']='q = که (اوږدوالی = 0) نو 0 که نه که (شیب=0) نو cw*اوږدوالی*d<sub>0</sub><sup>1.5</sup> که نه cw/(2.5*شیب) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) چیرته چې d<sub>1</sub> او d<sub>0</sub> تل مثبت یا صفر دي';
// Orifice Flow
$ec_lang['or_main_menu']='د سوري بهاو';
$ec_lang['or_main_title']='وړیا آنلاین د سوري بهاو محاسبه';
$ec_lang['or_main_desc']='د سوري بهاو — آزاد یا لاندې اوبو';
$ec_lang['or_shape_circular']='دایروي';
$ec_lang['or_shape_rectangular']='مستطیلي';
$ec_lang['or_diameter']='<span class="ec-help" title="د دایروي لپاره قطر؛ د مستطیلي لپاره لوړوالی">قطر یا لوړوالی، D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="یوازې مستطیلي سوري">پلنوالی، W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="د خلاص لاندنۍ برخه">انورټ لوړوالی <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='د پورته اوبو سطح';
$ec_lang['or_twe']='د ښکته اوبو سطح';
$ec_lang['or_cd']='د بهاو ضریب، C<sub>d</sub>';
$ec_lang['or_centroid_elev']='د مرکز لوړوالی';
$ec_lang['or_head']='<span class="ec-help" title="د اوبو د واحد وزن لپاره انرژي — د اوبو د ستن یو لوړوالی دی، نه فشار">مؤثر سر، h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='د خلاص مساحت، A';
$ec_lang['or_regime']='د سوري رژیم چک';
$ec_lang['or_regime_valid']='آزاد وتل';
$ec_lang['or_regime_submerged']='لاندې اوبو کې سوری';
$ec_lang['or_regime_submerged_tip']='TWE د مرکز نه پورته دی — د سوري رژیم لا هم معتبر دی';
$ec_lang['or_regime_warn']='د سوري له رژیم نه بهر';
$ec_lang['or_regime_warn_tip']='پورته اوبه د تاج (خلاص پورتنۍ برخه) نه لاندې دي';
$ec_lang['or_regime_twe_above_hwe']='ننوتنې وګورئ';
$ec_lang['or_regime_twe_above_hwe_tip']='د ښکته اوبو سطحه (TWE) د پورته اوبو سطحې (HWE) نه پورته ده';
$ec_lang['or_notes_1_term']='د سوري معادله';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). د آزاد وتلو لپاره: h = HWE − مرکز. د لاندې اوبو بهاو لپاره (TWE د انورټ پورته): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='د سوري رژیم';
$ec_lang['or_notes_2_def']='د سوري بهاو معادلې هغه وخت پلي کیږي کله چې د پورته اوبو سطحه د خلاص د تاج (پورتنۍ برخې) نه پورته وي. کله چې پورته اوبه د تاج نه لاندې وي، پر ځای یې د ویر معادله وکاروئ.';
$ec_lang['or_notes_3_term']='د بهاو ضریب';
$ec_lang['or_notes_3_def']='C<sub>d</sub> د تیزو غاړو لرونکو سوریو لپاره شاوخوا 0.60–0.65 پورې وي. ګرد شوي یا شاته ننوتلي ننوتونه بېل ارزښتونه کاروي. د لارښوونې لپاره <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> یا HEC-RAS هایدرولیک حوالې لارښود وګورئ.';
$ec_lang['or_notes_4_term']='لاندې اوبو حالت';
$ec_lang['or_notes_4_def']='کله چې TWE د خلاص انورټ پورته وي، دا محاسبه اتوماتیک د لاندې اوبو د سوري معادله h = HWE − TWE کاروي. کله چې TWE د انورټ پر سطحه یا لاندې وي، آزاد وتل فرض کیږي او h = HWE − مرکز.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='کوچنی آبي ځواک';
$ec_lang['mhp_main_title']='وړیا آنلاین کوچنی آبي ځواک محاسبه';
$ec_lang['mhp_main_desc']='د سیند د طبیعي بهاو پر بنسټ د کوچني آبي ځواک محصول محاسبه';
$ec_lang['mhp_gross_head']='ناخالص سر، H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="د فشار لولې (د اکمالاتو پایپ) قطر">د فشار لولې قطر، D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='اوږدوالی، L';
$ec_lang['mhp_efficiency']='د پلانټ موثریت، η (0–1)';
$ec_lang['mhp_vel_check']='د سرعت کتنه';
$ec_lang['mhp_hl_check']='د سر ضیاع کتنه';
$ec_lang['mhp_hnet']='خالص سر، H<sub>net</sub>';
$ec_lang['mhp_power']='د ځواک محصول، P';
$ec_lang['mhp_annual_kwh']='P د کلنۍ انرژۍ په توګه';
$ec_lang['mhp_vel_low']='سرعت ټیټ دی؛ د رسوب کیدو او هوا ننوتلو خطر شته.';
$ec_lang['mhp_vel_high']='سرعت لوړ دی؛ د لېږد ضیاعات، شته انرژي، او د اوبو چکش وکتل شي.';
$ec_lang['mhp_vel_ok_short']='ښه';
$ec_lang['mhp_vel_high_short']='لوړ';
$ec_lang['mhp_vel_low_short']='ټیټ';
$ec_lang['mhp_vel_ok_tip']='سرعت د فشار لولې ډیزاین لپاره په موثره سیمه کې دی.';
$ec_lang['mhp_hl_ok_tip']='د سر ضیاع د ناخالص سر له 10٪ نه لږه ده. دا د پایپ اندازه اقتصادي ده.';
$ec_lang['mhp_hl_warn_tip']='د سر ضیاع د ناخالص سر له 10٪ نه زیاته ده. یو غټ پایپ په پام کې ونیسئ.';
$ec_lang['mhp_hl_bad_tip']='د سر ضیاع د ناخالص سر له 20٪ نه زیاته ده. د پایپ اندازه بدله کړئ.';
$ec_lang['mhp_notes_1_term']='د سر ضیاع';
$ec_lang['mhp_notes_1_def']='د فشار لولې ټول ضیاع h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>، چیرې چې h<sub>f</sub> = f(L/D)(v²/2g) د Darcy-Weisbach اصطکاک ضیاع دی او h<sub>m</sub> = k<sub>m</sub>·v²/2g ننوتنځی، ګوډونه، او والوونه پوښي. خالص سر H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub> دی.';
$ec_lang['mhp_notes_2_term']='سرعت';
$ec_lang['mhp_notes_2_def']='باور وکړئ چې سرعت د شته لوېدنې او د پایپ لګښت لپاره منطقي دی. ډیر ټیټ سرعت ښایي د اندازې زیاتوالي نښه وي؛ ډیر لوړ سرعت کولی شي د اصطکاک ضیاعات او د اوبو چکش خطر زیات کړي.';
$ec_lang['mhp_notes_3_term']='د سر ضیاع موخه';
$ec_lang['mhp_notes_3_def']='د پنسټاک (د اوبو رسونې پایپ) ضیاعات چې د ناخالص سر د ۱۰٪ نه کم وي معمولاً اقتصادي دي. د پایپ لګښت او د ضایع شوي ځواک ترمنځ غوره تعادل ډیری وختونه شاوخوا ۴–۶٪ کې واقع کیږي، چیرې چې د بریښنا بیه خورا لوړه وي.';
$ec_lang['mhp_notes_6_term']='موثریت';
$ec_lang['mhp_notes_6_def']='د کوچني آبي ځواک کې عام د Pelton او کراس-فلو ټربینونو د پلانټ عادي موثریت η د 0.70 تر 0.85 پورې کیږي. د محافظه‌کارانه لومړني اټکل لپاره 0.75 وکاروئ.';
$ec_lang['mhp_notes_7_term']='کلنۍ انرژي';
$ec_lang['mhp_notes_7_def']='کلنۍ انرژي د دوامداره بشپړ بهاو فعالیت (۸۷۶۰ ساعته/کال) فرضوي. واقعي تولید به د موسمي بهاو بدلون، د ساتنې د ودریدو وخت، او د بار فاکتور له امله ټیټ وي.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='د ډنډ او ټانک د تخلیې وخت';
$ec_lang['odt_main_title']='وړیا آنلاین د ډنډ، حوض، او ټانک د تخلیې وخت محاسبګر (منفذ)';
$ec_lang['odt_main_desc']='د ډنډ، حوض، یا ټانک د تخلیې وخت — د منفذ خروجي، د مخروطي حجم میتود';
$ec_lang['odt_h1_elev']='پیلیزه د اوبو د سطحې کچه';
$ec_lang['odt_a1']='پیلیز مساحت، A<sub>1</sub>';
$ec_lang['odt_h2_elev']='پایلیزه د اوبو د سطحې کچه';
$ec_lang['odt_a0']='د سوري د کچې مساحت، A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="د پای کچې لپاره د کونیکي ماډل څخه تخمین شوی">پایلیز مساحت، A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='د پایلیز کچې چک';
$ec_lang['odt_h2_ok']='پایلیزه کچه د سوري تاج نه پورته';
$ec_lang['odt_h2_warn']='پایلیزه کچه د سوري تاج ته یا لاندې';
$ec_lang['odt_h2_warn_tip']='د سوري تاج = مرکز + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="قطر (دایروي) یا لوړوالی (مستطیلي)">د سوري D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="یوازې مستطیلي">د سوري پلنوالی، W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='ایستلو وخت (s)';
$ec_lang['odt_t_min']='ایستلو وخت (min)';
$ec_lang['odt_t_hr']='ایستلو وخت (hr)';
$ec_lang['odt_t_day']='ایستلو وخت (ورځې)';
$ec_lang['odt_notes_1_term']='فارمول';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) د سر H څخه تر سوري پورې د ایستلو وخت ورکوي. ایستلو وخت = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>)، چیرې چې H<sub>1</sub> = پیلیزه کچه − د سوري کچه، H<sub>2</sub> = پایلیزه کچه − د سوري کچه.';
$ec_lang['odt_notes_2_term']='میتود';
$ec_lang['odt_notes_2_def']='د کونیکي حجم میتود ډنډ یا حوض د پیل مساحت A<sub>1</sub> (په لومړني د اوبو سطحه کې) او د سوري د مرکز کچې مساحت A<sub>0</sub> ترمنځ د یوې کونیکي برخې په توګه ماډلوي. A<sub>2</sub>، چې د پای کچې کې د ډنډ مساحت دی، د کونیکي برخې ماډل په کارولو سره د A<sub>1</sub> او A<sub>0</sub> له مخې تخمین کیږي. د پیل نه تر پای کچې پورې د ایستلو وخت د H<sub>1</sub> نه تر سوري پورې د ټول ایستلو وخت منفي د H<sub>2</sub> نه پاتې د ایستلو وخت سره مساوي دی.';
$ec_lang['odt_h1']='<span class="ec-help" title="پیلیزه د اوبو د سطحې کچه منفي د سوري د مرکز کچه">پیلیز سر، H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='اعظمي بهاو، Q<sub>max</sub>';
$ec_lang['odt_vol']='ایستل شوی حجم';
$ec_lang['odt_sketch_start']='پیل';
$ec_lang['odt_sketch_end']='پای';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='د وریزونو واټن، S<sub>e</sub>';
$ec_lang['ip_sl']='د جانبي نلونو واټن، S<sub>l</sub>';
$ec_lang['ip_n_e']='د یو جانبي نل لپاره وریزونه، n<sub>e</sub>';
$ec_lang['ip_n_l']='د یو زون لپاره جانبي نلونه، n<sub>l</sub>';
$ec_lang['ip_d']='د موخې د اوبو د لګولو ژوروالی، d';
$ec_lang['ip_a_e']='د هر وریز لپاره مساحت، A<sub>e</sub>';
$ec_lang['ip_pr']='د اوبو کارولو کچه، PR';
$ec_lang['ip_q_lat']='د یو جانبي نل بهاو، Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='د زون بهاو، Q<sub>zone</sub>';
$ec_lang['ip_t_run']='د چلولو وخت (ساعتونه)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='د کانال چوړ';
$ec_lang['cs_main_title']='وړیا آنلاین د کانال چوړ ضیاع او د لیږدولو اغیزمنتیا کالکولېټر';
$ec_lang['cs_main_desc']='د کانال د چوړ ضیاع & د لیږدولو اغیزمنتیا — د ننوت-وتلو میتود';
$ec_lang['cs_Q_in']='ننوتلو بهاو، Q<sub>in</sub>';
$ec_lang['cs_Q_out']='وتلو بهاو، Q<sub>out</sub>';
$ec_lang['cs_L']='د برخې اوږدوالی، L';
$ec_lang['cs_Q_loss']='د چوړ ضیاع کچه، Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='د اندازه کولو کتنه';
$ec_lang['cs_pct_loss']='ضایع شوی کسر';
$ec_lang['cs_Ec']='د لیږدولو اغیزمنتیا، E<sub>c</sub>';
$ec_lang['cs_Ec_check']='د اغیزمنتیا درجه‌بندي';
$ec_lang['cs_Vol_day']='ورځنی ضایع شوی حجم';
$ec_lang['cs_Vol_year']='کلنی ضایع شوی حجم';
$ec_lang['cs_Q_loss_per_L']='د واحد اوږدوالي لپاره ضیاع، Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='د اوبو ارزښت';
$ec_lang['cs_lining_cost']='د کښلو لګښت';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="د کښلو وروسته د لیږدولو اغیزمنتیا موخه؛ کسر 0–1">د کښلو موخه، E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='د کښلو مساحت، L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='کلنی ضایع شوی ارزښت';
$ec_lang['cs_annual_value_recovered']='کلنی بیرته لاسته راغلی ارزښت';
$ec_lang['cs_lining_total_cost']='د کښلو ټول لګښت';
$ec_lang['cs_payback_years']='<span class="ec-help" title="ساده بیرته-راکړنه = د کښلو ټول لګښت ÷ کلنی بیرته لاسته راغلی ارزښت">د بیرته-راکړنې موده <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — چوړ وموندل شو';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — د اندازه کیدو وړ ضیاع نشته';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — اندازه کول وګورئ';
$ec_lang['cs_Ec_good']='ښه — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='منځنی — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='ضعیف — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='د ننوت-وتلو میتود د کانال د یوې برخې په سر او لمن کې د بهاو اندازه کولو له لارې چوړ اټکل کوي: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. د لیږدولو اغیزمنتیا E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. کلنی حجم د دوامداره بشپړ-بهاو چلند فرض کوي؛ د موسمي یا نیمه-بهاو کانالونو لپاره واقعي ضیاع لږ وي.';
$ec_lang['cs_notes_2_term']='د اغیزمنتیا درجه‌بندۍ';
$ec_lang['cs_notes_2_def']='معمولي بې کښلو خاورین کانالونه: E<sub>c</sub> = 60–80%. ښه ساتل شوي خاورین کانالونه: 75–85%. کانکریټ کښلي کانالونه: 90–98%. کله چې د چوړ ضیاع د ننوت له 30% څخه زیاته وي، معمولاً د کښلو پانګونه ورته اړوند وي. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='د کښلو بیرته-راکړنه';
$ec_lang['cs_notes_3_def']='د اوبو ارزښت او د کښلو لګښت په هر همغږي پیسو کې ولیکئ. د کښلو مساحت = د برخې اوږدوالی × لندې محیط — د اندازه شوي بهاو ژوروالي کچه د کانال د مقطع لندې محیط (لاندیني پلنوالی زیات دواړه لندي شیبونه). کلنی بیرته لاسته راغلی ارزښت فرض کوي چې کښل شوی کانال په دوامداره توګه موخه E<sub>c</sub> ته رسیږي. که کانالونه موسمي وي یا کښلول موخه اغیزمنتیا ته ونه رسیږي، واقعي بیرته-راکړنه به اوږده وي.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>، درېیم چاپ (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='د اړه';
$ec_lang['install_main_menu']='نصب';
$ec_lang['install_main_title']='د EngCalcs نصبول';
$ec_lang['install_main_desc']='آفلاین کارولو لپاره خپل وسیلې ته اضافه کړئ';
$ec_lang['install_intro']='EngCalcs یو مترقي ویب ایپلیکیشن (PWA) دی. یوځل چې نصب شي، ټول محاسبه‌کوونکي په بشپړ ډول آفلاین (پرته له انټرنېټ اړیکې) کار کوي.';
$ec_lang['install_android_heading']='اېنډرویډ (Chrome)';
$ec_lang['install_android_steps_html']='<li>په Chrome کې د هر محاسبه‌کوونکي پاڼه پرانیزئ.</li><li>په پورتنۍ لارښود پټه کې د <strong>⬇ نصب کول</strong> تڼۍ کېکاږئ، یا د براوزر مینو (⋮) ته لاس ورسوئ او <strong>ټکی پاڼه ته اضافه کول</strong> غوره کړئ.</li><li>په ښکاره شوي پیغام کې <strong>نصب کول</strong> کېکاږئ.</li><li>EngCalcs ستاسو په کور پاڼه کې ښکاري او آفلاین کار کوي.</li>';
$ec_lang['install_now_btn']='⬇ اوس یې نصب کړئ';
$ec_lang['install_prompt_unavailable']='د نصب کولو پیغام شتون نلري — پرځای یې د خپل براوزر مینو وکاروئ.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>په Safari کې د هر محاسبه‌کوونکي پاڼه پرانیزئ.</li><li>د <strong>شریکول</strong> تڼۍ کېکاږئ (هغه بکس چې غشی یې پورته اشاره کوي).</li><li>ښکته لاړ شئ او <strong>ټکی پاڼه ته اضافه کول</strong> کېکاږئ.</li><li><strong>اضافه کول</strong> کېکاږئ. EngCalcs به ستاسو په کور پاڼه کې ښکاره شي.</li>';
$ec_lang['install_ios_note']='په iOS کې، نصب کول تل د شریکولو مینو په مرسته ترسره کیږي — هېڅ ډول خپلکاره نصب پیغام شتون نلري.';
$ec_lang['install_desktop_heading']='ډیسکټاپ (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>د هر محاسبه‌کوونکي پاڼه پرانیزئ.</li><li>د براوزر د پتې پټې کې پر <strong>د نصب کولو نښه</strong> (⊕ یا کمپیوټر نښه) کېکاږئ، یا د براوزر مینو پرانیزئ او <strong>EngCalcs نصب کول…</strong> غوره کړئ.</li><li><strong>نصب کول</strong> کېکاږئ. EngCalcs به د یوې خپلواکې ایپ کړکۍ په توګه پرانیستل شي.</li>';
$ec_lang['install_firefox_heading']='Firefox / نور براوزرونه';
$ec_lang['install_firefox_body']='که براوزر د نصبولو هیڅ اختیار نه وړاندې کوي، کلکولیټرونه په براوزر کې لکه معمول وکاروئ. له لومړۍ کتنې وروسته، پاڼې د آفلاین کارونې لپاره په خپلکاره توګه کش کیږي. Firefox په ډیسکټاپ کې عام حالت دی.';
$ec_lang['install_cached_heading']='څه شی خوندي (کش) کیږي';
$ec_lang['install_cached_body']='کله چې تاسو EngCalcs لومړی ځل نصب کړئ، ټول د محاسبه‌کوونکو پاڼې او د هغوی مرستندویه فایلونه (سکریپټونه، سټایلونه) په خپلواک ډول ستاسو په وسیله کې خوندي کیږي. له هغه وروسته، هر څه پرته له انټرنېټ اړیکې کار کوي. ستاسو د ژبې انتخاب ستاسو له وروستي آنلاین لیدنې څخه په یاد وي.';
$ec_lang['contact_main_menu']='اړیکه';
$ec_lang['about_main_title']='د HawsEDC انجینري کالکولیټرونو د اړه';
$ec_lang['about_main_desc']='مأموریت، آزاد سافټویر، او همکاري';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>مأموریت</h3><p>د HawsEDC انجینیري کلکولیټرونه له 2010 نه په وړیا ډول په انټرنیټ کې وړاندې کیږي. دوی د نړۍ په ګوټ ګوټ کې د انجینیرانو او ډګري کارکوونکو د خدمت لپاره شتون لري — په ځانګړې توګه هغه کسان چې د اوبو کموالي، محدودو سرچینو، یا لږ خدماتو لرونکو سیمو کې کار کوي. دا وسیلې د یوې پراخې بشري موخې برخه دي: هر انسان ته په خورا عملي او مؤثره ډول دا ووایي <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">چې هغه تل ګران او دوست لرل شوی دی، چې هغه له هیڅ شي نه ډاریږي، او دا چې هغه به هر څه نه خرابوي</a>.</p><p>کلکولیټرونه یوازې وسیله ده. منزل د سختیو پرته یوه نړۍ ده.</p><h3>آزاد او خلاص سرچینې جواز</h3><p>ټول کوډ د <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 یا وروستي نسخه</a> لاندې خپور شوی — آزاد، د آزادۍ په مانا. تاسو کولی شئ کوډ د ورته شرایطو لاندې وکاروئ، مطالعه یې کړئ، بدلون یې راوړئ، او بیا یې خپور کړئ.</p><p>هغه ویب پاڼه چې دا کوډ وړاندې کوي نن او له 2010 نه په وړیا ډول وړاندې کیږي؛ که یو ورځ ونه شي کولی، سافټویر بیا هم ستاسو دی چې وچلوئ.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>د سرچینې کوډ</h3><p>د سرچینې بشپړ کوډ د GitHub پر عامه توګه شتون لري:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>تاسو هلته کوډ کتلی شئ، ستونزې ثبتولی شئ، یا ریپوزیټوري فورک کولی شئ.</p><h3>همکاري</h3><p>هر ډول مرسته ښه راغلاست ده. <a href="contact.php">له Tom Haws سره اړیکه ونیسئ</a>.</p><ul><li><strong>ژباړې:</strong> ښه الفاظ وړاندې کړئ. یوه ژبه ښه کړئ یا نوې اضافه کړئ.</li><li><strong>د بګ راپورونه:</strong> د کوم کلکولیټر پاڼه کې د فیډبیک فارم وکاروئ، یا GitHub کې ستونزه ثبت کړئ.</li><li><strong>نوي کلکولیټرونه:</strong> د هایدرولیک انجینیري وسیلو لپاره نظریات چې میدانی کارکوونکو او اوبلګون مسلکیانو ته خدمت کوي، په ځانګړي توګه ښه راغلاست دي.</li><li><strong>هوسټینګ:</strong> که تاسو کولی شئ دا کلکولیټرونه د محدود اتصال لرونکې سیمې لپاره انعکاس کړئ، مهرباني وکړئ زما سره اړیکه ونیسئ.</li></ul><h3>آفلاین کارول</h3><p>هر یو کلکولیټر یو ځل پرانیزئ کله چې آنلاین یاست، او ټول کار کوي کله چې نه یاست: ستاسو براوزر ټوله ټولګه د تګ په وخت کې ذخیره کوي. دا میکانیزم یو <strong>پرمختللی ویب اپلیکیشن (PWA)</strong> دی. له هغې وروسته، ټول کلکولیټرونه بې له انټرنیټه کار کوي — انټرنیټ ته اړتیا نشته.</p><p>په Android یا iOS کې، د خپل براوزر د "کور سکرین ته اضافه کړئ" اختیار وکاروئ ترڅو EngCalcs د اپلیکیشن په توګه په خپل وسیله کې نصب کړئ. په ډیسکټاپ کې، د خپل براوزر د پتې پټي کې د نصب آیکون وګورئ.</p><p>تاسو کولی شئ هر یو کلکولیټر د خپل براوزر د "د نوم سره خوندي کړئ…" مینو له لارې هم د یو ځل آفلاین کارولو لپاره خوندي کړئ.</p><h3>اړیکه</h3><p>Tom Haws، هایدرولیک انجینیر او د دغو کلکولیټرونو بنسټ ایښودونکی.<br />د کوم کلکولیټر پاڼه کې د فیډبیک فارم وکاروئ، یا سرچینې کوډ ته د <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a> له لارې لاسرسی ومومئ.</p>';
$ec_lang['contactSendMessage']='Tom Haws ته پیغام ولیږئ';
$ec_lang['contactYourName']='ستاسو نوم:';
$ec_lang['contactYourEmail']='ستاسو بریښنالیک پته:';
$ec_lang['contactSubject']='موضوع:';
$ec_lang['contact_message']='پیغام:';
$ec_lang['contactSpamPrefix']='پنځه زیات یو مساوي دي';
$ec_lang['contactSpamPostfix']='(مهرباني وکړئ هغه ولیکئ. 1=یو 2=دوه 3=درې 4=څلور 5=پنځه 6=شپږ 7=اوه +=زیات 5+1=6)';
$ec_lang['contactSubmitButton']='پیغام ولیږئ';
$ec_lang['contact_success']='تاسو د لیکلو لپاره وخت کاروت د هغې لپاره تشکر.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='د کاڼو تند اوبو لار ډیزاین (Robinson)';
$ec_lang['rc_main_title']='وړیا آنلاین د کاڼو تند اوبو لار ډیزاین محاسبه — Robinson (1998)';
$ec_lang['rc_main_desc']='د کاڼو تند اوبو لار د کاڼو اندازې ټاکل — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='د تند اوبو لار د بیخ شیب، S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="د کاڼو تند اوبو لار ننوتنځي کې د هر واحد پلنوالي لپاره بهاو. د B ښکتنی پلنوالی لرونکي کانال لپاره چې Q ټول بهاو لري، q_t = Q / B وکاروئ.">ټول واحد بهاو، q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='د کاڼو سوري والتیا، n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="د اوبو په پرتله کثافت. د عادي مات شوي ګرانائټ یا بازالټ لپاره معمولا ≈ 2.65. د Robinson سمه لړۍ: 2.54 تر 2.82.">د کاڼو ځانګړی ثقل، sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="د درجه‌بندۍ معیاري انحراف. یو‌شان کاڼي ≈ 1.25. د Robinson سمه لړۍ: 1.15 تر 1.47.">درجه‌بندي SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="د اوبو راټولېدل (Hp > yn) ښه دي — پورتنی فرسایش کموي. (USDA)">د ننوتنځي کانال کې نورمال ژوروالی، y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="معادله 1 (S0 < 0.10) یا معادله 2 (0.10-0.40). سمه لړۍ: D50 15-278 mm، S0 0.02-0.40. د لړۍ نه بهر: اټکل شوي ارزښتونه.">اړینه منځنۍ د کاڼو اندازه، D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='کارول شوې معادله';
$ec_lang['rc_sg_check']='د ځانګړي ثقل کتنه';
$ec_lang['rc_SD_check']='د درجه‌بندۍ SD کتنه';
$ec_lang['rc_sg_ok']='sg په سمه لړۍ کې دی (2.54–2.82)';
$ec_lang['rc_sg_ok_tip']='2.54–2.82 (Robinson)';
$ec_lang['rc_sg_low']='sg د Robinson لړۍ نه لاندې دی';
$ec_lang['rc_sg_low_tip']='سمه لړۍ: 2.54–2.82';
$ec_lang['rc_sg_high']='sg د Robinson لړۍ نه پورته دی';
$ec_lang['rc_sg_high_tip']='سمه لړۍ: 2.54–2.82';
$ec_lang['rc_SD_ok']='SD په سمه لړۍ کې دی (1.15–1.47)';
$ec_lang['rc_SD_ok_tip']='1.15–1.47 (Robinson)';
$ec_lang['rc_SD_low']='SD د Robinson لړۍ نه لاندې دی';
$ec_lang['rc_SD_low_tip']='سمه لړۍ: 1.15–1.47';
$ec_lang['rc_SD_high']='SD د Robinson لړۍ نه پورته دی';
$ec_lang['rc_SD_high_tip']='سمه لړۍ: 1.15–1.47';
$ec_lang['rc_layer']='د کاڼو پرت ضخامت (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='د پورتني کرسټ منحني شعاع (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='د پورتني کرسټ منحني د قوس اوږدوالی';
$ec_lang['rc_apron_length']='<span class="ec-help" title="د کاڼو پرت جوړښتي ملاتړ لپاره اړین دی. “هغه لږترلږه لاندنۍ اوبه چې د وتنځي برخې او ښکته‌اړخ کانال مقاومت له امله رامنځته کیږي، د وتنځي برخې کې د کاڼو ثبات ډاډمنولو لپاره کافي ده.” (Robinson)">د وتنځي اپرون اوږدوالی (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='په تند اوبو لار کې د Manning خشونت، n';
$ec_lang['rc_Vm']='<span class="ec-help" title="د qt هغه برخه چې د کاڼو سوریو له لارې تیریږي. پاتې برخه qs د سطحې پر مخ بهیږي. تلواله (ډیفالټ) np = 0.45 د زاویه‌لرونکو مات شویو کاڼو لپاره ده.">د کاڼو د پوښ (مینټل) له لارې سرعت، V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='د پوښ (مینټل) له لارې واحد بهاو، q<sub>m</sub>';
$ec_lang['rc_qs']='د سطحې واحد بهاو، q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='د کاڼو سطحې پورته د بهاو ژوروالی، d';
$ec_lang['rc_Hp']='<span class="ec-help" title="د اوبو راټولېدل (Hp > yn) ښه دي — پورتنی فرسایش کموي. (USDA)">د ننوتنځي د ویر سر، H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='د ننوتنځي د اوبو راټولیدو کتنه';
$ec_lang['rc_pond_ok']='H<sub>p</sub> > y<sub>n</sub> — پورته اوبه راټولېږي';
$ec_lang['rc_pond_ok_tip']='د تند اوبو لار ننوتنځي نه پورته د اوبو راټولېدل ښه دي؛ دا پورتنی فرسایش کموي. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — اوبه نه راټولېږي — د ننوتنځي د فرسایش امکان شته';
$ec_lang['rc_pond_warn_tip']='د تند اوبو لار ننوتنځي نه پورته اوبه نه راټولېږي؛ ممکن پورته فرسایش رامنځته شي. (USDA)';
$ec_lang['rc_eq1']='معادله 1 (S<sub>0</sub> < 0.10) — لږ شیب';
$ec_lang['rc_eq2']='معادله 2 (0.10 ≤ S<sub>0</sub> ≤ 0.40) — تند شیب';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0.02 — د Robinson د تایید لړۍ نه لاندې دی';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0.40 — د Robinson د تایید لړۍ نه پورته دی';
$ec_lang['rc_notes_1_term']='د کاڼو اندازې ټاکلو معادلې';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) د تند اوبو لار شیب او د واحد بهاو پر بنسټ د کاڼو منځنۍ اندازې D<sub>50</sub> لپاره دوه تجربي معادلې جوړې کړې. معادله 1 د لږو شیبونو لپاره کارول کیږي (S<sub>0</sub> < 0.10)؛ معادله 2 د تندو شیبونو لپاره کارول کیږي (0.10 ≤ S<sub>0</sub> ≤ 0.40). دواړه معادلې q<sub>t</sub> په م²/ثانیه کې غواړي او D<sub>50</sub> په ملی‌متر کې ورکوي. تاییدشوې لړۍ 0.02 ≤ S<sub>0</sub> ≤ 0.40 ده.';
$ec_lang['rc_notes_2_term']='واحد بهاو';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> د تند اوبو لار د سر (کرسټ) کې ټول واحد بهاو دی (د هر واحد پلنوالي لپاره ټول بهاو). د B ښکتنی پلنوالی لرونکي کانال لپاره چې Q ټول بهاو لري، q<sub>t</sub> ≈ Q / B اټکل کړئ، یا یې د تند اوبو لار ننوتنځي کې د بحراني ژوروالي شرط له مخې حساب کړئ.';
$ec_lang['rc_notes_3_term']='د کاڼو پوښ (مینټل) له لارې بهاو';
$ec_lang['rc_notes_3_def']='د ټول بهاو یوه برخه د کاڼو سوریو له لارې تیریږي (د پوښ بهاو q<sub>m</sub>)؛ پاتې برخه د کاڼو سطحې پر مخ بهیږي (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). د بهاو ژوروالی d د Manning معادلې له مخې حساب کیږي چې د سطحې بهاو q<sub>s</sub> ته د تند اوبو لار خشونت n په کارولو سره پلي کیږي. تلواله (ډیفالټ) سوري والتیا n<sub>p</sub> = 0.45 د زاویه‌لرونکو مات‌شویو کاڼو لپاره عادي ده.';
$ec_lang['rc_notes_5_term']='د کاڼو اندازې سمه لړۍ';
$ec_lang['rc_notes_5_def']='معادلې د D<sub>50</sub> د 15 mm تر 278 mm لړۍ په کارولو سره جوړې شوې دي. د دې لړۍ نه بهر پایلې اټکل شوي دي او باید د اضافي انجینیري قضاوت سره وکارول شي.';
$ec_lang['rc_notes_6_term']='د وتنځي اپرون لوړوالی';
$ec_lang['rc_notes_6_def']='د وتنځي برخې کې د کاڼو د پاسنۍ سطحې لوړوالی باید د ښکته‌اړخ کانال د تله لوړوالي په کچه یا ترې لاندې وي. که چیرې لوړ وي، د وتنځي کاڼي به بې‌ثباته وي.';

$ec_lang['rc_notes_7_def']='کله چې د ننوتنځي کانال کې نورمال ژوروالی د هغه ویر سر (H<sub>p</sub>) نه کم وي چې د q<sub>t</sub> تیرولو لپاره اړین دی، نو د تند اوبو لار ننوتنځي نه پورته محدود بهاو یا د اوبو راټولیدل رامنځته کیږي. دا په عمومي ډول د منلو وړ دي — د اوبو راټولیدل سرعت کموي او پورته فرسایش مخنیوی کوي. د کتنې لپاره: د ورکړل شوي q<sub>t</sub> او د سر پلنوالي لپاره H<sub>p</sub> موندلو ته د ویر بهاو محاسبګر وکاروئ، او دا د ننوتنځي کانال نورمال ژوروالي سره پرتله کړئ. که H<sub>p</sub> د نورمال ژوروالي نه ډیر شي، اوبه به راټولېږي.';
$ec_lang['rc_notes_4_term']='سرچینه';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS د ورته میتود پر بنسټ یو <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">Excel سپریډشیټ</a> هم خپروي.';
// Sketch labels
$ec_lang['rc_sketch_filter']='فلتر';
$ec_lang['rc_sketch_top_crest_curve']='د پورتني کرسټ منحني';
$ec_lang['rc_sketch_outlet_apron']='د وتنځي اپرون';
$ec_lang['rc_sketch_radius']='شعاع';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='د اوبو د لګولو فشار';
$ec_lang['ip_main_title']='وړیا آنلاین د اوبو د لګولو فشار & د ویش یو‌شانتیا کالکولېټر';
$ec_lang['ip_main_desc']='د ازموینې څانګې فشار او یو‌شانتیا اټکل';
$ec_lang['ip_h_supply']='د تامین فشار';
$ec_lang['ip_elev_supply']='د تامین لوړوالی، z<sub>supply</sub>';
$ec_lang['ip_q_design']='د وریز ډیزاین بهاو، q<sub>design</sub>';
$ec_lang['ip_h_design']='د وریز ډیزاین فشار';
$ec_lang['ip_x']='<span class="ec-help" title="د معیاري غیر-جبرانوونکو وریزونو لپاره 0.5؛ د فشار-جبرانوونکو وریزونو لپاره نږدې 0">د وریز خارجېدنې اکسپوننټ، x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='د ازموینې لار';
$ec_lang['ip_group_reach']='برخه';
$ec_lang['ip_group_upstream']='پورتنۍ خوا';
$ec_lang['ip_group_downstream']='ښکتنۍ خوا';
$ec_lang['ip_group_loss']='ضیاع';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="نښه شوی: دا برخه د ازموینې جانبي نل یوه برخه ده، چې تر څنګ یې انفرادي وریزونه اوبه اخلي. بې نښې: دا برخه اصلي نل دی، یوازې بهاو هغو جانبي نلونو ته رسوي چې د ازموینې لار برخه نه دي.">جانبي <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="د جانبي نل کرښې: یوازې په دې برخه کې وریزونه. د اصلي نل کرښې: پر هغو جانبي نلونو ټول وریزونه چې د دې برخې غیر له نورو څخه شاخه کیږي. د اصلي نل هغه برخې لپاره چې د ازموینې جانبي نل ته رسیږي، دا هم په اصلي نل کې تر دې ځای وروسته پاتې هر جانبي نل، یا په ورته جنکشن کې شریک (لکه مخالف اړخ جانبي نل) شاملوي — د دوی بهاو هم له همدې برخې څخه شاخه کیږي.">وریزونه <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="د دې برخې د ښکتني پای لوړوالی. د منځني کرښو لپاره اختیاري دی (که خالي پریښودل شي، هوار / د پورتني نوډ سره یو شان ګڼل کیږي). د وروستۍ کرښې لپاره لازمي دی: هغه ارزښت د آخري وریز لوړوالی دی، کوم چې مستقیماً اړین تامین فشار ټاکي.">ښکتنی لوړوالی <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='د آخري وریز لوړوالی (وروستۍ کرښه) خالي پاتې شو او هوار ګڼل شو — د دقیقې پایلې لپاره یې ولیکئ';
$ec_lang['ip_press']='فشار';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="د برخې ټوله ضیاع، h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='ټیټ/منفي فشار — د فضا لاندې شرایطو لپاره وګورئ';
$ec_lang['ip_pressure_warn_short']='ټیټ';
$ec_lang['ip_pressure_high']='لوړ فشار لرونکي ځایونه د فشار کمولو ته اړتیا لري';
$ec_lang['ip_pressure_high_short']='لوړ';
$ec_lang['ip_max_head']='د پایپ اعظمي مجاز فشار';
$ec_lang['ip_max_head_tip']='هغه کرښې چې فشار یې له دې ارزښت څخه زیات وي نښه کیږي. د لوړ فشار ازموینې تېرولو لپاره یې خالي پریږدئ.';
$ec_lang['ip_h_far']='د آخري وریز فشار';
$ec_lang['ip_q_supply']='<span class="ec-help" title="یوازې هغه بهاو چې نمونه شوې ازموینې لار ته ننوځي — د بشپړ زون/سیستم لپاره لاندې د کارونې ډیزاین کې Q_zone وګورئ.">د ازموینې لار تامین بهاو، Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='د آخري وریز بهاو، q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='د وریز اوسط بهاو (ازموینې جانبي نل)، q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="تاسو اټکل کوئ چې یو عادي جانبي نل د دې ازموینې جانبي نل په پرتله څومره لوړ (یا ټیټ) فشار لري. ازموینې جانبي نل په قصدي توګه د بدترین حالت په توګه ګڼل کیږي، نو د هغه خپل اوسط د ساحې اوسط لپاره ټیټ اټکل دی — که پر 0 پریښودل شي، لاندې د یو‌شانتیا کتنه او د کارونې-ډیزاین شمیرې د ازموینې جانبي نل خپل (ښایي زیات ښه‌بین) اوسط لکه څنګه چې دی کاروي.">اټکل شوی Δفشار، اوسط د ازموینې جانبي نل په پرتله <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral د هرې جانبي نل کرښې فشار زیات د پورته لیکل شوي فشار توپیر سره بیا-ارزول شوی — دا هڅه ده چې د ازموینې جانبي نل د بدترین حالت ګڼلو لپاره سمون ورکړي، نه د یوه استازي کوونکي حالت لپاره. دا هم لاندې د یو‌شانتیا کتنه او د کارونې-ډیزاین برخه دواړو ته تغذیه کوي.">د ساحې اټکل شوی اوسط وریز بهاو، q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="د آخري وریز محاسبه شوی بهاو د ساحې اټکل شوي اوسط وریز بهاو باندې ویشل شوی — دا د معیاري ټیټه-ربعه د ویش یو‌شانتیا (ټیټه-ډلې اوسط ÷ د ټول ډلې منځنی) یو نږدې والی دی؛ دا د یوې کوچنۍ نمونه‌یي بڼې او د کارونکي اټکل شوي سمون له مخې دی، نه د بشپړې ساحې احصایوي نمونې. د 1 سره یا تر هغه پورته ارزښتونه ممکن او سم دي: دا یوازې دا معنا لري چې د آخري وریز فشار د اټکل شوي ساحوي اوسط سره برابر یا تر هغه پورته دی، نو کوم بل وریز د ټیټ فشار ځای دی. دا ممکن ځکه وي چې آخري وریز په ټیټه ځمکه کې دی یا ځکه چې د Δفشار اټکل ډیر کوچنی دی.">د یو‌شانتیا کتنه، q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='د ازموینې وریز کې فشار ≥ د تامین فشار. دا ښایي بدترین حالت وریز نه وي، یا پایپونه کولی شي کوچني شي.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="دا زموږ د معیاري یو‌شانتیا اندازې نږدې والي څخه بېل دی.">د آخري وریز بهاو ÷ ډیزاین بهاو، q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='حل نشته: اړین تامین فشار د لیکل شوي تامین فشار څخه زیات دی. تامین فشار زیات کړئ، غوښتنه کمه کړئ، یا لوی پایپ وکاروئ.';
$ec_lang['ip_notes_1_def']='د آخري (تر ټولو لرې) وریز کې فشار اټکلوي، بیا د انرژۍ کچې کرښه برخه‌پر-برخه تامین ته شاته وړي، په لاره کې د اصطکاک او ځایي ضیاعاتو زیاتولو سره. په هر نوډ کې لوړوالی او د سرعت لوړوالی کمول کیږي ترڅو هلته حقیقي فشار راپور شي. اټکل شوی لرې-پای فشار سمون کیږي (دوه‌ویشنې میتود) تر هغه چې محاسبه شوی اړین تامین فشار د لیکل شوي تامین فشار سره برابر شي — همغه تړلی-حلقې ستونزه چې د Manning پایپ بهاو کالکولېټر کې د پایپ-بهاو حلونکي لخوا حل کیږي، خو دلته یوې څانګه‌یزې شبکې ته پراخه شوې.';
$ec_lang['ip_notes_2_term']='اصلي نل پر وړاندې جانبي نل برخې';
$ec_lang['ip_notes_2_def']='هره کرښه د تامین څخه تر آخري وریز پورې د یوازینۍ هایدرولیکي بدترینې لارې (د ازموینې لار) پر اوږدو یوه برخه ده. د اصلي نل یوه برخه یوازې هغو جانبي نلونو ته بهاو رسوي چې د ازموینې لار برخه نه دي، نو د هغې اخیستنه یوه ساده ضرب ده (ډیزاین بهاو × د برخې ټول د وریزونو شمېر) — هیڅ ځایي فشار حساسیت نشته. اصلي نل یو شریک تنه پایپ دی، نو د اصلي نل هغه برخه چې تر ازموینې جانبي نل پورې رسیږي باید نه یوازې د خپلو دواړو انجامونو ترمنځ جانبي نلونه ولري، بلکې هغه جانبي نلونه هم چې اصلي نل کې تر دې ځای نه هاخوا دي، یا په ورته جنکشن کې شریک دي (لکه مخالف اړخ جانبي نل) — د دوی بهاو مخکې له بېلوالي له همدې برخې تیریږي، که دا جدول کې بل ځای هم راڅرګند شي یا نه. د جانبي نل برخه د ازموینې جانبي نل خپله یوه برخه ده: د وریز خارجېدنه د حقیقي ځایي فشار له مخې q = k·H<sup>x</sup> په واسطه محاسبه کیږي، او د اصطکاک ضیاع د Christiansen د F(n) فکتور له مخې کمیږي ترڅو په برخه کې د هر وریز د اوبو اخیستلو سره د بهاو کمښت په پام کې ونیول شي.';
$ec_lang['ip_notes_3_term']='محدودیتونه';
$ec_lang['ip_notes_3_def']='یو ثابت تامین فشار (بې پمپ منحني)، یوازې یوه ازموینې لار (نه بشپړه ساحه)، او د 2-پارامیټره وریز منحني (د فشار-جبرانوونکي وریز نږدې کولو لپاره اکسپوننټ نږدې 0 ته ټاکئ) نمونه کوي. دوه بېلابېلې د یو‌شانتیا نسبتونه راپور کیږي، چې په قصدي توګه بېل ساتل شوي: q<sub>last</sub>/q<sub>avg,field</sub> د معیاري ټیټه-ربعه د ویش یو‌شانتیا (ټیټه-ډلې اوسط ÷ د ټول ډلې منځنی) یو نږدې والی دی؛ خو دا د یوې کوچنۍ نمونه‌یي بڼې او د کارونکي اټکل شوي سمون له مخې دی، نه د معیاري بشپړې ساحې احصایوي نمونې. همدارنګه، ازموینې جانبي نل په قصدي توګه د بدترین حالت په توګه ګڼل کیږي، نو د هغه خام، نه-سمون شوی اوسط به حقیقي ساحوي اوسط ټیټ وښیي او یو‌شانتیا به تر حقیقي څخه ښه ښکاره کړي؛ د Δفشار ننوت په ځانګړي توګه د دې تعصب سره د مقابلې لپاره شتون لري. د 1 سره یا تر هغه پورته یو‌شانتیا ارزښتونه بیا هم ممکن دي: دا یوازې دا معنا لري چې د آخري وریز فشار د اټکل شوي ساحوي اوسط سره برابر یا تر هغه پورته دی، نو کوم بل وریز د ټیټ فشار ځای دی. دا ممکن ځکه وي چې آخري وریز په ټیټه ځمکه کې دی یا ځکه چې د Δفشار اټکل ډیر کوچنی دی. q<sub>last</sub>/q<sub>design</sub> یوه بېله، غیر-یو‌شانتیا کتنه ده د تولیدوونکي درجه‌بندي شوي بهاو په وړاندې — د ټول سیستم ډیر- یا کم-فشار کتلو لپاره ګټوره، خو دا د یو‌شانتیا شمېرې سره یوځای لوستلو لپاره یوه بېله کتنه ده، ځکه چې ډیزاین/درجه‌بندي شوی بهاو د سیستم د حقیقي منځني چلونې فشار څخه خپلواک دی.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. د میکرو-اوبولګولو ډیزاین لپاره د ASAE/ASABE معیارونه ورته څو-خارجي اصطکاک-ضیاع طریقه کاروي.';
$ec_lang['ip_notes_5_term']='د کارونې ډیزاین';
$ec_lang['ip_notes_5_def']='د کارونې کچه او د سیستم/زون بهاو د ساحې اټکل شوي اوسط وریز بهاو (q<sub>avg,field</sub> — د ازموینې جانبي نل خپل اوسط، د لیکل شوي Δفشار اټکل له مخې سم شوی) کاروي، نه یو اټکل شوی کچه: PR = q<sub>avg,field</sub> / A<sub>e</sub>، د سم شوي نمونه‌یي ارزښت لخوا تغذیه شوی. د واټن او د ټول سیستم جانبي/وریز شمېرونه دلته بېل ننوتونه دي ځکه چې د ازموینې لار یوازې یوه بدترینه-حالته څانګه نمونه کوي، نه د ساحې هر جانبي نل.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='د پایپ څانګه‌یزه شبکه';
$ec_lang['bpn_main_title']='وړیا آنلاین د پایپ څانګه‌یزې شبکې د فشار کالکولېټر (پرته له حلقو)';
$ec_lang['bpn_main_desc']='د پایپ څانګه‌یزې (ونیزې) شبکې بهاو او فشار';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='د تامین ثابت سر: په صفر بهاو کې د سرچینې سر. د یوې ذخیرې یا ټانکي د اوبو کچه د تامین لوړوالي نه پورته، یا د پمپ د بندښت سر. د پمپ یا بدلیدونکي-تامین منحني ټاکلو لپاره د تامین ټکي 2 او 3 اضافه کړئ؛ دغه وسیله سر د ډیزاین بهاو کې لولي.';
$ec_lang['bpn_elev_source']='د تامین لوړوالی';
$ec_lang['bpn_q_total']='ټول بهاو';
$ec_lang['bpn_q_total_tip']='هغه ټول بهاو چې له سرچینې خارجیږي (د شبکې د ټولو غوښتنو مجموعه).';
$ec_lang['bpn_p_min']='ترټولو ټیټ فشار';
$ec_lang['bpn_p_min_tip']='په ټوله شبکه کې هرچېرې ترټولو ټیټ ښکتنی فشار؛ حساس د رسولو ټکی.';
$ec_lang['bpn_method']='د اصطکاک طریقه';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='د پایپ کرښې';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='د دې پایپ کرښې نوم. نورې کرښې دې ته د پورتني ستون له لارې اشاره کوي.';
$ec_lang['bpn_upstream']='پورتنی ID';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='د هغې کرښې ID چې دې ته اوبه ورکوي. که خالي پریږدئ، سمدلاسه له خپلې پورتنۍ کرښې (ساده پرله‌پسې پایپ‌لاین) پیروي کوي. د بلې کرښې نه د څانګې جوړولو لپاره دلته یو ID ولیکئ.';
$ec_lang['bpn_roughness_tip']='د غوره شوې اصطکاک طریقې لپاره د پایپ خشونت: Manning n، Hazen-Williams C، یا Darcy-Weisbach د خشونت لوړوالی e (یوه اوږدوالی). عادي هوار پلاستیکي پایپ: n نږدې 0.009، C نږدې 150، e نږدې 0.0015 mm.';
$ec_lang['bpn_demand']='غوښتنه';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='هغه ثابت بهاو چې د دې کرښې په ښکتني پای کې رسول کیږي.';
$ec_lang['bpn_demand_mult']='د غوښتنې ضربوونکی';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='د ټولو کرښو غوښتنه په یوځل کې مقیاس کوي، د اوج ساعت یا راتلونکې ودې د چلولو لپاره. لکه چې ننوتل شوي دي هغسې غوښتنو لپاره 1 وکاروئ.';
$ec_lang['bpn_elev_down']='ښکتنی لوړوالی';
$ec_lang['bpn_q_line']='د کرښې بهاو';
$ec_lang['bpn_q_line_tip']='هغه ټول بهاو چې دا کرښه وړي: خپله غوښتنه به‌علاوه د هرې ښکتنۍ غوښتنې چې دا تغذیه کوي.';
$ec_lang['bpn_p_down']='ښکتنی فشار';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='د دې کرښې په ښکتني نوډ کې د ګیج فشار سر. منفي ارزښت (نښه شوی) د فضا لاندې فشار مانا لري؛ ډیزاین وګورئ.';
$ec_lang['bpn_sketch_heading']='د شبکې نقشه';
$ec_lang['bpn_source_label']='سرچینه';
$ec_lang['bpn_line_problem']='دا کرښه له سرچینې سره وصل نه ده: دا یو ناپیژندل شوی پورتنی ID ته اشاره کوي، ځان ته اشاره کوي، هغه ID بیا کاروي چې بله کرښه یې دمخه کاروي، یا حلقه جوړوي. هغه کرښې چې وصل نه دي پرته له حل پاتې کیږي.';
$ec_lang['bpn_bad_id_short']='ناسم ID';


$ec_lang['bpn_pressure_warn']='ټیټ/منفي فشار؛ د فضا لاندې شرایطو لپاره وګورئ';
$ec_lang['bpn_pressure_warn_short']='ټیټ';
$ec_lang['bpn_notes_1_term']='د اصل له مخې پرله‌پسې، د استثنا له مخې څانګه';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='که د پورتنۍ کرښې ID خالي پرېښودل شي، کرښه د خپلې پورتنۍ کرښې پیروي کوي لکه پرله‌پسې پایپ‌لاین. د څانګه کولو لپاره د پورتنۍ کرښې ID ولیکئ. ډیفالټ پرله‌پسې پایپ‌لاین دی؛ ونه یوازې هغه ځای جوړیږي چیرته چې څانګه ولیکل شي.';
$ec_lang['bpn_notes_2_term']='یوازې څانګه‌یزې شبکې، پرته له حلقو';
$ec_lang['bpn_notes_2_def']='هره کرښه دقیقاً یوه پورتنۍ کرښه لري (ونه). دا وسیله حلقه‌یي شبکې نه حلوي، چې تکراري میتودونه (EPANET یا ورته) غواړي. ځکه چې شبکه حلقې نه لري، حل مستقیم او دقیق دی.';
$ec_lang['bpn_notes_3_term']='پرته له فعالو د فشار کنترولونو';
$ec_lang['bpn_notes_3_def']='تاسو کولی شئ یو ثابت ځایی-ضیاع سوپاپ (یو k-ارزښت) اضافه کړئ، خو د فشار-کمولو یا فشار-ساتلو سوپاپونه (PRV/PSV) نه. د دوی د خلاصیدو/بندیدو حالت پر بهاو او فشار پورې اړه لري، کوم چې به تکرار اړین کړي.';


$ec_lang['bpn_supply2_q']='د تامین بهاو 2';
$ec_lang['bpn_supply2_h']='د تامین سر 2';
$ec_lang['bpn_supply3_q']='د تامین بهاو 3';
$ec_lang['bpn_supply3_h']='د تامین سر 3';
$ec_lang['bpn_supply_pt_tip']='اختیاري د تامین-منحني ټکي 2 او 3. د پمپ، یا د هرې داسې سرچینې چې د زیات تحویل سره یې سر ټیټیږي، نمونه جوړولو لپاره د هر یوه لپاره بهاو او سر ولیکئ؛ دغه وسیله د ډیزاین بهاو کې سر لولي. پورتنی ټکی 1 په صفر بهاو کې ثابت سر دی. د ثابت ذخیرې سر لپاره 2 او 3 خالي پریږدئ.';
$ec_lang['bpn_h_supply']='د تامین سر';
$ec_lang['bpn_h_supply_tip']='د ډیزاین بهاو کې د سرچینې سر، د تامین منحني نه لوستل شوی. کله چې منحني هواره وي (یوه ذخیره)، د لیکل شوي سرچینې سر سره برابر دی.';
$ec_lang['bpn_supply1_h']='د تامین ثابت سر';
$ec_lang['lpn_main_menu']='د اوبو رسونې شبکه';
$ec_lang['lpn_main_title']='د EPANET حل کوونکي سره وړیا آنلاین د اوبو ویش شبکې ماډلینګ';
$ec_lang['lpn_main_desc']='د اوبو رسونې شبکې تحلیل: د پایپونو حلقوي شبکه رسم کړئ یا د EPANET فایلونه دننه کړئ';
$ec_lang['lpn_title_units']='{units} واحدونه';
$ec_lang['lpn_tool_select']='ټاکل';
$ec_lang['lpn_tool_add_junction']='جنکشن';
$ec_lang['lpn_tool_add_reservoir']='ذخیره';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='ټانک';
$ec_lang['lpn_tool_add_pipe']='پایپ';
$ec_lang['lpn_tool_add_pump']='پمپ';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='والو';
$ec_lang['lpn_tool_add_text']='متن';
$ec_lang['lpn_tool_vertices']='ټکي';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='مشتری';
$ec_lang['lpn_tool_add_meter_tip']='د مشتري ټکی وټاکئ، بیا د هغه اتصال: یو تړاو یا نقطه. هغه غوښتنه چې مشتري ته یې ورکوئ د هغه تړاو نږدې سر کې نقطې ته اضافه کیږي.';
$ec_lang['lpn_mode_add_meter']='مشتری: وټاکئ چې مشتری چیرته دی، بیا هغه پایپ یا نقطه وټاکئ چې دا خدمتوي. یا د لغوه کولو لپاره Esc وکاروئ.';
$ec_lang['lpn_pane_tab_customers']='مشتریان';
$ec_lang['lpn_customer_heading']='مشتری {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='د هرې خدمت غوښتنه';
$ec_lang['lpn_field_meter_count']='د خدماتو شمېره';
$ec_lang['lpn_field_meter_total']='ټوله غوښتنه';
$ec_lang['lpn_field_meter_total_tip']='هغه ټولیز چې لاندې نومول شوي جنکشن ته اضافه کیږي.';
$ec_lang['lpn_field_meter_pipe']='نښلول شوې شتمنۍ';
$ec_lang['lpn_field_meter_pipe_suggest']='نږدې شتمنۍ {id} ده. دا دلته ولیکئ ترڅو دا مشتری له هغې نه خدمت واخلي.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='نښلول شوی له';
$ec_lang['lpn_field_meter_node_tip']='هغه جنکشن چې دا مشتری ورسره نښلول شوی دی. د نښلون ټکی یوه پایپ ته راکاږئ ترڅو پدې ځای د دې پایپ په اوږدو کې یوه سټیشن نه خدمت واخلي.';
$ec_lang['lpn_meter_pipe_unknown']='پدې پروژه کې هیڅ شی {id} نومول شوی نه دی، نو مشتری هلته پرېښودل شو چېرته چې و.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_meter_pattern_unknown']='پدې پروژه کې هیڅ نمونه {id} نومول شوې نه ده، نو مشتری هماغسې پرېښودل شو لکه چې و.';
$ec_lang['lpn_meter_placed']='مشتری {id} اضافه شو. د مشتریانو په جدول کې یې توضیح او غوښتنه ولیکئ، یا یې په ټاکل حالت کې وټاکئ ترڅو د ځانتیاوو بکس یې پرانیستل شي.';
$ec_lang['lpn_field_meter_pipe_tip']='هغه شتمنۍ چې دا خدمت ورسره نښلي. دا بدلولو لپاره دلته یا د مشتریانو جدول کې بله ولیکئ، یا د نښلون ټکی بلې شتمنۍ ته راکاږئ.';
$ec_lang['lpn_field_meter_station']='د پایپ په اوږدو کې ځای (%)';
$ec_lang['lpn_field_meter_station_tip']='د خدمت اتصال ته د پایپ په اوږدو کې واټن، د پایپ د لومړۍ نقطې نه دویمې ته د سلنې په توګه. 0 په یوه سر کې دی او 100 په بل کې. په پایپ کې دایره د پوینټر سره همدا کار کوي.';
$ec_lang['lpn_field_meter_offset']='د پایپ نه واټن';
$ec_lang['lpn_field_meter_offset_tip']='مثبت د پایپ ښي خوا ته دی کله چې د لومړۍ نقطې نه دویمې ته وګورئ. دلته ارزښت لیکل مشتری د اصلي نل بلې خوا ته ولیږدولی شي، او تل د خدمت کرښه د اصلي نل سره په قایمه زاویه کوي.';
$ec_lang['lpn_field_meter_lumped']='نقطې ته اضافه شوی';
$ec_lang['lpn_field_meter_lumped_tip']='نږدې نقطه؛ د دې مشتري غوښتنې هلته اضافه کیږي.';
$ec_lang['lpn_node_customers']='د مشتریانو غوښتنې';
$ec_lang['lpn_node_customers_tip']='د مشتریانو لیست چې دلته اضافه شوي ځکه چې دا د دوی تر ټولو نږدې نقطه وه. د مشتریانو غوښتنې دلته لیست شویو نورو غوښتنو سربېره دي. یو مشتری هلته سمون کیږي چیرته چې په نقشه کې ځای لري یا د مشتریانو په جدول کې.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} د {n} مشتریانو نه';
$ec_lang['lpn_customer_detached']='⚠ دا مشتری هیڅ پایپ سره نښلول شوی نه دی، نو د هغه غوښتنه پایلو کې نشته. یې ړنګ کړئ، یا یو پایپ راکاږئ او مشتری پرې ولیږئ.';
$ec_lang['lpn_customer_fixed_head']='⚠ د دې پایپ نږدې سر یو ثابت د اوبو سطح لري، نو دا غوښتنه پر سمولېشن اغیزه نه کوي.';
$ec_lang['lpn_customer_detached_count']='{n} مشتریان هیڅ پایپ سره نښلول شوي نه دي. د دوی غوښتنه نه ده شمېرل شوې.';
$ec_lang['lpn_meter_pick_pipe']='اوس هغه پایپ یا نقطه وټاکئ چې دا مشتری خدمتوي. مشتری هلته پاتې کیږي چیرته چې تاسو یې ایښی دی. د لغوه کولو لپاره Escape ووهئ.';
$ec_lang['lpn_inp_export_flat_customers']='د EPANET فایل مشتریان نه لري. په دې پروژه کې د {n} مشتریانو غوښتنه د غوښتنې قطار په توګه په هغه جنکشن کې لیکل کیږي چې هر مشتری ورته ټاکل شوی، د مشتري په ټاګ نومول شوی. فایل پخپله مشتری نه ثبتوي: د هغه ځای، هغه پایپ چې خدمت ورکوي، د هغه پایپ په اوږدو کې چیرته چې خدمت نښلي، یا څو خدمتونه استازیتوب کوي. دا معلومات په پروژه کې پاتې کیږي؛ د ساتلو لپاره د پروژې فایل وساتئ.';

$ec_lang['lpn_area_hint_window_start']='د کړکۍ یو کونج وټاکئ.';
$ec_lang['lpn_area_hint_window_go']='د بشپړولو لپاره مقابل کونج وټاکئ.';
$ec_lang['lpn_area_hint_lasso_start']='د محدودې د پیلولو لپاره یو ټکی وټاکئ.';
$ec_lang['lpn_area_hint_lasso_go']='د محدودې د رسمولو لپاره خوځئ. د بشپړولو لپاره وروستی ټکی وټاکئ.';
$ec_lang['lpn_area_hint_polygon_start']='د څو ضلعي ساحې لومړی کونج وټاکئ. د بشپړولو لپاره دوه ځله کلیک وکړئ.';
$ec_lang['lpn_area_hint_polygon_go']='هر کونج وټاکئ. د بشپړولو لپاره پر وروستي کونج دوه ځله کلیک وکړئ.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='د ټاکنې پر مهال Shift کیښئ ترڅو د موجوده ټاکنې سره دوام ورکړئ، هغه څه چې تاسو یې ټاکئ اضافه یا لرې (بدلول) کړئ.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='پر نقشه فشار ورکړئ او هغه څه چې غواړئ شاوخوا یې راکاږئ، بیا لاس پورته کړئ.';
$ec_lang['lpn_area_hint_touch_go']='هغه څه چې یې غواړئ شاوخوا یې راکاږئ، بیا د بشپړولو لپاره لاس پورته کړئ.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='دا وښایاست';
$ec_lang['lpn_multi_title']='{n} ټاکل شوي';
$ec_lang['lpn_multi_varies']='مختلف';
$ec_lang['lpn_multi_applied']='{prop} پر {n} کې تنظیم شو.';
$ec_lang['lpn_multi_no_fields']='دا دلته هیڅ داسې شی نلري چې یوځای تنظیم شي.';
$ec_lang['lpn_pane_pasted']='{n} حجرې پیسټ شوې. {skipped} یې بدلې نشوې.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='{n} قطارونه پیسټ شول او {created} یې شبکې ته اضافه شول.';
$ec_lang['lpn_pane_pasted_rows_skipped']='{n} قطارونه پیسټ شول او {created} یې شبکې ته اضافه شول. {skipped} حجرې نه دي بدلې شوي.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='دا ساحه وټاکئ او له سپریډشیټ نه قطارونه پیسټ کړئ ترڅو یې اضافه کړئ.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='د جدول په پای کې د نویو قطارونو په توګه پیسټ کول';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='د دې جدول لاندې د کاپي شویو قطارونو اضافه کولو لپاره Ctrl+V فشار کړئ. د لغوه کولو لپاره Esc فشار کړئ.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='دا پیسټ {n} قطارونه لري، او {fit} یې جدول کې ځای کیږي. نور {extra} د نویو قطارونو په توګه لاندې اضافه کړم؟';
$ec_lang['lpn_pane_paste_overflow_add']='{extra} قطارونه اضافه کړئ';
$ec_lang['lpn_pane_paste_overflow_fit']='یوازې هغه {fit} پیسټ کړئ چې ځای کیږي';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='دا پیسټ {n} قطارونه لري، او {fit} یې جدول کې ځای کیږي. نور {extra} د نویو قطارونو په توګه نشي اضافه کیدی: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} IDs سره سمون نه خوري. بیا هم پیسټ کړم؟';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='هیڅ شی پیسټ نشو. {reasons}';
$ec_lang['lpn_pane_paste_more']='هغه قطارونه چې ستونزې لري او دلته نه دي ښودل شوي: {n}.';
$ec_lang['lpn_pane_paste_no_id']='قطار {row}: یو نوي قطار ته ID اړینه ده.';
$ec_lang['lpn_pane_paste_bad_id']='قطار {row}: د ID {id} کې یو خالي ځای یا یو نقل کوما شتون لري.';
$ec_lang['lpn_pane_paste_id_taken']='قطار {row}: ID {id} دمخه کارول کیږي.';
$ec_lang['lpn_pane_paste_id_twice']='قطار {row}: ID {id} پدې پیسټ کې دوه ځلي کارول شوی دی.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='قطار {row}: یوې نوې نقطې ته دواړه {first} او {second} اړین دي.';
$ec_lang['lpn_pane_paste_no_ends']='قطار {row}: یو نوی تړاو ته د له نقطه او د تر نقطه اړینه ده.';
$ec_lang['lpn_pane_paste_no_node']='قطار {row}: نقطه {id} تر اوسه شتون نلري. لومړی خپلې نقطې پیسټ کړئ، بیا خپل تړاونه.';
$ec_lang['lpn_pane_paste_same_ends']='قطار {row}: له او تر یوه نقطه ده.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='قطار {row}: {text} یو سم {col} نه دی.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='قطار {row}: یو نوي متن ته دواړه {first} او {second} اړین دي.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='قطار {row}: {id} تر اوسه پدې شبکه کې نقطه یا پایپ نه دی. لومړی دا پیسټ کړئ، بیا دا متن.';
$ec_lang['lpn_pane_paste_customer_no_position']='قطار {row}: یو نوي مشتري ته دواړه {first} او {second} اړین دي.';
$ec_lang['lpn_pane_paste_no_customer_ref']='قطار {row}: یو نوي مشتري ته یو نښلول شوی پایپ یا نقطه اړینه ده.';
$ec_lang['lpn_pane_paste_no_pipe']='قطار {row}: پایپ {id} تر اوسه شتون نلري. لومړی خپل پایپونه پیسټ کړئ، بیا خپل مشتریان.';
$ec_lang['lpn_pane_paste_no_customer_node']='قطار {row}: نقطه {id} تر اوسه شتون نلري. لومړی خپل جنکشنونه پیسټ کړئ، بیا خپل مشتریان.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='قطار {row}: نقطه {id} هیڅ پایپ نلري چې مشتری پرې ونښلول شي.';


$ec_lang['lpn_pane_filled']='{n} حجرې ښکته ډکې شوې. {skipped} یې نه دي بدلې شوي.';
$ec_lang['lpn_pane_filldown']='ښکته ډکول';
$ec_lang['lpn_pane_fill_none']='پدې ټاکنه کې هیڅ شی نشي ښکته ډکیدی.';
$ec_lang['lpn_pane_ctrlenter_filled']='{n} حجرې ډکې شوې. {skipped} یې نه دي بدلې شوي.';
$ec_lang['lpn_pane_hide_col']='دا کالم پټ کړئ';
$ec_lang['lpn_pane_hide_cols']='دا کالمونه پټ کړئ';
$ec_lang['lpn_pane_show_all_cols']='ټول کالمونه ښکاره کړئ';
$ec_lang['lpn_pane_sort_asc']='لوړېدونکی ترتیب';
$ec_lang['lpn_pane_manage_cols']='کالمونه اداره کول…';
$ec_lang['lpn_pane_manage_cols_title']='کالمونه اداره کول';
$ec_lang['lpn_pane_manage_cols_show']='ښودل';
$ec_lang['lpn_pane_manage_cols_up']='پورته یوسئ';
$ec_lang['lpn_pane_manage_cols_down']='ښکته یوسئ';
$ec_lang['lpn_pane_manage_cols_top']='پیل ته یوسئ';
$ec_lang['lpn_pane_manage_cols_bottom']='پای ته یوسئ';
$ec_lang['lpn_pane_colmenu_tip']='کالمونه پټ یا اداره کړئ';
$ec_lang['lpn_tool_area_window']='یوه کړکۍ وټاکئ';
$ec_lang['lpn_tool_area_lasso']='یو لاسو وټاکئ';
$ec_lang['lpn_tool_area_polygon']='یو څو ضلعی وټاکئ';
$ec_lang['lpn_tool_delete']='ړنګول';
$ec_lang['lpn_tool_zoom_extent']='بشپړ نندارې ته زوم';
$ec_lang['lpn_tool_zoom_window']='د زوم کړکۍ';
$ec_lang['lpn_zoom_in']='زیات زوم';
$ec_lang['lpn_zoom_out']='کم زوم';
$ec_lang['lpn_new_text']='متن';
$ec_lang['lpn_field_text_bold']='ډب متن';
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
$ec_lang['lpn_field_text_anchor']='نښلول شوی له';
$ec_lang['lpn_field_text_align']='افقي تنظیم';
$ec_lang['lpn_field_text_align_left']='کیڼ';
$ec_lang['lpn_field_text_align_center']='منځ';
$ec_lang['lpn_field_text_align_right']='ښي';
$ec_lang['lpn_field_text_valign']='عمودي تنظیم';
$ec_lang['lpn_field_text_valign_top']='پورتنی';
$ec_lang['lpn_field_text_valign_middle']='منځنی';
$ec_lang['lpn_field_text_valign_bottom']='لاندنی';
$ec_lang['lpn_field_text_rotation']='زاویه (درجې)';
$ec_lang['lpn_field_text_match_pipe']='د نږدې تړاو زاویې ته واړول';
$ec_lang['lpn_field_text_flip']='180° واړول';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='نښلول شوی عنصر';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='دا لیکنه یوې شتمنۍ ته دومره نږدې ایښودل شوې چې تعقیب یې کوي، نو له هغې شتمنۍ سره حرکت کوي او یوه لارښوونکې کرښه لري. په لارښوونکې کرښه کې لیکنه خپل افقي او عمودي تنظیم د هغې خوا نه اخلي چې پرې ناسته ده، نو له همدې امله دا دوه کرښې نه وړاندې کیږي کله چې نښلول شوې وي.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='د اخراج کوفیشنټ';
$ec_lang['lpn_field_emitter_tip']='یو زیاتی بهیدونکی اخراج چې فشار پورې اړه لري، د سپرېنکلر، پرانیستي وتلي ځای، یا د ماډل شوي بهیدو لپاره. هغه بهاو چې دا خوشې کوي دا کوفیشنټ ضرب په فشار چې د اخراج اکسپوننټ ته لوړ شوی وي، چې یوځل د ټولې شبکې لپاره د تنظیمات، محاسبه، هایدرولیک لاندې ټاکل کیږي. په یوه عادي جنکشن باندې دا خالي پریږدئ.';
$ec_lang['lpn_field_elev']='لوړوالی';
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
$ec_lang['lpn_field_head']='هیډ';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='د ذخیرې کې د اوبو د سطحې کچه، د لوړوالي په توګه اندازه شوې، نه د فشار په توګه. یې خالي پریږدئ ترڅو د اوبو سطحه د ذخیرې لوړوالي ته وضع شي.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='د ټانک د تل لوړوالی. د ټانک دننه د اوبو ژوروالی له همدې ځایه پورته اندازه کیږي.';
$ec_lang['lpn_field_tank_level']='د اوبو ژوروالی';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='د ټانک دننه د ولاړو اوبو ژوروالی، د ټانک له تله پورته اندازه شوی. د اوبو سطحه د ټانک د تل لوړوالی او دې ژوروالي مجموعه ده.';
$ec_lang['lpn_field_tank_minlevel']='د اوبو ترټولو ټیټ ژوروالی';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='هغه د اوبو ژوروالی چې پرې ټانک تش ګڼل کیږي، د ټانک له تله پورته اندازه شوی.';
$ec_lang['lpn_field_tank_maxlevel']='د اوبو ترټولو لوړ ژوروالی';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='هغه د اوبو ژوروالی چې پرې ټانک ډک ګڼل کیږي، د ټانک له تله پورته اندازه شوی.';
$ec_lang['lpn_field_tank_diameter']='د ټانک قطر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='د ټانک پلنوالی، له یوې غاړې بلې ته. دا د لوړوالي په واحدونو کې دی، نه د پایپ د قطر په واحدونو کې. دا ټاکي چې یو ورکړل شوی ژوروالی څومره اوبه ساتي.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='د ټانک دننه د اوبو د سطحې لوړوالی: د ټانک د تل لوړوالی او د اوبو ژوروالی سره یوځای. حل کوونکی همدا کچه د ټانک لپاره کاروي.';
$ec_lang['lpn_close']='بندول';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='ځانتیاوې';
$ec_lang['lpn_empty_hint']='د فایل، نوی پروژه وکاروئ ترڅو یوه بېلګه پرانیزئ. یا د اوزارپټې نه ذخیره، جنکشن، او پایپ اضافه کولو سره پیل وکړئ.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='ستاسو شبکه بشپړه ده.';
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
$ec_lang['lpn_examples_welcome']='د اوبو د تامین شبکې ماډل جوړونې ته ښه راغلاست، د EPANET حل کوونکي سره';
$ec_lang['lpn_examples_heading']='د یوې بېلګې خپله کاپي پرانیزئ';
$ec_lang['lpn_examples_sub']='هره بېلګه د کاپي په توګه پرانیستل کیږي. سمه یې کړئ او وساتئ یې، یا بیا پیلولو لپاره نوې کاپي پرانیزئ.';
$ec_lang['lpn_examples_open']='پرانیستل';
$ec_lang['lpn_examples_menu']='بېلګه پرانیستل…';
$ec_lang['lpn_examples_blank']='یا دلته پیل وکړئ';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='نقطې: {nodes}، تړاوونه: {links}';
$ec_lang['lpn_examples_failed']='بېلګې نشوې پورته کیدی. فایل، نوی پروژه وکاروئ ترڅو یو رسم پیل کړئ.';
$ec_lang['lpn_examples_loading']='بېلګې پورته کیږي…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='یو شی سم کړئ';
$ec_lang['lpn_help_notes']='د دې پاڼې یادښتونه';
$ec_lang['lpn_help_hotkeys']='جدولونه او ګړندي کلیدونه';
$ec_lang['lpn_hotkeys_tables_heading']='جدولونه';
$ec_lang['lpn_hotkeys_map_heading']='نقشه';
$ec_lang['lpn_hotkeys_map_term']='د نقشې د کیبورډ شارټکټونه';
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>1 یا Esc</td><td>ټاکل.</td></tr><tr><td>2</td><td>یو جنکشن زیاتول.</td></tr><tr><td>3</td><td>یو ذخیره زیاتول.</td></tr><tr><td>4</td><td>یو ټانک زیاتول.</td></tr><tr><td>5</td><td>یو پایپ زیاتول.</td></tr><tr><td>6</td><td>یو پمپ زیاتول.</td></tr><tr><td>7</td><td>یو والو زیاتول.</td></tr><tr><td>8</td><td>یو پیرودونکی زیاتول.</td></tr><tr><td>9</td><td>متن زیاتول.</td></tr><tr><td>Delete</td><td>ټاکنه ړنګول.</td></tr><tr><td>Ctrl+Z</td><td>وروستی بدلون بیرته کول.</td></tr><tr><td>+ یا =</td><td>لوی کول.</td></tr><tr><td>-</td><td>کوچنی کول.</td></tr></tbody></table>';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='دلته یو شی غلط دی؟';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='په دې پاڼه کې یوه تېروتنه راپور کړئ. دا یو بکس پرانیزي چې ستونزه وټاکئ، نظر اضافه کړئ، او که ځواب غواړئ بریښنالیک پته ولیکئ. ټولې ساحې اختیاري دي، او تر هغه چې لیږل نه وي فشار شوي هیڅ شی نه لیږل کیږي.';
$ec_lang['lpn_wrong_thanks']='مننه. دا موږ ته ورسیده.';
$ec_lang['lpn_status_example_opened']='{name} د کاپي په توګه پرانیستل شو. د File, Save as سره یې وساتئ.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='دې پاڼې د رسمولو ساحې اندازه معلومه نکړه، نو نقشه هغه وروستی لید ښیي چې دا یې محاسبه کولی شوه. د کړکۍ اندازه بدلول اندازه کول بیا تکراروي. که دا دوام وکړي، معمولاً لامل یو براوزر توسیع دی چې د پاڼې اندازه اخیستنه بندوي.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='بنسټیزه شبکه، L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='له دې نه پیل وکړئ. یوه ذخیره، یو پمپ، او یوه کوچنۍ حلقه: تر ټولو کوچنۍ تشکیله چې لاهم د اوبو د شبکې په توګه کار کوي. لیټر په ثانیه کې، له متره او ملي متره سره.';
$ec_lang['lpn_ex_basic_us_title']='بنسټیزه شبکه، gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='هماغه پیل کوونکې شبکه په ګالنو په دقیقه کې، له فوټه او انچه سره.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 د قاعدې پر بنسټ کنترولونو سره';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='د EPANET له درې بېلګه شبکو تر ټولو کوچنۍ: یوه ذخیره، یو پمپ، او یوه یوازینۍ حلقه.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='یوه څانګه‌یزه ویش شبکه له یو ټانک سره، د EPANET له بېلګو نه.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='د EPANET لویه بېلګه: 92 جنکشنونه، درې ټانکونه، او دوې ذخیرې، چې یوه یې سیند دی. دا ښیي چې یو بشپړ اندازې ماډل په نقشه کې څنګه ښکاري.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='د EPANET Net3 شبکه چې د Novato, CA ښار عرض او طول البلد ته بدله شوې، او د نړۍ نقشه یې شاليد کې ده.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='یو سوداګریز ځای چې د اعظمي ورځنۍ غوښتنې له پاسه د اور د وژلو بهاو لپاره، په یوه شیبه کې، د ساحې د نقشې له پاسه رسم شوی حل شوی دی.';
$ec_lang['lpn_tool_undo']='بېرته';
$ec_lang['lpn_confirm_example']='دا بېلګه ستاسو موجوده شبکې ته اضافه کوي. دوام ورکړئ؟';
$ec_lang['lpn_field_diameter']='قطر';
$ec_lang['lpn_demand_tip']='هغه بهاوونه چې پدې نقطه کې د شبکې نه ایستل کیږي. یوه منفي شمېره ولیکئ د هغه بهاو لپاره چې دلته شبکې ته ننوځي.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='دا واحد ټاکي چې ستاسو ننوتنې څه معنی لري';
$ec_lang['lpn_units_warn_lead']='{unit} د هغه څه واحد دی چې تاسو یې دلته لیکئ:';
$ec_lang['lpn_units_options_head']='کله چې تاسو یو واحد بدلوئ:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='غیر ورانوونکی';
$ec_lang['lpn_units_nondestructive_desc']='غیر ورانوونکی: هر ننوت په خپل حال پرېږدي او یې په نوي واحد کې بیا تفسیروي.';
$ec_lang['lpn_units_destructive']='ورانوونکی';
$ec_lang['lpn_units_destructive_desc']='ورانوونکی: هر ننوت د یو ریاضیکي بدلون سره بیا لیکي، ترڅو شبکه فزیکي پلوه نږدې همغه پاتې شي، د بدلون د زغم په کچه. دا اصلي ننوتونه له لاسه ورکوي. بېرته راګرځول (Undo) یې بېرته راولي.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n} ارزښتونه اوس {unit} معنی لري. هیڅ شی بیا لیکل شوی نه دی.';
$ec_lang['lpn_status_converted']='{n} ارزښتونه {unit} ته بدل شول.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='اوږدوالی';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='د نقشې همغږۍ';
$ec_lang['lpn_units_mapcoords_deg']='درجې';
$ec_lang['lpn_units_usft']='د امریکا سروے فوټ';
$ec_lang['lpn_units_elevhead']='لوړوالی او هیډ';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='د سر ضیاع تدریج';
$ec_lang['lpn_result_gradient_tip']='د سر ضیاع د پایپ اوږدوالي باندې ویشل شوی. یې د بېلابېلو اوږدوالو د پایپونو د یو ډیزاین حد سره پرتله کولو لپاره وکاروئ.';
$ec_lang['lpn_result_water_age']='د اوبو عمر';
$ec_lang['lpn_result_water_age_tip']='هغه وخت چې دې ټکي ته رسیدونکې اوبو په سیسټم کې تیر کړی. چیرته چې بهاوونه سره یوځای کیږي، شمېره د راتلونکو عمرونو اوسط دی، د بهاو په وزن. په ټانک کې دا د ساتل شویو اوبو اوسط عمر دی، نو ټانک چې ورو بدلیږي معمولاً په شبکه کې زړې اوبه لري. د پرتلې لپاره هیڅ مقرراتي حد نشته، نو دا د ماډل کیدونکي سیسټم له شرایطو سره وارزوئ.';
$ec_lang['lpn_result_source_share']='د سرچینې برخه';
$ec_lang['lpn_result_source_share_tip']='هغه ونډه د اوبو چې دې ټکي ته رسیږي او د رهیابي نقطې نه راغلې ده. دا هغه څه دي چې د سرچینې رهیابي شننه یې راپور کوي.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='د اوبو منځنۍ عمر';
$ec_lang['lpn_result_avg_source_share']='منځنۍ سرچینه برخه';
$ec_lang['lpn_result_avg_concentration']='منځنۍ غلظت';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='د اصطکاک فاکتور';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='د تعامل کچه';
$ec_lang['lpn_result_status']='حالت';
$ec_lang['lpn_result_status_open']='خلاص';
$ec_lang['lpn_result_status_closed']='تړلی';
$ec_lang['lpn_result_head']='هیډ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='په دې نقطه کې د اوبو پوټنشیل انرژي، د اوبو د ستن د لوړوالي په توګه لیکل شوې. دا مطلق لوړوالی دی، پداسې حال کې چې فشار د ګیج اندازه ده.';
$ec_lang['lpn_result_pressure']='فشار';
$ec_lang['lpn_result_flow']='بهاو';
$ec_lang['lpn_result_velocity']='سرعت';
$ec_lang['lpn_result_headloss']='د سر ضیاع';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='یوازې د دې پروژې ټاکنې بېرته ټاکئ. انځور او نورې پروژې نه بدلیږي. د ټاکنو د یوې ټولګې بیا کارولو لپاره، یو پروژه فایل وساتئ چې یوازې ټاکنې لري.';
$ec_lang['lpn_reset_all_tip']='هره پروژه، هر شاليد انځور، هره ټاکنه، او ستاسو د واحدونو انتخابونه ړنګ کړئ، بیا پاڼه بیا بار کړئ لکه یو لومړی ځل لیدونکی چې ویني. دا یوازینی بیا ټاکل دی چې هرڅه پاکوي.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='دا محاسبګر د پروژې واحدونه او ننوتنې لکه دننه شوي ساتي، خو مخکې یې شمېرې د ساتلو لپاره SI ته اړولې. دا پروژه له دې بدلون نه مخکې ساتل شوې وه، نو د هغې شمېرې په SI کې ساتل شوې وې. دا اوس د اوسنیو واحدونو ته وروستی ځل واړوو؟ ترڅو تاسو وکولی شئ قضاوت وکړئ، دلته یو څو قطرونه دي چې به واړول شي، د خپلو بدلون نه مخکې او وروسته ارزښتونو سره:';
$ec_lang['lpn_v2_restore_yes']='واړوئ';
$ec_lang['lpn_v2_restore_never']='نه. بیا هیڅکله مه پوښتئ.';
$ec_lang['lpn_v2_restore_no']='بندول ترڅو زه لومړی اوسني واحدونه وګورم';
$ec_lang['lpn_storage_too_new']='دا پروژه د پاڼې د یوې نوې بڼې لخوا ساتل شوې وه، نو دلته نشي پرانیستل کیدی.';
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
$ec_lang['lpn_tool_file']='فایل';
$ec_lang['lpn_menu_edit']='سمون';
$ec_lang['lpn_menu_insert']='ننویستل';
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
$ec_lang['lpn_menu_map']='نقشه';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='د سړک نقشه ښودل';
$ec_lang['lpn_basemap_satellite_show']='د سپوږمیز انځورونه ښکاره کړئ';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='جغرافیایي';
$ec_lang['lpn_xymap']='ځایی';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='داسې بدلول…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='د {name} کاپي';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='داسې بدلول';
$ec_lang['lpn_convas_coordsys_tip']='هغه همغږۍ سیسټم چې کاپي ورته بدلیږي. کله چې دا له دې پروژې سره توپیر ولري، دوه د ځای ورکولو ګامونه پسې راځي. هغه پروژه چې لا دمخه جغرافیوي شوې ده، دواړه ګامونه بشپړ پرانیزي، چمتو دي چې ومنل شي یا بدل شي.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='اوسنی: {crs}';
$ec_lang['lpn_convas_epsg']='د EPSG همغږۍ سیسټم';
$ec_lang['lpn_convas_epsg_tip']='د EPSG راجستر نه یو همغږۍ سیسټم وټاکئ. WGS 84 (EPSG:4326)، عرض البلد او طول البلد، وړاندیز شوې انتخاب دی. WGS 84 / Pseudo-Mercator (EPSG:3857)، چې عموماً Web Mercator بلل کیږي، x او y په مترو کې ورکوي، او د هغه د نقشې واټنونه له استوا څخه لیرې له ځمکنیو واټنونو څخه زیات دي. د پایپ اوږدوالی په دواړو سیسټمونو کې د ځمکې واټن په توګه محاسبه کیږي.';
$ec_lang['lpn_convas_unnamed']='بې نومه (ځایی) جغرافیایي حواله';
$ec_lang['lpn_convas_unnamed_tip']='ځایی همغږۍ د اوږدوالي واحد کې، د نړۍ نقشه ورسره نښلول شوې.';
$ec_lang['lpn_convas_none_tip']='ځایی همغږۍ د اوږدوالي واحد کې، اوس مهال بې د نړۍ نقشې.';
$ec_lang['lpn_convas_units_tip']='هغه واحدونه چې کاپي ورته بدلیږي.';
$ec_lang['lpn_convas_round']='بدل شوي ارزښتونه ګرد کول';
$ec_lang['lpn_convas_round_tip']='هغه ګام چې ګرد ته یې کوي، یوازې هغو شمېرو ته پلي کیږي چې دا بدلون یې بیا لیکي. هغه ارزښتونه چې واحد یې نه بدلیږي لکه چې دي پرېښودل کیږي.';
$ec_lang['lpn_convas_round_none']='هیڅ ګردول نشته';
$ec_lang['lpn_convas_round_flow']='غوښتنه او بهاو';
$ec_lang['lpn_convas_label_col']='پسوند';
$ec_lang['lpn_convas_label_tip']='هغه متن چې د کاپي د نقشې لیبلونو کې دې ارزښت وروسته اضافه کیږي، لکه \' mm\' یا \' gpm\'. پورته له ټاکل شوي واحد نه دمخه ډک شوی؛ د پسوند نه لرلو لپاره یې پاک کړئ.';
$ec_lang['lpn_convas_oneway']='بېرته بدلول یو دویم بدلون دی، نه یو بېرته اخیستل. یوه شمېره چې بدله شي او بېرته بدله شي ممکن دقیقاً هماغسې بېرته را نه شي لکه چې لیکل شوې وه.';
$ec_lang['lpn_convas_ok']='بدلول';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} یو له هغو لږو لیست شویو همغږۍ سیسټمونو نه دی چې د کارونې وړ پروجیکشن معلومات نلري، نو دا نشي کولی ورته یا نه بدل شي. هیڅ شی نه دی بدل شوی.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='بدله شوې کاپي {name} ده. اصلي پروژه بې بدلونه ده.';
$ec_lang['lpn_convas_cancelled']='هیڅ شی نه دی بدل شوی. کاپي بنده ده، او اصلي پروژه بې بدلونه ده.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='دا پروژه نوي ټب ته کاپي کړئ او کاپي هغه همغږۍ سیسټم او واحدونو ته بدله کړئ چې تاسو یې غوره کوئ. کله چې همغږۍ سیسټم بدلیږي، یو لارښود تاسو ته د خپلې شبکې شاته نقشه نږدې زوم کولو، بیا ستاسو شبکه پر نقشه ډیر نږدې توګه پیمانه کولو او ګرځولو کې لارښوونه کوي. دا پروژه دقیقاً لکه څنګه چې ده پاتې کیږي. د هیڅ شي بدلولو پرته جغرافیوي کولو لپاره، پر ځای یې Map، World map، Attach وکاروئ.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='دا پروژه دمخه جغرافیایي حواله شوې ده، نو شبکه دمخه پر نقشه ده او هیڅ شی نه دی خوځول شوی. وګورئ چې پر سم ځای کې ده، بیا د ماډل دلته کیږدئ تڼۍ او د دا ځای وساتم تڼۍ فشار کړئ.';
$ec_lang['lpn_georef_intro']='د ماډل ځای پر ځای کول دوه ګامونه لري. ګام 1 نږدې دی: ماډل په سکرین کې ثابت پاتې کیږي پداسې حال کې چې تاسو د هغه شاته نقشه خوځوئ او زوم کوئ، تر هغه چې سایټ د ماډل لاندې شاوخوا سمې پیمانې کې وي. په دې ګام کې ګرځېدنه نشته. ګام 2 دقیق دی: پخپله ماډل راکاږئ، اندازه یې بدل کړئ، او وګرځوئ. پروژه د ټولې نړۍ پر نقشه پیلیږي، نو لومړی ځای ومومئ، بیا د ماډل دلته کیږدئ تڼۍ ووهئ.';
$ec_lang['lpn_georef_adjust']='ماډل اوس نقشې سره تړلی دی، نو له نقشې سره خوځي. ماډل د خوځولو لپاره راکاږئ، د اندازې بدلولو لپاره یو کونج راکاږئ، یا د ګرځولو لپاره د ماډل پورته ګردې لاستی راکاږئ. یا لاندې د ځمکې واټن او د ګرځېدنې زاویه ولیکئ.';
$ec_lang['lpn_georef_step1']='ګام 1 د 2 نه — چټک';
$ec_lang['lpn_georef_step2']='ګام 2 د 2 نه — دقیق';
$ec_lang['lpn_georef_step1_hint']='پروژه په سکرین کې ثابته پاتې کیږي. لاندې نقشه خوځوئ او زوم کړئ تر هغه چې نقشه شاوخوا سم ځای په شاوخوا سمې پیمانې ښیي، بیا د ماډل دلته کیږدئ تڼۍ ووهئ.';
$ec_lang['lpn_georef_detach']='بیا یې راپورته کول';
$ec_lang['lpn_georef_size_prompt']='ساحه، د ټولې پروژې په اوږدو کې، شاوخوا څومره پلنه ده؟';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name} — {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='لنډلار: {key} فشار کړئ.';
$ec_lang['lpn_tool_key_hint_two']='لنډلاره: {key} یا {key2} فشار ورکړئ.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='په سکرین کې لارښوونې تعقیب کړئ. د کړکۍ، لاسو، او څو ضلعي ترمنځ د بدلولو لپاره بیا ووهئ. د اوسنۍ ټاکنې ساتلو لپاره Shift ونیسئ او هغه څه چې ټاکئ یې اضافه یا لرې (بدل) کړئ.';
$ec_lang['lpn_area_selected']='{n} ټاکل شول.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='په دې ساحه کې هیڅ ونه موندل شول.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='د پایپ قلمي نقطې اضافه او لرې کړئ. د قلمي نقطې د اضافه کولو لپاره پر پایپ یو ټکی وټاکئ، د لرې کولو لپاره قلمي نقطه وټاکئ، او د خوځولو لپاره یې راکاږئ. قلمي نقطه خپلکاره اوږدوالی بدلوي، خو ځایی (کوچنۍ) ضیاع نه زیاتوي یا نه بدلوي.';
$ec_lang['lpn_tool_undo_tip']='د بېرته کولو تاریخچې اوږدوالی = 20 کړنې';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='ټوله شبکه د نقشې کړکۍ ته برابره کړئ. د زوم کړکۍ لپاره بیا ووهئ. پورته ښي لور د نقشې زوم کنټرولونه هم وګورئ.';
$ec_lang['lpn_tool_zoom_window_tip']='کونجونه وټاکئ یا یو مستطیل راکاږئ. د برابرولو زوم لپاره بیا ووهئ.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='زوم زیات کړئ. لنډلار: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='زوم کم کړئ. لنډلار: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='ساده یا پیچلی لټون او بدلول';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='د ټول‌بار آیکونونه';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='لیدنه';
$ec_lang['lpn_color_legend_open_tip']='د رنګ کولو تنظیمات پرانیستلو او دا رنګونه بدلولو لپاره یې وټاکئ.';
$ec_lang['lpn_color_node_field']='نقطې د دې له مخې رنګه کول';
$ec_lang['lpn_color_link_field']='پایپونه د دې له مخې رنګه کول';
$ec_lang['lpn_color_ramp_sequential']='ترتیبي';
$ec_lang['lpn_color_ramp_diverging']='دوه اړخیزه';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='د دائرو شمېر';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='د دائرو ویش';
$ec_lang['lpn_color_ranges_note']='لاندې پولې یو ځل چې وټاکل شي ثابتې پاتې کیږي؛ د پایلو له بدلون سره یې نه بدلیږي. پورته د معلوماتو د طبقه‌بندۍ طریقې ټاکل، پولې د سیسټم له اوسني حالت نه ټاکي. که تاسو کومه ارزښت په لاس بدل کړئ، پورتنۍ طریقه لاسي کیږي.';
$ec_lang['lpn_color_criterion_note']='دا طریقه خپلې پولې د یوه ډیزاین معیار نه اخلي، نو تر هغه وخته چې دا طریقه ټاکل شوې وي، د رنګونو شمېر ثابت پاتې کیږي.';
$ec_lang['lpn_color_break_number']='یوه پوله باید یوه شمېره وي. نقشه نه ده بدله شوې.';
$ec_lang['lpn_color_break_order']='هره پوله باید له خپلې مخکینۍ نه لویه وي. نقشه نه ده بدله شوې.';
$ec_lang['lpn_color_break_count']='باید د رنګونو شمېر نه یوه پوله کمه وي. نقشه نه ده بدله شوې.';
$ec_lang['lpn_color_ramp_qualitative']='ډولیز';
$ec_lang['lpn_color_ramp_rainbow']='رنګین‌کمان';
$ec_lang['lpn_color_ramp_rainbow_eg']='د EPANET سره سمون لري';
$ec_lang['lpn_color_example_material']='مواد';
$ec_lang['lpn_color_ramp_ylgnbu']='ژېړ نه شین ته';
$ec_lang['lpn_color_ramp_rdylbu']='سور نه شین ته، د ژېړ له لارې';
$ec_lang['lpn_georef_drop']='ماډل دلته کیږدئ';
$ec_lang['lpn_georef_finish']='دا ځای وساتم';
$ec_lang['lpn_georef_scale']='د رسم د هرې واحد لپاره د ځمکې واټن';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='په خپلکاره توګه محاسبه شوی. د بدلولو لپاره سمون کړئ. 1 ولیکئ ترڅو د فایل همغږي بې بدلونه د ځمکې واټن په توګه وکارول شي، د بېلګې په توګه د هغه فایل لپاره چې همغږۍ سیسټم نه لري.';
$ec_lang['lpn_georef_rotation']='ضدساعتي لوري ته ګرځول (درجې)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='د ټول ماډل ضدساعتي ګرځېدنه، ترڅو د نوي همغږۍ سیسټم سره برابر شي.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='ماډل دلته د تل لپاره کیښودل شي؟ شتمنۍ لا هم وروسته یو په یو راکاږل کیدی شي، خو اوس دوام ټول همغږي په یو وخت بدلوي. د زړو همغږو بېرته ترلاسه کولو لپاره، اصلي پروژې ته ورګرځئ او دا یوه پرته له ساتلو بنده کړئ.';
$ec_lang['lpn_georef_done']='دا اوس یوه lat/lon پروژه ده. هر عنصر راکاږئ ترڅو یې هغه ځای ته نږدې کړئ چېرته چې حقیقتاً دی.';
$ec_lang['lpn_georef_backdrop_unrotated']='شاليد انځور د ماډل سره یوځای وخوځول شو او د هغه اندازه بدله شوه، خو نشو رغولی. د سمولو لپاره نقشه، شاليد انځور، لیږدول وکاروئ.';
$ec_lang['lpn_georef_empty']='هغه فایل هیڅ شبکه نلري، نو د کیښودو لپاره هیڅ شی نشته.';
$ec_lang['lpn_georef_unavailable']='د ځای‌ایښودنې وسیله نه ده پورته شوې. پاڼه بیا پورته کړئ او بیا هڅه وکړئ.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='مخکې له دې چې پروژې بدلې کړئ، بدلون د "دا ځای پر ځای کول وساتئ" تڼۍ سره پای ته ورسوئ، یا Cancel ووهئ. ځای پر ځای کول یوازې دې پروژې ته پلي کیږي.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='ذخیره کولو نه مخکې "دا ځای پر ځای کول وساتئ" تڼۍ سره کار پای ته ورسوئ، یا لغوه فشار ورکړئ. پروژه لا هم ځای پر ځای کیږي، نو هغه څه چې په سکرین کې دي لا تر اوسه هغه نه دي چې فایل ته به لیکل شي.';
$ec_lang['lpn_goto_menu']='یوه عرض البلد او طول البلد ته ورځئ…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_prompt']='عرض البلد او طول البلد، پدې ترتیب';
$ec_lang['lpn_goto_bad']='دا یو عرض البلد او یو طول البلد نه دی. 38 -122 هڅه وکړئ، د یوې تشې سره.';
$ec_lang['lpn_georef_goto']='ورځئ ته…';
$ec_lang['lpn_georef_twopt']='دوه پیژندل شوي نقطې وکاروئ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='ماډل په دقیقه توګه ځای پر ځای کړئ کله چې په رسم کې د دوو نقطو ریښتینی عرض البلد او طول البلد معلوم وي. یوه یې وټاکئ، عرض البلد او طول البلد یې ولیکئ، بیا د دویمې نقطې لپاره هم همداسې وکړئ. ځای، پیمانه، او ګرځېدنه له دغو دوو نقطو محاسبه کیږي. د لغوه کولو لپاره بیا ووهئ، یا Esc ووهئ.';
$ec_lang['lpn_georef_twopt_pick1']='په خپل رسم کې یوه نقطه وټاکئ چې عرض البلد او طول البلد یې پیژنئ.';
$ec_lang['lpn_georef_twopt_pick2']='اوس یوه دویمه پیژندل شوې نقطه وټاکئ، تر هغه چې کولی شئ له لومړۍ نه لرې.';
$ec_lang['lpn_georef_twopt_same']='دا هماغه نقطه ده چې تاسو لومړی ټاکلې وه. یوه بله وټاکئ.';
$ec_lang['lpn_georef_twopt_done']='ماډل اوس پر هغو دوو نقطو ځای پر ځای شو چې ولیکل شوې. یې وګورئ، بیا د دا ځای پر ځای کول وساتئ تڼۍ ووهئ.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='لاندنی پینل';
$ec_lang['lpn_pane_toggle_tip']='د نقشې لاندې پینل ښکاره یا پټ کړئ. دا د هر ډول شتمنۍ لپاره ګرافونه او یو جدول لري.';
$ec_lang['lpn_pane_resize']='راکاږئ ترڅو پینل اوږد یا لنډ کړئ';
$ec_lang['lpn_pane_tab_junctions']='جنکشنونه';
$ec_lang['lpn_pane_tab_reservoirs']='ذخیرې';
$ec_lang['lpn_pane_tab_tanks']='ټانکونه';
$ec_lang['lpn_pane_tab_pipes']='پایپونه';
$ec_lang['lpn_pane_tab_pumps']='پمپونه';
$ec_lang['lpn_pane_tab_valves']='والوونه';
$ec_lang['lpn_pane_tab_tip']='شتمنۍ د سپریډشیټ په څیر جدول کې سمون کړئ. د پایلو کالمونه نشي سمیدی. د کیبورډ شارټکټونو لپاره Help, Notes وګورئ.';
$ec_lang['lpn_pane_none']='دا شبکه تر اوسه لدې نه هیڅ یو نلري.';
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
$ec_lang['lpn_pane_text_attached']='نښلول شوی';
$ec_lang['lpn_pane_not_used']='نه کارول شوی';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='د {q} له مخې فلټر شوی. {n} د {all} نه ښودل کیږي.';
$ec_lang['lpn_pane_filter_clear']='ټول وښایاست';
$ec_lang['lpn_pane_filter_stale']='هغه قطارونه چې نور نه سمون خوري: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='په دې جدول کې هیڅ شی له فلټر سره سمون نه خوري.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='زوم او ټاکل';
$ec_lang['lpn_goto_on_map']='پر نقشه ښودل';
$ec_lang['lpn_pane_select_on_map']='پر نقشه ټاکل';
$ec_lang['lpn_pane_unselect_on_map']='پر نقشه له ټاکنې ایستل';
$ec_lang['lpn_pane_print']='جدول چاپ کړئ';

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
$ec_lang['lpn_menu_project']='اوبه';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='د اوبو د شبکې ماډل جوړولو لپاره ځانګړی هرڅه (پرته له متحرکو انځورو د چلولو کنټرولونو)';
$ec_lang['lpn_tables_menu']='جدولونه';
$ec_lang['lpn_tables_menu_tip']='په لاندې پینل کې په جدولونو کې شتمنۍ وګورئ او سمون کړئ.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='دا شبکه اوس بیا محاسبه کړئ. د محاسبه کول تڼۍ لټوئ؟ دا پټه ده تر هغه چې پخپله بیا محاسبه کول تنظیم فعال وي. ترڅو تڼۍ بېرته راولئ، تنظیمات، محاسبه، هایدرولیکس کې پخپله بیا محاسبه کول غیرفعاله کړئ.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='پخپله بیا محاسبه کول';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='که بیا محاسبه ډېره ورو وي بند یې کړئ. د محاسبه کول تڼۍ پټوي.';
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
$ec_lang['lpn_time_run_slow']='دا شبکې د محاسبې لپاره {secs} ثانیې ونیولې، او دا ټاکل شوې چې له هرې بدلون وروسته بیا محاسبه شي. ترڅو دا ودروئ او "محاسبه کول" تڼۍ بېرته ترلاسه کړئ، په تنظیماتو کې، د محاسبې لاندې، هایدرولیکس کې "پخپله بیا محاسبه کول" غیرفعاله کړئ.';
$ec_lang['lpn_time_no_report']='تر اوسه هیڅ د چلولو راپور نشته. راپور د EPANET خپل متن دی، نو دا هغه وخت ښکاره کیږي کله چې دا شبکه د EPANET حل کوونکي سره محاسبه شوې وي.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='مرسته';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='د سکرین‌شاټونو ګالري';
$ec_lang['lpn_help_walkthroughs']='لارښودونه';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='شبکه ړنګول';
$ec_lang['lpn_confirm_delete_network']='په دې پروژه کې هر نقطه، پایپ، او متن لیبل ړنګ کړئ؟ شاليد انځور، د پروژې نوم، او ستاسو تنظیمات ساتل کیږي.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='لټون او ځای پرځای کول';
$ec_lang['lpn_find_title']='لټون او ځای پرځای کول';
$ec_lang['lpn_find_scope']='څه ولټول شي';
$ec_lang['lpn_find_scope_all']='هرڅه';
$ec_lang['lpn_find_property']='ملکیت';
$ec_lang['lpn_find_condition']='شرط';
$ec_lang['lpn_find_value']='ارزښت';
$ec_lang['lpn_find_btn']='لټون';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='په اوسني جدول کې فلټر';
$ec_lang['lpn_find_filter_tip']='په هر لټول شوي جدول کې یوازې هغه قطارونه وښایاست چې پورتنۍ "څه ولټول شي" سره سمون خوري.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} د {all}';
$ec_lang['lpn_find_filter_summary']='د {q} له مخې فلټر شوی. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='دا پوښتنه پر هیڅ جدول باندې تطبیق نه کیږي.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='لري';
$ec_lang['lpn_find_op_equals']='مساوي دی له';
$ec_lang['lpn_find_op_gt']='زیات له';
$ec_lang['lpn_find_op_lt']='کم له';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='خالي';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} وموندل شول. ورته د تللو لپاره یو یې وټاکئ.';
$ec_lang['lpn_find_shift_hint']='Shift+کلیک د بدلون لپاره: که یو شی د ټاکل شوو په ډله کې نه وي، اضافه کیږي؛ او که دمخه د ټاکل شوو په ډله کې وي، لرې کیږي.';
$ec_lang['lpn_find_none']='هیڅ شی سره سمون ونه خوړ.';
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
$ec_lang['lpn_find_op_top']='{n} لوړ ترین';
$ec_lang['lpn_find_op_bottom']='{n} ټیټ ترین';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='هغه څه ولیکئ چې یې لټوئ.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='نښلون';
$ec_lang['lpn_find_prop_demand_desc']='د دې غوښتنې ډول تشریح';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='په نقطه کې هیڅ تړاو نشته';
$ec_lang['lpn_find_op_conn_noopen']='په نقطه کې هیڅ خلاص تړاو نشته';
$ec_lang['lpn_find_op_conn_nolinksource']='سرچینې ته د تړاو هیڅ لاره نشته';
$ec_lang['lpn_find_op_conn_noopensource']='سرچینې ته هیڅ خلاصه لاره نشته';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='هره نقطه نښلول شوې ده.';
$ec_lang['lpn_find_conn_no_fixed']='دا شبکه هیڅ ذخیره یا ټانک نلري، نو رسیدو لپاره هیڅ سرچینه نشته. یوازې "په نقطه کې هیڅ تړاو نشته" او "په نقطه کې هیڅ خلاص تړاو نشته" لټول کیدی شي.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='ورکړل شوی لټون د متن پوښتنې په توګه. د پوښتنې بدلول پورتني کنترولونه تازه کوي.';
$ec_lang['lpn_find_query_label']='پوښتنه';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='شرطونه د او، يا، او () سره یوځای کړئ';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='او';
$ec_lang['lpn_find_q_or']='يا';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='کنترولونه لاندې پوښتنه نشي ښودلی، نو پټ شوي دي.';
$ec_lang['lpn_find_q_restore']='پرځای یې کنترولونه وکاروئ';
$ec_lang['lpn_replace_q_bad']='دا پوښتنه نشي پوهیدلی، نو هیڅ شی نشي بدلیدلی. لومړی یې پورته سمه کړئ.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(په توري {n} کې)';
$ec_lang['lpn_find_q_err_empty']='پوښتنه خالي ده، نو هیڅ شی به ونه لټول شي.';
$ec_lang['lpn_find_q_err_scope']='هیڅ شی چې {w} نومیږي شتون نلري چې ولټول شي. یو له دې څخه هڅه وکړئ: {list}';
$ec_lang['lpn_find_q_err_dot']='د هغه څه ترمنځ چې تاسو یې لټوئ او د هغه ملکیت ترمنځ یوه نقطه کیږدئ، لکه Junction.ID';
$ec_lang['lpn_find_q_err_prop']='د {scope} ملکیت نه دی: {w}. یو له دې څخه هڅه وکړئ: {list}';
$ec_lang['lpn_find_q_err_op']='د {prop} لپاره شرط نه دی: {w}. یو له دې څخه هڅه وکړئ: {list}';
$ec_lang['lpn_find_q_err_value']='دې شرط ته وروسته یو ارزښت اړین دی: {op}';
$ec_lang['lpn_find_q_err_quote']='د متن ارزښت شاوخوا کوما نښې کیږدئ: {w} یوه شمېره نه ده.';
$ec_lang['lpn_find_q_err_quote_end']='دا کوما شوی متن د تړلو کوما نه لري.';
$ec_lang['lpn_find_q_err_close']='دا قوس ( خلاص شو خو هیڅکله ونه تړل شو.';
$ec_lang['lpn_find_q_err_open']='دا قوس ) هیڅ شی نه تړي.';
$ec_lang['lpn_find_q_err_end']='له دې وروسته هیڅ شی تمه نه کیده. دوه لټونونه د {and} یا {or} سره یوځای کړئ.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='هغه څه بدل کړئ چې وموندل شول';
$ec_lang['lpn_replace_prop']='هغه ځانګړتیا چې بدلیږي';
$ec_lang['lpn_replace_value']='نوی ارزښت';
$ec_lang['lpn_replace_source']='د نوي ارزښت سرچینه';
$ec_lang['lpn_replace_asked']='د {n} نقطو لپاره لوړوالي وغوښتل شول. کله چې ترلاسه شي پایلې ښکاره کیږي.';
$ec_lang['lpn_replace_btn']='ځای پرځای کول';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='{n} عناصر بدل کړم؟';
$ec_lang['lpn_replace_apply']='دوی بدل کړئ';
$ec_lang['lpn_replace_done']='{n} شتمنۍ بدلې شوې. دا په یوه ګام کې بېرته کیدی شي.';
$ec_lang['lpn_replace_none']='هیڅ به نه بدلیږي.';
$ec_lang['lpn_replace_no_value']='نوی ارزښت ولیکئ.';
$ec_lang['lpn_replace_scope']='پورته یو ډول عنصر وټاکئ ترڅو د هغه ارزښتونه بدل کړئ.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='پروفایل';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_title']='د یوې لارې پروفایل';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='هغه نقطه وټاکئ چیرته چې لار پیلیږي.';
$ec_lang['lpn_profile_draw_more']='د لارې کتلو لپاره پر نقشه خوځئ. د اضافه کولو لپاره یوه نقطه وټاکئ. د پای ته رسولو لپاره دوه ځله کلیک وکړئ. Esc لغوه کوي.';
$ec_lang['lpn_profile_draw_blocked']='له {a} نه تر {b} پورې هیڅ لار نشته. یوه بله نقطه وټاکئ.';
$ec_lang['lpn_profile_tap_start']='هغه نقطه وټاکئ چیرته چې لار پیلیږي.';
$ec_lang['lpn_profile_tap_more']='د لارې کتلو لپاره یوه نقطه وټاکئ. د اضافه کولو لپاره یې فشار ورکړئ او ونیسئ. د پای ته رسولو لپاره دوه ځله ټیپ کړئ. د لغوه کولو لپاره بیا پروفایل ووهئ.';
$ec_lang['lpn_profile_say_idle']='یوه نوې لار د نقشې کې ټاکلو لپاره بیا "پروفایل" فشار کړئ.';
$ec_lang['lpn_profile_none']='تر اوسه هیڅ لار نشته. د نقشې کې د یوې ټاکلو لپاره بیا "پروفایل" فشار کړئ.';
$ec_lang['lpn_profile_choose']='یوه پیل نقطه او یوه پای نقطه وټاکئ.';
$ec_lang['lpn_profile_no_path']='دا دوه نقطې د هیڅ لارې له لارې سره وصل نه دي.';
$ec_lang['lpn_profile_no_solve']='تر اوسه هیڅ پایله نشته، نو یوازې د ځمکې کرښه راکاږل شوې ده.';
$ec_lang['lpn_profile_summary']='نقطې: {n}، اوږدوالی: {len} {u}';
$ec_lang['lpn_profile_axis_station']='د لارې په اوږدو کې واټن ({u})';
$ec_lang['lpn_profile_axis_elev']='لوړوالی او سر ({u})';
$ec_lang['lpn_profile_ground']='د ځمکې سطحه';
$ec_lang['lpn_profile_hgl']='هایدرولیکي کچې کرښه';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='سمون';
$ec_lang['lpn_profile_edit_tip']='د لارې یو سر بدل کړئ، یا یې یوه نقطه لرې کړئ، پرته لدې چې ټوله لار بیا راکاږئ.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='د خوځولو لپاره پر لار هره نقطه راکاږئ. د لرې کولو لپاره هغه نقطه وټاکئ چې تاسو اضافه کړې وه.';
$ec_lang['lpn_profile_edit_tap']='د خوځولو لپاره پر لار هره نقطه راکاږئ. د لرې کولو لپاره هغه نقطه وټاکئ چې تاسو اضافه کړې وه.';
$ec_lang['lpn_profile_edit_nowhere']='د لارې پر مخ نقطه باید یو جنکشن (نقطه) وي. لار نه ده بدله شوې.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='ساتل شوې لارې';
$ec_lang['lpn_profile_new']='نوې ساتل شوې لار…';
$ec_lang['lpn_profile_new_name']='لار {n}';
$ec_lang['lpn_profile_rename']='د لارې نوم بدلول…';
$ec_lang['lpn_profile_delete']='لار ړنګول';
$ec_lang['lpn_profile_prompt_name']='د دې لارې لپاره نوم';
$ec_lang['lpn_profile_delete_confirm']='ساتل شوې لار {name} ړنګه شي؟ اصلي انځور نه بدلیږي.';
$ec_lang['lpn_profile_none_saved']='تر اوسه هیڅ ساتل شوې لار نشته';
$ec_lang['lpn_profile_missing']='ساتل شوې لار {name} هغه نقطې کاروي چې پدې پروژه کې نشته: {ids}';
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
$ec_lang['lpn_ts_menu']='د وخت لړۍ';
$ec_lang['lpn_ts_tip']='یوه یا څو شتمنۍ د اوږدې مودې سمولېشن په اوږدو کې د وخت پر وړاندې ګراف کړئ.';
$ec_lang['lpn_ts_title']='ارزښتونه د وخت پر وړاندې';
$ec_lang['lpn_ts_group_nodes']='نقطې';
$ec_lang['lpn_ts_group_links']='تړاونه';
$ec_lang['lpn_ts_add']='ټاکل شوي اضافه کړئ';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='د اضافه کولو لپاره هیڅ شی ونه موندل شو.';
$ec_lang['lpn_ts_clear']='ټول لرې کړئ';
$ec_lang['lpn_ts_chip_tip']='{id} د ګراف نه لرې کړئ';
$ec_lang['lpn_ts_none']='تر اوسه د ګراف کولو لپاره هیڅ شی نشته. پر نقشه شتمنۍ وټاکئ او ټاکل شوي اضافه کړئ فشار کړئ.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='تر اوسه د اوږدې مودې پایلې نشته. سمولېشن چلولو لپاره محاسبه فشار کړئ.';
$ec_lang['lpn_ts_summary']='شتمنۍ: {n}، د راپور وختونه: {steps}';
$ec_lang['lpn_ts_axis_time']='تیر شوی وخت';
$ec_lang['lpn_freq_menu']='تعدد';
$ec_lang['lpn_freq_tip']='د یوې ځانګړتیا د تعدد ویش';
$ec_lang['lpn_freq_title']='د ارزښتونو ویش';
$ec_lang['lpn_freq_none']='تر اوسه د دې ارزښت لپاره هیڅ پایله نشته، نو د ګراف کولو لپاره هیڅ شی نشته.';
$ec_lang['lpn_freq_summary']='ګراف شوي: {n} د {total} څخه';
$ec_lang['lpn_freq_summary_time']='ګراف شوي: {n} د {total} څخه، په {time} کې';
$ec_lang['lpn_freq_axis_percent']='تر دې ټیټه سلنه';
$ec_lang['lpn_view_units']='واحدونه';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='ټول ساتل';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='پروژه{n}';
$ec_lang['lpn_project_copy_suffix']='(کاپي)';
$ec_lang['lpn_project_rename']='نوم بدلول';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='نوی پروژه…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='نوې پروژه';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='همغږۍ سیسټم';
$ec_lang['lpn_new_coordsys_tip']='د خپلې شبکې همغږۍ سیسټم وټاکئ. د دې انتخاب د بدلولو یوازینۍ لار د "File, Convert as…" له لارې نوې پروژې ته ده، او دا بدلون نږدې دی.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='ځایی، شمیتیک، یا دودیز';
$ec_lang['lpn_new_coordsys_local_tip']='جغرافیایي پته نلري. خپله شاليد انځور یا هیڅ یو ونښلوئ.';
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
$ec_lang['lpn_crs_view']='د نقشې لید له مخې پاڼول';
$ec_lang['lpn_crs_view_tip']='یوازې هغه همغږۍ سیسټمونه وړاندې کړئ چې هغه ځای پوښي چې نقشه ورته ګوري. د بشپړ لړلیک لوستلو لپاره یې پاک کړئ.';
$ec_lang['lpn_crs_place']='د ځای نوم لټون';
$ec_lang['lpn_crs_place_tip']='لټونونه د OpenStreetMap د ځای نوم خدمت ته لیږل کیږي، او لومړی ځل اجازه غوښتل کیږي. یوه نوې جغرافیوي پروژه هم د همدلته موندل شوي ځای نه پیل کیږي.';
$ec_lang['lpn_crs_search']='لټون';
$ec_lang['lpn_crs_name']='د پروجیکشن نوم پاڼول';
$ec_lang['lpn_crs_name_tip']='هغه متن چې لړلیک چاڼوي: یوازې هغه همغږۍ سیسټمونه ښودل کیږي چې نوم یا EPSG کوډ یې دا لري.';
$ec_lang['lpn_crs_list_tip']='هغه همغږۍ سیسټمونه چې پورتنۍ چاڼونه یې تیروي. یو غوره کړئ، بیا OK ووهئ.';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='تر اوسه هیڅ ځای ونه لټول شو، نو بشپړ لړلیک وړاندې کیږي. پورته یو ځای ولټوئ یا نقشه دې لړلیک لنډولو لپاره لوی یا کوچنی کړئ.';
$ec_lang['lpn_crs_count']='{n} د {total} پروجیکشنونو نه لړلیک شوي.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} د {total} همغږۍ سیسټمونو نه دا شبکه پوښي.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(بې نقشې)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} یو له هغو لږو لیست شویو همغږۍ سیسټمونو نه دی چې د کارونې وړ پروجیکشن معلومات نلري. دا معنی لري چې د نړۍ نقشه، د ځای نوم لټون، او DEM لوړوالي کار نه کوي. ستاسو همغږۍ بې اغیزې دي.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='بې نومه';
$ec_lang['lpn_crs_none']='جغرافیایي پته نلري';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='واحدونه او نورې ټاکنې د هرې پروژې سره ساتل کیږي، نو دا انتخاب یوازې دې پروژې ته پلي کیږي او د براوزر د ټاکنې په توګه نه ساتل کیږي. د ترجیحاتو د بیا کارولو لپاره، یوه تشه پروژه د قالب په توګه وساتئ او هره نوې پروژه له هغې پیل کړئ.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='پیټالوما، کالیفورنیا';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='جوړول';
$ec_lang['lpn_file_open']='پرانیستل…';
$ec_lang['lpn_file_save']='ساتل';
$ec_lang['lpn_file_saveas']='داسې ساتل…';
$ec_lang['lpn_file_revert']='بېرته اصلي حالت';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='وروستي فایلونه';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_denied']='د هغه فایل د پرانیستلو اجازه نه وه ورکړل شوې، نو دا نه دی پرانیستل شوی.';
$ec_lang['lpn_recent_gone']='{file} نشو پرانیستلی. کیدای شي لیږدول شوی، نوم یې بدل شوی، یا ړنګ شوی وي، نو د وروستیو لیست نه ایستل شوی.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='نوې پروژه';
$ec_lang['lpn_tab_all']='ټولې پروژې';
$ec_lang['lpn_tab_menu']='د پروژې مینو';
$ec_lang['lpn_tab_duplicate']='دوه چنده کول';
$ec_lang['lpn_tab_move_left']='کیڼ لور ته لیږدول';
$ec_lang['lpn_tab_move_right']='ښي لور ته لیږدول';
$ec_lang['lpn_tab_unsaved']='فایل ته نه دی ساتل شوی';
$ec_lang['lpn_import_bad_file']='هغه فایل د دې پاڼې نه ساتل شوې پروژې په توګه نشو لوستل کیدی.';
$ec_lang['lpn_import_no_room']='د دې پروژې اضافه کولو لپاره کافي براوزر ذخیره نشته. هغه پروژه ړنګه کړئ چې نور یې اړتیا نلرئ او بیا هڅه وکړئ.';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='سمه ده';
$ec_lang['lpn_file_import_menu']='دننه کول…';
$ec_lang['lpn_file_import_inp']='د EPANET فایل دننه کول…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='د EPANET فایل نه یوه شبکه ولولئ، که .inp متني فایل وي یا هغه .net فایل چې EPANET یې ساتي، او یې د نوې پروژې په توګه پدې براوزر کې وساتئ.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='دا شبکه د EPANET .inp فایل په توګه ډاونلوډ کړئ (که تړاو ولري د خپل انځور سره په zip فایل کې). هر هغه څه چې .inp بڼه یې نشي ساتلی وروسته تاسو ته لیست کیږي.';
$ec_lang['lpn_status_inp_exported']='{file} صادر شو.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} شیان چې .inp فارمېټ یې نشي ساتلی.';
$ec_lang['lpn_inp_export_refused']='دا پروژه د EPANET فایل په توګه لیکل کیدی نشي: {detail}';
$ec_lang['lpn_inp_bad_file']='هغه فایل د EPANET شبکې فایل په توګه نشو لوستل کیدی.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='دا د EPANET .net فایل ښکاري، خو دا پاڼه یې نشوای لوستلی. یې په EPANET کې پرانیزئ او هلته د فایل، صادرول، شبکه امر وکاروئ ترڅو یې د .inp فایل په توګه وساتئ، بیا هغه دننه کړئ.';
$ec_lang['lpn_inp_report_heading']='{file} دننه شوی';
$ec_lang['lpn_inp_report_counts']='{nodes} جنکشنونه، ذخیرې او ټانکونه، {links} پایپونه، پمپونه او والوونه، په {units} کې.';
$ec_lang['lpn_inp_report_clean']='په فایل کې ټول معلومات دننه شول. هیڅ شی نه دی پرېښودل شوی.';
$ec_lang['lpn_inp_report_label_anchor']='د متن لیبلونه لکه څنګه چې EPANET یې ځای پر ځای کوي، د دوی له پورتني کیڼ کونج نه ځای پر ځای کیږي.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='د EPANET فایلونه هیڅ همغږۍ سیسټم نلري، نو دا فایل به په پیل کې جغرافیایي حواله شوی نه وي. د نړۍ نقشې پر ایښودلو لپاره، نقشه، د نړۍ نقشه… وکاروئ. د همغږیو بدلولو لپاره، فایل، داسې بدلول… وکاروئ.';
$ec_lang['lpn_inp_report_lead']='دا پاڼه د EPANET ټول ځانګړتیاوې نه کاروي، خو په فایل کې هیڅ معلومات نه غورځول کیږي. لاندې لیست هغه معلومات ښیي چې په فایل کې دي، ساتل کیږي خو نه کارول کیږي، او هغه بدلونونه چې د دننه کولو پر مهال شوي:';
$ec_lang['lpn_inp_drop_headloss']='دا فایل د Hazen-Williams فورمول نه کاروي. دا پاڼه Hazen-Williams محاسبه کوي، نو د پایپ د خشونت شمېرې لکه لیکل شوې پرېښودل شوې، خو دلته ځوابونه به د EPANET له ځوابونو سره برابر نشي.';
$ec_lang['lpn_inp_drop_tank_curve']='دا ټانکونه سیده-څنډي نه دي: فایل د دوی شکل د حجم منحنۍ په توګه ورکوي. منحنۍ د کتابتونونو بکس کې ساتل کیږي، ټانک لا هم ورته مراجعه کوي، او اوږدې مودې سمولېشن یې د کچې د محاسبې لپاره کاروي کله چې ټانک ډکیږي او تشیږي. د یو دوره شننې اغیز نه پرېوځي، ځکه چې د اوبو سطحه په هغه کچه کې ده چې فایل یې بیانوي. په فایل کې قطر د منحنۍ تر څنګ ساتل کیږي او د هغه ټانک د رسمولو او حل کولو لپاره کارول کیږي چې منحنۍ نه لري.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='دا تنګوونکي والوونه د تنګوونکو والوونو په توګه دننه شول، د هغې ضیاع سره چې په فایل کې بیان شوې.';
$ec_lang['lpn_inp_drop_valve_active']='دا والوونه فشار یا بهاو کنټرولوي، او حالت یې د هیدرولیکي شرایطو سره بدلیږي. دوی د معلوماتو له ضایع کېدو پرته دننه شول، او دا پاڼه یې حلوي.';
$ec_lang['lpn_inp_drop_valve']='دا والوونه د منحنۍ یا د ثابت فشار د ټیټوالي له مخې بیانیږي، او دا پاڼه داسې شتمني نه لري. دوی د خلاصو پایپونو په توګه دننه شول، نو شبکه لا هم تړلې پاتې کیږي، خو فشار او بهاو په هغو ځایونو کې نور کنټرول نه کیږي.';
$ec_lang['lpn_inp_drop_cv']='په EPANET کې دا پایپونه بهاو یوازې یو لوری ته اجازه ورکوي (بیرته نه بهیدونکي والوونه). دوی د معمولي پایپونو په توګه دننه شول، نو بهاو اوس کیدی شي په هر لوری تیر شي.';
$ec_lang['lpn_inp_drop_demands']='دا جنکشنونو یوه نه بلکې څو غوښتنې لرلې. غوښتنې یو ځای شوې د دې پاڼې د یوې واحدې غوښتنې ننوتلو لپاره.';
$ec_lang['lpn_inp_drop_patterns']='دا پاڼه د غوښتنې نمونې ونه لوستلې، ځکه چې د اوږدې مودې سمولېشن ماډل پورته نه شو. هره غوښتنه هغه ارزښت دی چې په فایل کې بیان شوی.';
$ec_lang['lpn_inp_drop_demand_pattern']='دا جنکشنونه غوښتنې لري چې د چلولو په اوږدو کې بدلیږي. د دوی نمونې په بشپړه توګه دننه شوې، او ښودل شوې غوښتنه په ساعت کې د وخت ارزښت دی.';
$ec_lang['lpn_inp_drop_emitters']='دا جنکشنونه د شبرنګ یا لیک ضریب لري. دا وساتل شو او حل کیږي، خو دلته د دې پاڼې کې دا لیدل یا بدلول ممکن نه دي لا.';
$ec_lang['lpn_inp_drop_curve_long']='دا د پمپ منحني له درو ټکو زیات لرله. یې ترټولو ټیټ، منځنی، او لوړ ټکي وساتل شول، ځکه چې دا پاڼه تر درو ټکو پورې منحني برابروي.';
$ec_lang['lpn_inp_drop_curve_missing']='دا پمپ یوې داسې منحنۍ ته اشاره کوي چې په دې فایل کې نشته. دا پمپ پرته له منحنۍ راننوتلی، نو هیڅ هیډ نه اضافه کوي.';
$ec_lang['lpn_inp_drop_pump_other']='دا پمپ د هغې بریښنا له مخې بیانیږي چې اخلي یې، نه د منحنۍ له مخې. دا پرته له منحنۍ دننه شو، نو هیڅ هیډ نه زیاتوي.';
$ec_lang['lpn_inp_drop_head_pattern']='دا ذخیرې هیډ لري چې د چلولو په اوږدو کې بدلیږي. د دوی نمونې په بشپړه توګه دننه شوې، او ښودل شوې د اوبو کچه په ساعت کې د وخت ارزښت دی.';
$ec_lang['lpn_inp_drop_pump_speed']='دا پمپونه په داسې چټکتیا چلیږي چې د هغه چټکتیا نه توپیر لري چې د دوی منحنۍ پرې اندازه شوې وه، یا د چلولو په اوږدو کې چټکتیا بدلوي. چټکتیا او د هغې نمونه په بشپړه توګه دننه شوې، او ښودل شوی هیډ په ساعت کې د وخت ارزښت دی.';
$ec_lang['lpn_inp_drop_setting']='دا پایپونه، پمپونه، او والوونه یو داسې تنظیم لري چې دا پاڼه یې نشي ساتلی. دا خلاص راننوتل.';
$ec_lang['lpn_inp_drop_rules']='دا فایل د قاعدو پر بنسټ کنټرولونه لري. دا پاڼه یې لولي او پلي کوي یې. کله چې ماډل وچلول شي، قاعدې پلي کیږي، او هره کچه، فشار او بهاو چې پکې دي هغه واحدونو ته اړول کیږي چې دا پروژه یې ښیي. د یوې قاعدې د کتلو یا سمولو لپاره د کتابتونونو لاندې قاعدې پرانیزئ. قاعدې هغسې ساتل کیږي لکه چې په فایل کې بیان شوې او که تاسو EPANET فایل وساتئ بېرته لیکل کیږي.';
$ec_lang['lpn_inp_drop_eps']='دا فایل یوه اوږدې مودې سمولېشن بیانوي. د دې پاڼې هغه برخه چې اوږدې مودې سمولېشن چلوي پورته نه شوه، نو یوازې پیل حالتونه راننوتل.';
$ec_lang['lpn_inp_drop_quality']='دا فایل د اوبو کیفیت بیانوي: په پایپونو او ټانکونو کې لومړني غلظتونه او د تعامل سرعتونه. دا پاڼه دغه ارزښتونه لولي او کاروي یې. په تنظیماتو، محاسبه، کیفیت کې یوه کیمیاوي ماده وټاکئ، بیا ماډل وچلوئ ترڅو د چلولو په اوږدو کې د شبکې په ټول کې غلظتونه محاسبه شي. کرښې ساتل کیږي او که تاسو EPANET فایل وساتئ بېرته لیکل کیږي.';
$ec_lang['lpn_inp_drop_sources_mixing']='دا فایل بیانوي چې کیمیاوي ماده په شبکه کې چیرته انجیکټ کیږي او اوبه په هر ټانک کې څنګه ګډیږي. هره سرچینه په هغه نقطه کې ښودل کیږي چیرته چې پلي کیږي، او هر ټانک خپل د ګډیدو ماډل ښیي. دواړه کارول کیږي کله چې شبکه په ټول چلولو وخت کې وچلول شي.';
$ec_lang['lpn_inp_drop_energy']='دا د EPANET فایل د پمپ کولو د لګښت ماډل کولو معلومات لري. دا پاڼه یې لولي او کاروي یې. ماډل د EPANET انجن سره وچلوئ، بیا د اوبه، راپورونه، د پمپ انرژي پرانیزئ ترڅو وګورئ چې هر پمپ څومره موده چلېدلی، څومره ځواک یې کارولی، څومره انرژي یې مصرف کړې، او هغه څومره لګښت درلود. کرښې ساتل کیږي، او که تاسو EPANET فایل وساتئ، بېرته لیکل کیږي.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='دا فایل ځینو جنکشنونو، پایپونو، یا نورو شتمنیو ته ټاګونه ټاکي. هر ټاګ دننه شو او د خپلې شتمنۍ په ځانتیاوو کې ښکاري، چیرته چې لیدل یا سمول کیدی شي.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='دا فایل د EPANET د راپور بڼې ټاکنې لري. د چلولو راپور په راپورونه، چلول کې شتون لري، خو دا د EPANET معیاري بڼه کاروي نه هغه بڼه چې دا ټاکنې یې ټاکي. کرښې ساتل کیږي او که تاسو EPANET فایل وساتئ بېرته لیکل کیږي.';
$ec_lang['lpn_inp_drop_sections']='دا فایل یوه برخه لري چې دا پاڼه یې هیڅکله نه لولي. دلته هیڅ شی نه یې کاروي. بشپړه ساتل کیږي، او که تاسو EPANET فایل وساتئ، بېرته لیکل کیږي.';
$ec_lang['lpn_inp_drop_quality_options']='دا فایل د EPANET د اوبو کیفیت اختیارونه بیانوي: د کیفیت اختیار، چې د اوبو کیفیت شننې ډول نوموي، او دوه ټاکنې چې له یوې کیمیاوي مادې سره ځي، نسبي خپریدنه او د کیفیت زغم. دا درې واړه ساتل کیږي او کارول کیږي. د اوبو عمر، د سرچینې رهیابي، او یوه کیمیاوي ماده هر یو دلته محاسبه کیږي، او دوه کیمیاوي ټاکنې کارول کیږي کله چې یوه کیمیاوي ماده وچلول شي. ټول بېرته لیکل کیږي که تاسو EPANET فایل وساتئ.';
$ec_lang['lpn_inp_drop_file_options']='دا فایل یو مرستیال فایل ته اشاره کوي: نقشه، چې همغږي لري، یا هایدرولیکس، چې دمخه حساب شوي هایدرولیکس لري. دا پاڼه هیڅ یو نشي پرانیستلی، نو کرښې لکه څنګه چې دي ساتل کیږي او که تاسو EPANET فایل وساتئ، بېرته لیکل کیږي.';
$ec_lang['lpn_inp_drop_other_options']='دا فایل هغه اختیارونه بیانوي چې دا پاڼه یې نه لولي. دلته هیڅ شی نه یې کاروي. دوی ساتل کیږي او که تاسو EPANET فایل وساتئ، بېرته لیکل کیږي.';
$ec_lang['lpn_inp_drop_net_options']='دا د EPANET .net فایل داسې تنظیمات بیانوي چې دا پاڼه ورته هیڅ کنترول نلري، نو د دوی ارزښتونه دلته لیست شوي دي پرځای د دې چې راولیږدول شي. هر څه بل راغلل. که تاسو ورته اړتیا لرئ، فایل په EPANET کې پرانیزئ او د فایل، صادرول، شبکه وکاروئ ترڅو یې د .inp فایل په توګه وساتئ، بیا هغه راوباسئ.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='دا د EPANET .net فایل و، د EPANET اصلي پروژې بڼه. دا بڼه خپره شوې مشخصات نه لري؛ دا پاڼه یې د بېلګې فایلونو نه د استنباط شوې بڼې په کارولو سره لولي، نو یوازې هغه وخت یې وکاروئ چې هیڅ .inp فایل نشته. د .inp فایل مستند بڼه ده چې نور پروګرامونه یې لولي: په EPANET کې د یوه د لیکلو لپاره File, Export, Network وکاروئ، او هرکله چې امکان ولري پر ځای یې هغه فایل دننه کړئ.';
$ec_lang['lpn_inp_drop_backdrop']='دا فایل یو شاليد انځور نوموي خو خپله انځور نلري. یې پخپله اضافه کړئ: فایل، شاليد انځور، انځور اضافه کول.';
$ec_lang['lpn_inp_drop_dangling']='دا پایپونه یو جنکشن نوموي چې په فایل کې نشته، نو دا پرېښودل شول.';
$ec_lang['lpn_inp_drop_units']='د دې فایل کې نومول شوی د بهاو واحد هغه نه دی چې دا پاڼه یې پیژني، نو هره شمېره د ګالنو په دقیقه کې لوستل شوه. د پایلو کارونې نه مخکې هره شمېره وګورئ.';
$ec_lang['lpn_inp_drop_anchor_missing']='دا متن یو جنکشن، ذخیرې، یا ټانک پورې تړل شوی و چې په فایل کې نشته. دا د آزاد متن په توګه په هغه ځای کې دننه شو چې فایل ښودلی، او هیڅ شتمنۍ پورې نه دی تړل شوی.';
$ec_lang['lpn_import_notes_heading']='دا پروژه د EPANET فایل نه ولوستل شوه. ځینې هغه څه چې هغه فایل لري ساتل کیږي خو پدې پاڼه کې نه کارول کیږي.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='{name} د یوه فایل نه پرانیستل شو، او د نوې پروژې په توګه دې براوزر ته اضافه شو.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='د پروژې فایل';
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
$ec_lang['lpn_file_upload_explain']='دا براوزر فایل ته وصل کیدی نشي، نو دلته فایل پرانیستل پورته کول دي: پروژه دې براوزر ته کاپي کیږي، او فایل ته د بدلونونو بېرته ساتلو یوازینۍ لار د فایل، داسې ساتل سره پرې لیکل دي.';
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
$ec_lang['lpn_file_saveas_tip_download']='ستاسو د براوزر د ډاونلوډ تنظیماتو په کارولو سره ساتئ. دا براوزر فایل ته وصل کیدی نشي، نو ساتل غیرفعال دی او یوازې داسې ساتل شته. که ستاسو د براوزر تنظیم "هر فایل چیرته ساتل شي وپوښتئ" فعال وي، اصلي فایل غوره کیدی شي او پرې لیکل کیږي.';
$ec_lang['lpn_status_uploaded']='د پروژې فایل پورته شو. له هغې سره هیڅ وصلوالی نشي ساتل کیدی، نو بېرته ورته ساتلو یوازینۍ لار فایل، داسې ساتل کارول دي.';
$ec_lang['lpn_status_downloaded']='{file} ډاونلوډ شو. دا براوزر فایل ته وصل کیدی نشي، نو دا پروژه لاهم د فایل ته نه ساتل شوې په توګه نښه شوې پاتیږي.';
$ec_lang['lpn_status_file_opened']='{file} پرانیستل شو.';
$ec_lang['lpn_status_already_open']='هغه فایل دلته دمخه د {name} په توګه پرانیستل شوی، نو دا هغه ته وګرځید ترڅو دویمه کاپي پرانیستل نشي.';
$ec_lang['lpn_status_already_open_dirty']='هغه فایل دلته دمخه د {name} په توګه پرانیستل شوی، له هغو بدلونونو سره چې تاسو یې نه دي ساتلي. دا هغه ته وګرځید ترڅو دویمه کاپي پرانیستل نشي. که تاسو د ډیسک نسخه غواړئ، فایل، بېرته اصلي حالت وکاروئ.';
$ec_lang['lpn_status_saved']='{file} وساتل شو.';
$ec_lang['lpn_status_reverted']='{file} بیا د ډیسک نه پورته شو.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='د {name} بندولو نه مخکې خپل بدلونونه ورته وساتئ؟';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} یوازې په دې براوزر کې ساتل شوی دی. که تاسو یې پرته له فایل ته ساتلو بند کړئ، دا تل ورک کیږي.';
$ec_lang['lpn_close_discard']='پرته له ساتلو بندول';
$ec_lang['lpn_cancel']='لغوه کول';
$ec_lang['lpn_revert_confirm']='هغه بدلونونه چې کړي دي پرېږدئ او {file} بیا د ډیسک نه پورته کړئ؟';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='دا پروژه د {file} نه راغلې، خو له هغه فایل سره وصلوالی له لاسه ورکړل شوی. د وصلیدو لپاره فایل بیا غوره کړئ.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='فایل ته لیکل ونشول. کیدای شي لیږدول شوی یا نوم یې بدل شوی وي، یا اجازه یې واخیستل شوې وي. ستاسو کار لاهم په دې براوزر کې ساتل شوی دی.';
$ec_lang['lpn_file_changed_elsewhere']='یو بل کارن تاسو د دې فایل له پرانیستلو راهیسې ورته ساتلي دي، نو اوس ساتل به د هغه کار پرې ولیکي. خپل بدلونونه په بېل فایل کې د ساتلو لپاره فایل، داسې ساتل وکاروئ، یا د خپلو بدلونونو پرېښودلو او ساتل شوې نسخې د پورته کولو لپاره فایل، بېرته راګرځول وکاروئ.';
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
$ec_lang['lpn_lock_somebody']='یو بل چا';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} دا فایل پرانیستی دی.';
$ec_lang['lpn_lock_open_readonly']='یوازې لوستلو لپاره پرانیستل';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='بندیز مات کول';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='داسې ښکاري چې دا فایل کارول کیږي.';
$ec_lang['lpn_lock_open_care']='د معلوماتو له لاسه ورکولو مخنیوي لپاره، له لاندې اختیارونو نه په دقت سره یو وټاکئ.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='دا د {x} راهیسې کارول کیږي.';
$ec_lang['lpn_lock_age_edited']='دا وروستی ځل {x} مخکې سمون شوی و.';
$ec_lang['lpn_lock_age_saved']='دا وروستی ځل {x} مخکې ساتل شوی و.';
$ec_lang['lpn_lock_age_never_saved']='تر اوسه پدې فایل کې هیڅ شی نه دی ساتل شوی.';
$ec_lang['lpn_lock_age_unknown']='هیڅ ثبت نشته چې دا د څومره وخت راهیسې کارول کیږي، یا کله وروستی ځل ساتل شوی یا سمون شوی و.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='"پوښتل" هغه چا ته چې دا فایل پرانیستی لري وايي چې تاسو یې غواړئ، او بل هیڅ شی نه بدلوي. "یوازې لوستلو لپاره پرانیستل" تاسو ته اجازه درکوي چې ورته وګورئ او هر څه چې غواړئ بدل کړئ، پرته له دې چې دلته یې وساتلی شئ. "بندیز مات کول" تاسو ته اجازه درکوي چې پر فایل باندې وساتئ؛ د هغوی نه ساتل شوی کار له لاسه نه ورکول کیږي، خو دوی به نور دلته یې ساتلی نشي، او ممکن یو چا ته اړتیا وي چې دواړه په لاس سره یوځای کړي.';
$ec_lang['lpn_lock_ask']='پوښتل';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='موږ باید ووایو چې څوک پوښتنه کوي؟ د بېلګې په توګه خپل لومړي توري ولیکئ. دا زموږ په سرور کې د دې فایل د بندیز سره ساتل کیږي، د هر چا لپاره چې دا پرانیستی وي، او په 30 ورځو کې ړنګیږي.';
$ec_lang['lpn_lock_ask_sent']='موږ هغه چا نه چې دا فایل یې پرانیستی لري وغوښتل چې یې بند کړي. که د هغوی پاڼه لاهم پرانیستې وي، دوی به یې د یوې دقیقې دننه ووینې. بل هیڅ شی نه دی بدل شوی، او فایل لاهم د هغوی دی تر هغه چې یې بند کړي.';
$ec_lang['lpn_lock_ask_failed']='ستاسو پیغام ونه رسېدل. یا اوس هیچا دا فایل پرانیستی نلري، یا سرور ته لاسرسی ونشو.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='دا فایل نه دی پرانیستل شوی، او دلته هیڅ شی نه دی بدل شوی. یو بل چا لاهم دا پرانیستی لري.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} غواړي دا فایل سمون کړي. کله چې تاسو چمتو یاست، خپل کار وساتئ او فایل، بندول وکاروئ ترڅو یې وسپارئ.';
$ec_lang['lpn_ago_seconds']='{n} ثانیې';
$ec_lang['lpn_ago_minutes']='{n} دقیقې';
$ec_lang['lpn_ago_hours']='{n} ساعته';
$ec_lang['lpn_ago_days']='{n} ورځې';
$ec_lang['lpn_ago_unknown']='یو نامعلوم وخت';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='پیغامونه';
$ec_lang['lpn_msglog_heading']='وروستي پیغامونه';
$ec_lang['lpn_msglog_empty']='تر اوسه هیڅ پیغام نشته.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='{x} مخکې';
$ec_lang['lpn_msglog_note']='نوي لومړی. دا پاڼه تر هغه پورې چې پرانیستې وي وروستي {n} پیغامونه ساتي، او ستاسو کمپیوټر کې هیڅ شی نه ساتل کیږي.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='یوازې لوستل: {name} دا فایل پرانیستی دی. دلته هر شی بدلیدی شي، خو نه ساتل کیږي. بل فایل ته د ساتلو لپاره فایل، داسې ساتل وکاروئ.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='خبرداری: د دې پروژې په اړه د بندیز چک یا جوړولو لپاره سرور ته رسیدل ونشول، نو بل کارن کولی شي هماغه فایل په ورته وخت کې سمون کړي. که بندیز بیا پیل شي یو پیغام ښکاره کیږي.';
$ec_lang['lpn_lock_storage_error']='خبرداری: دا سایټ د بندیز ثبتونه نشي ساتلی، نو بل کارن کولی شي هماغه فایل په ورته وخت کې سمون کړي. دا د سرور د تنظیم عیب دی چې له دې پاڼې نه سمیدی نشي: د بندیز فولډر د ویب سرور لخوا د لیکلو وړ نه دی.';
$ec_lang['lpn_lock_full_error']='خبرداری: دې سایټ د بندیز ثبتونو لپاره د ساتلو ځای نه لري، نو بل کارن کولی شي هماغه فایل په ورته وخت کې سمون کړي. دا د سرور د تنظیم عیب دی چې له دې پاڼې نه سمیدی نشي.';
$ec_lang['lpn_lock_not_asked']='د دې پروژې لپاره بندیز فعال نه دی، نو بل کارن کولی شي هماغه فایل په ورته وخت کې سمون کړي. دا پروژه لا تر اوسه پیژندونکی نه لري؛ فایل ته ساتل یې یو ورکوي.';
$ec_lang['lpn_lock_restored']='بندیز بېرته فعال شو، او دا فایل اوس ساتل کیدی شي.';
$ec_lang['lpn_lock_dismiss']='دا پیغام پټول';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='پروژه به په دې کمپیوټر کې په یوه فایل کې وساتل شي. دا یوازې هغه وخت ساتل کیږي کله چې تاسو یې وساتئ، او بل هیڅ وخت نه.';
$ec_lang['lpn_file_training_2']='ترڅو دوه کسان هیڅکله یو فایل په ورته وخت کې سمون نه کړي، دا سایټ ساتنه کوي چې څوک یې پرانیستی دی. که یو چا لا دمخه پرانیستی وي، بیا هم د کتلو لپاره پرانیستل کیدی شي، یا د ساتلو لپاره کاپي کیدی شي.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='لومړی ځل چې تاسو ساتئ، براوزر پوښتي چې آیا دا سایټ فایل سمولی شي. پوښتنه د براوزر نه راځي، نه له دې سایټ نه، او اجازه د فایل ته د لیکلو لپاره اړینه ده. دا معمولاً یوازې یو ځل د هر فایل لپاره غوښتل کیږي.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='دوام ورکړئ';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='فایل بیا غوره کول';
$ec_lang['lpn_file_reconnect']='دې فایل ته بیا وصلیدل';
$ec_lang['lpn_file_reconnect_alert']='دا پروژه د {file} نه راغلې. ستاسو براوزر بیا اجازه غواړي مخکې لدې چې ورته ولیکي. لاندې بیا وصل شئ.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='دا هماغه فایل دی چې یو بل چا پرانیستی دی، نو دا نشي ساتل کیدی. یوه بله فایل یا بل نوم غوره کړئ.';
$ec_lang['lpn_saveas_overwrites_project']='هغه فایل دمخه یوه بله پروژه لري، {name}. دلته ساتل به یې په بشپړ ډول بدل کړي. دوام ورکړئ؟';
$ec_lang['lpn_saveas_overwrites_newer']='هغه فایل ستاسو وروستي لیدو راهیسې بدل شوی، نو کیدای شي یو بل چا ورته ساتلي وي. دلته ساتل به د هغوی نسخه ستاسو سره بدله کړي. دوام ورکړئ؟';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='د دې پروژې لپاره نوم';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='{closed} بند شو. اوس {opened} ښودل کیږي.';
$ec_lang['lpn_status_closed_empty']='{closed} بند شو. یوه نوې خالي پروژه پیل شوه.';
$ec_lang['lpn_storage_full']='ونه ساتل شو. د براوزر ذخیره ډکه یا نه شته ده، نو ستاسو وروستي بدلونونه به د دې ټب بندولو سره ورک شي.';
$ec_lang['lpn_storage_unreadable']='خوندي نه شوه. دا پروژه د براوزر ذخیرې نه لوستل کیدی نشوه. د دې خوندي شوې کاپي عیناً همداسې پاتې کیږي او پرې لیکل به ونشي، نو په دې ټب کې هیڅ شی خوندي نه کیږي. کار ته دوام ورکولو لپاره یو فایل پرانیزئ یا نوې پروژه جوړه کړئ.';
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
$ec_lang['lpn_about_credits']='مننه';
$ec_lang['lpn_help_welcome']='د هرکلي پاڼه';
$ec_lang['lpn_about_license']='د GNU عمومي عامه جواز v3.0 یا وروسته لاندې جواز لري.';
$ec_lang['lpn_notes_1_term']='دا څنګه حل کیږي';
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
$ec_lang['lpn_notes_1_def']='دا شبکه د EPANET حل کوونکي حلوي. کله چې ټول چلولو وخت ټاکل شي، هر راپور وخت ګام په ترتیب سره محاسبه کیږي: ټانکونه ډکیږي او تشیږي، غوښتنې خپلې نمونې تعقیبوي، او د اوزارپټې چلول بیا ښیي.';
$ec_lang['lpn_notes_2_term']='هغه څه چې دا نه کوي';
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
$ec_lang['lpn_notes_2_def']='د اوبو کیفیت ماډل شوی دی: د اوبو عمر، سرچینې تعقیب، او هغه کیمیاوي ماده چې د پایپ دیوالونو او د اوبو په بدن کې غبرګون ښیي. تلاطم (surge) او د اوبو هتوکی (water hammer) ماډل شوي نه دي: دلته هر ځواب د هغو اوبو لپاره دی چې دمخه په ثابته توګه بهیږي، نه د هغه فشار څپې لپاره چې کله والو ناڅاپه تړل کیږي.';
$ec_lang['lpn_notes_3_term']='د پروژو ساتل';
$ec_lang['lpn_notes_3_def']='هره پروژه یوه ټب ده، او هره ټب د کار پر مهال دې براوزر کې ساتل کیږي. ستاسو د براوزر معلوماتو پاکول ټول دوی ړنګوي، نو خپل کار یوه فایل کې وساتئ: فایل، داسې ساتل. په یوه ټب کې ستوري نښه دا معنی لري چې دا داسې بدلونونه لري چې په فایل کې نه دي. هیڅکله هیڅ شی فایل ته نه لیکل کیږي پرته له دې چې تاسو یې وغواړئ. په ځینو براوزرونو کې یوه پروژه هغه فایل سره وصلیږي چې تاسو یې ورته ساتئ، او فایل، ساتل له هغې وروسته همدې فایل ته لیکي؛ په نورو کې هیڅ وصلوالی ممکن نه دی، نو ساتل غیرفعال دي او یوازې داسې ساتل شته دي. کله چې د پروژې فایل یوه شریکه ډرایو کې ساتل کیږي، دا پاڼه تاسو ته وایي که یو همکار یې دمخه پرانیستی وي، ترڅو دوه کسان یو بل باندې ونه لیکي.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='د پمپ منحني';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='یو پمپ H = H₀ − aQ^b تعقیبوي، چیرې چې H هغه هیډ دی چې پمپ یې اضافه کوي او Q هغه بهاو دی چې د هغه نه تیریږي. د جوړونکي منحني نه یو، دوه، یا درې ټکي ولیکئ. درې ټکي — د صفر بهاو کې هیډ، عادي کار ټکی، او د لوړ ترین بهاو ټکی — H₀، a او b مستقیم برابروي، او یوه خپره شوې منحني ترټولو نږدې تعقیبوي. دوه ټکي یو پارابولا (b = 2) برابروي چې د هغه اوچت یې د صفر بهاو کې دی. یو ټکی یو عام قاعده کاروي: د صفر بهاو کې هیډ ستاسو ننوتلي هیډ نه 1.33 چنده دی، او لوړ ترین بهاو ستاسو ننوتلي بهاو نه 2 چنده دی، چې بیا b = 2 ورکوي. یو پمپ چې هیڅ ټکی پکې نه دی ننوتل شوی هیڅ هیډ نه اضافه کوي. منحني د صفر هیډ رسیدو ځای کې نه پرې کیږي، نو د پمپ نه د هغه د منحني نه زیات بهاو غوښتل منفي هیډ ورکوي. حل یو غټ پمپ یا کوچنۍ غوښتنه دی، نه یوه بله منحني برابرونه. یوه منحنۍ کولی شي له درې نه زیات ټکي ولري، او هر هغه ټکی چې تاسو ورکړی دی لوستل کیږي.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_6_term']='د جدول کالمونو مرسته';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>کالم ټاکل</td><td>سرلیک کلیک کړئ</td></tr><tr><td>د کالم ټاکنه اضافه یا غزول</td><td>بل سرلیک Ctrl+click یا Shift+click کړئ</td></tr><tr><td>ټاکل شوي کالم(ونه) لیږدول (بیا ترتیبول)</td><td>راکاږئ یا ښي کلیک یا ⋮ مینو کې کالمونه اداره کول… وکاروئ</td></tr><tr><td>مینو ⋮ او د ترتیب غشی.</td><td>د سرلیک پورتنی کونج ونیسئ، یا سرلیک ته Tab یا یې وټاکئ</td></tr><tr><td>پټول، ټول ښودل، یا د ښکاره والي او ترتیب اداره کول</td><td>سرلیک ښي کلیک کړئ یا د سرلیک پورتنی ښی کونج کې ⋮ مینو</td></tr><tr><td>د کالم له مخې ترتیب کول</td><td>د سرلیک پورتنی ښی کونج کې د غشي نښه</td></tr><tr><td>د جدول په پای کې د نویو قطارونو په توګه پیسټ کول</td><td>ښي کلیک، د سرلیک پورتنی ښی کونج کې ⋮ مینو، یا Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='د جدول کیبورډ لنډلارې';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>د غشي تڼۍ</td><td>حرکت کول.</td></tr><tr><td>Tab, Enter</td><td>ننوتنه بشپړول او یوه حجره پر خوا / ښکته حرکت کول.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>شاته حرکت کول.</td></tr><tr><td>Shift+د غشي تڼۍ</td><td>ټاکنه غزول.</td></tr><tr><td>Ctrl+C</td><td>ټاکنه کاپي کول.</td></tr><tr><td>Ctrl+D</td><td>ټاکنه د خپل پورتني قطار نه ښکته ډکول.</td></tr><tr><td>Ctrl+Enter</td><td>ټاکنه د فعالې حجرې ارزښت سره ډکول.</td></tr><tr><td>Ctrl+A</td><td>ټول جدول ټاکل.</td></tr><tr><td>Ctrl+Shift+V</td><td>د جدول په پای کې د نویو قطارونو په توګه پیسټ کول.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>بل یا پخواني ټب ته تلل، که جدول وي یا ګراف.</td></tr><tr><td>Delete</td><td>یوه حجره پاکول.</td></tr><tr><td>F2</td><td>د سمون لپاره یوه حجره پرانیستل.</td></tr><tr><td>Esc</td><td>یو سمون لغوه کول.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='د رنګ ټکو پولې ثابتې پاتې کیږي';
$ec_lang['lpn_notes_color_def']='د رنګ ټکو پولې کله ټاکل کیږي چې تاسو د معلوماتو د طبقه‌بندۍ طریقه وټاکئ. دوی په هر وخت پړاو کې بیا نه ټاکل کیږي، ځکه چې دا به رنګونه هر پړاو کې یو نوی معنی ورکوي، او دا ستاسو د سیسټم لیدلو کې مرسته نه کوي. EPANET هم پدې ډول کار کوي. د نویو پولو ترلاسه کولو لپاره، یوه طریقه بیا وټاکئ یا خپلې پولې ولیکئ.';
$ec_lang['lpn_notes_epanet_term']='د Hazen-Williams ثابتونه د EPANET سره سمون لري';
$ec_lang['lpn_notes_epanet_def']='د 2026 د اګست په میاشت کې د Hazen-Williams ضریب او اسي د EPANET سره د سمون لپاره بدل شول. د سر ضیاع پایلې د دې پاڼې د پخوانیو نسخو نه تر 0.1 سلنه پورې توپیر لري، چې د C ارزښت په خپله عدم ډاډ نه ډیر کوچنی دی.';
$ec_lang['lpn_notes_engine_term']='دا پاڼه کوم EPANET چلوي';
$ec_lang['lpn_notes_engine_def']='د دې پاڼې د EPANET حل کوونکی OWA-EPANET 2.3.5 دی، چې د 2025 کال د فبرورۍ په 20 خپور شوی و. EPANET د Open Water Analytics له خوا رامنځته کیږي، یوه ټولنه چې د متحده ایالاتو د چاپیریال ساتنې ادارې سره کار کوي، کومې چې نسخه 2.2.0 د 2019 کال په دسمبر کې خپره کړه. د چلولو راپور دا 2.3.05 بولي ځکه چې انجن وروستۍ شمېره په دوو رقمونو کې لیکي. دا پاڼې ته د Luke Butler د epanet-js 0.9.0 له لارې رسیږي، د MIT جواز لاندې، او دا ستاسو د براوزر دننه چلیږي: ستاسو شبکه هیڅکله حل کولو لپاره چېرته نه لیږل کیږي.';
$ec_lang['lpn_id_invalid']='یو ID ولیکئ چې پکې خالي ځایونه یا نقل قول نښې نه وي.';
$ec_lang['lpn_id_taken']='هغه ID دمخه کارول شوی دی.';
$ec_lang['lpn_diag_no_fixed_head']='یوه ذخیره یا ټانک اضافه کړئ. شبکه د حل کیدو نه مخکې لږ تر لږه یو پیژندل شوی د اوبو کچه ته اړتیا لري.';
$ec_lang['lpn_diag_dangling_link']='یو پایپ یا پمپ هغه نقطې ته وصل دی چې نور شتون نلري:';
$ec_lang['lpn_diag_unreachable']='دا نقطې ذخیرې ته هیڅ لار نلري:';
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
$ec_lang['lpn_engine_fetching']='د EPANET حل کوونکی ډاونلوډ کیږي. یو ځل ډاونلوډ کیږي او بیا په دې وسیله کې ساتل کیږي، نو وروسته آفلاین کار کوي.';
$ec_lang['lpn_engine_ready']='د EPANET حل کوونکی اوس په دې وسیله کې ساتل شوی او آفلاین کار کوي.';
$ec_lang['lpn_engine_fetching_valve']='د EPANET حل کوونکی ډاونلوډ کیږي، ترڅو دا والو اوس او وروسته آفلاین حل شي.';
$ec_lang['lpn_engine_ready_valve']='د EPANET حل کوونکی اوس په دې وسیله کې ساتل شوی. د فشار او بهاو کنټرول والوونه (PRV، PSV، FCV) اوس آفلاین حل کیدی شي.';
$ec_lang['lpn_engine_unavailable']='د EPANET حل کوونکی ډاونلوډ نشو، چې د فشار او بهاو کنټرول والوونو (PRV، PSV، FCV) د حل لپاره اړین دی. له انټرنیټ سره د یوې اړیکې وروسته، حل کوونکی په دې وسیله کې ساتل کیږي.';
$ec_lang['lpn_engine_needed_loading']='ستاسو د جوړولو پرمهال د EPANET حل کوونکی بارول کیږي. پایلې به هغه وخت شته وي کله چې بشپړ بار شي.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='د حل کوونکي بار کیدو پرمختګ';
$ec_lang['lpn_engine_wait']='حل کوونکی بارېږي. پایلې لږ ځنډېدلې دي. کار ته دوام ورکړئ.';
$ec_lang['lpn_engine_wait_pct']='حل کوونکی {percent}% بار شوی.';
$ec_lang['lpn_engine_wait_bytes']='حل کوونکی تر اوسه {kb} KB بار شوی. ټول اندازه شتون نلري، نو د بشپړتیا سلنه نامعلومه ده.';
$ec_lang['lpn_engine_needed_failed']='د EPANET حل کوونکی تر اوسه نه دی بار شوی، نشي بارېدلی، او دا شبکه یوازې د هغه لخوا حل کیدلی شي. کله چې انټرنیټ سره وصل شئ نو بار به شي.';
$ec_lang['lpn_diag_valve_needs_epanet']='دا د فشار یا بهاو کنټرول والوونه دي، او یوازې د EPANET حل کوونکی یې محاسبه کولی شي. د EPANET حل کوونکی نشو پورته کیدی، نو دا پایلې ورک دي:';
$ec_lang['lpn_diag_valve_on_fixed_head']='دا والوونه مستقیم له یوې ذخیرې یا ټانک سره وصل دي، چې په هغه نقطه کې هیدرولیکي کچه ټاکي، نو والو د کنټرول لپاره هیڅ نه لري. د والو او ذخیرې یا ټانک ترمنځ یو لنډ پایپ کېږدئ:';
$ec_lang['lpn_diag_not_converged']='هیڅ حل ونه موندل شو. هغه ارزښتونه وګورئ چې په حقیقي ژوند کې ناممکن دي، لکه د صفر قطر.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='حل نه دی همغږی شوی. دا شمېرې وروستی تکرار دی، نه یوه پایله. مه یې کاروئ.';
$ec_lang['lpn_diag_not_converged_trials']='{iterations} تکرارونو وروسته ودرېد.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='{iterations} تکرارونو وروسته د {error} نسبي تیروتنې سره ودرېد، کوم چې د {accuracy} د دقت تنظیم ته ونه رسېد.';
$ec_lang['lpn_field_roughness']='خشونت';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='د Hazen-Williams C. لوړه شمېره معنی لري ترتیب شوی پایپ: نږدې 150 د نوي پلاستيک لپاره، 130 د نوي فولادو یا اوسپنو لپاره، او 100 د زوړ پایپ لپاره.';
$ec_lang['lpn_field_length']='اوږدوالی';
$ec_lang['lpn_field_from']='له';
$ec_lang['lpn_field_to']='تر';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='د والو ډول';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='د والو ډول. تنګوونکی والو (TCV) یو ثابت ضیاع پلي کوي. PRV، PSV، او FCV یو فشار یا یو بهاو ساتي، او د هیدرولیکي شرایطو له بدلون سره بشپړ خلاصیږي، بندیږي، یا نیمګړي بندیږي. PBV یو ثابت فشار لرې کوي، او GPV د سر ضیاع منحنۍ تعقیبوي. دا ډولونه بېل هیدرولیکي ځانتیاوې کنټرولوي، نو کله چې ډول بدل شي ممکن ترتیبات له لاسه ورکړل شي.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='تنګوونکی (TCV)';
$ec_lang['lpn_valve_type_prv']='د فشار کموونکی (PRV)';
$ec_lang['lpn_valve_type_psv']='د فشار ساتونکی (PSV)';
$ec_lang['lpn_valve_type_fcv']='د بهاو کنترول (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='د فشار ماتوونکی (PBV)';
$ec_lang['lpn_valve_type_gpv']='عمومي موخې (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='د فشار کمښت';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='هغه فشار چې والو یې لرې کوي. یو د فشار ماتوونکی والو تل دقیقا همدومره فشار لرې کوي، په هره لوري چې اوبه روانې وي. دا د والو په اوږدو کې یو کمښت دی، نه یو ساتل کیدونکی فشار.';
$ec_lang['lpn_inp_drop_gpv_curve']='دا والو یوې داسې د سر ضیاع منحنۍ ته اشاره کوي چې په دې فایل کې نشته. والو پرته له منحنۍ راننوت، نو بشپړ خلاص پاتې کیږي تر څو تاسو یې یوه ورکړئ.';
$ec_lang['lpn_gpv_curve_source']='د سر ضیاع منحنۍ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='هغه منحنۍ په کتابتونونو بکس کې چې په هر بهاو د دې والو له لارې د سر ضیاع ورکوي. څو والوګانې کولی شي ورته منحنۍ وکاروي، او هلته یې سمول ټول بدلوي.';
$ec_lang['lpn_field_valve_setting_pressure']='د فشار تنظیم';
$ec_lang['lpn_field_valve_setting_pressure_tip']='فشار کموونکی والو د خپلې ښکته اړخ فشار پدې ارزښت یا تر هغه ټیټ ساتي. فشار ساتونکی والو د خپلې پورتنۍ اړخ فشار پدې ارزښت یا تر هغه لوړ ساتي.';
$ec_lang['lpn_field_valve_setting_flow']='د بهاو تنظیم';
$ec_lang['lpn_field_valve_setting_flow_tip']='هغه ترټولو ډیر بهاو چې والو یې تیروي. کله چې تر دې کم اوبه تیریدل غواړي، والو بشپړ خلاص پاتې کیږي او هیڅ ضیاع نه اضافه کوي.';
$ec_lang['lpn_field_valve_setting']='تنظیم';
$ec_lang['lpn_field_valve_setting_loss']='د ضیاع ضریب';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='تنګوونکی والو څومره سر لرې کوي، د سرعت هیډ د یو ضریب په توګه شمېرل شوی. د یو بشپړ خلاص والو لپاره 0 وکاروئ. همدا یوه شمېره د یو تنګوونکي والو د ټول ضیاع بشپړوي.';
$ec_lang['lpn_field_valve_diameter_tip']='د والو د خلاص ځای پلنوالی. د والو له لارې د اوبو سرعت له همدې پلنوالي محاسبه کیږي، او ضیاع له هغه سرعت نه پیدا کیږي.';
$ec_lang['lpn_field_valve_km_tip']='د والو له بدنې نه ضیاع، تر هغه وخته چې والو بشپړ خلاص ولاړ وي، سربېره پر هغه څه چې د والو تنظیم یې لرې کوي. دا د سرعت هیډ د یو ضریب په توګه شمېرل کیږي. د پام نه غورځولو لپاره 0 وکاروئ.';
$ec_lang['lpn_field_km']='د ځایی ضیاع ضریب، k';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='ځایی ضیاع، k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='د پمپ هیډ منحنۍ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='هغه منحنۍ په کتابتونونو بکس کې چې په هر بهاو هغه هیډ ورکوي چې دا پمپ یې زیاتوي. څو پمپونه کولی شي ورته منحنۍ وکاروي، او هلته یې سمول ټول بدلوي.';
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
$ec_lang['lpn_field_desc']='تشریح';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='ټاګ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='یو ټاګ کولی شي هر هغه معنی ولري چې تاسو یې اړتیا لرئ، لکه یوه فشار سیمه یا یوه کاري امر. هیڅ محاسبه دلته یا په EPANET کې دا نه لولي. یو ټاګ یوازې یوه ټکی دی: EPANET په لومړي تشه کې لوستل بندوي، نو یوه تشه لکه تاسو یې لیکئ رد کیږي. دا د EPANET فایل ته او له هغه نه رابرول کیږي.';
$ec_lang['lpn_pump_effic_curve']='د پمپ اغیزناکتیا منحنۍ';
$ec_lang['lpn_pump_effic_curve_tip']='هغه منحنۍ په کتابتونونو بکس کې چې په هر بهاو د دې پمپ اغیزناکتیا ورکوي. څو پمپونه کولی شي ورته منحنۍ وکاروي، او هلته یې سمول ټول بدلوي. دا پمپ یوازې مراجعه لري؛ ټکي پخپله د کتابتونونو، منحنۍ لاندې لوستل او سمون کیږي.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='هیڅ منحنۍ نه ده ټاکل شوې';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='منحنۍ';
$ec_lang['lpn_curve_library_link_tip']='د کتابتونونو بکس د منحنیو په برخه کې پرانیزئ، چیرته چې یوه منحنۍ اضافه کیږي، تشریح کیږي، سمونه کیږي او ړنګیږي. یوه شتمنۍ بیانوي چې کومه منحنۍ کاروي.';
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
$ec_lang['lpn_curve_kind_head']='د پمپ هیډ';
$ec_lang['lpn_curve_kind_effic']='د پمپ اغیزناکتیا';
$ec_lang['lpn_curve_kind_volume']='د ټانک حجم';
$ec_lang['lpn_curve_kind_headloss']='د والو سر ضیاع';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='ډول نه دی ویل شوی';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='حجم';
$ec_lang['lpn_pump_effic_col']='اغیزناکتیا';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='دا پمپ هیڅ اغیزناکتیا منحنۍ نه لري ټاکل شوې، نو دا د ټولې شبکې لپاره ټاکل شوي اغیزناکتیا سره چلیږي، {percent}.';
$ec_lang['lpn_pump_effic_unstated']='دا پمپ یوه اغیزناکتیا منحنۍ ته اشاره کوي چې {name} نومیږي، خو دې پروژه کې هیڅ داسې څه نه دي بیان شوي، نو دا د ټولې شبکې لپاره ټاکل شوي اغیزناکتیا سره چلیږي، {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='حالت: ټاکل. د کتلو یا بدلولو لپاره یوه شتمني یا لیبل وټاکئ. د نقطې یا لیبل د خوځولو لپاره یې راکاږئ. د پایپ د خمونو د اضافه کولو یا لرې کولو لپاره د قلمي نقطو وسیله وکاروئ.';
$ec_lang['lpn_mode_delete']='حالت: ړنګول. د لرې کولو لپاره یوه شتمني وټاکئ.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='حالت: قلمي نقطې. د هر پایپ قلمي نقطې د کوچنیو مربع لاستیو په توګه ښودل کیږي. د قلمي نقطې د اضافه کولو لپاره پر پایپ یو ټکی وټاکئ، د لرې کولو لپاره یو لاستی وټاکئ، یا د خوځولو لپاره یو لاستی راکاږئ. پدې حالت کې په نقشه کې بل هیڅ شی نشي بدلیدی.';
$ec_lang['lpn_mode_zoom_window']='حالت: د زوم کړکۍ. د زوم کولو لپاره په نقشه کې د یوه بکس دوه مقابل کونجونه وټاکئ، یا یو یې راکاږئ.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='هیڅ شی نه دی ټاکل شوی. لومړی نقشه کې یو عنصر کلیک کړئ، بیا ړنګول کېکاږئ.';
$ec_lang['lpn_mode_add_junction']='حالت: د جنکشن اضافه کول. د جنکشن د ایښودلو لپاره په نقشه کې یو ځای وټاکئ. د شتمنیو او لیبلونو د بدلولو یا خوځولو لپاره ټاکل حالت ته ورګرځئ.';
$ec_lang['lpn_mode_add_reservoir']='حالت: د ذخیرې اضافه کول. د ذخیرې د ایښودلو لپاره په نقشه کې یو ځای وټاکئ. د شتمنیو او لیبلونو د بدلولو یا خوځولو لپاره ټاکل حالت ته ورګرځئ.';
$ec_lang['lpn_mode_add_tank']='حالت: د ټانک اضافه کول. د ټانک د ایښودلو لپاره په نقشه کې یو ځای وټاکئ. د شتمنیو او لیبلونو د بدلولو یا خوځولو لپاره ټاکل حالت ته ورګرځئ.';
$ec_lang['lpn_mode_add_pipe']='حالت: د پایپ اضافه کول. د وصل کولو لپاره لومړی د پیل نقطه او بیا د پای نقطه وټاکئ. د کرښې د خمولو لپاره ترمنځ په خالي ځای کې ټکي وټاکئ، یا د بیا پیلولو لپاره Escape ووهئ. د شتمنیو او لیبلونو د بدلولو یا خوځولو لپاره ټاکل حالت ته ورګرځئ.';
$ec_lang['lpn_mode_add_pump']='حالت: د پمپ اضافه کول. د وصل کولو لپاره لومړی د پیل نقطه او بیا د پای نقطه وټاکئ. د کرښې د خمولو لپاره ترمنځ په خالي ځای کې ټکي وټاکئ، یا د بیا پیلولو لپاره Escape ووهئ. د شتمنیو او لیبلونو د بدلولو یا خوځولو لپاره ټاکل حالت ته ورګرځئ.';
$ec_lang['lpn_mode_add_valve']='حالت: د والو اضافه کول. د وصل کولو لپاره لومړی د پیل نقطه او بیا د پای نقطه وټاکئ. د کرښې د خمولو لپاره ترمنځ په خالي ځای کې ټکي وټاکئ، یا د بیا پیلولو لپاره Escape ووهئ. د شتمنیو او لیبلونو د بدلولو یا خوځولو لپاره ټاکل حالت ته ورګرځئ.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='حالت: د متن اضافه کول. د متن د ایښودلو لپاره په نقشه کې یو ځای وټاکئ. د متن د یوې نقطې سره د تړلو لپاره د هغې نقطې ته نږدې ځای وټاکئ. د شتمنیو او لیبلونو د بدلولو یا خوځولو لپاره ټاکل حالت ته ورګرځئ.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='دا حالت وکاروئ ترڅو د نقشې عناصر بدل کړئ، وخوځوئ، او راکاږئ یا نقشه وخوځوئ. دا د نقشې ډیفالټ حالت دی. د Esc دویم ځل فشار هرڅه چې ټاکل شوي وي نه ټاکل شوي کوي.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='اوتو';
$ec_lang['lpn_method_switch_confirm']='د اصطکاک میتود بدلول ستاسو په پایپونو لیکل شوي د خشونت شمېرې نه بدلوي، او د یو میتود لپاره خشونت د بل میتود لپاره بې مانا دی. له دې وروسته هر پایپ وګورئ. بیا هم یې بدلوم؟';
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
$ec_lang['lpn_field_closed_tip']='دا پایپ بند کړئ ترڅو هیڅ اوبه ترې تیرې نشي. پایپ په نقشه کې پاتې کیږي او خپلې ټولې شمېرې ساتي، او تاسو یې هر وخت بېرته خلاصولی شئ.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='طول البلد';
$ec_lang['lpn_field_lat']='عرض البلد';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='شمال‌والی';
$ec_lang['lpn_field_easting']='ختیځ‌والی';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='ش';
$ec_lang['lpn_field_easting_abbr']='خ';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='عرض';
$ec_lang['lpn_field_lon_abbr']='طول';
// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='د دې نقطې د دقیق ځای ټاکلو لپاره یو همغږۍ ځای ولیکئ. په یوه سناریو کې دا ځای یوازې په هغې سناریو کې پلي کیږي، لکه راکشول؛ په اساس کې دا نقطه په هره سناریو کې ځای پر ځای کوي.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='دا نقشې نه بهر دی. د Pseudo Mercator عرض البلد له -85.05 نه 85.05 پورې دی او طول البلد له -180 نه 180 پورې دی.';
$ec_lang['lpn_field_text_size']='د اندازې ضریب';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='پر ټولو زوم کچو ښودل';
$ec_lang['lpn_field_text_all_zoom_tip']='دا متن په انځور کې وساتئ که څومره هم زوم لرې کړئ. یې پاک کړئ ترڅو متن د نورو لیبلونو سره پټ شي کله چې لید د نقشې او پاڼې لاندې ټاکل شوي د لیبل کولو حد نه پلن شي.';
$ec_lang['lpn_tool_labels']='لیبلونه';
$ec_lang['lpn_labels_heading_node']='د نقطو لیبلونه';
$ec_lang['lpn_labels_heading_link']='د تړاو لیبلونه';
$ec_lang['lpn_labels_mark_extrema']='لوړ ترین او ټیټ ترین ارزښتونه نښه کول';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='په نقشه کې د هر لیبل شوي ځانتیا لوړ ترین ارزښت د هغه پورته یوې کرښې سره (پاسنۍ کرښه)، او ټیټ ترین ارزښت د هغه لاندې یوې کرښې سره (لاندنۍ کرښه) نښه کړئ.';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='ټولو ته پلي کول';
$ec_lang['lpn_settings_apply_to_all_tip']='د دې ډول هره شتمنۍ چې لا دمخه رسم شوې د دې متن سره پیلیدونکی ID ترلاسه کوي. هره یوه خپله شمېره ساتي. هغه ID چې په شمېره نه پای ته رسیږي نه بدلیږي.';
$ec_lang['lpn_confirm_apply_prefix']='{n} عناصر بېرته نومول شي ترڅو د دوی IDs د {prefix} سره پیل شي؟ هر یو خپله شمېره ساتي.';
$ec_lang['lpn_prefix_applied']='{n} شتمنۍ بیا نومول شوې. {skipped} نورې نه دي بدلې شوې.';
$ec_lang['lpn_labels_suffix_gradient_tip']='هغه متن چې په نقشه لیبلونو کې د سر ضیاع د تدریج وروسته اضافه کیږي. دلته د سلنې نښه مه لیکئ. کله چې واحدونه سلنه وي دا پخپله اضافه کیږي.';
$ec_lang['lpn_labels_separator']='د ارزښتونو ترمنځ متن';
$ec_lang['lpn_labels_separator_tip']='پر یوه لیبل د یوه ملکیت او راتلونکي ترمنځ متن. تلواله یوه تشه ده.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='لومړیتوب';
// Edited by TGH 2026-09-07
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='هغه ترتیب چې په هغه کې ارزښتونه پرېښودل کیږي کله چې لیبل نه ځایږي. هغه ارزښت چې شمېره یې 1 ده لومړی پرېښودل کیږي. کله چې یوازې یو ارزښت پاتې وي او دوه لیبلونه لا هم سره یوځای شي، یو یې پټیږي: هغه چې ټیټه غوښتنه لري، فشار یې د لړې منځ ته نږدې وي، یا لوړوالی یا هیډ یې ګاونډیو نقطو ته ډیر ورته وي.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='مخکې';
$ec_lang['lpn_labels_col_after']='وروسته';
$ec_lang['lpn_labels_col_decimals']='عشریې';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='ښودل';
$ec_lang['lpn_labels_show_tip']='هغه ترتیب چې ارزښتونه پکې پر لیبل ښکاره کیږي. شمېره 1 لرونکی ارزښت لومړی راځي: د یوه ډډ شوي لیبل پورتنۍ برخه کې، او د یوې کرښې لیبل پیل کې.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='واحدونه کارول';
$ec_lang['lpn_labels_use_units_tip']='وټاکئ ترڅو واحد په وروسته بکس کې او په لیبل کې وښودل شي، او کله چې واحدونه بدلیږي تازه شي. د خپل وروسته متن د لیکلو لپاره یې پاک کړئ.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='پیل حالت';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='د نقطو رنګونه';
$ec_lang['lpn_settings_sym_link_colors']='د تړاونو رنګونه';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='شاليد انځور…';
$ec_lang['lpn_backdrop_add']='اضافه کول';
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
$ec_lang['lpn_backdrop_scale']='په نقطو مقیاس ټاکل';
$ec_lang['lpn_backdrop_scale_entry']='د نقشې همغږۍ دوتنې یا د یو پیکسل اندازې له مخې مقیاس';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='له اوسنۍ اندازې نه مقیاس، د یوې نقطې شاوخوا چې تاسو یې غوره کوئ';
$ec_lang['lpn_backdrop_scale_from_prompt1']='په شاليد انځور کې هغه نقطه وټاکئ چې باید په خپل ځای پاتې شي.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='له خپلې اوسنۍ اندازې نه مقیاس. 1 یې ورته ساتي، 1.1 یې 10٪ لویه کوي، 0.9 یې 10٪ کوچنۍ کوي.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='د نقشه کې د یو پیکسل اندازه ولیکئ، یا د انځور د نقشې همغږۍ دوتنې بشپړ منځپانګه پیسټ کړئ';
$ec_lang['lpn_backdrop_scale_entry_bad']='د نقشه کې د یو پیکسل اندازې لپاره یو عدد ولیکئ، یا د نقشې همغږۍ دوتنې ټولې شپږ کرښې پیسټ کړئ.';
$ec_lang['lpn_backdrop_wld_bad']='دا د نقشې همغږۍ دوتنه انځور څرخوي، منعکس کوي، یا يې په ناورته ډول غزوي. نقشه یوازې کولی شي انځور ولیږدوي او په دواړو لورو کې يې يو شان اندازه بدله کړي، نو دا دوتنه و نه کارول شوه.';
$ec_lang['lpn_backdrop_unreadable']='ستاسو براوزر دا انځور نه شي ښودلی. دا د PNG یا JPEG په بڼه خوندي کړئ او بیا یې ورزیات کړئ.';
$ec_lang['lpn_backdrop_position']='لیږدول';
$ec_lang['lpn_backdrop_remove']='لرې کول';
$ec_lang['lpn_backdrop_remove_confirm']='شاليد انځور لرې کړئ؟';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='د نړۍ نقشه…';
$ec_lang['lpn_map_attach_tip']='د نړۍ نقشه دې پروژې سره نښلوئ پرته له دې چې دا په بل ډول بدله کړئ.';
$ec_lang['lpn_map_attach_add']='نښلول';
$ec_lang['lpn_map_attach_readjust']='بیا تنظیمول';
$ec_lang['lpn_map_attach_readjust_tip']='د نقشې نښلولو پروسې دویم ګام ته بېرته لاړ شئ.';
$ec_lang['lpn_map_attach_scale_from']='د اوسنۍ اندازې نه اندازه بدلول…';
$ec_lang['lpn_map_attach_scale_from_prompt']='نقشه د خپلې اوسنۍ اندازې نه اندازه بدل کړئ، ستاسو د انځور شاوخوا منځ نه. 1 یې هماغسې ساتي، 1.1 یې 10% لویه کوي، 0.9 یې 10% کوچنۍ کوي.';
$ec_lang['lpn_map_attach_scale_from_bad']='یوه واحده شمېره ولیکئ چې له صفر نه زیاته وي.';
$ec_lang['lpn_map_attach_scale_from_done']='د نقشې اندازه بدله شوه، او ستاسو انځور او هر همغږۍ پکې دقیقاً هماغسې دي لکه چې وو.';
$ec_lang['lpn_map_attach_none']='تر اوسه دې پروژې سره هیڅ د نړۍ نقشه نښلول شوې نه ده. لومړی نقشه، د نړۍ نقشه، نښلول وکاروئ.';
$ec_lang['lpn_map_attach_remove']='بېلول';
$ec_lang['lpn_map_attach_remove_tip']='د نړۍ نقشه بېلول. شبکه نه اغیزمنوي.';
$ec_lang['lpn_map_attach_done']='د نړۍ نقشه اوس د انځور شاته ښودل کیږي، او پروژه نه ده بدله شوې. د لرې کولو لپاره Map، World map، Detach وکاروئ.';
$ec_lang['lpn_map_attach_removed']='د نړۍ نقشه بېله شوه، او شبکه نه ده اغیزمنه شوې.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='انځور د ټولې نړۍ پر نقشه دی، په سمندر کې په صفر عرض البلد او صفر طول البلد. لومړی د پروژې ځای ومومئ: د انځور شاته نقشه خوځوئ او زوم کړئ، د ځای نوم ولټوئ، یا عرض البلد او طول البلد ولیکئ. انځور پخپله نه خوځي.';
$ec_lang['lpn_mapgeo_step1']='ګام 1 د 2: د پروژې ځای ومومئ';
$ec_lang['lpn_mapgeo_step2']='ګام 2 د 2 نه: نقشه د خپل انځور شاته برابره کړئ';
$ec_lang['lpn_mapgeo_hint1']='د انځور شاته نقشه خوځوئ او زوم کړئ، یا یو ځای ولټوئ، یا عرض البلد او طول البلد ولیکئ. بیا نږدې ځای پر ځای کول ووهئ.';
$ec_lang['lpn_mapgeo_readjust_intro']='ستاسو انځور هلته دی چیرته چې تاسو وروستی ځل ایښی و. بل ځای ته د لیږدولو لپاره، د انځور شاته نقشه خوځوئ او زوم کړئ، د ځای نوم ولټوئ، یا عرض البلد او طول البلد ولیکئ. انځور پخپله نه خوځي.';
$ec_lang['lpn_mapgeo_hint2']='هرچېرته راکاږئ ترڅو نقشه ستاسو د انځور لاندې سرسری کړئ. ستاسو انځور او هر همغږۍ پکې دقیقاً هلته پاتې کیږي چېرته چې دي. کله چې نقشه سمه وي دلته جغرافیایي حواله کول فشار کړئ.';
$ec_lang['lpn_mapgeo_gestures']='زوم ستاسو انځور او نقشه یوځای خوځوي، ترڅو وښیي چې دوی څومره سره برابر دي. راکشول یوازې نقشه خوځوي.';
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
$ec_lang['lpn_mapgeo_dial_turn']='نقشه ګرځول';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} درجې';
$ec_lang['lpn_mapgeo_dial_size']='د نقشې اندازه';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} چنده';
$ec_lang['lpn_mapgeo_dial_help']='دواړه پټې سرسری کړئ، یا د دوی پورته بکسونو کې شمېرې ولیکئ، ترڅو نقشه لویه یا کوچنۍ کړئ او وګرځوئ. د هرې پټې منځ د 1 ګام برابروالی ساتي، نو د 1 اندازه او د 0 ګرځېدنه یعنې هیڅ بدلون نشته. د غشي کیلي پر دواړو کار کوي.';
$ec_lang['lpn_mapgeo_place']='نږدې ځای پرځای کول';
$ec_lang['lpn_mapgeo_finish']='دلته جغرافیایي حواله کول';
$ec_lang['lpn_mapgeo_cancelled']='د نړۍ نقشه بېرته خپل مخکینی ځای ته راستنه شوه، او انځور ونه خوځېد.';
$ec_lang['lpn_mapgeo_locked']='د دلته جغرافیایي حواله کول تڼۍ سره بشپړ کړئ، یا لغوه کول فشار کړئ، مخکې لدې چې پروژې بدلې کړئ یا وساتئ. د نړۍ نقشه لاهم ځای پرځای کیږي.';
$ec_lang['lpn_backdrop_scale_prompt1']='په شاليد انځور کې دوه نقطې وټاکئ، لکه د مقیاس پټې دواړه سرونه. بیا د دوی ترمنځ اصلي واټن ولیکئ.';
$ec_lang['lpn_backdrop_scale_prompt2']='د دوو ټکو ترمنځ اصلي واټن';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='د لیږد لپاره اساسي نقطه (په انځور کې) وټاکئ.';
$ec_lang['lpn_backdrop_position_prompt2']='د موخې نقطې لپاره طریقه غوره کړئ، بیا دوام ټاکئ.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='شاليد انځور تنظیمیږي.';
$ec_lang['lpn_backdrop_target_label']='هغه نقطه دې ته ولیږئ:';
$ec_lang['lpn_backdrop_target_node']='یوه نقطه';
$ec_lang['lpn_backdrop_target_free']='په نقشه کې هره نقطه';
$ec_lang['lpn_backdrop_target_coords']='هغه همغږي چې تاسو یې لیکئ';
$ec_lang['lpn_backdrop_coords_prompt']='هغه X,Y ولیکئ چې هغه نقطه دې ورته لاړ شي';
$ec_lang['lpn_backdrop_continue']='دوام ورکړئ';
$ec_lang['lpn_tool_settings']='تنظیمات';
$ec_lang['lpn_settings_show_titles']='د پاڼې سرلیکونه ښودل';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='دا سرلیکونه پټ کړئ';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='د ټاکنې مرسته وښایاست';
$ec_lang['lpn_settings_area_hint_tip']='هغه پوښتنه په نقشه کې وښایاست چې د ساحې د ټاکلو پر مهال راتلونکی ګام ورکوي.';
$ec_lang['lpn_settings_id_prefixes']='د ID مختصرات';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='د جوړولو ارزښتونه';
$ec_lang['lpn_settings_defaults_note']='د هغو عناصرو لپاره کارول کیږي چې تاسو یې له اوسه راروسته جوړوئ. شتون لرونکي عناصر نه بدلیږي.';
$ec_lang['lpn_settings_push_note']='یوازې هغه ملکیتونه چې اوس یې لیبلونه ښکاري پلي کیږي.';
$ec_lang['lpn_settings_push_btn']='دا نوي-عنصر ارزښتونه پر هر شتون لرونکي عنصر پلي کړئ';
$ec_lang['lpn_push_confirm']='دا ځانتیاوې په هره موجوده شتمنۍ کې د نوو شتمنیو لپاره اوس ټاکل شویو ارزښتونو سره بدل شي؟ هغه ارزښتونه چې تاسو لیکلي دي پرې لیکل کیږي. دا بېرته کیدی شي.';
$ec_lang['lpn_push_properties']='ملکیتونه:';
$ec_lang['lpn_push_assets']='نقطې او پایپونه:';
$ec_lang['lpn_push_none_displayed']='اوس هیڅ پیل ارزښت د لیبل په توګه نه ښکاري، نو دلته د پلي کیدو لپاره هیڅ شی نشته. د لیبلونو پینل کې د هغو ملکیتونو لیبلونه فعال کړئ چې غواړئ، بیا بیا هڅه وکړئ.';
$ec_lang['lpn_push_nothing']='هیڅ شتون لرونکي عنصر پلي کیدونکو ملکیتونو نه هیڅ یو نلري.';
$ec_lang['lpn_push_no_change']='هر شتون لرونکی عنصر دمخه دا ارزښتونه لري، نو هیڅ به نه بدلیږي.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='دودیز ځانتیاوې';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='د کارونکي ټاکل شوې ځانتیاوې. د نورو ټولو ځانتیاوو په څېر د پروژې او سناریوګانو سره ساتل کیږي.';
$ec_lang['lpn_cp_design']='ډیزاین';
$ec_lang['lpn_cp_design_tip']='د هرې دودیزې ځانتیا لپاره یوه کرښه، او هره یې دا ښیي: کیلي، لیبل، پلي کیږي په، تصدیق کول د، اجازه یا محدودول، هغه کرکټرونه ساحه چې د هغه انتخاب له مخې نومول شوې، د اوږدوالي ښکته حد، د اوږدوالي پورته حد، ټیټ حد، لوړ حد.';
$ec_lang['lpn_cp_add']='دودیزه ځانتیا اضافه کول';
$ec_lang['lpn_cp_add_tip']='ډیزاین جدول ته یوه کرښه اضافه کوي او د سمون لپاره یې پرانیزي.';
$ec_lang['lpn_cp_remove_tip']='دا ځانتیا د ډیزاین جدول نه لرې کوي. هغه ارزښتونه چې تاسو یې مخکې خپلو شتمنیو کې لیکلي فایل کې ساتل کیږي او بیرته راځي که تاسو هماغه کیلي بیا ډیزاین کړئ.';
$ec_lang['lpn_cp_none']='تر اوسه هیڅ دودیزه ځانتیا ډیزاین شوې نه ده.';
$ec_lang['lpn_cp_unnamed']='تر اوسه نومول شوی نه دی';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='کیلي';
$ec_lang['lpn_cp_key_tip']='کیلي: یوه ځانتیا دې نوم لاندې ذخیره کیږي. خالي ځایونه اجازه نلري، او یو مخوند تاسو ته اضافه کیږي ترڅو ستاسو کیلي هیڅکله له یوې جوړې ساحې سره ټکر ونه کړي.';
$ec_lang['lpn_cp_label']='لیبل';
$ec_lang['lpn_cp_label_tip']='لیبل: په ځانتیاوو بکس کې، په لټون کې او د جدول د کالم په سر کې ښکاري.';
$ec_lang['lpn_cp_applies']='پلي کیږي په';
$ec_lang['lpn_cp_applies_tip']='پلي کیږي په: د هغو شتمنیو د ID مخوندونو کوما بېل شوی لړلیک چې دا ځانتیا کاروي، لکه J,L,R.';
$ec_lang['lpn_cp_validate']='تصدیق کول د';
$ec_lang['lpn_cp_validate_tip']='تصدیق کول د: هغه بڼه چې یو سم ارزښت باید ولري. د توری د حالت قاعدې یوازې پر انګلیسي الفبا پلي کیږي. د هر ارزښت منلو لپاره "تصدیق مه کوئ" وټاکئ.';
$ec_lang['lpn_cp_restrict']='دا کرکټرونه محدود کړئ';
$ec_lang['lpn_cp_restrict_tip']='دا کرکټرونه منع کړئ:';
$ec_lang['lpn_cp_restrict_mode']='اجازه یا محدودول';
$ec_lang['lpn_cp_restrict_mode_tip']='اجازه یا محدودول: ورکړل شوي کرکټرونه یا یوازې هغه دي چې یو ارزښت یې کارولی شي یا هغه دي چې نشي کارولی.';
$ec_lang['lpn_cp_restrict_allow']='یوازې دا کرکټرونه اجازه ورکړئ';
$ec_lang['lpn_cp_minlength']='د اوږدوالي ښکته حد';
$ec_lang['lpn_cp_minlength_tip']='د اوږدوالي ښکته حد: هره لنډه ننوتنه نښه کیږي، چې دا ستاسو د خالي او نیمه لیکل شویو ننوتنو موندلو لاره ده.';
$ec_lang['lpn_cp_length']='د اوږدوالي پورته حد';
$ec_lang['lpn_cp_length_tip']='د اوږدوالي پورته حد: هره اوږده ننوتنه نښه کیږي.';
$ec_lang['lpn_cp_low']='ټیټ حد';
$ec_lang['lpn_cp_low_tip']='ټیټ حد: دا کوچنی ارزښت دی چې تاسو یې تمه لرئ. شمېرې د شمېرو په توګه او متن د لغتنامې ترتیب سره پرتله کیږي.';
$ec_lang['lpn_cp_high']='لوړ حد';
$ec_lang['lpn_cp_high_tip']='لوړ حد: دا لوی ارزښت دی چې تاسو یې تمه لرئ. شمېرې د شمېرو په توګه او متن د لغتنامې ترتیب سره پرتله کیږي.';
$ec_lang['lpn_cp_val_none']='تصدیق مه کوئ';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='شمېره .';
$ec_lang['lpn_cp_val_number_comma']='شمېره ,';
$ec_lang['lpn_cp_val_integer']='بشپړ عدد';
$ec_lang['lpn_cp_val_upper']='ټول لوی حروف';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} ارزښت عیناً همداسې ساتل کیږي لکه چې تاسو یې لیکلی و.';
$ec_lang['lpn_cp_bad_number']='دا ارزښت د دې ځانتیا لپاره اړین شمېره نه ده.';
$ec_lang['lpn_cp_bad_integer']='دا ارزښت د دې ځانتیا لپاره اړین بشپړ عدد نه دی.';
$ec_lang['lpn_cp_bad_case']='دا ارزښت د دې ځانتیا لپاره اړین ALL CAPS نه دی.';
$ec_lang['lpn_cp_bad_chars']='دا ارزښت یو داسې کرکټر کاروي چې دا ځانتیا اجازه نلري.';
$ec_lang['lpn_cp_bad_space']='سپینه ځای یوازې د نورو کرکټرونو ترمنځ اجازه لري.';
$ec_lang['lpn_cp_bad_minlength']='دا ارزښت د دې ځانتیا نه اجازه شوي حد نه لنډ دی.';
$ec_lang['lpn_cp_bad_length']='دا ارزښت د دې ځانتیا نه اجازه شوي حد نه اوږد دی.';
$ec_lang['lpn_cp_bad_low']='دا ارزښت د دې ځانتیا د ټیټ حد نه ښکته دی.';
$ec_lang['lpn_cp_bad_high']='دا ارزښت د دې ځانتیا د لوړ حد نه پورته دی.';
$ec_lang['lpn_cp_key_needed']='دې دودیزې ځانتیا ته یوه کیلي ورکړئ چې خالي ځایونه پکې نه وي.';
$ec_lang['lpn_cp_key_taken']='بله دودیزه ځانتیا دمخه هغه کیلي کاروي.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='سناریو';
$ec_lang['lpn_scenario_base']='اساس';
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
$ec_lang['lpn_scenario_overrides']='د دودیزو ارزښتونو شمېر';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='نصواري حلقه دا معنی لري چې دا عنصر یو ارزښت لري چې یوازې د سناریو {name} پورې اړوند دی.';
$ec_lang['lpn_scenario_overrides_tip']='هر یو له دې ارزښتونو نه پر نقشه د نصواري حلقې سره نښه شوی دی. {base} ته لاړ شئ ترڅو انځور پرته له دوی وګورئ.';
$ec_lang['lpn_scenario_menu']='سناریوګانې';
$ec_lang['lpn_scenario_tip']='هغه ارزښتونه چې انځور یې اوس ښیي او پاڼه یې اوس حلوي. د سناریوګانو بدلولو، یا د یوې اضافه کولو، نوم بدلولو، یا ړنګولو لپاره کلیک وکړئ.';
$ec_lang['lpn_scenario_new']='نوی سناریو…';
$ec_lang['lpn_scenario_new_name']='سناریو {n}';
$ec_lang['lpn_scenario_prompt_name']='د دې سناریو لپاره نوم';
$ec_lang['lpn_scenario_rename']='د سناریو نوم بدلول…';
$ec_lang['lpn_scenario_delete']='سناریو ړنګول';
$ec_lang['lpn_scenario_delete_confirm']='سناریو {name}، او هغه {n} ارزښتونه چې یوازې ورسره اړه لري، ړنګ کړم؟ خپل انځور نه بدلیږي.';
$ec_lang['lpn_scenario_override']='یوازې په دې سناریو کې';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='چک شوی یې معنی دا ده چې دا ارزښت یوازې دې سناریو پورې اړه لري، حتی که ورته شمېره وي لکه اساس کې. بکس پاک کړئ ترڅو بېرته د اساس ارزښت وکارول شي.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='د اساس سناریو: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} په {scenario} کې د شبکې نه بهر دی. دا لاهم په انځور کې دی، او ستاسو په نورو سناریوګانو کې هم.';
$ec_lang['lpn_scenario_push_btn']='د اساس ارزښتونه ټولو سناریوګانو ته پلي کول';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='هره سناریو د هغو ملکیتونو لپاره چې اوس یې لیبلونه ښکاره دي، بېرته د اساس ارزښت ته ورځي. هغه ارزښتونه چې یوازې دې سناریوګانو پورې اړه لري، غورځول کیږي.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='ټولې سناریوګانې دې ملکیتونو لپاره د اساس ارزښتونه وکاروي؟ هغه ارزښتونه چې یوازې دې سناریوګانو پورې اړه لري، غورځول کیږي. تاسو دا بېرته کولی شئ.';
$ec_lang['lpn_scenario_push_scenarios']='اغیزمن شوي سناریوګانې:';
$ec_lang['lpn_scenario_push_values']='غورځول شوي ارزښتونه:';
$ec_lang['lpn_scenario_push_none']='هیڅ سناریو د دې ملکیتونو لپاره خپل ارزښت نلري، نو هیڅ به ونه بدلیږي. هیڅ شی نه غورځول کیږي.';
$ec_lang['lpn_scenario_preset_flow_static']='1. د بهاو ازموینه: ثابت';
$ec_lang['lpn_scenario_preset_flow_static_tip']='د ډیزاین شبکې لپاره د بهاو ازموینې کالیبریشن په 0 بهاو کې. پدې سناریو کې په ټولو جنکشنونو کې تقاضا 0 وټاکئ.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. د بهاو ازموینه: منځنی';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='د ډیزاین شبکې لپاره د بهاو ازموینې کالیبریشن په لومړي راپور شوي بهاو کې. پدې سناریو کې په بهیدونکي جنکشن کې تقاضا د لومړي اندازه شوي بهاو سره برابره کړئ، او په نورو ټولو جنکشنونو کې 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. د بهاو ازموینه: اعظمي';
$ec_lang['lpn_scenario_preset_flow_max_tip']='د ډیزاین شبکې لپاره د بهاو ازموینې کالیبریشن په راپور شوي اعظمي بهاو کې. پدې سناریو کې په بهیدونکي جنکشن کې تقاضا د اندازه شوي اعظمي بهاو سره برابره کړئ، او په نورو ټولو جنکشنونو کې 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. منځنۍ ورځ';
$ec_lang['lpn_scenario_preset_average_day_tip']='د تقاضا ضریب 1: هره تقاضا لکه څنګه چې داخله شوې، چې د منځنۍ ورځې تقاضا ګڼل کیږي.';
$ec_lang['lpn_scenario_preset_max_day']='5. اعظمي ورځ';
$ec_lang['lpn_scenario_preset_peak_hour']='6. د لوړې تقاضا ساعت';
$ec_lang['lpn_scenario_preset_fire_max_day']='7. اور او اعظمي ورځ';
$ec_lang['lpn_scenario_preset_fire_max_day_tip']='د اعظمي ورځې تقاضا (ضریب 2.0). پدې سناریو کې د اور د بهاو تحلیل چلوئ: دا په هر جنکشن کې د اور بهاو پر دې تقاضا زیاتوي.';
$ec_lang['lpn_delete_drops_overrides']='د دې عنصر ړنګول هم هغه {n} ارزښتونه غورځوي چې ستاسو سناریوګانې ورته لري. دوام ورکړم؟';
$ec_lang['lpn_push_base_only']='دا کړنه پخپله انځور بدلوي، نو دا یوازې په {base} کې کیدی شي. {base} ته لاړ شئ او بیا هڅه وکړئ.';
$ec_lang['lpn_field_active']='فعال دی؟';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='دا بکس پاک کړئ ترڅو شتمني په انځور کې پاتې شي خو له شبکې نه بهر وي: دا خړ رسمیږي او حل کوونکی یې له پامه غورځوي. په یوه سناریو کې یو پایپ همداسې فعالیږي او غیرفعالیږي.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='د شبرنګ اسي';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='د EPANET د وریز په معادله کې توان د سپرینکلرونو او ورېدو لپاره: بهاو = کوفیشنټ x فشار چې دې توان ته پورته شوی. دا یوازې په هغو نقطو کې پایلې اغیزمنوي چې د وریز کوفیشنټ لري.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='DEM ولولئ';
$ec_lang['lpn_elev_dem_sample_tip']='په دې نقطه کې د DEM لوړوالی ولولئ او لاندې یې وښایاست. د لوړوالي په بکس کې هیڅ شی نه بدلیږي. د DEM افقي جدايي د ځمکې د ډېرې برخې لپاره شاوخوا 30 متره ده، او چیرته چې ښه معلومات شتون لري ډېر دقیق ده.';
$ec_lang['lpn_elev_dem_use']='DEM وکاروئ';
$ec_lang['lpn_elev_dem_use_tip']='په دې نقطه کې د DEM لوړوالی پورته د لوړوالي بکس کې ږدئ، هغه څه چې هلته دي بدلوي. که DEM تر اوسه نه وي لوستل شوی، لومړی لوستل کیږي. یو Undo یې بېرته راولي.';
$ec_lang['lpn_elev_dem_none']='DEM د دې نقطې لپاره هیڅ لوړوالی نلري.';
$ec_lang['lpn_elev_dem_said']='د Mapbox DEM لوړوالی: {v} {u}.';
$ec_lang['lpn_settings_elev_source']='د لوړوالي سرچینه';
$ec_lang['lpn_settings_elev_source_tip']='د 2026 Mapbox DEM افقي او عمودي دقت په متحده ایالاتو کې 1–10 م او <1 م، په اروپا او جاپان کې 2–10 م او 1–3 م، په نړۍ کې 30 م او 10–16 م، او په قطبونو کې 90 م او >16 م دی.';
$ec_lang['lpn_settings_elev_source_typed']='پورته';
$ec_lang['lpn_settings_elev_source_dem']='د Mapbox DEM';
$ec_lang['lpn_settings_accuracy']='دقت';
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
$ec_lang['lpn_settings_default_is']='تلواله ارزښت {n} دی.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='د همغږیدو حد چې حل کوونکی باید مخکې له ودریدو ورته ورسیږي، د یوه آزمایښت نه بل ته د بهاو ټول بدلون په توګه اندازه شوی، چې په تړاوونو کې په ټول بهاو ویشل کیږي. کوچنۍ شمېره ډېره دقیقه ده او ډېر وخت نیسي.';
$ec_lang['lpn_settings_specific_gravity']='ځانګړی وزن';
$ec_lang['lpn_settings_viscosity']='نسبي غلظت';
$ec_lang['lpn_settings_viscosity_tip']='د مایع غلظت د 20 درجو سانتي‌ګریډ اوبو سره پرتله شوی. دا یوازې د Darcy-Weisbach طریقې لاندې پایله بدلوي.';
$ec_lang['lpn_settings_trials']='اعظمي هڅې';
$ec_lang['lpn_settings_trials_tip']='د آزمایښتونو اعظمي شمېر مخکې له دې چې حل کوونکی په هغې شبکې کې ودریږي چې نه همغږیږي.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='که یووالي ته ونه رسیږي';
$ec_lang['lpn_settings_unbalanced_tip']='د هغې شبکې لپاره عمل چې خپل آزمایښتونه یې پای ته رسولي او لا هم نه ده همغږي شوې. اضافي آزمایښتونو ته اجازه ورکول ډېری وخت همغږیدو ته رسیږي. ودرول وروستی آزمایښت لکه څنګه چې دی راپور کوي، کوم چې حل نه دی.';
$ec_lang['lpn_settings_unbalanced_continue']='اضافي هڅو ته اجازه ورکړئ';
$ec_lang['lpn_settings_unbalanced_stop']='ودرېږئ او وروستی هڅه راپور کړئ';
$ec_lang['lpn_settings_unbalanced_trials']='د راپور نه مخکې اضافي هڅې';
$ec_lang['lpn_settings_unbalanced_trials_tip']='د نورو آزمایښتونو شمېر چې د پورتني اعظمي حد له ختمیدو وروسته اجازه ورکول کیږي، مخکې له دې چې وروستی آزمایښت راپور شي.';
$ec_lang['lpn_settings_head_error']='د هیډ تیروتنې حد';
$ec_lang['lpn_settings_head_error_tip']='یوه اضافي ازموینه چې حل کوونکی باید مخکې لدې چې ودریږي یې تیر شي: په هر یو پایپ کې پاتې غټه هیډ تیروتنه. صفر معنی لري چې دا ازموینه پلي نه شي. یوازې د EPANET حل کوونکی دا بکس لولي.';
$ec_lang['lpn_settings_flow_change']='د بهاو بدلون حد';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='یوه اضافي ازموینه چې حل کوونکی باید مخکې لدې چې ودریږي یې تیر شي: د یو تکرار نه بل تکرار ته د یو پایپ د بهاو اعظمي بدلون. صفر معنی لري چې دا ازموینه پلي نه شي. یوازې د EPANET حل کوونکی دا بکس لولي.';
$ec_lang['lpn_settings_damp_limit']='کمښت پیل کیږي په';
$ec_lang['lpn_settings_damp_limit_tip']='هغه دقت چېرته چې حل کوونکی کوچني ګامونه اخیستل پیلوي، کوم چې یوې لړزیدونکې شبکې ته د یووالي ته رسیدو کې مرسته کوي. صفر معنی لري چې حل کوونکی هیڅکله کمښت نه کوي. یوازې د EPANET حل کوونکی دا بکس لولي.';
$ec_lang['lpn_settings_option_unset']='نه دی ویل شوی';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='یو واحد فکتور چې په یو وخت کې په شبکه کې په هره غوښتنه پلي کیږي. هره سناریو کولی شي جلا ارزښت ولري، نو منځنۍ ورځ، اعظمي ورځ، یا لوړ ساعت یوازې د دې ټاکنې په بدلولو سره جوړیدی شي.';
$ec_lang['lpn_settings_engine_native']='کله چې امکان ولري دننه جوړ شوی حل کوونکی وکاروئ';
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
$ec_lang['lpn_settings_engine_native_tip']='دا فعاله کړئ ترڅو د امکان په صورت کې دننه جوړ شوی حل کوونکی وکارول شي. که نه، تل د متحده ایالاتو EPA د EPANET حل کوونکی کارول کیږي. دننه جوړ شوی حل کوونکی د اوږدې مودې سمولېشن یا فعالو PRV، PSV، یا FCV لپاره نه کارول کیږي. لومړی ځل چې د EPANET حل کوونکی کارول کیږي، شاوخوا 650 KB ډاونلوډ کیږي او بیا پدې وسیله کې ساتل کیږي. چیرته چې یو پایپ کوچنۍ (ځایی) ضیاع لري، دواړه حل کوونکي په وروستیو رقمونو کې توپیر لري: EPANET د جاذبې د چټکتیا ګرد شوی ارزښت کاروي، نو د هغه کوچنۍ ضیاع د دقیقې بڼې په پرتله ډېره لږ ټیټه ده.';
$ec_lang['lpn_engine_loading']='د EPANET حل کوونکی پورته کیږي…';
$ec_lang['lpn_engine_failed']='د EPANET حل کوونکی نشو پورته کیدی. د اندروني حل کوونکي ښودل کیږي.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='د EPANET حل کوونکي سره حل شو، د دې فشار او بهاو کنټرول والوونو له امله:';
$ec_lang['lpn_unit_unknown']='دا رسم یو واحد بیانوي چې دا پاڼه یې نه وړاندې کوي: {unit}. هرڅه لکه څنګه چې راغلي ساتل او ښودل کیږي، او هیڅ شی نه دی بدل شوی. تر هغه پورې چې دا پاڼه هغه واحد نه پیژني هیڅ ځواب نشي ورکړل کیدی، ځکه چې د هغه د اندازې پوهیدو لاره نشته.';
$ec_lang['lpn_engine_manning_note']='یادونه: د مانینګ خشونت سره، EPANET د مانینګ په معادله کې ثابت ګرد کوي، نو د سر ضیاع د دقیقې بڼې په پرتله شاوخوا 0.6٪ ټیټه ده.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='د EPANET حل کوونکي دا شبکه رد کړه، نو چلول پیل نه شو.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='د EPANET حل کوونکي پیغام: {message}';
$ec_lang['lpn_engine_refused_fallback']='د پرده شمېرې پرځای د دننه ورکړل شوي حل کوونکي نه راغلې.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='په سکرین کې شمېرې پر ځای یې له دننه جوړ شوي حل کوونکي څخه راغلې. دا یو وخت یوازې یوه شېبه حلوي، نو دا شبکه یوازې په {time} کې ده، هر ټانک په خپله پیل کچه.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='دا کنترولونه یو داسې عنصر نوموي چې نور په دې پروژه کې نشته، نو دا پرېښودل شول: {ids}';
$ec_lang['lpn_control_unreadable_note']='دا کنترولونه نشول لوستل کیدی، نو دا پرېښودل شول: {ids}';
$ec_lang['lpn_rule_dangling_note']='دا قواعد یو داسې عنصر ته اشاره کوي چې نور پدې پروژه کې نشته، نو دوی پدې چلون کې پرېښودل شول: {ids}';
$ec_lang['lpn_rule_unreadable_note']='دا قواعد نه شول لوستل کیدلی، نو دوی پدې چلون کې پرېښودل شول: {ids}';
$ec_lang['lpn_settings_text_size']='د متن اندازه (پیکسلونه)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='د نښې اندازه (پیکسلونه)';
$ec_lang['lpn_settings_link_width']='د پایپ کرښې پلنوالی (پیکسلونه)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='د بهاو لوري غشي';
$ec_lang['lpn_settings_show_arrows_tip']='په هر پایپ یو غشی رسم کړئ چې ښیي اوبه کوم لوري ته بهیږي. غشي د چلولو وروسته ښکاره کیږي، او بندول یې پایلې نه بدلوي.';
$ec_lang['lpn_settings_align_labels']='د پایپ لیبلونه له پایپونو سره برابرول';
$ec_lang['lpn_settings_readability_bias']='کله چې لیبل د عمودي حالت نه کیڼ لور ته له دومره درجو زیات کوږ شي، لیبل کوز-پاس کول';
$ec_lang['lpn_settings_readability_bias_tip']='کله چې یو لیبل له عمودي حالت نه کیڼ لور ته له دې شمېر درجو زیات کوږ شي، هغه دوباره کوز-پاس کړئ ترڅو سمه ولاړ پاتې شي.';
$ec_lang['lpn_settings_mask_labels']='د لیبلونو شاته کلک شاليد';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='د لارښود کرښې ټاکل شویو زاویو سره نښلول';
// Edited by TGH 2026-09-07
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='لیبلونه وښایاست کله چې دې نقشې پلنوالي یا لږ ته زوم شوی وي';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='لیبلونه یوازې هغه وخت رسمیږي کله چې د نقشې لید دومره پلن یا تنګ وي. بکس خالي پرېږدئ ترڅو یې په هر زوم رسم کړئ. 0 ولیکئ ترڅو په هیڅ زوم کې هیڅکله لیبل رسم نه شي.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='تل ښودل';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap_sentence']='نقطې د دومره اندازې نه ډیرې مه لویوئ: {n} چنده د {p} پرسنټایل پایپ اوږدوالي';
$ec_lang['lpn_settings_symbol_cap_tip']='جنکشنونه د سکرین اندازه ساتل بندوي کله چې د نقشې قطر یې د شبکې د ټولو پایپونو اوږدوالو په دې پرسنټایل کې د پایپ د اوږدوالي دومره ځله شي. له هغه ټکي وروسته په نقشه کې، جنکشنونه، پایپونه او نور سمبولونه په سکرین کې کوچني کیږي کله چې تاسو زوم لرې کوئ. ذخیرې او ټانکونه استثنا دي او په هر زوم کې خپل د سکرین اندازه ساتي.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='د نښې روڼوالی (0 نه 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='د شاليد انځور روڼوالی (0 نه 1)';
$ec_lang['lpn_settings_map_display']='بڼه';
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
$ec_lang['lpn_settings_legend_position']='د کلید جدول ځای';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='هیڅ یو';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='بند';
$ec_lang['lpn_settings_legend_top_left']='پورته کیڼ';
$ec_lang['lpn_settings_legend_top_right']='پورته ښي';
$ec_lang['lpn_settings_legend_middle_left']='منځ کیڼ';
$ec_lang['lpn_settings_legend_middle_right']='منځ ښي';
$ec_lang['lpn_settings_legend_bottom_left']='لاندې کیڼ';
$ec_lang['lpn_settings_legend_bottom_right']='لاندې ښي';
$ec_lang['lpn_settings_color_node_field']='د نقطې رنګ';
$ec_lang['lpn_settings_color_link_field']='د پایپ رنګ';
$ec_lang['lpn_settings_color_ramp']='د رنګ سکیم';
$ec_lang['lpn_settings_color_credits']='منندویتوبونه';
$ec_lang['lpn_color_ramp_epanet']='نیلي تر سور (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='بنفش تر ژیړ (یو رنګ له بل نه اسانه پیژندل کیدی شي)';
$ec_lang['lpn_color_ramp_gray']='رڼا نه تر تیارې خړ رنګ';
$ec_lang['lpn_settings_color_reverse']='د رنګ ترتیب بدلول';
$ec_lang['lpn_color_none']='هیڅ رنګ نه';
$ec_lang['lpn_settings_color_key_position']='د رنګ کلید ځای';
$ec_lang['lpn_settings_color_breaks']='د رنګ ټکو پولې';
$ec_lang['lpn_settings_color_equal_intervals']='مساوي وقفې';
$ec_lang['lpn_settings_color_equal_counts']='مساوي شمېرې';
$ec_lang['lpn_settings_color_no_values']='تر اوسه د کار لپاره هیڅ ارزښت نشته. لومړی شبکه حل کړئ.';
$ec_lang['lpn_confirm_restore_defaults']='ټول تنظیمات (د ID مختصرات، پیل ارزښتونه، د حل کوونکي تنظیمات، د نقشې بڼه، د کلید جدول ځای، او ښکاره لیبلونه) خپلو اصلي ارزښتونو ته بېرته کړئ؟ ستاسو شبکه نه بدلیږي. تنظیمات پرانیستې پروژې پورې اړه لري، نو ستاسو نورې پروژې خپل تنظیمات ساتي.';
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
$ec_lang['lpn_settings_wipe_btn']='له سره پیل وکړئ';
$ec_lang['lpn_confirm_wipe']='له سره پیل وکړئ، او د دې پاڼې لپاره هر ساتل شوی شی ړنګ کړئ: هره پروژه، هر شاليد انځور، ټول تنظیمات، او ستاسو د واحدونو انتخابونه؟ پاڼه به بیخي لکه یو نوی لیدونکی یې چې ویني بیا پورته شي. دا نشي بېرته کیدی.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='دا لینک کاپي کړئ:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='وخت';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='ټول د چلولو موده';
$ec_lang['lpn_time_hyd_step']='هایدرولیکي وخت ګام';
$ec_lang['lpn_time_pattern_step']='د نمونې وخت ګام';
$ec_lang['lpn_time_pattern_start']='د نمونې پیل وخت';
$ec_lang['lpn_time_report_step']='د راپور وخت ګام';
$ec_lang['lpn_time_report_start']='د راپور پیل وخت';
$ec_lang['lpn_time_clock_start']='د پیل ساعت وخت';
$ec_lang['lpn_time_clock_day']='ورځ {day}، {clock}';
$ec_lang['lpn_time_format_tip']='وخت د ساعتونو او دقیقو په بڼه ولیکئ، لکه 2:30. یوازې یوه شمېره ساعتونه معنی لري، نو 8 یعنې اته ساعته دي. نیم ساعت 0:30 دی.';
$ec_lang['lpn_time_running']='اوږدې مودې سمولېشن چلیږي.';
$ec_lang['lpn_time_no_engine']='دننه جوړ شوی حل کوونکی یو وخت یوازې یوه شېبه حلوي، نو دا شبکه یوازې په {time} کې ده: هر نمونه پر هغه شېبه لوستل کیږي، او هر ټانک په خپله پیل کچه پاتې کیږي پر ځای دې چې ډک او تش شي. یو ځل انټرنیټ سره وصل شئ ترڅو د EPANET حل کوونکی ډاونلوډ کړئ، چې اوږدې مودې سمولېشن چلوي.';
$ec_lang['lpn_time_slider']='د سناریو تیر شوی وخت';
$ec_lang['lpn_time_no_period']='دا پروژه هیڅ اوږدې مودې سمولېشن نه لري ټاکل شوی، نو یوازې یوه شیبه د ښودلو لپاره شته. د تنظیمات، محاسبه، وخت لاندې یو ټول چلولو وخت وټاکئ ترڅو اوږدې مودې سمولېشن وچلوئ.';
$ec_lang['lpn_time_first']='پیل ته لاړ شه';
$ec_lang['lpn_time_prev']='شاته ګام';
$ec_lang['lpn_time_play']='چلول';
$ec_lang['lpn_time_play_tip']='انیمیشن غځول';
$ec_lang['lpn_time_pause_tip']='انیمیشن درول';
$ec_lang['lpn_time_pause']='ودرول';
$ec_lang['lpn_time_next']='مخته ګام';
$ec_lang['lpn_time_last']='پای ته لاړ شه';
$ec_lang['lpn_time_tank']='ټانک';
$ec_lang['lpn_time_level']='د اوبو کچه';
$ec_lang['lpn_time_run']='محاسبه کول';
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
$ec_lang['lpn_time_run_done']='چلول بشپړ شول. د راپور ورکولو وختونه: {frames}. نیول شوی وخت: {secs} ثانیې.';
$ec_lang['lpn_time_runbox_hide']='دا بکس بیا مه ښیه';
$ec_lang['lpn_settings_runbox']='د چلولو پرمختګ بکس ښودل';
$ec_lang['lpn_settings_runbox_tip']='یو بکس چې راپور ورکوي چې یو چلونه څومره وړاندې تللی او څه یې موندلي دي. کله چې دا بند وي، یو بشپړ شوی چلونه د یو څو ثانیو لپاره ورته خبره د حالت کرښه کې وايي. دا د دې براوزر لپاره یو تنظیم دی، نه د پروژې لپاره.';
$ec_lang['lpn_time_run_failed']='چلول بشپړ نه شول، نو د وروستیو وختونو لپاره هیڅ پایلې نشته.';
$ec_lang['lpn_time_run_report']='د چلولو راپور';
$ec_lang['lpn_time_run_report_copy']='کاپي';
$ec_lang['lpn_time_run_report_copied']='کاپي شو';
$ec_lang['lpn_time_run_report_tip']='هغه راپور چې EPANET د وروستي چلولو لپاره لیکلی، لفظ په لفظ: آیا همغږي شو، او هر خبرداری. متن د EPANET حل کوونکي تولیدوي، نه دا پاڼه.';

$ec_lang['lpn_time_speed']='چټکتیا';
$ec_lang['lpn_time_speed_tip']='د چلولو چټکتیا';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='تنظیمات لټول';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='یوه کلمه یا څو کلمې ولیکئ ترڅو هغه تنظیمات ووینئ چې دا ټولې کلمې لري.';
$ec_lang['lpn_settings_no_match']='هیڅ تنظیم دا کلمه نلري.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='د تنظیماتو برخې لیست پلنوالی';
$ec_lang['lpn_rpane_empty']='دلته تر اوسه هیڅ شی نه دی ځای شوی. هرڅه چې ټولې پروژې پورې اړه لري په تنظیماتو کې دي.';
$ec_lang['lpn_time_settings_open']='د وخت تنظیمات';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='انځورول';
$ec_lang['lpn_settings_sec_map']='نقشه او پاڼه';
$ec_lang['lpn_settings_sec_assets']='عناصر';
$ec_lang['lpn_settings_sec_calculation']='محاسبه';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='مشتری';
$ec_lang['lpn_labels_customer_note']='د مشتري لیبل هغه ارزښتونه ښیي چې دلته ټاکل شوي. دا د نقشې پر نورو ټولو لیبلونو په ورته متن اندازه رسمیږي.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='د مشتریانو لیبلونه یوازې هغه وخت رسمیږي کله چې د نقشې لید دومره پلن یا تنګ وي. بکس خالي پرېږدئ ترڅو یې په هر زوم رسم کړئ. 0 ولیکئ ترڅو په هیڅ زوم کې هیڅکله د مشتري لیبل رسم نه شي. که دا د ټولو لیبلونو د ورته ټاکنې نه لوی وي هیڅ اغیز نه لري.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='اوسنی لید کارول';
$ec_lang['lpn_settings_page']='پاڼه';
$ec_lang['lpn_settings_hydraulics']='هایدرولیکس';
$ec_lang['lpn_settings_quality']='د اوبو کیفیت';
$ec_lang['lpn_settings_quality_track']='د کیفیت پارامیټر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='وټاکئ چې چلن به د پایپونو له لارې څه تعقیب کړي: اوبه سیسټم کې څومره موده وې، دوی له کومه راغلي، یا یوه کیمیاوي ماده چې د سفر پر مهال تعامل کوي. یوازې کیمیاوي ماده ته د کچو اړتیا ده.';
$ec_lang['lpn_settings_quality_source']='د تعقیب نقطه';
$ec_lang['lpn_settings_quality_source_tip']='هغه نقطه چې اوبه یې تعقیبیږي. هره بله نقطه بیا خپلو اوبو هغه برخه ښیي چې له هغې نقطې راغلې وه.';
$ec_lang['lpn_quality_none']='هیڅ شی';
$ec_lang['lpn_quality_trace']='د سرچینې تعقیب';
$ec_lang['lpn_quality_chemical']='یوه کیمیاوي ماده چې تعامل کوي';
$ec_lang['lpn_quality_needs_run']='د اوبو کیفیت د پایپونو له لارې د اوبو سفر سره وړل کیږي، نو دې ته اوږدې مودې سمولېشن اړتیا ده: د EPANET انجن او یو ټول چلولو وخت. د وخت لاندې یو ټول چلولو وخت وټاکئ، بیا د محاسبه کول تڼۍ کېکاږئ.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='کیمیاوي ماده او یوونې';
$ec_lang['lpn_quality_chemical_name_tip']='هغه کیمیاوي ماده چې رهیابي کیږي، د بېلګې په توګه کلورین. د EPANET ډیفالټ لیبل Chemical کارولو لپاره یې خالي پرېږدئ. په راپورونو کې ښکاري، خو په محاسبو کې نه کارول کیږي.';
$ec_lang['lpn_quality_mass_units']='د کتلې واحدونه';
$ec_lang['lpn_quality_mass_units_tip']='د کیفیت ننوتنې د واحدونو برخه، د EPANET له دوو انتخابونو څخه.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='د کیفیت زغم';
$ec_lang['lpn_quality_tolerance_tip']='د غلظت توپیر چې لاندې یې EPANET دوه څنګ پر څنګ د اوبو برخې یوه ګڼي. خالي د EPANET ډیفالټ 0.01 کاروي.';
$ec_lang['lpn_quality_diffusivity']='نسبي خپریدنه';
$ec_lang['lpn_quality_diffusivity_tip']='په اوبو کې د کیمیاوي مادې خپریدنه، د کلورین په نسبت. خالي د EPANET ډیفالټ 1.0 کاروي.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='د {chemical} غلظت';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='د {chemical} منځنی غلظت';
$ec_lang['lpn_quality_initial']='لومړنی کیفیت';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='کله چې چلول پیلیږي په دې نقطه کې د کیمیاوي مادې مقدار. یوه ذخیره دا ارزښت د ټول چلولو لپاره ساتي، چې معمولاً د تصفیې له کارخانې نه وتونکی پاتې مقدار پرې بیانیږي. خالي یعنې 0.';
$ec_lang['lpn_result_concentration']='غلظت';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='په دې ټکي کې د ترانسپورټ او تعامل وروسته د پاتې کیمیاوي مادې مقدار. واحدونه هغه دي چې په تنظیماتو، محاسبه، کیفیت کې د کیمیاوي مادې نوم سره ولیکل شوي.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='د سرچینې ډول';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='دا نقطه پر هغه اوبو باندې چې پرې تیریږي کوم ډول دوز پلي کوي. غلظت هغه اوبه چې دلته شبکې ته ننوځي د سرچینې کیفیت ارزښت ته رسیدونکې ګڼي. د حجم بوسټر هر دقیقه یوه اندازه کیمیاوي ماده اضافه کوي، بهاو هر څه هم وي. د ټاکلي کچې بوسټر دلته وتونکی غلظت د سرچینې کیفیت ارزښت ته پورته کوي او نه ورنه زیات. د بهاو تناسب بوسټر د سرچینې کیفیت ارزښت هغه ته اضافه کوي چې مخکې له مخکې په اوبو کې دی.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='هیڅ یو';
$ec_lang['lpn_source_type_concen']='غلظت';
$ec_lang['lpn_source_type_mass']='د حجم بوسټر';
$ec_lang['lpn_source_type_setpoint']='د ټاکلي کچې بوسټر';
$ec_lang['lpn_source_type_flowpaced']='د بهاو تناسب بوسټر';
$ec_lang['lpn_source_quality']='د سرچینې کیفیت';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='د دوز قوت. د کتلې بوسټر پرته د هر ډول لپاره دا غلظت دی، په هغو واحدونو کې چې د کیمیاوي مادې تر څنګ په تنظیماتو، محاسبه، کیفیت کې نومول شوي؛ د کتلې بوسټر لپاره دا په هره دقیقه کې د کتلې بهاو دی. خالي یعنې د کیمیاوي مادې سرچینه نشته، په کارکردي ډول له 0 سره برابره.';
$ec_lang['lpn_source_pattern']='د سرچینې نمونه';
$ec_lang['lpn_source_pattern_tip']='یوه وخت نمونه چې د چلون په اوږدو کې دوز پیمانه کوي، د یو داسې دوز لپاره چې ثابت نه وي. هیڅ نمونه پدې معنی ده چې دوز په هر ګام کې ورته دی.';
$ec_lang['lpn_mixing_model']='د ګډون ماډل';
$ec_lang['lpn_mixing_model_tip']='د هغې ماډل چې په دې ټانک کې لا دمخه شته اوبه له راتلونکو اوبو سره څنګه ګډیږي. بشپړ ګډیدل ټول راتلونکي اوبه سمدلاسه د ټانک له ټول حجم سره ګډوي. دوه-برخیز ګډیدل لومړی د ننوتلو سیمه ډکوي او اضافي اوبه اصلي سیمې ته لیږي. FIFO پلګ بهاو اوبه د رسیدو په ترتیب سره تشوي. LIFO پلګ بهاو یې ډیرې کوي، نو وروستۍ اوبه چې ننوتي لومړۍ وځي. دا انتخاب د اوبو عمر او پاتې مواد اغیزمنوي، نه فشار یا بهاو.';
$ec_lang['lpn_mixing_mixed']='بشپړ ګډون';
$ec_lang['lpn_mixing_2comp']='دوه-برخو ګډون';
$ec_lang['lpn_mixing_fifo']='FIFO د پلیستیک بهاو';
$ec_lang['lpn_mixing_lifo']='LIFO د پلیستیک بهاو';
$ec_lang['lpn_mixing_fraction']='د ګډون برخه';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='د ټانک حجم هغه برخه چې د ننوتلو سیمه یې نیسي، د 0 او 1 ترمنځ. یوازې دوه-برخو ګډون یې کاروي. یې خالي پرېږدئ او ټول ټانک د ننوتلو سیمه ده، چې EPANET همداسې ګڼي.';
$ec_lang['lpn_reaction_bulk']='د حجم تعامل کچه';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='د اوبو په ډله کې تعامل (د EPANET Help وګورئ)، د هر هغه پایپ او ټانک لپاره کارول کیږي چې انفرادي کوفیشنټ نه لري. منفي شمېره کیمیاوي ماده کموي او مثبته یې زیاتوي. خالي یعنې هیڅ د ډلې تعامل نشته.';
$ec_lang['lpn_reaction_wall']='د دیوال تعامل کچه';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='د پایپ دیوال کې تعامل، چې د هرې هغې پایپ لپاره کارول کیږي چې خپله کچه یې نلري. یو منفي شمېره کیمیاوي ماده کموي. تعامل لومړی درجه دی پرته له دې چې یو راوړل شوی EPANET فایل بله درجه بیانوي، نو کچه یوه اوږدوالی ده په ورځ کې، د پروژې د اوږدوالي یوونې کې لیکل شوې. یوه تشه بکس پدې معنی ده چې هیڅ دیوال تعامل نشته.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='یوازې دا پایپ. یې خالي پرېږدئ او پایپ به هغه کچه وکاروي چې د تنظیمات، د اوبو کیفیت لاندې د ټولې شبکې لپاره ټاکل شوې.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='د تعامل کچه';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='په دې ټانک کې ساتل شویو اوبو کې تعامل، د 1/ورځ کچې په توګه. منفي شمېره کیمیاوي ماده کموي او مثبته یې زیاتوي. اوبه په ټانک کې د هر پایپ په پرتله ډېر اوږد ولاړې وي، نو ډېری وخت دلته پاتې مقدار له لاسه ورکول کیږي. خالي یعنې د ډلې تعامل کوفیشنټ وکاروئ چې د ټولې شبکې لپاره په تنظیماتو، محاسبه، کیفیت کې ټاکل شوی.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='د حجم تعامل';
$ec_lang['lpn_reaction_wall_short']='د دیوال تعامل';
$ec_lang['lpn_reaction_tank_short']='تعامل';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/ورځ';
$ec_lang['lpn_reaction_day']='ورځ';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='د اوبو د تعامل درجه (بلک)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='هغه اکسپوننټ چې د اوبو په مینځ کې د تعامل لپاره غلظت ورته پورته کیږي. هره ریښتینې شمېره منل کیږي. 1 ډیفالټ ارزښت دی او د ډیرو کلورین د خرابیدو ماډلونو لپاره کارول کیږي. 0 دا نرخ له دې نه خپلواک کوي چې هلته څومره کیمیاوي شی شته دی.';
$ec_lang['lpn_reaction_order_tank']='د ټانک د تعامل درجه';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='هغه توان چې غلظت ته پورته کیږي د هغو اوبو په تعامل کې چې په ټانک کې ساتل شوي، د ډلې تعامل له درجې نه جلا، ترڅو یو ټانک د پایپونو په پرتله په بله درجه تعامل وکړي. هره ریښتینې شمېره اجازه ده، او 1 ډیفالټ دی. EPANET دا په فایل کې د ORDER TANK په توګه بیانوي او د EPANET په انټرفیس کې ورته ننوتنه نه لري.';
$ec_lang['lpn_reaction_order_wall']='د دیوال د تعامل درجه';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 معنی لري چې د دیوال تعامل د ورکړل شویو کوفیشنټ (کوفیشنټونو) سره سم رامنځته کیږي. 0 معنی لري چې نه رامنځته کیږي. دا یو د روشن او مړ کولو کیلي دی. ډیفالټ ارزښت 1 دی.';
$ec_lang['lpn_reaction_order_unstated']='نه دي ویل شوي';
$ec_lang['lpn_reaction_order_zero']='0، صفر درجه';
$ec_lang['lpn_reaction_order_first']='1، لومړۍ درجه';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='محدودوونکی پوتانشیل';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='هغه غلظت چې کیمیاوي شی ورته خوځیږي، پرځای دې چې د هیڅ کیدو په لور خرابیږي یا بې پایه ډیریږي. لکه چې اوبه ورته نږدې کیږي تعامل ورو کیږي او هلته درېږي. یو ډول یوونه وکاروئ. که تشه وي نو هیڅ حد نشته.';
$ec_lang['lpn_reaction_rough_corr']='د خشونت اړیکه';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='هغه فکتور چې د دیوال د تعامل کوفیشنټ د هر پایپ له خشونت سره تړي، نو ډېر خشن پایپ ګړندی تعامل کوي. کله چې ټاکل شوی وي، د هر پایپ لپاره د دیوال کوفیشنټ د هغه له خشونت محاسبه کیږي، او پورتنی واحد د دیوال کوفیشنټ نه کارول کیږي. که خالي وي نه کارول کیږي.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='دا پاڼه خپله تعامل کچه نه وړاندې کوي. دې لپاره هیڅ معیاري ازموینه نشته، او د یو ډول اوبو خپرې شوې ساحوي ارزښتونه تر لسو چنده توپیر لري، نو یوه شمېره چې دلته ورکړل شي به د سپارښتنې په توګه لوستل شي. یوه ولیکئ چې تاسو یې اندازه کړې یا کولی شئ حواله ورکړئ، یا بکسونه خالي پرېږدئ د یوې کیمیاوي مادې لپاره چې تعامل نه کوي.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='انرژي';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='راپورونه';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_epanet']='چلول';
$ec_lang['lpn_energy_title']='د پمپ انرژي راپور';
$ec_lang['lpn_energy_menu']='د پمپ انرژي';
$ec_lang['lpn_energy_efficiency']='د پمپ اغیزناکتیا (سلنه)';
$ec_lang['lpn_energy_efficiency_tip']='د سیم-تر-اوبو اغیزناکتیا چې د هر هغه پمپ لپاره کارول کیږي چې د اغیزناکتیا منحنۍ نه لري. کله چې هیڅ ارزښت نه وي ټاکل شوی EPANET 75 سلنه کاروي.';
$ec_lang['lpn_energy_price']='د ځواک بیه';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='د یو کیلوواټ ساعت لګښت. دا هر هغه پمپ ته پلي کیږي چې انفرادي بیه نه لري. خالي یعنې 0.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='په دې پمپ کې د یو کیلوواټ ساعت لګښت. خالي یعنې هغه بیه وکاروئ چې د ټولې شبکې لپاره په تنظیماتو، انرژي کې ټاکل شوې.';
$ec_lang['lpn_energy_price_pattern']='د بیې نمونه';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='یوه نمونه چې پر هر نمونې ګام کې بیه ضربوي، چې دا څنګه یو غیر-اوج نرخ بیانیږي. یې خالي پرېږدئ د ټول چلون لپاره یوې بیې لپاره.';
$ec_lang['lpn_energy_demand_charge']='د اوج غوښتنې فیس';
$ec_lang['lpn_energy_demand_charge_tip']='د هر kW لپاره، د هغه اوج بار لپاره چې پمپونه یې غواړي';
$ec_lang['lpn_energy_currency']='مروجه پیسه';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='هغه متن چې د هر لګښت ارزښت تر څنګ چاپیږي. دا یوازې لیبل دی؛ په ټول کې یو اسعار وکاروئ.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='دا پاڼه خپله ځواک بیه نه وړاندې کوي. د ځواک بیه پر شرکت، هیواد، ساعت او کال پورې اړه لري، نو یوه شمېره چې دلته ورکړل شي به د سپارښتنې په توګه لوستل شي. له خپل نرخ نه بیه ولیکئ.';
$ec_lang['lpn_energy_needs_run']='د پمپ انرژي ځواک دی چې د چلون پر مهال یوځای شوی، نو دې ته اوږدې مودې سمولېشن اړتیا ده: د EPANET انجن او یو ټول چلولو وخت. د تنظیمات، محاسبه، وخت کې یو ټول چلولو وخت وټاکئ، د محاسبه کول تڼۍ کېکاږئ، بیا د اوبه، راپورونه، د پمپ انرژي پرانیزئ.';
$ec_lang['lpn_energy_no_pumps']='دا شبکه هیڅ پمپ نلري، نو دلته هیڅ شی ځواک نه راکاږي.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='د سناریوګانو پرتله';
$ec_lang['lpn_scncmp_menu_tip']='د سناریوګانو جدول د توپیرونو شمېر، ټیټ ترین فشار، او لوړ ترین سرعت سره';
$ec_lang['lpn_scncmp_running']='هر سناریو حل کیږي…';
$ec_lang['lpn_scncmp_empty']='تر اوسه هیڅ شی نه دی رسم شوی، نو دلته د حل کولو لپاره هیڅ شی نشته.';
$ec_lang['lpn_scncmp_col_maxvelocity']='ترټولو لوړ سرعت';
$ec_lang['lpn_scncmp_at']='{value} په {id} کې';
$ec_lang['lpn_scncmp_current']='(اوس مهال پرانیستل شوی)';
$ec_lang['lpn_scncmp_note']='هر سناریو د انځور له یوې کاپي نه حل کیږي. دلته هیڅ شی پروژه نه بدلوي، او هغه سناریو چې تاسو پکې کار کوئ لکه څنګه چې و پاتې کیږي.';
$ec_lang['lpn_energy_over']='د {time} اوږدې مودې سمولېشن لپاره';
$ec_lang['lpn_energy_col_pump']='پمپ';
$ec_lang['lpn_energy_col_running']='٪ چلون';
$ec_lang['lpn_energy_col_effic']='اغیز.';
$ec_lang['lpn_energy_col_avg_kw']='اوسط kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='دا پمپ کله چې چلیده اوسط استعمال شوی ځواک. دا د غیرفعالو مودو له مخې اوسط نه دی، نو یو پمپ چې د اوږدې مودې سمولېشن ډیره برخه غیرفعاله وه لا هم هغه ځواک راپور کوي چې کله چلیده یې کارولی.';
$ec_lang['lpn_energy_col_peak_kw']='اوج kW';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='لګښت';
$ec_lang['lpn_energy_total_kwh']='استعمال شوې انرژي';
$ec_lang['lpn_energy_total_energy_cost']='د انرژۍ لګښت';
$ec_lang['lpn_energy_peak_kw']='اوج ځواک کارونه';
$ec_lang['lpn_energy_total_demand_charge']='د اوج غوښتنې لګښت';
$ec_lang['lpn_energy_total_cost']='ټول لګښت';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='د حالت بدلونونه';
$ec_lang['lpn_reports_status_tip']='د وخت په ترتیب سره د حالت بدلونونو جدول چې د وروستي اوږدې مودې سمولېشن د EPANET له وخت ګامونو لوستل شوی: پمپونه او والوونه پرانیستل یا بندېدل، ټانکونه ډکیدل، تشیدل، ډک کیدل یا وچیدل، او هغه ګامونه چې په بشپړه توګه همغږي نشول.';
$ec_lang['lpn_status_title']='د حالت بدلونونه';
$ec_lang['lpn_status_needs_run']='د حالت راپور هغه څه لیست کوي چې د اوږدې مودې سمولېشن پر مهال بدل شول. په تنظیماتو، محاسبه، وخت کې ټول چلولو وخت وټاکئ، محاسبه کول ووهئ، بیا اوبه، راپورونه، د حالت بدلونونه پرانیزئ.';
$ec_lang['lpn_status_empty']='پدې چلولو کې هیڅ شي حالت نه دی بدل شوی.';
$ec_lang['lpn_status_col_event']='پیښه';
$ec_lang['lpn_status_opened']='{type} {id} اوس پرانیستل شو';
$ec_lang['lpn_status_closed']='{type} {id} اوس بند شو';
$ec_lang['lpn_status_filling']='{type} {id} اوس ډکیږي';
$ec_lang['lpn_status_emptying']='{type} {id} اوس خالیږي';
$ec_lang['lpn_status_full']='{type} {id} اوس ډک شو';
$ec_lang['lpn_status_dry']='{type} {id} اوس خالی شو';
$ec_lang['lpn_status_no_converge']='پدې ګام کې هایدرولیکي حل په بشپړه توګه همغږی نشو؛ ښودل شوې شمېرې د هغه وروستی تکرار دی.';
$ec_lang['lpn_status_note']='د جدولونو پینل او بشپړ راپور په څیر د هماغه اوږدې مودې چلولو نه لوستل کیږي. یوازې بدلون لیست کیږي، نه هر ګام.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='بشپړ';
$ec_lang['lpn_reports_full_tip']='د وروستي چلولو په هر راپور وخت ګام کې د ټولو نقطو او تړاوونو جدول';
$ec_lang['lpn_full_title']='بشپړ راپور';
$ec_lang['lpn_full_needs_run']='بشپړ راپور هره نقطه او هر تړاو د هر راپور ورکولو وخت ګام کې لیست کوي. محاسبه کول فشار کړئ، بیا اوبه، راپورونه، بشپړ راپور پرانیزئ.';
$ec_lang['lpn_full_note']='د هرې نقطې یا تړاو لپاره یو قطار د هر راپور ورکولو وخت ګام کې، د هغو واحدونو کې چې جدولونو پینل کې ښودل شوي دي. یوه خالي حجره هغه کالم دی چې دا اندازه یې نلري. ډاونلوډ یا چاپ هر وخت ګام وړي؛ لاندې جدول یوازې یو ځل کې یو ښیي.';
$ec_lang['lpn_full_step_label']='د وخت ګام';
$ec_lang['lpn_full_download_csv']='CSV ډاونلوډ کول';
$ec_lang['lpn_full_print']='راپور چاپول';
$ec_lang['lpn_full_col_time']='وخت';
$ec_lang['lpn_full_col_type']='ډول';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} قطارونه.';
$ec_lang['lpn_energy_no_price']='هیڅ د ځواک بیه نه ده ویل شوې، نو دلته هر لګښت صفر دی. یوه یې د تنظیمات، انرژي لاندې وټاکئ.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='دا شبکه د صفر بیه ویل کیږي، نو دلته هر لګښت صفر دی. یې د تنظیمات، انرژي لاندې بدل کړئ.';
$ec_lang['lpn_energy_curve_note']='دا پمپونه یوه داسې اغیزناکتیا منحنۍ نوموي چې هیڅ ټکی نلري: {ids}. دوی د ټولې شبکې لپاره ټاکل شوې اغیزناکتیا سره چلېدل.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
$ec_lang['lpn_labels_col_decimals_example']='0.000';
$ec_lang['lpn_labels_col_drop']='پرېښودل';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='نقطه او تړاو';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='مساوي وقفې';
$ec_lang['lpn_color_mode_quantile']='کوانټایل (مساوي شمېر)';
$ec_lang['lpn_color_mode_jenks']='طبیعي بندونه (Jenks)';
$ec_lang['lpn_color_mode_stddev']='معياري انحراف';
$ec_lang['lpn_color_mode_pretty']='ښکلی (ګرد شوی)';
$ec_lang['lpn_color_mode_log']='لوگاریتمي';
$ec_lang['lpn_color_mode_manual']='لاسي';

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
$ec_lang['lpn_library_menu']='کتابتونونه';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='نمونې';
$ec_lang['lpn_library_patterns_tip']='یوه نمونه د تکراریدونکو ضربوونکو یوه لیست دی. هره یوه یې د یوه نمونې وخت ګام لپاره کارول کیږي، نو 24 شمېرې پر یوه ساعت ګام یوه تکراریدونکې ورځ جوړوي. یوه غوښتنه چې 10 وي او ضربوونکی یې 1.5 وي، په هغه شېبه کې 15 کیږي.';
$ec_lang['lpn_library_curves']='منحنۍ';
$ec_lang['lpn_library_curves_tip']='د پمپ هیډ یا اغیزناکتیا د بهاو پر وړاندې، د والو ضیاع د بهاو پر وړاندې، یا د ټانک حجم د ژوروالي پر وړاندې';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='منحنۍ له پمپونو او والوونو سره نښلول کیږي. د پمپ هیډ منحنۍ لپاره، چلن هغه منحنۍ کاروي چې د ټکو له لارې برابره شوې لکه ښودل شوې؛ د هرې بلې ډول لپاره دا ټکي سیدو کرښو سره نښلوي لکه ښودل شوې.';
$ec_lang['lpn_library_curve_add']='یوه منحنۍ اضافه کړئ';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='د منحنۍ ډول';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='معادله';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='هغه منحنۍ چې د ټکو له لارې برابره شوې، او هغه کرښه چې لاندې پلاټ کې رسم شوې. دا هر ځل چې ښودل کیږي د ټکو نه محاسبه کیږي او هیڅکله نه ساتل کیږي، او د هغې شمېرې هغه یوونو کې دي چې پورتنی جدول یې ښیي. جوړ شوی حل کوونکی پدې معادله چلیږي؛ د EPANET انجن پخپله ټکي لولي.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='په سپریډشیټ کې یوه یا دوې ستنې وټاکئ، کاپي یې کړئ، او په لومړۍ موخه حجره کې یې پیسټ کړئ. قطارونه د اړتیا سره اضافه کیږي. هغه کرښې چې مستقیم له EPANET فایل نه کاپي شوې، د منحنۍ نوم په ګډون، هم پیسټ کیدی شي.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='تشریح';
$ec_lang['lpn_library_curve_remove_point']='دا ټکی لرې کړئ';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='ټکي کاپي کړئ';
$ec_lang['lpn_library_curve_copy_tip']='هر ټکی د دوو ستنو په توګه کاپي کوي، چمتو د یو سپریډشیټ ته د پیسټ کولو لپاره.';
$ec_lang['lpn_library_curve_copy_manual']='دا ټکي کاپي کړئ';
$ec_lang['lpn_library_curve_used_by']='هغه عناصر چې دا منحنۍ کاروي';
$ec_lang['lpn_library_curve_unused']='هیڅ شی دا منحنۍ نه کاروي.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='دا منحنۍ د {count} عناصرو له خوا کارول کیږي: {ids}. لومړی هغوی بلې منحنۍ ته وګرځوئ، بیا دا یوه ړنګه کړئ.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='د پایپ ډولونه';
$ec_lang['lpn_library_pipetypes_tip']='د پایپ ډول یو تعریف دی چې څو پایپونه یې د خپل قطر، خشونت او د تعامل کوفیشنټونو لپاره راجع کولی شي. د تعریف سمول هر هغه پایپ بدلوي چې دا کاروي.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='هره پروژه جلا د پایپ ډول کتابتون لري. په د پایپ ډول تعریف کې ځانتیاوې خالي پرېښودل کیدی شي؛ د بېلګې په توګه، یو پایپ ډول کولی شي خشونت وټاکي او قطر ونه ټاکي. د پایپ ډولونه د پایپ په ځانتیاوو کې پایپونو ته ټاکل کیږي. دلته د تعریف سمول هر هغه پایپ بدلوي چې دا مراجعه کوي.';
$ec_lang['lpn_library_pipetype_add']='د پایپ یو ډول اضافه کړئ';
$ec_lang['lpn_library_pipetype_blank_tip']='د پایپ ډول تعریف کې تشې ځانګړتیاوې پرېښودل کیږي ترڅو د هرې پایپ لپاره یې په بېلابېل ډول ولیکل شي.';
$ec_lang['lpn_library_pipetype_used_by']='هغه پایپونه چې دا ډول کاروي';
$ec_lang['lpn_library_pipetype_unused']='هیڅ شی دا د پایپ ډول نه کاروي.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='دا د پایپ ډول د {count} پایپونو لخوا کارول کیږي: {ids}. مخکې لدې چې یې ړنګ کړئ، لومړی یې له دوی نه بېل کړئ.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='د پایپ ډول';
$ec_lang['lpn_field_pipetype_tip']='هغه د پایپ ډول چې د دې پروژې کتابتون کې دی او دا پایپ یې کاروي. هغه ځانګړتیاوې چې د پایپ ډول کې شاملې دي دلته د سمون لپاره غیرفعالې دي. د دلته سمون فعالولو لپاره د پایپ ډول بېل کړئ.';
$ec_lang['lpn_pipetype_none']='هیڅ د پایپ ډول نه دی ټاکل شوی';
$ec_lang['lpn_pipetype_detach']='د پایپ ډول نه بېلول';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='هغه ارزښتونه چې دا پایپ یې له خپل ډول نه لولي پایپ ته کاپي کړئ او د ډول کارول ودروئ. د پایپ ارزښتونه اوس نه بدلیږي، او له اوسه وروسته دا ارزښتونه دلته سمون کیږي.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='فیتینګونه';
$ec_lang['lpn_library_fittings_tip']='فیتینګونه د ځایی ضیاع کوفیشنټونو سره په لړلیکونو کې ګروپ شوي';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='هره پروژه جلا د فیتینګونو کتابتون لري. د فیتینګونو لړلیک فیتینګونه لري چې هر یو مقدار لري، او دا په یو واحد ځایی ضیاع کوفیشنټ کې جمع کیږي. دواړه پایپونه او د پایپ ډولونه کولی شي یو لړلیک راجع کړي.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='دلته وړاندې شوي فیتینګونه هغه دیارلس دي چې د EPANET 2.2 د کارونکي لارښود د 3.3 جدول کې دي. د یوه ټاکل یې کوفیشنټ کرښې ته کاپي کوي، چیرې چې تاسو یې بدلولی شئ. یو کوفیشنټ د فیتینګ اندازې او جوړونکي پورې اړه لري، نو جدول د پیل ټکي په توګه وګورئ نه د ځواب په توګه.';
$ec_lang['lpn_library_fittings_add']='د فیتینګونو لړلیک اضافه کړئ';
$ec_lang['lpn_library_fittings_used_by']='هغه پایپونه چې دا د فیتینګونو لړلیک کاروي';
$ec_lang['lpn_library_fittings_unused']='هیڅ شی دا د فیتینګونو لړلیک نه کاروي.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='دا د فیتینګونو لړلیک د {count} پایپونو لخوا کارول کیږي: {ids}. مخکې لدې چې یې ړنګ کړئ، لومړی یې له دوی نه بېل کړئ.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='کتابتونونه دننه کول…';
$ec_lang['lpn_library_import_tip']='بل پروژې فایل وټاکئ او بشپړ کتابتونونه ترې دې پروژې ته کاپي کړئ. هغه هر څه چې نوم یې دمخه دلته اخیستل شوی پریږدل کیږي او لیست کیږي، نو هیڅ هغه څه چې تاسو یې دمخه لرئ نه بدلیږي.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='وټاکئ چې د {file} نه څه شی کاپي شي';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='هر کتابتون چې تاسو یې ټک کوئ په بشپړه توګه کاپي کیږي. وروسته هغه ړنګ کړئ چې نه یې غواړئ، هماغسې لکه چې تاسو هره بله ننوتنه ړنګوئ.';
$ec_lang['lpn_library_import_go']='دننه کول';
$ec_lang['lpn_library_import_no_libraries']='دا پروژه فایل د کاپي کولو لپاره هیڅ کتابتون نلري.';
$ec_lang['lpn_library_import_heading']='د {file} نه دننه شوی';
$ec_lang['lpn_library_import_added']='کاپي شوي: {names}';
$ec_lang['lpn_library_import_conflict']='پرېښودل شوي، ځکه دا پروژه دمخه د ورته نوم یو لري: {names}. دلته هیڅ شی نه دی بدل شوی. که تاسو دواړه غواړئ نو یو یې نوم بدل کړئ او بیا یې دننه کړئ.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='دا پروژه فایل د دې د کاپي کولو لپاره هیڅ یو نلري.';
$ec_lang['lpn_library_import_curve_shape']='دا منحنۍ دقیقاً هماغسې راغلې لکه چې فایل لیکلې وې، او یو چلونه یوه نشي کارولی تر هغه چې لومړی کالم یې د هر ټکي نه بل ته لوړ شي: {names}';
$ec_lang['lpn_library_import_needs_fittings']='دا د پایپ ډولونه یوه د فټینګونو لیست ته اشاره کوي چې دا پروژه یې نلري: {names}. د هماغه فایل نه د فټینګونو کتابتون دننه کړئ او دوی به یې ومومي.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='خبرداری: د واحدونو نا سمون. لکه چې دي دننه کیږي. مشوره نه ورکول کیږي.';
$ec_lang['lpn_library_import_units_line']='{name}: دا پروژه {mine} ښیي، فایل {theirs} ښیي.';
$ec_lang['lpn_fitting_qty']='مقدار';
$ec_lang['lpn_fitting_name']='فیتینګ';
$ec_lang['lpn_fitting_k']='ضریب';
$ec_lang['lpn_fitting_add']='یو فیتینګ اضافه کړئ';
$ec_lang['lpn_fitting_remove']='لرې کول';
$ec_lang['lpn_fitting_total']='د ټول ځایی (لوکل) ضیاع ضریب، k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='د فیتینګونو لړلیک';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='د پروژې له کتابتون نه د فیټینګونو لړلیک. د هغوی مقدارونه او کوفیشنټونه د دې پایپ د ځایی ضیاع کوفیشنټ کې جمع کیږي، او د کوفیشنټ بکس بیا یوازې د لوستلو وي. دا نه ټاکل شوی پرېږدئ ترڅو کوفیشنټ پخپله ولیکئ.';
$ec_lang['lpn_fittings_none']='هیڅ د فیتینګونو لړلیک نه دی ټاکل شوی';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='ګلوب والو، بشپړ خلاص';
$ec_lang['lpn_fitting_angle']='زاویوی والو، بشپړ خلاص';
$ec_lang['lpn_fitting_swingcheck']='سوینګ چک والو، بشپړ خلاص';
$ec_lang['lpn_fitting_gate']='ګیټ والو، بشپړ خلاص';
$ec_lang['lpn_fitting_elbow_short']='لنډ شعاع کونج';
$ec_lang['lpn_fitting_elbow_medium']='منځنی شعاع کونج';
$ec_lang['lpn_fitting_elbow_long']='اوږد شعاع کونج';
$ec_lang['lpn_fitting_elbow_45']='45 درجې کونج';
$ec_lang['lpn_fitting_return_bend']='تړلی بېرته ګرځون';
$ec_lang['lpn_fitting_tee_run']='معياري ټي، بهاو د اصلي لارې له لارې';
$ec_lang['lpn_fitting_tee_branch']='معياري ټي، بهاو د څانګې له لارې';
$ec_lang['lpn_fitting_entrance']='مربع ننوتنه';
$ec_lang['lpn_fitting_exit']='وتنه';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='نور فیتینګ';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='خوندي شوی {file}';
$ec_lang['lpn_inp_export_flat_lead']='صادر شوی د EPANET فایل د دې پروژې سره په شمېرو کې مساوي دی. خو دا د لاندې شیانو لپاره ځای نلري:';
$ec_lang['lpn_inp_export_flat_types']='دلته {n} پایپونه {t} د پایپ ډولونه ښیي. په فایل کې له دغو پایپونو هر یو د شمېرو خپله کاپي لري، نو ځوابونه یو شان دي. هغه څه چې فایل یې نشي ساتلی د پایپ ډول پخپله دی، نو د یو تعریف او هر هغه پایپ ترمنځ اړیکه چې کاروي یې یوازې په پروژه فایل کې ثبتیږي.';
$ec_lang['lpn_inp_export_flat_coords']='د EPANET فایل د هرې نقطې لپاره یو ځای ساتي. دا سناریو له دوی {n} بل چیرته ځای پر ځای کوي، او دا په فایل کې ځایونه دي. هره بله سناریو خپل ځایونه یوازې په پروژه فایل کې ساتي.';
$ec_lang['lpn_inp_export_flat_fittings']='د EPANET فایل نشي کولی ستاسو د پروژې فایل کې د کونجونو، والوګانو او ټیانو لړلیک وساتي. دلته د {n} پایپونو ځایی ضیاع کوفیشنټ د یوه فیتینګونو لړلیک نه راټول شوی دی. مجموعه لکه څنګه چې ده فایل ته ځي، نو د ځوابونو په اړه هیڅ شی نه بدلیږي.';
$ec_lang['lpn_library_controls']='کنترولونه';
$ec_lang['lpn_library_controls_tip']='کنټرول یوه بیان دی چې یو تړاو خلاصوي یا بندوي، یا یې ترتیب بدلوي، د ټانک د اوبو د کچې، د نقطې د فشار، یا د وخت پر بنسټ.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='یوه نمونه اضافه کړئ';
$ec_lang['lpn_library_pattern_values']='ضربوونکي';
$ec_lang['lpn_library_pattern_values_tip']='ضربوونکي، چې د خالي ځایونو یا کامو سره جلا شوي دي. که تاسو یو سپریډشیټ لرئ، یو ستون یې پیسټ کړئ. لیست تر هغه وخته تکراریږي چې چلول دوام لري، نو اړتیا نشته چې ټول چلول پوښي.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} ضربوونکي، {step} تر منځ واټن، چې {span} پوښي';
$ec_lang['lpn_library_pattern_none']='هیڅ نمونه نشته';
$ec_lang['lpn_settings_default_pattern']='د غوښتنې تلواله نمونه';
$ec_lang['lpn_settings_default_pattern_tip']='هر جنکشن چې نمونه نلري دا کاروي.';
$ec_lang['lpn_library_control_add']='یو کنترول اضافه کړئ';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='یوه یو-کرښیزه قاعده چې د EPANET نحو کاروي. د پروژې همغږي واحدونه وکاروئ. کلیدي کلمې باید په انګلیسي کې وي. بېلګې: LINK 12 CLOSED IF NODE 23 ABOVE 20 (کله چې د ټانک 23 کچه له 20 فوټه ډیره شي، لینک 12 به وتړل شي)؛ LINK 12 OPEN IF NODE 130 BELOW 30 (که د نقطې 130 فشار له 30 psi نه ښکته شي، لینک 12 به خلاص شي)؛ LINK PUMP02 1.5 AT TIME 16 (د پمپ PUMP02 نسبي چټکتیا د سناریو له 16 ساعتونو وروسته 1.5 ته ټاکل کیږي)؛ LINK 12 CLOSED AT CLOCKTIME 10 AM LINK 12 OPEN AT CLOCKTIME 8 PM (دوه قواعد: لینک 12 په سناریو کې بیا بیا سهار 10 بجې تړل کیږي او ماښام 8 بجې خلاصیږي).';
$ec_lang['lpn_library_control_ok']='✓ پوه شوی';
$ec_lang['lpn_library_control_bad']='⚠ نه دی پوهېدل شوی';
$ec_lang['lpn_library_control_missing']='⚠ دې شبکې کې هیڅ شی {id} نومیدونکی نشته';
$ec_lang['lpn_library_rules']='قواعد';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='یوه قاعده یو تړاو خلاصوي یا بندوي، یا یې ترتیب بدلوي، کله چې د اوبو کچه، فشار، بهاو، یا وخت یو ټاکلي ارزښت ته ورسیږي. یوه قاعده کولی شي له یوه شرط زیات وازمویي او کولی شي هغه عمل وټاکي چې کله شرط غلط وي باید ترسره شي.';
$ec_lang['lpn_library_rule_add']='یو قاعده اضافه کړئ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='په هره کرښه کې یوه جمله. لاندې د "ټولو لویو توریو" په بېلګو سره توضیحات دي. 1 کرښه: د قاعدې نوم، "RULE 1". 2 کرښه: یو شرط، "IF TANK 2 LEVEL BELOW 17.1". 3 کرښه: یو عمل، "THEN PUMP 9 STATUS IS OPEN". 4 کرښه: لومړیتوب، "PRIORITY 1". د یو شرط نه زیاتو ازمایلو لپاره "AND" یا "OR" کرښې اضافه کړئ، او د هغه عمل ټاکلو لپاره چې کله شرط غلط وي "ELSE" کرښې. یو شرط کولی شي په نقطه کې LEVEL، HEAD، GRADE، PRESSURE یا DEMAND ولولي، په تړاو کې FLOW، STATUS یا SETTING، یا په SYSTEM کې TIME او CLOCKTIME. د پروژې ثابت واحدونه وکاروئ. کلیدي کلمې باید انګلیسي وي.';
$ec_lang['lpn_library_rule_ok']='✓ دا قاعده ولوستل شوه';
$ec_lang['lpn_library_rule_bad']='⚠ دا قاعده نه شوه لوستل کیدلی';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='بنسټیزه غوښتنه';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='هغه بهاو چې دا نقطه یې په ښودل شوي وخت ګام کې راباسي: هره بنسټیزه غوښتنه د خپلې نمونې سره ضرب شوې، سره جمع شوې. دا پایله ده، ننوتنه نه ده.';
$ec_lang['lpn_field_demand_pattern']='د غوښتنې نمونه';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='تشریح';
$ec_lang['lpn_demand_add']='د غوښتنې کټګورۍ اضافه کول';
$ec_lang['lpn_demand_remove']='دا غوښتنه لرې کول';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='د سر نمونه';
$ec_lang['lpn_field_head_pattern_tip']='د چلولو په اوږدو کې د دې ذخیرې د اوبو د کچې نمونه. پورتنی هیډ د نمونې سره ضرب کیږي.';
$ec_lang['lpn_field_pump_speed']='نسبي چټکتیا';
$ec_lang['lpn_field_pump_speed_tip']='د هغه د خپرې شوې فعالیت منحنۍ د جوړولو لپاره کارول شوي ګرځیدو چټکتیا ته نسبي. که د چټکتیا نمونه وي نو له پامه غورځول کیږي (پیمانه نه کیږي).';
$ec_lang['lpn_field_speed_pattern']='د چټکتیا نمونه';
$ec_lang['lpn_field_speed_pattern_tip']='د نمونې هره ننوتنه د چلولو د هغې برخې لپاره نسبي چټکتیا ورکوي، نه دا چې یو اساسي ارزښت پیمانه کړي.';

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
$ec_lang['lpn_search_menu']='د یو ځای په نوم لټون…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='په لومړي کارونه کې اجازه غوښتل کیږي، ځکه چې لټونونه د OpenStreetMap د ځای-نوم خدمت ته لیږل کیږي.';
$ec_lang['lpn_search_bar']='د نوم له مخې لټون…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='د ځای په نوم لټون هغه کلمې چې تاسو یې لیکئ nominatim.openstreetmap.org ته لیږي، چې د OpenStreetMap بنسټ وړیا د ځای-نوم خدمت دی.';
$ec_lang['lpn_search_consent_2']='دا له هغه خدمت نه چې ستاسو د پروژې شاته د سړک نقشه انځورونه ورکوي جلا خدمت دی. انځورونه یوازې دا وايي چې تاسو چېرته ګورئ. یو لټون دا وايي چې تاسو څه لیکلي دي. د ځای-نوم خدمت به ستاسو د لټون کلمې او ستاسو د IP پته ترلاسه کړي. موږ نور هیڅ نه لیږو، او د ستاسو د لټونونو هیڅ ثبت نه ساتو.';
$ec_lang['lpn_search_consent_3']='ایا موږ کولی شو ستاسو لټونونه د ځای-نوم خدمت ته ولیږو؟';
$ec_lang['lpn_search_consent_4']='که تاسو نه ووایاست، دا پاڼه کې نور هرڅه لکه اوس کار کوي، په شمول د "یوې طول او عرض البلد ته ورشئ". موږ یو هو په یاد ساتو ترڅو بیا نه پوښتو. یو نه هیڅکله نه ساتل کیږي.';
$ec_lang['lpn_search_refused']='د ځای-نوم لټون بند دی، او هیڅ شی نه دی لیږل شوی. د عرض البلد او طول البلد ته تلل کمانډ لا هم کار کوي.';
$ec_lang['lpn_search_prompt']='د یو ځای په نوم لټون وکړئ. یو ښار، یو سړک، یوه نښه — د بېلګې په توګه: Petaluma, California';
$ec_lang['lpn_search_empty']='د لټون لپاره د یو ځای نوم ولیکئ.';
$ec_lang['lpn_search_working']='لټون روان دی…';
$ec_lang['lpn_search_busy']='یو لټون لا مخکې روان دی. د هغه د ځواب انتظار وکاږئ.';
$ec_lang['lpn_search_choose']='له یوه زیات ځای سمون خوري. کوم یو؟';
$ec_lang['lpn_search_nochoice']='هیڅ شی نه دی ټاکل شوی، نو نقشه نه ده خوځیدلې.';
$ec_lang['lpn_search_badchoice']='دا د لیست په شمېرو کې نشته.';
$ec_lang['lpn_search_none']='د دې نوم لپاره هیڅ ونه موندل شول.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='د ځای-نوم خدمت د غوښتنې کچه محدوده کړې ده. یوه دقیقه انتظار وکاږئ او بیا هڅه وکړئ.';
$ec_lang['lpn_search_http']='د ځای-نوم خدمت یوه ستونزه سره ځواب ورکړ.';
$ec_lang['lpn_search_timeout']='د ځای-نوم خدمت په وخت ځواب ورنکړ. په دې پاڼه کې نور هرڅه پرته له هغه کار کوي.';
$ec_lang['lpn_search_unreadable']='د ځای-نوم خدمت داسې شی سره ځواب ورکړ چې دا پاڼه یې نشوای لوستلی.';
$ec_lang['lpn_search_offline']='موږ د ځای-نوم خدمت ته نه شو رسیدلی. کیدای شي تاسو آفلاین یاست. دا پاڼه کې نور هرڅه پرته له دې کار کوي، په شمول د "یوې طول او عرض البلد ته ورشئ".';
$ec_lang['lpn_search_toofast']='د ځای-نوم خدمت په هره ثانیه کې یو لټون اجازه ورکوي. یوه شېبه وروسته بیا هڅه وکړئ.';
$ec_lang['lpn_search_nofetch']='دا براوزر نشي کولی د ځای-نوم خدمت ته ورسیږي.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox دا د ډیرو عامه لوړوالي مجموعو نه راټولوي، نو دا چې څومره ښه ده بشپړه پورې اړه لري چېرته چې تاسو یاست. چېرته چې یو ملي لیډار سروې شتون لري، لکه USGS 3DEP د متحده ایالاتو ډیرې برخې کې او د نورو ځایونو یې برابر، دا کولی شي له یوه متره افقی او څو لسمو یوه متره عمودي نه غوره وي. چېرته چې یوازې نړیوال معلومات شتون لري دا شاوخوا 30 متره افقی او څو متره عمودي دي. Mapbox موږ ته نه وايي چې تاسو کوم یو ترلاسه کړ. دا د یوه کانتور نقشه په توګه وګورئ، نه د یوې سروې، هر هغه شی چې تاسو پرې تکیه کوئ وګورئ.';
$ec_lang['lpn_terrain_consent_1']='د لوړوالي ډکول د هرې هغې نقطې ځای — د هغې طول او عرض البلد — چې اړتیا لري api.mapbox.com ته لیږي، ترڅو هلته د ځمکې لوړوالی ومومي.';
$ec_lang['lpn_terrain_consent_2']='دا له هغه پوښتنې نه چې ستاسو د پروژې شاته د نقشې انځورونه ورکوي جلا پوښتنه ده. انځورونه یوازې دا وايي چې تاسو چېرته ګورئ. دا ځایونه ستاسو خپله شبکه ده. Mapbox به هغه همغږۍ او ستاسو د IP پته ترلاسه کړي. موږ نور هیڅ نه لیږو: نه نوم، نه پایپونه، نه پروژه. موږ د دې هیڅ ثبت نه ساتو، او پر دې وسیله هیڅ نه ساتل کیږي پرته د دې پوښتنې ستاسو له ځواب نه.';
$ec_lang['lpn_terrain_consent_3']='ایا موږ کولی شو ستاسو د نقطو ځایونه Mapbox ته ولیږو؟';
$ec_lang['lpn_terrain_consent_4']='که تاسو نه ووایاست، دا پاڼه کې نور هرڅه لکه اوس کار کوي، او تاسو کولی شئ لوړوالي لکه مخکې پخپله ولیکئ. موږ یو هو په یاد ساتو ترڅو بیا نه پوښتو. یو نه هیڅکله نه ساتل کیږي.';
$ec_lang['lpn_terrain_refused']='لوړوالي نه دي ډک شوي، او هیڅ شی نه دی لیږل شوی. تاسو کولی شئ لکه مخکې یې ولیکئ.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='د {n} نقطو (نقطو) لوړوالی د Mapbox DEM نه ډک شي؟';
$ec_lang['lpn_terrain_confirm_default_1']='هرې نقطې لا مخکې لوړوالی لري، او {n} یې لا هم په {v} کې دي، چې دا هغه لوړوالی دی چې یوه نوې نقطه پرې پیل کیږي، نه هغه چې تاسو لیکلی وي.';
$ec_lang['lpn_terrain_confirm_default_2']='هغه {n} نقطو لوړوالی د Mapbox DEM نه د ارزښتونو سره بدل شي؟';
$ec_lang['lpn_terrain_keep']='{k} نقطې لا مخکې لوړوالی لري او لاس به ورونه وړل شي.';
$ec_lang['lpn_terrain_undo']='یو Undo (Ctrl-Z) دوی ټول بېرته راولي.';
$ec_lang['lpn_terrain_requests']='{n} غوښتنه(ې) api.mapbox.com ته.';
$ec_lang['lpn_terrain_busy']='لوړوالي لا مخکې ډکیږي. د هغو انتظار وکاږئ.';
$ec_lang['lpn_terrain_offmap']='دا د نقطو ځایونه د ځمکې نقشې پر مخ نه دي، نو هیڅ شی نه دی لیږل شوی.';
$ec_lang['lpn_terrain_too_wide']='دا نقطې د ځمکې پر ډېره برخه خپرې دي چې په یو ځل کې ولوستل شي ({n} د ټایل غوښتنې). هیڅ شی نه دی لیږل شوی.';
$ec_lang['lpn_terrain_cancelled']='هیڅ شی نه دی بدل شوی او هیڅ شی نه دی لیږل شوی.';
$ec_lang['lpn_terrain_nofetch']='دا براوزر نشي کولی د ځمکې خدمت ته ورسیږي.';
$ec_lang['lpn_terrain_working']='د ځمکې سطحه لوستل کیږي…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='د ځمکې سطحې خدمت غوښتنه ونه منله ({status})، نو هیڅ لوړوالی نه دی بدل شوی. کیدای شي دا سایټ چې کاروي Mapbox ټوکن ستاسو ویب پته اجازه ونه لري.';
$ec_lang['lpn_terrain_failed']='موږ د ځمکې خدمت ته ونه رسیدلی، نو هیڅ لوړوالی نه دی بدل شوی. کیدای شي تاسو آفلاین یاست. دا پاڼه کې نور هرڅه پرته له دې کار کوي.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='د ځمکې خدمت د غوښتنې کچه محدوده کړې ده (429)، نو هیڅ لوړوالی نه دی بدل شوی. په یوه دقیقه کې بیا هڅه وکړئ.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='د ځمکې سطحې خدمت د یوې تېروتنې سره ځواب ورکړ ({status})، نو هیڅ لوړوالی نه دی بدل شوی. ستاسو شبکه کې هیڅ خرابي نشته.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='د هغو نقطو هیڅ یوه پر ځمکه ځای نلري، نو هیڅ شی و نه لیږل شو او هیڅ لوړوالی نه دی بدل شوی. د ځمکې سطحې لوستل یوه پروژې ته اړتیا لري چې عرض البلد او طول البلد کې وي، یا یوه پروجیکشن کې چې دا پاڼه یې ځای کولی شي.';
$ec_lang['lpn_terrain_done']='{n} لوړوالی(ي) ډک شو(ل).';
$ec_lang['lpn_terrain_missed']='{m} نشول لوستل کیدی او لا هم خالي دي.';
$ec_lang['lpn_terrain_partial']='{f} د ځمکې ټایل(ونه) ځواب ورنکړ.';
$ec_lang['lpn_terrain_will_ids']='دې نقطو ته به لوړوالی ورکړل شي: {ids}';
$ec_lang['lpn_terrain_keep_ids']='هغه نقطې دا دي: {ids}';
$ec_lang['lpn_terrain_filled_ids']='دې نقطو ته لوړوالی ورکړل شو: {ids}';
$ec_lang['lpn_terrain_blank_ids']='دې نقطو لا هم هیڅ لوړوالی نلري: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}، او {n} نور';

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
$ec_lang['lpn_ff_menu']='د اور بهاو شننه…';
$ec_lang['lpn_ff_menu_tip']='هر ټاکل شوی جنکشن د اور بهاو لپاره ازمویئ، او د پاتې سیسټم پر اغیز یې وګورئ';
$ec_lang['lpn_ff_title']='د اور بهاو شننه';
$ec_lang['lpn_ff_intro']='هر جنکشن په نوبت د خپلې موجودې غوښتنې پر سر یو اور بهاو راباسي. چلول د شبکې یوه کاپي په سکرین پر وخت ګام کې کاروي، نو ستاسو په پروژه کې هیڅ شی نه بدلیږي.\n\nاور بهاو معمولاً د اعظمي ورځې غوښتنې پر وخت ازمویل کیږي، نو شبکه لومړی هغې حالت ته وټاکئ.\n\nهر ازمویل شوی جنکشن د ټولې شبکې شاوخوا 16 حلونه غواړي، نو لوی سیسټم څو دقیقې نیسي: مخکې له چلولو جنکشنونه وټاکئ، او هر وخت ودریږئ ترڅو نیمګړې پایلې وساتل شي.';
$ec_lang['lpn_ff_scope']='هغه جنکشنونه چې ازمویل شي';
$ec_lang['lpn_ff_all']='ټول';
$ec_lang['lpn_ff_selected']='ټاکل شوي';
$ec_lang['lpn_ff_no_junctions']='دا پروژه لا هیڅ جنکشن نلري، نو د ازموینې لپاره هیڅ شی نشته.';
$ec_lang['lpn_ff_no_selection']='هیڅ جنکشن ټاکل شوی نه دی. جنکشنونه وټاکئ یا د «ټول» اختیار وټاکئ.';
$ec_lang['lpn_ff_skipped']='{n} ټاکل شوي عناصر جنکشنونه نه دي، نو ازمویل شوي نه دي.';
$ec_lang['lpn_ff_required']='اړینه اور بهاو';
$ec_lang['lpn_ff_required_tip']='هغه بهاو چې د پلي کیدونکي اور قانون یا د اور ادارې له خوا په یوه اور-خونده کې اړین دی. هر جنکشن د دې ارزښت پر وړاندې ازمویل کیږي، پرته له دې چې د هغه جنکشن لپاره اړین اور بهاو ولیکل شي.';
$ec_lang['lpn_ff_required_own']='هغه جنکشنونه چې انفرادي اړین اور بهاو لري پر ځای یې د هغه ارزښت پر وړاندې ازمویل کیږي. د دوی شمېر: {n}.';
$ec_lang['lpn_ff_required_node_tip']='په دې جنکشن کې د اور بهاو اړتیا د هغې ځمکې کارونې لپاره چې خدمتوي، د پلي کیدونکي اور قانون یا د اور ادارې له مخې. یې خالي پرېږدئ ترڅو جنکشن د اور بهاو شننه بکس کې د ارزښت پر وړاندې ازمویل شي.';
$ec_lang['lpn_ff_residual']='پاتې فشار چې وساتل شي';
$ec_lang['lpn_ff_residual_tip']='هغه فشار چې جنکشن باید لا هم وساتي پداسې حال کې چې اور بهاو وړاندې کوي. AWWA M31 او NFPA 291 20 psi (140 kPa) کاروي.';
$ec_lang['lpn_ff_design']='ډیزاین چک (پر سیسټم اغیز)';
$ec_lang['lpn_ff_design_tip']='له دې پوښتنې نه بېله چې آیا جنکشن دا بهاو وړاندې کولی شي: کله چې هلته دا بهاو راایستل کیږي، آیا کوم بل جنکشن له خپل لږ ترلږه فشار نه ټیټیږي یا کوم پایپ د خپل سرعت له حد نه زیاتیږي؟ دا چک هیڅ اضافي محاسبه نه غواړي.';
$ec_lang['lpn_ff_design_no_selection']='د ډیزاین چک ساحه په ټاکل شوي ټاکل شوې ده، خو هیڅ شتمنۍ نه دي ټاکل شوې. په نقشه کې شتمنۍ وټاکئ یا ټول غوره کړئ.';
$ec_lang['lpn_ff_minpressure']='ټیټ ترین فشار چې چیرته نور اجازه لري';
$ec_lang['lpn_ff_minpressure_tip']='یو جنکشن چې له دې نه ټیټ ځي پداسې حال کې چې بل یو خپل اور بهاو راباسي، د ډیزاین ستونزې په توګه راپور کیږي.';
$ec_lang['lpn_ff_maxvelocity']='لوړ ترین سرعت چې اجازه لري';
$ec_lang['lpn_ff_maxvelocity_tip']='یو پایپ چې له دې نه پورته چلیږي پداسې حال کې چې اور بهاو راایستل کیږي، د ډیزاین ستونزې په توګه راپور کیږي.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='فشار په خپله په جنکشن کې ماډل کیږي، معمول طریقه. اور-خونده، د هغې لاتیرال، او د هغې نازل ماډل نه دي شوي، او په نازل کې فشار له نقطې نه کم دی.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='جوړ شوی حل کوونکی کارول کیږي.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='د EPANET انجن کارول کیږي.';
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
$ec_lang['lpn_ff_run_title']='د اور بهاو محاسبه';
$ec_lang['lpn_ff_calculate']='چلول';
$ec_lang['lpn_ff_stop']='ودرول';
$ec_lang['lpn_ff_working']='کار روان دی: {done} د {total} جنکشنونو نه.';
$ec_lang['lpn_ff_stopped']='{done} د {total} جنکشنونو وروسته ودرېد. لاندې پایلې هغه دي چې دمخه بشپړې شوې.';
$ec_lang['lpn_ff_cost']='دې محاسبې ټوله شبکه {solves} ځله حل کړه.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='انځور بدل شو، نو د اور بهاو پایلې پاکې شوې. یې بیا محاسبه کړئ.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='حلقې پاکول';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} جنکشنونو ټول چکونه تیر کړل. {fire} جنکشنونه د اور بهاو کې ناکام شول. {design} جنکشنونو پر پاتې سیسټم اغیز وکړ.';
$ec_lang['lpn_ff_summary_error']='{n} جنکشنونه نشول حل کیدی.';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='هر ازمویل شوی جنکشن';
$ec_lang['lpn_ff_col_junction']='جنکشن';
$ec_lang['lpn_ff_col_static']='ثابت فشار';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='دې جنکشن کې فشار مخکې له دې چې کوم اور بهاو راایستل شي، پداسې حال کې چې سیسټم عادي غوښتنې لا هم چلیږي. دلته د اندازه کولو لپاره هیڅ شی نه بندیږي، نو دا د سیسټم لپاره صفر-بهاو فشار نه دی؛ دا هماغه فشار دی چې نقشه یې دې جنکشن کې ښیي. AWWA M31 او NFPA 291 دواړه دا لوستنه پاتې فشار بولي، او دا هغه ځای دی چیرې چې د اور بهاو ازموینه پیل کیږي.';
$ec_lang['lpn_ff_col_available']='شتون لرونکی بهاو';
$ec_lang['lpn_ff_col_required']='اړین بهاو';
$ec_lang['lpn_ff_col_residual']='وساتل شوی پاتې فشار';
$ec_lang['lpn_ff_col_atrequired']='د اړین بهاو پر فشار';
$ec_lang['lpn_ff_col_affected']='بدترین اغیز';
$ec_lang['lpn_ff_col_limit']='د ډیزاین حد';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='چک شوی نه دی';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='ثابت پاتې راغلی، نو چک شوی نه دی';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='د پاتې راتلو ډولونه';
$ec_lang['lpn_ff_mode_fire']='اور';
$ec_lang['lpn_ff_mode_design']='ډیزاین';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='هیڅ یو';
$ec_lang['lpn_ff_col_solves']='چلونه';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='فشار او سرعت';
$ec_lang['lpn_ff_atleast']='له {flow} نه زیات';
$ec_lang['lpn_ff_affect_node']='{id} {pressure} ته راټیټیږي';
$ec_lang['lpn_ff_affect_link']='{id} {velocity} ته رسیږي';
$ec_lang['lpn_ff_more']='او {n} نور اغیزمن شوي';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='{n} نور جنکشنونه نه دي ښودل شوي.';
$ec_lang['lpn_ff_design_none']='کله چې د هر ازمویل شوي جنکشن اور بهاو په نوبت راایستل شو، د ډیزاین چک په ساحه کې هیڅ شی له خپلو حدونو نه ناکام نه شو.';
$ec_lang['lpn_ff_design_off_note']='پر پاتې سیسټم اغیز پدې محاسبه کې چک شوی نه دی.';
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
$ec_lang['lpn_ff_iso']='د بیمې خدماتو دفتر (ISO) یو واحد اور-خونده ته تر {flow} زیات کریډیټ نه ورکوي. دا حد دلته نه پلي کیږي، ځکه چې یو جنکشن ممکن له یوه اور-خونده زیات استازیتوب وکړي.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='دمخه له هرې اور بهاو راایستلو نه مخکې له پاتې فشار نه ټیټ دی';
$ec_lang['lpn_ff_err_converge']='شبکه یووالي ته ونه رسیده.';
$ec_lang['lpn_ff_err_solve']='حل کوونکي یوه تیروتنه راپور کړه او هیڅ ځواب یې ونه ورکړ.';
$ec_lang['lpn_ff_err_not_junction']='جنکشن نه دی';
$ec_lang['lpn_ff_err_unknown']='هیڅ پایله نشته. د تېروتنې کوډ: {code}';

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
$ec_lang['lpn_file_import_survey']='سروی شوي ټکي دننه کول…';
$ec_lang['lpn_file_import_survey_tip']='د سروی شویو ټکو لیست له متن فایل نه ولولئ او پر هر ټکي یو جنکشن جوړ کړئ، د هر هغه څه لپاره چې فایل یې نه بیانوي د نوې شتمنۍ ټاکنې کاروي. هیڅ پایپ نه رسمیږي مګر دا چې تاسو توضیح د ساحې کوډونو په توګه ولولئ ټک کړئ، او هیڅ قطار هیڅکله پرته له نومولو نه غورځول کیږي. دا هغه همغږۍ سیسټم لولي چې دا پروژه یې لا دمخه کاروي، که جغرافیوي شوی وي یا نه.';
$ec_lang['lpn_survey_read_error']='دا فایل ستاسو ډیسک نه نشو لوستل کیدی.';
$ec_lang['lpn_survey_cancelled']='هیڅ شی نه دی جوړ شوی او هیڅ شی نه دی بدل شوی.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='شمال والی';
$ec_lang['lpn_survey_axis_east']='ختیځ والی';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='دا فایل کې هیڅ شی نشته.';
$ec_lang['lpn_survey_err_unreadable']='دا فایل د سروی شویو ټکو د لیست په توګه نشو لوستل کیدی.';
$ec_lang['lpn_survey_err_ambiguous_coord']='په هغه فایل کې له یوه ستون زیات کیدی شي {axis} ({detail}) وي، او دا پاڼه د دوی ترمنځ نه ټاکي. یوازې یو یې د {axis} په نوم پرېږدئ او بیا هڅه وکړئ.';
$ec_lang['lpn_survey_err_no_points']='د دې فایل هیڅ یو قطار د سروی شوي ټکي په توګه نشو لوستل کیدی. لوستل شوي قطارونه: {detail}';
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
$ec_lang['lpn_survey_format_label']='د فایل بڼه:';
$ec_lang['lpn_survey_format_internal']='په داخلي توګه ټاکل شوی';
$ec_lang['lpn_survey_create']='نقطې جوړول';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='لومړۍ کرښه پرېښودل شوه: دا هیڅ کالم نه نوموي چې دا پاڼه یې پیژني.';
$ec_lang['lpn_survey_type_label']='د شتمنۍ ډول:';
$ec_lang['lpn_survey_confirm_junction']='{n} جنکشن(ونه) وموندل شول. ته وړاندې لاړ شم؟';
$ec_lang['lpn_survey_confirm_reservoir']='{n} ذخیره(ګانې) وموندل شوې. ته وړاندې لاړ شم؟';
$ec_lang['lpn_survey_confirm_tank']='{n} ټانک(ونه) وموندل شول. ته وړاندې لاړ شم؟';
$ec_lang['lpn_survey_report_junction']='{n} جنکشن(ونه) دننه شول، {m} یې د لوړوالي سره.';
$ec_lang['lpn_survey_report_reservoir']='{n} ذخیره(ګانې) دننه شوې، {m} یې د لوړوالي سره.';
$ec_lang['lpn_survey_report_tank']='{n} ټانک(ونه) دننه شول، {m} یې د لوړوالي سره.';
$ec_lang['lpn_survey_report_clean']='په فایل کې هر ټکی پرته له بدلون دننه شو.';
$ec_lang['lpn_survey_report_notes']='د دننه کولو تېروتنې او یادښتونه:';
$ec_lang['lpn_survey_sev_error']='تېروتنه';
$ec_lang['lpn_survey_sev_warning']='خبرداری';
$ec_lang['lpn_survey_note_line']='کرښه {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='د پورتنۍ فایل بڼې لپاره ډیر لږ کالمونه.';
$ec_lang['lpn_survey_note_coord_missing']='د {axis} حجره خالي ده.';
$ec_lang['lpn_survey_note_bad_coord']='{axis} د شمېرې په توګه نه لوستل کیږي.';
$ec_lang['lpn_survey_note_coord_range']='{axis} د دې پروژې د اجازه لړ نه بهر دی.';
$ec_lang['lpn_survey_note_bad_elev']='غیر عددي لوړوالی. بې د لوړوالي دننه شو.';
$ec_lang['lpn_survey_note_ambiguous_elev']='تر یو زیات کالم کیدی شي لوړوالی وي، نو هیڅ یو یې نه دی لوستل شوی.';
$ec_lang['lpn_survey_note_blank_rows']='خالي کرښې پرېښودل شوې: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='نوم دمخه پدې فایل کې مخکې کارول شوی، نوی نوم ورکړل شو.';
$ec_lang['lpn_survey_note_id_taken']='نوم دمخه پروژه کې دی، نوی نوم ورکړل شو.';
$ec_lang['lpn_survey_note_id_invalid']='نوم دلته نشي کارول کیدی، نوی نوم ورکړل شو.';
$ec_lang['lpn_hotkeys_menu_heading']='مینوګانې';
$ec_lang['lpn_hotkeys_menu_term']='د مینو د کیبورډ شارټکټونه';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+توری</td><td>هغه مینو چې دا توری لري پرانیزئ، بیا د کومې کرښې توری فشار کړئ ترڅو هغه غوره شي. توري هغه مهال ښکاري چې تاسو کیبورډ کاروئ. په Mac کې Ctrl+Option وکاروئ.</td></tr><tr><td>F10</td><td>د مینو پټې ته تلل.</td></tr></tbody></table>';
$ec_lang['lpn_graphs_menu']='ګرافونه';
$ec_lang['lpn_contour_menu']='کانتور';
$ec_lang['lpn_contour_tip']='پر نقشه د کانتور انځور ښودل: د نقطو رنګونه د پایپونو په اوږدو او څنګ کې خپریږي، او د نومونو لرونکې کانتور کرښې ښکاري. یو بکس پرانیزي چې تاسو یې تنظیم یا بند کړئ.';
$ec_lang['lpn_contour_plot']='کانتور انځور';
$ec_lang['lpn_contour_fill']='ډکول';
$ec_lang['lpn_contour_fill_tip']='نرم رنګونه له یوې طبقې نه بلې ته په ورو ورو سره ګډوي. بندونه د رنګ کیلي هره طبقه په یو ډول (ساده) رنګوي.';
$ec_lang['lpn_contour_fill_smooth']='نرم';
$ec_lang['lpn_contour_fill_bands']='بندونه';
$ec_lang['lpn_contour_opacity']='د ډکولو ګنده توب';
$ec_lang['lpn_contour_lines']='کانتور کرښې';
$ec_lang['lpn_contour_interval']='وقفه';
$ec_lang['lpn_contour_buffer']='بفر';
$ec_lang['lpn_contour_buffer_unit']='× د پایپ منځنۍ اوږدوالی';
$ec_lang['lpn_contour_buffer_tip']='د هر پایپ څخه د رنګ رسېدل، د منځنۍ پایپ اوږدوالي د څو ځله په توګه. دا په بهرنۍ برخه کې ورو ورو ورکیږي.';
$ec_lang['lpn_contour_few']='د کانتور لپاره نقطې ډیرې لږ دي.';
$ec_lang['lpn_contour_support']='کانتور انځور: {n} نقطې، د {p} پایپونو په اوږدو کې او د هغوی څنګ کې تر {k} ځله د پایپ تر منځنۍ اوږدوالي پورې انټرپولېټ شوي. د پمپونو، والوونو، یا بندو تړاوونو په اوږدو کې رنګ نشته.';
$ec_lang['lpn_contour_support_lines']='کانتور کرښې هر {i} {u} وروسته.';
$ec_lang['lpn_contour_too_many']='پدې وقفه کې کانتور کرښې ډیرې دي؛ د ایستلو لپاره یې پراخه کړئ.';
$ec_lang['lpn_contour_dem']='د نقطو ترمنځ ځمکه د Mapbox DEM نه';
$ec_lang['lpn_contour_dem_tip']='د نقطو ترمنځ، فشار د انټرپولېټ شوي هیډ منفي د Mapbox DEM د ځمکې لوړوالی کیږي، نو په یوه غونډۍ چې شبکه پرې نقطه نه لري کیدی شي د ټیټ ترین نقطې فشار نه هم ټیټ شي. ځمکه د کانتور نقشې په توګه وګڼئ، نه د سروې په توګه.';
$ec_lang['lpn_contour_support_dem']='د نقطو ترمنځ، فشار د انټرپولېټ شوي هیډ منفي د Mapbox DEM د ځمکې لوړوالی دی، چې شاوخوا هر {m} m کې نمونه اخیستل شوی.';
$ec_lang['lpn_contour_dem_failed']='ځمکه د Mapbox DEM نه نه شوه لوستل کیدی، نو فشار یوازې د نقطو ترمنځ انټرپولېټ شوی.';
$ec_lang['lpn_contour_consent_1']='پر ځمکه د فشار انځورول هغه سیمه چې ستاسو شبکه یې پوښي، د Mapbox د نقشې ټایل شمېرو په توګه، api.mapbox.com ته لیږي، ترڅو هلته د ځمکې لوړوالی ولولي.';
$ec_lang['lpn_contour_consent_2']='دا د هغو نقشې انځورونو نه جلا پوښتنه ده چې ستاسو د پروژې شا ته دي. انځورونه یوازې وایي چې تاسو چیرته ګورئ. دا ټایلونه وایي چې ستاسو شبکه چیرته ده. Mapbox به دا ټایل شمېرې او ستاسو IP پته ترلاسه کړي. بل هیڅ نه لیږو: نه نوم، نه پایپونه، نه پروژه. موږ د دې هیڅ ثبت نه ساتو، او پدې وسیله کې بل هیڅ نه ساتل کیږي پرته د دې پوښتنې ستاسو له ځواب نه.';
$ec_lang['lpn_contour_consent_3']='ایا موږ کولی شو ستاسو د شبکې د سیمې ټایل شمېرې Mapbox ته ولیږو؟';
$ec_lang['lpn_contour_consent_4']='که تاسو نه ووایاست، په دې پاڼه کې نور هر څه لکه اوس هم کار کوي، او کانتور انځور یوازې د نقطو ترمنځ ایستل کیږي. هو مو یادوو ترڅو بیا ونه پوښتو. نه هیڅ نه ساتل کیږي.';
$ec_lang['lpn_sysflow_menu']='د بهاو توازن';
$ec_lang['lpn_sysflow_tip']='د اوږدې مودې سمولېشن په اوږدو کې، د وخت پر وړاندې د تولید شوي ټول بهاو او مصرف شوي ټول بهاو ګراف. ټانکونه په هیڅ یو ټول کې نه دي، نو چیرته چې دوه کرښې جلا کیږي، ټانکونه ډکیږي یا خالیږي.';
$ec_lang['lpn_sysflow_produced']='تولید شوی';
$ec_lang['lpn_sysflow_produced_tip']='د ذخیرو او منفي غوښتنو نه شبکې ته ننوتونکی ټول بهاو.';
$ec_lang['lpn_sysflow_consumed']='مصرف شوی';
$ec_lang['lpn_sysflow_consumed_tip']='د هرې مثبتې غوښتنې ټول: هغه اوبه چې په جنکشنونو کې له شبکې نه اخیستل کیږي، او هر هغه بهاو چې ذخیرې ته ننوځي.';
$ec_lang['lpn_copy_title']='فایل د نوې کاپي په توګه نښه کړم؟';
$ec_lang['lpn_copy_body']='دا فایل وايي چې په {date} جوړ شوی، او دا براوزر یې نه پیژني. ایا دا اصلي فایل دی (ورته بندیز وساتئ) که کاپي (نوی بندیز جوړ کړئ)؟';
$ec_lang['lpn_copy_body_nodate']='دا براوزر دا فایل نه پیژني. ایا دا اصلي فایل دی (ورته بندیز وساتئ) که کاپي (نوی بندیز جوړ کړئ)؟';
$ec_lang['lpn_copy_original']='اصلي؛ ورته بندیز وساتئ';
$ec_lang['lpn_copy_copy']='کاپي؛ نوی بندیز جوړ کړئ';
$ec_lang['lpn_copy_kept_link']='{name} د اصلي په توګه، په نوي ځای کې پرانیستل شو. خوندي کول اوس همدې فایل ته لیکي.';
$ec_lang['lpn_copy_opened']='{file} د کاپي په توګه پرانیستل شو او د نوي بندیز سره وساتل شو.';
$ec_lang['lpn_scenario_basic']='ساده حالت';
$ec_lang['lpn_scenario_basic_tip']='ټاکل شوی: سناریو یوازې له هغو ارزښتونو جوړه ده چې پکې ټاکل شوي. پاک شوی: دا مینو د بدیلونو مخکتنې جدول هم وړاندې کوي، چې ښیي دا ارزښتونه په کټګورۍ سره څنګه ډلبندي شوي، او اجازه ورکوي چې سناریو جلا ټول چلولو وخت او هیدرولیکي وخت ګام ولري. د دې ځانګړتیا په اړه نظر ښه راغلاست دی.';
$ec_lang['lpn_alt_title']='د بدیلونو مخکتنه';
$ec_lang['lpn_alt_note']='اساسي هره کټګورۍ د اساسي بدیل کاروي. هره سناریو د هرې بدلې شوې کټګورۍ لپاره جلا بدیل لري، چې د اساسي بدیل ماشوم دی. شمېره د بدل شویو ارزښتونو شمېر دی. وروستي درې کالمونه د محاسبې اختیارونه دي: د سناریو لپاره ارزښت ولیکئ، یا یې خالي پرېږدئ ترڅو د والد ارزښت وکارول شي. د پروژې ارزښتونه په تنظیماتو، محاسبه، وخت کې دي.';
$ec_lang['lpn_alt_cat_physical']='فزیکي';
$ec_lang['lpn_alt_cat_demand']='غوښتنه';
$ec_lang['lpn_alt_cat_topology']='د شتمنیو فعالول';
$ec_lang['lpn_alt_cat_initial']='لومړني تنظیمات';
$ec_lang['lpn_alt_cat_constituent']='جز';
$ec_lang['lpn_alt_cat_fireflow']='د اور بهاو';
$ec_lang['lpn_alt_cat_energy']='د انرژۍ لګښت';
$ec_lang['lpn_alt_cat_userdata']='ځانګړي ځانګړتیاوې';
$ec_lang['lpn_alt_cat_text']='متن';
$ec_lang['lpn_reports_calib']='کالیبریشن';
$ec_lang['lpn_reports_calib_tip']='د کالیبریشن فایل د اندازه شوو ساحوي معلوماتو سره د وروستي چلولو پرتله کول: احصایې، یو همبستګي انځور، او د منځنیو پرتله کول.';
$ec_lang['lpn_calib_title']='د کالیبریشن راپور';
$ec_lang['lpn_calib_param']='پارامیټر';
$ec_lang['lpn_calib_param_tip']='هغه کمیت چې د کالیبریشن فایل یې اندازه کوي. د هر پارامیټر لپاره یو فایل ساتل کیږي.';
$ec_lang['lpn_calib_load']='د کالیبریشن فایل پورته کړئ…';
$ec_lang['lpn_calib_load_tip']='یو متني فایل چې په هره کرښه کې د ځای نوم، یو وخت، او یو اندازه شوی ارزښت لري. وخت د سمولېشن له پیل نه، په اعشاري ساعتونو یا ساعت:دقیقو اندازه کیږي. یو سیمیکولن یو نظر پیلوي. هغه کرښه چې یوازې وخت او ارزښت لري هغې ته تړلې ده چې پورته ده.';
$ec_lang['lpn_calib_none']='د دې پارامیټر لپاره هیڅ د کالیبریشن فایل نه دی پورته شوی.';
$ec_lang['lpn_calib_session']='د کالیبریشن فایل یوازې د دې ناستې لپاره ساتل کیږي. دا له پروژې سره یا پدې وسیله کې خوندي نه کیږي.';
$ec_lang['lpn_calib_file']='{file}: {n} اندازې په {m} ځایونو کې.';
$ec_lang['lpn_calib_units']='د فایل ارزښتونه د دې پروژې په واحدونو لوستل کیږي: {unit}.';
$ec_lang['lpn_calib_missing']='په فایل کې نومول شوي خو پدې شبکه کې نه دي: {ids}.';
$ec_lang['lpn_calib_missing_count']='هغه اندازې پرېښودل شوې چې ځای یې پدې شبکه کې نشته: {n}.';
$ec_lang['lpn_calib_bad_lines']='هغه کرښې چې نه شوې لوستل کیدی، پرېښودل شوې: {lines}';
$ec_lang['lpn_calib_outside']='هغه اندازې چې د دې چلولو د راپور شوو وختونو نه بهر دي، پرېښودل شوې: {n}.';
$ec_lang['lpn_calib_no_value']='هغه اندازې چې په خپل وخت کې محاسبه شوی ارزښت نه لري، پرېښودل شوې: {n}.';
$ec_lang['lpn_calib_single']='دا یو واحد دوره چلول دی، نو هره اندازه د دې یوازینۍ پایلې سره پرتله کیږي، فایل هر وخت چې ورکوي.';
$ec_lang['lpn_calib_needs_run']='تر اوسه د پرتلې لپاره پایلې نشته. راپور هغه مهال ډکیږي چې شبکه محاسبه شي.';
$ec_lang['lpn_calib_no_pairs']='هیڅ اندازه نه شوه پرتله کیدی، نو د انځورولو لپاره هیڅ نشته.';
$ec_lang['lpn_calib_tab_stats']='احصایې';
$ec_lang['lpn_calib_tab_corr']='همبستګي انځور';
$ec_lang['lpn_calib_tab_means']='د منځنیو پرتله کول';
$ec_lang['lpn_calib_col_location']='ځای';
$ec_lang['lpn_calib_col_n']='د مشاهدو شمېر';
$ec_lang['lpn_calib_col_obs_mean']='مشاهده شوی منځنی';
$ec_lang['lpn_calib_col_sim_mean']='محاسبه شوی منځنی';
$ec_lang['lpn_calib_col_mean_err']='منځنۍ تېروتنه';
$ec_lang['lpn_calib_col_mean_err_tip']='د هر مشاهده شوي ارزښت او په ورته وخت کې د محاسبه شوي ارزښت ترمنځ د مطلقو توپیرونو منځنی.';
$ec_lang['lpn_calib_col_rms_err']='RMS تېروتنه';
$ec_lang['lpn_calib_col_rms_err_tip']='د مربع منځنۍ جذر تېروتنه: د مشاهده شوو او محاسبه شوو ارزښتونو ترمنځ د مربع شوو توپیرونو د منځني جذر.';
$ec_lang['lpn_calib_network']='شبکه';
$ec_lang['lpn_calib_corr_means']='د منځنیو ترمنځ همبستګي: {r}';
$ec_lang['lpn_calib_corr_none']='د منځنیو ترمنځ همبستګي: لږ تر لږه دوه ځایونه په کار دي چې منځنی یې توپیر ولري.';
$ec_lang['lpn_calib_axis_obs']='مشاهده شوی: {q}';
$ec_lang['lpn_calib_axis_sim']='محاسبه شوی: {q}';
$ec_lang['lpn_calib_observed']='مشاهده شوی';
$ec_lang['lpn_calib_computed']='محاسبه شوی';
$ec_lang['lpn_calib_point']='{id}، {time}: مشاهده شوی {o}، محاسبه شوی {s}';
$ec_lang['lpn_calib_corr_note']='هر نقطه یوه اندازه ده. هر څومره چې نقطې د قطري کرښې ته نږدې وي، محاسبه شوي ارزښتونه د مشاهده شوو سره نږدې دي.';
$ec_lang['lpn_calib_ts_point']='په {id} کې اندازه شوی، {time}: {v}';
$ec_lang['lpn_calib_ts_note']='حلقې د کالیبریشن فایل نه اندازه شوي ارزښتونه دي.';
$ec_lang['lpn_analyze_menu']='تحلیل';
$ec_lang['lpn_analyze_menu_tip']='هغه تحلیلونه چې شبکه پر یوې کاپي چلوي: په هر جنکشن کې د اور بهاو، د هر پایپ، پمپ، او والو ضایع، او پورته یا ښکته شوې غوښتنې.';
$ec_lang['lpn_ff_design_off']='هیڅ';
$ec_lang['lpn_ff_design_all']='ټول';
$ec_lang['lpn_ff_design_selected']='ټاکل شوي';
$ec_lang['lpn_ff_rows_more_links']='نه ښودل شوي تړاوونه: {n}.';
$ec_lang['lpn_crit_menu']='د مهمیت تحلیل…';
$ec_lang['lpn_crit_menu_tip']='هر پایپ، پمپ، او والو په نوبت سره له شبکې لرې کړئ او په سیسټم یې اغیز راپور کړئ.';
$ec_lang['lpn_crit_title']='د مهمیت تحلیل';
$ec_lang['lpn_crit_intro']='هره شتمني په نوبت سره له شبکې نه ایستل کیږي، او شبکه د فعالې سناریو په هغه وخت ګام کې حل کیږي چې پر پرده دی. ستاسو په پروژه کې هیڅ نه بدلیږي؛ ټوله چلونه پر یوې کاپي کیږي.';
$ec_lang['lpn_crit_scope']='هغه تړاوونه چې ماتېږي';
$ec_lang['lpn_crit_scope_tip']='ټول پایپونه، پمپونه، او والوونه، یا یوازې هغه چې پر نقشه ټاکل شوي. مخکې له چلولو ډله غوره کړئ.';
$ec_lang['lpn_crit_scope_all']='ټول تړاوونه';
$ec_lang['lpn_crit_scope_selected']='ټاکل شوي تړاوونه';
$ec_lang['lpn_crit_minpressure']='ټیټ ترین اجازه شوی فشار';
$ec_lang['lpn_crit_minpressure_tip']='دا هماغه شمېره ده چې د اور بهاو په شننه کې د ټیټ ترین اجازه شوي فشار په نوم ده. دلته یې بدلول هلته هم بدلوي.';
$ec_lang['lpn_crit_col_asset']='شتمني';
$ec_lang['lpn_crit_col_unserved']='نه خدمت شوې غوښتنه';
$ec_lang['lpn_crit_col_cutoff']='پرې شوي جنکشنونه';
$ec_lang['lpn_crit_col_below']='جنکشنونه تر ټیټ ترین حد ښکته';
$ec_lang['lpn_crit_summary']='د {total} شتمنیو نه {n} هغه دي چې غوښتنه نه خدمتوي یا یو جنکشن تر {pressure} ښکته کوي.';
$ec_lang['lpn_crit_baseline_below']='جنکشنونه چې دمخه له هیڅ شی ماتولو پرته ځنې ښکته دي: {n}. دا نه شمېرل کیږي.';
$ec_lang['lpn_crit_working']='کار روان دی: د {total} شتمنیو نه {done}.';
$ec_lang['lpn_crit_stopped']='د {total} شتمنیو نه {done} وروسته ودرېد. لاندې پایلې هغه دي چې دمخه بشپړې شوې.';
$ec_lang['lpn_crit_no_selection']='هیڅ تړاو نه دی ټاکل شوی. تړاوونه وټاکئ یا ټول تړاوونه غوره کړئ.';
$ec_lang['lpn_crit_no_links']='دا پروژه تر اوسه هیڅ تړاو نه لري، نو د ماتولو لپاره هیڅ نشته.';
$ec_lang['lpn_crit_busy']='بل تحلیل روان دی. هغه ودروئ، یا د پای ته رسېدو انتظار وکړئ.';
$ec_lang['lpn_crit_skipped']='{n} ټاکل شوي عناصر تړاوونه نه دي، نو نه دي ماتې شوي.';
$ec_lang['lpn_crit_stale']='انځور بدل شو، نو د مهمیت پایلې پاکې شوې. بیا یې وچلوئ.';
$ec_lang['lpn_crit_skipdead']='بند پای پرېښودل';
$ec_lang['lpn_crit_skipdead_tip']='د بند پای تړاو هغه دی چې لرې کول یې هغه جنکشنونه پرې کوي چې یوازې د هغه له لارې رسیدلی شي، له هغه وروسته هیڅ ذخیره یا ټانک نه شته. د هغه ضایع هر هغه څه دي چې له هغه وروسته دي، نو حل نه کیږي. لنډیز وايي څو پرېښودل شوي.';
$ec_lang['lpn_crit_skipped_dead']='بند پای تړاوونه پرېښودل شوي: {n}. هر یو هر هغه څه پرې کوي چې له هغه وروسته دي.';
$ec_lang['points_data_msg_line']='هیڅ شی نه دی پیسټ شوی. {n} کرښه د ستیشن او لوړوالي په توګه نه شوه لوستل کیدی.';
$ec_lang['points_data_msg_none']='هیڅ شی نه دی پیسټ شوی. د ستیشن او لوړوالي هیڅ جوړه ونه موندل شوه.';
$ec_lang['lpn_tool_add_chain']='د جنکشن او پایپ ځنځیر';
$ec_lang['lpn_pane_delete_element']='عنصر ړنګول';
$ec_lang['lpn_pane_delete_elements']='عنصرونه ړنګول';
$ec_lang['lpn_pane_sort_desc']='ښکته کیدونکی ترتیب';
$ec_lang['lpn_pane_manage_cols_width']='پلنوالی (em)';
$ec_lang['lpn_pane_width_tip']='د کالمونو پلنوالی په دې براوزر کې ساتل کیږي، نه په پروژه کې. د اصلي پلنوالي بېرته راوستلو لپاره د کالم پر جلا کوونکي دوه ځله کلیک وکړئ.';
$ec_lang['lpn_dock_left']='د نقشې په کیڼ لور کې ځای پر ځای کول';
$ec_lang['lpn_dock_right']='د نقشې په ښي لور کې ځای پر ځای کول';
$ec_lang['lpn_dock_float']='تیرېدونکی';
$ec_lang['lpn_dock_autohide']='پخپله پټول';
$ec_lang['lpn_popup_none']='هیڅ شی نه دی ټاکل شوی. د ځانتیاوو لیدلو لپاره په نقشه کې یوه شتمني وټاکئ.';
$ec_lang['lpn_hotkeys_snip_heading']='سکرین شاټ';
$ec_lang['lpn_hotkeys_snip_term']='د سکرین شاټ د کیبورډ شارټکټونه';
$ec_lang['lpn_hotkeys_snip_def']='<table class="lpn-notes-table"><tbody><tr><td>S</td><td>غوڅول، کله چې سکرین شاټ پرانیستی وي.</td></tr><tr><td>E</td><td>پاکوونکی، د نښه کولو لید کې.</td></tr><tr><td>Ctrl+Z, Ctrl+Y</td><td>بېرته کول او بیا کول، د نښه کولو لید کې.</td></tr><tr><td>Esc</td><td>غوڅول لغوه کول، یا له مبول نه وتل. د نښه کولو لید کې، کله چې هیڅ شی رسم شوی نه وي بند یې کړئ.</td></tr></tbody></table>';
$ec_lang['lpn_fb_intro']='چمتو شوي پیغامونه (اختیاري). تر هغه چې لیږل نه وي فشار شوي، هیڅ نه لیږل کیږي.';
$ec_lang['lpn_fb_pick_numbers']='شمېرې غلطې ښکاري';
$ec_lang['lpn_fb_pick_broken']='یو شی کار ونه کړ';
$ec_lang['lpn_fb_pick_wording']='الفاظ یا ژباړه غلطه ده';
$ec_lang['lpn_fb_pick_confusing']='دا ګډوډوونکی دی';
$ec_lang['lpn_fb_comment']='نظرونه (اختیاري)';
$ec_lang['lpn_fb_email']='بریښنالیک (اختیاري، یوازې که ځواب غواړئ)';
$ec_lang['lpn_fb_sends']='دا څه لیږي: د دې پاڼې نوم، ستاسو ژبه، د سایټ نسخه، په نقشه کې د پیغام کوډ که شتون ولري، او هغه څه چې تاسو غوره کړي یا لیکلي دي. هیڅکله ستاسو انځور یا ستاسو شبکه نه. ستاسو بریښنالیک پته یوازې تاسو ته د ځواب ورکولو لپاره کارول کیږي.';
$ec_lang['lpn_fb_send']='لیږل';
$ec_lang['lpn_fb_sending']='لیږل کیږي…';
$ec_lang['lpn_fb_failed']='دا موږ ته ونه رسیده. هغه څه چې تاسو لیکلي دلته لا هم شته، نو بیا هڅه کولی شئ.';
$ec_lang['lpn_fb_bad_email']='دا بریښنالیک پته سمه نه ښکاري. یې سمه کړئ، یا یې خالي پرېږدئ.';
$ec_lang['lpn_fb_busy']='په تیرو څو دقیقو کې ډېر پیغامونه راغلي دي. هغه څه چې تاسو لیکلي دلته لا هم شته، نو وروسته بیا هڅه کولی شئ.';
$ec_lang['lpn_tool_add_chain_tip']='د جنکشنونو او پایپونو ځنځیر: د جنکشن اضافه کولو لپاره په نقشه کې یو ټکی وټاکئ، بیا د پایپ او جنکشن اضافه کولو لپاره هر راتلونکی ټکی وټاکئ. د دوام لپاره یوه موجوده نقطه وټاکئ. ځنځیر پای ته رسولو لپاره Escape ووهئ.';
$ec_lang['lpn_pane_filter_sel_note']='یوازې ټاکل شوي. {all} څخه {n} ښودل کیږي.';
$ec_lang['lpn_pane_filter_sel_and']='د {q} او یوازې ټاکل شویو له مخې چاڼ شوی. {all} څخه {n} ښودل کیږي.';
$ec_lang['lpn_pane_filter_sel_none']='له ټاکل شویو عنصرونو هیڅ یو په دې جدول کې نشته.';
$ec_lang['lpn_pane_sel_only']='یوازې ټاکل شوي';
$ec_lang['lpn_pane_sel_only_none']='هیڅ عنصر نه دی ټاکل شوی. لومړی په نقشه کې عنصرونه وټاکئ.';
$ec_lang['lpn_pane_scn_show']='سناریوګانې ښودل';
$ec_lang['lpn_pane_clear_override']='خپل ارزښت پاکول';
$ec_lang['lpn_pane_scn_alt_tip']='{category} بدیل: {alternative}';
$ec_lang['lpn_change_type_menu']='ډول بدلول';
$ec_lang['lpn_change_type_tip']='ټاکل شوې نقطې په جنکشنونو، ذخیرو، یا ټانکونو بدل کړئ، یا ټاکل شوي تړاوونه په پایپونو، پمپونو، یا والوونو. هر یو خپل ID، خپل ځای، خپل اړیکې، او هر هغه ارزښت ساتي چې نوی ډول هم لري. که کوم شی له لاسه ورکول کیږي، لومړی ستاسو څخه پوښتل کیږي.';
$ec_lang['lpn_change_type_ok']='بدلول';
$ec_lang['lpn_change_type_lost']='دا ارزښتونه به له لاسه ورکړل شي:';
$ec_lang['lpn_change_type_key']='ID: له لاسه ورکړل شوې ننوتنه';
$ec_lang['lpn_change_type_line']='{id}: {property} {value}';
$ec_lang['lpn_change_type_line_scenario']='{id}: {property} {value}، په سناریو {scenario} کې';
$ec_lang['lpn_change_type_more']='او {n} نور.';
$ec_lang['lpn_change_type_surface']='دا د اوبو سطحه هماغسې ساتي لکه چې وه. د ذخیرې هیډ د ټانک لوړوالی او د هغه د اوبو ژوروالی سره یوځای دی، او د ټانک د اوبو ژوروالی د ذخیرې هیډ منفي د ټانک لوړوالی دی:';
$ec_lang['lpn_change_type_meaning']='دا کنټرولونه او قاعدې هغه نقطه ازمويي چې بدلیږي، او ممکن یې بل ډول ولولي: جنکشن په خپل فشار ازمویل کیږي، او ټانک یا ذخیره په خپل د اوبو په کچه:';
$ec_lang['lpn_change_type_born']='دا ارزښتونه نوي دي، لکه په نوي رسم شوې شتمنۍ کې ټاکل شوي:';
$ec_lang['lpn_change_type_no_curve']='{id}: د پمپ هیډ منحنۍ نشته، نو پمپ هیڅ هیډ نه زیاتوي تر هغه چې یوه ونه ټاکل شي، او د .inp صادرول یې د پایپ په توګه لیکي';
$ec_lang['lpn_change_type_becomes']='{id}: {property} {value}، په سناریو {scenario} کې، {new} کیږي';
$ec_lang['lpn_change_type_customers']='یوازې پایپ مشتریان خدمتوي، نو دا مشتریان پر ځای یې په هغه نقطې پورې وصل کیږي چې په قوسونو کې ښودل شوې، چیرې چې د دوی غوښتنه لا دمخه پلي شوې ده. دوی هماغه ځای پاتې کیږي چیرې چې رسم شوي دي، او د دوی غوښتنه نه بدلیږي:';
$ec_lang['lpn_change_type_setting']='دا کنټرولونه او قاعدې د هغه تړاو ترتیب ورکوي یا ازمويي چې بدلیږي. ترتیب په پایپ، پمپ، او والو کې بېل مقدار دی، نو دا به یې بیا بل ډول ولولي:';
$ec_lang['lpn_change_type_rules']='دا د قاعدې کرښې یو تړاو د هغه د ډول په واسطه نوموي، او پر ځای یې به د هغه نوی ډول ونوموي:';
$ec_lang['lpn_find_scope_source']='سرچینه';
$ec_lang['lpn_find_source_no_chemical']='هیڅ کیمیاوي مواد نه رهیابي کیږي، نو هیڅ نقطه سرچینه نه لري.';
$ec_lang['lpn_profile_open']='د EPANET د پروفایل فایل پرانیستل…';
$ec_lang['lpn_profile_file_done']='پروفایل له فایل څخه ولوستل شو: په دې شبکه کې {total} نقطو څخه {used} وموندل شوې.';
$ec_lang['lpn_profile_file_missing']='په فایل کې نومول شوي خو په دې شبکه کې نشته: {ids}.';
$ec_lang['lpn_profile_file_short']='فایل په دې شبکه کې له دوو نقطو لږ نومونه لري، نو د رسمولو لپاره هیڅ پروفایل نشته.';
$ec_lang['lpn_pgraph_none']='دا شتمني په اوسني چلولو کې هیڅ پایله نه لري.';
$ec_lang['lpn_pgraph_source_share_from']='د {node} سرچینې ونډه';
$ec_lang['lpn_result_pump_head']='هیډ';
$ec_lang['lpn_result_pump_head_tip']='هغه هیډ چې پمپ له مکونې څخه تر وتلو پورې زیاتوي، د مثبت شمېرې په توګه ښودل شوی. حل کوونکی او د EPANET فایلونه یې د منفي د سر ضیاع په توګه لري.';
$ec_lang['lpn_report_pump_head']='د پمپ هیډ';
$ec_lang['lpn_contour_show']='کانتورونه ښودل';
$ec_lang['lpn_contour_show_tip']='د ډکولو او د کانتور کرښو پټولو لپاره یې پاک کړئ؛ د هغوی بېرته راوستلو لپاره یې وټاکئ لکه څنګه چې وو. د نقطو رنګونه پاتې کیږي.';
$ec_lang['lpn_sysflow_title']='د بهاو توازن';
$ec_lang['lpn_crs_suggested_mark']='(وړاندیز شوی)';
$ec_lang['lpn_file_export_menu']='صادرول…';
$ec_lang['lpn_file_export_item_inp']='د EPANET فایل…';
$ec_lang['lpn_file_export_item_geojson']='د GeoJSON فایل…';
$ec_lang['lpn_status_inp_exported_picture']='{zip} صادر شو، چې د EPANET فایل {file}، د هغه شاليد انځور {picture}، او د نقشې همغږۍ دوتنه {world} لري. دا درې واړه په یوه پوښۍ کې استخراج کړئ، بیا هلته .inp په EPANET کې پرانیزئ؛ انځور ورسره راځي.';
$ec_lang['lpn_status_inp_exported_no_picture']='{file} صادر شو. شاليد انځور ونه ساتل شو، نو .inp هیڅ نه نوموي؛ په EPANET کې یې د View > Backdrop > Load له لارې اضافه کړئ.';
$ec_lang['lpn_inp_export_difference_one']='یو شی چې د .inp بڼه یې نشي نیولی.';
$ec_lang['lpn_file_export_geojson_tip']='دا شبکه د QGIS، ArcGIS Pro او نورو GIS پروګرامونو لپاره د GeoJSON فایل په توګه ډاونلوډ کړئ. جنکشنونه، ټانکونه او ذخیرې ټکي دي، او پایپونه، پمپونه او والوونه کرښې دي چې خپلې نقطې تعقیبوي. موقعیتونه عرض البلد او طول البلد دي. پایلې یوازې هغه وخت شاملې دي چې شبکه حل شوې وي.';
$ec_lang['lpn_geojson_refused_local']='د GeoJSON فایل یوازې عرض البلد او طول البلد لري، او دا پروژه پر یوه محلي جال رسم شوې ده چې پر ځمکه هیڅ ځای نه لري. لومړی یې د Map، World map، Attach له لارې جغرافیوي کړئ، بیا بیا صادر کړئ.';
$ec_lang['lpn_geojson_refused_range']='دا موقعیتونه سم عرض البلد او طول البلد نه دي: {detail}';
$ec_lang['lpn_geojson_refused_crs']='د دې پروژې همغږۍ سیسټم ({detail}) دې پاڼې ته نامعلوم دی، نو د هغه موقعیتونه عرض البلد او طول البلد ته نشي بدلیدی. د Convert as… وکاروئ ترڅو پروژه هغه سیسټم ته کاپي شي چې دا پاڼه یې پیژني، بیا بیا صادر کړئ.';
$ec_lang['lpn_geojson_refused_empty']='تر اوسه د صادرولو لپاره هیڅ شی نشته. لومړی یوه شبکه رسم کړئ یا پرانیزئ.';
$ec_lang['lpn_geojson_results_in']='هغه پایلې چې په سکرین کې دي شاملې دي.';
$ec_lang['lpn_geojson_results_out']='هیڅ پایله شامله نه ده، ځکه چې شبکه نه ده حل شوې.';
$ec_lang['lpn_inp_backdrop_attach']='{file} وصلول…';
$ec_lang['lpn_inp_backdrop_attach_tip']='ویب پاڼه انځور په نوم نشي پرانیستلی. دا په خپله وسیله کې وټاکئ او هغه هلته ځای پر ځای کیږي چیرې چې فایل وايي چې تړاو لري.';
$ec_lang['lpn_inp_backdrop_attached']='{file} ولګول شو، هلته ځای پر ځای شو چیرې چې فایل وايي چې تړاو لري.';
$ec_lang['lpn_inp_backdrop_attached_other']='{picked} ولګول شو، هلته ځای پر ځای شو چیرې چې فایل وايي چې تړاو لري. فایل {file} نوموي، چې بل نوم دی.';
$ec_lang['lpn_copy_opened_unsaved']='{file} د کاپي په توګه پرانیستل شو، د نوي بندیز سره چې د راتلونکي فایل ساتلو سره به ساتل کیږي.';
$ec_lang['lpn_engine_unavailable_why']='د فشار او بهاو کنټرول والوونه (PRV، PSV، FCV) پرته له EPANET حل کوونکي نشي حل کیدی. {reason}';
$ec_lang['lpn_engine_needed_failed_why']='دا شبکه یوازې د EPANET حل کوونکي حلولی شي. {reason}';
$ec_lang['lpn_mode_add_chain']='حالت: د جنکشن او پایپ ځنځیر. د جنکشن اضافه کولو لپاره په نقشه کې یو ټکی وټاکئ، بیا د پایپ او جنکشن اضافه کولو لپاره هر راتلونکی ټکی وټاکئ. د دوام لپاره یوه موجوده نقطه وټاکئ. ځنځیر پای ته رسولو لپاره Escape ووهئ. د شتمنیو او لیبلونو د بدلولو یا خوځولو لپاره ټاکلو حالت ته ورګرځئ.';
$ec_lang['lpn_cp_allow_tip']='یوازې دا کرکټرونه اجازه ورکړئ:';
$ec_lang['lpn_cp_characters_tip']='"@" یعنې هر توری؛ "#" یعنې هر عددي رقم، او که "-"، "."، او "," اجازه وي نو باید جلا لیست شي؛ او هر سپین ځای کرکټر باید د نورو حروفو ترمنځ وي.';
$ec_lang['lpn_valwarn_diameter']='د پایپ یا والو قطر معمولاً د {min} او {max} {unit} ترمنځ وي. شمېره او د قطر واحد وګورئ.';
$ec_lang['lpn_valwarn_hw']='د هیزن-ویلیامز C معمولاً د {min} او {max} ترمنځ وي. له دې حد بهر شمېره ډېری وخت د بل اصطکاک میتود لپاره خشونت وي.';
$ec_lang['lpn_valwarn_manning']='د مانینګ n معمولاً د {min} او {max} ترمنځ وي. له دې حد بهر شمېره ډېری وخت د بل اصطکاک میتود لپاره خشونت وي.';
$ec_lang['lpn_valwarn_dw']='د ډارسي-ویسباخ خشونت معمولاً له 0 زیات او تر {max} {unit} پورې وي. لویه شمېره ډېری وخت د هیزن-ویلیامز C یا د مانینګ n وي.';
$ec_lang['lpn_valwarn_positive']='EPANET دلته صفر یا منفي شمېره نه مني.';
$ec_lang['lpn_valwarn_negative']='EPANET دلته منفي شمېره نه مني.';
$ec_lang['lpn_valwarn_tank_levels']='EPANET دا ټانک نه مني. ټیټ ترین د اوبو ژوروالی باید له د اوبو ژوروالي نه زیات نه وي، او د اوبو ژوروالی باید له لوړ ترین د اوبو ژوروالي نه زیات نه وي.';
$ec_lang['lpn_alt_calc_options']='د محاسبې اختیارونه';
$ec_lang['lpn_scenario_duration_tip']='د میراث لپاره یې خالي پرېږدئ. د 0:00 ټول چلولو وخت یو ثابت حالت چلول دی.';
$ec_lang['lpn_scenario_hyd_step_tip']='د میراث لپاره یې خالي پرېږدئ.';
$ec_lang['lpn_time_scn_overrides']='د سناریو خپل ارزښتونه:';
$ec_lang['lpn_scenario_preset_mult_tip']='د غوښتنې ضریب {mult} ځله منځنۍ ورځ، یو ځای‌ناستی ارزښت. ډېری سیسټمونه د {lo} او {hi} ترمنځ راځي (National Research Council, 2006). د هغه سیسټم لپاره ارزښت چې ماډل کیږي په تنظیماتو، محاسبه، هایدرولیکس، د غوښتنې ضریب کې وټاکئ.';
$ec_lang['lpn_engine_failed_why']='{reason} پر ځای یې دننه جوړ شوی حل کوونکی ښودل کیږي.';
$ec_lang['lpn_settings_basemap_style']='د بنسټیزې نقشې سټایل';
$ec_lang['lpn_basemap_style_normal']='عادي';
$ec_lang['lpn_basemap_style_muted']='نرم';
$ec_lang['lpn_basemap_style_faded']='ورو';
$ec_lang['lpn_basemap_style_grayscale']='خړ رنګه';
$ec_lang['lpn_time_statistic']='احصایه';
$ec_lang['lpn_time_stat_none']='هیڅ';
$ec_lang['lpn_time_stat_averaged']='منځنی';
$ec_lang['lpn_time_stat_minimum']='لږ ترلږه';
$ec_lang['lpn_time_stat_maximum']='زیات ترزیاته';
$ec_lang['lpn_time_stat_range']='لړه';
$ec_lang['lpn_time_no_engine_why']='دننه جوړ شوی حل کوونکی یو وخت یوازې یوه شېبه حلوي، نو دا شبکه یوازې په {time} کې ده: هر نمونه پر هغه شېبه لوستل کیږي، او هر ټانک په خپله پیل کچه پاتې کیږي پر ځای دې چې ډک او تش شي. {reason}';
$ec_lang['lpn_time_engine_fetch_failed']='د EPANET حل کوونکي ډاونلوډ ناکام شو. بیا هڅه کولو لپاره پاڼه بیا بار کړئ؛ ممکن فایروال، پراکسي، یا د براوزر توسیع یې بندوي.';
$ec_lang['lpn_time_engine_start_failed']='براوزر د EPANET حل کوونکي د پیلولو نه ډډه وکړه. ممکن WebAssembly د امنیت تنظیم یا توسیع له خوا بند شوی وي.';
$ec_lang['lpn_time_engine_run_failed']='د EPANET چلول ناکام شول. دا د دې پاڼې نیمګړتیا ده؛ د راپور ورکولو لپاره د {wrong} لینک وکاروئ.';
$ec_lang['lpn_saved_project']='د پروژې سره ساتل شوی';
$ec_lang['lpn_saved_browser']='په دې براوزر کې ساتل شوی';
$ec_lang['lpn_saved_session']='نه دی ساتل شوی';
$ec_lang['lpn_scncmp_at_time']='{value} په {id} کې، {time}';
$ec_lang['lpn_scncmp_same']='په هره سناریو کې یو شان';
$ec_lang['lpn_scncmp_period_note']='چیرته چې یوه سناریو ټول چلولو وخت لري، د هغې ټیټ ترین فشار او لوړ ترینه سرعت د ټولې شبکې انتها ده، په ښودل شوي وخت کې.';
$ec_lang['lpn_choice_default']='ډیفالټ';
$ec_lang['lpn_ds_menu']='د غوښتنې پیمانه کول…';
$ec_lang['lpn_ds_menu_tip']='د شبکې په یوه کاپي کې غوښتنې ضرب کړئ او فشارونه او سرعتونه وګورئ، یا هغه لوی ترینه د غوښتنې پیمانه ومومئ چې سیسټم یې پورته کولی شي.';
$ec_lang['lpn_ds_title']='د غوښتنې پیمانه کول';
$ec_lang['lpn_ds_intro']='د چلولو تڼۍ وټاکئ ترڅو په ټاکل شویو جنکشنونو کې غوښتنې د غوښتنې پیمانې سره ضرب کړئ او فشارونه او سرعتونه وګورئ.\n\nد موندلو تڼۍ وټاکئ ترڅو لوی ترینه د غوښتنې پیمانه ومومئ، تر نږدې {step} پورې، چیرته چې دا ټول جنکشنونه لږ ترلږه اجازه شوی ټیټ فشار ساتي؛ دا له 0 تر {max} پورې لټوي.\n\nدواړه د شبکې په کاپي کار کوي، چې په فعاله سناریو کې د سکرین پر وخت ګام حل شوې ده، نو ستاسو په پروژه کې هیڅ شی نه بدلیږي. یوازې همدا وخت ګام پیمانه کیږي، او کچې او حالتونه له هغه څخه اخیستل کیږي؛ د لوړې غوښتنې ازمایښت لپاره، مخکې له چلولو ساعت لوړې غوښتنې ته یوسئ.';
$ec_lang['lpn_ds_scope']='هغه جنکشنونه چې پیمانه کیږي';
$ec_lang['lpn_ds_scope_all']='ټول جنکشنونه';
$ec_lang['lpn_ds_scope_selected']='ټاکل شوي جنکشنونه';
$ec_lang['lpn_ds_minpressure']='اجازه شوی ټیټ ترین فشار';
$ec_lang['lpn_ds_minpressure_tip']='دا په اور بهاو شننه کې د اجازه شوي ټیټ ترین فشار په څېر همغه شمېره ده. دلته یې بدلول هلته هم یې بدلوي.';
$ec_lang['lpn_ds_head_scale']='غوښتنې پیمانه کول';
$ec_lang['lpn_ds_multiplier']='د غوښتنې پیمانه';
$ec_lang['lpn_ds_multiplier_tip']='هغه فکتور چې هره غوښتنه پرې ضرب کیږي؛ 1.5 یعنې 50٪ زیاتوالی. دا د فعالې سناریو د غوښتنې ضریب سربیره پلي کیږي، چې لا دمخه په غوښتنو کې دی، او هیڅکله په پروژه کې نه ساتل کیږي.';
$ec_lang['lpn_ds_run']='چلول';
$ec_lang['lpn_ds_head_search']='سیسټم کومه د غوښتنې پیمانه پورته کولی شي؟';
$ec_lang['lpn_ds_head_search_selected']='دا جنکشنونه کومه د غوښتنې پیمانه پورته کولی شي؟';
$ec_lang['lpn_ds_outside_below']='د {m} د غوښتنې پیمانې په وخت کې، هغه جنکشنونه چې نه دي ټاکل شوي او له {pressure} نه ټیټ دي: {n} ({ids}). دوی دا ځواب نه محدودوي.';
$ec_lang['lpn_ds_holds_max']='✓ هر جنکشن تر {max} د غوښتنې پیمانې پورې، چې د لټون سر دی، {pressure} ساتي.';
$ec_lang['lpn_ds_below_zero']='⚠ لږ تر لږه یو جنکشن له {pressure} نه ټیټ دی حتی کله چې پیمانه شوې غوښتنې صفر وي.';
$ec_lang['lpn_ds_found']='✓ هر چک شوی جنکشن تر {m} د غوښتنې پیمانې پورې لږ تر لږه {pressure} ساتي.';
$ec_lang['lpn_ds_found_below']='⚠ لږ تر لږه یو جنکشن پرته له غوښتنې پیمانه کولو له {pressure} نه ټیټ دی. هغه لوی ترینه د غوښتنې پیمانه چې هر جنکشن په {pressure} یا پورته ساتي {m} ده.';
$ec_lang['lpn_ds_search_stopped']='لټون مخکې له دې چې ځواب ومومي ودرول شو.';
$ec_lang['lpn_ds_lowest_at']='د {m} د غوښتنې پیمانې په وخت کې، ټیټ ترین فشار {pressure} دی، په جنکشن {id} کې.';
$ec_lang['lpn_ds_nosolve_at']='د {m} د غوښتنې پیمانې په وخت کې، شبکې هیڅ ځواب ونه ورکړ. {reason}';
$ec_lang['lpn_ds_scale_ok']='✓ د {m} د غوښتنې پیمانې په وخت کې، هر جنکشن {pressure} ساتي.';
$ec_lang['lpn_ds_scale_below']='⚠ د {m} د غوښتنې پیمانې په وخت کې، هغه جنکشنونه چې له {pressure} نه ټیټ دي: {n}.';
$ec_lang['lpn_ds_scaled_selected']='هغه جنکشنونه چې پیمانه او چک شوي: {n}.';
$ec_lang['lpn_ds_head_lowest']='ټیټ ترین فشارونه';
$ec_lang['lpn_ds_head_velocity']='لوړ ترین سرعتونه';
$ec_lang['lpn_ds_col_link']='تړاو';
$ec_lang['lpn_ds_col_scaled']='پیمانه شوی';
$ec_lang['lpn_ds_col_scaled_tip']='د غوښتنې پیمانې سره ضرب شوو غوښتنو سره.';
$ec_lang['lpn_ds_col_unscaled']='نه پیمانه شوی';
$ec_lang['lpn_ds_col_unscaled_tip']='د غوښتنو سره لکه څنګه چې دي په فعاله سناریو کې پدې وخت ګام کې، همغه ارزښت چې نقشه یې ښیي.';
$ec_lang['lpn_ds_no_junctions']='دا پروژه تر اوسه هیڅ جنکشن نه لري، نو د پیمانه کولو لپاره هیڅ غوښتنې نشته.';
$ec_lang['lpn_ds_no_selection']='هیڅ جنکشن نه دی ټاکل شوی. جنکشنونه وټاکئ یا ټول جنکشنونه غوره کړئ.';
$ec_lang['lpn_ds_skipped']='هغه ټاکل شوي عنصرونه چې جنکشنونه نه دي، لکه څنګه چې دي پرېښودل شوي: {n}.';
$ec_lang['lpn_ds_bad_multiplier']='د غوښتنې پیمانه صفر یا ډېره ولیکئ، لکه 1.5.';
$ec_lang['lpn_ds_stale']='انځور بدل شو، نو د غوښتنې پیمانه کولو پایلې پاکې شوې. بیا یې چلوئ.';
$ec_lang['lpn_analyze_at_time']='د وخت ګام: {time}.';
$ec_lang['lpn_analyze_time_moved']='⚠ دا په {time} کې محاسبه شوی و، او ساعت اوس په {now} کې دی. د سکرین پر وخت ګام یې بیا چلوئ.';
$ec_lang['lpn_survey_codes_toggle']='توضیح د ساحې کوډونو په توګه ولولئ';
$ec_lang['lpn_survey_codes_tip']='د هرې توضیح لومړی کلمه د جدول د کوډ په توګه ولولئ. هغه ټکي چې یو شان د کرښې کوډ لري په فایل کې په ترتیب سره په یو پایپ کې یو ځای کیږي، او WL1 او WL2 جلا کرښې دي. +0 یوه کرښه پیلوي، -0 یې پای ته رسوي، او CLO یې تړي. JPN چې وروسته یې د ټکي نوم وي هغه ټکي سره یو ځای کیږي (Carlson)، او Civil 3D یې CPN لیکي.';
$ec_lang['lpn_survey_codes_col_code']='کوډ';
$ec_lang['lpn_survey_codes_col_type']='د شتمنۍ ډول';
$ec_lang['lpn_survey_codes_add']='کوډ اضافه کول';
$ec_lang['lpn_survey_codes_remove']='کوډ لرې کول';
$ec_lang['lpn_survey_confirm_coded']='{j} جنکشن(ونه)، {r} ذخیره(ګانې)، {t} ټانک(ونه)، او {p} پایپ(ونه) وموندل شول. ته وړاندې لاړ شم؟';
$ec_lang['lpn_survey_report_coded']='{j} جنکشن(ونه)، {r} ذخیره(ګانې)، {t} ټانک(ونه)، او {p} پایپ(ونه) دننه شول، د نقطو {m} یې د لوړوالي سره.';
$ec_lang['lpn_survey_note_code_unknown']='کوډ د کوډ په جدول کې نشته، د پورته ټاکل شوي شتمنۍ ډول په توګه دننه شو.';
$ec_lang['lpn_survey_note_code_two_nodes']='تر یوه زیات د نقطې کوډونه، لومړی کارول شو.';
$ec_lang['lpn_survey_note_code_unread']='هره کلمه کوډ نه ده چې دا پاڼه یې لولي، په توضیح کې ساتل شوې.';
$ec_lang['lpn_survey_note_vertex_text']='هره کلمه کوډ نه ده چې دا پاڼه یې لولي، او یوه نقطه هیڅ توضیح نه ساتي.';
$ec_lang['lpn_survey_note_join_missing']='JPN یا CPN یو ټکی نوموي چې په دې فایل یا پروژه کې نشته، د هغه لپاره هیڅ پایپ رسم نه شو.';
$ec_lang['lpn_survey_note_join_no_line']='JPN یا CPN په یوه ټکي کې چې د کرښې کوډ نه لري، د هغه لپاره هیڅ پایپ رسم نه شو.';
$ec_lang['lpn_survey_note_pipe_one_node']='دا کرښه ورته نقطې ته بېرته راځي پرته له دې چې بله نقطه ترمنځ وي، د هغه لپاره هیڅ پایپ رسم نه شو.';
$ec_lang['lpn_survey_note_line_one_point']='په خپله کرښه کې یوازینی ټکی، له هغه هیڅ پایپ رسم نه شو.';
$ec_lang['lpn_survey_note_vertices']='هغه ټکي چې د پایپ نقطې شول: {detail}. یوه نقطه نوم، لوړوالی، یا توضیح نه ساتي.';
$ec_lang['lpn_survey_note_no_desc']='د ساحې کوډونه فعال دي، خو دې فایل د توضیح کالم نه لري، نو هیڅ کوډ ونه لوستل شو.';
$ec_lang['lpn_survey_note_ring_junction']='دا ټکی جنکشن شو ترڅو حلقه وتړل شي.';
$ec_lang['lpn_survey_note_pipe_zero_length']='دا ټکی د مخکینۍ نقطې په همدغه ځای کې دی، نو د دواړو ترمنځ پایپ اوږدوالی نه لري.';
$ec_lang['lpn_survey_note_node_on_pipe']='دا ټکی ټیک په یوه پایپ کې دی چې ورسره نه دی وصل. که دوی سره وصل دي، JPN زیات کړئ ترڅو دا ووایئ.';
$ec_lang['lpn_settings_demand_model']='د غوښتنې ماډل';
$ec_lang['lpn_settings_demand_model_tip']='وټاکئ چې جنکشنونه بهاو څنګه ترلاسه کوي. غوښتنه محور (DDA) هره غوښتنه په بشپړ ډول وړاندې کوي، د فشار په پام کې نیولو پرته. فشار محور (PDA) د غوښتنې نه لږ وړاندې کوي چیرته چې فشار له اړین فشار نه ټیټ وي، او یوازې د EPANET حل کوونکی یې محاسبه کولی شي.';
$ec_lang['lpn_settings_demand_model_dda']='غوښتنه محور';
$ec_lang['lpn_settings_demand_model_pda']='فشار محور';
$ec_lang['lpn_settings_min_pressure']='لږ ترلږه فشار';
$ec_lang['lpn_settings_min_pressure_tip']='هغه فشار ولیکئ چې په هغه یا لاندې یو جنکشن هیڅ بهاو نه ترلاسه کوي. د دې پروژې د فشار واحد وکاروئ.';
$ec_lang['lpn_settings_req_pressure']='اړین فشار';
$ec_lang['lpn_settings_req_pressure_tip']='هغه فشار ولیکئ چې په هغه یا پورته یو جنکشن خپله بشپړه غوښتنه ترلاسه کوي. دا باید له لږ ترلږه فشار نه ډېر وي. د دې پروژې د فشار واحد وکاروئ. د EPANET ډیفالټ کارولو لپاره یې خالي پرېږدئ، چې د US بهاو واحدونو لپاره په psi کې دی او نورو ته په مترو کې.';
$ec_lang['lpn_settings_pressure_exponent']='د فشار توان';
$ec_lang['lpn_settings_pressure_exponent_tip']='د هغې منحنۍ توان ولیکئ چې په لږ ترلږه فشار کې له صفر بهاو څخه په اړین فشار کې بشپړې غوښتنې ته پورته کیږي.';
$ec_lang['lpn_engine_pda_route']='د EPANET حل کوونکي سره حل شو، ځکه چې د غوښتنې ماډل فشار محور دی.';
$ec_lang['lpn_diag_pda_needs_epanet']='د غوښتنې ماډل فشار محور دی، او یوازې د EPANET حل کوونکی یې محاسبه کولی شي. د EPANET حل کوونکی نشو پورته کیدی، نو دا پایلې ورک دي.';
$ec_lang['lpn_result_delivered_demand']='وړاندې شوې غوښتنه';
$ec_lang['lpn_result_delivered_demand_tip']='هغه بهاو چې دا جنکشن د فشار محور غوښتنې ماډل لاندې په حقیقت کې ترلاسه کوي. دا له غوښتنې نه لږ دی کله چې فشار له اړین فشار نه ټیټ وي.';
$ec_lang['lpn_result_demand_deficit']='د غوښتنې کمښت';
$ec_lang['lpn_result_demand_deficit_tip']='په دې جنکشن کې هغه غوښتنه چې نه وړاندې کیږي، ځکه چې فشار له اړین فشار نه ټیټ دی.';
$ec_lang['lpn_pda_deficit_note']='هغه جنکشنونه چې له خپلې غوښتنې لږ ترلاسه کوي: {n}.';
$ec_lang['lpn_diag_pda_pressures']='اړین فشار باید له لږ ترلږه فشار نه ډېر وي. په تنظیماتو کې یو یې بدل کړئ.';
$ec_lang['lpn_inp_drop_pressure_unit']='دا فایل د فشار یو واحد بیانوي چې له هغه سره توپیر لري چې دا پاڼه یې د خپل بهاو واحد لپاره لولي، چې د US واحدونو لپاره psi دی او نورو ته متره. په فایل کې هر فشار همداسې لوستل کیږي، نو د والو ترتیبات، وریزونه، او فشار محور حدونه چې دا لري وګورئ. کرښه ساتل کیږي او بېرته لیکل کیږي.';
$ec_lang['lpn_screenshot_menu']='سکرین شاټ';
$ec_lang['lpn_screenshot_tip']='د هغې نقشې ساحې یو له سکرین نه روښانه انځور کاپي کړئ چې تاسو یې راکاږئ، چمتو دی چې په راپور کې پیسټ شي. پرته له راکاږلو کلیک وکړئ ترڅو ټوله نقشه واخلئ.';
$ec_lang['lpn_screenshot_hint']='په نقشه کې یو مستطیل راکاږئ، یا د ټولې نقشې لپاره کلیک وکړئ. Esc لغوه کوي.';
$ec_lang['lpn_screenshot_copied']='سکرین شاټ کاپي شو.';
$ec_lang['lpn_screenshot_saved']='کلپ بورډ دلته شتون نه لري، نو سکرین شاټ د PNG فایل په توګه ډاونلوډ شو.';
$ec_lang['lpn_screenshot_no_basemap']='د سړک نقشه یا سپوږمکۍ انځور شامل نه شو کیدی.';
$ec_lang['lpn_screenshot_failed']='سکرین شاټ نشو جوړیدی.';
$ec_lang['lpn_snip_hint_free']='د غوڅولو لپاره د ساحې شاوخوا راکاږئ، یا د ټولې نقشې لپاره کلیک وکړئ. Esc لغوه کوي.';
$ec_lang['lpn_snip_tip_rect']='یو مستطیل غوڅول (S)';
$ec_lang['lpn_snip_tip_free']='یو آزاد لاس بڼه غوڅول (S)';
$ec_lang['lpn_snip_tip_mode']='د غوڅولو بڼه';
$ec_lang['lpn_snip_tip_map']='د ټولې نقشې سکرین شاټ';
$ec_lang['lpn_snip_tip_pen']='قلم';
$ec_lang['lpn_snip_tip_eraser']='پاکوونکی: د لرې کولو لپاره پر یوه کرښه کلیک وکړئ (E)';
$ec_lang['lpn_snip_tip_undo']='بېرته کول (Ctrl+Z)';
$ec_lang['lpn_snip_tip_redo']='بیا کول (Ctrl+Y)';
$ec_lang['lpn_screenshot_scale_tip']='د انځور اندازه د سکرین پر ساحې د ضرب په توګه. لوی یې روښانه دی او لوی فایل جوړوي.';
