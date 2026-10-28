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
// **REWRITTEN 2026-10-08 (Tom, call F01: "Go (random code, new consent text)")**, his draft used
// exactly. The yes now also covers a random browser code (EC_CODE_COOKIE in lib/config.inc.php), so
// "a one-digit cookie" was no longer the whole of what is asked for. The code is what the sentence
// names because it is what the yes newly buys: counting browsers, not only page loads.
//
// EC_CONSENT_VERSION WENT FROM 1 TO 2 WITH IT, because what is stored changed. Everybody who chose
// "Allow this" is asked again; "Allow all" and "Refuse all" are not. The other 26 languages keep
// their old sentence until the next translation sprint, under the same version.
$ec_lang['consent_body']='ایا موږ کولی شو په دې براوزر کې یو تصادفي کوډ وساتو ترڅو وشمېرو چې څو براوزرونه د دې پاڼې هر برخه کاروي؟ دا کوډ په ځای کې جوړیږي، ستاسو یا ستاسو د وسیلې په اړه هیڅ نه وایي، او هغه څه نه ثبتوي چې تاسو یې لیکئ. پرته له دې موږ نشو کولی ستاسو دویمه کتنه د بل چا له لومړۍ کتنې نه جلا کړو.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='دا شبکه پر هر هایدرولیکي وخت پړاو حل کړئ.';
$ec_lang['consent_accept']='دا ومنئ';
$ec_lang['consent_accept_all']='تل يې ومنئ';
$ec_lang['consent_decline']='تل يې رد کړئ';
$ec_lang['consent_current_granted']='تاسو دا اجازه ورکړې ده. دا براوزر یو تصادفي کوډ ساتي ترڅو موږ یې وشمېرو.';
$ec_lang['consent_current_denied']='تاسو دا رد کړې ده. موږ د ثبت محدودولو لپاره هیڅ نه ساتو.';
$ec_lang['consent_region_label']='د شمېرنې کوډ په اړه ستاسو انتخاب.';
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
$ec_lang['points_data_points_heading']='د ټکو معلومات<br />(د بڼې لیدو لپاره کاپي وکاروئ)';
$ec_lang['points_data_copy']='کاپي';
$ec_lang['points_data_paste']='پیسټ';
$ec_lang['points_data_msg_line']='هیڅ شی نه دی پیسټ شوی. {n} کرښه د ستیشن او لوړوالي په توګه نه شوه لوستل کیدی.';
$ec_lang['points_data_msg_none']='هیڅ شی نه دی پیسټ شوی. د ستیشن او لوړوالي هیڅ جوړه ونه موندل شوه.';
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
$ec_lang['mphl_pipe_length']='اوږدوالی، L';
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
// Edited by TGH 2026-09-07
$ec_lang['mtc_n_blodgett']='د Blodgett له مخې د ډیزاین کاڼو اندازې لپاره n';
$ec_lang['mtc_n_bathurst']='د Bathurst له مخې د ډیزاین کاڼو اندازې لپاره n';
$ec_lang['mtc_n_pi']='n د ډیزاین د کاڼو له اندازې (P&I، د Phillips & Ingersoll طریقه)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett مقابل Bathurst';
$ec_lang['mtc_pi_range_check']='د P&I ساحې کتنه';
$ec_lang['mtc_pi_ok']='d50 د P&I په ساحه کې دی';
$ec_lang['mtc_pi_ok_tip']='0.28–0.36 فوټ (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_not_applicable']='د تطبیق وړ نه';
$ec_lang['mtc_pi_out_of_range']='له ساحې بهر';
$ec_lang['mtc_pi_tip']='د 0.28–0.36 فوټ د معلوماتو ساحې څخه بهر اټکل کول چې دا معادله ترې اخیستل شوې ده — دا یوازې د یوې لنډې کتنې په توګه وګڼئ، نه د ډیزاین بنسټ په توګه';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="د Isbash (1936) او Maricopa County, Arizona, US له مخې.">اړین لاندیني زاویه لرونکي کاڼو اندازه، D<sub>50</sub> (Isbash او MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="د Isbash (1936) او Maricopa County, Arizona, US له مخې.">اړین د اړخ میل ۱ زاویه لرونکي کاڼو اندازه، D<sub>50</sub> (Isbash او MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="د Isbash (1936) او Maricopa County, Arizona, US له مخې.">اړین د اړخ میل ۲ زاویه لرونکي کاڼو اندازه، D<sub>50</sub> (Isbash او MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="د Maynord, Ruff, and Abt (1989) له مخې. په یوه ګونج کې کاڼی د اوسط 4/3 د ګونج سرعت لپاره اندازه کیږي، د California Division of Highways (1970) له مخې؛ د Maynord خپل 1.5 په طبیعي چینلونو پورې اړه لري.">اړین زاویه لرونکي کاڼو اندازه، D<sub>50</sub> (Maynord, Ruff, and Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='اړین زاویه لرونکي کاڼو اندازه، D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='سرعت د یکسان بهاو فرضیو لپاره معقول دی.';
$ec_lang['mtc_vel_low']='سرعت ټیټ دی — د رسوب خطر.';
$ec_lang['mtc_vel_high']='سرعت لوړ دی او ممکن واقعي نه وي؛ د کانال د پوښ فرسایش، په ګوډونو کې اضافي ژوروالی، او په پراختیاوو یا خنډونو کې د انرژۍ ضیاع وګورئ.';
$ec_lang['mtc_iteration_tip']='د خشونت یو اختیار (Blodgett–Bathurst، یعنې B/B، وړاندیز کیږي) او د کاڼو د اندازې یو اختیار (Isbash وړاندیز کیږي) وټاکئ ترڅو ستاسو د هدف بهاو لپاره یوې یوشان کاڼو اندازې ته پخپله تکرار وشي. بشپړ طریقه په لاندې یادښتونو کې وګورئ. که تکرار نه غواړئ، خپل د خشونت ارزښت ولیکئ (د لارښوونې لپاره لینک وګورئ) او د کاڼو اندازه له پامه وغورځوئ.';
$ec_lang['mtc_note_1']='<dl><dt>د کاڼو د اندازې او خشونت د ډیزاین پخپله تکرار</dt><dd>د خشونت یو اختیار (Blodgett–Bathurst، یعنې B/B، وړاندیز کیږي) او د ډیزاین د کاڼو د اندازې یو اختیار (Isbash وړاندیز کیږي) وټاکئ. ژوروالی او د کاڼو د اندازې د خوندیتوب فکتور داسې برابر کړئ چې د یوشان کاڼو اندازې سره ستاسو هدف بهاو ترلاسه شي. هر ځل چې یو داخل بدل کړئ، محاسبه کوونکی دا ګامونه بیا تکراروي: 1. خشونت د ډیزاین د کاڼو له اندازې محاسبه کیږي. 2. ستاسو د ټاکل شوې طریقې د خشونت ارزښت د خشونت داخل ته کاپي کیږي. 3. د کانال بهاو او اړینه د کاڼو اندازه محاسبه کیږي. 4. د ډیزاین د کاڼو اندازه برابریږي. 5. دا ګامونه تکرار کیږي تر هغه چې د ډیزاین د کاڼو په اندازه کې تیروتنه ډیره کوچنۍ شي.</dd><dt>اساسي محاسبه کوونکی (بې تکراره)</dt><dd>خپل مطلوب د خشونت ارزښت ولیکئ. د ډیزاین د کاڼو د اندازې د داخل ساحه له پامه وغورځوئ.</dd></dl>';
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
$ec_lang['rc_sg_high']='sg د Robinson لړۍ نه پورته دی';
$ec_lang['rc_sg_high_tip']='سمه لړۍ: 2.54–2.82';
$ec_lang['rc_SD_ok']='SD په سمه لړۍ کې دی (1.15–1.47)';
$ec_lang['rc_SD_ok_tip']='1.15–1.47 (Robinson)';
$ec_lang['rc_SD_low']='SD د Robinson لړۍ نه لاندې دی';
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
$ec_lang['bpn_id_tip']='د دې پایپ کرښې نوم. نورې کرښې دې ته د پورتني ستون له لارې اشاره کوي.';
$ec_lang['bpn_upstream']='پورتنی ID';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='د هغې کرښې ID چې دې ته اوبه ورکوي. که خالي پریږدئ، سمدلاسه له خپلې پورتنۍ کرښې (ساده پرله‌پسې پایپ‌لاین) پیروي کوي. د بلې کرښې نه د څانګې جوړولو لپاره دلته یو ID ولیکئ.';
$ec_lang['bpn_roughness_tip']='د غوره شوې اصطکاک طریقې لپاره د پایپ خشونت: Manning n، Hazen-Williams C، یا Darcy-Weisbach د خشونت لوړوالی e (یو اوږدوالی). عادي هوار پلاستیکي پایپ: n نږدې 0.009، C نږدې 150، e نږدې 0.0015 mm.';
$ec_lang['bpn_demand']='غوښتنه';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='هغه ثابت بهاو چې د دې کرښې په ښکتني پای کې رسول کیږي.';
$ec_lang['bpn_demand_mult']='د غوښتنې ضربوونکی';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='د ټولو کرښو غوښتنه په یوځل کې مقیاس کوي، د اوج ساعت یا راتلونکې ودې د چلولو لپاره. لکه چې ننوتل شوي دي هغسې غوښتنو لپاره 1 وکاروئ.';
$ec_lang['bpn_elev_down']='ښکتنی لوړوالی';
// Edited by TGH 2026-09-07
$ec_lang['bpn_q_line']='د کرښې بهاو';
$ec_lang['bpn_q_line_tip']='هغه ټول بهاو چې دا کرښه وړي: خپله غوښتنه به‌علاوه د هرې ښکتنۍ غوښتنې چې دا تغذیه کوي.';
$ec_lang['bpn_p_down']='ښکتنی فشار';
// Edited by TGH 2026-09-07
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
// Junction and Pipe (Task 719): Tom's WaterCAD command, a junction, a pipe, a junction, a pipe, until Escape.
$ec_lang['lpn_tool_add_chain']='د جنکشن او پایپ ځنځیر';
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
// The Shape table (Task 779). Closed is a polygon's closure, not a pipe's or valve's status, so it
// is a key of its own and not lpn_field_closed: many languages use different words for the two.
// Points is the column of the Shape's points, "Shape S1, point 2" in lpn_snap_shape_point.
$ec_lang['lpn_pane_tab_shapes']='شکلونه';
$ec_lang['lpn_pane_shape_closed']='بند';
$ec_lang['lpn_pane_shape_points']='ټکي';
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
$ec_lang['lpn_node_customers_sum']='{total} {unit} د مشتریانو ({n}) نه';
$ec_lang['lpn_customer_detached']='⚠ دا مشتری هیڅ پایپ سره نښلول شوی نه دی، نو د هغه غوښتنه پایلو کې نشته. یې ړنګ کړئ، یا یو پایپ راکاږئ او مشتری پرې ولیږئ.';
$ec_lang['lpn_customer_fixed_head']='⚠ د دې پایپ نږدې سر یو ثابت د اوبو سطح لري، نو دا غوښتنه پر سمولېشن اغیزه نه کوي.';
$ec_lang['lpn_customer_node_inactive']='دا مشتری یوه داسې جنکشن ته ټاکل شوی چې په دې سناریو کې غیرفعال دی، نو د هغه غوښتنه د حل برخه نه ده.';
$ec_lang['lpn_customer_detached_count']='مشتریان چې پایپ سره نه دي نښلول شوي ({n}). د دوی غوښتنه نه ده شمېرل شوې.';
$ec_lang['lpn_meter_pick_pipe']='اوس هغه پایپ یا نقطه وټاکئ چې دا مشتری خدمتوي. مشتری هلته پاتې کیږي چیرته چې تاسو یې ایښی دی. د لغوه کولو لپاره Escape ووهئ.';
$ec_lang['lpn_inp_export_flat_customers']='د EPANET فایل مشتریان نه لري. په دې پروژه کې د مشتریانو ({n}) غوښتنه د غوښتنې قطار په توګه په هغه جنکشن کې لیکل کیږي چې هر مشتری ورته ټاکل شوی، د مشتري په ټاګ نومول شوی. فایل پخپله مشتری نه ثبتوي: د هغه ځای، هغه پایپ چې خدمت ورکوي، د هغه پایپ په اوږدو کې چیرته چې خدمت نښلي، یا څو خدمتونه استازیتوب کوي. دا معلومات په پروژه کې پاتې کیږي؛ د ساتلو لپاره د پروژې فایل وساتئ.';

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
$ec_lang['lpn_pane_pasted']='پیسټ شوې حجرې ({n}). نه بدلې شوې حجرې ({skipped}).';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='پیسټ شوي قطارونه ({n}). شبکې ته اضافه شوي قطارونه ({created}).';
$ec_lang['lpn_pane_pasted_rows_skipped']='پیسټ شوي قطارونه ({n}). شبکې ته اضافه شوي قطارونه ({created}). نه بدلې شوې حجرې ({skipped}).';
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
$ec_lang['lpn_pane_paste_overflow']='په دې پیسټ کې قطارونه ({n}). هغه قطارونه چې جدول کې ځای کیږي ({fit}). نور قطارونه ({extra}) د نویو قطارونو په توګه لاندې اضافه کړم؟';
$ec_lang['lpn_pane_paste_overflow_add']='قطارونه اضافه کړئ ({extra})';
$ec_lang['lpn_pane_paste_overflow_fit']='یوازې هغه قطارونه پیسټ کړئ چې ځای کیږي ({fit})';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='په دې پیسټ کې قطارونه ({n}). هغه قطارونه چې جدول کې ځای کیږي ({fit}). نور قطارونه ({extra}) د نویو قطارونو په توګه نشي اضافه کیدی: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='IDs چې سمون نه خوري ({n}). بیا هم پیسټ کړم؟';
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
$ec_lang['lpn_pane_paste_shape_no_points']='{row} قطار: نوي شکل ته خپل ټکي اړین دي.';
// {pair} is the Points heading's own pair in this project's axis words: X/Y, N/E or Lat/Lon.
$ec_lang['lpn_pane_paste_shape_bad_points']='{row} قطار: {text} د ټکو لیست نه دی. هر ټکی د {pair} په بڼه ولیکئ، د اعشاري نښې لپاره ټکی (.) وکاروئ، او ټکي په | سره سره بېل کړئ.';
$ec_lang['lpn_pane_paste_shape_closed_few']='{row} قطار: بند شکل لږ تر لږه درې ټکي غواړي.';
$ec_lang['lpn_pane_paste_no_customer_ref']='قطار {row}: یو نوي مشتري ته یو نښلول شوی پایپ یا نقطه اړینه ده.';
$ec_lang['lpn_pane_paste_no_pipe']='قطار {row}: پایپ {id} تر اوسه شتون نلري. لومړی خپل پایپونه پیسټ کړئ، بیا خپل مشتریان.';
$ec_lang['lpn_pane_paste_no_customer_node']='قطار {row}: نقطه {id} تر اوسه شتون نلري. لومړی خپل جنکشنونه پیسټ کړئ، بیا خپل مشتریان.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='قطار {row}: نقطه {id} هیڅ پایپ نلري چې مشتری پرې ونښلول شي.';
$ec_lang['lpn_pane_filled']='ښکته ډکې شوې حجرې ({n}). نه بدلې شوې حجرې ({skipped}).';
$ec_lang['lpn_pane_filldown']='ښکته ډکول';
$ec_lang['lpn_pane_delete_element']='عنصر ړنګول';
$ec_lang['lpn_pane_delete_elements']='عنصرونه ړنګول';
$ec_lang['lpn_pane_fill_none']='پدې ټاکنه کې هیڅ شی نشي ښکته ډکیدی.';
$ec_lang['lpn_pane_ctrlenter_filled']='ډکې شوې حجرې ({n}). نه بدلې شوې حجرې ({skipped}).';
$ec_lang['lpn_pane_hide_col']='دا کالم پټ کړئ';
$ec_lang['lpn_pane_hide_cols']='دا کالمونه پټ کړئ';
$ec_lang['lpn_pane_show_all_cols']='ټول کالمونه ښکاره کړئ';
$ec_lang['lpn_pane_sort_asc']='لوړېدونکی ترتیب';
$ec_lang['lpn_pane_sort_desc']='ښکته کیدونکی ترتیب';
$ec_lang['lpn_pane_manage_cols']='کالمونه اداره کول…';
$ec_lang['lpn_pane_manage_cols_title']='کالمونه اداره کول';
$ec_lang['lpn_pane_manage_cols_show']='ښودل';
$ec_lang['lpn_pane_manage_cols_up']='پورته یوسئ';
$ec_lang['lpn_pane_manage_cols_down']='ښکته یوسئ';
$ec_lang['lpn_pane_manage_cols_top']='پیل ته یوسئ';
$ec_lang['lpn_pane_manage_cols_bottom']='پای ته یوسئ';
$ec_lang['lpn_pane_manage_cols_width']='پلنوالی (em)';
$ec_lang['lpn_pane_width_tip']='د کالمونو پلنوالی په دې براوزر کې ساتل کیږي، نه په پروژه کې. د اصلي پلنوالي بېرته راوستلو لپاره د کالم پر جلا کوونکي دوه ځله کلیک وکړئ.';
$ec_lang['lpn_pane_colmenu_tip']='کالمونه پټ یا اداره کړئ';
$ec_lang['lpn_tool_area_window']='یوه کړکۍ وټاکئ';
$ec_lang['lpn_tool_area_lasso']='یو لاسو وټاکئ';
$ec_lang['lpn_tool_area_polygon']='یو څو ضلعی وټاکئ';
$ec_lang['lpn_tool_delete']='ړنګول';
$ec_lang['lpn_tool_zoom_extent']='بشپړ نندارې ته زوم';
$ec_lang['lpn_tool_zoom_selection']='ټاکل شویو ته زوم';
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
// It's a technical term. We can only give a definition, which is not our job."). A plain sentence
// (dev/plain-sentences.md, then $ec_lang_syn) holds phrases that could STAND ON THE CONTROL in place of the label; a technical term has no such
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
// protocol, a visible tip is the preferred home for a definition, in place of a plain-sentence
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
// A tank has two elevations (Tom, 2026-10-11): Elevation is the ground, the pressure datum as at a
// junction; Base elevation is the tank bottom, EPANET's [TANKS] Elevation, from which depth and
// volume are measured.
$ec_lang['lpn_field_tank_base_elev']='د تل لوړوالی';
$ec_lang['lpn_field_tank_base_elev_tip']='د ټانک د تل لوړوالی، چې له هغه نه د اوبو ژوروالی او حجم اندازه کیږي. که خالي پریښودل شي، تل د ځمکې په لوړوالي کې دی.';
$ec_lang['lpn_tank_ground_elev_tip']='د ټانک په ځای کې د ځمکې لوړوالی. د ټانک فشار له همدې ځایه اندازه کیږي، لکه په جنکشن کې.';
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
$ec_lang['lpn_tank_head_tip']='په ټانک کې د اوبو د سطحې لوړوالی: د تل لوړوالی او د اوبو ژوروالی سره یوځای.';
$ec_lang['lpn_close']='بندول';
// The corner buttons beside every standing box's X (Task 441). Each is an icon-only button, so the
// value is its name: the hover tip and the screen reader's label at once. Auto-hide is a toggle and
// says its state through aria-pressed, so one wording serves both states (AutoCAD's own word).
$ec_lang['lpn_dock_left']='د نقشې په کیڼ لور کې ځای پر ځای کول';
$ec_lang['lpn_dock_right']='د نقشې په ښي لور کې ځای پر ځای کول';
$ec_lang['lpn_dock_float']='تیرېدونکی';
$ec_lang['lpn_dock_autohide']='پخپله پټول';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='ځانتیاوې';
// What a docked Properties box says while nothing is selected: it stays in its dock (Tom, 2026-10-07).
$ec_lang['lpn_popup_none']='هیڅ شی نه دی ټاکل شوی. د ځانتیاوو لیدلو لپاره په نقشه کې یوه شتمني وټاکئ.';
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
// The SAME exit, worded for the other way in, is lpn_close (Task 699 merged its own 'Close' key
// into it). Opened from File the user already has work on screen, so "start with a blank map"
// reads as "discard it" and they do not dare press the only button that leaves (Tom, 2026-08-17:
// "I can't back out of the gallery... I am forced to open an example"). Closing never touches a
// project either way.
$ec_lang['lpn_examples_size']='نقطې: {nodes}، تړاوونه: {links}';
$ec_lang['lpn_examples_failed']='بېلګې نشوې پورته کیدی. فایل، نوی پروژه وکاروئ ترڅو یو رسم پیل کړئ.';
$ec_lang['lpn_examples_loading']='بېلګې پورته کیږي…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='یو شی سم کړئ';
$ec_lang['lpn_help_notes']='د دې پاڼې یادښتونه';
$ec_lang['lpn_guide_about_heading']='د دې محاسبې په اړه';
$ec_lang['lpn_guide_group_from']='له {menu} څخه';
$ec_lang['lpn_guide_menu_named']='{menu} مینو';
// **THE NEW BOX, TASK 745** (Tom, 2026-09-29: reorganize Help into three groups, with a new
// "Tables and Hotkeys" box gathering all table help and all keyboard shortcuts). One key names
// both the Help row and the box's own title bar, the same pattern lpn_help_notes already carries
// for the Notes box.
$ec_lang['lpn_help_hotkeys']='جدولونه او ګړندي کلیدونه';
// **THE USER GUIDE** (Tom, 2026-10-06: "Maybe items 2 and 3 combined into a simple User Manual or
// whatever the 2026 thing is?"; Ida's design). Names both the Help row and the box's title bar. It
// replaces lpn_help_hotkeys and the Help > Toolbar fly-out (lpn_help_icons, which still heads the
// box's Toolbar section).
$ec_lang['lpn_help_manual']='لارښود';
// The Guide's contents rail, its search, its Boxes section and the "?" in every box's title bar.
$ec_lang['lpn_guide_contents']='منځپانګه';
$ec_lang['lpn_guide_rail_hide']='منځپانګه پټول';
$ec_lang['lpn_guide_rail_show']='منځپانګه ښودل';
$ec_lang['lpn_guide_search']='په لارښود کې لټون';
$ec_lang['lpn_guide_boxes_heading']='بکسونه';
$ec_lang['lpn_guide_boxes_intro']='هر بکس خوځول کیدی شي، اندازه یې بدلیدی شي، د نقشې په کیڼ یا ښي لوري کې ځای پر ځای کیدی شي، یا تړل کیدی شي. د بکس د سرلیک په پټه کې ? د هغه مرسته پرانیزي.';
// Tom's own wording, 2026-10-07 (his typo "to not" corrected). Below lpn_guide_boxes_intro.
$ec_lang['lpn_guide_boxes_autohide']='کله چې پوینټر لیرې شي، هغه بکس چې فوکس نلري د لنډې ځنډ وروسته پټیږي. هغه بکس چې فوکس لري هغه وخت پټیږي چې بهر کلیک وکړئ، Esc ووهئ، یا پوینټر بل چیرته وي او له بکس نه Tab سره ووځئ.';
$ec_lang['lpn_guide_box_help']='د دې بکس مرسته';
// A Boxes entry whose box shares its name with a section of the Guide ("Screenshot"), in the Guide
// only, so its Contents list does not show one word twice. Keep {box} as it is.
$ec_lang['lpn_guide_box_named']='{box} بکس';
// Above the Toolbar rows, shown only while some are dimmed (on a phone, or Calculate while
// Recalculate automatically is on): a grey name otherwise reads as a disabled button.
$ec_lang['lpn_guide_dimmed']='یو تیاره نوم هغه تڼۍ ده چې اوس مهال د ټول‌بار پر مخ پټه ده.';
// One entry in the Guide's Boxes section for each box, shown by the "?" in its title bar. Fire flow,
// Critical assets, and Demand scaling carry theirs in lpn_ff_intro and the keys that follow it.
$ec_lang['lpn_guide_text_popup']='د ټاکل شوې شتمنۍ، متن، یا مشتری، یا د څو ټاکل شویو شتمنیو ځانتیاوې ښیي. بکس د ټاکنې تر څنګ یا هلته پرانیستل کیږي چې وروستی ځل خوځول شوی و. سمون شوی ارزښت شبکه سمدستي بدلوي، او د شتمنۍ د نقشې لیبل او د جدولونو برخه تازه کیږي. محاسبه شوې پایلې د یوازې لوستلو قطارونو په توګه ښودل کیږي او سمون نشي کیدی.';
$ec_lang['lpn_guide_text_find_popup']='هغه شتمنۍ پیدا کوي چې یو شرط پوره کوي، لکه هر پایپ چې له 8 in څخه کوچنی وي یا هر جنکشن چې له 40 psi څخه ښکته وي، او په یوه عملیه کې پر ټولو یو ملکیت بدلولی شي. دا وکاروئ ترڅو مخکې له حل کولو ماډل وڅېړئ (ورکه لوړوالی، په غلط واحد کې ننوتی قطر)، حل کولو وروسته د ستونزمنو ځایونو لیست جوړ کړئ (ټیټ فشار، لوړ سرعت)، او پر ډیرو شتمنیو یو سمون وکړئ.\n\n«څه ولټول شي»، «ملکیت»، «شرط»، او «ارزښت» لیستونه یو شرط جوړوي او د «پوښتنه» په بکس کې د متن کرښې په توګه یې لیکي. کرښه په مستقیم ډول هم سمیدی شي، او لیستونه ورپسې بدلیږي. هغه پوښتنه چې لیستونه یې نشي بیانولی، لکه دوه شرطونه چې په «يا» سره نښلول شوي وي، لیستونه پټوي تر هغه چې «پرځای یې کنترولونه وکاروئ» تڼۍ فشار شي. د لټون لپاره، د «پوښتنه» په بکس کې Enter ووهئ یا «لټون» تڼۍ فشار کړئ.';
$ec_lang['lpn_guide_text_settings_box']='د پرانیستې پروژې او دې براوزر تنظیمات په برخو کې ترتیب شوي لري. د پرانیستلو لپاره اوبه، تنظیمات غوره کړئ. دوه تڼۍ، ډیفالټونه بیرته راوستل او نوی پیل، تنظیمات بیرته ټاکي. بکس د لټون وړ دی: په تنظیمات لټول کې یوه یا څو کلمې ولیکئ ترڅو یوازې هغه تنظیمات لیست شي چې ټولې کلمې یې لري. د دې بکس ځای او اندازه یوازې په دې براوزر کې ساتل کیږي.';
$ec_lang['lpn_guide_text_library_box']='د پروژې نمونې، منحنۍ، د پایپ ډولونه، د فیتینګونو لیستونه، کنټرولونه، او قواعد لري، هر یو په جلا برخه کې. د پرانیستلو لپاره اوبه، کتابتونونه غوره کړئ. شتمني د نمونې، منحنۍ، د پایپ ډول، یا د فیتینګونو لیست ته د هغه توکي د ID په واسطه اشاره کوي، او توکی دلته جوړیږي، سمون کیږي، او ړنګیږي. ټول له پروژې سره ساتل کیږي، او بېرته دلته شوی سمون بېرته راګرځوي. د بکس ځای او اندازه یوازې په دې براوزر کې ساتل کیږي.';
$ec_lang['lpn_guide_text_energy_box']='د وروستي اوږد مهاله سمولېشن په اوږدو کې د هر پمپ د انرژۍ مصرف، لوړ ځواک، او لګښت راپور ورکوي، د هر پمپ اغیزناکتیا او د «تنظیمات»، «انرژي» لاندې ټاکل شوې د انرژۍ بیه کاروي. په «تنظیمات» کې «ټول د چلولو موده» او حل شوې شبکې ته اړتیا لري. شبکه نه بدلوي.';
$ec_lang['lpn_guide_text_contour_box']='هغه کونتور پلاټ کنټرولوي چې په نقشه کې د «نقطې د دې له مخې رنګه کول» کې ټاکل شوي نقطې ارزښت څخه رسمیږي: د رنګ ترتیب، ډکول او د هغه شفافیت، د کونتور کرښې وقفه او لیبلونه، او دا چې رنګ له هر پایپ څخه څومره لرې رسیږي. بندول یې پلاټ پټوي او د نقطو رنګونه پریږدي. یوازې ښودنه بدلوي، شبکه نه.';
$ec_lang['lpn_guide_text_scncmp_box']='هر هغه سناریو چې په سناریو: مدیر کې ټاکل شوې وي حلوي، ټولې، تر څو چې نښې پاکې شوې نه وي، د انځور له یوې کاپي څخه، او د هرې لپاره د ځانګړو ارزښتونو شمېر، د غوښتنې ضریب، ټول د چلولو وخت، د هایدرولیکي وخت ګام، ټیټ ترین فشار، او لوړ ترین سرعت جدول کوي. د پرانیستلو لپاره اوبه، راپورونه، سناریو: پرتله غوره کړئ. پرتله کول د بکس د پرانیستلو پر مهال پیلیږي، او کله چې بکس پرانیستی وي د هر سمون وروسته بیا پیلیږي.\n\nپروژه نه بدلوي، او هغه سناریو چې پرانیستې ده هماغسې پاتې کیږي لکه چې وه.';
$ec_lang['lpn_guide_text_rptbox']='د وروستي اوږد مهاله سمولېشن لپاره د EPANET انجن لخوا لیکل شوی متني راپور ښیي، د خبرداریو او د شبکې لنډیز په ګډون. هر اوږد مهاله سمولېشن یې بدلوي؛ په یو وخت کې حل یې نه بدلوي، او سمون پخوانی راپور پرېږدي.';
$ec_lang['lpn_guide_text_status_box']='د وروستي اوږد مهاله سمولېشن په اوږدو کې هر بدلون د وخت په ترتیب لیست کوي: د پمپ، والو، یا پایپ خلاصیدل یا تړل کیدل، د ټانک ډکیدل یا تشیدل پیلول یا ډک یا تش کیدل، او هر وخت ګام چې په بشپړه توګه نه و یو ځای شوی. یوازې بدلونونه لیست کیږي، هر وخت ګام نه.';
$ec_lang['lpn_guide_text_full_box']='هر نقطه او هر تړاو په هر راپور وخت ګام کې، د جدولونو په برخه کې ښودل شویو واحدونو سره لیست کوي. پرته د اوږد مهاله سمولېشن څخه، اوسنی حل په یوه شېبه کې ښیي. ډاونلوډ یا چاپ هر وخت ګام لري، او جدول یو په یو ښیي.';
$ec_lang['lpn_guide_text_calib_box']='د ساحې د اندازه کولو فایل د همدې ځایونو او وختونو محاسبه شویو پایلو سره پرتله کوي، د هر پیرامیټر لپاره یو فایل. فایل یوازې د اوسنۍ ناستې لپاره ساتل کیږي او له پروژې سره نه ساتل کیږي.';
$ec_lang['lpn_guide_text_hotkeys_popup']='د کاروونکي لارښود. برخې یې دا دي: د کاروونکي لارښود کارول، اوزارپټه، مینوګانې، نقشه، سکرین شاټ، جدولونه، بکسونه، د دې محاسبه کوونکي په اړه، او د دې پاڼې یادښتونه. اوزارپټه او مینوګانې د اوزارپټې هره تڼۍ او د مینو هر قطار د کیبورډ د شارټکټ سره لیست کوي، بکسونه د هر بکس لپاره یوه ننوتنه لري، او نورې برخې وایي چې پاڼه څه کوي. یو قطار غوره کول ښیي چې دا کنټرول چیرته دی؛ هیڅکله یې نه چلوي. د لټون لپاره Ctrl+K ووهئ، یا کله چې د کاروونکي لارښود فوکس لري / ووهئ. Ctrl+K هغه مهال لټون نه کوي چې پوښتنه پرانیستې وي.';
// The Find and replace chapter beyond its opening paragraphs, in the Guide's Boxes section
// (Tom, 2026-10-07). Each _def is HTML: keep the tags. A query inside <code> runs as written in
// English on a page in any language; translate it with the words the Find box shows in your
// language, or leave it in English. Asset IDs (60, 247, 330) and the numbers are measured on Net1
// and Net3 by dev/lpn-spike/user-guide-find-harness.js: never change them in translation.
$ec_lang['lpn_guide_find_query_term']='د پوښتنې ژبه';
$ec_lang['lpn_guide_find_query_def']='<table class="lpn-notes-table"><tbody><tr><td><code>Scope.Property condition value</code></td><td>یو شرط. «څه ولټول شي» هرڅه، جنکشن، ذخیره، ټانک، پایپ، پمپ، والو، متن، مشتری، یا سرچینه ده. ملکیت د هغه «څه ولټول شي» لپاره د «ملکیت» په لیست کې هره ننوتنه ده.</td></tr><tr><td>شرطونه</td><td>مساوي دی له، زیات له، کم له، لري، n لوړ ترین، n ټیټ ترین، او خالي. «لري» یوازې پر متن پلی کیږي. په n لوړ ترین او n ټیټ ترین کې، n یو شمېر دی، لکه 5 لوړ ترین. که د «ارزښت» بکس خالي وي یا n پخپله د n توری وي، لکه <code>Pipe.Velocity n highest</code>، نو 10 شتمنۍ لیست کیږي. «خالي» هغه شتمنۍ پیدا کوي چې د ملکیت لپاره ارزښت نلري. «نښلون» څلور شرطونه لري او ارزښت نه اخلي.</td></tr><tr><td>ارزښتونه</td><td>شمېره د خپل واحد پرته داخلیږي، په هغه واحد کې چې په «ځانتیاوې» او د «جدولونو» په برخه کې ښودل شوی: 40، نه 40 psi. متن، د ID په ګډون، په یو یا دوه ویناوو کې ګرځول کیږي: <code>\'60\'</code>.</td></tr><tr><td>او، يا، او قوسونه</td><td>«او» د «يا» نه مخکې ارزول کیږي، او قوسونه شرطونه ګروپ کوي. NOT شتون نلري.</td></tr><tr><td>املا</td><td>کلمې د لویو او کوچنیو توریو پر مخ حساسې نه دي. انګلیسي کلمې په هره ژبه کې منل کیږي، نو له دې لارښود نه کاپي شوې پوښتنه په هره ژبه پاڼه کې چلیږي.</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_examples_term']='په Net3 کې بېلګې';
$ec_lang['lpn_guide_find_examples_def']='<p>د تعقیب لپاره د Net3 بېلګه پرانیزئ. فشار په psi او سرعت په ft/s دی.</p><table class="lpn-notes-table"><tbody><tr><td><code>Everything.ID equal to \'60\'</code></td><td>جنکشن 60 او پایپ 60. جنکشن او پایپ کولی شي ورته ID ولري، نو د «هرڅه» لاندې د ID لټون کیدی شي له یوې شتمنۍ ډیرې بیرته راولي.</td></tr><tr><td><code>Junction.Pressure below 40</code></td><td>جنکشنونه 10، 40، 50، 20، او 153، لومړی ټیټ فشار. جنکشن 10 په -0.6 psi کې دی، منفي فشار چې بیاکتنې ته اړتیا لري.</td></tr><tr><td><code>Pipe.Velocity 5 highest</code></td><td>پایپونه 60، 125، 329، 123، او 149، لومړی لوړ سرعت. پایپ 60 9.3 ft/s وړي.</td></tr><tr><td><code>Junction.Pressure below 20 OR Pipe.Velocity above 5</code></td><td>جنکشنونه 10، 20، 40، او 50، او پایپونه 60، 125، او 329: ټیټ فشارونه او لوړ سرعتونه په یوه لیست کې.</td></tr><tr><td><code>Junction.Pressure below 40 AND Junction.Elevation above 100</code></td><td>جنکشنونه 10، 20، 40، او 50، په لوړه ځمکه کې ټیټ فشارونه. دواړه شرطونه باید د یوې ډول شتمنۍ نوم واخلي: <code>Junction.Pressure below 40 AND Pipe.Velocity above 3</code> هیڅ نه مومي، ځکه چې هیڅ شتمني جنکشن او پایپ دواړه نه ده.</td></tr><tr><td><code>Pipe.Closed equal to \'closed\'</code></td><td>پایپ 330، یوازینی پایپ چې د Net3 فایل کې تړلی دی.</td></tr><tr><td><code>Junction.Connectivity no open path to a source</code></td><td>هیڅ نه، لکه څنګه چې فایل ویشل شوی. کله چې پایپ 247 تړلی وي («ځای پرځای کول او بېرته» وګورئ)، جنکشنونه 215، 217، 219، او 225: هغه جنکشنونه چې د پایپ 247 مات کیدل به یې پرته له اوبو پریږدي. دا د هر پایپ لپاره تکرارول د مهمیت تحلیل دی.</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_results_term']='پایلې، ټاکنه، او جدولونه';
$ec_lang['lpn_guide_find_results_def']='<p>مطابقې شتمنۍ د «لټون» تڼۍ لاندې لیست شوې دي. «زیات له» او n لوړ ترین لومړی لوړ ارزښت، «کم له» او n ټیټ ترین لومړی ټیټ ارزښت لیست کوي، او نور شرطونه د موندل شوي ارزښت له مخې، بیا د ID له مخې لیست کیږي. هغه پوښتنه چې «او» یا «يا» لري، نقطې لیست کوي، بیا تړاوونه، هر یو د ID له مخې. یوازینی مطابقت سمدستي په نقشه کې ښودل کیږي. یو قطار وټاکئ ترڅو نقشه پر هغې شتمنۍ مرکز شي. که هیڅ نه وي ټاکل شوي، شتمني هم ټاکل کیږي؛ که څه شی ټاکل شوی وي، شتمني روښانه کیږي او ټاکنه نه بدلیږي. Shift+کلیک یا Ctrl+کلیک پر قطار ترڅو ټاکنې ته اضافه یا ترې لرې شي. «لټون» پخپله ټول مطابقتونه نه ټاکي.</p><p>«په اوسني جدول کې فلټر» تڼۍ ورته پوښتنه د «جدولونو» برخې ته پلي کوي. هر جدول چې پوښتنه پرې پلی کیږي یوازې مطابقې قطارې ښیي، د پوښتنې او د قطارونو شمېر سره د هغو پورته. د نقشې پر ټولو مطابقتونو ټاکلو لپاره، دا قطارې وټاکئ او د ښي کلیک له مینو څخه «پر نقشه ټاکل» غوره کړئ. د جدول فلټر له پروژې سره نه ساتل کیږي او کله چې پاڼه بیا بار شي پای ته رسیږي. قطار چې سمون شي ترڅو نور مطابقت ونلري، په جدول کې پاتې کیږي، تیاره او د خبرداری نښې سره نښه شوی، تر هغه چې «په اوسني جدول کې فلټر» تڼۍ بیا فشار شي.</p>';
$ec_lang['lpn_guide_find_replace_term']='ځای پر ځای کول او بېرته';
$ec_lang['lpn_guide_find_replace_def']='<p>د «هغه څه بدل کړئ چې وموندل شول» برخه هرې شتمنۍ ته چې پوښتنې وموندله یو ملکیت لیکي. د «هغه ځانګړتیا چې بدلیږي» په لیست کې ملکیت غوره کړئ، نوی ارزښت د «نوی ارزښت» په بکس کې په ښودل شوي واحد کې ولیکئ، او «ځای پرځای کول» تڼۍ فشار کړئ. بکس بیا ښیي چې څومره شتمنۍ به بدلې شي، هغه نه شمېري چې دمخه نوی ارزښت لري. بدلون پلي کولو لپاره «دوی بدل کړئ» تڼۍ فشار کړئ، یا «لغوه کول». یو «بېرته» ټوله ځای پرځای کول بېرته کوي.</p><p>په Net1 کې بېلګه: <code>Pipe.Diameter below 10</code> پایپونه 31، 122، 113، او 121 مومي. «قطر» غوره کړئ، 10 ولیکئ، او «ځای پرځای کول» فشار کړئ؛ بکس "4 شتمنۍ بدلې شي؟" ښیي. «دوی بدل کړئ» فشار کړئ ترڅو هر څلور پایپونه په 10 in وټاکل شي. یو «بېرته» یې 6 او 8 in ته راګرځوي.</p><p>په Net3 کې بېلګه: <code>Pipe.ID equal to \'247\'</code> پایپ 247 مومي. «بند» غوره کړئ، په «نوی ارزښت» لیست کې بیا «بند» غوره کړئ، او «ځای پرځای کول»، بیا «دوی بدل کړئ» فشار کړئ، ترڅو پایپ د پورتنۍ نښلون بېلګې لپاره وتړل شي. «بېرته» یې بیا خلاصوي.</p><p>«ځای پرځای کول» یو ډول شتمني غواړي، نو د «هرڅه» لاندې، لومړی د «څه ولټول شي» په لیست کې د شتمنۍ ډول غوره کړئ. په هغې سناریو کې چې اساس نه وي، ځای پرځای کول په هغې سناریو کې ساتل کیږي، لکه د «ځانتیاوې» کې ورته سمون. چیرته چې د Mapbox لوړوالی شتون لري، «لوړوالی» د ټایپ شوي ارزښت پر ځای د Mapbox DEM څخه ځای پرځای کیدی شي.</p>';
$ec_lang['lpn_guide_find_notes_def']='<ul><li>ارزښتونه په بشپړ دقت پرتله کیږي او تر څلورو اعشاریو پورې لیست کیږي. «مساوي دی له» په ندرت سره د محاسبه شوې پایلې سره مطابقت کوي؛ «زیات له» او «کم له» وکاروئ.</li><li>فشار، هیډ، بهاو، سرعت، او نورې پایلې د وروستۍ محاسبې دي. کله چې «پخپله بیا محاسبه کول» ټاکنه پاکه وي، دوی شبکه داسې بیانوي لکه څنګه چې د وروستي «محاسبه کول» پر مهال وه.</li><li>پر متن «زیات له» او «کم له» د قاموس ترتیب کاروي، شمېرې د شمېري ترتیب سره: په Net1 کې، <code>Junction.ID above \'20\'</code> جنکشنونه 21، 22، 23، 31، او 32 مومي.</li><li>د «هرڅه» لاندې، یوازې ID، تشریح، ټاګ، او نښلون وړاندې کیږي. د شتمنۍ د ډول د ټولو ملکیتونو لیست لیدلو لپاره د «څه ولټول شي» په لیست کې یو ډول غوره کړئ.</li><li>د متن توکی ID نلري. په خپلو کلمو یې ولټوئ، لکه <code>Text.Text contains \'pump\'</code>.</li><li>د نقطې لپاره د «نښلون» څلور شرطونه دي: په نقطه کې هیڅ تړاو نشته، په نقطه کې هیڅ خلاص تړاو نشته، سرچینې ته د تړاو هیڅ لاره نشته، او سرچینې ته هیڅ خلاصه لاره نشته. سرچینه ذخیره یا ټانک دی.</li></ul>';
// The Scenarios chapter, in the entry for the Scenario manager box (Task 785). Written from the code of
// feat/bentley-interop and held by dev/lpn-spike/user-guide-scenarios-harness.js. The box's own help
// (lpn_sm_help, Tom's wording of 2026-10-16) comes first in the entry; nothing here restates or
// contradicts it. Terms follow the Find and replace chapter's pattern.
$ec_lang['lpn_guide_scn_use_term']='سناریو د څه لپاره ده';
$ec_lang['lpn_guide_scn_use_def']='<p>سناریوګانې په یوې پروژې کې ډیری ډیزاینونه، لیدونه، یا حالتونه ساتي، لکه منځنۍ ورځ، لوړ ترین ورځ، د ډیر مصرف ساعت، د راپور د وړاندې کولو انځور، د خدمت نه وتلی اصلي نل، یا وړاندیز شوی بدلون. شبکه یو ځل په اساسي سناریو کې رسم کیږي. هره بله سناریو یوازې خپل ځانګړي ارزښتونه لري، هغه ارزښتونه چې د میراث اخیستل شوې سناریو سره توپیر لري، او نور هر څه له هغې سناریو لولي. نو په اساس کې سمون هرې هغې سناریو ته رسیږي چې دا ارزښت یې نه دی بدل کړی.</p><p>نوې پروژه په شپږ تیارو سناریوګانو پیلیږي: 1. د بهاو ازموینه: ثابت، 2. د بهاو ازموینه: منځنی، 3. د بهاو ازموینه: اعظمي، 4. منځنۍ ورځ، 5. اعظمي ورځ، او 6. د لوړې تقاضا ساعت. دا عادي سناریوګانې دي چې نوم یې بدلیدی، سمون کیدی، او ړنګیدی شي. هره یو ځانګړی ارزښت لري، د غوښتنې ضریب: د بهاو ازموینو او منځنۍ ورځ لپاره 1، د اعظمي ورځ لپاره 2، او د لوړې تقاضا ساعت لپاره 3. ضریبونه ځای ناستي دي چې باید د هغه سیسټم ارزښتونو سره بدل شي چې ماډل کیږي. هغه پروژه چې له فایل نه پرانیستل کیږي، هر بېلګه پکې، یا له EPANET فایل نه دننه شوې، یوازې اساس لري.</p><p>د اور بهاو د اور بهاو: شننه بکس سره ازمویل کیږي، چې هر جنکشن یا ټاکل شوي جنکشنونه ازمويي. اعظمي ورځ هغه سناریو ده چې معمولاً د چلولو پر مهال پرانیستې وي.</p>';
$ec_lang['lpn_guide_scn_open_term']='پرانیستې سناریو';
$ec_lang['lpn_guide_scn_open_def']='<p>د نقشې لاندې د حالت په کرښه کې سناریو تڼۍ پرانیستې سناریو نومیږي او د هغې ځانګړي ارزښتونه شمیري، لکه سناریو: اساس | د ځانګړو ارزښتونو شمېر: 0. په هغې کلیک وکړئ، یا اوبه، سناریوګانې غوره کړئ، ترڅو سناریوګانې بدلې کړئ یا یوه اضافه، کاپي، نوم بدل، یا ړنګه کړئ. په لیست کې هره سناریو د خپلو ځانګړو ارزښتونو شمېر په قوسونو کې ښیي، او پرانیستې سناریو ته د ټیک نښه ده. د سناریو: مدیر قطار د سناریوګانو او بدیلونو ونه پرانیزي. کله چې ساده حالت ټاکل شوی وي دا کمرنګ وي.</p><p>انځور، لیبلونه، ځانتیاوې، جدولونه، او پایلې ټولې د پرانیستې سناریو دي، او پاڼه یوازې پرانیستې سناریو حلوي. سناریو: پرتله، چې په خپلې ننوتنې کې بیان شوې، نورې له کاپیو حلوي. پرانیستې سناریو له پروژې سره ساتل کیږي.</p>';
$ec_lang['lpn_guide_scn_marks_term']='ځانګړي ارزښتونه چیرته ښکاري';
$ec_lang['lpn_guide_scn_marks_def']='<p>په نقشه کې، هغه شتمني چې په پرانیستې سناریو کې ځانګړی ارزښت لري په نصواري حلقه کې ده، او هغه شتمني چې له مورنۍ سناریو یا بدیل نه ځانګړی ارزښت میراث اخلي په کرښه شوې خړ حلقه کې ده. د غوښتنې، قطر، خشونت، کوچنۍ (ځایی) ضیاع ضریب، او اوږدوالي لپاره، حلقه یوازې هغه مهال ښکاري چې تنظیمات، انځورول، د نقطو لیبلونه یا د تړاو لیبلونه دا ارزښت په نقشه کې ښیي؛ د بل هر ځانتیا ځانګړی ارزښت تل خپله حلقه لري. په جدولونو کې، هغه حجره چې د پرانیستې سناریو ټاکل شوی ارزښت لري نصواري ده، او تلقین یې هغه بدیل نومي چې دا لري، لکه Physical alt.: Larger main. د جدول د حجرې په مینو کې سناریوګانې ښودل هره شتمني د هرې سناریو لپاره یو ځل لیست کوي.</p><p>د ځانتیاوو هر قطار چې سناریو یې ځانګړی کولی شي، په کیڼ لور کې نښه لري. ټینګ ټکی دا معنی لري چې پرانیستې سناریو ارزښت ځانګړی کوي؛ پر هغې کلیک وکړئ ترڅو ځانګړی ارزښت پاک شي. تش ټکی دا معنی لري چې ارزښت میراثي دی؛ پر هغې کلیک وکړئ ترڅو ښودل شوی ارزښت ځانګړی ارزښت شي. درې ګوني دا معنی لري چې د دې لاندې سناریوګانې ارزښت ځانګړی کوي؛ پر هغې کلیک وکړئ ترڅو د دوی ځانګړي ارزښتونه، د تایید وروسته، پاک شي. د ځانګړي شوي قطار لاندې هغه میراثي ارزښت دی چې بدلیږي، لکه Base scenario: 18. د تنظیماتو بکس یوازې ټینګ ټکی او درې ګوني لري، ځکه چې هلته د ارزښت لیکل هغه څه دي چې ځانګړی ارزښت جوړوي.</p><p>د حلقو پټولو لپاره، په تنظیمات، نقشه او پاڼه، پاڼه کې په نقشه کې د ځانګړو ارزښتونو نښې ښودل پاک کړئ، یا نقشه، پاکه نقشه غوره کړئ. دواړه په دې براوزر کې ساتل کیږي، نه په پروژه کې. جدولونه ځانګړي ارزښتونه په هر صورت نښه کوي.</p>';
$ec_lang['lpn_guide_scn_make_term']='ځانګړي ارزښتونه جوړول او پاکول';
$ec_lang['lpn_guide_scn_make_def']='<p>کله چې له اساس پرته بله سناریو پرانیستې وي، هغه ارزښت ته سمون چې سناریوګانې یې ځانګړی کولی شي په پرانیستې سناریو کې د ځانګړي ارزښت په توګه ساتل کیږي، په هر ډول چې وشي: په ځانتیاوو کې لیکل، په جدولونو کې د حجرې سمون، په لټون او ځای پرځای کولو کې ځای پرځای کول، د نقطې ایستل یا د هغې همغږي ننوتل، ډول بدلول (نوی ډول ځانګړی ارزښت دی)، یا ځانتیاوې ټاکنې ته پیسټ کول. په تنظیماتو بکس کې لیکل شوی تنظیم هغه مهال د ځانګړي ارزښت په توګه ساتل کیږي چې سناریوګانې دا تنظیم ځانګړی کولی شي. اساس نه بدلیږي. په اساس کې، همدا سمونونه پخپله شبکه بدلوي او هرې هغې سناریو ته رسیږي چې دا ارزښت یې ځانګړی نه کړی.</p><p>ړنګول بل ډول کار کوي. په سناریو کې، ړنګول هغه شتمني نه لرې کوي چې په اساس کې شته. دا شتمني په پرانیستې سناریو کې غیرفعاله کوي، او د نقطې لپاره د هغې پایپونه هم، او یو پیغام دا وایي. شتمني لا هم په انځور او په نورو سناریوګانو کې ده. هغه شتمني چې کله سناریو پرانیستې وي رسم شي په اساس کې غیرفعاله او په هغې سناریو کې فعاله ده، او په هغې سناریو کې ړنګول یې لرې کوي. په اساس کې د شتمنۍ ړنګول په هره سناریو کې د هغې ځانګړي ارزښتونه هم ړنګوي، د هغې پوښتنې وروسته چې دوی شمیري. مشتریان او شکلونه د هیڅ سناریو نه دي او په بشپړ ډول ړنګیږي.</p><p>د سناریوګانو لیست د ځانګړو ارزښتونو مدیر قطار د پرانیستې سناریو د هر ځانګړي ارزښت لیست په کټګورۍ سره پرانیزي، هر یو د هغه میراثي ارزښت تر څنګ چې بدلوي. په نقشه کې د وخت لړۍ ګراف چې سناریو پرانیستی، خوځولی، یا بدل کړی، خپل قطار دی. قطارونه وټاکئ او ټاکل شوي ځانګړي ارزښتونه پاکول کلیک کړئ، په یوه قطار کې ځانګړی ارزښت پاکول کلیک کړئ، یا ټول ځانګړي ارزښتونه پاکول کلیک کړئ. هر ارزښت بیا میراثي ارزښت ته راستنیږي، او بېرته دا بیرته راګرځوي. په لیست کې یو ID وټاکئ ترڅو په نقشه کې شتمنۍ ته لاړ شئ. په ځانتیاوو کې ټکی او د جدولونو د حجرې په مینو کې ځانګړی ارزښت پاکول یو یو ځانګړی ارزښت پاکوي.</p>';
$ec_lang['lpn_guide_scn_scope_term']='سناریو څه ځانګړي کولی شي او څه نه';
$ec_lang['lpn_guide_scn_scope_def']='<table class="lpn-notes-table"><tbody><tr><td>ځانتیاوې</td><td>د نقطې یا تړاو هره ځانتیا پرته له هغو چې لاندې لیست شوې، د هغې ځای، فعاله والی، او ډول (ډول بدلول) په ګډون. متن کولی شي خپلې کلمې، ځای، اندازه، تنظیم، ډب، زاویه، او ښودل ځانګړي کړي. ځانګړې ځانتیا تل ځانګړې کیدی شي. ځانتیاوې په دې کټګوریو کې ساتل کیږي: فزیکي، غوښتنه، فعاله ټوپولوژي، لومړني تنظیمات، جز، د اور بهاو، د انرژۍ لګښت، دودیز ځانتیاوې، متن، وړاندې کول، او محاسبه.</td></tr><tr><td>تنظیمات</td><td>هغه تنظیمات چې له پروژې سره ساتل کیږي، پرته له هغو چې لاندې لیست شوي: د محاسبې اختیارونه (د بېلګې په توګه د غوښتنې ضریب، ټول د چلولو وخت، هایدرولیکي وخت ګام، او د رګړ طریقه)، د غوښتنې ډیفالټ نمونه، هغه ارزښتونه چې نوو شتمنیو ته ورکول کیږي، او د وړاندې کولو تنظیمات (اندازې، رنګونه، لیبلونه، کانتورونه، د نقشې لید، او په نقشه کې د وخت لړۍ ګرافونه).</td></tr><tr><td>په هره سناریو کې یو شان</td><td>د شتمنۍ ID، تشریح، او ټاګ؛ د تړاو پای نقطې او کوږوالی؛ مشتریان او شکلونه؛ واحدونه او همغږۍ سیسټم؛ او د کتابتونونو منځپانګه (نمونې، منحنۍ، د پایپ ډولونه، د فیتینګونو لیستونه، کنټرولونه، او قواعد). په دې هر یو کې سمون هره سناریو بدلوي. سناریو کولی شي شتمني بلې منحنۍ، د پایپ ډول، د فیتینګونو لیست، یا نمونې ته وښيي، خو هغه څه نشي بدلولی چې په دوی کې دي.</td></tr></tbody></table>';
$ec_lang['lpn_guide_scn_example_term']='په Net1 کې بېلګه';
$ec_lang['lpn_guide_scn_example_def']='<p>د Net1 بېلګه پرانیزئ. اوبه، سناریوګانې، نوې سناریو… غوره کړئ، Larger main ولیکئ، او سمه ده کلیک کړئ. په نقشه کې Pipe 10 وټاکئ او په ځانتیاوو کې د قطر لپاره 24 ولیکئ؛ اساس 18 in. لري، چې د ساحې لاندې د Base scenario: 18 په توګه ښودل کیږي. په سناریوګانو لیست کې اساس غوره کړئ، بیا نوې سناریو… غوره کړئ، Max day ولیکئ، او په تنظیمات، محاسبه، هایدرولیکس کې د غوښتنې ضریب لپاره 1.8 ولیکئ. بیا اوبه، راپورونه، سناریو: پرتله غوره کړئ.</p><table class="lpn-notes-table"><tbody><tr><td></td><td></td><td></td><td colspan="3">ټیټ ترین فشار</td><td colspan="3">لوړ ترین سرعت</td></tr><tr><td>سناریو</td><td>د ځانګړو ارزښتونو شمېر</td><td>د غوښتنې ضریب</td><td>جنکشن</td><td>فشار (psi)</td><td>وخت (hr)</td><td>تړاو</td><td>سرعت (ft/sec)</td><td>وخت (hr)</td></tr><tr><td>Base</td><td>0</td><td>1</td><td>N32</td><td>108</td><td>14:00</td><td>L11</td><td>2.76</td><td>16:00</td></tr><tr><td>Larger main</td><td>1</td><td>1</td><td>N32</td><td>109</td><td>14:00</td><td>L11</td><td>2.87</td><td>16:00</td></tr><tr><td>Max day</td><td>1</td><td>1.8</td><td>N32</td><td>15.78</td><td>9:00</td><td>L10</td><td>3.49</td><td>9:00</td></tr></tbody></table><p>ټول د چلولو وخت په ټولو درېیو کې 24:00 دی، نو هر ټیټ ترین فشار او لوړ ترین سرعت د ورځې انتها ده، په ښودل شوي وخت کې. لوی نل ټیټ ترین فشار شاوخوا 1 psi لوړوي. 1.8 ضریب یې په 9:00 کې 15.78 psi ته ټیټوي، او لوړ ترین سرعت Pipe 10 ته ځي. هره سناریو یو ځانګړی ارزښت لري، او اساس خپل ارزښتونه ساتي.</p>';
$ec_lang['lpn_guide_scn_notes_term']='د یادولو وړ ټکي';
$ec_lang['lpn_guide_scn_notes_def']='<ul><li>هغه ځانګړی ارزښت چې له میراثي ارزښت سره برابر وي لا هم ځانګړی ارزښت دی. دا شمیرل کیږي، او د ځانګړو ارزښتونو مدیر یې نښه کوي (same).</li><li>ساده حالت د دې براوزر تنظیم دی، نه د پروژې. دا د هغې پروژې لپاره غیرفعال دی چې سناریوګانې او بدیلونه یې نشي ښودلی. بدیلونه او د سناریو: مدیر د دې ننوتنې په سر کې په مرسته کې بیان شوي.</li><li>بېرته 20 ګامونه ساتي. هر ګام سناریوګانې او پرانیستې سناریو د انځور سره بیرته راګرځوي، نو د سناریو اضافه کول، نوم بدلول، او ړنګول بېرته کیدی شي.</li><li>د EPANET فایل صادرول یوازې پرانیستې سناریو لیکي، د هغو ارزښتونو او د نقطو ځایونو سره چې دا سناریو لولي. سناریوګانې پخپله یوازې د پروژې په فایل کې ثبتیږي.</li></ul>';
// The Scenario comparison chapter beyond its opening paragraphs (lpn_guide_text_scncmp_box), copied into
// the box's entry by renderGuideBoxes() from <template id="lpn_guide_more_lpn_scncmp_box">. Task 785.
$ec_lang['lpn_guide_cmp_cols_term']='جدول څه لري';
$ec_lang['lpn_guide_cmp_cols_def']='<table class="lpn-notes-table"><tbody><tr><td>سناریو</td><td>د سناریو نوم. پرانیستې سناریو (اوس پرانیستې) نښه شوې ده.</td></tr><tr><td>د ځانګړو ارزښتونو شمېر</td><td>د سناریو خپل ځانګړي ارزښتونه، لکه د سناریوګانو په لیست کې شمیرل شوي. د محاسبې اختیار لکه د غوښتنې ضریب یو شمیرل کیږي، او هغه ځانګړی ارزښت چې له میراثي ارزښت سره برابر وي هم شمیرل کیږي.</td></tr><tr><td>د غوښتنې ضریب، ټول د چلولو وخت، هایدرولیکي وخت ګام</td><td>هغه ارزښتونه چې سناریو یې لاندې حل شوې، د هغې خپل یا د پروژې. ثابت حالت سناریو د وخت ګام لپاره داش ښیي.</td></tr><tr><td>ټیټ ترین فشار</td><td>په جنکشن کې ټیټ ترین فشار، د هغه ID او د پېښیدو وخت سره. ذخیرې او ټانکونه پریښودل کیږي ځکه چې هر یو ثابت هیډ لري.</td></tr><tr><td>لوړ ترین سرعت</td><td>په پایپ یا والو کې لوړ ترین سرعت، د هغه ID او د پېښیدو وخت سره. پمپونه پریښودل کیږي.</td></tr></tbody></table>';
$ec_lang['lpn_guide_cmp_run_term']='ثابت حالت او اوږد مهاله سناریوګانې';
$ec_lang['lpn_guide_cmp_run_def']='<p>هغه سناریو چې ټول د چلولو وخت یې له 0 نه ډیر وي د EPANET انجن له لارې په ټوله موده کې چلیږي. د هغې ټیټ ترین فشار او لوړ ترین سرعت په هر وخت ګام کې انتها دي، هر یو د خپل وخت سره ښودل کیږي. هغه سناریو چې ټول د چلولو وخت یې 0 وي په یوه شېبه کې حلیږي. ټول د چلولو وخت یو له هغو اختیارونو دی چې سناریو یې ځانګړی کولی شي، نو یو جدول کولی شي دواړه ډولونه ولري.</p>';
$ec_lang['lpn_guide_cmp_notes_def']='<ul><li>هغه سناریو چې نشي حل کیدی د خپلو دوو پایلو پر ځای دلیل ښیي، د بېلګې په توګه دا چې یو جنکشن وروسته له دې چې پایپ غیرفعال شو سرچینې ته لاره نه لري. نورې سناریوګانې لا هم حلیږي. هغه سناریو چې نه همغږي شوه خپلې وروستۍ پایلې او یو پیغام ښیي.</li><li>د جدول پورته بلاک، په هره سناریو کې یو شان، د رګړ طریقه، واحدونه، دقت، او اعظمي هڅې بیانوي. هغه تنظیم چې سناریوګانو کې توپیر لري له بلاک نه پاتې کیږي.</li><li>د بریالیتوب یا ناکامۍ هیڅ حد نشته. شمیرې د هغه سیسټم د ډیزاین معیارونو په مقابل کې ولولئ چې ماډل کیږي.</li><li>په سناریو: مدیر ننوتنه کې ورکړل شوې بېلګه په Net1 کې درې سناریوګانې پرتله کوي.</li></ul>';
// The Libraries chapter, in the entry for the Libraries box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_library_box">. Written from the code and held by
// dev/lpn-spike/user-guide-library-harness.js.
$ec_lang['lpn_guide_lib_kinds_term']='هره برخه څه لري';
$ec_lang['lpn_guide_lib_kinds_def']='<table class="lpn-notes-table"><tbody><tr><td>نمونې</td><td>د ضریبونو لیست چې تر هغه مهاله تکراریږي څومره چې چلول دوام کوي، د نمونې هر وخت ګام لپاره یو ضریب. نوې نمونه د 1 څلورویشت ضریبونه دي. د سپریډشیټ کالم پیسټ کول د ضریبونو بکس ډکوي. د غوښتنې ډیفالټ نمونه (default) نښه شوې او په تنظیمات، محاسبه، هایدرولیکس کې ټاکل کیږي.</td></tr><tr><td>منحنۍ</td><td>څلور ډولونه، د منحنۍ ډول په توګه ټاکل شوي: د پمپ هیډ، د پمپ موثریت، د ټانک حجم، او د والو هیډ ضیاع. ټکي په یوه جال کې ننوځي چې د سپریډشیټ پیسټ شوی کالم یا د EPANET له فایل نه کاپي شوې کرښې مني. د پمپ هیډ منحنۍ د خپلو ټکو له لارې برابریږي او د معادلې کرښه برابرول ښیي؛ یو ټکی د ډیزاین ټکی لولي، د بندیدو هیډ د خپل هیډ 1.33334 چنده او اعظمي بهاو د خپل بهاو 2 چنده سره، لکه څنګه چې EPANET یې لولي. نور ډولونه خپل ټکي په مستقیمو کرښو سره نښلوي. پمپ یا والو خپله منحنۍ په ځانتیاوو کې بیانوي، چیرې چې د منحنیو لینک دا برخه پرانیزي.</td></tr><tr><td>د پایپ ډولونه</td><td>د قطر، خشونت، او عکس العمل ضریبونو تعریف چې څو پایپونه ورته اشاره کوي. یوه ځانتیا په تعریف کې خالي پریښودل کیدی شي او بیا د هر پایپ لپاره ولیکل شي. په ځانتیاوو کې، هغه ارزښتونه چې د پایپ ډول یې بیانوي غیرفعال دي، او له پایپ ډول جلا کول دوی پایپ ته کاپي کوي او پایپ د ډول کارولو نه ودروي.</td></tr><tr><td>فیتینګونه</td><td>د فیتینګونو لیستونه د هرې لپاره د مقدار سره، چې د پایپ یا د پایپ ډول لپاره په یوه کوچنۍ (ځایی) ضیاع ضریب، k، کې راټولیږي. وړاندیز شوي فیتینګونه د EPANET 2.2 د کاروونکي لارښود په 3.3 جدول کې دیارلس دي او نور فیتینګ. یو غوره کول د هغه ضریب قطار ته کاپي کوي، چیرې چې بدلیدی شي.</td></tr><tr><td>کنټرولونه</td><td>هر یو یو بیان، د EPANET په ترکیب کې، لکه <code>LINK id OPEN IF NODE id BELOW value</code>. د هر یو لاندې، بکس وایي چې ایا پوه شو.</td></tr><tr><td>قواعد</td><td>هر یو څو کرښې، د EPANET په ترکیب کې: RULE، IF، AND، OR، THEN، ELSE، او PRIORITY. د هر یو لاندې، بکس وایي چې ایا ولوستل شو.</td></tr></tbody></table>';
$ec_lang['lpn_guide_lib_refs_term']='نوم بدلول، ړنګول، او څه توکي ته اشاره کوي';
$ec_lang['lpn_guide_lib_refs_def']='<p>ID په خپله برخه کې بدلیږي. خالي ID، یا هغه ID چې دمخه په همدې برخه کې کارول شوی، نه منل کیږي. د توکي نوم بدلول هره اشاره ورته په اساس او په هره سناریو کې حرکت ورکوي. د نمونې لپاره، اشارې د جنکشن د غوښتنې نمونه او د هغې د هرې غوښتنې کټګورۍ نمونه، د مشتری د غوښتنې نمونه، د ذخیرې د هیډ نمونه، د پمپ د چټکتیا نمونه، او د غوښتنې ډیفالټ نمونه دي.</p><p>هغه نمونه چې په کارونه کې ده ړنګیدی شي، او هره اشاره ورته پاکیږي. که دا د غوښتنې ډیفالټ نمونه وه، یو خبرتیا وایي چې هغه جنکشنونه چې نمونه نه لري اوس څه کاروي. هغه منحنۍ، د پایپ ډول، یا د فیتینګونو لیست چې په کارونه کې دی نه ړنګیږي. پیغام هغه شتمنۍ نومي چې دا کاروي، او هر یو باید لومړی بله منحنۍ ترلاسه کړي، یا له ډول یا لیست نه جلا شي.</p>';
$ec_lang['lpn_guide_lib_scn_term']='کتابتونونه او سناریوګانې';
$ec_lang['lpn_guide_lib_scn_def']='<p>کتابتونونه په هره سناریو کې یو شان دي. سناریو کولی شي شتمني بلې منحنۍ، د پایپ ډول، د فیتینګونو لیست، یا نمونې ته وښيي، چې د هغې شتمنۍ ځانګړی ارزښت دی، خو د توکي منځپانګه ځانګړې نه کیږي. نمونې، منحنۍ، د پایپ ډول، د فیتینګونو لیست، کنټرول، یا قاعدې ته سمون یې په هره سناریو کې بدلوي، هر هغه سناریو چې پرانیستې وي. د غوښتنې ډیفالټ نمونه تنظیم دی نه توکی، او سناریو کولی شي خپله ولري.</p><p>هغه کنټرول یا قاعده چې شتمني نومي چې په پرانیستې سناریو کې غیرفعاله ده د هغې سناریو په چلولو کې له پامه غورځول کیږي، او د کتابتونونو بکس یې لیست کوي. هغه چې شتمني نومي چې پروژه یې نه لري هم له پامه غورځول کیږي، د خبرتیا سره.</p>';
$ec_lang['lpn_guide_lib_ctl_term']='په چلولو کې کنټرولونه او قواعد';
$ec_lang['lpn_guide_lib_ctl_def']='<p>کنټرول یو بیان دی. قاعده څو کرښې دي چې په RULE پیلیږي. کلیدي کلمې په انګلیسي لیکل کیږي د پاڼې د ژبې په پام کې نیولو پرته، او شمیرې د پروژې په واحدونو کې دي. کنټرول اضافه کول له هغه بیان نه پیلیږي چې له شبکې جوړ شوی، چې بیا هغه ته سمون کیږي چې موخه ده.</p><p>کنټرولونه او قواعد پایله یوازې په اوږدمهاله سمولېشن کې بدلوي، یعنې کله چې ټول د چلولو وخت له 0 ډیر وي. ثابت حالت حل په هیڅ یو نه بدلیږي. قواعد یوازې د EPANET انجن لخوا پلی کیږي. دواړه له پروژې سره ساتل کیږي او د EPANET فایل ته لیکل کیږي.</p>';
$ec_lang['lpn_guide_lib_import_term']='له بلې پروژې نه کتابتونونه دننه کول';
$ec_lang['lpn_guide_lib_import_def']='<p>فایل، دننه کول…، کتابتونونه دننه کول… بله د پروژې فایل پرانیزي او بشپړ کتابتونونه له هغې نه دې پروژې ته کاپي کوي. هغه توکی چې نوم یې دلته دمخه کارول شوی پریښودل کیږي او لیست کیږي، نو هیڅ یو چې دلته دمخه دی نه بدلیږي. یوه خبرتیا ښودل کیږي کله چې فایل او پروژه یو مقدار په بیلابیلو واحدونو کې بیانوي، او توکي لکه لیکل شوي دننه کیږي. هغه د پایپ ډولونه چې د فیتینګونو لیست ته اشاره کوي چې دا پروژه یې نه لري لیست کیږي؛ د فیتینګونو کتابتون له همدې فایل نه دننه کړئ ترڅو حل شي.</p>';
$ec_lang['lpn_guide_lib_example_def']='<p>د Net1 بېلګه پرانیزئ او اوبه، کتابتونونه غوره کړئ. نمونې د 1 نمونه، Demand Pattern، لري، د 2:00 توپیر سره 12 ضریبونه، چې 24:00 پوښي، (default) نښه شوې. منحنۍ منحنۍ 1، Pump Curve for Pump 9، لري، د پمپ هیډ منحنۍ د یو ټکي سره، 250 ft کې 1500 gpm. کنټرولونه دوه بیانونه لري: لومړی Link 9 پرانیزي کله چې Node 2 له 110 نه ښکته شي، او دویم یې وتړي کله چې Node 2 له 140 پورته شي. قواعد دوه قواعد لري چې د ساعت وخت او د Tank 2 کچه ازمويي.</p><p>اوبه، محاسبه، او بیا اوبه، راپورونه، د حالت بدلونونه غوره کړئ. Pump L9 اوس په 10:00 کې تړل شوی، په 15:00 کې پرانیستل شوی، او په 21:00 کې تړل شوی دی، او Tank N2 اوس په 22:00 کې تش کیږي. په کنټرولونو کې، په دویم کنټرول کې 140 په 135 بدل کړئ او بیا اوبه، محاسبه غوره کړئ. وروستی تړل 20:00 ته ځي، او Tank N2 اوس په 21:00 کې تش کیږي.</p>';
$ec_lang['lpn_guide_lib_notes_def']='<ul><li>نمونه تر هغه مهاله تکراریږي څومره چې چلول دوام کوي، نو اړ نه ده چې ټول چلول پوښي.</li><li>د EPANET فایل د پایپ ډول یا د فیتینګونو لیست لپاره ځای نه لري. فایل هغه شمیرې لري چې هر پایپ یې لولي، او صادرول وایي کوم پایپونه پلن شول.</li><li>د کتابتونونو بکس ځای او اندازه په دې براوزر کې ساتل کیږي. توکي له پروژې سره ساتل کیږي.</li></ul>';
// The Properties chapter, in the entry for the Properties box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_popup">. Held by dev/lpn-spike/user-guide-properties-harness.js.
$ec_lang['lpn_guide_prop_open_term']='ځانتیاوې پرانیستل';
$ec_lang['lpn_guide_prop_open_def']='<p>په ټاکلو حالت کې، په نقطه، تړاو، متن، یا مشتری کلیک وکړئ ترڅو ځانتیاوې د هغې تر څنګ، یا هلته چې بکس وروستی ځل خوځول شوی، پرانیستل شي. Shift-کلیک په بلې شتمنۍ کې دا ټاکنې ته اضافه کوي. له یوې ډیرو ټاکل شویو شتمنیو سره، بکس هغه لیست کوي چې په ټولو یو ځل ټاکل کیدی شي (لاندې څو ټاکل شوي شتمنۍ وګورئ). شکل د ځانتیاوو بکس نه لري، ځکه چې د هغې ټکي په نقشه کې سمون کیږي.</p><p>د نقطې یا تړاو ښي کلیک مینو ځانتیاوې کاپي کول، ځانتیاوې ټاکنې ته پیسټ کول، او د وخت لړۍ ګراف لري. په لمسي سکرین کې، د همدې مینو لپاره پر شتمنۍ ټینګ فشار ورکړئ. د وخت لړۍ ګراف د اوږدمهاله سمولېشن پایلې غواړي.</p>';
$ec_lang['lpn_guide_prop_edit_term']='ارزښت سمونول';
$ec_lang['lpn_guide_prop_edit_def']='<p>ارزښت هغه مهال اغیز کوي چې ساحه تایید شي، د پریښودلو یا Enter فشارولو سره. دا د لیبل کې د نومول شوي واحد په توګه لوستل کیږي، پرته له بدلونه، او د نقشې لیبل، جدولونه، او پایلې تعقیبوي. محاسبه شوي ارزښتونه د یوازې لوستلو قطارونه دي چې د لیکلو بکس نه لري. د تړاو لپاره دوی د هغې داخلونه تعقیبوي، او د نقطې لپاره دوی د هغوی ترمنځ ناست دي. دوی د وروستۍ محاسبې پایلې دي، په ښودل شوي وخت کې، او کله چې پخپله بیا محاسبه کول پاک وي دوی د وروستۍ محاسبه کول پایلې دي.</p><p>هغه پایپ چې د پایپ ډول کاروي هغه ارزښتونه چې ډول یې بیانوي غیرفعال ښیي. د پایپ ډول نه جلا کول کلیک کړئ ترڅو دا ارزښتونه پایپ ته کاپي شي او هلته سمون شي.</p>';
$ec_lang['lpn_guide_prop_id_term']='ID';
$ec_lang['lpn_guide_prop_id_def']='<p>ID د سرلیک په پټه کې سمون کیږي. دا نشي کولی تشه یا د نقل قول نښه ولري، او د نقطې ID نشي کیدی د بلې نقطې ID وي، نه هم د تړاو د بل تړاو. نقطه او تړاو کولی شي ورته ID ولري. رد شوی ID زوړ ځای کې پریږدي او پیغام ښیي. د شتمنۍ نوم بدلول خپل سناریو ځانګړي ارزښتونه ورسره وړي.</p>';
$ec_lang['lpn_guide_prop_scn_term']='په سناریو کې';
$ec_lang['lpn_guide_prop_scn_def']='<p>په هغه سناریو کې چې اساس نه وي، هغه ارزښت ته سمون چې سناریوګانې یې ځانګړی کولی شي د پرانیستې سناریو د ځانګړي ارزښت په توګه ساتل کیږي، او قطار په کیڼ لور کې نښه کیږي. د سناریو: مدیر ننوتنه نښې بیانوي او هغه څه لیست کوي چې په هره سناریو کې یو شان دي: ID، تشریح، او ټاګ دي. مشتری د سناریو ارزښتونه نه لري. د سناریوګانو بدلول ځانتیاوې په ورته شتمنۍ پرانیستې پریږدي، او د هغې سناریو ارزښتونه ښیي چې اوس پرانیستې ده.</p>';
$ec_lang['lpn_guide_prop_multi_term']='څو ټاکل شوې شتمنۍ';
$ec_lang['lpn_guide_prop_multi_def']='<p>سرلیک لولي، د بېلګې په توګه، 2 ټاکل شوي. بکس د ټاکنې کې د شتمنۍ هر ډول لپاره یوه برخه لري، چې د ډول نوم او د هغه شتمنیو شمېر سره سرلیک لري، لکه Pipes (2)، او هره برخه راټولیدی شي. برخه هغه ځانتیاوې لیست کوي چې جدولونه یې د کالمونو په توګه لري او په هره شتمنۍ کې ټاکل کیدی شي. پایلې او هغه ارزښتونه چې د پایپ ډول یې بیانوي نه لیست کیږي. قطار هغه ارزښت ښیي چې شتمنۍ یې شریکوي، یا Various چیرې چې توپیر لري.</p><p>په قطار کې ارزښت لیکل دا په ټاکنې کې د هر دې ډول شتمنۍ باندې ټاکي. هغه قطار چې نه لمس شوی هیڅ نه لیکي. یوه خبرتیا شمېر ښیي، لکه Set Diameter (in) on 2.، او یو بېرته ټوله قطار بیرته راګرځوي. په هغه سناریو کې چې اساس نه وي ارزښتونه د ځانګړو ارزښتونو په توګه ساتل کیږي.</p>';
$ec_lang['lpn_guide_prop_example_def']='<p>د Net1 بېلګه پرانیزئ او په Pipe 10 کلیک وکړئ. ځانتیاوې د هغې داخلونه لیست کوي، د تشریح نه تر Is active? پورې، او بیا د هغې پایلې په ښودل شوي وخت کې: Flow 1866.2 gpm، Velocity 2.4 ft/sec، او Head loss 19.12 ft H2O.</p><p>په Pipe 113 کلیک وکړئ او Pipe 31 Shift-کلیک کړئ. سرلیک 2 ټاکل شوي لولي، یوه برخه Pipes (2) ده، او قطر Various ښیي، ځکه چې Pipe 31 6 in. دی او Pipe 113 8 in. دی. د قطر لپاره 10 ولیکئ. خبرتیا Set Diameter (in) on 2. لولي، دواړه پایپونه 10 in. دي، او یو بېرته دا 6 او 8 in. ته بیرته راګرځوي.</p>';
// The Settings chapter, in the entry for the Settings box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_settings_box">. Held by dev/lpn-spike/user-guide-settings-harness.js.
$ec_lang['lpn_guide_set_where_term']='برخې، او تنظیمات چیرته ساتل کیږي';
$ec_lang['lpn_guide_set_where_def']='<p>د بکس کیڼ لور لیست برخې یا فرعي سرلیک ته ځي. برخې دا دي: انځورول (د نقطو لیبلونه، د نقطو رنګونه، د تړاو لیبلونه، د تړاو رنګونه، مشتری، او ټول)، نقشه او پاڼه (بڼه او پاڼه)، شتمنۍ (د ID مخکینې، ارزښتونه، او ځانګړې ځانتیاوې)، محاسبه (واحدونه، وخت، هایدرولیکس، انرژي، او کیفیت)، او مننه. هر فرعي سرلیک بیانوي چې تنظیمات له پروژې سره ساتل شوي که په دې براوزر کې ساتل شوي. هر څه له پروژې سره ساتل کیږي پرته له هغو تنظیماتو چې د پاڼې لاندې دي او په هایدرولیکس کې یو قطار، د چلولو د پرمختګ بکس ښودل، چې پخپله په دې براوزر کې ساتل شوی بیانوي.</p><p>په جدولونو کې د تنظیماتو ټب ورته تنظیمات د قطارونو په توګه، د هغوی کټګورۍ او ارزښت سره، لیست کوي، نو یو تنظیم هلته هم موندل او پلټل کیدی شي.</p>';
$ec_lang['lpn_guide_set_search_term']='لټون';
$ec_lang['lpn_guide_set_search_def']='<p>په تنظیمات لټول کې یوه یا څو کلمې ولیکئ ترڅو یوازې هغه تنظیمات لیست شي چې ټولې کلمې یې په نوم یا تلقین کې لري. هغه کلمه چې له سرلیک سره برابره وي د هغه سرلیک لاندې هر تنظیم ښیي. د بېلګې په توګه، opacity د Symbol opacity (0 to 1) او Background image opacity (0 to 1) لیست کوي؛ opacity symbol یوازې لومړی لیست کوي؛ او sprinklers د Emitter exponent لیست کوي، چې تلقین یې sprinklers یادوي او نوم یې نه. لټون هیڅ تنظیم نه بدلوي.</p>';
$ec_lang['lpn_guide_set_scn_term']='په سناریو کې تنظیمات';
$ec_lang['lpn_guide_set_scn_def']='<p>په هغه سناریو کې چې اساس نه وي، د هغه تنظیم لپاره لیکل شوی ارزښت چې سناریوګانې یې ځانګړی کولی شي د ځانګړي ارزښت په توګه ساتل کیږي، او قطار د ټینګ ټکي سره نښه کیږي. درې ګوني هغه تنظیم نښه کوي چې د پرانیستې سناریو لاندې سناریوګانې یې ځانګړی کوي. د سناریو: مدیر ننوتنه لیست کوي چې کوم تنظیمات ځانګړي کیدی شي. واحدونه په هره سناریو کې یو شان دي. ډیفالټونه بیرته راوستل د اساس نه بهر کمرنګ دی، او دا نوي شتمنۍ ارزښتونه په هره موجوده شتمنۍ کې پلي کړئ هلته رد کیږي، ځکه چې دا پخپله انځور بدلوي.</p>';
$ec_lang['lpn_guide_set_units_term']='واحد بدلول';
$ec_lang['lpn_guide_set_units_def']='<p>هر مقدار په واحدونو کې خپل واحد لري. کله چې په پروژه کې ارزښتونه په دې واحد کې ولیکل شي، د دې بدلول لومړی پوښتنه کوي. غیر ویجاړوونکی هر شمېره لکه چې لیکل شوې ساتي او په نوي واحد کې یې لولي. ویجاړوونکی شمیرې په بدلون سره بیا لیکي، نو شبکه فزیکي ډول یو شان پاتې کیږي، او اصلي شمیرې له السه ورکول کیږي مګر چې بېرته وکارول شي؛ یو بېرته شمیرې او واحد بیرته راګرځوي. لغوه کول هر څه لکه چې وو پریږدي.</p><p>په Net1 کې بېلګه: په واحدونو کې د قطر لپاره mm غوره کړئ. ویجاړوونکی 13 ارزښتونه بیا لیکي، او Pipe 10 457.2 mm لولي. غیر ویجاړوونکی 13 ارزښتونه نه لمسي، او Pipe 10 18 mm لولي.</p>';
$ec_lang['lpn_guide_set_assets_term']='نوې شتمنۍ، او موجودو ته ارزښتونه پلي کول';
$ec_lang['lpn_guide_set_assets_def']='<p>د ID مخکینې او ارزښتونه له اوس نه رسم شویو شتمنیو لپاره دي. دوی هغه شتمنۍ نه بدلوي چې دمخه رسم شوي. ټولو ته پلي کول، د ID مخکینې تر څنګ، د هغه ډول هرې موجودې شتمنۍ ته هغه ID ورکوي چې په مخکینې پیلیږي؛ هره یې خپله شمېره ساتي، او هغه ID چې په شمېره نه پای ته رسیږي نه بدلیږي. دا نوي شتمنۍ ارزښتونه په هره موجوده شتمنۍ کې پلي کړئ دا ځانتیاوې په هره موجوده شتمنۍ کې، د پوښتنې وروسته، بدلوي، خو یوازې د هغو ځانتیاوو لپاره چې لیبلونه یې په نقشه کې ښکاري. بېرته یې بیرته راګرځوي.</p>';
$ec_lang['lpn_guide_set_reset_term']='ډیفالټونه بیرته راوستل او نوی پیل';
$ec_lang['lpn_guide_set_reset_def']='<p>ډیفالټونه بیرته راوستل لومړی پوښتنه کوي، او بیا د پرانیستې پروژې د ID مخکینې، د نوې شتمنۍ ارزښتونه، د حل کوونکي تنظیمات، د نقشې بڼه، د افسانې ځای، او ښکارېدونکي لیبلونه خپلو اصلي ارزښتونو ته راګرځوي. شبکه نه بدلیږي، نورې پروژې نه اغیزمنیږي، او یو بېرته تنظیمات بیرته راګرځوي.</p><p>نوی پیل لومړی پوښتنه کوي، او بیا هره پروژه، هر د شاليد انځور، ټول تنظیمات، او د واحدونو انتخابونه چې په دې براوزر کې ساتل شوي ړنګوي، او پاڼه بیا پورته کوي لکه نوی لیدونکی چې یې وینی. دا بېرته نشي کیدی.</p>';
// The Toolbar chapter (Task 785), terms in the Toolbar section above its rows. Held by
// dev/lpn-spike/user-guide-toolbar-harness.js.
$ec_lang['lpn_guide_tb_row_term']='قطار لوستل';
$ec_lang['lpn_guide_tb_row_def']='<p>هر قطار یوه د اوزارپټې تڼۍ ده، د پټې په ترتیب سره، د ډلو ترمنځ کرښې سره. قطار د تڼۍ عکسونه، نوم، او تلقین ښیي، بیا یې کلیدونه. چیرې چې د مینو قطار ورته کار کوي، قطار د لارې مینو هم ښیي د «Also in» کلمو وروسته. په قطار کلیک د اوزارپټې په تڼۍ ګوته نیسي. دا هیڅکله تڼۍ نه چلوي. کله چې تڼۍ په سکرین کې نه وي، قطار هغه مینو قطار پرانیزي چې ورته کار کوي.</p>';
$ec_lang['lpn_guide_tb_dim_term']='کمرنګ نومونه';
$ec_lang['lpn_guide_tb_dim_def']='<p>کمرنګ نوم هغې تڼۍ پورې اړه لري چې اوس په سکرین کې نه ده. هغه تڼۍ چې په سکرین کې ده کمرنګه نه ده، که په هغه شېبه کې عمل کولی شي یا نه. محاسبه کول هغه مهال کمرنګ دی چې پخپله بیا محاسبه کول ټاکل شوی وي، ځکه چې تڼۍ یوازې هغه مهال ښکاري چې دا تنظیم پاک وي.</p><p>په تلیفون کې په ولاړ حالت، یوازې پنځه د چلولو کنټرولونه په اوزارپټه کې پاتې کیږي. هر بل نوم کمرنګ دی، او په یوه کلیک هغه مینو قطار پرانیزي چې ورته کار کوي. ښکتنۍ پینل تڼۍ مینو قطار نه لري، نو د هغې قطار یوازې ویلی شي چې کنټرول په سکرین کې نه دی.</p>';
$ec_lang['lpn_guide_tb_two_term']='د کنج درې ګوني سره تڼۍ';
$ec_lang['lpn_guide_tb_two_def']='<p>ټول ته برابرول او کړکۍ ټاکل په ښکتنۍ ښي کنج کې کوچنی درې ګوني لري. تڼۍ دویم ځل فشارول، د منځ کې هیڅ فشارولو پرته، هغې بدلوي: ټول ته برابرول د کړکۍ زوم کیږي، او کړکۍ ټاکل د کړکۍ، لاسو، او څو اړخیز شکلونو له لارې ګرځي. د ټول ته برابرول په کنج کلیک ژر د کړکۍ زوم ته ننوځي، پرته له دې چې لید برابر کړي.</p>';
// The Menus chapter (Task 785), two terms after the ruled keys table. Held by dev/lpn-spike/user-guide-menus-harness.js.
$ec_lang['lpn_guide_mn_list_term']='د مینو لیست لوستل';
$ec_lang['lpn_guide_mn_list_def']='<p>لیست له خپلو مینوګانو جوړ شوی: فایل، سمون، نقشه، اوبه، او مرسته، هر یو د خپل سرلیک لاندې، د هغه قطار لاندې چې پرانیزي د ښکته کیدونکي قطارونو سره او د ډلو ترمنځ کرښه. دا هغه قطارونه پریږدي چې اوس پټ دي، د مینو دننه سرلیکونه، او هغه قطارونه چې د پروژې یا براوزر څخه نومول شوي، لکه د سناریوګانو نومونه. دا یو ښکته کیدونکی ژور ځي، او د ژبې مینو لپاره ننوتنه نه لري. قطار چې اوس غیرفعال دی لا هم لیست کیږي، پرته د نښې چې وښيي چې غیرفعال دی. په قطار کلیک مینو او ښکته کیدونکی پرانیزي چې قطار ته ګوته نیول شوې. دا هیڅکله قطار نه چلوي.</p>';
$ec_lang['lpn_guide_mn_kbd_term']='د کیبورډ نه مینوګانې';
$ec_lang['lpn_guide_mn_kbd_def']='<p>د Alt+Shift وروسته توري په ثابتو ځایونو کې کلیدونه دي، F فایل لپاره، E سمون لپاره، M نقشې لپاره، W اوبو لپاره، H مرستې لپاره، او L ژبې لپاره، په هر کیبورډ ترتیب او هره ژبه کې. د F10 وروسته، د مینو توری یوازې دا پرانیزي، او په مینو پټه کې Esc فوکس هلته بیرته راګرځوي چیرته چې و.</p><p>قطارونه چې یوازې پوینټر کارولی شي توری نه لري، او د غشي کلیدونه یې پریږدي. دوی کوټه ټکي، درې د ساحې ټاکنې، د دننه کولو وسایل، کړکۍ زوم، او سکرین شاټ شاملوي.</p>';
// The Map chapter (Task 785): terms after the ruled keys table. Held by dev/lpn-spike/user-guide-map-harness.js.
$ec_lang['lpn_guide_map_undo_term']='بېرته او بیا';
$ec_lang['lpn_guide_map_undo_def']='<p>Ctrl+Z وروستی بدلون بېرته کوي، او Ctrl+Y یا Ctrl+Shift+Z بیا یې کوي. په جدولونو حجره کې، کلیدونه د پروژې دي ځکه چې حجره یوازې ټاکل شوې، او د حجرې د متن هغه مهال چې لیکل پیل شوي. پاڼه وروستي 20 ګامونه ساتي، یوازې په حافظه کې، او د پروژو بدلول یې پاکوي. ګام سناریوګانې، پرانیستې سناریو، او واحدونه د انځور سره بیرته راګرځوي.</p>';
$ec_lang['lpn_guide_map_del_def']='<p>Delete یا Backspace ټاکنه ړنګوي، پرته له هغه مهال چې په ساحه کې لیکل کیږي، چیرې چې کلیدی ساحې ته تعلق لري. په هیڅ نه ټاکلو سره، Delete دا وایي، او Backspace هیڅ نه کوي. یو بېرته د ډیرو شتمنیو ړنګول بیرته راګرځوي. په هغه سناریو کې چې اساس نه وي، Delete هغه شتمني نه لرې کوي چې په اساس کې شته؛ د سناریو: مدیر ننوتنه بیانوي چې دا څه کوي.</p>';
$ec_lang['lpn_guide_map_esc_term']='Esc';
$ec_lang['lpn_guide_map_esc_def']='<p>Esc چې مینو، ښکته کیدونکی، یا بکس تړي بل هیڅ نه کوي. د ځانتیاوو، تنظیماتو، او کتابتونونو بکسونه یوازې هغه مهال تړل کیږي چې فوکس په بکس کې وي او پوینټر پر هغې وي. چې له دې هیڅ یو نه وي پرانیستی، Esc فعال وسیله ټاکلو ته راګرځوي، او په ټاکلو کې ټاکنه پاکوي. نیمه رسم شوی پایپ د پریښودلو لپاره یو Esc او ټاکلو ته راستنیدو لپاره دویم غواړي. په ساحه کې، Esc ساحې ته تعلق لري.</p>';
$ec_lang['lpn_guide_map_letters_term']='توري، رقمونه، او زوم کلیدونه';
$ec_lang['lpn_guide_map_letters_def']='<p>W د کړکۍ زوم پیلوي، A د ساحې ټاکل پیلوي (A بیا فشارول کړکۍ، لاسو، او څو اړخیز شکلونه ګرځوي)، او F شکل رسموي. د جمع یا مساوي کیلي زوم لوړوي، او د منفي کیلي زوم ټیټوي، د ویل یو ګام سره. دا کلیدونه او رقمونه 0 تر 9 په نقشه کې هیڅ نه کوي کله چې بل کیلي دوی شارټکټ کړي، لکه Ctrl+C، په ساحه کې لیکلو پر مهال هیڅ نه کوي، او د پرانیستې مینو توري د هغې قطارونو ته پریږدي. په ټاکل شوې جدولونو حجره کې لیکل شوی رقم حجره په اوور رایټ کوي د وسیلې انتخاب پر ځای.</p>';
// The Tables chapter (Task 785): terms after the two ruled key tables. Held by dev/lpn-spike/user-guide-tables-harness.js.
$ec_lang['lpn_guide_tbl_tabs_term']='ټبونه';
$ec_lang['lpn_guide_tbl_tabs_def']='<p>د برخې د پرانیستلو لپاره، لاندنی پینل تڼۍ کلیک کړئ یا اوبه، جدولونه غوره کړئ. ټبونه، کیڼ نه ښي ته، دا دي: جنکشنونه، ذخیرې، ټانکونه، پایپونه، پمپونه، والوونه، متن، مشتریان، شکلونه، تنظیمات، سناریوګانې، د وخت لړۍ، پروفایل، فریکونسي، او د بهاو توازن. د سناریوګانو ټب هغه مهال ښکاري چې ساده حالت پاک وي. د کالم پلنوالی، ترتیب، او لیدنه په دې براوزر کې ساتل کیږي، نه په پروژه کې.</p>';
$ec_lang['lpn_guide_tbl_cell_term']='حجره ټاکل، ننوتل، او سمونول';
$ec_lang['lpn_guide_tbl_cell_def']='<p>حجره په درې حالتونو کې یو کې ده. کله چې دا یوازې ټاکل شوې وي، د غشي کلیدونه له حجرې نه حجرې ته ځي، او Ctrl+Z د پروژې بېرته دی. په ټاکل شوې حجره کې حرف لیکل ننوتنه پیلوي: لیکل شوی متن ارزښت ځای ناستی کوي، او د غشي کلیدی یې تاییدوي او بلې حجرې ته ځي. F2 یا دوه ځلې کلیک حجره د سمون لپاره پرانیزي: کرسر په ارزښت کې دی، او د غشي کلیدونه کرسر خوځوي. په ننوتنه او سمون کې، Ctrl+Z لیکل بېرته کوي. Esc ننوتنه یا سمون لغوه کوي او حجره ټاکل شوې پریږدي.</p>';
$ec_lang['lpn_guide_tbl_fill_term']='ډکول، فلترونه، او سناریوګانې';
$ec_lang['lpn_guide_tbl_fill_def']='<p>Ctrl+D ټاکل شوې لړۍ د پورتنۍ قطار نه ښکته ډکوي، او Ctrl+Enter یې د فعالې حجرې له ارزښت سره ډکوي. دواړه د ID کالم او یوازې لوستلو حجرې پریږدي، او یوه خبرتیا وایي څو حجرې ډکې شوې او څو نه بدلې شوې. Ctrl+Shift+L یوازې هغه شتمنۍ ښیي چې په نقشه کې ټاکل شوې. له فلتر سره، Ctrl+A او Ctrl+D یوازې په ښودل شویو قطارونو عمل کوي، او هغه قطار چې داسې سمون شوی چې نور نه برابریږي تر هغه پاتې کیږي چې فلتر بیا پلی شي.</p><p>په هغه سناریو کې چې اساس نه وي، د حجرې سمون، Ctrl+D، Ctrl+Enter، او پیسټ د پرانیستې سناریو د ځانګړو ارزښتونو په توګه ساتل کیږي.</p>';
// The Boxes chapter (Task 785): terms after Tom's two paragraphs. Held by dev/lpn-spike/user-guide-boxes-harness.js.
$ec_lang['lpn_guide_bx_dock_term']='ټینګول او ټبونه';
$ec_lang['lpn_guide_bx_dock_def']='<p>د بکس د سرلیک پټې کنج «د نقشې په کیڼ لور کې ځای پر ځای کول»، «د نقشې په ښي لور کې ځای پر ځای کول»، او «تیرېدونکی» لري، او کله چې بکس ټینګ شي، پخپله پټول. ټینګ شوی بکس د نقشې تر څنګ ستون دی. د پخپله پټولو سره، دا د نقشې په څنډه کې په نرۍ پټه کې ټب دی. ټب بکس په هوور کې پرانیزي، له موږک یا قلم سره د 150 ms وروسته، یا په کلیک یا ټپ کې، او بکس بیرته خپل ټب ته ننوځي لکه پورته بیان شو. پټ شوی بکس لا هم پرانیستی دی. مینو قطار یا اوزارپټې تڼۍ چې دا پرانیزي دا له ټب نه راباسي.</p><p>ټینګ شوی بکس د سرلیک پټې څخه ایستل دا ازادوي او پخپله پټول بندوي. په یوې خوا ټینګ شوي بکسونه یو پلنوالی شریکوي، او نقشه لږترلږه 320 px ساتي. ټبونه د ایستلو یا په فوکس شوي ټب Alt+Up یا Alt+Down فشارولو سره بیا ترتیبیږي.</p>';
$ec_lang['lpn_guide_bx_keep_term']='بکس څه یادوي';
$ec_lang['lpn_guide_bx_keep_def']='<p>هر بکس په دې براوزر کې ساتي چیرته چې ازاد دی، اندازه یې، ایا پرانیستی دی، د ټینګولو خوا، ایا پخپله پټیږي، د ټینګ شوي پلنوالی، او د خپل ټب ځای. ځانتیاوې، مهمیت: تحلیل، غوښتنه: پیمانه کول، او کالیبریشن یوازې د ټینګولو خوا، پخپله پټول، د ټب ځای، او ایا پرانیستي دي ساتي؛ ځای چې ازاد وي د یوې پاڼې پورته کولو لپاره دوام کوي. براوزر چې ساتل شوی ترتیب نه لري په ځینو بکسونو سره پیلیږي چې د ټبونو په توګه ټینګ شوي، او هیڅ نه ساتل کیږي تر هغه چې بکس بدل شي.</p>';
$ec_lang['lpn_guide_bx_phone_term']='په تلیفون کې';
$ec_lang['lpn_guide_bx_phone_def']='<p>په 640 px یا کم پلنوالي کې، هیڅ بکس نه ټینګیږي او هر بکس کړکۍ ډکوي. د ټینګولو تڼۍ نه وړاندیزیږي. ټینګ شوی ترتیب ساتل کیږي او په پلنې کړکۍ کې بیرته راځي.</p>';
// The Fire flow analysis chapter (Task 785), in the entry for its box. Held by dev/lpn-spike/user-guide-fireflow-harness.js.
$ec_lang['lpn_guide_ff_asks_term']='له هر جنکشن نه څه پوښتل کیږي';
$ec_lang['lpn_guide_ff_asks_def']='<p>هر ازمول شوی جنکشن دوه ازموینې ترلاسه کوي، د شبکې په کاپي کې په هغه وخت ګام کې چې په سکرین کې دی او په پرانیستې سناریو کې. لومړی پوښتي چې جنکشن څومره بهاو رسولی شي پداسې حال کې چې پاتې فشار ساتي. بهاو په جنکشن کې ایستل کیږي، او تکراري حلونه یې تنګوي، تر هغه چې چت د 10000 gpm سره برابر وي. جنکشن چې په چت کې هم پاتې فشار ساتي د چت نه ډیر رسول راپور کیږي. دویمه ازموینه، د ډیزاین ازموینه، په جنکشن کې اړین بهاو ایستي او پوښتي چې ایا بل جنکشن په خپله ساحه کې په بل ځای کې اجازه شوی ټیټ ترین فشار نه ښکته کیږي، یا کوم پایپ لوړ ترین اجازه شوی سرعت نه پورته چلیږي. د ډیزاین ازموینه نه کیږي کله چې ساحه یې هیڅ نه وي.</p><p>هغه جنکشن چې خپله اړینه اور بهاو ځانتیا لري د هغې ارزښت په مقابل کې ازمویل کیږي، او هر بل جنکشن په بکس کې ارزښت په مقابل کې.</p>';
$ec_lang['lpn_guide_ff_result_term']='پایلې لوستل';
$ec_lang['lpn_guide_ff_result_def']='<p>لنډیز هغه جنکشنونه شمیري چې ټولې ازموینې یې تېرې کړې، هغه جنکشنونه چې اور بهاو یې ناکام شو، او هغه جنکشنونه چې پاتې سیسټم یې اغیزمن کړ. جدول، د هر ازمول شوي جنکشن لپاره، دا لیست کوي: ستاتیک فشار مخکې له دې چې اور بهاو ایستل شي، اړین بهاو، په اړین بهاو کې فشار، شته بهاو، پاتې ساتل شوی، د ډیزاین ازموینې خرابترین اغیز او د ډیزاین حد، د چلولو شمېر، چې د ټولې شبکې حلونو شمېر دی، او د ناکامۍ حالتونه. هغه حجره چې شمېره نه لري داش ښیي، هیڅکله صفر نه. جنکشن چې نشي حل کیدی د شمیرو پر ځای خپل دلیل ښیي. جدول اعظمي 200 جنکشنونه چاپوي او وایي چې څو یې نه دي چاپ کړي.</p>';
$ec_lang['lpn_guide_ff_marks_term']='حلقې، ودرول، او په یو وخت کې یو شننه';
$ec_lang['lpn_guide_ff_marks_def']='<p>د چلولو وروسته، د هر ازمول شوي جنکشن دایره د هغې پایلې له مخې په نقشه کې بهرنۍ کرښه لري، او کرښې د کرښې بڼې او رنګ دواړه کې توپیر لري. یوازې هغه جنکشنونه ازمويلو لپاره ټاکل شوي جنکشنونه وټاکئ چې په نقشه کې ټاکل شوي؛ هر بل ټاکل شوی شمیرل کیږي او نه ازمویل کیږي. ودرول چلول پای ته رسوي او هغه جنکشنونه ساتي چې بشپړ شوي. په یو وخت کې یوازې یو د اور بهاو، مهمیت، او د غوښتنې پیمانه کولو شننې چلیږي.</p>';
$ec_lang['lpn_guide_ff_example_def']='<p>د Net1 بېلګه پرانیزئ، اوبه، تحلیل، د اور بهاو شننه… غوره کړئ، او چلول کلیک کړئ لکه چې بکس پرانیستل کیږي. د وخت ګام 0:00 دی، او چلول ټوله شبکه 135 ځله حلوي. له نهو جنکشنونو اته ټولې ازموینې تیروي. جنکشن N32 اور بهاو ناکامیږي: د هغې ستاتیک فشار 111 psi دی، په اړین 1000 gpm کې یوازې 1.19 psi پاتې کیږي، او شته بهاو یې 892 gpm دی. جنکشن N31 کولی شي 1339 gpm ورسوي، او جنکشن N12 له 10000 gpm نه ډیر.</p>';
// The Criticality analysis chapter (Task 785). Held by dev/lpn-spike/user-guide-criticality-harness.js.
$ec_lang['lpn_guide_cr_case_term']='هره قضیه څه کوي';
$ec_lang['lpn_guide_cr_case_def']='<p>په ساحه کې د هر تړاو لپاره، تړاو د شبکې په کاپي کې غیرفعال کیږي، او کاپي په هغه وخت ګام کې چې په سکرین کې دی په پرانیستې سناریو کې حلیږي. چلول د هر تړاو لپاره یو حل دی او یو بل چې هیڅ مات نه وي. جنکشن چې ذخیرې یا ټانک ته پرانیستې لاره پرېښودل کیږي بند دی: دا د حل نه مخکې لرې کیږي، او غوښتنه یې د ونه رسول شوې غوښتنې په توګه شمیرل کیږي. له هغو جنکشنونو چې لا هم نښلول شوي، د لږترلږه ښکته جنکشنونه هغه لیست کوي چې فشار یې له اجازه شوي ټیټ ترین فشار نه ښکته کیږي. جنکشن چې دمخه د هیڅ ماتیدو سره له هغه ښکته دی د هیڅ تړاو په مقابل کې نه شمیرل کیږي، او لنډیز وایي څو دي. ټیټ ترین اجازه شوی فشار هماغه تنظیم دی لکه په اور بهاو: شننه بکس کې «ټیټ ترین فشار چې چیرته نور اجازه لري».</p>';
$ec_lang['lpn_guide_cr_dead_term']='مړه پایونه، او لیست';
$ec_lang['lpn_guide_cr_dead_def']='<p>مړ پای تړاو هغه دی چې لرې کول یې هغه جنکشنونه بندوي چې یوازې د هغې له لارې رسیدلی شي. هر څه د هغې هاخوا د هغې ضایع دی، نو د مړو پایونو پریښودل ټاکل شوي سره تړاو نه حلیږي، او لنډیز وایي څو پریښودل شول. لیست د هر تړاو لپاره ونه رسول شوې غوښتنه، بند شوي جنکشنونه، او لږترلږه ښکته جنکشنونه ښیي، هر یو د شمېرې او لومړیو پنځو ID سره، او په ID کلیک په نقشه کې ورته ځي. هغه تړاو چې سیسټم ته لګښت لري لومړی لیست کیږي تر هغه چې د کالم سرلیک د ترتیبولو لپاره کلیک شي، او لنډیز یې د ازمول شویو تړاوونو شمېر سره شمیري. یوازې هغه تړاوونه ماتولو لپاره ټاکل شوي تړاوونه وټاکئ چې په نقشه کې ټاکل شوي.</p>';
$ec_lang['lpn_guide_cr_example_def']='<p>د Net1 بېلګه پرانیزئ، اوبه، تحلیل، د مهمیت تحلیل… غوره کړئ، د اجازه شوی ټیټ ترین فشار لپاره 116 ولیکئ، او چلول کلیک کړئ. د وخت ګام 0:00 دی، او چلول ټوله شبکه 14 ځله حلوي. له 13 تړاوونو څلور جنکشن له 116 psi ښکته کوي کله چې بهر وي: L9 (N10، N11، او N21)، L10 (N11 او N21)، L111 (N21 او N22)، او L112 (N21 او N22). دوه جنکشنونه دمخه له 116 psi ښکته دي د هیڅ ماتیدو سره او نه شمیرل کیږي. ځکه چې Net1 حلقوي دی، د یو تړاو ضایع هیڅکله جنکشن بې سپلایه نه پریږدي.</p>';
// The Demand scaling chapter (Task 785). Held by dev/lpn-spike/user-guide-demandscale-harness.js.
$ec_lang['lpn_guide_ds_run_def']='<p>چلول په ټاکل شویو جنکشنونو کې غوښتنې د غوښتنې پیمانې سره ضربوي، د شبکې په کاپي کې په هغه وخت ګام کې چې په سکرین کې دی او په پرانیستې سناریو کې. دا دوه حلونه کوي، یو د غوښتنو سره لکه چې دي او یو پیمانه شوی. پایله ټیټ ترین فشارونه او لوړ ترین سرعتونه لیست کوي، هر یو د پیمانه شوي ارزښت سره د نه پیمانه شوي ترڅنګ، چې هغه ارزښت دی چې نقشه یې ښیي. هر لیست لس قطارونه لري، او بکس وایي څو تړاوونه نه ښیي. د غوښتنې پیمانه د پرانیستې سناریو د غوښتنې ضریب سربیره پلي کیږي، او هیڅکله په پروژه کې نه ساتل کیږي.</p>';
$ec_lang['lpn_guide_ds_find_def']='<p>لټون د 0 نه تر 20 پورې د غوښتنې پیمانې لټوي، نږدې 0.01 ته، د ډیرې لویې لپاره چې هر ټاکل شوی جنکشن لږترلږه اجازه شوی ټیټ ترین فشار ساتي. دا پیمانه او هلته ټیټ ترین فشار راپور کوي، او همداسې بل پورته ګام لپاره، چیرې چې فشار لومړی له حد نه ښکته کیږي. که غوښتنې لکه چې ننوتل شوې دمخه یو جنکشن له حد نه ښکته پریږدي، ځواب د خبرتیا نښې سره نښه کیږي. که هر جنکشن حد په 20 کې ساتي، ځواب دا وایي. ودرول لټون پرته له ځواب پای ته رسوي. ټیټ ترین اجازه شوی فشار هماغه تنظیم دی لکه په اور بهاو: شننه بکس کې «ټیټ ترین فشار چې چیرته نور اجازه لري».</p>';
$ec_lang['lpn_guide_ds_scope_term']='جنکشنونه، او د وخت ګام';
$ec_lang['lpn_guide_ds_scope_def']='<p>له ټاکل شوو جنکشنونو سره، یوازې هغه جنکشنونه چې په نقشه کې ټاکل شوي پیمانه او ازمویل کیږي. نور جنکشنونه لکه چې دي پریښودل کیږي، او هغه چې له حد نه ښکته کیږي پرته له ځواب محدودولو لیست کیږي. یوازې هغه وخت ګام چې په سکرین کې دی پیمانه کیږي، او کچې او حالتونه له هغې اخیستل کیږي. د لوړې ازموینې لپاره، ساعت د لوړې غوښتنې ته مخکې له چلولو حرکت ورکړئ.</p>';
$ec_lang['lpn_guide_ds_example_def']='<p>د Net1 بېلګه پرانیزئ او اوبه، تحلیل، د غوښتنې پیمانه کول… غوره کړئ. په وخت ګام 0:00 کې، لټون کلیک کړئ لکه چې بکس پرانیستل کیږي. هر جنکشن لږترلږه 20 psi ساتي تر 5.76 د غوښتنې پیمانې پورې، چیرې چې ټیټ ترین فشار په جنکشن N32 کې 20.11 psi دی. په 5.77 کې دا 19.8 psi دی، او لټون 13 حلونه واخیستل. د غوښتنې پیمانې لپاره 3 ولیکئ او چلول کلیک کړئ: جنکشن N32 له 111 psi، نه پیمانه شوی، 85.99 psi ته راښکته کیږي، او تړاو L112 له 0.535 ft/sec نه 3.13 ft/sec ته پورته کیږي.</p>';
// The Pump energy chapter (Task 785). Held by dev/lpn-spike/user-guide-energy-harness.js.
$ec_lang['lpn_guide_en_read_term']='راپور لوستل';
$ec_lang['lpn_guide_en_read_def']='<p>اوبه، راپورونه، د پمپ انرژي غوره کړئ. راپور د وروستي اوږدمهاله سمولېشن په اوږدو کې د هر پمپ ځواک مجموعه کوي، نو ټول د چلولو وخت له 0 ډیر او یوه محاسبه غواړي. د هر پمپ لپاره دا لیست کوي: ٪ چلون، اغیز.، منځنی kW، لوړ kW، kWh، او لګښت. منځنی kW هغه منځنی دی کله چې پمپ چلیده، نه د بیکاره مودو په اوږدو کې. د جدول لاندې کارول شوې انرژي، د انرژۍ لګښت، لوړ ځواک کارول، د لوړې غوښتنې لګښت، او ټول لګښت دي. هغه شبکه چې پمپ نه لري هیڅ راپور نه لري.</p>';
$ec_lang['lpn_guide_en_set_term']='څه شمیرې ټاکي';
$ec_lang['lpn_guide_en_set_def']='<p>تنظیمات، انرژي د پمپ موثریت (سلنه) لري، چې هر پمپ لپاره کارول کیږي چې د موثریت منحنۍ نه لري، د یو کیلووات ساعت لپاره د ځواک بیه، د بیې نمونه چې د نمونې په هر ګام کې بیه ضربوي، د هر kW لپاره د لوړې غوښتنې چارج، او د «مروجه پیسه» متن چې د لګښتونو تر څنګ چاپیږي او لګښتونه نه بدلوي. پمپ کولی شي په ځانتیاوو کې خپله بیه، د بیې نمونه، او د موثریت منحنۍ ولري. بیې، نمونه، د لوړې غوښتنې چارج، د پمپ موثریت (سلنه)، او د پمپ خپل ارزښتونه د انرژۍ لګښت کټګورۍ کې دي، نو سناریو کولی شي دوی ځانګړي کړي. کله چې هیڅ بیه نه وي بیان شوې، یا بیه صفر وي، هر لګښت صفر دی او راپور دا وایي. غوښتنلیک هیڅ بیه نه وړاندیزوي.</p>';
$ec_lang['lpn_guide_en_example_def']='<p>د Net1 بېلګه پرانیزئ، چې ټول د چلولو وخت یې 24:00 دی، او محاسبه یې کړئ. اوبه، راپورونه، د پمپ انرژي غوره کړئ. Pump L9 د چلولو 65.71% د 75% موثریت سره چلیږي، او منځنۍ 96.22 kW، په لوړ کې 96.71 kW، او 1518 kWh کاروي. هیڅ بیه نه ده بیان شوې، نو لګښت 0 دی او راپور دا وایي. په تنظیمات، انرژي کې د ځواک بیې لپاره 0.12 ولیکئ، او بیا محاسبه کړئ: د L9 لګښت 182 دی، ټول لګښت.</p>';
// The Contour plot chapter (Task 785). Held by dev/lpn-spike/user-guide-contour-harness.js.
$ec_lang['lpn_guide_ct_what_term']='پلات څه دی';
$ec_lang['lpn_guide_ct_what_def']='<p>اوبه، ګرافونه، کانتور غوره کړئ. قطار پلات په پرانیستې سناریو کې روښانه کوي، د نرم ډکولو په توګه د لیبل شویو کرښو سره، فشار کاروي که نقطې لا رنګ شوې نه وي، او بکس پرانیزي. پلات د نقطو رنګونه د پایپونو په اوږدو کې او د منځنۍ پایپ اوږدوالي ټاکل شوي ضرب پورې د هغوی تر څنګ خپروي، د بهرنۍ برخې په اوږدو کې ورکیږي. دا د پمپونو، والوونو، یا تړل شویو تړاوونو په اوږدو کې رنګ نه کوي. د رنګ کیلي لاندې کرښه وایي پلات څو نقطې او پایپونه کاروي، د پایپونو تر څنګ رسیدل، او د کرښو وقفه. د ډیرو لږو نقطو سره، دا دا وایي.</p>';
$ec_lang['lpn_guide_ct_box_term']='بکس';
$ec_lang['lpn_guide_ct_box_def']='<p>کانتورونه ښودل، کله چې پاک وي، ډکول او کرښې پټوي او د نقطو رنګونه ساتي. بکس رنګ نقطې د او رنګ سکیم هم لري، چې په تنظیمات، انځورول، د نقطو رنګونه کې ورته دوه تنظیمات دي، ډکول (هیڅ، نرم، یا بانډونه، چې هر ټولګی ټوکر رنګ کوي)، د ډکولو شفافیت، د کرښو سره کانتور کرښې د هغوی وقفې او لیبلونو سره، او د منځنۍ پایپ اوږدوالي ضربونو کې بفر. په هغه پروژه کې چې په ځمکه کې ځای پر ځای شوې، بکس کولی شي د نقطو ترمنځ ځمکه د Mapbox DEM نه هم واخلي، وروسته له دې چې لیدونکی د شبکې د سیمې د ټایل شمیرو لیږلو سره موافقه وکړي. دا تنظیمات له پروژې سره ساتل کیږي او سناریو یې ځانګړي کولی شي. پلات یوازې ښودنه بدلوي، نه شبکه.</p>';
$ec_lang['lpn_guide_ct_example_def']='<p>د Net1 بېلګه پرانیزئ او اوبه، ګرافونه، کانتور غوره کړئ. نقطې د فشار له مخې رنګ شوي، او د رنګ کیلي لاندې کرښه 9 نقطې، 11 پایپونه، د منځنۍ پایپ اوږدوالي 2.5 چنده رسیدل د هغوی تر څنګ، او په هر 5 psi کې کرښې وايي. پمپ، Link 9، له 11 پایپونو نه یو نه دی. کله چې کانتورونه ښودل پاک وي، نقطې د فشار له مخې رنګ شوې پاتې کیږي.</p>';
// The Run report, Status changes, and Full report chapters (Task 785). Held by dev/lpn-spike/user-guide-reports-harness.js.
$ec_lang['lpn_guide_rr_what_term']='راپور څه لري';
$ec_lang['lpn_guide_rr_what_def']='<p>اوبه، راپورونه، چلول غوره کړئ. راپور هغه متن دی چې د EPANET انجن د وروستي اوږدمهاله سمولېشن لپاره لیکلی، په پاڼو کې. دا د بینر او د شبکې له نوم پیلیږي، بیا جنکشنونه، ذخیرې، ټانکونه، پایپونه، پمپونه، او والوونه شمیري، بیا د شننې اختیارونه بیانوي، او بیا د چلولو هایدرولیکي حالت د هغه خبرتیاوو سره لیست کوي. کاپي تڼۍ متن کاپي کوي.</p>';
$ec_lang['lpn_guide_rr_example_def']='<p>د Net1 بېلګه پرانیزئ، چې دمخه محاسبه شوې، او اوبه، راپورونه، چلول غوره کړئ. لنډیز 9 جنکشنونه، 1 ذخیره، 1 ټانک، 12 پایپونه، 1 پمپ، او 0 والوونه شمیري. د هیډ ضیاع فورمول Hazen-Williams دی، هایدرولیکي وخت ګام 1.00 hrs دی، او ټوله موده 24.00 hrs ده.</p>';
$ec_lang['lpn_guide_st_what_term']='څه لیست کیږي';
$ec_lang['lpn_guide_st_what_def']='<p>اوبه، راپورونه، د حالت بدلونونه غوره کړئ. هر قطار د بدلون وخت او بدلون ورکوي: پمپ، والو، یا پایپ اوس پرانیستی یا اوس تړل شوی، یا ټانک اوس ډکیږي، تش کیږي، ډک، یا تش. وخت ګام چې په بشپړ ډول همغږی نه شو هم لیست کیږي. لیست په وخت ترتیب کې دی او یوازې بدلونونه لري، نه هر ګام. دا له همدې اوږدمهاله چلولو نه لوستل کیږي لکه د جدولونو برخه او بشپړ راپور.</p>';
$ec_lang['lpn_guide_st_example_def']='<p>د Net1 بېلګه پرانیزئ او اوبه، راپورونه، د حالت بدلونونه غوره کړئ. Tank N2 اوس په 1:00 کې ډکیږي، په 11:00 کې تش کیږي، په 16:00 کې ډکیږي، او په 22:00 کې تش کیږي. Pump L9 اوس په 10:00 کې تړل شوی، په 15:00 کې پرانیستی، او په 21:00 کې تړل شوی دی.</p>';
$ec_lang['lpn_guide_fr_what_def']='<p>اوبه، راپورونه، بشپړ غوره کړئ. جدول د هر نقطې او تړاو لپاره په هر راپور وخت ګام کې یو قطار لري، د جدولونو برخې په واحدونو کې. کالمونه یې دا دي: ډول، ID، غوښتنه، هیډ، فشار، د کلورین غلظت، بهاو، سرعت، د هیډ ضیاع، د پمپ هیډ، او حالت، او حجره تشه ده چیرې چې شتمنۍ دا مقدار نه لري. د وخت ګام لیست هغه ګام ټاکي چې ښودل کیږي، او CSV ډاونلوډ او راپور چاپ هر ګام لري. پرته د اوږدمهاله سمولېشن، جدول اوسنی حل په یوې شېبې کې ښیي.</p>';
$ec_lang['lpn_guide_fr_example_def']='<p>د Net1 بېلګه پرانیزئ او اوبه، راپورونه، بشپړ غوره کړئ. 24 شتمنۍ په 25 راپور ګامونو کې لیست شوي، 0:00 تر 24:00، چې 600 قطارونه دي. په 0:00 کې، Junction 11 غوښتنه 150 gpm، هیډ 985.23 ft H2O، او فشار 119.26 psi لري.</p>';
// The Calibration chapter (Task 785). Held by dev/lpn-spike/user-guide-calibration-harness.js.
$ec_lang['lpn_guide_cal_what_term']='راپور څه پرتله کوي';
$ec_lang['lpn_guide_cal_what_def']='<p>اوبه، راپورونه، کالیبریشن غوره کړئ. د پارامیټر لیست هغه ټاکي چې فایل یې اندازه کوي: غوښتنه، هیډ، فشار، د کلورین غلظت، بهاو، یا سرعت. د هر پارامیټر لپاره یو فایل ساتل کیږي، او د کالیبریشن فایل پورته کول… تڼۍ د فایل غوره کوونکی پرانیزي. راپور درې پاڼې لري. احصایې د هر ځای لپاره د مشاهداتو شمېر، مشاهده شوی منځنی، محاسبه شوی منځنی، د منځنۍ تیروتنه، او RMS تیروتنه ورکوي، بیا د ټولو ځایونو لپاره Network قطار او د منځنیو ترمنځ همبستګي. د همبستګۍ پلات هر اندازه کول د هغې مشاهده شوي ارزښت په افقي او محاسبه شوي ارزښت په عمودي ځای کوي، د ډیاګونال کرښې سره چیرته چې دواړه سره برابر دي. د منځنیو پرتله د هر ځای لپاره د مشاهده شوي او محاسبه شوي منځنیو جوړه میلې رسموي.</p><p>محاسبه شوی ارزښت له اوږدمهاله چلولو لوستل کیږي، او د دوو راپور ګامونو ترمنځ اندازه کول د هغوی ترمنځ د انټرپولیټ شوي ارزښت سره پرتله کیږي. هغه اندازه کول چې د راپور شوي وختونو نه بهر وي پریښودل او شمیرل کیږي. د یوې شېبې حل سره، هر اندازه کول له همدې یوې پایلې سره پرتله کیږي، هر وخت چې فایل یې ورکوي. راپور وروسته له دې ډکیږي چې شبکه محاسبه شي.</p>';
$ec_lang['lpn_guide_cal_file_term']='د کالیبریشن فایل';
$ec_lang['lpn_guide_cal_file_def']='<p>متني فایل چې په هره کرښه کې د ځای ID، وخت، او اندازه شوی ارزښت لري. وخت د سمولېشن له پیل نه اندازه کیږي، په اعشاري ساعتونو یا ساعتونو:دقیقو. نیمه ټکی یو نظر پیلوي. هغه کرښه چې یوازې وخت او ارزښت لري هغه ځای ته تعلق لري چې پورته دی. ارزښتونه د پروژې په واحدونو کې لوستل کیږي، او راپور وایي کوم واحد. هغه ځای چې په شبکه کې نه وي لیست کیږي او اندازه کول یې پریښودل شمیرل کیږي، هغه کرښه چې نشي لوستل کیدی د کرښې شمېرې له مخې لیست کیږي، او د فایل پاتې برخه کارول کیږي. فایل د پرانیستې پروژې او دې پاڼې پورته کولو لپاره په حافظه کې ساتل کیږي. دا له پروژې سره یا په دې وسیله کې نه ساتل کیږي. کله چې د وخت لړۍ چارټ همدا مقدار ښیي، اندازه شوي ارزښتونه په هغې کې د حلقو په توګه رسمیږي.</p>';
$ec_lang['lpn_guide_cal_example_def']='<p>د Net1 بېلګه پرانیزئ، محاسبه یې کړئ، او اوبه، راپورونه، کالیبریشن غوره کړئ. د فشار په ټاکلو سره، یو فایل پورته کړئ چې Junction 11 په 0:00 کې 118.5 psi او په 12:00 کې 121.0 psi، Junction 31 په 6:00 کې 110.2 psi او په 18:00 کې 108.7 psi، او Junction 99 په 0:00 کې 50 psi ورکوي، چې وروسته یې یوه کرښه ده چې معلومات نه ده. راپور وایي فایل په 3 ځایونو کې 5 اندازه کول لري، Junction 99 د 1 پریښودل شوې اندازه کولو سره چې په شبکه کې نه دی نومي، او ناخوانده کرښه لیست کوي. احصایې Junction 11 د 2 مشاهداتو، مشاهده شوي منځني 119.75 psi، محاسبه شوي منځني 116.53 psi، منځنۍ تیروتنه 3.98، او RMS تیروتنه 5.12 سره ښیي. Junction 31 109.45، 118.71، 9.26، او 9.79 لري. Network قطار 4 مشاهدې، منځنۍ تیروتنه 6.62، او RMS تیروتنه 7.81 لري.</p>';
// Where the Guide lists its own keys, so that a search for one finds it.
$ec_lang['lpn_guide_using_heading']='د لارښود کارول';
$ec_lang['lpn_guide_keys_term']='د لارښود د کیبورډ لنډلارې';
$ec_lang['lpn_guide_keys_def']='<table class="lpn-notes-table"><tbody><tr><td>?</td><td>د کاروونکي لارښود د اوزارپټې تڼۍ یا مینو قطار کې پرانیزئ چې د پوینټر لاندې دی یا فوکس لري. بل ځای کې، یې د لټون ساحې ټاکل شوې سره پرانیزئ. کیلي یې نه پرانیزي کله چې ساحه کې لیکل کیږي یا پوښتنه پرانیستې وي.</td></tr><tr><td>F1</td><td>د کاروونکي لارښود هغه بکس ننوتنې کې پرانیزئ چې فوکس لري.</td></tr><tr><td>Ctrl+K</td><td>د کاروونکي لارښود د لټون ساحې ټاکل شوې او هر ټاکل شوي متن سره، تر 80 حروفو پورې، پکې پرانیزئ. دا د براوزر خپل Ctrl+K ځای ناستی کوي، پرته له هغه مهال چې پوښتنه پرانیستې وي، کله چې د کاروونکي لارښود نه پرانیستل کیږي.</td></tr><tr><td>/</td><td>کله چې د کاروونکي لارښود فوکس لري د لټون ساحه وټاکئ.</td></tr><tr><td>Esc</td><td>کله چې د کاروونکي لارښود فوکس لري، یې وتړئ او فوکس هغه ځای ته راګرځوئ چیرته چې و.</td></tr></tbody></table>';
$ec_lang['lpn_guide_use_term']='لټون، لینکونه، او څه یادیږي';
$ec_lang['lpn_guide_use_def']='<p>لټون لوی توري او لهجې له پامه غورځوي او هغه قطارونه او ننوتنې لیست کوي چې لیکل شوی متن لري. قطار غوره کول ښیي چې دا کنټرول چیرته دی. دا هیڅکله کنټرول نه چلوي. په تلیفون کې، چیرې چې اوزارپټه پټه ده، د اوزارپټې قطار هغه مینو قطار پرانیزي چې ورته کار کوي.</p><p>د پاڼې پته هغه ننوتنه تعقیبوي چې لوستل کیږي، لکه <code>Looped-Network.php#guide</code>، نو دا د هغې ننوتنې لینک په توګه کاپي کیدی شي. د کاروونکي لارښود تړل یې پاکوي. د کاروونکي لارښود په دې براوزر کې یادوي چې ایا پرانیستی و، د هغې ځای او اندازه، او ایا د منځپانګې لیست پټ دی. په تلیفون کې د منځپانګې لیست پټ پیلیږي.</p>';
// Under a toolbar button in the User guide, naming the menu row that does the same thing.
// {menu} becomes a path such as "Edit > Delete", drawn with chevrons; keep {menu} as it is.
$ec_lang['lpn_guide_also']='په {menu} کې هم';
$ec_lang['lpn_guide_how_popup']='کله چې شتمني یا متن وټاکئ، ځانتیاوې پرانیستل کیږي.';
$ec_lang['lpn_guide_not_shown']='دا کنټرول اوس مهال پر سکرین نشته.';
// The box's two context headings. "Tables" holds the two table-help entries that used to sit only
// in the Notes list (lpn_notes_6/7, moved rather than duplicated); "Map" is new -- the digit tool
// keys, Undo and the zoom keys had never been gathered anywhere before.
$ec_lang['lpn_hotkeys_tables_heading']='جدولونه';
$ec_lang['lpn_hotkeys_map_heading']='نقشه';
$ec_lang['lpn_hotkeys_map_term']='د نقشې د کیبورډ شارټکټونه';
// Same shape as lpn_notes_7_def: one table, one row per key. The ten digits are LPN_TOOL_KEYS in
// js/looped-network.js; Select also answers to Esc and Delete to the Delete key
// (LPN_TOOL_ALT_KEYS); Ctrl+Z is undo(); +/- and = are keyZoom() (ROADMAP Task 682).
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>0 یا Esc</td><td>ټاکل.</td></tr><tr><td>2</td><td>یو جنکشن زیاتول.</td></tr><tr><td>3</td><td>یو ذخیره زیاتول.</td></tr><tr><td>4</td><td>یو ټانک زیاتول.</td></tr><tr><td>5</td><td>یو پایپ زیاتول.</td></tr><tr><td>6</td><td>یو پمپ زیاتول.</td></tr><tr><td>7</td><td>یو والو زیاتول.</td></tr><tr><td>8</td><td>یو پیرودونکی زیاتول.</td></tr><tr><td>9</td><td>متن زیاتول.</td></tr><tr><td>Delete</td><td>ټاکنه ړنګول.</td></tr><tr><td>Ctrl+Z</td><td>وروستی بدلون بیرته کول.</td></tr><tr><td>+ یا =</td><td>لوی کول.</td></tr><tr><td>-</td><td>کوچنی کول.</td></tr></tbody></table>';
// The W row of the Map table. Its own key, spliced into the table by Looped-Network.php, because a new row in
// lpn_hotkeys_map_def is new markup that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_zoomwin_def']='د زوم کړکۍ: په نقشه کې یو مستطیل راکاږئ ترڅو پر هغه ساحه زوم شي.';
// The menu chords (Task 748): Alt+Shift+letter on Windows and Linux, Ctrl+Option on a Mac, and F10.
// Exactly two rows (Tom, 2026-10-03: "show only the Alt+Shift and the F10"); the letters themselves
// are assigned per language by menuMnemonics() and shown on the menus, never listed here.
// A separate block rather than rows in lpn_hotkeys_map_def, because a new row there is new markup
// that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_menu_heading']='مینوګانې';
$ec_lang['lpn_hotkeys_menu_term']='د مینو د کیبورډ شارټکټونه';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+توری</td><td>هغه مینو چې دا توری لري پرانیزئ، بیا د کومې کرښې توری فشار کړئ ترڅو هغه غوره شي. توري هغه مهال ښکاري چې تاسو کیبورډ کاروئ. په Mac کې Ctrl+Option وکاروئ.</td></tr><tr><td>F10</td><td>د مینو پټې ته تلل.</td></tr></tbody></table>';
// The Screenshot keys. A separate block, for the reason given above the menu block.
$ec_lang['lpn_hotkeys_snip_heading']='سکرین شاټ';
$ec_lang['lpn_hotkeys_snip_term']='د سکرین شاټ د کیبورډ شارټکټونه';
$ec_lang['lpn_hotkeys_snip_def']='<table class="lpn-notes-table"><tbody><tr><td>S</td><td>غوڅول، کله چې سکرین شاټ پرانیستی وي.</td></tr><tr><td>E</td><td>پاکوونکی، د نښه کولو لید کې.</td></tr><tr><td>Ctrl+Z, Ctrl+Y</td><td>بېرته کول او بیا کول، د نښه کولو لید کې.</td></tr><tr><td>Esc</td><td>غوڅول لغوه کول، یا له مبول نه وتل. د نښه کولو لید کې، کله چې هیڅ شی رسم شوی نه وي بند یې کړئ.</td></tr></tbody></table>';
// ---- "Something wrong here?" (ROADMAP Tasks 207 and 768) ----
// Two sites, one behaviour -- a standing cell in the map's bottom strip, and the same control inside
// the solver's diagnostic box when one is on screen. The first click opens a box; Send is the second.
// The thank-you must never imply an answer: a reply comes only to somebody who left an address.
$ec_lang['lpn_wrong_btn']='دلته یو شی غلط دی؟';
// The standing message's own Hide control. A hidden message leaves the map and waits as the top row of the
// message history (the down-arrow glyph), marked by lpn_msglog_hidden, with lpn_msglog_unhide to bring it back.
$ec_lang['lpn_msglog_hidden']='پټ';
$ec_lang['lpn_msglog_unhide']='ښودل';
$ec_lang['lpn_status_hidden_tip']='پټ پیغام بیا په نقشه کې وښیئ.';
// Rewritten for the two-click box (Task 768); TGH's 2026-09-07 wording described one press.
$ec_lang['lpn_wrong_tip']='په دې پاڼه کې یوه تېروتنه راپور کړئ. دا یو بکس پرانیزي چې ستونزه وټاکئ، نظر اضافه کړئ، او که ځواب غواړئ بریښنالیک پته ولیکئ. ټولې ساحې اختیاري دي، او تر هغه چې لیږل فشار نه کړئ هیڅ نه لیږل کیږي.';
$ec_lang['lpn_wrong_thanks']='مننه. دا موږ ته ورسیده.';
// The box "Something wrong here?" opens (ROADMAP Task 768). Every field is optional; Send with
// nothing in it posts only the anonymous tally the button always posted. The four picks are canned
// phrases a visitor may toggle in any combination. lpn_fb_sends must stay true to send-feedback.php
// and to the "Messages you send us" row of privacy.php.
$ec_lang['lpn_fb_intro']='چمتو شوي پیغامونه (اختیاري). تر هغه چې لیږل نه وي فشار شوي، هیڅ نه لیږل کیږي.';
$ec_lang['lpn_fb_pick_numbers']='شمېرې غلطې ښکاري';
$ec_lang['lpn_fb_pick_broken']='یو شی کار ونه کړ';
$ec_lang['lpn_fb_pick_wording']='الفاظ یا ژباړه غلطه ده';
$ec_lang['lpn_fb_pick_confusing']='دا ګډوډوونکی دی';
$ec_lang['lpn_fb_comment']='نظرونه (اختیاري)';
$ec_lang['lpn_fb_email']='بریښنالیک (اختیاري، یوازې که ځواب غواړئ)';
$ec_lang['lpn_fb_sends']='دا څه لیږي: د دې پاڼې نوم، ستاسو ژبه، د سایټ نسخه، په نقشه کې د پیغام کوډ که شتون ولري، او هغه څه چې تاسو وټاکل یا ولیکل. هیڅکله ستاسو رسم یا شبکه نه. ستاسو بریښنالیک پته یوازې تاسو ته د ځواب ورکولو لپاره کارول کیږي.';
$ec_lang['lpn_fb_send']='لیږل';
$ec_lang['lpn_fb_sending']='لیږل کیږي…';
$ec_lang['lpn_fb_failed']='دا موږ ته ونه رسیده. هغه څه چې تاسو لیکلي دلته لا هم شته، نو بیا هڅه کولی شئ.';
$ec_lang['lpn_fb_bad_email']='دا بریښنالیک پته سمه نه ښکاري. یې سمه کړئ، یا یې خالي پرېږدئ.';
$ec_lang['lpn_fb_busy']='په تیرو څو دقیقو کې ډېر پیغامونه راغلي دي. هغه څه چې تاسو لیکلي دلته لا هم شته، نو وروسته بیا هڅه کولی شئ.';
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
$ec_lang['lpn_ex_basic_si_desc']='دوې ذخیرې، یو پمپ، او یوه کوچنۍ حلقه. لیتر په ثانیه کې، له متره او ملي متره سره.';
$ec_lang['lpn_ex_basic_us_title']='بنسټیزه شبکه، gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='دوې ذخیرې، یو پمپ، او یوه کوچنۍ حلقه. ګالن په دقیقه کې، له فوټه او انچه سره.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 د قاعدې پر بنسټ کنترولونو سره';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='د EPANET یوه فرضي بېلګه له کلورین، 1 ذخیرې او 1 ټانک سره.';
$ec_lang['lpn_ex_net1_si_title']='EPANET Net1 د قاعدې پر بنسټ کنترولونو سره، L/s (SI)';
$ec_lang['lpn_ex_net1_si_desc']='لیتر په ثانیه کې، له متره او ملي متره سره. د EPANET یوه فرضي بېلګه چې له ګالن په دقیقه کې، فوټ او انچ نه اړول شوې، له کلورین، 1 ذخیرې، 1 ټانک، 1 پمپ او د قاعدې پر بنسټ دوه کنترولونو سره.';
$ec_lang['lpn_ex_net2_si_title']='EPANET Net2, L/s (SI)';
$ec_lang['lpn_ex_net2_si_desc']='لیتر په ثانیه کې، له متره او ملي متره سره. د EPANET بېلګه د Branford، Connecticut په ښار کې، چې له ګالن په دقیقه کې، فوټ او انچ نه اړول شوې: 35 جنکشنونه او 1 ټانک، پرته له ذخیرې، پمپ او والوونو، شاوخوا 2 km په 4 km. فلورایډ، یوه غیر عکس العمله مواد، په یوه سرچینه کې ننوځي.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2, gpm (US)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='ګالن په دقیقه کې، له فوټه او انچه سره. د EPANET بېلګه د Branford، Connecticut په ښار کې: 35 جنکشنونه او 1 ټانک، پرته له ذخیرې، پمپ او والوونو، شاوخوا 1 مایل په 2 مایله. فلورایډ، یوه غیر عکس العمله مواد، په یوه سرچینه کې ننوځي.';
$ec_lang['lpn_ex_net3_si_title']='EPANET Net3, L/s (SI)';
$ec_lang['lpn_ex_net3_si_desc']='لیتر په ثانیه کې، له متره او ملي متره سره. د EPANET بېلګه د Novato، California په ښار کې، چې له ګالن په دقیقه کې، فوټ او انچ نه اړول شوې، د نړۍ نقشې سره شاته: 92 جنکشنونه، 3 ټانکونه، او 2 ذخیرې، پرته له والوونو، شاوخوا 8 km څلور ګوني. د 24 ساعتونو اوږد مهاله سمولېشن، له Lake څخه د سرچینې تعقیب سره.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3, gpm (US)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='ګالن په دقیقه کې، له فوټه او انچه سره. د EPANET بېلګه د Novato، California په ښار کې، د نړۍ نقشې سره شاته: 92 جنکشنونه، 3 ټانکونه، او 2 ذخیرې، پرته له والوونو، شاوخوا 5 مایل څلور ګوني. د 24 ساعتونو اوږد مهاله سمولېشن، له Lake څخه د سرچینې تعقیب سره.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center, gpm (US)';
$ec_lang['lpn_ex_elm_street_desc']='ګالن په دقیقه کې، له فوټه او انچه سره. Prescott Valley، Arizona: 17 جنکشنونه، 1 ذخیره، او 1 پمپ. یو سوداګریز ځای چې د اعظمي ورځنۍ غوښتنې له پاسه د اور مړولو بهاو لپاره، په یوه شیبه کې، د ساحې د پلان پر سر رسم شوی حل شوی دی.';
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
$ec_lang['lpn_status_reinterpreted']='ارزښتونه ({n}) اوس {unit} معنی لري. هیڅ شی بیا لیکل شوی نه دی.';
$ec_lang['lpn_status_converted']='ارزښتونه ({n}) {unit} ته بیا ولیکل شول.';
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
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='په دې نقطه کې د اوبو پوټنشیل انرژي، د اوبو د ستن د لوړوالي په توګه لیکل شوې. دا مطلق لوړوالی دی، پداسې حال کې چې فشار د ګیج اندازه ده.';
// A tank's depth and usable volume (Task 783). Depth is head minus the tank bottom, which is our
// Elevation. Volume is zero at the Lowest water depth, so it is NOT EPANET's tank volume, which also
// counts the water below the lowest water depth (that water is in the mixing volume, it just cannot be drawn down).
$ec_lang['lpn_result_depth']='ژوروالی';
$ec_lang['lpn_result_depth_tip']='په ښودل شوې شېبه کې په ټانک کې د اوبو ژوروالی، د ټانک له تل څخه پورته اندازه شوی: هیډ منفي د ټانک لوړوالی.';
$ec_lang['lpn_result_tank_volume']='شتون لرونکی حجم';
$ec_lang['lpn_result_tank_volume_tip']='د ټیټ ترین اوبو ژوروالي پورته د اوبو حجم، نو په هغه ژوروالي کې صفر دی. د EPANET د ټانک حجم هغه اوبه هم لري چې د ټیټ ترین اوبو ژوروالي لاندې دي، چې بیا هم د مخلوط کیدو او د اوبو عمر برخه ګڼل کیږي، نو د ټانک لوړوالی د ټانک په تل کې پاتې کیږي.';
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
$ec_lang['lpn_basemap_topo_show']='ټوپو نقشه ښودل';
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
// and not georeferenced". lat/lon is one EPSG system (EPSG:4326), not a fourth case; EPSG:3857 is a
// projected system in meters since Task 775.
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
$ec_lang['lpn_tool_add_chain_tip']='د جنکشنونو او پایپونو ځنځیر: د جنکشن اضافه کولو لپاره په نقشه کې یو ټکی وټاکئ، بیا د پایپ او جنکشن اضافه کولو لپاره هر راتلونکی ټکی وټاکئ. د دوام لپاره یوه موجوده نقطه وټاکئ. ځنځیر پای ته رسولو لپاره Escape ووهئ.';
// The Shape tool (Task 779). The word is Tom's: "we call it a 'Shape'".
$ec_lang['lpn_tool_add_shape']='شکل';
$ec_lang['lpn_tool_add_shape_tip']='په نقشه کې یو ټکی، یو څو کرښه (polyline)، یا یو څو ضلعي رسم کړئ. شکل یادونه ده او د شبکې برخه نه ده. هر ټکی وټاکئ، بیا وروستی ټکی بیا وټاکئ، Enter ووهئ، یا د پای ته رسولو لپاره ښي کلیک وکړئ. لومړی ټکی بیا وټاکئ ترڅو شکل په یوه څو ضلعي بند شي.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='د ساحې ټاکل: کړکۍ/لاسو/څو ضلعي.';
$ec_lang['lpn_area_selected']='{n} ټاکل شول.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='په دې ساحه کې هیڅ ونه موندل شول.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='د پایپ قلمي نقطې اضافه او لرې کړئ. د قلمي نقطې د اضافه کولو لپاره پر پایپ یو ټکی وټاکئ، د لرې کولو لپاره قلمي نقطه وټاکئ، او د خوځولو لپاره یې راکاږئ. قلمي نقطه خپلکاره اوږدوالی بدلوي، خو ځایی (کوچنۍ) ضیاع نه زیاتوي یا نه بدلوي.';
$ec_lang['lpn_tool_undo_tip']='د بېرته کولو تاریخچې اوږدوالی = 20 کړنې';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='ټوله شبکه د نقشې کړکۍ ته برابره کړئ. د زوم کړکۍ لپاره، پرته له لومړي برابرولو، W ووهئ یا د زوم برابرولو ټول‌بار تڼۍ په کونج کې کوچنی مثلث کلیک کړئ. د نقشې ښي پورته زوم کنټرولونه هم وګورئ.';
$ec_lang['lpn_tool_zoom_selection_tip']='ټاکل شوې شتمنۍ د نقشې کړکۍ ته برابرې کړئ. لومړی یوه یا څو شتمنۍ وټاکئ.';
$ec_lang['lpn_tool_zoom_window_tip']='کونجونه وټاکئ یا یو مستطیل راکاږئ. د برابرولو زوم لپاره بیا ووهئ.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='زوم زیات کړئ. لنډلار: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='زوم کم کړئ. لنډلار: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='ساده یا پیچلی لټون او بدلول';
// **"Toolbar"** (Tom renamed it from "Toolbar key" to "Toolbar" on 2026-09-30).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. The row earns its place.
$ec_lang['lpn_help_icons']='د ټول‌بار آیکونونه';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='لیدنه';
$ec_lang['lpn_color_legend_open_tip']='د رنګ کولو تنظیمات پرانیستلو او دا رنګونه بدلولو لپاره فشار کړئ.';
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
$ec_lang['lpn_color_criterion_note']='دا طریقه خپلې پولې د ډیزاین له معیار څخه اخلي، نو تر هغه چې دا طریقه ټاکل شوې وي، د رنګونو شمېر ثابت دی.';
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
$ec_lang['lpn_pane_popout']='په بکس کې پرانیستل';
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
// Added to the filtered table's line (Task 738): rows edited since Filter in table was pressed stay
// in the table even when they no longer match, dimmed and marked, until it is pressed again. {n} is
// how many. Worded as a label and a count so no plural form is needed.
$ec_lang['lpn_pane_filter_stale']='هغه قطارونه چې نور نه سمون خوري: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='په دې جدول کې هیڅ شی له فلټر سره سمون نه خوري.';
// Selection only (Task 757): the Tables pane filtered to what is selected on the map. Parallel to
// lpn_pane_filter_note. The line names the Find filter too when both are on.
$ec_lang['lpn_pane_filter_sel_note']='یوازې ټاکل شوي. {all} څخه {n} ښودل کیږي.';
$ec_lang['lpn_pane_filter_sel_and']='د {q} او یوازې ټاکل شویو له مخې چاڼ شوی. {all} څخه {n} ښودل کیږي.';
$ec_lang['lpn_pane_filter_sel_none']='له ټاکل شویو عنصرونو هیڅ یو په دې جدول کې نشته.';
$ec_lang['lpn_pane_sel_only']='یوازې ټاکل شوي';
$ec_lang['lpn_pane_sel_only_none']='هیڅ عنصر نه دی ټاکل شوی. لومړی په نقشه کې عنصرونه وټاکئ.';
// Show scenarios (Tom, 2026-10-05): the table's cell menu switch that lists every asset once per
// scenario, with a Scenario column after ID.
$ec_lang['lpn_pane_scn_show']='سناریوګانې ښودل';
// Two switches on the cell menu while Show scenarios is on (Tom, 2026-10-07): keep only the rows whose
// scenario holds a value of its own in this table, and keep only the open scenario's rows.
$ec_lang['lpn_pane_scn_ov_only']='یوازې ځانګړي ارزښتونه';
$ec_lang['lpn_pane_scn_cur_only']='یوازې اوسنۍ سناریو';
$ec_lang['lpn_pane_inactive_show']='غیرفعاله ټوپولوژي شامل کړئ';
// The line above a table while either switch is on, beside the filter's own Show all. {filters} is one
// or both of the two switch names, joined by a comma; {n} the rows showing, {all} the rows without them.
$ec_lang['lpn_pane_scn_filter_note']='{filters}. {all} نه {n} ښودل کیږي.';
// The cell menu's item that removes the selected cells' scenario overrides, so each reads what its
// scenario inherits (Tom, 2026-10-06). Greyed when no selected cell holds one.
$ec_lang['lpn_ovm_child_ask']='د فرعي ځانګړو ارزښتونو پاکول ({n} ټول)؟';
$ec_lang['lpn_ovm_child_tip']='فرعي سناریوګانې دا ارزښت ځانګړی کوي ({n} ټول). د دوی ځانګړي ارزښتونو پاکولو لپاره کلیک وکړئ.';
$ec_lang['lpn_ovm_dot_clear']='د پاکولو لپاره کلیک وکړئ.';
$ec_lang['lpn_ovm_dot_set']='میراثي. په دې سناریو کې یې د ځانګړي ارزښت جوړولو لپاره کلیک وکړئ، د ښودل شوي ارزښت سره.';
$ec_lang['lpn_pane_clear_override']='خپل ارزښت پاکول';
// The tip on a table cell holding a value set in its row's scenario (Tom, 2026-10-06: "Demand alt.:
// Max day"). {category} is an lpn_alt_cat_* name; {alternative} is the alternative's name, which
// in Basic mode is its scenario's.
$ec_lang['lpn_pane_scn_alt_tip']='{category} بدیل: {alternative}';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='زوم او ټاکل';
$ec_lang['lpn_goto_on_map']='پر نقشه ښودل';
$ec_lang['lpn_pane_select_on_map']='پر نقشه ټاکل';
$ec_lang['lpn_pane_unselect_on_map']='پر نقشه له ټاکنې ایستل';
$ec_lang['lpn_pane_print']='جدول چاپ کړئ';
// Tom, 2026-10-06. Copy with headings puts the heading line, unit included, above the selected cells; plain
// Copy never does. The two Export rows download the whole table as shown.
$ec_lang['lpn_pane_copy_heads']='د ستون سرلیکونو سره کاپي';
// Tom, 2026-10-07. File, Export to, ODS/XLSX/CSV file: a box asking which tables and which scenarios.
// {format} is ODS, XLSX or CSV, the file format's own name, never translated.
$ec_lang['lpn_export_table_title']='{format} ته صادرول';
$ec_lang['lpn_export_table_current']='اوسنی';
$ec_lang['lpn_export_table_all']='ټول';
$ec_lang['lpn_export_table_go']='صادرول';
$ec_lang['lpn_export_table_scn_note']='پایلې یوازې د وروستۍ محاسبه شوې سناریو لپاره صادریږي.';

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
// Water > Morph (Task 781; Tom, 2026-10-14: *"I like the term 'Morph' (Transform) for this feature"*;
// first built as Change type, Tom, 2026-10-05: *"It would be nice to provide a tool under Water or Tables
// to Change node type for any asset, where if it has information that can't be ported to the new
// type, we alert and ask."*). The fly-out reuses lpn_tool_add_junction/_reservoir/_tank. The box it
// asks in lists one line per value lost: {id} is the asset's ID, {property} a field label the
// popup already uses, {value} the number or name with its unit, {scenario} a scenario's name.
// dev/asset-type.md.
$ec_lang['lpn_morph_menu']='ډول بدلول';
$ec_lang['lpn_morph_tip']='ټاکل شوې نقطې په جنکشنونو، ذخیرو، یا ټانکونو بدل کړئ، یا ټاکل شوي تړاوونه په پایپونو، پمپونو، یا والوونو. هر یو خپل ID، خپل ځای، خپل اړیکې، او هر هغه ارزښت ساتي چې نوی ډول هم لري. که کوم شی له لاسه ورکول کیږي، لومړی ستاسو څخه پوښتل کیږي.';
$ec_lang['lpn_morph_ok']='بدلول';
// {ids} lists the selected assets of the other kind (nodes when a link type was chosen, and links
// when a node type was chosen), separated by commas.
$ec_lang['lpn_morph_other_kind']='نقطه یوازې بل ډول نقطې ته او تړاو یوازې بل ډول تړاو ته بدلیدی شي. نه بدل شو: {ids}';
// The Properties row shown where a scenario morphs the asset (Task 781): the type it is in this
// scenario, beside the override marker.
$ec_lang['lpn_field_type_tip']='په دې سناریو کې د دې شتمنۍ ډول، چې د ډول بدلول په واسطه ټاکل شوی. د مورنۍ سناریو ډول کارولو لپاره ځانګړی ارزښت پاک کړئ.';
$ec_lang['lpn_change_type_lost']='دا ارزښتونه به له لاسه ورکړل شي:';
// The key to the lines under it (Tom, 2026-10-06: *"Provide a key for the loss report. 'ID: Lost entry'."*).
$ec_lang['lpn_change_type_key']='هر قطار: ID: هغه ځانتیا او ارزښت چې له لاسه به ورکړل شي';
$ec_lang['lpn_change_type_line']='{id}: {property} {value}';
$ec_lang['lpn_change_type_line_scenario']='{id}: {property} {value}، په سناریو {scenario} کې';
$ec_lang['lpn_change_type_line_alternative']='{id}: {property} {value}، په بدیل {alternative} کې';
$ec_lang['lpn_change_type_more']='او {n} نور.';
// Heads the lines a tank-to-reservoir or reservoir-to-tank change states rather than loses: the
// water surface is carried, so the new head or water depth is listed with its value.
$ec_lang['lpn_change_type_surface']='دا د اوبو سطحه هماغسې ساتي لکه چې وه. د ذخیرې هیډ د ټانک لوړوالی او د هغه د اوبو ژوروالی سره یوځای دی، او د ټانک د اوبو ژوروالی د ذخیرې هیډ منفي د ټانک لوړوالی دی:';
$ec_lang['lpn_change_type_meaning']='دا کنټرولونه او قاعدې هغه نقطه ازمويي چې بدلیږي، او ممکن یې بل ډول ولولي: جنکشن په خپل فشار ازمویل کیږي، او ټانک یا ذخیره په خپل د اوبو په کچه:';
// The link half (Tom, 2026-10-06: "Proceed."). Each heads a list of "ID: entry" lines.
$ec_lang['lpn_change_type_born']='دا ارزښتونه نوي دي، لکه په نوي رسم شوې شتمنۍ کې ټاکل شوي:';
$ec_lang['lpn_change_type_no_curve']='{id}: د پمپ هیډ منحنۍ نشته، نو پمپ هیڅ هیډ نه زیاتوي تر هغه چې یوه ونه ټاکل شي، او د .inp صادرول یې د پایپ په توګه لیکي';
$ec_lang['lpn_change_type_becomes']='{id}: {property} {value}، په سناریو {scenario} کې، {new} کیږي';
$ec_lang['lpn_change_type_customers']='یوازې پایپ مشتریان خدمتوي، نو دا مشتریان پر ځای یې په هغه نقطې پورې وصل کیږي چې په قوسونو کې ښودل شوې، چیرې چې د دوی غوښتنه لا دمخه پلي شوې ده. دوی هماغه ځای پاتې کیږي چیرې چې رسم شوي دي، او د دوی غوښتنه نه بدلیږي:';
$ec_lang['lpn_change_type_setting']='دا کنټرولونه او قاعدې د هغه تړاو ترتیب ورکوي یا ازمويي چې بدلیږي. ترتیب په پایپ، پمپ، او والو کې بېل مقدار دی، نو دا به یې بیا بل ډول ولولي:';
$ec_lang['lpn_change_type_rules']='دا د قاعدې کرښې یو تړاو د هغه د ډول په واسطه نوموي، او پر ځای یې به د هغه نوی ډول ونوموي:';
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
$ec_lang['lpn_settings_auto_run_tip']='که بیا محاسبه ډېره ورو وي بند یې کړئ. کله چې دا فعاله وي، د محاسبه کول تڼۍ پټه ده.';
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
// Copy and Paste properties (Task 782; Tom, 2026-10-12: a clipboard, no confirmation). Identity and
// placement are never pasted.
$ec_lang['lpn_copy_props_menu']='ځانتیاوې کاپي کول';
$ec_lang['lpn_copy_props_done']='د {id} ځانتیاوې کاپي شوې.';
$ec_lang['lpn_copy_props_no_overrides']='د کاپي کولو لپاره ځانګړي ارزښتونه نشته.';
$ec_lang['lpn_copy_props_done_ov']='په دې سناریو کې د {id} ځانګړي ارزښتونه کاپي شول.';
$ec_lang['lpn_paste_alt_created']='د دې سناریو لپاره {category} بدیل {name} جوړ شو.';
$ec_lang['lpn_paste_props_menu']='ځانتیاوې ټاکنې ته پیسټ کول';
$ec_lang['lpn_paste_props_off_none']='هیڅ نه دي کاپي شوي. پر شتمنۍ ښي کلیک وکړئ یا اوږد فشار ورکړئ او ځانتیاوې کاپي کول غوره کړئ.';
$ec_lang['lpn_paste_props_off_select']='هغه شتمنۍ وټاکئ چې ورته پیسټ کوئ، بیا ځانتیاوې ټاکنې ته پیسټ کول غوره کړئ.';
$ec_lang['lpn_paste_props_off_kind']='هیڅ ټاکل شوې شتمني کاپي شوې ځانتیاوې نشي منلی.';
$ec_lang['lpn_tsb_menu']='د وخت لړۍ ګراف';
// The map's right-click (and long press) menu on a Text and on a dragged label (2026-10-14). Edit text
// opens the in-place editor; Reset position sends a dragged label or an attached Text home.
$ec_lang['lpn_ctx_edit_text']='متن سمونول';
$ec_lang['lpn_ctx_reset_position']='ځای بیرته ټاکل';
$ec_lang['lpn_ctx_reset_position_off_tip']='یوازې لیبل یا نښلول شوی متن چې له خپل ځای نه ایستل شوی بیرته ټاکل کیدی شي.';
$ec_lang['lpn_tsb_off_tip']='د اوږدمهاله سمولېشن پایلې غواړي. په تنظیمات، محاسبه، وخت کې ټول د چلولو وخت وټاکئ او محاسبه کړئ.';
$ec_lang['lpn_tsb_close']='ګراف بندول';
$ec_lang['lpn_tsb_resize']='د اندازې بدلولو لپاره راکاږئ';
$ec_lang['lpn_tsb_quantity']='د ګراف مقدار';
$ec_lang['lpn_tsb_max']='مخکې له بل پرانیستلو یو ګراف وتړئ. تر {n} پورې پرانیستي پاتې کیږي.';
$ec_lang['lpn_paste_done_one']='د {id} ځانتیاوې {to} ته پیسټ شوې. بدل شوي ارزښتونه: {n}.';
$ec_lang['lpn_paste_done_many']='د {id} ځانتیاوې {m} شتمنیو ته پیسټ شوې. بدل شوي ارزښتونه: {n}.';
$ec_lang['lpn_paste_skip_breakdown']='نه پیسټ شو: {n} (غوښتنه د کټګوریو لیست دی).';
$ec_lang['lpn_paste_skip_valve']='نه پیسټ شو: {n} (د والو ډولونه توپیر لري).';
$ec_lang['lpn_find_title']='لټون او ځای پرځای کول';
$ec_lang['lpn_find_scope']='څه ولټول شي';
$ec_lang['lpn_find_scope_all']='هرڅه';
$ec_lang['lpn_find_scope_source']='سرچینه';
$ec_lang['lpn_find_source_no_chemical']='هیڅ کیمیاوي مواد نه رهیابي کیږي، نو هیڅ نقطه سرچینه نه لري.';
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
// A result row prints the NARROWEST condition true of that node beside its id, because "no links"
// says more than "no open path to a source" and both are true of the same node. It prints the
// SAME four keys above with the first letter capitalized in code (findConnLabel()), not a second
// capitalized copy of each (Task 699, Tom 2026-09-30: "do the Find redesign").
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
$ec_lang['lpn_replace_asked']='د نقطو ({n}) لپاره لوړوالي وغوښتل شول. کله چې ترلاسه شي پایلې ښکاره کیږي.';
$ec_lang['lpn_replace_btn']='ځای پرځای کول';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='شتمنۍ ({n}) بدلې شي؟';
$ec_lang['lpn_replace_apply']='دوی بدل کړئ';
$ec_lang['lpn_replace_done']='بدلې شوې شتمنۍ: {n}. دا په یوه ګام کې بېرته کیدی شي.';
$ec_lang['lpn_replace_none']='هیڅ به نه بدلیږي.';
$ec_lang['lpn_replace_no_value']='نوی ارزښت ولیکئ.';
$ec_lang['lpn_replace_scope']='پورته یو ډول عنصر وټاکئ ترڅو د هغه ارزښتونه بدل کړئ.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='پروفایل';
$ec_lang['lpn_graphs_menu']='ګرافونه';
// **THE SYNONYMS ARE IN dev/plain-sentences.md, THE CHANNEL MEANT FOR THEM.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission a plain sentence requires. Same text, correct channel.
$ec_lang['lpn_profile_title']='د یوې لارې پروفایل';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='هغه نقطه وټاکئ چیرته چې لار پیلیږي.';
$ec_lang['lpn_profile_draw_more']='د لارې کتلو لپاره پر نقشه خوځئ. د اضافه کولو لپاره یوه نقطه وټاکئ. د پای ته رسولو لپاره دوه ځله کلیک وکړئ. Esc لغوه کوي.';
$ec_lang['lpn_profile_draw_blocked']='له {a} نه تر {b} پورې هیڅ لار نشته. بله نقطه وټاکئ.';
$ec_lang['lpn_profile_tap_start']='هغه نقطه وټاکئ چیرته چې لار پیلیږي.';
$ec_lang['lpn_profile_tap_more']='د لارې کتلو لپاره یوه نقطه وټاکئ. د اضافه کولو لپاره یې فشار ورکړئ او ونیسئ. د پای ته رسولو لپاره دوه ځله ټیپ کړئ. د لغوه کولو لپاره بیا پروفایل ووهئ.';
$ec_lang['lpn_profile_say_idle']='په نقشه کې د نوې لارې ټاکلو لپاره بیا "پروفایل" فشار کړئ.';
$ec_lang['lpn_profile_none']='تر اوسه هیڅ لار نشته. په نقشه کې د یوې ټاکلو لپاره بیا "پروفایل" فشار کړئ.';
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
$ec_lang['lpn_profile_open']='د EPANET د پروفایل فایل پرانیستل…';
$ec_lang['lpn_profile_file_done']='پروفایل له فایل څخه ولوستل شو: په دې شبکه کې {total} نقطو څخه {used} وموندل شوې.';
$ec_lang['lpn_profile_file_missing']='په فایل کې نومول شوي خو په دې شبکه کې نشته: {ids}.';
$ec_lang['lpn_profile_file_short']='فایل په دې شبکه کې له دوو نقطو لږ نومونه لري، نو د رسمولو لپاره هیڅ پروفایل نشته.';
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
$ec_lang['lpn_pgraph_none']='دا شتمني په اوسني چلولو کې هیڅ پایله نه لري.';
// The Properties graph's own selector entry for a source share (Tom, 2026-09-30: "In selector, use
// 'Source share from {trace node}'"). Distinct from the shared lpn_result_source_share, which still
// labels the bare quantity everywhere else -- the Tables column, Find's property list, the Labels
// popover and the colour legend -- where naming the trace node in every heading would be clutter.
$ec_lang['lpn_pgraph_source_share_from']='د {node} سرچینې ونډه';
$ec_lang['lpn_result_pump_head_tip']='هغه هیډ چې پمپ له مکونې څخه تر وتلو پورې زیاتوي، د مثبت شمېرې په توګه ښودل شوی. حل کوونکی او د EPANET فایلونه یې د منفي د سر ضیاع په توګه لري.';
// The Full report puts every node and link in one table, where a node's Head column already sits, so a
// pump's column there says whose head it is. Elsewhere the pump's own row or tab says so, and lpn_result_pump_head is enough.
$ec_lang['lpn_report_pump_head']='د پمپ هیډ';
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
// EPANET's Frequency Plot (Task 600): one value over every junction or every pipe, at the time the
// map shows, against the percent of them less than it. "Percent less than" is EPANET's own axis
// title. {n} and {total} are counts, {time} an elapsed time; all substituted, never concatenated.
// The Junctions/Pipes choice reuses lpn_pane_tab_junctions and lpn_pane_tab_pipes.
$ec_lang['lpn_freq_menu']='تعدد';
$ec_lang['lpn_freq_tip']='د یوې ځانګړتیا د تعدد ویش';
$ec_lang['lpn_freq_title']='د ارزښتونو ویش';
$ec_lang['lpn_freq_none']='تر اوسه د دې ارزښت لپاره هیڅ پایله نشته، نو د ګراف کولو لپاره هیڅ شی نشته.';
$ec_lang['lpn_freq_summary']='ګراف شوي: {n} د {total} څخه';
$ec_lang['lpn_freq_summary_time']='ګراف شوي: {n} د {total} څخه، په {time} کې';
$ec_lang['lpn_freq_axis_percent']='تر دې ټیټه سلنه';
// EPANET's Contour Plot (Task 600), drawn as a layer under the map rather than in a window of its
// own, from the pipes outward. {n} and {p} are counts, {k} and {i} numbers, {u} a unit symbol, {m} a
// distance in metres; all substituted. lpn_contour_buffer_unit follows the Buffer number box.
// lpn_contour_consent_1..4 are the terrain question's four paragraphs, reworded for what the contour
// plot sends: tile numbers for the network's area, not each node's latitude and longitude.
$ec_lang['lpn_contour_menu']='کانتور';
$ec_lang['lpn_contour_tip']='پر نقشه د کانتور انځور ښودل: د نقطو رنګونه د پایپونو په اوږدو او څنګ کې خپریږي، او د نومونو لرونکې کانتور کرښې ښکاري. یو بکس پرانیزي چې تاسو یې تنظیم یا بند کړئ.';
$ec_lang['lpn_contour_plot']='کانتور انځور';
$ec_lang['lpn_contour_show']='کانتورونه ښودل';
$ec_lang['lpn_contour_show_tip']='د ډکولو او د کانتور کرښو پټولو لپاره یې پاک کړئ؛ د هغوی بېرته راوستلو لپاره یې وټاکئ لکه څنګه چې وو. د نقطو رنګونه پاتې کیږي.';
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
// EPANET's System Flow plot (Task 600). "System flow" is its Graph Selection name, "System flow
// balance" its window title, "Produced" and "Consumed" its series. The definition is its own code
// (Fgraph.pas GetSysFlow): junction and reservoir demands only, split by sign; tanks in neither.
// The axis reuses lpn_result_flow and lpn_ts_axis_time.
$ec_lang['lpn_sysflow_menu']='د بهاو توازن';
$ec_lang['lpn_sysflow_tip']='د اوږدې مودې سمولېشن په اوږدو کې، د وخت پر وړاندې د تولید شوي ټول بهاو او مصرف شوي ټول بهاو ګراف. ټانکونه په هیڅ یو ټول کې نه دي، نو چیرته چې دوه کرښې جلا کیږي، ټانکونه ډکیږي یا خالیږي.';
$ec_lang['lpn_sysflow_title']='د بهاو توازن';
$ec_lang['lpn_sysflow_produced']='تولید شوی';
$ec_lang['lpn_sysflow_produced_tip']='د ذخیرو او منفي غوښتنو نه شبکې ته ننوتونکی ټول بهاو.';
$ec_lang['lpn_sysflow_consumed']='مصرف شوی';
$ec_lang['lpn_sysflow_consumed_tip']='د هرې مثبتې غوښتنې ټول: هغه اوبه چې په جنکشنونو کې له شبکې نه اخیستل کیږي، او هر هغه بهاو چې ذخیرې ته ننوځي.';
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
// **THE SUB-BOX'S OWN TITLE** (Tom, 2026-09-25) is lpn_new_coordsys, as are its list label and
// the New project box's chooser button (Task 699): it names the box's own subject rather than
// either caller's radio label.
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
// Shown beside WGS 84 (EPSG:4326) in the chooser only (Task 775), never on the status strip.
$ec_lang['lpn_crs_suggested_mark']='(وړاندیز شوی)';
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
// **TASK 718** (Tom, 2026-09-25: *"We have three import items. It's probably time for an Import
// sub-menu."*). The three rows -- surveyed points, an EPANET file, and libraries -- now open as a
// fly-out off one row, the same submenu idiom Help > Toolbar already uses. Each row keeps its
// own existing key and tip; only this one row is new.
$ec_lang['lpn_file_import_menu']='دننه کول…';
$ec_lang['lpn_file_import_inp']='د EPANET فایل دننه کول…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='د EPANET فایل نه یوه شبکه ولولئ، که .inp متني فایل وي یا هغه .net فایل چې EPANET یې ساتي، او یې د نوې پروژې په توګه پدې براوزر کې وساتئ.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
// File > Export is a submenu (Tom, 2026-10-06), so its rows drop the verb the heading carries. The
// two keys above are what the rows were called before it.
$ec_lang['lpn_file_export_menu']='صادرول…';
$ec_lang['lpn_file_export_item_inp']='د EPANET فایل…';
$ec_lang['lpn_file_export_item_geojson']='د GeoJSON فایل…';
$ec_lang['lpn_file_export_item_ods']='ODS فایل…';
$ec_lang['lpn_file_export_item_xlsx']='XLSX فایل…';
$ec_lang['lpn_file_export_item_csv']='CSV فایل…';
$ec_lang['lpn_file_export_tables_tip']='جدولونه داسې ډاونلوډ کړئ لکه څنګه چې د جدولونو برخه یې ښیي، په یوه workbook کې د هر جدول لپاره (او د هرې سناریو لپاره چې تاسو یې وټاکئ) یوه پانه، او د هر کتابتون لپاره یوه پانه چې د هغو ID ورته اشاره کوي: نمونې، منحنۍ، د پایپ ډولونه، او فیتینګونه. پایلې یوازې د وروستۍ محاسبه شوې سناریو لپاره شاملې دي.';
$ec_lang['lpn_file_export_csv_tip']='یو جدول داسې ډاونلوډ کړئ لکه څنګه چې د جدولونو برخه یې ښیي. یو جدول د یوه CSV فایل په توګه راځي، پرته له کتابتونونو. څو جدولونه یا سناریوګانې د CSV فایلونو د یوه zip فایل په توګه راځي، د هر کتابتون لپاره د یوه فایل سره چې د هغو ID ورته اشاره کوي. پایلې یوازې د وروستۍ محاسبه شوې سناریو لپاره شاملې دي.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='دا شبکه د EPANET .inp فایل په توګه ډاونلوډ کړئ (که تړاو ولري د خپل انځور سره په zip فایل کې). هر هغه څه چې .inp بڼه یې نشي ساتلی وروسته تاسو ته لیست کیږي.';
$ec_lang['lpn_status_inp_exported']='{file} صادر شو.';
$ec_lang['lpn_status_inp_exported_picture']='{zip} صادر شو، چې د EPANET فایل {file}، د هغه شاليد انځور {picture}، او د نقشې همغږۍ دوتنه {world} لري. دا درې واړه په یوه پوښۍ کې استخراج کړئ، بیا هلته .inp په EPANET کې پرانیزئ؛ انځور ورسره راځي.';
$ec_lang['lpn_status_inp_exported_no_picture']='{file} صادر شو. شاليد انځور ونه ساتل شو، نو .inp هیڅ نه نوموي؛ په EPANET کې یې د View > Backdrop > Load له لارې اضافه کړئ.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_flat_customers_inactive']='د دې مشتریانو {n} یوه داسې جنکشن ته ټاکل شوي چې په دې سناریو کې غیرفعال دی، نو د هغوی غوښتنه په فایل کې نه ده.';
$ec_lang['lpn_inp_export_flat_inactive_controls']='دا کنټرولونه او قواعد شتمنۍ ته اشاره کوي چې په دې سناریو کې غیرفعاله ده، نو په فایل کې نه دي: {ids}';
$ec_lang['lpn_inp_export_differences']='{n} شیان چې .inp فارمېټ یې نشي ساتلی.';
$ec_lang['lpn_inp_export_difference_one']='یو شی چې د .inp بڼه یې نشي نیولی.';
$ec_lang['lpn_inp_export_refused']='دا پروژه د EPANET فایل په توګه لیکل کیدی نشي: {detail}';
// Task 772: File > Export DXF file. The model's data for AutoCAD and other CAD programs.
$ec_lang['lpn_file_export_item_dxf']='DXF فایل…';
$ec_lang['lpn_file_export_dxf_tip']='دا شبکه د AutoCAD او نورو CAD پروګرامونو لپاره ډاونلوډ کړئ: نقطې د سمبول بلاکونو په توګه، پایپونه، پمپونه، او والوونه د پولیلاینونو په توګه، او هره شتمني د بلاک په توګه چې صفتونه یې د پروژې په واحدونو کې خپل ID او د ځانتیا ارزښتونه لري.';
$ec_lang['lpn_dxf_export_no_utm']='DXF فایل ونه لیکل شو: دا شبکه د هغو عرض البلدونو بهر پرته ده چې UTM یې پوښي (80° S تر 84° N)، او انځور ته د رسمولو لپاره هواره ګرډ ته اړتیا ده.';
$ec_lang['lpn_dxf_export_refused']='DXF فایل ونه لیکل شو: د همغږۍ بدلون چې ورته اړتیا ده بار نشو. اړیکه وڅارئ او بیا هڅه وکړئ.';
$ec_lang['lpn_dxf_export_failed']='DXF فایل ونه لیکل شو: په دې پاڼه کې یوې تېروتنې دې ودراوه ({error}).';
// The read-me written into the file as a block of attributes, on a layer that does not plot; the
// file writes it in capital letters. Each says what
// the coordinates are and claims no coordinate system the file does not have. {unit} is a length
// unit as written in English (ft, m), not translated; {crs} is a coordinate system name with its EPSG code.
$ec_lang['lpn_dxf_note_grid']='همغږي: د دې پروژې X او Y، په {unit} کې. هیڅ د همغږۍ سیسټم نه دی بیان شوی.';
$ec_lang['lpn_dxf_note_crs']='همغږي: {crs}، دقیقاً لکه څنګه چې دا پروژه یې بیانوي.';
$ec_lang['lpn_dxf_note_geo']='همغږي: {crs}، په مترو کې، نه عرض البلد او طول البلد. د پروژې عرض البلدونه او طول البلدونه همدې ګرډ ته بدل شوي.';
$ec_lang['lpn_dxf_exported_geo']='{file} صادر شو. د هغه همغږي {crs} دي، په مترو کې، نه عرض البلد او طول البلد.';
// {prefix} is the layer-name prefix, C-WATR-MODL-; {example} is a whole layer name such as
// C-WATR-MODL-NODE-BASE.
$ec_lang['lpn_dxf_note_blocks']='پرتونه د {prefix}، د شتمنۍ کوډ، یوه ډش، او بدیل په توګه نومول شوي، لکه په {example} کې. هر عنصر د 1 په پیمانه کې د بلاک په توګه داخل شوی چې صفتونه یې 1 واحد لوړ دي؛ د متن د لوړوالي ټاکلو لپاره بلاکونه پیمانه کړئ. هر صفت لیدل کیږي؛ د یوه عنصر صفتونه د هغه د سمبول تر څنګ په یوه ستون کې یو پر بل ایښودل شوي.';
// {n} is a whole number; {max} is 2049. Each shortened value ends in three periods (...).
$ec_lang['lpn_dxf_note_shortened']='ارزښتونه چې د DXF فایل له اجازه شوي اوږدوالي ({max} توري) څخه اوږد وو: {n}. هر یو لنډ شو او په درې نقطو پای ته رسیږي.';
// {n} is a whole number; {tag} is an attribute tag in capitals, BASE_DEMAND in English.
$ec_lang['lpn_dxf_note_categories']='جنکشنونه چې له یوې کټګورۍ ډیرې غوښتنې لري: {n}. د هغوی {tag} صفت د ټولو کټګوریو د اساسي غوښتنو مجموعه لري.';
// GeoJSON export (Task 728). The command is worded like Export EPANET file. Positions in a GeoJSON
// file are always longitude and latitude (RFC 7946), so a project with no place on the Earth is
// refused and told how to get one, never written with an invented coordinate system.
$ec_lang['lpn_file_export_geojson_tip']='دا شبکه د QGIS، ArcGIS Pro او نورو GIS پروګرامونو لپاره د GeoJSON فایل په توګه ډاونلوډ کړئ. جنکشنونه، ټانکونه او ذخیرې ټکي دي، او پایپونه، پمپونه او والوونه کرښې دي چې خپلې نقطې تعقیبوي. موقعیتونه عرض البلد او طول البلد دي. پایلې یوازې هغه وخت شاملې دي چې شبکه حل شوې وي.';
// Workspace export and import (Tom, 2026-10-07). {file}, {n}, {r}, {u} and {version} are filled in by the page.
$ec_lang['lpn_file_export_item_workspace']='کاري چاپېریال…';
$ec_lang['lpn_file_export_workspace_tip']='یو کوچنی فایل ډاونلوډ کړئ چې ستاسو بکسونه چیرته ایښودل شوي، د هغوی اندازې، کوم پرانیستل شوي یا ځای پر ځای شوي، او ستاسو د پین او ستون اندازې لري، او د دې پاڼې د ښودنې اختیارونه، لکه کوم مرستندویه بالونه او د هوور کارت ښودل کیږي. ستاسو پروژې، د پروژې تنظیمات او کوکیز (ژبه، رضایت، واحدونه) په هغه کې نشته. په بل سکرین یا براوزر کې یې له فایل، دننه کول، کاري چاپېریال سره بار کړئ.';
$ec_lang['lpn_file_import_workspace']='کاري چاپېریال…';
$ec_lang['lpn_file_import_workspace_tip']='هغه کاري چاپېریال فایل پلی کړئ چې له فایل، صادرول، کاري چاپېریال سره ساتل شوی: د بکسونو ځایونه او اندازې، ځای پر ځای کول، د پین اندازې او د دې پاڼې د ښودنې اختیارونه، لکه کوم مرستندویه بالونه او د هوور کارت ښودل کیږي. ستاسو پروژې او کوکیز نه لمسیږي.';
$ec_lang['lpn_workspace_exported']='کاري چاپېریال {file} ته ساتل شو: {n} تنظیمات.';
$ec_lang['lpn_workspace_imported']='کاري چاپېریال له {file} څخه پلی شو. پلی شوي تنظیمات: {n}. ډیفالټ ته راستانه شوي: {r}.';
$ec_lang['lpn_workspace_ignored']='هغه ننوتنې چې نه پېژندل شوې، له پامه غورځول شوې: {u}.';
$ec_lang['lpn_workspace_refused_unreadable']='دا فایل د کاري چاپېریال په توګه نشو لوستل کیدی، نو هیڅ نه دي بدل شوي.';
$ec_lang['lpn_workspace_refused_format']='دا د دې پاڼې لخوا ساتل شوی کاري چاپېریال فایل نه دی، نو هیڅ نه دي بدل شوي.';
$ec_lang['lpn_workspace_refused_newer']='دا کاري چاپېریال فایل د دې پاڼې د نوې نسخې لخوا ساتل شوی (بڼه {version})، نو هیڅ نه دي بدل شوي.';
$ec_lang['lpn_workspace_confirm']='د دې براوزر د کاري چاپېریال ترتیب د فایل ترتیب سره بدل شي؟';
$ec_lang['lpn_workspace_refused_storage']='د براوزر ذخیره ډکه یا ناشونې ده، نو کاري چاپېریال پلی نشو.';
$ec_lang['lpn_geojson_refused_local']='د GeoJSON فایل یوازې عرض البلد او طول البلد لري، او دا پروژه پر یوه محلي جال رسم شوې ده چې پر ځمکه هیڅ ځای نه لري. لومړی یې د Map، World map، Attach له لارې جغرافیوي کړئ، بیا بیا صادر کړئ.';
$ec_lang['lpn_geojson_refused_range']='دا موقعیتونه سم عرض البلد او طول البلد نه دي: {detail}';
$ec_lang['lpn_geojson_refused_crs']='د دې پروژې همغږۍ سیسټم ({detail}) دې پاڼې ته نامعلوم دی، نو د هغه موقعیتونه عرض البلد او طول البلد ته نشي بدلیدی. د Convert as… وکاروئ ترڅو پروژه هغه سیسټم ته کاپي شي چې دا پاڼه یې پیژني، بیا بیا صادر کړئ.';
$ec_lang['lpn_geojson_refused_empty']='تر اوسه د صادرولو لپاره هیڅ شی نشته. لومړی یوه شبکه رسم کړئ یا پرانیزئ.';
$ec_lang['lpn_geojson_results_in']='هغه پایلې چې په سکرین کې دي شاملې دي.';
$ec_lang['lpn_geojson_results_out']='هیڅ پایله شامله نه ده، ځکه چې شبکه نه ده حل شوې.';
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
$ec_lang['lpn_inp_backdrop_attach']='{file} وصلول…';
$ec_lang['lpn_inp_backdrop_attach_tip']='ویب پاڼه انځور په نوم نشي پرانیستلی. دا په خپله وسیله کې وټاکئ او هغه هلته ځای پر ځای کیږي چیرې چې فایل وايي چې تړاو لري.';
$ec_lang['lpn_inp_backdrop_attached']='{file} ولګول شو، هلته ځای پر ځای شو چیرې چې فایل وايي چې تړاو لري.';
$ec_lang['lpn_inp_backdrop_attached_other']='{picked} ولګول شو، هلته ځای پر ځای شو چیرې چې فایل وايي چې تړاو لري. فایل {file} نوموي، چې بل نوم دی.';
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
$ec_lang['lpn_inp_drop_comments']='د دې فایل په نمونو یا ساده کنترولونو کې دغه د تبصرې کرښې راننوتل نه شوې، ځکه چې دا پاڼه د هغوی د ساتلو ځای نلري (د بېلګې په توګه، د یوې نمونې د قطارونو ترمنځ). هره نمونه او هر کنترول په بشپړه توګه راننوتل.';
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
$ec_lang['lpn_file_saveas_tip_download']='د براوزر د ډاونلوډ تنظیماتو په کارولو سره ساتئ. دا براوزر فایل ته وصل کیدی نشي، نو ساتل غیرفعال دی او یوازې داسې ساتل شته. که د براوزر تنظیم "هر فایل چیرته ساتل شي وپوښتئ" فعال وي، اصلي فایل ټاکل کیدی شي او پرې لیکل کیږي.';
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
// Asked at the one moment the name is useful. Nothing is written to this computer for it; the lock
// broker keeps it in that file's lock record for the holder to read (Tom, 2026-09-29, correcting a
// prompt that said "stored only in this browser").
$ec_lang['lpn_lock_ask_prompt']='موږ باید ووایو چې څوک پوښتنه کوي؟ د بېلګې په توګه خپل لومړي توري ولیکئ. دا زموږ په سرور کې د دې فایل د بندیز سره ساتل کیږي، د هر چا لپاره چې دا پرانیستی وي، او په 30 ورځو کې ړنګیږي.';
$ec_lang['lpn_lock_ask_sent']='موږ هغه چا نه چې دا فایل یې پرانیستی لري وغوښتل چې یې بند کړي. که د هغوی پاڼه لاهم پرانیستې وي، دوی به یې د یوې دقیقې دننه ووینې. بل هیڅ شی نه دی بدل شوی، او فایل لاهم د هغوی دی تر هغه چې یې بند کړي.';
$ec_lang['lpn_lock_ask_failed']='ستاسو پیغام ونه رسېدل. یا اوس هیچا دا فایل پرانیستی نلري، یا سرور ته لاسرسی ونشو.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='دا فایل نه دی پرانیستل شوی، او دلته هیڅ شی نه دی بدل شوی. یو بل چا لاهم دا پرانیستی لري.';
// Task 747: a file copied outside this page keeps its original's document ID, and so its lock. Asked
// whenever this browser cannot guarantee it already knows the file (Tom, 2026-09-30). {date} is when
// the ID was minted, in the visitor's own regional date-time format.
$ec_lang['lpn_copy_title']='فایل د نوې کاپي په توګه نښه کړم؟';
$ec_lang['lpn_copy_body']='دا فایل وايي چې په {date} جوړ شوی، او دا براوزر یې نه پیژني. ایا دا اصلي فایل دی (ورته بندیز وساتئ) که کاپي (نوی بندیز جوړ کړئ)؟';
$ec_lang['lpn_copy_body_nodate']='دا براوزر دا فایل نه پیژني. ایا دا اصلي فایل دی (ورته بندیز وساتئ) که کاپي (نوی بندیز جوړ کړئ)؟';
$ec_lang['lpn_copy_original']='اصلي؛ ورته بندیز وساتئ';
$ec_lang['lpn_copy_copy']='کاپي؛ نوی بندیز جوړ کړئ';
// What "Original" does when the file's id is already open in a tab here with a different file:
// switch to the tab, without changing the tab's file.
$ec_lang['lpn_copy_kept_link']='{name} د اصلي په توګه، په نوي ځای کې پرانیستل شو. خوندي کول اوس همدې فایل ته لیکي.';
// Tom, 2026-10-05: the copy is saved the moment it is chosen, so nobody has to remember to.
$ec_lang['lpn_copy_opened']='{file} د کاپي په توګه پرانیستل شو او د نوي بندیز سره وساتل شو.';
// Said only when that save did not happen (permission refused, file gone); the tab stays unsaved.
$ec_lang['lpn_copy_opened_unsaved']='{file} د کاپي په توګه پرانیستل شو، د نوي بندیز سره چې د راتلونکي فایل ساتلو سره به ساتل کیږي.';
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
$ec_lang['lpn_msglog_note']='نوي لومړی. دا پاڼه تر هغه پورې چې پرانیستې وي وروستي {n} پیغامونه ساتي، او په کمپیوټر کې یې نه ساتي.';
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
$ec_lang['lpn_notes_1_def']='په ډیفالټ شبکه د EPANET حل کوونکي حلوي. کله چې ټول د چلولو وخت ټاکل شي، هر راپور وخت ګام په ترتیب سره محاسبه کیږي: ټانکونه ډکیږي او تشیږي، غوښتنې خپلې نمونې تعقیبوي، او اوزارپټه چلول بیا غږوي. کله چې د امکان په صورت کې دننه جوړ شوی حل کوونکی وکاروئ ټاکل شوی وي، د یوې شېبې حل کیدی شي پر ځای یې دننه جوړ شوی حل کوونکی حل کړي، خو اوږدمهاله سمولېشن یا شبکه چې د فشار ماتوونکی یا عمومي موخې والو (PBV، GPV) لري تل د EPANET حل کوونکي حلوي.';
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
$ec_lang['lpn_notes_2_def']='تلاطم (surge) او د اوبو هتوکی (water hammer) ماډل شوي نه دي: ټولې پایلې د ثابت یا ورو بدلیدونکي بهاو لپاره دي، نه د هغه تېرې فشار څپې لپاره چې د والو ناڅاپه تړلو لخوا رامنځته کیږي.';
$ec_lang['lpn_notes_3_term']='د پروژو ساتل';
$ec_lang['lpn_notes_3_def']='هره پروژه یو ټب ده، او هر ټب د کار پر مهال په دې براوزر کې ساتل کیږي. د براوزر معلومات پاکول ټول ړنګوي، نو کار باید په فایل کې وي: فایل، داسې ساتل. په ټب کې ستوری معنی لري چې دا بدلونونه لري چې په فایل کې نه دي، او دا ټب تړل لومړی پوښتنه کوي. هیڅ شی فایل ته نه لیکل کیږي پرته له دې چې ساتل یا داسې ساتل وټاکل شي. په ځینو براوزرونو کې پروژه هغه فایل سره نښلیږي چې ورته ساتل شوې، او فایل، ساتل له هغه وروسته همدې فایل ته بیرته لیکي؛ په نورو کې هیڅ نښلول ممکن نه دی، نو ساتل غیرفعال دی او یوازې داسې ساتل شته. دا سایټ ثبتوي چې څوک د پروژې فایل پرانیستی، ترڅو دوه کسان یو بل باندې ونه لیکي. هغه فایل پرانیستل چې همکار یې دمخه پرانیستی دا وړاندیزونه کوي: پوښتنه، یوازې لوستلو لپاره پرانیستل، او قفل ماتول. که سرور ته نه رسیدل کیږي، خبرتیا وایي چې بل کاروونکی کولی شي همدا فایل په یو وخت کې سمون کړي.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='د پمپ منحني';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='پمپ H = H₀ − aQ^b تعقیبوي، چیرې چې H هغه هیډ دی چې پمپ یې اضافه کوي او Q هغه بهاو دی چې له هغه نه تیریږي. د منحنۍ ټکي په اوبه، کتابتونونه کې د پمپ هیډ منحنۍ په توګه لیکل کیږي، او پمپ په ځانتیاوو کې هغه منحنۍ بیانوي. درې ټکي، په صفر بهاو کې هیډ، عادي کاري ټکی، او د لوړ ترین بهاو ټکی، H₀، a، او b مستقیم برابروي، او خپره شوې منحنۍ تر ټولو نږدې تعقیبوي. دوه ټکي پارابولا (b = 2) برابروي چې اوج یې په صفر بهاو کې دی. یو ټکی د EPANET قاعده کاروي: په صفر بهاو کې هیډ د لیکل شوي هیډ 1.33334 چنده دی، او لوړ ترین بهاو د لیکل شوي بهاو 2 چنده دی، چې بیا b = 2 ورکوي. هغه پمپ چې منحنۍ نه لري هیڅ هیډ نه اضافه کوي. منحنۍ هلته نه پرې کیږي چیرې چې هیډ صفر ته رسیږي، نو د هغه بهاو نه ډیر بهاو چې منحنۍ یې رسولی شي منفي هیډ تولیدوي. علاج لوی پمپ یا کوچنۍ غوښتنه ده، نه د منحنۍ برابرولو بل ډول. منحنۍ کولی شي له درې ټکو ډیر ولري. د EPANET حل کوونکی ټول ورکول کیږي او د هغوی ترمنځ انټرپولیټ کوي، پداسې حال کې چې د معادلې کرښه او دننه جوړ شوی حل کوونکی ټیټ، منځنی، او لوړ ترین ټکي کاروي.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_6_term']='د جدول کالمونو مرسته';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE -- the Hide/Show row beside it names the
// identical menu. **GESTURE FIRST, THEN ACTION, SINCE 2026-10-06** (Ida, User guide): the cells were
// swapped in all 27 files, by script and unchanged, so this table reads in the same order as the
// key-then-action tables beside it (lpn_notes_7_def, lpn_hotkeys_map_def).
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>سرلیک کلیک کړئ</td><td>کالم ټاکل</td></tr><tr><td>بل سرلیک Ctrl+click یا Shift+click کړئ</td><td>د کالم ټاکنه اضافه یا غزول</td></tr><tr><td>راکاږئ یا ښي کلیک یا ⋮ مینو کې کالمونه اداره کول… وکاروئ</td><td>ټاکل شوي کالم(ونه) لیږدول (بیا ترتیبول)</td></tr><tr><td>د سرلیک پورتنی کونج ونیسئ، یا سرلیک ته Tab یا یې وټاکئ</td><td>مینو ⋮ او د ترتیب غشی.</td></tr><tr><td>سرلیک ښي کلیک کړئ یا د سرلیک پورتنی ښی کونج کې ⋮ مینو</td><td>پټول، ټول ښودل، یا د ښکاره والي او ترتیب اداره کول</td></tr><tr><td>د سرلیک پورتنی ښی کونج کې د غشي نښه</td><td>د کالم له مخې ترتیب کول</td></tr><tr><td>ښي کلیک، د سرلیک پورتنی ښی کونج کې ⋮ مینو، یا Ctrl+Shift+V</td><td>د جدول په پای کې د نویو قطارونو په توګه پیسټ کول</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='د جدول کیبورډ لنډلارې';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>د غشي تڼۍ</td><td>حرکت کول.</td></tr><tr><td>Tab, Enter</td><td>ننوتنه بشپړول او یوه حجره ښي لوري (Tab) یا ښکته (Enter) ته حرکت کول.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>یوه حجره شاته (Shift+Tab) یا پورته (Shift+Enter) حرکت کول.</td></tr><tr><td>Shift+د غشي تڼۍ</td><td>ټاکنه غزول.</td></tr><tr><td>Ctrl+C</td><td>ټاکنه کاپي کول.</td></tr><tr><td>Ctrl+D</td><td>ټاکنه د خپل پورتني قطار نه ښکته ډکول.</td></tr><tr><td>Ctrl+Enter</td><td>ټاکنه د فعالې حجرې ارزښت سره ډکول.</td></tr><tr><td>Ctrl+A</td><td>ټول جدول ټاکل.</td></tr><tr><td>Ctrl+Shift+V</td><td>د جدول په پای کې د نویو قطارونو په توګه پیسټ کول.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>بل یا پخواني ټب ته تلل، که جدول وي یا ګراف.</td></tr><tr><td>Delete</td><td>فعاله حجره پاکول. د ټاکل شوې سلسلې پاکولو لپاره، ښي کلیک وکړئ او ړنګول وټاکئ.</td></tr><tr><td>F2</td><td>د سمون لپاره یوه حجره پرانیستل.</td></tr><tr><td>Esc</td><td>یو سمون لغوه کول.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='د رنګ ټکو پولې ثابتې پاتې کیږي';
$ec_lang['lpn_notes_color_def']='د رنګ بانډ پولې هغه مهال ټاکل کیږي چې د معلوماتو د طبقه‌بندۍ طریقه وټاکل شي. دوی په هر وخت ګام کې بیا نه ټاکل کیږي، ځکه چې دا به رنګونه په هر ګام کې نوی معنی ورکړي، چې د سیسټم د لیدلو لپاره ګټور نه دی. سناریو د اساس پولې ښیي. EPANET همداسې کار کوي. نوې پولې ترلاسه کولو لپاره، طریقه بیا وټاکئ یا پولې ولیکئ.';
$ec_lang['lpn_notes_engine_term']='دا پاڼه کوم EPANET چلوي';
$ec_lang['lpn_notes_engine_def']='د دې پاڼې د EPANET حل کوونکی OWA-EPANET 2.3.5 دی، چې د 2025 کال د فبرورۍ په 20 خپور شوی و. EPANET د Open Water Analytics له خوا رامنځته کیږي، یوه ټولنه چې د متحده ایالاتو د چاپیریال ساتنې ادارې سره کار کوي، کومې چې نسخه 2.2.0 د 2019 کال په دسمبر کې خپره کړه. د چلولو راپور دا 2.3.05 بولي ځکه چې انجن وروستۍ شمېره په دوو رقمونو کې لیکي. دا پاڼې ته د Luke Butler د epanet-js 0.9.0 له لارې رسیږي، د MIT جواز لاندې، او دا ستاسو د براوزر دننه چلیږي: ستاسو شبکه هیڅکله حل کولو لپاره چېرته نه لیږل کیږي.';
// The Notes example (Task 785). Held by dev/lpn-spike/user-guide-notes-harness.js.
$ec_lang['lpn_guide_nt_example_term']='په Net1 کې بېلګه: پمپ د منحنۍ نه تیر';
$ec_lang['lpn_guide_nt_example_def']='د Net1 بېلګه پرانیزئ او اوبه، کتابتونونه غوره کړئ. منحنۍ 1، Pump Curve for Pump 9، یو ټکی لري، په 250 ft کې 1500 gpm. په صفر بهاو کې هیډ 333.3 ft دی او لوړ ترین بهاو 3000 gpm دی. په 3500 gpm کې، چې د منحنۍ پای نه تیر دی، منحنۍ −120.4 ft هیډ ورکوي. د EPANET حل کوونکی همدا هیډ راپور کوي، د پمپ په اوږدو کې 120.4 ft ضیاع، او خبرداری ورکوي چې پمپونه کافي بهاو یا هیډ نشي رسولی.';
// The user manual's own entry (Task 785). Held by dev/lpn-spike/user-guide-own-harness.js.
$ec_lang['lpn_guide_own_example_def']='<p>د Net1 بېلګه پرانیزئ، Ctrl+K ووهئ، او critical ولیکئ. مینوګانې د اوبه، تحلیل لاندې د مهمیت تحلیل… قطار ښیي. بکسونه هغه ننوتنې ښیي چې دا یادوي، د هغوی ترمنځ لټون او ځای پرځای کول، اور بهاو: شننه، او مهمیت: تحلیل، او دا ننوتنه. قطار غوره کول ښیي چې د مهمیت تحلیل… په تحلیل مینو کې چیرته دی، او نه یې چلوي.</p>';
$ec_lang['lpn_id_invalid']='یو ID ولیکئ چې پکې خالي ځایونه یا نقل قول نښې نه وي.';
$ec_lang['lpn_id_taken']='هغه ID دمخه کارول شوی دی.';
$ec_lang['lpn_diag_no_fixed_head']='یوه ذخیره یا ټانک اضافه کړئ. شبکه د حل کیدو نه مخکې لږ تر لږه یو پیژندل شوی د اوبو کچه ته اړتیا لري.';
$ec_lang['lpn_diag_dangling_link']='یو پایپ یا پمپ هغه نقطې ته وصل دی چې نور شتون نلري:';
$ec_lang['lpn_diag_unreachable']='دا نقطې ذخیرې یا ټانک ته هیڅ لار نلري:';
// Tom, 2026-10-09: a node nothing connects to a source is left out of the run, not refused. The
// ids stand in the status bar until the network changes. Said in EPANET's own terms (junction,
// reservoir, tank) and never as an error, because the run happened.
$ec_lang['lpn_omitted_note']='له دې چلون څخه پاتې شول ځکه چې له هغو څخه ذخیرې یا ټانک ته هیڅ لار نشته: {ids}';
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
$ec_lang['lpn_engine_unavailable']='د EPANET حل کوونکی ډاونلوډ نشو، چې د فشار ماتوونکی او عمومي موخې والوونو (PBV، GPV) د حل لپاره اړین دی. له انټرنیټ سره د یوې اړیکې وروسته، حل کوونکی په دې وسیله کې ساتل کیږي.';
// The cause-specific sibling: {reason} is lpn_time_engine_fetch_failed (only a download can reach this notice).
// Offline keeps the sentence above. {wrong} in lpn_time_engine_run_failed is filled with lpn_wrong_btn.
$ec_lang['lpn_engine_unavailable_why']='د فشار ماتوونکی او عمومي موخې والوونه (PBV، GPV) پرته له EPANET حل کوونکي نشي حل کیدی. {reason}';
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
$ec_lang['lpn_engine_needed_failed_why']='دا شبکه یوازې د EPANET حل کوونکي حلولی شي. {reason}';
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
// Task 643 (Tom, 2026-10-14): an Auto length is the slope distance. No claim about accuracy (Task 641).
$ec_lang['lpn_field_length_slope_tip']='د پایپ اوږدوالی. کله چې اوتو چک شوی وي، اوږدوالی د ځوړوالي په اوږدو کې اندازه کیږي: رسم شوی اوږدوالی د دوو پای نقطو ترمنځ د لوړوالي له توپیر سره یوځای شوی.';
$ec_lang['lpn_field_from']='له';
$ec_lang['lpn_field_to']='تر';
// Tom, 2026-10-09: From and To are editable text. Said in the box a refused ID is said in.
$ec_lang['lpn_link_end_unknown']='هیڅ نقطه د {id} ID نلري.';
$ec_lang['lpn_link_end_same']='له او ته باید بېلې نقطې وي.';
// Tom, 2026-10-09: "Break link for node?", adapted to name the pipe. The two answers are Yes and No
// because No is not a cancel: it places the node where it was pressed, joined to nothing.
$ec_lang['lpn_split_pipe_ask']='پایپ {id} پدې نقطه کې وویشل شي؟';
// Object snap (Task 782). The tip beside the snap glyph on a pipe vertex: "Pipe 10, vertex 2". A node
// or a pipe is named by its type word and ID alone.
$ec_lang['lpn_snap_vertex']='{link}، رأس {n}';
// A tank, reservoir or junction snapped onto a node of another type is placed at exactly that
// position. Two nodes at one point are legal in EPANET, and the map cannot show that they are separate.
$ec_lang['lpn_snap_node_on_node']='{new} د {target} په ځای کې ایښودل شو. دواړه نقطې نه دي نښلول شوې.';
// The same, for a node DRAGGED onto another node.
$ec_lang['lpn_snap_moved_on_node']='{moved} د {target} ځای ته خوځول شو. دواړه نقطې نه دي نښلول شوې.';
// The Shape (Task 779): map annotation, a point, a polyline or a polygon. Tom, 2026-10-06: "Either
// way, we call it a 'Shape'". The tip beside the snap glyph on a Shape point: "Shape S1, point 2".
$ec_lang['lpn_snap_shape_point']='{shape}، {n} ټکی';
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
$ec_lang['lpn_inp_drop_gpv_curve']='دا والو یوې داسې د سر ضیاع منحنۍ ته اشاره کوي چې په دې فایل کې نشته. والو پرته له منحنۍ دننه شو، نو بشپړ خلاص پاتې کیږي تر هغه چې منحنۍ وټاکل شي.';
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
$ec_lang['lpn_pump_effic_global']='دا پمپ هیڅ اغیزناکتیا منحنۍ نه لري ټاکل شوې، نو دا د ټولې شبکې لپاره ټاکل شوې اغیزناکتیا سره چلیږي، {percent}.';
$ec_lang['lpn_pump_effic_unstated']='دا پمپ یوه اغیزناکتیا منحنۍ ته اشاره کوي چې {name} نومیږي، خو دې پروژه کې هیڅ داسې څه نه دي بیان شوي، نو دا د ټولې شبکې لپاره ټاکل شوي اغیزناکتیا سره چلیږي، {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='حالت: ټاکل. د کتلو یا بدلولو لپاره یوه شتمني، یو لیبل یا یو متن وټاکئ. د نقطې، لیبل یا متن د خوځولو لپاره یې راکاږئ. د پایپ د خمونو د اضافه کولو یا لرې کولو لپاره د قلمي نقطو وسیله وکاروئ.';
$ec_lang['lpn_mode_delete']='حالت: ړنګول. د لرې کولو لپاره یوه شتمني وټاکئ.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='حالت: قلمي نقطې. د هر پایپ قلمي نقطې د کوچنیو مربع لاستیو په توګه ښودل کیږي. د قلمي نقطې د اضافه کولو لپاره پر پایپ یو ټکی وټاکئ، د لرې کولو لپاره یو لاستی وټاکئ، یا د خوځولو لپاره یو لاستی راکاږئ. پدې حالت کې په نقشه کې بل هیڅ شی نشي بدلیدی.';
$ec_lang['lpn_mode_zoom_window']='حالت: د زوم کړکۍ. د زوم کولو لپاره په نقشه کې د یوه بکس دوه مقابل کونجونه وټاکئ، یا یو یې راکاږئ.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='هیڅ شی نه دی ټاکل شوی. لومړی نقشه کې یو عنصر کلیک کړئ، بیا ړنګول کېکاږئ.';
$ec_lang['lpn_mode_add_junction']='حالت: د جنکشن اضافه کول. د جنکشن د ایښودلو لپاره په نقشه کې یو ځای وټاکئ. د شتمنیو، لیبلونو او متنونو د بدلولو یا خوځولو لپاره ټاکلو حالت ته ورګرځئ.';
$ec_lang['lpn_mode_add_reservoir']='حالت: د ذخیرې اضافه کول. د ذخیرې د ایښودلو لپاره په نقشه کې یو ځای وټاکئ. د شتمنیو، لیبلونو او متنونو د بدلولو یا خوځولو لپاره ټاکلو حالت ته ورګرځئ.';
$ec_lang['lpn_mode_add_tank']='حالت: د ټانک اضافه کول. د ټانک د ایښودلو لپاره په نقشه کې یو ځای وټاکئ. د شتمنیو، لیبلونو او متنونو د بدلولو یا خوځولو لپاره ټاکلو حالت ته ورګرځئ.';
$ec_lang['lpn_mode_add_pipe']='حالت: د پایپ اضافه کول. د وصل کولو لپاره لومړی د پیل نقطه او بیا د پای نقطه وټاکئ. د کرښې د خمولو لپاره ترمنځ په خالي ځای کې ټکي وټاکئ، یا د بیا پیلولو لپاره Escape ووهئ. د شتمنیو، لیبلونو او متنونو د بدلولو یا خوځولو لپاره ټاکلو حالت ته ورګرځئ.';
$ec_lang['lpn_mode_add_pump']='حالت: د پمپ اضافه کول. د وصل کولو لپاره لومړی د پیل نقطه او بیا د پای نقطه وټاکئ. د کرښې د خمولو لپاره ترمنځ په خالي ځای کې ټکي وټاکئ، یا د بیا پیلولو لپاره Escape ووهئ. د شتمنیو، لیبلونو او متنونو د بدلولو یا خوځولو لپاره ټاکلو حالت ته ورګرځئ.';
$ec_lang['lpn_mode_add_valve']='حالت: د والو اضافه کول. د وصل کولو لپاره لومړی د پیل نقطه او بیا د پای نقطه وټاکئ. د کرښې د خمولو لپاره ترمنځ په خالي ځای کې ټکي وټاکئ، یا د بیا پیلولو لپاره Escape ووهئ. د شتمنیو، لیبلونو او متنونو د بدلولو یا خوځولو لپاره ټاکلو حالت ته ورګرځئ.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='حالت: د متن اضافه کول. د متن د ایښودلو لپاره په نقشه کې یو ځای وټاکئ. د متن د یوې نقطې سره د تړلو لپاره د هغې نقطې ته نږدې ځای وټاکئ. د شتمنیو، لیبلونو او متنونو د بدلولو یا خوځولو لپاره ټاکلو حالت ته ورګرځئ.';
$ec_lang['lpn_mode_add_chain']='حالت: د جنکشن او پایپ ځنځیر. د جنکشن اضافه کولو لپاره په نقشه کې یو ټکی وټاکئ، بیا د پایپ او جنکشن اضافه کولو لپاره هر راتلونکی ټکی وټاکئ. د دوام لپاره یوه موجوده نقطه وټاکئ. ځنځیر پای ته رسولو لپاره Escape ووهئ. د شتمنیو، لیبلونو او متنونو د بدلولو یا خوځولو لپاره ټاکلو حالت ته ورګرځئ.';
$ec_lang['lpn_mode_add_shape']='حالت: شکل اضافه کول. هر ټکی وټاکئ. د پای ته رسولو لپاره وروستی ټکی بیا وټاکئ یا Enter ووهئ؛ د څو ضلعي د تړلو لپاره لومړی ټکی وټاکئ.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='دا حالت د نقشې شتمنیو او متن د بدلولو، خوځولو، او راکاږلو، یا د نقشې د پین کولو لپاره وکاروئ. دا د نقشې ډیفالټ حالت دی. د Esc دویم ځل فشار ټاکنه پاکوي.';
// Edited by TGH 2026-09-07
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
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='ټولو ته پلي کول';
$ec_lang['lpn_settings_apply_to_all_tip']='د دې ډول هره شتمنۍ چې لا دمخه رسم شوې د دې متن سره پیلیدونکی ID ترلاسه کوي. هره یوه خپله شمېره ساتي. هغه ID چې په شمېره نه پای ته رسیږي نه بدلیږي.';
$ec_lang['lpn_confirm_apply_prefix']='شتمنۍ ({n}) بېرته نومول شي ترڅو د دوی IDs د {prefix} سره پیل شي؟ هر یو خپله شمېره ساتي.';
$ec_lang['lpn_prefix_applied']='بیا نومول شوې شتمنۍ: {n}. نه بدلې شوې شتمنۍ: {skipped}.';
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
// Edited by TGH 2026-10-07
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
$ec_lang['lpn_backdrop_position_prompt2']='د موخې نقطې لپاره طریقه وټاکئ، بیا د «دوام ورکړئ» تڼۍ فشار کړئ.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='شاليد انځور تنظیمیږي.';
$ec_lang['lpn_backdrop_target_label']='هغه نقطه دې ته ولیږئ:';
$ec_lang['lpn_backdrop_target_node']='یوه نقطه';
$ec_lang['lpn_backdrop_target_free']='په نقشه کې هره نقطه';
$ec_lang['lpn_backdrop_target_coords']='هغه همغږي چې تاسو یې لیکئ';
$ec_lang['lpn_backdrop_coords_prompt']='هغه X,Y ولیکئ چې هغه نقطه دې ورته لاړ شي';
$ec_lang['lpn_backdrop_continue']='دوام ورکړئ';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// One key for the toolbar button, the Project menu row and the Settings box's own title (Task 699).
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
$ec_lang['lpn_settings_hover_card']='په هوور کې ټولې ځانتیاوې ښودل';
$ec_lang['lpn_settings_hover_card_tip']='پوینټر پر نقطه، تړاو، یا مشتری کېږدئ ترڅو ټولې ځانتیاوې یې په هغه ډول وګورئ چې په تنظیماتو کې ټاکل شوي، په هر پیمانه کې، که لیبل په نقشه کې ځای ولري یا نه. دا د دې براوزر تنظیم دی، نه د پروژې.';
// Task 805 (Tom, 2026-10-15, R-396: "It would be good to be able to hide the amber override
// indicators from the map. Maybe a Map, Clean map button is a good idea after all"). The rings'
// own switch, in Settings, Map and page, Page; and the Map menu row that hides them with the
// controls over the drawing. Both are browser settings.
$ec_lang['lpn_settings_override_marks']='په نقشه کې د ځانګړو ارزښتونو نښې ښودل';
$ec_lang['lpn_settings_override_marks_tip']='په شتمنۍ کې نصواري حلقه ښیي چې په پرانیستې سناریو کې ځانګړی ارزښت لري، او په کرښه شوې خړه حلقه په هغې شتمنۍ کې چې یو میراث اخلي. د جدولونو برخه ځانګړي ارزښتونه په هر صورت نښه کوي. نقشه، پاکه نقشه حلقې پټوي تر هغه چې ټاکل شوې وي. دا د دې براوزر تنظیم دی، نه د پروژې.';
$ec_lang['lpn_clean_map']='پاکه نقشه';
$ec_lang['lpn_clean_map_tip']='ټاکل شوی: د زوم تڼۍ، د کوڅې نقشې او سیټلایټ تڼۍ، د پیغامونو تڼۍ او خبرتیاوې، د ټاکنې مرسته، د نظر تڼۍ، او د ځانګړو ارزښتونو حلقې پټې دي. پاک شوی: دوی ښودل کیږي. تیروتنې لا هم په نقشه کې ښودل کیږي، او هره خبرتیا لا هم په پیغامونو کې ساتل کیږي. دا د دې براوزر تنظیم دی، نه د پروژې.';
$ec_lang['lpn_settings_theme']='موضوع';
$ec_lang['lpn_settings_theme_tip']='د پاڼې لپاره روښانه یا تیاره رنګونه وټاکئ. سیسټم ستاسو د وسیلې تنظیم تعقیبوي. د نقشې رسم په هره موضوع کې یو شان ښکاري. دا د دې براوزر تنظیم دی، نه د پروژې.';
$ec_lang['lpn_theme_system']='سیسټم';
$ec_lang['lpn_theme_light']='روښانه';
$ec_lang['lpn_theme_dark']='تیاره';
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
$ec_lang['lpn_cp_allow_tip']='یوازې دا کرکټرونه اجازه ورکړئ:';
$ec_lang['lpn_cp_characters_tip']='"@" یعنې هر توری؛ "#" یعنې هر عددي رقم، او که "-"، "."، او "," اجازه وي نو باید جلا لیست شي؛ او هر سپین ځای کرکټر باید د نورو حروفو ترمنځ وي.';
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
$ec_lang['lpn_valwarn_diameter']='د پایپ یا والو قطر معمولاً د {min} او {max} {unit} ترمنځ وي. شمېره او د قطر واحد وګورئ.';
$ec_lang['lpn_valwarn_hw']='د هیزن-ویلیامز C معمولاً د {min} او {max} ترمنځ وي. له دې حد بهر شمېره ډېری وخت د بل اصطکاک میتود لپاره خشونت وي.';
$ec_lang['lpn_valwarn_manning']='د مانینګ n معمولاً د {min} او {max} ترمنځ وي. له دې حد بهر شمېره ډېری وخت د بل اصطکاک میتود لپاره خشونت وي.';
$ec_lang['lpn_valwarn_dw']='د ډارسي-ویسباخ خشونت معمولاً له 0 زیات او تر {max} {unit} پورې وي. لویه شمېره ډېری وخت د هیزن-ویلیامز C یا د مانینګ n وي.';
$ec_lang['lpn_valwarn_positive']='EPANET دلته صفر یا منفي شمېره نه مني.';
$ec_lang['lpn_valwarn_negative']='EPANET دلته منفي شمېره نه مني.';
$ec_lang['lpn_valwarn_tank_levels']='EPANET دا ټانک نه مني. ټیټ ترین د اوبو ژوروالی باید له د اوبو ژوروالي نه زیات نه وي، او د اوبو ژوروالی باید له لوړ ترین د اوبو ژوروالي نه زیات نه وي.';
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
$ec_lang['lpn_scenario_overrides']='د ځانګړو ارزښتونو شمېر';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='نصواري حلقه دا معنی لري چې دا عنصر یو ارزښت لري چې یوازې د سناریو {name} پورې اړوند دی.';
$ec_lang['lpn_scenario_mark_inh_tip']='کرښه شوې خړه حلقه معنی لري چې سناریو {name} د دې شتمنۍ لپاره له خپلې مورنۍ سناریو یا بدیل نه ځانګړی ارزښت میراث اخلي.';
$ec_lang['lpn_scenario_overrides_tip']='هر یو له دې ارزښتونو نه پر نقشه د نصواري حلقې سره نښه شوی دی. {base} ته لاړ شئ ترڅو انځور پرته له دوی وګورئ.';
$ec_lang['lpn_scenario_menu']='سناریوګانې';
$ec_lang['lpn_scenario_tip']='هغه ارزښتونه چې انځور یې اوس ښیي او پاڼه یې اوس حلوي. د سناریوګانو بدلولو، یا د یوې اضافه کولو، نوم بدلولو، یا ړنګولو لپاره کلیک وکړئ.';
$ec_lang['lpn_scenario_new']='نوی سناریو…';
$ec_lang['lpn_scenario_new_name']='سناریو {n}';
$ec_lang['lpn_scenario_prompt_name']='د دې سناریو لپاره نوم';
$ec_lang['lpn_scenario_rename']='د سناریو نوم بدلول…';
$ec_lang['lpn_scenario_delete']='سناریو ړنګول';
$ec_lang['lpn_scenario_delete_ask']='سناریو {name} ړنګه کړئ؟ پخپله انځور نه بدلیږي.';
$ec_lang['lpn_scenario_delete_goes']='د هغې ځانګړي ارزښتونه ({n}) ورسره ړنګیږي.';
$ec_lang['lpn_scenario_delete_stays']='دا بدیلونه چې دا یې کاروي په پروژه کې پاتې کیږي: {list}.';
$ec_lang['lpn_scenario_delete_has_children']='سناریو {name} نشي ړنګیدی ځکه چې فرعي سناریوګانې لري: {list}. لومړی هغه ړنګ کړئ، یا بل مور ته یې وخوځوئ.';
// Edited by TGH 2026-09-07
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='د اساس سناریو: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} په {scenario} کې د شبکې نه بهر دی. دا لاهم په انځور کې دی، او ستاسو په نورو سناریوګانو کې هم.';
$ec_lang['lpn_scenario_delete_in_base']='له انځور څخه یې لرې کولو لپاره، یې په {base} سناریو کې ړنګ کړئ.';
$ec_lang['lpn_scenario_only_deleted']='{id} ړنګ شو. دا یوازې د {scenario} برخه وه.';
$ec_lang['lpn_scenario_delete_blocked']='{id} نه دی ړنګ شوی، ځکه چې تړاو {link} پر هغې پای ته رسیږي، او دا تړاو د {scenario} بهر هم شتون لري. د دواړو ړنګولو لپاره، یې په {base} سناریو کې ړنګ کړئ.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_basic']='ساده حالت';
$ec_lang['lpn_scenario_basic_tip']='ټاکل شوی: بدیلونه پټ او اتوماتیک دي، هره سناریو خپل ځانګړي ارزښتونه د خپلو په توګه ښیي، او ټولې نوې سناریوګانې د اساس سناریو فرعي دي؛ د سناریو: مدیر او د سناریوګانو جدول نه ښودل کیږي. پاک شوی: د سناریو: مدیر او د سناریوګانو جدول ښودل کیږي، او بدیلونه د سناریوګانو ترمنځ شریک کیدی شي. کله چې ساده حالت فعال وي د سناریو: مدیر غیرفعال دی. ساده حالت هغه مهال غیرفعال دی چې پروژه د سناریو او بدیل اړیکې ولري چې ساده حالت یې نشي ښودلی.';
$ec_lang['lpn_scenario_basic_misfit']='دا پروژه سناریوګانې او بدیلونو اړیکې لري چې د سناریوګانو ساده حالت سره نه برابریږي، نو ساده حالت غیرفعال دی.';
$ec_lang['lpn_scenario_basic_misfit_base']='اساس سناریو له اساس نه پرته بل بدیل کاروي.';
$ec_lang['lpn_scenario_copy']='سناریو کاپي کول';
$ec_lang['lpn_scenario_copy_tip']='پرانیستې سناریو او د هغې ځانګړي ارزښتونه کاپي کوي، او کاپي پرانیزي.';
$ec_lang['lpn_scenario_copy_off']='سناریو کاپي کول په ساده حالت کې کار کوي. کله چې ساده حالت بند وي، سناریو اضافه کړئ او بدیلونه یې د سناریوګانو په جدول کې وټاکئ.';
$ec_lang['lpn_sm_title']='سناریو: مدیر';
$ec_lang['lpn_sm_menu']='سناریو: مدیر…';
$ec_lang['lpn_pane_tab_scenarios']='سناریوګانې';
$ec_lang['lpn_sm_col_parent']='مور';
$ec_lang['lpn_sm_add_child']='فرعي اضافه کول';
$ec_lang['lpn_sm_add_base']='اساس اضافه کول';
$ec_lang['lpn_sm_add_base_tip']='بل اساس سناریو اضافه کړئ. دا د اساس د کاپي په توګه پیلیږي، د خپلو بدیلونو سره، او وروسته په اساس کې سمونونه دا نه بدلوي.';
$ec_lang['lpn_sm_add_base_alt_tip']='بل اساس بدیل اضافه کړئ. دا په دې کټګورۍ کې د اساس د ارزښتونو د کاپي په توګه پیلیږي، او وروسته په اساس کې سمونونه دا نه بدلوي.';
$ec_lang['lpn_sm_delete']='ټاکل شوی توکی ړنګ کړئ. کارول شوی توکی نه ړنګیږي.';
$ec_lang['lpn_sm_base_kept']='د ونې اساس نه ړنګیږي. بل اساس چې په اساس اضافه کولو سره اضافه شوی هغه مهال ړنګیږي چې هیڅ یې نه کاروي.';
$ec_lang['lpn_sm_rename']='نوم بدلول';
$ec_lang['lpn_sm_rename_alts_ask']='برابر نومول شوي بدیلونو نوم بدل کړئ؟';
$ec_lang['lpn_sm_make_current']='اوسنی کول';
// Tips on greyed Scenario manager commands, saying why they are greyed (Perry, 2026-10-11).
$ec_lang['lpn_sm_current_already']='دا سناریو دمخه اوسنۍ سناریو ده.';
$ec_lang['lpn_sm_none_selected']='لومړی په ونه کې یو توکی وټاکئ.';
$ec_lang['lpn_sm_base_named']='د ونې اساس نوم نه بدلیږي.';
$ec_lang['lpn_sm_merge_up']='پورته یوځای کول';
$ec_lang['lpn_sm_merge_up_tip']='د ټاکل شوي بدیل ځانګړي ارزښتونه په ونه کې د هغې پورته بدیل ته وخوځوئ. ټاکل شوی بدیل بیا دا ارزښتونه میراث اخلي.';
$ec_lang['lpn_sm_merge_up_root']='د اساس بدیل پورته هیڅ نه لري چې په کې یوځای شي.';
$ec_lang['lpn_sm_merge_none']='بدیل {name} د یوځای کولو لپاره ځانګړي ارزښتونه نه لري.';
$ec_lang['lpn_sm_merge_pick']='د {name} ځانګړي ارزښتونه په کوم بدیل کې یوځای کړئ؟ مور یې لومړی لیست شوی.';
$ec_lang['lpn_sm_merge_ask']='د {name} ځانګړي ارزښتونه ({n}) پورته {target} ته وخوځوئ؟ وروسته به دا دوی میراث واخلي پر ځای دا چې ځانګړي کړي. تاسو کولی شئ دا بېرته کړئ.';
$ec_lang['lpn_sm_merge_skipped']='{between} هم دا ارزښتونه ځانګړي کوي. دا پریښودل کیږي او نه بدلیږي، نو {name} به دوی له {between} نه ولولي، نه له {target} نه:';
$ec_lang['lpn_sm_merge_line']='{asset}: {property}';
$ec_lang['lpn_sm_copy_up']='پورته کاپي کول';
$ec_lang['lpn_sm_copy_up_tip']='د ټاکل شوي بدیل ځانګړي ارزښتونه په ونه کې د هغې پورته بدیل ته کاپي کړئ. ټاکل شوی بدیل خپل ځانګړي ارزښتونه ساتي.';
$ec_lang['lpn_sm_copy_up_root']='د اساس بدیل پورته هیڅ نه لري چې په کې کاپي شي.';
$ec_lang['lpn_sm_copy_none']='بدیل {name} د کاپي کولو لپاره ځانګړي ارزښتونه نه لري.';
$ec_lang['lpn_sm_copy_pick']='د {name} ځانګړي ارزښتونه په کوم بدیل کې کاپي کړئ؟ مور یې لومړی لیست شوی.';
$ec_lang['lpn_sm_copy_ask']='د {name} ځانګړي ارزښتونه ({n}) پورته {target} ته کاپي کړئ؟ {name} دوی د خپلو ځانګړو ارزښتونو په توګه ساتي. تاسو کولی شئ دا بېرته کړئ.';
$ec_lang['lpn_sm_copy_skipped']='{between} هم دا ارزښتونه ځانګړي کوي. دا پریښودل کیږي او نه بدلیږي، نو دا د دوی لپاره خپل ارزښتونه ساتي:';
$ec_lang['lpn_sm_list_overrides']='د ځانګړو ارزښتونو مدیر…';
$ec_lang['lpn_sm_list_overrides_tip']='د سناریو ځانګړي ارزښتونه په کټګورۍ سره لیست کړئ، هر یو د میراثي ارزښت سره چې ځانګړی کوي، او هر یو پاک کړئ.';
$ec_lang['lpn_sm_list_overrides_none']='دا سناریو ځانګړي ارزښتونه نه لري.';
$ec_lang['lpn_ovl_title']='د ځانګړو ارزښتونو مدیر: {name}';
$ec_lang['lpn_ovl_note']='دا هغه ارزښتونه دي چې دا سناریو په هغو بدیلونو کې پخپله ټاکي چې کاروي، هر یو د هغه ارزښت سره چې بدلوي. هغه ارزښتونه چې دا میراث اخلي نه لیست کیږي او نه شمیرل کیږي. ځانګړی ارزښت پاک کړئ ترڅو میراثي ارزښت بیرته راشي؛ بېرته یې بیرته راګرځوي. ID وټاکئ ترڅو په نقشه کې شتمنۍ ته لاړ شئ.';
$ec_lang['lpn_ovl_clear_selected']='ټاکل شوي ځانګړي ارزښتونه پاکول';
$ec_lang['lpn_ovl_clear_all']='ټول ځانګړي ارزښتونه پاکول';
$ec_lang['lpn_ovl_clear_all_ask']='د {name} ټول ځانګړي ارزښتونه ({n}) پاک کړئ؟ هر ارزښت میراثي ارزښت ته راستنیږي. بېرته یې بیرته راګرځوي.';
$ec_lang['lpn_ovl_pick_tip']='دا ځانګړی ارزښت د ټاکل شوي ځانګړي ارزښتونه پاکول تڼۍ لپاره وټاکئ.';
$ec_lang['lpn_ovl_bubble_off']='په نقشه کې نه دی';
$ec_lang['lpn_ovl_bubble_moved']='{quantity}، خوځول شوی یا اندازه بدل شوې';
$ec_lang['lpn_ovl_group']='{category}: {alternative}';
$ec_lang['lpn_ovl_col_override']='ځانګړی ارزښت';
$ec_lang['lpn_ovl_col_inherited']='میراثي ارزښت';
$ec_lang['lpn_ovl_col_inherited_tip']='هغه ارزښت چې دا سناریو پرته له ځانګړي ارزښت لولي: د بدیل د مور ارزښت، یا د اساس ارزښت.';
$ec_lang['lpn_ovl_same']='(یو شان)';
$ec_lang['lpn_ovl_same_tip']='له میراثي ارزښت سره برابر. دا لا هم ځانګړی ارزښت دی، او شمیرل کیږي.';
$ec_lang['lpn_sm_help']='سناریوګانې او بدیلونه څنګه کار کوي:\n\nپه ساده حالت کې، بدیلونه پټ او اتوماتیک دي، او ټولې نوې سناریوګانې د اساس سناریو فرعي دي.\n\nکله چې ساده حالت بند وي، پیچلې میراثي ونه شته، او بدیلونه د سناریوګانو ترمنځ شریک کیدی شي. خو هغه ډیفالټ چلند کله چې نوې بدیل اړیکه اړینه وي (د کاروونکي د فعال مدیریت په نشتون کې) دا دی چې د اوسنۍ سناریو په څیر نومول شوی بدیل جوړ شي، چې هره سناریو خپل ځانګړی بدیلونو سیټ ورکوي.\n\nځانتیاوې او تنظیمات د بدیلونو کټګوریو پورې اړه لري چې د سناریوګانو او بدیلونو جدول د کالمونو په توګه او د سناریو: مدیر کې د مدیریت اختیارونو په توګه ښکاري.\n\nځانګړي ارزښتونه په سناریوګانو کې جوړیږي، خو دوی په رښتیا د هغو بدیلونو دي چې له سناریو سره تړلي؛ نو سناریو د خپلو بدیلونو کړکۍ په څیر ده. د بدیلونو اړیکې له سناریوګانو سره د سناریو: مدیر په ښي برخه یا په ښکتنۍ برخه کې د سناریوګانو په جدول کې مدیریت کیږي. نوې سناریو جوړول هیڅ بدیلونه نه جوړوي؛ نوې سناریو د خپلې مور بدیلونه کاروي تر هغه چې ځانګړي ارزښتونه جوړ شي چې نوي بدیلونه غواړي. کله چې ځانګړي ارزښتونه په سناریو کې جوړ شي، دوی د سناریو لپاره په خپلو بدیلونو کې ساتل کیږي؛ که سناریو داسې بدیل نه لري، د سناریو د نوم په کارولو سره نوی بدیل جوړیږي.\n\nبېلګه: تاسو "Figure: Node and link IDs" سناریو جوړوئ او یو متن سمون کوئ چې "Node and Link IDs" ووایي. کله چې سناریو جوړوئ، هیڅ بدیل نه جوړیږي. خو هغه شېبه چې متن ساتئ، د متن بدیل چې "Figure: Node and link IDs" نومیږي د متن ارزښت ځانګړي ارزښت سره جوړیږي. په ساده حالت کې، تاسو دا په خپله سناریو کې یوازې د ځانګړي ارزښت په توګه وینئ.\n\nځانتیاوې کاپي کول یوازې ځانګړي ارزښتونه کاپي کوي. په هره سناریو کې چې اساس نه وي، دا یوازې هغه ځانګړي ارزښتونه کاپي کوي چې شتمنۍ په هغې سناریو کې لري.\n\nسناریوګانې څنګه مدیریت کړئ:\n\n- سناریوګانې یا د بدیلونو کټګورۍ په پورتنۍ لیست کې وټاکئ ترڅو ونه یې ښکاره شي.\n\n- د فرعي اضافه کول سره د ټاکل شوي توکي فرعي جوړ کړئ. اساس اضافه کول بل اساس اضافه کوي، چې اوس د اساس د کاپي په توګه پیلیږي؛ وروسته په اساس کې سمونونه دا نه بدلوي. نوی فرعي د خپل مور په نوم نومول کیږي؛ نوم بدلولو لپاره نوم ولیکئ. کاپي ټاکل شوی بدیل کاپي کوي. پورته یوځای کول د ټاکل شوي بدیل ځانګړي ارزښتونه په نوم سره ټاکل شوي پورتنۍ بدیل ته خوځوي، او ټاکل شوی بدیل بیا دوی میراث اخلي؛ دا لومړی هر هغه ارزښت نومي چې پریښودل شوی بدیل هم ځانګړی کوي، چې نه بدلیږي. د سناریو کاپي کولو لپاره، په ساده حالت کې د سناریوګانو په مینو کې سناریو کاپي کول وکاروئ؛ دا د سناریو ځانګړي ارزښتونه کاپي کوي، د هغو بدیلونو سره چې دوی لري. اساس اضافه کول او سناریو کاپي کول هر یو بدیلونه جوړوي: اساس اضافه کول په هره کټګورۍ کې چې ارزښتونه لري د نوي اساس لپاره اساس بدیل جوړوي، او سناریو کاپي کول د هر بدیل لپاره چې د سناریو ځانګړي ارزښتونه لري د کاپي په څیر نومول شوی نوی بدیل جوړوي.\n\n- توکی بل ته راکاږئ ترڅو د هغه توکي فرعي شي. سناریو چې نوي مور ته خوځول شوې هغه هر څه له هغې میراث اخلي چې ځانګړي کړي نه دي؛ هغه څه چې ځانګړي کړي بدلیږي نه. توکی د دوو توکو ترمنځ راکاږئ ترڅو بیا یې ترتیب کړئ.\n\n- توکي کلیک کړئ ترڅو یې وټاکئ. F2 فشار کړئ یا نوم بدلول غوره کړئ ترڅو ټاکل شوی توکی نوم بدل شي. سناریو نوم بدلول پوښتي چې ایا هغه بدیلونه چې د هغې نوم لري نوم بدل شي؛ په ساده حالت کې دوی له پوښتنې پرته ورسره نوم بدلیږي. سناریو دوه ځلې کلیک کړئ یا Enter فشار کړئ ترڅو اوسنۍ شي. د توکي تر څنګ غشي کلیک کړئ یا Left یا Right فشار کړئ ترڅو راټول یا پراخ شي. د توکي ښي کلیک کړئ ترڅو د تڼیو په څیر امرونه ترلاسه شي.\n\n- Delete فشار کړئ یا د منفي تڼۍ کلیک کړئ ترڅو ټاکل شوی توکی ړنګ شي. هغه توکی چې په کارونه کې دی نه ړنګیږي، او پیغام هغه څه نومي چې دا کاروي. هغه سناریو ړنګول کله چې ساده حالت بند وي هغه بدیلونه ساتي چې دا یې کاروي. هغه سناریو ړنګول کله چې ساده حالت فعال وي هر هغه بدیل هم ړنګوي چې بله سناریو یې نه کاروي.\n\n- سناریو ته د بل بدیل کارولو لپاره، اساس هم، دا د سناریو: مدیر په ښي برخه یا د سناریوګانو جدول کې د سناریو په قطار کې وټاکئ. په شریک بدیل کې ځانګړی ارزښت هره سناریو بدلوي چې دا کاروي.';
$ec_lang['lpn_sm_delete_alt_ask']='بدیل {name} ړنګ کړئ؟';
$ec_lang['lpn_sm_in_use']='{item}\nنشي ړنګیدی تر څو چې د دې لخوا کارول کیږي\n{list}';
$ec_lang['lpn_sm_alt_delete_has_children']='بدیل {name} نشي ړنګیدی ځکه چې فرعي لري: {list}. لومړی هغه ړنګ کړئ، یا بل مور ته یې وخوځوئ.';
$ec_lang['lpn_sm_item_scenario']='سناریو {name}';
$ec_lang['lpn_sm_item_alternative']='بدیل {name}';
$ec_lang['lpn_sm_name_taken']='نوم {name} دمخه په دې ونه کې کارول شوی.';
$ec_lang['lpn_sm_cycle']='{name} نشي کولی د خپلو فرعي لاندې خوځول شي.';
$ec_lang['lpn_sm_used_by']='د سناریوګانو لخوا کارول شوی: {n}';
$ec_lang['lpn_sm_used_by_tip']='د لخوا کارول شوی: {list}';
$ec_lang['lpn_sm_used_by_none']='د هیڅ سناریو لخوا نه کارول کیږي';
$ec_lang['lpn_sm_tree_all']='ټول';
$ec_lang['lpn_sm_tree_unused']='ټول نه کارول شوي';
$ec_lang['lpn_sm_unused_none']='هیڅ';
$ec_lang['lpn_sm_all_row_tip']='دوه ځلې کلیک وکړئ ترڅو په خپل کټګورۍ ونه کې یې پرانیزئ.';
$ec_lang['lpn_sm_compare_tip']='سناریو: پرتله کې شاملول';
$ec_lang['lpn_sm_inherited']='میراثي';
$ec_lang['lpn_sm_shared_note']='سره شریک: {list}';
$ec_lang['lpn_scncmp_none_checked']='هیڅ سناریو د پرتلې لپاره نه ده ټاکل شوې. په سناریو: مدیر کې سناریوګانې وټاکئ.';
$ec_lang['lpn_time_scn_overrides']='د سناریو خپل ارزښتونه:';
$ec_lang['lpn_settings_table_major']='لوی سرلیک';
$ec_lang['lpn_settings_table_minor']='کوچنی سرلیک';
$ec_lang['lpn_settings_table_category']='کټګورۍ';
// The Settings table's third heading level, between Minor heading and Setting: the label field, coloured
// field, asset or custom property a group of settings belongs to (Tom, 2026-10-07: "We could call it
// 'Owner'.").
$ec_lang['lpn_settings_table_owner']='مالک';
$ec_lang['lpn_settings_table_setting']='تنظیم';
$ec_lang['lpn_settings_table_yes']='هو';
$ec_lang['lpn_settings_table_no']='نه';
$ec_lang['lpn_settings_row_of']='{setting}، {member}';
$ec_lang['lpn_settings_row_labels_field']='{labels}: {field}';
$ec_lang['lpn_settings_row_labels_part']='{labels}: {field}، {part}';
$ec_lang['lpn_settings_row_labels_customer']='د مشتریانو لیبلونه';
$ec_lang['lpn_settings_row_label_before']='مخکې متن';
$ec_lang['lpn_settings_row_label_after']='وروسته متن';
// A label field's settings, named in the Setting column with the field itself in the Owner column
// (Tom, 2026-10-07: "Symbology.Node labels.ID.Is Active", "Show order", "Drop order"). Whether the
// value appears on the label at all; where it sits on the label (1 first); which value is given up
// first when labels crowd (1 first).
$ec_lang['lpn_settings_row_label_on']='فعال دی';
$ec_lang['lpn_settings_row_label_show']='د ښودلو ترتیب';
$ec_lang['lpn_settings_row_label_drop']='د غورځولو ترتیب';
// The Setting column of an ID prefix row; the asset it applies to is in the Owner column.
$ec_lang['lpn_settings_row_id_prefix']='د ID مخکینی';
$ec_lang['lpn_settings_row_symbol_cap_multiple']='تر ټولو لوی سمبول، د عادي پایپ اوږدوالي د څو چنده په توګه';
$ec_lang['lpn_settings_row_symbol_cap_percentile']='عادي پایپ اوږدوالی، د ټولو پایپونو اوږدوالي د سلنې په توګه';
$ec_lang['lpn_settings_row_contour_labels']='د کانتور لیبلونه';
$ec_lang['lpn_settings_row_check_freq']='د حالت چک کولو دفعات';
$ec_lang['lpn_settings_row_max_check']='اعظمي حالت چکونه';
$ec_lang['lpn_settings_row_status_report']='د حالت راپور';
$ec_lang['lpn_settings_row_pda_src']='فشار پر بنسټ اختیارونه چې په فایل کې بیان شوي';
$ec_lang['lpn_settings_row_quality_option']='د کیفیت اختیار لکه چې فایل یې بیانوي';
$ec_lang['lpn_settings_row_tolerance']='دقت (زړې پروژې)';
$ec_lang['lpn_settings_row_emitter_exponent_old']='د وریز توان (زړې پروژې)';
$ec_lang['lpn_settings_row_elev_source_old']='د لوړوالي سرچینه (زړې پروژې)';
$ec_lang['lpn_settings_row_basemap']='بنسټیزه نقشه';
$ec_lang['lpn_settings_row_basemap_last']='بنسټیزه نقشه چې بیرته ورشي';
$ec_lang['lpn_settings_row_customer_max_width']='د مشتریانو لیبلونه ښکاره کړئ کله چې دې نقشې پلنوالي یا لږ ته زوم شي';
$ec_lang['lpn_settings_row_quality_step']='د کیفیت وخت ګام';
$ec_lang['lpn_settings_row_view']='د نقشې لید (مرکز او پیمانه)';
$ec_lang['lpn_settings_row_bubbles']='په نقشه کې د وخت لړۍ ګرافونه';
$ec_lang['lpn_settings_row_contour_fill']='د کانتور ډکول';
$ec_lang['lpn_settings_row_contour_opacity']='د کانتور ډکولو شفافیت';
$ec_lang['lpn_settings_row_contour_interval']='د کانتور وقفه';
$ec_lang['lpn_settings_row_contour_buffer']='د کانتور بفر';
$ec_lang['lpn_settings_row_contour_terrain']='د نقطو ترمنځ ځمکې کانتور له Mapbox DEM نه';
$ec_lang['lpn_settings_row_new_asset']='نوې شتمنۍ: {setting}';
$ec_lang['lpn_settings_row_default']='{value} (ډیفالټ)';
$ec_lang['lpn_settings_row_view_value']='مرکز {x}، {y}؛ پیمانه {s}';
$ec_lang['lpn_settings_held_in']='په {scenario} کې ځانګړی ارزښت.';
$ec_lang['lpn_settings_held_base']='{base}: {value}';
$ec_lang['lpn_settings_view_center']='د نقشې مرکز';
$ec_lang['lpn_settings_view_scale']='د نقشې پیمانه';
$ec_lang['lpn_settings_view_scale_tip']='د نقشې په مرکز کې پیمانه، لکه 1:N. 1:2000، یا یوازې 2000 ولیکئ، ترڅو هغه پیمانې ته زوم شي.';
$ec_lang['lpn_settings_view_top_left']='پورتنی کیڼ کنج';
$ec_lang['lpn_settings_view_bottom_right']='ښکتنی ښي کنج';
$ec_lang['lpn_settings_view_save']='دا لید په دې سناریو کې ساتل';
$ec_lang['lpn_settings_view_save_tip']='دا د نقشې مرکز او پیمانه په پرانیستې سناریو کې ساتي، نو دې سناریو پرانیستل نقشه دلته خوځوي. وروسته نقشه خوځول هیڅ نه بدلوي تر هغه چې دا بیا فشار کړئ. ځانګړی ارزښت پاک کړئ ترڅو بیا د {base} لید تعقیب کړئ.';
$ec_lang['lpn_settings_row_basemap_osm']='د کوڅې نقشه';
$ec_lang['lpn_settings_row_basemap_satellite']='سیټلایټ انځورونه';
$ec_lang['lpn_settings_row_basemap_topo']='ټوپو نقشه';
$ec_lang['lpn_settings_units_one_project']='واحدونه په هره سناریو کې یو شان دي.';
$ec_lang['lpn_settings_restore_base_only']='ډیفالټونه بیرته راوستلو لپاره اساس ته واړوئ.';
$ec_lang['lpn_alt_cat_physical']='فزیکي';
$ec_lang['lpn_alt_cat_demand']='غوښتنه';
$ec_lang['lpn_alt_cat_topology']='فعاله ټوپولوژي';
$ec_lang['lpn_alt_cat_topology_tip']='د شتمنۍ فعالول';
$ec_lang['lpn_alt_cat_initial']='لومړني تنظیمات';
$ec_lang['lpn_alt_cat_constituent']='جز';
$ec_lang['lpn_alt_cat_fireflow']='د اور بهاو';
$ec_lang['lpn_alt_cat_energy']='د انرژۍ لګښت';
$ec_lang['lpn_alt_cat_text']='متن';
$ec_lang['lpn_alt_cat_presentation']='وړاندې کول';
// Edited by TGH 2026-09-07
// Task 721: the scenarios every new project starts with. Keep the leading number: the list sorts
// by name, and the numbers hold Tom's order in every language.
$ec_lang['lpn_scenario_preset_flow_static']='1. د بهاو ازموینه: ثابت';
$ec_lang['lpn_scenario_preset_flow_static_tip']='د ډیزاین شبکې لپاره د بهاو ازموینې کالیبریشن په 0 بهاو کې. پدې سناریو کې په ټولو جنکشنونو کې تقاضا 0 وټاکئ.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. د بهاو ازموینه: منځنی';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='د ډیزاین شبکې لپاره د بهاو ازموینې کالیبریشن په لومړي راپور شوي بهاو کې. پدې سناریو کې په بهیدونکي جنکشن کې تقاضا د لومړي اندازه شوي بهاو سره برابره کړئ، او په نورو ټولو جنکشنونو کې 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. د بهاو ازموینه: اعظمي';
$ec_lang['lpn_scenario_preset_flow_max_tip']='د ډیزاین شبکې لپاره د بهاو ازموینې کالیبریشن په راپور شوي اعظمي بهاو کې. پدې سناریو کې په بهیدونکي جنکشن کې تقاضا د اندازه شوي اعظمي بهاو سره برابره کړئ، او په نورو ټولو جنکشنونو کې 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. منځنۍ ورځ';
$ec_lang['lpn_scenario_preset_average_day_tip']='د تقاضا ضریب 1: هره تقاضا لکه څنګه چې داخله شوې، چې د منځنۍ ورځې تقاضا ګڼل کیږي.';
$ec_lang['lpn_scenario_preset_max_day']='5. اعظمي ورځ';
$ec_lang['lpn_scenario_preset_mult_tip']='د غوښتنې ضریب {mult} ځله منځنۍ ورځ، یو ځای‌ناستی ارزښت. ډېری سیسټمونه د {lo} او {hi} ترمنځ راځي (National Research Council, 2006). د هغه سیسټم لپاره ارزښت چې ماډل کیږي په تنظیماتو، محاسبه، هایدرولیکس، د غوښتنې ضریب کې وټاکئ.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. د لوړې تقاضا ساعت';
$ec_lang['lpn_delete_drops_overrides']='د دې شتمنۍ ړنګول د هغې سناریو ارزښتونه ({n}) هم ړنګوي. دوام ورکړم؟';
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
$ec_lang['lpn_settings_elev_source_tip']='د 2026 کې د Mapbox DEM دقت، لومړی افقي بیا عمودي: په متحده ایالاتو کې 1–10 م او له 1 م لږ، په اروپا او جاپان کې 2–10 م او 1–3 م، په نړۍ کې 30 م او 10–16 م، او په قطبونو کې 90 م او له 16 م ډیر.';
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
// **THE PASHTO COLLISION THIS ANSWERS IS REAL AND IS INSIDE PASHTO** (sprint 584-wave1). ps renders
// this key with the word غلظت, which carries BOTH viscosity/thickness AND concentration -- so it
// collided with the word the same sprint used for lpn_result_concentration, on the same screen.
// Tom approved a synonym on 2026-09-06. **HIS FIRST WORDING WAS 'Relative rate of diffusion' and it
// is NOT what shipped**: that is diffusivity, and this key is viscosity. He was given a friction
// entry that quoted a translator's mistaken description of the key without anyone checking it
// against this file -- so the note below says what the number IS and what it is NOT, because two
// separate readers have now reached for a transport coefficient on a fluid property.
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
$ec_lang['lpn_settings_engine_native_tip']='دا فعاله کړئ ترڅو د امکان په صورت کې دننه جوړ شوی حل کوونکی وکارول شي. که نه، تل د متحده ایالاتو EPA د EPANET حل کوونکی کارول کیږي. دننه جوړ شوی حل کوونکی د اوږدمهاله سمولېشن یا فشار ماتوونکی او عمومي موخې والوونو (PBV، GPV) لپاره نه کارول کیږي. لومړی ځل چې د EPANET حل کوونکی کارول کیږي، شاوخوا 650 KB ډاونلوډ کیږي او بیا په دې وسیله کې ساتل کیږي. چیرې چې پایپ کوچنۍ (ځایی) ضیاع لري، دواړه حل کوونکي په وروستیو رقمونو کې توپیر لري: EPANET د جاذبې د چټکتیا ګرد شوی ارزښت کاروي، نو د هغه کوچنۍ ضیاع د دقیقې بڼې په پرتله ډیره لږه ټیټه ده.';
$ec_lang['lpn_engine_loading']='د EPANET حل کوونکی پورته کیږي…';
$ec_lang['lpn_engine_failed']='د EPANET حل کوونکی نشو پورته کیدی. د اندروني حل کوونکي ښودل کیږي.';
$ec_lang['lpn_engine_failed_why']='{reason} پر ځای یې دننه جوړ شوی حل کوونکی ښودل کیږي.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
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
// A run EPANET started and could not finish, for example when a tank empties and the junctions it
// fed have no other source (Error 110). {time} is the run time it stopped at, H:MM.
$ec_lang['lpn_time_run_stopped']='د EPANET چلول په {time} کې ودرېد، نو هیڅ پایلې نلري. د چلولو راپور ویوایي چې ولې.';
$ec_lang['lpn_time_stat_stopped']='{statistic} نه ښودل کیږي: چلول د مودې له پای مخکې ودرېد.';
$ec_lang['lpn_time_stopped_no_quality']='د اوبو د کیفیت هیڅ پایلې محاسبه نشوې، ځکه چې د کیفیت شننه د هایدرولیکي چلولو له پای وروسته پیلیږي.';
$ec_lang['lpn_energy_stopped']='د EPANET چلول د مودې له پای مخکې ودرېد، نو د پمپ د انرژۍ هیڅ پایلې محاسبه نشوې.';
$ec_lang['lpn_time_run_stopped_kept']='د EPANET چلول په {time} کې ودرېد. پایلې تر {solved} پورې دي، چې وروستی پړاو دی چې حل شو، او له هغه وروسته هیڅ نه ښودل کیږي. د چلولو راپور ویوایي چې ولې.';
// Why a stopped run stopped, read from EPANET's own run report (R-402). {link} is the link EPANET
// had just closed, {tank} the tank at one end of it, {nodes} the ids of the nodes EPANET then could
// not solve for, comma-separated. Follows lpn_time_run_stopped or lpn_time_run_stopped_kept.
$ec_lang['lpn_time_run_cut_off']='EPANET {link} بند کړی و او بیا یې {nodes} نشو حل کولی.';
$ec_lang['lpn_time_run_cut_off_full']='ټانک {tank} ډک و، نو EPANET {link} بند کړ ترڅو اوبه ورته ونه ځي، او بیا یې {nodes} نشو حل کولی. دا کیدی شي کله چې ډک ټانک څخه اوبه نه وځي، لکه کله چې هره غوښتنه صفر وي. له صفر لږ ډیره غوښتنه، یا د ټانک کچه د اعظمي نه لږه ټیټه، یې مخنیوی کوي.';
$ec_lang['lpn_time_run_cut_off_empty']='ټانک {tank} تش و، نو EPANET {link} بند کړ ترڅو نور ونه تښتي، او بیا یې {nodes} نشو حل کولی.';
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
$ec_lang['lpn_control_inactive_note']='دا کنټرولونه شتمنۍ ته اشاره کوي چې په دې سناریو کې غیرفعاله ده، نو د هغې په چلولو کې له پامه غورځول کیږي: {ids}';
$ec_lang['lpn_rule_inactive_note']='دا قواعد شتمنۍ ته اشاره کوي چې په دې سناریو کې غیرفعاله ده، نو د هغې په چلولو کې له پامه غورځول کیږي: {ids}';
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
$ec_lang['lpn_settings_text_halo']='د متن د هالې پلنوالی (د متن د اندازې سلنه)';
$ec_lang['lpn_settings_text_halo_tip']='د نقشې د متن شا ته د جامد څنډې پلنوالی، د متن د اندازې د سلنې په توګه. کله پلي کیږي چې د لیبلونو شا ته جامد شاليد چالان وي.';
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
// Task 617: a display-time filter on the street or satellite tiles only; the drawing and the credit are untouched.
$ec_lang['lpn_settings_basemap_style']='د بنسټیزې نقشې سټایل';
$ec_lang['lpn_basemap_style_normal']='عادي';
$ec_lang['lpn_basemap_style_muted']='نرم';
$ec_lang['lpn_basemap_style_faded']='ورو';
$ec_lang['lpn_basemap_style_grayscale']='خړ رنګه';
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
$ec_lang['lpn_time_statistic']='احصایه';
$ec_lang['lpn_time_stat_none']='هیڅ';
$ec_lang['lpn_time_stat_averaged']='منځنی';
$ec_lang['lpn_time_stat_minimum']='لږ ترلږه';
$ec_lang['lpn_time_stat_maximum']='زیات ترزیاته';
$ec_lang['lpn_time_stat_range']='لړه';
$ec_lang['lpn_time_clock_day']='ورځ {day}، {clock}';
$ec_lang['lpn_time_format_tip']='وخت د ساعتونو او دقیقو په بڼه ولیکئ، لکه 2:30. یوازې یوه شمېره ساعتونه معنی لري، نو 8 یعنې اته ساعته دي. نیم ساعت 0:30 دی.';
$ec_lang['lpn_time_running']='اوږدې مودې سمولېشن چلیږي.';
$ec_lang['lpn_time_no_engine']='دننه جوړ شوی حل کوونکی یو وخت یوازې یوه شېبه حلوي، نو دا شبکه یوازې په {time} کې ده: هر نمونه پر هغه شېبه لوستل کیږي، او هر ټانک په خپله پیل کچه پاتې کیږي پر ځای دې چې ډک او تش شي. یو ځل انټرنیټ سره وصل شئ ترڅو د EPANET حل کوونکی ډاونلوډ کړئ، چې اوږدې مودې سمولېشن چلوي.';
// lpn_time_no_engine says "connect to the internet", which is true only offline. For the other causes
// of a failed extended period run the same note ends in {reason}, one of the three sentences below.
$ec_lang['lpn_time_no_engine_why']='دننه جوړ شوی حل کوونکی یو وخت یوازې یوه شېبه حلوي، نو دا شبکه یوازې په {time} کې ده: هر نمونه پر هغه شېبه لوستل کیږي، او هر ټانک په خپله پیل کچه پاتې کیږي پر ځای دې چې ډک او تش شي. {reason}';
$ec_lang['lpn_time_engine_fetch_failed']='د EPANET حل کوونکي ډاونلوډ ناکام شو. بیا هڅه کولو لپاره پاڼه بیا بار کړئ؛ ممکن فایروال، پراکسي، یا د براوزر توسیع یې بندوي.';
$ec_lang['lpn_time_engine_start_failed']='براوزر د EPANET حل کوونکي د پیلولو نه ډډه وکړه. ممکن WebAssembly د امنیت تنظیم یا توسیع له خوا بند شوی وي.';
$ec_lang['lpn_time_engine_run_failed']='د EPANET چلول ناکام شول. دا د دې پاڼې نیمګړتیا ده؛ د راپور ورکولو لپاره د {wrong} لینک وکاروئ.';
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
$ec_lang['lpn_time_run_report']='چلول: راپور';
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
$ec_lang['lpn_saved_project']='د پروژې سره ساتل شوی';
$ec_lang['lpn_saved_browser']='په دې براوزر کې ساتل شوی';
$ec_lang['lpn_saved_session']='نه دی ساتل شوی';
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
// Row label only (the box title is lpn_time_run_report). Tom, 2026-10-07: no row carries '(EPANET)';
// the tips say where a report comes from. Run is EPANET's verbatim report.
$ec_lang['lpn_reports_epanet']='چلول';
$ec_lang['lpn_energy_title']='پمپ: د انرژۍ راپور';
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
$ec_lang['lpn_scncmp_title']='سناریو: پرتله';
$ec_lang['lpn_scncmp_menu_tip']='د سناریوګانو جدول د ځانګړو ارزښتونو شمېر، ټیټ ترین فشار، او لوړ ترین سرعت سره';
$ec_lang['lpn_scncmp_running']='هر سناریو حل کیږي…';
$ec_lang['lpn_scncmp_empty']='تر اوسه هیڅ شی نه دی رسم شوی، نو دلته د حل کولو لپاره هیڅ شی نشته.';
$ec_lang['lpn_scncmp_col_maxvelocity']='ترټولو لوړ سرعت';
$ec_lang['lpn_scncmp_same']='په هره سناریو کې یو شان';
$ec_lang['lpn_scncmp_period_note']='چیرته چې یوه سناریو ټول چلولو وخت لري، د هغې ټیټ ترین فشار او لوړ ترینه سرعت د ټولې شبکې انتها ده، په ښودل شوي وخت کې.';
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
// **THE ROW AND THE BOX TITLE BOTH SAY "Status changes"** (Tom, 2026-10-07), so menu and box agree.
$ec_lang['lpn_reports_status']='د حالت بدلونونه';
$ec_lang['lpn_reports_status_tip']='د وخت په ترتیب سره د حالت بدلونونو جدول چې د وروستي اوږدې مودې سمولېشن د EPANET له وخت ګامونو لوستل شوی: پمپونه او والوونه پرانیستل یا بندېدل، ټانکونه ډکیدل، تشیدل، ډک کیدل یا وچیدل، او هغه ګامونه چې په بشپړه توګه همغږي نشول.';
$ec_lang['lpn_status_title']='حالت: بدلونونه';
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
$ec_lang['lpn_heading_unit']='{label} ({unit})';
$ec_lang['lpn_result_concentration_short']='غلظت';
$ec_lang['lpn_quality_named_concentration_short']='د {chemical} غلظت';
$ec_lang['lpn_full_row_count']='قطارونه ({n}).';

// ---- The Calibration report (ROADMAP Task 601) -------------------------------------------------
// EPANET's Report > Calibration and its three tabbed pages, with EPANET's own column names (EPANET
// 2.2 manual, section 9.6). Mean error is EPANET's term for the mean ABSOLUTE difference. "Num obs"
// is EPANET's own column heading, kept short because results columns are narrow.
// lpn_calib_missing: keep in step with feat/profile-file's lpn_profile_file_missing (Task 604), the same sentence.
$ec_lang['lpn_reports_calib']='کالیبریشن';
$ec_lang['lpn_reports_calib_tip']='د کالیبریشن فایل د اندازه شوو ساحوي معلوماتو سره د وروستي چلولو پرتله کول: احصایې، یو همبستګي انځور، او د منځنیو پرتله کول.';
$ec_lang['lpn_calib_title']='کالیبریشن: راپور';
$ec_lang['lpn_calib_param']='پارامیټر';
$ec_lang['lpn_calib_param_tip']='هغه کمیت چې د کالیبریشن فایل یې اندازه کوي. د هر پارامیټر لپاره یو فایل ساتل کیږي.';
$ec_lang['lpn_calib_load']='د کالیبریشن فایل پورته کړئ…';
$ec_lang['lpn_calib_load_tip']='یو متني فایل چې په هره کرښه کې د ځای نوم، یو وخت، او یو اندازه شوی ارزښت لري. وخت د سمولېشن له پیل نه، په اعشاري ساعتونو یا ساعت:دقیقو اندازه کیږي. یو سیمیکولن یو نظر پیلوي. هغه کرښه چې یوازې وخت او ارزښت لري هغې ته تړلې ده چې پورته ده.';
$ec_lang['lpn_calib_none']='د دې پارامیټر لپاره هیڅ د کالیبریشن فایل نه دی پورته شوی.';
$ec_lang['lpn_calib_session']='د کالیبریشن فایل یوازې د دې ناستې لپاره ساتل کیږي. دا له پروژې سره یا پدې وسیله کې خوندي نه کیږي.';
$ec_lang['lpn_calib_file']='{file}: اندازې ({n}) په ځایونو ({m}) کې.';
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
// **THE SYNONYMS ARE TOM'S OWN, GIVEN 2026-08-24**, which is the written permission this array
// requires. "Pattern" is the discipline's standard term and stays the label; the payload exists so
// a translator who cannot recover the concept from that one word has the shape of it.
//
// "Run" was on his list and he struck it the same day, on the collision: this page's Run is the
// button that plays an extended-period simulation back, so a translator reaching for their word for
// a program run would have named the wrong thing. Tom: *"Yes. It's not the best term."*
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
$ec_lang['lpn_library_curve_in_use']='دا منحنۍ د عناصرو ({count}) له خوا کارول کیږي: {ids}. لومړی هغوی بلې منحنۍ ته وګرځوئ، بیا دا یوه ړنګه کړئ.';
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
$ec_lang['lpn_library_pipetype_in_use']='دا د پایپ ډول د پایپونو ({count}) لخوا کارول کیږي: {ids}. مخکې لدې چې یې ړنګ کړئ، لومړی یې له دوی نه بېل کړئ.';
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
$ec_lang['lpn_library_fittings_in_use']='دا د فیتینګونو لړلیک د پایپونو ({count}) لخوا کارول کیږي: {ids}. مخکې لدې چې یې ړنګ کړئ، لومړی یې له دوی نه بېل کړئ.';
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
$ec_lang['lpn_field_fittings_tip']='د پروژې له کتابتون نه د فیټینګونو لړلیک. د هغوی مقدارونه او کوفیشنټونه د دې پایپ د ځایی ضیاع کوفیشنټ کې جمع کیږي، او د کوفیشنټ بکس بیا یوازې د لوستلو وي. کوفیشنټ پخپله د ننوتلو لپاره هیڅ لړلیک مه ټاکئ.';
$ec_lang['lpn_fittings_none']='هیڅ د فیټینګونو لړلیک نه دی ټاکل شوی';
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
// Tom, 2026-09-30, ruling sprint 2026-09-30-golf item 1: _syn = "All junctions" / "Selected junctions".
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
$ec_lang['lpn_inp_export_flat_lead']='صادر شوی د EPANET فایل د دې پروژې سره په شمېرو کې مساوي دی. خو دا د لاندې شیانو لپاره ځای نلري:';
$ec_lang['lpn_inp_export_flat_types']='دلته پایپونه ({n}) د پایپ ډولونو ({t}) ته اشاره کوي. په فایل کې له دغو پایپونو هر یو د شمېرو خپله کاپي لري، نو ځوابونه یو شان دي. هغه څه چې فایل یې نشي ساتلی د پایپ ډول پخپله دی، نو د یو تعریف او هر هغه پایپ ترمنځ اړیکه چې کاروي یې یوازې په پروژه فایل کې ثبتیږي.';
$ec_lang['lpn_inp_export_flat_coords']='د EPANET فایل د هرې نقطې لپاره یو ځای ساتي. دا سناریو له دوی {n} بل چیرته ځای پر ځای کوي، او دا په فایل کې ځایونه دي. هره بله سناریو خپل ځایونه یوازې په پروژه فایل کې ساتي.';
$ec_lang['lpn_inp_export_flat_fittings']='د EPANET فایل نشي کولی ستاسو د پروژې فایل کې د کونجونو، والوګانو او ټیانو لړلیک وساتي. دلته د پایپونو ({n}) د ځایی ضیاع کوفیشنټ د یوه فیتینګونو لړلیک نه راټول شوی دی. مجموعه لکه څنګه چې ده فایل ته ځي، نو د ځوابونو په اړه هیڅ شی نه بدلیږي.';
$ec_lang['lpn_library_controls']='کنترولونه';
$ec_lang['lpn_library_controls_tip']='کنټرول یوه بیان دی چې یو تړاو خلاصوي یا بندوي، یا یې ترتیب بدلوي، د ټانک د اوبو د کچې، د نقطې د فشار، یا د وخت پر بنسټ.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='یوه نمونه اضافه کړئ';
$ec_lang['lpn_library_pattern_values']='ضربوونکي';
$ec_lang['lpn_library_pattern_values_tip']='ضربوونکي، چې د خالي ځایونو یا کامو سره جلا شوي دي. که تاسو یو سپریډشیټ لرئ، یو ستون یې پیسټ کړئ. لیست تر هغه وخته تکراریږي چې چلول دوام لري، نو اړتیا نشته چې ټول چلول پوښي.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='ضربوونکي: {n}، {step} تر منځ واټن، چې {span} پوښي';
// Under the pattern graph, beside the clock-time row: the ordinal of each time period (1, 2, 3).
$ec_lang['lpn_library_pattern_axis_step']='ګام';
$ec_lang['lpn_library_pattern_none']='هیڅ نمونه نشته';
// The blank first option of a selector whose blank follows a project-wide default (a junction's or
// customer's demand pattern, a pump's price pattern and efficiency curve). Tom, 2026-10-04.
$ec_lang['lpn_choice_default']='ډیفالټ';
$ec_lang['lpn_settings_default_pattern']='د غوښتنې تلواله نمونه';
$ec_lang['lpn_settings_default_pattern_tip']='هر جنکشن چې نمونه نلري دا کاروي.';
$ec_lang['lpn_junction_pattern_unknown']='پدې پروژه کې هیڅ نمونه د {id} ID نلري، نو جنکشن هماغسې پاتې شو لکه څنګه چې و.';
$ec_lang['lpn_settings_default_pattern_none']='هیڅ (ثابت)';
$ec_lang['lpn_demand_pattern_default']='(ډیفالټ: {id})';
$ec_lang['lpn_demand_pattern_constant']='(ثابت)';
$ec_lang['lpn_library_pattern_default_mark']='(ډیفالټ)';
$ec_lang['lpn_library_pattern_default_tip']='د غوښتنې ډیفالټ نمونه. په تنظیماتو، د غوښتنې ډیفالټ نمونه کې یې بدل کړئ.';
$ec_lang['lpn_library_pattern_default_deleted_to']='نمونه {id} د غوښتنې ډیفالټ نمونه وه. هغه جنکشنونه چې نمونه نلري اوس نمونه {now} کاروي.';
$ec_lang['lpn_library_pattern_default_deleted_none']='نمونه {id} د غوښتنې ډیفالټ نمونه وه. هغه جنکشنونه چې نمونه نلري اوس ثابته غوښتنه کاروي.';
$ec_lang['lpn_library_pattern_default_deleted_also']='سناریوګانې چې دا یې هم د خپل ډیفالټ په توګه کارولو: {list}.';
$ec_lang['lpn_library_pattern_default_deleted_in']='نمونه {id} په دې سناریوګانو کې د غوښتنې ډیفالټ نمونه وه: {list}.';
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
$ec_lang['lpn_terrain_confirm_default_2']='د هغو نقطو ({n}) لوړوالی د Mapbox DEM نه د ارزښتونو سره بدل شي؟';
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
$ec_lang['lpn_analyze_menu']='تحلیل';
$ec_lang['lpn_analyze_menu_tip']='هغه تحلیلونه چې شبکه پر یوې کاپي چلوي: په هر جنکشن کې د اور بهاو، د هر پایپ، پمپ، او والو ضایع، او پورته یا ښکته شوې غوښتنې.';
$ec_lang['lpn_ff_menu']='د اور بهاو شننه…';
$ec_lang['lpn_ff_menu_tip']='هر ټاکل شوی جنکشن د اور بهاو لپاره ازمویئ، او د پاتې سیسټم پر اغیز یې وګورئ';
$ec_lang['lpn_ff_title']='اور بهاو: شننه';
$ec_lang['lpn_ff_intro']='هر جنکشن په نوبت د خپلې موجودې غوښتنې پر سر یو اور مړولو بهاو راباسي. چلون د شبکې یوه کاپي د پرده پر وخت ګام کې کاروي، نو په پروژه کې هیڅ نه بدلیږي.\n\nد اور مړولو بهاو معمولاً د اعظمي ورځې غوښتنې پر وخت ازمویل کیږي، نو شبکه لومړی هغې حالت ته وټاکئ.\n\nهر ازمویل شوی جنکشن د ټولې شبکې شاوخوا 16 حلونه غواړي، نو لوی سیسټم څو دقیقې نیسي: مخکې له چلولو جنکشنونه وټاکئ، او هر وخت ودریږئ ترڅو نیمګړې پایلې وساتل شي.';
$ec_lang['lpn_ff_scope']='هغه جنکشنونه چې ازمویل شي';
$ec_lang['lpn_ff_all']='ټول جنکشنونه';
$ec_lang['lpn_ff_selected']='ټاکل شوي جنکشنونه';
$ec_lang['lpn_ff_no_junctions']='دا پروژه لا هیڅ جنکشن نلري، نو د ازموینې لپاره هیڅ شی نشته.';
$ec_lang['lpn_ff_no_selection']='هیڅ جنکشن ټاکل شوی نه دی. جنکشنونه وټاکئ یا د «ټول» اختیار وټاکئ.';
$ec_lang['lpn_ff_skipped']='{n} ټاکل شوي عناصر جنکشنونه نه دي، نو ازمویل شوي نه دي.';
$ec_lang['lpn_ff_required']='اړینه اور بهاو';
$ec_lang['lpn_ff_required_tip']='هغه بهاو چې د پلي کیدونکي اور قانون یا د اور ادارې له خوا په یوه اور-خونده کې اړین دی. هر جنکشن د دې ارزښت پر وړاندې ازمویل کیږي، پرته له دې چې د هغه جنکشن لپاره اړین اور بهاو ولیکل شي.';
$ec_lang['lpn_ff_required_own']='هغه جنکشنونه چې انفرادي اړین اور بهاو لري پر ځای یې د هغه ارزښت پر وړاندې ازمویل کیږي. د دوی شمېر: {n}.';
$ec_lang['lpn_ff_required_node_tip']='په دې جنکشن کې د اور بهاو اړتیا د هغې ځمکې کارونې لپاره چې خدمتوي، د پلي کیدونکي اور قانون یا د اور ادارې له مخې. یې خالي پرېږدئ ترڅو جنکشن د اور بهاو: شننه بکس کې د ارزښت پر وړاندې ازمویل شي.';
$ec_lang['lpn_ff_residual']='پاتې فشار چې وساتل شي';
$ec_lang['lpn_ff_residual_tip']='هغه فشار چې جنکشن باید لا هم وساتي پداسې حال کې چې اور بهاو وړاندې کوي. AWWA M31 او NFPA 291 20 psi (140 kPa) کاروي.';
$ec_lang['lpn_ff_design']='ډیزاین چک (پر سیسټم اغیز)';
$ec_lang['lpn_ff_design_tip']='له دې پوښتنې نه بېله چې آیا جنکشن دا بهاو وړاندې کولی شي: کله چې هلته دا بهاو راایستل کیږي، آیا کوم بل جنکشن له خپل لږ ترلږه فشار نه ټیټیږي یا کوم پایپ د خپل سرعت له حد نه زیاتیږي؟ دا چک هیڅ اضافي محاسبه نه غواړي.';
$ec_lang['lpn_ff_design_off']='هیڅ';
$ec_lang['lpn_ff_design_all']='ټول';
$ec_lang['lpn_ff_design_selected']='ټاکل شوي';
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
$ec_lang['lpn_ff_summary_error']='جنکشنونه چې نشول حل کیدی ({n}).';
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
$ec_lang['lpn_ff_more']='او {n} نور اغیزمن شوي';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='{n} نور جنکشنونه نه دي ښودل شوي.';
$ec_lang['lpn_ff_rows_more_links']='نه ښودل شوي تړاوونه: {n}.';
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

// ---- Water > Criticality analysis (Tom, 2026-09-30) -------------------------------------------
//
// Break each asset in turn, on a copy, and report what the system loses. "Criticality analysis" is
// the industry's term (WaterGEMS, InfoWater); EPANET has no such tool and no word for it. The run
// dialog, Run, Stop, the engine sentence and the cost line are fire flow's own keys.
//
// {n}, {done} and {total} are whole numbers; {pressure} is a pressure with its unit.
$ec_lang['lpn_crit_menu']='د مهمیت تحلیل…';
$ec_lang['lpn_crit_menu_tip']='هر پایپ، پمپ، او والو په نوبت سره له شبکې لرې کړئ او په سیسټم یې اغیز راپور کړئ.';
$ec_lang['lpn_crit_title']='مهمیت: تحلیل';
$ec_lang['lpn_crit_intro']='هره شتمني په نوبت سره له شبکې نه ایستل کیږي، او شبکه په فعاله سناریو کې د پرده پر وخت ګام کې حل کیږي. په پروژه کې هیڅ نه بدلیږي؛ ټوله چلون پر یوې کاپي کیږي.';
$ec_lang['lpn_crit_scope']='هغه تړاوونه چې ماتېږي';
$ec_lang['lpn_crit_scope_tip']='ټول پایپونه، پمپونه، او والوونه، یا یوازې هغه چې پر نقشه ټاکل شوي. مخکې له چلولو ډله غوره کړئ.';
$ec_lang['lpn_crit_scope_all']='ټول تړاوونه';
$ec_lang['lpn_crit_scope_selected']='ټاکل شوي تړاوونه';
$ec_lang['lpn_crit_minpressure']='ټیټ ترین اجازه شوی فشار';
$ec_lang['lpn_crit_minpressure_tip']='دا هماغه شمېره ده چې په اور بهاو: شننه بکس کې د ټیټ ترین اجازه شوي فشار په نوم ده. دلته یې بدلول هلته هم بدلوي.';
$ec_lang['lpn_crit_col_asset']='شتمني';
$ec_lang['lpn_crit_col_unserved']='نه خدمت شوې غوښتنه';
$ec_lang['lpn_crit_col_cutoff']='پرې شوي جنکشنونه';
$ec_lang['lpn_crit_col_below']='جنکشنونه تر ټیټ ترین حد ښکته';
$ec_lang['lpn_crit_summary']='هغه شتمنۍ چې غوښتنه نه خدمتوي یا یو جنکشن تر {pressure} ښکته کوي ({n} له {total}).';
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
$ec_lang['lpn_ds_menu']='د غوښتنې پیمانه کول…';
$ec_lang['lpn_ds_menu_tip']='د شبکې په یوه کاپي کې غوښتنې ضرب کړئ او فشارونه او سرعتونه وګورئ، یا هغه لوی ترینه د غوښتنې پیمانه ومومئ چې سیسټم یې پورته کولی شي.';
$ec_lang['lpn_ds_title']='غوښتنه: پیمانه کول';
$ec_lang['lpn_ds_intro']='د چلولو تڼۍ فشار کړئ ترڅو په ټاکل شویو جنکشنونو کې غوښتنې د غوښتنې پیمانې سره ضرب کړئ او فشارونه او سرعتونه وګورئ.\n\nد موندلو تڼۍ فشار کړئ ترڅو لوی ترینه د غوښتنې پیمانه ومومئ، تر نږدې {step} پورې، چیرته چې دا ټول جنکشنونه لږ ترلږه اجازه شوی فشار ساتي؛ دا له 0 تر {max} پورې لټوي.\n\nدواړه د شبکې پر کاپي کار کوي، چې په فعاله سناریو کې د پرده پر وخت ګام حل شوې ده، نو په پروژه کې هیڅ نه بدلیږي. یوازې همدا وخت ګام پیمانه کیږي، او کچې او حالتونه له هغه څخه اخیستل کیږي؛ د لوړې غوښتنې ازمایښت لپاره، مخکې له چلولو ساعت لوړې غوښتنې ته یوسئ.';
$ec_lang['lpn_ds_scope']='هغه جنکشنونه چې پیمانه کیږي';
$ec_lang['lpn_ds_head_scale']='غوښتنې پیمانه کول';
$ec_lang['lpn_ds_multiplier']='د غوښتنې پیمانه';
$ec_lang['lpn_ds_multiplier_tip']='هغه فکتور چې هره غوښتنه پرې ضرب کیږي؛ 1.5 یعنې 50٪ زیاتوالی. دا د فعالې سناریو د غوښتنې ضریب سربیره پلي کیږي، چې لا دمخه په غوښتنو کې دی، او هیڅکله په پروژه کې نه ساتل کیږي.';
$ec_lang['lpn_ds_head_search']='سیسټم کومه د غوښتنې پیمانه پورته کولی شي؟';
$ec_lang['lpn_ds_head_search_selected']='دا جنکشنونه کومه د غوښتنې پیمانه پورته کولی شي؟';
$ec_lang['lpn_ds_outside_below']='د {m} د غوښتنې پیمانې په وخت کې، هغه جنکشنونه چې نه دي ټاکل شوي او له {pressure} نه ټیټ دي: {n} ({ids}). دوی دا ځواب نه محدودوي.';
$ec_lang['lpn_ds_holds_max']='✓ هر جنکشن تر {max} د غوښتنې پیمانې پورې، چې د لټون سر دی، {pressure} ساتي.';
$ec_lang['lpn_ds_below_zero']='⚠ لږ تر لږه یو جنکشن له {pressure} نه ټیټ دی حتی کله چې پیمانه شوې غوښتنې صفر وي.';
$ec_lang['lpn_ds_found']='✓ هر چک شوی جنکشن تر {m} د غوښتنې پیمانې پورې لږ تر لږه {pressure} ساتي.';
$ec_lang['lpn_ds_found_below']='⚠ غوښتنې لکه ننوتل شوې (د غوښتنې پیمانه 1) لږترلږه یو جنکشن له {pressure} نه ښکته پریږدي. تر ټولو لویه د غوښتنې پیمانه چې هر جنکشن په {pressure} یا پورته ساتي {m} ده.';
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
$ec_lang['lpn_ds_skipped']='هغه ټاکل شوي عنصرونه چې جنکشنونه نه دي، لکه څنګه چې دي پرېښودل شوي: {n}.';
$ec_lang['lpn_ds_bad_multiplier']='د غوښتنې پیمانه صفر یا ډېره ولیکئ، لکه 1.5.';
$ec_lang['lpn_ds_stale']='انځور بدل شو، نو د غوښتنې پیمانه کولو پایلې پاکې شوې. بیا یې چلوئ.';
$ec_lang['lpn_analyze_at_time']='د وخت ګام: {time}.';
$ec_lang['lpn_analyze_time_moved']='⚠ دا په {time} کې محاسبه شوی و، او ساعت اوس په {now} کې دی. د سکرین پر وخت ګام یې بیا چلوئ.';

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
// GeoJSON import of Shapes (Task 779). Only points, lines and polygons come in, as Shapes; the
// network is imported from an EPANET file. Every feature not imported is named in the report.
$ec_lang['lpn_file_import_shapes']='د GeoJSON شکلونه دننه کول…';
$ec_lang['lpn_file_import_shapes_tip']='د GeoJSON فایل ټکي، کرښې، او څو ضلعي په دې پروژه کې د شکلونو په توګه ولولئ. په فایل کې د شبکې شتمنۍ دننه نه کیږي؛ شبکه د EPANET له فایل نه یا د GeoJSON شبکې دننه کول سره دننه کړئ. پروژه باید جغرافیوي شوې وي یا همغږۍ سیسټم وښيي.';
$ec_lang['lpn_file_import_gjnet']='GeoJSON شبکه دننه کول…';
$ec_lang['lpn_file_import_gjnet_tip']='GeoJSON فایل د نوې پروژې په توګه پرانیزئ. ټکي د جنکشنونو، ذخیرو، یا ټانکونو په توګه دننه کیږي، او کرښې د پایپونو په توګه. له دې پاڼې نه صادر شوی فایل لکه لیکل شوی لوستل کیږي؛ د هر بل فایل لپاره، یو ګام ساحې ځانتیاوو او واحدونو ته نقشه کوي.';
$ec_lang['lpn_gjnet_refuse_crs']='{file} همغږۍ سیسټم {crs} بیانوي. د GeoJSON موقعیتونه WGS 84 عرض البلد او طول البلد دي (RFC 7946)، او دا پاڼه د GeoJSON فایل له بل سیسټم نه نه بدلوي. پرت له GIS نه په EPSG:4326 (WGS 84) کې صادر کړئ، بیا هغه فایل دننه کړئ.';
$ec_lang['lpn_gjnet_refuse_empty']='{file} ټکي یا کرښې نه لري.';
$ec_lang['lpn_gjnet_target_node_type']='د نقطې ډول';
$ec_lang['lpn_gjnet_target_custom']='ځانګړې ځانتیا';
$ec_lang['lpn_gjnet_target_skip']='دننه مه کوئ';
$ec_lang['lpn_gjnet_points_heading']='د ټکو ساحې (جنکشنونه، ذخیرې، او ټانکونه)';
$ec_lang['lpn_gjnet_lines_heading']='د کرښو ساحې (پایپونه)';
$ec_lang['lpn_gjnet_no_fields']='دا ځانګړتیاوې د ځانتیاوو ساحې نه لري.';
$ec_lang['lpn_gjnet_col_field']='ساحه';
$ec_lang['lpn_gjnet_col_example']='بېلګه';
$ec_lang['lpn_gjnet_col_fills']='ډکوي';
$ec_lang['lpn_gjnet_col_unit']='واحد';
$ec_lang['lpn_gjnet_beta']='بیټا: نظر غوښتل شوی';
$ec_lang['lpn_gjnet_beta_tip']='دا دننه کول په GIS برنامو کې په لږو فایلونو ازمویل شوی. د ستونزې راپور ورکولو یا بدلون وړاندیز لپاره، په پاڼه کې {button} فشار کړئ او فایل بیان کړئ.';
$ec_lang['lpn_gjnet_intro']='{points} ټکي او {lines} کرښې وموندل شوې. ټکي د جنکشنونو، ذخیرو، یا ټانکونو په توګه دننه کیږي، او کرښې د پایپونو په توګه. هغه ځانتیا وټاکئ چې هره ساحه یې ډکوي او د هرې شمیرې واحد.';
$ec_lang['lpn_gjnet_other']='{n} ځانګړتیاوې نه ټکي دي نه کرښې او دننه نه کیږي؛ راپور یې لیست کوي.';
$ec_lang['lpn_gjnet_tolerance']='د نښلولو زغم (m)';
$ec_lang['lpn_gjnet_tolerance_tip']='د کرښې پای چې له ټکي یا بلې کرښې له پای نه په دې واټن کې وي ورسره نښلول کیږي. د کرښې پای چې له هر ټکي نه ددې نه لرې وي نوی جنکشن ترلاسه کوي.';
$ec_lang['lpn_gjnet_working']='{file} دننه کیږي…';
$ec_lang['lpn_gjnet_title']='GeoJSON شبکه دننه کول: {file}';
$ec_lang['lpn_gjnet_report_lead']='هر هغه بدلون چې د دننه کولو پر مهال شوی، او هره ځانګړتیا چې دننه نه شوه، لاندې د دلیل سره لیست شوې:';
$ec_lang['lpn_gjnet_and_more']='او {n} نور';
$ec_lang['lpn_gjnet_note_crs']='فایل همغږۍ سیسټم {crs} بیانوي، چې WGS 84 عرض البلد او طول البلد دی، هغه سیسټم چې RFC 7946 یې غواړي. موقعیتونه لکه بیان شوي لوستل شول.';
$ec_lang['lpn_gjnet_note_crs_nad83']='فایل NAD83 (EPSG:4269) بیانوي. د هغې موقعیتونه د WGS 84 په توګه ولوستل شول، چې دوی هغه ځای ته شاوخوا 1 تر 2 m کې ځای پر ځای کوي چیرې چې NAD83 یې ځای پر ځای کوي.';
$ec_lang['lpn_gjnet_note_skip_geometry']='دننه نه شو: ځانګړتیا ټکی یا کرښه نه ده.';
$ec_lang['lpn_gjnet_note_skip_kind']='دننه نه شو: ځانګړتیا نه node_type او نه link_type بیانوي.';
$ec_lang['lpn_gjnet_note_skip_position']='دننه نه شو: موقعیت د سم عرض البلد او طول البلد نه دی.';
$ec_lang['lpn_gjnet_note_skip_id']='دننه نه شو: نوم سم ID نه دی، یا بل عنصر د ورته ډول لري.';
$ec_lang['lpn_gjnet_note_skip_no_node']='دننه نه شو: نومول شوې پیل یا پای نقطه په فایل کې نشته.';
$ec_lang['lpn_gjnet_note_skip_loop']='دننه نه شو: د کرښې دواړه پایونه یوې ورته نقطې سره نښلوي.';
$ec_lang['lpn_gjnet_note_id_new']='دا ځانګړتیاوې سم ID نه بیانوي او هغه ID ورکړل شو چې په قوسونو کې ښودل شوی.';
$ec_lang['lpn_gjnet_note_id_dup']='دا ID د ورته ډول له یوې ځانګړتیا ډیرو لخوا بیان شوي. هره وروستۍ ځانګړتیا هغه ID ترلاسه کړ چې په قوسونو کې ښودل شوی.';
$ec_lang['lpn_gjnet_note_unmapped_id_point']='د ټکي ID لپاره هیڅ ساحه نه وه ټاکل شوې، نو له ټکي نه دننه شوې هره نقطه ID ترلاسه کړ.';
$ec_lang['lpn_gjnet_note_unmapped_id_line']='د کرښې ID لپاره هیڅ ساحه نه وه ټاکل شوې، نو هر پایپ ID ترلاسه کړ.';
$ec_lang['lpn_gjnet_note_skip_short']='دننه نه شو: کرښه لږترلږه دوه موقعیتونه غواړي.';
$ec_lang['lpn_gjnet_note_elev_taken']='دا نقطې لوړوالی نه بیانوي. هر یو هغه نقطې لوړوالی ترلاسه کړ چې په قوسونو کې ښودل شوی: د کرښې په پای کې اضافه شوي جنکشن لپاره، د هغې پایپ بل پای نقطه، که نه نږدې نقطه چې یو بیانوي.';
$ec_lang['lpn_gjnet_note_default_elev_added']='دا جنکشنونه د کرښې په پایونو کې اضافه شول او ډیفالټ لوړوالی لري، {value}، ځکه چې په فایل کې هیڅ نقطه لوړوالی نه بیانوي.';
$ec_lang['lpn_gjnet_note_demand_kept']='ذخیره یا ټانک غوښتنه نه لري، نو په دې نقطو کې بیان شوې غوښتنه د ځانګړې ځانتیا {key} په توګه ساتل شوه.';
$ec_lang['lpn_gjnet_note_parts']='دا څو برخې کرښې هغه برخې لري چې نه وصل دي او د هرې برخې لپاره د یو پایپ په توګه دننه شوې.';
$ec_lang['lpn_gjnet_note_parts_points']='دا څو ټکي ځانګړتیاوې د هر ټکي لپاره د یوې نقطې په توګه دننه شوې.';
$ec_lang['lpn_gjnet_note_junction_added']='دا جنکشنونه هلته اضافه شول چیرې چې د کرښې پای د ټکي له {tol} کې نه دی. هر یو ډیفالټ اساسي غوښتنه لري.';
$ec_lang['lpn_gjnet_note_end_moved']='دا پایپونه پای لري چې د ټکي یا بلې کرښې له پای {tol} کې دی، خو په هغې نه. پای ورسره نښلول شو؛ تر ټولو لوی واټن {dist} دی.';
$ec_lang['lpn_gjnet_note_end_on_pipe']='دا د کرښې پایونه په هغه پایپ کې دي چې په قوسونو کې ښودل شوی، خو د هغې په پای کې نه، او ورسره نه نښلول کیږي.';
$ec_lang['lpn_gjnet_note_z']='دا ټکي دریم همغږی بیانوي، چې دننه نه شو.';
$ec_lang['lpn_gjnet_note_default_elev']='دا نقطې لوړوالی نه بیانوي او ډیفالټ لوړوالی لري، {value}.';
$ec_lang['lpn_gjnet_note_unmapped_elev']='د لوړوالي لپاره هیڅ ساحه نه وه ټاکل شوې، نو هره نقطه ډیفالټ لوړوالی لري، {value}، او اتوماتیک اوږدوالي هیڅ د لوړوالي توپیر نه شاملوي.';
$ec_lang['lpn_gjnet_note_default_demand']='دا جنکشنونه اساسي غوښتنه نه بیانوي او ډیفالټ اساسي غوښتنه لري، {value}.';
$ec_lang['lpn_gjnet_note_unmapped_demand']='د اساسي غوښتنې لپاره هیڅ ساحه نه وه ټاکل شوې، نو هر جنکشن ډیفالټ اساسي غوښتنه لري، {value}.';
$ec_lang['lpn_gjnet_note_default_diameter']='دا پایپونه قطر نه بیانوي او ډیفالټ قطر لري، {value}.';
$ec_lang['lpn_gjnet_note_unmapped_diameter']='د قطر لپاره هیڅ ساحه نه وه ټاکل شوې، نو هر پایپ ډیفالټ قطر لري، {value}.';
$ec_lang['lpn_gjnet_note_default_roughness']='دا پایپونه خشونت نه بیانوي او ډیفالټ خشونت لري، {value}.';
$ec_lang['lpn_gjnet_note_unmapped_roughness']='د خشونت لپاره هیڅ ساحه نه وه ټاکل شوې، نو هر پایپ ډیفالټ خشونت لري، {value}.';
$ec_lang['lpn_gjnet_note_default_k']='دا پایپونه کوچنۍ ضیاع ضریب نه بیانوي، نو هر یو 0 لري، لکه د EPANET فایل کې چې هیڅ نه بیانوي.';
$ec_lang['lpn_gjnet_note_unmapped_k']='د کوچنۍ ضیاع ضریب لپاره هیڅ ساحه نه وه ټاکل شوې، نو هر پایپ 0 لري، لکه د EPANET فایل کې چې هیڅ نه بیانوي.';
$ec_lang['lpn_gjnet_note_default_tank']='دا ټانکونه ډیفالټ د اوبو ژوروالی او د ټانک قطر لري.';
$ec_lang['lpn_gjnet_note_length_auto']='دا پایپونه اوږدوالی نه بیانوي. هر اوږدوالی له کرښې محاسبه کیږي (اتومات).';
$ec_lang['lpn_gjnet_note_unmapped_length']='د اوږدوالي لپاره هیڅ ساحه نه وه ټاکل شوې، نو د هر پایپ اوږدوالی له کرښې محاسبه کیږي (اتومات).';
$ec_lang['lpn_gjnet_note_value_unread']='دا ارزښتونه شمیرې نه دي یا نه پیژندل کیږي، او نه کارول شول.';
$ec_lang['lpn_gjnet_note_field_skipped']='دا ساحې دننه نه شوې، لکه چې وټاکل شول.';
$ec_lang['lpn_gjnet_note_field_custom']='دا ساحې د ځانګړو ځانتیاوو په توګه دننه شوې.';
$ec_lang['lpn_gjnet_note_results']='په فایل کې پایلې دننه نه شوې. محاسبه کول بیا محاسبه کوي.';
$ec_lang['lpn_gjnet_note_demand_rows']='دا جنکشنونه له یوې غوښتنې قطار ډیر درلودل. GeoJSON فایل یوازې لومړی ساتي، چې دننه شو.';
$ec_lang['lpn_gjnet_note_pipe_type']='دا پایپونه د پایپ ډول بیانوي چې په قوسونو کې ښودل شوی، چې تعریف یې GeoJSON فایل نه لري. د پایپ ډول دننه نه شو؛ قطر او خشونت چې په فایل کې بیان شوي دننه شول.';
$ec_lang['lpn_gjnet_note_pattern_conflict']='دا نمونې په بیلابیلو ځانګړتیاوو کې په بیلابیلو ضریبونو بیان شوې. لومړی کارول شو.';
$ec_lang['lpn_gjnet_note_end_off_node']='د دې هر تړاو کرښه په خپله نقطه نه پیلیږي یا پای ته نه رسیږي. د نقطې موقعیت کارول شو.';
$ec_lang['lpn_gjnet_note_not_held']='GeoJSON فایل کنټرولونه، قواعد، د وخت تنظیمات، متني لیبلونه، EPANET اختیارونه، یا د پایپ ډول، فیتینګونو، او موثریت منحنۍ کتابتونونه نه لري، نو له دې هیڅ یو دننه نه شو.';
$ec_lang['lpn_geojson_import_done']='{n} شکلونه له {file} نه دننه شول.';
$ec_lang['lpn_geojson_import_done_one']='یو شکل له {file} نه دننه شو.';
$ec_lang['lpn_geojson_import_renamed']='{n} د ځانګړتیاوو نومونه د شکل د ID په توګه نشي کارول کیدی. هر شکل بل ID ته ورکړل شو او خپل د ځانګړتیا نوم ساتي: {list}.';
$ec_lang['lpn_geojson_import_renamed_one']='یو د ځانګړتیا نوم د شکل د ID په توګه نشي کارول کیدی. شکل بل ID ته ورکړل شو او خپل د ځانګړتیا نوم ساتي: {list}.';
$ec_lang['lpn_geojson_import_skipped']='{n} ځانګړتیاوې دننه نه شوې: {list}.';
$ec_lang['lpn_geojson_import_skipped_one']='یوه ځانګړتیا دننه نه شوه: {list}.';
$ec_lang['lpn_geojson_import_why_network']='د شبکې شتمني';
$ec_lang['lpn_geojson_import_why_geometry']='نه ټکی، نه کرښه، نه څو ضلعي';
$ec_lang['lpn_geojson_import_why_position']='موقعیت د اعتبار وړ عرض البلد او طول البلد نه دی';
$ec_lang['lpn_geojson_import_holes']='{n} د څو ضلعي سوري دننه نه شول. یو شکل یوه پولې لري.';
$ec_lang['lpn_geojson_import_holes_one']='د څو ضلعي یو سوری دننه نه شو. یو شکل یوه پولې لري.';
$ec_lang['lpn_geojson_import_parts']='{n} څو برخې ځانګړتیاوې د هرې برخې لپاره د یو شکل په توګه دننه شوې.';
$ec_lang['lpn_geojson_import_parts_one']='یوه څو برخې ځانګړتیا د هرې برخې لپاره د یو شکل په توګه دننه شوه.';
$ec_lang['lpn_geojson_import_local']='د GeoJSON موقعیتونه عرض البلد او طول البلد دي، او دې پروژې په ځمکه کې داسې ځای نه لري چې هغوی ورته بدل شي. لومړی یې د Map، World map، Attach سره جغرافیوي کړئ، بیا بیا دننه کړئ.';
$ec_lang['lpn_geojson_import_unreadable']='{file} د GeoJSON فایل نه دی: {detail}';
$ec_lang['lpn_file_import_dxf']='د DXF شکلونه دننه کول…';
$ec_lang['lpn_file_import_dxf_tip']='د ASCII DXF فایل ټکي، کرښې، او څو کرښې (polylines) په دې پروژه کې د شکلونو په توګه ولولئ، د هر طبقې نوم د ملکیت په توګه ساتل کیږي. نور توکي شمېرل کیږي او لیست کیږي، دننه نه کیږي. همغږۍ د دې پروژې د X او Y په توګه لوستل کیږي، پرته له کوم بدلونه.';
$ec_lang['lpn_file_import_shp']='د shapefile شکلونه دننه کول…';
$ec_lang['lpn_file_import_shp_tip']='د ESRI shapefile ټکي، کرښې، او څو ضلعي په دې پروژه کې د شکلونو په توګه ولولئ، د ځانګړتیا کالمونه د ملکیتونو په توګه ساتل کیږي. یا .zip یا .shp د خپل .shx، .dbf، او .prj سره وټاکئ (د ډیرو ټاکلو لپاره Ctrl یا Shift ونیسئ). هغه همغږۍ چې د پروژې له همغږۍ سیسټم نه توپیر لري بدلیږي، او خبرتیا دا وايي.';
$ec_lang['lpn_dxf_import_skipped']='{n} توکي دننه نه شول: {list}.';
$ec_lang['lpn_dxf_import_skipped_one']='یو توک دننه نه شو: {list}.';
$ec_lang['lpn_dxf_import_inblocks']='د بلاک په تعریفونو کې';
$ec_lang['lpn_dxf_import_bulge']='{n} څو کرښې د قوس برخې لري، چې د خپلو ګوټونو ترمنځ د مستقیمو برخو په توګه دننه شوې.';
$ec_lang['lpn_dxf_import_bulge_one']='یوه څو کرښه د قوس برخې لري، چې د خپلو ګوټونو ترمنځ د مستقیمو برخو په توګه دننه شوې.';
$ec_lang['lpn_dxf_import_units']='رسم خپل واحدونه {theirs} بیانوي او دا پروژه {ours} کاروي. شمېرې نه دي بدلې شوې.';
$ec_lang['lpn_dxf_import_refuse_geo']='د DXF رسم مسطح دی، او دا پروژه په عرض البلد او طول البلد کې ده، نو د {file} همغږۍ پکې ځای نه لري. د پروژې کاپي همغږۍ سیسټم ته کولو لپاره Convert as… وکاروئ، بیا بیا دننه کړئ.';
$ec_lang['lpn_dxf_import_unreadable']='{file} د ASCII DXF فایل نه دی.';
$ec_lang['lpn_dxf_import_binary']='{file} دودیز (binary) DXF دی. له خپل CAD پروګرام نه یې د ASCII DXF په توګه وساتئ، بیا بیا دننه کړئ.';
$ec_lang['lpn_shapes_import_frame']='همغږۍ د {frame} په توګه لوستل شوې، پرته له بدلون.';
$ec_lang['lpn_shapes_frame_xy']='د دې پروژې X او Y';
$ec_lang['lpn_shapes_frame_latlon']='عرض البلد او طول البلد';
$ec_lang['lpn_shp_import_skipped']='{n} ریکارډونه دننه نه شول، ځکه چې د هغوی د جیومیټري ډول نه لوستل کیږي: {list}.';
$ec_lang['lpn_shp_import_skipped_one']='یو ریکارډ دننه نه شو، ځکه چې د هغه د جیومیټري ډول نه لوستل کیږي: {list}.';
$ec_lang['lpn_shp_import_attrs']='د ځانګړتیا کالمونه د هر شکل د ملکیتونو په توګه ساتل شوي: {list}.';
$ec_lang['lpn_shp_import_noprj']='هیڅ .prj فایل نشته، نو همغږۍ د {frame} په توګه لوستل شوې، پرته له بدلون.';
$ec_lang['lpn_shp_import_prj_same']='.prj {crs} بیانوي، د دې پروژې همغږۍ سیسټم، نو همغږۍ نه دي بدلې شوې.';
$ec_lang['lpn_shp_import_converted']='همغږۍ عرض البلد او طول البلد دي. هغوی د هغه بدلون په واسطه {crs} ته اړول شوې چې نقشه یې کاروي.';
$ec_lang['lpn_shp_import_prj_other']='.prj {theirs} بیانوي. دا پروژه هیڅ همغږۍ سیسټم نه بیانوي، نو همغږۍ د {frame} په توګه لوستل شوې، پرته له بدلون.';
$ec_lang['lpn_shp_import_refuse_local']='{file} په عرض البلد او طول البلد کې دی، او دې پروژې په ځمکه کې داسې ځای نه لري چې هغوی ورته بدل شي. لومړی یې د Map، World map، Attach سره جغرافیوي کړئ، بیا بیا دننه کړئ.';
$ec_lang['lpn_shp_import_refuse_crs']='{file} {theirs} بیانوي، او دا پروژه په {ours} کې ده. هیڅ شی دننه نه شو او هیڅ شی نه دی بدل شوی.';
$ec_lang['lpn_shp_import_refuse_range']='{file} هیڅ .prj فایل نلري، او د هغه همغږۍ عرض البلد او طول البلد نه دي، نو په دې پروژه کې نشي ایښودل کیدی.';
$ec_lang['lpn_shp_import_noshp']='{file} هیڅ .shp فایل نلري. یا د shapefile .zip یا .shp د خپل .shx، .dbf، او .prj سره وټاکئ (د ډیرو ټاکلو لپاره Ctrl یا Shift ونیسئ).';
$ec_lang['lpn_shp_import_manyshp']='{file} له یو shapefile نه ډیر لري. یو په یو دننه کړئ.';
$ec_lang['lpn_shp_import_unreadable']='{file} داسې shapefile نه دی چې دا پاڼه یې ولولي: {detail}';
$ec_lang['lpn_shp_import_pick_hint']='shapefile څو فایلونه دي. .shp د خپل .shx، .dbf، او .prj سره وټاکئ (د ډیرو ټاکلو لپاره Ctrl یا Shift ونیسئ)، یا .zip وټاکئ.';
$ec_lang['lpn_shp_import_webmerc_ask']='{file} هیڅ .prj فایل نلري، او شمېرې یې عرض البلد او طول البلد نه دي، خو د Web Mercator متر (EPSG:3857) سره برابرې دي، هغه سیسټم چې QGIS او ویب نقشې یې کاروي. د EPSG:3857 په توګه یې دننه کړئ او دې پروژې ته یې واړوئ؟';
$ec_lang['lpn_shp_import_webmerc_ok']='د EPSG:3857 په توګه دننه کول';
$ec_lang['lpn_shp_import_webmerc_far_ask']='{file} {theirs} بیانوي، او په هغه سیسټم کې لوستل شوې همغږۍ یې له دې پروژې نه {km} km لرې پرتې دي. د Web Mercator متر (EPSG:3857) په توګه لوستل شوې، هغه سیسټم چې QGIS او ویب نقشې یې کاروي، هلته پرتې دي چیرته چې دا پروژه ده. د EPSG:3857 په توګه یې دننه کړئ او دې پروژې ته یې واړوئ؟';
$ec_lang['lpn_shp_import_reprojected']='همغږۍ له {theirs} نه {ours} ته اړول شوې.';
$ec_lang['lpn_shp_import_unplaced']='{n} ریکارډونه داسې همغږۍ لري چې دا پروژه یې نشي ایښودلی، لکه د نقشې له حد نه بهر عرض البلد. د ریکارډونو شمېرې: {list}.';
$ec_lang['lpn_shp_import_unplaced_one']='یو ریکارډ داسې همغږۍ لري چې دا پروژه یې نشي ایښودلی، لکه د نقشې له حد نه بهر عرض البلد. د ریکارډ شمېره: {list}.';
$ec_lang['lpn_shapes_import_none']='له {file} نه هیڅ شی دننه نه شو.';
$ec_lang['lpn_shp_import_convert_hint']='د پروژې کاپي {theirs} ته کولو لپاره Convert as… وکاروئ، بیا بیا دننه کړئ.';
$ec_lang['lpn_shp_import_damaged']='{file} خراب یا لنډ شوی دی، نو هیڅ شی دننه نه شو.';
$ec_lang['lpn_shp_import_deleted']='{n} ریکارډونه چې په .dbf کې د ړنګ شوي په توګه نښه شوي وو دننه نه شول.';
$ec_lang['lpn_shp_import_deleted_one']='یو ریکارډ چې په .dbf کې د ړنګ شوي په توګه نښه شوی و دننه نه شو.';
$ec_lang['lpn_dxf_import_paperspace']='په کاغذ ځای (paper space) کې';
$ec_lang['lpn_shapes_import_more']='او {n} نور';
$ec_lang['lpn_survey_read_error']='دا فایل ستاسو ډیسک نه نشو لوستل کیدی.';
$ec_lang['lpn_survey_cancelled']='هیڅ شی نه دی جوړ شوی او هیڅ شی نه دی بدل شوی.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
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
// Field codes (Task 771): the Description read as Carlson-style codes. See dev/survey-codes.md.
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

// Map > Screenshot (Tom, 2026-10-05): a snipping tool that re-draws the dragged map area larger than its screen size (3x unless the Screenshot box says otherwise).
$ec_lang['lpn_screenshot_menu']='سکرین شاټ';
$ec_lang['lpn_screenshot_tip']='د هغې نقشې ساحې انځور واخلئ چې تاسو یې راکاږئ، د سکرین په پرتله په لوړ ریزولوشن کې. نښې پرې وکړئ، بیا یې د کاپي تڼۍ سره په راپور کې کاپي کړئ. پرته له راکاږلو کلیک وکړئ ترڅو ټوله نقشه واخلئ.';
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
$ec_lang['lpn_snip_tip_copy']='کاپي (Ctrl+C)';
$ec_lang['lpn_screenshot_scale_tip']='د انځور اندازه د سکرین پر ساحې د ضرب په توګه. لوی یې روښانه دی او لوی فایل جوړوي.';
$ec_lang['lpn_prop_label_unit']='{label} ({unit})';
$ec_lang['lpn_prop_label_symbol_unit']='{label}، {symbol} ({unit})';
$ec_lang['lpn_prop_label_symbol']='{label}، {symbol}';
