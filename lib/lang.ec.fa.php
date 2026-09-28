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
$ec_lang['u_gradePercent']='% ارتفاع/فاصله افقی';
$ec_lang['u_grade']='ارتفاع/فاصله افقی';
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
$ec_lang['u_bar']='بار';
$ec_lang['u_kgfcm2']='کیلوگرم‌نیرو/سانتی‌متر²';
$ec_lang['u_s']='sec';
$ec_lang['u_hr']='ساعت';
$ec_lang['u_day']='روز';
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
$ec_lang['menu_brand']='ماشین‌حساب‌های HawsEDC';
$ec_lang['menu_main_hydraulics']='هیدرولیک';
$ec_lang['menu_help']='راهنما';
$ec_lang['menu_libre']='نرم‌افزار آزاد';
$ec_lang['template_welcome']='ترس‌هایت را پشت در بگذار؛ اینجا زبان محبت است. تو همه چیز را خراب نمی‌کنی. از <a target="_blank" href="https://hawsedc.com/download.php">ابزارهای رایگان HawsEDC AutoCAD</a> هم لذت ببر.';
$ec_lang['template_feedback']='آیا می‌توانید جمله‌بندی این صفحه را بهتر کنید یا نکتهٔ دیگری دارید؟ می‌خواهید کمک کنید یا یاد بگیرید چگونه ابزارهایی مانند این‌ها بسازید؟ لطفاً با من تماس بگیرید.';
$ec_lang['template_printable_title']='عنوان قابل چاپ';
$ec_lang['template_printable_subtitle']='زیرعنوان قابل چاپ';
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
$ec_lang['consent_body']='آیا اجازه می‌دهید یک رقم به ازای هر صفحه در حافظه این مرورگر نگه داریم تا از ثبت مکرر بازدیدها جلوگیری شود؟';
$ec_lang['consent_accept']='پذیرفتن همین درخواست';
$ec_lang['consent_accept_all']='پذیرفتن همیشگی';
$ec_lang['consent_decline']='رد همیشگی';
$ec_lang['consent_current_granted']='شما این را پذیرفته‌اید. ثبت بازدید برای این مرورگر محدود می‌شود.';
$ec_lang['consent_current_denied']='شما این را رد کرده‌اید. برای محدود کردن ثبت بازدید، چیزی ذخیره نمی‌کنیم.';
$ec_lang['consent_region_label']='انتخاب شما درباره محدود کردن ثبت بازدید.';
$ec_lang['consent_settings_link']='تنظیمات کوکی';
$ec_lang['privacy_link']='اعلامیه حریم خصوصی';
$ec_lang['terms_link']='شرایط استفاده';
$ec_lang['index_main_title']='ماشین‌حساب‌های رایگان مهندسی آنلاین';
$ec_lang['index_meta_desc_plain']='ماشین‌حساب‌های رایگان مهندسی هیدرولیک برای لوله، کانال، سرریز و آبیاری. این ابزارها در مرورگر شما اجرا می‌شوند، بدون اینترنت هم کار می‌کنند و به ۲۷ زبان در دسترس‌اند.';
$ec_lang['calc_set_units']='تنظیم واحدها:';
$ec_lang['calc_set_units_tip']='واحد همهٔ فیلدها را یک‌جا تنظیم می‌کند. غیرمخرب است: عددهایی که تایپ کرده‌اید دقیقاً همان‌گونه می‌مانند، و هرکدام اکنون در واحد جدید خوانده می‌شوند. یک ۶ همچنان ۶ می‌ماند، اما اکنون به‌معنای ۶ اینچ است، نه ۶ میلی‌متر.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='بازگردانی مقادیر پیش‌فرض';
$ec_lang['calc_defaults_confirm']='بازگردانی ماشین‌حساب به مقادیر پیش‌فرض اصلی؟';
$ec_lang['points_data_note']='(یا با استفاده از ناحیه داده کپی/چسباندن کنید)';
$ec_lang['points_data_heading']='داده‌های نقاط<br />(جداشده با کاما یا تب)';
$ec_lang['points_data_copy']='کپی';
$ec_lang['points_data_paste']='چسباندن';
$ec_lang['calc_inputs']='ورودی‌ها';
$ec_lang['calc_results']='نتایج';
$ec_lang['view_hide_line']='پنهان کردن این خط';
$ec_lang['view_printable']='نسخه قابل چاپ (برای بازگشت بارگذاری مجدد کنید)';
$ec_lang['ec_name_label']='این محاسبه را ذخیره کنید:';
$ec_lang['ec_name_placeholder']='نام';
$ec_lang['ec_name_tip']='این داده‌های ورودی را به URL ذخیره می‌کند برای نشانک‌گذاری، بازیابی سابقه و اشتراک';
$ec_lang['calc_copy_link']='کپی پیوند';
$ec_lang['ec_related_calcs']='ماشین‌حساب‌های مرتبط:';
$ec_lang['calc_copy_link_done']='کپی شد!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='افت هد لوله Darcy-Weisbach';
$ec_lang['dw_main_title']='ماشین‌حساب رایگان آنلاین افت هد لوله Darcy-Weisbach';
$ec_lang['dw_main_desc']='افت هد لوله Darcy-Weisbach برای قطر، زبری و دبی مشخص';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='ارتفاع زبری مطلق، e، جداره لوله. مقادیر معمول: فولاد (نو) 0.046 میلی‌متر، فولاد (کارکرده) 0.15 میلی‌متر، HDPE 0.003 میلی‌متر، PVC/uPVC 0.0015 میلی‌متر، بتن 0.3–3 میلی‌متر.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s برای آب تمیز در 20°C">ویسکوزیته سینماتیک، ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='ویسکوزیته سینماتیک، ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s برای آب تمیز در 20°C';
$ec_lang['dw_reynolds_number']='عدد رینولدز، Re';
$ec_lang['dw_flow_regime']='رژیم جریان';
$ec_lang['dw_regime_laminar']='آرام';
$ec_lang['dw_regime_transitional']='انتقالی';
$ec_lang['dw_regime_turbulent']='آشفته';
$ec_lang['dw_friction_factor_method']='روش ضریب اصطکاک';
$ec_lang['dw_friction_factor']='ضریب اصطکاک، f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='افت هد لوله Hazen-Williams';
$ec_lang['hw_main_title']='ماشین‌حساب رایگان آنلاین افت هد لوله Hazen-Williams';
$ec_lang['hw_main_desc']='افت هد لوله Hazen-Williams برای قطر، زبری و دبی مشخص';
$ec_lang['hw_hgl_1']='خط فشار هیدرولیکی پایین‌دست (HGL)';
$ec_lang['hw_hgl_2']='خط فشار هیدرولیکی بالادست (HGL)';
$ec_lang['hw_elev_up']='تراز بالادست';
$ec_lang['hw_pressure_up']='فشار بالادست';
$ec_lang['hw_elev_down']='تراز پایین‌دست';
$ec_lang['hw_pressure_down']='فشار پایین‌دست';
$ec_lang['hw_pressure_check']='بررسی فشار';
$ec_lang['hw_pressure_ok_short']='فشار مثبت';
$ec_lang['hw_pressure_neg_short']='فشار منفی';
$ec_lang['hw_pressure_neg']='فشار پایین‌دست کمتر از صفر است. خط فشار هیدرولیکی (HGL) پایین‌تر از لوله قرار می‌گیرد، بنابراین لوله به‌طور کامل پر جریان نخواهد بود و این نتیجه ممکن است معتبر نباشد.';
$ec_lang['hw_roughness']='ضریب Hazen-Williams، C';
$ec_lang['hw_note_1']='<dl><dt>این ماشین‌حساب تراز لولهٔ بین دو انتها را مدل نمی‌کند.</dt><dd>این ابزار فقط از ترازهای بالادست و پایین‌دستی که وارد می‌کنید استفاده می‌کند. اگر زمین در جایی بین این دو نقطه بالاتر از هر دو انتها بالا بیاید، فشار در آن نقطهٔ اوج پایین‌تر از هر فشار گزارش‌شده در اینجا خواهد بود. برای بررسی آن، ماشین‌حساب را دوباره برای طول از انتهای بالادست تا نقطهٔ اوج اجرا کنید.</dd><dd>هرجا خط فشار هیدرولیکی (HGL) پایین‌تر از لوله بیفتد، آب تحت فشار منفی قرار دارد. هوا از محلول خارج می‌شود، لولهٔ نازک‌جداره ممکن است فروبپاشد، و آب‌های زیرزمینی آلوده می‌توانند از محل اتصالات به داخل کشیده شوند. خط را همه‌جا زیر فشار مثبت نگه دارید و در هر نقطهٔ اوج نصب یک شیر هوا را در نظر بگیرید.</dd><dt>فشار بالادست یک شرط مرزی است که شما وارد می‌کنید.</dt><dd>آن را از یک فشارسنج، از تراز آب یک مخزن (ارتفاع آب بالای لوله)، یا از منحنی پمپ بخوانید. پمپ با افزایش دبی فشار کمتری تحویل می‌دهد، بنابراین نقطه‌ای از منحنی را استفاده کنید که با دبی واردشده در بالا مطابقت دارد.</dd><dt>ضرایب افت موضعی (جزئی) را خودتان جمع بزنید.</dt><dd>مقادیر K هر شیر، خم، سه‌راهی، کنتور و ورودی روی خط را جمع کنید و آن مجموع را وارد کنید. برای مقادیر معمول، پیوند این ورودی را دنبال کنید. در یک خط انتقال اصلی طولانی این افت‌ها در برابر اصطکاک ناچیز است، اما در لوله‌کشی کوتاه ایستگاه می‌تواند بیشتر افت را تشکیل دهد.</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='کانال نامنظم Manning';
$ec_lang['mi_main_title']='ماشین‌حساب رایگان آنلاین کانال Manning با مقطع نامنظم';
$ec_lang['mi_main_desc']='ماشین‌حساب جریان یکنواخت کانال با مقطع نامنظم به روش Manning';
$ec_lang['mi_waterSurfaceElevation']='تراز سطح آب';
$ec_lang['mi_q_617']='<span class="ec-help" title="دبی مرکب Q با استفاده از n مرکب هر ناحیه طبق معادله ۶-۱۷ Chow، با فرض سرعت‌های برابر">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='نقاط مقطع عرضی';
$ec_lang['mi_groupPoint']='نقطه';
$ec_lang['mi_groupSegment']='بخش';
$ec_lang['mi_groupRegion']='ناحیه';
$ec_lang['mi_station']='ایستگاه';
$ec_lang['mi_elevation']='تراز';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q مرز ناحیه (کناره)';
$ec_lang['mi_tau']='برش کف τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='n<br />مرکب';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='n مرکب';
$ec_lang['mi_notes_1_def']='این ماشین‌حساب برای محاسبه n مرکب هر ناحیه، از راهنمای مرجع HEC-RAS و معادله ۶-۱۷ (نه ۶-۱۸) Chow 1959، صفحه ۱۳۶، پیروی می‌کند.';


$ec_lang['mi_notes_2_term']='پوشش سنگی';
$ec_lang['mi_notes_2_def']='برای طراحی پوشش سنگی از ماشین‌حساب کانال ذوزنقه‌ای Manning استفاده کنید. این ماشین‌حساب برای مقاطع طبیعی مناسب‌تر است.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='جریان لوله Manning';
$ec_lang['mpf_main_title']='ماشین‌حساب رایگان آنلاین جریان لوله Manning';
$ec_lang['mpf_main_desc']='جریان یکنواخت لوله با فرمول Manning برای شیب و عمق مشخص';
$ec_lang['mpf_pipe_diameter']='قطر لوله، d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='ضریب زبری Manning، n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">شیب اصطکاک، S<sub>f</sub></a><span class="ec-help" title="گاهی برابر شیب لوله. برای توضیحات روی پیوند کلیک کنید (فقط به انگلیسی)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='نسبت عمق جریان، y/d<sub>0</sub>';
$ec_lang['mpf_flow']='دبی، Q';
$ec_lang['mpf_flow_tip']='دبی و عمق برای لوله‌ای با طول بی‌نهایت محاسبه شده‌اند. برای رسیدن به این دبی در ورودی لوله ممکن است به عمق آب بالادست بیشتری نیاز باشد. برای جزئیات و مشاهده ویدیوی آموزشی به یادداشت‌های زیر مراجعه کنید.';
$ec_lang['mpf_velocity']='سرعت، v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="انرژی جنبشی به صورت ارتفاع ستون آب، v²/2g">هد سرعت، h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='سطح مقطع جریان، A';
$ec_lang['mpf_pipe_area']='سطح مقطع لوله، A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='نسبت سطح، A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='محیط تر، P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='شعاع هیدرولیکی، R<sub>h</sub>';
$ec_lang['mpf_top_width']='عرض سطح آب، T';
$ec_lang['mpf_froude_number']='عدد فرود، Fr';
$ec_lang['mpf_shear_stress']='تنش برشی متوسط، τ';
$ec_lang['mpf_full_flow']='دبی کامل، Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='نسبت به دبی کامل، Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>این جریان و عمق داخل یک لوله <em>بی‌نهایت بلند</em> است.</dt><dd>برای هدایت جریان به داخل لوله ممکن است به عمق آب بالادست بیشتری نیاز باشد. حداقل ۱.۵ برابر هد سرعت را برای به‌دست آوردن عمق آب بالادست اضافه کنید یا <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">آموزش ۲ دقیقه‌ای من</a> را برای محاسبات استاندارد آب بالادست کالورت با استفاده از <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>، برنامه رایگان کالورت اداره بزرگراه‌های فدرال آمریکا، ببینید.</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>در حال طراحی فاضلاب بهداشتی هستید؟</dt><dd>جداول <a target="_blank" href="/sewslope.php">حداقل شیب فاضلاب</a> برای لوله‌های ۴ تا ۹۶ اینچ (۱۰۰ تا ۲۴۰۰ میلی‌متر)، ارائه‌شده به‌صورت متر بر متر، میلی‌متر بر متر و درصد، و مطالعه <a target="_blank" href="/peakfact.php">ضرایب اوج برای جریان‌های بسیار کم</a> را ببینید. هر دو سند مرجع فقط به زبان انگلیسی هستند.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='یک Q هدف مثبت وارد کنید.';
$ec_lang['mpf_solver_no_solution']='راه‌حلی وجود ندارد: Q از ظرفیت لوله در y/d0 = 93.8% بیشتر است (Qmax = {qmax} در واحدهای انتخابی).';
$ec_lang['mpf_solve_btn']='محاسبه';
$ec_lang['mpf_solve_for_flow']='برای دبی، Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='افت هد لوله Manning';
$ec_lang['mphl_main_title']='ماشین‌حساب رایگان آنلاین افت هد لوله Manning';
$ec_lang['mphl_main_desc']='افت هد با فرمول Manning برای جریان کامل مشخص';
$ec_lang['mphl_pipe_length']='طول، L';
$ec_lang['mphl_area']='سطح مقطع، A';
$ec_lang['mphl_total_junction_k']='ضریب افت موضعی (جزئی)، k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='ضریب افت، k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='ضریب افت موضعی، km. این افت‌ها در محل اتصال لوله‌ها، ورودی‌ها، خروجی‌ها، خم‌ها و شیرها رخ می‌دهند — واژهٔ «جزئی» که معمولاً برای این افت‌ها به کار می‌رود رایج است اما گمراه‌کننده؛ در یک خط لولهٔ کوتاه، این افت‌ها می‌توانند با افت اصطکاکی برابر شوند یا حتی از آن بیشتر شوند. مقادیر معمول k: ورودی تیز 0.5، هر خم 45 درجه 0.2–0.3، شیر دروازه‌ای (کاملاً باز) 0.1، شیر پروانه‌ای 0.2، خروجی (به مخزن یا جو) 1.0. برای به‌دست آوردن km کل، افت همهٔ اتصالات را جمع کنید. مقدار پیش‌فرض 2.0 فرض می‌کند یک ورودی، یک خروجی و دو خم 45 درجه وجود دارد.';
$ec_lang['mphl_friction_slope']='شیب اصطکاک';
$ec_lang['mphl_friction_loss']='افت اصطکاکی، h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='افت موضعی (جزئی)، h<sub>m</sub>';
$ec_lang['mphl_total_loss']='افت کل، h<sub>L</sub>';
$ec_lang['mphl_egl_1']='خط انرژی پایین‌دست (EGL)';
$ec_lang['mphl_egl_2']='خط انرژی بالادست (EGL)';
$ec_lang['mphl_hgl_egl_tip']='این نتیجه ممکن است در جایی که لوله بالاتر از خط شیب هیدرولیکی می‌رود معتبر نباشد.';
$ec_lang['mphl_note_1']='<dl><dt>این ماشین‌حساب نیمرخ (پروفیل) لوله بین دو انتها را مدل‌سازی نمی‌کند.</dt><dd>اگر HGL در هر نقطه پایین‌تر از سقف لوله برود، ممکن است این محاسبه معتبر نباشد.</dd><dt>برای شرایط ورودی باز (کالورت)، بررسی شرایط کنترل ورودی ضروری است.</dt><dd>۱. HGL بالادست باید بالاتر از تراز جریان با عمق نرمال بالادست باشد (و بالاتر از خود لوله!).</dd><dd>۲. آب بالادست کالورت بهتر است با EGL بالادست نشان داده شود نه HGL بالادست.</dd><dd>۳. برای محاسبات ساده استاندارد آب بالادست کالورت با استفاده از <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>، برنامه رایگان کالورت اداره بزرگراه‌های فدرال آمریکا، <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">آموزش ۲ دقیقه‌ای من</a> را ببینید.</dd><dd>۴. این صفحه فقط حالت کنترل خروجی را حل می‌کند: لوله‌ای که کاملاً پر جریان دارد و شرایط پایین‌دست تعیین‌کننده هد آن است. طراحی کالورت یعنی تصمیم‌گیری در مورد اینکه کنترل ورودی یا کنترل خروجی حاکم است، پس هر جا احتمال هرکدام وجود دارد از HY-8 استفاده کنید.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='کانال ذوزنقه‌ای Manning';
$ec_lang['mtc_main_title']='ماشین‌حساب رایگان آنلاین کانال ذوزنقه‌ای با فرمول Manning';
$ec_lang['mtc_main_desc']='جریان یکنواخت کانال ذوزنقه‌ای با فرمول Manning در شیب و عمق معین';
$ec_lang['mtc_bottom_width']='عرض کف، b';
$ec_lang['mtc_side_slope_1']='شیب جانبی ۱، z<sub>1</sub> (افقی/عمودی)';
$ec_lang['mtc_side_slope_2']='شیب جانبی ۲، z<sub>2</sub> (افقی/عمودی)';
$ec_lang['mtc_channel_slope']='شیب کانال، S';
$ec_lang['mtc_flow_depth']='عمق جریان، y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">زاویه خمش، β</a><span class="ec-help" title="برای تعیین اندازه سنگ‌چین. برای مشاهده نمودار روی پیوند کلیک کنید."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="چگالی نسبت به آب. برای سنگ خردشده معمولاً ≈ ۲.۶۵.">چگالی نسبی سنگ، sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='اندازه طراحی سنگ، D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n از روی اندازهٔ طراحی سنگ (روش Strickler)';
$ec_lang['mtc_n_blodgett']='n از روی اندازهٔ طراحی سنگ (روش Blodgett)';
$ec_lang['mtc_n_bathurst']='n از روی اندازهٔ طراحی سنگ (روش Bathurst)';
$ec_lang['mtc_n_pi']='n از روی اندازهٔ طراحی سنگ (روش Phillips & Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett در برابر Bathurst';
$ec_lang['mtc_pi_range_check']='بررسی محدوده P&I';
$ec_lang['mtc_pi_ok']='d50 در محدوده P&I';
$ec_lang['mtc_pi_ok_tip']='0.28–0.36 فوت (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='خارج از محدوده';
$ec_lang['mtc_pi_tip']='برون‌یابی خارج از محدودهٔ داده‌های 0.28–0.36 فوت که این معادله بر اساس آن‌ها به‌دست آمده — آن را یک بررسی تقریبی بدانید، نه مبنای طراحی';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="بر اساس Isbash (1936) و شهرستان ماریکوپا، آریزونا، آمریکا.">اندازه سنگ زاویه‌دار مورد نیاز برای کف، D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="بر اساس Isbash (1936) و شهرستان ماریکوپا، آریزونا، آمریکا.">اندازه سنگ زاویه‌دار مورد نیاز برای شیب جانبی ۱، D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="بر اساس Isbash (1936) و شهرستان ماریکوپا، آریزونا، آمریکا.">اندازه سنگ زاویه‌دار مورد نیاز برای شیب جانبی ۲، D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="بر اساس Maynord، Ruff و Abt (1989). در یک قوس، سنگ برای سرعتی معادل 4/3 سرعت متوسط اندازه‌گذاری می‌شود، بر اساس California Division of Highways (1970)؛ ضریب 1.5 خود Maynord برای کانال‌های طبیعی به کار می‌رود.">اندازه سنگ زاویه‌دار مورد نیاز، D<sub>50</sub> (Maynord, Ruff, and Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='اندازه سنگ زاویه‌دار مورد نیاز، D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='سرعت برای فرض‌های جریان یکنواخت مناسب است.';
$ec_lang['mtc_vel_low']='سرعت پایین است؛ خطر رسوب‌گذاری وجود دارد.';
$ec_lang['mtc_vel_high']='سرعت بالا است و ممکن است واقع‌بینانه نباشد؛ فرسایش پوشش کانال، عمق اضافی در خم‌ها و افت انرژی در گسترش‌ها یا موانع را بررسی کنید.';
$ec_lang['mtc_iteration_tip']='یک گزینه زبری (روش Blodgett–Bathurst توصیه می‌شود) و یک گزینه اندازه سنگ (روش Isbash توصیه می‌شود) انتخاب کنید تا به‌طور خودکار به یک اندازه سنگ یکنواخت متناسب با دبی هدف شما تکرار شود. برای روش کامل به یادداشت‌های زیر مراجعه کنید، یا برای رد شدن از تکرار، مقدار زبری دلخواه خود را (برای راهنمایی روی پیوند کلیک کنید) وارد کرده و اندازه سنگ را نادیده بگیرید.';
$ec_lang['mtc_note_1']='<dl><dt>تکرار خودکار طراحی اندازهٔ سنگ و زبری</dt><dd>یک گزینهٔ زبری (روش Blodgett–Bathurst توصیه می‌شود) و یک گزینهٔ اندازهٔ سنگ طراحی (روش Isbash توصیه می‌شود) انتخاب کنید. عمق و ضریب ایمنی اندازهٔ سنگ را تنظیم کنید تا با یک اندازهٔ سنگ یکنواخت به دبی هدف خود برسید. هر بار که یک ورودی را تغییر می‌دهید، ماشین‌حساب این گام‌ها را تکرار می‌کند: 1. زبری از روی اندازهٔ سنگ طراحی محاسبه می‌شود. 2. مقدار زبری از روشی که انتخاب کرده‌اید در ورودی زبری کپی می‌شود. 3. دبی کانال و اندازهٔ سنگ موردنیاز محاسبه می‌شوند. 4. اندازهٔ سنگ طراحی تنظیم می‌شود. 5. تا زمانی که خطای اندازهٔ سنگ طراحی بسیار کوچک شود تکرار می‌شود.</dd><dt>ماشین‌حساب پایه (بدون تکرار)</dt><dd>مقدار زبری دلخواه خود را وارد کنید. ناحیهٔ ورودی اندازهٔ سنگ طراحی را نادیده بگیرید.</dd></dl>';
$ec_lang['mtc_note_2_term']='بررسی سرعت';
$ec_lang['mtc_note_2_def']='سرعت بالا نشان‌دهنده افت ارتفاع زیادی است که چنین انرژی مخصوص بالایی ایجاد کرده است. این انرژی می‌تواند به‌سرعت در گسترش‌ها، خم‌ها یا موانع از بین برود. بررسی کنید که این وضعیت برای محل مورد نظر معقول است.';
$ec_lang['mtc_solver_no_solution']='با این ورودی‌های کانال، برای دبی Q مشخص هیچ جوابی یافت نشد.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='جریان سرریز ساده';
$ec_lang['ws_main_title']='ماشین‌حساب رایگان آنلاین جریان سرریز تاج پهن ساده';
$ec_lang['ws_main_desc']='ماشین‌حساب جریان سرریز تاج پهن ساده';
$ec_lang['ws_weirLength']='طول سرریز، L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="انرژی به ازای واحد وزن آب — ارتفاع ستون آب، نه فشار">هد، h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='ضریب سرریز، C<sub>w</sub>';
$ec_lang['ws_notes_heading']='یادداشت‌ها';
$ec_lang['ws_notes_we_term']='معادله سرریز';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='جریان سرریز با تاج نامنظم';
$ec_lang['wi_main_title']='ماشین‌حساب رایگان آنلاین جریان سرریز بخش‌بندی‌شده با تاج نامنظم و عمق متغیر';
$ec_lang['wi_main_desc']='ماشین‌حساب جریان سرریز با تاج نامنظم';
$ec_lang['wi_weirPoints']='نقاط سرریز';
$ec_lang['wi_pondingHeight']='ارتفاع آب پشت سرریز';
$ec_lang['wi_incrementalFlow']='دبی افزایشی';
$ec_lang['wi_cumulativeFlow']='دبی تجمعی';
$ec_lang['wi_notes_we_def']='q = اگر (length = 0) آنگاه 0 در غیر این صورت اگر (slope=0) آنگاه cw*length*d<sub>0</sub><sup>1.5</sup> در غیر این صورت cw/(2.5*slope) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) که در آن d<sub>1</sub> و d<sub>0</sub> همواره مثبت یا صفر هستند';
// Orifice Flow
$ec_lang['or_main_menu']='جریان دریچه';
$ec_lang['or_main_title']='ماشین‌حساب رایگان آنلاین جریان دریچه';
$ec_lang['or_main_desc']='جریان دریچه — آزاد یا مستغرق';
$ec_lang['or_shape_circular']='دایره‌ای';
$ec_lang['or_shape_rectangular']='مستطیلی';
$ec_lang['or_diameter']='<span class="ec-help" title="قطر برای دایره‌ای؛ ارتفاع برای مستطیلی">قطر یا ارتفاع، D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="فقط برای دهانه‌های مستطیلی">عرض، W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="پایین‌ترین نقطه دهانه">تراز کف دهانه <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='تراز آب بالادست';
$ec_lang['or_twe']='تراز آب پایین‌دست';
$ec_lang['or_cd']='ضریب تخلیه، C<sub>d</sub>';
$ec_lang['or_centroid_elev']='تراز مرکز ثقل';
$ec_lang['or_head']='<span class="ec-help" title="انرژی به ازای واحد وزن آب — ارتفاع ستون آب، نه فشار">هد مؤثر، h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='مساحت دهانه، A';
$ec_lang['or_regime']='بررسی رژیم دریچه';
$ec_lang['or_regime_valid']='خروج آزاد';
$ec_lang['or_regime_submerged']='دریچه مستغرق';
$ec_lang['or_regime_submerged_tip']='TWE بالاتر از مرکز ثقل — رژیم دریچه همچنان معتبر است';
$ec_lang['or_regime_warn']='خارج از رژیم دریچه';
$ec_lang['or_regime_warn_tip']='تراز آب بالادست پایین‌تر از تاج (بالاترین نقطه داخلی) دهانه است';
$ec_lang['or_regime_twe_above_hwe']='بررسی ورودی‌ها';
$ec_lang['or_regime_twe_above_hwe_tip']='تراز آب پایین‌دست (TWE) بالاتر از تراز آب بالادست (HWE) است';
$ec_lang['or_notes_1_term']='معادله دریچه';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). برای خروج آزاد: h = HWE − مرکز ثقل. برای جریان مستغرق (TWE بالاتر از کف): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='رژیم دریچه';
$ec_lang['or_notes_2_def']='معادلات جریان دریچه زمانی اعمال می‌شوند که سطح آب بالادست بالاتر از تاج (بالای) دهانه باشد. وقتی آب بالادست پایین‌تر از تاج باشد، در عوض از معادله سرریز استفاده کنید.';
$ec_lang['or_notes_3_term']='ضریب تخلیه';
$ec_lang['or_notes_3_def']='C<sub>d</sub> برای دریچه‌های لبه تیز در حدود 0.60–0.65 است. ورودی‌های گرد یا داخل‌برآمده مقادیر متفاوتی دارند. برای راهنمایی به <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> یا راهنمای مرجع هیدرولیک HEC-RAS مراجعه کنید.';
$ec_lang['or_notes_4_term']='استغراق';
$ec_lang['or_notes_4_def']='وقتی TWE بالاتر از کف دهانه است، این ماشین‌حساب به‌طور خودکار معادله دریچه مستغرق را با h = HWE − TWE اعمال می‌کند. وقتی TWE در سطح کف یا پایین‌تر از آن باشد، خروج آزاد فرض می‌شود و h = HWE − مرکز ثقل.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='توان میکرو-هیدرو';
$ec_lang['mhp_main_title']='ماشین‌حساب رایگان آنلاین توان میکرو-هیدرو';
$ec_lang['mhp_main_desc']='ماشین‌حساب توان خروجی میکرو-هیدرو جریان‌رودی';
$ec_lang['mhp_gross_head']='هد ناخالص، H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="قطر لوله فشار (پنستاک)">قطر لوله فشار، D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='طول، L';
$ec_lang['mhp_efficiency']='راندمان نیروگاه، η (0–1)';
$ec_lang['mhp_vel_check']='بررسی سرعت';
$ec_lang['mhp_hl_check']='بررسی افت هد';
$ec_lang['mhp_hnet']='هد خالص، H<sub>net</sub>';
$ec_lang['mhp_power']='توان خروجی، P';
$ec_lang['mhp_annual_kwh']='P به‌صورت انرژی سالانه';
$ec_lang['mhp_vel_low']='سرعت پایین — خطر رسوب‌گذاری و ورود هوا.';
$ec_lang['mhp_vel_high']='سرعت بالا — افت‌های انتقالی، انرژی موجود و ضربه قوچ را بررسی کنید.';
$ec_lang['mhp_vel_ok_short']='خوب';
$ec_lang['mhp_vel_high_short']='بالا';
$ec_lang['mhp_vel_low_short']='پایین';
$ec_lang['mhp_vel_ok_tip']='سرعت در محدوده کارآمد برای طراحی لوله فشار (پنستاک) قرار دارد.';
$ec_lang['mhp_hl_ok_tip']='افت هد کمتر از 10٪ هد ناخالص است. این اندازهٔ لوله مقرون‌به‌صرفه است.';
$ec_lang['mhp_hl_warn_tip']='افت هد بیش از 10٪ هد ناخالص است. لولهٔ بزرگ‌تری را در نظر بگیرید.';
$ec_lang['mhp_hl_bad_tip']='افت هد بیش از 20٪ هد ناخالص است. اندازهٔ لوله را تغییر دهید.';
$ec_lang['mhp_notes_1_term']='افت هد';
$ec_lang['mhp_notes_1_def']='افت کل لوله فشار (پنستاک) h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>، که در آن h<sub>f</sub> = f(L/D)(v²/2g) افت اصطکاک Darcy-Weisbach است و h<sub>m</sub> = k<sub>m</sub>·v²/2g شامل ورودی، خم‌ها و شیرآلات می‌شود. هد خالص H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub> است.';
$ec_lang['mhp_notes_2_term']='سرعت';
$ec_lang['mhp_notes_2_def']='بررسی کنید که سرعت جریان برای افت ارتفاع موجود و هزینه لوله مناسب باشد. سرعت بسیار پایین می‌تواند نشانه بزرگ بودن بیش‌ازحد قطر لوله باشد؛ سرعت بسیار بالا می‌تواند افت اصطکاک و خطر ضربه قوچ را افزایش دهد.';
$ec_lang['mhp_notes_3_term']='هدف افت هد';
$ec_lang['mhp_notes_3_def']='افت‌های لولهٔ فشار (پنستاک) کمتر از ۱۰٪ هد ناخالص معمولاً از نظر اقتصادی مقرون‌به‌صرفه است. سازش بهینه میان هزینهٔ لوله و توان ازدست‌رفته اغلب حدود ۴ تا ۶ درصد است، جایی که قیمت برق در انتهای بالای بازه است.';
$ec_lang['mhp_notes_6_term']='راندمان';
$ec_lang['mhp_notes_6_def']='راندمان معمول نیروگاه η برای توربین‌های Pelton و جریان متقاطع رایج در میکرو-هیدرو بین 0.70 تا 0.85 است. برای نخستین برآورد محافظه‌کارانه از 0.75 استفاده کنید.';
$ec_lang['mhp_notes_7_term']='انرژی سالانه';
$ec_lang['mhp_notes_7_def']='انرژی سالانه بر اساس عملکرد پیوسته با جریان کامل (8760 ساعت در سال) محاسبه می‌شود. تولید واقعی به دلیل تغییرات فصلی جریان، زمان توقف برای تعمیر و نگهداری، و ضریب بار کمتر خواهد بود.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='زمان تخلیه استخر & مخزن';
$ec_lang['odt_main_title']='ماشین‌حساب رایگان آنلاین زمان تخلیه استخر، حوضچه و مخزن (دریچه)';
$ec_lang['odt_main_desc']='زمان تخلیه استخر، حوضچه یا مخزن — خروجی دریچه، روش حجم مخروطی';
$ec_lang['odt_h1_elev']='ارتفاع سطح آب اولیه';
$ec_lang['odt_a1']='مساحت اولیه، A<sub>1</sub>';
$ec_lang['odt_h2_elev']='ارتفاع سطح آب نهایی';
$ec_lang['odt_a0']='مساحت در ارتفاع دریچه، A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="درون‌یابی‌شده از مدل مخروطی در ارتفاع نهایی">مساحت نهایی، A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='بررسی ارتفاع نهایی';
$ec_lang['odt_h2_ok']='ارتفاع نهایی بالاتر از تاج دریچه';
$ec_lang['odt_h2_warn']='ارتفاع نهایی در سطح یا پایین‌تر از تاج دریچه';
$ec_lang['odt_h2_warn_tip']='تاج دریچه = مرکز ثقل + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="قطر (برای دایره‌ای) یا ارتفاع (برای مستطیلی)">قطر دریچه D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="فقط برای مستطیلی">عرض دریچه، W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='زمان تخلیه (s)';
$ec_lang['odt_t_min']='زمان تخلیه (min)';
$ec_lang['odt_t_hr']='زمان تخلیه (hr)';
$ec_lang['odt_t_day']='زمان تخلیه (days)';
$ec_lang['odt_notes_1_term']='فرمول';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) زمان تخلیه از هد H تا دریچه را می‌دهد. زمان تخلیه = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>)، که H<sub>1</sub> = ارتفاع اولیه − ارتفاع دریچه، H<sub>2</sub> = ارتفاع نهایی − ارتفاع دریچه.';
$ec_lang['odt_notes_2_term']='روش';
$ec_lang['odt_notes_2_def']='روش حجم مخروطی استخر یا حوضچه را به صورت یک مقطع مخروطی بین مساحت اولیه A<sub>1</sub> در سطح آب اولیه و مساحت A<sub>0</sub> در ارتفاع مرکز ثقل دریچه مدل می‌کند. A<sub>2</sub>، مساحت استخر در ارتفاع نهایی، از A<sub>1</sub> و A<sub>0</sub> با استفاده از مدل مقطع مخروطی درون‌یابی می‌شود. زمان تخلیه از ارتفاع اولیه تا نهایی برابر است با زمان تخلیه کل از H<sub>1</sub> تا دریچه منهای زمان تخلیه باقی‌مانده از H<sub>2</sub> تا دریچه.';
$ec_lang['odt_h1']='<span class="ec-help" title="ارتفاع سطح آب اولیه منهای ارتفاع مرکز ثقل دریچه">هد اولیه، H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='حداکثر دبی، Q<sub>max</sub>';
$ec_lang['odt_vol']='حجم تخلیه‌شده';
$ec_lang['odt_sketch_start']='شروع';
$ec_lang['odt_sketch_end']='پایان';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='فاصله قطره‌چکان، S<sub>e</sub>';
$ec_lang['ip_sl']='فاصله جانبی، S<sub>l</sub>';
$ec_lang['ip_n_e']='تعداد قطره‌چکان در هر جانبی، n<sub>e</sub>';
$ec_lang['ip_n_l']='تعداد جانبی در هر ناحیه، n<sub>l</sub>';
$ec_lang['ip_d']='عمق کاربرد هدف، d';
$ec_lang['ip_a_e']='مساحت به ازای هر قطره‌چکان، A<sub>e</sub>';
$ec_lang['ip_pr']='نرخ کاربرد، PR';
$ec_lang['ip_q_lat']='دبی هر جانبی، Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='دبی ناحیه، Q<sub>zone</sub>';
$ec_lang['ip_t_run']='مدت آبیاری (ساعت)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='نفوذ کانال';
$ec_lang['cs_main_title']='ماشین‌حساب رایگان آنلاین تلفات نفوذ کانال و راندمان انتقال';
$ec_lang['cs_main_desc']='تلفات نفوذ کانال و راندمان انتقال — روش دبی ورودی-خروجی';
$ec_lang['cs_Q_in']='دبی ورودی، Q<sub>in</sub>';
$ec_lang['cs_Q_out']='دبی خروجی، Q<sub>out</sub>';
$ec_lang['cs_L']='طول مسیر، L';
$ec_lang['cs_Q_loss']='نرخ تلفات نفوذ، Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='بررسی اندازه‌گیری';
$ec_lang['cs_pct_loss']='کسر تلف‌شده';
$ec_lang['cs_Ec']='راندمان انتقال، E<sub>c</sub>';
$ec_lang['cs_Ec_check']='رتبه راندمان';
$ec_lang['cs_Vol_day']='حجم روزانه تلف‌شده';
$ec_lang['cs_Vol_year']='حجم سالانه تلف‌شده';
$ec_lang['cs_Q_loss_per_L']='تلفات در واحد طول، Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='ارزش آب';
$ec_lang['cs_lining_cost']='هزینه آسترکاری';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="هدف راندمان انتقال پس از آسترکاری؛ کسری بین 0 تا 1">هدف آسترکاری، E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='سطح آستر، L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='ارزش سالانه تلف‌شده';
$ec_lang['cs_annual_value_recovered']='ارزش سالانه بازیافتی';
$ec_lang['cs_lining_total_cost']='هزینه کل آسترکاری';
$ec_lang['cs_payback_years']='<span class="ec-help" title="بازگشت سرمایه ساده = هزینه کل آسترکاری ÷ ارزش سالانه بازیافتی">دوره بازگشت سرمایه <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — نفوذ شناسایی شد';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — تلفات قابل اندازه‌گیری وجود ندارد';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — اندازه‌گیری‌ها را بررسی کنید';
$ec_lang['cs_Ec_good']='خوب — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='متوسط — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='ضعیف — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='روش دبی ورودی-خروجی، نفوذ را با اندازه‌گیری جریان در ابتدا و انتهای یک مسیر کانال برآورد می‌کند: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. راندمان انتقال E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. حجم سالانه بر این فرض است که کانال به‌طور پیوسته با جریان کامل کار می‌کند؛ تلفات واقعی برای کانال‌های فصلی یا با جریان جزئی کمتر است.';
$ec_lang['cs_notes_2_term']='رتبه‌های راندمان';
$ec_lang['cs_notes_2_def']='کانال‌های خاکی معمولی بدون آستر: E<sub>c</sub> = 60–80%. کانال‌های خاکی با نگهداری خوب: 75–85%. کانال‌های آسترشده با بتن: 90–98%. تلفات نفوذ بیش از 30٪ دبی ورودی اغلب سرمایه‌گذاری در آسترکاری را توجیه می‌کند. (USBR، FAO)';
$ec_lang['cs_notes_3_term']='بازگشت سرمایه آسترکاری';
$ec_lang['cs_notes_3_def']='ارزش آب و هزینه آسترکاری را در هر واحد پولی یکسان وارد کنید. سطح آستر = طول مسیر × محیط تر — محیط تر مقطع کانال در عمق جریان اندازه‌گیری‌شده (عرض کف به‌علاوه هر دو شیب تر). ارزش سالانه بازیافتی بر این فرض است که کانال آسترشده به‌طور پیوسته به E<sub>c</sub> هدف دست می‌یابد. بازگشت سرمایه واقعی برای کانال‌های فصلی یا در صورتی که آسترکاری به راندمان هدف نرسد، طولانی‌تر خواهد بود.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>، ویرایش سوم (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='درباره';
$ec_lang['install_main_menu']='نصب';
$ec_lang['install_main_title']='نصب EngCalcs';
$ec_lang['install_main_desc']='برای استفاده آفلاین به دستگاه خود اضافه کنید';
$ec_lang['install_intro']='EngCalcs یک اپلیکیشن وب پیشرو (PWA) است. پس از نصب، همهٔ ماشین‌حساب‌ها به‌طور کامل و بدون نیاز به اتصال اینترنت کار می‌کنند.';
$ec_lang['install_android_heading']='اندروید (کروم)';
$ec_lang['install_android_steps_html']='<li>یکی از صفحات ماشین‌حساب را در کروم باز کنید.</li><li>روی دکمهٔ <strong>⬇ نصب</strong> در نوار بالای صفحه ضربه بزنید، یا روی منوی مرورگر (⋮) ضربه بزنید و <strong>افزودن به صفحهٔ اصلی</strong> را انتخاب کنید.</li><li>در پنجرهٔ ظاهرشده روی <strong>نصب</strong> ضربه بزنید.</li><li>EngCalcs روی صفحهٔ اصلی گوشی شما ظاهر می‌شود و به‌صورت آفلاین کار می‌کند.</li>';
$ec_lang['install_now_btn']='⬇ اکنون نصب کنید';
$ec_lang['install_prompt_unavailable']='پنجرهٔ نصب در دسترس نیست — به‌جای آن از منوی مرورگر خود استفاده کنید.';
$ec_lang['install_ios_heading']='iOS (سافاری)';
$ec_lang['install_ios_steps_html']='<li>یکی از صفحات ماشین‌حساب را در سافاری باز کنید.</li><li>روی دکمهٔ <strong>اشتراک‌گذاری</strong> (مربع با فلش رو به بالا) ضربه بزنید.</li><li>پایین بروید و روی <strong>افزودن به صفحهٔ اصلی</strong> ضربه بزنید.</li><li>روی <strong>افزودن</strong> ضربه بزنید. EngCalcs روی صفحهٔ اصلی شما ظاهر می‌شود.</li>';
$ec_lang['install_ios_note']='در iOS، نصب همیشه از طریق منوی اشتراک‌گذاری انجام می‌شود — هیچ پنجرهٔ نصب خودکاری وجود ندارد.';
$ec_lang['install_desktop_heading']='رایانه (کروم / اج)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>یکی از صفحات ماشین‌حساب را باز کنید.</li><li>روی <strong>نماد نصب</strong> (⊕ یا نماد رایانه) در نوار آدرس مرورگر کلیک کنید، یا منوی مرورگر را باز کرده و <strong>نصب EngCalcs…</strong> را انتخاب کنید.</li><li>روی <strong>نصب</strong> کلیک کنید. EngCalcs در یک پنجرهٔ مستقل باز می‌شود.</li>';
$ec_lang['install_firefox_heading']='فایرفاکس / سایر مرورگرها';
$ec_lang['install_firefox_body']='فایرفاکس امکان نصب اپلیکیشن‌های وب پیشرو (PWA) روی رایانه را پشتیبانی نمی‌کند. با این حال می‌توانید همهٔ ماشین‌حساب‌ها را به‌طور معمول در مرورگر استفاده کنید — پس از اولین بازدید، صفحات به‌طور خودکار برای استفادهٔ آفلاین ذخیره می‌شوند.';
$ec_lang['install_cached_heading']='چه چیزهایی ذخیره می‌شوند';
$ec_lang['install_cached_body']='در اولین نصب EngCalcs، تمام صفحات ماشین‌حساب و فایل‌های پشتیبان آن‌ها (اسکریپت‌ها، استایل‌ها) به‌طور خودکار روی دستگاه شما ذخیره می‌شوند. پس از آن، همه‌چیز بدون نیاز به اتصال اینترنت کار می‌کند. انتخاب زبان شما از آخرین بازدید آنلاینتان به خاطر سپرده می‌شود.';
$ec_lang['contact_main_menu']='تماس';
$ec_lang['about_main_title']='درباره ماشین‌حساب‌های مهندسی HawsEDC';
$ec_lang['about_main_desc']='مأموریت، نرم‌افزار آزاد و مشارکت';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>مأموریت</h3><p>ماشین‌حساب‌های مهندسی HawsEDC برای خدمت به مهندسان و کارگران میدانی در سراسر جهان وجود دارند — به‌ویژه کسانی که در مناطق کم‌آب، کم‌منبع یا محروم کار می‌کنند. این ابزارها بخشی از یک مأموریت انسان‌دوستانه گسترده‌تر هستند: به هر انسانی به عملی‌ترین و مؤثرترین شکل ممکن بگویند که برای همیشه دوست‌داشتنی و عزیز است، چیزی برای ترسیدن ندارد و قرار نیست همه چیز را خراب کند.</p><p>ماشین‌حساب‌ها وسیله‌اند. مقصد، دنیایی عاری از رنج است.</p><h3>پروانهٔ نرم‌افزار آزاد و متن‌باز</h3><p>تمام کد تحت <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">پروانه عمومی همگانی GNU نسخه ۳.۰ یا بالاتر</a> منتشر شده است — آزاد به معنای واقعی آزادی. می‌توانید کد را با همان شرایط استفاده، مطالعه، تغییر و بازتوزیع کنید.</p><p>این یک دعوت است، نه یک قیمت. هیچ سطح پولی، هیچ سطح رایگانی که ممکن است پس گرفته شود، و هیچ تأخیری پیش از آنکه کد از آنِ شما شود وجود ندارد. نسخهٔ کاملی که امروز می‌بینید، اکنون و برای همیشه برای همه رایگان است تا استفاده و تغییر داده شود.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>کد منبع</h3><p>کد منبع کامل به‌صورت عمومی در GitHub در دسترس است:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>می‌توانید کد را مرور کنید، مشکلات را گزارش دهید یا مخزن را فورک کنید.</p><h3>مشارکت</h3><p>هر کمکی خوش‌آمد است. <a href="contact.php">با Tom Haws تماس بگیرید</a>.</p><ul><li><strong>ترجمه‌ها:</strong> واژه‌بندی بهتر پیشنهاد دهید. زبانی را بهبود دهید یا اضافه کنید.</li><li><strong>گزارش اشکالات:</strong> از فرم بازخورد در هر صفحه ماشین‌حساب استفاده کنید، یا مشکلی را در GitHub ثبت کنید.</li><li><strong>ماشین‌حساب‌های جدید:</strong> ایده‌هایی برای ابزارهای مهندسی هیدرولیک که به کارگران میدانی و متخصصان آبیاری خدمت می‌کنند، به‌ویژه خوش‌آمدند.</li><li><strong>میزبانی:</strong> اگر می‌توانید این ماشین‌حساب‌ها را برای منطقه‌ای با اتصال محدود آینه‌سازی کنید، لطفاً با من تماس بگیرید.</li></ul><h3>استفاده آفلاین</h3><p>این ماشین‌حساب‌ها به‌عنوان یک <strong>برنامهٔ وب پیشرو (PWA)</strong> کار می‌کنند. هر صفحه ماشین‌حساب را هنگام اتصال به اینترنت بازدید کنید، و مرورگر شما به‌طور خودکار همهٔ ماشین‌حساب‌ها را ذخیره می‌کند. پس از آن، همهٔ ماشین‌حساب‌ها بدون اینترنت کار می‌کنند — نیازی به اینترنت نیست.</p><p>در Android یا iOS، از گزینهٔ «افزودن به صفحهٔ اصلی» مرورگر خود برای نصب EngCalcs به‌عنوان یک برنامه روی دستگاهتان استفاده کنید. در رایانهٔ رومیزی، آیکون نصب را در نوار آدرس مرورگر خود بیابید.</p><p>همچنین می‌توانید هر ماشین‌حساب را با استفاده از منوی «ذخیره به‌عنوان…» مرورگر خود برای استفادهٔ آفلاین یک‌باره ذخیره کنید.</p><h3>تماس</h3><p>Tom Haws، مهندس هیدرولیک و بنیان‌گذار این ماشین‌حساب‌ها.<br />از فرم بازخورد در هر صفحه ماشین‌حساب استفاده کنید، یا به کد منبع در <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a> دسترسی پیدا کنید.</p>';
$ec_lang['contactSendMessage']='پیام برای Tom Haws ارسال کنید';
$ec_lang['contactYourName']='نام شما:';
$ec_lang['contactYourEmail']='آدرس ایمیل شما:';
$ec_lang['contactSubject']='موضوع:';
$ec_lang['contact_message']='پیام:';
$ec_lang['contactSpamPrefix']='پنج به‌علاوه یک برابر است با';
$ec_lang['contactSpamPostfix']='(لطفاً آن را به‌صورت حروف بنویسید. 1=یک 2=دو 3=سه 4=چهار 5=پنج 6=شش 7=هفت +=به‌علاوه 5+1=6)';
$ec_lang['contactSubmitButton']='ارسال پیام';
$ec_lang['contact_success']='تشکر می‌کنم که وقت گذاشتید برای نوشتن.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='طراحی آبراه تند سنگچین (Robinson)';
$ec_lang['rc_main_title']='ماشین‌حساب رایگان آنلاین طراحی آبراه تند سنگچین — Robinson (1998)';
$ec_lang['rc_main_desc']='تعیین اندازه سنگ‌چین آبراه تند — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='شیب بستر آبراه، S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="جریان به ازای هر واحد عرض در ورودی آبراه تند سنگچین. برای کانالی با عرض کف B و دبی کل Q، از q_t = Q / B استفاده کنید.">دبی واحد کل، q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='تخلخل سنگ‌چین، n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="چگالی نسبت به آب. گرانیت یا بازالت خردشده معمولی ≈ 2.65. محدوده معتبر Robinson: 2.54 تا 2.82.">چگالی نسبی سنگ، sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="انحراف معیار دانه‌بندی. سنگ یکنواخت ≈ 1.25. محدوده معتبر Robinson: 1.15 تا 1.47.">دانه‌بندی SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="آبگیری (Hp > yn) مطلوب است — فرسایش بالادست را کاهش می‌دهد. (USDA)">عمق نرمال در کانال ورودی، y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="معادله 1 (S0 < 0.10) یا معادله 2 (0.10-0.40). محدوده معتبر: D50 بین 15 تا 278 میلی‌متر، S0 بین 0.02 تا 0.40. خارج از این محدوده: مقادیر برون‌یابی‌شده.">قطر میانه سنگ مورد نیاز، D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='معادله به‌کاررفته';
$ec_lang['rc_sg_check']='بررسی چگالی نسبی';
$ec_lang['rc_SD_check']='بررسی دانه‌بندی SD';
$ec_lang['rc_sg_ok']='sg در محدوده معتبر است';
$ec_lang['rc_sg_ok_tip']='2.54–2.82 (Robinson)';
$ec_lang['rc_sg_low']='sg پایین‌تر از محدوده Robinson';
$ec_lang['rc_sg_low_tip']='محدوده معتبر: 2.54–2.82';
$ec_lang['rc_sg_high']='sg بالاتر از محدوده Robinson';
$ec_lang['rc_sg_high_tip']='محدوده معتبر: 2.54–2.82';
$ec_lang['rc_SD_ok']='SD در محدوده معتبر است';
$ec_lang['rc_SD_ok_tip']='1.15–1.47 (Robinson)';
$ec_lang['rc_SD_low']='SD پایین‌تر از محدوده Robinson';
$ec_lang['rc_SD_low_tip']='محدوده معتبر: 1.15–1.47';
$ec_lang['rc_SD_high']='SD بالاتر از محدوده Robinson';
$ec_lang['rc_SD_high_tip']='محدوده معتبر: 1.15–1.47';
$ec_lang['rc_layer']='ضخامت لایه سنگ (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='شعاع منحنی تاج فوقانی (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='طول قوس منحنی تاج فوقانی';
$ec_lang['rc_apron_length']='<span class="ec-help" title="برای پشتیبانی سازه‌ای سنگ‌های آبراه لازم است. “حداقل پساب حاصل از بازه خروجی و مقاومت کانال پایین‌دست، برای اطمینان از پایداری سنگ‌چین در بازه خروجی کافی است.” (Robinson)">طول پاشنه خروجی (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='ضریب زبری Manning در آبراه، n';
$ec_lang['rc_Vm']='<span class="ec-help" title="بخشی از qt که از منافذ سنگ عبور می‌کند. باقی‌مانده (qs) روی سطح جریان می‌یابد. مقدار پیش‌فرض np = 0.45 برای سنگ خردشده زاویه‌دار است.">سرعت درون لایه سنگی، V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='دبی واحد درون لایه سنگی، q<sub>m</sub>';
$ec_lang['rc_qs']='دبی واحد سطحی، q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='عمق جریان بالای سطح سنگ‌چین، d';
$ec_lang['rc_Hp']='<span class="ec-help" title="آبگیری (Hp > yn) مطلوب است — فرسایش بالادست را کاهش می‌دهد. (USDA)">هد سرریز ورودی، H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='بررسی آبگیری ورودی';
$ec_lang['rc_pond_ok']='H<sub>p</sub> > y<sub>n</sub> — آبگیری در بالادست';
$ec_lang['rc_pond_ok_tip']='آبگیری در بالادست ورودی آبراه مطلوب است؛ فرسایش بالادست را کاهش می‌دهد. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — بدون آبگیری — احتمال فرسایش در ورودی';
$ec_lang['rc_pond_warn_tip']='آبگیری در بالادست ورودی آبراه وجود ندارد؛ ممکن است فرسایش در بالادست رخ دهد. (USDA)';
$ec_lang['rc_eq1']='معادله 1 (S<sub>0</sub> < 0.10) — شیب ملایم';
$ec_lang['rc_eq2']='معادله 2 (0.10 ≤ S<sub>0</sub> ≤ 0.40) — شیب تند';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0.02 — پایین‌تر از محدوده اعتبارسنجی Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0.40 — بالاتر از محدوده اعتبارسنجی Robinson';
$ec_lang['rc_notes_1_term']='معادلات تعیین اندازه سنگ';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) دو معادلهٔ تجربی برای اندازهٔ میانهٔ سنگ‌چین D<sub>50</sub> بر پایهٔ شیب کانال و دبی واحد توسعه دادند. معادلهٔ 1 برای شیب‌های ملایم (S<sub>0</sub> < 0.10) به کار می‌رود؛ معادلهٔ 2 برای شیب‌های تند (0.10 ≤ S<sub>0</sub> ≤ 0.40) به کار می‌رود. هر دو معادله به q<sub>t</sub> بر حسب m²/s نیاز دارند و D<sub>50</sub> را بر حسب mm برمی‌گردانند. بازهٔ اعتبارسنجی‌شده 0.02 ≤ S<sub>0</sub> ≤ 0.40 است.';
$ec_lang['rc_notes_2_term']='دبی واحد';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> دبی واحد کل در تاج آبراه است (دبی کل به ازای هر واحد عرض). برای کانالی با عرض کف B که دبی کل Q را حمل می‌کند، می‌توان q<sub>t</sub> ≈ Q / B را تقریب زد، یا آن را از شرط عمق بحرانی در ورودی آبراه محاسبه کرد.';
$ec_lang['rc_notes_3_term']='جریان درون لایه سنگی';
$ec_lang['rc_notes_3_def']='بخشی از جریان کل از میان منافذ سنگ‌چین عبور می‌کند (جریان درون لایه، q<sub>m</sub>)؛ باقی‌مانده روی سطح سنگ جریان می‌یابد (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). عمق جریان d از معادله Manning اعمال‌شده بر جریان سطحی q<sub>s</sub> با استفاده از زبری آبراه n محاسبه می‌شود. تخلخل پیش‌فرض n<sub>p</sub> = 0.45 برای سنگ خردشده زاویه‌دار معمول است.';
$ec_lang['rc_notes_5_term']='محدوده معتبر اندازه سنگ';
$ec_lang['rc_notes_5_def']='این معادلات با استفاده از محدوده D<sub>50</sub> از 15 میلی‌متر تا 278 میلی‌متر توسعه یافته‌اند. نتایج خارج از این محدوده برون‌یابی‌شده هستند و باید همراه با قضاوت مهندسی اضافی به‌کار روند.';
$ec_lang['rc_notes_6_term']='تراز پاشنه خروجی';
$ec_lang['rc_notes_6_def']='تراز روی سنگ‌چین در بازه خروجی باید برابر یا پایین‌تر از تراز بستر کانال پایین‌دست باشد. در غیر این صورت، سنگ‌های خروجی ناپایدار خواهند بود.';

$ec_lang['rc_notes_7_def']='هنگامی که عمق نرمال در کانال ورودی کمتر از هد سرریز (H<sub>p</sub>) مورد نیاز برای عبور q<sub>t</sub> باشد، جریان محدود یا آبگیری در بالادست ورودی آبراه رخ می‌دهد. این وضعیت عموماً قابل‌قبول است — آبگیری سرعت را کاهش می‌دهد و از فرسایش در بالادست جلوگیری می‌کند. برای بررسی: از یک ماشین‌حساب جریان سرریز برای یافتن H<sub>p</sub> با q<sub>t</sub> و عرض تاج داده‌شده استفاده کنید و آن را با عمق نرمال کانال ورودی مقایسه کنید. اگر H<sub>p</sub> از عمق نرمال بیشتر شود، آبگیری رخ خواهد داد.';
$ec_lang['rc_notes_4_term']='مرجع';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). “<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>.” <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS همچنین یک <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">صفحه گسترده Excel</a> بر پایه همین روش منتشر کرده است.';
// Sketch labels
$ec_lang['rc_sketch_filter']='فیلتر';
$ec_lang['rc_sketch_top_crest_curve']='منحنی تاج فوقانی';
$ec_lang['rc_sketch_outlet_apron']='پاشنه خروجی';
$ec_lang['rc_sketch_radius']='شعاع';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='فشار آبیاری';
$ec_lang['ip_main_title']='ماشین‌حساب رایگان آنلاین فشار آبیاری و یکنواختی توزیع';
$ec_lang['ip_main_desc']='آزمایش فشار شاخه و برآورد یکنواختی';
$ec_lang['ip_h_supply']='فشار تامین';
$ec_lang['ip_elev_supply']='تراز تامین، z<sub>supply</sub>';
$ec_lang['ip_q_design']='دبی طراحی قطره‌چکان، q<sub>design</sub>';
$ec_lang['ip_h_design']='فشار طراحی قطره‌چکان';
$ec_lang['ip_x']='<span class="ec-help" title="0.5 برای قطره‌چکان‌های استاندارد غیرجبران‌کننده؛ نزدیک به 0 برای قطره‌چکان‌های جبران‌کننده فشار">توان تخلیه قطره‌چکان، x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='مسیر آزمایش';
$ec_lang['ip_group_reach']='بخش';
$ec_lang['ip_group_upstream']='بالادست';
$ec_lang['ip_group_downstream']='پایین‌دست';
$ec_lang['ip_group_loss']='تلفات';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="انتخاب‌شده: این بخش قسمتی از جانبی آزمایش است که قطره‌چکان‌های آن به‌طور جداگانه آب برمی‌دارند. انتخاب‌نشده: این بخش یک خط اصلی است که فقط جریان را به جانبی‌های خارج از مسیر آزمایش منتقل می‌کند.">جانبی <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="ردیف‌های جانبی: فقط قطره‌چکان‌های همین بخش. ردیف‌های خط اصلی: مجموع قطره‌چکان‌های جانبی‌های دیگری غیر از این که از این بخش منشعب می‌شوند. برای بخشی از خط اصلی که به جانبی آزمایش می‌رسد، این عدد شامل هر جانبی فراتر از آن نقطه در امتداد خط اصلی یا هم‌گره با آن (مانند جانبی سمت مقابل) نیز می‌شود — جریان آن‌ها نیز از همین بخش عبور می‌کند.">قطره‌چکان‌ها <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="تراز انتهای پایین‌دست این بخش. در ردیف‌های میانی اختیاری است (در صورت خالی گذاشتن، به‌طور پیش‌فرض صاف / برابر با گره بالادست فرض می‌شود). در ردیف آخر الزامی است: این مقدار تراز آخرین قطره‌چکان است که مستقیماً فشار تامین موردنیاز را تعیین می‌کند.">تراز پایین‌دست <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='تراز آخرین قطره‌چکان (ردیف آخر) خالی گذاشته شد و به‌طور پیش‌فرض صاف در نظر گرفته شد — برای نتیجه دقیق آن را وارد کنید';
$ec_lang['ip_flow']='جریان';
$ec_lang['ip_press']='فشار';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="تلفات کل بخش، h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='فشار پایین/منفی — بررسی کنید که شرایط زیرجوی (فشار کمتر از یک اتمسفر) رخ نداده باشد';
$ec_lang['ip_pressure_warn_short']='پایین';
$ec_lang['ip_pressure_high']='مکان‌های با فشار بالا به کاهش فشار نیاز دارند';
$ec_lang['ip_pressure_high_short']='بالا';
$ec_lang['ip_max_head']='حداکثر فشار مجاز لوله';
$ec_lang['ip_max_head_tip']='خطوطی که فشار آن‌ها از این مقدار بیشتر شود علامت‌گذاری می‌شوند. برای رد شدن از بررسی فشار بالا، این فیلد را خالی بگذارید.';
$ec_lang['ip_h_far']='فشار آخرین قطره‌چکان';
$ec_lang['ip_q_supply']='<span class="ec-help" title="فقط جریان واردشده به مسیر آزمایش مدل‌شده — برای کل ناحیه/سیستم، به Q_zone در بخش طراحی کاربرد در زیر مراجعه کنید.">دبی تامین مسیر آزمایش، Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='دبی آخرین قطره‌چکان، q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='دبی متوسط قطره‌چکان (جانبی آزمایش)، q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="اینکه یک جانبی معمولی/میانگین را چقدر بالاتر (یا پایین‌تر) از این جانبی آزمایش برآورد می‌کنید. جانبی آزمایش عمداً بدترین حالت فرض شده است، بنابراین میانگین خودِ آن کمتر از میانگین واقعی مزرعه است — اگر این مقدار صفر بماند، بررسی یکنواختی و اعداد طراحی کاربرد در زیر از میانگین خودِ جانبی آزمایش (که احتمالاً خوش‌بینانه است) بدون اصلاح استفاده می‌کنند.">برآورد اختلاف فشار، میانگین در برابر جانبی آزمایش <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral که در فشار هر ردیف جانبی به‌علاوه اختلاف فشار واردشده در بالا دوباره محاسبه شده است — تلاشی برای اصلاح این واقعیت که جانبی آزمایش بدترین حالت فرض شده و نه یک نمونه معرف. هم بررسی یکنواختی و هم بخش طراحی کاربرد در زیر را تغذیه می‌کند.">برآورد دبی متوسط قطره‌چکان در مزرعه، q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="دبی محاسبه‌شده آخرین قطره‌چکان تقسیم بر دبی متوسط برآوردشده قطره‌چکان در مزرعه — این تقریبی از یکنواختی توزیع استاندارد ربع پایین (میانگین گروه پایین ÷ میانگین کل جامعه) است؛ اما از یک نمونه کوچک مدل‌شده و اصلاحی برآوردشده توسط کاربر به‌دست می‌آید، نه از یک نمونه آماری کامل مزرعه. مقادیر برابر یا بیشتر از 1 ممکن و معتبرند: تنها به این معناست که فشار آخرین قطره‌چکان برابر یا بالاتر از میانگین برآوردی مزرعه است، پس قطره‌چکان دیگری نقطه کمترین فشار است. این می‌تواند به این دلیل باشد که آخرین قطره‌چکان در زمین پست‌تری قرار دارد یا برآورد اختلاف فشار خیلی کوچک است.">بررسی یکنواختی، q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='فشار قطره‌چکان آزمایش برابر یا بیشتر از فشار تامین است. این احتمالاً بدترین‌حالت قطره‌چکان نیست، یا می‌توان قطر لوله‌ها را کوچک‌تر کرد.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="این با تقریب ما از معیار استاندارد یکنواختی متفاوت است.">دبی آخرین قطره‌چکان ÷ دبی طراحی، q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='بدون راه‌حل: فشار تامین موردنیاز از فشار تامین واردشده بیشتر است. فشار تامین را افزایش دهید، تقاضا را کاهش دهید، یا از لوله بزرگ‌تری استفاده کنید.';
$ec_lang['ip_notes_1_def']='فشار آخرین (دورترین) قطره‌چکان را حدس می‌زند، سپس خط انرژی را بخش به بخش به سمت تامین بازمی‌گرداند و در این مسیر تلفات اصطکاکی و موضعی را می‌افزاید. تراز و هد سرعت در هر گره کم می‌شود تا فشار واقعی در آنجا گزارش شود. فشار حدسی انتهای دور (با روش دوبخشی) تنظیم می‌شود تا فشار تامین موردنیاز محاسبه‌شده با فشار تامین واردشده برابر شود — همان مسئله حلقه‌بسته‌ای که حل‌کننده جریان لوله در ماشین‌حساب جریان لوله Manning به آن می‌پردازد، با این تفاوت که در اینجا به یک شبکه شاخه‌ای بسط داده شده است.';
$ec_lang['ip_notes_2_term']='بخش‌های خط اصلی در برابر جانبی';
$ec_lang['ip_notes_2_def']='هر ردیف یک بخش در طول تنها مسیر هیدرولیکی بدترین حالت (مسیر آزمایش) از تامین تا آخرین قطره‌چکان است. یک بخش خط اصلی فقط جریان را به جانبی‌های خارج از مسیر آزمایش منتقل می‌کند، بنابراین برداشت آن یک ضرب ساده است (دبی طراحی × تعداد کل قطره‌چکان‌های آن بخش) — بدون حساسیت به فشار موضعی. خط اصلی یک لوله تنه مشترک است، بنابراین بخشی از خط اصلی که به جانبی آزمایش می‌رسد باید نه‌تنها جانبی‌های بین دو انتهای خودش، بلکه هر جانبی دیگری که پایین‌تر در امتداد خط اصلی از آن نقطه قرار دارد یا در همان اتصال مشترک است (مانند جانبی سمت مقابل) را نیز شامل شود — جریان آن‌ها پیش از انشعاب از همین بخش عبور می‌کند، صرف‌نظر از اینکه در جای دیگری این جدول ظاهر شوند یا نه. یک بخش جانبی، قسمتی از خودِ جانبی آزمایش است: تخلیه قطره‌چکان از روی فشار واقعی محلی با q = k·H<sup>x</sup> محاسبه می‌شود و تلفات اصطکاکی با ضریب F(n) کریستیانسن کاهش می‌یابد تا کاهش جریان ناشی از برداشت آب هر قطره‌چکان در آن بخش را لحاظ کند.';
$ec_lang['ip_notes_3_term']='محدودیت‌ها';
$ec_lang['ip_notes_3_def']='این ابزار یک فشار تامین ثابت (بدون منحنی پمپ)، تنها یک مسیر آزمایش (نه کل مزرعه)، و یک منحنی قطره‌چکان دو-پارامتری (توان را نزدیک 0 تنظیم کنید تا قطره‌چکان جبران‌کننده فشار تقریب زده شود) را مدل می‌کند. دو نسبت یکنواختی متفاوت، عمداً جدا از هم گزارش می‌شوند: q<sub>last</sub>/q<sub>avg,field</sub> تقریبی از یکنواختی توزیع استاندارد ربع پایین (میانگین گروه پایین ÷ میانگین کل جامعه) است؛ اما این از یک نمونه کوچک مدل‌شده و اصلاحی برآوردشده توسط کاربر به‌دست می‌آید، نه از نمونه آماری استاندارد کل مزرعه. همچنین، جانبی آزمایش عمداً بدترین حالت فرض شده است، بنابراین میانگین خام و اصلاح‌نشده آن، میانگین واقعی مزرعه را کمتر از واقع نشان می‌دهد و یکنواختی را بهتر از آنچه هست جلوه می‌دهد؛ ورودی اختلاف فشار دقیقاً برای جبران این اریبی وجود دارد. مقادیر یکنواختی برابر یا بیشتر از 1 همچنان ممکن است: تنها به این معناست که فشار آخرین قطره‌چکان برابر یا بالاتر از میانگین برآوردی مزرعه است، پس قطره‌چکان دیگری نقطه کمترین فشار است. این می‌تواند به این دلیل باشد که آخرین قطره‌چکان در زمین پست‌تری قرار دارد یا برآورد اختلاف فشار خیلی کوچک است. q<sub>last</sub>/q<sub>design</sub> بررسی دیگری، غیرمرتبط با یکنواختی، در برابر دبی نامی سازنده است — برای شناسایی فشار بیش‌ازحد یا کمتر از حد سیستم به‌طور کلی مفید است، اما بررسی جداگانه‌ای است که باید در کنار عدد یکنواختی خوانده شود، زیرا دبی طراحی/نامی مستقل از میانگین واقعی فشار کارکرد سیستم است.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. استانداردهای ASAE/ASABE برای طراحی آبیاری قطره‌ای از همین روش تلفات اصطکاکی چندخروجی استفاده می‌کنند.';
$ec_lang['ip_notes_5_term']='طراحی کاربرد';
$ec_lang['ip_notes_5_def']='نرخ کاربرد و جریان سیستم/ناحیه از دبی متوسط برآوردشده قطره‌چکان در مزرعه (q<sub>avg,field</sub> — میانگین خودِ جانبی آزمایش که با برآورد اختلاف فشار واردشده اصلاح شده) استفاده می‌کنند، نه از نرخی حدسی: PR = q<sub>avg,field</sub> / A<sub>e</sub>، که با مقدار اصلاح‌شده مدل تغذیه می‌شود. فاصله‌گذاری و تعداد جانبی/قطره‌چکان در کل سیستم، ورودی‌های جداگانه‌ای در اینجا هستند، زیرا مسیر آزمایش فقط یک شاخه بدترین‌حالت را مدل می‌کند، نه هر جانبی موجود در مزرعه را.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='شبکه لوله انشعابی';
$ec_lang['bpn_main_title']='ماشین‌حساب رایگان آنلاین فشار شبکه لوله انشعابی (بدون حلقه)';
$ec_lang['bpn_main_desc']='دبی و فشار شبکه لوله انشعابی (درخت‌مانند)';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='هد استاتیک تأمین: هد منبع در دبی صفر. سطح آب مخزن یا تانک بالاتر از تراز تأمین، یا هد قطع پمپ. برای تعریف منحنی پمپ یا تأمین متغیر، نقاط تأمین 2 و 3 را نیز وارد کنید؛ ابزار هد را در دبی طراحی می‌خواند.';
$ec_lang['bpn_elev_source']='تراز تأمین';
$ec_lang['bpn_q_total']='دبی کل';
$ec_lang['bpn_q_total_tip']='دبی کل خروجی از منبع (مجموع همه مصارف در شبکه).';
$ec_lang['bpn_p_min']='کمترین فشار';
$ec_lang['bpn_p_min_tip']='کمترین فشار پایین‌دست در سراسر شبکه؛ نقطه بحرانی تحویل آب.';
$ec_lang['bpn_method']='روش اصطکاک';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='خطوط لوله';
$ec_lang['bpn_id']='شناسه';
$ec_lang['bpn_id_tip']='نام این خط لوله. خطوط دیگر در ستون بالادست به آن ارجاع می‌دهند.';
$ec_lang['bpn_upstream']='شناسه بالادست';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='شناسه خطی که این خط را تغذیه می‌کند. برای پیروی از خط دقیقاً بالای آن (یک خط لوله سری ساده) خالی بگذارید. برای انشعاب از خط دیگری، شناسه آن را اینجا وارد کنید.';
$ec_lang['bpn_roughness_tip']='زبری لوله برای روش اصطکاک انتخاب‌شده: n مانینگ، C هیزن-ویلیامز، یا ارتفاع زبری دارسی-وایسباخ e (یک طول). لوله پلاستیکی صاف معمول: n حدود 0.009، C حدود 150، e حدود 0.0015 میلی‌متر.';
$ec_lang['bpn_demand']='مصرف';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='دبی ثابت تحویلی در انتهای پایین‌دست این خط. برای خطی که فقط دبی را به جلو منتقل می‌کند، خالی بگذارید.';
$ec_lang['bpn_demand_mult']='ضریب مصرف';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='این ضریب، دبی مصرف همهٔ خطوط را هم‌زمان مقیاس می‌کند؛ برای اجرای ساعت اوج مصرف یا رشد آینده به کار می‌رود. برای دبی‌های مصرف همان‌طور که وارد شده‌اند، از عدد 1 استفاده کنید.';
$ec_lang['bpn_elev_down']='تراز پ‌د';
$ec_lang['bpn_q_line']='دبی خط';
$ec_lang['bpn_q_line_tip']='دبی کل حمل‌شده توسط این خط: مصرف خودش به‌علاوه هر مصرف پایین‌دستی که تغذیه می‌کند.';
$ec_lang['bpn_p_down']='فشار پ‌د';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='هد فشار مانومتری در گره پایین‌دست این خط. مقدار منفی (علامت‌گذاری‌شده) یعنی فشار زیر جو؛ طراحی را بررسی کنید.';
$ec_lang['bpn_sketch_heading']='نمودار شبکه';
$ec_lang['bpn_show_length']='طول';
$ec_lang['bpn_show_diameter']='قطر';
$ec_lang['bpn_show_q']='دبی';
$ec_lang['bpn_show_p']='فشار';
$ec_lang['bpn_source_label']='منبع';
$ec_lang['bpn_line_problem']='این خط به منبع متصل نیست: به شناسه‌ای بالادست ناشناخته اشاره می‌کند، به خودش ارجاع می‌دهد، شناسه‌ای را که خط دیگری از پیش به کار برده تکرار می‌کند، یا حلقه‌ای تشکیل می‌دهد. خطوطی که متصل نیستند حل‌نشده باقی می‌مانند.';
$ec_lang['bpn_bad_id_short']='شناسهٔ نامعتبر';


$ec_lang['bpn_pressure_warn']='فشار کم/منفی؛ شرایط زیر جو را بررسی کنید';
$ec_lang['bpn_pressure_warn_short']='کم';
$ec_lang['bpn_notes_1_term']='به‌طور پیش‌فرض سری، انشعاب در صورت نیاز';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='شناسه بالادست را خالی بگذارید تا خط از خط بالای خود پیروی کند؛ یک خط لوله سری ساده. برای انشعاب از یک خط بالادست، شناسه آن را وارد کنید. پس: به‌طور پیش‌فرض سری، و درخت‌مانند در صورت نیاز.';
$ec_lang['bpn_notes_2_term']='فقط شبکه‌های انشعابی، بدون حلقه';
$ec_lang['bpn_notes_2_def']='هر خط دقیقاً یک خط بالادست دارد (یک درخت). این ابزار شبکه‌های حلقه‌دار را حل نمی‌کند؛ آن‌ها به روش‌های تکراری (EPANET یا مشابه) نیاز دارند. حذف حلقه‌ها همان چیزی است که این ابزار را ساده و دقیق نگه می‌دارد.';
$ec_lang['bpn_notes_3_term']='بدون کنترل‌های فعال فشار';
$ec_lang['bpn_notes_3_def']='می‌توانید یک شیر افت موضعی ثابت (یک مقدار k) اضافه کنید، اما نه شیرهای کاهنده یا نگه‌دارنده فشار (PRV/PSV). وضعیت باز/بسته آن‌ها به دبی و فشار بستگی دارد که تکرار محاسبات را الزامی می‌کند.';


$ec_lang['bpn_supply2_q']='دبی تأمین 2';
$ec_lang['bpn_supply2_h']='هد تأمین 2';
$ec_lang['bpn_supply3_q']='دبی تأمین 3';
$ec_lang['bpn_supply3_h']='هد تأمین 3';
$ec_lang['bpn_supply_pt_tip']='نقاط اختیاری منحنی تأمین 2 و 3. برای مدل‌سازی یک پمپ، یا هر منبعی که با افزایش تحویل دبی، هدش افت می‌کند، برای هر نقطه یک دبی و هد وارد کنید؛ ابزار هد را در دبی طراحی می‌خواند. نقطه 1 در بالا، هد استاتیک در دبی صفر است. برای هد ثابت مخزن، 2 و 3 را خالی بگذارید.';
$ec_lang['bpn_h_supply']='هد تأمین';
$ec_lang['bpn_h_supply_tip']='هد منبع در دبی طراحی، خوانده‌شده از منحنی تأمین. وقتی منحنی صاف باشد (یک مخزن)، برابر با هد منبع واردشده است.';
$ec_lang['bpn_show_elevation']='تراز';
$ec_lang['bpn_supply1_h']='هد استاتیک تأمین';
$ec_lang['lpn_main_menu']='شبکه آبرسانی';
$ec_lang['lpn_main_title']='ماشین‌حساب رایگان آنلاین شبکه توزیع آب با حل‌کننده EPANET';
$ec_lang['lpn_main_desc']='تحلیل شبکه آبرسانی: رسم شبکه لوله حلقوی یا وارد کردن فایل‌های EPANET';
$ec_lang['lpn_title_units']='واحدهای {units}';
$ec_lang['lpn_tool_select']='انتخاب';
$ec_lang['lpn_tool_add_junction']='گره';
$ec_lang['lpn_tool_add_reservoir']='مخزن';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='تانک';
$ec_lang['lpn_tool_add_pipe']='لوله';
$ec_lang['lpn_tool_add_pump']='پمپ';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='شیر';
$ec_lang['lpn_tool_add_text']='متن';
$ec_lang['lpn_tool_vertices']='رأس‌ها';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='مشترک';
$ec_lang['lpn_tool_add_meter_tip']='جایی که مشترک هست کلیک کنید، سپس لوله یا گرهی را که به آن خدمت می‌دهد کلیک کنید. مصرفی که به مشترک می‌دهید به گرهٔ نزدیک‌ترین انتهای آن لوله افزوده می‌شود.';
$ec_lang['lpn_mode_add_meter']='حالت: مشترک. جایی که مشترک هست کلیک کنید، سپس لوله یا گرهی را که به آن خدمت می‌دهد کلیک کنید. یا برای لغو، Esc را بزنید.';
$ec_lang['lpn_pane_tab_customers']='مشترک‌ها';
$ec_lang['lpn_customer_heading']='مشترک {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='مصرف هر انشعاب';
$ec_lang['lpn_field_meter_demand_tip']='آنچه هر انشعاب این مشترک نیاز دارد. یافتن و جایگزینی می‌تواند از تفاوت میان خالی و 0 استفاده کند.';
$ec_lang['lpn_field_meter_count']='شمار انشعاب‌ها';
$ec_lang['lpn_field_meter_count_tip']='این یک مشترک نمایندهٔ چند انشعاب یکسان است، تا مثلاً چهل و دو اتصال تک‌خانواری در امتداد یک خط اصلی بتوانند یک نماد در یک نقطه باشند. مجموع زیر برابر است با مصرف بالا ضرب‌در همین شمار.';
$ec_lang['lpn_field_meter_total']='مجموع مصرف';
$ec_lang['lpn_field_meter_total_tip']='مصرف هر انشعاب ضرب‌در شمار انشعاب‌ها. این همان عددی است که به گرهٔ نام‌برده‌شده در زیر افزوده می‌شود.';
$ec_lang['lpn_field_meter_pipe']='المان متصل';
$ec_lang['lpn_field_meter_pipe_suggest']='نزدیک‌ترین المان {id} است. برای خدمت‌دهی به این مشترک از آن، آن را اینجا تایپ کنید.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='متصل به';
$ec_lang['lpn_field_meter_node_tip']='گره‌ای که این مشترک به آن متصل است. نقطهٔ اتصال را روی یک لوله بکشید تا در عوض از ایستگاهی در امتداد آن لوله خدمت بگیرد.';
$ec_lang['lpn_meter_pipe_unknown']='هیچ‌چیز در این پروژه {id} نام ندارد، پس مشترک همان‌جا که بود باقی ماند.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_field_meter_pattern_tip']='مصرف این مشترک در طول اجرا چگونه بالا و پایین می‌رود. این در مجموع مصرف ضرب می‌شود، پس روی هر انشعابی که این مشترک نمایندهٔ آن است اثر می‌گذارد. آن را روی «بدون الگو» بگذارید تا از الگوی مصرف پیش‌فرض پروژه پیروی کند.';
$ec_lang['lpn_meter_pattern_unknown']='هیچ الگویی در این پروژه {id} نام ندارد، پس مشترک همان‌طور که بود باقی ماند.';
$ec_lang['lpn_meter_placed']='مشترک {id} افزوده شد. توضیح و مصرف آن در جدول مشترک‌ها تایپ می‌شود، یا در حالت انتخاب روی آن بزنید تا جعبه‌اش باز شود.';
$ec_lang['lpn_field_meter_pipe_tip']='المانی که این انشعاب به آن وصل است. برای تغییر آن، المان دیگری را اینجا یا در جدول مشترک‌ها تایپ کنید، یا نقطهٔ اتصال را به المان دیگری بکشید.';
$ec_lang['lpn_field_meter_station']='ایستگاه در امتداد لوله (٪)';
$ec_lang['lpn_field_meter_station_tip']='انشعاب چقدر در امتداد لوله وصل می‌شود، به‌صورت درصدی از لوله از گرهٔ نخست آن تا گرهٔ دوم. 0 در یک انتها و 100 در انتهای دیگر است. دایرهٔ روی لوله همین کار را با اشاره‌گر انجام می‌دهد.';
$ec_lang['lpn_field_meter_offset']='فاصله از لوله';
$ec_lang['lpn_field_meter_offset_tip']='مثبت یعنی سمت راست لوله، نگاه‌کرده از گرهٔ نخست آن به‌سوی گرهٔ دوم. تایپ کردن مقداری اینجا می‌تواند مشترک را به سمت دیگر خط اصلی ببرد، و همیشه خط انشعاب را عمود بر خط اصلی می‌کند.';
$ec_lang['lpn_field_meter_lumped']='افزوده‌شده به گره';
$ec_lang['lpn_field_meter_lumped_tip']='نزدیک‌ترین گره؛ مصرف‌های این مشترک آنجا افزوده می‌شود.';
$ec_lang['lpn_node_customers']='مصرف‌های مشترکان';
$ec_lang['lpn_node_customers_tip']='فهرست مشترکانی که در این گره افزوده شده‌اند (چون این گره نزدیک‌ترین بود). مصرف‌های مشترکان افزون بر دیگر مصرف‌های فهرست‌شده در اینجاست. یک مشترک همان‌جا که روی نقشه نشسته یا در جدول مشترک‌ها ویرایش می‌شود.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} از {n} مشترک';
$ec_lang['lpn_customer_detached']='⚠ این مشترک به هیچ لوله‌ای وصل نیست، پس مصرف آن در پاسخ‌ها نیست. آن را حذف کنید، یا لوله‌ای بکشید و مشترک را روی آن ببرید.';
$ec_lang['lpn_customer_fixed_head']='⚠ انتهای نزدیک آن لوله سطح آب ثابتی دارد، پس این مصرف روی شبیه‌سازی اثر نمی‌گذارد.';
$ec_lang['lpn_customer_detached_count']='{n} مشترک به هیچ لوله‌ای وصل نیستند. مصرف آن‌ها به‌حساب نمی‌آید.';
$ec_lang['lpn_meter_pick_pipe']='اکنون لوله یا گرهی را که به این مشترک خدمت می‌دهد کلیک کنید. مشترک همان‌جا که گذاشتید می‌ماند. برای لغو Escape را بزنید.';
$ec_lang['lpn_inp_export_flat_customers']='فایل EPANET مشترکی ندارد. مصرف {n} مشترک این پروژه به‌صورت یک ردیف مصرف روی گرهی که هرکدام به آن افزوده شده وارد فایل می‌شود، و هر ردیف با تگ آن مشترک نام‌گذاری می‌شود. آنچه فایل نمی‌تواند نگه دارد خود مشترک است: کجا نشسته، کدام لوله به آن خدمت می‌دهد، کجای آن لوله انشعاب وصل می‌شود، و یک مشترک نمایندهٔ چند انشعاب است. فایل پروژهٔ خودتان همهٔ این‌ها را نگه می‌دارد.';

$ec_lang['lpn_area_hint_window_start']='روی یکی از گوشه‌های پنجره کلیک کنید.';
$ec_lang['lpn_area_hint_window_go']='برای پایان دادن، روی گوشهٔ مقابل کلیک کنید.';
$ec_lang['lpn_area_hint_lasso_start']='برای شروع طرح کلیک کنید.';
$ec_lang['lpn_area_hint_lasso_go']='برای رسم طرح حرکت کنید. برای پایان دادن کلیک کنید.';
$ec_lang['lpn_area_hint_polygon_start']='برای رسم ناحیهٔ چندضلعی کلیک کنید. برای پایان دادن دوبار کلیک کنید.';
$ec_lang['lpn_area_hint_polygon_go']='روی هر گوشه کلیک کنید. برای پایان دادن، روی آخرین گوشه دوبار کلیک کنید.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='هنگام انتخاب، کلید Shift را نگه دارید تا انتخاب موجود ادامه یابد و آنچه انتخاب می‌کنید افزوده یا حذف (تغییر وضعیت) شود.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='روی نقشه فشار دهید و دور آنچه می‌خواهید بکشید، سپس رها کنید.';
$ec_lang['lpn_area_hint_touch_go']='دور آنچه می‌خواهید بکشید، سپس برای پایان دادن رها کنید.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='نمایش این';
$ec_lang['lpn_multi_title']='{n} انتخاب‌شده';
$ec_lang['lpn_multi_varies']='متفاوت';
$ec_lang['lpn_multi_applied']='{prop} روی {n} تنظیم شد.';
$ec_lang['lpn_multi_no_fields']='این موارد چیزی ندارند که بتوان این‌جا با هم تنظیم کرد.';
$ec_lang['lpn_pane_pasted']='{n} سلول جای‌گذاری شد. {skipped} مورد تغییر نکرد.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='{n} ردیف چسبانده شد و {created} تای آن‌ها به شبکه افزوده شد.';
$ec_lang['lpn_pane_pasted_rows_skipped']='{n} ردیف چسبانده شد و {created} تای آن‌ها به شبکه افزوده شد. {skipped} سلول تغییر نکرد.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='اینجا کلیک کنید و ردیف‌هایی از یک صفحه‌گسترده بچسبانید تا افزوده شوند.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='چسباندن به‌صورت ردیف‌های تازه در انتهای جدول';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='برای افزودن ردیف‌های کپی‌شده در پایین این جدول، Ctrl+V را بزنید. برای لغو، Esc را بزنید.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='این چسباندن {n} ردیف دارد، و {fit} تای آن‌ها در جدول جا می‌شود. {extra} تای دیگر به‌صورت ردیف‌های تازه در پایین افزوده شوند؟';
$ec_lang['lpn_pane_paste_overflow_add']='افزودن {extra} ردیف';
$ec_lang['lpn_pane_paste_overflow_fit']='فقط {fit} تایی که جا می‌شود چسبانده شود';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='این چسباندن {n} ردیف دارد، و {fit} تای آن‌ها در جدول جا می‌شود. {extra} تای دیگر را نمی‌توان به‌صورت ردیف‌های تازه افزود: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} شناسه مطابقت ندارد. باز هم چسبانده شود؟';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='چیزی چسبانده نشد. {reasons}';
$ec_lang['lpn_pane_paste_more']='ردیف‌های دارای مشکل که اینجا نشان داده نشدند: {n}.';
$ec_lang['lpn_pane_paste_no_id']='ردیف {row}: یک ردیف تازه به شناسه نیاز دارد.';
$ec_lang['lpn_pane_paste_bad_id']='ردیف {row}: شناسهٔ {id} فاصله یا نشانهٔ نقل‌قول دارد.';
$ec_lang['lpn_pane_paste_id_taken']='ردیف {row}: شناسهٔ {id} از پیش در حال استفاده است.';
$ec_lang['lpn_pane_paste_id_twice']='ردیف {row}: شناسهٔ {id} دوبار در این چسباندن استفاده شده.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='ردیف {row}: یک گرهٔ تازه به هر دوی {first} و {second} نیاز دارد.';
$ec_lang['lpn_pane_paste_no_ends']='ردیف {row}: یک لولهٔ تازه به یک گرهٔ «از» و یک گرهٔ «به» نیاز دارد.';
$ec_lang['lpn_pane_paste_no_node']='ردیف {row}: گرهٔ {id} هنوز وجود ندارد. نخست گره‌هایتان را بچسبانید، سپس لوله‌هایتان را.';
$ec_lang['lpn_pane_paste_same_ends']='ردیف {row}: «از» و «به» یک گره هستند.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='ردیف {row}: {text} یک {col} معتبر نیست.';
$ec_lang['lpn_pane_filled']='{n} سلول پر شد. {skipped} تغییر نکرد.';
$ec_lang['lpn_pane_filldown']='پر کردن رو به پایین';
$ec_lang['lpn_pane_fill_none']='چیزی در این گزینش قابل پر کردن رو به پایین نیست.';
$ec_lang['lpn_pane_ctrlenter_filled']='{n} سلول پر شد. {skipped} تغییر نکرد.';
$ec_lang['lpn_pane_hide_col']='پنهان کردن این ستون';
$ec_lang['lpn_pane_hide_cols']='پنهان کردن این ستون‌ها';
$ec_lang['lpn_pane_show_all_cols']='نمایش همهٔ ستون‌ها';
$ec_lang['lpn_pane_sort_asc']='مرتب‌سازی صعودی';
$ec_lang['lpn_pane_manage_cols']='مدیریت ستون‌ها…';
$ec_lang['lpn_pane_manage_cols_title']='مدیریت ستون‌ها';
$ec_lang['lpn_pane_manage_cols_show']='نمایش';
$ec_lang['lpn_pane_manage_cols_up']='جابه‌جایی به بالا';
$ec_lang['lpn_pane_manage_cols_down']='جابه‌جایی به پایین';
$ec_lang['lpn_pane_manage_cols_top']='جابه‌جایی به آغاز';
$ec_lang['lpn_pane_manage_cols_bottom']='جابه‌جایی به پایان';
$ec_lang['lpn_pane_colmenu_tip']='پنهان کردن یا مدیریت ستون‌ها';
$ec_lang['lpn_pane_sortarrow_tip']='برعکس کردن ترتیب';
$ec_lang['lpn_tool_area_window']='انتخاب یک پنجره';
$ec_lang['lpn_tool_area_lasso']='انتخاب با کمند';
$ec_lang['lpn_tool_area_polygon']='انتخاب یک چندضلعی';
$ec_lang['lpn_tool_delete']='حذف';
$ec_lang['lpn_tool_zoom_extent']='نمایش کل نقشه';
$ec_lang['lpn_tool_zoom_window']='بزرگ‌نمایی پنجره‌ای';
$ec_lang['lpn_zoom_in']='بزرگ‌نمایی';
$ec_lang['lpn_zoom_out']='کوچک‌نمایی';
$ec_lang['lpn_new_text']='متن';
$ec_lang['lpn_field_text_bold']='متن پررنگ';
// Justification for a Text object (Task 342). **The standard terms, and nothing invented** (Tom,
// 2026-08-17: "standard English usage would be better... Horizontal justification and Vertical
// justification; you don't even have to mention the anchor point").
//
// **NO SYNONYM ENTRY, and the reason is a rule rather than an omission** (Tom, 2026-08-18: "no syn.
// It's a technical term. We can only give a definition, which is not our job."). $ec_lang_syn holds
// phrases that could STAND ON THE CONTROL in place of the label; a technical term has no such
// alternatives, and what a first draft put there was a definition wearing a synonym's clothes.
$ec_lang['lpn_field_text_align']='ترازبندی افقی';
$ec_lang['lpn_field_text_align_left']='چپ';
$ec_lang['lpn_field_text_align_center']='وسط';
$ec_lang['lpn_field_text_align_right']='راست';
$ec_lang['lpn_field_text_valign']='ترازبندی عمودی';
$ec_lang['lpn_field_text_valign_top']='بالا';
$ec_lang['lpn_field_text_valign_middle']='میان';
$ec_lang['lpn_field_text_valign_bottom']='پایین';
$ec_lang['lpn_field_text_rotation']='زاویه (درجه)';
$ec_lang['lpn_field_text_match_pipe']='چرخش به زاویهٔ نزدیک‌ترین لوله';
$ec_lang['lpn_field_text_flip']='چرخش 180 درجه';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='المان متصل';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='این متن به‌اندازه‌ای نزدیک به یک المان قرار گرفته که آن را دنبال می‌کند، پس همراه آن المان جابه‌جا می‌شود و رهبری دارد. متنی که روی رهبر است تراز افقی و عمودی خود را از سمتی که روی آن نشسته می‌گیرد، و به همین دلیل آن دو ردیف در حالت پیوسته پیشنهاد نمی‌شوند.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='ضریب گسیلنده';
$ec_lang['lpn_field_emitter_tip']='خروجی اضافه‌ای که به فشار وابسته است، برای یک آبپاش، یک خروجی باز، یا یک نشتی مدل‌شده. جریانی که آزاد می‌کند برابر است با این ضریب ضرب‌در فشار به‌توان نمای گسیلنده، که یک‌بار برای کل شبکه زیر تنظیمات، محاسبه، هیدرولیک تعیین می‌شود. در یک اتصال معمولی آن را خالی بگذارید.';
$ec_lang['lpn_field_elev']='تراز';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
// entry carrying translatable payload nobody on the page can see.
$ec_lang['lpn_field_elev_tip']='تراز زمین یا لوله در این گره. آن را از هر مبدأ صفری که می‌خواهید اندازه بگیرید، به شرط آنکه همه گره‌ها یک مبدأ داشته باشند.';
// A reservoir carries an elevation AND a head. Leaving the head blank means "the water surface is
// at the reservoir's own elevation"; the placeholder string is what shows in that empty box.
// This USED to read "so it doubles as a tank" (Tom, 2026-07-30), which was true only while there
// was no tank. Since Task 248 there is one, and the two are different assets: a reservoir's level
// never moves, a tank's does. Raising a reservoir's head is still a legitimate thing to do -- it is
// just not how you model storage any more.
$ec_lang['lpn_field_head']='هد';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='تراز سطح آب در مخزن، به‌صورت ارتفاع، نه فشار. برای قرار دادن سطح آب در تراز مخزن، آن را خالی بگذارید.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='تراز کف تانک. عمق‌های آب در تانک از همین‌جا به‌بالا اندازه‌گیری می‌شوند.';
$ec_lang['lpn_field_tank_level']='عمق آب';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='عمق آب ایستاده در تانک، اندازه‌گیری‌شده از کف تانک به‌بالا. سطح آب برابر است با تراز کف تانک به‌علاوه این عمق.';
$ec_lang['lpn_field_tank_minlevel']='کمترین عمق آب';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='عمق آبی که در آن تانک خالی در نظر گرفته می‌شود، اندازه‌گیری‌شده از کف تانک به‌بالا.';
$ec_lang['lpn_field_tank_maxlevel']='بیشترین عمق آب';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='عمق آبی که در آن تانک پر در نظر گرفته می‌شود، اندازه‌گیری‌شده از کف تانک به‌بالا.';
$ec_lang['lpn_field_tank_diameter']='قطر تانک';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='عرض تانک از یک طرف تا طرف دیگر. واحد آن مانند واحد تراز است، نه واحد قطر لوله. همین مقدار تعیین می‌کند که هر عمق مشخص چقدر آب در خود جای می‌دهد.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='تراز سطح آب در تانک: تراز کف تانک به‌علاوه عمق آب. این همان تراز است که حل‌کننده برای تانک به‌کار می‌برد.';
$ec_lang['lpn_close']='بستن';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='ویژگی‌ها';
$ec_lang['lpn_empty_hint']='از منوی فایل، پروژه جدید را برای باز کردن یک نمونه به کار ببرید. یا کار را با افزودن یک مخزن، گره، و لوله از نوار ابزار شروع کنید.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='شبکهٔ شما دست‌نخورده است.';
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
$ec_lang['lpn_examples_welcome']='به مدل‌سازی شبکهٔ آب‌رسانی، با حل‌کنندهٔ EPANET، خوش آمدید';
$ec_lang['lpn_examples_heading']='باز کردن یک نمونه';
$ec_lang['lpn_examples_sub']='هر نمونه به‌صورت نسخهٔ شخصی شما باز می‌شود. آن را تغییر دهید، ذخیره کنید، یا نسخهٔ تازه‌ای باز کرده و دوباره شروع کنید.';
$ec_lang['lpn_examples_open']='باز کردن';
$ec_lang['lpn_examples_menu']='باز کردن نمونه…';
$ec_lang['lpn_examples_blank']='یا با یک نقشهٔ خالی شروع کنید';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_close']='بستن';
$ec_lang['lpn_examples_size']='گره‌ها: {nodes}، لوله‌ها: {links}';
$ec_lang['lpn_examples_failed']='نمونه‌ها بارگیری نشدند. برای شروع یک ترسیم تازه، از منوی فایل، پروژهٔ جدید را انتخاب کنید.';
$ec_lang['lpn_examples_loading']='در حال بارگیری نمونه‌ها…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='رفع یک مشکل';
$ec_lang['lpn_help_notes']='یادداشت‌های این صفحه';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='این‌جا مشکلی هست؟';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='یک فشار به ما می‌گوید چیزی در این صفحه اشتباه است. نام این صفحه، زبانی که آن را می‌خوانید، و پیام روی نقشه—اگر وجود داشته باشد—را ارسال می‌کند. هیچ‌چیز از آنچه تایپ کرده‌اید، هیچ نشانی، و هیچ‌چیز از ترسیم شما ارسال نمی‌شود. کسی نمی‌تواند پاسخ دهد، چون این هیچ‌چیز دربارهٔ هویت شما به ما نمی‌گوید. وقتی می‌خواهید بیشتر بگویید، از راهنما، رفع یک مشکل استفاده کنید.';
$ec_lang['lpn_wrong_thanks']='سپاسگزاریم. این به دست ما رسید.';
$ec_lang['lpn_status_example_opened']='{name} باز شد. این نسخهٔ شماست: با فایل، ذخیره به‌عنوان، آن را ذخیره کنید.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='این صفحه نتوانست اندازهٔ ناحیهٔ نقشه را محاسبه کند، پس نقشه آخرین نمایی را که توانسته محاسبه کند نشان می‌دهد. تغییر اندازهٔ پنجره باعث می‌شود دوباره تلاش کند. اگر این اتفاق ادامه یافت، افزونهٔ مرورگری که اندازه‌گیری‌های صفحه را مسدود می‌کند علت معمول آن است.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='شبکهٔ پایه، L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='از اینجا شروع کنید. یک مخزن، یک پمپ و یک حلقهٔ کوچک: کوچک‌ترین آرایشی که همچنان به‌عنوان یک شبکهٔ آب کار می‌کند. لیتر بر ثانیه، با متر و میلی‌متر.';
$ec_lang['lpn_ex_basic_us_title']='شبکهٔ پایه، gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='همان شبکهٔ آغازین، بر حسب گالن بر دقیقه، با فوت و اینچ.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='کوچک‌ترین شبکهٔ نمونهٔ EPANET از میان سه شبکه: یک مخزن، یک پمپ و یک حلقهٔ تکی.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='یک شبکهٔ توزیع انشعابی با یک تانک، از نمونه‌های EPANET.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='نمونهٔ بزرگ EPANET: ۹۲ گره، ۳ تانک و ۲ مخزن، که یکی از آن‌ها یک رودخانه است. ارزش باز کردن دارد تا ببینید یک مدل با اندازهٔ واقعی روی نقشه چگونه به نظر می‌رسد.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3، عرض/طول جغرافیایی';
$ec_lang['lpn_ex_net3_world_desc']='همان شبکهٔ EPANET Net3، گذاشته‌شده در یک نقطهٔ دلخواه روی کرهٔ زمین: مختصات آن عرض و طول جغرافیایی است، و پشت آن یک نقشهٔ خیابان رسم شده است.';
$ec_lang['lpn_ex_elm_street_title']='مرکز خیابان اِلم';
$ec_lang['lpn_ex_elm_street_desc']='یک سایت تجاری که برای جریان آتش‌نشانی به‌علاوهٔ حداکثر مصرف روزانه، در یک لحظهٔ زمانی مشخص و روی نقشهٔ سایت رسم و حل شده است.';
$ec_lang['lpn_tool_undo']='واگرد';
$ec_lang['lpn_confirm_example']='این کار نمونه را به شبکه‌ای که هم‌اکنون دارید اضافه می‌کند. ادامه می‌دهید؟';
$ec_lang['lpn_field_diameter']='قطر';
$ec_lang['lpn_demand_tip']='دبی‌های خارج‌شده از شبکه در این گره. برای دبی وارد‌شده به شبکه در این‌جا، یک عدد منفی وارد کنید.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='این واحد تعیین می‌کند ورودی‌های شما چه معنایی دارند';
$ec_lang['lpn_units_warn_lead']='{unit} واحد چیزی است که برای این‌ها وارد می‌کنید:';
$ec_lang['lpn_units_options_head']='وقتی واحدی را تغییر می‌دهید:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='غیرمخرب';
$ec_lang['lpn_units_nondestructive_desc']='غیرمخرب: هر ورودی را همان‌گونه که هست باقی می‌گذارد و آن را در واحد جدید بازتفسیر می‌کند.';
$ec_lang['lpn_units_destructive']='مخرب';
$ec_lang['lpn_units_destructive_desc']='مخرب: هر ورودی را با یک تبدیل ریاضی بازنویسی می‌کند، تا شبکه از نظر فیزیکی، در محدودهٔ خطای تبدیل، تقریباً همان بماند. ورودی‌های اصلی از دست می‌روند. واگرد آن‌ها را بازمی‌گرداند.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n} مقدار اکنون به معنای {unit} است. چیزی بازنویسی نشد.';
$ec_lang['lpn_status_converted']='{n} مقدار به {unit} بازنویسی شدند.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_color_tip']='شبکه را بر اساس یک کمیت رنگ‌آمیزی کنید، تا یک نقشهٔ بزرگ با یک نگاه خوانده شود. فشار و سرعت معمولاً دو کمیتی هستند که اهمیت دارند.';
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='طول لوله و مختصات نقشه';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='مختصات نقشه';
$ec_lang['lpn_units_mapcoords_deg']='درجه';
$ec_lang['lpn_units_usft']='فوت نقشه‌برداری آمریکا (US survey ft)';
$ec_lang['lpn_units_elevhead']='تراز و هد';
$ec_lang['lpn_units_pressure']='فشار';
$ec_lang['lpn_units_flow']='دبی';
$ec_lang['lpn_units_velocity']='سرعت';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='گرادیان افت هد';
$ec_lang['lpn_result_gradient_tip']='افت هد تقسیم بر طول لوله. از آن برای مقایسه لوله‌های با طول متفاوت نسبت به یک حد طراحی استفاده کنید.';
$ec_lang['lpn_result_water_age']='سن آب';
$ec_lang['lpn_result_water_age_tip']='مدت زمانی که آب رسیده به این نقطه در سیستم بوده است. جایی که جریان‌ها به هم می‌رسند، آب واردشده مخلوطی از سن‌ها را با خود دارد، و عدد این‌جا میانگین وزن‌دار آن‌ها بر پایهٔ دبی است: گره‌ای که بیشتر از یک خط اصلی کوتاه و تازه تغذیه می‌شود سن پایینی نشان می‌دهد حتی اگر یک انتهای بن‌بست بلند هم به آن آب برساند. در یک تانک این میانگین سن آب نگه‌داشته‌شده است، به همین دلیل تانکی که به‌کندی جابه‌جا می‌شود معمولاً کهنه‌ترین آب یک شبکه را دارد. حد نظارتی‌ای برای مقایسه با آن وجود ندارد، پس این عدد را با معیار شبکهٔ خودتان بسنجید.';
$ec_lang['lpn_result_source_share']='سهم منبع';
$ec_lang['lpn_result_source_share_tip']='چه مقدار از آب رسیده به این نقطه از گره ردیاب آمده است. این همان چیزی است که تحلیل ردیابی منبع گزارش می‌کند.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='میانگین سن آب';
$ec_lang['lpn_result_avg_source_share']='میانگین سهم منبع';
$ec_lang['lpn_result_avg_concentration']='میانگین غلظت';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='ضریب اصطکاک';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='نرخ واکنش';
$ec_lang['lpn_result_status']='وضعیت';
$ec_lang['lpn_result_status_open']='باز';
$ec_lang['lpn_result_status_closed']='بسته';
$ec_lang['lpn_result_head']='هد';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='انرژی آب در این گره، به‌صورت ارتفاع ستون آب نوشته شده. این یک ارتفاع است، نه فشار.';
$ec_lang['lpn_result_pressure']='فشار';
$ec_lang['lpn_result_flow']='دبی';
$ec_lang['lpn_result_velocity']='سرعت';
$ec_lang['lpn_result_headloss']='افت هد';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='فقط تنظیمات همین پروژه را بازنشانی می‌کند. طرح شما و پروژه‌های دیگرتان تغییری نمی‌کنند. برای ذخیره تنظیمات دلخواه جهت استفاده دوباره، فایل پروژه‌ای بسازید که فقط تنظیمات را داشته باشد.';
$ec_lang['lpn_reset_all_tip']='هر پروژه، هر تصویر پس‌زمینه، هر تنظیم، و انتخاب واحدهای شما را حذف می‌کند، سپس صفحه را دقیقاً همان‌طور که یک بازدیدکننده تازه می‌بیند، دوباره بارگذاری می‌کند. این تنها بازنشانی‌ای است که همه‌چیز را پاک می‌کند.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='این ماشین‌حساب واحدها و مقادیر ورودی پروژه را همان‌طور که تایپ شده‌اند ذخیره می‌کند، اما پیش‌تر اعداد را برای ذخیره‌سازی به واحد SI تبدیل می‌کرد. این پروژه پیش از آن تغییر ذخیره شده، پس اعدادش به SI ذخیره شده‌اند. آیا آن‌ها را یک‌بار دیگر به واحدهای فعلی تبدیل می‌کنید؟ برای اینکه بتوانید قضاوت کنید، چند قطر که تبدیل می‌شوند، با مقدار پیش و پس از تبدیل، در اینجا آمده است:';
$ec_lang['lpn_v2_restore_yes']='تبدیل';
$ec_lang['lpn_v2_restore_never']='نه. دیگر نپرس.';
$ec_lang['lpn_v2_restore_no']='بستن تا واحدهای فعلی را بررسی کنم';
$ec_lang['lpn_storage_too_new']='این پروژه با نسخه جدیدتری از این صفحه ذخیره شده، پس در اینجا قابل باز شدن نیست.';
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
$ec_lang['lpn_menu_edit']='ویرایش';
$ec_lang['lpn_menu_insert']='درج';
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
$ec_lang['lpn_basemap_show']='نمایش نقشهٔ خیابان';
$ec_lang['lpn_basemap_satellite_show']='نمایش تصاویر ماهواره‌ای';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='جغرافیایی';
$ec_lang['lpn_xymap']='محلی';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='تبدیل به‌عنوان…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='کپی از {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='تبدیل به‌عنوان';
$ec_lang['lpn_convas_coordsys_tip']='دستگاه مختصاتی که کپی به آن تبدیل می‌شود. وقتی با دستگاه مختصات این پروژه فرق کند، دو گام جای‌گذاری در پی می‌آید. پروژه‌ای که از پیش می‌داند کجاست هر دو گام را از پیش پاسخ‌داده‌شده باز می‌کند، پس می‌توانید همان‌طور که هستند بپذیرید یا تغییرشان دهید.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='کنونی: {crs}';
$ec_lang['lpn_convas_epsg']='دستگاه مختصات EPSG';
$ec_lang['lpn_convas_epsg_tip']='دستگاه مختصاتی از ثبت EPSG انتخاب کنید. عرض و طول جغرافیایی WGS 84 است (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='مرجع جغرافیایی بی‌نام (محلی)';
$ec_lang['lpn_convas_unnamed_tip']='مختصات محلی در واحد طول، همراه با نقشهٔ جهان متصل.';
$ec_lang['lpn_convas_none_tip']='مختصات محلی در واحد طول، بدون نقشهٔ جهان فعلاً.';
$ec_lang['lpn_convas_units_tip']='واحدهایی که کپی به آن‌ها تبدیل می‌شود. اصل، عددها و واحدهای خودش را نگه می‌دارد.';
$ec_lang['lpn_convas_round']='گرد کردن مقادیر تبدیل‌شده';
$ec_lang['lpn_convas_round_tip']='فقط عددهایی را که این تبدیل بازمی‌نویسد، به نزدیک‌ترین گام دلخواه شما گرد می‌کند. مقادیری که واحدشان تغییر نمی‌کند دست‌نخورده می‌مانند.';
$ec_lang['lpn_convas_round_none']='بدون گرد کردن';
$ec_lang['lpn_convas_round_flow']='مصرف و دبی';
$ec_lang['lpn_convas_label_col']='پسوند';
$ec_lang['lpn_convas_label_tip']='متنی که پس از این مقدار به برچسب‌های نقشهٔ کپی افزوده می‌شود، مانند \' mm\' یا \' gpm\'. از واحد انتخاب‌شده در بالا از پیش پر می‌شود؛ برای نداشتن پسوند، آن را خالی کنید.';
$ec_lang['lpn_convas_oneway']='تبدیل به عقب یک تبدیل دوم است، نه واگرد. عددی که تبدیل و دوباره به عقب تبدیل شود ممکن است دقیقاً همان‌طور که تایپ شده بازنگردد.';
$ec_lang['lpn_convas_ok']='تبدیل';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} یکی از معدود دستگاه‌های مختصات فهرست‌شده بدون اطلاعات فرافکنی قابل‌استفاده است، پس نمی‌توان به آن یا از آن تبدیل کرد. چیزی تبدیل نشد.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='کپی تبدیل‌شده {name} است. پروژهٔ اصلی تغییر نکرده است.';
$ec_lang['lpn_convas_cancelled']='چیزی تبدیل نشد. کپی بسته شد، و پروژهٔ اصلی تغییر نکرده است.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='این پروژه را در برگه‌ای تازه کپی می‌کند و کپی را به دستگاه مختصات و واحدهای دلخواه شما تبدیل می‌کند. وقتی دستگاه مختصات تغییر کند، راهنمایی گام‌به‌گام شما را از بزرگ‌نمایی تقریبی نقشهٔ پشت شبکه‌تان، سپس مقیاس‌دهی و چرخاندن دقیق‌تر شبکه‌تان روی نقشه عبور می‌دهد. این پروژه دقیقاً همان‌طور که هست باقی می‌ماند. برای جای‌گذاری جغرافیایی بدون تبدیل چیزی، به‌جای آن از نقشه، نقشهٔ جهان، اتصال استفاده کنید.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='این پروژه از پیش جای‌گذاری جغرافیایی شده، پس شبکه از پیش روی نقشه است و چیزی جابه‌جا نشده. بررسی کنید که در جای درست باشد، سپس دکمهٔ «مدل را اینجا بگذار» و دکمهٔ «این جای‌گیری نگه داشته شود» را بزنید.';
$ec_lang['lpn_georef_intro']='جای‌گذاری مدل دو گام دارد. گام 1 گامِ سریع است: مدل بی‌حرکت می‌ماند و شما نقشهٔ پشت آن را جابه‌جا می‌کنید، تا سایت شما تقریباً با اندازهٔ درست زیر مدل قرار گیرد. هنوز چرخشی در کار نیست. گام 2 گامِ دقیق است: خودِ مدل را می‌کشید، اندازه‌اش را تغییر می‌دهید و می‌چرخانید. پروژهٔ شما در آغاز روی نقشه‌ای از کل جهان است، پس نخست مکان خود را بیابید، سپس دکمهٔ «مدل را اینجا بگذار» را بزنید.';
$ec_lang['lpn_georef_adjust']='مدل اکنون روی زمین است، پس همراه با نقشه جابه‌جا می‌شود. مدل را بکشید تا جابه‌جا شود، یک گوشه را بکشید تا اندازه‌اش تغییر کند، دستگیرهٔ گرد بالای مدل را بکشید تا بچرخد. یا فاصلهٔ زمینی و زاویهٔ چرخش را در زیر تایپ کنید.';
$ec_lang['lpn_georef_step1']='گام 1 از 2 — سریع';
$ec_lang['lpn_georef_step2']='گام 2 از 2 — دقیق';
$ec_lang['lpn_georef_step1_hint']='پروژهٔ شما همان‌جایی که روی صفحه است می‌ماند. نقشهٔ زیر آن را پن و زوم کنید تا زمین پشت آن تقریباً در جای درست و تقریباً با اندازهٔ درست باشد، سپس دکمهٔ «مدل را اینجا بگذار» را بزنید.';
$ec_lang['lpn_georef_detach']='دوباره آن را بردارید';
$ec_lang['lpn_georef_size_prompt']='پهنای محل، در سرتاسر پروژه، تقریباً چقدر است؟';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name}: {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='میان‌بر: {key} را فشار دهید.';
$ec_lang['lpn_tool_key_hint_two']='میان‌بر: {key} یا {key2} را فشار دهید.';
$ec_lang['lpn_tool_add_junction_tip']='برای افزودن یک گره روی نقشه کلیک کنید: نقطه‌ای که لوله‌ها در آن به هم می‌رسند یا آب در آن مصرف می‌شود.';
$ec_lang['lpn_tool_add_reservoir_tip']='برای افزودن یک مخزن روی نقشه کلیک کنید: منبعی بی‌پایان با ترازی ثابت.';
$ec_lang['lpn_tool_add_tank_tip']='برای افزودن یک تانک روی نقشه کلیک کنید: ذخیره‌ای که تراز آب آن هنگام پر و خالی شدن بالا و پایین می‌رود.';
$ec_lang['lpn_tool_add_pipe_tip']='یک گره و سپس گرهٔ دیگر را کلیک کنید تا یک لوله میان آن‌ها رسم شود.';
$ec_lang['lpn_tool_add_pump_tip']='یک گره و سپس گرهٔ دیگر را کلیک کنید تا یک پمپ میان آن‌ها قرار گیرد.';
$ec_lang['lpn_tool_add_valve_tip']='یک گره و سپس گرهٔ دیگر را کلیک کنید تا یک شیر میان آن‌ها قرار گیرد.';
$ec_lang['lpn_tool_add_text_tip']='روی نقشه کلیک کنید تا یادداشتی روی ترسیم بنویسید.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='طبق راهنما روی نقشه کلیک کنید تا هر چیز درون شکل انتخاب شود. برای تغییر شکل میان پنجره، کمند و چندضلعی، دوباره این دکمه را فشار دهید. هنگام انتخاب، کلید Shift را نگه دارید تا انتخاب موجود ادامه یابد و آنچه انتخاب می‌کنید افزوده یا حذف (تغییر وضعیت) شود.';
$ec_lang['lpn_area_selected']='{n} انتخاب شد.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='چیزی در آن ناحیه پیدا نشد.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='رأس‌هایی را که شکل یک لوله را روی نقشه می‌سازند اضافه یا حذف کنید. روی یک لوله کلیک کنید تا رأسی افزوده شود، روی یک رأس کلیک کنید تا حذف شود، و یک رأس را بکشید تا جابه‌جا شود. رأس فقط مسیر رسم‌شده را تغییر می‌دهد، نه هیدرولیک را.';
$ec_lang['lpn_tool_delete_tip']='روی هر چیزی در نقشه کلیک کنید تا حذف شود.';
$ec_lang['lpn_tool_undo_tip']='آخرین تغییر را واگرد کنید.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='کل شبکه را در پنجره جای دهید.';
$ec_lang['lpn_tool_zoom_window_tip']='دو گوشهٔ مقابل یک کادر را روی نقشه کلیک کنید، یا یکی را بکشید، تا به آن بزرگ‌نمایی کنید. این دکمه را دوباره بزنید برای «نمایش کل نقشه».';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='بزرگ‌نمایی. میان‌بر: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='کوچک‌نمایی. میان‌بر: -';
$ec_lang['lpn_tool_settings_tip']='تنظیمات این پروژه را باز کنید.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='یک المان را با شناسه‌اش بیابید، یا هر المانی را که با یک شرط مطابقت دارد بیابید، و همه را یک‌جا تغییر دهید.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='معنای نمادهای نوار ابزار';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='نمایان‌سازی';
$ec_lang['lpn_pane_right_toggle_tip']='پنل سمت راست نقشه را نمایش یا پنهان کنید. این پنل انتخاب‌های برچسب و رنگ را در بر دارد.';
$ec_lang['lpn_color_legend_open_tip']='کلیک کنید تا پنل نمایان‌سازی باز شود و این رنگ‌ها را تغییر دهید.';
$ec_lang['lpn_color_node_field']='رنگ گره‌ها بر اساس';
$ec_lang['lpn_color_link_field']='رنگ لوله‌ها بر اساس';
$ec_lang['lpn_color_ramp_sequential']='ترتیبی';
$ec_lang['lpn_color_ramp_diverging']='واگرا';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='شمار بازه‌ها';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='تخصیص بازه‌ها';
$ec_lang['lpn_color_ranges_note']='مرزهای زیر پس از تعیین‌شدن ثابت می‌مانند؛ با تغییر نتایج دنبال آن‌ها نمی‌روند. انتخاب یک روش دسته‌بندی داده در بالا مرزها را از وضعیت اکنون سیستم تعیین می‌کند. اگر مقداری را به دست تغییر دهید، روش بالا به دستی تبدیل می‌شود.';
$ec_lang['lpn_color_criterion_note']='این روش مرزهای خود را از یک استاندارد طراحی می‌گیرد، پس تا وقتی این روش انتخاب شده، شمار رنگ‌ها ثابت است.';
$ec_lang['lpn_color_break_number']='یک مرز باید عدد باشد. نقشه تغییر نکرد.';
$ec_lang['lpn_color_break_order']='هر مرز باید از مرز پیش از خودش بزرگ‌تر باشد. نقشه تغییر نکرد.';
$ec_lang['lpn_color_break_count']='باید یک مرز کمتر از شمار رنگ‌ها وجود داشته باشد. نقشه تغییر نکرد.';
$ec_lang['lpn_color_ramp_qualitative']='کیفی';
$ec_lang['lpn_color_ramp_rainbow']='رنگین‌کمان';
$ec_lang['lpn_color_ramp_rainbow_eg']='مطابق با EPANET';
$ec_lang['lpn_color_example_status']='وضعیت';
$ec_lang['lpn_color_example_material']='جنس';
$ec_lang['lpn_color_ramp_ylgnbu']='زرد به آبی';
$ec_lang['lpn_color_ramp_rdylbu']='قرمز به آبی، از میان زرد';
$ec_lang['lpn_georef_drop']='مدل را اینجا بگذار';
$ec_lang['lpn_georef_finish']='این جای‌گیری نگه داشته شود';
$ec_lang['lpn_georef_cancel']='انصراف';
$ec_lang['lpn_georef_scale']='فاصلهٔ زمینی به ازای هر واحد ترسیم';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='یک واحد از ترسیم شما روی زمین چه فاصله‌ای دارد. ترسیمی که روی یک شبکهٔ ساده ساخته شده معمولاً چیزی دربارهٔ این نمی‌گوید، پس آن را اینجا تنظیم کنید — یا بگذارید «برو به…» با پرسیدن پهنای محل، آن را حساب کند.';
$ec_lang['lpn_georef_rotation']='چرخش پادساعت‌گرد (درجه)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='کل مدل چقدر باید پادساعت‌گرد بچرخد، تا شمال آن رو به شمال باشد.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='مدل برای همیشه این‌جا جای‌گذاری شود؟ می‌توانید بعداً همچنان المان‌ها را یکی‌یکی بکشید، اما ترسیم دیگر یک پروژهٔ xy نخواهد بود. برای بازگرداندن xy، این پروژه را بدون ذخیره ببندید.';
$ec_lang['lpn_georef_done']='این اکنون یک پروژهٔ عرض/طول جغرافیایی است. هر المان را بکشید تا به جای واقعی خود نزدیک‌تر شود.';
$ec_lang['lpn_georef_backdrop_unrotated']='تصویر پس‌زمینه همراه با مدل جابه‌جا و اندازه‌اش تغییر داده شد، اما نتوانست چرخانده شود. برای هم‌ترازکردن آن، از نقشه، تصویر پس‌زمینه، جابه‌جایی استفاده کنید.';
$ec_lang['lpn_georef_empty']='آن فایل شبکه‌ای در خود ندارد، پس چیزی برای جای‌گذاری نیست.';
$ec_lang['lpn_georef_unavailable']='ابزار جای‌گیری بارگذاری نشد. صفحه را دوباره بارگذاری کنید و دوباره تلاش کنید.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='پیش از جابه‌جایی میان پروژه‌ها، جای‌گذاری را با دکمهٔ «نگه‌داشتن این جای‌گذاری» به پایان برسانید، یا Cancel را بزنید. این جای‌گذاری به این پروژه تعلق دارد و نمی‌تواند شما را به پروژه‌ای دیگر همراهی کند.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='پیش از ذخیره کردن، جای‌گذاری را با دکمهٔ «نگه‌داشتن این جای‌گذاری» تمام کنید، یا لغو را فشار دهید. پروژه هنوز در حال جای‌گذاری است، پس آنچه روی صفحه است هنوز آن چیزی نیست که در پرونده نوشته می‌شود.';
$ec_lang['lpn_goto_menu']='برو به یک عرض و طول جغرافیایی…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_tip']='نقشه را به جایی ببرید که مختصات آن را دارید. نخست عرض جغرافیایی، سپس طول جغرافیایی، همان‌طور که یک نقشه آن‌ها را می‌دهد، با یک فاصله میان آن‌ها: 38 -122';
$ec_lang['lpn_goto_prompt']='عرض و طول جغرافیایی، به همین ترتیب';
$ec_lang['lpn_goto_bad']='این یک عرض و یک طول جغرافیایی نیست. 38 -122 را با یک فاصله میان آن‌ها امتحان کنید.';
$ec_lang['lpn_georef_goto']='برو به…';
$ec_lang['lpn_georef_twopt']='استفاده از دو نقطهٔ شناخته‌شده';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='وقتی از پیش می‌دانید دو نقطه از ترسیم شما واقعاً کجا هستند، مدل را دقیقاً جای‌گذاری کنید. روی یکی از آن‌ها کلیک کنید، عرض و طول جغرافیایی آن را تایپ کنید، سپس همین کار را برای نقطهٔ دوم انجام دهید. موقعیت، مقیاس و چرخش، همه از این دو نقطه به دست می‌آیند. برای توقف انتخاب، این دکمه را دوباره بزنید.';
$ec_lang['lpn_georef_twopt_pick1']='روی نقطه‌ای از ترسیم خود کلیک کنید که عرض و طول جغرافیایی آن را می‌دانید.';
$ec_lang['lpn_georef_twopt_pick2']='اکنون یک نقطهٔ شناخته‌شدهٔ دوم را کلیک کنید، تا جایی که می‌توانید از نقطهٔ اول دور باشد.';
$ec_lang['lpn_georef_twopt_same']='آن همان نقطه‌ای است که نخست انتخاب کردید. نقطهٔ دیگری انتخاب کنید.';
$ec_lang['lpn_georef_twopt_done']='مدل اکنون بر پایهٔ دو نقطه‌ای که دادید جای گرفته است. آن را بررسی کنید، سپس دکمهٔ «این جای‌گیری نگه داشته شود» را بزنید.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='پنل پایینی';
$ec_lang['lpn_pane_toggle_tip']='پنل زیر نقشه را نمایش یا پنهان کنید. آن نیم‌رخ و یک جدول برای هر نوع قطعه را در بر دارد.';
$ec_lang['lpn_pane_resize']='بکشید تا پنل بلندتر یا کوتاه‌تر شود';
$ec_lang['lpn_pane_tab_junctions']='گره‌ها';
$ec_lang['lpn_pane_tab_reservoirs']='مخزن‌ها';
$ec_lang['lpn_pane_tab_tanks']='تانک‌ها';
$ec_lang['lpn_pane_tab_pipes']='لوله‌ها';
$ec_lang['lpn_pane_tab_pumps']='پمپ‌ها';
$ec_lang['lpn_pane_tab_valves']='شیرها';
$ec_lang['lpn_pane_tab_tip']='این برگه المان‌های این نوع را به‌صورت جدولی نشان می‌دهد که می‌توانید مرتب و ویرایش کنید. ستون‌های نتیجه قابل ویرایش نیستند.';
$ec_lang['lpn_pane_none']='این شبکه هنوز هیچ‌کدام از این‌ها را ندارد.';
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
$ec_lang['lpn_pane_text_attached']='پیوسته';
$ec_lang['lpn_pane_not_used']='استفاده‌نشده';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='پالایش‌شده با {q}. نمایش {n} از {all}.';
$ec_lang['lpn_pane_filter_clear']='نمایش همه';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='هیچ‌چیز در این جدول با پالایه هم‌خوانی ندارد.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='بزرگ‌نمایی و انتخاب';
$ec_lang['lpn_pane_print']='چاپ جدول';
$ec_lang['lpn_pane_print_tip']='جدولی را که در حال دیدن آن هستید چاپ کنید، همراه با نام پروژه، نام جدول، و واحدها در سرستون‌ها. سطرها به همان ترتیبی که مرتب کرده‌اید چاپ می‌شوند.';

// **HIDE MAP READOUTS IS RETIRED, 2026-09-22** (Tom: "Hide map readouts was a print prep command.
// But it isn't very useful any more. Let's remove it."). lpn_clean_map, lpn_clean_map_off and
// lpn_clean_map_tip were deleted with the row; nothing else read them.
// THE PROJECT MENU (ROADMAP Task 467). Tom, 2026-08-20: "Maybe we can have a Project menu with
// Settings, Library, and Report under it?" Its rows borrow the names they already have --
// lpn_menu_settings, lpn_library_menu, lpn_time_run_report -- so a door cannot drift from the thing
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
$ec_lang['lpn_menu_project']='آب';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='همه‌چیز دربارهٔ مدل‌سازی شبکهٔ آب، جز کنترل‌های پخش پویانمایی، در یک‌جا اینجاست. نیازی به حدس زدن جای چیزها نیست.';
$ec_lang['lpn_tables_menu']='جدول‌ها';
$ec_lang['lpn_tables_menu_tip']='پنل زیر نقشه را روی جدولی از قطعات این شبکه باز کنید. برای هر نوع قطعه یک جدول وجود دارد، و می‌توانید آن را همان‌جا مرتب و ویرایش کنید.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='این شبکه را اکنون دوباره محاسبه کنید. دنبال دکمهٔ محاسبه می‌گردید؟ تا زمانی که تنظیم «محاسبهٔ خودکار» روشن است، پنهان است. برای بازگرداندن دکمه، «محاسبهٔ خودکار» را در تنظیمات، محاسبه، هیدرولیک خاموش کنید.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='محاسبهٔ خودکار';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='وقتی روشن باشد، این پروژه اندکی پس از هر تغییری که می‌دهید دوباره محاسبه می‌شود، و دکمهٔ محاسبه از نوار ابزار برداشته می‌شود چون کاری برایش باقی نمی‌ماند. در شبکه‌ای بزرگ که انتظار برای محاسبهٔ هر تغییر مانع تایپ می‌شود، آن را خاموش کنید؛ آنگاه دکمهٔ محاسبه بازمی‌گردد تا خودتان زمان اجرا را انتخاب کنید.';
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
$ec_lang['lpn_time_run_slow']='محاسبهٔ این شبکه {secs} ثانیه طول کشید، و طوری تنظیم شده که پس از هر تغییری دوباره محاسبه شود. برای متوقف کردن این کار و بازگرداندن دکمهٔ محاسبه، «محاسبهٔ خودکار» را در تنظیمات، زیر محاسبه، هیدرولیک، خاموش کنید.';
$ec_lang['lpn_time_no_report']='هنوز گزارش اجرایی وجود ندارد. این گزارش متن خود EPANET است، پس تنها زمانی نمایان می‌شود که این شبکه با حل‌کنندهٔ EPANET محاسبه شده باشد.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
$ec_lang['lpn_menu_settings']='تنظیمات';
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='راهنما';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='گالری تصاویر صفحه';
$ec_lang['lpn_help_walkthroughs']='راهنماهای گام‌به‌گام';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='حذف شبکه';
$ec_lang['lpn_confirm_delete_network']='هر گره، لوله، و برچسب متنی در این پروژه حذف شود؟ تصویر پس‌زمینه، نام پروژه، و تنظیمات شما نگه داشته می‌شوند. این کار قابل بازگشت نیست.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='یافتن و جایگزینی';
$ec_lang['lpn_find_title']='یافتن و جایگزینی';
$ec_lang['lpn_find_scope']='چه چیزی جست‌وجو شود';
$ec_lang['lpn_find_scope_all']='همه‌چیز';
$ec_lang['lpn_find_property']='ویژگی';
$ec_lang['lpn_find_condition']='شرط';
$ec_lang['lpn_find_value']='مقدار';
$ec_lang['lpn_find_btn']='یافتن';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='پالایش در جدول کنونی';
$ec_lang['lpn_find_filter_tip']='فقط بخش‌هایی را نشان بده که با این پرسش در یکی از جدول‌های زیر نقشه هم‌خوانی دارند. طرح تغییر نمی‌کند و چیزی حذف نمی‌شود.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} از {all}';
$ec_lang['lpn_find_filter_summary']='پالایش‌شده با {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='این پرسمان به هیچ جدولی اعمال نمی‌شود.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='شامل';
$ec_lang['lpn_find_op_equals']='برابر با';
$ec_lang['lpn_find_op_gt']='بزرگ‌تر از';
$ec_lang['lpn_find_op_lt']='کوچک‌تر از';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='خالی';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} یافت شد. برای رفتن به آن، کلیک کنید.';
$ec_lang['lpn_find_none']='چیزی مطابقت نداشت.';
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
$ec_lang['lpn_find_op_top']='بالاترین {n} مورد';
$ec_lang['lpn_find_op_bottom']='پایین‌ترین {n} مورد';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='آنچه را می‌خواهید بیابید تایپ کنید.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='همبندی';
$ec_lang['lpn_find_prop_demand_desc']='توضیح این دستهٔ مصرف';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='بدون اتصالی در گره';
$ec_lang['lpn_find_op_conn_noopen']='بدون اتصال بازی در گره';
$ec_lang['lpn_find_op_conn_nolinksource']='بدون مسیر اتصالی به یک منبع';
$ec_lang['lpn_find_op_conn_noopensource']='بدون مسیر بازی به یک منبع';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
$ec_lang['lpn_find_conn_unlinked']='بدون اتصالی در گره';
$ec_lang['lpn_find_conn_noopen']='بدون اتصال بازی در گره';
$ec_lang['lpn_find_conn_nolinksource']='بدون مسیر اتصالی به یک منبع';
$ec_lang['lpn_find_conn_noopensource']='بدون مسیر بازی به یک منبع';
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='همهٔ گره‌ها متصل‌اند.';
$ec_lang['lpn_find_conn_no_fixed']='این شبکه مخزن یا تانکی ندارد، پس منبعی برای رسیدن به آن وجود ندارد. فقط می‌توان بدون اتصالی در گره و بدون اتصال بازی در گره را جستجو کرد.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='همان جستجو، به‌صورت یک خط نوشته شده. تغییر کنترل‌ها این خط را بازمی‌نویسد، و تایپ در این خط کنترل‌ها را به‌روزرسانی می‌کند.';
$ec_lang['lpn_find_query_label']='پرسمان';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='شرط‌ها را با و، یا و پرانتز () ترکیب کنید';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='و';
$ec_lang['lpn_find_q_or']='یا';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='کنترل‌ها نمی‌توانند پرسمان زیر را بیان کنند، پس پنهان شده‌اند.';
$ec_lang['lpn_find_q_restore']='در عوض از کنترل‌ها استفاده کنید';
$ec_lang['lpn_replace_q_bad']='این پرسمان قابل فهم نیست، پس چیزی نمی‌تواند تغییر کند. نخست آن را در بالا اصلاح کنید.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(در نویسهٔ {n})';
$ec_lang['lpn_find_q_err_empty']='پرسمان خالی است، پس چیزی جستجو نخواهد شد.';
$ec_lang['lpn_find_q_err_scope']='چیزی به نام {w} برای جستجو وجود ندارد. یکی از این‌ها را امتحان کنید: {list}';
$ec_lang['lpn_find_q_err_dot']='میان چیزی که جستجو می‌شود و ویژگی‌اش یک نقطه بگذارید، مانند گره.شناسه';
$ec_lang['lpn_find_q_err_prop']='ویژگی {scope} نیست: {w}. یکی از این‌ها را امتحان کنید: {list}';
$ec_lang['lpn_find_q_err_op']='شرطی برای {prop} نیست: {w}. یکی از این‌ها را امتحان کنید: {list}';
$ec_lang['lpn_find_q_err_value']='این شرط به مقداری پس از خود نیاز دارد: {op}';
$ec_lang['lpn_find_q_err_quote']='دور مقدار متنی گیومه بگذارید: {w} عدد نیست.';
$ec_lang['lpn_find_q_err_quote_end']='این متنِ گیومه‌دار، گیومهٔ بستن ندارد.';
$ec_lang['lpn_find_q_err_close']='این پرانتز ( باز شد و هرگز بسته نشد.';
$ec_lang['lpn_find_q_err_open']='این پرانتز ) چیزی را نمی‌بندد.';
$ec_lang['lpn_find_q_err_end']='چیزی پس از این انتظار نمی‌رفت. دو جستجو را با {and} یا {or} پیوند دهید.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='تغییر آنچه یافت شد';
$ec_lang['lpn_replace_prop']='ویژگیِ مورد تغییر';
$ec_lang['lpn_replace_value']='مقدار جدید';
$ec_lang['lpn_replace_source']='منبع مقدار تازه';
$ec_lang['lpn_replace_asked']='تراز {n} گره درخواست شد. نتایج در راه است.';
$ec_lang['lpn_replace_btn']='جایگزینی';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='{n} المان تغییر کند؟';
$ec_lang['lpn_replace_apply']='تغییر آن‌ها';
$ec_lang['lpn_replace_done']='{n} المان تغییر کرد. می‌توانید این کار را در یک مرحله واگرد کنید.';
$ec_lang['lpn_replace_none']='چیزی تغییر نمی‌کند.';
$ec_lang['lpn_replace_no_value']='مقدار جدید را تایپ کنید.';
$ec_lang['lpn_replace_scope']='یک نوع المان را در بالا انتخاب کنید تا مقادیرش تغییر کند.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='نیم‌رخ';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_tip']='زمین و خط شیب هیدرولیکی را در طول یک مسیر در شبکه رسم کنید.';
$ec_lang['lpn_profile_title']='نیم‌رخ در طول یک مسیر';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='روی گره‌ای که مسیر از آن آغاز می‌شود کلیک کنید.';
$ec_lang['lpn_profile_draw_more']='روی نقشه حرکت کنید تا مسیر را ببینید. برای افزودن یک گره، آن را کلیک کنید. برای پایان دادن، دوبار کلیک کنید. Esc لغو می‌کند.';
$ec_lang['lpn_profile_draw_blocked']='هیچ مسیری از {a} به {b} نیست. گرهٔ دیگری انتخاب کنید.';
$ec_lang['lpn_profile_tap_start']='روی گره‌ای که مسیر از آن آغاز می‌شود ضربه بزنید.';
$ec_lang['lpn_profile_tap_more']='روی گره‌ای ضربه بزنید تا مسیر را ببینید. برای افزودن آن، فشار داده و نگه دارید. برای پایان دادن، دوبار ضربه بزنید. برای لغو، دوباره نیم‌رخ را بزنید.';
$ec_lang['lpn_profile_say_idle']='برای انتخاب مسیری تازه روی نقشه، دوباره نیم‌رخ را بزنید.';
$ec_lang['lpn_profile_none']='هنوز مسیری نیست. برای انتخاب یکی روی نقشه، دوباره نیم‌رخ را بزنید.';
$ec_lang['lpn_profile_choose']='یک گرهٔ آغاز و یک گرهٔ پایان انتخاب کنید.';
$ec_lang['lpn_profile_no_path']='این دو گره با هیچ مسیری به هم متصل نیستند.';
$ec_lang['lpn_profile_no_solve']='هنوز نتیجه‌ای نیست، پس فقط خط زمین رسم شده است.';
$ec_lang['lpn_profile_summary']='گره‌ها: {n}، طول: {len} {u}';
$ec_lang['lpn_profile_axis_station']='فاصله در طول مسیر ({u})';
$ec_lang['lpn_profile_axis_elev']='تراز و هد ({u})';
$ec_lang['lpn_profile_ground']='سطح زمین';
$ec_lang['lpn_profile_hgl']='خط شیب هیدرولیکی';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='ویرایش';
$ec_lang['lpn_profile_edit_tip']='یک سر مسیر را تغییر دهید، یا یک گره را از آن بردارید، بدون این‌که کل مسیر را دوباره رسم کنید.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='هر نقطه روی مسیر را بکشید تا جابه‌جا شود. روی نقطه‌ای که خودتان افزوده‌اید کلیک کنید تا برداشته شود.';
$ec_lang['lpn_profile_edit_tap']='هر نقطه روی مسیر را بکشید تا جابه‌جا شود. روی نقطه‌ای که خودتان افزوده‌اید ضربه بزنید تا برداشته شود.';
$ec_lang['lpn_profile_edit_nowhere']='نقطه‌ای روی مسیر باید یک گره باشد. مسیر تغییر نکرد.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='مسیرهای ذخیره‌شده';
$ec_lang['lpn_profile_new']='مسیر ذخیره‌شدهٔ جدید…';
$ec_lang['lpn_profile_new_name']='مسیر {n}';
$ec_lang['lpn_profile_rename']='تغییر نام مسیر…';
$ec_lang['lpn_profile_delete']='حذف مسیر';
$ec_lang['lpn_profile_prompt_name']='نامی برای این مسیر';
$ec_lang['lpn_profile_delete_confirm']='مسیر ذخیره‌شدهٔ {name} حذف شود؟ خود ترسیم تغییر نمی‌کند.';
$ec_lang['lpn_profile_none_saved']='هنوز مسیر ذخیره‌شده‌ای نیست';
$ec_lang['lpn_profile_missing']='مسیر ذخیره‌شدهٔ {name} از گره‌هایی استفاده می‌کند که در این پروژه نیستند: {ids}';
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
$ec_lang['lpn_ts_menu']='سری زمانی';
$ec_lang['lpn_ts_tip']='یک یا چند المان را در برابر زمان، در طول یک شبیه‌سازی بازهٔ زمانی، نمودار می‌کند.';
$ec_lang['lpn_ts_title']='مقادیر در برابر زمان';
$ec_lang['lpn_ts_group_tip']='نمودار گره‌ها را نشان دهد یا لوله‌ها را.';
$ec_lang['lpn_ts_group_nodes']='گره‌ها';
$ec_lang['lpn_ts_group_links']='لوله‌ها';
$ec_lang['lpn_ts_quantity_tip']='کدام مقدار در برابر زمان نمودار شود.';
$ec_lang['lpn_ts_add']='افزودن انتخاب‌شده‌ها';
$ec_lang['lpn_ts_add_tip']='هرچه اکنون روی نقشه انتخاب شده را به نمودار می‌افزاید.';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='چیزی از آن نوع روی نقشه انتخاب نشده.';
$ec_lang['lpn_ts_clear']='حذف همه';
$ec_lang['lpn_ts_chip_tip']='برداشتن {id} از نمودار';
$ec_lang['lpn_ts_none']='هنوز چیزی برای نمودار نیست. المان‌هایی را روی نقشه انتخاب کنید و «افزودن انتخاب‌شده‌ها» را بزنید.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='هنوز نتیجه‌ای از شبیه‌سازی بازهٔ زمانی نیست. برای اجرای شبیه‌سازی، محاسبه را بزنید.';
$ec_lang['lpn_ts_summary']='المان‌ها: {n}، زمان‌های گزارش‌دهی: {steps}';
$ec_lang['lpn_ts_axis_time']='زمان سپری‌شده';
$ec_lang['lpn_view_units']='واحدها';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='ذخیره همه';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='پروژه{n}';
$ec_lang['lpn_project_copy_suffix']='(کپی)';
$ec_lang['lpn_project_rename']='تغییر نام';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='پروژه جدید…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='پروژهٔ جدید';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='دستگاه مختصات';
$ec_lang['lpn_new_coordsys_tip']='دستگاه مختصات شبکهٔ خود را انتخاب کنید. این انتخاب دائمی است؛ تنها راهی که می‌توانید یک شبکه را به مختصاتی دیگر تبدیل کنید «پرونده، بازکردن با مختصات تازه» است، و آن هم تقریبی است.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='محلی، شماتیک، یا سفارشی';
$ec_lang['lpn_new_coordsys_local_tip']='مرجع‌گذاری جغرافیایی ندارد. تصویر پس‌زمینهٔ خودتان را پیوست کنید یا هیچ‌کدام.';
// ---- THE COORDINATE SYSTEM BOX -----------------------------------------------------------------
// Tom's summary: it "uses the map view as a UX element to filter the universe of projections to the
// ones applicable to the project (view). Lets the user filter by name and select a projection at
// any time." (His own words, kept verbatim; "projection" in visitor strings became "coordinate
// system" on 2026-09-25 -- don't expose the word "projection".) Two filters over one catalogue, and
// the catalogue itself is not keyed: a coordinate system's NAME is the EPSG register's own, exactly
// as the OpenStreetMap credit is, and a GIS reader in any language looks for those characters.
$ec_lang['lpn_new_crs']='فرافکنی نقشه';
// **THE SUB-BOX'S OWN TITLE** (Tom, 2026-09-25). Shared by the New project box and Convert as, so
// it names the box's own subject rather than either caller's radio label.
$ec_lang['lpn_crsbox_title']='دستگاه مختصات';
// The spatial filter. A zoned system covers a strip of the Earth and nothing outside it, so a place
// answers most of the question by itself: searching a town in Arizona leaves two UTM zones standing
// out of a hundred and twenty.
$ec_lang['lpn_crs_view']='پالایش بر پایهٔ نمای نقشه';
$ec_lang['lpn_crs_view_tip']='فقط فرافکنی‌هایی را ارائه می‌دهد که جایی را که نقشه به آن نگاه می‌کند دربر می‌گیرند. برای دیدن کل فهرست آن را خاموش کنید.';
$ec_lang['lpn_crs_place']='جست‌وجوی نام مکان';
$ec_lang['lpn_crs_place_tip']='یک شهر، نشانی، یا نشانه را تایپ کنید تا نمای نقشه به آن‌جا برود. واژه‌هایی که تایپ می‌کنید به سرویس نام‌مکان OpenStreetMap فرستاده می‌شود، که بار نخست از شما اجازه می‌خواهد. یک پروژهٔ جغرافیایی تازه نیز از همان مکانی که این‌جا می‌یابید آغاز می‌شود.';
$ec_lang['lpn_crs_search']='جست‌وجو';
$ec_lang['lpn_crs_name']='پالایش نام فرافکنی';
$ec_lang['lpn_crs_name_tip']='فقط فرافکنی‌هایی را نشان می‌دهد که نام یا کد EPSG آن‌ها شامل آنچه تایپ می‌کنید باشد. یک شمارهٔ ناحیه، یا UTM، یا Mercator را امتحان کنید.';
$ec_lang['lpn_crs_list']='فرافکنی';
$ec_lang['lpn_crs_list_tip']='فرافکنی‌های باقی‌مانده از دو پالایهٔ بالا. یکی را انتخاب کنید و انتخاب را فشار دهید.';
$ec_lang['lpn_crs_choose']='انتخاب';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='هنوز مکانی جست‌وجو نشده، پس کل فهرست ارائه می‌شود. مکانی را در بالا جست‌وجو کنید یا نقشه را بزرگ‌نمایی کنید تا فهرست باریک‌تر شود.';
$ec_lang['lpn_crs_count']='{n} از {total} فرافکنی فهرست شده.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} از {total} دستگاه مختصات این شبکه را پوشش می‌دهند.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(بدون نقشه)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} یکی از معدود دستگاه‌های مختصات فهرست‌شده بدون اطلاعات فرافکنی قابل‌استفاده است. این یعنی نقشهٔ جهان، جست‌وجوی نام مکان و ترازهای DEM کار نمی‌کنند. مختصات شما اثر نمی‌بیند.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='بی‌نام';
$ec_lang['lpn_crs_none']='بدون مرجع‌گذاری جغرافیایی';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='یک پروژه واحدهای خود را نگه می‌دارد، پس این انتخاب فقط به همین پروژه تعلق دارد و به‌عنوان تنظیم مرورگر ذخیره نمی‌شود. برای شروع پروژه‌های تازه به شیوه‌ای خاص، یک پروژهٔ خالی را به‌عنوان الگوی خود ذخیره کنید و هر بار نسخه‌ای از آن بسازید.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='اصفهان، ایران';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='ایجاد';
$ec_lang['lpn_file_open']='باز کردن…';
$ec_lang['lpn_file_save']='ذخیره';
$ec_lang['lpn_file_saveas']='ذخیره به‌نام…';
$ec_lang['lpn_file_revert']='بازگشت به نسخه ذخیره‌شده';
$ec_lang['lpn_file_close']='بستن';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='فایل‌های اخیر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_tip']='دوباره {file} را بدون نیاز به یافتن آن روی رایانه‌تان باز کنید.';
$ec_lang['lpn_recent_denied']='اجازه باز کردن آن فایل داده نشد، پس باز نشد.';
$ec_lang['lpn_recent_gone']='{file} باز نشد. ممکن است جابه‌جا، تغییر نام یافته، یا حذف شده باشد، پس از فهرست اخیر برداشته شد.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='پروژه جدید';
$ec_lang['lpn_tab_all']='همه پروژه‌ها';
$ec_lang['lpn_tab_menu']='منوی پروژه';
$ec_lang['lpn_tab_duplicate']='تکثیر';
$ec_lang['lpn_tab_move_left']='جابه‌جایی به چپ';
$ec_lang['lpn_tab_move_right']='جابه‌جایی به راست';
$ec_lang['lpn_tab_unsaved']='در فایلی ذخیره نشده';
$ec_lang['lpn_import_bad_file']='آن فایل به‌عنوان پروژه ذخیره‌شده از این صفحه خوانده نشد.';
$ec_lang['lpn_import_no_room']='فضای کافی در حافظه مرورگر برای افزودن این پروژه نیست. پروژه‌ای را که دیگر نیاز ندارید حذف کنید و دوباره تلاش کنید.';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='تأیید';
$ec_lang['lpn_file_import_inp']='وارد کردن فایل EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='یک شبکه را از یک فایل EPANET بخوانید، چه فایل متنی .inp و چه فایل .net که EPANET ذخیره می‌کند، و آن را در این مرورگر به‌صورت پروژهٔ تازه ذخیره کنید.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='برون‌بری فایل EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='این شبکه را به‌صورت یک فایل inp. از EPANET بنویسید و دانلود کنید. عددهایی که تایپ کرده‌اید درست همان‌گونه که نوشته‌اید نوشته می‌شوند. هر چیزی که قالب inp. نمی‌تواند در خود جای دهد، پس از آن برای شما فهرست می‌شود.';
$ec_lang['lpn_status_inp_exported']='{file} برون‌بری شد.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} چیز که قالب inp. نمی‌تواند در خود جای دهد.';
$ec_lang['lpn_inp_export_refused']='این پروژه نمی‌تواند به‌صورت یک فایل EPANET نوشته شود: {detail}';
$ec_lang['lpn_inp_bad_file']='آن فایل به‌عنوان فایل شبکه EPANET خوانده نشد.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='این شبیه یک فایل net. از EPANET است، اما این صفحه نتوانست آن را بخواند. آن را در EPANET باز کنید و از دستور فایل، صادرات، شبکه در آنجا برای ذخیره به‌صورت فایل inp. استفاده کنید، سپس همان را وارد کنید.';
$ec_lang['lpn_inp_report_heading']='{file} وارد شد';
$ec_lang['lpn_inp_report_counts']='{nodes} گره، مخزن و تانک، {links} لوله، پمپ و شیر، در واحدهای {units}.';
$ec_lang['lpn_inp_report_clean']='همه‌چیز از فایل منتقل شد. چیزی جا نماند.';
$ec_lang['lpn_inp_report_label_anchor']='برچسب‌های متنی همان‌گونه که EPANET قرار می‌دهد، از گوشهٔ بالا-چپ آن‌ها، جای‌گذاری می‌شوند.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='فایل‌های EPANET دستگاه مختصاتی ندارند، پس این فایل در آغاز جای‌گذاری جغرافیایی نخواهد شد. برای گذاشتن آن روی نقشهٔ جهان، از نقشه، نقشهٔ جهان… استفاده کنید. برای تبدیل مختصات آن، از فایل، تبدیل به‌عنوان… استفاده کنید.';
$ec_lang['lpn_inp_report_lead']='این صفحه از هر آنچه EPANET استفاده می‌کند بهره نمی‌برد، اما چیزی در فایل شما دور ریخته نمی‌شود. در زیر آنچه فایل شما دارد و این صفحه بدون استفاده نگه می‌دارد آمده، و آنچه هنگام خواندن فایل تغییر کرد:';
$ec_lang['lpn_inp_drop_headloss']='این فایل از فرمول هیزن-ویلیامز استفاده نمی‌کند. این صفحه هیزن-ویلیامز را محاسبه می‌کند، پس اعداد زبری لوله دقیقاً همان‌طور که نوشته شده بودند نگه داشته شدند، اما نتایج اینجا با نتایج EPANET یکسان نخواهد بود.';
$ec_lang['lpn_inp_drop_tank_curve']='این تانک‌ها دیواره‌های صاف ندارند: فایل شکل آن‌ها را به‌صورت یک منحنی می‌دهد. منحنی در جعبهٔ کتابخانه‌ها نگه داشته می‌شود، تانک هم‌چنان به آن ارجاع می‌دهد، و یک شبیه‌سازی بازهٔ زمانی تانک را طبق برنامه‌ای که آن منحنی می‌دهد پر و خالی می‌کند. یک لحظهٔ تنها در هر دو حالت یکسان است، چون سطح آب همان ترازی است که فایل تعیین می‌کند. قطر نوشته‌شده در فایل کنار منحنی نگه داشته می‌شود و همان چیزی است که تانکی بدون منحنی با آن رسم و حل می‌شود.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='این شیرهای خفه‌کننده به‌صورت شیر خفه‌کننده وارد شدند و همان افتی را که فایل به آن‌ها می‌دهد، حفظ می‌کنند. هر دو حل‌کننده می‌توانند آن‌ها را حل کنند.';
$ec_lang['lpn_inp_drop_valve_active']='این شیرها فشار یا دبی را کنترل می‌کنند، و با تغییر آب خودشان باز و بسته می‌شوند. هیچ‌چیز از آن‌ها در هنگام ورود از دست نرفت، و این صفحه آن‌ها را با حل‌کننده EPANET حل می‌کند، و همین حل‌کننده را به‌طور خودکار برای این شبکه روشن می‌کند.';
$ec_lang['lpn_inp_drop_valve']='این شیرها با یک منحنی یا یک افت فشار ثابت توصیف شده‌اند، و این صفحه چنین المانی ندارد. آن‌ها به‌صورت لوله‌های باز وارد شدند، پس شبکه هنوز به هم پیوسته است، اما دیگر چیزی فشار یا دبی را در آن‌جا کنترل نمی‌کند.';
$ec_lang['lpn_inp_drop_cv']='در EPANET این لوله‌ها فقط اجازه عبور آب در یک جهت را می‌دهند. آن‌ها به‌صورت لوله معمولی وارد شدند، پس اکنون ممکن است آب در هر دو جهت از آن‌ها عبور کند.';
$ec_lang['lpn_inp_drop_demands']='این گره‌ها بیش از یک مصرف داشتند. مصرف‌ها با هم جمع شدند تا یک مصرف واحد که این صفحه نگه می‌دارد به دست آید.';
$ec_lang['lpn_inp_drop_patterns']='این صفحه الگوهای مصرف را نخواند، چون بخشی از آن که شبیه‌سازی بازهٔ زمانی را اجرا می‌کند بارگذاری نشد. هر مصرف همان عددی است که در فایل نوشته شده.';
$ec_lang['lpn_inp_drop_demand_pattern']='این گره‌ها مصرف خود را در طول اجرا تغییر می‌دهند. الگوهای آن‌ها به‌طور کامل وارد شدند، و مصرفی که می‌بینید همان مقداری است که برای لحظه‌ای که ساعت نشان می‌دهد در نظر گرفته شده.';
$ec_lang['lpn_inp_drop_emitters']='این گره‌ها ضریب آب‌پاش یا نشتی دارند. نگه داشته شده و در حل محاسبه می‌شود، اما هنوز جایی در این صفحه برای دیدن یا تغییر آن نیست.';
$ec_lang['lpn_inp_drop_curve_long']='این منحنی پمپ بیش از سه نقطه داشت. پایین‌ترین، میانی و بالاترین نقطه‌اش نگه داشته شد، زیرا این صفحه یک منحنی را حداکثر با سه نقطه برازش می‌دهد.';
$ec_lang['lpn_inp_drop_curve_missing']='این پمپ به منحنی‌ای ارجاع می‌دهد که در فایل نیست. پمپ بدون منحنی وارد شد، پس هدی اضافه نمی‌کند.';
$ec_lang['lpn_inp_drop_pump_other']='این پمپ با توانی که مصرف می‌کند توصیف شده، نه با یک منحنی. بدون منحنی وارد شد، پس هدی اضافه نمی‌کند.';
$ec_lang['lpn_inp_drop_head_pattern']='سطح آب این مخزن‌ها در طول اجرا بالا و پایین می‌رود. الگوهای آن‌ها به‌طور کامل وارد شدند، و ترازی که می‌بینید مربوط به همان لحظه‌ای است که ساعت نشان می‌دهد.';
$ec_lang['lpn_inp_drop_pump_speed']='این پمپ‌ها با سرعتی غیر از سرعتی که منحنی‌شان با آن اندازه‌گیری شده کار می‌کنند، یا سرعت‌شان در طول اجرا تغییر می‌کند. سرعت و الگوی آن به‌طور کامل وارد شدند، و هدی که می‌بینید مربوط به همان لحظه‌ای است که ساعت نشان می‌دهد.';
$ec_lang['lpn_inp_drop_setting']='این لوله‌ها، پمپ‌ها و شیرها تنظیمی دارند که این صفحه نمی‌تواند نگه دارد. آن‌ها به‌صورت باز وارد شدند.';
$ec_lang['lpn_inp_drop_rules']='این فایل کنترل‌های قاعده‌محور دارد. این صفحه آن‌ها را می‌خواند و به کار می‌برد. مدل را با موتور EPANET اجرا کنید و قواعد اعمال می‌شوند، درحالی‌که هر تراز، فشار و دبی در آن‌ها به واحدهایی که این پروژه نشان می‌دهد تبدیل شده است. قواعد را زیر کتابخانه‌ها باز کنید تا یکی را بخوانید یا تغییر دهید. آن‌ها دقیقاً همان‌گونه که فایل بیان می‌کند نگه داشته می‌شوند، و اگر یک فایل EPANET ذخیره کنید دوباره نوشته می‌شوند.';
$ec_lang['lpn_inp_drop_eps']='این فایل یک شبیه‌سازی بازهٔ زمانی را توصیف می‌کند. بخشی از این صفحه که شبیه‌سازی بازهٔ زمانی را اجرا می‌کند بارگذاری نشد، پس فقط شرایط آغازین وارد شدند.';
$ec_lang['lpn_inp_drop_quality']='این فایل توصیف می‌کند کیفیت آب هنگام حرکت چگونه تغییر می‌کند: در آغاز چه چیزی در آب است، و آن ماده در لوله‌ها و تانک‌ها با چه سرعتی واکنش می‌دهد. این صفحه این عددها را می‌خواند و به کار می‌برد. یک مادهٔ شیمیایی را در تنظیمات، محاسبه، کیفیت آب انتخاب کنید، سپس مدل را با موتور EPANET اجرا کنید، و غلظت در طول شبکه هنگام پیشرفت اجرا محاسبه می‌شود. این خطوط نگه داشته می‌شوند، و اگر یک فایل EPANET ذخیره کنید دوباره نوشته می‌شوند.';
$ec_lang['lpn_inp_drop_sources_mixing']='این فایل می‌گوید یک مادهٔ شیمیایی کجای شبکه دوز می‌شود، و آب یک تانک چگونه مخلوط می‌شود. یک دوز روی گرهی که به آن افزوده می‌شود دیده می‌شود، و یک تانک بیان می‌کند از کدام مدل اختلاط پیروی می‌کند. هم دوز و هم مدل اختلاط تنها با موتور EPANET محاسبه می‌شوند.';
$ec_lang['lpn_inp_drop_energy']='این فایل EPANET داده‌های مدل‌سازی هزینهٔ پمپاژ را دارد. این صفحه آن‌ها را می‌خواند و به کار می‌برد. مدل را با موتور EPANET اجرا کنید، سپس آب، گزارش‌ها، انرژی پمپ را باز کنید تا ببینید هر پمپ چقدر کار کرده، چه توانی کشیده، چقدر انرژی مصرف کرده و چه هزینه‌ای داشته است. این خطوط نگه داشته می‌شوند، و اگر یک فایل EPANET ذخیره کنید دوباره نوشته می‌شوند.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='این فایل به برخی از گره‌ها، لوله‌ها یا دیگر المان‌های خود تگ می‌دهد. هر تگ به‌طور کامل وارد شد، و هر یک در ویژگی‌های المان خودش قرار دارد، جایی که می‌توانید آن را بخوانید یا تغییر دهید.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='این فایل تنظیمات خودِ EPANET را برای قالب‌بندی گزارشی که چاپ می‌کند نگه می‌دارد. می‌توانید گزارش موتور را این‌جا، زیر گزارش‌ها، اجرای EPANET بخوانید، اما آن با قالب استاندارد موتور بیرون می‌آید نه قالبی که این تنظیمات می‌خواهند. این خطوط نگه داشته می‌شوند، و اگر یک فایل EPANET ذخیره کنید دوباره نوشته می‌شوند.';
$ec_lang['lpn_inp_drop_sections']='این فایل بخشی دارد که این صفحه اصلاً آن را نمی‌خواند. چیزی در اینجا از آن استفاده نمی‌کند. کامل نگه داشته می‌شود، و اگر یک فایل EPANET ذخیره کنید دوباره نوشته می‌شود.';
$ec_lang['lpn_inp_drop_quality_options']='این فایل گزینه‌های کیفیت آب EPANET را بیان می‌کند: گزینهٔ کیفیت، که نوع تحلیل کیفیت آب را نام می‌برد، و دو تنظیم که به یک مادهٔ شیمیایی مربوط‌اند: پخشندگی نسبی و رواداری کیفیت. هر سه نگه داشته و به کار برده می‌شوند. سن آب، ردیابی منبع و یک مادهٔ شیمیایی هر یک این‌جا محاسبه می‌شوند، و آن دو تنظیم شیمیایی هنگام اجرای یک ماده به موتور EPANET سپرده می‌شوند. اگر یک فایل EPANET ذخیره کنید همهٔ آن‌ها دوباره نوشته می‌شوند.';
$ec_lang['lpn_inp_drop_file_options']='این فایل به یک فایل کمکی ارجاع می‌دهد: نقشه، که مختصات را نگه می‌دارد، یا هیدرولیک، که هیدرولیک از پیش محاسبه‌شده را نگه می‌دارد. این صفحه نمی‌تواند هیچ‌کدام را باز کند، پس خط‌ها همان‌طور که هستند نگه داشته می‌شوند و اگر یک فایل EPANET ذخیره کنید دوباره نوشته می‌شوند.';
$ec_lang['lpn_inp_drop_demand_model']='این فایل خواستار یک تحلیل فشار-محور (PDA) است، که در آن یک گره وقتی فشار در آن پایین باشد کمتر از مصرف خود دریافت می‌کند. این صفحه به‌روش مصرف-محور حل می‌کند، پس هر گره در اینجا مصرفی را که فایل بیان می‌کند دریافت می‌کند، صرف‌نظر از فشاری که به دست می‌آید. این خط نگه داشته می‌شود و اگر یک فایل EPANET ذخیره کنید دوباره نوشته می‌شود.';
$ec_lang['lpn_inp_drop_other_options']='این فایل گزینه‌هایی را بیان می‌کند که این صفحه نمی‌خواند. چیزی در اینجا از آن‌ها استفاده نمی‌کند. نگه داشته می‌شوند و اگر یک فایل EPANET ذخیره کنید دوباره نوشته می‌شوند.';
$ec_lang['lpn_inp_drop_net_options']='این فایل .net از EPANET تنظیماتی را بیان می‌کند که این صفحه کنترلی برای آن‌ها ندارد، پس مقادیرشان این‌جا فهرست شده‌اند نه این‌که منتقل شوند. بقیهٔ چیزها منتقل شدند. اگر به آن‌ها نیاز دارید، فایل را در EPANET باز کنید و از فایل، صادرات، شبکه برای ذخیرهٔ آن به‌صورت فایل .inp استفاده کنید، سپس آن را وارد کنید.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='این یک فایل .net از EPANET بود. این فایل پروژهٔ خودِ EPANET است، توضیحی منتشرشده ندارد، و این صفحه قالب آن را از روی فایل‌های نمونه استنتاج کرده می‌خواند، پس آن را تنها زمانی به کار ببرید که چیز دیگری در دست ندارید، نه به‌عنوان یک راه قابل‌اتکا. فایل .inp قالبی مستند است که هر برنامهٔ دیگری آن را می‌خواند: در EPANET از فایل، صادرات، شبکه برای نوشتن یکی استفاده کنید، و هرگاه می‌توانید به‌جای آن همان را وارد کنید.';
$ec_lang['lpn_inp_drop_backdrop']='این فایل نام یک تصویر پس‌زمینه را می‌برد اما خود تصویر را ندارد. آن را خودتان با فایل، تصویر پس‌زمینه، افزودن تصویر اضافه کنید.';
$ec_lang['lpn_inp_drop_dangling']='این لوله‌ها گرهی را نام می‌برند که در فایل نیست، پس حذف شدند.';
$ec_lang['lpn_inp_drop_units']='واحد دبی نام‌برده‌شده در این فایل، واحدی نیست که این صفحه بشناسد، پس هر عدد به‌صورت گالن بر دقیقه خوانده شد. پیش از استفاده از پاسخ‌ها، هر عدد را بررسی کنید.';
$ec_lang['lpn_inp_drop_anchor_missing']='این متن به گره، مخزن یا تانکی وصل بود که در فایل نیست. به‌صورت متن آزاد در جایی که فایل تعیین کرده وارد شد، و اکنون از چیزی پیروی نمی‌کند.';
$ec_lang['lpn_import_notes_heading']='این پروژه از یک فایل EPANET خوانده شد. بخشی از آنچه آن فایل در خود دارد نگه داشته می‌شود اما در این صفحه استفاده نمی‌شود.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='{name} از یک فایل باز شد، و به‌صورت پروژه جدید به این مرورگر افزوده شد.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='فایل پروژه';
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
$ec_lang['lpn_file_upload_explain']='این مرورگر نمی‌تواند به یک فایل متصل شود، پس باز کردن فایل در اینجا در واقع یک بارگذاری است: پروژه در این مرورگر کپی می‌شود، و تنها راه ذخیره کار شما در همان فایل، بازنویسی آن با فایل، ذخیره به‌نام است.';
// The tip on the Open button, which reached the toolbar with Task 246. It exists because that
// button is icon-only: on a menu row the word carries the whole meaning, and on the strip the tip
// is where the rest of it lives.
$ec_lang['lpn_file_open_tip']='یک فایل پروژه را که از این صفحه ذخیره شده باز کنید.';
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
$ec_lang['lpn_file_save_tip']='در فایل متصل ذخیره می‌کند.';
$ec_lang['lpn_file_saveas_tip']='فایلی را برای ذخیره انتخاب کنید. این پروژه به آن فایل متصل می‌شود، و از آن پس، ذخیره در همان‌جا می‌نویسد.';
// The one thing a user can actually DO about the proliferation of files (Tom, 2026-08-04: "I hate to
// cause the proliferation of files"). We cannot make a browser ask where to put a download -- there
// is no API for it, and the download attribute cannot override the setting -- but the user can turn
// that setting on themselves, and then Save as really does let them overwrite the file they started
// from. It belongs in this tip rather than in a dialog: it answers a question asked at the moment
// the user is choosing where their work goes.
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_saveas_tip_download']='با استفاده از تنظیمات بارگیری مرورگرتان ذخیره می‌کند. این مرورگر نمی‌تواند به فایلی متصل شود، پس ذخیره غیرفعال است و فقط ذخیره به‌نام در دسترس است. اگر تنظیم مرورگر «برای هر فایل بپرس کجا ذخیره شود» را روشن کنید، می‌توانید فایل اصلی را انتخاب و آن را بازنویسی کنید.';
$ec_lang['lpn_status_uploaded']='فایل پروژه بارگذاری شد. هیچ اتصالی به آن نگه داشته نمی‌شود، پس تنها راه ذخیره دوباره در آن استفاده از فایل، ذخیره به‌نام است.';
$ec_lang['lpn_status_downloaded']='{file} بارگیری شد. این مرورگر نمی‌تواند به فایل متصل شود، پس این پروژه همچنان به‌عنوان «در فایلی ذخیره نشده» علامت‌گذاری می‌ماند.';
$ec_lang['lpn_status_file_opened']='{file} باز شد.';
$ec_lang['lpn_status_already_open']='آن فایل هم‌اکنون در اینجا با نام {name} باز است، پس به آن سوییچ شد، به‌جای باز کردن یک نسخه دوم.';
$ec_lang['lpn_status_already_open_dirty']='آن فایل هم‌اکنون در اینجا با نام {name} باز است، با تغییراتی که هنوز در آن ذخیره نکرده‌اید. به آن سوییچ شد، به‌جای باز کردن یک نسخه دوم. اگر نسخه روی دیسک را می‌خواهید، از فایل، بازگشت به نسخه ذخیره‌شده استفاده کنید.';
$ec_lang['lpn_status_saved']='{file} ذخیره شد.';
$ec_lang['lpn_status_reverted']='{file} دوباره از دیسک بارگذاری شد.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='پیش از بستن {name}، تغییراتتان در آن ذخیره شود؟';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} فقط در این مرورگر نگه داشته می‌شود. اگر بدون ذخیره در فایل آن را ببندید، برای همیشه از دست می‌رود.';
$ec_lang['lpn_close_discard']='بستن بدون ذخیره';
$ec_lang['lpn_cancel']='لغو';
$ec_lang['lpn_revert_confirm']='تغییراتی که داده‌اید دور ریخته شود و {file} دوباره از دیسک بارگذاری شود؟';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='این پروژه از {file} آمده، اما اتصال به آن فایل قطع شده است. برای اتصال دوباره، فایل را دوباره انتخاب کنید.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='نوشتن در فایل ممکن نشد. ممکن است جابه‌جا یا تغییر نام یافته باشد، یا اجازه پس گرفته شده باشد. کار شما هنوز در این مرورگر ذخیره است.';
$ec_lang['lpn_file_changed_elsewhere']='شخص دیگری از زمانی که این فایل را باز کردید در آن ذخیره کرده، پس ذخیره کردن اکنون کار او را از بین می‌برد. برای نگه داشتن تغییراتتان در فایل جداگانه از فایل، ذخیره به‌نام استفاده کنید، یا برای دور ریختن تغییرات خودتان و بارگذاری کار او از فایل، بازگشت به نسخه ذخیره‌شده استفاده کنید.';
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
$ec_lang['lpn_lock_somebody']='شخص دیگری';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} این فایل را باز دارد.';
$ec_lang['lpn_lock_open_readonly']='باز کردن فقط‌خواندنی';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='شکستن قفل او';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='به نظر می‌رسد این فایل در حال استفاده است.';
$ec_lang['lpn_lock_open_care']='برای پرهیز از از دست رفتن داده، از گزینه‌های زیر با دقت انتخاب کنید.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='{x} است که در حال استفاده است.';
$ec_lang['lpn_lock_age_edited']='واپسین ویرایش آن {x} پیش بوده است.';
$ec_lang['lpn_lock_age_saved']='واپسین ذخیرهٔ آن {x} پیش بوده است.';
$ec_lang['lpn_lock_age_never_saved']='هنوز چیزی در این فایل ذخیره نشده است.';
$ec_lang['lpn_lock_age_unknown']='سابقه‌ای از اینکه چقدر در حال استفاده بوده، یا کِی واپسین بار ذخیره یا ویرایش شده، وجود ندارد.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='«پرسیدن» به هر کسی که این فایل را باز دارد می‌گوید که شما آن را می‌خواهید، و چیز دیگری را تغییر نمی‌دهد. «باز کردن فقط‌خواندنی» به شما اجازه می‌دهد آن را ببینید و هرچه بخواهید تغییر دهید، بدون آنکه بتوانید اینجا ذخیره کنید. «شکستن قفل او» به شما اجازه می‌دهد روی فایل ذخیره کنید؛ کار ذخیره‌نشدهٔ آن‌ها از دست نمی‌رود، اما آن‌ها دیگر نمی‌توانند اینجا ذخیره کنند، و ممکن است کسی مجبور شود آن دو را دستی ادغام کند.';
$ec_lang['lpn_lock_ask']='پرسیدن';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='بگوییم چه کسی می‌پرسد؟ حروف اول نام شما ایده‌آل است. این به هر کسی که فایل را باز دارد فرستاده می‌شود، و فقط در همین مرورگر ذخیره می‌شود.';
$ec_lang['lpn_lock_ask_sent']='از هر کسی که این فایل را باز دارد خواسته‌ایم آن را ببندد. اگر صفحه‌شان هنوز باز باشد، ظرف یک دقیقه آن را می‌بینند. چیز دیگری تغییر نکرده، و فایل تا وقتی که آن را نبندند همچنان مال آن‌هاست.';
$ec_lang['lpn_lock_ask_failed']='پیام شما نتوانست ارسال شود. یا اکنون هیچ‌کس این فایل را باز ندارد، یا سرور در دسترس نبود.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='آن فایل باز نشد، و چیزی اینجا تغییر نکرد. کس دیگری هنوز آن را باز دارد.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} می‌خواهد این فایل را ویرایش کند. هر وقت آماده بودید، کارتان را ذخیره کنید و از فایل، بستن برای واگذاری آن استفاده کنید.';
$ec_lang['lpn_ago_seconds']='{n} ثانیه';
$ec_lang['lpn_ago_minutes']='{n} دقیقه';
$ec_lang['lpn_ago_hours']='{n} ساعت';
$ec_lang['lpn_ago_days']='{n} روز';
$ec_lang['lpn_ago_unknown']='زمانی نامشخص';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='پیام‌ها';
$ec_lang['lpn_msglog_heading']='پیام‌های اخیر';
$ec_lang['lpn_msglog_empty']='هنوز پیامی نیست.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='{x} پیش';
$ec_lang['lpn_msglog_note']='تازه‌ترین نخست. این صفحه {n} پیام واپسین را تا زمانی که باز است نگه می‌دارد، و چیزی روی رایانهٔ شما ذخیره نمی‌شود.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='فقط‌خواندنی: {name} این فایل را باز دارد. می‌توانید هرچه بخواهید اینجا تغییر دهید، اما نمی‌توانید ذخیره کنید. برای ذخیره در فایل دیگر، از فایل، ذخیره به‌نام استفاده کنید.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='هشدار: اتصال به سرور برای بررسی یا ساخت قفل روی این پروژه ممکن نشد، پس چیزی مانع ویرایش هم‌زمان همین فایل توسط یک همکار نیست. اگر قفل دوباره کار کند، به شما اطلاع داده می‌شود.';
$ec_lang['lpn_lock_storage_error']='هشدار: این سایت نمی‌تواند سوابق قفل را ذخیره کند، پس چیزی مانع ویرایش هم‌زمان همین فایل توسط یک همکار نیست. این یک نقص راه‌اندازی در سرور است، نه چیزی که شما اینجا بتوانید رفع کنید — پوشه قفل توسط وب‌سرور قابل نوشتن نیست.';
$ec_lang['lpn_lock_full_error']='هشدار: این سایت جایی برای ثبت اینکه چه کسی کدام پروژه را باز دارد ندارد، پس چیزی مانع ویرایش هم‌زمان همین فایل توسط یک همکار نیست. این یک نقص راه‌اندازی در سرور است، نه چیزی که شما اینجا بتوانید رفع کنید.';
$ec_lang['lpn_lock_not_asked']='قفل‌گذاری برای این پروژه در حال اجرا نیست، پس چیزی مانع ویرایش هم‌زمان همین فایل توسط یک همکار نیست. برای شما هنوز نامی در این مرورگر ثبت نشده، یا پروژه شناسه‌ای ندارد — ذخیره پروژه در یک فایل هر دو را تنظیم می‌کند.';
$ec_lang['lpn_lock_restored']='قفل‌گذاری دوباره کار می‌کند، و اکنون این فایل برای ذخیره متعلق به شماست.';
$ec_lang['lpn_lock_dismiss']='پنهان کردن این پیام';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='پروژه شما در فایلی روی این رایانه ذخیره می‌شود. فقط وقتی بخواهید ذخیره می‌شود و در هیچ زمان دیگری، پس چیزی بدون اطلاع شما در آن فایل نوشته نمی‌شود.';
$ec_lang['lpn_file_training_2']='برای اینکه دو نفر هرگز هم‌زمان یک فایل را ویرایش نکنند، این سایت پیگیری می‌کند چه کسی آن را باز دارد. اگر کسی از قبل آن را باز داشته، باز هم می‌توانید آن را باز کرده و ببینید، یا کپی خودتان را نگه دارید.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='بار اول که ذخیره می‌کنید، مرورگرتان می‌پرسد آیا این سایت اجازه ویرایش فایل را دارد. آن پرسش از مرورگر است، نه از ما، و پاسخ بله دادن چیزی است که به «ذخیره» اجازه می‌دهد کار شما را در همان‌جا بنویسد. معمولاً فقط یک‌بار به ازای هر فایل پرسیده می‌شود.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='ادامه';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='فایل را دوباره انتخاب کنید';
$ec_lang['lpn_file_reconnect']='اتصال دوباره به این فایل';
$ec_lang['lpn_file_reconnect_alert']='این پروژه از {file} آمده. مرورگرتان دوباره به اجازه شما نیاز دارد تا بتواند در آن بنویسد. در پایین دوباره اتصال دهید.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='آن همان فایلی است که شخص دیگری باز دارد، پس نمی‌توان روی آن ذخیره کرد. فایل یا نام دیگری انتخاب کنید.';
$ec_lang['lpn_saveas_overwrites_project']='آن فایل هم‌اکنون پروژه دیگری به نام {name} دارد. ذخیره در اینجا آن را کاملاً جایگزین می‌کند. ادامه می‌دهید؟';
$ec_lang['lpn_saveas_overwrites_newer']='آن فایل از آخرین باری که دیدید تغییر کرده، پس تقریباً حتماً شخص دیگری در آن ذخیره کرده. ذخیره در اینجا نسخه او را با نسخه شما جایگزین می‌کند. ادامه می‌دهید؟';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='نام این پروژه';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='{closed} بسته شد. اکنون {opened} نمایش داده می‌شود.';
$ec_lang['lpn_status_closed_empty']='{closed} بسته شد. یک پروژه خالی جدید آغاز شد.';
$ec_lang['lpn_storage_full']='ذخیره نشد. حافظه مرورگر پر یا در دسترس نیست، پس تغییرات اخیر شما با بستن این برگه از دست می‌روند.';
$ec_lang['lpn_storage_unreadable']='ذخیره نشد. این پروژه را نتوانستیم از حافظهٔ مرورگر بخوانیم. نسخهٔ ذخیره‌شدهٔ آن دقیقاً همان‌طور که هست باقی می‌ماند و رونویسی نمی‌شود، پس چیزی در این برگه ذخیره نمی‌شود. برای ادامهٔ کار یک پرونده را باز کنید یا یک پروژهٔ تازه بسازید.';
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
$ec_lang['lpn_about_credits']='اعتبارها';
$ec_lang['lpn_help_welcome']='صفحهٔ خوش‌آمد';
$ec_lang['lpn_about_license']='تحت مجوز GNU General Public License نسخهٔ ۳.۰ یا بالاتر.';
$ec_lang['lpn_notes_1_term']='چگونه حل می‌شود';
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
$ec_lang['lpn_notes_1_def']='هر لحظه با همان الگوریتم گرادیان سراسری‌ای حل می‌شود که EPANET به کار می‌برد. یک کل مدت اجرا تنظیم کنید و حل‌کنندهٔ EPANET هر گام گزارش‌دهی را به‌نوبت محاسبه می‌کند: تانک‌ها پر و خالی می‌شوند، مصرف‌ها از الگوهای خود پیروی می‌کنند، و نوار ابزار اجرا را پخش می‌کند. حل‌کنندهٔ درون‌ساخت هر بار یک لحظه را محاسبه می‌کند و هر تانک را در ترازِ آغازین خود نگه می‌دارد.';
$ec_lang['lpn_notes_2_term']='مدل‌سازی نشده';
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
$ec_lang['lpn_notes_2_def']='شیمی کیفیت آب مدل نمی‌شود؛ سن آب و ردیابی منبع مدل می‌شوند. شیرها: یک شیر خفه‌کننده در هر دو حل‌کننده کار می‌کند، و شیرهایی که موقعیت خود را خودشان تعیین می‌کنند (PRV، PSV، FCV) با حل‌کنندهٔ EPANET حل می‌شوند، که این صفحه هرگاه شبکهٔ شما یکی از آن شیرها را داشته باشد، خودش آن را روشن می‌کند.';
$ec_lang['lpn_notes_3_term']='ذخیره پروژه‌ها';
$ec_lang['lpn_notes_3_def']='هر پروژه یک برگه است، و هر برگه در حین کار در این مرورگر ذخیره می‌شود. پاک کردن داده‌های مرورگر همه آن‌ها را حذف می‌کند، پس کارتان را در فایلی نگه دارید: فایل، ذخیره به‌نام. یک ستاره روی برگه یعنی تغییراتی دارد که در فایلی نیستند. تا وقتی نخواهید، هیچ‌چیز در فایلی نوشته نمی‌شود. در برخی مرورگرها یک پروژه به فایلی که در آن ذخیره می‌کنید متصل می‌شود، و از آن پس فایل، ذخیره روی همان فایل می‌نویسد؛ در برخی دیگر هیچ اتصالی ممکن نیست، پس ذخیره غیرفعال است و فقط ذخیره به‌نام در دسترس است. وقتی فایل یک پروژه روی یک درایو مشترک نگه داشته می‌شود، این صفحه به شما می‌گوید اگر همکاری هم‌اکنون آن را باز دارد، تا دو نفر روی کار یکدیگر ننویسند.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='منحنی پمپ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='یک پمپ از رابطهٔ H = H₀ − aQ^b پیروی می‌کند، که در آن H هدی است که پمپ می‌افزاید و Q دبی عبوری از آن است. یک، دو، یا سه نقطه از منحنی سازنده وارد کنید. سه نقطه—هد در دبی صفر، نقطهٔ کار عادی، و نقطهٔ بیشترین دبی—H₀، a و b را مستقیماً برازش می‌دهند، و نزدیک‌ترین حالت را به منحنی منتشرشده دنبال می‌کنند. دو نقطه یک سهمی (b = 2) با اوج در دبی صفر برازش می‌دهند. یک نقطه از یک قاعدهٔ رایج استفاده می‌کند: هد در دبی صفر برابر ۱٫۳۳ برابر هدی است که وارد می‌کنید، و بیشترین دبی برابر ۲ برابر دبی‌ای است که وارد می‌کنید، که باز هم b = 2 می‌دهد. پمپی که هیچ نقطه‌ای برایش وارد نشده اصلاً هدی نمی‌افزاید. منحنی در جایی که هد به صفر می‌رسد قطع نمی‌شود، پس درخواست دبی بیشتر از آنچه منحنی پمپ می‌تواند بدهد، هد منفی نتیجه می‌دهد. راه‌حل یک پمپ بزرگ‌تر یا مصرف کوچک‌تر است، نه برازش منحنی متفاوت. یک منحنی می‌تواند بیش از سه نقطه داشته باشد. حل‌کنندهٔ درون‌ساخت سه‌تای آن‌ها—اولین، میانی و آخرین—را می‌خواند تا معادلهٔ بالا را برازش کند؛ موتور EPANET هر نقطه‌ای را که داده‌اید می‌خواند.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='هم‌چنین در این صفحه';
$ec_lang['lpn_notes_4_def']='یک پروژه می‌تواند روی زمین واقعی با یک نقشهٔ خیابان در پشت خود بنشیند. فایل‌های .inp ی EPANET را می‌توان خواند و نوشت. پنل پایینی یک نیم‌رخ در طول یک مسیر رسم می‌کند و گره‌ها را فهرست می‌کند. المان‌ها را می‌توان بر پایهٔ نتایج‌شان رنگ کرد، و یافتن هر المانی را که با شرطی که تعیین می‌کنید مطابقت دارد پیدا می‌کند.';
$ec_lang['lpn_notes_6_term']='راهنمای ستون‌های جدول';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>گزینش ستون</td><td>کلیک روی سرستون</td></tr><tr><td>افزودن یا گسترش گزینش ستون</td><td>Ctrl+click یا Shift+click روی سرستون دیگر</td></tr><tr><td>جابه‌جایی (تغییر ترتیب) ستون(های) گزینش‌شده</td><td>کشیدن، یا استفاده از مدیریت ستون‌ها… در منوی راست‌کلیک یا ⋮</td></tr><tr><td>منوی ⋮ و پیکان مرتب‌سازی.</td><td>نگه‌داشتن اشاره‌گر روی گوشهٔ بالای سرستون، یا گزینش یا Tab به سرستون</td></tr><tr><td>پنهان کردن، نمایش همه، یا مدیریت نمایانی و ترتیب</td><td>راست‌کلیک روی سرستون یا منوی ⋮ در گوشهٔ بالا-راستِ سرستون</td></tr><tr><td>مرتب‌سازی بر پایهٔ ستون</td><td>نماد پیکان در گوشهٔ بالا-راستِ سرستون</td></tr><tr><td>چسباندن به‌صورت ردیف‌های تازه در انتهای جدول</td><td>راست‌کلیک، منوی ⋮ در گوشهٔ بالا-راستِ سرستون، یا Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='میان‌برهای صفحه‌کلید جدول';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>کلیدهای جهت</td><td>پیمایش.</td></tr><tr><td>Tab، Enter</td><td>پایان دادن به ورودی و پیمایش یک سلول به کنار / پایین.</td></tr><tr><td>Shift+Tab، Shift+Enter</td><td>پیمایش به عقب.</td></tr><tr><td>Shift+کلیدهای جهت</td><td>گسترش گزینش.</td></tr><tr><td>Ctrl+C</td><td>کپی گزینش.</td></tr><tr><td>Ctrl+D</td><td>پر کردن گزینش رو به پایین از ردیف بالای آن.</td></tr><tr><td>Ctrl+Enter</td><td>پر کردن گزینش با مقدار سلول فعال.</td></tr><tr><td>Ctrl+A</td><td>گزینش کل جدول.</td></tr><tr><td>Ctrl+Shift+V</td><td>چسباندن به‌صورت ردیف‌های تازه در انتهای جدول.</td></tr><tr><td>Delete</td><td>پاک کردن یک سلول.</td></tr><tr><td>F2</td><td>باز کردن یک سلول برای ویرایش آن.</td></tr><tr><td>Esc</td><td>لغو یک ویرایش.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='حدود باندهای رنگ ثابت می‌مانند';
$ec_lang['lpn_notes_color_def']='حدود باندهای رنگ زمانی تعیین می‌شوند که یک روش دسته‌بندی داده انتخاب می‌کنید. در هر گام زمانی دوباره تعیین نمی‌شوند، چون این کار باعث می‌شود رنگ‌ها در هر گام معنایی تازه بگیرند، و این برای دیدن بصری سیستم شما کمکی نمی‌کند. EPANET نیز به همین شکل کار می‌کند. برای گرفتن حدود تازه، دوباره یک روش انتخاب کنید یا حدود خودتان را تایپ کنید.';
$ec_lang['lpn_notes_epanet_term']='ضرایب هیزن-ویلیامز مطابق EPANET';
$ec_lang['lpn_notes_epanet_def']='در اوت ۲۰۲۶ ضریب و توان هیزن-ویلیامز تغییر کرد تا با EPANET مطابقت داشته باشد. نتایج افت هد تا ۰٫۱ درصد با نسخه‌های پیشین این صفحه تفاوت دارند، که بسیار کمتر از عدم قطعیت خود مقدار C است.';
$ec_lang['lpn_notes_engine_term']='این صفحه کدام EPANET را اجرا می‌کند';
$ec_lang['lpn_notes_engine_def']='حل‌کنندهٔ EPANET در این صفحه، OWA-EPANET نسخهٔ ۲٫۳٫۵ است که در ۲۰ فوریهٔ ۲۰۲۵ منتشر شد. EPANET را Open Water Analytics توسعه می‌دهد، جامعه‌ای که با آژانس حفاظت محیط‌زیست ایالات متحده همکاری می‌کند و نسخهٔ ۲٫۲٫۰ را در دسامبر ۲۰۱۹ منتشر کرد. گزارش اجرا آن را ۲٫۳٫۰۵ می‌نامد، چون این موتور عدد آخر را با دو رقم می‌نویسد. این موتور از راه epanet-js نسخهٔ ۰٫۹٫۰ نوشتهٔ Luke Butler، تحت پروانهٔ MIT، به این صفحه می‌رسد، و درون مرورگر شما اجرا می‌شود: شبکهٔ شما هرگز برای حل به جایی فرستاده نمی‌شود.';
$ec_lang['lpn_id_invalid']='شناسه‌ای بدون فاصله و بدون علامت نقل‌قول وارد کنید.';
$ec_lang['lpn_id_taken']='آن شناسه از قبل استفاده شده است.';
$ec_lang['lpn_diag_no_fixed_head']='یک مخزن یا یک تانک اضافه کنید. پیش از آنکه شبکه قابل حل باشد، به دست‌کم یک تراز آب شناخته‌شده نیاز است.';
$ec_lang['lpn_diag_dangling_link']='یک لوله یا پمپ به گره‌ای متصل است که دیگر وجود ندارد:';
$ec_lang['lpn_diag_unreachable']='این گره‌ها هیچ مسیری به یک مخزن ندارند:';
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
$ec_lang['lpn_engine_fetching']='در حال دریافت حل‌کنندهٔ EPANET. یک‌بار دانلود می‌شود و سپس روی این دستگاه نگه داشته می‌شود، پس از آن بدون اینترنت هم کار می‌کند.';
$ec_lang['lpn_engine_ready']='حل‌کنندهٔ EPANET اکنون روی این دستگاه است و بدون اینترنت هم کار می‌کند.';
$ec_lang['lpn_engine_fetching_valve']='در حال دریافت حل‌کنندهٔ EPANET، تا این شیر اکنون و بعداً بدون اینترنت هم حل شود.';
$ec_lang['lpn_engine_ready_valve']='حل‌کنندهٔ EPANET اکنون روی این دستگاه است. شیرهایی که خودشان باز و بسته می‌شوند بدون اینترنت هم کار خواهند کرد.';
$ec_lang['lpn_engine_unavailable']='دریافت حل‌کنندهٔ EPANET ممکن نشد، که برای حل شیرهایی که خودشان باز و بسته می‌شوند لازم است. یک‌بار به اینترنت وصل شوید تا از آن پس روی این دستگاه نگه داشته شود.';
$ec_lang['lpn_engine_needed_loading']='حل‌گر EPANET درحالی‌که شما می‌سازید بارگذاری می‌شود. نتیجه‌ها پس از بارگذاری کامل در دسترس خواهند بود.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='پیشرفت بارگذاری حل‌کننده';
$ec_lang['lpn_engine_wait']='در حال بارگذاری حل‌کننده. نتیجه‌ها اندکی به تعویق می‌افتند. به کار خود ادامه دهید.';
$ec_lang['lpn_engine_wait_pct']='حل‌کننده {percent}٪ بارگذاری شد.';
$ec_lang['lpn_engine_wait_bytes']='تاکنون {kb} کیلوبایت از حل‌کننده بارگذاری شده. مجموع در دسترس نیست، پس درصد تکمیل نامشخص است.';
$ec_lang['lpn_engine_needed_failed']='حل‌گر EPANET هنوز بارگذاری نشده، نمی‌تواند بارگذاری شود، و این شبکه تنها با آن قابل حل است. هنگامی‌که به اینترنت متصل باشید بارگذاری خواهد شد.';
$ec_lang['lpn_diag_valve_needs_epanet']='این شیرها خودشان باز و بسته می‌شوند، و فقط حل‌کننده EPANET می‌تواند آن‌ها را محاسبه کند. حل‌کننده EPANET بارگذاری نشد، پس این نتایج موجود نیستند:';
$ec_lang['lpn_diag_valve_on_fixed_head']='این شیرها مستقیم به یک مخزن یا تانک وصل شده‌اند، که تراز آب را در آنجا از پیش تعیین کرده است، پس چیزی برای کنترل شیر باقی نمی‌ماند. یک لوله کوتاه بین شیر و مخزن یا تانک بگذارید:';
$ec_lang['lpn_diag_not_converged']='هیچ راه‌حلی یافت نشد. مقادیری را بررسی کنید که در واقعیت ممکن نیستند، مانند قطر صفر.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='حل همگرا نشد. این اعداد آخرین تکرار هستند، نه یک پاسخ. از آن‌ها استفاده نکنید.';
$ec_lang['lpn_diag_not_converged_trials']='پس از {iterations} تکرار متوقف شد.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='پس از {iterations} تکرار و در خطای نسبی {error} متوقف شد، که به تنظیم دقت {accuracy} نرسید.';
$ec_lang['lpn_field_roughness']='زبری';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='ضریب C هیزن-ویلیامز. عدد بزرگ‌تر یعنی لوله صاف‌تر: حدود ۱۵۰ برای پلاستیک نو، ۱۳۰ برای فولاد یا چدن نو، و ۱۰۰ برای لوله کهنه.';
$ec_lang['lpn_field_length']='طول';
$ec_lang['lpn_field_from']='از';
$ec_lang['lpn_field_to']='به';
$ec_lang['lpn_field_length_tip']='طول لوله. وقتی خودکار روشن است، طول از روی آنچه رسم کرده‌اید اندازه‌گیری می‌شود. برای تایپ طولی متفاوت از طرح، خودکار را خاموش کنید.';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='نوع شیر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='شیر چه کاری انجام می‌دهد. شیر خفه‌کننده یک افت ثابت را حفظ می‌کند. سه نوع دیگر یک فشار یا یک دبی را حفظ می‌کنند، و با تغییر آب کاملاً باز می‌شوند، بسته می‌شوند، یا نیمه‌باز می‌مانند. تغییر نوع، عدد تنظیم زیر را از نو آغاز می‌کند، زیرا فشار همان دبی نیست و هیچ‌کدام ضریب افت نیستند.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='خفه‌کننده (TCV)';
$ec_lang['lpn_valve_type_prv']='کاهنده فشار (PRV)';
$ec_lang['lpn_valve_type_psv']='نگهدارنده فشار (PSV)';
$ec_lang['lpn_valve_type_fcv']='کنترل دبی (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='شکنندهٔ فشار (PBV)';
$ec_lang['lpn_valve_type_gpv']='همه‌منظوره (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='افت فشار';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='فشاری که شیر از میان برمی‌دارد. یک شیر شکنندهٔ فشار همیشه دقیقاً همین مقدار فشار را برمی‌دارد، از هر سو که آب جریان یابد. این یک افت میان دو سر شیر است، نه فشاری که باید نگه داشته شود.';
$ec_lang['lpn_inp_drop_gpv_curve']='این شیر به منحنی افت هدی ارجاع می‌دهد که در فایل نیست. شیر بدون منحنی وارد شد، پس تا زمانی که یکی به آن ندهید کاملاً باز می‌ماند.';
$ec_lang['lpn_gpv_curve_source']='منحنی افت هد شیر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='منحنی‌ای در جعبهٔ کتابخانه‌ها که می‌گوید این شیر در هر دبی چقدر هد از دست می‌دهد. چند شیر می‌توانند از یک منحنی استفاده کنند، و ویرایش آن در آن‌جا همهٔ آن‌ها را تغییر می‌دهد. این شیر تنها ارجاع را نگه می‌دارد؛ خودِ نقاط زیر کتابخانه‌ها، منحنی‌ها خوانده و ویرایش می‌شوند.';
$ec_lang['lpn_field_valve_setting_pressure']='تنظیم فشار';
$ec_lang['lpn_field_valve_setting_pressure_tip']='فشاری که شیر حفظ می‌کند. شیر کاهنده فشار، فشار سمت پایین‌دست خود را در این مقدار یا کمتر نگه می‌دارد. شیر نگهدارنده فشار، فشار سمت بالادست خود را در این مقدار یا بیشتر نگه می‌دارد.';
$ec_lang['lpn_field_valve_setting_flow']='تنظیم دبی';
$ec_lang['lpn_field_valve_setting_flow_tip']='بیشترین آبی که شیر عبور می‌دهد. وقتی آب کمتر از این مقدار بخواهد عبور کند، شیر کاملاً باز می‌ماند و هیچ افتی اضافه نمی‌کند.';
$ec_lang['lpn_field_valve_setting']='تنظیم';
$ec_lang['lpn_field_valve_setting_loss']='ضریب افت';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='شیر خفه‌کننده چه مقدار هد را حذف می‌کند، به‌صورت مضربی از هد سرعت. برای شیری که کاملاً باز است، ۰ را وارد کنید. همین یک عدد، کل افت یک شیر خفه‌کننده را بیان می‌کند.';
$ec_lang['lpn_field_valve_diameter_tip']='عرض روزنه عبور آب از شیر. سرعت آب عبوری از شیر از روی همین عرض محاسبه می‌شود، و افت از همان سرعت به‌دست می‌آید.';
$ec_lang['lpn_field_valve_km_tip']='افت ناشی از بدنه شیر، هنگامی که شیر کاملاً باز است، علاوه بر هرچه تنظیم شیر حذف می‌کند. این افت به‌صورت مضربی از هد سرعت شمرده می‌شود. برای نادیده گرفتن آن، ۰ را وارد کنید.';
$ec_lang['lpn_field_km']='ضریب افت موضعی، k';
$ec_lang['lpn_field_km_tip']='افت ناشی از خم‌ها، شیرها، و اتصالات روی این لوله، به‌صورت ضریبی از هد سرعت. برای یک لوله ساده و مستقیم، ۰ را وارد کنید.';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='افت موضعی، k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='منحنی هد پمپ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='منحنی‌ای در جعبهٔ کتابخانه‌ها که می‌گوید این پمپ در هر دبی چقدر هد اضافه می‌کند. چند پمپ می‌توانند از یک منحنی استفاده کنند، و ویرایش آن در آن‌جا همهٔ آن‌ها را تغییر می‌دهد. این پمپ تنها ارجاع را نگه می‌دارد؛ خودِ نقاط زیر کتابخانه‌ها، منحنی‌ها خوانده و ویرایش می‌شوند.';
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
$ec_lang['lpn_field_desc']='توضیح';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
$ec_lang['lpn_field_desc_tip']='برای استفادهٔ خودتان، مانند نام یک گوشهٔ خیابان یا جنس یک لوله. این به فایل EPANET وارد و از آن خارج می‌شود، جایی که در انتهای ردیف خودِ آن قطعه می‌نشیند. هیچ محاسبه‌ای آن را نمی‌خواند. یک شکست خط به یک فاصله تبدیل می‌شود، چون فایل جایی برای آن ندارد.';
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='تگ';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='یک تگ می‌تواند هر معنایی که نیاز دارید داشته باشد، مانند یک منطقهٔ فشار یا یک دستور کار. هیچ محاسبه‌ای در این‌جا یا در EPANET آن را نمی‌خواند. یک تگ تنها یک واژه است: EPANET در اولین فاصله خواندن را متوقف می‌کند، پس هنگام تایپ یک فاصله پذیرفته نمی‌شود. این مقدار به فایل EPANET وارد و از آن خارج می‌شود.';
$ec_lang['lpn_pump_effic_curve']='منحنی بازده پمپ';
$ec_lang['lpn_pump_effic_curve_tip']='منحنی‌ای در جعبهٔ کتابخانه‌ها که می‌گوید این پمپ در هر دبی چقدر بازده دارد. چند پمپ می‌توانند از یک منحنی استفاده کنند، و ویرایش آن در آن‌جا همهٔ آن‌ها را تغییر می‌دهد. این پمپ تنها ارجاع را نگه می‌دارد؛ خودِ نقاط زیر کتابخانه‌ها، منحنی‌ها خوانده و ویرایش می‌شوند.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='هیچ منحنی‌ای انتخاب نشده';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='منحنی‌ها';
$ec_lang['lpn_curve_library_link_tip']='جعبهٔ کتابخانه‌ها را روی بخش منحنی‌ها باز می‌کند، جایی که یک منحنی افزوده، توصیف، ویرایش و حذف می‌شود. یک المان بیان می‌کند از کدام منحنی استفاده می‌کند.';
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
$ec_lang['lpn_curve_kind_head']='هد پمپ';
$ec_lang['lpn_curve_kind_effic']='بازده پمپ';
$ec_lang['lpn_curve_kind_volume']='حجم تانک';
$ec_lang['lpn_curve_kind_headloss']='افت هد شیر';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='نوع بیان نشده';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='حجم';
$ec_lang['lpn_pump_effic_col']='بازده';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='این پمپ هیچ منحنی بازده‌ای انتخاب‌شده ندارد، پس با بازدهٔ تنظیم‌شده برای کل شبکه، {percent}، کار می‌کند.';
$ec_lang['lpn_pump_effic_unstated']='این پمپ به یک منحنی بازده به‌نام {name} ارجاع می‌دهد که چیزی در این پروژه آن را تعریف نمی‌کند، پس با بازدهٔ تنظیم‌شده برای کل شبکه، {percent}، کار می‌کند.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='حالت: انتخاب. برای دیدن یا تغییر یک المان یا برچسب، آن را کلیک کنید. برای جابه‌جا کردن یک گره، رأس یا برچسب، بکشید. برای افزودن یا حذف خم‌های یک لوله، از ابزار رأس‌ها استفاده کنید.';
$ec_lang['lpn_mode_delete']='حالت: حذف. برای برداشتن یک المان، آن را کلیک کنید.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='حالت: رأس‌ها. رأس‌های هر لوله به‌صورت دستگیره‌های مربعی کوچک نشان داده می‌شوند. روی یک لوله کلیک کنید تا رأسی افزوده شود، روی یک دستگیره کلیک کنید تا حذف شود، یا آن را بکشید تا جابه‌جا شود. در این حالت چیز دیگری روی نقشه تغییر نمی‌کند.';
$ec_lang['lpn_mode_zoom_window']='حالت: بزرگ‌نمایی پنجره‌ای. دو گوشهٔ مقابل یک کادر را روی نقشه کلیک کنید، یا یکی را بکشید، تا به آن بزرگ‌نمایی کنید.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='چیزی انتخاب نشده. نخست یک المان را روی نقشه کلیک کنید، سپس Delete را بزنید.';
$ec_lang['lpn_mode_add_junction']='حالت: افزودن گره. برای گذاشتن یک گره روی نقشه کلیک کنید. برای تغییر یا جابه‌جایی المان‌ها و برچسب‌ها به حالت انتخاب بروید.';
$ec_lang['lpn_mode_add_reservoir']='حالت: افزودن مخزن. برای گذاشتن یک مخزن روی نقشه کلیک کنید. برای تغییر یا جابه‌جایی المان‌ها و برچسب‌ها به حالت انتخاب بروید.';
$ec_lang['lpn_mode_add_tank']='حالت: افزودن تانک. برای گذاشتن یک تانک روی نقشه کلیک کنید. برای تغییر یا جابه‌جایی المان‌ها و برچسب‌ها به حالت انتخاب بروید.';
$ec_lang['lpn_mode_add_pipe']='حالت: افزودن لوله. یک گره، سپس گرهٔ دیگری را کلیک کنید تا به هم وصل شوند. برای خم کردن خط، فضای باز میان آن‌ها را کلیک کنید، یا برای شروع دوباره Escape را بزنید. برای تغییر یا جابه‌جایی المان‌ها و برچسب‌ها به حالت انتخاب بروید.';
$ec_lang['lpn_mode_add_pump']='حالت: افزودن پمپ. یک گره، سپس گرهٔ دیگری را کلیک کنید تا به هم وصل شوند. برای خم کردن خط، فضای باز میان آن‌ها را کلیک کنید، یا برای شروع دوباره Escape را بزنید. برای تغییر یا جابه‌جایی المان‌ها و برچسب‌ها به حالت انتخاب بروید.';
$ec_lang['lpn_mode_add_valve']='حالت: افزودن شیر. یک گره، سپس گرهٔ دیگری را کلیک کنید تا به هم وصل شوند. برای خم کردن خط، فضای باز میان آن‌ها را کلیک کنید، یا برای شروع دوباره Escape را بزنید. برای تغییر یا جابه‌جایی المان‌ها و برچسب‌ها به حالت انتخاب بروید.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='حالت: افزودن متن. برای گذاشتن یک متن روی نقشه کلیک کنید. نزدیک یک گره کلیک کنید تا متن به آن گره متصل شود. برای تغییر یا جابه‌جایی المان‌ها و برچسب‌ها به حالت انتخاب بروید.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='از این حالت برای تغییر، جابه‌جایی و کشیدن چیزها روی نقشه استفاده کنید. این حالتی است که صفحه به‌طور پیش‌فرض به آن بازمی‌گردد: پس از برخی کارها، مانند باز کردن یک پروژه، خودش به این‌جا برمی‌گردد، و [Esc] از هر حالت دیگری شما را به این‌جا بازمی‌گرداند.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tip_labels_draggable']='می‌توانید یک برچسب را برای جابه‌جایی بکشید. برای بازگرداندن یک برچسب به جای خودکارش، آن را دوبار کلیک کنید.';
$ec_lang['lpn_field_auto']='خودکار';
$ec_lang['lpn_method_switch_confirm']='تغییر روش اصطکاک، اعداد زبری را که پیش‌تر روی لوله‌های شما تایپ شده‌اند تغییر نمی‌دهد، و زبری یک روش برای روش دیگر بی‌معنی است. پس از این کار، هر لوله را بررسی کنید. با این حال تغییر داده شود؟';
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
$ec_lang['lpn_field_closed']='بسته';
$ec_lang['lpn_field_closed_tip']='این لوله را ببندید تا هیچ آبی از آن عبور نکند. لوله روی نقشه باقی می‌ماند و همه اعدادش را نگه می‌دارد، و می‌توانید هر زمان دوباره آن را باز کنید.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='طول جغرافیایی';
$ec_lang['lpn_field_lat']='عرض جغرافیایی';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='شمالی';
$ec_lang['lpn_field_easting']='شرقی';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='ش';
$ec_lang['lpn_field_easting_abbr']='ع';
// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='یک مکان مختصاتی تایپ کنید تا این گره دقیقاً در آن جای‌گذاری شود. در یک سناریو، این مکان فقط در همان سناریو اعمال می‌شود، درست مانند کشیدن آن؛ در پایه، گره را همه‌جا جای‌گذاری می‌کند.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='آن بیرون از نقشه است. عرض جغرافیایی Pseudo Mercator از -85.05 تا 85.05 و طول جغرافیایی از -180 تا 180 است.';
$ec_lang['lpn_field_text_size']='ضریب اندازه';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='نمایش در همهٔ سطوح بزرگ‌نمایی';
$ec_lang['lpn_field_text_all_zoom_tip']='این متن را روی ترسیم نگه می‌دارد، هرقدر هم کوچک‌نمایی کنید. علامت آن را بردارید تا متن، همراه با دیگر برچسب‌ها، وقتی نمای نقشه از آستانهٔ برچسب‌گذاری تعیین‌شده زیر نقشه و صفحه پهن‌تر شود، پنهان شود.';
$ec_lang['lpn_tool_labels']='برچسب‌ها';
$ec_lang['lpn_labels_heading_node']='برچسب‌های گره';
$ec_lang['lpn_labels_heading_link']='برچسب‌های اتصال';
$ec_lang['lpn_labels_decimals_tip']='تعداد ارقام اعشار نشان‌داده‌شده برای این برچسب';
$ec_lang['lpn_labels_mark_extrema']='علامت‌گذاری بیشترین و کمترین مقدار';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='روی بالاترین مقدار هر ویژگیِ برچسب‌دار روی نقشه یک خط می‌کشد (یک خط بالا)، و زیر پایین‌ترین مقدار آن ویژگی یک خط می‌کشد (یک خط زیر)، تا بتوانید بالاترین و پایین‌ترین را بدون خواندن اعداد تشخیص دهید.';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='اعمال بر همه';
$ec_lang['lpn_settings_apply_to_all_tip']='هر المان از این نوع که از پیش رسم شده، شناسه‌ای می‌گیرد که با این متن آغاز می‌شود. هرکدام عدد خود را نگه می‌دارد. شناسه‌ای که به عدد ختم نمی‌شود دست‌نخورده می‌ماند.';
$ec_lang['lpn_confirm_apply_prefix']='نام {n} المان تغییر کند تا شناسه‌هایشان با {prefix} آغاز شود؟ هرکدام عدد خود را نگه می‌دارد.';
$ec_lang['lpn_prefix_applied']='نام {n} المان تغییر کرد. {skipped} تای دیگر دست‌نخورده ماندند.';
$ec_lang['lpn_labels_prefix_tip']='متنی که پیش از این ویژگی در برچسب‌های نقشه افزوده می‌شود';
$ec_lang['lpn_labels_suffix_tip']='متنی که پس از این ویژگی در برچسب‌های نقشه افزوده می‌شود';
$ec_lang['lpn_labels_suffix_gradient_tip']='متنی که پس از گرادیان افت هد در برچسب‌های نقشه افزوده می‌شود. اینجا نشانهٔ درصد تایپ نکنید. وقتی واحدها درصدند، خودش افزوده می‌شود.';
$ec_lang['lpn_labels_separator']='متن میان مقادیر';
$ec_lang['lpn_labels_separator_tip']='متن میان یک ویژگی و ویژگی بعدی روی یک برچسب. به‌طور پیش‌فرض یک فاصله.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='اولویت';
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_link_tip']='ترتیب حذف مقادیر هنگامی که برچسب جا نمی‌شود. عدد 1 بیشترین مدت نگه داشته می‌شود.';
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='ترتیبی که در آن، وقتی دو برچسبِ گره هم‌پوشانی پیدا کنند، ویژگی‌ها کنار گذاشته می‌شوند. ویژگیِ شمارهٔ 1 روی هر دو برچسب نخست کنار گذاشته می‌شود. وقتی یک ویژگی باقی بماند و آن دو هنوز هم‌پوشانی داشته باشند، کل یک برچسب پنهان می‌شود: هر برچسبی که مقدار باقی‌ماندهٔ آن کمترین ارزش نمایش را دارد، یعنی کمترین مصرف، فشاری که به میانهٔ بازه نزدیک‌تر است، یا تراز یا هدی که به گره‌های همسایه نزدیک‌تر است.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='پیش';
$ec_lang['lpn_labels_col_after']='پس';
$ec_lang['lpn_labels_col_decimals']='اعشار';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='نمایش';
$ec_lang['lpn_labels_show_tip']='ترتیبی که در آن مقادیر روی یک برچسب ظاهر می‌شوند. مقدار شمارهٔ 1 نخست می‌آید: در بالای یک برچسب پشته‌ای، و در آغاز یک برچسب یک‌خطی.';
$ec_lang['lpn_labels_priority_customer_tip']='ترتیبی که در آن مقادیر از یک برچسب مشترک کنار گذاشته می‌شوند. مقدار شمارهٔ 1 نخست کنار گذاشته می‌شود.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='استفاده از واحدها';
$ec_lang['lpn_labels_use_units_tip']='علامت بزنید تا واحد در جعبهٔ «پس» و روی برچسب نشان داده شود، و همگام با تغییر واحدها بماند. علامت را بردارید تا متن «پس» دلخواه خودتان را تایپ کنید.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='وضعیت آغازین';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='رنگ‌های گره';
$ec_lang['lpn_settings_sym_link_colors']='رنگ‌های لوله';
$ec_lang['lpn_field_id']='شناسه';
$ec_lang['lpn_backdrop_menu']='تصویر پس‌زمینه…';
$ec_lang['lpn_backdrop_add']='افزودن';
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
$ec_lang['lpn_backdrop_scale']='مقیاس‌گذاری با انتخاب';
$ec_lang['lpn_backdrop_scale_entry']='مقیاس‌گذاری با فایل مرجع‌گذاری یا اندازه هر پیکسل روی نقشه';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='مقیاس‌گذاری از اندازهٔ فعلی، حول نقطه‌ای که انتخاب می‌کنید';
$ec_lang['lpn_backdrop_scale_from_prompt1']='نقطه‌ای از تصویر پس‌زمینه را کلیک کنید که باید همان‌جا بماند.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='از اندازهٔ فعلی مقیاس‌گذاری کنید. عدد 1 اندازه را همان نگه می‌دارد، 1.1 آن را 10% بزرگ‌تر می‌کند، 0.9 آن را 10% کوچک‌تر می‌کند.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='اندازه یک پیکسل روی نقشه را وارد کنید، یا کل محتوای فایل مرجع‌گذاری تصویر را اینجا جای‌گذاری کنید';
$ec_lang['lpn_backdrop_scale_entry_bad']='یک عدد برای اندازه یک پیکسل روی نقشه تایپ کنید، یا هر شش خط یک فایل مرجع‌گذاری را جای‌گذاری کنید.';
$ec_lang['lpn_backdrop_wld_bad']='این فایل مرجع‌گذاری، تصویر را می‌چرخاند، آینه می‌کند یا به‌طور نامتقارن می‌کشد. نقشه فقط می‌تواند تصویر را جابه‌جا کند و آن را به یک نسبت یکسان در هر دو جهت تغییر اندازه دهد، بنابراین این فایل استفاده نشد.';
$ec_lang['lpn_backdrop_unreadable']='مرورگر شما نمی‌تواند این تصویر را نشان دهد. آن را با قالب PNG یا JPEG ذخیره کنید و دوباره اضافه کنید.';
$ec_lang['lpn_backdrop_position']='جابه‌جایی';
$ec_lang['lpn_backdrop_remove']='حذف';
$ec_lang['lpn_backdrop_remove_confirm']='تصویر پس‌زمینه حذف شود؟';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='نقشهٔ جهان…';
$ec_lang['lpn_map_attach_tip']='نقشهٔ جهان را بدون هیچ تغییر دیگری به این پروژه متصل می‌کند.';
$ec_lang['lpn_map_attach_add']='اتصال';
$ec_lang['lpn_map_attach_readjust']='تنظیم دوباره';
$ec_lang['lpn_map_attach_readjust_tip']='بازگشت به گام 2 از روند اتصال نقشه.';
$ec_lang['lpn_map_attach_scale_from']='مقیاس‌دهی از اندازهٔ کنونی…';
$ec_lang['lpn_map_attach_scale_from_prompt']='نقشه را از اندازهٔ کنونی‌اش، حول میانهٔ ترسیم شما، مقیاس‌دهی کنید. 1 آن را بی‌تغییر نگه می‌دارد، 1.1 آن را 10٪ بزرگ‌تر، و 0.9 آن را 10٪ کوچک‌تر می‌کند.';
$ec_lang['lpn_map_attach_scale_from_bad']='یک عدد تنها بزرگ‌تر از صفر تایپ کنید.';
$ec_lang['lpn_map_attach_scale_from_done']='اندازهٔ نقشه تغییر کرد، و ترسیم شما و هر مختصات در آن دقیقاً همان‌طور که بود باقی ماند.';
$ec_lang['lpn_map_attach_none']='هنوز نقشهٔ جهانی به این پروژه متصل نیست. نخست از نقشه، نقشهٔ جهان، اتصال استفاده کنید.';
$ec_lang['lpn_map_attach_remove']='جدا کردن';
$ec_lang['lpn_map_attach_remove_tip']='نقشهٔ جهان را برمی‌دارد. ترسیم و مختصات آن در هر دو حالت دست‌نخورده می‌مانند.';
$ec_lang['lpn_map_attach_done']='نقشهٔ جهان اکنون پشت ترسیم شماست، و پروژهٔ شما تغییر نکرده است. برای برداشتن دوبارهٔ آن، از نقشه، نقشهٔ جهان، جدا کردن استفاده کنید.';
$ec_lang['lpn_map_attach_removed']='نقشهٔ جهان رفته است، و ترسیم دقیقاً همان‌طور که بود باقی مانده.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='ترسیم شما روی نقشهٔ کل جهان است، در اقیانوس در عرض جغرافیایی صفر و طول جغرافیایی صفر. نخست جای خودتان را بیابید: نقشهٔ پشت ترسیم را پن و بزرگ‌نمایی کنید، نام مکانی را جست‌وجو کنید، یا عرض و طول جغرافیایی تایپ کنید. خودِ ترسیم جابه‌جا نمی‌شود.';
$ec_lang['lpn_mapgeo_step1']='گام 1 از 2: جای خودتان را در جهان بیابید';
$ec_lang['lpn_mapgeo_step2']='گام 2 از 2: نقشهٔ پشت ترسیم خود را جا بیندازید';
$ec_lang['lpn_mapgeo_hint1']='نقشهٔ پشت ترسیم خود را پن و بزرگ‌نمایی کنید، یا مکانی را جست‌وجو کنید، یا عرض و طول جغرافیایی تایپ کنید. سپس «جای‌گذاری تقریبی» را بزنید.';
$ec_lang['lpn_mapgeo_readjust_intro']='ترسیم شما همان‌جایی است که واپسین بار جای‌گذاری‌اش کردید. برای جابه‌جایی آن به جای دیگر، نقشهٔ پشت ترسیم را پن و بزرگ‌نمایی کنید، نام مکانی را جست‌وجو کنید، یا عرض و طول جغرافیایی تایپ کنید. خودِ ترسیم جابه‌جا نمی‌شود.';
$ec_lang['lpn_mapgeo_hint2']='در هر جا بکشید تا نقشه زیر ترسیم شما بلغزد. ترسیم شما و هر مختصات در آن دقیقاً همان‌جا که هستند می‌مانند. وقتی نقشه درست بود، «اینجا جای‌گذاری جغرافیایی کن» را بزنید.';
$ec_lang['lpn_mapgeo_gestures']='بزرگ‌نمایی ترسیم شما و نقشه را با هم جابه‌جا می‌کند، تا ببینید چقدر خوب هم‌تراز هستند. کشیدن فقط نقشه را جابه‌جا می‌کند.';
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
$ec_lang['lpn_mapgeo_dial_turn']='چرخاندن نقشه';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} درجه';
$ec_lang['lpn_mapgeo_dial_size']='اندازهٔ نقشه';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} برابر';
$ec_lang['lpn_mapgeo_dial_help']='دو میله را بلغزانید، یا در جعبه‌های بالای آن‌ها تایپ کنید، تا نقشه را بزرگ‌تر یا کوچک‌تر کنید و بچرخانید. میانهٔ هر میله همان جای‌گذاری‌ای است که گام 1 برجای گذاشت، پس 1 و 0 یعنی دست‌نخورده رهایش کنید. کلیدهای جهت روی هر دو کار می‌کنند.';
$ec_lang['lpn_mapgeo_place']='جای‌گذاری تقریبی';
$ec_lang['lpn_mapgeo_finish']='اینجا جای‌گذاری جغرافیایی کن';
$ec_lang['lpn_mapgeo_cancelled']='نقشهٔ جهان به جای پیشین خود بازگشت، و ترسیم شما هرگز جابه‌جا نشد.';
$ec_lang['lpn_mapgeo_locked']='پیش از جابه‌جایی میان پروژه‌ها یا ذخیره، با دکمهٔ «اینجا جای‌گذاری جغرافیایی کن» کار را پایان دهید، یا Cancel را بزنید. نقشهٔ جهان هنوز در حال جای‌گذاری است.';
$ec_lang['lpn_backdrop_scale_prompt1']='دو نقطه را روی تصویر پس‌زمینه کلیک کنید، مانند دو سر یک مقیاس خط‌کشی. سپس فاصله واقعی میان آن‌ها را تایپ کنید.';
$ec_lang['lpn_backdrop_scale_prompt2']='فاصله واقعی میان دو نقطه';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='نقطهٔ مبنا (روی تصویر) را برای جابه‌جایی کلیک کنید.';
$ec_lang['lpn_backdrop_position_prompt2']='روشی برای نقطهٔ مقصد انتخاب کنید، سپس ادامه را کلیک کنید.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='در حال تنظیم تصویر پس‌زمینه.';
$ec_lang['lpn_backdrop_target_label']='آن نقطه را به اینجا ببر:';
$ec_lang['lpn_backdrop_target_node']='یک گره';
$ec_lang['lpn_backdrop_target_free']='هر نقطه‌ای روی نقشه';
$ec_lang['lpn_backdrop_target_coords']='مختصاتی که تایپ می‌کنید';
$ec_lang['lpn_backdrop_coords_prompt']='X,Y که آن نقطه باید به آن جابه‌جا شود را تایپ کنید';
$ec_lang['lpn_backdrop_continue']='ادامه';
$ec_lang['lpn_tool_settings']='تنظیمات';
$ec_lang['lpn_settings_show_titles']='نمایش عنوان‌های صفحه';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_show_titles_tip']='سرصفحه و خط خوش‌آمدگویی بالای طرح را پنهان می‌کند، تا نقشه فضای بیشتری داشته باشد. چاپ تغییری نمی‌کند.';
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='پنهان‌کردن این عنوان‌ها';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='نمایش راهنمای انتخاب';
$ec_lang['lpn_settings_area_hint_tip']='حبابی روی نقشه نشان می‌دهد که هنگام انتخاب یک ناحیه، کلیک بعدی شما چه می‌کند.';
$ec_lang['lpn_settings_id_prefixes']='پیشوندهای شناسه';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='مقادیر ایجاد';
$ec_lang['lpn_settings_defaults_note']='برای المان‌هایی که از این پس می‌سازید استفاده می‌شود. المان‌های موجود تغییر نمی‌کنند.';
$ec_lang['lpn_settings_push_note']='فقط ویژگی‌هایی که برچسب‌شان اکنون نمایش داده می‌شود اعمال می‌شوند.';
$ec_lang['lpn_settings_push_btn']='اعمال این مقادیر المان‌های تازه به هر المان موجود';
$ec_lang['lpn_push_confirm']='این ویژگی‌ها روی هر المان موجود با مقادیری که اکنون برای المان‌های تازه تنظیم شده جایگزین شود؟ مقادیری که تایپ کرده‌اید بازنویسی می‌شوند. می‌توانید این کار را واگرد کنید.';
$ec_lang['lpn_push_properties']='ویژگی‌ها:';
$ec_lang['lpn_push_assets']='گره‌ها و لوله‌ها:';
$ec_lang['lpn_push_none_displayed']='اکنون هیچ مقدار آغازینی به‌صورت برچسب نمایش داده نمی‌شود، پس چیزی برای اعمال نیست. برچسب‌های ویژگی‌های دلخواه را در پنل برچسب‌ها روشن کنید، سپس دوباره تلاش کنید.';
$ec_lang['lpn_push_nothing']='هیچ المان موجودی هیچ‌کدام از ویژگی‌های اعمال‌شونده را ندارد.';
$ec_lang['lpn_push_no_change']='هر المان از پیش این مقادیر را دارد، پس چیزی تغییر نمی‌کند.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='ویژگی‌های سفارشی';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='ویژگی‌هایی که خودتان برای مقاصد خود تعریف می‌کنید. آن‌ها مانند هر ویژگی دیگری همراه پروژه و سناریوها ذخیره می‌شوند.';
$ec_lang['lpn_cp_design']='طراحی';
$ec_lang['lpn_cp_design_tip']='یک ردیف برای هر ویژگی سفارشی، و هر ردیف با باز شدن این‌ها را نشان می‌دهد: کلید، برچسب، اعمال‌شونده بر، اعتبارسنجی به‌صورت، اجازه یا محدودیت، فیلد نویسه‌هایی که آن انتخاب نام می‌برد، حد پایین طول، حد بالای طول، حد پایین، حد بالا.';
$ec_lang['lpn_cp_add']='افزودن ویژگی سفارشی';
$ec_lang['lpn_cp_add_tip']='یک ردیف به جدول طراحی می‌افزاید و آن را برای ویرایش باز می‌کند.';
$ec_lang['lpn_cp_remove']='حذف';
$ec_lang['lpn_cp_remove_tip']='این ویژگی را از جدول طراحی حذف می‌کند. مقادیری که از پیش روی المان‌های شما تایپ شده در پرونده نگه داشته می‌شوند و اگر همان کلید را دوباره طراحی کنید بازمی‌گردند.';
$ec_lang['lpn_cp_none']='هنوز هیچ ویژگی سفارشی طراحی نشده است.';
$ec_lang['lpn_cp_unnamed']='هنوز نام‌گذاری نشده';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='کلید';
$ec_lang['lpn_cp_key_tip']='کلید: یک ویژگی زیر این نام ذخیره می‌شود. فاصله مجاز نیست، و یک پیشوند برای شما افزوده می‌شود تا کلید شما هرگز با یک فیلد داخلی برخورد نکند.';
$ec_lang['lpn_cp_label']='برچسب';
$ec_lang['lpn_cp_label_tip']='برچسب: خواننده این را روی جعبهٔ ویژگی‌ها، در جست‌وجو، و در سربرگ ستون یک جدول می‌بیند.';
$ec_lang['lpn_cp_applies']='اعمال‌شونده بر';
$ec_lang['lpn_cp_applies_tip']='اعمال‌شونده بر: فهرستی جدا‌شده با ویرگول از پیشوندهای شناسه برای المان‌هایی که از این ویژگی استفاده می‌کنند، مانند J,L,R.';
$ec_lang['lpn_cp_validate']='اعتبارسنجی به‌صورت';
$ec_lang['lpn_cp_validate_tip']='اعتبارسنجی به‌صورت: این می‌گوید یک مقدار درست چه شکلی دارد. قواعد حروف بزرگ و کوچک فقط الفبای انگلیسی را می‌خوانند، که این یک محدودیت اعلام‌شده است. برای پذیرفتن هرچیزی «اعتبارسنجی نکن» را انتخاب کنید.';
$ec_lang['lpn_cp_restrict']='این نویسه‌ها را محدود کن';
$ec_lang['lpn_cp_restrict_tip']='این نویسه‌ها را محدود کن: یک مقدار فقط می‌تواند از نویسه‌های فهرست‌شده در این‌جا استفاده کند، یا از هیچ‌کدام از آن‌ها، که در آن «@» یعنی هر حرف؛ «#» یعنی هر رقم عددی، و اگر «-»، «.»، و «,» مجاز باشند باید جداگانه فهرست شوند؛ و هر نویسهٔ فاصله باید بین نویسه‌های دیگر باشد.';
$ec_lang['lpn_cp_restrict_mode']='اجازه یا محدودیت';
$ec_lang['lpn_cp_restrict_mode_tip']='اجازه یا محدودیت: نویسه‌های داده‌شده یا تنها نویسه‌هایی هستند که یک مقدار می‌تواند استفاده کند، یا نویسه‌هایی که نمی‌تواند.';
$ec_lang['lpn_cp_restrict_allow']='فقط این نویسه‌ها مجازند';
$ec_lang['lpn_cp_restrict_deny']='این نویسه‌ها را محدود کن';
$ec_lang['lpn_cp_minlength']='حد پایین طول';
$ec_lang['lpn_cp_minlength_tip']='حد پایین طول: هر ورودی کوتاه‌تر پرچم‌گذاری می‌شود، که این‌گونه ورودی‌های خالی و نیمه‌تایپ‌شده را می‌یابید.';
$ec_lang['lpn_cp_length']='حد بالای طول';
$ec_lang['lpn_cp_length_tip']='حد بالای طول: هر ورودی بلندتر پرچم‌گذاری می‌شود.';
$ec_lang['lpn_cp_low']='حد پایین';
$ec_lang['lpn_cp_low_tip']='حد پایین: این کوچک‌ترین مقداری است که انتظار دارید. عددها به‌صورت عدد و متن به ترتیب الفبایی مقایسه می‌شوند.';
$ec_lang['lpn_cp_high']='حد بالا';
$ec_lang['lpn_cp_high_tip']='حد بالا: این بزرگ‌ترین مقداری است که انتظار دارید. عددها به‌صورت عدد و متن به ترتیب الفبایی مقایسه می‌شوند.';
$ec_lang['lpn_cp_val_none']='اعتبارسنجی نکن';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='عدد .';
$ec_lang['lpn_cp_val_number_comma']='عدد ,';
$ec_lang['lpn_cp_val_integer']='عدد صحیح';
$ec_lang['lpn_cp_val_upper']='همه بزرگ';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} مقدار دقیقاً همان‌طور که تایپ کرده‌اید نگه داشته می‌شود.';
$ec_lang['lpn_cp_bad_number']='این مقدار عددی نیست، چنان‌که این ویژگی می‌طلبد.';
$ec_lang['lpn_cp_bad_integer']='این مقدار یک عدد صحیح نیست، چنان‌که این ویژگی می‌طلبد.';
$ec_lang['lpn_cp_bad_case']='این مقدار همه‌بزرگ نیست، چنان‌که این ویژگی می‌طلبد.';
$ec_lang['lpn_cp_bad_chars']='این مقدار از نویسه‌ای استفاده می‌کند که این ویژگی اجازه نمی‌دهد.';
$ec_lang['lpn_cp_bad_space']='فاصله فقط بین نویسه‌های دیگر مجاز است.';
$ec_lang['lpn_cp_bad_minlength']='این مقدار کوتاه‌تر از حدی است که این ویژگی اجازه می‌دهد.';
$ec_lang['lpn_cp_bad_length']='این مقدار بلندتر از حدی است که این ویژگی اجازه می‌دهد.';
$ec_lang['lpn_cp_bad_low']='این مقدار پایین‌تر از حد پایین این ویژگی است.';
$ec_lang['lpn_cp_bad_high']='این مقدار بالاتر از حد بالای این ویژگی است.';
$ec_lang['lpn_cp_key_needed']='به این ویژگی سفارشی کلیدی بدون فاصله بدهید.';
$ec_lang['lpn_cp_key_taken']='ویژگی سفارشی دیگری از پیش از آن کلید استفاده می‌کند.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='سناریو';
$ec_lang['lpn_scenario_base']='پایه';
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
$ec_lang['lpn_scenario_overrides']='تعداد مقادیر اختصاصی';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='حلقهٔ کهربایی یعنی این المان مقداری دارد که تنها به سناریوی {name} تعلق دارد.';
$ec_lang['lpn_scenario_overrides_tip']='هر یک از آن مقادیر روی نقشه با یک حلقهٔ کهربایی نشان‌گذاری شده است. به {base} تغییر دهید تا ترسیم را بدون آن‌ها ببینید.';
$ec_lang['lpn_scenario_menu']='سناریوها';
$ec_lang['lpn_scenario_tip']='مجموعه مقادیری که ترسیم اکنون نشان می‌دهد و صفحه اکنون حل می‌کند. برای تعویض سناریوها، یا افزودن، تغییر نام، یا حذف یکی از آن‌ها، کلیک کنید.';
$ec_lang['lpn_scenario_new']='سناریوی جدید…';
$ec_lang['lpn_scenario_new_name']='سناریوی {n}';
$ec_lang['lpn_scenario_prompt_name']='نامی برای این سناریو';
$ec_lang['lpn_scenario_rename']='تغییر نام سناریو…';
$ec_lang['lpn_scenario_delete']='حذف سناریو';
$ec_lang['lpn_scenario_delete_confirm']='سناریوی {name} و {n} مقداری که تنها به آن تعلق دارند حذف شوند؟ خود ترسیم تغییر نمی‌کند.';
$ec_lang['lpn_scenario_override']='فقط در این سناریو';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='علامت‌دار بودن یعنی این مقدار تنها به این سناریو تعلق دارد، حتی اگر با عدد پایه یکسان باشد. برای استفاده دوباره از مقدار پایه، علامت را بردارید.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='سناریوی پایه: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} در {scenario} از شبکه خارج است. هنوز در ترسیم، و در سایر سناریوهای شما هست.';
$ec_lang['lpn_scenario_push_btn']='اعمال مقادیر پایه به همه سناریوها';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='هر سناریو برای ویژگی‌هایی که برچسب‌هایشان اکنون نمایان است، به مقدار پایه بازمی‌گردد. مقادیری که تنها به آن سناریوها تعلق دارند دور ریخته می‌شوند.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='همه سناریوها برای این ویژگی‌ها از مقادیر پایه استفاده کنند؟ مقادیری که تنها به آن سناریوها تعلق دارند دور ریخته می‌شوند. می‌توانید این کار را واگرد کنید.';
$ec_lang['lpn_scenario_push_scenarios']='سناریوهای تحت تأثیر:';
$ec_lang['lpn_scenario_push_values']='مقادیر دورریخته‌شده:';
$ec_lang['lpn_scenario_push_none']='هیچ سناریویی برای هیچ‌یک از این ویژگی‌ها مقدار اختصاصی خود را ندارد، پس چیزی تغییر نمی‌کند. چیزی دور ریخته نمی‌شود.';
$ec_lang['lpn_delete_drops_overrides']='حذف این المان همچنین {n} مقداری را که سناریوهای شما برای آن نگه داشته‌اند دور می‌ریزد. ادامه می‌دهید؟';
$ec_lang['lpn_push_base_only']='این عمل خود ترسیم را تغییر می‌دهد، پس فقط در {base} قابل انجام است. به {base} بروید و دوباره تلاش کنید.';
$ec_lang['lpn_field_active']='بخشی از این شبکه';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='این جعبه را نشان‌ندار کنید تا المان روی ترسیم بماند اما از شبکه خارج شود: با رنگ خاکستری رسم می‌شود و حل‌کننده آن را نادیده می‌گیرد. در یک سناریو، یک لولهٔ پیشنهادی به همین شکل روشن و خاموش می‌شود.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='توان آب‌پاش';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='توان در معادلهٔ قطره‌چکان EPANET برای آب‌پاش‌ها و نشتی‌ها: دبی = ضریب × فشار به توان این عدد. این فقط پاسخ را در جایی تغییر می‌دهد که یک گره قطره‌چکان داشته باشد، که فعلاً یعنی شبکه‌ای که از یک فایل EPANET خوانده شده.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='خواندن زمین‌نما';
$ec_lang['lpn_elev_dem_sample_tip']='تراز زمین‌نما را در این گره می‌خواند و آن را در زیر نشان می‌دهد. چیزی در جعبهٔ تراز تغییر نمی‌کند. تفکیک‌پذیری افقی زمین‌نما برای بیشتر زمین حدود 30 متر است، و در جایی که داده‌های بهتری وجود دارد ریزتر است.';
$ec_lang['lpn_elev_dem_use']='استفاده از زمین‌نما';
$ec_lang['lpn_elev_dem_use_tip']='تراز زمین‌نما را در این گره در جعبهٔ تراز بالا می‌گذارد، و آنچه در آن‌جاست را جایگزین می‌کند. اگر هنوز زمین‌نما خوانده نشده باشد، نخست آن را می‌خواند. یک واگرد آن را برمی‌گرداند.';
$ec_lang['lpn_elev_dem_none']='زمین‌نما ترازی برای این گره ندارد.';
$ec_lang['lpn_elev_dem_said']='زمین‌نمای Mapbox می‌گوید {v} {u}.';
$ec_lang['lpn_settings_elev_source']='منبع تراز';
$ec_lang['lpn_settings_elev_source_tip']='گره تازه از کجا تراز خود را می‌گیرد. سطح زمین از زمین‌نمای Mapbox خوانده می‌شود، که برای بیشتر زمین حدود 30 متر است و در جایی که داده‌های بهتری وجود دارد ریزتر است.';
$ec_lang['lpn_settings_elev_source_typed']='ترازی که در بالا تایپ شده';
$ec_lang['lpn_settings_elev_source_dem']='زمین‌نمای Mapbox';
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
$ec_lang['lpn_settings_default_is']='مقدار پیش‌فرض {n} است.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='چقدر باید حل‌کننده نزدیک شود پیش از آن‌که متوقف شود، اندازه‌گیری‌شده به‌صورت مقداری که دبی‌ها هنوز از یک آزمایش تا آزمایش بعدی در حال تغییرند. عدد کوچک‌تر دقیق‌تر است و زمان بیشتری می‌برد. هر دو حل‌کننده همین یک جعبه را می‌خوانند، و هرکدام آن تغییر را در برابر مجموع متفاوتی می‌سنجند: حل‌کنندهٔ درون‌ساخت در برابر مجموع مصرف‌ها، EPANET در برابر مجموع دبی‌های لوله‌ها. اگر خالی بماند، این صفحه دقتی سخت‌گیرانه‌تر از پیش‌فرض خودِ EPANET به کار می‌برد.';
$ec_lang['lpn_settings_specific_gravity']='وزن مخصوص نسبی';
$ec_lang['lpn_settings_specific_gravity_tip']='وزن سیال در مقایسه با آب. فشاری را که یک فشارسنج می‌خواند تغییر می‌دهد، نه دبی‌ها را.';
$ec_lang['lpn_settings_viscosity']='ویسکوزیتهٔ نسبی';
$ec_lang['lpn_settings_viscosity_tip']='ویسکوزیتهٔ سیال در مقایسه با آب در 20 درجهٔ سلسیوس. فقط در روش دارسی-وایسباخ پاسخ را تغییر می‌دهد.';
$ec_lang['lpn_settings_trials']='حداکثر آزمایش‌ها';
$ec_lang['lpn_settings_trials_tip']='چند آزمایش مجاز است پیش از آن‌که حل‌کننده از شبکه‌ای که همگرا نمی‌شود دست بکشد.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='اگر همگرا نشود';
$ec_lang['lpn_settings_unbalanced_tip']='با شبکه‌ای که آزمایش‌های خود را تمام کرده و هنوز همگرا نشده چه باید کرد. مجاز کردن آزمایش‌های اضافه اغلب به همگرایی می‌رسد. متوقف کردن، آخرین آزمایش را همان‌طور که هست گزارش می‌کند، که یک پاسخ نیست. فقط حل‌کنندهٔ EPANET این جعبه را می‌خواند. حل‌کنندهٔ درون‌ساخت همیشه متوقف می‌شود و پاسخ را همگرانشده علامت می‌زند.';
$ec_lang['lpn_settings_unbalanced_continue']='اجازهٔ آزمایش‌های اضافه';
$ec_lang['lpn_settings_unbalanced_stop']='متوقف شدن و گزارش آخرین آزمایش';
$ec_lang['lpn_settings_unbalanced_trials']='آزمایش‌های اضافه پیش از گزارش';
$ec_lang['lpn_settings_unbalanced_trials_tip']='چند آزمایش بیشتر پس از تمام شدن حداکثر بالا مجاز باشد، پیش از آن‌که آخرین آزمایش گزارش شود. فقط حل‌کنندهٔ EPANET این جعبه را می‌خواند.';
$ec_lang['lpn_settings_head_error']='حد خطای هد';
$ec_lang['lpn_settings_head_error_tip']='آزمونی افزوده که حل‌کننده باید پیش از توقف از آن بگذرد: بزرگ‌ترین خطای هد باقی‌مانده در هر یک لوله. صفر یعنی این آزمون اعمال نشود. فقط حل‌کنندهٔ EPANET این جعبه را می‌خواند.';
$ec_lang['lpn_settings_flow_change']='حد تغییر دبی';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='آزمونی افزوده که حل‌کننده باید پیش از توقف از آن بگذرد: بیشترین تغییر در دبی هر یک لوله از یک آزمایش تا آزمایش بعدی. صفر یعنی این آزمون اعمال نشود. فقط حل‌کنندهٔ EPANET این جعبه را می‌خواند.';
$ec_lang['lpn_settings_damp_limit']='میرایی از اینجا آغاز می‌شود';
$ec_lang['lpn_settings_damp_limit_tip']='دقتی که در آن حل‌کننده گام‌های کوچک‌تری برمی‌دارد، که می‌تواند به همگرایی یک شبکهٔ نوسانی کمک کند. صفر یعنی حل‌کننده هرگز میرا نمی‌کند. فقط حل‌کنندهٔ EPANET این جعبه را می‌خواند.';
$ec_lang['lpn_settings_option_unset']='بیان نشده';
$ec_lang['lpn_settings_demand_multiplier']='ضریب مصرف';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='یک ضریب واحد که به‌طور همزمان به هر مصرف در شبکه اعمال می‌شود. از آن برای پرسیدن این‌که سیستم در مصرفی بیش‌تر یا کم‌تر از امروز چه می‌کند استفاده کنید. عددهایی را که تایپ کرده‌اید تغییر نمی‌دهد. یک سناریو می‌تواند ضریب خودش را داشته باشد، پس میانگین روز، حداکثر روز و اوج ساعت هرکدام یک عدد می‌شوند؛ آن را در یک سناریو خالی بگذارید تا از ضریب پروژه استفاده شود.';
$ec_lang['lpn_settings_engine_native']='حل با حل‌کننده EPANET';
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
$ec_lang['lpn_settings_engine_native_tip']='حل‌کنندهٔ EPANET را، از آژانس حفاظت محیط‌زیست آمریکا (US EPA)، همین‌جا در مرورگرتان اجرا می‌کند. در شبکه‌ای به این اندازه، تفاوت سرعتی احساس نخواهید کرد. دو حل‌کننده به‌طور نزدیک، اما نه دقیقاً، با هم توافق دارند: EPANET مقداری را که برای شتاب گرانش به کار می‌برد گرد می‌کند، پس افت‌های موضعی آن حدود ۰٫۰۸٪ کمتر از حل‌کنندهٔ درون‌ساخت به دست می‌آید، و با زبری مانینگ، افت هد آن حدود ۰٫۶٪ کمتر می‌شود. نخستین باری که این گزینه را روشن می‌کنید، حدود ۶۵۰ کیلوبایت دانلود شده و سپس روی این دستگاه نگه داشته می‌شود.';
$ec_lang['lpn_engine_loading']='در حال بارگذاری حل‌کننده EPANET…';
$ec_lang['lpn_engine_failed']='حل‌کننده EPANET بارگذاری نشد. به‌جای آن حل‌کننده داخلی نمایش داده می‌شود.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='با حل‌کننده EPANET حل شد، زیرا این شیرها خودشان باز و بسته می‌شوند:';
$ec_lang['lpn_unit_unknown']='این ترسیم واحدی را بیان می‌کند که این صفحه ارائه نمی‌دهد: {unit}. همه‌چیز درست همان‌گونه که وارد شده نگه داشته و نمایش داده می‌شود، و چیزی تغییر نکرده است. تا وقتی این صفحه آن واحد را نشناسد، هیچ محاسبه‌ای انجام نمی‌شود، چون نمی‌داند بزرگی یکی از آن‌ها چقدر است.';
$ec_lang['lpn_engine_manning_note']='توجه: با زبری مانینگ، EPANET افت هد را حدود ۰٫۶ درصد کمتر از حل‌کننده داخلی محاسبه می‌کند.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='حل‌کنندهٔ EPANET این شبکه را نپذیرفت، پس اجرا نشد.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='حل‌کنندهٔ EPANET گفت: {message}';
$ec_lang['lpn_engine_refused_fallback']='عددهای روی صفحه در عوض از حل‌کنندهٔ درون‌ساخت به دست آمده‌اند.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='عددهای روی صفحه در عوض از حل‌کنندهٔ درون‌ساخت به دست آمده‌اند. این حل‌کننده هر بار فقط یک لحظه را محاسبه می‌کند، پس این شبکه فقط در {time} است، در حالی که هر تانک هنوز در تراز آغازین خود مانده.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='این کنترل‌ها المانی را نام می‌برند که دیگر در این پروژه نیست، پس کنار گذاشته شدند: {ids}';
$ec_lang['lpn_control_unreadable_note']='این کنترل‌ها خوانده نشدند، پس کنار گذاشته شدند: {ids}';
$ec_lang['lpn_rule_dangling_note']='این قواعد به المانی ارجاع می‌دهند که دیگر در این پروژه نیست، پس در این اجرا نادیده گرفته شدند: {ids}';
$ec_lang['lpn_rule_unreadable_note']='این قواعد را نمی‌شد خواند، پس در این اجرا نادیده گرفته شدند: {ids}';
$ec_lang['lpn_settings_text_size']='اندازهٔ متن (پیکسل)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='اندازهٔ نماد (پیکسل)';
$ec_lang['lpn_settings_link_width']='ضخامت خط لوله (پیکسل)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='پیکان‌های جهت دبی';
$ec_lang['lpn_settings_show_arrows_tip']='روی هر لوله یک پیکان رسم می‌کند که نشان می‌دهد آب به کدام سو می‌رود. پیکان‌ها پس از یک اجرا نمایان می‌شوند، و خاموش کردن آن‌ها نتایج را تغییر نمی‌دهد. این تنظیم همراه با پروژه ذخیره می‌شود.';
$ec_lang['lpn_settings_align_labels']='هم‌راستاسازی برچسب‌های لوله با لوله‌ها';
$ec_lang['lpn_settings_readability_bias']='وقتی یک برچسب بیش از این مقدار درجه به چپِ عمود کج شود، آن را وارونه کن';
$ec_lang['lpn_settings_readability_bias_tip']='وقتی برچسبی بیش از این مقدار درجه به چپِ عمود کج شود، آن را وارونه می‌کند تا درست بایستد.';
$ec_lang['lpn_settings_mask_labels']='پس‌زمینهٔ توپر پشت برچسب‌ها';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='چسباندن خط راهنمای برچسب به زاویه‌های معین';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_leader_snap_tip']='وقتی یک برچسب را از چیزی که نام می‌برد دور می‌کشید، خط بازگشت به آن، اگر نزدیک یکی از زاویه‌های معین بکشید، به نزدیک‌ترین آن‌ها کشیده می‌شود. اگر کشیدن را ادامه دهید، چسبیدن رها می‌شود، پس هر زاویه‌ای هنوز در دسترس است. خاموش، آزادانه می‌کشد، که همان کاری است که این صفحه همیشه انجام داده.';
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='نمایش برچسب‌ها هنگامی که بزرگ‌نمایی به این پهنای نقشه یا کمتر برسد';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='برچسب‌ها فقط تا زمانی که نمای نقشه به همین پهنا یا باریک‌تر باشد رسم می‌شوند. جعبه را خالی بگذارید تا در هر بزرگ‌نمایی رسم شوند. 0 تایپ کنید تا هرگز، در هیچ بزرگ‌نمایی‌ای، برچسبی رسم نشود.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='همیشه نمایش داده شود';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap']='جلوگیری از بزرگ‌تر شدن گره‌ها بیش از';
$ec_lang['lpn_settings_symbol_cap_mid']='برابر طول';
$ec_lang['lpn_settings_symbol_cap_post']='صدک لوله';
$ec_lang['lpn_settings_symbol_cap_tip']='یک گره وقتی قطرش به این‌اندازه برابر طول لولهٔ این صدک از میان همهٔ طول‌های لوله در شبکه برسد، از رشد روی زمین بازمی‌ایستد. از آن نقطه به بعد روی نقشه، گره‌ها، لوله‌ها و دیگر نمادها هنگام کوچک‌نمایی روی صفحه کوچک می‌شوند، به‌جای آنکه روی زمین بزرگ شوند. مخزن‌ها و تانک‌ها استثنا هستند و اندازهٔ صفحهٔ خود را در هر بزرگ‌نمایی حفظ می‌کنند.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='تیرگی نماد (۰ تا ۱)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='تیرگی تصویر پس‌زمینه (۰ تا ۱)';
$ec_lang['lpn_settings_map_display']='ظاهر نقشه';
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
$ec_lang['lpn_settings_legend_position']='جای‌گاه راهنمای برچسب‌ها';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='هیچ‌کدام';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='خاموش';
$ec_lang['lpn_settings_legend_top_left']='بالا چپ';
$ec_lang['lpn_settings_legend_top_right']='بالا راست';
$ec_lang['lpn_settings_legend_middle_left']='وسط چپ';
$ec_lang['lpn_settings_legend_middle_right']='وسط راست';
$ec_lang['lpn_settings_legend_bottom_left']='پایین چپ';
$ec_lang['lpn_settings_legend_bottom_right']='پایین راست';
$ec_lang['lpn_settings_color_node_field']='رنگ گره';
$ec_lang['lpn_settings_color_link_field']='رنگ لوله';
$ec_lang['lpn_settings_color_ramp']='طرح رنگ';
$ec_lang['lpn_settings_color_credits']='اعتبارها';
$ec_lang['lpn_color_ramp_epanet']='آبی به قرمز (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='بنفش به زرد (تشخیص آسان‌تر رنگ‌ها از یکدیگر)';
$ec_lang['lpn_color_ramp_gray']='خاکستری روشن به تیره';
$ec_lang['lpn_settings_color_reverse']='برعکس کردن ترتیب رنگ‌ها';
$ec_lang['lpn_color_none']='بدون رنگ';
$ec_lang['lpn_settings_color_key_position']='موقعیت راهنمای رنگ';
$ec_lang['lpn_settings_color_breaks']='حدود باندهای رنگ';
$ec_lang['lpn_settings_color_equal_intervals']='بازه‌های مساوی';
$ec_lang['lpn_settings_color_equal_counts']='شمار مساوی';
$ec_lang['lpn_settings_color_no_values']='هنوز مقداری برای کار وجود ندارد. ابتدا شبکه را حل کنید.';
$ec_lang['lpn_confirm_restore_defaults']='همه تنظیمات (پیشوندهای شناسه، مقادیر آغازین، تنظیمات حل‌کننده، ظاهر نقشه، جای‌گاه راهنما، و برچسب‌های نمایان) به مقادیر اصلی خود بازنشانی شوند؟ شبکه شما تغییری نمی‌کند. تنظیمات متعلق به پروژه باز است، پس پروژه‌های دیگرتان تنظیمات خودشان را نگه می‌دارند.';
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
$ec_lang['lpn_settings_wipe_btn']='پاک کردن همه‌چیز در این صفحه';
$ec_lang['lpn_confirm_wipe']='همه‌چیز ذخیره‌شده برای این صفحه — هر پروژه، هر تصویر پس‌زمینه، همه تنظیمات، و انتخاب واحدهایتان — حذف شود و صفحه دوباره طوری بارگذاری شود که انگار یک بازدیدکننده کاملاً تازه است؟ این کار قابل بازگشت نیست.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='این پیوند را کپی کنید:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='زمان';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='کل مدت اجرا';
$ec_lang['lpn_time_hyd_step']='گام زمانی هیدرولیکی';
$ec_lang['lpn_time_pattern_step']='گام زمانی الگو';
$ec_lang['lpn_time_pattern_start']='زمان آغاز الگو';
$ec_lang['lpn_time_report_step']='گام زمانی گزارش';
$ec_lang['lpn_time_report_start']='زمان آغاز گزارش';
$ec_lang['lpn_time_clock_start']='ساعت در لحظهٔ آغاز';
$ec_lang['lpn_time_clock_day']='روز {day}، {clock}';
$ec_lang['lpn_time_format_tip']='زمان را به‌صورت ساعت و دقیقه بنویسید، مانند 2:30. یک عدد ساده به معنای ساعت است، پس 8 یعنی هشت ساعت. نیم ساعت می‌شود 0:30.';
$ec_lang['lpn_time_running']='محاسبهٔ شبیه‌سازی بازهٔ زمانی با حل‌کنندهٔ EPANET.';
$ec_lang['lpn_time_no_engine']='حل‌کنندهٔ درون‌ساخت هر بار یک لحظه را محاسبه می‌کند، پس این تنها شبکه در {time} است: هر الگو در همان لحظه خوانده می‌شود، و هر تانک هنوز در ترازِ آغازین خود می‌نشیند به‌جای پر و خالی شدن. یک‌بار به اینترنت وصل شوید تا حل‌کنندهٔ EPANET، که یک شبیه‌سازی بازهٔ زمانی را اجرا می‌کند، دریافت شود.';
$ec_lang['lpn_time_slider']='زمان';
$ec_lang['lpn_time_no_period']='این پروژه هیچ شبیه‌سازی بازهٔ زمانی‌ای تنظیم‌شده ندارد، پس تنها یک لحظه برای نمایش وجود دارد. برای اجرای یک شبیه‌سازی بازهٔ زمانی، یک کل مدت اجرا را در تنظیمات، محاسبه، زمان تعیین کنید.';
$ec_lang['lpn_time_first']='برو به آغاز';
$ec_lang['lpn_time_prev']='یک گام به عقب';
$ec_lang['lpn_time_play']='اجرا';
$ec_lang['lpn_time_play_tip']='پخش پویانمایی';
$ec_lang['lpn_time_pause_tip']='مکث پویانمایی';
$ec_lang['lpn_time_pause']='مکث';
$ec_lang['lpn_time_next']='یک گام به جلو';
$ec_lang['lpn_time_last']='برو به پایان';
$ec_lang['lpn_time_tank']='تانک';
$ec_lang['lpn_time_level']='تراز آب';
$ec_lang['lpn_time_run']='محاسبه';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='این شبکه را در هر گام زمانی هیدرولیکی، از آغاز اجرا تا پایان آن، حل کنید.';
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
$ec_lang['lpn_time_run_done']='اجرا پایان یافت. زمان‌های گزارش‌دهی: {frames}. زمان صرف‌شده: {secs} ثانیه.';
$ec_lang['lpn_time_runbox_hide']='این جعبه را دوباره نشان نده';
$ec_lang['lpn_settings_runbox']='نمایش جعبهٔ پیشرفت اجرا';
$ec_lang['lpn_settings_runbox_tip']='جعبه‌ای که گزارش می‌دهد یک اجرا تا کجا پیش رفته و چه یافته است. با خاموش بودن آن، یک اجرای پایان‌یافته همان چیز را برای چند ثانیه در خط وضعیت می‌گوید. این یک تنظیم برای این مرورگر است، نه برای پروژه.';
$ec_lang['lpn_time_run_failed']='اجرا به پایان نرسید، پس برای زمان‌های بعدی نتیجه‌ای وجود ندارد.';
$ec_lang['lpn_time_run_report']='گزارش اجرای EPANET';
$ec_lang['lpn_time_run_report_copy']='کپی';
$ec_lang['lpn_time_run_report_copied']='کپی شد';
$ec_lang['lpn_time_run_report_tip']='آنچه خودِ حل‌کنندهٔ EPANET دربارهٔ آخرین اجرا چاپ کرد: آیا همگرا شد، و هر چیزی که دربارهٔ آن هشدار داد. این متنِ خودِ حل‌کننده است، نه متنِ ما.';

$ec_lang['lpn_time_speed']='سرعت';
$ec_lang['lpn_time_speed_tip']='اجرا با چه سرعتی پخش شود.';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_menu_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='جست‌وجوی تنظیمات';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='واژه‌ای تایپ کنید تا فقط تنظیماتی که آن را در بر دارند نمایش داده شوند. توضیح‌ها هم جست‌وجو می‌شوند، نه فقط نام‌ها.';
$ec_lang['lpn_settings_no_match']='هیچ تنظیمی آن واژه را در بر ندارد.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='عرض فهرست بخش‌های تنظیمات';
$ec_lang['lpn_rpane_empty']='هنوز چیزی اینجا جای‌گیری نشده است. هر چیزی که به کل پروژه تعلق دارد، در تنظیمات است.';
$ec_lang['lpn_time_settings_open']='تنظیمات زمان';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='بصری‌سازی';
$ec_lang['lpn_settings_sec_map']='نقشه و صفحه';
$ec_lang['lpn_settings_sec_assets']='مقادیر پیش‌فرض برای المان‌های تازه';
$ec_lang['lpn_settings_sec_calculation']='محاسبه';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='مشترک';
$ec_lang['lpn_labels_customer_note']='یک برچسب مشترک مقادیر علامت‌خورده در اینجا را نشان می‌دهد. با همان اندازهٔ متنِ هر برچسب دیگر روی نقشه رسم می‌شود.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='برچسب‌های مشترک فقط تا زمانی که نمای نقشه به همین پهنا یا باریک‌تر باشد رسم می‌شوند. جعبه را خالی بگذارید تا در هر بزرگ‌نمایی رسم شوند. 0 تایپ کنید تا هرگز، در هیچ بزرگ‌نمایی‌ای، برچسب مشترک رسم نشود. اگر این عدد از تنظیم مشابه برای همهٔ برچسب‌ها بزرگ‌تر باشد، اثری ندارد.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='استفاده از نمای کنونی';
$ec_lang['lpn_settings_page']='صفحه';
$ec_lang['lpn_settings_page_note']='در این ماشین‌حساب ذخیره می‌شود، نه در پروژه.';
$ec_lang['lpn_settings_hydraulics']='هیدرولیک';
$ec_lang['lpn_settings_quality']='کیفیت آب';
$ec_lang['lpn_settings_quality_track']='پارامتر کیفیت';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='انتخاب کنید اجرا چه چیزی را در طول لوله‌ها دنبال کند: چه مدت آب در سیستم بوده، از کجا آمده، یا مادهٔ شیمیایی‌ای که هنگام حرکت واکنش می‌دهد. تنها ماده به ضرایب نیاز دارد.';
$ec_lang['lpn_settings_quality_source']='گره ردیاب';
$ec_lang['lpn_settings_quality_source_tip']='گره‌ای که آب آن ردیابی می‌شود. سپس هر گرهٔ دیگر سهم آبی را که از آن گره آمده نشان می‌دهد.';
$ec_lang['lpn_quality_none']='هیچ‌چیز';
$ec_lang['lpn_quality_age']='سن آب';
$ec_lang['lpn_quality_trace']='ردیابی منبع';
$ec_lang['lpn_quality_chemical']='مادهٔ شیمیایی‌ای که واکنش می‌دهد';
$ec_lang['lpn_quality_needs_run']='کیفیت آب همراه با حرکت آب در طول لوله‌ها منتقل می‌شود، پس به یک شبیه‌سازی بازهٔ زمانی نیاز دارد: موتور EPANET و یک کل مدت اجرا. یک کل مدت اجرا زیر زمان تعیین کنید، سپس دکمهٔ محاسبه را بزنید.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='مادهٔ شیمیایی و واحدها';
$ec_lang['lpn_quality_chemical_name_tip']='نام مادهٔ شیمیایی و واحدهایی که غلظت‌های آن با آن‌ها نوشته می‌شوند: برای مثال، Chlorine mg/L را به‌صورت یک ورودی بنویسید. این یک برچسب است. EPANET یک غلظت را تبدیل نمی‌کند، پس هر غلظت و هر ضریب در این پروژه باید از پیش با همین واحدها نوشته شده باشد.';
$ec_lang['lpn_quality_mass_units']='واحدهای جرم';
$ec_lang['lpn_quality_mass_units_tip']='نیمهٔ واحدهای ورودی کیفیت، دو گزینهٔ خودِ EPANET.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='رواداری کیفیت';
$ec_lang['lpn_quality_tolerance_tip']='دو محمولهٔ آب همسایه چقدر می‌توانند در غلظت فرق داشته باشند پیش از آنکه EPANET آن دو را یکی به‌شمار آورد. خالی بودن یعنی استفاده از پیش‌فرض خودِ EPANET که 0.01 است.';
$ec_lang['lpn_quality_diffusivity']='نفوذپذیری نسبی';
$ec_lang['lpn_quality_diffusivity_tip']='ماده شیمیایی با چه سهولتی در آب پخش می‌شود، نسبت به کلر. خالی بودن یعنی استفاده از پیش‌فرض خودِ EPANET که 1.0 است.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='غلظت {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='غلظت میانگین {chemical}';
$ec_lang['lpn_quality_initial']='کیفیت اولیه';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='این گره در آغاز اجرا چقدر از مادهٔ شیمیایی را در خود دارد. یک مخزن مقدار خودش را برای کل اجرا نگه می‌دارد، که همان‌گونه است که باقیماندهٔ خروجی از یک تصفیه‌خانه معمولاً بیان می‌شود. آن را خالی بگذارید تا گره بدون هیچ مقداری از مادهٔ شیمیایی شروع کند.';
$ec_lang['lpn_result_concentration']='غلظت';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='چقدر از مادهٔ شیمیایی در این نقطه، پس از طی مسیر و واکنش، باقی مانده است. واحدها همان‌هایی هستند که کنار نام ماده در تنظیمات، کیفیت آب بیان شده‌اند.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='نوع منبع';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='چه نوع دوزی این گره روی آبی که از آن عبور می‌کند اعمال می‌کند. غلظت با آب واردشده به شبکه در این‌جا طوری رفتار می‌کند که گویی به مقدار کیفیت منبع رسیده است. دوز جرمی هر دقیقه مقداری جرم از ماده می‌افزاید، صرف‌نظر از دبی. دوز نقطه‌تنظیم غلظت خروجی از این گره را تا مقدار کیفیت منبع بالا می‌برد و نه بیشتر. دوز متناسب با دبی مقدار کیفیت منبع را به هرچه از پیش در آب هست می‌افزاید.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='هیچ‌کدام';
$ec_lang['lpn_source_type_concen']='غلظت';
$ec_lang['lpn_source_type_mass']='دوز جرمی';
$ec_lang['lpn_source_type_setpoint']='دوز نقطه‌تنظیم';
$ec_lang['lpn_source_type_flowpaced']='دوز متناسب با دبی';
$ec_lang['lpn_source_quality']='کیفیت منبع';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='دوز چقدر قوی است. برای همهٔ انواع به‌جز دوز جرمی، این یک غلظت است، با واحدهای بیان‌شده کنار نام ماده در تنظیمات، کیفیت آب؛ برای دوز جرمی، این یک جرم از ماده در هر دقیقه است. آن را خالی بگذارید تا چیزی این‌جا افزوده نشود، که با صفر یکی نیست: صفر یعنی تغذیه‌ای در حال کار است که چیزی نمی‌افزاید.';
$ec_lang['lpn_source_pattern']='الگوی منبع';
$ec_lang['lpn_source_pattern_tip']='الگوی زمانی‌ای که دوز را در طول اجرا مقیاس‌بندی می‌کند، برای تغذیه‌ای که ثابت نیست. نداشتن الگو یعنی دوز در هر گام یکسان است.';
$ec_lang['lpn_mixing_model']='مدل اختلاط';
$ec_lang['lpn_mixing_model_tip']='چگونگی مخلوط‌شدن آب موجود در این تانک با آب واردشونده. اختلاط کامل کل تانک را یک‌جا هم می‌زند. اختلاط دو‌محفظه‌ای ابتدا یک منطقهٔ ورودی را پر می‌کند و باقی را عبور می‌دهد. جریان پیستونی FIFO آب را به همان ترتیبی که رسیده عبور می‌دهد. جریان پیستونی LIFO آن را روی هم می‌چیند، پس آخرین آب واردشده اولین آب خارج‌شده است. این انتخاب سن آب و باقیمانده را تغییر می‌دهد و هیچ فشار یا دبی‌ای را تغییر نمی‌دهد.';
$ec_lang['lpn_mixing_mixed']='اختلاط کامل';
$ec_lang['lpn_mixing_2comp']='اختلاط دو‌محفظه‌ای';
$ec_lang['lpn_mixing_fifo']='جریان پیستونی FIFO';
$ec_lang['lpn_mixing_lifo']='جریان پیستونی LIFO';
$ec_lang['lpn_mixing_fraction']='کسر اختلاط';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='سهمی از حجم تانک که منطقهٔ ورودی اشغال می‌کند، بین ۰ و ۱. تنها اختلاط دو‌محفظه‌ای از آن استفاده می‌کند. آن را خالی بگذارید تا کل تانک منطقهٔ ورودی باشد، همان‌چیزی که EPANET فرض می‌کند.';
$ec_lang['lpn_reaction_bulk']='ضریب واکنش حجمی';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='واکنش در بدنهٔ آب، برای هر لوله‌ای که ضریب خودش را ندارد استفاده می‌شود. عددی منفی ماده را تجزیه می‌کند و عددی مثبت آن را افزایش می‌دهد. واکنش مرتبهٔ اول است مگر آن‌که یک فایل واردشدهٔ EPANET مرتبهٔ دیگری را بیان کند، پس ضریب نرخی بر حسب ۱/روز است. جعبهٔ خالی یعنی واکنش حجمی وجود ندارد.';
$ec_lang['lpn_reaction_wall']='ضریب واکنش دیواره';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='واکنش در دیوارهٔ لوله، برای هر لوله‌ای که ضریب خودش را ندارد استفاده می‌شود. عددی منفی ماده را تجزیه می‌کند. واکنش مرتبهٔ اول است مگر آن‌که یک فایل واردشدهٔ EPANET مرتبهٔ دیگری را بیان کند، پس ضریب طولی در روز است، نوشته‌شده در واحد طول پروژه. جعبهٔ خالی یعنی واکنش دیواره‌ای وجود ندارد.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='مخصوص همین لوله. آن را خالی بگذارید تا لوله از ضریب تنظیم‌شده برای کل شبکه در تنظیمات، کیفیت آب استفاده کند.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='ضریب واکنش';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='واکنش در آب نگه‌داشته‌شده در این تانک، به‌صورت نرخی بر حسب ۱/روز. عددی منفی ماده را تجزیه می‌کند و عددی مثبت آن را رشد می‌دهد. آب در یک تانک بسیار بیشتر از هر لوله‌ای می‌ماند، پس این اغلب همان‌جایی است که باقیمانده از دست می‌رود. آن را خالی بگذارید تا تانک از ضریب واکنش حجمی تنظیم‌شده برای کل شبکه در تنظیمات، کیفیت آب استفاده کند.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='واکنش حجمی';
$ec_lang['lpn_reaction_wall_short']='واکنش دیواره';
$ec_lang['lpn_reaction_tank_short']='واکنش';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/روز';
$ec_lang['lpn_reaction_day']='روز';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='مرتبهٔ واکنش تودهٔ آب';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='نمایی که غلظت برای واکنش در بدنهٔ آب به توان آن می‌رسد. هر عدد حقیقی مجاز است. ۱ مقدار پیش‌فرض است و برای بیشتر مدل‌سازی‌های افت کلر به کار می‌رود. ۰ نرخ را از میزان وجود مادهٔ شیمیایی مستقل می‌کند.';
$ec_lang['lpn_reaction_order_tank']='مرتبهٔ واکنش مخزن';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='نمایی که غلظت برای واکنش در آب نگه‌داشته‌شده در یک مخزن به توان آن می‌رسد، جدا از مرتبهٔ واکنش تودهٔ آب تا مخزن بتواند در مرتبه‌ای متفاوت از لوله‌ها واکنش دهد. هر عدد حقیقی مجاز است، و ۱ پیش‌فرض است. EPANET آن را در یک پرونده به‌صورت ORDER TANK بیان می‌کند و در رابط کاربری خودش جعبه‌ای برای آن ندارد.';
$ec_lang['lpn_reaction_order_wall']='مرتبهٔ واکنش دیواره';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='۱ یعنی واکنش دیواره طبق ضریب (یا ضرایب) داده‌شده رخ می‌دهد. ۰ یعنی رخ نمی‌دهد. این یک کلید روشن و خاموش است. مقدار پیش‌فرض ۱ است.';
$ec_lang['lpn_reaction_order_unstated']='بیان‌نشده';
$ec_lang['lpn_reaction_order_zero']='۰، مرتبهٔ صفر';
$ec_lang['lpn_reaction_order_first']='۱، مرتبهٔ اول';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='پتانسیل محدودکننده';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='غلظتی که مادهٔ شیمیایی به‌سوی آن حرکت می‌کند، به‌جای آنکه به سمت صفر تجزیه شود یا بی‌پایان رشد کند. با نزدیک‌شدن آب به آن، واکنش کند می‌شود و همان‌جا متوقف می‌شود. واحدها را یکسان نگه دارید. اگر خالی بماند، محدودیتی وجود ندارد.';
$ec_lang['lpn_reaction_rough_corr']='همبستگی زبری';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='واکنش دیواره را به زبری خودِ هر لوله همبسته می‌کند، به‌طوری‌که لولهٔ زبرتر سریع‌تر واکنش می‌دهد. وقتی تنظیم شود، ضریب دیواره برای هر لوله از زبری همان لوله محاسبه می‌شود، و ضریب دیوارهٔ واحد بالا دیگر به کار نمی‌رود. اگر خالی بماند، به کار نمی‌رود.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='این صفحه ضریب واکنش پیش‌فرضی از خود ارائه نمی‌دهد. آزمون استانداردی برای آن وجود ندارد، و مقادیر میدانی منتشرشده برای یک نوع آب یکسان تا ده برابر باهم تفاوت دارند، پس عددی که این‌جا داده شود به‌عنوان یک توصیه خوانده می‌شود. مقداری را که اندازه‌گیری کرده‌اید یا می‌توانید به آن استناد کنید وارد کنید، یا برای مادهٔ شیمیایی‌ای که واکنش نمی‌دهد جعبه‌ها را خالی بگذارید.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='انرژی';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='گزارش‌ها';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_menu_tip']='پاسخ‌های نهایی‌ای که این صفحه پس از محاسبهٔ یک شبکه تولید می‌کند: هزینهٔ پمپ‌ها چقدر است، سناریوها چگونه با هم مقایسه می‌شوند، و خودِ حل‌کنندهٔ EPANET چه چاپ کرده است.';
$ec_lang['lpn_reports_epanet']='اجرای EPANET';
$ec_lang['lpn_energy_title']='گزارش انرژی پمپ';
$ec_lang['lpn_energy_menu']='انرژی پمپ';
$ec_lang['lpn_energy_menu_tip']='هر پمپ در چه سهمی از اجرا روشن بود، چه توانی می‌کشید و در آخرین شبیه‌سازی بازهٔ زمانی چه هزینه‌ای داشت.';
$ec_lang['lpn_energy_efficiency']='بازده پمپ (درصد)';
$ec_lang['lpn_energy_efficiency_tip']='بازدهٔ سیم‌تا‌آب که برای هر پمپی که منحنی بازدهٔ خودش را ندارد استفاده می‌شود. وقتی چیزی بیان نشود، EPANET از ۷۵ درصد استفاده می‌کند.';
$ec_lang['lpn_energy_price']='قیمت برق';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='هزینهٔ هر کیلووات‌ساعت. این برای هر پمپی که قیمت خودش را ندارد به کار می‌رود. آن را خالی بگذارید تا هر هزینه در گزارش صفر شود.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='هزینهٔ هر کیلووات‌ساعت برای این پمپ. آن را خالی بگذارید تا پمپ قیمت تنظیم‌شده برای کل شبکه در تنظیمات، انرژی را بپردازد.';
$ec_lang['lpn_energy_price_pattern']='الگوی قیمت';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='الگویی که قیمت را در هر گام الگو ضرب می‌کند، که همین‌گونه یک نرخ کم‌مصرف بیان می‌شود. آن را خالی بگذارید تا یک قیمت در طول کل اجرا ثابت بماند.';
$ec_lang['lpn_energy_demand_charge']='هزینهٔ اوج مصرف';
$ec_lang['lpn_energy_demand_charge_tip']='هزینه‌ای که شرکت آب به ازای هر کیلووات از بار اوج موردنیاز پمپ‌های سیستم دریافت می‌کند.';
$ec_lang['lpn_energy_currency']='واحد پول';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='هرچه این‌جا بنویسید کنار هر رقم پولی چاپ می‌شود. این یک برچسب است. قیمت‌ها و هزینه‌ها هرگز تبدیل نمی‌شوند، پس قیمت‌ها را در همان واحد پولی که این‌جا نوشته‌اید بنویسید.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='این صفحه قیمت پیش‌فرضی از خود ارائه نمی‌دهد. هزینهٔ برق به شرکت آب، کشور، ساعت و سال بستگی دارد، پس عددی که این‌جا داده شود به‌عنوان یک توصیه خوانده می‌شود. قیمت را از تعرفهٔ خودتان وارد کنید.';
$ec_lang['lpn_energy_needs_run']='انرژی پمپ، توان انتگرال‌گرفته‌شده در طول اجراست، پس به یک شبیه‌سازی بازهٔ زمانی نیاز دارد: موتور EPANET و یک کل مدت اجرا. یک کل مدت اجرا را در تنظیمات، محاسبه، زمان تعیین کنید، دکمهٔ محاسبه را بزنید، سپس آب، گزارش‌ها، انرژی پمپ را باز کنید.';
$ec_lang['lpn_energy_no_pumps']='این شبکه هیچ پمپی ندارد، پس چیزی برق نمی‌کشد.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='مقایسهٔ سناریوها';
$ec_lang['lpn_scncmp_menu_tip']='همهٔ سناریوهای این پروژه را حل کنید و آن‌ها را کنار هم بخوانید: کمترین فشار و بیشترین سرعت در هر یک.';
$ec_lang['lpn_scncmp_running']='در حال حل همهٔ سناریوها…';
$ec_lang['lpn_scncmp_empty']='هنوز چیزی رسم نشده، پس چیزی برای حل کردن نیست.';
$ec_lang['lpn_scncmp_col_minpressure']='کمترین فشار';
$ec_lang['lpn_scncmp_col_maxvelocity']='بیشترین سرعت';
$ec_lang['lpn_scncmp_at']='{value} در {id}';
$ec_lang['lpn_scncmp_current']='(اکنون باز است)';
$ec_lang['lpn_scncmp_note']='هر سناریو از روی نسخه‌ای از ترسیم حل می‌شود. هیچ‌چیز این‌جا پروژه را تغییر نمی‌دهد، و سناریویی که در آن کار می‌کنید همان‌گونه که بود باقی می‌ماند.';
$ec_lang['lpn_energy_over']='برای شبیه‌سازی بازهٔ زمانی {time}';
$ec_lang['lpn_energy_col_pump']='پمپ';
$ec_lang['lpn_energy_col_running']='٪ از اجرا';
$ec_lang['lpn_energy_col_effic']='بازده';
$ec_lang['lpn_energy_col_avg_kw']='میانگین kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='میانگین توان مصرفی وقتی این پمپ روشن بود. این میانگین بر بازه‌های خاموشی گرفته نمی‌شود، پس پمپی که بخش زیادی از شبیه‌سازی بازهٔ زمانی خاموش بوده باز هم توانی را که هنگام کارکردن مصرف کرده گزارش می‌کند.';
$ec_lang['lpn_energy_col_peak_kw']='اوج kW';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='هزینه';
$ec_lang['lpn_energy_total_kwh']='انرژی مصرف‌شده';
$ec_lang['lpn_energy_total_energy_cost']='هزینهٔ انرژی';
$ec_lang['lpn_energy_peak_kw']='اوج مصرف توان';
$ec_lang['lpn_energy_total_demand_charge']='هزینهٔ اوج مصرف';
$ec_lang['lpn_energy_total_cost']='هزینهٔ کل';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='وضعیت';
$ec_lang['lpn_reports_status_tip']='آنچه در طول واپسین شبیه‌سازی بازهٔ زمانی، به ترتیب زمانی تغییر کرده: باز یا بسته شدن پمپ‌ها و شیرها، پر و خالی شدن تانک‌ها، پر شدن یا خشک شدن آن‌ها، و گام‌هایی که به‌طور کامل همگرا نشدند.';
$ec_lang['lpn_status_title']='گزارش وضعیت';
$ec_lang['lpn_status_needs_run']='گزارش وضعیت آنچه را که در طول یک شبیه‌سازی بازهٔ زمانی تغییر کرده فهرست می‌کند. یک کل مدت اجرا را در تنظیمات، محاسبه، زمان تعیین کنید، محاسبه را بزنید، سپس آب، گزارش‌ها، گزارش وضعیت را باز کنید.';
$ec_lang['lpn_status_empty']='چیزی در طول این اجرا وضعیت خود را تغییر نداد.';
$ec_lang['lpn_status_col_time']='زمان';
$ec_lang['lpn_status_col_event']='رویداد';
$ec_lang['lpn_status_opened']='{type} {id} باز شد';
$ec_lang['lpn_status_closed']='{type} {id} بسته شد';
$ec_lang['lpn_status_filling']='{type} {id} در حال پر شدن است';
$ec_lang['lpn_status_emptying']='{type} {id} در حال خالی شدن است';
$ec_lang['lpn_status_full']='{type} {id} پر است';
$ec_lang['lpn_status_dry']='{type} {id} خالی است';
$ec_lang['lpn_status_no_converge']='راه‌حل هیدرولیکی در این گام به‌طور کامل همگرا نشد؛ عددهای نشان‌داده‌شده واپسین تکرار آن هستند.';
$ec_lang['lpn_status_note']='از همان اجرای بازهٔ زمانی‌ای خوانده می‌شود که برگهٔ جدول‌ها و گزارش کامل از آن می‌خوانند. فقط یک تغییر فهرست می‌شود، نه هر گام.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='کامل';
$ec_lang['lpn_reports_full_tip']='هر گره و هر لوله در هر گام زمانی گزارش‌دهی از واپسین اجرا، به‌صورت یک جدول که می‌توانید دانلود یا چاپ کنید.';
$ec_lang['lpn_full_title']='گزارش کامل';
$ec_lang['lpn_full_needs_run']='گزارش کامل هر گره و هر لوله را در هر گام زمانی گزارش‌دهی فهرست می‌کند. محاسبه را بزنید، سپس آب، گزارش‌ها، گزارش کامل را باز کنید.';
$ec_lang['lpn_full_note']='یک ردیف برای هر گره یا لوله در هر گام زمانی گزارش‌دهی، در واحدهای نشان‌داده‌شده در برگهٔ جدول‌ها. یک سلول خالی یعنی آن ستون آن کمیت را ندارد. دانلود یا چاپ هر گام زمانی را دربر می‌گیرد؛ جدول زیر یکی را در هر زمان نشان می‌دهد.';
$ec_lang['lpn_full_step_label']='گام زمانی';
$ec_lang['lpn_full_download_csv']='دانلود CSV';
$ec_lang['lpn_full_print']='چاپ گزارش';
$ec_lang['lpn_full_col_time']='زمان';
$ec_lang['lpn_full_col_type']='نوع';
$ec_lang['lpn_full_col_id']='شناسه';
$ec_lang['lpn_full_row_count']='{n} ردیف.';
$ec_lang['lpn_energy_no_price']='هیچ قیمتی برای برق بیان نشده، پس هر هزینه این‌جا صفر است. یکی را در تنظیمات، انرژی تعیین کنید.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='این شبکه قیمتی صفر بیان کرده، پس هر هزینه این‌جا صفر است. آن را در تنظیمات، انرژی تغییر دهید.';
$ec_lang['lpn_energy_curve_note']='این پمپ‌ها به یک منحنی بازده بدون هیچ نقطه‌ای ارجاع می‌دهند: {ids}. آن‌ها با بازدهٔ تنظیم‌شده برای کل شبکه کار کردند.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0.000';
$ec_lang['lpn_labels_col_rank']='رتبه';
$ec_lang['lpn_labels_col_drop']='حذف';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='گره و اتصال';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='بازهٔ مساوی';
$ec_lang['lpn_color_mode_quantile']='چندک (تعداد مساوی)';
$ec_lang['lpn_color_mode_jenks']='شکست طبیعی (جنکس)';
$ec_lang['lpn_color_mode_stddev']='انحراف معیار';
$ec_lang['lpn_color_mode_pretty']='زیبا (گرد شده)';
$ec_lang['lpn_color_mode_log']='لگاریتمی';
$ec_lang['lpn_color_mode_pressure']='فشار';
$ec_lang['lpn_color_mode_manual']='دستی';

// ---- LIBRARIES (ROADMAP Tasks 462 and 460) ---------------------------------------------------
// The document has carried patterns, curves and controls since Task 423; nothing on the page could
// see one. This is that interface. Tom, 2026-08-20: "for Water Networks, I think we also need the
// following in a group: Libraries (Patterns, Curves, Controls, Pumps, Pipes, Custom), Settings,
// Simulate, Transport, Time selectors."
//
// ONE NAME, THREE DOORS: the toolbar button, the Edit menu row and the box's own title all read
// this key, exactly as lpn_menu_settings serves the Settings box's three.
// Plural, because it is a shelf of them: a user opens Libraries to reach the patterns, not to reach
// "the library".
$ec_lang['lpn_library_menu']='کتابخانه‌ها';
$ec_lang['lpn_library_menu_tip']='الگوهای مصرف، منحنی‌های پمپ و قواعد کنترل این پروژه را مدیریت کنید.';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='الگوها';
$ec_lang['lpn_library_patterns_tip']='الگو فهرستی از ضریب‌هاست که تکرار می‌شود. هرکدام برای یک گام زمانی الگو به کار می‌رود، پس ۲۴ عدد با گام یک‌ساعته یک روز می‌سازد که تکرار می‌شود. مصرفی برابر ۱۰ با ضریب ۱٫۵، در آن لحظه ۱۵ می‌شود.';
$ec_lang['lpn_library_curves']='منحنی‌ها';
$ec_lang['lpn_library_curves_tip']='یک منحنی فهرستی از نقاط است که می‌گوید چیزی چگونه عمل می‌کند: یک پمپ در هر دبی چقدر هد می‌افزاید، در آن دبی چقدر بازده دارد، یا یک شیر در هر دبی چقدر هد از دست می‌دهد.';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='یک منحنی به یک پروژه تعلق دارد، و یک پمپ یا شیر در ویژگی‌های خودش نشان می‌دهد از کدام‌یک استفاده می‌کند. چند المان می‌توانند از یک منحنی استفاده کنند، و ویرایش آن این‌جا همهٔ آن‌ها را تغییر می‌دهد. برای منحنی هد پمپ، اجرا از منحنی‌ای برازش‌شده از میان نقاط، همان‌گونه که نشان داده شده، استفاده می‌کند؛ برای هر نوع دیگر، نقاط را با خطوط راست به هم وصل می‌کند، همان‌گونه که نشان داده شده.';
$ec_lang['lpn_library_curve_add']='افزودن یک منحنی';
$ec_lang['lpn_library_curve_type_tip']='این منحنی چه چیزی را توصیف می‌کند';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='نوع منحنی';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='معادله';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='منحنی برازش‌شده از میان نقاط، همان خطی که در نمودار زیر رسم می‌شود. این هر بار که نمایش داده می‌شود از روی نقاط محاسبه می‌شود و هرگز ذخیره نمی‌شود، و عددهای آن با واحدهایی هستند که جدول بالا نشان می‌دهد. حل‌کنندهٔ درون‌ساخت با همین معادله کار می‌کند؛ موتور EPANET خودِ نقاط را می‌خواند.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='یک یا دو ستون را در یک صفحهٔ گسترده انتخاب کنید، آن‌ها را کپی کنید، و در اولین سلولی که می‌خواهید در آن قرار گیرند بچسبانید. ردیف‌ها به‌اندازهٔ نیاز افزوده می‌شوند. همچنین می‌توانید خطوطی را که مستقیم از یک فایل EPANET کپی شده‌اند بچسبانید، از جمله نام منحنی.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='توضیح';
$ec_lang['lpn_library_curve_note_tip']='این منحنی چیست، به بیان خودتان. این در فایل EPANET بالای منحنی نوشته می‌شود و از همان‌جا بازخوانی می‌شود.';
$ec_lang['lpn_library_curve_remove_point']='حذف این نقطه';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='کپی نقاط';
$ec_lang['lpn_library_curve_copy_tip']='هر نقطه را به‌صورت دو ستون کپی می‌کند، آماده برای چسباندن در یک صفحهٔ گسترده.';
$ec_lang['lpn_library_curve_copy_manual']='کپی این نقاط';
$ec_lang['lpn_library_curve_used_by']='المان‌هایی که این منحنی را به کار می‌برند';
$ec_lang['lpn_library_curve_unused']='چیزی این منحنی را به کار نمی‌برد.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='این منحنی توسط {count} المان به کار می‌رود: {ids}. نخست آن‌ها را به منحنی دیگری ارجاع دهید، سپس این یکی را حذف کنید.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='انواع لوله';
$ec_lang['lpn_library_pipetypes_tip']='یک نوع لوله تعریفی است که چند لوله می‌توانند برای قطر، زبری و ضرایب واکنش خود به آن ارجاع دهند. ویرایش تعریف، هر لوله‌ای را که از آن استفاده می‌کند ویرایش می‌کند.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='هر پروژه کتابخانهٔ انواع لولهٔ خودش را دارد. می‌توانید ویژگی‌ها را در تعریف یک نوع لوله خالی بگذارید. برای نمونه، نوع لوله‌ای که زبری را مشخص می‌کند و قطری را مشخص نمی‌کند اشکالی ندارد. انواع لوله را در ویرایشگر ویژگی‌های خودشان به لوله‌ها می‌چسبانید. ویرایش یک تعریف در این‌جا هر لوله‌ای را که به آن ارجاع می‌دهد تغییر می‌دهد.';
$ec_lang['lpn_library_pipetype_add']='افزودن یک نوع لوله';
$ec_lang['lpn_library_pipetype_blank_tip']='ویژگی‌های خالی در تعریف یک نوع لوله برای وارد کردن جداگانه برای هر لوله باقی می‌مانند.';
$ec_lang['lpn_library_pipetype_used_by']='لوله‌هایی که از این نوع استفاده می‌کنند';
$ec_lang['lpn_library_pipetype_unused']='چیزی از این نوع لوله استفاده نمی‌کند.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='این نوع لوله را {count} لوله استفاده می‌کند: {ids}. پیش از حذف آن، آن‌ها را از آن جدا کنید.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='نوع لوله';
$ec_lang['lpn_field_pipetype_tip']='نوع لوله در کتابخانهٔ پروژه که این لوله از آن استفاده می‌کند. ویژگی‌های گنجانده‌شده در نوع لوله در این‌جا برای ویرایش غیرفعال‌اند. برای فعال‌کردن ویرایش در این‌جا، نوع لوله را جدا کنید.';
$ec_lang['lpn_pipetype_none']='هیچ نوع لوله‌ای انتخاب نشده';
$ec_lang['lpn_pipetype_detach']='جداکردن از نوع لوله';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='مقادیری را که این لوله از نوع خود می‌خواند در خودِ لوله رونوشت می‌کند و استفاده از آن نوع را متوقف می‌کند. مقادیر لوله هم‌اکنون تغییر نمی‌کند، و از این پس می‌توانید این مقادیر را این‌جا ویرایش کنید.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='اتصالات';
$ec_lang['lpn_library_fittings_tip']='فهرست اتصالات مجموعه‌ای از اتصالات و مقدار هر یک است که چند لوله می‌توانند به آن ارجاع دهند. این‌ها جمع می‌شوند و یک ضریب افت جزئی می‌دهند.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='هر پروژه کتابخانهٔ اتصالات خودش را دارد. یک فهرست اتصالات، اتصالاتی با مقدار برای هر یک دارد، و این‌ها جمع می‌شوند و یک ضریب افت جزئی واحد می‌دهند. هم لوله‌ها و هم انواع لوله می‌توانند به یک فهرست ارجاع دهند.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='اتصالات ارائه‌شده در این‌جا همان سیزده مورد جدول ۳٫۳ از دفترچهٔ راهنمای کاربر EPANET 2.2 هستند. انتخاب یکی، ضریب آن را در ردیف رونوشت می‌کند، جایی‌که می‌توانید آن را تغییر دهید. یک ضریب به اندازه و سازندهٔ اتصال بستگی دارد، پس جدول را نقطهٔ آغاز بدانید نه پاسخ.';
$ec_lang['lpn_library_fittings_add']='افزودن یک فهرست اتصالات';
$ec_lang['lpn_library_fittings_used_by']='لوله‌هایی که از این فهرست اتصالات استفاده می‌کنند';
$ec_lang['lpn_library_fittings_unused']='چیزی از این فهرست اتصالات استفاده نمی‌کند.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='این فهرست اتصالات را {count} لوله استفاده می‌کند: {ids}. پیش از حذف آن، آن‌ها را از آن جدا کنید.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='وارد کردن کتابخانه‌ها…';
$ec_lang['lpn_library_import_tip']='فایل پروژهٔ دیگری را انتخاب کنید و کتابخانه‌های کامل را از آن به این پروژه کپی کنید. هرچه نامش از پیش اینجا گرفته شده باشد نادیده گرفته و فهرست می‌شود، پس چیزی که از پیش دارید تغییر نمی‌کند.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='انتخاب کنید چه چیزی از {file} کپی شود';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='هر کتابخانه‌ای که علامت بزنید به‌طور کامل کپی می‌شود. آنچه بعداً نمی‌خواهید را حذف کنید، همان‌طور که هر ورودی دیگر را حذف می‌کنید.';
$ec_lang['lpn_library_import_go']='وارد کردن';
$ec_lang['lpn_library_import_no_libraries']='آن فایل پروژه کتابخانه‌ای برای کپی کردن ندارد.';
$ec_lang['lpn_library_import_heading']='وارد‌شده از {file}';
$ec_lang['lpn_library_import_added']='کپی‌شده: {names}';
$ec_lang['lpn_library_import_conflict']='نادیده گرفته شد، چون این پروژه از پیش یکی با همین نام دارد: {names}. چیزی اینجا تغییر نکرد. اگر هر دو را می‌خواهید، نام یکی را عوض کنید و دوباره وارد کنید.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='آن فایل پروژه هیچ‌کدام از این‌ها را برای کپی کردن ندارد.';
$ec_lang['lpn_library_import_curve_shape']='این منحنی‌ها دقیقاً همان‌طور که فایل نوشته بود منتقل شدند، و یک اجرا نمی‌تواند از هیچ‌کدام استفاده کند تا وقتی ستون نخست آن‌ها از هر نقطه به نقطهٔ بعدی افزایش یابد: {names}';
$ec_lang['lpn_library_import_needs_fittings']='این نوع‌های لوله به فهرست اتصالاتی ارجاع می‌دهند که این پروژه ندارد: {names}. کتابخانهٔ اتصالات را از همان فایل وارد کنید تا آن را بیابند.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='هشدار: واحدها مطابقت ندارند. همان‌طور که هست وارد خواهد شد. توصیه نمی‌شود.';
$ec_lang['lpn_library_import_units_line']='{name}: این پروژه {mine} نشان می‌دهد، فایل {theirs} نشان می‌دهد.';
$ec_lang['lpn_fitting_qty']='مقدار';
$ec_lang['lpn_fitting_name']='اتصال';
$ec_lang['lpn_fitting_k']='ضریب';
$ec_lang['lpn_fitting_add']='افزودن یک اتصال';
$ec_lang['lpn_fitting_remove']='حذف';
$ec_lang['lpn_fitting_total']='مجموع ضریب افت جزئی (محلی)، k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='فهرست اتصالات';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='فهرستی از اتصالات از کتابخانهٔ پروژه. مقدارها و ضریب‌های آن در ضریب افت جزئی این لوله جمع می‌شوند، و پس‌ازآن جعبهٔ ضریب فقط‌خواندنی می‌شود. برای وارد کردن ضریب به دست خود، این را ناانتخاب بگذارید.';
$ec_lang['lpn_fittings_none']='هیچ فهرست اتصالاتی انتخاب نشده';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='شیر گلوبی، کاملاً باز';
$ec_lang['lpn_fitting_angle']='شیر زاویه‌ای، کاملاً باز';
$ec_lang['lpn_fitting_swingcheck']='شیر یک‌طرفهٔ لولایی، کاملاً باز';
$ec_lang['lpn_fitting_gate']='شیر دروازه‌ای، کاملاً باز';
$ec_lang['lpn_fitting_elbow_short']='زانویی با شعاع کوتاه';
$ec_lang['lpn_fitting_elbow_medium']='زانویی با شعاع متوسط';
$ec_lang['lpn_fitting_elbow_long']='زانویی با شعاع بلند';
$ec_lang['lpn_fitting_elbow_45']='زانویی ۴۵ درجه';
$ec_lang['lpn_fitting_return_bend']='خم برگشتی بسته';
$ec_lang['lpn_fitting_tee_run']='سه‌راهی استاندارد، جریان از مسیر مستقیم';
$ec_lang['lpn_fitting_tee_branch']='سه‌راهی استاندارد، جریان از شاخه';
$ec_lang['lpn_fitting_entrance']='ورودی مربعی';
$ec_lang['lpn_fitting_exit']='خروجی';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='اتصال دیگر';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='{file} ذخیره شد';
$ec_lang['lpn_inp_export_flat_lead']='پروندهٔ EPANET صادرشده از نظر عددی معادل این پروژه است. اما برای موارد زیر جایی ندارد:';
$ec_lang['lpn_inp_export_flat_types']='{n} لوله در این‌جا به {t} نوع لوله ارجاع می‌دهند. در پرونده، هر یک از آن لوله‌ها رونوشت خودِ عددها را حمل می‌کند، پس پاسخ‌ها یکسان‌اند. چیزی که پرونده نمی‌تواند نگه دارد خودِ نوع لوله است، پس ویرایش یک تعریف و پیروی هر لوله از آن، چیزی است که تنها پروندهٔ خودِ پروژهٔ شما آن را ثبت می‌کند.';
$ec_lang['lpn_inp_export_flat_coords']='فایل EPANET یک موقعیت برای هر گره نگه می‌دارد. این سناریو {n} تای آن‌ها را جای دیگری می‌گذارد، و آن‌ها همان موقعیت‌هایی هستند که در فایل می‌آیند. هر سناریوی دیگر موقعیت‌های خودش را تنها در فایل پروژهٔ شما نگه می‌دارد.';
$ec_lang['lpn_inp_export_flat_fittings']='پروندهٔ EPANET نمی‌تواند فهرست زانویی‌ها، شیرها و سه‌راهی‌های پروندهٔ پروژهٔ شما را نگه دارد. ضریب افت جزئی {n} لوله در این‌جا از یک فهرست اتصالات جمع زده شده است. مجموع دقیقاً همان‌طور که هست وارد پرونده می‌شود، پس چیزی دربارهٔ پاسخ‌ها تغییر نمی‌کند.';
$ec_lang['lpn_library_controls']='کنترل‌ها';
$ec_lang['lpn_library_controls_tip']='کنترل یک جمله است که وقتی تراز آب، فشار یا زمانی معین این‌گونه بگوید، یک پیوند را باز یا بسته می‌کند، یا به آن تنظیمی می‌دهد.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='افزودن یک الگو';
$ec_lang['lpn_library_pattern_values']='ضریب‌ها';
$ec_lang['lpn_library_pattern_values_tip']='ضریب‌ها را با فاصله یا ویرگول از هم جدا کنید. اگر یک ستون از یک صفحه‌گسترده دارید، می‌توانید آن را جای‌گذاری کنید. این فهرست تا هر مدتی که اجرا طول بکشد تکرار می‌شود، پس لازم نیست کل اجرا را پوشش دهد.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} ضریب، با فاصلهٔ {step}، پوشش‌دهندهٔ {span}';
$ec_lang['lpn_library_pattern_none']='بدون الگو';
$ec_lang['lpn_settings_default_pattern']='الگوی مصرف پیش‌فرض';
$ec_lang['lpn_settings_default_pattern_tip']='هر گرهی که الگویی ندارد، از همین استفاده می‌کند.';
$ec_lang['lpn_library_control_add']='افزودن یک کنترل';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='یک جمله، با واژه‌هایی که EPANET به کار می‌برد. چهار شکل: LINK 9 OPEN IF NODE 2 BELOW 110، LINK 9 CLOSED IF NODE 2 ABOVE 140، LINK 10 OPEN AT TIME 1، و LINK 12 CLOSED AT CLOCKTIME 3 AM. به‌جای OPEN یا CLOSED می‌توانید عددی بنویسید که تنظیم یک شیر یا سرعت یک پمپ است. کلیدواژه‌ها را به انگلیسی بگذارید؛ همین‌ها هستند که صفحه می‌خواند.';
$ec_lang['lpn_library_control_ok']='✓ فهمیده شد';
$ec_lang['lpn_library_control_bad']='⚠ فهمیده نشد';
$ec_lang['lpn_library_control_missing']='⚠ این شبکه چیزی به نام {id} ندارد';
$ec_lang['lpn_library_rules']='قواعد';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='یک قاعده پاراگرافی کوتاه است که وقتی یک تراز آب، یک فشار، یک دبی یا یک زمان به مقداری که تعیین کرده‌اید برسد، یک اتصال را باز یا بسته می‌کند، یا به آن یک تنظیم می‌دهد. قواعد می‌توانند بیش از یک چیز را هم‌زمان بیازمایند، و می‌توانند بگویند وقتی آزمون شکست بخورد چه باید کرد.';
$ec_lang['lpn_library_rule_add']='افزودن یک قاعده';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='یک قاعده، با واژه‌هایی که EPANET به کار می‌برد، یک بند در هر خط. خط اول آن را نام‌گذاری می‌کند: RULE 1. سپس یک شرط: IF TANK 2 LEVEL BELOW 17.1. سپس چه باید کرد: THEN PUMP 9 STATUS IS OPEN. آخرین خط می‌تواند رتبه‌ای به آن بدهد: PRIORITY 1. برای آزمودن بیش از یک چیز، خطوط AND یا OR بیفزایید، و برای گفتن این‌که وقتی آزمون شکست خورد چه باید کرد، خطوط ELSE بیفزایید. یک شرط می‌تواند LEVEL، HEAD، GRADE، PRESSURE یا DEMAND را روی یک گره، FLOW، STATUS یا SETTING را روی یک اتصال، یا TIME و CLOCKTIME را روی SYSTEM بخواند. عددها را با واحدهایی که این پروژه نشان می‌دهد بنویسید؛ آن‌ها برایتان تبدیل می‌شوند. کلیدواژه‌ها را به انگلیسی بگذارید؛ این‌ها همان چیزی هستند که صفحه و EPANET می‌خوانند.';
$ec_lang['lpn_library_rule_ok']='✓ این قاعده خوانده شد';
$ec_lang['lpn_library_rule_bad']='⚠ این قاعده را نمی‌شد خواند';
$ec_lang['lpn_library_rule_missing']='⚠ این شبکه چیزی به‌نام {id} ندارد';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='مصرف پایه';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='دبی‌ای که این گره در گام زمانی نشان‌داده‌شده برمی‌دارد: هر مصرف پایه ضرب‌شده در الگوی خودش، با هم جمع می‌شوند. این محاسبه می‌شود، نه تایپ، پس با ساعت تغییر می‌کند و قابل ویرایش نیست.';
$ec_lang['lpn_field_demand_pattern']='الگوی مصرف';
$ec_lang['lpn_field_demand_pattern_tip']='مصرف این گره در طول اجرا چگونه بالا و پایین می‌رود. آن را روی «بدون الگو» بگذارید تا گره در عوض از الگوی مصرف پیش‌فرض پروژه پیروی کند.';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='شرح';
$ec_lang['lpn_field_demand_category_tip']='نام یا شرح این دستهٔ مصرف.';
$ec_lang['lpn_demand_add']='افزودن دستهٔ مصرف';
$ec_lang['lpn_demand_add_tip']='دستهٔ مصرف دیگری در این گره اضافه کنید، با مصرف پایه، الگو و شرح خودش. دسته‌ها با هم جمع می‌شوند.';
$ec_lang['lpn_demand_remove']='حذف این مصرف';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='الگوی هد';
$ec_lang['lpn_field_head_pattern_tip']='تراز آب این مخزن در طول اجرا چگونه بالا و پایین می‌رود. هدِ بالا در این الگو ضرب می‌شود.';
$ec_lang['lpn_field_pump_speed']='سرعت نسبی';
$ec_lang['lpn_field_pump_speed_tip']='عدد ۱ یعنی این پمپ با همان سرعتی می‌چرخد که منحنی‌اش اندازه‌گیری شده. عدد ۰٫۹ یعنی همان پمپ کندتر می‌چرخد، که هد و دبی‌ای را که می‌دهد کاهش می‌دهد. یک الگوی سرعت، در طول اجرا، جای این عدد را می‌گیرد.';
$ec_lang['lpn_field_speed_pattern']='الگوی سرعت';
$ec_lang['lpn_field_speed_pattern_tip']='سرعت این پمپ در طول اجرا چگونه بالا و پایین می‌رود. هر ضریب همان سرعت نسبی برای آن بخش از اجراست، و به‌جای مقیاس‌کردن، جایگزین تنظیم سرعت می‌شود، پس ضریب ۰ پمپ را متوقف می‌کند.';

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
$ec_lang['lpn_search_menu']='جست‌وجوی مکان با نام…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='یک شهر، خیابان یا نشانه را با نام بیابید و نقشه را به آن ببرید. بار اول اجازهٔ شما پرسیده می‌شود، چون کلماتی که تایپ می‌کنید به سرویس نام‌مکان OpenStreetMap فرستاده می‌شود.';
$ec_lang['lpn_search_bar']='جست‌وجو با نام…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='جست‌وجو با نام مکان، کلماتی را که تایپ می‌کنید به nominatim.openstreetmap.org می‌فرستد؛ سرویس رایگان نام‌مکانِ بنیاد OpenStreetMap.';
$ec_lang['lpn_search_consent_2']='این سرویسی جداست از تصاویر نقشهٔ خیابان پشت پروژهٔ شما. آن تصاویر فقط می‌گویند کجا را نگاه می‌کنید. یک جست‌وجو می‌گوید چه چیزی تایپ کرده‌اید. سرویس نام‌مکان، کلمات جست‌وجوی شما و نشانی IP شما را دریافت خواهد کرد. ما چیز دیگری نمی‌فرستیم، و از جست‌وجوهای شما هیچ سابقه‌ای نگه نمی‌داریم.';
$ec_lang['lpn_search_consent_3']='آیا اجازه می‌دهید جست‌وجوهای شما را به سرویس نام‌مکان بفرستیم؟';
$ec_lang['lpn_search_consent_4']='اگر پاسخ نه بدهید، بقیهٔ این صفحه دقیقاً مثل الان کار می‌کند، از جمله «برو به یک عرض و طول جغرافیایی». اگر پاسخ بله بدهید آن را به خاطر می‌سپاریم تا دیگر نپرسیم. پاسخ نه اصلاً ذخیره نمی‌شود.';
$ec_lang['lpn_search_refused']='جست‌وجوی نام‌مکان خاموش است، و چیزی فرستاده نشد. هنوز می‌توانید از «برو به یک عرض و طول جغرافیایی» استفاده کنید.';
$ec_lang['lpn_search_prompt']='یک مکان را با نام جست‌وجو کنید. یک شهر، یک خیابان، یک نشانه — برای نمونه: Petaluma, California';
$ec_lang['lpn_search_empty']='یک نام مکان برای جست‌وجو تایپ کنید.';
$ec_lang['lpn_search_working']='در حال جست‌وجو…';
$ec_lang['lpn_search_busy']='یک جست‌وجو در حال اجراست. منتظر پاسخ آن بمانید.';
$ec_lang['lpn_search_choose']='بیش از یک مکان مطابقت دارد. کدام‌یک؟';
$ec_lang['lpn_search_nochoice']='چیزی انتخاب نشد، پس نقشه جابه‌جا نشد.';
$ec_lang['lpn_search_badchoice']='آن یکی از عددهای فهرست نیست.';
$ec_lang['lpn_search_none']='برای آن نام چیزی یافت نشد.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='سرویس نام‌مکان از ما خواسته آهسته‌تر برویم. یک دقیقه صبر کنید و دوباره تلاش کنید.';
$ec_lang['lpn_search_http']='سرویس نام‌مکان با خطا پاسخ داد.';
$ec_lang['lpn_search_timeout']='سرویس نام‌مکان به‌موقع پاسخ نداد. بقیهٔ این صفحه بدون آن هم کار می‌کند.';
$ec_lang['lpn_search_unreadable']='سرویس نام‌مکان چیزی پاسخ داد که این صفحه نتوانست بخواند.';
$ec_lang['lpn_search_offline']='نتوانستیم به سرویس نام‌مکان دسترسی پیدا کنیم. ممکن است آفلاین باشید. بقیهٔ این صفحه بدون آن هم کار می‌کند، از جمله «برو به یک عرض و طول جغرافیایی».';
$ec_lang['lpn_search_toofast']='یک جست‌وجو در ثانیه — این چیزی است که سرویس نام‌مکان اجازه می‌دهد. کمی بعد دوباره تلاش کنید.';
$ec_lang['lpn_search_nofetch']='این مرورگر نمی‌تواند به سرویس نام‌مکان دسترسی پیدا کند.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox این را از بسیاری مجموعه‌داده‌های ارتفاع عمومی می‌سازد، پس کیفیت آن کاملاً به مکان شما بستگی دارد. جایی که یک نقشه‌برداری لیدار ملی وجود دارد، مانند USGS 3DEP در بیشتر ایالات متحده و معادل‌های آن در جاهای دیگر، می‌تواند از یک متر در افق و چند دهم متر در قائم دقیق‌تر باشد. جایی که فقط داده‌های جهانی وجود دارد، حدود 30 متر در افق و چند متر در قائم است. Mapbox به ما نمی‌گوید کدام‌یک را گرفته‌اید. آن را مانند یک نقشهٔ منحنی‌میزان بدانید، نه یک نقشه‌برداری: هر چیزی را که به آن تکیه می‌کنید بررسی کنید.';
$ec_lang['lpn_terrain_consent_1']='پر کردن ترازها، موقعیت هر گرهی را که به تراز نیاز دارد — یعنی عرض و طول جغرافیایی آن — به api.mapbox.com می‌فرستد، تا ارتفاع زمین در آنجا جست‌وجو شود.';
$ec_lang['lpn_terrain_consent_2']='این پرسش، جدا از تصاویر نقشهٔ پشت پروژهٔ شماست. آن تصاویر فقط می‌گویند کجا را نگاه می‌کنید. این موقعیت‌ها خودِ شبکهٔ شماست. Mapbox این مختصات و نشانی IP شما را دریافت خواهد کرد. ما چیز دیگری نمی‌فرستیم: نه نامی، نه لوله‌ای، نه پروژه‌ای. از آن هیچ سابقه‌ای نگه نمی‌داریم، و چیزی روی این دستگاه ذخیره نمی‌شود جز پاسخ شما به همین پرسش.';
$ec_lang['lpn_terrain_consent_3']='آیا اجازه می‌دهید موقعیت گره‌های شما را به Mapbox بفرستیم؟';
$ec_lang['lpn_terrain_consent_4']='اگر پاسخ نه بدهید، بقیهٔ این صفحه دقیقاً مثل الان کار می‌کند، و می‌توانید مانند قبل ترازها را خودتان تایپ کنید. اگر پاسخ بله بدهید آن را به خاطر می‌سپاریم تا دیگر نپرسیم. پاسخ نه اصلاً ذخیره نمی‌شود.';
$ec_lang['lpn_terrain_refused']='ترازها پر نشدند، و چیزی فرستاده نشد. می‌توانید مانند قبل خودتان آن‌ها را تایپ کنید.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='تراز {n} گره از زمین‌نمای Mapbox پر شود؟';
$ec_lang['lpn_terrain_confirm_default_1']='هر گره از قبل ترازی دارد، و {n} تای آن‌ها هنوز روی {v} هستند، که همان ترازی است که یک گرهٔ تازه با آن آغاز می‌کند، نه ترازی که خودتان تایپ کرده باشید.';
$ec_lang['lpn_terrain_confirm_default_2']='تراز آن {n} گره با مقادیر زمین‌نمای Mapbox جایگزین شود؟';
$ec_lang['lpn_terrain_keep']='{k} گره از قبل تراز دارند و دست‌نخورده می‌مانند.';
$ec_lang['lpn_terrain_undo']='یک واگرد (Ctrl-Z) همهٔ آن‌ها را برمی‌گرداند.';
$ec_lang['lpn_terrain_requests']='{n} درخواست به api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='ترازها هم‌اکنون در حال پر شدن هستند. منتظر بمانید.';
$ec_lang['lpn_terrain_offmap']='موقعیت این گره‌ها روی نقشهٔ زمین‌نما نیست، پس چیزی فرستاده نشد.';
$ec_lang['lpn_terrain_too_wide']='این گره‌ها روی بخش بسیار بزرگی از کرهٔ زمین پراکنده‌اند که در یک نوبت خوانده شوند ({n} درخواست کاشی). چیزی فرستاده نشد.';
$ec_lang['lpn_terrain_cancelled']='چیزی تغییر نکرد و چیزی فرستاده نشد.';
$ec_lang['lpn_terrain_nofetch']='این مرورگر نمی‌تواند به سرویس زمین‌نما دسترسی پیدا کند.';
$ec_lang['lpn_terrain_working']='در حال خواندن سطح زمین…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='سرویس زمین‌نما درخواست را رد کرد ({status})، پس هیچ ترازی تغییر نکرد. ممکن است نشانهٔ Mapbox این پایگاه نشانی وبی را که در آن هستید مجاز نداند.';
$ec_lang['lpn_terrain_failed']='نتوانستیم به سرویس زمین‌نما دسترسی پیدا کنیم، پس هیچ ترازی تغییر نکرد. ممکن است آفلاین باشید. بقیهٔ این صفحه بدون آن هم کار می‌کند.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='سرویس زمین‌نما از ما خواسته کندتر کار کنیم (429)، پس هیچ ترازی تغییر نکرد. یک دقیقهٔ دیگر دوباره امتحان کنید.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='سرویس زمین‌نما با خطایی پاسخ داد ({status})، پس هیچ ترازی تغییر نکرد. چیزی در شبکهٔ شما اشکال ندارد.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='هیچ‌یک از آن گره‌ها موقعیتی روی کرهٔ زمین ندارد، پس چیزی فرستاده نشد و هیچ ترازی تغییر نکرد. خواندن سطح زمین به پروژه‌ای در عرض و طول جغرافیایی، یا پروژه‌ای روی فرافکنی‌ای که این صفحه بتواند جای‌گذاری کند، نیاز دارد.';
$ec_lang['lpn_terrain_done']='{n} تراز پر شد.';
$ec_lang['lpn_terrain_missed']='{m} تا خوانده نشدند و هنوز خالی‌اند.';
$ec_lang['lpn_terrain_partial']='{f} کاشی زمین‌نما پاسخ نداد.';
$ec_lang['lpn_terrain_will_ids']='این گره‌ها تراز خواهند گرفت: {ids}';
$ec_lang['lpn_terrain_keep_ids']='آن گره‌ها این‌ها هستند: {ids}';
$ec_lang['lpn_terrain_filled_ids']='این گره‌ها تراز گرفتند: {ids}';
$ec_lang['lpn_terrain_blank_ids']='این گره‌ها هنوز ترازی ندارند: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}، و {n} تای دیگر';

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
$ec_lang['lpn_ff_menu']='تحلیل جریان آتش‌نشانی…';
$ec_lang['lpn_ff_menu_tip']='گره‌ها را یکی‌یکی آزمایش کنید: هرکدام چقدر می‌تواند تحویل دهد درحالی‌که هنوز فشار باقی‌ماندهٔ تعیین‌شدهٔ شما را نگه می‌دارد، و آیا برداشت دبی موردنیاز آنجا چیز دیگری را از حدود خارج می‌کند؟';
$ec_lang['lpn_ff_title']='تحلیل جریان آتش‌نشانی';
$ec_lang['lpn_ff_intro']='از هر گره به‌نوبت خواسته می‌شود جریان آتش‌نشانی را روی مصرفی که از پیش دارد اضافه بردارد. چیزی در پروژهٔ شما تغییر نمی‌کند؛ کل اجرا روی یک نسخه انجام می‌شود.';
$ec_lang['lpn_ff_scope']='گره‌های آزمایش‌شونده';
$ec_lang['lpn_ff_scope_tip']='مجموعه را پیش از اجرا انتخاب کنید. آزمایش هر گره در یک سیستم بزرگ می‌تواند دقیقه‌ها طول بکشد.';
$ec_lang['lpn_ff_scope_all']='همهٔ گره‌ها';
$ec_lang['lpn_ff_scope_selected']='فقط گرهٔ انتخاب‌شده';
$ec_lang['lpn_ff_no_junctions']='این پروژه هنوز گره‌ای ندارد، پس چیزی برای آزمایش نیست.';
$ec_lang['lpn_ff_no_selection']='هیچ گره‌ای انتخاب نشده. یکی را روی نقشه انتخاب کنید، یا همهٔ گره‌ها را آزمایش کنید.';
$ec_lang['lpn_ff_skipped']='{n} المان انتخاب‌شده گره نیستند، پس آزموده نشدند.';
$ec_lang['lpn_ff_required']='جریان آتش‌نشانی موردنیاز';
$ec_lang['lpn_ff_required_tip']='دبی‌ای که مقررات آتش‌نشانی یا مرجع آتش‌نشانی شما در یک هیدرانت لازم می‌داند. هر گره در برابر این عدد آزمایش می‌شود، مگر آن‌که خودش یک جریان آتش‌نشانی موردنیاز داشته باشد.';
$ec_lang['lpn_ff_required_own']='گره‌هایی که خودشان یک جریان آتش‌نشانی موردنیاز دارند، در برابر همان آزمایش می‌شوند. شمار آن‌ها: {n}.';
$ec_lang['lpn_ff_required_node_tip']='جریان آتش‌نشانی موردنیاز در این گرهٔ خاص برای کاربری زمینی که به آن خدمت می‌دهد، بر پایهٔ آیین‌نامهٔ آتش‌نشانی یا مرجع آتش‌نشانی شما. آن را خالی بگذارید تا گره در برابر عدد جعبهٔ تحلیل جریان آتش‌نشانی آزمایش شود.';
$ec_lang['lpn_ff_residual']='فشار باقی‌مانده برای نگه‌داشتن';
$ec_lang['lpn_ff_residual_tip']='فشاری که گره باید هنگام تحویل جریان آتش‌نشانی هنوز نگه دارد. AWWA M31 و NFPA 291 از 20 psi (140 kPa) استفاده می‌کنند.';
$ec_lang['lpn_ff_design']='بررسی طراحی (اثر بر سیستم)';
$ec_lang['lpn_ff_design_tip']='پرسشی جدا از این‌که آیا گره می‌تواند آن دبی را تحویل دهد: با برداشت آن دبی در آن‌جا، آیا چیز دیگری زیر حداقل فشار خود می‌افتد یا از حد سرعت خود فراتر می‌رود؟ انتخاب بررسی آن هیچ محاسبهٔ اضافه‌ای هزینه ندارد.';
$ec_lang['lpn_ff_design_off']='بررسی نشود';
$ec_lang['lpn_ff_design_nodes']='همهٔ گره‌های دیگر';
$ec_lang['lpn_ff_design_all']='همهٔ گره‌های دیگر و همهٔ لوله‌ها';
$ec_lang['lpn_ff_minpressure']='کمترین فشار مجاز در جای دیگر';
$ec_lang['lpn_ff_minpressure_tip']='گره‌ای که درحالی‌که گرهٔ دیگری جریان آتش‌نشانی خود را برمی‌دارد زیر این فشار بیفتد، به‌عنوان یک مشکل طراحی گزارش می‌شود.';
$ec_lang['lpn_ff_maxvelocity']='بیشترین سرعت مجاز';
$ec_lang['lpn_ff_maxvelocity_tip']='لوله‌ای که هنگام برداشت یک جریان آتش‌نشانی بالاتر از این کار کند، به‌عنوان یک مشکل طراحی گزارش می‌شود.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='جریان آتش‌نشانی در خودِ گره برداشت می‌شود. این روشی است که اینجا به کار رفته، و روش معمول است. هیدرانت، لولهٔ جانبی آن و نازل آن مدل نمی‌شوند، پس یک هیدرانت واقعی کمتر از جریانی که اینجا نشان داده شده تحویل می‌دهد.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='این با حل‌کنندهٔ درون‌ساخت محاسبه می‌شود.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='این با موتور EPANET محاسبه می‌شود.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='جریان آتش‌نشانی موجود یک جستجوست، پس کل شبکه برای هر گرهٔ آزمایش‌شده حدود شانزده بار حل می‌شود. یک سیستم بزرگ دقیقه‌ها طول می‌کشد. می‌توانید هر زمان آن را متوقف کنید و آنچه را که تا آن‌جا محاسبه کرده نگه دارید.';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='فقط گام زمانیِ اکنون روی صفحه آزمایش می‌شود. جریان آتش‌نشانی معمولاً روی مصرف حداکثر روز آزمایش می‌شود، پس پیش از اجرا شبکه را در آن شرایط تنظیم کنید.';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='اجرای جریان آتش‌نشانی';
$ec_lang['lpn_ff_calculate']='اجرا';
$ec_lang['lpn_ff_stop']='توقف';
$ec_lang['lpn_ff_working']='در حال کار: {done} از {total} گره.';
$ec_lang['lpn_ff_stopped']='پس از {done} از {total} گره متوقف شد. نتایج زیر آن‌هایی هستند که از پیش تمام شده‌اند.';
$ec_lang['lpn_ff_cost']='این اجرا کل شبکه را {solves} بار حل کرد.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='ترسیم تغییر کرد، پس نتایج جریان آتش‌نشانی پاک شدند. آن را دوباره اجرا کنید.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='پاک کردن حلقه‌ها';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} گره چیزی اشتباه نداشتند. {fire} گره در جریان آتش‌نشانی رد شدند. {design} گره روی بقیهٔ سیستم اثر گذاشتند.';
$ec_lang['lpn_ff_summary_error']='{n} گره نتوانستند پاسخ داده شوند.';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='هر گرهٔ آزمایش‌شده';
$ec_lang['lpn_ff_col_junction']='گره';
$ec_lang['lpn_ff_col_static']='فشار استاتیک';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='فشار در این گره پیش از برداشت هر جریان آتش‌نشانی، درحالی‌که مصرف‌های معمولی سیستم هنوز در جریان‌اند. برای اندازه‌گیری آن چیزی بسته نمی‌شود، پس این فشار در دبی صفر برای کل سیستم نیست؛ همان فشاری است که نقشه در این گره نشان می‌دهد. هر دوی AWWA M31 و NFPA 291 این خوانش را فشار استاتیک می‌نامند، و همان‌جاست که یک آزمون جریان آتش‌نشانی آغاز می‌شود.';
$ec_lang['lpn_ff_col_available']='دبی موجود';
$ec_lang['lpn_ff_col_required']='دبی موردنیاز';
$ec_lang['lpn_ff_col_residual']='باقی‌ماندهٔ نگه‌داشته';
$ec_lang['lpn_ff_col_atrequired']='فشار در دبی موردنیاز';
$ec_lang['lpn_ff_col_affected']='بدترین اثر';
$ec_lang['lpn_ff_col_limit']='حد طراحی';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='بررسی‌نشده';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='استاتیک رد شد، پس بررسی نشد';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='حالت‌های خرابی';
$ec_lang['lpn_ff_mode_fire']='آتش‌نشانی';
$ec_lang['lpn_ff_mode_design']='طراحی';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='هیچ‌کدام';
$ec_lang['lpn_ff_col_solves']='اجراها';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_pressure']='فشار';
$ec_lang['lpn_ff_limit_velocity']='سرعت';
$ec_lang['lpn_ff_limit_both']='فشار و سرعت';
$ec_lang['lpn_ff_atleast']='بیش از {flow}';
$ec_lang['lpn_ff_affect_node']='{id} به {pressure} می‌افتد';
$ec_lang['lpn_ff_affect_link']='{id} به {velocity} می‌رسد';
$ec_lang['lpn_ff_more']='و {n} تای دیگر اثر گرفتند';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='{n} گرهٔ دیگر نشان داده نمی‌شوند.';
$ec_lang['lpn_ff_design_none']='هیچ‌چیز در مجموعهٔ انتخاب‌شده، هنگامی‌که هر گره جریان آتش‌نشانی خود را برمی‌داشت، از حدود خود خارج نشد.';
$ec_lang['lpn_ff_design_off_note']='اثر بر بقیهٔ سیستم در این اجرا بررسی نشد.';
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
$ec_lang['lpn_ff_iso']='دفتر خدمات بیمه (ISO) برای یک هیدرانت تنها حداکثر {flow} را به رسمیت می‌شناسد. آن حد در این‌جا اعمال نشده چون نمی‌دانیم یک گره می‌تواند نمایندهٔ چند هیدرانت باشد.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='از پیش، پیش از برداشت هر جریان آتش‌نشانی، زیر باقی‌مانده است';
$ec_lang['lpn_ff_err_converge']='شبکه همگرا نشد.';
$ec_lang['lpn_ff_err_solve']='حل‌کننده خطایی گزارش کرد و پاسخی نداد.';
$ec_lang['lpn_ff_err_not_junction']='گره نیست';
$ec_lang['lpn_ff_err_unknown']='پاسخی نیست. کد گزارش‌شده {code} بود.';

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
$ec_lang['lpn_file_import_survey']='وارد کردن نقاط نقشه‌برداری‌شده…';
$ec_lang['lpn_file_import_survey_tip']='فهرستی از نقاط نقشه‌برداری‌شده را از یک فایل متنی می‌خواند و در هر نقطه یک گره می‌سازد، و برای هرچه فایل نگفته از تنظیمات المان تازه استفاده می‌کند. هیچ لوله‌ای رسم نمی‌شود، و هیچ ردیفی بدون نام‌گذاری کنار گذاشته نمی‌شود. دستگاه مختصاتی را که این پروژه از پیش استفاده می‌کند می‌خواند، چه جای‌گذاری جغرافیایی شده باشد چه نشده.';
$ec_lang['lpn_survey_read_error']='آن فایل نتوانست از دیسک شما خوانده شود.';
$ec_lang['lpn_survey_cancelled']='چیزی ساخته نشد و چیزی تغییر نکرد.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='شمالی';
$ec_lang['lpn_survey_axis_east']='شرقی';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='آن فایل چیزی در خود ندارد.';
$ec_lang['lpn_survey_err_unreadable']='آن فایل نتوانست به‌صورت فهرست نقاط نقشه‌برداری‌شده خوانده شود.';
$ec_lang['lpn_survey_err_ambiguous_coord']='بیش از یک ستون در آن فایل می‌تواند {axis} باشد ({detail})، و این صفحه میان آن‌ها انتخاب نمی‌کند. یکی از آن‌ها را با نام {axis} بگذارید و دوباره امتحان کنید.';
$ec_lang['lpn_survey_err_no_points']='حتی یک ردیف از آن فایل نتوانست به‌صورت یک نقطهٔ نقشه‌برداری‌شده خوانده شود. ردیف‌های خوانده‌شده: {detail}';
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
$ec_lang['lpn_survey_format_label']='قالب فایل:';
$ec_lang['lpn_survey_format_internal']='تعیین‌شده درونی';
$ec_lang['lpn_survey_create']='ساخت گره‌ها';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='خط نخست نادیده گرفته شد: هیچ ستونی که این صفحه بشناسد نام نمی‌برد.';
$ec_lang['lpn_survey_type_label']='نوع المان:';
$ec_lang['lpn_survey_confirm_junction']='{n} گره یافت شد. ادامه یابد؟';
$ec_lang['lpn_survey_confirm_reservoir']='{n} مخزن یافت شد. ادامه یابد؟';
$ec_lang['lpn_survey_confirm_tank']='{n} تانک یافت شد. ادامه یابد؟';
$ec_lang['lpn_survey_report_junction']='{n} گره وارد شد، {m} تای آن‌ها با تراز.';
$ec_lang['lpn_survey_report_reservoir']='{n} مخزن وارد شد، {m} تای آن‌ها با تراز.';
$ec_lang['lpn_survey_report_tank']='{n} تانک وارد شد، {m} تای آن‌ها با تراز.';
$ec_lang['lpn_survey_report_clean']='هر نقطهٔ فایل منتقل شد، و چیزی در راه ورود تغییر نکرد.';
$ec_lang['lpn_survey_report_notes']='خطاها و یادداشت‌های وارد کردن:';
$ec_lang['lpn_survey_sev_error']='خطا';
$ec_lang['lpn_survey_sev_warning']='هشدار';
$ec_lang['lpn_survey_note_line']='خط {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='ستون‌های کمتر از حد لازم برای قالب فایل بالا.';
$ec_lang['lpn_survey_note_coord_missing']='سلول {axis} خالی است.';
$ec_lang['lpn_survey_note_bad_coord']='{axis} به‌صورت عدد خوانده نمی‌شود.';
$ec_lang['lpn_survey_note_coord_range']='{axis} بیرون از بازه‌ای است که این پروژه اجازه می‌دهد.';
$ec_lang['lpn_survey_note_bad_elev']='تراز غیرعددی. بدون تراز وارد شد.';
$ec_lang['lpn_survey_note_ambiguous_elev']='بیش از یک ستون می‌تواند تراز باشد، پس هیچ‌کدام خوانده نشد.';
$ec_lang['lpn_survey_note_blank_rows']='خط‌های خالی نادیده گرفته شد: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='نام از پیش زودتر در این فایل استفاده شده، نام تازه‌ای داده شد.';
$ec_lang['lpn_survey_note_id_taken']='نام از پیش در پروژه هست، نام تازه‌ای داده شد.';
$ec_lang['lpn_survey_note_id_invalid']='این نام اینجا قابل‌استفاده نیست، نام تازه‌ای داده شد.';
