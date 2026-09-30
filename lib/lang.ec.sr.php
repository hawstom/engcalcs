<?php

// All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='разломак';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/sec';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% пад/хоризонтала';
$ec_lang['u_grade']='пад/хоризонтала';
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
$ec_lang['u_imgd']='имп. MGD';
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
$ec_lang['menu_brand']='HawsEDC Калкулатори';
$ec_lang['menu_main_hydraulics']='Хидраулика';
$ec_lang['menu_help']='Помоћ';
$ec_lang['menu_libre']='Слободни софтвер';
$ec_lang['template_welcome']='Оставите страхове за вратима; овде је љубав наш језик. Не кварите све. Уживајте и у <a target="_blank" href="https://hawsedc.com/download.php">бесплатним HawsEDC AutoCAD алатима</a>.';
$ec_lang['template_feedback']='Можете ли предложити бољу формулацију овог текста или нешто друго? Желите ли да помогнете или да научите да правите овакве алате? Јавите ми се.';
$ec_lang['template_printable_title']='Наслов за штампу';
$ec_lang['template_printable_subtitle']='Поднаслов за штампу';
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
$ec_lang['consent_body']='Можемо ли да сачувамо по једну цифру за сваку страницу у складишту овог профила прегледача, како бисмо избегли да поновно бележимо њене посете?';
$ec_lang['consent_accept']='Прихвати ово';
$ec_lang['consent_accept_all']='Прихвати трајно';
$ec_lang['consent_decline']='Одбиј трајно';
$ec_lang['consent_current_granted']='Дозволили сте ово. Ограничавамо бележење за овај профил прегледача.';
$ec_lang['consent_current_denied']='Одбили сте ово. Не чувамо ништа, чиме ограничавамо бележење за овај профил прегледача.';
$ec_lang['consent_region_label']='Ваш избор о ограничавању бележења.';
$ec_lang['consent_settings_link']='Подешавања колачића';
$ec_lang['privacy_link']='Обавештење о приватности';
$ec_lang['terms_link']='Услови коришћења';
$ec_lang['index_main_title']='Бесплатни онлајн инжењерски калкулатори';
$ec_lang['index_meta_desc_plain']='Бесплатни хидротехнички калкулатори за цеви, канале, преливе и наводњавање. Раде директно у прегледачу, доступни су и без интернета, на 27 језика.';
$ec_lang['calc_set_units']='Подеси јединице:';
$ec_lang['calc_set_units_tip']='Поставља јединицу сваког поља одједном. Ненаметно: бројеви које сте уписали остају потпуно исти, само се сада читају у новој јединици. 6 остаје 6, али сада значи 6 инча уместо 6 милиметара.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Врати подразумеване вредности';
$ec_lang['calc_defaults_confirm']='Повратити калкулатор на подразумеване вредности?';
$ec_lang['points_data_note']='(или Копирај/Налепи помоћу поља за податке)';
$ec_lang['points_data_heading']='Подаци тачака<br />(одвојени зарезом или табулатором)';
$ec_lang['points_data_copy']='Копирај';
$ec_lang['points_data_paste']='Налепи';
$ec_lang['calc_inputs']='Улазне вредности';
$ec_lang['calc_results']='Резултати';
$ec_lang['view_hide_line']='Сакриј овај ред';
$ec_lang['view_printable']='Верзија за штампу (освежите страницу да бисте вратили)';
$ec_lang['ec_name_label']='Сачувајте овај прорачун:';
$ec_lang['ec_name_placeholder']='Назив';
$ec_lang['ec_name_tip']='Чува унете вредности у URL адресу за обележавање, преузимање из историје и дељење';
$ec_lang['calc_copy_link']='Копирај линк';
$ec_lang['ec_related_calcs']='Слични калкулатори:';
$ec_lang['calc_copy_link_done']='Копирано!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Губитак напора у цевима по Darcy-Weisbachу';
$ec_lang['dw_main_title']='Бесплатни онлајн калкулатор губитка напора у цевима по Darcy-Weisbachу';
$ec_lang['dw_main_desc']='Губитак напора у цевима по Darcy-Weisbachу при задатом пречнику, храпавости и протоку';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Апсолутна храпавост зида цеви, e. Типичне вредности: челик (нов) 0,046 мм, челик (коришћен) 0,15 мм, HDPE 0,003 мм, PVC/uPVC 0,0015 мм, бетон 0,3–3 мм.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s за чисту воду на 20°C">Кинематичка вискозност, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Кинематичка вискозност, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s за чисту воду на 20°C';
$ec_lang['dw_reynolds_number']='Рејнолдсов број, Re';
$ec_lang['dw_flow_regime']='Режим течења';
$ec_lang['dw_regime_laminar']='ламинарно';
$ec_lang['dw_regime_transitional']='прелазно';
$ec_lang['dw_regime_turbulent']='турбулентно';
$ec_lang['dw_friction_factor_method']='Метод фактора трења';
$ec_lang['dw_friction_factor']='Фактор трења, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Губитак напора у цевима по Hazen-Williamsу';
$ec_lang['hw_main_title']='Бесплатни онлајн калкулатор губитка напора у цевима по Hazen-Williamsу';
$ec_lang['hw_main_desc']='Губитак напора у цевима по Hazen-Williamsу при задатом пречнику, храпавости и протоку';
$ec_lang['hw_hgl_1']='Низводна HGL';
$ec_lang['hw_hgl_2']='Узводна HGL';
$ec_lang['hw_elev_up']='Узводна кота';
$ec_lang['hw_pressure_up']='Узводни притисак';
$ec_lang['hw_elev_down']='Низводна кота';
$ec_lang['hw_pressure_down']='Низводни притисак';
$ec_lang['hw_pressure_check']='Провера притиска';
$ec_lang['hw_pressure_ok_short']='Позитиван притисак';
$ec_lang['hw_pressure_neg_short']='Негативан притисак';
$ec_lang['hw_pressure_neg']='Низводни притисак је испод нуле. Хидраулична линија напора (HGL) пада испод цеви, тако да цев не би текла пуна и овај резултат можда није валидан.';
$ec_lang['hw_roughness']='Hazen-Williams коефицијент, C';
$ec_lang['hw_note_1']='<dl><dt>Овај калкулатор не моделира профил цеви између два краја.</dt><dd>Користи само узводну и низводну коту које унесете. Ако терен негде између та два краја расте изнад било ког од њих, притисак у тој највишој тачки биће нижи од сваког овде приказаног притиска. Покрените калкулатор поново за дужину од узводног краја до те највише тачке да бисте је проверили.</dd><dd>Тамо где хидраулична линија напора (HGL) падне испод цеви, вода је под негативним притиском. Ваздух излази из раствора, танкозидна цев може да се сплошти, а загађена подземна вода може бити увучена кроз спојеве. Одржавајте позитиван притисак дуж целе линије и размотрите уградњу вентила за одзрачивање на свакој највишој тачки.</dd><dt>Узводни притисак је гранични услов који сами уносите.</dt><dd>Очитајте га са манометра, са нивоа воде у резервоару (висина воде изнад цеви) или са криве пумпе. Пумпа даје мањи притисак како проток расте, па користите тачку на кривој која одговара горе унетом протоку.</dd><dt>Сами саберите коефицијенте локалних (минорних) губитака.</dt><dd>Саберите K вредности за сваки вентил, колено, рачву, водомер и улаз на линији и унесите тај збир. Пратите везу уз то поље за типичне вредности. На дугом транспортном цевоводу ови губици су мали у поређењу са трењем, али у кратком цевоводу унутар станице могу представљати већи део укупног губитка.</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='Манингов канал неправилног пресека';
$ec_lang['mi_main_title']='Бесплатни онлајн калкулатор канала неправилног попречног пресека по Manningу';
$ec_lang['mi_main_desc']='Калкулатор равномерног тецања по Manningу за канал неправилног попречног пресека';
$ec_lang['mi_waterSurfaceElevation']='Кота нивоа воде';
$ec_lang['mi_q_617']='<span class="ec-help" title="Композитни проток Q, коришћењем композитног n за сваку регију према Chow 6-17, једнаке брзине">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Тачке попречног пресека';
$ec_lang['mi_groupPoint']='Тачка';
$ec_lang['mi_groupSegment']='Сегмент';
$ec_lang['mi_groupRegion']='Регија';
$ec_lang['mi_station']='Ст.';
$ec_lang['mi_elevation']='Кота';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='R<sub>h</sub>, Q<br />граница<br />регије<br />(Обала)';
$ec_lang['mi_tau']='Смицајни<br />напон<br />дна τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='Комп.<br />n';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='Композитни n';
$ec_lang['mi_notes_1_def']='Овај калкулатор прати HEC-RAS Референтни приручник у израчунавању композитног n регије помоћу Chow 1959, страна 136, једначина 6-17 (не 6-18).';


$ec_lang['mi_notes_2_term']='Камена облога';
$ec_lang['mi_notes_2_def']='Користите калкулатор трапезног канала по Manningу за пројектовање камене облоге. Овај калкулатор је примеренији за природне пресеке.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Проток у цевима по Manningу';
$ec_lang['mpf_main_title']='Бесплатни онлајн калкулатор протока у цевима по Manningу';
$ec_lang['mpf_main_desc']='Манингова формула равномерног течења у цевима при задатом нагибу и дубини';
$ec_lang['mpf_pipe_diameter']='Пречник цеви, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Манингов коефицијент храпавости, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Нагиб трења, S<sub>f</sub></a><span class="ec-help" title="Понекад једнак нагибу цеви. Пратите везу за објашњење (само на енглеском)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Релативна дубина течења, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Проток, Q';
$ec_lang['mpf_flow_tip']='Проток и дубина су израчунати за бесконачно дугачку цев. За унос овог протока у цев можда је потребна већа дубина нивоа воде. Погледајте напомене испод за детаље и туторијал видео.';
$ec_lang['mpf_velocity']='Брзина, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Кинетичка енергија изражена као висина водног стуба, v²/2g">Брзинска висина, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Површина протицајног пресека, A';
$ec_lang['mpf_pipe_area']='Површина цеви, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Релативна површина, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Квашени периметар, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Хидраулички полупречник, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Површинска ширина, T';
$ec_lang['mpf_froude_number']='Фрудов број, Fr';
$ec_lang['mpf_shear_stress']='Просечан напон смицања, τ';
$ec_lang['mpf_full_flow']='Пуни проток, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Однос према пуном протоку, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Ово је проток и дубина унутар <em>бесконачно дугачке</em> цеви.</dt><dd>За унос воде у цев може бити потребна знатно већа дубина нивоа воде. Додајте најмање 1,5 пута брзинску висину да бисте добили дубину нивоа воде или <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">погледајте мој 2-минутни туторијал</a> за стандардна израчунавања нивоа воде на пропусту помоћу <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, бесплатног програма за пропусте Управе за аутопутеве САД (U.S. Federal Highway Administration).</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>Пројектујете санитарну канализацију?</dt><dd>Погледајте <a target="_blank" href="/sewslope.php">табеле минималних падова канализације</a> за цеви од 4 до 96 инча (100 до 2400 mm), дате у m/m, mm/m и процентима, и студију <a target="_blank" href="/peakfact.php">фактора врха за веома мале протоке</a>. Оба су референтна документа само на енглеском језику.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Унесите позитиван циљани Q.';
$ec_lang['mpf_solver_no_solution']='Нема решења: Q премашује капацитет цеви при y/d0 = 93.8% (Qmax = {qmax} у изабраним јединицама).';
$ec_lang['mpf_solve_btn']='Израчунај';
$ec_lang['mpf_solve_for_flow']='за проток, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Губитак напора у цевима по Manningу';
$ec_lang['mphl_main_title']='Бесплатни онлајн калкулатор губитка напора у цевима по Manningу';
$ec_lang['mphl_main_desc']='Манингова формула губитка напора при пуном протоку';
$ec_lang['mphl_pipe_length']='Дужина цеви, L';
$ec_lang['mphl_area']='Површина, A';
$ec_lang['mphl_total_junction_k']='Коефицијент мањег (локалног) губитка, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Коефицијент губитка, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Коефицијент мањег (локалног) губитка, km. Ови губици настају на спојевима цеви, улазима, излазима, луковима и вентилима — израз „мањи” је уобичајен, али обмањујућ; на краткој деоници они могу бити једнаки или чак већи од губитака трењем. Типичне вредности k: оштар улаз (усисни) 0,5, сваки лук од 45° 0,2–0,3, затварач (потпуно отворен) 0,1, лептир вентил 0,2, излаз (у резервоар или атмосферу) 1,0. Саберите све фитинге за укупну вредност km. Подразумевана вредност 2,0 претпоставља један улаз, један излаз и два лука од 45°.';
$ec_lang['mphl_friction_slope']='Нагиб трења';
$ec_lang['mphl_friction_loss']='Губици услед трења, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Мањи (локални) губитак, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Укупни губитак, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='Низводна EGL';
$ec_lang['mphl_egl_2']='Узводна EGL';
$ec_lang['mphl_hgl_egl_tip']='Овај резултат можда није валидан тамо где цев расте изнад хидрауличне линије напора.';
$ec_lang['mphl_note_1']='<dl><dt>Овај калкулатор не моделира профил цеви између два краја.</dt><dd>Ако HGL падне испод горње ивице цеви у било којој тачки, овај прорачун можда није валидан.</dd><dt>За услов отвореног улаза (пропуст), неопходно је проверити услове контроле улаза.</dt><dd>1. Узводна HGL не може бити нижа од узводне коте нормалног течења (нити нижа од цеви!).</dd><dd>2. Ниво воде на пропусту боље је представити узводном EGL него узводном HGL.</dd><dd>3. Погледајте <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">мој 2-минутни туторијал</a> за једноставна стандардна израчунавања нивоа воде на пропусту помоћу <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, бесплатног програма за пропусте Управе за аутопутеве САД (U.S. Federal Highway Administration).</dd><dd>4. Ова страница решава само случај контроле излаза: цев која тече пуна, где ниво воде одређују низводни услови. Пројектовање пропуста подразумева одлуку да ли доминира контрола улаза или контрола излаза, па користите HY-8 кад год је могуће било које од то двоје.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Манингов трапезни канал';
$ec_lang['mtc_main_title']='Бесплатни онлајн калкулатор трапезног канала по Манинговој формули';
$ec_lang['mtc_main_desc']='Манингова формула равномерног тецања у трапезном каналу при задатом паду и дубини';
$ec_lang['mtc_bottom_width']='Ширина дна, b';
$ec_lang['mtc_side_slope_1']='Нагиб бочне стране 1, z<sub>1</sub> (хориз./верт.)';
$ec_lang['mtc_side_slope_2']='Нагиб бочне стране 2, z<sub>2</sub> (хориз./верт.)';
$ec_lang['mtc_channel_slope']='Пад канала, S';
$ec_lang['mtc_flow_depth']='Дубина тецања, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Угао скретања, β</a><span class="ec-help" title="За димензионисање камените насуте конструкције. Пратите везу за шему."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Густина у односу на воду. Типично ≈ 2,65 за дробљени камен.">Релативна густина камена, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Пројектована величина камена, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n из пројектоване величине камена (метод Strickler)';
$ec_lang['mtc_n_blodgett']='n из пројектоване величине камена (метод Blodgett)';
$ec_lang['mtc_n_bathurst']='n из пројектоване величине камена (метод Bathurst)';
$ec_lang['mtc_n_pi']='n из пројектоване величине камена (метод Phillips & Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett насупрот Bathurst';
$ec_lang['mtc_pi_range_check']='P&I провера опсега';
$ec_lang['mtc_pi_ok']='d50 у P&I опсегу';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='Ван опсега';
$ec_lang['mtc_pi_tip']='Екстраполација ван опсега скупа података 0,28–0,36 ft на основу којег је ова једначина изведена — сматрати оквирном провером, а не основом за пројектовање';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="По Isbashu (1936) и округу Maricopa, Аризона, САД.">Потребна величина угаоног камена дна, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="По Isbashu (1936) и округу Maricopa, Аризона, САД.">Потребна величина угаоног камена бочне стране 1, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="По Isbashu (1936) и округу Maricopa, Аризона, САД.">Потребна величина угаоног камена бочне стране 2, D<sub>50</sub> (Isbash & MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Према Maynord, Ruff и Abt (1989). У кривини се камен димензионише за брзину у кривини од 4/3 просечне брзине, према California Division of Highways (1970); сопствена вредност Maynord-a од 1,5 важи за природне канале.">Потребна величина угаоног камена, D<sub>50</sub> (Maynord, Ruff и Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Потребна величина угаоног камена, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Брзина прихватљива за претпоставке равномерног тецања.';
$ec_lang['mtc_vel_low']='Брзина ниска — ризик таложења наноса.';
$ec_lang['mtc_vel_high']='Брзина је висока и можда није реална; проверите ерозију облоге канала, додатну дубину у луковима и губитак енергије на ширењима или препрекама.';
$ec_lang['mtc_iteration_tip']='Изаберите опцију храпавости (препоручује се Blodgett–Bathurst) и опцију величине камена (препоручује се Isbash) за аутоматску итерацију до уједначене величине камена за жељени проток. Погледајте напомене испод за пун опис методе, или унесите сопствену вредност храпавости (пратите везу за смернице) и занемарите величину камена да прескочите итерацију.';
$ec_lang['mtc_note_1']='<dl><dt>Аутоматска итерација пројектовања величине камена и храпавости</dt><dd>Изаберите опцију храпавости (препоручује се Blodgett–Bathurst) и опцију пројектоване величине камена (препоручује се Isbash). Подесите дубину и фактор сигурности величине камена да бисте достигли жељени проток са уједначеном величином камена. Свака промена улазне вредности покреће следеће кораке: 1. Храпавост се израчунава из пројектоване величине камена. 2. Вредност храпавости из изабране методе копира се у поље за храпавост. 3. Израчунавају се проток у каналу и потребна величина камена. 4. Пројектована величина камена се подешава. 5. Понавља се док грешка у пројектованој величини камена не постане врло мала.</dd><dt>Основни калкулатор (без итерације)</dt><dd>Унесите жељену вредност храпавости. Занемарите поље за унос пројектоване величине камена.</dd></dl>';
$ec_lang['mtc_note_2_term']='Провера брзине';
$ec_lang['mtc_note_2_def']='Висока брзина подразумева велику специфичну енергију услед расположивог пада. Та енергија може се брзо изгубити на ширењима, луковима или препрекама. Проверите да ли је то прихватљиво за дато место.';
$ec_lang['mtc_solver_no_solution']='Није пронађено решење за дато Q са овим улазним подацима канала.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Проток преко простог прелива';
$ec_lang['ws_main_title']='Бесплатни онлајн калкулатор протока преко простог ширококрунског прелива';
$ec_lang['ws_main_desc']='Калкулатор протока преко простог ширококрунског прелива';
$ec_lang['ws_weirLength']='Дужина прелива, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Енергија по јединици тежине воде — висина водног стуба, а не притисак">Напор, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Коефицијент прелива, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Напомене';
$ec_lang['ws_notes_we_term']='Једначина прелива';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Проток преко прелива неправилног облика круне';
$ec_lang['wi_main_title']='Бесплатни онлајн калкулатор протока преко сегментираног прелива променљиве дубине и неправилног облика круне';
$ec_lang['wi_main_desc']='Калкулатор протока преко прелива неправилног облика круне';
$ec_lang['wi_weirPoints']='Тачке прелива';
$ec_lang['wi_pondingHeight']='Висина успора';
$ec_lang['wi_incrementalFlow']='Прираштајни проток';
$ec_lang['wi_cumulativeFlow']='Кумулативни проток';
$ec_lang['wi_notes_we_def']='q = ако (length = 0) онда 0 иначе ако (slope=0) онда cw*length*d<sub>0</sub><sup>1.5</sup> иначе cw/(2.5*slope) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) где су d<sub>1</sub> и d<sub>0</sub> увек позитивни или нула';
// Orifice Flow
$ec_lang['or_main_menu']='Проток кроз отвор';
$ec_lang['or_main_title']='Бесплатни онлајн калкулатор протока кроз отвор';
$ec_lang['or_main_desc']='Проток кроз отвор — слободан или потопљен';
$ec_lang['or_shape_circular']='Кружни';
$ec_lang['or_shape_rectangular']='Правоугаони';
$ec_lang['or_diameter']='<span class="ec-help" title="Пречник за кружни; висина за правоугаони отвор">Пречник или висина, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Само за правоугаоне отворе">Ширина, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Дно отвора">Кота дна отвора <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Кота узводног нивоа воде';
$ec_lang['or_twe']='Кота низводног нивоа воде';
$ec_lang['or_cd']='Коефицијент протока, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Кота тежишта';
$ec_lang['or_head']='<span class="ec-help" title="Енергија по јединици тежине воде — висина водног стуба, а не притисак">Ефективни напор, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Површина отвора, A';
$ec_lang['or_regime']='Провера режима отвора';
$ec_lang['or_regime_valid']='Слободно истицање';
$ec_lang['or_regime_submerged']='Потопљени отвор';
$ec_lang['or_regime_submerged_tip']='TWE изнад тежишта — режим отвора и даље важи';
$ec_lang['or_regime_warn']='Изван режима отвора';
$ec_lang['or_regime_warn_tip']='Узводни ниво воде испод темена отвора';
$ec_lang['or_regime_twe_above_hwe']='Проверите улазне вредности';
$ec_lang['or_regime_twe_above_hwe_tip']='Низводни ниво (TWE) изнад узводног нивоа (HWE)';
$ec_lang['or_notes_1_term']='Једначина отвора';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). За слободно истицање: h = HWE − тежиште. За потопљени проток (TWE изнад дна отвора): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Режим отвора';
$ec_lang['or_notes_2_def']='Једначине протока кроз отвор важе када је узводни ниво воде изнад темена (врха) отвора. Када је узводни ниво испод темена, користи се једначина прелива.';
$ec_lang['or_notes_3_term']='Коефицијент протока';
$ec_lang['or_notes_3_def']='C<sub>d</sub> се креће од приближно 0,60 до 0,65 за оштроивичне отворе. Заобљени или увучени улази имају друге вредности. Погледајте <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> или HEC-RAS Хидраулички приручник за смернице.';
$ec_lang['or_notes_4_term']='Потопљеност';
$ec_lang['or_notes_4_def']='Када је TWE изнад дна отвора, калкулатор аутоматски примењује једначину потопљеног отвора са h = HWE − TWE. Када је TWE на нивоу дна или испод њега, претпоставља се слободно истицање и h = HWE − тежиште.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Мала хидроелектрана';
$ec_lang['mhp_main_title']='Бесплатни онлајн калкулатор за малу хидроелектрану';
$ec_lang['mhp_main_desc']='Калкулатор излазне снаге мале хидроелектране проточног типа';
$ec_lang['mhp_gross_head']='Бруто пад, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Пречник напорног цевовода (доводне цеви)">Пречник цевовода, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Дужина, L';
$ec_lang['mhp_efficiency']='Ефикасност постројења, η (0–1)';
$ec_lang['mhp_vel_check']='Провера брзине';
$ec_lang['mhp_hl_check']='Провера губитка напора';
$ec_lang['mhp_hnet']='Нето пад, H<sub>net</sub>';
$ec_lang['mhp_power']='Излазна снага, P';
$ec_lang['mhp_annual_kwh']='P као годишња енергија';
$ec_lang['mhp_vel_low']='Брзина ниска — ризик од таложења наноса и увлачења ваздуха.';
$ec_lang['mhp_vel_high']='Брзина висока — проверите губитке при преласку, расположиву енергију и ризик од водног удара.';
$ec_lang['mhp_vel_ok_short']='У реду';
$ec_lang['mhp_vel_high_short']='Висока';
$ec_lang['mhp_vel_low_short']='Ниска';
$ec_lang['mhp_vel_ok_tip']='Брзина је у ефикасном опсегу за пројектовање цевовода.';
$ec_lang['mhp_hl_ok_tip']='Губитак напора је испод 10% бруто напора. Ова димензија цеви је економична.';
$ec_lang['mhp_hl_warn_tip']='Губитак напора је преко 10% бруто напора. Размотрите већу цев.';
$ec_lang['mhp_hl_bad_tip']='Губитак напора је преко 20% бруто напора. Промените димензије цеви.';
$ec_lang['mhp_notes_1_term']='Губитак напора';
$ec_lang['mhp_notes_1_def']='Укупни губитак h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, где је h<sub>f</sub> = f(L/D)(v²/2g) губитак трењем по Дарси-Вајсбаху, а h<sub>m</sub> = k<sub>m</sub>·v²/2g обухвата улаз, лукове и вентиле. Нето пад H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Брзина';
$ec_lang['mhp_notes_2_def']='Проверите да ли је брзина разумна с обзиром на расположиви пад и цену цевовода. Врло ниска брзина може указивати на предимензионисан пречник; врло висока брзина повећава губитке трењем и ризик од водног удара.';
$ec_lang['mhp_notes_3_term']='Циљни губитак напора';
$ec_lang['mhp_notes_3_def']='Губици у цевоводу (доводној цеви) испод 10% бруто пада генерално су економични. Оптималан однос између цене цевовода и изгубљене снаге обично пада око 4–6% тамо где је цена електричне енергије на високом нивоу.';
$ec_lang['mhp_notes_6_term']='Ефикасност';
$ec_lang['mhp_notes_6_def']='Типична ефикасност постројења η износи 0.70 до 0.85 за Pelton и попречне турбине уобичајене у мало-хидро системима. Користите 0.75 као конзервативну прву процену.';
$ec_lang['mhp_notes_7_term']='Годишња енергија';
$ec_lang['mhp_notes_7_def']='Годишња енергија претпоставља непрекидан рад при пуном протоку (8760 сати/годишње). Стварна производња биће нижа услед сезонских варијација протока, застоја ради одржавања и фактора оптерећења.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Време пражњења базена и резервоара';
$ec_lang['odt_main_title']='Бесплатни онлајн калкулатор времена пражњења базена, акумулације и резервоара (кроз отвор)';
$ec_lang['odt_main_desc']='Време пражњења базена, акумулације или резервоара — излаз кроз отвор, метод конусне запремине';
$ec_lang['odt_h1_elev']='Почетна кота нивоа воде';
$ec_lang['odt_a1']='Почетна површина, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Завршна кота нивоа воде';
$ec_lang['odt_a0']='Површина на нивоу отвора, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Интерполисано из конусног модела на завршној коти">Завршна површина, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Провера завршне коте';
$ec_lang['odt_h2_ok']='Завршна кота изнад врха отвора';
$ec_lang['odt_h2_warn']='Завршна кота на нивоу или испод врха отвора';
$ec_lang['odt_h2_warn_tip']='Врх отвора = тежиште + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Пречник (кружни) или висина (правоугаони)">Пречник отвора, D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Само за правоугаоне">Ширина отвора, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Време пражњења (s)';
$ec_lang['odt_t_min']='Време пражњења (min)';
$ec_lang['odt_t_hr']='Време пражњења (hr)';
$ec_lang['odt_t_day']='Време пражњења (дана)';
$ec_lang['odt_notes_1_term']='Формула';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) даје време пражњења од напора H до отвора. Време пражњења = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), где је H<sub>1</sub> = почетна кота − кота отвора, H<sub>2</sub> = завршна кота − кота отвора.';
$ec_lang['odt_notes_2_term']='Метод';
$ec_lang['odt_notes_2_def']='Метод конусне запремине моделује акумулацију или базен као конусни пресек између почетне површине A<sub>1</sub> на почетном нивоу воде и површине A<sub>0</sub> на коти тежишта отвора. A<sub>2</sub>, површина акумулације на завршној коти, интерполише се из A<sub>1</sub> и A<sub>0</sub> помоћу модела конусног пресека. Време пражњења од почетне до завршне коте једнако је укупном времену пражњења од H<sub>1</sub> до отвора умањеном за преостало време пражњења од H<sub>2</sub> до отвора.';
$ec_lang['odt_h1']='<span class="ec-help" title="Почетна кота нивоа воде минус кота тежишта отвора">Почетни напор, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Максимални проток, Q<sub>max</sub>';
$ec_lang['odt_vol']='Испражњена запремина';
$ec_lang['odt_sketch_start']='Почетак';
$ec_lang['odt_sketch_end']='Крај';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Растојање емитера, S<sub>e</sub>';
$ec_lang['ip_sl']='Растојање латерала, S<sub>l</sub>';
$ec_lang['ip_n_e']='Емитери по латерали, n<sub>e</sub>';
$ec_lang['ip_n_l']='Латерале по зони, n<sub>l</sub>';
$ec_lang['ip_d']='Циљна дубина наводњавања, d';
$ec_lang['ip_a_e']='Површина по емитеру, A<sub>e</sub>';
$ec_lang['ip_pr']='Интензитет наводњавања, PR';
$ec_lang['ip_q_lat']='Проток по латерали, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Проток зоне, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Време наводњавања (сати)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Процеђивање из канала';
$ec_lang['cs_main_title']='Бесплатни онлајн калкулатор губитака процеђивањем из канала и ефикасности транспорта воде';
$ec_lang['cs_main_desc']='Губитак процеђивањем из канала и ефикасност транспорта воде — метода притицаја и отицаја';
$ec_lang['cs_Q_in']='Притицај, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Отицај, Q<sub>out</sub>';
$ec_lang['cs_L']='Дужина деонице, L';
$ec_lang['cs_Q_loss']='Стопа губитка процеђивањем, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Провера мерења';
$ec_lang['cs_pct_loss']='Удео губитка';
$ec_lang['cs_Ec']='Ефикасност транспорта воде, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Оцена ефикасности';
$ec_lang['cs_Vol_day']='Дневни изгубљени обим воде';
$ec_lang['cs_Vol_year']='Годишњи изгубљени обим воде';
$ec_lang['cs_Q_loss_per_L']='Губитак по јединици дужине, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Вредност воде';
$ec_lang['cs_lining_cost']='Трошак облагања';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Циљна ефикасност транспорта воде након облагања; удео 0–1">Циљ облагања, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Површина облоге, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Годишња изгубљена вредност';
$ec_lang['cs_annual_value_recovered']='Годишња опорављена вредност';
$ec_lang['cs_lining_total_cost']='Укупан трошак облагања';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Прост поврат = укупан трошак облагања ÷ годишња опорављена вредност">Период поврата инвестиције <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — процеђивање детектовано';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — нема мерљивог губитка';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — проверите мерења';
$ec_lang['cs_Ec_good']='Добро — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='Прихватљиво — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='Лоше — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='Метода мерења притицаја и отицаја процењује процеђивање мерењем протока на почетку и на крају деонице канала: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. Ефикасност транспорта воде E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. Годишњи обим претпоставља непрекидан рад са пуним протоком; стварни губитак је мањи за сезонске канале или канале с делимичним протоком.';
$ec_lang['cs_notes_2_term']='Оцене ефикасности';
$ec_lang['cs_notes_2_def']='Типични необложени земљани канали: E<sub>c</sub> = 60–80%. Добро одржавани земљани канали: 75–85%. Бетонски обложени канали: 90–98%. Губици процеђивањем изнад 30% притицаја често оправдавају улагање у облагање. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Поврат улагања у облагање';
$ec_lang['cs_notes_3_def']='Унесите вредност воде и трошак облагања у било којој доследно коришћеној валути. Површина облоге = дужина деонице × оквашени обим — оквашени обим попречног пресека канала на измереној дубини протока (ширина дна плус оба оквашена нагиба). Годишња опорављена вредност претпоставља да обложени канал непрекидно достиже циљну E<sub>c</sub>. Стварни период поврата биће дужи за сезонске канале или ако облагање не достигне циљну ефикасност.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, 3. изд. (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='О нама';
$ec_lang['install_main_menu']='Инсталирај';
$ec_lang['install_main_title']='Инсталирај EngCalcs';
$ec_lang['install_main_desc']='Додај на уређај за коришћење без интернета';
$ec_lang['install_intro']='EngCalcs је прогресивна веб апликација (PWA). После инсталације, сви калкулатори раде потпуно без интернета — веза са интернетом није потребна.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Отворите било коју страницу калкулатора у Chrome-у.</li><li>Додирните дугме <strong>⬇ Инсталирај</strong> на горњој траци, или додирните мени прегледача (⋮) и изаберите <strong>Додај на почетни екран</strong>.</li><li>Додирните <strong>Инсталирај</strong> у прозору који се појави.</li><li>EngCalcs се појављује на почетном екрану и ради без интернета.</li>';
$ec_lang['install_now_btn']='⬇ Инсталирај сада';
$ec_lang['install_prompt_unavailable']='Прозор за инсталацију није доступан — уместо тога користите мени прегледача.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Отворите било коју страницу калкулатора у Safari-ју.</li><li>Додирните дугме <strong>Дели</strong> (квадрат са стрелицом нагоре).</li><li>Скролујте надоле и додирните <strong>Додај на почетни екран</strong>.</li><li>Додирните <strong>Додај</strong>. EngCalcs се појављује на почетном екрану.</li>';
$ec_lang['install_ios_note']='На iOS-у, инсталација увек иде преко менија Дели — не постоји аутоматски прозор за инсталацију.';
$ec_lang['install_desktop_heading']='Рачунар (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Отворите било коју страницу калкулатора.</li><li>Кликните на <strong>икону за инсталацију</strong> (⊕ или икона рачунара) у адресној траци прегледача, или отворите мени прегледача и изаберите <strong>Инсталирај EngCalcs…</strong></li><li>Кликните на <strong>Инсталирај</strong>. EngCalcs се отвара као самостални прозор апликације.</li>';
$ec_lang['install_firefox_heading']='Firefox / Остали прегледачи';
$ec_lang['install_firefox_body']='Firefox не подржава инсталацију PWA апликација на рачунару. И даље можете нормално користити све калкулаторе у прегледачу — после прве посете, странице се аутоматски чувају у меморији за коришћење без интернета.';
$ec_lang['install_cached_heading']='Шта се чува у меморији';
$ec_lang['install_cached_body']='Приликом прве инсталације EngCalcs-а, све странице калкулатора и пратећи фајлови (скрипте, стилови) аутоматски се чувају на вашем уређају. После тога, све ради без интернетске везе. Ваш избор језика се памти од последње посете уз интернет.';
$ec_lang['contact_main_menu']='Контакт';
$ec_lang['about_main_title']='О инжењерским калкулаторима HawsEDC';
$ec_lang['about_main_desc']='Мисија, слободни софтвер и доприноси';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Мисија</h3><p>Инжењерски калкулатори HawsEDC постоје да служе инжењерима и теренским радницима широм света — посебно онима који раде у регионима са недостатком воде, ограниченим ресурсима или недовољном покривеношћу услугама. Ови алати су део шире хуманитарне мисије: рећи сваком човеку, на најпрактичнији и најефикаснији могући начин, да је вољен и цењен заувек, да нема ничега чега треба да се боји и да неће упропастити све.</p><p>Калкулатори су средство. Циљ је свет без патње.</p><h3>Слободни софтвер отвореног кода</h3><p>Сав код је објављен под <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0 or later</a> — слободан у смислу слободе. Можете користити, проучавати, мењати и даље дистрибуирати код под истим условима.</p><p>Ово је позив, а не цена. Не постоји плаћени ниво, ни бесплатни ниво који може бити укинут, нити кашњење пре него што код постане ваш. Пуна верзија коју данас видите бесплатна је за свакога, сада и заувек, за коришћење и измену.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Изворни код</h3><p>Пун изворни код јавно је доступан на GitHub-у:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Тамо можете прегледати код, пријавити проблеме или направити fork репозиторијума.</p><h3>Допринос</h3><p>Свака помоћ је добродошла. <a href="contact.php">Контактирајте Tom Haws</a>.</p><ul><li><strong>Преводи:</strong> Предложите боље формулације. Побољшајте или додајте језик.</li><li><strong>Пријаве грешака:</strong> Користите формулар за повратне информације на било којој страници калкулатора, или пријавите проблем на GitHub-у.</li><li><strong>Нови калкулатори:</strong> Идеје за хидротехничке алате који служе теренским радницима и стручњацима за наводњавање су посебно добродошле.</li><li><strong>Хостинг:</strong> Ако можете да поставите огледало ових калкулатора за регион са ограниченом повезаношћу, јавите ми се.</li></ul><h3>Коришћење без интернета</h3><p>Ови калкулатори раде као <strong>прогресивна веб апликација (PWA)</strong>. Посетите било коју страницу калкулатора док сте повезани, и ваш прегледач ће аутоматски сачувати све калкулаторе у кеш меморију. Након тога, сви калкулатори раде без интернета — интернет веза није потребна.</p><p>На Android-у или iOS-у, користите опцију прегледача „Додај на почетни екран" да бисте инсталирали EngCalcs као апликацију на свом уређају. На рачунару потражите икону за инсталацију у адресној траци прегледача.</p><p>Такође можете сачувати сваки појединачни калкулатор помоћу менија прегледача „Сачувај као…" за повремену употребу без интернета.</p><h3>Контакт</h3><p>Tom Haws, хидраулички инжењер и оснивач ових калкулатора.<br />Користите формулар за повратне информације на било којој страници калкулатора, или приступите изворном коду на <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub-у</a>.</p>';
$ec_lang['contactSendMessage']='Пошаљите поруку Тому Хоусу';
$ec_lang['contactYourName']='Ваше име:';
$ec_lang['contactYourEmail']='Ваша е-маил адреса:';
$ec_lang['contactSubject']='Предмет:';
$ec_lang['contact_message']='Порука:';
$ec_lang['contactSpamPrefix']='Пет плус један је';
$ec_lang['contactSpamPostfix']='(Молимо вас напишите речима. 1=jedan 2=dva 3=tri 4=četiri 5=pet 6=šest 7=sedam +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Пошаљи поруку';
$ec_lang['contact_success']='Хвала вам што сте одвојили време да напишете.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Пројектовање Каменог Брзотока (Robinson)';
$ec_lang['rc_main_title']='Бесплатни Онлајн Калкулатор за Пројектовање Каменог Брзотока — Robinson (1998)';
$ec_lang['rc_main_desc']='Димензионисање Каменог Поплочавања за Брзоток — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Пад дна брзотока, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Проток по јединици ширине при улазу у брзоток. За канал са ширином дна B и укупним протоком Q користите q_t = Q / B.">Јединични проток, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Порозност каменог поплочавања, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Густина у односу на воду. Типичан дробљени гранит или базалт ≈ 2,65. Опсег по Robinson: 2,54 до 2,82.">Релативна густина камена, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Стандардна девијација гранулометријског састава. Уједначен камен ≈ 1,25. Опсег по Robinson: 1,15 до 1,47.">Гранулометрија SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="Успор (Hp > yn) је пожељан — смањује ерозију узводно. (USDA)">Нормална дубина у улазном каналу, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Јед. 1 (S0 < 0,10) или Јед. 2 (0,10–0,40). Важи: D50 15–278 мм, S0 0,02–0,40. Ван опсега: екстраполација.">Потребна медијанска величина камена, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Примењена једначина';
$ec_lang['rc_sg_check']='Провера релативне густине';
$ec_lang['rc_SD_check']='Провера гранулометрије SD';
$ec_lang['rc_sg_ok']   ='sg у важећем опсегу';
$ec_lang['rc_sg_ok_tip']='2,54–2,82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg испод опсега Robinson';
$ec_lang['rc_sg_low_tip']='Важећи опсег: 2,54–2,82';
$ec_lang['rc_sg_high'] ='sg изнад опсега Robinson';
$ec_lang['rc_sg_high_tip']='Важећи опсег: 2,54–2,82';
$ec_lang['rc_SD_ok']   ='SD у важећем опсегу';
$ec_lang['rc_SD_ok_tip']='1,15–1,47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD испод опсега Robinson';
$ec_lang['rc_SD_low_tip']='Важећи опсег: 1,15–1,47';
$ec_lang['rc_SD_high'] ='SD изнад опсега Robinson';
$ec_lang['rc_SD_high_tip']='Важећи опсег: 1,15–1,47';
$ec_lang['rc_layer']='Дебљина слоја поплочавања (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Радијус криве гребена (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Дужина лука криве гребена';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Потребна за конструктивну подршку камена брзотока. „Минимална доња вода која настаје услед излазне деонице и отпора низводног канала довољна је да обезбеди стабилност поплочавања у излазној деоници.“ (Robinson)">Дужина излазне плоче (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Манингов коефицијент храпавости у брзотоку, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Део qt који тече кроз поре камена. Остатак qs тече по површини. Подразумевана вредност np = 0,45 за угласти дробљени камен.">Брзина кроз камену мантију, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Јединични проток кроз мантију, q<sub>m</sub>';
$ec_lang['rc_qs']='Површински јединични проток, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Дубина тока изнад површине поплочавања, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="Успор (Hp > yn) је пожељан — смањује ерозију узводно. (USDA)">Преливна висина на улазу, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Провера успора на улазу';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — успор узводно';
$ec_lang['rc_pond_ok_tip']='Успор узводно од улаза у брзоток је пожељан — смањује ерозију узводно. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — нема успора — могућа ерозија на улазу';
$ec_lang['rc_pond_warn_tip']='Нема успора узводно од улаза у брзоток; може доћи до ерозије узводно. (USDA)';
$ec_lang['rc_eq1']='Јед. 1 (S<sub>0</sub> < 0,10) — благи пад';
$ec_lang['rc_eq2']='Јед. 2 (0,10 ≤ S<sub>0</sub> ≤ 0,40) — стрми пад';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0,02 — испод опсега валидације Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0,40 — изнад опсега валидације Robinson';
$ec_lang['rc_notes_1_term']='Једначине за димензионисање камена';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) развили су две емпиријске једначине за медијанску величину поплочавања D<sub>50</sub> на основу пада брзотока и јединичног протока. Једначина 1 се примењује за благе падове (S<sub>0</sub> < 0,10); Једначина 2 се примењује за стрме падове (0,10 ≤ S<sub>0</sub> ≤ 0,40). Обе једначине захтевају q<sub>t</sub> у m²/s и враћају D<sub>50</sub> у mm. Валидирани опсег је 0,02 ≤ S<sub>0</sub> ≤ 0,40.';
$ec_lang['rc_notes_2_term']='Јединични проток';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> је укупни јединични проток при гребену брзотока (укупни проток по јединици ширине). За канал са ширином дна B и укупним протоком Q приближно q<sub>t</sub> ≈ Q / B, или израчунајте из услова критичне дубине при улазу у брзоток.';
$ec_lang['rc_notes_3_term']='Проток кроз камену мантију';
$ec_lang['rc_notes_3_def']='Део укупног протока пролази кроз поре каменог поплочавања (проток кроз мантију q<sub>m</sub>); остатак тече по површини камена (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). Дубина тока d рачуна се Манинговом једначином примењеном на површински проток q<sub>s</sub> са коефицијентом храпавости брзотока n. Подразумевана порозност n<sub>p</sub> = 0,45 типична је за угласти дробљени камен.';
$ec_lang['rc_notes_5_term']='Важећи опсег величине камена';
$ec_lang['rc_notes_5_def']='Једначине су развијене за опсег D<sub>50</sub> од 15 мм до 278 мм. Резултати ван овог опсега су екстраполација и треба их користити са додатном инжењерском пажњом.';
$ec_lang['rc_notes_6_term']='Кота излазне плоче';
$ec_lang['rc_notes_6_def']='Кота врха поплочавања у излазној деоници треба да буде на нивоу или испод коте дна низводног канала. Ако је виша, излазни камен ће бити нестабилан.';

$ec_lang['rc_notes_7_def']='Када је нормална дубина у улазном каналу мања од преливне висине (H<sub>p</sub>) потребне за пропуштање q<sub>t</sub>, узводно од улаза у брзоток долази до стешњавања тока или успора. То је генерално прихватљиво — успор смањује брзину и спречава ерозију узводно. Ради провере: користите калкулатор прелива да пронађете H<sub>p</sub> за дате q<sub>t</sub> и ширину гребена, па упоредите са нормалном дубином улазног канала. Ако H<sub>p</sub> премашује нормалну дубину, доћи ће до успора.';
$ec_lang['rc_notes_4_term']='Извор';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. USDA ARS такође објављује <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">Excel табелу</a> засновану на истој методи.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'Филтер';
$ec_lang['rc_sketch_top_crest_curve'] = 'Крива гребена';
$ec_lang['rc_sketch_outlet_apron']    = 'Излазна плоча';
$ec_lang['rc_sketch_radius']          = 'полупречник';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Притисак наводњавања';
$ec_lang['ip_main_title']='Бесплатни онлајн калкулатор притиска и уједначености дистрибуције наводњавања';
$ec_lang['ip_main_desc']='Притисак тестне гране и процена уједначености';
$ec_lang['ip_h_supply']='Притисак напајања';
$ec_lang['ip_elev_supply']='Кота напајања, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Пројектни проток емитера, q<sub>design</sub>';
$ec_lang['ip_h_design']='Пројектни притисак емитера';
$ec_lang['ip_x']='<span class="ec-help" title="0,5 за стандардне емитере без компензације притиска; близу 0 за емитере са компензацијом притиска">Експонент протока емитера, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Путања теста';
$ec_lang['ip_group_reach']='Деоница';
$ec_lang['ip_group_upstream']='Узводно';
$ec_lang['ip_group_downstream']='Низводно';
$ec_lang['ip_group_loss']='Губитак';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Означено: ова деоница је сегмент тестне латерале, из које појединачни емитери узимају воду. Неозначено: ова деоница је магистрала, која само преноси проток ка латералама ван путање теста.">Лат. <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Редови латерале: емитери само у овој деоници. Редови магистрале: укупан број емитера на латералама ОСИМ ове, које се одвајају од ове деонице. За деоницу магистрале која се завршава код тестне латерале, ово укључује и све латерале даље низ магистралу иза те тачке, или које деле исти чвор (нпр. латерала на супротној страни) — и њихов проток се такође одваја од исте деонице.">Емитери <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Кота низводног краја ове деонице. Опционо код унутрашњих редова (подразумевано равно / исто као претходни чвор ако се остави празно). Обавезно у последњем реду: та вредност је кота последњег емитера, која директно одређује потребан притисак напајања.">Низв. кота <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='Кота последњег емитера (последњи ред) остављена је празна и подразумевана као равна — унесите је ради тачног резултата';
$ec_lang['ip_flow']='Проток';
$ec_lang['ip_press']='Прит.';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Укупни губитак деонице, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Низак/негативан притисак — проверите услове испод атмосферског притиска';
$ec_lang['ip_pressure_warn_short']='Низак';
$ec_lang['ip_pressure_high']='Локације са високим притиском захтевају редукцију притиска';
$ec_lang['ip_pressure_high_short']='Висок';
$ec_lang['ip_max_head']='Макс. доз. притисак цеви';
$ec_lang['ip_max_head_tip']='Линије чији притисак прелази ову вредност се означавају. Оставите празно да прескочите проверу високог притиска.';
$ec_lang['ip_h_far']='Притисак последњег емитера';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Проток који улази само у моделирану путању теста — за целу зону/систем, погледајте Q_zone у делу Пројектовање примене испод.">Проток напајања путање теста, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Проток последњег емитера, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Просечан проток емитера (тестна латерала), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="Колико виши (или нижи) процењујете да ради типична латерала у поређењу са овом тестном латералом. Тестна латерала је намерно претпостављени најнеповољнији случај, тако да њен сопствени просек потцењује просек на терену — ако се остави на 0, провера уједначености и бројеви пројектовања примене испод користе сопствени (вероватно оптимистички) просек тестне латерале какав јесте.">Проц. Δпритисак, просек наспрам тестне латерале <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral поново израчунат при притиску сваког реда латерале, увећан за унету разлику притиска изнад — покушај исправке за то што је тестна латерала претпостављени најнеповољнији случај, а не репрезентативан. Улази и у проверу уједначености и у одељак Пројектовање примене испод.">Проц. просечан проток емитера на терену, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Израчунати проток последњег емитера подељен процењеним просечним протоком емитера на терену — ово је приближна процена стандардне равномерности расподеле нижег квартила (просек најниже групе ÷ средња вредност популације); заснована је на малом моделираном узорку и корисничкој процени, а не на пуном статистичком узорку са терена. Вредности једнаке или веће од 1 су могуће и исправне: то само значи да је притисак последњег емитера једнак или виши од процењеног просека на терену, па је неки други емитер тачка најнижег притиска. Ово може бити зато што је последњи емитер на нижем терену, или зато што је процена Δпритиска премала.">Провера уједначености, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='Притисак код тестног емитера ≥ притисак напајања. Ово вероватно није најнеповољнији емитер, или би цеви могле бити мање.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="Ово се разликује од наше приближне процене стандардне мере уједначености.">Проток последњег емитера ÷ пројектни проток, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='Нема решења: потребан притисак напајања премашује унети притисак напајања. Повећајте притисак напајања, смањите потрошњу или користите већу цев.';
$ec_lang['ip_notes_1_def']='Претпоставља притисак код последњег (најудаљенијег) емитера, а затим враћа Енергетску линију уназад ка напајању, деоницу по деоницу, додајући губитке трењем и локалне губитке дуж пута. Кота и брзинска висина се одузимају на сваком чвору да би се пријавио стварни притисак тамо. Претпостављени притисак на далеком крају подешава се (бисекцијом) док се израчунати потребан притисак напајања не поклопи са унетим притиском напајања — исти затворени проблем који решава решавач протока на калкулатору Проток кроз цев по Manningovoj формули, проширен на разгранату мрежу.';
$ec_lang['ip_notes_2_term']='Магистралне наспрам латералних деоница';
$ec_lang['ip_notes_2_def']='Сваки ред представља једну деоницу дуж једне, хидраулички најнеповољније путање (путање теста) од напајања до последњег емитера. Магистрална деоница само преноси проток ка латералама које нису на путањи теста, тако да је њено одузимање проста множина (пројектни проток × укупан број емитера у деоници) — без локалне осетљивости на притисак. Магистрала је заједничка носећа цев, па деоница магистрале која се завршава код тестне латерале мора да укључи не само латерале између сопствених крајева, већ и све латерале даље низ магистралу иза те тачке, или које деле исти чвор (нпр. латерала на супротној страни) — њихов проток пролази кроз ту исту деоницу пре него што се одвоји, без обзира да ли се појављују негде другде у овој табели. Латерална деоница је сегмент саме тестне латерале: проток емитера рачуна се из стварног локалног притиска преко q = k·H<sup>x</sup>, а губитак трењем се умањује Christiansenовим фактором F(n) како би се узело у обзир смањење протока док сваки емитер у деоници узима воду.';
$ec_lang['ip_notes_3_term']='Ограничења';
$ec_lang['ip_notes_3_def']='Моделира један фиксни притисак напајања (без криве пумпе), само једну путању теста (не цело поље), и криву емитера са 2 параметра (поставите експонент близу 0 да бисте приближили емитер са компензацијом притиска). Извештавају се два различита односа уједначености, намерно одвојена: q<sub>last</sub>/q<sub>avg,field</sub> је приближна процена стандардне равномерности расподеле нижег квартила (просек најниже групе ÷ средња вредност популације); али је заснована на малом моделираном узорку и корисничкој процени, а не на стандардном пуном статистичком узорку са терена. Такође, тестна латерала је намерно претпостављени најнеповољнији случај, тако да би њен сирови, неисправљени просек потценио стварни просек на терену и учинио да уједначеност изгледа боље него што јесте; унос Δпритиска постоји управо да би се супротставио тој пристрасности. Вредности уједначености једнаке или веће од 1 су и даље могуће: то само значи да је притисак последњег емитера једнак или виши од процењеног просека на терену, па је неки други емитер тачка најнижег притиска. Ово може бити зато што је последњи емитер на нижем терену, или зато што је процена Δпритиска премала. q<sub>last</sub>/q<sub>design</sub> је другачија провера, која се не тиче уједначености, наспрам произвођачки декларисаног протока — корисна за откривање прекомерно или недовољно притиснутог система у целини, али је то одвојена провера коју треба читати уз број уједначености, пошто пројектни/декларисани проток не зависи од стварног средњег радног притиска система.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. ASAE/ASABE стандарди за пројектовање микронаводњавања користе исти приступ прорачуна губитака трењем за вишеструке изливне тачке.';
$ec_lang['ip_notes_5_term']='Пројектовање примене';
$ec_lang['ip_notes_5_def']='Интензитет наводњавања и проток система/зоне користе процењени просечан проток емитера на терену (q<sub>avg,field</sub> — сопствени просек тестне латерале, исправљен унетом проценом Δпритиска), а не претпостављену вредност: PR = q<sub>avg,field</sub> / A<sub>e</sub>, заснован на исправљеној моделираној вредности. Размак и укупан број латерала/емитера у систему су овде одвојени улази, јер путања теста моделира само једну најнеповољнију грану, а не сваку латералу на терену.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Разграната цевна мрежа';
$ec_lang['bpn_main_title']='Бесплатни онлајн калкулатор притиска у разгранатој цевној мрежи (без петљи)';
$ec_lang['bpn_main_desc']='Проток и притисак у разгранатој (стаблоликој) цевној мрежи';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='Статички напор напајања: напор извора при нултом протоку. Ниво воде у резервоару или цистерни изнад коте напајања, или напор пумпе при затвореном вентилу. Додајте тачке напајања 2 и 3 да бисте дефинисали криву пумпе или променљиву криву напајања; алат очитава напор при пројектном протоку.';
$ec_lang['bpn_elev_source']='Кота напајања';
$ec_lang['bpn_q_total']='Укупан проток';
$ec_lang['bpn_q_total_tip']='Укупан проток који напушта извор (збир свих потрошњи у мрежи).';
$ec_lang['bpn_p_min']='Најнижи притисак';
$ec_lang['bpn_p_min_tip']='Најнижи низводни притисак било где у мрежи; критична тачка испоруке.';
$ec_lang['bpn_method']='Метода трења';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='Цевне линије';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='Назив ове цевне линије. Друге линије је наводе у колони Узводни ID.';
$ec_lang['bpn_upstream']='Узводни ID';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ID линије која напаја ову линију. Оставите празно да следи линију непосредно изнад (обичан серијски цевовод). Унесите ID овде да бисте се одвојили од друге линије.';
$ec_lang['bpn_roughness_tip']='Храпавост цеви за изабрану методу трења: Манингов коефицијент n, Hazen-Williams коефицијент C, или висина храпавости e по Darcy-Weisbachu (дужина). Типична глатка пластична цев: n око 0,009, C око 150, e око 0,0015 mm.';
$ec_lang['bpn_demand']='Потрошња';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Фиксни проток испоручен на низводном крају ове линије. Оставите празно за линију која само преноси проток даље.';
$ec_lang['bpn_demand_mult']='Множилац потрошње';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Скалира потрошњу свих линија истовремено, за прорачун вршног часа или будућег раста. Користите 1 за потрошње унете као што јесу.';
$ec_lang['bpn_elev_down']='Низв. кота';
$ec_lang['bpn_q_line']='Проток линије';
$ec_lang['bpn_q_line_tip']='Укупан проток кроз ову линију: сопствена потрошња плус свака низводна потрошња коју напаја.';
$ec_lang['bpn_p_down']='Низв. прит.';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Манометарски притисак (напор) на низводном чвору ове линије. Негативна вредност (означена) значи притисак испод атмосферског; проверите пројекат.';
$ec_lang['bpn_sketch_heading']='Шема мреже';
$ec_lang['bpn_show_length']='Дужина';
$ec_lang['bpn_show_diameter']='Пречник';
$ec_lang['bpn_show_q']='Проток';
$ec_lang['bpn_show_p']='Притисак';
$ec_lang['bpn_source_label']='Извор';
$ec_lang['bpn_line_problem']='Ова линија није повезана са извором: упућује на непознат узводни ID, упућује на саму себе, понавља ID који већ користи друга линија или формира петљу. Линије које нису повезане остају нерешене.';
$ec_lang['bpn_bad_id_short']='Лош ID';


$ec_lang['bpn_pressure_warn']='Низак/негативан притисак; проверите услове испод атмосферског притиска';
$ec_lang['bpn_pressure_warn_short']='Низак';
$ec_lang['bpn_notes_1_term']='Серијски подразумевано, гранање по изузетку';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='Оставите Узводни ID празним и линија прати ону изнад ње; обичан серијски цевовод. Унесите ID узводне линије да бисте се одвојили од ње. Дакле: серијски подразумевано, стабло када вам затреба.';
$ec_lang['bpn_notes_2_term']='Само разгранате мреже, без петљи';
$ec_lang['bpn_notes_2_def']='Свака линија има тачно једну узводну линију (стабло). Овај алат не решава мреже са петљама; за то су потребне итеративне методе (EPANET или слично). Изостављање петљи је оно што овај алат чини једноставним и тачним.';
$ec_lang['bpn_notes_3_term']='Без активних регулатора притиска';
$ec_lang['bpn_notes_3_def']='Можете додати фиксни вентил локалног губитка (k-вредност), али не и вентиле за смањење или одржавање притиска (PRV/PSV). Њихово отворено/затворено стање зависи од протока и притиска, што би захтевало итерацију.';


$ec_lang['bpn_supply2_q']='Проток напајања 2';
$ec_lang['bpn_supply2_h']='Напор напајања 2';
$ec_lang['bpn_supply3_q']='Проток напајања 3';
$ec_lang['bpn_supply3_h']='Напор напајања 3';
$ec_lang['bpn_supply_pt_tip']='Опционе тачке 2 и 3 криве напајања. Унесите проток и напор за сваку да бисте моделирали пумпу, или било који извор чији напор опада како испоручује више; алат очитава напор при пројектном протоку. Тачка 1 изнад је статички напор при нултом протоку. Оставите 2 и 3 празним за константан напор резервоара.';
$ec_lang['bpn_h_supply']='Напор напајања';
$ec_lang['bpn_h_supply_tip']='Напор извора при пројектном протоку, очитан са криве напајања. Једнак унетом напору извора када је крива равна (резервоар).';
$ec_lang['bpn_show_elevation']='Кота';
$ec_lang['bpn_supply1_h']='Статички напор напајања';
$ec_lang['lpn_main_menu']='Водоводна мрежа';
$ec_lang['lpn_main_title']='Бесплатни онлајн калкулатор водоводне мреже са EPANET решавачем';
$ec_lang['lpn_main_desc']='Анализа водоводне мреже: нацртајте прстенасту цевну мрежу или увезите EPANET датотеке';
$ec_lang['lpn_title_units']='{units} јединице';
$ec_lang['lpn_tool_select']='Избор';
$ec_lang['lpn_tool_add_junction']='Чвор';
$ec_lang['lpn_tool_add_reservoir']='Резервоар';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Тенк';
$ec_lang['lpn_tool_add_pipe']='Цев';
$ec_lang['lpn_tool_add_pump']='Пумпа';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='Вентил';
$ec_lang['lpn_tool_add_text']='Текст';
$ec_lang['lpn_tool_vertices']='Тачке прегиба';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='Потрошач';
$ec_lang['lpn_tool_add_meter_tip']='Кликните где се потрошач налази, а затим кликните на цев или чвор који га опслужује. Потрошња коју унесете за потрошача додаје се чвору на ближем крају те цеви.';
$ec_lang['lpn_mode_add_meter']='Потрошач: кликните где се потрошач налази, а затим кликните на цев или чвор који га опслужује. Или притисните Esc да откажете.';
$ec_lang['lpn_pane_tab_customers']='Потрошачи';
$ec_lang['lpn_customer_heading']='Потрошач {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Потрошња по услузи';
$ec_lang['lpn_field_meter_demand_tip']='Шта свака услуга код овог потрошача захтева. Пронађи и замени може да искористи разлику између празног поља и 0.';
$ec_lang['lpn_field_meter_count']='Број услуга';
$ec_lang['lpn_field_meter_count_tip']='Колико истоветних услуга овај један потрошач представља, тако да четрдесет и два једнопородична прикључка дуж једне магистрале могу бити један симбол на једном месту. Збир испод је потрошња по услузи помножена овим бројем.';
$ec_lang['lpn_field_meter_total']='Укупна потрошња';
$ec_lang['lpn_field_meter_total_tip']='Потрошња по услузи помножена бројем услуга. Ово је број који се додаје чвору наведеном испод.';
$ec_lang['lpn_field_meter_pipe']='Повезани елемент';
$ec_lang['lpn_field_meter_pipe_suggest']='Најближи елемент је {id}. Упишите га овде да бисте овог потрошача опслужили из њега.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Прикључено на';
$ec_lang['lpn_field_meter_node_tip']='Чвор на који је овај потрошач прикључен. Превуците прикључну тачку на цев да бисте га уместо тога опслужили са станице дуж те цеви.';
$ec_lang['lpn_meter_pipe_unknown']='Ништа у овом пројекту се не зове {id}, па је потрошач остављен тамо где је био.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_field_meter_pattern_tip']='Како се потрошња овог потрошача повећава и смањује током прорачуна. Множи укупну потрошњу, па делује на сваку услугу коју овај потрошач представља. Оставите на Нема обрасца да бисте пратили Подразумевани образац потрошње пројекта.';
$ec_lang['lpn_meter_pattern_unknown']='Ниједан образац у овом пројекту се не зове {id}, па је потрошач остављен какав је био.';
$ec_lang['lpn_meter_placed']='Потрошач {id} додат. Његов опис и потрошња се уписују у табели Потрошачи, или га притисните у режиму Избор да отворите његов оквир.';
$ec_lang['lpn_field_meter_pipe_tip']='Елемент на који се ова услуга прикључује. Упишите други овде или у табели Потрошачи да бисте га променили, или превуците прикључну тачку на други елемент.';
$ec_lang['lpn_field_meter_station']='Стационажа дуж цеви (%)';
$ec_lang['lpn_field_meter_station_tip']='Колико далеко дуж цеви се услуга прикључује, изражено као проценат цеви од њеног првог чвора до другог. 0 је на једном крају, а 100 на другом. Кружић на цеви ради исто то показивачем.';
$ec_lang['lpn_field_meter_offset']='Померај од цеви';
$ec_lang['lpn_field_meter_offset_tip']='Позитивна вредност је десно од цеви гледано од њеног првог чвора ка другом. Уписивање вредности овде може преместити потрошача на другу страну магистрале, и увек поставља услужну линију управно на магистралу.';
$ec_lang['lpn_field_meter_lumped']='Додато чвору';
$ec_lang['lpn_field_meter_lumped_tip']='Најближи чвор; потрошње овог потрошача се додају тамо.';
$ec_lang['lpn_node_customers']='Потрошње потрошача';
$ec_lang['lpn_node_customers_tip']='Списак потрошача додатих на овом чвору (јер је он био најближи). Потрошње потрошача се додају осталим потрошњама наведеним овде. Потрошач се уређује тамо где стоји на мапи или у табели Потрошачи.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} од {n} потрошача';
$ec_lang['lpn_customer_detached']='⚠ Овај потрошач није повезан са цеви, па његова потрошња није у резултатима. Обришите га, или нацртајте цев и преместите потрошача на њу.';
$ec_lang['lpn_customer_fixed_head']='⚠ Ближи крај те цеви има фиксну водену површину, па ова потрошња не утиче на прорачун.';
$ec_lang['lpn_customer_detached_count']='{n} потрошача није повезано са цеви. Њихова потрошња није урачуната.';
$ec_lang['lpn_meter_pick_pipe']='Сада кликните на цев или чвор који опслужује овог потрошача. Потрошач остаје тамо где сте га поставили. Притисните Esc да откажете.';
$ec_lang['lpn_inp_export_flat_customers']='EPANET датотека нема потрошаче. Потрошња {n} потрошача у овом пројекту улази у датотеку као ред потрошње на чвору коме је сваки од њих додат, а сваки ред се именује тагом потрошача. Оно што датотека не може да сачува јесте сам потрошач: где стоји, која цев га опслужује, где дуж те цеви се услуга прикључује, и колико услуга један потрошач представља. Ваша сопствена пројектна датотека чува све то.';

$ec_lang['lpn_area_hint_window_start']='Кликните на један угао прозора.';
$ec_lang['lpn_area_hint_window_go']='Кликните на супротан угао да завршите.';
$ec_lang['lpn_area_hint_lasso_start']='Кликните да започнете обрис.';
$ec_lang['lpn_area_hint_lasso_go']='Померајте да нацртате обрис. Кликните да завршите.';
$ec_lang['lpn_area_hint_polygon_start']='Кликните да нацртате полигонску површину. Двоструки клик да завршите.';
$ec_lang['lpn_area_hint_polygon_go']='Кликните сваки угао. Двоструки клик на последњем да завршите.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Држите Shift док бирате да наставите са постојећим избором, додајући или уклањајући (пребацујући) оно што бирате.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Притисните на мапу и превуците око онога што желите, а затим подигните прст.';
$ec_lang['lpn_area_hint_touch_go']='Превуците око онога што желите, а затим подигните прст да завршите.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Прикажи ово';
$ec_lang['lpn_multi_title']='{n} изабрано';
$ec_lang['lpn_multi_varies']='Разноврсно';
$ec_lang['lpn_multi_applied']='Постављено {prop} на {n}.';
$ec_lang['lpn_multi_no_fields']='Ово нема ништа што може заједно да се подеси овде.';
$ec_lang['lpn_pane_pasted']='Налепљено {n} ћелија. {skipped} није промењено.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='Налепљено {n} редова, а {created} од њих додато у мрежу.';
$ec_lang['lpn_pane_pasted_rows_skipped']='Налепљено {n} редова, а {created} од њих додато у мрежу. {skipped} ћелија није промењено.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Кликните овде и налепите редове из табеларног прорачуна да их додате.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Налепи као нове редове на крају табеле';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Притисните Ctrl+V да додате копиране редове на дно ове табеле. Притисните Esc да откажете.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Ово лепљење има {n} редова, а {fit} од њих стаје у табелу. Додати остале {extra} као нове редове на дну?';
$ec_lang['lpn_pane_paste_overflow_add']='Додај {extra} редова';
$ec_lang['lpn_pane_paste_overflow_fit']='Налепи само оних {fit} који стају';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Ово лепљење има {n} редова, а {fit} од њих стаје у табелу. Остали {extra} не могу бити додати као нови редови: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} ID-ова се не поклапа. Ипак налепити?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='Ништа није налепљено. {reasons}';
$ec_lang['lpn_pane_paste_more']='Редова са проблемима који нису приказани овде: {n}.';
$ec_lang['lpn_pane_paste_no_id']='Ред {row}: новом реду је потребан ID.';
$ec_lang['lpn_pane_paste_bad_id']='Ред {row}: ID {id} садржи размак или наводник.';
$ec_lang['lpn_pane_paste_id_taken']='Ред {row}: ID {id} је већ у употреби.';
$ec_lang['lpn_pane_paste_id_twice']='Ред {row}: ID {id} се у овом лепљењу користи двапут.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Ред {row}: новом чвору су потребна оба поља, {first} и {second}.';
$ec_lang['lpn_pane_paste_no_ends']='Ред {row}: новој вези су потребна и Од чвор и До чвор.';
$ec_lang['lpn_pane_paste_no_node']='Ред {row}: чвор {id} још не постоји. Прво налепите чворове, а затим везе.';
$ec_lang['lpn_pane_paste_same_ends']='Ред {row}: Од и До су исти чвор.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Ред {row}: {text} није важећи {col}.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='Ред {row}: новом Тексту су потребна оба поља, {first} и {second}.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='Ред {row}: {id} још није ни чвор ни цев у овој мрежи. Прво налепите то, а затим овај текст.';
$ec_lang['lpn_pane_paste_customer_no_position']='Ред {row}: новом Потрошачу су потребна оба поља, {first} и {second}.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Ред {row}: новом Потрошачу је потребна повезана цев или чвор.';
$ec_lang['lpn_pane_paste_no_pipe']='Ред {row}: цев {id} још не постоји. Прво налепите своје цеви, а затим своје потрошаче.';
$ec_lang['lpn_pane_paste_no_customer_node']='Ред {row}: чвор {id} још не постоји. Прво налепите своје чворове, а затим своје потрошаче.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Ред {row}: чвор {id} нема цев на коју би се потрошач прикачио.';

$ec_lang['lpn_pane_filled']='Попуњено надоле {n} ћелија. {skipped} није промењено.';
$ec_lang['lpn_pane_filldown']='Попуни надоле';
$ec_lang['lpn_pane_fill_none']='Ништа у овом избору не може се попунити надоле.';
$ec_lang['lpn_pane_ctrlenter_filled']='Попуњено {n} ћелија. {skipped} није промењено.';
$ec_lang['lpn_pane_hide_col']='Сакриј ову колону';
$ec_lang['lpn_pane_hide_cols']='Сакриј ове колоне';
$ec_lang['lpn_pane_show_all_cols']='Прикажи све колоне';
$ec_lang['lpn_pane_sort_asc']='Сортирај растуће';
$ec_lang['lpn_pane_manage_cols']='Управљај колонама…';
$ec_lang['lpn_pane_manage_cols_title']='Управљај колонама';
$ec_lang['lpn_pane_manage_cols_show']='Прикажи';
$ec_lang['lpn_pane_manage_cols_up']='Помери горе';
$ec_lang['lpn_pane_manage_cols_down']='Помери доле';
$ec_lang['lpn_pane_manage_cols_top']='Помери на почетак';
$ec_lang['lpn_pane_manage_cols_bottom']='Помери на крај';
$ec_lang['lpn_pane_colmenu_tip']='Сакриј или управљај колонама';
$ec_lang['lpn_pane_sortarrow_tip']='Обрни редослед сортирања';
$ec_lang['lpn_tool_area_window']='Изабери прозор';
$ec_lang['lpn_tool_area_lasso']='Изабери ласо';
$ec_lang['lpn_tool_area_polygon']='Изабери полигон';
$ec_lang['lpn_tool_delete']='Обриши';
$ec_lang['lpn_tool_zoom_extent']='Уклопи у приказ';
$ec_lang['lpn_tool_zoom_window']='Увећај подручје';
$ec_lang['lpn_zoom_in']='Увећај';
$ec_lang['lpn_zoom_out']='Умањи';
$ec_lang['lpn_new_text']='Текст';
$ec_lang['lpn_field_text_bold']='Подебљан текст';
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
$ec_lang['lpn_field_text_anchor']='Прикачено на';
$ec_lang['lpn_field_text_align']='Хоризонтално поравнање';
$ec_lang['lpn_field_text_align_left']='Лево';
$ec_lang['lpn_field_text_align_center']='Средина';
$ec_lang['lpn_field_text_align_right']='Десно';
$ec_lang['lpn_field_text_valign']='Вертикално поравнање';
$ec_lang['lpn_field_text_valign_top']='Горе';
$ec_lang['lpn_field_text_valign_middle']='Средина';
$ec_lang['lpn_field_text_valign_bottom']='Доле';
$ec_lang['lpn_field_text_rotation']='Угао (степени)';
$ec_lang['lpn_field_text_match_pipe']='Окрени под угао најближе везе';
$ec_lang['lpn_field_text_flip']='Заокрени за 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Прикачени елемент';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='Овај текст је постављен довољно близу елемента да га прати, па се помера заједно с њим и има водилицу. Текст на водилици преузима хоризонтално и вертикално поравнање од стране на којој се налази, због чега та два реда нису понуђена док је прикачен.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Коефицијент емитера';
$ec_lang['lpn_field_emitter_tip']='Додатни истицај који зависи од притиска, за прскалицу, отворени излаз или моделовано цурење. Проток који ослобађа једнак је овом коефицијенту помноженом притиском степенованим на изложилац емитера, који се поставља једном за целу мрежу под Подешавања, Прорачун, Хидраулика. Оставите празно на обичном чвору.';
$ec_lang['lpn_field_elev']='Кота';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
// entry carrying translatable payload nobody on the page can see.
$ec_lang['lpn_field_elev_tip']='Кота терена или цеви у овом чвору. Мерите је од произвољне нулте тачке, све док сви чворови користе исту.';
// A reservoir carries an elevation AND a head. Leaving the head blank means "the water surface is
// at the reservoir's own elevation"; the placeholder string is what shows in that empty box.
// This USED to read "so it doubles as a tank" (Tom, 2026-07-30), which was true only while there
// was no tank. Since Task 248 there is one, and the two are different assets: a reservoir's level
// never moves, a tank's does. Raising a reservoir's head is still a legitimate thing to do -- it is
// just not how you model storage any more.
$ec_lang['lpn_field_head']='Напор';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Ниво водене површине у резервоару, изражен као висина, а не као притисак. Оставите празно да водена површина буде на коти резервоара.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='Кота дна тенка. Дубине воде у тенку се мере навише од овде.';
$ec_lang['lpn_field_tank_level']='Дубина воде';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Дубина воде у тенку, мерена навише од дна тенка. Водена површина је кота дна тенка увећана за ову дубину.';
$ec_lang['lpn_field_tank_minlevel']='Најмања дубина воде';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='Дубина воде при којој се тенк сматра празним, мерена навише од дна тенка.';
$ec_lang['lpn_field_tank_maxlevel']='Највећа дубина воде';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='Дубина воде при којој је тенк пун, мерена навише од дна тенка.';
$ec_lang['lpn_field_tank_diameter']='Пречник тенка';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='Ширина тенка од стране до стране. Изражава се у истим јединицама као кота, а не у јединицама пречника цеви. Она одређује колико воде одређена дубина садржи.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Кота водене површине у тенку: кота дна тенка увећана за дубину воде. То је ниво који решавач користи за тенк.';
$ec_lang['lpn_close']='Затвори';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Својства';
$ec_lang['lpn_empty_hint']='Користите Датотека, Нови пројекат да отворите пример. Или почните додавањем резервоара, чвора и цеви из траке алата.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='Ваша мрежа је нетакнута.';
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
$ec_lang['lpn_examples_welcome']='Добродошли у моделирање водоводне мреже, са EPANET решавачем';
$ec_lang['lpn_examples_heading']='Отвори пример';
$ec_lang['lpn_examples_sub']='Сваки се отвара као ваша сопствена копија. Измените је, сачувајте је, или отворите нову копију и почните изнова.';
$ec_lang['lpn_examples_open']='Отвори';
$ec_lang['lpn_examples_menu']='Отвори пример…';
$ec_lang['lpn_examples_blank']='Или почните са празном мапом';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_close']='Затвори';
$ec_lang['lpn_examples_size']='Чворова: {nodes}, цеви: {links}';
$ec_lang['lpn_examples_failed']='Примери нису могли да се учитају. Користите Датотека, Нови пројекат да бисте почели цртеж.';
$ec_lang['lpn_examples_loading']='Учитавање примера…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Поправи нешто';
$ec_lang['lpn_help_notes']='Напомене на овој страници';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='Нешто није у реду овде?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='Један притисак нам говори да нешто на овој страници није у реду. Шаље назив ове странице, језик на коме је читате и поруку на мапи ако постоји. Не шаље ништа што сте укуцали, ниједну адресу, нити ишта из вашег цртежа. Нико не може да вам одговори, јер ово нам не говори ништа о томе ко сте. Користите Помоћ, Поправи нешто када желите да кажете више.';
$ec_lang['lpn_wrong_thanks']='Хвала. То је стигло до нас.';
$ec_lang['lpn_status_example_opened']='Отворено {name}. Ово је ваша копија: сачувајте је помоћу Датотека, Сачувај као.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='Ова страница није успела да одреди величину површине за цртање, па карта приказује последњи приказ који је успела да израчуна. Промена величине прозора наводи је да поново покуша. Ако се то стално понавља, узрок је обично екстензија прегледача која блокира мерења странице.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Основна мрежа, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='Почните овде. Резервоар, пумпа и мала петља: најмањи распоред који и даље функционише као водоводна мрежа. Литри у секунди, са метрима и милиметрима.';
$ec_lang['lpn_ex_basic_us_title']='Основна мрежа, gpm (US)';
$ec_lang['lpn_ex_basic_us_desc']='Иста почетна мрежа у галонима у минути, са стопама и инчима.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='Најмања од три сопствене EPANET примерне мреже: један резервоар, пумпа и једна петља.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Разгранати дистрибутивни систем са танком, из EPANET примера.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='EPANET-ов велики пример: 92 чвора, 3 танка и 2 резервоара, један од њих река. Вреди отворити да видите како модел реалне величине изгледа на мапи.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, геогр. шир./дуж.';
$ec_lang['lpn_ex_net3_world_desc']='Иста мрежа као EPANET Net3, постављена на произвољно место на глобусу: њене координате су географска ширина и дужина, а иза ње је исцртан уличан план.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='Комерцијална локација решена за противпожарни проток изнад максималне дневне потрошње, у једном тренутку, нацртана преко плана локације.';
$ec_lang['lpn_tool_undo']='Поништи';
$ec_lang['lpn_confirm_example']='Ово додаје пример у мрежу коју већ имате. Наставити?';
$ec_lang['lpn_field_diameter']='Пречник';
$ec_lang['lpn_demand_tip']='Протоци који се узимају из мреже на овом чвору. Унесите негативан број за проток који се уводи у мрежу овде.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='Ова јединица одређује шта ваши уноси значе';
$ec_lang['lpn_units_warn_lead']='{unit} је јединица онога што уносите за:';
$ec_lang['lpn_units_options_head']='Када промените јединицу:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='Ненаметно';
$ec_lang['lpn_units_nondestructive_desc']='Ненаметно: оставља сваки унос онаквим какав је и тумачи га у новој јединици.';
$ec_lang['lpn_units_destructive']='Наметно';
$ec_lang['lpn_units_destructive_desc']='Наметно: преписује сваки унос математичким претварањем, тако да мрежа остаје физички приближно иста, у оквиру толеранције претварања. Изворни уноси се губе. Опозив их враћа.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n} вредности сада значе {unit}. Ништа није преписано.';
$ec_lang['lpn_status_converted']='{n} вредности је преписано у {unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_color_tip']='Обојите мрежу према једној величини, тако да велика мапа може да се прочита на први поглед. Притисак и брзина су обично најважније.';
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='Дужина и координате мапе';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Координате мапе';
$ec_lang['lpn_units_mapcoords_deg']='степени';
$ec_lang['lpn_units_usft']='US геодетска стопа';
$ec_lang['lpn_units_elevhead']='Кота и напор';
$ec_lang['lpn_units_pressure']='Притисак';
$ec_lang['lpn_units_flow']='Проток';
$ec_lang['lpn_units_velocity']='Брзина';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Градијент губитка напора';
$ec_lang['lpn_result_gradient_tip']='Губитак напора подељен дужином цеви. Користите га за поређење цеви различитих дужина у односу на једно пројектно ограничење.';
$ec_lang['lpn_result_water_age']='Старост воде';
$ec_lang['lpn_result_water_age_tip']='Колико дуго је вода која стиже до ове тачке већ у систему. Тамо где се токови спајају, дошла вода носи мешавину старости, а овде приказан број је њихов просек пондерисан протоком: чвор који већином напаја кратак нов вод показује ниску старост чак и ако га напаја и дугачак слепи крак. У тенку то је просечна старост воде коју садржи, због чега је тенк који се споро обнавља обично место с најстаријом водом у мрежи. Не постоји прописано ограничење са којим би се то поредило, па овај број процените у односу на сопствени систем.';
$ec_lang['lpn_result_source_share']='Удео извора';
$ec_lang['lpn_result_source_share_tip']='Колики део воде која стиже до ове тачке потиче из чвора праћења. То је оно што приказује анализа Праћење извора.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Просечна старост воде';
$ec_lang['lpn_result_avg_source_share']='Просечан удео извора';
$ec_lang['lpn_result_avg_concentration']='Просечна концентрација';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Фактор трења';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Брзина реакције';
$ec_lang['lpn_result_status']='Статус';
$ec_lang['lpn_result_status_open']='Отворено';
$ec_lang['lpn_result_status_closed']='Затворено';
$ec_lang['lpn_result_head']='Напор';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Енергија воде у овом чвору, изражена као висина водног стуба. То је висина, а не притисак.';
$ec_lang['lpn_result_pressure']='Притисак';
$ec_lang['lpn_result_flow']='Проток';
$ec_lang['lpn_result_velocity']='Брзина';
$ec_lang['lpn_result_headloss']='Губитак напора';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Ресетује само подешавања овог пројекта. Ваш цртеж и ваши други пројекти се не мењају. Да бисте сачували омиљена подешавања за поновну употребу, сачувајте пројектну датотеку која садржи само подешавања.';
$ec_lang['lpn_reset_all_tip']='Брише сваки пројекат, сваку позадинску слику, свако подешавање и ваш избор јединица, а затим поново учитава страницу тачно онако како је види посетилац који долази по први пут. Ово је једино ресетовање које брише баш све.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Овај калкулатор чува пројектне јединице и уносе онако како су унети, али је раније претварао бројеве у SI јединице ради чувања. Овај пројекат је сачуван пре те измене, па су његови бројеви сачувани у SI јединицама. Претворити их последњи пут у тренутне јединице? Да бисте могли да проценити, ево неколико пречника који би били претворени, са вредностима пре и после:';
$ec_lang['lpn_v2_restore_yes']='Претвори';
$ec_lang['lpn_v2_restore_never']='Не. Не питај ме више.';
$ec_lang['lpn_v2_restore_no']='Затвори да бих прво проверио тренутне јединице';
$ec_lang['lpn_storage_too_new']='Овај пројекат је сачуван новијом верзијом странице, па се овде не може отворити.';
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
$ec_lang['lpn_tool_file']='Датотека';
$ec_lang['lpn_menu_edit']='Уреди';
$ec_lang['lpn_menu_insert']='Уметни';
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
$ec_lang['lpn_menu_map']='Мапа';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='Прикажи мапу улица';
$ec_lang['lpn_basemap_satellite_show']='Прикажи сателитске снимке';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='Геореференциран';
$ec_lang['lpn_xymap']='Локални';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Конвертуј као…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='Копија {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='Конвертовање';
$ec_lang['lpn_convas_coordsys_tip']='Координатни систем у који се копија конвертује. Када се разликује од овог пројекта, следе два корака постављања. Пројекат који већ зна где се налази отвара оба корака већ одговорена, па их можете прихватити какви јесу или их изменити.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Тренутно: {crs}';
$ec_lang['lpn_convas_epsg']='EPSG координатни систем';
$ec_lang['lpn_convas_epsg_tip']='Изаберите координатни систем из EPSG регистра. Географска ширина и дужина је WGS 84 (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='Неименована (локална) геореференца';
$ec_lang['lpn_convas_unnamed_tip']='Локалне координате у јединици дужине, са мапом света прикаченом.';
$ec_lang['lpn_convas_none_tip']='Локалне координате у јединици дужине, засад без мапе света.';
$ec_lang['lpn_convas_units_tip']='Јединице у које се копија конвертује. Оригинал задржава своје сопствене бројеве и јединице.';
$ec_lang['lpn_convas_round']='Заокружи конвертоване вредности';
$ec_lang['lpn_convas_round_tip']='Заокружује само бројеве које ова конверзија преписује, на најближи корак који изаберете. Вредности чија се јединица не мења остају какве јесу.';
$ec_lang['lpn_convas_round_none']='Без заокруживања';
$ec_lang['lpn_convas_round_flow']='Потрошња и проток';
$ec_lang['lpn_convas_label_col']='Суфикс';
$ec_lang['lpn_convas_label_tip']='Текст додат после ове вредности на ознакама мапе копије, на пример „ mm” или „ gpm”. Унапред попуњен из јединице изабране изнад; обришите га за без суфикса.';
$ec_lang['lpn_convas_oneway']='Конвертовање назад је нова конверзија, а не поништавање. Број конвертован па враћен можда се неће вратити тачно онакав какав је уписан.';
$ec_lang['lpn_convas_ok']='Конвертуј';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} је један од неколико наведених координатних система без употребљивих података о пројекцији, па се не може конвертовати у њега или из њега. Ништа није конвертовано.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='Конвертована копија је {name}. Оригинални пројекат је непромењен.';
$ec_lang['lpn_convas_cancelled']='Ништа није конвертовано. Копија је затворена, а оригинални пројекат је непромењен.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Копира овај пројекат у нови језичак и конвертује копију у координатни систем и јединице које изаберете. Када се координатни систем промени, чаробњак вас води кроз приближно зумирање мапе иза ваше мреже, а затим прецизније скалирање и ротирање ваше мреже на мапи. Овај пројекат остаје потпуно непромењен. Да бисте геореференцирали без конвертовања, уместо тога користите Мапа, Мапа света, Прикачи.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='Овај пројекат је већ геореференциран, па је мрежа већ на мапи и ништа није премештено. Проверите да ли је на правом месту, а затим притисните дугме Постави модел овде и дугме Задржи овај положај.';
$ec_lang['lpn_georef_intro']='Постављање модела има два корака. Корак 1 је брзи: модел мирује, а ви померате мапу иза њега, док ваша локација не буде испод модела приближно у правој величини. Заокретања још нема. Корак 2 је прецизни: превлачите, мењате величину и окрећете сам модел. Ваш пројекат је на почетку на мапи целог света, па прво пронађите своју локацију, а затим притисните дугме Постави модел овде.';
$ec_lang['lpn_georef_adjust']='Модел је сада на терену, па се помера заједно са мапом. Превуците модел да га померите, превуците угао да му промените величину, превуците округлу ручку изнад модела да га окренете. Или упишите растојање на терену и угао окретања испод.';
$ec_lang['lpn_georef_step1']='Корак 1 од 2 — брзо';
$ec_lang['lpn_georef_step2']='Корак 2 од 2 — прецизно';
$ec_lang['lpn_georef_step1_hint']='Ваш пројекат остаје тамо где јесте на екрану. Померајте и зумирајте мапу испод њега док подлога иза њега не буде отприлике на правом месту и отприлике праве величине, а затим притисните дугме Постави модел овде.';
$ec_lang['lpn_georef_detach']='Поново га подигни';
$ec_lang['lpn_georef_size_prompt']='Отприлике колико је локација широка, преко целог пројекта?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name} — {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Пречица: притисните {key}.';
$ec_lang['lpn_tool_key_hint_two']='Пречица: притисните {key} или {key2}.';
$ec_lang['lpn_tool_add_junction_tip']='Кликните на мапу да додате чвор: тачку где се цеви спајају или где се вода троши.';
$ec_lang['lpn_tool_add_reservoir_tip']='Кликните на мапу да бисте додали резервоар: бесконачан извор са фиксним нивоом воде.';
$ec_lang['lpn_tool_add_tank_tip']='Кликните на мапу да бисте додали тенк: складиште чији ниво воде расте и опада како се пуни и празни.';
$ec_lang['lpn_tool_add_pipe_tip']='Кликните један чвор, па други, да нацртате цев између њих.';
$ec_lang['lpn_tool_add_pump_tip']='Кликните један чвор, па други, да поставите пумпу између њих.';
$ec_lang['lpn_tool_add_valve_tip']='Кликните један чвор, па други, да поставите вентил између њих.';
$ec_lang['lpn_tool_add_text_tip']='Кликните на мапу да напишете белешку на цртежу.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Кликните на мапу како је наведено да бисте изабрали све унутар облика. Притисните ово дугме поново да промените облик између прозора, ласоа и полигона. Држите Shift док бирате да наставите са постојећим избором, додајући или уклањајући (пребацујући) оно што бирате.';
$ec_lang['lpn_area_selected']='{n} изабрано.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='Ништа није пронађено у том подручју.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Додајте и уклоните тачке прегиба које обликују цев на мапи. Кликните на цев да бисте додали тачку прегиба, кликните на тачку прегиба да бисте је уклонили, а превуците тачку прегиба да бисте је померили. Тачка прегиба мења само нацртану трасу, не и хидраулику.';
$ec_lang['lpn_tool_delete_tip']='Кликните било шта на мапи да то уклоните.';
$ec_lang['lpn_tool_undo_tip']='Опозови последњу измену.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Прикажи целу мрежу у прозору.';
$ec_lang['lpn_tool_zoom_window_tip']='Кликните два наспрамна угла оквира, или превуците један, на мапи да увећате то подручје. Притисните ово дугме поново за Уклопи у приказ.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Увећај. Пречица: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Умањи. Пречица: -';
$ec_lang['lpn_tool_settings_tip']='Отвори подешавања за овај пројекат.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Пронађите елемент по његовом ID-у, или пронађите сваки елемент који испуњава услов, и измените их све одједном.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='Шта значе иконе на траци алата';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Видљивост';
$ec_lang['lpn_pane_right_toggle_tip']='Прикажи или сакриј панел десно од мапе. У њему су избори за ознаке и боје.';
$ec_lang['lpn_color_legend_open_tip']='Кликните да отворите панел Видљивост и промените ове боје.';
$ec_lang['lpn_color_node_field']='Обој чворове према';
$ec_lang['lpn_color_link_field']='Обој цеви према';
$ec_lang['lpn_color_ramp_sequential']='Секвенцијална';
$ec_lang['lpn_color_ramp_diverging']='Дивергентна';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Број опсега';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Расподела опсега';
$ec_lang['lpn_color_ranges_note']='Границе испод су фиксне пошто се једном поставе; не прате резултате како се мењају. Избор методе класификације података изнад поставља границе према тренутном стању система. Ако ручно измените било коју вредност, метода изнад постаје Ручно.';
$ec_lang['lpn_color_criterion_note']='Ова метода узима своје границе из пројектног стандарда, па је број боја фиксан док је ова метода изабрана.';
$ec_lang['lpn_color_break_number']='Граница мора бити број. Мапа је непромењена.';
$ec_lang['lpn_color_break_order']='Свака граница мора бити већа од претходне. Мапа је непромењена.';
$ec_lang['lpn_color_break_count']='Мора постојати једна граница мање него што има боја. Мапа је непромењена.';
$ec_lang['lpn_color_ramp_qualitative']='Квалитативна';
$ec_lang['lpn_color_ramp_rainbow']='Дуга';
$ec_lang['lpn_color_ramp_rainbow_eg']='као у EPANET-у';
$ec_lang['lpn_color_example_status']='Статус';
$ec_lang['lpn_color_example_material']='Материјал';
$ec_lang['lpn_color_ramp_ylgnbu']='Жута до плаве';
$ec_lang['lpn_color_ramp_rdylbu']='Црвена до плаве, преко жуте';
$ec_lang['lpn_georef_drop']='Постави модел овде';
$ec_lang['lpn_georef_finish']='Задржи овај положај';
$ec_lang['lpn_georef_cancel']='Откажи';
$ec_lang['lpn_georef_scale']='Стварно растојање по јединици цртежа';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Колико далеко на терену досеже једна јединица вашег цртежа. Цртеж направљен на обичној мрежи обично о томе ништа не говори, па то поставите овде — или пустите да вас Иди на… пита колико је локација широка и сам то израчуна.';
$ec_lang['lpn_georef_rotation']='Окрени супротно казаљци на сату (степени)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Колико да окренете цео модел, супротно казаљки на сату, тако да његов север показује ка северу.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Трајно поставити модел овде? Појединачне елементе и даље можете превлачити после овога, али цртеж престаје да буде xy пројекат. Да бисте вратили xy, затворите овај пројекат без чувања.';
$ec_lang['lpn_georef_done']='Ово је сада пројекат са геогр. шир./дуж. координатама. Превуците било који елемент да га померите ближе месту где стварно јесте.';
$ec_lang['lpn_georef_backdrop_unrotated']='Позадинска слика је премештена и промењене су јој димензије заједно са моделом, али није могла да се заокрене. Користите Мапа, Позадинска слика, Помери да бисте је поравнали.';
$ec_lang['lpn_georef_empty']='Та датотека нема мрежу у себи, па нема шта да се постави.';
$ec_lang['lpn_georef_unavailable']='Алат за постављање није учитан. Поново учитајте страницу и покушајте поново.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Завршите постављање дугметом „Задржи ово постављање” или притисните Откажи, пре него што промените пројекат. Постављање припада овом пројекту и не може да вас прати у други.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Завршите постављање дугметом „Задржи ово постављање“ или притисните Откажи пре него што сачувате. Пројекат се још поставља, тако да оно што је на екрану још увек није оно што би било уписано у датотеку.';
$ec_lang['lpn_goto_menu']='Иди на географску ширину и дужину…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_tip']='Померите мапу на место за које већ имате координате. Прво географска ширина, па дужина, онако како их мапа даје, са размаком између њих: 38 -122';
$ec_lang['lpn_goto_prompt']='Географска ширина и дужина, тим редоследом';
$ec_lang['lpn_goto_bad']='То није једна географска ширина и једна дужина. Пробајте 38 -122, са размаком између њих.';
$ec_lang['lpn_georef_goto']='Иди на…';
$ec_lang['lpn_georef_twopt']='Користи две познате тачке';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Поставите модел тачно, када већ знате где се две тачке на вашем цртежу заиста налазе. Кликните на једну од њих, упишите њену географску ширину и дужину, а затим урадите исто за другу тачку. Положај, размера и заокрет модела произлазе из те две тачке. Притисните ово дугме поново да бисте зауставили бирање.';
$ec_lang['lpn_georef_twopt_pick1']='Кликните на тачку на свом цртежу чију географску ширину и дужину знате.';
$ec_lang['lpn_georef_twopt_pick2']='Сада кликните на другу познату тачку, што даље од прве.';
$ec_lang['lpn_georef_twopt_same']='То је тачка коју сте прво изабрали. Изаберите другу.';
$ec_lang['lpn_georef_twopt_done']='Модел сада стоји на две тачке које сте задали. Проверите га, а затим притисните дугме Задржи овај положај.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Доњи панел';
$ec_lang['lpn_pane_toggle_tip']='Прикажите или сакријте панел испод мапе. Он садржи профил и табелу за сваку врсту елемента.';
$ec_lang['lpn_pane_resize']='Превуците да панел учините вишим или нижим';
$ec_lang['lpn_pane_tab_junctions']='Чворови';
$ec_lang['lpn_pane_tab_reservoirs']='Резервоари';
$ec_lang['lpn_pane_tab_tanks']='Тенкови';
$ec_lang['lpn_pane_tab_pipes']='Цеви';
$ec_lang['lpn_pane_tab_pumps']='Пумпе';
$ec_lang['lpn_pane_tab_valves']='Вентили';
$ec_lang['lpn_pane_tab_tip']='Ова картица приказује елементе ове врсте као табелу коју можете сортирати и уређивати. Колоне резултата се не могу уређивати.';
$ec_lang['lpn_pane_none']='Ова мрежа још нема ниједан од ових.';
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
$ec_lang['lpn_pane_text_attached']='Прикачено';
$ec_lang['lpn_pane_not_used']='Није коришћено';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='Филтрирано по {q}. Приказано {n} од {all}.';
$ec_lang['lpn_pane_filter_clear']='Прикажи све';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Ништа у овој табели не одговара филтеру.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Зумирај и изабери';
$ec_lang['lpn_goto_on_map']='Иди на мапи';
$ec_lang['lpn_pane_select_on_map']='Изабери на мапи';
$ec_lang['lpn_pane_unselect_on_map']='Поништи избор на мапи';
$ec_lang['lpn_pane_print']='Штампај табелу';
$ec_lang['lpn_pane_print_tip']='Штампа табелу коју гледате, са називом пројекта, називом табеле и јединицама у заглављима. Редови се штампају редоследом по коме сте их сортирали.';

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
$ec_lang['lpn_menu_project']='Вода';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Све о моделирању водоводне мреже налази се овде на једном месту, осим контрола за пуштање анимације. Нема потребе нагађати где се шта налази.';
$ec_lang['lpn_tables_menu']='Табеле';
$ec_lang['lpn_tables_menu_tip']='Отворите панел испод мапе на табели делова ове мреже. За сваку врсту дела постоји по једна табела, коју можете сортирати и уређивати ту.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Поново израчунајте ову мрежу сада. Тражите дугме Израчунај? Скривено је док је укључено подешавање Аутоматски израчунавај. Да бисте вратили дугме, искључите Аутоматски израчунавај у Подешавања, Прорачун, Хидраулика.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Аутоматски израчунавај';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Када је ово укључено, овај пројекат се поново израчунава убрзо после сваке измене коју направите, а дугме Израчунај се уклања са траке алатки јер за њега нема више шта да ради. Искључите на великој мрежи где чекање да се свака измена израчуна омета куцање, и дугме Израчунај се враћа тако да сами бирате када да покренете прорачун.';
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
$ec_lang['lpn_time_run_slow']='Ова мрежа је требало {secs} s да се израчуна, а подешена је да се поново израчунава после сваке измене. Да бисте то зауставили и вратили дугме Израчунај, искључите „Аутоматски израчунавај” у Подешавањима, под Прорачун, Хидраулика.';
$ec_lang['lpn_time_no_report']='Још нема извештаја о прорачуну. Извештај је сопствени текст EPANET-а, па се појављује тек када се ова мрежа израчуна EPANET решавачем.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
$ec_lang['lpn_menu_settings']='Подешавања';
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Помоћ';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Галерија снимака екрана';
$ec_lang['lpn_help_walkthroughs']='Водичи';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Обриши мрежу';
$ec_lang['lpn_confirm_delete_network']='Обрисати сваки чвор, цев и текстуалну ознаку у овом пројекту? Позадинска слика, назив пројекта и ваша подешавања се задржавају. Ово се не може поништити.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Пронађи и замени';
$ec_lang['lpn_find_title']='Пронађи и замени';
$ec_lang['lpn_find_scope']='Шта претражити';
$ec_lang['lpn_find_scope_all']='Све';
$ec_lang['lpn_find_property']='Својство';
$ec_lang['lpn_find_condition']='Услов';
$ec_lang['lpn_find_value']='Вредност';
$ec_lang['lpn_find_btn']='Пронађи';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='Филтер у тренутној табели';
$ec_lang['lpn_find_filter_tip']='Прикажи само делове који одговарају овом упиту у једној од табела испод мапе. Цртеж се не мења и ништа се не брише.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} од {all}';
$ec_lang['lpn_find_filter_summary']='Филтрирано по {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='Овај упит се не односи ни на једну табелу.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='садржи';
$ec_lang['lpn_find_op_equals']='једнако';
$ec_lang['lpn_find_op_gt']='веће од';
$ec_lang['lpn_find_op_lt']='мање од';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='празно';
// {n} is a whole number.
$ec_lang['lpn_find_count']='Пронађено: {n}. Кликните на један да одете до њега.';
$ec_lang['lpn_find_shift_hint']='Shift+клик за додавање/уклањање из избора.';
$ec_lang['lpn_find_none']='Ништа се не поклапа.';
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
$ec_lang['lpn_find_op_top']='{n} највиших';
$ec_lang['lpn_find_op_bottom']='{n} најнижих';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Упишите шта тражите.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Повезаност';
$ec_lang['lpn_find_prop_demand_desc']='Опис ове категорије потрошње';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='нема веза на чвору';
$ec_lang['lpn_find_op_conn_noopen']='нема отворених веза на чвору';
$ec_lang['lpn_find_op_conn_nolinksource']='нема путање веза до извора';
$ec_lang['lpn_find_op_conn_noopensource']='нема отворене путање до извора';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
$ec_lang['lpn_find_conn_unlinked']='Нема веза на чвору';
$ec_lang['lpn_find_conn_noopen']='Нема отворених веза на чвору';
$ec_lang['lpn_find_conn_nolinksource']='Нема путање веза до извора';
$ec_lang['lpn_find_conn_noopensource']='Нема отворене путање до извора';
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Сваки чвор је повезан.';
$ec_lang['lpn_find_conn_no_fixed']='Ова мрежа нема резервоар ни тенк, па нема извора до кога би се стигло. Може се тражити само нема веза на чвору и нема отворених веза на чвору.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='Иста претрага, записана у једном реду. Промена контрола преписује овај ред, а куцање у овом реду ажурира контроле.';
$ec_lang['lpn_find_query_label']='Упит';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Комбинујте услове помоћу И, ИЛИ и ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='И';
$ec_lang['lpn_find_q_or']='ИЛИ';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='Контроле не могу да изразе упит испод, па су сакривене.';
$ec_lang['lpn_find_q_restore']='Користи контроле уместо тога';
$ec_lang['lpn_replace_q_bad']='Овај упит се не може разумети, па се ништа не може променити. Прво га исправите изнад.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(на знаку {n})';
$ec_lang['lpn_find_q_err_empty']='Упит је празан, па се ништа неће претраживати.';
$ec_lang['lpn_find_q_err_scope']='Не постоји ништа што се зове {w} за претрагу. Пробајте једно од: {list}';
$ec_lang['lpn_find_q_err_dot']='Ставите тачку између онога што се претражује и његове особине, на пример Чвор.ID';
$ec_lang['lpn_find_q_err_prop']='Није особина за {scope}: {w}. Пробајте једно од: {list}';
$ec_lang['lpn_find_q_err_op']='Није услов за {prop}: {w}. Пробајте једно од: {list}';
$ec_lang['lpn_find_q_err_value']='Овај услов захтева вредност после себе: {op}';
$ec_lang['lpn_find_q_err_quote']='Ставите наводнике око текстуалне вредности: {w} није број.';
$ec_lang['lpn_find_q_err_quote_end']='Овај текст под наводницима нема завршни наводник.';
$ec_lang['lpn_find_q_err_close']='Ова заграда ( је отворена, али никада затворена.';
$ec_lang['lpn_find_q_err_open']='Ова заграда ) не затвара ништа.';
$ec_lang['lpn_find_q_err_end']='Овде се ништа није очекивало. Спојите две претраге помоћу {and} или {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Промени оно што је пронађено';
$ec_lang['lpn_replace_prop']='Својство за промену';
$ec_lang['lpn_replace_value']='Нова вредност';
$ec_lang['lpn_replace_source']='Извор нове вредности';
$ec_lang['lpn_replace_asked']='Затражене су коте за {n} чворова. Резултати стижу.';
$ec_lang['lpn_replace_btn']='Замени';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Променити {n} елемената?';
$ec_lang['lpn_replace_apply']='Промени их';
$ec_lang['lpn_replace_done']='{n} елемената промењено. Ово можете поништити у једном кораку.';
$ec_lang['lpn_replace_none']='Ништа се не би променило.';
$ec_lang['lpn_replace_no_value']='Упишите нову вредност.';
$ec_lang['lpn_replace_scope']='Изаберите изнад једну врсту елемента на коју ће се вредности применити.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='Профил';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_tip']='Исцртај терен и хидрауличну линију напора дуж путање кроз мрежу.';
$ec_lang['lpn_profile_title']='Профил дуж путање';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Кликните на чвор где траса почиње.';
$ec_lang['lpn_profile_draw_more']='Пређите преко мапе да видите трасу. Кликните на чвор да га додате. Двоструки клик завршава. Esc отказује.';
$ec_lang['lpn_profile_draw_blocked']='Нема трасе од {a} до {b}. Изаберите други чвор.';
$ec_lang['lpn_profile_tap_start']='Додирните чвор где траса почиње.';
$ec_lang['lpn_profile_tap_more']='Додирните чвор да видите трасу. Притисните и држите да га додате. Двоструки додир завршава. Притисните Профил поново да откажете.';
$ec_lang['lpn_profile_say_idle']='Притисните Профил поново да изаберете нову трасу на мапи.';
$ec_lang['lpn_profile_none']='Још нема трасе. Притисните Профил поново да је изаберете на мапи.';
$ec_lang['lpn_profile_choose']='Изаберите почетни и крајњи чвор.';
$ec_lang['lpn_profile_no_path']='Ова два чвора нису повезана ниједном трасом.';
$ec_lang['lpn_profile_no_solve']='Још нема резултата, па је нацртана само линија терена.';
$ec_lang['lpn_profile_summary']='Чворова: {n}, дужина: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Растојање дуж трасе ({u})';
$ec_lang['lpn_profile_axis_elev']='Кота и напор ({u})';
$ec_lang['lpn_profile_ground']='Површина терена';
$ec_lang['lpn_profile_hgl']='Пијезометарска линија';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Уреди';
$ec_lang['lpn_profile_edit_tip']='Промените један крај путање, или уклоните један чвор с ње, без поновног цртања целе путање.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Превуците било коју тачку на путањи да бисте је померили. Кликните на тачку коју сте додали да бисте је уклонили.';
$ec_lang['lpn_profile_edit_tap']='Превуците било коју тачку на путањи да бисте је померили. Додирните тачку коју сте додали да бисте је уклонили.';
$ec_lang['lpn_profile_edit_nowhere']='Тачка на путањи мора бити чвор. Путања је непромењена.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Сачуване путање';
$ec_lang['lpn_profile_new']='Нова сачувана путања…';
$ec_lang['lpn_profile_new_name']='Путања {n}';
$ec_lang['lpn_profile_rename']='Преименуј путању…';
$ec_lang['lpn_profile_delete']='Обриши путању';
$ec_lang['lpn_profile_prompt_name']='Назив ове путање';
$ec_lang['lpn_profile_delete_confirm']='Обрисати сачувану путању {name}? Сам цртеж се не мења.';
$ec_lang['lpn_profile_none_saved']='Још нема сачуваних путања';
$ec_lang['lpn_profile_missing']='Сачувана путања {name} користи чворове којих нема у овом пројекту: {ids}';
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
$ec_lang['lpn_ts_menu']='Временски низ';
$ec_lang['lpn_ts_tip']='Прикажите графикон једног или више елемената у односу на време током симулације продуженог периода.';
$ec_lang['lpn_ts_title']='Вредности у зависности од времена';
$ec_lang['lpn_ts_group_tip']='Да ли графикон приказује чворове или везе.';
$ec_lang['lpn_ts_group_nodes']='Чворови';
$ec_lang['lpn_ts_group_links']='Везе';
$ec_lang['lpn_ts_quantity_tip']='Која вредност се приказује у зависности од времена.';
$ec_lang['lpn_ts_add']='Додај изабрано';
$ec_lang['lpn_ts_add_tip']='Стави све тренутно изабрано на мапи на графикон.';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='Ништа те врсте није изабрано на мапи.';
$ec_lang['lpn_ts_clear']='Уклони све';
$ec_lang['lpn_ts_chip_tip']='Уклони {id} са графикона';
$ec_lang['lpn_ts_none']='Још ништа за приказ на графикону. Изаберите елементе на мапи и притисните Додај изабрано.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Још нема резултата продуженог периода. Притисните Израчунај да покренете симулацију.';
$ec_lang['lpn_ts_summary']='Елемената: {n}, извештајних тренутака: {steps}';
$ec_lang['lpn_ts_axis_time']='Протекло време';
$ec_lang['lpn_view_units']='Јединице';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Сачувај све';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Пројекат{n}';
$ec_lang['lpn_project_copy_suffix']='(копија)';
$ec_lang['lpn_project_rename']='Преименуј';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='Нови пројекат…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='Нови пројекат';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='Координатни систем';
$ec_lang['lpn_new_coordsys_tip']='Изаберите координатни систем ваше мреже. Ово је трајно; једини начин да претворите мрежу у другачије координате јесте „Датотека, Отвори у новим координатама“, и то је приближно.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Локални, шематски или прилагођени';
$ec_lang['lpn_new_coordsys_local_tip']='Није геореференцирано. Прикачите сопствену позадинску слику или ниједну.';
// ---- THE COORDINATE SYSTEM BOX -----------------------------------------------------------------
// Tom's summary: it "uses the map view as a UX element to filter the universe of projections to the
// ones applicable to the project (view). Lets the user filter by name and select a projection at
// any time." (His own words, kept verbatim; "projection" in visitor strings became "coordinate
// system" on 2026-09-25 -- don't expose the word "projection".) Two filters over one catalogue, and
// the catalogue itself is not keyed: a coordinate system's NAME is the EPSG register's own, exactly
// as the OpenStreetMap credit is, and a GIS reader in any language looks for those characters.
$ec_lang['lpn_new_crs']='Пројекција карте';
// **THE SUB-BOX'S OWN TITLE** (Tom, 2026-09-25). Shared by the New project box and Convert as, so
// it names the box's own subject rather than either caller's radio label.
$ec_lang['lpn_crsbox_title']='Координатни систем';
// The spatial filter. A zoned system covers a strip of the Earth and nothing outside it, so a place
// answers most of the question by itself: searching a town in Arizona leaves two UTM zones standing
// out of a hundred and twenty.
$ec_lang['lpn_crs_view']='Филтрирај по приказу карте';
$ec_lang['lpn_crs_view_tip']='Нуди само пројекције које покривају место на које карта тренутно гледа. Искључите ово да бисте видели читав списак.';
$ec_lang['lpn_crs_place']='Претрага по називу места';
$ec_lang['lpn_crs_place_tip']='Упишите град, адресу или знаменитост, и приказ карте ће се преместити тамо. Речи које уписујете шаљу се сервису за називе места OpenStreetMap-а, који вас пита за дозволу први пут. Нови географски пројекат такође почиње на месту које овде пронађете.';
$ec_lang['lpn_crs_search']='Претражи';
$ec_lang['lpn_crs_name']='Филтер по називу пројекције';
$ec_lang['lpn_crs_name_tip']='Приказује само пројекције чији назив или EPSG код садржи оно што уписујете. Пробајте број зоне, или UTM, или Меркатор.';
$ec_lang['lpn_crs_list']='Пројекција';
$ec_lang['lpn_crs_list_tip']='Пројекције преостале након два филтера изнад. Изаберите једну и притисните Изабери.';
$ec_lang['lpn_crs_choose']='Изабери';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='Још није претражено ниједно место, па се нуди читав списак. Претражите место изнад или зумирајте карту да бисте га сузили.';
$ec_lang['lpn_crs_count']='Приказано {n} од {total} пројекција.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} од {total} координатних система покрива ову мрежу.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(нема мапе)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} је један од неколико наведених координатних система без употребљивих података о пројекцији. То значи да мапа света, претрага назива места и DEM коте не раде. Ваше координате нису под утицајем.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='неименован';
$ec_lang['lpn_crs_none']='Није геореференцирано';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Пројекат чува сопствене јединице, па овај избор припада само овом пројекту и ништа се овде не чува као подешавање прегледача. Да бисте нове пројекте увек започињали на одређени начин, сачувајте празан пројекат као шаблон и сваки пут направите његову копију.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Петалума, Калифорнија';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Направи';
$ec_lang['lpn_file_open']='Отвори…';
$ec_lang['lpn_file_save']='Сачувај';
$ec_lang['lpn_file_saveas']='Сачувај као…';
$ec_lang['lpn_file_revert']='Врати';
$ec_lang['lpn_file_close']='Затвори';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Недавне датотеке';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_tip']='Поново отворите {file} без потребе да је тражите на рачунару.';
$ec_lang['lpn_recent_denied']='Дозвола за отварање те датотеке није дата, па није отворена.';
$ec_lang['lpn_recent_gone']='Датотека {file} није могла да се отвори. Можда је премештена, преименована или обрисана, па је уклоњена са списка недавних.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='Нови пројекат';
$ec_lang['lpn_tab_all']='Сви пројекти';
$ec_lang['lpn_tab_menu']='Мени пројекта';
$ec_lang['lpn_tab_duplicate']='Дуплирај';
$ec_lang['lpn_tab_move_left']='Помери улево';
$ec_lang['lpn_tab_move_right']='Помери удесно';
$ec_lang['lpn_tab_unsaved']='Није сачувано у датотеку';
$ec_lang['lpn_import_bad_file']='Та датотека није могла да се учита као пројекат сачуван са ове странице.';
$ec_lang['lpn_import_no_room']='Нема довољно слободног простора у складишту прегледача за додавање овог пројекта. Обришите пројекат који вам више није потребан и покушајте поново.';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='У реду';
$ec_lang['lpn_file_import_inp']='Увези EPANET датотеку…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Учитава мрежу из EPANET датотеке, било текстуалне .inp датотеке или .net датотеке коју EPANET чува, и чува је у овом прегледачу као нови пројекат.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='Извези EPANET датотеку…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Запишите ову мрежу као EPANET .inp датотеку и преузмите је. Бројеви које сте уписали записују се тачно онако како сте их уписали. Све што .inp формат не може да сачува биће накнадно наведено.';
$ec_lang['lpn_status_inp_exported']='Извезено: {file}.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} ствари које .inp формат не може да сачува.';
$ec_lang['lpn_inp_export_refused']='Овај пројекат не може да се запише као EPANET датотека: {detail}';
$ec_lang['lpn_inp_bad_file']='Та датотека није могла да се учита као EPANET мрежна датотека.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Ово изгледа као EPANET .net датотека, али ова страница није успела да је учита. Отворите је у EPANET-у и користите тамошњу команду Датотека, Извоз, Мрежа да је сачувате као .inp датотеку, па увезите њу.';
$ec_lang['lpn_inp_report_heading']='Увезено {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} чворова, резервоара и тенкова, {links} цеви, пумпи и вентила, у јединицама {units}.';
$ec_lang['lpn_inp_report_clean']='Све из датотеке је успешно пренето. Ништа није изостављено.';
$ec_lang['lpn_inp_report_label_anchor']='Текстуалне ознаке су постављене онако како их поставља EPANET, од њиховог горњег левог угла.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='EPANET датотеке не садрже координатни систем, па ова датотека неће одмах бити геореференцирана. Да бисте је поставили на мапу света, користите Мапа, Мапа света… Да бисте конвертовали њене координате, користите Датотека, Конвертуј као…';
$ec_lang['lpn_inp_report_lead']='Ова страница не користи све што EPANET користи, али ништа у вашој датотеци се не одбацује. Испод је оно што ваша датотека садржи а ова страница чува без коришћења, и оно што је измењено приликом учитавања датотеке:';
$ec_lang['lpn_inp_drop_headloss']='Ова датотека не користи Hazen-Williamsову формулу. Ова страница израчунава по Hazen-Williamsu, па су бројеви храпавости цеви задржани тачно онако како су написани, али резултати овде се неће подударати са резултатима у EPANET-у.';
$ec_lang['lpn_inp_drop_tank_curve']='Ови тенкови немају праве (равне) стране: датотека даје њихов облик као криву. Крива се чува у оквиру Библиотеке, тенк и даље упућује на њу, а симулација током продуженог периода пуни и празни тенк по распореду који та крива даје. Један тренутак је исти у оба случаја, јер је водена површина ниво који датотека поставља. Пречник уписан у датотеци чува се уз криву и то је оно чиме се тенк без криве црта и решава.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Ови пригушни вентили су пренети као пригушни вентили, задржавајући исти губитак који им додељује датотека. Било који решавач може да их израчуна.';
$ec_lang['lpn_inp_drop_valve_active']='Ови вентили регулишу притисак или проток и сами се отварају и затварају како се вода мења. Ништа код њих није изгубљено приликом уноса, а ова страница их решава помоћу EPANET решавача, укључујући тај решавач самостално за ову мрежу.';
$ec_lang['lpn_inp_drop_valve']='Ови вентили су описани кривом или фиксним падом притиска, а ова страница нема такав елемент. Учитани су као отворене цеви, па је мрежа и даље повезана, али ништа тамо више не контролише притисак ни проток.';
$ec_lang['lpn_inp_drop_cv']='У EPANET-у ове цеви пропуштају воду само у једном смеру. Пренете су као обичне цеви, па сада вода може да тече у оба смера кроз њих.';
$ec_lang['lpn_inp_drop_demands']='Ови чворови су имали више од једне потрошње. Потрошње су сабране у једну потрошњу коју ова страница чува.';
$ec_lang['lpn_inp_drop_patterns']='Ова страница није учитала обрасце потрошње, јер део странице који покреће симулацију током продуженог периода није учитан. Свака потрошња је број уписан у датотеци.';
$ec_lang['lpn_inp_drop_demand_pattern']='Ови чворови мењају своју потрошњу током прорачуна. Њихови обрасци су у потпуности пренети, а потрошња коју видите је она за тренутак који сат показује.';
$ec_lang['lpn_inp_drop_emitters']='Ови чворови имају коефицијент прскалице или цурења. Он је задржан и укључен је у прорачун, али га на овој страници тренутно нема где да видите или измените.';
$ec_lang['lpn_inp_drop_curve_long']='Ова крива пумпе имала је више од три тачке. Њена најнижа, средња и највиша тачка су задржане, јер ова страница прилагођава криву највише трима тачкама.';
$ec_lang['lpn_inp_drop_curve_missing']='Ова пумпа упућује на криву које нема у датотеци. Пумпа је пренета без криве, па не додаје напор.';
$ec_lang['lpn_inp_drop_pump_other']='Ова пумпа је описана снагом коју троши, а не кривом. Учитана је без криве, па не додаје напор.';
$ec_lang['lpn_inp_drop_head_pattern']='Ови резервоари се дижу и спуштају током прорачуна. Њихови обрасци су у потпуности пренети, а водени ниво који видите је онај за тренутак који сат показује.';
$ec_lang['lpn_inp_drop_pump_speed']='Ове пумпе раде брзином другачијом од оне при којој је измерена њихова крива, или мењају брзину током прорачуна. Брзина и њен образац су у потпуности пренети, а напор који видите је онај за тренутак који сат показује.';
$ec_lang['lpn_inp_drop_setting']='Ове цеви, пумпе и вентили носе подешавање које ова страница не може да сачува. Пренети су у отвореном стању.';
$ec_lang['lpn_inp_drop_rules']='Ова датотека садржи контроле засноване на правилима. Ова страница их чита и користи. Покрените прорачун помоћу EPANET решавача и правила ће бити примењена, при чему се сваки ниво, притисак и проток у њима претварају у јединице које овај пројекат приказује. Отворите Правила под Библиотеке да бисте прочитали или изменили правило. Чувају се тачно онако како их датотека наводи и биће поново уписана ако сачувате EPANET датотеку.';
$ec_lang['lpn_inp_drop_eps']='Ова датотека описује симулацију током продуженог периода. Део ове странице који покреће такву симулацију није учитан, па су пренети само почетни услови.';
$ec_lang['lpn_inp_drop_quality']='Ова датотека описује како се квалитет воде мења док путује: шта се у води налази на почетку и колико брзо та супстанца реагује у цевима и у тенковима. Ова страница чита те бројеве и користи их. Изаберите хемикалију под Подешавања, Прорачун, Квалитет воде, а затим покрените прорачун помоћу EPANET решавача, и концентрација ће бити израчуната дуж мреже током прорачуна. Редови се чувају и биће поново уписани ако сачувате EPANET датотеку.';
$ec_lang['lpn_inp_drop_sources_mixing']='Ова датотека наводи где се хемикалија дозира у мрежу и како се вода у тенку меша. Доза се појављује на чвору на коме је додата, а тенк наводи који модел мешања прати. И дозу и модел мешања израчунава искључиво EPANET решавач.';
$ec_lang['lpn_inp_drop_energy']='Ова EPANET датотека садржи податке за моделовање трошкова пумпања. Ова страница их чита и користи. Покрените прорачун помоћу EPANET решавача, а затим отворите Вода, Извештаји, Енергија пумпи да видите колико дуго је свака пумпа радила, коју снагу је трошила, коју енергију је потрошила и колико је то коштало. Редови се чувају и биће поново уписани ако сачувате EPANET датотеку.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Ова датотека даје тагове неким од својих чворова, цеви или других елемената. Сваки таг је у потпуности пренет и налази се у својствима свог елемента, где га можете прочитати или изменити.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Ова датотека садржи EPANET-ова сопствена подешавања за форматирање извештаја који штампа. Извештај решавача можете прочитати овде, под Извештаји, EPANET прорачун, али излази у стандардном формату решавача, а не у оном који та подешавања траже. Редови се чувају и биће поново уписани ако сачувате EPANET датотеку.';
$ec_lang['lpn_inp_drop_sections']='Ова датотека садржи одељак који ова страница уопште не чита. Ништа се овде не користи из њега. Чува се у целини и биће поново уписан ако сачувате EPANET датотеку.';
$ec_lang['lpn_inp_drop_quality_options']='Ова датотека наводи EPANET-ове опције квалитета воде: опцију Квалитет, која именује врсту анализе квалитета воде, и два подешавања која иду уз хемикалију, Релативна дифузивност и Толеранција квалитета. Сва три се чувају и сва три се користе. Старост воде, праћење извора и хемикалија се овде израчунавају, а два подешавања за хемикалију се предају EPANET решавачу када покренете прорачун за хемикалију. Сва се поново уписују ако сачувате EPANET датотеку.';
$ec_lang['lpn_inp_drop_file_options']='Ова датотека упућује на помоћну датотеку: Map, која садржи координате, или Hydraulics, која садржи већ израчунату хидраулику. Ова страница не може да отвори ниједну од њих, па редови остају какви јесу и биће поново уписани ако сачувате EPANET датотеку.';
$ec_lang['lpn_inp_drop_demand_model']='Ова датотека тражи анализу засновану на притиску (PDA), у којој чвор прима мање од своје потрошње када је притисак тамо низак. Ова страница решава на основу потрошње, па сваки чвор овде прима потрошњу наведену у датотеци, без обзира на добијени притисак. Ред се чува и биће поново уписан ако сачувате EPANET датотеку.';
$ec_lang['lpn_inp_drop_other_options']='Ова датотека наводи опције које ова страница не чита. Ништа се овде не користи из њих. Чувају се и биће поново уписане ако сачувате EPANET датотеку.';
$ec_lang['lpn_inp_drop_net_options']='Ова EPANET .net датотека наводи подешавања за која ова страница нема контролу, па су њихове вредности овде наведене уместо да буду пренете. Све остало је пренето. Ако вам требају, отворите датотеку у EPANET-у и користите Датотека, Извоз, Мрежа да је сачувате као .inp датотеку, а затим увезите ту.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Ово је била EPANET .net датотека. То је сопствена пројектна датотека EPANET-а, нема објављен опис, а ова страница је чита тако што формат открива из примера датотека, па је користите само када немате ништа друго, а не као поуздан пут. .inp датотека је документован формат који чита сваки други програм: у EPANET-у користите Датотека, Извоз, Мрежа да бисте је записали, и увезите њу кад год можете.';
$ec_lang['lpn_inp_drop_backdrop']='Ова датотека наводи назив позадинске слике, али не садржи саму слику. Додајте је сами преко Датотека, Позадинска слика, Додај слику.';
$ec_lang['lpn_inp_drop_dangling']='Ове цеви наводе чвор којег нема у датотеци, па су изостављене.';
$ec_lang['lpn_inp_drop_units']='Јединица протока наведена у овој датотеци није позната овој страници, па је сваки број прочитан као галони у минути. Проверите сваки број пре него што користите резултате.';
$ec_lang['lpn_inp_drop_anchor_missing']='Овај текст је био прикачен за чвор, резервоар или тенк који није у датотеци. Унет је као слободан текст на месту где га је датотека поставила, и сада ништа не прати.';
$ec_lang['lpn_import_notes_heading']='Овај пројекат је учитан из EPANET датотеке. Део онога што та датотека садржи се чува, али се не користи на овој страници.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='Отворено {name} из датотеке, и додато у овај прегледач као нови пројекат.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='Пројектна датотека';
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
$ec_lang['lpn_file_upload_explain']='Овај прегледач не може да се повеже са датотеком, па је отварање датотеке овде заправо отпремање: пројекат се копира у овај прегледач, а једини начин да сачувате свој рад назад у датотеку јесте да је препишете преко Датотека, Сачувај као.';
// The tip on the Open button, which reached the toolbar with Task 246. It exists because that
// button is icon-only: on a menu row the word carries the whole meaning, and on the strip the tip
// is where the rest of it lives.
$ec_lang['lpn_file_open_tip']='Отвори пројектну датотеку сачувану са ове странице.';
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
$ec_lang['lpn_file_save_tip']='Чува у повезану датотеку.';
$ec_lang['lpn_file_saveas_tip']='Изаберите датотеку у коју ћете сачувати. Овај пројекат се повезује са том датотеком, и Сачувај од тада уписује у њу.';
// The one thing a user can actually DO about the proliferation of files (Tom, 2026-08-04: "I hate to
// cause the proliferation of files"). We cannot make a browser ask where to put a download -- there
// is no API for it, and the download attribute cannot override the setting -- but the user can turn
// that setting on themselves, and then Save as really does let them overwrite the file they started
// from. It belongs in this tip rather than in a dialog: it answers a question asked at the moment
// the user is choosing where their work goes.
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_saveas_tip_download']='Чува путем подешавања преузимања (Download) вашег прегледача. Овај прегледач не може да се повеже са датотеком, па је Сачувај онемогућено и доступно је само Сачувај као. Ако укључите подешавање прегледача „Питај где да сачувам сваку датотеку”, можете да изаберете оригиналну датотеку и препишете је.';
$ec_lang['lpn_status_uploaded']='Пројектна датотека је отпремљена. Веза са њом се не може одржати, па је једини начин да сачувате назад у њу коришћење Датотека, Сачувај као.';
$ec_lang['lpn_status_downloaded']='Преузето {file}. Овај прегледач не може да се повеже са датотеком, па овај пројекат остаје означен као несачуван у датотеку.';
$ec_lang['lpn_status_file_opened']='Отворено {file}.';
$ec_lang['lpn_status_already_open']='Та датотека је овде већ отворена као {name}, па је приказ пребачен на њу уместо отварања друге копије.';
$ec_lang['lpn_status_already_open_dirty']='Та датотека је овде већ отворена као {name}, са изменама које нисте сачували у њу. Приказ је пребачен на њу уместо отварања друге копије. Користите Датотека, Врати ако желите верзију са диска уместо тога.';
$ec_lang['lpn_status_saved']='Сачувано {file}.';
$ec_lang['lpn_status_reverted']='Поново учитано {file} са диска.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='Сачувати ваше измене у {name} пре затварања?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} се чува само у овом прегледачу. Ако га затворите без чувања у датотеку, трајно је изгубљен.';
$ec_lang['lpn_close_discard']='Затвори без чувања';
$ec_lang['lpn_cancel']='Откажи';
$ec_lang['lpn_revert_confirm']='Одбацити измене које сте направили и поново учитати {file} са диска?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Овај пројекат потиче из {file}, али је веза са том датотеком изгубљена. Изаберите датотеку поново да бисте се повезали са њом.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='Није успело уписивање у датотеку. Можда је премештена или преименована, или је дозвола повучена. Ваш рад је и даље сачуван у овом прегледачу.';
$ec_lang['lpn_file_changed_elsewhere']='Неко други је сачувао у ову датотеку откако сте је отворили, па би чување сада преписало његов рад. Користите Датотека, Сачувај као да сачувате своје измене у сопственој датотеци, или Датотека, Врати да одбаците своје и учитате њихове.';
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
$ec_lang['lpn_lock_somebody']='Неко други';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} има ову датотеку отворену.';
$ec_lang['lpn_lock_open_readonly']='Отвори само за читање';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Прекини њихово закључавање';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='Изгледа да је ова датотека у употреби.';
$ec_lang['lpn_lock_open_care']='Да бисте избегли губитак података, пажљиво изаберите међу опцијама испод.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='У употреби је {x}.';
$ec_lang['lpn_lock_age_edited']='Последњи пут је измењена пре {x}.';
$ec_lang['lpn_lock_age_saved']='Последњи пут је сачувана пре {x}.';
$ec_lang['lpn_lock_age_never_saved']='У ову датотеку још ништа није сачувано.';
$ec_lang['lpn_lock_age_unknown']='Нема записа о томе колико дуго је у употреби, или када је последњи пут сачувана или измењена.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='„Питај” јавља ономе ко тренутно има ову датотеку отворену да бисте је ви желели, и не мења ништа друго. „Отвори само за читање” вам омогућава да је погледате и мењате шта год желите, без могућности да сачувате овде. „Прекини њихово закључавање” вам омогућава да сачувате преко датотеке; њихов несачувани рад се не губи, али више неће моћи да га овде сачувају, и можда ће неко морати ручно да споји то двоје.';
$ec_lang['lpn_lock_ask']='Питај';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='Кога да наведемо као онога ко пита? Ваши иницијали су идеални. Чувају се уз закључавање ове датотеке на нашем серверу, за онога ко је има отворену, и бришу се у року од 30 дана.';
$ec_lang['lpn_lock_ask_sent']='Питали смо онога ко има ову датотеку отворену да је затвори. Видеће то за мање од минута, ако му је страница још отворена. Ништа друго се није променило, а датотека је и даље његова док је не затвори.';
$ec_lang['lpn_lock_ask_failed']='Ваша порука није могла да буде испоручена. Или нико тренутно нема ову датотеку отворену, или сервер није могао да буде достигнут.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Та датотека није отворена, и ништа овде није промењено. Неко други је још увек има отворену.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} би желео/ла да уреди ову датотеку. Када будете спремни, сачувајте свој рад и користите Датотека, Затвори пројекат да је предате.';
$ec_lang['lpn_ago_seconds']='{n} секунди';
$ec_lang['lpn_ago_minutes']='{n} минута';
$ec_lang['lpn_ago_hours']='{n} сати';
$ec_lang['lpn_ago_days']='{n} дана';
$ec_lang['lpn_ago_unknown']='непознато време';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Поруке';
$ec_lang['lpn_msglog_heading']='Недавне поруке';
$ec_lang['lpn_msglog_empty']='Још нема порука.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='пре {x}';
$ec_lang['lpn_msglog_note']='Најновије прве. Ова страница чува последњих {n} порука док је отворена, а ништа се не чува на вашем рачунару.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Само за читање: {name} има ову датотеку отворену. Овде можете да мењате шта год желите, али не можете да сачувате. Користите Датотека, Сачувај као да сачувате у другу датотеку.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Пажња: није успело повезивање са сервером ради провере или креирања закључавања на овом пројекту, па ништа не спречава колегу да истовремено уређује исту датотеку. Бићете обавештени када закључавање поново проради.';
$ec_lang['lpn_lock_storage_error']='Пажња: ова страница не може да сачува записе закључавања, па ништа не спречава колегу да истовремено уређује исту датотеку. Ово је грешка у подешавању на серверу, коју овде не можете исправити — фасцикла закључавања није уписива за веб сервер.';
$ec_lang['lpn_lock_full_error']='Пажња: овој страници је понестало простора за бележење ко има који пројекат отворен, па ништа не спречава колегу да истовремено уређује исту датотеку. Ово је грешка у подешавању на серверу, коју овде не можете исправити.';
$ec_lang['lpn_lock_not_asked']='Закључавање не ради за овај пројекат, па ништа не спречава колегу да истовремено уређује исту датотеку. Овај прегледач за вас још нема сачувано име, или пројекат нема идентификатор — чување пројекта у датотеку поставља обоје.';
$ec_lang['lpn_lock_restored']='Закључавање поново ради, и ова датотека сада је ваша за чување.';
$ec_lang['lpn_lock_dismiss']='Сакриј ову поруку';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Ваш пројекат ће бити сачуван у датотеци на овом рачунару. Чува се када затражите, и ни у једном другом тренутку, тако да се ништа не уписује у ту датотеку без вашег знања.';
$ec_lang['lpn_file_training_2']='Да две особе никада не би истовремено уређивале једну датотеку, ова страница прати ко је има отворену. Ако је неко други већ има, и даље можете да је отворите и погледате, или да задржите сопствену копију.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='Приликом првог чувања, ваш прегледач ће питати да ли ова страница сме да уређује датотеку. То питање долази од прегледача, а не од нас, и одговарање са да је оно што омогућава да Сачувај упише ваш рад назад. Обично се пита само једном по датотеци.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='Настави';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Изаберите датотеку поново';
$ec_lang['lpn_file_reconnect']='Поново се повежи са овом датотеком';
$ec_lang['lpn_file_reconnect_alert']='Овај пројекат потиче из {file}. Вашем прегледачу је поново потребна ваша дозвола пре него што може да пише у њу. Поново се повежите испод.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='То је иста датотека коју неко други има отворену, па се не може преписати. Изаберите другу датотеку или друго име.';
$ec_lang['lpn_saveas_overwrites_project']='Та датотека већ садржи други пројекат, {name}. Чување овде га потпуно замењује. Наставити?';
$ec_lang['lpn_saveas_overwrites_newer']='Та датотека се променила откако сте је последњи пут видели, па је скоро сигурно да је неко други сачувао у њу. Чување овде замењује њихову верзију вашом. Наставити?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Назив за овај пројекат';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='Затворено {closed}. Сада приказано {opened}.';
$ec_lang['lpn_status_closed_empty']='Затворено {closed}. Покренут нови празан пројекат.';
$ec_lang['lpn_storage_full']='Није сачувано. Складиште прегледача је пуно или недоступно, па ће ваше недавне измене бити изгубљене када затворите ову картицу.';
$ec_lang['lpn_storage_unreadable']='Није сачувано. Овај пројекат није могао да се прочита из складишта прегледача. Сачувана копија остаје потпуно непромењена и неће бити преписана, тако да се ништа на овој картици тренутно не чува. Отворите датотеку или направите нови пројекат да бисте наставили с радом.';
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
$ec_lang['lpn_about_credits']='Заслуге';
$ec_lang['lpn_help_welcome']='Почетна страница';
$ec_lang['lpn_about_license']='Лиценцирано под лиценцом GNU General Public License v3.0 или новијом.';
$ec_lang['lpn_notes_1_term']='Како се решава';
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
$ec_lang['lpn_notes_1_def']='Сваки тренутак се решава истим алгоритмом глобалног градијента који користи EPANET. Поставите укупно време рада и EPANET решавач ће редом израчунати сваки извештајни корак: тенкови се пуне и празне, потрошње прате своје обрасце, а трака алата репродукује ток прорачуна. Уграђени решавач израчунава један тренутак истовремено и држи сваки тенк на почетном нивоу.';
$ec_lang['lpn_notes_2_term']='Није моделовано';
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
$ec_lang['lpn_notes_2_def']='Хемија квалитета воде се не моделује; старост воде и праћење извора се моделују. Вентили: пригушни вентил ради у оба решавача, а вентили који сами постављају свој положај (PRV, PSV, FCV) се решавају EPANET решавачем, који ова страница сама укључује када ваша мрежа садржи неки од тих вентила.';
$ec_lang['lpn_notes_3_term']='Чување пројеката';
$ec_lang['lpn_notes_3_def']='Сваки пројекат је картица, и свака картица се чува у овом прегледачу током рада. Брисање података прегледача брише их све, зато чувајте свој рад у датотеци: Датотека, Сачувај као. Звездица на картици значи да она садржи измене које нису у датотеци. Ништа се никада не уписује у датотеку осим ако не затражите. У неким прегледачима пројекат се повезује са датотеком у коју га сачувате, и Датотека, Сачувај од тада уписује назад у ту исту датотеку; у другима веза није могућа, па је Сачувај онемогућено и доступно је само Сачувај као. Када се пројектна датотека чува на дељеном диску, ова страница вам говори ако је колега већ има отворену, како двоје људи не би преписивали једно преко другог.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Крива пумпе';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Пумпа прати H = H₀ − aQ^b, где је H напор који пумпа додаје, а Q проток кроз њу. Унесите једну, две или три тачке са произвођачеве криве. Три тачке — напор при нултом протоку, нормална радна тачка и тачка највећег протока — директно одређују H₀, a и b, и најближе прате објављену криву. Две тачке дају параболу (b = 2) са врхом при нултом протоку. Једна тачка користи уобичајено правило: напор при нултом протоку је 1,33 × напор који унесете, а највећи проток је 2 × проток који унесете, што опет даје b = 2. Пумпа без унетих тачака не додаје никакав напор. Крива се не прекида тамо где напор достигне нулу, па тражење од пумпе више протока него што њена крива може да испоручи даје негативан напор. Решење је већа пумпа или мања потрошња, а не другачије уклапање криве. Крива може садржати више од три тачке. Уграђени решавач чита три од њих — прву, средњу и последњу — да би уклопио горњу једначину; EPANET решавач чита сваку тачку коју сте унели.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='Такође на овој страници';
$ec_lang['lpn_notes_4_def']='Пројекат може стајати на стварном терену са уличним планом иза себе. EPANET .inp датотеке се могу учитавати и извозити. Доњи панел исцртава профил дуж путање и наводи чворове. Елементи могу бити обојени према својим резултатима, а Пронађи издваја сваки елемент који испуњава услов који поставите.';
$ec_lang['lpn_notes_6_term']='Помоћ за колоне табеле';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Изабери колону</td><td>Кликните заглавље</td></tr><tr><td>Додај или прошири избор колона</td><td>Ctrl+клик или Shift+клик на друго заглавље</td></tr><tr><td>Помери (промени редослед) изабране колоне</td><td>Превуците или користите Управљај колонама… у менију десног клика или ⋮</td></tr><tr><td>Мени ⋮ и стрелица за сортирање.</td><td>Лебдите изнад горњег угла заглавља, или изаберите или уђите у заглавље тастером Tab</td></tr><tr><td>Сакриј, Прикажи све, или управљај видљивошћу и редоследом</td><td>Десни клик на заглавље или мени ⋮ у горњем десном углу заглавља</td></tr><tr><td>Сортирај по колони</td><td>Иконица стрелице у горњем десном углу заглавља</td></tr><tr><td>Налепи као нове редове на крају табеле</td><td>Десни клик, мени ⋮ у горњем десном углу заглавља, или Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Пречице на тастатури за табелу';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Тастери стрелица</td><td>Кретање.</td></tr><tr><td>Tab, Enter</td><td>Заврши унос и пређи једну ћелију удесно / надоле.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Кретање уназад.</td></tr><tr><td>Shift+тастери стрелица</td><td>Прошири избор.</td></tr><tr><td>Ctrl+C</td><td>Копирај избор.</td></tr><tr><td>Ctrl+D</td><td>Попуни избор надоле од његовог горњег реда.</td></tr><tr><td>Ctrl+Enter</td><td>Попуни избор вредношћу активне ћелије.</td></tr><tr><td>Ctrl+A</td><td>Изабери целу табелу.</td></tr><tr><td>Ctrl+Shift+V</td><td>Налепи као нове редове на крају табеле.</td></tr><tr><td>Delete</td><td>Обриши ћелију.</td></tr><tr><td>F2</td><td>Отвори ћелију за уређивање.</td></tr><tr><td>Esc</td><td>Откажи уређивање.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Границе опсега боја остају исте';
$ec_lang['lpn_notes_color_def']='Границе опсега боја се постављају када изаберете методу расподеле опсега. Не постављају се поново у сваком временском кораку, јер би то учинило да боје у сваком кораку значе нешто ново, а то не помаже визуелизацији вашег система. EPANET ради на исти начин. Да бисте добили нове границе, изаберите методу поново или упишите сопствене границе.';
$ec_lang['lpn_notes_epanet_term']='Hazen-Williams константе усклађене са EPANET-ом';
$ec_lang['lpn_notes_epanet_def']='У августу 2026. коефицијент и експонент Hazen-Williams формуле су измењени да се ускладе са EPANET-ом. Резултати губитка напора разликују се од ранијих верзија ове странице до 0,1 процента, што је далеко мање од неизвесности саме вредности C.';
$ec_lang['lpn_notes_engine_term']='Која верзија EPANET-а покреће ову страницу';
$ec_lang['lpn_notes_engine_def']='EPANET решавач на овој страници је OWA-EPANET 2.3.5, издат 20. фебруара 2025. EPANET развија Open Water Analytics, заједница која сарађује са америчком Агенцијом за заштиту животне средине (EPA), која је издала верзију 2.2.0 у децембру 2019. Извештај о прорачуну га зове 2.3.05 јер механизам последњи број пише са две цифре. До ове странице долази преко epanet-js 0.9.0 аутора Luke Butler, под MIT лиценцом, и ради унутар вашег прегледача: ваша мрежа се никада не шаље на решавање негде другде.';
$ec_lang['lpn_id_invalid']='Унесите ID без размака и без наводника.';
$ec_lang['lpn_id_taken']='Тај ID је већ у употреби.';
$ec_lang['lpn_diag_no_fixed_head']='Додајте резервоар или тенк. Мрежи је потребан бар један познат ниво воде пре него што може да се реши.';
$ec_lang['lpn_diag_dangling_link']='Цев или пумпа повезује се на чвор који више не постоји:';
$ec_lang['lpn_diag_unreachable']='Ови чворови немају пут до резервоара:';
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
$ec_lang['lpn_engine_fetching']='Преузимање EPANET решавача. Преузима се једном и потом чува на овом уређају, тако да након тога ради и без интернета.';
$ec_lang['lpn_engine_ready']='EPANET решавач је сада на овом уређају и ради без интернета.';
$ec_lang['lpn_engine_fetching_valve']='Преузимање EPANET решавача, како би овај вентил могао да се реши сада и без интернета касније.';
$ec_lang['lpn_engine_ready_valve']='EPANET решавач је сада на овом уређају. Вентили који се сами отварају и затварају радиће и без интернета.';
$ec_lang['lpn_engine_unavailable']='EPANET решавач није могао да се преузме, а он је тај који решава вентиле који се сами отварају и затварају. Повежите се на интернет једном и он ће остати сачуван на овом уређају убудуће.';
$ec_lang['lpn_engine_needed_loading']='Учитавање EPANET решавача док градите. Резултати ће бити доступни када се потпуно учита.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Напредак учитавања решавача';
$ec_lang['lpn_engine_wait']='Учитавање решавача. Резултати ће накратко закаснити. Наставите да радите.';
$ec_lang['lpn_engine_wait_pct']='Решавач учитан {percent}%.';
$ec_lang['lpn_engine_wait_bytes']='Решавач учитан {kb} KB до сада. Укупна величина није доступна, па проценат завршетка није познат.';
$ec_lang['lpn_engine_needed_failed']='EPANET решавач још није учитан, не може да се учита, а ова мрежа може да се реши само помоћу њега. Биће учитан када будете повезани на интернет.';
$ec_lang['lpn_diag_valve_needs_epanet']='Ови вентили се сами отварају и затварају, а само их EPANET решавач може израчунати. EPANET решавач није могао да се учита, па следећи резултати недостају:';
$ec_lang['lpn_diag_valve_on_fixed_head']='Ови вентили су директно повезани на резервоар или тенк, који већ одређује ниво воде тамо, па вентилу не остаје ништа да регулише. Поставите кратку цев између вентила и резервоара или тенка:';
$ec_lang['lpn_diag_not_converged']='Решење није пронађено. Проверите да ли постоје вредности које су у стварности немогуће, попут пречника нула.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='Решавање није конвергирало. Ови бројеви су последња итерација, не решење. Не користите их.';
$ec_lang['lpn_diag_not_converged_trials']='Заустављено је после {iterations} итерација.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='Заустављено је после {iterations} итерација, при релативној грешци од {error}, што није достигло подешавање Тачност од {accuracy}.';
$ec_lang['lpn_field_roughness']='Храпавост';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='Hazen-Williams C. Већи број значи глађу цев: око 150 за нову пластику, 130 за нови челик или гвожђе, и 100 за стару цев.';
$ec_lang['lpn_field_length']='Дужина';
$ec_lang['lpn_field_from']='Од';
$ec_lang['lpn_field_to']='До';
$ec_lang['lpn_field_length_tip']='Дужина цеви. Када је Аутоматски укључено, дужина се мери према ономе што сте нацртали. Искључите Аутоматски да бисте уписали дужину која се разликује од цртежа.';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Тип вентила';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Шта вентил ради. Пригушни вентил задржава фиксан губитак. Остала три задржавају притисак или проток и потпуно се отварају, затварају или делимично затварају како се вода мења. Промена типа уписује нову почетну вредност у поставку испод, јер притисак није проток, а ниједно од то двоје није коефицијент губитка.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Пригушни вентил (TCV)';
$ec_lang['lpn_valve_type_prv']='Вентил за смањење притиска (PRV)';
$ec_lang['lpn_valve_type_psv']='Вентил за одржавање притиска (PSV)';
$ec_lang['lpn_valve_type_fcv']='Вентил за регулацију протока (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Вентил за обарање притиска (PBV)';
$ec_lang['lpn_valve_type_gpv']='Општа намена (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Пад притиска';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='Притисак који вентил одузима. Вентил за обарање притиска увек одузима тачно овај износ притиска, без обзира на смер протицања воде. То је пад притиска на вентилу, а не притисак који треба одржавати.';
$ec_lang['lpn_inp_drop_gpv_curve']='Овај вентил упућује на криву губитка напора која се не налази у датотеци. Вентил је пренет без криве, па остаје потпуно отворен док му је не доделите.';
$ec_lang['lpn_gpv_curve_source']='Крива губитка напора вентила';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='Крива у оквиру Библиотеке која говори колики напор овај вентил губи при сваком протоку. Више вентила може користити исту криву, а измена тамо мења све њих. Овај вентил чува само упућивање; саме тачке се читају и мењају под Библиотеке, Криве.';
$ec_lang['lpn_field_valve_setting_pressure']='Подешавање притиска';
$ec_lang['lpn_field_valve_setting_pressure_tip']='Притисак који вентил одржава. Вентил за смањење притиска одржава притисак на низводној страни на овој вредности или испод ње. Вентил за одржавање притиска одржава притисак на узводној страни на овој вредности или изнад ње.';
$ec_lang['lpn_field_valve_setting_flow']='Подешавање протока';
$ec_lang['lpn_field_valve_setting_flow_tip']='Највећа количина воде коју вентил пропушта. Када мања количина воде од ове жели да прође, вентил остаје потпуно отворен и не додаје губитак.';
$ec_lang['lpn_field_valve_setting']='Подешавање';
$ec_lang['lpn_field_valve_setting_loss']='Коефицијент губитка';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Колико напора пригушни вентил одузима, изражено као умножак брзинског напора. Користите 0 за вентил који стоји потпуно отворен. Овај један број представља цео губитак пригушног вентила.';
$ec_lang['lpn_field_valve_diameter_tip']='Ширина отвора кроз вентил. Брзина воде кроз вентил се рачуна из ове ширине, а губитак произлази из те брзине.';
$ec_lang['lpn_field_valve_km_tip']='Губитак услед тела вентила док вентил стоји потпуно отворен, поред онога што одузима подешавање вентила. Изражава се као умножак брзинског напора. Користите 0 да га занемарите.';
$ec_lang['lpn_field_km']='Коефицијент мањег (локалног) губитка, k';
$ec_lang['lpn_field_km_tip']='Губитак услед кривина, вентила и фитинга на овој цеви, изражен као умножак брзинског напора. Користите 0 за обичну праву цев.';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Локални губитак, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Крива напора пумпе';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='Крива у оквиру Библиотеке која говори колики напор ова пумпа додаје при сваком протоку. Више пумпи може користити исту криву, а измена тамо мења све њих. Ова пумпа чува само упућивање; саме тачке се читају и мењају под Библиотеке, Криве.';
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
$ec_lang['lpn_field_desc']='Опис';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
$ec_lang['lpn_field_desc_tip']='За вашу сопствену употребу, на пример угао улице или од чега је цев направљена. Преноси се у и из EPANET датотеке, где стоји на крају реда тог дела. Ниједан прорачун га не чита. Прелом реда постаје размак, јер датотека нема где да га стави.';
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='Таг';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='Таг може имати било које значење које вам треба, попут зоне притиска или радног налога. Ниједан прорачун овде нити у EPANET-у га не чита. Таг је једна реч: EPANET престаје да чита на првом размаку, па се размак одбија док га уносите. Преноси се у EPANET датотеку и из ње.';
$ec_lang['lpn_pump_effic_curve']='Крива ефикасности пумпе';
$ec_lang['lpn_pump_effic_curve_tip']='Крива у оквиру Библиотеке која говори колико је ова пумпа ефикасна при сваком протоку. Више пумпи може користити исту криву, а измена тамо мења све њих. Ова пумпа чува само упућивање; саме тачке се читају и мењају под Библиотеке, Криве.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Нема изабране криве';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Криве';
$ec_lang['lpn_curve_library_link_tip']='Отвара оквир Библиотеке на одељку Криве, где се крива додаје, описује, мења и брише. Елемент наводи коју криву користи.';
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
$ec_lang['lpn_curve_kind_head']='Напор пумпе';
$ec_lang['lpn_curve_kind_effic']='Ефикасност пумпе';
$ec_lang['lpn_curve_kind_volume']='Запремина тенка';
$ec_lang['lpn_curve_kind_headloss']='Губитак напора вентила';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Врста није наведена';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Запремина';
$ec_lang['lpn_pump_effic_col']='Ефикасност';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='Ова пумпа нема изабрану криву ефикасности, па ради на ефикасности постављеној за целу мрежу, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='Ова пумпа упућује на криву ефикасности под именом {name}, коју ништа у овом пројекту не дефинише, па ради на ефикасности постављеној за целу мрежу, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Режим: Избор. Кликните елемент или ознаку да бисте је видели или изменили. Превуците да бисте померили чвор, тачку прегиба или ознаку. Користите алат Тачке прегиба да бисте додали или уклонили превоје цеви.';
$ec_lang['lpn_mode_delete']='Режим: Брисање. Кликните елемент да бисте га уклонили.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Режим: Тачке прегиба. Тачке прегиба сваке цеви приказане су као мали квадратни маркери. Кликните на цев да бисте додали тачку прегиба, кликните на маркер да бисте га уклонили, или га превуците да бисте га померили. Ништа друго на мапи се не мења у овом режиму.';
$ec_lang['lpn_mode_zoom_window']='Режим: Увећавање подручја. Кликните два наспрамна угла оквира, или превуците један, на мапи да увећате то подручје.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Ништа није изабрано. Прво кликните на елемент на мапи, а затим притисните тастер Delete.';
$ec_lang['lpn_mode_add_junction']='Режим: Додавање чвора. Кликните на мапу да бисте поставили чвор. Пређите у режим Избор да бисте мењали или померали елементе и ознаке.';
$ec_lang['lpn_mode_add_reservoir']='Режим: Додавање резервоара. Кликните на мапу да бисте поставили резервоар. Пређите у режим Избор да бисте мењали или померали елементе и ознаке.';
$ec_lang['lpn_mode_add_tank']='Режим: Додавање тенка. Кликните на мапу да бисте поставили тенк. Пређите у режим Избор да бисте мењали или померали елементе и ознаке.';
$ec_lang['lpn_mode_add_pipe']='Режим: Додавање цеви. Кликните на чвор, па на други чвор, да бисте их повезали. Кликните на празан простор између да бисте савили линију, или притисните тастер Esc да бисте почели изнова. Пређите у режим Избор да бисте мењали или померали елементе и ознаке.';
$ec_lang['lpn_mode_add_pump']='Режим: Додавање пумпе. Кликните на чвор, па на други чвор, да бисте их повезали. Кликните на празан простор између да бисте савили линију, или притисните тастер Esc да бисте почели изнова. Пређите у режим Избор да бисте мењали или померали елементе и ознаке.';
$ec_lang['lpn_mode_add_valve']='Режим: Додавање вентила. Кликните на чвор, па на други чвор, да бисте их повезали. Кликните на празан простор између да бисте савили линију, или притисните тастер Esc да бисте почели изнова. Пређите у режим Избор да бисте мењали или померали елементе и ознаке.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Режим: Додавање текста. Кликните на мапу да бисте поставили текст. Кликните близу чвора да бисте везали текст за тај чвор. Пређите у режим Избор да бисте мењали или померали елементе и ознаке.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Користите овај режим да бисте мењали, померали и превлачили ствари на мапи. Ово је режим у који се страница подразумевано враћа: сама се враћа овде после неких радњи, као што је отварање пројекта, а тастер [Esc] враћа вас овде из било ког другог режима.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tip_labels_draggable']='Ознаку можете превући да бисте је померили. Двапут кликните на ознаку да бисте је вратили на аутоматски положај.';
$ec_lang['lpn_field_auto']='Аутоматски';
$ec_lang['lpn_method_switch_confirm']='Промена методе трења не мења бројеве храпавости који су већ уписани на вашим цевима, а храпавост за једну методу је бесмислена за другу. Проверите сваку цев након ове промене. Да ли ипак желите да је промените?';
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
$ec_lang['lpn_field_closed']='Затворено';
$ec_lang['lpn_field_closed_tip']='Затворите ову цев тако да кроз њу не може да прође вода. Цев остаје на мапи и задржава све своје бројеве, а можете је поново отворити у било ком тренутку.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Географска дужина';
$ec_lang['lpn_field_lat']='Географска ширина';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='Нортинг';
$ec_lang['lpn_field_easting']='Истинг';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='С';
$ec_lang['lpn_field_easting_abbr']='И';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='Гш';
$ec_lang['lpn_field_lon_abbr']='Гд';
// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='Упишите координату да бисте овај чвор поставили тачно. У сценарију ова локација важи само у том сценарију, исто као и превлачење; у Основном поставља чвор свуда.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='То је ван мапе. Pseudo Mercator географска ширина се креће од -85,05 до 85,05, а дужина од -180 до 180.';
$ec_lang['lpn_field_text_size']='Множилац величине';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Прикажи на свим нивоима зума';
$ec_lang['lpn_field_text_all_zoom_tip']='Задржи овај текст на цртежу без обзира колико се удаљите зумом. Искључите и текст се крије са осталим ознакама чим приказ постане шири од прага означавања постављеног под Мапа и страница.';
$ec_lang['lpn_tool_labels']='Ознаке';
$ec_lang['lpn_labels_heading_node']='Ознаке чворова';
$ec_lang['lpn_labels_heading_link']='Ознаке веза';
$ec_lang['lpn_labels_decimals_tip']='Број децимала приказан за ову ознаку';
$ec_lang['lpn_labels_mark_extrema']='Означи највеће и најмање вредности';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='Исцртава линију изнад највише вредности сваке означене особине на мапи (надвучена линија), и линију испод најниже вредности те особине (подвучена линија), тако да можете уочити највишу и најнижу вредност без читања бројева.';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Примени на све';
$ec_lang['lpn_settings_apply_to_all_tip']='Сваки већ нацртани елемент ове врсте добија ID који почиње овим текстом. Сваки задржава свој број. ID који се не завршава бројем остаје непромењен.';
$ec_lang['lpn_confirm_apply_prefix']='Преименовати {n} елемената тако да њихови ID-јеви почињу са {prefix}? Сваки задржава свој број.';
$ec_lang['lpn_prefix_applied']='Преименовано {n} елемената. {skipped} других је остављено непромењено.';
$ec_lang['lpn_labels_prefix_tip']='Текст додат испред ове особине на ознакама мапе';
$ec_lang['lpn_labels_suffix_tip']='Текст додат после ове особине на ознакама мапе';
$ec_lang['lpn_labels_suffix_gradient_tip']='Текст додат после градијента губитка напора на ознакама мапе. Овде не уписујте знак процента. Он се додаје аутоматски када су јединице проценти.';
$ec_lang['lpn_labels_separator']='Текст између вредности';
$ec_lang['lpn_labels_separator_tip']='Текст између једне особине и следеће на ознаци. Подразумевано је размак.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='Приоритет';
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_link_tip']='Редослед по којем се вредности изостављају када ознака не стаје. 1 се задржава најдуже.';
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='Редослед по којем се особине изостављају када би се две ознаке чворова преклопиле. Особина означена бројем 1 се изоставља прва, на обе ознаке. Када остане једна особина а обе се и даље преклапају, цела ознака се сакрива: она чија је преостала вредност најмање вредна приказивања, што значи најнижа потрошња, притисак најближи средини опсега, или кота или напор најближи суседним чворовима.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='Пре';
$ec_lang['lpn_labels_col_after']='После';
$ec_lang['lpn_labels_col_decimals']='Децимале';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='Прикажи';
$ec_lang['lpn_labels_show_tip']='Редослед којим се вредности појављују на ознаци. Вредност означена бројем 1 долази прва: на врху наслагане ознаке, и на почетку ознаке у једном реду.';
$ec_lang['lpn_labels_priority_customer_tip']='Редослед којим се вредности изостављају са ознаке потрошача. Вредност означена бројем 1 се изоставља прва.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Користи јединице';
$ec_lang['lpn_labels_use_units_tip']='Означите да прикажете јединицу у пољу После и на ознаци, и да је ускладите када се јединице промене. Искључите да упишете сопствени текст После.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='Почетно стање';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Боје чворова';
$ec_lang['lpn_settings_sym_link_colors']='Боје веза';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Позадинска слика…';
$ec_lang['lpn_backdrop_add']='Додај';
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
$ec_lang['lpn_backdrop_scale']='Одреди размеру бирањем';
$ec_lang['lpn_backdrop_scale_entry']='Размера према ворлд-фајлу или величини пиксела на мапи';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Размера од тренутне величине, око тачке коју изаберете';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Кликните тачку на позадинској слици која треба да остане на свом месту.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Размера од тренутне величине. 1 је задржава истом, 1,1 је увећава за 10%, 0,9 је умањује за 10%.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Унесите величину једног пиксела на мапи, или налепите цео садржај ворлд-фајла за слику';
$ec_lang['lpn_backdrop_scale_entry_bad']='Унесите један број за величину пиксела на мапи, или налепите свих шест редова ворлд-фајла.';
$ec_lang['lpn_backdrop_wld_bad']='Овај ворлд-фајл ротира, огледално обрће или неравномерно развлачи слику. Мапа може само да помери слику и промени њену величину подједнако у оба правца, па фајл није коришћен.';
$ec_lang['lpn_backdrop_unreadable']='Ваш прегледач не може да прикаже ову слику. Сачувајте је као PNG или JPEG и додајте је поново.';
$ec_lang['lpn_backdrop_position']='Помери';
$ec_lang['lpn_backdrop_remove']='Уклони';
$ec_lang['lpn_backdrop_remove_confirm']='Уклонити позадинску слику?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='Мапа света…';
$ec_lang['lpn_map_attach_tip']='Прикачите мапу света на овај пројекат, а да га ни на који други начин не промените.';
$ec_lang['lpn_map_attach_add']='Прикачи';
$ec_lang['lpn_map_attach_readjust']='Прилагоди поново';
$ec_lang['lpn_map_attach_readjust_tip']='Врати се на Корак 2 поступка прикачињавања мапе.';
$ec_lang['lpn_map_attach_scale_from']='Размери од тренутне величине…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Размерите мапу од њене тренутне величине, око средине вашег цртежа. 1 је задржава истом, 1,1 је увећава за 10%, 0,9 је умањује за 10%.';
$ec_lang['lpn_map_attach_scale_from_bad']='Унесите један број већи од нуле.';
$ec_lang['lpn_map_attach_scale_from_done']='Мапа је промењене величине, а ваш цртеж и свака координата у њему остају потпуно исти.';
$ec_lang['lpn_map_attach_none']='Мапа света још није прикачена на овај пројекат. Прво користите Мапа, Мапа света, Прикачи.';
$ec_lang['lpn_map_attach_remove']='Одвоји';
$ec_lang['lpn_map_attach_remove_tip']='Уклони мапу света. Цртеж и његове координате остају нетакнути у сваком случају.';
$ec_lang['lpn_map_attach_done']='Мапа света је сада иза вашег цртежа, а ваш пројекат је непромењен. Користите Мапа, Мапа света, Одвоји да је поново уклоните.';
$ec_lang['lpn_map_attach_removed']='Мапа света је уклоњена, а цртеж је потпуно исти какав је био.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Ваш цртеж се налази на мапи целог света, у океану на нултој географској ширини и нултој дужини. Прво пронађите своје место: померајте и зумирајте мапу иза цртежа, потражите назив места, или упишите географску ширину и дужину. Сам цртеж се не помера.';
$ec_lang['lpn_mapgeo_step1']='Корак 1 од 2: пронађите своје место у свету';
$ec_lang['lpn_mapgeo_step2']='Корак 2 од 2: уклопите мапу иза свог цртежа';
$ec_lang['lpn_mapgeo_hint1']='Померајте и зумирајте мапу иза свог цртежа, или потражите место, или упишите географску ширину и дужину. Затим притисните Постави приближно.';
$ec_lang['lpn_mapgeo_readjust_intro']='Ваш цртеж је тамо где сте га последњи пут поставили. Да бисте га преместили негде другде, померајте и зумирајте мапу иза цртежа, потражите назив места, или упишите географску ширину и дужину. Сам цртеж се не помера.';
$ec_lang['lpn_mapgeo_hint2']='Превуците било где да померите мапу испод свог цртежа. Ваш цртеж и свака координата у њему остају потпуно на свом месту. Притисните Геореференцирај овде када мапа буде тачна.';
$ec_lang['lpn_mapgeo_gestures']='Зумирање помера ваш цртеж и мапу заједно, тако да видите колико добро се поклапају. Превлачење помера само мапу.';
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
$ec_lang['lpn_mapgeo_dial_turn']='Ротирај мапу';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} степени';
$ec_lang['lpn_mapgeo_dial_size']='Величина мапе';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} пута';
$ec_lang['lpn_mapgeo_dial_help']='Превуците две траке, или упишите у пољима изнад њих, да мапу учините већом или мањом и да је ротирате. Средина сваке траке је корак 1 уклапања, па 1 и 0 значе не мењај ништа. Тастери стрелица раде на обема.';
$ec_lang['lpn_mapgeo_place']='Постави приближно';
$ec_lang['lpn_mapgeo_finish']='Геореференцирај овде';
$ec_lang['lpn_mapgeo_cancelled']='Мапа света је враћена тамо где је била, а ваш цртеж се никада није померио.';
$ec_lang['lpn_mapgeo_locked']='Завршите дугметом Геореференцирај овде, или притисните Откажи, пре него што промените пројекат или сачувате. Мапа света се још увек поставља.';
$ec_lang['lpn_backdrop_scale_prompt1']='Кликните две тачке на позадинској слици, на пример два краја размерне траке. Затим упишите стварно растојање између њих.';
$ec_lang['lpn_backdrop_scale_prompt2']='Стварно растојање између те две тачке';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Кликните базну тачку (на слици) за померање.';
$ec_lang['lpn_backdrop_position_prompt2']='Изаберите метод за одредишну тачку, па кликните Настави.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Подешавање позадинске слике.';
$ec_lang['lpn_backdrop_target_label']='Помери ту тачку на:';
$ec_lang['lpn_backdrop_target_node']='Чвор';
$ec_lang['lpn_backdrop_target_free']='Било коју тачку на мапи';
$ec_lang['lpn_backdrop_target_coords']='Координате које упишете';
$ec_lang['lpn_backdrop_coords_prompt']='Упишите X, Y координате на које та тачка треба да се помери';
$ec_lang['lpn_backdrop_continue']='Настави';
$ec_lang['lpn_tool_settings']='Подешавања';
$ec_lang['lpn_settings_show_titles']='Прикажи наслове странице';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_show_titles_tip']='Сакрива наслов странице и уводни ред изнад цртежа, тако да мапа има више простора. Штампање се не мења.';
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Сакриј ове наслове';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Прикажи помоћ за избор';
$ec_lang['lpn_settings_area_hint_tip']='Приказује облачић изнад мапе који каже шта ће урадити ваш следећи клик док бирате подручје.';
$ec_lang['lpn_settings_id_prefixes']='Префикси ID-а';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Почетне вредности';
$ec_lang['lpn_settings_defaults_note']='Користи се за елементе које направите од сада надаље. Постојећи елементи се не мењају.';
$ec_lang['lpn_settings_push_note']='Примењују се само својства чије су ознаке тренутно приказане.';
$ec_lang['lpn_settings_push_btn']='Примени ове вредности за нове елементе на сваки постојећи елемент';
$ec_lang['lpn_push_confirm']='Заменити ове особине на сваком постојећем елементу вредностима које су сада постављене за нове елементе? Вредности које сте уписали биће преписане. Ово можете опозвати.';
$ec_lang['lpn_push_properties']='Својства:';
$ec_lang['lpn_push_assets']='Чворови и цеви:';
$ec_lang['lpn_push_none_displayed']='Ниједна почетна вредност тренутно није приказана као ознака, па нема шта да се примени. Укључите ознаке за својства која желите у панелу Ознаке, па покушајте поново.';
$ec_lang['lpn_push_nothing']='Ниједан постојећи елемент нема ниједну од особина које се примењују.';
$ec_lang['lpn_push_no_change']='Сваки елемент већ има ове вредности, па се ништа не би променило.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Прилагођена својства';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='Својства која сами дефинишете за сопствене потребе. Чувају се уз пројекат и сценарије као и сва остала својства.';
$ec_lang['lpn_cp_design']='Дизајн';
$ec_lang['lpn_cp_design_tip']='По један ред за свако прилагођено својство, и сваки се отвара да прикаже: Кључ, Ознака, Односи се на, Провери као, Дозволи или ограничи, поље за карактере именовано тим избором, Доњу границу дужине, Горњу границу дужине, Доњу границу, Горњу границу.';
$ec_lang['lpn_cp_add']='Додај прилагођено својство';
$ec_lang['lpn_cp_add_tip']='Додаје ред у табелу дизајна и отвара га за уређивање.';
$ec_lang['lpn_cp_remove']='Уклони';
$ec_lang['lpn_cp_remove_tip']='Уклања ово својство из табеле дизајна. Вредности које сте већ унели на вашим елементима остају сачуване у датотеци и враћају се ако поново дефинишете исти кључ.';
$ec_lang['lpn_cp_none']='Још ниједно прилагођено својство није дефинисано.';
$ec_lang['lpn_cp_unnamed']='Још без назива';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Кључ';
$ec_lang['lpn_cp_key_tip']='Кључ: Својство се чува под овим називом. Размаци нису дозвољени, а префикс се додаје аутоматски како ваш кључ никада не би сукобио с уграђеним пољем.';
$ec_lang['lpn_cp_label']='Ознака';
$ec_lang['lpn_cp_label_tip']='Ознака: Читалац ово види у прозору својстава, у Пронађи и на врху колоне табеле.';
$ec_lang['lpn_cp_applies']='Односи се на';
$ec_lang['lpn_cp_applies_tip']='Односи се на: Списак префикса ИД-а раздвојен запетама за елементе који користе ово својство, на пример J,L,R.';
$ec_lang['lpn_cp_validate']='Провери као';
$ec_lang['lpn_cp_validate_tip']='Провери као: Ово говори како изгледа исправна вредност. Правила о величини слова важе само за енглески алфабет, што је наведено ограничење. Изаберите Не проверавај да бисте прихватили било шта.';
$ec_lang['lpn_cp_restrict']='Ограничи ове карактере';
$ec_lang['lpn_cp_restrict_tip']='Ограничи ове карактере: Вредност сме да користи само наведене карактере, или ниједан од њих, где „@“ означава било које слово; „#“ означава било коју цифру, а „-“, „.“ и „,“ морате посебно навести ако су дозвољени; сваки размак мора бити између других карактера.';
$ec_lang['lpn_cp_restrict_mode']='Дозволи или ограничи';
$ec_lang['lpn_cp_restrict_mode_tip']='Дозволи или ограничи: Наведени карактери су или једини које вредност сме да користи, или они које не сме да користи.';
$ec_lang['lpn_cp_restrict_allow']='Дозволи само ове карактере';
$ec_lang['lpn_cp_restrict_deny']='Ограничи ове карактере';
$ec_lang['lpn_cp_minlength']='Доња граница дужине';
$ec_lang['lpn_cp_minlength_tip']='Доња граница дужине: Сваки краћи унос се означава, тако проналазите празне и напола унете вредности.';
$ec_lang['lpn_cp_length']='Горња граница дужине';
$ec_lang['lpn_cp_length_tip']='Горња граница дужине: Сваки дужи унос се означава.';
$ec_lang['lpn_cp_low']='Доња граница';
$ec_lang['lpn_cp_low_tip']='Доња граница: Ово је најмања вредност коју очекујете. Бројеви се упоређују као бројеви, а текст по азбучном реду.';
$ec_lang['lpn_cp_high']='Горња граница';
$ec_lang['lpn_cp_high_tip']='Горња граница: Ово је највећа вредност коју очекујете. Бројеви се упоређују као бројеви, а текст по азбучном реду.';
$ec_lang['lpn_cp_val_none']='Не проверавај';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Број .';
$ec_lang['lpn_cp_val_number_comma']='Број ,';
$ec_lang['lpn_cp_val_integer']='Цео број';
$ec_lang['lpn_cp_val_upper']='СВА ВЕЛИКА СЛОВА';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} Вредност се задржава тачно онако како сте је унели.';
$ec_lang['lpn_cp_bad_number']='Ова вредност није број, а то се захтева за ово својство.';
$ec_lang['lpn_cp_bad_integer']='Ова вредност није цео број, а то се захтева за ово својство.';
$ec_lang['lpn_cp_bad_case']='Ова вредност није у формату ALL CAPS, а то се захтева за ово својство.';
$ec_lang['lpn_cp_bad_chars']='Ова вредност користи карактер који ово својство не дозвољава.';
$ec_lang['lpn_cp_bad_space']='Размак је дозвољен само између других карактера.';
$ec_lang['lpn_cp_bad_minlength']='Ова вредност је краћа него што ово својство дозвољава.';
$ec_lang['lpn_cp_bad_length']='Ова вредност је дужа него што ово својство дозвољава.';
$ec_lang['lpn_cp_bad_low']='Ова вредност је испод доње границе овог својства.';
$ec_lang['lpn_cp_bad_high']='Ова вредност је изнад горње границе овог својства.';
$ec_lang['lpn_cp_key_needed']='Дајте овом прилагођеном својству кључ без размака.';
$ec_lang['lpn_cp_key_taken']='Друго прилагођено својство већ користи тај кључ.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Сценарио';
$ec_lang['lpn_scenario_base']='Основа';
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
$ec_lang['lpn_scenario_overrides']='Бр. својих вредности';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='Ћилибарски прстен значи да овај елемент има вредност која припада само сценарију {name}.';
$ec_lang['lpn_scenario_overrides_tip']='Свака од тих вредности је означена на мапи ћилибарским прстеном. Пређите на {base} да бисте видели цртеж без њих.';
$ec_lang['lpn_scenario_menu']='Сценарији';
$ec_lang['lpn_scenario_tip']='Скуп вредности које цртеж тренутно приказује и које страница тренутно решава. Кликните да промените сценарио, или да га додате, преименујете или обришете.';
$ec_lang['lpn_scenario_new']='Нови сценарио…';
$ec_lang['lpn_scenario_new_name']='Сценарио {n}';
$ec_lang['lpn_scenario_prompt_name']='Назив овог сценарија';
$ec_lang['lpn_scenario_rename']='Преименуј сценарио…';
$ec_lang['lpn_scenario_delete']='Обриши сценарио';
$ec_lang['lpn_scenario_delete_confirm']='Обрисати сценарио {name} и {n} вредности које припадају само њему? Сам цртеж се не мења.';
$ec_lang['lpn_scenario_override']='Само у овом сценарију';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='Означено значи да ова вредност припада само овом сценарију, чак и када је исти број као Основа. Уклоните ознаку да бисте поново користили вредност из Основе.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Основни сценарио: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} је изван мреже у сценарију {scenario}. И даље је на цртежу и у вашим осталим сценаријима.';
$ec_lang['lpn_scenario_push_btn']='Примени вредности из Основе на све сценарије';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='Сваки сценарио се враћа на вредност из Основе за особине чије ознаке су тренутно приказане. Вредности које припадају само тим сценаријима се одбацују.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='Да ли желите да сви сценарији користе вредности из Основе за ове особине? Вредности које припадају само тим сценаријима се одбацују. Ово можете поништити.';
$ec_lang['lpn_scenario_push_scenarios']='Погођени сценарији:';
$ec_lang['lpn_scenario_push_values']='Одбачене вредности:';
$ec_lang['lpn_scenario_push_none']='Ниједан сценарио нема властиту вредност ни за једну од ових особина, па се ништа не би променило. Ништа се не одбацује.';
$ec_lang['lpn_delete_drops_overrides']='Брисање овог елемента такође одбацује {n} вредности које ваши сценарији чувају за њега. Наставити?';
$ec_lang['lpn_push_base_only']='Ова радња мења сам цртеж, па се може извршити само у {base}. Пређите на {base} и покушајте поново.';
$ec_lang['lpn_field_active']='Део ове мреже';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Искључите ову кућицу да бисте оставили елемент на цртежу, али ван мреже: приказује се сиво, а решавач га игнорише. У сценарију се овако предложена цев укључује и искључује.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Експонент прскалице';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='Изложилац у EPANET-овој једначини емитера за прскалице и цурења: проток = коефицијент × притисак степенован овим изложиоцем. Мења резултат само тамо где чвор има емитер, што за сада значи мрежу учитану из EPANET датотеке.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Очитај DEM';
$ec_lang['lpn_elev_dem_sample_tip']='Очитава коту из DEM-а за овај чвор и приказује је испод. Ништа у пољу Кота се не мења. Хоризонтална резолуција DEM-а је око 30 m за већи део Земље, а финија тамо где постоје бољи подаци.';
$ec_lang['lpn_elev_dem_use']='Користи DEM';
$ec_lang['lpn_elev_dem_use_tip']='Уписује коту из DEM-а за овај чвор у поље Кота изнад, замењујући оно што тамо стоји. Прво очитава DEM ако то још није урађено. Једно Опозови враћа претходну вредност.';
$ec_lang['lpn_elev_dem_none']='DEM нема коту за овај чвор.';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM каже {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Извор коте';
$ec_lang['lpn_settings_elev_source_tip']='Одакле нови чвор добија своју коту. Површина терена се очитава из Mapbox DEM-а, који је широк око 30 m на већем делу Земље, а финији тамо где постоје бољи подаци.';
$ec_lang['lpn_settings_elev_source_typed']='Кота уписана изнад';
$ec_lang['lpn_settings_elev_source_dem']='DEM (Mapbox)';
$ec_lang['lpn_settings_accuracy']='Тачност';
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
$ec_lang['lpn_settings_default_is']='Подразумевана вредност је {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='Колико близу решавач мора да дође пре него што стане, мерено количином за коју се протоци још увек мењају од једног покушаја до следећег. Мањи број значи прецизније, али и дуже трајање. Оба решавача читају ово исто поље, а сваки мери ту промену у односу на другачији укупан збир: уграђени решавач у односу на збир потрошњи, EPANET у односу на збир протока у везама. Ако се остави празно, ова страница користи строжу тачност него што је EPANET-ова сопствена подразумевана вредност.';
$ec_lang['lpn_settings_specific_gravity']='Специфична тежина';
$ec_lang['lpn_settings_specific_gravity_tip']='Тежина флуида у поређењу са водом. Мења притисак који би показао манометар, не и протоке.';
$ec_lang['lpn_settings_viscosity']='Релативна вискозност';
$ec_lang['lpn_settings_viscosity_tip']='Вискозност флуида у поређењу са водом на 20 степени Целзијуса. Мења резултат само код методе Darcy-Weisbach.';
$ec_lang['lpn_settings_trials']='Максималан број покушаја';
$ec_lang['lpn_settings_trials_tip']='Колико покушаја је дозвољено пре него што решавач одустане од мреже која не конвергира.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='Ако не конвергира';
$ec_lang['lpn_settings_unbalanced_tip']='Шта урадити са мрежом која је потрошила своје покушаје и још увек није конвергирала. Дозвољавање додатних покушаја често доводи до конвергенције. Заустављање пријављује последњи покушај онаквим какав јесте, што није решење. Само EPANET решавач чита ово поље. Уграђени решавач се увек зауставља и означава резултат као неконвергиран.';
$ec_lang['lpn_settings_unbalanced_continue']='Дозволи додатне покушаје';
$ec_lang['lpn_settings_unbalanced_stop']='Заустави и пријави последњи покушај';
$ec_lang['lpn_settings_unbalanced_trials']='Додатни покушаји пре пријављивања';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Колико још покушаја дозволити пошто се максимум изнад потроши, пре него што се пријави последњи покушај. Само EPANET решавач чита ово поље.';
$ec_lang['lpn_settings_head_error']='Граница грешке напора';
$ec_lang['lpn_settings_head_error_tip']='Додатни тест који решавач мора да прође пре него што стане: највећа преостала грешка напора у било којој цеви. Нула значи да се овај тест не примењује. Само EPANET решавач чита ово поље.';
$ec_lang['lpn_settings_flow_change']='Граница промене протока';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Додатни тест који решавач мора да прође пре него што стане: највећа промена протока у било којој цеви од једног покушаја до следећег. Нула значи да се овај тест не примењује. Само EPANET решавач чита ово поље.';
$ec_lang['lpn_settings_damp_limit']='Пригушење почиње на';
$ec_lang['lpn_settings_damp_limit_tip']='Тачност при којој решавач почиње да прави мање кораке, што може помоћи мрежи која осцилује да конвергира. Нула значи да решавач никада не пригушује. Само EPANET решавач чита ово поље.';
$ec_lang['lpn_settings_option_unset']='Није наведено';
$ec_lang['lpn_settings_demand_multiplier']='Множилац потрошње';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Један фактор који се примењује на сваку потрошњу у мрежи одједном. Користите га да бисте испитали шта систем ради при потрошњи већој или мањој од данашње. Не мења бројеве које сте укуцали. Сценарио може имати сопствени, тако да просечан дан, максималан дан и врхунски час имају по један број; оставите празно у сценарију да би се користио множилац пројекта.';
$ec_lang['lpn_settings_engine_native']='Реши помоћу EPANET решавача';
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
$ec_lang['lpn_settings_engine_native_tip']='Покреће EPANET решавач америчке агенције EPA, овде у вашем прегледачу. За мрежу ове величине нећете приметити разлику у брзини. Оба решавача се слажу веома блиско, али не потпуно тачно: EPANET заокружује вредност коју користи за гравитацију, па су његови локални губици за око 0,08% нижи него код уграђеног решавача, а са Манинговом храпавошћу његов губитак напора испада за око 0,6% нижи. При првом укључивању ове опције преузима се око 650 KB, који потом остаје сачуван на овом уређају.';
$ec_lang['lpn_engine_loading']='Учитавање EPANET решавача…';
$ec_lang['lpn_engine_failed']='EPANET решавач није могао да се учита. Приказан је уграђени решавач уместо њега.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='Решено помоћу EPANET решавача, јер се ови вентили сами отварају и затварају:';
$ec_lang['lpn_unit_unknown']='Овај цртеж наводи јединицу коју ова страница не нуди: {unit}. Све је сачувано и приказано тачно онако како је унето, и ништа није промењено. Одговори не могу да се дају док ова страница не препозна ту јединицу, јер не постоји начин да се утврди колика је.';
$ec_lang['lpn_engine_manning_note']='Напомена: са Манинговом храпавошћу, EPANET израчунава губитак напора за око 0,6% нижи него уграђени решавач.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='EPANET решавач није прихватио ову мрежу, па се прорачун није покренуо.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='EPANET решавач је рекао: {message}';
$ec_lang['lpn_engine_refused_fallback']='Бројеви на екрану потичу од уграђеног решавача уместо тога.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='Бројеви на екрану потичу од уграђеног решавача уместо тога. Он рачуна један тренутак одједном, па је ово мрежа само у тренутку {time}, при чему сваки тенк и даље стоји на почетном нивоу.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Ове контроле именују елемент који више није у овом пројекту, па су изостављене: {ids}';
$ec_lang['lpn_control_unreadable_note']='Ове контроле нису могле да се прочитају, па су изостављене: {ids}';
$ec_lang['lpn_rule_dangling_note']='Ова правила упућују на елемент кога више нема у овом пројекту, па су занемарена у овом прорачуну: {ids}';
$ec_lang['lpn_rule_unreadable_note']='Ова правила нису могла да се прочитају, па су занемарена у овом прорачуну: {ids}';
$ec_lang['lpn_settings_text_size']='Величина текста (пиксели)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Величина симбола (пиксели)';
$ec_lang['lpn_settings_link_width']='Дебљина линије цеви (пиксели)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Стрелице смера протока';
$ec_lang['lpn_settings_show_arrows_tip']='Исцртава стрелицу на свакој цеви која показује на коју страну вода тече. Стрелице се појављују после израчунавања, а њихово искључивање не мења резултате. Ово подешавање се чува уз пројекат.';
$ec_lang['lpn_settings_align_labels']='Поравнај ознаке цеви са цевима';
$ec_lang['lpn_settings_readability_bias']='Окрени ознаку наопако када се нагне више од овог броја степени лево од вертикале';
$ec_lang['lpn_settings_readability_bias_tip']='Окреће ознаку да остане усправна када се нагне више од овог броја степени лево од вертикале.';
$ec_lang['lpn_settings_mask_labels']='Пуна позадина иза ознака';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Прицепи линије ознаке на задате углове';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_leader_snap_tip']='Када превучете ознаку даље од онога што именује, линија ка њему се прицепи на најближи од задатих углова ако превучете близу неког од њих. Наставите да превлачите и прицепљивање попушта, тако да остаје доступан сваки угао. Искључено превлачи слободно, што је ова страница увек радила.';
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Прикажи ознаке када је мапа зумирана на ову ширину или мање';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Ознаке се исцртавају само док је приказ мапе овако широк или ужи. Оставите поље празно да их исцртавате на сваком зуму. Упишите 0 да никада не исцртавате ознаку, на било ком зуму.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Увек прикажи';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap']='Спречи чворове да се увећају преко';
$ec_lang['lpn_settings_symbol_cap_mid']='пута дужине';
$ec_lang['lpn_settings_symbol_cap_post']='перцентилне цеви';
$ec_lang['lpn_settings_symbol_cap_tip']='Чвор престаје да расте на терену чим би његов пречник био овај број пута већи од дужине цеви на овом перцентилу свих дужина цеви у мрежи. Изнад те тачке на мапи, чворови, цеви и остали симболи се смањују на екрану док зумирате ка споља, уместо да расту на терену. Резервоари и тенкови су изузетак и задржавају своју величину на екрану при сваком зуму.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Непрозирност симбола (0 до 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Непрозирност позадинске слике (0 до 1)';
$ec_lang['lpn_settings_map_display']='Изглед мапе';
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
$ec_lang['lpn_settings_legend_position']='Положај легенде ознака';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='Ништа';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Искључено';
$ec_lang['lpn_settings_legend_top_left']='Горе лево';
$ec_lang['lpn_settings_legend_top_right']='Горе десно';
$ec_lang['lpn_settings_legend_middle_left']='Средина лево';
$ec_lang['lpn_settings_legend_middle_right']='Средина десно';
$ec_lang['lpn_settings_legend_bottom_left']='Доле лево';
$ec_lang['lpn_settings_legend_bottom_right']='Доле десно';
$ec_lang['lpn_settings_color_node_field']='Боја чвора';
$ec_lang['lpn_settings_color_link_field']='Боја цеви';
$ec_lang['lpn_settings_color_ramp']='Шема боја';
$ec_lang['lpn_settings_color_credits']='Заслуге';
$ec_lang['lpn_color_ramp_epanet']='Плава до црвена (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='Љубичаста до жута (лакше разликовање суседних боја)';
$ec_lang['lpn_color_ramp_gray']='Светло до тамно сива';
$ec_lang['lpn_settings_color_reverse']='Обрни редослед боја';
$ec_lang['lpn_color_none']='Без боје';
$ec_lang['lpn_settings_color_key_position']='Положај легенде боја';
$ec_lang['lpn_settings_color_breaks']='Границе опсега боја';
$ec_lang['lpn_settings_color_equal_intervals']='Једнаки интервали';
$ec_lang['lpn_settings_color_equal_counts']='Једнак број вредности';
$ec_lang['lpn_settings_color_no_values']='Још нема вредности за рад. Прво решите мрежу.';
$ec_lang['lpn_confirm_restore_defaults']='Ресетовати сва подешавања (префиксе ID-а, почетне вредности, подешавања решавача, изглед мапе, положај легенде и видљиве ознаке) на њихове изворне вредности? Ваша мрежа се не мења. Подешавања припадају отвореном пројекту, па ваши други пројекти задржавају своја.';
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
$ec_lang['lpn_settings_wipe_btn']='Обриши све на овој страници';
$ec_lang['lpn_confirm_wipe']='Обрисати БАШ СВЕ сачувано за ову страницу — сваки пројекат, сваку позадинску слику, сва подешавања и ваш избор јединица — и поново учитати страницу онако како је нови посетилац први пут види? Ово се не може поништити.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Копирајте овај линк:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Време';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Укупно време рада';
$ec_lang['lpn_time_hyd_step']='Хидраулички временски корак';
$ec_lang['lpn_time_pattern_step']='Временски корак обрасца';
$ec_lang['lpn_time_pattern_start']='Почетно време обрасца';
$ec_lang['lpn_time_report_step']='Временски корак извештаја';
$ec_lang['lpn_time_report_start']='Почетно време извештаја';
$ec_lang['lpn_time_clock_start']='Време на сату на почетку';
$ec_lang['lpn_time_clock_day']='Дан {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Упишите време као часове и минуте, на пример 2:30. Обичан број значи часове, тако да 8 значи осам часова. Пола сата је 0:30.';
$ec_lang['lpn_time_running']='Обрада симулације током продуженог периода помоћу EPANET решавача.';
$ec_lang['lpn_time_no_engine']='Уграђени решавач израчунава један тренутак истовремено, па је ово мрежа само у тренутку {time}: сваки образац се чита у том тренутку, а сваки тенк и даље стоји на свом почетном нивоу уместо да се пуни и празни. Повежите се једном на интернет да бисте преузели EPANET решавач, који покреће симулацију током продуженог периода.';
$ec_lang['lpn_time_slider']='Време';
$ec_lang['lpn_time_no_period']='Овај пројекат нема постављену симулацију током продуженог периода, па постоји само један тренутак за приказ. Поставите Укупно време рада у Подешавања, Прорачун, Време да бисте покренули симулацију током продуженог периода.';
$ec_lang['lpn_time_first']='Иди на почетак';
$ec_lang['lpn_time_prev']='Корак уназад';
$ec_lang['lpn_time_play']='Пусти';
$ec_lang['lpn_time_play_tip']='Покрени анимацију';
$ec_lang['lpn_time_pause_tip']='Паузирај анимацију';
$ec_lang['lpn_time_pause']='Паузирај';
$ec_lang['lpn_time_next']='Корак унапред';
$ec_lang['lpn_time_last']='Иди на крај';
$ec_lang['lpn_time_tank']='Танк';
$ec_lang['lpn_time_level']='Ниво воде';
$ec_lang['lpn_time_run']='Израчунај';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Реши ову мрежу у сваком хидрауличком временском кораку, од почетка прорачуна до његовог краја.';
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
$ec_lang['lpn_time_run_done']='Прорачун је завршен. Извештајна времена: {frames}. Утрошено време: {secs} s.';
$ec_lang['lpn_time_runbox_hide']='Не приказуј овај прозор поново';
$ec_lang['lpn_settings_runbox']='Прикажи прозор напретка прорачуна';
$ec_lang['lpn_settings_runbox_tip']='Прозор који извештава колико је прорачун одмакао и шта је пронашао. Када је искључен, завршен прорачун исту поруку приказује у статусној линији на неколико секунди уместо тога. Ово је подешавање за овај прегледач, а не за пројекат.';
$ec_lang['lpn_time_run_failed']='Прорачун се није завршио, па нема резултата за касније тренутке.';
$ec_lang['lpn_time_run_report']='EPANET извештај о прорачуну';
$ec_lang['lpn_time_run_report_copy']='Копирај';
$ec_lang['lpn_time_run_report_copied']='Копирано';
$ec_lang['lpn_time_run_report_tip']='Оно што је сам EPANET решавач исписао о последњем прорачуну: да ли је конвергирао, и на шта год је упозорио. То је текст самог решавача, не наш.';

$ec_lang['lpn_time_speed']='Брзина';
$ec_lang['lpn_time_speed_tip']='Колико брзо се пушта снимак.';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_menu_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Претражи подешавања';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Упишите реч да видите само подешавања која је помињу. Претражују се и објашњења, не само називи.';
$ec_lang['lpn_settings_no_match']='Ниједно подешавање не помиње ту реч.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Ширина списка одељка Подешавања';
$ec_lang['lpn_rpane_empty']='Овде још ништа није прикачено. Све што припада целом пројекту налази се у Подешавањима.';
$ec_lang['lpn_time_settings_open']='Подешавања времена';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='Визуелизација';
$ec_lang['lpn_settings_sec_map']='Мапа и страница';
$ec_lang['lpn_settings_sec_assets']='Подразумеване вредности за нове елементе';
$ec_lang['lpn_settings_sec_calculation']='Прорачун';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Потрошач';
$ec_lang['lpn_labels_customer_note']='Ознака потрошача приказује овде означене вредности. Исцртава се истом величином текста као свака друга ознака на мапи.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Ознаке потрошача се исцртавају само док је приказ мапе овако широк или ужи. Оставите поље празно да их исцртавате на сваком зуму. Упишите 0 да никада не исцртавате ознаку потрошача, на било ком зуму. Ово нема ефекта ако је веће од сличног подешавања за све ознаке.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Користи тренутни приказ';
$ec_lang['lpn_settings_page']='Страница';
$ec_lang['lpn_settings_page_note']='Сачувано у овом калкулатору, не у пројекту.';
$ec_lang['lpn_settings_hydraulics']='Хидраулика';
$ec_lang['lpn_settings_quality']='Квалитет воде';
$ec_lang['lpn_settings_quality_track']='Параметар квалитета';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Изаберите шта прорачун треба да прати кроз цеви: колико дуго је вода у систему, одакле потиче, или хемикалију која реагује док путује. Само хемикалија захтева коефицијенте.';
$ec_lang['lpn_settings_quality_source']='Чвор праћења';
$ec_lang['lpn_settings_quality_source_tip']='Чвор чија се вода прати. Сваки други чвор затим показује удео своје воде који потиче из тог чвора.';
$ec_lang['lpn_quality_none']='Ништа';
$ec_lang['lpn_quality_age']='Старост воде';
$ec_lang['lpn_quality_trace']='Праћење извора';
$ec_lang['lpn_quality_chemical']='Хемикалија која реагује';
$ec_lang['lpn_quality_needs_run']='Квалитет воде се преноси дуж цеви док вода путује, па је потребна симулација током продуженог периода: EPANET решавач и укупно време рада. Поставите Укупно време рада под Време, а затим притисните дугме Израчунај.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Хемикалија и јединице';
$ec_lang['lpn_quality_chemical_name_tip']='Назив хемикалије и јединице у којима су уписане њене концентрације: на пример, упишите Хлор mg/L као један унос. Ово је ознака. EPANET не претвара концентрацију, па свака концентрација и сваки коефицијент у пројекту већ морају бити уписани у овим јединицама.';
$ec_lang['lpn_quality_mass_units']='Јединице масе';
$ec_lang['lpn_quality_mass_units_tip']='Јединички део уноса квалитета, EPANET-ова сопствена два избора.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Толеранција квалитета';
$ec_lang['lpn_quality_tolerance_tip']='Колико се две суседне честице воде смеју разликовати по концентрацији пре него што их EPANET третира као једну. Празно поље користи EPANET-ову сопствену подразумевану вредност 0,01.';
$ec_lang['lpn_quality_diffusivity']='Релативна дифузивност';
$ec_lang['lpn_quality_diffusivity_tip']='Колико лако се хемикалија шири кроз воду, у односу на хлор. Празно поље користи EPANET-ову сопствену подразумевану вредност 1,0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='Концентрација {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Просечна концентрација {chemical}';
$ec_lang['lpn_quality_initial']='Почетни квалитет';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Колико хемикалије овај чвор садржи када прорачун почне. Резервоар чува своју вредност током целог прорачуна, што је уобичајен начин да се искаже резидуал који напушта постројење за пречишћавање. Оставите празно и чвор почиње без хемикалије.';
$ec_lang['lpn_result_concentration']='Концентрација';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Колико хемикалије је остало у овој тачки пошто је путовала и реаговала. Јединице су оне наведене уз хемикалију под Подешавања, Квалитет воде.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Врста извора';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='Каква доза овај чвор примењује на воду која кроз њега пролази. Концентрација третира воду која овде улази у мрежу као да стиже на вредност Квалитет извора. Појачивач масе додаје масу хемикалије сваког минута, без обзира на проток. Појачивач задате вредности подиже концентрацију која напушта овај чвор до вредности Квалитет извора и не даље. Појачивач сразмеран протоку додаје вредност Квалитет извора ономе што је већ у води.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='Ништа';
$ec_lang['lpn_source_type_concen']='Концентрација';
$ec_lang['lpn_source_type_mass']='Појачивач масе';
$ec_lang['lpn_source_type_setpoint']='Појачивач задате вредности';
$ec_lang['lpn_source_type_flowpaced']='Појачивач сразмеран протоку';
$ec_lang['lpn_source_quality']='Квалитет извора';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='Колико је доза јака. За сваку врсту осим појачивача масе ово је концентрација, у јединицама наведеним уз хемикалију под Подешавања, Квалитет воде; за појачивач масе то је маса хемикалије по минуту. Оставите празно и овде се ништа не додаје, што није исто што и нула: нула је довод који ради и не додаје ништа.';
$ec_lang['lpn_source_pattern']='Образац извора';
$ec_lang['lpn_source_pattern_tip']='Временски образац који сразмерно мења дозу током прорачуна, за довод који није константан. Без обрасца доза је иста у сваком кораку.';
$ec_lang['lpn_mixing_model']='Модел мешања';
$ec_lang['lpn_mixing_model_tip']='Како се вода која је већ у овом тенку меша са водом која долази. Потпуно мешање одмах промеша цео тенк. Мешање са две коморе прво пуни улазну зону, а остатак прослеђује даље. FIFO клипни ток помера воду редоследом којим је стигла. LIFO клипни ток је слаже, па је последња вода која уђе прва која изађе. Избор мења старост воде и резидуал, а не мења ниједан притисак или проток.';
$ec_lang['lpn_mixing_mixed']='Потпуно мешање';
$ec_lang['lpn_mixing_2comp']='Мешање са две коморе';
$ec_lang['lpn_mixing_fifo']='FIFO клипни ток';
$ec_lang['lpn_mixing_lifo']='LIFO клипни ток';
$ec_lang['lpn_mixing_fraction']='Удео мешања';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='Удео запремине тенка који заузима улазна зона, између 0 и 1. Користи га само мешање са две коморе. Оставите празно и цео тенк је улазна зона, што EPANET подразумева.';
$ec_lang['lpn_reaction_bulk']='Коефицијент реакције у маси';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Реакција у самој маси воде, коришћена за сваку цев која нема сопствену. Негативан број разграђује хемикалију, а позитиван је повећава. Реакција је првог реда осим ако увезена EPANET датотека не наведе други ред, па је коефицијент брзина у 1/дан. Празно поље значи без реакције у маси.';
$ec_lang['lpn_reaction_wall']='Коефицијент реакције на зиду';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Реакција на зиду цеви, коришћена за сваку цев која нема сопствену. Негативан број разграђује хемикалију. Реакција је првог реда осим ако увезена EPANET датотека не наведе други ред, па је коефицијент дужина по дану, уписана у пројектној јединици дужине. Празно поље значи без реакције на зиду.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Ова цев сама за себе. Оставите празно и цев користи коефицијент постављен за целу мрежу под Подешавања, Квалитет воде.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Коефицијент реакције';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Реакција у води коју садржи овај тенк, као брзина у 1/дан. Негативан број разграђује хемикалију, а позитиван је повећава. Вода стоји у тенку много дуже него у било којој цеви, па се управо ту резидуал најчешће губи. Оставите празно и тенк користи коефицијент реакције у маси постављен за целу мрежу под Подешавања, Квалитет воде.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Реакција у маси';
$ec_lang['lpn_reaction_wall_short']='Реакција на зиду';
$ec_lang['lpn_reaction_tank_short']='Реакција';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/дан';
$ec_lang['lpn_reaction_day']='дан';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Ред реакције у маси';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='Изложилац на који се подиже концентрација за реакцију у маси воде. Дозвољен је сваки реалан број. 1 је подразумевана вредност и користи се за већину моделовања распадања хлора. 0 чини брзину независном од тога колико хемикалије има.';
$ec_lang['lpn_reaction_order_tank']='Ред реакције у тенку';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='Изложилац на који се подиже концентрација за реакцију у води коју држи тенк, одвојено од реда реакције у маси, тако да тенк може да реагује по другом реду него цеви. Дозвољен је сваки реалан број, а 1 је подразумевана вредност. EPANET то у датотеци наводи као ORDER TANK и не нуди поље за то у сопственом интерфејсу.';
$ec_lang['lpn_reaction_order_wall']='Ред реакције на зиду';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 значи да до реакције на зиду долази према датом коефицијенту (коефицијентима). 0 значи да не долази. Ово је прекидач укључено/искључено. Подразумевана вредност је 1.';
$ec_lang['lpn_reaction_order_unstated']='Није наведено';
$ec_lang['lpn_reaction_order_zero']='0, нулти ред';
$ec_lang['lpn_reaction_order_first']='1, први ред';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Гранични потенцијал';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='Концентрација ка којој се хемикалија креће уместо да се распада до нуле или расте без краја. Реакција успорава како се вода приближава овој вредности и тамо се зауставља. Користите доследне јединице. Без ограничења ако је празно.';
$ec_lang['lpn_reaction_rough_corr']='Корелација храпавости';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Повезује реакцију на зиду са храпавошћу сваке појединачне цеви, тако да храпавија цев реагује брже. Када је ово подешено, коефицијент зида се израчунава за сваку цев на основу храпавости те цеви, а јединствени коефицијент зида изнад се више не користи. Не користи се ако је празно.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='Ова страница не нуди сопствени коефицијент реакције. Не постоји стандардни тест за њега, а објављене теренске вредности за исту врсту воде разликују се и до десет пута, па би број понуђен овде био схваћен као препорука. Унесите вредност коју сте измерили или можете навести као извор, или оставите поља празна за хемикалију која не реагује.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Енергија';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Извештаји';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_menu_tip']='Готови одговори које ова страница даје пошто је мрежа израчуната: колико коштају пумпе, како се пореде сценарији и шта је сам EPANET решавач исписао.';
$ec_lang['lpn_reports_epanet']='EPANET прорачун';
$ec_lang['lpn_energy_title']='Извештај о енергији пумпи';
$ec_lang['lpn_energy_menu']='Енергија пумпи';
$ec_lang['lpn_energy_menu_tip']='Колики удео прорачуна је свака пумпа радила, коју снагу је трошила и колико је то коштало током последње симулације током продуженог периода.';
$ec_lang['lpn_energy_efficiency']='Ефикасност пумпе (проценат)';
$ec_lang['lpn_energy_efficiency_tip']='Укупна ефикасност од струје до воде коришћена за сваку пумпу која нема сопствену криву ефикасности. EPANET користи 75 процената када ништа није наведено.';
$ec_lang['lpn_energy_price']='Цена електричне енергије';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Колико кошта један киловат-сат. Примењује се на сваку пумпу која нема сопствену цену. Оставите празно и сваки трошак у извештају је нула.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Колико киловат-сат кошта на овој пумпи. Оставите празно и пумпа плаћа цену постављену за целу мрежу под Подешавања, Енергија.';
$ec_lang['lpn_energy_price_pattern']='Образац цене';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Образац који множи цену у сваком кораку обрасца, чиме се наводи нижа тарифа ван врхунца потрошње. Оставите празно за једну цену током целог прорачуна.';
$ec_lang['lpn_energy_demand_charge']='Накнада за врхунску потрошњу';
$ec_lang['lpn_energy_demand_charge_tip']='Колико комунално предузеће наплаћује по kW за врхунско оптерећење које траже пумпе у систему.';
$ec_lang['lpn_energy_currency']='Валута';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Шта год овде упишете исписује се уз сваки новчани износ. Ово је ознака. Цене и трошкови се никада не претварају, па цене упишите у валути коју сте овде навели.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='Ова страница не нуди сопствену цену. Цена електричне енергије зависи од комуналног предузећа, државе, часа и године, па би број понуђен овде био схваћен као препорука. Унесите цену из сопствене тарифе.';
$ec_lang['lpn_energy_needs_run']='Енергија пумпи је снага интегрисана током прорачуна, па је потребна симулација током продуженог периода: EPANET решавач и укупно време рада. Поставите Укупно време рада у Подешавања, Прорачун, Време, притисните дугме Израчунај, а затим отворите Вода, Извештаји, Енергија пумпи.';
$ec_lang['lpn_energy_no_pumps']='Ова мрежа нема пумпи, па нема ништа што троши снагу.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Поређење сценарија';
$ec_lang['lpn_scncmp_menu_tip']='Реши сваки сценарио у овом пројекту и упореди их један поред другог: најнижи притисак и највећу брзину у сваком.';
$ec_lang['lpn_scncmp_running']='Решавање сваког сценарија…';
$ec_lang['lpn_scncmp_empty']='Још ништа није нацртано, па нема шта да се реши.';
$ec_lang['lpn_scncmp_col_minpressure']='Најнижи притисак';
$ec_lang['lpn_scncmp_col_maxvelocity']='Највећа брзина';
$ec_lang['lpn_scncmp_at']='{value} код {id}';
$ec_lang['lpn_scncmp_current']='(тренутно отворен)';
$ec_lang['lpn_scncmp_note']='Сваки сценарио се решава из копије цртежа. Ништа овде не мења пројекат, а сценарио у коме радите остаје какав је био.';
$ec_lang['lpn_energy_over']='За симулацију током продуженог периода од {time}';
$ec_lang['lpn_energy_col_pump']='Пумпа';
$ec_lang['lpn_energy_col_running']='% прорачуна';
$ec_lang['lpn_energy_col_effic']='Ефик.';
$ec_lang['lpn_energy_col_avg_kw']='Просеч. kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='Просечна снага коришћена док је ова пумпа радила. Не усредњава се током периода мировања, па пумпа која је мировала већи део симулације ипак пријављује снагу коју је трошила док је радила.';
$ec_lang['lpn_energy_col_peak_kw']='Врхунска kW';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='Трошак';
$ec_lang['lpn_energy_total_kwh']='Утрошена енергија';
$ec_lang['lpn_energy_total_energy_cost']='Трошак енергије';
$ec_lang['lpn_energy_peak_kw']='Врхунска потрошња снаге';
$ec_lang['lpn_energy_total_demand_charge']='Трошак врхунске потрошње';
$ec_lang['lpn_energy_total_cost']='Укупан трошак';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='Стање';
$ec_lang['lpn_reports_status_tip']='Шта се променило током последње симулације продуженог периода, временским редоследом: пумпе и вентили који се отварају или затварају, тенкови који се пуне, празне, напуне или пресуше, и кораци који нису у потпуности конвергирали.';
$ec_lang['lpn_status_title']='Извештај о стању';
$ec_lang['lpn_status_needs_run']='Извештај о стању наводи шта се променило током симулације продуженог периода. Поставите Укупно време рада у Подешавања, Прорачун, Време, притисните Израчунај, а затим отворите Вода, Извештаји, Извештај о стању.';
$ec_lang['lpn_status_empty']='Ништа није променило стање током овог прорачуна.';
$ec_lang['lpn_status_col_time']='Време';
$ec_lang['lpn_status_col_event']='Догађај';
$ec_lang['lpn_status_opened']='{type} {id} отворено';
$ec_lang['lpn_status_closed']='{type} {id} затворено';
$ec_lang['lpn_status_filling']='{type} {id} се пуни';
$ec_lang['lpn_status_emptying']='{type} {id} се празни';
$ec_lang['lpn_status_full']='{type} {id} је пун';
$ec_lang['lpn_status_dry']='{type} {id} је празан';
$ec_lang['lpn_status_no_converge']='Хидраулично решење у овом кораку није у потпуности конвергирало; приказани бројеви су из његове последње итерације.';
$ec_lang['lpn_status_note']='Читано из истог прорачуна продуженог периода као панел Табеле и Пуни извештај. Наведена је само промена, не сваки корак.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Пун';
$ec_lang['lpn_reports_full_tip']='Сваки чвор и свака веза у сваком извештајном временском кораку последњег прорачуна, као једна табела коју можете преузети или одштампати.';
$ec_lang['lpn_full_title']='Пун извештај';
$ec_lang['lpn_full_needs_run']='Пун извештај наводи сваки чвор и сваку везу у сваком извештајном временском кораку. Притисните Израчунај, а затим отворите Вода, Извештаји, Пун извештај.';
$ec_lang['lpn_full_note']='Један ред по чвору или вези по извештајном временском кораку, у јединицама приказаним у панелу Табеле. Празна ћелија је колона коју та величина нема. Преузимање или штампа носи сваки временски корак; табела испод приказује један по један.';
$ec_lang['lpn_full_step_label']='Временски корак';
$ec_lang['lpn_full_download_csv']='Преузми CSV';
$ec_lang['lpn_full_print']='Одштампај извештај';
$ec_lang['lpn_full_col_time']='Време';
$ec_lang['lpn_full_col_type']='Тип';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} редова.';
$ec_lang['lpn_energy_no_price']='Није наведена цена електричне енергије, па је сваки трошак овде нула. Поставите је под Подешавања, Енергија.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='Ова мрежа наводи цену нула, па је сваки трошак овде нула. Измените је под Подешавања, Енергија.';
$ec_lang['lpn_energy_curve_note']='Ове пумпе упућују на криву ефикасности без тачака: {ids}. Радиле су на ефикасности постављеној за целу мрежу.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0,000';
$ec_lang['lpn_labels_col_rank']='Ранг';
$ec_lang['lpn_labels_col_drop']='Изостави';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='Чвор и веза';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Једнаки интервали';
$ec_lang['lpn_color_mode_quantile']='Квантил (једнак број)';
$ec_lang['lpn_color_mode_jenks']='Природни прекиди (Jenks)';
$ec_lang['lpn_color_mode_stddev']='Стандардна девијација';
$ec_lang['lpn_color_mode_pretty']='Заокружено (лепи бројеви)';
$ec_lang['lpn_color_mode_log']='Логаритамски';
$ec_lang['lpn_color_mode_pressure']='Притисак';
$ec_lang['lpn_color_mode_manual']='Ручно';

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
$ec_lang['lpn_library_menu']='Библиотеке';
$ec_lang['lpn_library_menu_tip']='Управљајте обрасцима потрошње, кривама пумпи и контролним правилима за овај пројекат.';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='Обрасци';
$ec_lang['lpn_library_patterns_tip']='Образац је списак умножака који се понавља. Сваки важи за један временски корак обрасца, па 24 броја са кораком од једног часа дају дан који се понавља. Потрошња од 10 са умношком од 1,5 је 15 у том тренутку.';
$ec_lang['lpn_library_curves']='Криве';
$ec_lang['lpn_library_curves_tip']='Крива је списак тачака који говори како нешто ради: колики напор пумпа додаје при сваком протоку, колика је њена ефикасност при том протоку, или колики напор вентил губи при сваком протоку.';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Крива припада пројекту, а пумпа или вентил у сопственим својствима наводи ону коју користи. Више елемената може користити исту криву, а измена овде мења све њих. За криву напора пумпе прорачун користи криву уклопљену кроз тачке, као што је приказано; за све остале врсте тачке се повезују правим линијама, као што је приказано.';
$ec_lang['lpn_library_curve_add']='Додај криву';
$ec_lang['lpn_library_curve_type_tip']='Шта ова крива описује';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='Врста криве';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='Једначина';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='Крива уклопљена кроз тачке, и линија нацртана на графикону испод. Израчунава се из тачака сваки пут када се прикаже и никада се не чува, а њени бројеви су у јединицама које показује табела изнад. Уграђени решавач ради на овој једначини; EPANET решавач чита саме тачке.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Изаберите једну или две колоне у табеларном прорачуну, копирајте их и налепите у прву ћелију у коју желите да стигну. Редови се додају по потреби. Можете и налепити редове копиране директно из EPANET датотеке, укључујући назив криве.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='Опис';
$ec_lang['lpn_library_curve_note_tip']='Шта ова крива представља, вашим сопственим речима. Уписује се изнад криве у EPANET датотеци и одатле се поново чита.';
$ec_lang['lpn_library_curve_remove_point']='Уклони ову тачку';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Копирај тачке';
$ec_lang['lpn_library_curve_copy_tip']='Копира сваку тачку као две колоне, спремне за лепљење у табеларни прорачун.';
$ec_lang['lpn_library_curve_copy_manual']='Копирај ове тачке';
$ec_lang['lpn_library_curve_used_by']='Елементи који користе ову криву';
$ec_lang['lpn_library_curve_unused']='Ништа не користи ову криву.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='Ову криву користи {count} елемената: {ids}. Прво их усмерите на другу криву, а затим обришите ову.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Типови цеви';
$ec_lang['lpn_library_pipetypes_tip']='Тип цеви је дефиниција на коју више цеви може да се позове за свој пречник, храпавост и коефицијенте реакције. Измена дефиниције мења сваку цев која је користи.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='Сваки пројекат има сопствену библиотеку типова цеви. Својства у дефиницији типа цеви можете оставити празна. На пример, тип цеви који наводи храпавост а не наводи пречник је у реду. Типове цеви везујете за цеви у уређивачу њихових својстава. Измена дефиниције овде мења сваку цев која се на њу позива.';
$ec_lang['lpn_library_pipetype_add']='Додај тип цеви';
$ec_lang['lpn_library_pipetype_blank_tip']='Празна својства у дефиницији типа цеви остају да се уносе појединачно за сваку цев.';
$ec_lang['lpn_library_pipetype_used_by']='Цеви које користе овај тип';
$ec_lang['lpn_library_pipetype_unused']='Ништа не користи овај тип цеви.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Овај тип цеви користи {count} цеви: {ids}. Одвојите га од њих пре него што га обришете.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Тип цеви';
$ec_lang['lpn_field_pipetype_tip']='Тип цеви из библиотеке пројекта који ова цев користи. Својства укључена у тип цеви овде су онемогућена за уређивање. Одвојите тип цеви да бисте их овде омогућили за уређивање.';
$ec_lang['lpn_pipetype_none']='Није изабран тип цеви';
$ec_lang['lpn_pipetype_detach']='Одвоји од типа цеви';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Копира вредности које ова цев чита из свог типа у саму цев и престаје да користи тај тип. Вредности цеви се сада не мењају, а од сада можете да уређујете ове вредности овде.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Фитинзи';
$ec_lang['lpn_library_fittings_tip']='Списак фитинга је скуп фитинга и њихових количина на који више цеви може да се позове. Он се сабира у један коефицијент локалног (минорног) губитка.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Сваки пројекат има сопствену библиотеку фитинга. Списак фитинга садржи фитинге са количином за сваки, и сабира се у јединствени коефицијент локалног (минорног) губитка. И цеви и типови цеви могу да се позову на списак.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='Фитинзи понуђени овде су оних тринаест из Табеле 3.3 корисничког упутства EPANET 2.2. Избором једног копира се његов коефицијент у ред, где можете да га промените. Коефицијент зависи од величине и произвођача фитинга, па табелу третирајте као полазну тачку, а не као готов одговор.';
$ec_lang['lpn_library_fittings_add']='Додај списак фитинга';
$ec_lang['lpn_library_fittings_used_by']='Цеви које користе овај списак фитинга';
$ec_lang['lpn_library_fittings_unused']='Ништа не користи овај списак фитинга.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Овај списак фитинга користи {count} цеви: {ids}. Одвојите га од њих пре него што га обришете.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Увези библиотеке…';
$ec_lang['lpn_library_import_tip']='Изаберите другу пројектну датотеку и копирајте целе библиотеке из ње у овај пројекат. Све чије је име овде већ заузето се прескаче и наводи, па се ништа што већ имате не мења.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='Изаберите шта да копирате из {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='Свака библиотека коју означите копира се у целини. Обришите касније оно што не желите, на исти начин на који бришете сваки други унос.';
$ec_lang['lpn_library_import_go']='Увези';
$ec_lang['lpn_library_import_no_libraries']='Та пројектна датотека нема библиотека за копирање.';
$ec_lang['lpn_library_import_heading']='Увезено из {file}';
$ec_lang['lpn_library_import_added']='Копирано: {names}';
$ec_lang['lpn_library_import_conflict']='Прескочено, јер овај пројекат већ има нешто истог имена: {names}. Ништа овде није промењено. Преименујте једно од њих и увезите поново ако желите оба.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='Та пројектна датотека нема ништа од овога за копирање.';
$ec_lang['lpn_library_import_curve_shape']='Ове криве су пренете тачно онако како их је датотека записала, а прорачун не може да користи ону чија прва колона не расте од сваке тачке до следеће: {names}';
$ec_lang['lpn_library_import_needs_fittings']='Ови типови цеви упућују на списак фитинга који овај пројекат нема: {names}. Увезите библиотеку фитинга из исте датотеке и они ће је пронаћи.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Упозорење: Јединице се не поклапају. Биће увезено онако како јесте. Није препоручљиво.';
$ec_lang['lpn_library_import_units_line']='{name}: овај пројекат приказује {mine}, датотека приказује {theirs}.';
$ec_lang['lpn_fitting_qty']='Количина';
$ec_lang['lpn_fitting_name']='Фитинг';
$ec_lang['lpn_fitting_k']='Коефицијент';
$ec_lang['lpn_fitting_add']='Додај фитинг';
$ec_lang['lpn_fitting_remove']='Уклони';
$ec_lang['lpn_fitting_total']='Укупни коефицијент локалног (минорног) губитка, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Списак фитинга';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='Списак фитинга из библиотеке пројекта. Његове количине и коефицијенти сабирају се у коефицијент локалног губитка ове цеви, а поље за коефицијент затим је само за читање. Оставите ово неизабрано да бисте сами уписали коефицијент.';
$ec_lang['lpn_fittings_none']='Није изабран списак фитинга';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Вентил са тањирастим затварачем, потпуно отворен';
$ec_lang['lpn_fitting_angle']='Угаони вентил, потпуно отворен';
$ec_lang['lpn_fitting_swingcheck']='Клапни неповратни вентил, потпуно отворен';
$ec_lang['lpn_fitting_gate']='Затварач, потпуно отворен';
$ec_lang['lpn_fitting_elbow_short']='Лук малог радијуса';
$ec_lang['lpn_fitting_elbow_medium']='Лук средњег радијуса';
$ec_lang['lpn_fitting_elbow_long']='Лук великог радијуса';
$ec_lang['lpn_fitting_elbow_45']='Лук од 45 степени';
$ec_lang['lpn_fitting_return_bend']='Затворено повратно колено';
$ec_lang['lpn_fitting_tee_run']='Стандардна рачва, проток кроз главни правац';
$ec_lang['lpn_fitting_tee_branch']='Стандардна рачва, проток кроз огранак';
$ec_lang['lpn_fitting_entrance']='Оштар (правоугаони) улаз';
$ec_lang['lpn_fitting_exit']='Излаз';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Други фитинг';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='Сачувано {file}';
$ec_lang['lpn_inp_export_flat_lead']='Извезена EPANET датотека бројчано је истоветна овом пројекту. Али у њој нема места за следеће ствари:';
$ec_lang['lpn_inp_export_flat_types']='{n} цеви овде се позивају на {t} типова цеви. У датотеци свака од тих цеви носи сопствену копију бројева, тако да су одговори исти. Оно што датотека не може да сачува је сам тип цеви, па измену једне дефиниције и то да је свака цев прати бележи само ваша сопствена пројектна датотека.';
$ec_lang['lpn_inp_export_flat_coords']='EPANET датотека чува једну позицију за сваки чвор. Овај сценарио поставља {n} од њих негде другде, и то су позиције у датотеци. Сваки други сценарио чува своје сопствене позиције само у вашој пројектној датотеци.';
$ec_lang['lpn_inp_export_flat_fittings']='EPANET датотека не може да сачува списак колена, вентила и рачви из ваше пројектне датотеке. Коефицијент локалног губитка за {n} цеви овде сабран је из списка фитинга. Збир улази у датотеку тачно онакав какав јесте, тако да се ништа у вези са одговорима не мења.';
$ec_lang['lpn_library_controls']='Контроле';
$ec_lang['lpn_library_controls_tip']='Контрола је једна реченица која отвара или затвара везу, или јој даје подешавање, када то каже водени ниво, притисак или време.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Додај образац';
$ec_lang['lpn_library_pattern_values']='Умношци';
$ec_lang['lpn_library_pattern_values_tip']='Умношци, раздвојени размацима или зарезима. Налепите колону из табеле ако је имате. Списак се понавља колико год прорачун траје, па не мора да покрије цео прорачун.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} умножака, {step} размака, покрива {span}';
$ec_lang['lpn_library_pattern_none']='Нема обрасца';
$ec_lang['lpn_settings_default_pattern']='Подразумевани образац потрошње';
$ec_lang['lpn_settings_default_pattern_tip']='Сваки чвор без обрасца користи овај.';
$ec_lang['lpn_library_control_add']='Додај контролу';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='Једна реченица, речима које користи EPANET. Четири облика: LINK 9 OPEN IF NODE 2 BELOW 110, LINK 9 CLOSED IF NODE 2 ABOVE 140, LINK 10 OPEN AT TIME 1, и LINK 12 CLOSED AT CLOCKTIME 3 AM. Уместо OPEN или CLOSED можете уписати број, што је подешавање вентила или брзина пумпе. Оставите кључне речи на енглеском; то је оно што страница чита.';
$ec_lang['lpn_library_control_ok']='✓ Разумљиво';
$ec_lang['lpn_library_control_bad']='⚠ Неразумљиво';
$ec_lang['lpn_library_control_missing']='⚠ Ова мрежа нема ништа што се зове {id}';
$ec_lang['lpn_library_rules']='Правила';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='Правило је кратак пасус који отвара или затвара везу, или јој даје подешавање, када ниво воде, притисак, проток или време достигне вредност коју поставите. Правила могу да провере више ствари одједном и могу да наведу шта треба урадити када провера не успе.';
$ec_lang['lpn_library_rule_add']='Додај правило';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Једно правило, речима које користи EPANET, по једна клауза у реду. Први ред га именује: RULE 1. Затим услов: IF TANK 2 LEVEL BELOW 17.1. Затим шта урадити поводом тога: THEN PUMP 9 STATUS IS OPEN. Последњи ред може да му одреди ранг: PRIORITY 1. Додајте AND или OR редове да бисте проверили више ствари, и ELSE редове да наведете шта урадити када провера не успе. Услов може читати LEVEL, HEAD, GRADE, PRESSURE или DEMAND на чвору, FLOW, STATUS или SETTING на вези, или TIME и CLOCKTIME на SYSTEM. Бројеве пишите у јединицама које овај пројекат приказује; они се за вас претварају. Кључне речи оставите на енглеском; њих читају и ова страница и EPANET.';
$ec_lang['lpn_library_rule_ok']='✓ Ово правило је прочитано';
$ec_lang['lpn_library_rule_bad']='⚠ Ово правило није могло да се прочита';
$ec_lang['lpn_library_rule_missing']='⚠ Ова мрежа нема ништа што се зове {id}';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='Основна потрошња';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='Проток који овај чвор узима у приказаном временском кораку: свака основна потрошња помножена сопственим обрасцем, све сабрано. Ово се израчунава, не уписује, па се мења са временом и не може се уређивати.';
$ec_lang['lpn_field_demand_pattern']='Образац потрошње';
$ec_lang['lpn_field_demand_pattern_tip']='Како се потрошња овог чвора повећава и смањује током прорачуна. Оставите на Нема обрасца и чвор ће уместо тога пратити Подразумевани образац потрошње пројекта.';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Опис';
$ec_lang['lpn_field_demand_category_tip']='Назив или опис ове категорије потрошње.';
$ec_lang['lpn_demand_add']='Додај категорију потрошње';
$ec_lang['lpn_demand_add_tip']='Додајте још једну категорију потрошње на овом чвору, са сопственом основном потрошњом, обрасцем и описом. Категорије се сабирају.';
$ec_lang['lpn_demand_remove']='Уклони ову потрошњу';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Образац напора';
$ec_lang['lpn_field_head_pattern_tip']='Како се водени ниво овог резервоара диже и спушта током прорачуна. Напор изнад се множи обрасцем.';
$ec_lang['lpn_field_pump_speed']='Релативна брзина';
$ec_lang['lpn_field_pump_speed_tip']='1 је ова пумпа која ради брзином при којој је измерена њена крива. 0,9 је иста пумпа која ради спорије, што снижава напор који додаје и проток који пропушта. Образац брзине заузима место овог броја док прорачун траје.';
$ec_lang['lpn_field_speed_pattern']='Образац брзине';
$ec_lang['lpn_field_speed_pattern_tip']='Како се брзина ове пумпе диже и спушта током прорачуна. Сваки умножак је релативна брзина за тај део прорачуна и заузима место подешавања Брзина уместо да га скалира, па умножак 0 зауставља пумпу.';

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
$ec_lang['lpn_search_menu']='Тражи место по имену…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Пронађите град, улицу или знаменитост по имену и померите мапу до ње. Прва употреба тражи вашу дозволу, јер речи које укуцате иду сервису OpenStreetMap-а за имена места.';
$ec_lang['lpn_search_bar']='Тражи по имену…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='Претрага по имену места шаље речи које укуцате на nominatim.openstreetmap.org, бесплатни сервис за имена места фондације OpenStreetMap.';
$ec_lang['lpn_search_consent_2']='Ово је други сервис од слика мапе улица иза вашег пројекта. Те слике показују само где гледате. Претрага показује шта сте укуцали. Сервис за имена места ће примити ваше речи за претрагу и вашу IP адресу. Не шаљемо ништа друго, и не чувамо никакав запис ваших претрага.';
$ec_lang['lpn_search_consent_3']='Смемо ли да пошаљемо ваше претраге сервису за имена места?';
$ec_lang['lpn_search_consent_4']='Ако кажете не, све остало на овој страници наставља да ради потпуно исто као сада, укључујући Иди на географску ширину и дужину. Памтимо да сте рекли да, како не бисмо морали поново да питамо. Одговор „не” се уопште не чува.';
$ec_lang['lpn_search_refused']='Претрага по имену места је искључена, и ништа није послато. И даље можете користити Иди на географску ширину и дужину.';
$ec_lang['lpn_search_prompt']='Тражите место по имену. Град, улица, знаменитост — на пример: Petaluma, California';
$ec_lang['lpn_search_empty']='Упишите име места за претрагу.';
$ec_lang['lpn_search_working']='Претрага у току…';
$ec_lang['lpn_search_busy']='Претрага је већ у току. Сачекајте одговор.';
$ec_lang['lpn_search_choose']='Више од једног места одговара. Које?';
$ec_lang['lpn_search_nochoice']='Ништа није изабрано, па се мапа није померила.';
$ec_lang['lpn_search_badchoice']='То није један од бројева на списку.';
$ec_lang['lpn_search_none']='Ништа није пронађено за то име.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='Сервис за имена места тражи да успоримо. Сачекајте минут и покушајте поново.';
$ec_lang['lpn_search_http']='Сервис за имена места је одговорио грешком.';
$ec_lang['lpn_search_timeout']='Сервис за имена места није одговорио на време. Све остало на овој страници ради без њега.';
$ec_lang['lpn_search_unreadable']='Сервис за имена места је одговорио нечим што ова страница није могла да прочита.';
$ec_lang['lpn_search_offline']='Нисмо могли да досегнемо сервис за имена места. Можда сте офлајн. Све остало на овој страници ради без њега, укључујући Иди на географску ширину и дужину.';
$ec_lang['lpn_search_toofast']='Једна претрага у секунди — то је оно што сервис за имена места дозвољава. Покушајте поново за тренутак.';
$ec_lang['lpn_search_nofetch']='Овај прегледач не може да досегне сервис за имена места.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox ово састави из многих јавних скупова података о котама, па квалитет у потпуности зависи од тога где се налазите. Тамо где постоји национално лидар снимање, као што је USGS 3DEP у већем делу Сједињених Држава и његови еквиваленти другде, тачност може бити боља од метра хоризонтално и неколико десетина метра вертикално. Тамо где постоје само глобални подаци, тачност је око 30 m хоризонтално и неколико метара вертикално. Mapbox нам не говори који сте од то двоје добили. Третирајте ово као топографску карту, не као геодетско снимање: проверите све на шта се ослањате.';
$ec_lang['lpn_terrain_consent_1']='Попуњавање кота шаље положај сваког чвора коме је она потребна — његову географску ширину и дужину — на api.mapbox.com, ради очитавања висине терена на том месту.';
$ec_lang['lpn_terrain_consent_2']='Ово је друго питање од слика мапе иза вашег пројекта. Те слике показују само где гледате. Ови положаји су сама ваша мрежа. Mapbox ће примити те координате и вашу IP адресу. Не шаљемо ништа друго: ни назив, ни цеви, ни пројекат. Не чувамо никакав запис о томе, и ништа се не чува на овом уређају осим вашег одговора на ово питање.';
$ec_lang['lpn_terrain_consent_3']='Смемо ли да пошаљемо положаје ваших чворова ка Mapbox-у?';
$ec_lang['lpn_terrain_consent_4']='Ако кажете не, све остало на овој страници наставља да ради потпуно исто као сада, а коте и даље можете уписивати сами као и до сада. Памтимо да сте рекли да, како не бисмо морали поново да питамо. Одговор „не” се уопште не чува.';
$ec_lang['lpn_terrain_refused']='Коте нису попуњене, и ништа није послато. Можете их уписати сами као и до сада.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Попунити коту за {n} чвор(ова) из Mapbox DEM-а?';
$ec_lang['lpn_terrain_confirm_default_1']='Сваки чвор већ има коту, а {n} од њих је још увек на {v}, што је кота коју нови чвор добија на почетку, а не она коју сте уписали.';
$ec_lang['lpn_terrain_confirm_default_2']='Заменити коту тих {n} чворова вредностима из Mapbox DEM-а?';
$ec_lang['lpn_terrain_keep']='{k} чвор(ова) већ има коту и неће бити дирано.';
$ec_lang['lpn_terrain_undo']='Један Опозив (Ctrl-Z) враћа сваки од њих назад.';
$ec_lang['lpn_terrain_requests']='{n} захтев(а) ка api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='Коте се већ попуњавају. Сачекајте да заврше.';
$ec_lang['lpn_terrain_offmap']='Ови положаји чворова нису на мапи терена, па ништа није послато.';
$ec_lang['lpn_terrain_too_wide']='Ови чворови су распршени по превеликом делу Земље да би се очитали одједном ({n} захтева за плочице). Ништа није послато.';
$ec_lang['lpn_terrain_cancelled']='Ништа није промењено и ништа није послато.';
$ec_lang['lpn_terrain_nofetch']='Овај прегледач не може да досегне сервис за терен.';
$ec_lang['lpn_terrain_working']='Читање површине терена…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='Сервис за терен је одбио захтев ({status}), па ниједна кота није промењена. Mapbox токен који овај сајт користи можда не дозвољава веб-адресу на којој се налазите.';
$ec_lang['lpn_terrain_failed']='Нисмо могли да досегнемо сервис за терен, па ниједна кота није промењена. Можда сте офлајн. Све остало на овој страници ради без њега.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='Услуга терена тражи да успоримо (429), па ниједна кота није промењена. Покушајте поново за минут.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='Услуга терена је одговорила грешком ({status}), па ниједна кота није промењена. Ништа није погрешно са вашом мрежом.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='Ниједан од тих чворова нема позицију на Земљи, па ништа није послато и ниједна кота није промењена. Читање површине терена захтева пројекат у географској ширини и дужини, или онај на пројекцији коју ова страница може да постави.';
$ec_lang['lpn_terrain_done']='{n} кота(а) попуњено.';
$ec_lang['lpn_terrain_missed']='{m} није могло да се прочита и остаје празно.';
$ec_lang['lpn_terrain_partial']='{f} плочица(е) терена није одговорило.';
$ec_lang['lpn_terrain_will_ids']='Ови чворови ће добити коту: {ids}';
$ec_lang['lpn_terrain_keep_ids']='Ти чворови су: {ids}';
$ec_lang['lpn_terrain_filled_ids']='Ови чворови су добили коту: {ids}';
$ec_lang['lpn_terrain_blank_ids']='Ови чворови још увек немају коту: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}, и још {n}';

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
$ec_lang['lpn_ff_menu']='Анализа противпожарног протока…';
$ec_lang['lpn_ff_menu_tip']='Тестира чворове један по један: колико сваки може да испоручи уз одржавање резидуалног притиска који сте поставили, и да ли повлачење потребног протока тамо гура нешто друго изван граница?';
$ec_lang['lpn_ff_title']='Анализа противпожарног протока';
$ec_lang['lpn_ff_intro']='Од сваког чвора се редом тражи да повуче противпожарни проток поред потрошње коју већ има. Ништа у вашем пројекту се не мења; цео прорачун се обавља на копији.';
$ec_lang['lpn_ff_scope']='Чворови за тестирање';
$ec_lang['lpn_ff_scope_tip']='Изаберите скуп пре покретања. Тестирање сваког чвора у великом систему може потрајати минутима.';
$ec_lang['lpn_ff_scope_all']='Сваки чвор';
$ec_lang['lpn_ff_scope_selected']='Само изабрани чвор';
$ec_lang['lpn_ff_no_junctions']='Овај пројекат још нема чворова, па нема шта да се тестира.';
$ec_lang['lpn_ff_no_selection']='Ниједан чвор није изабран. Изаберите један на мапи, или тестирајте сваки чвор.';
$ec_lang['lpn_ff_skipped']='{n} изабраних елемената нису чворови, па нису тестирани.';
$ec_lang['lpn_ff_required']='Потребан противпожарни проток';
$ec_lang['lpn_ff_required_tip']='Проток који ваш противпожарни пропис или ваш ватрогасни орган захтева на хидранту. Сваки чвор се тестира према овом броју, осим ако не носи сопствени потребан противпожарни проток.';
$ec_lang['lpn_ff_required_own']='Чворови који носе сопствени потребан противпожарни проток тестирају се према њему уместо тога. Број таквих чворова: {n}.';
$ec_lang['lpn_ff_required_node_tip']='Противпожарни проток потребан на овом конкретном чвору за намену земљишта коју опслужује, према вашем противпожарном пропису или ватрогасном органу. Оставите празно и чвор ће се тестирати према броју у пољу Анализа противпожарног протока.';
$ec_lang['lpn_ff_residual']='Резидуални притисак који треба одржати';
$ec_lang['lpn_ff_residual_tip']='Притисак који чвор мора и даље да одржи док испоручује противпожарни проток. AWWA M31 и NFPA 291 користе 20 psi (140 kPa).';
$ec_lang['lpn_ff_design']='Провера пројекта (утицај на систем)';
$ec_lang['lpn_ff_design_tip']='Ово је одвојено питање од тога да ли чвор може да испоручи проток: када се тамо повуче тај проток, да ли нешто друго падне испод свог минималног притиска или пређе своју граничну брзину? Укључивање ове провере не кошта додатно израчунавање.';
$ec_lang['lpn_ff_design_off']='Не проверавај';
$ec_lang['lpn_ff_design_all']='Сви остали чворови и све цеви';
$ec_lang['lpn_ff_design_selected']='Изабрани чворови и њихове цеви';
$ec_lang['lpn_ff_design_no_selection']='Провера пројекта је постављена на изабране чворове, а ниједан није изабран. Изаберите неке на мапи, или подесите на Све.';
$ec_lang['lpn_ff_minpressure']='Најнижи дозвољени притисак на другим местима';
$ec_lang['lpn_ff_minpressure_tip']='Чвор који падне испод овога док други чвор повлачи свој противпожарни проток пријављује се као проблем у пројекту.';
$ec_lang['lpn_ff_maxvelocity']='Највећа дозвољена брзина';
$ec_lang['lpn_ff_maxvelocity_tip']='Цев која ради изнад овога док се повлачи противпожарни проток пријављује се као проблем у пројекту.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='Противпожарни проток се повлачи на самом чвору. То је метода коришћена овде, и то је уобичајена метода. Хидрант, његова бочна цев и његов млазник нису моделовани, па стварни хидрант испоручује мање него што показује проток приказан овде.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Ово се израчунава уграђеним решавачем.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Ово се израчунава EPANET решавачем.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='Расположиви противпожарни проток је претрага, па се цела мрежа решава око шеснаест пута за сваки тестирани чвор. Велики систем може потрајати минутима. Можете га зауставити у било ком тренутку и задржати оно што је до тада израчунато.';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='Тестира се само временски корак тренутно приказан на екрану. Противпожарни проток се обично тестира поред максималне дневне потрошње, па поставите мрежу у то стање пре покретања.';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='Прорачун противпожарног протока';
$ec_lang['lpn_ff_calculate']='Покрени';
$ec_lang['lpn_ff_stop']='Заустави';
$ec_lang['lpn_ff_working']='У току: {done} од {total} чворова.';
$ec_lang['lpn_ff_stopped']='Заустављено после {done} од {total} чворова. Резултати испод су они који су већ завршени.';
$ec_lang['lpn_ff_cost']='Овај прорачун је решио целу мрежу {solves} пута.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='Цртеж је измењен, па су резултати противпожарног протока обрисани. Покрените поново.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Обриши прстенове';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} чворова није имало проблема. {fire} чворова није прошло тест противпожарног протока. {design} чворова је утицало на остатак система.';
$ec_lang['lpn_ff_summary_error']='{n} чворова није могло да добије резултат.';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Сви тестирани чворови';
$ec_lang['lpn_ff_col_junction']='Чвор';
$ec_lang['lpn_ff_col_static']='Статички притисак';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='Притисак на овом чвору пре него што се повуче било какав противпожарни проток, док уобичајене потрошње система још увек раде. Ништа се не искључује да би се ово измерило, па ово није притисак система при нултом протоку; то је исти притисак који мапа приказује на овом чвору. И AWWA M31 и NFPA 291 називају ово очитавање статичким притиском, и ту почиње тест противпожарног протока.';
$ec_lang['lpn_ff_col_available']='Расположиви проток';
$ec_lang['lpn_ff_col_required']='Потребан проток';
$ec_lang['lpn_ff_col_residual']='Одржани резидуал';
$ec_lang['lpn_ff_col_atrequired']='Притисак при потребном протоку';
$ec_lang['lpn_ff_col_affected']='Најгори ефекат';
$ec_lang['lpn_ff_col_limit']='Пројектна граница';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='Није проверено';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Статички није прошао, па није проверено';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Начини отказа';
$ec_lang['lpn_ff_mode_fire']='Пожар';
$ec_lang['lpn_ff_mode_design']='Пројекат';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='Ништа';
$ec_lang['lpn_ff_col_solves']='Прорачуни';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_pressure']='Притисак';
$ec_lang['lpn_ff_limit_velocity']='Брзина';
$ec_lang['lpn_ff_limit_both']='Притисак и брзина';
$ec_lang['lpn_ff_atleast']='више од {flow}';
$ec_lang['lpn_ff_affect_node']='{id} пада на {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} достиже {velocity}';
$ec_lang['lpn_ff_more']='и још {n} погођених';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='Још {n} чворова није приказано.';
$ec_lang['lpn_ff_design_none']='Ништа у изабраном скупу није прекорачило своје границе док је било који чвор повлачио свој противпожарни проток.';
$ec_lang['lpn_ff_design_off_note']='Утицај на остатак система није проверен у овом прорачуну.';
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
$ec_lang['lpn_ff_iso']='Insurance Services Office (ISO) признаје једном хидранту највише {flow}. То ограничење није примењено овде јер не знамо колико хидраната један чвор може да представља.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Већ испод резидуала пре повлачења било каквог противпожарног протока';
$ec_lang['lpn_ff_err_converge']='Мрежа није конвергирала.';
$ec_lang['lpn_ff_err_solve']='Решавач је пријавио грешку и није дао резултат.';
$ec_lang['lpn_ff_err_not_junction']='Није чвор';
$ec_lang['lpn_ff_err_unknown']='Нема резултата. Пријављен је код {code}.';

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
$ec_lang['lpn_file_import_survey']='Увези снимљене тачке…';
$ec_lang['lpn_file_import_survey_tip']='Прочитајте списак снимљених тачака из текстуалне датотеке и направите по један чвор на свакој тачки, преузимајући подешавања за нове елементе за све што датотека не наводи. Ниједна цев се не црта, а ниједан ред никада није одбачен без именовања. Чита координатни систем који овај пројекат већ користи, геореференциран или не.';
$ec_lang['lpn_survey_read_error']='Та датотека није могла да се прочита са вашег диска.';
$ec_lang['lpn_survey_cancelled']='Ништа није направљено и ништа није промењено.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='Север';
$ec_lang['lpn_survey_axis_east']='Исток';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='Та датотека нема ништа у себи.';
$ec_lang['lpn_survey_err_unreadable']='Та датотека није могла бити прочитана као списак снимљених тачака.';
$ec_lang['lpn_survey_err_ambiguous_coord']='Више од једне колоне у тој датотеци могло би бити {axis} ({detail}), а ова страница неће бирати између њих. Оставите само једну од њих названу као {axis} и покушајте поново.';
$ec_lang['lpn_survey_err_no_points']='Ниједан ред те датотеке није могао бити прочитан као снимљена тачка. Прочитаних редова: {detail}';
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
$ec_lang['lpn_survey_format_label']='Формат датотеке:';
$ec_lang['lpn_survey_format_internal']='наведено интерно';
$ec_lang['lpn_survey_create']='Направи чворове';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='Први ред је прескочен: не именује ниједну колону коју ова страница познаје.';
$ec_lang['lpn_survey_type_label']='Тип елемента:';
$ec_lang['lpn_survey_confirm_junction']='Пронађено {n} чвор(ова). Наставити?';
$ec_lang['lpn_survey_confirm_reservoir']='Пронађено {n} резервоар(а). Наставити?';
$ec_lang['lpn_survey_confirm_tank']='Пронађено {n} тенк(ова). Наставити?';
$ec_lang['lpn_survey_report_junction']='Увезено {n} чвор(ова), {m} са котом.';
$ec_lang['lpn_survey_report_reservoir']='Увезено {n} резервоар(а), {m} са котом.';
$ec_lang['lpn_survey_report_tank']='Увезено {n} тенк(ова), {m} са котом.';
$ec_lang['lpn_survey_report_clean']='Свака тачка из датотеке је пренета, и ништа није промењено на путу.';
$ec_lang['lpn_survey_report_notes']='Грешке и напомене увоза:';
$ec_lang['lpn_survey_sev_error']='грешка';
$ec_lang['lpn_survey_sev_warning']='упозорење';
$ec_lang['lpn_survey_note_line']='Ред {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='Премало колона за горе наведени формат датотеке.';
$ec_lang['lpn_survey_note_coord_missing']='Ћелија {axis} је празна.';
$ec_lang['lpn_survey_note_bad_coord']='{axis} се не чита као број.';
$ec_lang['lpn_survey_note_coord_range']='{axis} је изван опсега који овај пројекат дозвољава.';
$ec_lang['lpn_survey_note_bad_elev']='Ненумеричка кота. Увезено без коте.';
$ec_lang['lpn_survey_note_ambiguous_elev']='Више од једне колоне могло би бити кота, па ниједна од њих није прочитана.';
$ec_lang['lpn_survey_note_blank_rows']='Прескочени празни редови: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Име је већ коришћено раније у овој датотеци, додељено је ново име.';
$ec_lang['lpn_survey_note_id_taken']='Име је већ у пројекту, додељено је ново име.';
$ec_lang['lpn_survey_note_id_invalid']='Име не може да се користи овде, додељено је ново име.';
